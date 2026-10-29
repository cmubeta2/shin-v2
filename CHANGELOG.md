# NHẬT KÝ THAY ĐỔI (CHANGELOG) – SHIN v2

Tất cả các thay đổi kiến trúc, tính năng và bản phát hành của SHIN v2 được lưu trữ tuần tự tại đây theo chuẩn Keep a Changelog.

---

## [2.1.1] – 29/10/2026 (VÁ LỖI BẢN CÔNG KHAI & QUY HOẠCH 10 MẢNG 2.0)

### 🐞 Sửa lỗi
- **6 màn hình hiện trống** (Dự án, CRM, Công việc, Phê duyệt, Tri thức, Quản trị Module): tầng API trả `{}` cho các mảng chưa có máy chủ nên module không dùng dữ liệu mẫu. Nay trả đúng bộ dữ liệu mẫu của từng mảng (`js/api.js`).
- **Menu ☰ mở sai màn hình:** mục *Khảo Sát ACHSI* và *Giáo Dục & Tuyển Sinh* dùng mã `ks`/`ts` không tồn tại nên mở Executive Hub. Đã đổi về mã chuẩn `khaosat`/`tuyensinh` (`js/app.js`).
- **Chế độ Live không gọi được máy chủ KS, TS, PK:** thêm bảng bí danh mã module ➜ khóa endpoint (`KHAOSAT→KS`, `TUYENSINH→TS`, `PHONGKHAM→PK`).
- **Cuộn ngang ở màn hình 375px** (Dự án, CRM, Phê duyệt): lưới 3 ô số co giãn đúng (`minmax(0, 1fr)`), nhãn ô số được xuống dòng, tab Dự án tự xuống hàng.
- Nhãn trạng thái Header không còn nháy chữ "Live" trước khi ứng dụng khởi động.

### 📐 Quy hoạch
- Viết lại `QUY_HOACH_10_MANG_AIOS.md` (bản 2.0): thống nhất 1 cách đánh số mảng theo mã nguồn, bảng quy đổi từ bản 1.0, kiến trúc 3 tầng, 3 luồng liên thông (Lead · Duyệt · Việc), 54 micro-module kèm trạng thái và phiên bản đích, hợp đồng I/O, nguyên tắc dữ liệu, kết quả kiểm tra, lộ trình v2.2 → v2.6 có tiêu chí hoàn thành, các việc cần Sếp chốt.
- Cập nhật `README.md` (mã module chuẩn, cấu trúc thư mục đủ 11 module) và `UPDATE.md` (lộ trình mới).

---

## [2.1.0] – 29/10/2026 (THẬP DIỆN KIẾN TRÚC DECAGON & TRUNG TÂM PHÊ DUYỆT 1-CHẠM)

### 🚀 Nâng cấp Cấu trúc 10 Mảng & Dịch Vụ Dùng Chung
- **Thập diện kiến trúc Decagon (10 Mảng):** Quy hoạch và mở rộng toàn diện hệ thống từ 5 module lên đầy đủ 10 mảng nghiệp vụ theo phê duyệt của Sếp:
  1. `Mảng 0A (Quản trị Module)`: Điều khiển bật/tắt module theo phân quyền RBAC (`js/modules/caidat_module.js`).
  2. `Tầng 0B (Phê duyệt 1-chạm)`: Universal Approval Center gom toàn bộ yêu cầu duyệt báo cáo ca PK, đề xuất chi phí dự án, đơn đổi ca nhân sự, bài viết marketing (`js/modules/pheduyet.js`).
  3. `Mảng 1 (Điều hành Hub & KPI)`: Hub làm việc Sếp, Giám sát KPI Viện BKS, Khảo sát ACHSI (`hub.js`, `kpi.js`, `khaosat.js`).
  4. `Mảng 2 (Khách hàng & Đối tác CRM)`: Quản lý B2B Khám sức khỏe, Đối tác cung ứng, Học viên, CTV Tuyển sinh. Tự động đón nhận lead từ phễu web mảng 8. Tuyệt đối tuân thủ `KHONG_DUA_VAO.md` không lưu bệnh nhân (`js/modules/crm.js`).
  5. `Mảng 4 (Giáo dục & Tuyển sinh)`: Quản trị chiến dịch tuyển sinh, hoa hồng bậc thang (`tuyensinh.js`).
  6. `Mảng 5 (Nhân sự & Phòng khám)`: Báo cáo ca ngày, minh chứng ảnh Drive, lịch trực tuần (`phongkham.js`).
  7. `Mảng 6 (Quản lý Dự án)`: Master Dashboard và **Khung Báo Cáo Nhanh Mỗi Ngày (Daily Flash Report) 4 Khối** chuẩn Sếp chỉ đạo (1. Tiến độ; 2. Vướng mắc & Đề xuất; 3. Tài chính phát sinh; 4. Việc chờ Sếp duyệt) (`js/modules/duan.js`).
  8. `Mảng 7 (Quản lý Công việc)`: Trục Task Bus liên thông việc toàn hệ sinh thái, bảng Kanban 3 cột đa nguồn (`js/modules/congviec.js`).
  9. `Mảng 9 (Thư viện Tri thức)`: Second Brain kết nối Obsidian Vault và kho quy trình SOP chuẩn (`js/modules/trithuc.js`).
  10. `Gói Tư vấn Quản trị số`: Gói giải pháp đóng gói liên thông từ CRM + Dự án + Tri thức.

### 📱 Nâng cấp Bộ Điều Hướng Shell & Trải Nghiệm Công Thái Học (Cập nhật theo chỉ đạo của Sếp)
- **Header Tinh Gọn Tuyệt Đối:**
  - Nhãn trạng thái `Live v2.1.0` / `Demo v2.1.0` được gom thành một badge siêu nhỏ (height 20px) đặt ngay cạnh chữ `SHIN AIOS`, không chiếm không gian các nút bấm.
  - Bên phải Header chỉ giữ DUY NHẤT 1 nút bấm: Nút tia sét `⚡` (kèm badge đếm phiếu chờ duyệt).
- **Chế Độ Hiển Thị Thông Minh:**
  - Tích hợp bộ chọn 4 chế độ: `☀️ Sáng`, `🌙 Tối`, `💻 Theo máy` (tự đổi theo OS) và `⏰ Theo giờ` (tự động 06:00 - 18:00 sáng, còn lại tối) đặt ngay trước bảng chọn 8 phong cách màu sắc.
- **Thanh Bottom Navigation 5 Nút:**
  - Thay nút `10 Mảng` ở cuối bằng nút `⚙️ Cài đặt` (mở ngay bảng tùy biến màu sắc, theme và token).
  - Nút mở `☰ 10 Mảng` nằm cố định tại góc trên bên trái Header, phân công nhiệm vụ công thái học rõ ràng và không bị trùng lặp.

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
