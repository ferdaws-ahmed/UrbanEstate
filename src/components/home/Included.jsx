"use client";

import React, { useState } from "react";
import { Manrope } from "next/font/google";
import { Sun, CloudSun, Sunset, Moon, Thermometer, Zap, ShieldCheck, Wind, Upload, Trash2 } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const defaultImage = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1600&auto=format&fit=crop";

const timeStates = [
  {
    id: "morning",
    time: "07:30 AM",
    label: "Morning Breeze",
    icon: <CloudSun size={24} />,
    glow: "rgba(253, 224, 71, 0.15)",
    imageFilter: "brightness(1.1) contrast(1.05) saturate(1.1)",
    overlayClass: "bg-gradient-to-b from-yellow-200/20 to-transparent mix-blend-overlay",
    stats: { temp: "22°C", power: "Solar Charging (2kW)", security: "Perimeter Relaxed" }
  },
  {
    id: "noon",
    time: "01:00 PM",
    label: "Peak Daylight",
    icon: <Sun size={24} />,
    glow: "rgba(255, 255, 255, 0.1)", 
    imageFilter: "brightness(1.2) contrast(1.1) saturate(1.2)",
    overlayClass: "bg-transparent",
    stats: { temp: "28°C", power: "Max Solar (15kW)", security: "Standard Monitoring" }
  },
  {
    id: "sunset",
    time: "06:15 PM",
    label: "Golden Hour",
    icon: <Sunset size={24} />,
    glow: "rgba(249, 115, 22, 0.2)", 
    imageFilter: "brightness(0.9) contrast(1.15) sepia(0.3) saturate(1.4)",
    overlayClass: "bg-gradient-to-tr from-orange-600/40 via-red-500/20 to-transparent mix-blend-multiply",
    stats: { temp: "25°C", power: "Battery Optimized", security: "Auto-Lock Initiated" }
  },
  {
    id: "night",
    time: "11:45 PM",
    label: "Midnight Serenity",
    icon: <Moon size={24} />,
    glow: "rgba(59, 130, 246, 0.15)", 
    imageFilter: "brightness(0.4) contrast(1.2) sepia(0.4) hue-rotate(180deg) saturate(1.2)",
    overlayClass: "bg-gradient-to-b from-blue-900/70 via-indigo-900/60 to-black/80 mix-blend-multiply",
    stats: { temp: "19°C", power: "Grid Independence", security: "Max Biometric Armed" }
  }
];


const generateRandomStats = () => {
  const getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const getRandomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return {
    morning: {
      temp: `${getRandom(18, 24)}°C`,
      power: getRandomItem(["Eco Sync (1.5kW)", "Grid Standard", "Solar Waking (0.8kW)", "Battery Reserve 80%"]),
      security: getRandomItem(["Perimeter Scan", "Sensors On", "Day Watch Initiated", "All Clear"])
    },
    noon: {
      temp: `${getRandom(27, 36)}°C`,
      power: getRandomItem(["Max Solar (18kW)", "Grid Selling", "A/C Overdrive (5kW)", "Full Capacity"]),
      security: getRandomItem(["Facial Rec Active", "Standard Mode", "Entry Monitored", "Zone 2 Alert"])
    },
    sunset: {
      temp: `${getRandom(22, 27)}°C`,
      power: getRandomItem(["Battery Switching", "Solar Fading (1kW)", "Grid Blending", "Wind Boost (2kW)"]),
      security: getRandomItem(["Evening Lock", "Motion Active", "Perimeter Armed", "Thermal On"])
    },
    night: {
      temp: `${getRandom(14, 20)}°C`,
      power: getRandomItem(["Battery Drain (3kW)", "Grid Draw", "Power Save Mode", "Emergency Backup Ready"]),
      security: getRandomItem(["Biometric Locked", "AI Patrol Active", "Drone Standby", "Max Security Armed"])
    }
  };
};

export default function AtmosphericSimulator() {
  const [activeState, setActiveState] = useState(timeStates[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [customImage, setCustomImage] = useState(defaultImage);
  
 
  const [customStats, setCustomStats] = useState(null);

  const handleTimeChange = (state) => {
    if (activeState.id === state.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveState(state);
      setIsTransitioning(false);
    }, 150); 
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCustomImage(imageUrl);
      

      setCustomStats(generateRandomStats());
    }
  };

  const handleRemoveImage = () => {
    setCustomImage(defaultImage);
   
    setCustomStats(null);
  };

 
  const currentDisplayStats = customImage !== defaultImage && customStats 
    ? customStats[activeState.id] 
    : activeState.stats;

  return (
    <section className={`relative w-full py-24 px-6 lg:px-12 bg-[#0f2e28] overflow-hidden ${manrope.className} transition-colors duration-1000`}>
      
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-in-out z-0"
        style={{ background: `radial-gradient(circle at 50% 50%, ${activeState.glow} 0%, transparent 60%)` }}
      ></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <Wind size={14} className="animate-pulse" /> AI Analyzed
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Atmospheric <span className="text-[#cddfa0] italic font-light">Simulator</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Experience your property's aura at any hour. Upload your own image and let our system simulate dynamic system status throughout the day.
          </p>
        </div>

        <div className="relative bg-[#081d19]/80 backdrop-blur-2xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            
            <div className="lg:col-span-8 relative min-h-[400px] lg:min-h-full overflow-hidden bg-black flex items-stretch">
              
              <img 
                src={customImage} 
                alt="Property View" 
                className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-in-out"
                style={{ filter: activeState.imageFilter }}
              />
              
              <div className={`absolute inset-0 transition-all duration-1000 ease-in-out ${activeState.overlayClass}`}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent pointer-events-none"></div>

              <div className={`absolute bottom-8 left-8 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter drop-shadow-lg mb-2">
                  {activeState.time}
                </h1>
                <p className="text-[#cddfa0] text-lg font-medium tracking-widest uppercase drop-shadow-md">
                  {activeState.label}
                </p>
              </div>

            </div>

            <div className="lg:col-span-4 p-8 flex flex-col justify-between bg-white/5 relative z-10 border-l border-white/10 h-full">
              
              <div>
                <div className="mb-8 flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-[#cddfa0]/40 bg-[#cddfa0]/5 text-[#cddfa0] cursor-pointer hover:bg-[#cddfa0]/10 hover:border-[#cddfa0] transition-all duration-300">
                    <Upload size={18} />
                    <span className="font-semibold text-xs tracking-wide">Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="hidden" 
                    />
                  </label>

                  {customImage !== defaultImage && (
                    <button 
                      onClick={handleRemoveImage}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 cursor-pointer hover:bg-red-500/20 hover:border-red-500 transition-all duration-300"
                      title="Remove Custom Image"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-6 border-b border-white/10 pb-4">
                  Select Time Phase
                </p>

                <div className="space-y-3 mb-8">
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
                      <div className={`w-2 h-2 rounded-full transition-all ${activeState.id === state.id ? 'bg-[#0f2e28] shadow-[0_0_5px_#0f2e28]' : 'bg-transparent'}`}></div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
                <p className="text-[#cddfa0] text-[10px] font-bold tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                  Live System Status {customImage !== defaultImage && <span className="bg-[#cddfa0]/20 text-[#cddfa0] px-2 py-0.5 rounded-full text-[8px]">Auto-Generated</span>}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <Thermometer size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Ambient Temp</p>
                   
                      <p className="text-white text-sm font-semibold tracking-wide">{currentDisplayStats.temp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <Zap size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Energy Grid</p>
                      <p className="text-white text-sm font-semibold tracking-wide">{currentDisplayStats.power}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5">
                    <ShieldCheck size={18} className="text-[#cddfa0]" />
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-widest font-bold">Security Level</p>
                      <p className="text-white text-sm font-semibold tracking-wide">{currentDisplayStats.security}</p>
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