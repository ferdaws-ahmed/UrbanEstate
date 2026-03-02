"use client";

import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import CardWrapper from "./CardWrapper";

const data = [
  { name: "Jan", value: 200 },
  { name: "Feb", value: 350 },
  { name: "Mar", value: 420 },
  { name: "Apr", value: 600 },
  { name: "May", value: 850 },
  { name: "Jun", value: 1100 },
];

export default function UserGrowthChart() {
  return (
    <CardWrapper>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">User Growth</h3>
        <span className="text-sm text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
          +12.5%
        </span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="name" stroke="#9ca3af" />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}