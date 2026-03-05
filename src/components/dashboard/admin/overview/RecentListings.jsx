"use client";
import CardWrapper from "../CardWrapper";

export default function RecentListings() {
  return (
    <CardWrapper>
      <h3 className="font-semibold mb-6">Recent Listings</h3>

      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="flex justify-between items-center p-4 rounded-xl 
            bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <div>
              <p className="font-medium">Luxury Apartment</p>
              <p className="text-sm text-gray-400">3 Bed • 2 Bath</p>
            </div>

            <span className="font-semibold text-emerald-400">$350K</span>
          </div>
        ))}
      </div>
    </CardWrapper>
  );
}