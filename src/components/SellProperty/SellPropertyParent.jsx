"use client";

import BasicInfo from "./BasicInfo";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import Amenities from "./Amenities";
import MediaUpload from "./MediaUpload";
import { Manrope } from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SellPropertyParent = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting property...");
  };

  return (
    /* bg-transparent রাখা হয়েছে যাতে বডির মেইন ব্যাকগ্রাউন্ড (globals.css থেকে) দেখা যায় */
    <div className={`${manrope.className} min-h-screen bg-transparent transition-colors duration-500 py-8 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-6xl mt-20 mx-auto">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors">
            List Your <span className="text-[#0f2e28] dark:text-[#cddfa0] italic font-light">Property</span>
          </h1>
          <p className="mt-2 text-base md:text-lg text-slate-600 dark:text-slate-400 transition-colors">
            Fill in the details below to list your property on our global marketplace.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            <BasicInfo />
            <PropertyDetails />
            <PropertyLocation />
            <Amenities />
            <MediaUpload />
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              
              <div className="p-6 bg-slate-50 dark:bg-white/5 backdrop-blur-sm rounded-[2.2rem] shadow-xl border border-slate-200 dark:border-white/10 transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Submission Summary</h3>
                
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2 text-slate-600 dark:text-slate-400">
                    <span>Status:</span> 
                    <span className="text-[#0f2e28] dark:text-[#cddfa0] font-bold uppercase text-[10px] tracking-widest">Draft</span>
                  </li>
                  <li className="flex justify-between border-b border-slate-200 dark:border-white/5 pb-2 text-slate-600 dark:text-slate-400">
                    <span>Visibility:</span> 
                    <span className="text-green-600 dark:text-green-400 font-bold uppercase text-[10px] tracking-widest">Public</span>
                  </li>
                </ul>

                <button 
                  type="submit" 
                  className="w-full mt-8 py-4 bg-[#0f2e28] dark:bg-[#cddfa0] text-white dark:text-[#0f2e28] font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-lg border border-transparent transition-all active:scale-95"
                >
                  Publish Property
                </button>

                <button 
                  type="button" 
                  className="w-full mt-3 py-3 bg-transparent border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-100 dark:hover:bg-white/5 transition"
                >
                  Save as Draft
                </button>
              </div>
              
              <div className="p-5 bg-[#0f2e28]/5 dark:bg-[#cddfa0]/5 border border-[#0f2e28]/10 dark:border-[#cddfa0]/20 rounded-2xl">
                <p className="text-[12px] text-slate-700 dark:text-slate-300 leading-relaxed italic transition-colors">
                  <span className="font-bold">Tip:</span> Properties with high-quality photos get 70% more inquiries.
                </p>
              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellPropertyParent;