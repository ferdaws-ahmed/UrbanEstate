"use client";

import { useState } from 'react';
import Sidebar from "@/src/components/dashboard/admin/Sidebar";
import Topbar from "@/src/components/dashboard/admin/Topbar";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#0b1f1a]' : 'bg-gray-50'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isSidebarCollapsed} 
        setIsCollapsed={setIsSidebarCollapsed} 
      />
      <main 
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'lg:ml-[90px]' : 'lg:ml-[260px]'
        }`}>
        <Topbar 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
        />
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
