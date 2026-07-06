import { useTheme } from "@/src/components/Theme/ThemeContext";

/**
 * BasicInfo Component
 * Handles primary property data: Title, Price (USD), Category, Status, and Description.
 * Supports Dark/Light mode and prevents negative pricing.
 */
const BasicInfo = ({ formData, updateField }) => {
  const { isDark } = useTheme();

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value >= 0 || value === "") {
      updateField("price", value);
    }
  };

  const preventInvalidChars = (e) => {
    if (["e", "E", "+", "-"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const inputStyle = `
    w-full px-6 py-4.5 rounded-[1.25rem] 
    border-2 outline-none transition-all duration-300 shadow-sm
    ${isDark 
      ? 'border-white/40 bg-[var(--card)] text-slate-100 placeholder-slate-500 focus:ring-teal-500/10 focus:border-teal-500/50 focus:bg-[var(--card)] hover:border-teal-800/60' 
      : 'border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:ring-teal-500/10 focus:border-teal-500/50 focus:bg-white hover:border-teal-300 shadow-inner'}
  `;

  const labelStyle = `block text-[10px] font-black mb-2.5 ml-2 uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-600'}`;

  return (
    <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group/section shadow-2xl ${isDark ? 'bg-[var(--card)] border-white/30 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
      
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/section:scale-110 transition-transform duration-500 ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
            <svg className="w-6 h-6 text-teal-600 dark:text-[#cddfa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Basic Information
          </h2>
        </div>
        <p className={`text-base ml-16 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Provide the essential details about your property listing to attract the right audience.
        </p>
      </div>

      <div className="space-y-10">
        
        <div className="group/input">
          <label className={labelStyle}>Property Title *</label>
          <input 
            type="text" 
            placeholder="e.g. Modern Penthouse with Central Park View" 
            className={inputStyle}
            value={formData.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          <div className="group/input">
            <label className={labelStyle}>Price (USD) *</label>
            <div className="relative">
              <span className={`absolute left-6 top-1/2 -translate-y-1/2 font-black text-xl ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                $
              </span>
              <input 
                type="number" 
                min="0"
                value={formData.price}
                onChange={handlePriceChange}
                onKeyDown={preventInvalidChars}
                placeholder="0.00" 
                className={`${inputStyle} pl-12 font-black text-teal-600 dark:text-[#cddfa0] text-lg tracking-tight`}
                required
              />
            </div>
          </div>

          <div className="group/input">
            <label className={labelStyle}>Property Category *</label>
            <div className="relative">
              <select 
                className={`${inputStyle} appearance-none cursor-pointer pr-12 font-bold`}
                value={formData.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              >
                <option value="" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Select Category</option>
                <option value="Residential" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Residential</option>
                <option value="Commercial" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Commercial</option>
                <option value="Industrial" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Industrial</option>
                <option value="Land" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Land/Plot</option>
              </select>
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* LISTING STATUS & TYPE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <label className={labelStyle}>Listing Status</label>
            <div className={`flex p-2 rounded-[1.5rem] border-2 transition-all duration-500 ${isDark ? 'bg-[var(--card)] border-white/40' : 'bg-slate-100 border-slate-200 shadow-inner'}`}>
              {['For Sale', 'For Rent'].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateField('status', status)}
                  className={`
                    flex-1 py-3.5 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500
                    ${formData.status === status 
                      ? (isDark ? 'bg-[var(--card)] text-[#cddfa0] shadow-xl shadow-teal-500/10' : 'bg-white text-teal-600 shadow-lg shadow-teal-500/10 border-slate-100')
                      : (isDark ? 'text-slate-500 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900')
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="group/input">
            <label className={labelStyle}>Property Type</label>
            <div className="relative">
              <select 
                className={`${inputStyle} appearance-none cursor-pointer pr-12 font-bold`}
                value={formData.propertyType}
                onChange={(e) => updateField("propertyType", e.target.value)}
              >
                <option value="" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Select Type</option>
                <option value="Apartment" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Apartment</option>
                <option value="House" className={isDark ? "bg-[var(--card)]" : "bg-white"}>House</option>
                <option value="Villa" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Villa</option>
                <option value="Office" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Office Space</option>
                <option value="Studio" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Studio</option>
                <option value="Land" className={isDark ? "bg-[var(--card)]" : "bg-white"}>Land</option>
              </select>
              <div className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="group/input">
          <label className={labelStyle}>Property Description *</label>
          <div className="relative">
            <textarea 
              rows="6" 
              placeholder="Tell us about the property's unique features, neighborhood, and anything else potential buyers should know..." 
              className={`${inputStyle} resize-none leading-relaxed`}
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              required
            ></textarea>
            <div className="flex justify-between mt-3 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Clear descriptions attract more buyers</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Min 200 characters</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BasicInfo;

