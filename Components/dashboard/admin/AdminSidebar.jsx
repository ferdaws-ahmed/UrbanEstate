"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-66 bg-gray-900 text-white py-6 px-3 hidden md:block">
      <h1 className="text-3xl px-2 font-bold mb-10">Admin Panel</h1>

      <ul className="space-y-4">
        <li>
          <Link
            href="/dashboard/admin"
            className={`block p-3 rounded transition text-lg ${
              pathname === "/dashboard/admin"
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            Dashboard
          </Link>
        </li>

        <li>
          <Link
            href="/dashboard/admin/user-management"
            className={`block p-3 rounded transition text-lg ${
              pathname.startsWith("/dashboard/admin/user-management")
                ? "bg-gray-700"
                : "hover:bg-gray-800"
            }`}
          >
            User Management
          </Link>
        </li>
      </ul>
    </div>
  );
}
