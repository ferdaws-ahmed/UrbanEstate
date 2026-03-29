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
      className="flex min-h-screen w-full transition-all duration-300"
      style={{ 
        backgroundColor: 'var(--ue-background)', 
        color: 'var(--ue-text-main)' 
      }}
    >
      <SellerSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div suppressHydrationWarning className="flex flex-1 flex-col min-w-0 md:pl-64 transition-all duration-300">
        <SellerTopbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
        <main 
          suppressHydrationWarning 
          className="flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-10 lg:p-12 custom-scrollbar transition-all duration-300"
          style={{ backgroundColor: 'var(--ue-background)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
