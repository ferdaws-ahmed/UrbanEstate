"use client";
import React, { useState } from "react";
import { Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck, Loader2, X, KeyRound } from "lucide-react";

const LoginForm = ({ onGoogleClick, onGithubClick, onEmailLogin, onForgotPassword, verifyOTP, showOTPModal, setShowOTPModal, loading }) => {
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

  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      
      {/* Main Card - */}
      <div className="w-full max-w-[480px] mt-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-700 relative">
        
        {/* top section design */}
        <div className="relative h-32 bg-blue-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight">UrbanEstate</h2>
            <p className="text-blue-100 text-xs font-medium uppercase tracking-[0.2em] mt-1">Member Portal</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="email" required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Input & Forget Link */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors uppercase tracking-tighter"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="password" required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* 2FA Badge */}
            <div className="flex items-center gap-2 px-1">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30">
                <ShieldCheck className="text-green-600 dark:text-green-400" size={12} />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic">2FA protection active</span>
            </div>

            <button
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-2 group"
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              <span className="absolute px-4 bg-white dark:bg-slate-900 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Quick Access</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onGoogleClick} className="flex items-center justify-center gap-3 py-3.5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-white text-sm">
                <Chrome size={20} className="text-red-500" /> Google
              </button>
              <button onClick={onGithubClick} className="flex items-center justify-center gap-3 py-3.5 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-white text-sm">
                <Github size={20} /> GitHub
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-slate-500 dark:text-slate-400 text-sm">
            New here? <a href="/register" className="text-blue-600 font-black hover:underline ml-1">Create Account</a>
          </p>
        </div>
      </div>

      {/* --- FORGET PASSWORD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/20 dark:border-slate-800">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-blue-600 dark:text-blue-400" size={32} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Recover Password</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">We'll send a recovery link to your email.</p>
            </div>
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <input 
                  type="email" required placeholder="recovery@email.com"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-2xl outline-none focus:border-blue-600 dark:text-white transition-all"
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl">Send Link</button>
            </form>
          </div>
        </div>
      )}

      {/* --- TWO-FACTOR (OTP) MODAL--- */}
      {showOTPModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowOTPModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[3rem] p-10 text-center shadow-2xl border border-blue-500/20 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="text-blue-600 dark:text-blue-400" size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">Security Check</h3>
            <p className="text-slate-500 text-sm mt-2">Enter the 6-digit code sent to your email.</p>
            <div className="mt-8 space-y-6">
              <input 
                type="text" maxLength="6" placeholder="· · · · · ·" autoFocus
                className="w-full text-center text-3xl font-black tracking-[0.3em] py-5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-3xl focus:border-blue-600 outline-none dark:text-white transition-all"
                onChange={(e) => { if(e.target.value.length === 6) verifyOTP(e.target.value); }}
              />
              <button onClick={() => setShowOTPModal(false)} className="text-xs font-bold text-slate-400 hover:text-red-500 uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginForm;