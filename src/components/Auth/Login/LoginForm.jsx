"use client";
import React from "react";
import { Mail, Lock, Github, Chrome } from "lucide-react"; // Icons

const LoginForm = ({ onGoogleClick, onGithubClick, onEmailLogin }) => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-[400px] bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-all duration-300">
        
        {/* Header Section */}
        <div className="p-8 pb-4">
          <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white text-center tracking-tight">
            Welcome Back
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-center mt-2 text-sm">
            Enter your details to access your UrbanEstate account
          </p>
        </div>

        <div className="p-8 pt-4 space-y-5">
          {/* Email Login Form */}
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-gray-700 dark:text-gray-200 transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 text-gray-700 dark:text-gray-200 transition-all"
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all">
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="w-full border-t border-gray-200 dark:border-slate-700"></div>
            <span className="absolute px-3 bg-white dark:bg-slate-900 text-xs text-gray-400 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onGoogleClick}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Chrome className="w-5 h-5 text-red-500" />
              Google
            </button>
            <button
              onClick={onGithubClick}
              className="flex items-center justify-center gap-2 py-3 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 active:scale-95 transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Github className="w-5 h-5 text-gray-900 dark:text-white" />
              GitHub
            </button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 dark:text-slate-500 mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline font-medium">
              Create one
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;