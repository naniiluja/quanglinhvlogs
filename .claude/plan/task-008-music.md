# Task 008: Nhạc nền

- **Vertical slice:** UI (không chạm DB)
- **Depends on:** 007
- **Spec refs:** `design-system.md` (mục Nhạc nền), `state-management.md` (`MusicProvider`), `product.md`, `component-design.md`
- **MCP to use:** context7 (Motion), claude-in-chrome
- **Gate (phải XANH trước khi sang lát kế):** cổng chung; nhạc phát sau khi bấm "Mở thiệp", nút bật tắt luôn phản ánh đúng thực tế; đã thử trên điện thoại thật (chủ dự án thử, Claude không có thiết bị)

## Goal (một câu)
Nhạc nền phát khi khách bấm "Mở thiệp" và khách bật hoặc tắt được bất cứ lúc nào, đúng theo chính sách tự phát của trình duyệt.

## Acceptance criteria (verifiable)
- [ ] **Hỏi chủ dự án chọn bài nhạc trước khi làm.** Nhạc có bản quyền trên trang công khai có rủi ro; đề xuất dùng bài miễn phí bản quyền hoặc bài chủ dự án chịu trách nhiệm. Ghi nguồn và giấy phép ở chú thích trong `src/config/wedding.ts`.
- [ ] File âm thanh nằm trong `public/audio/`, dung lượng tối đa khoảng 2MB (chỉ tiêu đề xuất); thẻ `<audio>` dùng `preload="none"` để không tốn dữ liệu cho tới khi khách bấm "Mở thiệp".
- [ ] `MusicProvider` là context duy nhất của phần nhạc (theo `state-management.md`); `audio.play()` chỉ được gọi trong handler của nút "Mở thiệp" hoặc của nút bật nhạc, và Promise bị từ chối được bắt.
- [ ] Nút nổi bật hoặc tắt nhạc luôn hiện, có `aria-label` tiếng Việt, vùng bấm tối thiểu 44x44px; biểu tượng và trạng thái phản ánh đúng thực tế (Promise bị từ chối thì hiện trạng thái tắt, không hiện "đang phát").
- [ ] Nhạc lặp lại, âm lượng vừa phải; tạm dừng khi trang bị ẩn (`visibilitychange`) và tự phát lại khi quay lại **chỉ nếu** khách chưa tắt.
- [ ] Nếu khách bấm "Mở thiệp" khi nhạc lỗi tải: thiệp vẫn mở bình thường, không hiện lỗi làm cản trở.

## Verification (thay cho "test first", vì dự án không có test tự động)
- `npm run lint && npm run build` xanh.
- Claude in Chrome: tải trang và xác nhận **không** có tiếng trước khi bấm gì; bấm "Mở thiệp" thì nhạc phát; bấm nút tắt thì dừng và biểu tượng đổi; chuyển sang tab khác thì nhạc dừng, quay lại thì phát lại nếu chưa tắt; console sạch.
- Chủ dự án thử trên iOS Safari và Chrome Android thật (và trong trình duyệt của Zalo nếu có), báo lại kết quả. Báo cáo tra cứu chưa xác minh chi tiết iOS Safari nên đây là bước bắt buộc, Claude không tự kết luận là ổn.

## Files to touch
- `public/audio/`: file nhạc.
- `src/features/invitation/MusicProvider.tsx`, `src/features/invitation/MusicToggle.tsx`: context và nút.
- `src/features/invitation/Cover.tsx`: nút "Mở thiệp" gọi phát nhạc.
- `src/routes/InvitationPage.tsx`: bọc provider và gắn nút.
- `src/config/wedding.ts`: đường dẫn nhạc, nguồn và giấy phép.

## Steps (lát cắt mỏng xuyên suốt)
1. Hỏi chủ dự án chọn bài; nếu chưa có, dùng nhạc giữ chỗ miễn phí bản quyền có ghi nguồn.
2. Dựng `MusicProvider`, nút bật tắt, nối vào nút "Mở thiệp".
3. Chạy cổng kiểm chứng; nhờ chủ dự án thử trên điện thoại thật; đánh dấu task `in-review` (KHÔNG phải `done`).
4. `/ccf:check`, sau đó `/ccf:updatespec`: `done` chỉ được ghi ở đây, sau khi review qua.

## Notes / best-practice sources
- Chính sách autoplay: developer.chrome.com/blog/autoplay (có tiếng chỉ phát sau tương tác của người dùng).
- iOS Safari còn chặt hơn Chrome; xử lý Promise bị từ chối là bắt buộc.
