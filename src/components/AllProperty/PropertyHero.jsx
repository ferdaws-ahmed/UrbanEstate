"use client";

import { useState } from "react";
import { useTheme } from "../Theme/ThemeContext";

export default function PropertyHero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { isDark } = useTheme();

  // ডাটাবেজে যেভাবে সেভ হচ্ছে, ঠিক সেই নামগুলোই এখানে রাখা ভালো
  const categories = [
    "All", "Apartment", "Villa", "House", "Office", "Studio", "Land"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query); // ফর্ম সাবমিট করলেও কাজ করবে
  };

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch(val); // রিয়েল-টাইম সার্চের জন্য
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    onSearch(cat === "All" ? "" : cat);
  };

  return (
    <div className="relative py-20 overflow-hidden" style={{ backgroundColor: "var(--background)" }}>
      {/* BACKGROUNDS */}
      <div className="absolute inset-0" style={{ backgroundColor: "var(--background)" }} />
      
      {/* GRADIENT OVERLAY: Only for Dark Mode */}
      <div className="absolute inset-0" style={{ display: isDark ? "block" : "none", background: isDark ? "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)" : "none" }} />

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        {/* TITLE & SUBTEXT */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter" style={{ color: "var(--foreground)" }}>
          Find Your <span style={{ color: "var(--accent)" }} className="italic font-light">Dream Property</span>
        </h1>
        <p className="mb-10 text-lg font-medium uppercase tracking-widest text-[10px]" style={{ color: "var(--muted-foreground)" }}>
          Discover premium listings tailored just for you
        </p>

        {/* SEARCH BOX */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-3 rounded-2xl p-2 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto border"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <input
            type="text"
            placeholder="Search by title, location, district..."
            value={query}
            onChange={handleChange}
            className="flex-1 w-full px-6 py-3 bg-transparent outline-none font-medium"
            style={{
              color: "var(--foreground)",
              "::placeholder": { color: "var(--muted-foreground)" }
            }}
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all w-full md:w-auto shadow-lg"
            style={{
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--secondary)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--primary)"}
          >
            Search
          </button>
        </form>

        {/* QUICK TAGS */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className="px-5 py-2 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest border"
              style={{
                backgroundColor: activeCategory === item ? "var(--primary)" : isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
                color: activeCategory === item ? "var(--primary-foreground)" : "var(--muted-foreground)",
                borderColor: activeCategory === item ? "var(--primary)" : "var(--border)",
                boxShadow: activeCategory === item ? "0 0 15px rgba(205, 223, 160, 0.3)" : "none"
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== item) {
                  e.currentTarget.style.borderColor = "rgba(205,223,160,0.5)";
                  e.currentTarget.style.color = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== item) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--muted-foreground)";
                }
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
