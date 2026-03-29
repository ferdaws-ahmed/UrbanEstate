"use client";

import React, { useState, useEffect } from "react";
import { 
  Bed, Bath, Maximize, MapPin, 
  Heart, Share2, ChevronLeft, 
  ShieldCheck, Calendar, MessageSquare, Radar, Activity,
  ShoppingBag, PhoneCall, Eye, Send, User as UserIcon
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PropertyGallery from "./propertygallery";
import Navbar from "../../../components/shared/Navbar";
import ShareModal from "../../../components/shared/ShareModal";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function PropertyDetailsClient({ property: initialProperty }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const { data: session } = useSession();
  const [property, setProperty] = useState(initialProperty);
  const [isFavorited, setIsFavorited] = useState(initialProperty.isFavorited || false);
  const [favoriteCount, setFavoriteCount] = useState(initialProperty.favoriteCount || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [isContacting, setIsContacting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const fetchComments = async (silent = false) => {
    try {
      const res = await fetch(`/api/comments?propertyId=${property._id}`);
      const data = await res.json();
      if (res.ok) {
        setComments(data);
      }
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(() => fetchComments(true), 10000);
    return () => clearInterval(interval);
  }, [property._id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please login to comment");
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          sellerId: property.sellerId,
          comment: newComment.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewComment("");
        setComments(prev => [data.comment, ...prev]);
        toast.success("Comment added!");
      } else {
        toast.error(data.error || "Failed to add comment");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const isOwner = session?.user?.id === property.sellerId;

  const handleContactSeller = async () => {
    if (!session?.user) {
      toast.error("Please login to contact seller");
      return;
    }
    
    setIsContacting(true);
    try {
      const res = await fetch("/api/seller/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property._id,
          sellerId: property.sellerId,
          message: `Hello, I am interested in your property "${property.title}". Please let me know more details.`,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Message sent to seller successfully!");
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsContacting(false);
    }
  };

  const handleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please login to favorite properties");
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({
          propertyId: property._id,
          sellerId: property.sellerId,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        setIsFavorited(data.favorited);
        setFavoriteCount(prev => data.favorited ? prev + 1 : prev - 1);
        toast.success(data.favorited ? "Added to favorites" : "Removed from favorites");
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLiking(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-IN').format(property.price || 0);

  return (
    <div className={`min-h-screen transition-colors duration-500 overflow-x-hidden ${isDark ? 'bg-[#061510] text-white' : 'bg-white text-slate-900'}`}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative">
        <div className={`absolute top-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full pointer-events-none ${isDark ? 'bg-[#cddfa0]/5' : 'bg-teal-500/5'}`}></div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
          <div className="space-y-3">
            <button 
              onClick={() => router.back()}
              className={`flex items-center gap-2 font-bold text-[9px] uppercase tracking-[0.3em] transition-all group ${isDark ? 'text-[#cddfa0]/40 hover:text-[#cddfa0]' : 'text-slate-400 hover:text-teal-600'}`}
            >
              <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
            </button>
            
            <div className="space-y-1">
              <div className={`inline-flex items-center gap-2 font-bold tracking-[0.2em] text-[8px] uppercase px-3 py-1 rounded-full border ${isDark ? 'text-[#cddfa0] bg-white/5 border-white/10' : 'text-teal-700 bg-teal-50 border-teal-100'}`}>
                <Radar size={10} className="animate-pulse" /> Asset ID: {property._id?.toString().slice(-6).toUpperCase()}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {property.title?.split(' ')[0]} <span className={`italic font-light ${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`}>{property.title?.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            <div className={`flex flex-wrap items-center gap-5 font-mono text-[9px] tracking-widest uppercase ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
              <span className="flex items-center gap-1.5"><MapPin size={12} className={`${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`} /> {property.fullAddress || property.address}</span>
              <span className={`flex items-center gap-1.5 ${isDark ? 'text-emerald-400/50' : 'text-emerald-600'}`}><Activity size={12} /> Status: {property.status || "Available"}</span>
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <Eye size={12} className={isDark ? 'text-[#cddfa0]' : 'text-teal-600'} /> Views: {property.visitCount || 0}
              </span>
              <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                <Heart size={12} className={isDark ? 'text-[#cddfa0]' : 'text-teal-600'} /> Saves: {favoriteCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-20">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className={`w-11 h-11 rounded-xl border flex items-center justify-center transition-all ${isDark ? 'border-white/5 bg-white/5 hover:bg-[#cddfa0] hover:text-[#061510]' : 'border-slate-200 bg-white hover:bg-teal-500 hover:text-white shadow-sm'}`}
            >
              <Share2 size={16} />
            </button>
            
            {!isOwner && (
              <button 
                onClick={handleFavorite}
                disabled={isLiking}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 ${
                  isFavorited 
                  ? "bg-red-500 text-white shadow-[0_10px_30px_rgba(239,68,68,0.2)]" 
                  : (isDark 
                      ? "bg-[#cddfa0] text-[#061510] shadow-[0_10px_30px_rgba(205,223,160,0.2)]" 
                      : "bg-teal-600 text-white shadow-[0_10px_30px_rgba(13,148,136,0.2)]")
                }`}
              >
                <Heart size={16} fill={isFavorited ? "white" : "none"} className={isFavorited ? "text-white" : ""} />
                {isFavorited ? "Saved to Base" : "Bookmark Asset"}
              </button>
            )}
          </div>
        </div>

        <PropertyGallery images={property.images && property.images.length > 0 ? property.images : ["/placeholder.jpg"]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 mt-16 items-start overflow-visible">
          
          <div className="lg:col-span-8 space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {[
                 { icon: Bed, val: property.bedrooms, sub: "Bedrooms" },
                 { icon: Bath, val: property.bathrooms, sub: "Bathrooms" },
                 { icon: Maximize, val: property.area, sub: "Square Feet" }
               ].map((spec, i) => (
                 <div key={i} className={`backdrop-blur-md p-8 rounded-[2.5rem] border transition-all group ${isDark ? 'bg-white/[0.02] border-white/5 hover:border-[#cddfa0]/20' : 'bg-white border-slate-200 hover:border-teal-500/30 shadow-sm'}`}>
                    <spec.icon className={`mb-4 group-hover:scale-110 transition-transform ${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`} size={20} strokeWidth={1.5} />
                    <div className="text-3xl font-black mb-1 tracking-tighter">{spec.val || 0}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white/20' : 'text-slate-400'}`}>{spec.sub}</div>
                 </div>
               ))}
            </div>

            <div className="space-y-6">
              <h3 className={`text-sm font-bold flex items-center gap-3 uppercase tracking-[0.3em] ${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`}>
                <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${isDark ? 'bg-[#cddfa0]' : 'bg-teal-600'}`}></div> Narrative
              </h3>
              <p className={`text-xl leading-relaxed font-light italic ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                {property.description}
              </p>
            </div>

            <div className={`h-[800px] border-t mt-20 pt-10 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                {/* COMMENT SECTION */}
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-2xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Protocol <span className="text-teal-600 italic">Discussions</span>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-[#cddfa0]' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                        {comments.length}
                      </span>
                    </h3>
                  </div>

                  {/* ADD COMMENT FORM */}
                  <form onSubmit={handleAddComment} className="relative group">
                    <div className={`p-1.5 rounded-[2rem] border transition-all duration-500 ${isDark ? 'bg-white/[0.03] border-white/10 group-focus-within:border-[#cddfa0]/30 group-focus-within:bg-white/[0.05]' : 'bg-slate-50 border-slate-200 group-focus-within:border-teal-500/30 group-focus-within:bg-white shadow-inner'}`}>
                      <div className="flex items-center gap-4 px-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 border ${isDark ? 'bg-[#0a2e26] border-white/10 text-[#cddfa0]' : 'bg-white border-slate-200 text-teal-600'}`}>
                          {session?.user?.image ? (
                            <img src={session.user.image} className="h-full w-full rounded-full object-cover" alt="" />
                          ) : (
                            <UserIcon size={18} />
                          )}
                        </div>
                        <input 
                          type="text" 
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Initialize discussion thread..."
                          className="flex-1 bg-transparent py-4 text-sm font-medium focus:outline-none placeholder:text-slate-500"
                        />
                        <button 
                          type="submit"
                          disabled={isSubmittingComment || !newComment.trim()}
                          className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all disabled:opacity-30 ${isDark ? 'bg-[#cddfa0] text-[#061510] hover:scale-105 shadow-[0_10px_20px_rgba(205,223,160,0.2)]' : 'bg-teal-600 text-white hover:scale-105 shadow-[0_10px_20px_rgba(13,148,136,0.2)]'}`}
                        >
                          {isSubmittingComment ? <Activity size={18} className="animate-spin" /> : <Send size={18} />}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* COMMENTS LIST */}
                  <div className="space-y-8 mt-10">
                    {comments.length === 0 ? (
                      <div className={`p-20 text-center rounded-[3rem] border border-dashed ${isDark ? 'border-white/5 text-white/10' : 'border-slate-100 text-slate-300'}`}>
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="font-black uppercase tracking-widest text-[10px]">No transmission data found</p>
                      </div>
                    ) : (
                      comments.map((cmt, idx) => (
                        <div key={idx} className="flex gap-6 group animate-in slide-in-from-left-4 duration-500">
                          <div className={`h-12 w-12 rounded-2xl overflow-hidden shrink-0 border-2 transition-transform group-hover:scale-110 ${isDark ? 'border-white/10' : 'border-white shadow-md'}`}>
                            {cmt.userImage ? (
                              <img src={cmt.userImage} className="h-full w-full object-cover" alt="" />
                            ) : (
                              <div className={`h-full w-full flex items-center justify-center font-black ${isDark ? 'bg-[#0a2e26] text-[#cddfa0]' : 'bg-teal-50 text-teal-600'}`}>
                                {cmt.userName?.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`text-sm font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{cmt.userName}</span>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${isDark ? 'bg-white/5 text-white/30' : 'bg-slate-50 text-slate-400'}`}>
                                  {new Date(cmt.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                            <div className={`text-[15px] leading-relaxed font-medium ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                              {cmt.text}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
            </div> 
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start z-30">
            <div className={`rounded-[3rem] p-10 border shadow-2xl space-y-12 backdrop-blur-md ${isDark ? 'bg-[#0a2e26] border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="space-y-3">
                <span className={`text-[9px] font-bold uppercase tracking-[0.5em] ${isDark ? 'text-[#cddfa0]/40' : 'text-slate-400'}`}>Valuation</span>
                <div className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>৳{formattedPrice}</div>
              </div>

              <div className="space-y-4">
                <Link
                  href={`/payment?propertyId=${property._id}&price=${property.price}`}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 ${isDark ? 'bg-[#cddfa0] text-[#061510] hover:bg-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}
                >
                  <ShoppingBag size={16} /> Buy Property
                </Link>
                <button 
                  onClick={handleContactSeller}
                  disabled={isContacting}
                  className={`w-full bg-transparent border py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                >
                  {isContacting ? (
                    <Activity size={16} className="animate-spin" />
                  ) : (
                    <PhoneCall size={16} />
                  )}
                  {isContacting ? "Sending..." : "Contact Seller"}
                </button>
              </div>

              <div className={`pt-8 border-t flex items-center gap-4 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                  <ShieldCheck size={20} />
                </div>
                <div className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                  Verified Asset Protocol
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        url={typeof window !== "undefined" ? window.location.href : ""} 
        title={property.title} 
      />
    </div>
  );
}
