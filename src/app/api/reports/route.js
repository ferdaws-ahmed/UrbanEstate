import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

// Get reports (User/Seller sees their own, Admin sees all)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminReportsColl = await connect("admin-reports");
    let query = {};

    if (session.user.role !== "admin") {
      query = { userId: session.user.id };
    }

    const reports = await adminReportsColl.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Reports GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

// Submit a new report (User/Seller)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { subject, message } = await request.json();
    if (!subject || !message) {
      return NextResponse.json({ error: "Missing subject or message" }, { status: 400 });
    }

    const adminReportsColl = await connect("admin-reports");
    const newReport = {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      userRole: session.user.role,
      subject,
      message,
      status: "unread", // Admin hasn't read it
      adminReply: null,
      replyStatus: "none", // none, unread (by user), read (by user)
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await adminReportsColl.insertOne(newReport);
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    console.error("Reports POST Error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
