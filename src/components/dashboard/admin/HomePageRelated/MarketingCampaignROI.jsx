"use client";

import React from 'react';
import { Megaphone, TrendingUp, CalendarDays } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';

export default function MarketingCampaignROI({ campaigns }) {
  const { isDark } = useTheme();

  const defaultCampaigns = [
    { id: 1, platform: 'Google Search Ads', spent: '$4.5K', leads: 340, roi: '+240%', progress: 85, color: 'bg-emerald-500', glow: 'rgba(16,185,129,0.8)' },
    { id: 2, platform: 'Facebook & Instagram', spent: '$3.2K', leads: 280, roi: '+180%', progress: 70, color: 'bg-blue-500', glow: 'rgba(59,130,246,0.8)' },
    { id: 3, platform: 'Email Outreach', spent: '$800', leads: 120, roi: '+310%', progress: 95, color: 'bg-amber-500', glow: 'rgba(245,158,11,0.8)' },
    { id: 4, platform: 'TikTok Video Ads', spent: '$1.5K', leads: 190, roi: '+150%', progress: 60, color: 'bg-rose-500', glow: 'rgba(244,63,94,0.8)' },
    { id: 5, platform: 'LinkedIn B2B', spent: '$2.1K', leads: 85, roi: '+120%', progress: 45, color: 'bg-purple-500', glow: 'rgba(168,85,247,0.8)' },
  ];

  const displayData = campaigns && campaigns.length > 0 ? campaigns : defaultCampaigns;

  return (
   
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border transition-all duration-500 shadow-2xl flex flex-col overflow-hidden relative h-[380px] sm:h-[400px] w-full ${
      isDark ? 'bg-gradient-to-b from-[#103029] to-[#071713] border-[#1a4a40] text-white' : 'bg-white border-gray-200 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[12px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Megaphone className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            Marketing <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>ROI</span>
          </h3>
          <p className="text-[7px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">Campaign Performance</p>
        </div>
        <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg shrink-0 border ${isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0] border-[#cddfa0]/20' : 'bg-blue-50 text-blue-600 border-blue-200'}`}>
          <CalendarDays size={10} />
          <span className="text-[7px] sm:text-[8px] font-black uppercase tracking-wider">This Month</span>
        </div>
      </div>

      {/* List */}
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-2 pb-1 custom-scrollbar relative z-10 ${isDark ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        <div className="flex flex-col gap-4 w-full mt-1">
          {displayData.map((camp) => (
            <div key={camp.id} className="relative group">
              <div className="flex justify-between items-end mb-2 gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`text-[11px] sm:text-[13px] font-black truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'}`}>{camp.platform}</p>
                  <div className={`flex items-center gap-1.5 sm:gap-2 mt-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span className="truncate">Spent: <span className={isDark ? 'text-white font-black' : 'text-gray-700 font-black'}>{camp.spent}</span></span>
                    <span className="w-1 h-1 rounded-full bg-gray-500/50 shrink-0"></span>
                    <span className="truncate">Leads: <span className={isDark ? 'text-white font-black' : 'text-gray-700 font-black'}>{camp.leads}</span></span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-[11px] sm:text-[13px] font-black flex items-center justify-end gap-1 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'} drop-shadow-md`}>
                    <TrendingUp className="w-3.5 h-3.5" strokeWidth={3} /> {camp.roi}
                  </p>
                </div>
              </div>
              <div className={`w-full h-1.5 sm:h-2 rounded-full overflow-hidden relative border ${isDark ? 'bg-[#050e0c] border-[#1a4a40]/60' : 'bg-gray-200 border-transparent'}`}>
                {isDark && <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, #fff 2px, #fff 4px)' }}></div>}
                <div className={`h-full rounded-full ${camp.color} relative z-10 opacity-90 group-hover:opacity-100 transition-all duration-1000 ease-out`} style={{ width: `${camp.progress}%`, boxShadow: isDark ? `0 0 8px ${camp.glow}, 0 0 12px ${camp.glow}` : 'none' }}>
                  <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/50 rounded-full blur-[2px]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; height: 0px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border: none; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#1a4a40' : '#e2e8f0'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#cddfa0' : '#3b82f6'}; }
      `}</style>
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}