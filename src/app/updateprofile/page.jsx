"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCheckCircle, FaUser, FaImage, FaGoogle } from 'react-icons/fa';

const UpdateProfile = () => {
  const { data: session, update, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", avatar: "" });

  const isGoogleUser = session?.user?.email && !session?.user?.role; 
  const isSeller = session?.user?.role === "seller";

  const themeClass = isSeller ? 'emerald' : 'blue';
  const themeHex = isSeller ? '#10b981' : '#3b82f6';

  useEffect(() => {
    if (session?.user) {
      setFormData({
        name: session.user.name || "",
        avatar: session.user.image || session.user.avatar || ""
      });
    }
  }, [session]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (isGoogleUser) {
      alert("Google users cannot update profile info from here.");
      return;
    }
    
    setLoading(true);

    try {
    
      await update({
        ...session,
        user: { 
          ...session?.user, 
          name: formData.name, 
          image: formData.avatar 
        }
      });

      alert("Profile Updated Successfully!");
      router.push("/profile");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="min-h-screen bg-[#061510] flex items-center justify-center text-white font-black animate-pulse">Checking Session...</div>;

  return (
    <div className="min-h-screen bg-[#061510] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `radial-gradient(circle at center, ${themeHex} 0%, transparent 70%)` }}
      ></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl relative z-10">
        
        <button 
          onClick={() => router.back()} 
          className={`mb-6 text-${themeClass}-400 flex items-center gap-2 font-bold text-sm hover:text-white transition-colors group`}
        >
          <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-[#cddfa0] tracking-tight uppercase">Edit Profile</h2>
          <p className="text-[10px] text-white/40 font-mono tracking-widest mt-1">
            Logged in as: <span className={`text-${themeClass}-400`}>{session?.user?.role || 'Google User'}</span>
          </p>
        </div>

        {isGoogleUser && (
           <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
              <FaGoogle className="text-yellow-500 mt-1" size={16} />
              <p className="text-[11px] text-yellow-200/70 leading-relaxed">
                You are logged in via Google. Profile information must be managed through your Google Account settings.
              </p>
           </div>
        )}

        <form onSubmit={handleUpdate} className={`space-y-5 ${isGoogleUser ? 'opacity-50 pointer-events-none' : ''}`}>
          
          {/* Name Input */}
          <div className="space-y-2 text-left">
            <label className={`text-[10px] uppercase tracking-widest font-black text-${themeClass}-500/70 ml-2`}>Display Name</label>
            <div className="relative">
              <FaUser className={`absolute left-4 top-1/2 -translate-y-1/2 text-${themeClass}-500/50`} size={14} />
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={`w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-${themeClass}-500 transition-all text-white placeholder:text-white/20`} 
                placeholder="Your Full Name"
                required 
              />
            </div>
          </div>

          {/* Avatar URL Input */}
          <div className="space-y-2 text-left">
            <label className={`text-[10px] uppercase tracking-widest font-black text-${themeClass}-500/70 ml-2`}>Avatar Image URL</label>
            <div className="relative">
              <FaImage className={`absolute left-4 top-1/2 -translate-y-1/2 text-${themeClass}-500/50`} size={14} />
              <input 
                type="text" 
                value={formData.avatar}
                onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                className={`w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-${themeClass}-500 transition-all text-white placeholder:text-white/20`} 
                placeholder="https://image-link.com/photo.jpg"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || isGoogleUser}
            className={`w-full bg-[#cddfa0] text-[#061510] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 mt-4`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#061510] border-t-transparent rounded-full animate-spin"></div>
                Updating...
              </span>
            ) : (
              <><FaCheckCircle size={16} /> Save Changes</>
            )}
          </button>
        </form>
      </div>

      <div className={`mt-12 text-${themeClass}-500/5 font-black text-7xl absolute -bottom-6 -left-6 pointer-events-none select-none tracking-tighter uppercase`}>
        UPDATE
      </div>
    </div>
  );
};

export default UpdateProfile;