"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function RevenueChart({ data }) {
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
      return (
        <div className="bg-white dark:bg-[#1a4a40] border border-gray-200 dark:border-[#1a4a40]/60 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{`Month: ${label}`}</p>
          <p className="text-sm text-[#cddfa0]">{`Revenue: ${formatCurrency(payload[0].value)}`}</p>
          {payload[1] && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{`Target: ${formatCurrency(payload[1].value)}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#cddfa0" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#cddfa0" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="targetGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a894" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#94a894" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-[#1a4a40]/40" />
          <XAxis
            dataKey="month"
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
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="target"
            stroke="#94a894"
            strokeWidth={2}
            strokeDasharray="5 5"
            fill="url(#targetGradient)"
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#cddfa0"
            strokeWidth={3}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}