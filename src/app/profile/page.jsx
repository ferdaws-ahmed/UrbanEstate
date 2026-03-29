"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; 
import { FaArrowLeft, FaEnvelope, FaShieldAlt, FaUserEdit } from 'react-icons/fa';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    role: "user",
    avatar: ""
  });

  useEffect(() => {
    if (session?.user) {

      setUserData({
        name: session.user.name || "Unknown User",
        email: session.user.email || "No Email Found",
        role: session.user.role || "user", 
        avatar: session.user.image || session.user.avatar || ""
      });
    }
  }, [session]);


  const isSeller = userData.role === 'seller';
  const dashboardUrl = isSeller ? '/dashboard' : '/user-dashboard';
  
 
  const profileImage = userData.avatar || `https://ui-avatars.com/api/?name=${userData.name}&background=cddfa0&color=061510&bold=true&size=128`;

  const themeHex = isSeller ? '#10b981' : '#3b82f6';
  const themeClass = isSeller ? 'emerald' : 'blue';

  if (status === "loading") {
    return <div className="min-h-screen bg-white dark:bg-[#061510] flex items-center justify-center text-slate-900 dark:text-white font-bold uppercase tracking-widest animate-pulse transition-colors duration-300">Loading Profile...</div>;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#061510] text-slate-900 dark:text-white flex flex-col items-center pt-32 pb-12 px-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none transition-all duration-700"
        style={{ backgroundImage: `radial-gradient(circle at center, ${themeHex} 0%, transparent 70%)` }}
      ></div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Dynamic Back Button */}
        <div className="mb-6 flex">
          <Link 
            href={dashboardUrl} 
            className={`flex items-center gap-2 text-${themeClass}-600 dark:text-${themeClass}-400/80 hover:text-teal-700 dark:hover:text-white transition-all font-bold text-sm bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-lg border border-slate-200 dark:border-white/10 backdrop-blur-md group`}
          >
            <FaArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to {isSeller ? 'Seller Panel' : 'User Panel'}
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] text-center shadow-2xl overflow-hidden relative transition-colors duration-300">
          
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className={`absolute inset-0 bg-${themeClass}-500/10 rounded-full animate-pulse`}></div>
            <img 
              src={profileImage} 
              alt="Profile" 
              className={`w-full h-full rounded-full object-cover border-2 border-${themeClass}-400/50 shadow-xl relative z-10 bg-slate-100 dark:bg-[#061510]`}
            />
            <span className={`absolute bottom-2 right-2 w-5 h-5 border-2 border-white dark:border-[#061510] rounded-full z-20 ${isSeller ? 'bg-emerald-400' : 'bg-blue-500'}`}></span>
          </div>

          <div className="space-y-1 mb-8">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {userData.name}
            </h1>
            <p className={`font-mono tracking-widest uppercase text-[10px] font-bold px-4 py-1.5 border rounded-full inline-block ${isSeller ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20' : 'text-blue-600 bg-blue-500/10 border-blue-500/20'}`}>
              {isSeller ? 'Verified Seller' : 'Verified Member'}
            </p>
          </div>
          
          <div className="space-y-3 text-left">
            {/* Email Section */}
            <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-4 transition-colors">
              <div className={`text-${themeClass}-600 dark:text-${themeClass}-400 bg-${themeClass}-400/10 p-2 rounded-lg`}>
                <FaEnvelope size={14} />
              </div>
              <div className="overflow-hidden">
                <p className={`text-[9px] uppercase tracking-wider font-black text-${themeClass}-600/50 dark:text-${themeClass}-400/50`}>Registered Email</p>
                <p className="text-slate-900 dark:text-white text-sm truncate font-medium">{userData.email}</p>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-center gap-4 transition-colors">
              <div className={`text-${themeClass}-600 dark:text-${themeClass}-400 bg-${themeClass}-400/10 p-2 rounded-lg`}>
                <FaShieldAlt size={14} />
              </div>
              <div>
                <p className={`text-[9px] uppercase tracking-wider font-black text-${themeClass}-600/50 dark:text-${themeClass}-400/50`}>Account Type</p>
                <p className="text-slate-900 dark:text-white text-sm font-medium">
                  {isSeller ? 'Seller Dashboard Active' : 'Basic User Account'}
                </p>
              </div>
            </div>
          </div>

          {/* Update Action */}
          <div className="mt-12 pt-6 border-t border-slate-100 dark:border-white/5">
            <Link 
              href="/updateprofile" 
              className="w-full flex items-center justify-center gap-2 bg-[#cddfa0] text-[#061510] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-teal-700 hover:text-white hover:shadow-[0_0_20px_rgba(205,223,160,0.3)] transition-all shadow-lg"
            >
              <FaUserEdit size={16} />
              Modify Profile Info
            </Link>
          </div>
        </div>
      </div>

      <div className={`mt-12 text-${themeClass}-500/5 font-black text-7xl absolute -bottom-6 -right-6 pointer-events-none select-none tracking-tighter uppercase`}>
        {userData.role}
      </div>
    </div>
  );
};

export default ProfilePage;