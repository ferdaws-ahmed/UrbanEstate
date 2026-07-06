import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, sellerId, message } = await request.json();
    if (!propertyId || !sellerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const leadsCollection = await connect("seller_leads");
    await leadsCollection.insertOne({
      sellerId: sellerId,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userImage: session.user.image,
      propertyId: propertyId,
      propertyTitle: property.title || "Untitled Property",
      propertyAddress: property.address || property.location || "N/A",
      propertyPrice: property.price || 0,
      propertyImage: (property.images && property.images.length > 0) ? property.images[0] : null,
      type: "contact_lead",
      message: message || `${session.user.name} wants to contact you about ${property.title}`,
      status: "new",
      createdAt: new Date(),
    });

    // Also create a notification for the seller
    try {
      const notificationsCollection = await connect("notifications");
      await notificationsCollection.insertOne({
        userId: sellerId,
        fromUserId: session.user.id,
        propertyId: propertyId,
        text: `${session.user.name} sent you a message about ${property.title}`,
        type: "message",
        read: false,
        createdAt: new Date(),
      });
    } catch (nErr) {
      console.error("Notification error:", nErr);
    }

    return NextResponse.json({ message: "Message sent successfully", success: true });
  } catch (error) {
    console.error("Contact seller error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

