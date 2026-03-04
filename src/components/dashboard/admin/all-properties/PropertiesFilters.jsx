export default function PropertiesFilters() {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10
      rounded-2xl p-4 flex flex-wrap gap-4 items-center
      shadow-[0_0_40px_rgba(0,0,0,0.4)]"
    >
      <input
        placeholder="Search properties by name, location, ID..."
        className="flex-1 min-w-[250px] bg-transparent border border-white/10
        rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <select className="bg-transparent border border-white/10 px-4 py-2 rounded-xl">
        <option>Residential</option>
        <option>Commercial</option>
      </select>

      <select className="bg-transparent border border-white/10 px-4 py-2 rounded-xl">
        <option>For Sale</option>
        <option>For Rent</option>
        <option>Under Offer</option>
        <option>Sold</option>
      </select>

      <select className="bg-transparent border border-white/10 px-4 py-2 rounded-xl">
        <option>Price Range</option>
      </select>
    </div>
  );
}