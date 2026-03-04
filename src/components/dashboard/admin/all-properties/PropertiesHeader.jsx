export default function PropertiesHeader() {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-semibold tracking-wide">
        All Properties Overview
      </h1>

      <button
        className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600
        hover:scale-105 transition-all duration-300 shadow-lg shadow-indigo-500/20"
      >
        + Add New Property
      </button>
    </div>
  );
}