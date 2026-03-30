import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserChat from "@/src/components/dashboard/user/chat/UserChat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Messages | User Dashboard",
};

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "user") redirect("/");

  return (
    <UserDashboardParent title="Messenger">
      <UserChat />
    </UserDashboardParent>
  );
}
