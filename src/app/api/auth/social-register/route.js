import { connect } from "@/src/lib/dbConnect";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, uid, role, provider } = await request.json();

    // ১. ভ্যালিডেশন - সব ফিল্ড চেক করা
    if (!name || !email || !uid || !role || !provider) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // २. ডাটাবেস কানেকশন
    let userCollection;
    try {
      userCollection = await connect("users");
    } catch (dbError) {
      console.error("Database Connection Error:", dbError.message);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // ३. চেক করা - ইউজার ইতিমধ্যে আছে কিনা (uid দিয়ে খুঁজা)
    let user = await userCollection.findOne({ uid });

    if (user) {
      // ইউজার ইতিমধ্যে আছে - শুধু রিটার্ন করা
      return NextResponse.json(
        {
          message: "User already exists",
          userId: user._id,
          email: user.email,
          role: user.role,
        },
        { status: 200 }
      );
    }

    // ४. নতুন ইউজার ক্রিয়েট করা (সোশ্যাল রেজিস্ট্রেশন)
    const result = await userCollection.insertOne({
      name,
      email,
      uid,
      role,
      provider,
      password: null, // সোশ্যাল লগইনে পাসওয়ার্ড থাকে না
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "User created successfully via social auth",
        userId: result.insertedId,
        email,
        role,
        provider,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Social Registration API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}

