"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Save, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import BasicInfo from "@/src/components/SellProperty/BasicInfo";
import PropertyDetails from "@/src/components/SellProperty/PropertyDetails";
import PropertyLocation from "@/src/components/SellProperty/PropertyLocation";
import Amenities from "@/src/components/SellProperty/Amenities";
import MediaUpload from "@/src/components/SellProperty/MediaUpload";

export default function SellerUpdatePropertyPage({ propertyId }) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
    amenities: [],
    images: [],
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        if (!res.ok) throw new Error("Failed to fetch property");
        const data = await res.json();
        
        setFormData({
          title: data.title || "",
          price: data.price || "",
          category: data.category || "",
          status: data.status || "For Sale",
          propertyType: data.propertyType || "",
          description: data.description || "",
          bedrooms: data.bedrooms || "",
          bathrooms: data.bathrooms || "",
          area: data.area || "",
          location: data.location || { latitude: 23.8103, longitude: 90.4125 },
          address: data.address || "",
          amenities: data.amenities || [],
          images: data.images || [],
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Could not load property data");
        router.push("/dashboard/seller/listings");
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) fetchProperty();
  }, [propertyId, router]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateLocation = (lat, lng) => {
    setFormData(prev => ({ ...prev, location: { latitude: lat, longitude: lng } }));
  };

  const updateAmenities = (amenities) => {
    setFormData(prev => ({ ...prev, amenities }));
  };

  const updateImages = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const tid = toast.loading("Updating property...");

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("Property updated successfully!", { id: tid });
      router.push("/dashboard/seller/listings");
    } catch (error) {
      toast.error("Failed to update property", { id: tid });
    } finally {
      setSaving(false);
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-4xl font-black tracking-tighter transition-colors duration-300 ${isDark ? "text-white" : "text-slate-900"}`}>
            Edit Property Listing
          </h1>
          <p className="text-sm font-bold text-teal-600 dark:text-[#cddfa0] uppercase tracking-[0.2em] mt-1">
            Update your property details
          </p>
        </div>
        <button 
          onClick={() => router.push("/dashboard/seller/listings")}
          className={`flex items-center gap-3 font-black text-[10px] uppercase tracking-[0.2em] transition-all px-6 py-3 rounded-xl border ${
            isDark ? "border-[#1a4a40] text-slate-400 hover:text-white hover:bg-white/5" : "border-slate-200 text-slate-500 hover:text-teal-600 hover:bg-slate-50"
          }`}
        >
          <ArrowLeft size={14} /> Back to My Listings
        </button>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-10">
          <BasicInfo formData={formData} updateField={updateField} />
          <PropertyDetails formData={formData} updateField={updateField} />
          <PropertyLocation formData={formData} updateLocation={updateLocation} updateField={updateField} />
          <Amenities amenities={formData.amenities} updateAmenities={updateAmenities} />
          <MediaUpload images={formData.images} updateImages={updateImages} />
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-12 transition-all duration-500">
          <div className="space-y-8">
            <div className={`p-10 rounded-[3rem] border shadow-2xl transition-all duration-500 ${
              isDark ? "bg-[#0b1f1a] border-[#1a4a40]/50 shadow-black/40" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <div className="flex items-center gap-4 mb-10">
                <div className={`p-4 rounded-2xl shadow-inner ${isDark ? "bg-white/5 text-[#cddfa0]" : "bg-teal-50 text-teal-600"}`}>
                  <Save size={28} />
                </div>
                <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  Update Summary
                </h3>
              </div>

              <div className="space-y-8 mb-10">
                <div className={`relative h-56 w-full rounded-[2.5rem] overflow-hidden border-4 transition-all duration-500 ${
                  isDark ? "border-white/5 bg-white/5 shadow-inner" : "border-white bg-slate-100 shadow-lg"
                }`}>
                  {formData.images?.[0] ? (
                    <img src={formData.images[0]} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={56} />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-teal-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
                    Cover Preview
                  </div>
                </div>

                <div className={`p-6 rounded-3xl border transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Asset Title</p>
                  <p className={`text-sm font-black truncate leading-relaxed ${isDark ? "text-white" : "text-slate-900"}`}>
                    {formData.title || "Untitled Asset"}
                  </p>
                </div>

                <div className={`p-6 rounded-3xl border transition-colors ${isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"}`}>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500 mb-2">Price Point</p>
                  <p className="text-3xl font-black text-teal-600 tracking-tighter">
                   $ {formData.price ? Number(formData.price).toLocaleString() : "0.00"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  type="submit" 
                  disabled={saving}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 ${
                    isDark 
                      ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-900/20" 
                      : "bg-slate-900 text-white hover:bg-teal-600 shadow-slate-200"
                  }`}
                >
                  {saving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border-2 ${
                    isDark 
                      ? "border-[#1a4a40] text-slate-300 hover:bg-white/5 hover:text-white" 
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-teal-600 hover:border-teal-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
            
            <div className={`p-8 rounded-[2.5rem] border flex items-start gap-5 transition-all duration-500 ${
              isDark ? "bg-teal-500/5 border-teal-500/10" : "bg-teal-50 border-teal-100 shadow-sm"
            }`}>
              <div className={`p-3 rounded-2xl ${isDark ? 'bg-teal-500/20 text-teal-600' : 'bg-teal-600/10 text-teal-700'}`}>
                <ImageIcon size={20} />
              </div>
              <p className={`text-[11px] leading-relaxed font-bold uppercase tracking-tight transition-colors duration-300 ${isDark ? "text-teal-600/80" : "text-teal-800"}`}>
                Notice: All updates are instantly synchronized. District and full address will be automatically recalculated based on coordinates.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
