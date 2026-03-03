"use client";

import { useState } from "react";
import { Bell, UserCircle2, Moon } from "lucide-react";

export default function SellerTopbar() {
  const [dark, setDark] = useState(false);

  return (
    <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-900 shadow-lg">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Seller Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Welcome back 👋 Manage your properties like a boss.
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="w-6 h-6 text-gray-600 dark:text-white cursor-pointer" />
        <Moon
          className="w-6 h-6 text-gray-600 dark:text-white cursor-pointer"
          onClick={() => setDark(!dark)}
        />
        <UserCircle2 className="w-7 h-7 text-gray-600 dark:text-white cursor-pointer" />
      </div>
    </div>
  );
}