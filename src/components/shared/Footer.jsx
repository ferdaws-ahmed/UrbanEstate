"use client";

import React, { useState, useEffect } from "react";
import { 
  FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube,
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaArrowUp, FaGlobe 
} from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6"; 
import { IoSend, IoShieldCheckmarkOutline } from "react-icons/io5"; 
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "700", "800"] });

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);


  useEffect(() => {
    const toggleVisibility = () => {

      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 5000); 
    }
  };

  return (
    <footer className={`relative bg-[#061510] text-emerald-100/60 pt-32 pb-12 overflow-hidden border-t border-emerald-900/30 ${manrope.className}`}>
      
      {/* Background Architectural Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] grayscale pointer-events-none"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-24">
          
          {/* 1. Brand Section */}
          <div className="lg:col-span-4 space-y-8 text-left">
            <div className="flex items-center gap-3">
              <svg width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-auto">
                <g transform="translate(0, 10)"> 
                  <path d="M95 50 L135 40 L135 140 L95 140 Z" fill="#94a894" /> 
                  <path d="M95 50 L115 40 L135 40" fill="#222222" /> 
                  <rect x="140" y="80" width="35" height="60" fill="#cddfa0" opacity="0.9" />
                  <path d="M40 130 L100 80 L145 130 H190" stroke="#cddfa0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="55" y="100" width="10" height="15" fill="#cddfa0" />
                </g>
              </svg>
              <h2 className="text-4xl font-black text-white tracking-tighter">
                Urban<span className="text-[#cddfa0]">Estate</span>
              </h2>
            </div>
            <p className="text-lg leading-relaxed max-w-sm font-light">
              We don’t just find houses; we discover architectural narratives.
            </p>
            
            <div className="grid grid-cols-1 gap-4 p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-md font-light text-sm">
              <div className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-emerald-500" /> Baipayl, Dhaka Division, Bangladesh
              </div>
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-emerald-500" /> +880 1234 567890
              </div>
            </div>
          </div>

          {/* 2. Intelligence & Resources */}
          <div className="lg:col-span-2 pt-4">
            <h3 className="text-[#cddfa0] font-black uppercase tracking-[0.3em] text-[12px] mb-10">Intelligence</h3>
            <ul className="space-y-5 text-sm font-light">
              {['Virtual Reality Tours', 'Geospatial Maps', 'Market Analytics', 'Private Portfolio'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition-all">{item}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 pt-4">
            <h3 className="text-[#cddfa0] font-black uppercase tracking-[0.3em] text-[12px] mb-10">Resources</h3>
            <ul className="space-y-5 text-sm font-light">
              {['Buy Property', 'Sell Property', 'Legal Unit', 'Financing'].map((item) => (
                <li key={item}><a href="#" className="hover:text-white transition-all">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* 3. Newsletter & Socials */}
          <div className="lg:col-span-4 flex flex-col items-end">
            <div className="w-full space-y-10">
              <div className="text-right">
                <h3 className="text-white font-bold text-xl mb-4 flex items-center justify-end gap-2">
                  Join the Ecosystem
                </h3>
                <form className="relative" onSubmit={handleSubmit}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" 
                    className="w-full bg-emerald-950/30 text-white text-sm px-6 py-5 rounded-2xl outline-none border border-emerald-500/30 focus:border-emerald-500 transition-all placeholder-emerald-100/30"
                    required
                  />
                  <button type="submit" className="absolute right-2 top-2 bottom-2 bg-emerald-500 px-6 rounded-xl text-[#061510] font-bold hover:bg-[#cddfa0] transition-all flex items-center gap-2">
                    Submit <IoSend size={16} />
                  </button>
                </form>
                {isSubmitted && <p className="text-emerald-400 text-[10px] mt-2 animate-pulse font-bold tracking-widest uppercase">SUBMITTED!</p>}
              </div>

              <div className="grid grid-cols-3 gap-3 w-fit ml-auto">
                {[
                  { icon: FaFacebookF, url: "https://facebook.com" },
                  { icon: FaXTwitter, url: "https://x.com" },
                  { icon: FaInstagram, url: "https://instagram.com" },
                  { icon: FaLinkedinIn, url: "https://linkedin.com" },
                  { icon: FaYoutube, url: "https://youtube.com" },
                  { icon: FaGlobe, url: "#" }
                ].map((social, i) => (
                  <a key={i} href={social.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-[#061510] transition-all duration-500">
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.3em] font-bold">
          <span className="text-emerald-500/40">© {new Date().getFullYear()} Urban Estate Unit</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Unit</a>
          </div>
        </div>
      </div>

    
    </footer>
  );
};

export default Footer;