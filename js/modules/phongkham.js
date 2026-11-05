/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ app PK v1 `21_PhongPTKH`, dùng chung file dữ liệu PTKH)
 * v2.7.0 – nối thật 21 cổng web* của app PK v1.0.7 (L1–L5, hợp đồng: 21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md mục 4).
 * App PK nhận du là ĐỐI TƯỢNG (ham(token, du)) ➜ dùng SHIN_API.goi('PK', hanh, {...}), KHÔNG dùng goiCong (du.a).
 * Live: mỗi thẻ gọi đúng cổng của thẻ; lỗi ➜ khung đỏ báo rõ, không thay bằng số mẫu.
 * Demo: dữ liệu giả SHIN_DEMO_DATA.phongkhamV1 (cùng khuôn cổng thật), thao tác ghi không gửi đi đâu.
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  _tab: 'homnay',
  _live: false,
  _cache: {},
  _nguoi: {},
  _anh: [],

  /** Thẻ ➜ [nhãn, cổng đọc, quyền cần (rỗng = ai cũng xem)] */
  THE: [
    ['homnay', '🏠 Hôm nay', 'webHomNay', ''],
    ['congviec', '✅ Công việc', 'webCongViec', ''],
    ['baocao', '📝 Báo cáo', 'webBaoCao', ''],
    ['lich', '📅 Lịch tuần', 'webLichTuan', ''],
    ['thongbao', '🔔 Thông báo', 'webThongBao', ''],
    ['duyet', '☑️ Duyệt', 'webChoDuyet', 'duyet'],
    ['nhansu', '👥 Nhân sự', 'webNhanSu', 'quanly'],
    ['gopy', '💬 Góp ý', 'webGopYCuaToi', ''],
    ['hoso', '👤 Hồ sơ', 'webHoSo', '']
  ],
  KHOA_DEMO: { homnay: 'homNay', congviec: 'congViec', baocao: 'baoCao', lich: 'lichTuan', thongbao: 'thongBao', duyet: 'choDuyet', nhansu: 'nhanSu', gopy: 'gopY', hoso: 'hoSo' },
  MUC: { do: 'do', vang: 'vang', xanh: 'xanh', xam: 'xam' },
  TT_BC: { da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] },
  TT_NGHI: { cho: ['Chờ duyệt', 'vang'], da_duyet: ['Đã duyệt', 'xanh'], tra_lai: ['Trả lại', 'do'] },
  LOAI_NGHI: { nghi_tuan: 'Nghỉ tuần', nghi_om: 'Nghỉ ốm', doi_ca: 'Đổi ca' },
  TT_GY: { moi: ['Mới', 'xam'], dang_xu_ly: ['Đang xử lý', 'vang'], xong: ['Xong', 'xanh'] },

  taiLive: async function() {
    const [kd, hn] = await Promise.all([SHIN_API.goi('PK', 'webKhoiDong', {}), SHIN_API.goi('PK', 'webHomNay', {})]);
    if (!hn.ok) return hn;
    return { ok: true, data: { live: true, khoiDong: kd.ok ? kd.data : null, homNay: hn.data } };
  },

  demo: function() { return (window.SHIN_DEMO_DATA || {}).phongkhamV1 || {}; },

  coQuyen: function(can) {
    const q = (this._nguoi && this._nguoi.quyen) || [];
    if (!can) return true;
    if (can === 'duyet') return q.includes('totruong') || q.includes('admin');
    return q.includes('totruong') || q.includes('lanhdao') || q.includes('admin');
  },

  render: function(container, data) {
    const d = data || { live: false, khoiDong: this.demo().khoiDong, homNay: this.demo().homNay };
    this._live = !!d.live;
    this._cache = { homnay: d.homNay };
    this._nguoi = (d.khoiDong && d.khoiDong.nguoi) || {};
    if (!this.THE.some(t => t[0] === this._tab && this.coQuyen(t[3]))) this._tab = 'homnay';
    const e = ShinApp.esc, n = this._nguoi;
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${n.hoTen ? e(n.hoTen) + (n.vaiTro ? ' · ' + e(n.vaiTro) : '') : 'Báo cáo ngày · Công việc · Lịch trực'}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt" aria-label="Cài đặt">⚙️</button>
      </div>
      <div class="hang-tab" role="tablist" id="pkTab"></div>
      <div id="pkXem"></div>`;
    this.veTab();
    this.veXem();
  },

  veTab: function() {
    const el = document.getElementById('pkTab');
    if (!el) return;
    el.innerHTML = this.THE.filter(t => this.coQuyen(t[3])).map(t =>
      `<button class="tab-nut ${this._tab === t[0] ? 'dang-chon' : ''}" role="tab" aria-selected="${this._tab === t[0]}" onclick="ModulePhongKham.chuyen('${t[0]}')">${t[1]}</button>`).join('');
  },

  chuyen: function(tab) { this._tab = tab; ShinApp.rung('nhe'); this.veTab(); this.veXem(); },

  /** Đọc dữ liệu thẻ: Demo ➜ mẫu; Live ➜ cổng của thẻ (nhớ tạm trong lượt mở màn). */
  doc: async function(tab, lamMoi) {
    if (!this._live) return this.demo()[this.KHOA_DEMO[tab]] || {};
    if (!lamMoi && this._cache[tab]) return this._cache[tab];
    const the = this.THE.find(t => t[0] === tab);
    const kq = await SHIN_API.goi('PK', the[2], {});
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    this._cache[tab] = kq.data || {};
    return this._cache[tab];
  },

  /** Ghi: Live gọi cổng PK; Demo không gửi gì. */
  gui: async function(hanh, du) {
    if (!this._live) return { ok: true, demo: true };
    const kq = await SHIN_API.goi('PK', hanh, du);
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    return kq.data || { ok: true };
  },

  veXem: async function(lamMoi) {
    const el = document.getElementById('pkXem');
    if (!el) return;
    const tab = this._tab;
    el.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
    try {
      const d = await this.doc(tab, lamMoi);
      if (this._tab !== tab || !el.isConnected) return;
      el.innerHTML = this['ve_' + tab](d || {});
    } catch (err) {
      if (this._tab !== tab || !el.isConnected) return;
      el.innerHTML = `<div class="the"><div style="color:var(--c-red);font-weight:700;">⚠️ ${ShinApp.esc(err.message)}</div>
        <div class="chu-phu" style="margin-top:6px;">Không hiện số mẫu thay cho số thật. Kiểm tra mạng / token rồi thử lại.</div>
        <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.veXem(true)">↻ Thử lại</button></div></div>`;
    }
  },

  badge: function(cap, mac) { const c = cap || [mac || '', 'xam']; return `<span class="badge ${c[1]}">${ShinApp.esc(c[0])}</span>`; },
  o3: function(ds) {
    return `<div class="tq-3so">${ds.map(s => `<div class="tq-o"><div class="tq-so" style="color:${s[2]}">${ShinApp.esc(ShinApp.soVN(s[1] || 0))}</div><div class="tq-nhan">${ShinApp.esc(s[0])}</div></div>`).join('')}</div>`;
  },
  homNayVN: function() { const d = new Date(), p = x => (x < 10 ? '0' : '') + x; return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); },

  /* ---------- 🏠 Hôm nay (webHomNay) ---------- */
  ve_homnay: function(d) {
    const e = ShinApp.esc, can = d.canXuLy || [];
    const bc = d.baoCaoHomNay === 'da_nop' ? ['Đã nộp', 'xanh'] : d.baoCaoHomNay === 'nghi' ? ['Nghỉ', 'xam'] : ['Chưa nộp', 'do'];
    return `
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Vận hành hôm nay 🏥</div>
          <div class="hero-date">📅 ${e(d.ngay || this.homNayVN())} · Báo cáo: ${this.badge(bc)}</div>
        </div></div>
        ${this.o3([['Việc quá hạn', d.viecQuaHan, d.viecQuaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Việc hạn hôm nay', d.viecHomNay, 'var(--c-blue)'], ['Báo cáo chờ duyệt', d.choDuyet, d.choDuyet ? 'var(--c-yellow)' : 'var(--c-gray)']])}
        ${d.baoCaoHomNay === 'chua_nop' ? `<button class="btn-primary" onclick="ModulePhongKham.chuyen('baocao')">📷 Nộp báo cáo & minh chứng</button>` : ''}
      </div>
      <div class="hn-tieu"><span>CẦN XỬ LÝ · ${can.length}</span></div>
      <div class="hn-list">${can.map(v => `
        <div class="hn-dong" onclick="ModulePhongKham.chuyen('${v.tab === 'baocao' ? 'baocao' : 'congviec'}')">
          <div class="dong-content"><div class="dong-title">${e(v.ten)}</div><div class="dong-sub">${e(v.nguon || '')}${v.han ? ' · Hạn ' + e(v.han) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${this.MUC[v.muc] || 'xam'}">${v.muc === 'do' ? 'Gấp' : v.muc === 'vang' ? 'Sắp tới' : 'Còn hạn'}</span></div>
        </div>`).join('')}</div>
      ${can.length ? '' : '<div class="trong">Không có việc cần xử lý. 🎉</div>'}`;
  },

  /* ---------- ✅ Công việc (webCongViec · webCapNhatViec · webThemViecCaNhan) ---------- */
  ve_congviec: function(d) {
    const e = ShinApp.esc, ds = d.viec || [];
    const loai = { giao: 'Được giao', canhan: 'Việc của tôi', nhogiup: 'Nhờ giúp' };
    return `
      ${this.o3([['Đang làm', d.dangLam, 'var(--c-blue)'], ['Quá hạn', d.quaHan, d.quaHan ? 'var(--c-red)' : 'var(--c-gray)'], ['Xong tuần này', d.xongTuan, 'var(--c-green)']])}
      <div class="hn-tieu"><span>VIỆC CỦA TÔI · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(v => `
        <div class="hn-dong" style="cursor:default;">
          <div class="dong-content"><div class="dong-title">${e(v.ten)}</div>
            <div class="dong-sub">${e(loai[v.loai] || '')}${v.nguoiGiao ? ' · ' + e(v.nguoiGiao) : ''}${v.han ? ' · Hạn ' + e(v.han) : ''}</div></div>
          <div class="dong-meta" style="display:flex;align-items:center;gap:6px;">
            <span class="badge ${this.MUC[v.muc] || 'xam'}" id="pkTd_${e(v.id).replace(/[^A-Za-z0-9_-]/g, '_')}">${e(ShinApp.soVN(v.tienDo || 0))}%</span>
            ${(v.tienDo || 0) < 100 ? `<button class="btn-secondary" style="min-height:44px;" onclick="ModulePhongKham.tangTienDo('${e(v.id)}')" aria-label="Tăng tiến độ 25%">+25%</button>` : ''}
          </div>
        </div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Chưa có việc nào.</div>'}
      <div class="the" style="margin-top:12px;">
        <label class="form-label" for="pkViecTen">THÊM VIỆC CỦA TÔI</label>
        <input id="pkViecTen" class="form-input" style="font-size:16px;" maxlength="200" placeholder="Tên việc">
        <input id="pkViecHan" class="form-input" style="font-size:16px;margin-top:8px;" type="date" aria-label="Hạn">
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.themViec(this)">＋ Thêm việc</button></div>
      </div>`;
  },

  tangTienDo: function(id) {
    const d = this._live ? this._cache.congviec : this.demo().congViec;
    const v = d && (d.viec || []).find(x => String(x.id) === String(id));
    if (!v) return;
    const cu = v.tienDo || 0, moi = Math.min(100, cu + 25);
    const ve = () => { const el = document.getElementById('pkXem'); if (el && this._tab === 'congviec') el.innerHTML = this.ve_congviec(d); };
    ShinApp.hanhDongHoanTac(`Tiến độ "${v.ten}" ➜ ${moi}%`, {
      lamTruoc: () => { v.tienDo = moi; ve(); },
      traLai: () => { v.tienDo = cu; ve(); },
      thucHien: async () => { await this.gui('webCapNhatViec', { id: v.id, tienDo: moi }); delete this._cache.homnay; }
    });
  },

  themViec: async function(nut) {
    const ten = (document.getElementById('pkViecTen') || {}).value || '';
    const han = (document.getElementById('pkViecHan') || {}).value || '';
    if (!ten.trim()) { ShinApp.toast('Nhập tên việc trước đã.', 'warn'); return; }
    const hanVN = han ? han.split('-').reverse().join('/') : '';
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => this.gui('webThemViecCaNhan', { ten: ten.trim(), han: hanVN }), 'pk-themviec');
    if (!kq) return;
    ShinApp.toast(kq.demo ? 'Demo: không gửi máy chủ.' : 'Đã thêm việc.', kq.demo ? 'info' : 'success');
    if (!kq.demo) this.veXem(true);
  },

  /* ---------- 📝 Báo cáo ngày + minh chứng (webBaoCao · webNopBaoCao) ---------- */
  ve_baocao: function(d) {
    const e = ShinApp.esc, mau = d.mau || [], ls = d.lichSu || [];
    this._anh = [];
    return `
      ${this.o3([['Đã nộp', d.soDaNop, 'var(--c-green)'], ['Chưa nộp', d.soChuaNop, d.soChuaNop ? 'var(--c-red)' : 'var(--c-gray)'], ['Chờ duyệt', d.soChoDuyet, 'var(--c-yellow)']])}
      <div class="the">
        <div class="form-label">NỘP BÁO CÁO NGÀY ${e(this.homNayVN())}</div>
        ${mau.map(m => `
          <label class="chu-phu" for="pkBc_${e(m.ma)}" style="display:block;margin-top:8px;">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so'
            ? `<input id="pkBc_${e(m.ma)}" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}" class="form-input pk-bc" style="font-size:16px;" type="number" inputmode="numeric" min="0">`
            : `<textarea id="pkBc_${e(m.ma)}" data-ma="${e(m.ma)}" data-bb="${m.batBuoc ? 1 : ''}" class="form-input pk-bc" style="font-size:16px;min-height:80px;" maxlength="2000"></textarea>`}`).join('')}
        ${mau.length ? '' : '<div class="chu-phu">Máy chủ chưa trả mẫu báo cáo.</div>'}
        <label class="chu-phu" for="pkAnh" style="display:block;margin-top:10px;">Ảnh minh chứng (≤ 6 ảnh, tự nén ≤ 1600px)</label>
        <input id="pkAnh" type="file" accept="image/*" multiple class="form-input" style="font-size:16px;" onchange="ModulePhongKham.chonAnh(this)">
        <div class="chu-phu" id="pkAnhSo"></div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">📤 Nộp báo cáo</button></div>
      </div>
      <div class="hn-tieu"><span>LỊCH SỬ · ${ls.length}</span></div>
      <div class="hn-list">${ls.map(b => `
        <div class="hn-dong" style="cursor:default;">
          <div class="dong-content"><div class="dong-title">${e(b.ngay)} · ${e(b.tomTat || '')}</div>
            <div class="dong-sub">${b.soAnh ? '📷 ' + e(b.soAnh) + ' ảnh' : 'Không ảnh'}${b.lyDoTraLai ? ' · Lý do: ' + e(b.lyDoTraLai) : ''}</div></div>
          <div class="dong-meta">${this.badge(this.TT_BC[b.trangThai], b.trangThai)}</div>
        </div>`).join('')}</div>
      ${ls.length ? '' : '<div class="trong">Chưa có báo cáo trong tháng.</div>'}`;
  },

  /** Nén ảnh: JPEG ≤ 1600px, base64 không tiền tố data: (hợp đồng webNopBaoCao). */
  nenAnh: function(file) {
    return new Promise((ok, loi) => {
      const doc = new FileReader();
      doc.onerror = () => loi(new Error('Không đọc được ảnh ' + file.name));
      doc.onload = () => {
        const img = new Image();
        img.onerror = () => loi(new Error('Ảnh hỏng: ' + file.name));
        img.onload = () => {
          const tl = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * tl); c.height = Math.round(img.height * tl);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok({ ten: file.name.replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: c.toDataURL('image/jpeg', 0.82).split(',')[1] });
        };
        img.src = doc.result;
      };
      doc.readAsDataURL(file);
    });
  },

  chonAnh: async function(input) {
    const ds = Array.from(input.files || []);
    if (ds.length > 6) ShinApp.toast('Tối đa 6 ảnh – em lấy 6 ảnh đầu.', 'warn');
    const so = document.getElementById('pkAnhSo');
    if (so) so.textContent = 'Đang nén ảnh…';
    try { this._anh = await Promise.all(ds.slice(0, 6).map(f => this.nenAnh(f))); }
    catch (err) { this._anh = []; ShinApp.toast(err.message, 'error'); }
    if (so) so.textContent = this._anh.length ? `Đã chọn ${this._anh.length} ảnh.` : '';
  },

  nopBaoCao: async function(nut) {
    const noiDung = {};
    let thieu = '';
    document.querySelectorAll('.pk-bc').forEach(o => { const v = o.value.trim(); if (o.dataset.bb && !v && !thieu) thieu = o.dataset.ma; noiDung[o.dataset.ma] = v; });
    if (thieu) { ShinApp.toast('Còn ô bắt buộc (*) chưa điền.', 'warn'); const o = document.getElementById('pkBc_' + thieu); if (o) o.focus(); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang nộp…', () => this.gui('webNopBaoCao', { ngay: this.homNayVN(), noiDung, anh: this._anh }), 'pk-nopbc');
    if (!kq) return;
    if (kq.demo) { ShinApp.toast('Demo: không gửi máy chủ.', 'info'); return; }
    if (kq.loiAnh && kq.loiAnh.length) ShinApp.toast('Đã nộp báo cáo, nhưng ' + kq.loiAnh.length + ' ảnh lỗi – chọn lại ảnh đó giúp em.', 'warn');
    else ShinApp.toast('Đã nộp báo cáo ngày ' + (kq.ngay || ''), 'success');
    ShinApp.rung('xong');
    delete this._cache.homnay;
    this.veXem(true);
  },

  /* ---------- 📅 Lịch tuần + đơn nghỉ (webLichTuan – chỉ đọc) ---------- */
  /** v2.9.5 – M5.3 hàm thuần: ngày đang xếp ca (không nghỉ / lễ) nằm trong đơn nghỉ chờ duyệt / đã duyệt (bỏ đổi ca, trả lại). */
  xungDotLich: function(ngay, donNghi) {
    const so = s => { const m = String(s || '').match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m ? +m[3] * 10000 + +m[2] * 100 + +m[1] : 0; };
    const don = (donNghi || []).filter(x => (x.trangThai === 'cho' || x.trangThai === 'da_duyet') && x.loai !== 'doi_ca' && so(x.tuNgay));
    const kq = [];
    (ngay || []).forEach(n => {
      const s = so(n.ngay);
      if (!s || n.nghi || n.le || !(n.viTri || n.ca)) return;
      const d = don.find(x => s >= so(x.tuNgay) && s <= (so(x.denNgay) || so(x.tuNgay)));
      if (d) kq.push({ ngay: n.ngay, thu: n.thu || '', ca: [n.viTri, n.ca ? 'Ca ' + n.ca : ''].filter(Boolean).join(' · '), don: d });
    });
    return kq;
  },

  ve_lich: function(d) {
    const e = ShinApp.esc, ng = d.ngay || [], dn = d.donNghi || [];
    const xd = this.xungDotLich(ng, dn), ngayXD = xd.map(x => x.ngay);
    return `
      ${xd.length ? `<div class="the" style="border-left:4px solid var(--c-yellow);">
        <div class="form-label">⚠️ TRÙNG LỊCH · ${xd.length} ngày</div>
        ${xd.map(x => `<div class="chu-phu">${e(x.thu)} ${e(x.ngay)}: đang xếp ${e(x.ca)} nhưng có đơn ${e(this.LOAI_NGHI[x.don.loai] || x.don.loai || '')} (${e((this.TT_NGHI[x.don.trangThai] || [x.don.trangThai])[0])}).</div>`).join('')}
        <div class="chu-phu">Báo tổ trưởng xếp người thay / đổi ca trên app PK.</div>
      </div>` : ''}
      <div class="the">
        <div class="form-label">TUẦN ${e(d.tuan || '')}</div>
        <div class="chu-phu">Phép còn: <b>${e(ShinApp.soVN(d.phepCon || 0))}</b> · Nghỉ bù còn: <b>${e(ShinApp.soVN(d.nghiBuCon || 0))}</b></div>
        ${ng.map(x => `<div class="hang-tru"><span><b>${e(x.thu || '')}</b> ${e(x.ngay || '')}${ngayXD.indexOf(x.ngay) >= 0 ? ' ⚠️' : ''}</span><span>${x.le ? this.badge(['Lễ', 'vang']) : x.nghi ? this.badge(['Nghỉ', 'xam']) : e([x.viTri, x.ca ? 'Ca ' + x.ca : ''].filter(Boolean).join(' · ') || '–')}</span></div>`).join('')}
        ${ng.length ? '' : '<div class="trong">Tuần này chưa xếp lịch.</div>'}
      </div>
      <div class="hn-tieu"><span>ĐƠN NGHỈ / ĐỔI CA · ${dn.length}</span></div>
      <div class="hn-list">${dn.map(x => `
        <div class="hn-dong" style="cursor:default;">
          <div class="dong-content"><div class="dong-title">${e(this.LOAI_NGHI[x.loai] || x.loai || '')} · ${e(x.tuNgay || '')}${x.denNgay && x.denNgay !== x.tuNgay ? ' – ' + e(x.denNgay) : ''}</div>
            <div class="dong-sub">${e(x.lyDo || '')}${x.lyDoTraLai ? ' · Trả lại: ' + e(x.lyDoTraLai) : ''}</div></div>
          <div class="dong-meta">${this.badge(this.TT_NGHI[x.trangThai], x.trangThai)}</div>
        </div>`).join('')}</div>
      <div class="hang-nut"><span class="chu-phu">Xin nghỉ / đổi ca: làm trên app PTKH (v2 chỉ xem).</span>
        <button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Xin nghỉ / đổi ca')">Mở app PK</button></div>`;
  },

  /* ---------- 🔔 Thông báo (webThongBao · webDaDocThongBao) ---------- */
  ve_thongbao: function(d) {
    const e = ShinApp.esc, ds = d.ds || [], chua = ds.filter(x => !x.daDoc).length;
    return `
      <div class="hang-nut" style="margin-top:0;"><span class="chu-phu">${chua} chưa đọc / ${ds.length}</span>
        ${chua ? '<button class="btn-secondary" onclick="ModulePhongKham.docHet()">✓ Đã đọc tất cả</button>' : ''}</div>
      <div class="hn-list">${ds.map(x => `
        <div class="hn-dong" onclick="ModulePhongKham.chuyen('${['congviec', 'baocao', 'lich', 'gopy', 'hoso'].includes(x.tab) ? x.tab : 'thongbao'}')" style="${x.daDoc ? 'opacity:.7;' : ''}">
          <div class="dong-content"><div class="dong-title">${x.daDoc ? '' : '● '}${e(x.tieuDe || '')}</div><div class="dong-sub">${e(x.noiDung || '')}</div></div>
          <div class="dong-meta chu-phu">${e(x.luc || '')}</div>
        </div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Không có thông báo.</div>'}`;
  },

  docHet: function() {
    const d = this._live ? this._cache.thongbao : this.demo().thongBao;
    if (!d) return;
    const cu = (d.ds || []).map(x => x.daDoc);
    const ve = () => { const el = document.getElementById('pkXem'); if (el && this._tab === 'thongbao') el.innerHTML = this.ve_thongbao(d); };
    ShinApp.hanhDongHoanTac('Đã đánh dấu đọc tất cả', {
      lamTruoc: () => { (d.ds || []).forEach(x => { x.daDoc = true; }); ve(); },
      traLai: () => { (d.ds || []).forEach((x, i) => { x.daDoc = cu[i]; }); ve(); },
      thucHien: () => this.gui('webDaDocThongBao', { id: 'tatca' })
    });
  },

  /* ---------- ☑️ Duyệt báo cáo (webChoDuyet · webDuyet) – tổ trưởng / admin ---------- */
  ve_duyet: function(d) {
    const e = ShinApp.esc, bc = d.baoCao || [], ng = d.nghi || [];
    return `
      <div class="hang-nut" style="margin-top:0;"><span class="chu-phu">${bc.length} báo cáo chờ duyệt</span>
        ${bc.length > 1 ? '<button class="btn-primary" onclick="ModulePhongKham.duyet(\'*\')">✓ Duyệt tất cả</button>' : ''}</div>
      <div class="hn-list">${bc.map(b => `
        <div class="the" id="pkDuyet_${e(b.id)}">
          <div class="dong-title">${e(b.nguoi || '')} · ${e(b.ngay || '')}</div>
          <div class="dong-sub">${e(b.tomTat || '')}${(b.anh || []).length ? ' · 📷 ' + b.anh.length + ' ảnh' : ''}</div>
          <input class="form-input" style="font-size:16px;margin-top:8px;" id="pkLyDo_${e(b.id)}" maxlength="300" placeholder="Lý do trả lại (bắt buộc khi trả lại)">
          <div class="hang-nut">
            <button class="btn-secondary" onclick="ModulePhongKham.traLai('${e(b.id)}', this)">↩ Trả lại</button>
            <button class="btn-primary" onclick="ModulePhongKham.duyet('${e(b.id)}')">✓ Đạt</button>
          </div>
        </div>`).join('')}</div>
      ${bc.length ? '' : '<div class="trong">Không có báo cáo chờ duyệt. 🎉</div>'}
      ${ng.length ? `<div class="hn-tieu"><span>ĐƠN NGHỈ CHỜ DUYỆT · ${ng.length}</span></div>
        ${ng.map(x => `<div class="hang-tru"><span>${e(x.nguoi || '')} · ${e(this.LOAI_NGHI[x.loai] || x.loai || '')} ${e(x.tuNgay || '')}</span><span class="chu-phu">${e(x.lyDo || '')}</span></div>`).join('')}
        <div class="chu-phu" style="margin-top:6px;">Duyệt đơn nghỉ: làm trên app PTKH (cổng PK chưa nhận duyệt nghỉ).</div>` : ''}`;
  },

  duyet: function(id) {
    const d = this._live ? this._cache.duyet : this.demo().choDuyet;
    if (!d) return;
    const cu = (d.baoCao || []).slice();
    const chon = id === '*' ? cu : cu.filter(b => String(b.id) === String(id));
    if (!chon.length) return;
    const ve = () => { const el = document.getElementById('pkXem'); if (el && this._tab === 'duyet') el.innerHTML = this.ve_duyet(d); };
    ShinApp.hanhDongHoanTac(`Đã duyệt ${chon.length} báo cáo`, {
      lamTruoc: () => { d.baoCao = cu.filter(b => !chon.includes(b)); ve(); },
      traLai: () => { d.baoCao = cu; ve(); },
      thucHien: async () => {
        await this.gui('webDuyet', id === '*' ? { loai: 'tatca', muc: chon.map(b => ({ loai: 'baocao', id: b.id })), ketQua: 'dat' } : { loai: 'baocao', ids: [chon[0].id], ketQua: 'dat' });
        delete this._cache.homnay;
      }
    });
  },

  traLai: async function(id, nut) {
    const o = document.getElementById('pkLyDo_' + id);
    const lyDo = o ? o.value.trim() : '';
    if (!lyDo) { ShinApp.toast('Ghi rõ lý do trả lại để nhân viên biết.', 'warn'); if (o) o.focus(); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui('webDuyet', { loai: 'baocao', ids: [id], ketQua: 'tra_lai', lyDo }), 'pk-tralai-' + id);
    if (!kq) return;
    ShinApp.toast(kq.demo ? 'Demo: không gửi máy chủ.' : 'Đã trả lại báo cáo.', kq.demo ? 'info' : 'success');
    const d = this._live ? this._cache.duyet : this.demo().choDuyet;
    if (d && !kq.demo) { d.baoCao = (d.baoCao || []).filter(b => String(b.id) !== String(id)); const el = document.getElementById('pkXem'); if (el) el.innerHTML = this.ve_duyet(d); }
  },

  /* ---------- 👥 Nhân sự (webNhanSu · webHoSoNhanSu · webDuyetSuaHoSo – lãnh đạo / admin) ---------- */
  ve_nhansu: function(d) {
    const e = ShinApp.esc, ds = d.ds || [], yc = d.yeuCauSua || [];
    return `
      ${this.o3([['Đang làm', d.dangLam, 'var(--c-blue)'], ['Mới vào', d.moiVao, 'var(--c-green)'], ['Chờ sửa hồ sơ', d.choSua, d.choSua ? 'var(--c-yellow)' : 'var(--c-gray)']])}
      ${yc.length ? `<div class="hn-tieu"><span>YÊU CẦU SỬA HỒ SƠ · ${yc.length}</span></div>
        ${yc.map((y, i) => `<div class="the" id="pkYC_${i}">
          <div class="dong-title">${e(y.hoTen || '')} · ${e(y.truong || '')}</div>
          <div class="dong-sub">${e(y.giaTriCu || '—')} ➜ ${e(y.giaTriMoi || '')}${y.luc ? ' · ' + e(y.luc) : ''}</div>
          <input class="form-input" style="font-size:16px;margin-top:8px;" id="pkYCLyDo_${i}" maxlength="300" placeholder="Lý do không duyệt (bắt buộc khi không duyệt)">
          <div class="hang-nut">
            <button class="btn-secondary" onclick="ModulePhongKham.duyetHS(${i}, false, this)">✕ Không duyệt</button>
            <button class="btn-primary" onclick="ModulePhongKham.duyetHS(${i}, true, this)">✓ Đồng ý</button>
          </div></div>`).join('')}` : ''}
      <input class="form-input" style="font-size:16px;margin:8px 0;" placeholder="🔍 Tìm tên, vị trí, tổ…" oninput="ModulePhongKham.loc(this.value)" aria-label="Tìm nhân sự">
      <div class="hn-list" id="pkNsDs">${ds.map(n => `
        <div class="hn-dong pk-ns" role="button" tabindex="0" data-ma="${e(n.ma || '')}" data-tim="${e(String([n.hoTen, n.viTri, n.to, n.ma].join(' ')).toLowerCase())}" onclick="ModulePhongKham.xemHS(this)">
          <div class="dong-content"><div class="dong-title">${e(n.hoTen || '')}</div><div class="dong-sub">${e([n.viTri, n.to].filter(Boolean).join(' · '))}</div></div>
          <div class="dong-meta"><span class="badge ${/thử/i.test(n.trangThai || '') ? 'vang' : 'xanh'}">${e(n.trangThai || '')}</span><span class="dong-arrow">›</span></div>
        </div><div class="pk-hs" hidden></div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Chưa có danh sách nhân sự.</div>'}`;
  },

  /** Bấm 1 người ➜ mở / đóng hồ sơ (Live: webHoSoNhanSu; Demo: dòng danh sách). */
  xemHS: async function(dong) {
    const khung = dong.nextElementSibling, ma = dong.dataset.ma, e = ShinApp.esc;
    if (!khung || !ma) return;
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;
    khung.innerHTML = '<div class="chu-phu">Đang tải hồ sơ…</div>';
    try {
      let h;
      if (this._live) {
        const kq = await SHIN_API.goi('PK', 'webHoSoNhanSu', { ma });
        if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
        h = kq.data || {};
      } else h = ((this.demo().nhanSu || {}).ds || []).find(n => n.ma === ma) || {};
      khung.innerHTML = `<div class="the">${[['Vị trí', h.viTri], ['Tổ', h.to], ['Ngày vào', h.ngayVao], ['Email', h.email], ['Điện thoại', h.dienThoai]]
        .map(x => `<div class="hang-tru"><span class="chu-phu">${x[0]}</span><span>${e(x[1] || '—')}</span></div>`).join('')}</div>`;
    } catch (err) { khung.innerHTML = `<div class="chu-phu" style="color:var(--c-red);">⚠️ ${e(err.message)}</div>`; }
  },

  /** Duyệt / không duyệt 1 yêu cầu sửa hồ sơ (không duyệt bắt buộc lý do), ghi đúng 1 lần (khóa nút). */
  duyetHS: async function(i, dongY, nut) {
    const d = this._live ? this._cache.nhansu : this.demo().nhanSu;
    const y = d && (d.yeuCauSua || [])[i];
    if (!y) return;
    const o = document.getElementById('pkYCLyDo_' + i), lyDo = o ? o.value.trim() : '';
    if (!dongY && !lyDo) { ShinApp.toast('Ghi rõ lý do không duyệt để nhân viên biết.', 'warn'); if (o) o.focus(); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui('webDuyetSuaHoSo', { id: y.id, dongY, lyDo }), 'pk-hs-' + y.id + '-' + y.truong);
    if (!kq) return;
    ShinApp.toast(kq.demo ? 'Demo: không gửi máy chủ.' : (dongY ? 'Đã duyệt sửa hồ sơ.' : 'Đã báo không duyệt.'), kq.demo ? 'info' : 'success');
    d.yeuCauSua = (d.yeuCauSua || []).filter(x => x.id !== y.id);
    d.choSua = Math.max(0, (Number(d.choSua) || 0) - 1);
    const el = document.getElementById('pkXem'); if (el && this._tab === 'nhansu') el.innerHTML = this.ve_nhansu(d);
  },

  loc: function(q) {
    q = String(q || '').toLowerCase().trim();
    document.querySelectorAll('.pk-ns').forEach(r => { r.style.display = !q || r.dataset.tim.includes(q) ? '' : 'none'; });
  },

  /* ---------- 💬 Góp ý (webGopYCuaToi · webGuiGopY) ---------- */
  ve_gopy: function(d) {
    const e = ShinApp.esc, ds = d.ds || [];
    return `
      <div class="the">
        <label class="form-label" for="pkGyNd">GỬI GÓP Ý / BÁO LỖI</label>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;" role="radiogroup">
          <button class="chip-chon dang-chon" data-gy="gop_y" onclick="ModulePhongKham.chonGy(this)">💡 Góp ý</button>
          <button class="chip-chon" data-gy="bao_loi" onclick="ModulePhongKham.chonGy(this)">🐞 Báo lỗi</button>
        </div>
        <textarea id="pkGyNd" class="form-input" style="font-size:16px;min-height:90px;" maxlength="2000" placeholder="Nội dung"></textarea>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">📨 Gửi</button></div>
      </div>
      <div class="hn-tieu"><span>ĐÃ GỬI · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(x => `
        <div class="hn-dong" style="cursor:default;">
          <div class="dong-content"><div class="dong-title">${x.loai === 'bao_loi' ? '🐞 ' : '💡 '}${e(x.noiDung || '')}</div>
            <div class="dong-sub">${e(x.luc || '')}${x.traLoi ? ' · Trả lời: ' + e(x.traLoi) : ''}</div></div>
          <div class="dong-meta">${this.badge(this.TT_GY[x.trangThai], x.trangThai)}</div>
        </div>`).join('')}</div>`;
  },

  chonGy: function(nut) { document.querySelectorAll('[data-gy]').forEach(b => b.classList.toggle('dang-chon', b === nut)); },

  guiGopY: async function(nut) {
    const o = document.getElementById('pkGyNd'), noiDung = o ? o.value.trim() : '';
    if (!noiDung) { ShinApp.toast('Nhập nội dung trước đã.', 'warn'); return; }
    const loai = (document.querySelector('[data-gy].dang-chon') || {}).dataset ? document.querySelector('[data-gy].dang-chon').dataset.gy : 'gop_y';
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui('webGuiGopY', { loai, noiDung, anh: [] }), 'pk-gopy');
    if (!kq) return;
    ShinApp.toast(kq.demo ? 'Demo: không gửi máy chủ.' : 'Đã gửi – cảm ơn anh/chị!', kq.demo ? 'info' : 'success');
    if (!kq.demo) this.veXem(true);
  },

  /* ---------- 👤 Hồ sơ (webHoSo – chỉ xem) ---------- */
  ve_hoso: function(d) {
    const e = ShinApp.esc;
    const dong = [['Họ tên', d.hoTen], ['Vị trí', d.viTri], ['Tổ', d.to], ['Ngày vào', d.ngayVao], ['Email', d.email], ['Điện thoại', d.dienThoai]];
    return `<div class="the">${dong.map(x => `<div class="hang-tru"><span class="chu-phu">${x[0]}</span><span style="overflow-wrap:anywhere;text-align:right;">${e(x[1] || '–')}</span></div>`).join('')}</div>
      <div class="hang-nut"><span class="chu-phu">Đề nghị sửa hồ sơ: làm trên app PK.</span><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Sửa hồ sơ')">Mở app PK</button></div>`;
  }
};
