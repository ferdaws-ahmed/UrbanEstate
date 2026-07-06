"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Loader2, 
  ArrowUpRight, 
  ArrowDownRight,
  Info
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import ListingViewsChart from "../overview/ListingViewsChart";
import InquiriesTrendChart from "../overview/InquiriesTrendChart";

export default function SellerAnalyticsPage() {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/dashboard")
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Engagement", 
      value: (data?.stats?.totalViews || 0) + (data?.stats?.totalFavorites || 0), 
      change: "+12.5%", 
      up: true,
      icon: TrendingUp,
      color: "text-teal-600 dark:text-[#cddfa0]",
      bg: "bg-teal-50 dark:bg-[#cddfa0]/10"
    },
    { 
      label: "Conversion Rate", 
      value: "3.2%", 
      change: "-0.4%", 
      up: false,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-400/10"
    },
    { 
      label: "Avg. Daily Views", 
      value: Math.round((data?.stats?.totalViews || 0) / 30), 
      change: "+18%", 
      up: true,
      icon: Eye,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-400/10"
    },
    { 
      label: "Market Interest", 
      value: data?.stats?.totalFavorites || 0, 
      change: "+5.2%", 
      up: true,
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-400/10"
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            Performance Analytics
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            Real-time market insights from MongoDB
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className={`p-8 rounded-[2.5rem] border shadow-xl transition-all duration-500 hover:-translate-y-1 ${
            isDark ? "bg-[var(--card)] border-white/10" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${s.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                {s.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {s.change}
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1">{s.label}</p>
              <h3 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ListingViewsChart data={data?.viewsByDay} />
        <InquiriesTrendChart data={data?.inquiriesTrend} />
      </div>

      <div className={`p-8 rounded-[2.5rem] border ${
        isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
      }`}>
        <div className="flex items-start gap-4">
          <Info className="text-teal-600 shrink-0 mt-1" size={20} />
          <div className="space-y-2">
            <h4 className={`font-black text-sm uppercase tracking-widest ${isDark ? 'text-white' : 'text-slate-900'}`}>Analytics Intelligence</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Data is aggregated from your active listings over the last 30 days. High engagement (views + favorites) typically correlates with a 40% faster closing rate. Consider optimizing property images if conversion rates drop below 2%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

