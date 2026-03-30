"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Inbox,
  Home,
  CheckCircle2,
  Mail,
  Search,
  ExternalLink,
  History,
  Heart,
  Bell,
  Sparkles,
  ShoppingBag,
  CreditCard,
  BadgeCheck
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function UserInquiries() {
  const { isDark } = useTheme();
  const [inquiries, setInquiries] = useState([]);
  const [history, setHistory] = useState({ likes: [], comments: [] });
  const [purchases, setPurchases] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("messages"); // messages, activity, purchases, alerts

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      const data = await res.json();
      if (res.ok) {
        setInquiries(data.recentInquiries || []);
        setHistory({ 
          likes: data.recentFavorites || [], 
          comments: data.userComments || [] 
        });
        setPurchases(data.purchases || []);
        setNotifications(data.activityFeed || []);
      }
    } catch (err) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Activity Hub <span className="text-blue-600 ml-2">({inquiries.length + history.likes.length + history.comments.length})</span>
          </h2>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Track your interactions and alerts</p>
        </div>
        
        <div className={`flex p-1.5 rounded-2xl border transition-all ${isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"}`}>
          {[
            { id: "messages", icon: MessageSquare, label: "My Messages" },
            { id: "activity", icon: History, label: "My History" },
            { id: "purchases", icon: ShoppingBag, label: "Purchase History" },
            { id: "alerts", icon: Bell, label: "Alerts Feed" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : isDark ? "text-slate-400 hover:bg-white/5" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === "messages" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
          {inquiries.length > 0 ? (
            inquiries.map((item) => (
              <div 
                key={item.id}
                className={`p-8 rounded-[2.5rem] border transition-all hover:shadow-2xl relative group ${
                  isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
                }`}
              >
                {/* INQUIRY CARD CONTENT (ALREADY THERE) */}
                <div className="flex items-center justify-between mb-8">
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    item.status === 'new' 
                      ? 'bg-blue-600/10 text-blue-600 border-blue-600/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                      : 'bg-emerald-600/10 text-emerald-600 border-emerald-600/20'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-1.5 ${item.status === 'new' ? 'bg-blue-600 animate-pulse' : 'bg-emerald-500'}`} />
                    {item.status} Inquiry
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Clock size={12} /> {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                       isDark ? "bg-white/5 border-white/5 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
                     }`}>
                        <Home size={24} />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Asset Reference</p>
                        <h4 className={`text-lg font-black truncate leading-tight ${isDark ? "text-white" : "text-slate-900"}`}>{item.propertyTitle}</h4>
                     </div>
                     <Link href={`/propertydetails/${item.propertyId}?view=1`} className={`ml-auto p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all ${
                       isDark ? "bg-white/5 text-slate-400" : "bg-slate-50 text-slate-500"
                     }`}>
                        <ExternalLink size={18} />
                     </Link>
                  </div>

                  <div className={`p-6 rounded-[2rem] italic text-sm leading-relaxed relative ${
                    isDark ? "bg-white/5 text-slate-300 border border-white/5" : "bg-slate-50 text-slate-600 border border-slate-100"
                  }`}>
                     <span className="absolute -top-3 left-6 text-4xl opacity-10 font-serif">"</span>
                     {item.message}
                     <span className="absolute -bottom-6 right-6 text-4xl opacity-10 font-serif rotate-180">"</span>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                     <Link href="/dashboard/user/chat" className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2">
                        <Mail size={14} /> Open Chat Messenger
                     </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
              <div className="p-8 rounded-full bg-blue-500/10 text-blue-500 mb-6 animate-pulse">
                <MessageSquare size={48} />
              </div>
              <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Silent Inbox</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">Start exploring and find your dream home.</p>
              <Link href="/all-properties" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3">
                Explore Properties <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "activity" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LIKES HISTORY */}
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"}`}>
              <h3 className={`text-xl font-black mb-6 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                <Heart className="text-rose-500" fill="currentColor" size={20} /> Property Saves
              </h3>
              <div className="space-y-4">
                {history.likes.map((like) => (
                  <div key={like.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-transparent shadow-sm"}`}>
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0">
                      <img src={like.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-900"}`}>{like.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{like.location}</p>
                    </div>
                    <Link href={`/propertydetails/${like.id}?view=1`} className="p-2 rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                ))}
                {history.likes.length === 0 && <p className="text-xs text-slate-500 font-bold uppercase tracking-widest p-4 text-center">No save history</p>}
              </div>
            </div>

            {/* COMMENTS HISTORY */}
            <div className={`p-8 rounded-[2.5rem] border ${isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"}`}>
              <h3 className={`text-xl font-black mb-6 flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                <MessageSquare className="text-blue-500" size={20} /> My Comments
              </h3>
              <div className="space-y-4">
                {history.comments.map((c) => (
                  <div key={c.id} className={`p-5 rounded-2xl border ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-transparent shadow-sm"}`}>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2">{c.propertyTitle}</p>
                    <p className={`text-xs italic leading-relaxed ${isDark ? "text-slate-300" : "text-slate-600"}`}>"{c.comment || c.text}"</p>
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                    <Link href={`/propertydetails/${c.propertyId}?view=1`} className="text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Property</Link>
                    </div>
                  </div>
                ))}
                {history.comments.length === 0 && <p className="text-xs text-slate-500 font-bold uppercase tracking-widest p-4 text-center">No comment history</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "purchases" && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
          {purchases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchases.map((p) => (
                <div key={p.id} className={`p-6 rounded-[2.5rem] border transition-all hover:shadow-2xl ${
                  isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
                }`}>
                  <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img src={p.image} className="w-full h-full object-cover" alt="" />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-full shadow-lg">
                      {p.status}
                    </div>
                  </div>
                  <h4 className={`text-sm font-black mb-2 truncate ${isDark ? "text-white" : "text-slate-900"}`}>{p.propertyTitle}</h4>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-blue-600 font-black text-sm">${p.amount?.toLocaleString()}</p>
                    </div>
                    <Link href={`/propertydetails/${p.propertyId}?view=1`} className="p-3 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform">
                      <ExternalLink size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
              <div className="p-8 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                <CreditCard size={48} />
              </div>
              <h3 className={`text-2xl font-black mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>No Transactions</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-10 leading-relaxed">Your purchase history is empty. Assets you buy will be listed here with payment details.</p>
              <Link href="/all-properties" className="px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-3">
                Find Assets to Buy <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </div>
      )}

      {activeTab === "alerts" && (
        <div className={`p-10 rounded-[3rem] border animate-in slide-in-from-bottom-4 duration-500 ${
          isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="flex items-center justify-between mb-10">
             <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Real-time Alert Feed</h3>
             <Sparkles className="text-amber-500 animate-pulse" size={20} />
          </div>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif._id} className={`flex gap-6 p-6 rounded-3xl transition-all border ${
                isDark ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-100 hover:shadow-xl"
              }`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  notif.type === 'system' ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-emerald-600 text-white shadow-emerald-600/20'
                }`}>
                   <Bell size={24} />
                </div>
                <div className="flex-1">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-600/10 px-3 py-1 rounded-full border border-blue-600/10">
                        {notif.type} notification
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                   </div>
                   <p className={`text-sm font-medium leading-relaxed ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                      {notif.text}
                   </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="py-20 text-center">
                 <Bell size={48} className="mx-auto mb-4 opacity-10" />
                 <p className="text-xs font-black uppercase tracking-widest text-slate-400">No activity alerts detected</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
