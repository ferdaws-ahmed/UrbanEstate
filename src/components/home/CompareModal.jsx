"use client";

import React, { useMemo } from "react";
import { X, ArrowRight, ShieldCheck, DollarSign, Bed, Bath, Maximize, Trophy, Star } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function CompareModal({ open, items, onClose }) {
  const { isDark } = useTheme();
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
          className="absolute inset-0 bg-[var(--background)]/80 backdrop-blur-md" 
          onClick={onClose} 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`relative bg-[var(--card)] border rounded-[2rem] shadow-2xl max-w-4xl w-full overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
            <div className="flex items-center gap-3">
              <div className={`bg-[var(--primary)] p-2 rounded-xl text-white shadow-lg`}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className={`text-xl font-black uppercase tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Property Analysis</h3>
                <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Side-by-side comparison</p>
              </div>
            </div>
            <button onClick={onClose} className={`p-2 rounded-full transition-all ${isDark ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-500'}`}><X size={22} /></button>
          </div>

          {/* Table */}
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-6 text-[var(--accent)] font-bold text-[10px] uppercase tracking-widest">Specifications</th>
                  {items.map((it) => (
                    <th key={it._id} className="pb-6 px-4">
                      <div className="flex flex-col gap-3">
                        <div className={`relative w-24 h-16 rounded-xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                          <img src={it.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span className={`font-bold text-[13px] truncate w-32 ${isDark ? 'text-white' : 'text-slate-900'}`}>{it.title}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className={`border-y ${isDark ? 'border-white/5' : 'border-slate-100'}`}><td className={`py-5 text-[10px] font-bold uppercase ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Price</td>
                  {items.map(it => <td key={it._id} className="px-4 py-5 font-black text-[var(--accent)]">${new Intl.NumberFormat('en-IN').format(it.price)}</td>)}
                </tr>
                <tr className={`border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}><td className={`py-5 text-[10px] font-bold uppercase ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Bed / Bath</td>
                  {items.map(it => <td key={it._id} className={`px-4 py-5 text-sm font-bold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>{it.bedrooms}B / {it.bathrooms}B</td>)}
                </tr>
                <tr className={`border-b ${isDark ? 'border-white/5' : 'border-slate-100'}`}><td className={`py-5 text-[10px] font-bold uppercase ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Total Area</td>
                  {items.map(it => <td key={it._id} className={`px-4 py-5 text-sm font-bold ${isDark ? 'text-white/70' : 'text-slate-700'}`}>{it.area} sqft</td>)}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ADVANCED RESULT SECTION */}
          {recommendation && (
            <div className={`mx-6 mb-6 p-6 rounded-3xl border flex flex-col md:flex-row gap-6 items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--primary)] rounded-2xl flex items-center justify-center text-white shrink-0 animate-pulse">
                  <Trophy size={24} />
                </div>
                <div>
                  <h4 className="text-[var(--accent)] font-black text-sm uppercase tracking-tighter">Our Recommendation</h4>
                  <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Based on price-to-area ratio and features.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className={`px-4 py-3 bg-[var(--background)] rounded-2xl border border-[var(--accent)]/20`}>
                  <div className="flex items-center gap-2 text-[var(--accent)] mb-1">
                    <Star size={12} fill="#cddfa0" />
                    <span className="text-[10px] font-black uppercase">Best Value</span>
                  </div>
                  <p className={`text-[11px] font-bold truncate w-32 ${isDark ? 'text-white' : 'text-slate-900'}`}>{recommendation.bestValue.title}</p>
                </div>
                
                <div className={`px-4 py-3 bg-[var(--background)] rounded-2xl border ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className={`flex items-center gap-2 mb-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    <Maximize size={12} />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Most Spacious</span>
                  </div>
                  <p className={`text-[11px] font-bold truncate w-32 ${isDark ? 'text-white' : 'text-slate-900'}`}>{recommendation.mostSpacious.title}</p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={`p-6 flex justify-between items-center border-t ${isDark ? 'bg-[var(--background)]/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-500'}`}>Select up to 3 for precision</p>
            <div className="flex gap-3">
              <button onClick={onClose} className={`px-6 py-3 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-colors ${isDark ? 'text-white/40 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>Close</button>
              {recommendation && (
                <Link href={`/propertydetails/${recommendation.bestValue._id}?view=1`}>
                  <button className="bg-[var(--primary)] text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-[0_0_20px_rgba(9,152,128,0.3)] transition-all flex items-center gap-2">
                    View Best Deal <ArrowRight size={14} />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

