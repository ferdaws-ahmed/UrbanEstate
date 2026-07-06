import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerDraftsPage from "@/src/components/dashboard/seller/drafts/SellerDraftsPage";

export const metadata = {
  title: "Draft Assets | Seller",
};

export default function DraftsPage() {
  return (
    <DashboardParent title="Draft Assets">
      <SellerDraftsPage />
    </DashboardParent>
  );
}

