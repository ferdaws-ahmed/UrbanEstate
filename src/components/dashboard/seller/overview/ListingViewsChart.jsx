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
  const fill = isDark ? "#9ee9d4" : "#2D9CDB";
  const fill2 = isDark ? "#f2994a" : "#F2994A";

  const chartData = data.map((d, i) => ({
    ...d,
    views: d.views ?? 0,
    fill: i % 2 === 0 ? fill : fill2,
  }));

  return (
    <div
      className={`min-w-0 h-full min-h-[260px] rounded-2xl border p-4 shadow-sm ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}
    >
      <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-white">
        Listing Views
      </h3>
      <div className="h-[200px] w-full min-w-0 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1a4a40" : "#e2e8f0"} />
            <XAxis dataKey="day" tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }} />
            <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: isDark ? "#0b1f1a" : "#fff",
                border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0",
                borderRadius: 12,
              }}
            />
            <Bar dataKey="views" radius={[6, 6, 0, 0]}>
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
