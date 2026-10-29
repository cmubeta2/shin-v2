/**
 * SHIN v2 – Module 5: Vận Hành Phòng Khám & PTKH
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  /** App Phòng khám v1 hiện chỉ mở cổng webKhoiDong (kiểm quyền) – số liệu chi tiết chưa có cổng web, nên vẫn hiện mẫu. */
  taiLive: async function() {
    const kq = await SHIN_API.goiCong('PK', 'webKhoiDong');
    if (!kq.ok) return kq;
    return { ok: true, data: null, ghiChu: 'Đã vào được app Phòng khám v1, nhưng app chưa mở cổng số liệu cho v2 – số bên dưới là MẪU. Thao tác thật làm trên app v1.' };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.phongkham;
    const hero = d.hero || {};
    const nhanSuTruc = d.nhanSuTruc || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Vận Hành Phòng Khám & PTKH</div>
          <div class="page-sub">Báo cáo ngày · Minh chứng ảnh · Xếp lịch trực</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Vận Hành Phòng Khám & PTKH 🏥'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Ca trực hôm nay'}</div>
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

        <button class="btn-primary" onclick="ModulePhongKham.guiBaoCao()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '📷 Gửi Báo Cáo & Minh Chứng'}
        </button>
      </div>

      <!-- Nhân Sự Trực Ca -->
      <div class="section-title">
        <span>ĐỘI NGŨ TRỰC CA HÔM NAY · ${nhanSuTruc.length} NHÂN VIÊN</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModulePhongKham.xemLich()">Lịch trực tuần</button>
      </div>

      <div class="hn-list">
        ${nhanSuTruc.map(ns => `
          <div class="hn-dong">
            <div class="dong-icon" style="background: ${ns.mau}20; color: ${ns.mau}">
              👤
            </div>
            <div class="dong-content">
              <div class="dong-title">${ns.ten}</div>
              <div class="dong-sub">${ns.viTri} · Ca ${ns.ca}</div>
            </div>
            <div class="dong-meta">
              <span style="font-size:12px; font-weight:700; color: ${ns.mau};">${ns.tt}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Khối Minh Chứng Ảnh -->
      <div class="card" style="margin-top:20px;">
        <div class="card-header">
          <div class="card-title">📸 Nhật Ký Minh Chứng Trực Tuyến</div>
          <span class="status-pill live">Drive Sync</span>
        </div>
        <p style="font-size:13px; color:var(--text-muted); line-height:1.6;">
          Hình ảnh tuần tra chất lượng, biên bản họp giao ban, và minh chứng chỉ số được tự động đồng bộ về thư mục Drive phòng ban với mã nhân viên và dấu thời gian.
        </p>
      </div>
    `;

    container.innerHTML = html;
  },

  guiBaoCao: function() {
    ShinApp.moV1('PK', 'Phòng khám');
  },

  xemLich: function() {
    ShinApp.moV1('PK', 'Phòng khám');
  }
};
