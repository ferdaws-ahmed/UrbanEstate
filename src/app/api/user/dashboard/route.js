import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "user" && session.user.role !== "seller")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    // Connect to database
    const favoritesCollection = await connect("favorites");
    const leadsCollection = await connect("seller_leads");
    const notificationsCollection = await connect("notifications");
    const propertiesCollection = await connect("properties");
    const messagesCollection = await connect("messages");

    // Get counts
    const favoritesCount = await favoritesCollection.countDocuments({ userId });
    const inquiriesCount = await leadsCollection.countDocuments({ email: userEmail });
    const notificationsCount = await notificationsCollection.countDocuments({ userId, read: false });
    const unreadMessagesCount = await messagesCollection.countDocuments({ 
      receiverId: new ObjectId(userId), 
      seen: false 
    });

    // Get user comments history
    const propertyCommentsCollection = await connect("property_comments");
    const userComments = await propertyCommentsCollection.find({ userId }).sort({ createdAt: -1 }).toArray();

    // Get purchase history (transactions)
    const purchasesCollection = await connect("purchases");
    const purchasesRaw = await purchasesCollection.find({ userId }).sort({ createdAt: -1 }).toArray();
    
    const purchases = await Promise.all(purchasesRaw.map(async (p) => {
      try {
        const property = await propertiesCollection.findOne({ _id: new ObjectId(p.propertyId) });
        return {
          id: p._id,
          propertyId: p.propertyId,
          propertyTitle: property?.title || "Unknown Asset",
          amount: p.amount,
          status: p.status,
          createdAt: p.createdAt,
          image: property?.images?.[0] || property?.image
        };
      } catch (e) { return null; }
    }));

    // Get recent favorites with property details (Ensuring full address)
    const recentFavoritesRaw = await favoritesCollection.find({ userId }).sort({ createdAt: -1 }).limit(10).toArray();
    
    const recentFavorites = await Promise.all(recentFavoritesRaw.map(async (fav) => {
      try {
        const property = await propertiesCollection.findOne({ _id: new ObjectId(fav.propertyId) });
        if (!property) return null;
        return {
          id: fav.propertyId,
          title: property.title,
          price: property.price,
          image: property.images?.[0] || property.image,
          location: property.fullAddress || property.address, // Ensure full address
          createdAt: fav.createdAt
        };
      } catch (e) { return null; }
    }));

    // Get recent inquiries
    const recentInquiries = await leadsCollection.find({ email: userEmail })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    // Get all notifications for Inquiry page "Activity Feed"
    const userNotifications = await notificationsCollection.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json({
      stats: {
        favorites: favoritesCount,
        inquiries: inquiriesCount,
        notifications: notificationsCount,
        unreadMessages: unreadMessagesCount
      },
      recentFavorites: recentFavorites.filter(f => f !== null),
      recentInquiries: recentInquiries.map(lead => ({
        id: lead._id,
        propertyTitle: lead.propertyTitle,
        message: lead.message,
        status: lead.status,
        createdAt: lead.createdAt,
        propertyId: lead.propertyId
      })),
      userComments: userComments.map(c => ({
        id: c._id,
        propertyId: c.propertyId,
        propertyTitle: c.propertyTitle || "Unknown Property",
        comment: c.text || c.comment, // Support both field names
        createdAt: c.createdAt
      })),
      purchases: purchases.filter(p => p !== null),
      activityFeed: userNotifications
    });

  } catch (error) {
    console.error("User Dashboard API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
