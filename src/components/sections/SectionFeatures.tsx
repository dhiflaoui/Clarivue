import React from "react";
import FeatureCard from "./FeatureCard";

const SectionFeatures: React.FC = () => {
  const features = [
    {
      image: "/images/feature_1.svg",
      title: "Upload Document",
      description:
        "Easily upload the PDF document you'd like to analyze and chat with",
    },
    {
      image: "/images/feature_2.svg",
      title: "Instant Answers",
      description:
        "Quickly get answers, uncover insights, extract key details, and summarize documents all in one place.",
    },
    {
      image: "/images/feature_3.svg",
      title: "Sources included",
      description:
        "Every answer is backed by sources, so you can trust the information.",
    },
  ];
  return (
    <section className="section-container">
      <h1 className="text-center text-4xl font-semibold mb-5 sm:mb-10 text-gray-800 dark:text-gray-200">
        How it works
      </h1>
      <div className="text-black dark:text-white grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:gap-10">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionFeatures;
