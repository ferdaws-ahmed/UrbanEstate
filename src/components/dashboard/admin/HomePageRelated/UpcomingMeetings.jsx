"use client";

import React from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { CalendarDays, Clock, MapPin, User } from 'lucide-react';

export default function UpcomingMeetings() {
  const { isDark } = useTheme();


  const meetings = [
    { id: 1, title: 'Luxury Villa Tour', time: '10:00 AM', location: 'Banani', Seller: 'Sarah Johnson' },
    { id: 2, title: 'Contract Signing', time: '02:30 PM', location: 'Head Office', Seller: 'David Martinez' },
    { id: 3, title: 'Property Valuation', time: '04:00 PM', location: 'Gulshan 2', Seller: 'Seller Naron' },
    { id: 4, title: 'User Meeting', time: '05:30 PM', location: 'Zoom Call', Seller: 'Rahim Uddin' },
    { id: 5, title: 'Key Handover', time: '06:45 PM', location: 'Dhanmondi', Seller: 'Sarah Johnson' },
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <CalendarDays className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} />
            Upcoming <span className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}>Meetings</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Today's Schedule
          </p>
        </div>
        <div className={`p-1.5 sm:p-2 rounded-xl shrink-0 transition-colors ${isDark ? 'bg-white/5 border border-white/5' : 'bg-emerald-50 border border-emerald-100'}`}>
          <CalendarDays size={14} className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'} />
        </div>
      </div>

      {/* Meetings List with Custom Scrollbar */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
        isDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`} style={{ maxHeight: '350px' }}>
        
        <div className="flex flex-col gap-2.5 w-full">
          {meetings.map((meeting) => (
            <div key={meeting.id} className={`p-3 rounded-xl border flex flex-col gap-2 transition-all duration-300 group ${
              isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'
            }`}>
              
              {/* Title & Time */}
              <div className="flex justify-between items-start gap-2">
                <p className={`text-[11px] sm:text-xs font-black leading-tight break-words ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800'}`}>
                  {meeting.title}
                </p>
                <div className={`flex items-center justify-center gap-1 text-[8px] sm:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md shrink-0 ${
                  isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Clock size={10} className="shrink-0" />
                  <span>{meeting.time}</span>
                </div>
              </div>
              
              {/* Location & Seller */}
              <div className="flex justify-between items-center mt-1 gap-2 flex-wrap">
                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <MapPin size={10} className="shrink-0" />
                  <span className="truncate">{meeting.location}</span>
                </div>
                
                <div className={`flex items-center gap-1 text-[9px] sm:text-[10px] font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  <User size={10} className={`shrink-0 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className="truncate">{meeting.Seller}</span>
                </div>
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
          background: ${isDark ? '#1a4a40' : '#e2e8f0'};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#cddfa0' : '#10b981'};
        }
      `}</style>

      {/* Background Decorative Glow Effect */}
      <div className="absolute top-[-5%] right-[-5%] w-24 h-24 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}
