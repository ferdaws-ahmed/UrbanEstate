"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../components/dashboard/admin/Sidebar';
import Topbar from '../../components/dashboard/admin/Topbar';
import data from '../../../public/data/dashboardData.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../components/ThemeProvider';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const { isDark } = useTheme();
  
  const [propsResults, setPropsResults] = useState([]);
  const [agentsResults, setAgentsResults] = useState([]);


  useEffect(() => {
    const term = q.toLowerCase().trim();
    if (term.length > 0) {
      const filteredProps = data.properties.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.location.toLowerCase().includes(term)
      );
      const filteredAgents = data.agents.filter((a) => 
        a.name.toLowerCase().includes(term)
      );

      setPropsResults(filteredProps);
      setAgentsResults(filteredAgents);
    } else {
      setPropsResults([]);
      setAgentsResults([]);
    }
  }, [q]); 

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency', currency: 'USD', minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.main 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
      className="flex-1 p-4 sm:p-6 md:p-8 w-full max-w-[100vw] overflow-hidden"
    >
      <div className="mb-8 md:mb-10 flex items-center gap-3 md:gap-4">
        <div className={`w-1.5 h-10 rounded-full ${isDark ? 'bg-[#cddfa0]' : 'bg-emerald-600'}`}></div>
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 dark:text-white tracking-wide">
            {q.length > 0 ? "Live Search Results" : "Global Search"}
          </h1>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
            {q.length > 0 ? (
              <>Filtering data for: <span className={`font-semibold px-2 py-0.5 rounded-md ml-1 ${isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-emerald-100 text-emerald-700'}`}>"{q}"</span></>
            ) : "Type something in the search bar to explore properties and agents."}
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {q.length === 0 ? (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            className={`flex flex-col items-center justify-center py-16 md:py-24 mx-2 md:mx-0 border rounded-3xl backdrop-blur-sm transition-all ${isDark ? 'border-[#1a4a40] bg-[#1a4a40]/10' : 'border-gray-200 bg-white/50 shadow-sm'}`}
          >
            <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-[#1a4a40]/50' : 'bg-emerald-50'}`}>
              <svg className={`w-8 h-8 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <p className={`text-base md:text-lg font-semibold tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Workspace is ready to search</p>
          </motion.div>
        ) : (propsResults.length === 0 && agentsResults.length === 0) ? (
          <motion.div 
            key="no-data"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`flex flex-col items-center justify-center py-16 md:py-24 mx-2 md:mx-0 rounded-3xl border backdrop-blur-sm ${isDark ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'}`}
          >
            <svg className={`w-10 h-10 mb-3 ${isDark ? 'text-red-400/50' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className={`text-sm md:text-base font-medium px-4 text-center break-all ${isDark ? 'text-red-400' : 'text-red-600'}`}>No data found matching "{q}"</p>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-10 md:space-y-12"
          >
            {/* Properties Section */}
            {propsResults.length > 0 && (
              <section>
                <h2 className={`text-sm md:text-base font-bold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-widest ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}>
                  <span className={`w-6 h-1 rounded-full ${isDark ? 'bg-[#cddfa0]' : 'bg-emerald-600'}`}></span> Properties Found
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                  {propsResults.map((p, index) => (
                    <motion.div key={p.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="w-full h-full">
                      <Link href={`/property/${p.id}`} className="block group h-full flex flex-col bg-white dark:bg-[#1a4a40]/20 border border-gray-100 dark:border-[#1a4a40]/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 dark:hover:bg-[#1a4a40]/40 dark:hover:border-[#cddfa0]/50">
                        <div className="w-full overflow-hidden aspect-[4/3] sm:aspect-auto sm:h-44 relative">
                          <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[#cddfa0] transition-colors truncate">{p.title}</h3>
                            <p className="text-[11px] md:text-xs text-gray-500 dark:text-gray-400 mt-1.5 flex items-center gap-1 truncate">{p.location}</p>
                          </div>
                          <p className={`text-base md:text-lg font-black mt-4 pt-3 border-t ${isDark ? 'text-[#cddfa0] border-[#1a4a40]' : 'text-emerald-600 border-gray-100'}`}>{formatPrice(p.price)}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Agents Section */}
            {agentsResults.length > 0 && (
              <section>
                <h2 className={`text-sm md:text-base font-bold mb-4 md:mb-6 flex items-center gap-2 uppercase tracking-widest ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}>
                  <span className={`w-6 h-1 rounded-full ${isDark ? 'bg-[#cddfa0]' : 'bg-emerald-600'}`}></span> Registered Agents
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {agentsResults.map((agent, index) => (
                    <motion.div key={agent.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="bg-white dark:bg-[#1a4a40]/20 border border-gray-100 dark:border-[#1a4a40]/50 p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 hover:shadow-md transition-all duration-300 dark:hover:bg-[#1a4a40]/40 dark:hover:border-[#cddfa0]/50 group cursor-pointer">
                      <img src={agent.avatar} className={`w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full border-2 object-cover transition-colors ${isDark ? 'border-[#1a4a40] group-hover:border-[#cddfa0]' : 'border-gray-100 group-hover:border-emerald-500'}`} alt="" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 dark:text-white text-sm truncate group-hover:text-emerald-600 dark:group-hover:text-[#cddfa0] transition-colors">{agent.name}</h3>
                        <p className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{agent.email}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

export default function SearchPage() {
  const { isDark } = useTheme();
  
  
  const [mounted, setMounted] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    setMounted(true); 
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000); 
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null; 

  return (
    <div className={`min-h-screen w-full overflow-x-hidden transition-colors duration-0 ${isDark ? 'bg-[#099880]' : 'bg-gray-50'}`}>
      <div className="flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 ml-0 md:ml-64">

          <Suspense fallback={null}>
            <Topbar />
          </Suspense>
          
          {isInitialLoading ? (
            <main className="flex-1 flex flex-col items-center justify-center min-h-[80vh] w-full">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className={`w-12 h-12 border-4 rounded-full ${isDark ? 'border-[#1a4a40] border-t-[#cddfa0]' : 'border-emerald-100 border-t-emerald-600'}`}
              />
              <motion.p 
                initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8, repeatType: "reverse" }}
                className={`mt-4 text-sm font-medium tracking-widest uppercase ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}
              >
                Loading Workspace...
              </motion.p>
            </main>
          ) : (
            <Suspense fallback={null}>
              <SearchContent />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

