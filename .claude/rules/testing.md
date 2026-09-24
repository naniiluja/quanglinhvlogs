# Testing (không có test tự động, kiểm chứng bằng cổng thay thế)

Quyết định của chủ dự án ngày 2026-09-24: **không viết test tự động**, không áp dụng ma trận thiết kế test, không có Stop-hook chặn phiên. Đây là dự án quà tặng nhỏ, nên bù lại bằng cổng kiểm chứng bên dưới thay vì bỏ qua kiểm chứng.

## Cổng kiểm chứng của mỗi task (phải xanh trước khi sang task kế)
1. `npm run lint` không lỗi.
2. `npm run build` qua (gồm `tsc -b`, nên kiểu TypeScript là lớp kiểm tra tự động chính).
3. Kiểm tra tay bằng Claude in Chrome, dựa trên **hành vi nhìn thấy** chứ không dựa trên việc "code chạy":
   - Khung điện thoại 390x844 và khung máy tính 1280 rộng: không cuộn ngang, không chữ bị cắt, chữ có dấu hiển thị đúng.
   - `read_console_messages` không có lỗi hay cảnh báo mới.
   - Cách giả lập khung điện thoại (đổi cỡ cửa sổ Chrome không ổn định): chạy `npx vite preview --port 4173`, mở `http://localhost:4173/admin`, rồi dùng `javascript_tool` thay `document.body.innerHTML` bằng các `<iframe width=390 height=844>` trỏ tới những URL cần so (cùng origin nên chạy được). Một ảnh chụp so được nhiều trường hợp cạnh nhau.
   - Chụp màn hình qua CDP đôi khi lỗi ở tab cũ: đóng tab đó, gọi `tabs_context_mcp` với `createIfEmpty: true` để lấy tab mới.
   - Đi hết luồng của task (ví dụ mở link khách, gửi RSVP, đăng nhập admin) và đối chiếu từng tiêu chí nghiệm thu.
4. Task chạm DB thêm: `get_advisors` (security) không có mức ERROR; gọi thử RPC bằng vai trò `anon` với mã đúng, mã sai, đầu vào biên (chuỗi rỗng, dài quá giới hạn); đọc lại dữ liệu bằng `execute_sql` (chỉ đọc) để xác nhận.

## Quy tắc
- Mỗi task có tiêu chí nghiệm thu cụ thể, mỗi tiêu chí trả lời được bằng "thấy" hoặc "không thấy" ở bước kiểm tra.
- Sửa lỗi: ghi lại các bước tái hiện thủ công (trong thân commit hoặc PR) rồi mới sửa, sau đó chạy lại đúng các bước đó.
- Không đánh dấu task `in-review` khi bước 1 đến 3 (và 4 nếu có) chưa chạy xong; báo trung thực kết quả từng bước, kể cả bước bị bỏ qua.

## Công cụ và vị trí
- Không có test framework. Lệnh cổng: `npm run lint && npm run build`.
- Nếu sau này chủ dự án muốn có test: đề xuất Vitest + Testing Library cho `src/lib/`, rồi cập nhật file này qua `/ccf:updatespec`.
- Ngưỡng coverage: không áp dụng.
