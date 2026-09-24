# Task 001: Nền tảng, theme và deploy

- **Vertical slice:** build tool + UI (trang giữ chỗ) + hosting (Cloudflare Pages)
- **Depends on:** không có (task đầu tiên)
- **Spec refs:** `tech-stack.md`, `design-system.md`, `architecture.md`, `coding-conventions.md`, `security.md` (mục Bí mật)
- **MCP to use:** context7 (Vite, Tailwind v4, shadcn, Motion), cloudflare, shadcn (sau khi có `components.json`), claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung (`lint`, `build`, kiểm tra tay) và trang chạy thật trên `*.pages.dev`, `/admin` mở trực tiếp không 404, chữ "Thanh Trúc" đủ dấu ở cả ba font

## Goal (một câu)
Dựng khung dự án Vite + React + TypeScript + Tailwind + shadcn với theme kem, sage, vàng đồng, rồi đưa một trang giữ chỗ có hoa rơi lên `*.pages.dev` để chứng minh đường ống build và deploy chạy trước khi thêm tính năng.

## Acceptance criteria (verifiable)
- [ ] Dự án Vite React TS nằm ở thư mục gốc; `CLAUDE.md`, `.claude/`, `.mcp.json`, `.gitignore`, `assets-src/` còn nguyên (không bị scaffold xóa).
- [ ] Tailwind v4 dùng plugin `@tailwindcss/vite`; alias `@/` khai báo ở cả `vite.config.ts` và `tsconfig.app.json`; `npx shadcn@latest init` đã chạy và `components.json` tồn tại.
- [ ] Token màu trong `@theme` ở `src/index.css` khớp bảng của `design-system.md`; không có mã hex rải rác trong `.tsx`.
- [ ] Ba font (tiêu đề serif, chữ viết tay cho tên, thân bài sans) đã chọn, mỗi font xác nhận có subset `vietnamese`, tự host bằng `@fontsource`; "Thanh Trúc" và "Quang Linh" hiển thị đủ dấu ở cả ba vai trò.
- [ ] `index.html` có `lang="vi"`, `<title>` tiếng Việt, meta viewport.
- [ ] Script `lint`, `build`, `format` chạy được; Prettier cấu hình thụt lề 2 dấu cách.
- [ ] `.env.example` liệt kê `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY` không kèm giá trị.
- [ ] `src/lib/log.ts` (log JSON, correlation ID, tiền tố `[vùng.hành động.pha]`) và `src/lib/errors.ts` (`AppError`) có mặt, theo `logging.md` và `error-handling.md`.
- [ ] Trang `/` là trang giữ chỗ: nền kem, tên "Quang Linh và Thanh Trúc" chữ viết tay, hoa rơi (tối đa 18 phần tử, chỉ animate `transform` và `opacity`, tắt khi `prefers-reduced-motion`). Trang `/admin` là trang giữ chỗ.
- [ ] Deploy lên Cloudflare Pages: `https://<tên>.pages.dev` mở được; mở trực tiếp `https://<tên>.pages.dev/admin` trả về ứng dụng chứ không phải 404 (không có `404.html` trong `dist/`).

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh.
- Claude in Chrome: mở bản local (`npm run dev`) và bản `pages.dev` ở 390x844 và 1280; xác nhận bằng mắt chữ đủ dấu, hoa rơi mượt, không cuộn ngang; `read_console_messages` sạch.
- Bật giảm chuyển động của hệ điều hành (hoặc giả lập trong DevTools) và xác nhận hoa rơi biến mất.
- `ls dist` không có `404.html`.

## Files to touch
- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `eslint.config.js`, `.prettierrc`, `components.json`: khung dự án.
- `index.html`: ngôn ngữ, tiêu đề.
- `src/main.tsx`, `src/App.tsx`, `src/index.css`: khởi động, router, token và font.
- `src/routes/InvitationPage.tsx`, `src/routes/AdminPage.tsx`: trang giữ chỗ.
- `src/components/effects/PetalsFall.tsx`: hoa rơi.
- `src/config/wedding.ts`: bản nháp chỉ có tên hai người.
- `src/lib/log.ts`, `src/lib/errors.ts`, `src/lib/utils.ts`: tiện ích nền.
- `.env.example`: tên biến môi trường.

## Steps (lát cắt mỏng xuyên suốt)
1. Scaffold bằng `npm create vite@latest . -- --template react-ts`. Thư mục không rỗng nên Vite sẽ hỏi: **chọn "Ignore files and continue", tuyệt đối không chọn xóa file hiện có**, vì xóa sẽ mất toàn bộ spec. Nếu không chắc, scaffold trong thư mục tạm rồi chép vào, không ghi đè `.gitignore` và `CLAUDE.md`.
2. Cài Tailwind v4 và shadcn theo tài liệu hiện hành (tra Context7); sau `shadcn init`, nhắc chủ dự án khởi động lại Claude Code và chạy `/mcp` để xác nhận shadcn `Connected`.
3. Khai báo token và font; chỉ nhập các subset và độ đậm dùng thật.
4. Dựng trang giữ chỗ và `PetalsFall`; chạy cổng kiểm chứng ở local.
5. Deploy: hỏi chủ dự án chọn cách. Khuyến nghị `npx wrangler pages deploy dist` sau khi chủ dự án tự chạy `! npx wrangler login` (đăng nhập là việc của chủ dự án); phương án khác là kết nối repo GitHub trong dashboard Cloudflare để mỗi lần push tự build (lệnh build `npm run build`, thư mục ra `dist`). Chỉ commit và push khi chủ dự án đồng ý (xem `git-workflow.md`).
6. Chạy lại cổng ở bản `pages.dev`, rồi đánh dấu task `in-review` (KHÔNG phải `done`).
7. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- shadcn với Vite: ui.shadcn.com/docs/installation/vite (Context7 `/websites/ui_shadcn`).
- Tailwind v4 dùng `@theme` trong CSS, không còn `tailwind.config.js`; tra thêm Context7 `/websites/tailwindcss` vì báo cáo tra cứu ghi phần này chưa được xác minh trong phiên.
- Pages và SPA: developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/. Pages tự chạy chế độ SPA khi không có `404.html`.
- Cloudflare khuyến nghị Workers cho dự án mới (developers.cloudflare.com/pages/migrations/): nếu tạo project Pages bị chặn, dừng lại và hỏi chủ dự án.
- Motion: motion.dev/docs/react-use-reduced-motion.
