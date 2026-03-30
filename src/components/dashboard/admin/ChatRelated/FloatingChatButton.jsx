"use client";

import { MessageSquare } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { useChat } from '@/src/context/ChatContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function FloatingChatButton() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const { unreadChatCount } = useChat();
  const [constraints, setConstraints] = useState(null);

  useEffect(() => {
    setConstraints({
      left: -window.innerWidth + 100,
      right: 0,
      top: -window.innerHeight + 100,
      bottom: 0,
    });
  }, []);

  // Determine chat link based on role
  const getChatHref = () => {
    if (!session) return "/login";
    const role = session.user?.role;
    if (role === 'admin') return "/dashboard/admin/chat";
    if (role === 'seller') return "/dashboard/seller/chat";
    return "/dashboard/user/chat";
  };

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      className="fixed bottom-28 right-8 z-[10000]"
    >
      <Link 
        href={getChatHref()}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110
          ${
            isDark 
              ? 'bg-gradient-to-tr from-emerald-500 to-[#cddfa0] text-gray-900 shadow-emerald-500/30' 
              : 'bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-emerald-500/40'
          }`}
      >
        <MessageSquare size={24} fill="currentColor" />
        
        {unreadChatCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white ring-4 ring-white dark:ring-[#0b1f1a] animate-bounce">
            {unreadChatCount > 99 ? '99+' : unreadChatCount}
          </span>
        )}
      </Link>
    </motion.div>
  );
}