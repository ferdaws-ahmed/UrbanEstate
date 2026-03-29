import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerCreateListingPage from "@/src/components/dashboard/seller/create-listing/SellerCreateListingPage";

export const metadata = {
  title: "Create Listing | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Create New Listing">
      <SellerCreateListingPage />
    </DashboardParent>
  );
}
