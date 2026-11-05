/**
 * SHIN v2 – Module 9: Thư Viện Tri Thức & Second Brain (Obsidian Vault)
 * Liên kết bộ não tri thức số, quy trình SOP chuẩn y tế & doanh nghiệp
 * v2.7.0 (M9.2): tìm kiếm toàn văn phía trình duyệt – không dấu, nhiều từ (AND), trên mã / tên / lĩnh vực / định dạng / mô tả.
 */

const ModuleTriThuc = {
  ma: 'trithuc',
  ten: 'Thư Viện Tri Thức',
  bieuTuong: '🧠',
  paletteMacDinh: 'nordic',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.trithuc;
    const hero = d.hero || {};
    const taiLieu = d.taiLieu || [];
    this._ds = taiLieu;

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Thư Viện Tri Thức & Second Brain</div>
          <div class="page-sub">Kho quy trình SOP chuẩn & Bộ não Obsidian liên kết</div>
        </div>
        <button class="btn-icon" onclick="ModuleTriThuc.moTimKiem()" title="Tìm kiếm">🔍</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Thư Viện Tri Thức & Second Brain 🧠'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Đồng bộ tự động cùng Obsidian Vault'}</div>
          </div>
        </div>

        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o">
              <div class="tq-so" style="color: ${s.mau}">${s.giaTri}</div>
              <div class="tq-nhan">${s.nhan}</div>
            </div>
          `).join('')}
        </div>

        <button class="btn-primary" onclick="ModuleTriThuc.moTimKiem()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '🔍 Tra Cứu Tri Thức Nhanh (FTS5)'}
        </button>
      </div>

      <!-- Danh Sách Quy Trình SOP & Tri Thức Trọng Tâm -->
      <div class="section-title">
        <span>TÀI LIỆU QUY TRÌNH SOP & HỆ THỐNG · ${taiLieu.length}</span>
        <button class="btn-secondary" style="min-height:44px; padding:0 12px; font-size:14px;" onclick="ShinApp.toast('Thêm tài liệu: lưu tệp .md vào thư mục 05_TriThuc của kho Obsidian – lượt đồng bộ sau sẽ hiện ở đây.', 'info', { thoiGian: 7000 })">
          ＋ Thêm tài liệu
        </button>
      </div>

      <input id="ttTim" class="form-input" type="search" placeholder="🔍 Tìm tài liệu (không cần dấu, nhiều từ)…" oninput="ModuleTriThuc.tim(this.value)" style="margin-bottom:10px">
      <div id="ttDem" class="chu-phu" style="margin-bottom:6px"></div>
      <div id="ttDs" style="display:flex; flex-direction:column; gap:10px;">
        ${this.veDs(taiLieu)}
      </div>

      <div style="margin-top:20px; background:var(--bg-sub); padding:12px; border-radius:8px; border:1px solid var(--border); font-size:12px; color:var(--text-muted); line-height:1.4;">
        📂 <strong>Đường dẫn Obsidian Vault:</strong> Kho tài liệu được đồng bộ trực tiếp tại <code>Thiện Phúc Cloud/He sinh thai Shin/05_TriThuc</code>, kết nối liền mạch cùng MCP Obsidian Second Brain của Shin.
      </div>
    `;

    container.innerHTML = html;
    this._ds = taiLieu;
  },

  _ds: [],
  khongDau: function(x) { return String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd'); },

  veDs: function(ds) {
    const e = ShinApp.esc;
    return ds.map(t => `
          <div class="card" onclick="ModuleTriThuc.xemTaiLieu(${this._ds.indexOf(t) >= 0 ? this._ds.indexOf(t) : ds.indexOf(t)})" style="cursor:pointer;">
            <div class="card-header">
              <div>
                <span class="status-pill live" style="font-size:12px; padding:2px 6px; margin-bottom:4px; display:inline-block;">${e(t.linhVuc)}</span>
                <div class="card-title" style="font-size:14px;">${e(t.ten)}</div>
              </div>
              <span class="dong-arrow">›</span>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:4px 12px; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted); margin-top:8px;">
              <span>Mã: <strong>${e(t.ma)}</strong> · Định dạng: ${e(t.dinhDang)}</span>
              <span>Cập nhật: ${e(t.capNhat)}</span>
            </div>
          </div>`).join('') || '<div class="trong">Không có tài liệu khớp.</div>';
  },

  /** M9.2: lọc phía trình duyệt – mọi từ (không dấu) phải xuất hiện trong mã / tên / lĩnh vực / định dạng / mô tả. */
  loc: function(ds, chu) {
    const tu = this.khongDau(chu).split(/\s+/).filter(Boolean);
    if (!tu.length) return ds.slice();
    return ds.filter(t => { const h = this.khongDau([t.ma, t.ten, t.linhVuc, t.dinhDang, t.moTa, (t.the || []).join(' ')].join(' ')); return tu.every(w => h.includes(w)); });
  },

  tim: function(chu) {
    const kq = this.loc(this._ds, chu), o = document.getElementById('ttDs'), d = document.getElementById('ttDem');
    if (o) o.innerHTML = this.veDs(kq);
    if (d) d.textContent = String(chu || '').trim() ? `${kq.length}/${this._ds.length} tài liệu khớp` : '';
  },

  xemTaiLieu: function(i) {
    const t = this._ds[i];
    if (t) ShinApp.toast(`Mở tài liệu: [${t.ma}] ${t.ten}`, 'info');
  },

  moTimKiem: function() {
    const o = document.getElementById('ttTim');
    if (o) { o.focus(); o.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
};
