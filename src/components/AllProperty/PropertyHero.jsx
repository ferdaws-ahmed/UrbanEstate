"use client";

import { useState } from "react";

export default function PropertyHero({ onSearch }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",  "Apartment", "Villa", "Office Space"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    // যদি "All" হয় তবে খালি স্ট্রিং পাঠানো যেতে পারে সব দেখানোর জন্য
    onSearch(cat === "All" ? "" : cat);
  };

  return (
    <div className="relative py-20 overflow-hidden">
      {/* BACKGROUNDS (Your existing logic) */}
      <div className="absolute inset-0 bg-white dark:hidden" />
      <div className="absolute inset-0 hidden dark:block bg-[var(--ue-secondary)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent dark:from-black/40" />

      <div className="relative max-w-6xl mx-auto px-4 text-center">
        {/* TITLE & SUBTEXT */}
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-[var(--ue-foreground)] dark:text-white tracking-tighter">
          Find Your <span className="text-[#cddfa0] italic font-light">Dream Property</span>
        </h1>
        <p className="mb-10 text-lg text-gray-600 dark:text-white/60 font-medium uppercase tracking-widest text-[10px]">
          Discover premium listings tailored just for you
        </p>

        {/* SEARCH BOX */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-center gap-3 bg-white dark:bg-[#0f2e28]/60 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl max-w-3xl mx-auto"
        >
          <input
            type="text"
            placeholder="Search by title, location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 w-full px-6 py-3 bg-transparent outline-none text-[#cddfa0] placeholder:text-gray-400 font-medium"
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all w-full md:w-auto bg-[#cddfa0] text-[#0f2e28] hover:bg-white shadow-lg"
          >
            Search
          </button>
        </form>

        {/* UPDATED QUICK TAGS */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryClick(item)}
              className={`
                px-5 py-2 text-[10px] font-bold rounded-full transition-all uppercase tracking-widest border
                ${activeCategory === item 
                  ? "bg-[#cddfa0] text-[#0f2e28] border-[#cddfa0] shadow-[0_0_15px_rgba(205,223,160,0.3)]" 
                  : "bg-white/5 text-gray-500 border-white/10 hover:border-[#cddfa0]/50 hover:text-[#cddfa0]"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}