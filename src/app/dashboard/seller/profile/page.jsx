import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerProfilePage from "@/src/components/dashboard/seller/profile/SellerProfilePage";

export const metadata = {
  title: "Account Profile | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Profile">
      <SellerProfilePage />
    </DashboardParent>
  );
}

