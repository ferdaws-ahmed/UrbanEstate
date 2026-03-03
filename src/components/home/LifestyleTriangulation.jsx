"use client";

import React, { useCallback, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, Circle, Tooltip } from "react-leaflet";
import L from "leaflet";



export default function LifestyleTriangulation() {

  const initialCenter = { lat: 23.7949, lng: 90.4043 };

  // Initial marker positions 
  const [markers, setMarkers] = useState([
    { id: "office", label: "My Office", lat: 23.7958, lng: 90.4043, color: "#1e40af" },
    { id: "partner", label: "Partner's Office", lat: 23.7939, lng: 90.4085, color: "#047857" },
    { id: "school", label: "Kid's School", lat: 23.7925, lng: 90.4012, color: "#b91c1c" },
  ]);

  // property data 
  const properties = useMemo(() => [
    { id: 1, title: "Gulshan Apartment", price: "$250,000", lat: 23.7975, lng: 90.405, image: "https://images.unsplash.com/photo-1560185007-5c3b5f9f7b35?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Banani Condo", price: "$350,000", lat: 23.7960, lng: 90.410, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Dhanmondi House", price: "$420,000", lat: 23.7918, lng: 90.402, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Uttara Villa", price: "$550,000", lat: 23.8100, lng: 90.4105, image: "https://images.unsplash.com/photo-1505691723518-36a3ce3f1d63?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Bashundhara Plot", price: "$180,000", lat: 23.780, lng: 90.410, image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=800&auto=format&fit=crop" },
    { id: 6, title: "Mirpur Flat", price: "$120,000", lat: 23.8105, lng: 90.380, image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=800&auto=format&fit=crop" },
    { id: 7, title: "Road 11 Apartment", price: "$300,000", lat: 23.7965, lng: 90.4025, image: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=800&auto=format&fit=crop" },
    { id: 8, title: "Lakeside Home", price: "$480,000", lat: 23.789, lng: 90.395, image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&auto=format&fit=crop" },
    { id: 9, title: "Compact Studio", price: "$95,000", lat: 23.7940, lng: 90.398, image: "https://images.unsplash.com/photo-1505691723518-36a3ce3f1d63?q=80&w=800&auto=format&fit=crop" },
    { id: 10, title: "Riverside Bungalow", price: "$650,000", lat: 23.7995, lng: 90.412, image: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?q=80&w=800&auto=format&fit=crop" },
  ], []);

  // Utility: create a small colored div icon for markers
  const createDivIcon = useCallback((color, label) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div style="display:flex;align-items:center;gap:8px"><div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color}"></div><div style="font-size:12px;color:#033;">${label}</div></div>`,
      iconSize: [120, 24],
      iconAnchor: [12, 12],
    });
  }, []);

  // Update marker position in state during drag (real-time)
  const handleMarkerDrag = (id, latlng) => {
    setMarkers((prev) => prev.map((m) => (m.id === id ? { ...m, lat: latlng.lat, lng: latlng.lng } : m)));
  };

  // Compute triangle polygon coordinates from markers
  const triangleLatLngs = useMemo(() => markers.map((m) => [m.lat, m.lng]), [markers]);

  const centroid = useMemo(() => {
    const lat = (markers[0].lat + markers[1].lat + markers[2].lat) / 3;
    const lng = (markers[0].lng + markers[1].lng + markers[2].lng) / 3;
    return { lat, lng };
  }, [markers]);

  // Haversine formula to compute distance between two lat/lng points in meters
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (v) => (v * Math.PI) / 180;
    const R = 6371000; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Filter properties within 2000 meters of centroid
  const radiusMeters = 2000;
  const filtered = useMemo(() => {
    return properties
      .map((p) => ({ ...p, distance: Math.round(haversineDistance(centroid.lat, centroid.lng, p.lat, p.lng)) }))
      .filter((p) => p.distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance);
  }, [properties, centroid]);

  return (
    <div className="w-full py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Map */}
        <div className="h-[640px] rounded-lg overflow-hidden border">
          <MapContainer center={[initialCenter.lat, initialCenter.lng]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

            {/* Draggable markers */}
            {markers.map((m) => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                draggable={true}
                icon={createDivIcon(m.color, m.label)}
                eventHandlers={{
                
                  drag: (e) => {
                    const latlng = e.target.getLatLng();
                    handleMarkerDrag(m.id, latlng);
                  },
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <strong>{m.label}</strong>
                    <div>
                      {m.lat.toFixed(5)}, {m.lng.toFixed(5)}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Triangle polygon connecting the three markers */}
            <Polygon positions={triangleLatLngs} pathOptions={{ color: "#2563eb", fillOpacity: 0.05 }} />

            {/* Centroid marker (Ideal Location) */}
            <Marker
              position={[centroid.lat, centroid.lng]}
              icon={L.divIcon({ html: `<div style="width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 30% 30%, #fde68a, #f97316);box-shadow:0 0 12px 6px rgba(249,115,22,0.25)"></div>`, className: "", iconSize: [18, 18], iconAnchor: [9, 9] })}
            >
              <Tooltip direction="top">Ideal Location (Centroid)</Tooltip>
            </Marker>

            {/* Circle around centroid (2 km) */}
            <Circle center={[centroid.lat, centroid.lng]} radius={radiusMeters} pathOptions={{ color: "#f97316", dashArray: "6" }} />
          </MapContainer>
        </div>

        {/* RIGHT: Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold">Properties near your ideal location</h3>
            <div className="text-sm text-gray-600">Radius: 2 km</div>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 rounded-lg border border-dashed border-gray-200 text-center text-gray-600">
              No properties found in this ideal zone. Try dragging the markers!
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="flex gap-4 items-center bg-white border rounded-lg p-3 shadow-sm">
                  <img src={p.image} alt={p.title} className="w-24 h-20 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-sm text-gray-600">{p.price}</div>
                    <div className="text-sm text-gray-500 mt-1">{p.distance} m from ideal location</div>
                  </div>
                  <div>
                    <button className="px-3 py-1 bg-[#0f2e28] text-white rounded">View</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
