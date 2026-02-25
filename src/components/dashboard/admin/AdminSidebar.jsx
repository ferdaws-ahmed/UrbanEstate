"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCog,
  ShieldCheck,
  Building,
  BadgeDollarSign,
  Settings,
  BarChart3,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/admin", icon: LayoutDashboard },
    { name: "User Management", path: "/dashboard/admin/user-management", icon: Users },
    { name: "Seller Management", path: "/dashboard/admin/seller-management", icon: UserCog },
    { name: "Property Approvals", path: "/dashboard/admin/property-approvals", icon: Building },
    { name: "Transactions", path: "/dashboard/admin/transactions", icon: BadgeDollarSign },
    { name: "Analytics", path: "/dashboard/admin/analytics", icon: BarChart3 },
    { name: "Roles & Permissions", path: "/dashboard/admin/roles", icon: ShieldCheck },
    { name: "System Settings", path: "/dashboard/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white p-6 hidden md:flex flex-col shadow-2xl">
      <h1 className="text-3xl font-bold mb-10 tracking-wide">
        Admin Panel
      </h1>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.path ||
            pathname.startsWith(item.path);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-white text-gray-900 font-semibold shadow-lg"
                  : "hover:bg-white/10"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <p className="text-sm mt-6 opacity-70">
        Logged in as Admin Khaled
      </p>
    </aside>
  );
}