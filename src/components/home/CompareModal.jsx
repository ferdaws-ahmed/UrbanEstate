"use client";

import React, { useMemo } from "react";
import { X, ArrowRight, ShieldCheck, DollarSign, Bed, Bath, Maximize, Trophy, Star } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function CompareModal({ open, items, onClose }) {
  // ১. সেরা প্রপার্টি খুঁজে বের করার লজিক (Price per Sqft হিসেবে)
  const recommendation = useMemo(() => {
    if (items.length < 2) return null;

    // লজিক: প্রতি স্কয়ার ফিটে কার দাম কম (Best Value)
    const bestValue = [...items].sort((a, b) => (a.price / a.area) - (b.price / b.area))[0];
    
    // লজিক: সবচেয়ে বড় জায়গা কার (Most Spacious)
    const mostSpacious = [...items].sort((a, b) => b.area - a.area)[0];

    return { bestValue, mostSpacious };
  }, [items]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0f2e28]/80 backdrop-blur-md" 
          onClick={onClose} 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-[#13332c] border border-white/10 rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-[#cddfa0] p-2 rounded-xl text-[#0f2e28] shadow-lg shadow-[#cddfa0]/20">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Property Analysis</h3>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Side-by-side comparison</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 transition-all"><X size={22} /></button>
          </div>

          {/* Table */}
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-6 text-[#cddfa0] font-bold text-[10px] uppercase tracking-widest">Specifications</th>
                  {items.map((it) => (
                    <th key={it._id} className="pb-6 px-4">
                      <div className="flex flex-col gap-3">
                        <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-white/10">
                          <img src={it.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-white font-bold text-[13px] truncate w-32">{it.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white/70">
                <tr className="border-y border-white/5"><td className="py-5 text-[10px] font-bold uppercase text-white/40">Price</td>
                  {items.map(it => <td key={it._id} className="px-4 py-5 font-black text-[#cddfa0]">${new Intl.NumberFormat('en-IN').format(it.price)}</td>)}
                </tr>
                <tr className="border-b border-white/5"><td className="py-5 text-[10px] font-bold uppercase text-white/40 font-bold">Bed / Bath</td>
                  {items.map(it => <td key={it._id} className="px-4 py-5 text-sm font-bold">{it.bedrooms}B / {it.bathrooms}B</td>)}
                </tr>
                <tr className="border-b border-white/5"><td className="py-5 text-[10px] font-bold uppercase text-white/40">Total Area</td>
                  {items.map(it => <td key={it._id} className="px-4 py-5 text-sm font-bold">{it.area} sqft</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ADVANCED RESULT SECTION */}
          {recommendation && (
            <div className="mx-6 mb-6 p-6 bg-white/5 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#cddfa0] rounded-2xl flex items-center justify-center text-[#0f2e28] shrink-0 animate-pulse">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="text-[#cddfa0] font-black text-sm uppercase tracking-tighter">Our Recommendation</h4>
                  <p className="text-white/60 text-xs">Based on price-to-area ratio and features.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="px-4 py-3 bg-[#0f2e28] rounded-2xl border border-[#cddfa0]/20">
                  <div className="flex items-center gap-2 text-[#cddfa0] mb-1">
                    <Star size={12} fill="#cddfa0" />
                    <span className="text-[10px] font-black uppercase">Best Value</span>
                  </div>
                  <p className="text-white text-[11px] font-bold truncate w-32">{recommendation.bestValue.title}</p>
                </div>
                
                <div className="px-4 py-3 bg-[#0f2e28] rounded-2xl border border-white/10">
                  <div className="flex items-center gap-2 text-white/40 mb-1">
                    <Maximize size={12} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Most Spacious</span>
                  </div>
                  <p className="text-white text-[11px] font-bold truncate w-32">{recommendation.mostSpacious.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-6 bg-[#0f2e28]/50 flex justify-between items-center border-t border-white/5">
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Select up to 3 for precision</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-3 rounded-2xl text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Close</button>
              <button className="bg-[#cddfa0] text-[#0f2e28] px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(205,223,160,0.3)] transition-all flex items-center gap-2">View Best Deal <ArrowRight size={14} /></button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}