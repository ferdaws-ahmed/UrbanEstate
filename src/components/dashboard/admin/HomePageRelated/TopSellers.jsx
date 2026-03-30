"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, TrendingUp, Star, Users, DollarSign, Medal } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function TopSellers({ Sellers = [] }) {
  const [topSellers, setTopSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const sortedSellers = [...Sellers]
      .filter(Seller => Seller.status === 'Active')
      .sort((a, b) => (b.propertiesSold || 0) - (a.propertiesSold || 0))
      .slice(0, 5);

    setTopSellers(sortedSellers);
    setTimeout(() => setIsLoading(false), 500);
  }, [Sellers]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value || 0);
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return "bg-gradient-to-br from-amber-300 to-amber-600 shadow-amber-500/20";
      case 1: return "bg-gradient-to-br from-slate-300 to-slate-500 shadow-slate-400/20";
      case 2: return "bg-gradient-to-br from-orange-300 to-orange-600 shadow-orange-500/20";
      default: return isDark ? "bg-[#1a4a40] text-gray-400" : "bg-gray-100 text-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className={`p-6 rounded-[2rem] border h-full flex items-center justify-center ${isDark ? 'bg-[#133c34]/50 border-[#1a4a40]/60' : 'bg-white/80 border-white'}`}>
        <div className={`w-8 h-8 border-4 rounded-full border-t-transparent animate-spin ${isDark ? 'border-[#cddfa0]' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col h-full ${
      isDark ? 'bg-[#133c34]/50 border-[#1a4a40]/60' : 'bg-white/80 border-white'
    }`}>
      
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className={isDark ? 'text-[#cddfa0]' : 'text-amber-500'} />
            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Top <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Performers</span>
            </h3>
          </div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Monthly Elite Roster</p>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-wider ${
          isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
        }`}>
          <TrendingUp size={12} />
          +12.5%
        </div>
      </div>

      {/* Sellers List */}
      <div className="flex-1 space-y-4">
        {topSellers.map((Seller, index) => (
          <div
            key={Seller.id}
            className={`relative flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300 group cursor-pointer ${
              isDark 
                ? 'bg-[#0f2e28]/40 border-[#1a4a40]/30 hover:bg-[#1a4a40]/60' 
                : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:shadow-lg hover:border-blue-100'
            }`}
          >
            {/* Rank Indicator */}
            <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg z-10 ${getRankStyle(index)}`}>
              {index + 1}
            </div>

            {/* Avatar Section */}
            <div className="relative shrink-0">
              <img
                src={Seller.avatar || `https://ui-avatars.com/api/?name=${Seller.name}&background=random`}
                alt={Seller.name}
                className={`w-11 h-11 rounded-xl object-cover border-2 transition-transform duration-500 group-hover:scale-110 ${
                  isDark ? 'border-[#1a4a40]' : 'border-white shadow-sm'
                }`}
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-[#0f2e28] rounded-full shadow-sm"></div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`text-sm font-black truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>{Seller.name}</h4>
                <div className="flex items-center gap-1 bg-amber-400/10 px-1.5 py-0.5 rounded-md">
                   <Star size={10} className="fill-amber-400 text-amber-400" />
                   <span className="text-[10px] font-black text-amber-600">{Seller.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-bold mb-2">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <Users size={12} className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'} />
                  <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{Seller.propertiesSold}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <DollarSign size={12} className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'} />
                  <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{formatCurrency(Seller.totalRevenue)}</span>
                </div>
              </div>

              {/* Modern Progress Bar */}
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-[#0f2e28]' : 'bg-gray-100'}`}>
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(205,223,160,0.5)] ${
                    isDark ? 'bg-[#cddfa0]' : 'bg-blue-600'
                  }`}
                  style={{ width: `${Math.min(((Seller.propertiesSold || 0) / 40) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats */}
      <div className={`mt-6 pt-4 border-t flex items-center justify-between ${isDark ? 'border-[#1a4a40]' : 'border-gray-100'}`}>
        <span className="text-[11px] font-black uppercase tracking-widest text-gray-500">Active Roster</span>
        <div className={`px-4 py-1.5 rounded-xl font-black text-xs ${
          isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-gray-900 text-white shadow-lg'
        }`}>
          {Sellers.filter(a => a.status === 'Active').length} Members
        </div>
      </div>
    </div>
  );
}
