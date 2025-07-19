import React from "react";
import FooterLink from "./FooterLink";
interface FooterColumnProps {
  title: string;
  links: { href: string; text: string }[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({
  title,
  links,
}: FooterColumnProps) => (
  <div>
    <h2 className="mb-4 text-sm font-medium text-gray-800 dark:text-gray-200">{title}</h2>
    <div className="flex flex-col space-y-2">
      {links.map((link) => (
        <FooterLink key={link.text} href={link.href}>
          {link.text}
        </FooterLink>
      ))}
    </div>
  </div>
);

export default FooterColumn;
