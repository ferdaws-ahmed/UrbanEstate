"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function TopPerformingCard({ listing }) {
  const { isDark } = useTheme();

  if (!listing) {
    return (
      <div
        className={`rounded-2xl border p-6 text-center text-sm ${
          isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80 text-slate-400" : "border-slate-100 bg-white text-slate-500"
        }`}
      >
        এখনো কোনো টপ লিস্টিং নেই।
      </div>
    );
  }

  const img =
    Array.isArray(listing.images) && listing.images[0]
      ? listing.images[0]
      : "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&w=800";

  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price || 0);

  return (
    <div
      className={`rounded-2xl border overflow-hidden shadow-sm ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image src={img} alt="" fill className="object-cover" sizes="(max-width:768px) 100vw, 400px" />
        <button
          type="button"
          className="absolute top-3 right-3 rounded-full bg-white/90 p-2 text-red-500 shadow"
          aria-label="Favorite"
        >
          <Heart className="h-4 w-4 fill-current" />
        </button>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 dark:text-[#cddfa0]">
          Top-Performing Listing
        </p>
        <h4 className="mt-1 text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
          {listing.title}
        </h4>
        <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{price}</p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <span className="font-semibold text-teal-600 dark:text-[#cddfa0]">{listing.views ?? 0}</span> views
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" /> {listing.area ?? 0} sqft
          </span>
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" /> {listing.bedrooms ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" /> {listing.bathrooms ?? 0}
          </span>
        </div>
        <Link
          href={`/propertydetails/${listing._id}`}
          className="mt-4 inline-block text-sm font-semibold text-teal-600 hover:underline dark:text-[#cddfa0]"
        >
          View listing →
        </Link>
      </div>
    </div>
  );
}
