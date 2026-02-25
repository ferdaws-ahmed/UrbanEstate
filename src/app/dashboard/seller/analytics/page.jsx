"use client";

export default function SellerAnalytics() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl">
          <h2 className="text-xl">Total Views</h2>
          <p className="text-3xl font-bold">2,340</p>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-2xl">
          <h2 className="text-xl">Conversion Rate</h2>
          <p className="text-3xl font-bold">18%</p>
        </div>

        <div className="bg-pink-600 text-white p-6 rounded-2xl">
          <h2 className="text-xl">Sold Properties</h2>
          <p className="text-3xl font-bold">8</p>
        </div>
      </div>
    </div>
  );
}