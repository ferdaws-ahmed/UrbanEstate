"use client";

import React, { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, useScroll, useTransform, useSpring } from "framer-motion"; 

import "swiper/css";
import "swiper/css/effect-fade";

const sliderData = [
  { 
    id: 1, 
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
    title: "Luxury Beyond Boundaries",
    desc: "Experience the harmony of modern design and urban comfort with our handpicked premium collection."
  },
  { 
    id: 2, 
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    title: "Modern Living Spaces",
    desc: "Discover architectural masterpieces designed for elite lifestyles and sustainable living."
  },
  { 
    id: 3, 
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075",
    title: "Elite Penthouse Suites",
    desc: "Elevate your perspective with breathtaking skyline views from the most prestigious rooftops."
  },
  { 
    id: 4, 
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=2092",
    title: "Panoramic Urban Vistas",
    desc: "Experience unmatched city horizons from the comfort of your high-rise terrace."
  },
  { 
    id: 5, 
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    title: "Architectural Grandeur",
    desc: "Discover estates that blend classical aesthetics with state-of-the-art modern engineering."
  },
  { 
    id: 6, 
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071",
    title: "Smart Eco-Residences",
    desc: "Futuristic living spaces optimized for sustainability, security, and automated luxury."
  }
];

export default function Hero() {
  const targetRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const y = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);
  const scale = useTransform(smoothProgress, [0, 1], [1.1, 0.9]);
  

  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -30]);


  const formatTitle = (title) => {
    const words = title.split(" ");
    if (words.length > 1) {
      words[1] = `<span class="text-[#cddfa0]">${words[1]}</span>`;
    }
    return words.join(" ");
  };

  return (
    <section ref={targetRef} className="relative min-h-[180vh] w-full bg-[#0f2e28]">
      
      
      <style dangerouslySetInnerHTML={{__html: `
        .swiper-slide .anim-el {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.7s ease-out;
        }
        .swiper-slide-active .anim-el {
          opacity: 1;
          transform: translateY(0);
        }
        .swiper-slide-active .delay-1 { transition-delay: 0.3s; }
        .swiper-slide-active .delay-2 { transition-delay: 0.5s; }
        .swiper-slide-active .delay-3 { transition-delay: 0.7s; }
        .swiper-slide-active .delay-4 { transition-delay: 0.9s; }
      `}} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ y, scale }} className="relative w-full h-full origin-top">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="h-full w-full"
          >
            {sliderData.map((slide) => (
              <SwiperSlide key={slide.id}>
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                >
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f2e28]/30 to-[#0f2e28]"></div>
                </div>

                {/* Text Content */}
                <motion.div 
                  style={{ opacity: textOpacity, y: textY }}
                  className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-4"
                >
                  <div className="flex flex-col items-center max-w-5xl">
                    {/* Tagline */}
                    <div className="anim-el delay-1 mb-4">
                      <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20 text-[#cddfa0]">
                        <Sparkles size={14} /> Premium Marketplace
                      </span>
                    </div>
                    
                    {/* Title */}
                    <h1 
                      className="anim-el delay-2 text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight text-white" 
                      dangerouslySetInnerHTML={{ __html: formatTitle(slide.title) }}
                    />
                    
                    {/* Description */}
                    <p className="anim-el delay-3 text-gray-100 max-w-2xl mx-auto text-base md:text-lg font-medium mb-10 drop-shadow-md">
                      {slide.desc}
                    </p>

                    {/* Button */}
                    <div className="anim-el delay-4">
                      <button className="bg-[#cddfa0] text-[#0f2e28] px-10 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-xl flex items-center gap-2 group">
                        Explore More <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
}