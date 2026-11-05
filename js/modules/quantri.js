/**
 * SHIN v2 – Tầng 0A: Quản trị NGƯỜI DÙNG & ỨNG DỤNG của hệ Shin (máy chủ 10_Hub, chỉ Admin)
 * Live (cổng ĐÃ CÓ trong congWeb_ của Hub – 30_CaiDat.gs):
 *   webCaiDat() ➜ {danhBa:[{ma, hoTen, vaiTro, trangThai}], ungDung:[{ten, bat, loiCuoi}], phuTrach:[{ma, ten, dsMa, nguoi}], bot:{coKhoa, chu}}
 *   webLuuPhuTrach({maMang, dsMa, hoanTac}) ➜ {cu:[mã…]}   – mỗi mảng 1–2 người đang dùng trong danh bạ
 *   webCapLink({maNguoi}) ➜ {hoTen, link, linkDuPhong}      – link chứa token Hub KHÔNG thời hạn: không hiện chữ, chỉ chép / gửi
 *   v2.8.0 (HUB L25 «KIỂM ĐẠT v1.13.8»): webLuuNguoiDung({nguoi:{ma, hoTen, vaiTro, trangThai}}) ➜ webCaiDat (thêm / sửa / ngưng; Hub chặn ngưng Admin cuối)
 *   webLuuUngDung({ma, bat}) ➜ webCaiDat (bật / tắt app: hiện ngay, gửi sau 6 giây Hoàn tác).
 */

const ModuleQuanTri = {
  ma: 'quantri',
  ten: 'Người Dùng & App',
  bieuTuong: '🛡️',
  paletteMacDinh: 'cyber',
  mayChu: 'HUB',

  _d: null,
  _tab: 'nguoi',
  _tim: '',
  _link: null,   // link vừa cấp – chỉ giữ trong bộ nhớ 2 phút, không vẽ ra màn
  _hetLink: 0,

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webCaiDat', {});
    // Không phải Admin ➜ KHÔNG trả 'quyen' lên trên (sẽ ẩn mọi mảng Hub) – chỉ báo trong màn này
    if (!kq.ok && kq.loi === 'quyen') return { ok: true, data: { live: true, khongQuyen: true, chiTiet: kq.chiTiet || '' } };
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. webCaiDat ➜ khuôn màn. */
  tuV1: function(c) {
    c = c || {};
    return {
      live: true,
      danhBa: (c.danhBa || []).map(n => ({ ma: String(n.ma || ''), hoTen: n.hoTen || n.ma || '', vaiTro: n.vaiTro || 'Người dùng', trangThai: n.trangThai || 'Đang dùng' })),
      ungDung: (c.ungDung || []).map(u => ({ ma: u.ma || '', ten: u.ten || u.ma || '', bat: !!u.bat, loiCuoi: u.loiCuoi || '' })),
      phuTrach: (c.phuTrach || []).map(m => ({ ma: String(m.ma || ''), ten: m.ten || m.ma || '', dsMa: (m.dsMa || []).map(String), nguoi: m.nguoi || [] })),
      bot: c.bot || null
    };
  },

  dangDung: n => n.trangThai === 'Đang dùng',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.quantri;
    this._d = d;
    const e = ShinApp.esc;

    if (d.khongQuyen) {
      container.innerHTML = `
        <div class="page-header"><div><div class="page-title">🛡️ Người Dùng & App</div><div class="page-sub">Chỉ Admin của Hub</div></div></div>
        <div class="trong">🔒 Màn này chỉ dành cho Admin của Hub.${d.chiTiet ? '<br><span class="chu-phu">' + e(d.chiTiet) + '</span>' : ''}</div>`;
      return;
    }

    const ds = d.danhBa || [];
    const app = d.ungDung || [];
    const pt = d.phuTrach || [];
    const tab = this._tab;
    const soDung = ds.filter(this.dangDung).length;
    const soLoi = app.filter(u => u.bat && u.loiCuoi).length;
    const mangThieu = pt.filter(m => !m.dsMa.length).length;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🛡️ Người Dùng & App</div>
          <div class="page-sub">Danh bạ hệ Shin · Ứng dụng · Người phụ trách mảng</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('quantri')" title="Làm mới">↻</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Quản trị hệ Shin 🛡️</div>
            <div class="hero-date">${d.live ? '🔐 Dữ liệu thật từ Hub · chỉ Admin' : '🟡 Chế độ trình diễn'}</div>
          </div>
        </div>
        <div class="tq-3so">
          <div class="tq-o" onclick="ModuleQuanTri.chonTab('nguoi')"><div class="tq-so" style="color:var(--c-blue)">${ShinApp.soVN(soDung)}</div><div class="tq-nhan">Người đang dùng</div></div>
          <div class="tq-o" onclick="ModuleQuanTri.chonTab('app')"><div class="tq-so" style="color:${soLoi ? 'var(--c-red)' : 'var(--c-green)'}">${ShinApp.soVN(app.filter(u => u.bat).length)}/${ShinApp.soVN(app.length)}</div><div class="tq-nhan">App đang bật${soLoi ? ' · ' + soLoi + ' lỗi' : ''}</div></div>
          <div class="tq-o" onclick="ModuleQuanTri.chonTab('mang')"><div class="tq-so" style="color:${mangThieu ? 'var(--c-yellow)' : 'var(--c-green)'}">${ShinApp.soVN(pt.length)}</div><div class="tq-nhan">Mảng${mangThieu ? ' · ' + mangThieu + ' chưa có người' : ' có người phụ trách'}</div></div>
        </div>
      </div>

      <div class="hang-tab" role="tablist">
        ${[['nguoi', '👤 Người dùng'], ['app', '📱 Ứng dụng'], ['mang', '🧭 Phụ trách']].map(([k, t]) =>
          `<button class="tab-nut ${tab === k ? 'dang-chon' : ''}" role="tab" aria-selected="${tab === k}" onclick="ModuleQuanTri.chonTab('${k}')">${t}</button>`).join('')}
      </div>

      <div id="qtNoiDung">${tab === 'app' ? this.veApp(d) : tab === 'mang' ? this.veMang(d) : this.veNguoi(d)}</div>
    `;
  },

  chonTab: function(k) {
    this._tab = k;
    ShinApp.rung('nhe');
    this.render(document.getElementById('appContent'), this._d);
  },

  /* ---------------- 👤 Người dùng ---------------- */

  veNguoi: function(d) {
    const e = ShinApp.esc;
    const ds = d.danhBa || [];
    const vaiTro = {};
    ds.forEach(n => { vaiTro[n.vaiTro] = (vaiTro[n.vaiTro] || 0) + 1; });
    return `
      <div class="hang-chip">${Object.keys(vaiTro).map(v => `<span class="chip-chon">${e(v)} · ${vaiTro[v]}</span>`).join('')}</div>
      <input class="form-input" placeholder="🔍 Tìm theo tên, mã, vai trò…" value="${e(this._tim)}" oninput="ModuleQuanTri.tim(this.value)">
      <div class="hn-list" id="qtDs">
        ${ds.map((n, i) => `
          <div class="hn-dong ${this.dangDung(n) ? '' : 'mo-di'}" data-tim="${e((n.hoTen + ' ' + n.ma + ' ' + n.vaiTro).toLowerCase())}" onclick="ModuleQuanTri.moNguoi(${i})">
            <div class="dong-content">
              <div class="dong-title">${e(n.hoTen)}</div>
              <div class="dong-sub">Mã ${e(n.ma)} · ${e(n.vaiTro)}</div>
            </div>
            <div class="dong-meta"><span class="badge ${this.dangDung(n) ? 'xanh' : 'xam'}">${e(n.trangThai)}</span><span class="dong-arrow">›</span></div>
          </div>
          <div class="chi-tiet-dong" id="qtNg${i}" hidden></div>`).join('')}
      </div>
      ${ds.length ? '' : '<div class="trong">Danh bạ Hub chưa có ai.</div>'}
      <div class="hang-nut"><button class="btn-primary" onclick="ModuleQuanTri.moForm(-1)">➕ Thêm người dùng</button></div>
      <div id="qtForm"></div>`;
  },

  tim: function(chu) {
    this._tim = String(chu || '');
    const t = this._tim.trim().toLowerCase();
    document.querySelectorAll('#qtDs > .hn-dong').forEach(r => {
      r.hidden = !!t && r.dataset.tim.indexOf(t) < 0;
      const ct = r.nextElementSibling;
      if (ct && r.hidden) ct.hidden = true;
    });
  },

  moNguoi: function(i) {
    const n = (this._d.danhBa || [])[i];
    const khung = document.getElementById('qtNg' + i);
    if (!n || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;
    const e = ShinApp.esc;
    const mang = (this._d.phuTrach || []).filter(m => m.dsMa.indexOf(n.ma) >= 0).map(m => m.ten);
    khung.innerHTML = `
      <div class="hang-tru"><span>Phụ trách mảng</span><b>${e(mang.join(', ') || '–')}</b></div>
      ${this.dangDung(n) ? `
        <div class="hang-nut">
          <button class="btn-secondary" onclick="ModuleQuanTri.capLink(this, ${i})">🔗 Cấp link vào Hub</button>
        </div>
        <div id="qtLink${i}"></div>` : '<p class="chu-phu">Người này đã ngưng – không cấp link.</p>'}
      <div class="hang-nut"><button class="btn-secondary" onclick="ModuleQuanTri.moForm(${i})">✏️ Sửa vai trò / trạng thái</button></div>`;
  },

  VAI: ['Admin', 'Quản lý', 'Người dùng'],
  TRANG_THAI: ['Đang dùng', 'Ngưng'],

  /** Form thêm (i = -1) / sửa 1 người. Mã không đổi khi sửa. */
  moForm: function(i) {
    const khung = document.getElementById('qtForm') || document.getElementById('qtNg' + i);
    const n = i >= 0 ? (this._d.danhBa || [])[i] : { ma: '', hoTen: '', vaiTro: 'Người dùng', trangThai: 'Đang dùng' };
    if (!khung || !n) return;
    const e = ShinApp.esc;
    const chon = (id, ds, v) => `<select id="${id}" class="form-input">${ds.map(x => `<option ${x === v ? 'selected' : ''}>${e(x)}</option>`).join('')}</select>`;
    khung.hidden = false;
    khung.innerHTML = `
      <div class="the" id="qtFormThe">
        <div class="the-tin-dau"><b>${i >= 0 ? '✏️ Sửa ' + e(n.hoTen) : '➕ Người dùng mới'}</b></div>
        <label class="nhan-o">Mã người dùng *</label><input id="qfMa" class="form-input" maxlength="40" value="${e(n.ma)}" ${i >= 0 ? 'readonly' : 'placeholder="vd nv_lan (chữ, số, - _)"'}>
        <label class="nhan-o">Họ tên *</label><input id="qfTen" class="form-input" maxlength="80" value="${e(n.hoTen)}">
        <label class="nhan-o">Vai trò</label>${chon('qfVai', this.VAI, n.vaiTro)}
        <label class="nhan-o">Trạng thái</label>${chon('qfTT', this.TRANG_THAI, n.trangThai)}
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleQuanTri.luuNguoi(this, ${i})">💾 Lưu</button></div>
      </div>`;
    khung.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /** THUẦN. Kiểm phía trình duyệt (Hub kiểm lại) ➜ '' | câu lỗi. */
  kiemNguoi: function(n, ds, laMoi) {
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(n.ma)) return 'Mã chỉ gồm chữ, số, dấu - và _ (tối đa 40 ký tự).';
    if (!n.hoTen) return 'Vui lòng nhập họ tên.';
    if (laMoi && (ds || []).some(x => x.ma === n.ma)) return 'Mã ' + n.ma + ' đã có trong danh bạ.';
    const conAdmin = (ds || []).filter(x => x.ma !== n.ma && x.vaiTro === 'Admin' && x.trangThai === 'Đang dùng').length + (n.vaiTro === 'Admin' && n.trangThai === 'Đang dùng' ? 1 : 0);
    return conAdmin ? '' : 'Không thể hạ / ngưng Admin cuối cùng.';
  },

  luuNguoi: async function(nut, i) {
    const v = id => String((document.getElementById(id) || {}).value || '').replace(/\s+/g, ' ').trim();
    const nguoi = { ma: v('qfMa'), hoTen: v('qfTen'), vaiTro: v('qfVai'), trangThai: v('qfTT') };
    const loi = this.kiemNguoi(nguoi, this._d.danhBa, i < 0);
    if (loi) { ShinApp.toast(loi, 'warn'); return; }
    if (!SHIN_API.laCheDoLive() || !this._d.live) {
      const ds = this._d.danhBa || (this._d.danhBa = []);
      if (i >= 0 && ds[i]) Object.assign(ds[i], nguoi); else ds.push(nguoi);
      this.render(document.getElementById('appContent'), this._d);
      ShinApp.toast(`Đã lưu ${nguoi.hoTen} (mẫu – không gửi Hub).`, 'info');
      return;
    }
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => ShinApp.goiBat('HUB', 'webLuuNguoiDung', { nguoi }), 'qt-nguoi-' + nguoi.ma);
    if (kq) {
      this.render(document.getElementById('appContent'), this.tuV1(kq));
      ShinApp.toast(`Đã lưu ${nguoi.hoTen}.`, 'success');
      ShinApp.rung('xong');
    }
  },

  /** Cấp link: KHÔNG vẽ link ra màn (token không thời hạn) – chỉ chép / gửi; link tự quên sau 2 phút. */
  capLink: async function(nut, i) {
    const n = (this._d.danhBa || [])[i];
    const khung = document.getElementById('qtLink' + i);
    if (!n || !khung) return;
    let kq;
    if (!SHIN_API.laCheDoLive() || !this._d.live) kq = { hoTen: n.hoTen, link: 'https://example.invalid/hub?t=MAU' };
    else kq = await ShinApp.goiNut(nut, 'Đang cấp…', () => ShinApp.goiBat('HUB', 'webCapLink', { maNguoi: n.ma }), 'qt-link-' + n.ma);
    if (!kq || !kq.link) return;
    this._link = kq.link;
    this._hetLink = Date.now() + 120000;
    setTimeout(() => { if (Date.now() >= this._hetLink) { this._link = null; const k = document.getElementById('qtLink' + i); if (k) k.innerHTML = ''; } }, 120500);
    const e = ShinApp.esc;
    khung.innerHTML = `
      <div class="the">
        <div class="the-tin-dau"><b>🔗 Link của ${e(kq.hoTen || n.hoTen)}</b><span class="badge vang">Không hiện chữ</span></div>
        <p class="chu-phu">Link chứa mã đăng nhập riêng, không thời hạn: chỉ gửi đúng người qua tin nhắn riêng. Em không hiện link ra màn để tránh bị chụp / nhìn trộm. Link tự quên sau 2 phút.</p>
        <div class="hang-nut">
          <button class="btn-primary" onclick="ModuleQuanTri.chepLink(this)">📋 Chép link</button>
          ${navigator.share ? '<button class="btn-secondary" onclick="ModuleQuanTri.guiLink()">📤 Gửi…</button>' : ''}
        </div>
      </div>`;
    ShinApp.rung('xong');
  },

  chepLink: async function(nut) {
    if (!this._link) { ShinApp.toast('Link đã quá 2 phút – bấm Cấp link lại.', 'warn'); return; }
    try {
      await navigator.clipboard.writeText(this._link);
      if (nut) { nut.textContent = '✓ Đã chép'; setTimeout(() => { nut.textContent = '📋 Chép link'; }, 2000); }
    } catch (e) { ShinApp.toast('Máy không cho chép – dùng nút Gửi… hoặc cấp trên Hub v1.', 'warn'); }
  },

  guiLink: function() {
    if (!this._link) { ShinApp.toast('Link đã quá 2 phút – bấm Cấp link lại.', 'warn'); return; }
    navigator.share({ title: 'Link vào Hub Shin', url: this._link }).catch(() => {});
  },

  /* ---------------- 📱 Ứng dụng ---------------- */

  veApp: function(d) {
    const e = ShinApp.esc;
    const app = d.ungDung || [];
    const bot = d.bot;
    return `
      <div class="hn-list">
        ${app.map((u, i) => `
          <div class="hn-dong ${u.bat ? '' : 'mo-di'}">
            <div class="dong-content">
              <div class="dong-title">${e(u.ten)}</div>
              <div class="dong-sub">${u.loiCuoi ? '⚠️ ' + e(u.loiCuoi) : u.bat ? 'Hub kéo số đều' : 'Đang tắt – Hub không kéo số'}</div>
            </div>
            <div class="dong-meta"><span class="badge ${!u.bat ? 'xam' : u.loiCuoi ? 'do' : 'xanh'}">${!u.bat ? 'Tắt' : u.loiCuoi ? 'Lỗi' : 'Bật'}</span>
              ${u.ma ? `<button class="btn-secondary" style="min-height:44px" onclick="ModuleQuanTri.batTat(${i})">${u.bat ? 'Tắt' : 'Bật'}</button>` : ''}</div>
          </div>`).join('')}
      </div>
      ${app.length ? '' : '<div class="trong">Hub chưa khai báo app nào.</div>'}
      ${bot ? `<div class="hang-tru"><span>🤖 Bot Telegram của Hub</span><b>${e(bot.chu || (bot.coKhoa ? 'Đã có khóa' : 'Chưa có khóa'))}</b></div>` : ''}
      <div class="the">
        <p class="chu-phu">Bật / tắt app: gửi Hub sau 6 giây (bấm Hoàn tác để hủy). Sửa link máy chủ: làm trên Hub v1. App gặp lỗi kéo số: mở app đó kiểm tra rồi bấm ↻ trên 🏠 Hôm nay.</p>
        <button class="btn-secondary" onclick="ShinApp.moV1('HUB', 'Cài đặt ứng dụng')">⚙️ Mở Cài đặt trên Hub v1</button>
      </div>`;
  },

  /** Bật / tắt app: hiện ngay, gửi sau 6 giây (Hoàn tác không gửi gì), ghi đúng 1 lần. */
  batTat: function(i) {
    const u = (this._d.ungDung || [])[i];
    if (!u || !u.ma) return;
    const moi = !u.bat;
    const veLai = () => this.render(document.getElementById('appContent'), this._d);
    ShinApp.hanhDongHoanTac(`Đã ${moi ? 'bật' : 'tắt'} ${u.ten}`, {
      lamTruoc: () => { u.bat = moi; veLai(); },
      traLai: () => { u.bat = !moi; veLai(); },
      thucHien: async () => {
        if (!SHIN_API.laCheDoLive() || !this._d.live) return;
        const kq = await ShinApp.goiBat('HUB', 'webLuuUngDung', { ma: u.ma, bat: moi });
        if (kq) { this._d = this.tuV1(kq); if (document.getElementById('qtNoiDung')) veLai(); }
      }
    });
  },

  /* ---------------- 🧭 Người phụ trách mảng ---------------- */

  veMang: function(d) {
    const e = ShinApp.esc;
    const pt = d.phuTrach || [];
    const dung = (d.danhBa || []).filter(this.dangDung);
    return `
      <p class="chu-phu">Người phụ trách thấy việc và số của mảng đó trên 🏠 Hôm nay. Mỗi mảng 1–2 người.</p>
      ${pt.map((m, i) => `
        <div class="the">
          <div class="the-tin-dau"><b>${e(m.ten)}</b><span class="badge ${m.dsMa.length ? 'xanh' : 'vang'}">${m.dsMa.length ? m.dsMa.length + ' người' : 'Chưa có'}</span></div>
          <div class="hang-o-chon">
            ${[0, 1].map(k => `
              <select class="form-input" id="qtPT${i}_${k}" aria-label="Người phụ trách ${k + 1} của ${e(m.ten)}">
                <option value="">${k ? '– (không có người thứ 2) –' : '– chọn người –'}</option>
                ${dung.map(n => `<option value="${e(n.ma)}" ${m.dsMa[k] === n.ma ? 'selected' : ''}>${e(n.hoTen)} · ${e(n.ma)}</option>`).join('')}
              </select>`).join('')}
          </div>
          <div class="hang-nut"><button class="btn-secondary" onclick="ModuleQuanTri.luuMang(${i})">💾 Lưu</button></div>
        </div>`).join('')}
      ${pt.length ? '' : '<div class="trong">Hub chưa có bảng phụ trách.</div>'}`;
  },

  /** Đổi người phụ trách: hiện ngay, gửi sau 6 giây (Hoàn tác được). */
  luuMang: function(i) {
    const m = (this._d.phuTrach || [])[i];
    if (!m) return;
    const v = k => String((document.getElementById(`qtPT${i}_${k}`) || {}).value || '');
    const dsMa = [v(0), v(1)].filter(Boolean).filter((x, j, a) => a.indexOf(x) === j);
    if (!dsMa.length) { ShinApp.toast('Mỗi mảng cần ít nhất 1 người phụ trách.', 'warn'); return; }
    if (dsMa.join(',') === m.dsMa.join(',')) return;
    const cu = m.dsMa.slice(), cuNguoi = m.nguoi.slice();
    const ten = ma => ((this._d.danhBa || []).find(n => n.ma === ma) || {}).hoTen || ma;
    const veLai = () => this.render(document.getElementById('appContent'), this._d);
    ShinApp.hanhDongHoanTac(`Đã giao ${m.ten} cho ${dsMa.map(ten).join(' + ')}`, {
      lamTruoc: () => { m.dsMa = dsMa; m.nguoi = dsMa.map(ten); veLai(); },
      traLai: () => { m.dsMa = cu; m.nguoi = cuNguoi; veLai(); },
      thucHien: async () => {
        if (!SHIN_API.laCheDoLive() || !this._d.live) return;
        await ShinApp.goiBat('HUB', 'webLuuPhuTrach', { maMang: m.ma, dsMa });
      }
    });
  }
};
