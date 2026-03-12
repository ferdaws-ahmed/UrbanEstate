import { connect } from "@/src/lib/dbConnect";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // ১. ভ্যালিডেশন চেক
    if (!email || !password) {
      return Response.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ২. ডেটাবেস কানেকশন ও ইউজার সার্চ
    let user;
    try {
      const userCollection = await connect("users");
      user = await userCollection.findOne({ email });
    } catch (dbError) {
      console.error("Database Connection Error:", dbError.message);
      return Response.json(
        { error: "Database connection failed. Please check your network or DNS." },
        { status: 500 }
      );
    }

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // ৩. পাসওয়ার্ড ম্যাচিং লজিক
    const isDemoAccount = ["user@demo.com", "seller@demo.com", "admin@demo.com"].includes(email);
    let isMatch = false;

    // Bcrypt চেক (যদি পাসওয়ার্ড হ্যাশ করা থাকে)
    try {
      if (user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$"))) {
        isMatch = await bcrypt.compare(password, user.password);
      }
    } catch (bcryptError) {
      console.warn("Bcrypt comparison failed, checking plain text if applicable.");
    }

    // ডেমো অ্যাকাউন্টের জন্য প্লেইন টেক্সট চেক (যদি হ্যাশ না মিলে)
    const isPlainMatch = isDemoAccount && password === user.password;

    if (!isMatch && !isPlainMatch) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ৪. সফল রেসপন্স (রোল এবং আইডি সহ)
    return Response.json({
      message: "Login successful",
      userId: user._id,
      email: user.email,
      role: user.role, // রোলটি ডাটাবেস থেকেই আসছে
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return Response.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500 }
    );
  }
}