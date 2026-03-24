"use client";

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../../src/components/dashboard/admin/Sidebar';
import Topbar from '../../src/components/dashboard/admin/Topbar';
import AgentManagement from '../../src/components/dashboard/admin/AgentRlated/AgentManagement';

export default function AgentsPage() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  

  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#151521] text-gray-900 dark:text-gray-100 flex overflow-hidden">

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
        
     
        <header className="sticky top-0 z-[80] flex items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#151521]/80 backdrop-blur-md">
  
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border border-gray-200 dark:border-gray-700 mr-3 transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 w-full">
            <Topbar />
          </div>
        </header>

   
        <main className="flex-1 w-full max-w-full overflow-y-auto">
          <AgentManagement />
        </main>
      </div>
      
    </div>
  );
}