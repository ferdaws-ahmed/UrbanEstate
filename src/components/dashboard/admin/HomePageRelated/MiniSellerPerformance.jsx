"use client";

import React from 'react';
import { MoreHorizontal, TrendingUp, Medal } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function MiniSellerPerformance() {
  const { isDark } = useTheme();


  const Sellers = [
    { id: 1, name: 'S. Mr Islam', role: 'Senior Seller', sales: 45, avatar: 'S+Islam' },
    { id: 2, name: 'Seller Naron', role: 'Property Consultant', sales: 38, avatar: 'Seller+Naron' },
    { id: 3, name: 'Sarah Johnson', role: 'Luxury Specialist', sales: 32, avatar: 'Sarah+J' },
    { id: 4, name: 'David Martinez', role: 'Commercial Seller', sales: 28, avatar: 'David+M' },
    { id: 5, name: 'Michael Chen', role: 'Investment Advisor', sales: 24, avatar: 'Michael+C' },
    { id: 6, name: 'Aisha Rahman', role: 'Leasing Seller', sales: 19, avatar: 'Aisha+R' },
    { id: 7, name: 'Hasan Mahmud', role: 'Area Manager', sales: 17, avatar: 'Hasan+M' },
    { id: 8, name: 'Emily Clark', role: 'Junior Seller', sales: 15, avatar: 'Emily+C' },
    { id: 9, name: 'Tariq Zia', role: 'Field Executive', sales: 12, avatar: 'Tariq+Z' },
    { id: 10, name: 'Fatima Begum', role: 'User Advisor', sales: 10, avatar: 'Fatima+B' },
    { id: 11, name: 'John Doe', role: 'Sales Intern', sales: 8, avatar: 'John+D' },
    { id: 12, name: 'Nusrat Jahan', role: 'Property Consultant', sales: 5, avatar: 'Nusrat+J' },
  ];

  return (
    <div className={`p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[var(--card)]/80 to-[var(--background)] border-white/10 shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header - Ultra Compact */}
      <div className="flex justify-between items-start mb-3 relative z-10 shrink-0 gap-1.5">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[11px] sm:text-[13px] font-black flex items-center gap-1.5 truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <TrendingUp className={`w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            <span className="truncate">Seller Performance</span>
          </h3>
          <p className="text-[6px] sm:text-[7px] font-bold text-gray-500 uppercase tracking-widest mt-1 truncate">
            Top Sellers This Month
          </p>
        </div>
        <button className={`p-1 rounded-md shrink-0 transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <MoreHorizontal size={12} className={isDark ? 'text-[#cddfa0]' : 'text-gray-600'} />
        </button>
      </div>

      {/* Top Banner / Chart placeholder area */}
      <div className={`flex items-end justify-between w-full h-10 mb-3 px-2 py-1.5 rounded-xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
         <div className="flex items-end gap-1 h-full opacity-80 shrink-0 pt-1">
            {[40, 70, 30, 90, 50, 100].map((h, i) => (
              <div key={i} className={`w-1 sm:w-1.5 rounded-t-sm transition-all duration-500 ${
                i === 5 ? (isDark ? 'bg-[#cddfa0] shadow-[0_0_6px_rgba(205,223,160,0.5)]' : 'bg-blue-600') : (isDark ? 'bg-[var(--card)]' : 'bg-blue-200')
              }`} style={{ height: `${h}%` }}></div>
            ))}
         </div>
         {/* Top chart text */}
         <div className="text-right flex-1 min-w-0 pl-1 flex flex-col justify-end">
             <p className="text-[6px] sm:text-[7px] font-black text-gray-400 uppercase tracking-widest truncate leading-none mb-1">
               Properties Sold
             </p>
             <p className={`text-[10px] sm:text-[11px] font-black leading-none ${isDark ? 'text-white' : 'text-gray-800'}`}>
               186 <span className="text-[6px] text-emerald-500 ml-0.5">↑ 12%</span>
             </p>
         </div>
      </div>

      {/* Seller List with Custom Scrollbar */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
        isDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`} style={{ maxHeight: '280px' }}>
        
        <div className="flex flex-col gap-1.5 w-full">
          {Sellers.map((Seller, index) => (
            
            <div key={Seller.id} className={`flex items-center justify-between gap-1 p-1.5 sm:p-2 rounded-xl transition-all duration-300 group ${
              isDark ? 'bg-black/20 border border-white/5 hover:bg-white/5 hover:border-white/10' : 'bg-white border border-gray-100 hover:shadow-md'
            }`}>
              
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                {/* Rank / Medal */}
                <div className="w-3 sm:w-3.5 shrink-0 flex justify-center">
                  {index === 0 ? (
                    <Medal size={10} className="text-amber-400 drop-shadow-md" />
                  ) : index === 1 ? (
                    <Medal size={10} className="text-gray-400 drop-shadow-md" />
                  ) : index === 2 ? (
                    <Medal size={10} className="text-amber-700 drop-shadow-md" />
                  ) : (
                    <span className={`text-[8px] sm:text-[9px] font-bold ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{Seller.id}</span>
                  )}
                </div>
                
                {/* Avatar */}
                <img 
                  src={`https://ui-avatars.com/api/?name=${Seller.avatar}&background=random&color=fff&bold=true`} 
                  alt={Seller.name} 
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-sm shrink-0" 
                />
                
                {/* Details */}
                <div className="min-w-0 flex flex-col justify-center">
                  <p className={`text-[8px] sm:text-[10px] font-black leading-tight truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'}`}>
                    {Seller.name}
                  </p>
                  <p className={`text-[6px] sm:text-[7px] font-medium leading-tight truncate mt-[1px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {Seller.role}
                  </p>
                </div>
              </div>
              
              {/* Score Box */}
              <div className={`flex items-center justify-center min-w-[22px] sm:min-w-[26px] px-1 py-0.5 rounded border shrink-0 ${
                isDark ? 'bg-[var(--card)]/50 border-white/10 text-[#cddfa0]' : 'bg-blue-50 border-blue-100 text-blue-600'
              }`}>
                <span className="text-[8px] sm:text-[9px] font-black">
                  {Seller.sales}
                </span>
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

