import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserSettings from "@/src/components/dashboard/user/settings/UserSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Account Settings | User Dashboard",
};

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "user") redirect("/");

  return (
    <UserDashboardParent title="Settings">
      <UserSettings />
    </UserDashboardParent>
  );
}
