"use client";

import React, { useState } from "react";
import { MoreHorizontal, MessageSquare, CheckCircle2 } from "lucide-react";
import { useTheme } from "../../../ThemeProvider";

export default function SupportTickets() {
  const { isDark } = useTheme();

  // Initial State Data
  const [tickets, setTickets] = useState([
    { id: 1, title: "Payment Issue", date: "Sep 29, 2024", status: "Open" },
    { id: 2, title: "Map Not Loading", date: "Sep 25, 2024", status: "Pending" },
    { id: 3, title: "Commission Error", date: "Sep 23, 2024", status: "Closed" },
    { id: 4, title: "Login Problem", date: "Sep 20, 2024", status: "Resolved" },
    { id: 5, title: "Profile Update", date: "Sep 18, 2024", status: "Open" },
  ]);

  // Dropdown & Toast States
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const statusOptions = ["Open", "Pending", "Resolved", "Closed"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-rose-500/10 text-rose-500 border-rose-500/30";
      case "Pending": return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "Resolved": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/30";
      case "Closed": return "bg-gray-500/10 text-gray-400 border-gray-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  // Status Update Handler
  const handleStatusChange = (id, newStatus) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
    setOpenDropdownId(null);
    showToast(`Status updated to ${newStatus}`);
  };

  // Toast Function - fixed position to show outside the box
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <>
      {/* Global Dynamic Toast Message - NOW OUTSIDE THE CARD */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl backdrop-blur-xl border shadow-2xl flex items-center gap-3 transition-all duration-500 ease-out w-[90%] sm:w-auto justify-center ${
        toastMessage ? "translate-y-0 opacity-100 scale-100" : "-translate-y-10 opacity-0 scale-95 pointer-events-none"
      } ${isDark ? "bg-[#133c34]/95 border-[#cddfa0]/50 text-[#cddfa0]" : "bg-white/95 border-emerald-200 text-emerald-600"}`}>
        <CheckCircle2 size={24} className="shrink-0" />
        <span className="text-[14px] sm:text-[16px] font-black tracking-wide">{toastMessage}</span>
      </div>

      <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-full flex flex-col overflow-hidden relative ${
        isDark 
          ? "bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white" 
          : "bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900"
      }`}>
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
          <div className="min-w-0 flex-1">
            <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? "text-gray-100" : "text-gray-900"}`}>
              <MessageSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? "text-[#cddfa0]" : "text-blue-500"}`} />
              Support Tickets
            </h3>
            <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">
              Ticket Management
            </p>
          </div>
          <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? "bg-white/5 hover:bg-white/10" : "bg-gray-100 hover:bg-gray-200"}`}>
            <MoreHorizontal size={14} className={isDark ? "text-[#cddfa0]" : "text-gray-600"} />
          </button>
        </div>

        {/* Ticket List with Custom Vertical Scrollbar */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${
          isDark ? "scrollbar-dark" : "scrollbar-light"
        }`} style={{ maxHeight: "350px" }}>
          
          {/* gap-2.5 to make list tighter */}
          <div className="flex flex-col gap-2 w-full">
            {tickets.map((ticket) => (
              
              /* Padding reduced (p-2.5) to make inner boxes smaller */
              <div key={ticket.id} className={`flex flex-wrap items-center justify-between gap-x-2 gap-y-2 p-2.5 rounded-xl transition-all duration-300 border ${
                isDark ? "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10" : "bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md"
              }`}>
                
                <div className="flex items-center gap-2.5 flex-1 min-w-[130px]">
                  {/* Icon Box */}
                  <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isDark ? "bg-[#133c34] text-gray-400" : "bg-white text-gray-400 shadow-sm"
                  }`}>
                    <MessageSquare size={12} />
                  </div>
                  
                  {/* Ticket Details */}
                  <div className="flex flex-col">
                    <p className={`text-[11px] sm:text-[12px] font-black leading-snug whitespace-normal ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                      {ticket.title}
                    </p>
                    <p className={`text-[8px] font-medium mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      {ticket.date}
                    </p>
                  </div>
                </div>
                
                {/* Interactive Status Badge with Dropdown */}
                <div className="relative shrink-0 ml-auto">
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === ticket.id ? null : ticket.id)}
                    className={`w-[65px] flex items-center justify-center px-1.5 py-1 rounded-md border transition-all hover:scale-105 active:scale-95 ${getStatusColor(ticket.status)}`}
                  >
                    <span className="text-[8px] font-black uppercase tracking-widest text-center">
                      {ticket.status}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownId === ticket.id && (
                    <div className={`absolute right-0 top-full mt-1.5 w-24 rounded-lg shadow-xl border z-50 overflow-hidden backdrop-blur-xl ${
                      isDark ? "bg-[#091a16]/95 border-[#1a4a40]" : "bg-white/95 border-gray-200"
                    }`}>
                      {statusOptions.map(opt => (
                        <button
                          key={opt}
                          onClick={() => handleStatusChange(ticket.id, opt)}
                          className={`w-full text-left px-3 py-2 text-[9px] font-black transition-colors ${
                            ticket.status === opt ? (isDark ? 'bg-[#cddfa0]/20 text-[#cddfa0]' : 'bg-blue-50 text-blue-600') : 
                            isDark ? 'text-gray-300 hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Custom CSS for THIN Scrollbars */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 3px;
            height: 0px; 
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: ${isDark ? "#1a4a40" : "#e2e8f0"};
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: ${isDark ? "#cddfa0" : "#3b82f6"};
          }
        `}</style>

        {/* Background Decorative Glow Effect */}
        <div className="absolute top-[-5%] right-[-5%] w-24 h-24 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
      </div>
    </>
  );
}
