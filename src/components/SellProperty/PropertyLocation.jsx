'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from 'react-hot-toast';

// Leaflet components dynamic import (SSR fix)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

/**
 * Map Click Logic: Map er vitor click korle marker move korbe
 */
function MapClickHandler({ updateLocation }) {
  useMapEvents({
    click: (e) => {
      updateLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const PropertyLocation = ({ formData, updateLocation, updateField }) => {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [addressDetails, setAddressDetails] = useState("");
  const mapRef = useRef(null);
  const position = [formData.location.latitude, formData.location.longitude];

  // Leaflet Marker Icon Fix
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Fetch suggestions as user types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        try {
          const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(searchQuery)}&limit=5`);
          const data = await res.json();
          if (res.ok) {
            setSuggestions(Array.isArray(data) ? data : []);
          } else {
            console.error("Suggestions API returned error:", data.error);
            setSuggestions([]);
          }
        } catch (err) {
          console.error("Suggestion fetch failed", err);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Location details fetch function (Reverse geocoding)
  const fetchAddressDetails = async (lat, lng) => {
    setIsLoadingDetails(true);
    try {
      const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
      
      if (!res.ok) throw new Error("API error");
      
      const data = await res.json();
      
      if (data) {
        const cleanDistrict = data.district || "Unknown District";
        const cleanFullAddr = data.fullAddress || data.display_name;

        setAddressDetails(cleanFullAddr);
        
        if (updateField) {
          updateField('address', cleanFullAddr);
          updateField('district', cleanDistrict);
          updateField('fullAddress', cleanFullAddr);
        }
      }
    } catch (err) {
      console.error("Address fetch failed", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Position change triggers address update
  useEffect(() => {
    fetchAddressDetails(position[0], position[1]);
  }, [formData.location.latitude, formData.location.longitude]);

  // Handle suggestion click
  const handleSelectSuggestion = (suggestion) => {
    const lat = parseFloat(suggestion.lat);
    const lng = parseFloat(suggestion.lon);
    updateLocation(lat, lng);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    mapRef.current?.flyTo([lat, lng], 16);
  };

  // Search function (for enter key)
  const handleSearch = async () => {
    if (!searchQuery || searchQuery.trim().length < 3) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocode/search?q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      
      if (!res.ok) {
        toast.error(`Search failed: ${data.error || "Unknown error"}`);
        throw new Error(data.error || "Search API failed");
      }
      
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        updateLocation(lat, lng);
        mapRef.current?.flyTo([lat, lng], 16);
        setSuggestions([]);
        setSearchQuery(data[0].display_name); // Sync search bar with cleaned result
        toast.success("Location found!");
      } else {
        toast.error("No locations found for your search.");
      }
    } catch (err) {
      console.error("Search error details:", err);
      // Already toasted in !res.ok if it was a structured error
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`p-8 md:p-12 rounded-[2.5rem] border transition-all duration-500 group/section shadow-2xl ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]/30 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
      
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border group-hover/section:scale-110 transition-transform duration-500 ${isDark ? 'bg-teal-900/20 border-teal-900/30' : 'bg-teal-50 border-teal-200 shadow-sm'}`}>
            <svg className="w-6 h-6 text-teal-600 dark:text-[#cddfa0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className={`text-3xl md:text-4xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Property Location
          </h2>
        </div>
        <p className={`text-base ml-16 max-w-xl font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Pin the exact location on the map to help buyers explore the neighborhood.
        </p>
      </div>

      <div className="space-y-6">
        <div className="relative">
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search location (Division, District, or Area)..." 
              className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all ${isDark ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500' : 'border-slate-200 bg-white text-slate-900 focus:border-teal-500 shadow-inner'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            />
            <button 
              type="button"
              onClick={handleSearch}
              disabled={isSearching}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black rounded-xl transition shadow-lg shadow-teal-500/20 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {/* SUGGESTIONS DROPDOWN */}
          {suggestions.length > 0 && (
            <div className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl z-[1000] overflow-hidden ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40] text-slate-200' : 'bg-white border-slate-100 text-slate-700'}`}>
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className={`w-full text-left px-6 py-4 text-sm transition-colors border-b last:border-none ${isDark ? 'border-[#1a4a40]/30 hover:bg-[#1a4a40]/50' : 'border-slate-50 hover:bg-slate-50'}`}
                >
                  <p className="font-bold truncate">{s.display_name}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={`rounded-2xl overflow-hidden border-4 h-[400px] relative z-0 ${isDark ? 'border-slate-700' : 'border-slate-100 shadow-inner'}`}>
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={position} />
            <MapClickHandler updateLocation={updateLocation} />
          </MapContainer>
        </div>

        <div className="space-y-3">
          <label className={`text-xs font-black uppercase tracking-widest ml-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Detailed Address</label>
          <textarea 
            rows="3" 
            placeholder="Exact address will appear here automatically..." 
            className={`w-full px-5 py-4 rounded-2xl border-2 outline-none focus:ring-4 focus:ring-teal-500/10 transition-all resize-none ${isDark ? 'border-slate-700 bg-slate-800 text-white focus:border-blue-500' : 'border-slate-200 bg-white text-slate-900 focus:border-teal-500 shadow-inner'}`}
            value={formData.address || addressDetails}
            onChange={(e) => updateField('address', e.target.value)}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Detected District</label>
              <input 
                type="text" 
                readOnly
                value={formData.district || ""}
                className={`w-full px-4 py-2 mt-1 rounded-lg border-2 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
              />
            </div>
            <div className="flex-1">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Coordinates</label>
              <input 
                type="text" 
                readOnly
                value={`${formData.location.latitude.toFixed(4)}, ${formData.location.longitude.toFixed(4)}`}
                className={`w-full px-4 py-2 mt-1 rounded-lg border-2 ${isDark ? 'border-slate-700 bg-slate-900 text-slate-400' : 'border-slate-100 bg-slate-50 text-slate-600'}`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocation;