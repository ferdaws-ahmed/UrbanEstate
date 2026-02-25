"use client";

export default function PaymentsPage() {
  const payments = [
    {
      id: 1,
      property: "Modern Villa",
      amount: "৳ 2,00,000",
      date: "12 Feb 2026",
      status: "Completed",
    },
    {
      id: 2,
      property: "Apartment Booking",
      amount: "৳ 50,000",
      date: "01 Jan 2026",
      status: "Pending",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Payment History</h1>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th className="p-4 text-left">Property</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-4">{payment.property}</td>
                <td className="p-4">{payment.amount}</td>
                <td className="p-4">{payment.date}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      payment.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}