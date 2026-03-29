"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerProfilePage() {
  const { isDark } = useTheme();
  return (
    <div
      className={`rounded-2xl border p-8 text-center ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-200" : "border-slate-100 bg-white"
      }`}
    >
      <p className="text-lg font-semibold">Profile</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        প্রোফাইল এডিট করতে{" "}
        <Link href="/updateprofile" className="text-teal-600 underline dark:text-[#cddfa0]">
          Update Profile
        </Link>{" "}
        পেজ ব্যবহার করুন।
      </p>
    </div>
  );
}
