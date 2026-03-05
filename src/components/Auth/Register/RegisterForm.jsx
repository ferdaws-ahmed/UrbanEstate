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
          name: formData.name,
          email: formData.email,
          password: formData.password,
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
    <div className="min-h-screen w-full bg-[#0a1f1c] dark:bg-[#06211d] flex items-center justify-center p-4 sm:p-6 lg:p-8 transition-colors duration-500">
      
      {/* Main card - Added Subtle Animation */}
      <div className="w-full max-w-[1100px] mt-14 bg-[#0d2e28] dark:bg-[#0d2e28] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col md:flex-row min-h-[600px] border border-[#1a3d38] animate-in fade-in zoom-in duration-700">
        
        {/* left side image section */}
        <div className="hidden md:flex md:w-1/2 bg-[#0a1f1c] relative p-12 flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center hover:scale-110 transition-transform duration-[10s]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f1c] via-[#0a1f1c]/40 to-transparent"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-[#e2ef70] rounded-lg flex items-center justify-center shadow-lg shadow-[#e2ef70]/20">
                <Building className="text-[#0d2e28]" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">UrbanEstate</h1>
            </div>
            <p className="text-[#a3b18a] mt-2 font-medium">Experience the new standard of real estate.</p>
          </div>
          <div className="relative z-10">
             <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="text-[#a3b18a] italic font-light text-lg">"Your journey to a perfect home starts here. Simple, secure, and professional."</p>
             </div>
          </div>
        </div>

        {/* right side form section */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-14 flex flex-col justify-center bg-[#0d2e28] dark:bg-[#0d2e28]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
            <p className="text-[#a3b18a]/60 mt-2 text-sm">Join thousands of people finding their dream homes.</p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm ${
                role === "user" 
                ? "border-[#e2ef70] bg-[#e2ef70]/10 text-[#e2ef70] shadow-[0_10px_20px_rgba(226,239,112,0.1)]" 
                : "border-[#1a3d38] text-[#a3b18a]/40 hover:bg-[#081a18]"
              }`}
            >
              <UserCircle size={20} /> Join as Buyer
            </button>
            <button
              type="button"
              onClick={() => setRole("seller")}
              className={`flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm ${
                role === "seller" 
                ? "border-[#e2ef70] bg-[#e2ef70]/10 text-[#e2ef70] shadow-[0_10px_20px_rgba(226,239,112,0.1)]" 
                : "border-[#1a3d38] text-[#a3b18a]/40 hover:bg-[#081a18]"
              }`}
            >
              <Building size={20} /> Join as Seller
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-[4px] bg-[#a3b18a] rounded-l-2xl group-focus-within:bg-[#e2ef70] transition-colors z-10"></div>
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e2ef70] transition-colors" size={18} />
                <input 
                  type="text" required placeholder="John Doe"
                  className="w-full pl-14 pr-4 py-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl focus:ring-4 focus:ring-[#e2ef70]/10 focus:border-[#e2ef70] outline-none text-white transition-all placeholder:text-[#1a3d38] relative"
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-[4px] bg-[#a3b18a] rounded-l-2xl group-focus-within:bg-[#e2ef70] transition-colors z-10"></div>
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e2ef70] transition-colors" size={18} />
                <input 
                  type="email" required placeholder="hello@urbanestate.com"
                  className="w-full pl-14 pr-4 py-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl focus:ring-4 focus:ring-[#e2ef70]/10 focus:border-[#e2ef70] outline-none text-white transition-all placeholder:text-[#1a3d38] relative"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-[#a3b18a]/50 uppercase tracking-widest ml-1">Secure Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 w-[4px] bg-[#a3b18a] rounded-l-2xl group-focus-within:bg-[#e2ef70] transition-colors z-10"></div>
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#e2ef70] transition-colors" size={18} />
                <input 
                  type="password" required placeholder="••••••••"
                  className="w-full pl-14 pr-4 py-4 bg-[#081a18] border border-[#1a3d38] rounded-2xl focus:ring-4 focus:ring-[#e2ef70]/10 focus:border-[#e2ef70] outline-none text-white transition-all placeholder:text-[#1a3d38] relative"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-[#e2ef70] text-[#0d2a26] hover:opacity-90 active:scale-[0.98] font-bold py-4 rounded-2xl shadow-xl shadow-black/10 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:pointer-events-none"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Create Free Account"}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="w-full border-t border-[#1a3d38]"></div>
              <span className="absolute px-6 bg-[#0d2e28] text-[10px] text-[#a3b18a]/40 uppercase tracking-[0.2em] font-bold">Quick connect with</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => onSocialRegister('google')} className="flex items-center justify-center gap-3 py-4 border border-[#1a3d38] rounded-2xl hover:bg-[#081a18] transition-all font-bold text-white text-sm group">
                <Chrome size={20} className="text-red-500 group-hover:rotate-12 transition-transform" /> Google
              </button>
              <button type="button" onClick={() => onSocialRegister('github')} className="flex items-center justify-center gap-3 py-4 border border-[#1a3d38] rounded-2xl hover:bg-[#081a18] transition-all font-bold text-white text-sm group">
                <Github size={20} className="group-hover:scale-110 transition-transform" /> GitHub
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-[#a3b18a]/60 text-sm">
            Already a member? <a href="/login" className="text-[#e2ef70] font-black hover:underline ml-1">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;