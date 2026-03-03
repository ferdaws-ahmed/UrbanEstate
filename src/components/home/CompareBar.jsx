"use client";

import React from "react";

export default function CompareBar({ count, onOpen, onClear }) {
  if (!count) return null;

  return (
    <div className="fixed left-4 right-4 md:right-auto md:left-auto md:mx-auto md:bottom-8 bottom-6 z-50">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-full shadow-lg px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-700">{count} property(ies) selected for comparison</div>
        <div className="flex items-center gap-3">
          <button onClick={onClear} className="text-sm text-gray-600 hover:text-gray-800">Clear</button>
          <button onClick={onOpen} className="bg-[#0f2e28] text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-95">Compare Now</button>
        </div>
      </div>
    </div>
  );
}
