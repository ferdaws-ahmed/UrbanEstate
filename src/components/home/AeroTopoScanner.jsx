"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Mountain, Wind, ShieldCheck, Radar, ArrowUpRight, Activity } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const scanModes = [
  {
    id: "elevation",
    label: "Elevation & Flood Risk",
    icon: <Mountain size={18} />,
    image: "https://miro.medium.com/1*PDr78op_WYIm22bOKSo-4g.png", 
    data: { MeanSeaLevel: "+18.5m", RiskStatus: "LOW (Safe)", SlopeGradient: "2.4°" },
    desc: "Laser-derived terrain mapping indicates the property sits significantly above regional flood lines."
  },
  {
    id: "wind",
    label: "Micro-Climate Airflow",
    icon: <Wind size={18} />,
    image: "https://frontend-assets.simscale.com/media/2019/05/wind_engineering_blog_airflow.png", 
    data: { WindDirection: "South-East", AvgSpeed: "12 km/h", Ventilation: "Optimal" },
    desc: "Computational fluid dynamics show consistent cross-ventilation corridors across all living spaces."
  },
  {
    id: "stability",
    label: "Terra-Stability Matrix",
    icon: <ShieldCheck size={18} />,
    image: "https://cdn.corporatefinanceinstitute.com/assets/what-happened-terra-1-1024x808.png", 
    data: { FoundationDepth: "32m Piling", SeismicZone: "Zone 2", SoilDensity: "High" },
    desc: "Sub-surface ultrasonic scans verify a dense rock-base foundation, ensuring maximum structural stability."
  }
];

export default function AeroTopoScanner() {
  const [activeMode, setActiveMode] = useState(scanModes[0]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
  
    <section className={`w-full py-24 px-6 lg:px-12 bg-gradient-to-b from-[#0a2e26] to-[#061510] relative overflow-hidden ${manrope.className}`}>
      
     =
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#cddfa0]/5 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-[#cddfa0]/20 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <Radar size={14} className="animate-pulse" /> Geospatial Intelligence Unit
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Micro-Climate<span className="text-[#cddfa0] italic font-light"> Scanner</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Select Simulation Mode</p>
            <div className="flex flex-col gap-3">
              {scanModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 text-left group ${
                    activeMode.id === mode.id
                      ? "bg-[#cddfa0] border-[#cddfa0] shadow-[0_10px_40px_rgba(205,223,160,0.2)]"
                      : "bg-white/[0.03] border-white/10 hover:border-[#cddfa0]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${activeMode.id === mode.id ? 'bg-[#061510] text-[#cddfa0]' : 'bg-white/10 text-[#cddfa0]'}`}>
                      {mode.icon}
                    </div>
                    <span className={`font-bold text-sm tracking-wide ${activeMode.id === mode.id ? 'text-[#061510]' : 'text-white/80 group-hover:text-white'}`}>
                      {mode.label}
                    </span>
                  </div>
                  <ArrowUpRight size={16} className={`transition-transform duration-500 ${activeMode.id === mode.id ? 'text-[#061510] rotate-45' : 'text-white/20'}`} />
                </button>
              ))}
            </div>

            {/* Readout Box */}
            <div className="bg-[#0a231f]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-[#cddfa0] font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" /> Live Sensor Data
                </h5>
                <span className="text-white/20 font-mono text-[8px]">REF: 88-X09</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(activeMode.data).map(([key, value]) => (
                  <div key={key} className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-[#cddfa0]/40 text-[8px] uppercase font-black mb-1">{key}</p>
                    <p className="text-white font-mono text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs leading-relaxed italic border-t border-white/5 pt-4">
                "{activeMode.desc}"
              </p>
            </div>
          </div>

          {/* Right: The Logic-Based Visualizer */}
          <div className="lg:col-span-8 relative aspect-video lg:aspect-auto h-[450px] lg:h-[650px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] bg-[#040f0c] group">
            
            <div className="absolute inset-0 transition-all duration-1000 transform group-hover:scale-105">
              <img 
                key={activeMode.id}
                src={activeMode.image} 
                alt={activeMode.label} 
                className="w-full h-full object-cover opacity-40 grayscale mix-blend-luminosity animate-in fade-in duration-700"
              />
              <div className="absolute inset-0 bg-[#0a2e26] mix-blend-color opacity-70"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#061510] via-transparent to-transparent opacity-80"></div>
            </div>

            {/* Technical HUD Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[1px] bg-[#cddfa0]/10 origin-center animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#cddfa0]/40 to-transparent shadow-[0_0_15px_#cddfa0] top-0 animate-[scan_5s_ease-in-out_infinite]"></div>
              
              <div className="absolute top-8 left-10 flex flex-col gap-1">
                <span className="text-[#cddfa0] font-mono text-[10px] tracking-[0.2em] uppercase drop-shadow-md">Status: Analyzing Environment</span>
                <span className="text-white/40 font-mono text-[8px] uppercase tracking-tighter italic">Target Sector: Delta-9 // 23.9452 N, 90.2706 E</span>
              </div>

              {/* Dynamic Logic Visuals */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeMode.id === 'elevation' && (
                  <div className="w-full h-full opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path d="M0,30 Q25,25 50,35 T100,30" fill="none" stroke="#cddfa0" strokeWidth="0.2" className="animate-pulse" />
                       <path d="M0,50 Q25,45 50,55 T100,50" fill="none" stroke="#cddfa0" strokeWidth="0.3" />
                       <path d="M0,70 Q25,65 50,75 T100,70" fill="none" stroke="#cddfa0" strokeWidth="0.2" className="animate-pulse" />
                    </svg>
                  </div>
                )}
                
                {activeMode.id === 'wind' && (
                  <div className="grid grid-cols-6 gap-20 opacity-30">
                    {[...Array(12)].map((_, i) => (
                      <ArrowUpRight key={i} className="text-[#cddfa0] animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} size={40} strokeWidth={1} />
                    ))}
                  </div>
                )}

                {activeMode.id === 'stability' && (
                  <div className="relative">
                    <div className="w-48 h-48 border-2 border-[#cddfa0]/10 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ShieldCheck size={80} className="text-[#cddfa0] opacity-80 drop-shadow-[0_0_15px_#cddfa0]" strokeWidth={1} />
                    </div>
                  </div>
                )}
              </div>

              {/* Central Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <div className="w-10 h-10 border-2 border-[#cddfa0] rounded-full"></div>
                <div className="absolute top-1/2 left-0 w-10 h-[1px] bg-[#cddfa0] -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-10 bg-[#cddfa0] -translate-x-1/2"></div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="absolute bottom-10 left-10 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-[#cddfa0] animate-pulse shadow-[0_0_10px_#cddfa0]"></div>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Simulation Active // HD Feed</span>
            </div>

          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `}} />
    </section>
  );    
}