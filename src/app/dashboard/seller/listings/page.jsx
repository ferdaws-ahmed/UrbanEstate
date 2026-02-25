"use client";

import { Edit, Trash2, Eye } from "lucide-react";

export default function SellerListings() {
  const listings = [
    { id: 1, title: "Modern Villa", price: "৳ 75,00,000", views: 245 },
    { id: 2, title: "City Apartment", price: "৳ 45,00,000", views: 132 },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Listings</h1>

      {listings.map((item) => (
        <div
          key={item.id}
          className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg flex justify-between items-center"
        >
          <div>
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p>{item.price}</p>
            <p className="text-gray-500 flex items-center gap-1">
              <Eye size={16} /> {item.views} views
            </p>
          </div>

          <div className="flex gap-3">
            <button className="p-2 bg-indigo-600 text-white rounded-lg">
              <Edit size={18} />
            </button>
            <button className="p-2 bg-red-600 text-white rounded-lg">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}