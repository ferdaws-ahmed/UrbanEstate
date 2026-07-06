"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

const locationCache = {};

export default function LocationName({ lat, lon, full = false, fallback = "Unknown Location", className = "" }) {
  const [address, setAddress] = useState("Loading...");
  const router = useRouter();

  useEffect(() => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
        setAddress(fallback);
        return;
    }

    const cacheKey = `${latitude},${longitude}_${full}`;
    if (locationCache[cacheKey]) {
      setAddress(locationCache[cacheKey]);
      return;
    }

    const fetchAddress = async () => {
      try {
        const response = await fetch(`/api/geocode?lat=${latitude}&lon=${longitude}&full=${full}&fallback=${encodeURIComponent(fallback)}`);
        const data = await response.json();
        
        if (data && data.address) {
          locationCache[cacheKey] = data.address;
          setAddress(data.address);
        } else {
          setAddress(fallback);
        }
      } catch (err) {
        setAddress(fallback);
      }
    };

    fetchAddress();
  }, [lat, lon, full, fallback]);

  const handleLocationClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (lat && lon) {
      router.push(`/dashboard/seller/map?lat=${lat}&lon=${lon}`);
    }
  };

  return (
    <button 
      onClick={handleLocationClick}
      className={`group flex items-center gap-1.5 text-inherit hover:text-teal-600 transition-colors text-left ${className}`}
      title="View on Map"
    >
      <MapPin size={12} className="shrink-0 text-teal-600 group-hover:scale-110 transition-transform" />
      <span className="border-b border-transparent group-hover:border-teal-600/30">{address}</span>
    </button>
  );
}

