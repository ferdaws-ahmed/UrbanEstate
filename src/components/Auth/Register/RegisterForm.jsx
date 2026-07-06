"use client";
import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Github,
  Chrome,
  Building,
  UserCircle,
  Loader2,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

const RegisterForm = ({
  role,
  setRole,
  onSocialRegister,
  onEmailRegister,
  loading,
  error,
  showVerificationModal,
  setShowVerificationModal,
  pendingUserData,
  onResendEmail,
}) => {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // রোল সিলেক্ট করা না থাকলে এরর দেবে
    if (!role) {
      return; // This should probably show a toast
    }

    // আপনার মেইন লজিক ফাংশনটি কল করা হচ্ছে যা Firebase এবং DB হ্যান্ডেল করবে
    // এখন আর আলাদাভাবে fetch করার প্রয়োজন নেই এবং alert-ও আগে আসবে না
    onEmailRegister(formData.name, formData.email, formData.password);
  };

  return (
    <div className={isDark 
      ? "min-h-screen w-full bg-[var(--background)] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500" 
      : "min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500"}
    >
      {/* Main card */}
      <div className={isDark 
        ? "w-full max-w-[1100px] mt-14 bg-[var(--card)] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-white/10 animate-in fade-in zoom-in duration-700" 
        : "w-full max-w-[1100px] mt-14 bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-200 animate-in fade-in zoom-in duration-700"}
      >
        {/* left side image section */}
        <div className="hidden md:flex md:w-1/2 relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-100 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center hover:scale-110 transition-transform duration-[10s]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className={isDark 
                ? "w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-lg" 
                : "w-10 h-10 bg-[var(--primary)] rounded-lg flex items-center justify-center shadow-lg"}
              >
                <Building className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                UrbanEstate
              </h1>
            </div>
            <p className="text-slate-300 mt-2 font-medium">
              Experience the new standard of real estate.
            </p>
          </div>
          <div className="relative z-10">
            <div className={isDark 
              ? "p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10" 
              : "p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10"}
            >
              <p className="text-slate-200 italic font-light text-lg">
                "Your journey to a perfect home starts here. Simple, secure, and
                professional."
              </p>
            </div>
          </div>
        </div>

        {/* right side form section */}
        <div className={isDark 
          ? "w-full md:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-[var(--card)]" 
          : "w-full md:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white"}
        >
          <div className="mb-8">
            <h2 className={isDark ? "text-3xl font-bold text-white tracking-tight" : "text-3xl font-bold text-slate-900 tracking-tight"}>
              Create Account
            </h2>
            <p className={isDark ? "text-white/60 mt-2 text-sm" : "text-slate-600 mt-2 text-sm"}>
              Join thousands of people finding their dream homes.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={role === "user"
                ? (isDark
                  ? "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-[var(--accent)] bg-[var(--primary)]/20 text-[var(--accent)] transition-all duration-300 font-bold text-sm shadow-lg"
                  : "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] transition-all duration-300 font-bold text-sm shadow-lg")
                : (isDark
                  ? "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-white/10 text-white/60 hover:bg-white/5 transition-all duration-300 font-bold text-sm"
                  : "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-300 font-bold text-sm")}
            >
              <UserCircle size={20} /> Join as Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={role === "seller"
                ? (isDark
                  ? "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-[var(--accent)] bg-[var(--primary)]/20 text-[var(--accent)] transition-all duration-300 font-bold text-sm shadow-lg"
                  : "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)] transition-all duration-300 font-bold text-sm shadow-lg")
                : (isDark
                  ? "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-white/10 text-white/60 hover:bg-white/5 transition-all duration-300 font-bold text-sm"
                  : "flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-300 font-bold text-sm")}
            >
              <Building size={20} /> Join as Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className={isDark 
                ? "text-[11px] font-black text-white/40 uppercase tracking-widest ml-1" 
                : "text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"}
              >
                Full Name
              </label>
              <div className="relative group">
                <User
                  className={isDark 
                    ? "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--accent)] transition-colors" 
                    : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors"}
                  size={18}
                />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className={isDark 
                    ? "w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-white/10 rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none text-white transition-all placeholder:text-white/30" 
                    : "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-slate-900 transition-all placeholder:text-slate-400"}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={isDark 
                ? "text-[11px] font-black text-white/40 uppercase tracking-widest ml-1" 
                : "text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"}
              >
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className={isDark 
                    ? "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--accent)] transition-colors" 
                    : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors"}
                  size={18}
                />
                <input
                  type="email"
                  required
                  placeholder="hello@urbanestate.com"
                  className={isDark 
                    ? "w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-white/10 rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none text-white transition-all placeholder:text-white/30" 
                    : "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-slate-900 transition-all placeholder:text-slate-400"}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={isDark 
                ? "text-[11px] font-black text-white/40 uppercase tracking-widest ml-1" 
                : "text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1"}
              >
                Secure Password
              </label>
              <div className="relative group">
                <Lock
                  className={isDark 
                    ? "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[var(--accent)] transition-colors" 
                    : "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary)] transition-colors"}
                  size={18}
                />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className={isDark 
                    ? "w-full pl-12 pr-4 py-4 bg-[var(--background)] border border-white/10 rounded-2xl focus:ring-4 focus:ring-[var(--accent)]/10 focus:border-[var(--accent)] outline-none text-white transition-all placeholder:text-white/30" 
                    : "w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] outline-none text-slate-900 transition-all placeholder:text-slate-400"}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              className={isDark 
                ? "w-full bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:pointer-events-none" 
                : "w-full bg-[var(--primary)] text-white hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:pointer-events-none"}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Create Free Account"
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-6">
              <div className={isDark ? "w-full border-t border-white/10" : "w-full border-t border-slate-200"}></div>
              <span className={isDark 
                ? "absolute px-6 bg-[var(--card)] text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold" 
                : "absolute px-6 bg-white text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold"}
              >
                Quick connect with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onSocialRegister("google")}
                className={isDark 
                  ? "flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-bold text-white text-sm group" 
                  : "flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm group"}
              >
                <Chrome
                  size={20}
                  className="text-red-500 group-hover:rotate-12 transition-transform"
                /> Google
              </button>
              <button
                type="button"
                onClick={() => onSocialRegister("github")}
                className={isDark 
                  ? "flex items-center justify-center gap-3 py-4 border border-white/10 rounded-2xl hover:bg-white/5 transition-all font-bold text-white text-sm group" 
                  : "flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-700 text-sm group"}
              >
                <Github
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                /> GitHub
              </button>
            </div>
          </div>

          <p className={isDark 
            ? "mt-10 text-center text-white/60 text-sm" 
            : "mt-10 text-center text-slate-600 text-sm"}
          >
            Already a member? <a href="/login" className={isDark ? "text-[var(--accent)] font-black hover:underline ml-1" : "text-[var(--primary)] font-black hover:underline ml-1"}>Sign In</a>
          </p>
        </div>
      </div>

      {/* Verification Waiting Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className={isDark 
            ? "w-full max-w-md bg-[var(--card)] rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative" 
            : "w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative"}
          >
            <button 
              onClick={() => setShowVerificationModal(false)}
              className={isDark 
                ? "absolute top-6 right-6 text-white/40 hover:text-white transition-colors" 
                : "absolute top-6 right-6 text-slate-500 hover:text-slate-700 transition-colors"}
            >
              <X size={20} />
            </button>

            <div className="p-10 text-center">
              <div className={isDark 
                ? "w-20 h-20 bg-[var(--primary)]/20 rounded-3xl flex items-center justify-center mx-auto mb-6 relative" 
                : "w-20 h-20 bg-[var(--primary)]/10 rounded-3xl flex items-center justify-center mx-auto mb-6 relative"}
              >
                <Mail className={isDark ? "text-[var(--accent)] animate-bounce" : "text-[var(--primary)] animate-bounce"} size={32} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[var(--card)]"></div>
              </div>

              <h3 className={isDark ? "text-2xl font-bold text-white mb-3" : "text-2xl font-bold text-slate-900 mb-3"}>
                Verify Your Email
              </h3>
              <p className={isDark 
                ? "text-white/60 text-sm leading-relaxed mb-8" 
                : "text-slate-600 text-sm leading-relaxed mb-8"}
              >
                We've sent a verification link to <br />
                <span className={isDark ? "font-bold text-[var(--accent)]" : "font-bold text-[var(--primary)]"}>{pendingUserData?.email}</span>. <br />
                Please check your inbox and click the link to continue.
              </p>

              <div className="space-y-4">
                <div className={isDark 
                  ? "flex items-center justify-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10" 
                  : "flex items-center justify-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200"}
                >
                  <Loader2 className={isDark ? "animate-spin text-[var(--accent)]" : "animate-spin text-[var(--primary)]"} size={18} />
                  <span className={isDark 
                    ? "text-xs font-bold text-white/60 uppercase tracking-widest" 
                    : "text-xs font-bold text-slate-600 uppercase tracking-widest"}
                  >
                    Waiting for verification...
                  </span>
                </div>

                <a 
                  href="https://mail.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={isDark 
                    ? "w-full py-4 px-6 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl" 
                    : "w-full py-4 px-6 bg-[var(--primary)] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl"}
                >
                  Open Mail App <ExternalLink size={16} />
                </a>

                <p className={isDark 
                  ? "text-[10px] text-white/40 uppercase font-black tracking-widest pt-4" 
                  : "text-[10px] text-slate-500 uppercase font-black tracking-widest pt-4"}
                >
                  This window will close automatically once verified
                </p>

                <div className={isDark 
                  ? "pt-2 border-t border-white/10" 
                  : "pt-2 border-t border-slate-200"}
                >
                  <p className={isDark 
                    ? "text-xs text-white/60" 
                    : "text-xs text-slate-600"}
                  >
                    Didn't get the email? 
                    <button 
                      onClick={onResendEmail}
                      className={isDark ? "text-[var(--accent)] font-bold ml-1 hover:underline" : "text-[var(--primary)] font-bold ml-1 hover:underline"}
                    >
                      Resend Link
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
