"use client";

export default function SellerOffers() {
  const offers = [
    { id: 1, buyer: "Rahim", amount: "৳ 70,00,000", status: "Pending" },
    { id: 2, buyer: "Karim", amount: "৳ 42,00,000", status: "Accepted" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Offers</h1>

      {offers.map((offer) => (
        <div key={offer.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
          <h2 className="font-semibold">Buyer: {offer.buyer}</h2>
          <p className="text-indigo-600 font-bold">{offer.amount}</p>

          <div className="mt-4 flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg">
              Accept
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}