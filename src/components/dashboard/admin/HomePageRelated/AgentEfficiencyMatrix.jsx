"use client";
import React from 'react';
import { Filter, Timer, TrendingUp, Users, Target, ShieldCheck, ArrowUpRight, Globe, Award } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';

const staticEfficiency = {
  avgResponseTime: "12m",
  conversionRate: "24.8%",
  activeDeals: 14,
  clientSatisfaction: 94,
  targetAchievement: 85,
  totalRevenue: "$1.2M",
  topRegion: "Manhattan",
  globalRank: "#4"
};

export default function AgentEfficiencyMatrix() {
  const { isDark } = useTheme();
  const efficiency = staticEfficiency;

  return (
    <div className={`rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl p-4 sm:p-5 h-full flex flex-col overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Filter className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            Matrix
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5 truncate">Efficiency</p>
        </div>
        <div className={`p-1 sm:p-1.5 rounded-lg shrink-0 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <TrendingUp size={12} className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'} />
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col justify-between gap-3 sm:gap-4">
        
        {/* Row 1: Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className={`p-2 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <Timer size={10} className="text-gray-400 shrink-0" />
              <p className="text-[7px] sm:text-[9px] font-bold uppercase text-gray-500 truncate">Resp.</p>
            </div>
            <p className={`text-xs sm:text-lg font-black leading-tight truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {efficiency.avgResponseTime}
            </p>
          </div>
          
          <div className={`p-2 sm:p-3 rounded-xl border transition-all duration-300 min-w-0 ${
            isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'
          }`}>
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight size={10} className="text-gray-400 shrink-0" />
              <p className="text-[7px] sm:text-[9px] font-bold uppercase text-gray-500 truncate">Conv.</p>
            </div>
            <p className={`text-xs sm:text-lg font-black leading-tight truncate ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
              {efficiency.conversionRate}
            </p>
          </div>
        </div>

        {/* Row 2: Achievement & Rank (New Info) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 px-1">
            <Globe size={12} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[7px] font-bold text-gray-500 uppercase leading-none">Top Region</p>
              <p className={`text-[10px] font-black mt-0.5 truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{efficiency.topRegion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-1">
            <Award size={12} className="text-gray-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[7px] font-bold text-gray-500 uppercase leading-none">Global Rank</p>
              <p className={`text-[10px] font-black mt-0.5 truncate ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>{efficiency.globalRank}</p>
            </div>
          </div>
        </div>

        {/* Row 3: Progress Bars */}
        <div className="space-y-3 px-1">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold uppercase">
              <span className="text-gray-500 truncate">Target</span>
              <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>{efficiency.targetAchievement}%</span>
            </div>
            <div className={`h-1 w-full rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${isDark ? 'bg-[#cddfa0]' : 'bg-blue-600'}`}
                style={{ width: `${efficiency.targetAchievement}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[8px] sm:text-[10px] font-bold uppercase">
              <span className="text-gray-500 truncate">Satis.</span>
              <span className="text-purple-500">{efficiency.clientSatisfaction}%</span>
            </div>
            <div className={`h-1 w-full rounded-full ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
              <div 
                className="h-full rounded-full bg-purple-500 transition-all duration-1000"
                style={{ width: `${efficiency.clientSatisfaction}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className={`pt-3 border-t flex flex-col gap-2 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
          <div className="flex justify-between items-center w-full px-1">
            <div className="min-w-0">
              <p className="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase leading-none">Deals</p>
              <p className={`text-[10px] sm:text-xs font-black mt-1 truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{efficiency.activeDeals} Active</p>
            </div>
            <div className="text-right">
              <p className="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase leading-none">Revenue</p>
              <p className={`text-[10px] sm:text-xs font-black mt-1 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>{efficiency.totalRevenue}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}