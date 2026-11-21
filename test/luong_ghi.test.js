/* Luồng GHI của v2 chạy qua máy chủ Hub giả (test/may_chu_gia.js) – thay cho thử bằng token thật ở lượt tự động.
 * Gói gửi dựng bằng đúng hàm THUẦN của màn (kiemDeXuat / kiemViec / kiemTuongTac / kiemBaiHoc) rồi đi qua SHIN_API.goi
 * (tường lửa M9.5 phía trình duyệt ➜ POST text/plain ➜ máy chủ giả ➜ bóc {ok, du}). Toast Hoàn tác 6s cần DOM – không kiểm ở đây. */
const { taoMayChuGia } = require('./may_chu_gia.js');
const TEP = ['js/api.js', 'js/modules/taichinh.js', 'js/modules/congviec.js', 'js/modules/duan.js', 'js/modules/crm.js'];
function dung(tuyChon, token) {
  const mc = taoMayChuGia(tuyChon);
  const app = napApp(TEP, { fetch: mc.fetch });
  if (token !== '') app.localStorage.setItem('shin_token', token || 'tok-thu');
  return { mc, app, API: app.lay('SHIN_API'), TC: app.lay('ModuleTaiChinh'), CV: app.lay('ModuleCongViec'), DA: app.lay('ModuleDuAn'), CRM: app.lay('ModuleCRM') };
}
const NAY = new Date(2026, 10, 21, 10, 0, 0);

mo('Máy chủ giả – giao thức cuaWebPost_');
kiem('không token ➜ Demo, không gọi máy chủ', async () => {
  const { mc, API } = dung({}, '');
  const r = await API.goi('HUB', 'webGuiDeXuatChi', { khoanMuc: 'x' });
  assert.strictEqual(r.isDemo, true); assert.strictEqual(mc.nhatKy.length, 0);
});
kiem('cổng chưa mở ➜ loi hanh; không quyền ➜ loi quyen; mất mạng ➜ loi mang', async () => {
  assert.strictEqual((await dung().API.goi('HUB', 'webCongLa', {})).loi, 'hanh');
  assert.strictEqual((await dung({}, 'khong-quyen').API.goi('HUB', 'webDayViec', {})).loi, 'quyen');
  assert.strictEqual((await dung({ matMang: true }).API.goi('HUB', 'webDayViec', {})).loi, 'mang');
});
kiem('thân hỏng ➜ dang; thiếu token ➜ token (đúng thứ tự chonCongWeb_)', () => {
  const mc = taoMayChuGia();
  assert.strictEqual(mc.xuLy(null).loi, 'dang');
  assert.strictEqual(mc.xuLy({ hanh: 'webDayViec', du: {} }).loi, 'token');
  assert.strictEqual(mc.xuLy({ hanh: 'webKhong', token: 't' }).loi, 'hanh');
});

mo('💰 Đề xuất chi ➜ 0B (HUB L26)');
kiem('gửi 2 lần cùng maGui ➜ đúng 1 phiếu (moi true rồi false)', async () => {
  const { mc, API, TC } = dung();
  const k = TC.kiemDeXuat({ loai: 'Tạm ứng', khoanMuc: 'Công tác tỉnh', soTien: '2.000.000', lyDo: 'Khảo sát điểm khám', hanHoanUng: '30/11/2026' }, API.soatKhongDuaVao, '21/11/2026');
  const du = Object.assign({}, k.goi, { maGui: TC.taoMaGui(Date.UTC(2026, 10, 21), 'ab12') });
  const r1 = await API.goi('HUB', 'webGuiDeXuatChi', du), r2 = await API.goi('HUB', 'webGuiDeXuatChi', du);
  assert.ok(r1.ok && r1.data.moi === true, JSON.stringify(r1));
  assert.ok(r2.ok && r2.data.moi === false && r2.data.ma === r1.data.ma);
  assert.strictEqual(mc.so.phieuDuyet.length, 1);
  assert.strictEqual(mc.so.phieuDuyet[0].soTien, 2000000);
});
kiem('CCCD ➜ chặn ngay ở trình duyệt, không gửi', async () => {
  const { mc, API } = dung();
  const r = await API.goi('HUB', 'webGuiDeXuatChi', { khoanMuc: 'x', soTien: 1, lyDo: 'cho ' + '1'.repeat(12), maGui: 'abcdef' });
  assert.strictEqual(r.loi, 'khongduavao'); assert.strictEqual(mc.nhatKy.length, 0);
});
kiem('SĐT (trình duyệt không chặn) ➜ máy chủ chặn, v2 hiện nguyên câu lỗi', async () => {
  const { mc, API } = dung();
  const r = await API.goi('HUB', 'webGuiDeXuatChi', { khoanMuc: 'Mua vật tư', soTien: 1000, lyDo: 'Gọi 09' + '00.000.000', maGui: 'abcdef' });
  assert.strictEqual(r.loi, 'loi');
  assert.ok(API.moTaLoi(r).includes('Nội dung không được chứa số điện thoại.'));
  assert.strictEqual(mc.so.phieuDuyet.length, 0);
});

mo('📋 Task Bus (HUB L27)');
kiem('vướng mắc Dự án ➜ kiemViec ➜ webDayViec 1 lần, đổi trạng thái Xong', async () => {
  const { mc, API, CV, DA } = dung();
  const k = CV.kiemViec(DA.vuongMacThanhViec({ vanDe: 'Thiếu máy siêu âm', muc: 'cao', han: '28/11/2026' }, NAY));
  const du = Object.assign({ id: 'vm-thu-001' }, k.goi);
  const r1 = await API.goi('HUB', 'webDayViec', du), r2 = await API.goi('HUB', 'webDayViec', du);
  assert.ok(r1.data.moi && !r2.data.moi);
  assert.strictEqual(mc.so.viec.length, 1);
  assert.strictEqual(mc.so.viec[0].muc, 'gap'); assert.strictEqual(mc.so.viec[0].han, '2026-11-28');
  const r3 = await API.goi('HUB', 'webDoiTrangThaiViec', { ma: r1.data.ma, trangThai: 'Xong' });
  assert.strictEqual(r3.data.trangThai, 'Xong');
});
kiem('id sai ➜ máy chủ báo lỗi câu Việt', async () => {
  const r = await dung().API.goi('HUB', 'webDayViec', { id: 'x', nguon: 'duan', tieuDe: 'abc' });
  assert.strictEqual(r.loi, 'loi'); assert.ok(/id/.test(r.chiTiet));
});

mo('👥 CRM (HUB L29) · 🧠 Bài học (HUB L28)');
kiem('ghi liên hệ lead + đánh dấu Đã chăm sóc', async () => {
  const { mc, API, CRM } = dung();
  const k = CRM.kiemTuongTac({ maLead: 'LD001', kenh: 'Zalo', noiDung: 'Đã gửi báo giá gói KSK' });
  assert.ok(k.goi, k.loi);
  const r = await API.goi('HUB', 'webGhiTuongTac', Object.assign({ maGui: 'tt-thu-01' }, k.goi));
  assert.ok(r.data.moi); assert.strictEqual(mc.so.tuongTac.length, 1);
  const d = await API.goi('HUB', 'webDanhDauLead', { maLead: 'LD001', trangThai: 'Đã chăm sóc' });
  assert.strictEqual(d.data.trangThai, 'Đã chăm sóc');
});
kiem('bài học: maGui ổn định ➜ gửi lại không trùng; chữ "bệnh nhân" ➜ máy chủ chặn', async () => {
  const { mc, API, DA } = dung();
  const k = DA.kiemBaiHoc({ chuDe: 'Nhân sự', vanDe: 'Thiếu người ca đêm', cachLam: 'Xếp lịch xoay vòng 3 ca', nguon: 'DA01' });
  assert.ok(k.goi, k.loi);
  await API.goi('HUB', 'webLuuBaiHoc', k.goi);
  const r2 = await API.goi('HUB', 'webLuuBaiHoc', k.goi);
  assert.strictEqual(r2.data.moi, false); assert.strictEqual(mc.so.baiHoc.length, 1);
  const r3 = await API.goi('HUB', 'webLuuBaiHoc', { baiHoc: { chuDe: 'Khác', vanDe: 'Hỏi bệnh nhân giờ hẹn', cachLam: 'Gọi lại sau' }, maGui: 'bh-thu-02' });
  assert.strictEqual(r3.loi, 'loi'); assert.ok(/người bệnh/.test(r3.chiTiet));
});

mo('🗄️ DuLieuV2 (HUB L31 – theo hợp đồng, chưa lên app)');
kiem('ghi mới ➜ phienBan 1; sửa đúng phiên bản ➜ 2; phiên bản cũ ➜ xungDot + bản mới', async () => {
  const { API } = dung();
  const r1 = await API.goi('HUB', 'webGhiDuLieuV2', { loai: 'lichNoiDung', noiDung: { tuan: 48, bai: 3 }, phienBan: 0, maGui: 'lnd-thu-01' });
  assert.strictEqual(r1.data.phienBan, 1);
  const r2 = await API.goi('HUB', 'webGhiDuLieuV2', { loai: 'lichNoiDung', ma: r1.data.ma, noiDung: { tuan: 48, bai: 4 }, phienBan: 1, maGui: 'lnd-thu-02' });
  assert.strictEqual(r2.data.phienBan, 2);
  const r3 = await API.goi('HUB', 'webGhiDuLieuV2', { loai: 'lichNoiDung', ma: r1.data.ma, noiDung: { tuan: 48, bai: 9 }, phienBan: 1, maGui: 'lnd-thu-03' });
  assert.strictEqual(r3.data.xungDot, true); assert.strictEqual(r3.data.banMoi.noiDung.bai, 4);
  const doc = await API.goi('HUB', 'webDocDuLieuV2', { loai: 'lichNoiDung' });
  assert.strictEqual(doc.data.ds.length, 1);
});
kiem('taiKhoanQR chỉ Admin ghi ➜ người thường nhận loi quyen', async () => {
  const r = await dung().API.goi('HUB', 'webGhiDuLieuV2', { loai: 'taiKhoanQR', noiDung: { bin: '970436' }, phienBan: 0, maGui: 'qr-thu-01' });
  assert.strictEqual(r.loi, 'quyen');
});
