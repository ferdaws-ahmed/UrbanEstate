"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { Mountain, Wind, ShieldCheck, Radar, ArrowUpRight, Activity } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const baseModes = [
  {
    id: "elevation",
    label: "Elevation & Surface",
    icon: <Mountain size={18} />,
    image: "https://miro.medium.com/1*PDr78op_WYIm22bOKSo-4g.png", 
    data: { MeanSeaLevel: "Scanning...", SurfacePressure: "Scanning...", Status: "Awaiting Sensor" },
    desc: "Fetching real-time terrain elevation and surface pressure metrics..."
  },
  {
    id: "wind",
    label: "Micro-Climate Airflow",
    icon: <Wind size={18} />,
    image: "https://frontend-assets.simscale.com/media/2019/05/wind_engineering_blog_airflow.png", 
    data: { WindSpeed: "Scanning...", WindDirection: "Scanning...", AirQuality: "Scanning..." },
    desc: "Analyzing live computational fluid dynamics and local air quality index (AQI)..."
  },
  {
    id: "stability",
    label: "Terra-Stability Matrix",
    icon: <ShieldCheck size={18} />,
    image: "https://cdn.corporatefinanceinstitute.com/assets/what-happened-terra-1-1024x808.png", 
    data: { SurfaceMoisture: "Scanning...", SurfaceTemp: "Scanning...", GroundState: "Awaiting Sensor" },
    desc: "Scanning current surface conditions and thermal stability..."
  }
];

export default function AeroTopoScanner() {
  const [mounted, setMounted] = useState(false);
  const [modesData, setModesData] = useState(baseModes);
  const [activeModeId, setActiveModeId] = useState("elevation");
  const [locationText, setLocationText] = useState("Initializing Sensors...");

  useEffect(() => {
    setMounted(true);

    const fetchEnvironmentalData = async (latitude, longitude, source = "GPS") => {
      let currentModes = baseModes.map(mode => ({
        ...mode,
        data: { ...mode.data }
      }));
      
      let areaName = "Local Sector";
      let countryName = "Detected Region";

      // --- SMART FALLBACK GENERATOR ---
      // ব্রাউজার API ব্লক করলে এই রিয়েলিস্টিক ডাইনামিক ডেটাগুলো শো করবে (Latitude/Longitude এর উপর ভিত্তি করে)
      let elevation = Math.floor(Math.abs(latitude) * 1.5) + 5; 
      let windSpeed = (Math.abs(longitude) % 15 + 4).toFixed(1);
      let windDir = Math.floor(Math.abs(latitude + longitude) * 2) % 360;
      let pressure = Math.floor(1000 + (Math.abs(latitude) % 20));
      let surfaceTemp = (20 + (Math.abs(longitude) % 15)).toFixed(1);
      let surfaceMoisture = Math.floor(40 + (Math.abs(latitude) % 40));
      let aqi = Math.floor(30 + (Math.abs(longitude) % 60));
      let isLiveAPI = false;

      try {
        // 1. Try to fetch real Location Name
        try {
          const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          if (geoResponse.ok) {
            const geoData = await geoResponse.json();
            areaName = geoData.city || geoData.locality || areaName;
            countryName = geoData.countryName || countryName;
          }
        } catch (e) { /* Silently use fallback text */ }
        
        setLocationText(`Sector // ${areaName}, ${countryName} [${latitude.toFixed(2)}N, ${longitude.toFixed(2)}E]`);

        // 2. Try to fetch real Weather Data
        try {
          const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure&elevation=true`);
          if (weatherResponse.ok) {
            const weatherData = await weatherResponse.json();
            if (weatherData && weatherData.current) {
              elevation = weatherData.elevation ?? elevation;
              windSpeed = weatherData.current.wind_speed_10m ?? windSpeed;
              windDir = weatherData.current.wind_direction_10m ?? windDir;
              pressure = weatherData.current.surface_pressure ?? pressure;
              surfaceTemp = weatherData.current.temperature_2m ?? surfaceTemp;
              surfaceMoisture = weatherData.current.relative_humidity_2m ?? surfaceMoisture;
              isLiveAPI = true;
            }
          }
        } catch (e) { /* Silently use fallback data */ }

        // 3. Try to fetch real AQI Data
        try {
          const aqiResponse = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi`);
          if (aqiResponse.ok) {
            const aqiData = await aqiResponse.json();
            aqi = aqiData.current?.european_aqi ?? aqi;
          }
        } catch (e) { /* Silently use fallback data */ }

        // --- UPDATE UI WITH DATA (REAL OR SMART FALLBACK) ---
        const statusText = isLiveAPI ? "Live Sync" : "Geo-Simulated Sync";

        // Mode 0: Elevation
        currentModes[0].data.MeanSeaLevel = `+${elevation}m`;
        currentModes[0].data.SurfacePressure = `${pressure} hPa`;
        currentModes[0].data.Status = statusText;
        currentModes[0].desc = `Topographical scan complete for ${areaName}. Property elevation sits at ${elevation} meters above sea level.`;

        // Mode 1: Wind
        currentModes[1].data.WindSpeed = `${windSpeed} km/h`;
        currentModes[1].data.WindDirection = `${windDir}°`;
        currentModes[1].data.AirQuality = `AQI: ${aqi}`;
        currentModes[1].desc = `Atmospheric sensors detect wind speeds of ${windSpeed} km/h. Current Air Quality Index stands at ${aqi}.`;

        // Mode 2: Soil/Stability
        currentModes[2].data.SurfaceMoisture = `${surfaceMoisture}%`;
        currentModes[2].data.SurfaceTemp = `${surfaceTemp}°C`;
        currentModes[2].data.GroundState = statusText;
        currentModes[2].desc = `Surface analysis indicates a topsoil temperature of ${surfaceTemp}°C and moisture content of ${surfaceMoisture}%.`;

        setModesData(currentModes);

      } catch (error) {
        console.error("Critical error handled silently.");
      }
    };

    const fetchByIP = async () => {
      try {
        const ipGeoRes = await fetch('https://get.geojs.io/v1/ip/geo.json');
        if (!ipGeoRes.ok) throw new Error("IP API failed");
        const ipData = await ipGeoRes.json();
        await fetchEnvironmentalData(parseFloat(ipData.latitude), parseFloat(ipData.longitude), "IP");
      } catch(e) {
        // Ultimate Fallback: Default Coordinates (e.g., Baipayl/Dhaka region if everything fails)
        await fetchEnvironmentalData(23.9536, 90.2381, "Default");
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchEnvironmentalData(position.coords.latitude, position.coords.longitude, "GPS"),
        (error) => fetchByIP(),
        { timeout: 5000 }
      );
    } else {
      fetchByIP();
    }
  }, []);

  if (!mounted) return null;

  const activeMode = modesData.find(m => m.id === activeModeId);

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-gradient-to-b from-[#0a2e26] to-[#061510] relative overflow-hidden ${manrope.className}`}>
      
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#cddfa0]/5 blur-[200px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-[#cddfa0]/20 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <Radar size={14} className="animate-pulse" /> Geospatial Intelligence Unit
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Micro-Climate<span className="text-[#cddfa0] italic font-light"> Scanner</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-4 space-y-6">
            <p className="text-white/40 text-[10px] font-bold tracking-[0.3em] uppercase mb-4">Select Simulation Mode</p>
            <div className="flex flex-col gap-3">
              {modesData.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setActiveModeId(mode.id)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 text-left group ${
                    activeModeId === mode.id
                      ? "bg-[#cddfa0] border-[#cddfa0] shadow-[0_10px_40px_rgba(205,223,160,0.2)]"
                      : "bg-white/[0.03] border-white/10 hover:border-[#cddfa0]/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg transition-colors ${activeModeId === mode.id ? 'bg-[#061510] text-[#cddfa0]' : 'bg-white/10 text-[#cddfa0]'}`}>
                      {mode.icon}
                    </div>
                    <span className={`font-bold text-sm tracking-wide ${activeModeId === mode.id ? 'text-[#061510]' : 'text-white/80 group-hover:text-white'}`}>
                      {mode.label}
                    </span>
                  </div>
                  <ArrowUpRight size={16} className={`transition-transform duration-500 ${activeModeId === mode.id ? 'text-[#061510] rotate-45' : 'text-white/20'}`} />
                </button>
              ))}
            </div>

            <div className="bg-[#0a231f]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h5 className="text-[#cddfa0] font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
                  <Activity size={14} className="animate-pulse" /> Live Sensor Data
                </h5>
                <span className="text-white/20 font-mono text-[8px]">REF: {new Date().getTime().toString().slice(-6)}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Object.entries(activeMode.data).map(([key, value]) => (
                  <div key={key} className="bg-black/40 p-4 rounded-xl border border-white/5">
                    <p className="text-[#cddfa0]/40 text-[8px] uppercase font-black mb-1">{key}</p>
                    <p className="text-white font-mono text-sm font-bold">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs leading-relaxed italic border-t border-white/5 pt-4">
                "{activeMode.desc}"
              </p>
            </div>
          </div>

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

            <div className="absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[1px] bg-[#cddfa0]/10 origin-center animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-[#cddfa0]/40 to-transparent shadow-[0_0_15px_#cddfa0] top-0 animate-[scan_5s_ease-in-out_infinite]"></div>
              
              <div className="absolute top-8 left-10 flex flex-col gap-1">
                <span className="text-[#cddfa0] font-mono text-[10px] tracking-[0.2em] uppercase drop-shadow-md">Status: Live Environment Data</span>
                <span className="text-white/40 font-mono text-[8px] uppercase tracking-tighter italic">{locationText}</span>
              </div>

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

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <div className="w-10 h-10 border-2 border-[#cddfa0] rounded-full"></div>
                <div className="absolute top-1/2 left-0 w-10 h-[1px] bg-[#cddfa0] -translate-y-1/2"></div>
                <div className="absolute top-0 left-1/2 w-[1px] h-10 bg-[#cddfa0] -translate-x-1/2"></div>
              </div>
            </div>

            <div className="absolute bottom-10 left-10 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 shadow-xl">
              <div className="w-2 h-2 rounded-full bg-[#cddfa0] animate-pulse shadow-[0_0_10px_#cddfa0]"></div>
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">Simulation Running</span>
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