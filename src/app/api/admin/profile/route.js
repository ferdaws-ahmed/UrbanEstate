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
    const admin = await usersCollection.findOne({ email: session.user.email });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
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

    const body = await request.json();
    const { name, phone, image, address, bio } = body;

    const usersCollection = await connect("users");
    const result = await usersCollection.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          name, 
          phone, 
          image, 
          address, 
          bio,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
