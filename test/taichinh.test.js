/* Kiểm hàm THUẦN 💰 Tài chính: VietQR (M3.1), lệch dự toán (M3.2), đề xuất chi / tạm ứng / thanh toán (M3.4 + M6.4), hoa hồng (M3.3). */
const app = napApp(['js/api.js', 'js/vietqr.js', 'js/modules/taichinh.js']);
const QR = app.lay('ShinVietQR'), TC = app.lay('ModuleTaiChinh'), API = app.lay('SHIN_API');

mo('VietQR M3.1');
kiem('crc16 chuẩn CCITT-FALSE: "123456789" ➜ 29B1', () => assert.strictEqual(QR.crc16('123456789'), '29B1'));
kiem('chuỗi có tiền: tag 01=12, tag 54 đúng số, CRC khớp phần trước', () => {
  const k = QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: 150000, noiDung: 'Học phí Đợt 1' });
  assert.ok(k.chuoi, k.loi);
  assert.ok(k.chuoi.startsWith('000201010212'));
  assert.ok(k.chuoi.includes('5406150000'));
  assert.ok(k.chuoi.includes('0010A000000727'));
  assert.strictEqual(k.chuoi.slice(-4), QR.crc16(k.chuoi.slice(0, -4)));
  assert.strictEqual(k.noiDung, 'Hoc phi Dot 1');
});
kiem('không tiền ➜ QR tĩnh (01=11, không có tag 54)', () => {
  const k = QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: '' });
  assert.ok(k.chuoi.startsWith('000201010211'));
  assert.ok(k.chuoi.includes('53037045802VN'), 'sau tag 53 phải là tag 58 (không có 54)');
});
kiem('BIN sai / số TK sai / tiền lẻ / tiền âm ➜ lỗi', () => {
  assert.ok(QR.chuoiVietQR({ bin: '97043', soTK: '1234ABCD' }).loi);
  assert.ok(QR.chuoiVietQR({ bin: '970436', soTK: '12' }).loi);
  assert.ok(QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: 10.5 }).loi);
  assert.ok(QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: -1 }).loi);
  assert.ok(QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: 1e14 }).loi);
});
kiem('nội dung bỏ dấu, bỏ ký tự lạ, ≤ 25 ký tự', () => {
  assert.strictEqual(QR.noiDungSach('Đóng   tiền #KSK@công ty'), 'Dong tien KSK cong ty');
  assert.ok(QR.noiDungSach('a'.repeat(40)).length <= 25);
});
kiem('mã hóa QR: ma trận vuông 17+4·ver, ô đen/trắng', () => {
  const k = QR.chuoiVietQR({ bin: '970436', soTK: '1234ABCD', soTien: 99000, noiDung: 'test' });
  const q = QR.maHoa(k.chuoi);
  assert.strictEqual(q.m.length, q.n);
  assert.strictEqual((q.n - 17) % 4, 0);
  assert.ok(q.m.every(r => r.length === q.n));
});

mo('Lệch dự toán M3.2');
kiem('ngưỡng > 100% đỏ, > 90% vàng, chưa dự toán xếp cuối, bỏ dự án đóng', () => {
  const k = TC.lechDuToan([
    { ma: 'A', nganSach: 100, daChi: 50 },
    { ma: 'B', nganSach: 100, daChi: 120 },
    { ma: 'C', nganSach: 100, daChi: 95 },
    { ma: 'D', nganSach: 0, daChi: 10 },
    { ma: 'E', nganSach: 100, daChi: 500, trangThai: 'Hoàn thành' }
  ]);
  assert.deepStrictEqual(Array.from(k.ds, x => x.ma + ':' + x.muc), ['B:do', 'C:vang', 'A:xanh', 'D:chua']);
  assert.strictEqual(k.vuot, 1); assert.strictEqual(k.sapVuot, 1);
  assert.strictEqual(k.ds[0].conLai, -20);
});
kiem('đúng 100% / 90% không tính vượt; đã chi âm tính 0; đọc số chuỗi qua docSo', () => {
  const k = TC.lechDuToan([{ ma: 'X', nganSach: 100, daChi: 100 }, { ma: 'Y', nganSach: 100, daChi: 90 }, { ma: 'Z', nganSach: '1.000', daChi: -5 }],
    s => Number(String(s).replace(/\./g, '')));
  const m = Object.fromEntries(k.ds.map(x => [x.ma, x]));
  assert.strictEqual(m.X.muc, 'vang'); assert.strictEqual(m.Y.muc, 'xanh');
  assert.strictEqual(m.Z.nganSach, 1000); assert.strictEqual(m.Z.daChi, 0);
});
kiem('đầu vào rỗng / null không vỡ', () => {
  assert.strictEqual(TC.lechDuToan(null).ds.length, 0);
  assert.strictEqual(TC.lechDuToan([null, {}]).ds.length, 1);
});

mo('Đề xuất chi / tạm ứng / thanh toán M3.4 + M6.4');
const soat = API.soatKhongDuaVao;
kiem('phiếu Chi hợp lệ ➜ goi đúng tham số webGuiDeXuatChi', () => {
  const k = TC.kiemDeXuat({ khoanMuc: 'Văn phòng phẩm', soTien: '1.500.000', lyDo: 'Mua giấy in tháng 11' }, soat, '21/11/2026');
  assert.ok(k.goi, k.loi);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(k.goi)), { loai: 'Chi', khoanMuc: 'Văn phòng phẩm', soTien: 1500000, duAn: '', lyDo: 'Mua giấy in tháng 11' });
  assert.ok(k.tin.includes('1.500.000 đ'));
});
kiem('thiếu khoản mục / tiền 0 / lý do ngắn / loại lạ ➜ lỗi', () => {
  assert.ok(TC.kiemDeXuat({ soTien: 1, lyDo: 'abcdef' }).loi);
  assert.ok(TC.kiemDeXuat({ khoanMuc: 'x', soTien: 0, lyDo: 'abcdef' }).loi);
  assert.ok(TC.kiemDeXuat({ khoanMuc: 'x', soTien: 1, lyDo: 'abc' }).loi);
  assert.ok(TC.kiemDeXuat({ loai: 'Lạ', khoanMuc: 'x', soTien: 1, lyDo: 'abcdef' }).loi);
  assert.ok(TC.kiemDeXuat({ khoanMuc: 'x', soTien: 2e12, lyDo: 'abcdef' }).loi);
});
kiem('Tạm ứng: bắt buộc hạn có thật, không ở quá khứ, chuẩn hóa dd/mm/yyyy', () => {
  const g = { loai: 'Tạm ứng', khoanMuc: 'Công tác', soTien: 2000000, lyDo: 'Đi tỉnh khảo sát' };
  assert.ok(TC.kiemDeXuat(g, soat, '21/11/2026').loi);
  assert.ok(TC.kiemDeXuat(Object.assign({ hanHoanUng: '31/02/2027' }, g), soat, '21/11/2026').loi);
  assert.ok(TC.kiemDeXuat(Object.assign({ hanHoanUng: '20/11/2026' }, g), soat, '21/11/2026').loi);
  const k = TC.kiemDeXuat(Object.assign({ hanHoanUng: '5/1/2027', soChungTu: 'CT9' }, g), soat, '21/11/2026');
  assert.strictEqual(k.goi.hanHoanUng, '05/01/2027');
  assert.strictEqual(k.goi.soChungTu, undefined);
});
kiem('Thanh toán giữ số chứng từ', () => {
  const k = TC.kiemDeXuat({ loai: 'Thanh toán', khoanMuc: 'In ấn', soTien: 300000, lyDo: 'In tờ rơi', soChungTu: 'HD-12' }, soat);
  assert.strictEqual(k.goi.soChungTu, 'HD-12');
});
kiem('tường lửa M9.5: CCCD trong lý do ➜ chặn', () => {
  const k = TC.kiemDeXuat({ khoanMuc: 'x', soTien: 1000, lyDo: 'Tạm ứng cho ' + '1'.repeat(12) }, soat);
  assert.ok(/CCCD/.test(k.loi), k.loi);
});
kiem('taoMaGui khớp luật Hub ^[A-Za-z0-9_-]{6,40}$', () => {
  assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(TC.taoMaGui(Date.UTC(2026, 10, 21), 'x7#q')));
  assert.ok(/^[A-Za-z0-9_-]{6,40}$/.test(TC.taoMaGui(0, '')));
});

mo('Hoa hồng CTV M3.3');
kiem('có tiền ➜ phiếu Thanh toán điền sẵn, cắt độ dài', () => {
  const p = TC.deXuatHoaHong({ ma: 'CD01', ten: 'Tuyển sinh K5' }, { bac: 2, tien: 4500000.4 }, 12);
  assert.strictEqual(p.loai, 'Thanh toán'); assert.strictEqual(p.soTien, 4500000); assert.strictEqual(p.duAn, 'CD01');
  assert.ok(p.khoanMuc.endsWith('Tuyển sinh K5')); assert.ok(p.lyDo.startsWith('12 học viên'));
  assert.ok(!TC.kiemDeXuat(p, soat).loi, 'phiếu điền sẵn phải qua được kiemDeXuat');
});
kiem('chưa đạt bậc / tiền 0 ➜ lỗi', () => {
  assert.ok(TC.deXuatHoaHong({ ma: 'CD01' }, { tien: 0 }, 3).loi);
  assert.ok(TC.deXuatHoaHong(null, null, null).loi);
});
