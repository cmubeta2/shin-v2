/* Kiểm hàm THUẦN 📝 Nhập hộ phiếu KS + 🔳 trang điền công khai (dienks.js dùng chung luật) + link / nguồn QR. */
const app = napApp(['js/api.js', 'js/modules/ks_nhapho.js', 'js/modules/khaosat.js', 'js/modules/ks_qr.js', 'js/dienks.js']);
const NH = app.lay('ModuleKsNhapHo'), QR = app.lay('ModuleKsQR'), DK = app.lay('DienKS')._nb;
const CCCD = '1'.repeat(12);
const CAU = [
  { maCH: 'A', loai: '5muc', noiDung: 'Hài lòng', batBuoc: true },
  { maCH: 'B', loai: 'nps', noiDung: 'Giới thiệu', batBuoc: false },
  { maCH: 'C', loai: 'chonnhieu', noiDung: 'Dịch vụ', luaChon: ['Khám', 'Xét nghiệm', 'Siêu âm'], batBuoc: false },
  { maCH: 'D', loai: 'chon1', noiDung: 'Kênh', luaChon: ['Web', 'Zalo'], batBuoc: false },
  { maCH: 'E', loai: 'chudai', noiDung: 'Góp ý', batBuoc: false }
];

mo('Nhập hộ KS – lựa chọn & gói gửi');
kiem('rong: undefined / null / "  " / [] rỗng; 0 và "0" không rỗng', () => {
  assert.deepStrictEqual([undefined, null, '  ', [], 0, '0', ['x']].map(v => NH.rong(v)), [true, true, true, true, false, false, false]);
});
kiem('luaChonCua: 5muc 1–5, nps 0–10, cokhong, chọn ➜ luaChon, chữ ➜ null', () => {
  assert.strictEqual(NH.luaChonCua(CAU[0]).join(''), '12345');
  assert.strictEqual(NH.luaChonCua(CAU[1]).length, 11);
  assert.deepStrictEqual(Array.from(NH.luaChonCua({ loai: 'cokhong' })), ['Có', 'Không']);
  assert.strictEqual(NH.luaChonCua(CAU[4]), null);
});
kiem('bamLuaChon: chọn 1 bấm lại bỏ chọn; chọn nhiều bật/tắt, giữ thứ tự lựa chọn', () => {
  assert.strictEqual(NH.bamLuaChon(CAU[3], 'Web', 'Web'), '');
  assert.strictEqual(NH.bamLuaChon(CAU[3], 'Web', 'Zalo'), 'Zalo');
  assert.deepStrictEqual(Array.from(NH.bamLuaChon(CAU[2], ['Siêu âm'], 'Khám')), ['Khám', 'Siêu âm']);
  assert.deepStrictEqual(Array.from(NH.bamLuaChon(CAU[2], ['Khám', 'Siêu âm'], 'Khám')), ['Siêu âm']);
});
kiem('goiTraLoi: bỏ câu rỗng, số ép kiểu (dấu phẩy ➜ chấm), chữ cắt khoảng trắng', () => {
  const g = NH.goiTraLoi(CAU, { A: ' 4 ', B: '', C: ['Khám'], E: '  tốt  ' });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(g)), { A: 4, C: ['Khám'], E: 'tốt' });
});
kiem('loiPhieu: thiếu câu bắt buộc, 5muc ngoài 1–5 / lẻ, nps > 10, lựa chọn lạ ➜ lỗi nêu tên câu', () => {
  assert.ok(/Hài lòng/.test(NH.loiPhieu(CAU, {})));
  assert.ok(NH.loiPhieu(CAU, { A: 6 }));
  assert.ok(NH.loiPhieu(CAU, { A: 3.5 }));
  assert.ok(NH.loiPhieu(CAU, { A: 3, B: 11 }));
  assert.ok(/Dịch vụ/.test(NH.loiPhieu(CAU, { A: 3, C: ['Nội soi'] })));
  assert.ok(NH.loiPhieu(CAU, { A: 3, D: 'Fax' }));
  assert.ok(NH.loiPhieu(CAU, { A: 3, E: 'a'.repeat(2001) }));
  assert.strictEqual(NH.loiPhieu(CAU, { A: 5, B: 0, C: ['Khám'], D: 'Web', E: 'ok' }), '');
});
kiem('loiPhieu: tường lửa M9.5 chặn CCCD trong góp ý, không lặp lại số', () => {
  const l = NH.loiPhieu(CAU, { A: 5, E: 'CCCD ' + CCCD });
  assert.ok(/CCCD/.test(l) && l.indexOf(CCCD) < 0, l);
});

mo('Trang điền công khai dienks.js');
kiem('maHopLe: chữ-số / _ - 2–30 ký tự; chuỗi lạ ➜ rỗng', () => {
  assert.strictEqual(DK.maHopLe(' KS001 '), 'KS001');
  ['', 'a', 'KS 01', '<x>', 'a'.repeat(31), null].forEach(m => assert.strictEqual(DK.maHopLe(m), '', String(m)));
});
kiem('moTungCau: chỉ "1cau" và ≥ 2 câu', () => {
  assert.deepStrictEqual([['1cau', 2], ['1cau', 1], ['catrang', 5], ['', 5]].map(([a, b]) => DK.moTungCau(a, b)), [true, false, false, false]);
});
kiem('cauThieu: câu bắt buộc chưa trả lời đầu tiên từ i0, đủ ➜ -1', () => {
  const cau = [{ maCH: 'A', batBuoc: true }, { maCH: 'B' }, { maCH: 'C', batBuoc: true }];
  assert.strictEqual(DK.cauThieu(cau, {}, NH.rong, 0), 0);
  assert.strictEqual(DK.cauThieu(cau, { A: 1 }, NH.rong, 0), 2);
  assert.strictEqual(DK.cauThieu(cau, {}, NH.rong, 1), 2);
  assert.strictEqual(DK.cauThieu(cau, { A: 1, C: ['x'] }, NH.rong), -1);
  assert.strictEqual(DK.cauThieu(null, {}, NH.rong), -1);
});

mo('Nguồn QR khảo sát ks_qr.js');
kiem('linkDien mã hóa mã, nối đúng gốc', () => {
  assert.strictEqual(QR.linkDien('KS 01&x', 'https://a.b/v2/'), 'https://a.b/v2/dienks.html?k=KS%2001%26x');
});
kiem('kiemNguon: loại phải thuộc danh sách, cần tên hiện', () => {
  assert.ok(QR.kiemNguon({ loai: 'xx', tenHien: 'Quầy 1' }));
  assert.ok(QR.kiemNguon({ loai: QR.LOAI[0], tenHien: '  ' }));
  assert.strictEqual(QR.kiemNguon({ loai: QR.LOAI[0], tenHien: 'Quầy 1' }), '');
});
