import { NextResponse } from "next/server";

const locationCache = {};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");
    const full = searchParams.get("full") === "true";
    const fallback = searchParams.get("fallback") || "Location N/A";

    if (!lat || !lon || lat === "undefined" || lon === "undefined") {
      return NextResponse.json({ address: fallback });
    }

    const cacheKey = `${lat},${lon}_${full}`;
    if (locationCache[cacheKey]) {
      return NextResponse.json({ address: locationCache[cacheKey] });
    }

    // Nominatim strictly requires a unique User-Agent and has rate limits (1 req/sec)
    // We add a small timeout to avoid hitting it too fast from multiple users on the same server IP
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&accept-language=en-US`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "UrbanEstate_RealEstate_App/2.0 (contact: info@urbanestate.com)"
        },
        next: { revalidate: 86400 } // Cache results for 24h
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return NextResponse.json({ address: "Rate Limited" }, { status: 429 });
      }
      return NextResponse.json({ address: "Location Service Error" }, { status: response.status });
    }

    const data = await response.json();
    let display = "";

    if (data && data.address) {
      const a = data.address;
      if (full) {
        display = data.display_name;
      } else {
        // More robust priority list for District/City in English
        display = a.city || a.town || a.suburb || a.neighbourhood || a.municipality || a.state_district || a.county || a.state || "Unknown Area";
      }

      // Filter Bengali characters
      display = display.replace(/[ঀ-৿]/g, "").trim();
      
      // If display is empty after filtering or too short
      if (!display || display.length < 2) {
        display = fallback === "Location N/A" ? "Premium Location" : fallback;
      }
      
      locationCache[cacheKey] = display;
      return NextResponse.json({ address: display });
    }

    return NextResponse.json({ address: fallback });
  } catch (error) {
    console.error("Server Geocoding Error:", error);
    // Don't return 500 to client, return a valid object with fallback
    const { searchParams } = new URL(request.url);
    const fallback = searchParams.get("fallback") || "Location N/A";
    return NextResponse.json({ address: fallback });
  }
}
