import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    // ১. সেশন চেক করা (ইউজার লগইন করা আছে কিনা)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login first" },
        { status: 401 }
      );
    }

    // २. রিকোয়েস্ট ডাটা পড়া
    const propertyData = await request.json();

    // ३. ভ্যালিডেশন
    const { title, price, category, description, bedrooms, bathrooms, area, location, address, amenities, images } = propertyData;

    if (!title || !price || !category || !description || !location || !address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ४. ডাটাবেস কানেকশন
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

    // ५. নতুন প্রপার্টি তৈরি করা
    const result = await propertiesCollection.insertOne({
      title,
      price: Number(price),
      category,
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
      status: "published",
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "Property published successfully",
        propertyId: result.insertedId,
        status: "published",
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
