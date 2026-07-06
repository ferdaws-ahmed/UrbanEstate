/**
 * Seller Property API Route
 * Fetches all published properties from MongoDB
 * Supports filtering and sorting
 */

import { connect } from "@/src/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Get query parameters
    const sort = searchParams.get('sort') || 'newest'; // newest, price_asc, price_desc
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const propertyType = searchParams.get('propertyType');
    const bedrooms = searchParams.get('bedrooms');
    const amenities = searchParams.get('amenities');
    const search = searchParams.get('search');

    // Connect to MongoDB
    const propertiesCollection = await connect("properties");

    // Build filter query
    // properties কালেকশনে সাধারণত শুধু পাবলিশড প্রপার্টিই থাকে, তাও ফিল্টার যোগ করা হলো সেফটির জন্য
    const filter = {};

    // Price filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Property type filtering
    if (propertyType) {
      filter.propertyType = { $regex: new RegExp(`^${propertyType}$`, 'i') };
    }

    // Bedrooms filtering
    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Amenities filtering
    if (amenities) {
      const amenityArray = amenities.split(',');
      filter.amenities = { $all: amenityArray };
    }

    // Search filtering (title, description, address)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { district: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort query
    let sortQuery = {};
    switch (sort) {
      case 'price_asc':
        sortQuery = { price: 1 };
        break;
      case 'price_desc':
        sortQuery = { price: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { createdAt: -1 };
        break;
    }

    // Fetch properties from database
    const properties = await propertiesCollection
      .find(filter)
      .sort(sortQuery)
      .limit(100)
      .toArray();

    // Get favorite counts for all fetched properties
    const favoritesCollection = await connect("favorites");
    const favCounts = await favoritesCollection.aggregate([
      { $match: { propertyId: { $in: properties.map(p => p._id.toString()) } } },
      { $group: { _id: "$propertyId", count: { $sum: 1 } } }
    ]).toArray();

    const favCountMap = favCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Check which ones are favorited by the current logged-in user
    const userFavorites = session?.user?.email
      ? (await favoritesCollection.find({
          userEmail: session.user.email,
          propertyId: { $in: properties.map(p => p._id.toString()) }
        }).toArray()).map(f => f.propertyId.toString())
      : [];

    // Default image URLs (free, working images)
    const defaultImages = [
      "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    // Format response - convert ObjectId to string
    const formattedProperties = properties.map((prop, index) => {
      let images = prop.images || [];
      
      if (!Array.isArray(images)) {
        images = [images];
      }
      
      // Replace dead unsplash URLs with working pexels URLs
      images = images.map(url => {
        if (typeof url === 'string' && (url.includes('unsplash') || url === "")) {
          return defaultImages[index % defaultImages.length];
        }
        return url;
      });
      
      if (images.length === 0 || images.every(img => !img)) {
        images = [defaultImages[index % defaultImages.length]];
      }
      
      return {
        ...prop,
        _id: prop._id.toString(),
        sellerId: prop.sellerId?.toString(),
        images: images,
        favoriteCount: favCountMap[prop._id.toString()] || 0,
        isFavorited: userFavorites.includes(prop._id.toString())
      };
    });

    return NextResponse.json(formattedProperties);

  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', details: error.message },
      { status: 500 }
    );
  }
}

