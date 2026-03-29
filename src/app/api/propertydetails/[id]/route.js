import { NextResponse } from "next/server";
import { connect } from "@/src/lib/dbConnect";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    let oid;
    try {
      oid = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const property = await propertiesCollection.findOne({ _id: oid });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    // Increment visit count
    try {
      await propertiesCollection.updateOne(
        { _id: oid },
        { $inc: { visitCount: 1 } }
      );
    } catch (vErr) {
      console.error("Failed to update visit count:", vErr);
    }

    // Get favorite count
    const favoritesCollection = await connect("favorites");
    const favoriteCount = await favoritesCollection.countDocuments({ propertyId: id });
    
    // Check if favorited by current user
    const { getServerSession } = await import("next-auth");
    const { authOptions } = await import("@/src/app/api/auth/[...nextauth]/route");
    const session = await getServerSession(authOptions);
    let isFavorited = false;
    if (session?.user?.email) {
      const existing = await favoritesCollection.findOne({
        userEmail: session.user.email,
        propertyId: id
      });
      isFavorited = !!existing;
    }

    return NextResponse.json({
      ...property,
      favoriteCount,
      isFavorited
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
