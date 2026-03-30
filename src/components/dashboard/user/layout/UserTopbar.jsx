"use client";

import { HelpCircle, Bell, Moon, Sun, User, LogOut, Settings, ExternalLink, Menu, Heart, Search } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserTopbar({ title = "User Dashboard", onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

  // Initial mount check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch notifications (Reusing the same API if available)
  useEffect(() => {
    if (session?.user) {
      fetch("/api/notifications")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setNotifications(data);
            setUnreadCount(data.filter((n) => !n.read).length);
          }
        })
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [session, isNotificationsOpen]);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ readAll: true }),
        headers: { "Content-Type": "application/json" },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        body: JSON.stringify({ id }),
        headers: { "Content-Type": "application/json" },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      suppressHydrationWarning
      className={`sticky top-0 z-[80] flex h-16 items-center justify-between gap-4 border-b px-4 sm:px-8 transition-all duration-300
      ${
        isDark
          ? "bg-[#0b1f1a] border-[#1a4a40]/40"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className={`md:hidden p-2 rounded-xl transition-colors ${
            isDark ? "bg-white/5 text-slate-400" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <Menu size={20} />
        </button>
        <h1 className={`text-xl sm:text-2xl font-black tracking-tighter truncate ${isDark ? "text-white" : "text-slate-900"}`}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <Link
          href="/all-properties"
          className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            isDark 
              ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-blue-400" 
              : "bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <Search size={14} />
          <span>Find Assets</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            aria-label="Notifications"
            className={`relative rounded-full p-2 transition-all ${
              isNotificationsOpen 
                ? isDark ? "bg-white/10 text-blue-400" : "bg-blue-50 text-blue-600"
                : isDark ? "text-slate-400 hover:bg-white/10" : "text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className={`absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ${isDark ? "ring-[#0b1f1a]" : "ring-white"}`} />
            )}
          </button>

          {isNotificationsOpen && (
            <div className={`absolute right-0 mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
              isDark ? "bg-[#0b1f1a] border-[#1a4a40]/50" : "bg-white border-slate-200"
            }`}>
              <div className={`p-4 border-b flex justify-between items-center ${
                isDark ? "border-[#1a4a40]/30 bg-white/5" : "border-slate-100 bg-slate-50"
              }`}>
                <h3 className={`font-black text-xs uppercase tracking-widest ${isDark ? "text-white" : "text-slate-900"}`}>Notifications</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[9px] text-blue-600 dark:text-blue-400 hover:underline font-black uppercase tracking-wider"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id} 
                      onClick={() => !notif.read && markAsRead(notif._id)}
                      className={`p-4 border-b last:border-0 transition-colors cursor-pointer group ${
                        isDark 
                          ? `border-[#1a4a40]/20 hover:bg-white/5 ${!notif.read ? 'bg-blue-900/10' : ''}` 
                          : `border-slate-50 hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/50' : ''}`
                      }`}
                    >
                      <p className={`text-xs ${
                        !notif.read 
                          ? isDark ? 'text-white font-bold' : 'text-slate-900 font-bold' 
                          : 'text-slate-500 dark:text-slate-400'
                      } group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors`}>
                        {notif.text}
                      </p>
                      <p className="text-[9px] text-slate-400 mt-1.5 font-bold uppercase tracking-tighter">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <Bell className={`h-8 w-8 mx-auto mb-3 opacity-20 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">No alerts detected</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:scale-105 active:scale-95 ${
            isDark 
              ? "border-[#1a4a40] bg-[#1a4a40]/40 text-blue-400 hover:bg-[#1a4a40]" 
              : "border-slate-200 bg-white text-slate-700 hover:border-blue-500 hover:text-blue-600 shadow-sm"
          }`}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 focus:outline-none group"
          >
            <div
              suppressHydrationWarning
              className={`h-9 w-9 rounded-xl shadow-lg transition-transform group-hover:scale-105 overflow-hidden border-2 ${
                isDark ? "border-[#1a4a40]" : "border-white"
              }`}
            >
              {mounted && session?.user?.image ? (
                <img src={session.user.image} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-blue-600 flex items-center justify-center text-white font-black text-xs">
                  {mounted && session?.user?.name ? session.user.name.charAt(0) : "U"}
                </div>
              )}
            </div>
          </button>

          {isProfileOpen && (
            <div className={`absolute right-0 mt-3 w-64 rounded-2xl border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 ${
              isDark ? "bg-[#0b1f1a] border-[#1a4a40]/50" : "bg-white border-slate-200"
            }`}>
              <div className={`p-5 border-b transition-colors ${
                isDark ? "border-[#1a4a40]/30 bg-white/5" : "border-slate-100 bg-slate-50"
              }`}>
                <p className={`text-xs font-black uppercase tracking-tighter truncate ${isDark ? "text-white" : "text-slate-900"}`}>
                  {session?.user?.name || "User Identity"}
                </p>
                <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate mt-1">
                  {session?.user?.email || "user@urbanestate.com"}
                </p>
              </div>
              <div className="p-2 space-y-1">
                <Link
                  href="/dashboard/user/profile"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDark 
                      ? "text-slate-400 hover:bg-white/5 hover:text-blue-400" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="h-4 w-4" />
                  <span>My Profile</span>
                </Link>
                <Link
                  href="/dashboard/user/favorites"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDark 
                      ? "text-slate-400 hover:bg-white/5 hover:text-blue-400" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                  onClick={() => setIsProfileOpen(false)}
                >
                  <Heart className="h-4 w-4" />
                  <span>Saved Assets</span>
                </Link>
                <div className="border-t border-white/5 my-1" />
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDark 
                      ? "text-red-400 hover:bg-red-400/10" 
                      : "text-red-600 hover:bg-red-50"
                  }`}
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
