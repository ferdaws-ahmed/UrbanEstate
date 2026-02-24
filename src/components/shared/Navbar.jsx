"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Manrope } from "next/font/google"; // ফন্ট ইমপোর্ট

// Manrope ফন্ট কনফিগারেশন
const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

      setVisible(isVisible);
      setScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${manrope.className}
      ${visible ? "translate-y-0" : "-translate-y-full"} 
      ${scrolled ? "bg-[#0f2e28]/95 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
        
        {/* লোগো সেকশন */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          
          {/* SVG Logo - সাইজ কিছুটা ছোট করা হয়েছে (h-20 থেকে h-14) */}
          <svg 
            width="60" 
            height="60" 
            viewBox="0 0 200 200" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-auto" 
          >
            <g transform="translate(0, 10)"> 
              {/* Tall Building */}
              <path d="M95 50 L135 40 L135 140 L95 140 Z" fill="#94a894" /> 
              <path d="M95 50 L115 40 L135 40" fill="#222222" /> 
              
              {/* Right Building */}
              <rect x="140" y="80" width="35" height="60" fill="#cddfa0" opacity="0.9" />
              
              {/* Windows */}
              <rect x="150" y="95" width="6" height="10" fill="#0f2e28" opacity="0.3"/>
              <rect x="150" y="115" width="6" height="10" fill="#0f2e28" opacity="0.3"/>

              {/* Roof & Base Line */}
              <path 
                d="M40 130 L100 80 L145 130 H190" 
                stroke="#cddfa0" 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              
              {/* Chimney */}
              <rect x="55" y="100" width="10" height="15" fill="#cddfa0" />

              {/* Lower Windows */}
              <g fill="#cddfa0">
                  <rect x="85" y="145" width="12" height="12" />
                  <rect x="100" y="145" width="12" height="12" />
                  <rect x="85" y="160" width="12" height="12" />
                  <rect x="100" y="160" width="12" height="12" />
              </g>
            </g>
          </svg>

          {/* প্রজেক্ট নাম */}
          <span className="text-[28px] font-extrabold text-white tracking-tight drop-shadow-md">
            Urban< span className="text-[#cddfa0]">E</span>state
          </span>
        </Link>

        {/* মেনু */}
        <ul className="hidden md:flex gap-10 text-white font-bold text-[17px] tracking-wide items-center">
          <li><Link href="/" className="hover:text-[#cddfa0] transition duration-300">Home</Link></li>
          <li><Link href="/features" className="hover:text-[#cddfa0] transition duration-300">Features</Link></li>
          <li><Link href="/demo" className="hover:text-[#cddfa0] transition duration-300">Demo Preview</Link></li>
        </ul>

        {/* বাটন */}
        <Link
          href="/login"
          className="bg-[#cddfa0] text-[#0f2e28] px-7 py-2.5 rounded-md font-bold text-[16px] hover:bg-[#b8cc89] transition shadow-lg"
        >
          Login
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;