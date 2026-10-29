/**
 * SHIN v2 – Module 2: KPI Toàn Viện (Ban Kiểm Soát)
 */

const ModuleKPI = {
  ma: 'kpi',
  ten: 'KPI Toàn Viện',
  bieuTuong: '📊',
  paletteMacDinh: 'crimson',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.kpi;
    const hero = d.hero || {};
    const khoaPhong = d.khoaPhong || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">KPI & Hiệu Suất Toàn Viện</div>
          <div class="page-sub">Ban Kiểm Soát · Dữ liệu nguồn TV3 Read-Only</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'BKS – Giám sát KPI Toàn Viện 🎯'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Tham chiếu AOP 2026'}</div>
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

        <button class="btn-primary" onclick="ModuleKPI.xemBanTin()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '📊 Xem Bản Tin Tạm Tính Tháng'}
        </button>
      </div>

      <!-- Tiến độ Khoa Phòng -->
      <div class="section-title">
        <span>TIẾN ĐỘ THEO KHOA / PHÒNG · ${khoaPhong.length} ĐƠN VỊ</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModuleKPI.soatLoi()">Soát lỗi chốt quý</button>
      </div>

      <div class="hn-list">
        ${khoaPhong.map(kp => `
          <div class="hn-dong" onclick="ModuleKPI.chiTietKhoa('${kp.ten}')">
            <div class="dong-icon" style="background: ${kp.den}20; color: ${kp.den}">
              🏥
            </div>
            <div class="dong-content">
              <div class="dong-title">${kp.ten}</div>
              <div class="dong-sub">AOP: ${kp.aop} · Trạng thái: ${kp.trangThai}</div>
            </div>
            <div class="dong-meta">
              <div class="dong-so" style="color: ${kp.den}">${kp.dat}</div>
              <span class="dong-arrow">›</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Khối quy tắc BKS -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <div class="card-title">📌 Quy ước Giám sát BKS</div>
          <span class="status-pill live">Chỉ đọc TV3</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
          • Số TVM là tổng toàn viện. Doanh thu mỗi khoa gồm trực tiếp và gián tiếp nên không cộng dồn các khoa để so với viện.<br>
          • Bản tin tháng tự động kết xuất ngày 08 hàng tháng.
        </p>
      </div>
    `;

    container.innerHTML = html;
  },

  xemBanTin: function() {
    ShinApp.toast('Đang mở Bản Tin Tạm Tính Tháng 10...', 'info');
  },

  soatLoi: function() {
    ShinApp.toast('Đang quét soát lỗi dữ liệu chốt Quý III...', 'info');
  },

  chiTietKhoa: function(ten) {
    ShinApp.toast(`Mở chi tiết KPI: ${ten}`);
  }
};
