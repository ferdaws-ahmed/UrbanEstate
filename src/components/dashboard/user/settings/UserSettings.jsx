"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  Trash2, 
  BellRing, 
  Lock, 
  Eye, 
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function UserSettings() {
  const { isDark } = useTheme();
  const [notifications, setNotifications] = useState({
    email: true,
    chat: true,
    alerts: false
  });

  const handleDeleteAccount = () => {
    const confirmed = confirm("Are you absolutely sure you want to delete your UrbanEstate account? This action is permanent and all your data (favorites, inquiries, chat history) will be wiped from MongoDB.");
    if (confirmed) {
      toast.error("Account deletion is restricted in this demo environment for safety.");
    }
  };

  return (
    <div className="max-w-4xl space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Account Control Section */}
      <section className={`p-8 rounded-[2.5rem] border ${
        isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
      }`}>
        <h3 className={`text-xl font-black mb-8 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
          <ShieldAlert className="text-blue-600" size={24} /> Account Control
        </h3>
        
        <div className="space-y-4">
          <button className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all border ${
            isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-lg"
          }`}>
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600">
                <KeyRound size={20} />
              </div>
              <div className="text-left">
                <p className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Update Security Credentials</p>
                <p className="text-[10px] text-slate-500 font-medium">Change your password or auth provider settings</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-400" />
          </button>
        </div>
      </section>

      {/* Notifications Section */}
      <section className={`p-8 rounded-[2.5rem] border ${
        isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
      }`}>
        <h3 className={`text-xl font-black mb-8 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
          <BellRing className="text-amber-500" size={24} /> Communication
        </h3>
        
        <div className="space-y-6">
          {Object.entries(notifications).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between px-2">
              <div>
                <p className={`text-sm font-bold capitalize ${isDark ? "text-white" : "text-slate-900"}`}>{key} Notifications</p>
                <p className="text-[10px] text-slate-500 font-medium">Receive alerts about your {key} activity</p>
              </div>
              <button 
                onClick={() => setNotifications({...notifications, [key]: !val})}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${val ? "bg-blue-600" : "bg-slate-300"}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${val ? "left-7" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section className={`p-8 rounded-[2.5rem] border ${
        isDark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50 border-rose-100"
      }`}>
        <h3 className="text-xl font-black mb-4 flex items-center gap-3 text-rose-600">
          <ShieldAlert size={24} /> Danger Zone
        </h3>
        <p className="text-sm text-slate-500 mb-8 max-w-lg">Deleting your account will remove all your saved assets, message history, and identity records. This action is permanent.</p>
        
        <div className={`p-6 rounded-2xl bg-white dark:bg-black/20 border border-rose-200 dark:border-rose-500/20 mb-8 flex items-start gap-4`}>
           <AlertCircle className="text-rose-500 shrink-0" size={20} />
           <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed">Proceed with caution. You will lose access to all premium features and property valuation history.</p>
        </div>

        <button 
          onClick={handleDeleteAccount}
          className="px-10 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Trash2 size={18} /> Delete My UrbanEstate Account
        </button>
      </section>
    </div>
  );
}

import { KeyRound } from "lucide-react";
