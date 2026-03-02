"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Manrope } from "next/font/google";
import { HiMenuAlt3, HiX, HiChevronDown, HiLogout, HiUser, HiCog, HiMoon, HiSun } from "react-icons/hi"; 
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes"; // Added for Theme

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // To avoid hydration mismatch
  const dropdownRef = useRef(null);

  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const user = session?.user || null;

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const getNavItems = () => {
    const commonHome = { name: "Home", path: "/" };
    const allProperty = { name: "All Property", path: "/all-properties" };

    if (user?.role === "seller") {
      return [
        commonHome,
        { name: "Add Property", path: "/sellproperty" },
        allProperty,
      ];
    } 
    return [commonHome, allProperty];
  };

  const navItems = getNavItems();

  if (!mounted) return null; // Prevent UI glitch on load

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${manrope.className}
      ${visible ? "translate-y-0" : "-translate-y-full"} 
      ${scrolled 
        ? "bg-[#0f2e28]/95 dark:bg-black/90 backdrop-blur-md py-3 shadow-md" 
        : "bg-transparent py-6"}`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group cursor-pointer relative z-[110]">
          <svg width="60" height="60" viewBox="0 0 200 200" fill="none" className="h-12 w-auto">
            <g transform="translate(0, 10)"> 
              <path d="M95 50 L135 40 L135 140 L95 140 Z" fill="#94a894" /> 
              <path d="M40 130 L100 80 L145 130 H190" stroke="#cddfa0" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="140" y="80" width="35" height="60" fill="#cddfa0" opacity="0.9" />
            </g>
          </svg>
          <span className="text-[26px] font-extrabold text-white tracking-tight drop-shadow-md">
            Urban<span className="text-[#cddfa0]">E</span>state
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex gap-10 text-white font-bold text-[17px] tracking-wide items-center">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.path} className="hover:text-[#cddfa0] transition duration-300">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Theme Toggle Button (Desktop) */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white/10 text-[#cddfa0] hover:bg-white/20 transition-all border border-white/10"
          >
            {theme === "dark" ? <HiSun size={20} /> : <HiMoon size={20} />}
          </button>
        </div>

        {/* Desktop Buttons / Unique Dropdown */}
        <div className="hidden lg:flex items-center gap-5">
          {!user ? (
            <>
              <Link href="/register" className="text-white font-bold text-[16px] hover:text-[#cddfa0] transition duration-300">
                Get Started
              </Link>
              <Link href="/login" className="bg-[#cddfa0] text-[#0f2e28] px-7 py-2.5 rounded-md font-bold text-[16px] hover:bg-[#b8cc89] transition shadow-lg">
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 p-1.5 pr-4 rounded-full transition-all duration-300"
              >
                {user.image ? (
                  <img src={user.image} alt="Profile" className="w-9 h-9 rounded-full border-2 border-[#cddfa0]" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#cddfa0] flex items-center justify-center text-[#0f2e28] font-bold">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div className="text-left hidden xl:block">
                  <p className="text-white text-xs font-bold leading-tight">{user.name || "User"}</p>
                  <p className="text-[#cddfa0] text-[10px] uppercase tracking-tighter">{user.role}</p>
                </div>
                <HiChevronDown className={`text-white transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[#0f2e28] dark:bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-white/5 bg-white/5 mb-2">
                    <p className="text-white text-sm font-bold truncate">{user.email}</p>
                    <p className="text-[#cddfa0] text-[10px] font-mono mt-0.5 capitalize">{user.role} </p>
                  </div>
                  
                  <Link 
                    href={`/dashboard/${user?.role}/profile`} 
                    onClick={() => setIsDropdownOpen(false)} 
                    className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-[#cddfa0]/10 transition-colors"
                  >
                    <HiUser className="text-[#cddfa0]" /> 
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>
                  
                  <Link 
                    href={`/dashboard/${user?.role}`} 
                    onClick={() => setIsDropdownOpen(false)} 
                    className="flex items-center gap-3 px-4 py-2.5 text-white/80 hover:text-white hover:bg-[#cddfa0]/10 transition-colors"
                  >
                    <HiCog className="text-[#cddfa0]" /> 
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>

                  <div className="mt-2 pt-2 border-t border-white/5 px-2">
                    <button 
                      onClick={() => signOut()}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-sm font-bold"
                    >
                      <HiLogout /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle & Theme Button */}
        <div className="flex items-center gap-4 lg:hidden relative z-[110]">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-white/10 text-[#cddfa0]"
          >
            {theme === "dark" ? <HiSun size={24} /> : <HiMoon size={24} />}
          </button>
          <button 
            className={`text-white text-3xl transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            onClick={() => setIsMenuOpen(true)}
          >
            <HiMenuAlt3 />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-[#0f2e28]/95 dark:bg-black/95 backdrop-blur-[25px] border-l border-white/20 z-[105] transform transition-transform duration-500 ease-in-out lg:hidden
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="flex flex-col h-full p-10 justify-center relative">
          <button 
            className="absolute top-8 right-8 text-4xl text-[#cddfa0]"
            onClick={() => setIsMenuOpen(false)}
          >
             <HiX />
          </button>

          <ul className="flex flex-col gap-8 text-white font-black text-2xl tracking-widest uppercase">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link href={item.path} onClick={() => setIsMenuOpen(false)} className="hover:text-[#cddfa0] transition">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 mt-12 pt-10 border-t border-white/10">
            {!user ? (
              <>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="text-[#cddfa0] text-center font-bold text-xl py-3 border border-[#cddfa0]/30 rounded-xl">
                  Get Started
                </Link>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="bg-[#cddfa0] text-[#0f2e28] text-center font-black text-xl py-4 rounded-xl shadow-lg">
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-[#cddfa0] text-center font-bold text-xl py-3 border border-[#cddfa0]/30 rounded-xl">
                  My Profile
                </Link>
                <button 
                  onClick={() => {signOut(); setIsMenuOpen(false);}}
                  className="bg-red-500/20 text-red-500 border border-red-500/40 font-black text-xl py-4 rounded-xl"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] lg:hidden z-[102]" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;