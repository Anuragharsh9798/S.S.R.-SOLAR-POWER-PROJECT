export interface ReverseGeocodeResult {
  houseNumber: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pin: string;
  fullAddress: string;
  source: "google" | "nominatim";
}

/**
 * Reverse geocodes latitude/longitude coordinates into structured address fields.
 * Uses Google Maps Geocoding API if VITE_GOOGLE_MAPS_API_KEY is configured in env.
 * Gracefully falls back to OpenStreetMap Nominatim API if key is absent or request fails.
 */
export async function fetchReverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult | null> {
  const googleApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // 1. Try Google Maps Geocoding API if API key exists
  if (googleApiKey && googleApiKey.trim() !== "" && googleApiKey !== "YOUR_GOOGLE_MAPS_API_KEY") {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`;
      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        console.log("Google Maps Reverse Geocode API Response:", data);

        if (data.status === "OK" && data.results && data.results.length > 0) {
          let houseNumber = "";
          let sublocality1 = "";
          let sublocality2 = "";
          let neighborhood = "";
          let city = "";
          let district = "";
          let state = "";
          let pin = "";

          // Iterate through Google results to extract all granular address components
          for (const res of data.results) {
            const comps = res.address_components || [];
            for (const c of comps) {
              const types = c.types || [];
              if (!houseNumber && (types.includes("street_number") || types.includes("premise") || types.includes("subpremise"))) {
                houseNumber = c.long_name || c.short_name;
              }
              if (!sublocality2 && types.includes("sublocality_level_2")) {
                sublocality2 = c.long_name;
              }
              if (!sublocality1 && types.includes("sublocality_level_1")) {
                sublocality1 = c.long_name;
              }
              if (!neighborhood && types.includes("neighborhood")) {
                neighborhood = c.long_name;
              }
              if (!city && (types.includes("locality") || types.includes("administrative_area_level_3"))) {
                city = c.long_name;
              }
              if (!district && types.includes("administrative_area_level_2")) {
                district = c.long_name;
              }
              if (!state && types.includes("administrative_area_level_1")) {
                state = c.long_name;
              }
              if (!pin && types.includes("postal_code")) {
                pin = c.long_name;
              }
            }
          }

          const areaParts = [neighborhood, sublocality2, sublocality1].filter((v) => Boolean(v && String(v).trim()));
          const uniqueAreaParts = Array.from(new Set(areaParts));
          const area = uniqueAreaParts.join(", ");

          const addressSegments = [
            houseNumber,
            area,
            city,
            district && district !== city ? district : "",
            state,
            pin,
          ].filter((v) => Boolean(v && String(v).trim()));

          const fullAddress = addressSegments.length > 0 ? addressSegments.join(", ") : data.results[0].formatted_address || "";

          return {
            houseNumber,
            area,
            city,
            district,
            state,
            pin,
            fullAddress,
            source: "google",
          };
        }
      }
    } catch (err) {
      console.warn("Google Maps Geocoding error, falling back to Nominatim:", err);
    }
  }

  // 2. OpenStreetMap Nominatim Fallback
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
    );

    if (response.ok) {
      const data = await response.json();
      console.log("Nominatim Reverse Geocode API Response:", data);
      const addr = data.address || {};

      const houseNumber = [addr.house_number, addr.house_name, addr.building].find((v) => Boolean(v && String(v).trim())) || "";
      const rawAreaParts = [
        addr.neighbourhood,
        addr.suburb,
        addr.residential,
        addr.quarter,
        addr.village,
        addr.hamlet,
      ].filter((v) => Boolean(v && String(v).trim()));
      const uniqueAreaParts = Array.from(new Set(rawAreaParts));
      const area = uniqueAreaParts.join(", ");

      const city = addr.city || addr.town || addr.municipality || "";
      const district = addr.county || addr.state_district || addr.district || "";
      const state = addr.state || "";
      const pin = addr.postcode || "";

      const fullAddressSegments = [
        houseNumber,
        area,
        city,
        district && district !== city ? district : "",
        state,
        pin,
      ].filter((v) => Boolean(v && String(v).trim()));

      const fullAddress = fullAddressSegments.length > 0 ? fullAddressSegments.join(", ") : data.display_name || "";

      return {
        houseNumber,
        area,
        city,
        district,
        state,
        pin,
        fullAddress,
        source: "nominatim",
      };
    }
  } catch (err) {
    console.error("Nominatim Reverse Geocode API error:", err);
  }

  return null;
}
