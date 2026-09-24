---
paths: ["src/**"]
---

# State Management

## Quy tắc
- Không có state manager toàn cục. Thư viện lấy dữ liệu: `@tanstack/react-query` cho dữ liệu server; phần còn lại là state cục bộ (`useState`, `useReducer`).
- Tách **state server** (khách, RSVP, lời chúc, danh sách admin: nằm trong cache react-query) khỏi **state client** (đang mở thiệp hay chưa, nhạc bật hay tắt, hộp thoại đang mở: nằm trong component hoặc một context nhỏ).
- Lấy dữ liệu bằng react-query; xử lý rõ trạng thái đang tải và lỗi (xem `error-handling.md`).
- State chỉ một component dùng thì để cục bộ ở component đó; đẩy lên toàn cục làm các component không liên quan dính vào nhau và buộc render lại rộng hơn.
- Duy nhất được phép dùng context: trạng thái nhạc nền (`MusicProvider`) và phiên đăng nhập admin.

## Đồng bộ với API
- Hình dạng dữ liệu khớp hợp đồng RPC ở `data-layer.md` và kiểu sinh tự động `src/types/database.ts`.
- Kiểm tra dữ liệu ở biên: dữ liệu từ form kiểm bằng `zod` trước khi gửi; phản hồi từ Supabase được service ép về kiểu ứng dụng rồi mới ra khỏi service.
- Sau khi mutation thành công, làm mới đúng query liên quan (`invalidateQueries`) thay vì tự sửa cache bằng tay.
