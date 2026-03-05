"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import CardWrapper from "./CardWrapper";

const data = [
  { name: "Apartment", value: 400 },
  { name: "Villa", value: 300 },
  { name: "Commercial", value: 200 },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b"];

export default function MarketShareDonut() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Market Share Analysis</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} dataKey="value" innerRadius={60} outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}