"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Heart, Info, X, User, Mail, Clock, MapPin, Eye, MessageSquare } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import LocationName from "@/src/components/shared/LocationName";

const FavoritesModal = ({ isOpen, onClose, favorites, propertyTitle }) => {
  const { isDark } = useTheme();
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300`}>
      <div className={`relative w-full max-w-lg rounded-[2.5rem] border shadow-2xl overflow-hidden ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]' : 'bg-white border-slate-200'}`}>
        <div className={`p-8 border-b flex items-center justify-between ${isDark ? 'border-[#1a4a40]/40 bg-white/5' : 'border-slate-100 bg-slate-50'}`}>
          <div>
            <h3 className={`text-xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Property Favorites</h3>
            <p className="text-[10px] font-black text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">{propertyTitle}</p>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-all ${isDark ? 'hover:bg-white/10 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
            <X size={24} />
          </button>
        </div>
        
        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {favorites.length === 0 ? (
            <div className="text-center py-16 opacity-30">
              <Heart className={`h-16 w-16 mx-auto mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`} />
              <p className="font-black uppercase tracking-[0.25em] text-xs">No activity detected</p>
            </div>
          ) : (
            <div className="space-y-5">
              {favorites.map((fav, i) => (
                <div key={i} className={`flex items-center gap-5 p-5 rounded-3xl border transition-all hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
                  <div className="h-14 w-14 rounded-2xl overflow-hidden bg-teal-600 border-2 border-white dark:border-white/10 shadow-lg">
                    {fav.userImage ? (
                      <img src={fav.userImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white font-black text-lg">
                        {fav.userName?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-black text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{fav.userName}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-1.5">
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-slate-500 uppercase tracking-tight">
                        <Mail size={12} className="text-teal-600" /> {fav.userEmail}
                      </span>
                      <span className="hidden sm:block text-slate-300">•</span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-teal-600 dark:text-[#cddfa0] uppercase tracking-tight">
                        <Clock size={12} /> {new Date(fav.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className={`p-6 border-t ${isDark ? 'border-[#1a4a40]/40' : 'border-slate-100 bg-slate-50/50'}`}>
          <button onClick={onClose} className="w-full py-4 rounded-2xl bg-teal-600 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-[0.98]">
            Dismiss Panel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function MyListingsTable({ listings = [] }) {
  const { isDark } = useTheme();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const perPage = 5;

  const list = Array.isArray(listings) ? listings : [];

  const filtered = useMemo(() => {
    if (!q.trim()) return list;
    const s = q.toLowerCase();
    return list.filter((p) =>
      (p.title || "").toLowerCase().includes(s)
    );
  }, [list, q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const slice = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div 
      className="rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)]"
      style={{ 
        backgroundColor: 'var(--ue-card)', 
        borderColor: 'var(--ue-border)' 
      }}
    >
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 border-b transition-colors"
        style={{ borderColor: 'var(--ue-border)', backgroundColor: 'rgba(255,255,255,0.02)' }}
      >
        <div>
          <h3 className={`text-xs font-black tracking-[0.3em] uppercase ${isDark ? "text-[#cddfa0]" : "text-teal-700"}`}>Protocol Asset Management</h3>
          <p className="text-[10px] font-black uppercase mt-1.5 tracking-wider" style={{ color: 'var(--ue-text-muted)' }}>Syncing live marketplace data</p>
        </div>
        <div className="relative max-w-xs w-full group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
          <input
            type="search"
            placeholder="Search assets..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className={`w-full rounded-2xl border py-4 pl-12 pr-4 text-[11px] font-black uppercase tracking-widest outline-none transition-all ${
              isDark 
                ? "border-[#1a4a40] bg-[#0b1f1a] text-white focus:border-[#cddfa0] focus:ring-4 focus:ring-[#cddfa0]/5" 
                : "border-slate-200 bg-white text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 shadow-inner"
            }`}
          />
        </div>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--ue-text-muted)' }}>
              <th className="px-8 py-6">Asset Profile</th>
              <th className="px-8 py-6">Geo-Node</th>
              <th className="px-8 py-6">Engagement</th>
              <th className="px-8 py-6 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--ue-border)' }}>
            {slice.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-24 text-center opacity-30">
                  <div className="flex flex-col items-center gap-4">
                    <Info className="h-10 w-10" style={{ color: 'var(--ue-text-main)' }} />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: 'var(--ue-text-main)' }}>No records found</p>
                  </div>
                </td>
              </tr>
            ) : (
              slice.map((p) => (
                <tr key={p._id} className={`group transition-all duration-300 ${isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"}`}>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl border-4 transition-all duration-500 ${isDark ? 'border-white/5 shadow-black/20' : 'border-white shadow-lg'}`}>
                        <Image
                          src={Array.isArray(p.images) && p.images[0] ? p.images[0] : "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-black truncate max-w-[220px] tracking-tight transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>
                          {p.title}
                        </p>
                        <p className="text-[11px] font-black text-teal-600 dark:text-[#cddfa0] uppercase tracking-widest mt-1">
                         $ {p.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ue-text-muted)' }}>
                      <MapPin size={12} className="text-teal-600" />
                      <LocationName lat={p.location?.latitude} lon={p.location?.longitude} />
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                          <Heart size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs font-black transition-colors duration-300" style={{ color: 'var(--ue-text-main)' }}>{p.favoriteCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          <Eye size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs font-black transition-colors duration-300" style={{ color: 'var(--ue-text-main)' }}>{p.visitCount || 0}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                          <MessageSquare size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs font-black transition-colors duration-300" style={{ color: 'var(--ue-text-main)' }}>{p.commentCount || 0}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => setSelectedProperty(p)}
                      className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                        isDark 
                          ? "bg-[#1a4a40] text-[#cddfa0] hover:bg-[#cddfa0] hover:text-[#0b1f1a]" 
                          : "bg-slate-900 text-white hover:bg-teal-600 shadow-lg shadow-teal-100"
                      } active:scale-95`}
                    >
                      Inquiry Scan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div 
          className="p-6 flex items-center justify-center gap-3 border-t transition-colors"
          style={{ borderColor: 'var(--ue-border)', backgroundColor: 'rgba(255,255,255,0.01)' }}
        >
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-10 w-10 rounded-xl text-[10px] font-black transition-all duration-300 ${
                page === i + 1
                  ? "bg-teal-600 text-white shadow-xl shadow-teal-600/30 scale-110"
                  : isDark 
                    ? "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white" 
                    : "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-teal-600 shadow-sm"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedProperty && (
        <FavoritesModal 
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          favorites={selectedProperty.favorites || []}
          propertyTitle={selectedProperty.title}
        />
      )}
    </div>
  );
}