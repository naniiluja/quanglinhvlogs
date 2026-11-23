// Link tìm kiếm Google Maps, mở app Maps trên điện thoại nếu có
// (developers.google.com/maps/documentation/urls/get-started).
export function buildMapsUrl(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

// Địa điểm do admin nhập: dán sẵn link https (ví dụ link chia sẻ Google Maps) thì dùng nguyên,
// còn lại coi là địa chỉ để tìm. Chỉ nhận https để không chèn được `javascript:`.
export function isHttpsUrl(location: string): boolean {
  return /^https:\/\//i.test(location.trim())
}

export function mapsHref(location: string): string {
  return isHttpsUrl(location) ? location.trim() : buildMapsUrl(location.trim())
}
