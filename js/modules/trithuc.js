/**
 * SHIN v2 – Module 9: Thư Viện Tri Thức & Second Brain (Obsidian Vault)
 * Liên kết bộ não tri thức số, quy trình SOP chuẩn y tế & doanh nghiệp
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
            <div class="hero-greet">${ShinApp.esc(hero.chao) || 'Thư Viện Tri Thức & Second Brain 🧠'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Đồng bộ tự động cùng Obsidian Vault'}</div>
          </div>
        </div>

        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o">
              <div class="tq-so" style="color: ${s.mau}">${ShinApp.esc(s.giaTri)}</div>
              <div class="tq-nhan">${ShinApp.esc(s.nhan)}</div>
            </div>
          `).join('')}
        </div>

        <button class="btn-primary" onclick="ModuleTriThuc.moTimKiem()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '🔍 Tra Cứu Tri Thức Nhanh (FTS5)'}
        </button>
      </div>

      <div class="form-group" style="margin-top:12px">
        <input id="ttTim" class="form-input pk-nhap" type="search" placeholder="🔍 Tìm toàn văn: tên, mã, lĩnh vực, mảng…" aria-label="Tìm trong thư viện tri thức"
          oninput="ModuleTriThuc.loc(this.value)" value="${ShinApp.esc(this._tim || '')}">
      </div>
      <div id="ttKetQua"></div>
    `;

    container.innerHTML = html;
    this.loc(this._tim || '');
  },

  /* ---------- M9.2 (v2.6.10) – tìm toàn văn phía trình duyệt: bỏ dấu tiếng Việt, mọi từ phải khớp ---------- */
  _tim: '',
  boDau: function(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  },
  khop: function(chu, tu) { const c = this.boDau(chu); return tu.every(t => c.indexOf(t) >= 0); },

  loc: function(q) {
    this._tim = q || '';
    const el = document.getElementById('ttKetQua');
    if (!el) return;
    const e = ShinApp.esc, tu = this.boDau(q).split(/\s+/).filter(Boolean);
    const tl = ((window.SHIN_DEMO_DATA.trithuc || {}).taiLieu || []).filter(t => !tu.length || this.khop([t.ma, t.ten, t.linhVuc, t.dinhDang].join(' '), tu));
    const mang = tu.length ? (ShinApp.MODULES || []).filter(m => this.khop([m.ma, m.ten].join(' '), tu)) : [];
    el.innerHTML = `
      ${mang.length ? `<div class="hn-tieu"><span>MẢNG KHỚP · ${mang.length}</span></div>
        <div class="hn-list">${mang.map(m => `<div class="hn-dong" role="button" tabindex="0" onclick="ShinApp.chuyenModule('${e(m.ma)}')">
          <div class="dong-content"><div class="dong-title">${e(m.icon || m.bieuTuong || '')} ${e(m.ten)}</div></div><span class="dong-arrow">›</span></div>`).join('')}</div>` : ''}
      <div class="hn-tieu"><span>TÀI LIỆU QUY TRÌNH SOP & HỆ THỐNG · ${tl.length}</span></div>
      <div class="hn-list">${tl.map(t => `<div class="hn-dong" role="button" tabindex="0" onclick="ModuleTriThuc.xemTaiLieu('${e(t.ma)}')">
        <div class="dong-content"><div class="dong-title">${e(t.ten)}</div>
          <div class="dong-sub">${e(t.ma)} · ${e(t.linhVuc)} · cập nhật ${e(t.capNhat)}</div></div>
        <span class="dong-arrow">›</span></div>`).join('')}</div>
      ${tl.length || mang.length ? '' : `<div class="trong">Không tìm thấy "${e(q)}".</div>`}
      <p class="chu-phu">📂 Kho tài liệu đồng bộ tại <code>He sinh thai Shin/05_TriThuc</code> (Second Brain). Tìm ở đây lọc ngay trên máy, không gửi từ khóa đi đâu.</p>`;
  },

  xemTaiLieu: function(ma) {
    const t = ((window.SHIN_DEMO_DATA.trithuc || {}).taiLieu || []).find(x => x.ma === ma);
    ShinApp.toast(t ? `[${t.ma}] ${t.ten} – mở trong Second Brain (05_TriThuc).` : 'Không thấy tài liệu.', 'info');
  },

  moTimKiem: function() {
    const o = document.getElementById('ttTim');
    if (o) { o.focus(); o.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
  }
};
