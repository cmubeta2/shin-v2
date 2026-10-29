/**
 * SHIN v2 – Tầng 0A: Quản Trị Hệ Sinh Thái & Bật/Tắt Module
 * Cho phép Sếp điều khiển cấu hình bật/tắt từng mảng/module, phân quyền RBAC
 */

const ModuleCaiDat = {
  ma: 'caidat',
  ten: 'Quản Trị Module',
  bieuTuong: '⚙️',
  paletteMacDinh: 'cyber',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.caidat;
    const hero = d.hero || {};
    const danhSach = d.danhSachMang || [];

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Trị Hệ Sinh Thái</div>
          <div class="page-sub">Bật/tắt module, cấu hình phân quyền và bảng màu</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Bảng màu">🎨</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Quản Trị Hệ Sinh Thái & Bật/Tắt Module ⚙️'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Cấu hình phân quyền toàn hệ'}</div>
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

        <button class="btn-primary" onclick="ModuleCaiDat.luuCauHinh()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '💾 Lưu Cấu Hình Phân Quyền'}
        </button>
      </div>

      <!-- Danh Sách Bật Tắt 10 Mảng Nghiệp Vụ -->
      <div class="section-title">
        <span>ĐIỀU KHIỂN BẬT / TẮT 10 MẢNG NGHIỆP VỤ</span>
        <span class="status-pill live" style="font-size:10px;">Toàn quyền Sếp</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${danhSach.map(item => `
          <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:10px 14px; border-radius:8px; border:1px solid var(--border);">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:10px; font-weight:700; color:var(--primary); background:var(--bg-sub); padding:2px 6px; border-radius:4px;">
                  MẢNG ${item.stt}
                </span>
                <span style="font-weight:700; font-size:13px; color:var(--text);">${item.ten}</span>
              </div>
              <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">Nhóm: ${item.nhom} · Mã: <code>${item.ma}</code></div>
            </div>

            <!-- Công tắc bật tắt -->
            <label style="position:relative; display:inline-block; width:44px; height:24px; cursor:pointer;">
              <input type="checkbox" ${item.bat ? 'checked' : ''} onchange="ModuleCaiDat.toggleMang('${item.ma}', this.checked)" style="opacity:0; width:0; height:0;">
              <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background:${item.bat ? 'var(--primary)' : 'var(--border)'}; border-radius:24px; transition:0.3s;"></span>
              <span style="position:absolute; content:''; height:18px; width:18px; left:${item.bat ? '22px' : '3px'}; bottom:3px; background:white; border-radius:50%; transition:0.3s;"></span>
            </label>
          </div>
        `).join('')}
      </div>

      <!-- Quản Lý Khóa HMAC & Cài Đặt Token -->
      <div class="section-title" style="margin-top:24px;">KẾT NỐI MÁY CHỦ APPS SCRIPT</div>
      <div class="card">
        <div class="card-header">
          <div class="card-title">🔑 Khóa Xác Thực Token HMAC</div>
          <span class="status-pill ${SHIN_API.laCheDoLive() ? 'live' : 'demo'}">
            ${SHIN_API.laCheDoLive() ? '🟢 Live' : '🟡 Demo'}
          </span>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
          Hệ thống kết nối trực tiếp với 5 Web App Google Apps Script (/exec) qua giao thức POST <code>text/plain</code> không preflight CORS.
        </p>
        <button class="btn-primary" onclick="ShinApp.moCaiDat()">
          Cấu Hình Token & Phong Cách Giao Diện
        </button>
      </div>
    `;

    container.innerHTML = html;
  },

  toggleMang: function(ma, trangThai) {
    ShinApp.toast(`Đã ${trangThai ? 'bật' : 'tắt'} module [${ma}]! ⚙️`);
  },

  luuCauHinh: function() {
    ShinApp.toast('Đã lưu cấu hình phân quyền hệ sinh thái thành công! 🟢');
  }
};
