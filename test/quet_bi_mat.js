#!/usr/bin/env node
/**
 * SHIN v2 – Quét bí mật trước khi đẩy (v2.16.8). Node thuần, không cài gói.
 * Chạy:  node test/quet_bi_mat.js            quét các dòng THÊM MỚI trong `git diff --cached` (mặc định – chạy sau git add)
 *        node test/quet_bi_mat.js --tat-ca   quét mọi tệp đang theo dõi (git ls-files) – rà định kỳ
 *        node test/quet_bi_mat.js <tệp…>     quét các tệp chỉ định
 * Chặn: id Google Sheet / Drive (44 ký tự), token Hub h1.…, khóa API (Anthropic / OpenAI / Google), token Telegram Bot,
 *       link Apps Script /exec MỚI (AKfyc… chưa có trong js/api.js), SĐT VN, số CCCD 12 số, mã thẻ BHYT, số tài khoản
 *       ngân hàng đứng cạnh chữ "STK / số tài khoản", khóa riêng PEM.
 * Không bao giờ in nguyên giá trị vi phạm – chỉ in tệp:dòng + loại + 4 ký tự cuối đã che.
 * Bỏ qua 1 dòng có chủ ý: thêm chú thích `quet:bo-qua` trên CHÍNH dòng đó (phải có lý do trong chú thích).
 * Dữ liệu giả trong test/*.test.js: ghép chuỗi lúc chạy ('09' + '00…') để mã nguồn không chứa chuỗi giống thật.
 * Thoát mã 1 khi có vi phạm (lượt tự động chặn đẩy).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const GOC = path.resolve(__dirname, '..');
const git = args => execFileSync('git', args, { cwd: GOC, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

// Link /exec đã công khai sẵn trong js/api.js (repo công khai) – không coi là rò mới.
let EXEC_CO_SAN = new Set();
try {
  const api = fs.readFileSync(path.join(GOC, 'js/api.js'), 'utf8');
  EXEC_CO_SAN = new Set(api.match(/AKfyc[A-Za-z0-9_-]{20,}/g) || []);
} catch (e) { /* chạy ngoài repo */ }

/** Số giống giả / không phải dữ liệu người: toàn 1 chữ số, chuỗi VietQR EMVCo (000201…), số tròn (≥ 6 số 0 cuối). */
const laSoGia = s => /^(\d)\1+$/.test(s) || /^000201/.test(s) || /0{6}$/.test(s) || /12345678|23456789/.test(s);

/** THUẦN. 1 dòng ➜ [{loai, mau}] (mau = 4 ký tự cuối đã che). */
function quetDong(dong) {
  if (/quet:bo-qua/.test(dong)) return [];
  const ra = [];
  const them = (loai, gt) => ra.push({ loai, mau: '…' + String(gt).slice(-4).replace(/[A-Za-z0-9]/g, '•').slice(0, 2) + String(gt).slice(-2) });
  let m;
  // Khóa / token
  if ((m = dong.match(/\bh1\.[\w-]+\.[\w-]+\.[\w-]{16,}/))) them('token Hub h1.…', m[0]);
  if ((m = dong.match(/\bsk-(ant-)?[A-Za-z0-9_-]{24,}/))) them('khóa API (sk-…)', m[0]);
  if ((m = dong.match(/\bAIza[0-9A-Za-z_-]{35}\b/))) them('khóa Google API', m[0]);
  if ((m = dong.match(/\b\d{8,10}:[A-Za-z0-9_-]{35}\b/))) them('token Telegram Bot', m[0]);
  if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(dong)) them('khóa riêng PEM', 'PEM-');
  // Link Apps Script /exec mới
  for (const a of dong.match(/AKfyc[A-Za-z0-9_-]{20,}/g) || []) if (!EXEC_CO_SAN.has(a)) them('link Apps Script mới (AKfyc…)', a);
  // Id Google Sheet / Drive: đúng 44 ký tự, có cả chữ và số, không nằm trong chuỗi AKfyc dài hơn
  const boAKfyc = dong.replace(/AKfyc[A-Za-z0-9_-]+/g, ' ');
  for (const id of boAKfyc.match(/(?<![A-Za-z0-9_-])[A-Za-z0-9_-]{44}(?![A-Za-z0-9_-])/g) || [])
    if (/[0-9]/.test(id) && /[A-Z]/.test(id) && /[a-z]/.test(id)) them('id Google Sheet / Drive', id);
  // SĐT VN (cho phép dấu cách / chấm / gạch giữa nhóm số), +84 / 84
  const chiSo = dong.replace(/(\d)[ .-](?=\d)/g, '$1');
  for (const s of chiSo.match(/(?<![\d\w])(?:\+?84|0)[35789]\d{8}(?!\d)/g) || []) {
    const so = s.replace(/^\+?84/, '0');
    if (!laSoGia(so.slice(2)) && !/^0[35789]0{8}$/.test(so)) them('số điện thoại', so);
  }
  // CCCD 12 số
  for (const s of dong.match(/(?<![\w.,])\d{12}(?![\d.,])/g) || []) if (!laSoGia(s)) them('số CCCD 12 số', s);
  // BHYT
  if ((m = dong.match(/\b[A-Z]{2}[1-5]\d{12}\b/)) && !laSoGia(m[0].slice(3))) them('mã thẻ BHYT', m[0]);
  // Số tài khoản ngân hàng cạnh từ khóa
  if ((m = dong.match(/(?:\bSTK\b|s[ốo] t[àa]i kho[ảa]n|account(?:No|Number)?)\W{0,6}(\d[\d .-]{6,18}\d)/i))) {
    const so = m[1].replace(/\D/g, '');
    if (so.length >= 8 && !laSoGia(so)) them('số tài khoản ngân hàng', so);
  }
  return ra;
}

/** Danh sách [{tep, dong, noiDung}] cần quét theo chế độ. */
function layDong(argv) {
  const ra = [];
  const boQuaTep = t => /(^|\/)(node_modules|\.git)\//.test(t) || /\.(png|jpe?g|gif|ico|webp|woff2?|ttf|pdf|zip)$/i.test(t) || /desktop\.ini$/i.test(t);
  const quetTep = t => {
    if (boQuaTep(t)) return;
    let nd = '';
    try { nd = fs.readFileSync(path.join(GOC, t), 'utf8'); } catch (e) { return; }
    nd.split(/\r?\n/).forEach((d, i) => ra.push({ tep: t, dong: i + 1, noiDung: d }));
  };
  if (argv[0] === '--tat-ca') { git(['ls-files']).split('\n').filter(Boolean).forEach(quetTep); return ra; }
  if (argv.length) { argv.forEach(t => quetTep(path.relative(GOC, path.resolve(t)).replace(/\\/g, '/'))); return ra; }
  // Mặc định: dòng thêm mới trong diff đã git add
  let tep = '', so = 0;
  for (const d of git(['diff', '--cached', '-U0', '--no-color']).split('\n')) {
    if (d.startsWith('+++ ')) { tep = d.slice(4).replace(/^b\//, ''); continue; }
    const h = d.match(/^@@ -\d+(?:,\d+)? \+(\d+)/);
    if (h) { so = +h[1]; continue; }
    if (d.startsWith('+') && !boQuaTep(tep)) { ra.push({ tep, dong: so, noiDung: d.slice(1) }); so++; }
  }
  return ra;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  const dong = layDong(argv);
  const vp = [];
  for (const d of dong) for (const x of quetDong(d.noiDung)) vp.push(`${d.tep}:${d.dong} – ${x.loai} (${x.mau})`);
  const cheDo = argv[0] === '--tat-ca' ? 'mọi tệp theo dõi' : argv.length ? argv.length + ' tệp' : 'git diff --cached';
  if (vp.length) {
    console.log(`QUET_BI_MAT: ${vp.length} VI PHẠM (${cheDo}, ${dong.length} dòng)\n  ` + vp.join('\n  '));
    console.log('➜ Xóa giá trị thật / ghép chuỗi giả lúc chạy, hoặc thêm "quet:bo-qua <lý do>" nếu chắc chắn không phải dữ liệu thật.');
    process.exit(1);
  }
  console.log(`QUET_BI_MAT: SẠCH (${cheDo}, ${dong.length} dòng)`);
}

module.exports = { quetDong };
