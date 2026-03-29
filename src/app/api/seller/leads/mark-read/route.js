import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "seller") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId } = await request.json();
    if (!leadId) {
      return NextResponse.json({ error: "Missing leadId" }, { status: 400 });
    }

    const leadsCollection = await connect("seller_leads");
    const result = await leadsCollection.updateOne(
      { _id: new ObjectId(leadId), sellerId: session.user.id },
      { $set: { status: "read" } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Lead not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Lead marked as read", success: true });
  } catch (error) {
    console.error("Mark lead as read error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
