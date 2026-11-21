/* Kiểm trình quét bí mật test/quet_bi_mat.js (quetDong THUẦN). Mọi giá trị giả ghép lúc chạy – mã nguồn không chứa chuỗi giống thật. */
const { quetDong } = require('./quet_bi_mat.js');
const S = (...a) => a.join('');
const loai = d => quetDong(d).map(x => x.loai);

mo('Quét bí mật – phải bắt');
[
  [S('Gọi 09', '12 777 ', '4', '31'), 'số điện thoại'],
  [S('+84 9', '8 765 4', '321'), 'số điện thoại'],
  [S('cccd ', '0790', '1928', '3746'), 'số CCCD 12 số'],
  [S('DN4', '2847', '3916', '5027'), 'mã thẻ BHYT'],
  [S('h1.', 'abc.', 'def.', 'x'.repeat(20)), 'token Hub h1.…'],
  [S('sk-', 'ant-', 'a'.repeat(30)), 'khóa API (sk-…)'],
  [S('AI', 'za', 'B'.repeat(35)), 'khóa Google API'],
  [S('1', '2345678', ':', 'A'.repeat(35)), 'token Telegram Bot'],
  [S('1Bx', '9'.repeat(5), 'aB'.repeat(18)), 'id Google Sheet / Drive'],
  [S('STK: ', '1903', '5566', '7788'), 'số tài khoản ngân hàng'],
  [S('AKfyc', 'Z'.repeat(40)), 'link Apps Script mới (AKfyc…)'],
  [S('-----BEGIN ', 'PRIVATE KEY-----'), 'khóa riêng PEM']
].forEach(([d, l]) => kiem(l, () => assert.ok(loai(d).indexOf(l) >= 0, JSON.stringify(quetDong(d)))));
kiem('không in nguyên giá trị – chỉ 2 ký tự cuối', () => {
  const r = quetDong(S('cccd ', '0790', '1928', '3746'))[0];
  assert.ok(r.mau.length <= 5 && r.mau.indexOf('0790') < 0, r.mau);
});

mo('Quét bí mật – không báo nhầm');
kiem('chuỗi VietQR, số tròn, mã có tiền tố chữ, số mẫu 0900…, dãy 12345678, dòng quet:bo-qua', () => {
  ['000201010212', S('182', '000000000'), S('GV', '2610', '2922', '1500'), 'tienDo: 100', S('09', '00000000'),
    S('SĐT mẫu 09', '12.345.678'), S('x quet:bo-qua mẫu ', '09', '12 777 431')]
    .forEach(d => assert.deepStrictEqual(quetDong(d), [], d));
});
kiem('link /exec đã có trong js/api.js không bị báo', () => {
  const api = require('fs').readFileSync(require('path').join(__dirname, '..', 'js/api.js'), 'utf8');
  const a = (api.match(/AKfyc[A-Za-z0-9_-]{20,}/) || [''])[0];
  assert.ok(a, 'js/api.js phải có link /exec');
  assert.deepStrictEqual(quetDong("HUB: 'https://script.google.com/macros/s/" + a + "/exec'"), []);
});
