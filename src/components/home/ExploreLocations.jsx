"use client";

import React, { useState, useEffect } from "react";
import { Manrope } from "next/font/google";
import { MapPin, ArrowRight, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const allLocations = [
  // --- Slide 1: Bangladesh & South Asia ---
  { id: 1, name: "Gulshan, Dhaka", subtitle: "250+ Premium Villas", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80" },
  { id: 2, name: "Banani, Dhaka", subtitle: "180+ Apartments", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 3, name: "Dhanmondi", subtitle: "150+ Family Homes", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: 4, name: "Bashundhara", subtitle: "200+ Smart Homes", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { id: 5, name: "Uttara", subtitle: "120+ Eco Houses", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80" },

  // --- Slide 2: USA Top Cities ---
  { id: 6, name: "Manhattan, NYC", subtitle: "320+ Penthouses", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=80" },
  { id: 7, name: "Beverly Hills, CA", subtitle: "280+ Mansions", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" },
  { id: 8, name: "Miami Beach, FL", subtitle: "400+ Ocean Condos", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
  { id: 9, name: "Seattle, WA", subtitle: "150+ Lake Villas", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80" },
  { id: 10, name: "Austin, TX", subtitle: "210+ Modern Homes", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80" },

  // --- Slide 3: European Charm ---
  { id: 11, name: "London, UK", subtitle: "190+ Townhouses", image: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?auto=format&fit=crop&w=1200&q=80" },
  { id: 12, name: "Paris, France", subtitle: "140+ Historic Lofts", image: "https://images.stockcake.com/public/b/e/b/beb0bbfe-ed8b-4e22-b19e-d7e5cf42cc75_large/luxurious-penthouse-interior-stockcake.jpg" },
  { id: 13, name: "Rome, Italy", subtitle: "110+ Classic Villas", image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80" },
  { id: 14, name: "Berlin, Germany", subtitle: "160+ Urban Spaces", image: "https://d16yta572p663f.cloudfront.net/aaeed6_4ddd63b7357e48198b226de7bfc9d404_mv2_b1302ded86.webp" },
  { id: 15, name: "Zurich, Swiss", subtitle: "220+ Alpine Homes", image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=800&q=80" },

  // --- Slide 4: Asia & Middle East ---
  { id: 16, name: "Dubai, UAE", subtitle: "175+ Sky Villas", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80" },
  { id: 17, name: "Singapore", subtitle: "130+ Smart Condos", image: "https://images.unsplash.com/photo-1537726235470-8504e3beef77?auto=format&fit=crop&w=800&q=80" },
  { id: 18, name: "Tokyo, Japan", subtitle: "195+ Zen Houses", image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?auto=format&fit=crop&w=800&q=80" },
  { id: 19, name: "Bali, Indonesia", subtitle: "240+ Tropical Estates", image: "https://t3.ftcdn.net/jpg/06/40/20/36/360_F_640203660_wenCIEZQKF2Ngkk3sPv09NMjH56foij8.jpg" },
  { id: 20, name: "Phuket, Bali", subtitle: "115+ Beach Retreats", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=80" },

  // --- Slide 5: Island & Coastal ---
  { id: 21, name: "Malibu, CA", subtitle: "150+ Beachfronts", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
  { id: 22, name: "Santorini, Greece", subtitle: "120+ White Villas", image: "https://d2wvbk3xnmewoc.cloudfront.net/wp-content/uploads/2022/09/exterior-night-1341x950-1.jpg" },
  { id: 23, name: "Maldives", subtitle: "90+ Water Bungalows", image: "https://hxqhzmgqafszcbbrrghl.supabase.co/storage/v1/object/public/project-images/1768519165606-0-asdasdas.webp" },
  { id: 24, name: "Fiji Islands", subtitle: "85+ Private Resorts", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=80" },
  { id: 25, name: "Bora Bora", subtitle: "110+ Lagoon Homes", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" },

  // --- Slide 6: Mountains & Nature ---
  { id: 26, name: "Aspen, CO", subtitle: "180+ Ski Chalets", image: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?auto=format&fit=crop&w=1200&q=80" },
  { id: 27, name: "Banff, Canada", subtitle: "140+ Mountain Cabins", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
  { id: 28, name: "Swiss Alps", subtitle: "160+ Luxury Lodges", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80" },
  { id: 29, name: "Queenstown", subtitle: "130+ Scenic Retreats", image: "https://images.splitshire.com/full/A-Nighttime-View-of-Modern-Home-Lighting_qEZJr.png" },
  { id: 30, name: "Tulum, Mexico", subtitle: "210+ Jungle Villas", image: "https://eycrk5cno2n.exactdn.com/wp-content/uploads/2022/02/The-Importance-of-High-Quality-Real-Estate-Photos-v3.jpg" },

  // --- Slide 7: Global Metropolises ---
  { id: 31, name: "Sydney, AUS", subtitle: "230+ Harbour Views", image: "https://media.architecturaldigest.com/photos/68950c75a3d1753e764acef0/master/w_1024%2Cc_limit/14_JeffAndrewsDesign_PhotoCredit_Stephen%2520Busken.jpeg" },
  { id: 32, name: "Toronto, CAN", subtitle: "190+ Urban Condos", image: "https://www.oppeinhome.com/upload/images/ueditor/20220818/10-Best-Luxury-Kitchen-Designs-1.jpg" },
  { id: 33, name: "Cape Town, SA", subtitle: "150+ Coastal Homes", image: "https://images.squarespace-cdn.com/content/v1/556365c4e4b01af401e51263/db9be361-8c94-4618-865f-fc6f7c55bc79/APP_Modern_Twilight-1.jpg" },
  { id: 34, name: "Monaco", subtitle: "80+ Billionaire Pads", image: "https://cdn.home-designing.com/wp-content/uploads/2023/09/round-rug.jpg" },
  { id: 35, name: "Seoul, Japan", subtitle: "260+ Minimalist Flats", image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80" },
];

export default function ExploreLocations() {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5; 
  const totalPages = Math.ceil(allLocations.length / itemsPerPage);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalPages]);


  const handleNextSlide = (e) => {
    e.stopPropagation();
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const currentLocations = allLocations.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0d2b25] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Blurs for Theme */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#cddfa0]/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Section Header - Centered */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-4 backdrop-blur-md">
            <MapPin size={14} /> Prime Neighborhoods
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Explore Popular <span className="text-[#cddfa0] italic font-light">Locations</span>
          </h2>
          <p className="text-white/60 font-medium mt-4 max-w-xl">
            Discover the most sought-after neighborhoods and premium real estate markets around the globe.
          </p>
        </div>

        {/* Bento Grid Layout inside AnimatePresence for sliding effect */}
        <div className="relative min-h-[550px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-6 auto-rows-[250px] absolute inset-0 w-full"
            >
              
              {/* Main Large Card */}
              {currentLocations[0] && (
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="col-span-1 md:col-span-4 lg:col-span-8 row-span-2 relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-2xl"
                >
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 z-10"></div>
                  <img src={currentLocations[0].image} alt={currentLocations[0].name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  
                  <div className="absolute top-6 left-6 z-20">
                    <div className="bg-[#cddfa0] text-[#0f2e28] text-xs px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg">
                      Featured
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-[#0f2e28] via-[#0f2e28]/80 to-transparent z-20 flex justify-between items-end">
                    <div>
                      <h3 className="text-4xl font-black text-white mb-2 tracking-tight">{currentLocations[0].name}</h3>
                      <div className="flex items-center gap-2 text-white/80 font-semibold tracking-wide">
                        <Building2 size={16} className="text-[#cddfa0]" /> {currentLocations[0].subtitle}
                      </div>
                    </div>
                    
                    {/* Arrow Button - Updated with onClick handler */}
                    <button 
                      onClick={handleNextSlide}
                      className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 group-hover:bg-[#cddfa0] group-hover:text-[#0f2e28] group-hover:border-[#cddfa0] transition-all transform group-hover:-rotate-45 relative z-30"
                      aria-label="Next Slide"
                    >
                      <ArrowRight size={24} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Small Cards  */}
              {currentLocations.slice(1).map((loc) => (
                <motion.div 
                  key={loc.id}
                  whileHover={{ y: -5 }}
                  onClick={handleNextSlide}
                  className="col-span-1 md:col-span-2 lg:col-span-4 row-span-1 relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg"
                >
                  <div className="absolute inset-0 bg-[#0f2e28]/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e28] to-transparent opacity-80 z-10"></div>
                  
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  
                  <div className="absolute top-5 right-5 z-20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 uppercase tracking-wider">
                    {loc.subtitle.split(" ")[0]}
                  </div>

                  <div className="absolute bottom-5 left-5 z-20">
                    <h3 className="text-xl font-bold text-white tracking-wide">{loc.name}</h3>
                    <p className="text-xs text-[#cddfa0] mt-1 font-semibold tracking-wider flex items-center gap-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      Explore <ArrowRight size={12} />
                    </p>
                  </div>
                </motion.div>
              ))}
              
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide Indicators (Dots) */}
        <div className="flex justify-center items-center gap-3 mt-12">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`transition-all duration-500 rounded-full ${i === currentPage ? "w-8 h-1.5 bg-[#cddfa0] shadow-[0_0_10px_#cddfa0]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}