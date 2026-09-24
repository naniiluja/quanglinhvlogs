# Task 006: Trang admin: đăng nhập, khách, thống kê

- **Vertical slice:** DB (`admins`, `is_admin()`, policy RLS cho admin) + service + UI (`/admin`)
- **Depends on:** 005
- **Spec refs:** `security.md` (mục Admin), `data-layer.md`, `product.md` (Link riêng, RSVP), `state-management.md`, `error-handling.md`
- **MCP to use:** supabase (`apply_migration`, `execute_sql`, `get_advisors`), context7 (supabase-js Auth, shadcn Table và Form), shadcn, claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; người không phải admin, kể cả tài khoản `authenticated`, bị RLS từ chối; thêm, sửa, xóa khách và sao chép link chạy

## Goal (một câu)
Chủ dự án đăng nhập `/admin` để thêm hoặc sửa tên người nhận, lấy link mời riêng của từng khách và xem ai đã xác nhận tham dự.

## Acceptance criteria (verifiable)
- [ ] **Việc chủ dự án tự làm** (Claude không làm hộ): tắt đăng ký công khai (public sign-up) trong cài đặt Auth của Supabase, tạo người dùng admin bằng email và mật khẩu trong dashboard. Claude chỉ thêm `user_id` của tài khoản đó vào bảng `admins` sau khi chủ dự án cho biết đã tạo xong.
- [ ] Migration tạo `admins` (RLS bật), hàm `public.is_admin()` (đọc `auth.uid()`), và policy `to authenticated using (public.is_admin())` cho thao tác đọc và ghi trên `guests` và `rsvps`. File SQL lưu trong repo; đã chạy lại `npm run types`.
- [ ] `/admin` chưa đăng nhập hiện form email và mật khẩu; sai thông tin hiện một lỗi chung không nói rõ email hay mật khẩu sai; có nút đăng xuất; phiên được giữ khi tải lại trang.
- [ ] Danh sách khách: tên hiển thị, nút sao chép link mời `${origin}/?g=${code}` (có toast), trạng thái (chưa trả lời, tham dự, không tham dự), số người, lời nhắn.
- [ ] Thêm một khách; thêm nhiều khách cùng lúc (mỗi dòng một tên, bỏ dòng trống, cắt khoảng trắng đầu cuối, giới hạn 100 dòng mỗi lần); sửa tên; xóa có hộp thoại xác nhận nói rõ xóa khách sẽ xóa luôn RSVP và lời chúc của khách đó.
- [ ] Thống kê: tổng số khách mời, số đã trả lời, số khách tham dự, số khách không tham dự, tổng số người tham dự (cộng `party_size` **chỉ** của khách `attending = true`).
- [ ] Route `/admin` có `noindex`; route guard chỉ là tiện ích UX, quyền thật do RLS.
- [ ] Phiên đăng nhập admin nằm trong context riêng theo `state-management.md`; không log email hay mật khẩu.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh; `get_advisors` (security) không có ERROR.
- Vai trò `anon`: `select`, `insert`, `update`, `delete` trên `guests` và `rsvps` đều trả rỗng hoặc bị từ chối.
- Người dùng `authenticated` **không** nằm trong `admins`: cũng bị từ chối. Mô phỏng bằng `execute_sql` với `set local role authenticated` và `set local request.jwt.claims` mang một `sub` không có trong `admins`, để không phải tạo thêm tài khoản thật.
- Admin (đăng nhập thật ở Claude in Chrome, chủ dự án tự nhập mật khẩu vì Claude không nhập mật khẩu): thấy đủ khách, thêm một khách `[TEST] Bác Hai`, sao chép link, mở link ở tab mới và thấy tên đúng, sửa tên rồi mở lại thấy tên mới, xóa khách và xác nhận RSVP của khách đó cũng mất.
- Thêm nhiều khách với chuỗi có dòng trống, khoảng trắng thừa, và đúng 100 dòng.

## Files to touch
- `supabase/migrations/<ts>_create_admins_and_admin_policies.sql`: bảng, hàm, policy.
- `src/types/database.ts`: sinh lại.
- `src/services/admin.ts`, `src/hooks/useGuests.ts`: truy cập dữ liệu admin.
- `src/features/admin/`: `AdminLogin.tsx`, `AdminGuard.tsx`, `GuestTable.tsx`, `GuestForm.tsx`, `BulkAddDialog.tsx`, `Stats.tsx`, `AuthProvider.tsx`.
- `src/routes/AdminPage.tsx`: ghép màn hình.
- `index.html` hoặc thẻ meta theo trang: `noindex` cho `/admin`.

## Steps (lát cắt mỏng xuyên suốt)
1. Nhắc chủ dự án làm hai việc thủ công ở dashboard (tắt sign-up, tạo admin) và chờ xác nhận.
2. Viết migration, áp dụng, lưu file, sinh kiểu, chạy `get_advisors`, chạy bộ kiểm tra RLS ở phần Verification.
3. Dựng service, hook, đăng nhập, bảng khách, thêm hàng loạt, thống kê.
4. Chạy cổng kiểm chứng; đánh dấu task `in-review` (KHÔNG phải `done`).
5. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Policy admin phải kiểm tra allowlist chứ không dừng ở `to authenticated`, vì ai đăng ký được cũng có quyền `authenticated` (báo cáo tra cứu, lint 0029 trong supabase.com/docs/guides/observability/advisors).
- Đăng nhập: `supabase.auth.signInWithPassword`; tra lại Context7 để lấy cú pháp hiện hành.
- Ghi dữ liệu thử vào DB thật phải có tên bắt đầu bằng `[TEST]` (xem `data-layer.md`).
