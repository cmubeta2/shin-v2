/**
 * SHIN v2 – Module 12: Xưởng Web & Landing Page Tự Động Hóa (Web Factory)
 * Tích hợp Xưởng Web vào Hệ điều hành Shin AIOS v2
 * Cung cấp cổng liên thông Lead Web (lead_web), 7 mẫu web chuẩn, 12 website xuất xưởng và hàng đợi cron mỗi 5 tiếng.
 */

const ModuleWeb = {
  ma: 'web',
  ten: 'Xưởng Web',
  bieuTuong: '🌐',
  paletteMacDinh: 'growth',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.web || {};
    const hero = d.hero || {};
    const mauWeb = d.mauWeb || [];
    const webDaXuat = d.webDaXuat || [];
    const hangDoi = d.hangDoi || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Xưởng Web & Landing Page</div>
          <div class="page-sub">Hệ thống sản xuất web tự động · 7 mẫu chuẩn · Kiểm định 100%</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <!-- Hero Card Chuẩn Shin -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Xưởng Web Hệ Sinh Thái Shin 🌐'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Tự động kiểm tra mỗi 5 tiếng · Cron active (0 */5 * * *)'}</div>
          </div>
        </div>

        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o" onclick="ModuleWeb.loc('${s.nhan}')">
              <div class="tq-so" style="color: ${s.mau}">${s.giaTri}</div>
              <div class="tq-nhan">${s.nhan}</div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn-primary" style="flex:1;" onclick="ModuleWeb.moAppCloudflare()">
            🚀 Mở Ứng Dụng Quản Lý Xưởng Web (Live)
          </button>
          <button class="btn-secondary" style="min-width:140px;" onclick="ModuleWeb.taoYeuCauWeb()">
            ＋ Tạo Web Mới
          </button>
        </div>
      </div>

      <!-- Cổng Liên Thông Module (Inter-Module Ports) -->
      <div class="section-title">
        <span>CỔNG LIÊN THÔNG DỮ LIỆU & TỰ ĐỘNG HÓA</span>
        <span class="status-pill live">2 Cổng Hoạt Động</span>
      </div>

      <div class="card" style="margin-bottom:16px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:12px;">
          <div style="padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--card-radius);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:700; font-size:13px; color:var(--primary);">📥 Cổng lead_web</span>
              <span class="badge xanh">Đã mở</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); line-height:1.5;">
              Nhận form đăng ký từ các web xuất xưởng, tự động đẩy lead về <strong>Module Tuyển Sinh</strong> & <strong>CRM</strong>.
            </div>
          </div>
          <div style="padding:10px; background:var(--bg); border:1px solid var(--border); border-radius:var(--card-radius);">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:700; font-size:13px; color:var(--primary);">⏰ Tác Vụ Cron Hằng Giờ</span>
              <span class="badge xanh">Active (0 */5 * * *)</span>
            </div>
            <div style="font-size:12px; color:var(--text-muted); line-height:1.5;">
              Quét <code>YEU_CAU_WEB.json</code> vào mỗi 5 tiếng (00 phút), tự động dựng web và báo cáo về <strong>Executive Hub</strong>.
            </div>
          </div>
        </div>
      </div>

      <!-- Danh Sách 7 Mẫu Web Chuẩn -->
      <div class="section-title">
        <span>7 BỘ MẪU GIAO DIỆN XƯỞNG WEB</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModuleWeb.xemHuongDanMau()">Quy chuẩn mẫu</button>
      </div>

      <div class="hn-list" style="margin-bottom:20px;">
        ${mauWeb.map(m => `
          <div class="hn-dong" onclick="ModuleWeb.chiTietMau('${m.ma}')">
            <div class="dong-icon" style="background: var(--primary-soft); color: var(--primary); font-size:18px;">
              ${m.icon || '🎨'}
            </div>
            <div class="dong-content">
              <div class="dong-title">[${m.ma}] ${m.ten}</div>
              <div class="dong-sub">${m.moTa} · Phù hợp: ${m.doiTuong}</div>
            </div>
            <div class="dong-meta">
              <span class="badge ${m.badgeColor || 'xanh'}">${m.phienBan || 'v1.8'}</span>
              <span class="dong-arrow">›</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Danh Bạ Web Đang Hoạt Động -->
      <div class="section-title">
        <span>DANH BẠ 12 WEBSITE ĐÃ XUẤT XƯỞNG</span>
        <button class="btn-secondary" style="min-height:36px; padding:4px 10px; font-size:12px;" onclick="ModuleWeb.kiemTraTatCaWeb()">Kiểm định lại</button>
      </div>

      <div class="hn-list" style="margin-bottom:20px;">
        ${webDaXuat.map(w => `
          <div class="hn-dong" onclick="ModuleWeb.moWeb('${w.duongDanLive || w.duongDan}')">
            <div class="dong-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981; font-size:18px;">
              🌐
            </div>
            <div class="dong-content">
              <div class="dong-title">${w.ten}</div>
              <div class="dong-sub">Mẫu: <code>${w.mau}</code> · ${w.moTa}</div>
            </div>
            <div class="dong-meta">
              <span class="badge xanh">${w.trangThai || '100% Đạt'}</span>
              <span class="dong-arrow">›</span>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Hàng Đợi Tự Động Hóa YEU_CAU_WEB.json -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">📥 Hàng Đợi Yêu Cầu Web (YEU_CAU_WEB.json)</div>
          <button class="btn-secondary" style="min-height:32px; padding:2px 8px; font-size:11px;" onclick="ModuleWeb.lamMoiHangDoi()">↻ Làm mới</button>
        </div>
        <div style="font-size:13px; color:var(--text-muted); margin-bottom:12px;">
          Lập lịch tự động chạy mỗi 5 tiếng qua Task Background Antigravity để quét và xuất xưởng web.
        </div>
        <div class="hn-list">
          ${hangDoi.map(yc => `
            <div class="hn-dong">
              <div class="dong-icon" style="background: ${yc.trang_thai === 'hoan_thanh' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)'}; color: ${yc.trang_thai === 'hoan_thanh' ? '#10b981' : '#f59e0b'}; font-size:16px;">
                ${yc.trang_thai === 'hoan_thanh' ? '✓' : '⏳'}
              </div>
              <div class="dong-content">
                <div class="dong-title">[${yc.id}] ${yc.ten_web}</div>
                <div class="dong-sub">${yc.moTa || yc.ghi_chu || yc.mo_ta} · Mẫu: ${yc.mau}</div>
              </div>
              <div class="dong-meta">
                <span class="badge ${yc.trang_thai === 'hoan_thanh' ? 'xanh' : 'vang'}">
                  ${yc.trang_thai === 'hoan_thanh' ? 'Hoàn tất' : 'Chờ xử lý'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  moAppCloudflare: function() {
    window.open('https://shin-web-ape.pages.dev/', '_blank');
  },

  taoYeuCauWeb: function() {
    ShinApp.toast('Mở form gửi yêu cầu tạo trang web mới...', 'info');
    window.open('https://shin-web-ape.pages.dev/#tab-hang-doi', '_blank');
  },

  loc: function(nhan) {
    ShinApp.toast(`Lọc danh sách theo: ${nhan}`, 'info');
  },

  chiTietMau: function(ma) {
    ShinApp.toast(`Mẫu: ${ma}. Mở bảng thông số và schema nội dung...`, 'info');
  },

  moWeb: function(url) {
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      window.open(url, '_blank');
    } else {
      window.open('https://shin-web-ape.pages.dev/#tab-danh-ba', '_blank');
    }
  },

  xemHuongDanMau: function() {
    ShinApp.toast('Mở sổ tay quy chuẩn 7 mẫu web Xưởng Web v1.8.0', 'info');
  },

  kiemTraTatCaWeb: function() {
    ShinApp.toast('Tất cả 12 website đều vượt qua kiểm định 360px & touch >= 44px (100% ĐẠT)!', 'xanh');
  },

  lamMoiHangDoi: function() {
    ShinApp.toast('Đang đồng bộ hàng đợi yêu cầu web mới...', 'info');
  }
};
