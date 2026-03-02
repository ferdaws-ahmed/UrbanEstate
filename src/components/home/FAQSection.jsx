"use client";

import React, { useState } from "react";
import { useTheme } from "../Theme/ThemeContext";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { isDark } = useTheme();

  const faqs = [
    {
      question: "How do I get started with the platform?",
      answer:
        "Getting started is easy! Simply create an account, verify your email, and you'll get instant access to our dashboard where you can set up your first project.",
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer:
        "Absolutely. We believe in no long-term lock-ins. You can cancel your subscription from your account settings with just two clicks, no questions asked.",
    },
    {
      question: "Do you offer API access for developers?",
      answer:
        "Yes, our Professional and Enterprise plans come with full API access. We provide comprehensive documentation to help you integrate our tools seamlessly into your MERN stack applications.",
    },
    {
      question: "Is my data secure and private?",
      answer:
        "Security is our top priority. All data is end-to-end encrypted, and we regularly undergo third-party security audits to ensure your information stays safe in our database.",
    },
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section
      className={`relative py-24 px-4 overflow-hidden ${
        isDark ? "bg-[#0f2e28]" : "bg-white"
      }`}
    >
      {/* Background radial glow */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,rgba(205,223,160,0.08)_0%,transparent_70%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(15,46,40,0.06)_0%,transparent_70%)]"
        }`}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span
            className={`font-mono tracking-[0.3em] text-[10px] uppercase mb-4 block font-bold ${
              isDark ? "text-[#cddfa0]" : "text-[#0f2e28]"
            }`}
          >
            Common Inquiries
          </span>

          <h2
            className={`text-4xl md:text-5xl font-black mb-6 tracking-tight ${
              isDark ? "text-white" : "text-[#0f2e28]"
            }`}
          >
            Frequently Asked{" "}
            <span className="italic font-light text-[#cddfa0]">Questions</span>
          </h2>

          <div className="w-20 h-1 bg-[#cddfa0]/40 mx-auto rounded-full" />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isOpen
                    ? isDark
                      ? "bg-white/[0.05] border-[#cddfa0]/40"
                      : "bg-[#0f2e28]/5 border-[#0f2e28]/20"
                    : isDark
                    ? "border-white/10 hover:border-[#cddfa0]/30"
                    : "border-black/10 hover:border-[#0f2e28]/30"
                }`}
              >
                {/* Active indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-[#cddfa0] transition-opacity ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                />

                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-7 md:px-10 text-left"
                >
                  <span
                    className={`text-lg md:text-xl font-bold transition-colors ${
                      isOpen
                        ? isDark?"text-[#cddfa0]":"text-black"
                        : isDark
                        ? "text-white/80 group-hover:text-white"
                        : "text-[#0f2e28]/80 group-hover:text-[#0f2e28]"
                    }`}
                  >
                    {faq.question}
                  </span>

                  {/* Plus / Minus */}
                  <div
                    className={`relative w-6 h-6 transition-transform duration-500 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <span
                      className={`absolute top-1/2 left-0 w-full h-0.5 ${
                        isDark ? "bg-white/40" : "bg-black/40"
                      }`}
                    />
                    <span
                      className={`absolute top-0 left-1/2 h-full w-0.5 transition-opacity ${
                        isOpen ? "opacity-0" : "opacity-100"
                      } ${isDark ? "bg-white/40" : "bg-black/40"}`}
                    />
                  </div>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-500 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p
                      className={`p-7 md:px-10 pt-0 text-base md:text-lg leading-relaxed ${
                        isDark ? "text-white/60" : "text-[#0f2e28]/70"
                      }`}
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;