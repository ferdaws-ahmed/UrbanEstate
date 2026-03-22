"use client";

import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { 
  Activity, Target, TrendingUp, DollarSign, Download, Calendar, 
  ChevronDown, BarChart2, PieChart as PieIcon, Check, 
  ChevronLeft, ChevronRight, Plus, Phone, FileText, Star, ListTodo, X
} from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';
import analyticsData from '../../../../../public/data/analyticsData.json';

// PDF Export Libraries
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; 

const simulateDynamicData = (baseData, range) => {
  const newData = JSON.parse(JSON.stringify(baseData || {}));

  let multiplier = 1;
  if (range === 'Today') multiplier = 0.15;
  else if (range === 'Last 7 Days') multiplier = 0.4;
  else if (range === 'This Year') multiplier = 4.5;
  else if (range === 'All Time') multiplier = 9.2;

  const jitter = (val) => Math.max(0, Math.round(val * multiplier * (0.6 + Math.random() * 0.8)));

  if (newData.salesByPropertyType) {
    newData.salesByPropertyType = newData.salesByPropertyType.map(item => ({
      ...item,
      Apartment: jitter(item.Apartment !== undefined ? Number(item.Apartment) : 800),
      Villa: jitter(item.Villa !== undefined ? Number(item.Villa) : 400),
      Commercial: jitter(item.Commercial !== undefined ? Number(item.Commercial) : 300)
    }));
  }
  
  if (newData.marketTrends) {
    newData.marketTrends = newData.marketTrends.map(item => ({
      ...item, 
      avgPrice: jitter(item.avgPrice !== undefined ? Number(item.avgPrice) : 35000)
    }));
  }

  if (newData.inventoryLevels) {
    newData.inventoryLevels = newData.inventoryLevels.map(item => ({
      ...item, 
      inventory: jitter(item.inventory !== undefined ? Number(item.inventory) : 15000)
    }));
  }

  if (newData.transactionVolume) {
    newData.transactionVolume = newData.transactionVolume.map(item => ({
      ...item, 
      volume: jitter(item.volume !== undefined ? Number(item.volume) : 8000)
    }));
  }

  if (newData.marketShare) {
    newData.marketShare = newData.marketShare.map(item => ({
      ...item, 
      value: jitter(item.value !== undefined ? Number(item.value) : 25)
    }));
  }

  const generateMore = (arr, count) => {
    if(!arr || arr.length === 0) return [];
    const res = [];
    for(let i=0; i<count; i++) {
        const base = arr[i % arr.length];
        res.push({...base, id: i + 100, agentName: base.agentName ? `${base.agentName} ${i+1}` : base.agentName, name: base.name ? `${base.name} ${i+1}` : base.name});
    }
    return res;
  }

  newData.agentPerformance = generateMore(newData.agentPerformance, 35); 
  newData.underperformingListings = generateMore(newData.underperformingListings, 28); 
  newData.newHighValueLeads = generateMore(newData.newHighValueLeads, 42); 

  newData.marketValuation = { value: `$${(jitter(50000) / 1000).toFixed(1)}M`, trend: multiplier > 1 ? 'Up by 8.4%' : 'Down by 2.1%' };
  newData.listingConversionRate = { value: `${(jitter(15) + 5).toFixed(1)}%`, trend: multiplier > 1 ? 'Up by 4.2%' : 'Down by 1.5%' };

  newData.recentActivities = [
    { id: 1, type: 'Sale', message: 'Apartment sold in Downtown Plaza', time: '10 mins ago', amount: `+$${jitter(45)}k` },
    { id: 2, type: 'Lead', message: 'New high-value lead registered', time: '2 hours ago', amount: 'Pending' },
    { id: 3, type: 'Alert', message: 'Inventory critical in North Villa', time: '5 hours ago', amount: 'Action Needed' },
    { id: 4, type: 'Meeting', message: 'Client viewing scheduled', time: '1 day ago', amount: '--' },
    { id: 5, type: 'Sale', message: 'Commercial space leased', time: '1 day ago', amount: `+$${jitter(12)}k` }
  ];

  const targetAchieved = Math.min(100, Math.max(10, jitter(100))); 
  newData.revenueTarget = [{ name: 'Achieved', value: targetAchieved >= 100 ? 100 : targetAchieved }];

  newData.upcomingTasks = [
    { id: 1, task: 'Property Valuation - Villa 45', time: 'Today, 2:30 PM', priority: 'High', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
    { id: 2, task: 'Client Meeting - Sarah Connor', time: 'Tomorrow, 10:00 AM', priority: 'Medium', color: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' },
    { id: 3, task: 'Contract Review - Apt 12B', time: 'Oct 24, 4:00 PM', priority: 'High', color: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
    { id: 4, task: 'Follow up with new leads', time: 'Oct 25, 11:00 AM', priority: 'Low', color: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' }
  ];

  const satisfaction = Math.min(100, Math.max(10, jitter(100))); 
  newData.satisfactionScore = [{ name: 'Satisfied', value: satisfaction >= 100 ? 100 : satisfaction }];

  return newData;
};

// CUSTOM TOOLTIP FOR CHARTS
const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-4 py-3 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${
        isDark 
          ? 'bg-[#050f0d]/90 border-[#1a4a40] shadow-[0_10px_40px_rgba(0,0,0,0.5)]' 
          : 'bg-white/90 border-gray-100 shadow-[0_10px_40px_rgba(37,99,235,0.1)]'
      }`}>
        <p className={`text-[10px] font-black uppercase tracking-widest mb-2 pb-2 border-b ${isDark ? 'text-gray-400 border-[#1a4a40]' : 'text-gray-500 border-gray-100'}`}>
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 my-1.5">
            <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></span>
            <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{entry.name}:</span>
            <span className={`text-sm font-black ml-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// FUNCTIONAL PAGINATION COMPONENT
const PaginationFooter = ({ isDark, currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className={`p-3 sm:p-4 border-t flex items-center justify-between mt-auto shrink-0 ${isDark ? 'border-[#1a4a40]/50 bg-[#0f2e28]/20' : 'border-gray-100 bg-gray-50/50'}`}>
      <div className="flex items-center gap-1 sm:gap-2">
        <button 
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${currentPage === 1 ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <ChevronLeft size={16} />
        </button>
        
        {getPageNumbers().map((page, idx) => (
          <button 
            key={idx}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={typeof page !== 'number'}
            className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
              page === currentPage 
                ? (isDark ? 'bg-[#1a4a40] border-[#2d6a5c] text-[#cddfa0] border font-black' : 'bg-gray-900 text-white font-black') 
                : typeof page === 'number' 
                  ? (isDark ? 'text-gray-400 hover:bg-[#1a4a40]/50' : 'text-gray-600 hover:bg-gray-200')
                  : 'text-gray-400 cursor-default'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-1 sm:p-1.5 rounded-lg transition-colors ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed text-gray-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
      
      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-colors border ${
        isDark 
          ? 'bg-[#0f2e28] border-[#1a4a40] text-gray-200 hover:bg-[#1a4a40]' 
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
      } ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}>
        Load More
      </button>
    </div>
  );
};

// TABLE COMPONENT WITH INTERNAL PAGINATION LOGIC
const TableCard = ({ title, columns, data, isDark, showPagination, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [data]);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage) || 1;
  const currentData = showPagination ? (data || []).slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : (data || []);

  return (
    <div className="bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-3xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-xl shadow-gray-200/40 dark:shadow-[0_15px_50px_rgba(0,0,0,0.3)] flex flex-col h-full overflow-hidden w-full">
      <div className="p-5 sm:p-8 border-b border-gray-100 dark:border-[#1a4a40]/50 flex justify-between items-center bg-gray-50/30 dark:bg-transparent shrink-0">
        <h3 className="text-xs sm:text-sm font-black tracking-widest uppercase text-gray-900 dark:text-white flex items-center gap-2">
          <div className="w-1.5 h-5 sm:w-2 sm:h-6 rounded-full bg-gradient-to-b from-blue-500 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65]"></div>
          {title}
        </h3>
      </div>
      <div className="flex-1 p-2 sm:p-4 overflow-x-auto w-full custom-scrollbar">
        <table className="w-full text-left h-full min-w-[400px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-[#0f2e28]/70 rounded-xl">
              {columns.map((col, idx) => (
                <th key={idx} className={`px-4 sm:px-6 py-3 sm:py-4 text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.1em] sm:tracking-[0.2em] ${idx === 0 ? 'rounded-l-xl w-[40%]' : idx === columns.length - 1 ? 'rounded-r-xl w-[30%]' : 'w-[30%]'}`}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/50 dark:divide-[#1a4a40]/30">
            {currentData.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50/30 dark:hover:bg-[#1a4a40]/40 transition-colors group h-[60px]">
                {Object.values(row).map((value, colIdx) => (
                  <td key={colIdx} className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {value}
                  </td>
                ))}
              </tr>
            ))}
    
            {currentData.length < itemsPerPage && Array.from({ length: itemsPerPage - currentData.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-[60px]">
                <td colSpan={columns.length}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showPagination && (
        <PaginationFooter 
          isDark={isDark} 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}
    </div>
  );
};

// STAT CARD COMPONENT
const StatCard = ({ title, value, trend, isDark, icon: Icon, colorClass }) => (
  <div className="group relative bg-white/70 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/50 dark:border-[#1a4a40]/60 rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-gray-200/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-500 overflow-hidden cursor-pointer">
    <div className={`absolute top-0 right-0 w-32 h-32 ${colorClass || 'bg-blue-500/10 dark:bg-[#cddfa0]/5'} rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    <div className="flex justify-between items-start mb-6 relative z-10">
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[1.2rem] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1a4a40] dark:to-[#0f2e28] flex items-center justify-center border border-white dark:border-[#1a4a40] shadow-sm group-hover:rotate-6 transition-transform duration-300">
        {Icon && <Icon size={20} className={isDark ? "text-[#cddfa0]" : "text-blue-600"} />}
      </div>
    </div>
    <p className="text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-2 relative z-10">{title}</p>
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10 group-hover:scale-[1.02] origin-left transition-transform duration-300 truncate">{value}</h3>
    <div className="flex flex-wrap items-center gap-2 mt-3 relative z-10">
      <span className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider whitespace-nowrap ${
        trend.includes('Down') || trend.includes('↓') 
          ? 'bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400' 
          : 'bg-emerald-50 text-emerald-600 dark:bg-[#cddfa0]/10 dark:text-[#cddfa0]'
      }`}>
        {trend}
      </span>
      <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 whitespace-nowrap">vs last period</span>
    </div>
  </div>
);

// CHART CARD COMPONENT
const ChartCard = ({ title, children, isDark, icon: Icon }) => (
  <div className="bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] p-5 sm:p-8 shadow-xl shadow-gray-200/40 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col relative overflow-hidden h-full group w-full">
    <div className="absolute -top-20 -left-20 w-60 h-60 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-[#cddfa0]/5 dark:to-transparent rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>
    <div className="flex items-center justify-between mb-6 sm:mb-8 relative z-10">
      <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2">
        {Icon && <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#1a4a40] text-gray-600 dark:text-gray-300 hidden sm:block"><Icon size={14} /></div>} 
        {title}
      </h3>
    </div>
    <div className="flex-1 relative z-10 w-full min-h-[250px] sm:min-h-[280px] flex items-center justify-center">
      {children}
    </div>
  </div>
);

// WATER WAVE GAUGE COMPONENT (For Bottom Box)
const WaveGauge = ({ value, label, isDark }) => (
  <div className="relative w-48 h-48 sm:w-60 sm:h-60 mx-auto rounded-full border-[6px] shadow-inner overflow-hidden flex items-center justify-center bg-white dark:bg-[#091a16] border-gray-100 dark:border-[#1a4a40]">
    <div className="absolute w-[200%] h-[200%] -ml-[50%] animate-wave-slow opacity-40 transition-all duration-1000"
         style={{
           top: `${100 - value}%`,
           borderRadius: '45%',
           background: isDark ? 'linear-gradient(to bottom, #aebf85, #1a4a40)' : 'linear-gradient(to bottom, #60a5fa, #3b82f6)'
         }}></div>
    <div className="absolute w-[200%] h-[200%] -ml-[50%] animate-wave opacity-80 transition-all duration-1000"
         style={{
           top: `${100 - value + 3}%`,
           borderRadius: '40%',
           background: isDark ? 'linear-gradient(to bottom, #cddfa0, #8b9c65)' : 'linear-gradient(to bottom, #3b82f6, #8b5cf6)'
         }}></div>
    
    <div className="relative z-10 flex flex-col items-center justify-center drop-shadow-md">
      <span className={`font-black text-4xl sm:text-5xl tracking-tighter ${value > 40 ? 'text-white dark:text-[#091a16]' : (isDark ? 'text-[#cddfa0]' : 'text-gray-900')}`}>
        {value}%
      </span>
      <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 text-center ${value > 40 ? 'text-white/80 dark:text-[#091a16]/80' : (isDark ? 'text-gray-400' : 'text-gray-500')}`}>
        {label}
      </span>
    </div>
  </div>
);

// NEW SMOOTH RADIAL WAVE GAUGE COMPONENT
const RadialWaveGauge = ({ value, label, isDark }) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let animationFrameId;
    const animate = () => {
      setOffset((prev) => (prev + 0.8) % 100); 
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const radius = 100; 
  const strokeWidth = 24; 
  const center = 130; 
  
  const generateWavyPath = (cx, cy, r, progressPct, waveOffset) => {
    if (progressPct === 0) return "";
    
    const points = [];
    const numPoints = 180; 
    const waveAmplitude = 3.5; 
    const waveFrequency = 4; 

    const startAngle = -Math.PI / 2; 
    const totalAngle = (progressPct / 100) * 2 * Math.PI;

    for (let i = 0; i <= numPoints; i++) {
      const angleProgress = i / numPoints;
      
      if (angleProgress * 100 > progressPct && progressPct !== 100) continue;

      const angle = startAngle + angleProgress * totalAngle;
      const wavePhase = (angle * waveFrequency) - (waveOffset / 100 * Math.PI * 2);
      
      let currentAmplitude = waveAmplitude;
      if (progressPct < 100) {
        const edgeDist = Math.min(angleProgress, 1 - angleProgress);
        currentAmplitude = waveAmplitude * Math.min(1, edgeDist * 20); 
      }

      const currentRadius = r + Math.sin(wavePhase) * currentAmplitude;
      const x = cx + currentRadius * Math.cos(angle);
      const y = cy + currentRadius * Math.sin(angle);
      
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  };

  const wavyPathD = generateWavyPath(center, center, radius, value, offset);

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full max-w-[320px] mx-auto p-4">
      <div className="relative w-full aspect-square flex items-center justify-center max-w-[280px]">
        <svg className="absolute inset-0 w-full h-full drop-shadow-xl" viewBox="0 0 260 260" preserveAspectRatio="xMidYMid meet">
          
          <circle 
            cx={center} cy={center} r={radius} 
            stroke="currentColor" 
            strokeWidth={strokeWidth} 
            fill="transparent" 
            className={isDark ? "text-[#1a4a40]" : "text-blue-50"} 
          />
          
          {value > 0 && (
            <path
              d={wavyPathD}
              fill="transparent"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className={isDark ? "text-[#cddfa0]" : "text-blue-500"}
              style={{
                transition: 'stroke-dasharray 1s ease-out',
              }}
            />
          )}
        </svg>
        
        {/* Adjusted Text Size Here */}
        <div className="absolute flex flex-col items-center justify-center z-10 pointer-events-none">
          <span className={`font-black text-4xl sm:text-5xl md:text-6xl tracking-tighter ${isDark ? "text-white" : "text-gray-900"}`}>
            {value}%
          </span>
          <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest mt-1 sm:mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};


// MAIN DASHBOARD COMPONENT
export default function Analytics() {
  const [data, setData] = useState(null);
  const themeContext = useTheme();
  const isDark = themeContext ? themeContext.isDark : false;

  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [pieColorOffset, setPieColorOffset] = useState(0);
  const [localListings, setLocalListings] = useState([]);
  
  // Tasks state
  const [localTasks, setLocalTasks] = useState([]);

  // Modals state
  const [showListingModal, setShowListingModal] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const savedDateRange = localStorage.getItem('dashboard_dateRange');
    if (savedDateRange) {
      setDateRange(savedDateRange);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return; 
    localStorage.setItem('dashboard_dateRange', dateRange);

    setData(null); 
    setTimeout(() => {
      const dynamicData = simulateDynamicData(analyticsData, dateRange);
      setData(dynamicData);

      const savedStatuses = JSON.parse(localStorage.getItem('dashboard_listing_statuses') || '{}');
      const restoredListings = (dynamicData.underperformingListings || []).map(item => ({
        ...item,
        status: savedStatuses[item.id] || item.status
      }));

      // Set Tasks with a default 'Pending' status if not exists
      const tasksWithStatus = (dynamicData.upcomingTasks || []).map(task => ({
        ...task,
        status: task.status || 'Pending'
      }));

      setLocalListings(restoredListings); 
      setLocalTasks(tasksWithStatus);
      setPieColorOffset(prev => (prev + 1) % 4);
    }, 600);
  }, [dateRange, isInitialized]);

  // PDF EXPORT
  const handleExport = () => {
    if (isExporting || exportSuccess || !data) return;
    
    setIsExporting(true);
    showActionMessage("Generating PDF, please wait...");
    
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Analytics Dashboard Report", 14, 22);
      
      doc.setFontSize(10);
      doc.text(`Date Range: ${dateRange} | Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

      let currentY = 40;

      if (data.agentPerformance && data.agentPerformance.length > 0) {
        doc.setFontSize(12);
        doc.text("Agent Leaderboard", 14, currentY);
        
        const agentRows = data.agentPerformance.map(agent => [
          agent.name, 
          `${agent.rating} STAR`, 
          agent.conversionRate, 
          agent.avgCommissionEarned
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Agent Name', 'Rating', 'Conversion', 'Commission']],
          body: agentRows,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: isDark ? [26, 74, 64] : [37, 99, 235] },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      }

      if (localListings && localListings.length > 0) {
        if (currentY > 250) { doc.addPage(); currentY = 20; }
        
        doc.setFontSize(12);
        doc.text("Property Listings", 14, currentY);
        
        const listingRows = localListings.map(listing => [
          listing.agentName, 
          listing.listed, 
          listing.status
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Agent Name', 'Property Info', 'Status']],
          body: listingRows,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: isDark ? [26, 74, 64] : [37, 99, 235] },
        });
        currentY = doc.lastAutoTable.finalY + 15;
      }

      if (data.newHighValueLeads && data.newHighValueLeads.length > 0) {
        if (currentY > 250) { doc.addPage(); currentY = 20; }
        
        doc.setFontSize(12);
        doc.text("New High-Value Leads", 14, currentY);
        
        const leadRows = data.newHighValueLeads.map(lead => [
          lead.agentName, 
          `${lead.leads} Proj.`, 
          lead.value
        ]);

        autoTable(doc, {
          startY: currentY + 5,
          head: [['Client Name', 'Leads', 'Est. Value']],
          body: leadRows,
          theme: 'grid',
          styles: { fontSize: 8, cellPadding: 2 },
          headStyles: { fillColor: isDark ? [26, 74, 64] : [37, 99, 235] },
        });
      }

      doc.save(`Analytics_Report_${dateRange.replace(/\s+/g, '_')}.pdf`);
      
      setExportSuccess(true);
      showActionMessage("Report successfully exported to PDF!");
    } catch (error) {
      console.error("PDF Export failed", error);
      showActionMessage("Failed to export PDF. Ensure jspdf-autotable is installed.");
    } finally {
      setIsExporting(false);
      setTimeout(() => setExportSuccess(false), 3000);
    }
  };

  const showActionMessage = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedListings = localListings.map(item => {
      if(item.id === id) return { ...item, status: newStatus };
      return item;
    });
    setLocalListings(updatedListings);
   
    const savedStatuses = JSON.parse(localStorage.getItem('dashboard_listing_statuses') || '{}');
    savedStatuses[id] = newStatus;
    localStorage.setItem('dashboard_listing_statuses', JSON.stringify(savedStatuses));
    
    showActionMessage(`Listing status updated to ${newStatus}`);
  };

  const handleTaskStatusChange = (id, newStatus) => {
    setLocalTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
    showActionMessage(`Task status updated to ${newStatus}`);
  };

  // Submit Handlers 
  const submitNewListing = (e) => {
    e.preventDefault();
    
    // 1. Add to Active Property Listings Table
    const newListing = {
      id: Date.now(),
      agentName: 'You', 
      listed: e.target.propertyName.value,
      status: 'Reviewing',
      imgUrl: e.target.imgUrl.value,
      price: e.target.price.value
    };
    setLocalListings(prev => [newListing, ...prev]);

    // 2. Add to Activity Feed
    const newAct = {
      id: Date.now(),
      type: 'Sale',
      message: `New listing: ${e.target.propertyName.value}`,
      time: 'Just now',
      amount: `+$${e.target.price.value}`
    };
    setData(prev => ({...prev, recentActivities: [newAct, ...prev.recentActivities]}));
    
    setShowListingModal(false);
    showActionMessage("New Listing created & added to feed!");
  };

  const submitNewMeeting = (e) => {
    e.preventDefault();
    
    // 1. Add to Upcoming Tasks
    const newTask = {
      id: Date.now(),
      task: `Meeting with ${e.target.clientName.value}`,
      time: e.target.time.value,
      priority: e.target.priority.value,
      status: 'Pending',
      color: e.target.priority.value === 'High' ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-blue-500 bg-blue-50 dark:bg-blue-500/10'
    };
    setLocalTasks(prev => [newTask, ...prev]);

    // 2. Add to Activity Feed
    const newAct = {
      id: Date.now(),
      type: 'Meeting',
      message: `Meeting Scheduled: ${e.target.clientName.value}`,
      time: 'Just now',
      amount: 'Pending'
    };
    setData(prev => ({...prev, recentActivities: [newAct, ...prev.recentActivities]}));

    setShowMeetingModal(false);
    showActionMessage("Meeting Scheduled & added to tasks!");
  };

  if (!data) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 ${isDark ? 'bg-[#091a16]' : 'bg-[#f4f7f6]'}`}>
        <div className="relative flex justify-center items-center w-24 h-24">
          <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${isDark ? 'bg-[#cddfa0]' : 'bg-blue-400'}`}></div>
          <div className={`absolute inset-2 rounded-full animate-pulse ${isDark ? 'bg-[#94a894]' : 'bg-blue-300'}`}></div>
          <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-xl ${isDark ? 'bg-[#0f2e28] border border-[#1a4a40]' : 'bg-white border border-blue-50'}`}>
             <Activity className={`animate-bounce ${isDark ? "text-[#cddfa0]" : "text-blue-600"}`} size={28} />
          </div>
        </div>
        <p className="mt-8 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-500 animate-pulse">Loading Analytics Data...</p>
      </div>
    );
  }

  const gridColor = isDark ? "#1a4a40" : "#e5e7eb";
  const textColor = isDark ? "#64748b" : "#94a3b8"; 
  const baseColors = { primary: isDark ? '#cddfa0' : '#3b82f6', secondary: isDark ? '#94a894' : '#10b981', tertiary: isDark ? '#8b9c65' : '#8b5cf6', quaternary: isDark ? '#1a4a40' : '#f59e0b' };
  const pieColorsArray = [baseColors.primary, baseColors.secondary, baseColors.tertiary, baseColors.quaternary];
  const currentPieColors = [...pieColorsArray.slice(pieColorOffset), ...pieColorsArray.slice(0, pieColorOffset)];

  return (
    <div className={`p-3 sm:p-4 md:p-6 lg:p-8 min-h-screen transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#091a16] text-gray-100' : 'bg-[#f4f7f6] text-gray-900'}`}>
      
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5">
          <div className={`px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-xs sm:text-sm tracking-wide border ${isDark ? 'bg-[#1a4a40] text-[#cddfa0] border-[#2d6a5c]' : 'bg-white text-emerald-600 border-emerald-100'}`}>
            <Check size={16} /> {actionMessage}
          </div>
        </div>
      )}

      {/* NEW LISTING MODAL - Fixed z-index */}
      {showListingModal && (
        <div data-html2canvas-ignore="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 relative z-[10000] ${isDark ? 'bg-[#0f2e28] border border-[#1a4a40]' : 'bg-white border border-gray-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase tracking-widest">New Listing</h2>
              <button onClick={() => setShowListingModal(false)} className="p-2 bg-gray-100 dark:bg-[#1a4a40] rounded-full hover:scale-110 transition-transform"><X size={16}/></button>
            </div>
            <form onSubmit={submitNewListing} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Image URL</label>
                <input required type="url" name="imgUrl" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white focus:border-[#cddfa0]' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`} placeholder="https://example.com/image.jpg" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Property Name</label>
                <input required name="propertyName" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white focus:border-[#cddfa0]' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`} placeholder="e.g. Downtown Plaza Apt" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-500">Price ($)</label>
                <input required type="number" name="price" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white focus:border-[#cddfa0]' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`} placeholder="e.g. 500000" />
              </div>
              <button type="submit" className={`w-full py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-xs transition-transform hover:-translate-y-1 ${isDark ? 'bg-[#cddfa0] text-[#091a16]' : 'bg-blue-600 text-white'}`}>Create Listing</button>
            </form>
          </div>
        </div>
      )}

      {/* SCHEDULE MEETING MODAL - Fixed z-index */}
      {showMeetingModal && (
        <div data-html2canvas-ignore="true" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md p-6 sm:p-8 rounded-[2rem] shadow-2xl animate-in zoom-in-95 relative z-[10000] ${isDark ? 'bg-[#0f2e28] border border-[#1a4a40]' : 'bg-white border border-gray-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-black uppercase tracking-widest">Schedule Meeting</h2>
              <button onClick={() => setShowMeetingModal(false)} className="p-2 bg-gray-100 dark:bg-[#1a4a40] rounded-full hover:scale-110 transition-transform"><X size={16}/></button>
            </div>
            <form onSubmit={submitNewMeeting} className="space-y-4">
              <div><label className="text-[10px] font-bold uppercase text-gray-500">Client Name</label><input required name="clientName" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white focus:border-[#cddfa0]' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`} placeholder="e.g. John Doe" /></div>
              <div><label className="text-[10px] font-bold uppercase text-gray-500">Time</label><input required name="time" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white focus:border-[#cddfa0]' : 'bg-gray-50 border-gray-200 focus:border-blue-500'}`} placeholder="e.g. Tomorrow, 10:00 AM" /></div>
              <div><label className="text-[10px] font-bold uppercase text-gray-500">Priority</label>
                <select name="priority" className={`w-full mt-1 p-3 rounded-xl border outline-none font-bold text-sm ${isDark ? 'bg-[#1a4a40]/50 border-[#1a4a40] text-white' : 'bg-gray-50 border-gray-200'}`}>
                  <option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option>
                </select>
              </div>
              <button type="submit" className={`w-full py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-xs transition-transform hover:-translate-y-1 ${isDark ? 'bg-[#cddfa0] text-[#091a16]' : 'bg-blue-600 text-white'}`}>Schedule</button>
            </form>
          </div>
        </div>
      )}

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-[#cddfa0]/5 dark:to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tl from-purple-500/5 to-transparent dark:from-[#1a4a40]/30 dark:to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-gray-200/60 dark:border-[#1a4a40]/50">
          <div className="w-full lg:w-auto">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/60 dark:bg-[#133c34]/60 backdrop-blur-md border border-gray-200/50 dark:border-[#1a4a40] mb-4 sm:mb-5 shadow-sm">
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-[#cddfa0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-blue-500 dark:bg-[#aebf85]"></span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-600 dark:text-gray-300">Live Analytics Node</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-1.5 sm:mb-2">
              Analytics <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65]">Overview</span>
            </h1>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">Real-time insights and data metrics</p>
            
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-[#cddfa0]/10 dark:text-[#cddfa0] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Check size={12} /> System Optimal</span>
              <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"><Activity size={12} /> Live Updates On</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full lg:w-auto mt-4 lg:mt-0 relative z-50">
            <div className="relative w-full sm:w-auto">
              <button 
                onClick={() => setIsDateMenuOpen(!isDateMenuOpen)}
                className="flex items-center justify-between w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-3.5 bg-white/80 dark:bg-[#133c34]/80 backdrop-blur-md border border-gray-200/80 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a4a40] transition-colors shadow-sm gap-3"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={14} className={`sm:w-4 sm:h-4 ${isDark ? "text-[#cddfa0]" : "text-blue-500"}`} />
                  <span className="uppercase tracking-widest">{dateRange}</span>
                </div>
                <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isDateMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isDateMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsDateMenuOpen(false)}></div>
                  <div className={`absolute top-full right-0 mt-2 w-full sm:w-48 rounded-xl sm:rounded-2xl border shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 ${
                    isDark ? 'bg-[#0a2e26] border-[#1a4a40]' : 'bg-white border-gray-100'
                  }`}>
                    {['Today', 'Last 7 Days', 'Last 30 Days', 'This Year', 'All Time'].map((range) => (
                      <button
                        key={range}
                        onClick={() => { setDateRange(range); setIsDateMenuOpen(false); }}
                        className={`w-full text-left px-4 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${
                          dateRange === range 
                            ? (isDark ? 'bg-[#1a4a40] text-[#cddfa0]' : 'bg-blue-50 text-blue-600') 
                            : (isDark ? 'text-gray-300 hover:bg-[#133c34]' : 'text-gray-600 hover:bg-gray-50')
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={handleExport} disabled={isExporting || exportSuccess}
              className={`group relative overflow-hidden flex items-center justify-center w-full sm:w-auto gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-black transition-all duration-300 shadow-lg ${
                exportSuccess ? 'bg-emerald-500 text-white shadow-emerald-500/30' : `bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] shadow-blue-500/25 dark:shadow-[#cddfa0]/20 ${!isExporting && 'hover:-translate-y-1'}`
              }`}
            >
              {!exportSuccess && <div className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] z-0"></div>}
              {isExporting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-[#091a16]/30 dark:border-t-[#091a16] rounded-full animate-spin relative z-10"></div> : exportSuccess ? <Check size={14} className="relative z-10 sm:w-4 sm:h-4" /> : <Download size={14} className="relative z-10 sm:w-4 sm:h-4" />}
              <span className="relative z-10 text-[10px] sm:text-xs uppercase tracking-widest">{isExporting ? 'Exporting PDF...' : exportSuccess ? 'Exported!' : 'Export Report'}</span>
            </button>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10">
          <button onClick={() => setShowListingModal(true)} className={`flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:-translate-y-0.5 w-full sm:w-auto ${isDark ? 'bg-[#1a4a40]/60 text-[#cddfa0] border border-[#2d6a5c]/50 hover:bg-[#1a4a40]' : 'bg-white text-blue-600 border border-blue-100 hover:bg-blue-50 hover:shadow-md'}`}>
            <Plus size={16} /> New Listing
          </button>
          <button onClick={() => setShowMeetingModal(true)} className={`flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:-translate-y-0.5 w-full sm:w-auto ${isDark ? 'bg-[#1a4a40]/60 text-gray-300 border border-[#1a4a40] hover:bg-[#1a4a40] hover:text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'}`}>
            <Phone size={16} /> Schedule Meeting
          </button>
          <button onClick={handleExport} className={`flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:-translate-y-0.5 w-full sm:w-auto ${isDark ? 'bg-[#1a4a40]/60 text-gray-300 border border-[#1a4a40] hover:bg-[#1a4a40] hover:text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md'}`}>
            <FileText size={16} /> Generate Report
          </button>
        </div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-10">
          <StatCard title="Market Valuation" value={data?.marketValuation?.value || '$0M'} trend={data?.marketValuation?.trend || ''} isDark={isDark} icon={DollarSign} colorClass="bg-blue-500/10 dark:bg-[#cddfa0]/5" />
          <StatCard title="Conversion Rate" value={data?.listingConversionRate?.value || '0%'} trend={data?.listingConversionRate?.trend || ''} isDark={isDark} icon={Target} colorClass="bg-emerald-500/10 dark:bg-[#94a894]/10" />
          <StatCard title="Avg Days on Market" value={dateRange === 'Today' ? '12' : '39'} trend={dateRange === 'Today' ? 'Down by 12%' : 'Down by 5%'} isDark={isDark} icon={Activity} colorClass="bg-amber-500/10 dark:bg-[#1a4a40]/20" />
          <StatCard title="Sales Velocity" value="↑ 12%" trend="Up by 12%" isDark={isDark} icon={TrendingUp} colorClass="bg-purple-500/10 dark:bg-[#0f2e28]/40" />
        </div>

        {/* First Row Charts & Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-10 w-full">
          <div className="lg:col-span-2 w-full">
            <ChartCard title="Sales by Property Type & Region" isDark={isDark} icon={BarChart2}>
              <ResponsiveContainer width="100%" height="100%" minHeight={280}>
                <AreaChart key={dateRange} data={data?.salesByPropertyType || []} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={baseColors.tertiary} stopOpacity={0.5}/><stop offset="95%" stopColor={baseColors.tertiary} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorVilla" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={baseColors.primary} stopOpacity={0.5}/><stop offset="95%" stopColor={baseColors.primary} stopOpacity={0}/>
                    </linearGradient>
                    <filter id="shadowArea" height="200%"><feDropShadow dx="0" dy="4" stdDeviation="4" floodColor={baseColors.primary} floodOpacity="0.2"/></filter>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} opacity={0.4} />
                  <XAxis dataKey="region" stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dy={10} />
                  <YAxis stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dx={-10} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ stroke: isDark ? '#1a4a40' : '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} iconType="circle" />
                  <Area type="monotone" dataKey="Apartment" stroke={baseColors.tertiary} strokeWidth={4} fillOpacity={1} fill="url(#colorApt)" activeDot={{ r: 6, strokeWidth: 0 }} />
                  <Area type="monotone" dataKey="Villa" stroke={baseColors.primary} strokeWidth={4} fillOpacity={1} fill="url(#colorVilla)" activeDot={{ r: 6, strokeWidth: 0 }} filter="url(#shadowArea)" />
                  <Area type="monotone" dataKey="Commercial" stroke={baseColors.secondary} strokeWidth={2} fillOpacity={0.05} fill={baseColors.secondary} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="h-[380px] sm:h-[420px] lg:h-[450px] flex flex-col w-full">
            <TableCard
              title="Agent Leaderboard"
              isDark={isDark}
              showPagination={true}
              itemsPerPage={6}
              columns={['Profile', 'Conv.', 'Comm.']}
              data={(data?.agentPerformance || []).map(agent => ({
                agent: (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${agent.name}&background=random&bold=true`} alt={agent.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-white dark:border-[#1a4a40] shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-[10px] sm:text-[11px] truncate">{agent.name}</p>
                      <p className="text-[8px] sm:text-[9px] text-amber-500 font-black tracking-widest">{agent.rating} STAR</p>
                    </div>
                  </div>
                ),
                conv: <span className="inline-flex items-center px-1.5 sm:px-2.5 py-1 rounded-md text-[9px] sm:text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-[#cddfa0]">{agent.conversionRate}</span>,
                earned: <span className="font-black tracking-tight text-[10px] sm:text-xs whitespace-nowrap">{agent.avgCommissionEarned}</span>,
              }))}
            />
          </div>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 sm:mb-10 w-full">
          <ChartCard title="Market Trends Analysis" isDark={isDark} icon={TrendingUp}>
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <LineChart key={dateRange} data={data?.marketTrends || []} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <filter id="glowLine" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} opacity={0.4} />
                <XAxis dataKey="month" stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dy={10} />
                <YAxis stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dx={-10} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ stroke: isDark ? '#1a4a40' : '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                <Line type="monotone" dataKey="avgPrice" stroke={baseColors.primary} strokeWidth={5} dot={{ fill: isDark ? '#091a16' : '#fff', stroke: baseColors.primary, strokeWidth: 3, r: 5 }} activeDot={{ r: 8, fill: baseColors.primary, stroke: isDark ? '#fff' : '#091a16', strokeWidth: 2 }} filter="url(#glowLine)" />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Lead Source Conversion Funnel" isDark={isDark} icon={Target}>
            <div className="w-full h-full flex flex-col justify-center space-y-4 sm:space-y-5 pt-2 sm:pt-4">
              {[
                { label: 'Initial Contact', value: 1000 * (dateRange==='Today'?0.2:1), percent: 100, color: isDark ? '#cddfa0' : '#3b82f6' },
                { label: 'Qualified', value: 750 * (dateRange==='Today'?0.2:1), percent: 75, color: isDark ? '#aebf85' : '#6366f1' },
                { label: 'Showing Scheduled', value: 550 * (dateRange==='Today'?0.2:1), percent: 55, color: isDark ? '#94a894' : '#8b5cf6' },
                { label: 'Offer Made', value: 380 * (dateRange==='Today'?0.2:1), percent: 38, color: isDark ? '#1a4a40' : '#10b981' },
                { label: 'Closed', value: 200 * (dateRange==='Today'?0.2:1), percent: 20, color: isDark ? '#0f2e28' : '#f59e0b' }
              ].map((item, idx) => (
                <div key={idx} className="group cursor-pointer w-full">
                  <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors truncate pr-2">{item.label}</span>
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <span className="text-[10px] sm:text-xs font-bold text-gray-500">{Math.round(item.value)} <span className="hidden sm:inline">Leads</span></span>
                      <span className="text-[10px] sm:text-xs font-black text-gray-900 dark:text-white bg-gray-100 dark:bg-[#1a4a40]/50 px-1.5 sm:px-2 py-0.5 rounded-md">{item.percent}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 sm:h-3 rounded-full overflow-hidden bg-gray-100 dark:bg-[#1a4a40]/40">
                    <div className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" style={{ width: `${item.percent}%`, backgroundColor: item.color }}>
                      <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Feature Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-10 w-full">
          
          {/* Large Wave Line Gauge - SMOOTH AND BEAUTIFUL WAVES */}
          <ChartCard title="Monthly Revenue Target" isDark={isDark} icon={Target}>
             <RadialWaveGauge value={data?.revenueTarget?.[0]?.value || 0} label="Goal Reached" isDark={isDark} />
          </ChartCard>

          <div className="lg:col-span-2 w-full">
            <ChartCard title="Live Activity Feed" isDark={isDark} icon={Activity}>
              <div className="w-full h-full flex flex-col justify-center space-y-3 pt-2">
                {(data?.recentActivities || []).map(act => (
                  <div key={act.id} className={`flex justify-between items-center p-3 sm:p-4 rounded-xl transition-colors w-full ${isDark ? 'bg-[#0f2e28]/60 hover:bg-[#1a4a40]/80 border border-[#1a4a40]/40' : 'bg-gray-50 hover:bg-gray-100 border border-gray-100'}`}>
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0 mr-3">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${act.type === 'Sale' ? (isDark ? 'bg-[#cddfa0]/20 text-[#cddfa0]' : 'bg-emerald-100 text-emerald-600') : act.type === 'Lead' ? (isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600') : (isDark ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600')}`}>
                        {act.type === 'Sale' ? <DollarSign size={16} /> : act.type === 'Lead' ? <Target size={16} /> : act.type === 'Meeting' ? <Phone size={16} /> : <Activity size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] sm:text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{act.message}</p>
                        <p className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{act.time}</p>
                      </div>
                    </div>
                    {/* Fixed size badge for Amount / Action Needed / Pending */}
                    <span className={`text-[10px] sm:text-xs font-black px-2 py-2 rounded-md whitespace-nowrap text-center w-[90px] sm:w-[110px] shrink-0 ${act.amount.includes('+') ? (isDark ? 'bg-[#cddfa0]/10 text-[#cddfa0]' : 'bg-emerald-50 text-emerald-600') : (isDark ? 'bg-[#1a4a40] text-gray-300' : 'bg-gray-100 text-gray-600')}`}>{act.amount}</span>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
          
        </div>

        {/* Feature Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 sm:mb-10 w-full">
          
          <ChartCard title="Client Satisfaction Score" isDark={isDark} icon={Star}>
             <div className="w-full h-full flex items-center justify-center py-4">
                <WaveGauge value={data?.satisfactionScore?.[0]?.value || 0} label="Highly Satisfied" isDark={isDark} />
             </div>
          </ChartCard>

          <div className="lg:col-span-2 w-full">
            <ChartCard title="Upcoming Tasks" isDark={isDark} icon={ListTodo}>
              <div className="w-full h-full flex flex-col justify-center space-y-3 pt-2">
                {localTasks.map(task => (
                  <div key={task.id} className={`flex justify-between items-center p-3 sm:p-4 rounded-xl border w-full ${isDark ? 'bg-[#0f2e28]/40 border-[#1a4a40]' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${task.priority === 'High' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] sm:text-xs font-bold truncate ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{task.task}</p>
                        <p className={`text-[9px] sm:text-[10px] font-semibold mt-0.5 truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{task.time}</p>
                      </div>
                    </div>
                    {/* Status Select with Priority Label */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[8px] sm:text-[9px] font-black px-2 py-1.5 rounded-md uppercase tracking-widest text-center hidden sm:block ${task.color}`}>{task.priority}</span>
                      <select 
                        value={task.status}
                        onChange={(e) => handleTaskStatusChange(task.id, e.target.value)}
                        className={`text-[8px] sm:text-[9px] font-black uppercase px-2 py-1.5 rounded-md border outline-none cursor-pointer appearance-none transition-colors ${
                          task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                          task.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                          'bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#1a4a40] dark:text-gray-300 dark:border-[#2d6a5c]'
                        }`}
                      >
                        <option value="Pending" className="bg-white text-gray-900">Pending</option>
                        <option value="In Progress" className="bg-white text-gray-900">In Progress</option>
                        <option value="Completed" className="bg-white text-gray-900">Completed</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>
          </div>
        </div>

        {/* Third Row Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 sm:mb-10 w-full">
          <ChartCard title="Inventory Levels" isDark={isDark} icon={Activity}>
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <BarChart key={dateRange} data={data?.inventoryLevels || []} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} opacity={0.4} />
                <XAxis dataKey="month" stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dy={10} />
                <YAxis stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dx={-10} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ fill: isDark ? '#1a4a40' : '#f1f5f9', opacity: 0.5 }} />
                <Bar dataKey="inventory" fill={baseColors.secondary} radius={[8, 8, 8, 8]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Transaction Volume" isDark={isDark} icon={DollarSign}>
            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
              <AreaChart key={dateRange} data={data?.transactionVolume || []} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={baseColors.quaternary} stopOpacity={0.5}/>
                    <stop offset="95%" stopColor={baseColors.quaternary} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={gridColor} vertical={false} opacity={0.4} />
                <XAxis dataKey="month" stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dy={10} />
                <YAxis stroke={textColor} axisLine={false} tickLine={false} style={{ fontSize: '9px', fontWeight: 'bold' }} dx={-10} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} cursor={{ stroke: isDark ? '#1a4a40' : '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="volume" stroke={baseColors.quaternary} strokeWidth={4} fillOpacity={1} fill="url(#colorVol)" activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="md:col-span-2 lg:col-span-1">
            <ChartCard title="Market Share Overview" isDark={isDark} icon={PieIcon}>
              <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                <PieChart key={dateRange}>
                  <Pie data={data?.marketShare || []} cx="50%" cy="50%" innerRadius="60%" outerRadius="85%" paddingAngle={6} dataKey="value" stroke="none" cornerRadius={8}>
                    {(data?.marketShare || []).map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={currentPieColors[index % currentPieColors.length]} className="hover:opacity-80 transition-all duration-300 cursor-pointer outline-none hover:scale-105 origin-center" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'black', paddingTop: '10px' }} iconType="circle" />
                  <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className={`font-black text-xl sm:text-2xl ${isDark ? 'fill-white' : 'fill-gray-900'}`}>100%</text>
                  <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle" className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest ${isDark ? 'fill-gray-400' : 'fill-gray-500'}`}>Total Market</text>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* Bottom Section Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10 w-full">
          <div className="h-[360px] sm:h-[400px] flex flex-col w-full">
             <TableCard
              title="Active Property Listings" 
              isDark={isDark}
              showPagination={true}
              itemsPerPage={5}
              columns={['Agent', 'Property', 'Action']}
              data={localListings.map((listing) => ({
                name: (
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Render Image if exists */}
                    {listing.imgUrl ? (
                      <img src={listing.imgUrl} alt="Listing" className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl object-cover shrink-0 border border-gray-200 dark:border-[#1a4a40]" />
                    ) : (
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl bg-gray-100 dark:bg-[#1a4a40] flex items-center justify-center font-black text-[9px] sm:text-[10px] shrink-0">{listing?.agentName?.charAt(0) || 'A'}</div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none">{listing.agentName}</span>
                      {listing.price && <span className="text-[8px] sm:text-[9px] font-black text-emerald-500 dark:text-[#cddfa0]">${listing.price}</span>}
                    </div>
                  </div>
                ),
                listed: <span className="font-medium text-gray-500 text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none block">{listing.listed}</span>,
             
                status: (
                  <select 
                    value={listing.status}
                    onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                    className={`inline-flex items-center text-[8px] sm:text-[9px] font-black uppercase tracking-wider sm:tracking-widest px-2 sm:px-2.5 py-1.5 rounded-md border outline-none cursor-pointer transition-colors appearance-none ${
                      listing.status === 'Resolved' ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20' :
                      listing.status === 'Reviewing' ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20' :
                      'text-rose-500 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20'
                    }`}
                  >
                    <option value="At Risk" className="text-gray-900 bg-white">At Risk</option>
                    <option value="Reviewing" className="text-gray-900 bg-white">Reviewing</option>
                    <option value="Resolved" className="text-gray-900 bg-white">Resolved</option>
                  </select>
                )
              }))}
            />
          </div>

          <div className="h-[360px] sm:h-[400px] flex flex-col w-full">
            <TableCard
              title="New High-Value Leads"
              isDark={isDark}
              showPagination={true}
              itemsPerPage={5}
              columns={['Client', 'Leads', 'Est. Value']}
              data={(data?.newHighValueLeads || []).map(lead => ({
                name: (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${lead?.agentName?.replace(/ /g, "+") || 'User'}&background=random`} alt={lead.agentName} className="w-6 h-6 sm:w-8 sm:h-8 rounded-xl object-cover shrink-0" />
                    <span className="font-bold text-[10px] sm:text-xs truncate max-w-[80px] sm:max-w-none">{lead.agentName}</span>
                  </div>
                ),
                leads: <span className="inline-flex items-center text-[9px] sm:text-[10px] font-black bg-blue-50 text-blue-600 dark:bg-[#cddfa0]/10 dark:text-[#cddfa0] px-1.5 sm:px-2 py-1 rounded-md whitespace-nowrap">{lead.leads} Proj.</span>,
                value: <span className="font-black text-gray-900 dark:text-white tracking-tighter text-[10px] sm:text-xs">{lead.value}</span>
              }))}
            />
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes shine { 100% { transform: translateX(100%); } }
        /* ঢেউয়ের জন্য অ্যানিমেশন (Wave Animations) */
        @keyframes wave {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes wave-slow {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave { animation: wave 5s infinite linear; }
        .animate-wave-slow { animation: wave-slow 7s infinite linear; }

        .custom-scrollbar::-webkit-scrollbar { height: 4px; width: 4px; }
        @media (min-width: 640px) { .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; } }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: ${isDark ? '#1a4a40' : '#cbd5e1'}; border-radius: 10px; border: 2px solid ${isDark ? '#133c34' : 'transparent'}; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: ${isDark ? '#cddfa0' : '#94a3b8'}; }
      `}</style>
    </div>
  );
}