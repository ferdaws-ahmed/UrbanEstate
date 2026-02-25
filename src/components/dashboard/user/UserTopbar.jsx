"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, User, Moon } from "lucide-react";

export default function UserTopbar() {
  const [dark, setDark] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 shadow">
      <h2 className="text-xl font-semibold dark:text-white">
        User Dashboard
      </h2>

      <div className="flex items-center gap-6 relative">
        <button>
          <Bell className="w-6 h-6 text-gray-600 dark:text-white" />
        </button>

        <button onClick={() => setDark(!dark)}>
          <Moon className="w-6 h-6 text-gray-600 dark:text-white" />
        </button>

        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)}>
            <User className="w-6 h-6 text-gray-600 dark:text-white" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 bg-white dark:bg-gray-700 shadow-lg rounded-xl p-4 w-40">
              <Link href="/dashboard/user/profile" className="block py-1">
                Profile
              </Link>
              <button className="block py-1 text-red-500">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}