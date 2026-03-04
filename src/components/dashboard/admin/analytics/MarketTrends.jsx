"use client";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CardWrapper from "./CardWrapper";

const data = [
  { month: "Jan", value: 200 },
  { month: "Feb", value: 350 },
  { month: "Mar", value: 280 },
  { month: "Apr", value: 500 },
  { month: "May", value: 600 },
];

export default function MarketTrends() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Market Trends Analysis</h3>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="month" stroke="#9ca3af" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}