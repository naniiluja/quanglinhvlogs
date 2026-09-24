# Error Handling

## Phân loại
- Phân biệt **lỗi nghiệp vụ mong đợi** (mã sai, đầu vào không hợp lệ, hết lượt lời chúc) với **lỗi hệ thống** (mất mạng, Supabase lỗi, bug).
- Thông báo cho người dùng khác thông báo nội bộ; không lộ chi tiết nội bộ ra ngoài, vì stack trace hay câu truy vấn trong giao diện là tấm bản đồ cho kẻ tấn công.

## Quy tắc kiểm tra được
- **Không nuốt lỗi.** Lỗi bắt được phải được log (kèm correlation ID) hoặc ném lại có thêm ngữ cảnh.
- Khi vượt ranh giới (service gọi Supabase) bọc lỗi kèm ngữ cảnh, giữ nguyên `cause`, không làm mất stack gốc.
- Chỉ thử lại lỗi tạm thời (mạng, timeout) với backoff (react-query `retry`); không bao giờ thử lại lỗi nghiệp vụ (`retry: false` cho mutation RSVP và lời chúc).
- Mọi màn hình gọi dữ liệu xử lý rõ ba trạng thái: đang tải, lỗi, có dữ liệu. Không để trang trắng.

## Định dạng lỗi
- Kiểu chuẩn: `AppError` trong `src/lib/errors.ts` gồm `code`, `message` (tiếng Việt, hiển thị được cho người dùng), `cause?` (lỗi gốc, chỉ để log).
- `code` thuộc: `INVALID_CODE`, `INVALID_INPUT`, `LIMIT_REACHED`, `UNAUTHORIZED`, `NETWORK`, `UNKNOWN`.
- Ánh xạ: hàm RPC dùng `raise exception '<mã_chữ_thường>'` (`invalid_code`, `invalid_input`, `limit_reached`); service đọc `error.message` của Supabase và đổi thành `code` tương ứng. Lỗi không nhận ra là `UNKNOWN`. Lỗi `fetch` thất bại là `NETWORK`.
- Khách thấy: `INVALID_CODE` thành thông báo chung ("Link mời không hợp lệ, vui lòng mở đúng link được gửi riêng cho bạn"), `NETWORK` thành "Mất kết nối, thử lại giúp mình nhé".
