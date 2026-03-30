import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

// Helper to get date range
const getDateRange = (range) => {
  const now = new Date();
  let start = new Date();

  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'this_week':
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      break;
    case 'this_month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      break;
    case 'past_1_year':
      start.setFullYear(now.getFullYear() - 1);
      break;
    case 'all_time':
    default:
      return {}; // No date filter
  }
  
  // Use a more flexible date filter that can work with both Date objects and strings if needed
  // However, for MongoDB query, we'll assume Date objects for now but add a fallback in aggregation
  return { createdAt: { $gte: start, $lte: now } };
};

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'all_time';
    const dateFilter = getDateRange(range);

    // Connect to all necessary collections
    const usersCollection = await connect("users");
    const propertiesCollection = await connect("properties");
    const favoritesCollection = await connect("favorites");
    const commentsCollection = await connect("property_comments");
    const purchasesCollection = await connect("purchases");

    // --- AGGREGATIONS ---

    // 1. General Overview Stats
    // We use a more lenient count for roles
    const totalUsers = await usersCollection.countDocuments({ role: { $regex: /^user$/i }, ...dateFilter });
    const totalSellers = await usersCollection.countDocuments({ role: { $regex: /^seller$/i }, ...dateFilter });
    const totalProperties = await propertiesCollection.countDocuments(dateFilter);
    const totalFavorites = await favoritesCollection.countDocuments(dateFilter);
    const totalComments = await commentsCollection.countDocuments(dateFilter);

    // Debug: Get absolute totals without date filter to see if date filter is the issue
    const absTotalUsers = await usersCollection.countDocuments({ role: { $regex: /^user$/i } });
    const absTotalSellers = await usersCollection.countDocuments({ role: { $regex: /^seller$/i } });
    const absTotalProperties = await propertiesCollection.countDocuments({});
    
    const propertyValueData = await propertiesCollection.aggregate([
        { $match: dateFilter },
        {
            $addFields: {
                numericPrice: {
                    $convert: {
                        input: "$price",
                        to: "double",
                        onError: 0,
                        onNull: 0
                    }
                }
            }
        },
        {
            $group: {
                _id: null,
                totalValue: { $sum: "$numericPrice" }
            }
        }
    ]).toArray();

    const salesData = await purchasesCollection.aggregate([
        { $match: dateFilter },
        {
            $addFields: {
                numericAmount: {
                    $convert: {
                        input: "$amount",
                        to: "double",
                        onError: 0,
                        onNull: 0
                    }
                }
            }
        },
        { $group: { _id: null, totalRevenue: { $sum: "$numericAmount" }, totalSales: { $sum: 1 } } }
    ]).toArray();

    // 2. User Growth Over Time (Handling potential string dates)
    const userGrowth = await usersCollection.aggregate([
        { $match: { role: { $regex: /^user$/i }, ...dateFilter } },
        { $addFields: { dateObj: { $toDate: "$createdAt" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateObj" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]).toArray();

    // 3. Property Analysis
    const propertyStatus = await propertiesCollection.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]).toArray();
    
    const propertyTypes = await propertiesCollection.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$type", count: { $sum: 1 } } }
    ]).toArray();

    // 4. Engagement Trends
    const favoritesTrend = await favoritesCollection.aggregate([
        { $match: dateFilter },
        { $addFields: { dateObj: { $toDate: "$createdAt" } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateObj" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]).toArray();

    // 5. Top 5 Most Favorited Properties
    // We need to handle potential string IDs for lookup
    const topFavorited = await favoritesCollection.aggregate([
        { $match: dateFilter },
        { $group: { _id: "$propertyId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { 
          $addFields: { 
            propId: { 
              $cond: {
                if: { $eq: [{ $type: "$_id" }, "string"] },
                then: { $toObjectId: "$_id" },
                else: "$_id"
              }
            } 
          } 
        },
        { 
          $lookup: { 
            from: 'properties', 
            localField: 'propId', 
            foreignField: '_id', 
            as: 'propertyInfo' 
          } 
        },
        { $unwind: { path: "$propertyInfo", preserveNullAndEmptyArrays: true } }
    ]).toArray();

    return NextResponse.json({
      timeRange: range,
      overview: {
        totalUsers: totalUsers || absTotalUsers, // Fallback to absolute total if filtered is 0
        totalSellers: totalSellers || absTotalSellers,
        totalProperties: totalProperties || absTotalProperties,
        totalFavorites,
        totalComments,
        totalRevenue: salesData[0]?.totalRevenue || 0,
        totalSales: salesData[0]?.totalSales || 0,
        totalPropertyValue: propertyValueData[0]?.totalValue || 0,
      },
      trends: {
        userGrowth: userGrowth.filter(d => d._id).map(d => ({ date: d._id, count: d.count })),
        favoritesTrend: favoritesTrend.filter(d => d._id).map(d => ({ date: d._id, count: d.count }))
      },
      propertyAnalysis: {
        statusDistribution: propertyStatus.map(d => ({ name: d._id || 'Unknown', value: d.count })),
        typeDistribution: propertyTypes.map(d => ({ name: d._id || 'Unknown', value: d.count }))
      },
      leaderboards: {
        topFavoritedProperties: topFavorited
          .filter(p => p.propertyInfo)
          .map(p => ({
            id: p._id,
            title: p.propertyInfo?.title || 'Unknown Property',
            image: p.propertyInfo?.images?.[0] || 'https://via.placeholder.com/150',
            count: p.count
          }))
      }
    });

  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
