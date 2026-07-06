import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notificationsCollection = await connect("notifications");
    const notifications = await notificationsCollection
      .find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray();

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, readAll } = await request.json();
    const notificationsCollection = await connect("notifications");

    if (readAll) {
      await notificationsCollection.updateMany(
        { userId: session.user.id, read: false },
        { $set: { read: true } }
      );
    } else if (id) {
      await notificationsCollection.updateOne(
        { _id: new ObjectId(id), userId: session.user.id },
        { $set: { read: true } }
      );
    }

    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { userId, text, type } = await request.json();
    if (!userId || !text) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const notificationsCollection = await connect("notifications");
    const result = await notificationsCollection.insertOne({
      userId,
      text,
      type: type || "info",
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Notification created", id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

