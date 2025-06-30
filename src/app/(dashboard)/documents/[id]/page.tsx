import Chat from "@/components/chat/Chat";
import PdfViewer from "@/components/chat/PdfViewer";
import { getDocumentById } from "@/lib/document-service";
import { redirect } from "next/navigation";
interface Props {
  params: {
    id: string;
  };
}
const ChatPage = async ({ params: { id } }: Props) => {
  const document = await getDocumentById(id);
  if (!document) {
    redirect("/documents");
  }

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PdfViewer fileUrl={document.fileUrl} />
      <Chat />
    </div>
  );
};

export default ChatPage;
