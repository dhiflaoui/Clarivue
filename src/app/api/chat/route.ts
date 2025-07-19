import { NextRequest } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import embeddings from "@/lib/HuggingFace";
import { StreamingTextResponse, LangChainStream, Message } from "ai"; // Import Message type
import { InferenceClient } from "@huggingface/inference";
import { currentUser } from "@clerk/nextjs/server";
import prismadb from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API Route started");

    const user = await currentUser();
    console.log("👤 User:", user?.id);

    if (!user) {
      console.error("❌ Unauthorized - no user found");
      return new Response("Unauthorized", { status: 401 });
    }

    const { messages, fileKey, documentId, type } = await request.json();
    console.log("type doc", type);
    console.log("📄 Document ID:", documentId);
    console.log("🔑 File Key:", fileKey);
    console.log("💬 Messages:", messages);

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ No messages provided");
      return new Response("Messages are required", { status: 400 });
    }

    if (!fileKey) {
      console.error("❌ No fileKey provided");
      return new Response("FileKey is required", { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;
    console.log("🔍 Query:", query);
    if (type === "default")
      await saveMessage(documentId, "user", query, user.id);

    if (!query) {
      console.error("❌ No query content found");
      return new Response("Query content is required", { status: 400 });
    }

    // You can keep your "hello" handling logic as is
    if (query.toLowerCase().trim() === "hello") {
      // ... your existing greeting logic ...
      const greetingResponse =
        "Hello! I'm here to help you with questions about your document. What would you like to know?";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(greetingResponse));
          controller.close();
        },
      });
      return new StreamingTextResponse(stream);
    }

    const { stream, handlers } = LangChainStream();
    console.log("📡 Stream initialized");

    const pinecone = new Pinecone();
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const index = pinecone.Index(indexName);

    console.log("🔗 Connecting to Pinecone index:", indexName);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: fileKey,
    });
    console.log("✅ Vector store created");

    console.log("🔍 Performing similarity search...");
    const relevantDocs = await vectorStore.similaritySearch(query, 4);
    console.log("✅ Found relevant documents:", relevantDocs.length);

    const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

    const context = relevantDocs
      .map((doc, index) => `Document ${index + 1}:\n${doc.pageContent}`)
      .join("\n\n");

    // 1. Create a dedicated system prompt for instructions and context
    const systemPrompt = `You are a helpful AI assistant. Use the context below to answer the user's question. If the context doesn't contain enough information, say so clearly. Be concise but thorough.
    
    CONTEXT FROM DOCUMENT:
    ${context}`;

    // 2. Format the message history for the chatCompletion endpoint
    const formattedMessages = messages.map((msg: Message) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }));

    // 3. Combine system prompt with the message history
    const chatRequestMessages: Message[] = [
      {
        id: "system-" + Date.now(),
        role: "system",
        content: systemPrompt,
      },
      ...formattedMessages,
    ];

    console.log("🎯 Generating response using chatCompletion...");

    // 4. Use hf.chatCompletionStream
    const response = hf.chatCompletionStream({
      model: "meta-llama/Meta-Llama-3-8B-Instruct",
      messages: chatRequestMessages,
      max_tokens: 800,
      temperature: 0.7,
      top_p: 0.9,
    });

    // 5. Process the new stream format
    const processStream = async () => {
      let fullResponse = "";
      try {
        for await (const chunk of response) {
          // The content is in chunk.choices[0].delta.content
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullResponse += content;
            handlers.handleLLMNewToken(content);
          }
        }
        console.log("✅ Stream finished.");
        if (fullResponse && type === "default") {
          await saveMessage(documentId, "assistant", fullResponse, user.id);
        }
        handlers.handleLLMEnd({}, "");
      } catch (streamError) {
        console.error("❌ Stream processing error:", streamError);
        handlers.handleLLMError(streamError as Error, "");
      }
    };

    processStream();

    console.log("📤 Returning streaming response");
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("❌ API Route Error:", error);
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("An internal server error occurred.", { status: 500 });
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
    console.log(`Would save ${role} message for document ${documentId}`);
    return document;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}
