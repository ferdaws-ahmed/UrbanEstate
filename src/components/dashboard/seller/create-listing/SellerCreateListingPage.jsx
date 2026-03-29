"use client";

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTheme } from "@/src/components/Theme/ThemeContext";
import BasicInfo from "@/src/components/SellProperty/BasicInfo";
import PropertyDetails from "@/src/components/SellProperty/PropertyDetails";
import PropertyLocation from "@/src/components/SellProperty/PropertyLocation";
import Amenities from "@/src/components/SellProperty/Amenities";
import MediaUpload from "@/src/components/SellProperty/MediaUpload";
import { Sparkles, Save, Layout } from "lucide-react";

export default function SellerCreateListingPage() {
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

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateLocation = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      location: { latitude: lat, longitude: lng },
    }));
  };

  const updateAmenities = (amenities) => {
    setFormData((prev) => ({ ...prev, amenities }));
  };

  const updateImages = (images) => {
    setFormData((prev) => ({ ...prev, images }));
  };

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish property");
      }

      toast.success("Property published successfully! 🎉", { id: toastId });

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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save draft");
      }

      toast.success("Draft saved successfully! 📁", { id: toastId });

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
    <div className="space-y-10 pb-20 overflow-visible">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>
            Create New Asset Listing
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            Create and publish your property listing
          </p>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start relative overflow-visible">
        <div className="lg:col-span-2 space-y-10 overflow-visible">
          <BasicInfo formData={formData} updateField={updateField} />
          <PropertyDetails formData={formData} updateField={updateField} />
          <PropertyLocation formData={formData} updateLocation={updateLocation} updateField={updateField} />
          <Amenities amenities={formData.amenities} updateAmenities={updateAmenities} />
          <MediaUpload images={formData.images} updateImages={updateImages} />
        </div>

        <div className="lg:col-span-1 sticky top-10 self-start transition-all duration-500 z-30">
          <div className="space-y-8">
            <div className={`p-8 md:p-10 rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40 shadow-none" : "bg-white border-slate-200 shadow-slate-200/40"}`}>
              <h3 className={`text-xl font-black mb-8 uppercase tracking-[0.2em] flex items-center gap-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                <span className="w-2.5 h-8 bg-teal-500 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.4)]"></span>
                Asset Summary
              </h3>

              <div className="space-y-6 mb-10">
                <div className="flex flex-col gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Property Title</span>
                  <span className={`text-base font-bold truncate leading-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>{formData.title || "Untitled Property"}</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Price</span>
                    <span className={`text-xl font-black tracking-tight ${isDark ? "text-[#cddfa0]" : "text-teal-600"}`}>৳ {formData.price ? Number(formData.price).toLocaleString() : "0.00"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Images</span>
                    <span className={`text-xl font-black tracking-tight ${isDark ? "text-slate-200" : "text-slate-800"}`}>{formData.images.length}</span>
                  </div>
                </div>

                <div className={`pt-6 border-t ${isDark ? "border-[#1a4a40]/30" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isDark ? "text-slate-500" : "text-slate-500"}`}>Status</span>
                    <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] border ${isDark ? "bg-teal-900/30 text-[#cddfa0] border-teal-800/50" : "bg-teal-50 text-teal-700 border-teal-200"}`}>
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
                  ) : (
                    <div className="flex items-center justify-center gap-2 relative z-10">
                      <Sparkles size={18} />
                      <span>Publish Listing</span>
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={loading || isDrafting}
                  className={`w-full py-5 font-black rounded-[1.5rem] transition-all uppercase tracking-[0.2em] text-sm disabled:opacity-70 border flex items-center justify-center gap-2 ${isDark ? "bg-[#061510] border-[#1a4a40]/60 text-slate-300 hover:bg-[#1a4a40]/40" : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"}`}
                >
                  <Save size={18} />
                  {isDrafting ? "Saving..." : "Save as Draft"}
                </button>
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group transition-all duration-500 ${isDark ? "bg-gradient-to-br from-[#0b1f1a] to-[#1a4a40] border border-[#1a4a40]/40" : "bg-gradient-to-br from-teal-500 to-emerald-700 shadow-teal-200/40"}`}>
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
  );
}
