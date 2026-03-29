"use client";

import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerLeadsPage() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border p-8 ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-200" : "border-slate-100 bg-white"
      }`}
    >
      <p className="text-lg font-semibold">Leads & Messages</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        MongoDB কালেকশন <code className="rounded bg-black/10 px-1">seller_leads</code> এ লিড সেভ হলে
        সেগুলো ড্যাশবোর্ড ওভারভিউতে দেখা যাবে।
      </p>
    </div>
  );
}
