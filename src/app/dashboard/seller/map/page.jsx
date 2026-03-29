import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerMapPage from "@/src/components/dashboard/seller/map/SellerMapPage";

export const metadata = {
  title: "Property Map | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Property Map">
      <SellerMapPage />
    </DashboardParent>
  );
}
