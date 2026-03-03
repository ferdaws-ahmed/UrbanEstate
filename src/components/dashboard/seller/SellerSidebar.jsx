"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, PlusSquare, CalendarCheck, BadgeDollarSign, BarChart3, Wallet, User } from "lucide-react";

export default function SellerSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/seller", icon: LayoutDashboard },
    { name: "My Listings", path: "/dashboard/seller/listings", icon: Home },
    { name: "Add Property", path: "/dashboard/seller/add-property", icon: PlusSquare },
    { name: "Bookings", path: "/dashboard/seller/bookings", icon: CalendarCheck },
    { name: "Offers Received", path: "/dashboard/seller/offers", icon: BadgeDollarSign },
    { name: "Revenue", path: "/dashboard/seller/revenue", icon: Wallet },
    { name: "Analytics", path: "/dashboard/seller/analytics", icon: BarChart3 },
    { name: "Profile", path: "/dashboard/seller/profile", icon: User },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-700 to-purple-800 text-white p-6 hidden md:flex flex-col shadow-2xl">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">
        SellerPanel
      </h1>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                pathname === item.path
                  ? "bg-white text-indigo-700 font-semibold shadow-lg"
                  : "hover:bg-white/20"
              }`}
            >
              <Icon size={18} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <p className="text-sm mt-6 opacity-80">
        Logged in as Seller Khaled
      </p>
    </aside>
  );
}