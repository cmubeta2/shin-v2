# HỢP ĐỒNG CỔNG v1 ↔ v2 (HOP_DONG_CONG_V2.md)

*Cập nhật 30/10/2026 · áp dụng từ SHIN v2.5.0.*

Màn v2 của các mảng dưới đây **đã dựng xong** và đang chờ cổng của máy chủ v1.
- Chưa có cổng: máy chủ trả `{ok:false, loi:'hanh'}`, v2 hiện dải vàng "chưa mở cổng" và dùng số MẪU.
- Có cổng rồi: v2 tự nhận dữ liệu thật. Không phải sửa hay đưa lại v2.

Giao thức chung là của `00_Loi/Loi_Web.gs` (giữ nguyên, không đổi):
- **Gửi:** `POST {hanh, token, du}`.
- **Nhận:** `{ok, du}` hoặc `{ok:false, loi, chiTiet}`.
- **Gắn hàm:** thêm hàm vào bảng trắng `congWeb_()` của app.
- **Cách nhận tham số:**
  - Hub nhận `ham(token, du)`.
  - KPI, TS nhận `ham(token, ...du.a)` qua `bocCong…_`. **KS nhận `ham(token, du)` – du object** (sửa 05/11 theo mã v1.4.x).
  - **PK (`21_PhongPTKH`) nhận `ham(token, du)` – du là object** (sửa 05/11 theo mã v1.0.7; v2 gọi `SHIN_API.goi('PK', hanh, du)`).
- **Kiểm quyền:** từ chối thì ném `loiQuyen_()` để v2 hiện "chưa có quyền".
- **Lỗi khác:** ném `Error` có câu tiếng Việt, v2 hiện nguyên câu đó.
- **Tiền:** là số đồng (number). Không gửi chuỗi đã định dạng; v2 tự định dạng kiểu Việt Nam.
- **Ngày:** dạng `dd/mm/yyyy`.
- **Cấm trả:** thông tin người bệnh và bệnh án.

---

## v2.4.0 – App đã có, cần thêm cổng

### KS – `70_KhaoSat` · ~~`webTongQuan`~~ ➜ `webTongHopKS` + `webDsKhaoSat` (chỉ đọc)

> **Theo mã v1 (05/11):** KS không làm `webTongQuan`. v2.6.7 gọi `webTongHopKS(token, du{thang?})` (KS L6, v1.4.4 – đã code, chờ lên app; app đang v1.4.3 ➜ trả `hanh` ➜ v2 hiện dải vàng + mẫu) và `webDsKhaoSat(token, {})` (L1). KS nhận `du` là **object** (không phải `du.a`). Dạng `webTongHopKS` = khối dưới bỏ `khaoSat`; danh sách KS lấy từ `webDsKhaoSat.ds` (maKS, tieuDe, trangThai, han) – chưa có số phiếu từng KS.

```js
{ thang: { soPhieu, haiLong /*0..1|null*/, canXuLy },
  tru: [{ ma:'A', ten, diem /*1..5|null*/, tyLe /*0..1|null*/ }],          // 5 trụ ACHSI
  khaoSat: [{ ma, ten, trangThai, soPhieu, moTu, dongLuc }],
  canXuLy: [{ ma, khaoSat, cau, diem /*≤2*/, ngay, noiDung }] }            // KHÔNG có SĐT / tên người trả lời (QK4)
```

- **Quyền:** Admin và "Quản lý khảo sát".
- **Thuộc dòng:** KS L1 (khung), L3 (kết quả), L4 (liên thông).

### PK – `21_PhongPTKH` · 19 cổng (đã lên app v1.0.7 – L1–L5 [x]) – v2.6.5 nối thật

Dạng dữ liệu = mục 4 `He sinh thai Shin/21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md` (trọng tài là `congWeb_()` trong `10_WebApp.gs`):
`webKhoiDong` · `webHomNay` · `webBaoCao` · `webNopBaoCao` · `webChoDuyet` · `webDuyet` · `webCongViec` · `webChiTietViec` · `webCapNhatViec` · `webThemViecCaNhan` · `webThongBao` · `webDaDocThongBao` · `webGopYCuaToi` · `webGuiGopY` · `webHoSo` · `webDeNghiSuaHoSo` · `webNhanSu` · `webHoSoNhanSu` · `webDuyetSuaHoSo` · `webLichTuan` · `webBangXepLich`.

```js
webHomNay() → { ngay, viecQuaHan, viecHomNay, baoCaoHomNay:'da_nop'|'chua_nop'|'nghi',
                canXuLy:[{id, ten, nguon, han, muc, tab}], thongBaoMoi:[{id, tieuDe, luc, daDoc}], choDuyet }
```
(Dạng cũ `{baoCao:{daNop,tong}, minhChung, doiCa, nhanSu, viecCa}` bỏ – v1 không làm.) Chưa có trong congWeb_: `webGuiDonNghi`, `webHuyDonNghi`, `webLuuXepLich`, `webGoiYXepLich` (ghi qua PTKH `webGoi`).

- **Quyền:** lãnh đạo phòng và tổ trưởng xem cả phòng; nhân viên chỉ thấy dòng của mình.
- **Thuộc dòng:** PK L1–L3.

### KPI – thêm `webNhap2027` vào `congWeb_()` ✅ (KPI v1.8.2 L10 – v2.6.9 đã nối)

Hàm `webNhap2027` đã có sẵn. v2 cần nó để đọc nháp AOP năm sau trước khi gọi `webLuuTangTruong`. Chỉ cần thêm 1 dòng, không đổi logic.

---

## HUB L8 – Telegram Mini App (đã lên Hub v1.13.3) – v2.6.8 dùng

`POST {hanh:'webTelegram', du:{initData}}` (KHÔNG token) ➜ `{ok:true, du:{ok:true, token, hetHan, nguoi:{ma, hoTen}}}` | `{ok:true, du:{ok:false, loi:'chua_cai_bot'|'thieu_hash'|'sai_chu_ky'|'het_han'|'thieu_user'|…, msg}}`.

## v2.5.0 – Dịch vụ chung và mảng mới trên máy chủ Hub (Q1)

Mỗi mảng có 1 sheet mới trong file Hub, tạo tự động như `bangHopThu_()`. Mọi ghi đều qua `LockService`. Mỗi lệnh có mã riêng để bấm 2 lần không bị ghi trùng.

### 0B Phê duyệt 1-chạm

**`webPheDuyet(token, {})`** trả về:

```js
{ choDuyet: [{ ma, loai, nguon:'PK'|'DA'|'TC'|'TS'…, tieuDe, nguoiGui, luc, chiTiet, soTien /*đ|null*/, link }],
  daDuyetHomNay, canSua }
```

**`webDuyet(token, {ma, quyet:'duyet'|'can_sua'|'tu_choi', yKien})`**:
- Ghi **1 dòng** vào `Log_Duyet` với các cột Ma, Luc, MaNguoi, Quyet, YKien, Nguon.
- Báo kết quả về app gốc qua liên thông `suKien`.
- Trả lại dữ liệu cùng dạng với `webPheDuyet`.
- `can_sua` và `tu_choi` bắt buộc có `yKien`.

Nguồn phiếu: các app gửi yêu cầu duyệt vào Hub qua liên thông. Hub lưu chúng ở sheet `PhieuDuyet`.

### CRM

**`webCRM(token, {})`** trả về:

```js
{ doiTac: [{ ma, ten, loai:'B2B Khám Sức Khỏe'|'Đối tác Đào tạo'|'CTV Tuyển sinh'|'Nhà Cung Ứng', quyMo, nguoiLienHe, dienThoai, trangThai }],
  leadMoi: [{ ten, nguon, soDt, ghiChu, luc }] }
```

**`webLuuDoiTac(token, {doiTac})`**:
- `ma` trống nghĩa là thêm mới.
- Trả lại dữ liệu cùng dạng với `webCRM`.
- Chống chèn công thức bằng `chongCongThuc`.
- **Cấm lưu dữ liệu người bệnh.**

### Dự án – Daily Flash 4 khối

**`webDuAn(token, {})`** trả về:

```js
{ duAn: [{ ma /*chữ, số, '-'*/, ten, quanLy, tienDo /*0..100*/, nganSach /*đ*/, daChi /*đ*/, trangThai, hanChot, mucDo:'xanh'|'vang'|'do' }],
  flash: { ngay, nguoiBaoCao, tienDo: ['…'], vuongMac: [{ vanDe, mucDo:'Cao'|'Vừa'|'Thấp', deXuat }],
           taiChinh: { tongNganSach, daGiaiNgan, phatSinh: [{ khoanMuc, soTien, nguoiChi, tinhTrang }] },
           choDuyet: [{ ma, loai, tieuDe, han, uuTien }] } }      // choDuyet = phiếu 0B có nguon 'DA'
```

### Tài chính

**`webTaiChinh(token, {})`** trả về:

```js
{ thang: 'mm/yyyy', thu, chi, ton,                                   // đ
  khoanChoDuyet: [{ ma, khoanMuc, soTien, nguoiDeXuat, duAn, luc }],  // = phiếu 0B có nguon 'TC'
  giaoDich: [{ ngay, noiDung, soTien /* + thu, − chi */, nguon:'SePay'|'Tay' }] }
```

- **Quyền:** Admin và Kế toán.
- **Nguồn thu tự động:** webhook SePay, làm sau. Trước mắt nhập tay.

---

## v2.6.0 – Quản trị người dùng & app · Nối PTKH gốc

### Đã chạy được ngay (cổng có sẵn, v2 không cần chờ)

- **Hub `webCaiDat` / `webLuuPhuTrach` / `webCapLink`** (30_CaiDat.gs, chỉ Admin) ➜ màn 🛡️ Người dùng & App: danh bạ, app bật/tắt + lỗi kéo số, giao người phụ trách mảng (Hoàn tác 6 giây), cấp link vào Hub.
  - Link cấp ra chứa token Hub **không thời hạn** ➜ v2 không hiện chữ, chỉ Chép / Gửi; tự quên sau 2 phút.
- **PTKH gốc qua Hub:** `webHomNay` đã có thẻ số `tieuDe:'PTKH'` + việc PTKH (Hub kéo qua liên thông `tomTat` / `viec`). Mở app PTKH bằng link `lienKet` có token Hub (PTKH nhận token Hub từ v4.05 – L36a).

### HUB – thêm cổng ghi cho danh bạ và app

**`webCaiDat`** – thêm (không đổi trường cũ): `ungDung[].ma` (MaApp) và `ungDung[].lanKeoCuoi` (`hh:mm dd/mm`).

**`webLuuNguoiDung(token, {nguoi:{ma, hoTen, vaiTro, trangThai}})`**:
- Chỉ Admin (`canAdmin_`). `ma` theo `laMaNguoiHub`; mã chưa có = thêm mới, có rồi = sửa.
- `vaiTro` ∈ Admin | Quản lý | Người dùng; `trangThai` ∈ Đang dùng | Ngưng (ngưng = token người đó bị từ chối ở mọi app vì `timNguoiDung` lọc Đang dùng).
- Không cho tự hạ / ngưng chính mình nếu là Admin cuối cùng. `chongCongThuc` cho hoTen. Ghi NhatKy.
- Trả lại dữ liệu cùng dạng `webCaiDat`.

**`webLuuUngDung(token, {ma, bat})`**: chỉ Admin, đổi cột BatTat; trả lại dạng `webCaiDat`.

### PTKH gốc (20_PTKH) – mở cổng web cho v2 (chỉ đọc trước)

> **Thực tế v1 (05/11 – trọng tài là mã):** PTKH L148 (v1.292.29) KHÔNG dùng `congWeb_`; `doPost` rẽ nhánh `webGoi` trước Lõi:
> `POST {hanh:'webGoi', token, du:{ham, thamSo:[…]}}` ➜ `{ok, du}` | `{ok:false, loi:'token'|'ham'|'thamSo'|<câu lỗi>}`; `ham` phải trong `HAM_WEBGOI_` (37_LienThongHub.gs), gọi `ham(token, …thamSo)`.
> v2.6.6 dùng `webDashboard(token, ky)` (ky = tuan | thang | quy) cho khối Tổng quan; địa chỉ /exec lấy từ link app PTKH trong Hub `webKhoiDong.lienKet` (không ghi cứng). Các gạch đầu dòng dưới là đề xuất cũ – bỏ.

- `doPost` hiện chỉ gọi `xuLyLTHub_` ➜ đổi sang `cuaWebPost_(e, congWeb_(), {tomTat, viec, thongBao})` của Lõi (Loi_Web.gs) – nhánh liên thông giữ nguyên.
- `congWeb_()` bảng trắng chỉ đọc: `webKhoiDong`, `webDashboard`. Hai hàm đã có, nhận `(token, …du.a)` như KPI/TS/KS/PK.
- Token: `xacThucWeb_` nhận token Hub (đã có từ L36a); lỗi xác thực ném `loiQuyen_` để v2 hiện "chưa có quyền".
- **Cấm trả:** thông tin người bệnh, nội dung khiếu nại có tên / SĐT khách.

---

## Phiếu giao việc gợi ý

Dán vào tab **🧭 Điều hành → ⚡ Giao việc** của v2. Máy sẽ thêm dòng L vào hàng đợi app tương ứng.

| App | Nội dung giao |
|---|---|
| KS | Mở cổng `webTongQuan` theo HOP_DONG_CONG_V2.md (repo shin-v2) mục KS – chỉ đọc, không trả thông tin liên hệ; thêm vào congWeb_; kiểm thử 90_KiemThuApp. |
| PK | Mở cổng `webHomNay` theo HOP_DONG_CONG_V2.md mục PK – chỉ đọc file PTKH qua DB_ID, không sửa cấu trúc PTKH; thêm vào congWeb_. |
| KPI | Thêm `webNhap2027` vào congWeb_ (hàm đã có) để v2 sửa nháp AOP năm sau. |
| HUB | 0B Phê duyệt: sheet PhieuDuyet + Log_Duyet, cổng `webPheDuyet` / `webDuyet` theo HOP_DONG_CONG_V2.md; Hoàn tác do v2 giữ 6 giây, máy chủ ghi đúng 1 lần theo mã. |
| HUB | CRM: sheet DoiTac, cổng `webCRM` / `webLuuDoiTac` theo HOP_DONG_CONG_V2.md; không lưu người bệnh. |
| HUB | Dự án: sheet DuAn + FlashNgay, cổng `webDuAn` (Daily Flash 4 khối, khối 4 lấy từ 0B). |
| HUB | Tài chính: sheet ThuChi, cổng `webTaiChinh` (khoản chờ duyệt lấy từ 0B). |
| HUB | Quản trị v2.6: cổng `webLuuNguoiDung` + `webLuuUngDung`, thêm `ma` + `lanKeoCuoi` vào `ungDung` của `webCaiDat` theo HOP_DONG_CONG_V2.md mục v2.6; chỉ Admin, không cho ngưng Admin cuối cùng. |
| PTKH | Mở cổng web cho SHIN v2: doPost dùng `cuaWebPost_` của Lõi (giữ nhánh liên thông), `congWeb_` chỉ đọc gồm `webKhoiDong` + `webDashboard`, nhận token Hub; theo HOP_DONG_CONG_V2.md mục v2.6 PTKH. Không trả thông tin người bệnh / khách khiếu nại. |
