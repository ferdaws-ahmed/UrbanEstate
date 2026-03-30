import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Helper to safely query either String or ObjectId versions of an ID
function getQueryIds(idStr) {
  const ids = [idStr];
  if (idStr && idStr.length === 24) {
    try { ids.push(new ObjectId(idStr)); } catch (e) {}
  }
  return ids;
}

// GET: Fetch conversations or messages
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get("receiverId");
    const userIdStr = session.user.id;
    const userIds = getQueryIds(userIdStr);

    const messagesCollection = await connect("messages");
    const usersCollection = await connect("users");

    if (receiverId) {
      const targetIds = getQueryIds(receiverId);
      // Mark messages as seen when opening a chat
      await messagesCollection.updateMany(
        { senderId: { $in: targetIds }, receiverId: { $in: userIds }, seen: false },
        { $set: { seen: true } }
      );

      // Fetch message history between two users
      const messages = await messagesCollection.find({
        $or: [
          { senderId: { $in: userIds }, receiverId: { $in: targetIds } },
          { senderId: { $in: targetIds }, receiverId: { $in: userIds } }
        ]
      }).sort({ createdAt: 1 }).toArray();

      return NextResponse.json(messages);
    } else {
      // Fetch all conversations for the user using an aggregation pipeline
      const contacts = await messagesCollection.aggregate([
        // 1. Find all messages where the user is either a sender or a receiver
        { $match: { $or: [{ senderId: { $in: userIds } }, { receiverId: { $in: userIds } }] } },
        // 2. Sort by creation date to easily find the last message later
        { $sort: { createdAt: -1 } },
        // 3. Group by the "other" person in the chat
        {
          $group: {
            _id: {
              $cond: [
                { $in: ["$senderId", userIds] },
                "$receiverId",
                "$senderId",
              ],
            },
            // 4. Get the last message document for each conversation
            lastMessage: { $first: "$$ROOT" },
          },
        },
        // 5. Sort conversations by the last message time
        { $sort: { "lastMessage.createdAt": -1 } },
        // 6. Lookup contact details from the 'users' collection
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
            as: "contactInfo",
          },
        },
        // 7. Deconstruct the contactInfo array
        {
          $unwind: {
            path: "$contactInfo",
            preserveNullAndEmptyArrays: true // Keep conversations even if user is deleted
          }
        },
        // 8. Project the final shape
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: { $ifNull: ["$contactInfo.name", "Unknown User"] },
            image: { $ifNull: ["$contactInfo.image", null] },
            lastMessage: "$lastMessage.text",
            lastMessageTime: "$lastMessage.createdAt",
            propertyTitle: { $ifNull: ["$lastMessage.propertyTitle", null] },
            propertyId: { $ifNull: ["$lastMessage.propertyId", null] },
            senderId: "$lastMessage.senderId",
            seen: "$lastMessage.seen",
          },
        },
      ]).toArray();

      // Now, calculate unread counts separately
      const unreadCounts = await messagesCollection.aggregate([
        { $match: { receiverId: { $in: userIds }, seen: false } },
        { $group: { _id: "$senderId", count: { $sum: 1 } } },
      ]).toArray();

      const unreadMap = unreadCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});

      const conversationsWithUnread = contacts.map(c => ({
        ...c,
        unreadCount: unreadMap[c.id] || 0,
      }));

      return NextResponse.json(conversationsWithUnread);
    }
  } catch (error) {
    console.error("Messages API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Send a new message
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { receiverId, text, propertyId, propertyTitle } = await request.json();
    const senderId = session.user.id;

    if (!receiverId || !text) {
      return NextResponse.json({ error: "Receiver ID and text required" }, { status: 400 });
    }

    const messagesCollection = await connect("messages");
    const newMessage = {
      senderId: String(senderId),
      receiverId: String(receiverId),
      text,
      propertyId: propertyId ? new ObjectId(propertyId) : null,
      propertyTitle: propertyTitle || null,
      seen: false,
      createdAt: new Date()
    };

    const result = await messagesCollection.insertOne(newMessage);
    return NextResponse.json({
      ...newMessage,
      _id: result.insertedId.toString(),
      propertyId: newMessage.propertyId ? newMessage.propertyId.toString() : null
    }, { status: 201 });
  } catch (error) {
    console.error("Send Message API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Remove a specific message or an entire conversation
export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");
    const partnerId = searchParams.get("partnerId");
    const userId = session.user.id;

    const messagesCollection = await connect("messages");

    if (messageId) {
      // Delete a single message
      // Note: Only the sender can delete their own message for everyone, 
      // or we can just allow deletion from both sides if requested.
      // For now, let's allow deleting a specific message by its ID.
      const result = await messagesCollection.deleteOne({
        _id: new ObjectId(messageId)
      });
      return NextResponse.json({ success: result.deletedCount > 0 });
    } else if (partnerId) {
      // Delete entire conversation between user and partner
      const result = await messagesCollection.deleteMany({
        $or: [
          { senderId: String(userId), receiverId: String(partnerId) },
          { senderId: String(partnerId), receiverId: String(userId) }
        ]
      });
      return NextResponse.json({ success: true, deletedCount: result.deletedCount });
    } else {
      return NextResponse.json({ error: "Missing messageId or partnerId" }, { status: 400 });
    }
  } catch (error) {
    console.error("Delete Message API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
