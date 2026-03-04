"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import CardWrapper from "../CardWrapper";

const data = [
  { name: "Dhaka", value: 400 },
  { name: "Chittagong", value: 300 },
  { name: "Sylhet", value: 200 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export default function MarketShare() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Market Share Analysis</h3>

      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">900</span>
          <span className="text-sm text-gray-400">Total Sales</span>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              {item.name}
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}