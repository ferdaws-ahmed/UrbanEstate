import { connect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request) {
  const { name, email, password, role } = await request.json();

  if (!name || !email || !password || !role) {
    return Response.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  const userCollection = await connect("users"); // ✅ move inside function

  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return Response.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
    role,
    createdAt: new Date(),
  };

  const result = await userCollection.insertOne(newUser);

  return Response.json({
    message: "User registered",
    userId: result.insertedId,
  });
}