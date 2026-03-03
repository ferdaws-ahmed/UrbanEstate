"use client";
import CardWrapper from "./CardWrapper";

const agents = [
  { name: "Jahid", value: 80 },
  { name: "Sakib", value: 65 },
  { name: "Rafi", value: 45 },
];

export default function SellerPerformance() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Agent Performance</h3>

      <div className="space-y-5">
        {agents.map((agent, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span>{agent.name}</span>
              <span>{agent.value}%</span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500
                rounded-full transition-all duration-700"
                style={{ width: `${agent.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}