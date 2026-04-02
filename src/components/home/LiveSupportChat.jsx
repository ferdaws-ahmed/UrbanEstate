"use client";

import React, { useState, useEffect, useRef } from "react";
import properties from "../../data/properties";
import { motion, AnimatePresence } from "framer-motion";

// Massive Smart Knowledge Base 
const knowledgeBase = {
  greetings: {
    keywords: ["hello", "hi", "hey", "greetings", "good morning", "how are you", "hru", "yo", "anyone there", "hey assistant", "support", "help me", "hi there", "good evening", "good afternoon", "morning", "night", "whats up", "buddy"],
    reply: "Hello! Welcome to the Urban Estate Support Hub. I'm doing great, thank you for asking! How can I assist you with your property inquiry today?"
  },
  personal: {
    keywords: ["what are you doing", "what is your name", "who are you", "your name", "who made you", "where are you from", "are you human", "are you a robot", "what is your job", "what can you do", "doing now", "developer", "creator", "owner", "built you", "programmed", "founder"],
    reply: "I am Urban Estate AI, your dedicated real estate concierge. Right now, I'm analyzing market trends to help you find your dream home! I was developed by a specialized MERN Stack engineer based in Baipayl, Dhaka."
  },
  location_personal: {
    keywords: ["where do you live", "where are you", "your office", "where are you living", "where is your home", "address", "location", "place", "area", "baipayl", "dhaka", "bangladesh", "visit", "office address", "map", "direction"],
    reply: "I live in the digital cloud, but my heart (and our main office) is in Baipayl, Dhaka Division, Bangladesh! You can also find us at our corporate unit in Banani, Road 11."
  },
  complex_buying: {
    keywords: ["buy", "steps", "process", "procedure", "purchase", "guide", "method", "how to buy", "requirements", "booking", "handover", "possession", "closure", "agreement", "rules", "policy"],
    reply: "Our purchase flow is seamless: 1. Asset selection. 2. Title verification. 3. MOU drafting. 4. Escrow setup. 5. Registration and physical possession handover. We handle the paperwork for you!"
  },
  legal: {
    keywords: ["legal", "document", "paper", "verified", "khatian", "mutation", "registration", "deed", "authentic", "title", "ownership", "dispute", "scam", "safe", "papers", "cs", "sa", "rs", "bs", "porcha", "dakhila"],
    reply: "Safety is our priority. We verify all CS, SA, RS, and BS Khatians, Mutation records, and PoA validity to ensure every property is 100% dispute-free and authentic."
  },
  finance: {
    keywords: ["loan", "emi", "bank", "installment", "interest", "finance", "mortgage", "price", "cost", "budget", "down payment", "tax", "vat", "stamp duty", "hidden cost", "ait", "registration fee", "total amount"],
    reply: "We facilitate 70-80% bank financing via major partners. Beyond the property price, budget an extra 10-12% for government taxes, stamp duty, and registration fees."
  },
  investment: {
    keywords: ["investment", "roi", "return", "market", "trend", "future", "profit", "appreciation", "risk", "bubble", "valuation", "yield", "capital gain", "income", "growth"],
    reply: "Real estate is a shield against inflation. Our AI predicts 12-18% annual appreciation in emerging infrastructure corridors like Dhaka and Miami. It's a high-yield choice."
  },
  technical: {
    keywords: ["structural", "piling", "quality", "material", "architect", "engineer", "soil test", "building code", "safety", "earthquake", "cement", "steel", "fittings", "substation", "generator", "lift"],
    reply: "All listed properties adhere to strict building codes. We review soil tests, structural designs, and ensure high-end specs like earthquake resistance and heavy-load substations."
  },
  support: {
    keywords: ["contact", "phone", "email", "number", "human", "talk", "expert", "agent", "complain", "issue", "sa9079600@gmail.com", "manager", "whatsapp", "call", "helpdesk"],
    reply: "For high-priority human intervention or direct help, reach our senior team at sa9079600@gmail.com or visit our Road 11, Banani office directly."
  },
  real_estate_general: {
    keywords: ["house", "villa", "apartment", "flat", "land", "plot", "commercial", "shop", "office space", "residential", "luxury", "affordable", "ready", "under construction"],
    reply: "We have a vast collection of verified residential and commercial assets. Tell me your preferred area, budget, or bedroom count, and I will find the best match for you instantly."
  }
};

function parseQuery(q) {
  const res = {};
  const mBeds = q.match(/(\d+)\s*-?\s?bed/);
  if (mBeds) res.beds = Number(mBeds[1]);
  const mPrice = q.match(/\$?([0-9,]+)k?/i);
  if (mPrice) {
    const raw = mPrice[1].replace(/,/g, "");
    res.maxPrice = Number(raw);
  }
  const city = q.match(/in\s([A-Za-z\s]+)/i);
  if (city) res.city = city[1].trim();
  return res;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const dynamicHeight = messages.length <= 3 ? "auto" : "450px";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.toLowerCase();
    setMessages((prev) => [...prev, { type: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botReply = { type: "bot", text: "", data: [] };
      let foundKnowledge = false;

      // Smart Context matching that finds keywords within any sentence structure
      for (let category in knowledgeBase) {
        if (knowledgeBase[category].keywords.some(key => userMsg.includes(key))) {
          botReply.text = knowledgeBase[category].reply;
          foundKnowledge = true;
          break; 
        }
      }

      // Special logic for property search integration
      const query = parseQuery(userMsg);
      if (query.beds || query.maxPrice || query.city) {
        let matches = properties.slice();
        if (query.beds) matches = matches.filter((p) => p.beds >= query.beds);
        if (query.maxPrice) matches = matches.filter((p) => p.price <= query.maxPrice);
        if (query.city) matches = matches.filter((p) => p.title.toLowerCase().includes(query.city.toLowerCase()));
        
        if (matches.length > 0) {
          botReply.text = `AI Intelligence Scan complete. I found ${matches.length} premium properties matching your criteria:`;
          botReply.data = matches.slice(0, 2);
          foundKnowledge = true;
        }
      }

      if (!foundKnowledge) {
        botReply.text = "I'm specializing in Real Estate Intelligence, Legal Papers, and Market Analytics. Could you please specify your query? For example: 'Where is your home office?'";
      }

      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <>
      <div className="fixed right-6 bottom-6 z-[9999]">
        <motion.button 
          onClick={() => setOpen(!open)} 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f2e28] to-[#1a5d51] text-white shadow-[0_4px_15px_rgba(0,0,0,0.3)] flex items-center justify-center text-2xl transition-all border border-emerald-400/20"
        >
          {open ? "×" : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><circle cx="12" cy="11" r="3"></circle><path d="M12 7v4"></path></svg>
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
            className="fixed right-6 bottom-24 z-[9999] w-[310px] bg-[#f8fafc] dark:bg-slate-900 rounded-[1.5rem] shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col overflow-hidden max-h-[500px]"
          >
            <div className="bg-[#0f2e28] p-3 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>
                </div>
                <div>
                  <div className="font-bold text-[12px] leading-tight text-emerald-50 uppercase tracking-widest">Support Hub</div>
                  <div className="flex items-center gap-1.5 text-[8px] text-emerald-400/80 uppercase font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span> AI Expert Active
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-xl opacity-60 hover:opacity-100 transition-opacity">×</button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-emerald-50/10 dark:bg-slate-800 flex flex-col gap-4 min-h-0">
              {messages.length === 0 && (
                <div className="bg-white dark:bg-slate-700 p-4 rounded-2xl text-[12px] text-gray-600 dark:text-gray-300 border border-emerald-100 dark:border-slate-600 shadow-sm italic text-center">
                    Verified real estate support is active. <br/> Ask: <b>"Who made you?"</b> or <b>"Where is your office?"</b>
                </div>
              )}
              
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[90%] p-3 rounded-2xl text-[12px] leading-relaxed shadow-sm ${m.type === "user" ? "bg-[#0f2e28] text-white rounded-br-none" : "bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-none border border-emerald-50 dark:border-slate-600"}`}>
                    {m.text}
                    {m.data && m.data.length > 0 && (
                      <div className="mt-4 flex flex-col gap-3">
                        {m.data.map((r) => (
                          <div key={r.id} className="flex items-center gap-3 bg-emerald-50/50 dark:bg-slate-600 p-2 rounded-xl border border-emerald-100 dark:border-slate-500">
                            <img src={r.image} className="w-10 h-8 object-cover rounded-lg shadow-sm" alt="" />
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900 dark:text-white truncate text-[11px]">{r.title}</div>
                              <div className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px]">{r.priceLabel}</div>
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

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-emerald-50 dark:border-slate-700 shrink-0">
              <div className="relative flex items-center">
                <input 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)} 
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  className="w-full bg-emerald-50/30 dark:bg-slate-800 rounded-2xl px-5 py-3 pr-12 text-[12px] text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 placeholder:text-gray-400 font-medium border-none shadow-inner" 
                  placeholder="Ask me anything..." 
                />
                <button onClick={handleSend} className="absolute right-2 text-[#0f2e28] dark:text-emerald-400 p-2 hover:scale-125 transition-transform">
                  ➤
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}