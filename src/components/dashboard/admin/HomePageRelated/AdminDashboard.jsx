"use client";

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import data from '../../../../../public/data/dashboardData.json'
import { useTheme } from '../../../ThemeProvider';

import { Menu, ShieldCheck } from 'lucide-react';

// Components
import Sidebar from '../Sidebar';
import Topbar from '../Topbar';
import StatCards from './StatCards';
import SalesPerformanceChart from './SalesPerformanceChart';
import UserGrowthChart from './UserGrowthChart';
import TopAgents from './TopAgents';
import RecentListings from './RecentListings';
import PendingApprovals from './PendingApprovals';
import MarketShare from './MarketShare';
import AgentLeaderboard from './AgentLeaderboard';
import SupportTickets from './SupportTickets';
import MiniAgentPerformance from './MiniAgentPerformance';
import PropertyType from './PropertyType';
import LatestTransactions from './LatestTransactions';
import UpcomingMeetings from './UpcomingMeetings';
import RevenueTarget from './RevenueTarget';
import AIPredictiveAnalytics from './AIPredictiveAnalytics';
import SmartInventorySnapshot from './SmartInventorySnapshot';
import LiveActivityStream from './LiveActivityStream';
import AgentEfficiencyMatrix from './AgentEfficiencyMatrix';
import MarketingCampaignROI from './MarketingCampaignROI';
import PriorityTasks from './PriorityTasks'; 
import ClientFeedback from './ClientFeedback';
import QuickActions from './QuickActions';

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const { isDark } = useTheme();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    setDashboardData(data);
    
 
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
      clearTimeout(timer);
    };
  }, []);

  if (!dashboardData) return null;

  return (
    <div className={`min-h-screen flex overflow-hidden ${isDark ? 'bg-[#091a16] text-gray-100' : 'bg-[#f4f7f6] text-gray-900'}`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div 
        className={`relative flex flex-col min-h-screen transition-all duration-500 ease-in-out w-full
          ${isMobile 
            ? 'ml-0' 
            : isCollapsed 
              ? 'lg:ml-[90px] lg:w-[calc(100%-90px)]' 
              : 'lg:ml-[260px] lg:w-[calc(100%-260px)]'
          }
        `}
      >
        <header className={`sticky top-0 z-[80] flex items-center px-4 py-2 border-b backdrop-blur-md ${
          isDark ? 'bg-[#091a16]/80 border-[#1a4a40]' : 'bg-white/80 border-gray-200'
        }`}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl border mr-3 transition-all"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 w-full">
            <Topbar />
          </div>
        </header>
   
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[75vh] w-full">
            <div className="relative">
              <div className={`w-20 h-20 border-4 rounded-full ${isDark ? 'border-[#1a4a40]' : 'border-gray-200'}`}></div>
              <div className={`w-20 h-20 border-4 rounded-full border-t-transparent animate-spin absolute top-0 left-0 ${isDark ? 'border-[#cddfa0]' : 'border-blue-600'}`}></div>
              <ShieldCheck className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isDark ? 'text-[#cddfa0]' : 'text-blue-600'}`} size={24} />
            </div>
            <p className="mt-6 text-sm font-bold animate-pulse tracking-widest uppercase text-gray-500 dark:text-[#cddfa0]">Loading Dashboard...</p>
          </div>
        ) : (
          <main className="p-4 md:p-6 w-full max-w-full overflow-y-auto animate-in fade-in duration-700 slide-in-from-bottom-4">
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
                  <TopAgents agents={dashboardData.agents} />
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
                  <div className="flex flex-col h-full"><MiniAgentPerformance /></div>
                </div>
                <ClientFeedback feedback={dashboardData.clientFeedback} />
              </div>

              {/* right section*/}
              <div className="xl:col-span-2 flex flex-col gap-6 w-full">
                <PropertyType />
                <AgentEfficiencyMatrix efficiency={dashboardData.agentEfficiency} />
                <AgentLeaderboard />
                <RevenueTarget />
                <LiveActivityStream activities={dashboardData.liveActivities} />
                <SupportTickets />
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );  
}