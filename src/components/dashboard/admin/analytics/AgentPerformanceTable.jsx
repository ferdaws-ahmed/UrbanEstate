"use client";
import CardWrapper from "./CardWrapper";

const agents = [
  { name: "S. Islam", rate: "59%", earned: "$1.25K", rating: 5 },
  { name: "A. Rahman", rate: "47%", earned: "$1.65K", rating: 4 },
  { name: "N. Ahmed", rate: "38%", earned: "$2.45K", rating: 4 },
];

export default function AgentPerformanceTable() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Agent Performance Metrics</h3>

      <div className="space-y-4">
        {agents.map((agent, i) => (
          <div
            key={i}
            className="flex justify-between items-center
            bg-white/5 p-4 rounded-xl hover:bg-white/10 transition"
          >
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-sm text-gray-400">
                Conversion: {agent.rate}
              </p>
            </div>

            <div className="text-right">
              <p className="text-indigo-400 font-semibold">
                {agent.earned}
              </p>
              <p className="text-yellow-400">
                {"★".repeat(agent.rating)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}