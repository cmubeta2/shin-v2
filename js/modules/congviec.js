/**
 * SHIN v2 – Module 7: Quản Lý Công Việc (Universal Task Bus)
 * Trục liên thông việc toàn hệ sinh thái dạng Kanban đa nguồn:
 * Tự động gom việc từ Hub, Báo cáo Phòng khám, Dự án, CRM Lead, Tài chính
 */

const ModuleCongViec = {
  ma: 'congviec',
  ten: 'Quản Lý Công Việc',
  bieuTuong: '📋',
  paletteMacDinh: 'executive',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.congviec;
    const hero = d.hero || {};
    const kanban = d.kanban || { canLam: [], dangLam: [], hoanTat: [] };

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Lý Công Việc</div>
          <div class="page-sub">Trục Task Bus liên thông toàn bộ 10 mảng nghiệp vụ</div>
        </div>
        <button class="btn-icon" onclick="ModuleCongViec.taoViec()" title="Tạo việc mới">＋</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Trục Quản Lý Công Việc Liên Thông 📋'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Task Bus toàn hệ thống'}</div>
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

        <button class="btn-primary" onclick="ModuleCongViec.taoViec()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '＋ Tạo Công Việc Mới'}
        </button>
      </div>

      <!-- Bảng Kanban 3 Cột Liên Thông -->
      <div class="kanban-board">
        <!-- Cột Cần Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⏳ CẦN LÀM</span>
            <span class="status-pill warn" style="padding:2px 6px; font-size:10px;">${kanban.canLam.length}</span>
          </div>
          <div class="kanban-list">
            ${kanban.canLam.map(item => this.renderTaskCard(item, 'canLam')).join('')}
          </div>
        </div>

        <!-- Cột Đang Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⚡ ĐANG LÀM</span>
            <span class="status-pill live" style="padding:2px 6px; font-size:10px;">${kanban.dangLam.length}</span>
          </div>
          <div class="kanban-list">
            ${kanban.dangLam.map(item => this.renderTaskCard(item, 'dangLam')).join('')}
          </div>
        </div>

        <!-- Cột Hoàn Tất -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>✅ HOÀN TẤT</span>
            <span class="status-pill" style="background:var(--c-green)20; color:var(--c-green); padding:2px 6px; font-size:10px;">${kanban.hoanTat.length}</span>
          </div>
          <div class="kanban-list">
            ${kanban.hoanTat.map(item => this.renderTaskCard(item, 'hoanTat')).join('')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderTaskCard: function(item, cot) {
    return `
      <div class="kanban-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:4px;">
          <span style="font-size:10px; font-weight:700; color:var(--primary); background:var(--bg-sub); padding:2px 6px; border-radius:4px;">
            ${item.nguon}
          </span>
          <span style="font-size:10px; color:var(--text-muted);">${item.tag}</span>
        </div>
        <div style="font-weight:600; font-size:13px; color:var(--text); line-height:1.3; margin-bottom:6px;">
          ${item.tieuDe}
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; color:var(--text-muted);">
          <span>👤 ${item.nguoi}</span>
          <span>📅 ${item.han}</span>
        </div>
      </div>
    `;
  },

  taoViec: function() {
    ShinApp.toast('Mở biểu mẫu phân công công việc mới', 'info');
  }
};
