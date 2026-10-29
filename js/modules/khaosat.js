/**
 * SHIN v2 – Module 4: Khảo Sát Sự Hài Lòng Người Bệnh
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.khaosat;
    const hero = d.hero || {};
    const chiSoNhom = d.chiSoNhom || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Khảo Sát Sự Hài Lòng</div>
          <div class="page-sub">Tiêu chuẩn ACHSI & Quản trị Trải nghiệm FMFT</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Khảo Sát Trải Nghiệm Người Bệnh 🩺'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Chuẩn chất lượng ACHSI & FMFT'}</div>
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

        <button class="btn-primary" onclick="ModuleKhaoSat.guiKhaoSat()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '📝 Gửi Phiếu Khảo Sát Mới'}
        </button>
      </div>

      <!-- Chỉ Số 5 Nhóm ACHSI -->
      <div class="section-title">
        <span>ĐÁNH GIÁ 5 TRỤ CỘT CHẤT LƯỢNG · ACHSI</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModuleKhaoSat.xuatBaoCao()">Xuất báo cáo</button>
      </div>

      <div class="hn-list">
        ${chiSoNhom.map(cs => `
          <div class="hn-dong">
            <div class="dong-icon" style="background: ${cs.mau}20; color: ${cs.mau}">
              🩺
            </div>
            <div class="dong-content">
              <div class="dong-title">${cs.nhan}</div>
              <div class="dong-sub">Điểm trung bình: ${cs.diem}/5.0</div>
            </div>
            <div class="dong-meta">
              <div class="dong-so" style="color: ${cs.mau}; font-size:18px;">${cs.tyLe}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Khối Ý Kiến Người Bệnh -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <div class="card-title">💬 Ý Kiến Đóng Góp Cần Xử Lý Nhanh</div>
          <span class="status-pill demo">Thời gian thực</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
          Hệ thống phát hiện ngay các phiếu có đánh giá ≤ 2 sao hoặc có phản hồi chưa hài lòng để lãnh đạo phòng và tổ CSKH liên hệ xử lý trong 15 phút.
        </p>
      </div>
    `;

    container.innerHTML = html;
  },

  guiKhaoSat: function() {
    ShinApp.toast('Mở form khảo sát trải nghiệm người bệnh 17 câu...', 'info');
  },

  xuatBaoCao: function() {
    ShinApp.toast('Xuất báo cáo phân tích xu hướng khảo sát hàng tháng...', 'info');
  }
};
