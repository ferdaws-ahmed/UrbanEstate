"use client";
import React from 'react';
import { MapPin, ArrowUpRight, Home } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';

// সরাসরি ডাটা এখানে দিয়ে দিচ্ছি যাতে লোডিং হওয়ার কোনো সুযোগ না থাকে
const staticListings = [
  { id: 1, title: "Modern Family Villa", price: "$850,000", location: "Beverly Hills, CA", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80" },
  { id: 2, title: "Luxury Penthouse", price: "$1,250,000", location: "Manhattan, NY", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
  { id: 3, title: "Cozy Beach House", price: "$420,000", location: "Miami, FL", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=400&q=80" },
  { id: 4, title: "Garden Apartment", price: "$310,000", location: "Austin, TX", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80" },
  { id: 5, title: "Skyline View Condo", price: "$780,000", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=400&q=80" },
  { id: 6, title: "Classic Brick Mansion", price: "$2,100,000", location: "Greenwich, CT", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80" },
  { id: 7, title: "Eco-Friendly Smart Home", price: "$640,000", location: "Seattle, WA", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80" }
];

export default function RecentListings() {
  const { isDark } = useTheme();

  return (
    <div className={`p-5 sm:p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] ${
      isDark ? 'bg-[#133c34]/50 border-[#1a4a40]/60' : 'bg-white/80 border-white'
    }`}>
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Recent <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Listings</span>
          </h3>
          <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Freshly added properties</p>
        </div>
        <button className={`p-2 rounded-xl transition-colors ${isDark ? 'bg-[#1a4a40] text-[#cddfa0] hover:bg-[#cddfa0] hover:text-[#091a16]' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`}>
          <ArrowUpRight size={18} />
        </button>
      </div>

      {/* Listings List - Responsive Grid/List */}
      <div className="grid grid-cols-1 gap-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
        {staticListings.map((listing) => (
          <div 
            key={listing.id} 
            className={`group relative flex items-center gap-3 sm:gap-4 p-3 rounded-2xl border transition-all duration-300 cursor-pointer ${
              isDark 
                ? 'bg-[#0f2e28]/40 border-[#1a4a40]/30 hover:bg-[#1a4a40]/60 hover:border-[#cddfa0]/30' 
                : 'bg-gray-50/50 border-gray-100 hover:bg-white hover:border-blue-100 hover:shadow-lg'
            }`}
          >
            {/* Image Wrapper */}
            <div className="relative shrink-0 overflow-hidden rounded-xl">
              <img 
                src={listing.image} 
                alt={listing.title} 
                className="w-14 h-14 sm:w-16 sm:h-16 object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <p className={`font-bold text-xs sm:text-sm truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {listing.title}
              </p>
              
              <p className={`text-xs sm:text-sm font-black mt-0.5 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
                {listing.price}
              </p>

              <div className="flex items-center gap-1 mt-1">
                <MapPin size={10} className="text-gray-400" />
                <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-400 truncate">
                  {listing.location}
                </p>
              </div>
            </div>

            {/* Action Icon - Hidden on very small screens */}
            <div className={`hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>
              <Home size={16} />
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <button className={`w-full mt-6 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
        isDark 
          ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-gray-300 hover:bg-[#cddfa0] hover:text-[#091a16]' 
          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-900 hover:text-white'
      }`}>
        Explore All {staticListings.length} Listings
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? '#1a4a40' : '#e5e7eb'};
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
