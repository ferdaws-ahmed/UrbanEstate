"use client";

import { useTheme } from "@/src/components/Theme/ThemeContext";
import { List, Eye, Heart, Clock, MessageCircle } from "lucide-react";

export default function MetricCards({ stats }) {
  const { isDark } = useTheme();
  
  const cardBase = `group relative overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1`;
  const cardStyle = {
    backgroundColor: 'var(--ue-card)',
    borderColor: 'var(--ue-border)',
    boxShadow: 'var(--ue-shadow)'
  };

  const metrics = [
    {
      label: "Active Listings",
      value: stats?.activeListings ?? 0,
      sub: "Total: " + (stats?.totalListings ?? 0),
      icon: List,
      color: "text-teal-600 dark:text-[#cddfa0]",
      bg: "bg-teal-50 dark:bg-teal-900/20",
      glow: "rgba(20, 184, 166, 0.1)",
    },
    {
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      sub: "Lifetime views",
      icon: Eye,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      glow: "rgba(59, 130, 246, 0.1)",
    },
    {
      label: "Total Favorites",
      value: stats?.totalFavorites ?? 0,
      sub: "Saved by users",
      icon: Heart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-900/20",
      glow: "rgba(244, 63, 94, 0.1)",
    },
    {
      label: "Discussions",
      value: stats?.totalComments ?? 0,
      sub: "User comments",
      icon: MessageCircle,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      glow: "rgba(147, 51, 234, 0.1)",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m, i) => (
        <div 
          key={i} 
          className="group relative overflow-hidden rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)]"
          style={{ 
            backgroundColor: 'var(--ue-card)', 
            borderColor: 'var(--ue-border)' 
          }}
        >
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--ue-text-muted)' }}>
                {m.label}
              </p>
              <h4 className={`text-4xl font-black tracking-tight ${m.color} transition-all duration-300`}>
                {m.value}
              </h4>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--ue-text-muted)' }}>
                {m.sub}
              </p>
            </div>
            <div className={`p-4 rounded-[1.25rem] ${m.bg} ${m.color} transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
              <m.icon className="h-6 w-6" />
            </div>
          </div>
          {/* Decorative accent */}
          <div className={`absolute -right-8 -bottom-8 h-32 w-32 rounded-full opacity-20 blur-3xl transition-all duration-700 group-hover:scale-150 ${m.bg}`}></div>
        </div>
      ))}
    </div>
  );
}


