export const dynamic = "force-dynamic";
import React from "react";
import { 
  Bed, Bath, Maximize, MapPin, 
  Heart, Share2, ChevronLeft, 
  ShieldCheck, Calendar, MessageSquare, Radar, Activity, GitCompare
} from "lucide-react";
import Link from "next/link";
import PropertyGallery from "./PropertyGallery";
import Navbar from "../../../components/shared/Navbar";

// ডাটা ফেচিং ফাংশন
async function getProperty(id) {
  // ১. সরাসরি VERCEL_URL চেক করা (সবচেয়ে নিরাপদ)
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 
                (process.env.VERCEL_URL ? `https://urbanestate-marketplace.vercel.app` : "http://localhost:3000");

  try {
    const res = await fetch(`${baseUrl}/api/propertydetails/${id}`, {
      cache: 'no-store' // রিয়েল টাইম ডাটা নিশ্চিত করতে
    });
    
    if (!res.ok) {
      console.error(`API Error: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Fetch error details:", error);
    return null;
  }
}

export default async function PropertyPage({ params }) {
  const { id } = await params; 
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="h-screen bg-[#061510] flex flex-col items-center justify-center gap-4 text-[#cddfa0]">
        <div className="font-mono text-[12px] tracking-[0.4em] animate-pulse uppercase">
          ERROR: Asset {id?.slice(-6)} Not Found
        </div>
        <Link href="/" className="text-[10px] uppercase border border-[#cddfa0]/30 px-6 py-2 rounded-full hover:bg-[#cddfa0] hover:text-[#061510] transition-all">
          Return to Base
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('en-IN').format(property.price || 0);

  return (
    // overflow-x-hidden নিশ্চিত করুন যাতে সাইডবার ক্যালকুলেশনে সমস্যা না হয়
    <div className="min-h-screen bg-[#061510] text-white selection:bg-[#cddfa0] selection:text-[#061510] overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#cddfa0]/5 blur-[150px] rounded-full pointer-events-none"></div>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-[#cddfa0]/40 font-bold text-[9px] uppercase tracking-[0.3em] hover:text-[#cddfa0] transition-all group">
              <ChevronLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back to Base
            </Link>
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-[#cddfa0] font-bold tracking-[0.2em] text-[8px] uppercase bg-white/5 px-3 py-1 rounded-full border border-white/10">
                <Radar size={10} className="animate-pulse" /> Asset ID: {property._id?.toString().slice(-6).toUpperCase()} // VERIFIED
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {property.title?.split(' ')[0]} <span className="text-[#cddfa0] italic font-light">{property.title?.split(' ').slice(1).join(' ')}</span>
              </h1>
            </div>

            <div className="flex items-center gap-5 text-white/30 font-mono text-[9px] tracking-widest uppercase">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#cddfa0]" /> {property.address || property.location}</span>
              <span className="flex items-center gap-1.5 text-emerald-400/50"><Activity size={12} /> Status: {property.status || "Available"}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-11 h-11 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-[#cddfa0] hover:text-[#061510] transition-all group">
              <GitCompare size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            </button>
            <button className="w-11 h-11 rounded-xl border border-white/5 bg-white/5 flex items-center justify-center hover:bg-[#cddfa0] hover:text-[#061510] transition-all">
              <Share2 size={16} />
            </button>
            <button className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em] bg-[#cddfa0] text-[#061510] shadow-[0_10px_30px_rgba(205,223,160,0.2)] hover:scale-105 transition-all">
              <Heart size={16} /> Bookmark Asset
            </button>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <PropertyGallery images={property.images && property.images.length > 0 ? property.images : ["/placeholder.jpg"]} />

        {/* INFO GRID - items-start এবং overflow-visible মাস্ট */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10 mt-16 items-start overflow-visible">
          
          {/* LEFT SIDE: Narrative & Specs (স্ক্রোল হবে) */}
          <div className="lg:col-span-8 space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
               {[
                 { icon: Bed, val: property.bedrooms, sub: "Bedrooms" },
                 { icon: Bath, val: property.bathrooms, sub: "Bathrooms" },
                 { icon: Maximize, val: property.area, sub: "Square Feet" }
               ].map((spec, i) => (
                 <div key={i} className="bg-white/[0.02] backdrop-blur-md p-8 rounded-[2.5rem] border border-white/5 hover:border-[#cddfa0]/20 transition-all group">
                    <spec.icon className="text-[#cddfa0] mb-4 group-hover:scale-110 transition-transform" size={20} strokeWidth={1.5} />
                    <div className="text-3xl font-black mb-1 tracking-tighter">{spec.val || 0}</div>
                    <div className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">{spec.sub}</div>
                 </div>
               ))}
            </div>

            <div className="space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-3 text-[#cddfa0] uppercase tracking-[0.3em]">
                <div className="w-2 h-2 rounded-full bg-[#cddfa0] shadow-[0_0_10px_#cddfa0]"></div> Narrative
              </h3>
              <p className="text-xl text-white/60 leading-relaxed font-light italic">
                {property.description}
              </p>
            </div>

            {/* এই অতিরিক্ত হাইটটুকু রাখা হয়েছে যাতে স্ক্রল করার জায়গা পাওয়া যায় */}
            <div className="h-[800px] border-t border-white/5 mt-20 pt-10">
                <p className="text-white/10 uppercase tracking-widest text-[10px]">End of Narrative Protocol</p>
            </div> 
          </div>

          {/* RIGHT SIDEBAR: STICKY CARD */}
          {/* top-32 মানে নববারের নিচ থেকে ৩২ পিক্সেল নিচে আটকাবে */}
          <aside className="lg:col-span-4 lg:sticky lg:top-32 self-start z-30">
            <div className="bg-[#0a2e26] rounded-[3rem] p-10 border border-white/10 shadow-2xl space-y-12 backdrop-blur-md">
              <div className="space-y-3">
                <span className="text-[#cddfa0]/40 text-[9px] font-bold uppercase tracking-[0.5em]">Valuation</span>
                <div className="text-5xl font-black tracking-tighter text-white">৳{formattedPrice}</div>
              </div>

              <div className="space-y-4">
                <button className="w-full bg-[#cddfa0] text-[#061510] py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95">
                  <Calendar size={16} /> Schedule Scan
                </button>
                <button className="w-full bg-transparent border border-white/10 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all flex items-center justify-center gap-3">
                  <MessageSquare size={16} /> Connect Unit
                </button>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <div className="text-[10px] uppercase tracking-widest text-white/40 font-bold">
                  Verified Asset Protocol
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}