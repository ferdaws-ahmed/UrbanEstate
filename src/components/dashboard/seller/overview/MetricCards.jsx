"use client";

import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function MetricCards({ stats }) {
  const { isDark } = useTheme();
  const cardBase =
    "rounded-2xl border p-5 shadow-sm transition-colors " +
    (isDark
      ? "border-[#1a4a40]/50 bg-[#0f2e28]/80"
      : "border-slate-100 bg-white");

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className={cardBase}>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Total Listings
        </p>
        <p className="mt-2 text-3xl font-black text-teal-600 dark:text-[#cddfa0]">
          {stats?.activeListings ?? 0}{" "}
          <span className="text-lg font-bold text-slate-500 dark:text-slate-400">Active</span>
        </p>
      </div>
      <div className={cardBase}>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Avg. Days on Market
        </p>
        <p className="mt-2 text-3xl font-black text-orange-500 dark:text-orange-400">
          {stats?.avgDaysOnMarket ?? 0}{" "}
          <span className="text-lg font-bold text-slate-500 dark:text-slate-400">Days</span>
        </p>
      </div>
    </div>
  );
}
