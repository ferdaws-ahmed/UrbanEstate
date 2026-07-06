"use client";
import React, { useState, useEffect } from "react";
import { Mail, Lock, Github, Chrome, ArrowRight, ShieldCheck, Loader2, X, KeyRound, Timer, User, ShieldAlert, Store } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

const LoginForm = ({ onGoogleClick, onGithubClick, onEmailLogin, onForgotPassword, verifyOTP, showOTPModal, setShowOTPModal, loading, lockoutTime, pendingUser, handleDemoRedirect }) => {
  const { isDark } = useTheme();
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

  // ডেমো ক্রেডেনশিয়াল সেট করার ফাংশন
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
    <div className={isDark 
      ? "min-h-screen w-full bg-[var(--background)] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500" 
      : "min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500"}
    >
      
      <div className={isDark 
        ? "w-full max-w-[480px] mt-10 bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden border border-white/10 animate-in fade-in zoom-in duration-700 relative" 
        : "w-full max-w-[480px] mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-700 relative"}
      >
        
        <div className={isDark 
          ? "relative h-32 bg-[var(--background)] flex items-center justify-center overflow-hidden" 
          : "relative h-32 bg-slate-50 flex items-center justify-center overflow-hidden"}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10 text-center">
            <h2 className={isDark ? "text-3xl font-black text-[var(--accent)] tracking-tight" : "text-3xl font-black text-[var(--primary)] tracking-tight"}>UrbanEstate</h2>
            <p className={isDark ? "text-[var(--foreground)]/60 text-xs font-medium uppercase tracking-[0.2em] mt-1" : "text-slate-600 text-xs font-medium uppercase tracking-[0.2em] mt-1"}>Member Portal</p>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* --- ১. লকআউট টাইমার নোটিশ --- */}
          {lockoutTime > 0 && (
            <div className={isDark 
              ? "mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 animate-pulse" 
              : "mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600 animate-pulse"}
            >
              <Timer size={20} />
              <span className="text-sm font-bold tracking-wide">
                Access Denied: Try again in {formatTime(lockoutTime)}
              </span>
            </div>
          )}

          <div className="mb-8 text-center">
            <h3 className={isDark ? "text-2xl font-bold text-white" : "text-2xl font-bold text-slate-900"}>Welcome Back</h3>
            <p className={isDark ? "text-white/60 mt-2 text-sm" : "text-slate-600 mt-2 text-sm"}>Please enter your details to sign in.</p>
          </div>

          {/* --- ২. ডেমো লগইন বাটন সমূহ --- */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button 
              type="button"
              onClick={() => setDemoCredentials("user@demo.com", "123456")}
              className={isDark 
                ? "flex flex-col items-center justify-center p-3 bg-[var(--background)] border border-white/10 rounded-2xl hover:border-[var(--accent)] transition-all group" 
                : "flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[var(--primary)] transition-all group"}
            >
              <User size={18} className={isDark ? "text-white/60 group-hover:text-[var(--accent)] mb-1" : "text-slate-500 group-hover:text-[var(--primary)] mb-1"} />
              <span className={isDark ? "text-[10px] font-bold text-white/70 uppercase" : "text-[10px] font-bold text-slate-700 uppercase"}>User</span>
            </button>
            <button 
              type="button"
              onClick={() => setDemoCredentials("seller@demo.com", "123456")}
              className={isDark 
                ? "flex flex-col items-center justify-center p-3 bg-[var(--background)] border border-white/10 rounded-2xl hover:border-[var(--accent)] transition-all group" 
                : "flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[var(--primary)] transition-all group"}
            >
              <Store size={18} className={isDark ? "text-white/60 group-hover:text-[var(--accent)] mb-1" : "text-slate-500 group-hover:text-[var(--primary)] mb-1"} />
              <span className={isDark ? "text-[10px] font-bold text-white/70 uppercase" : "text-[10px] font-bold text-slate-700 uppercase"}>Seller</span>
            </button>
            <button 
              type="button"
              onClick={() => setDemoCredentials("admin@demo.com", "123456")}
              className={isDark 
                ? "flex flex-col items-center justify-center p-3 bg-[var(--background)] border border-white/10 rounded-2xl hover:border-[var(--accent)] transition-all group" 
                : "flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-2xl hover:border-[var(--primary)] transition-all group"}
            >
              <ShieldAlert size={18} className={isDark ? "text-white/60 group-hover:text-[var(--accent)] mb-1" : "text-slate-500 group-hover:text-[var(--primary)] mb-1"} />
              <span className={isDark ? "text-[10px] font-bold text-white/70 uppercase" : "text-[10px] font-bold text-slate-700 uppercase"}>Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className={isDark 
                ? "text-[11px] font-black text-white/40 uppercase tracking-widest ml-1" 
                : "text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"}
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail className={isDark 
                  ? "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--accent)] transition-colors" 
                  : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors"} 
                  size={18} 
                />
                <input
                  type="email" required value={email}
                  disabled={lockoutTime > 0}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={isDark 
                    ? "w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-white/10 rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none text-white transition-all placeholder:text-white/30 disabled:opacity-40" 
                    : "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-slate-900 transition-all placeholder:text-slate-400 disabled:opacity-40"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className={isDark 
                  ? "text-[11px] font-black text-white/40 uppercase tracking-widest" 
                  : "text-[11px] font-black text-slate-500 uppercase tracking-widest"}
                >
                  Password
                </label>
                <button 
                  type="button" onClick={() => setIsModalOpen(true)}
                  className={isDark 
                    ? "text-[11px] font-bold text-[var(--accent)] hover:underline transition-colors uppercase tracking-tighter" 
                    : "text-[11px] font-bold text-[var(--primary)] hover:underline transition-colors uppercase tracking-tighter"}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative group">
                <Lock className={isDark 
                  ? "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--accent)] transition-colors" 
                  : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors"} 
                  size={18} 
                />
                <input
                  type="password" required value={password}
                  disabled={lockoutTime > 0}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={isDark 
                    ? "w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-white/10 rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none text-white transition-all placeholder:text-white/30 disabled:opacity-40" 
                    : "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-slate-900 transition-all placeholder:text-slate-400 disabled:opacity-40"}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <div className={isDark 
                ? "flex items-center justify-center w-5 h-5 rounded-full bg-green-500/20" 
                : "flex items-center justify-center w-5 h-5 rounded-full bg-green-100"}
              >
                <ShieldCheck className={isDark ? "text-green-400" : "text-green-600"} size={12} />
              </div>
              <span className={isDark ? "text-[11px] text-white/60 font-medium italic" : "text-[11px] text-slate-600 font-medium italic"}>2FA protection active</span>
            </div>

            <button
              disabled={loading || lockoutTime > 0}
              className={isDark 
                ? "w-full bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70" 
                : "w-full bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"}
            >
              {loading ? <Loader2 className="animate-spin" /> : (
                <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className={isDark ? "w-full border-t border-white/10" : "w-full border-t border-slate-200"}></div>
              <span className={isDark 
                ? "absolute px-4 bg-[var(--card)] text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold" 
                : "absolute px-4 bg-white text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold"}
              >
                Quick Access
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={onGoogleClick} disabled={lockoutTime > 0} className={isDark 
                ? "flex items-center justify-center gap-3 py-3.5 border border-white/10 rounded-2xl hover:bg-[var(--background)] transition-all font-bold text-white text-sm group disabled:opacity-50" 
                : "flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm group disabled:opacity-50"}
              >
                <Chrome size={20} className="text-red-500 group-hover:rotate-12 transition-transform" /> Google
              </button>
              <button onClick={onGithubClick} disabled={lockoutTime > 0} className={isDark 
                ? "flex items-center justify-center gap-3 py-3.5 border border-white/10 rounded-2xl hover:bg-[var(--background)] transition-all font-bold text-white text-sm group disabled:opacity-50" 
                : "flex items-center justify-center gap-3 py-3.5 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm group disabled:opacity-50"}
              >
                <Github size={20} className="group-hover:scale-110 transition-transform" /> GitHub
              </button>
            </div>
          </div>

          <p className={isDark 
            ? "mt-8 text-center text-white/60 text-sm" 
            : "mt-8 text-center text-slate-600 text-sm"}
          >
            New here? <a href="/register" className={isDark ? "text-[var(--accent)] font-black hover:underline ml-1" : "text-[var(--primary)] font-black hover:underline ml-1"}>Create Account</a>
          </p>
        </div>
      </div>

      {/* --- FORGET PASSWORD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className={isDark 
            ? "relative w-full max-w-md bg-[var(--card)] rounded-3xl p-8 shadow-2xl border border-white/10" 
            : "relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-200"}
          >
            <button onClick={() => setIsModalOpen(false)} className={isDark 
              ? "absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--background)] text-white/40 transition-colors" 
              : "absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors"}
            >
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <div className={isDark 
                ? "w-16 h-16 bg-[var(--primary)]/20 rounded-2xl flex items-center justify-center mx-auto mb-4" 
                : "w-16 h-16 bg-[var(--primary)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4"}
              >
                <ShieldCheck className={isDark ? "text-[var(--accent)]" : "text-[var(--primary)]"} size={32} />
              </div>
              <h3 className={isDark ? "text-2xl font-black text-white tracking-tight" : "text-2xl font-black text-slate-900 tracking-tight"}>Recover Password</h3>
              <p className={isDark ? "text-white/60 text-sm mt-2" : "text-slate-600 text-sm mt-2"}>We'll send a recovery link to your email.</p>
            </div>
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-1.5 text-left">
                <label className={isDark 
                  ? "text-[11px] font-black text-white/40 uppercase tracking-widest ml-1" 
                  : "text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"}
                >
                  Email Address
                </label>
                <input 
                  type="email" required placeholder="recovery@email.com"
                  className={isDark 
                    ? "w-full p-4 bg-[var(--background)] border border-white/10 rounded-2xl outline-none focus:border-[var(--accent)] text-white transition-all" 
                    : "w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[var(--primary)] text-slate-900 transition-all"}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <button className={isDark 
                ? "w-full bg-[var(--primary)] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity" 
                : "w-full bg-[var(--primary)] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-opacity"}
              >
                Send Link
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- SMART TWO-FACTOR / DEMO MODAL --- */}
      {showOTPModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[var(--background)]/90 backdrop-blur-xl" onClick={() => setShowOTPModal(false)}></div>
          <div className={isDark 
            ? "relative w-full max-w-sm bg-[var(--card)] rounded-3xl p-10 text-center shadow-2xl border border-[var(--accent)]/20 animate-in zoom-in-95 duration-300" 
            : "relative w-full max-w-sm bg-white rounded-3xl p-10 text-center shadow-2xl border border-[var(--primary)]/20 animate-in zoom-in-95 duration-300"}
          >
            
            {pendingUser?.isDemo ? (
              // ডেমো অ্যাকাউন্টের জন্য মোডাল কন্টেন্ট
              <div className="flex flex-col items-center">
                <div className={isDark 
                  ? "w-20 h-20 bg-[var(--primary)]/20 rounded-3xl flex items-center justify-center mb-6" 
                  : "w-20 h-20 bg-[var(--primary)]/10 rounded-3xl flex items-center justify-center mb-6"}
                >
                  <ShieldCheck className={isDark ? "text-[var(--accent)]" : "text-[var(--primary)]"} size={40} />
                </div>
                <h3 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>Demo Access</h3>
                <p className={isDark 
                  ? "text-white/60 text-sm mt-4 leading-relaxed text-left" 
                  : "text-slate-600 text-sm mt-4 leading-relaxed text-left"}
                >
                  Since this is a <span className={isDark ? "text-[var(--accent)]" : "text-[var(--primary)]"}>demo account</span>, two-factor authentication has been bypassed for your convenience. In a production environment, a secure 6-digit code would be sent to your registered email.
                </p>
                <button 
                  onClick={handleDemoRedirect} 
                  className={isDark 
                    ? "w-full bg-[var(--primary)] text-white font-extrabold py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg" 
                    : "w-full bg-[var(--primary)] text-white font-extrabold py-4 rounded-2xl mt-8 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"}
                >
                  OK, PROCEED
                </button>
              </div>
            ) : (
              // রিয়েল অ্যাকাউন্টের জন্য ওটিপি কন্টেন্ট
              <>
                <div className={isDark 
                  ? "w-20 h-20 bg-[var(--primary)]/20 rounded-3xl flex items-center justify-center mx-auto mb-6" 
                  : "w-20 h-20 bg-[var(--primary)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6"}
                >
                  <KeyRound className={isDark ? "text-[var(--accent)]" : "text-[var(--primary)]"} size={36} />
                </div>
                <h3 className={isDark ? "text-2xl font-black text-white" : "text-2xl font-black text-slate-900"}>Security Check</h3>
                <p className={isDark ? "text-white/60 text-sm mt-2" : "text-slate-600 text-sm mt-2"}>Enter the 6-digit code sent to your email.</p>
                <div className="mt-8 space-y-6">
                  <input 
                    type="text" maxLength="6" placeholder="• • • • • •" autoFocus
                    className={isDark 
                      ? "w-full text-center text-3xl font-black tracking-[0.3em] py-5 bg-[var(--background)] border-2 border-white/10 rounded-3xl focus:border-[var(--accent)] outline-none text-white transition-all" 
                      : "w-full text-center text-3xl font-black tracking-[0.3em] py-5 bg-slate-50 border-2 border-slate-200 rounded-3xl focus:border-[var(--primary)] outline-none text-slate-900 transition-all"}
                    onChange={(e) => { if(e.target.value.length === 6) verifyOTP(e.target.value); }}
                  />
                  <button onClick={() => setShowOTPModal(false)} className={isDark 
                    ? "text-xs font-bold text-white/40 hover:text-red-400 uppercase tracking-widest transition-colors" 
                    : "text-xs font-bold text-slate-500 hover:text-red-500 uppercase tracking-widest transition-colors"}
                  >
                    Cancel
                  </button>
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
