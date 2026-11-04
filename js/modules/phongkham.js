/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH v1.0.7 – L1–L5 đã lên app).
 * v2.6.5: nối THẬT theo hợp đồng mục 4 của 21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md (tên cổng thật là trọng tài):
 *   máy chủ nhận (token, du) – du là ĐỐI TƯỢNG (không phải du.a) ➜ gọi SHIN_API.goi('PK', ham, {…}).
 *   Đọc: webKhoiDong · webHomNay · webCongViec · webChiTietViec · webBaoCao · webLichTuan · webThongBao · webGopYCuaToi · webHoSo
 *        · (tổ trưởng / lãnh đạo) webChoDuyet · webNhanSu
 *   Ghi: webNopBaoCao (ảnh JPEG ≤1600px, ≤6 ảnh, base64 không tiền tố) · webThemViecCaNhan · webDaDocThongBao · webGuiGopY
 *        · webDuyet (Đạt = Hoàn tác 6s rồi mới gửi; Trả lại bắt buộc lý do).
 *   Xin nghỉ / xếp lịch: v1 PK chưa có cổng ghi (đi qua app PTKH) ➜ nút mở app v1.
 * Demo: dữ liệu giả SHIN_DEMO_DATA.phongkham (cùng khuôn cổng thật), mọi nút ghi chỉ báo "(mẫu)".
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  _tab: 'homnay',
  _live: false,
  _kd: null,          // webKhoiDong
  _cache: {},         // tab ➜ dữ liệu đã tải
  _anh: [],           // ảnh chờ nộp [{ten, kieu, base64}]
  _tim: '',

  MUC: { do: 'do', vang: 'vang', xanh: 'xanh', xam: 'xam' },
  TT_BC: { da_nop: ['Đã nộp', 'xanh'], chua_nop: ['Chưa nộp', 'do'], nghi: ['Nghỉ', 'xam'],
           da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] },

  /* ---------- Tải ---------- */
  taiLive: async function() {
    const [kd, hn] = await Promise.all([SHIN_API.goi('PK', 'webKhoiDong'), SHIN_API.goi('PK', 'webHomNay')]);
    if (!hn.ok) return hn;
    this._live = true;
    this._kd = kd.ok ? (kd.data || {}) : null;
    this._cache = { homnay: hn.data || {} };
    this._anh = [];
    return { ok: true, data: { live: true } };
  },

  mau: function() { return (window.SHIN_DEMO_DATA || {}).phongkham || {}; },

  laQuanLy: function() {
    const q = ((this._kd || (this._live ? {} : this.mau().khoiDong) || {}).nguoi || {}).quyen || [];
    return q.some(x => x === 'totruong' || x === 'lanhdao' || x === 'admin');
  },

  TAB: [
    ['homnay', '🏠 Hôm nay', 'webHomNay'], ['congviec', '✅ Công việc', 'webCongViec'], ['baocao', '📝 Báo cáo', 'webBaoCao'],
    ['lich', '📅 Lịch tuần', 'webLichTuan'], ['thongbao', '🔔 Thông báo', 'webThongBao'], ['gopy', '💬 Góp ý', 'webGopYCuaToi'],
    ['hoso', '👤 Hồ sơ', 'webHoSo'], ['duyet', '🛡️ Chờ duyệt', 'webChoDuyet', 1], ['nhansu', '👥 Nhân sự', 'webNhanSu', 1]
  ],

  /** Lấy dữ liệu 1 tab: Live gọi cổng thật (lỗi ➜ trả {loi}), Demo lấy mẫu. */
  layTab: async function(tab) {
    if (this._cache[tab]) return this._cache[tab];
    const t = this.TAB.find(x => x[0] === tab);
    if (!this._live) return (this.mau()[tab]) || {};
    const du = tab === 'nhansu' ? { tim: this._tim } : tab === 'duyet' ? { loai: 'tatca' } : {};
    const kq = await SHIN_API.goi('PK', t[2], du);
    if (!kq.ok) return { _loi: SHIN_API.moTaLoi(kq) };
    this._cache[tab] = kq.data || {};
    return this._cache[tab];
  },

  /* ---------- Vẽ ---------- */
  render: function(container, data) {
    this._live = !!(data && data.live);
    if (!this._live) { this._kd = null; this._cache = {}; }
    const kd = this._kd || (this._live ? {} : this.mau().khoiDong) || {};
    const ng = kd.nguoi || {};
    const e = ShinApp.esc;
    const tabs = this.TAB.filter(t => !t[3] || this.laQuanLy());
    if (!tabs.some(t => t[0] === this._tab)) this._tab = 'homnay';
    const dem = kd.dem || {};

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${ng.hoTen ? e(ng.hoTen) + (ng.vaiTro ? ' · ' + e(ng.vaiTro) : '') : 'Báo cáo ngày · Công việc · Lịch tuần'}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>
      <div class="hang-tab" role="tablist">
        ${tabs.map(t => {
          const so = t[0] === 'thongbao' ? dem.thongBao : t[0] === 'duyet' ? dem.choDuyet : 0;
          return `<button class="tab-nut ${this._tab === t[0] ? 'dang-chon' : ''}" role="tab" data-tab="${t[0]}" onclick="ModulePhongKham.chuyenTab('${t[0]}')">${t[1]}${so ? ` <span class="badge do">${ShinApp.soVN(so)}</span>` : ''}</button>`;
        }).join('')}
      </div>
      <div id="pkNoiDung"></div>
    `;
    this.veTab();
  },

  chuyenTab: function(tab) {
    this._tab = tab;
    document.querySelectorAll('.hang-tab .tab-nut').forEach(b => b.classList.toggle('dang-chon', b.dataset.tab === tab));
    this.veTab();
  },

  veTab: async function() {
    const o = document.getElementById('pkNoiDung');
    if (!o) return;
    const tab = this._tab;
    if (this._live && !this._cache[tab]) o.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
    const d = await this.layTab(tab);
    if (this._tab !== tab || !document.getElementById('pkNoiDung')) return;
    if (d._loi) {
      o.innerHTML = `<div class="canh-bao-nguon loi">⚠️ ${ShinApp.esc(d._loi)}</div>
        <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.taiLaiTab()">🔄 Thử lại</button></div>`;
      return;
    }
    const ham = { homnay: 'veHomNay', congviec: 'veCongViec', baocao: 'veBaoCao', lich: 'veLich', thongbao: 'veThongBao',
                  gopy: 'veGopY', hoso: 'veHoSo', duyet: 'veDuyet', nhansu: 'veNhanSu' }[tab];
    o.innerHTML = this[ham](d);
  },

  taiLaiTab: function() { delete this._cache[this._tab]; this.veTab(); },

  badge: function(ma, bang) { const t = (bang || this.TT_BC)[ma] || [ma || '', 'xam']; return `<span class="badge ${t[1]}">${ShinApp.esc(t[0])}</span>`; },

  veHomNay: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const bc = this.TT_BC[d.baoCaoHomNay] || ['—', 'xam'];
    const can = d.canXuLy || [], tb = d.thongBaoMoi || [];
    return `
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Vận hành hôm nay 🏥</div>
          <div class="hero-date">📅 ${e(d.ngay || ShinApp.ngayVN())}</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:${d.viecQuaHan ? 'var(--c-red)' : 'var(--c-green)'}">${so(d.viecQuaHan || 0)}</div><div class="tq-nhan">Việc quá hạn</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${so(d.viecHomNay || 0)}</div><div class="tq-nhan">Việc hôm nay</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-${bc[1] === 'xanh' ? 'green' : bc[1] === 'do' ? 'red' : 'gray'})">${e(bc[0])}</div><div class="tq-nhan">Báo cáo ngày</div></div>
        </div>
        ${d.baoCaoHomNay === 'chua_nop' ? `<button class="btn-primary" onclick="ModulePhongKham.chuyenTab('baocao')">📷 Nộp báo cáo & minh chứng</button>` : ''}
      </div>
      ${this.laQuanLy() && d.choDuyet ? `<button class="btn-secondary" onclick="ModulePhongKham.chuyenTab('duyet')">🛡️ ${so(d.choDuyet)} mục chờ duyệt ›</button>` : ''}
      <div class="hn-tieu"><span>CẦN XỬ LÝ · ${can.length}</span></div>
      ${can.length ? `<div class="hn-list">${can.map(c => `
        <button class="hn-dong pk-nut-dong" onclick="ModulePhongKham.chuyenTab('${this.TAB.some(t => t[0] === c.tab) ? c.tab : 'congviec'}')">
          <div class="dong-content"><div class="dong-title">${e(c.ten)}</div><div class="dong-sub">${e(c.nguon || '')}${c.han ? ' · Hạn ' + e(c.han) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${this.MUC[c.muc] || 'xam'}">${c.muc === 'do' ? 'Gấp' : c.muc === 'vang' ? 'Sắp hạn' : 'Mở'}</span></div>
        </button>`).join('')}</div>` : '<div class="hn-xong"><div class="hn-xong-icon">🎉</div><div class="hn-xong-chu">Không còn việc cần xử lý</div></div>'}
      ${tb.length ? `<div class="hn-tieu"><span>THÔNG BÁO MỚI · ${tb.length}</span></div>
        ${tb.slice(0, 3).map(t => `<div class="hang-tru"><span>${t.daDoc ? '' : '🔵 '}${e(t.tieuDe)}</span><span class="chu-phu">${e(t.luc || '')}</span></div>`).join('')}` : ''}
    `;
  },

  veCongViec: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const viec = d.viec || [];
    const loai = { giao: 'Được giao', canhan: 'Cá nhân', nhogiup: 'Nhờ giúp' };
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(d.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:var(--c-red)">${so(d.quaHan || 0)}</b>Quá hạn</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(d.xongTuan || 0)}</b>Xong tuần này</div>
      </div>
      <div class="hn-list">${viec.map((v, i) => `
        <details class="the chi-tiet-gon" ontoggle="if(this.open) ModulePhongKham.moViec(${i}, this)">
          <summary><span>${e(v.ten)}</span></summary>
          <div class="chu-phu">${e(loai[v.loai] || v.loai || '')}${v.nguoiGiao ? ' · ' + e(v.nguoiGiao) : ''}${v.han ? ' · Hạn ' + e(v.han) : ''}</div>
          <div class="thanh-tien"><div style="width:${Math.max(0, Math.min(100, Number(v.tienDo) || 0))}%"></div></div>
          <div class="pk-ct chu-phu"></div>
        </details>`).join('')}</div>
      ${viec.length ? '' : '<div class="trong">Chưa có việc nào.</div>'}
      <div class="the form-the">
        <label class="nhan-o" for="pkViecTen">➕ Thêm việc cá nhân</label>
        <input id="pkViecTen" class="form-input" maxlength="200" placeholder="Tên việc">
        <label class="nhan-o" for="pkViecHan">Hạn (dd/mm/yyyy)</label>
        <input id="pkViecHan" class="form-input" inputmode="numeric" placeholder="${ShinApp.ngayVN()}">
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.themViec(this)">Thêm việc</button></div>
      </div>`;
  },

  moViec: async function(i, el) {
    const v = ((this._cache.congviec || this.mau().congviec || {}).viec || [])[i];
    const o = el.querySelector('.pk-ct');
    if (!v || !o || o.dataset.da) return;
    o.dataset.da = '1';
    if (!this._live) { o.textContent = 'Chi tiết việc (mẫu): mở trên bản Live để xem việc con và trao đổi.'; return; }
    o.textContent = 'Đang tải…';
    const kq = await SHIN_API.goi('PK', 'webChiTietViec', { id: v.id });
    if (!kq.ok) { o.textContent = '⚠️ ' + SHIN_API.moTaLoi(kq); delete o.dataset.da; return; }
    const c = kq.data || {}, e = ShinApp.esc;
    o.innerHTML = `${c.moTa ? `<p>${e(c.moTa)}</p>` : ''}
      ${(c.viecCon || []).map(x => `<div>${x.xong ? '✓' : '○'} ${e(x.ten)}</div>`).join('')}
      ${(c.traoDoi || []).length ? `<div class="nhat-ky">${c.traoDoi.map(t => `<div><b>${e(t.nguoi)}</b> · ${e(t.luc)}<br>${e(t.chu)}</div>`).join('')}</div>` : ''}`;
  },

  themViec: async function(nut) {
    const ten = (document.getElementById('pkViecTen').value || '').trim();
    const han = (document.getElementById('pkViecHan').value || '').trim();
    if (!ten) { ShinApp.toast('Nhập tên việc trước.', 'warn'); return; }
    if (han && !ShinApp.laNgayVN(han)) { ShinApp.toast('Hạn ghi dạng dd/mm/yyyy.', 'warn'); return; }
    if (!this._live) { ShinApp.toast('Đã thêm việc (mẫu – chưa gửi máy chủ).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang thêm', () => this.ghi('webThemViecCaNhan', { ten, han }), 'pkThemViec');
    if (kq) { delete this._cache.congviec; this.veTab(); }
  },

  /** Ghi 1 lần qua cổng PK; lỗi ➜ ném để goiNut báo. */
  ghi: async function(ham, du) {
    const kq = await SHIN_API.goi('PK', ham, du);
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    return kq.data || { ok: true };
  },

  veBaoCao: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const mau = d.mau || [], ls = d.lichSu || [];
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(d.soDaNop || 0)}</b>Đã nộp</div>
        <div class="o-so-loc"><b style="color:var(--c-red)">${so(d.soChuaNop || 0)}</b>Chưa nộp</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${so(d.soChoDuyet || 0)}</b>Chờ duyệt</div>
      </div>
      <div class="the form-the">
        <div class="card-title">📝 Báo cáo ngày ${e(ShinApp.ngayVN())}</div>
        ${mau.map((m, i) => `
          <label class="nhan-o" for="pkBC${i}">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so'
            ? `<input id="pkBC${i}" class="form-input" inputmode="numeric" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}" data-kieu="so">`
            : `<textarea id="pkBC${i}" class="form-input" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}"></textarea>`}`).join('')}
        <label class="nhan-o" for="pkAnh">📷 Ảnh minh chứng (tối đa 6)</label>
        <input id="pkAnh" class="form-input" type="file" accept="image/*" multiple onchange="ModulePhongKham.chonAnh(this)">
        <div id="pkAnhDem" class="chu-phu">${this._anh.length ? this._anh.length + ' ảnh đã chọn' : ''}</div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">Nộp báo cáo</button></div>
      </div>
      <div class="hn-tieu"><span>LỊCH SỬ THÁNG · ${ls.length}</span></div>
      <div class="hn-list">${ls.map(l => `
        <div class="hn-dong"><div class="dong-content">
          <div class="dong-title">${e(l.ngay)}${l.soAnh ? ' · 📷 ' + so(l.soAnh) : ''}</div>
          <div class="dong-sub">${e(l.tomTat || '')}${l.lyDoTraLai ? ' · Lý do: ' + e(l.lyDoTraLai) : ''}</div>
        </div><div class="dong-meta">${this.badge(l.trangThai)}</div></div>`).join('')}</div>
      ${ls.length ? '' : '<div class="trong">Chưa có báo cáo trong tháng.</div>'}`;
  },

  /** Thu ảnh về JPEG ≤ 1600px, base64 không tiền tố (hợp đồng webNopBaoCao). */
  chonAnh: async function(input) {
    const tep = Array.from(input.files || []).slice(0, 6);
    if ((input.files || []).length > 6) ShinApp.toast('Chỉ lấy 6 ảnh đầu.', 'warn');
    const doi = f => new Promise((ok, loi) => {
      const url = URL.createObjectURL(f), img = new Image();
      img.onload = () => {
        const k = Math.min(1, 1600 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok({ ten: (f.name || 'anh').replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: c.toDataURL('image/jpeg', 0.85).split(',')[1] });
      };
      img.onerror = () => { URL.revokeObjectURL(url); loi(new Error('Không đọc được ảnh ' + f.name)); };
      img.src = url;
    });
    try { this._anh = await Promise.all(tep.map(doi)); }
    catch (e) { this._anh = []; ShinApp.toast(e.message, 'error'); }
    const o = document.getElementById('pkAnhDem');
    if (o) o.textContent = this._anh.length ? this._anh.length + ' ảnh đã chọn' : '';
  },

  nopBaoCao: async function(nut) {
    const noiDung = {};
    let thieu = '';
    document.querySelectorAll('#pkNoiDung [data-ma]').forEach(o => {
      const v = (o.value || '').trim();
      if (o.dataset.bb && !v && !thieu) thieu = o.previousElementSibling ? o.previousElementSibling.textContent.replace(' *', '') : o.dataset.ma;
      noiDung[o.dataset.ma] = o.dataset.kieu === 'so' && v ? ShinApp.docSoVN(v) : v;
    });
    if (thieu) { ShinApp.toast('Còn thiếu: ' + thieu, 'warn'); return; }
    if (!this._live) { ShinApp.toast('Đã nộp báo cáo (mẫu – chưa gửi máy chủ).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang nộp', () => this.ghi('webNopBaoCao', { ngay: ShinApp.ngayVN(), noiDung, anh: this._anh }), 'pkNopBC');
    if (!kq) return;
    this._anh = [];
    if (kq.loiAnh && kq.loiAnh.length) ShinApp.toast('Báo cáo đã ghi, nhưng ' + kq.loiAnh.join('; ') + ' – chọn lại ảnh đó.', 'warn');
    delete this._cache.baocao; delete this._cache.homnay;
    this.veTab();
  },

  veLich: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const ngay = d.ngay || [], don = d.donNghi || [];
    return `
      <div class="the"><div class="card-title">📅 ${e(d.tuan || 'Tuần này')}</div>
        ${ngay.map(n => `<div class="hang-tru"><span>${e(n.thu || '')} ${e(n.ngay || '')}</span><span class="chu-phu">${n.le ? '🎌 Lễ' : n.nghi ? '🏖️ Nghỉ' : e([n.viTri, n.ca].filter(Boolean).join(' · ') || '—')}</span></div>`).join('')}
        ${ngay.length ? '' : '<div class="trong">Chưa có lịch tuần.</div>'}
      </div>
      <div class="luoi-o-so">
        <div class="o-so-loc"><b>${so(d.phepCon || 0)}</b>Phép còn</div>
        <div class="o-so-loc"><b>${so(d.nghiBuCon || 0)}</b>Nghỉ bù còn</div>
      </div>
      <div class="hn-tieu"><span>ĐƠN NGHỈ · ${don.length}</span></div>
      ${don.map(x => `<div class="hang-tru"><span>${e(x.tuNgay)}${x.denNgay && x.denNgay !== x.tuNgay ? ' – ' + e(x.denNgay) : ''} · ${e(x.lyDo || '')}</span>${this.badge(x.trangThai)}</div>`).join('')}
      <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Xin nghỉ / đổi ca')">🏖️ Xin nghỉ / đổi ca (app v1)</button></div>`;
  },

  veThongBao: function(d) {
    const e = ShinApp.esc, ds = d.ds || [];
    return `
      ${ds.some(t => !t.daDoc) ? `<div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.docHet(this)">✓ Đánh dấu đã đọc hết</button></div>` : ''}
      <div class="hn-list">${ds.map((t, i) => `
        <details class="the chi-tiet-gon" ${t.daDoc ? '' : `ontoggle="if(this.open) ModulePhongKham.daDoc(${i})"`}>
          <summary><span>${t.daDoc ? '' : '🔵 '}${e(t.tieuDe)}</span></summary>
          <div class="chu-phu">${e(t.luc || '')}</div><p>${e(t.noiDung || '')}</p>
        </details>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Chưa có thông báo.</div>'}`;
  },

  daDoc: function(i) {
    const ds = (this._live ? this._cache.thongbao : this.mau().thongbao || {}) || {};
    const t = (ds.ds || [])[i];
    if (!t || t.daDoc) return;
    t.daDoc = true;
    if (this._live) SHIN_API.goi('PK', 'webDaDocThongBao', { id: t.id });   // nền, không chặn màn
  },

  docHet: async function(nut) {
    if (!this._live) { ShinApp.toast('Đã đọc hết (mẫu).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang ghi', () => this.ghi('webDaDocThongBao', { id: 'tatca' }), 'pkDocHet');
    if (kq) { delete this._cache.thongbao; if (this._kd && this._kd.dem) this._kd.dem.thongBao = 0; this.veTab(); }
  },

  veGopY: function(d) {
    const e = ShinApp.esc, ds = d.ds || [];
    const tt = { moi: ['Mới', 'xam'], dang_xu_ly: ['Đang xử lý', 'vang'], xong: ['Xong', 'xanh'] };
    return `
      <div class="the form-the">
        <div class="hang-chip" role="radiogroup">
          <button class="chip-chon dang-chon" data-loai="gop_y" onclick="ModulePhongKham.chonLoaiGY(this)">💡 Góp ý</button>
          <button class="chip-chon" data-loai="bao_loi" onclick="ModulePhongKham.chonLoaiGY(this)">🐞 Báo lỗi</button>
        </div>
        <label class="nhan-o" for="pkGY">Nội dung</label>
        <textarea id="pkGY" class="form-input" maxlength="2000"></textarea>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">Gửi</button></div>
      </div>
      <div class="hn-tieu"><span>GÓP Ý CỦA TÔI · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(g => `
        <div class="hn-dong"><div class="dong-content">
          <div class="dong-title">${e(g.noiDung)}</div>
          <div class="dong-sub">${e(g.luc || '')}${g.traLoi ? ' · Trả lời: ' + e(g.traLoi) : ''}</div>
        </div><div class="dong-meta">${this.badge(g.trangThai, tt)}</div></div>`).join('')}</div>`;
  },

  chonLoaiGY: function(b) { b.parentNode.querySelectorAll('.chip-chon').forEach(x => x.classList.toggle('dang-chon', x === b)); },

  guiGopY: async function(nut) {
    const noiDung = (document.getElementById('pkGY').value || '').trim();
    const chon = document.querySelector('#pkNoiDung .chip-chon.dang-chon');
    if (!noiDung) { ShinApp.toast('Ghi nội dung trước khi gửi.', 'warn'); return; }
    if (!this._live) { ShinApp.toast('Đã gửi góp ý (mẫu – chưa gửi máy chủ).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi', () => this.ghi('webGuiGopY', { loai: chon ? chon.dataset.loai : 'gop_y', noiDung, anh: [] }), 'pkGopY');
    if (kq) { delete this._cache.gopy; this.veTab(); }
  },

  veHoSo: function(d) {
    const e = ShinApp.esc;
    const dong = [['Họ tên', d.hoTen], ['Vị trí', d.viTri], ['Tổ', d.to], ['Ngày vào', d.ngayVao], ['Email', d.email], ['Điện thoại', d.dienThoai]];
    return `<div class="the">${dong.map(x => `<div class="hang-tru"><span>${x[0]}</span><span class="chu-phu">${e(x[1] || '—')}</span></div>`).join('')}</div>
      <div class="chu-phu">Cần sửa hồ sơ: gửi đề nghị trên app PK v1 (tổ trưởng duyệt).</div>
      <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Đề nghị sửa hồ sơ')">✏️ Đề nghị sửa (app v1)</button></div>`;
  },

  /* ---------- Quản lý ---------- */
  veDuyet: function(d) {
    const e = ShinApp.esc;
    const bc = d.baoCao || [], ng = d.nghi || [], lt = d.lichTuan || [];
    const muc = (loai, x, i, chinh, phu) => `
      <div class="the" id="pkD-${loai}-${i}">
        <div class="dong-title">${e(chinh)}</div><div class="chu-phu">${e(phu)}</div>
        <div class="hang-nut">
          <button class="btn-primary" onclick="ModulePhongKham.duyet('${loai}', ${i}, 'dat')">✓ Đạt</button>
          <button class="btn-secondary" onclick="ModulePhongKham.moTraLai('${loai}', ${i})">↩ Trả lại</button>
        </div>
        <div class="pk-tl" hidden>
          <textarea class="form-input" maxlength="500" placeholder="Lý do trả lại (bắt buộc)"></textarea>
          <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.duyet('${loai}', ${i}, 'tra_lai', this)">Gửi trả lại</button></div>
        </div>
      </div>`;
    const tong = bc.length + ng.length + lt.length;
    return `
      <div class="hn-tieu"><span>BÁO CÁO NGÀY · ${bc.length}</span></div>
      ${bc.map((x, i) => muc('baocao', x, i, `${x.nguoi} · ${x.ngay}`, (x.tomTat || '') + ((x.anh || []).length ? ` · 📷 ${x.anh.length}` : ''))).join('')}
      ${ng.length ? `<div class="hn-tieu"><span>ĐƠN NGHỈ · ${ng.length}</span></div>` : ''}
      ${ng.map((x, i) => muc('nghi', x, i, `${x.nguoi} · ${x.tuNgay}${x.denNgay && x.denNgay !== x.tuNgay ? ' – ' + x.denNgay : ''}`, x.lyDo || '')).join('')}
      ${lt.length ? `<div class="hn-tieu"><span>LỊCH TUẦN · ${lt.length}</span></div>` : ''}
      ${lt.map((x, i) => muc('lichtuan', x, i, `Tổ ${x.to}`, x.tuan || '')).join('')}
      ${tong ? '' : '<div class="hn-xong"><div class="hn-xong-icon">✅</div><div class="hn-xong-chu">Không còn mục chờ duyệt</div></div>'}`;
  },

  moTraLai: function(loai, i) {
    const o = document.querySelector(`#pkD-${loai}-${i} .pk-tl`);
    if (o) { o.hidden = !o.hidden; if (!o.hidden) o.querySelector('textarea').focus(); }
  },

  /** Đạt: ẩn ngay + Hoàn tác 6s, hết giờ mới gửi đúng 1 lần. Trả lại: bắt buộc lý do, gửi ngay. */
  duyet: async function(loai, i, ketQua, nut) {
    const nguon = this._live ? this._cache.duyet : this.mau().duyet;
    const ds = (nguon || {})[loai === 'baocao' ? 'baoCao' : loai === 'nghi' ? 'nghi' : 'lichTuan'] || [];
    const x = ds[i], the = document.getElementById(`pkD-${loai}-${i}`);
    if (!x || !the) return;
    if (ketQua === 'tra_lai') {
      const lyDo = (the.querySelector('.pk-tl textarea').value || '').trim();
      if (!lyDo) { ShinApp.toast('Ghi lý do trả lại để nhân viên biết.', 'warn'); return; }
      if (!this._live) { the.remove(); ShinApp.toast('Đã trả lại (mẫu).', 'info'); return; }
      const kq = await ShinApp.goiNut(nut, 'Đang gửi', () => this.ghi('webDuyet', { loai, ids: [x.id], ketQua, lyDo }), 'pkDuyet' + loai + i);
      if (kq) { the.remove(); this.giamDem(); }
      return;
    }
    ShinApp.hanhDongHoanTac('Đã duyệt Đạt.', {
      lamTruoc: () => { the.style.display = "none"; },
      traLai: () => { the.style.display = ""; },
      thucHien: async () => {
        if (this._live) await this.ghi('webDuyet', { loai, ids: [x.id], ketQua: 'dat', lyDo: '' });
        the.remove(); this.giamDem();
      }
    });
  },

  giamDem: function() {
    if (this._kd && this._kd.dem && this._kd.dem.choDuyet) this._kd.dem.choDuyet--;
    delete this._cache.homnay;
  },

  veNhanSu: function(d) {
    const e = ShinApp.esc, so = ShinApp.soVN, ds = d.ds || [], yc = d.yeuCauSua || [];
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b>${so(d.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(d.moiVao || 0)}</b>Mới vào</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${so(d.choSua || 0)}</b>Chờ sửa hồ sơ</div>
      </div>
      <div class="hang-nhap">
        <input id="pkTim" class="form-input" type="search" placeholder="Tìm tên / vị trí" value="${e(this._tim)}" onkeydown="if(event.key==='Enter') ModulePhongKham.timNS()">
        <button class="btn-secondary" onclick="ModulePhongKham.timNS()">🔍</button>
      </div>
      ${yc.length ? `<div class="hn-tieu"><span>ĐỀ NGHỊ SỬA HỒ SƠ · ${yc.length}</span></div>
        ${yc.map(y => `<div class="hang-tru"><span>${e(y.hoTen)} · ${e(y.truong)}: ${e(y.giaTriCu || '—')} → ${e(y.giaTriMoi)}</span><span class="chu-phu">${e(y.luc || '')}</span></div>`).join('')}
        <div class="chu-phu">Duyệt sửa hồ sơ làm trên app PK v1.</div>` : ''}
      <div class="hn-tieu"><span>DANH SÁCH · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(n => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(n.hoTen)}</div><div class="dong-sub">${e([n.viTri, n.to].filter(Boolean).join(' · '))}</div></div>
        <div class="dong-meta"><span class="badge ${/nghỉ|nghi/i.test(n.trangThai || '') ? 'xam' : 'xanh'}">${e(n.trangThai || '')}</span></div></div>`).join('')}</div>`;
  },

  timNS: function() {
    const o = document.getElementById('pkTim');
    this._tim = o ? o.value.trim() : '';
    delete this._cache.nhansu;
    if (!this._live) { ShinApp.toast('Tìm trên dữ liệu mẫu không lọc.', 'info'); }
    this.veTab();
  }
};
