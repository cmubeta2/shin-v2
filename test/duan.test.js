/* Kiểm hàm THUẦN 🗂️ Dự án: tuV1 (webDuAn, thoát HTML), M6.3 Blocker Matrix, M9.4 trích bài học, kiemBaiHoc (HUB L28).
   (vuongMacThanhViec + maGuiBaiHoc nằm ở congviec.test.js – cùng luồng Task Bus.) */
const app = napApp(['js/modules/duan.js']);
const DA = app.lay('ModuleDuAn');
const NAY = new Date(2026, 10, 21, 9, 0);
const SDT = '09' + '00.000.' + '000';

mo('Dự án – tuV1 (webDuAn)');
kiem('thoát HTML mọi chữ máy chủ, mã chỉ giữ chữ-số, tiến độ kẹp 0–100, tiền ➜ "x đ" / —', () => {
  const k = DA.tuV1({ duAn: [
    { ma: 'DA<1>', ten: '<img onerror=x>', tienDo: 140, nganSach: 1500000, daChi: null, mucDo: 'xanh' },
    { ma: 'DA2', ten: 'B', tienDo: -5, nganSach: '', mucDo: 'do' }
  ], flash: { choDuyet: [{ ma: 'PD"1' }], vuongMac: [{ vanDe: '<b>x</b>' }] } });
  const a = k.danhSachDuAn[0], b = k.danhSachDuAn[1];
  assert.strictEqual(a.ma, 'DA1'); assert.ok(a.ten.indexOf('<') < 0);
  assert.strictEqual(a.tienDo, 100); assert.strictEqual(b.tienDo, 0);
  assert.strictEqual(a.nganSach, '1.500.000 đ'); assert.strictEqual(a.daChi, '—'); assert.strictEqual(b.nganSach, '—');
  assert.strictEqual(a.den, 'var(--c-green)'); assert.strictEqual(b.den, 'var(--c-red)');
  assert.strictEqual(k.hero.so[1].giaTri, '1/2'); assert.strictEqual(k.hero.so[2].giaTri, '1');
  assert.strictEqual(k.flashReport.khoi4_choDuyet[0].ma, 'PD1');
  assert.ok(k.flashReport.khoi2_vuongMac[0].vanDe.indexOf('<b>') < 0);
});
kiem('đầu vào rỗng không vỡ', () => {
  const k = DA.tuV1(null);
  assert.strictEqual(k.danhSachDuAn.length, 0); assert.strictEqual(k.hero.so[1].giaTri, '0/0');
});

mo('Dự án – Blocker Matrix M6.3');
const D = {
  flashReport: { nguoiBaoCao: 'Tổ 1', khoi2_vuongMac: [{ vanDe: 'Thiếu máy siêu âm', mucDo: 'Thấp', deXuat: 'Mượn máy khoa Nội' }, { vanDe: 'Chậm thanh toán', mucDo: 'Cao', deXuat: 'Nhắc công nợ' }] },
  danhSachDuAn: [
    { ma: 'DA1', ten: 'Xanh', tienDo: 50, hanChot: '30/12/2026', den: 'var(--c-green)' },
    { ma: 'DA2', ten: 'Vàng', tienDo: 40, hanChot: '30/12/2026', den: 'var(--c-yellow)' },
    { ma: 'DA3', ten: 'Quá hạn', tienDo: 80, hanChot: '01/11/2026', den: 'var(--c-green)' },
    { ma: 'DA4', ten: 'Xong rồi', tienDo: 100, hanChot: '01/11/2026', den: 'var(--c-green)' }
  ]
};
kiem('gom Flash + dự án vàng / quá hạn; bỏ xanh & đã 100%; xếp Cao ➜ Thấp, quá hạn trước', () => {
  const m = DA.maTranVuongMac(D, NAY);
  assert.deepStrictEqual(Array.from(m, x => x.muc + ':' + (x.quaHan ? 'QH' : '') + x.vanDe.slice(0, 12)),
    ['cao:QHQuá hạn DA3 ', 'cao:Chậm thanh t', 'vua:Chậm tiến độ', 'thap:Thiếu máy si']);
});
kiem('hạn chốt hôm nay chưa tính quá hạn; dữ liệu rỗng ➜ []', () => {
  assert.strictEqual(DA.maTranVuongMac({ danhSachDuAn: [{ ma: 'X', tienDo: 0, hanChot: '21/11/2026', den: '' }] }, NAY).length, 0);
  assert.strictEqual(DA.maTranVuongMac(null, NAY).length, 0);
});

mo('Dự án – bài học M9.4 / HUB L28');
kiem('trichBaiHoc: chỉ dòng Flash có đề xuất, gán chủ đề, bỏ trùng không phân biệt hoa thường', () => {
  const m = DA.maTranVuongMac(D, NAY).concat([{ vanDe: 'thiếu MÁY siêu âm', deXuat: 'khác', nguon: 'Flash hôm nay' }]);
  const bh = DA.trichBaiHoc(m);
  assert.deepStrictEqual(Array.from(bh, b => b.chuDe), ['Tài chính', 'Thiết bị & Hậu cần']);
  assert.strictEqual(bh[1].nguoiXuLy, 'Tổ 1');
});
kiem('trichBaiHoc giải mã thực thể HTML (&amp; ➜ &), bỏ thẻ', () => {
  const bh = DA.trichBaiHoc([{ vanDe: '<i>Hồ sơ</i> &amp; giấy phép', deXuat: 'Nộp sớm', nguon: 'Flash' }]);
  assert.strictEqual(bh[0].vanDe, 'Hồ sơ & giấy phép'); assert.strictEqual(bh[0].chuDe, 'Tiến độ & Quy trình');
});
kiem('baiHocMarkdown: tiêu đề + [[Chủ đề]] + dòng nguồn; rỗng ➜ ""', () => {
  const md = DA.baiHocMarkdown([{ chuDe: 'Tài chính', vanDe: 'A', cachLam: 'B', nguon: 'Flash', muc: 'cao', nguoiXuLy: 'Tổ 1' }], '21/11');
  assert.ok(md.startsWith('# Bài học kinh nghiệm – Flash 21/11\n'));
  assert.ok(md.indexOf('## [[Tài chính]]') >= 0 && md.indexOf('🔴') >= 0 && md.indexOf('Nguồn: Flash · Tổ 1') >= 0);
  assert.strictEqual(DA.baiHocMarkdown([]), '');
});
kiem('kiemBaiHoc: chủ đề lạ ➜ Khác, nguồn cắt 120, độ dài 5–500 / 5–1000, chặn SĐT / "BN"', () => {
  const k = DA.kiemBaiHoc({ chuDe: 'Lạ', vanDe: 'Thiếu người ca đêm', cachLam: 'Xếp lịch xoay vòng', nguon: 'n'.repeat(200) });
  assert.strictEqual(k.goi.baiHoc.chuDe, 'Khác'); assert.strictEqual(k.goi.baiHoc.nguon.length, 120);
  assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(k.goi.maGui));
  assert.ok(DA.kiemBaiHoc({ vanDe: 'abcd', cachLam: 'Xếp lịch' }).loi);
  assert.ok(DA.kiemBaiHoc({ vanDe: 'Thiếu người', cachLam: 'Gọi ' + SDT }).loi);
  assert.ok(DA.kiemBaiHoc({ vanDe: 'BN chờ lâu', cachLam: 'Thêm bàn' }).loi);
});
