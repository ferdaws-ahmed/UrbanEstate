"use client";

import React, { useState, useEffect, useRef, Suspense } from 'react'; 
import { useRouter, useSearchParams } from 'next/navigation'; 
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Profile data sync logic added here
  const initialUser = useRef(loggedInUser || {
    name: "S. Islam",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=11",
    email: "admin@urbanestate.com"
  });

  const [user, setUser] = useState(initialUser.current);

  useEffect(() => {
    const loadUser = () => {
      try {
        const storedProfile = window.localStorage.getItem("ue_profile");
        if (storedProfile) {
          const parsedProfile = JSON.parse(storedProfile);
          setUser({
            name: `${parsedProfile.firstName || ''} ${parsedProfile.lastName || ''}`.trim() || initialUser.current.name,
            role: parsedProfile.jobTitle || initialUser.current.role,
            avatar: parsedProfile.avatar || initialUser.current.avatar,
            email: parsedProfile.email || initialUser.current.email
          });
        }
      } catch (e) {
        console.warn("Failed to load profile", e);
      }
    };

    if (mounted) {
      loadUser();
    }

    window.addEventListener('profileUpdated', loadUser);
    window.addEventListener('storage', loadUser);

    return () => {
      window.removeEventListener('profileUpdated', loadUser);
      window.removeEventListener('storage', loadUser);
    };
  }, [mounted]);

  const [currentTime, setCurrentTime] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  // Calendar specific state
  const [viewDate, setViewDate] = useState(new Date());
  const [inputYear, setInputYear] = useState(new Date().getFullYear());

  // Reset calendar view to today when opened
  useEffect(() => {
    if (isDateMenuOpen) {
      setViewDate(new Date());
      setInputYear(new Date().getFullYear());
    }
  }, [isDateMenuOpen]);

  // Sync input year when viewDate changes via arrows
  useEffect(() => {
    setInputYear(viewDate.getFullYear());
  }, [viewDate]);
  
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || "");
  
  // ─── Dynamic Notifications State & Logic ───────────────────────────────────
  const [notifications, setNotifications] = useState([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [expandedNotifId, setExpandedNotifId] = useState(null); // State for FAQ style expansion

  // Helper function to generate meaningful details based on notification text
  const getMeaningfulDetails = (text) => {
    const lowerText = (text || "").toLowerCase();
    if (lowerText.includes('property') || lowerText.includes('listing')) {
      return "The property details have been successfully synchronized. Click here to view full property analytics and manage client interactions related to this listing.";
    }
    if (lowerText.includes('review') || lowerText.includes('message') || lowerText.includes('inquiry')) {
      return "You have received new feedback or messages from a client. Please navigate to the communication center to read and reply promptly.";
    }
    if (lowerText.includes('user') || lowerText.includes('agent') || lowerText.includes('client')) {
      return "New activity has been detected for this user account. Review their profile to see recent actions, permissions, and status updates.";
    }
    if (lowerText.includes('payment') || lowerText.includes('bill') || lowerText.includes('invoice')) {
      return "A recent billing transaction has been processed in your account. You can verify and download the official invoice from the billing section.";
    }
    return "Please review this alert and take any necessary actions from your admin dashboard. Keeping track of these updates ensures smooth operation.";
  };

  useEffect(() => {
    let isSubscribed = true;

    const loadNotifications = async () => {
      try {
        // Read tracked read notifications
        const readIdsStr = window.localStorage.getItem('ue_read_notifs');
        let readIds = [];
        if (readIdsStr) {
          try { readIds = JSON.parse(readIdsStr); } catch (e) {}
        }

        // 1. Check if we already have dynamic notifications in localStorage
        const dynamicNotifsStr = window.localStorage.getItem('ue_dynamic_notifs');
        let dynamicNotifs = [];
        if (dynamicNotifsStr) {
          try { dynamicNotifs = JSON.parse(dynamicNotifsStr); } catch (e) {}
        }

        if (dynamicNotifs.length > 0) {
          // If dynamic notifications exist, use them ONLY (ignore JSON)
          if (isSubscribed) {
            const mappedDynamic = dynamicNotifs.map(n => ({
              ...n,
              unread: readIds.includes(n.id) ? false : n.unread
            }));
            setNotifications(mappedDynamic);
            setIsLoadingNotifications(false);
          }
        } else {
          // 2. If NO dynamic notifications, load the default JSON ones
          const response = await fetch('/data/dashboardData.json', { cache: 'no-store' });
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          if (isSubscribed) {
            // Adding a detailed message & applying saved read states
            const enhancedData = (data.notifications || []).map(n => ({
              ...n,
              unread: readIds.includes(n.id) ? false : n.unread, // Ensure read state persists on refresh
              details: n.details || getMeaningfulDetails(n.text)
            }));
            setNotifications(enhancedData);
            setIsLoadingNotifications(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        if (isSubscribed) setIsLoadingNotifications(false);
      }
    };

    if (mounted) {
      loadNotifications();
    }

    // 3. Listen for new dynamic notifications from anywhere in the project
    const handleNewDynamicNotification = (e) => {
      const newNotif = e.detail;
      // Ensure dynamic notifications also have a details field with meaningful fallback
      if(!newNotif.details) {
        newNotif.details = getMeaningfulDetails(newNotif.text);
      }
      
      // Get existing dynamic notifs from storage
      const existingDynamicStr = window.localStorage.getItem('ue_dynamic_notifs');
      let existingDynamic = [];
      if (existingDynamicStr) {
        try { existingDynamic = JSON.parse(existingDynamicStr); } catch (err) {}
      }
      
      // Add new notification to the top
      const updatedNotifs = [newNotif, ...existingDynamic];
      window.localStorage.setItem('ue_dynamic_notifs', JSON.stringify(updatedNotifs));
      
      // Update state immediately (This completely replaces the JSON ones)
      setNotifications(updatedNotifs);
    };

    // Sync across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'ue_dynamic_notifs' || e.key === 'ue_read_notifs') {
        loadNotifications();
      }
    };

    window.addEventListener('addDynamicNotification', handleNewDynamicNotification);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      isSubscribed = false;
      window.removeEventListener('addDynamicNotification', handleNewDynamicNotification);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [mounted]);

  // Handle clicking a notification to mark as read AND expand
  const handleNotificationClick = (id) => {
    // Toggle expand/collapse
    setExpandedNotifId(prevId => prevId === id ? null : id);

    // Mark as read in local state
    const updatedNotifs = notifications.map(n => 
      n.id === id ? { ...n, unread: false } : n
    );
    setNotifications(updatedNotifs);

    try {
      // Save read state globally so it persists upon refresh
      const readIdsStr = window.localStorage.getItem('ue_read_notifs');
      let readIds = readIdsStr ? JSON.parse(readIdsStr) : [];
      if (!readIds.includes(id)) {
        readIds.push(id);
        window.localStorage.setItem('ue_read_notifs', JSON.stringify(readIds));
      }

      // Update local storage if it's dynamic
      const existingDynamicStr = window.localStorage.getItem('ue_dynamic_notifs');
      if (existingDynamicStr) {
        let existingDynamic = JSON.parse(existingDynamicStr);
        const isDynamic = existingDynamic.some(n => n.id === id);
        if (isDynamic) {
          existingDynamic = existingDynamic.map(n => 
            n.id === id ? { ...n, unread: false } : n
          );
          window.localStorage.setItem('ue_dynamic_notifs', JSON.stringify(existingDynamic));
        }
      }
    } catch (err) {}
  };

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
        setExpandedNotifId(null); // Collapse all when closing dropdown
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

  // Calendar Calculation Helpers
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Festival/Events mapping (MonthIndex-Day format)
  const festivalsObj = {
    "0-1": "New Year's Day",
    "1-21": "International Mother Language Day",
    "2-17": "Sheikh Mujibur Rahman's Birthday",
    "2-26": "Independence Day",
    "3-14": "Pohela Boishakh",
    "4-1": "May Day",
    "7-15": "National Mourning Day",
    "11-16": "Victory Day",
    "11-25": "Christmas Day"
  };

  const getFestival = (m, d) => festivalsObj[`${m}-${d}`];
  const currentMonthFestivals = Object.entries(festivalsObj).filter(([key]) => key.startsWith(`${month}-`));

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

        {/* Date & Time with Advanced Calendar */}
        <div className="relative hidden md:block">
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

          {/* Advanced Calendar Dropdown */}
          {isDateMenuOpen && (
            <div className={`absolute right-0 mt-4 w-[calc(100vw-2rem)] sm:w-72 lg:w-80 max-w-sm backdrop-blur-xl border rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] p-4 sm:p-5 z-50 animate-in fade-in zoom-in duration-200 ${isDark ? 'bg-[#0a1a17]/95 border-[#1a4a40]' : 'bg-white border-gray-200'}`}>
              
              {/* Type to Jump / Calendar Controls */}
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex justify-between items-center w-full">
                  <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month - 1, 1)); }} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#1a4a40] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`} title="Previous Month">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                  </button>
                  
                  {/* Month and Year Selectors */}
                  <div className="flex gap-1.5 items-center justify-center flex-1">
                    <select 
                      value={month} 
                      onChange={(e) => { e.stopPropagation(); setViewDate(new Date(year, parseInt(e.target.value), 1)); }}
                      className={`text-sm font-bold bg-transparent outline-none cursor-pointer p-1 rounded transition-colors border-none ${isDark ? 'text-white hover:bg-[#1a4a40]' : 'text-gray-800 hover:bg-gray-100'}`}
                    >
                      {monthNames.map((m, i) => <option key={m} value={i} className={isDark ? "bg-[#0a1a17] text-white" : "bg-white text-gray-900"}>{m}</option>)}
                    </select>
                    
                    <input 
                      type="number" 
                      value={inputYear}
                      onChange={(e) => {
                        setInputYear(e.target.value);
                        const y = parseInt(e.target.value);
                        if (y > 1000 && y < 9999) {
                          setViewDate(new Date(y, month, 1));
                        }
                      }}
                      className={`w-16 text-sm font-bold text-center outline-none p-1 border rounded transition-colors ${isDark ? 'bg-[#0a1a17] text-white border-[#1a4a40] focus:border-[#cddfa0]' : 'bg-white text-gray-800 border-gray-200 focus:border-emerald-500'}`}
                    />
                  </div>

                  <button onClick={(e) => { e.stopPropagation(); setViewDate(new Date(year, month + 1, 1)); }} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-[#1a4a40] text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`} title="Next Month">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(wd => (
                  <div key={wd} className={`text-[10px] font-black uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{wd}</div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1 place-items-center">
                {/* Empty slots for previous month padding */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="w-7 h-7 sm:w-8 sm:h-8"></div>
                ))}
                
                {/* Actual Days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const isToday = dayNum === currentTime?.getDate() && month === currentTime?.getMonth() && year === currentTime?.getFullYear();
                  const festivalName = getFestival(month, dayNum);

                  return (
                    <div 
                      key={dayNum} 
                      title={festivalName || ''}
                      className={`relative w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition-all
                        ${isToday 
                          ? (isDark ? 'bg-[#cddfa0] text-[#0a1a17] shadow-[0_0_10px_rgba(205,223,160,0.5)] font-black scale-110' : 'bg-emerald-500 text-white shadow-md font-black scale-110') 
                          : (isDark ? 'text-gray-300 hover:bg-[#1a4a40] hover:text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black')}
                      `}
                    >
                      {dayNum}
                      {/* Festival Dot on Date */}
                      {festivalName && (
                        <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${isToday ? 'bg-black/50' : 'bg-amber-500'}`}></span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explicit Festival List for Current View Month */}
              {currentMonthFestivals.length > 0 ? (
                <div className={`mt-3 pt-3 border-t ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-200'}`}>
                  <p className={`text-[10px] uppercase font-black tracking-wider mb-2 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`}>Festivals This Month</p>
                  <ul className="space-y-1.5">
                    {currentMonthFestivals.map(([key, name]) => {
                      const day = key.split('-')[1];
                      return (
                        <li key={key} className={`text-[11px] flex items-start gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 bg-amber-500"></span>
                          <span><span className="font-bold">{day} {monthNames[month]}</span> - {name}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                <div className={`mt-3 pt-3 border-t text-[10px] flex items-center justify-center gap-1.5 font-medium ${isDark ? 'border-[#1a4a40]/50 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                  No events or festivals this month
                </div>
              )}

              {/* Go to Today Button - Bottom Placed */}
              <div className={`mt-4 pt-3 border-t flex justify-center ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-200'}`}>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setViewDate(new Date()); 
                    setInputYear(new Date().getFullYear()); 
                  }} 
                  className={`w-full py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm
                    ${isDark ? 'bg-[#cddfa0] text-[#0a1a17] hover:bg-[#b8cc80]' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20'}`}
                >
                  Go to Today
                </button>
              </div>
            </div>
          )}
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
              <div className="max-h-64 overflow-y-auto custom-nav-scroll">
                {isLoadingNotifications ? (
                  <p className="px-4 py-3 text-sm text-gray-500 text-center">Loading notifications...</p>
                ) : notifications.length > 0 ? (
                  notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      onClick={() => handleNotificationClick(notif.id)}
                      className={`block px-4 py-3 border-b cursor-pointer transition-colors ${isDark ? 'border-[#1a4a40]/30 hover:bg-[#133c34]/50' : 'border-gray-50 hover:bg-gray-50'} ${notif.unread ? (isDark ? 'bg-[#133c34]/20' : 'bg-blue-50/50') : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <p className={`text-sm ${notif.unread ? (isDark ? 'text-white font-semibold' : 'text-gray-800 font-semibold') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>{notif.text}</p>
                        <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-300 ${expandedNotifId === notif.id ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      
                      {/* Expanded Content Section (FAQ Style) */}
                      <AnimatePresence>
                        {expandedNotifId === notif.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 8 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <p className={`text-xs p-2.5 rounded-lg leading-relaxed ${isDark ? 'bg-[#091a16] text-gray-300 border border-[#1a4a40]/50' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                              {notif.details || "No additional details available for this notification."}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <p className="text-xs text-gray-500 mt-1.5">{notif.time}</p>
                    </div>
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