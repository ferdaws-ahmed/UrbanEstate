"use client";

import React from 'react';
import { BrainCircuit, TrendingUp, Target, Sparkles } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function AIPredictiveAnalytics({ data }) {
  const { isDark } = useTheme();

  
  const safeData = data || { percentage: '+12.5%', topLeadScore: 98 };

  return (
   
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-500 shadow-2xl flex flex-col relative overflow-hidden w-full ${
      isDark 
        ? 'bg-gradient-to-b from-[#103029] to-[#071713] border-[#1a4a40] text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      

      {isDark && (
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#cddfa0 1.5px, transparent 1.5px)', backgroundSize: '16px 16px' }}
        ></div>
      )}
      <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-4 sm:mb-5 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <BrainCircuit className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            AI Market <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Forecast</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Predictive Insights
          </p>
        </div>
        
        {/* Animated AI Badge */}
        <div className={`flex items-center justify-center p-1.5 sm:p-2 rounded-lg shrink-0 border transition-colors ${
          isDark ? 'bg-[#cddfa0]/10 border-[#cddfa0]/20 text-[#cddfa0] shadow-[0_0_10px_rgba(205,223,160,0.15)]' : 'bg-blue-50 border-blue-200 text-blue-600'
        }`}>
          <Sparkles size={14} className="animate-pulse" />
        </div>
      </div>
      
      {/* Data Grid Section */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 relative z-10 w-full mt-auto">
        
        {/* Box 1: Surge Expected */}
        <div className={`p-3 sm:p-4 rounded-[1rem] sm:rounded-[1.2rem] border transition-all duration-300 group cursor-default ${
          isDark ? 'bg-[#153b32]/40 border-[#1a4a40] hover:bg-[#1a4a40]/60 hover:border-[#cddfa0]/30 shadow-sm' : 'bg-gray-50 border-gray-100 hover:shadow-md hover:border-emerald-200'
        }`}>
          <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <TrendingUp className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} strokeWidth={3} /> 
            Surge Expected
          </p>
          <p className={`text-xl sm:text-3xl font-black tracking-tight mt-1 sm:mt-2 transition-colors ${isDark ? 'text-white group-hover:text-[#cddfa0]' : 'text-gray-900 group-hover:text-emerald-600'}`}>
            {safeData.percentage}
          </p>
        </div>
        
        {/* Box 2: Top Lead Score */}
        <div className={`p-3 sm:p-4 rounded-[1rem] sm:rounded-[1.2rem] border transition-all duration-300 group cursor-default ${
          isDark ? 'bg-[#153b32]/40 border-[#1a4a40] hover:bg-[#1a4a40]/60 hover:border-[#cddfa0]/30 shadow-sm' : 'bg-gray-50 border-gray-100 hover:shadow-md hover:border-blue-200'
        }`}>
          <p className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Target className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} strokeWidth={3} /> 
            Top Lead Score
          </p>
          <p className={`text-xl sm:text-3xl font-black tracking-tight mt-1 sm:mt-2 transition-colors ${isDark ? 'text-white group-hover:text-[#cddfa0]' : 'text-gray-900 group-hover:text-blue-600'}`}>
            {safeData.topLeadScore}
          </p>
        </div>

      </div>
    </div>
  );
}
