/**
 * SHIN v2 – Bộ Não Điều Phối Trung Tâm (Central Application Engine)
 * Tích hợp toàn diện 5 module: Hub, KPI, Tuyển Sinh, Khảo Sát, Phòng Khám
 * Quản trị trạng thái, đổi phong cách giao diện và liên thông dữ liệu.
 */

const ShinApp = (function() {
  const MODULES = [
    ModuleHub,
    ModuleKPI,
    ModuleTuyenSinh,
    ModuleKhaoSat,
    ModulePhongKham
  ];

  const PALETTES = [
    { id: 'executive', ten: 'Executive Hub', mauChinh: '#0284c7', moTa: 'Bàn làm việc Sếp & Quản trị' },
    { id: 'gold', ten: 'Hoàng Kim', mauChinh: '#dc2626', moTa: 'PTKH & Hành chính truyền thống' },
    { id: 'clinical', ten: 'Clinical Precision', mauChinh: '#0f766e', moTa: 'Y tế, Khảo sát (WCAG AAA Teal 700)' },
    { id: 'growth', ten: 'Fintech Growth', mauChinh: '#7c3aed', moTa: 'Tuyển sinh & Bán hàng tốc độ cao' },
    { id: 'nordic', ten: 'Nordic Minimalist', mauChinh: '#475569', moTa: 'Kho tri thức & Quy trình SOP' },
    { id: 'cyber', ten: 'Cyber Terminal', mauChinh: '#10b981', moTa: 'Giám sát hệ thống & Nhật ký tác vụ' },
    { id: 'crimson', ten: 'Crimson Authority', mauChinh: '#991b1b', moTa: 'Ban Kiểm Soát & Kỷ cương' },
    { id: 'mocha', ten: 'Mocha Warmth', mauChinh: '#854d0e', moTa: 'Nhân sự & Lịch trực ấm áp' }
  ];

  let currentModule = 'hub';
  let currentNav = 'home';
  let currentPalette = localStorage.getItem('shin_palette') || 'executive';
  let currentTheme = localStorage.getItem('shin_theme') || 'light';
  let currentCochu = localStorage.getItem('shin_cochu') || 'vua';

  function init() {
    // Áp dụng theme và palette từ đầu
    apDungTheme(currentTheme);
    apDungPalette(currentPalette);
    apDungCochu(currentCochu);

    // Dựng thanh chọn module
    veThanhModule();

    // Dựng menu đáy
    veMenuDay();

    // Cập nhật banner trạng thái kết nối
    capNhatBannerTrangThai();

    // Tải và hiển thị module mặc định
    chuyenModule(currentModule);

    // Lắng nghe sự kiện bàn phím Esc đóng modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') dongModal();
    });
  }

  function apDungTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('shin_theme', theme);
    const btn = document.getElementById('btnTheme');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  function doiTheme() {
    apDungTheme(currentTheme === 'dark' ? 'light' : 'dark');
  }

  function apDungPalette(paletteId) {
    currentPalette = paletteId;
    document.documentElement.setAttribute('data-palette', paletteId);
    localStorage.setItem('shin_palette', paletteId);
    
    // Cập nhật trạng thái trong modal nếu đang mở
    document.querySelectorAll('.palette-card').forEach(card => {
      if (card.dataset.palette === paletteId) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });
  }

  function apDungCochu(cochu) {
    currentCochu = cochu;
    document.documentElement.setAttribute('data-cochu', cochu);
    localStorage.setItem('shin_cochu', cochu);
  }

  function veThanhModule() {
    const bar = document.getElementById('moduleBar');
    if (!bar) return;

    bar.innerHTML = MODULES.map(m => `
      <button class="module-chip ${m.ma === currentModule ? 'active' : ''}" 
              onclick="ShinApp.chuyenModule('${m.ma}')" 
              data-mod="${m.ma}">
        <span>${m.bieuTuong}</span>
        <span>${m.ten}</span>
      </button>
    `).join('');
  }

  function veMenuDay() {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;

    const navItems = [
      { id: 'home', icon: '🏠', label: 'Hôm nay', badge: '' },
      { id: 'report', icon: '📝', label: 'Báo cáo', badge: '3' },
      { id: 'tasks', icon: '✅', label: 'Việc', badge: '6' },
      { id: 'stats', icon: '📊', label: 'Hiệu suất', badge: '' },
      { id: 'profile', icon: '👤', label: 'Tôi', badge: '' }
    ];

    nav.innerHTML = navItems.map(item => `
      <button class="nav-item ${item.id === currentNav ? 'active' : ''}" 
              onclick="ShinApp.chuyenNav('${item.id}')"
              data-nav="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span>${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
      </button>
    `).join('');
  }

  function capNhatBannerTrangThai() {
    const banner = document.getElementById('statusBanner');
    if (!banner) return;

    const isLive = SHIN_API.laCheDoLive();
    if (isLive) {
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="status-pill live">🟢 Trực tiếp (Live)</span>
          <span>Dữ liệu thực từ Google Apps Script & Sheets</span>
        </div>
        <button class="toast-btn" style="padding:0;" onclick="ShinApp.moCaiDat()">Quản lý Token</button>
      `;
    } else {
      banner.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="status-pill demo">🟡 Trình diễn (Demo Mode)</span>
          <span>Mẫu minh họa độc lập · Nhập Token để xem số liệu thật</span>
        </div>
        <button class="toast-btn" style="padding:0; text-decoration:underline;" onclick="ShinApp.moCaiDat()">Kết nối Token ›</button>
      `;
    }
  }

  async function chuyenModule(maMod) {
    currentModule = maMod;
    
    // Cập nhật giao diện chip module
    document.querySelectorAll('.module-chip').forEach(chip => {
      if (chip.dataset.mod === maMod) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    const targetMod = MODULES.find(m => m.ma === maMod) || MODULES[0];
    const container = document.getElementById('appContent');
    if (!container) return;

    // Hiển thị trạng thái đang tải nhẹ nhàng
    container.innerHTML = `
      <div style="text-align:center; padding:50px 20px; color:var(--text-muted);">
        <div style="font-size:28px; margin-bottom:10px;">⏳</div>
        <div>Đang nạp dữ liệu ${targetMod.ten}...</div>
      </div>
    `;

    // Gọi API (Tự động rẽ nhánh Live hoặc Demo)
    const res = await SHIN_API.goi(targetMod.ma.toUpperCase(), 'webHomNay', {});
    targetMod.render(container, res.data);
  }

  function chuyenNav(navId) {
    currentNav = navId;
    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.nav === navId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    if (navId === 'home') {
      chuyenModule('hub');
    } else if (navId === 'stats') {
      chuyenModule('kpi');
    } else if (navId === 'report') {
      chuyenModule('phongkham');
    } else if (navId === 'profile') {
      moCaiDat();
    } else {
      toast(`Chuyển sang mục: ${navId}`, 'info');
    }
  }

  function moCaiDat() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;

    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) {
      tokenInput.value = SHIN_API.layToken();
    }

    const grid = document.getElementById('paletteGrid');
    if (grid) {
      grid.innerHTML = PALETTES.map(p => `
        <div class="palette-card ${p.id === currentPalette ? 'active' : ''}" 
             data-palette="${p.id}"
             onclick="ShinApp.apDungPalette('${p.id}')">
          <div style="display:flex; align-items:center; justify-content:space-between;">
            <div style="font-weight:700; font-size:13px;">${p.ten}</div>
            <div class="swatch" style="background:${p.mauChinh};"></div>
          </div>
          <div style="font-size:11px; color:var(--text-muted);">${p.moTa}</div>
        </div>
      `).join('');
    }

    modal.classList.add('open');
  }

  function dongModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('open');
  }

  function luuCaiDatToken() {
    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) {
      const val = tokenInput.value.trim();
      SHIN_API.luuToken(val);
      capNhatBannerTrangThai();
      dongModal();
      toast(val ? 'Đã lưu Token kết nối thật thành công! 🟢' : 'Đã chuyển về chế độ Trình diễn mẫu (Demo) 🟡', 'info');
      chuyenModule(currentModule);
    }
  }

  function toast(msg, loai = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toastEl = document.createElement('div');
    toastEl.className = 'toast';
    toastEl.innerHTML = `
      <span>${msg}</span>
      <button class="toast-btn" onclick="this.parentElement.remove(); ShinApp.hoanTac();">Hoàn tác</button>
      <div class="toast-bar"></div>
    `;

    container.appendChild(toastEl);

    setTimeout(() => {
      if (toastEl.parentElement) {
        toastEl.remove();
      }
    }, 6000);
  }

  function hoanTac() {
    console.log('[Shin] Người dùng bấm hoàn tác');
  }

  return {
    init,
    doiTheme,
    apDungPalette,
    chuyenModule,
    chuyenNav,
    moCaiDat,
    dongModal,
    luuCaiDatToken,
    toast,
    hoanTac
  };
})();

// Khởi chạy khi tài liệu nạp xong
document.addEventListener('DOMContentLoaded', ShinApp.init);
