/**
 * SHIN v2 – Module 9: Thư Viện Tri Thức & Second Brain (Obsidian Vault)
 * v2.6.10 (M9.2): tìm kiếm toàn văn PHÍA TRÌNH DUYỆT – lọc ngay khi gõ trên mã / tên / lĩnh vực / tóm tắt,
 *   không phân biệt dấu & hoa thường, nhiều từ = phải khớp đủ; chip lọc theo lĩnh vực. (FTS5 phía máy chủ: sau.)
 * Chưa có máy chủ v1 cho mảng này ➜ dữ liệu là MẪU (app tự gắn dải vàng khi Live).
 */

const ModuleTriThuc = {
  ma: 'trithuc',
  ten: 'Thư Viện Tri Thức',
  bieuTuong: '🧠',
  paletteMacDinh: 'nordic',

  _ds: [],
  _tu: '',
  _linhVuc: '',

  /** THUẦN. Chuẩn hóa để so: bỏ dấu tiếng Việt, đ ➜ d, chữ thường. */
  boDau: function(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'd').toLowerCase();
  },

  /** THUẦN. Lọc tài liệu: mọi từ trong câu tìm phải có trong (mã + tên + lĩnh vực + tóm tắt); linhVuc rỗng = tất cả. */
  loc: function(ds, tu, linhVuc) {
    const cac = this.boDau(tu).split(/\s+/).filter(Boolean);
    return (ds || []).filter(t => {
      if (linhVuc && t.linhVuc !== linhVuc) return false;
      const chu = this.boDau([t.ma, t.ten, t.linhVuc, t.tomTat].join(' '));
      return cac.every(c => chu.includes(c));
    });
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.trithuc;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    this._ds = d.taiLieu || [];
    const linhVuc = [...new Set(this._ds.map(t => t.linhVuc).filter(Boolean))];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🧠 Thư Viện Tri Thức</div>
          <div class="page-sub">Kho quy trình SOP & Second Brain</div>
        </div>
        <button class="btn-icon" onclick="ModuleTriThuc.moTimKiem()" title="Tìm kiếm">🔍</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">${e(hero.chao || 'Thư Viện Tri Thức & Second Brain 🧠')}</div>
          <div class="hero-date">📅 ${e(hero.ngay || 'Đồng bộ cùng Obsidian Vault')}</div>
        </div></div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `<div class="tq-o"><div class="tq-so" style="color:${s.mau}">${e(s.giaTri)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>`).join('')}
        </div>
      </div>

      <div class="hang-nhap">
        <input id="ttTim" class="form-input" type="search" placeholder="Tìm mã, tên, lĩnh vực… (không cần dấu)" value="${e(this._tu)}"
          oninput="ModuleTriThuc.go(this.value)" aria-label="Tìm tài liệu tri thức">
      </div>
      ${linhVuc.length > 1 ? `<div class="hang-chip">
        ${[''].concat(linhVuc).map(l => `<button class="chip-chon ${this._linhVuc === l ? 'dang-chon' : ''}" data-lv="${e(l)}" onclick="ModuleTriThuc.chonLinhVuc(this.dataset.lv)">${l ? e(l) : 'Tất cả'}</button>`).join('')}
      </div>` : ''}
      <div class="hn-tieu"><span id="ttDem"></span></div>
      <div id="ttDs" class="hn-list"></div>

      <details class="tq-gon">
        <summary><span>📂 Nguồn tài liệu</span></summary>
        <p class="chu-phu">Kho tài liệu đồng bộ tại <code>He sinh thai Shin/05_TriThuc</code> (Obsidian Second Brain). Tìm kiếm ở đây lọc ngay trên máy, không gửi câu tìm đi đâu.</p>
      </details>
    `;
    this.veDs();
  },

  veDs: function() {
    const o = document.getElementById('ttDs'), dem = document.getElementById('ttDem');
    if (!o) return;
    const e = ShinApp.esc;
    const kq = this.loc(this._ds, this._tu, this._linhVuc);
    if (dem) dem.textContent = `TÀI LIỆU · ${kq.length}/${this._ds.length}`;
    o.innerHTML = kq.length ? kq.map(t => `
      <button class="hn-dong pk-nut-dong" data-ma="${e(t.ma)}" onclick="ModuleTriThuc.xemTaiLieu(this.dataset.ma)">
        <div class="dong-content">
          <div class="dong-title">${e(t.ten)}</div>
          <div class="dong-sub">${e([t.ma, t.linhVuc, t.capNhat ? 'cập nhật ' + t.capNhat : ''].filter(Boolean).join(' · '))}</div>
        </div>
        <div class="dong-meta"><span class="dong-arrow">›</span></div>
      </button>`).join('') : `<div class="trong">Không có tài liệu khớp “${e(this._tu)}”.</div>`;
  },

  go: function(v) { this._tu = v; this.veDs(); },

  chonLinhVuc: function(l) {
    this._linhVuc = l;
    document.querySelectorAll('.hang-chip .chip-chon').forEach(b => b.classList.toggle('dang-chon', b.dataset.lv === l));
    this.veDs();
  },

  xemTaiLieu: function(ma) {
    const t = this._ds.find(x => x.ma === ma);
    if (t) ShinApp.toast(`[${t.ma}] ${t.ten} – mở bản đầy đủ trong Obsidian Vault (05_TriThuc).`, 'info');
  },

  moTimKiem: function() {
    const o = document.getElementById('ttTim');
    if (o) { o.focus(); o.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
};
