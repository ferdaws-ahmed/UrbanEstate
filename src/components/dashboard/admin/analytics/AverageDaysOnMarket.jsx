"use client";
import CardWrapper from "./CardWrapper";

const data = [
  { type: "Apartment", days: 39 },
  { type: "Villa", days: 26 },
  { type: "Commercial", days: 19 },
  { type: "Other", days: 13 },
];

export default function AverageDaysOnMarket() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Average Days on Market</h3>

      <div className="space-y-5">
        {data.map((item, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-2">
              <span>{item.type}</span>
              <span>{item.days} days</span>
            </div>

            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500
                transition-all duration-700"
                style={{ width: `${item.days * 2}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}