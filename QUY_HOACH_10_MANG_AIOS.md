# BẢN QUY HOẠCH TOÀN DIỆN 10 MẢNG CHIẾN LƯỢC – HỆ SINH THÁI SHIN AIOS

> **TẦM NHÌN QUY HOẠCH HỆ THỐNG (CHỈ ĐẠO CỦA SẾP HUỲNH TRƯỜNG THANH TÂM):**  
> Hệ sinh thái SHIN được quy hoạch thành **10 Mảng Chiến Lược (Thập Diện Kiến Trúc - Decagon Architecture)**. Trong đó:  
> • **Mảng 0** đóng vai trò là **Hạt nhân Điều phối & Quản lý Module** (Kernel / Registry) điều khiển bật/tắt và phân quyền cho toàn hệ thống.  
> • **9 Mảng Nghiệp vụ (1 đến 9)** vận hành như các khối Lego độc lập, liên thông công việc, dữ liệu và tri thức với nhau qua hợp đồng I/O chuẩn mực.

---

## 1. SƠ ĐỒ THẬP DIỆN KIẾN TRÚC TOÀN HỆ SHIN

```
                                      HỆ SINH THÁI SHIN AIOS
                                  (Thập Diện Kiến Trúc - Decagon)
                                                │
    ┌──────────────┬──────────────┬─────────────┼─────────────┬─────────────┬─────────────┐
    ▼              ▼              ▼             ▼             ▼             ▼             ▼
 0. MODULE       1. ĐIỀU HÀNH    2. TƯ VẤN     3. GIÁO DỤC   4. NHÂN SỰ    5. DỰ ÁN      6. VIỆC L/T
 Hạt nhân Bật/Tắt  Executive Hub   Quản trị số   Tuyển sinh    Khoa/Phòng    Daily Flash   Task Bus
  (4 Micro)      (5 Micro)      (4 Micro)     (5 Micro)     (6 Micro)     (5 Micro)     (4 Micro)
                                                                                          │
                                                ┌─────────────────────────────────────────┴───────────┐
                                                ▼                                                     ▼
                                           7. MARKETING                                          8. WEB & PHỄU
                                           AI Đa Kênh Duyệt                                      Lặn Biển Đổ Lead
                                            (5 Micro)                                             (5 Micro)
                                                                                          │
                                                                                          ▼
                                                                                     9. TRI THỨC
                                                                                     Second Brain
                                                                                      (5 Micro)
```

---

## 2. DANH MỤC 10 MẢNG CHIẾN LƯỢC & CÁC MICRO-MODULES

### ⚙️ MẢNG 0: QUẢN LÝ MODULE APP & PHÂN QUYỀN (KERNEL REGISTRY)
- **M0.1 (Bộ điều khiển Bật/Tắt Module):** Quản lý cờ tính năng động (Feature Flags), ẩn/hiện module trên web v2 theo nhu cầu từng đơn vị.
- **M0.2 (Ma trận Phân quyền Người dùng RBAC):** Cấu hình chi tiết quyền theo Vai trò x Khoa/Phòng x Module.
- **M0.3 (Cổng cấp Token SSO & Khóa HMAC):** Cấp link không thời hạn `h1.<ma>.0.<chuKy>` truy cập an toàn cho toàn hệ.
- **M0.4 (Giám sát Tải & Sức khỏe Module):** Đo lường latency, phát hiện quá tải và giám sát trạng thái 10 mảng.

### 🏢 MẢNG 1: ĐIỀU HÀNH & AI (EXECUTIVE HUB)
- **M1.1 (Bàn làm việc Điều hành & Thẻ 3 số):** Hero Card tổng quan, tóm tắt tình hình toàn hệ trong 30 giây.
- **M1.2 (Động cơ Phê duyệt Nhanh 1-Chạm):** Duyệt nhanh báo cáo ca, đổi ca trực, chi phí dự án, kế hoạch chỉ với 1 click.
- **M1.3 (Bàn điều hành 2 chiều 🧭):** Sếp duyệt kế hoạch, giao việc trực tiếp cho Shin AI, cập nhật hàng đợi Lxx.
- **M1.4 (Trung tâm Điều phối Bot Telegram):** Đẩy thông báo khẩn cấp tức thì tới đúng Telegram ID của Sếp và Trưởng đơn vị.
- **M1.5 (Động cơ Tự động hóa AI 4 ca 24/7):** Vận hành liên hoàn Kế hoạch (10h57/22h57) ➔ Code (:27) ➔ Kiểm tra (21h22/08h22) ➔ Đưa app (09h52/16h52).

### 💼 MẢNG 2: TƯ VẤN QUẢN TRỊ SỐ (DIGITAL CONSULTING)
- **M2.1 (Bộ Khảo sát & Chẩn đoán Sức khỏe Quy trình):** Phân tích điểm nghẽn, thời gian chờ và lãng phí vận hành.
- **M2.2 (Khung Chuẩn hóa SOP Y tế & Doanh nghiệp):** Bộ công cụ chuẩn hóa quy trình theo tiêu chuẩn chất lượng ACHSI và FMFT.
- **M2.3 (Đóng gói Gói Giải pháp Tư vấn):** Cấu trúc thang giá trị dịch vụ tư vấn (Offer Stack) thuyết phục.
- **M2.4 (Lộ trình Triển khai Chuyển đổi số):** Kế hoạch WBS 3 giai đoạn kèm ma trận kiểm soát rủi ro.

### 🎓 MẢNG 3: GIÁO DỤC & TUYỂN SINH (EDUCATION & ADMISSIONS)
- **M3.1 (Quản trị Chiến dịch Tuyển sinh):** Quản lý theo chu kỳ 1 trường x 1 bậc x 1 đợt (GDU, SP Huế, Y tế CS3).
- **M3.2 (Quản lý Vòng đời Lead Tuyển sinh Pipeline CRM):** Theo dõi luồng: Mới ➔ Tư vấn ➔ Hồ sơ ➔ Nhập học ➔ Hủy.
- **M3.3 (Bảng tính Hoa hồng Bậc thang Lũy tiến):** Tính hoa hồng 6 bậc tự động cho mạng lưới CTV và đại lý.
- **M3.4 (Cổng Quản trị Đào tạo LMS Mini):** Quản lý lớp học Online/Offline, điểm danh, giao bài tập M01–M20 Quản trị Bệnh viện.
- **M3.5 (Thu phí & Lệ phí Tự động VietQR SePay):** Sinh mã VietQR động, xác nhận thanh toán tự động trong 3 giây.

### 👥 MẢNG 4: QUẢN LÝ NHÂN SỰ KHOA / PHÒNG (HR & CLINICAL WORKFORCE)
- **M4.1 (Hồ sơ & Danh bạ Nhân sự Khoa/Phòng):** Quản lý danh mục nhân viên chính thức, học việc, CTV theo tổ/khoa.
- **M4.2 (Ma trận Xếp lịch Trực tuần & Phân ca):** Tự động kiểm tra xung đột ca trực, đảm bảo định mức nhân sự tối thiểu.
- **M4.3 (Xin nghỉ phép & Đổi ca trực Linh hoạt):** Đơn đổi ca giữa nhân viên, tự động cập nhật lịch khi Sếp/Tổ trưởng duyệt.
- **M4.4 (Bóc tách Tăng ca & Bù giờ TC-NS):** Tự động bóc tách giờ tăng ca ngày thường, ngày nghỉ, ngày lễ gửi Kế toán.
- **M4.5 (Kiểm soát Vi phạm NTC & Chế tài Công):** Đếm số lần nộp trễ/chưa nộp: vượt 3 lần tự động trừ 0.5 ngày công kỷ luật.
- **M4.6 (Chỉ số Sức khỏe Tinh thần Team Morale Index):** Đo nhiệt kế cảm xúc và áp lực sau ca trực để kịp thời hỗ trợ nhân sự.

### 📈 MẢNG 5: QUẢN LÝ DỰ ÁN (PROJECT MANAGEMENT HUB)
- **M5.1 (Master Project Dashboard):** Theo dõi tiến độ tổng thể đa dự án (`40_DuAnPK`, `50_HoaSua`, cơ sở mới).
- **M5.2 (Báo Cáo Nhanh Mỗi Ngày - Daily Flash Report):**  
  *Bắt buộc 4 khối:* (1) Trạng thái tiến độ ➔ (2) Vướng mắc & Đề xuất ➔ (3) Tài chính & Chi phí phát sinh ➔ (4) Chờ duyệt khẩn.
- **M5.3 (Quản trị Ngân sách & Chi phí Phát sinh):** Cảnh báo khi chi phí thực tế lệch dự toán, theo dõi riêng chi phí ngoài hợp đồng.
- **M5.4 (Sổ Quản lý Vướng mắc & Điểm nghẽn Blocker Matrix):** Phân loại rủi ro, gán người xử lý và hạn chót gỡ vướng.
- **M5.5 (Cổng Trình duyệt Hạng mục Dự án):** Gửi hồ sơ nghiệm thu và đề xuất chi tiền trực tiếp sang Module Duyệt nhanh M1.2.

### 🔄 MẢNG 6: QUẢN LÝ CÔNG VIỆC LIÊN THÔNG (UNIVERSAL TASK BUS)
- **M6.1 (Trục Sự kiện Công việc Toàn hệ Task Event Bus):** Tự động phát sinh việc khi có sự kiện từ các mảng khác (Khảo sát phàn nàn, Lỗi KPI, Vướng mắc dự án).
- **M6.2 (Bảng Việc Toàn Hệ Universal Kanban):** Gom việc của cá nhân/đội nhóm từ 9 mảng về 1 danh mục thống nhất.
- **M6.3 (Bộ Phân luồng Việc Thông minh):** Tự động định tuyến việc đến đúng nhân sự theo ma trận phân quyền M0.2.
- **M6.4 (Bộ Giám sát SLA & Cảnh báo Trễ hạn):** Cảnh báo đổi màu (Xanh ➔ Vàng ➔ Đỏ) và báo Telegram khi sắp quá hạn.

### 📢 MẢNG 7: TRUYỀN THÔNG MARKETING TỰ ĐỘNG (MARKETING AUTOMATION)
- **M7.1 (Ma trận Lập kế hoạch & Lịch Nội dung Đa kênh):** Khung nội dung 3 tầng (TOFU/MOFU/BOFU) trên Facebook, TikTok, Zalo, YouTube.
- **M7.2 (Xưởng Sản xuất Nội dung AI Copywriter):** Tự động viết bài theo công thức PAS/AIDA, kịch bản video ngắn và visual prompt.
- **M7.3 (Chốt Chặn Kiểm Duyệt Người Dùng Human-in-the-Loop):** QUY TẮC BẮT BUỘC: Sếp hoặc Trưởng ban duyệt mới được xuất bản.
- **M7.4 (Bộ Đăng bài & Phân phối Tự động Auto-Publisher):** Đẩy bài tự động lên các kênh mạng xã hội đúng khung giờ vàng.
- **M7.5 (Báo cáo Phân tích Hiệu suất Truyền thông):** Bóc tách chỉ số reach, tương tác, xem video để tối ưu chiến dịch.

### 🌐 MẢNG 8: XÂY DỰNG WEB & PHỄU THU HÚT KHÁCH HÀNG TỰ ĐỘNG
- **M8.1 (Xưởng Sinh Phễu Lặn Biển Ocean Dive Funnel):** Dựng trang đích chuyển đổi sâu từ mặt nước (0m) xuống đáy biển (-105m).
- **M8.2 (Trình Biên dịch Giao diện Đa Phong cách):** Tự động sinh mã HTML tĩnh siêu nhẹ kèm Tailwind CSS và 8 bộ màu chuẩn.
- **M8.3 (Bộ Phân Luồng Lead Thông minh Smart Lead Dispatcher):** Tự động nhận diện và đổ Lead về đúng app:  
  *• Lead Tuyển sinh ➔ Đổ về Mảng 3*  
  *• Lead Đặt lịch khám ➔ Đổ về Mảng 4*  
  *• Lead Tư vấn ➔ Đổ về Mảng 2*
- **M8.4 (Xuất bản Đa Nền tảng 1-Lệnh):** Đẩy web lên Cloudflare Pages, Netlify, Vercel, GitHub Pages trong vài giây.
- **M8.5 (Cổng Tích hợp Thanh toán VietQR Động):** Sinh mã QR thanh toán Napas 24/7, tự động nổ đơn xác nhận.

### 🧠 MẢNG 9: THƯ VIỆN TRI THỨC (SECOND BRAIN - BỘ NÃO THỨ 2)
- **M9.1 (Đồ thị Tri thức Liên kết Hai Chiều Knowledge Graph):** Mạng lưới liên kết `[[wiki-links]]` giữa các khái niệm và quyết định.
- **M9.2 (Kho Quy trình Vận hành Chuẩn SOP Library):** Thư viện 3 tầng: Quy trình (HowTos) ➔ Cẩm nang (Runbooks) ➔ Tham chiếu (References).
- **M9.3 (Công cụ Tìm kiếm Ngữ nghĩa & Toàn văn FTS5):** Tra cứu toàn văn và ngữ nghĩa siêu tốc, trích xuất nguồn dẫn trong 2 giây.
- **M9.4 (Trích xuất Tri thức Tự động Từ Báo cáo):** Chắt lọc bài học kinh nghiệm sau mỗi ca làm việc bổ sung vào Second Brain.
- **M9.5 (Bức tường lửa Bảo mật Tri thức KHONG_DUA_VAO.md):** Chặn tuyệt đối đưa dữ liệu bệnh nhân và thông tin mật vào AI.
