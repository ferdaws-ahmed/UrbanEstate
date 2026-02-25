"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { X, Heart, Undo2, Fingerprint, Sparkles, MapPin, BedDouble, Bath, Maximize, ArrowRight } from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


const localProperties = [
  { id: 1, title: "Azure Skyline Villa", price: "$2.5M", location: "Beverly Hills, CA", beds: 4, baths: 3, size: "3,200 sqft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Emerald Mansion", price: "$1.8M", location: "Miami, FL", beds: 5, baths: 4, size: "4,100 sqft", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Golden Gate Residence", price: "$3.2M", location: "San Francisco, CA", beds: 3, baths: 2, size: "2,800 sqft", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Waterfront Estate", price: "$950K", location: "Seattle, WA", beds: 4, baths: 3, size: "3,000 sqft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Urban Smart Hub", price: "$4.1M", location: "New York, NY", beds: 2, baths: 2, size: "1,800 sqft", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Minimalist Glass", price: "$1.2M", location: "Austin, TX", beds: 3, baths: 2, size: "2,400 sqft", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Vintage Royal", price: "$5.5M", location: "London, UK", beds: 6, baths: 5, size: "5,500 sqft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Modern Eco Retreat", price: "$2.1M", location: "Denver, CO", beds: 4, baths: 3, size: "3,500 sqft", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80" },
  { id: 9, title: "Grand Central Loft", price: "$3.8M", location: "Chicago, IL", beds: 2, baths: 1, size: "1,500 sqft", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
  { id: 10, title: "Serene Pine Villa", price: "$1.5M", location: "Portland, OR", beds: 3, baths: 2, size: "2,600 sqft", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
  { id: 11, title: "Ivory Coast Manor", price: "$6.2M", location: "Malibu, CA", beds: 7, baths: 6, size: "7,000 sqft", image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80" }, // এই ইমেজটি ফিক্স করা হয়েছে
  { id: 12, title: "Midnight Penthouse", price: "$8.5M", location: "Las Vegas, NV", beds: 4, baths: 4, size: "4,800 sqft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" },
  { id: 13, title: "Desert Oasis", price: "$2.9M", location: "Phoenix, AZ", beds: 5, baths: 4, size: "4,000 sqft", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80" },
  { id: 14, title: "Lakeside Cabin", price: "$1.1M", location: "Lake Tahoe, CA", beds: 3, baths: 2, size: "2,200 sqft", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
  { id: 15, title: "Skyhigh Apartment", price: "$4.5M", location: "Boston, MA", beds: 3, baths: 3, size: "2,900 sqft", image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=800&q=80" },
];

export default function SwipeDeck() {
  const [index, setIndex] = useState(0);
  const [saved, setSaved] = useState([]);
  
  // Framer Motion Values for dragging

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacityRight = useTransform(x, [50, 150], [0, 1]);
  const opacityLeft = useTransform(x, [-50, -150], [0, 1]);
  const backgroundScale = useTransform(x, [-200, 0, 200], [1, 0.95, 1]);

  const current = localProperties[index];
  const nextCard = localProperties[index + 1];

  const handleSwipe = (direction) => {
    if (direction === "right") {
      setSaved((prev) => [...prev, current]);
    }

    setIndex((prev) => Math.min(prev + 1, localProperties.length));
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      handleSwipe("right");
    } else if (info.offset.x < -100) {
      handleSwipe("left");
    }
  };

  const undoSwipe = () => {
    if (index > 0) {
      setIndex(index - 1);
      setSaved((prev) => prev.filter(p => p.id !== localProperties[index - 1].id));
    }
  };

  if (!current && localProperties.length > 0) {
    return (
      <section className={`w-full py-24 px-6 bg-[#0f2e28] text-white flex flex-col items-center justify-center min-h-[80vh] ${manrope.className}`}>
        <Sparkles size={64} className="text-[#cddfa0] mb-6 animate-bounce" />
        <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">You're All Caught Up!</h2>
        <p className="text-white/60 mb-10 text-lg">We'll notify you when new properties match your profile.</p>
        <button onClick={() => {setIndex(0); setSaved([]);}} className="bg-[#cddfa0] text-[#0f2e28] px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(205,223,160,0.3)]">
          Restart Matchmaker
        </button>
      </section>
    );
  }

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] overflow-hidden relative min-h-screen flex flex-col justify-center ${manrope.className}`}>
      
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#cddfa0]/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Header & Info */}
        <div className="lg:col-span-5 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-6">
            <Fingerprint size={14} /> AI Property Match
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
            Discover Your <br /> <span className="text-[#cddfa0] italic font-light">Dream Home</span>
          </h2>
          <p className="text-white/60 font-medium text-lg mb-10 max-w-md mx-auto lg:mx-0">
            Swipe right to shortlist properties you love, or swipe left to pass. You can also skip to the next property directly.
          </p>

          {/* Desktop Controls (With Arrow Right) */}
          <div className="hidden lg:flex items-center gap-5">
            <button onClick={() => handleSwipe("left")} className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/50 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/50 hover:scale-110 transition-all shadow-xl group">
              <X size={28} strokeWidth={3} className="group-active:scale-90 transition-transform" />
            </button>
            
            <button onClick={undoSwipe} disabled={index === 0} className={`w-12 h-12 flex items-center justify-center rounded-full transition-all shadow-xl ${index === 0 ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5' : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110 active:scale-95'}`}>
              <Undo2 size={20} strokeWidth={2.5} />
            </button>
            
            <button onClick={() => handleSwipe("right")} className="w-16 h-16 flex items-center justify-center bg-[#cddfa0]/10 border border-[#cddfa0]/30 rounded-full text-[#cddfa0] hover:bg-[#cddfa0] hover:text-[#0f2e28] hover:scale-110 transition-all shadow-[0_0_20px_rgba(205,223,160,0.2)] group">
              <Heart size={28} strokeWidth={3} fill="currentColor" className="group-active:scale-90 transition-transform" />
            </button>

            {/* New Skip/Next Arrow Button */}
            <button onClick={() => handleSwipe("skip")} className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:text-white hover:scale-110 transition-all shadow-xl group ml-2">
              <ArrowRight size={24} strokeWidth={3} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Right Side: Card Deck Area */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="relative h-[550px] w-full max-w-[420px] perspective-1000">
            
            <AnimatePresence mode="popLayout">
              {current && (
                <>
                  {/* Next Card (Background) */}
                  {nextCard && (
                    <motion.div
                      key={`next-${nextCard.id}`}
                      style={{ scale: backgroundScale }}
                      initial={{ y: 20, opacity: 0.4 }}
                      animate={{ y: 20, opacity: 0.6 }}
                      className="absolute inset-0 bg-[#13332c] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
                    >
                      <img src={nextCard.image} alt={nextCard.title} className="w-full h-full object-cover grayscale-[50%]" />
                    </motion.div>
                  )}

                  {/* Current Card (Foreground Interactive) */}
                  <motion.div
                    key={`current-${current.id}`}
                    style={{ x, rotate }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={handleDragEnd}
                    initial={{ scale: 1, y: 0, opacity: 1 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
                    whileDrag={{ scale: 1.02, cursor: "grabbing" }}
                    className="absolute inset-0 bg-[#13332c] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] border border-white/10 cursor-grab touch-none z-20 group"
                  >
                    <img src={current.image} alt={current.title} className="w-full h-full object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105" />
                    
                    {/* Card Content Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e28] via-[#0f2e28]/80 to-transparent pointer-events-none flex flex-col justify-end p-8">
                      <div className="flex items-center gap-2 text-white/80 mb-2 text-xs font-bold uppercase tracking-widest">
                        <MapPin size={14} className="text-[#cddfa0]" /> {current.location}
                      </div>
                      <h4 className="text-3xl font-black text-white mb-1 leading-tight drop-shadow-lg">{current.title}</h4>
                      <div className="text-2xl font-black text-[#cddfa0] mb-5 drop-shadow-lg">{current.price}</div>
                      
                      {/* Features Row */}
                      <div className="flex items-center justify-between border-t border-white/10 pt-4">
                        <div className="flex flex-col items-center gap-1">
                          <BedDouble size={18} className="text-white/40" />
                          <span className="text-[10px] text-white font-bold uppercase">{current.beds} Beds</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                          <Bath size={18} className="text-white/40" />
                          <span className="text-[10px] text-white font-bold uppercase">{current.baths} Baths</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                          <Maximize size={18} className="text-white/40" />
                          <span className="text-[10px] text-white font-bold uppercase">{current.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Swipe Indicators (LIKE / PASS) */}
                    <motion.div style={{ opacity: opacityRight }} className="absolute top-12 left-8 border-4 border-[#cddfa0] text-[#cddfa0] bg-[#0f2e28]/50 backdrop-blur-sm px-6 py-2 rounded-2xl text-4xl font-black uppercase tracking-widest transform -rotate-12 pointer-events-none shadow-2xl">
                      SAVE
                    </motion.div>
                    <motion.div style={{ opacity: opacityLeft }} className="absolute top-12 right-8 border-4 border-red-500 text-red-500 bg-[#0f2e28]/50 backdrop-blur-sm px-6 py-2 rounded-2xl text-4xl font-black uppercase tracking-widest transform rotate-12 pointer-events-none shadow-2xl">
                      PASS
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Controls (Visible only on small screens) */}
          <div className="flex lg:hidden justify-center items-center gap-4 mt-10 relative z-20">
            <button onClick={() => handleSwipe("left")} className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/50 shadow-xl active:scale-90 transition-transform">
              <X size={24} strokeWidth={3} />
            </button>
            <button onClick={undoSwipe} disabled={index === 0} className={`w-10 h-10 flex items-center justify-center rounded-full shadow-xl active:scale-90 transition-transform ${index === 0 ? 'bg-white/5 text-white/20 border border-white/5' : 'bg-white/10 border border-white/20 text-white'}`}>
              <Undo2 size={18} strokeWidth={2.5} />
            </button>
            <button onClick={() => handleSwipe("right")} className="w-14 h-14 flex items-center justify-center bg-[#cddfa0]/10 border border-[#cddfa0]/30 rounded-full text-[#cddfa0] shadow-xl active:scale-90 transition-transform">
              <Heart size={24} strokeWidth={3} fill="currentColor" />
            </button>
            <button onClick={() => handleSwipe("skip")} className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/70 shadow-xl active:scale-90 transition-transform">
              <ArrowRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

      </div>

      {/* Shortlisted Mini-tray (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 w-full bg-[#13332c]/80 backdrop-blur-xl border-t border-white/10 z-30 transition-transform duration-500" style={{ transform: saved.length > 0 ? 'translateY(0)' : 'translateY(100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-6 overflow-x-auto custom-scrollbar">
          <div className="flex-shrink-0 text-white">
            <div className="text-xs font-bold uppercase tracking-widest text-[#cddfa0] mb-1">Shortlisted</div>
            <div className="text-2xl font-black">{saved.length} <span className="text-sm font-medium text-white/50">Properties</span></div>
          </div>
          <div className="w-px h-10 bg-white/10 flex-shrink-0" />
          {saved.map((item, i) => (
            <div key={i} className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-white/20 relative group cursor-pointer shadow-lg">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#0f2e28]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Heart size={16} className="text-[#cddfa0]" fill="currentColor" />
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}