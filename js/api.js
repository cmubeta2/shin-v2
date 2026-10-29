/**
 * SHIN v2 – Tầng Giao tiếp Mạng & API Liên thông
 * Kết nối trực tiếp 5 máy chủ Apps Script chuẩn qua POST text/plain (vượt rào CORS preflight):
 * - HUB: Bàn điều hành trung tâm
 * - KPI: BKS & Giám sát hiệu suất toàn viện
 * - TS:  Tuyển sinh & Quản trị chiến dịch
 * - KS:  Khảo sát hài lòng độc lập
 * - PK:  Phòng khám mới (thay thế hoàn toàn PTKH cũ)
 */

const SHIN_API = (function() {
  const ENDPOINTS = {
    HUB: 'https://script.google.com/macros/s/AKfycbz2U4Sqm-dLZPmPrfoX3bejeIJC0-X64ekxvYm1qsYBz3vi_fQIOLfpxkEGBFA3lXO1-A/exec',
    KPI: 'https://script.google.com/macros/s/AKfycbxU6PyndV0yB31rpbNFufUTw7KwCjPhoqjD7BvSq-WdxBTN5k9Qvdl7yT2qg9DSk4Sn/exec',
    TS:  'https://script.google.com/macros/s/AKfycbxWejTJFDTdyc3tsaz4HM8hBx9E7KkZGejTSFp_eigz7XxFbgCYVpK5T2O5tA_noVsa/exec',
    KS:  'https://script.google.com/macros/s/AKfycbyA7tRb0KnGfQpY-9W7wc4sslNibTOiFlTf_JpCaGJQ84Vs26ohMspkNbqDr2ljVZ15/exec',
    PK:  'https://script.google.com/macros/s/AKfycbxFBBCqXbQYqTZbM-MoICkbFBhw2QTqzZoXemERk49OQldDNvYMnzcRuGRG7CpWQrJM4Q/exec'
  };

  function layToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('t');
    if (urlToken) {
      localStorage.setItem('shin_token', urlToken);
      return urlToken;
    }
    return localStorage.getItem('shin_token') || '';
  }

  function xoaToken() {
    localStorage.removeItem('shin_token');
    const u = new URL(window.location.href);
    u.searchParams.delete('t');
    window.history.replaceState({}, document.title, u.toString());
  }

  function luuToken(token) {
    if (token) {
      localStorage.setItem('shin_token', token.trim());
    } else {
      xoaToken();
    }
  }

  function laCheDoLive() {
    return !!layToken();
  }

  async function goi(appKey, hanh, du = {}) {
    const token = layToken();
    const endpoint = ENDPOINTS[appKey.toUpperCase()];

    // Nếu không có token hoặc app chưa cấu hình endpoint
    if (!token || !endpoint) {
      return { ok: true, isDemo: true, data: layDuLieuMau(appKey, hanh) };
    }

    try {
      // POST text/plain không kích hoạt preflight OPTIONS request
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          hanh: hanh,
          token: token,
          du: du
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const resJson = await response.json();
      if (!resJson.ok) {
        console.warn(`[Shin API] ${appKey}:${hanh} trả lỗi:`, resJson.loi);
        return { ok: false, loi: resJson.loi, chiTiet: resJson.chiTiet };
      }

      return { ok: true, isDemo: false, data: resJson.du || resJson.data };
    } catch (err) {
      console.warn(`[Shin API] Gọi máy chủ ${appKey} thất bại (${err.message}). Chuyển sang dữ liệu đệm.`);
      return { ok: true, isDemo: true, isFallback: true, data: layDuLieuMau(appKey, hanh) };
    }
  }

  function layDuLieuMau(appKey, hanh) {
    const key = appKey.toLowerCase();
    const allDemo = window.SHIN_DEMO_DATA || {};
    if (key === 'hub') return allDemo.hub;
    if (key === 'kpi') return allDemo.kpi;
    if (key === 'ts' || key === 'tuyensinh') return allDemo.tuyensinh;
    if (key === 'ks' || key === 'khaosat') return allDemo.khaosat;
    if (key === 'pk' || key === 'phongkham') return allDemo.phongkham;
    return {};
  }

  return {
    layToken,
    luuToken,
    xoaToken,
    laCheDoLive,
    goi
  };
})();
