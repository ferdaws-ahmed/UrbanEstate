"use client";

import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Quote } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function UserFeedback({ feedback }) {
  const { isDark } = useTheme();


  const defaultFeedback = [
    { id: 1, User: "Mr. Rahman", time: "2 hours ago", property: "Luxury Villa #APT-402", comment: "Excellent service and smooth paperwork. Highly recommended!", rating: 5 },
    { id: 2, User: "Sarah Ahmed", time: "1 day ago", property: "Commercial Space #PR-102", comment: "The Seller was very professional and helped us find the perfect office.", rating: 5 },
    { id: 3, User: "Dr. Kabir", time: "3 days ago", property: "Land Plot #L-99", comment: "Transparent dealing. Everything was clear from day one. Great experience.", rating: 4 },
    { id: 4, User: "Nusrat Jahan", time: "1 week ago", property: "Duplex #DP-05", comment: "Loved the property tour. Very accommodating staff and prompt response.", rating: 5 },
    { id: 5, User: "Tanvir Hasan", time: "2 weeks ago", property: "Studio Apartment #S-12", comment: "Fast response time and very helpful in negotiating the price.", rating: 4 },
    { id: 6, User: "Farzana Akter", time: "1 month ago", property: "Retail Space #RS-08", comment: "They found the exact location I needed for my new boutique.", rating: 5 },
  ];

  // Logic to guarantee exactly 6 items are shown
  const getMergedData = (userData) => {
    const passedData = userData && Array.isArray(userData) ? userData : [];
    const combined = [...passedData, ...defaultFeedback];
    return combined.slice(0, 6); // Force to show only the top 6
  };

  const [displayData, setDisplayData] = useState(() => getMergedData(feedback));

  // Sync state if props change
  useEffect(() => {
    setDisplayData(getMergedData(feedback));
  }, [feedback]);

  return (
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[var(--card)]/80 to-[var(--background)] border-white/10 shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            User <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Feedback</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Recent Reviews
          </p>
        </div>
        
        {/* Overall Rating Header */}
        <div className={`flex items-center gap-1 p-1.5 px-2 rounded-lg shrink-0 ${isDark ? 'bg-amber-400/10' : 'bg-amber-50'}`}>
          <span className={`text-[10px] sm:text-xs font-black ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>4.9</span>
          <Star size={10} className={`fill-current ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
        </div>
      </div>

      {/* Feedback List with Custom Scrollbar */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
        isDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`} style={{ maxHeight: '350px' }}>
        
        <div className="flex flex-col gap-2.5 w-full">
          {displayData.map((item, index) => (
            <div key={index} className={`p-3 rounded-xl transition-all duration-300 border relative group ${
              isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'
            }`}>
              
              {/* Top Row: Avatar, Name, Time & Stars */}
              <div className="flex justify-between items-start gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {/* User Avatar (Initials) */}
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shrink-0 font-black text-[10px] sm:text-[11px] ${
                    isDark ? 'bg-[var(--card)] text-[#cddfa0]' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {item.User.charAt(0)}
                  </div>
                  
                  {/* Name & Property */}
                  <div className="min-w-0 flex flex-col justify-center pt-0.5">
                    <p className={`text-[10px] sm:text-xs font-black truncate leading-tight ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      {item.User}
                    </p>
                    <p className={`text-[7px] sm:text-[8px] font-bold truncate mt-0.5 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
                      {item.property}
                    </p>
                  </div>
                </div>

                {/* Time & Rating */}
                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className={`text-[7px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {item.time}
                  </span>
                  <div className="flex gap-[1px] text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={8} className={i < (item.rating || 5) ? "fill-current" : "fill-transparent opacity-30"} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Body */}
              <div className="relative pl-1">
                <Quote size={10} className={`absolute -left-1 -top-1 opacity-20 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
                <p className={`text-[9px] sm:text-[10px] leading-relaxed italic pr-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{item.comment}"
                </p>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for THIN Scrollbars */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
          height: 0px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'var(--card)' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#cddfa0' : '#3b82f6'};
        }
      `}</style>

      {/* Background Decorative Glow Effect */}
      <div className="absolute top-[-5%] right-[-5%] w-24 h-24 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}

