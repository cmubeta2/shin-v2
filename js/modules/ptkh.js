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
    const d = this.tuHub(kq.data);
    // v2.7.5: Tổng quan tháng đọc THẲNG PTKH qua webGoi (L148) – lỗi thì báo riêng ở khối này, không thay bằng số mẫu
    const link = ShinApp.linkV1('PTKH') || d.linkThe || '';
    // v2.7.7: thêm 📝 Báo cáo 14 ngày (webLichSu) + 📅 Lịch tổ tuần này (webLichTo) – gọi song song, lỗi khối nào báo khối đó
    const [db, ls, lt] = await Promise.all([
      SHIN_API.goiPTKH(link, 'webDashboard', ['thang']),
      SHIN_API.goiPTKH(link, 'webLichSu', []),
      SHIN_API.goiPTKH(link, 'webLichTo', [''])
    ]);
    if (db.ok) d.dash = db.data || {}; else d.dashLoi = SHIN_API.moTaLoi(db);
    if (ls.ok) d.lichSu = Array.isArray(ls.data) ? ls.data : []; else d.lichSuLoi = SHIN_API.moTaLoi(ls);
    if (lt.ok) d.lichTo = lt.data || {}; else d.lichToLoi = SHIN_API.moTaLoi(lt);
    return { ok: true, data: d };
  },

  /** Khối 📊 Tổng quan tháng từ webDashboard(token, 'thang') của PTKH. */
  veDash: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    if (d.dashLoi) return `<div class="canh-bao-nguon loi">⚠️ Tổng quan PTKH: ${e(d.dashLoi)}</div>`;
    const x = d.dash;
    if (!x) return '';
    const k = x.thang || {}, toi = k.toi || {}, bc = toi.bc, viec = toi.viec || {}, mt = k.mucTieu || {};
    const ct = (mt.chiTieu || []).filter(c => c.coKH !== false);
    const pt = v => v === null || v === undefined ? '–' : ShinApp.ptVN(v);
    return `
      <div class="hn-tieu"><span>📊 ${e(k.tenKy || 'Tháng này')}${k.nhan ? ' · ' + e(k.nhan) : ''}${x.live === false ? ' (mẫu)' : ''}</span></div>
      <div class="luoi-o-so">
        ${bc ? `<div class="o-so-loc"><b style="color:var(--c-green)">${so(bc.dungHan || 0)}/${so(bc.tong || 0)}</b>BC đúng hạn</div>
        <div class="o-so-loc"><b style="color:${bc.tre || bc.khongNop ? 'var(--c-red)' : 'var(--c-gray)'}">${so((bc.tre || 0) + (bc.khongNop || 0))}</b>BC trễ / không nộp</div>` : ''}
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(viec.dangLam || 0)}</b>Việc đang làm</div>
        <div class="o-so-loc"><b style="color:${viec.quaHan ? 'var(--c-red)' : 'var(--c-green)'}">${so(viec.quaHan || 0)}</b>Việc quá hạn</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(viec.xong || 0)}</b>Việc xong</div>
        ${x.chuoiDH ? `<div class="o-so-loc"><b>🔥 ${so(Number(x.chuoiDH) || 0)}</b>Chuỗi nộp đúng hạn</div>` : ''}
      </div>
      ${ct.length ? `<div class="the">
        <div class="chu-phu">Mục tiêu · thời gian đã qua ${pt(mt.ptThoiGian)}${mt.ngayConLai !== undefined ? ' · còn ' + so(mt.ngayConLai) + ' ngày' : ''}</div>
        ${ct.map(c => `
          <div class="hang-tru"><span>${e(c.ten)}</span><b style="color:${this.MAU_DEN[c.den] || 'var(--c-blue)'}">${pt(c.pt)}</b></div>
          <div class="chu-phu">${so(c.th || 0)} / ${so(c.kh || 0)} ${e(c.dvt || '')}${c.duBao !== null && c.duBao !== undefined ? ' · dự báo cuối kỳ ' + pt(c.duBao) : ''}</div>
          <div class="thanh-tien"><div style="width:${Math.max(0, Math.min(100, Math.round((Number(c.pt) || 0) * 100)))}%"></div></div>`).join('')}
      </div>` : ''}`;
  },

  /** v2.7.7 – 📝 Báo cáo 14 ngày gần nhất của tôi (webLichSu qua webGoi, chỉ đọc). */
  veLichSu: function(d) {
    const e = ShinApp.esc, mau = d.live ? '' : ' (mẫu)';
    if (d.lichSuLoi) return `<div class="canh-bao-nguon loi">⚠️ Báo cáo PTKH: ${e(d.lichSuLoi)}</div>`;
    if (!Array.isArray(d.lichSu)) return '';
    const ds = d.lichSu.slice(0, 7);
    const tre = x => x.dungHan === false || /trễ|không/i.test(String(x.dungHan || ''));
    const badge = x => /trả|bổ sung/i.test(x.trangThaiDuyet || '') ? '<span class="badge do">' + e(x.trangThaiDuyet) + '</span>'
      : /duyệt|đạt/i.test(x.trangThaiDuyet || '') && !/chờ/i.test(x.trangThaiDuyet) ? '<span class="badge xanh">' + e(x.trangThaiDuyet) + '</span>'
      : x.trangThaiDuyet ? '<span class="badge vang">' + e(x.trangThaiDuyet) + '</span>' : '';
    return `
      <div class="hn-tieu"><span>📝 BÁO CÁO 14 NGÀY CỦA TÔI · ${d.lichSu.length}${mau}</span></div>
      ${ds.length ? `<div class="hn-list">${ds.map(x => `
        <div class="hn-dong" onclick="ModulePTKH.moApp()">
          <div class="dong-content">
            <div class="dong-title">${e([x.thu, x.ngay].filter(Boolean).join(' '))}${x.ca ? ' · ' + e(x.ca) : ''}${tre(x) ? ' · <span style="color:var(--c-red)">trễ hạn</span>' : ''}</div>
            <div class="dong-sub">${e((x.so || []).slice(0, 4).join(' · ') || 'Không có số')}${x.ghiChuDuyet ? ' · ' + e(x.ghiChuDuyet) : ''}</div>
          </div>
          <div class="dong-meta">${badge(x)}<span class="dong-arrow">›</span></div>
        </div>`).join('')}</div>` : '<div class="trong">14 ngày qua anh/chị chưa có báo cáo nào.</div>'}`;
  },

  /** v2.7.7 – 📅 Lịch tổ tuần này (webLichTo, chỉ đọc): mỗi ngày 1 dòng – ca / vị trí của tôi + ai nghỉ (không lý do). */
  veLichTo: function(d) {
    const e = ShinApp.esc, mau = d.live ? '' : ' (mẫu)';
    if (d.lichToLoi) return `<div class="canh-bao-nguon loi">⚠️ Lịch tổ PTKH: ${e(d.lichToLoi)}</div>`;
    const lt = d.lichTo;
    if (!lt || !Array.isArray(lt.nv)) return '';
    const toi = lt.nv.find(n => n.toi) || { ngay: [] };
    const soNgay = Math.max(0, ...lt.nv.map(n => (n.ngay || []).length));
    const THU = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dong = [], trung = this.doTrungTo(lt);
    for (let i = 0; i < soNgay; i++) {
      const o = (toi.ngay || [])[i] || {};
      const nghi = lt.nv.filter(n => ((n.ngay || [])[i] || {}).nghi).map(n => n.ten);
      const cua = o.nghi ? 'Nghỉ' : [o.ca, o.vt].filter(Boolean).join(' · ') || '–';
      const t = trung.find(x => x.i === i);
      dong.push(`<div class="hang-tru"><span>${t ? '⚠️ ' : ''}${THU[i] || ''} ${e(String(o.ngay || ''))}${o.le ? ' 🎌' : ''}</span><b>${e(cua)}</b></div>
        ${nghi.length ? `<div class="chu-phu">Nghỉ: ${e(nghi.join(', '))}${t ? ` – còn ${t.lam}/${t.tong} người có ca` : ''}</div>` : ''}`);
    }
    const canh = trung.length ? `<div class="canh-bao-nguon">⚠️ Trùng nghỉ cả tổ: ${trung.map(t => `${THU[t.i] || ''} ${e(String(t.ngay))} (${t.nghi} nghỉ, còn ${t.lam}/${t.tong})`).join(' · ')} – tổ trưởng xem lại lịch trong app PTKH.</div>` : '';
    return `
      <div class="hn-tieu"><span>📅 LỊCH TỔ ${e(lt.to || '')} · TUẦN ${e(String(lt.thuHai || ''))}${mau}</span></div>
      ${canh}
      ${dong.length ? `<div class="the">${dong.join('')}</div>` : '<div class="trong">Chưa có lịch tổ tuần này.</div>'}`;
  },

  /** THUẦN – v2.9.7: dò trùng nghỉ cả tổ trên webLichTo (chỉ nghỉ đã duyệt). Ngày bị đánh dấu khi ≥ 2 người nghỉ
   *  hoặc số người còn ca < nửa tổ (làm tròn lên). Bỏ ngày lễ và tổ < 2 người. ➜ [{i, ngay, nghi, lam, tong}] */
  doTrungTo: function(lt) {
    const ds = (lt && Array.isArray(lt.nv)) ? lt.nv : [], tong = ds.length, kq = [];
    if (tong < 2) return kq;
    const soNgay = Math.max(0, ...ds.map(n => (n.ngay || []).length));
    for (let i = 0; i < soNgay; i++) {
      const o = ds.map(n => (n.ngay || [])[i] || {});
      if (o.some(x => x.le)) continue;
      const nghi = o.filter(x => x.nghi).length, lam = o.filter(x => !x.nghi && x.ca).length;
      if (nghi && (nghi >= 2 || lam < Math.ceil(tong / 2))) kq.push({ i, ngay: (o.find(x => x.ngay) || {}).ngay || '', nghi, lam, tong });
    }
    return kq;
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

      ${this.veDash(d.live ? d : Object.assign({}, d, { dash: d.dash ? Object.assign({ live: false }, d.dash) : null }))}
      ${this.veLichSu(d)}
      ${this.veLichTo(d)}

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
        <p class="chu-phu">Số và việc ở đây do Hub kéo từ app PTKH (khoảng 90 phút / lần; bấm ↻ trên 🏠 Hôm nay để kéo ngay). Các nút mở thẳng app PTKH bằng token Hub của anh/chị – không cần link PTKH riêng. Khối 📊 Tổng quan tháng (v2.7.5), 📝 Báo cáo 14 ngày và 📅 Lịch tổ (v2.7.7) đọc thẳng app PTKH qua cổng webGoi – chỉ đọc; nộp / sửa vẫn mở app PTKH.</p>
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
