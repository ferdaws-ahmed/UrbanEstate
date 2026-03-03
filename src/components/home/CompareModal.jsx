"use client";

import React from "react";
import { X, ArrowRight, ShieldCheck, DollarSign, Bed, Bath, Maximize } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";

export default function CompareModal({ open, items, onClose }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0f2e28]/60 backdrop-blur-sm" 
          onClick={onClose} 
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-[#13332c] border border-white/10 rounded-[1.5rem] shadow-2xl max-w-3xl w-full overflow-hidden"
        >
       
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-3">
              <div className="bg-[#cddfa0] p-1.5 rounded-lg text-[#0f2e28]">
                <ShieldCheck size={18} />
              </div>
              <h3 className="text-lg font-bold text-white uppercase tracking-tight">Compare <span className="text-[#cddfa0]">Items</span></h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <X size={20} />
            </button>
          </div>

     
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-4 text-[#cddfa0] font-bold text-[10px] uppercase tracking-widest border-b border-white/5">Metric</th>
                  {items.map((it) => (
                    <th key={it.id} className="pb-4 px-4 text-white font-bold text-xs border-b border-white/5 min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <img src={it.image} alt="" className="w-8 h-8 object-cover rounded-md border border-white/10" />
                        <span className="truncate w-24">{it.title.split(' ')[0]}...</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-white/80">
                {/* Price Row */}
                <tr className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                    <DollarSign size={14} className="text-[#cddfa0]" /> Price
                  </td>
                  {items.map((it) => (
                    <td key={it.id} className="py-4 px-4 font-bold text-[#cddfa0] text-sm">
                      {it.price}
                    </td>
                  ))}
                </tr>
                {/* Beds Row */}
                <tr className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                    <Bed size={14} className="text-[#cddfa0]" /> Beds
                  </td>
                  {items.map((it) => (
                    <td key={it.id} className="py-4 px-4 text-xs font-semibold">
                      {it.beds}
                    </td>
                  ))}
                </tr>
                {/* Baths Row */}
                <tr className="border-b border-white/5 group hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                    <Bath size={14} className="text-[#cddfa0]" /> Baths
                  </td>
                  {items.map((it) => (
                    <td key={it.id} className="py-4 px-4 text-xs font-semibold">
                      {it.baths}
                    </td>
                  ))}
                </tr>
                {/* Area Row */}
                <tr className="group hover:bg-white/5 transition-colors">
                  <td className="py-4 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                    <Maximize size={14} className="text-[#cddfa0]" /> Area
                  </td>
                  {items.map((it) => (
                    <td key={it.id} className="py-4 px-4 text-xs font-semibold">
                      {it.size}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0f2e28] flex justify-end gap-3 border-t border-white/5">
            <button 
              onClick={onClose} 
              className="px-5 py-2 rounded-xl text-white/40 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors"
            >
              Close
            </button>
            <button 
              className="bg-[#cddfa0] text-[#0f2e28] px-6 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-white hover:scale-105 transition-all flex items-center gap-2"
            >
              Confirm <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}