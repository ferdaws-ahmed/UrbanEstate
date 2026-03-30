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

    const { propertyId, sellerId, comment, parentCommentId } = await request.json();
    if (!propertyId || !sellerId || !comment) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const commentsCollection = await connect("property_comments");
    const propertiesCollection = await connect("properties");
    
    const isSelfSellerComment = String(session.user.id) === String(sellerId);

    const newComment = {
      propertyId,
      sellerId,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userImage: session.user.image,
      text: comment,
      parentCommentId: parentCommentId || null,
      createdAt: new Date(),
    };

    await commentsCollection.insertOne(newComment);

    // Update property's comment count
    await propertiesCollection.updateOne(
      { _id: new ObjectId(propertyId) },
      { $inc: { commentCount: 1 } }
    );

    // Create a notification/lead for the seller
    // Requirement: If seller comments/replies on their own property, do NOT notify.
    if (!isSelfSellerComment) {
      try {
        const leadsCollection = await connect("seller_leads");
        const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });
        
        await leadsCollection.insertOne({
          sellerId: sellerId,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userImage: session.user.image,
          propertyId: propertyId,
          propertyTitle: property?.title || "Untitled Property",
          type: "comment_lead",
          message: parentCommentId
            ? `New reply on your property: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`
            : `New comment on your property: "${comment.substring(0, 50)}${comment.length > 50 ? '...' : ''}"`,
          status: "new",
          createdAt: new Date(),
        });

        const notificationsCollection = await connect("notifications");
        await notificationsCollection.insertOne({
          userId: sellerId,
          fromUserId: session.user.id,
          propertyId: propertyId,
          text: parentCommentId
            ? `${session.user.name} replied on your property: ${property?.title}`
            : `${session.user.name} commented on your property: ${property?.title}`,
          type: "comment",
          read: false,
          createdAt: new Date(),
        });
      } catch (err) {
        console.error("Seller update error:", err);
      }
    }

    return NextResponse.json({ message: "Comment added successfully", success: true, comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json({ error: "Missing propertyId" }, { status: 400 });
    }

    const commentsCollection = await connect("property_comments");
    const comments = await commentsCollection
      .find({ propertyId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
