/**
 * Seller Property API Route
 * Fetches all published properties from MongoDB
 * Supports filtering and sorting
 */

import { connect } from "@/src/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
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
    const { db } = await connect();
    const propertiesCollection = db.collection("properties");

    // Build filter query
    const filter = { 
      status: { $in: ['active', 'published'] } // Only show active/published properties
    };

    // Price filtering
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Property type filtering
    if (propertyType) {
      filter.category = propertyType;
    }

    // Bedrooms filtering
    if (bedrooms) {
      filter.bedrooms = { $gte: parseInt(bedrooms) };
    }

    // Amenities filtering
    if (amenities) {
      const amenityArray = amenities.split(',');
      filter.amenities = { $in: amenityArray };
    }

    // Search filtering (title, description, address)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
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

    // Default image URLs (free, working images)
    const defaultImages = [
      "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg?auto=compress&cs=tinysrgb&w=600",
      "https://images.pexels.com/photos/1721933/pexels-photo-1721933.jpeg?auto=compress&cs=tinysrgb&w=600",
    ];

    // Fetch properties from database
    const properties = await propertiesCollection
      .find(filter)
      .sort(sortQuery)
      .limit(50) // Limit to 50 properties per request
      .toArray();

    // Format response - convert ObjectId to string
    const formattedProperties = properties.map((prop, index) => {
      let images = prop.images || [];
      
      // Convert to array if not already
      if (!Array.isArray(images)) {
        images = [images];
      }
      
      // Replace dead unsplash URLs with working pexels URLs
      images = images.map(url => {
        if (typeof url === 'string' && url.includes('unsplash')) {
          return defaultImages[index % defaultImages.length];
        }
        return url;
      });
      
      // If still empty, use default
      if (images.length === 0 || images.every(img => !img)) {
        images = [defaultImages[index % defaultImages.length]];
      }
      
      return {
        ...prop,
        _id: prop._id.toString(),
        sellerId: prop.sellerId?.toString(),
        images: images
      };
    });

    return new Response(JSON.stringify(formattedProperties), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching properties:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch properties', 
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
