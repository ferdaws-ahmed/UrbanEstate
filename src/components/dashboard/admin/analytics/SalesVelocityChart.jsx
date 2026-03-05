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
  { month: "Jan", value: 800 },
  { month: "Feb", value: 1200 },
  { month: "Mar", value: 1600 },
  { month: "Apr", value: 900 },
  { month: "May", value: 2000 },
];

export default function SalesVelocityChart() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Sales Velocity</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="month" stroke="#9ca3af" />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}