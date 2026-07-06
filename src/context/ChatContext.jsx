"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const { data: session } = useSession();
  const pathname = usePathname();

  const fetchChatCount = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch('/api/chat/unread-count');
      const data = await res.json();
      setUnreadChatCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching chat unread count:", error);
    }
  }, [session]);

  useEffect(() => {
    fetchChatCount();
    // Poll for new messages every 3 seconds for real-time responsiveness
    const interval = setInterval(fetchChatCount, 3000);
    return () => clearInterval(interval);
  }, [fetchChatCount]);

  useEffect(() => {
    // If we are on the chat page, we might want to refresh the count
    // but the actual marking as read happens inside the Chat component
    if (pathname?.includes('/dashboard/admin/chat') || 
        pathname?.includes('/dashboard/user/chat') || 
        pathname?.includes('/dashboard/seller/chat')) {
      fetchChatCount();
    }
  }, [pathname, fetchChatCount]);

  return (
    <ChatContext.Provider value={{ unreadChatCount, fetchChatCount }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);

