"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  PlusCircle,
  MessageSquare,
  BarChart3,
  User,
  Home,
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

const menuItems = [
  { name: "Dashboard", path: "/dashboard/seller", icon: LayoutDashboard },
  { name: "My Listings", path: "/dashboard/seller/listings", icon: List },
  {
    name: "Create New Listing",
    path: "/dashboard/seller/create-listing",
    icon: PlusCircle,
  },
  { name: "Leads & Messages", path: "/dashboard/seller/leads", icon: MessageSquare },
  { name: "Analytics", path: "/dashboard/seller/analytics", icon: BarChart3 },
  { name: "Profile", path: "/dashboard/seller/profile", icon: User },
];

export default function SellerSidebar() {
  const pathname = usePathname();
  const { isDark } = useTheme();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-[90] w-64 border-r flex flex-col
        ${
          isDark
            ? "bg-[#0b1f1a] border-[#1a4a40]/50"
            : "bg-white border-slate-200 shadow-sm"
        }`}
    >
      <div className="flex items-center gap-2 px-6 py-6 border-b border-inherit">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isDark ? "bg-[#1a4a40]/80 text-[#cddfa0]" : "bg-teal-50 text-teal-600"
          }`}
        >
          <Home className="h-5 w-5" />
        </div>
        <div>
          <p
            className={`font-bold text-sm tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            UrbanEstate
          </p>
          <p className="text-[10px] uppercase tracking-widest text-teal-600/80 dark:text-[#cddfa0]/70">
            Seller
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {menuItems.map(({ name, path, icon: Icon }) => {
          const active =
            path === "/dashboard/seller"
              ? pathname === path
              : pathname?.startsWith(path);
          return (
            <Link
              key={path}
              href={path}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all
                ${
                  active
                    ? isDark
                      ? "bg-[#1a4a40]/60 text-[#cddfa0] shadow-inner"
                      : "bg-violet-50 text-violet-700"
                    : isDark
                      ? "text-slate-400 hover:bg-white/5 hover:text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
              <Icon className="h-5 w-5 shrink-0 opacity-90" />
              {name}
            </Link>
          );
        })}
      </nav>

      <div
        className={`p-4 text-[10px] border-t ${
          isDark ? "border-[#1a4a40]/40 text-slate-500" : "border-slate-100 text-slate-400"
        }`}
      >
        © {new Date().getFullYear()} UrbanEstate
      </div>
    </aside>
  );
}
