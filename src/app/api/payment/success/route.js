import { connect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tranId = searchParams.get("tranId");

    const purchasesCollection = await connect("purchases");
    const payment = await purchasesCollection.findOne({ tran_id: tranId });

    if (!payment) {
      return NextResponse.json({ error: "Payment record not found" }, { status: 404 });
    }

    // Update payment status
    await purchasesCollection.updateOne(
      { tran_id: tranId },
      { 
        $set: { 
          status: "success", 
          paidAt: new Date(),
          updatedAt: new Date()
        } 
      }
    );

    // Update property status if needed (e.g., mark as sold)
    const propertiesCollection = await connect("properties");
    await propertiesCollection.updateOne(
      { _id: payment.propertyId },
      { $set: { status: "sold", buyerId: payment.userId } }
    );

    // Send notification to buyer and seller
    const notificationsCollection = await connect("notifications");
    await notificationsCollection.insertOne({
      userId: payment.userId,
      text: `Payment successful for "${payment.propertyTitle}". Transaction ID: ${tranId}`,
      type: "payment_success",
      read: false,
      createdAt: new Date(),
    });

    const property = await propertiesCollection.findOne({ _id: payment.propertyId });
    if (property && property.sellerId) {
      await notificationsCollection.insertOne({
        userId: property.sellerId,
        text: `Property "${payment.propertyTitle}" has been sold to ${payment.userName}.`,
        type: "property_sold",
        read: false,
        createdAt: new Date(),
      });
    }

    // Redirect to dashboard success page
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/dashboard/user/leads?status=success`, 303);
  } catch (error) {
    console.error("Payment Success Callback Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

