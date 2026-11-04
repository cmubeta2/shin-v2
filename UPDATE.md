# KẾ HOẠCH NÂNG CẤP PHIÊN BẢN (UPDATE.md) – SHIN v2

*Tài liệu quản trị phiên bản bắt buộc cho kho `shin-v2`.*  
*Phiên bản hiện tại: **v2.7.2** · Cập nhật ngày: **04/11/2026**.* · Hợp đồng cổng cho v1: **[HOP_DONG_CONG_V2.md](HOP_DONG_CONG_V2.md)**.  
*Danh mục micro-module, hợp đồng I/O, hiện trạng và tiêu chí hoàn thành chi tiết: **[QUY_HOACH_10_MANG_AIOS.md](QUY_HOACH_10_MANG_AIOS.md)** (mục 2, 3, 6).*

> **Nguyên tắc (Sếp chốt 29/10):** v2 là bản làm lại gom về 1 chỗ của hệ v1 – **v2 chạy trên chính các máy chủ v1**, không tạo cơ sở dữ liệu mới, không sửa giao diện v1. Việc gì v1 đã mở cổng web `web*` thì v2 làm ngay; việc gì v1 chưa có cổng thì phải mở cổng ở v1 trước (làm trong thư mục `He sinh thai Shin`), rồi v2 mới dựng màn.

---

## 1. LỘ TRÌNH PHÁT TRIỂN PHIÊN BẢN (v2.Y.Z)

Theo quy ước số phiên bản đã được Sếp duyệt:
- **X = 2:** Phiên bản hợp nhất 1 web duy nhất (Sếp quyết định).
- **Y:** Số thứ tự của bản cập nhật đưa lên GitHub Pages.
- **Z:** Số lần sửa đổi bên trong đợt cập nhật.

```
 [v2.1.1] ✅ ──► [v2.2.0] ✅ ──► [v2.3.0] ✅ ────► [v2.4.0] 🟡 ────► [v2.5.0] 🟡 ────► [v2.6.0]
 Vá lỗi,        P1: Hub, KPI,   Dùng nốt cổng    Cổng mới ở v1:   Dịch vụ chung   PWA, RBAC,
 Quy hoạch 2.0  TS nối thật     v1 đã có (KPI,   PK, KS, PTKH     0B → CRM → Dự   tên miền
                                TS, Điều hành)   (làm ở v1 trước) án → Tài chính
```

---

## 2. CHI TIẾT CÁC PHIÊN BẢN

### PHIÊN BẢN v2.7.2 ✅ – KHẢO SÁT GỌI ĐÚNG CỔNG THẬT KS v1.4.3 (04/11/2026)
- **Mục tiêu:** KS v1 không có `webTongQuan` ➜ màn 🩺 Khảo sát dùng đúng cổng đã lên app (L1–L4).
- **Nội dung hoàn tất:**
  1. `khaosat.js`: `webDsKhaoSat` + `webKetQuaKS` song song (≤ 6 KS, ưu tiên Đang mở) ➜ Hero (KS đang mở · phiếu hợp lệ · chờ xác minh), điểm TB câu 5 mức theo KS, câu TB ≤ 2★ nổi lên đầu; nút ⬇ CSV gọi `webXuatKS` tải tệp về máy.
  2. KS nhận `du` là đối tượng (không `du.a`) – sửa HOP_DONG_CONG_V2.md mục KS theo mã v1, bỏ yêu cầu `webTongQuan`.
  3. Một vài KS lỗi đọc kết quả ➜ dải vàng nói rõ số KS lỗi, các số còn lại vẫn là số thật.
- **Còn chờ v1:** 5 trụ ACHSI (câu hỏi KS chưa gắn mã trụ) – cần dòng v1 nếu Sếp muốn radar 5 trụ.

---

### PHIÊN BẢN v2.7.1 ✅ – MỞ SHIN v2 TRONG TELEGRAM MINI APP (04/11/2026)
- **Mục tiêu:** nút Menu bot Shin mở https://cmubeta2.github.io/shin-v2/ trong Telegram, tự đăng nhập không cần link token (HUB L8 đã lên Hub v1.13.3).
- **Nội dung hoàn tất:**
  1. `js/api.js`: `docInitDataTelegram()` (Telegram.WebApp.initData hoặc `#tgWebAppData`) + `dangNhapTelegram()` gọi cổng Hub `webTelegram` ➜ lưu token Hub 12 giờ.
  2. `js/app.js`: mở trong Telegram ➜ xóa hash (không lộ chữ ký), đổi token trước rồi mới tải Live; Telegram chưa gắn tài khoản ➜ toast vàng, giữ token cũ.
  3. `index.html`: chống nhúng khung vẫn giữ, chỉ cho phép đúng `web.telegram.org` (Telegram Web chạy Mini App trong iframe).
- **Còn chờ anh (V20):** @BotFather ➜ Bot Settings ➜ Menu Button / Mini App URL = https://cmubeta2.github.io/shin-v2/ ; Hub cần Script Property `TG_KHOA` (đã có từ L5a) và người dùng có ChatTelegram trong sổ NguoiDung.
- **Chưa kiểm được:** đăng nhập thật trong Telegram (cần anh mở từ bot). Demo 1280 / ~580px: 0 lỗi console.

---

### PHIÊN BẢN v2.7.0 ✅ – PHÒNG PTKH NỐI THẬT APP PK v1.0.7 (04/11/2026)
- **Mục tiêu:** màn 🏥 Phòng PTKH (Mảng 5) chạy số thật trên cổng `web*` của app PK `21_PhongPTKH` (L1–L5 đã lên app v1.0.7).
- **Nội dung hoàn tất:**
  1. 9 thẻ: 🏠 Hôm nay (`webKhoiDong` + `webHomNay`), ✅ Công việc (+25% tiến độ có Hoàn tác 6s, thêm việc của tôi), 📝 Báo cáo ngày (form theo `mau` + ảnh nén → `webNopBaoCao`, lịch sử), 📅 Lịch tuần + đơn nghỉ (chỉ đọc), 🔔 Thông báo (đọc tất cả có Hoàn tác), ☑️ Duyệt báo cáo (tổ trưởng/admin: Đạt / Duyệt tất cả có Hoàn tác, Trả lại bắt buộc lý do), 👥 Nhân sự (quản lý), 💬 Góp ý, 👤 Hồ sơ.
  2. Sửa cách gọi: app PK nhận `du` là đối tượng (`ham(token, du)`), không phải `du.a` – HOP_DONG_CONG_V2.md đã sửa theo mã v1.
  3. Lỗi cổng ở từng thẻ ➜ khung đỏ + Thử lại, không thay bằng số mẫu. Demo dùng `SHIN_DEMO_DATA.phongkhamV1` (dữ liệu giả cùng khuôn).
- **Còn chờ (PTKH gốc, mục c):** `ptkh.js` đọc thẳng PTKH qua `webGoi` (`webDashboard`) chưa làm – khuôn trả rất lớn, cần chốt tập trường cho v2 trong HOP_DONG_CONG_V2.md mục PTKH trước; URL PTKH lấy từ `lienKet.PTKH` của Hub, không chép /exec vào kho công khai.
- **Còn chờ v1:** duyệt đơn nghỉ / xin nghỉ / xếp lịch (PK chuyển cho PTKH `webGoi`; v2 chưa gọi thẳng PTKH) – v2 mở app PK cho việc này.
- **Kiểm:** Chrome chạy ngầm 1280px và ~580px (trình ngầm không thu dưới 500px): 16 mục menu + 9 thẻ PK mở đúng, 0 lỗi console, không cuộn ngang.

---

### PHIÊN BẢN v2.6.5 ✅ – QUY CHUẨN MASTER UX/UI & HỆ PHÒNG NGỰ 12 LỖI VẶT (01/11/2026)
- **Mục tiêu:** Rà soát và xuất bản Quy chuẩn Thiết kế Giao diện SHIN Master (v2.6.4/v2.6.5) đồng bộ 100% với hiện trạng AIOS v2, tích hợp cẩm nang triệt tiêu 12 lỗi vặt.
- **Nội dung hoàn tất:**
  1. Quy chuẩn hóa 10 Nguyên tắc bất biến: Mobile 320px, Touch Target ≥ 44px, iOS Auto-Zoom 16px, Hero Card, Toast 6s & Double-Tap 5s.
  2. Đồng bộ 8 Palettes, 4 Chế độ hiển thị, 3 Mức font scale.
  3. Cập nhật các module v2.6.4 gần đây: Đánh giá văn hóa hành vi 5T, Radar SVG 5 trục, In ấn phiếu A4, PWA offline, Anti-flicker script, Rail mép trái 66% (body.kieu-mep).
  4. Đưa ra cẩm nang xử lý 12 lỗi vặt kinh điển và checklist DoD 15 điểm trước khi xuất xưởng.
  5. Đồng bộ hóa 3 file THIET_KE_GIAO_DIEN_SHIN.md trên toàn hệ sinh thái.

---

### PHIÊN BẢN v2.6.4 ✅ – MODULE ĐÁNH GIÁ VĂN HÓA HÀNH VI 5T (01/11/2026)
- **Mục tiêu:** Xây dựng module đánh giá văn hóa hành vi 5T cốt lõi tham chiếu phương pháp luận Bộ 83 Tiêu chí Chất lượng Bộ Y tế, số hóa trên SHIN AIOS và tích hợp Second Brain.
- **Nội dung hoàn tất:**
  1. Xây dựng 2 phân hệ: Thư viện 76 tiểu mục và Bàn làm việc đánh giá lũy tiến 5 mức.
  2. Tích hợp thuật toán tính điểm bậc thang, bắt điểm liệt Mức 1.
  3. Trực quan hóa biểu đồ Radar 5 cánh (Trung thực, Trách nhiệm, Thấu cảm, Tận tâm, Tri ân).
  4. Hỗ trợ in ấn / xuất phiếu tổng hợp A4 chuẩn quy cách hành chính.
  5. Xuất bản trang web độc lập `danhgia5t.html` và tích hợp kho tri thức Obsidian (`Wiki/References/bo-tieu-chi-danh-gia-van-hoa-hanh-vi-5t.md`).

---

### PHIÊN BẢN v2.2.0 ✅ – NỐI THẬT ĐỢT P1 (29/10/2026)
- Tầng API theo đúng giao thức `00_Loi/Loi_Web.gs`; báo lỗi rõ ràng, không lặng lẽ thay số thật bằng số mẫu; đo độ trễ 5 máy chủ; xóa `?t=` khỏi thanh địa chỉ.
- **Hub:** Hôm nay (`webHomNay`, `webLamMoi`) · 🔔 Thông báo (`webThongBao`, `webDanhDauDoc`) · 📝 Việc riêng (`webViecRieng`, `webLuuViecRieng`) có Hoàn tác 6s thật.
- **KPI:** Bản tin tạm tính (`webBanTin`). **TS:** Chiến dịch (`webKhoiDong`) + phễu, hoa hồng, lead (`webLeadCD`).
- **Phân quyền:** hỏi `webKhoiDong` từng app, app nào từ chối thì ẩn khỏi menu.
- **Chưa làm trong đợt này (đã ghi rõ trên màn):** KS, PK chưa có cổng số liệu ở v1; Phê duyệt 1-chạm, CRM, Dự án, Công việc, Tri thức chưa có máy chủ.

---

### PHIÊN BẢN v2.3.0 ✅ – DÙNG NỐT CÁC CỔNG v1 ĐÃ CÓ (30/10/2026, không sửa v1)
- Xong cả 3 nhóm bên dưới, trừ chỉnh nháp AOP năm sau: cần v1 thêm `webNhap2027` vào `congWeb_()` (đã ghi ở HOP_DONG_CONG_V2.md).
| App | Cổng đã có ở v1 | Màn v2 sẽ dựng |
|---|---|---|
| Hub | `webDieuHanh`, `webHopThu` | Tab 🧭 Điều hành 2 chiều ngay trong v2 (hiện đang mở Hub v1) |
| KPI | `webSoatLoi`, `webAOP`, `webBaoCaoQuy`, `webLuuTangTruong` | Soát lỗi chốt quý · Phân bổ AOP · Nháp báo cáo quý · AOP 2027 |
| TS | `webLuuLead`, `webThemNhatKy`, `webChuyenCD`, `webXoaLead`, `webLuuChienDich`, `webChepChienDich` | Form lead (chỉ ô bắt buộc + "＋ Thêm chi tiết"), nhật ký, chuyển chiến dịch, sửa chiến dịch (Admin) |
- **Hoàn thành khi:** mỗi màn cho cùng số với app v1 tương ứng (bảng đối chiếu v1↔v2 từng màn – đúng nghiệm thu P1 của kế hoạch AGY); thao tác ghi tạo đúng 1 dòng trên sheet.

---

### PHIÊN BẢN v2.4.0 🟡 – MỞ CỔNG MỚI Ở v1 RỒI DỰNG MÀN v2
- **Phía v2 xong (30/10):** màn KS (`webTongQuan`), PK (`webHomNay`) dựng theo HOP_DONG_CONG_V2.md; chưa có cổng ➜ dải vàng + số mẫu.
- **Còn chờ v1:** KS L1–L4, PK L1–L3 đang ⏸ trong hàng đợi v1 – anh duyệt / giao (dùng ⚡ Giao việc trong 🧭 Điều hành).
- **PK (`21_PhongPTKH`, thay PTKH trong v2):** thêm cổng báo cáo ngày + minh chứng ảnh, lịch trực, công việc ca.
- **KS (`70_KhaoSat`):** thêm cổng phiếu khảo sát, 5 trụ ACHSI, radar ≤ 2★.
- **PTKH (`20_PTKH`):** chỉ thêm `webGoi` (không đổi gì khác), kiểm thử PTKH cũ vẫn đạt 100% (`kiem_tra_tat_ca.js`) – theo P2/P3 của kế hoạch AGY.
- **Hoàn thành khi:** bộ kiểm thử của từng app v1 vẫn đạt đủ; màn v2 cho cùng số với v1.

---

### PHIÊN BẢN v2.5.0 🟡 – DỊCH VỤ CHUNG & MẢNG MỚI (cần máy chủ mới trên Hub, theo Q1)
- **Phía v2 xong (30/10):** Phê duyệt 1-chạm, CRM, Dự án (Flash 4 khối), 💰 Tài chính – đọc cổng Hub theo HOP_DONG_CONG_V2.md; thanh menu trái mới.
- **Còn chờ v1:** Hub mở 4 nhóm cổng (giao 4 dòng HUB theo bảng cuối HOP_DONG_CONG_V2.md).
Thứ tự theo phản biện của AGY (cái sau dùng lại cái trước): **0B Dịch vụ chung** (phê duyệt 1-chạm, máy báo cáo theo mẫu, trục việc chung) → **CRM** → **Dự án** (Daily Flash 4 khối) → **Tài chính**.
- **Hoàn thành khi:** phê duyệt ghi `Log_Duyet` và trả kết quả về mảng gốc; Hoàn tác 6s không gửi gì; mỗi phiếu ghi đúng 1 lần.

---

### PHIÊN BẢN v2.6.0 – PWA, PHÂN QUYỀN & TÊN MIỀN RIÊNG
- `manifest.webmanifest` + `sw.js` (mở tức thì, cài lên màn hình chính); ma trận RBAC M0.2; tên miền chính thức + SSL; mã hóa token trong IndexedDB.

---

### PHIÊN BẢN v2.7.0 – MỞ RỘNG
Tăng trưởng (Marketing + Web phễu) · LMS · Đồ thị tri thức · Trích bài học từ báo cáo · Tầng 3 Gói tư vấn số.

---

## 3. QUY TẮC MỖI ĐỢT CẬP NHẬT
1. Cập nhật `CHANGELOG.md`, file này và số phiên bản trên Header (`js/app.js`, `index.html`).
2. Kiểm tra ở bề rộng 375px và 1280px: mọi mục menu mở đúng màn hình, không cuộn ngang, không lỗi console.
3. Cập nhật cột trạng thái ✅ / 🟡 / ⬜ trong `QUY_HOACH_10_MANG_AIOS.md` mục 2.
4. Rà `js/demo_data.js` để chắc chắn không có dữ liệu thật trước khi đẩy lên kho công khai.
5. **Sếp chốt 30/10:** mỗi lần đẩy bản mới thì tự tạo PR vào `main` và trộn luôn, để web (GitHub Pages) luôn chạy bản mới nhất – không cần hỏi lại.
6. **Sếp chốt 30/10:** web luôn cài được như ứng dụng ở mọi nền tảng (PWA). Thêm / đổi tệp JS, CSS, icon ➜ cập nhật danh sách `VO_APP` và tăng `PHIEN_BAN_SW` trong `sw.js`.
7. **Sếp chốt 30/10 – thông báo (toast):** chỉ hiện khi người dùng không tự thấy kết quả trên màn (lỗi, nhắc ô thiếu, Hoàn tác, bấm 2 lần, việc gửi đi mà màn không đổi). Chỉnh cài đặt và thao tác đã thấy ngay trên màn thì KHÔNG hiện thông báo.
