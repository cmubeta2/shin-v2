/* Kiểm hàm THUẦN 🎓 Tuyển sinh + LMS mini M4.5 + ⚙️ Cài đặt (link bot Telegram) + 🌐 Phễu landing (link / hỏi đáp / kiểm xuất). */
const app = napApp(['js/modules/tuyensinh.js', 'js/modules/caidat_module.js', 'js/modules/marketing.js', 'js/modules/pheu_lanbien.js']);
const TS = app.lay('ModuleTuyenSinh'), CD = app.lay('ModuleCaiDat'), PL = app.lay('PheuLanBien');
// Dữ liệu giả ghép lúc chạy (repo không chứa chuỗi giống SĐT thật).
const DUOI = '00' + '000';

mo('Tuyển sinh – chuẩn SĐT (như v1 chuanSDT)');
kiem('bỏ khoảng trắng / . / - / (), +84 / 84 ➜ 0; đầu số 03/05/07/08/09', () => {
  assert.strictEqual(TS.chuanSDT('09' + '0 ' + DUOI.slice(0, 3) + '.' + DUOI.slice(3) + '00'), '09' + '0' + DUOI + '00');
  assert.strictEqual(TS.chuanSDT('+84 9' + '0' + DUOI + '00'), '09' + '0' + DUOI + '00');
  assert.strictEqual(TS.chuanSDT('849' + '0' + DUOI + '00'), '09' + '0' + DUOI + '00');
  assert.strictEqual(TS.chuanSDT('(03' + '0)' + DUOI + '00'), '03' + '0' + DUOI + '00');
});
kiem('sai đầu số / thiếu / thừa số / rỗng ➜ ""', () => {
  ['01' + '0' + DUOI + '00', '09' + DUOI + '0', '09' + '0' + DUOI + '000', '', null, 'abc'].forEach(s => assert.strictEqual(TS.chuanSDT(s), '', String(s)));
});

mo('LMS mini M4.5');
kiem('chuyenCan: chỉ buổi của lớp, % làm tròn, cảnh báo < 80% (ngưỡng đổi được)', () => {
  const dd = { 'L1|01/11': ['An', 'Bình'], 'L1|08/11': ['An'], 'L1|15/11': ['An', 'Bình'], 'L2|01/11': ['Bình'] };
  const k = TS.chuyenCan(dd, 'L1', ['An', 'Bình', 'Chi']);
  assert.deepStrictEqual(k.map(x => [x.ten, x.co, x.tong, x.phanTram, x.canhBao]),
    [['An', 3, 3, 100, false], ['Bình', 2, 3, 67, true], ['Chi', 0, 3, 0, true]]);
  assert.strictEqual(TS.chuyenCan(dd, 'L1', ['Bình'], 60)[0].canhBao, false);
});
kiem('chuyenCan: lớp chưa có buổi ➜ phanTram null, không cảnh báo', () => {
  const k = TS.chuyenCan({}, 'L9', ['An']);
  assert.strictEqual(k[0].phanTram, null); assert.strictEqual(k[0].canhBao, false);
});
kiem('tienDoBai: đếm bài xong, %, bài kế theo thứ tự; xong hết ➜ ke null', () => {
  const ds = [{ ma: 'M01' }, { ma: 'M02' }, { ma: 'M03' }];
  assert.deepStrictEqual(JSON.parse(JSON.stringify(TS.tienDoBai(['M01', 'M03', 'M99'], ds))), { xong: 2, tong: 3, phanTram: 67, ke: 'M02' });
  assert.strictEqual(TS.tienDoBai(['M01', 'M02', 'M03'], ds).ke, null);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(TS.tienDoBai(null, null))), { xong: 0, tong: 0, phanTram: 0, ke: null });
});

mo('⚙️ Cài đặt – link bot Telegram');
kiem('chỉ nhận https://t.me/<bot>?start=<mã>', () => {
  assert.strictEqual(CD.linkTGHopLe('https://t.me/shin_hub_bot?start=AbC_12-3'), true);
  ['http://t.me/shin_hub_bot?start=abcd', 'https://t.me.evil.com/shin_hub_bot?start=abcd', 'https://t.me/abc?start=abcd',
    'https://t.me/shin_hub_bot?start=ab', 'https://t.me/shin_hub_bot?start=abcd&x=1', '', null]
    .forEach(l => assert.strictEqual(CD.linkTGHopLe(l), false, String(l)));
});

mo('🌐 Phễu landing – THUẦN');
kiem('tachHoiDap: "hỏi | đáp", bỏ dòng thiếu | hoặc thiếu vế', () => {
  assert.deepStrictEqual(JSON.parse(JSON.stringify(PL.tachHoiDap('A? | B\nkhông có gạch\n| thiếu hỏi\nC?|D | E'))),
    [{ h: 'A?', d: 'B' }, { h: 'C?', d: 'D | E' }]);
});
kiem('linkHopLe: https / tel / mailto; javascript: và chuỗi có dấu nháy ➜ ""', () => {
  assert.strictEqual(PL.linkHopLe(' https://vi.du/trang '), 'https://vi.du/trang');
  assert.strictEqual(PL.linkHopLe('tel:+84 2' + '9 3' + '8'), 'tel:+842938');
  assert.strictEqual(PL.linkHopLe('mailto:a@b.vn'), 'mailto:a@b.vn');
  ['javascript:alert(1)', 'https://x"onmouseover=1.vn', 'ftp://a.b', 'https://khongcocham', ''].forEach(u => assert.strictEqual(PL.linkHopLe(u), '', u));
});
kiem('kiem: bộ mẫu còn chữ "MẪU" ➜ báo lỗi; trống ➜ liệt kê trường thiếu; doSau 0% khi trống', () => {
  const mau = PL.MAU[Object.keys(PL.MAU)[0]];
  const k = PL.kiem(Object.assign({ tenTrang: 'x' }, mau));
  assert.ok(k.loi.some(l => /MẪU/.test(l)), JSON.stringify(k.loi));
  const r = PL.kiem({});
  assert.ok(r.thieu.indexOf('Tên trang') >= 0 && r.thieu.length > 1);
  assert.ok(PL.doSau({}).every(t => t.pt === 0 || t.pt === 100));
});
kiem('kiem: link nút sai ➜ lỗi; hỏi đáp thiếu | ➜ cảnh báo', () => {
  const r = PL.kiem({ ctaLink: 'javascript:x', hoiDap: 'a | b\nthiếu' });
  assert.strictEqual(r.loi.length, 2, JSON.stringify(r.loi));
});
