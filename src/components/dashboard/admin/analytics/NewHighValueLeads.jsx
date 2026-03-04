"use client";
import CardWrapper from "./CardWrapper";

export default function NewHighValueLeads() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">New High-Value Leads</h3>

      <div className="space-y-3">
        {[1, 2, 3].map((_, i) => (
          <div
            key={i}
            className="flex justify-between bg-emerald-500/10
            border border-emerald-500/20 p-3 rounded-xl"
          >
            <span>Lead #{i + 301}</span>
            <span className="text-emerald-400">$50K Potential</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}