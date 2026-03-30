"use client";

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Home, 
  User, 
  Clock, 
  ChevronRight, 
  AlertTriangle, 
  MessageCircle, 
  Loader2,
  Inbox
} from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { useReports } from '@/src/context/ReportContext';
import Link from 'next/link';

export default function ReportsPage() {
  const { isDark } = useTheme();
  const { fetchCount } = useReports();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'property', 'admin'

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // After visiting the page, we should refresh the count in context
    fetchCount();
  }, []);

  const filteredReports = reports.filter(r => {
    if (activeTab === 'all') return true;
    return r.type === activeTab;
  });

  const propertyReportsCount = reports.filter(r => r.type === 'property').length;
  const adminReportsCount = reports.filter(r => r.type === 'admin').length;

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className={`text-3xl font-black tracking-tight flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <div className="p-2 rounded-2xl bg-red-500/10 text-red-500">
                <ShieldAlert size={28} />
              </div>
              Reports <span className="text-red-500">Center</span>
            </h1>
            <p className={`text-sm font-bold uppercase tracking-[0.2em] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Real-time security & property incident monitoring
            </p>
          </div>

          <div className="flex bg-white/5 dark:bg-black/20 p-1 rounded-2xl border border-white/10">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'all' ? 'bg-red-500 text-white shadow-lg' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
            >
              All ({reports.length})
            </button>
            <button 
              onClick={() => setActiveTab('property')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'property' ? 'bg-red-500 text-white shadow-lg' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
            >
              Property ({propertyReportsCount})
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-red-500 text-white shadow-lg' : (isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900')}`}
            >
              Admin ({adminReportsCount})
            </button>
          </div>
        </div>

        {/* Reports List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-red-500" size={48} />
            <p className={`text-sm font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Synchronizing Reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className={`p-20 text-center rounded-[2.5rem] border-2 border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}>
            <Inbox size={64} className="mx-auto mb-6 text-slate-300 opacity-50" />
            <h3 className={`text-xl font-black mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>All Clear!</h3>
            <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No active reports found for this category.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report, idx) => (
              <div 
                key={report.id || `report-${idx}`}
                className={`group p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-[#133c34]/20 border-white/10 hover:bg-[#133c34]/30' 
                    : 'bg-white border-slate-100 hover:border-red-100'
                } ${report.status === 'unread' ? 'ring-2 ring-red-500/30 ring-offset-2 ring-offset-transparent' : ''}`}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  {/* Icon & Type */}
                  <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${
                    report.type === 'property' 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'bg-red-500/10 text-red-500'
                  }`}>
                    {report.type === 'property' ? <Home size={28} /> : <AlertTriangle size={28} />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                        report.type === 'property' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {report.type === 'property' ? 'Property Issue' : 'General Report'}
                      </span>
                      <span className={`text-[10px] font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        • {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg font-black truncate mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {report.reason || report.message || 'No subject provided'}
                    </h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <User size={14} className="text-red-500" />
                        <span>By: {report.reportedBy || 'Anonymous'}</span>
                      </div>
                      {report.type === 'property' && (
                        <div className="flex items-center gap-1.5">
                          <Home size={14} className="text-amber-500" />
                          <span className="truncate max-w-[200px]">{report.propertyTitle}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    {report.type === 'property' ? (
                      <Link 
                        href={`/propertydetails/${report.propertyId}`}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        View Asset <ChevronRight size={14} />
                      </Link>
                    ) : (
                      <button 
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          isDark ? 'bg-white/5 text-white hover:bg-white/10' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                        }`}
                      >
                        Details <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
