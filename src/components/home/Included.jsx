"use client";

import React, { useState } from "react";
import { Manrope } from "next/font/google";
import { Sun, CloudSun, Sunset, Moon, Thermometer, Zap, ShieldCheck, Wind } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const timeStates = [
  {
    id: "morning",
    time: "07:30 AM",
    label: "Morning Breeze",
    icon: <CloudSun size={24} />,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop", // Bright morning villa
    glow: "rgba(253, 224, 71, 0.15)",
    stats: {
      temp: "22°C",
      power: "Solar Charging (2kW)",
      security: "Perimeter Relaxed",
      vibe: "Fresh & Energizing"
    }
  },
  {
    id: "noon",
    time: "01:00 PM",
    label: "Peak Daylight",
    icon: <Sun size={24} />,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop", // Full bright daylight
    glow: "rgba(255, 255, 255, 0.1)", 
    stats: {
      temp: "28°C",
      power: "Max Solar (15kW)",
      security: "Standard Monitoring",
      vibe: "Vibrant & Clear"
    }
  },
  {
    id: "sunset",
    time: "06:15 PM",
    label: "Golden Hour",
    icon: <Sunset size={24} />,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop", // Warm sunset lighting
    glow: "rgba(249, 115, 22, 0.2)", 
    stats: {
      temp: "25°C",
      power: "Battery Optimized",
      security: "Auto-Lock Initiated",
      vibe: "Warm & Relaxing"
    }
  },
  {
    id: "night",
    time: "11:45 PM",
    label: "Midnight Serenity",
    icon: <Moon size={24} />,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop", // Night time luxury villa
    glow: "rgba(59, 130, 246, 0.15)", 
    stats: {
      temp: "19°C",
      power: "Grid Independence",
      security: "Max Biometric Armed",
      vibe: "Silent & Secure"
    }
  }
];

export default function AtmosphericSimulator() {
  const [activeState, setActiveState] = useState(timeStates[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTimeChange = (state) => {
    if (activeState.id === state.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveState(state);
      setIsTransitioning(false);
    }, 400); 
  };

  return (
    <section className={`relative w-full py-24 px-6 lg:px-12 bg-[#0f2e28] overflow-hidden ${manrope.className} transition-colors duration-1000`}>
      
      {/* Dynamic Ambient Glow matching the time of day */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out z-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${activeState.glow} 0%, transparent 60%)` }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <Wind size={14} className="animate-pulse" /> 4D Experience
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Atmospheric <span className="text-[#cddfa0] italic font-light">Simulator</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Experience the property's aura at any hour. Watch how the architecture, lighting, and smart systems adapt seamlessly from dawn till dusk.
          </p>
        </div>

        {/* Main Simulator Layout */}
        <div className="relative bg-[#081d19]/80 backdrop-blur-2xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Image & Visualizer Area (8 Cols) */}
            <div className="lg:col-span-8 relative aspect-[4/3] lg:aspect-auto h-[400px] lg:h-[650px] overflow-hidden">
              
              {/* Dynamic Property Image with Fade Transition */}
              <img 
                src={activeState.image} 
                alt={activeState.label} 
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out transform ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
              />
              
              {/* Glassmorphism Gradient Overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none"></div>

              {/* Dynamic Time Stamp on Image */}
              <div className={`absolute bottom-8 left-8 transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-lg mb-2">
                  {activeState.time}
                </h1>
                <p className="text-[#cddfa0] text-lg font-medium tracking-widest uppercase drop-shadow-md">
                  {activeState.label}
                </p>
              </div>

            </div>

            {/* Right Control & Data Panel (4 Cols) */}
            <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-between bg-white/5 relative z-10 border-l border-white/10">
              
              <div>
                <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-8 border-b border-white/10 pb-4">
                  Select Time Phase
                </p>

                {/* Interactive Time Selector Buttons */}
                <div className="space-y-4 mb-12">
                  {timeStates.map((state) => (
                    <button
                      key={state.id}
                      onClick={() => handleTimeChange(state)}
                      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                        activeState.id === state.id
                          ? "bg-[#cddfa0] border-[#cddfa0] shadow-[0_0_20px_rgba(205,223,160,0.3)] transform scale-[1.02]"
                          : "bg-black/20 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`transition-colors ${activeState.id === state.id ? 'text-[#0f2e28]' : 'text-white/50'}`}>
                          {state.icon}
                        </div>
                        <div className="text-left">
                          <h4 className={`font-bold tracking-wide transition-colors ${activeState.id === state.id ? 'text-[#0f2e28]' : 'text-white'}`}>
                            {state.label}
                          </h4>
                        </div>
                      </div>
                      {/* Active Dot Indicator */}
                      <div className={`w-2 h-2 rounded-full transition-all ${activeState.id === state.id ? 'bg-[#0f2e28] shadow-[0_0_5px_#0f2e28]' : 'bg-transparent'}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Live Data based on Time */}
              <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[#cddfa0] text-[10px] font-bold tracking-[0.3em] uppercase mb-5">
                  Live System Status
                </p>
                
                <div className="space-y-4">
                  {/* Stat 1: Temperature */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <Thermometer size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Ambient Temp</p>
                      <p className="text-white text-sm font-semibold tracking-wide">{activeState.stats.temp}</p>
                    </div>
                  </div>

                  {/* Stat 2: Solar/Power */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <Zap size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Energy Grid</p>
                      <p className="text-white text-sm font-semibold tracking-wide">{activeState.stats.power}</p>
                    </div>
                  </div>

                  {/* Stat 3: Security */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <ShieldCheck size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Security Level</p>
                      <p className="text-white text-sm font-semibold tracking-wide">{activeState.stats.security}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}