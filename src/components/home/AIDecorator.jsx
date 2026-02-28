"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Zap, Fingerprint, Thermometer, Wifi, Activity, Crosshair } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


const smartSystems = [
  { 
    id: 'energy', 
    name: 'Quantum Energy Grid', 
    icon: <Zap size={20} />, 
    stat: '98.4%', 
    label: 'Efficiency',
    desc: 'AI-driven solar neural net with zero-waste power distribution.', 
    coords: { top: '35%', left: '45%' } 
  },
  { 
    id: 'security', 
    name: 'Biometric Shield', 
    icon: <Fingerprint size={20} />, 
    stat: 'Active', 
    label: 'Status',
    desc: 'Military-grade quantum encryption and facial recognition active.', 
    coords: { top: '60%', left: '70%' } 
  },
  { 
    id: 'climate', 
    name: 'Atmo-Control System', 
    icon: <Thermometer size={20} />, 
    stat: '21.5°C', 
    label: 'Optimized',
    desc: 'Predictive thermal mapping adjusts room climate dynamically.', 
    coords: { top: '55%', left: '30%' } 
  },
  { 
    id: 'network', 
    name: 'Neural Network Hub', 
    icon: <Wifi size={20} />, 
    stat: '10 Gbps', 
    label: 'Bandwidth',
    desc: 'Seamless ultra-wideband connectivity throughout the property.', 
    coords: { top: '75%', left: '50%' } 
  }
];

export default function SmartHomeCommandCenter() {
  const [activeSystem, setActiveSystem] = useState(smartSystems[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [randomData, setRandomData] = useState("SYNCING...");

 
  useEffect(() => {
    const interval = setInterval(() => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 12; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      setRandomData(`SYS_ID: ${result}`);
    }, 150);
    return () => clearInterval(interval);
  }, []);


  const handleSystemChange = (system) => {
    if (activeSystem.id === system.id) return;
    setIsScanning(true);
    setActiveSystem(system);
    setTimeout(() => setIsScanning(false), 800); 
  };

  const buildingImg = "https://media.istockphoto.com/id/506903162/photo/luxurious-villa-with-pool.jpg?s=612x612&w=0&k=20&c=Ek2P0DQ9nHQero4m9mdDyCVMVq3TLnXigxNPcZbgX2E="; 

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Cybernetic Glow */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#cddfa0]/10 blur-[150px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#081d19] blur-[100px] rounded-full pointer-events-none z-0"></div>

      {/* Global Embedded CSS for Circuit Pattern & Radar */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Custom Circuit Board Pattern */
        .circuit-pattern {
          background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 L90 10 L90 90 L10 90 Z' fill='none' stroke='rgba(205, 223, 160, 0.1)' stroke-width='1'/%3E%3Cpath d='M30 10 L30 30 L10 30' fill='none' stroke='rgba(205, 223, 160, 0.1)' stroke-width='1'/%3E%3Cpath d='M70 10 L70 30 L90 30' fill='none' stroke='rgba(205, 223, 160, 0.1)' stroke-width='1'/%3E%3Cpath d='M30 90 L30 70 L10 70' fill='none' stroke='rgba(205, 223, 160, 0.1)' stroke-width='1'/%3E%3Cpath d='M70 90 L70 70 L90 70' fill='none' stroke='rgba(205, 223, 160, 0.1)' stroke-width='1'/%3E%3Ccircle cx='30' cy='30' r='2' fill='rgba(205, 223, 160, 0.2)'/%3E%3Ccircle cx='70' cy='30' r='2' fill='rgba(205, 223, 160, 0.2)'/%3E%3Ccircle cx='30' cy='70' r='2' fill='rgba(205, 223, 160, 0.2)'/%3E%3Ccircle cx='70' cy='70' r='2' fill='rgba(205, 223, 160, 0.2)'/%3E%3Cpath d='M50 10 L50 90' fill='none' stroke='rgba(205, 223, 160, 0.05)' stroke-width='1' stroke-dasharray='5,5'/%3E%3Cpath d='M10 50 L90 50' fill='none' stroke='rgba(205, 223, 160, 0.05)' stroke-width='1' stroke-dasharray='5,5'/%3E%3C/svg%3E");
          background-size: 100px 100px;
        }
        
        .radar-sweep {
          background: conic-gradient(from 0deg, transparent 80%, rgba(205, 223, 160, 0.15) 100%);
          border-radius: 50%;
          animation: spin 4s linear infinite;
        }

        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }

        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .scan-line-continuous {
          animation: scanline 6s linear infinite;
        }

        /* Additional Glowing Data Points */
        .data-point-glow {
          position: absolute;
          width: 4px;
          height: 4px;
          background-color: #cddfa0;
          border-radius: 50%;
          box-shadow: 0 0 10px #cddfa0, 0 0 20px #cddfa0;
          animation: pulse-glow 2s infinite;
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
      `}} />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-[#cddfa0]/5 px-5 py-2 rounded-full border border-[#cddfa0]/20 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <Activity size={14} className="animate-pulse" /> Core Infrastructure
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
          Space Commands  <span className="text-[#cddfa0] italic font-light">Center</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Interact with the holographic blueprint to explore the invisible cutting-edge technology powering this modern estate.
          </p>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Holographic Visualizer (7 cols) */}
          <div className="lg:col-span-7 relative group">
            
            {/* Outer Glassmorphism Tech Frame */}
            <div className="p-3 bg-[#081d19]/80 backdrop-blur-2xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden">
              
              {/* Sci-Fi Top Bar Overlay */}
              <div className="absolute top-6 left-8 right-8 z-30 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-2 bg-[#081d19]/80 px-4 py-1.5 rounded-lg backdrop-blur-md border border-[#cddfa0]/30 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
                  <div className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse"></div>
                  <span className="text-[#cddfa0] text-[9px] font-bold tracking-[0.2em] uppercase">Security Feed</span>
                </div>
                <div className="text-[#cddfa0]/60 text-[10px] font-mono tracking-widest bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-md border border-white/5">
                  {randomData}
                </div>
              </div>

              {/* Main Hologram Image Area */}
              <div className="relative w-full aspect-[4/3] rounded-[1.8rem] overflow-hidden bg-[#040f0c] flex items-center justify-center border border-white/5">
                
                {/* 1. Base Image - Cinematic Dark & Moody Filter */}
                <img 
                  src={buildingImg} 
                  alt="Smart Building" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
                  style={{ filter: "brightness(0.65) contrast(1.15) saturate(0.6)" }}
                />

                {/* 2. Premium Dark Green Color Tint Overlay (Mix-Blend) */}
                <div className="absolute inset-0 bg-[#0f2e28] mix-blend-color opacity-60 pointer-events-none z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-[#081d19]/90 via-transparent to-[#081d19]/50 pointer-events-none z-0"></div>
                
                {/* 3. NEW: Circuit Board Pattern Overlay */}
                <div className="absolute inset-0 circuit-pattern mix-blend-screen opacity-100 pointer-events-none z-10"></div>

                {/* 4. NEW: Random Glowing Data Points */}
                <div className="data-point-glow" style={{ top: '20%', left: '15%' }}></div>
                <div className="data-point-glow" style={{ top: '80%', left: '85%', animationDelay: '0.5s' }}></div>
                <div className="data-point-glow" style={{ top: '40%', left: '90%', animationDelay: '1s' }}></div>
                <div className="data-point-glow" style={{ top: '70%', left: '10%', animationDelay: '1.5s' }}></div>

                {/* 5. Continuous Scan Line (Subtle CRT Effect) */}
                <div className="absolute left-0 right-0 h-[100%] bg-gradient-to-b from-transparent via-[#cddfa0]/10 to-transparent scan-line-continuous pointer-events-none mix-blend-overlay z-10"></div>

                {/* 6. Background Radar Sweep */}
                <div className="absolute w-[150%] h-[150%] radar-sweep mix-blend-screen pointer-events-none z-10"></div>

                {/* --- Interactive Hotspots (Pulsing Dots) --- */}
                {smartSystems.map((sys) => (
                  <div 
                    key={sys.id}
                    onClick={() => handleSystemChange(sys)}
                    className="absolute z-30 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                    style={{ top: sys.coords.top, left: sys.coords.left }}
                  >
                    {/* Ripple animation if active */}
                    <div className={`absolute inset-0 rounded-full transition-all duration-500 ${activeSystem.id === sys.id ? 'border-[2px] border-[#cddfa0] scale-[3.5] opacity-0 animate-ping' : 'opacity-0'}`}></div>
                    
                    {/* Core Tech Dot */}
                    <div className={`relative w-4 h-4 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border-2 ${activeSystem.id === sys.id ? 'bg-[#cddfa0] border-white shadow-[0_0_20px_#cddfa0] scale-125' : 'bg-[#0f2e28]/80 border-[#cddfa0]/50 hover:bg-[#cddfa0] hover:scale-110'}`}>
                      {activeSystem.id === sys.id && <div className="w-1.5 h-1.5 bg-[#0f2e28] rounded-full"></div>}
                    </div>

                    {/* Target Crosshair when active */}
                    {activeSystem.id === sys.id && (
                      <Crosshair size={50} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#cddfa0] opacity-60 animate-spin-slow pointer-events-none" strokeWidth={1} />
                    )}
                  </div>
                ))}

                {/* --- Action Flash Laser Line (On Click) --- */}
                <div className={`absolute left-0 right-0 h-[2px] bg-white shadow-[0_0_20px_#cddfa0,0_0_40px_#cddfa0] pointer-events-none z-40 transition-transform duration-700 ease-in-out ${isScanning ? 'translate-y-[200px] opacity-100' : '-translate-y-[200px] opacity-0'}`} style={{ top: '50%' }}></div>

                {/* Deep Vignette Shadow for Focus */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(4,15,12,0.9)] pointer-events-none z-20"></div>

              </div>
            </div>

            {/* Aesthetic Bottom Accents */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-50">
              <div className="w-12 h-1 bg-[#cddfa0] rounded-full"></div>
              <div className="w-4 h-1 bg-[#cddfa0] rounded-full"></div>
              <div className="w-2 h-1 bg-[#cddfa0] rounded-full"></div>
            </div>
          </div>

          {/* Right: Control Panel & Diagnostics (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-10 mt-8 lg:mt-0">
            
            {/* Dynamic Active System Display Card */}
            <div className="bg-[#081d19]/40 backdrop-blur-xl border border-[#cddfa0]/20 p-8 rounded-[2rem] relative overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              {/* Subtle accent glow inside card */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#cddfa0]/10 blur-[60px] rounded-full pointer-events-none"></div>
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#cddfa0] flex items-center justify-center text-[#0f2e28] shadow-[0_0_20px_rgba(205,223,160,0.4)]">
                  {activeSystem.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-wide">{activeSystem.name}</h3>
                  <p className="text-[#cddfa0] text-[10px] font-black tracking-[0.2em] uppercase mt-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#cddfa0] animate-pulse"></span> System Online
                  </p>
                </div>
              </div>

              <p className="text-white/60 text-sm leading-relaxed mb-8 relative z-10">
                {activeSystem.desc}
              </p>

              {/* Data Stat Box */}
              <div className="bg-black/40 backdrop-blur-md border border-[#cddfa0]/10 rounded-2xl p-5 flex justify-between items-center relative z-10">
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{activeSystem.label}</p>
                  <p className="text-[#cddfa0] text-4xl font-black font-mono tracking-tighter shadow-[#cddfa0] drop-shadow-md">{activeSystem.stat}</p>
                </div>
                {/* Decorative Audio/Wave bars */}
                <div className="flex items-end gap-1.5 h-10 opacity-80">
                  <div className="w-2 bg-[#cddfa0] rounded-t-sm h-[30%] animate-pulse shadow-[0_0_5px_#cddfa0]"></div>
                  <div className="w-2 bg-[#cddfa0] rounded-t-sm h-[80%] animate-pulse shadow-[0_0_5px_#cddfa0]" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 bg-[#cddfa0] rounded-t-sm h-[50%] animate-pulse shadow-[0_0_5px_#cddfa0]" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 bg-[#cddfa0] rounded-t-sm h-[100%] animate-pulse shadow-[0_0_5px_#cddfa0]" style={{ animationDelay: '0.3s' }}></div>
                  <div className="w-2 bg-[#cddfa0] rounded-t-sm h-[60%] animate-pulse shadow-[0_0_5px_#cddfa0]" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>

            {/* System Selection Menu (Buttons) */}
            <div className="grid grid-cols-2 gap-4">
              {smartSystems.map((sys) => (
                <button
                  key={sys.id}
                  onClick={() => handleSystemChange(sys)}
                  className={`flex flex-col items-start p-5 rounded-2xl border transition-all duration-300 text-left ${
                    activeSystem.id === sys.id
                      ? "bg-[#cddfa0]/20 border-[#cddfa0]/50 shadow-[0_0_20px_rgba(205,223,160,0.1)]"
                      : "bg-[#081d19]/40 backdrop-blur-md border-white/5 hover:bg-[#cddfa0]/5 hover:border-[#cddfa0]/20"
                  }`}
                >
                  <div className={`mb-3 transition-colors ${activeSystem.id === sys.id ? 'text-[#cddfa0]' : 'text-white/40'}`}>
                    {sys.icon}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest transition-colors ${activeSystem.id === sys.id ? 'text-white' : 'text-white/50'}`}>
                    {sys.id}
                  </span>
                </button>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}