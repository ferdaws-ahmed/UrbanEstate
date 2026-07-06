"use client";

import { useState, useEffect, useMemo } from 'react';
import { Search, MoreVertical, Star, Users, ShieldCheck, Mail, Phone, X, ChevronLeft, ChevronRight, ChevronDown, Trash2, AlertTriangle, CheckCircle, LayoutGrid, List, BarChart3, MapPin, Activity, ShieldAlert, Snowflake, UserMinus } from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import toast from 'react-hot-toast';

export default function SellerManagement() {
  const { isDark } = useTheme();
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'table' ? 8 : 12;

  const fetchSellers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/sellers');
      if (!response.ok) throw new Error('Failed to fetch sellers');
      const data = await response.json();
      setSellers(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error loading sellers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    const tid = toast.loading(`Updating status to ${newStatus}...`);
    try {
      const response = await fetch('/api/admin/sellers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!response.ok) throw new Error('Update failed');
      
      setSellers(sellers.map(s => s.id === id ? { ...s, status: newStatus } : s));
      toast.success(`Seller status updated to ${newStatus}`, { id: tid });
    } catch (error) {
      toast.error('Failed to update status', { id: tid });
    }
  };

  const filteredSellers = useMemo(() => {
    return sellers.filter(s => {
      const matchesSearch = s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [sellers, searchTerm, selectedStatus]);

  const paginatedSellers = filteredSellers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>Synchronizing Sellers...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      
      {/* Premium Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-500">
              <Users size={28} />
            </div>
            Sellers <span className="text-emerald-500">Network</span>
          </h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-[0.2em] mt-2">Managing {sellers.length} Professional Partners</p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center p-1 rounded-2xl border ${isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
            <button onClick={() => setViewMode('table')} className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? (isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white shadow-lg') : 'text-gray-400'}`}><List size={20} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? (isDark ? 'bg-emerald-500 text-white' : 'bg-emerald-600 text-white shadow-lg') : 'text-gray-400'}`}><LayoutGrid size={20} /></button>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className={`mb-8 p-3 rounded-[2rem] border backdrop-blur-md transition-all duration-300 ${
        isDark ? 'bg-[var(--card)]/80 border-white/10 shadow-2xl' : 'bg-white/80 border-gray-200 shadow-xl shadow-gray-200/50'
      }`}>
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Search sellers by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all duration-300 ${
                isDark ? 'bg-black/20 border-white/10 text-white focus:border-emerald-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-emerald-500'
              }`}
            />
          </div>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            {['All', 'Active', 'Frozen', 'Terminated'].map(status => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 lg:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  selectedStatus === status 
                    ? (isDark ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20')
                    : (isDark ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50 shadow-sm')
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sellers Display */}
      {viewMode === 'table' ? (
        <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-300 ${isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-white border-gray-200 shadow-sm'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-100 bg-gray-50'}`}>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Partner Details</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500">Contact Info</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Portfolio</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-center">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-transparent">
                {paginatedSellers.map((s) => (
                  <tr key={s.id} className={`group transition-all duration-300 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} ${s.status === 'Terminated' ? 'opacity-60 grayscale' : ''}`}>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-500/20" />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${isDark ? 'border-[var(--card)]' : 'border-white'} ${
                            s.status === 'Active' ? 'bg-emerald-500' : s.status === 'Frozen' ? 'bg-blue-500' : 'bg-red-500'
                          }`}></div>
                        </div>
                        <div>
                          <p className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.name}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Professional Seller</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                          <Mail size={12} className="text-emerald-500" /> {s.email}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-gray-500">
                          <Phone size={12} className="text-emerald-500" /> {s.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="inline-flex flex-col items-center">
                        <p className={`text-lg font-black ${isDark ? 'text-[#cddfa0]' : 'text-emerald-700'}`}>{s.propertiesCount}</p>
                        <p className="text-[9px] font-black uppercase text-gray-500 tracking-tighter">Properties</p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                          s.status === 'Active' ? (isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-700') :
                          s.status === 'Frozen' ? (isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700') :
                          (isDark ? 'bg-red-500/10 text-red-400' : 'bg-red-100 text-red-700')
                        }`}>
                          {s.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        {s.status !== 'Active' && (
                          <button onClick={() => handleUpdateStatus(s.id, 'Active')} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`} title="Activate Partner">
                            <ShieldCheck size={18} />
                          </button>
                        )}
                        {s.status === 'Active' && (
                          <button onClick={() => handleUpdateStatus(s.id, 'Frozen')} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white'}`} title="Freeze Account">
                            <Snowflake size={18} />
                          </button>
                        )}
                        <button onClick={() => handleUpdateStatus(s.id, 'Terminated')} className={`p-2.5 rounded-xl transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`} title="Terminate Partnership">
                          <UserMinus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedSellers.map((s) => (
            <div key={s.id} className={`group rounded-[2.5rem] border overflow-hidden transition-all duration-500 hover:scale-[1.02] relative ${
              isDark ? 'bg-[var(--card)]/40 border-white/10 hover:bg-[var(--card)]' : 'bg-white border-gray-200 shadow-lg shadow-gray-200/20'
            } ${s.status === 'Terminated' ? 'opacity-60 grayscale' : ''}`}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="relative">
                    <img src={s.avatar} alt={s.name} className="w-16 h-16 rounded-[1.5rem] object-cover border-4 border-emerald-500/10 shadow-xl" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 ${isDark ? 'border-[var(--card)]' : 'border-white'} ${
                      s.status === 'Active' ? 'bg-emerald-500' : s.status === 'Frozen' ? 'bg-blue-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${
                      s.status === 'Active' ? 'bg-emerald-500 text-white' : s.status === 'Frozen' ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>

                <h3 className={`text-lg font-black truncate mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.name}</h3>
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Professional Seller</p>

                <div className={`space-y-2 mb-6 p-4 rounded-2xl ${isDark ? 'bg-black/20' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                    <Mail size={14} className="text-emerald-500 shrink-0" /> <span className="truncate">{s.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-gray-500">
                    <Phone size={14} className="text-emerald-500 shrink-0" /> {s.phone}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.propertiesCount}</p>
                    <p className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Properties</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                    <p className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>0</p>
                    <p className="text-[8px] font-black uppercase text-gray-500 tracking-tighter">Reviews</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {s.status !== 'Active' && (
                    <button onClick={() => handleUpdateStatus(s.id, 'Active')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-emerald-500 text-[var(--background)]' : 'bg-emerald-600 text-white'}`}>
                      <ShieldCheck size={14} /> Activate
                    </button>
                  )}
                  {s.status === 'Active' && (
                    <button onClick={() => handleUpdateStatus(s.id, 'Frozen')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-blue-500 text-white' : 'bg-blue-600 text-white'}`}>
                      <Snowflake size={14} /> Freeze
                    </button>
                  )}
                  <button onClick={() => handleUpdateStatus(s.id, 'Terminated')} className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white'}`}>
                    <UserMinus size={14} /> Terminate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className={`p-3 rounded-2xl border transition-all ${currentPage === 1 ? 'opacity-30' : (isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-white border-gray-200 shadow-sm')}`}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-2xl text-xs font-black transition-all ${
                  currentPage === i + 1 
                    ? (isDark ? 'bg-emerald-500 text-[var(--background)]' : 'bg-emerald-600 text-white shadow-lg') 
                    : (isDark ? 'text-gray-500 hover:bg-white/5' : 'text-gray-400 hover:bg-white')
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className={`p-3 rounded-2xl border transition-all ${currentPage === totalPages ? 'opacity-30' : (isDark ? 'hover:bg-white/5 border-white/10' : 'hover:bg-white border-gray-200 shadow-sm')}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

