"use client";

export default function UserBookings() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Property</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-4">Luxury Apartment</td>
              <td className="p-4">12 Feb 2026</td>
              <td className="p-4 text-green-600 font-semibold">Confirmed</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}