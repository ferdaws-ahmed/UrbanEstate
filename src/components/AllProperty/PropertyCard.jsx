export default function PropertyCard({ data }) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-2xl transition-all duration-500">
      {/* Image Wrap */}
      <div className="relative h-64 m-3 overflow-hidden rounded-[2rem]">
        <img 
          src={data.images?.[0]?.url || '/placeholder-home.jpg'} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 px-4 py-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full text-xs font-bold text-blue-600 shadow-sm">
          {data.listingStatus}
        </div>
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-2xl font-black shadow-xl">
          ${data.price?.toLocaleString()}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{data.title}</h3>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
          📍 {data.location?.city}, {data.location?.address}
        </p>

        {/* Feature Icons */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
          <div className="flex flex-col items-center">
            <span className="text-blue-500 text-lg font-bold">{data.specifications?.bedrooms}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Beds</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-700" />
          <div className="flex flex-col items-center">
            <span className="text-blue-500 text-lg font-bold">{data.specifications?.bathrooms}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Baths</span>
          </div>
          <div className="w-[1px] h-8 bg-slate-100 dark:bg-slate-700" />
          <div className="flex flex-col items-center">
            <span className="text-blue-500 text-lg font-bold">{data.specifications?.area}</span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">Sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}