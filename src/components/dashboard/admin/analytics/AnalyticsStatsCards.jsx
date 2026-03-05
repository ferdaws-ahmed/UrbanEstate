"use client";
import { motion } from "framer-motion";
import CardWrapper from "./CardWrapper";

const stats = [
  { title: "Market Valuation", value: "$32,332.8K" },
  { title: "Listing Conversion Rate", value: "45%" },
  { title: "Average Days on Market", value: "26 Days" },
  { title: "Sales Velocity", value: "1.6K/mo" },
];

export default function AnalyticsStatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-8">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <CardWrapper>
            <p className="text-gray-400 text-sm">{stat.title}</p>
            <h2 className="text-2xl font-bold mt-3 text-indigo-400">
              {stat.value}
            </h2>
          </CardWrapper>
        </motion.div>
      ))}
    </div>
  );
}