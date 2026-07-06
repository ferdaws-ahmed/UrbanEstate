import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerLeadsPage from "@/src/components/dashboard/seller/leads/SellerLeadsPage";

export const metadata = {
  title: "Leads & Messages | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Leads & Messages">
      <SellerLeadsPage />
    </DashboardParent>
  );
}

