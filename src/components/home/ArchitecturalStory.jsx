"use client";

import React, { useState } from "react";
import { Manrope } from "next/font/google";
import { PenTool, Layers, Cuboid, Gem, ChevronRight } from "lucide-react";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });


const storyChapters = [
  {
    id: 1,
    title: "The Genesis Vision",
    subtitle: "Philosophy beyond concrete.",
    icon: <PenTool size={20} />,
    desc: "Conceptualized not just as a structure, but as a living organism designed to breathe with the environment. The core idea was 'Biophilic Futurism'.",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1600&auto=format&fit=crop" // Blueprint/Sketch image
  },
  {
    id: 2,
    title: "Rare Earth Foundations",
    subtitle: "Unshakable core.",
    icon: <Cuboid size={20} />,
    desc: "Anchored deep using advanced geo-polymer piling that strengthens over time, adapting to sub-surface shifts rather than resisting them.",
    image: "https://theartisaninterior.com/wp-content/uploads/2024/01/artisan-19.jpeg" // Foundation/Concrete texture
  },
  {
    id: 3,
    title: "The Smart-Skin Facade",
    subtitle: "Responsive exterior.",
    icon: <Layers size={20} />,
    desc: "Wrapped in a dynamic glass exoskeleton that adjusts tint based on UV intensity, regulating internal temperature without energy usage.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1600&auto=format&fit=crop" // Modern facade/glass
  },
  {
    id: 4,
    title: "Artisan Interior Details",
    subtitle: "Curated perfection.",
    icon: <Gem size={20} />,
    desc: "Interiors feature imported Italian Carrara marble and sustainable bamboo accents, hand-finished by master craftsmen for flawless luxury.",
    image: "https://mgdesignsinteriors.co.uk/cdn/shop/collections/artisan_large_dining_table.jpg?v=1731863254" // Luxury marble texture
  }
];

export default function ArchitecturalOriginStory() {
  const [activeChapter, setActiveChapter] = useState(storyChapters[0]);

  return (
    <section className={`w-full py-28 px-6 lg:px-12 bg-[#0f2e28] relative overflow-hidden ${manrope.className}`}>
      
      {/* Background Blueprint Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/blueprint-grid.png')] opacity-10 pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#cddfa0]/5 blur-[180px] rounded-full pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20">
           <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-[#cddfa0]/20 mb-6 shadow-[0_0_15px_rgba(205,223,160,0.1)]">
            <PenTool size={14} /> The Blueprint Narrative
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.1]">
            Architectural <span className="text-[#cddfa0] italic font-light">Origin Story</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left: Interactive Timeline (5 Cols) */}
          <div className="lg:col-span-5 relative pl-8">
            
            {/* Glowing Vertical Timeline Bar */}
            <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-white/10">
              <div 
                className="absolute top-0 w-0.5 bg-[#cddfa0] shadow-[0_0_15px_#cddfa0] transition-all duration-700 ease-in-out"
                style={{ height: `${(activeChapter.id / storyChapters.length) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-8">
              {storyChapters.map((chapter) => (
                <div 
                  key={chapter.id}
                  onMouseEnter={() => setActiveChapter(chapter)}
                  className={`relative group cursor-pointer transition-all duration-300 pl-6 ${activeChapter.id === chapter.id ? 'scale-105' : 'opacity-50 hover:opacity-80'}`}
                >
                  {/* Timeline Node Indicator */}
                  <div className={`absolute -left-[33px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${activeChapter.id === chapter.id ? 'bg-[#0f2e28] border-[#cddfa0] shadow-[0_0_20px_#cddfa0] text-[#cddfa0]' : 'bg-[#0f2e28] border-white/20 text-white/40'}`}>
                    {activeChapter.id === chapter.id ? chapter.icon : <div className="w-2 h-2 bg-white/40 rounded-full"></div>}
                  </div>

                  {/* Chapter Text */}
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 block ${activeChapter.id === chapter.id ? 'text-[#cddfa0]' : 'text-white/40'}`}>
                      Chapter 0{chapter.id}
                    </span>
                    <h3 className={`text-2xl font-black mb-2 transition-colors ${activeChapter.id === chapter.id ? 'text-white' : 'text-white/60'}`}>
                      {chapter.title}
                    </h3>
                     {/* Expandable Details for Active Item (Mobile friendly approach) */}
                     <div className={`lg:hidden overflow-hidden transition-all duration-500 ${activeChapter.id === chapter.id ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                        <p className="text-white/60 text-sm leading-relaxed border-l-2 border-[#cddfa0]/30 pl-4">
                          {chapter.desc}
                        </p>
                     </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Dynamic Visual Presentation (7 Cols) */}
          <div className="lg:col-span-7 hidden lg:block relative h-[500px]">
            
            {storyChapters.map((chapter) => (
              <div 
                key={chapter.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${activeChapter.id === chapter.id ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-12 scale-95 pointer-events-none'}`}
              >
                {/* Glassmorphism Content Card */}
                <div className="relative h-full bg-[#081d19]/80 backdrop-blur-xl rounded-[2.5rem] border border-[#cddfa0]/20 shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden group">
                  
                  {/* Image Section (Top Half) */}
                  <div className="h-2/3 relative overflow-hidden">
                    <img 
                      src={chapter.image} 
                      alt={chapter.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%]"
                    />
                    <div className="absolute inset-0 bg-[#0f2e28] mix-blend-multiply opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081d19] via-transparent to-transparent"></div>
                    
                    {/* Architectural Overlay Lines */}
                    <div className="absolute inset-0 border-[1px] border-[#cddfa0]/10 m-4 rounded-2xl pointer-events-none"></div>
                    <Crosshair size={30} className="absolute top-8 right-8 text-[#cddfa0]/50 animate-spin-slow" strokeWidth={1} />
                  </div>

                  {/* Text Section (Bottom Half) */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 pb-10">
                     <div className="w-12 h-1 bg-[#cddfa0] mb-6"></div>
                     <h4 className="text-[#cddfa0] font-light italic text-lg mb-3">{chapter.subtitle}</h4>
                     <p className="text-white/70 text-lg leading-relaxed max-w-lg">
                       {chapter.desc}
                     </p>
                     <div className="absolute bottom-6 right-8 text-[#cddfa0]/20">
                       <ChevronRight size={40} />
                     </div>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
       <style dangerouslySetInnerHTML={{__html: `
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
      `}} />
    </section>
  );
}


import { Crosshair } from "lucide-react";