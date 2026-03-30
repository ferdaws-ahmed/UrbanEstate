import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const userIdStr = session.user.id;
    const queryOptions = [{ receiverId: userIdStr }];
    
    // Safely support legacy ObjectIds if the user id happens to be 24 hex chars
    if (userIdStr && userIdStr.length === 24) {
      queryOptions.push({ receiverId: new ObjectId(userIdStr) });
    }

    const messagesCollection = await connect("messages");

    // Count messages where receiver is current user and seen is false
    const unreadCount = await messagesCollection.countDocuments({
      $or: queryOptions,
      seen: false
    });

    return NextResponse.json({ count: unreadCount });
  } catch (error) {
    console.error("Unread Chat Count API Error:", error);
    return NextResponse.json({ count: 0 });
  }
}
