import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerAnalyticsPage from "@/src/components/dashboard/seller/analytics/SellerAnalyticsPage";

export const metadata = {
  title: "Analytics | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Analytics">
      <SellerAnalyticsPage />
    </DashboardParent>
  );
}
