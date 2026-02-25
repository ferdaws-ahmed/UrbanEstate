"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

export default function AdminTopbar({ userName }) {
  const router = useRouter();

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        router.push("/login");
      }
    });
  };

  return (
    <div className="bg-white shadow-lg px-8 py-5 flex justify-between items-center backdrop-blur-md">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome, {userName}
        </h2>
        <p className="text-sm text-gray-500">
          System overview & management center
        </p>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:scale-110 transition" />

        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full shadow">
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
            className="w-9 h-9 rounded-full border"
          />
          <span className="font-semibold text-gray-900">
            {userName}
          </span>
          <button
            onClick={handleLogout}
            className="text-red-500 font-bold text-lg hover:scale-110 transition"
          >
            ⎋
          </button>
        </div>
      </div>
    </div>
  );
}