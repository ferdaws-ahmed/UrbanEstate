"use client";

import CardWrapper from "./CardWrapper";

export default function MapSection() {
  return (
    <CardWrapper className="overflow-hidden">
      <h3 className="font-semibold mb-6">Property Locations</h3>

      <div className="relative h-72 rounded-2xl overflow-hidden">
        {/* Fake Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-800 to-black" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(#ffffff22_1px,transparent_1px),linear-gradient(to_right,#ffffff22_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Glowing Points */}
        <div className="absolute top-16 left-20 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
        <div className="absolute bottom-20 right-16 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
        <div className="absolute top-24 right-24 w-4 h-4 bg-pink-500 rounded-full animate-ping" />

        {/* Center Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 bg-indigo-500/20 blur-3xl rounded-full" />
        </div>

        <div className="absolute bottom-4 left-4 text-sm text-gray-300">
          Dhaka • Chittagong • Sylhet
        </div>
      </div>
    </CardWrapper>
  );
}