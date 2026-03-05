"use client";
import CardWrapper from "./CardWrapper";

const steps = [
  { name: "Initial Contact", value: 100 },
  { name: "Qualified", value: 75 },
  { name: "Viewing", value: 50 },
  { name: "Offer", value: 25 },
  { name: "Closed", value: 10 },
];

export default function LeadConversionFunnel() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Lead Conversion Funnel</h3>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span>{step.name}</span>
              <span>{step.value}%</span>
            </div>
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500
                transition-all duration-700"
                style={{ width: `${step.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}