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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    fetch("/api/seller/dashboard", { credentials: "include" })
      .then(async (res) => {
        if (res.status === 403) {
          setError("seller_only");
          return;
        }
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || "Failed to load");
        }
        return res.json();
      })
      .then((json) => {
        if (json) setData(json);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div
          className={`h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent ${
            isDark ? "border-[#cddfa0]" : ""
          }`}
        />
      </div>
    );
  }

  if (error === "seller_only") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/40">
        <p className="font-medium text-amber-900 dark:text-amber-200">
          Seller dashboard শুধু seller অ্যাকাউন্টের জন্য।
        </p>
        <Link href="/" className="mt-4 inline-block text-teal-600 underline dark:text-[#cddfa0]">
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
        <p className="text-red-800 dark:text-red-200">{error || "ডাটা লোড করা যায়নি।"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12 xl:gap-6">
        <div className="xl:col-span-2">
          <MetricCards stats={data.stats} />
        </div>
        <div className="xl:col-span-3">
          <ListingViewsChart data={data.viewsByDay} />
        </div>
        <div className="xl:col-span-4">
          <InquiriesTrendChart data={data.inquiriesTrend} />
        </div>
        <div className="xl:col-span-3">
          <RecentInquiries items={data.recentInquiries} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <MyListingsTable listings={data.listings} />
        </div>
        <div className="lg:col-span-4">
          <TopPerformingCard listing={data.topListing} />
        </div>
      </div>

      <Link
        href="/dashboard/seller/leads"
        className={`fixed bottom-6 right-6 z-[70] flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105
          ${isDark ? "bg-[#1a4a40] text-[#cddfa0]" : "bg-teal-600 text-white"}`}
        aria-label="Messages"
      >
        <MessageCircle className="h-7 w-7" />
      </Link>
    </div>
  );
}
