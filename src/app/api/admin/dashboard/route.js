import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await connect("users");
    const propertiesCollection = await connect("properties");
    const notificationsCollection = await connect("notifications");

    // Real DB data
    const totalUsers = await usersCollection.countDocuments({ role: "user" });
    const totalSellers = await usersCollection.countDocuments({ role: "seller" });
    const totalProperties = await propertiesCollection.countDocuments();
    const dbProperties = await propertiesCollection.find({}).limit(10).toArray();
    const dbNotifications = await notificationsCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray();
    const dbSellers = await usersCollection.find({ role: "seller" }).limit(10).toArray();

    // Enhance properties with real seller info
    const enhancedProperties = await Promise.all(dbProperties.map(async (p) => {
      let seller = null;
      if (p.sellerId) {
        const { ObjectId } = require('mongodb');
        try {
          const sId = typeof p.sellerId === 'string' ? new ObjectId(p.sellerId) : p.sellerId;
          seller = await usersCollection.findOne({ _id: sId });
        } catch (e) {}
      }
      if (!seller && (p.sellerEmail || p.userEmail)) {
        seller = await usersCollection.findOne({ email: p.sellerEmail || p.userEmail });
      }

      return {
        id: p._id,
        lat: p.location?.lat || 23.8103,
        lng: p.location?.lng || 90.4125,
        title: p.title,
        price: p.price,
        beds: p.beds,
        baths: p.baths,
        area: p.area,
        image: p.images?.[0] || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400",
        status: p.status,
        agent: seller ? seller.name : (p.sellerName || "System Admin"),
        sellerAvatar: seller ? (seller.image || seller.avatar) : "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff",
        location: p.address || "Dhaka",
        type: p.type
      };
    }));

    const dashboardData = {
      aiPrediction: {
        trend: "Upward",
        percentage: "+12.5%",
        forecastArea: "Gulshan & Banani",
        topLeadScore: 98,
        hotPropertyId: "#APT-402"
      },
      smartInventory: [
        { "id": "#PR-101", "name": "Skyview Tower", "status": "Stagnant", "daysOnMarket": 45, "roi": "4.5%" },
        { "id": "#PR-102", "name": "Green Valley Villa", "status": "Hot", "daysOnMarket": 5, "roi": "8.2%" },
        { "id": "#PR-103", "name": "Lakefront Duplex", "status": "Stagnant", "daysOnMarket": 32, "roi": "5.1%" }
      ],
      liveActivities: [
        { "id": 1, "time": "2 mins ago", "action": "New Registration", "details": "New user account created", "type": "success" },
        { "id": 2, "time": "15 mins ago", "action": "Property Added", "details": "New property listing in Gulshan", "type": "info" }
      ],
      sellerEfficiency: {
        avgResponseTime: "12 Mins",
        conversionRate: "24%",
        funnel: { leads: totalUsers, contacted: 850, negotiation: 320, closed: 85 }
      },
      marketingCampaigns: [
        { "id": 1, "platform": "Google Ads", "spent": "$12.5k", "leads": 450, "roi": "+145%", "progress": 85, "color": "bg-blue-500" },
        { "id": 2, "platform": "Email Marketing", "spent": "$2.1k", "leads": 180, "roi": "+210%", "progress": 45, "color": "bg-[#cddfa0]" }
      ],
      userFeedback: [
        { "id": 1, "User": "Anisur Rahman", "property": "Apt 48 - Gulshan", "rating": 5, "comment": "Excellent service!", "time": "2 days ago" }
      ],
      quickActions: {
        metrics: [
          { "id": "views", "label": "Viewings", "value": 14, "target": 20, "icon": "eye" },
          { "id": "leads", "label": "New Users", "value": totalUsers, "target": 50, "icon": "users" },
          { "id": "deals", "label": "Sales", "value": 2, "target": 5, "icon": "check" }
        ]
      },
      stats: {
        totalListings: { value: totalProperties, trend: "+ 18%", description: "Total properties listed" },
        newLeads: { value: totalUsers, trend: "+ 15%", description: "Total registered users" },
        propertiesSold: { value: totalSellers, trend: "+ 8%", description: "Total registered sellers" },
        revenue: { value: 3332800, trend: "+ 12%", description: "Total platform revenue" }
      },
      salesPerformance: [
        { "month": "Jan", "value": 15000 }, { "month": "Feb", "value": 18000 }, { "month": "Mar", "value": 22000 }
      ],
      userGrowth: [
        { "month": "Jan", "users": 200 }, { "month": "Feb", "users": 400 }, { "month": "Mar", "users": 600 }
      ],
      mapCenter: { lat: 23.8103, lng: 90.4125 },
      properties: enhancedProperties,
      notifications: dbNotifications.map(n => ({
        id: n._id,
        text: n.text,
        time: n.createdAt,
        unread: !n.read
      })),
      sellers: dbSellers.map(s => ({
        id: s._id,
        name: s.name,
        email: s.email,
        avatar: s.image || s.avatar || "https://i.pravatar.cc/150?u=" + s._id,
        properties: 0,
        status: "Active"
      })),
      recentListings: enhancedProperties.slice(0, 3).map(p => ({
        id: p.id,
        image: p.image,
        title: p.title,
        price: `৳${p.price?.toLocaleString()}`,
        description: `${p.beds} Bed, ${p.baths} Bath`
      })),
      pendingApprovals: [],
      marketShare: [
        { "name": "Dhaka", "value": 500, "color": "#1a4a40" },
        { "name": "Gulshan", "value": 300, "color": "#cddfa0" }
      ]
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
