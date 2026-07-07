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

    const propertiesCollection = await connect("properties");
    const usersCollection = await connect("users");

    // Fetch all properties
    const properties = await propertiesCollection.find({}).sort({ createdAt: -1 }).toArray();

    // Enhance properties with seller data
    const enhancedProperties = await Promise.all(properties.map(async (property) => {
      let seller = null;
      
      // Try to find by sellerId first
      if (property.sellerId) {
        const { ObjectId } = require('mongodb');
        try {
          const sId = typeof property.sellerId === 'string' ? new ObjectId(property.sellerId) : property.sellerId;
          seller = await usersCollection.findOne({ _id: sId });
        } catch (e) {
          console.error("Invalid sellerId:", property.sellerId);
        }
      }

      // If not found by ID, try by sellerEmail
      if (!seller && (property.sellerEmail || property.userEmail)) {
        seller = await usersCollection.findOne({ 
          email: property.sellerEmail || property.userEmail 
        });
      }

      return {
        ...property,
        seller: seller ? {
          name: seller.name,
          email: seller.email,
          image: seller.image || seller.avatar || "https://i.pravatar.cc/150?u=" + seller.email
        } : {
          name: property.sellerName || "System Admin",
          email: property.sellerEmail || property.userEmail || "admin@urbanestate.com",
          image: "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"
        }
      };
    }));

    return NextResponse.json(enhancedProperties);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const { ObjectId } = require('mongodb');
    
    const result = await propertiesCollection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

