"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Search, MapPin, BedDouble, Bath, Maximize, Loader2, Sparkles, MessageSquareText } from "lucide-react";
import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const localProperties = [
  { id: 1, title: "Azure Skyline Villa", price: "$2.5M", location: "Beverly Hills, CA", beds: 4, baths: 3, size: "3,200 sqft", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Emerald Mansion", price: "$1.8M", location: "Miami, FL", beds: 5, baths: 4, size: "4,100 sqft", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Golden Gate Residence", price: "$3.2M", location: "San Francisco, CA", beds: 3, baths: 2, size: "2,800 sqft", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Waterfront Estate", price: "$9.5M", location: "Seattle, WA", beds: 4, baths: 3, size: "3,000 sqft", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Urban Smart Hub", price: "$4.1M", location: "New York, NY", beds: 2, baths: 2, size: "1,800 sqft", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Minimalist Glass", price: "$1.2M", location: "Austin, TX", beds: 3, baths: 2, size: "2,400 sqft", image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80" },
  { id: 7, title: "Vintage Royal", price: "$5.5M", location: "London, UK", beds: 6, baths: 5, size: "5,500 sqft", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { id: 8, title: "Modern Eco Retreat", price: "$2.1M", location: "Denver, CO", beds: 4, baths: 3, size: "3,500 sqft", image: "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80" },
  { id: 9, title: "Grand Central Loft", price: "$3.8M", location: "Chicago, IL", beds: 2, baths: 1, size: "1,500 sqft", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
  { id: 10, title: "Serene Pine Villa", price: "$1.5M", location: "Portland, OR", beds: 3, baths: 2, size: "2,600 sqft", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" },
];

const aiKnowledgeBase = {
  greetings: ["hello", "hi", "hey", "good morning", "good evening", "whatsapp", "yo"],
  farewells: ["bye", "goodbye", "see you", "take care"],
  identity: ["who are you", "your name", "what is this", "creator", "developer", "made you"],
  status: ["how are you", "what's up", "you okay", "are you human"],
  location_qst: ["where are you living", "where is your home", "location", "address", "baipayl", "dhaka"],
  time: ["time", "date", "day", "today"],
  property_buying: ["how to buy", "buying process", "purchase house", "can i buy", "step to buy"],
  pricing: ["price", "cost", "cheap", "expensive", "how much", "value"],
  mortgage: ["loan", "mortgage", "interest", "finance", "emi", "bank"],
  amenities: ["bed", "bath", "swimming pool", "garage", "garden", "gym", "sqft", "size"],
  locations: ["city", "area", "miami", "new york", "beverly hills", "london", "austin"],
  features: ["features", "urban estate", "what can you do", "website", "technology", "react", "nextjs", "geospatial"],
  security: ["safe", "secure", "verified", "ai scanning", "is it safe"],
  contact: ["agent", "support", "help", "email", "phone", "contact"],
  renting: ["rent", "lease", "tenant", "renting", "monthly"],
  pets: ["pet", "dog", "cat", "animal", "pets allowed", "pet friendly"],
  schools: ["school", "education", "college", "university", "kids", "student"],
  parking: ["parking", "park", "car", "vehicles", "parking lot"],
  tour: ["tour", "visit", "see", "viewing", "show me", "schedule"],
  negotiation: ["negotiate", "discount", "offer", "bargain"]
};

const getResponse = (text) => {
  const t = text.toLowerCase();

  if (aiKnowledgeBase.location_qst.some(k => t.includes(k))) return "I currently live within the Urban Estate digital cloud, but my roots and development are based in Baipayl, Dhaka Division, Bangladesh.";
  if (aiKnowledgeBase.identity.some(k => t.includes(k))) return "I am the UrbanEstate Intelligent Assistant, built by a passionate MERN Stack developer to redefine real estate.";
  if (aiKnowledgeBase.greetings.some(k => t.includes(k))) return "Hello! I'm your UrbanEstate Assistant. I'm ready to find your dream home or answer any property questions. How can I help you today?";
  if (aiKnowledgeBase.status.some(k => t.includes(k))) return "I'm functioning at peak efficiency! Analyzing properties and markets is what I do best. How are you doing?";
  if (aiKnowledgeBase.time.some(k => t.includes(k))) return `The current system time is ${new Date().toLocaleTimeString()}. It's a great time to invest in property!`;
  if (aiKnowledgeBase.farewells.some(k => t.includes(k))) return "Goodbye! Hope to see you back at Urban Estate soon. Have a wonderful day!";

  if (t.includes("mortgage") || t.includes("loan") || t.includes("finance")) return "Mortgages are complex, but generally, you need a 20% down payment for the best rates. You can use our integrated EMI calculator for precise calculations.";
  if (t.includes("buy") && t.includes("how")) return "Buying is simple: 1. Explore verified listings, 2. Check the structural integrity via our scanner, 3. Contact the assigned agent directly.";
  if (t.includes("invest") || t.includes("wealth")) return "Real estate is a top-tier asset class for wealth building. Properties in Beverly Hills and New York are currently stable high-value options.";
  if (t.includes("sell") || t.includes("listing")) return "If you want to sell, you can register as a Seller on our dashboard and list your property with AI-verified badges.";

  if (t.includes("urban estate") || t.includes("this project") || t.includes("this website")) return "Urban Estate is a premium marketplace featuring AI-verified listings, geospatial micro-climate scanning, and intelligent voice search.";
  if (t.includes("scanner") || t.includes("topo") || t.includes("integrity")) return "Our Aero-Topo Scanner analyzes terrain stability, flood risk, and micro-climate airflow for every property.";
  if (t.includes("security") || t.includes("verified") || t.includes("safe")) return "Every property on Urban Estate undergoes a structural integrity scan. We ensure a secure transaction protocol.";
  if (t.includes("tech") || t.includes("nextjs") || t.includes("mern")) return "This platform is built using the latest Next.js 14, Tailwind CSS, and Framer Motion for a seamless user experience.";

  if (aiKnowledgeBase.renting.some(k => t.includes(k))) return "We have a dedicated rental section. You can filter properties by monthly rent, lease terms, and location easily.";
  if (aiKnowledgeBase.pets.some(k => t.includes(k))) return "Many of our listings are pet-friendly! You can easily filter searches to show homes that welcome dogs, cats, and other pets.";
  if (aiKnowledgeBase.schools.some(k => t.includes(k))) return "Location is key! Our geospatial scanner highlights nearby top-rated schools and educational institutions for every property listed.";
  if (aiKnowledgeBase.parking.some(k => t.includes(k))) return "Parking is important. You can use our advanced filters to find properties with specific garage sizes or designated parking spots.";
  if (aiKnowledgeBase.tour.some(k => t.includes(k))) return "You can schedule a virtual 3D tour or an in-person viewing directly from any property's details page.";
  if (aiKnowledgeBase.negotiation.some(k => t.includes(k))) return "While prices are set by sellers, our platform allows you to submit custom offers and negotiate directly through your user dashboard.";


  return `I don't have the exact answer to this question right now. For more information regarding this, please contact us at sa9079600@gmail.com.`;
};

export default function VoiceSearch() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef(null);

  const speak = (text) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.volume = 1;
      utterance.rate = 1;
      utterance.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        utterance.voice = voices.find(v => v.name.includes("Google US English")) || voices[0];
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) {
        setTranscript(final);
        processQuery(final);
      }
    };
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;
    if (typeof window !== "undefined" && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const toggleListen = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      window.speechSynthesis.cancel(); 
      setTranscript("");
      setAiResponse("");
      setResults([]);
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  const processQuery = (queryText) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const text = queryText.toLowerCase();
      const bedMatch = text.match(/(\d+)\s*(bed|bedroom)/);
      const beds = bedMatch ? parseInt(bedMatch[1]) : null;
      const cities = ["beverly hills", "miami", "san francisco", "seattle", "new york", "austin", "london"];
      const city = cities.find(c => text.includes(c));

      const filtered = localProperties.filter(p => {
        const matchesBed = beds ? p.beds >= beds : true;
        const matchesCity = city ? p.location.toLowerCase().includes(city) : true;
        return matchesBed && matchesCity;
      });

      let finalResponse = "";
      if (beds || city || text.includes("house") || text.includes("villa") || text.includes("property")) {
        setResults(filtered.slice(0, 6));
        finalResponse = filtered.length > 0 
          ? `Searching assets... I've found ${filtered.length} properties matching your request. See the results below.` 
          : "I couldn't find an exact match for that specific request. Would you like to try a different location?";
      } else {
        finalResponse = getResponse(queryText);
      }

      setAiResponse(finalResponse);
      speak(finalResponse); 
      setIsAnalyzing(false);
    }, 1500);
  };

  if (!supported) return <div className="p-10 text-center bg-[#0f2e28] text-white">Browser not supported. Use Chrome or Edge.</div>;

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-[#0f2e28] min-h-screen relative overflow-hidden ${manrope.className}`}>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none bg-[#cddfa0]/5"></div>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/5 px-5 py-2 rounded-full border border-white/10 mb-8">
          <Sparkles size={14} /> Intelligence Voice Search
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tight text-center leading-none">
          Urban Estate <span className="text-[#cddfa0] italic font-light">AI Voice</span>
        </h2>
        
        <p className="text-white/60 text-center mb-12 max-w-lg">
          Ask about the market, mortgage, our technology, or find your next home.
        </p>

        {/* Updated Visualizer Line Section with Drop-down and Glow */}
        <div className="relative w-full max-w-md h-16 flex items-center justify-center gap-1.5 mb-8">
         
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.95, 1.05, 0.95] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute w-2/3 h-full bg-[#cddfa0]/10 blur-2xl rounded-full pointer-events-none"
          />

          {listening ? (
            [...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-[#cddfa0] rounded-full shadow-[0_0_15px_#cddfa0] relative z-10"
                animate={{ 
                  height: [8, Math.random() * 50 + 15, 8],
                  y: [0, (Math.random() * 6) - 3, 0] 
                }}
                transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.02 }}
              />
            ))
          ) : (
            <div className="flex items-center gap-1.5 z-10">
              {[...Array(25)].map((_, i) => (
                <motion.div 
                  key={i} 
                  className="w-1.5 h-1.5 bg-[#cddfa0] rounded-full shadow-[0_0_10px_#cddfa0]" 
                  animate={{ 
                    y: [0, 4, 0], 
                    opacity: [0.4, 1, 0.4] 
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative mb-16 h-32 flex items-center justify-center">
          {/* Continuous Glow Effect for Mic */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
            className="absolute w-28 h-28 bg-[#cddfa0]/20 rounded-full blur-md" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
            className="absolute w-32 h-32 bg-[#cddfa0]/10 rounded-full blur-xl" 
          />

          <AnimatePresence>
            {listening && (
              <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 1 }} className="absolute w-20 h-20 bg-[#cddfa0]/50 rounded-full" />
            )}
          </AnimatePresence>
          
          <button 
            onClick={toggleListen} 
            className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              listening 
                ? 'bg-[#cddfa0] text-[#0f2e28] scale-110 shadow-[0_0_50px_rgba(205,223,160,0.8)]' 
                : 'bg-[#13332c] text-[#cddfa0] shadow-[0_0_25px_rgba(205,223,160,0.5)] hover:shadow-[0_0_35px_rgba(205,223,160,0.7)] hover:bg-[#1a4038]'
            }`}
          >
            {listening ? <Mic size={40} className="animate-pulse" /> : <Mic size={40} />}
          </button>
        </div>

        <div className="w-full max-w-3xl space-y-6">
          {transcript && (
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold text-[#cddfa0] uppercase tracking-widest block mb-2 opacity-50">User Input</span>
              <p className="text-xl text-white font-medium italic">"{transcript}"</p>
            </div>
          )}

          {isAnalyzing ? (
            <div className="flex items-center gap-3 text-[#cddfa0] font-mono text-sm animate-pulse">
              <Loader2 className="animate-spin" size={18} /> PROCESSING_NEURAL_DATA...
            </div>
          ) : aiResponse && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#cddfa0]/10 border-l-4 border-[#cddfa0] p-6 rounded-r-2xl shadow-2xl backdrop-blur-md">
               <p className="text-sm text-[#cddfa0] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <MessageSquareText size={16} /> AI Assistant Response
              </p>
              <p className="text-lg text-white leading-relaxed">{aiResponse}</p>
            </motion.div>
          )}
        </div>

        {!isAnalyzing && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full">
            {results.map((r) => (
              <div key={r.id} className="bg-[#13332c] rounded-2xl overflow-hidden border border-white/10 group hover:border-[#cddfa0]/50 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-duration-700" alt={r.title} />
                  <div className="absolute top-2 left-2 bg-[#0f2e28] text-[#cddfa0] px-3 py-1 rounded-lg text-[10px] font-black">{r.price}</div>
                </div>
                <div className="p-5">
                  <h4 className="text-white font-bold mb-1 truncate text-sm">{r.title}</h4>
                  <p className="text-white/40 text-[9px] uppercase mb-4 flex items-center gap-1"><MapPin size={10} /> {r.location}</p>
                  <div className="flex justify-between border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1 text-[9px] text-white/60"><BedDouble size={14}/> {r.beds}</div>
                    <div className="flex items-center gap-1 text-[9px] text-white/60"><Bath size={14}/> {r.baths}</div>
                    <div className="flex items-center gap-1 text-[9px] text-white/60"><Maximize size={14}/> {r.size.split(' ')[0]}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}