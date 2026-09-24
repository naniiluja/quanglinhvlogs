# Task 009: Hoàn thiện và phát hành

- **Vertical slice:** UI + DB (dọn dữ liệu thử) + hosting (deploy cuối, giữ project Supabase hoạt động)
- **Depends on:** 008
- **Spec refs:** `product.md` (Chia sẻ link, Dữ liệu mock), `design-system.md` (Ảnh), `security.md`, `tech-stack.md` (Ghi chú tra cứu), `git-workflow.md`
- **MCP to use:** supabase (`execute_sql` chỉ đọc rồi xóa dữ liệu thử khi chủ dự án đồng ý, `get_advisors`), cloudflare, claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; thẻ chia sẻ đúng, điểm Lighthouse mobile được ghi lại, dữ liệu thử đã dọn, luồng đầy đủ chạy qua Zalo trên điện thoại thật

## Goal (một câu)
Đưa thiệp tới trạng thái sẵn sàng gửi cho khách: xem trước link đẹp, hiệu năng và khả năng truy cập được đo, dữ liệu thử đã dọn, phần còn mock được liệt kê rõ và project Supabase không bị tạm dừng.

## Acceptance criteria (verifiable)
- [ ] `index.html` có thẻ Open Graph và Twitter (tiêu đề, mô tả tiếng Việt, ảnh chia sẻ 1200x630 cắt từ ảnh gốc, không chứa chữ "dạm ngõ"), `theme-color`, favicon. Ghi rõ trong báo cáo rằng bản xem trước là chung cho cả trang, không riêng từng khách.
- [ ] Đo Lighthouse mobile cho `/` (Chrome DevTools hoặc `npx lighthouse`) và ghi điểm vào thân PR. Mục tiêu đề xuất: Performance từ 85, Accessibility từ 90; điểm thấp hơn thì ghi nguyên nhân và cách đã xử lý (ảnh, font, JavaScript) chứ không giấu.
- [ ] Rà lại: `prefers-reduced-motion` tắt hoa rơi và parallax; tương phản chữ thân bài từ 4.5:1; điều hướng bàn phím thấy focus; mọi ảnh có `alt`.
- [ ] Đo lại dung lượng ảnh so với chỉ tiêu trong `design-system.md` (bìa tối đa 250KB, album tối đa 150KB mỗi tấm) và nén lại nếu vượt.
- [ ] Dọn dữ liệu thử: ngày 2026-09-24 chủ dự án muốn nội dung thử dễ thương hơn nên tên đã bỏ tiền tố `[TEST]`; nhận diện bằng ID: khách `566758ab-b897-41dd-bdc7-04f7d8a7f3a1` ("Anh Nam đẹp trai", mã `6cHZQ0-8oEBwWWFU`) và `ac9485b1-8799-4f67-bdfb-9a527fecd834` ("Chị Lan xinh gái và gia đình", mã `nVB-Y2OmvgzMpO8M`), cùng RSVP và lời chúc của hai khách này (xóa khách là cascade). Liệt kê bằng truy vấn chỉ đọc, đưa cho chủ dự án, chỉ xóa sau khi chủ dự án đồng ý.
- [ ] `grep -n "MOCK" src` liệt kê phần còn mock; đưa danh sách cho chủ dự án (ngày giờ, địa điểm, cha mẹ, lịch trình, tài khoản mừng cưới, ảnh từng người) và thay bằng dữ liệu thật nếu đã có. **Quét thử mã QR bằng ứng dụng ngân hàng** chỉ sau khi tài khoản thật được cung cấp.
- [ ] Giữ project Supabase Free không bị tạm dừng sau 7 ngày: đưa cho chủ dự án hai phương án (một: workflow GitHub Actions gọi một RPC nhẹ mỗi ngày; hai: chủ dự án tự mở dashboard định kỳ) và **hỏi trước** khi tạo `.github/workflows/` trong repo công khai.
- [ ] `grep -rn "service_role\|sb_secret" .` (bỏ `node_modules`) không có kết quả; không có `.env` nào nằm trong thay đổi sắp push.
- [ ] Deploy bản cuối lên `*.pages.dev` (biến build đã đặt), mở `/admin` trực tiếp vẫn chạy.
- [ ] Luồng đầy đủ trên điện thoại thật qua Zalo: mở link riêng của một khách, thấy tên, nghe nhạc sau khi bấm "Mở thiệp", cuộn qua các phần, bấm địa điểm mở Google Maps, xem QR, viết lời chúc, gửi RSVP, mở lại thấy dữ liệu còn nguyên. Chủ dự án thực hiện và báo lại.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh; `get_advisors` (security) không có ERROR.
- Dán link vào công cụ xem trước của Facebook (Sharing Debugger) hoặc Zalo và đối chiếu tiêu đề, mô tả, ảnh.
- Ghi lại kết quả từng mục trên; mục nào chưa làm được ghi rõ là chưa làm, không báo xanh.

## Files to touch
- `index.html`: Open Graph, `theme-color`, favicon.
- `public/images/og.jpg`, `public/favicon.*`: ảnh chia sẻ và biểu tượng.
- `public/images/**`: nén lại nếu vượt chỉ tiêu.
- `src/config/wedding.ts`: thay dữ liệu mock bằng dữ liệu thật nếu đã có.
- `.github/workflows/keepalive.yml`: chỉ khi chủ dự án chọn phương án một.

## Steps (lát cắt mỏng xuyên suốt)
1. Thêm thẻ chia sẻ và ảnh; đo Lighthouse; sửa các điểm yếu trong tầm tay.
2. Rà truy cập và chuyển động; đo và nén ảnh.
3. Trình chủ dự án danh sách `[TEST]` và `MOCK`; dọn và thay theo phản hồi.
4. Chốt phương án giữ project Supabase hoạt động.
5. Kiểm tra bí mật; hỏi chủ dự án trước khi commit và push; deploy bản cuối.
6. Chạy cổng kiểm chứng, nhờ chủ dự án thử trên điện thoại thật; đánh dấu task `in-review` (KHÔNG phải `done`).
7. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua; khi toàn bộ task `done`, `/ccf:updatespec` lưu lượt này vào `ARCHIVE.md`.

## Notes / best-practice sources
- Tạm dừng project Free: supabase.com/docs/guides/platform/free-project-pausing (cảnh báo qua email khoảng một tuần trước; vài request mỗi ngày là đủ để không bị dừng).
- Báo cáo tra cứu chưa kiểm chứng giới hạn tần suất của RPC trên gói Free; nếu lo bị dò mã hay spam, xem lại sau khi thiệp có lượng truy cập thật.
