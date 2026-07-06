import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

// Save a draft
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const draftData = await request.json();
    const draftsCollection = await connect("draftProperties");

    const result = await draftsCollection.insertOne({
      ...draftData,
      sellerId: session.user.id,
      sellerEmail: session.user.email,
      isDraft: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      message: "Draft saved successfully",
      draftId: result.insertedId,
    }, { status: 201 });

  } catch (error) {
    console.error("Draft API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Get all drafts for current seller
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const draftsCollection = await connect("draftProperties");
    const drafts = await draftsCollection
      .find({ sellerId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json(drafts);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a draft
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const draftsCollection = await connect("draftProperties");
    const result = await draftsCollection.deleteOne({
      _id: new ObjectId(id),
      sellerId: session.user.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Draft not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Draft deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

