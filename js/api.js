/**
 * SHIN v2 – Tầng Giao tiếp Mạng & API Liên thông
 * v2 là "cửa thứ 3" của hệ v1: gọi thẳng cổng web doPost của 5 máy chủ Apps Script v1 (dùng chung dữ liệu).
 * Giao thức v1 (00_Loi/Loi_Web.gs – cuaWebPost_):
 *   Gửi : POST text/plain {hanh: 'web…', token, du}
 *   Nhận: {ok: true, du} | {ok: false, loi: 'dang' | 'hanh' | 'token' | 'quyen' | 'loi', chiTiet}
 * Hub gọi hàm trang dạng ham(token, du); KPI / TS / KS / PK nhận tham số rời trong du.a = [..] (bocCong…_).
 */

const SHIN_API = (function() {
  const ENDPOINTS = {
    HUB: 'https://script.google.com/macros/s/AKfycbz2U4Sqm-dLZPmPrfoX3bejeIJC0-X64ekxvYm1qsYBz3vi_fQIOLfpxkEGBFA3lXO1-A/exec',
    KPI: 'https://script.google.com/macros/s/AKfycbxU6PyndV0yB31rpbNFufUTw7KwCjPhoqjD7BvSq-WdxBTN5k9Qvdl7yT2qg9DSk4Sn/exec',
    TS:  'https://script.google.com/macros/s/AKfycbxWejTJFDTdyc3tsaz4HM8hBx9E7KkZGejTSFp_eigz7XxFbgCYVpK5T2O5tA_noVsa/exec',
    KS:  'https://script.google.com/macros/s/AKfycbyA7tRb0KnGfQpY-9W7wc4sslNibTOiFlTf_JpCaGJQ84Vs26ohMspkNbqDr2ljVZ15/exec',
    PK:  'https://script.google.com/macros/s/AKfycbxFBBCqXbQYqTZbM-MoICkbFBhw2QTqzZoXemERk49OQldDNvYMnzcRuGRG7CpWQrJM4Q/exec'
  };

  // Mã module trong v2 (ModuleX.ma) ➜ khóa endpoint Apps Script của v1
  const BI_DANH_ENDPOINT = { KHAOSAT: 'KS', TUYENSINH: 'TS', PHONGKHAM: 'PK' };

  const TEN_MAY_CHU = { HUB: 'Hub', KPI: 'KPI Toàn Viện', TS: 'Tuyển Sinh', KS: 'Khảo Sát', PK: 'Phòng Khám' };

  // M0.4 – sức khỏe từng máy chủ: { HUB: { ms, ok, loi, luc } }
  const sucKhoe = {};

  const LOI_VN = {
    dang: 'Máy chủ không hiểu yêu cầu.',
    hanh: 'Máy chủ v1 chưa mở cổng này.',
    token: 'Thiếu token đăng nhập.',
    quyen: 'Anh/chị chưa được cấp quyền vào app này.',
    loi: 'Máy chủ báo lỗi khi xử lý.',
    mang: 'Không kết nối được máy chủ (mạng hoặc máy chủ đang bận).'
  };

  function layToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('t');
    if (urlToken) {
      try { localStorage.setItem('shin_token', urlToken); } catch (e) {}
      // Q4 (Sếp chốt 29/10): lưu xong thì xóa ?t= khỏi thanh địa chỉ để không lộ token khi chụp màn hình / chia sẻ link
      const u = new URL(window.location.href);
      u.searchParams.delete('t');
      window.history.replaceState({}, document.title, u.toString());
      return urlToken;
    }
    const tg = tokenTG();
    if (tg) return tg;
    try { return localStorage.getItem('shin_token') || ''; } catch (e) { return ''; }
  }

  /* ---- v2.6.8 – Telegram Mini App (HUB L8, Hub v1.13.3): mở v2 từ nút menu bot ➜ đổi initData lấy token Hub 12 giờ ----
   * Token phiên Telegram chỉ giữ ở sessionStorage (máy chủ dặn: không ghi đè token Hub lâu dài). Không nạp SDK ngoài (CSP chỉ 'self'):
   * đọc Telegram.WebApp.initData nếu có, không thì #tgWebAppData trên địa chỉ (Telegram luôn gắn khi mở Mini App). */
  const KHOA_TG = 'shin_token_tg';
  function tokenTG() {
    try {
      const p = JSON.parse(sessionStorage.getItem(KHOA_TG) || 'null');
      if (p && p.token && Number(p.hetHan) > Date.now() + 60000) return p.token;
      if (p) sessionStorage.removeItem(KHOA_TG);
    } catch (e) {}
    return '';
  }
  function coTokenLuu() {
    if (tokenTG()) return true;
    try { return !!localStorage.getItem('shin_token') || new URLSearchParams(location.search).has('t'); } catch (e) { return false; }
  }
  function layInitDataTG() {
    try {
      const w = window.Telegram && window.Telegram.WebApp;
      if (w && w.initData) return String(w.initData);
      const h = String(location.hash || '').replace(/^#/, '');
      return h ? (new URLSearchParams(h).get('tgWebAppData') || '') : '';
    } catch (e) { return ''; }
  }
  /** Gửi initData cho cổng webTelegram của Hub (không token) ➜ {ok:true, nguoi} | {ok:false, msg}. Xóa #tgWebAppData khỏi địa chỉ sau khi đọc. */
  async function dangNhapTelegram(initData) {
    try { if (location.hash) history.replaceState({}, document.title, location.pathname + location.search); } catch (e) {}
    try {
      const r = await fetch(ENDPOINTS.HUB, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ hanh: 'webTelegram', du: { initData } }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json(), d = (j && j.du) || {};
      if (!j.ok) return { ok: false, msg: LOI_VN[j.loi] || LOI_VN.loi };
      if (!d.ok || !d.token) return { ok: false, msg: d.msg || 'Chưa đăng nhập được bằng Telegram – mở lại từ bot Shin.' };
      try { sessionStorage.setItem(KHOA_TG, JSON.stringify({ token: d.token, hetHan: d.hetHan })); } catch (e) {}
      return { ok: true, nguoi: d.nguoi || null };
    } catch (err) {
      return { ok: false, msg: LOI_VN.mang };
    }
  }

  function xoaToken() {
    try { localStorage.removeItem('shin_token'); } catch (e) {}
    try { sessionStorage.removeItem(KHOA_TG); } catch (e) {}
    const u = new URL(window.location.href);
    u.searchParams.delete('t');
    window.history.replaceState({}, document.title, u.toString());
  }

  function luuToken(token) {
    if (token) {
      try { localStorage.setItem('shin_token', token.trim()); } catch (e) {}
    } else {
      xoaToken();
    }
  }

  function laCheDoLive() {
    return !!layToken();
  }

  function khoaMayChu(appKey) {
    const khoa = String(appKey || '').toUpperCase();
    return BI_DANH_ENDPOINT[khoa] || khoa;
  }

  function coMayChu(appKey) {
    return !!ENDPOINTS[khoaMayChu(appKey)];
  }

  /**
   * Gọi 1 cổng web của máy chủ v1.
   * Trả {ok:true, isDemo:false, data} | {ok:false, loi, chiTiet} khi đang Live;
   * {ok:true, isDemo:true, data: mẫu} khi chưa có token hoặc mảng chưa có máy chủ.
   */
  async function goi(appKey, hanh, du = {}) {
    const token = layToken();
    const khoa = khoaMayChu(appKey);
    const endpoint = ENDPOINTS[khoa];

    if (!token || !endpoint) {
      return { ok: true, isDemo: true, chuaCoMayChu: !!token && !endpoint, data: layDuLieuMau(appKey, hanh) };
    }

    const batDau = Date.now();
    try {
      // POST text/plain không kích hoạt preflight OPTIONS request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ hanh: hanh, token: token, du: du || {} })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const resJson = await response.json();
      ghiSucKhoe(khoa, batDau, resJson.ok ? '' : resJson.loi);
      if (!resJson.ok) {
        console.warn(`[Shin API] ${khoa}:${hanh} trả lỗi:`, resJson.loi, resJson.chiTiet || '');
        return { ok: false, loi: resJson.loi || 'loi', chiTiet: resJson.chiTiet || '' };
      }
      return { ok: true, isDemo: false, data: resJson.du !== undefined ? resJson.du : resJson.data };
    } catch (err) {
      ghiSucKhoe(khoa, batDau, 'mang');
      console.warn(`[Shin API] Gọi máy chủ ${khoa} thất bại (${err.message}).`);
      return { ok: false, loi: 'mang', chiTiet: err.message };
    }
  }

  /** Cổng nhận tham số rời (KPI, TS, KS, PK – bocCong…_): goiCong('TS', 'webLeadCD', 'CD03'). */
  function goiCong(appKey, hanh, ...thamSo) {
    return goi(appKey, hanh, { a: thamSo });
  }

  /**
   * v2.6.6 – Cổng webGoi của PTKH gốc (20_PTKH L148, app v1.294+): POST {hanh:'webGoi', token, du:{ham, thamSo}} ➜ {ok, du} | {ok:false, loi: chữ}.
   * Địa chỉ /exec lấy lúc chạy từ link PTKH Hub trả (webKhoiDong.lienKet) – không ghi cứng; chỉ nhận https://script.google.com/macros/s/…/exec.
   */
  async function goiPTKH(linkPTKH, ham, thamSo = []) {
    const token = layToken();
    if (!token) return { ok: true, isDemo: true, data: null };
    let endpoint = '';
    try { const u = new URL(linkPTKH || ''); if (u.protocol === 'https:' && u.hostname === 'script.google.com' && /^\/macros\/s\/[\w-]+\/exec$/.test(u.pathname)) endpoint = u.origin + u.pathname; } catch (e) {}
    if (!endpoint) return { ok: false, loi: 'hanh', chiTiet: 'Chưa có link app PTKH từ Hub.' };
    const batDau = Date.now();
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ hanh: 'webGoi', token, du: { ham, thamSo } }) });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      ghiSucKhoe('PTKH', batDau, j.ok ? '' : 'loi');
      if (!j.ok) return { ok: false, loi: j.loi === 'token' ? 'token' : j.loi === 'ham' ? 'hanh' : 'loi', chiTiet: j.loi || '' };
      return { ok: true, isDemo: false, data: j.du };
    } catch (err) {
      ghiSucKhoe('PTKH', batDau, 'mang');
      return { ok: false, loi: 'mang', chiTiet: err.message };
    }
  }

  function ghiSucKhoe(khoa, batDau, loi) {
    sucKhoe[khoa] = { ms: Date.now() - batDau, ok: !loi || loi === 'quyen', loi: loi || '', luc: new Date() };
  }

  function laySucKhoe() {
    return Object.keys(ENDPOINTS).map(k => Object.assign({ khoa: k, ten: TEN_MAY_CHU[k] }, sucKhoe[k] || {}));
  }

  function moTaLoi(kq) {
    if (!kq) return LOI_VN.loi;
    const goc = LOI_VN[kq.loi] || LOI_VN.loi;
    return kq.loi === 'loi' && kq.chiTiet ? `${goc} (${kq.chiTiet})` : goc;
  }

  function layDuLieuMau(appKey, hanh) {
    const key = String(appKey || '').toLowerCase();
    const allDemo = window.SHIN_DEMO_DATA || {};
    if (key === 'hub') return allDemo.hub;
    if (key === 'kpi') return allDemo.kpi;
    if (key === 'ts' || key === 'tuyensinh') return allDemo.tuyensinh;
    if (key === 'ks' || key === 'khaosat') return allDemo.khaosat;
    if (key === 'pk' || key === 'phongkham') return allDemo.phongkham;
    // Các mảng chưa có máy chủ riêng (crm, duan, congviec, pheduyet, trithuc, caidat...)
    // trả null để module tự dùng bộ dữ liệu mẫu của chính nó
    return allDemo[key] || null;
  }

  return {
    TEN_MAY_CHU,
    layToken,
    luuToken,
    xoaToken,
    laCheDoLive,
    coTokenLuu,
    layInitDataTG,
    dangNhapTelegram,
    coMayChu,
    goi,
    goiCong,
    goiPTKH,
    laySucKhoe,
    moTaLoi
  };
})();
