"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GeographicChart({ data }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-[#1a4a40] border border-gray-200 dark:border-[#1a4a40]/60 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm text-[var(--accent)]">{`Properties: ${data.properties}`}</p>
          <p className="text-sm text-blue-600 dark:text-blue-400">{`Sales: ${data.sales}`}</p>
          <p className="text-sm text-green-600 dark:text-green-400">{`Revenue: ${formatCurrency(data.revenue)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout="horizontal"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#1a4a40]/40" />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <YAxis
            type="category"
            dataKey="region"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            className="dark:fill-gray-400"
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="properties"
            fill="#94a894"
            radius={[0, 4, 4, 0]}
            name="Properties"
          />
          <Bar
            dataKey="sales"
            fill="#cddfa0"
            radius={[0, 4, 4, 0]}
            name="Sales"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

