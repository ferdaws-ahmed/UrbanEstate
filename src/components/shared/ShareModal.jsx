"use client";

import React from "react";
import { X, Mail, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function ShareModal({ isOpen, onClose, url, title }) {
  const { isDark } = useTheme();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2]",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-red-500",
      link: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`relative w-full max-w-sm rounded-[2.5rem] border shadow-2xl p-8 overflow-hidden transition-all transform scale-100 ${
          isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-200"
        }`}
      >
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-xl transition-all ${
            isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"
          }`}
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Share Asset
          </h3>
          <p className="text-[10px] font-bold text-teal-600 dark:text-[var(--accent)] uppercase tracking-[0.2em] mt-1">
            Spread the word about this property
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          {shareLinks.map((item) => (
            <a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-3 p-6 rounded-3xl transition-all hover:scale-105 ${
                isDark ? "bg-white/5 hover:bg-white/10" : "bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${item.color}`}>
                <item.icon size={24} />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                {item.name}
              </span>
            </a>
          ))}
        </div>

        <div className={`p-1.5 rounded-2xl border flex items-center gap-2 ${
          isDark ? "bg-black/20 border-white/5" : "bg-slate-50 border-slate-200"
        }`}>
          <div className="flex-1 px-4 text-[10px] font-mono text-slate-500 truncate">
            {url}
          </div>
          <button
            onClick={handleCopy}
            className={`p-3 rounded-xl transition-all flex items-center gap-2 ${
              copied 
                ? "bg-emerald-500 text-white" 
                : (isDark ? "bg-[var(--primary)] text-white" : "bg-teal-600 text-white")
            }`}
          >
            {copied ? <Check size={14} /> : <LinkIcon size={14} />}
            <span className="text-[10px] font-black uppercase tracking-widest px-1">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

