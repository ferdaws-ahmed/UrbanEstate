import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerUpdatePropertyPage from "@/src/components/dashboard/seller/edit/SellerUpdatePropertyPage";

export const metadata = {
  title: "Update Property | Seller",
};

export default async function Page({ params }) {
  const { id } = await params;
  
  return (
    <DashboardParent title="Update Property">
      <SellerUpdatePropertyPage propertyId={id} />
    </DashboardParent>
  );
}
