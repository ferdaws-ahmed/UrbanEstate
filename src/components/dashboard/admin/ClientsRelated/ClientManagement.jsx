"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Eye, MessageSquare, Mail, Users, Target, Activity, TrendingUp, CheckCircle, ShieldCheck, Trash2, ChevronLeft, ChevronRight, Plus, X, Link as LinkIcon, AlertTriangle, Phone, Briefcase, ChevronDown, Download, FileText, ArrowUpDown, Filter, Star, MapPin, Calendar, Copy } from 'lucide-react';
import { useTheme } from '../../../ThemeProvider';

// PDF Export Libraries
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; 

// ADD NEW CLIENT MODAL
const AddClientModal = ({ isOpen, onClose, onAdd, isDark }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Buyer',
    location: 'Dhaka',
    imageLink: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    onAdd(formData);
    setFormData({ name: '', email: '', phone: '', type: 'Buyer', location: 'Dhaka', imageLink: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className={`relative w-full max-w-lg p-5 sm:p-7 rounded-[2rem] border animate-in zoom-in-95 duration-300 shadow-2xl max-h-[95vh] overflow-y-auto force-scrollbar ${
        isDark 
          ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30 shadow-[0_0_50px_rgba(205,223,160,0.15)] backdrop-blur-2xl' 
          : 'bg-white/95 border-blue-200 shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-2xl'
      }`}>
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 sm:right-5 sm:top-5 p-2 rounded-full bg-gray-100 dark:bg-[#133c34] text-gray-500 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-1.5 tracking-tight">Add <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65]">New Client</span></h2>
          <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">Register a client to nexus</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-gray-50/50 dark:bg-[#050f0d]/30 p-3 sm:p-4 rounded-3xl border border-gray-100 dark:border-[#1a4a40]/50">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
              isDark ? 'border-[#cddfa0]/50 bg-[#133c34]/50' : 'border-blue-300 bg-blue-50'
            }`}>
              {formData.imageLink ? (
                <img src={formData.imageLink} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-[#cddfa0]/60">
                  <LinkIcon size={18} className="mb-0.5" />
                </div>
              )}
            </div>
            
            <div className="w-full">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Avatar Image URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="url" value={formData.imageLink} onChange={(e) => setFormData({...formData, imageLink: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-white dark:bg-[#0f2e28] border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Full Name</label>
              <input 
                type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all"
                placeholder="e.g. Sarah Connor"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Email Address</label>
              <input 
                type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all"
                placeholder="sarah@example.com"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Phone</label>
              <input 
                type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Preferred Area</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
                <input 
                  type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full pl-9 pr-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all"
                  placeholder="e.g. Gulshan"
                />
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1.5">Client Type</label>
              <div className="relative group/dropdown">
                <select 
                  value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2.5 sm:py-3 bg-gray-50/50 dark:bg-[#050f0d]/50 border border-gray-200 dark:border-[#1a4a40] rounded-xl sm:rounded-2xl text-xs sm:text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all appearance-none cursor-pointer"
                >
                  <option value="Buyer" className="bg-white dark:bg-[#0a2e26] text-gray-900 dark:text-white">Buyer</option>
                  <option value="Seller" className="bg-white dark:bg-[#0a2e26] text-gray-900 dark:text-white">Seller</option>
                  <option value="Investor" className="bg-white dark:bg-[#0a2e26] text-gray-900 dark:text-white">Investor</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none group-hover/dropdown:translate-y-0 transition-transform" />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-2 sm:mt-4 py-3 sm:py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-xl sm:rounded-2xl font-black text-sm tracking-wide shadow-[0_0_20px_rgba(37,99,235,0.3)] dark:shadow-[0_0_20px_rgba(205,223,160,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            Create Client Profile
          </button>
        </form>
      </div>
    </div>
  );
};

// CLIENT PROFILE MODAL
const ClientProfileModal = ({ isOpen, onClose, client, isDark }) => {
  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      <div className={`relative w-full max-w-md p-6 sm:p-8 rounded-[2.5rem] border animate-in zoom-in-95 duration-300 shadow-2xl ${
        isDark 
          ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30 shadow-[0_0_50px_rgba(205,223,160,0.15)] backdrop-blur-2xl' 
          : 'bg-white/95 border-blue-200 shadow-[0_0_50px_rgba(37,99,235,0.15)] backdrop-blur-2xl'
      }`}>
        <button 
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full bg-gray-100 dark:bg-[#133c34] text-gray-500 dark:text-gray-300 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/20 dark:hover:text-rose-400 transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center mt-4">
          <div className="relative mb-4 group">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-[#cddfa0]/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <img 
              src={client.avatar || `https://ui-avatars.com/api/?name=${client.name}&background=random`} 
              alt={client.name} 
              className="w-28 h-28 rounded-full border-4 border-white dark:border-[#133c34] shadow-xl object-cover relative z-10" 
            />
            <div className={`absolute bottom-1 right-3 w-5 h-5 border-4 border-white dark:border-[#133c34] rounded-full z-20 ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
          </div>
          
          <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center flex items-center gap-2">
            {client.name} {client.isVIP && <Star size={20} className="fill-amber-400 text-amber-400" />}
          </h2>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              client.type === 'Buyer' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' :
              client.type === 'Seller' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
              'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
            }`}>
              {client.type}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#1a4a40]/50 px-3 py-1 rounded-full uppercase tracking-widest">
              <MapPin size={10} /> {client.location}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#0f2e28]/50 border border-gray-100 dark:border-[#1a4a40]/50">
            <div className="w-10 h-10 rounded-xl bg-blue-100/50 dark:bg-[#1a4a40] flex items-center justify-center shrink-0">
              <Mail size={18} className="text-blue-600 dark:text-[#cddfa0]" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Email Address</p>
              <a href={`mailto:${client.email}`} className="text-sm font-semibold text-gray-900 dark:text-white truncate hover:underline">{client.email}</a>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#0f2e28]/50 border border-gray-100 dark:border-[#1a4a40]/50">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/50 dark:bg-[#1a4a40] flex items-center justify-center shrink-0">
              <Phone size={18} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Contact</p>
              <a href={`https://wa.me/${client.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-900 dark:text-white hover:underline">{client.phone || 'N/A'}</a>
            </div>
          </div>
          
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-[#0f2e28]/50 border border-gray-100 dark:border-[#1a4a40]/50">
            <div className="w-10 h-10 rounded-xl bg-amber-100/50 dark:bg-[#1a4a40] flex items-center justify-center shrink-0">
              <Calendar size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Next Follow Up</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{client.followUp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// MAIN COMPONENT
export default function ClientManagement() {
  const themeContext = useTheme();
  const isDark = themeContext ? themeContext.isDark : false;

  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  
  // States for Sorting & Multi-filtering
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedClients, setSelectedClients] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All'); 

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ show: false, message: '', type: 'success' });

  const [selectedClient, setSelectedClient] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [stats, setStats] = useState({
    totalClients: 0,
    activeBuyers: 0,
    activeSellers: 0,
    newLeads: 0,
    newLeadsTrend: ''
  });
  const [typeBreakdown, setTypeBreakdown] = useState([]);

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

  const agentList = ['Sarah Connor', 'John Doe', 'Emma Watson', 'James Bond', 'Unassigned'];
  const locations = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna'];
  const followUps = ['Today', 'Tomorrow', 'Next Week', 'Overdue'];

  const showToast = (message, type = 'success') => {
    setToastMessage({ show: true, message, type });
    setTimeout(() => setToastMessage({ show: false, message: '', type: 'success' }), 3000);
  };

  const updateStatsAndCharts = (dataList) => {
    const buyers = dataList.filter(c => c.type === 'Buyer').length;
    const sellers = dataList.filter(c => c.type === 'Seller').length;
    const investors = dataList.filter(c => c.type === 'Investor').length;
    const total = dataList.length;

    let parsedNewLeads = Math.floor(total * 0.15);

    setStats({
      totalClients: total,
      activeBuyers: buyers,
      activeSellers: sellers,
      newLeads: parsedNewLeads,
      newLeadsTrend: '+ 5%'
    });

    setTypeBreakdown([
      { type: 'Buyer', value: buyers, percentage: total ? Math.round((buyers/total)*100) : 0, color: isDark ? '#cddfa0' : '#3b82f6' },
      { type: 'Seller', value: sellers, percentage: total ? Math.round((sellers/total)*100) : 0, color: isDark ? '#10b981' : '#10b981' },
      { type: 'Investor', value: investors, percentage: total ? Math.round((investors/total)*100) : 0, color: isDark ? '#f59e0b' : '#f59e0b' },
      { type: 'Other', value: total - (buyers + sellers + investors), percentage: total ? Math.round(((total - (buyers + sellers + investors))/total)*100) : 0, color: isDark ? '#8b5cf6' : '#8b5cf6' }
    ].filter(item => item.value > 0));
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); 
      try {
        const savedClients = localStorage.getItem('clientsData');
        
        if (savedClients) {
          const parsedData = JSON.parse(savedClients);
          setClients(parsedData);
          setFilteredClients(parsedData);
          updateStatsAndCharts(parsedData);
        } else {
          const timestamp = new Date().getTime();
          const response = await fetch(`/data/clientsdata.json?v=${timestamp}`, { cache: 'no-store' });
          
          if (!response.ok) throw new Error("Failed to fetch data");
          const data = await response.json();
          
          // Inject random values for CRM features if missing
          const clientsList = (Array.isArray(data) ? data : (data.clients || [])).map(c => ({
            ...c,
            status: c.status || 'Active',
            isVIP: c.isVIP || Math.random() > 0.8, // 20% chance to be VIP
            location: c.location || locations[Math.floor(Math.random() * locations.length)],
            followUp: c.followUp || followUps[Math.floor(Math.random() * followUps.length)]
          }));
          
          setClients(clientsList);
          setFilteredClients(clientsList);
          updateStatsAndCharts(clientsList);
          localStorage.setItem('clientsData', JSON.stringify(clientsList));
          setHasError(false);
        }
      } catch (error) {
        console.error('Data Fetching Error:', error.message);
        setHasError(true);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1000); 
      }
    };
    fetchData();
  }, [isDark]);

  useEffect(() => {
    let filtered = clients.filter(client => {
      const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            client.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || client.type === selectedType;
      const matchesStatus = filterStatus === 'All' || client.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        if (sortConfig.key === 'isVIP') {
            aValue = aValue ? 1 : 0;
            bValue = bValue ? 1 : 0;
        } else {
            if (typeof aValue === 'string') aValue = aValue.toLowerCase();
            if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredClients(filtered);
    setCurrentPage(1); 
    setSelectedClients([]); 
  }, [searchTerm, selectedType, filterStatus, clients, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const newSelected = currentItems.map(c => c.id);
      setSelectedClients(prev => [...new Set([...prev, ...newSelected])]);
    } else {
      const currentIds = currentItems.map(c => c.id);
      setSelectedClients(prev => prev.filter(id => !currentIds.includes(id)));
    }
  };

  const handleSelectClient = (id) => {
    setSelectedClients(prev => 
      prev.includes(id) ? prev.filter(clientId => clientId !== id) : [...prev, id]
    );
  };

  const executeBulkDelete = () => {
    const remainingClients = clients.filter(c => !selectedClients.includes(c.id));
    setClients(remainingClients);
    localStorage.setItem('clientsData', JSON.stringify(remainingClients));
    updateStatsAndCharts(remainingClients);
    showToast(`${selectedClients.length} clients deleted successfully!`, 'delete');
    setSelectedClients([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleAddClient = (newClientData) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const defaultAvatar = `https://ui-avatars.com/api/?name=${newClientData.name.replace(' ', '+')}&background=random`;
    
    const clientToAdd = {
      ...newClientData,
      id: newId,
      status: 'Active',
      assignedAgent: 'Unassigned',
      isVIP: false,
      followUp: 'Tomorrow',
      avatar: newClientData.imageLink || defaultAvatar
    };

    const updatedClients = [clientToAdd, ...clients];
    setClients(updatedClients);
    localStorage.setItem('clientsData', JSON.stringify(updatedClients)); 
    updateStatsAndCharts(updatedClients);
    setIsAddModalOpen(false);
    showToast('New client created successfully!', 'success');
  };

  const executeDelete = () => {
    if(clientToDelete) {
      const updatedClients = clients.filter(client => client.id !== clientToDelete.id);
      setClients(updatedClients);
      localStorage.setItem('clientsData', JSON.stringify(updatedClients)); 
      updateStatsAndCharts(updatedClients);
      
      const deletedName = clientToDelete.name;
      setClientToDelete(null); 
      showToast(`${deletedName} has been permanently deleted!`, 'delete');
    }
  };

  const handleTypeChange = (id, newType) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, type: newType } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    updateStatsAndCharts(updatedClients);
    showToast(`Designation updated to ${newType}!`, 'success');
  };

  const handleAgentChange = (id, newAgent) => {
    const updatedClients = clients.map(client =>
      client.id === id ? { ...client, assignedAgent: newAgent } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    showToast(`Agent assigned successfully!`, 'success');
  };

  const toggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const updatedClients = clients.map(client => 
      client.id === id ? { ...client, status: newStatus } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    showToast(`Client marked as ${newStatus}`, 'success');
  };

  // FEATURE: Toggle VIP Status
  const toggleVIP = (id) => {
    const updatedClients = clients.map(client => 
      client.id === id ? { ...client, isVIP: !client.isVIP } : client
    );
    setClients(updatedClients);
    localStorage.setItem('clientsData', JSON.stringify(updatedClients));
    showToast('VIP Status Updated!', 'success');
  };

  // FEATURE: Quick Copy to Clipboard
  const handleCopyDetails = (client) => {
    const textToCopy = `Name: ${client.name}\nEmail: ${client.email}\nPhone: ${client.phone}\nType: ${client.type}\nLocation: ${client.location}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('Client details copied!', 'success');
    });
  };

  // PDF EXPORT FIX: STRICT AUTOTABLE USAGE
  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Client Nexus - Master Directory", 14, 22);
      
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Records: ${filteredClients.length}`, 14, 30);

      const tableColumn = ["ID", "Name", "VIP", "Location", "Phone", "Type", "Status", "Follow-Up"];
      
      const tableRows = [];
      filteredClients.forEach(client => {
        const clientData = [
          client.id,
          client.name,
          client.isVIP ? "Yes" : "No",
          client.location || 'N/A',
          client.phone || 'N/A',
          client.type,
          client.status,
          client.followUp || 'N/A'
        ];
        tableRows.push(clientData);
      });

      // USING DIRECT AUTOTABLE CALL TO PREVENT ERROR
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: isDark ? [26, 74, 64] : [37, 99, 235] },
      });

      doc.save(`Client_Nexus_Report_${new Date().getTime()}.pdf`);
      showToast('PDF Exported Successfully!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Error exporting PDF. Make sure jspdf-autotable is installed.', 'delete');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleLoadMore = () => setItemsPerPage(prev => prev + 5);

  const isAllCurrentSelected = currentItems.length > 0 && currentItems.every(c => selectedClients.includes(c.id));

  if (isLoading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-500 relative overflow-hidden ${isDark ? 'bg-[#091a16]' : 'bg-[#f4f7f6]'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 dark:bg-[#cddfa0]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative z-10">
          <div className={`w-24 h-24 border-4 border-dashed rounded-full animate-[spin_3s_linear_infinite] ${isDark ? 'border-[#1a4a40]' : 'border-blue-100'}`}></div>
          <div className={`w-24 h-24 border-4 border-t-transparent rounded-full animate-[spin_1s_ease-in-out_infinite] absolute top-0 left-0 ${isDark ? 'border-[#cddfa0]' : 'border-blue-600'}`}></div>
          <ShieldCheck className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-lg ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`} size={28} />
        </div>
        <p className="mt-8 text-sm font-black tracking-[0.3em] uppercase bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65] animate-pulse">Initializing Data...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center text-center p-6 ${isDark ? 'bg-[#091a16]' : 'bg-[#f4f7f6]'}`}>
        <div className="w-28 h-28 mb-6 rounded-3xl bg-rose-100/50 dark:bg-rose-900/20 flex items-center justify-center border border-rose-200 dark:border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.15)] relative overflow-hidden">
           <div className="absolute inset-0 bg-rose-500/10 blur-xl animate-pulse"></div>
          <Users className="text-rose-500 relative z-10" size={40} />
        </div>
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Connection Lost</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
          Unable to establish connection with <code className="bg-gray-200 dark:bg-[#133c34] text-gray-800 dark:text-[#cddfa0] px-2 py-0.5 rounded-md font-bold">clientsdata.json</code>. Please verify data source.
        </p>
        <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-2xl hover:scale-105 transition-all font-black text-xs uppercase tracking-widest shadow-xl">
          Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 md:p-6 lg:p-8 min-h-screen transition-colors duration-500 relative overflow-hidden pb-24 ${isDark ? 'bg-[#091a16] text-gray-100' : 'bg-[#f4f7f6] text-gray-900'}`}>
      
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-[#cddfa0]/5 dark:to-transparent rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tl from-purple-500/5 to-transparent dark:from-[#1a4a40]/30 dark:to-transparent rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 max-w-[1400px] mx-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* RESPONSIVE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 lg:mb-12 pb-8 border-b border-gray-200/60 dark:border-[#1a4a40]/50">
          <div className="w-full md:w-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 dark:bg-[#133c34]/60 backdrop-blur-md border border-gray-200/50 dark:border-[#1a4a40] mb-5 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 dark:text-gray-300">Live Client Node</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter mb-2">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-[#cddfa0] dark:to-[#8b9c65]">Nexus</span>
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold tracking-wide uppercase">Centralized Relationship Management</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={exportToPDF}
              className={`flex items-center justify-center w-full sm:w-auto gap-2 px-6 py-3.5 sm:py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-300 border ${
                isDark 
                  ? 'bg-[#133c34]/50 hover:bg-[#1a4a40] border-[#1a4a40] text-[#cddfa0]' 
                  : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 shadow-sm'
              }`}
              title="Download directory as PDF"
            >
              <FileText size={18} className={isDark ? "text-[#cddfa0]" : "text-rose-500"} />
              Export PDF
            </button>

            {/* BUTTON TEXT CHANGED HERE */}
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="relative group overflow-hidden flex items-center w-full sm:w-auto justify-center gap-2 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-[#cddfa0] dark:to-[#aebf85] text-white dark:text-[#091a16] rounded-2xl font-black shadow-[0_8px_20px_rgba(37,99,235,0.25)] dark:shadow-[0_8px_20px_rgba(205,223,160,0.2)] hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)] dark:hover:shadow-[0_8px_30px_rgba(205,223,160,0.4)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 dark:bg-black/10 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out] z-0"></div>
              <Plus size={20} className="relative z-10" /> 
              <span className="relative z-10">Add to Client</span> 
            </button>
          </div>
        </div>

        {/* RESPONSIVE STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
          <div className="group relative bg-white/70 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/50 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-gray-200/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 dark:bg-[#cddfa0]/5 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.2rem] bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-[#1a4a40] dark:to-[#0f2e28] flex items-center justify-center border border-white dark:border-[#1a4a40] shadow-sm group-hover:rotate-6 transition-transform duration-300">
                <Users size={24} className="text-blue-600 dark:text-[#cddfa0]" />
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-1 sm:mb-2 relative z-10">Total Clients</p>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10">{stats.totalClients}</h3>
          </div>

          <div className="group relative bg-white/70 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/50 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-gray-200/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-emerald-500/10 dark:bg-emerald-400/5 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.2rem] bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-[#0f2e28] flex items-center justify-center border border-white dark:border-[#1a4a40] shadow-sm group-hover:rotate-6 transition-transform duration-300">
                <Target size={24} className="text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-1 sm:mb-2 relative z-10">Active Buyers</p>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10">{stats.activeBuyers}</h3>
          </div>

          <div className="group relative bg-white/70 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/50 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-gray-200/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-amber-500/10 dark:bg-amber-400/5 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="flex justify-between items-start mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.2rem] bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-[#0f2e28] flex items-center justify-center border border-white dark:border-[#1a4a40] shadow-sm group-hover:rotate-6 transition-transform duration-300">
                <TrendingUp size={24} className="text-amber-500 dark:text-amber-400" />
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] mb-1 sm:mb-2 relative z-10">Active Sellers</p>
            <h3 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tighter relative z-10">{stats.activeSellers}</h3>
          </div>

          <div className="group relative bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-[#1a4a40] dark:to-[#0f2e28] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-7 shadow-xl shadow-blue-500/30 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-white/10 dark:border-[#1a4a40]">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="flex items-start justify-between relative z-10 h-full">
              <div className="flex flex-col h-full justify-between">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-[1.2rem] bg-white/20 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center border border-white/30 dark:border-white/10 mb-4">
                  <Activity size={20} className="text-white dark:text-[#cddfa0]" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-200 dark:text-gray-400 uppercase tracking-[0.25em] mb-1">New Leads</p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl sm:text-4xl font-black text-white dark:text-[#cddfa0]">{stats.newLeads}</h3>
                  </div>
                </div>
              </div>
              <div className="w-20 h-20 sm:w-24 sm:h-24 opacity-90 drop-shadow-2xl">
                <DonutChart data={typeBreakdown} isDark={isDark} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-gray-200/40 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col justify-center relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 text-center flex items-center justify-center gap-2">
              <Target size={14} /> Pipeline Conversion
            </h3>
            <DynamicFunnelChart clients={clients} isDark={isDark} />
          </div>

          <div className="bg-white/80 dark:bg-[#133c34]/50 backdrop-blur-2xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2.5rem] p-6 sm:p-8 shadow-xl shadow-gray-200/40 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] lg:col-span-2 relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 flex items-center gap-2">
              <Activity size={14} /> Portfolio Distribution
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 h-full items-center pb-2">
              {typeBreakdown.map((type, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-[2rem] bg-gray-50/80 dark:bg-[#0f2e28]/50 border border-gray-100 dark:border-[#1a4a40]/50 hover:bg-white dark:hover:bg-[#1a4a40]/40 transition-colors shadow-sm group">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
                    <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="42" fill="none" stroke={isDark ? '#1a4a40' : '#f1f5f9'} strokeWidth="8" />
                      <circle
                        cx="50" cy="50" r="42" fill="none" stroke={type.color} strokeWidth="8"
                        strokeDasharray={`${type.percentage * 2.64} 264`}
                        strokeLinecap="round"
                        className="animate-[dash_1.5s_ease-out_forwards] drop-shadow-[0_0_8px_currentColor]"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">{type.percentage}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{type.type}</p>
                    <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white group-hover:scale-110 transition-transform">{type.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAIN DIRECTORY DATA - FULLY RESPONSIVE */}
        <div className="bg-white/90 dark:bg-[#133c34]/50 backdrop-blur-3xl border border-white/60 dark:border-[#1a4a40]/60 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl shadow-gray-200/40 dark:shadow-[0_15px_50px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden relative w-full">
          
          <div className="p-4 sm:p-6 md:p-8 border-b border-gray-100 dark:border-[#1a4a40]/50 flex flex-col gap-4 sm:gap-6 bg-gray-50/30 dark:bg-transparent">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
                Client Directory
                <span className="text-[9px] sm:text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-[#1a4a40] dark:text-[#cddfa0] px-2.5 py-1 rounded-lg tracking-widest uppercase">{filteredClients.length} Records</span>
              </h3>

              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 sm:py-3.5 bg-white dark:bg-[#0f2e28] border border-gray-200/80 dark:border-[#1a4a40] rounded-xl sm:rounded-[1.2rem] text-xs font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-[#cddfa0]/50 transition-all shadow-sm"
                />
              </div>
            </div>

            {/* RESPONSIVE MULTI-FILTER BAR */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center gap-3 w-full bg-white/50 dark:bg-[#0f2e28]/30 p-2 sm:p-3 rounded-xl sm:rounded-[1.2rem] border border-gray-100 dark:border-[#1a4a40]/50">
              <div className="flex items-center gap-2 px-2 xl:pr-3 xl:border-r border-gray-200 dark:border-[#1a4a40] w-full xl:w-auto">
                <Filter size={14} className="text-gray-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Filters:</span>
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full xl:w-auto">
                <div className="flex gap-1 overflow-x-auto force-scrollbar pb-1 w-full sm:w-auto flex-1">
                  {['All', 'Buyer', 'Seller', 'Investor'].map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 sm:px-4 py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] rounded-lg transition-all duration-300 whitespace-nowrap flex-1 sm:flex-none ${
                        selectedType === type
                          ? 'bg-blue-600 text-white dark:bg-[#cddfa0] dark:text-[#091a16] shadow-md'
                          : 'bg-gray-100 dark:bg-[#1a4a40]/50 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1a4a40]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <div className="relative w-full sm:w-auto">
                    <select 
                      value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full sm:w-36 appearance-none bg-gray-100 dark:bg-[#1a4a40]/50 border border-transparent dark:border-[#1a4a40] px-3 sm:px-4 py-2 rounded-lg text-[9px] sm:text-[10px] font-black text-gray-600 dark:text-gray-300 uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-200 dark:hover:bg-[#1a4a40]"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active Only</option>
                      <option value="Inactive">Inactive Only</option>
                    </select>
                    <ChevronDown size={12} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TABLE AREA - FULLY RESPONSIVE WITH DRAG SCROLL */}
          <div className="w-full flex flex-col relative group">
            
            {/* Mobile Scroll Hint */}
            <div className="md:hidden flex items-center justify-end gap-1.5 px-4 sm:px-6 pb-2 text-[9px] sm:text-[10px] font-black text-blue-500 dark:text-[#cddfa0] uppercase tracking-widest animate-pulse">
              <span>Swipe or drag to view more</span>
              <ChevronRight size={14} />
            </div>

            <div className="relative w-full">
              {/* Fade Effect on the right side to indicate overflow on mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#0f2e28] to-transparent pointer-events-none z-10 md:hidden"></div>

              {/* Added Drag Event Handlers and Ref */}
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
                    <tr className="bg-gray-50/50 dark:bg-[#0f2e28]/70 border-b border-gray-100 dark:border-[#1a4a40]/80">
                      <th className="pl-6 sm:pl-8 pr-4 py-4 sm:py-5 w-12 sm:w-16">
                        <label className="flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            onChange={handleSelectAll} 
                            checked={isAllCurrentSelected && currentItems.length > 0}
                            className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-gray-300 dark:border-[#1a4a40] text-blue-600 dark:text-[#cddfa0] focus:ring-blue-500 dark:focus:ring-[#cddfa0]/50 transition-all cursor-pointer ${isDark ? 'bg-[#133c34]' : 'bg-white'}`}
                          />
                        </label>
                      </th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 dark:hover:text-[#cddfa0] transition-colors" onClick={() => requestSort('name')}>
                        <div className="flex items-center gap-1 sm:gap-2">Profile Info <ArrowUpDown size={12} className={sortConfig.key === 'name' ? 'opacity-100' : 'opacity-30'} /></div>
                      </th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 dark:hover:text-[#cddfa0] transition-colors" onClick={() => requestSort('type')}>
                        <div className="flex items-center gap-1 sm:gap-2">Designation <ArrowUpDown size={12} className={sortConfig.key === 'type' ? 'opacity-100' : 'opacity-30'} /></div>
                      </th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Contact Details</th>
                      <th className="px-4 sm:px-6 py-4 sm:py-5 text-left text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600 dark:hover:text-[#cddfa0] transition-colors" onClick={() => requestSort('status')}>
                        <div className="flex items-center gap-1 sm:gap-2">Follow-up & Status <ArrowUpDown size={12} className={sortConfig.key === 'status' ? 'opacity-100' : 'opacity-30'} /></div>
                      </th>
                      <th className="px-6 sm:px-8 py-4 sm:py-5 text-right text-[9px] sm:text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-[#1a4a40]/50 relative">
                    {currentItems.map((client, index) => (
                      <tr 
                        key={client.id} 
                        className={`hover:bg-blue-50/30 dark:hover:bg-[#1a4a40]/60 transition-colors group animate-in fade-in ${selectedClients.includes(client.id) ? 'bg-blue-50/50 dark:bg-[#1a4a40]/40' : ''}`}
                        style={{ animationDelay: `${index * 40}ms` }}
                      >
                        <td className="pl-6 sm:pl-8 pr-4 py-4">
                          <label className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedClients.includes(client.id)}
                              onChange={() => handleSelectClient(client.id)}
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border-gray-300 dark:border-[#1a4a40] text-blue-600 dark:text-[#cddfa0] focus:ring-blue-500 dark:focus:ring-[#cddfa0]/50 transition-all cursor-pointer ${isDark ? 'bg-[#133c34]' : 'bg-white'}`}
                            />
                          </label>
                        </td>

                        <td className="px-4 sm:px-6 py-4 min-w-[220px]">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className="relative shrink-0">
                              <img src={client.avatar || `https://ui-avatars.com/api/?name=${client.name}&background=random`} alt={client.name} draggable="false" className="w-10 h-10 sm:w-12 sm:h-12 rounded-[1rem] border-2 border-white dark:border-[#1a4a40] shadow-sm object-cover group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300" />
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white dark:border-[#133c34] rounded-full ${client.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                            </div>
                            <div className="overflow-hidden">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="block text-xs sm:text-sm font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-[#cddfa0] transition-colors truncate">{client.name}</span>
                                {/* VIP PRIORITY TOGGLE */}
                                <button onClick={() => toggleVIP(client.id)} className="focus:outline-none hover:scale-110 transition-transform" title={client.isVIP ? "Remove VIP" : "Mark as VIP"}>
                                  <Star size={14} className={client.isVIP ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600 hover:text-amber-200"} />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 tracking-wider">ID: {String(client.id).padStart(5, '0')}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                                <span className="flex items-center gap-1 text-[9px] font-bold text-gray-500 dark:text-gray-400">
                                  <MapPin size={9} className="text-rose-500" /> {client.location}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-4 sm:px-6 py-4">
                          <div className="relative group/dropdown inline-block w-[100px] sm:w-[110px]">
                            <select
                              value={client.type}
                              onChange={(e) => handleTypeChange(client.id, e.target.value)}
                              className={`w-full appearance-none outline-none cursor-pointer pr-7 sm:pr-8 pl-2 sm:pl-3 py-1.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] shadow-sm border transition-all duration-300 focus:ring-2 ${
                                client.type === 'Buyer' ? 'bg-blue-50 text-blue-600 dark:bg-[#0f2e28] dark:text-blue-400 border-blue-100 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-400/50 focus:ring-blue-500/20' :
                                client.type === 'Seller' ? 'bg-emerald-50 text-emerald-600 dark:bg-[#0f2e28] dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 hover:border-emerald-300 dark:hover:border-emerald-400/50 focus:ring-emerald-500/20' :
                                'bg-amber-50 text-amber-600 dark:bg-[#0f2e28] dark:text-amber-400 border-amber-100 dark:border-amber-500/20 hover:border-amber-300 dark:hover:border-amber-400/50 focus:ring-amber-500/20'
                              }`}
                            >
                              <option value="Buyer" className="bg-white dark:bg-[#0a2e26] text-blue-600 dark:text-blue-400 font-bold">Buyer</option>
                              <option value="Seller" className="bg-white dark:bg-[#0a2e26] text-emerald-600 dark:text-emerald-400 font-bold">Seller</option>
                              <option value="Investor" className="bg-white dark:bg-[#0a2e26] text-amber-600 dark:text-amber-400 font-bold">Investor</option>
                            </select>
                            <ChevronDown size={12} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none group-hover/dropdown:translate-y-0.5 transition-transform duration-300" />
                          </div>
                        </td>
                        
                        <td className="px-4 sm:px-6 py-4">
                          <div className="space-y-2.5">
                            <a href={`mailto:${client.email}`} draggable="false" className="text-[10px] sm:text-xs font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 group/mail cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors w-max" title="Send Email">
                              <div className="w-5 h-5 sm:w-6 h-6 rounded-md bg-gray-100 dark:bg-[#1a4a40] flex items-center justify-center group-hover/mail:bg-blue-100 dark:group-hover/mail:bg-[#0f2e28] transition-colors border border-transparent dark:border-[#1a4a40]/50 shadow-sm">
                                <Mail size={10} className="text-gray-500 dark:text-gray-400 group-hover/mail:text-blue-600 dark:group-hover/mail:text-blue-400" />
                              </div>
                              {client.email}
                            </a>
                            <a href={`https://wa.me/${client.phone?.replace(/\D/g, '')}`} draggable="false" target="_blank" rel="noopener noreferrer" className="text-[9px] sm:text-[11px] font-medium text-gray-500 flex items-center gap-2 group/phone hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors w-max" title="Chat on WhatsApp">
                              <div className="w-5 h-5 sm:w-6 h-6 rounded-md bg-gray-100 dark:bg-[#1a4a40] flex items-center justify-center group-hover/phone:bg-emerald-100 dark:group-hover/phone:bg-emerald-900/30 border border-transparent dark:border-[#1a4a40]/50 transition-colors shadow-sm">
                                <Phone size={10} className="text-gray-400 group-hover/phone:text-emerald-600 dark:group-hover/phone:text-emerald-400" />
                              </div>
                              {client.phone || 'No phone added'}
                            </a>
                          </div>
                        </td>

                        <td className="px-4 sm:px-6 py-4 min-w-[160px]">
                          <div className="flex flex-col gap-3">
                            <button 
                              onClick={() => toggleStatus(client.id, client.status)}
                              className={`inline-flex items-center w-max px-2 py-1 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest transition-all hover:scale-105 border shadow-sm ${
                                client.status === 'Active' 
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-500/20' 
                                  : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-800'
                              }`}
                              title="Click to toggle status"
                            >
                              <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${client.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                              {client.status}
                            </button>

                            <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-gray-500 dark:text-gray-400">Next Action:</span>
                              <span className={`${
                                client.followUp === 'Overdue' ? 'text-rose-500' :
                                client.followUp === 'Today' ? 'text-amber-500' : 'text-emerald-500'
                              }`}>{client.followUp}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 sm:px-8 py-4">
                          <div className="flex justify-end gap-1.5 sm:gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                            
                            <button 
                              onClick={() => handleCopyDetails(client)} 
                              className="p-2 sm:p-2.5 bg-white dark:bg-[#1a4a40] hover:bg-blue-50 dark:hover:bg-[#0f2e28] border border-gray-200/80 dark:border-[#1a4a40]/80 rounded-xl transition-all hover:scale-110 shadow-sm text-gray-600 dark:text-gray-300" 
                              title="Copy Info"
                            >
                              <Copy size={14} />
                            </button>

                            <button 
                              onClick={() => {
                                setSelectedClient(client);
                                setIsProfileModalOpen(true);
                              }} 
                              className="p-2 sm:p-2.5 bg-white dark:bg-[#1a4a40] hover:bg-blue-50 dark:hover:bg-[#0f2e28] border border-gray-200/80 dark:border-[#1a4a40]/80 rounded-xl transition-all hover:scale-110 shadow-sm text-gray-600 dark:text-gray-300" 
                              title="View Full Profile"
                            >
                              <Eye size={14} />
                            </button>
                            
                            <button 
                              onClick={() => setClientToDelete(client)} 
                              className="p-2 sm:p-2.5 bg-white dark:bg-[#1a4a40] hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-gray-200/80 dark:border-[#1a4a40]/80 hover:dark:border-rose-500/30 rounded-xl transition-all hover:scale-110 shadow-sm text-rose-500 dark:text-gray-300 dark:hover:text-rose-400" 
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    
                    {currentItems.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center py-16">
                          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 dark:bg-[#1a4a40]/40 border border-gray-100 dark:border-[#1a4a40]/50 mb-4 relative overflow-hidden shadow-inner">
                            <div className="absolute inset-0 bg-blue-500/5 dark:bg-[#cddfa0]/5 rounded-full blur-xl"></div>
                            <Search size={24} className="text-gray-400 relative z-10" />
                          </div>
                          <p className="text-sm font-black text-gray-900 dark:text-white mb-1">No Data Found</p>
                          <p className="text-xs text-gray-500 font-medium">Try adjusting your filters or search term.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {filteredClients.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-[#1a4a40]/50 flex flex-col sm:flex-row items-center justify-center gap-4 bg-gray-50/30 dark:bg-[#0f2e28]/40">
              <div className="flex items-center gap-1 sm:gap-2 bg-white dark:bg-[#133c34]/50 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-[#1a4a40]/50 shadow-sm w-full sm:w-auto justify-center">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a4a40]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex items-center gap-1 px-1 sm:px-2">
                  {[...Array(totalPages)].map((_, i) => {
                    if (i === 0 || i === totalPages - 1 || (i >= currentPage - 2 && i <= currentPage)) {
                       return (
                        <button
                          key={i}
                          onClick={() => paginate(i + 1)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md sm:rounded-lg text-xs sm:text-sm font-bold transition-all ${
                            currentPage === i + 1 
                            ? 'bg-gray-800 text-white dark:bg-[#1a4a40] dark:text-[#cddfa0] shadow-md border dark:border-[#cddfa0]/30' 
                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a4a40]/60'
                          }`}
                        >
                          {i + 1}
                        </button>
                      );
                    } else if (i === 1 && currentPage > 3 || i === totalPages - 2 && currentPage < totalPages - 2) {
                       return <span key={i} className="text-gray-400 px-0.5 sm:px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-[#1a4a40]/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              <button 
                onClick={handleLoadMore}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-sm w-full sm:w-auto ${
                  isDark ? 'border-[#1a4a40] text-gray-300 bg-[#133c34]/50 hover:bg-[#1a4a40]' : 'bg-gray-800 text-white hover:bg-gray-700 border-gray-700'
                }`}
              >
                Load More
              </button>
            </div>
          )}

          {/* BULK ACTION FLOATING BAR */}
          {selectedClients.length > 0 && (
            <div className="fixed bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 z-[90] animate-in slide-in-from-bottom-10 fade-in duration-300 w-[90%] sm:w-auto max-w-md">
              <div className={`flex items-center justify-between sm:justify-start gap-3 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-[2rem] shadow-2xl border backdrop-blur-xl ${isDark ? 'bg-[#0a2e26]/95 border-[#cddfa0]/30 shadow-[0_20px_50px_rgba(205,223,160,0.15)]' : 'bg-white/95 border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)]'}`}>
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full font-black text-xs sm:text-sm ${isDark ? 'bg-[#cddfa0] text-[#091a16]' : 'bg-blue-600 text-white'}`}>
                    {selectedClients.length}
                  </div>
                  <span className="text-[10px] sm:text-sm font-bold text-gray-800 dark:text-gray-200 hidden sm:inline">Clients Selected</span>
                </div>
                <div className="w-[1px] h-6 sm:h-8 bg-gray-200 dark:bg-[#1a4a40] shrink-0"></div>
                <button 
                  onClick={() => setIsBulkDeleteModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black uppercase tracking-widest text-white bg-rose-500 hover:bg-rose-600 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap w-full sm:w-auto"
                >
                  <Trash2 size={14} />
                  Delete All
                </button>
                <button onClick={() => setSelectedClients([])} className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors shrink-0">
                  <X size={18} />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <AddClientModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={handleAddClient}
        isDark={isDark}
      />

      <ClientProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        client={selectedClient}
        isDark={isDark}
      />

      {/* SINGLE DELETE MODAL */}
      {clientToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setClientToDelete(null)}
          ></div>
          <div className={`relative w-full max-w-sm p-6 sm:p-8 text-center rounded-[2rem] sm:rounded-[2.5rem] border animate-in zoom-in-95 duration-200 shadow-2xl ${
            isDark ? 'bg-[#050f0d] border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]' : 'bg-white border-rose-200 shadow-[0_0_50px_rgba(244,63,94,0.15)]'
          }`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-rose-100 dark:border-rose-500/20 relative">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
              <AlertTriangle className="text-rose-500 relative z-10" size={28} />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Delete Client?</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Are you sure you want to permanently remove <span className="font-bold text-gray-700 dark:text-gray-300">{clientToDelete.name}</span>? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setClientToDelete(null)}
                className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-gray-100 dark:bg-[#1a4a40] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#133c34] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete}
                className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:-translate-y-0.5"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DELETE MODAL */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsBulkDeleteModalOpen(false)}
          ></div>
          <div className={`relative w-full max-w-sm p-6 sm:p-8 text-center rounded-[2rem] sm:rounded-[2.5rem] border animate-in zoom-in-95 duration-200 shadow-2xl ${
            isDark ? 'bg-[#050f0d] border-rose-500/30 shadow-[0_0_50px_rgba(244,63,94,0.15)]' : 'bg-white border-rose-200 shadow-[0_0_50px_rgba(244,63,94,0.15)]'
          }`}>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-5 border border-rose-100 dark:border-rose-500/20 relative">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
              <AlertTriangle className="text-rose-500 relative z-10" size={28} />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Bulk Delete</h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              You are about to delete <span className="font-black text-rose-500">{selectedClients.length} clients</span>. This action is permanent and cannot be reversed.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setIsBulkDeleteModalOpen(false)}
                className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-gray-100 dark:bg-[#1a4a40] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#133c34] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeBulkDelete}
                className="flex-1 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-wider bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] transition-all hover:-translate-y-0.5"
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage.show && (
        <div className={`fixed bottom-6 sm:bottom-8 right-4 sm:right-8 z-[150] flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 ${
          toastMessage.type === 'delete' 
            ? 'bg-rose-500 text-white shadow-[0_10px_40px_rgba(244,63,94,0.3)]' 
            : 'bg-gray-900/95 dark:bg-[#133c34]/95 text-white shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-gray-700 dark:border-[#1a4a40]'
        }`}>
          {toastMessage.type === 'delete' ? (
            <Trash2 size={16} className="sm:w-5 sm:h-5" />
          ) : (
            <CheckCircle size={16} className="text-emerald-400 sm:w-5 sm:h-5" />
          )}
          <p className="font-black text-[9px] sm:text-[11px] uppercase tracking-widest">{toastMessage.message}</p>
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

// DYNAMIC FUNNEL CHART
function DynamicFunnelChart({ clients, isDark }) {
  const counts = { Buyer: 0, Seller: 0, Investor: 0, Other: 0 };
  clients.forEach(c => { if(counts[c.type] !== undefined) counts[c.type]++; else counts.Other++; });
  
  const rawData = [
    { label: 'Buyers', count: counts.Buyer, bgClass: isDark ? 'bg-[#cddfa0]' : 'bg-blue-600', textClass: isDark ? 'text-[#091a16]' : 'text-white' },
    { label: 'Sellers', count: counts.Seller, bgClass: isDark ? 'bg-[#94a894]' : 'bg-emerald-500', textClass: isDark ? 'text-[#091a16]' : 'text-white' },
    { label: 'Investors', count: counts.Investor, bgClass: isDark ? 'bg-[#1a4a40]' : 'bg-amber-500', textClass: 'text-white' },
    { label: 'Others', count: counts.Other, bgClass: isDark ? 'bg-[#0f2e28]' : 'bg-gray-500', textClass: 'text-white' }
  ].filter(d => d.count > 0).sort((a, b) => b.count - a.count);

  const maxCount = rawData.length > 0 ? rawData[0].count : 1;

  if(rawData.length === 0) return <p className="text-center text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-500">No Data Available</p>;

  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
      {rawData.map((item, index) => {
        const widthPercent = Math.max(35, (item.count / maxCount) * 100);
        return (
          <div key={index} className="w-full flex justify-center group relative perspective-1000">
            <div 
              style={{ width: `${widthPercent}%` }} 
              className={`h-8 sm:h-10 md:h-12 ${item.bgClass} rounded-xl sm:rounded-[1rem] flex items-center justify-between px-4 sm:px-5 shadow-lg group-hover:scale-105 transition-all duration-300 relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              <span className={`font-black text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.2em] relative z-10 ${item.textClass}`}>{item.label}</span>
              <span className={`font-black text-xs sm:text-sm md:text-base relative z-10 ${item.textClass}`}>{item.count}</span>
            </div>
            {index < rawData.length - 1 && (
              <div className="absolute -bottom-3 sm:-bottom-4 w-[2px] h-3 sm:h-4 bg-gray-200 dark:bg-[#1a4a40] z-0"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// DONUT CHART 
function DonutChart({ data, isDark }) {
  if (!data || data.length === 0) return null;
  let currentAngle = -90;
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
      {data.map((item, idx) => {
        const sliceAngle = (item.percentage / 100) * 360;
        if(sliceAngle === 0) return null;

        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        
        const x1 = 50 + 45 * Math.cos(startRad);
        const y1 = 50 + 45 * Math.sin(startRad);
        const x2 = 50 + 45 * Math.cos(endRad);
        const y2 = 50 + 45 * Math.sin(endRad);
        const x3 = 50 + 30 * Math.cos(endRad);
        const y3 = 50 + 30 * Math.sin(endRad);
        const x4 = 50 + 30 * Math.cos(startRad);
        const y4 = 50 + 30 * Math.sin(startRad);

        const largeArc = sliceAngle > 180 ? 1 : 0;
        currentAngle = endAngle;
        const path = `M ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A 30 30 0 ${largeArc} 0 ${x4} ${y4} Z`;
        
        return (
          <path 
            key={idx} 
            d={path} 
            fill={item.color} 
            stroke={isDark ? '#1a4a40' : 'transparent'} 
            strokeWidth="1.5"
            className="hover:opacity-80 transition-all duration-300 cursor-crosshair transform hover:scale-105 origin-center"
          >
            <title>{item.type}: {item.percentage}%</title>
          </path>
        );
      })}
    </svg>
  );
}