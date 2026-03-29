"use client";

import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerProfilePage from "@/src/components/dashboard/seller/profile/SellerProfilePage";

export default function Page() {
  return (
    <DashboardParent title="Update Profile">
      <SellerProfilePage />
    </DashboardParent>
  );
}