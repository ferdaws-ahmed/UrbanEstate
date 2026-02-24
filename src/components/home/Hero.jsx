"use client";

import React, { useRef, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"; 

// Swiper styles
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
  const [activeIndex, setActiveIndex] = useState(0);
  
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

  // Letter by letter animation variants
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={targetRef} className="relative min-h-[180vh] w-full bg-[#0f2e28]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div style={{ y, scale }} className="relative w-full h-full origin-top">
          <Swiper
            modules={[Autoplay, EffectFade]}
            effect="fade"
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            className="h-full w-full"
          >
            {sliderData.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div 
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                >
                  <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0f2e28]/30 to-[#0f2e28]"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeIndex}`}
              className="flex flex-col items-center max-w-5xl"
            >
              {/* Tagline */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ opacity: useTransform(scrollYProgress, [0, 0.3], [1, 0]) }}
                className="mb-4"
              >
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20 text-[#cddfa0]">
                   <Sparkles size={14} /> Premium Marketplace
                </span>
              </motion.div>
              
              {/* Title with Gradient and Letter Animation */}
              <motion.h1 
                variants={sentence}
                initial="hidden"
                animate="visible"
                style={{ 
                  opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]),
                  y: useTransform(scrollYProgress, [0, 0.4], [0, -30])
                }}
                className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl leading-tight text-white"
              >
                {sliderData[activeIndex].title.split("").map((char, index) => (
                  <motion.span 
                    key={char + "-" + index} 
                    variants={letter}
                    className={index > 6 && index < 14 ? "text-[#cddfa0]" : "text-white"}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              
              {/* Description - Smaller and Cleaner */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.8 }}
                style={{ opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]) }}
                className="text-gray-100 max-w-2xl mx-auto text-base md:text-lg font-medium mb-10 drop-shadow-md"
              >
                {sliderData[activeIndex].desc}
              </motion.p>

              {/* Button */}
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                style={{ opacity: useTransform(scrollYProgress, [0, 0.4], [1, 0]) }}
                className="bg-[#cddfa0] text-[#0f2e28] px-10 py-4 rounded-full font-bold text-base hover:bg-white transition-all shadow-xl flex items-center gap-2 group"
              >
                Explore More <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </section>
  );
}