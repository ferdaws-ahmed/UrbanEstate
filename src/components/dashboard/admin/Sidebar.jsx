"use client";
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../ThemeProvider'; 
import {
  LayoutDashboard, Home, Users, UserCircle, BarChart3, 
  Settings, LifeBuoy, HelpCircle, X
} from 'lucide-react'; 

const bgImages = {
  default: "https://i.ibb.co/gZz1V6Ck/1.png",
  property: "https://i.ibb.co/RnDgvKJ/2.png",
  clients: "https://i.ibb.co/Y7S2Pyfp/3.png"
};

export default function Sidebar({ isOpen, setIsOpen }) { 
  const pathname = usePathname();
  const themeContext = useTheme(); 
  
  // সরাসরি themeContext.isDark ব্যবহার করা হলো
  const isDark = themeContext ? themeContext.isDark : false;

  const menuItems = [
    // Dashboard er path thik kora holo (Absolute Path)
    { name: 'Dashboard', path: '/dashboard/admin', icon: <LayoutDashboard size={22} /> },
    
    // Baki path gulo-teo exact '/' diye shuru kora holo
    { name: 'Properties', path: '/all-properties', icon: <Home size={22} /> },
    
    // Apnar main error eikhan-ei chilo (admin/agents -> /dashboard/admin/agents)
    { name: 'Agents', path: '/dashboard/admin/agents', icon: <Users size={22} /> },
    { name: 'Clients', path: '/dashboard/admin/clients', icon: <UserCircle size={22} /> },
    { name: 'Analytics', path: '/dashboard/admin/analytics', icon: <BarChart3 size={22} /> },
    
    { name: 'Settings', path: '/settings', icon: <Settings size={22} /> },
    { name: 'Support', path: '/support', icon: <LifeBuoy size={22} /> },
    { name: 'Help', path: '/help', icon: <HelpCircle size={22} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[85] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        className={`fixed top-0 left-0 min-h-screen z-[90] transition-all duration-300 ease-in-out border-r
        ${isDark 
          ? 'bg-[#0b1f1a] border-[#1a4a40]/60 shadow-[10px_0_30px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-gray-200 shadow-[10px_0_30px_rgba(0,0,0,0.05)]'
        }
        w-[260px] 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* কলাপস বাটন (Lock/Unlock) পুরোপুরি বাদ দেওয়া হয়েছে */}

        {/* ক্লোজ বাটন (Mobile Only) */}
        <button 
          onClick={() => setIsOpen(false)}
          className={`lg:hidden absolute top-5 right-4 p-2 rounded-xl transition-colors ${isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600'}`}
        >
          <X size={20} />
        </button>

        {/* ব্যাকগ্রাউন্ড ইমেজ লেয়ার (আপনার ৩টি ইমেজই এখানে কাজ করবে) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Object.entries(bgImages).map(([key, url]) => {
            const isVisible = (key === 'property' && pathname === '/property') || 
                              (key === 'clients' && pathname === '/clients') ||
                              (key === 'default' && pathname !== '/property' && pathname !== '/clients');
            return (
              <div 
                key={key}
                className={`absolute inset-0 transition-opacity duration-1000 ${isVisible ? (isDark ? 'opacity-60' : 'opacity-50') : 'opacity-0'}`}
                style={{ 
                  backgroundImage: `url('${url}')`, 
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center' 
                }}
              />
            );
          })}
          <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#0b1f1a]/80' : 'bg-white/75'}`} />
        </div>

        {/* মেইন কনটেন্ট */}
        <div className="relative z-10 h-full flex flex-col">
          {/* লোগো সেকশন - সবসময় বড় থাকবে */}
          <div className="mb-8 mt-6 px-7">
            <Link href="/" className="flex items-center gap-3">
              <svg width="38" height="38" viewBox="0 0 200 200">
                <g transform="translate(0, 10)"> 
                  <path d="M95 50 L135 40 L135 140 L95 140 Z" fill={isDark ? "#94a894" : "#4b5563"} /> 
                  <path d="M40 130 L100 80 L145 130 H190" stroke={isDark ? "#cddfa0" : "#059669"} strokeWidth="14" strokeLinecap="round" />
                </g>
              </svg>
              <span className={`text-xl font-black italic ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Urban<span className={isDark ? "text-[#cddfa0]" : "text-emerald-600"}>E</span>state
              </span>
            </Link>
          </div>

          {/* নেভিগেশন লিাঙ্কস */}
          <nav className="flex-1 overflow-y-auto px-5 no-scrollbar">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path; 
                return (
                  <li key={index}>
                    <Link 
                      href={item.path} 
                      onClick={() => { if(window.innerWidth < 1024) setIsOpen(false); }}
                      className={`flex items-center gap-4 py-3 px-4 rounded-xl transition-all duration-200 
                        ${isActive 
                          ? (isDark ? 'bg-[#133c34] text-[#cddfa0]' : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100') 
                          : (isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100')}
                      `}
                    >
                      <span className={isActive ? (isDark ? 'text-[#cddfa0]' : 'text-emerald-600') : ''}>{item.icon}</span>
                      <span className="text-[15px] font-medium whitespace-nowrap">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}