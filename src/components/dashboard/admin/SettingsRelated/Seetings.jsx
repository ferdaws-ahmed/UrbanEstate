"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Lock, Shield, Bell, CreditCard, Key, Globe,
  Moon, Smartphone, Monitor, Trash2, Download, Upload,
  Eye, EyeOff, Check, X, ChevronRight, RefreshCw, Plus,
  AlertTriangle, LogOut, Users, Zap, Camera, Edit3, Save, 
  Copy, RotateCw, MapPin, CheckCircle, XCircle, Info, 
  Wifi, WifiOff, Settings as SettingsIcon, FileText, Sliders, Share2
} from "lucide-react";
import { useTheme } from "../../../ThemeProvider";

// ─── Custom Hook for Local Storage (Globally Synced) ──────────────────────────

function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn("Error reading localStorage", error);
    }

    // Custom Event Listener for Same-Tab Syncing
    const handleCustomEvent = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    // Standard Storage Event Listener for Cross-Tab Syncing
    const handleStorageEvent = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('onLocalStorageChange', handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('onLocalStorageChange', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (isMounted) {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch Custom Event for components in the same tab
        window.dispatchEvent(new CustomEvent('onLocalStorageChange', { 
          detail: { key, value: valueToStore } 
        }));
        
        // Dispatch specific event for Topbar and other global listeners
        if (key === 'ue_profile') {
          window.dispatchEvent(new Event('profileUpdated'));
        }
      }
    } catch (error) {
      console.warn("Error setting localStorage", error);
    }
  };

  return [storedValue, setValue];
}

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ toasts, removeToast, isDark }) {
  return (
    <div className="fixed top-5 right-5 z-[200] flex flex-col gap-2 pointer-events-none w-[90%] sm:w-auto max-w-sm">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-bold backdrop-blur-md
              ${t.type === "success"
                ? isDark ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-emerald-500/20" : "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-emerald-100"
                : t.type === "error"
                ? isDark ? "bg-rose-500/20 border-rose-500/50 text-rose-400 shadow-rose-500/20" : "bg-rose-50 border-rose-200 text-rose-700 shadow-rose-100"
                : isDark ? "bg-[#cddfa0]/20 border-[#cddfa0]/50 text-[#cddfa0] shadow-[#cddfa0]/20" : "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-indigo-100"
              }`}
          >
            <div className="flex items-center gap-3">
              {t.type === "success" ? <CheckCircle size={17} className="flex-shrink-0" /> : t.type === "error" ? <XCircle size={17} className="flex-shrink-0" /> : <Info size={17} className="flex-shrink-0" />}
              <span className="leading-tight">{t.message}</span>
            </div>
            <button onClick={() => removeToast(t.id)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity flex-shrink-0">
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Toggle Component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange, disabled = false, isDark }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none
        ${checked 
          ? isDark ? "bg-[#cddfa0] shadow-[0_0_12px_rgba(205,223,160,0.4)]" : "bg-indigo-600 shadow-md" 
          : isDark ? "bg-[#1a4a40]" : "bg-gray-300"
        }
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
      `}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
          ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon: Icon, children, badge, badgeColor = "green", isDark }) {
  const colors = isDark ? {
    green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    blue: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    rose: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    lime: "bg-[#cddfa0]/15 text-[#cddfa0] border-[#cddfa0]/30",
  } : {
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
    lime: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  return (
    <div className={`rounded-2xl overflow-hidden backdrop-blur-md border transition-all duration-300
      ${isDark ? 'bg-[rgba(19,60,52,0.4)] border-[#1a4a40] hover:border-[rgba(26,74,64,0.6)]' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-4 border-b ${isDark ? 'border-[#1a4a40]/60 bg-[#133c34]/30' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 ${isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-indigo-100 text-indigo-600'}`}>
            <Icon size={16} />
          </div>
          <h3 className={`text-[14px] sm:text-[15px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
        </div>
        {badge && (
          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap ${colors[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 md:p-6">{children}</div>
    </div>
  );
}

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, type = "text", value, onChange, placeholder, disabled, suffix, icon: Icon, hint, isDark }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>}
      <div className="relative flex items-center">
        {Icon && <Icon size={16} className={`absolute left-3.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />}
        <input
          type={type === "password" ? (show ? "text" : "password") : type}
          value={value}
          onChange={e => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed
            ${isDark 
              ? 'bg-[#091a16] border border-[#1a4a40] text-white placeholder-gray-600 focus:border-[#cddfa0]/80 focus:bg-[#133c34]/40 focus:ring-1 focus:ring-[#cddfa0]/10' 
              : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10'}
            ${Icon ? "pl-10" : ""}
            ${type === "password" ? "pr-10" : ""}
            ${suffix ? "pr-20" : ""}
          `}
        />
        {type === "password" && (
          <button type="button" onClick={() => setShow(!show)} className={`absolute right-3.5 transition-colors ${isDark ? 'text-gray-500 hover:text-[#cddfa0]' : 'text-gray-400 hover:text-indigo-600'}`}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {suffix && <span className="absolute right-4 text-xs text-gray-500 font-bold">{suffix}</span>}
      </div>
      {hint && <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{hint}</p>}
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────
function SelectField({ label, value, onChange, options, isDark }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 cursor-pointer appearance-none
            ${isDark 
              ? 'bg-[#091a16] border border-[#1a4a40] text-white focus:border-[#cddfa0]/80 focus:bg-[#133c34]/40 focus:ring-1 focus:ring-[#cddfa0]/10' 
              : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10'}
          `}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className={isDark ? 'bg-[#091a16] text-white' : 'bg-white text-gray-900'}>{opt.label}</option>
          ))}
        </select>
        <ChevronRight size={14} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, danger = false, isDark }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`rounded-3xl p-6 sm:p-7 w-full max-w-sm shadow-2xl border ${isDark ? 'bg-[#091a16] border-[#1a4a40]/60' : 'bg-white border-gray-200'}`}
      >
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 
          ${danger 
            ? (isDark ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" : "bg-rose-50 text-rose-600 border border-rose-100") 
            : (isDark ? "bg-[#cddfa0]/15 text-[#cddfa0] border border-[#cddfa0]/20" : "bg-indigo-50 text-indigo-600 border border-indigo-100")}`}>
          <AlertTriangle size={24} />
        </div>
        <h3 className={`text-lg sm:text-xl font-black mb-2.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm mb-7 leading-relaxed font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{message}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCancel} className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all
            ${isDark ? 'border-[#1a4a40] text-gray-300 hover:bg-[#1a4a40]/50 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 rounded-xl font-black text-sm transition-all shadow-lg text-white sm:hover:-translate-y-0.5
              ${danger 
                ? "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20" 
                : (isDark ? "bg-[#cddfa0] hover:bg-[#b8cc80] text-[#091a16] shadow-[#cddfa0]/20" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20")}`}
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Settings Nav Tab ─────────────────────────────────────────────────────────
function SettingsNavTab({ id, label, icon: Icon, active, onClick, badge, isDark }) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative w-auto flex-shrink-0 flex items-center gap-2.5 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl text-[12px] sm:text-[13px] font-bold transition-all duration-300 text-center whitespace-nowrap overflow-hidden group
        ${active
          ? isDark 
            ? "bg-[#1a4a40]/40 text-[#cddfa0]" 
            : "bg-indigo-50 text-indigo-700"
          : isDark 
            ? "text-gray-400 hover:bg-[#1a4a40]/20 hover:text-gray-200" 
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      {active && (
        <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-t-full
          ${isDark ? 'bg-[#cddfa0]' : 'bg-indigo-600'}`} 
        />
      )}
      
      <Icon size={18} className={`transition-transform duration-300 flex-shrink-0 ${active ? (isDark ? "text-[#cddfa0] scale-110" : "text-indigo-600 scale-110") : "group-hover:scale-110"}`} />
      <span className="tracking-wide">{label}</span>
      
      {badge && (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ml-1 flex-shrink-0
          ${isDark ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-rose-100 text-rose-600 border-rose-200'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SETTINGS COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Settings() {
  const themeContext = useTheme() || {};
  const isDark = themeContext.isDark || false;
  const toggleTheme = themeContext.toggleTheme;
  const setTheme = themeContext.setTheme;
  const setIsDark = themeContext.setIsDark;

  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", onConfirm: null, danger: false });
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const fileInputRef = useRef(null);

  // Loading Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ── States With useLocalStorage (Data is preserved on reload) ──────────────
  const [profile, setProfile] = useLocalStorage("ue_profile", {
    firstName: "Sabbir", lastName: "Ahmad",
    email: "sabbir@urbanestate.io", phone: "+880 1700-000000",
    jobTitle: "MERN Stack Developer", department: "Engineering",
    bio: "Developer at UrbanEstate, building awesome user experiences and scalable APIs.",
    avatar: null,
    city: "Dhaka", country: "Bangladesh", timezone: "Asia/Dhaka",
    currency: "BDT", language: "en",
  });

  const [security, setSecurity] = useLocalStorage("ue_security", {
    currentPassword: "", newPassword: "", confirmPassword: "",
    twoFactor: true, biometric: false, sessionTimeout: "60",
    ipWhitelist: false,
  });

  const [activeSessions, setActiveSessions] = useLocalStorage("ue_sessions", [
    { id: 1, device: "Chrome — Windows 11", location: "Dhaka, BD", ip: "103.x.x.1", time: "Active now", current: true },
    { id: 2, device: "Safari — iPhone 15", location: "Dhaka, BD", ip: "103.x.x.2", time: "2 hours ago", current: false },
    { id: 3, device: "Firefox — macOS", location: "Gulshan, BD", ip: "103.x.x.3", time: "Yesterday", current: false },
  ]);

  const [notifs, setNotifs] = useLocalStorage("ue_notifs", {
    newListing: { email: true, inApp: true, sms: false },
    propertySold: { email: true, inApp: true, sms: true },
    priceChange: { email: false, inApp: true, sms: false },
    newLead: { email: true, inApp: true, sms: true },
    clientInquiry: { email: true, inApp: true, sms: false },
    pendingApproval: { email: false, inApp: true, sms: false },
    marketReport: { email: true, inApp: false, sms: false },
    agentPerformance: { email: true, inApp: true, sms: false },
    systemAlerts: { email: true, inApp: true, sms: true },
  });

  const [appearance, setAppearance] = useLocalStorage("ue_appearance", {
    theme: isDark ? "dark" : "light", accent: isDark ? "#cddfa0" : "#4f46e5", fontSize: "md",
    sidebarStyle: "compact", reducedMotion: false,
    compactTables: true, showMapDefault: true,
    cardDensity: "comfortable",
  });

  const [billing, setBilling] = useLocalStorage("ue_billing", {
    plan: "Pro", storage: { used: 6, total: 25 },
    nextBilling: "Oct 25, 2026", amount: "$49",
    cards: [
      { id: 1, last4: "1234", brand: "Visa", exp: "08/27", isDefault: true },
      { id: 2, last4: "5678", brand: "Mastercard", exp: "03/26", isDefault: false },
    ],
    history: [
      { date: "Sep 25, 2025", amount: "$49", status: "Paid" },
      { date: "Aug 25, 2025", amount: "$49", status: "Paid" },
      { date: "Jul 25, 2025", amount: "$49", status: "Paid" },
    ],
    usage: { users: 85, maxUsers: 100, listings: 248, maxListings: 500 },
  });

  const [integrations, setIntegrations] = useLocalStorage("ue_integrations", [
    { id: "gmaps", name: "Google Maps API", icon: "🗺️", status: "connected", desc: "Property location & area mapping", color: "blue" },
    { id: "salesforce", name: "Salesforce CRM", icon: "☁️", status: "disconnected", desc: "Customer relationship management", color: "blue" },
    { id: "slack", name: "Slack", icon: "💬", status: "connected", desc: "Team notifications & alerts", color: "amber" },
    { id: "whatsapp", name: "WhatsApp Business", icon: "📱", status: "connected", desc: "Client messaging & lead follow-up", color: "green" },
    { id: "mailchimp", name: "Mailchimp", icon: "📧", status: "pending", desc: "Email campaigns & newsletters", color: "amber" },
    { id: "facebook", name: "Facebook Ads", icon: "📣", status: "disconnected", desc: "Listing promotion & lead gen", color: "blue" },
    { id: "analytics", name: "Google Analytics", icon: "📊", status: "connected", desc: "Website traffic & conversions", color: "green" },
    { id: "ai", name: "UrbanEstate AI", icon: "🤖", status: "beta", desc: "AI-powered valuation & insights", color: "lime" },
  ]);

  const [apiKeys, setApiKeys] = useLocalStorage("ue_apiKeys", [
    { id: 1, name: "Production Key", key: "ue_prod_xK9mQ2wL4nB7vR1pZ6jF3dH8sT5cA0eG", visible: false, created: "Mar 1, 2026", lastUsed: "Today" },
    { id: 2, name: "Staging Key", key: "ue_stg_yN4kP8rM6bW2xC0qV9hD5tJ3eL7fA1uI", visible: false, created: "Feb 14, 2026", lastUsed: "Yesterday" },
  ]);

  const [webhooks, setWebhooks] = useLocalStorage("ue_webhooks", [
    { id: 1, name: "Property Events", url: "https://yourapp.io/webhooks/properties", active: true },
    { id: 2, name: "Lead Notifications", url: "https://yourapp.io/webhooks/leads", active: false },
  ]);

  const [teamMembers, setTeamMembers] = useLocalStorage("ue_team", [
    { id: 1, name: "Sabbir Ahmad", role: "Admin", access: "Full Access", email: "sabbir@urbanestate.io", status: "active" },
    { id: 2, name: "Dalan Borwan", role: "Lead Agent", access: "Listing & CRM Access", email: "dalan@urbanestate.io", status: "active" },
    { id: 3, name: "Bosni Islam", role: "Junior Agent", access: "Listing Access Only", email: "bosni@urbanestate.io", status: "active" },
    { id: 4, name: "Imran Nama", role: "Agent", access: "Listing & CRM Access", email: "imran@urbanestate.io", status: "inactive" },
  ]);

  // ── Toast helpers ──────────────────────────────────────────────────────────
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  // ── Save handler ───────────────────────────────────────────────────────────
  const handleSave = async (section) => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800)); // Simulating API call
    setIsSaving(false);
    setHasUnsaved(false);
    addToast(`${section === 'All' ? 'All' : section} settings saved successfully!`, "success");
    
    window.dispatchEvent(new Event('profileUpdated')); 
    // Dispatching an extra general event for global sync
    window.dispatchEvent(new Event('settingsUpdated')); 
  };

  const markDirty = () => setHasUnsaved(true);

  // ── Avatar upload ──────────────────────────────────────────────────────────
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { addToast("File is too large. Max 2MB supported.", "error"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setProfile(p => ({ ...p, avatar: ev.target.result })); markDirty(); };
    reader.readAsDataURL(file);
  };

  // ── API key helpers ────────────────────────────────────────────────────────
  const toggleKeyVisibility = (id) =>
    setApiKeys(keys => keys.map(k => k.id === id ? { ...k, visible: !k.visible } : k));

  const copyKey = (key) => {
    navigator.clipboard?.writeText(key).then(() => addToast("API Key copied!", "success"));
  };

  const rotateKey = (id) => {
    setConfirm({
      open: true, danger: true, isDark,
      title: "Rotate API Key?",
      message: "This will invalidate the current key immediately. All associated integrations will break until updated.",
      onConfirm: () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        const newKey = "ue_" + Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
        setApiKeys(keys => keys.map(k => k.id === id ? { ...k, key: newKey, visible: false, lastUsed: "Just now" } : k));
        setConfirm(c => ({ ...c, open: false }));
        addToast("API Key rotated successfully.", "success");
      },
    });
  };

  const generateNewKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const prefix = ["prod", "stg", "dev", "test"][Math.floor(Math.random() * 4)];
    const newKey = `ue_${prefix}_${Array.from({ length: 30 }, () => chars[Math.floor(Math.random() * chars.length)]).join("")}`;
    const name = `New Key ${apiKeys.length + 1}`;
    setApiKeys(k => [...k, { id: Date.now(), name, key: newKey, visible: true, created: "Today", lastUsed: "Never" }]);
    addToast("New API Key generated!", "success");
  };

  const deleteKey = (id) => {
    setConfirm({
      open: true, danger: true, isDark,
      title: "Delete API Key?",
      message: "This action cannot be undone. All services associated with this key will stop working.",
      onConfirm: () => {
        setApiKeys(k => k.filter(x => x.id !== id));
        setConfirm(c => ({ ...c, open: false }));
        addToast("API Key deleted.", "success");
      },
    });
  };

  // ── Integration toggle ─────────────────────────────────────────────────────
  const toggleIntegration = (id) => {
    setIntegrations(list => list.map(i => {
      if (i.id !== id) return i;
      if (i.status === "connected") {
        addToast(`${i.name} disconnected.`, "info");
        return { ...i, status: "disconnected" };
      } else if (i.status === "disconnected") {
        addToast(`${i.name} connected!`, "success");
        return { ...i, status: "connected" };
      }
      return i;
    }));
  };

  // ── Revoke session ─────────────────────────────────────────────────────────
  const revokeSession = (id) => {
    setActiveSessions(s => s.filter(x => x.id !== id));
    addToast("Session revoked.", "success");
  };

  // ── Password change ────────────────────────────────────────────────────────
  const handlePasswordChange = () => {
    if (!security.currentPassword) { addToast("Enter current password.", "error"); return; }
    if (security.newPassword.length < 8) { addToast("New password must be at least 8 characters.", "error"); return; }
    if (security.newPassword !== security.confirmPassword) { addToast("Passwords do not match.", "error"); return; }
    setSecurity(s => ({ ...s, currentPassword: "", newPassword: "", confirmPassword: "" }));
    addToast("Password changed successfully!", "success");
    // Broadcast globally for any component that needs to know security updated
    window.dispatchEvent(new Event('securityUpdated'));
  };

  // ── Webhook toggle ─────────────────────────────────────────────────────────
  const toggleWebhook = (id) =>
    setWebhooks(w => w.map(x => x.id === id ? { ...x, active: !x.active } : x));

  // ── Integration status badge ───────────────────────────────────────────────
  const IntegrationBadge = ({ status }) => {
    const map = isDark ? {
      connected: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      disconnected: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      beta: "bg-[#cddfa0]/15 text-[#cddfa0] border-[#cddfa0]/30",
    } : {
      connected: "bg-emerald-100 text-emerald-700 border-emerald-200",
      disconnected: "bg-rose-100 text-rose-700 border-rose-200",
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      beta: "bg-indigo-100 text-indigo-700 border-indigo-200", 
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${map[status]}`}>
        {status}
      </span>
    );
  };

  // ── Navigation tabs ────────────────────────────────────────────────────────
  const navTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Sliders },
    { id: "team", label: "Team Roles", icon: Users },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "apikeys", label: "API & Webhooks", icon: Key },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, badge: "WARNING" },
  ];

  // Animation variants
  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  // Loading Screen
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: isDark ? '#091a16' : '#f8fafc', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 44, height: 44, border: `4px solid ${isDark ? '#1a4a40' : '#e2e8f0'}`, borderTop: `4px solid ${isDark ? '#cddfa0' : '#4f46e5'}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: 20, color: isDark ? '#cddfa0' : '#475569', fontWeight: 700, fontSize: 15, letterSpacing: 1, textTransform: 'uppercase' }}>Loading Workspace...</div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div className={`relative p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-[#091a16] text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
      
     
      <style dangerouslySetInnerHTML={{__html: `
        .custom-nav-scroll {
          overflow-x: auto !important;
          overflow-y: hidden !important;
          -webkit-overflow-scrolling: touch !important;
          scroll-behavior: smooth;
          scrollbar-width: auto !important; /* Forces Firefox to show scrollbar */
        }
        
        /* Webkit Browsers (Chrome, Safari, Android, iOS) */
        .custom-nav-scroll::-webkit-scrollbar {
          height: 6px !important;
          display: block !important;
          -webkit-appearance: none !important;
        }
        
        .custom-nav-scroll::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'} !important;
          border-radius: 8px !important;
          margin: 0px 5px !important;
        }
        
        .custom-nav-scroll::-webkit-scrollbar-thumb {
          background: ${isDark ? '#cddfa0' : '#4f46e5'} !important;
          border-radius: 8px !important;
        }
        
        /* Hide vertical scrollbar on the main page to keep it clean */
        html::-webkit-scrollbar {
            display: none;
        }
        html {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />

      {/* Background ambience (Only in dark mode) */}
      {isDark && (
        <>
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#cddfa0]/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-[#1a4a40]/20 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Toast stack */}
      <Toast toasts={toasts} removeToast={removeToast} isDark={isDark} />

      {/* Confirm modal */}
      <ConfirmModal
        isOpen={confirm.open}
        title={confirm.title}
        message={confirm.message}
        danger={confirm.danger}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm(c => ({ ...c, open: false }))}
        isDark={isDark}
      />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className={`mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-6 border-b transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-200'}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-colors duration-300
                ${isDark ? 'bg-[#133c34]/40 border-[#1a4a40] text-[#cddfa0]' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                <SettingsIcon size={12} /> Admin Settings
              </span>
              {hasUnsaved && (
                <span className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border animate-pulse
                  ${isDark ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-600'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-500'}`} />
                  Search results
                </span>
              )}
            </div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Platform <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white to-[#cddfa0]' : 'from-gray-900 to-indigo-600'}`}>Configuration</span>
            </h1>
            <p className={`mt-2 text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Manage your administrative profile, security preferences, and system behavior.</p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
            <button 
              onClick={() => {
                addToast("Opening public profile...", "info");
                setTimeout(() => window.open('/', '_blank'), 1000);
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border
              ${isDark ? 'border-[#1a4a40] text-gray-300 hover:bg-[#1a4a40]/50 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
              <Eye size={15} /> <span className="hidden sm:inline">View Profile</span>
            </button>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                addToast("Link copied!", "success");
              }}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border
              ${isDark ? 'border-[#1a4a40] text-gray-300 hover:bg-[#1a4a40]/50 hover:text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'}`}>
              <Share2 size={15} /> <span className="hidden sm:inline">Share Config</span>
            </button>
            <button
              onClick={() => handleSave("All")}
              disabled={isSaving || !hasUnsaved}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all shadow-lg
                ${isSaving || !hasUnsaved ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5'}
                ${isDark 
                  ? 'bg-[#cddfa0] text-[#091a16] shadow-[0_4px_20px_rgba(205,223,160,0.2)]' 
                  : 'bg-indigo-600 text-white shadow-indigo-500/20 hover:bg-indigo-700'}`}
            >
              {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
              {isSaving ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {/* ── Top Navigation Bar (Fixed for Mobile Scrolling) ──────────────────────────────────────────────── */}
        <div className="w-full mb-6 sm:mb-8">
          <div className="flex overflow-x-auto custom-nav-scroll gap-2 sm:gap-3 pb-4 touch-pan-x">
            {navTabs.map(tab => (
              <SettingsNavTab key={tab.id} {...tab} active={activeTab === tab.id} onClick={setActiveTab} isDark={isDark} />
            ))}
          </div>
        </div>

        {/* ── Main Panel (Animated) ────────────────────────────────────────── */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* ════════════════ PROFILE ════════════════ */}
              {activeTab === "profile" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Personal Information" icon={User} badge="Admin" badgeColor="lime" isDark={isDark}>
                    {/* Avatar */}
                    <div className={`flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 pb-5 sm:pb-6 mb-5 sm:mb-6 border-b transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/60' : 'border-gray-100'}`}>
                      <div className="relative inline-block self-start sm:self-auto">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg
                          ${isDark ? 'bg-gradient-to-br from-[#cddfa0] to-[#8fa85a] shadow-[0_0_25px_rgba(205,223,160,0.25)]' : 'bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-indigo-500/20'}`}>
                          {profile.avatar
                            ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                            : <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-[#091a16]' : 'text-white'}`}>{profile.firstName?.charAt(0) || "S"}</span>
                          }
                        </div>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className={`absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 rounded-xl border-2 flex items-center justify-center transition-colors shadow-md
                            ${isDark ? 'bg-[#091a16] border-[#1a4a40] hover:border-[#cddfa0]' : 'bg-white border-gray-100 hover:border-indigo-500'}`}
                        >
                          <Camera size={14} className={isDark ? 'text-[#cddfa0]' : 'text-indigo-600'} />
                        </button>
                        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-black text-xl sm:text-2xl truncate mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{profile.firstName} {profile.lastName}</p>
                        <p className={`text-xs sm:text-sm font-medium truncate mb-3 ${isDark ? 'text-[#cddfa0]/80' : 'text-indigo-600/80'}`}>{profile.jobTitle} <span className={isDark?"text-gray-600":"text-gray-300"}>•</span> {profile.department}</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => fileInputRef.current?.click()} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-sm
                            ${isDark ? 'bg-[#1a4a40] text-[#cddfa0] hover:bg-[#1a4a40]/80' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'}`}>
                            <Upload size={14} /> Upload New Photo
                          </button>
                          {profile.avatar && (
                            <button onClick={() => { setProfile(p => ({ ...p, avatar: null })); markDirty(); }} className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-all border
                              ${isDark ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border-rose-500/20' : 'bg-white text-rose-600 hover:bg-rose-50 border-rose-200 shadow-sm'}`}>
                              <Trash2 size={14} /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
                      <InputField isDark={isDark} label="First Name" value={profile.firstName} onChange={v => { setProfile(p => ({ ...p, firstName: v })); markDirty(); }} placeholder="First name" />
                      <InputField isDark={isDark} label="Last Name" value={profile.lastName} onChange={v => { setProfile(p => ({ ...p, lastName: v })); markDirty(); }} placeholder="Last name" />
                      <InputField isDark={isDark} label="Email Address" type="email" value={profile.email} onChange={v => { setProfile(p => ({ ...p, email: v })); markDirty(); }} placeholder="you@email.com" icon={Mail} />
                      <InputField isDark={isDark} label="Phone Number" value={profile.phone} onChange={v => { setProfile(p => ({ ...p, phone: v })); markDirty(); }} placeholder="+880 ..." />
                      <InputField isDark={isDark} label="Job Title" value={profile.jobTitle} onChange={v => { setProfile(p => ({ ...p, jobTitle: v })); markDirty(); }} placeholder="e.g. Admin" />
                      <SelectField isDark={isDark} label="Department" value={profile.department} onChange={v => { setProfile(p => ({ ...p, department: v })); markDirty(); }}
                        options={[{ value: "Engineering", label: "Engineering" }, { value: "Management", label: "Management" }, { value: "Sales", label: "Sales" }, { value: "Marketing", label: "Marketing" }]}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 mb-6">
                      <label className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Bio</label>
                      <textarea
                        rows={4}
                        value={profile.bio}
                        onChange={e => { setProfile(p => ({ ...p, bio: e.target.value })); markDirty(); }}
                        className={`w-full px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none
                          ${isDark 
                            ? 'bg-[#091a16] border border-[#1a4a40] text-white placeholder-gray-600 focus:border-[#cddfa0]/80 focus:bg-[#133c34]/40 focus:ring-1 focus:ring-[#cddfa0]/10' 
                            : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10'}`}
                      />
                    </div>
                    <div className={`flex flex-col sm:flex-row justify-end gap-3 pt-5 border-t transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-100'}`}>
                      <button onClick={() => setHasUnsaved(false)} className={`w-full sm:w-auto px-5 py-2.5 rounded-xl border text-sm font-bold transition-colors
                        ${isDark ? 'border-[#1a4a40] text-gray-300 hover:bg-[#133c34]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Discard Changes</button>
                      <button onClick={() => handleSave("Profile")} disabled={isSaving} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg disabled:opacity-60
                        ${isDark ? 'bg-[#cddfa0] text-[#091a16] hover:bg-[#b8cc80] shadow-[0_4px_15px_rgba(205,223,160,0.2)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}>
                        {isSaving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />} Save Profile
                      </button>
                    </div>
                  </SectionCard>

                  <SectionCard title="Location & Region Settings" icon={Globe} isDark={isDark}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 mb-5">
                      <SelectField isDark={isDark} label="Country" value={profile.country} onChange={v => { setProfile(p => ({ ...p, country: v })); markDirty(); }}
                        options={[{ value: "Bangladesh", label: "Bangladesh" }, { value: "India", label: "India" }, { value: "USA", label: "United States" }]}
                      />
                      <SelectField isDark={isDark} label="City" value={profile.city} onChange={v => { setProfile(p => ({ ...p, city: v })); markDirty(); }}
                        options={[{ value: "Dhaka", label: "Dhaka" }, { value: "Chittagong", label: "Chittagong" }, { value: "Sylhet", label: "Sylhet" }]}
                      />
                      <SelectField isDark={isDark} label="Timezone" value={profile.timezone} onChange={v => { setProfile(p => ({ ...p, timezone: v })); markDirty(); }}
                        options={[{ value: "Asia/Dhaka", label: "Asia/Dhaka (UTC+6)" }, { value: "UTC", label: "UTC" }, { value: "Asia/Kolkata", label: "Asia/Kolkata" }]}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6">
                      <SelectField isDark={isDark} label="Currency" value={profile.currency} onChange={v => { setProfile(p => ({ ...p, currency: v })); markDirty(); }}
                        options={[{ value: "BDT", label: "BDT — Bangladeshi Taka" }, { value: "USD", label: "USD — US Dollar" }, { value: "EUR", label: "EUR — Euro" }]}
                      />
                      <SelectField isDark={isDark} label="Language" value={profile.language} onChange={v => { setProfile(p => ({ ...p, language: v })); markDirty(); }}
                        options={[{ value: "en", label: "English (US)" }, { value: "bn", label: "Bengali" }, { value: "ar", label: "Arabic" }]}
                      />
                    </div>
                    <div className={`flex justify-end pt-5 border-t transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-100'}`}>
                      <button onClick={() => handleSave("Region")} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg
                        ${isDark ? 'bg-[#cddfa0] text-[#091a16] hover:bg-[#b8cc80] shadow-[0_4px_15px_rgba(205,223,160,0.2)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}>
                        <Save size={15} /> Save Region
                      </button>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ SECURITY ════════════════ */}
              {activeTab === "security" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { label: "Account Status", value: "Secured", color: isDark ? "text-emerald-400" : "text-emerald-600", icon: "✅" },
                      { label: "Login Sessions", value: activeSessions.length, color: isDark ? "text-white" : "text-gray-900", icon: "🖥️" },
                      { label: "Active Devices", value: activeSessions.filter(s => s.current).length + 1, color: isDark ? "text-amber-400" : "text-amber-600", icon: "📱" },
                      { label: "Failed Attempts", value: 0, color: isDark ? "text-[#cddfa0]" : "text-indigo-600", icon: "🛡️" },
                    ].map(s => (
                      <div key={s.label} className={`rounded-2xl p-4 sm:p-5 border shadow-sm transition-all hover:shadow-md ${isDark ? 'bg-[#133c34]/40 border-[#1a4a40] hover:bg-[#133c34]/60' : 'bg-white border-gray-200'}`}>
                        <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{s.icon}</div>
                        <div className={`text-lg sm:text-2xl font-black ${s.color}`}>{s.value}</div>
                        <div className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <SectionCard title="Change Password" icon={Lock} isDark={isDark}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-5 sm:mb-6">
                      <InputField isDark={isDark} label="Current Password" type="password" value={security.currentPassword} onChange={v => setSecurity(s => ({ ...s, currentPassword: v }))} placeholder="••••••••" />
                      <InputField isDark={isDark} label="New Password" type="password" value={security.newPassword} onChange={v => setSecurity(s => ({ ...s, newPassword: v }))} placeholder="Min 8 chars" hint="Use uppercase, numbers & symbols" />
                      <InputField isDark={isDark} label="Confirm Password" type="password" value={security.confirmPassword} onChange={v => setSecurity(s => ({ ...s, confirmPassword: v }))} placeholder="Repeat password" />
                    </div>
                    <button onClick={handlePasswordChange} className={`w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg
                      ${isDark ? 'bg-[#cddfa0] text-[#091a16] hover:bg-[#b8cc80] shadow-[0_4px_15px_rgba(205,223,160,0.2)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}>
                      <Lock size={15} /> Update Password
                    </button>
                  </SectionCard>

                  <SectionCard title="Authentication & Access" icon={Shield} isDark={isDark}>
                    {[
                      { key: "twoFactor", title: "Two-Factor Authentication (2FA)", desc: "Adds an extra layer of security via authenticator app or SMS", recommended: true },
                      { key: "biometric", title: "Biometric Login", desc: "Use fingerprint or Face ID on supported devices for faster access" },
                      { key: "ipWhitelist", title: "IP Address Whitelist", desc: "Restrict account logins to specific trusted IP addresses only" },
                    ].map(item => (
                      <div key={item.key} className={`flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b last:border-0 gap-3 sm:gap-0 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-100'}`}>
                        <div className="flex-1 pr-0 sm:pr-6">
                          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <span className={`text-[14px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</span>
                            {item.recommended && <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border
                              ${isDark ? 'bg-[#cddfa0]/15 text-[#cddfa0] border-[#cddfa0]/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>Recommended</span>}
                          </div>
                          <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                        </div>
                        <div className="self-end sm:self-auto">
                          <Toggle isDark={isDark} checked={security[item.key]} onChange={v => { setSecurity(s => ({ ...s, [item.key]: v })); addToast(`Security setting updated.`, "success"); }} />
                        </div>
                      </div>
                    ))}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between pt-5 mt-2 border-t gap-4 sm:gap-0 transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-100'}`}>
                      <div className="mb-1 sm:mb-0">
                        <p className={`text-[14px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Session Timeout</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Automatically log out after a period of inactivity</p>
                      </div>
                      <div className="w-full sm:w-48">
                        <SelectField isDark={isDark} value={security.sessionTimeout} onChange={v => { setSecurity(s => ({ ...s, sessionTimeout: v })); addToast(`Timeout set to ${v} minutes.`, "info"); }}
                          options={[{ value: "30", label: "30 minutes" }, { value: "60", label: "1 hour" }, { value: "240", label: "4 hours" }, { value: "never", label: "Never (Not recommended)" }]}
                        />
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title="Active Sessions" icon={Monitor} badge={`${activeSessions.length} Active`} badgeColor="amber" isDark={isDark}>
                    {activeSessions.map(s => (
                      <div key={s.id} className={`flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 py-4 border-b last:border-0 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-100'}`}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-sm ${isDark ? 'bg-[#1a4a40]' : 'bg-indigo-50'}`}>
                          {s.device.includes("iPhone") ? <Smartphone size={18} className={isDark ? 'text-[#cddfa0]' : 'text-indigo-600'} /> : <Monitor size={18} className={isDark ? 'text-[#cddfa0]' : 'text-indigo-600'} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[14px] sm:text-[15px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.device}</p>
                          <p className={`text-[11px] sm:text-xs mt-0.5 truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.location} <span className="mx-1">•</span> {s.time}</p>
                        </div>
                        <div className="w-full sm:w-auto flex justify-end mt-2 sm:mt-0">
                          {s.current
                            ? <span className={`px-3 py-1.5 sm:py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border
                                ${isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>Current Session</span>
                            : <button onClick={() => revokeSession(s.id)} className={`px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors border
                                ${isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' : 'bg-white text-rose-600 border-rose-200 shadow-sm hover:bg-rose-50'}`}>Revoke</button>
                          }
                        </div>
                      </div>
                    ))}
                    {activeSessions.length > 1 && (
                      <button
                        onClick={() => setConfirm({ open: true, danger: true, isDark, title: "Revoke All Sessions?", message: "You will be logged out from all other devices immediately.", onConfirm: () => { setActiveSessions(s => s.filter(x => x.current)); setConfirm(c => ({ ...c, open: false })); addToast("All other sessions revoked.", "success"); } })}
                        className={`mt-5 w-full py-3 sm:py-3.5 rounded-xl border text-sm font-bold transition-colors
                          ${isDark ? 'bg-rose-500/5 border-rose-500/30 text-rose-400 hover:bg-rose-500/15' : 'bg-white border-rose-200 text-rose-600 shadow-sm hover:bg-rose-50'}`}
                      >
                        Revoke All Other Sessions
                      </button>
                    )}
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ NOTIFICATIONS ════════════════ */}
              {activeTab === "notifications" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Notification Preferences" icon={Bell} isDark={isDark}>
                    <div className="overflow-x-auto custom-nav-scroll pb-4 mb-2">
                      <div className="min-w-[500px] pr-2">
                        {/* Header */}
                        <div className={`flex items-center justify-between mb-4 pb-3 border-b ${isDark ? 'border-[#1a4a40]/60' : 'border-gray-200'}`}>
                          <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Select how you want to be notified for different events.</p>
                          <div className={`flex items-center gap-6 sm:gap-10 text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span className="w-11 text-center">Email</span>
                            <span className="w-11 text-center">In-App</span>
                            <span className="w-11 text-center">SMS</span>
                          </div>
                        </div>
                        
                        {/* Sections */}
                        {[
                          { title: "Property Updates", rows: [{ l: "New Listing Published", k: "newListing" }, { l: "Property Sold / Rented", k: "propertySold" }, { l: "Price Change Alert", k: "priceChange" }] },
                          { title: "Leads & Clients", rows: [{ l: "New Lead Assigned", k: "newLead" }, { l: "Client Inquiry", k: "clientInquiry" }, { l: "Pending Approvals", k: "pendingApproval" }] },
                          { title: "Platform & Reports", rows: [{ l: "Weekly Market Report", k: "marketReport" }, { l: "Agent Performance Summary", k: "agentPerformance" }, { l: "System Alerts & Updates", k: "systemAlerts" }] }
                        ].map((section, idx) => (
                          <div key={idx} className="mb-6 last:mb-2">
                            <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-2 px-1 ${isDark ? 'text-[#cddfa0]' : 'text-indigo-700'}`}>{section.title}</p>
                            <div className={`rounded-xl sm:rounded-2xl border ${isDark ? 'border-[#1a4a40] bg-[rgba(19,60,52,0.4)]' : 'border-gray-200 bg-white'}`}>
                              {section.rows.map((row, rIdx) => (
                                <div key={rIdx} className={`flex items-center justify-between py-3 sm:py-4 px-4 sm:px-5 border-b last:border-0 ${isDark ? 'border-[#1a4a40]/60' : 'border-gray-100'}`}>
                                  <span className={`text-[13px] sm:text-[14px] font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{row.l}</span>
                                  <div className="flex items-center gap-6 sm:gap-10">
                                    {["email", "inApp", "sms"].map(ch => (
                                      <div key={ch} className="w-11 flex justify-center">
                                        <Toggle isDark={isDark} checked={notifs[row.k][ch]} onChange={v => { setNotifs(n => ({ ...n, [row.k]: { ...n[row.k], [ch]: v } })); markDirty(); }} />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`flex justify-end mt-4 pt-5 border-t transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-200'}`}>
                      <button onClick={() => handleSave("Notifications")} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all shadow-lg
                        ${isDark ? 'bg-[#cddfa0] text-[#091a16] hover:bg-[#b8cc80] shadow-[0_4px_15px_rgba(205,223,160,0.2)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}>
                        <Save size={16} /> Save Preferences
                      </button>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ APPEARANCE ════════════════ */}
              {activeTab === "appearance" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Theme & Display settings" icon={Moon} isDark={isDark}>
                    <div className="mb-6 sm:mb-8">
                      <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-3 sm:mb-4 px-1 ${isDark ? 'text-[#cddfa0]' : 'text-indigo-700'}`}>Color Theme</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                        {[
                          { val: "dark", label: "Urban Dark", desc: "Default dark mode", bg: "#091a16", bar1: "#133c34", bar2: "#cddfa0" },
                          { val: "light", label: "Clean Light", desc: "High contrast mode", bg: "#f8fafc", bar1: "#e2e8f0", bar2: "#4f46e5" },
                          { val: "midnight", label: "Midnight", desc: "Deep purple tint", bg: "#0d0522", bar1: "#1a0a38", bar2: "#8b5cf6" },
                        ].map(t => (
                          <button
                            key={t.val}
                            onClick={() => { 
                              setAppearance(a => ({ ...a, theme: t.val })); 
                              markDirty(); 

                              const wantsDark = t.val === 'dark' || t.val === 'midnight';
                              
                              if (typeof setTheme === 'function') {
                                  setTheme(t.val === 'midnight' ? 'dark' : t.val); 
                              } else if (typeof toggleTheme === 'function') {
                                  if (wantsDark && !isDark) toggleTheme(); 
                                  if (!wantsDark && isDark) toggleTheme(); 
                              } else if (typeof setIsDark === 'function') {
                                  setIsDark(wantsDark); 
                              }
                              
                              addToast(`Theme changed to: ${t.label}`, "success");
                            }}
                            className={`text-left rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all group
                              ${appearance.theme === t.val 
                                ? (isDark ? "border-[#cddfa0] shadow-[0_0_20px_rgba(205,223,160,0.15)] ring-2 ring-[#cddfa0]/20 ring-offset-2 ring-offset-[#091a16]" : "border-indigo-600 shadow-indigo-500/10 ring-2 ring-indigo-500/20 ring-offset-2 ring-offset-white") 
                                : (isDark ? "border-[#1a4a40] hover:border-[#1a4a40]/80" : "border-gray-200 hover:border-gray-300")}`}
                          >
                            <div style={{ background: t.bg }} className="h-16 sm:h-20 p-2 sm:p-3 flex flex-col gap-1.5 sm:gap-2 opacity-90 group-hover:opacity-100 transition-opacity border-b border-black/5">
                              <div style={{ background: t.bar1 }} className="h-2.5 sm:h-3 w-3/4 rounded-md" />
                              <div style={{ background: t.bar2 }} className="h-1.5 sm:h-2 w-1/2 rounded-sm" />
                            </div>
                            <div className={`p-2.5 sm:p-3 transition-colors duration-300 ${isDark ? 'bg-[rgba(19,60,52,0.6)]' : 'bg-gray-50'}`}>
                              <p className={`text-xs sm:text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.label}</p>
                              <p className={`text-[9px] sm:text-[10px] mt-0.5 leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <SelectField isDark={isDark} label="Font Size" value={appearance.fontSize} onChange={v => { setAppearance(a => ({ ...a, fontSize: v })); markDirty(); }}
                        options={[{ value: "sm", label: "Small (Compact)" }, { value: "md", label: "Medium (Default)" }, { value: "lg", label: "Large (Accessible)" }]}
                      />
                      <SelectField isDark={isDark} label="Data Density" value={appearance.cardDensity} onChange={v => { setAppearance(a => ({ ...a, cardDensity: v })); markDirty(); }}
                        options={[{ value: "comfortable", label: "Comfortable Padding" }, { value: "compact", label: "Compact (Show More)" }, { value: "spacious", label: "Spacious Layout" }]}
                      />
                    </div>

                    <div className="mb-6">
                       <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest mb-2 sm:mb-3 px-1 ${isDark ? 'text-[#cddfa0]' : 'text-indigo-700'}`}>Experience</p>
                      <div className={`rounded-xl sm:rounded-2xl border ${isDark ? 'border-[#1a4a40] bg-[rgba(19,60,52,0.4)]' : 'border-gray-200 bg-white'}`}>
                        {[
                          { key: "reducedMotion", title: "Reduce UI Motion", desc: "Disable page transitions and animations" },
                          { key: "compactTables", title: "Compact Data Tables", desc: "Decrease row height in properties" },
                          { key: "showMapDefault", title: "Map View by Default", desc: "Automatically open map on dashboard" },
                        ].map((item) => (
                          <div key={item.key} className={`flex items-center justify-between p-3 sm:p-4 border-b last:border-0 gap-3 ${isDark ? 'border-[#1a4a40]/60' : 'border-gray-100'}`}>
                            <div className="pr-2 sm:pr-4">
                              <p className={`text-[13px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                              <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                            </div>
                            <Toggle isDark={isDark} checked={appearance[item.key]} onChange={v => { setAppearance(a => ({ ...a, [item.key]: v })); markDirty(); }} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={`flex flex-col sm:flex-row justify-end gap-3 pt-5 sm:pt-6 border-t transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-200'}`}>
                      <button onClick={() => { setAppearance({ theme: isDark?"dark":"light", accent: isDark?"#cddfa0":"#4f46e5", fontSize: "md", sidebarStyle: "compact", reducedMotion: false, compactTables: true, showMapDefault: true, cardDensity: "comfortable" }); addToast("Reset to default settings.", "info"); }} 
                        className={`w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl border text-sm font-bold transition-colors
                          ${isDark ? 'border-[#1a4a40] text-gray-300 hover:bg-[#133c34]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        Reset to Defaults
                      </button>
                      <button onClick={() => handleSave("Appearance")} 
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl text-sm font-black transition-all shadow-lg
                          ${isDark ? 'bg-[#cddfa0] text-[#091a16] hover:bg-[#b8cc80] shadow-[0_4px_15px_rgba(205,223,160,0.2)]' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'}`}>
                        <Save size={15} /> Apply Preferences
                      </button>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ TEAM ════════════════ */}
              {activeTab === "team" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Team Members & Roles" icon={Users} badge={`${teamMembers.length} members`} badgeColor="lime" isDark={isDark}>
                    <div className="flex flex-col gap-0">
                      {teamMembers.map((m, i) => (
                        <div key={m.id} className={`flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 sm:gap-4 py-4 ${i < teamMembers.length - 1 ? (isDark ? "border-b border-[#1a4a40]/60" : "border-b border-gray-100") : ""}`}>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm flex-shrink-0
                            ${isDark ? 'bg-gradient-to-br from-[#133c34] to-[#1a4a40] text-[#cddfa0]' : 'bg-indigo-100 text-indigo-700'}`}>
                            {m.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-[14px] sm:text-[15px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{m.name}</p>
                              {m.id === 1 && <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase
                                ${isDark ? 'bg-[#cddfa0]/15 text-[#cddfa0]' : 'bg-indigo-100 text-indigo-700'}`}>You</span>}
                              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${m.status === "active" ? "bg-emerald-400" : "bg-gray-400"}`} />
                            </div>
                            <p className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{m.email}</p>
                          </div>
                          <div className="w-full sm:w-auto flex sm:block items-center justify-between sm:text-right mt-2 sm:mt-0 pr-0 sm:pr-4">
                            <div>
                              <p className={`text-[13px] sm:text-sm font-bold ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>{m.role}</p>
                              <p className={`text-[10px] sm:text-[11px] mt-0.5 font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{m.access}</p>
                            </div>
                            {m.id !== 1 && (
                              <button 
                                onClick={() => addToast(`Editing permissions for ${m.name}...`, "info")}
                                className={`p-2 sm:p-2.5 rounded-xl transition-colors sm:hidden
                                ${isDark ? 'bg-[#1a4a40]/60 text-gray-400 hover:text-[#cddfa0] hover:bg-[#1a4a40]' : 'bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200'}`}>
                                <Edit3 size={15} />
                              </button>
                            )}
                          </div>
                          {m.id !== 1 && (
                            <button 
                              onClick={() => addToast(`Editing permissions for ${m.name}...`, "info")}
                              className={`hidden sm:block p-2.5 rounded-xl transition-colors
                              ${isDark ? 'bg-[#1a4a40]/60 text-gray-400 hover:text-[#cddfa0] hover:bg-[#1a4a40]' : 'bg-gray-50 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200'}`}>
                              <Edit3 size={15} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className={`mt-4 sm:mt-5 pt-4 sm:pt-5 border-t transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/60' : 'border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <p className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Platform Usage</p>
                        <span className={`text-[13px] sm:text-sm font-bold ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>{billing.usage.users}/{billing.usage.maxUsers} users</span>
                      </div>
                      <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden mb-4 sm:mb-5 ${isDark ? 'bg-[#1a4a40]' : 'bg-gray-200'}`}>
                        <div className={`h-full rounded-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-[#cddfa0] to-[#8fa85a]' : 'bg-indigo-500'}`} style={{ width: `${(billing.usage.users / billing.usage.maxUsers) * 100}%` }} />
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("https://urbanestate.io/invite/token-123");
                          addToast("Invite link copied!", "success");
                        }}
                        className={`w-full py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm font-black transition-colors flex items-center justify-center gap-2
                          ${isDark ? 'border-[#cddfa0]/30 text-[#cddfa0] hover:bg-[#cddfa0]/10' : 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'}`}
                      >
                        <Plus size={16} /> Generate Invite Link
                      </button>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ BILLING ════════════════ */}
              {activeTab === "billing" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Current Plan" icon={CreditCard} badge={billing.plan} badgeColor="amber" isDark={isDark}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
                      {[
                        { name: "Starter", price: "Free", features: ["10 Listings", "2 Agents", "Basic Analytics"] },
                        { name: "Pro", price: "$49/mo", features: ["Unlimited Listings", "20 Agents", "Advanced Analytics", "API Access"] },
                        { name: "Enterprise", price: "Custom", features: ["White-label", "Unlimited Agents", "Dedicated Support", "Custom Integrations"] },
                      ].map(plan => {
                        const isCurrent = billing.plan === plan.name;
                        return (
                          <div key={plan.name} 
                            onClick={() => {
                              if (!isCurrent) {
                                setBilling(b => ({ ...b, plan: plan.name }));
                                addToast(`${plan.name} plan selected.`, "success");
                              }
                            }}
                            className={`rounded-2xl border-2 p-4 sm:p-5 transition-all cursor-pointer 
                            ${isCurrent 
                              ? (isDark ? "border-[#cddfa0] bg-[#cddfa0]/5 shadow-[0_0_20px_rgba(205,223,160,0.1)]" : "border-indigo-500 bg-indigo-50 shadow-sm") 
                              : (isDark ? "border-[#1a4a40] hover:border-[#1a4a40]/80" : "border-gray-200 hover:border-gray-300 bg-gray-50")}`}>
                            {isCurrent && <span className={`inline-block mb-2 sm:mb-3 px-2.5 py-0.5 rounded text-[9px] sm:text-[10px] font-black uppercase tracking-wider border
                              ${isDark ? 'bg-[#cddfa0]/20 text-[#cddfa0] border-[#cddfa0]/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>Current</span>}
                            <p className={`font-black text-[14px] sm:text-[15px] mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</p>
                            <p className={`text-xl sm:text-2xl font-black mb-3 sm:mb-4 ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>{plan.price}</p>
                            {plan.features.map(f => (
                              <div key={f} className={`flex items-center gap-2 py-1 text-[12px] sm:text-[13px] font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Check size={14} className={`flex-shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-indigo-500'}`} /> {f}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-5 border mb-5 ${isDark ? 'bg-[#091a16] border-[#1a4a40]' : 'bg-gray-50 border-gray-200'}`}>
                      <div className="flex items-center justify-between mb-2 sm:mb-3">
                        <p className={`text-xs sm:text-sm font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cloud Storage Used</p>
                        <p className={`text-xs sm:text-sm font-black ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>{billing.storage.used} GB / {billing.storage.total} GB</p>
                      </div>
                      <div className={`h-2 sm:h-2.5 rounded-full overflow-hidden ${isDark ? 'bg-[#1a4a40]' : 'bg-gray-200'}`}>
                        <div className={`h-full rounded-full transition-all duration-1000 ${isDark ? 'bg-gradient-to-r from-[#cddfa0] to-[#8fa85a]' : 'bg-indigo-500'}`} style={{ width: `${(billing.storage.used / billing.storage.total) * 100}%` }} />
                      </div>
                      <p className={`text-[11px] sm:text-xs mt-3 font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Next billing date is <strong className={isDark?'text-gray-300':'text-gray-700'}>{billing.nextBilling}</strong> for <strong className={isDark?'text-gray-300':'text-gray-700'}>{billing.amount}</strong>.</p>
                    </div>
                  </SectionCard>

                  <SectionCard title="Payment Methods" icon={CreditCard} isDark={isDark}>
                    {billing.cards.map(card => (
                      <div key={card.id} className={`flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b last:border-0 ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-100'}`}>
                        <div className={`w-10 h-7 sm:w-12 sm:h-8 rounded-md border flex items-center justify-center text-[10px] sm:text-xs font-black flex-shrink-0
                          ${isDark ? 'bg-gradient-to-br from-[#1a4a40] to-[#091a16] border-[#1a4a40] text-[#cddfa0]' : 'bg-gray-100 border-gray-200 text-gray-700'}`}>
                          {card.brand === "Visa" ? "VISA" : "MC"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[13px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>•••• {card.last4}</p>
                          <p className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Expires {card.exp}</p>
                        </div>
                        {card.isDefault
                          ? <span className={`px-2 sm:px-3 py-1 rounded-md text-[9px] sm:text-[10px] font-black border
                              ${isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>Default</span>
                          : <button onClick={() => {
                              setBilling(b => ({ ...b, cards: b.cards.map(c => ({ ...c, isDefault: c.id === card.id })) }));
                              addToast(`${card.brand} •••• ${card.last4} set as default.`, "success");
                            }} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap
                              ${isDark ? 'border-[#1a4a40] text-gray-400 hover:bg-[#133c34]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                              Set Default
                            </button>
                        }
                      </div>
                    ))}
                    <div className={`flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-100'}`}>
                      <div className="w-10 h-7 sm:w-12 sm:h-8 rounded-md bg-[#1d4ed8]/10 border border-[#1d4ed8]/30 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-[#1d4ed8] flex-shrink-0">PayPal</div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[13px] sm:text-[15px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>sabbir@urbanestate.io</p>
                        <p className={`text-[11px] sm:text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Online wallet</p>
                      </div>
                      <button onClick={() => addToast("PayPal set as default.", "success")} className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border text-[10px] sm:text-xs font-bold transition-colors whitespace-nowrap
                          ${isDark ? 'border-[#1a4a40] text-gray-400 hover:bg-[#133c34]' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>Set Default</button>
                    </div>
                    <button onClick={() => addToast("Opening payment gateway...", "info")} className={`mt-4 sm:mt-5 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm font-bold transition-colors
                      ${isDark ? 'border-[#cddfa0]/30 text-[#cddfa0] hover:bg-[#cddfa0]/10' : 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'}`}>
                      <Plus size={15} /> Add New Payment Method
                    </button>
                  </SectionCard>

                  <SectionCard title="Billing History" icon={FileText} isDark={isDark}>
                    <div className="overflow-x-auto custom-nav-scroll pb-4">
                      <div className="flex flex-col min-w-[320px] sm:min-w-[400px]">
                        <div className={`flex items-center pb-3 mb-2 border-b text-[9px] sm:text-[10px] font-black uppercase tracking-widest
                          ${isDark ? 'border-[#1a4a40]/60 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                          <span className="flex-1">Date</span>
                          <span className="w-20 sm:w-24 text-center">Amount</span>
                          <span className="w-20 sm:w-24 text-center">Status</span>
                          <span className="w-16 sm:w-24 text-right">Invoice</span>
                        </div>
                        {billing.history.map((h, i) => (
                          <div key={i} className={`flex items-center py-3 sm:py-4 border-b last:border-0
                            ${isDark ? 'border-[#1a4a40]/40' : 'border-gray-100'}`}>
                            <span className={`flex-1 text-[13px] sm:text-[15px] font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{h.date}</span>
                            <span className={`w-20 sm:w-24 text-center text-[13px] sm:text-[15px] font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{h.amount}</span>
                            <span className="w-20 sm:w-24 text-center">
                              <span className={`px-2 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black border
                              ${isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>{h.status}</span>
                            </span>
                            <div className="w-16 sm:w-24 flex justify-end">
                              <button onClick={() => addToast(`Downloading invoice for ${h.date}...`, "success")} className={`flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-bold hover:underline
                                ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>
                                <Download size={14} /> PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ INTEGRATIONS ════════════════ */}
              {activeTab === "integrations" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Connected Services" icon={Zap} isDark={isDark}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      {integrations.map(intg => (
                        <div key={intg.id} className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition-all 
                          ${intg.status === "connected" || intg.status === "beta" 
                            ? (isDark ? "border-[#1a4a40] bg-[#133c34]/20" : "border-gray-200 bg-white shadow-sm hover:shadow-md") 
                            : (isDark ? "border-[#1a4a40]/40 bg-[#091a16]/30 opacity-70" : "border-gray-100 bg-gray-50 opacity-70")}`}>
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 shadow-inner
                            ${isDark ? 'bg-[#1a4a40]' : 'bg-gray-100'}`}>
                            {intg.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className={`text-[13px] sm:text-[15px] font-bold truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>{intg.name}</p>
                              <IntegrationBadge status={intg.status} isDark={isDark} />
                            </div>
                            <p className={`text-[10px] sm:text-[11px] font-medium leading-tight ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{intg.desc}</p>
                          </div>
                          <button
                            onClick={() => intg.status !== "beta" && toggleIntegration(intg.id)}
                            disabled={intg.status === "pending" || intg.status === "beta"}
                            className={`p-2 sm:p-2.5 rounded-xl transition-colors border flex-shrink-0
                              ${intg.status === "connected" 
                                ? (isDark ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20" : "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100") 
                                : intg.status === "disconnected" 
                                ? (isDark ? "bg-[#1a4a40] text-[#cddfa0] border-transparent hover:bg-[#1a4a40]/80" : "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100") 
                                : (isDark ? "bg-[#1a4a40]/50 text-gray-600 border-transparent cursor-not-allowed" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed")}`}
                          >
                            {intg.status === "connected" ? <WifiOff size={14} className="sm:w-4 sm:h-4" /> : intg.status === "beta" ? <Zap size={14} className="sm:w-4 sm:h-4" /> : <Wifi size={14} className="sm:w-4 sm:h-4" />}
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-5 sm:mt-6 pt-4 sm:pt-5 border-t text-center transition-colors duration-300 ${isDark ? 'border-[#1a4a40]/50' : 'border-gray-200'}`}>
                      <p className={`text-[11px] sm:text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Need a custom enterprise integration? 
                        <button onClick={() => addToast("Request sent!", "success")} className={`ml-1 font-black hover:underline ${isDark ? 'text-[#cddfa0]' : 'text-indigo-600'}`}>
                          Contact our team
                        </button>
                      </p>
                    </div>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ API KEYS ════════════════ */}
              {activeTab === "apikeys" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="API Keys" icon={Key} badge={`${apiKeys.length} keys`} badgeColor="lime" isDark={isDark}>
                    <div className={`border rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-5 sm:mb-6 flex items-start gap-3 sm:gap-4
                      ${isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                      <AlertTriangle size={18} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                      <p className={`text-[11px] sm:text-[13px] font-medium leading-relaxed ${isDark ? 'text-amber-300/80' : 'text-amber-800'}`}>
                        Keep API keys secret. Never share them publicly or commit them to version control. Keys provide full access to your account.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">
                      {apiKeys.map(k => (
                        <div key={k.id} className={`border rounded-xl sm:rounded-2xl p-4 sm:p-5 ${isDark ? 'bg-[#091a16] border-[#1a4a40]' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-3">
                            <div>
                              <p className={`text-[14px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{k.name}</p>
                              <p className={`text-[10px] sm:text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Created {k.created} <span className="mx-1">•</span> Last used {k.lastUsed}</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                              <button onClick={() => rotateKey(k.id)} title="Rotate key" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[10px] sm:text-xs font-bold transition-colors
                                ${isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20' : 'bg-white text-amber-600 border-amber-200 hover:bg-amber-50'}`}>
                                <RotateCw size={13} /> Rotate
                              </button>
                              <button onClick={() => deleteKey(k.id)} title="Delete key" className={`p-1.5 sm:p-2 rounded-xl border transition-colors
                                ${isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20' : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50'}`}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className={`flex-1 text-[11px] sm:text-[13px] border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 font-mono overflow-hidden truncate
                              ${isDark ? 'text-[#cddfa0] bg-[#133c34]/50 border-[#1a4a40]' : 'text-indigo-700 bg-white border-gray-200 shadow-inner'}`}>
                              {k.visible ? k.key : k.key.replace(/./g, (c, i) => i < 8 ? c : "•")}
                            </code>
                            <button onClick={() => toggleKeyVisibility(k.id)} className={`p-2 sm:p-2.5 rounded-xl transition-colors border flex-shrink-0
                              ${isDark ? 'bg-[#1a4a40] text-gray-400 border-transparent hover:text-[#cddfa0] hover:bg-[#1a4a40]/80' : 'bg-white border-gray-200 text-gray-500 hover:text-indigo-600 shadow-sm'}`}>
                              {k.visible ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
                            </button>
                            <button onClick={() => copyKey(k.key)} className={`p-2 sm:p-2.5 rounded-xl transition-colors border flex-shrink-0
                              ${isDark ? 'bg-[#1a4a40] text-gray-400 border-transparent hover:text-[#cddfa0] hover:bg-[#1a4a40]/80' : 'bg-white border-gray-200 text-gray-500 hover:text-indigo-600 shadow-sm'}`}>
                              <Copy size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button onClick={generateNewKey} className={`w-full py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm font-black transition-colors flex items-center justify-center gap-2
                      ${isDark ? 'border-[#cddfa0]/30 text-[#cddfa0] hover:bg-[#cddfa0]/10' : 'border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'}`}>
                      <Plus size={16} /> Generate New API Key
                    </button>
                  </SectionCard>

                  <SectionCard title="Webhook Endpoints" icon={Globe} isDark={isDark}>
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-5">
                      {webhooks.map(wh => (
                        <div key={wh.id} className={`border rounded-xl sm:rounded-2xl p-4 sm:p-5 ${isDark ? 'bg-[#091a16] border-[#1a4a40]' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <p className={`text-[14px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{wh.name}</p>
                            <div className="flex items-center gap-2 sm:gap-3">
                              <Toggle isDark={isDark} checked={wh.active} onChange={() => { toggleWebhook(wh.id); addToast(`Webhook ${!wh.active ? 'activated' : 'paused'}.`, "info"); }} />
                              <button onClick={() => { setWebhooks(w => w.filter(x => x.id !== wh.id)); addToast("Webhook deleted.", "success"); }} className={`p-1.5 sm:p-2 rounded-xl border transition-colors
                                ${isDark ? 'text-rose-400 bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/20' : 'text-rose-600 bg-white border-rose-200 hover:bg-rose-50'}`}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className={`flex-1 text-[11px] sm:text-[13px] font-mono border rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 truncate
                              ${isDark ? 'text-[#cddfa0]/80 bg-[#133c34]/50 border-[#1a4a40]' : 'text-indigo-700 bg-white border-gray-200 shadow-inner'}`}>{wh.url}</code>
                            <button onClick={() => { navigator.clipboard?.writeText(wh.url); addToast("Webhook URL copied!", "success"); }} className={`p-2 sm:p-2.5 rounded-xl transition-colors border flex-shrink-0
                              ${isDark ? 'bg-[#1a4a40] text-gray-400 border-transparent hover:text-[#cddfa0]' : 'bg-white border-gray-200 text-gray-500 hover:text-indigo-600 shadow-sm'}`}>
                              <Copy size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const newWh = { id: Date.now(), name: `Webhook ${webhooks.length + 1}`, url: "https://yourapp.io/webhooks/new", active: false };
                        setWebhooks(w => [...w, newWh]);
                        addToast("New Webhook added!", "success");
                      }}
                      className={`w-full py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm font-bold transition-colors flex items-center justify-center gap-2
                        ${isDark ? 'border-[#1a4a40] text-gray-400 hover:bg-[#133c34] hover:text-white' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 shadow-sm'}`}
                    >
                      <Plus size={16} /> Add Webhook Endpoint
                    </button>
                  </SectionCard>
                </div>
              )}

              {/* ════════════════ DANGER ZONE ════════════════ */}
              {activeTab === "danger" && (
                <div className="flex flex-col gap-4 sm:gap-6">
                  <SectionCard title="Data Export" icon={Download} isDark={isDark}>
                    <p className={`text-xs sm:text-sm mb-4 sm:mb-6 font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Download a copy of your data for backup or migration purposes.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {[
                        { title: "Export Listings", format: "CSV", icon: Download, action: () => addToast("Listings export started!", "success") },
                        { title: "Client Database", format: "JSON", icon: Download, action: () => addToast("Client data export started!", "success") },
                        { title: "Analytics Report", format: "PDF", icon: FileText, action: () => addToast("Report generating...", "success") },
                      ].map(item => (
                        <div key={item.title} className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border transition-all sm:hover:-translate-y-1 cursor-pointer flex sm:block items-center gap-4 sm:gap-0
                          ${isDark ? 'bg-[#091a16] border-[#1a4a40] hover:border-[#cddfa0]/50' : 'bg-white border-gray-200 shadow-sm hover:border-indigo-500 hover:shadow-md'}`}
                          onClick={item.action}
                        >
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:mb-4 flex items-center justify-center flex-shrink-0
                            ${isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-indigo-50 text-indigo-600'}`}>
                            <item.icon size={18} className="sm:w-5 sm:h-5" />
                          </div>
                          <div>
                            <p className={`text-[14px] sm:text-[15px] font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
                            <p className={`text-[10px] sm:text-[11px] mt-0.5 sm:mt-1 font-black uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Format: {item.format}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <div className={`rounded-2xl sm:rounded-3xl overflow-hidden border-2 shadow-sm ${isDark ? 'bg-[#0d0505] border-rose-500/30' : 'bg-white border-rose-200'}`}>
                    <div className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 border-b ${isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-100'}`}>
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-white text-rose-600 shadow-sm'}`}>
                        <AlertTriangle size={20} className="sm:w-[22px] sm:h-[22px]" />
                      </div>
                      <div>
                        <h3 className={`text-[13px] sm:text-[15px] font-black uppercase tracking-widest ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Danger Zone</h3>
                        <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-bold ${isDark ? 'text-rose-400/60' : 'text-rose-600/60'}`}>Proceed with extreme caution</p>
                      </div>
                    </div>
                    <div className="p-3 sm:p-5 flex flex-col gap-1 sm:gap-2">
                      {[
                        { title: "Archive Workspace", desc: "Temporarily pause operations. Data is preserved.", label: "Archive", action: () => setConfirm({ open: true, danger: false, isDark, title: "Archive Account?", message: "Your account will be archived. You can reactivate later by contacting support.", onConfirm: () => { setConfirm(c => ({ ...c, open: false })); addToast("Account archived.", "info"); } }), isDanger: false },
                        { title: "Purge All Listings", desc: "Permanently delete all properties.", label: "Purge Listings", action: () => setConfirm({ open: true, danger: true, isDark, title: "Delete All Listings?", message: "All property listings will be permanently deleted. This cannot be undone.", onConfirm: () => { setConfirm(c => ({ ...c, open: false })); addToast("All listings deleted.", "success"); } }), isDanger: true },
                        { title: "Reset Platform Data", desc: "Wipe all agents, clients, leads and activity history", label: "Reset Data", action: () => setConfirm({ open: true, danger: true, isDark, title: "Reset All Platform Data?", message: "All agents, clients, and data will be wiped out. This cannot be undone.", onConfirm: () => { setConfirm(c => ({ ...c, open: false })); addToast("Data reset complete.", "success"); } }), isDanger: true },
                        { title: "Delete Account Permanently", desc: "Erase everything. This action cannot be reversed.", label: "Delete Account", action: () => setConfirm({ open: true, danger: true, isDark, title: "Delete Your Account?", message: "Your account and all data will be erased permanently. This action cannot be reversed.", onConfirm: () => { setConfirm(c => ({ ...c, open: false })); addToast("Account deletion request sent.", "info"); } }), isDanger: true },
                      ].map((item, idx) => (
                        <div key={item.title} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors ${isDark ? 'hover:bg-rose-500/5' : 'hover:bg-rose-50/50'}`}>
                          <div className="mb-3 sm:mb-0 pr-0 sm:pr-4">
                            <p className={`text-[14px] sm:text-[15px] font-bold ${item.isDanger ? (isDark ? "text-rose-400" : "text-rose-600") : (isDark ? "text-white" : "text-gray-900")}`}>{item.title}</p>
                            <p className={`text-[11px] sm:text-xs mt-1 font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
                          </div>
                          <button
                            onClick={item.action}
                            className={`flex-shrink-0 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-black transition-all border shadow-sm
                              ${item.isDanger 
                                ? (isDark ? "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20 sm:hover:-translate-y-0.5" : "bg-white text-rose-600 border-rose-200 hover:bg-rose-50 sm:hover:-translate-y-0.5") 
                                : (isDark ? "bg-[#1a4a40]/40 text-[#cddfa0] border-[#1a4a40] hover:bg-[#1a4a40] sm:hover:-translate-y-0.5" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 sm:hover:-translate-y-0.5")}`}
                          >
                            {item.label}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}