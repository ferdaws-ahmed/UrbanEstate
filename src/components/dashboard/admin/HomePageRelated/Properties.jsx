"use client";

import React, { useState } from 'react';
import { useTheme } from '../../ThemeProvider'; 

const propertiesData = [
  { id: 1, address: '123 Main St, Gulshan', price: '$450,000', status: 'Available', type: 'Apartment', beds: 3, baths: 2, sqft: 1200 },
  { id: 2, address: '456 Oak Ave, Banani', price: '$380,000', status: 'Sold', type: 'House', beds: 4, baths: 3, sqft: 1800 },
  { id: 3, address: '789 Pine Rd, Dhanmondi', price: '$600,000', status: 'Pending', type: 'Villa', beds: 5, baths: 4, sqft: 2500 },
  { id: 4, address: '321 Elm St, Uttara', price: '$320,000', status: 'Available', type: 'Condo', beds: 2, baths: 2, sqft: 900 },
  { id: 5, address: '654 Maple Ln, Mirpur', price: '$280,000', status: 'Sold', type: 'Apartment', beds: 2, baths: 1, sqft: 800 }
];

export default function Properties() {
  const { isDark } = useTheme(); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProperties = propertiesData.filter(property => {
    const matchesSearch = property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || property.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const bgColor = isDark ? 'bg-[#0f2e28]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#1a4a40]/40' : 'bg-white';
  const borderColor = isDark ? 'border-[#1a4a40]' : 'border-gray-200';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const subTextColor = isDark ? 'text-[#cddfa0]/80' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgColor}`}>
      <div className="p-4 md:p-6 lg:p-8 overflow-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className={`text-xl md:text-2xl font-bold transition-colors ${textColor}`}>Properties Management</h1>
          <p className={`text-sm mt-1 transition-colors ${subTextColor}`}>Manage and monitor all property listings</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full sm:flex-1 px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-all duration-300 ${isDark ? 'bg-[#1a4a40]/30 border-[#1a4a40] text-white placeholder-gray-400 focus:ring-[#cddfa0]/50' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'}`}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full sm:w-auto px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 shadow-sm transition-all duration-300 cursor-pointer ${isDark ? 'bg-[#1a4a40]/30 border-[#1a4a40] text-white focus:ring-[#cddfa0]/50' : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'}`}
          >
            <option value="All">All Status</option>
            <option value="Available">Available</option>
            <option value="Sold">Sold</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Properties Table */}
        <div className={`border rounded-xl overflow-hidden shadow-sm transition-colors duration-300 ${cardBg} ${borderColor}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className={`border-b transition-colors ${isDark ? 'border-[#1a4a40] bg-[#133c34]/50' : 'border-gray-200 bg-gray-50'}`}>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Address</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Type</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Price</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Beds/Baths</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Sqft</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Status</th>
                  <th className={`text-left py-4 px-4 font-semibold ${isDark ? 'text-[#cddfa0]' : 'text-gray-700'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id} className={`border-b transition-colors ${isDark ? 'border-[#1a4a40]/50 hover:bg-[#133c34]/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className={`py-3.5 px-4 font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{property.address}</td>
                      <td className={`py-3.5 px-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>{property.type}</td>
                      <td className={`py-3.5 px-4 font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{property.price}</td>
                      <td className={`py-3.5 px-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>{property.beds} bed / {property.baths} bath</td>
                      <td className={`py-3.5 px-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>{property.sqft}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-[11px] uppercase tracking-wider font-bold ${
                          property.status === 'Available' ? (isDark ? 'bg-green-900/40 text-green-400' : 'bg-green-100 text-green-800') :
                          property.status === 'Sold' ? (isDark ? 'bg-red-900/40 text-red-400' : 'bg-red-100 text-red-800') :
                          (isDark ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-100 text-yellow-800')
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button className={`mr-4 font-medium transition-colors ${isDark ? 'text-[#cddfa0] hover:text-white' : 'text-blue-600 hover:text-blue-800'}`}>Edit</button>
                        <button className={`font-medium transition-colors ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}>Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className={`py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No properties found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { label: 'Total Properties', val: propertiesData.length, color: isDark ? 'text-white' : 'text-gray-900' },
            { label: 'Available', val: propertiesData.filter(p => p.status === 'Available').length, color: isDark ? 'text-[#cddfa0]' : 'text-green-600' },
            { label: 'Sold', val: propertiesData.filter(p => p.status === 'Sold').length, color: isDark ? 'text-red-400' : 'text-red-600' }
          ].map((stat, i) => (
            <div key={i} className={`p-5 md:p-6 rounded-xl border shadow-sm transition-colors duration-300 ${cardBg} ${borderColor}`}>
              <h3 className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</h3>
              <p className={`text-2xl md:text-3xl font-black mt-2 ${stat.color}`}>{stat.val}</p>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}