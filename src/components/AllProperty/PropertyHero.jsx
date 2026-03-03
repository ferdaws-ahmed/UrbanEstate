'use client';

import { motion } from 'framer-motion';

const PropertyHero = ({ onSearch }) => {
  return (
    <section className="relative pt-20 pb-16 lg:pt-32 lg:pb-24 bg-slate-950 overflow-hidden rounded-b-[4rem] shadow-2xl">
      
      {/* --- premium bg --- */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[100px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          {/* (Floating Badge) */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Premium Properties Available</span>
          </motion.div>

          {/*  (Title with Gradient Text) */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black text-white leading-tight mb-8"
          >
            Discover Your Next <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Luxury Lifestyle
            </span>
          </motion.h1>

          {/* (The Main UX Part) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-4xl"
          >
            <div className="bg-white/10 backdrop-blur-2xl p-2 md:p-3 rounded-[2.5rem] border border-white/20 shadow-2xl flex flex-col md:flex-row items-center gap-3">
              
              {/* search input*/}
              <div className="flex-1 flex items-center gap-3 px-6 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Where do you want to live? (City, Zip, Street)"
                  className="bg-transparent w-full py-4 text-white outline-none placeholder:text-slate-400 text-lg"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>

              {/* filter and button */}
              <div className="flex items-center gap-2 w-full md:w-auto pr-2">
                 <button className="hidden md:flex items-center gap-2 px-6 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-3xl transition border border-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    Filters
                 </button>
                 <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[2rem] font-black transition-all transform active:scale-95 shadow-xl shadow-blue-500/20">
                    Find Now
                 </button>
              </div>
            </div>
          </motion.div>

          {/*  (Floating Stats) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 flex flex-wrap justify-center gap-8 md:gap-16"
          >
            {[
              { label: 'Properties', value: '1,200+' },
              { label: 'Happy Customers', value: '4.8k' },
              { label: 'Cities', value: '150+' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl md:text-3xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/*  (Bottom Wave or Curve) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-10 fill-slate-50 dark:fill-slate-900">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5,73.84-4.36,147.54,16.88,218.2,35.26,69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113,-1.11,1200,0.47V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default PropertyHero;