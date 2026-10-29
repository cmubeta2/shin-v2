# NHẬT KÝ THAY ĐỔI (CHANGELOG) – SHIN v2

Tất cả các thay đổi kiến trúc, tính năng và bản phát hành của SHIN v2 được lưu trữ tuần tự tại đây theo chuẩn Keep a Changelog.

---

## [2.0.0] – 29/10/2026 (KHỞI TẠO NỀN TẢNG SHIN v2 – 1 WEB DUY NHẤT)

### 🚀 Khởi tạo Kiến trúc Hợp nhất
- **1 Web Duy nhất:** Xây dựng khung ứng dụng hợp nhất (Single Web Shell) tại `index.html` tích hợp toàn bộ 5 module nghiệp vụ:
  1. `HUB`: Executive Hub (Bàn làm việc Sếp, Việc hôm nay, Điều hành 2 chiều 🧭).
  2. `KPI`: Giám sát KPI Toàn Viện (BKS, AOP 2026/2027, Bản tin tháng, Soát lỗi chốt quý).
  3. `TS`: Tuyển Sinh & Cung Ứng Nhân Lực (3 Chiến dịch, Hoa hồng bậc thang, Quản lý lead).
  4. `KS`: Khảo Sát Sự Hài Lòng (5 Trụ cột ACHSI, cảnh báo phản hồi tiêu cực).
  5. `PK`: Vận Hành Phòng Khám & PTKH (Báo cáo ngày, Minh chứng ảnh, Xếp lịch trực tuần).
- **Kiến trúc Sổ Module (Module Registry):** Mỗi phân hệ là một tệp Javascript độc lập trong `js/modules/`, nạp động và kế thừa hệ thống thiết kế chung.
- **Chế độ Kép (Live & Demo Mode):**
  - Tự động phát hiện Token bí mật `?t=h1...` để gọi dữ liệu thực từ Google Apps Script / Google Sheets qua POST `text/plain`.
  - Tự động nạp bộ dữ liệu mẫu sinh động `js/demo_data.js` khi chạy công khai trên GitHub Pages mà không có token.

### 🎨 Chuẩn hóa Thiết kế PHONG_CACH_APP_SHIN (Duyệt 29/10)
- Tích hợp trọn vẹn ma trận **8 phong cách giao diện**: Executive Hub, Hoàng Kim, Clinical Precision (WCAG AAA Teal 700), Fintech Growth, Nordic Minimalist, Cyber Terminal, Crimson Authority, Mocha Warmth.
- Ghim cố định Header đỉnh và Bottom Navigation đáy; cấm cuộn ngang; vùng bấm chuẩn chạm ≥ 44px; Hero card 3 ô số + 1 nút chính; cơ chế Toast đếm ngược hoàn tác 6 giây.

### 🌐 Triển khai GitHub & GitHub Pages
- Tạo kho lưu trữ công khai `cmubeta2/shin-v2` trên GitHub.
- Phát hành trực tuyến qua GitHub Pages tại: `https://cmubeta2.github.io/shin-v2/`.
