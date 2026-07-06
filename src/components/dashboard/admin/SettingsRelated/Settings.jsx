"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { 
  Settings as SettingsIcon, Shield, Bell, Globe, 
  Database, Save, Loader2, ToggleLeft, ToggleRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    propertyApprovalRequired: true,
    siteName: '',
    contactEmail: ''
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('System settings updated');
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ enabled, onChange, label, description, icon: Icon }) => (
    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
      isDark ? 'bg-[var(--card)]/50 border-white/10' : 'bg-gray-50/50 border-gray-100'
    }`}>
      <div className="flex gap-4 items-center">
        <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600'}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-bold">{label}</p>
          <p className={`text-[10px] uppercase tracking-wider font-bold opacity-50`}>{description}</p>
        </div>
      </div>
      <button 
        onClick={() => onChange(!enabled)}
        className={`transition-colors duration-300 ${enabled ? 'text-emerald-500' : 'text-gray-400'}`}
      >
        {enabled ? <ToggleRight size={32} fill="currentColor" fillOpacity={0.2} /> : <ToggleLeft size={32} />}
      </button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className={`max-w-5xl mx-auto ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-end mb-2">
          <div>
            <h1 className="text-3xl font-black tracking-tight">System Configuration</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Global platform settings and administrative controls.</p>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isSaving}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-[10px] hover:bg-emerald-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={16} />}
            Deploy Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Settings */}
          <div className={`lg:col-span-2 space-y-6 relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl ${
            isDark ? 'bg-gradient-to-b from-[var(--card)]/80 to-[var(--background)] border-white/10' : 'bg-white/80 border-gray-200'
          }`}>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">General Controls</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Toggle 
                enabled={settings.maintenanceMode} 
                onChange={(v) => setSettings({...settings, maintenanceMode: v})}
                label="Maintenance Mode"
                description="Disable public access"
                icon={Shield}
              />
              <Toggle 
                enabled={settings.allowRegistration} 
                onChange={(v) => setSettings({...settings, allowRegistration: v})}
                label="User Registration"
                description="Allow new accounts"
                icon={Globe}
              />
              <Toggle 
                enabled={settings.emailNotifications} 
                onChange={(v) => setSettings({...settings, emailNotifications: v})}
                label="System Emails"
                description="Automated alerts"
                icon={Bell}
              />
              <Toggle 
                enabled={settings.propertyApprovalRequired} 
                onChange={(v) => setSettings({...settings, propertyApprovalRequired: v})}
                label="Manual Approval"
                description="Review every property"
                icon={Database}
              />
            </div>

            <div className="pt-8 border-t border-emerald-500/10 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500">Site Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all ${
                      isDark ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Support Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all ${
                      isDark ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className={`space-y-6 relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl h-fit ${
            isDark ? 'bg-[var(--card)]/40 border-white/10' : 'bg-emerald-50/50 border-emerald-100'
          }`}>
            <SettingsIcon className="w-12 h-12 text-emerald-500 mb-4" />
            <h3 className="text-xl font-black tracking-tight">Admin Insights</h3>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              These settings affect the entire platform. Changes are logged and applied immediately to all connected clients and servers.
            </p>
            <div className={`p-4 rounded-2xl ${isDark ? 'bg-[var(--card)]' : 'bg-white'} border border-emerald-500/10`}>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Last Updated</p>
              <p className="text-xs font-bold opacity-60">{settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Just now'}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

