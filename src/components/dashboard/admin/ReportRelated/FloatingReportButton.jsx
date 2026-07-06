"use client";

import { ShieldAlert } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useReports } from '@/src/context/ReportContext';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function FloatingReportButton() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const { unreadCount } = useReports();
  const [constraints, setConstraints] = useState(null);

  useEffect(() => {
    setConstraints({
      left: -window.innerWidth + 100,
      right: 0,
      top: -window.innerHeight + 100,
      bottom: 0,
    });
  }, []);

  // Only show for Admin role
  if (session?.user?.role !== 'admin') return null;

  return (
    <motion.div
      drag
      dragConstraints={constraints}
      whileDrag={{ scale: 1.1, cursor: "grabbing" }}
      className="fixed bottom-48 right-8 z-[10000]"
    >
      <Link 
        href="/dashboard/admin/reports"
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-110
          ${
            isDark 
              ? 'bg-gradient-to-tr from-red-500 to-red-700 text-white shadow-red-500/30' 
              : 'bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-red-500/40'
          }
          ${unreadCount > 0 ? 'animate-pulse' : ''}
        `}
      >
        <ShieldAlert size={24} fill="currentColor" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-red-600 text-[10px] font-bold shadow-lg">
            {unreadCount}
          </span>
        )}
      </Link>
    </motion.div>
  );
}

