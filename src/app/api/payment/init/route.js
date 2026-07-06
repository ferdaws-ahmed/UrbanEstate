import { connect } from "@/src/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { propertyId, amount } = await request.json();
    if (!propertyId || !amount) {
      return NextResponse.json({ error: "Missing propertyId or amount" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const property = await propertiesCollection.findOne({ _id: new ObjectId(propertyId) });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const tran_id = `TRAN-${Date.now()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const paymentData = {
      store_id: process.env.SSLCZ_STORE_ID || "urban69cc0988be4b7",
      store_passwd: process.env.SSLCZ_STORE_PASSWD || "urban69cc0988be4b7@ssl",
      total_amount: amount,
      currency: "BDT",
      tran_id: tran_id,
      success_url: `${baseUrl}/api/payment/success?tranId=${tran_id}`,
      fail_url: `${baseUrl}/api/payment/fail?tranId=${tran_id}`,
      cancel_url: `${baseUrl}/api/payment/cancel?tranId=${tran_id}`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      shipping_method: "NO",
      product_name: property.title,
      product_category: "Real Estate",
      product_profile: "non-physical-goods",
      cus_name: session.user.name || "Customer",
      cus_email: session.user.email || "customer@example.com",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: "01700000000",
    };

    // Store initial payment info
    const purchasesCollection = await connect("purchases");
    await purchasesCollection.insertOne({
      tran_id,
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      propertyId: new ObjectId(propertyId),
      propertyTitle: property.title,
      amount: parseFloat(amount),
      status: "pending",
      createdAt: new Date(),
    });

    const sslInitUrl = process.env.SSLCZ_INIT_URL || "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
    
    // Using URLSearchParams for form-data
    const params = new URLSearchParams();
    Object.keys(paymentData).forEach(key => params.append(key, paymentData[key]));

    const response = await fetch(sslInitUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });

    const result = await response.json();

    if (result.status === "SUCCESS") {
      return NextResponse.json({ url: result.GatewayPageURL });
    } else {
      return NextResponse.json({ error: result.failedreason || "Payment initialization failed" }, { status: 500 });
    }
  } catch (error) {
    console.error("Payment Init Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

