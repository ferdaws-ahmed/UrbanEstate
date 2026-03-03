"use client";

import { Home, DollarSign, TrendingUp, Eye } from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    { title: "Total Properties", value: 12, icon: Home },
    { title: "Total Earnings", value: "৳ 1.2Cr", icon: DollarSign },
    { title: "Active Offers", value: 5, icon: TrendingUp },
    { title: "Total Views", value: 2_340, icon: Eye },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Seller Overview</h1>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
          >
            <stat.icon className="mb-3 text-indigo-600" size={28} />
            <h2 className="text-xl font-semibold">{stat.value}</h2>
            <p className="text-gray-500">{stat.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}