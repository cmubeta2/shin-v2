/* Kiểm hàm THUẦN 🩺 Khảo sát (app 70_KhaoSat): form khảo sát, cấu hình câu, câu hỏi, cấp quyền, nút trạng thái. */
const app = napApp(['js/api.js', 'js/modules/khaosat.js']);
const KS = app.lay('ModuleKhaoSat');
const j = x => JSON.parse(JSON.stringify(x));

mo('Khảo sát – kiemKS');
kiem('hợp lệ: cắt khoảng trắng, hạn rỗng hoặc ngày có thật, NhieuLan ép boolean', () => {
  assert.deepStrictEqual(j(KS.kiemKS({ TieuDe: '  KS tháng 11 ', Han: '30/11/2026', NhieuLan: 1 }).goi),
    { TieuDe: 'KS tháng 11', MoTa: '', DoiTuong: '', Han: '30/11/2026', NhieuLan: true });
  assert.ok(KS.kiemKS({ TieuDe: 'x', Han: '' }).goi);
  assert.ok(KS.kiemKS({ TieuDe: 'x', Han: '29/02/2028' }).goi, 'năm nhuận');
});
kiem('lỗi: thiếu tiêu đề, quá dài, ngày không có thật / sai dạng', () => {
  [{}, { TieuDe: '   ' }, { TieuDe: 'a'.repeat(201) }, { TieuDe: 'x', MoTa: 'a'.repeat(1001) }, { TieuDe: 'x', DoiTuong: 'a'.repeat(201) },
    { TieuDe: 'x', Han: '31/11/2026' }, { TieuDe: 'x', Han: '29/02/2027' }, { TieuDe: 'x', Han: '2026-11-30' }, { TieuDe: 'x', Han: '1/12/2026' }]
    .forEach((du, i) => assert.ok(KS.kiemKS(du).loi, 'ca ' + i));
});

mo('Khảo sát – cauHinhTu');
const NGAN = [{ maCH: 'CH001', phienBan: 2, batBuoc: true }, { maCH: 'CH002', phienBan: '', batBuoc: 0 }];
kiem('giữ thứ tự chọn, bỏ trùng, phienBan rỗng ➜ 1, moiTrang lạ ➜ 1cau', () => {
  assert.deepStrictEqual(j(KS.cauHinhTu(['CH002', 'CH001', 'CH002'], NGAN, 'xyz').cauHinh),
    { cau: [{ maCH: 'CH002', phienBan: 1, batBuoc: false }, { maCH: 'CH001', phienBan: 2, batBuoc: true }], moiTrang: '1cau' });
  assert.strictEqual(KS.cauHinhTu([], NGAN, 'catrang').cauHinh.moiTrang, 'catrang');
});
kiem('mã không còn trong ngân hàng ➜ lỗi', () => assert.ok(KS.cauHinhTu(['CH009'], NGAN).loi));

mo('Khảo sát – kiemCau / kiemQuyen / nutTrangThai');
kiem('câu chọn cần ≥ 2 lựa chọn (chuỗi nhiều dòng hoặc mảng), câu chữ bỏ lựa chọn', () => {
  const loaiChon = KS.LOAI_CO_LUA_CHON[0];
  const loaiChu = KS.LOAI_CAU.map(x => x[0]).find(l => KS.LOAI_CO_LUA_CHON.indexOf(l) < 0);
  assert.ok(KS.kiemCau({ Loai: loaiChon, NoiDung: 'Hài lòng?', LuaChon: 'Có' }).loi);
  assert.deepStrictEqual(j(KS.kiemCau({ Loai: loaiChon, NoiDung: 'Hài lòng?', LuaChon: 'Có\r\n\n Không ' }).goi.LuaChon), ['Có', 'Không']);
  assert.deepStrictEqual(j(KS.kiemCau({ Loai: loaiChu, NoiDung: 'Góp ý', LuaChon: ['a', 'b'] }).goi.LuaChon), []);
  assert.strictEqual(KS.kiemCau({ Loai: loaiChu, NoiDung: 'Góp ý', maCH: 'CH007' }).goi.maCH, 'CH007');
});
kiem('kiemCau lỗi: loại lạ, rỗng, > 500, > 20 lựa chọn, nhóm > 60', () => {
  const l = KS.LOAI_CO_LUA_CHON[0];
  [{ Loai: 'xx', NoiDung: 'a' }, { Loai: l, NoiDung: ' ' }, { Loai: l, NoiDung: 'a'.repeat(501), LuaChon: ['a', 'b'] },
    { Loai: l, NoiDung: 'a', LuaChon: Array.from({ length: 21 }, (_, i) => 'L' + i) }, { Loai: l, NoiDung: 'a', LuaChon: ['a', 'b'], Nhom: 'n'.repeat(61) }]
    .forEach((du, i) => assert.ok(KS.kiemCau(du).loi, 'ca ' + i));
});
kiem('kiemQuyen: mã an toàn, vai Admin / QuanLyKS / "" (ngừng); vai lạ / mã lạ ➜ lỗi', () => {
  assert.deepStrictEqual(j(KS.kiemQuyen({ maNguoi: 'NV_01', hoTen: ' A ', vaiTro: '' }).goi), { maNguoi: 'NV_01', hoTen: 'A', vaiTro: '' });
  assert.ok(KS.kiemQuyen({ maNguoi: 'NV 01', vaiTro: 'Admin' }).loi);
  assert.ok(KS.kiemQuyen({ maNguoi: 'NV01', vaiTro: 'Sếp' }).loi);
  assert.ok(KS.kiemQuyen({ maNguoi: 'NV01', vaiTro: 'Admin', hoTen: 'a'.repeat(81) }).loi);
});
kiem('nutTrangThai: Đang mở ➜ Đóng; Đã đóng ➜ Mở lại / Về nháp; khác ➜ Mở', () => {
  assert.deepStrictEqual(Array.from(KS.nutTrangThai('Đang mở'), x => x[0]), ['Đã đóng']);
  assert.deepStrictEqual(Array.from(KS.nutTrangThai('Đã đóng'), x => x[0]), ['Đang mở', 'Nháp']);
  assert.deepStrictEqual(Array.from(KS.nutTrangThai('Nháp'), x => x[0]), ['Đang mở']);
});
