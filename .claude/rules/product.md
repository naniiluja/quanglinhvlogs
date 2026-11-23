# Product (hành vi đã chốt)

## Người dùng
- **Khách mời**: mở link riêng trên điện thoại, thường từ Zalo hoặc Facebook (trình duyệt trong ứng dụng). Thiết kế mobile trước, kiểm ở 390px.
- **Admin**: chủ dự án hoặc người được giao, đăng nhập ở `/admin`.

## Link riêng của khách
- Dạng `/?g=<code>`. `code` là mã ngẫu nhiên lưu ở bảng `guests`, tên hiển thị lấy từ `guests.display_name` (ví dụ "Anh Nam và gia đình").
- Không có `g`, hoặc mã sai: hiện thiệp chung ("Trân trọng kính mời quý khách"), **ẩn** form lời chúc, **ẩn hẳn** section RSVP và hộp mừng cưới, hiện một dòng nhắc mở đúng link được gửi riêng. Mã sai và không có mã hiển thị y hệt nhau, để không ai dò được mã hợp lệ.
- Đổi tên người nhận: sửa `display_name` trong `/admin`, không cần deploy lại.

## Bên mời (chủ dự án chốt 2026-11-23)
- Thiệp in có hai bản: nhà gái mời dự lễ vu quy (09:00 thứ Sáu 11/12/2026, tiệc 11:00, tư gia nhà gái), nhà trai mời dự lễ thành hôn (09:00 thứ Bảy 12/12/2026, tiệc 11:00, tư gia nhà trai). Nguồn: bản in chủ dự án gửi 2026-11-23, nằm trong `WEDDING.sides`.
- Mỗi khách có `guests.side` là `groom`, `bride` hoặc `both` (admin chọn). Khách một bên chỉ thấy lễ, đếm ngược, lịch, lịch trình, địa điểm của bên mình; khách nhà gái thấy tên cô dâu và nhà gái đứng trước. Link chung và mã sai thấy cả hai bên (`both`). Chọn nội dung theo bên qua `src/lib/sides.ts`.

## Đăng ký xe và lưu trú (chủ dự án chốt 2026-11-23)
- Hai quyền **riêng**: `can_register_transport`, `can_register_lodging`, admin tick từng khách. Không được tick thì khách không thấy section và RPC từ chối.
- Mỗi loại là một section sau RSVP: lịch trình do admin nhập (`logistics_items`: giờ, tiêu đề, địa điểm mở Google Maps hoặc link dán sẵn, người liên hệ bấm gọi), rồi form đăng ký: cần hay không, số người 1 đến 10, SĐT (bắt buộc khi cần), đêm nghỉ (lưu trú, chọn từ `WEDDING.lodgingNights`), ghi chú tối đa 300 ký tự. Gửi lại thì ghi đè.
- Mục lịch trình có `side`: khách một bên thấy mục của bên mình và mục "cả hai bên". SĐT người liên hệ chỉ nằm trong DB, không nằm trong repo công khai.

## Thứ tự các phần của thiệp
Tham khảo bố cục mẫu "Parallax lãng mạn" trên ngaychungdoi.com (chỉ học thứ tự và nhịp, **không sao chép chữ, hình, mã**):
1. Bìa: tên khách, tên hai người, nút "Mở thiệp". Ảnh bìa lật được: mặt sau là lời tâm sự "14 năm thương nhau" (`WEDDING.coverNote`) gửi đích danh khách.
2. Lời mời.
3. Gia đình hai bên (theo thiệp in, thứ tự theo bên mời).
4. Chú rể và cô dâu: tên, ảnh, vài dòng giới thiệu.
5. Lễ cưới: ngày, giờ.
6. Đếm ngược và lịch tháng khoanh ngày cưới.
7. Lịch trình trong ngày (suy ra từ giờ lễ và tiệc của từng bên).
8. Địa điểm: mỗi địa điểm một trang, có bản đồ đường xá nhúng (iframe `maps.google.com/maps?...&output=embed`, không cần API key, tắt thao tác để không giữ cuộn; bấm vào mở Google Maps) và nút "Chỉ đường" (`/maps/dir/?api=1&destination=`). Truy vấn ở `venue.mapsQuery`: Google chưa biết số nhà, "Thôn 2/Thôn 4" bị trỏ nhầm sang nơi khác, nên đang tạm dùng khu Buôn Cư D'Luê (nhà trai) và UBND xã Hòa Xuân (nhà gái), gắn `// MOCK` chờ chủ dự án gửi ghim Google Maps của từng nhà.
9. Album ảnh, xem phóng to: 30 ảnh hoàn chỉnh (Drive "Album Sửa Lần 1/hinh xong", sáu bộ ảnh xếp xen kẽ); chủ dự án bỏ ảnh dạm ngõ khỏi album (2026-11-23). Tường ảnh dùng bản nhỏ 420px (`/images/gallery/thumb/`), lightbox dùng bản 1000px (`/full/`, mỗi ảnh ≤ 150KB). Chạm một lần là mở: tự dò ô theo toạ độ `pointerup` so với `getBoundingClientRect` của từng ô (WebKit xác định phần tử bị chạm sai trên mặt phẳng 3D `preserve-3d`, và iOS nuốt click khi DriftWall đổi trạng thái hover), lightbox tải sẵn khi album vào màn hình, bấm nền tối là đóng.
10. Sổ lưu bút.
11. Mừng cưới: **một** mã QR VietQR và số tài khoản, **chỉ hiện với link mời riêng hợp lệ** (link chung và mã sai không thấy; chủ dự án chốt 2026-09-24).
12. Xác nhận tham dự (RSVP).
13. Xe đưa đón, rồi Lưu trú (chỉ khách được tick).
14. Lời cảm ơn.

## RSVP
- Trường: `attending` (có hoặc không), `party_size` từ 1 đến 5 (chỉ hỏi khi tham dự), `message` tùy chọn tối đa 500 ký tự.
- Mỗi khách đúng một bản ghi. Gửi lại thì **ghi đè** bản cũ, khách được đổi ý.
- Vào lại link thì form hiện sẵn câu trả lời đã gửi.

## Sổ lưu bút
- Chỉ khách có mã hợp lệ mới viết được. Tên tác giả lấy từ `guests.display_name`, khách không tự gõ tên, để không giả mạo người khác.
- Tối đa 500 ký tự mỗi lời chúc; tối đa 3 lời chúc mỗi khách (mặc định đề xuất, đổi được khi chủ dự án muốn).
- Ai mở thiệp cũng đọc được danh sách. Admin xóa được lời chúc không phù hợp.

## Dữ liệu mock và dữ liệu thật
- Tên thật: chú rể **Vũ Quang Linh** (Quý nam), cô dâu **Đào Thanh Trúc** (Trưởng nữ). Ngày giờ, địa điểm, tên cha mẹ là thật theo thiệp in (2026-11-23). Còn mock: lời giới thiệu hai người, tài khoản ngân hàng.
- Mọi giá trị mock trong `src/config/wedding.ts` có chú thích `// MOCK` để `grep -n "MOCK" src` liệt kê hết những gì còn phải thay.
- Ngày `20.09.2026` trên bảng "Lễ dạm ngõ" trong ảnh là ngày dạm ngõ đã qua, **không** dùng làm ngày cưới.
- Tài khoản ngân hàng mock phải ghi rõ là mock, không dùng số thật khi chủ dự án chưa xác nhận (repo công khai).

## Ảnh
- Ảnh gốc: `assets-src/dam-ngo-goc.jpg` (1536x2048, chú rể và cô dâu bên bảng dạm ngõ). Không commit ảnh gốc.
- Ảnh cưới (Nikon 4024x6048) chủ dự án gửi qua Drive ngày 2026-11-23 (thư mục cha "Album Sửa Lần 1": `hinh xong` là 30 ảnh hoàn chỉnh, chứa trọn `13x18 - lua` và `2 60x90 go`; `Album 24.10.26…` là trang sách ảnh đã dàn, `chỉnh tóc` là ảnh mẫu thử, không dùng), gốc ở `assets-src/drive-2026-11-23/` (không commit): DSC_4438 làm ảnh bìa và ảnh chia sẻ `og-wedding.jpg` (đổi tên để Zalo, Facebook không dùng ảnh cũ đã lưu đệm), DSC_4705 cắt chân dung chú rể và cô dâu, cả ba vào album trước ảnh dạm ngõ.
- Bản đã cắt và nén đặt trong `public/images/`. Cắt sao cho khung ảnh không chứa chữ "Lễ dạm ngõ" hay ngày `20.09.2026`.

## Ngôn ngữ
- Toàn bộ chữ hiển thị là tiếng Việt có dấu. Không viết tiếng Việt không dấu trong giao diện.

## Chia sẻ link
- Thẻ Open Graph (xem trước khi dán vào Zalo, Facebook) là thẻ chung của cả trang, đặt tĩnh trong `index.html`. Web tĩnh không tạo được bản xem trước riêng cho từng khách vì bot không chạy JavaScript.
