"use client";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

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
        // clear token here if needed
        router.push("/login");
      }
    });
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h2 className="text-2xl font-semibold text-gray-900">Welcome, {userName}</h2>

      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-bold text-gray-900">{userName}</span>
        <button
          onClick={handleLogout}
          className="text-red-500 font-bold text-xl hover:scale-110 transition"
        >
          ⎋
        </button>
      </div>
    </div>
  );
}
