import React from "react";
import { LucideIcon } from "lucide-react";

interface SocialIconProps {
  href: string;
  Icon: LucideIcon;
}

const SocialIcon: React.FC<SocialIconProps> = ({
  href,
  Icon,
}: SocialIconProps) => {
  return (
    <a href={href} className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300">
      <Icon className="w-5 h-5" />
    </a>
  );
};

export default SocialIcon;
