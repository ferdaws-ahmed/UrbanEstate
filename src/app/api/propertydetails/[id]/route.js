import { NextResponse } from "next/server";
import { connect } from "@/src/lib/dbConnect";
import { ObjectId } from "mongodb";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    let oid;
    try {
      oid = new ObjectId(id);
    } catch {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const propertiesCollection = await connect("properties");
    const property = await propertiesCollection.findOne({ _id: oid });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
