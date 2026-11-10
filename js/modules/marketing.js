/**
 * SHIN v2 – Mảng 8: Tăng trưởng & Marketing (v2.11.0)
 * M8.1 Lịch nội dung 4 tuần đa kênh (Facebook · TikTok · Zalo OA · YouTube) theo tầng phễu TOFU / MOFU / BOFU.
 * M8.2 Xưởng mẫu viết bài: khuôn PAS / AIDA / 4P / kịch bản video (js/modules/mau_marketing.js – agy soạn, phiếu 11080154_V2_M8)
 *      ➜ điền chỗ trống {{...}}, xem trước, kiểm từ cấm quảng cáo y tế + tường lửa M9.5. KHÔNG gọi AI.
 * M8.4 Chốt chặn người duyệt: Nháp ➜ Chờ duyệt ➜ (Duyệt, Hoàn tác 6s) Sẵn sàng đăng | Trả lại. Chỉ bài Sẵn sàng đăng mới sao chép được.
 * Lưu trên máy này (localStorage shin_mkt_bai). Còn chờ v1: cổng gửi bài vào Phê duyệt 0B + đăng tự động – chưa có máy chủ.
 */

const ModuleMarketing = {
  ma: 'marketing',
  ten: 'Marketing & Nội dung',
  bieuTuong: '📣',
  paletteMacDinh: 'growth',
  mayChu: null,
  KHOA: 'shin_mkt_bai',
  _loc: 'tat',        // lọc tầng phễu
  _bai: null,         // bài đang mở trong xưởng: {id, khuonMa, chude}

  TRANG_THAI: { nhap: 'Nháp', cho_duyet: 'Chờ duyệt', san_sang: 'Sẵn sàng đăng', tra_lai: 'Trả lại' },

  // ===== THUẦN =====
  /** Điền {{bien}} bằng giá trị; ô chưa nhập giữ nguyên {{bien}} để dễ thấy. */
  dienKhuon: function(than, bien) {
    bien = bien || {};
    return String(than || '').replace(/\{\{(\w+)\}\}/g, (m, k) => { const v = String(bien[k] || '').trim(); return v || m; });
  },
  /** Danh sách tên biến còn trống của khuôn. */
  thieuBien: function(khuon, bien) {
    bien = bien || {};
    return ((khuon && khuon.bien) || []).map(b => b.replace(/[{}]/g, '')).filter(k => !String(bien[k] || '').trim());
  },
  /** Từ cấm quảng cáo dịch vụ y tế (mảng phongkham / ksk): khẳng định tuyệt đối, cam kết khỏi bệnh. Trả mảng cụm vi phạm. */
  kiemTuCam: function(chu, mang) {
    if (mang !== 'phongkham' && mang !== 'ksk') return [];
    const CAM = [/duy nhất/i, /tốt nhất/i, /số một|số 1\b|số1\b/i, /hàng đầu/i, /\bnhất\b/i, /100\s*%/, /cam kết\s+(chữa\s+)?khỏi/i, /khỏi hẳn|khỏi hoàn toàn|dứt điểm/i, /tuyệt đối/i];
    const s = String(chu || ''), ra = [];
    CAM.forEach(re => { const m = s.match(re); if (m && ra.indexOf(m[0].toLowerCase()) < 0) ra.push(m[0].toLowerCase()); });
    return ra.filter(x => !ra.some(y => y !== x && y.indexOf(x) >= 0));
  },
  /** Máy trạng thái chốt chặn M8.4 ➜ trạng thái mới hoặc null (không hợp lệ). */
  chuyen: function(cu, hanhDong) {
    const B = { nhap: { gui: 'cho_duyet' }, tra_lai: { gui: 'cho_duyet' }, cho_duyet: { duyet: 'san_sang', tra: 'tra_lai', rut: 'nhap' }, san_sang: { sua: 'nhap' } };
    return ((B[cu || 'nhap'] || {})[hanhDong]) || null;
  },

  /** THUẦN – v2.11.1 M8.3 Smart Lead Dispatcher: 1 lead mới (webCRM.leadMoi / Demo) ➜ {luong, module, nhan, lyDo}.
   *  Thứ tự: KSK doanh nghiệp ➜ Tuyển sinh ➜ Đặt khám (chuyển PK – CRM không lưu bệnh nhân) ➜ Đối tác / CTV ➜ Khác (phân loại tay). */
  LUONG_LEAD: {
    ksk: { module: 'crm', nhan: '🏢 KSK doanh nghiệp → Pipeline B2B' },
    tuyensinh: { module: 'tuyensinh', nhan: '🎓 Tuyển sinh → chiến dịch' },
    phongkham: { module: 'phongkham', nhan: '🏥 Đặt khám → Phòng khám' },
    doitac: { module: 'crm', nhan: '🤝 Đối tác / CTV → CRM' },
    khac: { module: 'crm', nhan: '❔ Chưa rõ → phân loại tay' }
  },
  phanLuongLead: function(l) {
    l = l || {};
    const bo = s => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const t = bo([l.nguon, l.ghiChu, l.khoa ? 'khoa hoc ' + l.khoa : '', l.slKham ? 'so luong kham ' + l.slKham : ''].join(' ')), ten = bo(l.ten);
    const R = [
      ['ksk', /\bksk\b|kham suc khoe (doanh nghiep|dinh ky|cong ty)|so luong kham|doanh nghiep/, /^(cong ty|cty|doanh nghiep)\b/],
      ['tuyensinh', /tuyen sinh|dai hoc|khoa hoc|hoc phi|chung chi|lop hoc|nganh|tu xa|tieng anh|ielts|nhap hoc/],
      ['phongkham', /dat lich|dat kham|kham benh|bac si|phong kham|trieu chung|xet nghiem|\bkham\b/],
      ['doitac', /hop tac|dai ly|\bctv\b|cong tac vien|doi tac/]
    ];
    for (const [k, re, reTen] of R) {
      const m = t.match(re) || (reTen && ten.match(reTen));
      if (m) return Object.assign({ luong: k, lyDo: 'khớp "' + m[0].trim() + '"' }, this.LUONG_LEAD[k]);
    }
    return Object.assign({ luong: 'khac', lyDo: 'không khớp từ khóa' }, this.LUONG_LEAD.khac);
  },

  // ===== Lưu trên máy =====
  docKho: function() { try { return JSON.parse(localStorage.getItem(this.KHOA) || '{}') || {}; } catch (e) { return {}; } },
  ghiKho: function(k) { try { localStorage.setItem(this.KHOA, JSON.stringify(k)); return true; } catch (e) { ShinApp.toast('Trình duyệt không cho lưu trên máy.', 'error'); return false; } },

  khuon: function(ma) { return ((window.MAU_MARKETING || {}).khuon || []).find(k => k.ma === ma) || null; },

  render: function(container) {
    const M = window.MAU_MARKETING;
    const e = ShinApp.esc;
    if (!M) { container.innerHTML = '<div class="trong">Chưa tải được bộ khuôn nội dung (mau_marketing.js).</div>'; return; }
    const kho = this.docKho();
    const tt = id => (kho[id] && kho[id].trangThai) || 'nhap';
    const kenh = ma => M.kenh.find(k => k.ma === ma) || { bieuTuong: '•', ten: ma };
    const dem = { nhap: 0, cho_duyet: 0, san_sang: 0, tra_lai: 0 };
    const tatCaId = [...new Set(M.phieu_lich.map(p => p.id).concat(Object.keys(kho)))];
    tatCaId.forEach(id => { dem[tt(id)]++; });
    const lich = M.phieu_lich.filter(p => this._loc === 'tat' || p.tangPheu === this._loc);
    const MAU_TT = { nhap: 'var(--text-muted)', cho_duyet: 'var(--c-yellow)', san_sang: 'var(--c-green)', tra_lai: 'var(--c-red)' };
    const tuan = [...new Set(lich.map(p => p.tuan))].sort();
    const choDuyet = tatCaId.filter(id => tt(id) === 'cho_duyet'), sanSang = tatCaId.filter(id => tt(id) === 'san_sang');
    const tenBai = id => { const p = M.phieu_lich.find(x => x.id === id); return (kho[id] && kho[id].chude) || (p && p.chude) || id; };

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">📣 Marketing & Nội dung</div>
          <div class="page-sub">Lịch 4 tuần · Xưởng mẫu viết bài · Chốt duyệt trước khi đăng</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('marketing')" title="Làm mới">↻</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head"><div><div class="hero-greet">Nội dung tuần này 📣</div><div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div></div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--text-muted)">${dem.nhap + dem.tra_lai}</div><div class="tq-nhan">Nháp / trả lại</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-yellow)">${dem.cho_duyet}</div><div class="tq-nhan">Chờ duyệt</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${dem.san_sang}</div><div class="tq-nhan">Sẵn sàng đăng</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleMarketing.moXuong(null)">✍️ Viết bài từ khuôn</button>
      </div>

      ${choDuyet.length ? `<div class="hn-tieu"><span>CHỜ DUYỆT (M8.4) · ${choDuyet.length}</span></div>
        ${choDuyet.map(id => `<div class="hang-tru" style="flex-wrap:wrap"><span style="flex:1 1 60%;min-width:0">${e(tenBai(id))}<br><span class="chu-phu">${e(kho[id].kenh ? kenh(kho[id].kenh).ten : '')} · gửi ${e(kho[id].luc || '')}</span></span>
          <span class="hang-nut"><button class="btn-secondary" onclick="ModuleMarketing.xem('${e(id)}')">👁 Xem</button><button class="btn-secondary" onclick="ModuleMarketing.hanhDong('${e(id)}','tra')">↩️ Trả lại</button><button class="btn-primary" onclick="ModuleMarketing.hanhDong('${e(id)}','duyet')">✅ Duyệt</button></span></div>`).join('')}` : ''}

      ${sanSang.length ? `<div class="hn-tieu"><span>SẴN SÀNG ĐĂNG · ${sanSang.length}</span></div>
        ${sanSang.map(id => `<div class="hang-tru" style="flex-wrap:wrap"><span style="flex:1 1 60%;min-width:0">${e(tenBai(id))}<br><span class="chu-phu">duyệt ${e(kho[id].lucDuyet || '')}</span></span>
          <span class="hang-nut"><button class="btn-secondary" onclick="ModuleMarketing.hanhDong('${e(id)}','sua')">✏️ Sửa lại</button><button class="btn-primary" onclick="ModuleMarketing.saoChep('${e(id)}')">📋 Sao chép</button></span></div>`).join('')}` : ''}

      <div class="hn-tieu"><span>LỊCH NỘI DUNG 4 TUẦN (M8.1)</span></div>
      <div class="hang-nut" role="group" aria-label="Lọc tầng phễu">
        ${['tat', 'TOFU', 'MOFU', 'BOFU'].map(t => `<button class="${this._loc === t ? 'btn-primary' : 'btn-secondary'}" onclick="ModuleMarketing.loc('${t}')">${t === 'tat' ? 'Tất cả' : t}</button>`).join('')}
      </div>
      ${tuan.map(t => `<div class="chu-phu" style="margin-top:12px"><b>Tuần ${t}</b></div>
        ${lich.filter(p => p.tuan === t).map(p => `<div class="dong-lead" onclick="ModuleMarketing.moXuong('${e(p.id)}')" style="cursor:pointer">
          <div style="min-width:0"><b>${e(kenh(p.kenh).bieuTuong)} ${e(p.thu)} · ${e(p.tangPheu)}</b><div class="chu-phu">${e(p.chude)}</div></div>
          <div class="dong-lead-phai"><span class="chu-phu" style="color:${MAU_TT[tt(p.id)]}">${e(this.TRANG_THAI[tt(p.id)])}</span></div></div>`).join('')}`).join('') || '<div class="trong">Không có bài ở tầng này.</div>'}

      <div class="hn-tieu"><span>HIỆU SUẤT TRUYỀN THÔNG (M8.6)</span></div>
      <div id="mkHieuSuat"></div>

      <details class="tq-gon" id="mkXuong">
        <summary><span>✍️ Xưởng mẫu viết bài (M8.2)</span></summary>
        <div id="mkXuongNoi"></div>
      </details>

      <details class="tq-gon" id="mkLanBien">
        <summary><span>🌊 Xưởng phễu Lặn Biển 0m ➜ -105m (M8.5)</span></summary>
        <div id="mkLanBienNoi"></div>
      </details>

      <details class="tq-gon">
        <summary><span>📘 Kênh & giờ đăng gợi ý</span></summary>
        ${M.kenh.map(k => `<div class="hang-tru"><span><b>${e(k.bieuTuong)} ${e(k.ten)}</b><br><span class="chu-phu">${e(k.gioDangGoiY)} · ${e(k.gioiHanDoDai)}</span></span></div>`).join('')}
      </details>

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn & giới hạn</span></summary>
        <p class="chu-phu">Lịch + khuôn là MẪU (không chứa dữ liệu thật). Bài viết, trạng thái duyệt lưu trên máy này. Bài dịch vụ y tế tự kiểm từ khẳng định tuyệt đối / cam kết khỏi bệnh và chặn CCCD · BHYT · SĐT người bệnh.</p>
        <p class="chu-phu">Còn chờ v1: gửi bài vào Phê duyệt 0B + đăng tự động đa kênh – chưa có cổng máy chủ.</p>
        <p class="chu-phu">Hiệu suất (M8.6): số nhập tay từ trang quản lý của từng kênh, lưu trên máy này. Chế độ trình diễn hiện số MẪU (ghi rõ). Còn chờ v1: lấy số tự động từ API kênh (Facebook / TikTok / Zalo / YouTube) – chưa có cổng.</p>
      </details>
    `;
    this.veHieuSuat();
    if (typeof PheuLanBien !== 'undefined') PheuLanBien.render(document.getElementById('mkLanBienNoi'));
    if (this._bai) this.veXuong(true);
  },

  // ===== v2.12.0 M8.6 – Báo cáo hiệu suất truyền thông =====
  KHOA_HS: 'shin_mkt_hs',
  /** THUẦN: '1.200' / '1,2k' / '3.000.000' ➜ số nguyên ≥ 0; rỗng / sai ➜ null. */
  soNhap: function(s) {
    let t = String(s == null ? '' : s).trim().toLowerCase().replace(/\s/g, '');
    if (!t) return null;
    let nhan = 1;
    if (/k$/.test(t)) { nhan = 1000; t = t.slice(0, -1).replace(',', '.'); }
    else t = t.replace(/[.,](?=\d{3}(\D|$))/g, '');
    if (!/^\d+(\.\d+)?$/.test(t)) return null;
    return Math.round(parseFloat(t) * nhan);
  },
  /** THUẦN: dòng [{kenh, reach, tuongTac, click, lead}] ➜ {theoKenh:[…sắp theo reach giảm], tong}. Tỷ lệ % 1 chữ số; reach 0 ➜ tỷ lệ null. */
  tongHieuSuat: function(dong) {
    const cong = (a, r) => { a.reach += +r.reach || 0; a.tuongTac += +r.tuongTac || 0; a.click += +r.click || 0; a.lead += +r.lead || 0; a.soBai++; return a; };
    const moi = k => ({ kenh: k, reach: 0, tuongTac: 0, click: 0, lead: 0, soBai: 0 });
    const tyLe = a => Object.assign(a, {
      tyLeTT: a.reach ? Math.round(a.tuongTac / a.reach * 1000) / 10 : null,
      ctr: a.reach ? Math.round(a.click / a.reach * 1000) / 10 : null,
      leadNghin: a.reach ? Math.round(a.lead / a.reach * 10000) / 10 : null
    });
    const nhom = {}, tong = moi('tong');
    (dong || []).forEach(r => { const k = r.kenh || 'khac'; cong(nhom[k] = nhom[k] || moi(k), r); cong(tong, r); });
    return { theoKenh: Object.values(nhom).map(tyLe).sort((a, b) => b.reach - a.reach), tong: tyLe(tong) };
  },
  docHS: function() { try { const a = JSON.parse(localStorage.getItem(this.KHOA_HS) || '[]'); return Array.isArray(a) ? a : []; } catch (e) { return []; } },
  ghiHS: function(a) { try { localStorage.setItem(this.KHOA_HS, JSON.stringify(a)); return true; } catch (e) { ShinApp.toast('Trình duyệt không cho lưu trên máy.', 'error'); return false; } },

  veHieuSuat: function() {
    const o = document.getElementById('mkHieuSuat'), M = window.MAU_MARKETING;
    if (!o || !M) return;
    const e = ShinApp.esc, so = n => Number(n || 0).toLocaleString('vi-VN'), pt = x => x == null ? '–' : String(x).replace('.', ',') + '%';
    const that = this.hsHien();
    const laLive = window.SHIN_API && SHIN_API.laCheDoLive && SHIN_API.laCheDoLive();
    const mau = !that.length && !laLive ? (((window.SHIN_DEMO_DATA || {}).marketing || {}).hieuSuat || []) : [];
    const dong = that.length ? that : mau;
    const kenh = ma => M.kenh.find(k => k.ma === ma) || { bieuTuong: '•', ten: ma };
    const t = this.tongHieuSuat(dong);
    const tot = dong.filter(r => +r.reach > 0).map(r => ({ r, tl: r.tuongTac / r.reach })).sort((a, b) => b.tl - a.tl)[0];
    const baiChon = [...new Map(M.phieu_lich.map(p => [p.id, p])).values()];
    o.innerHTML = `
      ${mau.length ? '<div class="chu-phu" style="color:var(--c-yellow)">⚠️ Số MẪU (chế độ trình diễn) – nhập số thật bên dưới sẽ thay.</div>' : ''}
      ${dong.length ? `
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${e(so(t.tong.reach))}</div><div class="tq-nhan">Lượt tiếp cận</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${e(pt(t.tong.tyLeTT))}</div><div class="tq-nhan">Tỷ lệ tương tác</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-yellow)">${e(so(t.tong.lead))}</div><div class="tq-nhan">Lead</div></div>
        </div>
        ${t.theoKenh.map(k => `<div class="hang-tru"><span style="min-width:0"><b>${e(kenh(k.kenh).bieuTuong)} ${e(kenh(k.kenh).ten)}</b> · ${k.soBai} bài<br>
          <span class="chu-phu">Tiếp cận ${e(so(k.reach))} · tương tác ${e(pt(k.tyLeTT))} · bấm ${e(pt(k.ctr))} · ${e(k.leadNghin == null ? '–' : String(k.leadNghin).replace('.', ','))} lead / 1.000 tiếp cận</span></span></div>`).join('')}
        ${tot ? `<div class="chu-phu">🏆 Tương tác tốt nhất: <b>${e(tot.r.bai || '')}</b> (${e(kenh(tot.r.kenh).ten)}, ${e(pt(Math.round(tot.tl * 1000) / 10))})</div>` : ''}
        ${that.length ? `<details class="tq-gon"><summary><span>Số đã nhập · ${that.length}</span></summary>
          ${that.map((r, i) => `<div class="hang-tru" style="flex-wrap:wrap"><span style="flex:1 1 60%;min-width:0">${e(r.bai || '')}<br><span class="chu-phu">${e(kenh(r.kenh).ten)} · ${e(r.ngay || '')} · ${e(so(r.reach))} tiếp cận · ${e(so(r.tuongTac))} tương tác · ${e(so(r.lead))} lead</span></span>
            <span class="hang-nut"><button class="btn-secondary" onclick="ModuleMarketing.xoaHS(${i})">🗑 Xóa</button></span></div>`).join('')}</details>` : ''}
      ` : '<div class="trong">Chưa có số hiệu suất. Nhập số từ trang quản lý kênh bên dưới.</div>'}
      <details class="tq-gon" id="mkNhapHS">
        <summary><span>＋ Nhập số 1 bài đã đăng</span></summary>
        <label class="nhan-o" for="mkHsBai">Bài</label>
        <select id="mkHsBai" class="form-input">${baiChon.map(p => `<option value="${e(p.id)}">${e(p.thu)} · ${e(p.chude)}</option>`).join('')}</select>
        <label class="nhan-o" for="mkHsKenh">Kênh</label>
        <select id="mkHsKenh" class="form-input">${M.kenh.map(k => `<option value="${e(k.ma)}">${e(k.bieuTuong)} ${e(k.ten)}</option>`).join('')}</select>
        ${[['reach', 'Lượt tiếp cận (reach)'], ['tuongTac', 'Tương tác (thích + bình luận + chia sẻ)'], ['click', 'Lượt bấm liên kết'], ['lead', 'Lead / tin nhắn hỏi']].map(([k, n]) => `
          <label class="nhan-o" for="mkHs_${k}">${n}</label><input id="mkHs_${k}" class="form-input" inputmode="numeric" maxlength="15" placeholder="vd 1.200">`).join('')}
        <div id="mkHsLoi" class="chu-phu" style="color:var(--c-red)"></div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleMarketing.themHS()">💾 Ghi số</button></div>
      </details>`;
  },

  themHS: function() {
    const g = id => (document.getElementById(id) || {}).value || '';
    const loi = document.getElementById('mkHsLoi');
    const r = { reach: this.soNhap(g('mkHs_reach')), tuongTac: this.soNhap(g('mkHs_tuongTac')) || 0, click: this.soNhap(g('mkHs_click')) || 0, lead: this.soNhap(g('mkHs_lead')) || 0 };
    const sai = ['tuongTac', 'click', 'lead'].find(k => g('mkHs_' + k).trim() && this.soNhap(g('mkHs_' + k)) == null);
    let bao = '';
    if (r.reach == null) bao = 'Nhập lượt tiếp cận (số, vd 1.200 hoặc 1,2k).';
    else if (sai) bao = 'Ô ' + sai + ' không phải số.';
    else if (r.tuongTac > r.reach * 5 || r.click > r.reach) bao = 'Tương tác / lượt bấm lớn bất thường so với tiếp cận – kiểm lại.';
    if (bao) { if (loi) loi.textContent = bao; return; }
    const p = window.MAU_MARKETING.phieu_lich.find(x => x.id === g('mkHsBai')) || {};
    const a = this.docHS();
    a.unshift(Object.assign({ id: p.id || '', bai: p.chude || '', kenh: g('mkHsKenh'), ngay: ShinApp.ngayVN() }, r));
    if (this.ghiHS(a.slice(0, 300))) this.veHieuSuat();
  },

  /** Xóa 1 dòng: ẩn ngay, Hoàn tác 6s; hết giờ mới ghi. */
  _anHS: [],          // dòng đang chờ xóa (JSON) – ẩn khỏi màn trong 6s Hoàn tác
  hsHien: function() { return this.docHS().filter(x => this._anHS.indexOf(JSON.stringify(x)) < 0); },
  xoaHS: function(i) {
    const r = this.hsHien()[i];
    if (!r) return;
    const k = JSON.stringify(r);
    this._anHS.push(k);
    this.veHieuSuat();
    const bo = () => { this._anHS = this._anHS.filter(x => x !== k); };
    ShinApp.toast('Đã xóa số của "' + (r.bai || '') + '".', 'success', { nhan: 'Hoàn tác', bam: () => { bo(); this.veHieuSuat(); },
      khiHet: () => { bo(); const b = this.docHS(); const j = b.findIndex(x => JSON.stringify(x) === k); if (j >= 0) { b.splice(j, 1); this.ghiHS(b); } this.veHieuSuat(); } });
  },

  loc: function(t) { this._loc = t; ShinApp.chuyenModule('marketing'); },

  /** Mở xưởng cho 1 bài trong lịch (id) hoặc bài tự do (null). */
  moXuong: function(id) {
    const M = window.MAU_MARKETING, kho = this.docKho();
    const p = id ? M.phieu_lich.find(x => x.id === id) : null;
    const luu = id ? kho[id] : null;
    this._bai = { id: id || ('TU' + Date.now().toString(36)), khuonMa: (luu && luu.khuonMa) || (p && p.khuonMa) || M.khuon[0].ma,
      chude: (luu && luu.chude) || (p && p.chude) || '', kenh: (luu && luu.kenh) || (p && p.kenh) || '', bien: Object.assign({}, luu && luu.bien) };
    this.veXuong(true);
  },

  veXuong: function(moRa) {
    const b = this._bai, khung = document.getElementById('mkXuongNoi'), det = document.getElementById('mkXuong');
    if (!b || !khung) return;
    const e = ShinApp.esc, M = window.MAU_MARKETING, k = this.khuon(b.khuonMa) || M.khuon[0];
    const tt = (this.docKho()[b.id] || {}).trangThai || 'nhap';
    const khoa = tt === 'cho_duyet' || tt === 'san_sang';
    khung.innerHTML = `
      <div class="chu-phu">Bài: <b>${e(b.chude || 'Bài tự do')}</b> · ${e(this.TRANG_THAI[tt])}${khoa ? ' – đang khóa (rút / sửa lại để chỉnh)' : ''}</div>
      <label class="nhan-o" for="mkKhuon">Khuôn</label>
      <select id="mkKhuon" class="form-input" onchange="ModuleMarketing.doiKhuon(this.value)" ${khoa ? 'disabled' : ''}>
        ${M.khuon.map(x => `<option value="${e(x.ma)}" ${x.ma === k.ma ? 'selected' : ''}>${e(x.tangPheu)} · ${e(x.ten)}</option>`).join('')}
      </select>
      <div class="chu-phu">${e(k.congThuc)}${k.luuYYTe ? ' · ⚠️ ' + e(k.luuYYTe) : ''}</div>
      ${k.bien.map(x => { const t = x.replace(/[{}]/g, ''); return `<label class="nhan-o" for="mkB_${e(t)}">${e(t.replace(/_/g, ' '))}</label>
        <input id="mkB_${e(t)}" class="form-input" maxlength="300" value="${e(b.bien[t] || '')}" oninput="ModuleMarketing.nhapBien('${e(t)}', this.value)" ${khoa ? 'disabled' : ''}>`; }).join('')}
      <div class="nhan-o">Xem trước</div>
      <div id="mkXemTruoc" class="chu-phu" style="white-space:pre-wrap;border:1px solid var(--border);border-radius:12px;padding:12px;overflow-wrap:anywhere"></div>
      <div id="mkCanh" class="chu-phu" style="color:var(--c-red)"></div>
      <div class="hang-nut">
        ${tt === 'cho_duyet' ? `<button class="btn-secondary" onclick="ModuleMarketing.hanhDong('${e(b.id)}','rut')">↩️ Rút về nháp</button>` : ''}
        ${!khoa ? `<button class="btn-secondary" onclick="ModuleMarketing.luuNhap()">💾 Lưu nháp</button><button class="btn-primary" onclick="ModuleMarketing.guiDuyet()">📤 Gửi duyệt</button>` : ''}
      </div>`;
    this.capNhatXemTruoc();
    if (moRa && det) { det.open = true; if (det.scrollIntoView) det.scrollIntoView({ block: 'start' }); }
  },

  doiKhuon: function(ma) { if (this._bai) { this._bai.khuonMa = ma; this.veXuong(false); } },
  nhapBien: function(k, v) { if (this._bai) { this._bai.bien[k] = v; this.capNhatXemTruoc(); } },

  capNhatXemTruoc: function() {
    const b = this._bai, o = document.getElementById('mkXemTruoc'), c = document.getElementById('mkCanh');
    if (!b || !o) return;
    const k = this.khuon(b.khuonMa);
    const chu = this.dienKhuon(k && k.thanBai, b.bien);
    o.textContent = chu;
    const cam = this.kiemTuCam(Object.values(b.bien).join(' '), k && k.mang);
    if (c) c.textContent = cam.length ? '⚠️ Quảng cáo y tế không dùng: ' + cam.join(', ') : '';
  },

  /** Kiểm bài trước khi lưu / gửi ➜ {loi} | {ok, noiDung}. */
  kiemBai: function(batBuocDu) {
    const b = this._bai, k = this.khuon(b.khuonMa);
    if (!k) return { loi: 'Chưa chọn khuôn.' };
    const vp = SHIN_API.soatKhongDuaVao ? SHIN_API.soatKhongDuaVao(b.bien) : null;
    if (vp) return { loi: 'Ô "' + String(vp.truong).replace(/_/g, ' ') + '" có ' + vp.loai + ' – xóa đi (không đưa dữ liệu nhạy cảm vào bài).' };
    if (batBuocDu) {
      const thieu = this.thieuBien(k, b.bien);
      if (thieu.length) return { loi: 'Còn trống: ' + thieu.map(x => x.replace(/_/g, ' ')).join(', ') + '.' };
      const cam = this.kiemTuCam(Object.values(b.bien).join(' '), k.mang);
      if (cam.length) return { loi: 'Bài y tế có từ không được dùng: ' + cam.join(', ') + '.' };
    }
    return { ok: true, noiDung: this.dienKhuon(k.thanBai, b.bien) };
  },

  ghiBai: function(trangThai) {
    const b = this._bai, kho = this.docKho();
    const kq = this.kiemBai(trangThai === 'cho_duyet');
    if (kq.loi) { ShinApp.toast(kq.loi, 'error'); return false; }
    kho[b.id] = Object.assign({}, kho[b.id], { khuonMa: b.khuonMa, chude: b.chude || this.khuon(b.khuonMa).ten, kenh: b.kenh || (this.khuon(b.khuonMa).kenhUuTien || [])[0] || '',
      bien: b.bien, noiDung: kq.noiDung, trangThai, luc: ShinApp.ngayVN() });
    return this.ghiKho(kho);
  },

  luuNhap: function() { if (this.ghiBai((this.docKho()[this._bai.id] || {}).trangThai === 'tra_lai' ? 'tra_lai' : 'nhap')) { ShinApp.toast('Đã lưu nháp trên máy này.', 'success'); ShinApp.chuyenModule('marketing'); } },
  guiDuyet: function() {
    const cu = (this.docKho()[this._bai.id] || {}).trangThai || 'nhap';
    if (!this.chuyen(cu, 'gui')) return ShinApp.toast('Bài đang ở trạng thái không gửi được.', 'error');
    if (this.ghiBai('cho_duyet')) { ShinApp.toast('Đã chuyển vào hàng Chờ duyệt.', 'success'); ShinApp.chuyenModule('marketing'); }
  },

  xem: function(id) { this._bai = null; this.moXuong(id); },

  /** Duyệt (Hoàn tác 6s – chưa ghi gì, hết 6s mới ghi) · Trả lại · Rút · Sửa lại. */
  hanhDong: function(id, hd) {
    const kho = this.docKho(), bai = kho[id];
    const moi = bai && this.chuyen(bai.trangThai, hd);
    if (!moi) return ShinApp.toast('Thao tác không hợp lệ với trạng thái hiện tại.', 'error');
    const ghi = () => { const k = this.docKho(); if (!k[id] || k[id].trangThai !== bai.trangThai) return;
      k[id].trangThai = moi; if (moi === 'san_sang') k[id].lucDuyet = ShinApp.ngayVN();
      if (this.ghiKho(k)) { this._bai = null; ShinApp.chuyenModule('marketing'); } };
    if (hd === 'duyet') {
      ShinApp.toast('Duyệt "' + (bai.chude || id) + '" – chưa ghi, sẽ ghi sau 6 giây.', 'info', { nhan: 'Hoàn tác', bam: () => ShinApp.toast('Đã hoàn tác – bài vẫn Chờ duyệt.', 'info'), khiHet: ghi });
      return;
    }
    ghi();
  },

  saoChep: function(id) {
    const bai = this.docKho()[id];
    if (!bai || bai.trangThai !== 'san_sang') return ShinApp.toast('Chỉ bài đã duyệt mới sao chép để đăng.', 'error');
    const xong = () => ShinApp.toast('Đã sao chép bài – dán lên kênh đăng.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(bai.noiDung || '').then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  }
};
