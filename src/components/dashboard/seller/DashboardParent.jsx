"use client";

import { useState } from "react";
import SellerSidebar from "./layout/SellerSidebar";
import SellerTopbar from "./layout/SellerTopbar";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function DashboardParent({ children, title = "Dashboard" }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isDark } = useTheme();

  return (
    <div
      suppressHydrationWarning
      className={`flex min-h-screen w-full transition-all duration-300 ${isDark ? 'bg-[var(--background)]' : 'bg-gray-50'}`}
    >
      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div suppressHydrationWarning className="flex flex-1 flex-col min-w-0 md:pl-64 transition-all duration-300">
        <SellerTopbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main 
          suppressHydrationWarning 
          className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 lg:p-12 custom-scrollbar transition-all duration-300"
        >
          {children}
        </main>
      </div>
    </div>
  );
}

