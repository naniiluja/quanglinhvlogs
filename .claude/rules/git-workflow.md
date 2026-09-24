# Git Workflow

## Quy tắc quan trọng nhất
- **Từ 2026-09-24 chủ dự án cho phép:** sửa xong, qua cổng kiểm chứng thì tự commit (nhánh ngắn, ff-merge vào `main`), push và deploy production, **không hỏi lại**. Vẫn hỏi trước với force push, viết lại lịch sử, xóa nhánh `main`, và mọi thao tác không đảo ngược ngoài quy trình này.
- Remote `origin` là `https://github.com/naniiluja/quanglinhvlogs.git`: repo **công khai**. Trước mỗi lần push, kiểm tra không có `.env`, khóa bí mật, danh sách khách hay số tài khoản thật trong thay đổi (xem `security.md`).

## Ghi công commit (do harness cưỡng chế)
- Ghi công được cưỡng chế bởi `attribution` trong `.claude/settings.json`; cấu hình cấp harness mang tính xác định và **thắng** mọi mô tả bằng lời ở đây.
- Chủ dự án chọn **không kèm** dòng ghi công Claude: cả `commit` và `pr` đều là `""`. Không tự thêm `Co-Authored-By` hay "Generated with Claude Code" bằng tay.

## Khi được yêu cầu commit
- Đang ở nhánh mặc định `main`: tạo nhánh mới trước. Ngoại lệ duy nhất là repo chưa có commit nào: commit đầu tiên tạo ra `main`, và vẫn cần chủ dự án đồng ý như mọi commit khác.
- Commit theo conventional commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `chore:`; tiêu đề tiếng Anh, viết thường, dạng mệnh lệnh, dưới 72 ký tự. Ví dụ `feat: add rsvp form with party size`.
- Một thay đổi logic một commit; không gộp việc không liên quan.
- Repo mới chưa có lịch sử nên quy ước này là mặc định đề xuất của CCF, chưa suy ra từ lịch sử; chủ dự án được đổi.

## Nhánh và PR
- Tên nhánh: `feat/<NNN>-<slug>` theo số task trong plan, ví dụ `feat/003-rsvp`; sửa lỗi dùng `fix/<slug>`.
- Mỗi task một nhánh, hợp nhất vào `main` khi task đã `in-review` và qua `/ccf:check`. Dự án một người nên không bắt buộc người review thứ hai.
- Nội dung PR (hoặc thân commit khi không mở PR): tên task, các tiêu chí nghiệm thu đã đạt, kết quả cổng kiểm chứng (`lint`, `build`, kiểm tra tay), ảnh chụp màn hình cho thay đổi giao diện.
- Nếu bật tích hợp Git của Cloudflare Pages: mỗi nhánh có bản preview riêng, dùng bản đó để kiểm tra trên điện thoại thật.

## Monorepo
- git chỉ nằm ở thư mục gốc; không `git init` trong thư mục con.
