import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
const LandingPage = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#062427]">
        <div className="section-container flex flex-col text-white md:flex-row items-center">
          {/* left  */}
          <div className="flex flex-col mb-32 space-y-12 text-center md:w-1/2 md:text-left">
            {/* header */}
            <h1 className="max-w-md text-4xl md:text-5xl md:leading-tight">
              Chat with any PDF document
            </h1>
            {/* description */}
            <p className="max-w-md  md:max-w-sm text-white/80 font-light leading-7 ">
              From legal arguments to financial reports, PDF.ai brings your
              documents to life. Ask questions, get instant summaries, extract
              key insights, and find exactly what you need—faster and smarter.
            </p>
            {/* CTA */}
            <div>
              <div className="flex justify-center md:justify-start">
                <Button variant={"orange"}>Get Started for free</Button>
              </div>
              <div className="flex justify-start mt-6">
                <Image
                  src="/images/user_1.jpeg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
                />
                <Image
                  src="/images/user_2.jpeg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
                />
                <Image
                  src="/images/user_3.jpeg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
                />
                <Image
                  src="/images/user_4.jpeg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
                />
                <Image
                  src="/images/user_5.jpeg"
                  alt="Hero"
                  width={50}
                  height={50}
                  className="rounded-full h-6 w-6 my-auto object-cover ring-2 ring-green-950"
                />
                <p className="ml-2 my-auto text-sm text-slate-400">
                  Loved by 1000+ happy users
                </p>
              </div>
            </div>
          </div>
          {/* right */}
          <div className="md:w-1/2">
            <Image
              src="/images/hero.svg"
              alt="Hero"
              width={1000}
              height={1000}
            />
          </div>
        </div>
      </section>
      {/* Features */}
      <section>
        <div className="section-container"></div>
      </section>
    </>
  );
};

export default LandingPage;
