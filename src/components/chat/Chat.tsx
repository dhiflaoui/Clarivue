import React from "react";
import { Bot, Send, User } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const Chat = () => {
  const messages = [
    {
      role: "user",
      content: "Hello",
    },
    {
      role: "bot",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      role: "user",
      content: "Hello",
    },
    {
      role: "bot",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
    {
      role: "user",
      content: "Hello",
    },
    {
      role: "bot",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    },
  ];
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
        {/* messge */}
        <div className="overflow-auto bg-white">
          <div className="flex flex-col">
            {messages.map((message) => (
              <div
                key={message.content}
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
          </div>
        </div>
        {/* Form */}
        <div className="bg-[#faf9f6]">
          <form className="m-4 p-2 item-center justify-between rounded-md border-[#e5e3da] border bg-white flex">
            <input
              type="text"
              placeholder="Ask a question"
              className="border-none outline-none focus-visible:ring-0 focus-visible:ring-transparent"
            />
            <Button variant="orange">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
