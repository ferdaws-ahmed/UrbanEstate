import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, sellerId, reason } = await request.json();
    if (!propertyId || !reason) {
      return NextResponse.json({ error: "Missing propertyId or reason" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const notificationsCollection = await connect("notifications");

    const property = await propertiesCollection.findOne({
      _id: new ObjectId(propertyId),
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Security guard: seller cannot report their own property.
    const propertySellerId = property.sellerId ?? sellerId;
    const reporterId = String(session.user.id);
    const isOwnerSeller = session.user.role === "seller" && String(propertySellerId) === reporterId;

    if (isOwnerSeller) {
      return NextResponse.json({ error: "You cannot report your own property." }, { status: 403 });
    }

    const reportReason = String(reason).trim();
    if (!reportReason) {
      return NextResponse.json({ error: "Reason is required" }, { status: 400 });
    }

    const report = {
      id: `${propertyId}-${Date.now()}`,
      reason: reportReason,
      message: reportReason,
      reportedBy: session.user.name || session.user.email || "Anonymous",
      reportedById: reporterId,
      reportedByRole: session.user.role,
      status: "unread",
      createdAt: new Date(),
    };

    await propertiesCollection.updateOne(
      { _id: new ObjectId(propertyId) },
      { $push: { propertyReports: report } }
    );

    // Notify reporter (only for user/seller dashboards)
    if (session.user.role === "user" || session.user.role === "seller") {
      await notificationsCollection.insertOne({
        userId: reporterId,
        fromUserId: session.user.id,
        propertyId: propertyId,
        text: `Your property report has been submitted for "${property.title}".`,
        type: "property_report",
        read: false,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Property report error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


