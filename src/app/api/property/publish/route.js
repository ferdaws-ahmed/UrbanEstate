import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { draftId } = await request.json();
    if (!draftId) {
      return NextResponse.json({ error: "Draft ID required" }, { status: 400 });
    }

    const draftsCollection = await connect("draftProperties");
    const draft = await draftsCollection.findOne({ 
      _id: new ObjectId(draftId), 
      sellerId: session.user.id 
    });

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // Prepare data for publication
    const { _id, updatedAt, isDraft, ...propertyData } = draft;
    const propertiesCollection = await connect("properties");
    
    const result = await propertiesCollection.insertOne({
      ...propertyData,
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
      visitCount: 0,
      favoriteCount: 0,
      commentCount: 0
    });

    // Delete from drafts
    await draftsCollection.deleteOne({ _id: new ObjectId(draftId) });

    // Send notification
    try {
      const notificationsCollection = await connect("notifications");
      await notificationsCollection.insertOne({
        userId: session.user.id,
        text: `Success: Asset "${draft.title}" has been published to the main grid.`,
        type: "system",
        read: false,
        createdAt: new Date(),
      });
    } catch (nErr) {
      console.error("Notification error:", nErr);
    }

    return NextResponse.json({ 
      message: "Asset published successfully", 
      success: true,
      propertyId: result.insertedId 
    });

  } catch (error) {
    console.error("Publish API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
