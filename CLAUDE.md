# quanglinhvlogs (thiệp cưới Quang Linh và Thanh Trúc)

> Quản lý bởi **CCF (Claude Context First)**. Quy trình: Explore, Plan, Implement, Commit.
> **TUẦN TỰ NGHIÊM NGẶT**: mỗi lần một task, không làm song song, vì sửa song song một codebase gây xung đột merge và những thay đổi đan xen không thể review.
> Mọi quyết định thiết kế dựa trên Context7, Microsoft Learn và docs chính thức của Supabase, Cloudflare.
> Giữ spec luôn mới bằng `/ccf:updatespec`.

## Đây là gì

Website thiệp cưới online, làm quà tặng bạn của chủ dự án: chú rể Quang Linh, cô dâu Thanh Trúc. Khách mở link riêng `/?g=<code>`, thấy thiệp có tên mình, xem thông tin lễ cưới, bấm địa điểm để mở Google Maps, quét QR mừng cưới, viết lời chúc và xác nhận tham dự (RSVP). Admin đăng nhập ở `/admin` để quản lý danh sách khách và xem ai đã xác nhận.

Ưu tiên số một là giao diện đẹp trên điện thoại: nền kem, xanh sage, vàng đồng, nhấn hồng phấn, hoa rơi, chuyển động mượt. Chi phí 0 đồng: Cloudflare Pages (`*.pages.dev`) và Supabase Free.

## Cấu trúc repo

- Một package duy nhất ở thư mục gốc, không tách `be/` và `fe/`: không có server riêng, Supabase là backend, nên tách đôi chỉ thêm khớp nối không cần thiết.
- Gốc chứa `CLAUDE.md`, `.claude/`, `package.json`, `vite.config.ts`, `index.html`. **git init ở gốc**.
- `src/`: mã nguồn ứng dụng (xem `.claude/rules/architecture.md`).
- `supabase/migrations/`: SQL của schema, nguồn sự thật cho DB.
- `public/`: tài nguyên tĩnh đã tối ưu (ảnh cắt, nhạc, favicon).
- `assets-src/`: ảnh gốc chưa cắt, KHÔNG commit (đã nằm trong `.gitignore`).
- Repo GitHub công khai: `https://github.com/naniiluja/quanglinhvlogs.git` (đang trống lúc khởi tạo spec).

## Rules (imported, chi tiết nằm ở .claude/rules/)

> Giữ file này dưới 200 dòng VÀ dưới 12KB, cái nào chạm trước. Kiểm bằng `wc -lc CLAUDE.md`, không đoán bằng mắt.

@.claude/rules/tech-stack.md
@.claude/rules/architecture.md
@.claude/rules/product.md
@.claude/rules/security.md
@.claude/rules/coding-conventions.md
@.claude/rules/logging.md
@.claude/rules/testing.md
@.claude/rules/error-handling.md
@.claude/rules/debugging.md
@.claude/rules/tooling.md
@.claude/rules/git-workflow.md

Rule có `paths:` tự nạp khi chạm file khớp, không cần `@import`: `design-system.md`, `component-design.md`, `frontend-conventions.md`, `state-management.md` (cho `src/**`), `data-layer.md` (cho `supabase/**`, `src/services/**`, `src/types/**`).

## Current plan

Xem `.claude/plan/PLAN.md` cho backlog tuần tự của lượt hiện tại. Làm **một task một lúc**, trực tiếp trong session (không giao cho subagent viết code), theo thứ tự. Không bắt đầu task N+1 khi task N chưa implement xong, chưa qua cổng kiểm tra và chưa `/ccf:check`. Lượt đã đóng chuyển sang `.claude/plan/ARCHIVE.md` (file task sang `.claude/plan/archive/`), mục này chỉ nói về việc đang làm. Lưu trữ, không xóa.
