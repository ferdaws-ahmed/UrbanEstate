"use client";

import { motion } from "framer-motion";
import AnalyticsStatsCards from "./AnalyticsStatsCards";
import SalesByRegionChart from "./SalesByRegionChart";
import AverageDaysOnMarket from "./AverageDaysOnMarket";
import SalesVelocityChart from "./SalesVelocityChart";
import AgentPerformanceTable from "./AgentPerformanceTable";
import MarketTrends from "./MarketTrends";
import LeadConversionFunnel from "./LeadConvertionFunnel";
import UnderperformingListings from "./UnderperformingListings";
import NewHighValueLeads from "./NewHighValueLeads";
import MarketPositionMap from "./MarketPositionMap";
import MarketShareDonut from "./MarketShareDonut";
import SupportTicketStatus from "./SupportTicketStatus";

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <AnalyticsStatsCards />

      <div className="grid grid-cols-12 gap-8">
        {/* LEFT SIDE */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          <SalesByRegionChart />
          <AgentPerformanceTable />
          <div className="grid md:grid-cols-2 gap-8">
            <UnderperformingListings />
            <NewHighValueLeads />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          <AverageDaysOnMarket />
          <SalesVelocityChart />
          <MarketTrends />
          <LeadConversionFunnel />
          <MarketPositionMap />
          <MarketShareDonut />
          <SupportTicketStatus />
        </div>
      </div>
    </motion.div>
  );
}