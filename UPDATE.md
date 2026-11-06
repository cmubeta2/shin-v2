# KẾ HOẠCH NÂNG CẤP PHIÊN BẢN (UPDATE.md) – SHIN v2

*Tài liệu quản trị phiên bản bắt buộc cho kho `shin-v2`.*  
*Phiên bản hiện tại: **v2.9.6** · Cập nhật ngày: **06/11/2026**.* · Hợp đồng cổng cho v1: **[HOP_DONG_CONG_V2.md](HOP_DONG_CONG_V2.md)**.  
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
