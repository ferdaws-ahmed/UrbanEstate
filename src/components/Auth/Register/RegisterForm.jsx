"use client";
import React, { useState } from "react";
import { Mail, Lock, User, Github, Chrome, Building, UserCircle, Loader2 } from "lucide-react";


const RegisterForm = ({ role, setRole, onSocialRegister, onEmailRegister, loading, error }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
     try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      alert("Registration successful!");
    } catch (error) {
      console.error(error.message);
    }
    onEmailRegister(formData.name, formData.email, formData.password);
  };



  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      
      {/* Main card - Added Subtle Animation */}
      <div className="w-full max-w-[1100px] bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-700">
        
        {/* left side image section */}
        <div className="hidden md:flex md:w-1/2 bg-slate-900 dark:bg-slate-950 relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center hover:scale-110 transition-transform duration-[10s]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/40">
                <Building className="text-white" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">UrbanEstate</h1>
            </div>
            <p className="text-slate-300 mt-2 font-medium">Experience the new standard of real estate.</p>
          </div>
          <div className="relative z-10">
             <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-slate-200 italic font-light text-lg">"Your journey to a perfect home starts here. Simple, secure, and professional."</p>
             </div>
          </div>
        </div>

        {/* right side form section */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-white dark:bg-slate-900">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Join thousands of people finding their dream homes.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm ${
                role === "user" 
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-[0_10px_20px_rgba(37,99,235,0.1)]" 
                : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <UserCircle size={20} /> Join as Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm ${
                role === "seller" 
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-[0_10px_20px_rgba(37,99,235,0.1)]" 
                : "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Building size={20} /> Join as Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="text" required placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="email" required placeholder="hello@urbanestate.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Free Account"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-full border-t border-slate-100 dark:border-slate-800"></div>
              <span className="absolute px-6 bg-white dark:bg-slate-900 text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">Quick connect with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => onSocialRegister('google')} className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-white text-sm group">
                <Chrome size={20} className="text-red-500 group-hover:rotate-12 transition-transform" /> Google
              </button>
              <button type="button" onClick={() => onSocialRegister('github')} className="flex items-center justify-center gap-3 py-4 border border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-bold text-slate-700 dark:text-white text-sm group">
                <Github size={20} className="group-hover:scale-110 transition-transform" /> GitHub
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-500 dark:text-slate-400 text-sm">
            Already a member? <a href="/login" className="text-blue-600 font-black hover:underline ml-1">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;