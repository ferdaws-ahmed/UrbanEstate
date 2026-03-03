"use client";

export default function SellerBookings() {
  const bookings = [
    { id: 1, buyer: "Rahim Ahmed", property: "Modern Villa", date: "25 Feb 2026" },
    { id: 2, buyer: "Karim Hasan", property: "City Apartment", date: "10 Mar 2026" },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="border-b py-4 flex justify-between">
            <div>
              <h2 className="font-semibold">{booking.property}</h2>
              <p>Buyer: {booking.buyer}</p>
            </div>
            <p className="text-gray-500">{booking.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}