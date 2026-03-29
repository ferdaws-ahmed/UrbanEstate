"use client";

import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { MessageSquare, ArrowRight } from "lucide-react";

export default function RecentInquiries({ items = [] }) {
  const { isDark } = useTheme();
  const rows = Array.isArray(items) ? items : [];

  return (
    <div
      className={`h-full flex flex-col rounded-[2rem] border p-6 shadow-sm transition-all duration-300 ${
        isDark ? "border-[#1a4a40]/50 bg-[#0b1f1a]" : "border-slate-100 bg-white"
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Recent Leads
          </h3>
          <p className="mt-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Latest property inquiries
          </p>
        </div>
        <Link
          href="/dashboard/seller/leads"
          className="group flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-[#cddfa0] hover:underline"
        >
          View All <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="flex-1 space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
            <MessageSquare className="h-8 w-8 mb-2" />
            <p className="text-xs font-bold uppercase tracking-widest">No inquiries yet</p>
          </div>
        ) : (
          rows.map((item) => (
            <div
              key={item.id}
              className={`group flex gap-4 rounded-2xl p-3 transition-all duration-300 hover:scale-[1.02] ${
                isDark ? "bg-[#061510]/50 hover:bg-[#1a4a40]/30" : "bg-slate-50 hover:bg-teal-50/50"
              }`}
            >
              <div
                className={`h-12 w-12 shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                  isDark ? "bg-[#1a4a40] border-white/5 group-hover:border-[#cddfa0]/30" : "bg-teal-100 border-white group-hover:border-teal-200"
                }`}
              >
                {item.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-black text-teal-700 dark:text-[#cddfa0]">
                    {item.name?.charAt(0) || "?"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm font-black truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                    {item.name}
                  </p>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Just now'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-1 italic">
                  "{item.message}"
                </p>
                {item.propertyTitle && (
                  <p className="mt-1 text-[8px] font-black text-teal-600 dark:text-[#cddfa0] uppercase tracking-widest truncate">
                    Property: {item.propertyTitle}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

