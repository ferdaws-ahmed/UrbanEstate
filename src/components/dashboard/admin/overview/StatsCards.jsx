"use client";
import { motion } from "framer-motion";
import CardWrapper from "../CardWrapper";

const stats = [
  { title: "Total Listings", value: 1254, color: "from-indigo-500 to-purple-500" },
  { title: "New Leads", value: 425, color: "from-emerald-500 to-teal-500" },
  { title: "Properties Sold", value: 301, color: "from-yellow-500 to-orange-500" },
  { title: "Revenue", value: 3332, prefix: "$", suffix: "K", color: "from-pink-500 to-rose-500" },
];

export default function StatsCards() {
  return (
    <div className="grid md:grid-cols-4 gap-8">
      {stats.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <CardWrapper>
            <p className="text-gray-400 text-sm">{item.title}</p>

            <h2
              className={`text-3xl font-bold mt-3 bg-gradient-to-r ${item.color}
              bg-clip-text text-transparent`}
            >
              {item.prefix || ""}
              {item.value}
              {item.suffix || ""}
            </h2>

            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br 
              from-indigo-500/20 to-transparent blur-2xl rounded-full" />
          </CardWrapper>
        </motion.div>
      ))}
    </div>
  );
}