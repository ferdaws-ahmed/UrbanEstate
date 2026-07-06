"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { 
  Map as MapIcon, 
  Loader2, 
  MapPin, 
  Info,
  Home,
  DollarSign,
  Maximize,
  Heart,
  Eye
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

// We'll use a dynamic import for Leaflet because it needs 'window'
import dynamicImport from "next/dynamic";

const MapContainer = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamicImport(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

export default function SellerMapPage() {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState(null);

  // Get lat/lon from search params
  const targetLat = searchParams.get("lat");
  const targetLon = searchParams.get("lon");

  useEffect(() => {
    // Load Leaflet CSS and icon fix
    import("leaflet").then((leaflet) => {
      setL(leaflet);
      import("leaflet/dist/leaflet.css");
    });

    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/seller/dashboard");
        const data = await res.json();
        if (data && data.listings) {
          const validListings = data.listings.filter(p => 
            p.location && 
            !isNaN(parseFloat(p.location.latitude)) && 
            !isNaN(parseFloat(p.location.longitude))
          );
          setProperties(validListings);
        }
      } catch (error) {
        console.error("Map fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Custom icons
  const icons = useMemo(() => {
    if (!L) return null;
    
    const normalIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color: #0d9488; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);"><div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });

    const highlightedIcon = L.divIcon({
      className: 'custom-div-icon highlighted',
      html: `<div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 10px 15px -3px rgb(239 68 68 / 0.3); animation: bounce 1s infinite alternate;"><div style="background-color: white; width: 10px; height: 10px; border-radius: 50%; transform: rotate(45deg);"></div></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    return { normalIcon, highlightedIcon };
  }, [L]);

  if (loading || !L) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const isTargeted = targetLat && targetLon;
  const initialCenter = isTargeted 
    ? [parseFloat(targetLat), parseFloat(targetLon)]
    : properties.length > 0 
      ? [parseFloat(properties[0].location.latitude), parseFloat(properties[0].location.longitude)]
      : [23.8103, 90.4125];

  const initialZoom = isTargeted ? 15 : 12;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Property Assets Map
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            Visualizing {properties.length} Active Locations
          </p>
        </div>
        {isTargeted && (
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2 animate-pulse">
            <MapPin className="text-red-500" size={18} />
            <span className="text-red-500 text-xs font-black uppercase tracking-wider">Focused Asset Location</span>
          </div>
        )}
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden shadow-2xl transition-all duration-500 ${
        isDark ? "border-white/10 bg-[var(--card)]" : "border-slate-100 bg-white"
      }`}>
        <div className="h-[600px] w-full relative z-10">
          <MapContainer 
            center={initialCenter} 
            zoom={initialZoom} 
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {properties.map((p) => {
              const pLat = parseFloat(p.location.latitude);
              const pLon = parseFloat(p.location.longitude);
              const isMatch = isTargeted && 
                Math.abs(pLat - parseFloat(targetLat)) < 0.0001 && 
                Math.abs(pLon - parseFloat(targetLon)) < 0.0001;

              return (
                <Marker 
                  key={p._id} 
                  position={[pLat, pLon]}
                  icon={isMatch ? icons?.highlightedIcon : icons?.normalIcon}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className={`p-2 min-w-[200px] font-sans ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      <div className="relative h-24 w-full rounded-xl overflow-hidden mb-3">
                        <img 
                          src={p.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"} 
                          className="object-cover h-full w-full"
                          alt=""
                        />
                        <div className="absolute top-2 left-2 bg-teal-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">
                          {p.category}
                        </div>
                        {isMatch && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full animate-pulse">
                            Selected
                          </div>
                        )}
                      </div>
                      <h4 className="font-black text-sm line-clamp-1 mb-1">{p.title}</h4>
                    <p className="text-teal-600 font-black text-xs mb-3">৳ {p.price?.toLocaleString()}</p>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 opacity-70">
                          <Maximize size={10} />
                          <span className="text-[10px] font-bold">{p.area} Sqft</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-70">
                          <Eye size={10} />
                          <span className="text-[10px] font-bold">{p.views || 0} Views</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      </div>

      <div className={`p-6 rounded-[2rem] border flex items-start gap-4 ${
        isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
      }`}>
        <Info className="text-teal-600 shrink-0" size={20} />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Map Instructions: Hover or click on the pinpoint markers to see quick asset summaries. Use the scroll wheel to zoom into specific districts. 
          {isTargeted && " The red marker indicates the property you clicked on."}
        </p>
      </div>

      <style jsx global>{`
        @keyframes bounce {
          from { transform: rotate(-45deg) translate(0, 0); }
          to { transform: rotate(-45deg) translate(5px, -5px); }
        }
        .leaflet-tile-pane {
          filter: none !important;
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          border-radius: 1.5rem;
          padding: 0;
          overflow: hidden;
          background: #ffffff;
          color: #0f172a;
        }
        .dark .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: var(--card);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: #ffffff;
        }
        .dark .custom-leaflet-popup .leaflet-popup-tip {
          background: var(--card);
        }
        .custom-leaflet-popup .leaflet-popup-content {
          margin: 0;
          width: 200px !important;
        }
      `}</style>
    </div>
  );
}

