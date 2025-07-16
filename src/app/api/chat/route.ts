import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import embeddings from "@/lib/HuggingFace";
import { CoreMessage } from "ai";
import { InferenceClient } from "@huggingface/inference";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prisma";

// The main handler for the POST request
export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API Route started");

    // 1. Authenticate the user
    const user = await currentUser();
    if (!user?.id) {
      console.error("❌ Unauthorized - no user found or user ID is missing");
      return new Response("Unauthorized", { status: 401 });
    }
    console.log("👤 User authenticated:", user.id);

    // 2. Parse and validate the request body
    const { messages, fileKey }: { messages: CoreMessage[]; fileKey: string } =
      await request.json();

    if (!fileKey) {
      console.error("❌ Bad Request - no fileKey provided");
      return new Response("fileKey is required", { status: 400 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ Bad Request - no messages provided");
      return new Response("Messages are required", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    if (typeof query !== "string" || !query) {
      console.error("❌ Bad Request - no query content in the last message");
      return new Response("Query content is required", { status: 400 });
    }
    console.log("🔍 User Query:", query);

    // 3. Handle simple greetings without calling the LLM or database (Optimization)
    if (query.toLowerCase().trim() === "hello") {
      console.log("👋 Handling simple greeting");
      const greetingResponse =
        "Hello! I'm here to help you with questions about your document. What would you like to know?";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          // AI SDK expects data in this format
          controller.enqueue(encoder.encode(`0:"${greetingResponse}"\n`));
          controller.close();
        },
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // 4. For all other queries, proceed with the RAG (Retrieval-Augmented Generation) pipeline
    console.log("🧠 Starting RAG pipeline...");

    // Initialize Pinecone client and get the index
    const pinecone = new Pinecone();
    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
      throw new Error("PINECONE_INDEX_NAME environment variable is not set.");
    }
    const index = pinecone.Index(indexName);
    console.log("🔗 Connecting to Pinecone index:", indexName);

    // Create a vector store from the existing Pinecone index
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: fileKey,
    });
    console.log("✅ Vector store connected for namespace:", fileKey);

    // Perform a similarity search to find relevant document chunks
    console.log("🔍 Performing similarity search...");
    const relevantDocs = await vectorStore.similaritySearch(query, 4);
    console.log("✅ Found relevant documents:", relevantDocs.length);

    // Create the context string from the relevant documents
    const context = relevantDocs
      .map(
        (doc, index) =>
          `--- Document Snippet ${index + 1} ---\n${doc.pageContent}`
      )
      .join("\n\n");

    // 5. Construct the final prompt for the language model
    const systemPrompt = `You are an expert AI assistant tasked with answering questions about a specific document.
- Use the provided "CONTEXT FROM DOCUMENT" below to answer the user's question.
- Your answer must be based solely on the information within the provided context.
- If the context does not contain the answer, you must state clearly that the document does not provide information on that topic. Do not use outside knowledge.
- Be concise, clear, and thorough in your explanation.

CONTEXT FROM DOCUMENT:
${context}`;

    // 6. Generate and stream the response from the language model
    console.log("🎯 Generating response using streamText...");
    // Combine the system prompt with the existing conversation history
    const formattedMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];
    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);
    const customStream = new ReadableStream({
      async start(controller) {
        let fullResponse = "";

        try {
          const stream = hf.chatCompletionStream({
            model: "meta-llama/Meta-Llama-3-8B-Instruct",
            messages: formattedMessages,
            max_tokens: 800,
            temperature: 0.7,
            top_p: 0.9,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
              controller.enqueue(new TextEncoder().encode(content));
            }
          }

          if (fullResponse) {
            console.log("✅ Full response received:", fullResponse);
            // await saveMessage(documentId, "assistant", fullResponse, user.id);
          }

          controller.close();
        } catch (error) {
          console.error("❌ Stream processing error:", error);
          controller.error(error);
        }
      },
    });

    console.log("📤 Returning streaming response");

    return new Response(customStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("❌ API Route Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { error: "Internal Server Error", message: errorMessage },
      { status: 500 }
    );
  }
}
async function saveMessage(
  documentId: string,
  role: "user" | "assistant",
  content: string,
  userId: string
) {
  try {
    const document = await prismadb.document.update({
      where: {
        id: documentId,
        userId,
      },
      data: {
        messages: {
          create: {
            content,
            role,
          },
        },
      },
    });
    console.log(`✅ Saved ${role} message for document ${documentId}`);
    return document;
  } catch (error) {
    console.error("❌ Error saving message:", error);
    throw error;
  }
}
