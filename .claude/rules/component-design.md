---
paths: ["src/**"]
---

# Component Design

## Quy tắc
- Kiểu component: function component với hook, không dùng class.
- Tách phần hiển thị và phần lấy dữ liệu: component section (`Rsvp.tsx`) nhận props hoặc gọi một hook riêng (`useRsvp`); không có lời gọi Supabase trong component.
- Một component một trách nhiệm; tách khi quá lớn (mốc ~200 dòng).
- Props khai báo kiểu rõ ràng bằng `interface` hoặc `type`; tránh truyền props qua nhiều tầng (dùng hook hoặc context khi thật sự cần).

## Cấu trúc
- Thư mục theo tính năng: `src/features/<tên>/` chứa component, hook riêng của tính năng và file phụ trợ nhỏ.
- Style: Tailwind CSS + shadcn/ui.
- Thư viện component: shadcn/ui (Radix + Tailwind). Ưu tiên component có sẵn; **không tự dựng lại** primitive mà shadcn đã có (Button, Dialog, Form, Input, Textarea, RadioGroup, Calendar, Table, Sonner).

## Thêm component shadcn
- Dùng shadcn MCP (hoặc `npx shadcn@latest add <tên>`) để thêm component rồi chỉnh theo theme; không dán bản tự viết lại.
