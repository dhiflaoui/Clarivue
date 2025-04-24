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
    <a href={href} className="hover:text-gray-600">
      <Icon className="w-5 h-5" />
    </a>
  );
};

export default SocialIcon;
