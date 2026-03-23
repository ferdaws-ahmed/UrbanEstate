"use client";

import { useState } from "react";
import PropertyCard from "./PropertyCard";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import CompareModal from "../home/CompareModal";

export default function PropertyGrid({ properties, loading }) {
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // ১. পেজিনেশন স্টেট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // ২. ক্যালকুলেশন: কতটুকু ডাটা দেখাবে
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProperties = properties.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(properties.length / itemsPerPage);

  const handleToggleCompare = (property) => {
    setSelectedProperties((prev) => {
      const isAlreadySelected = prev.find((p) => p._id === property._id);
      if (isAlreadySelected) {
        return prev.filter((p) => p._id !== property._id);
      } else {
        if (prev.length >= 3) {
          alert("Maximum 3 properties allowed for comparison.");
          return prev;
        }
        return [...prev, property];
      }
    });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" }); // পেজ চেঞ্জ হলে উপরে নিয়ে যাবে
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-72 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* ৩. ম্যাপ করা হচ্ছে currentProperties (যা শুধু ১৫টি ডাটা ধারণ করে) */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 pb-10">
        {currentProperties.map((property) => (
          <PropertyCard 
            key={property._id} 
            property={property} 
            onToggleCompare={handleToggleCompare}
            isSelected={selectedProperties.some(p => p._id === property._id)}
          />
        ))}
      </div>

      {/* ৪. পেজিনেশন বাটন ডিজাইন (আপনার থিম অনুযায়ী) */}
      {properties.length > itemsPerPage && (
        <div className="flex items-center justify-center gap-3 py-10 pb-32">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 rounded-2xl border border-white/5 bg-[#0f2e28] text-[#cddfa0] disabled:opacity-20 hover:bg-[#cddfa0] hover:text-[#0f2e28] transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-12 h-12 rounded-2xl font-black text-[11px] transition-all border ${
                  currentPage === i + 1 
                  ? "bg-[#cddfa0] text-[#0f2e28] border-[#cddfa0] shadow-[0_0_20px_rgba(205,223,160,0.3)]" 
                  : "bg-white/5 text-white/40 border-white/5 hover:border-white/20"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 rounded-2xl border border-white/5 bg-[#0f2e28] text-[#cddfa0] disabled:opacity-20 hover:bg-[#cddfa0] hover:text-[#0f2e28] transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Floating UI & Modal (আগের মতোই থাকবে) */}
      {selectedProperties.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-[#0f2e28] text-white px-6 py-4 rounded-full shadow-2xl border border-[#cddfa0]/20 flex items-center gap-6 backdrop-blur-md">
           {/* ... আগের কোড ... */}
           <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-[#cddfa0] font-bold">Comparison</span>
            <span className="text-sm font-medium">{selectedProperties.length} Selected</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSelectedProperties([])}
              className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#cddfa0] text-[#0f2e28] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 hover:bg-white transition-all shadow-lg"
            >
              Compare Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      <CompareModal 
        open={isModalOpen} 
        items={selectedProperties} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}