"use client";

import { useState } from 'react';
import { Menu } from 'lucide-react'; 
import Sidebar from '../../src/components/dashboard/admin/Sidebar';
import Topbar from '../../src/components/dashboard/admin/Topbar';
import Analytics from '../../src/components/dashboard/admin/AnalyticsRelated/Analytics';
import { useTheme } from '../../src/components/ThemeProvider';

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`min-h-screen flex overflow-hidden ${isDark ? 'bg-[#151521] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
    
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isCollapsed}          
        setIsCollapsed={setIsCollapsed}     
      />

      
      <div 
        className={`relative flex flex-col min-h-screen transition-all duration-500 ease-in-out w-full ml-0
          ${isCollapsed ? 'lg:ml-[90px] lg:w-[calc(100%-90px)]' : 'lg:ml-[260px] lg:w-[calc(100%-260px)]'}
        `}
      >
        
     
        <header className={`sticky top-0 z-[80] flex items-center px-4 py-2 border-b backdrop-blur-md ${isDark ? 'bg-[#151521]/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className={`lg:hidden p-2 rounded-xl border mr-3 transition-all ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-100'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 w-full">
            <Topbar />
          </div>
        </header>

       
        <main className="flex-1 w-full max-w-full overflow-y-auto">
          <Analytics />
        </main>
      </div>
      
    </div>
  );
}