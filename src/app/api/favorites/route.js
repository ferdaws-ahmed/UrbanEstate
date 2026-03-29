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

    const { propertyId, sellerId } = await request.json();
    if (!propertyId || !sellerId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const favoritesCollection = await connect("favorites");
    
    // Check if already favorited
    const existing = await favoritesCollection.findOne({
      userId: session.user.id,
      propertyId: propertyId
    });

    if (existing) {
      // Remove favorite (unfavorite)
      await favoritesCollection.deleteOne({ _id: existing._id });
      
      // Update property's favorite count
      try {
        const propertiesCollection = await connect("properties");
        await propertiesCollection.updateOne(
          { _id: new ObjectId(propertyId) },
          { $inc: { favoriteCount: -1 } }
        );
      } catch (pErr) {
        console.error("Failed to update property favorite count:", pErr);
      }
      
      // Also remove the notification and lead for the seller
      try {
        const notificationsCollection = await connect("notifications");
        await notificationsCollection.deleteOne({
          userId: sellerId,
          fromUserId: session.user.id,
          propertyId: propertyId,
          type: "favorite"
        });

        const leadsCollection = await connect("seller_leads");
        await leadsCollection.deleteOne({
          sellerId: sellerId,
          userId: session.user.id,
          propertyId: propertyId,
          type: "favorite_lead"
        });
      } catch (nErr) {
        console.error("Failed to remove data:", nErr);
      }

      return NextResponse.json({ message: "Removed from favorites", favorited: false });
    } else {
      // Add favorite
      await favoritesCollection.insertOne({
        userId: session.user.id,
        userName: session.user.name,
        userEmail: session.user.email,
        userImage: session.user.image,
        propertyId: propertyId,
        sellerId: sellerId,
        createdAt: new Date(),
      });

      // Update property's favorite count
      const propertiesCollection = await connect("properties");
      await propertiesCollection.updateOne(
        { _id: new ObjectId(propertyId) },
        { $inc: { favoriteCount: 1 } }
      );

      // Fetch property title for the lead
      const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });

      // Create notification and lead for seller
      try {
        const notificationsCollection = await connect("notifications");
        await notificationsCollection.insertOne({
          userId: sellerId,
          fromUserId: session.user.id,
          propertyId: propertyId,
          text: `${session.user.name} favorited your property: ${property?.title || 'Untitled'}!`,
          type: "favorite",
          read: false,
          createdAt: new Date(),
        });

        const leadsCollection = await connect("seller_leads");
        await leadsCollection.insertOne({
          sellerId: sellerId,
          userId: session.user.id,
          userName: session.user.name,
          userEmail: session.user.email,
          userImage: session.user.image,
          propertyId: propertyId,
          propertyTitle: property?.title || "Untitled Property",
          propertyAddress: property?.address || property?.location || "N/A",
          propertyPrice: property?.price || 0,
          propertyImage: (property?.images && property.images.length > 0) ? property.images[0] : null,
          type: "favorite_lead",
          message: `${session.user.name} bookmarked your property: ${property?.title || 'Untitled'}`,
          status: "new",
          createdAt: new Date(),
        });
      } catch (nErr) {
        console.error("Data Sync Error:", nErr);
      }

      return NextResponse.json({ message: "Added to favorites", favorited: true });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    const sellerId = searchParams.get("sellerId");
    
    const session = await getServerSession(authOptions);
    const favoritesCollection = await connect("favorites");

    if (propertyId && !sellerId) {
        // Get all users who favorited this property (for seller dashboard modal)
        const users = await favoritesCollection.find({ propertyId }).toArray();
        return NextResponse.json(users);
    }

    if (sellerId) {
        // Get all properties favorited by anyone for this seller
        // This is complex because we need property details too.
        // We'll handle this in the seller dashboard API instead for efficiency.
        return NextResponse.json({ error: "Use seller dashboard API" }, { status: 400 });
    }

    if (session?.user?.id) {
        // Get all properties favorited by current user
        const myFavorites = await favoritesCollection.find({ userId: session.user.id }).toArray();
        return NextResponse.json(myFavorites);
    }

    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
