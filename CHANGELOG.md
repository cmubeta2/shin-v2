# NHẬT KÝ THAY ĐỔI (CHANGELOG) – SHIN v2

Tất cả các thay đổi kiến trúc, tính năng và bản phát hành của SHIN v2 được lưu trữ tuần tự tại đây theo chuẩn Keep a Changelog.

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
