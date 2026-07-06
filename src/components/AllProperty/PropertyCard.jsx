"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, ArrowUpRight, Check, Heart } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../Theme/ThemeContext";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function PropertyCard({ property, onToggleCompare, isSelected }) {
  const { isDark } = useTheme();
  const { data: session } = useSession();
  const [favoriteCount, setFavoriteCount] = useState(property?.favoriteCount || 0);

  // সেশন বা প্রপস চেঞ্জ হলে স্টেট আপডেট করা
  useEffect(() => {
    setFavoriteCount(property?.favoriteCount || 0);
  }, [property?.favoriteCount]);

  // ১. ইমেজ হ্যান্ডলিং: ডাটাবেজ থেকে images array চেক করা
  const getImageUrl = () => {
    if (Array.isArray(property?.images) && property.images.length > 0) {
      const firstImg = property.images[0];
      if (typeof firstImg === "string" && firstImg.trim() !== "") {
        return firstImg;
      }
    }
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=60";
  };

  const imageUrl = getImageUrl();

  // ২. প্রাইস ফরম্যাটিং
  const formattedPrice = property?.price?.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative rounded-[2.2rem] overflow-hidden border transition-all duration-300 shadow-xl"
      style={{
        backgroundColor: "var(--card)",
        borderColor: isSelected ? "var(--accent)" : "var(--border)"
      }}
    >
      {/* IMAGE SECTION */}
      <div className="relative h-56 w-full overflow-hidden" style={{ backgroundColor: isDark ? "#1e293b" : "#f1f5f9" }}>
        <Image
          src={imageUrl}
          alt={property?.title || "Property"}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />

        <div className="absolute inset-0 opacity-60 pointer-events-none" style={{ background: isDark ? "linear-gradient(to top, rgba(30,41,59,0.8), transparent, transparent)" : "linear-gradient(to top, rgba(255,255,255,0.8), transparent, transparent)" }} />

        <div className="absolute top-4 left-4 flex gap-2">
          <div className="backdrop-blur-md text-[8px] font-bold px-3 py-1 rounded-full border tracking-widest uppercase" style={{ backgroundColor: isDark ? "rgba(9,152,128,0.9)" : "rgba(9,152,128,1)", color: isDark ? "var(--accent)" : "white", borderColor: "rgba(255,255,255,0.3)" }}>
            {property?.category || "Featured"}
          </div>
        </div>

        {/* Favorite Count Only */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border shadow-lg z-[30]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <Heart size={12} className="text-red-500 fill-red-500" />
            <span className="text-[11px] font-black text-white">{favoriteCount}</span>
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-[15px] truncate transition-colors" style={{ color: "var(--foreground)" }}>
            {property?.title}
          </h3>
          
          {/* COMPARE BUTTON UPDATED WITH SAFETY CHECK */}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation(); // Stops event from bubbling to parent links
              if (typeof onToggleCompare === "function") {
                onToggleCompare(property);
              } else {
                console.error("onToggleCompare is not passed to PropertyCard correctly.");
              }
            }} 
            className="flex items-center gap-2 cursor-pointer outline-none bg-transparent border-none shrink-0 z-10"
          >
            <span className="text-[10px] font-black uppercase tracking-wider transition-colors" style={{ color: isSelected ? "var(--accent)" : "var(--muted-foreground)" }}>
              COMPARE
            </span>
            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200" style={{
              backgroundColor: isSelected ? "var(--accent)" : "var(--card)",
              borderColor: isSelected ? "var(--accent)" : "var(--border)",
              boxShadow: isSelected ? "0 0 10px rgba(205,223,160,0.5)" : "none"
            }}>
              {isSelected && <Check size={14} style={{ color: "var(--primary)" }} strokeWidth={4} />}
            </div>
          </button>
        </div>

        <div className="text-xl font-black mb-5 tracking-tight" style={{ color: "var(--accent)" }}>
          ${formattedPrice}
        </div>

        <div className="flex items-center justify-between border-y py-4 mb-6 px-1" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-col items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <Bed size={14} />
            <span className="text-[9px] font-extrabold uppercase tracking-tighter" style={{ color: "var(--foreground)" }}>
              {property?.bedrooms || 0} Beds
            </span>
          </div>
          
          <div className="w-px h-5" style={{ backgroundColor: "var(--border)" }} />
          
          <div className="flex flex-col items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <Bath size={14} />
            <span className="text-[9px] font-extrabold uppercase tracking-tighter" style={{ color: "var(--foreground)" }}>
              {property?.bathrooms || 0} Baths
            </span>
          </div>
          
          <div className="w-px h-5" style={{ backgroundColor: "var(--border)" }} />
          
          <div className="flex flex-col items-center gap-1" style={{ color: "var(--muted-foreground)" }}>
            <Maximize size={14} />
            <span className="text-[9px] font-extrabold uppercase tracking-tighter" style={{ color: "var(--foreground)" }}>
              {property?.area || 0} Sqft
            </span>
          </div>
        </div>

        <Link href={`/propertydetails/${property?._id}?view=1`} prefetch={true} className="block">
          <div className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border transition-all duration-200 group/btn shadow-lg active:scale-95 cursor-pointer" style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)", borderColor: "rgba(255,255,255,0.1)" }}>
            <span className="group-hover/btn:text-[var(--card-foreground)] transition-colors">View Details</span>
            <ArrowUpRight size={16} className="group-hover/btn:text-[var(--card-foreground)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}
