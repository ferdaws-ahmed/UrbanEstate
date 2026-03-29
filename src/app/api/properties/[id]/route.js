import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const propertiesCollection = await connect("properties");
    const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const propertiesCollection = await connect("properties");
    
    // Find property first to get title and seller check
    const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.sellerId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await propertiesCollection.deleteOne({ _id: new ObjectId(id) });

    // Notification
    try {
      const notificationsCollection = await connect("notifications");
      await notificationsCollection.insertOne({
        userId: session.user.id,
        text: `You have deleted the property: ${property.title}`,
        type: "warning",
        read: false,
        createdAt: new Date(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const updateData = await request.json();
    const propertiesCollection = await connect("properties");

    const property = await propertiesCollection.findOne({ _id: new ObjectId(id) });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (property.sellerId !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Geocode if location or address changed
    let district = property.district;
    let fullAddress = property.fullAddress;

    if (updateData.location || updateData.address) {
      const lat = updateData.location?.latitude || property.location.latitude;
      const lon = updateData.location?.longitude || property.location.longitude;
      const addr = updateData.address || property.address;

      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en-US`,
          {
            headers: {
              "Accept-Language": "en-US,en;q=0.9",
              "User-Agent": "UrbanEstate_RealEstate_App/2.0 (contact: info@urbanestate.com)"
            }
          }
        );
        
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.address) {
            const a = geoData.address;
            district = a.city || a.town || a.suburb || a.neighbourhood || a.municipality || a.state_district || a.county || a.state || "Unknown Area";
            fullAddress = geoData.display_name;
            
            // Filter Bengali characters
            district = district.replace(/[ঀ-৿]/g, "").trim();
            fullAddress = fullAddress.replace(/[ঀ-৿]/g, "").trim();
          }
        }
      } catch (geoError) {
        console.error("Geocoding during property update failed:", geoError);
      }
    }

    await propertiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...updateData, 
          district,
          fullAddress,
          updatedAt: new Date() 
        } 
      }
    );

    // Notification
    try {
      const notificationsCollection = await connect("notifications");
      await notificationsCollection.insertOne({
        userId: session.user.id,
        text: `Property updated: ${property.title}`,
        type: "info",
        read: false,
        createdAt: new Date(),
      });
    } catch (notifError) {
      console.error("Failed to create notification:", notifError);
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
