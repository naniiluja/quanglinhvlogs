// Link tìm kiếm Google Maps, mở app Maps trên điện thoại nếu có
// (developers.google.com/maps/documentation/urls/get-started).
export function buildMapsUrl(name: string, address: string): string {
  const query = encodeURIComponent(`${name}, ${address}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}
