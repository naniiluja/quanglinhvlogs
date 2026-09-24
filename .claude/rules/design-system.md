---
paths: ["src/**", "index.html", "public/**"]
---

# Design System (giao diện đẹp là ưu tiên số một)

Nguồn thiết kế: **chưa có bản Claude Design**, giao diện do Claude tự dựng theo rule này và bố cục tham khảo ngaychungdoi.com. Nếu chủ dự án gửi link bản Claude Design (`https://api.anthropic.com/v1/design/h/...`), ghi vào đây và coi đó là chuẩn hình ảnh; link đó cần xác thực nên không tự tải.

## Màu (giá trị khởi điểm, khai báo bằng `@theme` trong `src/index.css`)
| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--color-cream` | `#FAF5EA` | Nền chính, giấy thiệp |
| `--color-sage` | `#8A9A7B` | Lá, viền, nút phụ |
| `--color-sage-deep` | `#4F6250` | Chữ nhấn, nền tối nhẹ |
| `--color-bronze` | `#B08A57` | Vàng đồng: chỉ cho đường viền và họa tiết (2.92:1 với nền kem, không đủ cho chữ) |
| `--color-bronze-deep` | `#86653A` | Vàng đồng đậm: chữ, icon, nền nút chính (`--primary`), đạt 4.91:1 với nền kem |
| `--color-blush` | `#E9C4C9` | Hồng phấn nhấn, lấy từ hoa và rèm trong ảnh dạm ngõ |
| `--color-mauve` | `#8B5E75` | Chữ tên, lấy từ chữ trên bảng dạm ngõ |
| `--color-ink` | `#3B3A36` | Chữ thân bài |

- Chỉnh màu ở biến CSS (kể cả biến shadcn `--background`, `--primary`...), không sửa từng component. Không viết mã màu hex rải rác trong `.tsx`.
- Tỉ lệ dùng: kem chiếm nền, sage và bronze làm điểm nhấn, blush và mauve rất tiết chế. Đạt tương phản chữ thân bài với nền tối thiểu 4.5:1.

## Font (chủ dự án duyệt ngày 2026-09-24)
| Vai trò | Font | Class | Quy tắc |
| --- | --- | --- | --- |
| Tên cô dâu chú rể, chữ trang trí | Great Vibes (`@fontsource/great-vibes`) | `font-script` | Chỉ cỡ từ 48px (`text-5xl` trở lên), màu `mauve`; không dùng cho đoạn văn |
| Tiêu đề, lời mời, số ngày giờ | Cormorant Garamond (`@fontsource-variable/cormorant-garamond`) | `font-serif`, `font-heading` | Độ đậm từ 500 và cỡ từ 20px, trừ nhãn chữ in hoa giãn cách |
| Thân bài, form, nút | Be Vietnam Pro (`@fontsource/be-vietnam-pro`) | `font-sans` (mặc định) | Chỉ độ đậm 400 và 600 |

- **Mọi font phải có subset `vietnamese`** (đã kiểm bằng API Fontsource cho cả ba). Parisienne và Sacramento không có subset này nên bị loại.
- Phương án dự phòng đã kiểm có `vietnamese`: Allura hoặc Playball thay Great Vibes; Playfair Display thay Cormorant.
- Chỉ nhập subset `latin` và `vietnamese` cùng các độ đậm dùng thật, ở đầu `src/index.css`.

## Lớp chồng (z-index)
Khai báo biến trong `:root` ở `src/index.css`, dùng bằng `z-(--layer-...)`; không viết số `z-index` rời rạc.
| Biến | Giá trị | Lớp |
| --- | --- | --- |
| `--layer-background` | 0 | Nền kem và vân giấy (`NoiseTexture`, cố định) |
| `--layer-decor` | 10 | Hoa lá trang trí ở góc và mép section, parallax |
| `--layer-petals` | 15 | Canvas hoa rơi (`fullScreen.zIndex` của tsParticles phải khớp số này) |
| `--layer-content` | 20 | Chữ, ảnh, form; nền section trong suốt hoặc bán trong suốt để không che hoa |
| `--layer-floating` | 50 | Nút nhạc, toast |
| `--layer-dialog` | 60 | Lightbox, phóng to QR |

## Bố cục
- Thiết kế mobile trước, kiểm ở 390px; nội dung tối đa khoảng 480px chiều ngang trên màn lớn để giữ cảm giác một tấm thiệp, phần nền trang trí có thể rộng hơn.
- Lề hai bên 16px, không cuộn ngang. Vùng chạm tối thiểu 44x44px.
- Mỗi section chiếm nhịp thở riêng (khoảng cách dọc rộng), một ý một section.

## Chuyển động (Motion)
- Hiệu ứng lấy từ thư viện bên thứ ba, không tự chế (xem `tech-stack.md`).
- Chỉ animate `transform` và `opacity`; không animate `top`, `left`, `width`, `height`. Ngoại lệ: `filter: blur` trong hiệu ứng xuất hiện một lần của component bên thứ ba (`BlurFade`).
- Hoa rơi: `PetalsFall` (tsParticles), tối đa 18 cánh cùng lúc, khác nhau về cỡ, độ mờ, tốc độ, góc xoay; `pointer-events: none`, nằm sau nội dung.
- Hiện dần khi xuất hiện hoặc khi cuộn: `BlurFade` (thêm `inView` để chỉ chạy khi cuộn tới).
- Parallax nhẹ bằng `useScroll` và `useTransform`, chỉ ở bìa và một hai chỗ chọn lọc.
- **Tôn trọng giảm chuyển động**: `App` bọc `MotionConfig reducedMotion="user"`, nên mọi hiệu ứng Motion tự bỏ phần dịch chuyển; `PetalsFall` tự tắt bằng `useReducedMotion()`. Nội dung vẫn hiện đủ.

## Ảnh
- Định dạng JPEG hoặc WebP đã nén; ảnh bìa tối đa 250KB, ảnh album tối đa 150KB mỗi tấm (chỉ tiêu đề xuất, đo lại ở task 009).
- Khai báo `width` và `height` để không nhảy bố cục; `loading="lazy"` cho mọi ảnh ngoài màn hình đầu.
- Mọi ảnh có `alt` tiếng Việt mô tả nội dung.

## Nhạc nền
- Trình duyệt chặn tự phát có tiếng: chỉ gọi `audio.play()` trong handler của thao tác người dùng (nút "Mở thiệp"), xử lý Promise bị từ chối, không hiện trạng thái "đang phát" khi chưa phát thật. Kiểm tra trên iOS Safari thật.
