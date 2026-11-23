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

// Bản đồ nhúng (đường xá thường, không vệ tinh) cho iframe, không cần API key.
export function buildEmbedUrl(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=vi&output=embed`
}

// Mở Google Maps chỉ đường từ vị trí hiện tại của khách tới địa điểm.
export function buildDirectionsUrl(query: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
}
