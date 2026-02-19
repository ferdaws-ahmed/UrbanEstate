"use client";

import { useState } from "react";
import AdminSidebar from "../../../Components/dashboard/admin/AdminSidebar";
import AdminTopbar from "../../../Components/dashboard/admin/AdminTopbar";

export default function AdminLayout({ children }) {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />

      <div className="flex-1 flex flex-col">
        <AdminTopbar userName="Admin Khaled" />

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
