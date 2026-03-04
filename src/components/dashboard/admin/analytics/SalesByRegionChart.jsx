"use client";
import {
  AreaChart, Area, XAxis, Tooltip, ResponsiveContainer
} from "recharts";
import CardWrapper from "./CardWrapper";

const data = [
  { name: "Gulshan", apartment: 4000, villa: 2400 },
  { name: "Banani", apartment: 3000, villa: 1398 },
  { name: "Dhanmondi", apartment: 2000, villa: 9800 },
];

export default function SalesByRegionChart() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Sales by Property Type & Region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <XAxis dataKey="name" stroke="#9ca3af" />
          <Tooltip />
          <Area type="monotone" dataKey="apartment" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3}/>
          <Area type="monotone" dataKey="villa" stroke="#10b981" fill="#10b981" fillOpacity={0.3}/>
        </AreaChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
}