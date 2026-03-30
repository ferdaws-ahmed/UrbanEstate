import React, { useEffect, useState, useMemo } from 'react';
import { 
  Activity, Target, TrendingUp, DollarSign, Download, Users, BarChart2, PieChart as PieIcon, Check, Calendar, ChevronDown, Star, MessageSquare, Home, UserCheck, Building
} from 'lucide-react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// --- Reusable Components ---

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`px-4 py-3 rounded-xl border backdrop-blur-lg shadow-lg transition-all ${
        isDark ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-gray-200'
      }`}>
        <p className={`text-xs font-bold mb-2 pb-2 border-b ${isDark ? 'text-gray-400 border-slate-700' : 'text-gray-500 border-gray-200'}`}>{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 my-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
            <span className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{entry.name}:</span>
            <span className={`text-sm font-bold ml-auto ${isDark ? 'text-white' : 'text-gray-900'}`}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, icon: Icon, color, isDark }) => (
  <div className={`relative p-5 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl group overflow-hidden flex flex-col justify-between ${
    isDark 
      ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40 hover:border-[#cddfa0]/30 hover:shadow-2xl' 
      : 'bg-white/80 border-gray-200 shadow-gray-200/50 hover:shadow-2xl hover:border-blue-100'
  }`}>
    {/* Background Glow Effect */}
    <div className={`absolute -right-5 -top-5 w-24 h-24 rounded-full blur-3xl opacity-10 transition-all duration-700 group-hover:opacity-30 group-hover:scale-150 ${
      isDark ? 'bg-[#cddfa0]' : 'bg-blue-500'
    }`}></div>

    <div className="flex justify-between items-start relative z-10 gap-3 mb-4">
      {/* Icon Section */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-500 group-hover:scale-110 shadow-sm shrink-0 ${
        isDark 
          ? 'bg-[#133c34] border-[#1a4a40] text-emerald-400' 
          : 'bg-white border-gray-100 text-emerald-600'
      }`}>
        <Icon size={16} />
      </div>
    </div>

    {/* Content Section */}
    <div className="relative z-10 mt-auto">
      <div className="h-[28px] sm:h-[32px] flex items-end mb-1">
        <p className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] leading-snug w-full ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
      </div>
      <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-none ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </h3>
    </div>
  </div>
);

const ChartContainer = ({ title, children, isDark }) => (
  <div className={`relative p-6 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl ${
    isDark 
      ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40' 
      : 'bg-white/80 border-gray-200 shadow-gray-200/50'
  }`}>
    <h3 className={`text-sm font-black uppercase tracking-widest mb-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h3>
    <div style={{ height: '300px' }}>{children}</div>
  </div>
);

// --- Main Analytics Component ---

export default function Analytics() {
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all_time');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const timeRanges = {
    today: "Today",
    this_week: "This Week",
    this_month: "This Month",
    past_1_year: "Past 1 Year",
    all_time: "All Time",
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
        if (!response.ok) throw new Error('Failed to fetch analytics');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Analytics Error:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange]);

  const handleExport = () => {
    if (!data) return;
    const tid = toast.loading('Generating PDF Report...');
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("Urban Estate Analytics Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Time Range: ${timeRanges[timeRange]}`, 14, 28);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 34);

    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Users', (data.overview.totalUsers || 0).toLocaleString()],
        ['Total Sellers', (data.overview.totalSellers || 0).toLocaleString()],
        ['Total Properties', (data.overview.totalProperties || 0).toLocaleString()],
        ['Total Property Value', `$${(data.overview.totalPropertyValue || 0).toLocaleString()}`],
        ['Total Sales', (data.overview.totalSales || 0).toLocaleString()],
        ['Total Revenue', `$${(data.overview.totalRevenue || 0).toLocaleString()}`],
        ['Total Favorites', (data.overview.totalFavorites || 0).toLocaleString()],
        ['Total Comments', (data.overview.totalComments || 0).toLocaleString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save(`Analytics_Report_${timeRange}_${new Date().getTime()}.pdf`);
    toast.success('Report exported successfully!', { id: tid });
  };

  const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  if (isLoading || !data) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#091a16]' : 'bg-[#f4f7f6]'}`}>
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="w-full">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-800'}`}>Analytics Dashboard</h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>Comprehensive insights into your platform.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${isDark ? 'bg-[#0f2d27]/50 border-[#1a4a40] hover:bg-[#1a4a40]' : 'bg-white border-gray-200/80 hover:bg-gray-100'}`}>
                <Calendar size={16} />
                {timeRanges[timeRange]}
                <ChevronDown size={16} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMenuOpen && (
                <div className={`absolute top-full right-0 mt-2 w-48 border rounded-lg shadow-lg z-10 ${isDark ? 'bg-[#0f2d27] border-[#1a4a40]' : 'bg-white border-gray-200'}`}>
                  {Object.entries(timeRanges).map(([key, value]) => (
                    <button key={key} onClick={() => { setTimeRange(key); setIsMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm ${isDark ? 'hover:bg-[#1a4a40]' : 'hover:bg-gray-100'}`}>
                      {value}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors">
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-6">
          <StatCard title="Total Users" value={(data.overview.totalUsers || 0).toLocaleString()} icon={Users} color="#3B82F6" isDark={isDark} />
          <StatCard title="Total Sellers" value={(data.overview.totalSellers || 0).toLocaleString()} icon={UserCheck} color="#10B981" isDark={isDark} />
          <StatCard title="Total Properties" value={(data.overview.totalProperties || 0).toLocaleString()} icon={Home} color="#8B5CF6" isDark={isDark} />
          <StatCard title="Total Property Value" value={`$${((data.overview.totalPropertyValue || 0) / 1_000_000).toFixed(2)}M`} icon={Building} color="#F59E0B" isDark={isDark} />
          <StatCard title="Total Sales" value={(data.overview.totalSales || 0).toLocaleString()} icon={Check} color="#EC4899" isDark={isDark} />
          <StatCard title="Total Revenue" value={`$${((data.overview.totalRevenue || 0) / 1_000_000).toFixed(2)}M`} icon={DollarSign} color="#EF4444" isDark={isDark} />
        </div>

        {/* User & Engagement Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartContainer title="New User Signups" isDark={isDark}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends.userGrowth} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area type="monotone" dataKey="count" name="New Users" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          <ChartContainer title="Favorites Added Over Time" isDark={isDark}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends.favoritesTrend} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                <YAxis stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
                <Area type="monotone" dataKey="count" name="Favorites" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        {/* Property Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <ChartContainer title="Property Status Distribution" isDark={isDark}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.propertyAnalysis.statusDistribution} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                  <XAxis type="number" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                  <YAxis type="category" dataKey="name" stroke={isDark ? '#9ca3af' : '#6b7280'} fontSize={12} />
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                  <Bar dataKey="value" name="Count" fill="#10B981" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div>
            <ChartContainer title="Property Type Distribution" isDark={isDark}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.propertyAnalysis.typeDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {data.propertyAnalysis.typeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip isDark={isDark} />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Leaderboards */}
        <div className={`relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl ${
          isDark 
            ? 'bg-gradient-to-b from-[#133c34]/80 to-[#091a16] border-[#1a4a40] shadow-black/40' 
            : 'bg-white/80 border-gray-200 shadow-gray-200/50'
        }`}>
          <h3 className={`text-sm font-black uppercase tracking-widest mb-8 ${isDark ? 'text-white' : 'text-gray-800'}`}>Leaderboards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Top 5 Most Favorited Properties</h4>
              <div className="space-y-4">
                {data.leaderboards.topFavoritedProperties.map(prop => (
                  <div key={prop.id} className={`flex items-center gap-5 p-4 rounded-2xl border transition-all duration-300 group ${
                    isDark ? 'bg-[#133c34]/30 border-[#1a4a40] hover:border-[#cddfa0]/30' : 'bg-gray-50/50 border-gray-100 hover:border-emerald-200'
                  }`}>
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md">
                      <img src={prop.image} alt={prop.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{prop.title}</p>
                    </div>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-xs ${
                      isDark ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200'
                    }`}>
                      <Star size={14} fill="currentColor" />
                      {prop.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
