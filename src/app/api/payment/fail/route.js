import { connect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tranId = searchParams.get("tranId");

    const purchasesCollection = await connect("purchases");
    await purchasesCollection.updateOne(
      { tran_id: tranId },
      { $set: { status: "failed", updatedAt: new Date() } }
    );

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/dashboard/user/leads?status=failed`, 303);
  } catch (error) {
    console.error("Payment Fail Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
