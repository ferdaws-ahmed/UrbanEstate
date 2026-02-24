"use client";

import React, { useRef, useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Sparkles } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const PRESETS = {
  modern: {
    label: "Modern Minimalist",
    color: "#cddfa0",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1350&q=80",
  },
  luxury: {
    label: "Luxury Industrial",
    color: "#cddfa0",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1350&q=80",
  },
  traditional: {
    label: "Classic Elegance",
    color: "#cddfa0",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80",
  },
  cozy: {
    label: "Urban Eco Retreat",
    color: "#cddfa0",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1350&q=80",
  },
};

const ORIGINAL = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1350&q=80";

export default function SpaceReimaginer() {
  const [preset, setPreset] = useState("modern");
  const [animating, setAnimating] = useState(false);
  const [width, setWidth] = useState(0);

  const startTransform = (key) => {
    if (!key || animating || key === preset && width === 100) return;
    setPreset(key);
    setAnimating(true);
    setWidth(0);

    // লেজার স্ক্যানার অ্যানিমেশন লজিক
    let currentWidth = 0;
    const interval = setInterval(() => {
      currentWidth += 2; // স্পিড কন্ট্রোল
      if (currentWidth >= 100) {
        clearInterval(interval);
        setWidth(100);
        setTimeout(() => setAnimating(false), 300); // অ্যানিমেশন শেষে স্ক্যানার লুকানো
      } else {
        setWidth(currentWidth);
      }
    }, 30);
  };

  // প্রথমবার লোড হওয়ার পর ডিফল্ট অ্যানিমেশন দেখানো
  useEffect(() => {
    startTransform("modern");
  }, []);

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] overflow-hidden ${manrope.className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-4 inline-flex">
              <Sparkles size={14} /> AI Vision
            </div>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Space <span className="text-[#cddfa0] italic font-light">Re-Imaginer</span>
            </h3>
            <p className="text-white/60 font-medium mt-2 max-w-md">
              Watch your empty space transform into a fully furnished masterpiece in real-time using our AI.
            </p>
          </div>
          
          {/* Preset Buttons */}
          <div className="flex gap-3 flex-wrap">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                disabled={animating}
                onClick={() => startTransform(key)}
                className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border ${
                  preset === key 
                    ? "bg-[#cddfa0] text-[#0f2e28] border-[#cddfa0] shadow-[0_0_20px_rgba(205,223,160,0.3)]" 
                    : "bg-transparent text-white/70 border-white/20 hover:border-[#cddfa0]/50 hover:text-white"
                } ${animating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Image Container */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-[500px] lg:h-[600px] w-full bg-[#13332c]">
          
          {/* 1. Original Background Image (Empty Room) */}
          <img 
            src={ORIGINAL} 
            alt="Original interior" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[30%] opacity-80" 
          />

          {/* 2. After Image Wrapper (AI Generated Room) */}
          <div 
            className="absolute inset-0 top-0 left-0 h-full overflow-hidden"
            style={{ width: `${width}%` }}
          >
            {/* The generated image needs a fixed width equal to container to not stretch */}
            <img 
              src={PRESETS[preset].image} 
              alt={`${PRESETS[preset].label} preview`} 
              className="absolute top-0 left-0 h-full max-w-none object-cover w-[1152px] lg:w-[1152px]" 
              style={{ width: "100vw", maxWidth: "1152px" }} // Responsive width fix
            />
          </div>

          {/* 3. Glowing Laser Scanner */}
          {animating && (
            <div 
              className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center"
              style={{ left: `calc(${width}% - 1px)` }}
            >
              {/* The bright laser line */}
              <div className="w-[2px] h-full bg-[#cddfa0] shadow-[0_0_15px_#cddfa0]"></div>
              
              {/* The glowing aura behind the laser */}
              <div className="absolute right-0 h-full w-24 bg-gradient-to-r from-transparent to-[#cddfa0]/40"></div>
              
              {/* Scanning text indicator */}
              <div className="absolute bg-[#cddfa0] text-[#0f2e28] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-lg">
                AI Processing {Math.round(width)}%
              </div>
            </div>
          )}

          {/* 4. Labels Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between z-30 pointer-events-none">
            <div className="bg-[#0f2e28]/80 backdrop-blur-md border border-white/10 text-white/60 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest">
              Original Space
            </div>
            
            {width === 100 && (
              <div className="bg-[#cddfa0] text-[#0f2e28] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transform transition-all">
                {PRESETS[preset].label}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  );
}