export default function PaginationSection() {
  return (
    <div className="flex justify-center items-center gap-4 mt-6">
      <button className="px-3 py-1 bg-white/10 rounded-lg">1</button>
      <button className="px-3 py-1 bg-white/10 rounded-lg">2</button>
      <button className="px-3 py-1 bg-white/10 rounded-lg">3</button>

      <button
        className="ml-4 px-5 py-2 rounded-xl bg-gradient-to-r 
        from-indigo-500 to-purple-600 hover:scale-105 transition"
      >
        Load More
      </button>
    </div>
  );
}