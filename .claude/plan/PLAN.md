# Implementation Plan: quanglinhvlogs (thiệp cưới Quang Linh và Thanh Trúc)

> **Quy tắc thực thi: TUẦN TỰ NGHIÊM NGẶT + LÁT CẮT DỌC.** Làm đúng một task một lúc, theo thứ tự.
> Mỗi task là một đường xuyên thẳng qua mọi lớp nó chạm (DB, service, UI), không chia thành "xong hết DB rồi mới tới API", để tích hợp được chứng minh sớm.
> Không bắt đầu task N+1 khi **cổng của task N chưa xanh** (đã implement, đã qua cổng kiểm chứng, đã `/ccf:check`).
> Trạng thái `in-progress` và `in-review` được hook đầu phiên đọc để nạp lại ngữ cảnh sau khi compact, nên luôn giữ trạng thái đúng.

## Cổng kiểm chứng chung
Dự án **không có test tự động** (quyết định của chủ dự án, xem `.claude/rules/testing.md`). Cổng của mọi task gồm:
1. `npm run lint` và `npm run build` qua.
2. Kiểm tra tay bằng Claude in Chrome ở 390x844 và 1280: không cuộn ngang, chữ có dấu đúng, console sạch, đi hết luồng của task.
3. Task chạm DB: `get_advisors` (security) không có mức ERROR, thử RPC bằng vai trò `anon` với đầu vào đúng, sai và biên.

Cột "Gate" bên dưới chỉ ghi phần **riêng** của từng task, cộng thêm cổng chung.

## Milestones
- M1 Nền tảng: task 001.
- M2 Lõi của thiệp: task 002 đến 005 (bìa theo khách, RSVP, nội dung sự kiện, album và mừng cưới).
- M3 Quản trị và tương tác: task 006 đến 007 (admin, sổ lưu bút).
- M4 Hoàn thiện: task 008 đến 009 (nhạc nền, phát hành).

> Trạng thái: `todo` / `in-progress` / `in-review` / `done` / `blocked`. Vòng đời: `todo`, `in-progress`, `in-review`, `done`. Mỗi task được implement trực tiếp trong session (không giao cho subagent viết code); session đánh dấu `in-review` khi code và cổng kiểm chứng xong; chỉ `/ccf:updatespec` ghi `done` sau khi `/ccf:check` qua.
> Ghi trạng thái là một từ trần, không bọc `**đậm**`: nhấn mạnh không mang thông tin và trạng thái được khớp theo nguyên từ.
> Chi tiết từng task nằm ở `task-NNN-*.md`.

> **Giữ file này ở lượt HIỆN TẠI.** Khi mọi task của một lượt đã `done`, `/ccf:updatespec` chuyển nguyên văn các mục sang `.claude/plan/ARCHIVE.md` và `git mv` các file `task-NNN-*.md` sang `.claude/plan/archive/`. Hàng đã đóng còn nằm lại ở đây sẽ bị hook đầu phiên và Stop hook tính là việc đang làm, còn XÓA sẽ mất bản ghi thật về những gì đã ship và vì sao. Vậy nên lưu trữ, không xóa.

<!-- Giữ phần hướng dẫn trạng thái Ở TRÊN dòng này, không bao giờ nằm dưới "## Origin": việc lưu trữ cắt nội dung từ một heading "## Origin" tới heading kế, và chỉ phần trước heading đầu tiên là không bao giờ bị cắt vào ARCHIVE.md. -->

## Origin: Phát hành thiệp cưới v1
<!-- Lượt đầu tiên do /ccf:init lập: từ dự án trống tới thiệp chạy thật trên pages.dev -->

## Task backlog (theo thứ tự thực thi)
| # | Slice | Layers | Gate (riêng của task) | Depends on | Status |
|---|-------|--------|-----------------------|-----------|--------|
| 001 | Nền tảng, theme và deploy | build + UI + hosting | Trang giữ chỗ có hoa rơi chạy trên `*.pages.dev`, `/admin` mở trực tiếp không 404, "Thanh Trúc" đủ dấu ở cả ba font | không có | blocked |
| 002 | Link riêng của khách và bìa thiệp | DB + service + UI | `/?g=<mã>` hiện đúng tên; mã sai và không mã hiện giống nhau; anon không đọc được bảng `guests` | 001 | in-review |
| 003 | Xác nhận tham dự (RSVP) | DB + service + UI | Gửi, sửa, gửi lại vẫn một hàng; biên `party_size` 0, 1, 5, 6 và `message` 500, 501 đúng | 002 | in-review |
| 004 | Nội dung sự kiện: cô dâu chú rể, đếm ngược, lịch, địa điểm | UI + config | Đếm ngược đúng múi giờ +07:00 và hết giờ không âm; bấm địa điểm mở đúng link Google Maps | 003 | in-review |
| 005 | Album ảnh và mừng cưới QR | UI + config | Lightbox chạy; ảnh QR VietQR hiện, sao chép số tài khoản, có dự phòng khi ảnh lỗi | 004 | in-progress |
| 006 | Trang admin: đăng nhập, khách, thống kê | DB + service + UI | Người không phải admin (kể cả `authenticated`) bị RLS từ chối; thêm, sửa, xóa, sao chép link chạy | 005 | todo |
| 007 | Sổ lưu bút | DB + service + UI | Giới hạn 3 lời chúc mỗi khách và 500 ký tự đúng; admin xóa được lời chúc | 006 | todo |
| 008 | Nhạc nền | UI | Nhạc phát sau khi bấm "Mở thiệp", nút bật tắt phản ánh đúng thực tế; thử trên điện thoại thật | 007 | todo |
| 009 | Hoàn thiện và phát hành | UI + DB + hosting | Meta chia sẻ đúng, Lighthouse mobile được ghi lại, dữ liệu `[TEST]` đã dọn, luồng đầy đủ chạy qua Zalo trên điện thoại thật | 008 | todo |

## Rủi ro đã biết
- **Supabase Free tạm dừng sau 7 ngày không hoạt động**: thiệp sẽ hỏng nếu project bị pause. Xử lý ở task 009.
- **Cloudflare khuyến nghị Workers thay cho Pages** cho dự án mới: nếu không tạo được project Pages, hỏi chủ dự án trước khi đổi tên miền sang `*.workers.dev` (task 001).
- **Nhạc nền có bản quyền**: bài nhạc nổi tiếng trên trang công khai có rủi ro bản quyền; ưu tiên nhạc miễn phí bản quyền hoặc bài do chủ dự án chịu trách nhiệm (task 008).
- **Ảnh gốc có chữ "Lễ dạm ngõ" và ngày `20.09.2026`** chồng lên người cô dâu; khi cắt có thể phải cắt sát hơn dự tính (task 002).
- **Xem trước link trên Zalo hoặc Facebook** không thể riêng cho từng khách vì web tĩnh (task 009).
