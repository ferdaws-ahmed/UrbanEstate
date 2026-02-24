"use client";

import React, { useEffect, useRef, useState } from "react"; 
import { Manrope } from "next/font/google";
import { MapPin, X, BedDouble, Bath, Maximize, Navigation, Sparkles, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; 

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const generateNearbyData = (centerLat, centerLng, count) => {
  const images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80"
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Premium Property ${i + 1}`,
    price: `৳ ${(Math.random() * 5 + 1).toFixed(1)} Crore`,
    lat: centerLat + (Math.random() - 0.5) * 0.05,
    lng: centerLng + (Math.random() - 0.5) * 0.05,
    beds: Math.floor(Math.random() * 3) + 2,
    baths: Math.floor(Math.random() * 2) + 2,
    size: `${Math.floor(Math.random() * 1000) + 1200} sqft`,
    image: images[i % images.length]
  }));
};

export default function PropertyMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [properties, setProperties] = useState([]);
  const router = useRouter(); 

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          setProperties(generateNearbyData(lat, lng, 30));
        },
        () => {
          const defaultLat = 23.9450, defaultLng = 90.2785; // Baipayl
          setUserLocation([defaultLat, defaultLng]);
          setProperties(generateNearbyData(defaultLat, defaultLng, 30));
        }, 
        { enableHighAccuracy: true }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation || !containerRef.current) return;

    const initMap = async () => {
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement("link");
        link.id = 'leaflet-css'; link.rel = "stylesheet"; 
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.async = true;
        document.body.appendChild(script);
        await new Promise((resolve) => { script.onload = resolve; });
      }

      const L = window.L;
      if (mapRef.current) { mapRef.current.remove(); }

      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: false
      }).setView(userLocation, 14);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
      }).addTo(map);

      L.circle(userLocation, {
        color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, radius: 500
      }).addTo(map);

      const userIcon = L.divIcon({
        className: 'custom-user',
        html: `<div style="background:#ef4444; width:14px; height:14px; border-radius:50%; border:2px solid #fff; box-shadow:0 0 15px #ef4444; animation:pulse 2s infinite;"></div>`,
        iconSize: [14, 14]
      });
      L.marker(userLocation, { icon: userIcon }).addTo(map);

      const propertyIcon = L.divIcon({
        className: 'custom-prop',
        html: `<div style="background:#0f2e28; width:22px; height:22px; border-radius:50%; border:3px solid #cddfa0; box-shadow:0 4px 10px rgba(0,0,0,0.2); display:flex; align-items:center; justify-content:center;"><div style="background:#cddfa0; width:8px; height:8px; border-radius:50%;"></div></div>`,
        iconSize: [22, 22]
      });

      properties.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: propertyIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedProperty(p);
          map.flyTo([p.lat, p.lng], 15, { animate: true });
        });
      });

      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 500);
    };

    initMap();
    return () => { if (mapRef.current) mapRef.current.remove(); };
  }, [userLocation, properties]);

  const handleZoom = (type) => {
    if (!mapRef.current) return;
    if (type === "in") mapRef.current.zoomIn();
    else mapRef.current.zoomOut();
  };

  const handleViewDetails = (id) => {
    router.push(`/properties/${id}`); 
  };

  return (
    <section className={`w-full h-screen relative bg-gray-100 overflow-hidden ${manrope.className}`}>
      
      {!userLocation && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-[9999] text-[#0f2e28]">
          <div className="w-12 h-12 border-4 border-[#0f2e28] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold uppercase tracking-widest animate-pulse">Initializing Map View...</p>
        </div>
      )}

      <div ref={containerRef} style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 1 }} />

      <div className="absolute top-10 right-10 z-[20] flex flex-col gap-4">
        <button onClick={() => handleZoom("in")} className="w-12 h-12 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl text-[#0f2e28] flex items-center justify-center shadow-lg hover:bg-[#0f2e28] hover:text-white transition-all">
          <Plus size={24} strokeWidth={3} />
        </button>
        <button onClick={() => handleZoom("out")} className="w-12 h-12 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl text-[#0f2e28] flex items-center justify-center shadow-lg hover:bg-[#0f2e28] hover:text-white transition-all">
          <Minus size={24} strokeWidth={3} />
        </button>
      </div>

      <div className="absolute top-10 left-1/2 -translate-x-1/2 z-[10] text-center w-full px-6 pointer-events-none">
        <div className="inline-flex items-center gap-2 text-[#0f2e28] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200 mb-3 pointer-events-auto shadow-sm">
          <Navigation size={12} /> Live Real-Time View
        </div>
        <h2 className="text-4xl lg:text-6xl font-black text-[#0f2e28] leading-tight drop-shadow-sm">
          Properties <span className="text-green-600 italic font-light">Near You</span>
        </h2>
      </div>

      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="absolute bottom-10 left-10 z-[30] w-[340px]"
          >
            <div className="bg-white border border-gray-200 rounded-[2rem] overflow-hidden shadow-2xl">
              
              {/* ফিক্সড: X বাটন এখন সবুজ (green-600) */}
              <button 
                onClick={() => setSelectedProperty(null)} 
                className="absolute top-4 right-4 z-40 w-8 h-8 bg-white/80 text-green-600 rounded-full flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-md border border-green-100"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="relative h-44 w-full">
                <img src={selectedProperty.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute bottom-4 left-4 bg-[#0f2e28] text-white px-3 py-1 rounded-lg text-xs font-black shadow-lg">{selectedProperty.price}</div>
              </div>
              <div className="p-6 text-gray-800">
                <h3 className="text-xl font-black mb-4 leading-tight">{selectedProperty.title}</h3>
                <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-4 text-gray-500">
                  <div className="flex flex-col items-center gap-1"><BedDouble size={16}/><span className="text-[9px] font-black uppercase">{selectedProperty.beds} BEDS</span></div>
                  <div className="flex flex-col items-center gap-1 border-x border-gray-100"><Bath size={16}/><span className="text-[9px] font-black uppercase">{selectedProperty.baths} BATHS</span></div>
                  <div className="flex flex-col items-center gap-1"><Maximize size={16}/><span className="text-[9px] font-black text-center uppercase leading-none">{selectedProperty.size}</span></div>
                </div>
                <button 
                  onClick={() => handleViewDetails(selectedProperty.id)}
                  className="w-full mt-6 bg-[#0f2e28] text-white py-3 rounded-xl font-black hover:bg-green-700 transition-all flex items-center justify-center gap-2 tracking-widest text-xs shadow-md"
                >
                  <Sparkles size={14}/> VIEW FULL LISTING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </section>
  );
}