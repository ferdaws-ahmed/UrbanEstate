"use client";

import React from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { Home, Building2, Map, Building, Store, MoreHorizontal } from 'lucide-react';

export default function PropertyType() {
  const { isDark } = useTheme();

  const propertyTypes = [
    { name: 'Apartment', percentage: 45, count: '540', icon: Building2, color: 'bg-emerald-500', glow: 'rgba(16,185,129,0.8)' },
    { name: 'Commercial', percentage: 25, count: '300', icon: Building, color: 'bg-blue-500', glow: 'rgba(59,130,246,0.8)' },
    { name: 'Villa/Duplex', percentage: 15, count: '180', icon: Home, color: 'bg-amber-500', glow: 'rgba(245,158,11,0.8)' },
    { name: 'Land Plot', percentage: 10, count: '120', icon: Map, color: 'bg-purple-500', glow: 'rgba(168,85,247,0.8)' },
    
  ];

  return (
    
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-500 shadow-2xl flex flex-col overflow-hidden relative w-full h-full ${
      isDark 
        ? 'bg-gradient-to-b from-[#103029] to-[#071713] border-white/10 text-white' 
        : 'bg-white border-gray-200 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[12px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Building2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} />
            Property <span className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}>Types</span>
          </h3>
          <p className="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight whitespace-normal break-words">
            Portfolio Breakdown
          </p>
        </div>
        <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-[var(--card)] hover:bg-[#cddfa0]/20' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <MoreHorizontal size={14} className={isDark ? 'text-[#cddfa0]' : 'text-gray-600'} />
        </button>
      </div>

      {/* List Area */}
      <div className="flex flex-col gap-3 w-full relative z-10 mt-1">
        {propertyTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <div key={index} className={`flex flex-col gap-2.5 p-3 rounded-[1.2rem] transition-all duration-300 border group cursor-default ${
              isDark 
                ? 'bg-[#153b32]/40 border-white/10 hover:bg-[var(--card)]/60 hover:border-[#cddfa0]/30 shadow-sm' 
                : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md hover:border-emerald-200'
            }`}>
              
              {/* Info Row */}
              <div className="flex justify-between items-center gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  
                  {/* Icon Box with futuristic glow on hover */}
                  <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 transition-all duration-300 ${
                    isDark ? 'bg-[var(--background)] border border-white/10 text-emerald-400 group-hover:text-[#cddfa0] group-hover:shadow-[0_0_8px_rgba(205,223,160,0.2)]' : 'bg-white border border-gray-100 text-emerald-500 shadow-sm group-hover:shadow-md'
                  }`}>
                    <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                  
                  {/* Property Name */}
                  <span className={`text-[10px] sm:text-[12px] font-black truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-emerald-700'}`}>
                    {type.name}
                  </span>
                </div>
                
                {/* Percentage & Count */}
                <div className="text-right shrink-0 flex items-center gap-1.5 sm:gap-2">
                  <span className={`text-[11px] sm:text-[13px] font-black drop-shadow-sm ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>
                    {type.percentage}%
                  </span>
                  <div className={`px-1.5 py-0.5 rounded text-[7px] sm:text-[8px] font-bold border ${isDark ? 'bg-[var(--card)] text-gray-300 border-white/10' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    ({type.count})
                  </div>
                </div>
              </div>
              
              {/* Futuristic Animated Progress Bar */}
              <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden relative border ${isDark ? 'bg-[#050e0c] border-[var(--card)]/60' : 'bg-gray-200 border-transparent'}`}>
                
                {/* Striped Background Pattern for Dark Mode (Cyberpunk vibe) */}
                {isDark && (
                  <div 
                    className="absolute inset-0 opacity-20 pointer-events-none" 
                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}
                  ></div>
                )}

                {/* Glowing Fill */}
                <div 
                  className={`h-full rounded-full ${type.color} opacity-85 group-hover:opacity-100 transition-all duration-1000 ease-out relative z-10`} 
                  style={{ 
                    width: `${type.percentage}%`,
                    boxShadow: isDark ? `0 0 8px ${type.glow}, 0 0 12px ${type.glow}` : 'none'
                  }}
                >
                  {/* Inner highlight core (Makes it look like a neon tube) */}
                  <div className="absolute right-0 top-0 bottom-0 w-3 bg-white/50 rounded-full blur-[1px]"></div>
                </div>
                
              </div>
              
            </div>
          );
        })}
      </div>

      {/* Background Decorative Glow Effect */}
      <div className="absolute top-[-5%] right-[-5%] w-32 h-32 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}

