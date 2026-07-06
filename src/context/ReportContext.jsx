"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

const ReportContext = createContext();

export function ReportProvider({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reports/count');
      const data = await res.json();
      setUnreadCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching report count:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reports', { method: 'PATCH' });
      if (res.ok) {
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Error marking reports as read:", error);
    }
  }, []);

  useEffect(() => {
    fetchCount();
    // Poll for real-time updates every 10 seconds
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  useEffect(() => {
    // If we visit the reports page, mark all as read
    if (pathname === '/dashboard/admin/reports') {
      markAllAsRead();
    }
  }, [pathname, markAllAsRead]);

  return (
    <ReportContext.Provider value={{ unreadCount, fetchCount, markAllAsRead }}>
      {children}
    </ReportContext.Provider>
  );
}

export const useReports = () => useContext(ReportContext);

