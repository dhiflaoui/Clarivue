import React from "react";
import SectionInfo from "./sections/sectionInfo";
import SectionFeatures from "./sections/SectionFeatures";
import SectionStarted from "./sections/SectionStarted";
import Footer from "./sections/Footer";
const LandingPage: React.FC = () => {
  return (
    <>
      <SectionInfo />
      <SectionFeatures />
      <SectionStarted />
      <Footer />
    </>
  );
};

export default LandingPage;
