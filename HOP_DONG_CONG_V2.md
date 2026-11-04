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
  - KPI, TS, KS, PK nhận `ham(token, ...du.a)` qua `bocCong…_`.
- **Kiểm quyền:** từ chối thì ném `loiQuyen_()` để v2 hiện "chưa có quyền".
- **Lỗi khác:** ném `Error` có câu tiếng Việt, v2 hiện nguyên câu đó.
- **Tiền:** là số đồng (number). Không gửi chuỗi đã định dạng; v2 tự định dạng kiểu Việt Nam.
- **Ngày:** dạng `dd/mm/yyyy`.
- **Cấm trả:** thông tin người bệnh và bệnh án.

---

## v2.4.0 – App đã có, cần thêm cổng

### KS – `70_KhaoSat` · v1.4.3 (L2–L4 đã lên app) – v2.6.6 nối thật

> **Sửa 04/11 theo mã v1 (trọng tài):** KS **không có** `webTongQuan`. Máy chủ nhận `(token, du)` với `du` là đối tượng. Quyền: Admin / Quản lý khảo sát.

```js
webDsKhaoSat({})  → { ok, ds:[{maKS, tieuDe, moTa, doiTuong, trangThai:'Nháp'|'Đang mở'|'Đã đóng', han, soCau, cauHinh, ngayTao}], dem:{dangMo, nhap, daDong} }
webKetQuaKS({maKS, nguon, tu, den}) → { ok, maKS, tieuDe, soPhieu, choXacMinh, theoNgay:[{ngay, n}],
                                       cau:[{maCH, phienBan, loai, noiDung, n, tb?, tyLe?:{lựa chọn: %}, nps?, yKien?:[≤50 chữ], anLienHe?}] }
webXuatKS({maKS, kieu:'csv'|'sheet', nguon, tu, den}) → csv: { ok, csv, tenTep, msg } · sheet: { ok, link, msg }
// Công khai (không token): webCongKhaiDocKS({ma}) · webCongKhaiGuiPhieu({...}) – v2 chưa dùng
// Liên thông Hub: ksSoLieu (không có thông tin liên hệ – QK4)
```

- **v2 đang dùng (v2.6.6):** `webDsKhaoSat`, `webKetQuaKS`, `webXuatKS` (csv). Soạn / mở / đóng khảo sát vẫn trên app KS.
- **Còn thiếu cho radar ≤ 2★ toàn viện:** chưa có cổng gom ý kiến ≤ 2★ của mọi khảo sát (v2 hiện xem từng khảo sát).

### PK – `21_PhongPTKH` · đã lên app v1.0.7 (L1–L5) – v2.6.5 nối thật

> **Sửa 04/11 theo mã v1 (trọng tài):** máy chủ PK nhận `(token, du)` với `du` là **đối tượng** (như Hub), KHÔNG phải `du.a`. Khuôn dữ liệu đầy đủ ở `He sinh thai Shin/21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md` mục 4. Bản cũ ở đây (`baoCao:{daNop,tong}`, `nhanSu`, `viecCa`) **không còn đúng**.

```js
webKhoiDong()  → { nguoi:{hoTen, vaiTro, to, viTri, quyen:[...]}, app:{...}, dem:{thongBao, choDuyet} }
webHomNay()    → { ngay, viecQuaHan, viecHomNay, baoCaoHomNay:'da_nop'|'chua_nop'|'nghi', canXuLy:[{id, ten, nguon, han, muc, tab}], thongBaoMoi:[...], choDuyet }
webCongViec({loc}) · webChiTietViec({id}) · webThemViecCaNhan({ten, han}) · webCapNhatViec({id, ...})
webBaoCao({thang}) · webNopBaoCao({ngay, noiDung:{ma:giaTri}, anh:[{ten, kieu, base64}]}) → {ok, ngay, loiAnh?}
webLichTuan({tuan}) · webThongBao() · webDaDocThongBao({id|'tatca'}) · webGopYCuaToi() · webGuiGopY({loai, noiDung, anh})
webHoSo() · webDeNghiSuaHoSo(...) · QUẢN LÝ: webChoDuyet({loai}) · webDuyet({loai, ids, ketQua, lyDo}) · webNhanSu({tim}) · webHoSoNhanSu({ma}) · webDuyetSuaHoSo(...) · webBangXepLich({tuan, to})
```

- **v2 đang dùng (v2.6.5):** mọi cổng đọc trên + ghi `webNopBaoCao`, `webThemViecCaNhan`, `webDaDocThongBao`, `webGuiGopY`, `webDuyet`.
- **Chưa có cổng ghi ở PK:** xin nghỉ / đổi ca (`webGuiDonNghi` trong hợp đồng giao diện nhưng chưa vào `congWeb_`), xếp lịch (`webLuuXepLich`) – v2 mở app v1.

### KPI – thêm `webNhap2027` vào `congWeb_()`

Hàm `webNhap2027` đã có sẵn. v2 cần nó để đọc nháp AOP năm sau trước khi gọi `webLuuTangTruong`. Chỉ cần thêm 1 dòng, không đổi logic.

---

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

### PTKH gốc (20_PTKH) – cổng `webGoi` (L148, PTKH v1.294.29+, trên app v1.297.18) – v2.6.8 dùng

> **Sửa 04/11 theo mã v1:** PTKH không mở `congWeb_` riêng mà có **1 cổng** `webGoi`: POST text/plain `{hanh:'webGoi', token, du:{ham, thamSo:[]}}` ➜ `{ok, du}` / `{ok:false, loi}`; `ham` phải trong `HAM_WEBGOI_` (152 hàm WebApp.html gọi; bỏ cài đặt / chạy lệnh / khóa bí mật); token Hub đứng đầu tham số.

- Địa chỉ máy chủ: v2 lấy **động** từ link PTKH trong `webKhoiDong.lienKet` của Hub (chỉ nhận `https://script.google.com/macros/s/…/exec`), không chép link vào mã.
- **v2 đang dùng (v2.6.8):** `webDashboard(token, 'thang')` ➜ `{homNay, nopBC, chuoiDH, thang:{tenKy, nhan, toi:{bc:{tong, dungHan, tre, khongNop}, viec:{dangLam, quaHan, xong}}, mucTieu:{ptThoiGian, ngayConLai, chiTieu:[{ten, dvt, th, kh, pt, den, duBao}]}}}`.
- Sau: báo cáo / lịch (`webLichTo`, `webBangLichNghi`, `webGuiNghiPhep`) – cũng là đường ghi xin nghỉ cho màn Phòng PTKH.
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
