# Tech Stack

Triết lý: chọn stack **ổn định, phổ biến, ít lỗi nhất**; mỗi thư viện chọn bản được dùng nhiều và bảo trì tốt nhất.

## Stack đã chốt
| Hạng mục | Lựa chọn |
| --- | --- |
| Ngôn ngữ | TypeScript, bật `strict` |
| Build tool | Vite |
| UI | React, function component |
| Style | Tailwind CSS v4 (plugin `@tailwindcss/vite`, token khai báo trong `@theme` ở `src/index.css`) |
| Component | shadcn/ui (Radix + Tailwind) |
| Chuyển động | Motion, import từ `motion/react` |
| Backend | Supabase (Postgres, Auth), không có server riêng |
| Hosting | Cloudflare Pages, bản build tĩnh `dist/`, tên miền `*.pages.dev` |
| Runtime dev | Node LTS qua `nvm`, package manager là `npm` |

## Thư viện lõi (mỗi nhu cầu đúng một lựa chọn)
- Routing: `react-router` (chế độ khai báo, `BrowserRouter`), chỉ hai nhóm route: `/` và `/admin`.
- Dữ liệu từ server: `@tanstack/react-query`.
- Form và kiểm tra dữ liệu: `react-hook-form` + `zod` + `@hookform/resolvers`.
- Supabase: `@supabase/supabase-js` v2, một client duy nhất ở `src/lib/supabase.ts`.
- Icon: `lucide-react`. Toast: `sonner`. Lịch tháng: component `calendar` của shadcn.
- Font: `@fontsource` tự host. Mọi font phải có subset `vietnamese` (xem `design-system.md`).
- Format: `prettier` (`.prettierrc`; bỏ qua `src/components/ui/` và `*.md`, vì Prettier biến dòng `@import` trong `CLAUDE.md` thành trích dẫn và làm mất rule). Lint: `oxlint` (mặc định của template `create-vite` 9; bỏ qua `src/components/ui/`).
- Class name: `cn` (gói chính chủ của shadcn, thay `clsx` + `tailwind-merge`), import qua `@/lib/utils`.

## Hiệu ứng: chỉ dùng thư viện bên thứ ba, không tự chế
Chủ dự án yêu cầu ngày 2026-09-24: hiệu ứng lấy từ thư viện hoặc registry có sẵn, không tự viết animation hay tự vẽ hình trang trí.
- Hiệu ứng UI: component của registry shadcn bên thứ ba, khai báo trong `components.json` (`@magicui`, `@react-bits`, `@motion-primitives`, `@aceternity`), thêm bằng `npx shadcn@latest add @<registry>/<tên>` hoặc shadcn MCP. Đang dùng: `@magicui/blur-fade` (hiện dần), `@magicui/noise-texture` (vân giấy).
- Hoa rơi: tsParticles (`@tsparticles/react` + `basic`, `shape-image`, `updater-rotate`, `updater-tilt`, `updater-wobble`). Không dùng `@tsparticles/slim` (kèm hơn chục tương tác chuột không cần).
- Ảnh trang trí: bộ Fluent Emoji 3D của Microsoft (MIT), ghi nguồn trong `LICENSE.txt` cạnh ảnh.
- Chuyển động còn lại (parallax, cuộn) dùng API của Motion (`motion/react`), không tự viết vòng lặp `requestAnimationFrame` hay keyframes CSS.
- Không sửa file vendor trong `src/components/ui/`; cần khác đi thì bọc lại hoặc truyền props.
- `@tsparticles/react` bản 4 dùng `ParticlesProvider` + `Particles`; tài liệu Context7 vẫn ghi `initParticlesEngine` của bản 3, đừng làm theo.

## Rules
- Không thêm thư viện ngoài danh sách khi chưa so sánh best practice qua Context7 và cập nhật file này.
- Khóa phiên bản bằng `package-lock.json`; nâng major phải ghi lý do. Phiên bản cụ thể lấy theo bản ổn định mới nhất lúc scaffold (task 001), không đoán từ trí nhớ.
- Không thêm state manager toàn cục (Redux, Zustand...): dữ liệu server đã có react-query, phần còn lại là state cục bộ.

## Ghi chú từ tra cứu tài liệu (2026-09-24)
- Key Supabase phía client là **publishable key** (`sb_publishable_...`), thay cho tên "anon key" cũ. Key legacy `anon` và `service_role` chạy song song đến hết 2026. Nguồn: supabase.com/docs/guides/getting-started/migrating-to-new-api-keys.
- Project Supabase Free bị **tạm dừng sau 7 ngày không hoạt động**; khôi phục được trong 90 ngày. Nguồn: supabase.com/docs/guides/platform/free-project-pausing. Xem task 009 về cách giữ hoạt động.
- Cloudflare hiện khuyến nghị **Workers static assets** cho dự án mới (developers.cloudflare.com/pages/migrations/). Chủ dự án chọn Pages để có `*.pages.dev`; nếu không tạo được project Pages mới, hỏi lại chủ dự án trước khi chuyển sang Workers (tên miền sẽ là `*.workers.dev`).
- Pages tự phục vụ `index.html` cho route không khớp (SPA) **chỉ khi không có `404.html`** trong `dist/`. Không thêm `404.html`, để `/admin` mở trực tiếp được.
- shadcn với Vite và Tailwind v4: alias `@/` phải khai báo ở cả `vite.config.ts` và `tsconfig.app.json`. Nguồn: ui.shadcn.com/docs/installation/vite.
