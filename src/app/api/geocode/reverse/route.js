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
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          'User-Agent': 'UrbanEState-RealEstateApp/1.0',
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    if (!response.ok) {
      console.error(`Nominatim API returned status: ${response.status}`);
      // Return a default address format if Nominatim fails
      return Response.json({
        address: `${lat}, ${lng}`,
        display_name: `${lat}, ${lng}`,
        lat,
        lon: lng
      });
    }

    const data = await response.json();

    return Response.json({
      address: data.display_name || `${lat}, ${lng}`,
      display_name: data.display_name,
      ...data
    });

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
