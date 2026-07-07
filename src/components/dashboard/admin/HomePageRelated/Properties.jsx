"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext'; 
import { Search, Filter, MoreVertical, Edit, Trash2, Eye, LayoutGrid, List, User, Mail, Calendar, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function Properties() {
  const { isDark } = useTheme(); 
  const [properties, setProperties] = useState([]);
  const [featuredPropertyIds, setFeaturedPropertyIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesRes, featuredRes] = await Promise.all([
          fetch('/api/admin/properties'),
          fetch('/api/featured-properties')
        ]);
        
        if (!propertiesRes.ok) throw new Error('Failed to fetch properties');
        const propertiesData = await propertiesRes.json();
        setProperties(propertiesData);

        if (featuredRes.ok) {
          const featuredData = await featuredRes.json();
          setFeaturedPropertyIds(new Set(featuredData.map(p => p._id || p.propertyId)));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleFeatured = async (propertyId) => {
    try {
      const isCurrentlyFeatured = featuredPropertyIds.has(propertyId);
      const method = isCurrentlyFeatured ? 'DELETE' : 'POST';
      
      const response = await fetch('/api/featured-properties', {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ propertyId })
      });

      if (response.ok) {
        setFeaturedPropertyIds(prev => {
          const newSet = new Set(prev);
          if (isCurrentlyFeatured) {
            newSet.delete(propertyId);
          } else {
            newSet.add(propertyId);
          }
          return newSet;
        });
        toast.success(isCurrentlyFeatured ? "Removed from featured" : "Added to featured");
      } else {
          toast.error("Failed to update featured status");
        }
    } catch (error) {
      console.error("Error toggling featured:", error);
      toast.error("Failed to update featured status");
    }
  };

  const categories = ['All', ...new Set(properties.map(p => p.category || p.type).filter(Boolean))];

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.seller?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || (property.category || property.type) === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        const response = await fetch('/api/admin/properties', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (response.ok) {
          toast.success("Property deleted successfully");
          setProperties(properties.filter(p => p._id !== id));
        } else {
          toast.error("Failed to delete property");
        }
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading Properties...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* Category Sorting Navbar-like Header */}
      <div className={`sticky top-0 z-30 mb-8 p-2 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-[var(--card)]/80 border-white/10 shadow-xl shadow-black/20' : 'bg-white/80 border-gray-200 shadow-lg shadow-gray-200/50'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          {/* Categories */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                  categoryFilter === cat
                    ? (isDark ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20')
                    : (isDark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-100')
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search by title, address, seller..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-xl text-xs border focus:outline-none transition-all duration-300 ${
                  isDark ? 'bg-black/20 border-white/10 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
                }`}
              />
            </div>
            
            <div className={`flex items-center p-1 rounded-xl border ${isDark ? 'bg-black/20 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
              <button 
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? (isDark ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 shadow-sm') : 'text-gray-500'}`}
              >
                <List size={16} />
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? (isDark ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600 shadow-sm') : 'text-gray-500'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property List */}
      {viewMode === 'table' ? (
        <div className={`rounded-3xl border overflow-hidden transition-all duration-300 ${isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Property Details</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Seller Information</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Price & Specs</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Status & Date</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {filteredProperties.map((p) => (
                  <tr key={p._id} className={`group transition-all duration-300 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"} 
                          alt={p.title} 
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-transparent group-hover:border-emerald-500 transition-all"
                        />
                        <div className="min-w-0">
                          <p className={`text-sm font-black truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.title}</p>
                          <p className={`text-[10px] font-medium flex items-center gap-1 mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <MapPin size={10} className="text-emerald-500" /> {p.address}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={p.seller?.image || p.sellerAvatar} 
                          alt={p.seller?.name || p.agent} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20"
                        />
                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{p.seller?.name || p.agent}</p>
                          <p className={`text-[10px] font-medium truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{p.seller?.email || p.agentEmail || 'Seller'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className={`text-sm font-black ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}>$ {p.price == null ? '' : Number(p.price).toLocaleString()}</p>
                        <p className={`text-[10px] font-bold mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {p.beds} {p.beds === 1 ? 'Bed' : 'Beds'} • {p.baths} {p.baths === 1 ? 'Bath' : 'Baths'} • {p.area?.toLocaleString()} sqft
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <span className={`w-fit px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                          p.status === 'published' ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700') :
                          p.status === 'pending' ? (isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700') :
                          (isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700')
                        }`}>
                          {p.status}
                        </span>
                        <p className={`text-[10px] font-bold flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Calendar size={10} /> {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
            <Link href={`/propertydetails/${p._id}`} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-emerald-500/20' : 'bg-gray-100 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'}`}>
              <Eye size={16} />
            </Link>
            <button 
              onClick={() => toggleFeatured(p._id)}
              className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-yellow-500/20' : 'bg-gray-100 text-gray-600 hover:text-yellow-600 hover:bg-yellow-50'} ${featuredPropertyIds.has(p._id) ? (isDark ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50') : ''}`}
            >
              <Star size={16} fill={featuredPropertyIds.has(p._id) ? 'currentColor' : 'none'} />
            </button>
            <Link href={`/dashboard/admin/edit/${p._id}`} className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:text-white hover:bg-blue-500/20' : 'bg-gray-100 text-gray-600 hover:text-blue-600 hover:bg-blue-50'}`}>
              <Edit size={16} />
            </Link>
            <button 
              onClick={() => handleDelete(p._id)}
              className={`p-2 rounded-xl transition-all ${isDark ? 'bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/20' : 'bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-red-50'}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((p) => (
            <div key={p._id} className={`group rounded-[2rem] border overflow-hidden transition-all duration-500 hover:scale-[1.02] ${isDark ? 'bg-[var(--card)]/40 border-white/10 hover:bg-[var(--card)]' : 'bg-white border-gray-200 hover:shadow-2xl shadow-gray-200/50'}`}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={p.images?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400"} 
                  alt={p.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-md ${
                    p.status === 'published' ? 'bg-emerald-500/80 text-white' : 'bg-amber-500/80 text-white'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-lg font-black leading-tight truncate">{p.title}</p>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <img src={p.seller?.image || p.sellerAvatar} className="w-8 h-8 rounded-full border border-emerald-500/30" />
                  <div className="min-w-0">
                    <p className={`text-[10px] font-black truncate ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{p.seller?.name || p.agent}</p>
                    <p className="text-[8px] font-bold text-gray-500 truncate">{p.seller?.email || p.agentEmail || 'Seller'}</p>
                  </div>
                </div>

                <div className={`grid grid-cols-3 gap-2 py-3 border-y mb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                  <div className="text-center">
                    <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.beds}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Beds</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.baths}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Baths</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.area}</p>
                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">Sqft</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-sm font-black ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}>$ {p.price?.toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Link href={`/propertydetails/${p._id}`} className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-emerald-600'}`}>
                      <Eye size={14} />
                    </Link>
                    <button 
                      onClick={() => toggleFeatured(p._id)}
                      className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-yellow-600'} ${featuredPropertyIds.has(p._id) ? (isDark ? 'text-yellow-400 bg-yellow-500/20' : 'text-yellow-600 bg-yellow-50') : ''}`}
                    >
                      <Star size={14} fill={featuredPropertyIds.has(p._id) ? 'currentColor' : 'none'} />
                    </button>
                    <Link href={`/dashboard/admin/edit/${p._id}`} className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-gray-400 hover:text-white' : 'bg-gray-100 text-gray-600 hover:text-blue-600'}`}>
                      <Edit size={14} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className={`p-2 rounded-xl ${isDark ? 'bg-white/5 text-gray-400 hover:text-red-400' : 'bg-gray-100 text-gray-600 hover:text-red-600'}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 opacity-40">
          <Filter size={48} className="mb-4" />
          <p className="text-sm font-black uppercase tracking-[0.2em]">No properties found</p>
        </div>
      )}
    </div>
  );
}

