"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function SellerProfilePage() {
  const { data: session, update } = useSession();
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    image: "",
    role: "",
    createdAt: ""
  });

  const [uploading, setUploading] = useState(false);

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
        setProfileData({ ...profileData, image: url });
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
        const res = await fetch("/api/user/profile");
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          image: data.image || "",
          role: data.role || "seller",
          createdAt: data.createdAt || ""
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Could not load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          image: profileData.image
        })
      });

      if (!res.ok) throw new Error("Update failed");

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profileData.name,
          image: profileData.image
        }
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className={`rounded-[2.5rem] border overflow-hidden transition-all duration-500 shadow-xl ${
        isDark ? "border-[#1a4a40]/50 bg-[#0f2e28]/80" : "border-slate-100 bg-white"
      }`}>
        {/* Header/Banner */}
        <div className="h-32 bg-gradient-to-r from-teal-600 to-emerald-600 relative">
          <div className="absolute -bottom-12 left-10">
            <div className="relative group">
              <div className="h-24 w-24 rounded-3xl bg-white dark:bg-[#0b1f1a] p-1 shadow-2xl">
                {profileData.image ? (
                  <img 
                    src={profileData.image} 
                    alt="Profile" 
                    className="h-full w-full object-cover rounded-[1.25rem]"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-[1.25rem]">
                    <User size={40} />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 h-10 w-10 rounded-2xl bg-slate-900 dark:bg-[#0b1f1a] text-white flex items-center justify-center cursor-pointer hover:bg-teal-600 transition-all shadow-xl border-4 border-white dark:border-[#0b1f1a] group-hover:scale-110">
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={18} />}
                <input 
                  type="file" 
                  accept="image/*"
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="pt-20 pb-12 px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className={`text-4xl font-black tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                  {profileData.name || "Seller Name"}
                </h1>
                <div className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 text-[10px] font-black uppercase tracking-widest border border-teal-500/20">
                  Verified
                </div>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">
                {profileData.role} Ecosystem Partner
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-6 py-3 rounded-2xl border text-[11px] font-black uppercase tracking-widest flex items-center gap-3 ${
                isDark ? "bg-white/5 border-white/5 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
              }`}>
                <Calendar size={14} className="text-teal-600" /> 
                Member Since {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently"}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className={`text-[11px] font-black uppercase tracking-[0.25em] ml-1 transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Legal Identity Name</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                  <input 
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    className={`w-full pl-14 pr-6 py-5 rounded-3xl border outline-none transition-all text-sm font-bold ${
                      isDark 
                      ? "bg-[#0b1f1a] border-[#1a4a40] text-white focus:border-[#cddfa0] focus:ring-4 focus:ring-[#cddfa0]/5" 
                      : "bg-white border-slate-200 text-slate-900 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 shadow-inner"
                    }`}
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className={`text-[11px] font-black uppercase tracking-[0.25em] ml-1 transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Primary Email Node</label>
                <div className="relative group opacity-60">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="email"
                    value={profileData.email}
                    disabled
                    className={`w-full pl-14 pr-6 py-5 rounded-3xl border outline-none cursor-not-allowed text-sm font-bold ${
                      isDark ? "bg-[#0b1f1a] border-[#1a4a40] text-white" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase ml-1 tracking-tighter">* Immutable system identifier</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className={`text-[11px] font-black uppercase tracking-[0.25em] ml-1 transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Asset Avatar Protocol</label>
                <div 
                  className={`relative p-5 rounded-3xl border flex items-center gap-4 transition-all ${
                    isDark ? "bg-[#0b1f1a] border-[#1a4a40]" : "bg-white border-slate-200 shadow-inner"
                  }`}
                >
                  <div className="h-14 w-14 rounded-2xl bg-teal-600/10 text-teal-600 flex items-center justify-center shrink-0 shadow-lg">
                    {profileData.image ? (
                      <img src={profileData.image} className="h-full w-full object-cover rounded-2xl" alt="" />
                    ) : (
                      <Camera size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-black truncate mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
                      {profileData.image ? "Sync Active" : "No Profile Image"}
                    </p>
                    <label className="text-[10px] font-black text-teal-600 hover:text-teal-500 cursor-pointer uppercase tracking-widest transition-colors">
                      Upload Local File
                      <input 
                        type="file" 
                        accept="image/*"
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className={`text-[11px] font-black uppercase tracking-[0.25em] ml-1 transition-colors duration-300 ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Account Permissions</label>
                <div className="relative group opacity-60">
                  <Shield className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input 
                    type="text"
                    value={profileData.role}
                    disabled
                    className={`w-full pl-14 pr-6 py-5 rounded-3xl border outline-none cursor-not-allowed uppercase font-black text-[11px] tracking-[0.2em] ${
                      isDark ? "bg-[#0b1f1a] border-[#1a4a40] text-white" : "bg-slate-50 border-slate-200 text-slate-500"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-10 flex justify-end">
              <button 
                type="submit"
                disabled={saving || uploading}
                className={`px-12 py-5 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 shadow-2xl disabled:opacity-50 active:scale-[0.98] ${
                  isDark 
                    ? "bg-teal-600 text-white hover:bg-teal-700 shadow-teal-900/20" 
                    : "bg-slate-900 text-white hover:bg-teal-600 shadow-slate-200"
                }`}
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save size={20} />}
                Deploy Profile Updates
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`p-6 rounded-[2rem] border flex items-start gap-4 ${
        isDark ? "bg-white/5 border-white/5" : "bg-slate-50 border-slate-100"
      }`}>
        <AlertCircle className="text-teal-600 shrink-0" size={20} />
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          Security Note: Your profile information is visible to potential buyers. Ensure your contact details are up to date to receive property inquiries directly.
        </p>
      </div>
    </div>
  );
}
