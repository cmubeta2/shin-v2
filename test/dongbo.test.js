/* v2.17.0 – Đồng bộ "lưu máy ⇄ Hub" (js/dongbo_v2.js) cho kho DuLieuV2 (HUB L31a/b) chạy trên máy chủ giả.
 * 2 "máy" dùng chung 1 máy chủ giả để thử tải về / gửi lên / xung đột phiên bản / ngoại tuyến / cổng chưa lên app. */
const { taoMayChuGia } = require('./may_chu_gia.js');
const TEP = ['js/api.js', 'js/dongbo_v2.js'];
const K = 'shin_mkt_bai';
function may(mc, token) {
  const app = napApp(TEP, { fetch: mc.fetch });
  if (token !== '') app.localStorage.setItem('shin_token', token || 'tok-thu');
  const toast = [];
  app.ShinApp.toast = (m, l) => toast.push([m, l]);
  const DB = app.lay('ShinDongBo');
  return { app, DB, toast, doc: () => JSON.parse(app.localStorage.getItem(K) || 'null'), ghi: v => app.localStorage.setItem(K, JSON.stringify(v)),
    meta: () => (JSON.parse(app.localStorage.getItem('shin_dbv2_meta') || '{}')).baiViet || {} };
}

mo('🔄 Đồng bộ DuLieuV2 – hàm THUẦN');
kiem('taoMaGui: ổn định theo nội dung, đúng mẫu hợp đồng, khác khi đổi nội dung / phiên bản', () => {
  const { DB } = may(taoMayChuGia());
  const a = DB.taoMaGui('baiViet', '', 0, { x: 1 }), b = DB.taoMaGui('baiViet', '', 0, { x: 1 });
  assert.strictEqual(a, b); assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(a), a);
  assert.notStrictEqual(a, DB.taoMaGui('baiViet', '', 0, { x: 2 }));
  assert.notStrictEqual(a, DB.taoMaGui('baiViet', 'baiViet-abc123', 1, { x: 1 }));
});
kiem('chonViec: bảng quyết định đủ 8 nhánh', () => {
  const { DB } = may(taoMayChuGia());
  const r = { ma: 'baiViet-x1y2z3', phienBan: 3, noiDung: { a: 1 } };
  const v = (m, rr, mm) => DB.chonViec(m, rr, mm).viec;
  assert.strictEqual(v({}, null, null), 'giu');
  assert.strictEqual(v({}, null, { a: 1 }), 'guiMoi');
  assert.strictEqual(v({}, r, {}), 'layMayChu');
  assert.strictEqual(v({}, r, { a: 1 }), 'nhan');
  assert.strictEqual(v({}, r, { a: 2 }), 'xungDot');
  assert.strictEqual(v({ ma: r.ma, phienBan: 2 }, r, { a: 2 }), 'layMayChu');
  assert.strictEqual(v({ ma: r.ma, phienBan: 2, chuaGui: true }, r, { a: 2 }), 'xungDot');
  assert.strictEqual(v({ ma: r.ma, phienBan: 3 }, r, { a: 2 }), 'giu');
  const q = DB.chonViec({ ma: r.ma, phienBan: 3, chuaGui: true }, r, { a: 2 });
  assert.strictEqual(q.viec, 'guiSua'); assert.strictEqual(q.phienBan, 3);
});

mo('🔄 Đồng bộ DuLieuV2 – sau cờ (cổng chưa lên app)');
kiem('cổng chưa có (hanh) ➜ giữ lưu máy, không báo lỗi, nhớ "chuaCo" – lần sau KHÔNG gọi máy chủ', async () => {
  const mc = taoMayChuGia({ boCong: ['webDocDuLieuV2', 'webGhiDuLieuV2'] });
  const A = may(mc); A.ghi({ b1: { chude: 'Bài 1' } });
  const r1 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r1.trangThai, 'may'); assert.strictEqual(A.DB.trangThaiCong(), 'chuaCo');
  assert.deepStrictEqual(A.doc(), { b1: { chude: 'Bài 1' } });
  const r2 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r2.trangThai, 'may'); assert.strictEqual(mc.nhatKy.length, 1);
  A.DB.danhDau('baiViet', K); A.DB.khiMo('baiViet', K);
  assert.strictEqual(mc.nhatKy.length, 1); assert.strictEqual(A.toast.length, 0);
  assert.strictEqual(A.DB.nhan('baiViet'), '');
  assert.strictEqual(A.meta().chuaGui, true);   // lên app rồi sẽ gửi phần đã sửa
});
kiem('không token (Demo) ➜ không gọi máy chủ', async () => {
  const mc = taoMayChuGia(); const A = may(mc, ''); A.ghi({ b: 1 });
  assert.strictEqual((await A.DB.dongBo('baiViet', K)).trangThai, 'may'); assert.strictEqual(mc.nhatKy.length, 0);
});

mo('🔄 Đồng bộ DuLieuV2 – máy chủ giả');
kiem('máy A có bài, Hub trống ➜ gửi mới (PhienBan 1); sửa ➜ gửi sửa (PhienBan 2), vẫn 1 dòng', async () => {
  const mc = taoMayChuGia(); const A = may(mc);
  A.ghi({ b1: { chude: 'Bài 1' } });
  const r1 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r1.trangThai, 'daGui', JSON.stringify(r1)); assert.strictEqual(r1.phienBan, 1);
  assert.strictEqual(mc.so.duLieuV2.length, 1); assert.strictEqual(A.meta().chuaGui, false);
  A.ghi({ b1: { chude: 'Bài 1 sửa' } }); A.DB.danhDau('baiViet', K);
  const r2 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r2.phienBan, 2); assert.strictEqual(mc.so.duLieuV2.length, 1);
  assert.strictEqual(mc.so.duLieuV2[0].noiDung.b1.chude, 'Bài 1 sửa');
  assert.ok(A.DB.nhan('baiViet').indexOf('Đã đồng bộ') >= 0);
  assert.strictEqual((await A.DB.dongBo('baiViet', K)).trangThai, 'dongBo');   // không đổi ➜ không ghi
  assert.strictEqual(mc.nhatKyGhi.length, 2);
});
kiem('máy B trống ➜ tải bản Hub về máy (doi = true để vẽ lại)', async () => {
  const mc = taoMayChuGia(); const A = may(mc), B = may(mc, 'tok-b');
  A.ghi({ b1: { chude: 'Chung' } }); await A.DB.dongBo('baiViet', K);
  const r = await B.DB.dongBo('baiViet', K);
  assert.strictEqual(r.trangThai, 'daTai'); assert.strictEqual(r.doi, true);
  assert.deepStrictEqual(B.doc(), { b1: { chude: 'Chung' } }); assert.strictEqual(B.meta().phienBan, 1);
});
kiem('Hub mới hơn, máy chưa sửa ➜ tự lấy bản Hub (không hỏi)', async () => {
  const mc = taoMayChuGia(); const A = may(mc), B = may(mc, 'tok-b');
  let hoi = 0; A.DB.datHoi(() => { hoi++; return 'may'; });
  A.ghi({ v: 1 }); await A.DB.dongBo('baiViet', K); await B.DB.dongBo('baiViet', K);
  B.ghi({ v: 2 }); B.DB.danhDau('baiViet', K); await B.DB.dongBo('baiViet', K);
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.trangThai, 'daTai'); assert.deepStrictEqual(A.doc(), { v: 2 }); assert.strictEqual(hoi, 0);
});
kiem('xung đột phiên bản – chọn "bản trên Hub" ➜ máy nhận bản Hub, Hub không đổi', async () => {
  const mc = taoMayChuGia(); const A = may(mc), B = may(mc, 'tok-b');
  A.ghi({ v: 1 }); await A.DB.dongBo('baiViet', K); await B.DB.dongBo('baiViet', K);
  B.ghi({ v: 'B' }); B.DB.danhDau('baiViet', K); await B.DB.dongBo('baiViet', K);
  A.ghi({ v: 'A' }); A.DB.danhDau('baiViet', K);
  let ban = null; A.DB.datHoi((loai, b) => { ban = b; return 'mayChu'; });
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.xungDot, true); assert.strictEqual(r.doi, true);
  assert.strictEqual(ban.phienBan, 2); assert.deepStrictEqual(A.doc(), { v: 'B' });
  assert.strictEqual(mc.so.duLieuV2[0].phienBan, 2); assert.strictEqual(A.meta().chuaGui, false);
});
kiem('xung đột phiên bản – chọn "bản máy này" ➜ ghi đè lên Hub đúng 1 lần (PhienBan 3)', async () => {
  const mc = taoMayChuGia(); const A = may(mc), B = may(mc, 'tok-b');
  A.ghi({ v: 1 }); await A.DB.dongBo('baiViet', K); await B.DB.dongBo('baiViet', K);
  B.ghi({ v: 'B' }); B.DB.danhDau('baiViet', K); await B.DB.dongBo('baiViet', K);
  A.ghi({ v: 'A' }); A.DB.danhDau('baiViet', K); A.DB.datHoi(() => 'may');
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.trangThai, 'daGui', JSON.stringify(r)); assert.strictEqual(r.phienBan, 3);
  assert.deepStrictEqual(mc.so.duLieuV2[0].noiDung, { v: 'A' }); assert.strictEqual(mc.so.duLieuV2.length, 1);
});
kiem('máy chủ trả xungDot lúc GHI (người khác vừa ghi chen) ➜ hỏi, chọn Hub ➜ máy nhận bản mới', async () => {
  const mc = taoMayChuGia(); const A = may(mc);
  A.ghi({ v: 1 }); await A.DB.dongBo('baiViet', K);
  // giả "chen ngang": Hub đã lên bản 5 nhưng lệnh đọc của A vẫn thấy bản 1 ➜ đi thẳng gui qua dòng Hub bị sửa sau khi đọc
  A.ghi({ v: 'A' }); A.DB.danhDau('baiViet', K);
  const goc = mc.so.duLieuV2[0];
  const fetch0 = A.app.fetch; let lan = 0;
  A.app.fetch = async (u, o) => { const res = await fetch0(u, o); if (++lan === 1) { goc.phienBan = 5; goc.noiDung = { v: 'C' }; } return res; };
  A.DB.datHoi(() => 'mayChu');
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.xungDot, true, JSON.stringify(r)); assert.deepStrictEqual(A.doc(), { v: 'C' }); assert.strictEqual(A.meta().phienBan, 5);
});
kiem('mất mạng ➜ ngoại tuyến, bản máy giữ nguyên, còn "chưa gửi"; có mạng lại ➜ gửi', async () => {
  const mc = taoMayChuGia({ matMangLan: 1 }); const A = may(mc);
  A.ghi({ v: 1 }); A.DB.danhDau('baiViet', K);
  const r1 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r1.trangThai, 'ngoaiTuyen'); assert.deepStrictEqual(A.doc(), { v: 1 }); assert.strictEqual(A.meta().chuaGui, true);
  assert.strictEqual((await A.DB.dongBo('baiViet', K)).trangThai, 'daGui'); assert.strictEqual(mc.so.duLieuV2.length, 1);
});
kiem('mất trả lời sau khi Hub đã ghi ➜ lần sau không tạo dòng thứ 2 (nhận lại mã)', async () => {
  const mc = taoMayChuGia(); const A = may(mc);
  const fetch0 = A.app.fetch; let lan = 0;   // lần 1 = đọc (được), lần 2 = ghi (Hub ĐÃ ghi, trả lời mất giữa đường)
  A.app.fetch = async (u, o) => { const res = await fetch0(u, o); if (++lan === 2) throw new TypeError('Failed to fetch'); return res; };
  A.ghi({ v: 1 });
  assert.strictEqual((await A.DB.dongBo('baiViet', K)).trangThai, 'ngoaiTuyen');
  assert.strictEqual(mc.so.duLieuV2.length, 1); assert.strictEqual(A.meta().ma, undefined);
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.trangThai, 'dongBo', JSON.stringify(r)); assert.strictEqual(mc.so.duLieuV2.length, 1);
  assert.strictEqual(A.meta().ma, mc.so.duLieuV2[0].ma);
});
kiem('tường lửa: bài có CCCD ➜ chặn ở trình duyệt, không gửi, báo lỗi; SĐT ➜ Hub chặn', async () => {
  const mc = taoMayChuGia(); const A = may(mc);
  A.ghi({ b: { noiDung: 'Mã ' + '0'.repeat(12) } });
  const r = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r.trangThai, 'loi'); assert.strictEqual(r.loi, 'khongduavao'); assert.strictEqual(mc.nhatKyGhi.length, 0);
  A.ghi({ b: { noiDung: 'Gọi 09' + '00 000 000' } });
  const r2 = await A.DB.dongBo('baiViet', K);
  assert.strictEqual(r2.trangThai, 'loi'); assert.ok(/số điện thoại/.test(r2.chiTiet), r2.chiTiet);
});
kiem('taiKhoanQR người thường ➜ lỗi quyền, không đổi bản máy', async () => {
  const mc = taoMayChuGia(); const A = may(mc);
  A.app.localStorage.setItem('shin_qr', JSON.stringify({ nganHang: 'X' }));
  const r = await A.DB.dongBo('taiKhoanQR', 'shin_qr');
  assert.strictEqual(r.trangThai, 'loi'); assert.strictEqual(r.loi, 'quyen');
  assert.deepStrictEqual(JSON.parse(A.app.localStorage.getItem('shin_qr')), { nganHang: 'X' });
});

mo('🔄 Đồng bộ DuLieuV2 – gắn vào màn');
kiem('📣 Marketing ghiKho / ghiHS + 🎓 LMS ghiLms ➜ đánh dấu chưa gửi, cổng chưa có thì không lỗi', async () => {
  const mc = taoMayChuGia({ boCong: ['webDocDuLieuV2', 'webGhiDuLieuV2'] });
  const app = napApp(['js/api.js', 'js/dongbo_v2.js', 'js/modules/marketing.js', 'js/modules/tuyensinh.js'], { fetch: mc.fetch });
  app.localStorage.setItem('shin_token', 'tok-thu');
  const toast = []; app.ShinApp.toast = (m, l) => toast.push([m, l]);
  const DB = app.lay('ShinDongBo'), MK = app.lay('ModuleMarketing'), TS = app.lay('ModuleTuyenSinh');
  await DB.dongBo('baiViet', 'shin_mkt_bai');   // dò cổng ➜ chuaCo
  assert.strictEqual(MK.ghiKho({ b1: { chude: 'x' } }), true);
  assert.strictEqual(MK.ghiHS([{ id: 'p1', reach: 10 }]), true);
  assert.strictEqual(TS.ghiLms({ diemDanh: {}, baiXong: {} }), true);
  const meta = JSON.parse(app.localStorage.getItem('shin_dbv2_meta'));
  assert.strictEqual(meta.baiViet.chuaGui, true); assert.strictEqual(meta.chiSoKenh.chuaGui, true); assert.strictEqual(meta.diemDanh.chuaGui, true);
  assert.strictEqual(toast.length, 0); assert.strictEqual(mc.nhatKy.length, 1);
});
