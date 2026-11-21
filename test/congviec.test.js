/* Kiểm hàm THUẦN 📋 Công việc (M7.1–M7.4), 🗂️ Dự án (M6.3 vướng mắc ➜ Task Bus, bài học M9), tường lửa M9.5 (api.js). */
const app = napApp(['js/api.js', 'js/modules/congviec.js', 'js/modules/duan.js']);
const CV = app.lay('ModuleCongViec'), DA = app.lay('ModuleDuAn'), API = app.lay('SHIN_API');
// Dữ liệu giả sinh lúc chạy (repo không chứa chuỗi giống SĐT / CCCD / BHYT thật).
const CCCD = '1'.repeat(12), BHYT = 'DN4' + '0'.repeat(12), SDT = '09' + '00.000.' + '000';
const NAY = new Date(2026, 10, 21, 10, 0, 0);

mo('Tường lửa M9.5 – soatKhongDuaVao');
kiem('sạch ➜ null; không chặn SĐT (CRM cần), năm, số tiền', () => {
  assert.strictEqual(API.soatKhongDuaVao({ a: 'Họp 15 ca năm 2026, chi 12.500.000 đ', sdt: SDT.split('.').join(' ') }), null);
});
kiem('chặn CCCD / BHYT / khóa API / token Telegram / token Hub, báo đúng ô', () => {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(API.soatKhongDuaVao({ lyDo: 'cccd ' + CCCD }))), { loai: 'số CCCD', truong: 'lyDo' });
  assert.strictEqual(API.soatKhongDuaVao({ x: 'the ' + BHYT }).loai, 'mã thẻ BHYT');
  assert.strictEqual(API.soatKhongDuaVao({ x: 'sk-ant-' + 'A1b2C3d4'.repeat(4) }).loai, 'khóa API');
  assert.strictEqual(API.soatKhongDuaVao({ x: '123456789:' + 'A'.repeat(35) }).loai, 'token Telegram Bot');
  assert.strictEqual(API.soatKhongDuaVao({ x: 'h1.abc.def.' + 'z'.repeat(20) }).loai, 'token đăng nhập');
});
kiem('soát lồng trong mảng / đối tượng; mảng giữ tên ô cha; không trả lại giá trị vi phạm', () => {
  const r = API.soatKhongDuaVao({ ds: [{ ghiChu: 'ok' }, { ghiChu: 'cccd ' + CCCD }] });
  assert.strictEqual(r.truong, 'ghiChu');
  assert.ok(!JSON.stringify(r).includes(CCCD));
  assert.strictEqual(API.soatKhongDuaVao(null), null);
  assert.strictEqual(API.soatKhongDuaVao(Number('9'.repeat(14))), null);
});

mo('Công việc – hạn & SLA');
kiem('docHan: dd/mm, dd/mm/yyyy, hh:mm, hôm nay, xong, sai', () => {
  assert.strictEqual(CV.docHan('25/11/2026', NAY).getDate(), 25);
  assert.strictEqual(CV.docHan('25/12', NAY).getMonth(), 11);
  assert.strictEqual(CV.docHan('14h30', NAY).getHours(), 14);
  assert.strictEqual(CV.docHan('Hôm nay', NAY).getHours(), 23);
  assert.strictEqual(CV.docHan('đã xong', NAY), null);
  assert.strictEqual(CV.docHan('32/01', NAY), null);
  assert.strictEqual(CV.docHan('13/13', NAY), null);
});
kiem('mucSla: xong / do / vang (≤ 4 giờ) / xanh / xam', () => {
  assert.strictEqual(CV.mucSla({ han: '20/11/2026' }, 'hoanTat', NAY), 'xong');
  assert.strictEqual(CV.mucSla({ han: '20/11/2026' }, 'dangLam', NAY), 'do');
  assert.strictEqual(CV.mucSla({ han: '13:00' }, '', NAY), 'vang');
  assert.strictEqual(CV.mucSla({ han: 'đang diễn ra' }, '', NAY), 'vang');
  assert.strictEqual(CV.mucSla({ han: '30/11/2026' }, '', NAY), 'xanh');
  assert.strictEqual(CV.mucSla({ han: '' }, '', NAY), 'xam');
});

mo('Công việc – phân luồng RBAC M7.3');
kiem('maTuNguon: Mảng n, 0B, Tầng 0, lạ', () => {
  assert.strictEqual(CV.maTuNguon('Mảng 6 (Dự án)'), 'duan');
  assert.strictEqual(CV.maTuNguon('Mảng 8 (Marketing)'), 'marketing');
  assert.strictEqual(CV.maTuNguon('0B Phê duyệt'), 'pheduyet');
  assert.strictEqual(CV.maTuNguon('Tầng 0 (Core)'), 'quantri');
  assert.strictEqual(CV.maTuNguon('Mảng 0'), '');
  assert.strictEqual(CV.maTuNguon(null), '');
});
kiem('laCuaToi: họ tên đủ, mã NV, gọi tắt "chị Thư", không nhầm tên khác', () => {
  const n = { hoTen: 'Nguyễn Thị Minh Thư', maNV: 'NV007' };
  assert.ok(CV.laCuaToi('Nguyễn Thị Minh Thư', n));
  assert.ok(CV.laCuaToi('NV007, NV008', n));
  assert.ok(CV.laCuaToi('Sếp Tâm & chị Thư', n));
  assert.ok(!CV.laCuaToi('chị Hà', n));
  assert.ok(!CV.laCuaToi('Thư', n), 'tên trần không có tiền tố gọi ➜ không tính');
  assert.ok(!CV.laCuaToi('NV0071', n));
  assert.ok(!CV.laCuaToi('x', null));
});
kiem('phanLuong: ẩn việc mảng không có quyền, việc không rõ mảng vẫn hiện', () => {
  const ds = [{ it: { nguon: 'Mảng 3 (Tài chính)', nguoi: 'NV007' } }, { it: { nguon: 'Mảng 6', nguoi: 'chị Thư' } }, { it: { nguon: 'khác', nguoi: '' } }];
  const k = CV.phanLuong(ds, { hoTen: 'Lê Thư', maNV: 'NV007' }, ma => ma !== 'taichinh');
  assert.strictEqual(k.an, 1); assert.strictEqual(k.duocXem.length, 2); assert.strictEqual(k.cuaToi.length, 1);
  assert.strictEqual(CV.phanLuong(ds, null, null).duocXem.length, 3);
});

mo('Công việc – kiemViec (luật Hub kiemViecLT + M9.5)');
kiem('hợp lệ ➜ goi đủ trường, gộp khoảng trắng', () => {
  const k = CV.kiemViec({ nguon: 'DuAn', muc: 'gap', tieuDe: '  Gọi   nhà thầu ', han: '2026-11-30', nguoiNhan: 'NV001' });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(k.goi)), { nguon: 'duan', loai: 'v2', muc: 'gap', tieuDe: 'Gọi nhà thầu', han: '2026-11-30', nguoiNhan: 'NV001' });
});
kiem('hanHop: trống ➜ "", sai ngày ➜ null', () => {
  assert.strictEqual(CV.hanHop(''), ''); assert.strictEqual(CV.hanHop('2026-02-30'), null); assert.strictEqual(CV.hanHop('30/11/2026'), null);
});
kiem('nguồn lạ / mức lạ / thiếu tiêu đề / > 200 ký tự / hạn sai / người nhận lạ ➜ lỗi', () => {
  assert.ok(CV.kiemViec({ nguon: 'abc', tieuDe: 'x' }).loi);
  assert.ok(CV.kiemViec({ nguon: 'duan', muc: 'cao', tieuDe: 'x' }).loi);
  assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: '  ' }).loi);
  assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: 'a'.repeat(201) }).loi);
  assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: 'x', han: '2026-13-01' }).loi);
  assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: 'x', nguoiNhan: 'Chị Thư' }).loi);
});
kiem('tường lửa: SĐT có dấu chấm, CCCD, BHYT, "BN" ➜ chặn; "BNA" không chặn', () => {
  ['Gọi ' + SDT, 'CCCD ' + CCCD, 'Thẻ ' + BHYT, 'Hỏi BN phòng 3'].forEach(t =>
    assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: t }).loi, t));
  assert.ok(CV.kiemViec({ nguon: 'duan', tieuDe: 'Gửi BNA báo cáo năm 2026' }).goi);
});

mo('Dự án – vướng mắc ➜ Task Bus M6.3, bài học');
kiem('Cao ➜ gấp, bỏ thẻ HTML, hạn còn ➜ yyyy-mm-dd, gói qua được kiemViec', () => {
  const v = DA.vuongMacThanhViec({ vanDe: '<b>Thiếu</b>&nbsp;máy &amp; vật tư', muc: 'cao', han: '5/12/2026' }, NAY);
  assert.strictEqual(v.tieuDe, '[Vướng mắc] Thiếu máy & vật tư');
  assert.strictEqual(v.muc, 'gap'); assert.strictEqual(v.han, '2026-12-05');
  assert.ok(CV.kiemViec(v).goi);
});
kiem('quá hạn / ngày sai ➜ hạn trống; hôm nay vẫn giữ; dài ➜ cắt 200', () => {
  assert.strictEqual(DA.vuongMacThanhViec({ vanDe: 'x', han: '20/11/2026' }, NAY).han, '');
  assert.strictEqual(DA.vuongMacThanhViec({ vanDe: 'x', han: '31/11/2026' }, NAY).han, '');
  assert.strictEqual(DA.vuongMacThanhViec({ vanDe: 'x', han: '21/11/2026' }, NAY).han, '2026-11-21');
  assert.strictEqual(DA.vuongMacThanhViec({ vanDe: 'a'.repeat(300) }, NAY).tieuDe.length, 200);
  assert.strictEqual(DA.vuongMacThanhViec({}, NAY).tieuDe, '');
});
kiem('maGuiBaiHoc ổn định theo nội dung, đúng luật Hub', () => {
  const b = { chuDe: 'Nhân sự', vanDe: 'Thiếu người ca đêm', cachLam: 'Xếp lịch xoay vòng' };
  assert.strictEqual(DA.maGuiBaiHoc(b), DA.maGuiBaiHoc(Object.assign({}, b)));
  assert.notStrictEqual(DA.maGuiBaiHoc(b), DA.maGuiBaiHoc(Object.assign({}, b, { cachLam: 'Khác' })));
  assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(DA.maGuiBaiHoc(b)));
});
