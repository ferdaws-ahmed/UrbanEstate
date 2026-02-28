import { connect } from "@/src/lib/dbConnect";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { name, email, uid, role, provider } = await request.json();

    // Basic validation
    if (!name || !email || !uid || !role || !provider) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userCollection = await connect("users");

    // Check if user already exists
    const existingUser = await userCollection.findOne({ email });

    if (existingUser) {
      return Response.json({
        message: "User already exists",
        userId: existingUser._id,
      });
    }

    // Create new social user
    const newUser = {
      name,
      email,
      uid, // Firebase UID
      role,
      provider, // "google" or "github"
      password: null, // No password for social users
      createdAt: new Date(),
    };

    const result = await userCollection.insertOne(newUser);

    return Response.json({
      message: "Social user registered successfully",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Social Register Error:", error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
