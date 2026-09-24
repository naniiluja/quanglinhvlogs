# Logging (tối ưu để AI lần theo dấu vết)

Mục tiêu: chỉ cần một correlation ID là grep ra toàn bộ dấu vết của một lượt dùng. Đây là SPA không có server riêng, nên log ở hai nơi: console trình duyệt (phía client) và log của Supabase (phía DB).

## Bắt buộc
- Log có cấu trúc (JSON một dòng), không viết chuỗi tự do. Mọi log đi qua `src/lib/log.ts`, không gọi `console.*` trực tiếp ở chỗ khác.
- **Correlation ID**: `crypto.randomUUID()` sinh một lần mỗi lần tải trang, đính vào mọi log của lượt đó.
- Mỗi lệnh gọi qua ranh giới (mọi RPC hoặc truy vấn Supabase trong `src/services/`) log cả lúc vào và lúc ra, kèm correlation ID và thời gian (ms).
- Tiền tố sự kiện thống nhất `[<vùng>.<hành động>.<pha>]`, ví dụ `[rsvp.submit.start]`, `[rsvp.submit.end]`, `[rsvp.submit.error]`.

## Mức log
- `error`: cần xử lý. `warn`: bất thường nhưng đã xử lý. `info`: mốc nghiệp vụ. `debug`: chi tiết khi phát triển, chỉ in khi `import.meta.env.DEV`.
- Không log bí mật hay dữ liệu cá nhân: log được nhân bản tới nơi kiểm soát truy cập yếu hơn nguồn dữ liệu. Cụ thể không log: mã khách đầy đủ (chỉ 4 ký tự đầu), nội dung lời nhắn và lời chúc, số tài khoản, email admin.

## Công cụ
- Thư viện: hàm tự viết `src/lib/log.ts` (không thêm thư viện log).
- Đích: console trình duyệt, không gửi về server (chưa có nhu cầu). Phía DB xem bằng `query_logs` của Supabase MCP.
