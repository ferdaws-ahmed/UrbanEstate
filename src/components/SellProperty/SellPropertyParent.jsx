'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import BasicInfo from "./BasicInfo";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import Amenities from "./Amenities";
import MediaUpload from "./MediaUpload";

const SellPropertyParent = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    category: "",
    status: "For Sale", // নতুন যোগ করা হয়েছে (Default value)
    propertyType: "",   // নতুন যোগ করা হয়েছে
    description: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    location: { latitude: 23.8103, longitude: 90.4125 },
    address: "",
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

  // ফর্ম সাবমিট হ্যান্ডলার
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // ভ্যালিডেশন
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
      console.log("Property created:", data);

      // ফর্ম রিসেট করা (সবগুলো ফিল্ড সহ)
      setFormData({
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

      // ড্যাশবোর্ডে রিডাইরেক্ট
      setTimeout(() => {
        window.location.href = "/all-properties";
      }, 2000);

    } catch (error) {
      toast.error(error.message, { id: toastId });
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mt-20 mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            List Your Property
          </h1>
          <p className="mt-2 text-base md:text-lg text-slate-600 dark:text-slate-400">
            Fill in the details below to list your property on our global marketplace.
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Sections (Left Side) */}
          <div className="lg:col-span-2 space-y-8">
            <BasicInfo formData={formData} updateField={updateField} />
            <PropertyDetails formData={formData} updateField={updateField} />
            <PropertyLocation formData={formData} updateLocation={updateLocation} updateField={updateField} />
            <Amenities amenities={formData.amenities} updateAmenities={updateAmenities} />
            <MediaUpload images={formData.images} updateImages={updateImages} />
          </div>

          {/* Sticky Sidebar / Action Panel (Right Side) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Submission Summary</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex justify-between"><span>Title:</span> <span className="text-blue-600 font-medium truncate ml-2">{formData.title || "Not filled"}</span></li>
                  <li className="flex justify-between"><span>Price:</span> <span className="text-blue-600 font-medium">${formData.price || "0"}</span></li>
                  <li className="flex justify-between"><span>Images:</span> <span className="text-green-600 font-medium">{formData.images.length} uploaded</span></li>
                </ul>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition transform active:scale-95 disabled:pointer-events-none"
                >
                  {loading ? "Publishing..." : "Publish Property"}
                </button>
                <button 
                  type="button" 
                  disabled={loading}
                  className="w-full mt-3 py-3 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition disabled:opacity-70"
                >
                  Save as Draft
                </button>
              </div>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Tip: Properties with high-quality photos and detailed descriptions get 70% more inquiries.
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