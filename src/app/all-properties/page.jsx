'use client';

import PropertyGrid from '@/src/components/AllProperty/PropertyGrid';
import PropertyHero from '@/src/components/AllProperty/PropertyHero';
import SidebarFilters from '@/src/components/AllProperty/SidebarFilters';
import { useState, useEffect } from 'react';


export default function AllPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // ১. MongoDB থেকে ডেটা ফেচ করা
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // আপনার API endpoint এখানে দিন
        const res = await fetch('/api/properties');
        const data = await res.json();
        
        setProperties(data);
        setFilteredProperties(data);
      } catch (err) {
        console.error("Error fetching properties:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // ২. সার্চ লজিক (Hero Section এর জন্য)
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = properties.filter((p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProperties(filtered);
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* --- HERO SECTION (Search logic passed here) --- */}
      <PropertyHero onSearch={handleSearch} />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- LEFT SIDEBAR (Sticky Filters) --- */}
          <div className="w-full lg:w-80 shrink-0">
            <SidebarFilters />
          </div>

          {/* --- RIGHT SIDE: PROPERTY LISTING --- */}
          <div className="flex-1">
            
            {/* Header Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  Available <span className="text-blue-600">Listings</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Showing {filteredProperties.length} results {searchQuery && `for "${searchQuery}"`}
                </p>
              </div>

              {/* Quick Sort Dropdown (Optional UI enhancement) */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Sort by:</span>
                <select className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-all">
                  <option>Newest First</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* --- THE GRID (Renders Card or Loading State) --- */}
            <PropertyGrid 
              properties={filteredProperties} 
              loading={loading} 
            />

          </div>
        </div>
      </div>
    </main>
  );
}