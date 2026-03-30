import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerChat from "@/src/components/dashboard/seller/chat/SellerChat";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Client Messenger | Seller Dashboard",
};

export default async function ChatPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");
  if (session.user.role !== "seller") redirect("/");

  return (
    <DashboardParent title="Messenger">
      <SellerChat />
    </DashboardParent>
  );
}
