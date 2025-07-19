"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Loader2,
  MessageSquareTextIcon,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { Button } from "../ui/button";
import { cn, scrollToBottom } from "@/lib/utils";
import { useChat } from "ai/react";
import { Document, Message as MessageDB } from "../../../prisma/prisma-client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "../ui/input";
interface Props {
  document: Document & {
    messages: MessageDB[];
  };
  type: "custom" | "default";
}

const Chat = ({ document, type }: Props) => {
  const listQuestions = [
    "What is GPT-4?",
    "What kind of inputs can GPT-4 understand?",
    "How did GPT-4 perform on the bar exam?",
    "What are some limitations of GPT-4?",
  ];
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
    body: {
      fileKey: document.fileKey,
      documentId: document.id,
      type: type,
    },
    initialMessages: document.messages,
  });
  const messageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scrollToBottom(messageRef);
  }, [messages]);
  const PopOverBtn = () => {
    const [open, setOpen] = useState(false);

    const askQuestion = (question: string) => () => {
      console.log("Question asked:", question);
      append({
        role: "user",
        content: question,
      });
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2 h-9 w-9 font-medium transition-all duration-200 bg-transparent border-0 hover:scale-105 outline-none hover:bg-[#ff612f] hover:text-white dark:hover:bg-orange-500/20 dark:hover:text-orange-500 hover:shadow-xl rounded-full"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 bg-white dark:bg-gray-800">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium text-gray-800 dark:text-gray-200">
                Don&#39;t know what to ask? Try these ↓
              </h4>
            </div>
            <div className="grid gap-2">
              {listQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  className="w-full text-left px-2 py-1 rounded hover:bg-[#ff612f]/10 dark:hover:bg-orange-500/20 transition-colors text-muted-foreground dark:text-gray-400 text-sm"
                  onClick={askQuestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  };
  return (
    <div
      className="w-1/2 mt-15 overflow-scroll bg-white dark:bg-gray-800"
      style={{
        height: "calc(100vh - 3.75rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="h-full flex flex-col justify-between">
        {/* Messages */}
        <div className="overflow-auto bg-white dark:bg-gray-800">
          <div className="flex flex-col">
            {messages.length > 0 ? (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-6 w-full flex items-start gap-x-8",
                    message.role === "user"
                      ? "bg-white dark:bg-gray-800"
                      : "bg-[#faf9f6] dark:bg-gray-900"
                  )}
                >
                  <div className="w-4">
                    {message.role === "user" ? (
                      <User className="bg-[#ff612f] text-white rounded-sm p-1" />
                    ) : (
                      <Bot className="bg-[#062427] text-white rounded-sm p-1" />
                    )}
                  </div>
                  <div className="text-sm font-light overflow-hidden leading-7 text-gray-800 dark:text-gray-200">
                    {message.content}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 w-full flex items-center justify-center mt-50">
                <div className="space-y-2 text-center">
                  <MessageSquareTextIcon className="w-5 h-5 mx-auto text-gray-500 dark:text-gray-400" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Chat messages will appear in this area.
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    To begin, ask a question related to your document.
                  </p>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="p-6 w-full flex items-start gap-x-8 bg-[#faf9f6] dark:bg-gray-900">
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
        <div className="bg-[#faf9f6] dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="flex items-end gap-2 p-4">
            <div className="mb-3">{type === "custom" && <PopOverBtn />}</div>
            <div className="flex flex-1 items-center rounded-md border border-[#e5e3da] dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm">
              <Input
                type="text"
                placeholder="Ask a question"
                value={input}
                onChange={handleInputChange}
                disabled={isLoading || type === "custom"}
                className="flex-1 border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent disabled:opacity-50 bg-transparent dark:text-gray-200"
                autoComplete="off"
                spellCheck={false}
              />
              {isLoading ? (
                <Loader2
                  className="h-5 w-5 text-[#ff612f]/70 animate-spin ml-2"
                  style={{ strokeWidth: 3 }}
                />
              ) : (
                <Button
                  variant="orange"
                  type="submit"
                  size="icon"
                  className="ml-2"
                  disabled={!input.trim()}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
