import React from "react";
import Image from "next/image";

interface FeatureCardProps {
  image: string;
  title: string;
  description: string;
}

// Feature card component to avoid repetition
const FeatureCard: React.FC<FeatureCardProps> = ({
  image,
  title,
  description,
}: FeatureCardProps) => (
  <div className="rounded-b-xl px-5 pb-5 pt-3 shadow-lg bg-white dark:bg-gray-800">
    <div className="flex-col">
      <div className="flex items-center justify-center">
        <Image src={image} alt={title} width={500} height={500} />
      </div>
      <p className="text-xl font-medium text-gray-800 dark:text-gray-200">{title}</p>
      <span className="text-sm block text-gray-500 dark:text-gray-400 mt-3">{description}</span>
    </div>
  </div>
);

export default FeatureCard;
