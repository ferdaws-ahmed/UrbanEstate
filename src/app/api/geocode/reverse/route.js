/**
 * Reverse Geocoding API Route
 * Purpose: Convert latitude/longitude to address using Nominatim
 * Acts as a backend proxy to avoid CORS issues with direct API calls from frontend
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    // Validate parameters
    if (!lat || !lng) {
      return Response.json(
        { error: 'Missing latitude or longitude' },
        { status: 400 }
      );
    }

    // Call Nominatim API from server-side (no CORS issues)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en-US`,
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
      return Response.json({ error: `Failed to fetch from Nominatim: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (data && data.address) {
      const a = data.address;
      const district = a.state_district || a.city || a.town || a.village || a.county || a.state || "Unknown Area";
      const fullAddr = data.display_name;
      
      // Filter Bengali characters (Bengali Unicode range: 0980-09FF)
      const cleanDistrict = district.replace(/[\u0980-\u09FF]/g, "").trim().replace(/ District$/, "");
      const cleanFullAddr = fullAddr.replace(/[\u0980-\u09FF]/g, "").trim();

      return Response.json({
        district: cleanDistrict || "Unknown District",
        fullAddress: cleanFullAddr || fullAddr,
        display_name: cleanFullAddr || fullAddr,
        address: cleanFullAddr || fullAddr,
        raw: data
      });
    }

    return Response.json({ error: "No address found" }, { status: 404 });

  } catch (error) {
    console.error('Reverse geocoding error:', error);
    
    // Return coordinates as fallback address
    const lat = new URL(request.url).searchParams.get('lat');
    const lng = new URL(request.url).searchParams.get('lng');
    
    return Response.json({
      address: `${lat}, ${lng}`,
      display_name: `${lat}, ${lng}`,
      lat,
      lon: lng,
      warning: 'Using coordinates as fallback'
    });
  }
}
