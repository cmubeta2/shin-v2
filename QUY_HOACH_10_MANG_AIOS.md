# BẢN QUY HOẠCH TOÀN DIỆN 10 MẢNG CHIẾN LƯỢC – HỆ SINH THÁI SHIN AIOS v2

*Phiên bản quy hoạch: **2.1** · Cập nhật: **29/10/2026** · Áp dụng cho kho `shin-v2` từ bản **v2.2.0**.*
*Nguồn đối chiếu: mã v1 trong `He sinh thai Shin` (Drive), tài liệu AGY (`KE_HOACH_SHIN_V2.md`, `PHAN_BIEN_CAU_TRUC_MODULE.md`), chuẩn giao diện `PHONG_CACH_APP_SHIN.md`.*
*Thay thế bản quy hoạch 1.0 (commit `a42b247`). Danh mục di sản v1 vẫn tra cứu tại `DANH_MUC_MODULE_FRACTAL.md`.*

> **v2 CHẠY TRÊN v1 (Sếp chốt 29/10):** v2 là bản làm lại, gom các app v1 về 1 web. Mọi số liệu đi qua cổng `web*` của 5 máy chủ v1 (Hub, KPI, TS, KS, PK); v1 giữ nguyên. Tính năng nào v1 chưa có cổng thì mở cổng ở v1 trước, v2 dựng màn sau.
>
> **TẦM NHÌN (CHỈ ĐẠO CỦA SẾP HUỲNH TRƯỜNG THANH TÂM):**
> Hệ sinh thái SHIN là **1 web duy nhất** gồm **10 Mảng Chiến Lược (Thập Diện Kiến Trúc – Decagon)** ghép theo kiểu Lego:
> mỗi Mảng là 1 Macro-Module, mỗi tính năng là 1 Micro-Module; chỉ cần khớp hợp đồng **Đầu vào / Đầu ra** là tách, thay, ghép được ở bất kỳ đâu.

---

## 0. VÌ SAO CẦN BẢN 2.0 – CÁC ĐIỂM ĐÃ ĐƯỢC CHỐT LẠI

Bản 1.0 và mã nguồn v2.1.0 dùng **hai cách đánh số mảng khác nhau**, khiến tài liệu, menu và màn hình Quản trị Module không khớp nhau. Bản 2.0 lấy **cách đánh số trong mã nguồn v2.1.0 (đã lên GitHub Pages)** làm chuẩn duy nhất và quy đổi toàn bộ nội dung bản 1.0 sang.

| Bản 1.0 (cũ) | ➜ | Bản 2.0 (chuẩn từ nay) | Ghi chú |
|---|---|---|---|
| Mảng 0 – Quản lý Module | ➜ | **Tầng 0A – Quản trị Nền tảng & Phân quyền** | Giữ nguyên M0.1–M0.4 |
| M1.2 – Phê duyệt 1-chạm (trong Mảng 1) | ➜ | **Tầng 0B – Trung tâm Phê duyệt 1-chạm** | Nâng thành dịch vụ dùng chung cho mọi mảng |
| Mảng 1 – Điều hành | ➜ | **Mảng 1 – Điều hành, KPI & Khảo sát** | Gom thêm KPI Toàn Viện và Khảo sát ACHSI |
| Mảng 2 – Tư vấn Quản trị số | ➜ | **Tầng 3 – Gói giải pháp Tư vấn số** | Là "sản phẩm đóng gói" từ các mảng, không phải mảng vận hành |
| *(chưa có)* | ➜ | **Mảng 2 – Khách hàng & Đối tác (CRM)** | Mảng mới; KHÔNG lưu bệnh nhân |
| *(rải rác: M3.5, M5.3, M8.5)* | ➜ | **Mảng 3 – Tài chính & Thanh toán** | Mảng mới; gom VietQR, chi phí, hoa hồng |
| Mảng 3 – Giáo dục & Tuyển sinh | ➜ | **Mảng 4 – Giáo dục & Tuyển sinh** | |
| Mảng 4 – Nhân sự Khoa/Phòng | ➜ | **Mảng 5 – Nhân sự & Vận hành Phòng khám** | Gộp với Phòng khám PK/PTKH |
| Mảng 5 – Quản lý Dự án | ➜ | **Mảng 6 – Quản lý Dự án** | |
| Mảng 6 – Công việc liên thông | ➜ | **Mảng 7 – Công việc (Task Bus)** | |
| Mảng 7 Marketing + Mảng 8 Web & Phễu | ➜ | **Mảng 8 – Tăng trưởng (Marketing AI & Web Phễu)** | Gộp 2 mảng cùng phục vụ thu hút khách |
| Mảng 9 – Tri thức | ➜ | **Mảng 9 – Tri thức (Second Brain)** | |

**Mã module chuẩn** (dùng thống nhất trong menu, `ModuleX.ma`, dữ liệu mẫu, tài liệu):
`caidat` · `pheduyet` · `hub` · `kpi` · `khaosat` · `crm` · `taichinh` · `tuyensinh` · `phongkham` · `duan` · `congviec` · `tangtruong` · `trithuc`.
Các mã ngắn `KS`, `TS`, `PK`, `HUB`, `KPI` chỉ còn là **khóa máy chủ Apps Script** trong `js/api.js`.

---

## 1. KIẾN TRÚC 3 TẦNG

```
 TẦNG 3 ─ GÓI GIẢI PHÁP TƯ VẤN SỐ (đóng gói bán ra ngoài)
          G1 Chẩn đoán quy trình · G2 Chuẩn hóa SOP · G3 Offer Stack · G4 Lộ trình CĐS
                 ▲ lắp ráp từ các mảng bên dưới (CRM + Dự án + Tri thức + Tăng trưởng)
 ─────────────────────────────────────────────────────────────────────────────────────
 TẦNG 2 ─ 9 MẢNG NGHIỆP VỤ (Macro-Modules)
   1 Điều hành  2 CRM  3 Tài chính  4 Tuyển sinh  5 Nhân sự & PK
   6 Dự án      7 Công việc        8 Tăng trưởng  9 Tri thức
 ─────────────────────────────────────────────────────────────────────────────────────
 TẦNG 1 ─ NỀN TẢNG & DỊCH VỤ DÙNG CHUNG (mảng nào cũng gọi được)
   0A Quản trị (Bật/tắt · RBAC · Token HMAC · Giám sát)
   0B Phê duyệt 1-chạm   ·   Task Bus (M7.1)   ·   Thông báo Telegram (M1.4)
   SHIN_API (POST text/plain → /exec)  ·  Hệ thiết kế PHONG_CACH_APP_SHIN (8 bộ màu)
```

**3 luồng liên thông xương sống:**

```
 (A) LUỒNG LEAD     Web Phễu M8.3 ──► Tuyển sinh → Mảng 4
                                   ├─► Tư vấn / KSK DN → Mảng 2 CRM
                                   └─► Đặt lịch khám → Mảng 5 (máy chủ PK; KHÔNG qua CRM)

 (B) LUỒNG DUYỆT    Báo cáo ca (5) · Chi phí DA (6) · Đổi ca (5) · Bài đăng (8) · Chi trả (3)
                         └──────────────► 0B Phê duyệt 1-chạm ──► ghi Log_Duyet + trả kết quả về mảng gốc

 (C) LUỒNG VIỆC     Sự kiện bất thường (KS ≤2★, KPI trượt, vướng mắc DA, lead quá hạn)
                         └──────────────► M7.1 Task Bus ──► Kanban M7.2 ──► SLA M7.4 ──► Telegram M1.4
```

---

## 2. DANH MỤC 10 MẢNG & MICRO-MODULES

**Ký hiệu trạng thái (đánh giá trên mã nguồn v2.2.0):**
🟢 **chạy số thật** qua cổng v1 · ✅ có giao diện + dữ liệu mẫu · 🟡 có giao diện, thao tác mở app v1 hoặc chỉ là mẫu · ⬜ chưa làm.
> Theo đính chính của AGY: Phê duyệt 1-chạm, Daily Flash, Task Bus, CRM, Tài chính, radar KS, LMS **chưa có mã máy chủ** – trên v2 chỉ là màn mẫu.

### ⚙️ TẦNG 0A – QUẢN TRỊ NỀN TẢNG & PHÂN QUYỀN · `caidat` · bộ màu Cyber Terminal
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M0.1 | Bật/Tắt Module (Feature Flags) – ẩn mảng khỏi menu khi tắt | ✅ lưu trên máy (chưa đồng bộ theo người) | v2.6.0 đồng bộ |
| M0.2 | Ma trận RBAC: Vai trò × Khoa/Phòng × Module | ⬜ | v2.5.0 |
| M0.3 | Cổng cấp Token SSO `h1.<ma>.0.<chuKy>` (dùng lại M-HUB-05 của v1) | 🟢 dùng token Hub, ẩn mảng không có quyền / 🟡 cấp token (`webCapLink`) | v2.3.0 |
| M0.4 | Giám sát tải & sức khỏe 5 máy chủ /exec (latency, lỗi, fallback) | 🟢 độ trễ + lỗi từng máy chủ | – |

### ⚡ TẦNG 0B – TRUNG TÂM PHÊ DUYỆT 1-CHẠM · `pheduyet` · Executive Hub
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M0B.1 | Hộp thư duyệt gom đa nguồn (PK, DA, NS, MKT, TC) | ✅ | – |
| M0B.2 | Duyệt / Yêu cầu sửa / Từ chối + Hoàn tác 6s | 🟡 Hoàn tác 6s có, chưa có máy chủ | v2.5.0 (ghi `Log_Duyet`) |
| M0B.3 | Duyệt tất cả theo bộ lọc | 🟡 | v2.5.0 |
| M0B.4 | Badge ⚡ đếm phiếu chờ theo dữ liệu thật | 🟡 ẩn khi Live (chưa có nguồn) | v2.5.0 |

### 🏢 MẢNG 1 – ĐIỀU HÀNH, KPI & KHẢO SÁT · `hub` `kpi` `khaosat`
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M1.1 | Bàn làm việc Hero Card 3 số + Việc hôm nay (`webHomNay`, `webLamMoi`) + 🔔 (`webThongBao`) + 📝 Việc riêng (`webViecRieng`) | 🟢 | – |
| M1.2 | Bàn điều hành 2 chiều 🧭 (`webDieuHanh`, `webHopThu`) | 🟡 mở Hub v1 | v2.3.0 |
| M1.3 | KPI Toàn Viện: bản tin tạm tính (`webBanTin`) · soát lỗi (`webSoatLoi`) · AOP (`webAOP`) · báo cáo quý | 🟢 bản tin / 🟡 còn lại mở app v1 | v2.3.0 |
| M1.4 | Trung tâm Telegram Bot (sự kiện `muc:'gap'`) | ⬜ (chạy phía Apps Script v1) | v2.4.0 |
| M1.5 | Khảo sát ACHSI 5 trụ cột + radar cảnh báo ≤ 2★ trong 15 phút | ✅ mẫu / 🟢 kiểm quyền | v2.4.0 (v1 mở cổng trước) |
| M1.6 | Động cơ tự động hóa AI 4 ca 24/7 (lịch _TacVu) – chỉ hiển thị nhật ký | ⬜ | v2.4.0 |

### 👥 MẢNG 2 – KHÁCH HÀNG & ĐỐI TÁC (CRM) · `crm`
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M2.1 | Danh bạ hợp nhất: KSK Doanh nghiệp, Nhà cung ứng, Học viên, CTV | ✅ | – |
| M2.2 | Hộp lead mới đổ về từ Web Phễu (M8.3) | ✅ mẫu / 🟡 tiếp nhận | v2.3.0 |
| M2.3 | Pipeline B2B: Tiếp cận → Báo giá → Hợp đồng → Triển khai → Tái ký | ⬜ | v2.3.0 |
| M2.4 | Lịch sử tương tác & nhắc chăm sóc (đẩy việc sang Task Bus) | ⬜ | v2.3.0 |

> **Ràng buộc bất biến:** CRM **không lưu bệnh nhân** (tuân thủ `KHONG_DUA_VAO.md`). Lead "đặt lịch khám" đi thẳng về máy chủ PK của Mảng 5.

### 💰 MẢNG 3 – TÀI CHÍNH & THANH TOÁN · `taichinh` · *(mảng mới – chưa có module)*
| Mã | Micro-Module | Nguồn tái sử dụng | Phiên bản đích |
|---|---|---|---|
| M3.1 | Cổng VietQR SePay: sinh QR động, xác nhận thanh toán qua webhook | M-WEB-03 (v1) | v2.3.0 |
| M3.2 | Sổ chi phí phát sinh & cảnh báo lệch dự toán (cấp cho Mảng 6) | M5.3 (bản 1.0) | v2.3.0 |
| M3.3 | Chi trả hoa hồng CTV/đại lý (lấy kết quả tính từ M4.3) | M-TS-03 | v2.3.0 |
| M3.4 | Đề nghị tạm ứng / thanh toán → gửi 0B duyệt | – | v2.3.0 |
| M3.5 | Xuất bảng tăng ca TC-NS cho Kế toán (nhận từ M5.4) | M-PTKH-03 | v2.4.0 |

### 🎓 MẢNG 4 – GIÁO DỤC & TUYỂN SINH · `tuyensinh` · Fintech Growth
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M4.1 | Quản trị chiến dịch 1 trường × 1 bậc × 1 đợt | 🟢 xem / 🟡 sửa (`webLuuChienDich`) | v2.3.0 |
| M4.2 | Lead theo chiến dịch (`webLeadCD`) · thêm/sửa (`webLuuLead`) | 🟢 xem / 🟡 thêm-sửa mở app v1 | v2.3.0 |
| M4.3 | Bảng tính hoa hồng bậc thang 6 bậc | 🟢 theo từng chiến dịch | – |
| M4.4 | Phễu ứng viên: Mới → Tư vấn → Hồ sơ → Nhập học → Hủy | ✅ | – |
| M4.5 | LMS mini: lớp học, điểm danh, bài tập M01–M20 | ⬜ | v2.6.0 |

### 🏥 MẢNG 5 – NHÂN SỰ & VẬN HÀNH PHÒNG KHÁM · `phongkham` · Hoàng Kim
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M5.1 | Báo cáo ca ngày (lượt khám, doanh thu, tồn đọng) | 🟡 mở app PK v1 | v2.4.0 (v1 mở cổng trước) |
| M5.2 | Minh chứng ảnh nén → Drive (Base64 qua `21_PhongPTKH`) | ⬜ | v2.4.0 (v1 mở cổng trước) |
| M5.3 | Lịch trực tuần, kiểm tra xung đột, đổi ca → 0B duyệt | ✅ xem / ⬜ đổi ca | v2.3.0 |
| M5.4 | Bóc tách tăng ca & bù giờ TC-NS | ⬜ (logic có ở M-PTKH-03) | v2.4.0 |
| M5.5 | Kiểm soát vi phạm NTC (> 3 lần trễ → trừ 0,5 công) | ⬜ (M-PTKH-04) | v2.4.0 |
| M5.6 | Team Morale Index – cảm nhận sau ca 1–5★ | ⬜ (M-PTKH-01) | v2.4.0 |
| M5.7 | Danh bạ nhân sự khoa/phòng | ⬜ | v2.5.0 (đi cùng RBAC) |

### 📌 MẢNG 6 – QUẢN LÝ DỰ ÁN · `duan` · Executive Hub
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M6.1 | Master Dashboard đa dự án (`40_DuAnPK`, `50_HoaSua`, cơ sở mới) | ✅ | – |
| M6.2 | **Daily Flash Report 4 khối** (Tiến độ · Vướng mắc & Đề xuất · Tài chính phát sinh · Chờ Sếp duyệt) | ✅ xem / 🟡 nộp | v2.3.0 |
| M6.3 | Blocker Matrix: rủi ro, người xử lý, hạn gỡ → Task Bus | ⬜ | v2.3.0 |
| M6.4 | Cổng trình duyệt hạng mục / đề xuất chi → 0B + Mảng 3 | 🟡 | v2.3.0 |

### 📋 MẢNG 7 – CÔNG VIỆC LIÊN THÔNG (TASK BUS) · `congviec` · Executive Hub
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M7.1 | Task Event Bus: nhận sự kiện từ mọi mảng, tự sinh việc | ⬜ | v2.3.0 |
| M7.2 | Universal Kanban 3 cột đa nguồn | ✅ | – |
| M7.3 | Phân luồng việc theo RBAC (M0.2) | ⬜ | v2.5.0 |
| M7.4 | Giám sát SLA Xanh → Vàng → Đỏ + báo Telegram | ⬜ | v2.4.0 |

### 🚀 MẢNG 8 – TĂNG TRƯỞNG (MARKETING AI & WEB PHỄU) · `tangtruong` · *(mảng mới – chưa có module)*
| Mã | Micro-Module | Nguồn tái sử dụng | Phiên bản đích |
|---|---|---|---|
| M8.1 | Lịch nội dung đa kênh TOFU/MOFU/BOFU (Facebook, TikTok, Zalo, YouTube) | M7.1 (bản 1.0) | v2.4.0 |
| M8.2 | Xưởng AI Copywriter (PAS/AIDA, kịch bản video ngắn) | M7.2 (bản 1.0) | v2.4.0 |
| M8.3 | **Smart Lead Dispatcher** – phân luồng lead (xem luồng A) | M8.3 (bản 1.0) | v2.3.0 |
| M8.4 | Chốt chặn Human-in-the-Loop: bài chỉ xuất bản sau khi 0B duyệt | M7.3 (bản 1.0) | v2.4.0 |
| M8.5 | Phễu Lặn Biển 0m → -105m & xuất bản đa nền tảng | M-WEB-01/02 | v2.6.0 |
| M8.6 | Báo cáo hiệu suất truyền thông (reach, tương tác) | M7.5 (bản 1.0) | v2.6.0 |

### 🧠 MẢNG 9 – TRI THỨC (SECOND BRAIN) · `trithuc` · Nordic Minimalist
| Mã | Micro-Module | Trạng thái | Phiên bản đích |
|---|---|---|---|
| M9.1 | Kho SOP 3 tầng: HowTos → Runbooks → References | ✅ xem | – |
| M9.2 | Tìm kiếm toàn văn (lọc phía trình duyệt trước, FTS5 sau) | 🟡 | v2.3.0 |
| M9.3 | Đồ thị liên kết `[[wiki-links]]` | ⬜ | v2.6.0 |
| M9.4 | Trích bài học kinh nghiệm từ báo cáo ca / Flash Report | ⬜ | v2.6.0 |
| M9.5 | Tường lửa `KHONG_DUA_VAO.md` – chặn dữ liệu bệnh nhân vào AI | ⬜ (quy tắc đã có) | v2.4.0 |

### 💼 TẦNG 3 – GÓI GIẢI PHÁP TƯ VẤN SỐ *(không có màn hình riêng trong app)*
G1 Chẩn đoán sức khỏe quy trình · G2 Bộ chuẩn hóa SOP ACHSI/FMFT · G3 Offer Stack · G4 Lộ trình CĐS 3 giai đoạn.
Được lắp từ M2 (khách hàng) + M6 (triển khai như 1 dự án) + M9 (bộ SOP) + M8 (tài liệu bán hàng). Lên kế hoạch riêng sau v2.6.0.

**Tổng hợp (v2.2.0):** 13 mã module · 54 micro-modules · **8 🟢 chạy số thật** (Hub hôm nay/thông báo/việc riêng, bản tin KPI, chiến dịch – lead – hoa hồng TS, độ trễ máy chủ, đăng nhập token Hub) · phần còn lại là màn mẫu hoặc chưa làm, theo lộ trình mục 6.

---

## 3. HỢP ĐỒNG ĐẦU VÀO / ĐẦU RA (CHUẨN LEGO)

### 3.1 Hợp đồng Module giao diện
Mỗi tệp `js/modules/<ma>.js` khai báo đúng 1 đối tượng toàn cục:
```js
const ModuleX = {
  ma: 'crm',                  // mã chuẩn ở mục 0, trùng khóa trong SHIN_DEMO_DATA
  ten: 'Khách Hàng & Đối Tác',
  bieuTuong: '👥',
  paletteMacDinh: 'executive',
  render(container, data) {}  // data = null ➜ tự dùng SHIN_DEMO_DATA[ma]
};
```
Đăng ký: thêm vào `MODULES` + `DECAGON_GROUPS` trong `js/app.js`, thêm `<script>` trong `index.html`, thêm khóa dữ liệu mẫu trong `js/demo_data.js`. Màn hình bắt buộc theo **5 quy tắc PHONG_CACH_APP_SHIN** (README mục 3).

### 3.2 Hợp đồng gọi máy chủ (SHIN_API) – đúng giao thức v1 `00_Loi/Loi_Web.gs`
```
Gửi : POST text/plain  { hanh: "web<Tên>", token: "h1.<ma>.0.<chuKy>", du: {...} }
Nhận: { ok: true,  du: <kết quả> }   |   { ok: false, loi: "dang"|"hanh"|"token"|"quyen"|"loi", chiTiet: "..." }
```
- `hanh` phải nằm trong bảng trắng `congWeb_()` của từng app. **Hub** gọi `ham(token, du)`; **KPI, TS, KS, PK** gọi `ham(token, ...du.a)` ➜ v2 dùng `SHIN_API.goiCong('TS', 'webLeadCD', maCD)`.
- Không token, hoặc mảng chưa có máy chủ ➜ dữ liệu mẫu (có dải báo vàng). Lỗi mạng / máy chủ ➜ dải báo đỏ, **không thay lặng lẽ bằng số mẫu**. `quyen` ➜ màn "Chưa vào được".
- **Chống ghi trùng:** máy chủ v1 không nhận mã yêu cầu, nên v2 chặn ở phía trang (`ShinApp.goiNut`: khóa nút, chặn cùng lệnh khi đang chờ). Máy chủ mới ở v2.5.0 sẽ nhận `du.maYeuCau`.
- **Hoàn tác 6s:** `ShinApp.hanhDongHoanTac` – đổi giao diện ngay, chỉ gửi máy chủ khi hết 6 giây.

### 3.3 Hợp đồng sự kiện (Task Bus & Phê duyệt)
```js
// Sự kiện phát lên Task Bus (M7.1)
{ id, nguon: 'khaosat', loai: 'phan_nan', muc: 'gap'|'thuong', tieuDe, lienKet: { ma, id }, han, nguoiNhan }
// Phiếu gửi vào 0B Phê duyệt
{ id, nguon: 'duan', loai: 'chi_phi', tieuDe, soTien?, nguoiDeXuat, tepDinhKem?, trangThai: 'cho'|'duyet'|'sua'|'tuchoi' }
```

---

## 4. NGUYÊN TẮC DỮ LIỆU & BẢO MẬT
1. **Không tạo cơ sở dữ liệu mới:** v2 dùng chung 5 máy chủ Apps Script + Google Sheets của v1; mảng mới (CRM, Tài chính, Dự án, Công việc, Phê duyệt) sẽ được mở thêm hành động trên máy chủ HUB trước, chỉ tách máy chủ riêng khi tải lớn.
2. **Không dữ liệu bệnh nhân** trong CRM, Tri thức, Marketing và mọi lời gọi AI (`KHONG_DUA_VAO.md`).
3. **Kho công khai:** chỉ dữ liệu mẫu trong `demo_data.js`; không đưa token, khóa `HUB_KHOA`, số điện thoại thật lên GitHub.
4. **TV3 chỉ đọc:** KPI không bao giờ ghi ngược vào nguồn doanh thu.
5. **Mọi thao tác tiền bạc / xuất bản / đổi ca** phải qua 0B Phê duyệt.

---

## 5. HIỆN TRẠNG KIỂM TRA NGÀY 29/10/2026 (trên v2.1.0, cập nhật v2.2.0)

Kiểm tra tự động bằng trình duyệt ở bề rộng 375px và 1280px:

| # | Vấn đề phát hiện | Mức | Xử lý |
|---|---|---|---|
| 1 | 6 màn hình **Dự án, CRM, Công việc, Phê duyệt, Tri thức, Quản trị** hiện gần như trống trên bản công khai (API trả `{}` thay vì dữ liệu mẫu) | Nghiêm trọng | ✅ Đã sửa v2.1.1 |
| 2 | Bấm **Khảo sát ACHSI** và **Giáo dục & Tuyển sinh** trong menu ☰ lại mở Executive Hub (sai mã `ks`/`ts`) | Cao | ✅ Đã sửa v2.1.1 |
| 3 | Chế độ Live không bao giờ gọi được máy chủ KS, TS, PK (mã module ≠ khóa endpoint) | Cao | ✅ Đã sửa v2.1.1 |
| 4 | Cuộn ngang ở màn hình Dự án, CRM, Phê duyệt (vi phạm quy tắc 2) | Trung bình | ✅ Đã sửa v2.1.1 |
| 5 | Màn Quản trị liệt kê `taichinh`, `tangtruong` nhưng chưa có module | Trung bình | Kế hoạch v2.3.0 / v2.4.0 |
| 6 | Mọi màn hình gửi cùng 1 hành động `webHomNay` tới máy chủ | Trung bình | ✅ Đã sửa v2.2.0 – mỗi màn gọi đúng cổng của mình |
| 7 | Nút Hoàn tác trong toast chưa hoàn tác gì; badge ⚡ cố định "4"; công tắc bật/tắt mảng chưa có tác dụng | Trung bình | ✅ Đã sửa v2.2.0 (⚡ ẩn khi Live vì chưa có nguồn số) |
| 8 | README liệt kê sai cấu trúc thư mục (5 module) và mã module | Thấp | ✅ Đã sửa v2.1.1 |

---

## 6. LỘ TRÌNH THỰC HIỆN & TIÊU CHÍ HOÀN THÀNH

```
v2.1.1 ✅ ─► v2.2.0 ✅ ─► v2.3.0 ─► v2.4.0 ─► v2.5.0 ─► v2.6.0 ─► v2.7.0
Vá lỗi       P1 nối thật  Dùng nốt  Mở cổng   0B → CRM  PWA +     Mở rộng
             Hub/KPI/TS   cổng v1   ở v1: PK  → Dự án   RBAC +    (Tăng trưởng,
                          đã có     KS, PTKH  → Tài chính Tên miền LMS, Tri thức)
```

| Bản | Nội dung chính | Tiêu chí hoàn thành |
|---|---|---|
| **v2.1.1** ✅ | Vá 4 lỗi bản công khai · quy hoạch 2.0 | 11/11 mục menu đúng màn; không cuộn ngang 375px; 0 lỗi console |
| **v2.2.0** ✅ | Hub (Hôm nay · 🔔 · 📝), KPI bản tin, TS chiến dịch + lead nối thật; phân quyền theo từng app v1; M0.1, M0.4 | Đã thử với máy chủ giả đúng khuôn v1 (đạt). **Còn chờ anh mở bằng token thật và đối chiếu số với v1** |
| **v2.3.0** | Dùng nốt cổng v1 đã có: 🧭 Điều hành, KPI soát lỗi / AOP / báo cáo quý, TS form lead + chiến dịch | Mỗi màn cùng số với app v1 tương ứng; mỗi lệnh ghi tạo đúng 1 dòng |
| **v2.4.0** | Mở cổng ở v1 rồi dựng màn: PK (báo cáo + minh chứng, lịch trực), KS (phiếu, radar), PTKH `webGoi` | Bộ kiểm thử từng app v1 vẫn đạt 100%; v2 cùng số với v1 |
| **v2.5.0** | 0B Dịch vụ chung (phê duyệt, máy báo cáo, việc) → CRM → Dự án (Daily Flash) → Tài chính, trên máy chủ Hub (Q1) | Phê duyệt ghi `Log_Duyet` và trả về mảng gốc; Hoàn tác 6s không gửi gì |
| **v2.6.0** | PWA · RBAC M0.2 · cấp token M0.3 · tên miền riêng · mã hóa token | Mở offline < 0,5s; nhân viên chỉ thấy mảng được cấp |
| **v2.7.0** | Tăng trưởng (Marketing + Web phễu) · LMS · Đồ thị tri thức · Tầng 3 Gói tư vấn | Theo phiếu chi tiết lập khi bắt đầu đợt |

**Quy tắc mỗi đợt:** cập nhật `CHANGELOG.md`, `UPDATE.md`, số phiên bản (`js/app.js` – `PHIEN_BAN`); kiểm tra 375px + 1280px, sáng + tối; cập nhật cột trạng thái mục 2; mọi màn theo `PHONG_CACH_APP_SHIN.md`.

---

## 7. QUYẾT ĐỊNH ĐÃ CHỐT & RỦI RO

**5 câu đã được Sếp đồng ý ngày 29/10/2026** (áp dụng từ v2.2.0):

| # | Nội dung | Đã chốt |
|---|---|---|
| Q1 | Mảng mới (CRM, Tài chính, Dự án, Công việc, Phê duyệt) lưu ở đâu? | Thêm Sheet + cổng trên máy chủ **Hub** hiện có (không tạo máy chủ thứ 6 lúc đầu) |
| Q2 | Lead "đặt lịch khám" có thông tin người bệnh | Chỉ lưu ở máy chủ PK; CRM chỉ thấy số đếm |
| Q3 | Bottom Nav 5 nút cố định | Giữ 5 nút; từ v2.6.0 mỗi vai trò tự chọn 3 nút giữa |
| Q4 | Token trên URL `?t=` | ✅ Đã làm ở v2.2.0: lưu rồi xóa khỏi thanh địa chỉ; mã hóa ở v2.6.0 |
| Q5 | Gói Tư vấn số (Tầng 3) có màn riêng? | Chưa; quản lý như 1 loại dự án ở Mảng 6 |

| Rủi ro | Ảnh hưởng | Giảm thiểu |
|---|---|---|
| Hạn mức Apps Script (thời gian chạy, số lần gọi/ngày) | Live chậm / lỗi giờ cao điểm | Bộ đệm 6h cho dữ liệu chỉ đọc; M0.4 theo dõi |
| Kho công khai lộ dữ liệu thật | Lộ thông tin | Rà `demo_data.js` mỗi đợt; quét bí mật trước khi đẩy |
| Ghi trùng khi mạng yếu | Sai số liệu báo cáo | `maYeuCau` chống trùng (mục 3.2) |
