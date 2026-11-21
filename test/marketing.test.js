/* Kiểm hàm THUẦN 📣 Marketing: khuôn PAS/AIDA (M8.2), từ cấm y tế, chốt duyệt (M8.4), phân luồng lead (M8.3), hiệu suất (M8.6). */
const app = napApp(['js/modules/marketing.js']);
const MK = app.lay('ModuleMarketing');

mo('Marketing – khuôn & duyệt');
kiem('dienKhuon điền biến, biến trống giữ nguyên {{bien}}', () => {
  assert.strictEqual(MK.dienKhuon('Chào {{ten}}, ưu đãi {{uuDai}}', { ten: 'anh Nam', uuDai: '  ' }), 'Chào anh Nam, ưu đãi {{uuDai}}');
});
kiem('thieuBien liệt kê biến còn trống', () => {
  assert.deepStrictEqual(Array.from(MK.thieuBien({ bien: ['{{a}}', '{{b}}'] }, { a: 'x' })), ['b']);
  assert.deepStrictEqual(Array.from(MK.thieuBien(null, null)), []);
});
kiem('kiemTuCam: chỉ mảng y tế, gộp cụm trùng', () => {
  const ra = Array.from(MK.kiemTuCam('Phòng khám tốt nhất, cam kết khỏi 100%', 'phongkham'));
  assert.ok(ra.includes('tốt nhất') && ra.includes('100%') && ra.includes('cam kết khỏi'));
  assert.ok(!ra.includes('nhất'), 'cụm "nhất" nằm trong "tốt nhất" ➜ bỏ');
  assert.strictEqual(MK.kiemTuCam('tốt nhất', 'tuyensinh').length, 0);
});
kiem('chuyen: nhap ➜ cho_duyet ➜ san_sang; bước sai ➜ null', () => {
  assert.strictEqual(MK.chuyen('nhap', 'gui'), 'cho_duyet');
  assert.strictEqual(MK.chuyen('cho_duyet', 'duyet'), 'san_sang');
  assert.strictEqual(MK.chuyen('cho_duyet', 'tra'), 'tra_lai');
  assert.strictEqual(MK.chuyen('tra_lai', 'gui'), 'cho_duyet');
  assert.strictEqual(MK.chuyen('san_sang', 'sua'), 'nhap');
  assert.strictEqual(MK.chuyen('nhap', 'duyet'), null, 'không được bỏ qua người duyệt');
  assert.strictEqual(MK.chuyen(undefined, 'gui'), 'cho_duyet');
});

mo('Marketing – Smart Lead Dispatcher M8.3');
kiem('KSK doanh nghiệp (từ khóa hoặc tên công ty)', () => {
  assert.strictEqual(MK.phanLuongLead({ nguon: 'Form', ghiChu: 'Khám sức khỏe định kỳ 50 người' }).luong, 'ksk');
  assert.strictEqual(MK.phanLuongLead({ ten: 'Công ty ABC', ghiChu: '' }).luong, 'ksk');
  assert.strictEqual(MK.phanLuongLead({ slKham: 30 }).luong, 'ksk');
});
kiem('tuyển sinh / đặt khám / đối tác / khác', () => {
  assert.strictEqual(MK.phanLuongLead({ ghiChu: 'Hỏi học phí ngành điều dưỡng' }).luong, 'tuyensinh');
  assert.strictEqual(MK.phanLuongLead({ khoa: 'K5' }).luong, 'tuyensinh');
  assert.strictEqual(MK.phanLuongLead({ ghiChu: 'Muốn đặt lịch khám bệnh' }).luong, 'phongkham');
  assert.strictEqual(MK.phanLuongLead({ ghiChu: 'Muốn làm CTV' }).luong, 'doitac');
  const k = MK.phanLuongLead({ ghiChu: 'xin chào' });
  assert.strictEqual(k.luong, 'khac'); assert.strictEqual(k.module, 'crm');
});
kiem('thứ tự ưu tiên: KSK trước Tuyển sinh; Đặt khám chuyển PK', () => {
  assert.strictEqual(MK.phanLuongLead({ ghiChu: 'doanh nghiệp cần khóa học sơ cứu' }).luong, 'ksk');
  assert.strictEqual(MK.phanLuongLead({ ghiChu: 'đặt khám' }).module, 'phongkham');
});

mo('Marketing – hiệu suất M8.6');
kiem('soNhap: dấu nghìn, k, rỗng, sai', () => {
  assert.strictEqual(MK.soNhap('1.200'), 1200);
  assert.strictEqual(MK.soNhap('3.000.000'), 3000000);
  assert.strictEqual(MK.soNhap('1,2k'), 1200);
  assert.strictEqual(MK.soNhap(''), null);
  assert.strictEqual(MK.soNhap('abc'), null);
  assert.strictEqual(MK.soNhap('-5'), null);
});
kiem('tongHieuSuat: gom kênh, sắp reach giảm, tỷ lệ 1 chữ số, reach 0 ➜ null', () => {
  const k = MK.tongHieuSuat([
    { kenh: 'fb', reach: 1000, tuongTac: 55, click: 12, lead: 3 },
    { kenh: 'fb', reach: 1000, tuongTac: 45, click: 8, lead: 1 },
    { kenh: 'zalo', reach: 3000, tuongTac: 30, click: 30, lead: 6 },
    { kenh: 'web', reach: 0, tuongTac: 0, click: 0, lead: 0 }
  ]);
  assert.deepStrictEqual(Array.from(k.theoKenh, x => x.kenh), ['zalo', 'fb', 'web']);
  const fb = k.theoKenh[1];
  assert.strictEqual(fb.soBai, 2); assert.strictEqual(fb.tyLeTT, 5); assert.strictEqual(fb.ctr, 1); assert.strictEqual(fb.leadNghin, 2);
  assert.strictEqual(k.theoKenh[2].tyLeTT, null);
  assert.strictEqual(k.tong.reach, 5000); assert.strictEqual(k.tong.lead, 10);
});
