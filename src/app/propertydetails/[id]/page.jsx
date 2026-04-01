import React from "react";
import Link from "next/link";
import PropertyDetailsClient from "./propertydetailsclient";
import { connect } from "@/src/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { cookies } from "next/headers";

// ডাটা ফেচিং ফাংশন
async function getPropertyData(id, shouldCount) {
  try {
    const session = await getServerSession(authOptions);
    const propertiesCollection = await connect("properties");
    
    let oid;
    try {
      oid = new ObjectId(id);
    } catch {
      return null;
    }

    const property = await propertiesCollection.findOne({ _id: oid });
    if (!property) return null;

    let visitCount = property.visitCount || 0;

    if (shouldCount) {
      // ⚠️ Next.js 15/16 এ cookies() এর আগে await দিতে হবে
      const cookieStore = await cookies(); 
      const cookieKey = `viewed_property_${id}`;
      const existing = cookieStore.get(cookieKey)?.value === "1";

      if (!existing) {
        try {
          await propertiesCollection.updateOne(
            { _id: oid },
            { $inc: { visitCount: 1 } }
          );
          visitCount += 1;

          try {
            // ⚠️ এখানেও set করার সময় cookieStore এর আগে await কার্যকর থাকবে
            cookieStore.set(cookieKey, "1", {
              path: "/",
              maxAge: 60 * 60 * 24 * 30, // 30 days
              httpOnly: true,
              sameSite: "lax",
            });
          } catch (cookieErr) {
            console.warn("Could not set cookie in RSC:", cookieErr.message);
          }
        } catch (vErr) {
          console.error("Failed to update visit count:", vErr);
        }
      }
    }

    const favoritesCollection = await connect("favorites");
    const favoriteCount = await favoritesCollection.countDocuments({ propertyId: id });
    
    let isFavorited = false;
    if (session?.user?.email) {
      const existing = await favoritesCollection.findOne({
        userEmail: session.user.email,
        propertyId: id
      });
      isFavorited = !!existing;
    }

    return {
      ...JSON.parse(JSON.stringify(property)),
      visitCount,
      favoriteCount,
      isFavorited
    };
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

export default async function PropertyPage({ params, searchParams }) {
  // Next.js 15/16 এ params এবং searchParams ও await করতে হয়
  const { id } = await params; 
  const sParams = await searchParams;
  const shouldCount = sParams?.view === "1";

  const property = await getPropertyData(id, shouldCount);

  if (!property) {
    return (
      <div className="h-screen bg-[#061510] flex flex-col items-center justify-center gap-4 text-[#cddfa0]">
        <div className="font-mono text-[12px] tracking-[0.4em] animate-pulse uppercase">
          ERROR: Asset {id?.slice(-6)} Not Found
        </div>
        <Link href="/" className="text-[10px] uppercase border border-[#cddfa0]/30 px-6 py-2 rounded-full hover:bg-[#cddfa0] hover:text-[#061510] transition-all">
          Return to Base
        </Link>
      </div>
    );
  }

  return <PropertyDetailsClient property={property} />;
}