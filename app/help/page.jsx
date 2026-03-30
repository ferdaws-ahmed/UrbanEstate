

"use client";

import { useState } from 'react';
import { Menu } from 'lucide-react'; 
import Sidebar from '../../src/components/dashboard/admin/Sidebar';
import Topbar from '../../src/components/dashboard/admin/Topbar';
import HelpCenter from '../../src/components/dashboard/admin/Helppage/Helppage'; 
import { useTheme } from '../../src/components/ThemeProvider';

export default function HelpPage() {
  const themeContext = useTheme() || {};
  const isDark = themeContext.isDark || false;
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen flex overflow-hidden transition-colors duration-300 ${isDark ? 'bg-[#05110e] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isCollapsed}           
        setIsCollapsed={setIsCollapsed}     
      />

      <div 
        className={`relative flex flex-col min-h-screen transition-[margin,width] duration-300 ease-in-out w-full will-change-[margin,width]
          ${isCollapsed ? 'lg:ml-[90px] lg:w-[calc(100%-90px)]' : 'lg:ml-[260px] lg:w-[calc(100%-260px)]'}
        `}
      >
        
        <header className={`sticky top-0 z-[80] flex items-center px-4 py-2 border-b backdrop-blur-md transition-colors duration-300 ${isDark ? 'bg-[#091a16]/80 border-[#1a4a40]' : 'bg-white/80 border-gray-200'}`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl border mr-3 transition-all ${isDark ? 'border-[#1a4a40] hover:bg-[#133c34]' : 'border-gray-200 hover:bg-gray-100'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 w-full">
            <Topbar />
          </div>
        </header>

        <main className="flex-1 w-full max-w-full overflow-y-auto">

          <HelpCenter />
        </main>

      </div>
    </div>
  );
}