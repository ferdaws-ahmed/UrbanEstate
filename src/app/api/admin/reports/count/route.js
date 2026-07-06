import { connect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminReportsColl = await connect("admin-reports");
    const propertiesColl = await connect("properties");

    const unreadAdminCount = await adminReportsColl.countDocuments({ status: 'unread' });

    const propertiesWithUnread = await propertiesColl.find({
      "propertyReports.status": 'unread'
    }).toArray();

    let unreadPropertyCount = 0;
    propertiesWithUnread.forEach(prop => {
      unreadPropertyCount += prop.propertyReports.filter(r => r.status === 'unread').length;
    });

    return NextResponse.json({ count: unreadAdminCount + unreadPropertyCount });
  } catch (error) {
    console.error("Count Reports API Error:", error);
    return NextResponse.json({ count: 0 });
  }
}

