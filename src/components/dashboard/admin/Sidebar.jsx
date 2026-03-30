"use client";
import { motion, AnimatePresence, useTime, useTransform } from 'framer-motion';
import React, { useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '../../ThemeProvider'; 
import confetti from 'canvas-confetti';
import {
  LayoutDashboard, Home, Users, UserCircle, BarChart3, 
  Settings, LifeBuoy, HelpCircle, X, Lock, Unlock
} from 'lucide-react'; 

const bgImages = {
  default: "https://i.ibb.co/7dvk3zt8/11.png", 
  property: "https://i.ibb.co/LDpNVNHX/12.png",
  clients: "https://i.ibb.co/QFsNKB04/14.png",
  agents: "https://i.ibb.co/VY4zHwq7/13.png",
  analytics: "https://i.ibb.co/Y7S2Pyfp/3.png", 
  settings: "https://i.ibb.co/RnDgvKJ/2.png", 
  support: "https://i.ibb.co/gZz1V6Ck/1.png", 
  help: "https://i.ibb.co/wFZQf8Gv/15.png"
};

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) { 
  const pathname = usePathname();
  const themeContext = useTheme(); 
  
  const isDark = themeContext ? themeContext.isDark : false;

  const menuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Properties', path: '/property', icon: <Home size={22} /> },
    { name: 'Agents', path: '/agents', icon: <Users size={22} /> },
    { name: 'Clients', path: '/clients', icon: <UserCircle size={22} /> },
    { name: 'Analytics', path: '/analytics', icon: <BarChart3 size={22} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={22} /> },
    { name: 'Support', path: '/support', icon: <LifeBuoy size={22} /> },
    { name: 'Help', path: '/help', icon: <HelpCircle size={22} /> },
  ];

  const time = useTime(); 
  const animationDuration = 150000; 
  
  const progress = useTransform(time, (t) => (t % animationDuration) / animationDuration);
  const wave = useTransform(progress, (p) => (p < 0.5 ? p * 2 : (1 - p) * 2)); 

  const yTop = useTransform(wave, (val) => `${val * 80}vh`);
  const yBottom = useTransform(wave, (val) => `${-val * 80}vh`);

  const handleLockToggle = useCallback((e) => {

    setIsCollapsed((prev) => !prev);

    setTimeout(() => {
      const flowerColors = ['#ff69b4', '#ffb6c1', '#ffd700', '#87ceeb', '#98fb98', '#dda0dd', '#ff4500', '#00ff7f', '#ba55d3', '#ffffff'];
      
      const baseConfig = {
        spread: 120,
        startVelocity: 85,
        colors: flowerColors,
        zIndex: 9999,
        disableForReducedMotion: true,
        useWorker: true 
      };

    
      requestAnimationFrame(() => {
        confetti({
          ...baseConfig,
          particleCount: 250, 
          angle: 60, 
          origin: { x: -0.1, y: 1 }, 
        });
      });

     
      setTimeout(() => {
        requestAnimationFrame(() => {
          confetti({
            ...baseConfig,
            particleCount: 250, 
            angle: 120, 
            origin: { x: 1.1, y: 1 }, 
          });
        });
      }, 50);
      

      setTimeout(() => {
        requestAnimationFrame(() => {
          confetti({
            particleCount: 150, 
            angle: 90,
            spread: 100,
            startVelocity: 60,
            origin: { x: 0.5, y: 1.1 },
            colors: flowerColors,
            zIndex: 9999,
            disableForReducedMotion: true,
            useWorker: true
          });
        });
      }, 100);

    }, 350); 
  }, [setIsCollapsed]); 

  return (
    <>
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
        className={`fixed top-0 left-0 min-h-screen z-[90] transition-[width] duration-300 ease-in-out border-r will-change-[width]
        ${isDark 
          ? 'bg-[#0b1f1a] border-[#1a4a40]/60 shadow-[10px_0_30px_rgba(0,0,0,0.5)]' 
          : 'bg-white border-gray-200 shadow-[10px_0_30px_rgba(0,0,0,0.05)]'
        }
        ${isCollapsed ? 'w-[90px]' : 'w-[260px]'} 
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <button 
          onClick={() => setIsOpen(false)}
          className={`lg:hidden absolute top-5 right-4 p-2 z-50 rounded-xl transition-colors ${isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-50 text-red-600'}`}
        >
          <X size={20} />
        </button>

        <motion.button
          style={{ y: yTop }} 
          onClick={handleLockToggle}
          className={`hidden lg:flex absolute top-10 right-0 translate-x-1/2 z-50 p-2.5 rounded-full shadow-xl border transition-colors duration-300
            ${isDark ? 'bg-[#133c34] border-[#1a4a40] text-[#cddfa0] hover:bg-[#1a4a40]' : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50'}
          `}
        >
          {isCollapsed ? <Unlock size={20} /> : <Lock size={20} />}
        </motion.button>

        <motion.button
          style={{ y: yBottom }} 
          onClick={handleLockToggle}
          className={`hidden lg:flex absolute bottom-12 right-0 translate-x-1/2 z-50 p-2.5 rounded-full shadow-xl border transition-colors duration-300
            ${isDark ? 'bg-[#133c34] border-[#1a4a40] text-[#cddfa0] hover:bg-[#1a4a40]' : 'bg-white border-emerald-200 text-emerald-600 hover:bg-emerald-50'}
          `}
        >
          {isCollapsed ? <Unlock size={20} /> : <Lock size={20} />}
        </motion.button>

        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {Object.entries(bgImages).map(([key, url]) => {
            const currentPathKey = pathname.replace('/', '');
            const activeKey = bgImages[currentPathKey] ? currentPathKey : 'default';
            const isVisible = key === activeKey;

            return (
              <div 
                key={key}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out will-change-[opacity] ${isVisible ? (isDark ? 'opacity-60' : 'opacity-100') : 'opacity-0'}`}
                style={{ 
                  backgroundImage: `url('${url}')`, 
                  backgroundSize: 'cover',
                  backgroundPosition: 'bottom center',
                  backgroundRepeat: 'no-repeat' 
                }}
              />
            );
          })}
          <div className={`absolute inset-0 transition-colors duration-500 ${isDark ? 'bg-[#0b1f1a]/80' : 'bg-gradient-to-b from-white/95 via-white/80 to-white/30'}`} />
        </div>

        <div className="relative z-10 h-full flex flex-col">
          <div className={`mb-8 mt-6 flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-7'}`}>
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <svg width="38" height="38" viewBox="0 0 200 200" className="flex-shrink-0">
                <g transform="translate(0, 10)"> 
                  <path d="M95 50 L135 40 L135 140 L95 140 Z" fill={isDark ? "#94a894" : "#4b5563"} /> 
                  <path d="M40 130 L100 80 L145 130 H190" stroke={isDark ? "#cddfa0" : "#059669"} strokeWidth="14" strokeLinecap="round" />
                </g>
              </svg>
              
              <span className={`text-xl font-black italic whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[150px] opacity-100'}`}>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Urban</span>
                <span className={isDark ? "text-[#cddfa0]" : "text-emerald-600"}>E</span>
                <span className={isDark ? 'text-white' : 'text-gray-900'}>state</span>
              </span>
            </Link>
          </div>

          <nav className="flex-1 px-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => {
                const isActive = pathname === item.path; 
                return (
                  <li key={index}>
                    <Link 
                      href={item.path} 
                      onClick={() => { if(window.innerWidth < 1024) setIsOpen(false); }}
                      className={`flex items-center py-3 rounded-xl transition-all duration-300 relative group
                        ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'}
                        ${isActive 
                          ? (isDark ? 'bg-[#133c34] text-[#cddfa0]' : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100') 
                          : (isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100')}
                      `}
                    >
                      <span className={`flex-shrink-0 transition-transform duration-300 ${isActive ? (isDark ? 'text-[#cddfa0]' : 'text-emerald-600') : ''} ${isCollapsed && isActive ? 'scale-125' : ''}`}>
                        {item.icon}
                      </span>
                      
                      <span className={`text-[15px] font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                        {item.name}
                      </span>

                      {isCollapsed && (
                        <div className={`absolute left-full ml-4 px-3 py-1.5 rounded-lg text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-xl z-50
                          ${isDark ? 'bg-[#133c34] text-[#cddfa0] border border-[#1a4a40]' : 'bg-emerald-600 text-white border border-emerald-500'}
                        `}>
                          {item.name}
                        </div>
                      )}
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