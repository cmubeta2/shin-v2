/**
 * SHIN v2 – Bộ Não Điều Phối Trung Tâm (Central Application Engine)
 * Phiên bản: v2.1.0 (Thập diện kiến trúc Decagon – 10 Mảng Nghiệp Vụ)
 * Tích hợp toàn diện các module, quản trị trạng thái, đổi phong cách giao diện và liên thông dữ liệu.
 */

const ShinApp = (function() {
  const MODULES = [
    ModuleHub,
    ModuleKPI,
    ModuleKhaoSat,
    ModuleCRM,
    ModuleTuyenSinh,
    ModulePhongKham,
    ModuleDuAn,
    ModuleCongViec,
    ModulePheDuyet,
    ModuleTriThuc,
    ModuleCaiDat
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

  // Định nghĩa Thập diện kiến trúc Decagon (Icon + Tên mảng gọn gàng 1 cột)
  const DECAGON_GROUPS = [
    {
      tenNhom: "ĐIỀU HÀNH & NỀN TẢNG",
      icon: "🏢",
      danhSach: [
        { ma: "hub", ten: "Executive Hub", icon: "🏢" },
        { ma: "kpi", ten: "BKS KPI Viện", icon: "📊" },
        { ma: "ks", ten: "Khảo Sát ACHSI", icon: "🩺" },
        { ma: "pheduyet", ten: "Phê Duyệt 1-Chạm", icon: "⚡", badge: "4" },
        { ma: "trithuc", ten: "Tri Thức & SOP", icon: "🧠" },
        { ma: "caidat", ten: "Quản Trị Module", icon: "⚙️" }
      ]
    },
    {
      tenNhom: "VẬN HÀNH NỘI BỘ",
      icon: "⚙️",
      danhSach: [
        { ma: "duan", ten: "Quản Lý Dự Án & Flash Report", icon: "📌" },
        { ma: "phongkham", ten: "Vận Hành Phòng Khám & PTKH", icon: "🏥" },
        { ma: "congviec", ten: "Quản Lý Công Việc", icon: "📋" }
      ]
    },
    {
      tenNhom: "TĂNG TRƯỞNG & ĐỐI TÁC",
      icon: "🚀",
      danhSach: [
        { ma: "crm", ten: "Khách Hàng & Đối Tác", icon: "👥" },
        { ma: "ts", ten: "Giáo Dục & Tuyển Sinh", icon: "🎓" }
      ]
    }
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

    // Dựng Drawer Decagon 10 mảng (gọn 1 cột, Icon + Tên)
    veDecagonDrawer();

    // Dựng thanh điều hướng đáy màn hình (Bottom Nav)
    veMenuDay();

    // Cập nhật thẻ trạng thái kết nối trên Header
    capNhatBannerTrangThai();

    // Tải và hiển thị module mặc định
    chuyenModule(currentModule);

    // Lắng nghe sự kiện bàn phím Esc đóng modal và drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dongModal();
        dongDecagonDrawer();
      }
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

  function veMenuDay() {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;

    const navItems = [
      { id: 'home', icon: '🏠', label: 'Hôm nay', badge: '' },
      { id: 'pheduyet', icon: '⚡', label: 'Phê duyệt', badge: '4' },
      { id: 'duan', icon: '📌', label: 'Dự án', badge: '' },
      { id: 'crm', icon: '👥', label: 'Đối tác', badge: '' },
      { id: 'decagon', icon: '☰', label: '10 Mảng', badge: '' }
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

  function veThanhModule() {
    // Đã có nút Menu trên Header, hàng nút module cuộn ngang đã được lược bỏ theo yêu cầu của Sếp
  }

  function veDecagonDrawer() {
    const body = document.getElementById('decagonBody');
    if (!body) return;

    body.innerHTML = DECAGON_GROUPS.map(g => `
      <div>
        <div class="decagon-group-title">
          <span>${g.icon}</span>
          <span>${g.tenNhom}</span>
        </div>
        <div class="decagon-grid">
          ${g.danhSach.map(item => `
            <div class="decagon-card ${item.ma === currentModule ? 'active' : ''}" 
                 onclick="ShinApp.chuyenModule('${item.ma}'); ShinApp.dongDecagonDrawer();">
              <span class="decagon-icon">${item.icon}</span>
              <div class="decagon-name">${item.ten}</div>
              ${item.badge ? `<span class="badge-count">${item.badge}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  function capNhatBannerTrangThai() {
    const pill = document.getElementById('headerStatusPill');
    if (!pill) return;

    const isLive = SHIN_API.laCheDoLive();
    if (isLive) {
      pill.className = 'header-status-pill live';
      pill.innerHTML = '🟢 Live v2.1.0';
      pill.title = 'Đang kết nối dữ liệu thật Apps Script & Sheets · Bấm để đổi Token';
    } else {
      pill.className = 'header-status-pill demo';
      pill.innerHTML = '🟡 Demo v2.1.0';
      pill.title = 'Chế độ Trình diễn mẫu · Bấm để nhập Token thật';
    }
  }

  async function chuyenModule(maMod) {
    currentModule = maMod;
    
    // Cập nhật giao diện chip module
    document.querySelectorAll('.module-chip').forEach(chip => {
      if (chip.dataset.mod === maMod) {
        chip.classList.add('active');
        chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        chip.classList.remove('active');
      }
    });

    // Cập nhật Decagon drawer cards
    document.querySelectorAll('.decagon-card').forEach(card => {
      if (card.getAttribute('onclick') && card.getAttribute('onclick').includes(`'${maMod}'`)) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    });

    // Đồng bộ trạng thái Bottom Nav
    if (maMod === 'hub') currentNav = 'home';
    else if (maMod === 'pheduyet') currentNav = 'pheduyet';
    else if (maMod === 'duan') currentNav = 'duan';
    else if (maMod === 'crm') currentNav = 'crm';
    else currentNav = '';

    document.querySelectorAll('.nav-item').forEach(item => {
      if (item.dataset.nav === currentNav) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
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
    let resData = null;
    try {
      const res = await SHIN_API.goi(targetMod.ma.toUpperCase(), 'webHomNay', {});
      if (res && res.data) resData = res.data;
    } catch (e) {
      console.warn('[Shin] Lỗi gọi API, dùng fallback demo', e);
    }

    targetMod.render(container, resData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chuyenNav(navId) {
    if (navId === 'decagon') {
      moDecagonDrawer();
      return;
    }

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
    } else if (navId === 'pheduyet') {
      chuyenModule('pheduyet');
    } else if (navId === 'duan') {
      chuyenModule('duan');
    } else if (navId === 'crm') {
      chuyenModule('crm');
    } else {
      toast(`Chuyển sang mục: ${navId}`, 'info');
    }
  }

  function moDecagonDrawer() {
    const drawer = document.getElementById('decagonDrawer');
    const overlay = document.getElementById('decagonOverlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
  }

  function dongDecagonDrawer() {
    const drawer = document.getElementById('decagonDrawer');
    const overlay = document.getElementById('decagonOverlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
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
    moDecagonDrawer,
    dongDecagonDrawer,
    moCaiDat,
    dongModal,
    luuCaiDatToken,
    toast,
    hoanTac
  };
})();

// Khởi chạy khi tài liệu nạp xong
document.addEventListener('DOMContentLoaded', ShinApp.init);
