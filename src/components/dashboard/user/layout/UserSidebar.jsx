"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiX } from "react-icons/hi";
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  User,
  Home,
  Settings,
  ArrowLeft,
  Bell,
  MessageCircle,
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const menuItems = [
  { name: "Overview", path: "/dashboard/user", icon: LayoutDashboard },
  { name: "Chat", path: "/dashboard/user/chat", icon: MessageCircle, badge: "unreadMessages" },
  { name: "Saved Assets", path: "/dashboard/user/favorites", icon: Heart },
  { name: "My Inquiries", path: "/dashboard/user/leads", icon: MessageSquare },
  { name: "My Profile", path: "/dashboard/user/profile", icon: User },
  { name: "Settings", path: "/dashboard/user/settings", icon: Settings },
];

export default function UserSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { isDark } = useTheme();
  const { data: session } = useSession();
  const [stats, setStats] = useState({ unreadMessages: 0 });

  // Polling for unread messages
  useEffect(() => {
    if (!session) return;
    
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/user/dashboard");
        const data = await res.json();
        if (res.ok) setStats({ unreadMessages: data.stats.unreadMessages });
      } catch (e) { console.error(e); }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [session]);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        suppressHydrationWarning
        className={`fixed inset-y-0 left-0 z-[110] w-64 border-r flex flex-col transition-transform duration-300 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          ${
            isDark
              ? "bg-[#0b1f1a] border-[#1a4a40]/50"
              : "bg-white border-slate-200 shadow-xl"
          }`}
      >
        <div suppressHydrationWarning className={`flex items-center justify-between px-6 py-6 border-b transition-colors duration-300 ${
          isDark ? "border-[#1a4a40]/50" : "border-slate-100 bg-slate-50/50"
        }`}>
          <Link 
            href="/" 
            suppressHydrationWarning 
            className={`flex items-center gap-3 group cursor-pointer p-2 rounded-2xl transition-all duration-300 ${
              isDark ? "hover:bg-white/5" : "hover:bg-blue-50"
            }`}
          >
            <div
              suppressHydrationWarning
              className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-inner transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                isDark ? "bg-blue-600/20 text-blue-400" : "bg-blue-600 text-white shadow-blue-200"
              }`}
            >
              <Home className="h-5 w-5" />
            </div>
            <div suppressHydrationWarning>
              <p className={`font-black text-sm tracking-tight transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"} group-hover:text-blue-600`}>
                UrbanEstate
              </p>
              <p className="text-[10px] uppercase font-black tracking-widest text-blue-600/80 dark:text-blue-400/70">
                User Panel
              </p>
            </div>
          </Link>
          <button onClick={onClose} className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
            <HiX size={20} />
          </button>
        </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto custom-scrollbar">
        {menuItems.map(({ name, path, icon: Icon, badge }) => {
          const active =
            path === "/dashboard/user"
              ? pathname === path
              : pathname?.startsWith(path);
          const badgeValue = badge ? stats[badge] : 0;

          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300
                ${
                  active
                    ? isDark
                      ? "bg-blue-600/20 text-blue-400 shadow-inner border border-white/5"
                      : "bg-blue-600 text-white shadow-lg shadow-blue-100 border border-blue-500"
                    : isDark
                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-transparent"
                } group`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-all duration-300 ${active ? "opacity-100 scale-110" : "opacity-60 group-hover:opacity-100 group-hover:scale-110"}`} />
                <span>{name}</span>
              </div>
              {badgeValue > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                  active ? "bg-white text-blue-600" : "bg-blue-600 text-white animate-pulse"
                }`}>
                  {badgeValue}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className={`p-4 space-y-3 border-t transition-colors duration-300 ${isDark ? "border-[#1a4a40]/40" : "border-slate-100 bg-slate-50/30"}`}>
        <Link
          href="/"
          className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300
            ${
              isDark
                ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-sm"
            }`}
        >
          <ArrowLeft size={14} />
          Back to Portal
        </Link>
        <div
          className={`px-4 pt-1 text-[9px] font-bold uppercase tracking-widest transition-colors duration-300 ${
            isDark ? "text-slate-500" : "text-slate-400"
          }`}
        >
          © {new Date().getFullYear()} UrbanEstate v1.0
        </div>
      </div>
    </aside>
  </>
);
}
