"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function LeadSourcesChart({ data }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const conversionRate = ((data.conversions / data.leads) * 100).toFixed(1);
      return (
        <div className="bg-white dark:bg-[#1a4a40] border border-gray-200 dark:border-[#1a4a40]/60 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-[#cddfa0]">{`Leads: ${data.leads}`}</p>
          <p className="text-sm text-green-600 dark:text-green-400">{`Conversions: ${data.conversions}`}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{`Rate: ${conversionRate}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#1a4a40]/40" />
          <XAxis
            dataKey="source"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="leads"
            fill="#94a894"
            radius={[4, 4, 0, 0]}
            name="Total Leads"
          />
          <Bar
            dataKey="conversions"
            fill="#cddfa0"
            radius={[4, 4, 0, 0]}
            name="Conversions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}