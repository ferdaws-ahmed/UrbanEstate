"use client";

import { HelpCircle, Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerTopbar({ title = "Dashboard" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="sticky top-0 z-[80] flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-8
      bg-white/90 backdrop-blur-md border-slate-200
      dark:bg-[#0b1f1a]/95 dark:border-[#1a4a40]/40"
    >
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Help"
          className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0b1f1a]" />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Light mode" : "Dark mode"}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700
            dark:border-[#1a4a40] dark:bg-[#1a4a40]/40 dark:text-[#cddfa0]"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div
          className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 ring-2 ring-white dark:ring-[#1a4a40]"
          aria-hidden
        />
      </div>
    </header>
  );
}
