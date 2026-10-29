/**
 * SHIN v2 – Module 6: Quản Lý Dự Án & Báo Cáo Nhanh Mỗi Ngày (Daily Flash Report)
 * Tích hợp Master Dashboard và 4 Khối Báo Cáo Sếp Chỉ Đạo:
 * 1. Trạng thái tiến độ
 * 2. Vướng mắc & đề xuất giải pháp
 * 3. Tình hình tài chính & phát sinh
 * 4. Chờ phê duyệt...
 */

const ModuleDuAn = {
  ma: 'duan',
  ten: 'Quản Lý Dự Án',
  bieuTuong: '📌',
  paletteMacDinh: 'executive',
  tabHienTai: 'flash', // 'flash' hoặc 'danhsach'

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.duan;
    const hero = d.hero || {};
    const danhSach = d.danhSachDuAn || [];
    const flash = d.flashReport || {};

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Lý Dự Án</div>
          <div class="page-sub">Master Dashboard & Báo Cáo Nhanh Mỗi Ngày (Daily Flash)</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="min-height:36px; padding:0 12px; font-size:12px;" onclick="ModuleDuAn.chuyenTab('flash')">⚡ Flash Report</button>
          <button class="btn-secondary" style="min-height:36px; padding:0 12px; font-size:12px;" onclick="ModuleDuAn.chuyenTab('danhsach')">📊 Danh Sách</button>
        </div>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Quản Lý Dự Án & Báo Cáo Nhanh 📌'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Chu kỳ điều hành Q4/2026'}</div>
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

        <div style="display:flex; gap:10px; margin-top:14px;">
          <button class="btn-primary" style="flex:1;" onclick="ModuleDuAn.moFormTaoMoi()">
            ＋ Tạo Dự Án Mới
          </button>
          <button class="btn-secondary" style="background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.4);" onclick="ModuleDuAn.xuatBaoCao()">
            📤 Xuất PDF
          </button>
        </div>
      </div>

      <!-- Tab Điều Hướng Phụ -->
      <div style="display:flex; gap:8px; margin: 16px 0; border-bottom:1px solid var(--border); padding-bottom:8px;">
        <button class="module-chip ${this.tabHienTai === 'flash' ? 'active' : ''}" onclick="ModuleDuAn.chuyenTab('flash')">
          ⚡ Báo Cáo Nhanh Hôm Nay (Daily Flash)
        </button>
        <button class="module-chip ${this.tabHienTai === 'danhsach' ? 'active' : ''}" onclick="ModuleDuAn.chuyenTab('danhsach')">
          📊 Master Dashboard (${danhSach.length})
        </button>
      </div>

      <div id="duAnTabContent">
        ${this.tabHienTai === 'flash' ? this.renderFlash(flash) : this.renderDanhSach(danhSach)}
      </div>
    `;

    container.innerHTML = html;
  },

  renderFlash: function(flash) {
    const k1 = flash.khoi1_tienDo || [];
    const k2 = flash.khoi2_vuongMac || [];
    const k3 = flash.khoi3_taiChinh || {};
    const k4 = flash.khoi4_choDuyet || [];

    return `
      <!-- Khung Flash Report Độc Quyền Theo Yêu Cầu Của Sếp -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:13px; font-weight:700; color:var(--text);">
          ⏱️ CHỐT DỮ LIỆU: <span style="color:var(--primary);">${flash.ngay || 'Hôm nay'}</span>
        </div>
        <span class="status-pill live">Tự động tổng hợp 24/7</span>
      </div>

      <!-- KHỐI 1: TRẠNG THÁI TIẾN ĐỘ -->
      <div class="flash-card flash-k1">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#0284c7;">1</span>
            TRẠNG THÁI TIẾN ĐỘ DỰ ÁN
          </div>
          <span style="font-size:12px; color:var(--text-muted);">${k1.length} điểm tin chính</span>
        </div>
        <ul class="flash-list">
          ${k1.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <!-- KHỐI 2: VƯỚNG MẮC & ĐỀ XUẤT GIẢI PHÁP -->
      <div class="flash-card flash-k2">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#dc2626;">2</span>
            VƯỚNG MẮC & ĐỀ XUẤT GIẢI PHÁP
          </div>
          <span class="status-pill danger" style="padding:2px 8px; font-size:11px;">Cần chú ý</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${k2.map((v, i) => `
            <div style="background:var(--bg-card); padding:10px 12px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-weight:700; font-size:13px; color:var(--text); margin-bottom:4px;">
                ⚠️ ${v.vanDe}
              </div>
              <div style="font-size:12px; color:var(--c-green); font-weight:600; line-height:1.4;">
                💡 <strong>Đề xuất giải pháp:</strong> ${v.deXuat}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- KHỐI 3: TÌNH HÌNH TÀI CHÍNH & PHÁT SINH -->
      <div class="flash-card flash-k3">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#16a34a;">3</span>
            TÌNH HÌNH TÀI CHÍNH & PHÁT SINH
          </div>
          <div style="font-size:12px; font-weight:700; color:var(--text);">
            Giải ngân: ${k3.daGiaiNgan || '—'}
          </div>
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:8px;">
          Tổng quỹ phê duyệt: <strong>${k3.tongNganSach || '—'}</strong>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(k3.phatSinhTrongNgay || []).map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:8px 12px; border-radius:6px; font-size:12px; border:1px solid var(--border);">
              <div>
                <div style="font-weight:600; color:var(--text);">${p.khoanMuc}</div>
                <div style="color:var(--text-muted); font-size:11px;">Người đề xuất: ${p.nguoiChi}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:700; color:var(--c-red);">${p.soTien}</div>
                <span class="status-pill ${p.tinhTrang.includes('Chờ') ? 'warn' : 'live'}" style="font-size:10px; padding:2px 6px;">
                  ${p.tinhTrang}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- KHỐI 4: VIỆC ĐANG CHỜ PHÊ DUYỆT -->
      <div class="flash-card flash-k4">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#d97706;">4</span>
            VIỆC ĐANG CHỜ SẾP PHÊ DUYỆT
          </div>
          <span class="status-pill warn" style="padding:2px 8px; font-size:11px;">${k4.length} mục chờ</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${k4.map(cd => `
            <div style="background:var(--bg-card); padding:10px 12px; border-radius:8px; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="font-weight:700; font-size:13px; color:var(--text);">${cd.tieuDe}</div>
                <span style="font-size:11px; color:var(--c-red); font-weight:700; white-space:nowrap; margin-left:8px;">${cd.uuTien}</span>
              </div>
              <div style="font-size:11px; color:var(--text-muted); margin:4px 0 8px 0;">Phân loại: ${cd.loai} · Hạn: ${cd.han}</div>
              <div style="display:flex; gap:8px;">
                <button class="btn-primary" style="flex:1; min-height:36px; padding:0 8px; font-size:12px; background:var(--c-green);" onclick="ModuleDuAn.duyetNhanh('${cd.ma}')">
                  ✓ Duyệt 1-Chạm
                </button>
                <button class="btn-secondary" style="min-height:36px; padding:0 10px; font-size:12px;" onclick="ModuleDuAn.yeuCauSua('${cd.ma}')">
                  Góp ý / Yêu cầu sửa
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderDanhSach: function(danhSach) {
    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${danhSach.map(da => `
          <div class="card" style="border-left:4px solid ${da.den};">
            <div class="card-header">
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--primary);">${da.ma}</div>
                <div class="card-title" style="font-size:15px; margin-top:2px;">${da.ten}</div>
              </div>
              <span class="status-pill" style="background:${da.den}20; color:${da.den}; font-weight:700;">
                ${da.tienDo}%
              </span>
            </div>

            <!-- Thanh Tiến Độ -->
            <div style="background:var(--border); height:6px; border-radius:3px; margin:10px 0; overflow:hidden;">
              <div style="background:${da.den}; width:${da.tienDo}%; height:100%;"></div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; color:var(--text-muted); margin-bottom:10px;">
              <div>👤 Phụ trách: <strong>${da.quanLy}</strong></div>
              <div>📅 Hạn: <strong>${da.hanChot}</strong></div>
              <div>💰 Ngân sách: <strong>${da.nganSach}</strong></div>
              <div>💳 Đã chi: <strong>${da.daChi}</strong></div>
            </div>

            <div style="font-size:12px; color:var(--text); background:var(--bg-sub); padding:6px 10px; border-radius:6px; margin-bottom:10px;">
              📌 <strong>Trạng thái:</strong> ${da.trangThai}
            </div>

            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" style="flex:1; min-height:36px; font-size:12px;" onclick="ShinApp.toast('Mở chi tiết dự án: ${da.ma}')">
                Chi tiết WBS
              </button>
              <button class="btn-primary" style="min-height:36px; font-size:12px; padding:0 12px;" onclick="ShinApp.toast('Cập nhật tiến độ dự án: ${da.ma}')">
                Cập nhật
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  chuyenTab: function(tab) {
    this.tabHienTai = tab;
    const container = document.getElementById('appContent');
    if (container) {
      this.render(container, window.SHIN_DEMO_DATA.duan);
    }
  },

  duyetNhanh: function(ma) {
    ShinApp.toast(`Đã duyệt 1-chạm thành công mục ${ma}! 🟢`);
  },

  yeuCauSua: function(ma) {
    ShinApp.toast(`Đã gửi yêu cầu bổ sung/chỉnh sửa cho ${ma} 📝`, 'info');
  },

  moFormTaoMoi: function() {
    ShinApp.toast('Mở biểu mẫu khởi tạo dự án mới', 'info');
  },

  xuatBaoCao: function() {
    ShinApp.toast('Đang chuẩn bị file Flash Report PDF...', 'info');
  }
};
