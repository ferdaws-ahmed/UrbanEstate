"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = ({ className = "", size = "md" }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  const sizeClasses = {
    sm: "w-8 h-8 p-1.5",
    md: "w-10 h-10 p-2",
    lg: "w-12 h-12 p-2.5",
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        ${sizeClasses[size]}
        ${className}
        rounded-full 
        bg-white/10 
        hover:bg-white/20 
        border border-white/20 
        backdrop-blur-md
        transition-all 
        duration-300 
        flex 
        items-center 
        justify-center
        text-white
        hover:text-[#cddfa0]
        hover:scale-105
        hover:shadow-lg
        hover:shadow-[#cddfa0]/20
        focus:outline-none
        focus:ring-2
        focus:ring-[#cddfa0]/50
        relative
        overflow-hidden
      `}
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon (for light theme) */}
        <Sun
          size={iconSize[size]}
          className={`
            absolute 
            transition-all 
            duration-300 
            ease-in-out
            ${
              isDark
                ? "opacity-0 scale-75 rotate-45"
                : "opacity-100 scale-100 rotate-0"
            }
          `}
        />

        {/* Moon Icon (for dark theme) */}
        <Moon
          size={iconSize[size]}
          className={`
            absolute 
            transition-all 
            duration-300 
            ease-in-out
            ${
              isDark
                ? "opacity-100 scale-100 rotate-0"
                : "opacity-0 scale-75 -rotate-45"
            }
          `}
        />
      </div>

      {/* Background glow effect */}
      <div
        className={`
        absolute 
        inset-0 
        rounded-full 
        bg-[#cddfa0]/20 
        opacity-0 
        transition-opacity 
        duration-300
        ${isDark ? "opacity-100" : "opacity-0"}
      `}
      ></div>
    </button>
  );
};

export default ThemeToggle;
