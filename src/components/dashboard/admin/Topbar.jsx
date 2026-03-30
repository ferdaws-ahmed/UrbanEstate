"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { useSession } from 'next-auth/react';
import { Bell, Sun, Moon, Calendar, User as UserIcon, Settings, ChevronDown } from 'lucide-react';


function TopbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const { isDark, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const user = session?.user || {
    name: "S. Islam",
    role: "Admin",
    image: "https://i.pravatar.cc/150?img=11",
    email: "admin@urbanestate.com"
  };

  const [currentTime, setCurrentTime] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications', { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotifications(data || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };
    if (mounted) fetchNotifications();
  }, [mounted]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
        setIsDateMenuOpen(false);
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formattedDateTime = currentTime
    ? currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    : "Loading...";


  if (!mounted) {
    return <div className="h-16 w-full bg-transparent" />;
  }

  return (
    <header className={`w-full h-16 backdrop-blur-xl flex items-center justify-between px-4 md:px-10 border-b sticky top-0 z-40 transition-all duration-300 ${isDark ? 'bg-[#0f2e28]/90 border-[#1a4a40]/60 shadow-lg' : 'bg-white/90 border-gray-200 shadow-sm'}`}>

      {/* Left Section: Welcome Message (Replaced Search) */}
      <div className="flex-1 flex items-center">
        <div>
          <h1 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Admin Dashboard
          </h1>
          <p className={`text-[10px] font-medium uppercase tracking-[0.2em] ${isDark ? 'text-[#cddfa0]/60' : 'text-emerald-600/70'}`}>
            Urban Estate Management
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2 md:space-x-6 ml-auto flex-shrink-0" ref={dropdownRef}>

        {/* Date & Time */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsProfileOpen(false); setIsNotificationOpen(false); }}
            className={`flex items-center gap-3 border rounded-xl px-4 py-2 transition-all duration-300 group ${isDark ? 'bg-[#133c34]/40 border-[#1a4a40] hover:bg-[#1a4a40]' : 'bg-gray-50 border-gray-200 hover:bg-white shadow-sm'}`}
          >
            <Calendar className={`w-4 h-4 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`} />
            <span className={`text-xs font-bold tracking-wider transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {formattedDateTime}
            </span>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false); setIsDateMenuOpen(false); }}
            className={`relative p-2 rounded-xl border transition-all duration-300 group ${isDark ? 'bg-[#133c34]/40 border-[#1a4a40] hover:bg-[#1a4a40]' : 'bg-gray-50 border-gray-200 hover:bg-white shadow-sm'}`}
          >
            <Bell className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isDark ? 'text-gray-300 group-hover:text-[#cddfa0]' : 'text-gray-600'}`} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 md:h-5 md:w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className={`relative inline-flex items-center justify-center rounded-full h-4 w-4 md:h-5 md:w-5 bg-red-600 border-2 text-[8px] md:text-[10px] font-black text-white shadow-lg ${isDark ? 'border-[#0a1a17]' : 'border-white'}`}>
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className={`absolute right-0 mt-4 w-72 md:w-96 backdrop-blur-xl border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#0a1a17]/95 border-[#1a4a40]' : 'bg-white/95 border-gray-200'}`}>
              <div className={`px-5 py-4 border-b flex justify-between items-center ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-100'}`}>
                <h3 className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2.5 py-1 rounded-full">{unreadCount} New Alerts</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {isLoadingNotifications ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Scanning System...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div key={notif._id || notif.id} className={`block px-5 py-4 border-b transition-colors cursor-pointer ${isDark ? 'border-[#1a4a40]/30 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'} ${!notif.read ? (isDark ? 'bg-emerald-500/5' : 'bg-emerald-50/30') : ''}`}>
                      <div className="flex gap-3">
                        <div className="w-2 h-2 mt-1.5 rounded-full flex-shrink-0 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                        <div>
                          <p className={`text-xs leading-relaxed ${!notif.read ? (isDark ? 'text-white font-bold' : 'text-gray-900 font-bold') : (isDark ? 'text-gray-400 font-medium' : 'text-gray-600 font-medium')}`}>
                            {notif.text}
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-tighter text-gray-500 mt-1.5 flex items-center gap-1">
                            {new Date(notif.createdAt || notif.time).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center opacity-40">
                    <Bell className="w-10 h-10 mb-2" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No alerts detected</p>
                  </div>
                )}
              </div>
              <div className="px-5 py-3 border-t border-transparent text-center">
                <button className={`text-[10px] font-black uppercase tracking-widest hover:underline ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>
                  View All Activity Logs
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={`h-8 w-[1px] ${isDark ? 'bg-[#1a4a40]' : 'bg-gray-200'}`}></div>

        {/* Theme Toggle & Profile Group */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-300 group ${isDark ? 'bg-[#133c34]/40 border-[#1a4a40] text-[#cddfa0] hover:bg-[#1a4a40]' : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-white shadow-sm'}`}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? <Sun className="w-4 h-4 md:w-5 md:h-5" /> : <Moon className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          {/* Profile Section */}
          <div className="relative">
            <button
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsDateMenuOpen(false); setIsNotificationOpen(false); }}
              className={`flex items-center gap-3 p-1 rounded-2xl border transition-all duration-300 group ${isDark ? 'hover:bg-white/5 border-transparent hover:border-[#1a4a40]' : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}`}
            >
              <div className="hidden sm:flex flex-col items-end">
                <span className={`text-sm font-black tracking-tight transition-colors ${isDark ? 'text-white group-hover:text-[#cddfa0]' : 'text-gray-800 group-hover:text-emerald-700'}`}>{user.name}</span>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-emerald-100 text-emerald-700'}`}>{user.role || 'Administrator'}</span>
              </div>
              <div className="relative flex-shrink-0 p-0.5 rounded-xl bg-gradient-to-tr from-emerald-500 to-[#cddfa0]">
                <div className={`rounded-[10px] overflow-hidden border-2 ${isDark ? 'border-[#0a1a17]' : 'border-white'}`}>
                  <img 
                    src={user.image || user.avatar || "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"} 
                    alt="Profile" 
                    className="w-9 h-9 md:w-10 md:h-10 object-cover" 
                  />
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 rounded-full shadow-lg ${isDark ? 'border-[#0a1a17]' : 'border-white'}`}></span>
              </div>
            </button>

            {isProfileOpen && (
              <div className={`absolute right-0 mt-4 w-56 md:w-64 backdrop-blur-xl border rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#0a1a17]/95 border-[#1a4a40]' : 'bg-white/95 border-gray-200'}`}>
                <div className={`px-5 py-4 border-b mx-1 -mt-2 rounded-t-xl ${isDark ? 'border-[#1a4a40]/50 bg-white/5' : 'border-gray-100 bg-gray-50/50'}`}>
                  <p className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                  <p className={`text-[10px] font-bold mt-0.5 truncate text-gray-500 uppercase tracking-tighter`}>{user.email}</p>
                </div>
                <div className="py-2 px-1 space-y-1">
                  <Link href="/dashboard/admin/profile" className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl mx-2 transition-all ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                    <UserIcon className="w-4 h-4" />
                    Profile Settings
                  </Link>
                  <Link href="/dashboard/admin/settings" className={`flex items-center gap-3 px-4 py-2.5 text-xs font-bold rounded-xl mx-2 transition-all ${isDark ? 'text-gray-300 hover:bg-white/10 hover:text-white' : 'text-gray-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                    <Settings className="w-4 h-4" />
                    Dashboard Config
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Topbar(props) {
  return (
    <Suspense fallback={<div className="h-16 w-full border-b bg-transparent animate-pulse" />}>
      <TopbarContent {...props} />
    </Suspense>
  );
}
