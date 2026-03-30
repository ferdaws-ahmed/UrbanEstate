import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserOverview from "@/src/components/dashboard/user/UserOverview";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "User Dashboard | UrbanEstate",
};

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "user") {
    redirect(session.user.role === "seller" ? "/dashboard/seller" : "/dashboard/admin");
  }

  return (
    <UserDashboardParent title="Overview">
      <UserOverview />
    </UserDashboardParent>
  );
}
