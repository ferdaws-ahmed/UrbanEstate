"use client";

import React, { useEffect, useRef, useState } from "react";
import properties from "../../data/properties"; 
import { TrendingUp, Settings2 } from "lucide-react";
import { Manrope } from "next/font/google";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export default function PricePredictor() {
  const safeProperties = Array.isArray(properties) && properties.length > 0 ? properties : [];
  
  const [selectedId, setSelectedId] = useState(safeProperties[0]?.id || "");
  const [volatility, setVolatility] = useState(0.03); 
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const containerRef = useRef(null); 

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // एकदम আলট্রা স্মুথ (Ultra Smooth) করার জন্য ফিজিক্স আপডেট করা হয়েছে
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 40,   // অনেক সফট করা হয়েছে
    damping: 20,     // বাউন্স কমানো হয়েছে
    mass: 0.5,       // একটু ভারী করা হয়েছে যাতে ধীরে মুভ করে
    restDelta: 0.001
  });

  // মুভমেন্টের রেঞ্জ কমিয়ে আনা হয়েছে যাতে চোখে আরাম লাগে
  const yParallax = useTransform(smoothProgress, [0, 1], ["-10%", "10%"]);

  const loadChart = () => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve();
      if (window.Chart) return resolve();
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    let chartInstance;
    let mounted = true;

    loadChart().then(() => {
      if (!canvasRef.current || !mounted || !window.Chart) return;

      const ctx = canvasRef.current.getContext("2d");

      const buildData = () => {
        const p = safeProperties.find((x) => String(x.id) === String(selectedId));
        
        let currentPrice = 300000; 
        if (p && p.price) {
          const priceStr = String(p.price).replace(/[^0-9]/g, '');
          currentPrice = parseInt(priceStr, 10) || 300000;
        }

        const histYears = 5;
        const histReturns = [];
        const mean = 0.04 + (Math.random() - 0.5) * 0.02;
        for (let i = 0; i < histYears; i++) {
          const u1 = Math.random();
          const u2 = Math.random();
          const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
          const r = mean + randStdNormal * volatility; 
          histReturns.push(r);
        }

        const histPrices = [];
        let price = currentPrice;
        for (let i = histYears - 1; i >= 0; i--) {
          const ret = histReturns[i];
          const prev = price / (1 + ret);
          histPrices.unshift(Math.round(prev));
          price = prev;
        }

        const avgHist = histReturns.reduce((a, b) => a + b, 0) / histReturns.length;
        const projYears = 5;
        const projPrices = [];
        let projPrice = currentPrice;
        for (let y = 1; y <= projYears; y++) {
          const noise = (Math.random() - 0.5) * volatility * 0.5;
          const growth = avgHist + noise;
          projPrice = projPrice * (1 + growth);
          projPrices.push(Math.round(projPrice));
        }

        const labels = [];
        const now = new Date().getFullYear();
        for (let i = histYears; i >= 1; i--) labels.push(String(now - i));
        labels.push(String(now));
        for (let i = 1; i <= projYears; i++) labels.push(String(now + i));

        const fullPrices = [...histPrices, Math.round(currentPrice), ...projPrices];
        return { labels, fullPrices };
      };

      const { labels, fullPrices } = buildData();

      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(205, 223, 160, 0.4)"); 
      gradient.addColorStop(1, "rgba(205, 223, 160, 0.0)");

      chartInstance = new window.Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Predicted Value",
              data: fullPrices,
              borderColor: "#cddfa0",
              backgroundColor: gradient,
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: "#0f2e28",
              pointBorderColor: "#cddfa0",
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 7,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: { 
            legend: { display: false },
            tooltip: {
              backgroundColor: "#0f2e28",
              titleColor: "#cddfa0",
              bodyColor: "#ffffff",
              padding: 12,
              borderColor: "#cddfa0",
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                label: (context) => `$${context.parsed.y.toLocaleString()}`
              }
            }
          },
          scales: {
            x: {
              grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
              ticks: { color: "rgba(255, 255, 255, 0.5)", font: { family: "Manrope" } }
            },
            y: { 
              grid: { color: "rgba(255, 255, 255, 0.05)", drawBorder: false },
              ticks: { 
                color: "rgba(255, 255, 255, 0.5)",
                font: { family: "Manrope" },
                callback: (v) => `$${Number(v).toLocaleString()}` 
              } 
            },
          },
        },
      });

      chartRef.current = chartInstance;
    });

    return () => {
      mounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [selectedId, volatility, safeProperties]);

  return (
    <section ref={containerRef} className={`w-full relative py-24 px-6 lg:px-12 overflow-hidden ${manrope.className}`}>
      
      {/* Parallax Background Image - willChange: "transform" যোগ করা হয়েছে GPU অ্যাক্সিলারেশনের জন্য */}
      <motion.div 
        style={{ y: yParallax, willChange: "transform" }}
        className="absolute inset-[-10%] w-[120%] h-[120%] -z-20 pointer-events-none"
      >
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Real Estate Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-[#0f2e28]/85 -z-10 backdrop-blur-[2px]"></div>

      <div className="container mx-auto max-w-6xl relative z-10">
        
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <div className="flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 backdrop-blur-md">
            <TrendingUp size={14} /> AI Forecast Model
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight">
            Property <span className="text-[#cddfa0] italic font-light">Price Predictor</span>
          </h2>
          <p className="text-white/80 font-medium max-w-2xl">
            Visualize the projected appreciation of your selected property over the next 5 years using our advanced AI algorithm.
          </p>
        </div>

        <div className="bg-[#13332c]/90 backdrop-blur-xl rounded-[2.5rem] p-8 lg:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#cddfa0]/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-8 border-b border-white/10 relative z-10">
            <div className="w-full lg:w-1/2">
              <label className="block text-[#cddfa0] text-xs font-bold uppercase tracking-widest mb-3">Select Property</label>
              <select 
                value={selectedId} 
                onChange={(e) => setSelectedId(e.target.value)} 
                className="w-full bg-[#0f2e28]/80 text-white border border-white/10 rounded-xl px-5 py-4 outline-none focus:border-[#cddfa0] transition-colors appearance-none font-semibold cursor-pointer backdrop-blur-md"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23cddfa0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5em' }}
              >
                {safeProperties.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#0f2e28]">
                    {p.title} • {p.price}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full lg:w-1/3">
              <div className="flex justify-between items-center mb-3">
                <label className="flex items-center gap-2 text-[#cddfa0] text-xs font-bold uppercase tracking-widest">
                  <Settings2 size={16} /> Market Volatility
                </label>
                <span className="bg-[#0f2e28]/80 backdrop-blur-md text-white/90 px-3 py-1 rounded-lg text-xs font-bold border border-white/5">
                  {(volatility * 100).toFixed(1)}%
                </span>
              </div>
              <input 
                type="range" 
                min={0.01} 
                max={0.08} 
                step={0.005} 
                value={volatility} 
                onChange={(e) => setVolatility(Number(e.target.value))} 
                className="w-full accent-[#cddfa0] h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="relative w-full h-[400px] z-10">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </section>
  );
}