"use client";

import React, { useEffect, useRef, useState } from "react"; 
import { Manrope } from "next/font/google";
import { MapPin, X, BedDouble, Bath, Maximize, Navigation, Sparkles, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; 
import { useTheme } from "../../../ThemeProvider"; 

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


const generateNearbyData = (centerLat, centerLng, count = 9) => {
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
    lat: centerLat + (Math.random() - 0.5) * 0.015,
    lng: centerLng + (Math.random() - 0.5) * 0.015,
    beds: Math.floor(Math.random() * 3) + 2,
    baths: Math.floor(Math.random() * 2) + 2,
    size: `${Math.floor(Math.random() * 1000) + 1200} sqft`,
    image: images[i % images.length]
  }));
};

export default function PropertyMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter(); 
  const { isDark } = useTheme();

  
  const defaultLat = 23.9450; 
  const defaultLng = 90.2785;
  
  const [userLocation, setUserLocation] = useState([defaultLat, defaultLng]);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation([lat, lng]);
          setProperties(generateNearbyData(lat, lng, 9)); 
        },
        (error) => {
          console.warn("Location permission denied. Showing default location.");
          setProperties(generateNearbyData(defaultLat, defaultLng, 9));
        }, 
        { enableHighAccuracy: true }
      );
    } else {
      setProperties(generateNearbyData(defaultLat, defaultLng, 9));
    }
  }, []);


  useEffect(() => {
    if (!containerRef.current || properties.length === 0) return;

    let isMounted = true;

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

      if (!isMounted) return;
      const L = window.L;

      if (mapRef.current) { 
        mapRef.current.remove(); 
        mapRef.current = null;
      }
      if (containerRef.current) {
        containerRef.current._leaflet_id = null;
      }

     
      const map = L.map(containerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true
      }).setView(userLocation, 15); 


      L.tileLayer('http://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: 'Map data &copy; Google'
      }).addTo(map);

      L.circle(userLocation, {
        color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, radius: 150
      }).addTo(map);

      const userIcon = L.divIcon({
        className: 'custom-user',
        html: `<div style="background:#ef4444; width:18px; height:18px; border-radius:50%; border:3px solid #fff; box-shadow:0 0 15px #ef4444; animation:pulse 2s infinite;"></div>`,
        iconSize: [18, 18]
      });
      L.marker(userLocation, { icon: userIcon, zIndexOffset: 1000 }).addTo(map);

     
      const propertyIcon = L.divIcon({
        className: 'custom-prop',
        html: `
          <div style="
            background: #2563eb; 
            width: 28px; 
            height: 28px; 
            border-radius: 50%; 
            border: 3px solid ${isDark ? '#1a4a40' : '#ffffff'}; 
            box-shadow: 0 4px 12px rgba(0,0,0,0.5); 
            display: flex; 
            align-items: center; 
            justify-content: center;
            transition: transform 0.2s ease;
          ">
            <div style="background: #ffffff; width: 8px; height: 8px; border-radius: 50%;"></div>
          </div>
        `,
        iconSize: [28, 28]
      });

      properties.forEach((p) => {
        const marker = L.marker([p.lat, p.lng], { icon: propertyIcon }).addTo(map);
        marker.on('click', () => {
          setSelectedProperty(p);
          
          map.flyTo([p.lat + 0.002, p.lng], 16, { animate: true, duration: 1.5 });
        });
      });

      mapRef.current = map;
      setTimeout(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      }, 500);
    };

    initMap();
    
    return () => { 
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation, properties, isDark]); 

  const handleZoom = (type) => {
    if (!mapRef.current) return;
    if (type === "in") mapRef.current.zoomIn();
    else mapRef.current.zoomOut();
  };

  const handleViewDetails = (id) => {
    router.push(`/properties/${id}`); 
  };

  return (
   
    <section className={`w-full h-[60vh] md:h-[500px] lg:h-[600px] relative rounded-xl md:rounded-2xl overflow-hidden border shadow-sm transition-colors duration-300 ${isDark ? 'border-[#1a4a40] bg-[#0f2e28]' : 'border-gray-200 bg-gray-50'} ${manrope.className}`}>
      
      {/* Map Area */}
      <div 
        ref={containerRef} 
        className={`absolute top-0 left-0 w-full h-full z-[1] ${isDark ? 'map-dark-mode' : ''}`} 
      />

      {/* Custom Zoom Controls (Responsive Positioning) */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[20] flex flex-col gap-2 md:gap-3">
        <button onClick={() => handleZoom("in")} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg transition-all ${isDark ? 'bg-[#1a4a40]/90 backdrop-blur text-white hover:bg-[#cddfa0] hover:text-[#0f2e28] border border-[#2b2b36]' : 'bg-white/90 backdrop-blur text-gray-800 hover:bg-blue-600 hover:text-white border border-gray-200'}`}>
          <Plus size={18} strokeWidth={2.5} />
        </button>
        <button onClick={() => handleZoom("out")} className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg transition-all ${isDark ? 'bg-[#1a4a40]/90 backdrop-blur text-white hover:bg-[#cddfa0] hover:text-[#0f2e28] border border-[#2b2b36]' : 'bg-white/90 backdrop-blur text-gray-800 hover:bg-blue-600 hover:text-white border border-gray-200'}`}>
          <Minus size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* Top Overlay Heading (Responsive) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[10] text-center w-[90%] md:w-full pointer-events-none">
        <div className={`inline-flex items-center gap-1.5 md:gap-2 font-bold tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] uppercase px-3 md:px-4 py-1 md:py-1.5 rounded-full border shadow-sm pointer-events-auto transition-colors ${isDark ? 'bg-[#0f2e28]/90 backdrop-blur border-[#1a4a40] text-[#cddfa0]' : 'bg-white/90 backdrop-blur border-gray-200 text-blue-700'}`}>
          <Navigation size={12} /> Live Street View
        </div>
      </div>

      {/* Property Details Popup (Responsive Size) */}
      <AnimatePresence>
        {selectedProperty && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="absolute bottom-4 left-4 right-4 md:right-auto md:bottom-6 md:left-6 z-[30] md:w-[320px]"
          >
            <div className={`border rounded-2xl md:rounded-[1.5rem] overflow-hidden shadow-2xl transition-colors duration-300 ${isDark ? 'bg-[#151521] border-[#2b2b36]' : 'bg-white border-gray-200'}`}>
              
              <button 
                onClick={() => setSelectedProperty(null)} 
                className={`absolute top-3 right-3 z-40 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md ${isDark ? 'bg-black/50 text-white hover:bg-[#ef4444] border border-gray-600' : 'bg-white/80 text-gray-800 hover:bg-red-500 hover:text-white border border-gray-200'}`}
              >
                <X size={14} strokeWidth={2.5} />
              </button>

              <div className="relative h-32 md:h-40 w-full">
                <img src={selectedProperty.image} alt="" className="w-full h-full object-cover" />
                <div className={`absolute bottom-3 left-3 px-2 md:px-3 py-1 rounded-lg text-[10px] md:text-xs font-black shadow-lg ${isDark ? 'bg-[#cddfa0] text-[#0f2e28]' : 'bg-blue-600 text-white'}`}>
                  {selectedProperty.price}
                </div>
              </div>
              <div className="p-4 md:p-5">
                <h3 className={`text-base md:text-lg font-black mb-3 leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedProperty.title}</h3>
                <div className={`grid grid-cols-3 gap-2 border-t pt-3 ${isDark ? 'border-[#2b2b36] text-gray-400' : 'border-gray-100 text-gray-500'}`}>
                  <div className="flex flex-col items-center gap-1"><BedDouble size={14}/><span className="text-[8px] md:text-[9px] font-black uppercase">{selectedProperty.beds} BEDS</span></div>
                  <div className={`flex flex-col items-center gap-1 border-x ${isDark ? 'border-[#2b2b36]' : 'border-gray-100'}`}><Bath size={14}/><span className="text-[8px] md:text-[9px] font-black uppercase">{selectedProperty.baths} BATHS</span></div>
                  <div className="flex flex-col items-center gap-1"><Maximize size={14}/><span className="text-[8px] md:text-[9px] font-black text-center uppercase leading-none">{selectedProperty.size}</span></div>
                </div>
                <button 
                  onClick={() => handleViewDetails(selectedProperty.id)}
                  className={`w-full mt-4 md:mt-5 py-2 md:py-2.5 rounded-lg md:rounded-xl font-black transition-all flex items-center justify-center gap-2 tracking-widest text-[10px] md:text-[11px] shadow-md ${isDark ? 'bg-[#cddfa0] text-[#0f2e28] hover:bg-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                  <Sparkles size={14}/> VIEW LISTING
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        
        .leaflet-control-attribution { display: none !important; }
        
        /* ডার্ক মোডে ম্যাপ ডার্ক করার স্পেশাল হ্যাক */
        .map-dark-mode .leaflet-layer,
        .map-dark-mode .leaflet-control-zoom-in,
        .map-dark-mode .leaflet-control-zoom-out,
        .map-dark-mode .leaflet-control-attribution {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>
    </section>
  );
}