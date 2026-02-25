"use client";

const properties = [
  { id: 1, title: "Luxury Apartment", price: "$1200/month", location: "Dhaka" },
  { id: 2, title: "Modern Villa", price: "$3500/month", location: "Chittagong" },
  { id: 3, title: "Studio Flat", price: "$800/month", location: "Sylhet" },
];

export default function UserProperties() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Browse Properties
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition"
          >
            <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>

            <h3 className="text-xl font-bold">{property.title}</h3>
            <p className="text-gray-500">{property.location}</p>
            <p className="text-indigo-600 font-semibold mt-2">
              {property.price}
            </p>

            <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}