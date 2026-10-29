# KẾ HOẠCH NÂNG CẤP PHIÊN BẢN (UPDATE.md) – SHIN v2

*Tài liệu quản trị phiên bản bắt buộc cho kho `shin-v2`.*  
*Phiên bản hiện tại: **v2.1.0** · Cập nhật ngày: **29/10/2026**.*

---

## 1. LỘ TRÌNH PHÁT TRIỂN PHIÊN BẢN (v2.Y.Z)

Theo quy ước số phiên bản đã được Sếp duyệt:
- **X = 2:** Phiên bản hợp nhất 1 web duy nhất (Sếp quyết định).
- **Y:** Số thứ tự của bản cập nhật đưa lên GitHub Pages.
- **Z:** Số lần sửa đổi bên trong đợt cập nhật.

```
 [v2.0.0] HOÀN TẤT ──────► [v2.1.0] HOÀN TẤT ──────► [v2.2.0] KẾT NỐI SÂU ──────► [v2.3.0] PWA OFFLINE
 1 Web đa module           Thập diện Decagon (10 mảng) Nối sâu form nộp GAS        Service Worker
 8 Bộ màu chuẩn UX         Hộp thư Duyệt 1-chạm       Nộp báo cáo PK thật         Cài đặt màn hình chính
 GitHub Pages trực tuyến   Flash Report 4 khối DA     Ghi nhận lead CRM thật      Thông báo Web Push
```

---

## 2. CHI TIẾT CÁC PHIÊN BẢN KẾ TIẾP

### PHIÊN BẢN v2.2.0 – KẾT NỐI FORM THỰC CHIẾN 5 ENDPOINT APPS SCRIPT
- **Mục tiêu:** Hoàn thiện giao tiếp 2 chiều giữa v2 và 5 máy chủ Apps Script khi chạy ở Chế độ Trực tiếp (`🟢 Live Mode`), cho phép ghi dữ liệu thật từ v2 về Google Sheets.
- **Nội dung thực hiện:**
  1. `HUB`: Đồng bộ danh sách công việc thời gian thực từ `webHomNay`, hỗ trợ đánh dấu hoàn tất trực tiếp trên v2.
  2. `KPI`: Tải dữ liệu TV3 thật từ `webBanTin` và `webAOP`, hỗ trợ mở báo cáo quý.
  3. `TS`: Nối cổng tiếp nhận hồ sơ `webLeadCD` và hiển thị chi tiết hoa hồng bậc thang thực tế.
  4. `KS`: Cho phép người bệnh điền phiếu khảo sát trực tiếp trên giao diện v2 và gửi về `70_KhaoSat`.
  5. `PK`: Cho phép nhân viên nộp Báo cáo ngày, tải ảnh minh chứng (Base64) trực tiếp vào Drive của phòng khám qua `21_PhongPTKH`.
  6. `PD`: Phê duyệt 1-chạm gửi tín hiệu duyệt về Sheet `Log_Duyet` của máy chủ.

---

### PHIÊN BẢN v2.3.0 – BIẾN THÀNH PWA CHUẨN (PROGRESSIVE WEB APP)
- **Mục tiêu:** Nâng cấp web thành ứng dụng có thể cài đặt trực tiếp lên màn hình chính điện thoại (Android & iOS), hoạt động không cần mạng qua bộ nhớ đệm Cache API.
- **Nội dung thực hiện:**
  1. Bổ sung `manifest.webmanifest` chuẩn với icon 192px và 512px.
  2. Cài đặt `sw.js` (Service Worker) lưu trữ tài nguyên tĩnh để mở app tức thì (< 0.5s).
  3. Hiển thị banner hướng dẫn người dùng "Thêm vào màn hình chính" trên Safari iOS và Chrome Android.

---

### PHIÊN BẢN v2.4.0 – TÊN MIỀN RIÊNG & BẢO MẬT NÂNG CAO
- **Mục tiêu:** Gắn tên miền chính thức khi Sếp đăng ký (ví dụ: `shin.app` hoặc `dieuhanh.thanhvumedic.com`).
- **Nội dung thực hiện:**
  1. Cấu hình CNAME trên Cloudflare / GitHub Pages.
  2. Bật chứng chỉ SSL/TLS tự động.
  3. Mã hóa lưu trữ token trong IndexedDB thay cho localStorage thông thường.
