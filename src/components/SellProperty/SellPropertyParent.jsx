'use client';

import BasicInfo from "./BasicInfo";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import Amenities from "./Amenities";
import MediaUpload from "./MediaUpload";

const SellPropertyParent = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting property...");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
            <BasicInfo />
            <PropertyDetails />
            <PropertyLocation />
            <Amenities />
            <MediaUpload />
          </div>

          {/* Sticky Sidebar / Action Panel (Right Side) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Submission Summary</h3>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex justify-between"><span>Status:</span> <span className="text-blue-600 font-medium">Draft</span></li>
                  <li className="flex justify-between"><span>Visibility:</span> <span className="text-green-600 font-medium">Public</span></li>
                </ul>
                <button 
                  type="submit" 
                  className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition transform active:scale-95"
                >
                  Publish Property
                </button>
                <button 
                  type="button" 
                  className="w-full mt-3 py-3 bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
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