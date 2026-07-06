"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import {
  Mountain,
  Wind,
  ShieldCheck,
  Radar,
  ArrowUpRight,
  Activity,
} from "lucide-react";
import { useTheme } from "../Theme/ThemeContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const scanModes = [
  {
    id: "elevation",
    label: "Elevation & Flood Risk",
    icon: <Mountain size={18} />,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2OhjS9W2jT0rIOeBb6lD12UlgLevt-hSM3Q&s",
    data: {
      MeanSeaLevel: "+18.5m",
      RiskStatus: "LOW (Safe)",
      SlopeGradient: "2.4°",
    },
    desc: "Laser-derived terrain mapping indicates the property sits significantly above regional flood lines.",
  },
  {
    id: "wind",
    label: "Micro-Climate Airflow",
    icon: <Wind size={18} />,
    image:
      "https://frontend-assets.simscale.com/media/2019/05/wind_engineering_blog_airflow.png",
    data: {
      WindDirection: "South-East",
      AvgSpeed: "12 km/h",
      Ventilation: "Optimal",
    },
    desc: "Computational fluid dynamics show consistent cross-ventilation corridors across all living spaces.",
  },
  {
    id: "stability",
    label: "Terra-Stability Matrix",
    icon: <ShieldCheck size={18} />,
    image:
      "https://thumbs.dreamstime.com/b/d-rendered-cross-section-soil-layers-illustrating-different-geological-strata-diagram-showcases-topsoil-sand-silt-clay-407500304.jpg",
    data: {
      FoundationDepth: "32m Piling",
      SeismicZone: "Zone 2",
      SoilDensity: "High",
    },
    desc: "Sub-surface ultrasonic scans verify a dense rock-base foundation, ensuring maximum structural stability.",
  },
];

export default function AeroTopoScanner() {
  const [activeMode, setActiveMode] = useState(scanModes[0]);
  const [mounted, setMounted] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section
      className={`w-full py-24 px-6 lg:px-12 relative overflow-hidden ${manrope.className}`}
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--primary)]/5 blur-[200px] rounded-full pointer-events-none"></div>
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 font-bold tracking-[0.4em] text-[10px] uppercase px-5 py-2 rounded-full border mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]"
            style={{
              color: "var(--accent)",
              backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
              borderColor: "rgba(var(--accent), 0.2)"
            }}
          >
            <Radar size={14} className="animate-pulse" /> Geospatial
            Intelligence Unit
          </div>
          <h2
            className="text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-[1.1]"
            style={{ color: "var(--foreground)" }}
          >
            Micro-Climate
            <span style={{ color: "var(--accent)" }} className="italic font-light"> Scanner</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            <p
              className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--muted-foreground)" }}
            >
              Select Simulation Mode
            </p>
            <div className="flex flex-col gap-3">
              {scanModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode)}
                  className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 text-left group"
                  style={{
                    backgroundColor: activeMode.id === mode.id
                      ? "var(--primary)"
                      : isDark
                        ? "rgba(255,255,255,0.03)"
                        : "rgba(0,0,0,0.03)",
                    borderColor: activeMode.id === mode.id
                      ? "var(--accent)"
                      : isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(var(--primary), 0.1)"
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="p-2 rounded-lg transition-colors"
                      style={{
                        backgroundColor: activeMode.id === mode.id
                          ? "var(--card)"
                          : isDark
                            ? "rgba(255,255,255,0.1)"
                            : "rgba(0,0,0,0.1)",
                        color: activeMode.id === mode.id
                          ? "var(--accent)"
                          : "var(--accent)"
                      }}
                    >
                      {mode.icon}
                    </div>
                    <span
                      className="font-bold text-sm tracking-wide"
                      style={{
                        color: activeMode.id === mode.id
                          ? "var(--primary-foreground)"
                          : "var(--foreground)"
                      }}
                    >
                      {mode.label}
                    </span>
                  </div>
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-500"
                    style={{
                      color: activeMode.id === mode.id
                        ? "var(--primary-foreground)"
                        : "var(--foreground)",
                      transform: activeMode.id === mode.id ? "rotate(45deg)" : "none"
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Readout Box */}
            <div 
              className="backdrop-blur-xl rounded-3xl p-8 relative overflow-hidden shadow-2xl border"
              style={{ 
                backgroundColor: "rgba(var(--card), 0.6)", 
                borderColor: "var(--border)" 
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-bold uppercase tracking-widest text-[10px] flex items-center gap-2" style={{ color: "var(--accent)" }}>
                  <Activity size={14} className="animate-pulse" /> Live Sensor
                  Data
                </h5>
                <span style={{ color: "var(--muted-foreground)" }} className="font-mono text-[8px]">
                  REF: 88-X09
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(activeMode.data).map(([key, value]) => (
                  <div
                    key={key}
                    className="p-4 rounded-xl border"
                    style={{ 
                      backgroundColor: isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.05)",
                      borderColor: "var(--border)"
                    }}
                  >
                    <p className="text-[8px] uppercase font-black mb-1" style={{ color: "var(--accent)" }}>
                      {key}
                    </p>
                    <p className="font-mono text-sm font-bold" style={{ color: "var(--foreground)" }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-xs leading-relaxed italic border-t pt-4" style={{ 
                color: "var(--muted-foreground)", 
                borderColor: "var(--border)" 
              }}>
                "{activeMode?.desc}"
              </p>
            </div>
          </div>

          {/* Right: The Logic-Based Visualizer */}
          <div 
            className="lg:col-span-8 relative aspect-video lg:aspect-auto h-[450px] lg:h-[650px] rounded-[3rem] overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.4)] group"
            style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="absolute inset-0 transition-all duration-1000 transform group-hover:scale-105">
              <img
                key={activeMode.id}
                src={activeMode.image}
                alt={activeMode.label}
                className="w-full h-full object-cover opacity-40 grayscale mix-blend-luminosity animate-in fade-in duration-700"
              />
              <div className="absolute inset-0" style={{ backgroundColor: "var(--background)", mixBlendMode: "color", opacity: 0.7 }}></div>
              <div className="absolute inset-0" style={{ background: isDark 
                ? "linear-gradient(to top, #0f172a, transparent, transparent)"
                : "linear-gradient(to top, #f0f8f0, transparent, transparent)", 
                opacity: 0.8 }}></div>
            </div>

            {/* Technical HUD Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[1px] origin-center animate-[spin_10s_linear_infinite]" style={{ backgroundColor: "rgba(var(--primary), 0.1)" }}></div>
              <div className="absolute w-full h-[2px] top-0 animate-[scan_5s_ease-in-out_infinite]" style={{ 
                background: `linear-gradient(to right, transparent, var(--accent), transparent)`, 
                opacity: 0.4 
              }}></div>

              <div className="absolute top-8 left-10 flex flex-col gap-1">
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase drop-shadow-md" style={{ color: "var(--accent)" }}>
                  Status: Analyzing Environment
                </span>
                <span className="font-mono text-[8px] uppercase tracking-tighter italic" style={{ color: "var(--muted-foreground)" }}>
                  Target Sector: Delta-9 // 23.9452 N, 90.2706 E
                </span>
              </div>

              {/* Dynamic Logic Visuals */}
              <div className="absolute inset-0 flex items-center justify-center">
                {activeMode.id === "elevation" && (
                  <div className="w-full h-full opacity-30">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,30 Q25,25 50,35 T100,30"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="0.2"
                        className="animate-pulse"
                      />
                      <path
                        d="M0,50 Q25,45 50,55 T100,50"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="0.3"
                      />
                      <path
                        d="M0,70 Q25,65 50,75 T100,70"
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth="0.2"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>
                )}

                {activeMode.id === "wind" && (
                  <div className="grid grid-cols-6 gap-20 opacity-30">
                    {[...Array(12)].map((_, i) => (
                      <ArrowUpRight
                        key={i}
                        className="animate-bounce"
                        style={{ 
                          color: "var(--accent)",
                          animationDelay: `${i * 0.2}s` 
                        }}
                        size={40}
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                )}

                {activeMode.id === "stability" && (
                  <div className="relative">
                    <div className="w-48 h-48 border-2 rounded-full animate-ping" style={{ borderColor: "rgba(var(--accent), 0.1)" }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <ShieldCheck
                        size={80}
                        className="opacity-80"
                        style={{ color: "var(--accent)" }}
                        strokeWidth={1}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Central Crosshair */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <div className="w-10 h-10 border-2 rounded-full" style={{ borderColor: "var(--accent)" }}></div>
                <div className="absolute top-1/2 left-0 w-10 h-[1px] -translate-y-1/2" style={{ backgroundColor: "var(--primary)" }}></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-10 -translate-x-1/2" style={{ backgroundColor: "var(--primary)" }}></div>
              </div>
            </div>

            {/* Bottom Tag */}
            <div className="absolute bottom-10 left-10 z-30 flex items-center gap-3 backdrop-blur-md px-6 py-3 rounded-full border shadow-xl" style={{ 
              backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.6)", 
              borderColor: "var(--border)" 
            }}>
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--primary)" }}></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: "var(--foreground)" }}>
                Simulation Active // HD Feed
              </span>
            </div>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 0.8; }
          100% { top: 100%; opacity: 0; }
        }
      `,
        }}
      />
    </section>
  );
}

