# Task 002: Link riêng của khách và bìa thiệp

- **Vertical slice:** DB (`guests`, `get_invitation`) + service + UI (bìa thiệp)
- **Depends on:** 001
- **Spec refs:** `product.md` (Link riêng của khách, Ảnh), `security.md`, `data-layer.md`, `architecture.md`, `error-handling.md`, `logging.md`, `design-system.md`
- **MCP to use:** supabase (`create_project` sau khi chủ dự án đồng ý, `apply_migration`, `execute_sql`, `get_advisors`, `get_project_url`, `get_publishable_keys`, `generate_typescript_types`), cloudflare (biến môi trường build), context7 (supabase-js, Motion), claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; `/?g=<mã hợp lệ>` hiện đúng tên; mã sai và không mã hiện giống nhau; `anon` không đọc được bảng `guests`

## Goal (một câu)
Khách mở `/?g=<mã>` và thấy bìa thiệp gọi đúng tên mình, với dữ liệu lấy từ Supabase qua hàm RPC an toàn.

## Acceptance criteria (verifiable)
- [ ] Project Supabase gói Free đã tạo (chủ dự án đồng ý trước và xác nhận là gói Free; đề xuất vùng Singapore cho gần Việt Nam). URL và publishable key nằm trong `.env.local` (không commit) và trong biến build của Cloudflare Pages.
- [ ] Migration tạo `guests` với RLS bật và **không có policy cho `anon`**, cột `code` unique và sinh ngẫu nhiên tối thiểu 16 ký tự; hàm `get_invitation(p_code)` là `security definer`, `set search_path = ''`, đã `revoke` khỏi `public, anon, authenticated` rồi `grant` cho `anon`. File SQL nằm trong `supabase/migrations/`.
- [ ] `npm run types` có trong `package.json` và sinh `src/types/database.ts`.
- [ ] Hai khách thử `[TEST] Anh Nam` và `[TEST] Chị Lan` có trong DB.
- [ ] `src/lib/supabase.ts` tạo client duy nhất từ `VITE_*`; `src/services/invitation.ts` là nơi duy nhất gọi `get_invitation`; có hook `useInvitation`; lỗi đi qua `AppError`; có log `[invitation.get.start]` và `[invitation.get.end]` kèm correlation ID và thời gian.
- [ ] `/?g=<mã hợp lệ>`: bìa hiện "Kính mời" + tên khách. Không có `g` hoặc mã sai: bìa hiện thiệp chung "Trân trọng kính mời quý khách", **giống hệt nhau** trong hai trường hợp này.
- [ ] Bìa có ảnh cặp đôi cắt từ `assets-src/dam-ngo-goc.jpg` đặt trong `public/images/`, tối đa 250KB, có `width`, `height`, `alt` tiếng Việt; khung ảnh không chứa chữ "Lễ dạm ngõ" hay `20.09.2026`.
- [ ] Bìa có tên hai người chữ viết tay, nút "Mở thiệp" (cuộn xuống phần nội dung), hoa rơi từ task 001, hiệu ứng vào (mờ dần và phóng nhẹ); tôn trọng `prefers-reduced-motion`.
- [ ] Trạng thái đang tải và lỗi mạng hiển thị rõ, không trang trắng.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh.
- Gọi RPC bằng vai trò `anon` (qua `curl` tới REST của project hoặc `execute_sql` với `set local role anon`): mã đúng trả tên; mã sai trả `invalid_code`; chuỗi rỗng và chuỗi 10.000 ký tự đều trả `invalid_code` chứ không lỗi máy chủ.
- `select` trực tiếp `guests` bằng `anon` trả về rỗng hoặc bị từ chối.
- `get_advisors` (security): không có ERROR; cảnh báo 0028 cho `get_invitation` được chấp nhận có chủ đích và ghi lý do trong migration.
- Claude in Chrome ở 390x844: mở `/?g=<mã của [TEST] Anh Nam>`, `/?g=sai`, và `/`; đối chiếu ba kết quả; console sạch.

## Files to touch
- `supabase/migrations/<ts>_create_guests_and_get_invitation.sql`: schema và hàm.
- `src/types/database.ts`: sinh tự động.
- `src/lib/supabase.ts`: client duy nhất.
- `src/services/invitation.ts`, `src/hooks/useInvitation.ts`: lấy thông tin lời mời.
- `src/features/invitation/Cover.tsx`: bìa.
- `src/routes/InvitationPage.tsx`: ghép bìa, đọc tham số `g`.
- `public/images/`: ảnh bìa đã cắt.
- `package.json`: script `types`.

## Steps (lát cắt mỏng xuyên suốt)
1. Hỏi chủ dự án đồng ý tạo project Supabase; tạo, lấy URL và publishable key, đặt vào `.env.local` và biến build Cloudflare.
2. Viết migration và áp dụng bằng `apply_migration`; lưu file SQL vào repo; chạy `npm run types`; chạy `get_advisors`.
3. Cắt ảnh: dùng `sips` có sẵn trên macOS (`sips -c <cao> <rộng> --cropOffset <y> <x> vào.jpg --out ra.jpg`), hoặc `npx sharp-cli` nếu cần WebP. Dùng Read để xem kết quả từng lần cắt.
4. Dựng service, hook, `Cover` và trang; chạy cổng kiểm chứng.
5. Đánh dấu task `in-review` (KHÔNG phải `done`).
6. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Vùng cần cắt (tọa độ trên ảnh hiển thị 1500x2000, nhân 1.024 để ra ảnh gốc 1536x2048): hai người và bó hoa nằm khoảng x 830 đến 1440, y 690 đến 1790. Bảng dạm ngõ chồng lên phần trái người cô dâu (chữ "Thanh Trúc" tới x khoảng 900, "Quang Linh" và ngày `20.09.2026` thấp hơn). Nếu không loại hết chữ mà không cắt vào người, cắt sát nửa thân trên (bỏ x dưới 905) hoặc hỏi chủ dự án; không tự chèn ảnh có chữ "dạm ngõ".
- Supabase hàm và bảo mật: supabase.com/docs/guides/database/functions (`security definer` phải kèm `set search_path = ''`); lint 0028 (supabase.com/docs/guides/observability/advisors).
- Tên key: supabase.com/docs/guides/getting-started/migrating-to-new-api-keys. Sinh kiểu: supabase.com/docs/guides/api/rest/generating-types.
- Cú pháp `createClient` và `import.meta.env` chưa được xác minh trong báo cáo tra cứu; tra lại Context7 khi viết.
