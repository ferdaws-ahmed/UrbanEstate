import { useTheme } from "@/src/components/Theme/ThemeContext";

/**
 * Amenities Component
 * Features: Multi-select grid, animated hover effects, and dark mode support.
 * Uses a list of global property amenities with unique icons.
 */
const Amenities = ({ amenities, updateAmenities }) => {
  const { isDark } = useTheme();
  // Industry standard amenities for a global marketplace
  const amenityList = [
    { id: 'wifi', label: 'Free Wi-Fi', icon: '🌐' },
    { id: 'pool', label: 'Swimming Pool', icon: '🏊‍♂️' },
    { id: 'gym', label: 'Fitness Center', icon: '🏋️‍♀️' },
    { id: 'parking', label: 'Parking Space', icon: '🚗' },
    { id: 'security', label: '24/7 Security', icon: '🛡️' },
    { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
    { id: 'garden', label: 'Private Garden', icon: '🌳' },
    { id: 'cctv', label: 'CCTV Camera', icon: '📹' },
    { id: 'lift', label: 'Elevator/Lift', icon: '🛗' },
    { id: 'power', label: 'Power Backup', icon: '⚡' },
    { id: 'water', label: '24h Water', icon: '🚰' },
    { id: 'playground', label: 'Playground', icon: '⚽' },
  ];

  /**
   * Toggles the selection of an amenity
   * @param {string} id - The ID of the selected amenity
   */
  const toggleAmenity = (id) => {
    if (amenities.includes(id)) {
      updateAmenities(amenities.filter((item) => item !== id));
    } else {
      updateAmenities([...amenities, id]);
    }
  };

  return (
    <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group/section shadow-2xl ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]/30 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
      
      {/* SECTION HEADER */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/section:scale-110 transition-transform duration-500 ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
              <svg className="w-6 h-6 text-teal-600 dark:text-[#cddfa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
              </svg>
            </div>
            <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Amenities & Features
            </h2>
          </div>
          <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.25em] border ${isDark ? 'bg-teal-900/20 text-[#cddfa0] border-teal-900/30' : 'bg-teal-50 text-teal-600 border-teal-200 shadow-sm'}`}>
            Optional
          </span>
        </div>
        <p className={`text-base ml-16 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Select the features that make your property stand out in the global market.
        </p>
      </div>

      {/* AMENITIES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {amenityList.map((item) => {
          const isSelected = amenities.includes(item.id);
          
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleAmenity(item.id)}
              className={`
                relative group flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 transition-all duration-500 transform
                ${isSelected 
                  ? (isDark ? 'border-teal-500 bg-[#1a4a40]/30 scale-[0.96] shadow-2xl shadow-teal-500/10' : 'border-teal-500 bg-teal-50/40 scale-[0.96] shadow-xl shadow-teal-500/20')
                  : (isDark ? 'border-[#1a4a40]/10 bg-[#061510] hover:border-teal-800/50 hover:-translate-y-2' : 'border-slate-100 bg-slate-50 hover:border-teal-300 hover:-translate-y-2 hover:shadow-lg')
                }
              `}
            >
              <div className={`
                text-5xl mb-4 transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-6
                ${isSelected ? 'grayscale-0' : 'grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100'}
              `}>
                {item.icon}
              </div>

              <span className={`
                text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-colors text-center leading-tight
                ${isSelected ? (isDark ? 'text-[#cddfa0]' : 'text-teal-700') : (isDark ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-600 group-hover:text-slate-900')}
              `}>
                {item.label}
              </span>

              {isSelected && (
                <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(20,184,166,1)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER COUNTER */}
      <div className={`mt-12 flex items-center justify-between border-t pt-10 ${isDark ? 'border-[#1a4a40]/30' : 'border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
            <span className={`text-sm font-black ${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`}>{amenities.length}</span>
          </div>
          <p className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
            Features Selected
          </p>
        </div>
        
        {amenities.length > 0 && (
          <button 
            type="button"
            onClick={() => updateAmenities([])}
            className={`text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-2 group/clear ${isDark ? 'text-slate-600 hover:text-rose-400' : 'text-slate-500 hover:text-rose-600'}`}
          >
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-[#061510] group-hover/clear:bg-rose-900/20' : 'bg-slate-100 group-hover/clear:bg-rose-100 shadow-sm'}`}>
              <svg className="w-3.5 h-3.5 group-hover/clear:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            Clear Selection
          </button>
        )}
      </div>
    </div>
  );
};

export default Amenities;