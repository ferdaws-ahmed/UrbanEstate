"use client";

import React from "react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { X, CheckCircle, ArrowRight } from "lucide-react";

export default function CompareBar({ count, onOpen, onClear }) {
  const { isDark } = useTheme();
  
  if (!count) return null;

  return (
    <div className="fixed left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto md:max-w-4xl md:bottom-8 bottom-6 z-50">
      <div className={`w-full md:w-auto border-2 rounded-2xl shadow-2xl px-6 py-4 flex items-center justify-between gap-6 transition-all duration-300 ${
        isDark 
          ? 'bg-[var(--card)]/95 backdrop-blur-md border-[var(--accent)]/30' 
          : 'bg-white/95 backdrop-blur-md border-[var(--accent)]/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]'}`}>
            <CheckCircle size={18} className="text-[var(--accent)]" />
          </div>
          <div>
            <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {count} {count === 1 ? 'Property' : 'Properties'} Selected
            </p>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Ready to compare
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onClear} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 ${
              isDark 
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' 
                : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
            }`}
          >
            <X size={16} />
            Clear
          </button>
          <button 
            onClick={onOpen} 
            className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
              isDark 
                ? 'bg-gradient-to-r from-[var(--accent)] to-emerald-600 text-[var(--background)]' 
                : 'bg-gradient-to-r from-[var(--accent)] to-emerald-600 text-white'
            }`}
          >
            Compare Now
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

