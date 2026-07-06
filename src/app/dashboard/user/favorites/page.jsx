import UserDashboardParent from "@/src/components/dashboard/user/UserDashboardParent";
import UserFavorites from "@/src/components/dashboard/user/favorites/UserFavorites";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Saved Assets | User Dashboard",
};

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "user") redirect("/");

  return (
    <UserDashboardParent title="Saved Assets">
      <UserFavorites />
    </UserDashboardParent>
  );
}

