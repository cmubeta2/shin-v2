# KIẾN TRÚC FRACTAL MODULE & DANH MỤC TÍNH NĂNG TOÀN HỆ SHIN

> **TRIẾT LÝ THIẾT KẾ FRACTAL MODULE (SẾP HUỲNH TRƯỜNG THANH TÂM):**  
> *"Mỗi App là 1 Module lớn (Macro-Module), và mỗi Tính năng trong App là 1 Module nhỏ (Micro-Module). Toàn bộ hệ thống là các khối Lego độc lập: chỉ cần khớp chuẩn hợp đồng Đầu vào (Input) và Đầu ra (Output) thì bất kỳ Module nhỏ nào cũng có thể tách rời, hoán đổi hoặc ghép nối trực tiếp sang một App khác hay bất kỳ vị trí nào trong hệ sinh thái."*

---

## 1. TỔNG QUAN 8 NHÓM MACRO-APPS & 38 MICRO-MODULES

```
                                      HỆ SINH THÁI SHIN AIOS
                                  (Kiến trúc Fractal Composable)
                                                │
    ┌──────────────┬──────────────┬─────────────┼─────────────┬─────────────┬─────────────┐
    ▼              ▼              ▼             ▼             ▼             ▼             ▼
 1. HUB         2. KPI         3. TS         4. KS         5. PK       6. PTKH       7. WEB & AI
 Executive    Toàn Viện     Tuyển Sinh     Khảo Sát     Phòng Khám     (Di sản)     (Hạ tầng)
  (5 Micro)     (5 Micro)     (4 Micro)     (4 Micro)     (5 Micro)    (6 Micro)     (9 Micro)
```

---

## 2. DANH MỤC CHI TIẾT TỪNG MICRO-MODULE (CHUẨN I/O)

### 🏢 NHÓM 1: EXECUTIVE HUB (`10_Hub`)
1. **M-HUB-01 (Gom việc & Thẻ số hôm nay):**  
   - *Input:* Mã người dùng (`maNguoi`), Cổng `tomTat` & `viec` từ các app con.  
   - *Output:* Mảng thẻ số `{nhan, giaTri, den}` + Danh sách việc `{id, app, tieuDe, han, link}`.  
   - *Ghép nối:* Ghép vào trang chủ của bất kỳ app vệ tinh nào.
2. **M-HUB-02 (Bàn điều hành 2 chiều 🧭):**  
   - *Input:* Quyết định duyệt của Sếp (`Dxx`, `Qxx`), Lệnh giao việc cho Shin AI.  
   - *Output:* Ghi quyết định vào `QUYET_DINH.md`, đẩy việc vào hàng đợi Lxx, hồi âm 3 bước.  
   - *Ghép nối:* Nhúng vào app BKS hoặc app Điều hành chuyên sâu.
3. **M-HUB-03 (Sổ việc riêng cá nhân):**  
   - *Input:* Việc cần làm cá nhân của Sếp.  
   - *Output:* Danh sách to-do, tự động ẩn khi xong sau 24h.  
   - *Ghép nối:* Nhúng vào tab Tôi của mọi app.
4. **M-HUB-04 (Trung tâm Telegram Bot):**  
   - *Input:* Sự kiện khẩn cấp từ app con (`suKien` với `muc:'gap'`).  
   - *Output:* Tin nhắn tức thì qua Telegram API đến đúng Telegram ID người nhận.  
   - *Ghép nối:* Mọi module phát hiện sự cố (KPI trượt, phàn nàn) đều gọi được.
5. **M-HUB-05 (Xác thực SSO & Token HMAC):**  
   - *Input:* Khóa `HUB_KHOA`, Mã người dùng.  
   - *Output:* Token `h1.<ma>.0.<chuKyHMAC>` không thời hạn.  
   - *Ghép nối:* Khóa chung cho 100% app trong hệ sinh thái.

---

### 📊 NHÓM 2: KPI TOÀN VIỆN (`30_KPI_ToanVien`)
1. **M-KPI-01 (Bộ đệm đọc TV3 Read-Only):** Cache 6h dữ liệu doanh thu, chặn 100% quyền ghi.  
2. **M-KPI-02 (Bản tin tạm tính tháng):** Tự động phân định doanh thu trực tiếp & gián tiếp, so sánh tiến độ với hạn mức AOP tháng.  
3. **M-KPI-03 (Soát lỗi chốt quý):** Quét 8 quy tắc toàn vẹn, phát hiện lệch số, thiếu dòng, sai công thức.  
4. **M-KPI-04 (Giám sát & Thẩm định AOP):** Phân tích tốc độ tiêu hao ngân sách (Burn rate) và nhịp độ doanh thu theo mẫu 16 tab AOP.  
5. **M-KPI-05 (Nháp báo cáo quý sang Docs):** Tự động điền số liệu chốt vào văn bản Google Docs chuẩn formatted.

---

### 🎓 NHÓM 3: TUYỂN SINH & NHÂN LỰC (`60_TuyenSinh`)
1. **M-TS-01 (Quản trị chiến dịch):** Thiết lập chu kỳ 1 trường x 1 bậc x 1 đợt (CD01, CD02, CD03).  
2. **M-TS-02 (Cổng thu thập Lead Web):** Nhận POST `lead_web`, chống spam 1 SĐT/10p, bẫy honeypot. *(Ghép làm cổng đặt lịch khám online phòng khám).*  
3. **M-TS-03 (Bảng tính hoa hồng bậc thang):** Tính hoa hồng lũy tiến 6 bậc cho CTV/đại lý, tự động reset theo đợt.  
4. **M-TS-04 (Quản lý phễu ứng viên CRM):** Theo dõi luồng: Tiếp nhận → Tư vấn → Nộp hồ sơ → Nhập học → Hủy.

---

### 🩺 NHÓM 4: KHẢO SÁT HÀI LÒNG NGƯỜI BỆNH (`70_KhaoSat`)
1. **M-KS-01 (Bộ tạo & Quản lý mẫu khảo sát):** Sinh biểu mẫu mobile tải nhanh dưới 1s, đa dạng loại câu hỏi.  
2. **M-KS-02 (Chấm điểm 5 trụ cột ACHSI):** Phân loại tự động 5 nhóm: Thủ tục, Tiện nghi, Bác sĩ, Điều dưỡng, Hướng dẫn sau khám.  
3. **M-KS-03 (Radar cảnh báo khẩn cấp 15p):** Phát hiện phiếu ≤ 2 sao hoặc phàn nàn, kích hoạt chuông báo Telegram trong 15 phút.  
4. **M-KS-04 (Phân tích xu hướng Bác sĩ/Khoa):** Bóc tách điểm số theo từng Bác sĩ điều trị và chuyên khoa khám.

---

### 🏥 NHÓM 5: PHÒNG KHÁM MỚI (`21_PhongPTKH` - Mã PK)
1. **M-PK-01 (Báo cáo ngày ca trực):** Nộp số liệu lượt khám, doanh thu ngày và tồn đọng ca trực.  
2. **M-PK-02 (Upload minh chứng ảnh Drive):** Nén ảnh, tự động phân loại và lưu trữ theo cú pháp mã nhân viên lên Google Drive.  
3. **M-PK-03 (Phân công việc theo ca):** Theo dõi tiến độ công việc trong ngày, hỗ trợ tích chọn hoàn tất.  
4. **M-PK-04 (Ma trận xếp lịch tuần & Đổi ca):** Xếp ca trực, quản lý xin nghỉ, kiểm tra xung đột nhân sự. *(Ghép lên Hub báo bác sĩ trực).*  
5. **M-PK-05 (Hòm thư góp ý nội bộ):** Ý kiến phản ánh nội bộ được ẩn danh bảo vệ người gửi.

---

### 📁 NHÓM 6: CÁC MODULE DI SẢN CỦA PTKH (`20_PTKH` - KHO TRI THỨC CỐT LÕI)
*(Toàn bộ logic nghiệp vụ đã kiểm chứng qua thực tế, sẵn sàng tái sử dụng)*
1. **M-PTKH-01 (Cảm nhận ngày làm việc):** Thu thập cảm xúc (1-5 sao) và 1 dòng cảm nhận sau ca để đo sức khỏe tinh thần đội ngũ (Team Morale).  
2. **M-PTKH-02 (Quy trình duyệt báo cáo 2 cấp):** Tổ trưởng duyệt số liệu → Lãnh đạo phòng ký xác nhận, chống sửa số liệu sau duyệt.  
3. **M-PTKH-03 (Bóc tách tăng ca & Bù giờ TC-NS):** Tự động bóc tách giờ tăng ca ngày thường, ngày nghỉ, ngày lễ gửi kế toán tính lương.  
4. **M-PTKH-04 (Kiểm soát vi phạm NTC tuần & Trừ công):** Đếm số lần nộp trễ/chưa nộp: vượt 3 lần tự động trừ 0.5 ngày công kỷ luật.  
5. **M-PTKH-05 (Bộ xử lý dữ liệu khảo sát F.KS 34.000 dòng):** Thuật toán gom nhóm dữ liệu lớn nối dài xu hướng từ quá khứ đến hiện tại.  
6. **M-PTKH-06 (Bảng điểm hiệu suất cá nhân):** Tính điểm thi đua tháng (A, B, C) theo công thức trọng số 20/10.

---

### 🌐 NHÓM 7: XƯỞNG WEB TĨNH (`03_XuongWeb`)
1. **M-WEB-01 (Kiến trúc phễu lặn biển):** Khung trang đích dẫn dắt tâm lý từ 0m đến -105m.  
2. **M-WEB-02 (Sinh mã tĩnh đa nền tảng):** Tự động xuất HTML Tailwind lên Cloudflare Pages, Netlify, Vercel.  
3. **M-WEB-03 (Cổng nhúng VietQR SePay):** Sinh mã VietQR động, xác nhận thanh toán tự động qua webhook ngân hàng.

---

### ⚙️ NHÓM 8: ĐỘNG CƠ TỰ ĐỘNG HÓA & TRÍ TUỆ NHÂN TẠO (`_TacVu`)
1. **M-TACVU-01 (Lập phiếu kế hoạch 10h57/22h57):** Phân tích hàng đợi Lxx, lập phiếu việc chuẩn.  
2. **M-TACVU-02 (Viết mã tự động mỗi giờ :27):** Viết mã tự động theo phiếu đã duyệt, tự kiểm tra trước khi nộp.  
3. **M-TACVU-03 (Kiểm thử & Rà soát UX 21h22/08h22):** Chạy unit test, đo kích thước màn hình 375px/1280px.  
4. **M-TACVU-04 (Xuất bản & Đưa lên app 09h52/16h52):** Chốt số phiên bản v1.Y.Z, đẩy lên môi trường thật.  
5. **M-TACVU-05 (Cầu nối AI kép Claude ↔ Antigravity):** Phối hợp năng lực chuyên sâu của 2 mô hình AI qua hộp thư.  
6. **M-TACVU-06 (Bộ nhớ Obsidian Second Brain):** Lưu trữ tri thức dài hạn, liên kết hai chiều `[[wiki-links]]`.
