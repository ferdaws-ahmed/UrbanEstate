"use client";

import { useState, useEffect } from 'react';
import { MoreHorizontal, Trophy, Star } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function SellerLeaderboard() {
  const { isDark } = useTheme();
  const [Sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await fetch('/api/admin/dashboard', { cache: 'no-store' });
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        let SellersList = Array.isArray(data.sellers) ? data.sellers : [];
        
        // Ensure totalRevenue exists for sorting
        const sortedSellers = SellersList.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));

        setSellers(sortedSellers);
      } catch (error) {
        console.error("Error fetching Sellers data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSellers();
  }, []);

  if (isLoading) {
    return (
      <div className={`p-6 rounded-[1.5rem] border h-full flex items-center justify-center ${
        isDark ? 'bg-[#133c34]/80 border-[#1a4a40]' : 'bg-white border-gray-100'
      }`}>
        <p className="text-xs font-bold animate-pulse text-gray-400 text-center">Loading...</p>
      </div>
    );
  }

  if (!Sellers || Sellers.length === 0) return null;

  return (
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
      isDark 
        ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
        : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0">
        <div className="min-w-0">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <Star className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-500'}`} />
            Leaderboard
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Top Sellers</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors shrink-0">
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Leaderboard List with X and Y Scroll */}
      <div className={`flex-1 overflow-auto relative z-10 pr-1 pb-2 custom-scrollbar scroll-smooth ${
        isDark ? 'scrollbar-dark' : 'scrollbar-light'
      }`} style={{ maxHeight: '350px' }}>
        
  
        <div className="flex flex-col gap-2 min-w-[320px]">
          {Sellers.map((Seller, index) => (
            <div key={Seller.id} className={`flex items-center justify-between group cursor-pointer p-2 rounded-xl transition-all duration-300 ${
              isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'
            }`}>
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="w-4 flex justify-center shrink-0">
                  {index === 0 ? (
                    <Trophy size={12} className="text-amber-400" />
                  ) : (
                    <span className="text-[9px] sm:text-[10px] font-black text-gray-500">{index + 1}</span>
                  )}
                </div>
                
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img 
                    src={Seller.avatar || `https://ui-avatars.com/api/?name=${Seller.name}&background=random`} 
                    alt={Seller.name} 
                    className="w-7 h-7 rounded-full border border-white/10 group-hover:scale-105 transition-transform object-cover" 
                  />
                  {index < 3 && (
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border ${
                      isDark ? 'bg-emerald-500 border-[#0a2e26]' : 'bg-emerald-500 border-white'
                    }`}></div>
                  )}
                </div>
                
                {/* Name & Role */}
                <div className="whitespace-nowrap pr-2">
                  <p className={`text-[11px] sm:text-xs font-black leading-tight ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-600'} transition-colors`}>
                    {Seller.name}
                  </p>
                  <p className="text-[8px] sm:text-[9px] font-medium text-gray-500 leading-tight mt-0.5">
                    {Seller.specialty || Seller.role || 'Seller'}
                  </p>
                </div>
              </div>
              
              {/* Sales Stat */}
              <div className={`text-[10px] sm:text-xs font-black shrink-0 ml-2 ${isDark ? 'text-gray-300 group-hover:text-[#cddfa0]' : 'text-gray-600 group-hover:text-blue-600'} transition-colors`}>
                {Seller.totalRevenue ? `$${(Seller.totalRevenue / 1000).toFixed(1)}K` : Seller.sales || '$0'}
              </div>
            </div>
          ))}
        </div>
      </div>

     
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
          height: 3px; 
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
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
}
