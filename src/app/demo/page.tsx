import Chat from "@/components/chat/Chat";
import PdfViewer from "@/components/chat/PdfViewer";

const DemoPage = () => {
  const defaultDocument = {
    id: "",
    userId: "demo-user",
    userName: "Demo User",
    fileName: "Demo Document",
    fileSize: 0,
    fileKey: "demo-key",
    fileUrl: process.env.CUSTOMFILEURL!,
    createdAt: new Date(),
    messages: [],
  };

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <PdfViewer fileUrl={process.env.CUSTOMFILEURL!} />
      <Chat document={defaultDocument} type={"custom"} />
    </div>
  );
};

export default DemoPage;
