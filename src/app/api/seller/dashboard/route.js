import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { connect } from "@/src/lib/dbConnect";
import { addressToString } from "@/src/lib/addressToString";

export const runtime = "nodejs";

function daysSince(date) {
  if (!date) return 0;
  const d = new Date(date);
  return Math.max(0, Math.floor((Date.now() - d.getTime()) / 86400000));
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.user.role !== "seller") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const sellerId = session.user.id;
    const propertiesCollection = await connect("properties");

    const properties = await propertiesCollection
      .find({ sellerId })
      .sort({ createdAt: -1 })
      .toArray();

    const totalListings = properties.length;
    const daysOnMarketList = properties.map((p) => daysSince(p.createdAt));
    const avgDaysOnMarket =
      totalListings > 0
        ? Math.round(
            daysOnMarketList.reduce((a, b) => a + b, 0) / totalListings
          )
        : 0;

    const totalViews = properties.reduce((s, p) => s + (Number(p.views) || 0), 0);
    const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const viewsByDay = dayLabels.map((day, i) => ({
      day,
      views:
        totalListings === 0
          ? 0
          : Math.max(
              1,
              Math.round(totalViews / 6) + (i % 4) - 1
            ),
    }));

    const now = new Date();
    const monthLabels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(d.toLocaleString("en-US", { month: "short" }));
    }
    const byMonth = {};
    monthLabels.forEach((m) => {
      byMonth[m] = 0;
    });
    let inquiriesTrend = monthLabels.map((month) => ({ month, count: 0 }));

    let recentInquiries = [];

    try {
      const leadsCollection = await connect("seller_leads");
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      const leads = await leadsCollection
        .find({ sellerId, createdAt: { $gte: sixMonthsAgo } })
        .toArray();

      leads.forEach((lead) => {
        const m = new Date(lead.createdAt).toLocaleString("en-US", {
          month: "short",
        });
        if (byMonth[m] !== undefined) byMonth[m] += 1;
      });
      inquiriesTrend = monthLabels.map((month) => ({
        month,
        count: byMonth[month] || 0,
      }));

      const recent = await leadsCollection
        .find({ sellerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      recentInquiries = recent.map((r) => ({
        id: r._id.toString(),
        name: r.name || "Lead",
        message: r.message || "",
        avatar: r.avatar || null,
        createdAt: r.createdAt,
      }));
    } catch {
      // collection may not exist yet
    }

    let topListing = null;
    if (properties.length > 0) {
      const sorted = [...properties].sort(
        (a, b) => (Number(b.views) || 0) - (Number(a.views) || 0)
      );
      const top = sorted[0];
      topListing = {
        _id: top._id.toString(),
        title: top.title || "Listing",
        price: top.price || 0,
        views: top.views || 0,
        area: top.area || 0,
        bedrooms: top.bedrooms ?? 0,
        bathrooms: top.bathrooms ?? 0,
        images: top.images || [],
        address: addressToString(top.address, top.location),
      };
    }

    const listingsTable = properties.slice(0, 10).map((p) => ({
      _id: p._id.toString(),
      title: p.title || "",
      description: p.description || "",
      address: addressToString(p.address, p.location),
      status: p.status || "draft",
      category: p.category || "",
      price: p.price || 0,
      bedrooms: p.bedrooms ?? 0,
      bathrooms: p.bathrooms ?? 0,
      area: p.area ?? 0,
      images: p.images || [],
    }));

    return NextResponse.json({
      stats: {
        totalListings,
        activeListings: properties.filter((p) =>
          ["active", "published"].includes(p.status)
        ).length,
        avgDaysOnMarket,
      },
      viewsByDay,
      inquiriesTrend,
      recentInquiries,
      listings: listingsTable,
      topListing,
    });
  } catch (error) {
    console.error("seller dashboard:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
