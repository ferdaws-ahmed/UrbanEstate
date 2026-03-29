"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerListingsPage() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-200" : "border-slate-100 bg-white"
      }`}
    >
      <p className="text-lg font-semibold">My Listings</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        সম্পূর্ণ লিস্টিং ম্যানেজমেন্ট শীঘ্রই এখানে যুক্ত করা হবে। এখন ড্যাশবোর্ড ওভারভিউ থেকে টেবিল দেখুন।
      </p>
      <Link
        href="/dashboard/seller"
        className="mt-4 inline-block text-sm font-semibold text-teal-600 dark:text-[#cddfa0]"
      >
        ← ড্যাশবোর্ডে ফিরুন
      </Link>
    </div>
  );
}
