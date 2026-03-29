"use client";

import SellerSidebar from "./layout/SellerSidebar";
import SellerTopbar from "./layout/SellerTopbar";

export default function DashboardParent({ children, title = "Dashboard" }) {
  return (
    <div
      className="flex min-h-screen w-full bg-slate-50 text-slate-900 transition-colors
      dark:bg-[#061510] dark:text-slate-100"
    >
      <SellerSidebar />
      <div className="flex flex-1 flex-col min-w-0 md:pl-64">
        <SellerTopbar title={title} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
