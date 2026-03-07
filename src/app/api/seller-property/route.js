import { connect } from "@/src/lib/dbConnect";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();

    // Make it an array if it’s a single object
    const properties = Array.isArray(body) ? body : [body];

    // Validation
    const requiredFields = [
      "basicInformation.title",
      "basicInformation.price",
      "basicInformation.category",
      "basicInformation.listingStatus",
      "basicInformation.propertyType",
      "basicInformation.description",
      "propertyDetails.bedrooms",
      "propertyDetails.bathrooms",
      "propertyDetails.totalArea",
      "propertyDetails.floorLevel",
      "propertyDetails.furnishing",
      "propertyDetails.yearBuilt",
      // "specifications.bedrooms",
      // "specifications.bathrooms",
      // "specifications.totalArea",

      // "location.exactAddress",
      // "location.coordinates",

      // "owner.name",
      // "owner.phone",
    ];

    const sellerPropertyCollection = await connect("sellerProperty");

    const propertiesToInsert = [];

    // Loop through each property
    for (const property of properties) {
      // Validate each required field
      for (const field of requiredFields) {
        const keys = field.split(".");
        let value = property;
        for (const key of keys) {
          value = value?.[key];
        }
        if (value === undefined || value === null) {
          return Response.json(
            { error: `Missing required field: ${field}` },
            { status: 400 },
          );
        }
      }

      // Add timestamps
      propertiesToInsert.push({
        basicInformation: property.basicInformation,
        propertyDetails: property.propertyDetails,
        location: property.location,
        features: property.features,
        imageUrl: property.imageUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Insert all properties at once
    const result =
      await sellerPropertyCollection.insertMany(propertiesToInsert);

    return Response.json({
      message: "Seller properties added successfully",
      insertedCount: result.insertedCount,
      propertyIds: Object.values(result.insertedIds),
    });
  } catch (err) {
    console.error("Insert Seller Property Error:", err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sellerPropertyCollection = await connect("sellerProperty");

    // Fetch all properties, sorted by newest first
    const properties = await sellerPropertyCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json(properties, { status: 200 });
  } catch (err) {
    console.error("Fetch Error:", err);
    return Response.json(
      { error: "Failed to fetch properties" },
      { status: 500 },
    );
  }
}
