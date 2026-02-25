"use client";

import { Manrope } from "next/font/google";
import { useEffect, useState, useMemo } from "react";
import { Bed, Bath, Maximize, ArrowUpRight, ShieldCheck, Check } from "lucide-react"; 
import Link from "next/link"; 
import CompareBar from "./CompareBar";
import CompareModal from "./CompareModal";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const Features = () => {

  const properties = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    title: [
      "Azure Skyline Villa", "Emerald Mansion", "Waterfront Estate", "Urban Smart Hub",
      "Serene Pine Villa", "Ivory Coast Manor", "Midnight Penthouse", "Golden Gate Residence"
    ][i % 8],
    price: ["$2.5M", "$1.8M", "$6.2M", "$4.1M", "$1.2M", "$3.2M", "$2.1M", "$5.5M"][i % 8],
    beds: (i % 3) + 2,
    baths: (i % 2) + 2,
    size: (i + 10) * 100 + " sqft",
    image: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=60",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=60",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=60",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=60",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=60",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=400&q=60",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=60",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=60"
    ][i % 8],
  })), []);

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
    <section className={`w-full py-24 px-4 lg:px-10 bg-[#0f2e28] ${manrope.className}`}>
      <div className="container mx-auto max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10">
            <ShieldCheck size={14} /> AI-Verified Premium Properties
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
            Featured <span className="text-[#cddfa0] italic font-light tracking-tight">Properties</span>
          </h2>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {properties.map((p) => {
            const isSelected = !!selected.find((s) => s.id === p.id);
            return (
              <div 
                key={p.id}
                className={`group relative bg-[#13332c] rounded-[2.2rem] overflow-hidden border transition-all duration-200 shadow-xl ${isSelected ? "border-[#cddfa0] ring-1 ring-[#cddfa0]/30" : "border-white/5 hover:border-[#cddfa0]/40"}`}
              >
     
                <div className="relative h-56 w-full overflow-hidden bg-[#1a3d36]">
                  <img 
                    src={p.image} 
                    alt={p.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    loading="eager" 
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-[#0f2e28]/90 backdrop-blur-md text-[#cddfa0] text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest uppercase">Featured</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#13332c]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[15px] text-white group-hover:text-[#cddfa0] transition-colors truncate pr-2">{p.title}</h3>
                    <button onClick={() => toggleSelect(p)} className="flex items-center gap-2 cursor-pointer outline-none bg-transparent border-none">
                      <span className={`text-[10px] font-black uppercase tracking-wider transition-colors ${isSelected ? "text-[#cddfa0]" : "text-white/40 group-hover:text-[#cddfa0]"}`}>COMPARE</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected ? "bg-[#cddfa0] border-[#cddfa0] shadow-[0_0_10px_rgba(205,223,160,0.5)]" : "border-white/20"}`}>
                        {isSelected && <Check size={14} className="text-[#0f2e28] stroke-[4]" />}
                      </div>
                    </button>
                  </div>

                  <div className="text-xl font-black text-[#cddfa0] mb-5 tracking-tight">{p.price}</div>

                  <div className="flex items-center justify-between border-y border-white/5 py-4 mb-6 px-1">
                    <div className="flex flex-col items-center gap-1 text-white/40">
                      <Bed size={14} />
                      <span className="text-[9px] text-white/80 font-extrabold uppercase tracking-tighter">{p.beds} Beds</span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex flex-col items-center gap-1 text-white/40">
                      <Bath size={14} />
                      <span className="text-[9px] text-white/80 font-extrabold uppercase tracking-tighter">{p.baths} Baths</span>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex flex-col items-center gap-1 text-white/40">
                      <Maximize size={14} />
                      <span className="text-[9px] text-white/80 font-extrabold uppercase tracking-tighter">{p.size.split(" ")[0]} Sqft</span>
                    </div>
                  </div>

              
                  <Link href={`/property/${p.id}`} prefetch={true}>
                    <div className="w-full flex items-center justify-center gap-2 bg-[#0f2e28] text-white py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all duration-200 group/btn shadow-lg active:scale-95 cursor-pointer">
                      <span className="group-hover/btn:text-[#cddfa0] transition-colors">View Details</span>
                      <ArrowUpRight size={16} className="group-hover/btn:text-[#cddfa0] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
                    </div>
                  </Link>
                </div>
              </div>
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