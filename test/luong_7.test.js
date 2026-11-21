/* v2.16.9 – KỊCH BẢN 7 LUỒNG GHI "chờ anh thử bằng token" (UPDATE.md mục 0) chạy trên máy chủ giả test/may_chu_gia.js.
 * Khác luong_ghi.test.js (gọi thẳng SHIN_API.goi): ở đây bấm ĐÚNG HÀM NÚT của màn (guiDeXuat, ghiTuongTac, danhDauLead,
 * guiBaiHoc, guiNghi, gui (KS nhập hộ), guiViec, doiTrangThai, dayVuongMac). ShinApp.hanhDongHoanTac được thay bằng bản
 * giữ Toast lại để ca kiểm tự chọn: bấm "Hoàn tác" (traLai – không gửi gì) hoặc "hết 6 giây" (chạy thucHien như app.js).
 * Mỗi luồng 9 phép kiểm: đủ trường đúng hợp đồng · Hoàn tác 6s không gửi · bấm 2 lần ➜ 1 lệnh · mất mạng trước máy chủ ·
 * mất trả lời sau khi máy chủ đã ghi · trả chậm + bấm lại · Demo / không token · token hết hạn / sai · tường lửa CCCD / SĐT. */
const { taoMayChuGia } = require('./may_chu_gia.js');
const TEP = ['js/api.js', 'js/modules/taichinh.js', 'js/modules/congviec.js', 'js/modules/duan.js', 'js/modules/crm.js', 'js/modules/ptkh.js', 'js/modules/ks_nhapho.js'];
const LINK_PTKH = 'https://script.google.com/macros/s/PTKH-gia-thu/exec';
const CCCD = '0790' + '12345678';            // 12 chữ số – viết tách cho bộ quét bí mật
const SDT = '09' + '12.345.678';

function dung(tuyChon, token) {
  const mc = taoMayChuGia(tuyChon);
  const app = napApp(TEP, { fetch: mc.fetch });
  if (token !== '') app.localStorage.setItem('shin_token', token || 'tok-thu');
  const cho = [], toast = [], o = {};
  const S = app.ShinApp;
  S.toast = (m, loai) => { toast.push({ m: String(m), loai: loai || 'success' }); return () => {}; };
  S.hanhDongHoanTac = (msg, h) => { if (h.lamTruoc) h.lamTruoc(); cho.push({ msg, h }); };
  S.chuyenModule = () => {};
  S.linkV1 = k => (k === 'PTKH' ? LINK_PTKH : '');
  app.document.getElementById = id => o[id] || null;
  const m = { mc, app, cho, toast, o, API: app.lay('SHIN_API'),
    TC: app.lay('ModuleTaiChinh'), CV: app.lay('ModuleCongViec'), DA: app.lay('ModuleDuAn'), CRM: app.lay('ModuleCRM'),
    PT: app.lay('ModulePTKH'), KS: app.lay('ModuleKsNhapHo') };
  m.dat = (id, v) => { o[id] = { value: v }; };
  return m;
}
const nutGia = () => ({ isConnected: true, disabled: false, innerHTML: '', textContent: '', dataset: {} });
/** "Hết 6 giây" – đúng khiHet của ShinApp.hanhDongHoanTac (app.js): lỗi ➜ traLai + toast đỏ. */
async function het(m, c) {
  c = c || m.cho[m.cho.length - 1];
  try { await c.h.thucHien(); } catch (e) { if (c.h.traLai) c.h.traLai(); m.toast.push({ m: e.message, loai: 'error' }); }
}
const hoanTac = (m, c) => { c = c || m.cho[m.cho.length - 1]; if (c.h.traLai) c.h.traLai(); };
const toastLoi = m => m.toast.filter(t => t.loai === 'error' || t.loai === 'warn').map(t => t.m).join(' | ');

/* ===== 9 hàm nút / 7 luồng ===== */
const LUONG = [
  { ten: '① 💰 Đề xuất chi ➜ 0B (webGuiDeXuatChi)', hanh: 'webGuiDeXuatChi', chongTrung: 'maGui', khongLive: true /* form người dùng tự gõ – Demo = không token */,
    chuan(m, chu) {
      const f = { loai: 'Chi', khoanMuc: 'Mua vật tư tiêu hao', soTien: 1500000, lyDo: chu || 'Bổ sung găng tay cho đợt khám', duAn: '', hanHoanUng: '', soChungTu: '' };
      m.TC._docForm = () => m.TC.kiemDeXuat(f, m.API.soatKhongDuaVao, '21/11/2026');
    },
    bam: (m, n) => m.TC.guiDeXuat(n),
    kiemGoi(du) {
      assert.deepStrictEqual(Object.keys(du).sort().filter(k => ['loai', 'khoanMuc', 'soTien', 'lyDo', 'maGui'].includes(k)), ['khoanMuc', 'loai', 'lyDo', 'maGui', 'soTien']);
      assert.strictEqual(typeof du.soTien, 'number'); assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(du.maGui));
    },
    soLuu: mc => mc.so.phieuDuyet.length },
  { ten: '② 👥 CRM ghi liên hệ (webGhiTuongTac)', hanh: 'webGhiTuongTac', chongTrung: 'maGui',
    chuan(m, chu, demo) {
      m.CRM._d = { live: !demo, danhBa: [{ ma: 'DT001', ten: 'Công ty mẫu' }], tuongTac: [], leadMoi: [] };
      m.CRM.moChiTiet = () => {}; m.CRM.render = () => {};
      m.dat('ttKenh0', 'Zalo'); m.dat('ttNoi0', chu || 'Đã gửi báo giá gói khám sức khỏe');
    },
    bam: (m, n) => m.CRM.ghiTuongTac(0, n),
    kiemGoi(du) { assert.strictEqual(du.maDoiTac, 'DT001'); assert.strictEqual(du.kenh, 'Zalo'); assert.ok(du.noiDung && du.maGui); assert.ok(!du.maLead); },
    soLuu: mc => mc.so.tuongTac.length },
  { ten: '② 👥 CRM đánh dấu lead (webDanhDauLead)', hanh: 'webDanhDauLead', chongTrung: 'tuNhien',
    chuan(m, chu, demo) { m.CRM._d = { live: !demo, danhBa: [], tuongTac: [], leadMoi: [{ ma: 'LD001', ten: 'Lead mẫu', trangThai: 'Mới' }] }; m.CRM.render = () => {}; },
    bam: (m, n) => m.CRM.danhDauLead(0, 'Đã chăm sóc', n),
    kiemGoi(du) { assert.deepStrictEqual(Object.assign({}, du), { maLead: 'LD001', trangThai: 'Đã chăm sóc' }); },
    soLuu: mc => (mc.so.lead.LD001.trangThai === 'Đã chăm sóc' ? 1 : 0) },
  { ten: '③ 🧠 Gửi bài học (webLuuBaiHoc)', hanh: 'webLuuBaiHoc', chongTrung: 'maGui',
    chuan(m, chu, demo) {
      m.DA._d = { live: !demo };
      m.DA._maTran = [{ nguon: 'Flash 20/11', vanDe: chu || 'Thiếu người trực ca đêm', deXuat: 'Xếp lịch xoay vòng 3 ca', muc: 'cao', nguoiXuLy: '' }];
    },
    bam: (m, n) => m.DA.guiBaiHoc(n),
    kiemGoi(du) {
      assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(du.maGui));
      assert.ok(['Nhân sự', 'Thiết bị & Hậu cần', 'Tài chính', 'Khách hàng & Hợp đồng', 'Tiến độ & Quy trình', 'Khác'].includes(du.baiHoc.chuDe));
      assert.ok(du.baiHoc.vanDe.length >= 5 && du.baiHoc.cachLam.length >= 5);
    },
    soLuu: mc => mc.so.baiHoc.length },
  { ten: '④ 📋 PTKH đơn nghỉ ốm (webGoi ➜ webGuiNghiPhep)', hanh: 'webGuiNghiPhep', chongTrung: 'khong', canhBaoTrung: /kiểm danh sách đơn/,
    chuan(m, chu, demo) {
      m.PT._d = { live: !demo, lichNghi: {} };
      m.PT._fn = { loai: 'Nghỉ ốm', ngay: [], tuNgay: '2026-11-20', denNgay: '2026-11-21', buoi: 'Cả ngày', lyDo: chu || 'Sốt cao, có giấy nghỉ' };
      m.PT._veLai = () => {};
    },
    lai: m => { m.PT._fn = { loai: 'Nghỉ ốm', ngay: [], tuNgay: '2026-11-20', denNgay: '2026-11-21', buoi: 'Cả ngày', lyDo: 'Sốt cao, có giấy nghỉ' }; },
    bam: (m, n) => m.PT.guiNghi(n),
    kiemGoi(du) {
      assert.strictEqual(du.ham, 'webGuiNghiPhep'); assert.strictEqual(du.thamSo.length, 1);
      assert.deepStrictEqual(Object.assign({}, du.thamSo[0]), { loai: 'Nghỉ ốm', tuNgay: '2026-11-20', denNgay: '2026-11-21', buoi: 'Cả ngày', lyDo: 'Sốt cao, có giấy nghỉ' });
    },
    soLuu: mc => mc.so.donNghi.length },
  { ten: '⑤ 🩺 Nhập hộ phiếu KS (webNhapHo)', hanh: 'webNhapHo', chongTrung: 'khong', canhBaoTrung: /kiểm danh sách phiếu/,
    chuan(m, chu, demo) {
      m.KS._ks = { ma: 'KS001', demo: !!demo, cau: [{ maCH: 'C1', loai: '5muc', noiDung: 'Mức hài lòng', batBuoc: true }, { maCH: 'C2', loai: 'chudai', noiDung: 'Góp ý', batBuoc: false }] };
      m.KS._tl = { C1: 5, C2: chu || 'Nhân viên nhiệt tình' }; m.KS._batDau = Date.now() - 42000; m.KS.ve = () => {};
    },
    lai: m => { m.KS._tl = { C1: 5, C2: 'Nhân viên nhiệt tình' }; },
    bam: (m, n) => m.KS.gui(n),
    kiemGoi(du) { assert.strictEqual(du.ma, 'KS001'); assert.deepStrictEqual(Object.assign({}, du.traLoi), { C1: 5, C2: 'Nhân viên nhiệt tình' }); assert.ok(du.giay >= 42); },
    soLuu: mc => mc.so.phieuKS.length },
  { ten: '⑥ 📋 Task Bus đẩy việc (webDayViec)', hanh: 'webDayViec', chongTrung: 'maGui',
    chuan(m, chu, demo) {
      m.CV._data = { live: !demo }; m.CV.taiLai = async () => {};
      m.dat('cvNguon', 'duan'); m.dat('cvMuc', 'thuong'); m.dat('cvTieu', chu || 'Gọi nhà cung cấp sửa máy in'); m.dat('cvHan', '2026-11-28'); m.dat('cvNhan', '');
    },
    bam: (m, n) => m.CV.guiViec(n),
    kiemGoi(du) { assert.strictEqual(du.nguon, 'duan'); assert.strictEqual(du.muc, 'thuong'); assert.strictEqual(du.han, '2026-11-28'); assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(du.id)); assert.ok(du.tieuDe); },
    soLuu: mc => mc.so.viec.length },
  { ten: '⑥ 📋 Task Bus đổi trạng thái (webDoiTrangThaiViec)', hanh: 'webDoiTrangThaiViec', chongTrung: 'tuNhien',
    chuan(m, chu, demo) {
      m.mc.so.viec.push({ ma: 'VL-seed001', id: 'seed001', tieuDe: 'Việc mẫu', trangThai: 'Mới' });
      m.CV._data = { live: !demo }; m.CV.taiLai = async () => {};
      m.CV._ds = [{ it: { ma: 'VL-seed001', tieuDe: 'Việc mẫu' } }];
    },
    bam: (m, n) => { n.dataset = { ma: 'VL-seed001', tt: 'Đang làm' }; m.CV.doiTrangThai(n); },
    kiemGoi(du) { assert.deepStrictEqual(Object.assign({}, du), { ma: 'VL-seed001', trangThai: 'Đang làm' }); },
    soLuu: mc => (mc.so.viec[0].trangThai === 'Đang làm' ? 1 : 0) },
  { ten: '⑦ 🗂️ Đẩy vướng mắc M6.3 ➜ Task Bus (webDayViec)', hanh: 'webDayViec', chongTrung: 'maGui',
    chuan(m, chu, demo) { m.DA._d = { live: !demo }; m.DA._maTran = [{ nguon: 'Flash 20/11', vanDe: chu || 'Thiếu máy siêu âm điểm khám', muc: 'cao', han: '28/11/2026', deXuat: '' }]; },
    bam: (m, n) => m.DA.dayVuongMac(0, n),
    kiemGoi(du) { assert.strictEqual(du.nguon, 'duan'); assert.strictEqual(du.muc, 'gap'); assert.strictEqual(du.han, '2026-11-28'); assert.ok(du.id && du.tieuDe); },
    soLuu: mc => mc.so.viec.length }
];
const coChu = L => !['webDanhDauLead', 'webDoiTrangThaiViec'].includes(L.hanh);

for (const L of LUONG) {
  mo('7 luồng ghi · ' + L.ten);
  const batDau = (tuyChon, token, chu, demo) => { const m = dung(tuyChon, token); L.chuan(m, chu, demo); return m; };
  const bamLai = (m, n) => { if (L.lai) L.lai(m); L.bam(m, n); };

  kiem('đủ trường đúng hợp đồng, hết 6s ➜ gửi đúng 1 lần, báo thành công', async () => {
    const m = batDau(), n = nutGia();
    L.bam(m, n);
    assert.strictEqual(m.cho.length, 1, 'phải hiện Toast Hoàn tác. ' + toastLoi(m));
    assert.strictEqual(m.mc.nhatKy.length, 0, 'chưa hết 6s đã gửi');
    await het(m);
    assert.strictEqual(m.mc.nhatKyGhi.length, 1, toastLoi(m));
    assert.strictEqual(m.mc.nhatKyGhi[0].hanh, L.hanh);
    L.kiemGoi(m.mc.nhatKyGhi[0].du);
    assert.strictEqual(L.soLuu(m.mc), 1);
    assert.ok(m.toast.some(t => t.loai === 'success' || t.loai === 'warn'), 'thiếu toast kết quả');
  });
  kiem('bấm Hoàn tác trong 6s ➜ KHÔNG gửi gì, nút mở lại, bấm lại được', async () => {
    const m = batDau(), n = nutGia();
    L.bam(m, n); hoanTac(m);
    await new Promise(r => setTimeout(r, 5));
    assert.strictEqual(m.mc.nhatKy.length, 0);
    assert.strictEqual(n.disabled, false);
    bamLai(m, n);
    assert.strictEqual(m.cho.length, 2, 'sau Hoàn tác phải bấm lại được');
  });
  kiem('bấm 2 lần trong lúc chờ 6s ➜ 1 Toast, 1 lệnh ghi', async () => {
    const m = batDau(), n = nutGia();
    L.bam(m, n); bamLai(m, n);
    assert.strictEqual(m.cho.length, 1);
    await het(m);
    assert.strictEqual(m.mc.nhatKyGhi.length, 1); assert.strictEqual(L.soLuu(m.mc), 1);
  });
  kiem('mất mạng TRƯỚC khi tới máy chủ ➜ báo lỗi, bấm lại ➜ đúng 1 bản ghi', async () => {
    const m = batDau({ matMangLan: 1 }), n = nutGia();
    L.bam(m, n); await het(m);
    assert.strictEqual(L.soLuu(m.mc), 0);
    assert.ok(/mạng|kết nối/i.test(toastLoi(m)), 'phải báo lỗi mạng: ' + toastLoi(m));
    bamLai(m, n); assert.strictEqual(m.cho.length, 2, 'lỗi xong phải bấm lại được');
    await het(m);
    assert.strictEqual(L.soLuu(m.mc), 1);
  });
  kiem('mạng chập chờn: máy chủ ĐÃ ghi nhưng mất trả lời ➜ bấm lại ' + (L.chongTrung === 'khong' ? '(v1 chưa chống trùng ➜ phải nhắc kiểm trước)' : '➜ không tạo bản thứ 2'), async () => {
    const m = batDau({ matTraLoiLan: 1 }), n = nutGia();
    L.bam(m, n); await het(m);
    assert.strictEqual(L.soLuu(m.mc), 1, 'máy chủ đã ghi lần 1');
    if (L.chongTrung === 'khong') {
      assert.ok(L.canhBaoTrung.test(toastLoi(m)), 'lỗi mạng phải nhắc kiểm danh sách trước khi gửi lại: ' + toastLoi(m));
      return;
    }
    bamLai(m, n); await het(m);
    assert.strictEqual(m.mc.nhatKyGhi.length, 2);
    assert.strictEqual(L.soLuu(m.mc), 1, 'gửi lại phải không tạo bản trùng');
    if (L.chongTrung === 'maGui') {
      const [a, b] = m.mc.nhatKyGhi;
      assert.strictEqual(JSON.stringify(a.du), JSON.stringify(b.du), 'gửi lại phải giữ nguyên mã chống trùng');
      assert.strictEqual(b.kq.du.moi, false);
    }
  });
  kiem('máy chủ trả chậm: bấm lại khi đang chờ ➜ không gửi thêm', async () => {
    const m = batDau({ chamMs: 15 }), n = nutGia();
    L.bam(m, n);
    const p = het(m);
    bamLai(m, n);
    assert.strictEqual(m.cho.length, 1);
    await p;
    assert.strictEqual(m.mc.nhatKyGhi.length, 1); assert.strictEqual(L.soLuu(m.mc), 1);
  });
  kiem('Demo / không token ➜ không gửi, không báo "đã lưu"', async () => {
    for (const [token, demo] of (L.khongLive ? [['', false]] : [['', false], ['tok-thu', true]])) {
      const m = batDau({}, token, '', demo), n = nutGia();
      L.bam(m, n);
      if (m.cho.length) await het(m);
      assert.strictEqual(m.mc.nhatKy.length, 0, (token ? 'Demo' : 'không token') + ' mà vẫn gọi máy chủ');
      assert.ok(!m.toast.some(t => t.loai === 'success'), (token ? 'Demo' : 'không token') + ' báo thành công giả: ' + JSON.stringify(m.toast));
    }
  });
  kiem('token hết hạn / sai ➜ báo đúng câu Hub, không ghi, bấm lại được', async () => {
    for (const [token, re] of [['het-han', /hết hạn/], ['sai', /thu hồi/]]) {
      const m = batDau({}, token), n = nutGia();
      L.bam(m, n); await het(m);
      assert.strictEqual(L.soLuu(m.mc), 0);
      assert.ok(re.test(toastLoi(m)), token + ': ' + toastLoi(m));
      bamLai(m, n); assert.strictEqual(m.cho.length, 2, token + ': phải bấm lại được');
    }
  });
  kiem(coChu(L) ? 'tường lửa: CCCD ➜ chặn trên máy (0 lệnh) · SĐT ➜ không lưu, báo rõ' : 'tường lửa: không có ô chữ tự do (chỉ mã + trạng thái) ➜ không áp dụng; tài khoản không quyền ➜ báo, không ghi', async () => {
    if (!coChu(L)) {
      const m = batDau({}, 'khong-quyen'), n = nutGia();
      L.bam(m, n); await het(m);
      assert.strictEqual(L.soLuu(m.mc), 0); assert.ok(/quyền/.test(toastLoi(m)), toastLoi(m));
      return;
    }
    const a = batDau({}, undefined, 'Ghi chú số ' + CCCD + ' của khách'), n = nutGia();
    L.bam(a, n);
    if (a.cho.length) await het(a);
    assert.strictEqual(a.mc.nhatKy.length, 0, 'CCCD đã lọt tới máy chủ');
    assert.ok(/CCCD/.test(toastLoi(a)), 'phải báo CCCD: ' + toastLoi(a));
    const b = batDau({}, undefined, 'Liên hệ số ' + SDT + ' để hỏi'), n2 = nutGia();
    L.bam(b, n2);
    if (b.cho.length) await het(b);
    assert.strictEqual(L.soLuu(b.mc), 0, 'SĐT đã được lưu');
    assert.ok(/điện thoại|SĐT/.test(toastLoi(b)), 'phải báo số điện thoại: ' + toastLoi(b));
  });
}
