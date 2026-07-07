import AdminUpdatePropertyPage from "@/src/components/dashboard/admin/EditRelated/AdminUpdatePropertyPage";

export const metadata = {
  title: "Update Property | Admin",
};

export default async function Page({ params }) {
  const { id } = await params;
  
  return <AdminUpdatePropertyPage propertyId={id} />;
}
