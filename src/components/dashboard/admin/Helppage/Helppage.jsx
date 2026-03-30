"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CheckCircle, LifeBuoy, X,
} from "lucide-react";
import { useTheme } from "../../../ThemeProvider";
import properties from "../../../../data/properties"; 
import { GoogleGenerativeAI } from "@google/generative-ai";

// ─── Gemini API & Query Setup ─────────────────────────────────────────────────
const API_KEYS = [
  "AIzaSyA-rc3Cb3ECsd89Ff8wxVdgHj3igg4uk2Y",
  "AIzaSyCbEE5qPJwZ5aMGbQtCcndO6_bX9tIMpwk",
  "AIzaSyBTHSORGHoaz70CJI1p5gfDLcz5kttk9ZI",
  "AIzaSyDpuDE6VwGqrMGu7GOTtkpBSdF61EeE_hI",
  "AIzaSyA0dyLHxxuZiUCA2OJa5XE0Cdu0yKwGGYM",
  "AIzaSyCWk9siP7_viiVsz7Wras2_z6Ea_KbWwsw",
  "AIzaSyB_b4tnwrVfefPP9GW2jm_qr06mfeHFvV4",
  "AIzaSyC4Kp4PY_rt7xGPacwikvMzbfxVgo9flc4",
  "AIzaSyAsoQzyuLSu6bfftqSGDE8XFtxB4C5Psps"
];

let currentKeyIndex = 0;

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
  
  if (properties && properties.length > 0) {
    properties.forEach(p => {
      const titleWords = p.title.toLowerCase().split(' ');
      titleWords.forEach(word => {
        if (word.length > 3 && lowerQ.includes(word)) res.city = word;
      });
    });
  }
  return res;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const FAQ_DATA = [
  {
    category: "Getting Started",
    icon: "🚀",
    color: "#4f46e5",
    items: [
      { q: "How do I create my first listing?", a: "Go to Properties → New Listing. Fill in the address, price, description, and upload at least 3 photos. Click 'Publish' to make it live. Your listing will appear in search results within 5 minutes." },
      { q: "How do I invite team members?", a: "Navigate to Settings → Team → Invite Members. Enter their email address and select a role (Admin, Agent, or Viewer). They'll receive an invitation email with setup instructions." },
      { q: "What browsers are supported?", a: "NexusDesk works best on Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+. We recommend Chrome for the best experience. Mobile browsers are fully supported." },
      { q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. Enter your email address and check your inbox for a reset link. The link expires after 30 minutes for security." },
    ]
  },
  {
    category: "Listings & Properties",
    icon: "🏠",
    color: "#10b981",
    items: [
      { q: "How many photos can I upload per listing?", a: "You can upload up to 50 photos per listing on the Standard plan, and unlimited photos on Pro and Enterprise plans. Supported formats: JPG, PNG, WebP. Max file size: 10MB each." },
      { q: "Can I duplicate an existing listing?", a: "Yes! Open the listing, click the '...' menu in the top right, and select 'Duplicate'. A copy will be created with all details except the published date and views count." },
      { q: "How do I mark a property as sold?", a: "Open the listing and change the status dropdown from 'Active' to 'Sold'. You can optionally enter the sale price and closing date for your records." },
      { q: "Why is my listing not showing in search?", a: "Listings take up to 15 minutes to appear in search after publishing. Make sure your listing status is 'Active' and all required fields (address, price, type) are filled in." },
    ]
  },
  {
    category: "Billing & Payments",
    icon: "💳",
    color: "#f59e0b",
    items: [
      { q: "When am I charged?", a: "You're charged on the same day each month (your billing date). For annual plans, you're charged once per year. You'll receive an invoice via email before each charge." },
      { q: "Can I get a refund?", a: "We offer a 14-day money-back guarantee for new subscriptions. For existing plans, refunds are considered on a case-by-case basis. Contact support with your invoice number." },
      { q: "How do I upgrade my plan?", a: "Go to Settings → Billing → Change Plan. Upgrades take effect immediately and you'll be charged a prorated amount for the remainder of your billing cycle." },
      { q: "What payment methods are accepted?", a: "We accept Visa, Mastercard, American Express, and PayPal. Bank transfers are available for Enterprise plans. All payments are processed securely via Stripe." },
    ]
  },
  {
    category: "API & Integrations",
    icon: "⚡",
    color: "#0ea5e9",
    items: [
      { q: "Where do I find my API key?", a: "Go to Settings → API → My Keys. Click 'Generate New Key'. Keep your key secure — it grants full access to your account. Never share it publicly or commit it to version control." },
      { q: "Is there a rate limit on the API?", a: "Standard: 100 req/min. Pro: 1,000 req/min. Enterprise: unlimited. Rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) are included in every API response." },
      { q: "What integrations are available?", a: "We integrate with Zapier, Slack, HubSpot, Salesforce, Google Calendar, Mailchimp, and 50+ other tools. See our Integrations page for the full list and setup guides." },
      { q: "How do I set up webhooks?", a: "Go to Settings → API → Webhooks → Add Endpoint. Enter your HTTPS URL and select events to subscribe to (e.g., new_lead, listing_update). We'll send POST requests with JSON payloads." },
    ]
  },
  {
    category: "Account & Security",
    icon: "🔒",
    color: "#8b5cf6",
    items: [
      { q: "How do I enable two-factor authentication?", a: "Go to Settings → Security → Two-Factor Auth. Scan the QR code with an authenticator app (Google Authenticator or Authy). Enter the 6-digit code to confirm setup." },
      { q: "Can I have multiple users on one account?", a: "Yes! Standard plan supports up to 5 users. Pro supports 20. Enterprise is unlimited. Manage users under Settings → Team. Each user gets their own login credentials." },
      { q: "How is my data protected?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We're SOC 2 Type II certified and GDPR compliant. Daily backups are retained for 90 days." },
      { q: "How do I delete my account?", a: "Go to Settings → Account → Danger Zone → Delete Account. This action is permanent and cannot be undone. All your data, listings, and leads will be permanently deleted after 30 days." },
    ]
  },
];

const VIDEO_TUTORIALS = [
  {
    id: 1,
    title: "Premium Villa Outdoor & Landscape Tour",
    duration: "9:56",
    thumbnail: "🏡",
    category: "Outdoor Tours",
    views: "15.4K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: 2,
    title: "Modern Apartment Indoor & Living Area Walkthrough",
    duration: "10:54",
    thumbnail: "🛋️",
    category: "Indoor Tours",
    views: "18.2K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  },
  {
    id: 3,
    title: "Master Bedroom & En-suite Bathroom Showcase",
    duration: "14:48",
    thumbnail: "🛏️",
    category: "Room Details",
    views: "12.7K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
  },
  {
    id: 4,
    title: "Luxury Kitchen & Dining Space Highlights",
    duration: "12:14",
    thumbnail: "🍳",
    category: "Kitchen Focus",
    views: "9.5K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: 5,
    title: "Smart Home Features & Automation Walkthrough",
    duration: "8:30",
    thumbnail: "⚡",
    category: "Amenities",
    views: "11.1K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: 6,
    title: "Neighborhood & Local Area Overview",
    duration: "6:14",
    thumbnail: "🗺️",
    category: "Location",
    views: "8.9K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  },
  {
    id: 7,
    title: "Penthouse Balcony & City View",
    duration: "4:20",
    thumbnail: "🏙️",
    category: "Views",
    views: "22.3K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
  },
  {
    id: 8,
    title: "Family Home Backyard & Pool Area",
    duration: "7:15",
    thumbnail: "🏊",
    category: "Outdoor Tours",
    views: "10.4K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
  },
  {
    id: 9,
    title: "Garage, Basement & Storage Walkthrough",
    duration: "5:45",
    thumbnail: "🚘",
    category: "Indoor Tours",
    views: "5.2K",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
  }
];
const QUICK_LINKS = [
  { icon: "📖", title: "Documentation", desc: "Full technical docs", color: "#4f46e5" },
  { icon: "🎥", title: "Video Tutorials", desc: "Step-by-step videos", color: "#ec4899" },
  { icon: "💬", title: "Community Forum", desc: "Ask the community", color: "#10b981" },
  { icon: "📣", title: "What's New", desc: "Latest updates", color: "#f59e0b" },
  { icon: "🐛", title: "Report a Bug", desc: "Found an issue?", color: "#ef4444" },
  { icon: "💡", title: "Feature Request", desc: "Suggest improvements", color: "#0ea5e9" },
];

const POPULAR_ARTICLES = [
  { title: "Complete Guide to Managing Properties", reads: "8.2K", time: "8 min read", tag: "Popular" },
  { title: "Lead Generation Best Practices", reads: "6.5K", time: "6 min read", tag: "Popular" },
  { title: "Setting Up Email Automations", reads: "5.1K", time: "5 min read", tag: "New" },
  { title: "Understanding Your Analytics Dashboard", reads: "4.8K", time: "7 min read", tag: "Updated" },
  { title: "API Authentication & Security", reads: "3.9K", time: "10 min read", tag: "Developer" },
  { title: "Team Collaboration Features", reads: "3.2K", time: "4 min read", tag: "New" },
];

// ─── Input Style ──────────────────────────────────────────────────────────────
const getInputStyle = (isDark) => ({
  width: "100%", background: isDark ? "rgba(19, 60, 52, 0.5)" : "#ffffff",
  border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 12,
  color: isDark ? "#f9fafb" : "#0f172a", padding: "12px 16px", fontSize: 15, outline: "none",
  boxSizing: "border-box", fontFamily: "inherit", transition: "border-color 0.2s, box-shadow 0.2s"
});

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ toast, isDark }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, scale: 0.9, x: "-50%" }}
          style={{ position: "fixed", top: 24, left: "50%", zIndex: 2000, background: isDark ? "#133c34" : "#f0fdf4", border: `1px solid ${isDark ? "#cddfa0" : "#bbf7d0"}`, color: isDark ? "#cddfa0" : "#166534", padding: "14px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)", whiteSpace: "nowrap" }}
        >
          {toast}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, maxWidth = 560, isDark }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: isDark ? "rgba(0,0,0,0.8)" : "rgba(15,23,42,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: isDark ? "#091a16" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 20, padding: 28, width: "100%", maxWidth, maxHeight: "88vh", overflowY: "auto", position: "relative", animation: "popIn 0.2s ease", boxShadow: isDark ? "0 25px 50px rgba(0,0,0,0.5)" : "0 25px 50px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>{title}</h2>
          <button onClick={onClose} style={{ background: isDark ? "#1a4a40" : "#f1f5f9", border: "none", color: isDark ? "#cddfa0" : "#64748b", cursor: "pointer", width: 36, height: 36, borderRadius: 10, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = isDark ? "rgba(26, 74, 64, 0.8)" : "#e2e8f0"} onMouseLeave={(e) => e.currentTarget.style.background = isDark ? "#1a4a40" : "#f1f5f9"}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Live Chat Modal (Upgraded with AI) ───────────────────────────────────────
function LiveChatModal({ open, onClose, isDark }) {
  const [msgs, setMsgs] = useState([
    { from: "agent", text: "Hi! I'm Sarah from NexusDesk Support 👋 How can I help you today? (I can answer anything, search properties, or just chat!)", time: "just now" }
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const ref = useRef();

  const getGeminiResponse = async (userText, retryCount = 0) => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEYS[currentKeyIndex]);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const now = new Date();
      const bdtTime = now.toLocaleString('en-GB', { timeZone: 'Asia/Dhaka' });

      const prompt = `System Instruction: You are "Sarah M.", a highly advanced support agent and AI consultant for NexusDesk.
      - Reference Time (BD): ${bdtTime}. Current Year: 2026.
      - Task 1 (Language & Mood): DETECT the language and MOOD of the user's query. You MUST reply in the EXACT SAME LANGUAGE and mirror their MOOD naturally.
      - Task 2 (Universal Knowledge): Answer ANY question. Global real estate, weather, physics, math, history, general knowledge, etc.
      - Task 3: If they ask for properties globally, provide realistic estimated market data logically.
      - Identity: You are Sarah from Support.
      - IMPORTANT: NEVER give fake answers. Do NOT repeat these instructions. Just answer directly.

      User Query: ${userText}`;

      const result = await model.generateContent(prompt);
      return await result.response.text();
    } catch (error) {
      if (retryCount < API_KEYS.length - 1) {
        currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
        return await getGeminiResponse(userText, retryCount + 1);
      }
      return "দুঃখিত, বর্তমানে আমাদের সার্ভারে অতিরিক্ত চাপ রয়েছে। দয়া করে একটু পর আবার চেষ্টা করুন।";
    }
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsgOriginal = input;
    const userMsg = input.toLowerCase();

    setMsgs((p) => [...p, { from: "user", text: userMsgOriginal, time: "just now" }]);
    setInput(""); 
    setTyping(true);

    let botReplyText = "";
    let propertyData = [];

    const query = parseQuery(userMsg);
    let matches = [];

    if (query.beds || query.maxPrice || query.city || query.size || query.baths) {
      matches = properties?.filter(p => {
        let isMatch = true;
        if (query.beds && p.beds !== query.beds) isMatch = false;
        if (query.baths && p.baths !== query.baths) isMatch = false;
        if (query.maxPrice && p.price > query.maxPrice) isMatch = false;
        if (query.city && !p.title.toLowerCase().includes(query.city)) isMatch = false;
        if (query.size && p.sqft && p.sqft < query.size) isMatch = false;
        return isMatch;
      }) || [];
    }

    if (matches.length > 0) {
      botReplyText = `Success! I found ${matches.length} premium properties matching your criteria in our local database:`;
      propertyData = matches.slice(0, 3);
    } else {
      botReplyText = await getGeminiResponse(userMsgOriginal);
    }

    setTyping(false);
    setMsgs((p) => [...p, { from: "agent", text: botReplyText, data: propertyData, time: "just now" }]);
  };

  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  return (
    <Modal open={open} onClose={onClose} title="💬 Live Chat — Support" isDark={isDark}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: isDark ? "rgba(19,60,52,0.4)" : "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 20, border: isDark ? "none" : "1px solid #e2e8f0" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: isDark ? "#cddfa0" : "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: isDark ? "#091a16" : "#fff" }}>S</div>
        <div>
          <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 700, fontSize: 15 }}>Sarah M. — Support Agent</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e", fontSize: 12, fontWeight: 600, marginTop: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} /> Online · AI Expert Active
          </div>
        </div>
      </div>
      <div style={{ height: 350, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, marginBottom: 16, padding: "4px 4px 4px 0", scrollbarWidth: "thin" }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "80%", padding: "12px 16px", borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", background: m.from === "user" ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#f1f5f9"), color: m.from === "user" ? (isDark ? "#091a16" : "#ffffff") : (isDark ? "#f9fafb" : "#0f172a"), fontSize: 15, lineHeight: 1.5, fontWeight: m.from === "user" ? 600 : 500 }}>
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{m.text}</div>
              
              {/* Render Local Property Matches inline if available */}
              {m.data && m.data.length > 0 && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  {m.data.map(r => (
                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 10, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)", padding: 8, borderRadius: 8 }}>
                      {r.image && <img src={r.image} style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} alt="" />}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 12, fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: isDark ? "#cddfa0" : "#4f46e5", fontWeight: "bold" }}>{r.priceLabel || `$${r.price}`}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: "flex", gap: 4, padding: "14px 16px", background: isDark ? "#1a4a40" : "#f1f5f9", borderRadius: "16px 16px 16px 4px", width: "fit-content" }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#cddfa0" : "#94a3b8", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={ref} />
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type your message..." style={{ ...getInputStyle(isDark), flex: 1 }} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
        <button onClick={send} style={{ background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#4f46e5", border: "none", borderRadius: 12, color: isDark ? "#091a16" : "#fff", padding: "12px 24px", cursor: "pointer", fontWeight: 700, fontSize: 15, boxShadow: isDark ? "none" : "0 4px 6px -1px rgba(79, 70, 229, 0.2)" }}>Send</button>
      </div>
    </Modal>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────
function ContactModal({ open, onClose, isDark }) {
  const [form, setForm] = useState({ name: "", email: "", type: "General Question", msg: "" });
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!form.name || !form.email || !form.msg) return;
    setDone(true);
    setTimeout(() => { setDone(false); setForm({ name: "", email: "", type: "General Question", msg: "" }); onClose(); }, 2200);
  };

  if (done) return (
    <Modal open={open} onClose={onClose} title="Contact Support" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>✅</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 22, fontWeight: 800 }}>Message Sent!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 8 }}>We'll get back to you within 2–4 hours.</div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="📩 Contact Support" isDark={isDark}>
      {[["Your Name", "name", "text"], ["Email Address", "email", "email"]].map(([label, key, type]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>{label}</label>
          <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} type={type} placeholder={`Enter ${label.toLowerCase()}...`} style={getInputStyle(isDark)} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
        </div>
      ))}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Topic</label>
        <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} style={getInputStyle(isDark)}>
          {["General Question", "Listings Help", "Billing Issue", "API / Technical", "Bug Report", "Feature Request", "Account Issue"].map((o) => <option key={o} style={{ background: isDark ? "#091a16" : "#fff", color: isDark ? "#fff" : "#000" }}>{o}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Message</label>
        <textarea value={form.msg} onChange={(e) => setForm((p) => ({ ...p, msg: e.target.value }))} rows={4} placeholder="Describe your question or issue..." style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
      </div>
      <button onClick={submit} style={{ width: "100%", background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#0f172a", border: "none", borderRadius: 12, color: isDark ? "#091a16" : "#ffffff", padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Send Message →
      </button>
    </Modal>
  );
}

// ─── Bug Report Modal ─────────────────────────────────────────────────────────
function BugModal({ open, onClose, isDark }) {
  const [form, setForm] = useState({ title: "", steps: "", expected: "", actual: "", severity: "Medium" });
  const [done, setDone] = useState(false);

  const submit = () => {
    if (!form.title || !form.steps) return;
    setDone(true);
    setTimeout(() => { setDone(false); setForm({ title: "", steps: "", expected: "", actual: "", severity: "Medium" }); onClose(); }, 2000);
  };

  if (done) return (
    <Modal open={open} onClose={onClose} title="Bug Report" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🐛</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 22, fontWeight: 800 }}>Bug Reported!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 8 }}>Our engineering team will investigate. Ticket #{Math.floor(10000 + Math.random() * 90000)} created.</div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="🐛 Report a Bug" maxWidth={600} isDark={isDark}>
      {[["Bug Title", "title", "text", "Short description of the bug..."],
        ["Steps to Reproduce", "steps", "textarea", "1. Go to...\n2. Click...\n3. See error..."],
        ["Expected Behavior", "expected", "text", "What should happen?"],
        ["Actual Behavior", "actual", "text", "What actually happens?"]
      ].map(([label, key, type, ph]) => (
        <div key={key} style={{ marginBottom: 16 }}>
          <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>{label}</label>
          {type === "textarea"
            ? <textarea value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} rows={3} placeholder={ph} style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
            : <input value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} placeholder={ph} style={getInputStyle(isDark)} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
          }
        </div>
      ))}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Severity</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {["Low", "Medium", "High", "Critical"].map((s) => (
            <button key={s} onClick={() => setForm((p) => ({ ...p, severity: s }))} style={{
              flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${form.severity === s ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#e2e8f0")}`,
              background: form.severity === s ? (isDark ? "rgba(205, 223, 160, 0.15)" : "#e0e7ff") : (isDark ? "rgba(19, 60, 52, 0.3)" : "#f8fafc"),
              color: form.severity === s ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#9ca3af" : "#64748b"),
              cursor: "pointer", fontWeight: 700, fontSize: 14, transition: "all 0.2s"
            }}>{s}</button>
          ))}
        </div>
      </div>
      <button onClick={submit} style={{ width: "100%", background: "#ef4444", border: "none", borderRadius: 12, color: "#fff", padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Submit Bug Report →
      </button>
    </Modal>
  );
}

// ─── Feature Request Modal ────────────────────────────────────────────────────
function FeatureModal({ open, onClose, isDark }) {
  const [form, setForm] = useState({ title: "", category: "Listings", desc: "" });
  const [done, setDone] = useState(false);

  if (done) return (
    <Modal open={open} onClose={onClose} title="Feature Request" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>💡</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 22, fontWeight: 800 }}>Request Submitted!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 8 }}>We review all feature requests weekly. Thank you for your feedback!</div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="💡 Feature Request" isDark={isDark}>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Feature Title</label>
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="What feature would you like?" style={getInputStyle(isDark)} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Category</label>
        <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} style={getInputStyle(isDark)}>
          {["Listings", "Leads", "Analytics", "API", "Mobile App", "Billing", "Integrations", "UI/UX", "Other"].map((o) => <option key={o} style={{ background: isDark ? "#091a16" : "#fff", color: isDark ? "#fff" : "#000" }}>{o}</option>)}
        </select>
      </div>
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Description</label>
        <textarea value={form.desc} onChange={(e) => setForm((p) => ({ ...p, desc: e.target.value }))} rows={4} placeholder="Describe the feature and why it would be useful..." style={{ ...getInputStyle(isDark), resize: "vertical" }} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
      </div>
      <button onClick={() => { if (form.title) { setDone(true); setTimeout(() => { setDone(false); onClose(); }, 2000); } }} style={{ width: "100%", background: "#0ea5e9", border: "none", borderRadius: 12, color: "#fff", padding: "16px", fontWeight: 800, fontSize: 16, cursor: "pointer", transition: "opacity 0.2s" }} onMouseEnter={(e) => e.target.style.opacity = "0.9"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Submit Request →
      </button>
    </Modal>
  );
}

// ─── Schedule Call Modal ──────────────────────────────────────────────────────
function ScheduleModal({ open, onClose, isDark }) {
  const today = new Date();
  const formatDate = (d) => d.toISOString().split("T")[0];
  const minDate = formatDate(today);
  const maxDate = formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("General Support");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"];
  const callTypes = ["General Support", "Billing Help", "Technical Deep Dive", "Onboarding", "Account Review"];

  const canSubmit = selectedDate && selectedTime && name && email;

  const submit = () => {
    if (!canSubmit) return;
    setDone(true);
    setTimeout(() => { setDone(false); setSelectedDate(""); setSelectedTime(""); setName(""); setEmail(""); onClose(); }, 3000);
  };

  if (done) return (
    <Modal open={open} onClose={onClose} title="Schedule a Call" isDark={isDark}>
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
        <div style={{ color: isDark ? "#cddfa0" : "#0f172a", fontSize: 22, fontWeight: 800 }}>Call Booked!</div>
        <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, marginTop: 10, lineHeight: 1.7 }}>
          <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong><br />
          Topic: {selectedType}<br />
          A confirmation has been sent to <strong>{email}</strong>
        </div>
        <div style={{ marginTop: 20, padding: "14px 20px", background: isDark ? "rgba(16,185,129,0.1)" : "#d1fae5", border: isDark ? "1px solid rgba(16,185,129,0.3)" : "1px solid #a7f3d0", borderRadius: 12, color: isDark ? "#10b981" : "#065f46", fontWeight: 700, fontSize: 14 }}>
          ✅ Calendar invite sent · Zoom link included
        </div>
      </div>
    </Modal>
  );

  return (
    <Modal open={open} onClose={onClose} title="📅 Book a Support Call" maxWidth={580} isDark={isDark}>
      {/* Name & Email */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        {[["Your Name", name, setName, "Alex Johnson"], ["Email Address", email, setEmail, "alex@company.com"]].map(([label, val, setter, ph]) => (
          <div key={label}>
            <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>{label}</label>
            <input value={val} onChange={(e) => setter(e.target.value)} placeholder={ph} style={getInputStyle(isDark)} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
          </div>
        ))}
      </div>

      {/* Call Type */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 10, fontWeight: 700 }}>Call Topic</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {callTypes.map((t) => (
            <button key={t} onClick={() => setSelectedType(t)} style={{
              padding: "8px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
              background: selectedType === t ? (isDark ? "rgba(205,223,160,0.15)" : "#e0e7ff") : (isDark ? "rgba(19,60,52,0.4)" : "#f8fafc"),
              border: `1px solid ${selectedType === t ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#e2e8f0")}`,
              color: selectedType === t ? (isDark ? "#cddfa0" : "#4338ca") : (isDark ? "#9ca3af" : "#64748b"),
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Date Picker */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 8, fontWeight: 700 }}>Select Date</label>
        <input
          type="date"
          value={selectedDate}
          min={minDate}
          max={maxDate}
          onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }}
          style={{ ...getInputStyle(isDark), colorScheme: isDark ? "dark" : "light" }}
          onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }}
          onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }}
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", color: isDark ? "#cddfa0" : "#475569", fontSize: 13, marginBottom: 10, fontWeight: 700 }}>
            Available Times <span style={{ color: isDark ? "#6b7280" : "#94a3b8", fontWeight: 500 }}>— {selectedDate}</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {timeSlots.map((t) => (
              <button key={t} onClick={() => setSelectedTime(t)} style={{
                padding: "10px 6px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                background: selectedTime === t ? (isDark ? "rgba(205,223,160,0.2)" : "#e0e7ff") : (isDark ? "rgba(19,60,52,0.4)" : "#f8fafc"),
                border: `1px solid ${selectedTime === t ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#1a4a40" : "#e2e8f0")}`,
                color: selectedTime === t ? (isDark ? "#cddfa0" : "#4338ca") : (isDark ? "#9ca3af" : "#64748b"),
                transform: selectedTime === t ? "scale(1.03)" : "scale(1)",
              }}>{t}</button>
            ))}
          </div>
        </div>
      )}

      {/* Summary banner */}
      {selectedDate && selectedTime && (
        <div style={{ background: isDark ? "rgba(205,223,160,0.08)" : "#e0e7ff", border: isDark ? "1px solid rgba(205,223,160,0.2)" : "1px solid #c7d2fe", borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22 }}>🗓</span>
          <div style={{ color: isDark ? "#cddfa0" : "#4338ca", fontWeight: 700, fontSize: 14 }}>
            {selectedDate} · {selectedTime} · 30 min Zoom call
          </div>
        </div>
      )}

      <button onClick={submit} disabled={!canSubmit} style={{
        width: "100%", border: "none", borderRadius: 12, padding: "16px", fontWeight: 800, fontSize: 16, cursor: canSubmit ? "pointer" : "not-allowed", transition: "all 0.2s",
        background: canSubmit ? (isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#10b981") : (isDark ? "#1a4a40" : "#e2e8f0"),
        color: canSubmit ? (isDark ? "#091a16" : "#fff") : (isDark ? "#4b5563" : "#94a3b8"),
        opacity: canSubmit ? 1 : 0.7,
      }} onMouseEnter={(e) => { if (canSubmit) e.target.style.opacity = "0.9"; }} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        {canSubmit ? "Confirm Booking →" : "Fill in all fields to book"}
      </button>
    </Modal>
  );
}

// ─── Video Modal — Full Custom HTML5 Player ───────────────────────────────────
function VideoModal({ open, onClose, video, isDark }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalTime, setTotalTime] = useState("0:00");
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const controlTimer = useRef(null);

  const fmt = (s) => {
    if (isNaN(s) || !isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) { videoRef.current.play(); setPlaying(true); }
    else { videoRef.current.pause(); setPlaying(false); }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlTimer.current);
    if (playing) { controlTimer.current = setTimeout(() => setShowControls(false), 2500); }
  };

  // Reset on close
  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setPlaying(false);
      setProgress(0);
      setCurrentTime("0:00");
      setLoading(true);
    }
    if (open) setShowControls(true);
  }, [open]);

  if (!video) return null;

  return (
    <Modal open={open} onClose={() => { setPlaying(false); onClose(); }} title={video.title} maxWidth={700} isDark={isDark}>
      {/* Video Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => playing && setShowControls(false)}
        style={{ borderRadius: 16, overflow: "hidden", background: "#000", position: "relative", cursor: "pointer", aspectRatio: "16/9", marginBottom: 16 }}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v || isNaN(v.duration)) return;
            setProgress((v.currentTime / v.duration) * 100);
            setCurrentTime(fmt(v.currentTime));
          }}
          onLoadedMetadata={() => {
            setTotalTime(fmt(videoRef.current?.duration));
            setLoading(false);
          }}
          onWaiting={() => setLoading(true)}
          onPlaying={() => setLoading(false)}
          onEnded={() => { setPlaying(false); setShowControls(true); }}
          onClick={togglePlay}
        />

        {/* Loading spinner */}
        {loading && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", pointerEvents: "none" }}>
            <div style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.2)", borderTop: "3px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        )}

        {/* Big play button overlay when paused */}
        {!playing && !loading && (
          <div onClick={togglePlay} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.35)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(255,255,255,0.95)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(0,0,0,0.4)", transition: "transform 0.15s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.08)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <span style={{ fontSize: 26, marginLeft: 4, color: "#1a1a2e" }}>▶</span>
            </div>
          </div>
        )}

        {/* Controls overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.85))", padding: "32px 16px 14px", transition: "opacity 0.3s", opacity: showControls ? 1 : 0, pointerEvents: showControls ? "all" : "none" }}>
          {/* Progress bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              if (videoRef.current && videoRef.current.duration) {
                videoRef.current.currentTime = pct * videoRef.current.duration;
              }
            }}
            style={{ height: 5, background: "rgba(255,255,255,0.25)", borderRadius: 4, marginBottom: 12, cursor: "pointer", position: "relative" }}
            onMouseEnter={(e) => e.currentTarget.children[0].style.height = "7px"}
            onMouseLeave={(e) => e.currentTarget.children[0].style.height = "5px"}
          >
            <div style={{ width: `${progress}%`, height: "100%", background: isDark ? "#cddfa0" : "#818cf8", borderRadius: 4, transition: "width 0.1s linear", position: "relative" }}>
              <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: "#fff", boxShadow: "0 0 4px rgba(0,0,0,0.4)" }} />
            </div>
          </div>

          {/* Buttons row */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={togglePlay} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", fontSize: 18, padding: 0, display: "flex", alignItems: "center", lineHeight: 1 }}>
              {playing ? "⏸" : "▶"}
            </button>
            {/* Seek -10 */}
            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 }} title="Rewind 10s">⏮ 10s</button>
            {/* Seek +10 */}
            <button onClick={() => { if (videoRef.current) videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10); }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", cursor: "pointer", fontSize: 13, fontWeight: 700, padding: 0 }} title="Skip 10s">10s ⏭</button>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 700 }}>{currentTime} / {totalTime}</span>
            <div style={{ flex: 1 }} />
            {/* Volume */}
            <button onClick={() => { if (videoRef.current) { videoRef.current.muted = !muted; setMuted(!muted); } }} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.85)", cursor: "pointer", fontSize: 16, padding: 0 }}>
              {muted ? "🔇" : volume > 0.5 ? "🔊" : "🔉"}
            </button>
            <input type="range" min="0" max="1" step="0.05" value={muted ? 0 : volume}
              onChange={(e) => { const v = parseFloat(e.target.value); setVolume(v); if (videoRef.current) { videoRef.current.volume = v; videoRef.current.muted = v === 0; setMuted(v === 0); } }}
              style={{ width: 70, accentColor: isDark ? "#cddfa0" : "#818cf8", cursor: "pointer" }}
            />
          </div>
        </div>
      </div>

      {/* Video metadata */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {[["📂 Category", video.category], ["⏱ Duration", totalTime !== "0:00" ? totalTime : video.duration], ["👁 Views", video.views]].map(([k, v]) => (
          <div key={k} style={{ background: isDark ? "rgba(19, 60, 52, 0.3)" : "#f8fafc", borderRadius: 12, padding: "12px 18px", flex: 1, minWidth: 100, border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0" }}>
            <div style={{ color: isDark ? "#cddfa0" : "#64748b", fontSize: 11, fontWeight: 800, textTransform: "uppercase", marginBottom: 6 }}>{k}</div>
            <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 800, fontSize: 15 }}>{v}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Article Modal ────────────────────────────────────────────────────────────
function ArticleModal({ open, onClose, article, isDark }) {
  if (!article) return null;
  const [helpful, setHelpful] = useState(null);
  return (
    <Modal open={open} onClose={onClose} title={article.title} maxWidth={660} isDark={isDark}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <span style={{ background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5", color: isDark ? "#10b981" : "#059669", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #a7f3d0" }}>{article.tag}</span>
        <span style={{ background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9", color: isDark ? "#cddfa0" : "#475569", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{article.time}</span>
        <span style={{ background: isDark ? "rgba(255, 255, 255, 0.05)" : "#f1f5f9", color: isDark ? "#cddfa0" : "#475569", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{article.reads} reads</span>
      </div>
      <div style={{ color: isDark ? "#d1d5db" : "#334155", lineHeight: 1.8, fontSize: 15 }}>
        <p>This article covers everything you need to know about <strong style={{ color: isDark ? "#f9fafb" : "#0f172a" }}>{article.title}</strong>.</p>
        <h3 style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 18, marginTop: 24, marginBottom: 12, fontWeight: 800 }}>Overview</h3>
        <p>NexusDesk provides powerful tools to help real estate professionals manage their workflow efficiently. This guide walks you through the key features and best practices.</p>
        <h3 style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 18, marginTop: 24, marginBottom: 12, fontWeight: 800 }}>Step-by-Step Guide</h3>
        <ol style={{ paddingLeft: 24, marginBottom: 20, listStyleType: "decimal" }}>
          <li style={{ marginBottom: 10, paddingLeft: 8 }}>Log into your NexusDesk dashboard</li>
          <li style={{ marginBottom: 10, paddingLeft: 8 }}>Navigate to the relevant section in the sidebar</li>
          <li style={{ marginBottom: 10, paddingLeft: 8 }}>Follow the on-screen prompts to complete the action</li>
          <li style={{ marginBottom: 10, paddingLeft: 8 }}>Save your changes and verify the result</li>
        </ol>
        <h3 style={{ color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 18, marginTop: 24, marginBottom: 12, fontWeight: 800 }}>Pro Tips</h3>
        <div style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#e0e7ff", border: isDark ? "1px solid #1a4a40" : "1px solid #c7d2fe", borderRadius: 12, padding: "16px 20px", marginTop: 12, color: isDark ? "#e5e7eb" : "#4338ca" }}>
          💡 Use keyboard shortcuts to speed up your workflow. Press <code style={{ background: isDark ? "#091a16" : "#ffffff", padding: "2px 8px", borderRadius: 6, color: isDark ? "#cddfa0" : "#4f46e5", fontWeight: "bold" }}>Ctrl+K</code> to open quick search from anywhere in the app.
        </div>
      </div>
      <div style={{ marginTop: 28, paddingTop: 20, borderTop: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0" }}>
        <div style={{ color: isDark ? "#9ca3af" : "#475569", fontSize: 14, marginBottom: 12, fontWeight: 600 }}>Was this article helpful?</div>
        <div style={{ display: "flex", gap: 12 }}>
          {[["👍 Yes", "yes", isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5", isDark ? "#10b981" : "#059669"], ["👎 No", "no", isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2", isDark ? "#ef4444" : "#b91c1c"]].map(([label, val, bg, col]) => (
            <button key={val} onClick={() => setHelpful(val)} style={{
              background: helpful === val ? bg : (isDark ? "rgba(19, 60, 52, 0.4)" : "#f1f5f9"),
              border: `1px solid ${helpful === val ? col : (isDark ? "#1a4a40" : "#e2e8f0")}`,
              borderRadius: 12, color: helpful === val ? col : (isDark ? "#9ca3af" : "#64748b"),
              padding: "10px 24px", cursor: "pointer", fontWeight: 700, fontSize: 15, transition: "all 0.2s"
            }}>{label}</button>
          ))}
        </div>
        {helpful && <div style={{ color: "#22c55e", fontSize: 14, marginTop: 12, fontWeight: 600 }}>Thanks for your feedback! 🙏</div>}
      </div>
    </Modal>
  );
}

// ─── What's New Modal ─────────────────────────────────────────────────────────
function WhatsNewModal({ open, onClose, isDark }) {
  const updates = [
    { version: "v2.4.0", date: "Sep 20, 2024", tag: "Major", items: ["New Analytics Dashboard with real-time charts", "Bulk listing management with CSV import/export", "AI-powered lead scoring (Beta)"] },
    { version: "v2.3.2", date: "Sep 5, 2024", tag: "Bug Fix", items: ["Fixed email notification delays", "Resolved PDF export formatting issues", "Improved mobile responsiveness"] },
    { version: "v2.3.0", date: "Aug 18, 2024", tag: "Feature", items: ["New webhook system with retry logic", "Zapier integration (50+ zaps)", "Dark mode improvements"] },
  ];
  return (
    <Modal open={open} onClose={onClose} title="📣 What's New" maxWidth={640} isDark={isDark}>
      {updates.map((u) => (
        <div key={u.version} style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <span style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 800, fontSize: 16 }}>{u.version}</span>
            <span style={{
              background: u.tag === "Major" ? (isDark ? "rgba(79, 70, 229, 0.2)" : "#e0e7ff") : u.tag === "Bug Fix" ? (isDark ? "rgba(239, 68, 68, 0.2)" : "#fee2e2") : (isDark ? "rgba(16, 185, 129, 0.2)" : "#d1fae5"),
              color: u.tag === "Major" ? (isDark ? "#818cf8" : "#4338ca") : u.tag === "Bug Fix" ? (isDark ? "#f87171" : "#b91c1c") : (isDark ? "#22c55e" : "#059669"),
              padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700
            }}>{u.tag}</span>
            <span style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginLeft: "auto", fontWeight: 500 }}>{u.date}</span>
          </div>
          <div style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", borderRadius: 14, padding: "16px 20px", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0" }}>
            {u.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, color: isDark ? "#d1d5db" : "#334155", fontSize: 14, padding: "8px 0", borderBottom: i < u.items.length - 1 ? (isDark ? "1px solid #1a4a40" : "1px solid #f1f5f9") : "none", fontWeight: 500 }}>
                <span style={{ color: "#22c55e", fontWeight: "bold" }}>✓</span> {item}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Modal>
  );
}

// ─── Community Forum Modal ────────────────────────────────────────────────────
function ForumModal({ open, onClose, isDark }) {
  const threads = [
    { title: "How to bulk import listings from CSV?", replies: 12, author: "Alex M.", time: "2h ago", solved: true },
    { title: "Best practices for lead follow-up automation", replies: 8, author: "Priya K.", time: "5h ago", solved: false },
    { title: "API webhook not firing on listing update", replies: 5, author: "James L.", time: "1d ago", solved: true },
    { title: "Can I have multiple phone numbers per contact?", replies: 3, author: "Sofia B.", time: "2d ago", solved: false },
    { title: "How to export leads to HubSpot?", replies: 7, author: "Tom R.", time: "3d ago", solved: true },
  ];
  const [newPost, setNewPost] = useState("");
  const [posted, setPosted] = useState(false);
  return (
    <Modal open={open} onClose={onClose} title="💬 Community Forum" maxWidth={640} isDark={isDark}>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Ask the community a question..." style={{ ...getInputStyle(isDark), flex: 1 }} onFocus={(e) => { e.target.style.borderColor = isDark ? "#cddfa0" : "#4f46e5"; }} onBlur={(e) => { e.target.style.borderColor = isDark ? "#1a4a40" : "#e2e8f0"; }} />
        <button onClick={() => { if (newPost.trim()) { setPosted(true); setNewPost(""); setTimeout(() => setPosted(false), 2500); } }} style={{ background: isDark ? "linear-gradient(135deg, #cddfa0, #aebf85)" : "#4f46e5", border: "none", borderRadius: 12, color: isDark ? "#091a16" : "#fff", padding: "12px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Post</button>
      </div>
      {posted && <div style={{ background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5", border: isDark ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid #a7f3d0", borderRadius: 12, padding: "12px 16px", color: isDark ? "#10b981" : "#065f46", fontSize: 14, fontWeight: 700, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><CheckCircle size={18} /> Your post has been submitted for review!</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {threads.map((t, i) => (
          <div key={i} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", borderRadius: 14, padding: "16px 20px", cursor: "pointer", transition: "all 0.2s", border: isDark ? "1px solid transparent" : "1px solid #e2e8f0" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? "rgba(26, 74, 64, 0.6)" : "#f8fafc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff"; }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 15, fontWeight: 700, lineHeight: 1.5 }}>{t.title}</div>
              {t.solved && <span style={{ background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5", color: isDark ? "#10b981" : "#059669", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>Solved</span>}
            </div>
            <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, marginTop: 8, fontWeight: 500 }}>{t.author} · {t.replies} replies · {t.time}</div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ─── Documentation Modal ──────────────────────────────────────────────────────
function DocsModal({ open, onClose, isDark }) {
  const [active, setActive] = useState("overview");
  const sections = {
    overview: { title: "Overview", content: "NexusDesk API provides RESTful endpoints to manage listings, leads, contacts, and more.\n\nBase URL:\nhttps://api.nexusdesk.com/v2/\n\nAll endpoints return JSON. Use HTTPS only." },
    auth: { title: "Authentication", content: 'All requests require an Authorization header:\n\nAuthorization: Bearer YOUR_API_KEY\n\nGenerate your key from:\nSettings → API → Keys\n\nKeys have no expiry but can be revoked anytime.' },
    listings: { title: "Listings API", content: "GET    /listings         List all listings\nPOST   /listings         Create listing\nGET    /listings/:id     Get listing\nPUT    /listings/:id     Update listing\nDELETE /listings/:id     Delete listing\n\nQuery params: ?status=active&limit=50&page=1" },
    leads: { title: "Leads API", content: "GET    /leads            List all leads\nPOST   /leads            Create lead\nGET    /leads/:id        Get lead details\nPUT    /leads/:id        Update lead stage\nDELETE /leads/:id        Remove lead\n\nStages: new, contacted, qualified, closed" },
    webhooks: { title: "Webhooks", content: "Subscribe to events:\n  • new_lead\n  • listing_update\n  • ticket_created\n  • lead_status_change\n\nPayload: JSON via POST to your endpoint.\n\nRetry logic: 3 attempts with exponential backoff." },
  };
  return (
    <Modal open={open} onClose={onClose} title="📖 Documentation" maxWidth={700} isDark={isDark}>
      <div style={{ display: "flex", gap: 20, flexDirection: "row", flexWrap: "wrap" }}>
        <div style={{ width: "100%", maxWidth: 180, flexShrink: 0 }}>
          {Object.entries(sections).map(([key, { title }]) => (
            <button key={key} onClick={() => setActive(key)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: active === key ? (isDark ? "rgba(205, 223, 160, 0.15)" : "#e0e7ff") : "transparent",
              border: "none", borderRadius: 10,
              color: active === key ? (isDark ? "#cddfa0" : "#4338ca") : (isDark ? "#9ca3af" : "#64748b"),
              padding: "10px 14px", cursor: "pointer", fontSize: 14, fontWeight: active === key ? 700 : 500, marginBottom: 6, transition: "all 0.2s"
            }}>{title}</button>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 250 }}>
          <h3 style={{ margin: "0 0 16px", color: isDark ? "#f9fafb" : "#0f172a", fontSize: 18, fontWeight: 800 }}>{sections[active].title}</h3>
          <pre style={{ background: isDark ? "#091a16" : "#f8fafc", borderRadius: 14, padding: "20px", color: isDark ? "#d1d5db" : "#334155", fontSize: 14, lineHeight: 1.8, overflow: "auto", whiteSpace: "pre-wrap", margin: 0, fontFamily: "monospace", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0" }}>
            {sections[active].content}
          </pre>
        </div>
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const themeContext = useTheme() || {};
  const isDark = themeContext.isDark || false;

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState({});
  const [chatOpen, setChatOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [bugOpen, setBugOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [articleModal, setArticleModal] = useState(null);
  const [whatsNewOpen, setWhatsNewOpen] = useState(false);
  const [forumOpen, setForumOpen] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState("faq");

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSearchOpen(search.trim().length > 0);
  }, [search]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text)
      .then(() => showToast(`✅ ${label} copied to clipboard!`))
      .catch(() => showToast(`📋 ${label}: ${text}`));
  };

  const toggleFaq = (cat, i) => setOpenFaq((p) => ({ ...p, [`${cat}-${i}`]: !p[`${cat}-${i}`] }));

  const allFaqs = FAQ_DATA.flatMap((c) => c.items.map((item) => ({ ...item, category: c.category })));
  const filtered = search ? allFaqs.filter((f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())) : null;

  const handleQuickLink = (title) => {
    if (title === "Documentation") setDocsOpen(true);
    else if (title === "Community Forum") setForumOpen(true);
    else if (title === "What's New") setWhatsNewOpen(true);
    else if (title === "Report a Bug") setBugOpen(true);
    else if (title === "Feature Request") setFeatureOpen(true);
    else if (title === "Video Tutorials") setActiveTab("videos");
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: isDark ? "#091a16" : "#f8fafc", fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 44, height: 44, border: `4px solid ${isDark ? "#1a4a40" : "#e2e8f0"}`, borderTop: `4px solid ${isDark ? "#cddfa0" : "#4f46e5"}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <div style={{ marginTop: 20, color: isDark ? "#cddfa0" : "#475569", fontWeight: 700, fontSize: 15, letterSpacing: 1, textTransform: "uppercase" }}>Loading Knowledge Base...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ background: isDark ? "#091a16" : "#f8fafc", minHeight: "100vh", padding: "32px 24px", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: isDark ? "#f9fafb" : "#0f172a", boxSizing: "border-box", overflowX: "hidden", transition: "background 0.3s ease, color 0.3s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${isDark ? "#091a16" : "#f1f5f9"}; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? "#1a4a40" : "#cbd5e1"}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? "#2a6659" : "#94a3b8"}; }

        @keyframes popIn { from { transform:scale(0.96);opacity:0 } to { transform:scale(1);opacity:1 } }
        @keyframes bounce { 0%,60%,100% { transform:translateY(0) } 30% { transform:translateY(-4px) } }
        @keyframes slideDown { from { opacity:0;transform:translateY(-10px) } to { opacity:1;transform:translateY(0) } }
        @keyframes slideIn { from { transform:translateY(-20px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .faq-item:hover { background: ${isDark ? "rgba(26, 74, 64, 0.6)" : "#f8fafc"} !important; }
        .card-hover:hover { transform:translateY(-4px); box-shadow: ${isDark ? "0 12px 24px -8px rgba(205, 223, 160, 0.15)" : "0 12px 24px -8px rgba(79, 70, 229, 0.15)"} !important; border-color: ${isDark ? "rgba(205, 223, 160, 0.3)" : "#cbd5e1"} !important; }
        .card-hover { transition:all 0.2s ease; }
        .btn-h:hover { transform:translateY(-2px); box-shadow: 0 6px 12px -4px rgba(0,0,0,0.1); }
        .btn-h:active { transform:translateY(0); }
        .btn-h { transition:all 0.2s ease; }
        .tab-btn:hover { background: ${isDark ? "rgba(26, 74, 64, 0.4)" : "#f1f5f9"} !important; }
        .search-item:hover { background: ${isDark ? "rgba(26, 74, 64, 0.6)" : "#f1f5f9"} !important; }

        /* Stats Card Hover CSS */
        .stat-card {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
          opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: ${isDark ? "0 15px 30px -10px rgba(205, 223, 160, 0.15)" : "0 15px 30px -10px rgba(79, 70, 229, 0.2)"} !important;
          border-color: ${isDark ? "#cddfa0" : "#818cf8"} !important;
        }
        .stat-card:hover::before { opacity: 1; }
        .stat-icon-wrapper { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .stat-card:hover .stat-icon-wrapper { transform: scale(1.15) rotate(5deg); }

        .ql-grid { display: grid; grid-template-columns: repeat(6,1fr); gap: 16px; margin-bottom: 32px; }
        .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
        .article-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .stats-grid-bottom { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 36px; }

        /* Custom Mobile Tabs Horizontal Scroll */
        .custom-nav-scroll {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth;
          scrollbar-width: none !important; /* Hide on Firefox */
        }
        .custom-nav-scroll::-webkit-scrollbar { display: none; } /* Hide on Chrome/Safari */

        @media (max-width: 1200px) {
          .ql-grid { grid-template-columns: repeat(3,1fr); }
          .article-grid { grid-template-columns: repeat(2, 1fr); }
          .stats-grid-bottom { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .faq-grid { grid-template-columns: 1fr; }
          .ql-grid { grid-template-columns: repeat(2,1fr); }
          .article-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .header-flex { flex-direction: column; align-items: flex-start !important; }
          .stats-grid-bottom { grid-template-columns: 1fr; }
          .tab-container { overflow-x: auto; white-space: nowrap; padding-bottom: 8px; flex-wrap: nowrap; }
        }
      `}</style>

      <Toast toast={toast} isDark={isDark} />

      <div style={{ maxWidth: 1300, margin: "0 auto" }}>

        {/* ── Updated Header Area ── */}
        <div className="header-flex" style={{ marginBottom: 36, display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ 
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 12px", borderRadius: 8, fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1.5,
                  background: isDark ? "rgba(19, 60, 52, 0.4)" : "#e0e7ff",
                  border: isDark ? "1px solid #1a4a40" : "1px solid #c7d2fe",
                  color: isDark ? "#cddfa0" : "#4338ca", transition: "all 0.3s"
                }}>
                <LifeBuoy size={14} /> NEXUSDESK
              </span>
            </div>
            <h1 style={{ margin: 0, fontSize: "clamp(32px, 5vw, 42px)", fontWeight: 900, letterSpacing: -0.5, color: isDark ? "#ffffff" : "#0f172a" }}>
              Help <span style={{ color: isDark ? "#cddfa0" : "#4f46e5" }}>Center</span>
            </h1>
            <p style={{ margin: "8px 0 0", color: isDark ? "#9ca3af" : "#64748b", fontSize: 15, fontWeight: 500 }}>
              Find answers, guides, and support resources to maximize your workflow.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-h" onClick={() => setChatOpen(true)} style={{ background: isDark ? "#cddfa0" : "#e0e7ff", border: isDark ? "none" : "1px solid #c7d2fe", borderRadius: 12, color: isDark ? "#091a16" : "#4338ca", padding: "12px 20px", cursor: "pointer", fontWeight: 800, fontSize: 14, display: "flex", alignItems: "center", gap: 10, boxShadow: isDark ? "0 4px 15px rgba(205,223,160,0.2)" : "none" }}>
              💬 Live Chat
              <span style={{ background: isDark ? "rgba(9, 26, 22, 0.15)" : "#ffffff", padding: "3px 10px", borderRadius: 20, fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block" }} /> Online
              </span>
            </button>
            <button className="btn-h" onClick={() => setContactOpen(true)} style={{ background: isDark ? "rgba(19, 60, 52, 0.5)" : "#0f172a", border: isDark ? "1px solid #1a4a40" : "none", borderRadius: 12, color: isDark ? "#cddfa0" : "#ffffff", padding: "12px 24px", cursor: "pointer", fontWeight: 800, fontSize: 14 }}>
              📩 Contact Us
            </button>
          </div>
        </div>

        {/* ── Updated Hero Search Area ── */}
        <div style={{ position: "relative", marginBottom: 32, zIndex: 50 }}>
          
          <div style={{ position: "absolute", inset: 0, background: isDark ? "linear-gradient(135deg, #091a16, #0d2420)" : "linear-gradient(135deg, #4f46e5, #312e81)", border: isDark ? "1px solid #1a4a40" : "none", borderRadius: 24, boxShadow: isDark ? "0 20px 40px rgba(0,0,0,0.3)" : "0 20px 40px rgba(79,70,229,0.2)", overflow: "hidden", pointerEvents: "none" }}>
            {isDark && <div style={{ position: "absolute", top: "-50%", left: "-10%", width: "50%", height: "150%", background: "radial-gradient(circle, rgba(205,223,160,0.05) 0%, transparent 70%)" }} />}
          </div>

          <div style={{ padding: "60px 32px", textAlign: "center", position: "relative", zIndex: 10 }}>
            <div style={{ fontSize: 54, marginBottom: 16, textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}>🔍</div>
            <h2 style={{ margin: "0 0 12px", fontSize: 32, fontWeight: 900, color: "#ffffff", letterSpacing: -0.5 }}>How can we help you?</h2>
            <p style={{ margin: "0 0 36px", color: isDark ? "#cddfa0" : "#c7d2fe", fontSize: 16, fontWeight: 600 }}>Search our knowledge base, FAQs, and documentation</p>

            {/* Search Input Container */}
            <div style={{ position: "relative", maxWidth: 650, margin: "0 auto", textAlign: "left" }} ref={searchContainerRef}>
              <div style={{ 
                display: "flex", alignItems: "center", 
                background: isDark ? "rgba(19, 60, 52, 0.6)" : "rgba(255, 255, 255, 0.9)", 
                backdropFilter: "blur(12px)",
                borderRadius: 40, padding: "6px 6px 6px 24px", 
                boxShadow: isDark ? "0 15px 35px rgba(0,0,0,0.4)" : "0 15px 35px rgba(79,70,229,0.15)", 
                border: isDark ? "1px solid rgba(205, 223, 160, 0.2)" : "1px solid rgba(79, 70, 229, 0.2)", 
                transition: "all 0.3s"
              }}
              onFocusCapture={(e) => { 
                e.currentTarget.style.borderColor = isDark ? "#cddfa0" : "#818cf8"; 
                e.currentTarget.style.background = isDark ? "rgba(19, 60, 52, 0.9)" : "#ffffff";
              }}
              onBlurCapture={(e) => { 
                e.currentTarget.style.borderColor = isDark ? "rgba(205, 223, 160, 0.2)" : "rgba(79, 70, 229, 0.2)"; 
                e.currentTarget.style.background = isDark ? "rgba(19, 60, 52, 0.6)" : "rgba(255, 255, 255, 0.9)";
              }}
              >
                <Search size={22} color={isDark ? "#cddfa0" : "#64748b"} style={{ flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => { if (search) setSearchOpen(true); }}
                  placeholder="Search for anything... (e.g. 'reset password', 'API key')"
                  style={{ flex: 1, padding: "16px 16px", fontSize: 16, border: "none", background: "transparent", color: isDark ? "#ffffff" : "#0f172a", outline: "none", fontWeight: 600, width: "100%" }}
                />
                {search && (
                  <button onClick={() => { setSearch(""); setSearchOpen(false); }} style={{ background: isDark ? "rgba(205, 223, 160, 0.15)" : "#f1f5f9", border: "none", color: isDark ? "#cddfa0" : "#64748b", cursor: "pointer", width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 8, transition: "background 0.2s" }} onMouseEnter={e => e.target.style.background = isDark ? "rgba(205, 223, 160, 0.3)" : "#e2e8f0"} onMouseLeave={e => e.target.style.background = isDark ? "rgba(205, 223, 160, 0.15)" : "#f1f5f9"}>
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Search Dropdown - Now floats freely because parent has no overflow:hidden */}
              {searchOpen && search && (
                <div style={{ position: "absolute", top: "calc(100% + 12px)", left: 0, right: 0, background: isDark ? "#091a16" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 20, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", zIndex: 9999, maxHeight: 400, overflowY: "auto", padding: "12px", animation: "slideDown 0.2s ease" }}>
                  {filtered && filtered.length === 0 ? (
                    <div style={{ padding: "40px 20px", textAlign: "center", color: isDark ? "#9ca3af" : "#64748b", fontWeight: 600 }}>
                      <div style={{ fontSize: 40, marginBottom: 16 }}>🤔</div>
                      No matching articles found for "{search}"
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <div style={{ padding: "8px 12px", color: isDark ? "#cddfa0" : "#4f46e5", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: 1, borderBottom: isDark ? "1px solid #1a4a40" : "1px solid #f1f5f9", marginBottom: 8 }}>
                        Top Results ({filtered?.length})
                      </div>
                      {filtered?.map((f, i) => (
                        <div key={i} className="search-item" onClick={() => { setSearch(""); setSearchOpen(false); showToast(`📖 Opened: ${f.q.slice(0, 40)}...`); }} style={{ padding: "14px 16px", borderRadius: 14, cursor: "pointer", transition: "background 0.15s", display: "flex", flexDirection: "column", gap: 6 }}>
                          <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 800, fontSize: 15 }}>{f.q}</div>
                          <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}>{f.a.slice(0, 90)}...</div>
                          <div style={{ display: "inline-block", background: isDark ? "rgba(205, 223, 160, 0.15)" : "#e0e7ff", color: isDark ? "#cddfa0" : "#4f46e5", padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 800, alignSelf: "flex-start", mt: 4 }}>{f.category}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Quick Links ── */}
        <div className="ql-grid">
          {QUICK_LINKS.map((q) => (
            <div key={q.title} className="card-hover" onClick={() => handleQuickLink(q.title)} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, padding: "20px 16px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{q.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4, color: isDark ? "#f9fafb" : "#0f172a" }}>{q.title}</div>
              <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 12, fontWeight: 500 }}>{q.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Tabs (Mobile Scrollable) ── */}
        <div className="tab-container custom-nav-scroll" style={{ display: "flex", gap: 10, marginBottom: 28, borderBottom: isDark ? "2px solid #1a4a40" : "2px solid #e2e8f0" }}>
          {[["faq", "❓ FAQs"], ["articles", "📚 Articles"], ["videos", "🎥 Tutorials"], ["contact", "📞 Contact"]].map(([id, label]) => (
            <button key={id} className="tab-btn" onClick={() => setActiveTab(id)} style={{
              background: "none", border: "none", borderBottom: activeTab === id ? (isDark ? "3px solid #cddfa0" : "3px solid #4f46e5") : "3px solid transparent",
              color: activeTab === id ? (isDark ? "#cddfa0" : "#4f46e5") : (isDark ? "#6b7280" : "#64748b"), padding: "12px 20px", cursor: "pointer",
              fontWeight: activeTab === id ? 800 : 600, fontSize: 15, marginBottom: -2, transition: "all 0.2s", borderRadius: "8px 8px 0 0", whiteSpace: "nowrap"
            }}>{label}</button>
          ))}
        </div>

        {/* ── FAQ Tab ── */}
        {activeTab === "faq" && (
          <div className="faq-grid">
            {FAQ_DATA.map((cat) => (
              <div key={cat.category} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, background: isDark ? "rgba(205, 223, 160, 0.15)" : `${cat.color}15`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{cat.icon}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: isDark ? "#f9fafb" : "#0f172a" }}>{cat.category}</div>
                    <div style={{ color: isDark ? "#cddfa0" : cat.color, fontSize: 13, fontWeight: 700, marginTop: 2 }}>{cat.items.length} articles</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`;
                    const isOpen = openFaq[key];
                    return (
                      <div key={i} className="faq-item" onClick={() => toggleFaq(cat.category, i)} style={{ background: isDark ? (isOpen ? "rgba(26, 74, 64, 0.6)" : "rgba(9, 26, 22, 0.6)") : (isOpen ? "#f8fafc" : "#ffffff"), borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s", border: isDark ? `1px solid ${isOpen ? "#cddfa0" : "#1a4a40"}` : `1px solid ${isOpen ? cat.color : "#e2e8f0"}` }}>
                        <div style={{ padding: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                          <span style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 700, lineHeight: 1.5 }}>{item.q}</span>
                          <span style={{ color: isDark ? "#cddfa0" : cat.color, fontSize: 18, flexShrink: 0, transition: "transform 0.3s", transform: isOpen ? "rotate(180deg)" : "none", fontWeight: "bold" }}>⌄</span>
                        </div>
                        {isOpen && (
                          <div style={{ padding: "0 16px 16px", color: isDark ? "#9ca3af" : "#475569", fontSize: 14, lineHeight: 1.7, animation: "slideDown 0.3s", fontWeight: 500 }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* ── Empty Space Fill Card ── */}
            <div style={{ background: isDark ? "linear-gradient(135deg, rgba(19,60,52,0.8), rgba(9,26,22,0.8))" : "linear-gradient(135deg, #f1f5f9, #ffffff)", border: isDark ? "1px dashed #cddfa0" : "1px dashed #94a3b8", borderRadius: 16, padding: 32, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", height: "100%" }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🧑‍💻</div>
              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: isDark ? "#f9fafb" : "#0f172a" }}>Still need help?</h3>
              <p style={{ margin: "0 0 24px", color: isDark ? "#9ca3af" : "#64748b", fontSize: 14, fontWeight: 500, lineHeight: 1.6 }}>Can't find the answer you're looking for? Our dedicated support team is available 24/7 to assist you.</p>
              <button className="btn-h" onClick={() => setContactOpen(true)} style={{ background: isDark ? "#cddfa0" : "#0f172a", border: "none", borderRadius: 12, color: isDark ? "#091a16" : "#ffffff", padding: "14px 28px", cursor: "pointer", fontWeight: 800, fontSize: 15, boxShadow: isDark ? "0 4px 15px rgba(205,223,160,0.2)" : "0 4px 15px rgba(0,0,0,0.15)" }}>
                Contact Support
              </button>
            </div>
          </div>
        )}

        {/* ── Articles Tab ── */}
        {activeTab === "articles" && (
          <div className="article-grid">
            {POPULAR_ARTICLES.map((a, i) => (
              <div key={i} className="card-hover" onClick={() => setArticleModal(a)} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, padding: "24px", cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                  <span style={{
                    background: a.tag === "Popular" ? (isDark ? "rgba(79,70,229,0.15)" : "#e0e7ff") : a.tag === "New" ? (isDark ? "rgba(16,185,129,0.15)" : "#d1fae5") : a.tag === "Updated" ? (isDark ? "rgba(245,158,11,0.15)" : "#ffedd5") : (isDark ? "rgba(14,165,233,0.15)" : "#e0f2fe"),
                    color: a.tag === "Popular" ? (isDark ? "#818cf8" : "#4338ca") : a.tag === "New" ? (isDark ? "#10b981" : "#059669") : a.tag === "Updated" ? (isDark ? "#fbbf24" : "#c2410c") : (isDark ? "#38bdf8" : "#0369a1"),
                    padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800
                  }}>{a.tag}</span>
                </div>
                <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontWeight: 800, fontSize: 16, lineHeight: 1.5, marginBottom: 16 }}>{a.title}</div>
                <div style={{ display: "flex", justifyContent: "space-between", color: isDark ? "#6b7280" : "#64748b", fontSize: 13, fontWeight: 600 }}>
                  <span>{a.reads} reads</span>
                  <span>{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Videos Tab ── */}
        {activeTab === "videos" && (
          <div className="article-grid">
            {VIDEO_TUTORIALS.map((v) => (
              <div key={v.id} className="card-hover" onClick={() => setVideoModal(v)} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", cursor: "pointer" }}>
                <div style={{ background: isDark ? "linear-gradient(135deg, #0d2420, #091a16)" : "linear-gradient(135deg, #e0e7ff, #f1f5f9)", padding: "40px 20px", textAlign: "center", borderBottom: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", position: "relative" }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>{v.thumbnail}</div>
                  <div style={{ background: isDark ? "rgba(205, 223, 160, 0.2)" : "#4f46e5", color: isDark ? "#cddfa0" : "#fff", padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 800, display: "inline-flex", alignItems: "center", gap: 6, border: isDark ? "1px solid rgba(205, 223, 160, 0.3)" : "none" }}>
                    ▶ Watch
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 10, color: isDark ? "#f9fafb" : "#0f172a", lineHeight: 1.5 }}>{v.title}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: isDark ? "#6b7280" : "#64748b", fontSize: 13, fontWeight: 600 }}>
                    <span style={{ background: isDark ? "#1a4a40" : "#f1f5f9", padding: "4px 10px", borderRadius: 20 }}>{v.category}</span>
                    <span>{v.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Contact Tab ── */}
        {activeTab === "contact" && (
          <div className="faq-grid">
            {[
              { icon: "💬", title: "Live Chat", desc: "Get instant help from our support team. Average response time under 2 minutes.", action: () => setChatOpen(true), btn: "Start Chat", lightColor: "#4f46e5", badge: "Online" },
              { icon: "📩", title: "Send a Message", desc: "Submit a detailed message and we'll get back to you within 2–4 hours.", action: () => setContactOpen(true), btn: "Send Message", lightColor: "#8b5cf6" },
              { icon: "📧", title: "Email Support", desc: "Send us an email at support@nexusdesk.com. We reply within 24 hours.", action: () => copyToClipboard("support@nexusdesk.com", "Email address"), btn: "Copy Email", lightColor: "#0ea5e9" },
              { icon: "📞", title: "Schedule a Call", desc: "Book a 30-minute Zoom call with a support specialist for complex issues.", action: () => setScheduleOpen(true), btn: "Book a Call", lightColor: "#10b981" },
              { icon: "🐛", title: "Report a Bug", desc: "Found something broken? Let us know and we'll fix it fast.", action: () => setBugOpen(true), btn: "Report Bug", lightColor: "#ef4444" },
              { icon: "💡", title: "Feature Request", desc: "Have an idea? We review all feature requests every week.", action: () => setFeatureOpen(true), btn: "Submit Request", lightColor: "#f59e0b" },
            ].map((c, i) => (
              <div key={i} style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 16, padding: "24px" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                  <div style={{ width: 48, height: 48, background: isDark ? "rgba(205, 223, 160, 0.15)" : `${c.lightColor}15`, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, border: isDark ? "1px solid rgba(205, 223, 160, 0.2)" : `1px solid ${c.lightColor}30` }}>{c.icon}</div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <span style={{ fontWeight: 800, fontSize: 17, color: isDark ? "#f9fafb" : "#0f172a" }}>{c.title}</span>
                      {c.badge && <span style={{ background: isDark ? "rgba(16, 185, 129, 0.15)" : "#d1fae5", color: isDark ? "#10b981" : "#059669", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 800 }}>{c.badge}</span>}
                    </div>
                    <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>{c.desc}</div>
                  </div>
                </div>
                <button className="btn-h" onClick={c.action} style={{ background: isDark ? "rgba(205, 223, 160, 0.15)" : c.lightColor, border: isDark ? `1px solid rgba(205,223,160,0.3)` : "none", borderRadius: 12, color: isDark ? "#cddfa0" : "#fff", padding: "12px 20px", cursor: "pointer", fontWeight: 700, fontSize: 14, width: "100%", boxShadow: isDark ? "none" : `0 4px 6px -1px ${c.lightColor}40` }}>
                  {c.btn}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Upgraded Bottom Stats ── */}
        <div className="stats-grid-bottom">
          {[
            { icon: "📚", label: "Articles", value: "200+", sub: "In knowledge base" },
            { icon: "⏱", label: "Avg Response", value: "<2 min", sub: "Live chat" },
            { icon: "⭐", label: "Satisfaction", value: "98.2%", sub: "Customer rating" },
            { icon: "🌍", label: "Languages", value: "12", sub: "Supported" },
          ].map((s, i) => (
            <div key={i} className="stat-card" style={{ background: isDark ? "rgba(19, 60, 52, 0.4)" : "#ffffff", border: isDark ? "1px solid #1a4a40" : "1px solid #e2e8f0", borderRadius: 20, padding: "24px 20px", display: "flex", alignItems: "center", gap: 18 }}>
              <div className="stat-icon-wrapper" style={{ width: 56, height: 56, background: isDark ? "rgba(205, 223, 160, 0.15)" : "#e0e7ff", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, border: isDark ? "1px solid rgba(205, 223, 160, 0.2)" : "1px solid #c7d2fe", flexShrink: 0 }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: isDark ? "#cddfa0" : "#4f46e5", letterSpacing: -0.5, marginBottom: 2 }}>{s.value}</div>
                <div style={{ color: isDark ? "#f9fafb" : "#0f172a", fontSize: 14, fontWeight: 800 }}>{s.label}</div>
                <div style={{ color: isDark ? "#9ca3af" : "#64748b", fontSize: 12, fontWeight: 600 }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── Modals ── */}
      <LiveChatModal open={chatOpen} onClose={() => setChatOpen(false)} isDark={isDark} />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} isDark={isDark} />
      <BugModal open={bugOpen} onClose={() => setBugOpen(false)} isDark={isDark} />
      <FeatureModal open={featureOpen} onClose={() => setFeatureOpen(false)} isDark={isDark} />
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} isDark={isDark} />
      <VideoModal open={!!videoModal} onClose={() => setVideoModal(null)} video={videoModal} isDark={isDark} />
      <ArticleModal open={!!articleModal} onClose={() => setArticleModal(null)} article={articleModal} isDark={isDark} />
      <WhatsNewModal open={whatsNewOpen} onClose={() => setWhatsNewOpen(false)} isDark={isDark} />
      <ForumModal open={forumOpen} onClose={() => setForumOpen(false)} isDark={isDark} />
      <DocsModal open={docsOpen} onClose={() => setDocsOpen(false)} isDark={isDark} />
    </div>
  );
}