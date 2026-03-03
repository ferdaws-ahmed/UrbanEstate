'use client';

import PropertyCard from './PropertyCard';

/**
 * PropertyGrid Component
 * Responsibility: Renders a responsive grid of property cards or a loading/empty state.
 */
export default function PropertyGrid({ properties, loading }) {
  // Loading State UI
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="h-[450px] bg-slate-200 dark:bg-slate-800 rounded-[2.5rem]"></div>
        ))}
      </div>
    );
  }

  // Empty State UI
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
        <div className="text-5xl mb-4 text-slate-300">🏠</div>
        <h3 className="text-xl font-bold text-slate-500 dark:text-slate-400">
          No properties found in this category.
        </h3>
        <p className="text-slate-400 dark:text-slate-500 mt-2">Try adjusting your filters or search.</p>
      </div>
    );
  }

  // Success State: The Grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      {properties.map((item) => (
        <PropertyCard key={item._id} data={item} />
      ))}
    </div>
  );
}