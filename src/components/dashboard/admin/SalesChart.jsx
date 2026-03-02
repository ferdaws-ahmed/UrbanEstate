"use client";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CardWrapper from "./CardWrapper";

const data = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 6000 },
];

export default function SalesChart() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Sales Performance</h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#9ca3af" />
          <Tooltip />
          <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}