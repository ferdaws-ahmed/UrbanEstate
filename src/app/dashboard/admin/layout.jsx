"use client";


import AdminSidebar from "@/src/components/dashboard/admin/AdminSidebar";
import AdminTopbar from "@/src/components/dashboard/admin/AdminTopbar";
import { motion } from "framer-motion";

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0b1120] text-white">
      <AdminSidebar />

      <div className="flex-1 flex flex-col">
        <AdminTopbar userName="Admin Khaled" />

        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}