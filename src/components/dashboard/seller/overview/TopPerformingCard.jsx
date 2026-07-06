"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Maximize, Eye, Trophy, ArrowRight, MapPin, MessageSquare } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import LocationName from "@/src/components/shared/LocationName";

export default function TopPerformingCard({ listing }) {
  const { isDark } = useTheme();

  if (!listing) return null;

  const img =
    Array.isArray(listing.images) && listing.images[0]
      ? listing.images[0]
      : "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&w=800";

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(listing.price || 0).replace("BDT", "৳");

  return (
    <div 
      className="group relative overflow-hidden rounded-[3rem] border p-10 transition-all duration-700 hover:shadow-2xl shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)]"
      style={{ 
        backgroundColor: 'var(--ue-card)', 
        borderColor: 'var(--ue-border)' 
      }}
    >
      {/* Dynamic Animated Background */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-teal-600/5 blur-[100px] transition-all duration-700 group-hover:scale-150"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-3xl font-black tracking-tighter" style={{ color: 'var(--ue-text-main)' }}>
                {listing.title}
              </h3>
              <div className="flex items-center gap-2" style={{ color: 'var(--ue-text-muted)' }}>
                <MapPin className="h-3.5 w-3.5 text-teal-600" />
                <span className="text-xs font-black uppercase tracking-widest">
                  <LocationName lat={listing.location?.latitude} lon={listing.location?.longitude} fallback="Premium Location" />
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-teal-600 dark:text-[#cddfa0]">
                {price}
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1" style={{ color: 'var(--ue-text-muted)' }}>Market Value</p>
            </div>
          </div>

          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-y`} style={{ borderColor: 'var(--ue-border)' }}>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ue-text-muted)' }}>Bedrooms</p>
              <div className="flex items-center gap-2 font-black" style={{ color: 'var(--ue-text-main)' }}>
                <Bed className="h-4 w-4 text-teal-500" />
                <span className="text-sm">{listing.bedrooms} Units</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ue-text-muted)' }}>Bathrooms</p>
              <div className="flex items-center gap-2 font-black" style={{ color: 'var(--ue-text-main)' }}>
                <Bath className="h-4 w-4 text-teal-500" />
                <span className="text-sm">{listing.bathrooms} Units</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ue-text-muted)' }}>Floor Area</p>
              <div className="flex items-center gap-2 font-black" style={{ color: 'var(--ue-text-main)' }}>
                <Maximize className="h-4 w-4 text-teal-500" />
                <span className="text-sm">{listing.area} Sqft</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--ue-text-muted)' }}>Engagement</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-rose-500" title="Favorites">
                  <Heart className="h-4 w-4 fill-current" />
                  <span className="text-sm font-black">{listing.favorites || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-500" title="Views">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-black">{listing.views || 0}</span>
                </div>
                <div className="flex items-center gap-1.5 text-purple-500" title="Comments">
                  <MessageSquare className="h-4 w-4 fill-current" />
                  <span className="text-sm font-black">{listing.commentCount || 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/propertydetails/${listing._id}?view=1`}
              className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                isDark 
                  ? "bg-[var(--card)] text-white hover:bg-[#cddfa0] hover:text-[var(--card)]" 
                  : "bg-slate-900 text-white hover:bg-teal-600 shadow-teal-100"
              }`}
            >
              View Detailed Scan <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="text-[10px] font-black uppercase tracking-widest italic" style={{ color: 'var(--ue-text-muted)' }}>
              * Performance index: Outperforming 85% of peers.
            </p>
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <div className={`relative h-full min-h-[250px] rounded-[2rem] overflow-hidden border-4 transition-all duration-500 ${isDark ? 'border-white/5' : 'border-white shadow-xl'}`}>
            <Image
              src={listing.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"}
              alt="Top Performer"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl">
                  <p className="text-[8px] font-black text-white uppercase tracking-widest">Active Protocol</p>
                  <p className="text-[10px] font-bold text-white/90 truncate">{listing.category} Entry</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



