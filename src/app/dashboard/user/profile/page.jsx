import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserProfile from "@/src/components/dashboard/user/profile/UserProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Profile | User Dashboard",
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "user") redirect("/");

  return (
    <UserDashboardParent title="My Profile">
      <UserProfile />
    </UserDashboardParent>
  );
}

