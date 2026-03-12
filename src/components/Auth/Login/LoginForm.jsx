"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck, Loader2, X, KeyRound, Timer, User, ShieldAlert, Store } from "lucide-react";

const LoginForm = ({ onGoogleClick, onGithubClick, onEmailLogin, onForgotPassword, verifyOTP, showOTPModal, setShowOTPModal, loading, lockoutTime, pendingUser, handleDemoRedirect }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onEmailLogin(email, password);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    onForgotPassword(resetEmail);
    setIsModalOpen(false);
  };

  // ডেমো ক্রেডেনশিয়াল সেট করার ফাংশন
  const setDemoCredentials = (e, p) => {
    setEmail(e);
    setPassword(p);
  };

  // টাইমার ফরম্যাট (0:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1f1c] dark:bg-[#06211d] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      
      <div className="w-full max-w-[480px] mt-10 bg-[#0d2e28] dark:bg-[#0d2e28] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden border border-[#1a3d38] animate-in fade-in zoom-in duration-700 relative">
        
        <div className="relative h-32 bg-[#0a1f1c] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black text-[#e2ef70] tracking-tight">UrbanEstate</h2>
            <p className="text-[#a3b18a] text-xs font-medium uppercase tracking-[0.2em] mt-1">Member Portal</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* --- ১. লকআউট টাইমার নোটিশ --- */}
          {lockoutTime > 0 && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-pulse">
              <Timer size={20} />
              <span className="text-sm font-bold tracking-wide">System Locked: Try again in {formatTime(lockoutTime)}</span>
            </div>
          )}

          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-white">Welcome Back</h3>
            <p className="text-[#a3b18a]/70 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          {/* --- ২. ডেমো লগইন বাটন সমূহ --- */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button 
              type="button"
              onClick={() => setDemoCredentials("user@demo.com", "123456")}
              className="flex flex-col items-center justify-center p-3 bg-[#081a18] border border-[#1a3d38] rounded-2xl hover:border-[#e2ef70] transition-all group"
            >
              <User size={18} className="text-[#a3b18a] group-hover:text-[#e2ef70] mb-1" />
              <span className="text-[10px] font-bold text-white/70 uppercase">User</span>
            </button>
            <button 
              type="button"
              onClick={() => setDemoCredentials("seller@demo.com", "123456")}
              className="flex flex-col items-center justify-center p-3 bg-[#081a18] border border-[#1a3d38] rounded-2xl hover:border-[#e2ef70] transition-all group"
            >
              <Store size={18} className="text-[#a3b18a] group-hover:text-[#e2ef70] mb-1" />
              <span className="text-[10px] font-bold text-white/70 uppercase">Seller</span>
            </button>
            <button 
              type="button"
              onClick={() => setDemoCredentials("admin@demo.com", "123456")}
              className="flex flex-col items-center justify-center p-3 bg-[#081a18] border border-[#1a3d38] rounded-2xl hover:border-[#e2ef70] transition-all group"
            >
              <ShieldAlert size={18} className="text-[#a3b18a] group-hover:text-[#e2ef70] mb-1" />
              <span className="text-[10px] font-bold text-white/70 uppercase">Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e2ef70] transition-colors" size={18} />
                <input
                  type="email" required value={email}
                  disabled={lockoutTime > 0}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl focus:ring-4 focus:ring-[#e2ef70]/10 focus:border-[#e2ef70] outline-none text-white transition-all placeholder:text-[#1a3d38] disabled:opacity-40"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest">Password</label>
                <button 
                  type="button" onClick={() => setIsModalOpen(true)}
                  className="text-[11px] font-bold text-[#e2ef70] hover:underline transition-colors uppercase tracking-tighter"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e2ef70] transition-colors" size={18} />
                <input
                  type="password" required value={password}
                  disabled={lockoutTime > 0}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl focus:ring-4 focus:ring-[#e2ef70]/10 focus:border-[#e2ef70] outline-none text-white transition-all placeholder:text-[#1a3d38] disabled:opacity-40"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-900/20">
                <ShieldCheck className="text-green-400" size={12} />
              </div>
              <span className="text-[11px] text-[#a3b18a]/60 font-medium italic">2FA protection active</span>
            </div>

            <button
              disabled={loading || lockoutTime > 0}
              className="w-full bg-[#e2ef70] text-[#0d2a26] hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-2 mt-2 group disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-[#1a3d38]"></div>
              <span className="absolute px-4 bg-[#0d2e28] text-[10px] text-[#a3b18a]/40 uppercase tracking-[0.2em] font-bold">Quick Access</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onGoogleClick} disabled={lockoutTime > 0} className="flex items-center justify-center gap-3 py-3.5 border border-[#1a3d38] rounded-2xl hover:bg-[#081a18] transition-all font-bold text-white text-sm group disabled:opacity-50">
                <Chrome size={20} className="text-red-500 group-hover:rotate-12 transition-transform" /> Google
              </button>
              <button onClick={onGithubClick} disabled={lockoutTime > 0} className="flex items-center justify-center gap-3 py-3.5 border border-[#1a3d38] rounded-2xl hover:bg-[#081a18] transition-all font-bold text-white text-sm group disabled:opacity-50">
                <Github size={20} className="group-hover:scale-110 transition-transform" /> GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-[#a3b18a]/60 text-sm">
            New here? <a href="/register" className="text-[#e2ef70] font-black hover:underline ml-1">Create Account</a>
          </p>
        </div>
      </div>

      {/* --- FORGET PASSWORD MODAL (No Changes) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0d2e28] rounded-[2.5rem] p-8 shadow-2xl border border-white/10">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#081a18] text-slate-500 transition-colors">
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#e2ef70]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-[#e2ef70]" size={32} />
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">Recover Password</h3>
              <p className="text-[#a3b18a]/60 text-sm mt-2">We'll send a recovery link to your email.</p>
            </div>
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" required placeholder="recovery@email.com"
                  className="w-full p-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl outline-none focus:border-[#e2ef70] text-white transition-all"
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <button className="w-full bg-[#e2ef70] text-[#0d2a26] font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity">Send Link</button>
            </form>
          </div>
        </div>
      )}

      {/* --- SMART TWO-FACTOR / DEMO MODAL --- */}
      {showOTPModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#06211d]/90 backdrop-blur-xl" onClick={() => setShowOTPModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#0d2e28] rounded-[3rem] p-10 text-center shadow-2xl border border-[#e2ef70]/20 animate-in zoom-in-95 duration-300">
            
            {pendingUser?.isDemo ? (
              /* ডেমো অ্যাকাউন্টের জন্য মোডাল কন্টেন্ট */
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 bg-[#e2ef70]/10 rounded-3xl flex items-center justify-center mb-6">
                  <ShieldCheck className="text-[#e2ef70]" size={40} />
                </div>
                <h3 className="text-2xl font-black text-white">Demo Access</h3>
                <p className="text-[#a3b18a]/70 text-sm mt-4 leading-relaxed text-left">
                  Since this is a <span className="text-[#e2ef70]">demo account</span>, two-factor authentication has been bypassed for your convenience. In a production environment, a secure 6-digit code would be sent to your registered email.
                </p>
                <button 
                  onClick={handleDemoRedirect} 
                  className="w-full bg-[#e2ef70] text-[#0d2a26] font-extrabold py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                >
                  OK, PROCEED
                </button>
              </div>
            ) : (
              /* রিয়েল অ্যাকাউন্টের জন্য ওটিপি কন্টেন্ট */
              <>
                <div className="w-20 h-20 bg-[#e2ef70]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <KeyRound className="text-[#e2ef70]" size={36} />
                </div>
                <h3 className="text-2xl font-black text-white">Security Check</h3>
                <p className="text-[#a3b18a]/60 text-sm mt-2">Enter the 6-digit code sent to your email.</p>
                <div className="mt-8 space-y-6">
                  <input 
                    type="text" maxLength="6" placeholder="· · · · · ·" autoFocus
                    className="w-full text-center text-3xl font-black tracking-[0.3em] py-5 bg-[#081a18] border-2 border-[#1a3d38] rounded-3xl focus:border-[#e2ef70] outline-none text-white transition-all"
                    onChange={(e) => { if(e.target.value.length === 6) verifyOTP(e.target.value); }}
                  />
                  <button onClick={() => setShowOTPModal(false)} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;