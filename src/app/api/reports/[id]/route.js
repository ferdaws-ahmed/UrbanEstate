import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

// Update report (Admin reply or User mark as read)
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { adminReply, status, replyStatus } = await request.json();
    const adminReportsColl = await connect("admin-reports");

    const updateData = { updatedAt: new Date() };

    if (session.user.role === "admin") {
      // Admin is replying or changing status
      if (adminReply !== undefined) {
        updateData.adminReply = adminReply;
        updateData.replyStatus = "unread"; // User/Seller hasn't read the reply yet
      }
      if (status !== undefined) {
        updateData.status = status;
      }
    } else {
      // User/Seller is marking reply as read
      if (replyStatus === "read") {
        updateData.replyStatus = "read";
      }
    }

    const result = await adminReportsColl.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reports PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update report" }, { status: 500 });
  }
}
