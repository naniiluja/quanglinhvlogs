# Tooling (skill, MCP, subagent nào dùng KHI NÀO)

Danh mục công cụ của dự án để phiên sau biết chọn gì. `/ccf:updatespec` cập nhật khi thêm công cụ mới.

## MCP servers
- **context7**: tra tài liệu hiện hành của thư viện. **Dùng khi:** cần cú pháp API, best practice, migration của Vite, React, Tailwind, shadcn, Motion, supabase-js, react-router, react-query. Cách dùng: `resolve-library-id` rồi `query-docs`.
- **microsoft-learn**: tra tài liệu Microsoft, .NET, Azure. Dự án này không dùng nền tảng Microsoft nên hiếm khi cần.
- **supabase** (plugin, đã đăng nhập): quản lý DB. **Dùng khi:** xem schema (`list_tables`), chạy migration (`apply_migration`), truy vấn chỉ đọc (`execute_sql`), kiểm tra bảo mật (`get_advisors`), xem log (`query_logs`), sinh kiểu (`generate_typescript_types`), lấy URL và publishable key (`get_project_url`, `get_publishable_keys`). `create_project` chỉ dùng sau khi chủ dự án đồng ý (xác nhận vẫn là gói Free).
- **cloudflare** (plugin, đã cài): gọi API Cloudflare (`search`, `execute`), tra docs (`docs`). **Dùng khi:** xem hoặc sửa project Pages, xem danh sách deploy. Code trong `execute` chỉ gọi được `api.cloudflare.com` (mọi host khác bị chặn 403), nên **không deploy file bằng MCP**. Tài khoản chưa cài GitHub App cho Pages (lỗi 8000011), nên cũng không gắn repo được.
- **Deploy (wrangler, đã đăng nhập OAuth ngày 2026-09-24):** `npm run build && npx wrangler pages deploy dist --project-name quanglinh-thanhtruc --branch main --commit-hash "$(git rev-parse HEAD)" --commit-message "$(git log -1 --pretty=%s)"`. Biến `VITE_*` lấy từ `.env.local` lúc build trên máy, không cần đặt trên Cloudflare. Sau khi deploy: `curl` kiểm tra `/`, `/admin` (phải 200, không 404) và mở `https://quanglinh-thanhtruc.pages.dev/?g=<mã>`. Từ 2026-09-24 chủ dự án cho phép tự deploy production sau khi sửa xong và qua cổng kiểm chứng, không cần hỏi (xem `git-workflow.md`).
- **claude-in-chrome**: điều khiển trình duyệt. **Dùng khi:** kiểm tra giao diện theo cổng ở `testing.md` (screenshot, `resize_window`, `read_console_messages`), và xem mẫu tham khảo ngaychungdoi.com.
- **shadcn** (`npx shadcn@latest mcp`, khai báo ở `.mcp.json` của dự án): duyệt và cài component từ registry. **Dùng khi:** thêm hoặc xem component UI. Cần `components.json` (chạy `npx shadcn@latest init` trước, rồi khởi động lại Claude Code và chạy `/mcp` xác nhận `Connected`).

## Skills
- `ccf:grill-me`: phỏng vấn yêu cầu. **Dùng khi:** `/ccf:init` và `/ccf:plan` gọi. Ví dụ: chi tiết hóa một task còn mơ hồ.

## Subagents (CCF)
Mọi subagent CCF chỉ ĐỌC: khám phá, review, tra cứu best practice, không viết code. Việc implement task làm trực tiếp trong session chính (sau `/ccf:plan`), không giao cho subagent viết code, vì spawn thêm một ngữ cảnh riêng chậm hơn việc viết thẳng khi plan đã nằm sẵn trong ngữ cảnh.
- **ccf-codebase-analyzer**: lập bản đồ hoặc khoanh vùng codebase. **Dùng khi:** `/ccf:init` (dự án đã có code) hoặc trước khi lập kế hoạch một thay đổi.
- **ccf-spec-checker**: review độ khớp spec. **Dùng khi:** `/ccf:check`.
- **ccf-best-practice-researcher**: tra best practice. **Dùng khi:** cần căn cứ cho một quyết định thiết kế.

## System memory và Spec (KHI NÀO ghi vào đâu)
- **Spec** (file này và các rule khác): quy tắc thuộc về repo, suy ra được từ repo. Trọng số thấp hơn (như tin nhắn người dùng).
- **Memory** (`~/.claude/projects/<đường dẫn>/memory/`): phản hồi để tránh lặp lỗi (`feedback`) và sở thích người dùng (`user`). Trọng số cao hơn (như system prompt). Cập nhật qua `/ccf:updatespec`. **Không trùng** nội dung `CLAUDE.md`.
- **MEMORY.md chỉ là mục lục**: chỉ 200 dòng hoặc 25KB đầu được nạp mỗi phiên, giữ gọn.
