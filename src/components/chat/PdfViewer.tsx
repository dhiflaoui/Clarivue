"use client";
// Import the main component
import { Worker, Viewer } from "@react-pdf-viewer/core";
//import Plugin
import {
  defaultLayoutPlugin,
  ToolbarProps,
  ToolbarSlot,
} from "@react-pdf-viewer/default-layout";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { ReactElement } from "react";

const PdfViewer = () => {
  const renderToolbar = (Toolbar: (props: ToolbarProps) => ReactElement) => (
    <Toolbar>
      {(slots: ToolbarSlot) => {
        const {
          CurrentPageInput,
          Download,
          EnterFullScreen,
          GoToNextPage,
          GoToPreviousPage,
          NumberOfPages,
          Print,
          ShowSearchPopover,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div
            style={{
              alignItems: "center",
              display: "flex",
              width: "100%",
            }}
          >
            <div style={{ padding: "0px 2px" }}>
              <ShowSearchPopover />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <ZoomOut />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <Zoom />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <ZoomIn />
            </div>
            <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
              <GoToPreviousPage />
            </div>
            <div style={{ padding: "0px 2px", width: "3rem" }}>
              <CurrentPageInput />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <NumberOfPages />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <GoToNextPage />
            </div>
            <div style={{ padding: "0px 2px", marginLeft: "auto" }}>
              <EnterFullScreen />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <Download />
            </div>
            <div style={{ padding: "0px 2px" }}>
              <Print />
            </div>
          </div>
        );
      }}
    </Toolbar>
  );
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [],
    renderToolbar,
  });
  return (
    <div
      className="w-1/2 mt-15"
      style={{
        height: "calc(100vh - 3.75rem)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          plugins={[defaultLayoutPluginInstance]}
          fileUrl="https://res.cloudinary.com/dft2x51oh/raw/upload/v1750980542/pdfs/Fatma-Tawfeek-Frontend-Developer-Vue.pdf"
        />
      </Worker>
    </div>
  );
};

export default PdfViewer;
