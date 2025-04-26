import DashboardBar from "@/components/DashboardBar";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardBar />
      {children}
    </>
  );
};

export default DashboardLayout;
