/**
 * SHIN v2 – App PTKH gốc (Quản lý hiệu suất phòng PTKH – máy chủ 20_PTKH, GĐ4)
 * PTKH gốc CHƯA có cổng web cho v2 (doPost của PTKH chỉ nhận liên thông Hub ký HMAC – trình duyệt không ký được).
 * Đường nối hiện có (không sửa v1):
 *   ① Số + việc: Hub kéo từ PTKH qua liên thông (tomTat / viec – 37_LienThongHub.gs) rồi trả trong webHomNay
 *      ➜ thẻ có tieuDe 'PTKH' + các việc cùng tenApp.
 *   ② Mở app: link PTKH trong webKhoiDong.lienKet (Hub gắn sẵn token Hub – PTKH nhận token Hub từ v4.05 / L36a).
 * v2.6.6: Tổng quan đọc THẲNG PTKH qua cổng webGoi (PTKH L148, v1.292.29) – hàm chỉ đọc webDashboard(token, ky):
 *   {homNay, kys, [ky]: {tenKy, nhan, toi:{bc:{tong,dungHan,tre,khongNop,canBoSung}, viec:{dangLam,quaHan,xong,xongDungHan}, minhChung, ngayNghi},
 *    dongGop:[{ten,dvt,toi,ptTo,ptPhong}], to, phong:{ten,soNV,soBC,dungHan(0..1),canBoSung(0..1),vuongMac,viecQuaHan}}}
 *   Địa chỉ /exec lấy từ link app PTKH Hub trả (webKhoiDong.lienKet) – không ghi cứng.
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

      <div class="hn-tieu"><span>TỔNG QUAN (ĐỌC THẲNG PTKH)</span></div>
      <div class="hang-chip">${['tuan', 'thang', 'quy'].map(k => `<button class="chip-chon ${k === this._ky ? 'dang-chon' : ''}" onclick="ModulePTKH.chonKy('${k}')">${{ tuan: 'Tuần này', thang: 'Tháng này', quy: 'Quý này' }[k]}</button>`).join('')}</div>
      <div id="ptkhTQ"><div class="trong">Đang tải tổng quan…</div></div>

      <div class="luoi-o-so">
        ${[['📝', 'Báo cáo ngày'], ['✅', 'Duyệt báo cáo'], ['📊', 'Tổng quan phòng'], ['🗂️', 'Phân công'], ['💬', 'Khiếu nại'], ['🏅', 'Phiếu HTNV']]
          .map(([i, t]) => `<button class="o-so-loc" onclick="ModulePTKH.moApp()"><span>${i}</span><span>${t}</span></button>`).join('')}
      </div>

      <details class="tq-gon">
        <summary><span>ⓘ Kết nối với app PTKH gốc</span></summary>
        <p class="chu-phu">Số và việc ở đây do Hub kéo từ app PTKH (khoảng 90 phút / lần; bấm ↻ trên 🏠 Hôm nay để kéo ngay). Các nút mở thẳng app PTKH bằng token Hub của anh/chị – không cần link PTKH riêng. Khi PTKH mở cổng web cho v2 (đã ghi trong hợp đồng cổng), màn này sẽ đọc thẳng Tổng quan phòng.</p>
      </details>
    `;
    this.taiTongQuan();
  },

  _ky: 'thang',
  _tq: {},

  chonKy: function(k) {
    this._ky = k;
    document.querySelectorAll('#appContent .hang-chip .chip-chon').forEach(b => b.classList.toggle('dang-chon', /onclick/.test(b.outerHTML) && b.getAttribute('onclick').indexOf(`'${k}'`) >= 0));
    this.taiTongQuan();
  },

  /** Đọc webDashboard(token, ky) qua webGoi PTKH. Demo ➜ mẫu demo_data.ptkh.tongQuan. Lỗi ➜ báo rõ, không thay số mẫu. */
  taiTongQuan: async function() {
    const el = () => document.getElementById('ptkhTQ');
    if (!el()) return;
    const ky = this._ky;
    let d = this._tq[ky];
    if (!d) {
      if (!SHIN_API.laCheDoLive()) d = ((window.SHIN_DEMO_DATA.ptkh || {}).tongQuan || {})[ky] || {};
      else {
        el().innerHTML = '<div class="trong">Đang tải tổng quan…</div>';
        const kq = await SHIN_API.goiWebGoi(ShinApp.linkV1('PTKH') || (this._d && this._d.linkThe), 'webDashboard', [ky]);
        if (!el() || this._ky !== ky) return;
        if (!kq.ok) {
          el().innerHTML = `<div class="trong">⚠️ ${ShinApp.esc(kq.loi === 'hanh' ? 'Chưa lấy được địa chỉ máy chủ PTKH từ Hub (cần token Hub và quyền app PTKH).' : SHIN_API.moTaLoi(kq))}</div>`;
          return;
        }
        d = (kq.data || {})[ky] || {};
      }
      this._tq[ky] = d;
    }
    el().innerHTML = this.veTongQuan(d);
  },

  /** THUẦN-ish: khối Tổng quan từ 1 kỳ của webDashboard. */
  veTongQuan: function(k) {
    const e = ShinApp.esc, so = ShinApp.soVN, toi = k.toi || {}, bc = toi.bc, viec = toi.viec || {}, ph = k.phong, to = k.to;
    const pt = x => x === null || x === undefined ? '—' : ShinApp.ptVN ? ShinApp.ptVN(x) : Math.round(x * 100) + '%';
    const o = (nhan, gt, mau) => `<div class="tq-o"><div class="tq-so" style="color:${mau || 'var(--c-blue)'}">${e(gt)}</div><div class="tq-nhan">${e(nhan)}</div></div>`;
    const cl = c => c ? `<div class="the"><div class="dong-title">${e(c.ten)}</div>
        <div class="hang-tru"><span>Nhân sự · báo cáo</span><span>${so(c.soNV || 0)} · ${so(c.soBC || 0)}</span></div>
        <div class="hang-tru"><span>Đúng hạn</span><span>${pt(c.dungHan)}</span></div>
        <div class="hang-tru"><span>Cần bổ sung</span><span>${pt(c.canBoSung)}</span></div>
        <div class="hang-tru"><span>Vướng mắc · việc quá hạn</span><span>${so(c.vuongMac || 0)} · ${so(c.viecQuaHan || 0)}</span></div></div>` : '';
    return `${k.nhan ? `<div class="hero-date">📅 ${e(k.tenKy || '')} · ${e(k.nhan)}</div>` : ''}
      <div class="tq-3so">${o('Việc đang làm', so(viec.dangLam || 0))}${o('Việc quá hạn', so(viec.quaHan || 0), viec.quaHan ? 'var(--c-red)' : 'var(--c-gray)')}${o('Việc xong', so(viec.xong || 0), 'var(--c-green)')}</div>
      ${bc ? `<div class="tq-3so">${o('Báo cáo đã nộp', so(bc.tong || 0))}${o('Đúng hạn', so(bc.dungHan || 0), 'var(--c-green)')}${o('Trễ / không nộp', so((bc.tre || 0) + (bc.khongNop || 0)), (bc.tre || bc.khongNop) ? 'var(--c-red)' : 'var(--c-gray)')}</div>` : ''}
      ${(k.dongGop || []).length ? `<div class="the"><div class="dong-title">Đóng góp của tôi</div>${k.dongGop.map(g => `<div class="hang-tru"><span>${e(g.ten)}</span><span>${so(g.toi || 0)} ${e(g.dvt || '')}${g.ptPhong !== null && g.ptPhong !== undefined ? ' · ' + pt(g.ptPhong) + ' phòng' : ''}</span></div>`).join('')}</div>` : ''}
      ${cl(to)}${cl(ph)}
      <p class="chu-phu">Minh chứng: ${so(toi.minhChung || 0)} · Ngày nghỉ: ${so(toi.ngayNghi || 0)}</p>`;
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
