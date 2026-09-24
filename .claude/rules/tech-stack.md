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
- Tải lười (`React.lazy`) mọi phần nặng nằm dưới màn hình đầu: `AdminPage`, `Countdown` (lịch), `Rsvp` (react-hook-form + zod), `PetalsFall` (tsParticles), lightbox (`LazyLightbox`). Bundle chính ngày 2026-09-24: 173KB gzip.
- Routing: `react-router` (chế độ khai báo, `BrowserRouter`), chỉ hai nhóm route: `/` và `/admin`.
- Dữ liệu từ server: `@tanstack/react-query`.
- Form và kiểm tra dữ liệu: `react-hook-form` + `zod` + `@hookform/resolvers`.
- Supabase: `src/lib/supabase.ts` là nơi duy nhất tạo client, gồm hai loại. `publicDb` (`@supabase/postgrest-js`, chỉ RPC công khai của khách) nằm trong bundle chính; `getAdminClient()` tải lười `@supabase/supabase-js` v2 (có Auth) cho trang admin. Lý do: supabase-js luôn kèm Auth, Realtime, Storage (khoảng 50KB gzip) mà khách không cần; postgrest-js tự khuyến nghị import độc lập cho môi trường cần bundle nhẹ.
- Icon: `lucide-react`. Toast: `sonner`. Lịch tháng: component `calendar` của shadcn.
- Font: `@fontsource` tự host. Mọi font phải có subset `vietnamese` (xem `design-system.md`).
- Format: `prettier` (`.prettierrc`; bỏ qua `src/components/ui/` và `*.md`, vì Prettier biến dòng `@import` trong `CLAUDE.md` thành trích dẫn và làm mất rule). Lint: `oxlint` (mặc định của template `create-vite` 9; bỏ qua `src/components/ui/`).
- Class name: `cn` (gói chính chủ của shadcn, thay `clsx` + `tailwind-merge`), import qua `@/lib/utils`.

## Hiệu ứng: chỉ dùng thư viện bên thứ ba, không tự chế
Chủ dự án yêu cầu ngày 2026-09-24: hiệu ứng lấy từ thư viện hoặc registry có sẵn, không tự viết animation hay tự vẽ hình trang trí.
- Hiệu ứng UI: component của registry shadcn bên thứ ba, khai báo trong `components.json` (`@magicui`, `@react-bits`, `@motion-primitives`, `@aceternity`), thêm bằng `npx shadcn@latest add @<registry>/<tên>` hoặc shadcn MCP. Đang dùng: `@react-bits/FlipCard-TS-TW` (`src/components/ui/flip-card.tsx`, ảnh bìa lật như bưu thiếp, theo mẫu "Notes from the roadmap" của diabrowser.com; kích thước ghi đè bằng biến `--fc-w`, `--fc-h`, `--fc-radius` kèm `!`), `@magicui/blur-fade` (hiện dần), luôn gọi qua `src/components/effects/Reveal.tsx` (bỏ blur, chỉ opacity + transform). Vân giấy là ảnh nền SVG lát ô 160px trong `src/index.css`, cùng thông số `@magicui/noise-texture`; không dùng lại component SVG phủ màn hình (iPhone vẽ lại mỗi lần cuộn, giật).
- Hoa rơi: tsParticles (`@tsparticles/react` + `basic`, `shape-image`, `updater-rotate`, `updater-tilt`, `updater-wobble`). Không dùng `@tsparticles/slim` (kèm hơn chục tương tác chuột không cần).
- Ảnh trang trí: bộ Fluent Emoji 3D của Microsoft (MIT), ghi nguồn trong `LICENSE.txt` cạnh ảnh.
- Chuyển động còn lại (parallax, cuộn) dùng API của Motion (`motion/react`), không tự viết vòng lặp `requestAnimationFrame` hay keyframes CSS.
- `npx shadcn add` có thể tự hạ `motion` về bản mà component khai báo (FlipCard khai `motion@^12` đã hạ 13 xuống 12): xem `git diff package.json` sau mỗi lần add, khôi phục nếu bị đổi.
- Không sửa file vendor trong `src/components/ui/`; cần khác đi thì bọc lại hoặc truyền props.
  Ngoại lệ duy nhất: sửa tối thiểu để file vendor biên dịch được, gắn chú thích `// PATCH (quanglinhvlogs): <lý do>` để `grep -rn "PATCH (quanglinhvlogs)" src/components/ui` liệt kê được. Hiện có: `sliding-number.tsx` (`as const` cho `TRANSITION`).
- `@tsparticles/react` bản 4 dùng `ParticlesProvider` + `Particles`; tài liệu Context7 vẫn ghi `initParticlesEngine` của bản 3, đừng làm theo.

## Nhạc nền
- Đang dùng "Nơi Này Có Anh" (Sơn Tùng M-TP), chủ dự án tự cung cấp file ngày 2026-09-24. Bài có bản quyền: Claude không tự tải nhạc có bản quyền từ mạng; file gốc để ở `assets-src/`, bản nén AAC 96kbps (`afconvert -f m4af -d aac -b 96000`) ở `public/audio/noi-nay-co-anh.m4a` và **bị `.gitignore`**, chỉ có trong bản deploy từ máy chủ dự án. Clone repo sang máy khác thì thiếu file: đổi `WEDDING.music.src` về `/audio/canon-in-d.m4a` (public domain) hoặc chép file vào.
- Thẻ `<audio>` giữ `preload="none"`: chỉ tải khi khách bấm "Mở thiệp".

## Rules
- Không thêm thư viện ngoài danh sách khi chưa so sánh best practice qua Context7 và cập nhật file này.
- Khóa phiên bản bằng `package-lock.json`; nâng major phải ghi lý do. Phiên bản cụ thể lấy theo bản ổn định mới nhất lúc scaffold (task 001), không đoán từ trí nhớ.
- Không thêm state manager toàn cục (Redux, Zustand...): dữ liệu server đã có react-query, phần còn lại là state cục bộ.

## Ghi chú từ tra cứu tài liệu (2026-09-24)
- Key Supabase phía client là **publishable key** (`sb_publishable_...`), thay cho tên "anon key" cũ. Key legacy `anon` và `service_role` chạy song song đến hết 2026. Nguồn: supabase.com/docs/guides/getting-started/migrating-to-new-api-keys.
- Project Supabase Free bị **tạm dừng sau 7 ngày không hoạt động**; khôi phục được trong 90 ngày. Nguồn: supabase.com/docs/guides/platform/free-project-pausing. Đã xử lý ở task 009 theo mẫu dự án `tinhtiendien`: bảng `system_heartbeat` + RPC `keepalive_ping()` (chỉ cập nhật mốc thời gian), gọi mỗi ngày bởi routine Claude Code `quanglinhvlogs-supabase-keepalive` (`trig_0115WvpXr8VEP9jubxSjZjWQ`, cron `17 20 * * *` UTC, tức 03:17 giờ Việt Nam). Thành công là HTTP 204. Kiểm tra: `select pinged_at from public.system_heartbeat` phải trong vòng 24 giờ.
- Cloudflare hiện khuyến nghị **Workers static assets** cho dự án mới (developers.cloudflare.com/pages/migrations/). Chủ dự án chọn Pages để có `*.pages.dev`; nếu không tạo được project Pages mới, hỏi lại chủ dự án trước khi chuyển sang Workers (tên miền sẽ là `*.workers.dev`).
- Pages tự phục vụ `index.html` cho route không khớp (SPA) **chỉ khi không có `404.html`** trong `dist/`. Không thêm `404.html`, để `/admin` mở trực tiếp được.
- shadcn với Vite và Tailwind v4: alias `@/` phải khai báo ở cả `vite.config.ts` và `tsconfig.app.json`. Nguồn: ui.shadcn.com/docs/installation/vite.
