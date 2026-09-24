// Ảnh mã QR chuyển khoản từ dịch vụ công khai của VietQR
// (vietqr.io, mẫu `compact` có logo Napas và ngân hàng). Không đặt số tiền: khách tự nhập.
export function buildVietQrUrl(
  bankBin: string,
  accountNumber: string,
  accountName: string,
): string {
  const params = new URLSearchParams({ accountName, addInfo: 'Mung cuoi' })
  return `https://img.vietqr.io/image/${bankBin}-${accountNumber}-compact.png?${params.toString()}`
}
