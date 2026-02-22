'use client';

import { useState } from 'react';

/**
 * BasicInfo Component
 * Handles primary property data: Title, Price (USD), Category, Status, and Description.
 * Supports Dark/Light mode and prevents negative pricing.
 */
const BasicInfo = () => {
  // State to manage the price input to ensure global currency standards
  const [price, setPrice] = useState("");

  /**
   * Logic to prevent negative numbers and invalid characters (e, +, -)
   * This is crucial for a financial/real estate marketplace.
   */
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0 || value === "") {
      setPrice(value);
    }
  };

  const preventInvalidChars = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Reusable Tailwind classes for consistent UI across light/dark themes
  const inputStyle = `
    w-full px-4 py-3 rounded-xl 
    border border-slate-200 dark:border-slate-700 
    bg-white dark:bg-slate-900 
    text-slate-900 dark:text-slate-100 
    placeholder-slate-400 dark:placeholder-slate-500
    focus:ring-2 focus:ring-blue-500 focus:border-transparent 
    outline-none transition-all duration-200 shadow-sm
  `;

  const labelStyle = "block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1";

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* SECTION HEADER: Essential for user guidance */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Basic Information
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Provide the essential details about your property listing.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* PROPERTY TITLE: High-level naming of the listing */}
        <div>
          <label className={labelStyle}>Property Title</label>
          <input 
            type="text" 
            placeholder="e.g. Modern Penthouse with Central Park View" 
            className={inputStyle}
          />
        </div>

        {/* FINANCIAL & CATEGORY ROW: Responsive grid for Desktop/Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* PRICE INPUT: Global Market Standard in USD */}
          <div>
            <label className={labelStyle}>Price (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-semibold">
                $
              </span>
              <input 
                type="number" 
                min="0"
                value={price}
                onChange={handlePriceChange}
                onKeyDown={preventInvalidChars}
                placeholder="0.00" 
                className={`${inputStyle} pl-8`}
              />
            </div>
            {/* Logic hint for other developers */}
            <p className="text-[10px] text-slate-400 mt-1 ml-1">Negative values are blocked.</p>
          </div>

          {/* PROPERTY CATEGORY: Used for broad filtering */}
          <div>
            <label className={labelStyle}>Property Category</label>
            <select className={inputStyle}>
              <option value="">Select Category</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land/Plot</option>
            </select>
          </div>
        </div>

        {/* LISTING STATUS & TYPE: Using Peer-Checked logic for a modern UI toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelStyle}>Listing Status</label>
            <div className="flex gap-4">
              {["For Sale", "For Rent"].map((status) => (
                <label key={status} className="flex-1">
                  <input type="radio" name="status" className="hidden peer" />
                  <div className="text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 peer-checked:border-blue-500 peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-blue-600 dark:peer-checked:text-blue-400 cursor-pointer transition-all font-medium text-slate-600 dark:text-slate-400">
                    {status}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelStyle}>Property Type</label>
            <select className={inputStyle}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="studio">Studio</option>
              <option value="office">Office Space</option>
            </select>
          </div>
        </div>

        {/* DESCRIPTION: Detailed text area for SEO and Buyer Information */}
        <div>
          <label className={labelStyle}>Detailed Description</label>
          <textarea 
            rows="5" 
            placeholder="Describe the unique features, surroundings, and why someone should buy/rent this property..." 
            className={`${inputStyle} resize-none`}
          ></textarea>
          <div className="flex justify-between mt-2">
            <span className="text-[10px] text-slate-400 italic">Clear descriptions attract more buyers.</span>
            <span className="text-xs text-slate-400">Min 200 characters</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfo;