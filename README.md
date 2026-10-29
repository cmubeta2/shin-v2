# SHIN AIOS v2 – HỆ THỐNG ĐIỀU HÀNH HỢP NHẤT ĐA MODULE
*1 Web duy nhất tích hợp toàn diện mọi tính năng của Hệ sinh thái SHIN v1 · Dữ liệu chung · Khác giao diện.*  
*Địa chỉ trực tuyến: **[cmubeta2.github.io/shin-v2](https://cmubeta2.github.io/shin-v2/)** · Phiên bản: **v2.0.0**.*

---

## 1. TỔNG QUAN VỀ SHIN v2

SHIN v2 là phiên bản hợp nhất đa module theo định hướng chiến lược của Sếp Huỳnh Trường Thanh Tâm:
- **1 Web duy nhất:** Gom toàn bộ các phân hệ nghiệp vụ độc lập trước đây vào một giao diện web duy nhất, tải mượt, chuẩn công thái học di động và máy tính.
- **Dữ liệu chung 100% với v1:** Không tạo cơ sở dữ liệu mới; v2 kết nối trực tiếp vào các máy chủ Google Apps Script và Google Sheets mà v1 đang dùng. Người dùng có thể sử dụng v1 hoặc v2 tùy theo thói quen mà dữ liệu luôn đồng bộ thời gian thực.
- **Thiết kế dạng Module:** Kiến trúc cắm-rút (plug-and-play), mỗi nghiệp vụ là một module độc lập kế thừa cùng một bộ khung (Shell Router) và hệ thống thiết kế.
- **Đa chế độ:**
  - **Chế độ Trình diễn (Demo Showcase):** Hoạt động hoàn toàn tự động khi không có Token bí mật, hiển thị số liệu mẫu sinh động, an toàn tuyệt đối khi đưa lên GitHub công khai.
  - **Chế độ Trực tiếp (Live Mode):** Kích hoạt khi có Token HMAC-SHA256 `?t=h1...`, tự động gọi thẳng các endpoint `/exec` qua POST `text/plain` để nạp dữ liệu thật.

---

## 2. MA TRẬN 5 MODULE HỢP NHẤT

| STT | Module | Mã | Trách nhiệm & Nghiệp vụ cốt lõi | Bộ màu mặc định |
|---|---|---|---|---|
| 1 | **Executive Hub** | `HUB` | Bàn làm việc trung tâm, gom việc toàn hệ, xem thẻ 3 số từng mảng, Tab 🧭 Điều hành 2 chiều, điều phối bot Telegram. | Executive Hub (Xanh Quản trị) |
| 2 | **KPI Toàn Viện** | `KPI` | Ban Kiểm Soát theo dõi AOP 2026/2027, bản tin tạm tính tháng, soát lỗi chốt quý, nháp báo cáo quý (đọc TV3 Read-Only). | Crimson Authority (Đỏ BKS) |
| 3 | **Tuyển Sinh** | `TS` | Vận hành 3 chiến dịch tuyển sinh thật (GDU, SP Huế, Y tế), hoa hồng bậc thang đại lý, tiếp nhận lead web tự động. | Fintech Growth (Tím Tăng trưởng) |
| 4 | **Khảo Sát Hài Lòng** | `KS` | Nền tảng khảo sát trải nghiệm người bệnh độc lập theo chuẩn ACHSI 5 trụ cột, phát hiện phản hồi tiêu cực trong 15 phút. | Clinical Precision (Teal 700 AAA) |
| 5 | **Phòng Khám & PTKH** | `PK` | Vận hành phòng khám ngoại trú: nộp báo cáo ngày, chụp ảnh minh chứng, phân công công việc, xếp lịch trực tuần. | Hoàng Kim & Hổ Phách |

---

## 3. CHUẨN THIẾT KẾ PHONG_CACH_APP_SHIN (ĐÃ DUYỆT 29/10/2026)

Toàn bộ ứng dụng v2 tuân thủ nghiêm ngặt 5 quy tắc thiết kế bất biến:
1. **Ghim cố định Header đỉnh và Menu đáy:** Nội dung cuộn độc lập ở giữa, chừa khoảng đệm an toàn `padding-bottom: 96px` để không bao giờ bị che khuất.
2. **Cấm hoàn toàn cuộn ngang:** Bảng biểu nhiều cột tự động chuyển sang thẻ dòng `hn-dong` hoặc khối số `tq-3so`.
3. **Vùng bấm tối thiểu ≥ 44px:** Nút bấm, icon tròn, chip viên thuốc đều đạt kích thước chuẩn chạm ngón tay.
4. **Hero Card chuẩn hóa:** Mỗi màn hình mở ra hiển thị Lời chào cá nhân hóa + Ngày tháng + Tối đa 3 ô số lớn + 1 nút hành động chính (44px).
5. **Cơ chế Tự hiển nhiên & Hoàn tác 6s:** Không dùng pop-up xác nhận phiền phức; các thao tác có thanh Toast hiển thị nút Hoàn tác đếm ngược 6 giây.
6. **Ma trận 8 phong cách màu:** Hỗ trợ chuyển đổi nhanh 8 bộ màu sắc và chế độ Sáng / Tối trực tiếp qua nút 🎨 trên thanh tiêu đề.

---

## 4. CẤU TRÚC THƯ MỤC NGUỒN

```
SHIN/
├── index.html               # 1 Web duy nhất: Shell app đa module
├── css/
│   └── styles.css           # 8 phong cách giao diện, quy tắc CSS biến, chuẩn UX
├── js/
│   ├── app.js               # Điều phối trung tâm (Shell router, token, theme, navigation)
│   ├── api.js               # Giao tiếp mạng (gọi /exec bằng POST text/plain hoặc fallback)
│   ├── demo_data.js         # Dữ liệu giả lập phong phú cho chế độ trình diễn
│   └── modules/
│       ├── hub.js           # Module 1: Executive Hub
│       ├── kpi.js           # Module 2: KPI Toàn Viện
│       ├── tuyensinh.js     # Module 3: Tuyển Sinh
│       ├── khaosat.js       # Module 4: Khảo Sát Hài Lòng
│       └── phongkham.js     # Module 5: Phòng Khám & PTKH
├── assets/
│   └── icon.svg             # Logo Shin vector
├── README.md                # Tài liệu dự án (file này)
├── CHANGELOG.md             # Lịch sử phiên bản v2.y.z
├── UPDATE.md                # Kế hoạch nâng cấp tiếp theo
└── .gitignore               # Tệp loại trừ git
```

---

## 5. HƯỚNG DẪN SỬ DỤNG

### Xem Chế độ Trình diễn (Public Demo)
Mở trực tiếp đường dẫn: `https://cmubeta2.github.io/shin-v2/`
- Trải nghiệm toàn bộ 5 module và các tính năng tương tác.
- Đổi 8 bộ màu và chế độ Sáng / Tối.

### Xem Chế độ Dữ liệu Thật (Live Mode)
1. Thêm tham số token vào URL: `https://cmubeta2.github.io/shin-v2/?t=<token_hub_cua_anh>`
2. Hoặc bấm vào nút 🎨 (Cài đặt) trên thanh tiêu đề, dán token Hub vào ô **KẾT NỐI DỮ LIỆU THẬT** và bấm **Lưu Kết Nối**.
- Ứng dụng sẽ chuyển sang trạng thái `🟢 Trực tiếp (Live)` và lấy số liệu thời gian thực từ Google Sheets của Sếp.

---

## 6. THÔNG TIN BẢN QUYỀN
- **Chủ quản:** Sếp Huỳnh Trường Thanh Tâm (cmubeta2).
- **Phát triển:** Shin Digital Familiar (Antigravity & Claude Dual Engine).
- **Bản phát hành:** v2.0.0.
