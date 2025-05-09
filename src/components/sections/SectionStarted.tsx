import React from "react";
import { Button } from "../ui/button";

const SectionStarted: React.FC = () => {
  return (
    <section className="section-container text-center">
      <h1 className="text-4xl font-semibold">Get Started</h1>
      <p className="text-gray-500 mt-6 mb-6">
        Start your journey with Clarivue today and experience the power of
        AI-driven insights.
        <br />
        No credit card required.
      </p>
      <div className="w-full max-w-sm mx-auto px-4">
        <Button variant={"orange"}>Sign Up for Free</Button>
      </div>
    </section>
  );
};

export default SectionStarted;
