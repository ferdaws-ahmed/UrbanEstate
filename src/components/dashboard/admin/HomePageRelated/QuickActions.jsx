"use client";
import React, { useState, useEffect } from 'react';
import { Calendar, Eye, Users, FileSignature, CheckCircle, Clock } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function QuickActions({ actions }) {
  const { isDark } = useTheme();
  const [currentTime, setCurrentTime] = useState('');

  // লাইভ ক্লক আপডেট করার জন্য
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime(); // initial call
    const timer = setInterval(updateTime, 60000); // প্রতি মিনিটে আপডেট
    return () => clearInterval(timer);
  }, []);

  if (!actions || !actions.metrics) return null;

  // ডাইনামিক আইকন এবং কালার সেট করার ফাংশন
  const getIconProps = (type) => {
    switch (type) {
      case 'eye': return { icon: <Eye className="w-4 h-4" />, color: isDark ? 'text-gray-400' : 'text-gray-500', bg: isDark ? 'bg-gray-800' : 'bg-gray-100' };
      case 'users': return { icon: <Users className="w-4 h-4" />, color: isDark ? 'text-blue-400' : 'text-blue-500', bg: isDark ? 'bg-blue-500/10' : 'bg-blue-50' };
      case 'file': return { icon: <FileSignature className="w-4 h-4" />, color: isDark ? 'text-orange-400' : 'text-orange-500', bg: isDark ? 'bg-orange-500/10' : 'bg-orange-50' };
      case 'check': return { icon: <CheckCircle className="w-4 h-4" />, color: isDark ? 'text-[#cddfa0]' : 'text-green-600', bg: isDark ? 'bg-[#cddfa0]/10' : 'bg-green-50' };
      default: return { icon: <Eye className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-transparent' };
    }
  };

  return (
    <div className={`p-4 rounded-[1.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl flex items-center justify-between gap-4 ${
      isDark ? 'bg-[#133c34]/50 border-[#cddfa0]/20 shadow-black/40' : 'bg-white/80 border-gray-200 shadow-gray-200/50'
    }`}>
      
      {/* Left Title & Live Clock Section */}
      <div className={`flex flex-col gap-1 pr-4 sm:pr-6 border-r shrink-0 ${isDark ? 'border-[#1a4a40]' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-blue-100 text-blue-600'}`}>
            <Calendar className="w-4 h-4" />
          </div>
          <h4 className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Today's Pulse</h4>
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Clock className="w-3 h-3" /> {currentTime || "Loading..."}
        </div>
      </div>

      {/* Dynamic Metrics Section - Scrollbar Removed */}
      {/* পরিবর্তন: custom-scrollbar এর বদলে overflow-hidden এবং flex-wrap বা justify-around দিয়ে ব্যালেন্স করা হয়েছে যাতে স্ক্রলবার না আসে */}
      <div className="flex-1 flex justify-between items-center px-2 sm:px-4 gap-4 overflow-hidden">
        {actions.metrics.map((metric, index) => {
          const { icon, color, bg } = getIconProps(metric.icon);
          const progressPercent = Math.min(Math.round((metric.value / metric.target) * 100), 100);

          return (
            <div key={metric.id} className="group relative flex flex-col gap-1.5 flex-1 min-w-[60px]">
              
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-md transition-colors ${bg} ${color} shrink-0`}>
                  {icon}
                </div>
                <p className={`text-[9px] lg:text-[10px] font-bold uppercase truncate ${isDark ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-500 group-hover:text-gray-800'} transition-colors`}>
                  {metric.label}
                </p>
              </div>

              <div className="flex items-end justify-between px-1">
                <span className={`text-base lg:text-lg font-black leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {metric.value}
                </span>
                <span className={`text-[8px] lg:text-[9px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  / {metric.target}
                </span>
              </div>

              {/* Dynamic Mini Progress Bar */}
              <div className={`w-full h-1 mt-0.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1a4a40]' : 'bg-gray-100'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${
                    progressPercent >= 100 ? (isDark ? 'bg-[#cddfa0]' : 'bg-green-500') : 
                    progressPercent > 50 ? 'bg-blue-400' : 'bg-orange-400'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}
