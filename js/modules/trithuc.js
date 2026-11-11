/**
 * SHIN v2 – Module 9: Thư Viện Tri Thức & Second Brain (Obsidian Vault)
 * v2.7.3 (M9.2): tìm kiếm toàn văn PHÍA TRÌNH DUYỆT – bỏ dấu tiếng Việt, mọi từ phải khớp (mã, tên, lĩnh vực, định dạng, nội dung tóm tắt),
 * lọc theo lĩnh vực, tô đậm chỗ khớp. Chưa có máy chủ v1 cho kho tri thức ➜ dữ liệu là MẪU (FTS5 phía máy chủ để sau).
 * v2.8.3 (M9.3): đồ thị liên kết [[wiki-links]] PHÍA TRÌNH DUYỆT – đọc [[Mã]] / [[Tên|nhãn]] trong tóm tắt + mảng lienKet,
 * tính liên kết ra / liên kết ngược (backlinks) / liên kết treo (chưa có bài), vẽ SVG vòng tròn, bấm tài liệu mở khung chi tiết.
 * v2.13.2 (M9.1 🟢): Live đọc thật HUB L28a `webTriThuc(token, {})` (Hub v1.18.5) ➜ {capNhat, taiLieu:[{ma, ten, linhVuc, capNhat,
 *   dinhDang, tomTat, lienKet, duongDan}], baiHoc:[], loi?} – chỉ mục 05_TriThuc do máy anh đồng bộ. Lỗi / chưa có chỉ mục ➜ báo đỏ, không thay số mẫu.
 * v2.13.22: bỏ chữ cũ "Còn chờ v1: ghi bài học" – HUB L28 đã lên app đủ (v1.21.1 @21), ghi bài học ở 📁 Dự án từ v2.13.10.
 */

const ModuleTriThuc = {
  ma: 'trithuc',
  ten: 'Thư Viện Tri Thức',
  bieuTuong: '🧠',
  paletteMacDinh: 'nordic',
  mayChu: 'HUB',

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webTriThuc', {});
    if (!kq.ok) return kq;
    const d = kq.data || {};
    return { ok: true, data: { live: true, capNhat: String(d.capNhat || ''), taiLieu: Array.isArray(d.taiLieu) ? d.taiLieu : [], loi: d.loi || '' } };
  },

  _ds: [],
  _tim: '',
  _linhVuc: '',
  _xem: '',
  _dt: null,
  _live: false,
  _loi: '',

  /** THUẦN. Phân tích [[wiki-links]] ➜ { ra:{ma:[ma]}, vao:{ma:[ma]}, treo:{ma:[chữ]}, canh:[[a,b]] }.
   *  Đích khớp theo mã hoặc tên (không phân biệt hoa thường / dấu); bỏ phần #mục và |nhãn; bỏ tự liên kết; không trùng. */
  phanTichLienKet: function(ds) {
    const ra = {}, vao = {}, treo = {}, canh = [], theoKhoa = {};
    (ds || []).forEach(t => { ra[t.ma] = []; vao[t.ma] = []; treo[t.ma] = []; theoKhoa[this.boDau(t.ma)] = t.ma; theoKhoa[this.boDau(t.ten)] = t.ma; });
    (ds || []).forEach(t => {
      const dich = [];
      String(t.tomTat || '').replace(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g, (_, x) => { dich.push(x); return ''; });
      (t.lienKet || []).forEach(x => dich.push(x));
      dich.forEach(x => {
        const chu = String(x).trim(); if (!chu) return;
        const m = theoKhoa[this.boDau(chu)];
        if (!m) { if (!treo[t.ma].includes(chu)) treo[t.ma].push(chu); return; }
        if (m === t.ma || ra[t.ma].includes(m)) return;
        ra[t.ma].push(m); vao[m].push(t.ma); canh.push([t.ma, m]);
      });
    });
    return { ra, vao, treo, canh };
  },

  /** THUẦN. Đồ thị ➜ chuỗi SVG (vòng tròn, nút to theo bậc). Chỉ dùng var(--…). */
  veSvg: function(ds, dt, chon) {
    const e = ShinApp.esc, n = (ds || []).length;
    if (!n) return '';
    const W = 320, c = W / 2, R = n === 1 ? 0 : 105, vt = {};
    ds.forEach((t, i) => { const g = -Math.PI / 2 + 2 * Math.PI * i / n; vt[t.ma] = [c + R * Math.cos(g), c + R * Math.sin(g)]; });
    const lien = m => chon && (m === chon || (dt.ra[chon] || []).includes(m) || (dt.vao[chon] || []).includes(m));
    const canh = dt.canh.map(([a, b]) => { const [x1, y1] = vt[a], [x2, y2] = vt[b], dam = chon && (a === chon || b === chon);
      return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="var(${dam ? '--primary' : '--border'})" stroke-width="${dam ? 2.5 : 1.5}" marker-end="url(#ttMui${dam ? 'D' : ''})"/>`; }).join('');
    const nut = ds.map(t => { const [x, y] = vt[t.ma], bac = dt.ra[t.ma].length + dt.vao[t.ma].length, r = 10 + Math.min(bac, 6) * 2, la = t.ma === chon;
      const mo = chon && !lien(t.ma) ? ' opacity="0.45"' : '';
      return `<g class="tt-nut" role="button" tabindex="0" data-ma="${e(t.ma)}" aria-label="${e(t.ma + ' – ' + t.ten)}"${mo}>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="22" fill="transparent"/>
        <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" fill="var(${la ? '--primary' : '--primary-soft'})" stroke="var(--primary)" stroke-width="1.5"/>
        <text x="${x.toFixed(1)}" y="${(y + r + 15).toFixed(1)}" text-anchor="middle" font-size="15" font-weight="600" fill="var(--text)">${e(t.ma)}</text></g>`; }).join('');
    return `<svg class="tt-dothi" viewBox="-10 -6 ${W + 20} ${W + 24}" role="img" aria-label="Đồ thị liên kết ${n} tài liệu">
      <defs>${['', 'D'].map(k => `<marker id="ttMui${k}" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(${k ? '--primary' : '--border'})"/></marker>`).join('')}</defs>
      ${canh}${nut}</svg>`;
  },

  /** THUẦN. Chuỗi ➜ chữ thường không dấu (đ ➜ d) để so khớp. */
  boDau: function(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  },

  /** THUẦN. Lọc + xếp hạng: mọi từ của câu tìm phải có trong tài liệu; khớp ở mã / tên được điểm cao hơn. */
  timKiem: function(ds, cau, linhVuc) {
    const tu = this.boDau(cau).split(/\s+/).filter(Boolean);
    return (ds || []).filter(t => !linhVuc || t.linhVuc === linhVuc).map(t => {
      const dau = this.boDau(t.ma + ' ' + t.ten), toan = this.boDau([t.ma, t.ten, t.linhVuc, t.dinhDang, t.tomTat || ''].join(' '));
      if (!tu.every(w => toan.includes(w))) return null;
      return { t, diem: tu.reduce((a, w) => a + (dau.includes(w) ? 2 : 1), 0) };
    }).filter(Boolean).sort((a, b) => b.diem - a.diem).map(x => x.t);
  },

  /** Tô đậm từ khớp (so khớp không dấu nhưng giữ nguyên chữ gốc). */
  toDam: function(chu, cau) {
    const e = ShinApp.esc, goc = String(chu || ''), tu = this.boDau(cau).split(/\s+/).filter(Boolean);
    if (!tu.length) return e(goc);
    const kd = this.boDau(goc), dau = new Array(goc.length).fill(false);
    // NFD có thể đổi độ dài ➜ chỉ tô khi độ dài không dấu bằng chữ gốc (đa số trường hợp tiếng Việt dựng sẵn)
    if (kd.length !== goc.length) return e(goc);
    tu.forEach(w => { let i = kd.indexOf(w); while (i >= 0) { for (let k = i; k < i + w.length; k++) dau[k] = true; i = kd.indexOf(w, i + w.length); } });
    let ra = '', mo = false;
    for (let i = 0; i < goc.length; i++) {
      if (dau[i] && !mo) { ra += '<mark>'; mo = true; }
      if (!dau[i] && mo) { ra += '</mark>'; mo = false; }
      ra += e(goc[i]);
    }
    return ra + (mo ? '</mark>' : '');
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.trithuc;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    this._live = !!d.live;
    this._loi = d.loi || '';
    this._ds = d.taiLieu || [];
    this._dt = this.phanTichLienKet(this._ds);
    if (this._xem && !this._ds.some(t => t.ma === this._xem)) this._xem = '';
    const lv = [...new Set(this._ds.map(t => t.linhVuc).filter(Boolean))];
    if (d.live) {
      hero.chao = 'Thư Viện Tri Thức 🧠';
      hero.ngay = d.capNhat ? 'Chỉ mục cập nhật ' + d.capNhat : 'Kho 05_TriThuc (Hub)';
      hero.so = [{ nhan: 'Tài liệu', giaTri: String(this._ds.length), mau: 'var(--c-blue)' },
        { nhan: 'Lĩnh vực', giaTri: String(lv.length), mau: 'var(--c-green)' },
        { nhan: 'Liên kết', giaTri: String(this._dt.canh.length), mau: 'var(--c-purple)' }];
    }

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🧠 Thư Viện Tri Thức</div>
          <div class="page-sub">Kho quy trình SOP & Second Brain</div>
        </div>
        <button class="btn-icon" onclick="ModuleTriThuc.moTimKiem()" title="Tìm kiếm" aria-label="Tìm kiếm">🔍</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">${e(hero.chao || 'Thư Viện Tri Thức & Second Brain 🧠')}</div>
          <div class="hero-date">📅 ${e(hero.ngay || 'Đồng bộ cùng Obsidian Vault')}</div>
        </div></div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `<div class="tq-o"><div class="tq-so" style="color:${s.mau}">${e(s.giaTri)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>`).join('')}
        </div>
        <input id="ttTim" class="form-input" type="search" style="font-size:16px;" placeholder="🔍 Tìm mã, tên, lĩnh vực… (gõ không dấu cũng được)"
          aria-label="Tìm tài liệu" value="${e(this._tim)}" oninput="ModuleTriThuc.doiTim(this.value)">
      </div>

      ${lv.length > 1 ? `<div class="hang-tab" role="tablist">
        <button class="chip-chon ${this._linhVuc ? '' : 'dang-chon'}" onclick="ModuleTriThuc.chonLinhVuc('')">Tất cả</button>
        ${lv.map(x => `<button class="chip-chon ${this._linhVuc === x ? 'dang-chon' : ''}" data-lv="${e(x)}" onclick="ModuleTriThuc.chonLinhVuc(this.dataset.lv)">${e(x)}</button>`).join('')}
      </div>` : ''}

      ${d.loi ? `<div class="canh-bao-nguon loi" role="alert" style="margin-bottom:12px;"><span>⚠️ <strong>Kho tri thức:</strong> ${e(d.loi)} – máy anh chạy đồng bộ kho tri thức (quét <code>05_TriThuc</code> → Drive) để nạp chỉ mục lên Hub. Danh sách để trống, không dùng số mẫu.</span></div>` : ''}
      <div id="ttXem"></div>

      <details class="tq-gon" id="ttDoThiKhoi">
        <summary><span>🕸️ Đồ thị liên kết · ${this._dt.canh.length} liên kết</span></summary>
        <div id="ttDoThi"></div>
        <p class="chu-phu">Mũi tên A ➜ B: bài A có <code>[[B]]</code>. Bấm 1 nút để xem liên kết ra / liên kết ngược.</p>
      </details>

      <div class="hn-tieu"><span id="ttDem"></span></div>
      <div id="ttDs" style="display:flex; flex-direction:column; gap:10px;"></div>

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn dữ liệu</span></summary>
        <p class="chu-phu">${d.live ? 'Số thật: chỉ mục kho <code>05_TriThuc</code> (máy anh quét → Drive) đọc qua cổng Hub <code>webTriThuc</code> (L28a).' : 'Demo: danh sách là MẪU. Live đọc chỉ mục kho <code>05_TriThuc</code> qua cổng Hub <code>webTriThuc</code>.'} Tìm kiếm chạy ngay trên máy, không gửi câu tìm đi đâu. Gửi bài học từ Flash Report: ở 📁 Dự án (cổng Hub <code>webLuuBaiHoc</code>, L28b) – bài vào sổ Chờ, Admin duyệt rồi máy anh chép vào kho (L28c).</p>
      </details>`;
    this.veDs();
    this.veXem();
    const dthi = document.getElementById('ttDoThi');
    if (dthi) {
      dthi.addEventListener('click', ev => { const g = ev.target.closest('.tt-nut'); if (g) this.xemTaiLieu(g.dataset.ma); });
      dthi.addEventListener('keydown', ev => { const g = ev.target.closest('.tt-nut'); if (g && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); this.xemTaiLieu(g.dataset.ma); } });
    }
  },

  veXem: function() {
    const dthi = document.getElementById('ttDoThi');
    if (dthi) dthi.innerHTML = this.veSvg(this._ds, this._dt, this._xem);
    const el = document.getElementById('ttXem');
    if (!el) return;
    const t = this._ds.find(x => x.ma === this._xem);
    if (!t) { el.innerHTML = ''; return; }
    const e = ShinApp.esc, dt = this._dt;
    const chip = ma => { const u = this._ds.find(x => x.ma === ma); return `<button class="chip-chon" data-ma="${e(ma)}" onclick="ModuleTriThuc.xemTaiLieu(this.dataset.ma)" title="${e(u ? u.ten : ma)}">${e(ma)}</button>`; };
    const nhom = (nhan, ds) => `<div class="tt-nhom"><div class="chu-phu"><strong>${nhan} · ${ds.length}</strong></div><div class="tt-chips">${ds.join('') || '<span class="chu-phu">—</span>'}</div></div>`;
    const tomTat = e(t.tomTat || '').replace(/\[\[([^\]]+)\]\]/g, (_, x) => `<strong>${x.split('|').pop()}</strong>`);
    el.innerHTML = `<div class="card tt-xem" style="padding:14px;">
      <div class="card-header" style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:10px;">
        <div style="flex:1; min-width:0;">
          <div style="margin-bottom:4px;"><span class="badge xam">${e(t.linhVuc || 'Khác')}</span></div>
          <div class="card-title" style="margin:4px 0 0; word-break:break-word; overflow-wrap:break-word; line-height:1.45; font-size:16px; font-weight:800;">[${e(t.ma)}] ${e(t.ten)}</div>
          <div class="chu-phu" style="margin-top:4px; line-height:1.4;">Cập nhật: ${e(t.capNhat || '—')}${t.dinhDang ? ' · ' + e(t.dinhDang) : ''}</div>
        </div>
        <button class="btn-icon" onclick="ModuleTriThuc.xemTaiLieu('')" aria-label="Đóng" style="min-width:44px; min-height:44px; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0;">✕</button>
      </div>
      ${tomTat ? `<p class="chu-phu" style="margin:10px 0; word-break:break-word; overflow-wrap:break-word; line-height:1.5;">${tomTat}</p>` : ''}
      ${nhom('➜ Liên kết ra', dt.ra[t.ma].map(chip))}
      ${nhom('⬅ Liên kết ngược', dt.vao[t.ma].map(chip))}
      ${dt.treo[t.ma].length ? nhom('⚠️ Liên kết treo (chưa có bài)', dt.treo[t.ma].map(x => `<span class="badge vang">${e(x)}</span>`)) : ''}
      <p class="chu-phu" style="margin-top:12px;">Hub chỉ trả chỉ mục + tóm tắt (L28a) – nội dung đầy đủ đọc trong kho <code>05_TriThuc</code>.</p>
    </div>`;
  },

  veDs: function() {
    const el = document.getElementById('ttDs'), dem = document.getElementById('ttDem');
    if (!el) return;
    const e = ShinApp.esc, q = this._tim;
    const ds = this.timKiem(this._ds, q, this._linhVuc);
    if (dem) dem.textContent = `TÀI LIỆU · ${ds.length}${ds.length !== this._ds.length ? ' / ' + this._ds.length : ''}`;

    if (!this._ds || this._ds.length === 0) {
      if (this._loi) {
        el.innerHTML = `<div class="trong">Chưa có dữ liệu do lỗi kết nối hoặc kho tri thức chưa được đồng bộ.</div>`;
      } else if (this._live) {
        el.innerHTML = `<div class="trong" style="padding:28px 12px;">
          <div style="font-size:32px; margin-bottom:8px;" aria-hidden="true">📭</div>
          <div style="font-weight:700; color:var(--text); margin-bottom:4px;">Kho tri thức Live hiện chưa có tài liệu nào</div>
          <div class="chu-phu">Máy anh chạy đồng bộ kho tri thức (quét <code>05_TriThuc</code> → Drive) để nạp tài liệu và chỉ mục lên Hub.</div>
        </div>`;
      } else {
        el.innerHTML = `<div class="trong">Chưa có tài liệu nào trong danh sách mẫu.</div>`;
      }
      return;
    }

    if (ds.length === 0) {
      el.innerHTML = `<div class="trong">Không tìm thấy tài liệu khớp với "${e(q || this._linhVuc)}".</div>`;
      return;
    }

    el.innerHTML = ds.map(t => `
      <div class="card" role="button" tabindex="0" data-ma="${e(t.ma)}" onclick="ModuleTriThuc.xemTaiLieu(this.dataset.ma)"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ModuleTriThuc.xemTaiLieu(this.dataset.ma);}"
        style="cursor:pointer; min-height:44px; padding:12px 14px;">
        <div class="card-header" style="display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:8px;">
          <div style="flex:1; min-width:0;">
            <div style="margin-bottom:4px;"><span class="badge xam">${this.toDam(t.linhVuc || 'Khác', q)}</span></div>
            <div class="card-title" style="margin:4px 0 0; word-break:break-word; overflow-wrap:break-word; line-height:1.45; font-size:15px; font-weight:700;">${this.toDam(t.ten, q)}</div>
          </div>
          <span class="dong-arrow" aria-hidden="true" style="font-size:18px; color:var(--text-muted); line-height:1; padding-top:2px; flex-shrink:0;">›</span>
        </div>
        <div class="chu-phu" style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap; margin-top:6px; line-height:1.4;">
          <span style="word-break:break-word;">Mã: <strong>${this.toDam(t.ma, q)}</strong>${t.dinhDang ? ' · ' + e(t.dinhDang) : ''}</span>
          <span style="white-space:nowrap;">Cập nhật: ${e(t.capNhat || '—')}</span>
        </div>
      </div>`).join('');
  },

  doiTim: function(v) { this._tim = String(v || ''); this.veDs(); },
  chonLinhVuc: function(lv) {
    this._linhVuc = lv || '';
    document.querySelectorAll('[onclick^="ModuleTriThuc.chonLinhVuc"]').forEach(b => b.classList.toggle('dang-chon', (b.dataset.lv || '') === this._linhVuc));
    ShinApp.rung('nhe');
    this.veDs();
  },

  xemTaiLieu: function(ma) {
    this._xem = ma || '';
    ShinApp.rung('nhe');
    this.veXem();
    const el = document.getElementById('ttXem');
    if (this._xem && el && el.scrollIntoView) el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  },

  moTimKiem: function() { const o = document.getElementById('ttTim'); if (o) { o.focus(); o.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
};