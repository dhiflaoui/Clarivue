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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <PdfViewer fileUrl={process.env.CUSTOMFILEURL!} />
      </div>
      <div className="w-full md:w-1/2 h-1/2 md:h-full">
        <Chat document={defaultDocument} type={"custom"} />
      </div>
    </div>
  );
};

export default DemoPage;
