"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MetricCards from "./MetricCards";
import ListingViewsChart from "./ListingViewsChart";
import InquiriesTrendChart from "./InquiriesTrendChart";
import RecentInquiries from "./RecentInquiries";
import MyListingsTable from "./MyListingsTable";
import TopPerformingCard from "./TopPerformingCard";
import { MessageCircle } from "lucide-react";
import { useTheme } from "@/src/components/Theme/ThemeContext";

export default function SellerOverview() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const fetchDashboardData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/seller/dashboard", { credentials: "include" });
      
      if (res.status === 403) {
        setError("seller_only");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Failed to load");
      }
      const json = await res.json();
      if (!json) return;

      setData({
        ...json,
        stats: json.stats ?? {
          totalListings: 0,
          activeListings: 0,
          avgDaysOnMarket: 0,
        },
        viewsByDay: Array.isArray(json.viewsByDay) ? json.viewsByDay : [],
        inquiriesTrend: Array.isArray(json.inquiriesTrend) ? json.inquiriesTrend : [],
        recentInquiries: Array.isArray(json.recentInquiries) ? json.recentInquiries : [],
        listings: Array.isArray(json.listings) ? json.listings : [],
      });

      // Fetch unread messages count
      const unreadRes = await fetch("/api/user/dashboard");
      const unreadData = await unreadRes.json();
      if (unreadRes.ok) setUnreadCount(unreadData.stats.unreadMessages || 0);

    } catch (e) {
      setError(e.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    fetchDashboardData();

    // Polling for real-time updates every 5 seconds for overview
    const interval = setInterval(() => {
      fetchDashboardData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex h-96 items-center justify-center">
        <div
          className={`h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-teal-600`}
        />
      </div>
    );
  }

  if (error === "seller_only") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
        <p className="font-medium text-amber-900 dark:text-amber-200">
          Seller dashboard is for seller accounts only.
        </p>
        <Link href="/" className="mt-4 inline-block text-teal-600 underline dark:text-[#cddfa0]">
          Return to Home
        </Link>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="text-red-800 dark:text-red-200">{error || "Failed to load dashboard data."}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24 px-1">
      {/* Top Section: Metrics */}
      <MetricCards stats={data.stats} />

      {/* Featured Banner: Top Performer & Recent Leads */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TopPerformingCard listing={data.topListing} />
        </div>
        <div className="lg:col-span-1">
          <RecentInquiries items={data.recentInquiries} />
        </div>
      </div>

      {/* Analytics Section: Charts */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ListingViewsChart data={data.viewsByDay} />
        <InquiriesTrendChart data={data.inquiriesTrend} />
      </div>

      {/* Data Section: Favorite Listings Table */}
      <div className="pt-2">
        <MyListingsTable listings={data.listings} />
      </div>

      {/* Floating Chat Icon */}
      <Link
        href="/dashboard/seller/chat"
        className={`fixed bottom-10 right-10 z-[100] flex h-16 w-16 items-center justify-center rounded-[2rem] shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group
          ${isDark ? "bg-[#1a4a40] border border-white/10" : "bg-teal-600 border border-teal-500"}
          ${unreadCount > 0 ? "animate-bounce ring-8 ring-teal-500/30 shadow-teal-500/60" : ""}`}
        aria-label="Messages"
      >
        <MessageCircle className={`h-8 w-8 text-white ${unreadCount > 0 ? "animate-pulse" : ""}`} />
        
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 h-7 w-7 flex items-center justify-center bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-white dark:border-[#0b1f1a] shadow-lg animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}

        {/* Tooltip */}
        <div className="absolute right-20 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl border border-white/10">
          {unreadCount > 0 ? `${unreadCount} New Messages` : "Open Messenger"}
        </div>
      </Link>
    </div>
  );
}
