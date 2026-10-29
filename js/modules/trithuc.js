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
        <button class="btn-secondary" style="min-height:36px; padding:0 10px; font-size:12px;" onclick="ShinApp.toast('Tải tài liệu tri thức mới')">
          ＋ Thêm tài liệu
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${taiLieu.map(t => `
          <div class="card" onclick="ModuleTriThuc.xemTaiLieu('${t.ma}', '${t.ten}')" style="cursor:pointer;">
            <div class="card-header">
              <div>
                <span class="status-pill live" style="font-size:10px; padding:2px 6px; margin-bottom:4px; display:inline-block;">
                  ${t.linhVuc}
                </span>
                <div class="card-title" style="font-size:14px;">${t.ten}</div>
              </div>
              <span class="dong-arrow">›</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted); margin-top:8px;">
              <span>Mã: <strong>${t.ma}</strong> · Định dạng: ${t.dinhDang}</span>
              <span>Cập nhật: ${t.capNhat}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top:20px; background:var(--bg-sub); padding:12px; border-radius:8px; border:1px solid var(--border); font-size:12px; color:var(--text-muted); line-height:1.4;">
        📂 <strong>Đường dẫn Obsidian Vault:</strong> Kho tài liệu được đồng bộ trực tiếp tại <code>Thiện Phúc Cloud/He sinh thai Shin/05_TriThuc</code>, kết nối liền mạch cùng MCP Obsidian Second Brain của Shin.
      </div>
    `;

    container.innerHTML = html;
  },

  xemTaiLieu: function(ma, ten) {
    ShinApp.toast(`Mở tài liệu: [${ma}] ${ten}`, 'info');
  },

  moTimKiem: function() {
    ShinApp.toast('Mở công cụ tìm kiếm toàn văn FTS5 trong Second Brain', 'info');
  }
};
