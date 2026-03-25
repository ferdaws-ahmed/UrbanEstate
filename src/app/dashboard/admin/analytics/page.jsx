"use client";

import { useState } from 'react';
import { Menu } from 'lucide-react'; // মেনু আইকন ইমপোর্ট করা হলো
import Sidebar from '../../../../components/dashboard/admin/Sidebar';
import Topbar from '../../../../components/dashboard/admin/Topbar';
import Analytics from '../../../../components/dashboard/admin/AnalyticsRelated/Analytics';
import { useTheme } from '../../../../components/ThemeProvider';

export default function AnalyticsPage() {
  const { isDark } = useTheme();
  // সাইডবার ওপেন/ক্লোজ করার জন্য স্টেট
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen flex overflow-hidden ${isDark ? 'bg-[#151521] text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* ১. সাইডবার - স্টেটগুলো পাস করা হলো */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* ২. মেইন কন্টেন্ট এরিয়া - মোবাইলে ml-0 এবং ডেস্কটপে ml-[260px] */}
      <div className="relative flex flex-col min-h-screen transition-all duration-300 w-full ml-0 lg:ml-[260px] lg:w-[calc(100%-260px)]">
        
        {/* ৩. মোবাইল হেডার এবং টপবার */}
        <header className={`sticky top-0 z-[80] flex items-center px-4 py-2 border-b backdrop-blur-md ${isDark ? 'bg-[#151521]/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
          {/* মোবাইল মেনু বাটন */}
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

        {/* ৪. মেইন কন্টেন্ট */}
        <main className="flex-1 w-full max-w-full overflow-y-auto">
          <Analytics />
        </main>
      </div>
      
    </div>
  );
}