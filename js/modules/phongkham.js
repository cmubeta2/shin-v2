/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH, app PK v1.0.7 – L1–L5 đã lên app).
 * v2.6.5: nối THẬT 19 cổng của congWeb_() PK theo hợp đồng mục 4 KE_HOACH_GIAO_DIEN_PK_AGY.md.
 * LƯU Ý: cổng PK nhận ham(token, du) – du là OBJECT (không phải du.a như KPI/TS/KS) ➜ gọi SHIN_API.goi('PK', hanh, du).
 * Thẻ: Hôm nay · Báo cáo · Công việc · Lịch tuần · Thông báo · Góp ý · Hồ sơ · (Duyệt – tổ trưởng/admin) · (Nhân sự – lãnh đạo/admin).
 * Xin nghỉ / xếp lịch (ghi) đi qua PTKH webGoi ➜ mở app PK v1. Demo: dữ liệu giả trong demo_data.js (phongkham).
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  _tab: 'homnay',
  _kd: null,          // webKhoiDong
  _cache: {},         // dữ liệu từng thẻ
  _anh: [],           // ảnh đang chọn [{ten, kieu, base64, xem}]
  _locViec: '',
  _moViec: '',
  _timNS: '',

  THE: [
    ['homnay', '🏠 Hôm nay'], ['baocao', '📝 Báo cáo'], ['congviec', '✅ Công việc'], ['lich', '📅 Lịch tuần'],
    ['thongbao', '🔔 Thông báo'], ['gopy', '💬 Góp ý'], ['toi', '👤 Hồ sơ'], ['duyet', '⚡ Duyệt'], ['nhansu', '👥 Nhân sự']
  ],
  CONG: { homnay: 'webHomNay', baocao: 'webBaoCao', congviec: 'webCongViec', lich: 'webLichTuan', thongbao: 'webThongBao', gopy: 'webGopYCuaToi', toi: 'webHoSo', duyet: 'webChoDuyet', nhansu: 'webNhanSu' },
  MUC: { do: 'do', vang: 'vang', xanh: 'xanh', xam: 'xam' },
  TT_BC: { da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] },
  TT_GY: { moi: ['Mới', 'vang'], dang_xu_ly: ['Đang xử lý', 'xam'], xong: ['Xong', 'xanh'] },
  LOAI_VIEC: { giao: 'Được giao', canhan: 'Cá nhân', nhogiup: 'Nhờ giúp' },
  LOAI_NGHI: { nghi_tuan: 'Lịch nghỉ tuần', nghi_om: 'Nghỉ ốm', doi_ca: 'Đổi ca' },

  /* ---------------- Gọi cổng ---------------- */
  live: function() { return SHIN_API.laCheDoLive(); },
  demo: function() { return (window.SHIN_DEMO_DATA || {}).phongkham || {}; },

  /** Gọi 1 cổng PK (du object). Demo ➜ trả mẫu theo tên cổng. Lỗi ➜ ném Error câu Việt. */
  goi: async function(hanh, du) {
    if (!this.live()) return (this.demo().cong || {})[hanh] || {};
    const kq = await SHIN_API.goi('PK', hanh, du || {});
    if (!kq.ok) { const e = new Error(SHIN_API.moTaLoi(kq)); e.loi = kq.loi; throw e; }
    return kq.data || {};
  },

  taiLive: async function() {
    const kd = await SHIN_API.goi('PK', 'webKhoiDong', {});
    if (!kd.ok) return kd;
    const hn = await SHIN_API.goi('PK', 'webHomNay', {});
    if (!hn.ok) return hn;
    return { ok: true, data: { live: true, kd: kd.data || {}, homnay: hn.data || {} } };
  },

  render: function(container, data) {
    const d = data || { kd: this.demo().cong.webKhoiDong, homnay: this.demo().cong.webHomNay };
    this._kd = d.kd || {};
    this._cache = { homnay: d.homnay || {} };
    this._anh = [];
    if (this.moThe().indexOf(this._tab) < 0) this._tab = 'homnay';
    const nd = this._kd.nguoi || {};
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${ShinApp.esc(nd.hoTen ? nd.hoTen + ' · ' + (nd.vaiTro || '') : 'Báo cáo ngày · Công việc · Lịch tuần')}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt" aria-label="Cài đặt">⚙️</button>
      </div>
      <div class="hang-chip pk-the" id="pkThe"></div>
      <div id="pkThan"></div>`;
    this.veThe();
    this.moTab(this._tab, true);
  },

  moThe: function() {
    const mo = (this._kd && this._kd.mo) || ['homnay', 'baocao', 'congviec', 'lich', 'thongbao', 'gopy', 'toi'];
    return this.THE.map(t => t[0]).filter(m => mo.indexOf(m) >= 0);
  },

  veThe: function() {
    const el = document.getElementById('pkThe');
    if (!el) return;
    const mo = this.moThe(), dem = (this._kd && this._kd.dem) || {};
    el.innerHTML = this.THE.filter(t => mo.indexOf(t[0]) >= 0).map(t => {
      const so = t[0] === 'duyet' ? dem.choDuyet : t[0] === 'thongbao' ? dem.thongBao : 0;
      return `<button class="chip-chon ${t[0] === this._tab ? 'dang-chon' : ''}" onclick="ModulePhongKham.moTab('${t[0]}')">${t[1]}${so ? ` <span class="badge do">${ShinApp.soVN(so)}</span>` : ''}</button>`;
    }).join('');
  },

  /** Mở 1 thẻ: dùng cache nếu có (dungCache), không thì gọi cổng của thẻ. */
  moTab: async function(tab, dungCache) {
    this._tab = tab;
    this.veThe();
    const than = document.getElementById('pkThan');
    if (!than) return;
    if (!(dungCache && this._cache[tab])) {
      than.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
      try {
        this._cache[tab] = await this.goi(this.CONG[tab], this.thamSo(tab));
      } catch (e) {
        if (this._tab !== tab) return;
        than.innerHTML = `<div class="trong">⚠️ ${ShinApp.esc(e.message)}</div>
          <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTab('${tab}')">↻ Tải lại</button></div>`;
        return;
      }
    }
    if (this._tab !== tab) return;
    than.innerHTML = this['ve_' + tab](this._cache[tab] || {});
  },

  thamSo: function(tab) {
    if (tab === 'congviec') return { loc: this._locViec };
    if (tab === 'nhansu') return { tim: this._timNS };
    if (tab === 'duyet') return { loc: '' };
    return {};
  },

  tai: function(tab) { delete this._cache[tab]; return this.moTab(tab); },

  /* ---------------- Mảnh giao diện dùng chung ---------------- */
  hero: function(so, nut) {
    const e = ShinApp.esc;
    return `<div class="hn-hero"><div class="tq-3so">${so.map(s =>
      `<div class="tq-o"><div class="tq-so" style="color:${s[2] || 'var(--c-blue)'}">${e(s[1])}</div><div class="tq-nhan">${e(s[0])}</div></div>`).join('')}</div>${nut || ''}</div>`;
  },
  tieu: function(chu) { return `<div class="hn-tieu"><span>${ShinApp.esc(chu)}</span></div>`; },
  dong: function(tieuDe, phu, badge, bam) {
    const e = ShinApp.esc;
    return `<div class="hn-dong" ${bam ? `role="button" tabindex="0" onclick="${bam}"` : ''}>
      <div class="dong-content"><div class="dong-title">${e(tieuDe)}</div>${phu ? `<div class="dong-sub">${e(phu)}</div>` : ''}</div>
      ${badge ? `<div class="dong-meta"><span class="badge ${badge[1]}">${e(badge[0])}</span></div>` : ''}</div>`;
  },
  trong: function(chu) { return `<div class="trong">${ShinApp.esc(chu)}</div>`; },
  so: function(n) { return ShinApp.soVN(n || 0); },
  /** dd/mm/yyyy hôm nay (hợp đồng PK – ShinApp.ngayVN() có thêm thứ). */
  homNay: function() { const d = new Date(), p = n => String(n).padStart(2, '0'); return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); },

  /* ---------------- 🏠 Hôm nay ---------------- */
  ve_homnay: function(h) {
    const bc = h.baoCaoHomNay === 'da_nop' ? ['Đã nộp', 'var(--c-green)'] : h.baoCaoHomNay === 'nghi' ? ['Nghỉ', 'var(--c-gray)'] : ['Chưa nộp', 'var(--c-red)'];
    const can = h.canXuLy || [], tb = (h.thongBaoMoi || []).slice(0, 3);
    return `<div class="hero-date">📅 ${ShinApp.esc(h.ngay || ShinApp.ngayVN())}</div>
      ${this.hero([['Việc quá hạn', this.so(h.viecQuaHan), h.viecQuaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Việc hôm nay', this.so(h.viecHomNay)], ['Báo cáo hôm nay', bc[0], bc[1]]],
        `<button class="btn-primary" onclick="ModulePhongKham.moTab('baocao')">${h.baoCaoHomNay === 'da_nop' ? '📄 Xem báo cáo' : '📝 Nộp báo cáo hôm nay'}</button>`)}
      ${h.choDuyet ? `<div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTab('duyet')">⚡ Chờ tôi duyệt: ${this.so(h.choDuyet)}</button></div>` : ''}
      ${this.tieu('CẦN XỬ LÝ · ' + can.length)}
      <div class="hn-list">${can.map(c => this.dong(c.ten, [c.nguon, c.han ? 'Hạn ' + c.han : ''].filter(Boolean).join(' · '), [c.muc === 'do' ? 'Gấp' : c.muc === 'vang' ? 'Sắp hạn' : 'Mở', this.MUC[c.muc] || 'xam'], `ModulePhongKham.moTab('${c.tab || 'congviec'}')`)).join('')}</div>
      ${can.length ? '' : this.trong('Không có việc cần xử lý. 👍')}
      ${this.tieu('THÔNG BÁO MỚI')}
      <div class="hn-list">${tb.map(t => this.dong(t.tieuDe, t.luc, t.daDoc ? null : ['Mới', 'vang'], "ModulePhongKham.moTab('thongbao')")).join('')}</div>
      ${tb.length ? `<div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTab('thongbao')">Xem tất cả</button></div>` : this.trong('Chưa có thông báo mới.')}`;
  },

  /* ---------------- 📝 Báo cáo ngày + minh chứng ---------------- */
  ve_baocao: function(b) {
    const e = ShinApp.esc, mau = b.mau || [];
    const ls = b.lichSu || [];
    return `${this.hero([['Đã nộp tháng này', this.so(b.soDaNop), 'var(--c-green)'], ['Chưa nộp', this.so(b.soChuaNop), b.soChuaNop ? 'var(--c-red)' : 'var(--c-gray)'], ['Chờ duyệt', this.so(b.soChoDuyet), 'var(--c-yellow)']])}
      ${this.tieu('NỘP BÁO CÁO NGÀY')}
      <div class="the pk-form">
        <div class="form-group"><label class="form-label" for="pkNgay">Ngày</label>
          <input id="pkNgay" class="form-input pk-nhap" value="${e(this.homNay())}" inputmode="numeric" placeholder="dd/mm/yyyy"></div>
        ${mau.map(m => `<div class="form-group"><label class="form-label" for="pkM_${e(m.ma)}">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so' ? `<input id="pkM_${e(m.ma)}" class="form-input pk-nhap" inputmode="decimal">` : `<textarea id="pkM_${e(m.ma)}" class="form-input pk-nhap" rows="3"></textarea>`}</div>`).join('')}
        <div class="form-group"><label class="form-label" for="pkAnh">📷 Ảnh minh chứng (≤ 6 ảnh)</label>
          <input id="pkAnh" type="file" accept="image/*" multiple class="form-input pk-nhap" onchange="ModulePhongKham.chonAnh(this, 6)"></div>
        <div id="pkXemAnh" class="pk-anh"></div>
        <button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">📤 Nộp báo cáo</button>
      </div>
      ${this.tieu('LỊCH SỬ · ' + ls.length + ' NGÀY')}
      <div class="hn-list">${ls.map(x => this.dong(x.ngay + (x.soAnh ? ' · 📷 ' + x.soAnh : ''), x.trangThai === 'tra_lai' && x.lyDoTraLai ? 'Trả lại: ' + x.lyDoTraLai : x.tomTat, this.TT_BC[x.trangThai] || [x.trangThai || '', 'xam'])).join('')}</div>
      ${ls.length ? '' : this.trong('Chưa có báo cáo trong tháng.')}`;
  },

  /** Đọc ảnh, thu ≤ 1600px JPEG, base64 không tiền tố (hợp đồng webNopBaoCao / webGuiGopY). */
  chonAnh: async function(input, toiDa) {
    const tep = Array.from(input.files || []);
    for (const f of tep) {
      if (this._anh.length >= toiDa) { ShinApp.toast(`Tối đa ${toiDa} ảnh.`, 'warn'); break; }
      try { this._anh.push(await this.nenAnh(f)); } catch (e) { ShinApp.toast('Không đọc được ảnh ' + f.name, 'error'); }
    }
    input.value = '';
    this.veAnh();
  },
  nenAnh: function(f) {
    return new Promise((ok, loi) => {
      const r = new FileReader();
      r.onerror = loi;
      r.onload = () => {
        const img = new Image();
        img.onerror = loi;
        img.onload = () => {
          const k = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          const url = c.toDataURL('image/jpeg', 0.82);
          ok({ ten: f.name.replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: url.split(',')[1], xem: url });
        };
        img.src = r.result;
      };
      r.readAsDataURL(f);
    });
  },
  veAnh: function() {
    const el = document.getElementById('pkXemAnh');
    if (!el) return;
    el.innerHTML = this._anh.map((a, i) => `<div class="pk-anh-o"><img src="${a.xem}" alt="Ảnh ${i + 1}"><button class="btn-icon" onclick="ModulePhongKham.xoaAnh(${i})" aria-label="Xóa ảnh ${i + 1}">✕</button></div>`).join('');
  },
  xoaAnh: function(i) { this._anh.splice(i, 1); this.veAnh(); },
  goiAnh: function() { return this._anh.map(a => ({ ten: a.ten, kieu: a.kieu, base64: a.base64 })); },

  nopBaoCao: function(nut) {
    const mau = (this._cache.baocao || {}).mau || [];
    const noiDung = {};
    for (const m of mau) {
      const el = document.getElementById('pkM_' + m.ma);
      const gt = el ? el.value.trim() : '';
      if (m.batBuoc && !gt) { ShinApp.toast(`Chưa điền "${m.nhan}".`, 'warn'); if (el) el.focus(); return; }
      noiDung[m.ma] = m.kieu === 'so' ? ShinApp.docSoVN(gt) : gt;
    }
    const ngay = (document.getElementById('pkNgay') || {}).value || this.homNay();
    if (!ShinApp.laNgayVN(ngay)) { ShinApp.toast('Ngày phải dạng dd/mm/yyyy.', 'warn'); return; }
    ShinApp.goiNut(nut, 'Đang nộp', async () => {
      const kq = await this.goi('webNopBaoCao', { ngay: ngay, noiDung: noiDung, anh: this.goiAnh() });
      this._anh = [];
      if (kq.loiAnh && kq.loiAnh.length) ShinApp.toast('Báo cáo đã ghi, nhưng lỗi ' + kq.loiAnh.join('; ') + ' – chọn lại ảnh đó.', 'warn');
      else ShinApp.toast(this.live() ? `Đã nộp báo cáo ${kq.ngay || ngay}.` : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      delete this._cache.homnay;
      this.tai('baocao');
    }, 'pkNopBC');
  },

  /* ---------------- ✅ Công việc ---------------- */
  ve_congviec: function(c) {
    const e = ShinApp.esc, ds = c.viec || [];
    const loc = [['', 'Tất cả'], ['giao', 'Được giao'], ['canhan', 'Cá nhân'], ['nhogiup', 'Nhờ giúp']];
    return `${this.hero([['Đang làm', this.so(c.dangLam)], ['Quá hạn', this.so(c.quaHan), c.quaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Xong tuần này', this.so(c.xongTuan), 'var(--c-green)']],
        `<button class="btn-primary" onclick="document.getElementById('pkViecMoi').hidden = false; document.getElementById('pkTenViec').focus()">＋ Việc cá nhân</button>`)}
      <div class="the pk-form" id="pkViecMoi" hidden>
        <div class="form-group"><label class="form-label" for="pkTenViec">Tên việc</label><input id="pkTenViec" class="form-input pk-nhap"></div>
        <div class="form-group"><label class="form-label" for="pkHanViec">Hạn (dd/mm/yyyy)</label><input id="pkHanViec" class="form-input pk-nhap" inputmode="numeric" value="${e(this.homNay())}"></div>
        <button class="btn-primary" onclick="ModulePhongKham.themViec(this)">Lưu việc</button>
      </div>
      <div class="hang-chip">${loc.map(l => `<button class="chip-chon ${l[0] === this._locViec ? 'dang-chon' : ''}" onclick="ModulePhongKham._locViec='${l[0]}'; ModulePhongKham.tai('congviec')">${l[1]}</button>`).join('')}</div>
      <div class="hn-list">${ds.map(v => `${this.dong(v.ten, [this.LOAI_VIEC[v.loai] || v.loai, v.han ? 'Hạn ' + v.han : '', v.nguoiGiao, (v.tienDo || 0) + '%'].filter(Boolean).join(' · '),
          [v.muc === 'do' ? 'Quá hạn' : v.muc === 'vang' ? 'Sắp hạn' : v.muc === 'xanh' ? 'Đúng hạn' : 'Mở', this.MUC[v.muc] || 'xam'], `ModulePhongKham.moViec('${e(v.id)}')`)}
          <div id="pkCT_${e(v.id).replace(/[^A-Za-z0-9_-]/g, '_')}"></div>`).join('')}</div>
      ${ds.length ? '' : this.trong('Không có việc nào.')}`;
  },
  idCT: function(id) { return 'pkCT_' + String(id).replace(/[^A-Za-z0-9_-]/g, '_'); },

  moViec: async function(id) {
    const el = document.getElementById(this.idCT(id));
    if (!el) return;
    if (this._moViec === id && el.innerHTML) { el.innerHTML = ''; this._moViec = ''; return; }
    this._moViec = id;
    el.innerHTML = '<div class="trong">Đang tải chi tiết…</div>';
    let v;
    try { v = await this.goi('webChiTietViec', { id: id }); } catch (e) { el.innerHTML = this.trong('⚠️ ' + e.message); return; }
    if (!this.live()) v = Object.assign({}, v, { id: id });
    const e = ShinApp.esc;
    this._ctViec = v;
    el.innerHTML = `<div class="the pk-form">
      ${v.moTa ? `<p class="chu-phu">${e(v.moTa)}</p>` : ''}
      <div class="form-group"><label class="form-label" for="pkTD">Tiến độ: <b id="pkTDso">${v.tienDo || 0}%</b></label>
        <input id="pkTD" type="range" min="0" max="100" step="10" value="${v.tienDo || 0}" class="pk-truot" oninput="document.getElementById('pkTDso').textContent = this.value + '%'"></div>
      ${(v.viecCon || []).map(c => `<label class="pk-tick"><input type="checkbox" data-id="${e(c.id)}" ${c.xong ? 'checked' : ''}> ${e(c.ten)}</label>`).join('')}
      ${(v.traoDoi || []).length ? this.tieu('TRAO ĐỔI') + v.traoDoi.map(t => `<div class="hang-tru"><span>${e(t.chu)}</span><span class="chu-phu">${e(t.nguoi)} · ${e(t.luc)}</span></div>`).join('') : ''}
      <div class="form-group"><label class="form-label" for="pkTraoDoi">Trao đổi thêm</label><textarea id="pkTraoDoi" class="form-input pk-nhap" rows="2"></textarea></div>
      <button class="btn-primary" onclick="ModulePhongKham.baoTienDo(this)">📈 Báo tiến độ</button>
    </div>`;
  },

  baoTienDo: function(nut) {
    const v = this._ctViec || {}, du = { id: v.id };
    const td = Number((document.getElementById('pkTD') || {}).value);
    if (td !== Number(v.tienDo || 0)) du.tienDo = td;
    const xongCu = (v.viecCon || []).filter(c => c.xong).map(c => String(c.id)).sort().join('|');
    const xongMoi = Array.from(document.querySelectorAll(`#${this.idCT(v.id)} .pk-tick input:checked`)).map(i => i.dataset.id);
    if (xongMoi.slice().sort().join('|') !== xongCu) du.viecConXong = xongMoi;
    const chu = ((document.getElementById('pkTraoDoi') || {}).value || '').trim();
    if (chu) du.traoDoiMoi = chu;
    if (Object.keys(du).length < 2) { ShinApp.toast('Chưa có gì thay đổi.', 'info'); return; }
    ShinApp.goiNut(nut, 'Đang lưu', async () => {
      await this.goi('webCapNhatViec', du);
      ShinApp.toast(this.live() ? 'Đã cập nhật việc.' : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      this._moViec = '';
      this.tai('congviec');
    }, 'pkViec');
  },

  themViec: function(nut) {
    const ten = (document.getElementById('pkTenViec').value || '').trim(), han = (document.getElementById('pkHanViec').value || '').trim();
    if (!ten) { ShinApp.toast('Nhập tên việc.', 'warn'); return; }
    if (han && !ShinApp.laNgayVN(han)) { ShinApp.toast('Hạn phải dạng dd/mm/yyyy.', 'warn'); return; }
    ShinApp.goiNut(nut, 'Đang lưu', async () => {
      await this.goi('webThemViecCaNhan', { ten: ten, han: han });
      ShinApp.toast(this.live() ? 'Đã thêm việc cá nhân.' : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      this.tai('congviec');
    }, 'pkThemViec');
  },

  /* ---------------- 📅 Nghỉ & lịch tuần (chỉ đọc) ---------------- */
  ve_lich: function(l) {
    const don = l.donNghi || [], ngay = l.ngay || [];
    return `${this.hero([['Phép còn', this.so(l.phepCon), 'var(--c-green)'], ['Nghỉ bù còn', this.so(l.nghiBuCon)], ['Đơn chờ duyệt', this.so(don.filter(d => d.trangThai === 'cho').length), 'var(--c-yellow)']],
        `<button class="btn-primary" onclick="ShinApp.moV1('PK', 'Xin nghỉ')">🏖 Xin nghỉ (trên app PK)</button>`)}
      ${this.tieu('LỊCH TUẦN ' + (l.tuan || ''))}
      <div class="hn-list">${ngay.map(n => this.dong(`${n.thu || ''} ${n.ngay || ''}`, n.nghi ? 'Nghỉ' + (n.le ? ' · ' + n.le : '') : [n.viTri, n.ca ? 'Ca ' + n.ca : ''].filter(Boolean).join(' · ') || '—',
          n.le ? ['Lễ', 'vang'] : n.nghi ? ['Nghỉ', 'xam'] : null)).join('')}</div>
      ${ngay.length ? '' : this.trong('Chưa có lịch tuần.')}
      ${this.tieu('ĐƠN NGHỈ CỦA TÔI · ' + don.length)}
      <div class="hn-list">${don.map(d => this.dong(`${this.LOAI_NGHI[d.loai] || d.loai} · ${d.tuNgay}${d.denNgay && d.denNgay !== d.tuNgay ? ' – ' + d.denNgay : ''}`,
          d.trangThai === 'tra_lai' && d.lyDoTraLai ? 'Trả lại: ' + d.lyDoTraLai : d.lyDo, this.TT_BC[d.trangThai] || [d.trangThai || '', 'xam'])).join('')}</div>
      ${don.length ? '' : this.trong('Chưa có đơn nghỉ.')}`;
  },

  /* ---------------- 🔔 Thông báo ---------------- */
  ve_thongbao: function(t) {
    const ds = t.ds || [], chua = ds.filter(x => !x.daDoc).length;
    return `${this.tieu('THÔNG BÁO · ' + chua + ' CHƯA ĐỌC')}
      ${chua ? `<div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.daDoc('tatca', this)">✓ Đánh dấu đã đọc tất cả</button></div>` : ''}
      <div class="hn-list">${ds.map(x => this.dong((x.daDoc ? '' : '● ') + x.tieuDe, [x.noiDung, x.luc].filter(Boolean).join(' · '), x.daDoc ? null : ['Mới', 'vang'],
          x.daDoc ? '' : `ModulePhongKham.daDoc('${ShinApp.esc(x.id)}')`)).join('')}</div>
      ${ds.length ? '' : this.trong('Chưa có thông báo.')}`;
  },
  daDoc: function(id, nut) {
    const ds = (this._cache.thongbao || {}).ds || [];
    const doi = ds.filter(x => !x.daDoc && (id === 'tatca' || String(x.id) === String(id)));
    if (!doi.length) return;
    doi.forEach(x => { x.daDoc = true; });
    this.moTab('thongbao', true);
    if (!this.live()) return;
    this.goi('webDaDocThongBao', { id: id }).catch(e => {
      doi.forEach(x => { x.daDoc = false; });
      this.moTab('thongbao', true);
      ShinApp.toast(e.message, 'error');
    });
  },

  /* ---------------- 💬 Góp ý ---------------- */
  ve_gopy: function(g) {
    const ds = g.ds || [];
    return `${this.tieu('GỬI GÓP Ý / BÁO LỖI')}
      <div class="the pk-form">
        <div class="form-group"><label class="form-label" for="pkGYLoai">Loại</label>
          <select id="pkGYLoai" class="form-input pk-nhap"><option value="gop_y">Góp ý</option><option value="bao_loi">Báo lỗi</option></select></div>
        <div class="form-group"><label class="form-label" for="pkGYNoiDung">Nội dung</label><textarea id="pkGYNoiDung" class="form-input pk-nhap" rows="3"></textarea></div>
        <div class="form-group"><label class="form-label" for="pkAnhGY">📷 Ảnh (≤ 3)</label>
          <input id="pkAnhGY" type="file" accept="image/*" multiple class="form-input pk-nhap" onchange="ModulePhongKham.chonAnh(this, 3)"></div>
        <div id="pkXemAnh" class="pk-anh"></div>
        <button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">📤 Gửi</button>
      </div>
      ${this.tieu('GÓP Ý CỦA TÔI · ' + ds.length)}
      <div class="hn-list">${ds.map(x => this.dong(`${x.loai === 'bao_loi' ? '🐞' : '💡'} ${x.noiDung}`, [x.luc, x.traLoi ? 'Trả lời: ' + x.traLoi : ''].filter(Boolean).join(' · '), this.TT_GY[x.trangThai] || [x.trangThai || '', 'xam'])).join('')}</div>
      ${ds.length ? '' : this.trong('Chưa gửi góp ý nào.')}`;
  },
  guiGopY: function(nut) {
    const noiDung = (document.getElementById('pkGYNoiDung').value || '').trim();
    if (!noiDung) { ShinApp.toast('Nhập nội dung góp ý.', 'warn'); return; }
    const du = { loai: document.getElementById('pkGYLoai').value, noiDung: noiDung, anh: this.goiAnh() };
    ShinApp.goiNut(nut, 'Đang gửi', async () => {
      await this.goi('webGuiGopY', du);
      this._anh = [];
      ShinApp.toast(this.live() ? 'Đã gửi góp ý – cảm ơn anh/chị.' : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      this.tai('gopy');
    }, 'pkGopY');
  },

  /* ---------------- 👤 Hồ sơ ---------------- */
  ve_toi: function(h) {
    const e = ShinApp.esc, kd = this._kd || {};
    const hang = [['Họ tên', h.hoTen], ['Vị trí', h.viTri], ['Tổ', h.to], ['Ngày vào', h.ngayVao], ['Email', h.email], ['Điện thoại', h.dienThoai]];
    return `${this.tieu('HỒ SƠ CỦA TÔI')}
      <div class="the">${hang.map(x => `<div class="hang-tru"><span class="chu-phu">${x[0]}</span><span>${e(x[1] || '—')}</span></div>`).join('')}</div>
      <details class="the pk-form"><summary>✏️ Đề nghị sửa hồ sơ</summary>
        <div class="form-group"><label class="form-label" for="pkSuaTruong">Mục cần sửa</label>
          <select id="pkSuaTruong" class="form-input pk-nhap">${hang.slice(1).map(x => `<option>${x[0]}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label" for="pkSuaGT">Giá trị mới</label><input id="pkSuaGT" class="form-input pk-nhap"></div>
        <div class="form-group"><label class="form-label" for="pkSuaLyDo">Lý do</label><input id="pkSuaLyDo" class="form-input pk-nhap"></div>
        <button class="btn-primary" onclick="ModulePhongKham.deNghiSua(this)">Gửi đề nghị</button>
      </details>
      <div class="chu-phu pk-chan">App PK ${e(((kd.app || {}).phienBan) || '')} · máy chủ 21_PhongPTKH</div>`;
  },
  deNghiSua: function(nut) {
    const du = { truong: document.getElementById('pkSuaTruong').value, giaTriMoi: document.getElementById('pkSuaGT').value.trim(), lyDo: document.getElementById('pkSuaLyDo').value.trim() };
    if (!du.giaTriMoi) { ShinApp.toast('Nhập giá trị mới.', 'warn'); return; }
    ShinApp.goiNut(nut, 'Đang gửi', async () => {
      await this.goi('webDeNghiSuaHoSo', du);
      ShinApp.toast(this.live() ? 'Đã gửi đề nghị – chờ lãnh đạo duyệt.' : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      this.tai('toi');
    }, 'pkSuaHS');
  },

  /* ---------------- ⚡ Duyệt (tổ trưởng / admin) ---------------- */
  ve_duyet: function(d) {
    const e = ShinApp.esc, bc = d.baoCao || [], ng = d.nghi || [], lt = d.lichTuan || [];
    const nutDuyet = (loai, id) => `<div class="hang-nut">
        <button class="btn-primary" onclick="ModulePhongKham.duyet('${loai}', '${e(id)}', 'dat')">✓ Duyệt</button>
        <button class="btn-secondary" onclick="ModulePhongKham.traLai('${loai}', '${e(id)}', this)">↩ Trả lại</button></div>`;
    return `${this.hero([['Báo cáo chờ', this.so(bc.length), 'var(--c-yellow)'], ['Đơn nghỉ chờ', this.so(ng.length), 'var(--c-yellow)'], ['Lịch tuần chờ', this.so(lt.length)]])}
      ${this.tieu('BÁO CÁO NGÀY · ' + bc.length)}
      ${bc.map(x => `<div class="the" id="pkD_baocao_${e(x.id)}">${this.dong(x.nguoi + ' · ' + x.ngay, x.tomTat)}
        ${(x.anh || []).length ? `<div class="pk-anh">${x.anh.map((u, i) => `<a class="pk-anh-o" href="${e(u)}" target="_blank" rel="noopener"><img src="${e(u)}" alt="Minh chứng ${i + 1}" loading="lazy"></a>`).join('')}</div>` : ''}
        ${nutDuyet('baocao', x.id)}</div>`).join('') || this.trong('Không có báo cáo chờ.')}
      ${this.tieu('ĐƠN NGHỈ · ' + ng.length)}
      ${ng.map(x => `<div class="the" id="pkD_nghi_${e(x.id)}">${this.dong(`${x.nguoi} · ${this.LOAI_NGHI[x.loai] || x.loai}`, `${x.tuNgay}${x.denNgay && x.denNgay !== x.tuNgay ? ' – ' + x.denNgay : ''} · ${x.lyDo || ''}`)}${nutDuyet('nghi', x.id)}</div>`).join('') || this.trong('Không có đơn nghỉ chờ.')}
      ${lt.length ? this.tieu('LỊCH TUẦN · ' + lt.length) + lt.map(x => `<div class="the" id="pkD_lichtuan_${e(x.id)}">${this.dong('Tổ ' + x.to, x.tuan)}${nutDuyet('lichtuan', x.id)}</div>`).join('') : ''}`;
  },

  /** Duyệt: Hoàn tác 6 giây – bấm Hoàn tác thì KHÔNG gửi gì; hết giờ gửi đúng 1 lần. */
  duyet: function(loai, id, ketQua, lyDo) {
    const the = document.getElementById(`pkD_${loai}_${id}`);
    const dem = this._kd && this._kd.dem;
    ShinApp.hanhDongHoanTac(ketQua === 'dat' ? 'Đã duyệt.' : 'Đã trả lại.', {
      lamTruoc: () => { if (the) the.hidden = true; if (dem && dem.choDuyet) { dem.choDuyet--; this.veThe(); } },
      traLai: () => { if (the) the.hidden = false; if (dem) { dem.choDuyet++; this.veThe(); } },
      thucHien: async () => {
        if (!this.live()) return;
        await this.goi('webDuyet', { loai: loai, ids: [id], ketQua: ketQua, lyDo: lyDo || '' });
        const ds = this._cache.duyet || {}, k = loai === 'baocao' ? 'baoCao' : loai === 'nghi' ? 'nghi' : 'lichTuan';
        ds[k] = (ds[k] || []).filter(x => String(x.id) !== String(id));
      }
    });
  },
  traLai: function(loai, id, nut) {
    const hang = nut.parentNode;
    if (hang.querySelector('.pk-lydo')) return;
    hang.insertAdjacentHTML('afterend', `<div class="form-group pk-lydo"><label class="form-label">Lý do trả lại *</label>
      <input class="form-input pk-nhap" aria-label="Lý do trả lại"><button class="btn-secondary">Gửi trả lại</button></div>`);
    const o = hang.nextElementSibling, inp = o.querySelector('input');
    inp.focus();
    o.querySelector('button').onclick = () => {
      const ly = inp.value.trim();
      if (!ly) { ShinApp.toast('Ghi lý do để người nộp biết sửa gì.', 'warn'); return; }
      o.remove();
      this.duyet(loai, id, 'tra_lai', ly);
    };
  },

  /* ---------------- 👥 Nhân sự (lãnh đạo / admin) ---------------- */
  ve_nhansu: function(n) {
    const e = ShinApp.esc, ds = n.ds || [], yc = n.yeuCauSua || [];
    return `${this.hero([['Đang làm', this.so(n.dangLam), 'var(--c-green)'], ['Mới vào tháng', this.so(n.moiVao)], ['Yêu cầu sửa chờ', this.so(n.choSua), n.choSua ? 'var(--c-yellow)' : 'var(--c-gray)']])}
      ${yc.length ? this.tieu('YÊU CẦU SỬA HỒ SƠ · ' + yc.length) + yc.map(y => `<div class="the" id="pkYC_${e(y.id)}">
        ${this.dong(`${y.hoTen} · ${y.truong}`, `${y.giaTriCu || '—'} ➜ ${y.giaTriMoi}${y.lyDo ? ' · ' + y.lyDo : ''}`)}
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.duyetHS('${e(y.id)}', true, '', this)">✓ Đồng ý</button>
        <button class="btn-secondary" onclick="ModulePhongKham.tuChoiHS('${e(y.id)}', this)">✕ Không duyệt</button></div></div>`).join('') : ''}
      ${this.tieu('NHÂN SỰ · ' + ds.length)}
      <div class="form-group"><input id="pkTimNS" class="form-input pk-nhap" type="search" placeholder="🔍 Tìm theo tên…" aria-label="Tìm nhân sự" value="${e(this._timNS)}"
        onkeydown="if (event.key === 'Enter') { ModulePhongKham._timNS = this.value.trim(); ModulePhongKham.tai('nhansu'); }"></div>
      <div class="hn-list">${ds.map(x => `${this.dong(x.hoTen, [x.viTri, x.to].filter(Boolean).join(' · '), [x.trangThai || 'Đang làm', /nghỉ/i.test(x.trangThai || '') ? 'xam' : 'xanh'], `ModulePhongKham.xemHS('${e(x.ma)}')`)}
        <div id="pkHS_${e(x.ma)}"></div>`).join('')}</div>
      ${ds.length ? '' : this.trong('Không tìm thấy nhân sự.')}`;
  },
  xemHS: async function(ma) {
    const el = document.getElementById('pkHS_' + ma);
    if (!el) return;
    if (el.innerHTML) { el.innerHTML = ''; return; }
    el.innerHTML = this.trong('Đang tải hồ sơ…');
    try {
      const h = await this.goi('webHoSoNhanSu', { ma: ma });
      const e = ShinApp.esc;
      el.innerHTML = `<div class="the">${[['Vị trí', h.viTri], ['Tổ', h.to], ['Ngày vào', h.ngayVao], ['Email', h.email], ['Điện thoại', h.dienThoai]]
        .map(x => `<div class="hang-tru"><span class="chu-phu">${x[0]}</span><span>${e(x[1] || '—')}</span></div>`).join('')}</div>`;
    } catch (err) { el.innerHTML = this.trong('⚠️ ' + err.message); }
  },
  duyetHS: function(id, dongY, lyDo, nut) {
    ShinApp.goiNut(nut, 'Đang lưu', async () => {
      await this.goi('webDuyetSuaHoSo', { id: id, dongY: dongY, lyDo: lyDo });
      ShinApp.toast(this.live() ? (dongY ? 'Đã duyệt sửa hồ sơ.' : 'Đã từ chối.') : 'Chế độ trình diễn: không gửi gì.', this.live() ? 'success' : 'info');
      this.tai('nhansu');
    }, 'pkHS_' + id);
  },
  tuChoiHS: function(id, nut) {
    const hang = nut.parentNode;
    if (hang.querySelector('.pk-lydo')) return;
    hang.insertAdjacentHTML('afterend', `<div class="form-group pk-lydo"><input class="form-input pk-nhap" placeholder="Lý do không duyệt *" aria-label="Lý do không duyệt"><button class="btn-secondary">Gửi</button></div>`);
    const o = hang.nextElementSibling, inp = o.querySelector('input');
    inp.focus();
    o.querySelector('button').onclick = (ev) => {
      const ly = inp.value.trim();
      if (!ly) { ShinApp.toast('Ghi rõ lý do không duyệt để nhân viên biết.', 'warn'); return; }
      this.duyetHS(id, false, ly, ev.currentTarget);
    };
  }
};
