# SHIN AIOS v2 – HỆ THỐNG ĐIỀU HÀNH HỢP NHẤT ĐA MODULE
*1 Web duy nhất tích hợp toàn diện mọi tính năng của Hệ sinh thái SHIN v1 · Dữ liệu chung · Khác giao diện.*  
*Địa chỉ trực tuyến: **[cmubeta2.github.io/shin-v2](https://cmubeta2.github.io/shin-v2/)** · Phiên bản: **v2.2.0**.*
*Quy hoạch chi tiết 10 mảng, hiện trạng và lộ trình: xem **[QUY_HOACH_10_MANG_AIOS.md](QUY_HOACH_10_MANG_AIOS.md)**.*

---

## 1. TỔNG QUAN VỀ SHIN v2

SHIN v2 là phiên bản hợp nhất đa module theo định hướng chiến lược của Sếp Huỳnh Trường Thanh Tâm:
- **1 Web duy nhất:** Gom toàn bộ các phân hệ nghiệp vụ độc lập trước đây vào một giao diện web duy nhất, tải mượt, chuẩn công thái học di động và máy tính.
- **Thập diện kiến trúc Decagon (10 Mảng Nghiệp Vụ):** Thiết kế fractal Lego blocks theo 3 tầng (Nền tảng & Dịch vụ dùng chung ➜ 10 Mảng nghiệp vụ ➜ Gói giải pháp tư vấn số).
- **Hộp thư Phê duyệt 1-Chạm (Universal Approval Center):** Gom toàn bộ yêu cầu duyệt từ Phòng khám, Dự án, Nhân sự và Marketing về 1 màn hình duy nhất cho Sếp.
- **Khung Báo Cáo Nhanh Mỗi Ngày (Daily Flash Report) 4 Khối:** Cho mảng Quản lý Dự án (1. Tiến độ; 2. Vướng mắc & Đề xuất; 3. Tài chính phát sinh; 4. Việc chờ Sếp duyệt).
- **Dữ liệu chung 100% với v1:** Không tạo cơ sở dữ liệu mới; v2 kết nối trực tiếp vào các máy chủ Google Apps Script và Google Sheets mà v1 đang dùng.
- **Đa chế độ:**
  - **Chế độ Trình diễn (Demo Showcase):** Hoạt động hoàn toàn tự động khi không có Token bí mật, hiển thị số liệu mẫu sinh động, an toàn tuyệt đối khi đưa lên GitHub công khai.
  - **Chế độ Trực tiếp (Live Mode):** Kích hoạt khi có Token HMAC-SHA256 `?t=h1...`, tự động gọi thẳng các endpoint `/exec` qua POST `text/plain` để nạp dữ liệu thật.

---

## 2. MA TRẬN 10 MẢNG NGHIỆP VỤ & DỊCH VỤ DÙNG CHUNG

| STT | Phân hệ / Module | Mã | Trách nhiệm & Nghiệp vụ cốt lõi | Bộ màu mặc định |
|---|---|---|---|---|
| 0A | **Quản Trị Module** | `caidat` | Bật/tắt module, cấu hình phân quyền RBAC toàn hệ sinh thái. | Cyber Terminal |
| 0B | **Phê Duyệt 1-Chạm** | `pheduyet` | Universal Approval Center: duyệt báo cáo ca, tạm ứng chi phí, đổi ca. | Executive Hub |
| 1 | **Executive Hub** | `hub` | Bàn làm việc trung tâm, gom việc toàn hệ, Tab 🧭 Điều hành 2 chiều. | Executive Hub |
| 1 | **BKS KPI Toàn Viện** | `kpi` | Theo dõi AOP 2026/2027, bản tin tạm tính tháng, soát lỗi chốt quý. | Crimson Authority |
| 1 | **Khảo Sát ACHSI** | `khaosat` | Khảo sát trải nghiệm người bệnh 5 trụ cột chuẩn quốc tế ACHSI. | Clinical Precision |
| 2 | **Khách Hàng & Đối Tác** | `crm` | CRM B2B KSK Doanh nghiệp, Học viên, CTV, Nhà cung ứng (Không lưu bệnh nhân). | Executive Hub |
| 3 | **Tài Chính & Thanh Toán** | `taichinh` | VietQR SePay, chi phí phát sinh, chi trả hoa hồng *(dự kiến v2.3.0)*. | – |
| 4 | **Giáo Dục & Tuyển Sinh** | `tuyensinh` | Vận hành chiến dịch tuyển sinh, hoa hồng bậc thang, đón nhận lead. | Fintech Growth |
| 5 | **Phòng Khám & PTKH** | `phongkham` | Báo cáo ca ngày, minh chứng ảnh Drive, xếp lịch trực tuần ngoại trú. | Hoàng Kim & Hổ Phách |
| 6 | **Quản Lý Dự Án** | `duan` | Master Dashboard & Báo cáo nhanh mỗi ngày 4 khối (Daily Flash). | Executive Hub |
| 7 | **Quản Lý Công Việc** | `congviec` | Universal Task Bus liên thông việc đa nguồn, Kanban 3 cột. | Executive Hub |
| 8 | **Tăng Trưởng** | `tangtruong` | Marketing AI đa kênh, Web phễu & phân luồng lead *(dự kiến v2.4.0)*. | – |
| 9 | **Thư Viện Tri Thức** | `trithuc` | Second Brain kết nối Obsidian Vault và kho quy trình SOP chuẩn. | Nordic Minimalist |

---

## 3. CHUẨN THIẾT KẾ PHONG_CACH_APP_SHIN (ĐÃ DUYỆT 29/10/2026)

Toàn bộ ứng dụng v2 tuân thủ nghiêm ngặt 5 quy tắc thiết kế bất biến:
1. **Ghim cố định Header đỉnh và Menu đáy:** Nội dung cuộn độc lập ở giữa, chừa khoảng đệm an toàn `padding-bottom: 96px` để không bao giờ bị che khuất.
2. **Cấm hoàn toàn cuộn ngang:** Bảng biểu nhiều cột tự động chuyển sang thẻ dòng `hn-dong` hoặc khối số `tq-3so`.
3. **Vùng bấm tối thiểu ≥ 44px:** Nút bấm, icon tròn, chip viên thuốc đều đạt kích thước chuẩn chạm ngón tay.
4. **Hero Card chuẩn hóa:** Mỗi màn hình mở ra hiển thị Lời chào cá nhân hóa + Ngày tháng + Tối đa 3 ô số lớn + 1 nút hành động chính (44px).
5. **Cơ chế Tự hiển nhiên & Hoàn tác 6s:** Không dùng pop-up xác nhận phiền phức; các thao tác có thanh Toast hiển thị nút Hoàn tác đếm ngược 6 giây.
6. **Ma trận 8 phong cách màu:** Hỗ trợ chuyển đổi nhanh 8 bộ màu sắc và chế độ Sáng / Tối qua nút ⚙️ Cài đặt ở thanh đáy.

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
│       ├── caidat_module.js # Tầng 0A: Quản trị Module & phân quyền
│       ├── pheduyet.js      # Tầng 0B: Phê duyệt 1-chạm
│       ├── hub.js           # Mảng 1: Executive Hub
│       ├── kpi.js           # Mảng 1: KPI Toàn Viện
│       ├── khaosat.js       # Mảng 1: Khảo sát ACHSI
│       ├── crm.js           # Mảng 2: Khách hàng & Đối tác
│       ├── tuyensinh.js     # Mảng 4: Giáo dục & Tuyển sinh
│       ├── phongkham.js     # Mảng 5: Nhân sự & Phòng khám
│       ├── duan.js          # Mảng 6: Quản lý Dự án & Flash Report
│       ├── congviec.js      # Mảng 7: Công việc (Task Bus)
│       └── trithuc.js       # Mảng 9: Tri thức (Second Brain)
├── assets/
│   └── icon.svg             # Logo Shin vector
├── README.md                # Tài liệu dự án (file này)
├── CHANGELOG.md             # Lịch sử phiên bản v2.y.z
├── UPDATE.md                # Kế hoạch nâng cấp tiếp theo
├── QUY_HOACH_10_MANG_AIOS.md # Quy hoạch 10 mảng, hiện trạng & lộ trình
├── DANH_MUC_MODULE_FRACTAL.md # Danh mục micro-module di sản v1
└── .gitignore               # Tệp loại trừ git
```

---

## 5. HƯỚNG DẪN SỬ DỤNG

### Xem Chế độ Trình diễn (Public Demo)
Mở trực tiếp đường dẫn: `https://cmubeta2.github.io/shin-v2/`
- Trải nghiệm toàn bộ 11 màn hình module và các tính năng tương tác.
- Đổi 8 bộ màu và chế độ Sáng / Tối / Theo máy / Theo giờ qua nút ⚙️ Cài đặt.

### Xem Chế độ Dữ liệu Thật (Live Mode)
1. Thêm tham số token vào URL: `https://cmubeta2.github.io/shin-v2/?t=<token_hub_cua_anh>`
2. Hoặc bấm nhãn trạng thái `🟡 Demo` cạnh chữ SHIN AIOS (hoặc nút ⚙️ Cài đặt ở thanh đáy), dán token Hub vào ô **KẾT NỐI DỮ LIỆU THẬT** và bấm **Lưu Kết Nối**.
- Ứng dụng chuyển sang `🟢 Live` và lấy số thật từ các máy chủ v1: **Hub** (Hôm nay, Thông báo, Việc riêng), **KPI** (Bản tin tạm tính), **Tuyển sinh** (Chiến dịch, Lead). Mảng chưa có cổng số liệu trên v1 vẫn hiện mẫu, có dải báo vàng ở đầu màn.
- Token ở `?t=` được lưu vào máy rồi tự xóa khỏi thanh địa chỉ.

---

## 6. THÔNG TIN BẢN QUYỀN
- **Chủ quản:** Sếp Huỳnh Trường Thanh Tâm (cmubeta2).
- **Phát triển:** Shin Digital Familiar (Antigravity & Claude Dual Engine).
- **Bản phát hành:** v2.2.0.
