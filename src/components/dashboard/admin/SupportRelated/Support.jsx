"use client";

import React from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { 
  LifeBuoy, MessageCircle, Mail, Phone, 
  ExternalLink, ArrowRight, ShieldAlert, Zap 
} from 'lucide-react';

export default function Support() {
  const { isDark } = useTheme();

  const SupportCard = ({ icon: Icon, title, description, buttonText, color }) => (
    <div className={`p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl group hover:scale-105 ${
      isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-white border-gray-200'
    }`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform group-hover:rotate-12`} style={{ backgroundColor: `${color}15`, color }}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black tracking-tight mb-3">{title}</h3>
      <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      <button className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:gap-4`} style={{ color }}>
        {buttonText}
        <ArrowRight size={14} />
      </button>
    </div>
  );

  return (
    <div suppressHydrationWarning className={`max-w-6xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex flex-col gap-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/20">
            <LifeBuoy size={14} />
            Support Center
          </div>
          <h1 className="text-4xl font-black tracking-tight mb-4">How can we help you?</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Our technical team is ready to assist you with any platform issues or inquiries.</p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <SupportCard 
            icon={MessageCircle}
            title="Live Chat"
            description="Real-time assistance from our support agents for urgent issues."
            buttonText="Start Chat"
            color="#10B981"
          />
          <SupportCard 
            icon={Mail}
            title="Email Ticket"
            description="Submit a detailed ticket for technical investigations."
            buttonText="Send Email"
            color="#3B82F6"
          />
          <SupportCard 
            icon={Phone}
            title="Phone Support"
            description="Priority voice support for Enterprise administrators."
            buttonText="Call Now"
            color="#8B5CF6"
          />
        </div>

        {/* Resources Section */}
        <div className={`relative p-10 rounded-[3rem] border backdrop-blur-xl transition-all duration-500 shadow-xl overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-[var(--card)] to-[var(--background)] border-white/10' : 'bg-emerald-900 border-emerald-800 text-white'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="max-w-md">
              <h2 className={`text-3xl font-black tracking-tight mb-4 ${!isDark && 'text-white'}`}>Platform Documentation</h2>
              <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-gray-400' : 'text-emerald-100/60'}`}>
                Explore our comprehensive guides and API references to master the Urban Estate admin dashboard and its powerful features.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 ${
                  isDark ? 'bg-[var(--card)] text-emerald-500 border border-white/10 hover:bg-emerald-500/10' : 'bg-white text-emerald-900 hover:bg-emerald-50 shadow-xl shadow-black/20'
                }`}>
                  <ExternalLink size={16} />
                  Developer Docs
                </button>
                <button className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 ${
                  isDark ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-emerald-700 text-white hover:bg-emerald-800'
                }`}>
                  <Zap size={16} />
                  Knowledge Base
                </button>
              </div>
            </div>
            <div className="relative w-full max-w-[300px]">
              <div className={`absolute -inset-10 blur-3xl rounded-full opacity-30 ${isDark ? 'bg-emerald-500' : 'bg-white'}`}></div>
              <ShieldAlert className={`w-full h-auto relative z-10 ${isDark ? 'text-emerald-500/20' : 'text-white/20'}`} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

