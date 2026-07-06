import { connect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminReportsColl = await connect("admin-reports");
    const propertiesColl = await connect("properties");

    // Fetch Admin Reports
    const adminReports = await adminReportsColl.find({}).sort({ createdAt: -1 }).toArray();

    // Fetch Property Reports
    const propertiesWithReports = await propertiesColl.find({
      "propertyReports": { $exists: true, $not: { $size: 0 } }
    }).toArray();

    const propertyReports = propertiesWithReports.flatMap(prop => 
      prop.propertyReports.map((report, idx) => ({
        ...report,
        id: report.id || `${prop._id}-${idx}`,
        propertyId: prop._id,
        propertyTitle: prop.title,
        type: 'property'
      }))
    );

    // Combine and sort by date
    const allReports = [
      ...adminReports.map(r => ({ ...r, id: String(r._id), type: 'admin' })),
      ...propertyReports
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json(allReports);
  } catch (error) {
    console.error("Reports API Error:", error);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

// Mark all as read
export async function PATCH() {
  try {
    const adminReportsColl = await connect("admin-reports");
    const propertiesColl = await connect("properties");

    // Mark admin reports as read
    await adminReportsColl.updateMany(
      { status: "unread" },
      { $set: { status: "read" } }
    );

    // Mark property reports as read
    // This is tricky because it's an array. Using $[element]
    await propertiesColl.updateMany(
      { "propertyReports.status": "unread" },
      { $set: { "propertyReports.$[elem].status": "read" } },
      { arrayFilters: [{ "elem.status": "unread" }] }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mark Read API Error:", error);
    return NextResponse.json({ error: "Failed to mark reports as read" }, { status: 500 });
  }
}

