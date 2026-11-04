/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH v1.0.7 – dùng chung file dữ liệu PTKH)
 * v2.6.5 (04/11): nối THẬT các cổng PK L1–L5 (hợp đồng: 21_PhongPTKH/KE_HOACH_GIAO_DIEN_PK_AGY.md mục 4).
 * Cổng PK gọi ham(token, du) – du là object (KHÔNG phải du.a như KPI / TS / KS) ➜ dùng SHIN_API.goi('PK', hanh, du).
 *   webKhoiDong() ➜ {nguoi:{hoTen, vaiTro, to, viTri, quyen}, app, mo:[tab…], dem:{thongBao, choDuyet}}
 *   webHomNay()   ➜ {ngay, viecQuaHan, viecHomNay, baoCaoHomNay, canXuLy:[{id, ten, nguon, han, muc, tab}], thongBaoMoi, choDuyet}
 *   webCongViec({loc}) · webCapNhatViec({id, tienDo}) · webThemViecCaNhan({ten, han})
 *   webBaoCao({thang}) · webNopBaoCao({ngay, noiDung, anh:[{ten, kieu, base64}]}) (≤ 6 ảnh JPEG ≤ 1600px)
 *   webChoDuyet({loai}) · webDuyet({loai, ids, ketQua, lyDo})
 *   webThongBao() · webDaDocThongBao({id|'tatca'}) · webGopYCuaToi() · webGuiGopY({loai, noiDung, anh})
 *   webHoSo() · webNhanSu({tim}) · webDuyetSuaHoSo({id, dongY, lyDo}) · webLichTuan({tuan})
 * Xin nghỉ / xếp lịch: PK chỉ mở cổng ĐỌC (L5) – ghi qua app v1 (nút mở app PK).
 * Demo: dữ liệu giả trong demo_data.js (phongkham).
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  _d: null,          // {live, nguoi, mo, dem, homNay}
  _tab: 'homnay',
  _tabDu: {},        // dữ liệu từng tab đã tải
  _tabLoi: {},
  _anh: [],          // ảnh minh chứng đang chọn [{ten, kieu, base64, xem}]
  _traLai: null,     // id đang mở ô "trả lại"

  TAB: [
    ['homnay', '🏠 Hôm nay'], ['congviec', '✅ Công việc'], ['baocao', '📝 Báo cáo'], ['duyet', '🖊️ Duyệt'],
    ['thongbao', '🔔 Thông báo'], ['lich', '📅 Lịch tuần'], ['nhansu', '👥 Nhân sự'], ['toi', '👤 Hồ sơ & Góp ý']
  ],
  CONG: {
    congviec: ['webCongViec', { loc: '' }], baocao: ['webBaoCao', { thang: '' }], duyet: ['webChoDuyet', { loai: 'tatca' }],
    thongbao: ['webThongBao', {}], lich: ['webLichTuan', { tuan: '' }], nhansu: ['webNhanSu', { tim: '' }]
  },
  MUC: { do: 'do', vang: 'vang', xanh: 'xanh', xam: 'xam' },

  taiLive: async function() {
    const [kd, hn] = await Promise.all([SHIN_API.goi('PK', 'webKhoiDong', {}), SHIN_API.goi('PK', 'webHomNay', {})]);
    if (!kd.ok) return kd;
    if (!hn.ok) return hn;
    this._tabDu = {}; this._tabLoi = {};
    return { ok: true, data: this.tuV1(kd.data, hn.data) };
  },

  /** THUẦN. webKhoiDong + webHomNay ➜ khuôn màn. */
  tuV1: function(kd, hn) {
    kd = kd || {}; hn = hn || {};
    return { live: true, nguoi: kd.nguoi || {}, mo: kd.mo || [], dem: kd.dem || {}, homNay: hn };
  },

  /** Tab được mở theo vai (webKhoiDong.mo); 'toi' gộp hồ sơ + góp ý. */
  tabDuocMo: function(d) {
    const mo = d.mo || [];
    if (!mo.length) return this.TAB;
    return this.TAB.filter(([k]) => k === 'homnay' || mo.indexOf(k) >= 0 || (k === 'toi' && (mo.indexOf('toi') >= 0 || mo.indexOf('gopy') >= 0)));
  },

  render: function(container, data) {
    if (data) this._d = data;
    if (!this._d || (!data && this._d.live && !SHIN_API.laCheDoLive())) this._d = null;
    const d = this._d || this.mau();
    if (!this._d) this._d = d;
    const e = ShinApp.esc;
    const tabs = this.tabDuocMo(d);
    if (!tabs.some(t => t[0] === this._tab)) this._tab = 'homnay';
    const nd = d.nguoi || {};
    const dem = d.dem || {};

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">${e(nd.hoTen || 'Nhân viên')}${nd.viTri ? ' · ' + e(nd.viTri) : ''}${nd.to ? ' · Tổ ' + e(nd.to) : ''}</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moV1('PK', 'App Phòng PTKH')" title="Mở app PK v1">↗️</button>
      </div>
      <div class="hang-tab" role="tablist">
        ${tabs.map(([k, t]) => {
          const so = k === 'thongbao' ? dem.thongBao : k === 'duyet' ? dem.choDuyet : 0;
          return `<button class="tab-nut ${this._tab === k ? 'dang-chon' : ''}" role="tab" aria-selected="${this._tab === k}" onclick="ModulePhongKham.chonTab('${k}')">${t}${so ? ' · ' + ShinApp.soVN(so) : ''}</button>`;
        }).join('')}
      </div>
      <div id="pkNoiDung">${this.veTab()}</div>
    `;
    if (this._tab !== 'homnay' && d.live && !this._tabDu[this._tab] && !this._tabLoi[this._tab]) this.taiTab(this._tab);
  },

  veLai: function() { const c = document.getElementById('appContent'); if (c) this.render(c, null); },

  chonTab: function(k) {
    this._tab = k;
    this._traLai = null;
    ShinApp.rung('nhe');
    this.veLai();
  },

  /** Live: tải dữ liệu tab khi mở lần đầu. Lỗi ➜ báo rõ trong tab, không thay bằng số mẫu. */
  taiTab: async function(k) {
    const cong = this.CONG[k];
    let kq;
    if (k === 'toi') {
      const [hs, gy] = await Promise.all([SHIN_API.goi('PK', 'webHoSo', {}), SHIN_API.goi('PK', 'webGopYCuaToi', {})]);
      kq = hs.ok && gy.ok ? { ok: true, data: { hoSo: hs.data || {}, gopY: (gy.data || {}).ds || [] } } : (hs.ok ? gy : hs);
    } else if (cong) {
      kq = await SHIN_API.goi('PK', cong[0], cong[1]);
    } else return;
    if (kq.ok) this._tabDu[k] = kq.data || {};
    else this._tabLoi[k] = SHIN_API.moTaLoi(kq);
    if (this._tab === k) this.veLai();
  },

  du: function(k) {
    const d = this._d || {};
    if (!d.live) { d.tab = d.tab || {}; return (d.tab[k] = d.tab[k] || {}); }
    return this._tabDu[k];
  },

  veTab: function() {
    const k = this._tab;
    if (k === 'homnay') return this.veHomNay();
    if (this._tabLoi[k]) return `<div class="the"><b>⚠️ Không tải được</b><p>${ShinApp.esc(this._tabLoi[k])}</p><button class="btn-secondary" onclick="ModulePhongKham.taiLaiTab()">Thử lại</button></div>`;
    const du = this.du(k);
    if (!du) return '<div class="man-tai"><div class="vong-tai"></div><div>Đang tải…</div></div>';
    return ({ congviec: this.veCongViec, baocao: this.veBaoCao, duyet: this.veDuyet, thongbao: this.veThongBao, lich: this.veLich, nhansu: this.veNhanSu, toi: this.veToi })[k].call(this, du);
  },

  taiLaiTab: function() { delete this._tabLoi[this._tab]; delete this._tabDu[this._tab]; this.veLai(); },

  /* ---------------- 🏠 Hôm nay ---------------- */
  veHomNay: function() {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const h = (this._d || {}).homNay || {};
    const can = h.canXuLy || [];
    const bc = h.baoCaoHomNay;
    const bcChu = bc === 'da_nop' ? ['Đã nộp', 'var(--c-green)'] : bc === 'nghi' ? ['Nghỉ', 'var(--c-gray)'] : ['Chưa nộp', 'var(--c-red)'];
    return `
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">${ShinApp.loiChao ? e(ShinApp.loiChao()) : 'Xin chào'} 🏥</div>
          <div class="hero-date">📅 ${e(h.ngay || ShinApp.ngayVN())}</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o" onclick="ModulePhongKham.chonTab('congviec')"><div class="tq-so" style="color:${h.viecQuaHan ? 'var(--c-red)' : 'var(--c-green)'}">${so(h.viecQuaHan || 0)}</div><div class="tq-nhan">Việc quá hạn</div></div>
          <div class="tq-o" onclick="ModulePhongKham.chonTab('congviec')"><div class="tq-so" style="color:var(--c-blue)">${so(h.viecHomNay || 0)}</div><div class="tq-nhan">Việc hôm nay</div></div>
          <div class="tq-o" onclick="ModulePhongKham.chonTab('baocao')"><div class="tq-so" style="color:${bcChu[1]}">${bcChu[0]}</div><div class="tq-nhan">Báo cáo ngày</div></div>
        </div>
        ${bc === 'chua_nop' ? '<button class="btn-primary" onclick="ModulePhongKham.chonTab(\'baocao\')">📷 Nộp báo cáo & minh chứng</button>' : ''}
      </div>
      ${h.choDuyet ? `<div class="the-tin" onclick="ModulePhongKham.chonTab('duyet')"><div class="the-tin-dau"><b>🖊️ ${so(h.choDuyet)} mục chờ anh/chị duyệt</b><span>›</span></div></div>` : ''}
      <div class="hn-tieu"><span>CẦN XỬ LÝ · ${so(can.length)}</span></div>
      ${can.length ? `<div class="hn-list">${can.map(v => `
        <div class="hn-dong" onclick="ModulePhongKham.chonTab('${e(v.tab || 'congviec')}')">
          <div class="dong-content"><div class="dong-title">${e(v.ten)}</div><div class="dong-sub">${e(v.nguon || '')}${v.han ? ' · Hạn ' + e(v.han) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${this.MUC[v.muc] || 'xam'}">${v.muc === 'do' ? 'Quá hạn' : v.muc === 'vang' ? 'Hôm nay' : 'Sắp tới'}</span></div>
        </div>`).join('')}</div>` : '<div class="hn-xong"><div class="hn-xong-icon">🎉</div><div class="hn-xong-chu">Không còn việc gấp</div><div class="hn-xong-phu">Mọi việc đều trong hạn.</div></div>'}
    `;
  },

  /* ---------------- ✅ Công việc ---------------- */
  veCongViec: function(du) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const ds = du.viec || [];
    const LOAI = { giao: 'Được giao', canhan: 'Cá nhân', nhogiup: 'Nhờ giúp' };
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(du.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:${du.quaHan ? 'var(--c-red)' : 'var(--c-green)'}">${so(du.quaHan || 0)}</b>Quá hạn</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(du.xongTuan || 0)}</b>Xong tuần này</div>
      </div>
      ${ds.map(v => {
        const td = Math.max(0, Math.min(100, Number(v.tienDo) || 0));
        return `<div class="the">
          <div class="the-tin-dau"><b>${e(v.ten)}</b><span class="badge ${this.MUC[v.muc] || 'xam'}">${e(LOAI[v.loai] || v.loai || '')}</span></div>
          <div class="chu-phu">${v.han ? 'Hạn ' + e(v.han) : 'Không hạn'}${v.nguoiGiao ? ' · ' + e(v.nguoiGiao) : ''} · ${td}%</div>
          <div class="thanh-tien"><div style="width:${td}%"></div></div>
          ${td < 100 ? `<div class="hang-nut">
            <button class="btn-secondary" onclick="ModulePhongKham.tienDo('${e(v.id)}', ${Math.min(100, td + 25)})">+25%</button>
            <button class="btn-primary" onclick="ModulePhongKham.tienDo('${e(v.id)}', 100)">✓ Xong</button>
          </div>` : ''}
        </div>`;
      }).join('') || '<div class="trong">Chưa có việc nào.</div>'}
      <div class="the form-the">
        <b>➕ Việc cá nhân</b>
        <label class="nhan-o" for="pkViecTen">Tên việc</label>
        <input id="pkViecTen" class="form-input" maxlength="200" placeholder="VD: Gọi lại khách hẹn tái khám">
        <label class="nhan-o" for="pkViecHan">Hạn</label>
        <input id="pkViecHan" class="form-input" type="date">
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.themViec(this)">Thêm việc</button></div>
      </div>`;
  },

  tienDo: function(id, moi) {
    const du = this.du('congviec');
    const v = (du.viec || []).find(x => String(x.id) === String(id));
    if (!v) return;
    const cu = v.tienDo;
    const live = (this._d || {}).live;
    ShinApp.hanhDongHoanTac(moi >= 100 ? 'Đã đánh dấu xong' : `Tiến độ ${moi}%`, {
      lamTruoc: () => { v.tienDo = moi; this.veLai(); },
      traLai: () => { v.tienDo = cu; this.veLai(); },
      thucHien: async () => { if (live) await this.ghi('webCapNhatViec', { id: v.id, tienDo: moi }); }
    });
  },

  themViec: async function(nut) {
    const ten = (document.getElementById('pkViecTen') || {}).value || '';
    const han = (document.getElementById('pkViecHan') || {}).value || '';
    if (!ten.trim()) { ShinApp.toast('Nhập tên việc trước đã.', 'warn'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang thêm…', async () => {
      if ((this._d || {}).live) return this.ghi('webThemViecCaNhan', { ten: ten.trim(), han: han ? han.split('-').reverse().join('/') : '' });
      return { ok: true, id: 'mau' + Date.now() };
    }, 'pkThemViec');
    if (!kq) return;
    const du = this.du('congviec');
    du.viec = [{ id: kq.id || '', ten: ten.trim(), loai: 'canhan', han: han ? han.split('-').reverse().join('/') : '', tienDo: 0, muc: 'xanh' }].concat(du.viec || []);
    du.dangLam = (du.dangLam || 0) + 1;
    this.veLai();
  },

  /* ---------------- 📝 Báo cáo ngày ---------------- */
  veBaoCao: function(du) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const mau = du.mau || [];
    const ls = du.lichSu || [];
    const TT = { da_duyet: ['Đã duyệt', 'xanh'], cho: ['Chờ duyệt', 'vang'], tra_lai: ['Trả lại', 'do'] };
    const nopHomNay = ((this._d || {}).homNay || {}).baoCaoHomNay === 'da_nop';
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(du.soDaNop || 0)}</b>Đã nộp tháng này</div>
        <div class="o-so-loc"><b style="color:${du.soChuaNop ? 'var(--c-red)' : 'var(--c-green)'}">${so(du.soChuaNop || 0)}</b>Ngày chưa nộp</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${so(du.soChoDuyet || 0)}</b>Chờ duyệt</div>
      </div>
      ${nopHomNay ? '<div class="hn-xong"><div class="hn-xong-icon">✅</div><div class="hn-xong-chu">Đã nộp báo cáo hôm nay</div></div>' : `
      <div class="the form-the">
        <b>📝 Báo cáo hôm nay</b>
        ${mau.map(m => `<label class="nhan-o" for="pkBC_${e(m.ma)}">${e(m.nhan)}${m.batBuoc ? ' *' : ''}</label>
          ${m.kieu === 'so' ? `<input id="pkBC_${e(m.ma)}" class="form-input" type="number" inputmode="numeric" min="0">` : `<textarea id="pkBC_${e(m.ma)}" class="form-input" maxlength="2000"></textarea>`}`).join('')}
        <label class="nhan-o" for="pkAnh">Ảnh minh chứng (tối đa 6)</label>
        <input id="pkAnh" class="form-input" type="file" accept="image/*" multiple onchange="ModulePhongKham.chonAnh(this)">
        <div class="hang-chip">${this._anh.map((a, i) => `<button class="chip-chon" onclick="ModulePhongKham.boAnh(${i})" title="Bỏ ảnh">🖼️ ${e(a.ten)} ✕</button>`).join('')}</div>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.nopBaoCao(this)">Nộp báo cáo</button></div>
      </div>`}
      <div class="hn-tieu"><span>LỊCH SỬ · ${so(ls.length)}</span></div>
      ${ls.map(b => {
        const tt = TT[b.trangThai] || [b.trangThai || '', 'xam'];
        return `<div class="the"><div class="the-tin-dau"><b>${e(b.ngay)}</b><span class="badge ${tt[1]}">${e(tt[0])}</span></div>
          <p>${e(b.tomTat || '')}${b.soAnh ? ' · 🖼️ ' + so(b.soAnh) : ''}</p>${b.lyDoTraLai ? `<p class="chu-phu">Lý do trả lại: ${e(b.lyDoTraLai)}</p>` : ''}</div>`;
      }).join('') || '<div class="trong">Chưa có báo cáo trong tháng.</div>'}`;
  },

  /** Ảnh ➜ JPEG ≤ 1600px, base64 không tiền tố (hợp đồng webNopBaoCao). */
  chonAnh: async function(o) {
    const tep = Array.from(o.files || []);
    for (const f of tep) {
      if (this._anh.length >= 6) { ShinApp.toast('Tối đa 6 ảnh.', 'warn'); break; }
      try { this._anh.push(await this.nenAnh(f)); } catch (err) { ShinApp.toast(`Không đọc được ảnh ${f.name}.`, 'error'); }
    }
    const giu = this.giuNhap(); this.veLai(); this.traNhap(giu);
  },
  boAnh: function(i) { const giu = this.giuNhap(); this._anh.splice(i, 1); this.veLai(); this.traNhap(giu); },
  giuNhap: function() { const g = {}; document.querySelectorAll('[id^="pkBC_"]').forEach(x => { g[x.id] = x.value; }); return g; },
  traNhap: function(g) { Object.keys(g).forEach(id => { const x = document.getElementById(id); if (x) x.value = g[id]; }); },

  nenAnh: function(f) {
    return new Promise((ok, loi) => {
      const doc = new FileReader();
      doc.onerror = loi;
      doc.onload = () => {
        const img = new Image();
        img.onerror = loi;
        img.onload = () => {
          const tl = Math.min(1, 1600 / Math.max(img.width, img.height));
          const c = document.createElement('canvas');
          c.width = Math.round(img.width * tl); c.height = Math.round(img.height * tl);
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          const url = c.toDataURL('image/jpeg', 0.82);
          ok({ ten: (f.name || 'anh').replace(/\.[^.]+$/, '') + '.jpg', kieu: 'image/jpeg', base64: url.split(',')[1] });
        };
        img.src = doc.result;
      };
      doc.readAsDataURL(f);
    });
  },

  nopBaoCao: async function(nut) {
    const du = this.du('baocao');
    const noiDung = {};
    for (const m of du.mau || []) {
      const v = ((document.getElementById('pkBC_' + m.ma) || {}).value || '').trim();
      if (m.batBuoc && !v) { ShinApp.toast(`Còn thiếu: ${m.nhan}`, 'warn'); return; }
      noiDung[m.ma] = m.kieu === 'so' && v !== '' ? Number(v) : v;
    }
    const ngay = ShinApp.ngayVN();
    const kq = await ShinApp.goiNut(nut, 'Đang nộp…', async () => {
      if ((this._d || {}).live) return this.ghi('webNopBaoCao', { ngay: ngay, noiDung: noiDung, anh: this._anh.map(a => ({ ten: a.ten, kieu: a.kieu, base64: a.base64 })) });
      return { ok: true, ngay: ngay };
    }, 'pkNopBC');
    if (!kq) return;
    const soAnh = this._anh.length;
    this._anh = [];
    const hn = (this._d || {}).homNay; if (hn) hn.baoCaoHomNay = 'da_nop';
    du.lichSu = [{ ngay: kq.ngay || ngay, trangThai: 'cho', tomTat: Object.values(noiDung).filter(x => x !== '').join(' · ').slice(0, 120), soAnh: soAnh }].concat(du.lichSu || []);
    du.soDaNop = (du.soDaNop || 0) + 1; du.soChoDuyet = (du.soChoDuyet || 0) + 1;
    this.veLai();
  },

  /* ---------------- 🖊️ Duyệt ---------------- */
  veDuyet: function(du) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const NGHI = { nghi_tuan: 'Nghỉ tuần', nghi_om: 'Nghỉ ốm', doi_ca: 'Đổi ca' };
    const muc = [].concat(
      (du.baoCao || []).map(b => ({ loai: 'baocao', id: b.id, tieuDe: `📝 ${b.nguoi} · ${b.ngay}`, chu: b.tomTat, anh: b.anh || [] })),
      (du.nghi || []).map(n => ({ loai: 'nghi', id: n.id, tieuDe: `📅 ${n.nguoi} · ${NGHI[n.loai] || n.loai}`, chu: `${n.tuNgay}${n.denNgay && n.denNgay !== n.tuNgay ? ' → ' + n.denNgay : ''}${n.lyDo ? ' · ' + n.lyDo : ''}` })),
      (du.lichTuan || []).map(l => ({ loai: 'lichtuan', id: l.id, tieuDe: `🗓️ Lịch tuần tổ ${l.to}`, chu: l.tuan }))
    );
    if (!muc.length) return '<div class="hn-xong"><div class="hn-xong-icon">🎉</div><div class="hn-xong-chu">Không còn mục chờ duyệt</div></div>';
    return `
      <div class="hn-tieu"><span>CHỜ DUYỆT · ${so(muc.length)}</span>
        ${muc.length > 1 ? `<button class="btn-secondary" onclick="ModulePhongKham.duyetTatCa()">✓ Đạt tất cả</button>` : ''}</div>
      ${muc.map(m => `<div class="the">
        <b>${e(m.tieuDe)}</b><p>${e(m.chu || '')}</p>
        ${(m.anh || []).length ? `<div class="hang-chip">${m.anh.map((u, i) => /^https:\/\//.test(u) ? `<a class="chip-chon" href="${e(u)}" target="_blank" rel="noopener">🖼️ Ảnh ${i + 1}</a>` : '').join('')}</div>` : ''}
        ${this._traLai === m.loai + '|' + m.id ? `
          <label class="nhan-o" for="pkLyDo">Lý do trả lại *</label>
          <textarea id="pkLyDo" class="form-input" maxlength="500"></textarea>
          <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTraLai('')">Thôi</button>
            <button class="btn-primary nut-do" onclick="ModulePhongKham.guiTraLai(this, '${m.loai}', '${e(m.id)}')">Gửi trả lại</button></div>` : `
          <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTraLai('${m.loai}|${e(m.id)}')">↩️ Trả lại</button>
            <button class="btn-primary" onclick="ModulePhongKham.duyet('${m.loai}', '${e(m.id)}')">✓ Đạt</button></div>`}
      </div>`).join('')}`;
  },

  KHOA_DS: { baocao: 'baoCao', nghi: 'nghi', lichtuan: 'lichTuan' },

  boMuc: function(du, loai, id) {
    const k = this.KHOA_DS[loai];
    const ds = du[k] || [];
    const i = ds.findIndex(x => String(x.id) === String(id));
    if (i < 0) return null;
    const muc = ds.splice(i, 1)[0];
    return () => { ds.splice(i, 0, muc); };
  },

  doiDemDuyet: function(n) {
    const d = this._d || {};
    if (d.dem) d.dem.choDuyet = Math.max(0, (d.dem.choDuyet || 0) + n);
    if (d.homNay) d.homNay.choDuyet = Math.max(0, (d.homNay.choDuyet || 0) + n);
  },

  duyet: function(loai, id) {
    const du = this.du('duyet');
    let tra = null;
    const live = (this._d || {}).live;
    ShinApp.hanhDongHoanTac('Đã duyệt Đạt', {
      lamTruoc: () => { tra = this.boMuc(du, loai, id); this.doiDemDuyet(-1); this.veLai(); },
      traLai: () => { if (tra) tra(); this.doiDemDuyet(1); this.veLai(); },
      thucHien: async () => { if (live) await this.ghi('webDuyet', { loai: loai, ids: [id], ketQua: 'dat', lyDo: '' }); }
    });
  },

  duyetTatCa: function() {
    const du = this.du('duyet');
    const live = (this._d || {}).live;
    const muc = [];
    Object.keys(this.KHOA_DS).forEach(l => (du[this.KHOA_DS[l]] || []).forEach(x => muc.push({ loai: l, id: x.id })));
    ShinApp.xacNhan2Lan('pkDuyetTatCa', `Duyệt Đạt cả ${muc.length} mục`, () => {
      const cu = {};
      ShinApp.hanhDongHoanTac(`Đã duyệt Đạt ${muc.length} mục`, {
        lamTruoc: () => { Object.values(this.KHOA_DS).forEach(k => { cu[k] = du[k]; du[k] = []; }); this.doiDemDuyet(-muc.length); this.veLai(); },
        traLai: () => { Object.assign(du, cu); this.doiDemDuyet(muc.length); this.veLai(); },
        thucHien: async () => { if (live) await this.ghi('webDuyet', { loai: 'tatca', muc: muc, ketQua: 'dat' }); }
      });
    });
  },

  moTraLai: function(khoa) { this._traLai = khoa || null; this.veLai(); const o = document.getElementById('pkLyDo'); if (o) o.focus(); },

  guiTraLai: async function(nut, loai, id) {
    const lyDo = ((document.getElementById('pkLyDo') || {}).value || '').trim();
    if (!lyDo) { ShinApp.toast('Nhập lý do trả lại trước đã.', 'warn'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', async () => {
      if ((this._d || {}).live) return this.ghi('webDuyet', { loai: loai, ids: [id], ketQua: 'tra_lai', lyDo: lyDo });
      return { ok: true };
    }, 'pkTraLai');
    if (!kq) return;
    this.boMuc(this.du('duyet'), loai, id);
    this.doiDemDuyet(-1);
    this._traLai = null;
    this.veLai();
  },

  /* ---------------- 🔔 Thông báo ---------------- */
  veThongBao: function(du) {
    const e = ShinApp.esc;
    const ds = du.ds || [];
    const chua = ds.filter(t => !t.daDoc).length;
    return `
      <div class="hn-tieu"><span>${ShinApp.soVN(chua)} CHƯA ĐỌC</span>${chua ? '<button class="btn-secondary" onclick="ModulePhongKham.docHet()">Đọc tất cả</button>' : ''}</div>
      <div class="nhat-ky">${ds.map(t => `
        <div class="the-tin ${t.daDoc ? 'da-xem' : ''}" onclick="ModulePhongKham.docTB('${e(t.id)}')">
          <div class="the-tin-dau"><b>${e(t.tieuDe)}</b><span class="chu-phu">${e(t.luc || '')}</span></div>
          <div>${e(t.noiDung || '')}</div>
        </div>`).join('')}</div>
      ${ds.length ? '' : '<div class="trong">Chưa có thông báo.</div>'}`;
  },

  docTB: function(id) {
    const ds = (this.du('thongbao') || {}).ds || [];
    const t = ds.find(x => String(x.id) === String(id));
    if (!t || t.daDoc) { if (t && t.tab && t.tab !== 'thongbao' && this.tabDuocMo(this._d).some(x => x[0] === t.tab)) this.chonTab(t.tab); return; }
    t.daDoc = true;
    const d = this._d || {}; if (d.dem) d.dem.thongBao = Math.max(0, (d.dem.thongBao || 0) - 1);
    this.veLai();
    if (d.live) this.ghi('webDaDocThongBao', { id: t.id }).catch(err => { t.daDoc = false; if (d.dem) d.dem.thongBao++; this.veLai(); ShinApp.toast(err.message, 'error'); });
  },

  docHet: function() {
    const ds = (this.du('thongbao') || {}).ds || [];
    const chua = ds.filter(t => !t.daDoc);
    const d = this._d || {};
    const demCu = (d.dem || {}).thongBao;
    ShinApp.hanhDongHoanTac(`Đã đọc ${chua.length} thông báo`, {
      lamTruoc: () => { chua.forEach(t => { t.daDoc = true; }); if (d.dem) d.dem.thongBao = 0; this.veLai(); },
      traLai: () => { chua.forEach(t => { t.daDoc = false; }); if (d.dem) d.dem.thongBao = demCu; this.veLai(); },
      thucHien: async () => { if (d.live) await this.ghi('webDaDocThongBao', { id: 'tatca' }); }
    });
  },

  /* ---------------- 📅 Lịch tuần (chỉ đọc) ---------------- */
  veLich: function(du) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const TT = { cho: ['Chờ duyệt', 'vang'], da_duyet: ['Đã duyệt', 'xanh'], tra_lai: ['Trả lại', 'do'] };
    const NGHI = { nghi_tuan: 'Nghỉ tuần', nghi_om: 'Nghỉ ốm', doi_ca: 'Đổi ca' };
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(du.phepCon || 0)}</b>Phép còn</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(du.nghiBuCon || 0)}</b>Nghỉ bù còn</div>
      </div>
      <div class="hn-tieu"><span>${e(du.tuan || 'TUẦN NÀY')}</span></div>
      <div class="hn-list">${(du.ngay || []).map(n => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(n.thu || '')} ${e(n.ngay || '')}</div>
          <div class="dong-sub">${n.nghi || n.le ? (n.le ? '🎌 ' + e(n.le) : '🌴 Nghỉ') : `${e(n.viTri || '—')}${n.ca ? ' · Ca ' + e(n.ca) : ''}`}</div></div></div>`).join('')}</div>
      <div class="hn-tieu"><span>ĐƠN NGHỈ / ĐỔI CA · ${so((du.donNghi || []).length)}</span></div>
      ${(du.donNghi || []).map(d => {
        const tt = TT[d.trangThai] || [d.trangThai || '', 'xam'];
        return `<div class="the"><div class="the-tin-dau"><b>${e(NGHI[d.loai] || d.loai || '')} · ${e(d.tuNgay)}${d.denNgay && d.denNgay !== d.tuNgay ? ' → ' + e(d.denNgay) : ''}</b><span class="badge ${tt[1]}">${e(tt[0])}</span></div>
          ${d.lyDo ? `<p>${e(d.lyDo)}</p>` : ''}${d.lyDoTraLai ? `<p class="chu-phu">Lý do trả lại: ${e(d.lyDoTraLai)}</p>` : ''}</div>`;
      }).join('') || '<div class="trong">Chưa có đơn.</div>'}
      <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Xin nghỉ / đổi ca')">📝 Xin nghỉ / đổi ca (app PK)</button></div>`;
  },

  /* ---------------- 👥 Nhân sự (lãnh đạo / admin) ---------------- */
  veNhanSu: function(du) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const yc = du.yeuCauSua || [];
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(du.dangLam || 0)}</b>Đang làm</div>
        <div class="o-so-loc"><b style="color:var(--c-green)">${so(du.moiVao || 0)}</b>Mới vào</div>
        <div class="o-so-loc"><b style="color:${du.choSua ? 'var(--c-yellow)' : 'var(--c-gray)'}">${so(du.choSua || 0)}</b>Chờ sửa hồ sơ</div>
      </div>
      ${yc.length ? `<div class="hn-tieu"><span>ĐỀ NGHỊ SỬA HỒ SƠ · ${so(yc.length)}</span></div>
        ${yc.map(y => `<div class="the"><b>${e(y.hoTen)} · ${e(y.truong)}</b>
          <p>${e(y.giaTriCu || '—')} → <b>${e(y.giaTriMoi)}</b>${y.lyDo ? ' · ' + e(y.lyDo) : ''}</p>
          ${this._traLai === 'hs|' + y.id ? `
            <label class="nhan-o" for="pkLyDo">Lý do từ chối *</label>
            <textarea id="pkLyDo" class="form-input" maxlength="500"></textarea>
            <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTraLai('')">Thôi</button>
              <button class="btn-primary nut-do" onclick="ModulePhongKham.tuChoiHoSo(this, '${e(y.id)}')">Gửi từ chối</button></div>` : `
            <div class="hang-nut"><button class="btn-secondary" onclick="ModulePhongKham.moTraLai('hs|${e(y.id)}')">Từ chối</button>
              <button class="btn-primary" onclick="ModulePhongKham.dongYHoSo('${e(y.id)}')">✓ Đồng ý</button></div>`}
        </div>`).join('')}` : ''}
      <div class="hn-tieu"><span>DANH SÁCH · ${so((du.ds || []).length)}</span></div>
      <div class="hn-list">${(du.ds || []).map(n => `
        <div class="hn-dong"><div class="dong-content"><div class="dong-title">${e(n.hoTen)}</div><div class="dong-sub">${e(n.viTri || '')}${n.to ? ' · Tổ ' + e(n.to) : ''}</div></div>
          <div class="dong-meta"><span class="badge ${/làm/i.test(n.trangThai || '') ? 'xanh' : 'xam'}">${e(n.trangThai || '')}</span></div></div>`).join('')}</div>`;
  },

  boYeuCau: function(id) {
    const du = this.du('nhansu');
    const ds = du.yeuCauSua || [];
    const i = ds.findIndex(x => String(x.id) === String(id));
    if (i < 0) return () => {};
    const y = ds.splice(i, 1)[0];
    du.choSua = Math.max(0, (du.choSua || 0) - 1);
    return () => { ds.splice(i, 0, y); du.choSua = (du.choSua || 0) + 1; };
  },

  dongYHoSo: function(id) {
    let tra = null;
    const live = (this._d || {}).live;
    ShinApp.hanhDongHoanTac('Đã đồng ý sửa hồ sơ', {
      lamTruoc: () => { tra = this.boYeuCau(id); this.veLai(); },
      traLai: () => { if (tra) tra(); this.veLai(); },
      thucHien: async () => { if (live) await this.ghi('webDuyetSuaHoSo', { id: id, dongY: true, lyDo: '' }); }
    });
  },

  tuChoiHoSo: async function(nut, id) {
    const lyDo = ((document.getElementById('pkLyDo') || {}).value || '').trim();
    if (!lyDo) { ShinApp.toast('Nhập lý do từ chối trước đã.', 'warn'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', async () => {
      if ((this._d || {}).live) return this.ghi('webDuyetSuaHoSo', { id: id, dongY: false, lyDo: lyDo });
      return { ok: true };
    }, 'pkTuChoiHS');
    if (!kq) return;
    this.boYeuCau(id);
    this._traLai = null;
    this.veLai();
  },

  /* ---------------- 👤 Hồ sơ & 💬 Góp ý ---------------- */
  veToi: function(du) {
    const e = ShinApp.esc;
    const hs = du.hoSo || {};
    const gy = du.gopY || [];
    const TT = { moi: ['Mới', 'vang'], dang_xu_ly: ['Đang xử lý', 'vang'], xong: ['Đã xong', 'xanh'] };
    const dong = (n, v) => `<div class="hang-tru"><span>${n}</span><span class="chu-phu">${e(v || '—')}</span></div>`;
    return `
      <div class="the"><b>👤 ${e(hs.hoTen || '')}</b>
        ${dong('Vị trí', hs.viTri)}${dong('Tổ', hs.to)}${dong('Ngày vào', hs.ngayVao)}${dong('Email', hs.email)}${dong('Điện thoại', hs.dienThoai)}
        <div class="hang-nut"><button class="btn-secondary" onclick="ShinApp.moV1('PK', 'Đề nghị sửa hồ sơ')">✏️ Đề nghị sửa (app PK)</button></div>
      </div>
      <div class="the form-the">
        <b>💬 Góp ý / báo lỗi</b>
        <div class="hang-chip" role="radiogroup">
          <button class="chip-chon ${this._loaiGY !== 'bao_loi' ? 'dang-chon' : ''}" onclick="ModulePhongKham.chonLoaiGY('gop_y')">💡 Góp ý</button>
          <button class="chip-chon ${this._loaiGY === 'bao_loi' ? 'dang-chon' : ''}" onclick="ModulePhongKham.chonLoaiGY('bao_loi')">🐞 Báo lỗi</button>
        </div>
        <label class="nhan-o" for="pkGopY">Nội dung</label>
        <textarea id="pkGopY" class="form-input" maxlength="2000"></textarea>
        <div class="hang-nut"><button class="btn-primary" onclick="ModulePhongKham.guiGopY(this)">Gửi</button></div>
      </div>
      <div class="hn-tieu"><span>GÓP Ý CỦA TÔI · ${ShinApp.soVN(gy.length)}</span></div>
      ${gy.map(g => {
        const tt = TT[g.trangThai] || [g.trangThai || '', 'xam'];
        return `<div class="the"><div class="the-tin-dau"><b>${g.loai === 'bao_loi' ? '🐞' : '💡'} ${e(g.luc || '')}</b><span class="badge ${tt[1]}">${e(tt[0])}</span></div>
          <p>${e(g.noiDung || '')}</p>${g.traLoi ? `<p class="chu-phu">↪ ${e(g.traLoi)}</p>` : ''}</div>`;
      }).join('') || '<div class="trong">Chưa gửi góp ý nào.</div>'}`;
  },

  _loaiGY: 'gop_y',
  chonLoaiGY: function(l) {
    const o = document.getElementById('pkGopY'); const giu = o ? o.value : '';
    this._loaiGY = l; this.veLai();
    const m = document.getElementById('pkGopY'); if (m) m.value = giu;
  },

  guiGopY: async function(nut) {
    const nd = ((document.getElementById('pkGopY') || {}).value || '').trim();
    if (!nd) { ShinApp.toast('Nhập nội dung trước đã.', 'warn'); return; }
    const loai = this._loaiGY === 'bao_loi' ? 'bao_loi' : 'gop_y';
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', async () => {
      if ((this._d || {}).live) return this.ghi('webGuiGopY', { loai: loai, noiDung: nd, anh: [] });
      return { ok: true, id: 'mau' + Date.now() };
    }, 'pkGopY');
    if (!kq) return;
    const du = this.du('toi');
    du.gopY = [{ id: kq.id || '', loai: loai, noiDung: nd, luc: 'Vừa gửi', trangThai: 'moi' }].concat(du.gopY || []);
    this.veLai();
  },

  /** Gọi cổng ghi PK – lỗi ➜ ném lỗi tiếng Việt (goiNut / hanhDongHoanTac hiện toast đỏ). */
  ghi: async function(hanh, du) {
    const kq = await SHIN_API.goi('PK', hanh, du);
    if (!kq.ok) throw new Error(SHIN_API.moTaLoi(kq));
    if (kq.data && kq.data.ok === false) throw new Error(kq.data.loi || 'Máy chủ PK không nhận yêu cầu.');
    return kq.data || {};
  },

  /** Bản sao sâu dữ liệu mẫu (Demo được sửa thoải mái trong phiên mà không đụng bản gốc). */
  mau: function() {
    const m = JSON.parse(JSON.stringify((window.SHIN_DEMO_DATA || {}).phongkham || {}));
    m.live = false;
    return m;
  }
};
