"use client";
import React, { useEffect, useRef } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { Button } from "../ui/button";
import { cn, scrollToBottom } from "@/lib/utils";
import { useChat } from "ai/react";
import { Document, Message as MessageDB } from "../../../prisma/prisma-client";
interface Props {
  document: Document & {
    messages: MessageDB[];
  };
}

const Chat = ({ document }: Props) => {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        fileKey: document.fileKey,
        documentId: document.id,
      },
      initialMessages: document.messages,
    });
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom(messageRef);
  }, [messages]);
  return (
    <div
      className="w-1/2 mt-15 overflow-scroll bg-white"
      style={{
        height: "calc(100vh - 3.75rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="h-full flex flex-col justify-between">
        {/* Messages */}
        <div className="overflow-auto bg-white">
          <div className="flex flex-col">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "p-6 w-full flex items-start gap-x-8",
                  message.role === "user" ? "bg-white" : "bg-[#faf9f6]"
                )}
              >
                <div className="w-4">
                  {message.role === "user" ? (
                    <User className="bg-[#ff612f] text-white rounded-sm p-1" />
                  ) : (
                    <Bot className="bg-[#062427] text-white rounded-sm p-1" />
                  )}
                </div>
                <div className="text-sm font-light overflow-hidden leading-7">
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-6 w-full flex items-start gap-x-8 bg-[#faf9f6]">
                <div className="w-4">
                  <Bot className="bg-[#062427] text-white rounded-sm p-1" />
                </div>
                <div className="text-sm font-light overflow-hidden leading-7">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div ref={messageRef}></div>
        </div>
        {/* Form */}
        <div className="bg-[#faf9f6]">
          <form
            onSubmit={handleSubmit}
            className="m-4 p-2 item-center justify-between rounded-md border-[#e5e3da] border bg-white flex"
          >
            <input
              type="text"
              placeholder="Ask a question"
              value={input}
              onChange={handleInputChange}
              disabled={isLoading}
              className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent disabled:opacity-50"
            />
            {isLoading ? (
              <Loader2
                className="h-5 w-5 text-[#ff612f]/70 animate-spin"
                style={{ strokeWidth: "3" }}
              />
            ) : (
              <Button variant="orange" type="submit">
                <Send className="w-4 h-4" />
              </Button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
