/**
 * SHIN v2 – Module 9: Thư Viện Tri Thức & Second Brain (Obsidian Vault)
 * v2.7.3 (M9.2): tìm kiếm toàn văn PHÍA TRÌNH DUYỆT – bỏ dấu tiếng Việt, mọi từ phải khớp (mã, tên, lĩnh vực, định dạng, nội dung tóm tắt),
 * lọc theo lĩnh vực, tô đậm chỗ khớp. Chưa có máy chủ v1 cho kho tri thức ➜ dữ liệu là MẪU (FTS5 phía máy chủ để sau).
 */

const ModuleTriThuc = {
  ma: 'trithuc',
  ten: 'Thư Viện Tri Thức',
  bieuTuong: '🧠',
  paletteMacDinh: 'nordic',

  _ds: [],
  _tim: '',
  _linhVuc: '',

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
    this._ds = d.taiLieu || [];
    const lv = [...new Set(this._ds.map(t => t.linhVuc).filter(Boolean))];

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

      <div class="hn-tieu"><span id="ttDem"></span></div>
      <div id="ttDs" style="display:flex; flex-direction:column; gap:10px;"></div>

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn dữ liệu</span></summary>
        <p class="chu-phu">Kho tài liệu đồng bộ tại <code>He sinh thai Shin/05_TriThuc</code>. Hệ v1 chưa có máy chủ cho kho tri thức – danh sách trên là MẪU; tìm kiếm chạy ngay trên máy, không gửi câu tìm đi đâu.</p>
      </details>`;
    this.veDs();
  },

  veDs: function() {
    const el = document.getElementById('ttDs'), dem = document.getElementById('ttDem');
    if (!el) return;
    const e = ShinApp.esc, q = this._tim;
    const ds = this.timKiem(this._ds, q, this._linhVuc);
    if (dem) dem.textContent = `TÀI LIỆU · ${ds.length}${ds.length !== this._ds.length ? ' / ' + this._ds.length : ''}`;
    el.innerHTML = ds.map(t => `
      <div class="card" role="button" tabindex="0" data-ma="${e(t.ma)}" onclick="ModuleTriThuc.xemTaiLieu(this.dataset.ma)" style="cursor:pointer;">
        <div class="card-header">
          <div>
            <span class="badge xam">${this.toDam(t.linhVuc, q)}</span>
            <div class="card-title" style="margin-top:4px;">${this.toDam(t.ten, q)}</div>
          </div>
          <span class="dong-arrow" aria-hidden="true">›</span>
        </div>
        <div class="chu-phu" style="display:flex; justify-content:space-between; gap:8px; flex-wrap:wrap; margin-top:8px;">
          <span>Mã: <strong>${this.toDam(t.ma, q)}</strong> · ${e(t.dinhDang || '')}</span>
          <span>Cập nhật: ${e(t.capNhat || '')}</span>
        </div>
      </div>`).join('') || `<div class="trong">Không thấy tài liệu khớp "${e(q)}".</div>`;
  },

  doiTim: function(v) { this._tim = String(v || ''); this.veDs(); },
  chonLinhVuc: function(lv) {
    this._linhVuc = lv || '';
    document.querySelectorAll('[onclick^="ModuleTriThuc.chonLinhVuc"]').forEach(b => b.classList.toggle('dang-chon', (b.dataset.lv || '') === this._linhVuc));
    ShinApp.rung('nhe');
    this.veDs();
  },

  xemTaiLieu: function(ma) {
    const t = this._ds.find(x => x.ma === ma);
    ShinApp.toast(`Mở tài liệu: [${ma}] ${t ? t.ten : ''} – kho tri thức chưa có máy chủ v1.`, 'info');
  },

  moTimKiem: function() { const o = document.getElementById('ttTim'); if (o) { o.focus(); o.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }
};
