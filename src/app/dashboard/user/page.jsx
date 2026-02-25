"use client";

import CountUp from "react-countup";
import { ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from "recharts";

export default function UserDashboardHome() {

  const stats = [
    { title: "Saved Properties", value: 12 },
    { title: "Booked Visits", value: 4 },
    { title: "Active Offers", value: 3 },
    { title: "Total Payments", value: 18400 },
  ];

  const data = [
    { name: "Jan", views: 5 },
    { name: "Feb", views: 8 },
    { name: "Mar", views: 12 },
    { name: "Apr", views: 6 },
    { name: "May", views: 15 },
  ];

  return (
    <div className="space-y-10">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-xl transition">
            <p className="text-gray-500 dark:text-gray-300 text-sm">
              {item.title}
            </p>
            <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">
              <CountUp end={item.value} duration={2} />
            </h2>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Property Views Trend
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Property Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-white">
          Recently Viewed Properties
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[1,2,3].map((item) => (
            <div key={item} className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden hover:shadow-xl transition">
              <img
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                className="h-40 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold dark:text-white">
                  Modern Apartment
                </h3>
                <p className="text-indigo-600 font-bold mt-2">
                  $450,000
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
