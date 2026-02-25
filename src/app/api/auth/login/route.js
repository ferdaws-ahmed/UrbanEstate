// app/api/auth/login/route.js
import { connect } from "@/src/lib/dbConnect";
const bcrypt = require("bcryptjs");

const userCollection = connect("users");

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json(
      { error: "Email and password are required" },
      { status: 400 },
    );
  }

  const user = await userCollection.findOne({ email });
  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  return Response.json({
    message: "Login successful",
    userId: user._id,
    email: user.email,
    role: user.role,
  });
}
