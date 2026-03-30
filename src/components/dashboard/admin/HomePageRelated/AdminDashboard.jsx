"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/src/components/Theme/ThemeContext';
import toast from 'react-hot-toast';

// Import all original components
import StatCards from './StatCards';
import SalesPerformanceChart from './SalesPerformanceChart';
import UserGrowthChart from './UserGrowthChart';
import TopSellers from './TopSellers';
import RecentListings from './RecentListings';
import PendingApprovals from './PendingApprovals';
import MarketShare from './MarketShare';
import SellerLeaderboard from './SellerLeaderboard';
import SupportTickets from './SupportTickets';
import MiniSellerPerformance from './MiniSellerPerformance';
import PropertyType from './PropertyType';
import LatestTransactions from './LatestTransactions';
import UpcomingMeetings from './UpcomingMeetings';
import RevenueTarget from './RevenueTarget';
import AIPredictiveAnalytics from './AIPredictiveAnalytics';
import SmartInventorySnapshot from './SmartInventorySnapshot';
import LiveActivityStream from './LiveActivityStream';
import SellerEfficiencyMatrix from './SellerEfficiencyMatrix';
import MarketingCampaignROI from './MarketingCampaignROI';
import PriorityTasks from './PriorityTasks'; 
import UserFeedback from './UserFeedback';
import QuickActions from './QuickActions';

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const result = await response.json();
        setDashboardData(result);
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Error connecting to backend");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className={`min-h-[calc(100vh-200px)] flex items-center justify-center ${isDark ? 'bg-[#091a16]' : 'bg-[#f4f7f6]'}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-800'}`}>Loading Secure Systems...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  // This now only returns the main content, not the duplicate layout.
  // The main layout is handled by src/app/dashboard/admin/layout.jsx
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full">
      {/* left section*/}
      <div className="xl:col-span-6 flex flex-col gap-6 w-full">
        <StatCards stats={dashboardData.stats} />
        <AIPredictiveAnalytics data={dashboardData.aiPrediction} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SalesPerformanceChart data={dashboardData.salesPerformance} />
          <UserGrowthChart data={dashboardData.userGrowth} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TopSellers Sellers={dashboardData.sellers} />
          <RecentListings listings={dashboardData.recentListings} />
        </div>
        <PendingApprovals approvals={dashboardData.pendingApprovals} />
        <QuickActions actions={dashboardData.quickActions} />
        <MarketingCampaignROI campaigns={dashboardData.marketingCampaigns} />
        <PriorityTasks /> 
      </div>

      {/* middle section*/}
      <div className="xl:col-span-4 flex flex-col gap-6 w-full">
        <div className="w-full shrink-0 h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden border shadow-sm dark:border-[#1a4a40] bg-gray-50 dark:bg-[#133c34]">
          <PropertyMap properties={dashboardData.properties} mapCenter={dashboardData.mapCenter} />
        </div>
        <SmartInventorySnapshot inventory={dashboardData.smartInventory} />
        <LatestTransactions />
        <UpcomingMeetings />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col h-full"><MarketShare data={dashboardData.marketShare} /></div>
          <div className="flex flex-col h-full"><MiniSellerPerformance /></div>
        </div>
        <UserFeedback feedback={dashboardData.userFeedback} />
      </div>

      {/* right section*/}
      <div className="xl:col-span-2 flex flex-col gap-6 w-full">
        <PropertyType />
        <SellerEfficiencyMatrix efficiency={dashboardData.sellerEfficiency} />
        <SellerLeaderboard />
        <RevenueTarget />
        <LiveActivityStream activities={dashboardData.liveActivities} />
        <SupportTickets />
      </div>
    </div>
  );
}
