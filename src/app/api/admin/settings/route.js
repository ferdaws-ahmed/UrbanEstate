import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const configCollection = await connect("system_config");
    let settings = await configCollection.findOne({ type: "general_settings" });

    if (!settings) {
      // Default settings if none exist
      settings = {
        type: "general_settings",
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true,
        propertyApprovalRequired: true,
        siteName: "Urban Estate",
        contactEmail: "support@urbanestate.com"
      };
      await configCollection.insertOne(settings);
    }

    return NextResponse.json(settings);
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
    const { _id, ...updateData } = body;

    const configCollection = await connect("system_config");
    await configCollection.updateOne(
      { type: "general_settings" },
      { $set: { ...updateData, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

