/* Kiểm hàm THUẦN 👥 CRM: giai đoạn pipeline, tuV1 (webCRM), kiemTuongTac (HUB L29), tuổi lead + mức nhắc. */
const app = napApp(['js/api.js', 'js/modules/taichinh.js', 'js/modules/crm.js']);
const CRM = app.lay('ModuleCRM');
// Dữ liệu giả sinh lúc chạy (repo không chứa chuỗi giống SĐT / CCCD thật).
const SDT = '09' + '00 000 ' + '000', CCCD = '1'.repeat(12);
const NAY = new Date(2026, 10, 21, 18, 0);

mo('CRM – giai đoạn pipeline');
kiem('suy giai đoạn từ chữ TrangThai (có dấu / không dấu)', () => {
  const ca = [['Đang đàm phán', 'Báo giá'], ['da ky hop dong', 'Hợp đồng'], ['Đang hợp tác', 'Triển khai'],
    ['Gia hạn năm 2027', 'Tái ký'], ['Mới', 'Tiếp cận'], ['', 'Chưa rõ'], [null, 'Chưa rõ'], ['Tạm dừng', 'Chưa rõ']];
  ca.forEach(([vao, ra]) => assert.strictEqual(CRM.giaiDoan(vao), ra, 'giaiDoan(' + vao + ')'));
});
kiem('gdCua: cột GiaiDoan hợp lệ thắng TrangThai; lạ ➜ suy từ TrangThai', () => {
  assert.strictEqual(CRM.gdCua({ giaiDoan: 'Hợp đồng', trangThai: 'Mới' }), 'Hợp đồng');
  assert.strictEqual(CRM.gdCua({ giaiDoan: 'Linh tinh', trangThai: 'báo giá lần 2' }), 'Báo giá');
  assert.strictEqual(CRM.gdCua(null), 'Chưa rõ');
});

mo('CRM – tuV1 (webCRM)');
kiem('ánh xạ đủ trường, lead.luc ➜ thoiGian, coGiaiDoan chỉ bật khi cổng có khóa giaiDoan', () => {
  const k = CRM.tuV1({ doiTac: [{ ma: 'DT001', ten: 'Cty A' }], leadMoi: [{ ma: 'LD001', ten: 'B', luc: '20/11/2026 08:00' }] });
  assert.strictEqual(k.live, true); assert.strictEqual(k.coGiaiDoan, false); assert.strictEqual(k.tuongTac, null);
  assert.strictEqual(k.danhBa[0].giaiDoan, ''); assert.strictEqual(k.leadMoi[0].thoiGian, '20/11/2026 08:00');
  const k2 = CRM.tuV1({ doiTac: [{ ma: 'DT002', giaiDoan: '' }], tuongTac: [{ maDoiTac: 'DT002', kenh: 'Gọi' }] });
  assert.strictEqual(k2.coGiaiDoan, true); assert.strictEqual(k2.tuongTac.length, 1); assert.strictEqual(k2.tuongTac[0].noiDung, '');
});
kiem('đầu vào rỗng / null không vỡ', () => {
  const k = CRM.tuV1(null);
  assert.strictEqual(k.danhBa.length, 0); assert.strictEqual(k.leadMoi.length, 0);
});

mo('CRM – kiemTuongTac (luật Hub kiemTuongTac)');
kiem('hợp lệ: đối tác ➜ gói có maDoiTac, gộp khoảng trắng; lead ➜ maLead; kênh trống ➜ Khác', () => {
  const a = CRM.kiemTuongTac({ maDoiTac: 'DT001', kenh: 'Zalo', noiDung: '  Gửi   báo giá  ' });
  assert.deepStrictEqual(JSON.parse(JSON.stringify(a.goi)), { kenh: 'Zalo', noiDung: 'Gửi báo giá', maDoiTac: 'DT001' });
  const b = CRM.kiemTuongTac({ maLead: 'LD012', noiDung: 'Hẹn tuần sau' });
  assert.strictEqual(b.goi.maLead, 'LD012'); assert.strictEqual(b.goi.kenh, 'Khác'); assert.ok(!('maDoiTac' in b.goi));
});
kiem('lỗi: cả 2 / không mã, mã sai dạng, kênh lạ, rỗng, > 500 ký tự', () => {
  [{ maDoiTac: 'DT001', maLead: 'LD001', noiDung: 'x' }, { noiDung: 'x' }, { maDoiTac: 'D01', noiDung: 'x' },
    { maLead: 'LX001', noiDung: 'x' }, { maDoiTac: 'DT001', kenh: 'Fax', noiDung: 'x' }, { maDoiTac: 'DT001', noiDung: '   ' },
    { maDoiTac: 'DT001', noiDung: 'a'.repeat(501) }].forEach((du, i) => assert.ok(CRM.kiemTuongTac(du).loi, 'ca ' + i));
});
kiem('tường lửa: SĐT có khoảng trắng, CCCD, "BN" ➜ chặn; "BNA" không chặn', () => {
  ['Gọi ' + SDT, 'CCCD ' + CCCD, 'Hỏi BN phòng 3'].forEach(t => assert.ok(CRM.kiemTuongTac({ maDoiTac: 'DT001', noiDung: t }).loi, t));
  assert.ok(CRM.kiemTuongTac({ maDoiTac: 'DT001', noiDung: 'Gặp anh BNA bàn hợp đồng' }).goi);
});

mo('CRM – tuổi lead & nhắc chăm sóc');
kiem('tuoiLead đọc dd/mm/yyyy [hh:mm], "N giờ trước", "hh:mm hôm nay"; lạ ➜ null', () => {
  assert.strictEqual(CRM.tuoiLead('21/11/2026 06:00', NAY), 12);
  assert.strictEqual(CRM.tuoiLead('19/11/2026', NAY), 66);
  assert.strictEqual(CRM.tuoiLead('3 giờ trước', NAY), 3);
  assert.strictEqual(CRM.tuoiLead('2 ngày trước', NAY), 48);
  assert.strictEqual(CRM.tuoiLead('30 phút trước', NAY), 0.5);
  assert.strictEqual(CRM.tuoiLead('17:30 hôm nay', NAY), 0.5);
  assert.strictEqual(CRM.tuoiLead('hôm qua', NAY), null);
  assert.strictEqual(CRM.tuoiLead('', NAY), null);
});
kiem('mucLead: > 48 đỏ, 24–48 vàng, < 24 xanh, null/NaN ➜ rỗng', () => {
  assert.deepStrictEqual([49, 48, 24, 23.9, null, NaN].map(g => CRM.mucLead(g)), ['do', 'vang', 'vang', 'xanh', '', '']);
});
kiem('tinNhacLead: chỉ lead chưa xử lý, 🔴 trước 🟡, bỏ lead xanh', () => {
  const t = CRM.tinNhacLead([
    { ten: 'A', nguon: 'Web', thoiGian: '20/11/2026 12:00' },
    { ten: 'B', nguon: 'Zalo', thoiGian: '18/11/2026' },
    { ten: 'C', nguon: 'FB', thoiGian: '21/11/2026 17:00' },
    { ten: 'D', nguon: 'FB', thoiGian: '10/11/2026', trangThai: 'Đã chăm sóc' }
  ], NAY);
  const s = String(t);
  assert.ok(s.indexOf('🔴 B') >= 0 && s.indexOf('🟡 A') > s.indexOf('🔴 B'), s);
  assert.ok(s.indexOf(' C ') < 0 && s.indexOf(' D ') < 0, s);
});
