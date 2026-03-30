"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, MapPin, Bed, Bath, Square, Eye, TrendingUp, Plus, Edit, Trash2, AlertCircle, X, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext'; 

export default function PropertiesGrid() {

  const themeContext = useTheme(); 
  const isDark = themeContext ? themeContext.isDark : false;
  

  const [mounted, setMounted] = useState(false);
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('default'); 
  
  
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000000);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 


  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
  const [formModal, setFormModal] = useState({ isOpen: false, type: 'ADD', property: null });
  const [toast, setToast] = useState({ show: false, message: '' });


  useEffect(() => {
    setMounted(true); 
    fetch('/data/propertiesdata.json')
      .then(res => res.json())
      .then(data => {
        const propertyData = Array.isArray(data) ? data : (data.properties || []);
        setProperties(propertyData);

        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      })
      .catch(err => {
        console.error('Error loading data:', err);
        setIsLoading(false);
      });
  }, []);


  useEffect(() => {
    if (!mounted) return;

    let filtered = properties.filter(property => {
      const title = property.title?.toLowerCase() || '';
      const location = property.location?.toLowerCase() || '';
      const matchesSearch = title.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || property.type === selectedType;
      const matchesStatus = selectedStatus === 'All' || property.status === selectedStatus;
      const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
      return matchesSearch && matchesType && matchesStatus && matchesPrice;
    });


    if (sortOrder === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredProperties(filtered);
    setCurrentPage(1); 
  }, [searchTerm, selectedType, selectedStatus, minPrice, maxPrice, sortOrder, properties, mounted]);


  const saveProperties = (newProperties) => {
    setProperties(newProperties);
  };

  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(price);
  };

  const getStatusStyles = (status) => {
    if (isDark) {
      switch (status) {
        case 'Available': return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.3)]';
        case 'Under Offer': return 'bg-amber-500/20 text-amber-400 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
        case 'Sold': return 'bg-rose-500/20 text-rose-400 border border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]';
        default: return 'bg-gray-500/20 text-gray-400 border border-gray-500/50';
      }
    }
    switch (status) {
      case 'Available': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Under Offer': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Sold': return 'bg-rose-50 text-rose-700 border border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-300';
    }
  };

  
  const totalProperties = properties.length;
  const activeDealsCount = properties.filter(p => p.status === 'Available').length;
  const soldDealsCount = properties.filter(p => p.status === 'Sold').length;
  
  const getMarketStatus = () => {
    if (totalProperties === 0) return { text: 'No Data', color: 'text-gray-500', icon: AlertCircle };
    const soldRatio = soldDealsCount / totalProperties;
    if (soldRatio > 0.4) return { text: 'High Demand', color: 'text-emerald-600 dark:text-emerald-400', icon: TrendingUp };
    if (activeDealsCount > 0) return { text: 'Stable Market', color: 'text-blue-600 dark:text-blue-400', icon: TrendingUp };
    return { text: 'Low Inventory', color: 'text-amber-600 dark:text-amber-400', icon: AlertCircle };
  };

  const marketStatus = getMarketStatus();
  const StatusIcon = marketStatus.icon;
  const propertyTypes = ['All', ...new Set(properties.map(p => p.type))];
  const statusTypes = ['All', ...new Set(properties.map(p => p.status))];

  // ACTIONS =
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const confirmDelete = () => {
    const newProps = properties.filter(p => p.id !== deleteModal.id);
    saveProperties(newProps);
    setDeleteModal({ isOpen: false, id: null });
    showToast('Property deleted successfully!');
  };

  // Combined Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const submittedProperty = {
      id: formModal.type === 'ADD' ? Math.floor(Math.random() * 10000).toString() : formModal.property.id,
      title: formData.get('title'),
      location: formData.get('location'),
      price: Number(formData.get('price')),
      status: formData.get('status'),
      image: formData.get('image') || formModal.property?.image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      type: formModal.property?.type || 'House',
      beds: Number(formData.get('beds')) || formModal.property?.beds || 3,
      baths: Number(formData.get('baths')) || formModal.property?.baths || 2,
      area: Number(formData.get('area')) || formModal.property?.area || 1200,
      Seller: formModal.property?.Seller || 'Admin',
    };

    if (formModal.type === 'ADD') {
      saveProperties([submittedProperty, ...properties]);
      showToast('New property added successfully!');
    } else {
      saveProperties(properties.map(p => p.id === submittedProperty.id ? submittedProperty : p));
      showToast('Property updated successfully!');
    }
    setFormModal({ isOpen: false, type: 'ADD', property: null });
  };


  // PREVENT FLICKERING AND SHOW LOADING SCREEN 
  if (!mounted || isLoading) {
    return (
      <div className={`min-h-screen w-full flex flex-col items-center justify-center ${isDark ? 'bg-[#091a16]' : 'bg-gray-50'}`}>
        <div className="relative">
          <div className={`w-16 h-16 border-4 rounded-full ${isDark ? 'border-[#1a4a40]' : 'border-gray-200'}`}></div>
          <div className={`w-16 h-16 border-4 rounded-full border-t-transparent animate-spin absolute top-0 left-0 ${isDark ? 'border-[#cddfa0]' : 'border-blue-600'}`}></div>
        </div>
        <p className={`mt-4 text-sm font-bold animate-pulse uppercase tracking-widest ${isDark ? 'text-[#cddfa0]' : 'text-gray-500'}`}>
          Loading Workspace...
        </p>
      </div>
    );
  }


  return (
    <div className="relative p-4 md:p-6 transition-colors duration-500 bg-gray-50 dark:bg-[#091a16] text-gray-900 dark:text-gray-100 min-h-screen overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#cddfa0]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#1a4a40]/30 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Toast Notification */}
      <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[70] transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : '-translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-emerald-500 dark:bg-[#cddfa0] text-white dark:text-[#091a16] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold">
          <CheckCircle size={20} />
          {toast.message}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER SECTION*/}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-gray-200 dark:border-[#1a4a40]/50">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white dark:bg-[#133c34] text-gray-800 dark:text-[#cddfa0] text-[11px] font-bold uppercase tracking-widest border border-gray-200 dark:border-[#1a4a40] shadow-sm">
                Admin Control Panel
              </span>
              <span className="flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide">
                <span className="relative flex h-2.5 w-2.5 mr-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                Live Market Updates
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">
              Manage <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-[#cddfa0]">Listings</span>
            </h1>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
              Showing <strong className="font-bold text-gray-900 dark:text-[#cddfa0]">{filteredProperties.length}</strong> meticulously verified properties tailored to your current market filters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <div className="flex w-full sm:w-auto items-center gap-6 bg-white dark:bg-[#133c34]/40 p-4 rounded-2xl border border-gray-100 dark:border-[#1a4a40]/50 shadow-sm backdrop-blur-md">
              <div className="pl-2 pr-6 border-r border-gray-200 dark:border-[#1a4a40]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Active Deals</p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">{activeDealsCount}</p>
              </div>
              <div className="pr-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#1a4a40] flex items-center justify-center">
                  <StatusIcon size={20} className={marketStatus.color.includes('dark') ? marketStatus.color : `text-blue-600 dark:text-[#cddfa0]`} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Market Status</p>
                  <p className={`text-xs md:text-sm font-bold ${marketStatus.color}`}>{marketStatus.text}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setFormModal({ isOpen: true, type: 'ADD', property: null })}
              className="relative group overflow-hidden w-full sm:w-auto flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-2xl font-black transition-all duration-300 shadow-[0_8px_20px_rgb(37,99,235,0.3)] dark:shadow-[0_8px_20px_rgba(205,223,160,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] dark:hover:shadow-[0_8px_30px_rgba(205,223,160,0.5)] hover:-translate-y-1"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
              <Plus size={20} className="mr-2 z-10 relative" />
              <span className="z-10 relative">Add Property</span>
            </button>
          </div>
        </div>

        {/* COMPACT SEARCH & FILTERS*/}
        <div className="flex flex-col lg:flex-row gap-3 mb-8">
          <div className="relative w-full lg:max-w-[750px] group">
            <div className={`absolute -inset-0.5 rounded-lg blur opacity-0 group-hover:opacity-100 transition duration-500 ${isDark ? 'bg-gradient-to-r from-[#cddfa0]/40 to-[#1a4a40]/40' : 'bg-gradient-to-r from-blue-200 to-indigo-200'}`}></div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-[#cddfa0]/60" size={16} />
              <input
                type="text"
                placeholder="Search properties by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg outline-none transition-all duration-300 bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-md border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 shadow-sm text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="flex-1 md:w-auto px-3 py-2.5 rounded-lg outline-none cursor-pointer transition-all duration-300 bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-md border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 shadow-sm text-sm"
            >
              {propertyTypes.map(type => (
                <option key={type} value={type} className="bg-white dark:bg-[#0f2e28] text-gray-900 dark:text-white">{type}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 md:w-auto px-3 py-2.5 rounded-lg outline-none cursor-pointer transition-all duration-300 bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-md border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 shadow-sm text-sm"
            >
              {statusTypes.map(status => (
                <option key={status} value={status} className="bg-white dark:bg-[#0f2e28] text-gray-900 dark:text-white">{status}</option>
              ))}
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="flex-1 md:w-auto px-3 py-2.5 rounded-lg outline-none cursor-pointer transition-all duration-300 bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-md border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 shadow-sm text-sm"
            >
              <option value="default" className="bg-white dark:bg-[#0f2e28] text-gray-900 dark:text-white">Sort by Price</option>
              <option value="low-high" className="bg-white dark:bg-[#0f2e28] text-gray-900 dark:text-white">Price: Low to High</option>
              <option value="high-low" className="bg-white dark:bg-[#0f2e28] text-gray-900 dark:text-white">Price: High to Low</option>
            </select>

            <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-md border border-gray-200 dark:border-[#1a4a40] shadow-sm text-sm">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-16 px-1 py-1 bg-transparent outline-none text-center text-gray-900 dark:text-white font-medium"
              />
              <span className="text-gray-300 dark:text-[#1a4a40] font-bold">|</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-20 px-1 py-1 bg-transparent outline-none text-center text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* PROPERTIES GRID*/}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentItems.map((property) => (
            <div 
              key={property.id} 
              className="group relative rounded-2xl overflow-hidden transition-all duration-500 bg-white dark:bg-[#133c34]/40 backdrop-blur-xl border border-gray-100 dark:border-[#1a4a40]/60 shadow-lg hover:-translate-y-2 hover:shadow-2xl dark:hover:shadow-[#cddfa0]/10 hover:border-[#cddfa0]/50 flex flex-col"
            >
              <div className="relative overflow-hidden h-48">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                <div className={`absolute top-3 right-3 z-20 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${getStatusStyles(property.status)}`}>
                  {property.status}
                </div>
                
                <div className="absolute top-3 left-3 z-20 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded border border-white/20 text-white text-[9px] font-mono">
                  ID: {property.id}
                </div>

                <div className="absolute bottom-3 left-4 z-20">
                  <span className="text-xl font-black text-white drop-shadow-md tracking-tight">
                    {formatPrice(property.price)}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 mb-1.5 group-hover:text-[#cddfa0] transition-colors">
                  {property.title}
                </h3>

                <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs mb-3">
                  <MapPin size={14} className="mr-1.5 flex-shrink-0 text-[#cddfa0]" />
                  <span className="line-clamp-1 font-medium">{property.location}</span>
                </div>

                <div className="flex justify-between text-xs text-gray-700 dark:text-gray-300 mb-4 border-y border-gray-100 dark:border-[#1a4a40]/50 py-2.5">
                  <div className="flex items-center gap-1 font-medium"><Bed size={14} className="text-blue-500 dark:text-[#cddfa0]" />{property.beds}</div>
                  <div className="flex items-center gap-1 font-medium"><Bath size={14} className="text-blue-500 dark:text-[#cddfa0]" />{property.baths}</div>
                  <div className="flex items-center gap-1 font-medium"><Square size={14} className="text-blue-500 dark:text-[#cddfa0]" />{property.area}</div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Seller</span>
                    <span className="text-xs font-bold text-gray-900 dark:text-[#cddfa0]">{property.Seller || 'Unknown'}</span>
                  </div>
                  
                  <div className="flex gap-1.5">
                    <Link href={`/property/${property.id}`} className="p-2 bg-gray-100 dark:bg-[#1a4a40]/60 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-[#1a4a40] transition-colors"><Eye size={16} /></Link>
                    <button onClick={() => setFormModal({ isOpen: true, type: 'EDIT', property })} className="p-2 bg-blue-50 dark:bg-[#cddfa0]/10 text-blue-600 dark:text-[#cddfa0] rounded-lg hover:bg-blue-100 dark:hover:bg-[#cddfa0]/20 transition-colors"><Edit size={16} /></button>
                    <button onClick={() => setDeleteModal({ isOpen: true, id: property.id })} className="p-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-20 relative">
            <Search size={40} className="mx-auto mb-3 text-gray-300 dark:text-[#1a4a40]" />
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No properties found.</p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-1.5">
            <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&lt;</button>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              if (page === 1 || page === 2 || page === 3 || page === totalPages) {
                return (
                  <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-300 ${currentPage === page ? 'bg-gray-800 text-white dark:bg-[#202934] dark:text-gray-200 shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1f2937]'}`}>{page}</button>
                );
              } else if (page === 4 && totalPages > 4) { return <span key="dots" className="px-1 text-gray-500 dark:text-gray-400 font-bold">...</span>; }
              return null;
            })}
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">&gt;</button>
            <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="ml-2 px-4 py-1.5 rounded-lg bg-gray-800 text-gray-200 dark:bg-[#202934] dark:text-gray-300 dark:border dark:border-gray-700/50 text-sm font-bold hover:bg-gray-900 dark:hover:bg-[#2d3748] transition-all duration-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">Load More</button>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#091a16] border border-gray-100 dark:border-[#1a4a40]/60 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-4 text-rose-600 dark:text-rose-400"><Trash2 size={24} /></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Delete Property?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">Are you sure you want to delete Property ID: <strong className="text-gray-900 dark:text-[#cddfa0]">#{deleteModal.id}</strong>? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, id: null })} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-[#1a4a40] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#133c34] transition-colors">Cancel</button>
              <button onClick={confirmDelete} className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* UNIFIED FORM MODAL */}
      {formModal.isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#091a16] border border-gray-100 dark:border-[#1a4a40]/60 rounded-2xl p-6 w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setFormModal({ isOpen: false, type: 'ADD', property: null })} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#133c34] transition-colors"><X size={20} /></button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-[#1a4a40] flex items-center justify-center text-blue-600 dark:text-[#cddfa0]">
                {formModal.type === 'ADD' ? <Plus size={20} /> : <Edit size={18} />}
              </div>
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">{formModal.type === 'ADD' ? 'Add New Property' : 'Edit Property'}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{formModal.type === 'ADD' ? 'Fill in the details below' : `ID: #${formModal.property?.id}`}</p>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Property Title</label>
                <input name="title" required type="text" defaultValue={formModal.property?.title} placeholder="e.g. Modern Villa" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
              </div>
              
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon size={14} /> Image URL
                </label>
                <input name="image" type="url" defaultValue={formModal.property?.image} placeholder="https://example.com/image.jpg" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Location</label>
                <input name="location" required type="text" defaultValue={formModal.property?.location} placeholder="e.g. Dhaka, Bangladesh" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Price ($)</label>
                  <input name="price" required type="number" defaultValue={formModal.property?.price} placeholder="e.g. 500000" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
                  <select name="status" defaultValue={formModal.property?.status || 'Available'} className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all">
                    <option value="Available">Available</option>
                    <option value="Under Offer">Under Offer</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
                {formModal.type === 'ADD' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Beds</label>
                      <input name="beds" type="number" placeholder="3" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5">Baths</label>
                      <input name="baths" type="number" placeholder="2" className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#133c34]/50 border border-gray-200 dark:border-[#1a4a40] text-gray-900 dark:text-white text-sm outline-none focus:border-[#cddfa0] focus:ring-2 focus:ring-[#cddfa0]/20 transition-all" />
                    </div>
                  </>
                )}
              </div>
              
              <button 
                type="submit" 
                className="relative group overflow-hidden w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-xl font-black transition-all duration-300 shadow-[0_8px_20px_rgb(37,99,235,0.3)] dark:shadow-[0_8px_20px_rgba(205,223,160,0.3)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.5)] dark:hover:shadow-[0_8px_30px_rgba(205,223,160,0.5)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 transform -skew-x-12 -translate-x-full group-hover:animate-shine z-0"></div>
                <span className="z-10 relative">{formModal.type === 'ADD' ? 'Submit Property' : 'Save Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
