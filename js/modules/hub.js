/**
 * SHIN v2 – Module 1: Executive Hub (Trung tâm Điều hành)
 */

const ModuleHub = {
  ma: 'hub',
  ten: 'Executive Hub',
  bieuTuong: '🏢',
  paletteMacDinh: 'executive',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.hub;
    const hero = d.hero || {};
    const viec = d.viec || [];
    const dieuHanh = d.dieuHanh || {};

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Executive Hub</div>
          <div class="page-sub">Bàn làm việc trung tâm & Điều phối hệ thống</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Chào buổi sáng, Sếp Tâm 👋'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Thứ Năm, 29/10/2026'}</div>
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

        <button class="btn-primary" onclick="ModuleHub.moDieuHanh()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '⚡ Mở Bàn Điều Hành 🧭'}
        </button>
      </div>

      <!-- Việc Hôm Nay -->
      <div class="section-title">
        <span>CẦN XỬ LÝ NGAY · ${viec.length}</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ShinApp.toast('Đã làm mới danh sách việc')">Làm mới</button>
      </div>

      <div class="hn-list">
        ${viec.map(v => `
          <div class="hn-dong" onclick="ModuleHub.chiTietViec('${v.id}')">
            <div class="dong-icon" style="background: ${v.mau}20; color: ${v.mau}">
              ${v.app === 'KPI' ? '📊' : v.app === 'PK' ? '🏥' : v.app === 'TS' ? '🎓' : v.app === 'KS' ? '🩺' : '📌'}
            </div>
            <div class="dong-content">
              <div class="dong-title">${v.tieuDe}</div>
              <div class="dong-sub">[${v.app}] · Hạn: ${v.han} · ${v.uuTien}</div>
            </div>
            <div class="dong-meta">
              <span class="dong-arrow">›</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Khối Điều Hành 2 Chiều -->
      <div class="section-title" style="margin-top:24px;">TIẾN ĐỘ TÁC VỤ 24/7 & HỘP THƯ AI</div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">🧭 Tác vụ Tự động: ${dieuHanh.tacVuDangChay || 'Hoạt động ổn định'}</div>
          <span class="status-pill live">Tiến độ ${dieuHanh.tienDoHe || '88%'}</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
          Động cơ 4 ca tự động điều phối hàng đợi Lxx giữa Claude Code & Antigravity.
        </p>
        <div class="hn-list">
          ${(dieuHanh.danhSachCho || []).map(item => `
            <div class="hn-dong" style="min-height:48px; padding:8px 12px; background:var(--bg);">
              <div class="dong-content">
                <div class="dong-title" style="font-size:13px;">${item.ma}: ${item.ten}</div>
              </div>
              <div class="dong-meta">
                <span style="font-size:12px; font-weight:700; color:var(--primary);">${item.trangThai}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  moDieuHanh: function() {
    ShinApp.toast('Đang mở Bàn Điều Hành 2 Chiều 🧭 (Tab Điều Hành)', 'info');
  },

  chiTietViec: function(id) {
    ShinApp.toast(`Đang xử lý mục việc [${id}]...`);
  }
};
