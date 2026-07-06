import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ count: 0 });
    }

    const adminReportsColl = await connect("admin-reports");
    const count = await adminReportsColl.countDocuments({
      userId: session.user.id,
      replyStatus: "unread",
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Unread Reports Count Error:", error);
    return NextResponse.json({ count: 0 });
  }
}

