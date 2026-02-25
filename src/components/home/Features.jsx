"use client";

import { Manrope } from "next/font/google";
import { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { Bed, Bath, Maximize, ArrowUpRight, ShieldCheck, Check } from "lucide-react"; 
import Link from "next/link"; 
import CompareBar from "./CompareBar";
import CompareModal from "./CompareModal";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const Features = () => {
  const properties = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    title: [
      "Azure Skyline Villa", "Emerald Mansion", "Golden Gate Residence",
      "Waterfront Estate", "Urban Smart Hub", "Minimalist Glass",
      "Vintage Royal", "Modern Eco Retreat", "Grand Central Loft",
      "Serene Pine Villa", "Ivory Coast Manor", "Midnight Penthouse"
    ][i % 12],
    price: ["$2.5M", "$1.8M", "$3.2M", "$950K", "$4.1M", "$1.2M"][i % 6],
    beds: (i % 3) + 2,
    baths: (i % 2) + 2,
    size: (i + 10) * 100 + " sqft",
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      "https://img.freepik.com/free-photo/colonial-style-house-night-scene_1150-17925.jpg?semt=ais_user_personalization&w=740&q=80",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83"
    ][i % 12],
  }));

  const [selected, setSelected] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (selected.length > 3) setSelected((s) => s.slice(1));
  }, [selected]);

  const toggleSelect = (prop) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === prop.id);
      if (exists) return prev.filter((p) => p.id !== prop.id);
      return [...prev, prop];
    });
  };

  const clearSelection = () => setSelected([]);

  return (
    <section className={`w-full py-24 px-4 lg:px-10 bg-[#0f2e28] overflow-hidden ${manrope.className}`}>
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10"
          >
            <ShieldCheck size={14} /> AI-Verified Premium Properties
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl lg:text-6xl font-bold text-white leading-tight"
          >
            Featured <span className="text-[#cddfa0] italic font-light tracking-tight">Properties</span>
          </motion.h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {properties.map((p, idx) => {
            const isSelected = !!selected.find((s) => s.id === p.id);
            return (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1, ease: "easeOut" }}
                className={`group relative bg-[#13332c] rounded-[2.2rem] overflow-hidden border transition-all duration-500 shadow-2xl ${isSelected ? "border-[#cddfa0] ring-1 ring-[#cddfa0]/30 scale-[1.02]" : "border-white/5 hover:border-[#cddfa0]/40"}`}
              >
                {/* Image Section - Fixed height to prevent layout jump */}
                <div className="relative h-56 w-full overflow-hidden bg-white/5">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-[#0f2e28]/90 backdrop-blur-md text-[#cddfa0] text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest">FEATURED</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13332c] via-transparent to-transparent opacity-60" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[15px] text-white group-hover:text-[#cddfa0] transition-colors truncate pr-2">{p.title}</h3>
                    <div onClick={() => toggleSelect(p)} className="group/select flex items-center gap-2 cursor-pointer">
                      <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isSelected ? "text-[#cddfa0]" : "text-white/60 group-hover/select:text-[#cddfa0]"}`}>COMPARE</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected ? "bg-[#cddfa0] border-[#cddfa0] scale-110 shadow-[0_0_10px_rgba(205,223,160,0.5)]" : "border-white/30 group-hover/select:border-[#cddfa0]"}`}>
                        {isSelected && <Check size={14} className="text-[#0f2e28] stroke-[4]" />}
                      </div>
                    </div>
                  </div>

                  <div className="text-xl font-black text-[#cddfa0] mb-5 tracking-tight">{p.price}</div>

                  <div className="flex items-center justify-between border-y border-white/5 py-4 mb-6 px-1">
                    <div className="flex flex-col items-center gap-1">
                      <Bed size={14} className="text-white/40" />
                      <span className="text-[9px] text-white font-extrabold uppercase tracking-tighter">{p.beds} Beds</span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                      <Bath size={14} className="text-white/40" />
                      <span className="text-[9px] text-white font-extrabold uppercase tracking-tighter">{p.baths} Baths</span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex flex-col items-center gap-1">
                      <Maximize size={14} className="text-white/40" />
                      <span className="text-[9px] text-white font-extrabold uppercase tracking-tighter">{p.size.split(" ")[0]} Sqft</span>
                    </div>
                  </div>

                  <Link href={`/property/${p.id}`}>
                    <button className="w-full flex items-center justify-center gap-2 bg-[#0f2e28] text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 outline-none select-none transition-all duration-300 group/btn shadow-lg active:scale-[0.98]">
                      <span className="group-hover/btn:text-[#cddfa0] transition-colors duration-300">View Details</span>
                      <ArrowUpRight size={16} className="group-hover/btn:text-[#cddfa0] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-300" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <CompareBar count={selected.length} onOpen={() => setModalOpen(true)} onClear={clearSelection} />
        <CompareModal open={modalOpen} items={selected} onClose={() => setModalOpen(false)} />
      </div>
    </section>
  );
};

export default Features;