# Task 005: Album ảnh và mừng cưới QR

- **Vertical slice:** UI + config (không chạm DB)
- **Depends on:** 004
- **Spec refs:** `product.md` (Album, Mừng cưới, Dữ liệu mock), `design-system.md` (Ảnh), `security.md` (không dùng số tài khoản thật), `component-design.md`
- **MCP to use:** context7 (shadcn Dialog, Motion), claude-in-chrome; tra tài liệu VietQR bằng WebFetch nếu Context7 không có
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; lightbox chạy; ảnh QR VietQR hiện, sao chép số tài khoản chạy, có phương án dự phòng khi ảnh QR lỗi

## Goal (một câu)
Khách xem album ảnh phóng to được và quét mã QR để chuyển tiền mừng cưới hoặc sao chép số tài khoản.

## Acceptance criteria (verifiable)
- [ ] Album là lưới ảnh (ảnh mock: các bản cắt từ ảnh gốc cùng ảnh giữ chỗ có nhãn), bấm mở lightbox bằng Dialog của shadcn; chuyển ảnh bằng nút mũi tên hoặc vuốt, `Esc` đóng; mọi ảnh có `alt` tiếng Việt, `width`, `height`, `loading="lazy"` (trừ ảnh trong màn hình đầu).
- [ ] Mỗi ảnh album tối đa 150KB (chỉ tiêu đề xuất, đo lại ở task 009).
- [ ] Danh sách tài khoản mừng cưới nằm trong `src/config/wedding.ts` (mặc định 2 tài khoản mock: bên chú rể và bên cô dâu), mỗi tài khoản gồm mã ngân hàng, số tài khoản, tên chủ tài khoản, nhãn hiển thị. Mọi giá trị có `// MOCK`, số tài khoản là số giả rõ ràng, **không có số thật** trong repo.
- [ ] Hàm thuần `buildVietQrUrl` ở `src/lib/vietqr.ts` dựng `https://img.vietqr.io/image/<ngân hàng>-<số tài khoản>-<template>.png?accountName=<...>&addInfo=<...>`, mã hóa đúng tên có dấu tiếng Việt; mã ngân hàng và tên template lấy từ tài liệu chính thức lúc implement (báo cáo tra cứu chưa đọc trọn vẹn tài liệu này).
- [ ] Section hiện ảnh QR cho từng tài khoản (bấm để phóng to), kèm tên ngân hàng, số tài khoản, tên chủ tài khoản.
- [ ] Nút sao chép số tài khoản: có toast báo thành công; nếu Clipboard API bị từ chối thì hiện thông báo và số tài khoản vẫn chọn được bằng tay.
- [ ] Ảnh QR tải lỗi hoặc chậm: hiện số tài khoản dạng chữ và một dòng giải thích, không để khung trống.
- [ ] Không cuộn ngang ở 320px; vùng bấm tối thiểu 44x44px.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh.
- Claude in Chrome: mở lightbox, chuyển ảnh, đóng bằng `Esc`; bấm sao chép và đọc lại clipboard bằng ô nhập tạm; chặn domain `img.vietqr.io` (giả lập offline) và xác nhận thấy số tài khoản dạng chữ.
- Mở URL ảnh QR thật trong tab mới và xác nhận ảnh trả về là mã QR hợp lệ (số tài khoản mock nên **không quét chuyển tiền thử**).
- Đợi chủ dự án cung cấp tài khoản thật rồi mới thay và quét bằng ứng dụng ngân hàng: đây là bước kiểm tra cuối, để lại cho task 009.

## Files to touch
- `src/config/wedding.ts`: thêm danh sách ảnh album và tài khoản mừng cưới.
- `src/lib/vietqr.ts`: dựng URL VietQR.
- `src/features/invitation/Gallery.tsx`, `src/features/invitation/GiftQr.tsx`: hai section.
- `src/components/ui/dialog.tsx`: do shadcn thêm nếu chưa có.
- `public/images/gallery/`: ảnh album đã cắt và nén.
- `src/routes/InvitationPage.tsx`: gắn hai section.

## Steps (lát cắt mỏng xuyên suốt)
1. Cắt và nén ảnh album từ ảnh gốc (dùng `sips`), chọn các khung khác nhau (toàn cảnh, hoa, cận cặp đôi), tránh khung chứa chữ "dạm ngõ".
2. Viết `buildVietQrUrl` sau khi đọc tài liệu VietQR chính thức; dựng hai section.
3. Chạy cổng kiểm chứng; đánh dấu task `in-review` (KHÔNG phải `done`).
4. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- VietQR: định dạng `https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=&addInfo=&accountName=` theo vietqr.io/en/danh-sach-api/link-tao-ma-nhanh/. Báo cáo tra cứu ghi rõ trang tài liệu trả 404 ở một đường dẫn và chỉ đọc qua kết quả tìm kiếm, nên xác minh lại danh sách template và mã ngân hàng trước khi chốt.
- Không đặt `amount` cố định: khách tự nhập số tiền mừng.
