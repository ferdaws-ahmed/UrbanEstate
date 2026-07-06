"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import { User, Mail, Phone, MapPin, Camera, Save, Loader2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { data: session, update } = useSession();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    image: '',
    address: '',
    bio: '',
    role: 'Admin'
  });

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = process.env.NEXT_PUBLIC_IMG_BB_API; 

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        return data.data.url;
      }
      return null;
    } catch (error) {
      console.error("ImgBB Upload Error:", error);
      return null;
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const tid = toast.loading("Uploading image...");

    try {
      const url = await uploadToImgBB(file);
      if (url) {
        setProfile({ ...profile, image: url });
        toast.success("Image uploaded! Click Save to confirm.", { id: tid });
      } else {
        toast.error("Upload failed", { id: tid });
      }
    } catch (error) {
      toast.error("Error uploading image", { id: tid });
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            image: data.image || data.avatar || '',
            address: data.address || '',
            bio: data.bio || '',
            role: data.role || 'Admin'
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        toast.success('Profile updated successfully');
        await update({
          ...session,
          user: {
            ...session?.user,
            name: profile.name,
            image: profile.image
          }
        });
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className={`max-w-4xl mx-auto p-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className={`relative p-8 rounded-[2.5rem] border backdrop-blur-xl transition-all duration-500 shadow-xl ${
        isDark 
          ? 'bg-gradient-to-b from-[var(--card)]/80 to-[var(--background)] border-white/10 shadow-black/40' 
          : 'bg-white/80 border-gray-200 shadow-gray-200/50'
      }`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b pb-10 border-emerald-500/10">
          <div className="relative group">
            <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-emerald-500/20 shadow-2xl relative">
              <img 
                src={profile.image || `https://ui-avatars.com/api/?name=${profile.name}&background=10b981&color=fff&size=128`} 
                alt="Admin Profile" 
                className="w-full h-full object-cover"
              />
              <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                {uploading ? <Loader2 size={24} className="animate-spin" /> : <Camera size={24} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl shadow-lg text-white">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight mb-1">{profile.name}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4">
              <span className="bg-emerald-500/10 px-3 py-1 rounded-full">{profile.role} Account</span>
            </div>
            <p className={`text-sm max-w-md ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {profile.bio || "Manage your administrative profile and platform permissions."}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark 
                    ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' 
                    : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
                }`}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="email"
                value={profile.email}
                disabled
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none opacity-50 cursor-not-allowed ${
                  isDark ? 'bg-[var(--card)] border-white/10' : 'bg-gray-50 border-gray-100'
                }`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Phone Number</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark 
                    ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' 
                    : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
                }`}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Location</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({...profile, address: e.target.value})}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                  isDark 
                    ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' 
                    : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
                }`}
                placeholder="New York, USA"
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest ml-4 opacity-60">Bio / About Me</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
              rows={4}
              className={`w-full px-6 py-4 rounded-2xl border outline-none transition-all resize-none ${
                isDark 
                  ? 'bg-[var(--card)] border-white/10 focus:border-emerald-500/50' 
                  : 'bg-gray-50 border-gray-100 focus:border-emerald-500/50'
              }`}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="md:col-span-2 flex justify-end mt-4">
            <button
              disabled={isSaving}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

