"use client";

import React from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { ArrowUpRight, CheckCircle2, DollarSign } from 'lucide-react';

export default function LatestTransactions() {
  const { isDark } = useTheme();

  
  const transactions = [
    { id: 'TRX-928', property: 'Apt 48 - Gulshan', amount: '$450k', date: 'Today, 10:30 AM', Seller: 'Sarah Johnson' },
    { id: 'TRX-927', property: 'Villa - Banani', amount: '$1.2M', date: 'Yesterday', Seller: 'David Martinez' },
    { id: 'TRX-926', property: 'Office - Motijheel', amount: '$850k', date: 'Mar 14, 2026', Seller: 'Michael Chen' },
    { id: 'TRX-925', property: 'Duplex - Dhanmondi', amount: '$920k', date: 'Mar 12, 2026', Seller: 'Seller Naron' },
    { id: 'TRX-924', property: 'Plot - Bashundhara', amount: '$2.5M', date: 'Mar 10, 2026', Seller: 'Rahim Uddin' },
    { id: 'TRX-923', property: 'Studio - Uttara', amount: '$180k', date: 'Mar 08, 2026', Seller: 'Sarah Johnson' },
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
            <DollarSign className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} />
            Latest <span className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}>Deals</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
            Recently Closed
          </p>
        </div>
        <button className={`p-1.5 sm:p-2 rounded-xl shrink-0 transition-colors ${isDark ? 'bg-white/5 border border-white/5 hover:bg-white/10' : 'bg-emerald-50 border border-emerald-100 hover:bg-emerald-100'}`}>
          <ArrowUpRight size={14} className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'} />
        </button>
      </div>

      {/* Transactions List with Custom Scrollbar */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
        isDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`} style={{ maxHeight: '350px' }}>
        
        <div className="flex flex-col gap-2.5 w-full">
          {transactions.map((trx, index) => (
            <div key={index} className={`flex items-center justify-between gap-2 p-2.5 rounded-xl border transition-all duration-300 group ${
              isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'
            }`}>
              
              {/* Left Side: Icon & Details */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                  isDark ? 'bg-[#133c34] text-emerald-400 group-hover:text-[#cddfa0]' : 'bg-white text-emerald-500 shadow-sm'
                }`}>
                  <CheckCircle2 size={12} />
                </div>
                
                <div className="min-w-0 flex flex-col justify-center">
                  <p className={`text-[11px] sm:text-xs font-black leading-tight truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800'}`}>
                    {trx.property}
                  </p>
                  <p className={`text-[8px] sm:text-[9px] font-medium leading-none truncate mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Closed by {trx.Seller}
                  </p>
                </div>
              </div>
              
              {/* Right Side: Amount & Date */}
              <div className="flex flex-col items-end shrink-0 pl-2 border-l border-white/5">
                <p className={`text-[11px] sm:text-xs font-black ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>
                  {trx.amount}
                </p>
                <p className={`text-[7px] sm:text-[8px] font-bold uppercase tracking-wider mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {trx.date}
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
