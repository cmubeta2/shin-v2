/**
 * SHIN v2 – Module 7: Quản Lý Công Việc (Universal Task Bus)
 * Trục liên thông việc toàn hệ sinh thái dạng Kanban đa nguồn:
 * Tự động gom việc từ Hub, Báo cáo Phòng khám, Dự án, CRM Lead, Tài chính
 * v2.8.4 (M7.4): đèn SLA Xanh → Vàng → Đỏ PHÍA TRÌNH DUYỆT theo hạn (Hôm nay · HH:MM · dd/mm[/yyyy]),
 * dải đếm + lọc theo đèn, nút sao chép tin cảnh báo. Chữ thẻ ≥ 14px.
 * v2.15.0 (M7.1 🟢 – HUB L27 lên app Hub v1.23.2 @23): Live đọc sổ việc liên thông `webTaskBus` (việc theo quyền, đèn SLA máy chủ),
 * ＋ đẩy việc `webDayViec` (id chống trùng, gấp ➜ Hub báo Telegram ngay), ▶ / ✅ / ✖ đổi trạng thái `webDoiTrangThaiViec`.
 * Mọi lệnh ghi qua Toast Hoàn tác 6s, ghi đúng 1 lần. Hub tự báo Telegram việc quá hạn 1 lần / việc.
 */

const ModuleCongViec = {
  ma: 'congviec',
  ten: 'Quản Lý Công Việc',
  bieuTuong: '📋',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',
  GIO_VANG: 4,
  _ds: [],
  _loc: '',

  /** THUẦN. Hạn (chuỗi) ➜ Date hết hạn, hoặc null nếu không đọc được. bayGio: Date. */
  docHan: function(han, bayGio) {
    const s = String(han || '').trim().toLowerCase(), n = bayGio || new Date();
    const cuoiNgay = (y, m, d) => new Date(y, m, d, 23, 59, 59);
    if (!s || /xong|đã xong/.test(s)) return null;
    if (/hôm nay|hom nay/.test(s)) return cuoiNgay(n.getFullYear(), n.getMonth(), n.getDate());
    let m = s.match(/^(\d{1,2})[:h](\d{2})$/);
    if (m) return new Date(n.getFullYear(), n.getMonth(), n.getDate(), +m[1], +m[2]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
    if (m) { const d = +m[1], t = +m[2] - 1; if (t < 0 || t > 11 || d < 1 || d > 31) return null; return cuoiNgay(m[3] ? +m[3] : n.getFullYear(), t, d); }
    return null;
  },

  /** THUẦN. Mức SLA: 'xong' (cột hoàn tất) · 'do' (quá hạn) · 'vang' (≤ GIO_VANG giờ hoặc đang diễn ra) · 'xanh' · 'xam' (chưa rõ hạn). */
  mucSla: function(item, cot, bayGio) {
    if (cot === 'hoanTat') return 'xong';
    const s = String((item && item.han) || '').toLowerCase();
    if (/đang diễn ra|dang dien ra/.test(s)) return 'vang';
    const h = this.docHan(s, bayGio);
    if (!h) return 'xam';
    const conGio = (h - (bayGio || new Date())) / 36e5;
    return conGio < 0 ? 'do' : conGio <= this.GIO_VANG ? 'vang' : 'xanh';
  },

  /* v2.9.1 (M7.3) – Phân luồng việc theo RBAC PHÍA TRÌNH DUYỆT: việc thuộc mảng người dùng không được vào (cùng luật ẩn menu
     ShinApp.mangDuocHien = chốt chặn quyền của mã v1) bị ẩn; chip "👤 Của tôi" lọc việc giao đúng tên / mã người đang đăng nhập. */
  MANG_SO: { 1: 'hub', 2: 'crm', 3: 'taichinh', 4: 'tuyensinh', 5: 'phongkham', 6: 'duan', 7: 'congviec', 8: 'web', 9: 'trithuc' },
  _luong: '',

  /** THUẦN. Nguồn việc ("Mảng 6 (Dự án)", "Tầng 0 (Core)", "0B …") ➜ mã module, '' nếu không rõ. */
  maTuNguon: function(nguon) {
    const s = String(nguon || '');
    const m = s.match(/Mảng\s*(\d)/i);
    if (m) return this.MANG_SO[m[1]] || '';
    if (/^\s*0B|phê duyệt/i.test(s)) return 'pheduyet';
    if (/Tầng\s*0|Core/i.test(s)) return 'quantri';
    return '';
  },

  boDau: function(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/\s+/g, ' ').trim();
  },

  /** THUẦN. Việc có giao cho người này không: chứa đủ họ tên, mã NV, hoặc gọi tắt ("Sếp Tâm", "chị Thư") khớp phần cuối họ tên. */
  laCuaToi: function(nguoiViec, nguoi) {
    if (!nguoi) return false;
    const v = this.boDau(nguoiViec), ten = this.boDau(nguoi.hoTen), ma = this.boDau(nguoi.maNV || nguoi.ma);
    if (!v) return false;
    if ((ten && v.indexOf(ten) >= 0) || (ma && (' ' + v + ' ').indexOf(' ' + ma + ' ') >= 0)) return true;
    return v.split(/\s*(?:&|,|\/|\bva\b)\s*/).some(p => {
      const goi = p.replace(/^(sep|anh|chi|em|bs|ths|ts|co|thay)\s+/, '').trim();
      return goi && goi !== p.trim() && ten && (' ' + ten).endsWith(' ' + goi);
    });
  },

  /** THUẦN. ds: [{it, cot, sla}] ➜ { duocXem, cuaToi, an } theo hàm coQuyen(ma) và người đang đăng nhập. */
  phanLuong: function(ds, nguoi, coQuyen) {
    const duocXem = [], cuaToi = []; let an = 0;
    (ds || []).forEach(x => {
      const ma = x.it.maMang || this.maTuNguon(x.it.nguon);
      if (ma && coQuyen && !coQuyen(ma)) { an++; return; }
      duocXem.push(x);
      if (this.laCuaToi(x.it.nguoi, nguoi)) cuaToi.push(x);
    });
    return { duocXem, cuaToi, an };
  },

  luongLoc: function(k) { this._luong = k || ''; ShinApp.rung('nhe'); if (this._container) this.render(this._container, this._data); },

  /* ---- v2.15.0 M7.1 – Task Bus HUB L27 ---- */
  /** Nguồn việc Hub nhận (NGUON_VIEC_LT_ của 85_TaskBus.gs) ➜ [nhãn thẻ, mã module v2 cho RBAC]. */
  NGUON_TB: {
    hub: ['Mảng 1 (Hub)', 'hub'], zalo: ['Mảng 1 (Zalo)', 'hub'], crm: ['Mảng 2 (CRM)', 'crm'], taichinh: ['Mảng 3 (Tài chính)', 'taichinh'],
    tuyensinh: ['Mảng 4 (Tuyển sinh)', 'tuyensinh'], phongkham: ['Mảng 5 (Phòng khám)', 'phongkham'], khaosat: ['Mảng 5 (Khảo sát)', 'khaosat'],
    duan: ['Mảng 6 (Dự án)', 'duan'], marketing: ['Mảng 8 (Marketing)', 'marketing']
  },
  COT_TT: { 'Mới': 'canLam', 'Đang làm': 'dangLam', 'Xong': 'hoanTat', 'Bỏ': 'hoanTat' },

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webTaskBus', {});
    if (!kq.ok) return kq;
    if (kq.isDemo) return { ok: true, data: window.SHIN_DEMO_DATA.congviec };
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. webTaskBus {viec:[{ma, nguon, loai, muc, tieuDe, lienKet, han 'dd/mm/yyyy', nguoiNhan, nguoiTao, trangThai, den}]} ➜ khuôn màn. */
  tuV1: function(r) {
    const kanban = { canLam: [], dangLam: [], hoanTat: [] };
    ((r && r.viec) || []).forEach(v => {
      const tt = this.COT_TT[v.trangThai] ? v.trangThai : 'Mới', ng = this.NGUON_TB[v.nguon] || [v.nguon || 'Khác', ''];
      const tag = [v.muc === 'gap' ? '⚡ Gấp' : '', tt === 'Bỏ' ? 'Đã bỏ' : '', v.loai || ''].filter(Boolean).join(' · ');
      kanban[this.COT_TT[tt]].push({ id: v.ma, ma: v.ma, nguon: ng[0], maMang: ng[1], tieuDe: v.tieuDe || '', nguoi: v.nguoiNhan || '', nguoiTao: v.nguoiTao || '',
        han: v.han || '', tag, den: v.den || '', trangThai: tt, muc: v.muc || 'thuong' });
    });
    const so = (c, nhan, mau) => ({ nhan, giaTri: String(kanban[c].length), dvt: 'việc', mau });
    return {
      live: true,
      hero: { chao: 'Task Bus Hub – việc liên thông 📋', ngay: 'Hub tự báo Telegram việc gấp + việc quá hạn',
        so: [so('canLam', 'Cần làm', 'var(--c-blue)'), so('dangLam', 'Đang làm', 'var(--c-yellow)'), so('hoanTat', 'Hoàn tất', 'var(--c-green)')],
        nutChinh: { nhan: '＋ Đẩy việc vào Task Bus' } },
      kanban
    };
  },

  /** THUẦN. 'yyyy-mm-dd' hợp lệ ➜ chính nó; trống ➜ ''; sai ➜ null (giống hanViecLT_ của Hub). */
  hanHop: function(s) {
    s = String(s == null ? '' : s).trim();
    if (!s) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    return d.getFullYear() === +m[1] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[3] ? s : null;
  },

  /** THUẦN. Kiểm 1 việc theo luật Hub kiemViecLT (trừ id – thêm khi gửi) + tường lửa M9.5 ➜ {loi} | {goi}. */
  kiemViec: function(du) {
    du = du || {};
    const cat = v => String(v == null ? '' : v).trim();
    const nguon = cat(du.nguon).toLowerCase(), muc = cat(du.muc) || 'thuong', tieuDe = cat(du.tieuDe).replace(/\s+/g, ' '), han = this.hanHop(du.han), nhan = cat(du.nguoiNhan);
    if (!this.NGUON_TB[nguon]) return { loi: 'Nguồn việc chỉ nhận: ' + Object.keys(this.NGUON_TB).join(' / ') + '.' };
    if (['gap', 'thuong'].indexOf(muc) < 0) return { loi: 'Mức việc chỉ nhận: gấp / thường.' };
    if (!tieuDe) return { loi: 'Vui lòng ghi tiêu đề việc.' };
    if (tieuDe.length > 200) return { loi: 'Tiêu đề việc tối đa 200 ký tự.' };
    if (han === null) return { loi: 'Hạn không hợp lệ.' };
    if (/(^|\D)0\d{9}(?!\d)/.test(tieuDe.replace(/[\s.-]/g, '')) || /(^|\D)\d{12}(?!\d)|\b[A-Z]{2}[1-5]\d{12}\b|\bBN\b/.test(tieuDe)) return { loi: 'Tiêu đề việc không được chứa SĐT / CCCD / BHYT / thông tin người bệnh.' };
    if (nhan && !/^[A-Za-z0-9_.@-]{1,60}$/.test(nhan)) return { loi: 'Người nhận ghi mã người dùng Hub (vd NV001), để trống = người phụ trách mảng.' };
    const goi = { nguon, loai: 'v2', muc, tieuDe, han };
    if (nhan) goi.nguoiNhan = nhan;
    return { goi };
  },

  laLiveTB: function() { return typeof SHIN_API !== 'undefined' && SHIN_API.laCheDoLive() && !!(this._data && this._data.live) && !!SHIN_API.layToken(); },

  /** Tải lại sổ việc sau khi ghi (giữ bộ lọc). */
  taiLai: async function() {
    const kq = await this.taiLive();
    if (kq.ok && this._container && this._container.isConnected) this.render(this._container, kq.data);
  },

  /** Đẩy 1 việc: kiểm ➜ Toast Hoàn tác 6s ➜ webDayViec đúng 1 lần (id giữ tới khi Hub nhận ➜ bấm lại không tạo trùng). */
  guiViec: function(nut) {
    const v = id => String((document.getElementById(id) || {}).value || '');
    const kq = this.kiemViec({ nguon: v('cvNguon'), muc: v('cvMuc'), tieuDe: v('cvTieu'), han: v('cvHan'), nguoiNhan: v('cvNhan') });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    if (!this.laLiveTB()) return ShinApp.toast('Đang ở Demo – không ghi lên Hub.', 'info');
    if (this._dangGui) return;
    const khoa = JSON.stringify(kq.goi);
    if (this._maGuiCho !== khoa) { this._maGuiCho = khoa; this._maGui = ModuleTaiChinh.taoMaGui(Date.now(), Math.random().toString(36).slice(2)); }
    const du = Object.assign({}, kq.goi, { id: this._maGui });
    this._dangGui = true;
    const khoaNut = on => { if (nut && nut.isConnected) { nut.disabled = on; nut.textContent = on ? '⏳ Chờ 6 giây…' : '📤 Đẩy việc'; } };
    ShinApp.hanhDongHoanTac('Sẽ đẩy việc "' + kq.goi.tieuDe.slice(0, 60) + '" vào Task Bus' + (kq.goi.muc === 'gap' ? ' (gấp – Hub báo Telegram ngay)' : '') + '.', {
      lamTruoc: () => khoaNut(true),
      traLai: () => { this._dangGui = false; khoaNut(false); },
      thucHien: async () => {
        const r = await SHIN_API.goi('HUB', 'webDayViec', du);
        if (!r.ok) throw new Error('Chưa đẩy được: ' + SHIN_API.moTaLoi(r) + ' – bấm lại (không tạo việc trùng).');
        if (r.isDemo) throw new Error('Chưa có máy chủ Hub – không ghi.');
        const d = r.data || {};
        this._dangGui = false; this._maGui = ''; this._maGuiCho = ''; this._moForm = false;
        ShinApp.toast((d.moi === false ? 'Việc đã có sẵn ' : 'Đã đẩy việc ') + (d.ma || '') + '.', 'success');
        await this.taiLai();
      }
    });
  },

  /** Đổi trạng thái 1 việc (chỉ người nhận / người tạo / Admin – Hub kiểm): Toast Hoàn tác 6s ➜ webDoiTrangThaiViec (chỉ ghi ô TrangThai). */
  doiTrangThai: function(nut) {
    const ma = nut && nut.dataset.ma, tt = nut && nut.dataset.tt;
    const x = this._ds.find(y => y.it.ma === ma);
    if (!x || !this.COT_TT[tt]) return;
    if (!this.laLiveTB()) return ShinApp.toast('Đang ở Demo – không ghi lên Hub.', 'info');
    if (this._dangDoi) return;
    this._dangDoi = true;
    nut.disabled = true;
    ShinApp.hanhDongHoanTac('Sẽ chuyển "' + x.it.tieuDe.slice(0, 50) + '" sang ' + tt + '.', {
      traLai: () => { this._dangDoi = false; if (nut.isConnected) nut.disabled = false; },
      thucHien: async () => {
        const r = await SHIN_API.goi('HUB', 'webDoiTrangThaiViec', { ma, trangThai: tt });
        if (!r.ok) throw new Error('Chưa đổi được: ' + SHIN_API.moTaLoi(r));
        if (r.isDemo) throw new Error('Chưa có máy chủ Hub – không ghi.');
        this._dangDoi = false;
        ShinApp.toast('Đã chuyển sang ' + ((r.data || {}).trangThai || tt) + '.', 'success');
        await this.taiLai();
      }
    });
  },

  NHAN_SLA: { do: '🔴 Quá hạn', vang: '🟡 Sắp tới hạn', xanh: '🟢 Trong hạn', xam: '⚪ Chưa rõ hạn', xong: '✅ Xong' },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.congviec;
    const hero = d.hero || {};
    const kanban = d.kanban || { canLam: [], dangLam: [], hoanTat: [] };
    const bay = new Date();
    this._ds = [];
    ['canLam', 'dangLam', 'hoanTat'].forEach(c => (kanban[c] || []).forEach(it => this._ds.push({ it, cot: c, sla: c !== 'hoanTat' && this.NHAN_SLA[it.den] ? it.den : this.mucSla(it, c, bay) })));
    // M7.3 – phân luồng theo quyền (Live: người đăng nhập Hub; Demo: người mẫu)
    const laLive = typeof SHIN_API !== 'undefined' && SHIN_API.laCheDoLive();
    const nguoi = laLive ? (ShinApp.live && ShinApp.live.nguoi) : (d.nguoiDemo || { hoTen: 'Sếp Tâm', vaiTro: 'Admin' });
    const lu = this.phanLuong(this._ds, nguoi, ShinApp.mangDuocHien || null);
    if (this._luong === 'toi' && !lu.cuaToi.length) this._luong = '';
    this._ds = this._luong === 'toi' ? lu.cuaToi : lu.duocXem;
    const demCot = c => this._ds.filter(x => x.cot === c).length;
    const dem = k => this._ds.filter(x => x.sla === k).length;

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Lý Công Việc</div>
          <div class="page-sub">Trục Task Bus liên thông toàn bộ 10 mảng nghiệp vụ</div>
        </div>
        <button class="btn-icon" onclick="ModuleCongViec.taoViec()" title="Tạo việc mới">＋</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Trục Quản Lý Công Việc Liên Thông 📋'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Task Bus toàn hệ thống'}</div>
          </div>
        </div>

        <div class="tq-3so">
          ${(hero.so || []).map((s, i) => `
            <div class="tq-o">
              <div class="tq-so" style="color: ${s.mau}">${this._luong === 'toi' && (hero.so || []).length === 3 ? demCot(['canLam', 'dangLam', 'hoanTat'][i]) : s.giaTri}</div>
              <div class="tq-nhan">${s.nhan}</div>
            </div>
          `).join('')}
        </div>

        <button class="btn-primary" onclick="ModuleCongViec.taoViec()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '＋ Tạo Công Việc Mới'}
        </button>
        ${dem('do') + dem('vang') ? `<button class="btn-secondary cv-saochep" onclick="ModuleCongViec.saoChepCanhBao()">📋 Sao chép cảnh báo</button>` : (this._luong === 'toi' ? `<button class="btn-secondary cv-saochep" disabled>📋 0 cảnh báo của tôi</button>` : '')}
      </div>
      ${this.veForm(d)}

      <!-- v2.14.6 (agy 16/11): gộp M7.3 luồng việc + M7.4 dải SLA thành 1 hàng chip – ở 375 danh sách việc lên màn đầu -->
      <div class="hang-tab cv-sla" role="toolbar" aria-label="Lọc việc">
        <button class="chip-chon ${this._luong === 'toi' ? 'dang-chon' : ''}" aria-pressed="${this._luong === 'toi'}" data-l="${this._luong === 'toi' ? '' : 'toi'}" onclick="ModuleCongViec.luongLoc(this.dataset.l)" title="${this._luong === 'toi' ? 'Đang xem việc của tôi – bấm để xem theo quyền (' + lu.duocXem.length + ')' : 'Đang xem theo quyền – bấm để chỉ xem việc của tôi'}" ${lu.cuaToi.length || this._luong === 'toi' ? '' : 'disabled'}>${this._luong === 'toi' ? '✓ ' : ''}👤 Chỉ của tôi · ${lu.cuaToi.length}</button>
        <span class="chip-sep" aria-hidden="true"></span>
        <button class="chip-chon ${this._loc ? '' : 'dang-chon'}" data-sla="" onclick="ModuleCongViec.locSla(this.dataset.sla)">Tất cả · ${this._ds.length}</button>
        ${['do', 'vang', 'xanh', 'xam'].filter(k => dem(k)).map(k => `<button class="chip-chon ${this._loc === k ? 'dang-chon' : ''}" data-sla="${k}" onclick="ModuleCongViec.locSla(this.dataset.sla)" aria-label="${this.NHAN_SLA[k].slice(this.NHAN_SLA[k].indexOf(' ') + 1)}: ${dem(k)} việc">${this.NHAN_SLA[k].split(' ')[0]}<span class="cv-chu">&nbsp;${this.NHAN_SLA[k].slice(this.NHAN_SLA[k].indexOf(' ') + 1)} ·</span> ${dem(k)}</button>`).join('')}
      </div>
      ${lu.an ? `<div class="chu-phu cv-an">🔒 ${lu.an} việc thuộc mảng anh/chị không có quyền (hoặc đang tắt) – đã ẩn.</div>` : ''}

      <!-- Bảng Kanban 3 Cột Liên Thông -->
      <div class="kanban-board">
        <!-- Cột Cần Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⏳ CẦN LÀM</span>
            <span class="status-pill warn" style="padding:2px 8px; font-size:14px;">${demCot('canLam')}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('canLam')}
          </div>
        </div>

        <!-- Cột Đang Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⚡ ĐANG LÀM</span>
            <span class="status-pill live" style="padding:2px 8px; font-size:14px;">${demCot('dangLam')}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('dangLam')}
          </div>
        </div>

        <!-- Cột Hoàn Tất -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>✅ HOÀN TẤT</span>
            <span class="status-pill" style="background:var(--c-green)20; color:var(--c-green); padding:2px 8px; font-size:14px;">${demCot('hoanTat')}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('hoanTat')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this._container = container; this._data = d;
  },

  /** Khối ＋ đẩy việc (ẩn tới khi bấm ＋). */
  veForm: function(d) {
    if (!this._moForm) return '';
    const e = ShinApp.esc, live = !!(d && d.live);
    return `
      <form class="card cv-form" id="cvForm" onsubmit="event.preventDefault(); ModuleCongViec.guiViec(document.getElementById('cvGui'));">
        <div class="section-title">＋ Đẩy việc vào Task Bus</div>
        ${live ? '' : '<div class="chu-phu">Đang ở Demo – điền thử được, không ghi lên Hub.</div>'}
        <label class="form-label" for="cvTieu">Tiêu đề việc *</label>
        <input class="form-input" id="cvTieu" maxlength="200" autocomplete="off" placeholder="Vd: Gửi báo giá KSK cho Công ty A">
        <div class="cv-form-2">
          <div><label class="form-label" for="cvNguon">Mảng</label>
            <select class="form-input" id="cvNguon">${Object.keys(this.NGUON_TB).map(k => `<option value="${k}" ${k === 'hub' ? 'selected' : ''}>${e(this.NGUON_TB[k][0])}</option>`).join('')}</select></div>
          <div><label class="form-label" for="cvMuc">Mức</label>
            <select class="form-input" id="cvMuc"><option value="thuong">Thường</option><option value="gap">⚡ Gấp (báo Telegram ngay)</option></select></div>
          <div><label class="form-label" for="cvHan">Hạn</label><input class="form-input" id="cvHan" type="date"></div>
          <div><label class="form-label" for="cvNhan">Người nhận (mã Hub)</label><input class="form-input" id="cvNhan" maxlength="60" autocomplete="off" placeholder="Trống = phụ trách mảng"></div>
        </div>
        <div class="chu-phu">Không ghi SĐT / CCCD / BHYT / tên người bệnh vào tiêu đề.</div>
        <div class="cv-form-nut">
          <button type="submit" class="btn-primary" id="cvGui">📤 Đẩy việc</button>
          <button type="button" class="btn-secondary" onclick="ModuleCongViec.taoViec()">Đóng</button>
        </div>
      </form>`;
  },

  theCot: function(cot) {
    const ds = this._ds.filter(x => x.cot === cot && (!this._loc || x.sla === this._loc));
    return ds.map(x => this.renderTaskCard(x.it, cot, x.sla)).join('') || '<div class="chu-phu" style="padding:8px;">—</div>';
  },

  locSla: function(k) { this._loc = k || ''; ShinApp.rung('nhe'); if (this._container) this.render(this._container, this._data); },

  /** THUẦN. Tin cảnh báo SLA (đỏ trước, vàng sau) – dạng chữ để dán Telegram. */
  tinCanhBao: function(ds) {
    const dong = (ds || []).filter(x => x.sla === 'do' || x.sla === 'vang').sort((a, b) => (a.sla === 'do' ? 0 : 1) - (b.sla === 'do' ? 0 : 1))
      .map(x => `${x.sla === 'do' ? '🔴' : '🟡'} ${x.it.tieuDe} – ${x.it.nguoi} · hạn ${x.it.han}`);
    return dong.length ? `⚠️ SLA công việc (${dong.length})\n` + dong.join('\n') : '';
  },

  saoChepCanhBao: function() {
    const t = this.tinCanhBao(this._ds);
    if (!t) return ShinApp.toast('Không có việc quá hạn / sắp tới hạn.', 'info');
    const xong = () => ShinApp.toast(this._data && this._data.live ? 'Đã sao chép – Hub cũng tự báo Telegram mỗi việc quá hạn 1 lần.' : 'Đã sao chép tin cảnh báo – dán vào Telegram.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  },

  renderTaskCard: function(item, cot, sla) {
    const e = ShinApp.esc, m = sla || this.mucSla(item, cot);
    return `
      <div class="kanban-card cv-the cv-${m}">
        <div class="cv-dau">
          <span class="cv-nguon">${e(item.nguon)}</span>
          <span class="cv-sla-nhan">${this.NHAN_SLA[m]}</span>
        </div>
        <div class="cv-tieu">${e(item.tieuDe)}</div>
        <div class="cv-chan">
          <span>👤 ${e(item.nguoi)}</span>
          <span>📅 ${e(item.han || 'Không hạn')}${item.tag ? ' · ' + e(item.tag) : ''}</span>
        </div>
        ${this._data && this._data.live && item.ma && cot !== 'hoanTat' ? `<div class="cv-nut">
          <button class="btn-secondary" data-ma="${e(item.ma)}" data-tt="${cot === 'canLam' ? 'Đang làm' : 'Xong'}" onclick="ModuleCongViec.doiTrangThai(this)">${cot === 'canLam' ? '▶ Bắt đầu' : '✅ Xong'}</button>
          <button class="btn-secondary" data-ma="${e(item.ma)}" data-tt="Bỏ" onclick="ModuleCongViec.doiTrangThai(this)" aria-label="Bỏ việc này">✖ Bỏ</button>
        </div>` : ''}
      </div>
    `;
  },

  taoViec: function() {
    this._moForm = !this._moForm;
    ShinApp.rung('nhe');
    if (this._container) this.render(this._container, this._data);
    const o = document.getElementById('cvTieu');
    if (o) { o.scrollIntoView({ block: 'center' }); o.focus({ preventScroll: true }); }
  }
};
