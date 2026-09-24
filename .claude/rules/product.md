# Product (hành vi đã chốt)

## Người dùng
- **Khách mời**: mở link riêng trên điện thoại, thường từ Zalo hoặc Facebook (trình duyệt trong ứng dụng). Thiết kế mobile trước, kiểm ở 390px.
- **Admin**: chủ dự án hoặc người được giao, đăng nhập ở `/admin`.

## Link riêng của khách
- Dạng `/?g=<code>`. `code` là mã ngẫu nhiên lưu ở bảng `guests`, tên hiển thị lấy từ `guests.display_name` (ví dụ "Anh Nam và gia đình").
- Không có `g`, hoặc mã sai: hiện thiệp chung ("Trân trọng kính mời quý khách"), **ẩn** form RSVP, form lời chúc và hộp mừng cưới, hiện một dòng nhắc mở đúng link được gửi riêng. Mã sai và không có mã hiển thị y hệt nhau, để không ai dò được mã hợp lệ.
- Đổi tên người nhận: sửa `display_name` trong `/admin`, không cần deploy lại.

## Thứ tự các phần của thiệp
Tham khảo bố cục mẫu "Parallax lãng mạn" trên ngaychungdoi.com (chỉ học thứ tự và nhịp, **không sao chép chữ, hình, mã**):
1. Bìa: tên khách, tên hai người, nút "Mở thiệp".
2. Lời mời.
3. Gia đình hai bên (dữ liệu mock).
4. Chú rể và cô dâu: tên, ảnh, vài dòng giới thiệu.
5. Lễ cưới: ngày, giờ.
6. Đếm ngược và lịch tháng khoanh ngày cưới.
7. Lịch trình trong ngày (mock).
8. Địa điểm: bấm vào mở Google Maps (`https://www.google.com/maps/search/?api=1&query=<địa chỉ đã mã hóa>`).
9. Album ảnh, xem phóng to.
10. Sổ lưu bút.
11. Mừng cưới: **một** mã QR VietQR và số tài khoản, **chỉ hiện với link mời riêng hợp lệ** (link chung và mã sai không thấy; chủ dự án chốt 2026-09-24).
12. Xác nhận tham dự (RSVP).
13. Lời cảm ơn.

## RSVP
- Trường: `attending` (có hoặc không), `party_size` từ 1 đến 5 (chỉ hỏi khi tham dự), `message` tùy chọn tối đa 500 ký tự.
- Mỗi khách đúng một bản ghi. Gửi lại thì **ghi đè** bản cũ, khách được đổi ý.
- Vào lại link thì form hiện sẵn câu trả lời đã gửi.

## Sổ lưu bút
- Chỉ khách có mã hợp lệ mới viết được. Tên tác giả lấy từ `guests.display_name`, khách không tự gõ tên, để không giả mạo người khác.
- Tối đa 500 ký tự mỗi lời chúc; tối đa 3 lời chúc mỗi khách (mặc định đề xuất, đổi được khi chủ dự án muốn).
- Ai mở thiệp cũng đọc được danh sách. Admin xóa được lời chúc không phù hợp.

## Dữ liệu mock và dữ liệu thật
- Tên thật: chú rể **Quang Linh**, cô dâu **Thanh Trúc**. Ngày giờ, địa điểm, tên cha mẹ, lịch trình, tài khoản ngân hàng đều là **mock** cho đến khi chủ dự án cung cấp.
- Mọi giá trị mock trong `src/config/wedding.ts` có chú thích `// MOCK` để `grep -n "MOCK" src` liệt kê hết những gì còn phải thay.
- Ngày `20.09.2026` trên bảng "Lễ dạm ngõ" trong ảnh là ngày dạm ngõ đã qua, **không** dùng làm ngày cưới.
- Tài khoản ngân hàng mock phải ghi rõ là mock, không dùng số thật khi chủ dự án chưa xác nhận (repo công khai).

## Ảnh
- Ảnh gốc: `assets-src/dam-ngo-goc.jpg` (1536x2048, chú rể và cô dâu bên bảng dạm ngõ). Không commit ảnh gốc.
- Bản đã cắt và nén đặt trong `public/images/`. Cắt sao cho khung ảnh không chứa chữ "Lễ dạm ngõ" hay ngày `20.09.2026`.

## Ngôn ngữ
- Toàn bộ chữ hiển thị là tiếng Việt có dấu. Không viết tiếng Việt không dấu trong giao diện.

## Chia sẻ link
- Thẻ Open Graph (xem trước khi dán vào Zalo, Facebook) là thẻ chung của cả trang, đặt tĩnh trong `index.html`. Web tĩnh không tạo được bản xem trước riêng cho từng khách vì bot không chạy JavaScript.
