import { BookOpenCheck, Instagram, Linkedin, Twitter } from "lucide-react";
import React from "react";
import FooterColumn from "./footer/FooterColumn";
import SocialIcon from "./footer/socialIcon";

const Footer: React.FC = () => {
  const footerColumns = [
    {
      title: "Products",
      links: [
        { text: "Chrome extension", href: "#" },
        { text: "User cases", href: "#" },
        { text: "Blog", href: "#" },
        { text: "FAQ", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { text: "Learn", href: "#" },
        { text: "Docs", href: "#" },
        { text: "Community", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "#" },
        { text: "Contact", href: "#" },
      ],
    },
  ];

  // Social media data
  const socialIcons = [
    { icon: Linkedin, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "#" },
  ];
  return (
    <footer className="bg-[#f8f5ee] py-8">
      <div className="mx-auto max-w-7xl px-8 md:px-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
          <div className="flex items-center mb-6 md:mb-0">
            <BookOpenCheck className="w-8 h-8 mr-3" />
            <span className="text-xl font-medium text-black">Clarivue</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-x-20">
            {footerColumns.map((column) => (
              <FooterColumn
                key={column.title}
                title={column.title}
                links={column.links}
              />
            ))}
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        <div className="text-sm text-gray-500 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
          <span>© 2025 Clarivue. All rights reserved.</span>
          <div className="flex space-x-6">
            {socialIcons.map((social, index) => (
              <SocialIcon key={index} href={social.href} Icon={social.icon} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
