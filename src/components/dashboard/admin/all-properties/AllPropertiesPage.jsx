"use client";

import { motion } from "framer-motion";
import PropertiesHeader from "./PropertiesHeader";
import PropertiesFilters from "./PropertiesFilters";
import PropertiesGrid from "./PropertiesGrid";
import PaginationSection from "./PaginationSection";

export default function AllPropertiesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <PropertiesHeader />
      <PropertiesFilters />
      <PropertiesGrid />
      <PaginationSection />
    </motion.div>
  );
}