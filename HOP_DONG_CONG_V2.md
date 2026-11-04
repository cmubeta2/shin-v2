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
  - KPI, TS nhận `ham(token, ...du.a)` qua `bocCong…_`.
  - **KS (`70_KhaoSat`) cũng nhận `ham(token, du)` đối tượng** (theo mã v1.4.3, sửa 04/11 v2.7.2).
  - **PK (`21_PhongPTKH`) nhận `ham(token, du)` – du là đối tượng** (theo mã v1.0.7, sửa 04/11 v2.7.0).
- **Kiểm quyền:** từ chối thì ném `loiQuyen_()` để v2 hiện "chưa có quyền".
- **Lỗi khác:** ném `Error` có câu tiếng Việt, v2 hiện nguyên câu đó.
- **Tiền:** là số đồng (number). Không gửi chuỗi đã định dạng; v2 tự định dạng kiểu Việt Nam.
- **Ngày:** dạng `dd/mm/yyyy`.
- **Cấm trả:** thông tin người bệnh và bệnh án.

---

## v2.4.0 – App đã có, cần thêm cổng

### KS – `70_KhaoSat` (app KS v1.4.3, L1–L4 ✅ – sửa theo mã thật 04/11; KHÔNG có `webTongQuan`)

```js
webDsKhaoSat({})        → { ok, ds:[{maKS, tieuDe, moTa, doiTuong, trangThai:'Nháp'|'Đang mở'|'Đã đóng', han, nhieuLan, soCau, ngayTao}], dem:{dangMo, nhap, daDong} }
webKetQuaKS({maKS, nguon?, tu?, den?}) → { ok, maKS, tieuDe, soPhieu, choXacMinh, theoNgay:[{ngay, n}], cau:[{maCH, phienBan, loai, noiDung, n, tb?, nps?, yKien?}] }
webXuatKS({maKS, kieu:'csv'|'sheet'}) → { ok, csv, tenTep } | { ok, link }
liên thông ksSoLieu (Hub ký HMAC – trình duyệt không gọi được)   ·   webCongKhai* (điền phiếu công khai, không token)
```

- **Quyền:** Admin và "Quản lý khảo sát" (QuanLyKS chỉ thấy KS của mình).
- **v2 dùng (v2.7.2):** webDsKhaoSat + webKetQuaKS (≤ 6 KS, ưu tiên Đang mở) + webXuatKS csv. Màn KHÔNG hiện câu loại `lienhe` / ý kiến (QK4). 5 trụ ACHSI chưa có ở v1 ➜ v2 hiện điểm TB câu 5 mức theo từng khảo sát.

### HUB – Telegram Mini App `webTelegram` (HUB L8, Hub v1.13.3 ✅)

```js
POST Hub {hanh:'webTelegram', du:{initData}}   // KHÔNG token – nhánh riêng trước cuaWebPost_
→ {ok:true, du:{ok:true, token /*token Hub 12 giờ*/, hetHan, nguoi:{ma, hoTen}}} | {ok:true, du:{ok:false, loi, msg}}
```

- **v2 dùng (v2.7.1):** `SHIN_API.dangNhapTelegram()` khi trang mở có `Telegram.WebApp.initData` hoặc `#tgWebAppData`; lưu token như `?t=`; xóa hash. Telegram Web (web.telegram.org) được phép nhúng khung.

### PK – `21_PhongPTKH` (app PK v1.0.7, L1–L5 ✅ – sửa theo mã thật 04/11)

Nguồn chuẩn: `He sinh thai Shin/21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md` mục 4. Gọi `SHIN_API.goi('PK', hanh, {…})`.

```js
webKhoiDong()  → { nguoi:{hoTen, vaiTro, to, viTri, quyen:['nv'|'totruong'|'lanhdao'|'admin'|'xemthu']}, app, mo, dem:{thongBao, choDuyet} }
webHomNay()    → { ngay, viecQuaHan, viecHomNay, baoCaoHomNay:'da_nop'|'chua_nop'|'nghi', canXuLy:[{id, ten, nguon, han, muc, tab}], thongBaoMoi, choDuyet }
webCongViec({loc}) → { dangLam, quaHan, xongTuan, viec:[{id, ten, loai, han, tienDo, nguoiGiao, muc}] }
webCapNhatViec({id, tienDo?}) → { ok }      webThemViecCaNhan({ten, han}) → { ok, id }
webBaoCao({thang}) → { soDaNop, soChuaNop, soChoDuyet, mau:[{ma, nhan, kieu, batBuoc}], lichSu:[…] }
webNopBaoCao({ngay, noiDung, anh:[{ten, kieu, base64}]}) → { ok, ngay, loiAnh? }
webChoDuyet() → { baoCao:[…], nghi:[…] }    webDuyet({loai:'baocao', ids, ketQua:'dat'|'tra_lai', lyDo} | {loai:'tatca', muc, ketQua:'dat'}) → { ok, so }
webLichTuan({tuan}) → { tuan, ngay:[…], phepCon, nghiBuCon, donNghi:[…] }   (chỉ đọc; xin nghỉ qua webGoi PTKH)
webThongBao() → { ds:[…] }   webDaDocThongBao({id:'tatca'}) → { ok }
webGopYCuaToi() → { ds:[…] } webGuiGopY({loai, noiDung, anh}) → { ok }   webHoSo() → {…}   webNhanSu({tim}) → { dangLam, moiVao, choSua, ds, yeuCauSua }
```

- **Quyền:** duyệt / xếp lịch = tổ trưởng, admin; nhân sự = lãnh đạo; còn lại mọi nhân viên.
- **v2 dùng (v2.7.0):** tất cả hàm trên. Chưa dùng: duyệt đơn nghỉ (PK bỏ qua – làm trên PTKH), webBangXepLich, webDeNghiSuaHoSo, webHoSoNhanSu, webDuyetSuaHoSo.

### KPI – `webNhap2027` (KPI L10, đã code v1.8.2 – app đang v1.8.1) – v2.7.6 dựng màn

```js
webNhap2027()  → { nam, namGoc, suaDuoc /*Admin*/, vien:{khoa, muc2026, g, nguon:'anh'|'thucDat'|'macDinh', macDinh, muc2027} | null, khoa:[ …cùng khuôn ] } | { loi }
webLuuTangTruong(khoa, g /*phân số −0,5…2; '' = về mặc định*/) → { luu:true } | { xoa:true }   // chỉ Admin, chỉ ghi ScriptProperties
```

- KPI gọi kiểu `bocCong` (tham số rời trong `du.a`) ➜ v2 dùng `SHIN_API.goiCong('KPI', …)`.

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

### PTKH gốc (20_PTKH) – cổng `webGoi` (L148, PTKH v1.294.29+, trên app v1.297.18) – v2.7.5 dùng

> **Sửa 04/11 theo mã v1:** PTKH không mở `congWeb_` riêng mà có **1 cổng** `webGoi`: POST text/plain `{hanh:'webGoi', token, du:{ham, thamSo:[]}}` ➜ `{ok, du}` / `{ok:false, loi}`; `ham` phải trong `HAM_WEBGOI_` (152 hàm WebApp.html gọi; bỏ cài đặt / chạy lệnh / khóa bí mật); token Hub đứng đầu tham số.

- Địa chỉ máy chủ: v2 lấy **động** từ link PTKH trong `webKhoiDong.lienKet` của Hub (chỉ nhận `https://script.google.com/macros/s/…/exec`), không chép link vào mã.
- **v2 đang dùng (v2.7.5):** `webDashboard(token, 'thang')` ➜ `{homNay, nopBC, chuoiDH, thang:{tenKy, nhan, toi:{bc:{tong, dungHan, tre, khongNop}, viec:{dangLam, quaHan, xong}}, mucTieu:{ptThoiGian, ngayConLai, chiTieu:[{ten, dvt, th, kh, pt, den, duBao}]}}}`.
- Sau: báo cáo / lịch (`webLichTo`, `webBangLichNghi`, `webGuiNghiPhep`) – cũng là đường ghi xin nghỉ cho màn Phòng PTKH.
- **Cấm trả:** thông tin người bệnh, nội dung khiếu nại có tên / SĐT khách.

---

## Phiếu giao việc gợi ý

Dán vào tab **🧭 Điều hành → ⚡ Giao việc** của v2. Máy sẽ thêm dòng L vào hàng đợi app tương ứng.

| App | Nội dung giao |
|---|---|
| KS | ~~Mở cổng `webTongQuan`~~ – bỏ (04/11): v2 dùng webDsKhaoSat + webKetQuaKS + webXuatKS đã có ở v1.4.3. |
| PK | Mở cổng `webHomNay` theo HOP_DONG_CONG_V2.md mục PK – chỉ đọc file PTKH qua DB_ID, không sửa cấu trúc PTKH; thêm vào congWeb_. |
| KPI | Thêm `webNhap2027` vào congWeb_ (hàm đã có) để v2 sửa nháp AOP năm sau. |
| HUB | 0B Phê duyệt: sheet PhieuDuyet + Log_Duyet, cổng `webPheDuyet` / `webDuyet` theo HOP_DONG_CONG_V2.md; Hoàn tác do v2 giữ 6 giây, máy chủ ghi đúng 1 lần theo mã. |
| HUB | CRM: sheet DoiTac, cổng `webCRM` / `webLuuDoiTac` theo HOP_DONG_CONG_V2.md; không lưu người bệnh. |
| HUB | Dự án: sheet DuAn + FlashNgay, cổng `webDuAn` (Daily Flash 4 khối, khối 4 lấy từ 0B). |
| HUB | Tài chính: sheet ThuChi, cổng `webTaiChinh` (khoản chờ duyệt lấy từ 0B). |
| HUB | Quản trị v2.6: cổng `webLuuNguoiDung` + `webLuuUngDung`, thêm `ma` + `lanKeoCuoi` vào `ungDung` của `webCaiDat` theo HOP_DONG_CONG_V2.md mục v2.6; chỉ Admin, không cho ngưng Admin cuối cùng. |
| PTKH | Mở cổng web cho SHIN v2: doPost dùng `cuaWebPost_` của Lõi (giữ nhánh liên thông), `congWeb_` chỉ đọc gồm `webKhoiDong` + `webDashboard`, nhận token Hub; theo HOP_DONG_CONG_V2.md mục v2.6 PTKH. Không trả thông tin người bệnh / khách khiếu nại. |
