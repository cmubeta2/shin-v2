/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH – app PK v1.0.7, dùng chung file dữ liệu PTKH)
 * v2.6.5 – nối thật L1–L5 theo hợp đồng KE_HOACH_GIAO_DIEN_PK_AGY.md mục 4 (HOP_DONG_CONG_V2.md mục PK).
 * Máy chủ PK nhận ham(token, du) với du là ĐỐI TƯỢNG (không phải du.a) ➜ gọi SHIN_API.goi('PK', 'webX', {...}).
 * Tab theo webKhoiDong().mo: homnay · baocao · congviec · lich · thongbao · gopy · toi · duyet (tổ trưởng / admin) · nhansu (lãnh đạo / admin).
 * Mỗi tab tải khi mở lần đầu; lỗi cổng ➜ dải đỏ trong tab, KHÔNG thay bằng số mẫu. Demo (không token) ➜ DEMO bên dưới.
 * Xếp lịch tuần (ghi) vẫn làm trên app PK (mở v1).
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  TAB: { homnay: '🏠 Hôm nay', baocao: '📝 Báo cáo', congviec: '✅ Công việc', lich: '📅 Lịch tuần', thongbao: '🔔 Thông báo',
    gopy: '💬 Góp ý', toi: '👤 Hồ sơ', duyet: '⚡ Duyệt', nhansu: '👥 Nhân sự' },
  CONG: { homnay: ['webHomNay'], baocao: ['webBaoCao'], congviec: ['webCongViec'], lich: ['webLichTuan'], thongbao: ['webThongBao'],
    gopy: ['webGopYCuaToi'], toi: ['webHoSo'], duyet: ['webChoDuyet', { loai: 'tatca' }], nhansu: ['webNhanSu', { tim: '' }] },
  TT_BC: { da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] },
  TT_GY: { moi: ['Mới', 'vang'], dang_xu_ly: ['Đang xử lý', 'vang'], xong: ['Xong', 'xanh'] },
  LOAI_VIEC: { giao: 'Được giao', canhan: 'Cá nhân', nhogiup: 'Nhờ giúp' },
  MAU_BC_MAC_DINH: [{ ma: 'daLam', nhan: 'Việc đã làm', kieu: 'chu', batBuoc: true }, { ma: 'ketQua', nhan: 'Kết quả', kieu: 'chu' },
    { ma: 'khoKhan', nhan: 'Khó khăn', kieu: 'chu' }, { ma: 'keHoach', nhan: 'Kế hoạch ngày mai', kieu: 'chu' }],

  _live: false, _kd: null, _tab: 'homnay', _du: {}, _loi: {}, _anh: [], _locViec: '',

  taiLive: async function() {
    const [kd, hn] = await Promise.all([SHIN_API.goi('PK', 'webKhoiDong', {}), SHIN_API.goi('PK', 'webHomNay', {})]);
    if (!kd.ok) return kd;
    return { ok: true, data: { live: true, khoiDong: kd.data, homnay: hn.ok ? hn.data : null, loiHomNay: hn.ok ? null : hn } };
  },

  render: function(container, data) {
    const live = !!(data && data.live);
    this._live = live;
    this._du = {}; this._loi = {}; this._anh = [];
    if (live) {
      this._kd = data.khoiDong || {};
      if (data.homnay) this._du.homnay = data.homnay;
      if (data.loiHomNay) this._loi.homnay = SHIN_API.moTaLoi(data.loiHomNay);
    } else {
      this._kd = this.DEMO.khoiDong;
      Object.keys(this.DEMO).forEach(k => { if (k !== 'khoiDong') this._du[k] = this.DEMO[k]; });
    }
    if (!this.dsTab().includes(this._tab)) this._tab = 'homnay';
    const e = ShinApp.esc, nd = this._kd.nguoi || {};
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${e(nd.hoTen || '')}${nd.vaiTro ? ' · ' + e(nd.vaiTro) : ''}${nd.to ? ' · ' + e(nd.to) : ''}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>
      <div class="hang-chip" id="pkTab"></div>
      <div id="pkNoi"></div>`;
    this.moTab(this._tab);
  },

  dsTab: function() {
    const mo = (this._kd && this._kd.mo) || [];
    return Object.keys(this.TAB).filter(t => mo.includes(t));
  },

  veTab: function() {
    const el = document.getElementById('pkTab');
    if (!el) return;
    const dem = (this._kd && this._kd.dem) || {};
    el.innerHTML = this.dsTab().map(t => {
      const so = t === 'thongbao' ? dem.thongBao : t === 'duyet' ? dem.choDuyet : 0;
      return `<button class="chip-chon ${t === this._tab ? 'dang-chon' : ''}" onclick="ModulePhongKham.moTab('${t}')">${this.TAB[t]}${so ? ' · ' + ShinApp.soVN(so) : ''}</button>`;
    }).join('');
  },

  moTab: async function(t, taiLai) {
    this._tab = t;
    this.veTab();
    const noi = document.getElementById('pkNoi');
    if (!noi) return;
    if (this._live && (taiLai || (!this._du[t] && !this._loi[t]))) {
      noi.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
      const c = this.CONG[t];
      const kq = await SHIN_API.goi('PK', c[0], c[1] || {});
      if (this._tab !== t || !noi.isConnected) return;
      if (kq.ok) { this._du[t] = kq.data || {}; delete this._loi[t]; }
      else { delete this._du[t]; this._loi[t] = SHIN_API.moTaLoi(kq); }
    }
    if (this._loi[t]) {
      noi.innerHTML = `<div class="trong">⚠️ ${ShinApp.esc(this._loi[t])}<br><button class="btn-secondary" onclick="ModulePhongKham.moTab('${t}', true)">Thử lại</button></div>`;
      return;
    }
    const ve = this['ve_' + t];
    noi.innerHTML = ve ? ve.call(this, this._du[t] || {}) : '';
  },

  /* ---------- tiện ích ---------- */
  hero: function(o, nut) {
    const e = ShinApp.esc;
    return `<div class="hn-hero"><div class="tq-3so">${o.map(s => `<div class="tq-o"><div class="tq-so" style="color:${s[2] || 'var(--c-blue)'}">${e(s[1])}</div><div class="tq-nhan">${e(s[0])}</div></div>`).join('')}</div>${nut || ''}</div>`;
  },
  dong: function(tieuDe, phu, badge, bam) {
    const e = ShinApp.esc;
    return `<div class="hn-dong"${bam ? ` onclick="${bam}" style="cursor:pointer"` : ''}><div class="dong-content"><div class="dong-title">${tieuDe}</div>${phu ? `<div class="dong-sub">${phu}</div>` : ''}</div>${badge ? `<div class="dong-meta"><span class="badge ${badge[1]}">${e(badge[0])}</span></div>` : ''}</div>`;
  },
  so: function(n) { return ShinApp.soVN(n || 0); },
  ngayNay: function() { const d = new Date(), p = x => (x < 10 ? '0' : '') + x; return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`; },
  chiXem: function() { const q = ((this._kd || {}).nguoi || {}).quyen || []; return q.includes('xemthu'); },
  async gui(hanh, du) {
    if (!this._live) throw new Error('Chế độ trình diễn – có token Hub mới gửi được lên app PK.');
    if (this.chiXem()) throw new Error('Tài khoản Xem thử chỉ được xem.');
    const kq = await SHIN_API.goi('PK', hanh, du);
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    return kq.data || {};
  },

  /* ---------- 🏠 Hôm nay ---------- */
  ve_homnay: function(d) {
    const e = ShinApp.esc, daNop = d.baoCaoHomNay === 'da_nop';
    const can = d.canXuLy || [], tb = d.thongBaoMoi || [];
    return this.hero([['Việc quá hạn', this.so(d.viecQuaHan), d.viecQuaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Việc hôm nay', this.so(d.viecHomNay)],
      ['Báo cáo hôm nay', d.baoCaoHomNay === 'nghi' ? 'Nghỉ' : daNop ? 'Đã nộp' : 'Chưa nộp', daNop ? 'var(--c-green)' : 'var(--c-yellow)']],
      `<div class="hero-date">📅 ${e(d.ngay || this.ngayNay())}</div><button class="btn-primary" onclick="ModulePhongKham.moTab('baocao')">📝 ${daNop ? 'Xem báo cáo' : 'Nộp báo cáo hôm nay'}</button>`) +
      (d.choDuyet ? `<div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTab('duyet')">⚡ Chờ tôi duyệt: ${this.so(d.choDuyet)}</button></div>` : '') +
      `<div class="hn-tieu"><span>CẦN XỬ LÝ · ${can.length}</span></div><div class="hn-list">${can.map(v => this.dong(e(v.ten), `${e(v.nguon || '')}${v.han ? ' · hạn ' + e(v.han) : ''}`, [v.muc === 'do' ? 'Gấp' : v.muc === 'vang' ? 'Sắp hạn' : v.muc === 'xanh' ? 'Còn hạn' : 'Không hạn', v.muc || 'xam'], `ModulePhongKham.moTab('${v.tab || 'congviec'}')`)).join('')}</div>` +
      (can.length ? '' : '<div class="trong">Không có việc cần xử lý 👍</div>') +
      (tb.length ? `<div class="hn-tieu"><span>THÔNG BÁO MỚI</span><button class="nut-chu" onclick="ModulePhongKham.moTab('thongbao')">Xem tất cả ›</button></div>${tb.slice(0, 3).map(x => this.dong(e(x.tieuDe), e(x.luc || ''))).join('')}` : '');
  },

  /* ---------- 📝 Báo cáo ngày + minh chứng ---------- */
  ve_baocao: function(d) {
    const e = ShinApp.esc, mau = (d.mau && d.mau.length) ? d.mau : this.MAU_BC_MAC_DINH, ls = d.lichSu || [];
    return this.hero([['Ngày đã nộp (tháng)', this.so(d.soDaNop), 'var(--c-green)'], ['Ngày chưa nộp', this.so(d.soChuaNop), d.soChuaNop ? 'var(--c-red)' : 'var(--c-gray)'], ['Chờ duyệt', this.so(d.soChoDuyet), 'var(--c-yellow)']]) +
      `<div class="hn-tieu"><span>NỘP BÁO CÁO NGÀY ${e(this.ngayNay())}</span></div>
      <div class="hn-list" style="padding:12px">
        ${mau.map(m => `<label class="nhan-o" for="pkBC_${e(m.ma)}">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so' ? `<input id="pkBC_${e(m.ma)}" class="form-input" inputmode="decimal" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}">`
            : `<textarea id="pkBC_${e(m.ma)}" class="form-input" rows="3" maxlength="2000" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}"></textarea>`}`).join('')}
        <label class="nhan-o" for="pkAnh">📷 Ảnh minh chứng (tối đa 6)</label>
        <input id="pkAnh" class="form-input" type="file" accept="image/*" multiple onchange="ModulePhongKham.chonAnh(this)">
        <div id="pkAnhXem" class="hang-chip"></div>
        <button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">📤 Nộp báo cáo</button>
      </div>
      <div class="hn-tieu"><span>LỊCH SỬ 30 NGÀY · ${ls.length}</span></div>
      <div class="hn-list">${ls.map(x => this.dong(e(x.ngay), `${e(x.tomTat || '')}${x.soAnh ? ' · 📷 ' + this.so(x.soAnh) : ''}${x.lyDoTraLai ? ' · Lý do: ' + e(x.lyDoTraLai) : ''}`, this.TT_BC[x.trangThai] || [x.trangThai || '', 'xam'])).join('')}</div>
      ${ls.length ? '' : '<div class="trong">Chưa có báo cáo nào.</div>'}`;
  },
  veAnh: function() {
    const el = document.getElementById('pkAnhXem');
    if (el) el.innerHTML = this._anh.map((a, i) => `<button class="chip-chon" onclick="ModulePhongKham.boAnh(${i})" title="Bỏ ảnh">🖼 ${ShinApp.esc(a.ten.slice(0, 18))} ✕</button>`).join('');
  },
  boAnh: function(i) { this._anh.splice(i, 1); this.veAnh(); },
  chonAnh: async function(o) {
    const ds = Array.from(o.files || []);
    o.value = '';
    for (const f of ds) {
      if (this._anh.length >= 6) { ShinApp.toast('Tối đa 6 ảnh minh chứng.', 'warn'); break; }
      try { this._anh.push(await this.thuAnh(f)); } catch (err) { ShinApp.toast(`Không đọc được ảnh ${f.name}.`, 'error'); }
    }
    this.veAnh();
  },
  /** Ảnh ➜ JPEG cạnh dài ≤ 1600px, base64 không tiền tố data: (đúng hợp đồng webNopBaoCao). */
  thuAnh: function(f) {
    return new Promise((ok, loi) => {
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.width, img.height)), cv = document.createElement('canvas');
        cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        ok({ ten: f.name.replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: cv.toDataURL('image/jpeg', 0.82).split(',')[1] });
      };
      img.onerror = () => { URL.revokeObjectURL(url); loi(new Error('anh')); };
      img.src = url;
    });
  },
  nopBaoCao: function(nut) {
    const noiDung = {};
    let thieu = '';
    document.querySelectorAll('#pkNoi [data-ma]').forEach(o => {
      const v = o.value.trim();
      if (o.dataset.bb && !v && !thieu) thieu = o.previousElementSibling ? o.previousElementSibling.textContent.replace(' *', '') : 'mục bắt buộc';
      noiDung[o.dataset.ma] = v;
    });
    if (thieu) { ShinApp.toast(`Chưa điền: ${thieu}.`, 'warn'); return; }
    ShinApp.goiNut(nut, 'Đang nộp…', async () => {
      const kq = await this.gui('webNopBaoCao', { ngay: this.ngayNay(), noiDung, anh: this._anh });
      this._anh = [];
      ShinApp.toast(kq.loiAnh && kq.loiAnh.length ? `Đã nộp báo cáo, nhưng ${kq.loiAnh.length} ảnh lỗi – chọn lại ảnh giúp em.` : 'Đã nộp báo cáo ngày ✓', kq.loiAnh && kq.loiAnh.length ? 'warn' : 'success');
      delete this._du.homnay;
      this.moTab('baocao', true);
    }, 'pkNopBC');
  },

  /* ---------- ✅ Công việc ---------- */
  ve_congviec: function(d) {
    const e = ShinApp.esc, loc = this._locViec, ds = (d.viec || []).filter(v => !loc || v.loai === loc);
    return this.hero([['Đang làm', this.so(d.dangLam)], ['Quá hạn', this.so(d.quaHan), d.quaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Xong tuần này', this.so(d.xongTuan), 'var(--c-green)']],
      `<button class="btn-primary" onclick="ModulePhongKham.themViec(this)">＋ Việc cá nhân</button>`) +
      `<div class="hang-chip">${[['', 'Tất cả']].concat(Object.entries(this.LOAI_VIEC)).map(([k, n]) => `<button class="chip-chon ${k === loc ? 'dang-chon' : ''}" onclick="ModulePhongKham._locViec='${k}';ModulePhongKham.moTab('congviec')">${n}</button>`).join('')}</div>
      <div class="hn-list">${ds.map(v => this.dong(e(v.ten), `${e(this.LOAI_VIEC[v.loai] || '')}${v.nguoiGiao ? ' · ' + e(v.nguoiGiao) : ''}${v.han ? ' · hạn ' + e(v.han) : ''} · ${this.so(v.tienDo)}%`,
        [v.muc === 'do' ? 'Quá hạn' : v.muc === 'vang' ? 'Sắp hạn' : 'Đang làm', v.muc || 'xam'], `ModulePhongKham.chiTietViec('${e(String(v.id)).replace(/'/g, '')}', this)`) + `<div id="pkCT_${e(String(v.id)).replace(/[^\w-]/g, '_')}"></div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Không có việc.</div>'}`;
  },
  themViec: function(nut) {
    const ten = (window.prompt('Tên việc cá nhân:') || '').trim();
    if (!ten) return;
    const han = (window.prompt('Hạn (dd/mm/yyyy, để trống = không hạn):', this.ngayNay()) || '').trim();
    ShinApp.goiNut(nut, 'Đang lưu…', async () => {
      await this.gui('webThemViecCaNhan', { ten, han });
      ShinApp.toast('Đã thêm việc cá nhân ✓');
      this.moTab('congviec', true);
    }, 'pkThemViec');
  },
  chiTietViec: async function(id) {
    const o = document.getElementById('pkCT_' + id.replace(/[^\w-]/g, '_'));
    if (!o) return;
    if (o.innerHTML) { o.innerHTML = ''; return; }
    const e = ShinApp.esc;
    let v;
    if (this._live) {
      o.innerHTML = '<div class="trong">Đang tải…</div>';
      const kq = await SHIN_API.goi('PK', 'webChiTietViec', { id });
      if (!kq.ok) { o.innerHTML = `<div class="trong">⚠️ ${e(SHIN_API.moTaLoi(kq))}</div>`; return; }
      v = kq.data || {};
    } else v = this.DEMO.chiTiet;
    o.innerHTML = `<div class="hn-list" style="padding:12px">
      ${v.moTa ? `<div class="dong-sub">${e(v.moTa)}</div>` : ''}
      ${(v.viecCon || []).map(c => `<div class="hang-tru"><span>${c.xong ? '✓ ' : '○ '}${e(c.ten)}</span></div>`).join('')}
      ${(v.traoDoi || []).slice(-5).map(t => `<div class="hang-tru"><span><b>${e(t.nguoi)}</b>: ${e(t.chu)}</span><span class="chu-phu">${e(t.luc || '')}</span></div>`).join('')}
      <label class="nhan-o" for="pkTD_${e(id)}">Tiến độ: <b id="pkTDso_${e(id)}">${this.so(v.tienDo)}</b>%</label>
      <input id="pkTD_${e(id)}" type="range" min="0" max="100" step="10" value="${Number(v.tienDo) || 0}" style="width:100%;min-height:44px" oninput="document.getElementById('pkTDso_${e(id)}').textContent=this.value">
      <button class="btn-secondary" onclick="ModulePhongKham.baoTienDo('${e(id)}', this)">Báo tiến độ</button></div>`;
  },
  baoTienDo: function(id, nut) {
    const o = document.getElementById('pkTD_' + id);
    if (!o) return;
    ShinApp.goiNut(nut, 'Đang lưu…', async () => {
      await this.gui('webCapNhatViec', { id, tienDo: Number(o.value) });
      ShinApp.toast('Đã báo tiến độ ✓');
      this.moTab('congviec', true);
    }, 'pkTD');
  },

  /* ---------- 📅 Lịch tuần (chỉ đọc) ---------- */
  ve_lich: function(d) {
    const e = ShinApp.esc, don = d.donNghi || [];
    return this.hero([['Phép còn', this.so(d.phepCon), 'var(--c-green)'], ['Nghỉ bù còn', this.so(d.nghiBuCon)], ['Đơn chờ duyệt', this.so(don.filter(x => x.trangThai === 'cho').length), 'var(--c-yellow)']],
      `<div class="hero-date">🗓 ${e(d.tuan || '')}</div><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Xin nghỉ / xếp lịch')">Xin nghỉ trên app PK ›</button>`) +
      `<div class="hn-tieu"><span>LỊCH TUẦN CỦA TÔI</span></div><div class="hn-list">${(d.ngay || []).map(n => this.dong(`${e(n.thu || '')} ${e(n.ngay || '')}`, n.nghi ? e(n.nghi === true ? 'Nghỉ' : n.nghi) : `${e(n.viTri || '')}${n.ca ? ' · Ca ' + e(n.ca) : ''}`, n.le ? ['Lễ', 'vang'] : n.nghi ? ['Nghỉ', 'xam'] : null)).join('')}</div>` +
      (don.length ? `<div class="hn-tieu"><span>ĐƠN NGHỈ CỦA TÔI · ${don.length}</span></div><div class="hn-list">${don.map(x => this.dong(`${e(x.loai || '')} · ${e(x.tuNgay || '')}${x.denNgay && x.denNgay !== x.tuNgay ? ' → ' + e(x.denNgay) : ''}`, e(x.lyDo || '') + (x.lyDoTraLai ? ' · Trả lại: ' + e(x.lyDoTraLai) : ''), this.TT_BC[x.trangThai] || [x.trangThai || '', 'xam'])).join('')}</div>` : '');
  },

  /* ---------- 🔔 Thông báo ---------- */
  ve_thongbao: function(d) {
    const e = ShinApp.esc, ds = d.ds || [];
    return `<div class="hn-tieu"><span>THÔNG BÁO · ${ds.filter(x => !x.daDoc).length} chưa đọc</span>${ds.some(x => !x.daDoc) ? '<button class="nut-chu" onclick="ModulePhongKham.docTB(\'tatca\')">Đánh dấu đã đọc tất cả</button>' : ''}</div>
      <div class="hn-list">${ds.map(x => this.dong(`${x.daDoc ? '' : '● '}${x.daDoc ? e(x.tieuDe) : '<b>' + e(x.tieuDe) + '</b>'}`, `${e(x.noiDung || '')}${x.luc ? ' · ' + e(x.luc) : ''}`, null, x.daDoc ? '' : `ModulePhongKham.docTB('${e(String(x.id)).replace(/'/g, '')}')`)).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Chưa có thông báo.</div>'}`;
  },
  docTB: async function(id) {
    const ds = (this._du.thongbao || {}).ds || [];
    const cu = ds.map(x => x.daDoc);
    ds.forEach(x => { if (id === 'tatca' || String(x.id) === id) x.daDoc = true; });
    this.moTab('thongbao');
    if (!this._live) return;
    const kq = await SHIN_API.goi('PK', 'webDaDocThongBao', { id });
    if (!kq.ok) { ds.forEach((x, i) => { x.daDoc = cu[i]; }); this.moTab('thongbao'); ShinApp.toast(SHIN_API.moTaLoi(kq), 'error'); return; }
    if (this._kd.dem) { this._kd.dem.thongBao = ds.filter(x => !x.daDoc).length; this.veTab(); }
  },

  /* ---------- 💬 Góp ý ---------- */
  ve_gopy: function(d) {
    const e = ShinApp.esc, ds = d.ds || [];
    return `<div class="hn-tieu"><span>GỬI GÓP Ý / BÁO LỖI</span></div>
      <div class="hn-list" style="padding:12px">
        <label class="nhan-o" for="pkGYLoai">Loại</label>
        <select id="pkGYLoai" class="form-input"><option value="gop_y">Góp ý</option><option value="bao_loi">Báo lỗi</option></select>
        <label class="nhan-o" for="pkGYChu">Nội dung *</label>
        <textarea id="pkGYChu" class="form-input" rows="3" maxlength="2000"></textarea>
        <button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">Gửi</button>
      </div>
      <div class="hn-tieu"><span>GÓP Ý CỦA TÔI · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(x => this.dong(e(x.noiDung || ''), `${x.loai === 'bao_loi' ? 'Báo lỗi' : 'Góp ý'}${x.luc ? ' · ' + e(x.luc) : ''}${x.traLoi ? ' · Trả lời: ' + e(x.traLoi) : ''}`, this.TT_GY[x.trangThai] || [x.trangThai || '', 'xam'])).join('')}</div>`;
  },
  guiGopY: function(nut) {
    const o = document.getElementById('pkGYChu'), noiDung = o ? o.value.trim() : '';
    if (!noiDung) { ShinApp.toast('Chưa có nội dung góp ý.', 'warn'); return; }
    ShinApp.goiNut(nut, 'Đang gửi…', async () => {
      await this.gui('webGuiGopY', { loai: document.getElementById('pkGYLoai').value, noiDung, anh: [] });
      ShinApp.toast('Đã gửi góp ý ✓');
      this.moTab('gopy', true);
    }, 'pkGopY');
  },

  /* ---------- 👤 Hồ sơ ---------- */
  ve_toi: function(d) {
    const e = ShinApp.esc, app = (this._kd || {}).app || {};
    return `<div class="hn-hero"><div class="hero-greet">${e(d.hoTen || '')}</div><div class="hero-date">${e(d.viTri || '')}${d.to ? ' · ' + e(d.to) : ''}</div></div>
      <div class="hn-list">${[['Ngày vào', d.ngayVao], ['Email', d.email], ['Điện thoại', d.dienThoai]].map(r => `<div class="hang-tru"><span>${r[0]}</span><span class="chu-phu">${e(r[1] || '–')}</span></div>`).join('')}</div>
      <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Đề nghị sửa hồ sơ')">Đề nghị sửa hồ sơ ›</button></div>
      ${app.phienBan ? `<div class="trong">App PK ${e(app.phienBan)}</div>` : ''}`;
  },

  /* ---------- ⚡ Duyệt (tổ trưởng / admin) ---------- */
  ve_duyet: function(d) {
    const e = ShinApp.esc, bc = d.baoCao || [], ng = d.nghi || [], lt = d.lichTuan || [];
    const nut = (loai, id) => `<span class="hang-chip" style="margin:0"><button class="chip-chon" onclick="event.stopPropagation();ModulePhongKham.duyet('${loai}','${e(String(id)).replace(/'/g, '')}','dat')">✓ Duyệt</button><button class="chip-chon" onclick="event.stopPropagation();ModulePhongKham.duyet('${loai}','${e(String(id)).replace(/'/g, '')}','tra_lai')">↩ Trả lại</button></span>`;
    const muc = (tieu, phu, loai, id) => `<div class="hn-dong"><div class="dong-content"><div class="dong-title">${tieu}</div><div class="dong-sub">${phu}</div>${nut(loai, id)}</div></div>`;
    return this.hero([['Báo cáo chờ', this.so(bc.length), 'var(--c-yellow)'], ['Đơn nghỉ chờ', this.so(ng.length)], ['Lịch tuần chờ', this.so(lt.length)]]) +
      `<div class="hn-tieu"><span>BÁO CÁO NGÀY · ${bc.length}</span></div><div class="hn-list">${bc.map(x => muc(`${e(x.nguoi)} · ${e(x.ngay)}`, `${e(x.tomTat || '')}${(x.anh || []).length ? ' · ' + (x.anh || []).map((u, i) => /^https:\/\//.test(u) ? `<a href="${e(u)}" target="_blank" rel="noopener">📷${i + 1}</a>` : '').join(' ') : ''}`, 'baocao', x.id)).join('')}</div>` +
      `<div class="hn-tieu"><span>ĐƠN NGHỈ · ${ng.length}</span></div><div class="hn-list">${ng.map(x => muc(`${e(x.nguoi)} · ${e(x.loai || '')}`, `${e(x.tuNgay || '')}${x.denNgay && x.denNgay !== x.tuNgay ? ' → ' + e(x.denNgay) : ''} · ${e(x.lyDo || '')}`, 'nghi', x.id)).join('')}</div>` +
      (lt.length ? `<div class="hn-tieu"><span>LỊCH TUẦN · ${lt.length}</span></div><div class="hn-list">${lt.map(x => muc(`${e(x.to || '')}`, e(x.tuan || ''), 'lichtuan', x.id)).join('')}</div>` : '') +
      (bc.length + ng.length + lt.length ? '' : '<div class="trong">Không có gì chờ duyệt 👍</div>');
  },
  duyet: function(loai, id, ketQua) {
    let lyDo = '';
    if (ketQua === 'tra_lai') { lyDo = (window.prompt('Lý do trả lại (bắt buộc):') || '').trim(); if (!lyDo) return; }
    const d = this._du.duyet || {}, khoa = { baocao: 'baoCao', nghi: 'nghi', lichtuan: 'lichTuan' }[loai];
    const ds = d[khoa] || [], vt = ds.findIndex(x => String(x.id) === id);
    if (vt < 0) return;
    const muc = ds[vt];
    ShinApp.hanhDongHoanTac(ketQua === 'dat' ? 'Đã duyệt' : 'Đã trả lại', {
      lamTruoc: () => { ds.splice(vt, 1); this.moTab('duyet'); },
      traLai: () => { if (!ds.includes(muc)) ds.splice(Math.min(vt, ds.length), 0, muc); this.moTab('duyet'); },
      thucHien: async () => {
        await this.gui('webDuyet', { loai, ids: [id], ketQua, lyDo });
        if (this._kd.dem && this._kd.dem.choDuyet) { this._kd.dem.choDuyet--; this.veTab(); }
      }
    });
  },

  /* ---------- 👥 Nhân sự (lãnh đạo / admin) ---------- */
  ve_nhansu: function(d) {
    const e = ShinApp.esc, ds = d.ds || [], yc = d.yeuCauSua || [];
    return this.hero([['Đang làm', this.so(d.dangLam), 'var(--c-green)'], ['Mới vào tháng', this.so(d.moiVao)], ['Yêu cầu sửa chờ', this.so(d.choSua), d.choSua ? 'var(--c-yellow)' : 'var(--c-gray)']]) +
      `<input class="form-input" placeholder="🔍 Tìm theo tên…" oninput="ModulePhongKham.timNS(this.value)">
      <div class="hn-list" id="pkNS">${this.dsNS(ds, '')}</div>` +
      (yc.length ? `<div class="hn-tieu"><span>YÊU CẦU SỬA HỒ SƠ · ${yc.length}</span></div><div class="hn-list">${yc.map(x => this.dong(`${e(x.hoTen)} · ${e(x.truong)}`, `${e(x.giaTriCu || '–')} → ${e(x.giaTriMoi || '')}${x.lyDo ? ' · ' + e(x.lyDo) : ''}`, ['Chờ', 'vang'])).join('')}</div>
        <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Duyệt sửa hồ sơ')">Duyệt trên app PK ›</button></div>` : '');
  },
  dsNS: function(ds, tim) {
    const e = ShinApp.esc, t = String(tim || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const loc = ds.filter(x => !t || String(x.hoTen || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').includes(t));
    return loc.map(x => this.dong(e(x.hoTen), `${e(x.viTri || '')}${x.to ? ' · ' + e(x.to) : ''}`, [x.trangThai || '', /nghỉ/i.test(x.trangThai || '') ? 'xam' : 'xanh'])).join('') || '<div class="trong">Không tìm thấy.</div>';
  },
  timNS: function(v) { const o = document.getElementById('pkNS'); if (o) o.innerHTML = this.dsNS((this._du.nhansu || {}).ds || [], v); },

  /* ---------- Dữ liệu trình diễn (đúng dạng hợp đồng; tên giả) ---------- */
  DEMO: {
    khoiDong: { nguoi: { hoTen: 'Người dùng mẫu', vaiTro: 'Tổ trưởng', to: 'Tổ CSKH', viTri: 'CSKH', quyen: ['nv', 'totruong', 'lanhdao'] },
      app: { phienBan: 'v1.0.7 (mẫu)' }, mo: ['homnay', 'baocao', 'congviec', 'lich', 'thongbao', 'gopy', 'toi', 'duyet', 'nhansu'], dem: { thongBao: 2, choDuyet: 3 } },
    homnay: { ngay: '', viecQuaHan: 1, viecHomNay: 2, baoCaoHomNay: 'chua_nop', choDuyet: 3,
      canXuLy: [{ id: 'V1', ten: 'Gọi lại khách hẹn tái khám', nguon: 'Được giao', han: '04/11/2026', muc: 'do', tab: 'congviec' },
        { id: 'V2', ten: 'Cập nhật bảng trực tuần sau', nguon: 'Việc của tôi', han: '06/11/2026', muc: 'vang', tab: 'congviec' }],
      thongBaoMoi: [{ id: 'T1', tieuDe: 'Lịch họp giao ban thứ Sáu', luc: '08:00' }] },
    baocao: { soDaNop: 3, soChuaNop: 1, soChoDuyet: 1, mau: [],
      lichSu: [{ ngay: '04/11/2026', trangThai: 'cho', tomTat: 'Tiếp đón 24 khách', soAnh: 2 }, { ngay: '03/11/2026', trangThai: 'da_duyet', tomTat: 'Gọi 30 cuộc CSKH', soAnh: 1 },
        { ngay: '02/11/2026', trangThai: 'tra_lai', tomTat: 'Thiếu minh chứng', soAnh: 0, lyDoTraLai: 'Bổ sung ảnh' }] },
    congviec: { dangLam: 3, quaHan: 1, xongTuan: 4, viec: [{ id: 'V1', ten: 'Gọi lại khách hẹn tái khám', loai: 'giao', han: '04/11/2026', tienDo: 40, nguoiGiao: 'Trưởng phòng mẫu', muc: 'do' },
      { id: 'V2', ten: 'Cập nhật bảng trực tuần sau', loai: 'canhan', han: '06/11/2026', tienDo: 10, muc: 'vang' }, { id: 'V3', ten: 'Hỗ trợ kiểm kê quầy', loai: 'nhogiup', han: '', tienDo: 0, muc: 'xam' }] },
    chiTiet: { moTa: 'Việc mẫu để duyệt giao diện.', tienDo: 40, viecCon: [{ id: 'c1', ten: 'Lọc danh sách', xong: true }, { id: 'c2', ten: 'Gọi điện', xong: false }], traoDoi: [{ nguoi: 'Trưởng phòng mẫu', luc: '03/11', chu: 'Ưu tiên khách cũ.' }] },
    lich: { tuan: 'T2 02/11 – CN 08/11', phepCon: 8, nghiBuCon: 1, ngay: [{ thu: 'T2', ngay: '02/11', viTri: 'Tiếp đón', ca: 'Sáng' }, { thu: 'T3', ngay: '03/11', viTri: 'CSKH', ca: 'Chiều' },
      { thu: 'T4', ngay: '04/11', nghi: 'Nghỉ tuần' }, { thu: 'T5', ngay: '05/11', viTri: 'Tiếp đón', ca: 'Sáng' }, { thu: 'T6', ngay: '06/11', viTri: 'CSKH', ca: 'Sáng' },
      { thu: 'T7', ngay: '07/11', viTri: 'Tổng đài', ca: 'Sáng' }, { thu: 'CN', ngay: '08/11', nghi: 'Nghỉ tuần' }],
      donNghi: [{ id: 'N1', loai: 'Nghỉ ốm', tuNgay: '10/11/2026', denNgay: '10/11/2026', trangThai: 'cho', lyDo: 'Khám định kỳ' }] },
    thongbao: { ds: [{ id: 'T1', tieuDe: 'Lịch họp giao ban thứ Sáu', noiDung: 'Phòng họp tầng 2', luc: '05/11 08:00', daDoc: false },
      { id: 'T2', tieuDe: 'Báo cáo 03/11 đã được duyệt', noiDung: '', luc: '04/11 17:20', daDoc: false }, { id: 'T3', tieuDe: 'Cập nhật quy trình tiếp đón', noiDung: '', luc: '01/11', daDoc: true }] },
    gopy: { ds: [{ id: 'G1', loai: 'gop_y', noiDung: 'Thêm mẫu tin nhắn nhắc lịch', luc: '02/11', trangThai: 'dang_xu_ly', traLoi: '' }] },
    toi: { hoTen: 'Người dùng mẫu', viTri: 'CSKH', to: 'Tổ CSKH', ngayVao: '01/03/2024', email: 'mau@example.com', dienThoai: '' },
    duyet: { baoCao: [{ id: 'B1', nguoi: 'Nhân viên A', ngay: '04/11/2026', tomTat: 'Tiếp đón 24 khách', anh: [] }, { id: 'B2', nguoi: 'Nhân viên B', ngay: '04/11/2026', tomTat: 'Gọi 30 cuộc', anh: [] }],
      nghi: [{ id: 'N9', nguoi: 'Nhân viên C', loai: 'Đổi ca', tuNgay: '07/11/2026', denNgay: '07/11/2026', lyDo: 'Việc gia đình' }], lichTuan: [] },
    nhansu: { dangLam: 12, moiVao: 1, choSua: 1, ds: [{ ma: 'M1', hoTen: 'Nhân viên A', viTri: 'Tiếp đón', to: 'Tổ CSKH', trangThai: 'Đang làm' },
      { ma: 'M2', hoTen: 'Nhân viên B', viTri: 'CSKH', to: 'Tổ CSKH', trangThai: 'Đang làm' }, { ma: 'M3', hoTen: 'Nhân viên C', viTri: 'Tổng đài', to: 'Tổ Tổng đài', trangThai: 'Thử việc' }],
      yeuCauSua: [{ id: 'Y1', ma: 'M2', hoTen: 'Nhân viên B', truong: 'Email', giaTriCu: '', giaTriMoi: 'b@example.com', lyDo: 'Bổ sung' }] }
  }
};
