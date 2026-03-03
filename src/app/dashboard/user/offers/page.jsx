"use client";

import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function OffersPage() {
  const [offers, setOffers] = useState([
    {
      id: 1,
      property: "Modern Villa in Dhaka",
      amount: "৳ 75,00,000",
      status: "Pending",
    },
    {
      id: 2,
      property: "Luxury Apartment in Chittagong",
      amount: "৳ 45,00,000",
      status: "Accepted",
    },
  ]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">My Offers</h1>

      <div className="grid gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg flex justify-between items-center hover:scale-[1.02] transition"
          >
            <div>
              <h2 className="text-xl font-semibold">{offer.property}</h2>
              <p className="text-gray-500">{offer.amount}</p>
            </div>

            <div>
              {offer.status === "Pending" && (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full">
                  Pending
                </span>
              )}

              {offer.status === "Accepted" && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full flex items-center gap-2">
                  <CheckCircle size={16} /> Accepted
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}