"use client";

import { motion } from "framer-motion";

export default function PropertyCard() {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10
      rounded-2xl p-4 shadow-lg hover:shadow-indigo-500/20
      transition-all duration-300 flex gap-4"
    >
      {/* Image */}
      <div className="w-40 h-28 rounded-xl overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
          alt="property"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-green-500 text-xs px-3 py-1 rounded-full">
          Available
        </div>
      </div>

      {/* Info */}
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold text-lg">Modern Gulshan Apt</h3>
          <span className="text-sm text-gray-400">•••</span>
        </div>

        <p className="text-sm text-gray-400 mt-1">
          Road 12, Gulshan 1, Dhaka 1212
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-400">$450K</span>
          <span className="text-sm text-gray-400">
            1600 sq ft • 3 Bed • 2.5 Bath
          </span>
        </div>

        <div className="mt-3 flex justify-between text-sm text-gray-400">
          <span>Assigned Agent: S. Islam</span>

          <div className="flex gap-3">
            <button className="hover:text-indigo-400">✏️</button>
            <button className="hover:text-red-400">🗑️</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}