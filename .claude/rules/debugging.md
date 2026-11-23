# Debugging (kỷ luật, không vội)

Quy trình bắt buộc khi điều tra lỗi, làm trực tiếp trong hội thoại (không có lệnh debug riêng):
1. **Tái hiện**: dựng lại lỗi từ triệu chứng, đầu vào, môi trường (thiết bị, trình duyệt trong Zalo hay Safari, link nào) trước khi chạm code.
2. **Lần theo từng bước**: theo correlation ID trong console, đọc log vào và ra ở mỗi ranh giới; phía DB dùng `query_logs` của Supabase MCP.
3. **Truy vấn DB chỉ đọc** (`execute_sql`, `list_tables`) để xác nhận trạng thái dữ liệu từng bước; không ghi dữ liệu khi đang điều tra.
4. **Khoanh vùng bằng bằng chứng**: file:line, dòng log, hàng dữ liệu, không bằng cảm tính.
5. **Ghi lại các bước tái hiện thủ công** (dự án không có test tự động, xem `testing.md`) trước khi sửa.
6. **Sửa tối thiểu**: chỉ sửa trong phạm vi, không tiện tay refactor.

> Không đoán rồi sửa ngay khi chưa có bằng chứng.

## Lỗi đã biết (cập nhật bởi /ccf:updatespec)
Mỗi mục ghi: triệu chứng, nguyên nhân gốc, cách phòng, file liên quan.
- **Lịch khoanh sai ngày theo bên mời**: khách một bên thấy cả 11 và 12 được khoanh. Gốc: `react-day-picker` giữ `selected` đầu tiên (lúc lời mời đang tải, `side` tạm là `both`) trong state nội bộ. Phòng: `key={side}` trên `Calendar`. File `src/features/invitation/Countdown.tsx`.
- **Supabase bị tạm dừng**: mọi RPC timeout, `get_project` báo `INACTIVE`. Gốc: không còn gì gọi API trong 7 ngày. Xử lý: `restore_project`, rồi kiểm cơ chế keepalive (xem `tech-stack.md`).
- **Album phải bấm hai lần mới mở ảnh**: chủ dự án báo 2026-11-23. Gốc: DriftWall đổi class `is-active` theo sự kiện con trỏ, Safari iOS coi lần chạm đầu là hover và không phát click; thêm nữa lightbox chỉ bắt đầu tải khi bấm nên mạng chậm trông như bấm chưa ăn. Phòng: `onTouchEnd` mở ảnh và `preventDefault` chặn click giả, `preloadLightbox` khi album vào màn hình. File `src/features/invitation/Gallery.tsx`, `src/components/effects/lightboxLoader.ts`.
- **Album vẫn không mở ảnh trên iPhone** (sau bản sửa `touchend`): WebKit hit-test theo vị trí trước phép xoay 3D của DriftWall, `event.target` là khung nền chứ không phải ô. Phòng: dò ô theo toạ độ chạm và `getBoundingClientRect` (`openAt` trong `Gallery.tsx`). Kiểm: bắn `pointerdown/up` vào `.drift-wall__plane` tại tâm một ô, lightbox phải mở đúng ảnh đó.
- **Vuốt trang chỉ chạy ở mấy trang đầu, sau đó trôi như cuộn thường**: trang cao hơn màn hình (Hai họ, Hôn lễ ở 375x553 và 360x640) được cuộn thường, trang bị lệch, `nextPage` chọn "trang có mép trên gần đỉnh nhất" nên trang nằm thấp có đáy thò ra bị tưởng là trang dài, mọi cú vuốt về sau đều nhường cuộn thường. Phòng: trang hiện tại là trang chứa mép trên màn hình, vuốt lên khi lệch thì căn lại đầu trang. Kiểm: vuốt giả lập hết thiệp (link khách có xe, lưu trú) ở 393x659, 375x553, 360x640, cả hai chiều.
- **Hôn lễ sang Ngày chung vui vẫn trôi như cuộn thường** (chủ dự án báo 2026-11-23): trang Hôn lễ hai lễ cao hơn màn (375x553, 360x640), hook nhường cuộn thường cho trang dài, quán tính kéo qua trang kế. Phòng: `nextStop` đi từng bước cả trong trang dài; thu gọn Hôn lễ, Hai họ, bìa để mọi section vừa 100svh (ngưỡng `short:` 650px). Kiểm: đo `section.height - viewport` bằng 0 rồi vuốt giả lập hết thiệp ở 393x659, 375x553, 360x640.
- **Album trên điện thoại: một ô lồi lên không hạ, cột đứng yên, có lúc ảnh biến mất** (chủ dự án báo 2026-11-23): hiệu ứng nhấc ô của DriftWall là hover (`pointermove` + `elementFromPoint`) và `onFocus`; ngón tay kích hover theo phép dò sai của WebKit, chạm làm ô `tabIndex=0` nhận focus, ô focus giữ `is-active` và dừng cả cột tới khi mất focus. Phòng: trong `Gallery.tsx` chặn `pointermove` không phải chuột ở pha capture, `onMouseDown` `preventDefault` để chạm không focus ô. Kiểm: bắn `pointermove` kiểu `touch` vào ô thì không có `.is-active`, kiểu `mouse` thì có; đóng lightbox xong các `.drift-wall__track` vẫn đổi `transform`.
