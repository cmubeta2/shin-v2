/**
 * SHIN v2 – App PTKH gốc (Quản lý hiệu suất phòng PTKH – máy chủ 20_PTKH, GĐ4)
 * PTKH gốc CHƯA có cổng web cho v2 (doPost của PTKH chỉ nhận liên thông Hub ký HMAC – trình duyệt không ký được).
 * Đường nối hiện có (không sửa v1):
 *   ① Số + việc: Hub kéo từ PTKH qua liên thông (tomTat / viec – 37_LienThongHub.gs) rồi trả trong webHomNay
 *      ➜ thẻ có tieuDe 'PTKH' + các việc cùng tenApp.
 *   ② Mở app: link PTKH trong webKhoiDong.lienKet (Hub gắn sẵn token Hub – PTKH nhận token Hub từ v4.05 / L36a).
 * Cổng đọc thẳng (webKhoiDong, webDashboard… của PTKH) – xem HOP_DONG_CONG_V2.md mục v2.6 PTKH.
 */

const ModulePTKH = {
  ma: 'ptkh',
  ten: 'PTKH Gốc',
  bieuTuong: '📋',
  paletteMacDinh: 'gold',
  mayChu: 'HUB',

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webHomNay', {});
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuHub(kq.data) };
  },

  /** THUẦN. webHomNay ➜ phần của PTKH (thẻ tieuDe 'PTKH' + việc cùng tên app). */
  tuHub: function(h) {
    h = h || {};
    const the = (h.the || []).find(t => String(t.tieuDe || '').trim().toUpperCase() === 'PTKH') || null;
    const tenApp = the ? the.tenApp : '';
    return {
      live: true,
      coThe: !!the,
      tenApp,
      so: the ? (the.so || []) : [],
      loi: the ? the.loi || '' : '',
      linkThe: the ? the.link || '' : '',
      viec: tenApp ? (h.viec || []).filter(v => v.tenApp === tenApp) : [],
      capNhatLuc: h.capNhatLuc || ''
    };
  },

  MAU_DEN: { do: 'var(--c-red)', vang: 'var(--c-yellow)', xanh: 'var(--c-green)' },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.ptkh;
    this._d = d;
    const e = ShinApp.esc;
    const so = d.so || [];
    const viec = d.viec || [];
    const coLink = !!ShinApp.linkV1('PTKH') || !!d.linkThe;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">📋 PTKH Gốc</div>
          <div class="page-sub">Quản lý hiệu suất phòng PTKH · số và việc qua Hub</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('ptkh')" title="Làm mới">↻</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Phòng PTKH tháng này 📋</div>
            <div class="hero-date">📅 ${e(ShinApp.ngayVN())}${d.capNhatLuc ? ' · Hub kéo số lúc ' + e(d.capNhatLuc) : ''}</div>
          </div>
        </div>
        ${so.length ? `
          <div class="tq-3so">
            ${so.slice(0, 3).map(s => `<div class="tq-o"><div class="tq-so" style="color:${this.MAU_DEN[s.den] || 'var(--c-blue)'}">${e(s.chu)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>`).join('')}
          </div>` : `<p class="chu-phu">${d.loi ? '⚠️ ' + e(d.loi) : d.live && !d.coThe ? 'Hub chưa có thẻ số PTKH cho anh/chị (chưa được phân mảng PTKH, hoặc Hub chưa kéo số lần nào).' : ''}</p>`}
        <button class="btn-primary" onclick="ModulePTKH.moApp()">📋 Mở app PTKH${coLink ? '' : ' (cần token Hub)'}</button>
      </div>

      <div class="hn-tieu"><span>VIỆC TỪ PTKH · ${viec.length}</span></div>
      ${viec.length ? `<div class="hn-list">${viec.map((v, i) => `
        <div class="hn-dong" onclick="ModulePTKH.moViec(${i})">
          <div class="dong-content">
            <div class="dong-title">${e(v.tieuDe)}</div>
            <div class="dong-sub">${e([v.han ? 'Hạn ' + v.han : '', v.uuTien].filter(Boolean).join(' · '))}</div>
          </div>
          <div class="dong-meta">${v.quaHan ? '<span class="badge do">Quá hạn</span>' : v.uuTien === 'Khẩn cấp' ? '<span class="badge do">Khẩn</span>' : ''}<span class="dong-arrow">›</span></div>
        </div>`).join('')}</div>` : '<div class="trong">Không có việc PTKH nào đang chờ anh/chị.</div>'}

      <div class="luoi-o-so">
        ${[['📝', 'Báo cáo ngày'], ['✅', 'Duyệt báo cáo'], ['📊', 'Tổng quan phòng'], ['🗂️', 'Phân công'], ['💬', 'Khiếu nại'], ['🏅', 'Phiếu HTNV']]
          .map(([i, t]) => `<button class="o-so-loc" onclick="ModulePTKH.moApp()"><span>${i}</span><span>${t}</span></button>`).join('')}
      </div>

      <details class="tq-gon">
        <summary><span>ⓘ Kết nối với app PTKH gốc</span></summary>
        <p class="chu-phu">Số và việc ở đây do Hub kéo từ app PTKH (khoảng 90 phút / lần; bấm ↻ trên 🏠 Hôm nay để kéo ngay). Các nút mở thẳng app PTKH bằng token Hub của anh/chị – không cần link PTKH riêng. Khi PTKH mở cổng web cho v2 (đã ghi trong hợp đồng cổng), màn này sẽ đọc thẳng Tổng quan phòng.</p>
      </details>
    `;
  },

  moApp: function() {
    const link = ShinApp.linkV1('PTKH') || (this._d && this._d.linkThe) || '';
    if (!link) { ShinApp.moV1('PTKH', 'App PTKH'); return; }
    window.open(link, '_blank', 'noopener');
  },

  moViec: function(i) {
    const v = ((this._d || {}).viec || [])[i];
    const link = v && /^https:\/\//.test(v.link || '') ? v.link : '';
    if (link) window.open(link, '_blank', 'noopener'); else this.moApp();
  }
};
