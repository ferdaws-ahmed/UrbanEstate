"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Eye, 
  Edit3, 
  Trash2, 
  Loader2, 
  Plus, 
  MapPin, 
  DollarSign,
  Maximize,
  ArrowRight,
  Filter,
  Heart,
  MessageSquare
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";
import LocationName from "@/src/components/shared/LocationName";

export default function SellerListingsPage() {
  const { isDark } = useTheme();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/seller/dashboard");
        const data = await res.json();
        if (data && data.listings) {
          setListings(data.listings);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this asset? This action cannot be undone.")) return;
    
    const tid = toast.loading("Deleting asset...");
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      
      setListings(prev => prev.filter(p => p._id !== id));
      toast.success("Asset removed from database", { id: tid });
    } catch (error) {
      toast.error("Failed to delete asset", { id: tid });
    }
  };

  const filtered = useMemo(() => {
    return listings.filter(p => 
      p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listings, searchTerm]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
            My Property Assets
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            Managing {listings.length} Listed Properties
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
            <input 
              type="text"
              placeholder="Filter assets..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className={`pl-12 pr-6 py-4 rounded-2xl border outline-none text-xs font-bold transition-all w-64 ${
                isDark ? "bg-[#0b1f1a] border-[#1a4a40] text-white focus:border-[#cddfa0]" : "bg-white border-slate-200 focus:border-teal-500"
              }`}
            />
          </div>
          <Link 
            href="/dashboard/seller/create-listing"
            className="flex items-center gap-2 px-8 py-4 bg-teal-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20 active:scale-95"
          >
            <Plus size={16} /> New Asset
          </Link>
        </div>
      </div>

      <div 
        className="rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)]"
        style={{ 
          backgroundColor: 'var(--ue-card)', 
          borderColor: 'var(--ue-border)' 
        }}
      >
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: 'var(--ue-text-muted)' }}>
                <th className="px-10 py-8">Asset Details</th>
                <th className="px-6 py-8">Location</th>
                <th className="px-6 py-8">Engagement</th>
                <th className="px-6 py-8">Valuation</th>
                <th className="px-6 py-8">Status</th>
                <th className="px-10 py-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--ue-border)' }}>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-24 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--ue-text-muted)' }}>No matching assets found</p>
                  </td>
                </tr>
              ) : (
                paginated.map((p) => (
                  <tr key={p._id} className={`group transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-slate-50"}`}>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-6">
                        <div className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-500 ${isDark ? 'border-white/5 shadow-black/20' : 'border-white shadow-lg'}`}>
                          <Image 
                            src={p.images?.[0] || "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg"} 
                            alt="" 
                            fill 
                            className="object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-lg font-black truncate max-w-[250px]" style={{ color: 'var(--ue-text-main)' }}>{p.title}</h4>
                          <p className="text-[10px] font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-widest mt-1">{p.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2" style={{ color: 'var(--ue-text-muted)' }}>
                        <MapPin size={14} className="text-teal-500" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">
                          <LocationName lat={p.location?.latitude} lon={p.location?.longitude} />
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-rose-500/10 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                            <Heart size={14} fill="currentColor" />
                          </div>
                          <span className="text-sm font-black" style={{ color: 'var(--ue-text-main)' }}>{p.favoriteCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                            <Eye size={14} fill="currentColor" />
                          </div>
                          <span className="text-sm font-black" style={{ color: 'var(--ue-text-main)' }}>{p.visitCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'}`}>
                            <MessageSquare size={14} fill="currentColor" />
                          </div>
                          <span className="text-sm font-black" style={{ color: 'var(--ue-text-main)' }}>{p.commentCount || 0}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-lg font-black" style={{ color: 'var(--ue-text-main)' }}>৳ {p.price?.toLocaleString()}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--ue-text-muted)' }}>Market Value</p>
                    </td>
                    <td className="px-6 py-6">
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        p.status === 'active' || p.status === 'published'
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                      }`}>
                        {p.status || "Draft"}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/propertydetails/${p._id}`}
                          className={`p-3 rounded-xl transition-all ${isDark ? "bg-white/5 text-slate-300 hover:bg-teal-500 hover:text-white" : "bg-slate-50 text-slate-500 hover:bg-teal-600 hover:text-white"}`}
                          title="View Asset"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/dashboard/seller/edit/${p._id}`}
                          className={`p-3 rounded-xl transition-all ${isDark ? "bg-white/5 text-slate-300 hover:bg-blue-500 hover:text-white" : "bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white"}`}
                          title="Edit Details"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(p._id)}
                          className={`p-3 rounded-xl transition-all ${isDark ? "bg-white/5 text-slate-300 hover:bg-rose-500 hover:text-white" : "bg-slate-50 text-slate-500 hover:bg-rose-600 hover:text-white"}`}
                          title="Delete Asset"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div 
            className="p-8 border-t flex items-center justify-between transition-colors"
            style={{ borderColor: 'var(--ue-border)', backgroundColor: 'rgba(255,255,255,0.01)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--ue-text-muted)' }}>Showing page {page} of {totalPages}</p>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-10 w-10 rounded-xl text-[10px] font-black transition-all ${
                    page === i + 1
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
                    : isDark ? "bg-white/5 text-slate-400 hover:bg-white/10" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
