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

    // ৩. ভ্যালিডেশন (status এবং propertyType এখানে যোগ করা হয়েছে)
    const { 
      title, price, category, status, propertyType, 
      description, bedrooms, bathrooms, area, 
      location, address, amenities, images 
    } = propertyData;

    if (!title || !price || !category || !description || !location || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
      price: Number(price),
      category, // আবাসিক/বাণিজ্যিক ইত্যাদি
      status: status || "For Sale", // ইউজারের সিলেক্ট করা Status (যেমন: For Rent/For Sale)
      propertyType: propertyType || "apartment", // ইউজারের সিলেক্ট করা Type (যেমন: Villa/Studio)
      description,
      bedrooms: bedrooms ? Number(bedrooms) : null,
      bathrooms: bathrooms ? Number(bathrooms) : null,
      area: area ? Number(area) : null,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
      },
      address,
      amenities: amenities || [],
      images: images || [],
      sellerId: session.user.id,
      sellerEmail: session.user.email,
      listingStatus: "published", // এটি হলো প্রপার্টি লাইভ কিনা তার স্ট্যাটাস
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

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