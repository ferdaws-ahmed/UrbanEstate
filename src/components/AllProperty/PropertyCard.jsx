"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import { useTheme } from "../Theme/ThemeContext";

export default function PropertyCard({ property, onToggleCompare, isSelected }) {
  const { isDark } = useTheme();

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
  const formattedPrice = property?.price 
    ? new Intl.NumberFormat('en-IN').format(property.price) 
    : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`group relative ${isDark ? "bg-[#13332c]" : "bg-white"} 
      rounded-[2.2rem] overflow-hidden border transition-all duration-300 shadow-xl 
      ${isSelected 
        ? "border-[#cddfa0] ring-1 ring-[#cddfa0]/30" 
        : isDark ? "border-white/5 hover:border-[#cddfa0]/40" : "border-slate-200 hover:border-[#cddfa0]/40"
      }`}
    >
      {/* IMAGE SECTION */}
      <div className={`relative h-56 w-full overflow-hidden ${isDark ? "bg-[#1a3d36]" : "bg-slate-100"}`}>
        <Image
          src={imageUrl}
          alt={property?.title || "Property"}
          fill
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          priority={false}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#13332c]/80 via-transparent to-transparent opacity-60 pointer-events-none" />

        <div className="absolute top-4 left-4">
          <div className={`bg-[#0f2e28]/90 backdrop-blur-md text-[#cddfa0] text-[8px] font-bold px-3 py-1 rounded-full border border-white/10 tracking-widest uppercase`}>
            {property?.category || "Featured"}
          </div>
        </div>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className={`font-bold text-[15px] ${isDark ? "text-white" : "text-black"} group-hover:text-[#cddfa0] transition-colors truncate`}>
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
            <span className={`text-[10px] font-black uppercase tracking-wider transition-colors 
              ${isSelected ? "text-[#cddfa0]" : isDark ? "text-white/40 group-hover:text-[#cddfa0]" : "text-black/40 group-hover:text-[#cddfa0]"}`}>
              COMPARE
            </span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 
              ${isSelected 
                ? "bg-[#cddfa0] border-[#cddfa0] shadow-[0_0_10px_rgba(205,223,160,0.5)]" 
                : isDark ? "bg-[#13332c] border-white/20" : "bg-white border-black/20"}`}>
              {isSelected && <Check size={14} className="text-[#0f2e28] stroke-[4]" />}
            </div>
          </button>
        </div>

        <div className="text-xl font-black text-[#cddfa0] mb-5 tracking-tight">
          ${formattedPrice}
        </div>

        <div className={`flex items-center justify-between border-y ${isDark ? "border-white/5" : "border-black/5"} py-4 mb-6 px-1`}>
          <div className={`flex flex-col items-center gap-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
            <Bed size={14} />
            <span className={`text-[9px] ${isDark ? "text-white/80" : "text-black/80"} font-extrabold uppercase tracking-tighter`}>
              {property?.bedrooms || 0} Beds
            </span>
          </div>
          
          <div className={`w-px h-5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
          
          <div className={`flex flex-col items-center gap-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
            <Bath size={14} />
            <span className={`text-[9px] ${isDark ? "text-white/80" : "text-black/80"} font-extrabold uppercase tracking-tighter`}>
              {property?.bathrooms || 0} Baths
            </span>
          </div>
          
          <div className={`w-px h-5 ${isDark ? "bg-white/10" : "bg-black/10"}`} />
          
          <div className={`flex flex-col items-center gap-1 ${isDark ? "text-white/40" : "text-black/40"}`}>
            <Maximize size={14} />
            <span className={`text-[9px] ${isDark ? "text-white/80" : "text-black/80"} font-extrabold uppercase tracking-tighter`}>
              {property?.area || 0} Sqft
            </span>
          </div>
        </div>

        <Link href={`/propertydetails/${property?._id}`} prefetch={true} className="block">
          <div className={`w-full flex items-center justify-center gap-2 ${isDark ? "bg-[#0f2e28]" : "bg-white"} ${isDark ? "text-white" : "text-black"} py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-white/10 transition-all duration-200 group/btn shadow-lg active:scale-95 cursor-pointer`}>
            <span className="group-hover/btn:text-[#cddfa0] transition-colors">View Details</span>
            <ArrowUpRight size={16} className="group-hover/btn:text-[#cddfa0] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}