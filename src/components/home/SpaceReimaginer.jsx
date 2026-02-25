"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Sparkles } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const PRESETS = {
  modern: {
    label: "Modern Minimalist",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1350&q=80",
  },
  luxury: {
    label: "Luxury Industrial",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1350&q=80",
  },
  traditional: {
    label: "Classic Elegance",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80",
  },
  cozy: {
    label: "Urban Eco Retreat",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1350&q=80",
  },

  scandinavian: {
    label: "Scandinavian Nordic",
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1350&q=80",
  },
 
  bohemian: {
    label: "Bohemian Chic",
    image: "https://images.unsplash.com/photo-1558882224-cca16673a711?auto=format&fit=crop&w=1350&q=80",
  },
};

const ORIGINAL = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1350&q=80";

export default function SpaceReimaginer() {
  const [preset, setPreset] = useState("modern");
  const [animating, setAnimating] = useState(false);
  const [width, setWidth] = useState(0);

  const startTransform = (key) => {
    if (!key || animating || (key === preset && width === 100)) return;
    setPreset(key);
    setAnimating(true);
    setWidth(0);

    let currentWidth = 0;
    const interval = setInterval(() => {
      currentWidth += 2;
      if (currentWidth >= 100) {
        clearInterval(interval);
        setWidth(100);
        setTimeout(() => setAnimating(false), 300);
      } else {
        setWidth(currentWidth);
      }
    }, 30);
  };

  useEffect(() => {
    startTransform("modern");
  }, []);

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] overflow-hidden ${manrope.className}`}>
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section  */}
        <div className="flex flex-col items-center text-center mb-12 gap-4">
          <div className="flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-2">
            <Sparkles size={14} /> AI Vision
          </div>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Space <span className="text-[#cddfa0] italic font-light">Re-Imaginer</span>
          </h3>
          <p className="text-white/60 font-medium max-w-2xl">
            Watch your empty space transform into a fully furnished masterpiece in real-time using our AI. 
            Choose a style and witness the magic.
          </p>

          {/* Preset Buttons  */}
          <div className="flex gap-3 flex-wrap justify-center mt-6">
            {Object.entries(PRESETS).map(([key, p]) => (
              <button
                key={key}
                disabled={animating}
                onClick={() => startTransform(key)}
                className={`px-5 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 border ${
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
        <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl h-[500px] lg:h-[650px] w-full bg-[#13332c]">
          
          {/* 1. Original Background */}
          <img 
            src={ORIGINAL} 
            alt="Original interior" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[30%] opacity-80" 
          />

          {/* 2. AI Generated Image Wrapper */}
          <div 
            className="absolute inset-0 top-0 left-0 h-full overflow-hidden transition-none"
            style={{ width: `${width}%` }}
          >
            <img 
              src={PRESETS[preset].image} 
              alt={PRESETS[preset].label} 
              className="absolute top-0 left-0 h-full object-cover" 
              style={{ width: "100vw", maxWidth: "1152px" }}
            />
          </div>

          {/* 3. Laser Scanner */}
          {animating && (
            <div 
              className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center"
              style={{ left: `calc(${width}% - 1px)` }}
            >
              <div className="w-[2px] h-full bg-[#cddfa0] shadow-[0_0_15px_#cddfa0]"></div>
              <div className="absolute right-0 h-full w-32 bg-gradient-to-r from-transparent to-[#cddfa0]/20"></div>
              
              <div className="absolute left-4 bg-[#cddfa0] text-[#0f2e28] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                Scanning {Math.round(width)}%
              </div>
            </div>
          )}

          {/* 4. Labels */}
          <div className="absolute bottom-8 left-8 right-8 flex justify-between z-30 pointer-events-none">
            <div className="bg-[#0f2e28]/80 backdrop-blur-md border border-white/10 text-white/70 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest">
              Before
            </div>
            
            {width > 20 && (
              <div className="bg-[#cddfa0] text-[#0f2e28] px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                After: {PRESETS[preset].label}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}