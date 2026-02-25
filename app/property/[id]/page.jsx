"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import properties from "../../../src/data/properties";
import { 
  Bed, Bath, Maximize, MapPin, 
  Heart, Share2, ChevronLeft, 
  ShieldCheck, Star, Calendar, MessageSquare, Radar, Activity
} from "lucide-react";

import Navbar from "../../../src/components/shared/Navbar"; 


export default function PropertyPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = Number(params.id);
  const property = properties.find((p) => p.id === propertyId);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!property) return <div className="h-screen bg-[#061510] flex items-center justify-center text-[#cddfa0] font-mono text-[10px] tracking-[0.4em]">INITIALIZING_DATA...</div>;

  const gallery = [
    property?.image,
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a2e26] to-[#061510] text-white selection:bg-[#cddfa0] selection:text-[#061510]">
 
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#cddfa0]/5 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
          <div className="space-y-3">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[#cddfa0]/40 font-bold text-[9px] uppercase tracking-[0.3em] hover:text-[#cddfa0] transition-all group"
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Grid
            </button>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.2em] text-[8px] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
                <Radar size={10} className="animate-pulse" /> Asset ID: {property.id} // Verified
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight">
                {property.title.split(' ')[0]} <span className="text-[#cddfa0] italic font-light">{property.title.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            <div className="flex items-center gap-5 text-white/30 font-mono text-[9px] tracking-widest uppercase">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#cddfa0]" /> Sector 7, Dhaka [cite: 2026-02-25]</span>
              <span className="flex items-center gap-1.5 text-emerald-400/50"><Activity size={12} /> Live Status: Available</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-[#cddfa0] hover:text-[#061510] transition-all">
              <Share2 size={14} />
            </button>
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all ${isSaved ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" : "bg-[#cddfa0] text-[#061510] shadow-[0_10px_30px_rgba(205,223,160,0.2)] hover:scale-105"}`}
            >
              <Heart size={14} fill={isSaved ? "currentColor" : "none"} /> {isSaved ? "Secured" : "Bookmark Asset"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16 relative z-10">
          <div className="lg:col-span-9 h-[350px] md:h-[500px] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative group bg-[#040f0c]">
            <img 
              src={gallery[selectedImage]} 
              className="w-full h-full object-cover opacity-90 transition-all duration-[1.5s] group-hover:scale-105" 
              alt="Architecture Scan"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061510] via-transparent to-transparent opacity-60"></div>
            
            <div className="absolute top-6 right-6">
                <span className="bg-black/60 backdrop-blur-md text-[#cddfa0] text-[7px] font-mono border border-white/10 px-2.5 py-1 rounded tracking-widest uppercase shadow-2xl">Camera Unit 0{selectedImage + 1} // ACTIVE</span>
            </div>
            <div className="absolute bottom-6 left-6 bg-[#061510]/80 backdrop-blur-2xl px-5 py-2.5 rounded-2xl border border-white/10 text-white flex items-center gap-3 shadow-2xl">
               <ShieldCheck className="text-[#cddfa0]" size={14} />
               <span className="text-[8px] font-black tracking-[0.3em] uppercase opacity-70">Structural scan complete</span>
            </div>
          </div>
          
          <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto">
            {gallery.map((img, i) => (
              <button 
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`flex-shrink-0 lg:flex-1 h-20 lg:h-auto rounded-[1.5rem] overflow-hidden border-2 transition-all duration-500 ${selectedImage === i ? "border-[#cddfa0] scale-95 shadow-[0_0_30px_rgba(205,223,160,0.2)]" : "border-white/5 opacity-30 hover:opacity-100"}`}
              >
                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0" alt={`Angle 0${i+1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
          <div className="lg:col-span-8 space-y-12">
            <div className="grid grid-cols-3 gap-4 md:gap-6">
               {[
                 { icon: Bed, label: "Sleep Units", val: property.beds },
                 { icon: Bath, label: "Bath Systems", val: property.baths },
                 { icon: Maximize, label: "Spatial Area", val: property.size }
               ].map((spec, i) => (
                 <div key={i} className="bg-white/[0.03] backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/5 hover:border-[#cddfa0]/20 transition-all group relative overflow-hidden">
                    <spec.icon className="text-[#cddfa0]/60 mb-3 group-hover:scale-110 transition-transform" size={18} strokeWidth={1.5} />
                    <div className="text-2xl font-black mb-1 tracking-tight">{spec.val}</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{spec.label}</div>
                 </div>
               ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-md font-bold flex items-center gap-2.5 text-[#cddfa0] uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#cddfa0] animate-pulse"></div> Architectural Narrative
              </h3>
              <p className="text-lg text-white/50 leading-relaxed font-light italic">
                Experience the pinnacle of modern intelligence in this <span className="text-white font-medium italic underline underline-offset-4 decoration-emerald-500/30">{property.title} in Sector 7</span>. This space integrates geospatial precision with unparalleled luxury aesthetics.
              </p>
            </div>

            <div className="space-y-6">
               <h3 className="text-md font-bold flex items-center gap-2.5 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div> Smart Infrastructure
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {["Quantum Security", "AI Climate Control", "HEPA Filtration", "Solar Grid", "EV Interface", "Biometric Access"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3.5 bg-white/[0.01] rounded-xl border border-white/5 hover:bg-white/[0.03] transition-all">
                       <ShieldCheck className="text-[#cddfa0]/50" size={12} />
                       <span className="text-[9px] font-bold uppercase tracking-wider text-white/60">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.4)] space-y-10">
              <div className="space-y-2">
                <span className="text-[#cddfa0] text-[8px] font-bold uppercase tracking-[0.4em] opacity-40">Acquisition Value</span>
                <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                  {property.priceLabel || `$${property.price.toLocaleString()}`}
                </div>
              </div>

              <div className="space-y-3.5">
                <button className="w-full bg-[#cddfa0] text-[#061510] py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95">
                  <Calendar size={14} /> Schedule Intelligence Tour
                </button>
                <button className="w-full bg-transparent border border-white/10 text-white py-4.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-2.5 active:scale-95">
                  <MessageSquare size={14} /> Connect with Unit
                </button>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                 <div className="w-11 h-11 rounded-xl bg-[#cddfa0]/5 flex items-center justify-center text-[#cddfa0] border border-[#cddfa0]/10">
                    <ShieldCheck size={18} />
                 </div>
                 <div className="space-y-0.5">
                    <p className="font-bold text-white text-[9px] uppercase tracking-widest leading-none">Secured Protocol</p>
                    <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest mt-1">End-to-End Encryption</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}