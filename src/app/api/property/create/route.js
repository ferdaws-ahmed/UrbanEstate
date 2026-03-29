import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // ১. সেশন চেক করা
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // ২. রিকোয়েস্ট ডাটা পড়া
    const propertyData = await request.json();
    console.log("Received Property Data:", propertyData);

    // ৩. ভ্যালিডেশন
    const { 
      title, price, category, status, propertyType, 
      description, bedrooms, bathrooms, area, 
      location, address, district: providedDistrict, fullAddress: providedFullAddress, 
      amenities, images 
    } = propertyData;

    if (!title || !price || !category || !propertyType || !description || !location || !address) {
      return NextResponse.json(
        { error: "Missing required fields (Title, Price, Category, Property Type, Description, Location, or Address)" },
        { status: 400 }
      );
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: "Invalid price format" },
        { status: 400 }
      );
    }

    // Use provided location details or fetch as fallback
    let district = providedDistrict || "Unknown District";
    let fullAddress = providedFullAddress || address;

    if (!providedDistrict || !providedFullAddress) {
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.latitude}&lon=${location.longitude}&accept-language=en-US`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
              "User-Agent": "UrbanEstate_RealEstate_App/2.0"
            }
          }
        );
        
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const a = geoData.address;
            district = a.state_district || a.city || a.town || a.county || a.state || "Unknown Area";
            fullAddress = geoData.display_name;
            
            // Filter Bengali characters and cleanup
            district = district.replace(/[ঀ-৿]/g, "").trim().replace(/ District$/, "");
            fullAddress = fullAddress.replace(/[ঀ-৿]/g, "").trim();
          }
        }
      } catch (geoError) {
        console.error("Geocoding fallback failed:", geoError);
      }
    }

    // ৪. ডাটাবেস কানেকশন
    let propertiesCollection;
    try {
      propertiesCollection = await connect("properties");
    } catch (dbError) {
      console.error("Database Connection Error:", dbError.message);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // ৫. নতুন প্রপার্টি তৈরি করা
    const result = await propertiesCollection.insertOne({
      title,
      price: parsedPrice,
      category, 
      propertyType, 
      status: status || "For Sale", 
      description,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      area: area ? Number(area) : null,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      district,
      fullAddress,
      address,
      amenities: amenities || [],
      images: images || [],
      sellerId: session.user.id,
      sellerEmail: session.user.email,
      listingStatus: "published", 
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // ৬. নোটিফিকেশন তৈরি করা
    try {
      const notificationsCollection = await connect("notifications");
      await notificationsCollection.insertOne({
        userId: session.user.id,
        text: `You have successfully listed a new property: ${title}`,
        type: "success",
        read: false,
        createdAt: new Date(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return NextResponse.json(
      {
        message: "Property published successfully",
        propertyId: result.insertedId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Property API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}