import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerOverview from "@/src/components/dashboard/seller/overview/SellerOverview";

export const metadata = {
  title: "Seller Dashboard | UrbanEstate",
};

export default function SellerDashboardPage() {
  return (
    <DashboardParent title="Dashboard">
      <SellerOverview />
    </DashboardParent>
  );
}

