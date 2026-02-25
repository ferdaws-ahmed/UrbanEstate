import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
export async function PUT(req) {
  // getServerSession can automatically read your NextAuth configuration
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, avatar } = await req.json();

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: error.message }, { status: 500 });
  }
}