"use client";

import React, { useState } from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { 
  HelpCircle, Search, ChevronRight, BookOpen, 
  Settings, UserPlus, Home, CreditCard, ChevronDown 
} from 'lucide-react';

export default function Help() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('getting_started');
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = {
    getting_started: [
      { q: "How do I approve new property listings?", a: "Go to the Properties section from the sidebar. You will see a list of all properties. For those with 'Pending' status, click on the Action button to approve or reject them." },
      { q: "Where can I manage user roles?", a: "User roles can be managed in the Users section. You can upgrade a regular user to a seller or restrict access if needed." }
    ],
    account: [
      { q: "How to reset my admin password?", a: "Admin password resets can be initiated from the login page by clicking 'Forgot Password' or by contacting the system owner." },
      { q: "Can I have multiple admin accounts?", a: "Yes, you can add more admins from the User Management section by assigning the 'admin' role to existing users." }
    ],
    billing: [
      { q: "Where are transaction logs kept?", a: "All platform sales and transactions are logged in the Analytics section under the 'Sales' module." },
      { q: "How to configure commission rates?", a: "Commission rates for sellers can be adjusted in the System Settings under 'Billing Configuration'." }
    ]
  };

  const HelpSection = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
        activeTab === id 
          ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/20' 
          : (isDark ? 'bg-[var(--card)]/40 border-white/10 text-gray-400 hover:bg-[var(--card)]' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50')
      }`}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight size={16} className={`transition-transform ${activeTab === id ? 'rotate-90' : ''}`} />
    </button>
  );

  return (
    <div suppressHydrationWarning className={`max-w-6xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex flex-col gap-10">
        
        {/* Hero Section */}
        <div className={`relative p-12 rounded-[3rem] border backdrop-blur-xl overflow-hidden shadow-2xl ${
          isDark ? 'bg-gradient-to-br from-[var(--card)] to-[var(--background)] border-white/10' : 'bg-emerald-900 border-emerald-800 text-white'
        }`}>
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h1 className="text-4xl font-black tracking-tight mb-8">Help Center & Documentation</h1>
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for guides, features or troubleshooting..."
                className={`w-full pl-16 pr-8 py-5 rounded-[2rem] border outline-none transition-all text-sm ${
                  isDark ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500' : 'bg-white border-white text-gray-900 shadow-2xl shadow-black/20 focus:shadow-emerald-500/20'
                }`}
              />
            </div>
          </div>
          <HelpCircle className={`absolute -right-10 -bottom-10 w-64 h-64 opacity-5 ${isDark ? 'text-white' : 'text-white'}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="space-y-3">
            <HelpSection id="getting_started" icon={BookOpen} label="Getting Started" />
            <HelpSection id="account" icon={Settings} label="Account & Access" />
            <HelpSection id="billing" icon={CreditCard} label="Billing & Payouts" />
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-4">
            {faqs[activeTab].map((faq, index) => (
              <div key={index} className={`p-8 rounded-[2rem] border transition-all hover:shadow-xl ${
                isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className="text-lg font-black tracking-tight mb-4 flex items-start gap-4">
                  <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-xs shrink-0">Q</span>
                  {faq.q}
                </h3>
                <p className={`text-sm leading-relaxed pl-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {faq.a}
                </p>
              </div>
            ))}

            {/* Empty Search Fallback */}
            {faqs[activeTab].length === 0 && (
              <div className="text-center py-20 opacity-40">
                <Search size={48} className="mx-auto mb-4" />
                <p className="text-sm font-black uppercase tracking-[0.3em]">No results found</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

