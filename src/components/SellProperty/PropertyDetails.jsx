'use client';

import { useState } from 'react';

/**
 * PropertyDetails Component
 * Captures specific structural data like Bedrooms, Bathrooms, Area, etc.
 * Includes validation to prevent negative values for physical dimensions.
 */
const PropertyDetails = () => {
  // State to manage numeric specifications for validation
  const [specs, setSpecs] = useState({
    beds: "",
    baths: "",
    size: "",
    year: ""
  });

  /**
   * Logic to block negative numbers and non-numeric characters like 'e', '+', '-'
   * This ensures data integrity across the marketplace.
   */
  const handleNumericInput = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  /**
   * Updates state only for positive values or empty strings
   * @param {string} field - The key of the spec object
   * @param {string} value - The input value
   */
  const handleChange = (field, value) => {
    if (value >= 0 || value === "") {
      setSpecs(prev => ({ ...prev, [field]: value }));
    }
  };

  // Standard styling synced with BasicInfo component
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
      
      {/* SECTION HEADER: Identifying structural specs */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
          Property Specifications
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Specify the structural details and dimensions of your property.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* BEDROOMS: Numeric input with min value of 0 */}
        <div>
          <label className={labelStyle}>Bedrooms</label>
          <input 
            type="number" 
            min="0"
            value={specs.beds}
            onKeyDown={handleNumericInput}
            onChange={(e) => handleChange("beds", e.target.value)}
            placeholder="e.g. 3" 
            className={inputStyle}
          />
        </div>

        {/* BATHROOMS: Physical count validation */}
        <div>
          <label className={labelStyle}>Bathrooms</label>
          <input 
            type="number" 
            min="0"
            value={specs.baths}
            onKeyDown={handleNumericInput}
            onChange={(e) => handleChange("baths", e.target.value)}
            placeholder="e.g. 2" 
            className={inputStyle}
          />
        </div>

        {/* PROPERTY SIZE: Global standard in Square Feet (sqft) */}
        <div>
          <label className={labelStyle}>Total Area (sqft)</label>
          <input 
            type="number" 
            min="0"
            value={specs.size}
            onKeyDown={handleNumericInput}
            onChange={(e) => handleChange("size", e.target.value)}
            placeholder="e.g. 1500" 
            className={inputStyle}
          />
        </div>

        {/* FLOOR LEVEL: Text input to allow "Ground", "Penthouse", or numbers */}
        <div>
          <label className={labelStyle}>Floor Level</label>
          <input 
            type="text" 
            placeholder="e.g. 4th Floor" 
            className={inputStyle}
          />
        </div>

        {/* FURNISHING STATUS: Critical for property valuation */}
        <div>
          <label className={labelStyle}>Furnishing</label>
          <select className={inputStyle}>
            <option value="unfurnished">Unfurnished</option>
            <option value="semi-furnished">Semi-Furnished</option>
            <option value="fully-furnished">Fully Furnished</option>
          </select>
        </div>

        {/* CONSTRUCTION YEAR: Helps determine property age */}
        <div>
          <label className={labelStyle}>Year Built</label>
          <input 
            type="number" 
            min="1800"
            max="2099"
            value={specs.year}
            onKeyDown={handleNumericInput}
            onChange={(e) => handleChange("year", e.target.value)}
            placeholder="e.g. 2022" 
            className={inputStyle}
          />
        </div>
      </div>

      {/* COMPONENT FOOTER: Metadata hint for users */}
      <div className="mt-8 flex items-center gap-2 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-blue-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
        </svg>
        <p className="text-xs text-blue-700 dark:text-blue-400">
          Providing accurate specifications increases your listing visibility by up to 40%.
        </p>
      </div>
    </div>
  );
};

export default PropertyDetails;