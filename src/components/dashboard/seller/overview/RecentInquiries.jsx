"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function RecentInquiries({ items = [] }) {
  const { isDark } = useTheme();

  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          Recent Inquiries
        </h3>
        <Link
          href="/dashboard/seller/leads"
          className="text-xs font-semibold text-teal-600 hover:underline dark:text-[#cddfa0]"
        >
          View All
        </Link>
      </div>
      <ul className="space-y-3 max-h-[220px] overflow-y-auto">
        {items.length === 0 ? (
          <li className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
            এখনো কোনো ইনকোয়ারি নেই।
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className={`flex gap-3 rounded-xl p-2 ${
                isDark ? "bg-[#061510]/50" : "bg-slate-50"
              }`}
            >
              <div
                className={`h-10 w-10 shrink-0 rounded-full overflow-hidden ${
                  isDark ? "bg-[#1a4a40]" : "bg-teal-100"
                }`}
              >
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-bold text-teal-700 dark:text-[#cddfa0]">
                    {item.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {item.message}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
