---
paths: ["src/**"]
---

# Frontend Conventions

## Cấu trúc
- Tổ chức thư mục: xem `.claude/rules/architecture.md` mục "Nơi đặt file".
- Routing: `react-router`, `/` là `InvitationPage`, `/admin` là `AdminPage`; mọi route khác chuyển về `/`. Không thêm file `404.html` (xem `tech-stack.md`).

## Quy tắc kiểm tra được
- Không gọi API trực tiếp trong component hiển thị; đi qua lớp hook và service (xem `architecture.md`).
- Mọi chữ hiển thị là tiếng Việt có dấu; chữ nội dung sự kiện lấy từ `src/config/wedding.ts`, không viết cứng rải rác trong component.
- Khả năng truy cập:
  - Nút và liên kết có tên truy cập được; icon đơn lẻ có `aria-label`.
  - Form dùng `label` gắn với input; lỗi hiển thị bằng chữ, không chỉ bằng màu.
  - Focus nhìn thấy được khi điều hướng bằng bàn phím.
  - Chuyển động tôn trọng `prefers-reduced-motion` (xem `design-system.md`).
- Biến môi trường đọc qua `import.meta.env.VITE_*`, tập trung ở `src/lib/supabase.ts`; không đọc rải rác.
- Liên kết ngoài mở bằng `rel="noopener noreferrer"`.

## Nguồn thiết kế
- Chưa có bản Claude Design. Xem `design-system.md`; cân nhắc tạo một bản trong Claude Design nếu muốn giao diện trau chuốt hơn nữa.
