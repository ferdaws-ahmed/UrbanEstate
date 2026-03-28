"use client";

import React, { useState } from "react";

export default function PropertyGallery({ images = [] }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  const gallery = images.length > 0 ? images : ["/placeholder.jpg"];

  // নিচের স্ট্রিপে ১ থেকে ৩ নম্বর ছবি (index 0, 1, 2)
  const bottomThumbnails = gallery.slice(0, 3); 
  
  // ডান পাশে ৪ নম্বর ছবি থেকে পরের ৩টি (index 3, 4, 5) - ডেস্কটপের জন্য
  const rightThumbnailsDesktop = gallery.slice(3, 6);
  
  // মোবাইলের জন্য ৪ নম্বর ছবি থেকে বাকি সব (index 3+)
  const allThumbnailsMobile = gallery.slice(3);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 relative z-10">
      
      {/* বাম পাশ: মেইন ইমেজ + নিচের ৩টি থাম্বনেইল (9 Columns on Desktop, Full Width on Mobile) */}
      <div className="lg:col-span-9 flex flex-col gap-6">
        
        {/* বড় ইমেজ: এস্পেক্ট রেশিও মোবাইলেও ১৬:৯ রাখা হয়েছে */}
        <div className="relative aspect-video w-full rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#040f0c] shadow-2xl">
          <img 
            src={gallery[selectedImage]} 
            className="w-full h-full object-cover transition-all duration-500 ease-out" 
            alt="Main Asset View"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061510]/40 to-transparent pointer-events-none"></div>
          
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
            <span className="bg-black/40 backdrop-blur-md text-[#cddfa0] text-[8px] md:text-[9px] font-mono border border-white/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full tracking-[0.2em] uppercase">
              Unit View 0{selectedImage + 1} // Active
            </span>
          </div>
        </div>

        {/* নিচের ৩টি থাম্বনেইল (মোবাইলে ২ বা ৩টি হতে পারে, এখানে ৩টিই রাখা হয়েছে) */}
        <div className="grid grid-cols-3 gap-4">
          {bottomThumbnails.map((img, i) => (
            <button 
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`relative aspect-video rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                selectedImage === i 
                ? "border-[#cddfa0] scale-[0.98] shadow-lg" 
                : "border-white/5 opacity-40 hover:opacity-100"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`} />
            </button>
          ))}
        </div>
      </div>
      
      {/* ডান পাশ (ডেস্কটপ): ৩টি ইমেজ যা বড় ইমেজের হাইট কভার করবে (3 Columns, Hidden on Mobile) */}
      <div className="hidden lg:col-span-3 lg:flex lg:flex-col lg:gap-4 lg:h-full">
          {rightThumbnailsDesktop.map((img, i) => {
            const actualIndex = i + 3;
            return (
              <button 
                key={i}
                onClick={() => setSelectedImage(actualIndex)}
                className={`relative flex-1 w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                  selectedImage === actualIndex 
                  ? "border-[#cddfa0] scale-[0.98]" 
                  : "border-white/5 opacity-40 hover:opacity-100"
                }`}
              >
                <img src={img} className="w-full h-full object-cover absolute inset-0" alt={`side-${i}`} />
              </button>
            );
          })}

          {/* যদি ইমেজ ৩টির কম থাকে, ডিজাইন ঠিক রাখতে খালি বক্স */}
          {rightThumbnailsDesktop.length < 3 && Array.from({ length: 3 - rightThumbnailsDesktop.length }).map((_, i) => (
            <div key={i} className="flex-1 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"></div>
          ))}
      </div>

      {/* মোবাইলের জন্য অতিরিক্ত ইমেজ (Hidden on Desktop) */}
      {allThumbnailsMobile.length > 0 && (
        <div className="lg:hidden mt-4">
          <h4 className="text-[#cddfa0]/60 text-[10px] uppercase tracking-[0.3em] font-bold mb-3 px-1">Additional Angles</h4>
          {/* স্ক্রলযোগ্য রো (Scrollable Row) */}
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {allThumbnailsMobile.map((img, i) => {
              const actualIndex = i + 3;
              return (
                <button 
                  key={i}
                  onClick={() => setSelectedImage(actualIndex)}
                  className={`relative flex-shrink-0 w-28 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    selectedImage === actualIndex 
                    ? "border-[#cddfa0] scale-[0.98]" 
                    : "border-white/5 opacity-40 hover:opacity-100"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`mobile-thumb-${i}`} />
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}