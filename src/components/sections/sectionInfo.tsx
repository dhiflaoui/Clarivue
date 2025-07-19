"use client";
import React from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import Typewriter from "typewriter-effect";
import UserAvatars from "./UserAvatars";
import Link from "next/link";
const SectionInfo: React.FC = () => {
  const USERS = [
    { id: 1, src: "/images/user_1.jpeg", alt: "User 1" },
    { id: 2, src: "/images/user_2.jpeg", alt: "User 2" },
    { id: 3, src: "/images/user_3.jpeg", alt: "User 3" },
    { id: 4, src: "/images/user_4.jpeg", alt: "User 4" },
    { id: 5, src: "/images/user_5.jpeg", alt: "User 5" },
  ];
  const TYPEWRITER_STRINGS = [
    "Books",
    "Scientific papers",
    "Financial reports",
    "Legal arguments",
    "User manuals",
  ];
  return (
    <section className="bg-[#062427]">
      <div className="section-container flex flex-col text-white md:flex-row items-center">
        <div className="flex flex-col mb-32 space-y-12 text-center md:w-1/2 md:text-left">
          <h1 className="max-w-md text-4xl md:text-5xl md:leading-tight mt-6">
            Chat with any PDF document
          </h1>
          <div className="text-3xl font-light text-orange-400">
            <Typewriter
              options={{
                strings: TYPEWRITER_STRINGS,
                autoStart: true,
                loop: true,
              }}
            />
          </div>

          <p className="max-w-md  md:max-w-sm text-white/80 font-light leading-7 ">
            Whether it&apos;s legal arguments or financial reports, Clarivue
            transforms your documents into actionable insights. Ask questions,
            get instant summaries, extract key information, and find what you
            need faster and smarter
          </p>

          <div>
            <div className="flex justify-center md:justify-start">
              <Link href="#">
                <Button variant={"orange"}>Get Started for free</Button>
              </Link>
            </div>
            <UserAvatars USERS={USERS} />
          </div>
        </div>

        <div className="md:w-1/2">
          <Image src="/images/hero.svg" alt="Hero" width={1000} height={1000} />
          {/* TODO: Add the image here */}
          {/* <Image
            src="/images/frontImage.png"
            alt="Hero"
            width={1000}
            height={1000}
          /> */}
        </div>
      </div>
    </section>
  );
};

export default SectionInfo;
