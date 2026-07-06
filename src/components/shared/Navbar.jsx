"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react"; // Added useRef
import { Manrope } from "next/font/google";
import {
  HiMenuAlt3,
  HiX,
  HiChevronDown,
  HiLogout,
  HiUser,
  HiCog,
} from "react-icons/hi";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "../Theme/ThemeToggle";
import Translation, { TranslationInit } from "../shared/Translation";
import { useTheme } from "../Theme/ThemeContext";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const Navbar = () => {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown State
  const dropdownRef = useRef(null);

  const { data: session } = useSession();
  const user = session?.user || null;

  // Close dropdown when clicking outside
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
      const isVisible =
        prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      setScrolled(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Updated Navigation Items as per your requirement
  const getNavItems = () => {
    const commonHome = { name: "Home", path: "/" };
    const allProperty = { name: "All Property", path: "/all-properties" };
    const pricePredictor = { name: "Price Predictor", path : "/price-predictor"};
    const EMICalculator = { name : "EMI Calculator", path: "/emi-calculator"}
    const translation = <Translation></Translation>
  

    if (user?.role === "seller") {
      return [
        commonHome,
        allProperty,
        pricePredictor,
        
        { name: "Add Property", path: "/dashboard/seller/create-listing" },
        
      ];
    }
    else if(user?.role === "user"){
      return[
        commonHome,
        allProperty,
        pricePredictor,
        EMICalculator
        
      ]
    }

    return [commonHome, allProperty,];
  };

  const navItems = getNavItems();

  return (
    <>
    <TranslationInit />
     <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
        manrope.className
      }
      bg-[var(--card)]/95 backdrop-blur-md shadow-md py-4`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
        {/* Logo Section */}
        <Link
          href="/"
          className="flex items-center gap-3 group cursor-pointer relative z-[110]"
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 200 200"
            fill="none"
            className="h-12 w-auto"
          >
            <g transform="translate(0, 10)">
              <path d="M95 50 L135 40 L135 140 L95 140 Z" fill="#94a894" />
              <path
                d="M40 130 L100 80 L145 130 H190"
                stroke="#cddfa0"
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="140"
                y="80"
                width="35"
                height="60"
                fill="#cddfa0"
                opacity="0.9"
              />
            </g>
          </svg>
          <span className="text-[26px] font-extrabold text-[var(--foreground)] tracking-tight drop-shadow-md transition-colors duration-300">
            Urban<span className="text-[var(--accent)]">E</span>state
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-10 font-bold text-[17px] tracking-wide items-center transition-colors duration-300 text-[var(--foreground)]">
          {navItems.map((item, index) => (
            <li key={index}>
              <Link
                href={item.path}
                className="hover:text-[var(--accent)] transition duration-300"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Buttons / Unique Dropdown */}
        <div className="hidden lg:flex items-center gap-5">
          <Translation></Translation>
          <ThemeToggle size="md" />
          {!user ? (
            <>
              <Link
                href="/register"
                className="font-bold text-[16px] transition duration-300 text-[var(--foreground)] hover:text-[var(--accent)]"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-7 py-2.5 rounded-md font-bold text-[16px] transition shadow-lg bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90"
              >
                Login
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-300 border bg-[var(--foreground)]/10 hover:bg-[var(--foreground)]/20 border-[var(--border)]"
              >
                {user.image ? (
                  <img
                   referrerPolicy="no-referrer"
                    src={user.image}
                    alt="Profile"
                    className="w-9 h-9 rounded-full border-2 border-[var(--accent)]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold bg-[var(--primary)] text-[var(--primary-foreground)]">
                    {user.name ? user.name[0] : "U"}
                  </div>
                )}
                <div className="text-left hidden xl:block">
                  <p className="text-xs font-bold leading-tight text-[var(--foreground)]">
                    {user.name || "User"}
                  </p>
                  <p className="text-[10px] uppercase tracking-tighter text-[var(--accent)]">
                    {user.role}
                  </p>
                </div>
                <HiChevronDown
                  className={`transition-transform duration-300 text-[var(--foreground)] ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Unique Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                  <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--foreground)]/5 mb-2">
                    <p className="text-[var(--foreground)] text-sm font-bold truncate">
                      {user.email}
                    </p>
                    <p className="text-[var(--accent)] text-[10px] font-mono mt-0.5 capitalize">
                      {user.role}{" "}
                    </p>
                  </div>

                  <Link
                    href={`/dashboard/${user?.role}/profile`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    <HiUser className="text-[var(--accent)]" />
                    <span className="text-sm font-medium">My Profile</span>
                  </Link>

                  {/* Dynamic Dashboard Link */}
                  <Link
                    href={`/dashboard/${user?.role}`}
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-[var(--foreground)]/80 hover:text-[var(--foreground)] hover:bg-[var(--primary)]/10 transition-colors"
                  >
                    <HiCog className="text-[var(--accent)]" />
                    <span className="text-sm font-medium">Dashboard</span>
                  </Link>

                  <div className="mt-2 pt-2 border-t border-[var(--border)] px-2">
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

        {/* Mobile Toggle Button */}
        <button
          className={`lg:hidden text-[var(--foreground)] text-3xl relative z-[110] transition-opacity duration-300 ${
            isMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={() => setIsMenuOpen(true)}
        >
          <HiMenuAlt3 />
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen w-full sm:w-80 bg-[var(--card)]/95 backdrop-blur-[25px] border-l border-[var(--border)] z-[105] transform transition-transform duration-500 ease-in-out lg:hidden
        ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-10 justify-center relative">
          <button
            className="absolute top-8 right-8 text-4xl text-[var(--accent)]"
            onClick={() => setIsMenuOpen(false)}
          >
            <HiX />
          </button>

          <ul className="flex flex-col gap-8 text-[var(--foreground)] font-black text-2xl tracking-widest uppercase">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-[var(--accent)] transition"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 mt-12 pt-10 border-t border-[var(--border)]">
            <div className="flex justify-center mb-4">
              <ThemeToggle size="lg" />
            </div>
            {!user ? (
              <>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--accent)] text-center font-bold text-xl py-3 border border-[var(--accent)]/30 rounded-xl"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] text-center font-black text-xl py-4 rounded-xl shadow-lg"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[var(--accent)] text-center font-bold text-xl py-3 border border-[var(--accent)]/30 rounded-xl"
                >
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
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
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[4px] lg:hidden z-[102]"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </nav>
    </>
   
  );
};

export default Navbar;

