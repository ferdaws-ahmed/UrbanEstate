'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from "@/src/components/Theme/ThemeContext";
import BasicInfo from "./BasicInfo";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import Amenities from "./Amenities";
import MediaUpload from "./MediaUpload";

const SellPropertyParent = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    status: "For Sale",
    propertyType: "",
    description: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: { latitude: 23.8103, longitude: 90.4125 },
    address: "",
    district: "",
    fullAddress: "",
    amenities: [],
    images: [],
  });

  // আপডেট ফাংশন প্রতিটি ফিল্ডের জন্য
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLocation = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      location: { latitude: lat, longitude: lng }
    }));
  };

  const updateAmenities = (amenities) => {
    setFormData(prev => ({
      ...prev,
      amenities
    }));
  };

  const updateImages = (images) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  // ফর্ম সাবমিট হ্যান্ডলার (পাবলিশ)
  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.title || !formData.price || !formData.category || !formData.description || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Publishing your property...");

    try {
      const response = await fetch("/api/property/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish property");
      }

      toast.success("Property published successfully! 🎉", { id: toastId });

      // ড্যাশবোর্ডে রিডাইরেক্ট
      setTimeout(() => {
        window.location.href = "/dashboard/seller/listings";
      }, 2000);

    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ড্রাফট সেভ হ্যান্ডলার
  const handleSaveDraft = async () => {
    if (!formData.title) {
      toast.error("Please provide at least a title to save a draft");
      return;
    }

    setIsDrafting(true);
    const toastId = toast.loading("Saving your draft...");

    try {
      const response = await fetch("/api/property/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      toast.success("Draft saved successfully! 📁", { id: toastId });

      // ড্যাশবোর্ডে রিডাইরেক্ট
      setTimeout(() => {
        window.location.href = "/dashboard/seller/drafts";
      }, 2000);

    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error("Draft Error:", error);
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-[#020806]' : 'bg-slate-50'}`}>
      <div className="max-w-6xl mt-24 mx-auto overflow-visible">
        {/* Header Section */}
        <div className="mb-14 text-center md:text-left">
          <h1 className={`text-4xl md:text-6xl font-black tracking-tighter leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            List Your <span className="text-teal-600 dark:text-[#cddfa0]">Property</span>
          </h1>
          <p className={`mt-6 text-lg md:text-xl max-w-2xl font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fill in the details below to list your property on our global marketplace. Reach thousands of potential buyers instantly.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start relative overflow-visible">
          {/* Main Input Sections (Left Side) */}
          <div className="lg:col-span-2 space-y-12 overflow-visible">
            <BasicInfo formData={formData} updateField={updateField} />
            <PropertyDetails formData={formData} updateField={updateField} />
            <PropertyLocation formData={formData} updateLocation={updateLocation} updateField={updateField} />
            <Amenities amenities={formData.amenities} updateAmenities={updateAmenities} />
            <MediaUpload images={formData.images} updateImages={updateImages} />
          </div>

          {/* Sticky Sidebar / Action Panel (Right Side) */}
          <div className="lg:col-span-1 sticky top-10 self-start h-fit z-30">
            <div className="space-y-8">
              <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${isDark ? 'bg-[#0b1f1a] border-[#1a4a40]/40 shadow-none' : 'bg-white border-slate-200 shadow-slate-200/60'}`}>
                <h3 className={`text-xl font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  <span className="w-2.5 h-8 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)]"></span>
                  Summary
                </h3>
                
                <div className="space-y-6 mb-10">
                  <div className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Property Title</span>
                    <span className={`text-base font-bold truncate leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formData.title || "Untitled Property"}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Price</span>
                      <span className={`text-xl font-black tracking-tight ${isDark ? 'text-[#cddfa0]' : 'text-teal-600'}`}>${formData.price || "0"}</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Images</span>
                      <span className={`text-xl font-black tracking-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formData.images.length}</span>
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${isDark ? 'border-[#1a4a40]/30' : 'border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Status</span>
                      <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border ${isDark ? 'bg-teal-900/30 text-[#cddfa0] border-teal-800/50' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                        Drafting
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <button 
                    type="submit" 
                    disabled={loading || isDrafting}
                    className="group relative w-full py-5 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white font-black rounded-[1.5rem] shadow-xl shadow-teal-200/50 dark:shadow-none transition-all transform active:scale-[0.97] disabled:pointer-events-none uppercase tracking-[0.2em] text-sm overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    {loading ? (
                      <div className="flex items-center justify-center gap-3 relative z-10">
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Publishing...</span>
                      </div>
                    ) : <span className="relative z-10">Publish Property</span>}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={handleSaveDraft}
                    disabled={loading || isDrafting}
                    className={`w-full py-5 font-black rounded-[1.5rem] transition-all uppercase tracking-[0.2em] text-sm disabled:opacity-70 border ${isDark ? 'bg-[#061510] border-[#1a4a40]/60 text-slate-300 hover:bg-[#1a4a40]/40' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm'}`}
                  >
                    {isDrafting ? "Saving..." : "Save as Draft"}
                  </button>
                </div>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-teal-500 to-emerald-700 rounded-[2rem] text-white shadow-2xl shadow-teal-200/40 dark:shadow-none relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-2 uppercase tracking-tight">Expert Tip</h4>
                    <p className="text-sm text-teal-50 leading-relaxed font-medium opacity-90">
                      Properties with high-quality photos and detailed descriptions get <span className="text-white font-black underline underline-offset-4">70% more inquiries</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellPropertyParent;