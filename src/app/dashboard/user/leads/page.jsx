import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserInquiries from "@/src/components/dashboard/user/leads/UserInquiries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Inquiries | User Dashboard",
};

export default async function InquiriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "user") redirect("/");

  return (
    <UserDashboardParent title="My Inquiries">
      <UserInquiries />
    </UserDashboardParent>
  );
}
