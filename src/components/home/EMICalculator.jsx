"use client";

import React, { useMemo, useState } from "react";
import { Manrope } from "next/font/google";
import { Calculator, CheckCircle, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AmortizationChart from "./AmortizationChart";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
};

export default function EMICalculator() {
  const [price, setPrice] = useState(2500000);
  const [downPercent, setDownPercent] = useState(20);
  const [rate, setRate] = useState(2.5);
  const [years, setYears] = useState(10);
  
  const [showModal, setShowModal] = useState(false);

  // লজিক: লোন অ্যামাউন্ট ক্যালকুলেশন
  const loanAmount = useMemo(() => {
    const p = Number(price) || 0;
    return Math.max(0, p * (1 - Number(downPercent) / 100));
  }, [price, downPercent]);

  const monthlyRate = useMemo(() => Number(rate) / 100 / 12, [rate]);
  const months = useMemo(() => Number(years) * 12, [years]);

  // লজিক: EMI ক্যালকুলেশন (০ ভ্যালু হ্যান্ডেল করার জন্য)
  const emi = useMemo(() => {
    if (months <= 0) return 0;
    if (monthlyRate === 0) return loanAmount / months;
    const x = Math.pow(1 + monthlyRate, months);
    return (loanAmount * monthlyRate * x) / (x - 1);
  }, [loanAmount, monthlyRate, months]);

  const totalPayable = emi * months;
  const totalInterest = Math.max(0, totalPayable - loanAmount);

  // বাটন ক্লিক হ্যান্ডলার
  const handleApplyLoan = () => {
    setShowModal(true);
    
    // আপনার চাহিদা অনুযায়ী সবগুলো ভ্যালু ০ করে দেওয়া হচ্ছে
    setDownPercent(0);
    setRate(0);
    setYears(0);
    
    setTimeout(() => {
      setShowModal(false);
    }, 4000);
  };

  return (
    <section className={`w-full py-20 px-6 lg:px-12 bg-[#b3d1c5] relative overflow-hidden ${manrope.className}`}>
      
      {/* Success Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-[#0f2e28]/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl relative max-w-lg w-full text-center border-t-8 border-[#0f2e28]"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-[#cddfa0]/30 rounded-full flex items-center justify-center">
                  <BadgeCheck size={48} className="text-[#0f2e28] animate-bounce" />
                </div>
              </div>
              <h3 className="text-3xl font-extrabold text-[#0f2e28] mb-4">Application Sent!</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Thank you! Your application has been processed. 
                <br />
                <span className="font-bold text-[#0f2e28]">Your apply is successfully done.</span>
              </p>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-[#0f2e28] text-[#cddfa0] px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform"
              >
               Apply
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#0f2e28] font-bold tracking-[0.4em] text-[10px] uppercase bg-white/40 px-5 py-2 rounded-full border border-[#0f2e28]/10 mb-4">
            <Calculator size={14} /> Financial Planner
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[#0f2e28] mb-4 tracking-tight">Smart EMI Calculator</h2>
          <p className="text-[#0f2e28]/70 font-medium text-lg">Calculate your monthly mortgage payments with precision.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left: Inputs */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[32px] shadow-xl border border-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#cddfa0]/30 blur-3xl rounded-full -mr-10 -mt-10"></div>
            
            <label className="block text-sm font-bold text-[#0f2e28] mb-3 uppercase tracking-wider">Property Price</label>
            <div className="relative mb-8">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0f2e28]/50 font-bold text-xl">$</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-white border-2 border-[#0f2e28]/5 rounded-2xl pl-10 pr-4 py-5 focus:outline-none focus:ring-4 focus:ring-[#cddfa0]/30 focus:border-[#0f2e28] transition-all font-black text-[#0f2e28] text-2xl"
              />
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-[#0f2e28] uppercase">Down Payment</label>
                  <span className="font-bold text-[#0f2e28]">{downPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  className="w-full accent-[#0f2e28] h-2 bg-[#0f2e28]/10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-[#0f2e28] uppercase">Interest Rate</label>
                  <span className="font-bold text-[#0f2e28]">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full accent-[#0f2e28] h-2 bg-[#0f2e28]/10 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-bold text-[#0f2e28] uppercase">Loan Tenure</label>
                  <span className="font-bold text-[#0f2e28]">{years} Years</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={40}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-[#0f2e28] h-2 bg-[#0f2e28]/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Right: Result Card */}
          <div className="sticky top-10">
            <div className="rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
              <div className="bg-[#0f2e28] text-[#cddfa0] p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-white/50 relative z-10">Estimated Monthly Payment</p>
                <motion.p 
                  key={emi}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-4xl lg:text-5xl font-black relative z-10"
                >
                  {formatCurrency(Math.round(emi))}
                </motion.p>
              </div>

              <div className="p-10 bg-white">
                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 font-semibold uppercase text-xs tracking-widest">Principal Amount</p>
                    <p className="font-black text-[#0f2e28] text-xl">{formatCurrency(Math.round(loanAmount))}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-gray-500 font-semibold uppercase text-xs tracking-widest">Total Interest</p>
                    <p className="font-black text-[#0f2e28] text-xl">{formatCurrency(Math.round(totalInterest))}</p>
                  </div>
                  <div className="h-[1px] bg-gray-100 w-full" />
                  <div className="flex justify-between items-center">
                    <p className="font-black text-[#0f2e28] uppercase text-sm">Total Payable</p>
                    <p className="font-black text-3xl text-[#0f2e28]">{formatCurrency(Math.round(totalPayable))}</p>
                  </div>
                </div>

                <button 
                  onClick={handleApplyLoan}
                  className="w-full bg-[#0f2e28] text-[#cddfa0] py-6 rounded-[24px] font-black uppercase tracking-[0.2em] hover:bg-[#1a4a40] transition-all duration-300 shadow-2xl flex justify-center items-center gap-3 group"
                >
                  <CheckCircle size={22} className="group-hover:rotate-12 transition-transform" /> 
                  Apply for Loan
                </button>
              </div>
            </div>
          </div>
          
          {/* Chart Section */}
          <div className="col-span-1 lg:col-span-2 bg-white/90 backdrop-blur-md p-10 rounded-[40px] shadow-xl border border-white mt-4">
            <div className="mb-8 flex items-center gap-4">
              <span className="w-12 h-2 bg-[#0f2e28] rounded-full"></span>
              <h3 className="text-2xl font-black text-[#0f2e28] uppercase tracking-tight">Amortization Schedule</h3>
            </div>
            <div className="w-full overflow-hidden">
               <AmortizationChart loanAmount={loanAmount} annualRate={rate} years={years} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}