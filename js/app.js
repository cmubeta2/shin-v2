/**
 * SHIN v2 – Bộ Não Điều Phối Trung Tâm (Central Application Engine)
 * Phiên bản: v2.5.4 – chạy trên 5 máy chủ v1 (Hub · KPI · TS · KS · PK); mảng nào v1 chưa mở cổng thì hiện mẫu kèm dải vàng.
 * Hàm dùng chung theo PHONG_CACH_APP_SHIN mục 5: esc, soVN, toast (+ Hoàn tác 6s), xacNhan2Lan, goiNut, rung.
 */

const ShinApp = (function() {
  const PHIEN_BAN = 'v2.5.4';

  const MODULES = [
    ModuleHub,
    ModuleDieuHanh,
    ModuleKPI,
    ModuleKhaoSat,
    ModuleCRM,
    ModuleTuyenSinh,
    ModulePhongKham,
    ModuleDuAn,
    ModuleCongViec,
    ModulePheDuyet,
    ModuleTriThuc,
    ModuleTaiChinh,
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
        { ma: "dieuhanh", ten: "Điều Hành Hệ Shin", icon: "🧭" },
        { ma: "kpi", ten: "BKS KPI Viện", icon: "📊" },
        { ma: "khaosat", ten: "Khảo Sát ACHSI", icon: "🩺" },
        { ma: "pheduyet", ten: "Phê Duyệt 1-Chạm", icon: "⚡" },
        { ma: "trithuc", ten: "Tri Thức & SOP", icon: "🧠" },
        { ma: "caidat", ten: "Quản Trị Module", icon: "🧩" }
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
        { ma: "taichinh", ten: "Tài Chính & Thu Chi", icon: "💰" },
        { ma: "tuyensinh", ten: "Giáo Dục & Tuyển Sinh", icon: "🎓" }
      ]
    }
  ];

  // Mảng không được tắt (M0.1): bàn làm việc chính và chính màn Quản trị
  const MANG_LUON_BAT = ['hub', 'caidat'];

  // Mã liên kết nhanh của Hub (webKhoiDong.lienKet.app[].ma) ➜ khóa máy chủ v2
  const MA_LIEN_KET = { HUB: 'HUB', KPI: 'KPI', TS: 'TS', KS: 'KS', PK: 'PK', PTKH: 'PK' };

  let currentModule = 'hub';
  let currentNav = 'home';
  let currentPalette = docLS('shin_palette') || 'executive';
  let currentThemeMode = docLS('shin_theme_mode') || 'system';
  let currentTheme = docLS('shin_theme') || 'light';
  let currentCochu = docLS('shin_cochu') || 'vua';

  // Trạng thái chế độ Live: người dùng (Hub), liên kết sang app v1, quyền từng máy chủ
  const live = { nguoi: null, laAdminHub: false, lienKet: {}, linkHub: '', quyen: {}, soChuaDoc: 0, soChoDuyet: null, hubSanSang: null };
  let luotTai = 0;

  /* ---------------- Hàm dùng chung (PHONG_CACH_APP_SHIN mục 5) ---------------- */

  function docLS(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function luuLS(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /** Chữ từ máy chủ / sheet ➜ an toàn khi chèn vào HTML (cấm innerHTML dữ liệu thô). */
  function esc(v) {
    return String(v === undefined || v === null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /** Số kiểu VN: "." tách nghìn, "," thập phân. null / không phải số ➜ "–". */
  function soVN(n, soLe) {
    if (n === null || n === undefined || n === '' || !isFinite(Number(n))) return '–';
    const x = Number(n), p = Math.pow(10, soLe || 0), lam = Math.round(Math.abs(x) * p) / p;
    const nguyen = Math.floor(lam), le = Math.round((lam - nguyen) * p);
    let s = String(nguyen).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    if (le) s += ',' + String(le).padStart(String(p).length - 1, '0').replace(/0+$/, '');
    return (x < 0 ? '−' : '') + s;
  }

  /** Phân số (1 = 100%) ➜ "94,2%". */
  function ptVN(v, soLe) {
    return v === null || v === undefined || !isFinite(Number(v)) ? '–' : soVN(Number(v) * 100, soLe === undefined ? 1 : soLe) + '%';
  }

  /** Chữ số kiểu VN ("1.500.000" · "12,5") ➜ số; trống / sai ➜ null. */
  function docSoVN(v) {
    if (typeof v === 'number') return isFinite(v) ? v : null;
    const t = String(v === undefined || v === null ? '' : v).trim().replace(/\s|đ/g, '').replace(/\./g, '').replace(',', '.');
    return t === '' || !isFinite(Number(t)) ? null : Number(t);
  }

  /** Ô ngày dd/mm/yyyy: tự thêm "/" khi gõ số. */
  function goNgay(o) {
    const so = o.value.replace(/\D/g, '').slice(0, 8);
    o.value = so.length > 4 ? `${so.slice(0, 2)}/${so.slice(2, 4)}/${so.slice(4)}` : so.length > 2 ? `${so.slice(0, 2)}/${so.slice(2)}` : so;
  }

  /** 'dd/mm/yyyy' hợp lệ (có ngày thật) ➜ true. */
  function laNgayVN(s) {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(String(s || '').trim());
    if (!m) return false;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    return d.getDate() === +m[1] && d.getMonth() === +m[2] - 1;
  }

  /** "T4, 07/10/2026" */
  function ngayVN(d) {
    d = d || new Date();
    const thu = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
    const p = x => (x < 10 ? '0' : '') + x;
    return `${thu}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  /** "Chào buổi sáng, Tâm 👋" – lời chào theo giờ + tên gọi (chữ cuối họ tên). */
  function loiChao(hoTen) {
    const g = new Date().getHours();
    const buoi = g < 11 ? 'buổi sáng' : g < 14 ? 'buổi trưa' : g < 18 ? 'buổi chiều' : 'buổi tối';
    const tenGoi = String(hoTen || '').trim().split(/\s+/).pop();
    return `Chào ${buoi}${tenGoi ? ', ' + tenGoi : ''} 👋`;
  }

  /** Rung phản hồi: 'nhe' 5ms · 'xong' [10,30,10] · 'canh' 40ms. */
  function rung(kieu) {
    try {
      if (!navigator.vibrate) return;
      navigator.vibrate(kieu === 'xong' ? [10, 30, 10] : kieu === 'canh' ? 40 : 5);
    } catch (e) {}
  }

  /**
   * Toast: loai 'success' | 'info' | 'warn' | 'error'. Thời gian 3,5s / cảnh báo 4,5s / lỗi 6s.
   * opts.nhan + opts.bam ➜ có nút (vd "Hoàn tác"), giữ ≥ 6s. Trả về hàm đóng toast.
   */
  function toast(msg, loai = 'success', opts = {}) {
    const container = document.getElementById('toastContainer');
    if (!container) return () => {};

    const coNut = !!(opts.nhan && opts.bam);
    const thoiGian = opts.thoiGian || (coNut ? 6000 : loai === 'error' ? 6000 : loai === 'warn' ? 4500 : 3500);
    const toastEl = document.createElement('div');
    toastEl.className = `toast toast-${loai}`;
    toastEl.innerHTML = `
      <span>${esc(msg)}</span>
      ${coNut ? `<button class="toast-btn">${esc(opts.nhan)}</button>` : ''}
      <div class="toast-bar" style="animation-duration:${thoiGian}ms"></div>
    `;
    let daDong = false, hen = null;
    // ketThuc: 'het' (hết giờ hoặc bấm vào thân toast ➜ chạy khiHet) | 'nut' (bấm nút ➜ chỉ chạy bam, KHÔNG chạy khiHet)
    const dong = (ketThuc) => {
      if (daDong) return;
      daDong = true;
      clearTimeout(hen);
      toastEl.remove();
      if (ketThuc === 'het' && opts.khiHet) opts.khiHet();
      if (ketThuc === 'nut') opts.bam();
    };
    toastEl.addEventListener('click', (e) => {
      dong(coNut && e.target.classList.contains('toast-btn') ? 'nut' : 'het');
    });
    container.appendChild(toastEl);
    hen = setTimeout(() => dong('het'), thoiGian);
    return () => dong('');
  }

  /**
   * Không hỏi – cho Hoàn tác: đổi giao diện ngay (lamTruoc), chỉ gửi máy chủ (thucHien) khi hết 6 giây.
   * Bấm Hoàn tác trong 6 giây ➜ traLai() và KHÔNG gửi gì.
   */
  function hanhDongHoanTac(msg, { lamTruoc, traLai, thucHien }) {
    if (lamTruoc) lamTruoc();
    rung('nhe');
    toast(msg, 'success', {
      nhan: 'Hoàn tác',
      bam: () => { if (traLai) traLai(); },
      khiHet: async () => {
        try { await thucHien(); rung('xong'); }
        catch (e) { if (traLai) traLai(); toast(e.message || 'Gửi không được – đã trả lại như cũ.', 'error'); }
      }
    });
  }

  /** Việc khó hoàn tác: lần 1 nhắc (toast vàng), bấm lại trong 5 giây mới làm. */
  const choXacNhan = {};
  function xacNhan2Lan(khoa, msg, viec) {
    const bay = Date.now();
    if (choXacNhan[khoa] && bay - choXacNhan[khoa] < 5000) {
      delete choXacNhan[khoa];
      rung('canh');
      viec();
      return;
    }
    choXacNhan[khoa] = bay;
    toast(msg + ' – bấm lại lần nữa trong 5 giây để làm.', 'warn', { thoiGian: 5000 });
  }

  /**
   * Gọi máy chủ gắn với 1 nút: khóa nút + đổi chữ "Đang lưu…", chặn bấm trùng cùng lệnh trong lúc chờ.
   * Lỗi ➜ toast đỏ dễ hiểu. Trả về kết quả của ham() hoặc null nếu lỗi / đang chạy.
   */
  const dangGui = {};
  async function goiNut(nut, chuCho, ham, khoa) {
    khoa = khoa || chuCho;
    if (dangGui[khoa]) return null;
    dangGui[khoa] = true;
    const chuCu = nut ? nut.innerHTML : '';
    if (nut) { nut.disabled = true; nut.innerHTML = '⏳ ' + esc(chuCho); }
    const thanh = document.getElementById('thanhCho');
    if (thanh) thanh.classList.add('chay');
    const bao20 = setTimeout(() => toast('Mạng đang yếu – kiểm tra 4G/Wi-Fi nếu chờ lâu.', 'warn'), 20000);
    try {
      return await ham();
    } catch (e) {
      toast(e.message || 'Có lỗi – anh/chị bấm lại giúp em.', 'error');
      return null;
    } finally {
      clearTimeout(bao20);
      delete dangGui[khoa];
      if (thanh) thanh.classList.remove('chay');
      if (nut && nut.isConnected) { nut.disabled = false; nut.innerHTML = chuCu; }
    }
  }

  /** Gọi máy chủ và ném lỗi tiếng Việt nếu không được – dùng trong goiNut / hanhDongHoanTac. */
  async function goiBat(appKey, hanh, ...thamSo) {
    const kq = appKey === 'HUB' ? await SHIN_API.goi(appKey, hanh, thamSo[0] || {}) : await SHIN_API.goiCong(appKey, hanh, ...thamSo);
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    return kq.data;
  }

  /* ---------------- Máy màn nhỏ (v2.5.2 – Sếp 30/10) ----------------
   * ≤ 360px: thanh trái thu thành tay nắm (dải 4px + mấu »); vuốt từ mép trái hoặc chạm » để mở, vuốt sang trái để đóng.
   * Lần đầu: mấu nhấp nháy 2 lần + gợi ý (1 lần / máy). Đang gõ form: ẩn thanh đáy để có chỗ nhìn ô nhập. */
  const MQ_NHO = window.matchMedia ? window.matchMedia('(max-width: 360px)') : { matches: false };
  const MQ_DIEN_THOAI = window.matchMedia ? window.matchMedia('(max-width: 767px)') : { matches: false };

  /** Kiểu thanh trái trên điện thoại: 'tu_dong' (≤ 360px ➜ mép) | 'icon' | 'mep'. Máy tính bảng / desktop luôn dùng hàng icon. */
  function kieuRail() { return docLS('shin_kieu_rail') || 'tu_dong'; }

  function apDungKieuRail() {
    const k = kieuRail();
    const mep = MQ_DIEN_THOAI.matches && (k === 'mep' || (k === 'tu_dong' && MQ_NHO.matches));
    document.body.classList.toggle('kieu-mep', mep);
    const tay = document.getElementById('railTay');
    const viTri = Number(docLS('shin_tay_top'));
    if (tay) tay.style.setProperty('--tay-top', viTri >= 10 && viTri <= 90 ? viTri + '%' : '66%');
    document.querySelectorAll('[data-kieu]').forEach(b => b.classList.toggle('active', b.dataset.kieu === k));
    return mep;
  }

  function chonKieuRail(k) {
    luuLS('shin_kieu_rail', k);
    const mep = apDungKieuRail();
    rung('nhe');
    if (mep) goiYTayNam(true);
  }

  /** Mấu »: chạm = mở; giữ + kéo dọc = đổi chỗ (nhớ % chiều cao trên máy). */
  function ganKeoTay() {
    const tay = document.getElementById('railTay');
    if (!tay) return;
    let y0 = null, top0 = 0, daKeo = false;
    tay.addEventListener('pointerdown', (e) => {
      y0 = e.clientY; top0 = tay.getBoundingClientRect().top + tay.offsetHeight / 2; daKeo = false;
      try { tay.setPointerCapture(e.pointerId); } catch (er) {}
    });
    tay.addEventListener('pointermove', (e) => {
      if (y0 === null) return;
      const dy = e.clientY - y0;
      if (!daKeo && Math.abs(dy) < 8) return;
      if (!daKeo) { daKeo = true; tay.classList.add('dang-keo'); rung('nhe'); }
      const h = window.innerHeight, tren = 90, duoi = h - 110;
      const y = Math.max(tren, Math.min(duoi, top0 + dy));
      tay.style.setProperty('--tay-top', (y / h * 100).toFixed(1) + '%');
    });
    const tha = () => {
      if (y0 === null) return;
      y0 = null;
      if (daKeo) {
        tay.classList.remove('dang-keo');
        luuLS('shin_tay_top', String(parseFloat(tay.style.getPropertyValue('--tay-top'))));
        rung('xong');
      }
    };
    tay.addEventListener('pointerup', tha);
    tay.addEventListener('pointercancel', tha);
    tay.addEventListener('click', (e) => {
      if (daKeo) { e.preventDefault(); e.stopImmediatePropagation(); daKeo = false; return; }
      moDecagonDrawer();
    });
  }

  function ganCuChiMayNho() {
    let x0 = null, y0 = null, keo = '';
    document.addEventListener('touchstart', (e) => {
      if (MQ_DESKTOP.matches || e.touches.length !== 1) return;
      const t = e.touches[0], mo = document.body.classList.contains('rail-mo');
      keo = !mo && t.clientX <= 24 ? 'mo' : mo ? 'dong' : '';
      x0 = t.clientX; y0 = t.clientY;
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
      if (!keo || x0 === null) return;
      const t = e.touches[0], dx = t.clientX - x0, dy = Math.abs(t.clientY - y0);
      if (dy > 40) { keo = ''; return; }
      if (keo === 'mo' && dx > 40) { keo = ''; rung('nhe'); apDungRail(true); }
      else if (keo === 'dong' && dx < -50) { keo = ''; apDungRail(false); }
    }, { passive: true });
    document.addEventListener('touchend', () => { keo = ''; x0 = null; }, { passive: true });

    // Gõ form trên điện thoại: ẩn thanh đáy (bàn phím đã chiếm chỗ)
    document.addEventListener('focusin', (e) => {
      if (!MQ_DESKTOP.matches && e.target && e.target.matches && e.target.matches('input:not([type=checkbox]):not([type=radio]), textarea, select')) document.body.classList.add('dang-go');
    });
    document.addEventListener('focusout', () => {
      setTimeout(() => {
        const a = document.activeElement;
        if (!(a && a.matches && a.matches('input, textarea, select'))) document.body.classList.remove('dang-go');
      }, 120);
    });

    apDungKieuRail();
    ganKeoTay();
    goiYTayNam();
    [MQ_NHO, MQ_DIEN_THOAI].forEach(mq => { if (mq.addEventListener) mq.addEventListener('change', () => { apDungKieuRail(); goiYTayNam(); }); });
  }

  function goiYTayNam(batBuoc) {
    if (!document.body.classList.contains('kieu-mep') || (!batBuoc && docLS('shin_goi_y_rail') === '1')) return;
    luuLS('shin_goi_y_rail', '1');
    const tay = document.getElementById('railTay');
    if (tay) { tay.classList.add('nhay'); setTimeout(() => tay.classList.remove('nhay'), 2600); }
    if (!batBuoc) setTimeout(() => toast('Chạm » hoặc vuốt từ mép trái để mở danh mục. Giữ và kéo » để đổi chỗ.', 'info', { thoiGian: 6000 }), 800);
  }

  /* ---------------- PWA – cài như ứng dụng ở mọi nền tảng (Sếp 30/10) ----------------
   * Chrome / Edge / Samsung / Opera (Android, Windows, macOS, Linux, ChromeOS): bắt beforeinstallprompt ➜ nút 📲 bấm là cài.
   * iPhone / iPad (Safari): không có hộp cài tự động ➜ hướng dẫn Chia sẻ ⬆ ➜ "Thêm vào MH chính".
   * Safari macOS: Tệp ➜ "Thêm vào Dock". Firefox máy tính chưa hỗ trợ cài ➜ gợi ý mở bằng Chrome / Edge.
   * Đã chạy dạng app (standalone) ➜ ẩn nút cài. */
  let loiMoiCai = null;

  function dangChayApp() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone), (display-mode: minimal-ui)').matches) || window.navigator.standalone === true;
  }

  /** THUẦN-ish. Nền tảng ➜ câu hướng dẫn cài tay khi trình duyệt không có hộp cài. */
  function huongDanCaiTay() {
    const ua = navigator.userAgent || '';
    const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    if (ios) return /CriOS|FxiOS|EdgiOS/.test(ua)
      ? 'Trên iPhone/iPad: bấm nút Chia sẻ ⬆ (trên thanh địa chỉ) ➜ "Thêm vào MH chính" ➜ Thêm.'
      : 'Trên iPhone/iPad (Safari): bấm nút Chia sẻ ⬆ ở thanh dưới ➜ kéo xuống chọn "Thêm vào MH chính" ➜ Thêm.';
    if (/Macintosh/.test(ua) && /Safari/.test(ua) && !/Chrome|Chromium|Edg/.test(ua)) return 'Trên Mac (Safari): menu Tệp ➜ "Thêm vào Dock…".';
    if (/Firefox/.test(ua) && !/Android/.test(ua)) return 'Firefox trên máy tính chưa cài được ứng dụng web – anh/chị mở link này bằng Chrome hoặc Edge rồi bấm 📲.';
    if (/Android/.test(ua)) return 'Trên Android: bấm ⋮ (góc trên) ➜ "Cài đặt ứng dụng" / "Thêm vào màn hình chính".';
    return 'Bấm biểu tượng cài (⊕ hoặc 🖥) ở cuối thanh địa chỉ, hoặc menu ⋮ ➜ "Cài đặt SHIN".';
  }

  function capNhatNutCai() {
    const daCai = dangChayApp();
    const nut = document.getElementById('nutCaiApp');
    if (nut) nut.hidden = daCai;
    const khoi = document.getElementById('khoiCaiApp');
    if (khoi) khoi.hidden = daCai;
    const hd = document.getElementById('huongDanCai');
    if (hd && !daCai) hd.textContent = loiMoiCai ? 'Bấm nút dưới để cài SHIN lên máy – mở nhanh như app, toàn màn hình, không thanh địa chỉ.' : huongDanCaiTay();
    const nut2 = document.getElementById('nutCaiApp2');
    if (nut2) nut2.textContent = loiMoiCai ? '📲 Cài ứng dụng' : '📲 Xem cách cài';
  }

  async function caiUngDung() {
    rung('nhe');
    if (dangChayApp()) { toast('SHIN đang chạy dạng ứng dụng rồi 👍', 'info'); return; }
    if (loiMoiCai) {
      const moi = loiMoiCai;
      loiMoiCai = null;
      moi.prompt();
      try {
        const kq = await moi.userChoice;
      } catch (e) {}
      capNhatNutCai();
      return;
    }
    toast(huongDanCaiTay(), 'info', { thoiGian: 9000 });
  }

  function khoiDongPWA() {
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(e => console.warn('[Shin PWA] Không đăng ký được service worker:', e.message));
    }
    window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); loiMoiCai = e; capNhatNutCai(); });
    window.addEventListener('appinstalled', () => { loiMoiCai = null; capNhatNutCai(); });
    capNhatNutCai();
  }

  /* ---------------- Khởi động ---------------- */

  function init() {
    // Lối tắt của app cài (manifest shortcuts): ?m=<mã mảng>
    try {
      const u = new URL(location.href), m = u.searchParams.get('m');
      if (m && MODULES.some(x => x.ma === m)) currentModule = m;
      if (m || u.searchParams.get('nguon')) { u.searchParams.delete('m'); u.searchParams.delete('nguon'); history.replaceState({}, document.title, u.toString()); }
    } catch (e) {}
    khoiDongPWA();
    apDungThemeMode(currentThemeMode);
    apDungPalette(currentPalette);
    apDungCochu(currentCochu);

    veDecagonDrawer();
    apDungRail(railMacDinh());
    ganCuChiMayNho();
    if (MQ_DESKTOP.addEventListener) MQ_DESKTOP.addEventListener('change', () => apDungRail(railMacDinh()));
    veMenuDay();
    capNhatBannerTrangThai();
    if (SHIN_API.laCheDoLive()) khoiDongLive();
    chuyenModule(currentModule);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dongModal();
        dongDecagonDrawer();
      }
    });

    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentThemeMode === 'system') apDungThemeMode('system');
      });
    }
  }

  /**
   * Live: hỏi Hub webKhoiDong (tên, vai trò, link sang app v1, số tin chưa đọc), rồi hỏi webKhoiDong
   * của 4 app còn lại song song ➜ mảng nào trả 'quyen' thì ẩn khỏi menu (giữ nguyên quyền từng app v1).
   */
  function khoiDongLive() {
    live.hubSanSang = nhanDienHub();
    live.hubSanSang.then(hoiQuyenCacApp);
    return live.hubSanSang;
  }

  async function nhanDienHub() {
    const kqHub = await SHIN_API.goi('HUB', 'webKhoiDong', {});
    if (kqHub.ok) {
      const d = kqHub.data || {};
      live.nguoi = d.nguoi || null;
      live.laAdminHub = !!d.laAdmin;
      live.soChuaDoc = Number(d.soChuaDoc) || 0;
      live.linkHub = d.linkExec ? d.linkExec + '?t=' + encodeURIComponent(SHIN_API.layToken()) : '';
      ((d.lienKet && d.lienKet.app) || []).forEach(a => {
        const khoa = MA_LIEN_KET[String(a.ma || '').toUpperCase()];
        if (khoa && a.link) live.lienKet[khoa] = a.link;
      });
      live.quyen.HUB = 'co';
      capNhatNguoiDung();
    } else {
      live.quyen.HUB = kqHub.loi === 'quyen' ? 'khong' : 'loi';
      if (kqHub.loi === 'quyen') toast('Token không vào được Hub – kiểm tra lại link đăng nhập.', 'error');
    }
    veMenuDay();
  }

  async function hoiQuyenCacApp() {
    // Số yêu cầu chờ duyệt cho huy hiệu ⚡ (cổng 0B của Hub – chưa mở thì im lặng, không hiện số)
    SHIN_API.goi('HUB', 'webPheDuyet', {}).then(kq => {
      if (kq.ok && kq.data) { live.soChoDuyet = (kq.data.choDuyet || []).length; veMenuDay(); veDecagonDrawer(); }
    });
    const cac = ['KPI', 'TS', 'KS', 'PK'];
    const ketQua = await Promise.all(cac.map(k => SHIN_API.goiCong(k, 'webKhoiDong')));
    ketQua.forEach((kq, i) => {
      live.quyen[cac[i]] = kq.ok ? 'co' : kq.loi === 'quyen' ? 'khong' : 'loi';
    });
    veDecagonDrawer();
    veMenuDay();
  }

  function capNhatNguoiDung() {
    const sub = document.querySelector('.topbar-sub');
    if (sub && live.nguoi) sub.textContent = `${live.nguoi.hoTen || ''} · ${live.nguoi.vaiTro || ''}`;
  }

  /** Link mở app v1 (đã gắn token) cho 1 máy chủ – dùng cho việc v2 chưa làm màn riêng. */
  function linkV1(khoa) {
    return khoa === 'HUB' ? live.linkHub : (live.lienKet[khoa] || '');
  }

  function moV1(khoa, tenViec) {
    const link = linkV1(khoa);
    if (!link) {
      toast(SHIN_API.laCheDoLive() ? 'Chưa lấy được link app v1 – mở Hub v1 để vào.' : `Chế độ trình diễn: ${tenViec || 'mục này'} mở trên app v1 khi có token.`, 'info');
      return;
    }
    window.open(link, '_blank', 'noopener');
  }

  /* ---------------- Giao diện: theme, bộ màu, cỡ chữ ---------------- */

  function chonThemeMode(mode) {
    currentThemeMode = mode;
    luuLS('shin_theme_mode', mode);
    apDungThemeMode(mode);
    document.querySelectorAll('.theme-mode-btn[data-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  }

  function apDungThemeMode(mode) {
    let resolvedTheme = 'light';
    if (mode === 'dark') {
      resolvedTheme = 'dark';
    } else if (mode === 'system') {
      resolvedTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (mode === 'auto') {
      // Theo giờ: 06:00 đến 18:00 là Sáng, còn lại là Tối
      const gio = new Date().getHours();
      resolvedTheme = (gio >= 6 && gio < 18) ? 'light' : 'dark';
    }
    currentTheme = resolvedTheme;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    luuLS('shin_theme', resolvedTheme);
  }

  function doiTheme() {
    chonThemeMode(currentTheme === 'dark' ? 'light' : 'dark');
  }

  function apDungPalette(paletteId) {
    currentPalette = paletteId;
    document.documentElement.setAttribute('data-palette', paletteId);
    luuLS('shin_palette', paletteId);
    document.querySelectorAll('.palette-card').forEach(card => card.classList.toggle('active', card.dataset.palette === paletteId));
  }

  function apDungCochu(cochu) {
    currentCochu = cochu;
    document.documentElement.setAttribute('data-cochu', cochu);
    luuLS('shin_cochu', cochu);
  }

  /* ---------------- M0.1 – Bật / tắt mảng (lưu trên máy này) ---------------- */

  function dsMangTat() {
    try { return JSON.parse(docLS('shin_mang_tat') || '[]'); } catch (e) { return []; }
  }

  function datMangBat(ma, bat) {
    if (MANG_LUON_BAT.indexOf(ma) >= 0) return false;
    const ds = dsMangTat().filter(x => x !== ma);
    if (!bat) ds.push(ma);
    luuLS('shin_mang_tat', JSON.stringify(ds));
    veDecagonDrawer();
    veMenuDay();
    return true;
  }

  function mangDangBat(ma) {
    return dsMangTat().indexOf(ma) < 0;
  }

  /** Mảng hiện trong menu: đang bật + (Live) không bị máy chủ v1 từ chối quyền. 🧭 Điều hành chỉ Admin Hub. */
  function mangDuocHien(ma) {
    if (!mangDangBat(ma)) return false;
    if (ma === 'dieuhanh' && SHIN_API.laCheDoLive() && live.quyen.HUB === 'co' && !live.laAdminHub) return false;
    const mod = MODULES.find(m => m.ma === ma);
    const khoa = mod && mod.mayChu;
    return !(khoa && live.quyen[khoa] === 'khong');
  }

  /* ---------------- Menu đáy & Decagon drawer ---------------- */

  function veMenuDay() {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    const laLive = SHIN_API.laCheDoLive();

    const navItems = [
      { id: 'home', icon: '🏠', label: 'Hôm nay', badge: laLive && live.soChuaDoc ? String(live.soChuaDoc) : '' },
      // Phê duyệt 1-chạm: Live lấy số từ cổng Hub webPheDuyet (chưa mở ➜ không hiện số); Demo hiện số mẫu
      { id: 'pheduyet', icon: '⚡', label: 'Phê duyệt', badge: laLive ? (live.soChoDuyet ? String(live.soChoDuyet) : '') : '4' },
      { id: 'duan', icon: '📌', label: 'Dự án', badge: '' },
      { id: 'crm', icon: '👥', label: 'Đối tác', badge: '' },
      // Ô thứ 5 (Sếp 30/10: Cài đặt đã chuyển xuống thanh trái): Admin ➜ 🧭 Điều hành; người khác ➜ 📊 KPI
      mangDuocHien('dieuhanh') ? { id: 'dieuhanh', icon: '🧭', label: 'Điều hành', badge: '' } : { id: 'kpi', icon: '📊', label: 'KPI', badge: '' }
    ];

    nav.innerHTML = navItems.map(item => `
      <button class="nav-item ${item.id === currentNav ? 'active' : ''}"
              onclick="ShinApp.chuyenNav('${item.id}')"
              data-nav="${item.id}">
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-nhan">${item.label}</span>
        ${item.badge ? `<span class="nav-badge">${esc(item.badge)}</span>` : ''}
      </button>
    `).join('');

    const badgeDinh = document.getElementById('countPendingApproval');
    if (badgeDinh) badgeDinh.style.display = laLive ? 'none' : '';
  }

  function veDecagonDrawer() {
    const body = document.getElementById('decagonBody');
    if (!body) return;
    const laLive = SHIN_API.laCheDoLive();
    // Chấm đỏ trên tay nắm (máy nhỏ): bên trong có việc chờ (phiếu ⚡)
    const cham = document.getElementById('railTayCham');
    if (cham) cham.hidden = !(laLive ? live.soChoDuyet : 4);

    body.innerHTML = DECAGON_GROUPS.map(g => {
      const ds = g.danhSach.filter(item => mangDuocHien(item.ma));
      if (!ds.length) return '';
      return `
        <div>
          <div class="decagon-group-title">
            <span>${g.icon}</span>
            <span>${g.tenNhom}</span>
          </div>
          <div class="decagon-grid">
            ${ds.map(item => `
              <div class="decagon-card ${item.ma === currentModule ? 'active' : ''}" data-mod="${item.ma}"
                   title="${item.ten}" role="button" tabindex="0" aria-label="${item.ten}"
                   onkeydown="if(event.key==='Enter') this.click()"
                   onclick="ShinApp.chuyenModule('${item.ma}'); ShinApp.dongDecagonDrawer();">
                <span class="decagon-icon">${item.icon}</span>
                <div class="decagon-name">${item.ten}</div>
                ${item.ma === 'pheduyet' && (laLive ? live.soChoDuyet : 4) ? `<span class="badge-count">${laLive ? esc(live.soChoDuyet) : 4}</span>` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  function capNhatBannerTrangThai() {
    const pill = document.getElementById('headerStatusPill');
    if (!pill) return;

    if (SHIN_API.laCheDoLive()) {
      pill.className = 'header-status-pill live';
      pill.innerHTML = `🟢 Live ${PHIEN_BAN}`;
      pill.title = 'Đang dùng dữ liệu thật của các máy chủ v1 · Bấm để đổi Token';
    } else {
      pill.className = 'header-status-pill demo';
      pill.innerHTML = `🟡 Demo ${PHIEN_BAN}`;
      pill.title = 'Chế độ Trình diễn mẫu · Bấm để nhập Token thật';
    }
  }

  /* ---------------- Điều hướng & nạp module ---------------- */

  /** Khung cảnh báo nguồn dữ liệu đặt đầu màn (Live mà đang hiện dữ liệu mẫu, hoặc lỗi mạng). */
  function khungNguon(loai, chu, khoaV1) {
    return `<div class="canh-bao-nguon ${loai}">
      <span>${esc(chu)}</span>
      ${khoaV1 && linkV1(khoaV1) ? `<button class="nut-chu" onclick="ShinApp.moV1('${khoaV1}')">Mở app v1 ›</button>` : ''}
    </div>`;
  }

  function veKhongCoQuyen(container, mod) {
    container.innerHTML = `
      <div class="man-khong-vao">
        <div class="man-khong-vao-tieu">Chưa vào được ${esc(mod.ten)}</div>
        <p>Tài khoản của anh/chị chưa được cấp quyền vào app ${esc(SHIN_API.TEN_MAY_CHU[mod.mayChu] || mod.ten)} trên hệ v1.</p>
        <p>Liên hệ người quản trị app (Admin của ${esc(SHIN_API.TEN_MAY_CHU[mod.mayChu] || 'app')}) để được thêm vào danh sách người dùng.</p>
        <p class="nho">Không chia sẻ link đăng nhập của mình cho người khác.</p>
        <button class="btn-primary" onclick="ShinApp.chuyenModule('hub')">🏠 Về trang Hôm nay</button>
      </div>`;
  }

  async function chuyenModule(maMod) {
    currentModule = maMod;
    const luot = ++luotTai;

    document.querySelectorAll('.decagon-card').forEach(card => card.classList.toggle('active', card.dataset.mod === maMod));

    if (maMod === 'hub') currentNav = 'home';
    else if (['pheduyet', 'duan', 'crm', 'dieuhanh', 'kpi'].indexOf(maMod) >= 0) currentNav = maMod;
    else currentNav = '';
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.nav === currentNav));

    const targetMod = MODULES.find(m => m.ma === maMod) || MODULES[0];
    const container = document.getElementById('appContent');
    if (!container) return;

    container.innerHTML = `
      <div class="man-tai">
        <div class="vong-tai"></div>
        <div>Đang tải dữ liệu ${esc(targetMod.ten)}...</div>
      </div>
    `;

    let data = null, banner = '';
    if (SHIN_API.laCheDoLive()) {
      // Chờ Hub nhận diện người dùng (tên cho lời chào, link app v1) – lỗi thì vẫn vẽ tiếp
      if (live.hubSanSang) { try { await live.hubSanSang; } catch (e) {} }
      if (luot !== luotTai) return;
      if (targetMod.taiLive) {
        let kq;
        try { kq = await targetMod.taiLive(); } catch (e) { kq = { ok: false, loi: 'loi', chiTiet: e.message }; }
        if (luot !== luotTai) return;   // người dùng đã chuyển màn khác trong lúc chờ
        if (kq.ok) {
          data = kq.data;
          if (kq.ghiChu) banner = khungNguon('mau', kq.ghiChu, targetMod.mayChu);
        } else if (kq.loi === 'hanh') {
          banner = khungNguon('mau', `Máy chủ ${SHIN_API.TEN_MAY_CHU[targetMod.mayChu] || 'v1'} chưa mở cổng cho mảng này (đang chờ dựng ở hệ v1) – số liệu bên dưới là MẪU.`, targetMod.mayChu);
        } else if (kq.loi === 'quyen') {
          if (targetMod.mayChu) live.quyen[targetMod.mayChu] = 'khong';
          veKhongCoQuyen(container, targetMod);
          return;
        } else {
          banner = khungNguon('loi', `${SHIN_API.moTaLoi(kq)} Đang hiện dữ liệu MẪU, không phải số thật.`, targetMod.mayChu);
        }
      } else {
        banner = khungNguon('mau', 'Mảng này chưa có máy chủ trên hệ v1 – số liệu bên dưới là MẪU để duyệt giao diện.');
      }
    }

    targetMod.render(container, data);
    if (banner) container.insertAdjacentHTML('afterbegin', banner);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function chuyenNav(navId) {
    rung('nhe');
    if (navId === 'caidat') {
      moCaiDat();
      return;
    }
    if (navId === 'decagon') {
      moDecagonDrawer();
      return;
    }
    currentNav = navId;
    chuyenModule(navId === 'home' ? 'hub' : navId);
  }

  /* ---------------- Thanh menu trái (rail) – Sếp 30/10 ----------------
   * Thu gọn = hàng icon; ☰ bung / thu. Desktop: mặc định bung, nhớ lựa chọn trên máy; không che nội dung.
   * Điện thoại: bung thì nổi trên nội dung (lớp mờ), chọn mảng xong tự thu. */
  const MQ_DESKTOP = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : { matches: false };

  function apDungRail(mo) {
    const drawer = document.getElementById('decagonDrawer');
    const overlay = document.getElementById('decagonOverlay');
    document.body.classList.toggle('rail-mo', mo);
    if (drawer) drawer.classList.toggle('open', mo);
    const nut = document.getElementById('nutRail');
    if (nut) {
      const chu = mo ? 'Thu gọn danh mục' : 'Mở rộng danh mục';
      nut.title = chu; nut.setAttribute('aria-label', chu); nut.setAttribute('aria-expanded', String(mo));
      nut.querySelector('.rail-mui').textContent = mo ? '«' : '»';
    }
    if (overlay) overlay.classList.toggle('open', mo && !MQ_DESKTOP.matches);
  }

  function railMacDinh() {
    return MQ_DESKTOP.matches && docLS('shin_rail_thu') !== '1';
  }

  /** ☰: bung ↔ thu. */
  function moDecagonDrawer() {
    const mo = !document.body.classList.contains('rail-mo');
    if (MQ_DESKTOP.matches) luuLS('shin_rail_thu', mo ? '0' : '1');
    apDungRail(mo);
  }

  /** Thu rail trên điện thoại (sau khi chọn mảng / chạm lớp mờ / Esc). Desktop giữ nguyên. */
  function dongDecagonDrawer() {
    if (MQ_DESKTOP.matches) return;
    apDungRail(false);
  }

  function moCaiDat() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;

    document.querySelectorAll('.theme-mode-btn[data-mode]').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === currentThemeMode));
    apDungKieuRail();

    const tokenInput = document.getElementById('tokenInput');
    if (tokenInput) tokenInput.value = SHIN_API.layToken();

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
    if (!tokenInput) return;
    const val = tokenInput.value.trim();
    SHIN_API.luuToken(val);
    Object.keys(live.quyen).forEach(k => delete live.quyen[k]);
    live.nguoi = null; live.laAdminHub = false; live.soChoDuyet = null; live.lienKet = {}; live.linkHub = ''; live.soChuaDoc = 0; live.hubSanSang = null;
    capNhatBannerTrangThai();
    dongModal();
    const sub = document.querySelector('.topbar-sub');
    if (sub) sub.textContent = 'Hệ thống Quản trị AI';
    veDecagonDrawer();
    veMenuDay();
    if (val) khoiDongLive();
    chuyenModule(currentModule);
  }

  return {
    PHIEN_BAN,
    MODULES,
    MANG_LUON_BAT,
    init,
    doiTheme,
    chonThemeMode,
    apDungPalette,
    chuyenModule,
    chuyenNav,
    moDecagonDrawer,
    dongDecagonDrawer,
    moCaiDat,
    dongModal,
    luuCaiDatToken,
    caiUngDung,
    chonKieuRail,
    dangChayApp,
    toast,
    hanhDongHoanTac,
    xacNhan2Lan,
    goiNut,
    goiBat,
    esc,
    soVN,
    docSoVN,
    goNgay,
    laNgayVN,
    veMenuDay,
    veDecagonDrawer,
    ptVN,
    ngayVN,
    loiChao,
    rung,
    linkV1,
    moV1,
    live,
    datMangBat,
    mangDangBat,
    get mangDangMo() { return currentModule; }
  };
})();

// Khởi chạy khi tài liệu nạp xong
document.addEventListener('DOMContentLoaded', ShinApp.init);
