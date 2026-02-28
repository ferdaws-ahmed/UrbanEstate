"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Search, MapPin, BedDouble, Bath, Maximize, Loader2, Sparkles, MessageSquareText } from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// ১০০% ওয়ার্কিং রিয়েল এস্টেট ডামি ডাটা
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
];

const parsePriceToNumber = (priceStr) => {
  if (!priceStr) return 0;
  let num = parseFloat(priceStr.replace(/[^0-9.]/g, ""));
  if (priceStr.toLowerCase().includes("m")) num *= 1000000;
  if (priceStr.toLowerCase().includes("k")) num *= 1000;
  return num;
};

export default function VoiceSearch() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (e) => {
      let interim = "";
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        const r = e.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      
      const currentText = final ? final : interim;
      setTranscript(currentText);
      
      if (final) {
        processQuery(final);
      }
    };

    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
  }, []);

  const toggleListen = () => {
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      if (transcript) processQuery(transcript);
    } else {
      setTranscript("");
      setResults([]);
      setAiResponse("");
      setHasSearched(false);
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (e) {
        console.error("Speech recognition error", e);
      }
    }
  };

  const parsePropertyQuery = (text) => {
    const parsed = {};
    const bedMatch = text.match(/(?:(\d+|one|two|three|four|five|six))\s*(?:bed|bedroom)/);
    if (bedMatch) {
      const numMap = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
      parsed.beds = isNaN(bedMatch[1]) ? numMap[bedMatch[1]] : Number(bedMatch[1]);
    }

    const priceMatch = text.match(/(?:under|below|max|maximum|cheap|less than)\s*(?:\$|of)?\s*(\d+(?:\.\d+)?)\s*(k|m|million|thousand)?/);
    if (priceMatch) {
      let rawNum = parseFloat(priceMatch[1]);
      const multiplier = priceMatch[2];
      if (multiplier === 'm' || multiplier === 'million') rawNum *= 1000000;
      else if (multiplier === 'k' || multiplier === 'thousand') rawNum *= 1000;
      else if (rawNum < 100) rawNum *= 1000000; 
      parsed.maxPrice = rawNum;
    }

    const cities = ["beverly hills", "miami", "san francisco", "seattle", "new york", "austin", "london", "denver", "chicago", "portland"];
    const foundCity = cities.find(city => text.includes(city));
    if (foundCity) parsed.city = foundCity;

    return parsed;
  };

  const processQuery = (queryText) => {
    if (!queryText.trim()) return;
    setIsAnalyzing(true);
    setHasSearched(true);
    setResults([]);
    
    setTimeout(() => {
      const text = queryText.toLowerCase();
      
      // Property Search Logic
      const parsed = parsePropertyQuery(text);
      let isPropertySearch = parsed.beds || parsed.maxPrice || parsed.city || text.includes("house") || text.includes("property") || text.includes("home");

      if (isPropertySearch) {
        let list = [...localProperties];
        let isStrictMatch = false;

        if (parsed.beds) { list = list.filter((p) => p.beds >= parsed.beds); isStrictMatch = true; }
        if (parsed.maxPrice) { list = list.filter((p) => parsePriceToNumber(p.price) <= parsed.maxPrice); isStrictMatch = true; }
        if (parsed.city) { list = list.filter((p) => p.location.toLowerCase().includes(parsed.city)); isStrictMatch = true; }

        if (!isStrictMatch) {
          const keywords = text.split(" ");
          list = localProperties.filter(p => keywords.some(kw => kw.length > 3 && (p.title.toLowerCase().includes(kw) || p.location.toLowerCase().includes(kw))));
        }

        setResults(list.slice(0, 6));
        setAiResponse(list.length > 0 
          ? `I found ${list.length} properties that match your request. Take a look below.` 
          : "I couldn't find exact matches for that criteria right now. Could you broaden your search?");
      } 
      // General AI Q&A Logic (যেকোনো প্রশ্নের উত্তর)
      else {
        let reply = "";
        if (text.includes("hello") || text.includes("hi ") || text === "hi") reply = "Hello! I'm your AI Real Estate Assistant. How can I help you today?";
        else if (text.includes("who are you")) reply = "I am an advanced AI assistant built to help you find your dream home and answer your real estate questions.";
        else if (text.includes("how are you")) reply = "I'm functioning perfectly! Ready to help you discover amazing properties.";
        else if (text.includes("time")) reply = `The current time is ${new Date().toLocaleTimeString()}. A perfect time to look for a new home!`;
        else if (text.includes("real estate")) reply = "Real estate is property consisting of land and the buildings on it. Investing in it is one of the best ways to build wealth!";
        else if (text.includes("mortgage")) reply = "A mortgage is a loan used to purchase or maintain a home, where the property serves as collateral. Need help calculating one?";
        else reply = `That's an interesting question about "${queryText}". As an AI, I specialize in real estate. Try asking me to find a "3 bed house in Miami under 2 million".`;
        
        setAiResponse(reply);
      }
      
      setIsAnalyzing(false);
    }, 1500); // AI Thinking Delay
  };

  if (!supported) {
    return (
      <div className="w-full text-center py-10 bg-[#0f2e28] text-[#cddfa0]">
        <p className="font-bold">⚠️ Voice Search is not supported in this browser. Try Chrome or Edge.</p>
      </div>
    );
  }

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] min-h-screen flex flex-col items-center relative overflow-hidden ${manrope.className}`}>
      
      {/* Background ambient light */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none transition-all duration-1000 ${listening ? 'bg-[#cddfa0]/10 scale-110' : 'bg-[#13332c]/50 scale-100'}`}></div>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-8">
          <Sparkles size={14} /> AI Voice Assistant
        </div>

        <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 tracking-tight text-center">
          Ask Me <span className="text-[#cddfa0] italic font-light">Anything</span>
        </h2>
        
        <p className="text-white/60 text-center mb-12 max-w-md">
          Talk to me like a real person. Ask for houses, or ask general questions!
        </p>

        {/* Big Interactive Mic Button */}
        <div className="relative mb-16 flex justify-center items-center h-40">
          <AnimatePresence>
            {listening && (
              <>
                <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }} className="absolute w-24 h-24 bg-[#cddfa0]/30 rounded-full" />
                <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2, opacity: 0 }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, ease: "easeOut" }} className="absolute w-24 h-24 bg-[#cddfa0]/20 rounded-full" />
              </>
            )}
          </AnimatePresence>

          <button 
            onClick={toggleListen}
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${listening ? 'bg-[#cddfa0] text-[#0f2e28] scale-110 shadow-[0_0_40px_rgba(205,223,160,0.5)]' : 'bg-[#13332c] text-[#cddfa0] border border-white/10 hover:bg-white/10 hover:scale-105'}`}
          >
            {listening ? <Mic size={40} className="animate-pulse" /> : <MicOff size={40} />}
          </button>
        </div>

        {/* Chat Interface Container */}
        <div className="w-full max-w-3xl space-y-6">
          
          {/* User's Input Box */}
          <div className="w-full bg-[#13332c]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl min-h-[100px] flex items-center justify-between mb-8">
            <div className="flex-1">
              <p className="text-sm text-[#cddfa0] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">You <Mic size={14} /></p>
              {transcript ? (
                <p className="text-xl font-medium text-white leading-relaxed">{transcript}</p>
              ) : (
                <p className="text-lg font-medium text-white/30 italic">Click the mic and start speaking...</p>
              )}
            </div>
            {transcript && !listening && !isAnalyzing && (
               <button onClick={() => processQuery(transcript)} className="ml-4 bg-[#cddfa0]/10 text-[#cddfa0] p-4 rounded-full hover:bg-[#cddfa0] hover:text-[#0f2e28] transition-all border border-[#cddfa0]/30">
                  <Search size={24} />
               </button>
            )}
          </div>

          {/* AI Thinking State */}
          {isAnalyzing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-[#cddfa0] font-bold tracking-widest uppercase text-sm shadow-lg backdrop-blur-md">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Loader2 size={20} />
                </motion.div>
                AI Analyzing Request...
              </div>
            </motion.div>
          )}

          {/* AI Text Response */}
          {!isAnalyzing && aiResponse && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start w-full">
              <div className="w-full bg-[#cddfa0]/10 border border-[#cddfa0]/30 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#cddfa0]"></div>
                <p className="text-sm text-[#cddfa0] font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                  <MessageSquareText size={16} /> AI Assistant
                </p>
                <p className="text-lg font-medium text-white leading-relaxed">{aiResponse}</p>
              </div>
            </motion.div>
          )}

        </div>

        {/* Property Search Results Grid */}
        {!isAnalyzing && results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-12">
            <h3 className="text-white/60 font-bold tracking-widest uppercase text-xs mb-6 border-b border-white/10 pb-4">
              Found {results.length} Properties
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {results.map((r, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} key={r.id} 
                  className="bg-[#13332c] rounded-2xl overflow-hidden border border-white/10 shadow-xl group hover:border-[#cddfa0]/50 transition-all cursor-pointer"
                >
                  <div className="h-44 overflow-hidden relative">
                    <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 left-3 bg-[#0f2e28]/90 backdrop-blur-md text-[#cddfa0] px-3 py-1.5 rounded-lg text-xs font-black shadow-lg">
                      {r.price}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-1 text-[#cddfa0] text-[10px] font-bold uppercase tracking-widest mb-2">
                      <MapPin size={12} /> {r.location}
                    </div>
                    <h4 className="font-black text-white text-lg mb-4 truncate">{r.title}</h4>
                    
                    <div className="flex items-center justify-between border-t border-white/10 pt-4">
                      <div className="flex items-center gap-1.5">
                        <BedDouble size={16} className="text-white/40" />
                        <span className="text-xs text-white/80 font-bold">{r.beds}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Bath size={16} className="text-white/40" />
                        <span className="text-xs text-white/80 font-bold">{r.baths}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Maximize size={16} className="text-white/40" />
                        <span className="text-xs text-white/80 font-bold">{r.size.split(" ")[0]}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}