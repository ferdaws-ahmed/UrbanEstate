"use client";

import { motion } from "framer-motion";
import SellerSidebar from "@/components/dashboard/seller/SellerSidebar";
import SellerTopbar from "@/components/dashboard/seller/SellerTopbar";

export default function SellerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-950 transition-all">
      <SellerSidebar />

      <div className="flex-1 flex flex-col">
        <SellerTopbar />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}