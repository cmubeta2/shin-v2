/**
 * SHIN v2 – Tầng 0B: Universal Approval Center (Trung Tâm Phê Duyệt 1-Chạm)
 * Gom toàn bộ yêu cầu cần Sếp quyết định về 1 giao diện duy nhất:
 * - Báo cáo ca ngày Phòng khám (PK) kèm ảnh minh chứng
 * - Đề xuất phát sinh chi phí / tạm ứng Dự án (DA)
 * - Đơn xin đổi ca / nghỉ phép Nhân sự (NS)
 * - Duyệt kịch bản & bài viết Marketing (MKT)
 */

const ModulePheDuyet = {
  ma: 'pheduyet',
  ten: 'Phê Duyệt 1-Chạm',
  bieuTuong: '⚡',
  paletteMacDinh: 'executive',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.pheduyet;
    const hero = d.hero || {};
    const danhSach = d.danhSach || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Trung Tâm Phê Duyệt 1-Chạm</div>
          <div class="page-sub">Hộp thư quyết định tập trung cho Sếp & Điều hành</div>
        </div>
        <button class="btn-icon" onclick="ModulePheDuyet.duyetTatCa()" title="Duyệt tất cả">✓✓</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Hộp Thư Phê Duyệt 1-Chạm ⚡'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Tập trung quyết định toàn hệ sinh thái'}</div>
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

        <button class="btn-primary" onclick="ModulePheDuyet.duyetTatCa()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '✅ Duyệt Tất Cả Các Mục An Toàn'}
        </button>
      </div>

      <!-- Danh Sách Yêu Cầu Chờ Phê Duyệt -->
      <div class="section-title">
        <span>YÊU CẦU CHỜ QUYẾT ĐỊNH · ${danhSach.length}</span>
        <button class="btn-secondary" style="min-height:36px; padding:0 10px; font-size:12px;" onclick="ShinApp.toast('Đã đồng bộ lại hộp thư phê duyệt')">
          Làm mới
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        ${danhSach.map(item => `
          <div class="card" id="card-${item.id}">
            <div class="card-header">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:20px;">${item.bieuTuong}</span>
                <div>
                  <span class="status-pill warn" style="font-size:10px; padding:2px 6px; margin-bottom:2px; display:inline-block;">
                    ${item.loai}
                  </span>
                  <div class="card-title" style="font-size:14px;">${item.tieuDe}</div>
                </div>
              </div>
            </div>

            <div style="font-size:12px; color:var(--text-muted); margin:8px 0;">
              <div>📍 Đơn vị / Dự án: <strong>${item.duAn}</strong></div>
              <div>👤 Người gửi: <strong>${item.nguoiGui}</strong> · ⏱️ ${item.thoiGian}</div>
            </div>

            <div style="font-size:12px; color:var(--text); background:var(--bg-sub); padding:8px 10px; border-radius:6px; margin-bottom:10px; line-height:1.4;">
              💬 <em>"${item.chiTiet}"</em>
            </div>

            ${item.soTien && item.soTien !== '—' ? `
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px; font-weight:700;">
                <span>Số tiền đề xuất:</span>
                <span style="color:var(--c-red); font-size:15px;">${item.soTien}</span>
              </div>
            ` : ''}

            <!-- Nút Thao Tác 1-Chạm -->
            <div style="display:flex; gap:8px;">
              <button class="btn-primary" style="flex:2; min-height:40px; font-size:13px; background:var(--c-green);" onclick="ModulePheDuyet.duyet('${item.id}', '${item.tieuDe}')">
                ✓ Phê Duyệt Ngay
              </button>
              <button class="btn-secondary" style="flex:1; min-height:40px; font-size:12px;" onclick="ModulePheDuyet.yeuCauSua('${item.id}')">
                Góp ý
              </button>
              <button class="btn-secondary" style="min-height:40px; font-size:12px; color:var(--c-red);" onclick="ModulePheDuyet.tuChoi('${item.id}')">
                ✕ Từ chối
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    container.innerHTML = html;
  },

  duyet: function(id, tieuDe) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
      card.style.transition = 'all 0.3s ease';
      card.style.opacity = '0.3';
      card.style.transform = 'scale(0.98)';
      setTimeout(() => card.remove(), 400);
    }
    ShinApp.toast(`Đã phê duyệt 1-chạm: "${tieuDe}"! 🟢`);
  },

  yeuCauSua: function(id) {
    ShinApp.toast(`Đã mở hộp thoại phản hồi góp ý cho phiếu ${id} 📝`, 'info');
  },

  tuChoi: function(id) {
    const card = document.getElementById(`card-${id}`);
    if (card) {
      card.remove();
    }
    ShinApp.toast(`Đã từ chối phiếu ${id}. Thông báo đã gửi đến người lập 🔴`, 'warn');
  },

  duyetTatCa: function() {
    ShinApp.toast('Đã phê duyệt toàn bộ các mục an toàn trong danh sách! 🟢');
    setTimeout(() => {
      const container = document.getElementById('appContent');
      if (container) {
        container.innerHTML = `
          <div style="text-align:center; padding:60px 20px; color:var(--text-muted);">
            <div style="font-size:42px; margin-bottom:12px;">🎉</div>
            <div style="font-weight:700; font-size:16px; color:var(--text); margin-bottom:6px;">Tuyệt vời, Sếp Tâm!</div>
            <div>Hộp thư phê duyệt hiện đang trống. Mọi quyết định đã được xử lý xong.</div>
            <button class="btn-primary" style="margin-top:20px; max-width:200px;" onclick="ShinApp.chuyenModule('hub')">
              Về Trang Hôm Nay
            </button>
          </div>
        `;
      }
    }, 600);
  }
};
