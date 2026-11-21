/* Kiểm 📋 PTKH: ⏱️ Giờ công & tăng ca M5.4 + xuất TC-NS M3.5 – PTKH L581 webGioCongThang (v2.16.6). */
const app = napApp(['js/demo_data.js', 'js/modules/ptkh.js']);
const PT = app.lay('ModulePTKH');

mo('PTKH – giờ công & TC-NS (L581)');
kiem('tomTatGioCong: chuẩn hóa số, bỏ dòng rỗng, tự cộng tổng', () => {
  const t = PT.tomTatGioCong({ thang: '2026-11', tenThang: '11/2026', nv: [
    { ma: '1', hoTen: 'A', ngayCong: 15, truNTC: 0.5, tongCong: 14.5, gioTC: 3.333 }, null, {}, { ma: '2', hoTen: 'B', ngayCong: 'x', tongCong: -1, gioTC: '2' }] });
  assert.strictEqual(t.nv.length, 2);
  assert.strictEqual(t.nv[0].gioTC, 3.33); assert.strictEqual(t.nv[1].ngayCong, 0); assert.strictEqual(t.nv[1].tongCong, 0); assert.strictEqual(t.nv[1].gioTC, 2);
  assert.deepStrictEqual(JSON.parse(JSON.stringify(t.tong)), { soNV: 2, ngayCong: 15, tongCong: 14.5, gioTC: 5.33 });
  assert.strictEqual(PT.tomTatGioCong(null).nv.length, 0);
});
kiem('csvTCNS: BOM, tiêu đề, dòng tổng, ngoặc kép, chặn chèn công thức', () => {
  const t = PT.tomTatGioCong({ thang: '2026-11', nv: [{ ma: '1', hoTen: '=HYPERLINK("x")', donVi: 'Tổ "A"', ngayCong: 1, tongCong: 1, gioTC: 2 }] });
  const c = PT.csvTCNS(t);
  assert.ok(c.startsWith('﻿"Mã NV","Họ tên"'));
  assert.ok(c.includes('"\'=HYPERLINK(""x"")"'), 'ô bắt đầu bằng = phải thêm dấu nháy đơn');
  assert.ok(c.includes('"Tổ ""A"""'));
  assert.ok(c.includes('"TỔNG (1 NV)"'));
  assert.strictEqual(c.trim().split('\r\n').length, 3);
});
kiem('veGioCong Demo: bảng MẪU + nút xuất; tháng này / tháng trước', () => {
  const h = PT.veGioCong(app.window.SHIN_DEMO_DATA.ptkh);
  assert.ok(h.includes('MẪU') && h.includes('8,5 giờ tăng ca') && h.includes('Xuất bảng TC-NS'));
  assert.ok(h.includes('Tháng này') && h.includes('Tháng trước'));
});
kiem('veGioCong Live lỗi ➜ đỏ + ghi "Còn chờ v1" L581; chưa bấm ➜ không có bảng', () => {
  PT._gc = { thang: '2026-11', loi: 'Máy chủ báo lỗi khi xử lý. (Hàm không có)' };
  const h = PT.veGioCong({ live: true });
  assert.ok(h.includes('canh-bao-nguon loi') && h.includes('Còn chờ v1') && h.includes('L581'));
  PT._gc = null;
  assert.ok(!PT.veGioCong({ live: true }).includes('Xuất bảng TC-NS'));
});
