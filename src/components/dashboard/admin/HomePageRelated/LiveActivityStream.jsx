"use client";

import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function LiveActivityStream({ activities }) {
  const { isDark } = useTheme();
  
  if (!activities || activities.length === 0) return null;

  return (
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl flex flex-col h-full relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-5 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-sm sm:text-base font-black flex items-center gap-2 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Activity className={`w-4 h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            Live Stream
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Real-time Updates
          </p>
        </div>
        <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
          <Clock size={14} className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'} />
        </div>
      </div>

      {/* Scrolling Container  */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ maxHeight: '350px' }}>
        
      
        <div className="pl-3 sm:pl-4 pt-2 pb-2">
          
          {/* Timeline Line*/}
          <div className={`relative border-l-2 flex flex-col gap-6 ${isDark ? 'border-[#1a4a40]' : 'border-gray-200'}`}>

            {activities.map((act, index) => (
              <div key={act.id} className="relative pl-4 sm:pl-5 group cursor-default">

                {/* Timeline Dot Perfectly Centered */}
                <div className={`absolute -left-[7px] top-1 w-3 h-3 rounded-full border-2 transition-all duration-300 group-hover:scale-125 z-10 ${
                  isDark 
                    ? index === 0 ? 'bg-[#cddfa0] border-[#cddfa0] shadow-[0_0_10px_#cddfa0]' : 'bg-[#091a16] border-[#cddfa0]' 
                    : index === 0 ? 'bg-blue-500 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white border-blue-500'
                }`}></div>

                {/* Content */}
                <div className="flex flex-col gap-1.5">
                  <p className={`text-[11px] sm:text-[13px] font-black leading-none ${isDark ? 'text-gray-100 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>
                    {act.action}
                  </p>
                  <div>
                    <span className={`inline-block text-[7px] sm:text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest whitespace-nowrap ${
                      isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {act.time}
                    </span>
                  </div>
                  <p className={`text-[9px] sm:text-[10px] font-medium leading-snug mt-0.5 pr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {act.details}
                  </p>
                </div>
                
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Custom CSS for THIN Scrollbars */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#1a4a40' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#cddfa0' : '#3b82f6'};
        }
      `}</style>
      
      {/* Decorative Glow Effect */}
      <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}
