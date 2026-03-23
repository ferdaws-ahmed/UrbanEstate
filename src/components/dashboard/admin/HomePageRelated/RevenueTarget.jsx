"use client";

import React from 'react';
import { Target, TrendingUp, Zap, Calendar, BarChart3, Activity } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider'; 

export default function RevenueTarget() {
  const theme = useTheme();
  const isDark = theme ? theme.isDark : true; 
  const progress = 73;

  return (
    <div className={`p-3 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[11px] sm:text-sm font-black flex items-center gap-1.5 truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Target className={`w-3 h-3 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} />
            <span className="truncate">Revenue Target</span>
          </h3>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <span className={`text-[7px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap animate-pulse ${
              isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0] border border-[#cddfa0]/20' : 'bg-emerald-100 text-emerald-700'
            }`}>
              On Track
            </span>
          </div>
        </div>
        <div className={`p-1.5 rounded-lg shrink-0 ${isDark ? 'bg-white/5 border border-white/5' : 'bg-gray-100'}`}>
          <Activity size={12} className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'} />
        </div>
      </div>

      {/* Main Stats Area */}
      <div className="flex-1 flex flex-col justify-between gap-3 relative z-10">
        
        {/* Row 1: Achievement Highlight (Vertical Layout for narrow space) */}
        <div className={`p-2.5 sm:p-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.02] ${
          isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'
        }`}>
          <p className="text-[7px] sm:text-[8px] font-bold text-gray-400 uppercase mb-0.5 tracking-wider">Total Achieved</p>
          <h4 className={`text-xl sm:text-2xl font-black tracking-tight leading-none truncate ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>
            $3.34M
          </h4>
          
          
          <div className={`flex justify-between items-center mt-2 pt-1.5 border-t ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
            <p className="text-[7px] font-bold text-gray-500 uppercase leading-none">Target</p>
            <h4 className={`text-[9px] sm:text-xs font-black leading-none truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
              $4.50M
            </h4>
          </div>
        </div>

        {/* Row 2: Visual Mini Graph */}
        <div className="space-y-1 mt-1">
          <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <BarChart3 size={9} /> Momentum
          </p>
          <div className="flex items-end gap-1 h-8 sm:h-10">
            {[30, 50, 40, 85, 60, 95, 73].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-700 ease-out relative ${
                    i === 6 ? (isDark ? 'bg-[#cddfa0]' : 'bg-emerald-500') : (isDark ? 'bg-white/10' : 'bg-gray-200')
                  } group-hover:opacity-80`}
                  style={{ height: `${h}%` }}
                >
                  {i === 6 && <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full animate-ping"></div>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Progress Visual (Stacked Text for tight spaces) */}
        <div className="mt-1">
          <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden p-[1px] ${isDark ? 'bg-black/40' : 'bg-gray-100'}`}>
            <div 
              className={`h-full rounded-full relative transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(205,223,160,0.2)] ${
                isDark ? 'bg-[#cddfa0]' : 'bg-emerald-500'
              }`} 
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 w-full h-full animate-pulse"></div>
            </div>
          </div>
          
     
          <div className="flex flex-col gap-1 mt-1.5 px-0.5">
              <div className="flex items-center gap-1">
                <Zap size={8} className={`shrink-0 ${isDark ? 'text-amber-400' : 'text-emerald-500'} animate-bounce`} />
                <span className={`text-[8px] sm:text-[9px] font-black ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>
                  {progress}% SECURED
                </span>
              </div>
              <div className="flex items-center gap-1 text-[7px] font-bold text-gray-500 uppercase">
                <Calendar size={8} className="shrink-0" />
                <span>12 DAYS LEFT</span>
              </div>
          </div>
        </div>

        {/* Row 4: Footer Grid (Stacked vertically instead of 2 columns) */}
        <div className={`flex flex-col gap-1.5 pt-2 mt-1 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
            <div className="flex justify-between items-center">
              <p className="text-[7px] text-gray-500 font-bold uppercase">Forecast</p>
              <p className={`text-[9px] sm:text-xs font-black ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                $4.18M <span className="text-[6px] text-emerald-500 font-bold ml-0.5">↑4%</span>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-[7px] text-gray-500 font-bold uppercase">Run Rate</p>
              <p className={`text-[9px] sm:text-xs font-black ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                $92.4K<span className="text-[6px] text-gray-500 font-medium">/d</span>
              </p>
            </div>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-[80px] pointer-events-none opacity-20 ${
        isDark ? 'bg-[#cddfa0]' : 'bg-emerald-500'
      }`}></div>
    </div>
  );
}