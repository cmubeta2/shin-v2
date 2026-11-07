/**
 * SHIN v2 – M3.1 Mã VietQR nhận tiền, sinh HOÀN TOÀN trên trình duyệt (v2.10.4).
 * - Chuỗi VietQR theo EMVCo MPM + NAPAS 247 (tag 38: A000000727 · BIN · số TK · QRIBFTTA), CRC-16/CCITT-FALSE.
 * - Bộ mã hóa QR thuần (byte mode, mức sửa lỗi M, phiên bản 1–20, tự chọn mặt nạ) – KHÔNG gọi dịch vụ ảnh QR bên ngoài
 *   (không lộ số tài khoản / số tiền ra máy chủ thứ ba).
 * - Số tài khoản do người dùng nhập, chỉ lưu localStorage máy này (khóa shin_vietqr_tk) – KHÔNG có trong repo,
 *   không nằm trong mã cấu hình SHINCFG1 (danh sách khóa trắng).
 * - Chưa xác nhận đã nhận tiền: Còn chờ v1 (webhook SePay).
 */
const ShinVietQR = (function() {
  'use strict';

  // ===== Bảng mức M (phiên bản 1–20) =====
  const ECC_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26];
  const BLK_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16];

  function soModuleTho(ver) {
    let r = (16 * ver + 128) * ver + 64;
    if (ver >= 2) { const na = Math.floor(ver / 7) + 2; r -= (25 * na - 10) * na - 55; if (ver >= 7) r -= 36; }
    return r;
  }
  const soCwDuLieu = ver => Math.floor(soModuleTho(ver) / 8) - ECC_M[ver] * BLK_M[ver];

  // ===== Reed–Solomon trên GF(256), đa thức 0x11D =====
  function nhanGF(x, y) {
    let z = 0;
    for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; }
    return z & 0xFF;
  }
  function boChiaRS(bac) {
    const r = new Array(bac).fill(0); r[bac - 1] = 1;
    let goc = 1;
    for (let i = 0; i < bac; i++) {
      for (let j = 0; j < r.length; j++) { r[j] = nhanGF(r[j], goc); if (j + 1 < r.length) r[j] ^= r[j + 1]; }
      goc = nhanGF(goc, 0x02);
    }
    return r;
  }
  function duRS(duLieu, chia) {
    const r = chia.map(() => 0);
    for (const b of duLieu) {
      const f = b ^ r.shift(); r.push(0);
      chia.forEach((c, i) => { r[i] ^= nhanGF(c, f); });
    }
    return r;
  }

  function viTriCanChinh(ver) {
    if (ver === 1) return [];
    const na = Math.floor(ver / 7) + 2, buoc = Math.floor((ver * 8 + na * 3 + 5) / (na * 4 - 4)) * 2;
    const r = [6];
    for (let p = ver * 4 + 10; r.length < na; p -= buoc) r.splice(1, 0, p);
    return r;
  }

  /** Chuỗi ➜ { n, m: ma trận boolean (true = ô đậm), ver, mask }. Ném lỗi khi quá dài. */
  function maHoa(chu) {
    const bytes = Array.from(new TextEncoder().encode(String(chu)));
    let ver = 1;
    for (; ver <= 20; ver++) if (4 + (ver < 10 ? 8 : 16) + bytes.length * 8 <= soCwDuLieu(ver) * 8) break;
    if (ver > 20) throw new Error('Chuỗi quá dài cho mã QR.');
    const bits = [], them = (v, k) => { for (let i = k - 1; i >= 0; i--) bits.push((v >>> i) & 1); };
    them(4, 4); them(bytes.length, ver < 10 ? 8 : 16); bytes.forEach(b => them(b, 8));
    const sucChua = soCwDuLieu(ver) * 8;
    them(0, Math.min(4, sucChua - bits.length)); them(0, (8 - bits.length % 8) % 8);
    for (let p = 0xEC; bits.length < sucChua; p ^= 0xEC ^ 0x11) them(p, 8);
    const duLieu = [];
    for (let i = 0; i < bits.length; i += 8) { let b = 0; for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j]; duLieu.push(b); }

    // Chia khối + sửa lỗi + đan xen
    const nb = BLK_M[ver], dEcc = ECC_M[ver], tho = Math.floor(soModuleTho(ver) / 8);
    const nNgan = nb - tho % nb, dNgan = Math.floor(tho / nb), chia = boChiaRS(dEcc), khoi = [];
    for (let i = 0, k = 0; i < nb; i++) {
      const d = duLieu.slice(k, k + dNgan - dEcc + (i < nNgan ? 0 : 1)); k += d.length;
      const ecc = duRS(d, chia);
      if (i < nNgan) d.push(0);
      khoi.push(d.concat(ecc));
    }
    const cw = [];
    for (let i = 0; i < khoi[0].length; i++) khoi.forEach((b, j) => { if (i !== dNgan - dEcc || j >= nNgan) cw.push(b[i]); });

    // Ma trận + vùng chức năng
    const n = ver * 4 + 17;
    const m = [...Array(n)].map(() => new Array(n).fill(false)), cn = [...Array(n)].map(() => new Array(n).fill(false));
    const dat = (x, y, v) => { m[y][x] = v; cn[y][x] = true; };
    for (let i = 0; i < n; i++) { dat(6, i, i % 2 === 0); dat(i, 6, i % 2 === 0); }
    const timVuong = (x, y) => {
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy)), xx = x + dx, yy = y + dy;
        if (xx >= 0 && xx < n && yy >= 0 && yy < n) dat(xx, yy, d !== 2 && d !== 4);
      }
    };
    timVuong(3, 3); timVuong(n - 4, 3); timVuong(3, n - 4);
    const vt = viTriCanChinh(ver), na = vt.length;
    for (let i = 0; i < na; i++) for (let j = 0; j < na; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === na - 1) || (i === na - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) dat(vt[i] + dx, vt[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
    }
    const datDinhDang = mask => {
      const d = (0 << 3) | mask;   // mức M = 00
      let r = d; for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
      const b = ((d << 10) | r) ^ 0x5412, bit = i => ((b >>> i) & 1) !== 0;
      for (let i = 0; i <= 5; i++) dat(8, i, bit(i));
      dat(8, 7, bit(6)); dat(8, 8, bit(7)); dat(7, 8, bit(8));
      for (let i = 9; i < 15; i++) dat(14 - i, 8, bit(i));
      for (let i = 0; i < 8; i++) dat(n - 1 - i, 8, bit(i));
      for (let i = 8; i < 15; i++) dat(8, n - 15 + i, bit(i));
      dat(8, n - 8, true);
    };
    datDinhDang(0);
    if (ver >= 7) {
      let r = ver; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
      const b = (ver << 12) | r;
      for (let i = 0; i < 18; i++) { const v = ((b >>> i) & 1) !== 0, a = n - 11 + i % 3, c = Math.floor(i / 3); dat(a, c, v); dat(c, a, v); }
    }
    // Đặt codeword (zigzag)
    let k = 0;
    for (let phai = n - 1; phai >= 1; phai -= 2) {
      if (phai === 6) phai = 5;
      for (let doc = 0; doc < n; doc++) for (let j = 0; j < 2; j++) {
        const x = phai - j, len = ((phai + 1) & 2) === 0, y = len ? n - 1 - doc : doc;
        if (!cn[y][x] && k < cw.length * 8) { m[y][x] = ((cw[k >>> 3] >>> (7 - (k & 7))) & 1) !== 0; k++; }
      }
    }
    const apMask = q => {
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
        let dao;
        switch (q) {
          case 0: dao = (x + y) % 2 === 0; break;
          case 1: dao = y % 2 === 0; break;
          case 2: dao = x % 3 === 0; break;
          case 3: dao = (x + y) % 3 === 0; break;
          case 4: dao = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: dao = x * y % 2 + x * y % 3 === 0; break;
          case 6: dao = (x * y % 2 + x * y % 3) % 2 === 0; break;
          default: dao = ((x + y) % 2 + x * y % 3) % 2 === 0;
        }
        if (!cn[y][x] && dao) m[y][x] = !m[y][x];
      }
    };
    const diemPhat = () => {
      let p = 0, dam = 0;
      const dong = i => m[i].map(v => v ? 1 : 0).join(''), cot = i => m.map(r => r[i] ? 1 : 0).join('');
      for (let i = 0; i < n; i++) for (const s of [dong(i), cot(i)]) {
        (s.match(/0{5,}|1{5,}/g) || []).forEach(t => { p += t.length - 2; });
        p += ((s.match(/(?=1011101(0000))|(?=(0000)1011101)/g) || []).length) * 40;
      }
      for (let y = 0; y < n - 1; y++) for (let x = 0; x < n - 1; x++) {
        const v = m[y][x];
        if (v === m[y][x + 1] && v === m[y + 1][x] && v === m[y + 1][x + 1]) p += 3;
      }
      m.forEach(r => r.forEach(v => { if (v) dam++; }));
      return p + Math.floor(Math.abs(dam * 20 - n * n * 10) / (n * n)) * 10;
    };
    let tot = 0, diemTot = Infinity;
    for (let q = 0; q < 8; q++) { apMask(q); datDinhDang(q); const d = diemPhat(); if (d < diemTot) { diemTot = d; tot = q; } apMask(q); }
    apMask(tot); datDinhDang(tot);
    return { n, m, ver, mask: tot };
  }

  // ===== VietQR (EMVCo) =====
  const tlv = (id, v) => { v = String(v); return id + String(v.length).padStart(2, '0') + v; };
  function crc16(s) {
    let crc = 0xFFFF;
    for (const b of new TextEncoder().encode(s)) {
      crc ^= b << 8;
      for (let i = 0; i < 8; i++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }
  /** Bỏ dấu tiếng Việt + ký tự lạ, gộp khoảng trắng, cắt ≤ 25 ký tự (nội dung chuyển khoản). */
  function noiDungSach(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^A-Za-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 25).trim();
  }
  /** THUẦN. {bin, soTK, soTien, noiDung} ➜ {chuoi} hoặc {loi}. soTien 0/rỗng ➜ QR tĩnh (người chuyển tự nhập tiền). */
  function chuoiVietQR(p) {
    p = p || {};
    const bin = String(p.bin || '').trim(), tk = String(p.soTK || '').replace(/\s+/g, '');
    const tien = p.soTien === '' || p.soTien === null || p.soTien === undefined ? 0 : Number(p.soTien);
    if (!/^\d{6}$/.test(bin)) return { loi: 'Chọn ngân hàng (mã BIN 6 số).' };
    if (!/^[0-9A-Za-z]{4,19}$/.test(tk)) return { loi: 'Số tài khoản 4–19 ký tự chữ / số.' };
    if (!isFinite(tien) || tien < 0 || Math.round(tien) !== tien) return { loi: 'Số tiền phải là số đồng nguyên ≥ 0.' };
    if (tien > 9999999999999) return { loi: 'Số tiền quá lớn.' };
    const nd = noiDungSach(p.noiDung);
    const m38 = tlv('00', 'A000000727') + tlv('01', tlv('00', bin) + tlv('01', tk)) + tlv('02', 'QRIBFTTA');
    let s = tlv('00', '01') + tlv('01', tien > 0 ? '12' : '11') + tlv('38', m38) + tlv('53', '704') +
      (tien > 0 ? tlv('54', String(tien)) : '') + tlv('58', 'VN') + (nd ? tlv('62', tlv('08', nd)) : '') + '6304';
    return { chuoi: s + crc16(s), noiDung: nd };
  }

  /** Ma trận ➜ SVG (vùng lặng 4 ô). Màu qua biến CSS, mặc định đen trên trắng để app ngân hàng quét được ở mọi bộ màu. */
  function svg(q, nhan) {
    const z = q.n + 8;
    let d = '';
    for (let y = 0; y < q.n; y++) for (let x = 0; x < q.n; x++) if (q.m[y][x]) d += `M${x + 4} ${y + 4}h1v1h-1z`;
    return `<svg viewBox="0 0 ${z} ${z}" role="img" aria-label="${nhan || 'Mã VietQR'}" shape-rendering="crispEdges" style="width:100%;max-width:280px;display:block;margin:0 auto;background:var(--qr-nen,#fff)">` +
      `<path d="${d}" fill="var(--qr-dam,#000)"/></svg>`;
  }

  // ===== Giao diện (khối gập trong 💰 Tài chính) =====
  const KHOA = 'shin_vietqr_tk';
  const NGAN_HANG = [['970436', 'Vietcombank'], ['970415', 'VietinBank'], ['970418', 'BIDV'], ['970405', 'Agribank'], ['970407', 'Techcombank'],
    ['970422', 'MB Bank'], ['970416', 'ACB'], ['970432', 'VPBank'], ['970403', 'Sacombank'], ['970423', 'TPBank'], ['970441', 'VIB'],
    ['970443', 'SHB'], ['970437', 'HDBank'], ['970448', 'OCB'], ['970426', 'MSB'], ['970440', 'SeABank'], ['970431', 'Eximbank'], ['970449', 'LPBank']];
  const docTK = () => { try { const o = JSON.parse(localStorage.getItem(KHOA) || 'null'); return o && o.bin && o.soTK ? o : null; } catch (e) { return null; } };
  const an = tk => '•••• ' + String(tk).slice(-4);

  function veKhoi() {
    const e = ShinApp.esc, tk = docTK();
    const ten = tk ? ((NGAN_HANG.find(x => x[0] === tk.bin) || [])[1] || 'BIN ' + tk.bin) : '';
    return `
      <details class="tq-gon" id="qrKhoi">
        <summary><span>🔳 Mã VietQR nhận tiền (M3.1)</span></summary>
        ${tk ? `<div class="hang-tru"><span>${e(ten)} ${e(an(tk.soTK))}<br><span class="chu-phu">${e(tk.chuTK || '')} · chỉ lưu trên máy này</span></span>
          <button class="btn-secondary" onclick="ShinVietQR.doiTK()">Đổi</button></div>` : `
        <p class="chu-phu">Nhập tài khoản nhận tiền 1 lần – chỉ lưu trên máy này, không gửi đi đâu.</p>
        <label class="nhan-o" for="qrBin">Ngân hàng *</label>
        <select id="qrBin" class="form-input"><option value="">– Chọn ngân hàng –</option>${NGAN_HANG.map(x => `<option value="${x[0]}">${e(x[1])}</option>`).join('')}</select>
        <label class="nhan-o" for="qrTK">Số tài khoản *</label><input id="qrTK" class="form-input" inputmode="numeric" maxlength="19" autocomplete="off">
        <label class="nhan-o" for="qrChu">Tên chủ tài khoản (để người chuyển đối chiếu)</label><input id="qrChu" class="form-input" maxlength="60" autocomplete="off">
        <button class="btn-secondary" onclick="ShinVietQR.luuTK()">💾 Lưu trên máy này</button>`}
        <label class="nhan-o" for="qrTien">Số tiền (đ) – bỏ trống để người chuyển tự nhập</label><input id="qrTien" class="form-input" inputmode="numeric" maxlength="18" placeholder="VD: 1.500.000">
        <label class="nhan-o" for="qrND">Nội dung (≤ 25 ký tự, tự bỏ dấu)</label><input id="qrND" class="form-input" maxlength="60" placeholder="VD: Hoc phi dot 1">
        <button class="btn-primary" onclick="ShinVietQR.taoMa()">🔳 Tạo mã</button>
        <div id="qrKetQua"></div>
        <p class="chu-phu">Mã sinh ngay trên máy (không qua dịch vụ ngoài). Người chuyển kiểm đúng tên chủ tài khoản trước khi chuyển. Còn chờ v1: tự xác nhận đã nhận tiền (SePay).</p>
      </details>`;
  }

  function luuTK() {
    const v = id => ((document.getElementById(id) || {}).value || '').trim();
    const o = { bin: v('qrBin'), soTK: v('qrTK').replace(/\s+/g, ''), chuTK: noiDungSach(v('qrChu')).toUpperCase() };
    const kt = chuoiVietQR({ bin: o.bin, soTK: o.soTK });
    if (kt.loi) return ShinApp.toast(kt.loi, 'error');
    try { localStorage.setItem(KHOA, JSON.stringify(o)); } catch (e) { return ShinApp.toast('Trình duyệt không cho lưu – vẫn tạo mã được ở lần này.', 'error'); }
    ShinApp.toast('Đã lưu tài khoản trên máy này.', 'success');
    lamMoi();
  }

  function doiTK() {
    let cu = null;
    try { cu = localStorage.getItem(KHOA); } catch (e) { /* bỏ qua */ }
    try { localStorage.removeItem(KHOA); } catch (e) { /* bỏ qua */ }
    lamMoi();
    ShinApp.toast('Đã gỡ tài khoản khỏi máy – nhập lại tài khoản mới.', 'info', {
      nhan: 'Hoàn tác', bam: () => { try { if (cu) localStorage.setItem(KHOA, cu); } catch (e) { /* bỏ qua */ } lamMoi(); }
    });
  }

  function lamMoi() {
    const k = document.getElementById('qrKhoi');
    if (!k) return;
    const tam = document.createElement('div'); tam.innerHTML = veKhoi();
    const moi = tam.firstElementChild; moi.open = true; k.replaceWith(moi);
  }

  function taoMa() {
    const v = id => ((document.getElementById(id) || {}).value || '').trim();
    const tk = docTK() || { bin: v('qrBin'), soTK: v('qrTK'), chuTK: noiDungSach(v('qrChu')).toUpperCase() };
    const tienChu = v('qrTien'), tien = tienChu ? ShinApp.docSoVN(tienChu) : 0;
    if (tienChu && !(tien > 0)) return ShinApp.toast('Số tiền không đọc được – nhập dạng 1.500.000.', 'error');
    const kq = chuoiVietQR({ bin: tk.bin, soTK: tk.soTK, soTien: Math.round(tien || 0), noiDung: v('qrND') });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    const o = document.getElementById('qrKetQua');
    if (!o) return;
    const e = ShinApp.esc;
    o.innerHTML = svg(maHoa(kq.chuoi), 'Mã VietQR') +
      `<div class="chu-phu" style="text-align:center">${e(tk.chuTK || '')} · ${e(an(tk.soTK))}${tien > 0 ? ' · ' + e(ShinApp.soVN(Math.round(tien))) + ' đ' : ' · người chuyển tự nhập tiền'}${kq.noiDung ? ' · "' + e(kq.noiDung) + '"' : ''}</div>`;
  }

  return { maHoa, chuoiVietQR, crc16, noiDungSach, svg, veKhoi, luuTK, doiTK, taoMa, _nb: { nhanGF, duRS, boChiaRS, viTriCanChinh } };
})();
