"use client";

import React, { useEffect, useState } from "react";
import { Manrope } from "next/font/google";
import { Quote, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../Theme/ThemeContext";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const testimonials = [
  { id: 1, name: "Sarah M.", title: "New Homeowner", text: "Found our dream home in record time. The AI suggestions were spot on! Incredible experience.", avatar: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 2, name: "David R.", title: "Property Investor", text: "Smooth experience and excellent communication. The price predictor tool is a game-changer.", avatar: "https://randomuser.me/api/portraits/men/52.jpg" },
  { id: 3, name: "Aisha K.", title: "First-time Buyer", text: "They guided me step-by-step. The space re-imaginer helped me visualize my new apartment perfectly!", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 4, name: "Michael T.", title: "Luxury Client", text: "Top-tier service. The voice search made finding my beachfront villa incredibly effortless and fast.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 5, name: "Elena V.", title: "Tech Enthusiast", text: "I've never seen a real estate platform so advanced. The matchmaking swipe deck is super fun to use.", avatar: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 6, name: "James L.", title: "Architect", text: "As an architect, I appreciate the modern interface and the highly accurate virtual staging tools.", avatar: "https://randomuser.me/api/portraits/men/78.jpg" },
  { id: 7, name: "Sophia W.", title: "Relocating Professional", text: "Moving across the country was stressful, but this platform made finding a new home the easiest part.", avatar: "https://randomuser.me/api/portraits/women/33.jpg" },
  { id: 8, name: "Robert H.", title: "Retired Teacher", text: "Very user-friendly! Even at my age, I found it easy to navigate and find a quiet suburban home.", avatar: "https://randomuser.me/api/portraits/men/66.jpg" },
  { id: 9, name: "Linda C.", title: "Interior Designer", text: "The AI decorator presets are surprisingly accurate to current trends. Highly recommend this site.", avatar: "https://randomuser.me/api/portraits/women/55.jpg" },
  { id: 10, name: "Daniel K.", title: "Real Estate Agent", text: "A phenomenal platform that connects buyers with the future of real estate tech. Truly impressive.", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
];

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 3500); 
    return () => clearInterval(t);
  }, []);
  const { isDark } = useTheme();
  const getCardStyle = (i) => {
    const offset = i - index;
    const isCenter = offset === 0 || (offset === testimonials.length && index === 0);
    const isLeft = offset === -1 || (index === 0 && i === testimonials.length - 1);
    const isRight = offset === 1 || (index === testimonials.length - 1 && i === 0);
    
    if (isCenter) {
      return { x: 0, scale: 1, zIndex: 30, opacity: 1, rotateY: 0 };
    } else if (isLeft) {
      return { x: "-70%", scale: 0.85, zIndex: 20, opacity: 0.3, rotateY: 25 };
    } else if (isRight) {
      return { x: "70%", scale: 0.85, zIndex: 20, opacity: 0.3, rotateY: -25 };
    } else {
      return { x: 0, scale: 0.5, zIndex: 10, opacity: 0, rotateY: 0 };
    }
  };

  return (
    <section 
      className={`w-full py-24 px-6 lg:px-12 overflow-hidden relative ${manrope.className}`}
      style={{ backgroundColor: "var(--background)" }}
    >
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--primary)]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div 
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] blur-[120px] rounded-full pointer-events-none"
        style={{ backgroundColor: isDark ? "rgba(var(--card), 0.5)" : "rgba(255, 255, 255, 0.1)" }}
      ></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div 
            className="inline-flex items-center gap-2 font-bold tracking-[0.4em] text-[10px] uppercase px-5 py-2 rounded-full border mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(205,223,160,0.2)]"
            style={{
              color: "var(--accent)",
              backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(var(--primary), 0.1)",
              borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(var(--primary), 0.1)"
            }}
          >
            <Sparkles size={14} /> AI-Powered Success
          </div>
          <h2 
            className="text-4xl lg:text-5xl font-black mb-4 tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Trusted by <span style={{ color: "var(--accent)" }} className="italic font-light drop-shadow-[0_0_10px_rgba(205,223,160,0.5)]">Thousands</span>
          </h2>
          <p 
            className="font-medium max-w-xl mx-auto"
            style={{ color: "var(--muted-foreground)" }}
          >
            See how our AI-powered real estate platform is changing lives through cutting-edge technology.
          </p>
        </div>

     
        <div className="relative h-[480px] w-full max-w-5xl mx-auto perspective-1000 flex items-center justify-center mt-16">
          
          <AnimatePresence initial={false}>
            {testimonials.map((t, i) => {
              const style = getCardStyle(i);
              
              return (
                <motion.div
                  key={t.id}
                  initial={false}
                  animate={style}
                  transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        
                  className="absolute w-[320px] md:w-[420px] bg-[var(--card)]/90 backdrop-blur-2xl border border-[var(--accent)]/20 rounded-[2.5rem] px-10 pb-10 pt-14 text-center shadow-[0_30px_70px_rgba(15,46,40,0.5)] origin-center group overflow-visible"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Subtle internal glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#cddfa0]/5 to-transparent pointer-events-none rounded-[2.5rem]"></div>

                  <Quote size={40} className="text-[var(--accent)]/30 absolute top-8 left-8" />
                  
               
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 z-20">
                    <div className="absolute inset-0 bg-[var(--primary)] rounded-full animate-pulse blur-md opacity-80 shadow-[0_0_20px_#cddfa0]"></div>
                    <img 
                      src={t.avatar} 
                      alt={t.name} 
                      className="relative w-full h-full rounded-full border-4 object-cover shadow-xl"
                      style={{ borderColor: "var(--primary)" }}
                    />
                  </div>
                  
                  <div className="flex justify-center gap-1 mb-5 text-[var(--accent)] drop-shadow-[0_0_5px_rgba(205,223,160,0.5)] z-20 relative mt-4">
                    {[...Array(5)].map((_, idx) => <span key={idx}>★</span>)}
                  </div>
                  
                  <p 
                    className="text-lg font-medium leading-relaxed mb-6 h-[90px] overflow-hidden z-20 relative flex items-center justify-center"
                    style={{ color: isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)" }}
                  >
                    "{t.text}"
                  </p>
                  
                  <div 
                    className="border-t pt-5 relative z-20"
                    style={{ borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)" }}
                  >
                    <p 
                      className="font-black text-lg tracking-wide"
                      style={{ color: "var(--foreground)" }}
                    >
                      {t.name}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] mt-1">{t.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-3 mt-8">
          {testimonials.map((_, i) => (
            <div
              key={i}
              className="transition-all duration-700 rounded-full"
              style={{
                width: i === index ? "3rem" : "0.375rem",
                height: "0.375rem",
                backgroundColor: i === index ? "var(--primary)" : (isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"),
                boxShadow: i === index ? "0 0 15px #cddfa0" : "none"
              }}
            />
          ))}
        </div>
        
      </div>
    </section>
  );
}

