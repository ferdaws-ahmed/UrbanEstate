import { connect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, password, role, uid } = await request.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

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

    const existingUser = await userCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role,
      uid: uid || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        userId: result.insertedId,
        email,
        role,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Registration API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}
