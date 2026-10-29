/**
 * SHIN v2 – Module 3: Tuyển Sinh & Cung Ứng Nhân Lực
 */

const ModuleTuyenSinh = {
  ma: 'tuyensinh',
  ten: 'Tuyển Sinh',
  bieuTuong: '🎓',
  paletteMacDinh: 'growth',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.tuyensinh;
    const hero = d.hero || {};
    const chienDich = d.chienDich || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Tuyển Sinh & Nhân Lực</div>
          <div class="page-sub">Chiến dịch GDU & Huế · Hoa hồng bậc thang</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Tuyển Sinh & Cung Ứng Nhân Lực 🎓'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Chiến dịch tuyển sinh 2026'}</div>
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

        <button class="btn-primary" onclick="ModuleTuyenSinh.nhapLead()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '＋ Tiếp Nhận Lead Mới'}
        </button>
      </div>

      <!-- Danh Sách Chiến Dịch -->
      <div class="section-title">
        <span>CHIẾN DỊCH ĐANG CHẠY · ${chienDich.length}</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModuleTuyenSinh.xuatHoaHong()">Bảng hoa hồng</button>
      </div>

      <div class="hn-list">
        ${chienDich.map(cd => `
          <div class="hn-dong" onclick="ModuleTuyenSinh.chiTietCD('${cd.ma}')">
            <div class="dong-icon" style="background: var(--primary-soft); color: var(--primary)">
              🎓
            </div>
            <div class="dong-content">
              <div class="dong-title">[${cd.ma}] ${cd.ten}</div>
              <div class="dong-sub">Hạn: ${cd.han} · ${cd.hoaHong}</div>
            </div>
            <div class="dong-meta">
              <div class="dong-so" style="color: var(--primary);">${cd.nhapHoc}/${cd.lead}</div>
              <span class="dong-arrow">›</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Khối Lead Mới Nhất -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <div class="card-title">📥 Cổng Tiếp Nhận Lead Web (lead_web)</div>
          <span class="status-pill live">Tự động hóa</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
          Trang đích từ Xưởng Web (Netlify, Pages, Vercel) tự động gửi POST lead_web về hệ thống. Giới hạn 1 SĐT / 10 phút, tự chống SPAM bằng honeypot.
        </p>
      </div>
    `;

    container.innerHTML = html;
  },

  nhapLead: function() {
    ShinApp.toast('Mở form tiếp nhận ứng viên mới...', 'info');
  },

  xuatHoaHong: function() {
    ShinApp.toast('Xuất bảng tính hoa hồng bậc thang cho đại lý...', 'info');
  },

  chiTietCD: function(ma) {
    ShinApp.toast(`Mở chi tiết chiến dịch: ${ma}`);
  }
};
