"use client";

export default function SellerRevenue() {
  const revenue = [
    { month: "January", amount: "৳ 25,00,000" },
    { month: "February", amount: "৳ 40,00,000" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Revenue</h1>

      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-4">Monthly Earnings</h2>
        {revenue.map((item, i) => (
          <p key={i}>{item.month}: {item.amount}</p>
        ))}
      </div>
    </div>
  );
}