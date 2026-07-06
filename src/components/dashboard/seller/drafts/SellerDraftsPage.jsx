"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Clock, 
  MapPin, 
  DollarSign,
  AlertCircle,
  Globe
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function SellerDraftsPage() {
  const { isDark } = useTheme();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchDrafts();
  }, []);

  const fetchDrafts = async () => {
    try {
      const res = await fetch("/api/property/draft");
      if (!res.ok) throw new Error("Failed to fetch drafts");
      const data = await res.json();
      setDrafts(data);
    } catch (error) {
      toast.error("Error loading drafts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently wipe this draft protocol?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/property/draft?id=${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete draft");
      
      toast.success("Draft wiped from secure storage");
      setDrafts(drafts.filter(d => d._id !== id));
    } catch (error) {
      toast.error("Could not delete draft");
    } finally {
      setProcessingId(null);
    }
  };

  const handlePublish = async (id) => {
    if (!confirm("Initiate final publication for this asset?")) return;

    setProcessingId(id);
    try {
      const res = await fetch("/api/property/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: id }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Asset successfully published to the properties collection!");
        setDrafts(drafts.filter(d => d._id !== id));
      } else {
        toast.error(data.error || "Publication sequence failed");
      }
    } catch (error) {
      toast.error("Network error during publication");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-black tracking-tighter ${isDark ? "text-white" : "text-slate-900"}`}>
            Draft Listings
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            You have {drafts.length} pending drafts
          </p>
        </div>
      </div>

      {drafts.length === 0 ? (
        <div 
          className="p-24 rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center text-center transition-all border-slate-200 dark:border-white/10 bg-white/5 dark:bg-white/5"
        >
          <div className="h-24 w-24 rounded-[2rem] bg-teal-600/10 text-teal-600 flex items-center justify-center mb-8 shadow-inner">
            <FileText size={48} />
          </div>
          <h3 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>No Drafts Detected</h3>
          <p className={`max-w-xs mt-3 text-sm font-bold uppercase tracking-tight ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Your saved property protocols will appear here for final deployment.</p>
          <Link 
            href="/dashboard/seller/create-listing"
            className="mt-10 px-10 py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
          >
            Initiate New Asset
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {drafts.map((draft) => (
            <div 
              key={draft._id}
              className="group relative rounded-[2.5rem] border p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 shadow-sm dark:shadow-[0_20px_25px_-5px_rgb(0,0,0,0.3)]"
              style={{ 
                backgroundColor: 'var(--ue-card)', 
                borderColor: 'var(--ue-border)' 
              }}
            >
              <div className="flex justify-between items-start mb-8">
                <div className={`p-4 rounded-2xl shadow-inner ${isDark ? "bg-white/5 text-[#cddfa0]" : "bg-teal-50 text-teal-600"}`}>
                  <FileText size={24} />
                </div>
                <button 
                  onClick={() => handleDelete(draft._id)}
                  className="p-3 text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-colors group/del"
                  title="Wipe Draft"
                >
                  <Trash2 size={20} className="group-hover/del:scale-110 transition-transform" />
                </button>
              </div>

              <div className="space-y-5">
                <h3 className={`text-xl font-black leading-tight line-clamp-2 min-h-[3.5rem]`} style={{ color: 'var(--ue-text-main)' }}>
                  {draft.title || "Untitled Protocol"}
                </h3>
                
                <div className="space-y-3 py-6 border-y" style={{ borderColor: 'var(--ue-border)' }}>
                  <div className="flex items-center gap-3">
                    <DollarSign size={16} className="text-teal-600" />
                    <span className="text-[11px] font-black tracking-[0.1em] uppercase" style={{ color: 'var(--ue-text-main)' }}>
                     $ {draft.price ? Number(draft.price).toLocaleString() : "0"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-teal-600" />
                    <span className="text-[10px] font-black uppercase tracking-wider truncate" style={{ color: 'var(--ue-text-muted)' }}>
                      {draft.address || "Geo-Node N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-teal-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--ue-text-muted)' }}>
                      Updated {new Date(draft.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Link 
                    href={`/dashboard/seller/create-listing?draftId=${draft._id}`}
                    className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all border ${
                      isDark 
                      ? "border-white/10 text-white hover:bg-white/5" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    Resume <ExternalLink size={14} />
                  </Link>
                  <button 
                    onClick={() => handlePublish(draft._id)}
                    disabled={processingId === draft._id}
                    className={`flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.25em] transition-all disabled:opacity-50 ${
                      isDark 
                      ? "bg-[#cddfa0] text-[var(--card)] hover:bg-white shadow-lg shadow-[#cddfa0]/10" 
                      : "bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-100"
                    }`}
                  >
                    {processingId === draft._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <>Publish <Globe size={14} /></>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div 
        className="p-8 rounded-[2.5rem] border flex items-start gap-5 transition-colors bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-[var(--card)]/30"
      >
        <AlertCircle className="text-teal-600 shrink-0" size={24} />
        <p className="text-xs leading-relaxed font-bold uppercase tracking-tight" style={{ color: 'var(--ue-text-muted)' }}>
          Security Notice: Draft assets are isolated within your encrypted seller node. Final deployment requires manual authorization via the "Publish Asset" sequence.
        </p>
      </div>
    </div>
  );
}

