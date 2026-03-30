"use client";

import { useState, useEffect } from "react";
import { 
  Heart, 
  Trash2, 
  MapPin, 
  ExternalLink, 
  Loader2, 
  Inbox,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function UserFavorites() {
  const { isDark } = useTheme();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      const data = await res.json();
      if (res.ok) {
        // In a real app, you might have a dedicated endpoint for favorites
        // For now, we reuse the dashboard data or simulate it
        setFavorites(data.recentFavorites || []);
      }
    } catch (err) {
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (propertyId) => {
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });

      if (res.ok) {
        setFavorites(prev => prev.filter(f => f.id !== propertyId));
        toast.success("Removed from favorites");
      }
    } catch (err) {
      toast.error("Action failed");
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
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
          Saved Assets <span className="text-blue-600 ml-2">({favorites.length})</span>
        </h2>
        <Link href="/all-properties" className="text-xs font-bold text-blue-600 flex items-center gap-2 hover:underline">
          <Sparkles size={14} /> Find more properties
        </Link>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div 
              key={item.id}
              className={`group rounded-[2.5rem] border overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 ${
                isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => removeFavorite(item.id)}
                    className="p-3 rounded-2xl bg-white/10 backdrop-blur-md text-white hover:bg-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4">
                   <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black shadow-lg">
                      ${item.price?.toLocaleString()}
                   </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className={`text-lg font-bold mb-2 truncate ${isDark ? "text-white" : "text-slate-900"}`}>{item.title}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-xs mb-6">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="truncate uppercase tracking-widest font-bold max-w-full">{item.location}</span>
                </div>
                
                <Link 
                  href={`/propertydetails/${item.id}`}
                  className={`w-full py-4 rounded-2xl border flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                    isDark 
                      ? "border-white/10 text-white hover:bg-white/5" 
                      : "border-slate-100 text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
          <div className="p-6 rounded-3xl bg-blue-500/10 text-blue-500 mb-6">
            <Heart size={48} />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>Your heart is empty</h3>
          <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">You haven't saved any properties yet. Start exploring and find your dream home.</p>
          <Link href="/all-properties" className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
            Browse Properties
          </Link>
        </div>
      )}
    </div>
  );
}
