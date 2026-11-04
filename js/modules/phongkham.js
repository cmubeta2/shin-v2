/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH – app PK v1.0.7, dùng chung file dữ liệu PTKH).
 * v2.6.5: nối THẬT các cổng PK L1–L5 (hợp đồng 21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md mục 4).
 *   Cổng PK nhận (token, du) như Hub ➜ gọi SHIN_API.goi('PK', 'web…', du) – KHÔNG dùng goiCong (du.a).
 *   🏠 webKhoiDong + webHomNay · 📝 webBaoCao / webNopBaoCao · ✅ webCongViec / webChiTietViec / webCapNhatViec / webThemViecCaNhan
 *   📅 webLichTuan (chỉ đọc) · 🔔 webThongBao / webDaDocThongBao · 💬 webGopYCuaToi / webGuiGopY · 👤 webHoSo / webDeNghiSuaHoSo
 *   ☑️ webChoDuyet / webDuyet (tổ trưởng, admin) · 👥 webNhanSu / webDuyetSuaHoSo (lãnh đạo, admin).
 * Xin nghỉ / đổi ca / xếp lịch: ghi qua webGoi PTKH – v2 chưa có cổng ➜ mở app PK v1.
 * Demo (không token): dữ liệu GIẢ trong demo_data.js (SHIN_DEMO_DATA.phongkham), mọi nút ghi chỉ báo "chế độ trình diễn".
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  CA: ['Hành chính', 'Ca 7h-15h', 'Ca NTC (6h45-12h)'],
  THE: [['homnay', '🏠 Hôm nay'], ['baocao', '📝 Báo cáo'], ['congviec', '✅ Công việc'], ['lich', '📅 Lịch'], ['thongbao', '🔔 Thông báo'],
    ['duyet', '☑️ Duyệt'], ['nhansu', '👥 Nhân sự'], ['gopy', '💬 Góp ý'], ['toi', '👤 Hồ sơ']],
  CONG: { homnay: 'webHomNay', baocao: 'webBaoCao', congviec: 'webCongViec', lich: 'webLichTuan', thongbao: 'webThongBao',
    duyet: 'webChoDuyet', nhansu: 'webNhanSu', gopy: 'webGopYCuaToi', toi: 'webHoSo' },
  TT_BC: { da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] },
  TT_GY: { moi: ['Mới', 'xam'], dang_xu_ly: ['Đang xử lý', 'vang'], xong: ['Đã xong', 'xanh'] },

  _tab: 'homnay',
  _d: null,          // { live, kd, cache: {tab: du}, loi: {tab: chữ} }
  _locViec: '',
  _anh: [],

  /** Gọi 1 cổng PK, ném lỗi tiếng Việt. */
  goi: async function(hanh, du) {
    const kq = await SHIN_API.goi('PK', hanh, du || {});
    if (!kq.ok) throw Object.assign(new Error(SHIN_API.moTaLoi(kq)), { loi: kq.loi });
    return kq.data;
  },

  taiLive: async function() {
    const [kd, hn] = await Promise.all([SHIN_API.goi('PK', 'webKhoiDong', {}), SHIN_API.goi('PK', 'webHomNay', {})]);
    if (!kd.ok) return kd;
    const d = { live: true, kd: kd.data || {}, cache: {}, loi: {} };
    if (hn.ok) d.cache.homnay = hn.data || {}; else d.loi.homnay = SHIN_API.moTaLoi(hn);
    return { ok: true, data: d };
  },

  demo: function() {
    const m = (window.SHIN_DEMO_DATA || {}).phongkham || {};
    return { live: false, kd: m.kd || { mo: ['homnay'] }, cache: Object.assign({}, m.cache || {}), loi: {} };
  },

  render: function(container, data) {
    this._d = data && data.live ? data : this.demo();
    const mo = (this._d.kd.mo || []);
    if (mo.indexOf(this._tab) < 0) this._tab = 'homnay';
    const e = ShinApp.esc, ng = this._d.kd.nguoi || {}, dem = this._d.kd.dem || {};
    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${ng.hoTen ? e(ng.hoTen) + ' · ' + e(ng.vaiTro || '') : 'Báo cáo ngày · Công việc · Lịch'}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt" aria-label="Cài đặt">⚙️</button>
      </div>
      <div class="hang-tab" role="tablist">
        ${this.THE.filter(t => mo.indexOf(t[0]) >= 0).map(t => {
          const so = t[0] === 'duyet' ? dem.choDuyet : t[0] === 'thongbao' ? dem.thongBao : 0;
          return `<button class="tab-nut ${this._tab === t[0] ? 'dang-chon' : ''}" role="tab" aria-selected="${this._tab === t[0]}" data-tab="${t[0]}" onclick="ModulePhongKham.chonTab('${t[0]}')">${t[1]}${so ? ' · ' + ShinApp.soVN(so) : ''}</button>`;
        }).join('')}
      </div>
      <div id="pkNoiDung"></div>`;
    this.veTab();
  },

  chonTab: function(tab) {
    this._tab = tab;
    document.querySelectorAll('.hang-tab .tab-nut').forEach(b => { const c = b.dataset.tab === tab; b.classList.toggle('dang-chon', c); b.setAttribute('aria-selected', c); if (c && b.scrollIntoView) b.scrollIntoView({ block: 'nearest', inline: 'nearest' }); });
    this.veTab();
  },

  /** Vẽ thẻ đang chọn; Live chưa có dữ liệu ➜ gọi cổng (lỗi ➜ dải đỏ, KHÔNG thay bằng số mẫu). */
  veTab: async function(taiLai) {
    const o = document.getElementById('pkNoiDung');
    if (!o) return;
    const tab = this._tab, d = this._d;
    if (d.live && (taiLai || (d.cache[tab] === undefined && !d.loi[tab]))) {
      o.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
      const du = tab === 'congviec' ? { loc: this._locViec } : tab === 'duyet' ? { loai: 'tatca' } : {};
      try { d.cache[tab] = await this.goi(this.CONG[tab], du) || {}; delete d.loi[tab]; }
      catch (err) { delete d.cache[tab]; d.loi[tab] = err.message; }
      if (this._tab !== tab || !document.getElementById('pkNoiDung')) return;
    }
    if (d.loi[tab]) {
      o.innerHTML = `<div class="the"><div class="dong-title">⚠️ Không tải được dữ liệu từ app PK</div><div class="chu-phu">${ShinApp.esc(d.loi[tab])}</div>
        <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.taiLai()">↻ Thử lại</button></div></div>`;
      return;
    }
    const v = d.cache[tab] || {};
    const ve = { homnay: this.veHomNay, baocao: this.veBaoCao, congviec: this.veCongViec, lich: this.veLich, thongbao: this.veThongBao,
      duyet: this.veDuyet, nhansu: this.veNhanSu, gopy: this.veGopY, toi: this.veHoSo }[tab];
    o.innerHTML = ve ? ve.call(this, v, ShinApp.esc) : '';
  },

  taiLai: function() { if (this._d) { delete this._d.loi[this._tab]; this.veTab(true); } },

  /** Ghi: Demo ➜ chỉ báo; Live ➜ goiNut. Trả dữ liệu hoặc null. */
  ghi: async function(nut, chuCho, hanh, du) {
    if (!this._d.live) { ShinApp.toast('Chế độ trình diễn – có token Hub mới gửi lên app PK.', 'info'); return null; }
    return ShinApp.goiNut(nut, chuCho, () => this.goi(hanh, du), hanh);
  },

  /* ---------- 🏠 Hôm nay ---------- */
  veHomNay: function(h, e) {
    const can = h.canXuLy || [], tb = h.thongBaoMoi || [];
    const bc = h.baoCaoHomNay === 'da_nop' ? ['Đã nộp', 'var(--c-green)'] : h.baoCaoHomNay === 'nghi' ? ['Nghỉ', 'var(--c-gray)'] : ['Chưa nộp', 'var(--c-red)'];
    return `
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Vận hành hôm nay 🏥</div>
          <div class="hero-date">📅 ${e(h.ngay || ShinApp.ngayVN())}</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:${bc[1]}">${bc[0]}</div><div class="tq-nhan">Báo cáo hôm nay</div></div>
          <div class="tq-o"><div class="tq-so" style="color:${h.viecQuaHan ? 'var(--c-red)' : 'var(--c-gray)'}">${ShinApp.soVN(h.viecQuaHan || 0)}</div><div class="tq-nhan">Việc quá hạn</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${ShinApp.soVN(h.viecHomNay || 0)}</div><div class="tq-nhan">Việc hạn hôm nay</div></div>
        </div>
        ${h.baoCaoHomNay === 'chua_nop' ? `<button class="btn-primary" onclick="ModulePhongKham.chonTab('baocao')">📝 Nộp báo cáo ngày</button>` : ''}
      </div>
      ${h.choDuyet ? `<button class="the hang-tru" style="width:100%;text-align:left;cursor:pointer" onclick="ModulePhongKham.chonTab('duyet')"><span>☑️ ${ShinApp.soVN(h.choDuyet)} báo cáo chờ anh/chị duyệt</span><span>›</span></button>` : ''}
      <div class="hn-tieu"><span>CẦN XỬ LÝ · ${can.length}</span></div>
      <div class="hn-list">${can.map(c => `
        <div class="hn-dong" onclick="ModulePhongKham.chonTab('${c.tab === 'congviec' ? 'congviec' : 'homnay'}')" style="cursor:pointer">
          <div class="dong-content"><div class="dong-title">${e(c.ten)}</div><div class="dong-sub">${e(c.nguon || '')}</div></div>
          <div class="dong-meta"><span class="badge ${e(c.muc || 'xam')}">${c.han ? e(c.han) : 'Không hạn'}</span></div>
        </div>`).join('')}</div>
      ${can.length ? '' : '<div class="trong">Không có việc mở – tốt lắm 👍</div>'}
      ${tb.length ? `<div class="hn-tieu"><span>THÔNG BÁO MỚI · ${tb.length}</span></div>${tb.map(t => `<div class="hang-tru"><span>${e(t.tieuDe)}</span><span class="chu-phu">${e(t.luc || '')}</span></div>`).join('')}` : ''}`;
  },

  /* ---------- 📝 Báo cáo ngày ---------- */
  veBaoCao: function(b, e) {
    const ls = b.lichSu || [], mau = b.mau || [];
    const homNay = new Date(); const p = x => (x < 10 ? '0' : '') + x;
    const ngayISO = `${homNay.getFullYear()}-${p(homNay.getMonth() + 1)}-${p(homNay.getDate())}`;
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-green)">${ShinApp.soVN(b.soDaNop || 0)}</b>Đã nộp tháng</div>
        <div class="o-so-loc"><b style="color:var(--c-red)">${ShinApp.soVN(b.soChuaNop || 0)}</b>Ngày chưa nộp</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${ShinApp.soVN(b.soChoDuyet || 0)}</b>Chờ duyệt</div>
      </div>
      <div class="the form-the">
        <div class="dong-title">📝 Nộp báo cáo ngày</div>
        <label class="nhan-o" for="pkNgay">Ngày</label>
        <input id="pkNgay" type="date" class="form-input" value="${ngayISO}" max="${ngayISO}">
        ${mau.map(m => m.ma === 'ca' ? `
          <label class="nhan-o" for="pkBC_ca">Ca làm *</label>
          <select id="pkBC_ca" class="form-input"><option value="">– Chọn ca –</option>${this.CA.map(c => `<option>${e(c)}</option>`).join('')}</select>` : `
          <label class="nhan-o" for="pkBC_${e(m.ma)}">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so' ? `<input id="pkBC_${e(m.ma)}" data-ma="${e(m.ma)}" class="form-input pk-bc" type="number" inputmode="numeric" min="0">`
            : `<textarea id="pkBC_${e(m.ma)}" data-ma="${e(m.ma)}" class="form-input pk-bc" rows="3"></textarea>`}`).join('')}
        <label class="nhan-o" for="pkAnh">Ảnh minh chứng (tối đa 6)</label>
        <input id="pkAnh" type="file" accept="image/*" multiple class="form-input" onchange="ModulePhongKham.chonAnh(this, 6)">
        <div class="chu-phu" id="pkAnhSo"></div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">📤 Nộp báo cáo</button></div>
      </div>
      <div class="hn-tieu"><span>LỊCH SỬ · ${ls.length}</span></div>
      <div class="hn-list">${ls.map(r => { const t = this.TT_BC[r.trangThai] || [r.trangThai || '', 'xam']; return `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(r.ngay)}</div>
          <div class="dong-sub">${e(r.tomTat || '')}${r.soAnh ? ' · 📷 ' + ShinApp.soVN(r.soAnh) : ''}${r.lyDoTraLai ? ' · Lý do: ' + e(r.lyDoTraLai) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${t[1]}">${e(t[0])}</span></div></div>`; }).join('')}</div>
      ${ls.length ? '' : '<div class="trong">Chưa có báo cáo trong tháng.</div>'}`;
  },

  /** Đọc ảnh ➜ JPEG ≤ 1600px, base64 không tiền tố (hợp đồng PK). */
  chonAnh: async function(input, toiDa) {
    const tep = Array.from(input.files || []).slice(0, toiDa);
    if ((input.files || []).length > toiDa) ShinApp.toast(`Chỉ lấy ${toiDa} ảnh đầu.`, 'warn');
    const thu = f => new Promise((ok, loi) => {
      const r = new FileReader();
      r.onerror = () => loi(new Error('Không đọc được ảnh ' + f.name));
      r.onload = () => { const img = new Image(); img.onerror = () => loi(new Error('Ảnh hỏng: ' + f.name));
        img.onload = () => { const k = Math.min(1, 1600 / Math.max(img.width, img.height)); const c = document.createElement('canvas');
          c.width = Math.round(img.width * k); c.height = Math.round(img.height * k); c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          ok({ ten: f.name.replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: c.toDataURL('image/jpeg', 0.82).split(',')[1] }); };
        img.src = r.result; };
      r.readAsDataURL(f);
    });
    try { this._anh = await Promise.all(tep.map(thu)); } catch (err) { this._anh = []; ShinApp.toast(err.message, 'error'); }
    const o = document.getElementById('pkAnhSo') || document.getElementById('pkGyAnhSo');
    if (o) o.textContent = this._anh.length ? `Đã chọn ${this._anh.length} ảnh.` : '';
  },

  nopBaoCao: async function(nut) {
    const ngay = (document.getElementById('pkNgay') || {}).value || '';
    const ca = (document.getElementById('pkBC_ca') || {}).value || '';
    if (!ngay) { ShinApp.toast('Chưa chọn ngày.', 'warn'); return; }
    if (!ca) { ShinApp.toast('Chưa chọn ca làm.', 'warn'); document.getElementById('pkBC_ca').focus(); return; }
    const noiDung = { ca };
    let thieu = null;
    document.querySelectorAll('.pk-bc').forEach(o => { const v = o.value.trim(); if (v) noiDung[o.dataset.ma] = v; });
    ((this._d.cache.baocao || {}).mau || []).forEach(m => { if (m.batBuoc && !noiDung[m.ma] && !thieu) thieu = m; });
    if (thieu) { ShinApp.toast('Còn thiếu: ' + thieu.nhan, 'warn'); return; }
    const p = ngay.split('-');
    const kq = await this.ghi(nut, 'Đang nộp…', 'webNopBaoCao', { ngay: `${p[2]}/${p[1]}/${p[0]}`, noiDung, anh: this._anh });
    if (!kq) return;
    this._anh = [];
    if (kq.loiAnh && kq.loiAnh.length) ShinApp.toast('Báo cáo đã ghi, nhưng ảnh lỗi – chọn lại ảnh: ' + kq.loiAnh.join('; '), 'warn', { thoiGian: 8000 });
    delete this._d.cache.homnay;
    this.veTab(true);
  },

  /* ---------- ✅ Công việc ---------- */
  veCongViec: function(c, e) {
    const ds = c.viec || [];
    const LOAI = { giao: 'Được giao', canhan: 'Cá nhân', nhogiup: 'Nhờ giúp' };
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${ShinApp.soVN(c.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:var(--c-red)">${ShinApp.soVN(c.quaHan || 0)}</b>Quá hạn</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${ShinApp.soVN(c.xongTuan || 0)}</b>Xong tuần này</div>
      </div>
      <div class="hang-chip">${[['', 'Tất cả'], ['giao', 'Được giao'], ['canhan', 'Cá nhân'], ['nhogiup', 'Nhờ giúp']].map(l =>
        `<button class="chip-chon ${this._locViec === l[0] ? 'dang-chon' : ''}" onclick="ModulePhongKham.locViec('${l[0]}')">${l[1]}</button>`).join('')}</div>
      <div class="hn-list">${ds.map(v => `
        <div class="hn-dong" style="cursor:pointer" onclick="ModulePhongKham.moViec('${e(v.id)}')">
          <div class="dong-content"><div class="dong-title">${e(v.ten)}</div>
            <div class="dong-sub">${e(LOAI[v.loai] || v.loai || '')}${v.nguoiGiao ? ' · ' + e(v.nguoiGiao) : ''} · ${ShinApp.soVN(v.tienDo || 0)}%</div>
            <div class="thanh-tien"><div style="width:${Math.max(0, Math.min(100, v.tienDo || 0))}%"></div></div></div>
          <div class="dong-meta"><span class="badge ${e(v.muc || 'xam')}">${v.han ? e(v.han) : 'Không hạn'}</span></div>
        </div>
        <div id="pkViec_${e(v.id).replace(/[^A-Za-z0-9_-]/g, '_')}"></div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Không có việc nào.</div>'}
      <div class="the form-the">
        <div class="dong-title">➕ Việc cá nhân</div>
        <label class="nhan-o" for="pkVcnTen">Việc cần làm</label>
        <input id="pkVcnTen" class="form-input" maxlength="200">
        <label class="nhan-o" for="pkVcnHan">Hạn (không bắt buộc)</label>
        <input id="pkVcnHan" type="date" class="form-input">
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.themViec(this)">Thêm việc</button></div>
      </div>`;
  },

  locViec: function(l) { this._locViec = l; if (this._d.live) this.veTab(true); else ShinApp.toast('Chế độ trình diễn – lọc chạy khi có token Hub.', 'info'); },

  khoaId: function(id) { return 'pkViec_' + String(id).replace(/[^A-Za-z0-9_-]/g, '_'); },

  moViec: async function(id) {
    const o = document.getElementById(this.khoaId(id));
    if (!o) return;
    if (o.innerHTML) { o.innerHTML = ''; return; }
    const e = ShinApp.esc;
    let v;
    if (!this._d.live) v = ((this._d.cache.chiTietViec || {})[id]) || Object.assign({ viecCon: [], traoDoi: [] }, (this._d.cache.congviec.viec || []).find(x => x.id === id));
    else {
      o.innerHTML = '<div class="chu-phu">Đang tải chi tiết…</div>';
      try { v = await this.goi('webChiTietViec', { id }); } catch (err) { o.innerHTML = `<div class="chu-phu">⚠️ ${e(err.message)}</div>`; return; }
    }
    this._viec = v;
    o.innerHTML = `<div class="the chi-tiet-dong">
      ${v.moTa ? `<div class="chu-phu">${e(v.moTa)}</div>` : ''}
      <label class="nhan-o" for="pkTienDo">Tiến độ</label>
      <select id="pkTienDo" class="form-input">${[0, 50, 100].map(n => `<option value="${n}" ${Number(v.tienDo) === n ? 'selected' : ''}>${n === 0 ? 'Chưa làm' : n === 50 ? 'Đang làm' : 'Xong'} (${n}%)</option>`).join('')}</select>
      ${(v.viecCon || []).length ? `<div class="nhan-o">Việc con</div>${v.viecCon.map(c => `<label class="hang-tru" style="min-height:44px"><span><input type="checkbox" class="pk-vc" value="${e(c.id)}" ${c.xong ? 'checked' : ''}> ${e(c.ten)}</span></label>`).join('')}` : ''}
      ${(v.traoDoi || []).length ? `<div class="nhat-ky">${v.traoDoi.map(t => `<div><b>${e(t.nguoi)}</b> · ${e(t.luc || '')}<br>${e(t.chu)}</div>`).join('')}</div>` : ''}
      <label class="nhan-o" for="pkTraoDoi">Trao đổi thêm</label>
      <textarea id="pkTraoDoi" class="form-input" rows="2"></textarea>
      <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.luuViec(this, '${e(id)}')">Lưu thay đổi</button></div>
    </div>`;
  },

  luuViec: async function(nut, id) {
    const v = this._viec || {}, du = { id };
    const td = Number((document.getElementById('pkTienDo') || {}).value);
    if (td !== Number(v.tienDo)) du.tienDo = td;
    const conCu = (v.viecCon || []).filter(c => c.xong).map(c => String(c.id)).sort().join('|');
    const con = Array.from(document.querySelectorAll('.pk-vc:checked')).map(x => x.value);
    if (con.slice().sort().join('|') !== conCu) du.viecConXong = con;
    const chu = ((document.getElementById('pkTraoDoi') || {}).value || '').trim();
    if (chu) du.traoDoiMoi = chu;
    if (Object.keys(du).length === 1) { ShinApp.toast('Chưa có gì thay đổi.', 'info'); return; }
    if (await this.ghi(nut, 'Đang lưu…', 'webCapNhatViec', du)) this.veTab(true);
  },

  themViec: async function(nut) {
    const ten = ((document.getElementById('pkVcnTen') || {}).value || '').trim();
    const han = (document.getElementById('pkVcnHan') || {}).value || '';
    if (!ten) { ShinApp.toast('Nhập việc cần làm.', 'warn'); return; }
    const p = han.split('-');
    if (await this.ghi(nut, 'Đang thêm…', 'webThemViecCaNhan', { ten, han: han ? `${p[2]}/${p[1]}/${p[0]}` : '' })) this.veTab(true);
  },

  /* ---------- 📅 Lịch tuần (chỉ đọc) ---------- */
  veLich: function(l, e) {
    const TT = { cho: ['Chờ duyệt', 'vang'], da_duyet: ['Đã duyệt', 'xanh'], tra_lai: ['Trả lại', 'do'] };
    return `
      <div class="the"><div class="dong-title">📅 ${e(l.tuan || 'Tuần này')}</div>
        <div class="chu-phu">Phép còn: <b>${ShinApp.soVN(l.phepCon || 0)}</b> · Nghỉ bù còn: <b>${ShinApp.soVN(l.nghiBuCon || 0)}</b></div></div>
      <div class="hn-list">${(l.ngay || []).map(n => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(n.thu || '')} ${e(n.ngay || '')}</div>
          <div class="dong-sub">${n.nghi || n.le ? e(n.le || 'Nghỉ') : e([n.viTri, n.ca].filter(Boolean).join(' · ') || 'Chưa xếp')}</div></div>
          <div class="dong-meta">${n.nghi || n.le ? '<span class="badge xam">Nghỉ</span>' : ''}</div></div>`).join('')}</div>
      ${(l.donNghi || []).length ? `<div class="hn-tieu"><span>ĐƠN NGHỈ</span></div>${l.donNghi.map(d => { const t = TT[d.trangThai] || [d.trangThai || '', 'xam']; return `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(d.loai || '')} · ${e(d.tuNgay || '')}${d.denNgay && d.denNgay !== d.tuNgay ? ' – ' + e(d.denNgay) : ''}</div>
          <div class="dong-sub">${e(d.lyDo || '')}${d.lyDoTraLai ? ' · Lý do trả: ' + e(d.lyDoTraLai) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${t[1]}">${e(t[0])}</span></div></div>`; }).join('')}` : ''}
      <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Xin nghỉ / đổi ca')">📝 Xin nghỉ / đổi ca (app PK)</button></div>`;
  },

  /* ---------- 🔔 Thông báo ---------- */
  veThongBao: function(t, e) {
    const ds = t.ds || [], chua = ds.filter(x => !x.daDoc).length;
    return `
      <div class="hang-nut"><span class="chu-phu">${ShinApp.soVN(chua)} chưa đọc / ${ShinApp.soVN(ds.length)}</span>
        ${chua ? '<button class="btn-secondary" onclick="ModulePhongKham.docHet()">✓ Đánh dấu đã đọc hết</button>' : ''}</div>
      <div class="hn-list">${ds.map(x => `
        <div class="hn-dong ${x.daDoc ? 'mo-di' : ''}"><div class="dong-content"><div class="dong-title">${x.daDoc ? '' : '● '}${e(x.tieuDe)}</div>
          <div class="dong-sub">${e(x.noiDung || '')}</div></div><div class="dong-meta"><span class="chu-phu">${e(x.luc || '')}</span></div></div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Không có thông báo.</div>'}`;
  },

  docHet: function() {
    const ds = (this._d.cache.thongbao || {}).ds || [];
    const cu = ds.map(x => x.daDoc);
    const dat = (v) => { ds.forEach((x, i) => { x.daDoc = v === null ? cu[i] : v; }); if (this._tab === 'thongbao') this.veTab(); };
    ShinApp.hanhDongHoanTac('Đã đánh dấu đọc hết.', {
      lamTruoc: () => dat(true),
      traLai: () => dat(null),
      thucHien: async () => { if (this._d.live) await this.goi('webDaDocThongBao', { id: 'tatca' }); }
    });
  },

  /* ---------- ☑️ Duyệt (tổ trưởng / admin) ---------- */
  veDuyet: function(c, e) {
    const bc = c.baoCao || [], ng = c.nghi || [];
    return `
      <div class="hn-tieu"><span>BÁO CÁO CHỜ DUYỆT · ${bc.length}</span>
        ${bc.length > 1 ? `<button class="btn-secondary" onclick="ModulePhongKham.duyetDat(null)">Duyệt đạt tất cả</button>` : ''}</div>
      <div class="hn-list">${bc.map(b => `
        <div class="the" id="pkDuyet_${e(b.id).replace(/[^A-Za-z0-9_-]/g, '_')}">
          <div class="dong-title">${e(b.nguoi)} · ${e(b.ngay)}</div>
          <div class="chu-phu">${e(b.tomTat || '')}${(b.anh || []).length ? ` · 📷 ${(b.anh || []).map((u, i) => /^https:\/\//.test(u) ? `<a href="${e(u)}" target="_blank" rel="noopener">ảnh ${i + 1}</a>` : '').join(' ')}` : ''}</div>
          <div class="hang-nut">
            <button class="btn-primary" onclick="ModulePhongKham.duyetDat('${e(b.id)}')">✓ Đạt</button>
            <button class="btn-secondary" onclick="ModulePhongKham.moTraLai('${e(b.id)}')">↩ Trả lại</button>
          </div><div class="pk-tralai"></div>
        </div>`).join('')}</div>
      ${bc.length ? '' : '<div class="trong">Không có báo cáo chờ duyệt.</div>'}
      ${ng.length ? `<div class="hn-tieu"><span>ĐƠN NGHỈ CHỜ DUYỆT · ${ng.length}</span></div>${ng.map(n => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(n.nguoi)} · ${e(n.loai || '')}</div>
          <div class="dong-sub">${e(n.tuNgay || '')}${n.denNgay && n.denNgay !== n.tuNgay ? ' – ' + e(n.denNgay) : ''} · ${e(n.lyDo || '')}</div></div></div>`).join('')}
        <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Duyệt đơn nghỉ')">Duyệt đơn nghỉ trên app PK</button></div>` : ''}`;
  },

  /** Đạt 1 báo cáo (id) hoặc tất cả (null): ẩn ngay, Hoàn tác 6 giây, hết giờ mới gửi đúng 1 lần. */
  duyetDat: function(id) {
    const c = this._d.cache.duyet || {}, cu = (c.baoCao || []).slice();
    const ids = id ? [id] : cu.map(b => b.id);
    if (!ids.length) return;
    const dem = this._d.kd.dem || {}, demCu = dem.choDuyet;
    ShinApp.hanhDongHoanTac(ids.length > 1 ? `Đã duyệt đạt ${ids.length} báo cáo.` : 'Đã duyệt đạt.', {
      lamTruoc: () => { c.baoCao = cu.filter(b => ids.indexOf(b.id) < 0); dem.choDuyet = Math.max(0, (demCu || 0) - ids.length); this.veTab(); },
      traLai: () => { c.baoCao = cu; dem.choDuyet = demCu; this.veTab(); },
      thucHien: async () => { if (this._d.live) await this.goi('webDuyet', { loai: 'baocao', ids, ketQua: 'dat' }); }
    });
  },

  moTraLai: function(id) {
    const the = document.getElementById('pkDuyet_' + String(id).replace(/[^A-Za-z0-9_-]/g, '_'));
    const o = the && the.querySelector('.pk-tralai');
    if (!o) return;
    o.innerHTML = `<label class="nhan-o">Lý do trả lại *</label><textarea class="form-input" rows="2"></textarea>
      <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.traLai(this, '${ShinApp.esc(id)}')">Gửi trả lại</button></div>`;
    o.querySelector('textarea').focus();
  },

  traLai: async function(nut, id) {
    const lyDo = (nut.closest('.pk-tralai').querySelector('textarea').value || '').trim();
    if (!lyDo) { ShinApp.toast('Ghi rõ lý do trả lại.', 'warn'); return; }
    if (await this.ghi(nut, 'Đang gửi…', 'webDuyet', { loai: 'baocao', ids: [id], ketQua: 'tra_lai', lyDo })) {
      const dem = this._d.kd.dem || {}; dem.choDuyet = Math.max(0, (dem.choDuyet || 0) - 1);
      this.veTab(true);
    }
  },

  /* ---------- 👥 Nhân sự (lãnh đạo / admin) ---------- */
  veNhanSu: function(n, e) {
    const ds = n.ds || [], yc = n.yeuCauSua || [];
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${ShinApp.soVN(n.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${ShinApp.soVN(n.moiVao || 0)}</b>Mới vào</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${ShinApp.soVN(n.choSua || 0)}</b>Chờ sửa hồ sơ</div>
      </div>
      ${yc.length ? `<div class="hn-tieu"><span>ĐỀ NGHỊ SỬA HỒ SƠ · ${yc.length}</span></div>${yc.map(y => `
        <div class="the"><div class="dong-title">${e(y.hoTen)} · ${e(y.truong)}</div>
          <div class="chu-phu">${e(y.giaTriCu || '–')} → <b>${e(y.giaTriMoi)}</b>${y.lyDo ? ' · ' + e(y.lyDo) : ''}</div>
          <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.duyetHoSo(this, '${e(y.id)}', true)">✓ Đồng ý</button>
            <button class="btn-secondary" onclick="ModulePhongKham.duyetHoSo(this, '${e(y.id)}', false)">✕ Từ chối</button></div></div>`).join('')}` : ''}
      <div class="hn-tieu"><span>DANH SÁCH · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(x => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(x.hoTen)}</div>
          <div class="dong-sub">${e([x.viTri, x.to].filter(Boolean).join(' · '))}</div></div>
          <div class="dong-meta"><span class="badge xam">${e(x.trangThai || '')}</span></div></div>`).join('')}</div>`;
  },

  duyetHoSo: async function(nut, id, dongY) {
    let lyDo = '';
    if (!dongY) {
      lyDo = (window.prompt('Lý do từ chối (bắt buộc):') || '').trim();
      if (!lyDo) { ShinApp.toast('Từ chối cần ghi lý do.', 'warn'); return; }
    }
    if (await this.ghi(nut, 'Đang gửi…', 'webDuyetSuaHoSo', { id, dongY, lyDo })) this.veTab(true);
  },

  /* ---------- 💬 Góp ý ---------- */
  veGopY: function(g, e) {
    const ds = g.ds || [];
    return `
      <div class="the form-the">
        <div class="dong-title">💬 Gửi góp ý / báo lỗi</div>
        <div class="hang-chip" role="radiogroup">
          <label class="chip-chon" style="display:inline-flex;align-items:center;gap:6px"><input type="radio" name="pkGyLoai" value="gop_y" checked> Góp ý</label>
          <label class="chip-chon" style="display:inline-flex;align-items:center;gap:6px"><input type="radio" name="pkGyLoai" value="bao_loi"> Báo lỗi</label>
        </div>
        <label class="nhan-o" for="pkGyNoiDung">Nội dung</label>
        <textarea id="pkGyNoiDung" class="form-input" rows="3"></textarea>
        <label class="nhan-o" for="pkGyAnh">Ảnh (tối đa 3)</label>
        <input id="pkGyAnh" type="file" accept="image/*" multiple class="form-input" onchange="ModulePhongKham.chonAnh(this, 3)">
        <div class="chu-phu" id="pkGyAnhSo"></div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">Gửi</button></div>
      </div>
      <div class="hn-tieu"><span>GÓP Ý CỦA TÔI · ${ds.length}</span></div>
      <div class="hn-list">${ds.map(x => { const t = this.TT_GY[x.trangThai] || [x.trangThai || '', 'xam']; return `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${x.loai === 'bao_loi' ? '🐞 ' : '💡 '}${e(x.noiDung)}</div>
          <div class="dong-sub">${e(x.luc || '')}${x.traLoi ? ' · Trả lời: ' + e(x.traLoi) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${t[1]}">${e(t[0])}</span></div></div>`; }).join('')}</div>`;
  },

  guiGopY: async function(nut) {
    const noiDung = ((document.getElementById('pkGyNoiDung') || {}).value || '').trim();
    const loai = (document.querySelector('input[name="pkGyLoai"]:checked') || {}).value || 'gop_y';
    if (!noiDung) { ShinApp.toast('Nhập nội dung góp ý.', 'warn'); return; }
    if (await this.ghi(nut, 'Đang gửi…', 'webGuiGopY', { loai, noiDung, anh: this._anh.slice(0, 3) })) { this._anh = []; ShinApp.toast('Đã gửi góp ý – cảm ơn anh/chị.', 'success'); this.veTab(true); }
  },

  /* ---------- 👤 Hồ sơ ---------- */
  veHoSo: function(h, e) {
    return `
      <div class="the">
        <div class="dong-title">👤 ${e(h.hoTen || '')}</div>
        ${[['Vị trí', h.viTri], ['Tổ', h.to], ['Ngày vào', h.ngayVao], ['Email', h.email], ['Điện thoại', h.dienThoai]].map(r =>
          `<div class="hang-tru"><span>${r[0]}</span><span>${e(r[1] || '–')}</span></div>`).join('')}
      </div>
      <div class="the form-the">
        <div class="dong-title">✏️ Đề nghị sửa hồ sơ</div>
        <label class="nhan-o" for="pkHsTruong">Thông tin cần sửa</label>
        <select id="pkHsTruong" class="form-input"><option value="hoTen">Họ tên</option><option value="dienThoai">Điện thoại</option><option value="ngayVao">Ngày vào làm</option></select>
        <label class="nhan-o" for="pkHsMoi">Giá trị mới</label>
        <input id="pkHsMoi" class="form-input">
        <label class="nhan-o" for="pkHsLyDo">Lý do</label>
        <input id="pkHsLyDo" class="form-input">
        <div class="chu-phu">Email do Admin sửa – nhắn Admin kèm email mới.</div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.deNghiSua(this)">Gửi đề nghị</button></div>
      </div>`;
  },

  deNghiSua: async function(nut) {
    const truong = document.getElementById('pkHsTruong').value;
    const giaTriMoi = document.getElementById('pkHsMoi').value.trim();
    const lyDo = document.getElementById('pkHsLyDo').value.trim();
    if (!giaTriMoi) { ShinApp.toast('Nhập giá trị mới.', 'warn'); return; }
    if (await this.ghi(nut, 'Đang gửi…', 'webDeNghiSuaHoSo', { truong, giaTriMoi, lyDo })) {
      ShinApp.toast('Đã gửi đề nghị – chờ lãnh đạo phòng duyệt.', 'success');
      document.getElementById('pkHsMoi').value = ''; document.getElementById('pkHsLyDo').value = '';
    }
  }
};
