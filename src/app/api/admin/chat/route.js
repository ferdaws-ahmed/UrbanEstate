import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { ObjectId } from 'mongodb';

// Helper to safely query either String or ObjectId versions of an ID
function getQueryIds(idStr) {
  const ids = [idStr];
  if (idStr && idStr.length === 24) {
    try { ids.push(new ObjectId(idStr)); } catch (e) {}
  }
  return ids;
}

// GET all conversations for the admin
async function getAllConversations(adminIdStr) {
  const adminIds = getQueryIds(adminIdStr);
  const messagesCollection = await connect("messages");

  const conversations = await messagesCollection.aggregate([
    { $match: { $or: [{ senderId: { $in: adminIds } }, { receiverId: { $in: adminIds } }] } },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: {
          $cond: {
            if: { $in: ["$senderId", adminIds] },
            then: "$receiverId",
            else: "$senderId",
          },
        },
        lastMessage: { $first: "$text" },
        lastMessageTime: { $first: "$createdAt" },
        senderId: { $first: "$senderId" },
        receiverId: { $first: "$receiverId" },
        seen: { $first: "$seen" }
      },
    },
    {
      $lookup: {
        from: "users",
        let: { targetId: "$_id" },
        pipeline: [
          { $match: { 
              $expr: { 
                $or: [
                  { $eq: ["$uid", "$$targetId"] },
                  { $eq: ["$uid", { $toString: "$$targetId" }] },
                  { $eq: [{ $toString: "$_id" }, { $toString: "$$targetId" }] }
                ]
              } 
          } }
        ],
        as: "userDetails",
      },
    },
    { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
    {
        $project: {
            // Same id as stored in messages (partner uid / thread key). Do not use userDetails._id
            // or open-chat / polling breaks when uid ≠ Mongo _id.
            id: { $toString: "$_id" },
            name: { $ifNull: ["$userDetails.name", "Unknown"] },
            image: { $ifNull: ["$userDetails.image", null] },
            role: { $ifNull: ["$userDetails.role", "user"] },
            lastMessage: 1,
            lastMessageTime: 1,
            unreadCount: { 
                $cond: { 
                    if: { $and: [ { $in: ["$receiverId", adminIds] }, { $eq: ["$seen", false] } ] }, 
                    then: 1, 
                    else: 0 
                }
            }
        }
    },
    { $sort: { lastMessageTime: -1 } },
  ]).toArray();

  return conversations;
}

// GET messages between admin and a specific user
async function getMessagesWithUser(adminIdStr, userIdStr) {
    const adminIds = getQueryIds(adminIdStr);
    const userIds = getQueryIds(userIdStr);
    
    const messagesCollection = await connect("messages");
    const messages = await messagesCollection.find({
        $or: [
            { senderId: { $in: adminIds }, receiverId: { $in: userIds } },
            { senderId: { $in: userIds }, receiverId: { $in: adminIds } },
        ]
    }).sort({ createdAt: 1 }).toArray();

    // Mark messages as read
    await messagesCollection.updateMany(
        { senderId: { $in: userIds }, receiverId: { $in: adminIds }, seen: false },
        { $set: { seen: true } }
    );

    return messages;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminIdStr = session.user.id;
    const { searchParams } = new URL(request.url);
    const userIdStr = searchParams.get('userId');

    if (userIdStr) {
      const messages = await getMessagesWithUser(adminIdStr, userIdStr);
      return NextResponse.json(messages);
    } else {
      const conversations = await getAllConversations(adminIdStr);
      return NextResponse.json(conversations);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const adminIdStr = session.user.id;
        const { receiverId, text } = await request.json();

        if (!receiverId || !text) {
            return NextResponse.json({ error: "Missing receiverId or text" }, { status: 400 });
        }

        const messagesCollection = await connect("messages");
        const newMessage = {
            senderId: adminIdStr,
            receiverId: String(receiverId),
            text,
            seen: false,
            createdAt: new Date(),
        };

        const result = await messagesCollection.insertOne(newMessage);
        return NextResponse.json({
            ...newMessage,
            _id: result.insertedId.toString(),
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
