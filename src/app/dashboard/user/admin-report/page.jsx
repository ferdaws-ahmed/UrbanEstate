import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import AdminReportPage from "@/src/components/dashboard/shared/AdminReportPage";

export default function UserAdminReport() {
  return (
    <UserDashboardParent title="Admin Report">
      <AdminReportPage userRole="user" />
    </UserDashboardParent>
  );
}

