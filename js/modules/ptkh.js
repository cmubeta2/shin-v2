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
    // v2.9.8: + webLichSuThang tháng này & tháng trước (tuần ISO vắt tháng) cho 🧭 Nhịp tháng (NTC M5.5 · cảm nhận M5.6)
    const bay = new Date(), th = this.thangKhoa(bay), thTruoc = this.thangKhoa(new Date(bay.getFullYear(), bay.getMonth() - 1, 1));
    // v2.13.7: + webLichNghiNV (ngày lễ / đã xin / hạn tuần sau) cho 🗓️ Xin nghỉ
    const [db, ls, lt, lsN, lsT, lnv] = await Promise.all([
      SHIN_API.goiPTKH(link, 'webDashboard', ['thang']),
      SHIN_API.goiPTKH(link, 'webLichSu', []),
      SHIN_API.goiPTKH(link, 'webLichTo', ['']),
      SHIN_API.goiPTKH(link, 'webLichSuThang', [th]),
      SHIN_API.goiPTKH(link, 'webLichSuThang', [thTruoc]),
      SHIN_API.goiPTKH(link, 'webLichNghiNV', [])
    ]);
    if (lnv.ok) d.lichNghi = lnv.data || {}; else d.lichNghiLoi = SHIN_API.moTaLoi(lnv);
    d.thang = th;
    if (lsN.ok) d.lsThang = (Array.isArray(lsN.data) ? lsN.data : []).concat(lsT.ok && Array.isArray(lsT.data) ? lsT.data : []);
    else d.lsThangLoi = SHIN_API.moTaLoi(lsN);
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

  /** THUẦN. Date ➜ 'yyyy-MM' (giờ máy). */
  thangKhoa: function(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0'); },

  /** THUẦN – v2.9.8: báo cáo của tôi (khuôn webLichSuThang, có thể gồm tháng trước) ➜ nhịp tháng `thang`.
   *  M5.5 NTC giống phatNTCTuan_ / demTruNTCThang_ của PTKH: ngày Ca NTC đếm theo tuần ISO (T2–CN), ngày trùng tính 1,
   *  lần ≥ 4 trong tuần ➜ trừ ½ công, tính vào tháng của ngày vượt. Bỏ báo cáo đã hủy / thử.
   *  M5.6: cảm nhận 1–5★ (camNhan) trung bình + phân bố trong tháng.
   *  ➜ {ntc:[{ngay, lan, tru}], tuanNay, truCong, cam:{tb, n, pb[5]}, bc:{tong, dung, tre}} */
  nhipThang: function(ds, thang, homNay) {
    const hop = (Array.isArray(ds) ? ds : []).filter(r => r && /^\d{4}-\d{2}-\d{2}$/.test(String(r.khoa || '')) && !/hủy|thử/i.test(String(r.trangThaiDuyet || '')));
    const khoa = d => this.thangKhoa(d) + '-' + String(d.getDate()).padStart(2, '0');
    const thu2 = k => { const t = new Date(k + 'T00:00:00'); t.setDate(t.getDate() + 1 - (t.getDay() || 7)); return khoa(t); };
    const ngayNTC = [...new Set(hop.filter(r => /NTC/i.test(String(r.ca || ''))).map(r => r.khoa))].sort();
    const dem = {}, ntc = [];
    ngayNTC.forEach(k => { const w = thu2(k); dem[w] = (dem[w] || 0) + 1; if (k.slice(0, 7) === thang) ntc.push({ ngay: k, lan: dem[w], tru: dem[w] > 3 ? 0.5 : 0 }); });
    const trongThang = hop.filter(r => r.khoa.slice(0, 7) === thang);
    const cam = trongThang.map(r => Number(r.camNhan)).filter(v => v >= 1 && v <= 5), pb = [0, 0, 0, 0, 0];
    cam.forEach(v => pb[v - 1]++);
    return {
      ntc, tuanNay: dem[thu2(khoa(homNay || new Date()))] || 0, truCong: ntc.reduce((a, x) => a + x.tru, 0),
      cam: { n: cam.length, tb: cam.length ? cam.reduce((a, v) => a + v, 0) / cam.length : null, pb },
      bc: { tong: trongThang.length, dung: trongThang.filter(r => r.dungHan === true || r.dungHan === 'Đúng hạn').length,
        tre: trongThang.filter(r => r.dungHan === false || /trễ|không/i.test(String(r.dungHan || ''))).length }
    };
  },

  /** v2.9.8 – 🧭 Nhịp tháng của tôi (M5.5 NTC · M5.6 cảm nhận sau ca) từ webLichSuThang, chỉ đọc. */
  veNhip: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN, mau = d.live ? '' : ' (mẫu)';
    if (d.lsThangLoi) return `<div class="canh-bao-nguon loi">⚠️ Nhịp tháng PTKH: ${e(d.lsThangLoi)}</div>`;
    if (!Array.isArray(d.lsThang)) return '';
    const th = d.thang || this.thangKhoa(new Date());
    const n = this.nhipThang(d.lsThang, th, d.live ? new Date() : new Date(th + '-06T00:00:00')), c = n.cam;
    const vuot = n.ntc.filter(x => x.tru);
    const sao = c.tb === null ? '–' : c.tb.toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + '★';
    const mauCam = c.tb === null ? 'var(--c-gray)' : c.tb >= 4 ? 'var(--c-green)' : c.tb >= 3 ? 'var(--c-yellow)' : 'var(--c-red)';
    const dm = k => k.slice(8) + '/' + k.slice(5, 7);
    return `
      <div class="hn-tieu"><span>🧭 NHỊP THÁNG ${e(th.slice(5) + '/' + th.slice(0, 4))} CỦA TÔI${mau}</span></div>
      ${vuot.length ? `<div class="canh-bao-nguon">⚠️ Ca NTC vượt 3 lần/tuần: ${vuot.map(x => e(dm(x.ngay)) + ' (lần ' + x.lan + ')').join(' · ')} – trừ ${e(String(n.truCong).replace('.', ','))} ngày công khi xuất TC-NS.</div>` : ''}
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:${n.tuanNay > 3 ? 'var(--c-red)' : n.tuanNay === 3 ? 'var(--c-yellow)' : 'var(--c-blue)'}">${so(n.tuanNay)}/3</b>Ca NTC tuần này</div>
        <div class="o-so-loc"><b style="color:${n.truCong ? 'var(--c-red)' : 'var(--c-green)'}">${e(String(n.truCong).replace('.', ','))}</b>Ngày công bị trừ (NTC)</div>
        <div class="o-so-loc"><b style="color:${mauCam}">${sao}</b>Cảm nhận sau ca · ${so(c.n)} lần</div>
        <div class="o-so-loc"><b style="color:${n.bc.tre ? 'var(--c-red)' : 'var(--c-green)'}">${so(n.bc.dung)}/${so(n.bc.tong)}</b>BC đúng hạn tháng</div>
      </div>
      ${c.n ? `<div class="the">${[5, 4, 3, 2, 1].map(v => `<div class="hang-tru"><span>${'★'.repeat(v)}</span><b>${so(c.pb[v - 1])}</b></div>
        <div class="thanh-tien"><div style="width:${Math.round(c.pb[v - 1] * 100 / c.n)}%"></div></div>`).join('')}
        <div class="chu-phu">Chỉ của riêng anh/chị – chỉ số tinh thần cả tổ cần cổng tổng hợp ẩn danh của PTKH.</div></div>` : ''}`;
  },

  /* ===== v2.13.7 – 🗓️ XIN NGHỈ (đối chiếu P3 #1): gửi đơn thẳng vào PTKH qua webGoi ➜ webGuiNghiPhep (đã có trong HAM_WEBGOI_).
   * Loại gửi mới theo v1 (LOAI_NGHI_CHON_): Lịch nghỉ tuần (chọn ngày trong 4 tuần tới) · Nghỉ ốm (từ ngày – đến ngày, buổi, lý do).
   * Đổi ca (chọn người + ca) vẫn mở app PTKH. Máy chủ PTKH là trọng tài (hạn 15h thứ Sáu, tuần đã chốt, mốc giấy ốm…). */
  BUOI: ['Cả ngày', 'Sáng', 'Chiều'],
  THU: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],

  /** THUẦN – bản sao ngayCacTuanToi (17_NghiLe.gs): 7×soTuan ngày bắt đầu từ thứ Hai tuần sau, khóa 'yyyy-mm-dd'. */
  cacNgayTuanToi: function(homNay, soTuan) {
    const [y, m, dd] = String(homNay).split('-').map(Number), d = new Date(y, m - 1, dd), thu = d.getDay() || 7, kq = [];
    for (let i = 0; i < 7 * (soTuan || 4); i++) kq.push(this.khoaNgay(new Date(y, m - 1, dd + 8 - thu + i)));
    return kq;
  },
  khoaNgay: function(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },

  /** THUẦN – kiểm đơn như loiNghiPhep của PTKH (phần không cần sheet) ➜ {loi} | {p}. hetHanTuanSau: tuần đầu bị khóa. */
  kiemDonNghi: function(m, homNay, hetHanTuanSau) {
    const lyDo = String(m.lyDo || '').trim();
    if (lyDo.length > 300) return { loi: 'Lý do tối đa 300 ký tự.' };
    if (/(^|\D)(\+?84|0)\d{9}(\D|$)/.test(lyDo.replace(/[ .-]/g, ''))) return { loi: 'Không ghi số điện thoại vào lý do (KHONG_DUA_VAO).' };
    if (m.loai === 'Lịch nghỉ tuần') {
      const tuan = this.cacNgayTuanToi(homNay, 4), ds = (m.ngay || []).slice().sort();
      if (!ds.length) return { loi: 'Bấm chọn ít nhất 1 ngày nghỉ.' };
      for (let i = 0; i < ds.length; i++) {
        if (tuan.indexOf(ds[i]) < 0) return { loi: 'Ngày ' + ds[i] + ' không thuộc 4 tuần tới – tải lại rồi chọn lại.' };
        if (ds.indexOf(ds[i]) !== i) return { loi: 'Một ngày chỉ chọn 1 lần.' };
        if (hetHanTuanSau && tuan.indexOf(ds[i]) < 7) return { loi: 'Đã quá hạn đăng ký lịch nghỉ tuần sau – liên hệ lãnh đạo phòng.' };
      }
      return { p: { loai: 'Lịch nghỉ tuần', ngay: ds, lyDo: lyDo } };
    }
    if (m.loai !== 'Nghỉ ốm') return { loi: 'Chọn loại đơn.' };
    const tu = String(m.tuNgay || ''), den = String(m.denNgay || m.tuNgay || ''), buoi = m.buoi || 'Cả ngày';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(tu)) return { loi: 'Chọn ngày bắt đầu nghỉ.' };
    if (!/^\d{4}-\d{2}-\d{2}$/.test(den)) return { loi: 'Ngày kết thúc không hợp lệ.' };
    if (den < tu) return { loi: 'Ngày kết thúc phải từ ngày bắt đầu trở đi.' };
    const soNgay = Math.round((new Date(den) - new Date(tu)) / 864e5) + 1;
    if (soNgay > 31) return { loi: 'Mỗi giấy nghỉ ốm tối đa 31 ngày – dài hơn tách làm nhiều đơn.' };
    if (this.BUOI.indexOf(buoi) < 0) return { loi: 'Chọn buổi nghỉ.' };
    if (buoi !== 'Cả ngày' && den !== tu) return { loi: 'Nghỉ nửa buổi chỉ chọn 1 ngày.' };
    if (!lyDo) return { loi: 'Ghi lý do ngắn gọn (không ghi chẩn đoán, số giấy tờ).' };
    return { p: { loai: 'Nghỉ ốm', tuNgay: tu, denNgay: den, buoi: buoi, lyDo: lyDo } };
  },

  veXinNghi: function(d) {
    const e = ShinApp.esc, mau = d.live ? '' : ' (mẫu)';
    if (d.lichNghiLoi) return `<div class="hn-tieu"><span>🗓️ XIN NGHỈ</span></div><div class="canh-bao-nguon loi">⚠️ Lịch nghỉ PTKH: ${e(d.lichNghiLoi)} – xin nghỉ ở app PTKH.</div>`;
    const ln = d.lichNghi;
    if (!ln) return '';
    const f = this._fn || (this._fn = { loai: 'Lịch nghỉ tuần', ngay: [] });
    const hn = this.khoaNgay(new Date()), ds = this.cacNgayTuanToi(hn, ln.soTuan || 4), le = ln.le || {}, daXin = ln.daXin || {};
    const tuan = [];
    for (let i = 0; i < ds.length; i += 7) tuan.push(ds.slice(i, i + 7));
    const chip = (k, iTuan) => {
      const [y, m, dd] = k.split('-').map(Number);
      const thu = this.THU[new Date(y, m - 1, dd).getDay()];
      const xin = daXin[k];
      const isLe = !!le[k];
      const isKhoa = isLe || !!xin || (iTuan === 0 && ln.hanTuanSau === false);
      const isChon = f.ngay.indexOf(k) >= 0;
      const ddStr = String(dd).padStart(2, '0');
      const mStr = String(m).padStart(2, '0');
      const tt = isLe ? ('Nghỉ lễ: ' + le[k]) : xin ? ('Đã xin: ' + (xin.loai || xin)) : (iTuan === 0 && ln.hanTuanSau === false) ? 'Đã quá hạn đăng ký tuần sau' : ('Chọn nghỉ ' + thu + ' ' + ddStr + '/' + mStr);
      let cls = 'chip-chon xn-chip';
      if (isChon) cls += ' dang-chon';
      if (isLe) cls += ' ngay-le';
      if (xin) cls += ' da-xin';
      if (isKhoa && !isLe && !xin) cls += ' bi-khoa';

      return `<button type="button" class="${cls}" ${isKhoa ? 'disabled' : ''}
        title="${e(tt)}" onclick="ModulePTKH.chonNgayNghi('${k}')">
        <span class="xn-chip-thu">${thu}</span>
        <span class="xn-chip-ngay">${ddStr}/${mStr}${isLe ? ' 🎌' : xin ? ' ✓' : ''}</span>
      </button>`;
    };
    const don = Array.isArray(d.donNghi) ? d.donNghi.slice(0, 5) : [];
    const soNgayChon = (f.ngay || []).length;
    const dsNgayChon = (f.ngay || []).slice().sort().map(k => {
      const [y, m, dd] = k.split('-').map(Number);
      const thu = this.THU[new Date(y, m - 1, dd).getDay()];
      return `${thu} ${String(dd).padStart(2, '0')}/${String(m).padStart(2, '0')}`;
    }).join(', ');

    return `
      <div class="hn-tieu"><span>🗓️ XIN NGHỈ${mau}</span></div>
      <div class="the xn-hop">
        <div class="xn-loai">${['Lịch nghỉ tuần', 'Nghỉ ốm'].map(l => `<button type="button" class="chip-chon xn-tab-loai${f.loai === l ? ' dang-chon' : ''}" onclick="ModulePTKH.doiLoaiNghi('${l}')">${l === 'Nghỉ ốm' ? '🤒 ' : '📅 '}${l}</button>`).join('')}</div>
        ${f.loai === 'Lịch nghỉ tuần' ? `
          <div class="chu-phu xn-thong-tin">Chọn ngày nghỉ trong ${ln.soTuan || 4} tuần tới · Hạn đăng ký tuần sau: <b>${e(ln.hanChu || '15h00 thứ Sáu')}</b>${ln.hanTuanSau === false ? ' – <b class="xn-canh-bao-khoa">đã quá hạn tuần sau</b>' : ''}${ln.tenTo ? ' · Tổ ' + e(ln.tenTo) : ''}</div>
          <div class="xn-chu-giai">
            <span class="xn-cg-item"><span class="xn-cg-dot dang-chon"></span> Đang chọn</span>
            <span class="xn-cg-item"><span class="xn-cg-dot da-xin">✓</span> Đã xin</span>
            <span class="xn-cg-item"><span class="xn-cg-dot ngay-le">🎌</span> Lễ</span>
            <span class="xn-cg-item"><span class="xn-cg-dot bi-khoa">✕</span> Khóa</span>
          </div>
          ${tuan.map((t, i) => `
            <div class="xn-tuan">
              <div class="xn-tuan-dau">
                <span class="xn-tuan-ten">Tuần ${i + 1}</span>
                <span class="xn-tuan-ngay">${e(t[0].split('-').reverse().slice(0, 2).join('/'))} – ${e(t[6].split('-').reverse().slice(0, 2).join('/'))}</span>
                ${i === 0 && ln.hanTuanSau === false ? '<span class="badge do xn-badge-nho">Đã khóa</span>' : ''}
              </div>
              <div class="xn-ngay-luoi">${t.map(k => chip(k, i)).join('')}</div>
            </div>
          `).join('')}
          ${Object.keys(ln.canhBaoTo || {}).length ? `<div class="canh-bao-nguon xn-canh-bao">⚠️ Ngày tổ đã đủ người nghỉ: ${Object.keys(ln.canhBaoTo).map(k => e(k.split('-').reverse().slice(0, 2).join('/'))).join(', ')} – vẫn gửi được, lãnh đạo phòng cân nhắc.</div>` : ''}
          <div class="xn-dem-hop${soNgayChon ? ' co-chon' : ''}">
            <div class="xn-dem-dong">
              <span class="xn-dem-nhan">🗓️ Đã chọn nghỉ:</span>
              <b class="xn-dem-so">${soNgayChon} ngày</b>
            </div>
            ${soNgayChon ? `<div class="xn-dem-ds">${e(dsNgayChon)}</div>` : '<div class="xn-dem-trong">Chạm vào các ô ngày ở lịch trên để chọn ngày nghỉ</div>'}
          </div>
          <label class="chu-phu xn-nhan-input" for="xnLyDo">Ghi chú (không bắt buộc)</label>` : `
          <div class="xn-hang">
            <div><label class="chu-phu xn-nhan-input" for="xnTu">Từ ngày</label><input id="xnTu" type="date" class="form-input" value="${e(f.tuNgay || hn)}"></div>
            <div><label class="chu-phu xn-nhan-input" for="xnDen">Đến ngày</label><input id="xnDen" type="date" class="form-input" value="${e(f.denNgay || f.tuNgay || hn)}"></div>
          </div>
          <div class="xn-hang-buoi">
            <label class="chu-phu xn-nhan-input" for="xnBuoi">Buổi</label>
            <select id="xnBuoi" class="form-input">${this.BUOI.map(b => `<option${(f.buoi || 'Cả ngày') === b ? ' selected' : ''}>${b}</option>`).join('')}</select>
          </div>
          <label class="chu-phu xn-nhan-input" for="xnLyDo">Lý do (ngắn gọn – không ghi chẩn đoán, số giấy tờ)</label>`}
        <textarea id="xnLyDo" class="form-input" rows="2" maxlength="300" placeholder="Thêm ghi chú nếu cần...">${e(f.lyDo || '')}</textarea>
        <button class="btn-primary xn-btn-gui" id="xnNut" onclick="ModulePTKH.guiNghi(this)">📤 Gửi đơn vào PTKH</button>
        <button class="btn-secondary xn-btn-phu" onclick="ModulePTKH.moApp()">🔁 Đổi ca – mở app PTKH</button>
        <div class="chu-phu xn-luu-y">
          <span class="xn-luu-y-icon">ℹ️</span>
          <span>Gửi sau 6 giây (có Hoàn tác) · đơn chờ lãnh đạo phòng duyệt như gửi ở app PTKH.</span>
        </div>
      </div>
      ${don.length ? `
        <div class="hn-tieu"><span>📋 ĐƠN ĐÃ GỬI GẦN ĐÂY · ${don.length}</span></div>
        <div class="xn-ds-don">${don.map(x => `
          <div class="xn-don-the" onclick="ModulePTKH.moApp()" title="Bấm để mở app PTKH xem chi tiết">
            <div class="xn-don-icon">${x.loai === 'Nghỉ ốm' ? '🤒' : '📅'}</div>
            <div class="xn-don-nd">
              <div class="xn-don-hang1">
                <span class="xn-don-loai">${e(x.loai)}</span>
                <span class="xn-don-ngay">${e(x.tuHien || x.tu || '')}${x.denHien ? ' – ' + e(x.denHien) : ''}</span>
              </div>
              <div class="xn-don-hang2">
                <span class="xn-don-ma">${e(x.ma || '')}</span>
                ${x.buoi && x.buoi !== 'Cả ngày' ? `<span class="xn-don-dot">·</span><span>${e(x.buoi)}</span>` : ''}
                ${x.ghiChu ? `<span class="xn-don-dot">·</span><span class="xn-don-gc">${e(x.ghiChu)}</span>` : ''}
              </div>
            </div>
            <div class="xn-don-trangthai">
              <span class="badge ${/Đồng ý/.test(x.trangThai) ? 'xanh' : /Không|hủy/.test(x.trangThai) ? 'do' : 'vang'}">${e(x.trangThai || 'Chờ duyệt')}</span>
              <span class="dong-arrow">›</span>
            </div>
          </div>`).join('')}</div>` : ''}`;
  },

  _luuForm: function() {
    const f = this._fn || (this._fn = { loai: 'Lịch nghỉ tuần', ngay: [] }), g = id => { const el = document.getElementById(id); return el ? el.value : undefined; };
    if (g('xnLyDo') !== undefined) f.lyDo = g('xnLyDo');
    if (g('xnTu') !== undefined) { f.tuNgay = g('xnTu'); f.denNgay = g('xnDen'); f.buoi = g('xnBuoi'); }
    return f;
  },
  _veLai: function() { const c = document.getElementById('appContent'); if (c && this._d) this.render(c, this._d); },
  doiLoaiNghi: function(l) { this._luuForm().loai = l; this._veLai(); },
  chonNgayNghi: function(k) {
    const f = this._luuForm(), i = f.ngay.indexOf(k);
    if (i >= 0) f.ngay.splice(i, 1); else f.ngay.push(k);
    this._veLai();
  },

  /** Kiểm ➜ tường lửa M9.5 ➜ Toast Hoàn tác 6s ➜ webGoi webGuiNghiPhep(token, p) đúng 1 lần (khóa _dangGuiNghi). Demo: không gửi. */
  guiNghi: function(nut) {
    const f = this._luuForm(), ln = (this._d && this._d.lichNghi) || {};
    const kq = this.kiemDonNghi(f, this.khoaNgay(new Date()), ln.hanTuanSau === false);
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    const vp = SHIN_API.soatKhongDuaVao(kq.p);
    if (vp) return ShinApp.toast(`Ô "${vp.truong}" có ${vp.loai} – xóa đi rồi gửi lại (KHONG_DUA_VAO).`, 'error');
    if (!this._d || !this._d.live || !SHIN_API.layToken()) return ShinApp.toast('Đang ở Demo – không gửi đơn. Đăng nhập Hub để gửi thật.', 'info');
    if (this._dangGuiNghi) return;
    this._dangGuiNghi = true;
    const link = ShinApp.linkV1('PTKH') || this._d.linkThe || '';
    const khoaNut = on => { if (nut && nut.isConnected) { nut.disabled = on; nut.innerHTML = on ? '⏳ Chờ 6 giây…' : '📤 Gửi đơn vào PTKH'; } };
    const moTa = kq.p.loai === 'Nghỉ ốm' ? 'giấy nghỉ ốm ' + kq.p.tuNgay.split('-').reverse().join('/') : 'lịch nghỉ ' + kq.p.ngay.length + ' ngày';
    ShinApp.hanhDongHoanTac('Sẽ gửi ' + moTa + ' vào PTKH.', {
      lamTruoc: () => khoaNut(true),
      traLai: () => { this._dangGuiNghi = false; khoaNut(false); },
      thucHien: async () => {
        const r = await SHIN_API.goiPTKH(link, 'webGuiNghiPhep', [kq.p]);
        if (!r.ok) throw new Error('Chưa gửi được: ' + SHIN_API.moTaLoi(r) + ' – kiểm danh sách đơn ở app PTKH trước khi gửi lại.');
        const x = r.data || {}, phep = x.phep || {};
        this._dangGuiNghi = false;
        this._fn = { loai: f.loai, ngay: [] };
        this._d.donNghi = Array.isArray(phep.cuaToi) ? phep.cuaToi : [];
        if (phep.daXin) this._d.lichNghi = Object.assign({}, this._d.lichNghi, { daXin: phep.daXin, hanTuanSau: phep.hanTuanSau, canhBaoTo: phep.canhBaoTo || {} });
        ShinApp.toast(x.tin || 'Đã gửi đơn.', x.canhBao ? 'warn' : 'success');
        this._veLai();
      }
    });
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
      ${this.veNhip(d)}
      ${this.veXinNghi(d)}

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
        <p class="chu-phu">Số và việc ở đây do Hub kéo từ app PTKH (khoảng 90 phút / lần; bấm ↻ trên 🏠 Hôm nay để kéo ngay). Các nút mở thẳng app PTKH bằng token Hub của anh/chị – không cần link PTKH riêng. Khối 📊 Tổng quan tháng (v2.7.5), 📝 Báo cáo 14 ngày và 📅 Lịch tổ (v2.7.7), 🧭 Nhịp tháng (v2.9.8 – webLichSuThang) đọc thẳng app PTKH qua cổng webGoi – chỉ đọc. 🗓️ Xin nghỉ (v2.13.7) gửi đơn Lịch nghỉ tuần / Nghỉ ốm qua webGuiNghiPhep; báo cáo ngày, đổi ca, duyệt vẫn mở app PTKH.</p>
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
