/**
 * SHIN v2 – 🩺 Khảo sát › 🔳 QR & nguồn điền phiếu (v2.13.26, M1.5)
 * v1 KS L2 trả link nguồn dạng /exec?k=<mã> nhưng doGet KS bỏ qua k (chỉ mở app quản trị) ➜ v2 tự ghép link tới
 * trang điền công khai của v2: <pages>/dienks.html?k=<MaKS | MaNguon> và vẽ QR ngay trên trình duyệt (ShinVietQR.maHoa – không gọi dịch vụ ngoài).
 * Cổng KS (có token, Admin / Quản lý của KS): webDsNguon({maKS}) ➜ {ds:[{maNguon, loai, tenHien, coSo}]} · webTaoNguon({maKS, loai, tenHien, coSo}) ➜ {ok, maNguon, msg}
 * Tạo nguồn: Toast Hoàn tác 6s (Hoàn tác = không gửi gì), khóa nút khi đang gửi; tên nguồn qua tường lửa M9.5 (api.js soát trước khi gửi).
 */
const ModuleKsQR = {
  _ks: null, _ds: [], _dangGui: false,
  LOAI: ['NV', 'Tổ', 'Vị trí', 'Cơ sở'],
  MAU_NGUON: [
    { maNguon: 'NG0001', loai: 'Vị trí', tenHien: 'Quầy tiếp đón (mẫu)', coSo: '' },
    { maNguon: 'NG0002', loai: 'Tổ', tenHien: 'Tổ Điều dưỡng (mẫu)', coSo: '' }
  ],

  /** THUẦN. Link trang điền công khai cho mã KS / nguồn (gốc = thư mục đang chạy v2). */
  linkDien: function(ma, goc) {
    const g = goc !== undefined ? goc : (location.origin + location.pathname.replace(/[^/]*$/, ''));
    return g + 'dienks.html?k=' + encodeURIComponent(ma);
  },

  /** SVG QR cho 1 link (lỗi mã hóa ➜ ''). */
  qr: function(link, nhan) {
    try { return ShinVietQR.svg(ShinVietQR.maHoa(link), nhan); } catch (e) { return ''; }
  },

  khung: function() {
    let k = document.getElementById('ksQR');
    if (!k) {
      const truoc = document.getElementById('ksForm');
      if (!truoc) return null;
      k = document.createElement('div');
      k.id = 'ksQR';
      k.className = 'ks-ql-khung';
      truoc.parentNode.insertBefore(k, truoc);
    }
    return k;
  },

  mo: async function(maKS, tenKS, nut) {
    const k = this.khung();
    if (!k) return;
    k.hidden = false;
    this._ks = { ma: maKS, ten: tenKS || maKS, demo: true };
    this._ds = [];
    k.innerHTML = '<div class="trong">⏳ Đang tải nguồn QR…</div>';
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const r = await ShinApp.goiNut(nut, 'Đang tải…', () => SHIN_API.goi('KS', 'webDsNguon', { maKS }), 'ksQR_' + maKS);
    if (!r) { k.hidden = true; return; }
    if (!r.ok) {
      this._loi = SHIN_API.moTaLoi(r);
    } else {
      this._loi = '';
      this._ks.demo = !!r.isDemo;
      this._ds = r.isDemo ? this.MAU_NGUON.slice() : (((r.data || {}).ds) || []);
    }
    this.ve();
  },

  dong: function() {
    const k = document.getElementById('ksQR');
    if (k) { k.hidden = true; k.innerHTML = ''; }
    this._ks = null; this._ds = [];
  },

  theQR: function(ma, ten, phu) {
    const e = ShinApp.esc, link = this.linkDien(ma);
    return `<div class="the">
      <b>${e(ten)}</b>${phu ? `<div class="chu-phu">${e(phu)}</div>` : ''}
      <div class="ksqr-ma">${this.qr(link, 'Mã QR điền ' + e(ten)) || '<div class="trong">Không vẽ được QR.</div>'}</div>
      <div class="ksqr-link">${e(link)}</div>
      <div class="ksqr-nut">
        <button type="button" class="btn-secondary" data-link="${e(link)}" onclick="ModuleKsQR.chep(this.dataset.link)">📋 Chép link</button>
        <button type="button" class="btn-secondary" data-link="${e(link)}" data-ten="${e(ten)}" onclick="ModuleKsQR.taiSVG(this.dataset.link, this.dataset.ten)">⬇ Tải ảnh QR</button>
        <a class="btn-secondary" style="min-height:44px;display:inline-flex;align-items:center;text-decoration:none;" href="${e(link)}" target="_blank" rel="noopener">👁 Mở thử</a>
      </div></div>`;
  },

  ve: function() {
    const k = document.getElementById('ksQR'), ks = this._ks;
    if (!k || !ks) return;
    const e = ShinApp.esc;
    k.innerHTML = `
      <h3>🔳 QR điền phiếu – ${e(ks.ten)}</h3>
      <p class="chu-phu">Người bệnh quét QR ➜ mở trang điền công khai của v2 (không cần đăng nhập) ➜ phiếu ghi thẳng vào app Khảo sát. Mỗi máy chỉ gửi 1 phiếu nếu khảo sát không cho trả lời nhiều lần. ${ks.demo ? 'Demo: nguồn mẫu, không tạo nguồn thật.' : ''}</p>
      ${this._loi ? `<div class="canh-bao-nguon loi">⚠️ Chưa tải được danh sách nguồn: ${e(this._loi)} – QR chung của khảo sát vẫn dùng được.</div>` : ''}
      ${this.theQR(ks.ma, 'QR chung của khảo sát', ks.ma)}
      <div class="hn-tieu"><span>📍 NGUỒN QR THEO NV / TỔ / VỊ TRÍ · ${this._ds.length}</span></div>
      ${this._ds.length ? this._ds.map(n => this.theQR(n.maNguon, n.tenHien, [n.loai, n.coSo, n.maNguon].filter(Boolean).join(' · '))).join('') : '<div class="trong">Chưa có nguồn – tạo nguồn để biết phiếu đến từ quầy / tổ nào.</div>'}
      <div class="tc-form-hop">
        <div class="tc-form-hang-doi">
          <div class="tc-form-nhom"><label class="nhan-o" for="ksqrLoai">Loại nguồn</label>
            <select id="ksqrLoai" class="form-input">${this.LOAI.map(l => `<option>${l}</option>`).join('')}</select></div>
          <div class="tc-form-nhom"><label class="nhan-o" for="ksqrTen">Tên hiện *</label><input id="ksqrTen" class="form-input" maxlength="80" autocomplete="off" placeholder="VD Quầy tiếp đón tầng 1"></div>
        </div>
        <div class="tc-form-nhom"><label class="nhan-o" for="ksqrCoSo">Cơ sở</label><input id="ksqrCoSo" class="form-input" maxlength="80" autocomplete="off"></div>
        <div class="ks-ql-nut">
          <button type="button" class="btn-primary" id="ksqrTao" onclick="ModuleKsQR.taoNguon(this)">➕ Tạo nguồn QR</button>
          <button type="button" class="btn-secondary" onclick="ModuleKsQR.dong()">Đóng</button>
        </div>
      </div>`;
  },

  chep: function(link) {
    const xong = () => ShinApp.toast('Đã chép link điền phiếu.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(link).then(xong, () => prompt('Chép link:', link));
    else prompt('Chép link:', link);
  },

  taiSVG: function(link, ten) {
    const s = this.qr(link, ten);
    if (!s) return;
    const svg = s.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" ').replace(/var\(--qr-nen,#fff\)/g, '#fff').replace(/var\(--qr-dam,#000\)/g, '#000');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    a.download = 'QR_' + String(ten || 'khaosat').replace(/[^\p{L}\p{N}]+/gu, '_').slice(0, 40) + '.svg';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },

  /** THUẦN. Kiểm form nguồn ➜ '' | câu lỗi. */
  kiemNguon: function(du) {
    if (!this.LOAI.includes(du.loai)) return 'Loại nguồn chỉ là: ' + this.LOAI.join(', ') + '.';
    if (!String(du.tenHien || '').trim()) return 'Nhập tên hiện của nguồn (VD tên quầy / tổ).';
    return '';
  },

  taoNguon: function(nut) {
    const ks = this._ks;
    if (!ks || this._dangGui) return;
    const v = id => (document.getElementById(id) || {}).value || '';
    const du = { maKS: ks.ma, loai: v('ksqrLoai'), tenHien: v('ksqrTen').trim(), coSo: v('ksqrCoSo').trim() };
    const loi = this.kiemNguon(du);
    if (loi) { ShinApp.toast(loi, 'warn'); return; }
    if (ks.demo || !ModuleKhaoSat.coGhi()) { if (ks.demo) ShinApp.toast('Đang ở Demo – không tạo nguồn thật.', 'info'); return; }
    this._dangGui = true;
    if (nut) nut.disabled = true;
    ShinApp.hanhDongHoanTac('Sẽ tạo nguồn QR «' + du.tenHien + '» sau 6 giây.', {
      traLai: () => { this._dangGui = false; if (nut && nut.isConnected) nut.disabled = false; },
      thucHien: async () => {
        try {
          const kq = await ModuleKhaoSat.goiKS('webTaoNguon', du);
          if (kq.ok === false) throw new Error(kq.msg || 'App Khảo sát không tạo nguồn.');
          ShinApp.toast(kq.msg || 'Đã tạo nguồn ' + (kq.maNguon || ''), 'success');
          if (this._ks === ks) { this._ds.push({ maNguon: kq.maNguon, loai: du.loai, tenHien: du.tenHien, coSo: du.coSo }); this.ve(); }
        } finally {
          this._dangGui = false;
          const n = document.getElementById('ksqrTao');
          if (n) n.disabled = false;
        }
      }
    });
  }
};

/** Khối 🔳 trong 🛠️ Quản lý khảo sát – khaosat.js gọi cạnh khối 📝 Nhập hộ. */
ModuleKsQR.veKhoi = function(d) {
  const e = ShinApp.esc;
  const mo = ((d && d.khaoSat) || []).filter(x => x.trangThai === 'Đang mở');
  return `<div class="tc-form-nhom"><span class="nhan-o">🔳 QR điền phiếu cho người bệnh</span>
    ${mo.length ? `<div class="hang-chip">${mo.map(x => `<button type="button" class="chip-chon" data-ma="${e(x.ma)}" data-ten="${e(x.ten)}" onclick="ModuleKsQR.mo(this.dataset.ma, this.dataset.ten, this)">🔳 ${e(x.ten)}</button>`).join('')}</div>`
      : '<p class="chu-phu">Chưa có khảo sát Đang mở – mở 1 khảo sát rồi mới in QR được.</p>'}</div>`;
};
