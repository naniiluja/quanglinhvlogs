# Coding Conventions

## Định dạng (kiểm tra được)
- Thụt lề 2 dấu cách.
- Formatter: chạy `npm run format` (Prettier) trước khi commit.
- Linter: `npm run lint` phải qua.
- TypeScript `strict`; không dùng `any` (dùng `unknown` rồi thu hẹp kiểu).
- Alias `@/` trỏ tới `src/`; import trong `src/` dùng alias, không dùng `../../..`.

## Đặt tên
- File component: `PascalCase.tsx`. Hook: `useXxx.ts`. File khác: `camelCase.ts`. File do shadcn sinh trong `src/components/ui/` giữ nguyên tên kebab-case.
- Biến và hàm: `camelCase`. Kiểu và interface: `PascalCase`. Hằng số cấp module: `SCREAMING_SNAKE_CASE`.
- Bảng và cột Postgres: `snake_case`, tên bảng số nhiều. Tham số hàm RPC có tiền tố `p_`.

## Cấu trúc file
- Một file tối đa khoảng 200 dòng; vượt thì tách.
- Thứ tự import: `react` và thư viện ngoài, rồi `@/...`, rồi đường dẫn tương đối, cuối cùng file CSS.

## Quy tắc chung
- Không có mã chết hay import thừa: mã chết vẫn tốn thời gian đọc và gây hiểu nhầm khi tìm kiếm; xóa đi, git giữ lịch sử.
- Chú thích bằng tiếng Việt có dấu; định danh (tên biến, hàm, file) bằng tiếng Anh.
- Quy tắc bắt buộc nằm Ở ĐÂY trong `.claude/rules` (subagent tự nạp); không chỉ để trong output style, vì output style chỉ tác động vòng lặp chính, không tới subagent.
