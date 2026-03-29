"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  MessageSquare, 
  User, 
  Clock, 
  ArrowRight, 
  Loader2, 
  Inbox,
  Mail,
  CheckCircle2,
  Home,
  ExternalLink,
  Heart,
  Send,
  BellRing
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function SellerLeadsPage() {
  const { isDark } = useTheme();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // all, favorite, direct, unread

  const fetchLeads = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/seller/dashboard");
      const data = await res.json();
      if (data && data.recentInquiries) {
        setLeads(data.recentInquiries);
      }
    } catch (error) {
      console.error("Leads fetch error:", error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchLeads();

    // Polling for real-time updates every 5 seconds
    const interval = setInterval(() => {
      fetchLeads(true);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    return {
      total: leads.length,
      favorite: leads.filter(l => l.type === "favorite_lead").length,
      direct: leads.filter(l => l.type === "contact_lead" || l.type === "lead").length,
      unread: leads.filter(l => l.status === "new").length
    };
  }, [leads]);

  const sortedAndFilteredLeads = useMemo(() => {
    let result = [...leads];

    // Sorting: Unread ("new") first, then by date
    result.sort((a, b) => {
      if (a.status === "new" && b.status !== "new") return -1;
      if (a.status !== "new" && b.status === "new") return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    if (activeTab === "unread") {
      return result.filter(l => l.status === "new");
    }
    if (activeTab === "favorite") {
      return result.filter(l => l.type === "favorite_lead");
    }
    if (activeTab === "comment") {
      return result.filter(l => l.type === "comment_lead");
    }
    if (activeTab === "direct") {
      return result.filter(l => l.type === "contact_lead" || l.type === "lead");
    }

    return result;
  }, [leads, activeTab]);

  const handleMarkAsRead = async (leadId) => {
    try {
      const res = await fetch("/api/seller/leads/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId }),
      });

      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: "read" } : l));
        toast.success("Marked as read");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading || !mounted) {
    return (
      <div suppressHydrationWarning className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const tabs = [
    { id: "all", label: "Total Messages", count: stats.total, icon: Inbox },
    { id: "favorite", label: "Favorite Alerts", count: stats.favorite, icon: Heart },
    { id: "comment", label: "Asset Discussions", count: leads.filter(l => l.type === "comment_lead").length, icon: MessageSquare },
    { id: "direct", label: "Direct Messages", count: stats.direct, icon: Send },
    { id: "unread", label: "Unread", count: stats.unread, icon: BellRing, blink: stats.unread > 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Communications <span className="text-teal-600">Hub</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
            Real-time inquiry management & tracking
          </p>
        </div>
      </div>

      {/* STATS NAVBAR */}
      <div className={`grid grid-cols-2 md:grid-cols-5 gap-4 p-2 rounded-[2rem] border transition-all ${
        isDark ? "bg-[#0b1f1a] border-white/5" : "bg-white border-slate-100 shadow-sm"
      }`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center gap-2 py-6 rounded-[1.5rem] transition-all group ${
              activeTab === tab.id 
                ? (isDark ? "bg-teal-600 text-white shadow-xl shadow-teal-900/40" : "bg-slate-900 text-white shadow-xl")
                : (isDark ? "hover:bg-white/5 text-slate-400" : "hover:bg-slate-50 text-slate-500")
            } ${tab.blink ? "animate-pulse ring-2 ring-red-500/50" : ""}`}
          >
            <tab.icon size={20} className={`transition-transform group-hover:scale-110 ${
              tab.id === "unread" && tab.count > 0 ? "text-red-500" : ""
            }`} />
            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            <span className={`text-xl font-black ${
              activeTab === tab.id ? "text-white" : (isDark ? "text-teal-500" : "text-teal-600")
            }`}>
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-8 relative mt-12">
        {/* CENTER DIVIDER LINE (Hidden on mobile) */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/5 -translate-x-1/2" />

        {sortedAndFilteredLeads.length === 0 ? (
          <div className={`p-24 text-center rounded-[3rem] border border-dashed ${
            isDark ? "border-[#1a4a40] text-slate-500" : "border-slate-200 text-slate-400"
          }`}>
            <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-sm">No Messages In This Category</p>
          </div>
        ) : (
          sortedAndFilteredLeads.map((lead) => {
            const isContact = lead.type === "contact_lead" || lead.type === "lead";
            const isComment = lead.type === "comment_lead";
            const isUnread = lead.status === "new";
            
            return (
              <div 
                key={lead.id}
                className={`flex w-full animate-in slide-in-from-bottom-4 duration-500 ${isContact ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`group w-full lg:w-[48%] p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)] relative ${
                    isUnread 
                      ? (isDark ? "border-teal-500/50 bg-[#0f2e28]/40 ring-1 ring-teal-500/20" : "border-teal-200 bg-teal-50/50 ring-1 ring-teal-100")
                      : (isDark ? "bg-[#0b1f1a] border-white/5" : "bg-white border-slate-100")
                  }`}
                  style={{ 
                    borderColor: isUnread ? undefined : 'var(--ue-border)' 
                  }}
                >
                  {/* UNREAD DOT */}
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-[#0b1f1a]"></span>
                    </div>
                  )}

                  {/* TYPE TAG */}
                  <div className={`absolute -top-3 ${isContact ? "right-8" : "left-8"} px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${
                    isContact 
                      ? "bg-teal-600 text-white border-teal-500" 
                      : isComment 
                        ? "bg-purple-600 text-white border-purple-500"
                        : "bg-rose-500 text-white border-rose-400"
                  }`}>
                    {isContact ? "Direct Message" : isComment ? "Asset Discussion" : "Favorite Alert"}
                  </div>

                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                      <div className={`h-14 w-14 shrink-0 rounded-2xl overflow-hidden border-2 transition-colors ${
                        isDark ? "bg-[#1a4a40] border-white/5" : "bg-white border-slate-100 shadow-sm"
                      }`}>
                        {lead.avatar ? (
                          <img src={lead.avatar} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <div className={`h-full w-full flex items-center justify-center text-xl font-black ${
                            isContact ? "text-teal-600 dark:text-[#cddfa0]" : isComment ? "text-purple-500" : "text-rose-500"
                          }`}>
                            {lead.name?.charAt(0) || "U"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`text-lg font-black tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.name}</h3>
                        <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
                          {lead.email}
                        </p>
                      </div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className={`p-5 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-white/60'} italic text-slate-600 dark:text-slate-300 text-xs leading-relaxed border border-slate-100 dark:border-white/5 relative`}>
                      <span className={`absolute -top-2 ${isContact ? "right-4" : "left-4"} text-2xl opacity-20 font-serif`}>"</span>
                      {lead.message}
                    </div>

                    {lead.propertyTitle && (
                      <div className={`p-4 rounded-2xl flex items-center justify-between gap-4 border ${
                        isDark ? 'bg-white/5 border-white/5' : 'bg-white/80 border-slate-100 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2 rounded-lg shrink-0 ${isContact ? 'bg-teal-600 text-white' : isComment ? 'bg-purple-600 text-white' : 'bg-rose-500 text-white'}`}>
                            <Home size={12} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Regarding Asset</p>
                            <h4 className={`text-[10px] font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.propertyTitle}</h4>
                          </div>
                        </div>
                        <Link 
                          href={`/propertydetails/${lead.propertyId}`}
                          className={`shrink-0 p-2 rounded-lg transition-all ${
                            isDark ? 'text-[#cddfa0] hover:bg-[#cddfa0]/10' : 'text-teal-600 hover:bg-teal-600/10'
                          }`}
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      {(isContact || isComment) && (
                        <button className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest hover:bg-teal-600 transition-all flex items-center justify-center gap-2">
                          {isComment ? "Join Discussion" : "Reply"} <ArrowRight size={12} />
                        </button>
                      )}
                      {isUnread && (
                        <button 
                          onClick={() => handleMarkAsRead(lead.id)}
                          className={`flex-1 py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                            isDark ? 'border-teal-500/30 text-teal-500 hover:bg-teal-500/10' : 'border-teal-200 text-teal-600 hover:bg-teal-50'
                          }`}
                        >
                          Mark as Read <CheckCircle2 size={12} />
                        </button>
                      )}
                      {!isUnread && (
                        <div className={`flex-1 py-3 text-center text-[8px] font-black uppercase tracking-widest opacity-40`}>
                          Viewed & Processed
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
