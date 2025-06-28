"use client";

import Chat from "@/components/chat/Chat";
import PdfViewer from "@/components/chat/PdfViewer";

const ChatPage = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PdfViewer />
      <Chat />
    </div>
  );
};

export default ChatPage;
