# Task 007: Sổ lưu bút

- **Vertical slice:** DB (`guestbook_entries`, `list_guestbook`, `add_guestbook_entry`, policy admin) + service + UI (sổ lưu bút và tab quản trị)
- **Depends on:** 006
- **Spec refs:** `product.md` (Sổ lưu bút), `security.md`, `data-layer.md`, `error-handling.md`, `component-design.md`
- **MCP to use:** supabase, context7 (react-query, Motion), claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; giới hạn 3 lời chúc mỗi khách và 500 ký tự đúng; admin xóa được lời chúc

## Goal (một câu)
Khách có link riêng để lại lời chúc hiển thị công khai dưới tên của mình, và admin xóa được lời chúc không phù hợp.

## Acceptance criteria (verifiable)
- [ ] Migration tạo `guestbook_entries` (RLS bật, không policy `anon`), RPC `list_guestbook` (trả tối đa 50 lời chúc mới nhất gồm tên, nội dung, thời gian) và `add_guestbook_entry` (tên lấy từ `guests.display_name`). Quyền `revoke` và `grant` đúng như `security.md`; policy admin cho phép đọc và xóa; file SQL lưu trong repo; đã chạy lại `npm run types`.
- [ ] Section sổ lưu bút: danh sách lời chúc mới nhất (tên, nội dung, ngày) và form một ô nội dung có bộ đếm ký tự. Ai mở thiệp cũng đọc được danh sách; **chỉ khách có mã hợp lệ** thấy form, khách không có mã thấy dòng nhắc mở đúng link.
- [ ] Khách không tự gõ tên tác giả; tên lấy từ DB.
- [ ] Đã gửi đủ 3 lời chúc: form thay bằng dòng "Bạn đã gửi đủ số lời chúc".
- [ ] Lời chúc hiển thị bằng văn bản thuần: không dùng `dangerouslySetInnerHTML`; nội dung chứa `<script>` hay thẻ HTML hiện nguyên chữ.
- [ ] Admin có thêm tab "Lời chúc" liệt kê tất cả lời chúc kèm tên khách, xóa từng lời chúc có xác nhận.
- [ ] Trạng thái đang tải, lỗi, danh sách rỗng ("Hãy là người đầu tiên gửi lời chúc") đều hiển thị rõ.
- [ ] Log `[guestbook.add.start]`, `[guestbook.add.end]`, `[guestbook.add.error]`, không chứa nội dung lời chúc.

## Verification (thay cho "test first", vì dự án không có test tự động)
Chạy bằng vai trò `anon` rồi đọc lại chỉ đọc:

| Đầu vào | Kết quả mong đợi |
| --- | --- |
| mã đúng, lời chúc 1 ký tự | thành công |
| mã đúng, lời chúc đúng 500 ký tự | thành công |
| lời chúc rỗng | `invalid_input` |
| lời chúc chỉ gồm khoảng trắng | `invalid_input` |
| lời chúc 501 ký tự | `invalid_input` |
| lời chúc thứ 3 của cùng khách | thành công |
| lời chúc thứ 4 của cùng khách | `limit_reached` |
| mã sai | `invalid_code` |
| chuỗi có `<script>alert(1)</script>` | lưu nguyên và hiển thị thành chữ, không thực thi |

- `select` trực tiếp `guestbook_entries` bằng `anon` bị từ chối hoặc rỗng; chỉ `list_guestbook` trả dữ liệu.
- `npm run lint && npm run build` xanh; `get_advisors` (security) không có ERROR.
- Claude in Chrome ở 390x844: gửi 3 lời chúc bằng khách `[TEST] Anh Nam`, xác nhận lời thứ 4 bị chặn; đăng nhập admin (chủ dự án tự nhập mật khẩu), xóa một lời chúc và xác nhận nó biến mất ở trang thiệp.

## Files to touch
- `supabase/migrations/<ts>_create_guestbook.sql`: bảng, hai hàm, policy admin.
- `src/types/database.ts`: sinh lại.
- `src/services/guestbook.ts`, `src/hooks/useGuestbook.ts`: truy cập dữ liệu.
- `src/features/invitation/Guestbook.tsx`: section công khai.
- `src/features/admin/GuestbookTab.tsx`, `src/routes/AdminPage.tsx`: tab quản trị.
- `src/routes/InvitationPage.tsx`: gắn section.

## Steps (lát cắt mỏng xuyên suốt)
1. Viết migration, áp dụng, lưu file, sinh kiểu, chạy `get_advisors`.
2. Chạy bảng đầu vào ở trên bằng vai trò `anon`; sửa hàm nếu chưa đúng.
3. Dựng service, hook, section công khai và tab admin.
4. Chạy cổng kiểm chứng; đánh dấu task `in-review` (KHÔNG phải `done`).
5. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Giới hạn 3 lời chúc mỗi khách là mặc định đề xuất trong `product.md`; đổi nếu chủ dự án muốn.
- React tự escape nội dung khi render, nên chỉ cần **không** dùng `dangerouslySetInnerHTML`.
- Hàm công khai tự kiểm tra đầu vào: supabase.com/docs/guides/database/functions.
