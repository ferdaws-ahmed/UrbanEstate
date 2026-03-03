"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function UserSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/user" },
    { name: "Browse Properties", path: "/dashboard/user/properties" },
    { name: "Saved Properties", path: "/dashboard/user/saved" },
    { name: "My Bookings", path: "/dashboard/user/bookings" },
    { name: "My Offers", path: "/dashboard/user/offers" },
    { name: "Payment History", path: "/dashboard/user/payments" },
    { name: "Profile", path: "/dashboard/user/profile" },
  ];

  return (
    <aside className="w-72 backdrop-blur-xl bg-white/30 dark:bg-gray-800/60 border-r border-white/20 p-6 hidden md:flex flex-col">
      <h1 className="text-2xl font-bold mb-10 text-indigo-600 dark:text-white">
        UserPanel
      </h1>

      <nav className="space-y-2 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`block px-4 py-2 rounded-xl transition ${
              pathname === item.path
                ? "bg-indigo-600 text-white shadow"
                : "hover:bg-indigo-500/20 dark:hover:bg-white/10"
            }`}
          >
            {item.name}
          </Link>
        ))}

        <Link
          href="/"
          className="block px-4 py-2 mt-6 rounded-xl hover:bg-indigo-500/20"
        >
          ⬅ Back to Home
        </Link>
      </nav>

      <p className="text-sm mt-6 text-gray-600 dark:text-gray-300">
        Logged in as John Doe
      </p>
    </aside>
  );
}