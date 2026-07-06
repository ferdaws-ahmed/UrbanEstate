"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  Heart, 
  MessageSquare, 
  Bell, 
  ArrowRight, 
  Clock, 
  MapPin, 
  TrendingUp,
  Sparkles,
  Loader2,
  Inbox,
  ExternalLink,
  MessageCircle
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function UserOverview() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        const res = await fetch("/api/user/dashboard");
        const result = await res.json();
        if (res.ok) {
          setData(result);
          setUnreadCount(result.stats.unreadMessages || 0);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        if (!silent) setLoading(false);
      }
    };
    if (session) {
      fetchDashboardData();
      const interval = setInterval(() => fetchDashboardData(true), 10000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  const stats = data?.stats || { favorites: 0, inquiries: 0, notifications: 0 };
  const recentFavorites = data?.recentFavorites || [];
  const recentInquiries = data?.recentInquiries || [];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight mb-2 ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>
            Welcome back, <span className="text-blue-600">{session?.user?.name?.split(' ')[0]}!</span> 👋
          </h1>
          <p className={`text-sm font-medium ${isDark ? "text-[var(--muted-foreground)]" : "text-slate-500"}`}>
            Everything looks great today. You have <span className="text-blue-600 font-bold">{stats.notifications} new</span> notifications.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/all-properties"
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2 text-xs"
          >
            <Sparkles size={16} /> Explore Assets
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl hover:-translate-y-1 group ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${isDark ? "bg-rose-500/10 text-rose-400" : "bg-rose-50 text-rose-600"}`}>
              <Heart size={24} fill={stats.favorites > 0 ? "currentColor" : "none"} />
            </div>
            <TrendingUp size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className={`text-4xl font-black mb-1 ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>{stats.favorites}</h3>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-[var(--muted-foreground)]" : "text-slate-400"}`}>Saved Assets</p>
        </div>

        <div className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl hover:-translate-y-1 group ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${isDark ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600"}`}>
              <MessageSquare size={24} />
            </div>
            <TrendingUp size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className={`text-4xl font-black mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{stats.inquiries}</h3>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>Active Inquiries</p>
        </div>

        <div className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl hover:-translate-y-1 group ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className={`p-4 rounded-2xl ${isDark ? "bg-amber-500/10 text-amber-400" : "bg-amber-50 text-amber-600"}`}>
              <Bell size={24} />
            </div>
            <TrendingUp size={16} className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className={`text-4xl font-black mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{stats.notifications}</h3>
          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>New Alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Favorites Section */}
        <div className={`p-8 rounded-[2.5rem] border ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>Recent Favorites</h3>
            <Link href="/dashboard/user/favorites" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentFavorites.length > 0 ? (
              recentFavorites.map((fav) => (
                <div key={fav.id} className={`flex items-center gap-4 p-4 rounded-2xl transition-colors border ${
                  isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg"
                }`}>
                  <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <img src={fav.image} className="h-full w-full object-cover" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>{fav.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-blue-600 font-black text-xs">${fav.price?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 uppercase tracking-tighter truncate max-w-[150px]">
                        <MapPin size={10} /> {fav.location}
                      </span>
                    </div>
                  </div>
                  <Link href={`/propertydetails/${fav.id}?view=1`} className={`p-2 rounded-lg ${isDark ? "bg-white/5 text-slate-400" : "bg-white text-slate-400 shadow-sm"}`}>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                <Inbox size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">No saved assets</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Inquiries Section */}
        <div className={`p-8 rounded-[2.5rem] border ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>My Inquiries</h3>
            <Link href="/dashboard/user/leads" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inquiry) => {
                // Different styles based on inquiry status or type
                const isNew = inquiry.status === 'new';
                const isResponded = inquiry.status === 'responded';
                
                return (
                  <div key={inquiry.id} className={`flex gap-4 p-5 rounded-2xl border transition-all hover:shadow-lg hover:-translate-y-1 ${
                    isNew 
                      ? (isDark ? 'bg-blue-600/10 border-blue-600/20' : 'bg-blue-50 border-blue-100')
                      : isResponded 
                        ? (isDark ? 'bg-emerald-600/10 border-emerald-600/20' : 'bg-emerald-50 border-emerald-100')
                        : (isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100')
                  }`}>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                      isNew 
                        ? 'bg-blue-600 text-white shadow-blue-600/20' 
                        : isResponded 
                          ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                          : 'bg-slate-500 text-white'
                    }`}>
                      <Bell size={20} className={isNew ? "animate-pulse" : ""} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className={`text-[10px] font-black uppercase tracking-widest ${
                          isNew ? 'text-blue-600' : isResponded ? 'text-emerald-600' : 'text-slate-500'
                        }`}>
                          {inquiry.status} inquiry
                        </p>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold mb-1 truncate ${isDark ? "text-[var(--foreground)]" : "text-slate-900"}`}>{inquiry.propertyTitle}</h4>
                      <p className={`text-[11px] truncate italic ${isDark ? 'text-[var(--muted-foreground)]' : 'text-slate-500'}`}>"{inquiry.message}"</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-10 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[2rem]">
                <MessageSquare size={32} className="mx-auto mb-4 opacity-20" />
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">No recent inquiries</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Chat Icon */}
      <Link
        href="/dashboard/user/chat"
        className={`fixed bottom-10 right-10 z-[100] flex h-16 w-16 items-center justify-center rounded-[2rem] shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group
          ${isDark ? "bg-[var(--primary)] border border-[var(--accent)]/20" : "bg-blue-600 border border-blue-500"}
          ${unreadCount > 0 ? "animate-bounce ring-4 ring-blue-500/20 shadow-blue-500/40" : ""}`}
        aria-label="Messages"
      >
        <MessageCircle className={`h-8 w-8 text-white ${unreadCount > 0 ? "animate-pulse" : ""}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[var(--card)] shadow-lg animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}

        {/* Tooltip */}
        <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
          {unreadCount > 0 ? `${unreadCount} New Messages` : "Open Messenger"}
        </div>
      </Link>
    </div>
  );
}

