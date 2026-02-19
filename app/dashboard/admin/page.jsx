"use client";

import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminTopbar from "@/components/dashboard/admin/AdminTopbar";

export default function AdminDashboard() {
  return (
    <div className=" text-gray-900">

      <div className="flex-1 flex flex-col">

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-green-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Total Users</h3>
              <p className="text-3xl text-gray-100 font-bold ">120</p>
            </div>

            <div className="bg-blue-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Total Sellers</h3>
              <p className="text-3xl text-gray-100 font-bold ">35</p>
            </div>

            <div className="bg-yellow-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Active Users</h3>
              <p className="text-3xl text-gray-100 font-bold ">98</p>
            </div>

            
            <div className="bg-violet-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Total Products</h3>
              <p className="text-3xl text-gray-100 font-bold ">74</p>
            </div>
            <div className="bg-orange-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Sold Products</h3>
              <p className="text-3xl text-gray-100 font-bold ">68</p>
            </div>
            {/* <div className="bg-yellow-500 p-6 rounded-xl shadow">
              <h3 className="text-gray-200 mb-2 font-semibold">Active Users</h3>
              <p className="text-3xl text-gray-100 font-bold ">98</p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
