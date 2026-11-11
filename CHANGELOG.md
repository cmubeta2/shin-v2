# NHẬT KÝ THAY ĐỔI (CHANGELOG) – SHIN v2

Tất cả các thay đổi kiến trúc, tính năng và bản phát hành của SHIN v2 được lưu trữ tuần tự tại đây theo chuẩn Keep a Changelog.

---

## [2.13.22] – 11/11/2026 (🧠 TRI THỨC: GỠ CHỮ "CÒN CHỜ v1" ĐÃ CŨ)

### 🧠 Tri thức
- Khung ⓘ Nguồn dữ liệu: bỏ dòng "Còn chờ v1: ghi bài học (`webLuuBaiHoc`, HUB L28 phần ghi)" – HUB L28 đã lên app đủ (L28a/b v1.20.2 @20, L28c v1.21.1 @21); thay bằng chỉ dẫn gửi bài học ở 📁 Dự án (có từ v2.13.10).
- `sw.js`: PHIEN_BAN_SW ➜ `shin-v2.13.22` (tệp vỏ app đổi nội dung).

## [2.13.21] – 11/11/2026 (🔍 GỠ CHỮ < 14px / VÙNG BẤM < 44px)

### 🎓 Tuyển sinh · ⚙️ Cài đặt · chung
- LMS mini: bỏ `font-size:12px` nội dòng ở nhãn chuyên cần, nhãn tiến độ tuần và dòng mục tiêu bài M01–M20 (theo `.badge` 14px).
- `.filter-chip` (Đánh giá 5T): 12px / 36px ➜ 14px (theo `--font-scale`) / 44px.
- Thẻ chọn bộ màu ở Cài đặt: tên 13px, mô tả 11px ➜ 14px. `js/modules/web.js` (chưa nạp vào app): chữ 12px ➜ 14px, nút 36px ➜ 44px.

---

## [2.13.20] – 10/11/2026 (🎨 GIAO DIỆN XƯỞNG PHỄU LẶN BIỂN – phiếu agy M8.5)

### 📣 Marketing
- Khối "🌊 Xưởng phễu Lặn Biển": bỏ mọi `style=` nội dòng ➜ lớp CSS `.lb-` (chỉ `var(--…)`, 8 bộ màu sáng/tối); mỗi tầng 1 thẻ có dải màu độ sâu nhạt ➜ đậm (color-mix với `--primary`) + nhãn độ sâu; thanh "Độ sâu đã điền" 5 ô xanh / vàng / xám + phần trăm.
- Nút ⬇️ Tải index.html là nút chính (rộng hết trên di động), 👁 Xem trước + 📋 Sao chép xếp lưới 2 cột; vùng bấm ≥ 44px, ô nhập 16px. Logic hàm thuần + khóa nháp giữ nguyên.
- Rà khi nhận: bỏ đoạn tự mở khối gập mỗi lần vẽ màn (giữ mặc định gập) và các màu dự phòng cứng.

---

## [2.13.19] – 10/11/2026 (🌊 XƯỞNG PHỄU LẶN BIỂN – M8.5)

### 📣 Marketing
- Khối mới "🌊 Xưởng phễu Lặn Biển 0m ➜ -105m" (`js/modules/pheu_lanbien.js`): 5 tầng sâu (0m thu hút · -15m băn khoăn · -30m giải pháp & bằng chứng · -60m lời đề nghị + hỏi đáp · -105m chốt), 2 bộ MẪU (tuyển sinh, khám sức khỏe), thanh độ sâu đã điền, kiểm đủ trường + đường dẫn nút (chỉ https / tel / mailto) + từ cấm quảng cáo y tế + còn chữ "MẪU".
- Xem trước trong khung cô lập (sandbox), 📋 sao chép HTML, ⬇️ tải 1 tệp `index.html` tĩnh tự chứa (CSS nội tuyến, không JS, có chế độ tối) + hướng dẫn đăng Netlify Drop / Cloudflare Pages / Vercel. Nạp mẫu / xóa nháp có Hoàn tác 6s. Nháp lưu trên máy.
- Còn chờ v1: đăng tự động 1 chạm + form thu lead đổ về Tuyển sinh / CRM (`lead_web`).
- sw.js: thêm tệp vào VO_APP, PHIEN_BAN_SW `shin-v2.13.19`.

## [2.13.18] – 10/11/2026 (RÀ UX SÂU TAB CON + GỘP NHẬP HỘ VÀO KHẢO SÁT)

### 🔍 Rà UX (kéo trước một phần T7 14/11 – không thêm tính năng)
- Kịch bản Edge headless mới: mỗi màn bấm lần lượt từng tab con (`.tab-nut` / `.hang-tab` / `.chip-chon` / `.hang-chip`) – 17 màn, 126 tab con × 375 + 1280: 0 cuộn ngang, 0 chữ < 14px, 0 ô nhập < 16px, 0 nút < 44px.
- Rung phản hồi (`ShinApp` haptic): bỏ qua khi trang chưa có cử chỉ thật của người dùng (`navigator.userActivation`) – hết 60 dòng lỗi console "Blocked call to navigator.vibrate".

### 🩺 Khảo sát
- Bỏ lớp bọc tạm `ModuleKhaoSat.veQuanLy` của v2.13.16: khaosat.js gọi thẳng `ModuleKsNhapHo.veKhoi(d)`; nút chip câu nhập hộ dùng lớp `.ks-nh-chip` thay style= nội dòng.

## [2.13.17] – 10/11/2026 (🩺 KHẢO SÁT – GIAO DIỆN QUẢN LÝ, phiếu agy M1.5)

### 🎨 Giao diện (Viết: agy sandbox 11100334 · Soát chéo + chép về: Claude)
- Thẻ khảo sát: lưới 2 cột nút (≥ 44px), nút trạng thái nổi bật, 🗑 Xóa viền đỏ.
- Form sửa: mỗi câu 1 thẻ tự cao theo nội dung – STT + ô tick 1 cột, nội dung giữa, ▲▼ 44×44 xếp dọc để đổi thứ tự (lưu theo thứ tự trên màn), tự khóa ở câu đầu / cuối.
- 📚 Ngân hàng câu hỏi: ô tìm + chip lọc Nhóm / Loại (wrap, ≥ 44px), dòng thống kê "Hiển thị x / y".
- Mọi chữ ≥ 14px, không cuộn ngang 320 / 375; bỏ style= nội dòng agy thêm (thay lớp CSS), #fff → var(--on-primary).

## [2.13.16] – 10/11/2026 (🩺 KHẢO SÁT – 📝 NHẬP HỘ PHIẾU GIẤY)

### 🩺 Khảo sát (cổng KS L2 `webNhapHo` + `webCongKhaiDocKS` có sẵn – không cần cổng v1 mới)
- 🛠️ Quản lý khảo sát có thêm dải 📝 Nhập hộ phiếu giấy: mỗi khảo sát Đang mở 1 nút ➜ form điền đúng phiên bản câu (`webCongKhaiDocKS`), câu dạng nút (5★, NPS 0–10, Có/Không, chọn 1, chọn nhiều – vùng bấm ≥ 44px) và ô chữ / số.
- 📤 Lưu phiếu: kiểm như `loiPhieuKS` v1 (bắt buộc, khoảng điểm, lựa chọn lạ, chữ ≤ 200 / 2000) + tường lửa M9.5 (CCCD / BHYT / khóa) ➜ Toast Hoàn tác 6s (Hoàn tác = không gửi gì) ➜ `webNhapHo` đúng 1 lần, xong xóa form để nhập phiếu tiếp. Demo: điền thử, không ghi.
- Tệp mới `js/modules/ks_nhapho.js` (VO_APP + PHIEN_BAN_SW shin-v2.13.16). Tạm gắn vào khối Quản lý qua lớp bọc `veQuanLy` vì khaosat.js đang có phiếu agy giao-dien – gộp thẳng khi phiếu trả.

## [2.13.15] – 09/11/2026 (🩺 KHẢO SÁT – 🛠️ QUẢN LÝ KHẢO SÁT NGAY TRÊN v2)

### 🩺 Khảo sát (cổng KS L1 có sẵn từ app KS v1.0.2 – không cần cổng v1 mới)
- Khối mới 🛠️ Quản lý khảo sát (nút trên Hero thay cho "mở app KS"): danh sách khảo sát + nút ▶ Mở / ⏸ Đóng / ↩ Về nháp, ✏️ Sửa, ⧉ Nhân bản, 🗑 Xóa (đổi trạng thái + xóa: Toast Hoàn tác 6s, Hoàn tác thì không gửi gì).
- Form tạo / sửa: tiêu đề, mô tả, đối tượng, hạn dd/mm/yyyy, cho trả lời nhiều lần, cách hiện câu; tick câu từ ngân hàng ➜ `cauHinh` (giữ thứ tự câu cũ).
- 📚 Ngân hàng câu hỏi: thêm / sửa câu (10 loại, lựa chọn mỗi dòng 1), câu người khác tạo ➜ ⧉ Nhân bản để sửa. 🔑 Cấp quyền Quản lý khảo sát / Admin (máy chủ chỉ cho Admin).
- Hàm thuần `kiemKS`, `cauHinhTu`, `kiemCau`, `kiemQuyen`, `nutTrangThai` (15 ca đạt). Demo: dữ liệu mẫu 3 khảo sát + 4 câu, không ghi.
- CSS: nhãn ô nhập `.tc-form-nhom .nhan-o` 13px ➜ 14px (đúng chuẩn chữ ≥ 14px, áp cả form Tài chính).

## [2.13.14] – 09/11/2026 (🏥 PHÒNG KHÁM – 🗓️ LỊCH CẢ TỔ CHO TỔ TRƯỞNG)

### 🏥 Phòng Khám (cổng PK `webBangXepLich`, app PK v1.0.7 đã lên app – không cần cổng v1 mới)
- Thẻ mới 🗓️ Lịch cả tổ (chỉ tổ trưởng / admin thấy): từng ngày trong tuần liệt kê người theo vị trí (kèm ca), người nghỉ, người chưa xếp; Hero 3 số (người trong tổ, vị trí, ngày cần xem).
- Hàm thuần `tomTatXepLich`: ⚠️ khi ngày có ≥ 2 người nghỉ, người đi làm dưới nửa tổ, hoặc vị trí có trong tuần mà ngày đó không ai đứng. Chỉ xem – xếp / sửa ca vẫn làm trên app PK.
- Gỡ dòng 🟡 "bảng xếp lịch toàn phòng" của bảng đối chiếu P3.

## [2.13.13] – 09/11/2026 (👥 CRM – GIAO DIỆN LỊCH SỬ TƯƠNG TÁC + LEAD CHĂM SÓC)

### 👥 CRM (nhận phiếu agy 11091025_V2_M2.4_giao-dien)
- Lịch sử tương tác dạng dòng thời gian gọn (biểu tượng kênh, ngày, người ghi); chọn kênh bằng nhóm chip 1 chạm (≥ 44px) thay ô chọn; ô nội dung có đếm ký tự /500 + lưu ý không ghi SĐT / thông tin người bệnh.
- Hàng lead mới chuyển inline style sang lớp `crm-tt-*`; lead đã chăm sóc mờ nhẹ + viền xanh.
- Em rà lại: gỡ đoạn agy tự thêm tự mở chi tiết qua `?ct=` (ngoài phạm vi); nâng mọi chữ 12–13px của khối mới lên 14px theo chuẩn thiết kế. Logic gửi (`webGhiTuongTac`, `webDanhDauLead`) không đổi.

## [2.13.12] – 09/11/2026 (⚙️ KẾT NỐI TELEGRAM CÁ NHÂN NGAY TRÊN v2)

### ⚙️ Cài đặt
- Thẻ 🤖 Nhận thông báo qua Telegram: Bước 1 gọi HUB `webMaTG` ➜ mở bot `t.me/<bot>?start=<mã 15 phút>` (chỉ mở link đúng dạng t.me – link lạ bị chặn); Bước 2 "Tôi đã bấm Start" gọi `webXacNhanTG` ➜ báo đã kết nối. Khóa bấm đúp; Demo không gọi.

## [2.13.11] – 09/11/2026 (🩺 PHÒNG KHÁM – 📋 CHI TIẾT VIỆC: VIỆC CON + TRAO ĐỔI)

### 🩺 Phòng khám › ✅ Công việc
- Mỗi việc có nút 📋 mở chi tiết đọc thật `webChiTietViec` (mô tả, việc con, trao đổi với người giao). Tick / bỏ tick việc con và ghi trao đổi mới ➜ Toast Hoàn tác 6s ➜ `webCapNhatViec` 1 lần, chỉ gửi phần đổi (`viecConXong`, `traoDoiMoi`). Việc cá nhân không có ô trao đổi (đúng luật PK). Lỗi đọc ➜ dải cảnh báo, không thay số mẫu. Demo: chi tiết mẫu, không gửi.

## [2.13.10] – 09/11/2026 (🧠 GỬI BÀI HỌC VÀO KHO TRI THỨC – HUB L28 webLuuBaiHoc)

### 🗂️ Dự án › Ma trận vướng mắc
- Nút 📤 Gửi bài học vào kho 🧠: mỗi bài học trích từ Flash (M9.4) kiểm theo luật Hub `kiemBaiHoc` (vấn đề 5–500, cách làm 5–1000, chặn SĐT / CCCD / BHYT / "BN") ➜ Toast Hoàn tác 6s ➜ `webLuuBaiHoc` từng bài 1 lần; mã gửi ổn định theo nội dung nên gửi lại chỉ báo "đã có sẵn", không tạo bài trùng. Bài vào sổ BaiHoc trạng thái Chờ – Admin duyệt. Demo: không gửi.

## [2.13.9] – 09/11/2026 (👥 CRM – NỐI HUB L29: GHI LIÊN HỆ + ĐÁNH DẤU LEAD)

### 👥 CRM
- HUB L29 lên app (Hub v1.20.2 @20) ➜ chi tiết đối tác có ô 💬 Ghi lần liên hệ (kênh Gọi / Zalo / Email / Gặp / Khác + nội dung ≤ 500): kiểm như `kiemTuongTac` của Hub (chặn SĐT kể cả có dấu chấm, CCCD, BHYT, "BN") ➜ Toast Hoàn tác 6s ➜ `webGhiTuongTac` đúng 1 lần, `maGui` giữ tới khi Hub nhận (gửi lại không tạo dòng trùng); dòng mới hiện ngay trong lịch sử.
- Lead mới từ web phễu: nút ✅ Đánh dấu đã chăm sóc ➜ `webDanhDauLead` (chỉ ghi ô TrangThai, không xóa lead); lead đã đánh dấu hiện nhãn ✓ và không còn tính vào nhắc > 24 giờ.
- Demo: thêm sổ tương tác mẫu + mã DT001… / LD001…; không gửi gì.

## [2.13.8] – 09/11/2026 (🗓️ XIN NGHỈ – GIAO DIỆN LỊCH TUẦN, phiếu agy 11090620)

### 📋 PTKH gốc
- Khối 🗓️ Xin nghỉ làm lại giao diện (chỉ giao diện, không đổi logic / cổng): 2 nút loại đơn chia đôi; 28 ngày chia 4 thẻ tuần (khoảng ngày + nhãn "Đã khóa" khi quá hạn), lưới 4 cột ở điện thoại / 7 cột từ 768px, chip 2 dòng thứ / ngày cao 48px; phân biệt Đang chọn / Đã xin ✓ / Lễ 🎌 / Khóa + chú giải; hộp "Đã chọn n ngày" kèm danh sách ngay trên nút gửi; đơn đã gửi dạng thẻ gọn (bấm mở app PTKH).
- Rà theo luật thiết kế: bỏ màu viết cứng (#fff / rgba) ➜ `var(--on-primary)`; mọi chữ trong khối ≥ 14px.

## [2.13.7] – 09/11/2026 (🗓️ XIN NGHỈ NGAY TRÊN v2 – đối chiếu P3 #1)

### 📋 PTKH gốc
- Khối 🗓️ Xin nghỉ: Lịch nghỉ tuần (chọn ngày 4 tuần tới, khóa ngày lễ / đã xin / tuần sau quá hạn) và Nghỉ ốm (từ – đến, buổi, lý do) ➜ gửi thẳng PTKH qua `webGoi` ➜ `webGuiNghiPhep` sau Toast Hoàn tác 6s, đúng 1 lần; đọc `webLichNghiNV` để vẽ lịch. Kiểm như `loiNghiPhep` + chặn SĐT / CCCD / BHYT trong lý do. Đổi ca vẫn mở app PTKH.

## [2.13.6] – 09/11/2026 (PWA HOÀN THIỆN)

### 📲 PWA
- Vỏ app offline thêm `js/modules/danhgia5t.js` + `danhgia5t.html` (trước thiếu), PHIEN_BAN_SW `shin-v2.13.6`.
- Toast "Đã có bản SHIN mới" + nút Tải lại khi service worker mới thay bản cũ; app cài tự kiểm bản mới khi quay lại (≤ 1 lần / 30 phút).
- Manifest thêm lối tắt Tài chính, Marketing.

---

## [2.13.5] – 08/11/2026 (RÀ UX 17 MÀN – vùng bấm + cỡ chữ)

### 🎨 Giao diện
- Nút icon đầu màn (↻ / ＋ / 🏠) luôn đủ 44×44px ở 375px (không bị flex bóp).
- 💰 Tài chính: huy hiệu trạng thái dự án, số tiền vượt, nhãn Chờ duyệt / Đã chi lên 14px.

## [2.13.4] – 08/11/2026 (GIAO DIỆN 🧠 TRI THỨC + offline.html – phiếu agy)

### 🎨 Giao diện
- 🧠 Tri thức: thẻ tài liệu xuống dòng gọn ở 320–375px, lĩnh vực thành badge, ngày cập nhật chữ phụ; dải đỏ khi Hub lỗi kèm câu hướng dẫn đồng bộ kho; 3 trạng thái trống riêng (lỗi / Live chưa có tài liệu / Demo); nút ✕ đủ 44px. Ghi chú cuối thẻ sửa lại: Hub chỉ trả chỉ mục (L28a).
- offline.html: bố cục rõ hơn, tự tải lại khi có mạng trở lại (sự kiện `online`).

## [2.13.3] – 08/11/2026 (M3.3 / M3.4 🟢 · CRM ĐÓN SẴN HUB L29)

### ✨ Tính năng
- 👥 CRM: ô chọn giai đoạn pipeline + lịch sử tương tác trong chi tiết đối tác – tự bật khi Hub trả `giaiDoan` / `tuongTac` (HUB L29); pipeline B2B ưu tiên cột GiaiDoan, không có thì suy từ Trạng thái.
- 💰 Tài chính: xác nhận M3.3 hoa hồng + M3.4 tạm ứng / thanh toán gửi thật vào 0B qua `webGuiDeXuatChi` ➜ 🟢.

## [2.13.2] – 08/11/2026 (M9.1 🟢 TRI THỨC ĐỌC THẬT)

### ✨ Tính năng
- 🧠 Tri thức: Live đọc thật HUB L28a `webTriThuc` (Hub v1.18.5) – 3 số đầu (tài liệu · lĩnh vực · liên kết) tính từ số thật, ngày cập nhật chỉ mục; chưa có chỉ mục ➜ dải đỏ, không thay số mẫu. Tìm kiếm + đồ thị liên kết chạy trên danh sách thật.

## [2.13.1] – 08/11/2026 (M0.2 RBAC PHÍA TRÌNH DUYỆT)

### 🔒 Quyền
- `chuyenModule` chặn mở thẳng (lối tắt ?m=, nút chuyển màn) mảng mà chốt chặn quyền v1 đã từ chối ➜ màn 🔒, không gọi máy chủ. Tách `mangCoQuyen` (quyền) khỏi `mangDangBat` (anh/chị tự tắt). 🧭 Điều hành / Quản trị: câu "chỉ dành cho Admin Hub". sw.js shin-v2.13.1.

## [2.13.0] – 08/11/2026 (PWA: BÁO MẤT MẠNG)

### ✨ Tính năng
- Dải 📴 báo mất mạng (sự kiện offline/online) đầu trang: vỏ app vẫn mở từ bản lưu, nói rõ số liệu chưa cập nhật; có mạng lại ➜ ẩn dải + nhắc bấm ↻.
- Trang `offline.html` (tệp mới, có trong VO_APP): hiện khi mất mạng mà máy chưa từng lưu vỏ app. `sw.js` shin-v2.13.0; `.gitignore` thêm `!/offline.html`.

## [2.12.2] – 08/11/2026 (M6.4 🟢 GỬI ĐỀ XUẤT CHI THẬT + GIAO DIỆN TÀI CHÍNH / LMS)

### ✨ Tính năng
- 💰 Tài chính › ✍️ Đề xuất chi: nút 📤 Gửi vào Phê duyệt 0B gọi thật HUB L26 `webGuiDeXuatChi` (lên app Hub v1.18.5) – kiểm đủ trường + tường lửa M9.5, Toast Hoàn tác 6s (Hoàn tác = không gửi), `maGui` chống trùng (gửi lại sau lỗi mạng không tạo phiếu thứ 2). Demo: không gửi. Giữ nút 📋 sao chép.
- `kiemDeXuat`: nhận số tiền dạng chuỗi '1.500.000', chặn tên dự án > 120 ký tự (khớp Hub).

### 🎨 Giao diện (agy)
- 💰 Tài chính + 🔳 VietQR: lớp CSS `.tc-` (badge mức dự toán, thanh giải ngân, form nhóm) – phiếu 11080424_V2_M3.1_giao-dien.
- 🎓 Tuyển sinh › LMS: thẻ học viên, badge chuyên cần, tên bài M01–M20 chuẩn hóa – phiếu 11080619_V2_M4.5_giao-dien.

## [2.12.1] – 08/11/2026 (M4.5 LMS MINI)

### ✨ Tính năng
- 🎓 Tuyển sinh › 🏫 Lớp học & điểm danh: chọn lớp, điểm danh theo ngày, chuyên cần từng học viên (cảnh báo < 80%), bài M01–M20 theo tuần. Tệp mới `js/modules/mau_lms.js` (dữ liệu mẫu); lưu trên máy `shin_lms`. Header + `sw.js`: shin-v2.12.1.

## [2.12.0] – 08/11/2026 (M8.6 HIỆU SUẤT TRUYỀN THÔNG)

### ✨ Tính năng
- 📣 Marketing › 📊 Hiệu suất truyền thông: tổng + từng kênh (tiếp cận, % tương tác, % bấm, lead / 1.000), nhập tay số từng bài, xóa có Hoàn tác 6s. `soNhap`, `tongHieuSuat` thuần; số mẫu chỉ ở Demo.

## [2.11.1] – 08/11/2026 (M8.3 SMART LEAD DISPATCHER)

### ✨ Tính năng
- `ModuleMarketing.phanLuongLead` + 👥 CRM: lead mới gắn luồng (KSK / Tuyển sinh / Đặt khám / Đối tác / Chưa rõ) và nút chuyển tới màn đích. Header + `sw.js`: shin-v2.11.1.

## [2.11.0] – 08/11/2026 (MẢNG 8 MARKETING PHẦN 1)

### ✨ Tính năng
- Module mới 📣 Marketing & Nội dung: M8.1 lịch 4 tuần đa kênh lọc tầng phễu, M8.2 xưởng mẫu 12 khuôn (điền chỗ trống, xem trước, kiểm từ cấm QC y tế), M8.4 chốt chặn duyệt (Hoàn tác 6s; chỉ bài đã duyệt sao chép được). Khuôn `js/modules/mau_marketing.js` (agy). `index.html`, `sw.js`: shin-v2.11.0.

## [2.10.4] – 08/11/2026 (M3.1 VIETQR)

### ✨ Tính năng
- `js/vietqr.js` mới: chuỗi VietQR (EMVCo/NAPAS, CRC16) + bộ mã hóa QR thuần vẽ SVG offline. 💰 Tài chính: khối 🔳 Mã VietQR nhận tiền (số TK chỉ lưu localStorage máy này). `index.html` + `sw.js` VO_APP thêm `js/vietqr.js`; shin-v2.10.4.

## [2.10.3] – 08/11/2026 (M3.3 HOA HỒNG CTV)

### ✨ Tính năng
- 🎓 Tuyển sinh: nút 💸 Lập đề nghị chi hoa hồng ở chiến dịch có hoa hồng (webLeadCD.hoaHong) ➜ 💰 Tài chính điền sẵn phiếu Thanh toán (`ModuleTaiChinh.deXuatHoaHong`, `moDeXuat`, `apDienSan`). Header + `sw.js`: shin-v2.10.3.

## [2.10.2] – 08/11/2026 (M3.2 NGÂN SÁCH THEO DỰ ÁN)

### ✨ Tính năng
- 💰 Tài chính: khối Ngân sách & giải ngân theo dự án (Live `webDuAn` song song `webTaiChinh`; lỗi riêng khối, không dùng số mẫu). Hàm thuần `ModuleTaiChinh.lechDuToan` (vượt > 100% / sắp chạm > 90% / chưa có dự toán). Chi phát sinh từ Flash dự án. Demo `duAnNS`, `phatSinh`. Header + `sw.js`: shin-v2.10.2.

## [2.10.1] – 08/11/2026 (M3.4 TẠM ỨNG / THANH TOÁN)

### ✨ Tính năng
- 💰 Tài chính: form ✍️ gộp 3 loại phiếu Chi / Tạm ứng (hạn hoàn ứng) / Thanh toán (số chứng từ), hiện ô theo loại. `ModuleTaiChinh.kiemDeXuat(p, soat, homNay)` kiểm theo luật HUB L26 (Hub v1.15.7) và trả `goi` cho `webGuiDeXuatChi`. Vẫn sao chép phiếu (L26 chưa lên app). Header + `sw.js`: shin-v2.10.1.

## [2.10.0] – 07/11/2026 (M6.4 SOẠN ĐỀ XUẤT CHI)

### ✨ Tính năng
- 💰 Tài chính: khối gập ✍️ Soạn đề xuất chi (M6.4) – khoản mục, số tiền (đọc kiểu VN), dự án / hạng mục (gợi ý từ khoản chờ duyệt), lý do; kiểm đủ trường + tường lửa M9.5 (`SHIN_API.soatKhongDuaVao`) rồi sao chép phiếu để gửi kế toán nhập Phê duyệt 0B. Hàm thuần `ModuleTaiChinh.kiemDeXuat`. Không gửi gì lên máy chủ (Hub chưa có cổng tạo phiếu chi – xin HUB L26). Header + `sw.js`: shin-v2.10.0.

## [2.9.9] – 06/11/2026 (ĐỒNG BỘ TRẠNG THÁI HUB v1.15.6)

### 📝 Tài liệu
- HUB L21–L25 đã lên app v1.15.6 @15 (06/11): `QUY_HOACH_10_MANG_AIOS.md` mục 2 chuyển 🟢 M0.1 (`webLuuUngDung`), M0B.2–M0B.4 (`webDuyet` / `webPheDuyet`), M2.3 (`webCRM`), M6.2 (`webDuAn`). Màn đã nối từ v2.8.x – không đổi mã. Header + `sw.js`: shin-v2.9.9.

## [2.9.8] – 06/11/2026 (NHỊP THÁNG: NTC M5.5 + CẢM NHẬN M5.6)

### ✨ Tính năng
- `js/modules/ptkh.js`: khối 🧭 **Nhịp tháng của tôi** đọc cổng có sẵn `webLichSuThang(token, 'yyyy-MM')` của PTKH (đã trong `HAM_WEBGOI_`) cho tháng này + tháng trước (tuần ISO vắt tháng). Hàm thuần `nhipThang` làm đúng luật `phatNTCTuan_` / `demTruNTCThang_` của PTKH (L111c): ngày Ca NTC đếm theo tuần ISO T2–CN, lần ≥ 4 ➜ trừ ½ công, tính vào tháng của ngày vượt; bỏ báo cáo đã hủy / thử. Hiện: Ca NTC tuần này x/3, ngày công bị trừ, dải ⚠️ các ngày vượt; cảm nhận sau ca 1–5★ trung bình + phân bố; BC đúng hạn tháng. Chỉ đọc, lỗi cổng báo riêng khối, không thay bằng số mẫu.
- `js/demo_data.js`: `lsThang` MẪU (4 ca NTC tuần 02–08/11 ➜ trừ 0,5 công). `sw.js`: shin-v2.9.8.

## [2.9.7] – 06/11/2026 (DÒ TRÙNG NGHỈ CẢ TỔ)

### ✨ Tính năng
- `js/modules/ptkh.js`: hàm thuần `doTrungTo(lichTo)` trên cổng `webLichTo` (PTKH, đã có trong `HAM_WEBGOI_` – trả lịch tuần + nghỉ đã duyệt của cả tổ): ngày có ≥ 2 người nghỉ, hoặc số người còn ca < nửa tổ ➜ dải ⚠️ "Trùng nghỉ cả tổ" trên khối 📅 Lịch tổ + dấu ⚠️ và "còn x/y người có ca" trên dòng ngày. Bỏ ngày lễ, tổ < 2 người. Chỉ đọc, không gửi gì.
- `js/demo_data.js`: thêm 1 người MẪU cùng nghỉ T6. `sw.js`: shin-v2.9.7.

## [2.9.6] – 06/11/2026 (RÀ UX 375 + 1280)

### 🐛 Sửa lỗi
- `css/styles.css`: `.form-input` từ 14px lên `max(16px, 14px × cỡ chữ)` – trước đây ô nhập ở 🧭 Điều hành, 📋 Đánh giá 5T (160 ô), 🛡️ Quản trị, 👥 Đối tác chỉ 14px ➜ iPhone tự phóng to khi gõ (nguyên tắc: ô nhập 16px).
- Rà tự động 16 màn × 2 bề rộng (Edge không giao diện qua CDP, chế độ Demo): 0 cuộn ngang, 0 vùng bấm < 44px, 0 chữ < 12px, 0 lỗi console. `sw.js`: shin-v2.9.6.

## [2.9.5] – 06/11/2026 (KIỂM TRA TRÙNG LỊCH M5.3)

### ✨ Tính năng
- `js/modules/phongkham.js`: hàm thuần `xungDotLich(ngay, donNghi)` – ngày đang xếp ca nằm trong đơn nghỉ (chờ duyệt / đã duyệt, không tính đổi ca) ➜ thẻ ⚠️ TRÙNG LỊCH đầu tab 📅 Lịch tuần và dấu ⚠️ trên dòng ngày.
- `js/demo_data.js`: thêm 1 đơn nghỉ MẪU (07/11, đã duyệt) để Demo thấy cảnh báo. `sw.js`: shin-v2.9.5.

## [2.9.4] – 06/11/2026 (ĐỒNG BỘ CẤU HÌNH M0.1)

### ✨ Tính năng
- `js/modules/caidat_module.js`: khối "Đồng bộ cấu hình sang máy khác" – sao chép / dán mã `SHINCFG1.…` (8 khóa giao diện theo danh sách trắng, kiểm từng giá trị; `shin_token` không bao giờ vào mã). Áp dụng có Hoàn tác 6s, hết giờ mới ghi rồi tải lại. Trình duyệt chặn clipboard ➜ hiện mã trong ô để tự chép.
- `sw.js`: PHIEN_BAN_SW shin-v2.9.4.

## [2.9.3] – 06/11/2026 (NHẮC CHĂM SÓC LEAD M2.4)

### ✨ Tính năng
- `js/modules/crm.js`: khối 🔔 Lead mới tính tuổi lead phía trình duyệt từ cột Luc (`webCRM` trả "dd/mm/yyyy HH:mm"; Demo đọc "N phút/giờ/ngày trước", "HH:MM hôm nay") – 🟢 < 24 giờ · 🟡 24–48 giờ · 🔴 > 48 giờ, viền màu từng dòng, đếm ⏰ trên tiêu đề, nút sao chép tin nhắc chăm sóc (🔴 trước) để dán Telegram / ⚡ Giao việc. Không gửi gì đi.
- `js/demo_data.js`: thêm 1 lead MẪU 3 ngày tuổi (không dữ liệu thật). `css/styles.css`: `.crm-lead-*`.

## [2.9.2] – 06/11/2026 (TRÍCH BÀI HỌC KINH NGHIỆM M9.4)

### ✨ Tính năng
- `js/modules/duan.js`: tab 🧱 Ma trận vướng mắc có thẻ 💡 Bài học kinh nghiệm – rút từ vướng mắc Flash Khối 2 có đề xuất (bỏ trùng, bỏ thẻ HTML), xếp 5 chủ đề (Nhân sự · Thiết bị & Hậu cần · Tài chính · Khách hàng & Hợp đồng · Tiến độ & Quy trình) theo từ khóa; nút sao chép Markdown có `[[Chủ đề]]` để dán vào kho 📚 Tri thức (đồ thị M9.3). Không gửi gì đi.

## [2.9.1] – 06/11/2026 (PHÂN LUỒNG VIỆC THEO QUYỀN M7.3)

### ✨ Tính năng
- `js/modules/congviec.js`: phân luồng việc theo RBAC phía trình duyệt – việc thuộc mảng người dùng không được vào (cùng luật ẩn menu `ShinApp.mangDuocHien` = chốt chặn quyền mã v1, kể cả mảng đang tắt) bị ẩn kèm dòng 🔒 đếm; chip 🧭 Theo quyền / 👤 Của tôi (khớp họ tên, mã NV hoặc gọi tắt "Sếp Tâm", "chị Thư" theo phần cuối họ tên, không dấu). Số đầu cột Kanban đếm theo luồng đang xem.
- `js/app.js`: xuất `ShinApp.mangDuocHien`.
- `css/styles.css`: `.cv-luong`, `.cv-an`.

## [2.9.0] – 05/11/2026 (RÀ UX TOÀN MÀN 375 / 1280)

### 🎨 Giao diện
- `css/styles.css`: `.chi-tiet-gon summary` 32 → 44px. Đo 16 màn + 18 tab con: 0 chữ < 14px, 0 vùng bấm < 44px, 0 cuộn ngang.

## [2.8.9] – 05/11/2026 (TƯỜNG LỬA KHONG_DUA_VAO M9.5)

### 🔒 Bảo mật
- `js/api.js`: `soatKhongDuaVao` (thuần), `MAU_CAM`, `CONG_GHI`; `goi` chặn cổng ghi có CCCD / BHYT / khóa / token trước khi gửi, lỗi `khongduavao` có câu Việt.

## [2.8.8] – 05/11/2026 (RÀ UX ĐÁNH GIÁ 5T)

### 🎨 Giao diện
- `js/modules/danhgia5t.js`: chữ nội tuyến ≥ 14px, nút phụ ≥ 44px, ô tick bọc `.chk-vung-5t`, màu theo biến (`color-mix` cho nhãn mức).
- `css/styles.css`: khối bù v2.8.8 cho bảng 5T, chip lọc, pill, ô ghi chú 16px, `.form-label`.
- `QUY_HOACH_10_MANG_AIOS.md`, `HOP_DONG_CONG_V2.md`: KPI `webNhap2027` đã lên app (v1.8.2 @9).

## [2.8.7] – 05/11/2026 (KHẢO SÁT – 5 TRỤ ACHSI THEO THÁNG)

### 🟢 Khảo sát
- `js/modules/khaosat.js`: `taiLive` gọi thêm `webTongHopKS` (KS L6, v1.4.4); `ghepTongHop` (thuần), `doiThang`, `giaTriThang`, `thangHienTai`; khối gập điểm theo khảo sát; bỏ `noiDung` (QK4).
- `css/styles.css`: `.ks-thang` (ô chọn tháng 16px, vùng bấm ≥ 44px, chỉ biến màu).
- `HOP_DONG_CONG_V2.md`: thêm `webTongHopKS`.

## [2.8.6] – 05/11/2026 (RÀ UX 375 – CHỮ ≥ 14PX)

### 🎨 Giao diện
- `css/styles.css`: `.page-sub`, `.hero-date`, `.dong-sub`, `.tq-nhan` lên 14px; khối bù cuối tệp cho `.kanban-header`, `.o-so-loc`, `.flash-*`, `.module-chip`, `#appContent .status-pill`.
- `js/modules/duan.js`, `js/modules/congviec.js`: cỡ chữ nội tuyến 10–13px ➜ 14px.

## [2.8.5] – 05/11/2026 (QUẢN TRỊ – MA TRẬN QUYỀN M0.2)

### ✅ Quản trị
- `js/modules/quantri.js`: tab 🔑 Ma trận, `maTranQuyen` (thuần, theo chốt chặn quyền của mã v1), `veQuyen`.
- `css/styles.css`: `.qt-quyen` (table-layout fixed, chữ ≥ 14px, chỉ biến màu), `.qt-chu-giai`.

## [2.8.4] – 05/11/2026 (CÔNG VIỆC – ĐÈN SLA M7.4)

### ✅ Công việc
- `js/modules/congviec.js`: `docHan`, `mucSla`, `tinCanhBao` (thuần), dải chip lọc SLA, nút sao chép cảnh báo; thẻ Kanban thoát HTML.
- `css/styles.css`: `.cv-*` – viền trái theo đèn, chữ ≥ 14px.

## [2.8.3] – 05/11/2026 (TRI THỨC – ĐỒ THỊ LIÊN KẾT M9.3)

### ✅ Tri thức
- `js/modules/trithuc.js`: `phanTichLienKet` (thuần: liên kết ra / ngược / treo, khớp mã hoặc tên không dấu, bỏ #mục, |nhãn, tự liên kết, trùng), `veSvg` (đồ thị vòng tròn, nút to theo bậc), khung chi tiết tài liệu với chip liên kết ≥ 44px.
- `js/demo_data.js`: tài liệu mẫu có `tomTat` chứa `[[…]]` + `lienKet`.
- `css/styles.css`: `.tt-dothi`, `.tt-xem`, `.tt-chips` (chỉ biến màu).

## [2.8.2] – 05/11/2026 (CRM – PIPELINE B2B M2.3)

### ✅ CRM
- `js/modules/crm.js`: khối 📈 Pipeline B2B 5 giai đoạn (suy từ Trạng thái), bấm để lọc; nút Bỏ lọc chung.
- `css/styles.css`: `.crm-pipe*` (lưới tự xuống dòng, ô ≥ 56px, chỉ dùng biến màu).

## [2.8.1] – 05/11/2026 (PK – NHÂN SỰ: HỒ SƠ + DUYỆT SỬA HỒ SƠ)

### 🟢 Phòng PTKH (PK)
- `js/modules/phongkham.js`: thẻ 👥 Nhân sự – mở hồ sơ từng người (`webHoSoNhanSu`), duyệt / không duyệt yêu cầu sửa hồ sơ (`webDuyetSuaHoSo`, không duyệt bắt buộc lý do). Lỗi cổng hiện ngay dưới dòng, không thay bằng số mẫu.
- `js/demo_data.js`: 1 yêu cầu sửa hồ sơ mẫu (dữ liệu giả).

## [2.8.0] – 05/11/2026 (QUẢN TRỊ – NGƯỜI DÙNG & APP GHI THẬT)

### 🟢 Quản trị (Tầng 0A)
- `js/modules/quantri.js`: ➕ Thêm người dùng, ✏️ Sửa vai trò / trạng thái qua `webLuuNguoiDung` (HUB L25); kiểm phía trình duyệt mã, họ tên, trùng mã, Admin cuối cùng. Nút Bật / Tắt app qua `webLuuUngDung` – Hoàn tác 6 giây, ghi đúng 1 lần.
- `js/demo_data.js`: thêm `ma` cho app mẫu để Demo bấm Bật / Tắt được.

## [2.7.9] – 05/11/2026 (CSP ẢNH MINH CHỨNG)

### 🛠 Sửa
- `index.html`: CSP `img-src` cho ảnh Drive (`drive.google.com`, `*.googleusercontent.com`) để màn Duyệt PK hiện ảnh minh chứng.

## [2.7.8] – 05/11/2026 (DỰ ÁN – MA TRẬN VƯỚNG MẮC M6.3)

### ✅ Dự án
- `js/modules/duan.js`: tab mới 🧱 Ma Trận Vướng Mắc (M6.3 Blocker Matrix) – chạy hoàn toàn phía trình duyệt trên dữ liệu màn đang có: gom Khối 2 Flash + dự án đèn đỏ / vàng + dự án quá hạn chưa 100%, xếp Cao → Vừa → Thấp (quá hạn lên đầu), hiện nguồn, người xử lý, hạn gỡ, đề xuất. Nút 📋 Sao chép để giao việc (Task Bus M7.1 chưa có máy chủ – không gửi gì đi).
- Live dùng lại dữ liệu `webDuAn` đã thoát HTML; Demo dùng `demo_data.js`.

## [2.7.7] – 05/11/2026 (PTKH GỐC – BÁO CÁO 14 NGÀY + LỊCH TỔ)

### 🟢 PTKH gốc
- `js/modules/ptkh.js`: thêm 📝 Báo cáo 14 ngày của tôi (`webLichSu`: ngày, ca, số chính, trạng thái duyệt, trễ hạn) và 📅 Lịch tổ tuần này (`webLichTo`: ca / vị trí của tôi theo ngày + ai nghỉ, không lý do) – đọc qua cổng `webGoi` (L148), gọi song song với Tổng quan tháng; lỗi khối nào báo dải đỏ ở khối đó, không thay bằng số mẫu.
- Demo: `SHIN_DEMO_DATA.ptkh.lichSu`, `.lichTo` (dữ liệu giả).

## [2.7.6] – 04/11/2026 (KPI – NHÁP AOP NĂM SAU)

### ⭐ Màn chỉnh nháp AOP năm sau
- `js/modules/kpi.js` › 🎯 AOP › 🗓 Nháp AOP năm sau: đọc `webNhap2027` (mục tiêu năm gốc → năm sau, % tăng trưởng, nguồn: đã chỉnh / theo thực đạt / mặc định); Admin nhập % (−50…200, trống = về mặc định) ➜ `webLuuTangTruong` rồi đọc lại.
- Cổng lỗi (KPI v1.8.2 chưa lên app) ➜ dải đỏ báo rõ + nút mở app KPI v1, không hiện số mẫu.
- Demo: `SHIN_DEMO_DATA.kpiPhu.nhap2027` (dữ liệu giả).

## [2.7.5] – 04/11/2026 (PTKH GỐC ĐỌC THẲNG TỔNG QUAN THÁNG)

### 🟢 PTKH gốc
- `js/modules/ptkh.js`: thêm khối 📊 Tổng quan tháng đọc thẳng app PTKH qua cổng `webGoi` (L148) ➜ `webDashboard('thang')`: báo cáo đúng hạn / trễ, việc đang làm / quá hạn / xong, chuỗi nộp đúng hạn, từng chỉ tiêu (thực hiện / kế hoạch, % đạt, dự báo cuối kỳ, màu đèn).
- `js/api.js`: `goiPTKH(link, ham, thamSo)` – địa chỉ lấy từ link PTKH Hub cấp, chỉ chấp nhận `script.google.com/macros/s/…/exec`; lỗi báo riêng ở khối này (không thay số mẫu).
- Demo: `SHIN_DEMO_DATA.ptkh.dash` (dữ liệu giả).

## [2.7.4] – 04/11/2026 (RÀ UX ĐO ĐƯỢC)

- `duan.js`: nút 36px ➜ 44px, chữ 10–12px ➜ 13–14px. Ghi lại phần 5T và chữ phụ 12–13px dùng chung để lượt sau.

---

## [2.7.3] – 04/11/2026 (M9.2 TÌM KIẾM TRI THỨC)

- `trithuc.js`: tìm kiếm toàn văn phía trình duyệt (không dấu, nhiều từ, lọc lĩnh vực, tô đậm); sửa chữ < 14px, nút < 44px, thêm esc.

---

## [2.7.2] – 04/11/2026 (KHẢO SÁT GỌI ĐÚNG CỔNG KS v1.4.3)

- `khaosat.js` bỏ `webTongQuan` (v1 không có) ➜ `webDsKhaoSat` + `webKetQuaKS` + xuất CSV `webXuatKS`; KS nhận du đối tượng.
- HOP_DONG_CONG_V2.md mục KS sửa theo mã thật.

---

## [2.7.1] – 04/11/2026 (TELEGRAM MINI APP)

### 📱 Mở Shin v2 ngay trong Telegram
- Đọc `Telegram.WebApp.initData` / `#tgWebAppData` ➜ cổng Hub `webTelegram` (HUB L8) ➜ token Hub 12 giờ, xóa hash khỏi thanh địa chỉ.
- Chống nhúng khung: chỉ cho phép `web.telegram.org`.
- Việc của anh (V20): đặt Menu Button của bot trỏ https://cmubeta2.github.io/shin-v2/.

---

## [2.7.0] – 04/11/2026 (PHÒNG PTKH NỐI THẬT APP PK v1.0.7)

### 🏥 Mảng 5 – Phòng PTKH chạy số thật
- `js/modules/phongkham.js` viết lại: 9 thẻ Hôm nay · Công việc · Báo cáo ngày + minh chứng ảnh · Lịch tuần · Thông báo · Duyệt · Nhân sự · Góp ý · Hồ sơ, mỗi thẻ gọi đúng cổng PK (`webHomNay`, `webCongViec`, `webCapNhatViec`, `webThemViecCaNhan`, `webBaoCao`, `webNopBaoCao`, `webChoDuyet`, `webDuyet`, `webLichTuan`, `webThongBao`, `webDaDocThongBao`, `webNhanSu`, `webGopYCuaToi`, `webGuiGopY`, `webHoSo`).
- Gọi PK bằng `SHIN_API.goi('PK', hanh, {…})` (PK nhận đối tượng, không phải `du.a`); sửa HOP_DONG_CONG_V2.md mục PK theo mã thật.
- Ảnh minh chứng nén JPEG ≤ 1600px, ≤ 6 ảnh; báo lỗi ảnh riêng (`loiAnh`) khi báo cáo đã ghi.
- Demo: dữ liệu giả `phongkhamV1` trong `js/demo_data.js`.

---

## [2.6.5] – 01/11/2026 (XUẤT BẢN QUY CHUẨN MASTER UX/UI v2.6.4 & HỆ PHÒNG NGỰ 12 LỖI VẶT)

### 📘 Chuẩn Hóa & Xuất Bản Master UX/UI Specification
- **Rà soát & Nâng cấp Toàn Diện THIET_KE_GIAO_DIEN_SHIN.md**:
  - Tích hợp 100% hiện trạng AIOS v2.6.4: Module đánh giá văn hóa 5T, biểu đồ Radar SVG 5 trục, in ấn phiếu A4, PWA offline, Content Security Policy, Script Anti-Flicker.
  - Đồng bộ chi tiết Topbar 56px tinh gọn (chỉ 1 nút ⚡ bên phải kèm badge đếm đỏ), Fixed Bottom Nav 64px 5 nút, Decagon Rail với mấu mép trái di động 66% (body.kieu-mep), 8 palettes màu, 4 chế độ hiển thị, 3 mức cỡ chữ --font-scale.
  - Chuẩn hóa động lực học chuyển động Animate UI Spring Physics (cubic-bezier(0.16, 1, 0.3, 1) và Asymmetric Exit nhanh 0.16s).
- **Quy Chuẩn Tấm Cài Đặt Bắt Buộc & Bật/Tắt Nav Bar (Theo Chỉ Đạo Của Sếp)**:
  - Bổ sung nguyên tắc bất biến: Mọi app dựng sau này **LUÔN PHẢI CÓ TẤM / TRANG CÀI ĐẶT**.
  - Tích hợp bộ cấu hình **Định dạng thanh mép trái di động**: 3 chế độ (Tự động · Hàng icon 56px · Mép trái 4px kèm mấu kéo » 66% chiều cao nhớ vị trí kéo).
  - Tích hợp công tắc **BẬT / TẮT THANH ĐIỀU HƯỚNG ĐÁY (Nav Bar)**: Khi tắt, thanh đáy ẩn hoàn toàn, container co padding đáy về 16px mang lại trải nghiệm xem toàn màn hình tối đa, lưu trạng thái vào localStorage (`shin_navbar`).
- **Hệ Thống Phòng Ngự Triệt Tiêu 12 Lỗi Vặt (Zero-Bug Defense Guide)**:
  - Cẩm nang đặc trị 12 lỗi hay gặp: Touch target < 44px, iOS Safari auto-zoom (input font < 16px), cuộn ngang layout overflow, xung đột Z-index 8 tầng, Bottom Nav che nội dung cuối, SafeArea iPhone, chớp trắng màn hình FOUC, bàn phím ảo che form, format số/ngày sai chuẩn VN, hộp confirm phiền toái, lag chuyển động và lỗ hổng XSS.
- **Đồng bộ hóa 3 điểm**: Cập nhật đồng bộ tại AIOS-v2/THIET_KE_GIAO_DIEN_SHIN.md, THIET_KE_GIAO_DIEN_SHIN.md (root) và He sinh thai Shin/THIET_KE_GIAO_DIEN_SHIN.md.

---

## [2.6.4] – 01/11/2026 (MODULE ĐÁNH GIÁ VĂN HÓA HÀNH VI 5T CHUẨN 83 TIÊU CHÍ BỘ Y TẾ)

### ⭐ Mới: Module Đánh Giá Văn Hóa Hành Vi 5T Bậc Thang
- **Chuẩn hóa 5 Tiêu chí cốt lõi (76 Tiểu mục):**
  - **T1 – TRUNG THỰC (Integrity):** 15 tiểu mục về chuẩn xác dữ liệu, dũng cảm nhận lỗi, minh bạch liêm chính.
  - **T2 – TRÁCH NHIỆM (Responsibility):** 15 tiểu mục về cam kết tiến độ, giải quyết đến cùng việc, tư duy làm chủ.
  - **T3 – THẤU CẢM (Empathy):** 15 tiểu mục về lắng nghe nỗi đau, kiểm soát cảm xúc, ứng xử tôn trọng.
  - **T4 – TẬN TÂM (Dedication):** 16 tiểu mục về chu đáo tỉ mỉ, dấn thân vượt khó, tương trợ đồng đội.
  - **T5 – TRI ÂN (Gratitude):** 15 tiểu mục về biết ơn khách hàng/đồng nghiệp, giữ gìn uy tín, phụng sự.
- **2 Phân Hệ Lớn Trọng Tâm:**
  1. **Thư Viện Tiêu Chí & Minh Chứng (Handbook):** Tra cứu toàn văn 76 tiểu mục kèm bộ lọc đa chiều (theo Trụ cột 5T, theo Mức M1-M5) và tìm kiếm từ khóa thời gian thực.
  2. **Bàn Làm Việc Thực Hiện Đánh Giá & Thẩm Định:** Giao diện chấm điểm đối soát kép (Nhân viên tự chấm + Quản lý duyệt), hỗ trợ nạp mẫu kịch bản nhanh (Mức 2, Mức 3, Mức 4, Mức 5) và lưu trữ cục bộ LocalStorage.
- **Thuật Toán Bậc Thang Lũy Tiến & Bắt Điểm Liệt Mức 1:**
  - Áp dụng nguyên tắc tích lũy khắt khe chuẩn Bộ Y tế: để đạt Mức $N$ phải đạt 100% các mức trước đó.
  - Bắt lỗi điểm liệt: vi phạm bất kỳ tiểu mục nào thuộc Mức 1 sẽ lập tức khóa tiêu chí ở Mức 1 và kích hoạt cảnh báo kỷ luật.
- **Biểu Đồ Radar SVG 5 Trục (Spider Chart):**
  - Trực quan hóa mức độ trưởng thành văn hóa trên 5 đỉnh đối xứng, hiển thị vùng diện tích điểm đạt để nhận diện ngay "vùng móp" năng lực.
- **Phiếu Tổng Hợp A4 & Trang Độc Lập:**
  - Hỗ trợ xuất / in ấn phiếu thẩm định kết quả A4 chuẩn chỉnh có nơi ký 3 bên (Nhân viên, Quản lý, Ban Lãnh đạo).
  - Xuất bản trang web độc lập `danhgia5t.html` và tích hợp sâu vào Decagon Drawer của `index.html`.
- **Tích Hợp Kho Tri Thức (Second Brain):**
  - Đồng bộ tự động vào Obsidian Second Brain tại `Wiki/References/bo-tieu-chi-danh-gia-van-hoa-hanh-vi-5t.md` và `He sinh thai Shin/05_TriThuc/01_KienThuc_Nen/BO_TIEU_CHI_DANH_GIA_5T.md`.

## [2.6.3] – 01/11/2026 (CHUẨN BỊ CHUYỂN v2 VỀ D:\Shin\AIOS-v2)

### 🔧 Sửa
- `git_shin.bat` bỏ đường dẫn cố định tới thư mục git cũ trên Google Drive; giờ chạy git ngay trong thư mục chứa tệp, nên dùng được ở bất kỳ chỗ nào anh `git clone` về (vd `D:\Shin\AIOS-v2`).
- Từ bản này chỉ còn nhánh `main`, không dùng nhánh làm việc riêng.

## [2.6.2] – 31/10/2026 (KHÓA AN TOÀN KHO CÔNG KHAI)

### 🔒 Bảo mật
- Thư mục mã v1 `He sinh thai Shin` giờ nằm chung thư mục SHIN, nên `dong_bo.bat` (`git add -A`) có thể đẩy cả mã v1 lên GitHub công khai. Đã chặn bằng 2 lớp:
  - `.gitignore` chuyển sang **danh sách trắng**: bỏ qua mọi thứ, chỉ cho phép tệp giao diện v2. Luôn chặn thêm `.clasp.json`, `.env`, `appsscript.json` và `*.gs`.
  - `dong_bo.bat` kiểm lại trước khi đẩy. Nếu có tệp v1 hoặc bí mật thì DỪNG, huỷ chuẩn bị, không đẩy gì.

## [2.6.1] – 31/10/2026 (TÀI LIỆU THIẾT KẾ GIAO DIỆN)

### 📘 Mới
- `THIET_KE_GIAO_DIEN_SHIN.md`: toàn bộ giao diện Shin gói trong 1 file để dựng trang khác giống y hệt. Gồm:
  - nguyên tắc;
  - 8 palette sáng/tối và màu ngữ nghĩa;
  - cỡ chữ, khung trang, rail, bảng các thành phần;
  - bộ HTML + CSS + JS chép dùng ngay;
  - danh sách kiểm trước khi giao.

### 🐛 Sửa
- Tab ở 🛡️ Người dùng & App không tô màu tab đang chọn (sai tên class).
- Khai báo `--bg-sub` (thanh tiến độ, nhật ký, ô trạng thái token trước đây không có nền).

---

## [2.6.0] – 31/10/2026 (NGƯỜI DÙNG & APP · NỐI PTKH GỐC)

### ✨ Mới
- **🛡️ Người dùng & App** (chỉ Admin Hub, dữ liệu thật qua cổng Hub có sẵn `webCaiDat`):
  - 👤 Danh bạ hệ Shin: tìm, vai trò, trạng thái, mảng phụ trách; **🔗 Cấp link vào Hub** cho từng người (`webCapLink`) – link không hiện chữ, chỉ Chép / Gửi, tự quên sau 2 phút.
  - 📱 Ứng dụng: bật/tắt, lỗi kéo số gần nhất, bot Telegram.
  - 🧭 Phụ trách: giao 1–2 người cho mỗi mảng (`webLuuPhuTrach`), Hoàn tác 6 giây.
  - Không phải Admin ➜ mảng ẩn khỏi menu. Thêm / sửa / ngưng người, bật/tắt app ➜ chờ cổng Hub (HOP_DONG_CONG_V2.md mục v2.6), tạm mở Hub v1.
- **📋 PTKH Gốc**: thẻ số + việc PTKH lấy từ Hub (`webHomNay`), nút mở thẳng app PTKH bằng token Hub (PTKH nhận token Hub từ L36a). Link PTKH tách riêng khỏi PK.

### 🐛 Sửa
- Kiểm token đúng khuôn Hub thật `h1.<mã>.<hạn hệ 36>.<chữ ký>` (theo Lõi Loi_Token.gs). Dán **link riêng của app PTKH** (token 40 ký tự) ➜ báo rõ "đây là link PTKH, không phải link Hub" thay vì để Hub từ chối rồi đăng xuất.

---

## [2.5.6] – 30/10/2026 (SỬA LỖI DÁN TOKEN BÁO SAI)

### 🐛 Sửa lỗi
- v2.5.5 kiểm khuôn token quá chặt (đòi dạng `h1.…`), trong khi token Hub thật là chuỗi chữ số liền (vd 40 ký tự) ➜ dán token thật bị báo "không đúng dạng". Nay chỉ chặn thứ chắc chắn không phải token (link không có `?t=`, có khoảng trắng, quá ngắn); token đúng hay sai do **Hub xét** – Hub từ chối thì app tự đăng xuất và báo.
- Dán link đăng nhập Hub vẫn tự tách `?t=`; tự bỏ dấu nháy thừa khi chép.
- Dòng trạng thái lấy mã người dùng từ Hub (không đọc từ token).

---

## [2.5.5] – 30/10/2026 (RÀ SOÁT BẢO MẬT TOKEN · ĐIỆN THOẠI MẶC ĐỊNH MÉP TRÁI)

### 🔒 Bảo mật
- **Token không bao giờ hiện lại trên màn:** ô nhập dạng mật khẩu, mở Cài đặt không điền lại token, lưu xong xóa ngay khỏi ô; chỉ hiện trạng thái "🟢 Đã kết nối: <tên> · mã <mã> · token ••••".
- Dán được nguyên **link đăng nhập Hub** (tự tách `?t=`); dán sai dạng ➜ báo, không ghi đè token đang dùng.
- Nút **Đăng xuất** (bấm 2 lần) xóa token khỏi máy. Hub từ chối token (sai / hết hạn / thu hồi) ➜ tự đăng xuất.
- **Chính sách nội dung (CSP):** trang chỉ được gọi mạng tới máy chủ v1 (Apps Script) – nếu có mã lạ chèn vào trang cũng không gửi token ra ngoài được; chặn plugin, `<base>`, form gửi ra ngoài.
- `no-referrer`: mở link sang nơi khác không để lộ địa chỉ trang. Chống nhúng trang vào khung của web lạ (clickjacking).
- Service worker **không lưu đệm địa chỉ có `?t=`**, xóa bộ đệm cũ khi cập nhật.

### 📱 Điện thoại mặc định thanh trái kiểu **Mép trái** (vẫn đổi được trong ⚙️ Cài đặt).

---

## [2.5.4] – 30/10/2026 (BỚT THÔNG BÁO THỪA)

Rà toàn app, nguyên tắc: **chỉ báo khi người dùng không tự thấy kết quả trên màn.**
- **Bỏ:** mọi thông báo khi chỉnh cài đặt (chế độ sáng/tối, bảng màu, kiểu thanh trái, bật/tắt mảng, lưu token) · "Đã hoàn tác" · "Máy chủ đang xử lý" sau 5 giây (nút đã hiện ⏳ + thanh chạy) · đọc lại / làm mới số · thêm, xóa việc riêng · ghi nhật ký lead · lưu chiến dịch, đối tác · gửi lệnh Chờ anh, giao việc, duyệt kế hoạch, phê duyệt (thẻ đã đổi trạng thái) · tạo nháp báo cáo quý (thẻ hiện link) · thông báo cài app (trình duyệt tự báo).
- **Giữ:** lỗi · nhắc ô thiếu / sai · Hoàn tác 6 giây · bấm 2 lần cho việc khó hoàn tác · mạng yếu sau 20 giây · cảnh báo SĐT trùng chiến dịch khác · việc gửi đi mà màn không đổi (lệnh theo dòng, xin lên app, tiếp nhận lead, chuyển lead, chép chiến dịch) · hướng dẫn cài app.

---

## [2.5.3] – 30/10/2026 (CHỌN KIỂU THANH TRÁI TRÊN ĐIỆN THOẠI · MẤU KÉO ĐƯỢC)

- ⚙️ Cài đặt ➜ **Thanh danh mục trên điện thoại**: Tự động (≤ 360px dùng mép trái, máy lớn hơn dùng hàng icon) · Hàng icon · **Mép trái** (rộng nội dung nhất – điện thoại 414px được thêm 52px bề ngang). Chỉ áp dụng điện thoại (< 768px); máy tính bảng, desktop giữ hàng icon / thanh mở sẵn.
- Mấu » **giữ và kéo lên / xuống** để đặt chỗ, nhớ trên máy; mặc định ở **1/3 dưới bên trái** – vừa ngón cái trái. Kéo không mở nhầm thanh; chạm mới mở.

---

## [2.5.2] – 30/10/2026 (ĐIỆN THOẠI ĐỜI CŨ, MÀN NHỎ)

- **≤ 360px** (iPhone SE đời đầu, Android 5 inch): thanh trái thu thành **tay nắm** – dải màu 4px mép trái + mấu » giữa màn (vùng chạm 44px). Chạm » hoặc **vuốt từ mép trái** để mở; vuốt sang trái hoặc chọn mảng thì thu. Có việc chờ ➜ chấm đỏ trên mấu. Lần đầu: mấu nhấp nháy + gợi ý (1 lần / máy).
- **361–399px**: hàng icon gọn 48px. **≤ 340px**: thanh đáy chỉ icon. **Màn thấp ≤ 640px**: thanh đáy 52px. Màn nhỏ: cụm 3 số hero gọn lại.
- Đang gõ form trên điện thoại: ẩn thanh đáy cho bàn phím có chỗ.
- **Góc dưới trái**: thanh đáy tràn hết bề ngang (cùng nền), nút vẫn căn giữa vùng nội dung – hết khoảng trống lệch màu giữa thanh trái và thanh đáy.

---

## [2.5.1] – 30/10/2026 (CÀI NHƯ ỨNG DỤNG Ở MỌI NỀN TẢNG – PWA)

- `manifest.webmanifest`: tên SHIN, bộ icon 192/512 + icon maskable (Android), `apple-touch-icon` (iPhone/iPad), favicon; mở toàn màn hình (standalone); lối tắt giữ-icon: Hôm nay · Điều hành · Phê duyệt · Tuyển sinh (`?m=<mảng>`).
- `sw.js`: mạng trước – bản mới lên web là app có ngay; rớt mạng vẫn mở được vỏ app. Không lưu đệm số liệu máy chủ v1 (luôn lấy thật).
- Nút 📲 ở chân thanh trái + khối "Cài SHIN như ứng dụng" trong ⚙️ Cài đặt: Chrome / Edge / Samsung (Android, Windows, macOS, Linux, ChromeOS) bấm là cài; iPhone / iPad, Safari Mac, Firefox hiện hướng dẫn cài tay đúng máy. Đã cài thì tự ẩn.
- Header chừa tai thỏ / thanh trạng thái iPhone khi chạy dạng app.
- Quy tắc: mọi bản đẩy web từ nay mặc định có PWA (UPDATE.md mục 3).

---

## [2.5.0] – 30/10/2026 (GOM ĐỢT v2.3 → v2.5 · THANH MENU TRÁI)

### 🧭 v2.3.0 – Dùng nốt các cổng v1 đã có (không sửa v1)
- **Điều hành hệ Shin** (chỉ Admin Hub) – mảng mới trong menu, nút "🧭 Mở Bàn Điều Hành" trên Hôm nay mở thẳng trong v2 (`webDieuHanh`, `webHopThu`):
  ① Chờ anh (Đã làm / Bỏ qua / lựa chọn / Duyệt dòng có **Hoàn tác 6 giây**; Để sau chọn ngày; Trả lời / Hỏi lại; hoàn tác phía máy trong 10 phút) ·
  ⚡ Giao việc cho Shin · ⑤ Duyệt kế hoạch (theo mặc định / chọn khác từng câu) · Dòng việc các app (ô số lọc, phiếu từng dòng, Lên đầu / Hạ / Tạm dừng / Góp ý, xin đưa lên app) · Tác vụ tự động · Hoạt động gần đây.
- **KPI**: thêm 3 thẻ cho BKS / Admin – 🔎 Soát lỗi chốt quý (`webSoatLoi`, chọn quý), 🎯 Phân bổ AOP (`webAOP`), 📄 Nháp báo cáo quý ra Google Docs (`webBaoCaoQuy`, tạo lại phải bấm 2 lần).
- **Tuyển sinh**: tiếp nhận / sửa lead ngay trong v2 (ô bắt buộc + "＋ Thêm chi tiết", kiểm SĐT như v1, Loss cần lý do) · nhật ký · chuyển chiến dịch · xóa lead có Hoàn tác 6 giây · Admin sửa chiến dịch + bậc hoa hồng, tạo mới, chép chiến dịch.

### 🔌 v2.4.0 – Màn chờ cổng mới của KS, PK (v2 xong, v1 mở cổng theo `HOP_DONG_CONG_V2.md`)
- Khảo sát (`webTongQuan`) và Phòng PTKH (`webHomNay`) đã dựng màn theo hợp đồng cổng. Máy chủ chưa mở ➜ dải vàng "chưa mở cổng" + số MẪU; mở rồi ➜ tự hiện số thật.

### ⚡ v2.5.0 – Dịch vụ chung & mảng mới (chờ Hub mở cổng)
- Phê duyệt 1-chạm (`webPheDuyet`, `webDuyet`): Duyệt có Hoàn tác 6s, Cần sửa / Từ chối phải ghi ý kiến, từ chối bấm 2 lần; huy hiệu ⚡ lấy số thật khi cổng mở.
- CRM (`webCRM`, `webLuuDoiTac`): lọc theo loại, tìm nhanh, thêm / sửa đối tác. Dự án (`webDuAn`) Daily Flash 4 khối – việc chờ duyệt chuyển sang 0B. **Mảng mới 💰 Tài chính** (`webTaiChinh`).
- Mọi chữ từ máy chủ đều được thoát HTML (bỏ các chỗ chèn thô ở CRM, Phê duyệt, Khảo sát, Phòng khám, Dự án).

### 🧱 Thanh menu trái (Sếp 30/10)
- Mọi màn luôn có hàng icon nhỏ bên trái (chỉ icon). Bấm ☰ mới bung ra có tên; điện thoại chọn mảng xong tự thu.
- Desktop: mặc định bung, không che header / nội dung / thanh đáy (nội dung tự lùi), nhớ lựa chọn thu / bung trên máy.
- Nội dung chính và thanh đáy có bề rộng tối đa (760px điện thoại – máy tính bảng, 960px desktop), căn giữa phần còn lại.
- Nút ☰ chuyển từ header xuống đầu thanh trái thành nút » / « (thu gọn – mở rộng, chỉ icon); ⚙️ Cài đặt (giao diện, token) nằm ở chân thanh trái; Quản Trị Module đổi icon 🧩 cho khỏi trùng.
- Thanh đáy: ô thứ 5 thay Cài đặt bằng 🧭 Điều hành (Admin) hoặc 📊 KPI (người khác).

---

## [2.2.0] – 29/10/2026 (NỐI THẬT VÀO HỆ v1 – ĐỢT P1: HUB · KPI · TUYỂN SINH)

> v2 là **cửa thứ 3** của hệ Shin v1: gọi thẳng các máy chủ Apps Script v1, dùng chung 100% dữ liệu, **không sửa gì ở v1**.

### 🔌 Tầng giao tiếp theo đúng giao thức v1 (`00_Loi/Loi_Web.gs`)
- `{hanh:'web…', token, du}` ➜ `{ok, du}` / `{ok:false, loi:'quyen'|'hanh'|'token'|'loi'}`; Hub nhận `du` là đối tượng, KPI/TS/KS/PK nhận tham số rời trong `du.a` (`SHIN_API.goiCong`).
- Lỗi được nói bằng lời dễ hiểu; **không còn lặng lẽ thay số thật bằng số mẫu** – khi phải hiện mẫu thì có dải báo vàng/đỏ ở đầu màn.
- Đo độ trễ từng máy chủ (M0.4) – xem ở ⚙️ Quản Trị Module, có nút "Kiểm tra kết nối 5 máy chủ".
- Token ở `?t=` được lưu rồi **xóa khỏi thanh địa chỉ** (Q4 đã chốt).

### 🏠 Hub (máy chủ `10_Hub`)
- Hôm nay: `webHomNay` – lời chào theo giờ + tên, 3 số (việc · khẩn cấp · quá hạn), danh sách việc gom từ mọi app (bấm mở đúng app v1), "Cần chú ý", thẻ số từng app, app chưa kéo được số. Nút **↻ Làm mới** gọi `webLamMoi`.
- 🔔 Thông báo: `webThongBao`, bấm tin / "✓ Đánh dấu đã xem hết" gọi `webDanhDauDoc`; số chưa đọc hiện ở nút 🏠 menu đáy.
- 📝 Việc riêng: `webViecRieng` + `webLuuViecRieng` – thêm (ô ngày dd/mm/yyyy, Khẩn cấp), **xong có Hoàn tác 6 giây thật** (chỉ gửi máy chủ khi hết 6 giây), xóa phải bấm 2 lần trong 5 giây.
- Phân quyền: hỏi `webKhoiDong` của Hub rồi của KPI/TS/KS/PK – app nào trả `quyen` thì **ẩn khỏi menu ☰**, mở thẳng thì gặp màn "Chưa vào được" ghi rõ liên hệ ai.

### 📊 KPI Toàn Viện (máy chủ `30_KPI_ToanVien`)
- Bản tin tạm tính thật `webBanTin`: KPI viện, số khoa cần chú ý, doanh thu so KH lũy kế; danh sách khoa có màu ≥90% xanh · ≥80% vàng · <80% đỏ, bấm khoa xem chỉ tiêu sắp trượt; 5 trụ; AOP lũy kế / dự báo / cần thêm mỗi tháng; lệch số với tab khoa. Nút **↻ Đọc lại số TV3** (`webBanTin(true)`).
- Soát lỗi chốt quý · AOP · Báo cáo quý: mở trên app KPI v1 (v2 chưa dựng màn).

### 🎓 Tuyển Sinh (máy chủ `60_TuyenSinh`)
- Chiến dịch thật từ `webKhoiDong` (giai đoạn, còn bao nhiêu ngày, số lead); bấm chiến dịch ➜ `webLeadCD`: phễu lead → liên hệ → hồ sơ → nhập học, hoa hồng hiện tại + còn bao nhiêu lên bậc, 50 lead đầu (quá hạn nổi bật, 📞 gọi nhanh).
- Thêm/sửa lead: mở app Tuyển sinh v1.

### 🩺 KS · 🏥 PK
- Kiểm quyền thật qua `webKhoiDong`; hai app v1 **chưa mở cổng số liệu**, nên màn v2 vẫn là mẫu và ghi rõ điều đó, kèm nút "Mở app v1".

### 🧩 Chuẩn PHONG_CACH_APP_SHIN áp vào phần mới
- Dữ liệu máy chủ luôn được làm sạch trước khi vẽ (đã thử tên lead chứa mã độc – không chạy).
- Nút gửi khóa + "Đang lưu…", chặn bấm trùng, thanh chờ 3px trên đỉnh, báo "máy chủ đang xử lý" sau 5 giây / "mạng yếu" sau 20 giây.
- Toast theo loại (xanh/lam/vàng/đỏ), nút Hoàn tác 44px; khối phụ gập sẵn và nhớ mở/gập; trạng thái trống có gợi ý; 🎉 khi hết việc; số kiểu VN.
- M0.1 bật/tắt mảng có tác dụng thật (ẩn khỏi menu ☰, lưu trên máy). Phê duyệt 1-chạm (mẫu) dùng Hoàn tác 6 giây, Từ chối bấm 2 lần.

### ✅ Kiểm tra
- Trình diễn: 11/11 mục menu đúng màn, không cuộn ngang ở 375px và 1280px, 0 lỗi console.
- Live: chạy với máy chủ giả trả **đúng khuôn dữ liệu của mã v1** (Hub, KPI, TS trả số; KS từ chối quyền; PK mất mạng) – mọi màn hiển thị đúng, Hoàn tác không gửi lệnh, xong thật gửi đúng 1 lệnh. **Chưa thử với máy chủ thật** (cần token của anh).

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
