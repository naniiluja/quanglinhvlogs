# Debugging (kỷ luật, không vội)

Quy trình bắt buộc khi điều tra lỗi, làm trực tiếp trong hội thoại (không có lệnh debug riêng):
1. **Tái hiện**: dựng lại lỗi từ triệu chứng, đầu vào, môi trường (thiết bị, trình duyệt trong Zalo hay Safari, link nào) trước khi chạm code.
2. **Lần theo từng bước**: theo correlation ID trong console, đọc log vào và ra ở mỗi ranh giới; phía DB dùng `query_logs` của Supabase MCP.
3. **Truy vấn DB chỉ đọc** (`execute_sql`, `list_tables`) để xác nhận trạng thái dữ liệu từng bước; không ghi dữ liệu khi đang điều tra.
4. **Khoanh vùng bằng bằng chứng**: file:line, dòng log, hàng dữ liệu, không bằng cảm tính.
5. **Ghi lại các bước tái hiện thủ công** (dự án không có test tự động, xem `testing.md`) trước khi sửa.
6. **Sửa tối thiểu**: chỉ sửa trong phạm vi, không tiện tay refactor.

> Không đoán rồi sửa ngay khi chưa có bằng chứng.

## Lỗi đã biết (cập nhật bởi /ccf:updatespec)
Mỗi mục ghi: triệu chứng, nguyên nhân gốc, cách phòng, file liên quan.
- **Lịch khoanh sai ngày theo bên mời**: khách một bên thấy cả 11 và 12 được khoanh. Gốc: `react-day-picker` giữ `selected` đầu tiên (lúc lời mời đang tải, `side` tạm là `both`) trong state nội bộ. Phòng: `key={side}` trên `Calendar`. File `src/features/invitation/Countdown.tsx`.
- **Supabase bị tạm dừng**: mọi RPC timeout, `get_project` báo `INACTIVE`. Gốc: không còn gì gọi API trong 7 ngày. Xử lý: `restore_project`, rồi kiểm cơ chế keepalive (xem `tech-stack.md`).
