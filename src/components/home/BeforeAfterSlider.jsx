"use client";

import React, { useRef, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Cpu, Scan } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function FuturisticAIStaging() {
  const containerRef = useRef(null);
  const dataTextRef = useRef(null);

  // Performance Fact: Using CSS Variables instead of React State prevents re-rendering lag!
  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update CSS variables directly for Butter-Smooth 60FPS performance
      containerRef.current.style.setProperty("--x", `${x}px`);
      containerRef.current.style.setProperty("--y", `${y}px`);

      // Update futuristic coordinate text without lagging React
      if (dataTextRef.current) {
        dataTextRef.current.innerText = `SCAN DATA // X: ${Math.round(x)} Y: ${Math.round(y)}`;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("pointermove", handlePointerMove);
      // Center the scanner on load
      const rect = container.getBoundingClientRect();
      container.style.setProperty("--x", `${rect.width / 2}px`);
      container.style.setProperty("--y", `${rect.height / 2}px`);
    }

    return () => {
      if (container) {
        container.removeEventListener("pointermove", handlePointerMove);
      }
    };
  }, []);

  const beforeImg = "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1600&auto=format&fit=crop"; // Empty room
  const afterImg = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1600&auto=format&fit=crop"; // Staged room

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Cyber Glow */}
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#cddfa0]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* Embedded CSS for the Uncommon Diamond Scanner */}
      <style dangerouslySetInnerHTML={{__html: `
        .ai-scanner-container {
          --x: 50%;
          --y: 50%;
          touch-action: none;
        }
        
        /* Diamond shape clipping for the "After" Image */
        .ai-diamond-clip {
          clip-path: polygon(
            var(--x) calc(var(--y) - 200px),
            calc(var(--x) + 200px) var(--y),
            var(--x) calc(var(--y) + 200px),
            calc(var(--x) - 200px) var(--y)
          );
        }

        /* Glowing Border for the Diamond */
        .ai-diamond-border {
          position: absolute;
          left: var(--x);
          top: var(--y);
          width: 400px;
          height: 400px;
          transform: translate(-50%, -50%) rotate(45deg);
          border: 2px solid #cddfa0;
          box-shadow: 0 0 30px rgba(205,223,160,0.5), inset 0 0 30px rgba(205,223,160,0.3);
          pointer-events: none;
          z-index: 30;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(205,223,160,0.03) 10px,
            rgba(205,223,160,0.03) 20px
          );
        }

        /* Cyber Crosshair in the center */
        .ai-crosshair {
          position: absolute;
          left: var(--x);
          top: var(--y);
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 40;
          color: #cddfa0;
        }

        /* Blueprint filter for the "Before" image */
        .blueprint-filter {
          filter: grayscale(100%) contrast(120%) brightness(0.6) sepia(100%) hue-rotate(110deg) saturate(150%);
        }
      `}} />

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-6 shadow-[0_0_20px_rgba(205,223,160,0.1)]">
            <Cpu size={14} /> Neural Staging Engine
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Unveil the <span className="text-[#cddfa0] italic font-light">Future</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Scan the blueprint. Our AI rendering engine instantly visualizes the fully furnished potential of any raw space.
          </p>
        </div>

        {/* Main Scanner Container */}
        <div className="max-w-5xl mx-auto relative group">
          
          <div className="p-2 lg:p-3 bg-[#081d19]/80 backdrop-blur-xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative">
            
            {/* Top Bar for Sci-Fi Look */}
            <div className="absolute top-6 left-8 right-8 z-50 flex justify-between items-center pointer-events-none">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></div>
                <span className="text-white/70 text-[10px] font-bold tracking-[0.3em] uppercase">Rec / Scan Active</span>
              </div>
              <div ref={dataTextRef} className="text-[#cddfa0] text-[10px] font-mono tracking-widest bg-black/50 px-3 py-1 rounded">
                SCAN DATA // X: 000 Y: 000
              </div>
            </div>

            <div 
              ref={containerRef}
              className="ai-scanner-container relative w-full aspect-[4/3] md:aspect-[21/9] rounded-[2rem] overflow-hidden cursor-none bg-black"
            >
              
              {/* --- BEFORE IMAGE (Raw / Blueprint Look) --- */}
              <img 
                src={beforeImg} 
                alt="Empty Blueprint" 
                className="blueprint-filter absolute inset-0 w-full h-full object-cover pointer-events-none" 
              />
              
              {/* Overlay grid on top of blueprint */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none z-10"></div>

              {/* --- AFTER IMAGE (Vibrant Staged Room inside the Diamond) --- */}
              <div className="ai-diamond-clip absolute inset-0 w-full h-full pointer-events-none z-20">
                <img 
                  src={afterImg} 
                  alt="Staged Interior" 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
              </div>

              {/* --- DIAMOND SCANNER BORDER --- */}
              <div className="ai-diamond-border transition-transform duration-75 ease-out"></div>
              
              {/* --- CENTER CROSSHAIR --- */}
              <div className="ai-crosshair">
                <Scan size={40} className="animate-spin-slow opacity-80" />
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_white]"></div>
              </div>

            </div>
          </div>
          
          {/* Aesthetic Bottom Details */}
          <div className="flex justify-center mt-8 items-center gap-4">
            <div className="w-16 h-[1px] bg-[#cddfa0]/30"></div>
            <span className="text-[10px] text-[#cddfa0]/60 font-black tracking-[0.4em] uppercase">Interactive Mode</span>
            <div className="w-16 h-[1px] bg-[#cddfa0]/30"></div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
      `}} />
    </section>
  );
}