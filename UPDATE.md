# KẾ HOẠCH NÂNG CẤP PHIÊN BẢN (UPDATE.md) – SHIN v2

*Tài liệu quản trị phiên bản bắt buộc cho kho `shin-v2`.*  
*Phiên bản hiện tại: **v2.13.19** · Cập nhật ngày: **10/11/2026**.* · Hợp đồng cổng cho v1: **[HOP_DONG_CONG_V2.md](HOP_DONG_CONG_V2.md)**.  
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

### PHIÊN BẢN v2.13.19 ✅ – 🌊 XƯỞNG PHỄU LẶN BIỂN M8.5 (10/11/2026, lượt tự động ⑤ 12h – mục ⬜ cuối của Mảng 8, không cần cổng v1)
- **Bối cảnh:** lịch T2–T6 xong, hộp agy trống; T7 (đối chiếu + RC) giữ đúng ngày. M8.5 là mục Mảng 8 còn trống duy nhất làm được thuần phía trình duyệt.
- **Nội dung:** 📣 Marketing ➜ khối "🌊 Xưởng phễu Lặn Biển": điền 5 tầng 0m ➜ -105m, kiểm đủ + link nút + từ cấm y tế, xem trước, tải `index.html` tĩnh tự chứa, hướng dẫn đăng Netlify / Cloudflare Pages / Vercel; nháp lưu máy, nạp mẫu / xóa có Hoàn tác 6s.
- **Kiểm:** node --check; 12 phép thử hàm thuần (link chặn `javascript:` + dấu nháy, thoát HTML, hỏi đáp, độ sâu, từ cấm); Edge headless 17 màn × 375 / 1280 mở hết `<details>` – 📣 Marketing 0 cuộn ngang, 0 lỗi console.
- **Còn chờ v1:** đăng tự động 1 chạm + form thu lead về Tuyển sinh / CRM (cổng `lead_web`).
- **Ghi chú rà UX (để T7):** màn 🎓 Tuyển sinh khi mở hết khối gập có 33 nhãn `.badge` 12px (< 14px).

### PHIÊN BẢN v2.13.18 ✅ – 🔍 RÀ UX SÂU TAB CON + GỘP NHẬP HỘ (10/11/2026, lượt tự động ⑤ 06h – kéo trước một phần T7)
- **Bối cảnh:** lịch T2–T6 xong; L26 đã nối (v2.12.2). Lượt 05h40 đã chép phiếu agy 11100334 thành v2.13.17 nhưng CHƯA đẩy (nhánh cục bộ) – lượt này đẩy cùng.
- **Nội dung:** rà UX sâu (bấm từng tab con mọi màn); chặn rung khi chưa có cử chỉ người dùng (sạch console); gộp khối 📝 Nhập hộ thẳng vào khaosat.js (`ModuleKsNhapHo.veKhoi`), bỏ style= nội dòng.
- **Kiểm:** node --check 3 tệp; Edge 375 / 1280 Demo: 17 màn + 126 tab con – 0 cuộn ngang, 0 chữ < 14px, 0 nút < 44px, 0 lỗi console; 🩺 Khảo sát hiện 1 nút nhập hộ (KS Đang mở), không còn dòng "chưa có trên v2".
- **Còn lại tuần:** T7 14/11 bảng đối chiếu v1↔v2 đầy đủ + cột trạng thái QUY_HOACH + chốt **v2.14.0 RC** (đúng ngày, không kéo trước); phiếu agy `ra-ux` T7 gửi lượt 04h07 14/11.

### PHIÊN BẢN v2.13.17 ✅ – 🎨 GIAO DIỆN QUẢN LÝ KHẢO SÁT (10/11/2026, viet-code 05h27 – chép phiếu agy 11100334_V2_M1.5_giao-dien)
- **Nội dung:** thẻ KS lưới 2 cột nút; form sửa câu dạng thẻ có STT + ▲▼ đổi thứ tự; Ngân hàng câu có tìm + chip lọc. Chi tiết: CHANGELOG 2.13.17.
- **Kiểm:** node --check; agy đo Edge 320/375/1280: 0 chữ < 14px, 0 nút < 44px, 0 cuộn ngang; Claude xem ảnh 375 form + ngân hàng: không chồng / cắt chữ.

### PHIÊN BẢN v2.13.16 ✅ – 📝 NHẬP HỘ PHIẾU GIẤY KHẢO SÁT (10/11/2026, lượt tự động ⑤ 04h – gỡ ⬜ cuối phía v2 của M1.5, cổng KS có sẵn)
- **Bối cảnh:** lịch tuần T2–T6 đã xong ở các lượt trước; T3 10/11 không còn mục mới. Mục ⬜ phía v2 còn lại của bảng đối chiếu P3 là nhập hộ phiếu giấy (`webNhapHo`, KS L2 v1.3.2, đã lên app).
- **Nội dung:** 🛠️ Quản lý khảo sát › 📝 Nhập hộ: nút theo từng khảo sát Đang mở ➜ đọc câu `webCongKhaiDocKS` ➜ form 10 loại câu ➜ kiểm (giống `loiPhieuKS` + CCCD / BHYT) ➜ Toast Hoàn tác 6s ➜ `webNhapHo` 1 lần (máy chủ ghi Kenh 'Nhập hộ' + người nhập; quyền Admin / Quản lý của KS). Khảo sát đã đóng / lỗi cổng ➜ khung đỏ, không thay bằng câu mẫu.
- **Kiểm:** node --check; 10/10 ca hàm thuần; Edge 375 / 1280 (Demo): 1 nút nhập hộ (KS Đang mở), form 5 câu, chọn 5★ + chọn nhiều đúng, thiếu câu bắt buộc ➜ toast nêu tên câu, 0 lần gọi mạng; giả lập Live: bấm đúp + Hoàn tác ➜ 0 lần gửi; bấm đúp lần 2 ➜ đúng 1 lần `webNhapHo` {CH001:4, CH002:'Có', CH003:[…]} rồi form xóa; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 nút < 44px.
- **Tạm:** gắn qua lớp bọc `ModuleKhaoSat.veQuanLy` + 1 inline min-width (khaosat.js / styles.css đang có phiếu agy 11100334 giao-dien) – gộp vào khaosat.js + styles.css khi phiếu trả.
- **Chờ anh:** nhập thử 1 phiếu thật ở 🩺 › 🛠️ › 📝 (lượt tự động không có token).
- **Còn lại tuần:** T7 14/11 rà UX + bảng đối chiếu đầy đủ + chốt **v2.14.0 RC**.

### PHIÊN BẢN v2.13.15 ✅ – 🛠️ QUẢN LÝ KHẢO SÁT TRÊN v2 (09/11/2026, lượt tự động ⑤ 18h – gỡ dòng 🟡 cuối của bảng đối chiếu P3, cổng KS có sẵn)
- **Bối cảnh:** lịch tuần T2–T6 đã xong ở các lượt trước; 0 phiếu agy V2 chờ. Dòng 🟡 phía v2 còn lại là form quản trị KS (app KS v1 "chỉ máy chủ, giao diện ở Shin v2" – trước đây chưa có màn nào để tạo khảo sát).
- **Nội dung:** 🩺 Khảo sát thêm khối 🛠️ Quản lý khảo sát: tạo / sửa (chọn câu từ ngân hàng ➜ `cauHinh`), ▶ Mở / ⏸ Đóng / ↩ Về nháp, ⧉ Nhân bản, 🗑 Xóa (Toast Hoàn tác 6s), 📚 ngân hàng câu (thêm / sửa / nhân bản), 🔑 cấp quyền (Admin). Cổng: `webLuuKhaoSat`, `webDoiTrangThaiKS`, `webNhanBanKS`, `webXoaKS`, `webDsCauHoi`, `webLuuCauHoi`, `webNhanBanCau`, `webLuuQuyen` (KS L1). Lỗi tải ngân hàng ➜ khung đỏ, vẫn lưu được phần thông tin, giữ câu cũ.
- **Kiểm:** node --check; 15 ca hàm thuần đạt; Edge 375 / 1280 (Demo): mở form sửa KS001 (3/4 câu đã tick), ngân hàng 4 câu, form câu "chọn 1" hiện ô lựa chọn, bấm đổi trạng thái / lưu ở Demo ➜ toast "Đang ở Demo", 0 lần gọi mạng; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 chữ < 14px.
- **Chưa làm:** nhập hộ phiếu giấy (`webNhapHo` có sẵn – cần form điền phiếu theo 10 loại câu, để tuần sau). Chưa thử ghi thật (lượt tự động không có token) – Chờ anh: mở 🩺 › 🛠️ tạo 1 khảo sát nháp thử.
- **Còn lại tuần:** T7 14/11 rà UX + bảng đối chiếu đầy đủ + chốt **v2.14.0 RC**.

### PHIÊN BẢN v2.13.14 ✅ – 🗓️ LỊCH CẢ TỔ CHO TỔ TRƯỞNG (09/11/2026, lượt tự động ⑤ 16h – dòng 🟡 bảng đối chiếu P3, cổng PK có sẵn)
- **Bối cảnh:** lịch tuần T2–T6 đã xong; mọi cổng v1 "shin-v2" đã lên app đều đã nối (HUB L26, L29; KPI L10; KS L6). Bảng đối chiếu P3 (agy 11081816) còn 🟡 "bảng xếp lịch tuần toàn phòng" – cổng `webBangXepLich` có ở PK v1.0.7 (L5, đã lên app @3).
- **Nội dung:** 🏥 Phòng Khám thêm thẻ 🗓️ Lịch cả tổ (quyền tổ trưởng / admin như thẻ ☑️ Duyệt): mỗi ngày người theo vị trí + ca, người nghỉ, chưa xếp; ⚠️ thiếu vị trí / ≥ 2 nghỉ / đi làm < nửa tổ. Chỉ đọc – xếp ca vẫn trên app PK. Lỗi cổng ➜ khung đỏ, không thay số mẫu.
- **Kiểm:** node --check; Edge 375 / 1280: Demo 0 lần gọi mạng, 8 thẻ, 2 ngày ⚠️ đúng (07/11 hai người nghỉ + thiếu Tổng đài; 08/11 thiếu Tổng đài); 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 chữ < 14px.
- **Đối chiếu P3 cập nhật (so với nháp agy 08/11):** đã gỡ 🟡/⏳ – Telegram mã ghép (v2.13.12), chi tiết việc con PK (v2.13.11), gửi đơn nghỉ (v2.13.7), lưu bài học (v2.13.10), CRM giai đoạn + tương tác (HUB L29 lên app v1.20.2), xếp lịch cả tổ (v2.13.14). Còn 🟡 phía v2 (form quản trị KS: tạo / sửa khảo sát, câu hỏi, phân quyền, nhập hộ – cổng KS có sẵn, để tuần sau vì ít dùng); ⏳ duyệt đơn nghỉ PTKH cho quản lý (Còn chờ v1: cổng đọc danh sách chờ duyệt – chưa duyệt); ⬜ bảo lưu v1: HTNV, giám sát / vinh danh, quy trình SOP tương tác, khiếu nại, xuất TC-NS.
- **Còn lại tuần:** T7 14/11 rà UX + bảng đối chiếu đầy đủ + chốt **v2.14.0 RC**.

### PHIÊN BẢN v2.13.13 ✅ – 👥 CRM: GIAO DIỆN LỊCH SỬ TƯƠNG TÁC (09/11/2026, lượt tự động ⑤ 12h – nhận phiếu agy 11091025_V2_M2.4_giao-dien)
- **Nội dung:** dòng thời gian tương tác, chip chọn kênh 1 chạm, đếm ký tự /500, hàng lead dùng lớp `crm-tt-*` (bỏ inline style). Em gỡ đoạn tự mở `?ct=` agy thêm ngoài phạm vi, nâng chữ 12–13px lên 14px.
- **Kiểm:** node --check; kịch bản CRM (Edge): Demo 0 lần gọi, ghi liên hệ ➜ đúng 1 lần `webGhiTuongTac` kênh mặc định "Gọi", đánh dấu lead ➜ 1 lần `webDanhDauLead`; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 chữ < 14px.
- **Còn lại tuần:** T7 14/11 rà UX + bảng đối chiếu v1↔v2 + chốt **v2.14.0 RC**.

### PHIÊN BẢN v2.13.12 ✅ – ⚙️ KẾT NỐI TELEGRAM CÁ NHÂN (09/11/2026, lượt tự động ⑤ 10h – mục P3 #6, cổng Hub có sẵn)
- **Nội dung:** ⚙️ Cài đặt thêm thẻ 🤖 Telegram: `webMaTG` (Hub v1.8.5 L5a) ➜ mở bot bằng mã 15 phút; `webXacNhanTG` ➜ gán chat. Kiểm thuần `linkTGHopLe` chỉ nhận `https://t.me/<bot>?start=<mã>`; Hub chưa cài TG_TEN_BOT ➜ báo lỗi rõ.
- **Kiểm:** node --check; Edge 320: Demo 0 lần gọi, bước 2 khóa tới khi có mã; Live giả lập bấm đúp bước 1 ➜ 1 lần `webMaTG` + mở bot 1 lần; bước 2 ➜ `webXacNhanTG` ➜ "Đã kết nối"; link lạ (evil.com) ➜ không mở; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console.
- **Chờ anh:** thử kết nối 1 lần bằng tài khoản của anh (Hub phải đang bật kết nối Telegram ở Hub, không ở PTKH – nếu không Hub báo "Đang dùng kết nối Telegram ở app PTKH").
- **Còn lại P3:** duyệt đơn nghỉ cho quản lý – Còn chờ v1 (cổng đọc danh sách đơn chờ duyệt ở PTKH, cần Sếp duyệt mở cổng).

### PHIÊN BẢN v2.13.11 ✅ – 🩺 CHI TIẾT VIỆC PK: VIỆC CON + TRAO ĐỔI (09/11/2026, lượt tự động ⑤ 10h – mục P3 còn lại, cổng PK đã có)
- **Bối cảnh:** bảng đối chiếu P3 (agy 11081816) còn "chi tiết việc con PK"; cổng `webChiTietViec` + `webCapNhatViec` (nhận `viecConXong`, `traoDoiMoi`) có sẵn ở PK từ v1.0.4 (L3, đã lên app).
- **Nội dung:** nút 📋 trên từng việc ➜ khung chi tiết (mô tả, việc con dạng ô tick ≥ 44px, trao đổi); `lenhLuuViec` thuần chỉ gửi phần đổi, chặn trao đổi rỗng / > 1000 / có CCCD-BHYT, việc cá nhân không trao đổi; lưu xong đọc lại chi tiết.
- **Kiểm:** node --check; ca thuần l1–l5 (không đổi gì, tick thêm, chỉ trao đổi + gộp khoảng trắng, CCCD, việc cá nhân); Edge 320: 3 nút 📋, Demo 0 lần gọi; Live giả lập bấm đúp ➜ đúng 1 lần `webCapNhatViec` {id, viecConXong} rồi 1 lần đọc lại; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console.
- **Còn lại P3 (lượt sau):** form mã ghép Telegram; duyệt đơn nghỉ cho quản lý (Còn chờ v1: cổng đọc danh sách chờ duyệt).

### PHIÊN BẢN v2.13.10 ✅ – 🧠 GỬI BÀI HỌC VÀO KHO TRI THỨC (09/11/2026, lượt tự động ⑤ 10h – nối cổng v1 đã lên app)
- **Bối cảnh:** HUB L28a+L28b lên app Hub v1.20.2 @20 (`webTriThuc` đọc – v2 đã nối từ v2.13.2; `webLuuBaiHoc` ghi – chưa nối). Kho tri thức Sếp duyệt 08/11 đã có dòng HUB L28 ➜ lượt này KHÔNG thêm dòng v1 mới.
- **Nội dung:** 🗂️ Dự án › 🧱 Ma trận vướng mắc: nút 📤 gửi bài học (M9.4) vào sổ BaiHoc; kiểm thuần `kiemBaiHoc` + `maGuiBaiHoc` (băm nội dung ➜ mã ổn định); gửi tuần tự, lỗi giữa chừng báo phần đã gửi + bấm gửi lại an toàn.
- **Kiểm:** node --check; ca thuần (chủ đề lạ ➜ Khác, vấn đề < 5 ký tự, SĐT có dấu chấm, cách làm > 1000, mã ổn định / khác nhau / đúng dạng Hub với nội dung 500 ký tự); Edge 320: Demo 0 lần gọi; Live giả lập bấm đúp ➜ 2 bài = 2 lần gọi; gửi lại ➜ 2 lần gọi, 0 bài mới ("2 bài đã có sẵn"); 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console.
- **Còn chờ v1:** HUB L28 bước 5 – máy chép bài Đã duyệt ➜ `05_TriThuc` (để bài hiện trong chỉ mục 🧠 Tri thức). **Chờ anh:** gửi thử 1 lần từ v2 rồi duyệt ở sổ BaiHoc.

### PHIÊN BẢN v2.13.9 ✅ – 👥 CRM NỐI HUB L29: GHI LIÊN HỆ + ĐÁNH DẤU LEAD (09/11/2026, lượt tự động ⑤ 10h – mục T6 "nối cổng v1 mới đã lên app")
- **Bối cảnh:** HUB L29 đã lên app (Hub v1.20.2 @20): `webCRM` trả `giaiDoan` + `tuongTac` + `leadMoi[].ma/trangThai`, có `webGhiTuongTac`, `webDanhDauLead` trong `congWeb_`. Ô giai đoạn + khung lịch sử (v2.13.3) tự bật; lượt này nối 2 cổng ghi.
- **Nội dung:** 💬 Ghi lần liên hệ trong chi tiết đối tác (kiểm thuần `kiemTuongTac` theo luật Hub ➜ Toast Hoàn tác 6s ➜ ghi đúng 1 lần, maGui chống trùng); ✅ Đánh dấu đã chăm sóc ở lead mới (Hoàn tác 6s ➜ `webDanhDauLead`); lead đã chăm sóc bỏ khỏi nhắc. HOP_DONG mục CRM sửa theo mã thật.
- **Kiểm:** node --check; ca thuần k1–k9 (2 mã cùng lúc, mã DT01 sai dạng, kênh lạ, rỗng, SĐT "0912.345.678", "BN", số tiền + ngày KHÔNG bị chặn, gộp khoảng trắng, > 500 ký tự); Edge 320: Demo 0 lần gọi; Live giả lập: lý do có SĐT ➜ 0 lần gọi, bấm đúp ➜ đúng 1 lần `webGhiTuongTac` (đúng tham số + maGui), lịch sử 5 ➜ 6 dòng; đánh dấu bấm đúp ➜ 1 lần `webDanhDauLead`, nhãn ✓ hiện; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 vùng bấm < 44px.
- **Chờ anh:** ghi thử 1 lần liên hệ thật từ v2 (👥 CRM › mở 1 đối tác) và đánh dấu 1 lead – kiểm sheet TuongTac / LeadMoi của Hub.

### PHIÊN BẢN v2.13.8 ✅ – 🗓️ XIN NGHỈ: GIAO DIỆN LỊCH TUẦN (09/11/2026, lượt tự động ⑤ 10h – nhận phiếu agy 11090620_V2_M5.3_giao-dien)
- **Bối cảnh:** lịch tuần T2–T6 đã xong ở các bản trước; ưu tiên số 1 (HUB L26 ➜ M6.4) 🟢 từ v2.12.2. Lượt này nhận kết quả giao diện của agy cho khối Xin nghỉ (v2.13.7), xác minh rồi đưa vào bản.
- **Nội dung:** 4 thẻ tuần, lưới 4 cột (điện thoại) / 7 cột (≥ 768px), chip thứ / ngày 48px, chú giải trạng thái, hộp đếm "Đã chọn n ngày", thẻ đơn gần đây. Em sửa thêm phần agy lệch luật: màu viết cứng ➜ `var(--on-primary)`, chữ 10–13px ➜ 14px.
- **Kiểm:** node --check; ca thuần k1–k6 giữ nguyên kết quả; 320px: 28 chip rộng 55px, 0 chip tràn chữ, 0 cuộn ngang; Demo 0 lần gọi, lý do có SĐT chặn, Live giả lập bấm đúp ➜ đúng 1 lần `webGuiNghiPhep`; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 vùng bấm < 44px, 0 chữ < 14px.

### PHIÊN BẢN v2.13.7 ✅ – 🗓️ XIN NGHỈ NGAY TRÊN v2 (09/11/2026, lượt tự động ⑤ 06h – mục #1 bảng đối chiếu P3 của agy, không cần cổng v1 mới)
- **Bối cảnh:** lịch tuần T2–T6 đã xong ở các bản trước (ưu tiên số 1 HUB L26 ➜ M6.4 🟢 từ v2.12.2). Phiếu agy 11081816_V2_P3_danh-gia (99 chức năng: 80 ✅ · 8 🟡 · 5 ⏳ · 6 bảo lưu v1) xếp "Xin nghỉ phép" là khoảng trống dùng nhiều nhất mà cổng PTKH đã có trong `HAM_WEBGOI_`.
- **Nội dung:** 📋 PTKH Gốc thêm khối 🗓️ Xin nghỉ: loại gửi mới đúng theo v1 (`LOAI_NGHI_CHON_`) – 📅 Lịch nghỉ tuần (28 ngày từ thứ Hai tuần sau, bản sao thuần `ngayCacTuanToi`; khóa ngày lễ 🎌 / đã xin ✓ / tuần đầu khi quá hạn 15h thứ Sáu theo `webLichNghiNV`) và 🤒 Nghỉ ốm (từ – đến ≤ 31 ngày, buổi, lý do). `kiemDonNghi` (thuần) theo `loiNghiPhep` + chặn SĐT trong lý do, rồi `SHIN_API.soatKhongDuaVao` ➜ Toast Hoàn tác 6s ➜ `goiPTKH(link, 'webGuiNghiPhep', [p])` đúng 1 lần (khóa bấm đúp) ➜ toast lời PTKH + danh sách đơn của tôi (`phep.cuaToi`). Demo: không gửi. Lỗi cổng `webLichNghiNV` ➜ dải đỏ "xin nghỉ ở app PTKH". Đổi ca (chọn người + ca) vẫn mở app PTKH.
- **Kiểm:** node --check; ca thuần (ngày đầu = T2 16/11 khi hôm nay T2 09/11 hoặc CN 15/11; quá hạn tuần sau; ngày kết thúc trước ngày đầu; nửa buổi nhiều ngày; lý do có SĐT ➜ chặn); Edge 375: 28 chip, chọn / đổi loại giữ form, Demo 0 lần gọi, Live giả lập bấm đúp ➜ 1 lần gọi đúng tham số; 17 màn × 375 / 1280: 0 cuộn ngang, 0 lỗi console, 0 vùng bấm < 44px.
- **Chờ anh:** gửi thử 1 đơn Nghỉ ốm thật từ v2 (máy chủ PTKH ghi `WebApp – Nghỉ phép`), kiểm đơn hiện ở app PTKH › Nghỉ phép rồi tự hủy.
- **Còn lại từ bảng P3 (phía v2, không cần cổng mới – lượt sau):** duyệt đơn nghỉ cho quản lý (`webDuyetNghiPhep`, cần thêm cổng đọc danh sách chờ duyệt – `webNghiLe` KHÔNG có trong `HAM_WEBGOI_` ➜ Còn chờ v1), chi tiết việc con PK (`webChiTietViec`), form mã ghép Telegram.

### PHIÊN BẢN v2.13.6 ✅ – PWA HOÀN THIỆN (09/11/2026, lượt tự động ⑤ 04h – kéo trước mục T6 13/11)
- **Nội dung:** (1) `sw.js` vỏ app thiếu `js/modules/danhgia5t.js` (index.html có nạp) và `danhgia5t.html` ➜ thêm vào VO_APP, PHIEN_BAN_SW `shin-v2.13.6` – mở offline ngay từ lần đầu không thiếu tệp. (2) Báo bản mới: khi service worker mới thay bản đang chạy ➜ Toast "Đã có bản SHIN mới" + nút Tải lại (lần cài đầu không báo). (3) App cài mở lâu ngày: quay lại màn hình là kiểm bản mới (`reg.update()`, tối đa 1 lần / 30 phút, bỏ qua khi mất mạng). (4) Manifest thêm lối tắt 💰 Tài chính, 📣 Marketing (`?m=taichinh`, `?m=marketing`).
- **Kiểm:** node --check; Edge headless qua máy chủ http cục bộ: 17 màn × 375 / 1280 – 0 cuộn ngang, 0 lỗi console (Demo); SW kích hoạt, bộ đệm `shin-v2.13.6` cài đủ vỏ app (addAll không lỗi); lối tắt `?m=taichinh&nguon=app` mở đúng màn và xóa tham số; chặn mạng tải lại ➜ vỏ app vẫn mở.
- **T6 còn lại:** M0.2 phía trình duyệt đã xong (v2.13.1); nối cổng v1 mới: HUB L29 «ĐÃ CODE v1.18.6», chưa lên app ➜ CRM đã đón sẵn (v2.13.3).
- **Còn chờ v1:** HUB L29 lên app (CRM giai đoạn + sổ tương tác + đánh dấu lead).

### PHIÊN BẢN v2.13.5 ✅ – RÀ UX TỰ ĐỘNG 17 MÀN (08/11/2026, lượt tự động ⑤ 18h – kéo trước một phần T7)
- **Nội dung:** quét Edge headless 375 + 1280 mọi màn, đo thêm vùng bấm < 44px, chữ < 14px, ô nhập < 16px. Sửa: `.btn-icon` (↻ / ＋ / 🏠 trên đầu màn) bị flex bóp còn 36–42px ở 375 ➜ `min-width: 44px; flex-shrink: 0`; 💰 Tài chính huy hiệu trạng thái dự án, số tiền vượt, nhãn Chờ duyệt / Đã chi 11–12px ➜ 14px.
- **Kiểm:** node --check; 17 màn × 2 bề rộng: 0 cuộn ngang, 0 lỗi console (Demo), 0 vùng bấm < 44px, 0 chữ < 14px, 0 ô nhập < 16px. Không đổi logic / cổng.
- **Phiếu agy:** 11081816_V2_P3_danh-gia – nháp bảng đối chiếu v1 ↔ v2 từng màn cho nghiệm thu P3 (T7).
- **Còn chờ v1:** HUB L29 (CRM giai đoạn + sổ tương tác) «ĐÃ CODE v1.18.6», chưa lên app.

### PHIÊN BẢN v2.13.4 ✅ – GIAO DIỆN 🧠 TRI THỨC + TRANG offline.html (08/11/2026, lượt tự động ⑤ 16h – nhận phiếu agy 11081024_V2_M9.1_giao-dien)
- **Nội dung:** áp phiếu giao diện agy (đã rà diff: chỉ giao diện, không đổi tên hàm / logic, 100% var(--…)): thẻ tài liệu + chi tiết dễ đọc ở 320–375px, dải đỏ lỗi Hub có hướng dẫn, 3 trạng thái trống; offline.html tự tải lại khi `online` (theo phản biện agy). Sửa ghi chú cũ "v1 chưa có máy chủ cho kho tri thức" ➜ "Hub chỉ trả chỉ mục + tóm tắt (L28a)".
- **Kiểm:** node --check; Edge headless 375 + 1280: 17 màn mở đúng, 0 cuộn ngang, 0 lỗi console (Demo); offline.html 320px: 0 chữ nhỏ, 0 vùng bấm nhỏ.
- **Còn chờ v1:** HUB L29 (CRM giai đoạn + sổ tương tác) «ĐÃ CODE v1.18.6», chưa lên app – màn 👥 CRM đã đón sẵn từ v2.13.3.

### PHIÊN BẢN v2.13.3 ✅ – M3.3 / M3.4 🟢 + CRM ĐÓN SẴN HUB L29 (08/11/2026, lượt tự động ⑤ 12h – T6 "nối cổng v1 mới" + mục 5b)
- **Nội dung:** (1) Xác minh mã Hub `83_TaiChinh.gs`: `webGuiDeXuatChi` nhận `loai` (Chi / Tạm ứng / Thanh toán), `hanHoanUng`, `soChungTu` ➜ form gộp M3.4 và phiếu hoa hồng M3.3 (🎓 Tuyển sinh ➜ 💰 Tài chính) đã gửi thật vào 0B từ v2.12.2 ➜ QUY_HOACH M3.3 / M3.4 🟢. (2) 👥 CRM đón sẵn HUB L29: `tuV1` mang `giaiDoan` + `tuongTac`; hàm thuần `gdCua` (cột GiaiDoan đúng 5 giá trị ➜ dùng, không thì suy từ Trạng thái), `tuongTacCua` (5 lần liên hệ mới nhất); ô chọn giai đoạn trong form và lịch sử tương tác trong chi tiết đối tác CHỈ hiện khi cổng thật trả trường mới – chưa có thì ghi "còn chờ máy chủ Hub (dòng L29)", không gửi trường máy chủ bỏ qua. Hợp đồng L29 ghi vào HOP_DONG_CONG_V2.md mục CRM.
- **Mục 5b:** thêm dòng **HUB L29** (CRM GiaiDoan + sổ tương tác `webGhiTuongTac` + `webDanhDauLead`, Sếp đã duyệt 08/11) vào 10_Hub/KE_HOACH.md + đầu thu_tu (commit v1, không push). Dòng tri thức (L28) đã có từ trước.
- Còn chờ v1: HUB L29 (code + lên app) ➜ ghi lần liên hệ, đánh dấu lead đã chăm sóc, lưu giai đoạn; TS chưa có sổ "đã chi hoa hồng" theo chiến dịch.

### PHIÊN BẢN v2.13.2 ✅ – M9.1 🟢 THƯ VIỆN TRI THỨC ĐỌC THẬT QUA HUB L28a (08/11/2026, lượt tự động ⑤ 10h – T6 "nối cổng v1 mới đã lên app")
- **Nội dung:** `ModuleTriThuc` thêm `mayChu: 'HUB'` + `taiLive` ➜ `webTriThuc(token, {})`; Live vẽ hero từ số thật (số tài liệu, lĩnh vực, liên kết [[…]]) + "Chỉ mục cập nhật dd/mm/yyyy"; Hub trả `loi` (chưa đồng bộ chỉ mục) ➜ dải đỏ, danh sách trống; lỗi mạng ➜ khung lỗi chung của app. Hợp đồng ghi vào HOP_DONG_CONG_V2.md mục Tri thức.
- **Kiểm:** node --check; Edge 375 Live giả lập: gọi đúng HUB:webTriThuc, 2 tài liệu ➜ hero 2 · 2 · 1 liên kết; ca `loi` ➜ dải đỏ; không cuộn ngang; 0 lỗi console.
- Còn chờ v1: ghi bài học `webLuuBaiHoc` (HUB L28 phần ghi – Sếp đã duyệt 08/11, dòng đã có trong KE_HOACH Hub).

### PHIÊN BẢN v2.13.1 ✅ – M0.2 RBAC PHÍA TRÌNH DUYỆT: CHẶN MỞ THẲNG MẢNG KHÔNG CÓ QUYỀN (08/11/2026, lượt tự động ⑤ 10h – kéo mục T6 lên)
- **Nội dung:** trước đây mảng không có quyền chỉ bị ẩn khỏi menu, vẫn mở được qua lối tắt `?m=` hoặc nút chuyển màn giữa các mảng. Nay `chuyenModule` (Live, sau khi Hub nhận diện) kiểm `mangCoQuyen` ➜ vẽ màn 🔒 `veKhongCoQuyen`, không gọi cổng. Mảng anh/chị tự tắt trong ⚙️ vẫn mở được bằng nút (chỉ ẩn menu). Máy chủ v1 vẫn là chốt chặn thật.
- **Kiểm:** node --check; Edge 375: Demo mở KPI bình thường; Live giả lập quyen.KPI = khong ➜ 🔒 KPI; HUB co + không Admin ➜ 🔒 Điều hành "chỉ dành cho Admin Hub"; Admin ➜ mở được; 17 màn 375 + 1280 không cuộn ngang, 0 lỗi console.
- Còn chờ v1: chiều Khoa/Phòng + sửa quyền theo ô (Sếp 08/11: KHÔNG làm RBAC Khoa/Phòng tuần này).

### PHIÊN BẢN v2.13.0 ✅ – PWA: DẢI BÁO MẤT MẠNG + TRANG offline.html (08/11/2026, lượt tự động ⑤ 10h – kéo mục T6 lên)
- **Nội dung:** `app.js` `baoMatMang`: nghe offline / online ➜ dải vàng 📴 dính đầu trang (≥ 44px, chỉ var(--…)), có mạng lại ẩn + toast nhắc ↻. `offline.html` (trang tự chứa, sáng / tối theo máy, nút ↻ Thử lại 44px) là đích cuối của sw.js khi điều hướng mất mạng mà không có index.html trong bộ đệm. Đã có từ trước: manifest + lối tắt, nút 📲 cài (beforeinstallprompt / hướng dẫn iOS), sw.js mạng-trước cho vỏ app, không lưu đệm máy chủ v1.
- **Kiểm:** node --check app.js, sw.js; Edge 375 + 1280: 17 màn không cuộn ngang, 0 lỗi console; giả offline ➜ dải hiện (61px ở 375 / 44px ở 1280), online ➜ ẩn.
- Còn lại T6: M0.2 RBAC phía trình duyệt; nối cổng v1 mới lên app trong tuần.

### PHIÊN BẢN v2.12.2 ✅ – M6.4 🟢 GỬI ĐỀ XUẤT CHI THẬT VÀO 0B + GIAO DIỆN TÀI CHÍNH / LMS (08/11/2026, lượt tự động ⑤ 10h – ưu tiên số 1: HUB L26 đã lên app v1.18.5)
- **Nội dung:** 💰 Tài chính › ✍️ Đề xuất chi / Tạm ứng / Thanh toán có nút chính 📤 Gửi vào Phê duyệt 0B ➜ `ModuleTaiChinh.guiDeXuat`: kiểm như cũ (`kiemDeXuat` + `SHIN_API.soatKhongDuaVao`) ➜ Toast "Sẽ gửi …" có Hoàn tác 6s ➜ hết giờ mới gọi `webGuiDeXuatChi(token, {loai, khoanMuc, soTien, duAn, lyDo, hanHoanUng?, soChungTu?, maGui})`; Hub trả `{ma, moi}` ➜ toast mã phiếu TC-… + tải lại màn (phiếu hiện trong khoản chờ duyệt). `maGui` (hàm thuần `taoMaGui`) giữ nguyên tới khi Hub nhận ➜ lỗi mạng bấm lại không tạo phiếu trùng; khóa `_dangGui` chặn bấm đúp. Demo / chưa có máy chủ: báo rõ, không gửi. Theo ca biên agy 11080424_V2_M3.4: `kiemDeXuat` bóc số chuỗi '1.500.000', chặn dự án > 120 ký tự. Áp 2 phiếu giao diện agy (M3.1 `.tc-` cho Tài chính + VietQR; M4.5 thẻ LMS + tên bài).
- **Kiểm:** node --check 4 tệp; ca thuần (chuỗi 1.500.000 ➜ 1500000, dự án 125 ký tự ➜ lỗi, maGui đúng mẫu Hub); Edge 375 + 1280: 17 màn không cuộn ngang, 0 lỗi console, 2 nút 46px, Demo bấm 📤 ➜ báo không gửi; Live giả lập: Hoàn tác ➜ 0 lần gọi, bấm đúp ➜ 1 lần, lỗi mạng rồi gửi lại ➜ cùng maGui.
- Chờ anh: thử 1 phiếu thật trên app (Hub v1.18.5) – kiểm phiếu TC-… hiện ở ⚡ Phê duyệt 0B. Hub chặn chuỗi 12 chữ số trong số chứng từ (đề xuất sửa ở Hub đã ghi 08/11 08:4x).

### PHIÊN BẢN v2.12.1 ✅ – M4.5 LMS MINI: LỚP HỌC · ĐIỂM DANH · BÀI M01–M20 (08/11/2026, lượt tự động ⑤ 06h – kéo mục T5 lên)
- **Nội dung:** 🎓 Tuyển sinh có khối gập 🏫 Lớp học & điểm danh: chọn lớp (2 lớp mẫu, học viên đặt tên "Học viên 01…"), 3 số đầu khối (bài đã học x/20 · chuyên cần TB · số học viên dưới 80%), điểm danh theo ngày (ô ngày 16px, mỗi học viên 1 dòng ≥ 44px, hiện có mặt / tổng buổi + % – đỏ khi < 80%) ➜ 💾 Lưu điểm danh; 20 bài M01–M20 chia 5 tuần, đánh dấu đã học ➜ % tiến độ + bài kế. Tệp mới `js/modules/mau_lms.js` (dữ liệu MẪU: lớp, học viên, bài, điểm danh mẫu 2 buổi / lớp). Hàm thuần `ModuleTuyenSinh.chuyenCan`, `tienDoBai`. Lưu localStorage `shin_lms` (lần đầu chép từ mẫu). `index.html`, `sw.js` VO_APP thêm tệp; shin-v2.12.1.
- **Kiểm:** node --check; ca thuần chuyenCan (100 / 50 / 0%, cảnh báo < 80) + tienDoBai (2/3 = 67%, bài kế M02); Demo Edge 375 + 1280: bỏ 1 học viên ➜ lưu 7/8, đánh dấu M05 ➜ 5 bài, đổi lớp B đúng; nút / dòng / ô ≥ 44px; 17/17 màn không cuộn ngang; 0 lỗi console.
- Còn chờ v1: lớp + học viên thật, điểm danh lưu máy chủ (app Tuyển sinh chưa có sheet lớp / cổng – chưa duyệt, không xin dòng v1).

### PHIÊN BẢN v2.12.0 ✅ – M8.6 BÁO CÁO HIỆU SUẤT TRUYỀN THÔNG (08/11/2026, lượt tự động ⑤ 06h – kéo mục T5 lên)
- **Nội dung:** 📣 Marketing thêm khối 📊 HIỆU SUẤT TRUYỀN THÔNG: 3 số (tiếp cận · tỷ lệ tương tác · lead), từng kênh (số bài, tiếp cận, % tương tác, % bấm, lead / 1.000 tiếp cận – sắp theo tiếp cận), bài tương tác tốt nhất; ＋ Nhập số 1 bài đã đăng (chọn bài trong lịch, kênh, 4 ô số kiểu VN "1.200" / "1,2k", chặn số bất thường – lỗi hiện ngay dưới ô); danh sách số đã nhập, 🗑 Xóa có Hoàn tác 6s (ẩn ngay, hết giờ mới ghi). Hàm thuần `soNhap`, `tongHieuSuat`. Lưu localStorage `shin_mkt_hs` (≤ 300 dòng). Demo: 5 dòng số MẪU (`SHIN_DEMO_DATA.marketing.hieuSuat`) ghi rõ "Số MẪU"; Live không có số nhập ➜ ô trống mời nhập (không hiện số mẫu).
- **Kiểm:** node --check; soNhap ('1.200' ➜ 1200, '1,2k' ➜ 1200, '3.000.000', 'abc' ➜ null), tongHieuSuat (5% · 2 lead / 1.000, reach 0 ➜ –); Demo Edge 375 + 1280: thêm 1 dòng thay số mẫu, ô sai báo lỗi, xóa ➜ ẩn 0/1 ➜ Hoàn tác về 1; 17/17 màn không cuộn ngang; 0 lỗi console.
- Còn chờ v1: lấy số tự động từ API Facebook / TikTok / Zalo OA / YouTube (chưa có cổng – chưa duyệt).

### PHIÊN BẢN v2.11.1 ✅ – M8.3 SMART LEAD DISPATCHER (08/11/2026, lượt tự động ⑤ 04h – kéo mục T5 lên)
- **Nội dung:** hàm thuần `ModuleMarketing.phanLuongLead` chia lead mới (cổng có sẵn `webCRM.leadMoi` – nguồn, ghi chú; Demo thêm khoa / số lượng khám) theo thứ tự: 🏢 KSK doanh nghiệp ➜ Pipeline B2B · 🎓 Tuyển sinh ➜ chiến dịch · 🏥 Đặt khám ➜ Phòng khám (CRM không lưu bệnh nhân) · 🤝 Đối tác / CTV ➜ CRM · ❔ Chưa rõ ➜ phân loại tay (so khớp không dấu, có lý do khớp). 👥 CRM – khối 🔔 Lead mới: dòng tổng "Phân luồng" + mỗi lead 1 nút chuyển tới màn đích (≥ 44px). Chỉ đọc, không ghi gì.
- **Kiểm:** 10/10 ca thuần (KSK theo nguồn / tên "Cty", tuyển sinh theo học phí / tiếng Anh, đặt khám, CTV, "khám phá" không nhầm khám, lead rỗng); Demo Edge 375 + 1280: 🏢 2 · 🎓 1, nút chuyển đúng màn, 17/17 màn không cuộn ngang, 0 lỗi console.
- Còn chờ v1: ghi luồng / người nhận vào sheet LeadMoi + giao tự động cho tư vấn viên (cần cổng ghi – chưa duyệt). Bài học: sửa JS qua heredoc Python làm `\b` thành ký tự backspace – từ nay sửa JS chỉ bằng Edit / Write.

### PHIÊN BẢN v2.11.0 ✅ – MẢNG 8 MARKETING PHẦN 1: M8.1 · M8.2 · M8.4 (08/11/2026, lượt tự động ⑤ 04h – kéo mục T4 lên)
- **Nội dung:** module mới 📣 Marketing & Nội dung (`js/modules/marketing.js`, nhóm TĂNG TRƯỞNG & ĐỐI TÁC) + bộ khuôn `js/modules/mau_marketing.js` (agy soạn – phiếu 11080154_V2_M8_lam; em bỏ 5 cụm "nhất / tuyệt đối" trái chính khuôn y tế). M8.1 lịch 4 tuần 12 bài (4 kênh, TOFU / MOFU / BOFU, nút lọc); M8.2 xưởng mẫu 12 khuôn PAS / AIDA / 4P / kịch bản video: chọn khuôn ➜ điền ô {{…}} ➜ xem trước trực tiếp, cảnh báo từ cấm quảng cáo dịch vụ y tế (nhất, hàng đầu, 100%, cam kết khỏi, dứt điểm…) + tường lửa M9.5; M8.4 chốt chặn: Nháp ➜ 📤 Gửi duyệt (bắt đủ ô, không từ cấm) ➜ ✅ Duyệt (Toast Hoàn tác 6s, hết giờ mới ghi) / ↩️ Trả lại / Rút ➜ Sẵn sàng đăng – chỉ bài đã duyệt mới 📋 sao chép. Lưu localStorage `shin_mkt_bai`. Hàm thuần `dienKhuon`, `thieuBien`, `kiemTuCam`, `chuyen`. `index.html`, `sw.js` VO_APP thêm 2 tệp; shin-v2.11.0.
- **Kiểm:** node --check; luồng Demo Edge 375 + 1280: lịch 12 bài, lọc BOFU 4, gửi duyệt bị chặn khi thiếu ô và khi có "tốt nhất", duyệt chưa ghi ở 0,3s – đã ghi Sẵn sàng đăng sau 6s; 17/17 màn không cuộn ngang, nút / ô ≥ 44px, 0 lỗi console.
- Còn chờ v1: gửi bài vào Phê duyệt 0B (người duyệt thật theo vai trò) + đăng tự động đa kênh – chưa có cổng máy chủ (chưa được duyệt, không xin dòng v1).

### PHIÊN BẢN v2.10.4 ✅ – M3.1 MÃ VIETQR NHẬN TIỀN (08/11/2026, lượt tự động ⑤ 04h)
- **Nội dung:** tệp mới `js/vietqr.js` (`ShinVietQR`): chuỗi VietQR chuẩn EMVCo + NAPAS 247 (tag 38 A000000727 · BIN · số TK · QRIBFTTA, 53=704, 54 số tiền – bỏ trống ➜ QR tĩnh, 58=VN, 62/08 nội dung tự bỏ dấu ≤ 25 ký tự, CRC-16/CCITT-FALSE) + bộ mã hóa QR thuần (byte mode, mức M, phiên bản 1–20, tự chọn mặt nạ) vẽ SVG ngay trên máy – không gọi dịch vụ ảnh QR ngoài. 💰 Tài chính có khối gập 🔳 Mã VietQR: chọn ngân hàng (18 BIN phổ biến), số TK, tên chủ TK ➜ lưu localStorage máy này (khóa `shin_vietqr_tk`, không có trong repo, không vào SHINCFG1), hiện •••• 4 số cuối, nút Đổi có Hoàn tác 6s; nhập số tiền (kiểu VN) + nội dung ➜ 🔳 Tạo mã.
- **Kiểm:** 17/17 ca thuần (CRC "123456789" = 29B1, RS mẫu Thonky 1-M, vị trí căn chỉnh v7/v14, bộ giải độc lập đọc lại 6 chuỗi tới 300 ký tự – hội chứng RS = 0, chuỗi VietQR động / tĩnh, BIN / TK / tiền lẻ / tiền âm bị chặn); luồng Demo Edge 375 + 1280 (lưu TK ➜ tạo mã 280px ➜ gỡ TK), mọi nút / ô ≥ 44px, 16/16 màn không cuộn ngang, 0 lỗi console.
- **Chờ anh:** quét thử 1 mã bằng app ngân hàng thật (máy không có bộ quét). Còn chờ v1: tự xác nhận đã nhận tiền (webhook SePay).

### PHIÊN BẢN v2.10.3 ✅ – M3.3 ĐỀ NGHỊ CHI HOA HỒNG CTV / ĐẠI LÝ (08/11/2026, lượt tự động ⑤ 04h)
- **Nội dung:** 🎓 Tuyển sinh – chi tiết chiến dịch có hoa hồng > 0 hiện nút 💸 Lập đề nghị chi hoa hồng: lấy kết quả `hoaHongDat` (bảng bậc thang M4.3) mà cổng có sẵn `webLeadCD` trả (`hoaHong.{bac, tien}`, `pheu.nhapHoc`) ➜ hàm thuần `ModuleTaiChinh.deXuatHoaHong` ➜ mở 💰 Tài chính với form ✍️ điền sẵn loại Thanh toán (khoản mục "Hoa hồng CTV/đại lý – <chiến dịch>", số tiền, mã chiến dịch, lý do số HV × bậc) ➜ người dùng kiểm lại rồi 📋 sao chép (cùng luật M3.4). Demo: `hhSo` trong chiến dịch mẫu.
- **Kiểm:** node --check; luồng Demo Edge không giao diện 375 + 1280 (Tuyển sinh ➜ nút ➜ Tài chính điền đúng 52.500.000 đ, form mở, ô chứng từ hiện; ô Tạm ứng hiện hạn hoàn ứng), không cuộn ngang, 0 lỗi console.
- Còn chờ v1: TS chưa có sổ "đã chi hoa hồng" theo chiến dịch ➜ số đề nghị là hoa hồng lũy kế, người lập tự trừ phần đã chi kỳ trước; gửi thẳng 0B chờ HUB L26.

### PHIÊN BẢN v2.10.2 ✅ – M3.2 NGÂN SÁCH & GIẢI NGÂN THEO DỰ ÁN (08/11/2026, lượt tự động ⑤ 04h)
- **Nội dung:** 💰 Tài chính thêm khối Ngân sách & giải ngân theo dự án: Live đọc thêm cổng có sẵn `webDuAn` (Hub v1.15.6, `duAn[].nganSach / daChi`, `flash.taiChinh.phatSinh`) song song `webTaiChinh`; hàm thuần `ModuleTaiChinh.lechDuToan` – bỏ dự án Đóng / Hoàn thành / Hủy, tỷ lệ giải ngân, > 100% "Vượt dự toán" (đỏ, +số vượt), > 90% "Sắp chạm trần" (vàng), ngân sách 0 ➜ "Chưa có dự toán" (không chia cho 0), đã chi âm tính 0; thanh tiến độ màu theo mức; danh sách chi phát sinh từ Flash dự án. `webDuAn` lỗi ➜ khối báo lỗi đỏ, không thay bằng số mẫu. Demo: `SHIN_DEMO_DATA.taichinh.duAnNS / phatSinh` (giả).
- **Kiểm:** node --check; 20/20 ca thuần (kiemDeXuat 12 + lechDuToan 8: vượt, chưa dự toán, chuỗi "1.000", dự án Đóng, chi âm, thứ tự); Edge không giao diện 375 + 1280: 16/16 màn không cuộn ngang, 0 lỗi console.
- Còn chờ v1: dự toán theo **khoản mục** trong dự án – Hub chưa có bảng phân bổ ➜ chỉ cảnh báo cấp dự án (phản biện agy 11080154_V2_M3).

### PHIÊN BẢN v2.10.1 ✅ – M3.4 ĐỀ NGHỊ TẠM ỨNG / THANH TOÁN (08/11/2026, lượt tự động ⑤ 04h)
- **Nội dung:** 💰 Tài chính gộp 1 form ✍️ Đề xuất chi / Tạm ứng / Thanh toán (theo phản biện agy 11080154_V2_M3): chọn loại ➜ Tạm ứng hiện ô hạn hoàn ứng dd/mm/yyyy (bắt buộc, ngày có thật, không ở quá khứ), Thanh toán hiện ô số hóa đơn / chứng từ (≤ 60). Kiểm đúng luật `kiemDeXuatChi` của HUB L26 (Hub v1.15.7): khoản mục ≤ 120, lý do 5–500, số tiền > 0 + tường lửa M9.5 ➜ sao chép phiếu. `kiemDeXuat` trả thêm `goi` = tham số `webGuiDeXuatChi` để nối thật 1 dòng khi cổng lên app. HOP_DONG_CONG_V2.md mục Tài chính ghi lại theo mã thật v1.15.7.
- Còn chờ v1: HUB L26 «ĐÃ CODE v1.15.7», chưa [x] / chưa lên app ➜ chưa gửi thẳng 0B (M6.4 / M3.4 vẫn 🟡).

### PHIÊN BẢN v2.10.0 ✅ – M6.4 SOẠN ĐỀ XUẤT CHI (07/11/2026, lượt tự động ⑤)
- **Nội dung:** 💰 Tài chính thêm khối ✍️ Soạn đề xuất chi: nhập khoản mục / số tiền / dự án / lý do ➜ kiểm đủ trường, chặn CCCD · BHYT · khóa (tường lửa M9.5) ➜ 📋 sao chép phiếu dán gửi kế toán / Telegram để nhập Phê duyệt 0B. Chạy hoàn toàn trên trình duyệt, không ghi gì lên Hub.
- Còn chờ v1: Hub chưa có cổng tạo phiếu chi từ v2 ➜ cần dòng **HUB L26** `webGuiDeXuatChi` (hợp đồng ở HOP_DONG_CONG_V2.md mục Tài chính) – ĐÃ thêm vào 10_Hub/KE_HOACH.md + đầu thu_tu (lượt vét 07/11 20h, commit v1 cda26bd, chờ luồng v1 làm); lên app xong v2 đổi nút sao chép thành gửi thật (Hoàn tác 6s, ghi đúng 1 lần). M5.4 tăng ca: `webLichSuThang` không có giờ vào/ra ➜ vẫn ⬜.
- Rà UX lượt vét 07/11 22h47 (Edge không giao diện, chế độ Demo): 16/16 màn ở 375 và 1280 – không cuộn ngang, mọi nút/ô ≥ 44px, ô nhập 16px, 0 lỗi console; HUB L26 vẫn `[ ]` ➜ chưa nối nút gửi, không phát hành bản mới.

### PHIÊN BẢN v2.9.9 ✅ – ĐỒNG BỘ TRẠNG THÁI: HUB v1.15.6 ĐÃ LÊN APP (06/11/2026, lượt tự động ⑤)
- **Nội dung:** HUB L21–L25 đã «lên app v1.15.6 @15» (06/11 10h, `_TacVu/ban_tren_app.json`) ➜ các màn 0B Phê duyệt (`webPheDuyet` / `webDuyet`), CRM (`webCRM` / `webLuuDoiTac`), Dự án (`webDuAn`), Tài chính (`webTaiChinh`), Quản trị (`webLuuNguoiDung` / `webLuuUngDung`) đã nối từ v2.8.x nay chạy số thật ở Live – hết dải vàng "chưa mở cổng". QUY_HOACH mục 2: M0.1 (bật/tắt app), M0B.2–M0B.4, M2.3, M6.2 chuyển 🟢. KPI v1.8.2 @9 đã lên app ➜ nháp AOP năm sau (`webNhap2027`) chạy thật. Không đổi mã màn.
- Còn chờ v1: ghi chú kiểm L21 (Hub) – `chuanPhieuDuyet` dùng `Number(du.soTien)` nên chuỗi kiểu "1.500.000" từ app nguồn thành trống (v2 không gửi số tiền, chỉ hiển thị) ➜ dòng v1 tự lo. **Chờ anh:** trộn PR #19 (máy tự động không được phép trộn).

### PHIÊN BẢN v2.9.8 ✅ – NHỊP THÁNG: NTC M5.5 + CẢM NHẬN M5.6 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** gỡ một phần "Còn chờ v1" của M5.5 / M5.6 – cổng `webLichSuThang` của PTKH (đã trong `webGoi`) trả ca + cảm nhận (`camNhan` 1–5) từng báo cáo của chính NV, nên 🏥 PTKH có khối 🧭 Nhịp tháng: Ca NTC tuần này x/3, ngày công bị trừ (luật L111c: lần ≥ 4/tuần ISO trừ ½ công), cảm nhận sau ca trung bình + phân bố, BC đúng hạn tháng.
- **Kiểm:** node --check; nhipThang thử Demo + tuần vắt tháng 27/10–01/11 đạt; headless Edge 375 + 1280: 16 màn không cuộn ngang, 0 lỗi console.
- Còn chờ v1: Team Morale cả tổ (trung bình ẩn danh) và M5.4 tăng ca / bù giờ – PTKH chưa có hàm chỉ đọc tổng hợp theo tổ trong `HAM_WEBGOI_` (chỉ `webXuatTCNS` ghi, Admin) ➜ v2 mới hiện số của riêng người dùng.

### PHIÊN BẢN v2.9.7 ✅ – DÒ TRÙNG NGHỈ CẢ TỔ (06/11/2026, lượt tự động ⑤)
- **Nội dung:** gỡ mục "Còn chờ v1" của v2.9.5 – cổng `webLichTo` của PTKH (L26d, đã trong danh sách `webGoi`) trả sẵn nghỉ đã duyệt của mọi người cùng tổ, nên dò trùng cả tổ chạy được phía trình duyệt: 🏥 PTKH › 📅 Lịch tổ hiện ⚠️ ngày ≥ 2 người nghỉ hoặc còn ca < nửa tổ.
- **Kiểm:** node --check; doTrungTo thử 5 ca đạt; Demo (tổ mẫu 3 người, 2 nghỉ T6) ➜ 1 ngày cảnh báo; headless 375 + 1280.
- Còn chờ v1: đơn nghỉ CHỜ duyệt của cả tổ không trả qua `webLichTo` (chỉ đã duyệt) ➜ chưa cảnh báo sớm trước khi duyệt.

### PHIÊN BẢN v2.9.6 ✅ – RÀ UX 375 + 1280 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** rà đo từng màn ở 375 px và 1280 px (mục h). Lỗi đo được duy nhất: ô nhập `.form-input` 14px < 16px ➜ nâng lên tối thiểu 16px (giữ hệ số cỡ chữ khi phóng to). Không đổi bố cục.
- **Kiểm:** node --check; Edge không giao diện qua CDP mở index.html, bấm lần lượt 16 màn ở 375 + 1280: scrollWidth ≤ bề rộng, không phần tử tràn, không nút / ô < 44px, không chữ < 12px, 0 lỗi console; đo lại sau sửa: 0 ô nhập < 16px (chỉ còn ô tick).
- Còn chờ: không.

### PHIÊN BẢN v2.9.5 ✅ – KIỂM TRA TRÙNG LỊCH M5.3 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** tab 📅 Lịch tuần (🩺 Phòng PTKH) tự dò ngày đang xếp ca mà trùng đơn nghỉ chờ duyệt / đã duyệt của chính mình (bỏ đổi ca, đơn trả lại, ngày nghỉ / lễ) ➜ thẻ ⚠️ TRÙNG LỊCH + dấu ⚠️ trên dòng ngày. Chạy phía trình duyệt trên `webLichTuan` (PK L5), không gửi gì.
- **Kiểm:** node --check; xungDotLich thử 5 ca đạt; Demo thêm 1 đơn nghỉ MẪU 07/11 ➜ hiện 1 ngày trùng; headless 375 + 1280.
- Còn chờ v1: dò trùng cả tổ (nhiều người cùng nghỉ một ca, thiếu người trực) cần cổng lịch tổ + đơn nghỉ cả tổ cho v2 (hiện `webBangXepLich` chỉ tổ trưởng, chưa trả đơn nghỉ).

### PHIÊN BẢN v2.9.4 ✅ – ĐỒNG BỘ CẤU HÌNH GIỮA CÁC MÁY M0.1 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** màn ⚙️ Quản trị Module thêm "Đồng bộ cấu hình sang máy khác": sao chép mã `SHINCFG1.<base64>` (bảng màu, sáng/tối, cỡ chữ, kiểu thanh mép, mảng đang tắt) và dán ở máy kia; danh sách trắng 8 khóa + kiểm giá trị, **token không bao giờ vào mã** (khóa lạ bị bỏ khi đọc). Áp dụng có Hoàn tác 6s – hết 6s mới ghi localStorage rồi tải lại.
- **Kiểm:** node --check; taoMaCauHinh / docMaCauHinh thử 3 ca (bỏ shin_token, bỏ giá trị sai dạng, mã hỏng) đạt; headless 375 + 1280.
- Còn chờ v1: đồng bộ tự động theo người (lưu cấu hình vào sheet NguoiDung qua cổng Hub) chưa có cổng ➜ hiện đồng bộ thủ công bằng mã.

### PHIÊN BẢN v2.9.3 ✅ – NHẮC CHĂM SÓC LEAD M2.4 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 👥 CRM đánh dấu lead quá 24 / 48 giờ và sao chép tin nhắc chăm sóc – chạy phía trình duyệt trên `leadMoi` của `webCRM` (HUB L22).
- **Kiểm:** node --check; tuoiLead / mucLead / tinNhacLead thử 8 ca đạt; headless 375 + 1280: 16 màn + tab con không cuộn ngang, 0 lỗi console.
- Còn chờ v1: lịch sử tương tác từng đối tác (sheet / cổng ghi lần liên hệ) và đánh dấu lead "đã chăm sóc" chưa có ➜ lead đã xử lý vẫn bị nhắc tới khi xóa khỏi LeadMoi; Hub trên app vẫn v1.13.3 (L22 chưa lên app) ➜ Live còn dải vàng.

### PHIÊN BẢN v2.9.2 ✅ – TRÍCH BÀI HỌC KINH NGHIỆM TỪ FLASH REPORT M9.4 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** hàm thuần `trichBaiHoc` / `baiHocMarkdown` chạy phía trình duyệt trên Blocker Matrix (Live: `webDuAn`; Demo: demo_data) – chỉ lấy vướng mắc Flash có đề xuất (dòng dự án chậm chỉ là trạng thái, không phải cách làm).
- **Kiểm:** node --check; Demo ra 2 bài học (Thiết bị & Hậu cần, Nhân sự); headless 375 + 1280 tab Ma trận không cuộn ngang, 0 lỗi console.
- Còn chờ v1: kho tri thức (`05_TriThuc`) chưa có cổng ghi ➜ bài học chỉ sao chép; báo cáo ca PK chưa đưa vào nguồn trích (cổng PK chỉ trả báo cáo của chính người dùng).

### PHIÊN BẢN v2.9.1 ✅ – PHÂN LUỒNG VIỆC THEO QUYỀN M7.3 (06/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 📋 Công việc ẩn việc thuộc mảng người đang đăng nhập không có quyền (Live: theo kết quả hỏi quyền các máy chủ v1 lúc mở; mảng đang tắt cũng ẩn), thêm chip 🧭 Theo quyền / 👤 Của tôi. Chạy hoàn toàn phía trình duyệt trên dữ liệu màn đang có – không cổng mới.
- **Kiểm:** node --check; hàm thuần maTuNguon / laCuaToi / phanLuong thử 11 ca đạt; headless 375 + 1280: 16 màn + 17 tab con không cuộn ngang, 0 lỗi console (Demo).
- Còn chờ v1: Task Bus M7.1 (máy chủ gom việc) – khi có, phân luồng dùng lại nguyên hàm phanLuong.

### PHIÊN BẢN v2.9.0 ✅ – RÀ UX TOÀN BỘ 16 MÀN + 18 TAB CON Ở 375 / 1280 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** đo tự động (mở hết khối gập) mọi màn trong menu và các tab con (5T Thư viện; Dự án Danh sách / Flash / Ma trận; Quản trị Người dùng / App / Mảng / Ma trận quyền; KPI Soát lỗi / AOP / Báo cáo quý; PK Công việc / Báo cáo / Lịch / Góp ý / Hồ sơ / Thông báo / Nhân sự): còn đúng 1 lỗi – thẻ gập "Chi tiết" ở Điều hành cao 32px → 44px. Kết quả sau sửa: **0 chữ < 14px, 0 vùng bấm < 44px, 0 cuộn ngang, 0 lỗi console** (Demo).
- Còn chờ v1: M5.4 bóc tách tăng ca, M5.5 vi phạm NTC, M5.6 Team Morale – danh sách `HAM_WEBGOI_` của PTKH chưa có hàm chỉ đọc trả các số này (chỉ có `webXuatTCNS` ghi bảng TC-NS, Admin) → cần dòng v1 mới nếu Sếp muốn hiện trên v2.

### PHIÊN BẢN v2.8.9 ✅ – TƯỜNG LỬA KHONG_DUA_VAO PHÍA TRÌNH DUYỆT M9.5 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** `js/api.js` soát MỌI chuỗi trong dữ liệu gửi của cổng GHI (`webLuu…`, `webGhi…`, `webNop…`, `webGui…`, `webThem…`, `webSua…`, `webTao…`, `webDuyet…`, `webXoa…`, `webDang…`, `webCap…`) trước khi gửi – kể cả qua `goiCong`/`goiBat`. Chặn số CCCD 12 chữ số, mã thẻ BHYT, khóa API (Anthropic / OpenAI / Google), token Telegram Bot, chuỗi token Hub; báo "Ô …có … – xóa đi rồi lưu lại", KHÔNG gửi gì, không in lại giá trị vi phạm. Không chặn số điện thoại (CRM cần SĐT người liên hệ đối tác), số kiểu number, số tiền có dấu chấm, cổng đọc.
- Đã thử 8 ca bằng trình duyệt không giao diện: đúng 4 chặn / 4 qua.
- Còn chờ v1: chặn phía máy chủ (Apps Script) vẫn là tuyến chính – v2 chỉ là tuyến chặn sớm.

### PHIÊN BẢN v2.8.8 ✅ – RÀ UX MÀN ⭐ ĐÁNH GIÁ 5T (05/11/2026, lượt tự động ⑤)
- **Nội dung:** đo bằng trình duyệt không giao diện ở 375 / 1280: trước 309 chữ < 14px + 234 vùng bấm < 44px → sau **0 / 0**, không cuộn ngang trang. Khối bù cuối `css/styles.css` cho `.tab-btn-5t`, `.filter-chip(-sm)`, bảng điểm / bảng checklist (14px), `.diem-pill`, `.muc-pill`, ô ghi chú 16px ≥ 44px, `.form-label` trong nội dung; 152 ô tick bọc `<label class="chk-vung-5t">` vùng bấm 44×44 (ô 28px); chữ 10–13px nội tuyến trong `danhgia5t.js` → 14px, nút phụ 30–32px → 44px; mã màu cứng `#dc2626` / `#10b981` → `var(--c-red)` / `var(--c-green)`, nhãn mức dùng `color-mix` thay nối mã alpha. Bảng checklist vẫn cuộn ngang TRONG khung riêng (min-width 680px) như cũ.
- KPI v1.8.2 đã lên app @9 (05/11 17:05) → màn nháp AOP năm sau (v2.7.6, `webNhap2027`) chạy số thật: QUY_HOACH M1.3 bỏ ghi chú "chờ lên app".
- Còn lại: nhãn trục radar SVG 5T (10–11 đơn vị, co giãn theo khung) giữ nguyên.

### PHIÊN BẢN v2.8.7 ✅ – KHẢO SÁT: 5 TRỤ ACHSI THEO THÁNG (`webTongHopKS`) (05/11/2026, lượt tự động ⑤)
- **Nội dung:** KS v1.4.4 (L6, lên app @5 lúc 17:05) có cổng chỉ đọc `webTongHopKS({thang?})`. Màn 🩺 Khảo sát gọi song song với `webDsKhaoSat`: Hero = Hài lòng tháng · Phiếu hợp lệ trong tháng · Phiếu cần xử lý; khối 5 TRỤ ACHSI (điểm TB + tỷ lệ ≥ 4★ theo cột Nhóm); danh sách câu ≤ 2★ của tháng (≤ 50, mới nhất trước); ô chọn tháng (16px, ≥ 44px). Điểm TB theo từng khảo sát giữ trong khối gập. Lỗi riêng cổng tổng hợp → dải vàng ghi rõ, vẫn hiện số thật theo khảo sát như v2.7.2.
- QK4: không hiện ý kiến tự do (`noiDung`) dù cổng có trả – xem trên app KS.

### PHIÊN BẢN v2.8.6 ✅ – RÀ UX 375: CHỮ TỐI THIỂU 14PX (05/11/2026, lượt tự động ⑤)
- **Nội dung:** đo bằng trình duyệt không giao diện từng màn ở 375px (mọi chữ hiển thị + vùng bấm): nâng `.page-sub`, `.hero-date`, `.dong-sub` 13 → 14px, `.tq-nhan` 12 → 14px (dùng chung mọi màn), chip / nhãn Kanban, ô lọc PTKH, Flash Report Dự án, status-pill trong nội dung lên 14px. Vùng bấm < 44px: 0 (trừ 5T). Không đổi bố cục; không cuộn ngang ở 375 / 1280; 0 lỗi console Demo.
- Còn lại: màn ⭐ Đánh giá 5T (danhgia5t.js 78 KB, bảng 83 tiêu chí) còn nhiều chữ 10–12.5px và nút phụ < 44px – để lượt sau rà riêng vì bảng dày, sửa đại trà dễ vỡ bố cục.

### PHIÊN BẢN v2.8.5 ✅ – QUẢN TRỊ: MA TRẬN QUYỀN VAI TRÒ × MẢNG M0.2 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 🛡️ Người dùng & App thêm tab 🔑 Ma trận – bảng 16 mảng × 3 vai trò (Admin · Quản lý · Người dùng), suy đúng chốt chặn của mã v1: Phê duyệt / CRM / Dự án / Điều hành / Quản trị chỉ Admin (`canAdmin_`), Tài chính = Admin hoặc người phụ trách mảng TC (`83_TaiChinh.gs`), KPI / TS / KS / PK / PTKH theo danh sách người dùng của app đó, mảng chưa có máy chủ mở cho mọi người. Chỉ xem, không gửi gì; bảng cố định cột, không cuộn ngang ở 320px.
- Còn chờ v1: chiều Khoa/Phòng và sửa quyền theo từng ô cần cổng mới ở Hub – chưa ghi dòng v1, để Sếp chốt có cần không (vai trò đổi được ở tab 👤 Người dùng qua `webLuuNguoiDung`).

### PHIÊN BẢN v2.8.4 ✅ – CÔNG VIỆC: ĐÈN SLA XANH → VÀNG → ĐỎ M7.4 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 📋 Công việc tính đèn SLA cho từng thẻ theo hạn (Hôm nay · HH:MM · dd/mm[/yyyy]; quá hạn = 🔴, còn ≤ 4 giờ hoặc "đang diễn ra" = 🟡, còn lại 🟢, không đọc được = ⚪), dải chip đếm + lọc theo đèn, nút 📋 Sao chép cảnh báo (đỏ trước, vàng sau) để dán Telegram. Sửa chữ thẻ Kanban từ 10–13px lên ≥ 14px, thoát HTML nội dung thẻ.
- Còn chờ v1: Task Bus M7.1 (máy chủ gom việc từ các app + tự gửi Telegram khi chuyển 🔴) chưa có dòng v1 – màn vẫn dữ liệu MẪU; để Sếp chốt có mở dòng HUB mới không.

### PHIÊN BẢN v2.8.3 ✅ – TRI THỨC: ĐỒ THỊ LIÊN KẾT [[WIKI-LINKS]] M9.3 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 🧠 Tri thức đọc `[[Mã]]` / `[[Tên|nhãn]]` / `[[Mã#mục]]` trong tóm tắt + mảng `lienKet`, tính liên kết ra, liên kết ngược (backlinks), liên kết treo (chưa có bài); khối 🕸️ Đồ thị liên kết vẽ SVG (bấm nút / Enter để chọn); bấm tài liệu mở khung chi tiết thay cho toast. Tính hoàn toàn phía trình duyệt, không gửi gì.
- Còn chờ v1: kho tri thức (`05_TriThuc`) chưa có cổng máy chủ ➜ dữ liệu vẫn là MẪU ở cả Live; L21 (0B Phê duyệt) còn «ĐÃ CODE v1.13.9»; Hub trên app vẫn v1.13.3. **Chờ anh:** trộn PR #13 rồi đóng #14–#18 (trùng).

### PHIÊN BẢN v2.8.2 ✅ – CRM: PIPELINE B2B M2.3 (05/11/2026, lượt tự động ⑤)
- **Nội dung:** màn 👥 CRM thêm khối 📈 Pipeline B2B – 5 giai đoạn Tiếp cận → Báo giá → Hợp đồng → Triển khai → Tái ký, đếm doanh nghiệp KSK theo chữ ô Trạng thái (`webCRM` chưa có cột giai đoạn riêng), bấm 1 giai đoạn để lọc danh bạ; báo số doanh nghiệp "chưa rõ giai đoạn". Tính hoàn toàn phía trình duyệt, không gửi gì.
- Còn chờ v1 (nếu Sếp muốn chính xác hơn): cột `GiaiDoan` riêng trong sheet DoiTac + `webLuuDoiTac` nhận `giaiDoan` – chưa ghi dòng v1, để Sếp chốt.

### PHIÊN BẢN v2.8.1 ✅ – PK 👥 NHÂN SỰ: HỒ SƠ + DUYỆT SỬA HỒ SƠ (05/11/2026, lượt tự động ⑤)
- **Nội dung:** thẻ 👥 Nhân sự (app PK v1.0.7, quyền lãnh đạo / admin): bấm 1 người mở hồ sơ qua `webHoSoNhanSu({ma})`; khối YÊU CẦU SỬA HỒ SƠ từ `webNhanSu().yeuCauSua` với ✓ Đồng ý / ✕ Không duyệt qua `webDuyetSuaHoSo({id, dongY, lyDo})` (không duyệt bắt buộc lý do, khóa nút chống gửi trùng). Chuyển từ PR #17 sang nhánh PR #13 – PR #17 không còn phần nào riêng.
- **Chờ anh:** `gh pr merge` vẫn bị chế độ tự động chặn ("Merge Without Review") ➜ anh trộn PR #13 rồi đóng #14–#18 (trùng).

### PHIÊN BẢN v2.8.0 ✅ – QUẢN TRỊ: THÊM / SỬA / NGƯNG NGƯỜI DÙNG + BẬT / TẮT APP (05/11/2026, lượt tự động ⑤)
- **Nội dung:** HUB L22–L25 đã «KIỂM ĐẠT v1.13.5–v1.13.8» ➜ màn 🛡️ Người dùng & App gọi `webLuuNguoiDung({nguoi})` (➕ Thêm, ✏️ Sửa vai trò / trạng thái, kiểm trước "không ngưng Admin cuối", Hub kiểm lại) và `webLuuUngDung({ma, bat})` (nút Bật / Tắt từng app: hiện ngay, gửi sau 6 giây, Hoàn tác không gửi gì). CRM (`webCRM` / `webLuuDoiTac`), Dự án (`webDuAn`), Tài chính (`webTaiChinh`) đã gọi đúng cổng thật từ v2.5.x – rà lại khớp khuôn trả của mã v1.
- Còn chờ v1: Hub trên app vẫn v1.13.3 (L21–L25 chưa lên app) ➜ Live hiện dải vàng "chưa mở cổng" + số MẪU cho CRM / Dự án / Tài chính và nút lưu Quản trị báo lỗi cho tới khi lên app. L21 (0B Phê duyệt) còn «ĐÃ CODE v1.13.9», chưa «KIỂM ĐẠT».

### PHIÊN BẢN v2.7.9 ✅ – CSP CHO ẢNH MINH CHỨNG DRIVE (05/11/2026, lượt tự động ⑤)
- **Nội dung:** `index.html` CSP `img-src` thêm `drive.google.com`, `*.googleusercontent.com` – trước đó ảnh minh chứng (URL Drive từ `webChoDuyet`) bị trình duyệt chặn ở màn ⚡ Duyệt PK.
- ~~Còn lại (PR #17 có):~~ thẻ 👥 Nhân sự PK – đã chuyển sang ở v2.8.1.

### PHIÊN BẢN v2.7.8 ✅ – DỰ ÁN: MA TRẬN VƯỚNG MẮC M6.3 (05/11/2026, lượt tự động ⑤)
- Tab 🧱 Ma Trận Vướng Mắc trong màn Dự án, tính phía trình duyệt (Flash khối 2 + dự án đỏ / vàng / quá hạn), sao chép để giao việc.
- Lượt 05/11 06:12 đẩy tiếp lên nhánh PR #13 (không mở PR mới để khỏi trùng). **Chờ anh:** `gh pr merge` vẫn bị chế độ tự động chặn ("Merge Without Review") ➜ anh trộn PR #13 (bản đã kiểm 375/1280, 0 lỗi console Demo) rồi đóng #14, #15, #16; hoặc thêm quyền cho `gh pr merge` để lượt sau tự trộn.
- Còn chờ v1: HUB L21–L25 vẫn «ĐÃ CODE», chưa «KIỂM ĐẠT» (mục f); Task Bus M7.1 chưa có máy chủ (nút ➜ Task Bus của M6.3 tạm là sao chép).

### PHIÊN BẢN v2.7.7 ✅ – PTKH GỐC: BÁO CÁO 14 NGÀY + LỊCH TỔ (05/11/2026, lượt tự động ⑤)
- Màn PTKH gốc đọc `webLichSu` + `webLichTo` qua `webGoi` (chỉ đọc; nộp / sửa vẫn mở app PTKH).
- Lượt 05/11 gom v2.7.5 + v2.7.6 từ PR #14 vào nhánh PR #13. **Chờ anh:** lệnh `gh pr merge` bị chế độ tự động của Claude Code chặn ("Merge Without Review") ➜ PR #13 chưa trộn; #14, #15, #16 làm trùng từ main cũ – trộn #13 rồi đóng 3 PR kia (hoặc cho phép `gh pr merge` trong cài đặt quyền).
- Còn chờ v1: HUB L21–L25 mới «ĐÃ CODE v1.13.4–v1.13.8», chưa «KIỂM ĐẠT» ➜ chưa nối pheduyet / crm / duan / taichinh / quantri (mục f).

### PHIÊN BẢN v2.7.6 ✅ – KPI NHÁP AOP NĂM SAU (04/11/2026, lượt tự động ⑤)
- Màn chỉnh nháp AOP năm sau (`webNhap2027` + `webLuuTangTruong`).
- Còn chờ v1: KPI L10 (v1.8.2, có `webNhap2027` trong congWeb_) chưa lên app (app đang v1.8.1) – lên app xong màn chạy số thật.
- Còn chờ v1: HUB L21–L25 (Phê duyệt, CRM, Dự án, Tài chính, Quản trị) chưa «KIỂM ĐẠT» ➜ chưa nối pheduyet / crm / duan / taichinh / quantri (mục f).

### PHIÊN BẢN v2.7.5 ✅ – PTKH GỐC: TỔNG QUAN THÁNG SỐ THẬT (04/11/2026, lượt tự động ⑤)
- Màn PTKH gốc đọc `webDashboard` qua `webGoi` của PTKH (đã lên app v1.297.18).
- Lượt sau: Báo cáo / Lịch PTKH qua `webGoi`; dùng `webGuiNghiPhep` để màn Phòng PTKH xin nghỉ ngay trên v2.

### PHIÊN BẢN v2.7.4 ✅ – RÀ UX ĐO ĐƯỢC TRÊN 16 MÀN (04/11/2026)
- **Cách đo:** Chrome chạy ngầm, mở lần lượt 16 mục menu, đếm chữ có cỡ < 14px và nút / ô nhập cao < 44px.
- **Đã sửa:** 📌 Dự án – 6 nút 36px ➜ 44px, chữ 10–12px trong thẻ / nút ➜ 13–14px.
- **Còn lại (để lượt sau, không đổi bố cục lớn):** ⭐ Đánh giá 5T còn nhiều ô chọn 22px, ô ghi chú 26px, chữ bảng 10–12,5px (danhgia5t.js 78 KB – cần 1 lượt riêng); chữ phụ dùng chung `page-sub` / `hero-date` / `dong-sub` 13px và `tq-nhan` 12px theo bộ CSS chung – cần anh chốt có nâng lên 14px toàn hệ không.

---

### PHIÊN BẢN v2.7.3 ✅ – M9.2 TÌM KIẾM TOÀN VĂN PHÍA TRÌNH DUYỆT (04/11/2026)
- **Nội dung hoàn tất:** `trithuc.js` – ô tìm trong Hero (16px), so khớp không dấu tiếng Việt, mọi từ phải khớp, xếp hạng mã/tên trước, chip lọc lĩnh vực, tô đậm chỗ khớp, trạng thái "không thấy". Sửa theo 10 nguyên tắc: bỏ chữ 10–12px và nút 36px, thêm esc cho mọi chữ, bỏ onclick ghép chuỗi tên tài liệu.
- **Còn chờ v1:** kho tri thức chưa có máy chủ (dữ liệu vẫn là MẪU); FTS5 phía máy chủ để sau.

---

### PHIÊN BẢN v2.7.2 ✅ – KHẢO SÁT GỌI ĐÚNG CỔNG THẬT KS v1.4.3 (04/11/2026)
- **Mục tiêu:** KS v1 không có `webTongQuan` ➜ màn 🩺 Khảo sát dùng đúng cổng đã lên app (L1–L4).
- **Nội dung hoàn tất:**
  1. `khaosat.js`: `webDsKhaoSat` + `webKetQuaKS` song song (≤ 6 KS, ưu tiên Đang mở) ➜ Hero (KS đang mở · phiếu hợp lệ · chờ xác minh), điểm TB câu 5 mức theo KS, câu TB ≤ 2★ nổi lên đầu; nút ⬇ CSV gọi `webXuatKS` tải tệp về máy.
  2. KS nhận `du` là đối tượng (không `du.a`) – sửa HOP_DONG_CONG_V2.md mục KS theo mã v1, bỏ yêu cầu `webTongQuan`.
  3. Một vài KS lỗi đọc kết quả ➜ dải vàng nói rõ số KS lỗi, các số còn lại vẫn là số thật.
- **Còn chờ v1:** KPI `webNhap2027` chưa có trong `congWeb_` (mã v1) ➜ đã thêm dòng **KPI L10** (04/11); màn chỉnh nháp AOP năm sau dựng khi L10 lên app. HUB L21–L25 (0B, CRM, Dự án, Tài chính, Quản trị) còn `[ ]` ➜ chưa nối pheduyet / crm / duan / taichinh / quantri.
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
