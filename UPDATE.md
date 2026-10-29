# KẾ HOẠCH NÂNG CẤP PHIÊN BẢN (UPDATE.md) – SHIN v2

*Tài liệu quản trị phiên bản bắt buộc cho kho `shin-v2`.*  
*Phiên bản hiện tại: **v2.1.1** · Cập nhật ngày: **29/10/2026**.*  
*Danh mục micro-module, hợp đồng I/O, hiện trạng và tiêu chí hoàn thành chi tiết: **[QUY_HOACH_10_MANG_AIOS.md](QUY_HOACH_10_MANG_AIOS.md)** (mục 2, 3, 6).*

---

## 1. LỘ TRÌNH PHÁT TRIỂN PHIÊN BẢN (v2.Y.Z)

Theo quy ước số phiên bản đã được Sếp duyệt:
- **X = 2:** Phiên bản hợp nhất 1 web duy nhất (Sếp quyết định).
- **Y:** Số thứ tự của bản cập nhật đưa lên GitHub Pages.
- **Z:** Số lần sửa đổi bên trong đợt cập nhật.

```
 [v2.0.0] ✅ ──► [v2.1.0] ✅ ──► [v2.1.1] ✅ ──► [v2.2.0] ──► [v2.3.0] ──► [v2.4.0] ──► [v2.5.0] ──► [v2.6.0]
 1 Web đa       Decagon 10     Vá lỗi bản     Ghi dữ liệu   Mảng 2,3,6,7  Mảng 8 +     PWA + RBAC   LMS, Phễu,
 module         mảng, Duyệt    công khai,     thật 5 máy    liên thông,   tự động hóa  + Tên miền   Đồ thị tri
 8 bộ màu       1-chạm, Flash  Quy hoạch 2.0  chủ Apps      Tài chính,    nhân sự,     riêng        thức
                                              Script        Task Bus      SLA Telegram
```

---

## 2. CHI TIẾT CÁC PHIÊN BẢN KẾ TIẾP

### PHIÊN BẢN v2.2.0 – GHI DỮ LIỆU THẬT QUA 5 MÁY CHỦ APPS SCRIPT
- **Mục tiêu:** Giao tiếp 2 chiều giữa v2 và 5 máy chủ Apps Script ở Chế độ Trực tiếp (`🟢 Live`), ghi dữ liệu thật về Google Sheets.
- **Nội dung thực hiện:**
  1. `api.js`: mỗi màn hình gọi đúng hành động của mình (thay cho `webHomNay` chung); thêm `maYeuCau` chống ghi trùng; đo thời gian phản hồi từng máy chủ (M0.4).
  2. `HUB`: đồng bộ việc từ `webHomNay`, đánh dấu hoàn tất ngay trên v2.
  3. `KPI`: tải dữ liệu TV3 thật từ `webBanTin` và `webAOP` (chỉ đọc).
  4. `TS`: nối cổng nhận hồ sơ `webLeadCD`, hiển thị hoa hồng bậc thang thực tế.
  5. `KS`: người bệnh điền phiếu khảo sát trên v2 và gửi về `70_KhaoSat`.
  6. `PK`: nhân viên nộp Báo cáo ngày + ảnh minh chứng (Base64) vào Drive qua `21_PhongPTKH`.
  7. `PD`: Phê duyệt 1-chạm ghi về Sheet `Log_Duyet`; badge ⚡ đếm theo số phiếu thật.
  8. Toast **Hoàn tác 6s thật**: lệnh ghi chỉ gửi đi khi hết 6 giây.
  9. Công tắc Bật/Tắt mảng (M0.1) ẩn/hiện mục tương ứng trong menu ☰.
- **Hoàn thành khi:** mỗi lệnh ghi tạo đúng 1 dòng trong Sheet (kể cả bấm 2 lần); bấm Hoàn tác trong 6s ➜ không có dòng nào; tắt 1 mảng ➜ biến mất khỏi menu sau khi tải lại.

---

### PHIÊN BẢN v2.3.0 – LIÊN THÔNG MẢNG 2, 3, 6, 7
- **Nội dung thực hiện:**
  1. Module mới `taichinh` (Mảng 3): VietQR SePay, sổ chi phí phát sinh, chi trả hoa hồng, đề nghị tạm ứng → Phê duyệt 1-chạm.
  2. CRM: pipeline B2B 5 bước, tiếp nhận lead, nhắc chăm sóc.
  3. Dự án: nộp Flash Report 4 khối thật, Blocker Matrix, trình duyệt đề xuất chi.
  4. Task Bus (M7.1): phàn nàn ≤ 2★, KPI trượt, vướng mắc dự án tự sinh việc trên Kanban.
  5. Smart Lead Dispatcher (M8.3): lead tuyển sinh → Mảng 4, tư vấn/KSK DN → CRM, đặt lịch khám → máy chủ PK.
  6. Tìm kiếm tri thức trong trình duyệt (M9.2).
- **Hoàn thành khi:** lead thử về đúng mảng; phiếu ≤ 2★ tự hiện việc trên Kanban; đề xuất chi dự án đi qua Phê duyệt và vào sổ chi phí.

---

### PHIÊN BẢN v2.4.0 – TĂNG TRƯỞNG & TỰ ĐỘNG HÓA NHÂN SỰ
- **Nội dung thực hiện:**
  1. Module mới `tangtruong` (Mảng 8): lịch nội dung đa kênh, AI Copywriter, chốt chặn duyệt bài trước khi đăng.
  2. Nhân sự: bóc tách tăng ca TC-NS (xuất cho Kế toán), kiểm soát vi phạm NTC, Team Morale Index.
  3. Giám sát SLA Xanh → Vàng → Đỏ và báo Telegram khi sắp quá hạn.
  4. Bàn điều hành 2 chiều 🧭 và nhật ký động cơ AI 4 ca.
  5. Tường lửa `KHONG_DUA_VAO.md` trước mọi lời gọi AI.
- **Hoàn thành khi:** bài chưa duyệt không thể xuất bản; việc quá hạn đổi đỏ và báo Telegram; bảng TC-NS khớp file kế toán tháng mẫu.

---

### PHIÊN BẢN v2.5.0 – PWA, PHÂN QUYỀN & TÊN MIỀN RIÊNG
- **Nội dung thực hiện:**
  1. `manifest.webmanifest` (icon 192px, 512px) + `sw.js` lưu tài nguyên tĩnh, mở app tức thì (< 0,5s); banner "Thêm vào màn hình chính" cho Safari iOS và Chrome Android.
  2. Ma trận RBAC (M0.2): nhân viên chỉ thấy mảng được cấp quyền; việc tự phân luồng theo quyền; danh bạ nhân sự.
  3. Cổng cấp token SSO (M0.3).
  4. Gắn tên miền chính thức (ví dụ `dieuhanh.thanhvumedic.com`) qua CNAME, SSL tự động; mã hóa token trong IndexedDB thay cho localStorage.
- **Hoàn thành khi:** mở app khi mất mạng; tài khoản nhân viên không thấy mảng ngoài quyền; điểm Lighthouse PWA đạt.

---

### PHIÊN BẢN v2.6.0 – MỞ RỘNG
LMS mini (M4.5) · Phễu Lặn Biển & xuất bản đa nền tảng (M8.5) · Báo cáo hiệu suất truyền thông (M8.6) · Đồ thị tri thức `[[wiki-links]]` (M9.3) · Trích bài học từ báo cáo (M9.4) · Khởi động Tầng 3 Gói Tư vấn số. Phiếu chi tiết lập khi bắt đầu đợt.

---

## 3. QUY TẮC MỖI ĐỢT CẬP NHẬT
1. Cập nhật `CHANGELOG.md`, file này và số phiên bản trên Header (`js/app.js`, `index.html`).
2. Kiểm tra ở bề rộng 375px và 1280px: mọi mục menu mở đúng màn hình, không cuộn ngang, không lỗi console.
3. Cập nhật cột trạng thái ✅ / 🟡 / ⬜ trong `QUY_HOACH_10_MANG_AIOS.md` mục 2.
4. Rà `js/demo_data.js` để chắc chắn không có dữ liệu thật trước khi đẩy lên kho công khai.
