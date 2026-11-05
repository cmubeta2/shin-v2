/**
 * SHIN v2 – App PTKH gốc (Quản lý hiệu suất phòng PTKH – máy chủ 20_PTKH, GĐ4)
 * PTKH gốc CHƯA có cổng web cho v2 (doPost của PTKH chỉ nhận liên thông Hub ký HMAC – trình duyệt không ký được).
 * Đường nối hiện có (không sửa v1):
 *   ① Số + việc: Hub kéo từ PTKH qua liên thông (tomTat / viec – 37_LienThongHub.gs) rồi trả trong webHomNay
 *      ➜ thẻ có tieuDe 'PTKH' + các việc cùng tenApp.
 *   ② Mở app: link PTKH trong webKhoiDong.lienKet (Hub gắn sẵn token Hub – PTKH nhận token Hub từ v4.05 / L36a).
 * v2.6.6: ③ ĐỌC THẲNG PTKH qua cổng webGoi (PTKH L148): webKhoiDong (tóm tắt 14 ngày, việc tuần, lịch tuần)
 *   + webDashboard(ky) (Tổng quan Tuần / Tháng / Quý) – địa chỉ lấy từ link PTKH Hub trả; lỗi ➜ báo rõ, giữ phần Hub.
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
    const d = this.tuHub(kq.data);
    const link = ShinApp.linkV1('PTKH') || d.linkThe;
    const [kd, db] = await Promise.all([SHIN_API.goiPTKH(link, 'webKhoiDong', []), SHIN_API.goiPTKH(link, 'webDashboard', [this._ky])]);
    if (kd.ok && kd.data) d.ptkh = this.tuPTKH(kd.data); else d.loiPTKH = SHIN_API.moTaLoi(kd) + (kd.chiTiet && kd.loi !== 'loi' ? ' (' + kd.chiTiet + ')' : '');
    if (db.ok && db.data) d.tongQuan = db.data[this._ky] || null; else if (!d.loiPTKH) d.loiPTKH = 'Tổng quan: ' + SHIN_API.moTaLoi(db);
    return { ok: true, data: d };
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

  _ky: 'thang',
  KY: { tuan: 'Tuần này', thang: 'Tháng này', quy: 'Quý này' },

  /** THUẦN. webKhoiDong của PTKH ➜ phần v2 dùng (chỉ đọc). */
  tuPTKH: function(p) {
    p = p || {};
    return { nv: p.nv || {}, daNop: !!p.daNop, khongNopBC: !!p.khongNopBC, tomTat: p.tomTat || {},
      viec: Array.isArray(p.viec) ? p.viec : [], lichTuan: Array.isArray(p.lichTuan) ? p.lichTuan : [], phienBan: p.phienBan || '' };
  },

  doiKy: async function(ky) {
    this._ky = ky;
    const o = document.getElementById('ptkhTQ');
    if (!o || !this._d || !this._d.live) { ShinApp.chuyenModule('ptkh'); return; }
    document.querySelectorAll('#ptkhKy .chip-chon').forEach(b => b.classList.toggle('dang-chon', b.dataset.ky === ky));
    o.innerHTML = '<div class="trong">Đang tải…</div>';
    const kq = await SHIN_API.goiPTKH(ShinApp.linkV1('PTKH') || this._d.linkThe, 'webDashboard', [ky]);
    if (!o.isConnected) return;
    if (!kq.ok) { o.innerHTML = `<div class="trong">⚠️ ${ShinApp.esc(SHIN_API.moTaLoi(kq))}</div>`; return; }
    this._d.tongQuan = (kq.data || {})[ky] || null;
    o.innerHTML = this.veTongQuan(this._d.tongQuan);
  },

  /** Các trường là số của 1 đối tượng (bỏ mảng / đối tượng con) – PTKH thêm trường thì vẫn hiện được. */
  veSoPhang: function(o, gioiHan) {
    const e = ShinApp.esc, TEN = { tong: 'Tổng', dungHan: 'Đúng hạn', tre: 'Trễ', nop: 'Đã nộp', phaiNop: 'Phải nộp', xong: 'Xong', quaHan: 'Quá hạn', dangLam: 'Đang làm', anh: 'Ảnh', ngay: 'Ngày', pt: '%' };
    return Object.entries(o || {}).filter(([, v]) => typeof v === 'number' && isFinite(v)).slice(0, gioiHan || 6)
      .map(([k, v]) => `<div class="hang-tru"><span>${e(TEN[k] || k)}</span><span class="chu-phu">${ShinApp.soVN(v, v % 1 ? 1 : 0)}</span></div>`).join('');
  },

  veTongQuan: function(t) {
    const e = ShinApp.esc;
    if (!t) return '<div class="trong">PTKH chưa trả số cho kỳ này.</div>';
    const toi = t.toi || {};
    const khoi = [['📝 Báo cáo của tôi', toi.bc], ['✅ Việc của tôi', toi.viec], ['📷 Minh chứng', toi.minhChung], ['🌙 Ngày nghỉ', toi.ngayNghi]]
      .map(([n, o]) => typeof o === 'number' ? `<div class="hang-tru"><span>${n}</span><span class="chu-phu">${ShinApp.soVN(o)}</span></div>`
        : (o && typeof o === 'object' && !Array.isArray(o) ? `<div class="hn-tieu"><span>${n}</span></div>${this.veSoPhang(o)}` : '')).join('');
    const cl = [t.to, t.phong].filter(x => x && typeof x === 'object');
    return `<div class="chu-phu">${e(t.nhan || t.tenKy || '')}</div>${khoi}${cl.map(c => `<div class="hn-tieu"><span>${e(c.ten || c.nhan || 'Chất lượng')}</span></div>${this.veSoPhang(c)}`).join('')}`;
  },

  vePTKH: function(d) {
    const e = ShinApp.esc, p = d.ptkh;
    if (!p) return d.live && d.loiPTKH ? `<div class="trong">⚠️ Chưa đọc thẳng được app PTKH: ${e(d.loiPTKH)}</div>` : '';
    const tt = p.tomTat || {}, THU = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const ngayVN = k => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(k || '')); return m ? `${THU[new Date(+m[1], +m[2] - 1, +m[3]).getDay()]} ${m[3]}/${m[2]}` : e(k); };
    return `
      <div class="hn-tieu"><span>ĐỌC THẲNG APP PTKH${p.phienBan ? ' · ' + e(p.phienBan) : ''}</span></div>
      <div class="hn-hero"><div class="tq-3so">
        <div class="tq-o"><div class="tq-so" style="color:${p.daNop || p.khongNopBC ? 'var(--c-green)' : 'var(--c-yellow)'}">${p.khongNopBC ? '–' : p.daNop ? 'Đã nộp' : 'Chưa nộp'}</div><div class="tq-nhan">Báo cáo hôm nay</div></div>
        <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${ShinApp.soVN((tt.dungHan14 || 0) + (tt.veSom14 || 0))}</div><div class="tq-nhan">Đúng hạn 14 ngày</div></div>
        <div class="tq-o"><div class="tq-so" style="color:${tt.tre14 ? 'var(--c-red)' : 'var(--c-gray)'}">${ShinApp.soVN(tt.tre14 || 0)}</div><div class="tq-nhan">Trễ 14 ngày</div></div>
      </div>${tt.choDuyet ? `<div class="chu-phu">⚡ Báo cáo chờ tôi duyệt: ${ShinApp.soVN(tt.choDuyet)}</div>` : ''}${tt.canBoSung14 ? `<div class="chu-phu">↩ Cần bổ sung: ${ShinApp.soVN(tt.canBoSung14)}</div>` : ''}</div>
      ${p.lichTuan.length ? `<div class="hn-tieu"><span>LỊCH LÀM VIỆC TUẦN NÀY</span></div><div class="hn-list">${p.lichTuan.map(n => `<div class="hang-tru"><span>${ngayVN(n.ngay)}</span><span class="chu-phu">${n.le ? '🎉 ' + e(n.le) : n.nghi ? '🌙 ' + e(n.nghi) + (n.buoi ? ' (' + e(n.buoi) + ')' : '') : e([n.vt, n.ca ? 'Ca ' + n.ca : ''].filter(Boolean).join(' · ') || '–')}</span></div>`).join('')}</div>` : ''}
      ${p.viec.length ? `<div class="hn-tieu"><span>VIỆC TUẦN NÀY · ${p.viec.length}</span></div><div class="hn-list">${p.viec.slice(0, 8).map(v => `<div class="hang-tru"><span>${e(v.noiDung || v.ten || v.tieuDe || '')}</span><span class="chu-phu">${e(v.trangThai || v.han || '')}</span></div>`).join('')}</div>` : ''}
      <div class="hn-tieu"><span>TỔNG QUAN</span></div>
      <div class="hang-chip" id="ptkhKy">${Object.keys(this.KY).map(k => `<button class="chip-chon ${k === this._ky ? 'dang-chon' : ''}" data-ky="${k}" onclick="ModulePTKH.doiKy('${k}')">${this.KY[k]}</button>`).join('')}</div>
      <div class="hn-list" id="ptkhTQ" style="padding:8px 12px">${this.veTongQuan(d.tongQuan)}</div>`;
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

      ${this.vePTKH(d)}

      <div class="luoi-o-so">
        ${[['📝', 'Báo cáo ngày'], ['✅', 'Duyệt báo cáo'], ['📊', 'Tổng quan phòng'], ['🗂️', 'Phân công'], ['💬', 'Khiếu nại'], ['🏅', 'Phiếu HTNV']]
          .map(([i, t]) => `<button class="o-so-loc" onclick="ModulePTKH.moApp()"><span>${i}</span><span>${t}</span></button>`).join('')}
      </div>

      <details class="tq-gon">
        <summary><span>ⓘ Kết nối với app PTKH gốc</span></summary>
        <p class="chu-phu">Số và việc ở đây do Hub kéo từ app PTKH (khoảng 90 phút / lần; bấm ↻ trên 🏠 Hôm nay để kéo ngay). Các nút mở thẳng app PTKH bằng token Hub của anh/chị – không cần link PTKH riêng. Từ v2.6.6 màn này đọc thẳng app PTKH (cổng webGoi) phần báo cáo, lịch tuần, việc và Tổng quan; thao tác ghi vẫn mở app PTKH.</p>
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
