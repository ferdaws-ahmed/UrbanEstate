"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function ListingViewsChart({ data = [] }) {
  const { isDark } = useTheme();
  const fill = isDark ? "#cddfa0" : "#0d9488";
  const fill2 = isDark ? "var(--card)" : "#ccfbf1";

  const rows = Array.isArray(data) ? data : [];
  const chartData = rows.map((d, i) => ({
    ...d,
    views: d.views ?? 0,
    fill: i % 2 === 0 ? fill : fill2,
  }));

  return (
    <div
      className={`min-w-0 h-full min-h-[320px] rounded-[2rem] border p-6 shadow-sm transition-all duration-300 ${
        isDark ? "border-white/10 bg-[var(--card)]" : "border-slate-200 bg-white"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Listing Views
          </h3>
          <p className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Last 7 Days Activity
          </p>
        </div>
      </div>
      
      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={isDark ? "var(--card)" : "#f1f5f9"} />
            <XAxis 
              dataKey="day" 
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
              cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)' }}
              contentStyle={{
                background: isDark ? "var(--card)" : "#fff",
                border: isDark ? "1px solid var(--card)" : "1px solid #e2e8f0",
                borderRadius: 16,
                fontSize: 12,
                fontWeight: 700,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
              }}
            />
            <Bar dataKey="views" radius={[6, 6, 0, 0]} barSize={20}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


