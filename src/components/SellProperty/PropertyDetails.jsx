'use client';

import { useTheme } from "@/src/components/Theme/ThemeContext";

/**
 * PropertyDetails Component
 * Captures specific structural data like Bedrooms, Bathrooms, Area, etc.
 * Includes validation to prevent negative values for physical dimensions.
 */
const PropertyDetails = ({ formData, updateField }) => {
  const { isDark } = useTheme();

  const handleNumericInput = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const inputStyle = `
    w-full px-6 py-4.5 rounded-[1.25rem] 
    border-2 outline-none transition-all duration-300 shadow-sm
    ${isDark 
      ? 'border-[#1a4a40]/40 bg-[#061510] text-slate-100 placeholder-slate-500 focus:ring-teal-500/10 focus:border-teal-500/50 focus:bg-[#0b1f1a] hover:border-teal-800/60' 
      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:ring-teal-500/10 focus:border-teal-500/50 focus:bg-white hover:border-teal-300 shadow-inner'}
  `;

  const labelStyle = `block text-[10px] font-black mb-2.5 ml-2 uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-600'}`;

  return (
    <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group/section shadow-2xl ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]/30 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
      
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/section:scale-110 transition-transform duration-500 ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
            <svg className="w-6 h-6 text-teal-600 dark:text-[#cddfa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Property Specifications
          </h2>
        </div>
        <p className={`text-base ml-16 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Specify the structural details and dimensions to help buyers understand the scale.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        
        <div className="group/input">
          <label className={labelStyle}>Bedrooms</label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              value={formData.bedrooms}
              onKeyDown={handleNumericInput}
              onChange={(e) => updateField("bedrooms", e.target.value)}
              placeholder="e.g. 3" 
              className={`${inputStyle} font-black text-lg`}
            />
          </div>
        </div>

        <div className="group/input">
          <label className={labelStyle}>Bathrooms</label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              value={formData.bathrooms}
              onKeyDown={handleNumericInput}
              onChange={(e) => updateField("bathrooms", e.target.value)}
              placeholder="e.g. 2" 
              className={`${inputStyle} font-black text-lg`}
            />
          </div>
        </div>

        <div className="group/input">
          <label className={labelStyle}>Total Area (sqft)</label>
          <div className="relative">
            <input 
              type="number" 
              min="0"
              value={formData.area}
              onKeyDown={handleNumericInput}
              onChange={(e) => updateField("area", e.target.value)}
              placeholder="e.g. 2500" 
              className={`${inputStyle} font-black text-lg`}
            />
            <span className={`absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest pointer-events-none ${isDark ? 'text-slate-600' : 'text-slate-500'}`}>
              SQFT
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;