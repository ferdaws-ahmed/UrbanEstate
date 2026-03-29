"use client";

import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerAnalyticsPage() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-200" : "border-slate-100 bg-white"
      }`}
    >
      <p className="text-lg font-semibold">Analytics</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        বিস্তারিত অ্যানালিটিক্স শীঘ্রই যুক্ত করা হবে।
      </p>
    </div>
  );
}
