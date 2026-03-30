"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Trash2
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { data: session, update } = useSession();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        email: session.user.email || "",
        avatar: session.user.image || "",
      });
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await update({ ...session, user: { ...session.user, ...formData } });
        toast.success("Profile updated successfully!");
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      toast.error("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Card */}
        <div className={`lg:w-1/3 p-8 rounded-[3rem] border flex flex-col items-center text-center ${
          isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <div className="relative group mb-6">
            <div className={`w-32 h-32 rounded-3xl overflow-hidden border-4 ${isDark ? "border-[#1a4a40]" : "border-slate-50"}`}>
              {formData.avatar ? (
                <img src={formData.avatar} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-black">
                  {formData.name?.charAt(0)}
                </div>
              )}
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-blue-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-transform">
              <Camera size={18} />
            </button>
          </div>
          
          <h3 className={`text-2xl font-black mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>{formData.name}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-6 bg-blue-600/10 px-4 py-1.5 rounded-full border border-blue-600/20">Verified Member</p>
          
          <div className="w-full space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
             <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                   <Mail size={16} />
                </div>
                <div className="min-w-0">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Primary Email</p>
                   <p className={`text-xs font-bold truncate ${isDark ? "text-white" : "text-slate-700"}`}>{formData.email}</p>
                </div>
             </div>
             <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500">
                   <Shield size={16} />
                </div>
                <div className="min-w-0">
                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Account Status</p>
                   <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Active
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* Settings Form */}
        <div className={`flex-1 p-8 lg:p-12 rounded-[3rem] border ${
          isDark ? "bg-[#0b1f1a] border-[#1a4a40]/40" : "bg-white border-slate-100 shadow-sm"
        }`}>
          <h3 className={`text-2xl font-black mb-8 tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>Identity Settings</h3>
          
          <form onSubmit={handleUpdate} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Account Display Name</label>
                <div className="relative group">
                   <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                   <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none transition-all ${
                        isDark 
                          ? "bg-white/5 border-white/5 focus:border-blue-600 text-white" 
                          : "bg-slate-50 border-slate-100 focus:border-blue-600 text-slate-900"
                      }`}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email (Read Only)</label>
                <div className="relative group opacity-60">
                   <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                   <input 
                      type="email" 
                      disabled
                      value={formData.email}
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none ${
                        isDark 
                          ? "bg-white/5 border-white/5 text-white" 
                          : "bg-slate-50 border-slate-100 text-slate-900"
                      }`}
                   />
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-2xl border flex items-center gap-4 ${
              isDark ? "bg-blue-500/5 border-blue-500/20 text-blue-400" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
               <AlertCircle size={20} className="shrink-0" />
               <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">Changing your display name will update it across all property inquiries and comments.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
               <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
               >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Save Profile</>}
               </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
