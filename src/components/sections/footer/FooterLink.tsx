import React from "react";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({
  href,
  children,
}: FooterLinkProps) => {
  return (
    <a href={href} className="hover:underline text-sm text-gray-500 dark:text-gray-400">
      {children}
    </a>
  );
};

export default FooterLink;
