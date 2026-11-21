/* Kiểm 🧠 Tri thức: tìm trên máy (M9.2), đồ thị [[wiki-links]] (M9.3), nối sẵn HUB L33 webTimTriThuc / webDoThiTriThuc (v2.16.4). */
const { taoMayChuGia } = require('./may_chu_gia.js');
const DS = [
  { ma: 'SOP01', ten: 'Quy trình tiếp đón', linhVuc: 'Khám bệnh', tomTat: 'Xem [[SOP02|thu phí]] và [[Chưa viết]]', lienKet: [] },
  { ma: 'SOP02', ten: 'Thu phí dịch vụ', linhVuc: 'Tài chính', tomTat: 'Hoàn tiền theo [[SOP01]]', lienKet: ['Quy trình tiếp đón'] },
  { ma: 'HD03', ten: 'Hướng dẫn báo cáo', linhVuc: 'Khám bệnh', tomTat: 'Mẫu tuần', lienKet: ['SOP01'] }
];
const TT = napApp(['js/modules/trithuc.js']).lay('ModuleTriThuc');

mo('Tri thức – trên máy');
kiem('timKiem: không dấu, mọi từ phải khớp, mã / tên điểm cao hơn, lọc lĩnh vực', () => {
  assert.deepStrictEqual(Array.from(TT.timKiem(DS, 'quy trinh'), t => t.ma), ['SOP01']);
  assert.deepStrictEqual(Array.from(TT.timKiem(DS, 'sop01'), t => t.ma), ['SOP01', 'SOP02']);
  assert.strictEqual(TT.timKiem(DS, '', 'Khám bệnh').length, 2);
  assert.strictEqual(TT.timKiem(DS, 'quy hoan').length, 0);
  assert.strictEqual(TT.timKiem(DS, 'quy thu').length, 1, 'chữ trong tóm tắt cũng tính');
});
kiem('phanTichLienKet: ra / ngược / treo, bỏ trùng + bí danh', () => {
  const g = TT.phanTichLienKet(DS);
  assert.deepStrictEqual(Array.from(g.ra.SOP01), ['SOP02']);
  assert.deepStrictEqual(Array.from(g.ra.SOP02), ['SOP01']);
  assert.deepStrictEqual(Array.from(g.vao.SOP01).sort(), ['HD03', 'SOP02']);
  assert.deepStrictEqual(Array.from(g.treo.SOP01), ['Chưa viết']);
  assert.strictEqual(g.canh.length, 3);
});

mo('Tri thức – HUB L33 (máy chủ)');
kiem('tuDoThiMayChu: cùng khuôn phanTichLienKet; bỏ cạnh lạ / tự trỏ / trùng', () => {
  const g = TT.tuDoThiMayChu({ canh: [{ tu: 'SOP01', den: 'SOP02' }, { tu: 'SOP01', den: 'SOP02' }, { tu: 'SOP02', den: 'SOP02' }, { tu: 'X9', den: 'SOP01' }, { tu: 'HD03', den: 'SOP01' }],
    treo: [{ tu: 'SOP01', den: 'Chưa viết' }, { tu: 'SOP01', den: 'Chưa viết' }, { tu: 'X9', den: 'a' }] }, DS);
  assert.deepStrictEqual(Array.from(g.canh, c => c.join('>')), ['SOP01>SOP02', 'HD03>SOP01']);
  assert.deepStrictEqual(Array.from(g.vao.SOP01), ['HD03']);
  assert.deepStrictEqual(Array.from(g.treo.SOP01), ['Chưa viết']);
  assert.strictEqual(TT.tuDoThiMayChu(null, DS).canh.length, 0);
});
kiem('hopKetQua: máy chủ lên trước (kể cả bài chỉ khớp liên kết), rồi bài lọc trên máy, đúng lĩnh vực, không trùng', () => {
  const loc = [DS[0]];
  const r = TT.hopKetQua(loc, [{ ma: 'HD03', diem: 5 }, { ma: 'SOP02', diem: 2 }, { ma: 'KHONG', diem: 1 }], DS, '');
  assert.deepStrictEqual(Array.from(r, t => t.ma), ['HD03', 'SOP02', 'SOP01']);
  assert.deepStrictEqual(Array.from(TT.hopKetQua(loc, [{ ma: 'SOP02' }, { ma: 'HD03' }], DS, 'Khám bệnh'), t => t.ma), ['HD03', 'SOP01']);
  assert.deepStrictEqual(Array.from(TT.hopKetQua(loc, null, DS, ''), t => t.ma), ['SOP01']);
});
function appLive(cong) {
  const mc = taoMayChuGia({ cong });
  const app = napApp(['js/api.js', 'js/modules/trithuc.js'], { fetch: mc.fetch });
  app.localStorage.setItem('shin_token', 'tok-thu');
  return app.lay('ModuleTriThuc');
}
const webTriThuc = () => ({ ok: true, capNhat: '21/11/2026', taiLieu: DS });
kiem('taiLive: L33 chưa lên app ➜ congL33 "hanh", doThi null, danh sách vẫn là số thật', async () => {
  const r = await appLive({ webTriThuc }).taiLive();
  assert.ok(r.ok); assert.strictEqual(r.data.taiLieu.length, 3);
  assert.strictEqual(r.data.congL33, 'hanh'); assert.strictEqual(r.data.doThi, null);
});
kiem('taiLive: L33 có ➜ congL33 "ok" + doThi; chỉ mục hỏng ➜ "loi"', async () => {
  const r = await appLive({ webTriThuc, webDoThiTriThuc: () => ({ ok: true, nut: [], canh: [{ tu: 'SOP01', den: 'SOP02' }], treo: [] }) }).taiLive();
  assert.strictEqual(r.data.congL33, 'ok'); assert.strictEqual(r.data.doThi.canh.length, 1);
  const r2 = await appLive({ webTriThuc, webDoThiTriThuc: () => ({ ok: true, nut: [], canh: [], treo: [], loi: 'Chưa có chỉ mục.' }) }).taiLive();
  assert.strictEqual(r2.data.congL33, 'loi'); assert.strictEqual(r2.data.doThi, null);
});
