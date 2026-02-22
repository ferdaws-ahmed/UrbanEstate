'use client';

import { useState } from 'react';

/**
 * Amenities Component
 * Features: Multi-select grid, animated hover effects, and dark mode support.
 * Uses a list of global property amenities with unique icons.
 */
const Amenities = () => {
  // State to store selected amenity IDs
  const [selectedAmenities, setSelectedAmenities] = useState([]);

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
    if (selectedAmenities.includes(id)) {
      setSelectedAmenities(selectedAmenities.filter((item) => item !== id));
    } else {
      setSelectedAmenities([...selectedAmenities, id]);
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 transition-all duration-300">
      
      {/* SECTION HEADER: Focused on UX */}
      <div className="mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Amenities & Features</span>
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg">
            Optional
          </span>
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Select the features that make your property stand out.
        </p>
      </div>

      {/* AMENITIES GRID: Responsive layout with animation */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {amenityList.map((item) => {
          const isSelected = selectedAmenities.includes(item.id);
          
          return (
            <button
              key={item.id}
              type="button" // Critical: prevent form submission
              onClick={() => toggleAmenity(item.id)}
              className={`
                relative group flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 transform
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-95 shadow-md shadow-blue-100 dark:shadow-none' 
                  : 'border-slate-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-slate-500 hover:-translate-y-1'
                }
              `}
            >
              {/* Animated Icon Container */}
              <div className={`
                text-3xl mb-2 transition-transform duration-300 group-hover:scale-110
                ${isSelected ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}
              `}>
                {item.icon}
              </div>

              {/* Label */}
              <span className={`
                text-xs md:text-sm font-bold transition-colors
                ${isSelected ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}
              `}>
                {item.label}
              </span>

              {/* Selection Indicator Dot */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* FOOTER COUNTER: Real-time feedback */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-bold text-blue-600 dark:text-blue-400">{selectedAmenities.length}</span> items selected
        </p>
        <button 
          type="button"
          onClick={() => setSelectedAmenities([])}
          className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default Amenities;