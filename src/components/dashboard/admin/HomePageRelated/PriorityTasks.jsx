"use client";

import React, { useState } from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { CheckSquare, Clock, MoreHorizontal, AlertCircle, Check } from 'lucide-react';

export default function PriorityTasks() {
  const { isDark } = useTheme();

  const [tasks, setTasks] = useState([
    { id: 1, title: 'Verify Gulshan Villa Documents', time: '11:30 AM', priority: 'High', isCompleted: false },
    { id: 2, title: 'Call Mr. Rahman for contract signing', time: '01:00 PM', priority: 'High', isCompleted: false },
    { id: 3, title: 'Update Banani Commercial listing', time: '03:45 PM', priority: 'Medium', isCompleted: false },
    { id: 4, title: 'Follow up with new leads from FB', time: '05:00 PM', priority: 'Medium', isCompleted: false },
    { id: 5, title: 'Prepare monthly revenue report', time: 'Tomorrow', priority: 'Low', isCompleted: false },
    { id: 6, title: 'Schedule maintenance for Apt 4B', time: 'Tomorrow', priority: 'Low', isCompleted: false },
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, isCompleted: !task.isCompleted } : task));
  };

  return (
   
    <div className={`p-4 sm:p-5 rounded-[1.5rem] sm:rounded-[2rem] border backdrop-blur-xl transition-all duration-500 shadow-xl flex flex-col overflow-hidden relative h-[380px] sm:h-[400px] w-full ${
      isDark ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 text-white' : 'bg-white/80 border-gray-200 shadow-gray-200/50 text-gray-900'
    }`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4 relative z-10 shrink-0 gap-2">
        <div className="min-w-0 flex-1">
          <h3 className={`text-[13px] sm:text-base font-black flex items-center gap-1.5 flex-wrap ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            <CheckSquare className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isDark ? 'text-[#cddfa0]' : 'text-emerald-500'}`} />
            Priority <span className={isDark ? 'text-[#cddfa0]' : 'text-emerald-600'}>Tasks</span>
          </h3>
          <p className="text-[8px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1.5 leading-tight">Action items for today</p>
        </div>
        <button className={`p-1.5 rounded-lg shrink-0 transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'}`}>
          <MoreHorizontal size={14} className={isDark ? 'text-[#cddfa0]' : 'text-gray-600'} />
        </button>
      </div>

      {/* List */}
      <div className={`flex-1 min-h-0 overflow-y-auto overflow-x-hidden pr-1 pb-1 custom-scrollbar relative z-10 ${isDark ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        <div className="flex flex-col gap-2.5 w-full mt-1">
          {tasks.map((task) => (
            <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 border group cursor-pointer ${
              task.isCompleted ? (isDark ? 'bg-white/5 border-transparent opacity-50' : 'bg-gray-50 border-transparent opacity-60') : (isDark ? 'bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10 shadow-sm' : 'bg-white border-gray-100 hover:shadow-md')
            }`} onClick={() => toggleTask(task.id)}>
              <div className={`mt-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded flex items-center justify-center shrink-0 transition-all duration-300 border ${
                task.isCompleted ? (isDark ? 'bg-[#cddfa0] border-[#cddfa0] text-[#133c34]' : 'bg-emerald-500 border-emerald-500 text-white') : (isDark ? 'bg-[#091a16] border-[#1a4a40] group-hover:border-[#cddfa0]' : 'bg-gray-50 border-gray-300 group-hover:border-emerald-400')
              }`}>
                {task.isCompleted && <Check size={12} strokeWidth={4} />}
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <p className={`text-[10px] sm:text-[12px] font-black leading-snug transition-all duration-300 ${task.isCompleted ? 'line-through text-gray-500' : (isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800')}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div className={`flex items-center gap-1 text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-sm ${isDark ? 'bg-[#1a4a40] text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    <Clock size={8} /><span>{task.time}</span>
                  </div>
                  {!task.isCompleted && (
                    <div className={`flex items-center gap-1 text-[7px] sm:text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${
                      task.priority === 'High' ? (isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_8px_rgba(244,63,94,0.2)]' : 'bg-rose-50 text-rose-600 border-rose-200')
                      : task.priority === 'Medium' ? (isDark ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200')
                      : (isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200')
                    }`}>
                      {task.priority === 'High' && <AlertCircle size={8} />}<span>{task.priority}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 2px; height: 0px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${isDark ? '#1a4a40' : '#e2e8f0'}; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#cddfa0' : '#10b981'}; }
      `}</style>
      <div className="absolute top-[-10%] right-[-10%] w-32 h-32 bg-[#cddfa0]/5 rounded-full blur-3xl pointer-events-none z-0"></div>
    </div>
  );
}
