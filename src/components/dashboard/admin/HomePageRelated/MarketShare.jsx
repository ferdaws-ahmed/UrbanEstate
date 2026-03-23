"use client";

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { PieChart as PieChartIcon, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';

export default function MarketShare({ data }) {
  const { isDark } = useTheme();


  const chartData = data || [
    { name: 'Gulshan', value: 450 },
    { name: 'Banani', value: 300 },
    { name: 'Dhanmondi', value: 250 },
    { name: 'Uttara', value: 200 },
    { name: 'Bashundhara', value: 150 },
  ];

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);
  

  const COLORS = isDark 
    ? ['#cddfa0', '#34d399', '#3b82f6', '#f59e0b', '#8b5cf6'] 
    : ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <PieChartIcon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            Market <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Share</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Regional Dominance
          </p>
        </div>
        <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <MoreHorizontal size={14} className={isDark ? 'text-[#cddfa0]' : 'text-gray-600'} />
        </button>
      </div>

      <div className="relative flex-1 flex flex-col w-full mt-2">
        
        {/* Animated Pie Chart Area */}
        <div className="w-full h-[150px] sm:h-[180px] relative shrink-0">
           {/* Center Text inside Donut */}
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none mt-1">
              <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Total Sales</p>
              <p className={`text-xl sm:text-2xl font-black leading-none mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{total}</p>
           </div>
           
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie 
                 data={chartData} 
                 innerRadius={"65%"} 
                 outerRadius={"90%"} 
                 stroke="none" 
                 dataKey="value" 
                 paddingAngle={5} 
                 cornerRadius={8}
               >
                 {chartData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 outline-none" />
                 ))}
               </Pie>
             </PieChart>
           </ResponsiveContainer>
        </div>

        {/* Legend / Data List with Custom Scrollbar */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 mt-3 custom-scrollbar relative z-10 ${
          isDark ? 'scrollbar-dark' : 'scrollbar-light'
        }`} style={{ maxHeight: "180px" }}>
          
          <div className="flex flex-col gap-2 w-full">
            {chartData.map((entry, index) => (
              <div key={index} className={`flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 group ${
                isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'
              }`}>
                
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Color Dot */}
                  <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-125" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  
                  {/* Name */}
                  <span className={`text-[10px] sm:text-[11px] font-black truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-700 group-hover:text-blue-600'}`}>
                    {entry.name}
                  </span>
                </div>
                
                {/* Value & Percentage */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {entry.value}
                  </span>
                  <div className={`flex items-center justify-center px-1.5 py-0.5 min-w-[36px] rounded border ${
                    isDark ? 'bg-[#133c34] border-[#1a4a40]' : 'bg-blue-50 border-blue-100'
                  }`}>
                    <span className={`text-[9px] font-black ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
                      {((entry.value / total) * 100).toFixed(0)}%
                    </span>
                  </div>
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
  );
}