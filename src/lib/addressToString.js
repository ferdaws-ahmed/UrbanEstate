/**
 * MongoDB / geocoder এ address কখনো string, কখনো object (Nominatim-style) হতে পারে।
 * UI তে সরাসরি object রেন্ডার করলে React crash হয়।
 */
export function addressToString(addr, location) {
  if (typeof addr === "string" && addr.trim()) return addr.trim();
  if (addr && typeof addr === "object") {
    const parts = [
      addr.road,
      addr.house_number,
      addr.village,
      addr.town,
      addr.city,
      addr.county,
      addr.state_district,
      addr.state,
      addr["ISO3166-2-lvl4"],
      addr["ISO3166-2-lvl5"],
      addr.country,
    ].filter((x) => x && typeof x === "string");
    if (parts.length) return [...new Set(parts)].join(", ");
    const vals = Object.values(addr).filter(
      (v) => typeof v === "string" && v.length > 0 && v.length < 200
    );
    if (vals.length) return vals.join(", ");
  }
  if (location && typeof location === "object") {
    if (typeof location.address === "string") return location.address;
    if (location.address && typeof location.address === "object") {
      return addressToString(location.address, null);
    }
  }
  return "";
}

