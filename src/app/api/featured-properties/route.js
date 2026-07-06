import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const featuredCollection = await connect("featuredProperties");
    const propertiesCollection = await connect("properties");
    const usersCollection = await connect("users");
    const { ObjectId } = require('mongodb');

    const featuredEntries = await featuredCollection.find({}).sort({ createdAt: -1 }).toArray();
    
    const enhancedProperties = [];
    
    for (const entry of featuredEntries) {
      try {
        // Try to find property with both ObjectId and string _id
        let property = null;
        
        // First try as ObjectId
        try {
          const pId = typeof entry.propertyId === 'string' ? new ObjectId(entry.propertyId) : entry.propertyId;
          property = await propertiesCollection.findOne({ _id: pId });
        } catch (e) {
          // If that fails, try as string
          property = await propertiesCollection.findOne({ _id: entry.propertyId });
        }
        
        if (property) {
          // Get seller data
          let seller = null;
          if (property.sellerId) {
            try {
              const sId = typeof property.sellerId === 'string' ? new ObjectId(property.sellerId) : property.sellerId;
              seller = await usersCollection.findOne({ _id: sId });
            } catch (e) {
              console.error("Invalid sellerId:", property.sellerId);
            }
          }

          if (!seller && (property.sellerEmail || property.userEmail)) {
            seller = await usersCollection.findOne({ 
              email: property.sellerEmail || property.userEmail 
            });
          }

          enhancedProperties.push({
            ...property,
            featuredId: entry._id,
            seller: seller ? {
              name: seller.name,
              email: seller.email,
              image: seller.image || seller.avatar || "https://i.pravatar.cc/150?u=" + seller.email
            } : {
              name: property.sellerName || "System Admin",
              email: property.sellerEmail || property.userEmail || "admin@urbanestate.com",
              image: "https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff"
            }
          });
        }
      } catch (err) {
        console.error("Error processing property:", err);
      }
    }

    return NextResponse.json(enhancedProperties);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');
    const featuredCollection = await connect("featuredProperties");
    
    // Try to find with both string and ObjectId
    let existing = await featuredCollection.findOne({ propertyId });
    if (!existing) {
      try {
        existing = await featuredCollection.findOne({ propertyId: new ObjectId(propertyId) });
      } catch (e) {
        // invalid ObjectId, just continue
      }
    }
    
    if (existing) {
      return NextResponse.json({ isFeatured: true });
    }

    const result = await featuredCollection.insertOne({
      propertyId,
      createdAt: new Date()
    });

    return NextResponse.json({ isFeatured: true, insertedId: result.insertedId });
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

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const { ObjectId } = require('mongodb');
    const featuredCollection = await connect("featuredProperties");
    
    // Try to delete both string and ObjectId versions
    let deleteResult = await featuredCollection.deleteOne({ propertyId });
    if (deleteResult.deletedCount === 0) {
      try {
        deleteResult = await featuredCollection.deleteOne({ propertyId: new ObjectId(propertyId) });
      } catch (e) {
        // invalid ObjectId, just continue
      }
    }

    return NextResponse.json({ isFeatured: false });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
