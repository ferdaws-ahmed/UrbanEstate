"use client";
import CardWrapper from "./CardWrapper";

export default function MarketPositionMap() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Market Position</h3>

      <div className="relative h-56 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-800 to-black" />

        <div className="absolute top-12 left-16 w-4 h-4 bg-indigo-500 rounded-full animate-ping" />
        <div className="absolute bottom-16 right-12 w-4 h-4 bg-emerald-500 rounded-full animate-ping" />
        <div className="absolute top-20 right-20 w-4 h-4 bg-pink-500 rounded-full animate-ping" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
        </div>
      </div>
    </CardWrapper>
  );
}