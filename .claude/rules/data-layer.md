---
paths: ["supabase/**", "src/services/**", "src/types/**"]
---

# Data Layer

## Schema và migration
- DB: Supabase Postgres, gói Free. Bảo mật xem `security.md`.
- Mọi thay đổi schema đi qua `apply_migration` của Supabase MCP **và** được lưu thành file `supabase/migrations/<yyyymmddhhmmss>_<tên>.sql` trong repo. Không sửa schema bằng `execute_sql`; repo là nguồn sự thật, không chỉ DB từ xa.
- Sau mỗi migration: `npm run types` (sinh `src/types/database.ts`), rồi chạy `get_advisors` (security).
- Đặt tên: bảng và cột `snake_case`, bảng số nhiều, tham số RPC có tiền tố `p_`.

## Hợp đồng dữ liệu dự kiến (chốt chính thức ở task tương ứng)
Bảng:
- `guests(id uuid pk, code text unique not null, display_name text not null check 1..80 ký tự, created_at timestamptz)`.
- `rsvps(guest_id uuid pk fk guests on delete cascade, attending boolean not null, party_size smallint not null check 1..5, message text check <= 500 ký tự, updated_at timestamptz)`. Khóa chính là `guest_id` để mỗi khách đúng một bản ghi.
- `guestbook_entries(id uuid pk, guest_id uuid fk guests on delete cascade, message text not null check 1..500 ký tự, created_at timestamptz)`.
- `admins(user_id uuid pk fk auth.users on delete cascade)`; hàm `public.is_admin()` kiểm tra `auth.uid()` có trong bảng này.

Hàm RPC cho khách (`security definer`, xem `security.md`):
- `get_invitation(p_code text)` trả `{ display_name, rsvp: { attending, party_size, message } | null }`; mã sai raise `invalid_code`.
- `submit_rsvp(p_code text, p_attending boolean, p_party_size smallint, p_message text)`: ghi đè bản ghi của khách; raise `invalid_code` hoặc `invalid_input`.
- `list_guestbook()` trả `{ author_name, message, created_at }` của tối đa 50 lời chúc mới nhất.
- `add_guestbook_entry(p_code text, p_message text)`: tên tác giả lấy từ `guests.display_name`; raise `invalid_code`, `invalid_input`, hoặc `limit_reached` (mặc định tối đa 3 lời chúc mỗi khách).

Admin dùng truy cập bảng trực tiếp qua policy RLS `to authenticated using (public.is_admin())`.

## Quy tắc
- Truy cập DB chỉ qua `src/services/`; không rải lời gọi `supabase.from(...)` hay `supabase.rpc(...)` ra nơi khác.
- Logic nghiệp vụ nằm ở service và hàm thuần trong `src/lib/`, không đẩy vào DB ngoài phần ràng buộc dữ liệu và kiểm tra quyền; như vậy logic kiểm tra được mà không cần DB.
- Thao tác nhiều bước phải nguyên tử thì gói trong một hàm Postgres (một RPC = một giao dịch), không ghép nhiều lời gọi từ client.
- Đánh chỉ mục cho truy vấn nóng: `guests.code` đã có unique index; `guestbook_entries(created_at desc)`.
- Dữ liệu thử nghiệm ghi vào DB thật phải có tên bắt đầu bằng `[TEST]` để dọn trước khi phát hành (task 009).
