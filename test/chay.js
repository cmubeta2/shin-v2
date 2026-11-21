#!/usr/bin/env node
/**
 * SHIN v2 – Bộ kiểm thử hàm THUẦN (v2.16.2, nhóm A tuần 23–29/11).
 * Chạy: node test/chay.js            (mọi tệp test/*.test.js)
 *       node test/chay.js vietqr     (chỉ tệp có tên chứa "vietqr")
 * Không cần trình duyệt, không gọi mạng, không cần token: nạp tệp JS của app vào 1 ngữ cảnh vm
 * với window / document / localStorage giả tối thiểu, rồi gọi thẳng các hàm THUẦN.
 * Thoát mã 1 khi có ca trượt (để lượt tự động chặn đẩy code).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const GOC = path.resolve(__dirname, '..');

/** Tạo ngữ cảnh giả lập trình duyệt + nạp các tệp JS (đường dẫn tương đối gốc repo). */
function napApp(tep) {
  const kho = {};
  const localStorage = {
    getItem: k => (Object.prototype.hasOwnProperty.call(kho, k) ? kho[k] : null),
    setItem: (k, v) => { kho[k] = String(v); },
    removeItem: k => { delete kho[k]; },
    clear: () => { for (const k of Object.keys(kho)) delete kho[k]; }
  };
  const phanTuGia = () => ({ style: {}, classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
    setAttribute() {}, getAttribute: () => null, appendChild() {}, addEventListener() {}, querySelector: () => null,
    querySelectorAll: () => [], innerHTML: '', textContent: '', value: '' });
  const document = { getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: phanTuGia, addEventListener() {}, body: phanTuGia(), documentElement: phanTuGia(), readyState: 'complete' };
  const ShinApp = {
    esc: s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])),
    soVN: n => Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.'),
    docSoVN: s => { const t = String(s == null ? '' : s).replace(/[^\d-]/g, ''); return t ? Number(t) : NaN; },
    ngayVN: () => '21/11/2026',
    toast() {}, rung() {}, mangDuocHien: null
  };
  const ctx = {
    console, TextEncoder, TextDecoder, URL, URLSearchParams, setTimeout, clearTimeout, Math, Date, JSON,
    localStorage, sessionStorage: localStorage, document, ShinApp,
    navigator: { userAgent: 'node-test', onLine: true }, location: { href: 'https://localhost/', origin: 'https://localhost', search: '', hash: '' },
    fetch: () => Promise.reject(new Error('Bộ kiểm thử không gọi mạng.'))
  };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  for (const t of tep) {
    const ma = fs.readFileSync(path.join(GOC, t), 'utf8');
    vm.runInContext(ma, ctx, { filename: t });
  }
  // `const X = …` cấp cao nhất nằm trong phạm vi chung của ngữ cảnh – lấy ra bằng 1 biểu thức.
  ctx.lay = ten => vm.runInContext(ten, ctx);
  return ctx;
}

// ===== Khung ca kiểm =====
const ca = [];
let nhom = '';
global.mo = ten => { nhom = ten; };
global.kiem = (ten, ham) => ca.push({ nhom, ten, ham });
global.assert = assert;
global.napApp = napApp;

const loc = (process.argv[2] || '').toLowerCase();
const tepKiem = fs.readdirSync(__dirname).filter(f => f.endsWith('.test.js') && f.toLowerCase().includes(loc)).sort();
tepKiem.forEach(f => require(path.join(__dirname, f)));

let dat = 0;
const truot = [];
let nhomCu = '';
for (const c of ca) {
  if (c.nhom !== nhomCu) { console.log('\n▸ ' + c.nhom); nhomCu = c.nhom; }
  try { c.ham(); dat++; console.log('  ✓ ' + c.ten); }
  catch (e) { truot.push(c); console.log('  ✗ ' + c.ten + '\n    ' + String(e && e.message || e).split('\n').join('\n    ')); }
}
console.log(`\nKET_QUA: ${dat}/${ca.length} đạt` + (truot.length ? ` · ${truot.length} TRƯỢT` : '') + ` · ${tepKiem.length} tệp`);
process.exit(truot.length ? 1 : 0);
