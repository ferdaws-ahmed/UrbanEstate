'use client';

import { useState } from 'react';

/**
 * SidebarFilters Component
 * Provides advanced filtering options: Price Range, Property Type, Beds/Baths.
 */
const SidebarFilters = ({ onFilterChange }) => {
  const [price, setPrice] = useState(500000);

  const filterHeading = "text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider";
  const checkboxLabel = "flex items-center gap-3 text-slate-600 dark:text-slate-400 cursor-pointer hover:text-blue-600 transition-colors";

  return (
    <aside className="w-full lg:w-80 space-y-8 p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl h-fit sticky top-24">
      
      {/* 1. PRICE RANGE FILTER */}
      <div>
        <h3 className={filterHeading}>Budget Range</h3>
        <div className="space-y-4">
          <input 
            type="range" 
            min="1000" 
            max="1000000" 
            step="5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-sm font-bold text-blue-600">
            <span>$1k</span>
            <span>Up to ${parseInt(price).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-700" />

      {/* 2. PROPERTY TYPE FILTER */}
      <div>
        <h3 className={filterHeading}>Property Type</h3>
        <div className="space-y-3">
          {['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse'].map((type) => (
            <label key={type} className={checkboxLabel}>
              <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-sm font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-slate-100 dark:border-slate-700" />

      {/* 3. BEDROOMS SELECTOR */}
      <div>
        <h3 className={filterHeading}>Bedrooms</h3>
        <div className="flex gap-2">
          {['1+', '2+', '3+', '4+'].map((num) => (
            <button 
              key={num}
              className="flex-1 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all dark:text-white"
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* 4. AMENITIES QUICK FILTER */}
      <div>
        <h3 className={filterHeading}>Must Have</h3>
        <div className="grid grid-cols-1 gap-3">
          {['Swimming Pool', 'Gym', 'Parking'].map((item) => (
            <label key={item} className={checkboxLabel}>
              <input type="checkbox" className="w-5 h-5 rounded-md border-slate-300 text-blue-600" />
              <span className="text-sm font-medium">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="pt-4 space-y-3">
        <button className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-transform active:scale-95">
          Apply Filters
        </button>
        <button className="w-full py-3 bg-transparent text-slate-400 hover:text-red-500 text-xs font-bold uppercase tracking-widest transition-colors">
          Reset All
        </button>
      </div>

    </aside>
  );
};

export default SidebarFilters;