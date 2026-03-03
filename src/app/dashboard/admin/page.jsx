"use client";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-10 text-gray-900">
        Admin Dashboard
      </h1>

      <div className="grid md:grid-cols-4 gap-6">

        <div className="bg-gradient-to-r from-green-400 to-emerald-600 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-sm uppercase opacity-80">Total Users</h3>
          <p className="text-3xl font-bold mt-2">120</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-sm uppercase opacity-80">Total Sellers</h3>
          <p className="text-3xl font-bold mt-2">35</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-sm uppercase opacity-80">Active Users</h3>
          <p className="text-3xl font-bold mt-2">98</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-2xl shadow-xl hover:scale-105 transition">
          <h3 className="text-sm uppercase opacity-80">System Health</h3>
          <p className="text-3xl font-bold mt-2">98%</p>
        </div>

      </div>
    </div>
  );
}