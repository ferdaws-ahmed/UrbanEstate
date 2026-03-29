import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || 5;

    if (!query || query.length < 3) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=${limit}&accept-language=en-US`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "UrbanEstate_RealEstate_App_v2_Contact_admin_at_urbanestate_com",
          "Referer": "https://urbanestate.com"
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Nominatim Search Error:", response.status, errorText);
      return NextResponse.json({ 
        error: "Failed to fetch from Nominatim", 
        details: errorText,
        status: response.status 
      }, { status: response.status });
    }

    const data = await response.json();
    
    // Filter out suggestions that are primarily Bengali or translate/clean display_name
    const cleanData = data.map(item => ({
      ...item,
      display_name: item.display_name.replace(/[\u0980-\u09FF]/g, "").trim()
    })).filter(item => item.display_name.length > 5);

    return NextResponse.json(cleanData);
  } catch (error) {
    console.error("Geocode Search Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
