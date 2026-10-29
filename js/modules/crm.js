/**
 * SHIN v2 – Module 2: CRM Khách Hàng & Đối Tác Hợp Nhất
 * Quản lý B2B (Khám sức khỏe Doanh nghiệp), Đối tác Cung ứng, Học viên, CTV Tuyển sinh
 * NGUYÊN TẮC TỐI THƯỢNG: TUYỆT ĐỐI KHÔNG LƯU DỮ LIỆU BỆNH NHÂN / BỆNH ÁN
 */

const ModuleCRM = {
  ma: 'crm',
  ten: 'Khách Hàng & Đối Tác',
  bieuTuong: '👥',
  paletteMacDinh: 'executive',
  boLocHienTai: 'tat_ca',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.crm;
    const hero = d.hero || {};
    const danhBa = d.danhBa || [];
    const leadMoi = d.leadMoi || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Khách Hàng & Đối Tác (CRM)</div>
          <div class="page-sub">Quản lý B2B KSK, Học viên, CTV Tuyển sinh & Cung ứng</div>
        </div>
        <button class="btn-icon" onclick="ModuleCRM.themDoiTac()" title="Thêm mới">＋</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'CRM Khách Hàng & Đối Tác Chiến Lược 👥'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Quản lý quan hệ đối tác B2B & CTV'}</div>
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

        <button class="btn-primary" onclick="ModuleCRM.themDoiTac()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '＋ Thêm Đối Tác / Khách Hàng'}
        </button>
      </div>

      <!-- Khối Lead Mới Đổ Về Từ Web Phễu (Mảng 8) -->
      ${leadMoi.length > 0 ? `
        <div class="section-title">
          <span>LEAD MỚI TỰ ĐỘNG ĐỔ VỀ (MẢNG 8) · ${leadMoi.length}</span>
          <span class="status-pill live" style="font-size:10px;">Thời gian thực</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:18px;">
          ${leadMoi.map(l => `
            <div style="background:var(--bg-card); border-left:4px solid var(--c-yellow); border-radius:8px; padding:10px 12px; border-top:1px solid var(--border); border-right:1px solid var(--border); border-bottom:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="font-weight:700; font-size:13px; color:var(--text);">${l.ten}</div>
                <span style="font-size:11px; color:var(--text-muted);">${l.thoiGian}</span>
              </div>
              <div style="font-size:12px; color:var(--text-muted); margin:3px 0 6px 0;">
                Nguồn: <strong style="color:var(--primary);">${l.nguon}</strong> · SĐT: ${l.soDt}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:12px; color:var(--text);">${l.slKham ? `SL: <strong>${l.slKham}</strong>` : `Khoa: <strong>${l.khoa}</strong>`}</span>
                <button class="btn-primary" style="min-height:30px; padding:0 10px; font-size:11px;" onclick="ShinApp.toast('Đã nhận chăm sóc Lead: ${l.ten}')">
                  Tiếp nhận tư vấn
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- Bộ Lọc Danh Bạ Đối Tác -->
      <div class="section-title">
        <span>DANH BẠ ĐỐI TÁC (${danhBa.length})</span>
        <button class="btn-secondary" style="min-height:36px; padding:0 10px; font-size:12px;" onclick="ShinApp.toast('Tìm kiếm nhanh đối tác')">🔍 Tìm kiếm</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:10px;">
        ${danhBa.map(dt => `
          <div class="card" style="border-left:4px solid ${dt.mau};">
            <div class="card-header">
              <div>
                <span class="status-pill" style="font-size:10px; background:${dt.mau}20; color:${dt.mau}; font-weight:700; margin-bottom:4px; display:inline-block;">
                  ${dt.loai}
                </span>
                <div class="card-title" style="font-size:14px;">${dt.ten}</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:12px; color:var(--text-muted); margin:8px 0;">
              <div>👥 Quy mô: <strong>${dt.quyMo}</strong></div>
              <div>📞 SĐT: <strong>${dt.dienThoai}</strong></div>
              <div style="grid-column:1 / -1;">👤 Liên hệ: <strong>${dt.nguoiLienHe}</strong></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-sub); padding:6px 10px; border-radius:6px; font-size:12px; margin-bottom:8px;">
              <span>Trạng thái: <strong>${dt.trangThai}</strong></span>
              <span class="dong-arrow">›</span>
            </div>

            <div style="display:flex; gap:6px;">
              <button class="btn-secondary" style="flex:1; min-height:34px; font-size:11px;" onclick="ShinApp.toast('Gọi điện cho ${dt.nguoiLienHe}')">
                📞 Liên hệ
              </button>
              <button class="btn-secondary" style="flex:1; min-height:34px; font-size:11px;" onclick="ShinApp.toast('Tạo báo giá / hợp đồng cho ${dt.ten}')">
                📝 Hợp đồng
              </button>
              <button class="btn-primary" style="min-height:34px; font-size:11px; padding:0 12px;" onclick="ShinApp.toast('Mở hồ sơ đối tác ${dt.ma}')">
                Hồ sơ
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Banner Cảnh Báo Tuân Thủ Bảo Mật Y Tế -->
      <div style="margin-top:20px; background:var(--bg-sub); border:1px dashed var(--border); padding:10px 14px; border-radius:8px; font-size:11px; color:var(--text-muted); line-height:1.4;">
        🔒 <strong>Bảo mật & Giới hạn chuyên môn:</strong> Phân hệ CRM chỉ lưu trữ đầu mối liên hệ Doanh nghiệp B2B, Học viên đào tạo, Đối tác trường học và CTV. Tuyệt đối không lưu trữ dữ liệu y khoa hoặc bệnh án cá nhân của người bệnh theo quy tắc <code>KHONG_DUA_VAO.md</code>.
      </div>
    `;

    container.innerHTML = html;
  },

  themDoiTac: function() {
    ShinApp.toast('Mở form thêm đối tác / khách hàng doanh nghiệp mới', 'info');
  }
};
