import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCollection = await connect("users");
    const propertiesCollection = await connect("properties");

    const sellers = await usersCollection.find({ role: "seller" }).toArray();

    const enhancedSellers = await Promise.all(sellers.map(async (seller) => {
      const propertiesCount = await propertiesCollection.countDocuments({ 
        $or: [
          { sellerId: seller._id.toString() },
          { sellerEmail: seller.email }
        ]
      });

      // Calculate total revenue from sold properties if you have a sales collection, 
      // otherwise we can mock it or use a field from user data if it exists.
      // For now, let's just return what we have.
      return {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        phone: seller.phone || "N/A",
        avatar: seller.image || seller.avatar || `https://ui-avatars.com/api/?name=${seller.name}&background=random`,
        status: seller.status || "Active",
        propertiesCount,
        createdAt: seller.createdAt,
        role: seller.role
      };
    }));

    return NextResponse.json(enhancedSellers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const usersCollection = await connect("users");
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Seller status updated to ${status}` });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

