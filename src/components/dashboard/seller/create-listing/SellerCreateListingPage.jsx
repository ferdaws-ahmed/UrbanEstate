"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerCreateListingPage() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-200" : "border-slate-100 bg-white"
      }`}
    >
      <p className="text-lg font-semibold">Create New Listing</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        নতুন লিস্টিং তৈরি করতে মূল অ্যাপের{" "}
        <Link href="/sellproperty" className="text-teal-600 underline dark:text-[#cddfa0]">
          Sell Property
        </Link>{" "}
        পেজ ব্যবহার করুন।
      </p>
    </div>
  );
}
