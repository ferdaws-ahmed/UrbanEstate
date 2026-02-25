"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Manrope } from "next/font/google";
import { MapContainer, TileLayer, Circle, Polygon, Popup, useMap, Marker, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { Volume2, ShieldCheck, Wind, MapPin, Layers, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Default Center: Baipayl, Dhaka Division (Apnar Current Location)
const defaultCenter = { lat: 23.9452, lng: 90.2706 };

// --- Updated Dummy Data (Around Baipayl) ---
const noiseAreas = [
  { id: 1, name: "Baipayl Intersection", lat: 23.9465, lng: 90.2715, intensity: 0.9, level: "High (90dB+)" },
  { id: 2, name: "Baipayl Bus Stand", lat: 23.9440, lng: 90.2700, intensity: 0.7, level: "Moderate (75dB)" },
  { id: 3, name: "DEPZ Gate Area", lat: 23.9520, lng: 90.2680, intensity: 0.8, level: "High (85dB+)" },
];

const crimeAreas = [
  {
    id: 1,
    name: "Residential Zone (North)",
    polygon: [[23.948, 90.272], [23.948, 90.278], [23.942, 90.278], [23.942, 90.272]],
    safetyScore: 0.9,
    status: "Very Safe",
  },
  {
    id: 2,
    name: "Baipayl Housing Society",
    polygon: [[23.940, 90.268], [23.940, 90.274], [23.935, 90.274], [23.935, 90.268]],
    safetyScore: 0.8,
    status: "Safe",
  },
];

const aqiAreas = [
  { id: 1, name: "DEPZ Industrial Zone", polygon: [[23.960, 90.265], [23.960, 90.275], [23.950, 90.275], [23.950, 90.265]], aqi: 160, status: "Unhealthy" },
  { id: 2, name: "Green Residential Area", polygon: [[23.940, 90.255], [23.940, 90.265], [23.930, 90.265], [23.930, 90.255]], aqi: 80, status: "Moderate" },
];

// --- Map Overlays & Live Location Component ---
function MapOverlays({ showNoise, showCrime, showAQI }) {
  const map = useMap();
  
  const [userLocation, setUserLocation] = useState([defaultCenter.lat, defaultCenter.lng]);

  // Live Location Tracking
  useEffect(() => {
    map.flyTo(userLocation, 14, { duration: 1.5 });

    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
        map.flyTo([latitude, longitude], map.getZoom(), { duration: 1.0 });
      },
      (error) => console.error("Error getting location: ", error),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  // Pulse (Red Dot) Icon
  const pulseIcon = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new L.divIcon({
      className: "bg-transparent border-none",
      html: '<div class="pulse-dot"></div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  return (
    <>
      {userLocation && pulseIcon && (
        <Marker position={userLocation} icon={pulseIcon}>
          <Popup>
            <div className="font-bold text-white text-base flex items-center gap-2">
              <Navigation size={16} className="text-[#ef4444]" /> Your Current Location
            </div>
            <div className="text-xs text-white/60 mt-1">Updating in real-time</div>
          </Popup>
        </Marker>
      )}

      {showNoise &&
        noiseAreas.map((n) => (
          <Circle
            key={`noise-${n.id}`}
            center={[n.lat, n.lng]}
            radius={500}
            pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.25 * n.intensity, weight: 1.5 }}
          >
            <Popup>
              <div className="font-bold text-white text-base">{n.name}</div>
              <div className="text-sm text-red-400 font-medium mt-1">Noise Level: {n.level}</div>
            </Popup>
          </Circle>
        ))}

      {showCrime &&
        crimeAreas.map((c) => (
          <Polygon
            key={`crime-${c.id}`}
            positions={c.polygon}
            pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.25 * c.safetyScore, weight: 2 }}
          >
            <Popup>
              <div className="font-bold text-white text-base">{c.name}</div>
              <div className="text-sm text-green-400 font-medium mt-1">Status: {c.status}</div>
              <div className="text-xs text-white/60 mt-1">Safety Score: {c.safetyScore * 100}%</div>
            </Popup>
          </Polygon>
        ))}

      {showAQI &&
        aqiAreas.map((a) => {
          const color = a.aqi > 150 ? "#ef4444" : a.aqi > 100 ? "#facc15" : "#10b981";
          return (
            <Polygon 
              key={`aqi-${a.id}`} 
              positions={a.polygon} 
              pathOptions={{ color, fillColor: color, fillOpacity: 0.2, weight: 2 }}
            >
              <Popup>
                <div className="font-bold text-white text-base">{a.name}</div>
                <div className="text-sm font-medium mt-1" style={{ color: color }}>AQI Level: {a.aqi} ({a.status})</div>
              </Popup>
            </Polygon>
          );
        })}
    </>
  );
}

// --- Main Export Component ---
export default function EnvironmentalLayers() {
  const [showNoise, setShowNoise] = useState(false);
  const [showCrime, setShowCrime] = useState(false);
  const [showAQI, setShowAQI] = useState(false);

  // Custom Modern Toggle Switch
  const ToggleSwitch = ({ checked, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full flex items-center transition-all duration-300 px-1 focus:outline-none border ${
        checked ? "bg-[#cddfa0] border-[#cddfa0]" : "bg-white/10 border-white/20 hover:border-white/40"
      }`}
    >
      <div
        className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
          checked ? "translate-x-6 bg-[#0f2e28]" : "translate-x-0 bg-white"
        }`}
      />
    </button>
  );

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] bg-[#cddfa0]/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      {/* CSS For Popup, Live Pulse Dot & Zoom Controls */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Custom Zoom Controls Theme */
        .leaflet-bar a {
          background-color: #081d19 !important;
          color: #cddfa0 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          transition: all 0.3s ease;
        }
        .leaflet-bar a:hover {
          background-color: #0f2e28 !important;
          color: #ffffff !important;
        }
        .leaflet-control-zoom {
          border: none !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3) !important;
          border-radius: 8px !important;
          overflow: hidden;
          margin-top: 20px !important;
          margin-right: 20px !important;
        }

        /* Popups */
        .leaflet-popup-content-wrapper, .leaflet-popup-tip {
          background-color: #081d19 !important;
          color: white !important;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5) !important;
        }
        .leaflet-popup-close-button {
          color: #cddfa0 !important;
          margin-top: 4px !important;
          margin-right: 4px !important;
        }
        .leaflet-container { font-family: inherit; background-color: #e5e7eb !important; }
        
        /* Red Pulse Animation for Live Location */
        .pulse-dot {
          width: 24px;
          height: 24px;
          background-color: #ef4444;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.8);
          animation: pulse-red 1.5s infinite;
        }
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.9); }
          70% { box-shadow: 0 0 0 20px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-6">
            <Layers size={14} /> Intelligent Mapping
          </div>
          <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 tracking-tight leading-[1.1]">
            Neighborhood <span className="text-[#cddfa0] italic font-light">Insights</span>
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            Explore environmental factors, safety zones, and noise levels with our interactive data overlays to make the best real estate decision.
          </p>
        </div>

        {/* Main Content Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-[#081d19]/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
          
          {/* Left: Map Area */}
          <div className="lg:col-span-8 h-[500px] lg:h-[650px] relative z-0 border-r border-white/10">
            <MapContainer 
              center={[defaultCenter.lat, defaultCenter.lng]} 
              zoom={13} 
              style={{ height: "100%", width: "100%", zIndex: 10 }}
              zoomControl={false} 
            >
              {/* Voyager Map Tiles (Evabe nam gulo onnek clear dekha jabe) */}
              <TileLayer 
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
              />
              <MapOverlays showNoise={showNoise} showCrime={showCrime} showAQI={showAQI} />
              
              {/* Custom Positioned Zoom Controls (+ / -) -> Top Right */}
              <ZoomControl position="topright" />
            </MapContainer>
            
            {/* Inner Shadow for Map depth */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(8,29,25,0.8)] z-20"></div>
          </div>

          {/* Right: Control Panel */}
          <div className="lg:col-span-4 p-8 lg:p-10 flex flex-col justify-between bg-white/5 z-10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                <MapPin className="text-[#cddfa0]" size={24} /> Controls
              </h3>
              <p className="text-sm text-white/50 mb-10">Toggle the layers to visualize specific area data.</p>

              <div className="space-y-5">
                
                {/* Noise Toggle Card */}
                <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:bg-white/5 ${showNoise ? 'border-[#ef4444]/50 bg-[#ef4444]/10' : 'border-white/10'}`} onClick={() => setShowNoise(!showNoise)}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${showNoise ? 'bg-[#ef4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-white/10 text-white/60'}`}>
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-wide">Noise Pollution</div>
                      <div className="text-xs text-white/40 mt-1">Highways & intersections</div>
                    </div>
                  </div>
                  <ToggleSwitch checked={showNoise} onChange={() => setShowNoise(!showNoise)} />
                </div>

                {/* Crime Toggle Card */}
                <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:bg-white/5 ${showCrime ? 'border-[#10b981]/50 bg-[#10b981]/10' : 'border-white/10'}`} onClick={() => setShowCrime(!showCrime)}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${showCrime ? 'bg-[#10b981] text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/10 text-white/60'}`}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-wide">Safety Rate</div>
                      <div className="text-xs text-white/40 mt-1">Highlights secure areas</div>
                    </div>
                  </div>
                  <ToggleSwitch checked={showCrime} onChange={() => setShowCrime(!showCrime)} />
                </div>

                {/* AQI Toggle Card */}
                <div className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 cursor-pointer hover:bg-white/5 ${showAQI ? 'border-[#facc15]/50 bg-[#facc15]/10' : 'border-white/10'}`} onClick={() => setShowAQI(!showAQI)}>
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${showAQI ? 'bg-[#facc15] text-[#0f2e28] shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'bg-white/10 text-white/60'}`}>
                      <Wind size={20} />
                    </div>
                    <div>
                      <div className="font-bold text-white tracking-wide">Air Quality (AQI)</div>
                      <div className="text-xs text-white/40 mt-1">Good vs Poor air zones</div>
                    </div>
                  </div>
                  <ToggleSwitch checked={showAQI} onChange={() => setShowAQI(!showAQI)} />
                </div>

              </div>
            </div>

            {/* Legend (Bottom) */}
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="text-sm font-bold text-[#cddfa0] mb-4 uppercase tracking-widest">Map Legend</div>
              <div className="grid grid-cols-2 gap-4 text-xs text-white/70 font-medium">
                <div className="flex items-center gap-3"><span className="w-3 h-3 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444]" /> High Noise</div>
                <div className="flex items-center gap-3"><span className="w-3 h-3 bg-[#10b981] rounded-full shadow-[0_0_10px_#10b981]" /> Safe Area</div>
                <div className="flex items-center gap-3"><span className="w-3 h-3 bg-[#ef4444] rounded-full shadow-[0_0_10px_#ef4444] animate-pulse border border-white" /> Live Location</div>
                <div className="flex items-center gap-3"><span className="w-3 h-3 bg-[#b91c1c] rounded-full shadow-[0_0_10px_#b91c1c]" /> Poor AQI</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}