import Chat from "@/components/chat/Chat";
import PdfViewer from "@/components/chat/PdfViewer";
import { getDocumentById } from "@/actions/db";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const ChatPage = async ({ params }: Props) => {
  const { id } = await params;
  const document = await getDocumentById(id);

  if (!document) {
    redirect("/documents");
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PdfViewer fileUrl={document.fileUrl!} />
      <Chat document={document} />
    </div>
  );
};

export default ChatPage;
