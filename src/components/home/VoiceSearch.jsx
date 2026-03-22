"use client";

import React, { useEffect, useRef, useState } from "react";
import properties from "../../data/properties"; 
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Search, MapPin, BedDouble, Bath, Maximize, Loader2, Sparkles, MessageSquareText } from "lucide-react";
import { Manrope } from "next/font/google";
import { GoogleGenerativeAI } from "@google/generative-ai";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

function parseQuery(q) {
  const res = {};
  
  const mBeds = q.match(/(\d+)\s*(bed|br|room)/i) || q.match(/(?:find|show).*?(\d+)/i);
  if (mBeds) res.beds = Number(mBeds[1]);

  const mBaths = q.match(/(\d+)\s*(bath|bt)/i);
  if (mBaths) res.baths = Number(mBaths[1]);

  const mMillion = q.match(/(\d+\.?\d*)\s*(m|million)/i);
  const mLakh = q.match(/(\d+)\s*lakh/i);
  
  if (mMillion) res.maxPrice = parseFloat(mMillion[1]) * 1000000;
  else if (mLakh) res.maxPrice = Number(mLakh[1]) * 100000;
  else {
    const mPrice = q.match(/\$?([0-9,]+)k?/i);
    if (mPrice) res.maxPrice = Number(mPrice[1].replace(/,/g, ""));
  }

  const mSize = q.match(/(\d+)\s*(sqft|sq\s*mt|katha|sq|area|ft)/i);
  if (mSize) res.size = Number(mSize[1]);

  const lowerQ = q.toLowerCase();
  properties.forEach(p => {
    const titleWords = p.title.toLowerCase().split(' ');
    titleWords.forEach(word => {
      if (word.length > 3 && lowerQ.includes(word)) res.city = word;
    });
  });

  return res;
}

const API_KEY = "AIzaSyAsoQzyuLSu6bfftqSGDE8XFtxB4C5Psps"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default function VoiceSearch() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [results, setResults] = useState([]);
  const [aiResponse, setAiResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const recognitionRef = useRef(null);

  const speak = (text, langCode = "en-US") => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(text);
      
      utterance.lang = langCode;
      const voices = window.speechSynthesis.getVoices();
      
      const targetLang = langCode.split('-')[0]; 
      
      let matchedVoice = voices.find(v => 
        v.lang.startsWith(targetLang) && 
        (v.name.includes("Female") || v.name.includes("Samantha") || v.name.includes("Zira") || v.name.includes("Victoria") || v.name.includes("Google UK English Female") || v.name.includes("Microsoft Kalpana") || v.name.includes("Lekha"))
      );
      
      if (!matchedVoice) {
        matchedVoice = voices.find(v => v.lang.startsWith(targetLang));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      if (targetLang === "bn") {
        utterance.rate = 0.9;  
        utterance.pitch = 1.3; 
      } else {
        utterance.rate = 0.95; 
        utterance.pitch = 1.2; 
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const getGeminiResponse = async (userText, localMatchCount) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are a highly intelligent female AI Assistant for real estate.
      
      CRITICAL INSTRUCTIONS:
      1. DETECT LANGUAGE: You MUST detect the language of the 'User Query' and reply in the EXACT SAME LANGUAGE and SCRIPT.
      2. ANSWER ANYTHING: You are allowed to answer ANY question. General knowledge, math, science, time, coding, jokes, or real estate.
      3. REAL ESTATE CHECK: The local database found ${localMatchCount} matching properties. 
         - If ${localMatchCount} > 0, just tell them you found it in your native language. Do NOT make up property data here.
         - If ${localMatchCount} == 0 and they asked about a property, give a realistic market analysis and generate a global property card for that area.
      
      Output strictly in this JSON format ONLY (No markdown):
      {
        "languageCode": "en-US", 
        "replyText": "Your response here (in the detected language)",
        "showPropertyCard": ${localMatchCount === 0 ? true : false}, 
        "propertyData": {
          "title": "Luxury Real Estate in [Area]",
          "location": "[Area Name, Country]",
          "priceLabel": "[Estimated Price]",
          "beds": 3,
          "baths": 2,
          "sqft": 2000
        }
      }

      User Query: ${userText}`;

      const result = await model.generateContent(prompt);
      const rawText = await result.response.text();
      
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);

    } catch (error) {
      console.error("AI Error:", error);
      return {
        languageCode: "en-US",
        replyText: "Sorry, I could not process your request. Please try again.",
        showPropertyCard: false
      };
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }
    const recog = new SpeechRecognition();
    
    recog.lang = navigator.language || "en-US"; 
    recog.interimResults = true;
    
    recog.onresult = (e) => {
      let final = "";
      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
      }
      if (final) {
        setTranscript(final);
        processVoiceQuery(final);
      }
    };
    recog.onend = () => setListening(false);
    recognitionRef.current = recog;

    if (typeof window !== "undefined") {
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

  const processVoiceQuery = async (queryText) => {
    setIsAnalyzing(true);
    const userMsg = queryText.toLowerCase();
    
    try {
      const query = parseQuery(userMsg);
      let matches = [];

      // STEP 1: Always check Local Database first
      if (query.beds || query.maxPrice || query.city || query.size || query.baths) {
        matches = properties.filter(p => {
          let isMatch = true;
          if (query.beds && p.beds !== query.beds) isMatch = false;
          if (query.baths && p.baths !== query.baths) isMatch = false;
          if (query.maxPrice && p.price > query.maxPrice) isMatch = false;
          if (query.city && !p.title.toLowerCase().includes(query.city)) isMatch = false;
          if (query.size && p.sqft && p.sqft < query.size) isMatch = false;
          return isMatch;
        });
      }

      // STEP 2: Send to AI for natural voice response & fallback generation
      const aiData = await getGeminiResponse(userMsg, matches.length);
      
      const finalResponseText = aiData.replyText;
      const finalLangCode = aiData.languageCode; 

      // STEP 3: Display Logic
      if (matches.length > 0) {

        setResults(matches.slice(0, 6)); 
      } else if (matches.length === 0 && aiData.showPropertyCard && aiData.propertyData) {
     
        setResults([{
          id: 'ai-global-dynamic',
          title: aiData.propertyData.title,
          priceLabel: aiData.propertyData.priceLabel,
          location: aiData.propertyData.location,
          beds: aiData.propertyData.beds || 3,
          baths: aiData.propertyData.baths || 2,
          sqft: aiData.propertyData.sqft || 2000,
          image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
        }]);
      } else {
        
        setResults([]); 
      }

      setAiResponse(finalResponseText);
      speak(finalResponseText, finalLangCode);

    } catch (error) {
      setAiResponse("Sorry, I could not understand you. Please try again.");
      speak("Sorry, I could not understand you. Please try again.", "en-US");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!supported) return <div className="p-10 text-center bg-gray-50 dark:bg-[#0f2e28] text-gray-800 dark:text-white">Browser not supported for voice recognition. Use Chrome or Edge.</div>;

  return (
    <section className={`w-full py-24 px-6 lg:px-12 bg-slate-50 dark:bg-[#0f2e28] min-h-screen relative overflow-hidden transition-colors duration-500 ${manrope.className}`}>
      
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] blur-[150px] rounded-full pointer-events-none bg-emerald-100/50 dark:bg-[#cddfa0]/5"></div>

      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center">
        
        <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-[#cddfa0] font-bold tracking-[0.4em] text-[10px] uppercase bg-white dark:bg-white/5 px-5 py-2 rounded-full border border-gray-200 dark:border-white/10 mb-8 shadow-sm">
          <Sparkles size={14} /> Intelligence Voice Search
        </div>

        <h2 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight text-center leading-none">
          Urban Estate <span className="text-emerald-500 dark:text-[#cddfa0] italic font-light">AI Voice</span>
        </h2>
        
        <p className="text-gray-500 dark:text-white/60 text-center mb-12 max-w-lg text-sm md:text-base">
          Tap the microphone and ask about any property, location, or general questions!
        </p>

        <div className="relative w-full max-w-md h-16 flex items-center justify-center gap-1.5 mb-8">
          <motion.div 
            animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.95, 1.05, 0.95] }} 
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
            className="absolute w-2/3 h-full bg-emerald-400/20 dark:bg-[#cddfa0]/10 blur-2xl rounded-full pointer-events-none"
          />

          {listening ? (
            [...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 bg-emerald-500 dark:bg-[#cddfa0] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] dark:shadow-[0_0_15px_#cddfa0] relative z-10"
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
                  className="w-1.5 h-1.5 bg-emerald-500 dark:bg-[#cddfa0] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] dark:shadow-[0_0_10px_#cddfa0]" 
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
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }} 
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }} 
            className="absolute w-28 h-28 bg-emerald-400/20 dark:bg-[#cddfa0]/20 rounded-full blur-md" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} 
            className="absolute w-32 h-32 bg-emerald-400/10 dark:bg-[#cddfa0]/10 rounded-full blur-xl" 
          />

          <AnimatePresence>
            {listening && (
              <motion.div initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ repeat: Infinity, duration: 1 }} className="absolute w-20 h-20 bg-emerald-400/50 dark:bg-[#cddfa0]/50 rounded-full" />
            )}
          </AnimatePresence>
          
          <button 
            onClick={toggleListen} 
            className={`relative z-10 w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              listening 
                ? 'bg-emerald-500 dark:bg-[#cddfa0] text-white dark:text-[#0f2e28] scale-110 shadow-[0_0_40px_rgba(16,185,129,0.6)] dark:shadow-[0_0_50px_rgba(205,223,160,0.8)]' 
                : 'bg-white dark:bg-[#13332c] text-emerald-600 dark:text-[#cddfa0] shadow-xl dark:shadow-[0_0_25px_rgba(205,223,160,0.5)] hover:scale-105 border border-gray-100 dark:border-none'
            }`}
          >
            {listening ? <Mic size={36} className="animate-pulse" /> : <Mic size={36} />}
          </button>
        </div>

        <div className="w-full max-w-3xl space-y-6 px-4 md:px-0">
          {transcript && (
            <div className="bg-white dark:bg-white/5 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
              <span className="text-[10px] font-bold text-emerald-500 dark:text-[#cddfa0] uppercase tracking-widest block mb-2 opacity-80 dark:opacity-50">User Input</span>
              <p className="text-lg md:text-xl text-gray-800 dark:text-white font-medium italic">"{transcript}"</p>
            </div>
          )}

          {isAnalyzing ? (
            <div className="flex items-center gap-3 text-emerald-600 dark:text-[#cddfa0] font-mono text-xs md:text-sm animate-pulse bg-white dark:bg-transparent p-4 rounded-xl shadow-sm dark:shadow-none border border-gray-100 dark:border-none">
              <Loader2 className="animate-spin" size={18} /> PROCESSING_AI_RESPONSE...
            </div>
          ) : aiResponse && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-50 dark:bg-[#cddfa0]/10 border-l-4 border-emerald-500 dark:border-[#cddfa0] p-5 md:p-6 rounded-r-2xl shadow-lg dark:shadow-2xl backdrop-blur-md">
               <p className="text-xs md:text-sm text-emerald-600 dark:text-[#cddfa0] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
                <MessageSquareText size={16} /> AI Assistant Response
              </p>
              <p className="text-base md:text-lg text-gray-800 dark:text-white leading-relaxed">{aiResponse}</p>
            </motion.div>
          )}
        </div>

        {!isAnalyzing && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12 w-full px-4 md:px-0">
            {results.map((r) => (
              <div key={r.id} className="bg-white dark:bg-[#13332c] rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 group shadow-lg dark:shadow-none hover:border-emerald-400 dark:hover:border-[#cddfa0]/50 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={r.title} />
                  <div className="absolute top-2 left-2 bg-emerald-600 dark:bg-[#0f2e28] text-white dark:text-[#cddfa0] px-3 py-1 rounded-lg text-[10px] font-black tracking-wide shadow-md">
                    {r.priceLabel || `$${r.price}`}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-gray-900 dark:text-white font-bold mb-1 truncate text-sm">{r.title}</h4>
                  <p className="text-gray-500 dark:text-white/50 text-[10px] uppercase mb-4 flex items-center gap-1 font-medium">
                    <MapPin size={12} className="text-emerald-500 dark:text-[#cddfa0]"/> {r.location}
                  </p>
                  <div className="flex justify-between border-t border-gray-100 dark:border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-white/60 font-semibold"><BedDouble size={14} className="text-emerald-500 dark:text-white/40"/> {r.beds} Beds</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-white/60 font-semibold"><Bath size={14} className="text-emerald-500 dark:text-white/40"/> {r.baths || 0} Baths</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-600 dark:text-white/60 font-semibold"><Maximize size={14} className="text-emerald-500 dark:text-white/40"/> {r.sqft || 0} sqft</div>
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