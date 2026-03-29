"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function InquiriesTrendChart({ data = [] }) {
  const { isDark } = useTheme();
  const rows = Array.isArray(data) ? data : [];

  return (
    <div
      className={`min-w-0 h-full min-h-[320px] rounded-[2rem] border p-6 shadow-sm transition-all duration-300 ${
        isDark ? "border-[#1a4a40]/50 bg-[#0b1f1a]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Inquiries Trend
          </h3>
          <p className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last 6 Months Performance
          </p>
        </div>
      </div>

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? "#cddfa0" : "#0d9488"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isDark ? "#cddfa0" : "#0d9488"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDark ? "#1a4a40" : "#f1f5f9"} />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10, fontWeight: 700 }} 
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10, fontWeight: 700 }} 
            />
            <Tooltip
              contentStyle={{
                background: isDark ? "#0b1f1a" : "#fff",
                border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={isDark ? "#cddfa0" : "#0d9488"}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
