"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../ThemeProvider';

export default function UserGrowthChart({ data }) {
  const { isDark } = useTheme();

  const colors = {
    bg: isDark ? 'bg-[#133c34]/50' : 'bg-white/80',
    border: isDark ? 'border-[#1a4a40]/60' : 'border-white',
    lineStroke: isDark ? '#cddfa0' : '#2563eb',
    grid: isDark ? 'rgba(26, 74, 64, 0.4)' : 'rgba(229, 231, 235, 0.5)',
    text: isDark ? '#9ca3af' : '#64748b'
  };

  return (
    <div className={`p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${colors.bg} ${colors.border}`}>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            User <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Growth</span>
          </h3>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Community Expansion Hub</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
          <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Trending Up
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
          
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.lineStroke} stopOpacity={0.3} />
              <stop offset="95%" stopColor={colors.lineStroke} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke={colors.grid} 
            vertical={false} 
          />

          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }} 
            dy={15}
          />

          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: colors.text, fontSize: 11, fontWeight: 600 }} 
          />

          <Tooltip 
            cursor={{ stroke: colors.lineStroke, strokeWidth: 1, strokeDasharray: '5 5' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl ${isDark ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30' : 'bg-white/95 border-blue-100'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {payload[0].payload.month}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-[#cddfa0]' : 'bg-blue-600'}`}></div>
                      <p className={`text-lg font-black ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
                        {payload[0].value.toLocaleString()} Users
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Area 
            type="monotone" 
            dataKey="users" 
            stroke={colors.lineStroke} 
            strokeWidth={4} 
            fillOpacity={1} 
            fill="url(#userGradient)"
            dot={{ r: 4, fill: colors.lineStroke, strokeWidth: 2, stroke: isDark ? "#091a16" : "#fff" }}
            activeDot={{ r: 6, fill: colors.lineStroke, strokeWidth: 2, stroke: isDark ? "#fff" : "#fff" }}
            animationDuration={2500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}