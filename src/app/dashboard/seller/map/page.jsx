import DashboardParent from "@/src/components/dashboard/seller/DashboardParent";
import SellerMapPage from "@/src/components/dashboard/seller/map/SellerMapPage";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Property Map | Seller",
};

export default function Page() {
  return (
    <DashboardParent title="Property Map">
      <Suspense fallback={
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        </div>
      }>
        <SellerMapPage />
      </Suspense>
    </DashboardParent>
  );
}

