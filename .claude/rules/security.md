# Security (repo công khai, key client công khai)

Bối cảnh: mã nguồn nằm trên GitHub công khai và bundle chứa publishable key của Supabase, nên ai cũng gọi được API bằng key đó. An toàn dựa hoàn toàn vào RLS và hàm RPC.

## Bí mật
- Chỉ **publishable key** (`sb_publishable_...`) và URL project được vào client, qua `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`. Biến `VITE_*` bị nhúng vào bundle nên tuyệt đối không đặt bí mật ở đó.
- Không bao giờ đưa `sb_secret_...`, `service_role`, mật khẩu, token Cloudflare vào repo, `VITE_*`, hoặc log.
- `.env` và `.env.*` không được commit; chỉ `.env.example` (tên biến, không có giá trị thật).
- Không commit danh sách khách, số điện thoại, hay số tài khoản thật khi chủ dự án chưa xác nhận.

## Postgres
- Mọi bảng trong schema `public` bật RLS. Bảng của khách (`guests`, `rsvps`, `guestbook_entries`) **không có policy nào cho `anon`**: khách chỉ chạm dữ liệu qua hàm RPC.
- Hàm RPC cho khách: `security definer`, `set search_path = ''`, tên bảng viết đủ schema (`public.guests`).
- Hàm mặc định cho phép mọi vai trò gọi, nên mỗi hàm phải `revoke execute ... from public, anon, authenticated` rồi chỉ `grant execute ... to anon` (và `authenticated` nếu cần) đúng những hàm dự định.
- Mỗi hàm tự kiểm tra đầu vào (độ dài, giá trị hợp lệ, giới hạn số lượng) vì nó là endpoint công khai. Advisor sẽ cảnh báo `anon_security_definer_function_executable` (lint 0028) cho các hàm này: chấp nhận có chủ đích, ghi lý do trong migration.
- Mã khách: tối thiểu 16 ký tự ngẫu nhiên từ nguồn mật mã (`gen_random_uuid()` hoặc `pgcrypto`), không dùng số tự tăng, không đoán được.
- Mã sai và mã không tồn tại trả **cùng một lỗi** `invalid_code`.

## Admin
- Đăng nhập bằng Supabase Auth (email, mật khẩu). **Tắt đăng ký công khai** trong cài đặt Auth, nếu không ai cũng tạo được tài khoản `authenticated`.
- Policy cho admin phải kiểm tra allowlist (`public.is_admin()` đọc bảng `admins`), không dừng ở `to authenticated`.
- Route `/admin` có `noindex`; route guard chỉ là tiện ích UX, quyền thật nằm ở RLS.

## Kiểm tra được
- `grep -rn "service_role\|sb_secret" .` (bỏ `node_modules`) không có kết quả.
- Sau mỗi migration: `get_advisors` (security) không có mức ERROR, các cảnh báo còn lại đều thuộc hàm RPC đã chấp nhận.
- Gọi bảng `guests` bằng vai trò `anon` trả về rỗng hoặc bị từ chối, không lộ tên khách.
