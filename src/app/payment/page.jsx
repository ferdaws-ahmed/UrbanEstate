"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  CreditCard, 
  ShieldCheck, 
  Loader2, 
  ChevronLeft,
  ShoppingBag,
  Building,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/src/components/shared/Navbar";
import { useTheme } from "@/src/components/Theme/ThemeContext";
import toast from "react-hot-toast";

function PaymentContent() {
  const { isDark } = useTheme();
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const propertyId = searchParams.get("propertyId");
  const price = searchParams.get("price");
  
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState(null);
  const [fetchingProperty, setFetchingProperty] = useState(true);

  useEffect(() => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const fetchProperty = async () => {
      try {
        const res = await fetch(`/api/properties/${propertyId}`);
        const data = await res.json();
        if (res.ok) {
          setProperty(data);
        } else {
          toast.error("Property not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property details");
      } finally {
        setFetchingProperty(false);
      }
    };

    if (propertyId) fetchProperty();
  }, [propertyId, session, router]);

  const handlePayNow = async () => {
    setLoading(true);
    const toastId = toast.loading("Initializing payment gateway...");
    try {
      const response = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          amount: price,
        }),
      });

      const data = await response.json();
      if (response.ok && data.url) {
        toast.success("Redirecting to secure gateway...", { id: toastId });
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Initialization failed", { id: toastId });
      }
    } catch (err) {
      console.error("Payment Init Error:", err);
      toast.error("Something went wrong. Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProperty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-teal-600" size={48} />
        <p className="font-bold uppercase tracking-widest text-[10px]">Processing Transaction...</p>
      </div>
    );
  }

  return (
    <div className={isDark 
      ? "min-h-screen bg-[var(--background)] text-white" 
      : "min-h-screen bg-slate-50 text-slate-900"}>
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        <button 
          onClick={() => router.back()}
          className={isDark 
            ? "flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.3em] mb-10 transition-all text-slate-500 hover:text-[var(--accent)]" 
            : "flex items-center gap-2 font-black text-[9px] uppercase tracking-[0.3em] mb-10 transition-all text-slate-400 hover:text-teal-600"}
        >
          <ChevronLeft size={12} /> Cancel Transaction
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Order Summary */}
          <div className={isDark 
            ? "p-10 rounded-3xl border border-white/10 bg-[var(--card)] shadow-2xl space-y-8" 
            : "p-10 rounded-3xl border border-slate-200 bg-white shadow-2xl space-y-8"}>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <ShoppingBag size={24} className="text-teal-600" /> Checkout <span className="text-teal-600 italic">Summary</span>
              </h2>
              <p className={isDark 
                ? "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30" 
                : "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"}>Review your transaction details</p>
            </div>

            <div className={isDark 
              ? "p-6 rounded-xl border border-white/5 bg-white/5" 
              : "p-6 rounded-xl border border-slate-100 bg-slate-50"}>
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-teal-200">
                  <img src={property?.images?.[0] || "/placeholder.jpg"} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <h3 className="font-black text-sm mb-1">{property?.title}</h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Building size={12} /> {property?.propertyType || "Residential"}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className={isDark ? 'text-white/40' : 'text-slate-500'}>Property Price</span>
                  <span>৳{new Intl.NumberFormat('en-IN').format(price)}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className={isDark ? 'text-white/40' : 'text-slate-500'}>Service Charge</span>
                  <span>৳0.00</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-sm font-black uppercase tracking-[0.2em]">Total Payable</span>
                  <span className="text-xl font-black text-teal-600">৳{new Intl.NumberFormat('en-IN').format(price)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-teal-50 border border-teal-200">
                <ShieldCheck size={20} className="text-teal-600 shrink-0" />
                <p className="text-[10px] font-bold text-teal-700 leading-relaxed uppercase tracking-widest">
                  Your transaction is secured by industry standard SSL encryption and SSLCommerz payment gateway.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-8">
            <div className={isDark 
              ? "p-10 rounded-3xl border border-white/5 bg-white/5 space-y-8" 
              : "p-10 rounded-3xl border border-slate-200 bg-white space-y-8"}>
              <div className="space-y-2">
                <h2 className="text-xl font-black tracking-tight">Payment <span className="text-teal-600 italic">Method</span></h2>
                <p className={isDark 
                ? "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30" 
                : "text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"}>Select your preferred gateway</p>
              </div>

              <div className="space-y-4">
                <div className={isDark 
                  ? "p-6 rounded-xl border-2 border-teal-400/50 bg-white/5 transition-all flex items-center justify-between group" 
                  : "p-6 rounded-xl border-2 border-teal-200 bg-teal-50 transition-all flex items-center justify-between group shadow-lg"}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/20">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm">SSLCommerz</h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Digital Payment Gateway</p>
                    </div>
                  </div>
                  <CheckCircle2 size={20} className="text-teal-600" />
                </div>
              </div>

              <button 
                onClick={handlePayNow}
                disabled={loading}
                className={isDark 
                  ? "w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-[var(--primary)] text-white hover:bg-white/10" 
                  : "w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none bg-teal-600 text-white hover:bg-teal-700"}
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                {loading ? "Initializing..." : "Proceed to Pay Now"}
              </button>
            </div>

            <div className="text-center">
              <p className={isDark 
                ? "text-[9px] font-bold uppercase tracking-[0.3em] text-white/20" 
                : "text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400"}>
                By proceeding, you agree to our Terms of Service & Privacy Protocol.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin text-teal-600" size={48} />
        <p className="font-bold uppercase tracking-widest text-[10px]">Loading Transaction Hub...</p>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}

