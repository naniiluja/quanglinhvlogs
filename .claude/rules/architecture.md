# Architecture

## Phân lớp và ranh giới
`components/pages (UI)` → `hooks (react-query)` → `services` → `lib/supabase` (`publicDb` cho khách, `getAdminClient()` cho admin) → Supabase RPC/tables.

- UI chỉ hiển thị và bắt sự kiện. Gọi dữ liệu qua hook.
- Hook bọc react-query, gọi service. Không chứa SQL hay tên bảng.
- Service là nơi **duy nhất** biết tên RPC/bảng, chuyển lỗi Supabase thành `AppError` (xem `error-handling.md`).

## Hướng phụ thuộc
- Phụ thuộc chỉ đi một chiều: UI → hook → service → client. Lớp dưới không import lớp trên.
- Logic nghiệp vụ (tính đếm ngược, dựng link Maps, dựng URL VietQR) là hàm thuần trong `src/lib/`, không phụ thuộc React hay Supabase.

## Design patterns
- Backend: không có server riêng. Quyền truy cập dữ liệu nằm ở Postgres: RLS + hàm RPC `security definer` (xem `security.md`, `data-layer.md`).
- Frontend: component hàm nhỏ theo tính năng (feature folder), hook làm lớp truy cập dữ liệu, cấu hình nội dung thiệp gom một chỗ ở `src/config/wedding.ts`.

## Nơi đặt file
- `src/routes/`: hai trang `InvitationPage`, `AdminPage` và router.
- `src/features/invitation/`: các section của thiệp (Cover, Couple, Event, Countdown, Venue, Gallery, GiftQr, Rsvp, Guestbook, MusicToggle).
- `src/features/admin/`: màn hình quản trị.
- `src/components/ui/`: file do shadcn và registry bên thứ ba sinh, không sửa tay (`blur-fade.tsx`, `button.tsx`...).
- `src/components/effects/`: lớp bọc cấu hình hiệu ứng của thư viện (`PetalsFall.tsx` bọc tsParticles, `Reveal.tsx` bọc BlurFade).
- `src/config/wedding.ts`: toàn bộ nội dung sự kiện, tài khoản mừng cưới, đường dẫn ảnh.
- `src/services/`: `invitation.ts`, `rsvp.ts`, `guestbook.ts`, `admin.ts`.
- `src/hooks/`: hook react-query, tên `useXxx.ts`.
- `src/lib/`: `supabase.ts`, `log.ts`, `errors.ts`, `maps.ts`, `vietqr.ts`, `countdown.ts`, `utils.ts`.
- `src/types/database.ts`: sinh tự động từ Supabase, không sửa tay.
- `supabase/migrations/`: SQL migration.

## Quy tắc kiểm tra được
- Mỗi module một trách nhiệm rõ ràng.
- Không import vòng giữa các lớp: vòng phụ thuộc làm mỗi bên không thể tách ra kiểm tra và che giấu hướng phụ thuộc thật.
- `grep -rn "lib/supabase" src/features src/components src/routes src/hooks` không có kết quả (chỉ `src/services/` được import client).
- Không có chuỗi tên bảng hoặc tên RPC nằm ngoài `src/services/`.
