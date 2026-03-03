"use client";

import UserSidebar from "@/src/components/dashboard/user/UserSidebar";
import UserTopbar from "@/src/components/dashboard/user/UserTopbar";
import { motion } from "framer-motion";


export default function UserLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <UserSidebar />

      <div className="flex-1">
        <UserTopbar />

        <motion.main
          initial={{ opacity: 0, y: 20 }}
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