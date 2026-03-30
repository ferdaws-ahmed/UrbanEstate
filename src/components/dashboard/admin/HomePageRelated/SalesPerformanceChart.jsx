"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useTheme } from '@/src/components/Theme/ThemeContext';

export default function SalesPerformanceChart({ data }) {
  const { isDark } = useTheme();

  
  const colors = {
    bg: isDark ? 'bg-[#133c34]/50' : 'bg-white/80',
    border: isDark ? 'border-[#1a4a40]/60' : 'border-white',
    barFill: isDark ? '#cddfa0' : '#2563eb',
    grid: isDark ? 'rgba(26, 74, 64, 0.4)' : 'rgba(229, 231, 235, 0.5)',
    text: isDark ? '#9ca3af' : '#64748b'
  };

  return (
    <div className={`p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${colors.bg} ${colors.border}`}>
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Sales <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Performance</span>
          </h3>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Monthly Revenue Analytics</p>
        </div>
        <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-blue-50 text-blue-600'}`}>
          Live Update
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <defs>
          
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.barFill} stopOpacity={1} />
              <stop offset="100%" stopColor={colors.barFill} stopOpacity={0.6} />
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
            cursor={{ fill: isDark ? 'rgba(205, 223, 160, 0.05)' : 'rgba(37, 99, 235, 0.03)', radius: 10 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl ${isDark ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30' : 'bg-white/95 border-blue-100'}`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {payload[0].payload.month}
                    </p>
                    <p className={`text-lg font-black ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
                      ${payload[0].value.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />

          <Bar 
            dataKey="value" 
            radius={[8, 8, 4, 4]} 
            barSize={32}
            animationBegin={300}
            animationDuration={2000}
            animationEasing="ease-in-out"
          >
            {data?.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="url(#barGradient)"
                className="hover:opacity-80 transition-all duration-300 cursor-pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
