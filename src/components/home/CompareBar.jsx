"use client";

import React from "react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function CompareBar({ count, onOpen, onClear }) {
  const { isDark } = useTheme();
  
  if (!count) return null;

  return (
    <div className="fixed left-4 right-4 md:right-auto md:left-auto md:mx-auto md:bottom-8 bottom-6 z-50">
      <div className={`max-w-4xl mx-auto border rounded-full shadow-lg px-4 py-3 flex items-center justify-between transition-colors ${
        isDark 
          ? 'bg-[var(--card)] border-white/10' 
          : 'bg-white border-gray-200'
      }`}>
        <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{count} property(ies) selected for comparison</div>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-800'}`}>Clear</button>
          <button onClick={onOpen} className={`bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-full text-sm font-semibold hover:opacity-95 transition-opacity`}>Compare Now</button>
        </div>
      </div>
    </div>
  );
}

