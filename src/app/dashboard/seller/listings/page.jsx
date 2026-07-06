import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerListingsPage from "@/src/components/dashboard/seller/listings/SellerListingsPage";

export const metadata = {
  title: "My Listings | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="My Listings">
      <SellerListingsPage />
    </DashboardParent>
  );
}

