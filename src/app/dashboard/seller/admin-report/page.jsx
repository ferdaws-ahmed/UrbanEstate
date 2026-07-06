import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import AdminReportPage from "@/src/components/dashboard/shared/AdminReportPage";

export default function SellerAdminReport() {
  return (
    <DashboardParent title="Admin Report">
      <AdminReportPage userRole="seller" />
    </DashboardParent>
  );
}

