"use client";

import React from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { Home, Users, CheckCircle, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCards({ stats }) {
  const { isDark } = useTheme();

  // Fallback data in case stats prop is undefined
  const defaultStats = {
    newLeads: { value: 425, trend: "+15%" }, 
    propertiesSold: { value: 301, trend: "+8%" }, 
    revenue: { value: 3300000, trend: "+12%" }, 
  };

  const safeStats = stats || defaultStats;

  const cardData = [
    { 
      title: "Total Listings", 
      data: safeStats.totalListings, 
      icon: <Home size={16} />, 
      color: "emerald" 
    },
    { 
      title: "New Leads", 
      data: safeStats.newLeads, 
      icon: <Users size={16} />, 
      color: "emerald" 
    },
    { 
      title: "Properties Sold", 
      data: safeStats.propertiesSold, 
      icon: <CheckCircle size={16} />, 
      color: "emerald" 
    },
    { 
      title: "Total Revenue", 
      data: safeStats.revenue, 
      icon: <DollarSign size={16} />, 
      isPrice: true, 
      color: "emerald" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cardData.map((item, index) => {
        const trendString = String(item.data?.trend || "");
        const isNegative = trendString.includes('-') || trendString.toLowerCase().includes('down');
        const progressWidth = isNegative ? '35%' : '75%';
        
        return (
          <div 
            key={index} 
            className={`relative p-5 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl group overflow-hidden flex flex-col justify-between ${
              isDark 
                ? 'bg-gradient-to-b from-[var(--card)]/80 to-[var(--background)] border-white/10 shadow-black/40 hover:border-[#cddfa0]/30 hover:shadow-2xl' 
                : 'bg-white/80 border-gray-200 shadow-gray-200/50 hover:shadow-2xl hover:border-blue-100'
            }`}
          >
            {/* Background Glow Effect */}
            <div className={`absolute -right-5 -top-5 w-24 h-24 rounded-full blur-3xl opacity-10 transition-all duration-700 group-hover:opacity-30 group-hover:scale-150 ${
              isDark ? 'bg-[#cddfa0]' : 'bg-blue-500'
            }`}></div>

            <div className="flex justify-between items-start relative z-10 gap-3 mb-4">
              {/* Icon Section */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 shadow-sm shrink-0 ${
                isDark 
                  ? 'bg-[var(--card)] border-white/10 text-emerald-400' 
                  : 'bg-white border-gray-100 text-emerald-600'
              }`}>
                {item.icon}
              </div>

              {/* FIXED TREND BADGE: Made much smaller (px-1.5, py-0.5, text-[8px], icon size 8) */}
              <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded border transition-colors shrink-0 w-fit text-[8px] font-black uppercase tracking-wider ${
                isNegative
                  ? isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200'
                  : isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0] border-[#cddfa0]/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {isNegative ? <TrendingDown size={8} strokeWidth={3} /> : <TrendingUp size={8} strokeWidth={3} />}
                <span>{trendString}</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative z-10 mt-auto">
              
              {/* FIXED TITLE HEIGHT: h-[32px] prevents single-line text from pulling the number upwards! */}
              <div className="h-[28px] sm:h-[32px] flex items-end mb-1">
                <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] leading-snug w-full ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {item.title}
                </p>
              </div>
              
              {/* Numbers */}
              <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {item.isPrice 
                  ? `$${((item.data?.value || 0) / 1000000).toFixed(1)}M` 
                  : (item.data?.value || 0).toLocaleString()
                }
              </h3>
            </div>
            
            {/* Bottom Progress Indicator */}
            <div className={`mt-4 w-full h-[3px] rounded-full overflow-hidden ${isDark ? 'bg-[var(--background)] shadow-inner' : 'bg-gray-100'}`}>
               <div 
                className={`h-full rounded-full transition-all duration-1000 ease-out opacity-70 group-hover:opacity-100 ${
                  isNegative ? 'bg-rose-500' : (isDark ? 'bg-emerald-500' : 'bg-emerald-600')
                }`}
                style={{ width: progressWidth }} 
                ref={(el) => { 
                  if(el) {
                    el.style.width = '0%';
                    setTimeout(() => { el.style.width = progressWidth }, 50);
                  } 
                }}
               ></div>
            </div>

          </div>
        );
      })}
    </div>
  );
}

