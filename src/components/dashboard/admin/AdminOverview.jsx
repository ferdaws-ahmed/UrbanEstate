"use client";
import { motion } from "framer-motion";
import StatsCards from "./StatsCards";
import SalesChart from "./SalesChart";
import UserGrowthChart from "./UserGrowthChart";
import MarketShare from "./MarketShare";
import SellerPerformance from "./SellerPerformance";
import RecentListings from "./RecentListings";
import MapSection from "./MapSection";

export default function AdminOverview() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <StatsCards />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 xl:col-span-8 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <SalesChart />
            <UserGrowthChart />
          </div>
          <RecentListings />
        </div>

        <div className="col-span-12 xl:col-span-4 space-y-8">
          <MapSection />
          <MarketShare />
          <SellerPerformance />
        </div>
      </div>
    </motion.div>
  );
}