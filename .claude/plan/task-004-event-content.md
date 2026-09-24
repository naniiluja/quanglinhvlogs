# Task 004: Nội dung sự kiện: cô dâu chú rể, đếm ngược, lịch, địa điểm

- **Vertical slice:** UI + config (không chạm DB)
- **Depends on:** 003
- **Spec refs:** `product.md` (Thứ tự các phần, Dữ liệu mock), `design-system.md`, `component-design.md`, `frontend-conventions.md`, `architecture.md`
- **MCP to use:** context7 (Motion, react-day-picker), shadcn (component `calendar`), claude-in-chrome (đối chiếu nhịp bố cục với mẫu ngaychungdoi.com, không sao chép)
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; đếm ngược đúng múi giờ +07:00 và không hiện số âm sau giờ cưới; bấm địa điểm mở đúng liên kết Google Maps

## Goal (một câu)
Hoàn thiện phần thân của thiệp (lời mời, gia đình, cô dâu chú rể, lễ cưới, đếm ngược và lịch, lịch trình, địa điểm) với dữ liệu mock gom ở một chỗ, có chuyển động khi cuộn.

## Acceptance criteria (verifiable)
- [ ] `src/config/wedding.ts` chứa toàn bộ nội dung sự kiện có kiểu rõ ràng: ngày giờ cưới (chuỗi ISO có `+07:00`), tên hai người, tên cha mẹ hai bên, đoạn giới thiệu ngắn, lịch trình, địa điểm (tên, địa chỉ). Mỗi giá trị mock có chú thích `// MOCK`.
- [ ] Các section 2 đến 8 trong `product.md` đều có mặt theo đúng thứ tự: Lời mời, Gia đình hai bên, Chú rể và cô dâu, Lễ cưới, Đếm ngược và lịch tháng, Lịch trình, Địa điểm.
- [ ] Chú rể và cô dâu có tên, ảnh (cắt từ ảnh gốc, hoặc ảnh giữ chỗ có nhãn nếu chưa có ảnh riêng của từng người) và vài dòng giới thiệu mock.
- [ ] Hàm thuần `src/lib/countdown.ts` tính ngày, giờ, phút, giây còn lại tới thời điểm cưới; component cập nhật mỗi giây và **dọn interval khi unmount**; sau thời điểm cưới hiển thị lời cảm ơn thay vì số âm.
- [ ] Lịch tháng (component `calendar` của shadcn) khoanh đúng ngày cưới, chỉ để xem, không chọn được ngày khác.
- [ ] Bấm địa điểm mở `https://www.google.com/maps/search/?api=1&query=<địa chỉ đã mã hóa>` trong tab mới với `rel="noopener noreferrer"`. Hàm thuần `buildMapsUrl` ở `src/lib/maps.ts` mã hóa đúng địa chỉ tiếng Việt có dấu, dấu phẩy và khoảng trắng.
- [ ] Hiện dần khi cuộn (`whileInView`, `once: true`), parallax nhẹ ở một hai chỗ chọn lọc; bật `prefers-reduced-motion` thì tắt parallax mà nội dung vẫn hiện đủ.
- [ ] Bố cục không vỡ ở 320px, 390px và 1280px; không cuộn ngang.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh.
- Đếm ngược: đặt tạm ngày cưới về quá khứ và xác nhận thấy lời cảm ơn, không thấy số âm; đặt tạm sang một ngày trong tương lai gần và đối chiếu số giây đếm giảm đều; khôi phục giá trị mock sau khi thử.
- Bấm địa điểm trong trình duyệt, xác nhận URL mở đúng và Google Maps hiển thị đúng địa chỉ mock; thử một địa chỉ có dấu và dấu phẩy.
- Claude in Chrome ở 320, 390, 1280; console sạch; giả lập giảm chuyển động.

## Files to touch
- `src/config/wedding.ts`: nội dung sự kiện.
- `src/lib/countdown.ts`, `src/lib/maps.ts`: hàm thuần.
- `src/features/invitation/`: `Invitation.tsx`, `Family.tsx`, `Couple.tsx`, `Event.tsx`, `Countdown.tsx`, `Timeline.tsx`, `Venue.tsx`: các section.
- `src/components/effects/Reveal.tsx`: bọc hiện dần khi cuộn dùng chung.
- `src/components/ui/calendar.tsx`: do shadcn thêm.
- `public/images/`: ảnh cô dâu chú rể đã cắt.
- `src/routes/InvitationPage.tsx`: ghép các section.

## Steps (lát cắt mỏng xuyên suốt)
1. Thêm component `calendar` bằng shadcn MCP hoặc `npx shadcn@latest add calendar`.
2. Viết `wedding.ts` và hai hàm thuần; chạy cổng kiểm chứng riêng cho từng hàm bằng kiểm tra tay (không có test tự động).
3. Dựng từng section theo thứ tự; xem lại mẫu ngaychungdoi.com bằng Claude in Chrome để học nhịp và khoảng thở, **không chép chữ, hình hay mã**.
4. Chạy cổng kiểm chứng; đánh dấu task `in-review` (KHÔNG phải `done`).
5. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Motion: `whileInView`, `useScroll`, `useTransform`, `useReducedMotion` từ `motion/react` (motion.dev/docs/react-scroll-animations, Context7 `/websites/motion_dev`).
- Google Maps URL: developers.google.com/maps/documentation/urls/get-started (`search/?api=1&query=`, thêm `query_place_id` khi có mã địa điểm để chính xác hơn).
- Việt Nam không dùng giờ mùa hè nên độ lệch cố định `+07:00` là đủ.
