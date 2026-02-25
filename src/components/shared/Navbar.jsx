"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { HiMenuAlt3, HiX } from "react-icons/hi"; 

const manrope = Manrope({ 
  subsets: ["latin"], 
  weight: ["400", "500", "600", "700", "800"] 
});

const Navbar = () => {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // User state
  const [user, setUser] = useState(null); 

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

    if (user?.role === "seller") {
      return [
        commonHome,
        { name: "Dashboard", path: "/dashboard" },
        { name: "Add Property", path: "/add-property" },
        { name: "My Listings", path: "/my-listings" },
      ];
    } else if (user?.role === "user") {
      return [
        commonHome,
        { name: "Explore", path: "/properties" },
        { name: "Wishlist", path: "/wishlist" },
        { name: "My Bookings", path: "/bookings" },
      ];
    }
    
    // Default features if not logged in
    return [
      commonHome,
      { name: "Features", path: "/features" },
      { name: "Demo Preview", path: "/demo" },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${manrope.className}
      ${visible ? "translate-y-0" : "-translate-y-full"} 
      ${scrolled ? "bg-[#0f2e28]/95 backdrop-blur-md py-3 shadow-md" : "bg-transparent py-6"}`}
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

        {/* Desktop Menu (Dynamic) */}
        <ul className="hidden lg:flex gap-10 text-white font-bold text-[17px] tracking-wide items-center">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link href={item.path} className="hover:text-[#cddfa0] transition duration-300">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-5">
          {!user ? (
            <>
              <Link href="/login" className="text-white font-bold text-[16px] hover:text-[#cddfa0] transition duration-300">Login</Link>
              <Link href="/signup" className="bg-[#cddfa0] text-[#0f2e28] px-7 py-2.5 rounded-md font-bold text-[16px] hover:bg-[#b8cc89] transition shadow-lg">Signup</Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <div className="text-right border-r border-white/10 pr-4">
                  <p className="text-white font-bold text-sm leading-none">Dashboard</p>
                  <p className="text-[#cddfa0] text-[10px] uppercase font-mono mt-1 tracking-tighter">{user.role} Access</p>
               </div>
               <button 
                  onClick={() => setUser(null)}
                  className="bg-red-500/10 text-red-400 border border-red-500/30 px-4 py-1.5 rounded text-xs font-bold hover:bg-red-500 hover:text-white transition duration-300"
               >
                  Logout
               </button>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className={`lg:hidden text-white text-3xl relative z-[110] transition-opacity duration-300 ${isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          onClick={() => setIsMenuOpen(true)}
        >
          <HiMenuAlt3 />
        </button>
      </div>

      {/* Glass Design Mobile Sidebar (Dynamic) */}
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-[#0f2e28]/60 backdrop-blur-[25px] border-l border-white/20 z-[105] transform transition-transform duration-500 ease-in-out lg:hidden
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="flex flex-col h-full p-10 justify-center relative">
          <button 
            className="absolute top-8 right-8 text-4xl text-[#cddfa0] hover:rotate-90 transition-transform duration-300"
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
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#cddfa0] text-center font-bold text-xl py-3 border border-[#cddfa0]/30 rounded-xl">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="bg-[#cddfa0] text-[#0f2e28] text-center font-black text-xl py-4 rounded-xl shadow-lg">
                  Signup
                </Link>
              </>
            ) : (
              <button 
                onClick={() => {setUser(null); setIsMenuOpen(false);}}
                className="bg-red-500/20 text-red-500 border border-red-500/40 font-black text-xl py-4 rounded-xl"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[4px] lg:hidden z-[102]" onClick={() => setIsMenuOpen(false)}></div>
      )}
    </nav>
  );
};

export default Navbar;