"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Plus, MoreVertical, Star, Users, UserCheck, Trophy, TrendingUp, Mail, Phone, ShieldCheck, Award, X, Link as LinkIcon, ChevronLeft, ChevronRight, ChevronDown, Trash2, AlertTriangle, CheckCircle, Download, Edit2, FileText, LayoutGrid, List, BarChart3, Zap, CheckSquare, Target, MapPin, Activity } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';

// Chart & PDF Imports
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// ADD NEW CLIENT MODAL
const AddAgentModal = ({ isOpen, onClose, onAdd, isDark, agentToEdit }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', status: 'Active', imageLink: '', rating: '', specialty: 'Residential' 
  });

  useEffect(() => {
    if (agentToEdit) {
      setFormData({
        name: agentToEdit.name || '', email: agentToEdit.email || '', phone: agentToEdit.phone || '',
        status: agentToEdit.status || 'Active', imageLink: agentToEdit.avatar && !agentToEdit.avatar.includes('ui-avatars') ? agentToEdit.avatar : '',
        rating: agentToEdit.rating || '', specialty: agentToEdit.specialty || 'Residential'
      });
    } else {
      setFormData({ name: '', email: '', phone: '', status: 'Active', imageLink: '', rating: '', specialty: 'Residential' });
    }
  }, [agentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.rating) return;
    onAdd({ ...formData, rating: parseFloat(formData.rating) || 0 });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}></div>
      <div className={`relative w-full max-w-lg p-5 sm:p-7 rounded-[2rem] border animate-in zoom-in-95 duration-300 shadow-2xl max-h-[95vh] overflow-y-auto force-scrollbar ${
        isDark ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30 shadow-[0_0_50px_rgba(205,223,160,0.15)] backdrop-blur-2xl' : 'bg-white/95 border-blue-200 shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-2xl'
      }`}>
        <button onClick={onClose} className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-full bg-gray-100 dark:bg-[#133c34] text-gray-500 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors z-10"><X size={18} /></button>
        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight">
            {agentToEdit ? 'Edit ' : 'Add '} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65]">{agentToEdit ? 'Profile' : 'New Profile'}</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">{agentToEdit ? 'Update team member details' : 'Register a new team member'}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50/50 dark:bg-[#050f0d]/30 p-3 sm:p-4 rounded-3xl border border-gray-100 dark:border-[#1a4a40]/50">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${isDark ? 'border-[#cddfa0]/50 bg-[#133c34]/50' : 'border-blue-300 bg-blue-50'}`}>
              {formData.imageLink ? <img src={formData.imageLink} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} /> : <div className="flex flex-col items-center text-gray-400 dark:text-[#cddfa0]/60"><LinkIcon size={18} className="mb-0.5" /></div>}
            </div>
            <div className="w-full">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Avatar Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input type="url" value={formData.imageLink} onChange={(e) => setFormData({...formData, imageLink: e.target.value})} className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0f2e28] border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all" placeholder="https://example.com/image.jpg" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all" placeholder="e.g. John Doe" /></div>
            <div><label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label><input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all" placeholder="john@example.com" /></div>
            <div><label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Phone</label><input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all" placeholder="+1 (555) 000-0000" /></div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Specialty / Category</label>
              <div className="relative">
                <select value={formData.specialty} onChange={(e) => setFormData({...formData, specialty: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all appearance-none cursor-pointer">
                  <option value="Residential">Residential</option><option value="Commercial">Commercial</option><option value="Luxury">Luxury Estate</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
            <div className="sm:col-span-1"><label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Rating (0-5)</label><input type="number" min="0" max="5" step="0.1" required value={formData.rating} onChange={(e) => setFormData({...formData, rating: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-500/50 dark:focus:ring-amber-400/50 transition-all" placeholder="e.g. 4.5" /></div>
            <div className="sm:col-span-1">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Status</label>
              <div className="relative">
                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all appearance-none cursor-pointer">
                  <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="On Leave">On Leave</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>
          <button type="submit" className="w-full mt-2 sm:mt-4 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-xl sm:rounded-2xl font-black text-sm tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_20px_rgba(205,223,160,0.3)] hover:scale-[1.02] transition-all duration-300">
            {agentToEdit ? 'Save Changes' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default function AgentManagement() {
  const themeContext = useTheme();
  const isDark = themeContext ? themeContext.isDark : false;

  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); 
  const [viewMode, setViewMode] = useState('table');
  const [isLoading, setIsLoading] = useState(true);

  const [selectedAgents, setSelectedAgents] = useState([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [agentToDelete, setAgentToDelete] = useState(null);   
  const [agentToEdit, setAgentToEdit] = useState(null); 
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'success' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'table' ? 5 : 6;

  // Drag to scroll logic
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const showToast = (message, type = 'success') => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => setToastMessage({ show: false, message: '', type: 'success' }), 3500);
  };

  const getAgentTarget = (revenue) => {
    const rev = revenue || 0;
    if (rev > 10000000) return 15000000;
    if (rev > 5000000) return 10000000;
    return 5000000;
  };

  // FEATURE: Conversion / Win Rate %
  const getWinRate = (sold, assigned) => {
    if (!assigned || assigned === 0) return 0;
    const rate = (sold / assigned) * 100;
    return rate > 100 ? 100 : rate;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedAgents = localStorage.getItem('agentsData');
        if (savedAgents) {
          const parsed = JSON.parse(savedAgents);
          const enriched = parsed.map(a => ({ ...a, specialty: a.specialty || ['Residential', 'Commercial', 'Luxury'][Math.floor(Math.random()*3)] }));
          setAgents(enriched);
          setIsLoading(false);
          return; 
        }

        const timestamp = new Date().getTime();
        const response = await fetch(`/data/agentsdata.json?v=${timestamp}`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        let agentsList = Array.isArray(data) ? data : (data?.agents || []);
        agentsList = agentsList.map(a => ({ ...a, specialty: ['Residential', 'Commercial', 'Luxury'][Math.floor(Math.random()*3)] }));

        setAgents(agentsList);
        localStorage.setItem('agentsData', JSON.stringify(agentsList)); 
      } catch (error) { console.error('❌ Data Fetch Error:', error); } 
      finally { setTimeout(() => setIsLoading(false), 800); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = agents.filter(agent => {
      const nameMatch = agent.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = agent.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = selectedStatus === 'All' || agent.status === selectedStatus;
      return (nameMatch || emailMatch) && matchesStatus;
    });

    if (sortBy === 'revenue_desc') filtered.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0));
    else if (sortBy === 'rating_desc') filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === 'sold_desc') filtered.sort((a, b) => (b.propertiesSold || 0) - (a.propertiesSold || 0));
    else if (sortBy === 'name_asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    else filtered.sort((a, b) => b.id - a.id);

    setFilteredAgents(filtered);
    const totalPagesNow = Math.ceil(filtered.length / itemsPerPage);
    if (currentPage > totalPagesNow && totalPagesNow > 0) setCurrentPage(1);
  }, [searchTerm, selectedStatus, sortBy, agents, currentPage, itemsPerPage]);

  const handleSaveAgent = (data) => {
    const defaultAvatar = `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=random`;
    if (agentToEdit) {
      const updatedAgents = agents.map(a => a.id === agentToEdit.id ? { ...a, ...data, avatar: data.imageLink || a.avatar } : a);
      setAgents(updatedAgents); localStorage.setItem('agentsData', JSON.stringify(updatedAgents)); showToast('Profile updated successfully!');
    } else {
      const newId = agents.length > 0 ? Math.max(...agents.map(a => a.id)) + 1 : 1;
      const agentToAdd = { ...data, id: newId, propertiesSold: 0, assignedProperties: 0, totalRevenue: 0, avatar: data.imageLink || defaultAvatar };
      const updatedAgents = [agentToAdd, ...agents];
      setAgents(updatedAgents); localStorage.setItem('agentsData', JSON.stringify(updatedAgents)); showToast('New profile created successfully!');
    }
    setIsModalOpen(false); setAgentToEdit(null);
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedAgents = agents.map(agent => agent.id === id ? { ...agent, status: newStatus } : agent);
    setAgents(updatedAgents); localStorage.setItem('agentsData', JSON.stringify(updatedAgents)); showToast(`Status updated to ${newStatus}`);
  };

  const executeDelete = () => {
    if(agentToDelete) {
      const updatedAgents = agents.filter(agent => agent.id !== agentToDelete);
      setAgents(updatedAgents); localStorage.setItem('agentsData', JSON.stringify(updatedAgents)); 
      setAgentToDelete(null); setSelectedAgents(prev => prev.filter(id => id !== agentToDelete)); showToast('Profile permanently deleted!', 'delete');
    }
  };

  const handleSelectAll = (e) => { setSelectedAgents(e.target.checked ? currentAgents.map(a => a.id) : []); };
  const handleSelectOne = (id) => { setSelectedAgents(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]); };

  const executeBulkDelete = () => {
    const updatedAgents = agents.filter(agent => !selectedAgents.includes(agent.id));
    setAgents(updatedAgents); localStorage.setItem('agentsData', JSON.stringify(updatedAgents));
    setSelectedAgents([]); setIsBulkDeleteModalOpen(false); showToast(`${selectedAgents.length} profiles deleted successfully!`, 'delete');
  };

  const exportDataToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18); doc.text("Real Estate Agent Performance Report", 14, 22);
      doc.setFontSize(10); doc.setTextColor(100); doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      const tableColumn = ["ID", "Agent Name", "Email", "Specialty", "Status", "Sold", "Revenue ($)"];
      const tableRows = [];
      const dataToExport = selectedAgents.length > 0 ? filteredAgents.filter(a => selectedAgents.includes(a.id)) : filteredAgents;
      
      dataToExport.forEach(agent => {
        tableRows.push([`#${agent.id}`, agent.name, agent.email, agent.specialty || 'N/A', agent.status, agent.propertiesSold || 0, agent.totalRevenue || 0]);
      });
      
      autoTable(doc, {
        startY: 35, head: [tableColumn], body: tableRows, theme: 'grid', headStyles: { fillColor: isDark ? [26, 74, 64] : [37, 99, 235] }, styles: { fontSize: 9 },
      });
      doc.save(`Agent_Report_${new Date().toISOString().split('T')[0]}.pdf`); showToast('Report exported to PDF successfully!');
    } catch (error) { console.error("PDF Export Error:", error); showToast('Failed to export PDF.', 'error'); }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAgents.length / itemsPerPage);

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === 'Active').length;
  const inactiveAgents = agents.filter(a => a.status === 'Inactive').length;
  const onLeaveAgents = agents.filter(a => a.status === 'On Leave').length;
  const averageRating = totalAgents > 0 ? (agents.reduce((sum, a) => sum + (a.rating || 0), 0) / totalAgents).toFixed(1) : '0.0';
  
  const topRevenueAgents = useMemo(() => [...agents].sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0)).slice(0, 5), [agents]);
  const totalCompanyRevenue = agents.reduce((sum, a) => sum + (a.totalRevenue || 0), 0);
  const topAgentInsight = topRevenueAgents[0] ? `${topRevenueAgents[0].name} is leading with ${topRevenueAgents[0].propertiesSold} sales, generating ${((topRevenueAgents[0].totalRevenue / totalCompanyRevenue) * 100).toFixed(1)}% of total revenue.` : 'Data compiling...';

  const formatCurrency = (value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);

  const getStatusColor = (status) => {
    if (isDark) {
      switch (status) {
        case 'Active': return 'bg-[#cddfa0]/10 text-[#cddfa0] border-[#cddfa0]/30 shadow-[0_0_10px_rgba(205,223,160,0.2)]';
        case 'Inactive': return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
        case 'On Leave': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/30';
      }
    }
    switch (status) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-sm';
      case 'Inactive': return 'bg-rose-50 text-rose-700 border-rose-300 shadow-sm';
      case 'On Leave': return 'bg-amber-50 text-amber-700 border-amber-300 shadow-sm';
      default: return 'bg-gray-50 text-gray-700 border-gray-300';
    }
  };

  const getSpecialtyColor = (specialty) => {
    switch (specialty) {
      case 'Luxury': return isDark ? 'text-amber-400 bg-amber-400/10 border-amber-400/20' : 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Commercial': return isDark ? 'text-blue-400 bg-blue-400/10 border-blue-400/20' : 'text-blue-700 bg-blue-50 border-blue-200';
      default: return isDark ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  const renderStars = (rating) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={14} className={i < Math.floor(rating) ? 'fill-amber-400 text-amber-400 drop-shadow-md' : 'text-gray-200 dark:text-gray-600'} />
      ))}
    </div>
  );

  return (
    <div className={`p-4 md:p-6 lg:p-8 min-h-screen transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#091a16] text-gray-100' : 'bg-[#f4f7f6] text-gray-900'}`}>
      
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-[#cddfa0]/5 dark:to-transparent pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-bl from-indigo-500/10 to-transparent dark:from-[#1a4a40]/30 dark:to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <div className="relative">
            <div className={`w-20 h-20 border-4 rounded-full ${isDark ? 'border-[#1a4a40]' : 'border-gray-200'}`}></div>
            <div className={`w-20 h-20 border-4 rounded-full border-t-transparent animate-spin absolute top-0 left-0 ${isDark ? 'border-[#cddfa0]' : 'border-blue-600'}`}></div>
            <ShieldCheck className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`} size={24} />
          </div>
          <p className="mt-6 text-sm font-bold animate-pulse tracking-widest uppercase text-gray-500 dark:text-[#cddfa0]">Loading Directory...</p>
        </div>
      ) : (
        <div className="relative z-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 pb-8 border-b border-gray-200/80 dark:border-[#1a4a40]/50">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#133c34] border border-gray-200 dark:border-[#1a4a40] mb-4 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-gray-300">Live Roster</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 drop-shadow-sm">
                Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-[#cddfa0]">Directory</span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">Manage your elite real estate team, track performance, and analyze metrics.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <button onClick={exportDataToPDF} className="flex w-full sm:w-auto items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-[#133c34] border border-gray-200 dark:border-[#1a4a40] text-gray-700 dark:text-gray-200 rounded-2xl font-bold shadow-sm hover:shadow-md hover:bg-gray-50 dark:hover:bg-[#1a4a40]/80 transition-all duration-300">
                <FileText size={18} className={isDark ? "text-rose-400" : "text-rose-500"} /> 
                <span>{selectedAgents.length > 0 ? `Export Selected (${selectedAgents.length})` : 'Export PDF'}</span>
              </button>

              <button onClick={() => { setAgentToEdit(null); setIsModalOpen(true); }} className="relative w-full sm:w-auto group overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-2xl font-black shadow-[0_8px_20px_rgba(37,99,235,0.25)] dark:shadow-[0_8px_20px_rgba(205,223,160,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_8px_30px_rgba(205,223,160,0.4)] hover:-translate-y-1 transition-all duration-300">
                <div className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] z-0"></div>
                <Plus size={20} className="relative z-10" /> 
                <span className="relative z-10">Add New Agent</span>
              </button>
            </div>
          </div>

          {selectedAgents.length > 0 && (
             <div className="mb-6 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 bg-blue-50 dark:bg-[#133c34]/80 border border-blue-200 dark:border-[#1a4a40] animate-in fade-in slide-in-from-top-4">
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <CheckSquare className="text-blue-600 dark:text-[#cddfa0]" size={20} />
                 <span className="font-bold text-gray-800 dark:text-white">{selectedAgents.length} Agents Selected</span>
               </div>
               <div className="flex gap-4 w-full sm:w-auto justify-end">
                 <button onClick={() => setSelectedAgents([])} className="text-sm font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors">Clear Selection</button>
                 <button onClick={() => setIsBulkDeleteModalOpen(true)} className="text-sm font-bold text-rose-600 dark:text-rose-400 hover:underline">Delete Selected</button>
               </div>
             </div>
          )}

          {/* EXACT MATCHING BACKGROUND CLASSES FOR SMART INSIGHT */}
          <div className="mb-10 p-4 sm:p-5 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1">
            <div className={`p-3 rounded-full flex-shrink-0 shadow-md ${isDark ? 'bg-[#cddfa0] text-[#091a16]' : 'bg-blue-600 text-white'}`}>
              <Zap size={22} className="fill-current" />
            </div>
            <div>
              <p className={`text-[11px] sm:text-xs font-black uppercase tracking-[0.15em] mb-1 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`}>Smart Performance Insight</p>
              <p className={`text-sm sm:text-base font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{topAgentInsight}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="group relative bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-[#cddfa0]/5 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1a4a40] dark:to-[#0f2e28] flex items-center justify-center border border-blue-100/50 dark:border-[#1a4a40] shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Users size={26} className="text-blue-600 dark:text-[#cddfa0]" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">Total Agents</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white drop-shadow-sm relative z-10">{totalAgents}</h3>
            </div>

            <div className="group relative bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-[#0f2e28] flex items-center justify-center border border-emerald-100/50 dark:border-[#1a4a40] shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <UserCheck size={26} className="text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">Active Workforce</p>
              <div className="flex items-baseline gap-2 relative z-10">
                <h3 className="text-4xl font-black text-gray-900 dark:text-white drop-shadow-sm">{activeAgents}</h3>
                <div className="flex flex-col text-[9px] font-semibold text-gray-400 ml-2">
                  <span className="text-rose-500 dark:text-rose-400">{inactiveAgents} Inactive</span>
                  <span className="text-amber-500 dark:text-amber-400">{onLeaveAgents} On Leave</span>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-[#0f2e28] flex items-center justify-center border border-amber-100/50 dark:border-[#1a4a40] shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <Award size={26} className="text-amber-500" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">Avg Performance</p>
              <h3 className="text-4xl font-black text-gray-900 dark:text-white flex items-baseline gap-1.5 drop-shadow-sm relative z-10">
                {averageRating} <span className="text-sm font-semibold text-gray-400">/ 5.0</span>
              </h3>
            </div>

            <div className="group relative bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-2 transition-all duration-300 overflow-hidden">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 dark:bg-[#cddfa0]/5 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-[#1a4a40] dark:to-[#0f2e28] flex items-center justify-center border border-indigo-100/50 dark:border-[#1a4a40] shadow-inner group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp size={26} className="text-indigo-600 dark:text-[#cddfa0]" />
                </div>
              </div>
              <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] mb-1.5 relative z-10">Total Revenue</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white drop-shadow-sm relative z-10">{formatCurrency(totalCompanyRevenue)}</h3>
            </div>
          </div>

          {/* SVG Definitions for Animated Water Flow Gradient */}
          <svg style={{ height: 0 }}>
            <defs>
              <linearGradient id="waterFlowDark" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#cddfa0" stopOpacity="1" />
                <stop offset="50%" stopColor="#e2f0c5" stopOpacity="0.6">
                   <animate attributeName="offset" values="0.1; 0.9; 0.1" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#cddfa0" stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="waterFlowLight" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="1" />
                <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.6">
                   <animate attributeName="offset" values="0.1; 0.9; 0.1" dur="2s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {topRevenueAgents.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              
              {/* CHART SECTION - Animated Water Bars & Thick Line */}
              <div className="lg:col-span-2 bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <BarChart3 size={24} className="text-blue-600 dark:text-[#cddfa0]" />
                    <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">Revenue vs Sales Metrics</h2>
                  </div>
                  <div className="flex gap-4 text-xs font-bold text-gray-500 dark:text-gray-400">
                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500 dark:bg-[#cddfa0]"></div> Revenue</div>
                     <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Properties Sold</div>
                  </div>
                </div>
                
                <div className="w-full flex-1 min-h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={topRevenueAgents} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barCategoryGap="20%">
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1a4a40' : '#e2e8f0'} vertical={false} />
                      <XAxis dataKey="name" stroke={isDark ? '#cbd5e1' : '#64748b'} fontSize={10} tickLine={false} axisLine={false} tickMargin={12} />
                      <YAxis yAxisId="left" stroke={isDark ? '#cbd5e1' : '#64748b'} fontSize={11} tickLine={false} axisLine={false} tickMargin={10} tickFormatter={(value) => `$${value >= 1000 ? value / 1000 + 'k' : value}`} />
                      <YAxis yAxisId="right" orientation="right" stroke={isDark ? '#cbd5e1' : '#64748b'} fontSize={11} tickLine={false} axisLine={false} tickMargin={10} />
                      <Tooltip 
                        cursor={{ fill: isDark ? '#11332a' : '#f8fafc' }}
                        contentStyle={{ backgroundColor: isDark ? '#0a2e26' : '#ffffff', borderRadius: '12px', border: isDark ? '1px solid #1a4a40' : '1px solid #e2e8f0', color: isDark ? '#cddfa0' : '#0f172a', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' }}
                      />
                      
                      {/* VERY THICK BARS & WATER FLOW GRADIENT */}
                      <Bar yAxisId="left" dataKey="totalRevenue" name="Revenue" fill={isDark ? "url(#waterFlowDark)" : "url(#waterFlowLight)"} radius={[6, 6, 0, 0]} maxBarSize={60} />
                      
                      {/* THICK LINE LIKE A BOX EDGE */}
                      <Line yAxisId="right" type="monotone" dataKey="propertiesSold" name="Properties Sold" stroke="#10b981" strokeWidth={6} dot={{r: 5, strokeWidth: 2}} activeDot={{r: 8}} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="lg:col-span-1 bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] p-6 lg:p-8 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] flex flex-col h-[400px] lg:h-auto">
                <div className="flex items-center gap-3 mb-6">
                  <Trophy size={24} className="text-amber-500" />
                  <h2 className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">Elite Leaderboard</h2>
                </div>
                
                <div className="flex-1 space-y-3 overflow-y-auto force-scrollbar pr-2">
                  {topRevenueAgents.map((agent, index) => (
                    <div key={agent.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-gray-50/50 dark:bg-[#0f2e28]/50 hover:bg-white dark:hover:bg-[#1a4a40] transition-colors border border-transparent hover:border-gray-200 dark:hover:border-[#cddfa0]/20 shadow-sm">
                      <div className="relative shrink-0">
                        <span className={`absolute -top-2.5 -left-2.5 w-6 h-6 flex items-center justify-center rounded-full text-[10px] font-black z-10 border-2 border-white dark:border-[#0f2e28] ${index === 0 ? 'bg-amber-400 text-amber-900' : index === 1 ? 'bg-gray-300 text-gray-800' : index === 2 ? 'bg-amber-700 text-white' : 'bg-blue-100 dark:bg-[#133c34] text-blue-600 dark:text-[#cddfa0]'}`}>
                          #{index + 1}
                        </span>
                        <img src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=random`} alt={agent.name} draggable="false" className="w-12 h-12 rounded-xl object-cover border-2 border-white dark:border-[#1a4a40]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{agent.name}</p>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 truncate">{agent.specialty || 'General'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs font-black text-blue-600 dark:text-[#cddfa0]">{formatCurrency(agent.totalRevenue)}</p>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">{agent.propertiesSold} Sales</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6 bg-white/70 dark:bg-[#133c34]/40 p-2.5 rounded-[2rem] border border-white dark:border-[#1a4a40]/50 backdrop-blur-xl shadow-lg shadow-gray-200/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.15)] w-full">
            <div className="flex flex-wrap gap-2 w-full lg:w-auto p-1">
              {['All', 'Active', 'Inactive', 'On Leave'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] transition-all duration-300 flex-1 sm:flex-none ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white dark:bg-[#cddfa0] dark:text-[#091a16] shadow-[0_8px_20px_rgba(37,99,235,0.3)] dark:shadow-[0_8px_20px_rgba(205,223,160,0.2)] scale-[1.02]'
                      : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1a4a40]/60 hover:text-gray-900 dark:hover:text-white hover:shadow-sm'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto p-1">
              <div className="flex items-center p-1 bg-gray-100/50 dark:bg-[#0f2e28] rounded-[1.2rem] w-full sm:w-auto justify-center">
                <button onClick={() => setViewMode('table')} className={`w-full sm:w-auto p-2.5 rounded-xl transition-all flex justify-center ${viewMode === 'table' ? 'bg-white dark:bg-[#1a4a40] shadow-sm text-blue-600 dark:text-[#cddfa0]' : 'text-gray-400'}`}>
                  <List size={18} />
                </button>
                <button onClick={() => setViewMode('grid')} className={`w-full sm:w-auto p-2.5 rounded-xl transition-all flex justify-center ${viewMode === 'grid' ? 'bg-white dark:bg-[#1a4a40] shadow-sm text-blue-600 dark:text-[#cddfa0]' : 'text-gray-400'}`}>
                  <LayoutGrid size={18} />
                </button>
              </div>

              <div className="relative w-full sm:w-[180px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-white/80 dark:bg-[#0f2e28]/90 border border-gray-200/60 dark:border-[#1a4a40]/80 rounded-[1.2rem] text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-[#cddfa0]/30 transition-all shadow-sm appearance-none cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="revenue_desc">Highest Revenue</option>
                  <option value="rating_desc">Top Rated</option>
                  <option value="sold_desc">Most Sold</option>
                  <option value="name_asc">Name (A-Z)</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>

              <div className="relative w-full sm:w-[250px]">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-5 py-3 bg-white/80 dark:bg-[#0f2e28]/90 border border-gray-200/60 dark:border-[#1a4a40]/80 rounded-[1.2rem] text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-blue-500/20 dark:focus:ring-[#cddfa0]/30 transition-all shadow-sm placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white dark:border-[#1a4a40]/60 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 dark:shadow-[0_15px_50px_rgba(0,0,0,0.3)] mb-6">
              
              {/* Mobile Scroll Hint & Right Shadow */}
              <div className="md:hidden flex items-center justify-end gap-1.5 px-4 sm:px-6 pt-4 pb-2 text-[9px] sm:text-[10px] font-black text-blue-500 dark:text-[#cddfa0] uppercase tracking-widest animate-pulse">
                <span>Swipe or drag to view more</span>
                <ChevronRight size={14} />
              </div>

              <div className="relative w-full">
                {/* Fade Effect on the right side to indicate overflow on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0f2e28] to-transparent pointer-events-none z-10 md:hidden"></div>

                <div 
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                  className="w-full overflow-x-auto force-scrollbar relative pb-4 cursor-grab active:cursor-grabbing"
                >
                  <table className="w-full min-w-[1200px] border-collapse select-none">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-[#0f2e28]/70 border-b border-gray-100 dark:border-[#1a4a40]/80">
                        <th className="px-6 py-6 w-10">
                          <input type="checkbox" checked={currentAgents.length > 0 && selectedAgents.length === currentAgents.length} onChange={handleSelectAll} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                        </th>
                        <th className="px-4 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Agent Details</th>
                        <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Contact & Specialty</th>
                        <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">AI Forecast & Target</th>
                        <th className="px-6 py-6 text-left text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Metrics</th>
                        <th className="px-4 py-6 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Status Update</th>
                        <th className="px-6 py-6 text-center text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100/80 dark:divide-[#1a4a40]/50 relative">
                      {currentAgents.map((agent, index) => {
                        const target = getAgentTarget(agent.totalRevenue);
                        const progress = Math.min(100, ((agent.totalRevenue || 0) / target) * 100);
                        
                        return (
                        <tr key={agent.id} className={`hover:bg-blue-50/50 dark:hover:bg-[#1a4a40]/60 transition-all duration-300 group animate-in fade-in ${selectedAgents.includes(agent.id) ? 'bg-blue-50/30 dark:bg-[#1a4a40]/30' : ''}`}>
                          <td className="px-6 py-5">
                            <input type="checkbox" checked={selectedAgents.includes(agent.id)} onChange={() => handleSelectOne(agent.id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                          </td>
                          <td className="px-4 py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=random`} alt={agent.name} draggable="false" className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-[#1a4a40] shadow-md group-hover:scale-110 transition-all duration-500" />
                                {agent.status === 'Active' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white dark:border-[#133c34] rounded-full shadow-sm"></div>}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-[#cddfa0] transition-colors">{agent.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-bold text-gray-400">#{String(agent.id).padStart(5, '0')}</span>
                                  {renderStars(agent.rating)}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="space-y-2">
                              <a href={`mailto:${agent.email}`} draggable="false" className="flex items-center text-[12px] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#cddfa0] transition-colors group/mail w-max">
                                <Mail size={14} className="mr-2"/> {agent.email}
                              </a>
                              <a href={`tel:${agent.phone}`} draggable="false" className="flex items-center text-[12px] text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-[#cddfa0] transition-colors group/tel w-max">
                                <Phone size={14} className="mr-2"/> {agent.phone}
                              </a>
                              <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border mt-1 ${getSpecialtyColor(agent.specialty)}`}>
                                 {agent.specialty || 'General'}
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-5 w-48">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-gray-500 dark:text-gray-400">Target: {formatCurrency(target)}</span>
                                <span className={progress >= 100 ? 'text-emerald-500' : 'text-blue-600 dark:text-[#cddfa0]'}>{progress.toFixed(0)}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-100 dark:bg-[#0f2e28] rounded-full overflow-hidden">
                                 <div 
                                   className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : isDark ? 'bg-[#cddfa0]' : 'bg-blue-600'}`} 
                                   style={{ width: `${progress}%` }}
                                 ></div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex flex-col gap-1">
                               <p className="font-black text-gray-900 dark:text-white tracking-tight text-sm">{formatCurrency(agent.totalRevenue)}</p>
                               <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                  {agent.propertiesSold} Sales / {agent.assignedProperties} Assigned
                                  {/* UNIQUE FEATURE 1: AI Conversion Win Rate inside standard Metrics */}
                                  <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-[9px]">
                                    Win Rate: {getWinRate(agent.propertiesSold, agent.assignedProperties).toFixed(0)}%
                                  </span>
                               </p>
                               {/* UNIQUE FEATURE 2: Revenue Velocity Indicator seamlessly injected */}
                               {agent.rating >= 4.0 && agent.propertiesSold > 10 && (
                                 <p className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-1">
                                   <TrendingUp size={10} /> High Velocity
                                 </p>
                               )}
                            </div>
                          </td>

                          <td className="px-4 py-5 text-center relative z-20">
                            <div className="relative inline-block w-[110px]">
                              <select
                                value={agent.status}
                                onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                                className={`w-full appearance-none px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.08em] border backdrop-blur-md transition-all shadow-sm cursor-pointer outline-none ${getStatusColor(agent.status)}`}
                              >
                                <option value="Active" className="bg-white text-gray-900 dark:bg-[#0a2e26] dark:text-white">Active</option>
                                <option value="Inactive" className="bg-white text-gray-900 dark:bg-[#0a2e26] dark:text-white">Inactive</option>
                                <option value="On Leave" className="bg-white text-gray-900 dark:bg-[#0a2e26] dark:text-white">On Leave</option>
                              </select>
                              <ChevronDown size={14} strokeWidth={3} className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-70" />
                            </div>
                          </td>

                          <td className="px-6 py-5 text-center relative z-10">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => { setAgentToEdit(agent); setIsModalOpen(true); }}
                                className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-[#1a4a40] text-gray-400 hover:text-blue-600 dark:hover:text-[#cddfa0] transition-all"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => setAgentToDelete(agent.id)}
                                className="p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentAgents.map((agent, index) => {
                const target = getAgentTarget(agent.totalRevenue);
                const progress = Math.min(100, ((agent.totalRevenue || 0) / target) * 100);
                
                return(
                <div key={agent.id} className={`bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-xl border ${selectedAgents.includes(agent.id) ? 'border-blue-500 dark:border-[#cddfa0] ring-1 ring-blue-500 dark:ring-[#cddfa0]' : 'border-white/60 dark:border-[#1a4a40]/60'} rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 animate-in zoom-in-95 relative flex flex-col h-full`}>
                  <div className="absolute top-5 left-5 z-20">
                    <input type="checkbox" checked={selectedAgents.includes(agent.id)} onChange={() => handleSelectOne(agent.id)} className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                  </div>
                  <div className="flex justify-between items-start mb-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=random`} draggable="false" alt={agent.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-white dark:border-[#1a4a40] shadow-sm" />
                        {agent.status === 'Active' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#133c34] rounded-full"></div>}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{agent.name}</h3>
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border mt-1 ${getSpecialtyColor(agent.specialty)}`}>
                           {agent.specialty || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        value={agent.status}
                        onChange={(e) => handleStatusChange(agent.id, e.target.value)}
                        className={`appearance-none px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm cursor-pointer pr-7 ${getStatusColor(agent.status)}`}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-70" />
                    </div>
                  </div>

                  <div className="mb-5 px-1 flex-grow">
                     <div className="flex justify-between items-end mb-1">
                        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Goal Progress</p>
                        <p className="text-[11px] font-black text-gray-900 dark:text-white">{progress.toFixed(0)}%</p>
                     </div>
                     <div className="w-full h-1.5 bg-gray-100 dark:bg-[#0f2e28] rounded-full overflow-hidden mb-1.5">
                        <div className={`h-full rounded-full transition-all duration-1000 ${progress >= 100 ? 'bg-emerald-500' : isDark ? 'bg-[#cddfa0]' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                     </div>
                     <p className="text-[9px] font-bold text-gray-400 text-right">{formatCurrency(agent.totalRevenue)} / {formatCurrency(target)}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5 relative">
                    <div className="bg-gray-50 dark:bg-[#0f2e28] p-3 rounded-2xl border border-gray-100 dark:border-[#1a4a40]/50 relative">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Properties Sold</p>
                      <p className="text-xl font-black text-blue-600 dark:text-[#cddfa0]">{agent.propertiesSold}</p>
                      {/* UNIQUE FEATURE 1: Win Rate Badge on Grid View */}
                      <div className="absolute top-3 right-3 px-1.5 py-0.5 rounded bg-blue-100 dark:bg-[#1a4a40] text-blue-700 dark:text-[#cddfa0] text-[8px] font-black">
                        WR {getWinRate(agent.propertiesSold, agent.assignedProperties).toFixed(0)}%
                      </div>
                    </div>
                    <div className="flex flex-col justify-center bg-gray-50 dark:bg-[#0f2e28] p-3 rounded-2xl border border-gray-100 dark:border-[#1a4a40]/50 relative">
                       {/* UNIQUE FEATURE 2: Velocity Indicator on Grid View */}
                       {agent.rating >= 4.0 && agent.propertiesSold > 10 && (
                          <div className="absolute top-2 right-2 flex items-center justify-center bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 p-1 rounded-full" title="High Revenue Velocity">
                             <TrendingUp size={10} />
                          </div>
                       )}
                       <a href={`mailto:${agent.email}`} draggable="false" className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#cddfa0] mb-2"><Mail size={12}/> Email Agent</a>
                       <a href={`tel:${agent.phone}`} draggable="false" className="flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-[#cddfa0]"><Phone size={12}/> Call Agent</a>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-[#1a4a40]/50 pt-4 mt-auto">
                    <div>
                      {renderStars(agent.rating)}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setAgentToEdit(agent); setIsModalOpen(true); }} className="p-2 rounded-lg bg-gray-50 dark:bg-[#1a4a40] hover:bg-blue-50 dark:hover:bg-[#cddfa0]/20 text-gray-500 dark:text-gray-300 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => setAgentToDelete(agent.id)} className="p-2 rounded-lg bg-gray-50 dark:bg-[#1a4a40] hover:bg-rose-50 dark:hover:bg-rose-500/20 text-gray-500 dark:text-gray-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )})}
            </div>
          )}

          {/* Pagination */}
          {filteredAgents.length > 0 && (
            <div className="flex items-center justify-center gap-2 p-5 bg-white/40 dark:bg-[#0f2e28]/40 rounded-3xl border border-white/60 dark:border-[#1a4a40]/50 backdrop-blur-md overflow-x-auto force-scrollbar">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <ChevronLeft size={18} />
              </button>
              
              <div className="flex gap-1.5 items-center">
                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black transition-all flex-shrink-0 ${
                          currentPage === page 
                            ? 'bg-gray-800 text-white dark:bg-[#1a4a40] dark:text-[#cddfa0] shadow-md' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#133c34]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="flex items-center text-gray-400 text-xs px-1 flex-shrink-0">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {filteredAgents.length === 0 && !isLoading && (
            <div className="text-center py-28 px-4 animate-in fade-in zoom-in duration-500">
              <div className="w-28 h-28 bg-gray-50 dark:bg-[#1a4a40]/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-100 dark:border-[#1a4a40]/50 relative">
                <Search size={40} className="text-gray-400 relative z-10" />
                <div className="absolute inset-0 bg-blue-500/5 dark:bg-[#cddfa0]/5 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No Agents Found</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">We couldn't find any agents matching your current search criteria. Try adjusting your filters.</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedStatus('All'); setSortBy('newest'); setCurrentPage(1); }}
                className="mt-8 px-8 py-3.5 rounded-2xl text-xs font-bold bg-gray-900 dark:bg-[#cddfa0] text-white dark:text-[#091a16] hover:bg-blue-600 dark:hover:bg-[#aebf85] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
      
      <AddAgentModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setAgentToEdit(null); }} 
        onAdd={handleSaveAgent}
        isDark={isDark}
        agentToEdit={agentToEdit}
      />

      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsBulkDeleteModalOpen(false)}></div>
          <div className={`relative w-full max-w-sm p-8 text-center rounded-[2.5rem] border animate-in zoom-in-95 duration-200 shadow-2xl ${isDark ? 'bg-[#050f0d] border-rose-500/30' : 'bg-white border-rose-200'}`}>
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100 dark:border-rose-500/20 relative">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
              <AlertTriangle className="text-rose-500 relative z-10" size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete {selectedAgents.length} Agents?</h3>
            <p className="text-sm text-gray-500 mb-8">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsBulkDeleteModalOpen(false)} className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase bg-gray-100 dark:bg-[#1a4a40] text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={executeBulkDelete} className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase bg-rose-500 text-white hover:bg-rose-600">Yes, Delete All</button>
            </div>
          </div>
        </div>
      )}

      {agentToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setAgentToDelete(null)}></div>
          <div className={`relative w-full max-w-sm p-8 text-center rounded-[2.5rem] border animate-in zoom-in-95 duration-200 shadow-2xl ${isDark ? 'bg-[#050f0d] border-rose-500/30' : 'bg-white border-rose-200'}`}>
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-5 border border-rose-100 dark:border-rose-500/20 relative">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
              <AlertTriangle className="text-rose-500 relative z-10" size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Delete Profile?</h3>
            <p className="text-sm text-gray-500 mb-8">Are you sure you want to permanently remove this agent?</p>
            <div className="flex gap-3">
              <button onClick={() => setAgentToDelete(null)} className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase bg-gray-100 dark:bg-[#1a4a40] text-gray-700 dark:text-gray-300">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-3.5 rounded-2xl font-bold text-xs uppercase bg-rose-500 text-white hover:bg-rose-600">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {toastMessage.show && (
        <div className={`fixed bottom-6 right-6 z-[150] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toastMessage.type === 'delete' 
            ? 'bg-rose-500 text-white shadow-[0_10px_40px_rgba(244,63,94,0.3)]' 
            : 'bg-emerald-500 text-white shadow-[0_10px_40px_rgba(16,185,129,0.3)]'
        }`}>
          {toastMessage.type === 'delete' ? <Trash2 size={20} /> : <CheckCircle size={20} />}
          <p className="text-sm font-bold tracking-wide">{toastMessage.message}</p>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes shine { 100% { transform: translateX(100%); } }
        
        /* Force scrollbar to be visible and touchable on mobile */
        .force-scrollbar {
          -webkit-overflow-scrolling: touch !important;
          overflow-x: auto !important;
          scrollbar-width: thin !important;
          scrollbar-color: ${isDark ? '#cddfa0 rgba(255,255,255,0.05)' : '#94a3b8 rgba(0,0,0,0.05)'} !important;
        }
        
        .force-scrollbar::-webkit-scrollbar { 
          height: 10px !important; 
          width: 10px !important;
          -webkit-appearance: none !important; 
          display: block !important;
        }
        
        .force-scrollbar::-webkit-scrollbar-track { 
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} !important; 
          border-radius: 10px !important; 
          margin: 0px 15px !important; 
        }
        
        .force-scrollbar::-webkit-scrollbar-thumb { 
          background-color: ${isDark ? '#cddfa0' : '#94a3b8'} !important; 
          border-radius: 10px !important; 
          border: 2px solid ${isDark ? '#091a16' : '#f4f7f6'} !important; 
          background-clip: content-box !important;
        }
        
        @keyframes dash { to { stroke-dasharray: 264 264; } }
      `}</style>
    </div>
  ); 
}