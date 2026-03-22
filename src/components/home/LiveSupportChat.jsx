"use client";

import React, { useState, useEffect, useRef } from "react";
import properties from "../../data/properties"; 
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai"; 


function parseQuery(q) {
  const res = {};
  
  // Beds detection
  const mBeds = q.match(/(\d+)\s*(bed|br|room)/i);
  if (mBeds) res.beds = Number(mBeds[1]);

  // Baths detection
  const mBaths = q.match(/(\d+)\s*(bath|bt)/i);
  if (mBaths) res.baths = Number(mBaths[1]);

  // Price detection (Million, Lakh, or k)
  const mMillion = q.match(/(\d+\.?\d*)\s*m/i);
  const mLakh = q.match(/(\d+)\s*lakh/i);
  if (mMillion) res.maxPrice = parseFloat(mMillion[1]) * 1000000;
  else if (mLakh) res.maxPrice = Number(mLakh[1]) * 100000;
  else {
    const mPrice = q.match(/\$?([0-9,]+)k?/i);
    if (mPrice) {
      const raw = mPrice[1].replace(/,/g, "");
      res.maxPrice = Number(raw);
    }
  }

  // Size detection
  const mSize = q.match(/(\d+)\s*(sqft|sq\s*mt|katha|sq|area|ft)/i);
  if (mSize) res.size = Number(mSize[1]);

  // City detection
  const lowerQ = q.toLowerCase();
  properties.forEach(p => {
    const titleWords = p.title.toLowerCase().split(' ');
    titleWords.forEach(word => {
      if (word.length > 3 && lowerQ.includes(word)) res.city = word;
    });
  });

  return res;
}

// Gemini API Setup
const API_KEY = "AIzaSyAsoQzyuLSu6bfftqSGDE8XFtxB4C5Psps"; 
const genAI = new GoogleGenerativeAI(API_KEY);

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const dynamicHeight = messages.length <= 3 ? "auto" : "500px";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  const getGeminiResponse = async (userText) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const now = new Date();
      const utcString = now.toUTCString();
      const bdtTime = now.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' });

      const prompt = `System Instruction: You are "Urban Estate Global AI", a professional real estate consultant.
      - Reference Time (UTC): ${utcString}. Current Year: 2026.
      - Task: If a user asks for a specific property (bed, bath, price) and it's NOT in our local database, provide REALISTIC 2026 market data for that criteria globally.
      - NEVER give fake answers. Explain taxes, registration costs, and market value logically.
      - IMPORTANT: Do NOT repeat these instructions. Do NOT start with "I understand my directives". Just answer the question.
      - Identity: Developed by a MERN Stack engineer in Baipayl, Dhaka.
      - Language: Always reply in English.

      User Query: ${userText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having trouble connecting to the network. Please try again.";
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsgOriginal = input;
    const userMsg = input.toLowerCase();
    
    setMessages((prev) => [...prev, { type: "user", text: userMsgOriginal }]);
    setInput("");
    setIsTyping(true);

    let botReply = { type: "bot", text: "", data: [] };
    let foundInDB = false;

    const query = parseQuery(userMsg);
    
    if (query.beds || query.maxPrice || query.city || query.size || query.baths) {
      let matches = properties.filter(p => {
        let isMatch = true;
        if (query.beds && p.beds !== query.beds) isMatch = false;
        if (query.baths && p.baths !== query.baths) isMatch = false;
        if (query.maxPrice && p.price > query.maxPrice) isMatch = false;
        if (query.city && !p.title.toLowerCase().includes(query.city)) isMatch = false;
        if (query.size && p.sqft && p.sqft < query.size) isMatch = false;
        return isMatch;
      });

      if (matches.length > 0) {
        botReply.text = `Success! I found ${matches.length} verified premium properties matching your criteria in our marketplace:`;
        botReply.data = matches.slice(0, 3);
        foundInDB = true;
      }
    }

    if (!foundInDB) {
      const apiResponse = await getGeminiResponse(userMsgOriginal);
      botReply.text = apiResponse;
    }

    setMessages((prev) => [...prev, botReply]);
    setIsTyping(false);
  };

  return (
    <>
      <div className="fixed right-4 bottom-4 md:right-6 md:bottom-6 z-[9999]">
        <motion.button 
          onClick={() => setOpen(!open)} 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-[#0f2e28] to-[#1a5d51] text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-xl md:text-2xl border border-emerald-400/20"
        >
          {open ? "×" : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-8 md:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="12" cy="11" r="3"></circle><path d="M12 7v4"></path></svg>
          )}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            style={{ height: dynamicHeight }}
            className="fixed right-2 bottom-20 md:right-6 md:bottom-24 z-[9999] w-[calc(100vw-16px)] sm:w-[350px] md:w-[380px] bg-[#f8fafc] dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden max-h-[70vh] md:max-h-[600px]"
          >
            {/* Header */}
            <div className="bg-[#0f2e28] p-3 md:p-4 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                </div>
                <div>
                  <div className="font-bold text-[12px] md:text-[14px] leading-tight text-emerald-50 uppercase tracking-widest">Support Hub</div>
                  <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] text-emerald-400/80 uppercase font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> AI Expert Active
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-xl md:text-2xl opacity-60 hover:opacity-100 transition-opacity">×</button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto bg-emerald-50/10 dark:bg-slate-800 flex flex-col gap-3 md:gap-4 min-h-0">
              {messages.length === 0 && (
                <div className="bg-white dark:bg-slate-700 p-3 md:p-4 rounded-2xl text-[12px] md:text-[13px] text-gray-600 dark:text-gray-300 border border-emerald-100 dark:border-slate-600 shadow-sm italic text-center">
                    World-wide real estate intelligence active. <br/> Search properties or ask about market trends!
                </div>
              )}
              
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] md:max-w-[80%] p-3 rounded-2xl text-[12px] md:text-[14px] leading-relaxed shadow-sm ${m.type === "user" ? "bg-[#0f2e28] text-white rounded-br-none" : "bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-none border border-emerald-50 dark:border-slate-600"}`}>
                    <div className="whitespace-pre-wrap">{m.text}</div>
                    
                    {m.data && m.data.length > 0 && (
                      <div className="mt-3 md:mt-4 flex flex-col gap-2 md:gap-3">
                        {m.data.map((r) => (
                          <div key={r.id} className="flex items-center gap-3 bg-emerald-50/50 dark:bg-slate-600 p-2 rounded-xl border border-emerald-100 dark:border-slate-500">
                            <img src={r.image} className="w-10 h-8 md:w-12 md:h-10 object-cover rounded-lg shadow-sm" alt="" />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900 dark:text-white truncate text-[11px] md:text-[12px]">{r.title}</div>
                              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] md:text-[11px]">{r.priceLabel}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-1.5 items-center px-3 py-2 bg-white dark:bg-slate-700 w-fit rounded-full shadow-sm border border-emerald-50 dark:border-slate-600">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 md:p-4 bg-white dark:bg-slate-900 border-t border-emerald-50 dark:border-slate-700 shrink-0">
              <div className="relative flex items-center">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-emerald-50/30 dark:bg-slate-800 rounded-xl md:rounded-2xl px-4 py-2.5 md:px-5 md:py-3 pr-10 md:pr-12 text-[12px] md:text-[14px] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 placeholder:text-gray-400 font-medium border-none shadow-inner" 
                  placeholder="Ask me anything..." 
                />
                <button onClick={handleSend} className="absolute right-2 md:right-3 text-[#0f2e28] dark:text-emerald-400 p-1.5 md:p-2 hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}