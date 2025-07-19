import React from "react";
import DemoBar from "@/components/DemoBar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DemoBar />
      {children}
    </>
  );
};

export default DashboardLayout;
