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
  const stroke = isDark ? "#9ee9d4" : "#2D9CDB";

  return (
    <div
      className={`min-w-0 h-full min-h-[260px] rounded-2xl border p-4 shadow-sm ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}
    >
      <h3 className="mb-4 text-sm font-bold text-slate-800 dark:text-white">
        Inquiries Trend
      </h3>
      <div className="h-[200px] w-full min-w-0 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={200}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="inqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#1a4a40" : "#e2e8f0"} />
            <XAxis dataKey="month" tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }} />
            <YAxis tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                background: isDark ? "#0b1f1a" : "#fff",
                border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0",
                borderRadius: 12,
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke={stroke}
              strokeWidth={2}
              fill="url(#inqGrad)"
              dot={{ fill: "#F2994A", strokeWidth: 0, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
