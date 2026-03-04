"use client";
import CardWrapper from "./CardWrapper";

export default function UnderperformingListings() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Underperforming Listings</h3>

      <div className="space-y-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex justify-between bg-red-500/10
            border border-red-500/20 p-3 rounded-xl"
          >
            <span>Listing #{i + 101}</span>
            <span className="text-red-400">Low Sales</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}