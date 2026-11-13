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
    khongduavao: 'Không gửi: nội dung có dữ liệu cấm theo KHONG_DUA_VAO.md (định danh người bệnh / khóa bí mật).',
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
    try { return localStorage.getItem('shin_token') || ''; } catch (e) { return ''; }
  }

  function xoaToken() {
    try { localStorage.removeItem('shin_token'); } catch (e) {}
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
  /**
   * v2.8.9 – M9.5 Tường lửa KHONG_DUA_VAO.md phía trình duyệt (THUẦN): soát mọi chuỗi trong `du` của cổng GHI
   * trước khi gửi. Chặn: số CCCD 12 chữ số, mã thẻ BHYT (2 chữ + 13 số), khóa / token bí mật (Anthropic, OpenAI,
   * Google API, Telegram Bot, chuỗi token Hub h1.…). KHÔNG chặn số điện thoại (CRM cần SĐT người liên hệ đối tác).
   * Trả null nếu sạch, hoặc {loai, truong} – không bao giờ trả lại giá trị vi phạm.
   */
  const MAU_CAM = [
    { loai: 'số CCCD', re: /(^|[^\d])\d{12}(?!\d)/ },
    { loai: 'mã thẻ BHYT', re: /\b[A-Z]{2}[1-5]\d{12}\b/ },
    { loai: 'khóa API', re: /\bsk-(ant-)?[A-Za-z0-9_-]{24,}|\bAIza[0-9A-Za-z_-]{35}\b/ },
    { loai: 'token Telegram Bot', re: /\b\d{8,10}:[A-Za-z0-9_-]{35}\b/ },
    { loai: 'token đăng nhập', re: /\bh1\.[\w-]+\.[\w-]+\.[\w-]{16,}/ }
  ];
  const CONG_GHI = /^web(Luu|Ghi|Nop|Gui|Them|Sua|Tao|Duyet|Xoa|Dang|Cap)/;
  function soatKhongDuaVao(du, truong, sau) {
    sau = sau || 0;
    if (du === null || du === undefined || sau > 6) return null;
    if (typeof du === 'string') {
      for (const m of MAU_CAM) if (m.re.test(du)) return { loai: m.loai, truong: truong || '' };
      return null;
    }
    if (typeof du !== 'object') return null;
    for (const k of Object.keys(du)) {
      const r = soatKhongDuaVao(du[k], Array.isArray(du) ? truong : k, sau + 1);
      if (r) return r;
    }
    return null;
  }

  async function goi(appKey, hanh, du = {}) {
    if (CONG_GHI.test(String(hanh || ''))) {
      const vp = soatKhongDuaVao(du);
      if (vp) {
        console.warn(`[Shin API] Chặn ${hanh}: ô "${vp.truong}" có ${vp.loai} (KHONG_DUA_VAO.md).`);
        return { ok: false, loi: 'khongduavao', chiTiet: `Ô "${vp.truong}" có ${vp.loai} – xóa đi rồi lưu lại.` };
      }
    }
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

  /**
   * v2.7.5 – PTKH gốc (20_PTKH L148 `webGoi`): {hanh:'webGoi', token, du:{ham, thamSo:[]}} ➜ {ok, du}.
   * Địa chỉ máy chủ lấy ĐỘNG từ link PTKH Hub cấp (webKhoiDong.lienKet) – không chép link /exec vào mã; chỉ nhận https://script.google.com/macros/s/…/exec.
   */
  async function goiPTKH(linkPTKH, ham, thamSo) {
    const token = layToken();
    let endpoint = '';
    try { const u = new URL(linkPTKH); if (u.origin === 'https://script.google.com' && /^\/macros\/s\/[\w-]+\/exec$/.test(u.pathname)) endpoint = u.origin + u.pathname; } catch (e) {}
    if (!token) return { ok: false, loi: 'token' };
    if (!endpoint) return { ok: false, loi: 'loi', chiTiet: 'Hub chưa cấp link app PTKH cho anh/chị' };
    const batDau = Date.now();
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ hanh: 'webGoi', token: token, du: { ham: ham, thamSo: thamSo || [] } })
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      sucKhoe.PTKH = { ms: Date.now() - batDau, ok: !!j.ok, loi: j.ok ? '' : (j.loi || 'loi'), luc: new Date() };
      return j.ok ? { ok: true, data: j.du } : { ok: false, loi: LOI_VN[j.loi] ? j.loi : 'loi', chiTiet: LOI_VN[j.loi] ? '' : String(j.loi || '') };
    } catch (err) {
      sucKhoe.PTKH = { ms: Date.now() - batDau, ok: false, loi: 'mang', luc: new Date() };
      return { ok: false, loi: 'mang', chiTiet: err.message };
    }
  }

  /** Cổng nhận tham số rời (KPI, TS, KS, PK – bocCong…_): goiCong('TS', 'webLeadCD', 'CD03'). */
  function goiCong(appKey, hanh, ...thamSo) {
    return goi(appKey, hanh, { a: thamSo });
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
    return (kq.loi === 'loi' || kq.loi === 'khongduavao') && kq.chiTiet ? `${goc} (${kq.chiTiet})` : goc;
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

  /** v2.7.1 (HUB L8): mở trong Telegram Mini App ➜ initData từ Telegram.WebApp hoặc #tgWebAppData của link mở. */
  function docInitDataTelegram() {
    try { const w = window.Telegram && window.Telegram.WebApp; if (w && w.initData) return w.initData; } catch (e) {}
    try { return new URLSearchParams(String(location.hash || '').replace(/^#/, '')).get('tgWebAppData') || ''; } catch (e) { return ''; }
  }

  /** Đổi initData lấy token Hub 12 giờ qua cổng Hub webTelegram (không token, Hub kiểm chữ ký bot). */
  async function dangNhapTelegram(initData) {
    const endpoint = ENDPOINTS.HUB;
    if (!initData || !endpoint) return { ok: false, loi: 'thieu', msg: '' };
    const batDau = Date.now();
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ hanh: 'webTelegram', du: { initData: initData } }) });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json(), d = j && j.du;
      ghiSucKhoe('HUB', batDau, j && j.ok ? '' : 'loi');
      if (j && j.ok && d && d.ok && d.token) { luuToken(d.token); return { ok: true, nguoi: d.nguoi || null, hetHan: d.hetHan }; }
      return { ok: false, loi: (d && d.loi) || (j && j.loi) || 'loi', msg: (d && d.msg) || (j && j.chiTiet) || '' };
    } catch (err) {
      ghiSucKhoe('HUB', batDau, 'mang');
      return { ok: false, loi: 'mang', msg: '' };
    }
  }

  return {
    TEN_MAY_CHU,
    docInitDataTelegram,
    dangNhapTelegram,
    layToken,
    luuToken,
    xoaToken,
    laCheDoLive,
    coMayChu,
    goi,
    goiCong,
    goiPTKH,
    laySucKhoe,
    moTaLoi,
    soatKhongDuaVao,
    /** v2.13.26: link /exec của máy chủ (trang điền khảo sát công khai dienks.html gọi KS không token). */
    urlMayChu: k => ENDPOINTS[k] || ''
  };
})();
