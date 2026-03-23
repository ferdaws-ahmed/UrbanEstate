"use client";

import React, { useState } from 'react';
import { useTheme } from '../../../ThemeProvider';
import { Calendar, MoreHorizontal, CheckCircle2 } from 'lucide-react';

export default function PendingApprovals({ approvals }) {
  const { isDark } = useTheme();


  const [data, setData] = useState(approvals || [
    { id: 1, agentName: 'Sarah Johnson', properties: 13, revenue: '$300K', location: 'Dhaka', status: 'Pending', color: 'amber' },
    { id: 2, agentName: 'Robert Taylor', properties: 8, revenue: '$150K', location: 'Chittagong', status: 'Pending', color: 'amber' },
    { id: 3, agentName: 'Michael Chen', properties: 5, revenue: '$90K', location: 'Sylhet', status: 'Approved', color: 'emerald' },
  ]);

  // Dropdown & Toast States
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const statusOptions = ["Pending", "Approved", "Rejected"];

  // Handle Status Change
  const handleStatusChange = (id, newStatus) => {
    let newColor = 'gray';
    if (newStatus === 'Pending') newColor = 'amber';
    if (newStatus === 'Approved') newColor = 'emerald';
    if (newStatus === 'Rejected') newColor = 'rose';

    setData(data.map(item => item.id === id ? { ...item, status: newStatus, color: newColor } : item));
    setOpenDropdownId(null);
    showToast(`Request marked as ${newStatus}`);
  };

  // Toast Function
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <>
      {/* Global Dynamic Toast Message */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 transition-all duration-500 ease-out w-[90%] sm:w-auto justify-center ${
        toastMessage ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
      } ${isDark ? "bg-[#133c34]/95 border-[#cddfa0]/50 text-[#cddfa0]" : "bg-white/95 border-emerald-200 text-emerald-600"}`}>
        <CheckCircle2 size={24} className="shrink-0" />
        <span className="text-[14px] sm:text-[16px] font-black tracking-wide">{toastMessage}</span>
      </div>

      {/* Main Card with Premium Dark Theme */}
      <div className={`p-6 rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl flex flex-col h-[420px] ${
        isDark 
          ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' 
          : 'bg-white/80 border-white text-gray-900'
      }`}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              Pending <span className={isDark ? 'text-[#cddfa0]' : 'text-blue-600'}>Approvals</span>
            </h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Verification Queue</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
             <Calendar size={14} className={isDark ? 'text-[#cddfa0]' : 'text-blue-500'} />
             <span className="text-[10px] font-black uppercase tracking-tighter">March 2026</span>
          </div>
        </div>

        {/* Table Section with Horizontal Scroll for Narrow Columns */}
        <div className="flex-1 overflow-auto custom-scrollbar pr-1 pb-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`border-b text-[10px] font-black uppercase tracking-widest ${isDark ? 'border-[#1a4a40] text-gray-400' : 'border-gray-100 text-gray-400'}`}>
                <th className="pb-3 px-2 whitespace-nowrap">Agent</th>
                <th className="pb-3 text-center whitespace-nowrap">Sales</th>
                <th className="pb-3 pr-2 text-right whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? 'divide-[#1a4a40]/30' : 'divide-gray-50'}`}>
              {data.map((item) => (
                <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-3 px-2 min-w-[140px]">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${item.agentName}&background=random&color=fff&bold=true`} className="w-8 h-8 rounded-lg shrink-0 shadow-sm" alt="" />
                      <div className="min-w-0">
                        <p className={`text-[12px] font-black truncate ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{item.agentName}</p>
                        <p className="text-[9px] font-bold text-gray-500 truncate">{item.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-center min-w-[80px]">
                     <p className={`text-[11px] font-black ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>{item.revenue}</p>
                     <p className="text-[9px] text-gray-500 font-bold whitespace-nowrap">{item.properties} units</p>
                  </td>
                  <td className="py-3 pr-2 text-right relative min-w-[90px]">
                    
                    {/* Interactive Fixed-Width Status Badge */}
                    <div className="flex justify-end">
                      <button 
                        onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                        className={`w-20 px-2 py-1.5 rounded-lg border text-[9px] font-black uppercase tracking-widest text-center transition-all hover:scale-105 active:scale-95 ${
                          item.color === 'amber' ? (isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200') :
                          item.color === 'emerald' ? (isDark ? 'bg-emerald-500/10 text-[#cddfa0] border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200') :
                          (isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-200')
                        }`}
                      >
                        {item.status}
                      </button>
                    </div>

                    {/* Dropdown Menu */}
                    {openDropdownId === item.id && (
                      <div className={`absolute right-2 top-10 mt-1 w-24 rounded-lg shadow-2xl border z-50 overflow-hidden backdrop-blur-xl ${
                        isDark ? "bg-[#091a16]/95 border-[#1a4a40]" : "bg-white/95 border-gray-200"
                      }`}>
                        {statusOptions.map(opt => (
                          <button
                            key={opt}
                            onClick={() => handleStatusChange(item.id, opt)}
                            className={`w-full text-left px-3 py-2.5 text-[10px] font-black transition-colors ${
                              item.status === opt ? (isDark ? 'bg-[#cddfa0]/20 text-[#cddfa0]' : 'bg-blue-50 text-blue-600') : 
                              isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Button */}
        <button className={`w-full mt-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 shadow-md ${
          isDark 
            ? 'bg-[#1a4a40] text-[#cddfa0] border border-[#cddfa0]/20 hover:bg-[#cddfa0] hover:text-[#091a16] hover:shadow-[0_0_15px_rgba(205,223,160,0.3)]' 
            : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white'
        }`}>
          Process All Requests
        </button>

        {/* Custom CSS for THIN Scrollbars */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
            height: 3px; 
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? '#1a4a40' : '#e2e8f0'};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? '#cddfa0' : '#3b82f6'};
          }
        `}</style>
      </div>
    </>
  );
}