'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Leaflet components dynamic import (SSR fix)
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });

/**
 * Map Click Logic: Map er vitor click korle marker move korbe
 */
function MapClickHandler({ setPosition }) {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

const PropertyLocation = () => {
  const [position, setPosition] = useState([23.8103, 90.4125]); // Default: Dhaka
  const [searchQuery, setSearchQuery] = useState("");
  const [addressDetails, setAddressDetails] = useState(null);
  const mapRef = useRef(null);

  // Leaflet Marker Icon Fix (Next.js e icon na dekhale eta dorkar)
  useEffect(() => {
    const L = require('leaflet');
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    });
  }, []);

  // Location details fetch function (Address reverse geocoding)
  const fetchAddress = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      setAddressDetails(data.display_name);
    } catch (err) {
      console.error("Address fetch failed", err);
    }
  };

  // Position change hole address update hobe
  useEffect(() => {
    fetchAddress(position[0], position[1]);
  }, [position]);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const newPos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPos);
        mapRef.current?.flyTo(newPos, 16);
      }
    } catch (err) {
      alert("Location not found!");
    }
  };

  return (
    <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Property Location</h2>
        <p className="text-slate-500 dark:text-slate-400">Search an address or click on the map to pin the location.</p>
      </div>

      <div className="space-y-6">
        {/* Search Input Area */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search e.g. Gulshan, Dhaka..." 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
            />
          </div>
          <button 
            type="button" 
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
          >
            Search
          </button>
        </div>

        {/* The Interactive Map */}
        <div className="h-[400px] w-full rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 z-0 relative shadow-inner">
          <MapContainer 
            center={position} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%' }}
            ref={mapRef}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapClickHandler setPosition={setPosition} />
            <Marker position={position} />
          </MapContainer>
        </div>

        {/* Selected Location Details Panel */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in duration-500">
          <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
             <span className="font-bold text-sm uppercase tracking-wider">Pinned Location Details</span>
          </div>
          
          <div className="space-y-3">
             <div className="flex flex-col">
                <span className="text-xs text-slate-400">Exact Address:</span>
                <p className="text-slate-700 dark:text-slate-200 font-medium line-clamp-2">
                   {addressDetails ? addressDetails : "Fetching address..."}
                </p>
             </div>
             <div className="flex gap-4 text-xs font-mono text-slate-500">
                <span>LAT: {position[0].toFixed(6)}</span>
                <span>LNG: {position[1].toFixed(6)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyLocation;