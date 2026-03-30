"use client";
import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, Clock, Flame, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function SmartInventorySnapshot({ inventory }) {
  const { isDark } = useTheme();


  const defaultInventory = [
    { name: "Luxury Penthouse - Gulshan", roi: "12%", daysOnMarket: 4, status: "Hot" },
    { name: "Commercial Space - Banani", roi: "8%", daysOnMarket: 45, status: "Stagnant" },
    { name: "Duplex Villa - Dhanmondi", roi: "15%", daysOnMarket: 2, status: "Hot" },
    { name: "Office Floor - Motijheel", roi: "7%", daysOnMarket: 60, status: "Stagnant" },
    { name: "Studio Apt - Bashundhara", roi: "10%", daysOnMarket: 12, status: "Hot" },
    { name: "Retail Shop - Uttara", roi: "6%", daysOnMarket: 90, status: "Stagnant" },
  ];

  // Magic Logic: Combine user data with default data to guarantee exactly 6 items
  const getMergedData = (userData) => {
    const passedData = userData && Array.isArray(userData) ? userData : [];
    const combined = [...passedData, ...defaultInventory];
    return combined.slice(0, 6); 
  };

  const [displayData, setDisplayData] = useState(() => getMergedData(inventory));

  // Sync if props change
  useEffect(() => {
    setDisplayData(getMergedData(inventory));
  }, [inventory]);

  // Dropdown & Toast States
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const statusOptions = ["Hot", "Stagnant"];

  // Status Update Handler (Now uses index instead of ID to prevent clashes)
  const handleStatusChange = (index, newStatus) => {
    const newData = [...displayData];
    newData[index] = { ...newData[index], status: newStatus };
    setDisplayData(newData);
    setOpenDropdownIndex(null);
    showToast(`Property marked as ${newStatus}`);
  };

  // Toast Function
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <>
      {/* Global Dynamic Toast Message */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 transition-all duration-500 ease-out w-[90%] sm:w-auto justify-center ${
        toastMessage ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
      } ${isDark ? "bg-[#133c34]/95 border-[#cddfa0]/50 text-[#cddfa0]" : "bg-white/95 border-emerald-200 text-emerald-600"}`}>
        <CheckCircle2 size={24} className="shrink-0" />
        <span className="text-[14px] sm:text-[16px] font-black tracking-wide">{toastMessage}</span>
      </div>

      <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
        isDark 
          ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
          : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
      }`}>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              <AlertCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
              Inventory <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Alerts</span>
            </h3>
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
              Properties requiring attention
            </p>
          </div>
          <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <MoreHorizontal size={14} className={isDark ? 'text-[#cddfa0]' : 'text-gray-600'} />
          </button>
        </div>

        {/* List Section with Custom Scrollbar */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
          isDark ? 'scrollbar-dark' : 'scrollbar-light'
        }`} style={{ maxHeight: "350px" }}>
          
          <div className="flex flex-col gap-2.5 w-full">
            {displayData.map((item, index) => (
              
              <div key={index} className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-3 p-3 rounded-xl transition-all duration-300 border group ${
                isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'
              }`}>
                
                <div className="flex items-start gap-2.5 flex-1 min-w-[130px]">
                  {/* Icon Box */}
                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    item.status === 'Hot'
                      ? isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-blue-50 text-blue-600'
                      : isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {item.status === 'Hot' ? <Flame size={14} /> : <Clock size={14} />}
                  </div>

                  <div className="flex flex-col pt-0.5 min-w-0">
                    <p className={`text-[11px] sm:text-[12px] font-black leading-snug whitespace-normal transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'}`}>
                      {item.name}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      {/* ROI Indicator */}
                      <div className={`flex items-center gap-1 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-[#1a4a40] text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                        <TrendingUp size={10} className={isDark ? 'text-[#cddfa0]' : 'text-blue-500'} />
                        <span>ROI: <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>{item.roi}</span></span>
                      </div>
                      
                      {/* Days on Market Indicator */}
                      <div className={`flex items-center gap-1 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-[#1a4a40] text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
                        <span>{item.daysOnMarket} Days</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive Status Badge with Dropdown */}
                <div className="relative shrink-0 ml-auto self-start sm:self-auto mt-1 sm:mt-0">
                  <button 
                    onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                    className={`w-[65px] flex items-center justify-center px-1.5 py-1 rounded-md border transition-all hover:scale-105 active:scale-95 ${
                      item.status === 'Stagnant' 
                        ? isDark 
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                          : 'bg-rose-50 text-rose-600 border-rose-200'
                        : isDark 
                          ? 'bg-[#cddfa0]/10 text-[#cddfa0] border-[#cddfa0]/30' 
                          : 'bg-blue-50 text-blue-600 border-blue-200'
                    }`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest leading-none text-center">
                      {item.status}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownIndex === index && (
                    <div className={`absolute right-0 top-full mt-1.5 w-24 rounded-lg shadow-xl border z-50 overflow-hidden backdrop-blur-xl ${
                      isDark ? "bg-[#091a16]/95 border-[#1a4a40]" : "bg-white/95 border-gray-200"
                    }`}>
                      {statusOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleStatusChange(index, opt)}
                          className={`w-full text-left px-3 py-2 text-[9px] font-black transition-colors ${
                            item.status === opt 
                              ? (isDark ? 'bg-[#cddfa0]/20 text-[#cddfa0]' : 'bg-blue-50 text-blue-600') 
                              : isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
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
            background: ${isDark ? '#cddfa0' : '#3b82f6'};
          }
        `}</style>

        {/* Background Decorative Glow Effect */}
        <div className="absolute top-[-5%] right-[-5%] w-24 h-24 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      </div>
    </>
  );
}
