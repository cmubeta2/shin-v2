/* Kiểm 🛡️ Quản trị: ma trận quyền (M0.2), tab ⚙️ Động cơ M1.6 – HUB L32 webNhatKyTacVu (v2.16.5). */
const { taoMayChuGia } = require('./may_chu_gia.js');
const app = napApp(['js/demo_data.js', 'js/modules/quantri.js']);
const QT = app.lay('ModuleQuanTri');

mo('Quản trị – ma trận quyền M0.2');
kiem('chỉ Admin Hub / phụ trách mảng TC / app riêng / mọi người', () => {
  const h = QT.maTranQuyen([{ ma: 'crm', ten: 'CRM' }, { ma: 'taichinh', ten: 'TC' }, { ma: 'kpi', ten: 'KPI', mayChu: 'KPI' }, { ma: 'trithuc', ten: 'TT', mayChu: 'HUB' }],
    [{ ma: 'TC', dsMa: ['90001'] }]);
  const o = Object.fromEntries(Array.from(h, x => [x.ma, x.o]));
  assert.strictEqual(o.crm['Người dùng'], 'khong'); assert.strictEqual(o.crm.Admin, 'co');
  assert.strictEqual(o.taichinh['Quản lý'], 'pt');
  assert.strictEqual(o.kpi.Admin, 'app');
  assert.strictEqual(o.trithuc['Người dùng'], 'co');
});

mo('Quản trị – ⚙️ Động cơ M1.6 (HUB L32)');
kiem('tomTatDongCo: tổng hàng đợi (không tính ⏸), xếp app tồn nhiều trước, số lạ ➜ 0', () => {
  const t = QT.tomTatDongCo({ capNhat: '21/11/2026 16:15', khoa: { dangChay: 1, tacVu: 'shin-viet-code', tu: '21/11 16:00' },
    luot: [{ luc: 'a', tacVu: 'x' }, {}, null],
    hangDoi: [{ app: 'KPI', choKH: 1 }, { app: 'HUB', choKH: 1, daCode: '3', traLai: -2, tam: 5 }, { app: 'PK', kiemDat: 'abc' }] });
  assert.deepStrictEqual(Array.from(t.hangDoi, h => h.app + ':' + h.tong), ['HUB:4', 'KPI:1', 'PK:0']);
  assert.strictEqual(t.hangDoi[0].traLai, 0); assert.strictEqual(t.hangDoi[0].tam, 5);
  assert.strictEqual(t.tongViec, 5); assert.strictEqual(t.luot.length, 1);
  assert.strictEqual(t.khoa.dangChay, true);
});
kiem('tomTatDongCo: bỏ chuỗi giống đường dẫn máy / khóa (hợp đồng cấm trả), cắt 120 ký tự', () => {
  const t = QT.tomTatDongCo({ khoa: { dangChay: true, tacVu: 'D:\\Hyrta\\x', tu: '/d/abc' }, luot: [{ luc: 'C:/Users/a', tacVu: 'AKfy' + 'x'.repeat(30) }, { luc: 'b', tacVu: 'y'.repeat(200) }] });
  assert.strictEqual(t.khoa.tacVu, ''); assert.strictEqual(t.khoa.tu, '');
  assert.strictEqual(t.luot.length, 1); assert.strictEqual(t.luot[0].tacVu.length, 120);
});
kiem('tomTatDongCo: rỗng / null không vỡ; giữ câu loi của máy chủ', () => {
  const t = QT.tomTatDongCo(null);
  assert.strictEqual(t.khoa, null); assert.strictEqual(t.hangDoi.length, 0);
  assert.strictEqual(QT.tomTatDongCo({ loi: 'Chưa có nhật ký – máy chưa đồng bộ' }).loi, 'Chưa có nhật ký – máy chưa đồng bộ');
});
kiem('veDongCo Demo dùng dữ liệu mẫu, có ghi MẪU', () => {
  const h = QT.veDongCo(app.window.SHIN_DEMO_DATA.quantri);
  assert.ok(h.includes('MẪU') && h.includes('shin-v2-viet-code') && h.includes('HÀNG ĐỢI'));
});
function appLive(cong) {
  const mc = taoMayChuGia({ cong });
  const a = napApp(['js/api.js', 'js/modules/quantri.js'], { fetch: mc.fetch });
  a.localStorage.setItem('shin_token', 'tok-thu');
  return a.lay('ModuleQuanTri');
}
kiem('taiDongCo: L32 chưa lên app ➜ dải vàng "Còn chờ v1"', async () => {
  const q = appLive({});
  await q.taiDongCo();
  assert.strictEqual(q._nk.loi, 'hanh');
  assert.ok(q.veDongCo({ live: true }).includes('Còn chờ v1'));
});
kiem('taiDongCo: L32 có ➜ số thật; không phải Admin ➜ báo lỗi quyền đỏ', async () => {
  const q = appLive({ webNhatKyTacVu: (tk, du) => ({ ok: true, capNhat: '21/11/2026 16:30', khoa: { dangChay: false }, luot: [{ luc: '21/11/2026 16:12', tacVu: 'shin-v2-viet-code' }].slice(0, du.soDong), hangDoi: [] }) });
  await q.taiDongCo();
  const h = q.veDongCo({ live: true });
  assert.ok(h.includes('Rảnh') && h.includes('shin-v2-viet-code') && !h.includes('MẪU'));
  const q2 = appLive({ webNhatKyTacVu: () => { const e = new Error('Chỉ Admin.'); e.quyen = true; throw e; } });
  await q2.taiDongCo();
  assert.strictEqual(q2._nk.loi, 'quyen'); assert.ok(q2.veDongCo({ live: true }).includes('canh-bao-nguon loi'));
});
