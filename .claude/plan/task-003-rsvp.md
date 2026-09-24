# Task 003: Xác nhận tham dự (RSVP)

- **Vertical slice:** DB (`rsvps`, `submit_rsvp`, mở rộng `get_invitation`) + service + UI (form RSVP)
- **Depends on:** 002
- **Spec refs:** `product.md` (RSVP), `security.md`, `data-layer.md`, `error-handling.md`, `state-management.md`, `component-design.md`
- **MCP to use:** supabase, context7 (react-hook-form, zod, react-query, Motion), claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; gửi, sửa, gửi lại vẫn một hàng cho mỗi khách; biên `party_size` 0, 1, 5, 6 và `message` 500, 501 đúng như bảng bên dưới

## Goal (một câu)
Khách bấm "tham dự" hoặc "không tham dự", chọn số người và để lại lời nhắn, được lưu vào DB gắn đúng khách và sửa lại được.

## Acceptance criteria (verifiable)
- [ ] Migration tạo `rsvps` (khóa chính `guest_id`, RLS bật, không policy `anon`) và hàm `submit_rsvp` (ghi đè theo `guest_id`); `get_invitation` trả thêm `rsvp` hiện có hoặc `null`. Quyền `revoke` và `grant` đúng như `security.md`; file SQL lưu trong repo; đã chạy lại `npm run types`.
- [ ] Form có hai lựa chọn rõ ràng: "Mình sẽ tham dự" và "Rất tiếc, mình không thể đến". Chọn tham dự thì hiện chọn số người từ 1 đến 5 (mặc định 1). Ô lời nhắn tùy chọn tối đa 500 ký tự có bộ đếm.
- [ ] Không tham dự: client gửi `party_size = 1`; thống kê về sau chỉ cộng `party_size` khi `attending = true`.
- [ ] Gửi thành công hiện lời cảm ơn khác nhau cho "có" và "không" kèm hiệu ứng hoa, rồi form chuyển sang trạng thái "Đã xác nhận, sửa lại".
- [ ] Mở lại link: form hiện sẵn câu trả lời đã gửi; gửi lại ghi đè và DB vẫn đúng một hàng cho khách.
- [ ] Không có mã hợp lệ: form **ẩn**, thay bằng dòng nhắc mở đúng link được gửi riêng (theo `product.md`).
- [ ] Nút gửi bị vô hiệu khi đang gửi (chống bấm đúp); lỗi mạng hiện toast và **không mất** nội dung khách đã nhập; mutation không tự thử lại lỗi nghiệp vụ.
- [ ] Log `[rsvp.submit.start]`, `[rsvp.submit.end]`, `[rsvp.submit.error]` kèm correlation ID, không chứa nội dung lời nhắn.

## Verification (thay cho "test first", vì dự án không có test tự động)
Chạy bằng `execute_sql` với `set local role anon` hoặc `curl` tới REST, sau đó đọc lại chỉ đọc để xác nhận:

| Đầu vào | Kết quả mong đợi |
| --- | --- |
| mã đúng, tham dự, `party_size` 1 | thành công |
| mã đúng, tham dự, `party_size` 5 | thành công |
| `party_size` 0 | `invalid_input` |
| `party_size` 6 | `invalid_input` |
| `message` đúng 500 ký tự | thành công |
| `message` 501 ký tự | `invalid_input` |
| mã sai | `invalid_code`, giống hệt lỗi mã không tồn tại |
| gửi hai lần cùng mã | vẫn một hàng trong `rsvps` cho khách đó, giá trị là của lần gửi sau |

- `npm run lint && npm run build` xanh; `get_advisors` (security) không có ERROR.
- Claude in Chrome ở 390x844: gửi "có" với 3 người và lời nhắn, tải lại trang và thấy dữ liệu còn nguyên, sửa thành "không", kiểm tra DB; thử khi ngắt mạng (giả lập offline) để xem toast và dữ liệu nhập không mất.

## Files to touch
- `supabase/migrations/<ts>_create_rsvps_and_submit_rsvp.sql`: bảng, hàm, mở rộng `get_invitation`.
- `src/types/database.ts`: sinh lại.
- `src/services/rsvp.ts`, `src/hooks/useSubmitRsvp.ts`: gửi RSVP.
- `src/features/invitation/Rsvp.tsx`: form.
- `src/routes/InvitationPage.tsx`: gắn section RSVP.

## Steps (lát cắt mỏng xuyên suốt)
1. Viết migration, áp dụng, lưu file, sinh kiểu, chạy `get_advisors`.
2. Chạy bảng đầu vào biên ở trên bằng vai trò `anon`; sửa hàm nếu chưa đúng.
3. Dựng service, hook, form (react-hook-form + zod, kiểm tra cùng giới hạn với DB) và trạng thái thành công.
4. Chạy cổng kiểm chứng; đánh dấu task `in-review` (KHÔNG phải `done`).
5. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Postgres upsert: `insert ... on conflict (guest_id) do update` trong hàm `submit_rsvp`.
- Hàm công khai phải tự kiểm tra đầu vào vì là endpoint công khai: supabase.com/docs/guides/database/functions.
- Form: shadcn Form với react-hook-form và zod, tra Context7 `/websites/ui_shadcn`.
