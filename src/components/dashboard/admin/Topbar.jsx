"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { useTheme } from '../../ThemeProvider';


function TopbarContent({ loggedInUser }) {
  const router = useRouter();
  const searchParams = useSearchParams(); 
  const themeContext = useTheme(); 
  const dropdownRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = themeContext ? themeContext.isDark : false;
  const setIsDark = themeContext ? themeContext.setIsDark : () => {};

  const user = loggedInUser || {
    name: "S. Islam",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=11",
    email: "admin@urbanestate.com"
  };

  const [currentTime, setCurrentTime] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || "");
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  useEffect(() => {
    if (mounted) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [isDark, mounted]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/data/dashboardData.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

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

  useEffect(() => {
    setSearchQuery(searchParams?.get('q') || "");
  }, [searchParams]);

  const handleLiveSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(value)}`, { scroll: false });
    } else {
      router.push('/search', { scroll: false }); 
    }
  };

  const formattedDateTime = currentTime
    ? currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    : "Loading...";


  if (!mounted) {
    return <div className="h-15 w-full bg-transparent" />;
  }

  return (
    <header className={`w-full h-15 backdrop-blur-xl flex items-center justify-between px-3 md:px-10 border-b sticky top-0 z-40 transition-all duration-300 ${isDark ? 'bg-[#0f2e28]/95 border-[#1a4a40]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-white/95 border-gray-200 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'}`}>

      {/* Left Section: Search Bar */}
      <div className="flex-1 md:w-2/5 mr-2 md:mr-6 flex items-center">
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-lg group">
          <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
            <svg className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-300 ${isDark ? 'text-gray-400 group-focus-within:text-[#cddfa0]' : 'text-gray-400 group-focus-within:text-emerald-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleLiveSearch} 
            placeholder="Search..."
            className={`w-full rounded-xl md:rounded-2xl py-2 md:py-2.5 pl-9 md:pl-12 pr-3 md:pr-4 focus:outline-none shadow-inner transition-all duration-300 italic tracking-wide text-xs md:text-sm border ${isDark ? 'bg-[#0a1a17]/60 border-[#1a4a40] text-gray-200 placeholder-gray-500 focus:bg-[#0f2e28]/80 focus:border-[#cddfa0]/60' : 'bg-gray-100 border-transparent text-gray-800 placeholder-gray-500 focus:bg-white focus:border-emerald-200'}`}
          />
        </form>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-1.5 md:space-x-7 ml-auto flex-shrink-0" ref={dropdownRef}>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`p-1.5 md:p-2.5 rounded-xl border transition-all duration-300 group shadow-sm ${isDark ? 'bg-[#133c34]/50 border-[#1a4a40] hover:border-[#cddfa0]/50' : 'bg-gray-100 border-transparent hover:border-emerald-200'}`}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-[#cddfa0] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Date & Time */}
        <div className="relative hidden lg:block">
          <button
            onClick={() => { setIsDateMenuOpen(!isDateMenuOpen); setIsProfileOpen(false); setIsNotificationOpen(false); }}
            className={`flex items-center gap-2 border rounded-xl px-4 py-2 transition-all duration-300 shadow-sm group ${isDark ? 'bg-[#133c34]/50 border-[#1a4a40] hover:bg-[#1a4a40]/80 hover:border-[#cddfa0]/50' : 'bg-gray-100 border-transparent hover:bg-gray-200'}`}
          >
            <span className={`text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${isDark ? 'text-gray-300 group-hover:text-[#cddfa0]' : 'text-gray-700'}`}>
              {formattedDateTime}
            </span>
            <svg className={`w-4 h-4 transition-transform duration-300 ${isDateMenuOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#cddfa0]' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => { setIsNotificationOpen(!isNotificationOpen); setIsProfileOpen(false); setIsDateMenuOpen(false); }}
            className={`relative p-1.5 md:p-2.5 rounded-xl border transition-all duration-300 group shadow-sm ${isDark ? 'bg-[#133c34]/50 border-[#1a4a40] hover:border-[#cddfa0]/50' : 'bg-gray-100 border-transparent hover:border-emerald-200'}`}
          >
            <svg className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${isDark ? 'text-gray-300 group-hover:text-[#cddfa0]' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3 md:h-5 md:w-5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className={`relative inline-flex items-center justify-center rounded-full h-3 w-3 md:h-5 md:w-5 bg-red-500 border md:border-2 text-[6px] md:text-[10px] font-bold text-white shadow-[0_0_10px_rgba(239,68,68,0.5)] ${isDark ? 'border-[#0a1a17]' : 'border-white'}`}>
                  {unreadCount}
                </span>
              </span>
            )}
          </button>

          {isNotificationOpen && (
            <div className={`absolute right-0 mt-4 w-64 md:w-80 backdrop-blur-md border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] py-2 z-50 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#0a1a17]/95 border-[#1a4a40]' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 border-b flex justify-between items-center ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-100'}`}>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Notifications</h3>
                <span className="text-xs bg-[#cddfa0]/20 text-[#cddfa0] px-2 py-0.5 rounded-full">{unreadCount} New</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {isLoadingNotifications ? (
                  <p className="px-4 py-3 text-sm text-gray-500 text-center">Loading notifications...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <Link href={`/notifications/${notif.id}`} key={notif.id} className={`block px-4 py-3 border-b transition-colors ${isDark ? 'border-[#1a4a40]/30 hover:bg-[#133c34]/50' : 'border-gray-50 hover:bg-gray-50'} ${notif.unread ? (isDark ? 'bg-[#133c34]/20' : 'bg-blue-50/50') : ''}`}>
                      <p className={`text-sm ${notif.unread ? (isDark ? 'text-white font-semibold' : 'text-gray-800 font-semibold') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>{notif.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500 text-center">No new notifications</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`hidden xs:block h-6 md:h-8 w-[2px] bg-gradient-to-b from-transparent to-transparent ${isDark ? 'via-[#1a4a40]' : 'via-gray-300'}`}></div>

        {/* Profile Section */}
        <div className="relative">
          <button
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsDateMenuOpen(false); setIsNotificationOpen(false); }}
            className={`flex items-center gap-1.5 md:gap-3 p-1 rounded-2xl border transition-all duration-300 group ${isDark ? 'hover:bg-[#133c34]/60 border-transparent hover:border-[#1a4a40]' : 'hover:bg-gray-100 border-transparent'}`}
          >
            <div className="hidden sm:flex flex-col items-end">
              <span className={`text-sm font-bold transition-colors ${isDark ? 'text-gray-200 group-hover:text-[#cddfa0]' : 'text-gray-800 group-hover:text-emerald-700'}`}>{user.name}</span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#cddfa0]/70' : 'text-emerald-600'}`}>{user.role}</span>
            </div>
            <div className="relative flex-shrink-0">
              <img src={user.avatar} alt="Profile" className={`w-8 h-8 md:w-10 md:h-10 rounded-xl border md:border-2 transition-all duration-300 object-cover shadow-sm ${isDark ? 'border-[#1a4a40] group-hover:border-[#cddfa0]' : 'border-gray-200 group-hover:border-emerald-500'}`} />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 border md:border-2 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] ${isDark ? 'border-[#0a1a17]' : 'border-white'}`}></span>
            </div>
          </button>

          {isProfileOpen && (
            <div className={`absolute right-0 mt-4 w-48 md:w-60 backdrop-blur-md border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] py-2 z-50 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#0a1a17]/95 border-[#1a4a40]' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 md:px-5 py-3 md:py-4 border-b rounded-t-2xl mx-1 -mt-2 ${isDark ? 'border-[#1a4a40]/50 bg-[#133c34]/20' : 'border-gray-100 bg-gray-50'}`}>
                <p className={`text-sm md:text-base font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{user.name}</p>
                <p className={`text-[10px] md:text-xs mt-1 truncate ${isDark ? 'text-[#cddfa0]/80' : 'text-gray-500'}`}>{user.email}</p>
              </div>
              <div className="py-2 px-1">
                <Link href="/profile" className={`flex items-center gap-3 px-4 py-2 text-xs md:text-sm font-medium rounded-lg mx-2 transition-colors ${isDark ? 'text-gray-300 hover:bg-[#133c34]' : 'text-gray-700 hover:bg-gray-100'}`}>My Profile</Link>
                <button className={`w-full text-left flex items-center gap-3 px-4 py-2 text-xs md:text-sm font-medium rounded-lg mx-2 transition-colors ${isDark ? 'text-red-400 hover:bg-red-900/20' : 'text-red-600 hover:bg-red-50'}`}>Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function Topbar(props) {
  return (
    <Suspense fallback={<div className="h-15 w-full border-b bg-transparent" />}>
      <TopbarContent {...props} />
    </Suspense>
  );
}