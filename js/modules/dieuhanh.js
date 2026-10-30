/**
 * SHIN v2 – Mảng 1: 🧭 Điều hành hệ Shin (chỉ Admin Hub)
 * Live: máy chủ 10_Hub – webDieuHanh({lamMoi}) đọc bang_dieu_hanh.json (máy anh xuất) · webHopThu({ma, loai, maViec, thamSo}) ghi hộp thư 2 chiều.
 * Máy anh (_TacVu/dong_bo_hub.py, 15 phút) nhận lệnh từ hộp thư rồi trả trạng thái về bảng. v2 không đổi luật nào của v1 – chỉ gửi đúng các loại lệnh v1 cho phép.
 */

const ModuleDieuHanh = {
  ma: 'dieuhanh',
  ten: 'Điều Hành Hệ Shin',
  bieuTuong: '🧭',
  paletteMacDinh: 'cyber',
  mayChu: 'HUB',

  _d: null,
  _loc: '',
  _app: '',

  // Ô số lọc được (giống v1 LOC_DH_)
  LOC: { len_app: ['len_app'], kiem_dat: ['kiem_dat'], dang_lam: ['co_kh', 'da_code', 'tra_lai'], dang_cho: ['cho_kh', 'cho_viec', 'cho_anh'] },
  CHIP_CHO: { da_lam: 'xanh', em_tra_loi: 'xanh', loi: 'do' },
  CHIP_GIAO: { len_app: 'xanh', kiem_dat: 'xanh', cho_kh: 'vang', co_kh: 'vang', da_code: 'vang', tra_lai: 'do' },

  taiLive: async function(lamMoi) {
    const kq = await SHIN_API.goi('HUB', 'webDieuHanh', lamMoi ? { lamMoi: true } : {});
    if (!kq.ok) return kq;
    return { ok: true, data: kq.data || {} };
  },

  maLenh: function() { return 'h' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.dieuhanh;
    this._d = d;
    const e = ShinApp.esc;

    if (d.chuaCo || d.loi) {
      container.innerHTML = `
        ${this.dauTrang()}
        <div class="man-khong-vao">
          <div class="man-khong-vao-tieu">${e(d.chu)}</div>
          ${d.huongDan ? `<p>${e(d.huongDan)}</p>` : ''}
          <button class="btn-primary" onclick="ModuleDieuHanh.lamMoi(this)">↻ Đọc lại bảng</button>
        </div>`;
      return;
    }

    const oSo = d.oSo || [];
    const so = ma => (oSo.find(o => o.ma === ma) || {}).so || 0;
    const choAnh = d.choAnh || [];
    const conCho = choAnh.filter(v => ['da_lam', 'da_gui', 'da_nhan', 'cho_hoan_tac', 'em_tra_loi'].indexOf(v.trangThai) < 0).length;

    container.innerHTML = `
      ${this.dauTrang()}

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Hệ Shin hôm nay 🧭</div>
            <div class="hero-date">${e(d.cau || '')}</div>
          </div>
        </div>
        <div class="tq-3so">
          <div class="tq-o" onclick="document.getElementById('dhCho').scrollIntoView({behavior:'smooth'})">
            <div class="tq-so" style="color:${conCho ? 'var(--c-yellow)' : 'var(--c-green)'}">${ShinApp.soVN(conCho)}</div><div class="tq-nhan">Việc chờ anh</div></div>
          <div class="tq-o" onclick="ModuleDieuHanh.datLoc('dang_lam')">
            <div class="tq-so" style="color:var(--c-blue)">${ShinApp.soVN(so('dang_lam'))}</div><div class="tq-nhan">Dòng đang làm</div></div>
          <div class="tq-o" onclick="ModuleDieuHanh.datLoc('len_app')">
            <div class="tq-so" style="color:var(--c-green)">${ShinApp.soVN(so('len_app'))}</div><div class="tq-nhan">Đã lên app</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleDieuHanh.lamMoi(this)">↻ Đọc lại bảng mới nhất</button>
      </div>

      ${d.canhBaoCu ? `<div class="canh-bao-nguon mau"><span>⚠ ${e(d.canhBaoCu)}</span></div>` : ''}
      ${d.luotAi ? `<p class="chu-phu">🤖 ${e(d.luotAi)}</p>` : ''}

      <div id="dhCho">${this.veChoAnh(choAnh)}</div>
      <div id="dhGiao">${this.veGiaoViec(d.ungDung || [], d.giaoViec || [])}</div>
      ${(d.keHoach || []).length ? `<div id="dhKeHoach">${this.veKeHoach(d.keHoach)}</div>` : ''}
      <div id="dhApp">${this.veDongViec()}</div>

      <details class="tq-gon" data-nho="dh_tacvu" ${ShinApp_moGap('dh_tacvu')}>
        <summary><span>⚙️ Tác vụ tự động</span><span class="tom-tat">${d.khoa && d.khoa.treo ? '⚠ khóa treo' : (d.tacVu || []).length + ' tác vụ'}</span></summary>
        <p class="chu-phu">${e(d.khoa ? d.khoa.chu : '')}</p>
        ${(d.tacVu || []).map(t => `
          <div class="hang-tru"><span><b>${e(t.ten)}</b><br><span class="chu-phu">${e(t.ketQua || 'Chưa có lần chạy')}</span></span>
            <span class="chu-phu">lần cuối ${e(t.lanCuoi)} · tới ${e(t.lanToi)}</span></div>`).join('')}
      </details>

      ${(d.hoatDong || []).length ? `
        <details class="tq-gon" data-nho="dh_hoatdong">
          <summary><span>🕘 Hoạt động gần đây</span><span class="tom-tat">${d.hoatDong.length}</span></summary>
          ${d.hoatDong.map(h => `<div class="hang-tru"><span>${e(h.noi_dung)}</span><span class="chu-phu">${e(this.lucNgan(h.luc))}${h.kho ? ' · ' + e(h.kho) : ''}</span></div>`).join('')}
        </details>` : ''}

      <p class="chu-phu" style="text-align:center;">Số lúc ${e(d.luc || '–')} · Máy anh nhận lệnh trong 15 phút</p>
    `;
  },

  dauTrang: function() {
    return `
      <div class="page-header">
        <div>
          <div class="page-title">🧭 Điều Hành Hệ Shin</div>
          <div class="page-sub">Chờ anh · Giao việc · Dòng việc các app · Tác vụ tự động</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('hub')" title="Về Hôm nay">🏠</button>
      </div>`;
  },

  /** 'yyyy-mm-dd hh:mm' ➜ 'hh:mm dd/mm'. */
  lucNgan: function(s) {
    const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}:\d{2})/.exec(String(s || ''));
    return m ? `${m[4]} ${m[3]}/${m[2]}` : String(s || '');
  },

  /* ---------------- ① Chờ anh ---------------- */

  veChoAnh: function(ds) {
    const e = ShinApp.esc;
    return `
      <div class="hn-tieu"><span>① CHỜ ANH · ${ds.length}</span></div>
      ${ds.length ? ds.map((v, i) => {
        const dangCho = ['da_lam', 'da_gui', 'da_nhan', 'cho_hoan_tac'].indexOf(v.trangThai) >= 0;
        const coNut = !v.hoanTac && !dangCho && v.trangThai !== 'em_tra_loi';
        const luaChon = v.luaChon || [];
        return `
        <div class="the" id="dhCA${i}">
          <div class="the-tin-dau">
            <b>${e(v.tieuDe)}</b>
            ${v.nhanTT ? `<span class="badge ${this.CHIP_CHO[v.trangThai] || 'xam'}">${e(v.nhanTT)}</span>` : ''}
          </div>
          <div class="chu-phu">${e([v.ma, v.app, v.ngay].filter(Boolean).join(' · '))}</div>
          ${v.traLoi ? `<p class="chu-phu">💬 Em: ${e(v.traLoi)}</p>` : ''}
          ${v.chiTiet ? `<details class="chi-tiet-gon"><summary>Chi tiết</summary><p class="chu-phu">${e(v.chiTiet)}</p></details>` : ''}
          <div class="hang-nut">
            ${v.hoanTac ? `<button class="btn-secondary" onclick="ModuleDieuHanh.hoanTacMay(${i}, this)">↶ Hoàn tác (trong 10 phút)</button>` : ''}
            ${coNut ? (luaChon.length
              ? luaChon.map((c, j) => `<button class="${j ? 'btn-secondary' : 'btn-primary'}" onclick="ModuleDieuHanh.chonCA(${i}, ${j})">${e(c)}</button>`).join('')
              : `<button class="btn-primary" onclick="ModuleDieuHanh.lenhCA(${i}, 'da_lam')">✓ Đã làm</button>`) : ''}
            ${coNut && luaChon.indexOf('Để sau') < 0 ? `<button class="btn-secondary" onclick="ModuleDieuHanh.moPhuCA(${i}, 'de_sau')">Để sau</button>` : ''}
            ${coNut && !luaChon.length ? `<button class="btn-secondary" onclick="ModuleDieuHanh.lenhCA(${i}, 'bo_qua')">Bỏ qua</button>` : ''}
            ${coNut ? `<button class="btn-secondary" onclick="ModuleDieuHanh.moPhuCA(${i}, 'tra_loi')">💬 Trả lời</button>` : ''}
          </div>
          <div id="dhCAPhu${i}"></div>
        </div>`;
      }).join('') : '<div class="trong">Không có việc chờ anh 👍</div>'}`;
  },

  capNhatChoAnh: function(ds) {
    this._d.choAnh = ds || [];
    const khung = document.getElementById('dhCho');
    if (khung) khung.innerHTML = this.veChoAnh(this._d.choAnh);
  },

  /** Gửi 1 lệnh hộp thư ➜ trả dữ liệu máy chủ ({choAnh}). Demo ➜ đổi tại chỗ. */
  gui: function(loai, maViec, thamSo) {
    return ShinApp.goiBat('HUB', 'webHopThu', { ma: this.maLenh(), loai, maViec, thamSo: thamSo || {} });
  },

  /** Lệnh 1 chạm (Đã làm / Bỏ qua / chọn / Duyệt dòng): đổi thẻ ngay, 6 giây Hoàn tác mới gửi. */
  lenhCA: function(i, loai, thamSo, nhan) {
    const v = (this._d.choAnh || [])[i];
    const the = document.getElementById('dhCA' + i);
    if (!v || !the) return;
    const ten = nhan || (loai === 'da_lam' ? 'Đã làm' : loai === 'bo_qua' ? 'Bỏ qua' : 'Đã chọn');
    ShinApp.hanhDongHoanTac(`${ten}: "${v.tieuDe}"`, {
      lamTruoc: () => the.classList.add('mo-di'),
      traLai: () => the.classList.remove('mo-di'),
      thucHien: async () => {
        if (!SHIN_API.laCheDoLive()) {
          v.trangThai = 'da_gui'; v.nhanTT = 'Đã gửi (mẫu)'; v.hoanTac = true;
          this.capNhatChoAnh(this._d.choAnh);
          return;
        }
        const kq = await this.gui(loai, v.ma, thamSo);
        this.capNhatChoAnh(kq.choAnh);
        ShinApp.toast('Đã gửi – máy nhận trong 15 phút.', 'info');
      }
    });
  },

  chonCA: function(i, j) {
    const v = (this._d.choAnh || [])[i];
    if (!v) return;
    const c = v.luaChon[j];
    const l = /^([A-Z]{2,5})-(L\d+[a-z]?)$/.exec(v.ma);
    if (l && c === 'Duyệt') this.lenhCA(i, 'duyet_dong', { app: l[1], l: l[2] }, 'Duyệt');
    else this.lenhCA(i, 'chon', { chon: c }, c);
  },

  /** Ô phụ dưới thẻ: Để sau (ngày) · Trả lời / Hỏi lại (chữ). */
  moPhuCA: function(i, kieu) {
    const phu = document.getElementById('dhCAPhu' + i);
    if (!phu) return;
    if (phu.dataset.kieu === kieu) { phu.innerHTML = ''; phu.dataset.kieu = ''; return; }
    phu.dataset.kieu = kieu;
    phu.innerHTML = kieu === 'de_sau' ? `
      <div class="hang-nhap">
        <input id="dhNgay${i}" class="form-input o-ngay" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" oninput="ShinApp.goNgay(this)">
        <button class="btn-primary" onclick="ModuleDieuHanh.guiPhuCA(${i}, 'de_sau', this)">Gửi</button>
      </div>` : `
      <textarea id="dhChu${i}" class="form-input" rows="3" maxlength="1000" placeholder="Viết câu trả lời hoặc câu hỏi cho em…"></textarea>
      <div class="hang-nut">
        <button class="btn-primary" onclick="ModuleDieuHanh.guiPhuCA(${i}, 'tra_loi', this)">Gửi trả lời</button>
        <button class="btn-secondary" onclick="ModuleDieuHanh.guiPhuCA(${i}, 'hoi_lai', this)">Hỏi lại em</button>
      </div>`;
    const o = phu.querySelector('input, textarea');
    if (o) o.focus();
  },

  guiPhuCA: async function(i, loai, nut) {
    const v = (this._d.choAnh || [])[i];
    if (!v) return;
    let thamSo;
    if (loai === 'de_sau') {
      const ngay = (document.getElementById('dhNgay' + i).value || '').trim();
      if (!ShinApp.laNgayVN(ngay)) { ShinApp.toast('Chọn ngày dạng dd/mm/yyyy, ví dụ 05/11/2026.', 'warn'); return; }
      thamSo = { ngay };
    } else {
      const chu = (document.getElementById('dhChu' + i).value || '').trim();
      if (!chu) { ShinApp.toast('Viết vài chữ trước khi gửi.', 'warn'); return; }
      thamSo = { chu };
    }
    if (!SHIN_API.laCheDoLive()) {
      v.trangThai = 'da_gui'; v.nhanTT = 'Đã gửi (mẫu)';
      this.capNhatChoAnh(this._d.choAnh);
      ShinApp.toast('Đã gửi (mẫu – chưa gửi máy thật).', 'info');
      return;
    }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui(loai, v.ma, thamSo), 'dh-' + loai + '-' + v.ma);
    if (kq) { this.capNhatChoAnh(kq.choAnh); ShinApp.rung('xong'); ShinApp.toast('Đã gửi – máy nhận trong 15 phút.'); }
  },

  /** Hoàn tác phía máy (v1 cho trong 10 phút sau lệnh). */
  hoanTacMay: async function(i, nut) {
    const v = (this._d.choAnh || [])[i];
    if (!v) return;
    if (!SHIN_API.laCheDoLive()) {
      v.trangThai = 'mo'; v.nhanTT = ''; v.hoanTac = false;
      this.capNhatChoAnh(this._d.choAnh);
      return;
    }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi hoàn tác…', () => this.gui('hoan_tac', v.ma, {}), 'dh-hoan-' + v.ma);
    if (kq) { this.capNhatChoAnh(kq.choAnh); ShinApp.toast('Đã gửi hoàn tác – máy đảo lại trong 15 phút.', 'info'); }
  },

  /* ---------------- ⚡ Giao việc cho Shin ---------------- */

  veGiaoViec: function(dsApp, ds) {
    const e = ShinApp.esc;
    return `
      <div class="hn-tieu"><span>⚡ GIAO VIỆC CHO SHIN</span></div>
      <div class="the">
        <div class="hang-chip" role="group" aria-label="Chọn app">
          ${dsApp.map(u => `<button class="chip-chon ${this._app === u.ma ? 'dang-chon' : ''}" title="${e(u.ten)}" onclick="ModuleDieuHanh.chonApp('${e(u.ma)}')">${e(u.ma)}</button>`).join('')}
        </div>
        <textarea id="dhGiaoChu" class="form-input" rows="3" maxlength="1000" placeholder="Việc anh muốn Shin làm (ít nhất 10 ký tự)…"></textarea>
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleDieuHanh.giaoViec(this)">Giao việc</button></div>
        <div class="hn-tieu"><span>VIỆC ĐÃ GIAO GẦN ĐÂY</span></div>
        ${ds.length ? ds.map(g => `
          <div class="hang-tru"><span>${e(g.app + (g.l ? ' ' + g.l : ''))} · ${e(g.noiDung)}</span><span class="badge ${this.CHIP_GIAO[g.trangThai] || 'xam'}">${e(g.nhan)}</span></div>
        `).join('') : '<div class="trong">Chưa giao việc nào.</div>'}
      </div>`;
  },

  chonApp: function(ma) {
    this._app = this._app === ma ? '' : ma;
    ShinApp.rung('nhe');
    document.querySelectorAll('#dhGiao .chip-chon').forEach(b => b.classList.toggle('dang-chon', b.textContent === this._app));
  },

  giaoViec: async function(nut) {
    const o = document.getElementById('dhGiaoChu');
    const nd = (o.value || '').trim();
    if (!this._app) { ShinApp.toast('Chọn app trước khi giao.', 'warn'); return; }
    if (nd.length < 10) { o.focus(); ShinApp.toast('Viết việc rõ hơn (ít nhất 10 ký tự).', 'warn'); return; }
    const t = new Date(), p = n => ('0' + n).slice(-2);
    const ma = 'GV' + p(t.getFullYear() % 100) + p(t.getMonth() + 1) + p(t.getDate()) + p(t.getHours()) + p(t.getMinutes()) + p(t.getSeconds());
    const app = this._app;
    const them = () => {
      this._d.giaoViec = [{ ma, app, noiDung: nd.slice(0, 120), l: '', trangThai: 'da_gui', nhan: 'Đã gửi' }].concat(this._d.giaoViec || []).slice(0, 5);
      this._app = '';
      document.getElementById('dhGiao').innerHTML = this.veGiaoViec(this._d.ungDung || [], this._d.giaoViec);
    };
    if (!SHIN_API.laCheDoLive()) { them(); ShinApp.toast(`Đã giao cho ${app} (mẫu – chưa gửi máy thật).`, 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang giao…', () => this.gui('giao_viec', ma, { app, noiDung: nd }), 'dh-giao-' + nd);
    if (kq) { them(); ShinApp.rung('xong'); ShinApp.toast(`Đã giao – máy thêm vào hàng đợi ${app} trong 15 phút.`); }
  },

  /* ---------------- ⑤ Kế hoạch chờ duyệt ---------------- */

  veKeHoach: function(ds) {
    const e = ShinApp.esc;
    return `
      <div class="hn-tieu"><span>⑤ KẾ HOẠCH CHỜ DUYỆT · ${ds.length}</span></div>
      ${ds.map((k, i) => `
        <details class="tq-gon" id="dhKH${i}">
          <summary><span>${e(k.tieuDe)}</span><span class="tom-tat">${k.cau.length} câu</span></summary>
          <p>${e(k.tomTat)}</p>
          <p class="chu-phu">${e(k.tep)}</p>
          ${k.cau.map((c, j) => `
            <div class="the">
              <b>${e(c.ma)} · ${e(c.hoi)}</b>
              <div class="chu-phu">${c.macDinh ? 'Mặc định: ' + e(c.macDinh) : '(không có mặc định – cần anh chọn)'}</div>
              <div class="hang-chip">
                ${c.macDinh ? `<button class="chip-chon dang-chon" id="dhKHmd${i}_${j}" onclick="ModuleDieuHanh.chonCau(${i}, ${j}, false)">Theo mặc định</button>` : ''}
                <button class="chip-chon ${c.macDinh ? '' : 'dang-chon'}" id="dhKHk${i}_${j}" onclick="ModuleDieuHanh.chonCau(${i}, ${j}, true)">Chọn khác</button>
              </div>
              <textarea id="dhKHy${i}_${j}" class="form-input" rows="2" maxlength="200" placeholder="Ý anh cho ${e(c.ma)}…" ${c.macDinh ? 'hidden' : ''}></textarea>
            </div>`).join('')}
          <textarea id="dhKHgy${i}" class="form-input" rows="2" maxlength="500" placeholder="Góp ý chung (bắt buộc khi chưa duyệt)…"></textarea>
          <div class="hang-nut">
            <button class="btn-primary" onclick="ModuleDieuHanh.duyetKH(${i}, 'duyet', this)">Duyệt</button>
            <button class="btn-secondary" onclick="ModuleDieuHanh.duyetKH(${i}, 'duyet_sua', this)">Duyệt có sửa</button>
            <button class="btn-secondary" onclick="ModuleDieuHanh.duyetKH(${i}, 'chua', this)">Chưa duyệt – góp ý</button>
          </div>
        </details>`).join('')}`;
  },

  chonCau: function(i, j, khac) {
    const md = document.getElementById(`dhKHmd${i}_${j}`), k = document.getElementById(`dhKHk${i}_${j}`), y = document.getElementById(`dhKHy${i}_${j}`);
    if (md) md.classList.toggle('dang-chon', !khac);
    if (k) k.classList.toggle('dang-chon', khac);
    if (y) { y.hidden = !khac; if (khac) y.focus(); }
  },

  duyetKH: async function(i, quyet, nut) {
    const k = (this._d.keHoach || [])[i];
    if (!k) return;
    const cau = {};
    for (let j = 0; j < k.cau.length; j++) {
      const c = k.cau[j], khac = document.getElementById(`dhKHk${i}_${j}`).classList.contains('dang-chon');
      const ghiChu = (document.getElementById(`dhKHy${i}_${j}`).value || '').trim();
      if (khac && !ghiChu) { ShinApp.toast(`${c.ma}: viết ý anh khi chọn khác.`, 'warn'); return; }
      cau[c.ma] = { chon: khac ? 'khac' : 'mac_dinh', ghiChu, macDinh: c.macDinh };
    }
    const gopY = (document.getElementById('dhKHgy' + i).value || '').trim();
    if (quyet === 'chua' && !gopY) { ShinApp.toast('Viết góp ý khi chưa duyệt.', 'warn'); return; }
    const xong = () => {
      const the = document.getElementById('dhKH' + i);
      if (the) the.outerHTML = `<div class="the"><b>${ShinApp.esc(k.tieuDe)}</b><div class="chu-phu">Đã gửi ý anh – lượt lập kế hoạch tới sẽ ghi quyết định.</div></div>`;
    };
    if (!SHIN_API.laCheDoLive()) { xong(); ShinApp.toast('Đã gửi ý anh (mẫu).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui('duyet_ke_hoach', k.ma, { quyet, cau, gopY }), 'dh-kh-' + k.ma);
    if (kq) { xong(); ShinApp.rung('xong'); ShinApp.toast('Đã gửi – lượt lập kế hoạch tới sẽ ghi quyết định.'); }
  },

  /* ---------------- Dòng việc các app ---------------- */

  veDongViec: function() {
    const e = ShinApp.esc, d = this._d, loc = this._loc;
    const ds = (d.ungDung || []).map(u => ({ u, dong: loc ? u.dong.filter(x => this.LOC[loc].indexOf(x.trangThai) >= 0) : u.dong }))
      .filter(x => !loc || x.dong.length);
    return `
      <div class="hn-tieu"><span>DÒNG VIỆC CÁC APP</span>${loc ? '<button class="nut-chu" onclick="ModuleDieuHanh.datLoc(\'\')">Bỏ lọc</button>' : ''}</div>
      <div class="luoi-o-so">
        ${(d.oSo || []).map(o => this.LOC[o.ma]
          ? `<button class="o-so-loc ${loc === o.ma ? 'dang-chon' : ''}" onclick="ModuleDieuHanh.datLoc('${e(o.ma)}')"><b>${ShinApp.soVN(o.so)}</b><span>${e(o.ten)}</span></button>`
          : `<div class="o-so-loc"><b>${ShinApp.soVN(o.so)}</b><span>${e(o.ten)}</span></div>`).join('')}
      </div>
      ${ds.length ? ds.map(x => {
        const u = x.u, ui = d.ungDung.indexOf(u);
        return `
        <details class="tq-gon" ${loc ? 'open' : ''}>
          <summary><span>${e(u.ten)}</span><span class="tom-tat">${ShinApp.soVN(u.tyLe)}% · ${x.dong.length} dòng</span></summary>
          <div class="thanh-tien"><div style="width:${Math.max(0, Math.min(100, Number(u.tyLe) || 0))}%"></div></div>
          ${u.demChu || u.pbMa ? `<p class="chu-phu">${e([u.pbMa ? 'mã ' + u.pbMa + (u.pbApp && u.pbApp !== u.pbMa ? ' → app ' + u.pbApp : '') : '', u.demChu].filter(Boolean).join(' · '))}</p>` : ''}
          ${x.dong.map(dg => {
            const di = u.dong.indexOf(dg);
            return `
            <div class="hn-dong" onclick="ModuleDieuHanh.moDong(${ui}, ${di})">
              <div class="dong-content">
                <div class="dong-title">${e(dg.l)} · ${e(dg.noiDung)}</div>
                <div class="dong-sub">${e(dg.nhan)}${dg.cho ? ' · chờ ' + e(dg.cho) : ''}</div>
              </div>
              <div class="dong-meta">${dg.trangThai === 'tra_lai' ? '<span class="badge do">Trả lại</span>' : dg.trangThai === 'cho_anh' ? '<span class="badge vang">Chờ anh</span>' : ''}<span class="dong-arrow">›</span></div>
            </div>
            <div class="chi-tiet-dong" id="dhDong${ui}_${di}" hidden></div>`;
          }).join('')}
          <button class="nut-rong" onclick="ModuleDieuHanh.xinLenApp(${ui}, this)">🚀 Xin đưa ${e(u.ma)} lên app lượt ④ tới</button>
          ${(u.nhatKy || []).length ? `<p class="chu-phu"><b>Lượt gần đây:</b><br>${u.nhatKy.map(h => e(this.lucNgan(h.luc) + ' · ' + h.noiDung)).join('<br>')}</p>` : ''}
        </details>`;
      }).join('') : '<div class="trong">Không có dòng việc nào.</div>'}`;
  },

  datLoc: function(ma) {
    this._loc = this._loc === ma ? '' : ma;
    ShinApp.rung('nhe');
    const khung = document.getElementById('dhApp');
    if (khung) { khung.innerHTML = this.veDongViec(); khung.scrollIntoView({ behavior: 'smooth' }); }
  },

  /** Mở phiếu 1 dòng L + nút lệnh theo dòng (v1 HUB L16a/b). */
  moDong: function(ui, di) {
    const u = this._d.ungDung[ui], d = u && u.dong[di];
    const khung = document.getElementById(`dhDong${ui}_${di}`);
    if (!d || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;
    const e = ShinApp.esc, t = d.tomTat;
    let phieu;
    if (d.trangThai === 'len_app') phieu = '<p class="chu-phu">Đã lên app – không kèm phiếu.</p>';
    else if (!d.phieu || !t) phieu = '<p class="chu-phu">Chưa có phiếu cho dòng này.</p>';
    else phieu = `
      <p><b>Mục tiêu:</b> ${e(t.mucTieu || 'Phiếu chưa ghi mục tiêu.')}</p>
      <div class="hang-tru"><span>Tiêu chí đạt</span><b>${e(t.xong)}/${e(t.tong)}</b></div>
      ${(t.kiemTra || []).length ? `<p class="chu-phu">${t.kiemTra.map(e).join('<br>')}</p>` : '<p class="chu-phu">Chưa kiểm tra.</p>'}`;
    const coLenh = d.trangThai !== 'len_app' && /^L\d{1,4}[a-z]?$/.test(d.l);
    const nut = [];
    if (d.trangThai === 'cho_anh') nut.push(['Duyệt', 'duyet_dong', 'btn-primary']);
    nut.push(['⬆ Lên đầu', 'len_dau', 'btn-secondary'], ['⬇ Hạ', 'ha', 'btn-secondary']);
    if (['cho_anh', 'cho_viec'].indexOf(d.trangThai) < 0) nut.push(['⏸ Tạm dừng', 'tam_dung_dong', 'btn-secondary']);
    khung.innerHTML = `
      ${phieu}
      ${coLenh ? `
        <div class="hang-nut">${nut.map(n => `<button class="${n[2]}" onclick="ModuleDieuHanh.lenhDong(${ui}, ${di}, '${n[1]}', this)">${n[0]}</button>`).join('')}</div>
        <textarea id="dhGY${ui}_${di}" class="form-input" rows="2" maxlength="300" placeholder="Góp ý cho dòng này…"></textarea>
        <div class="hang-nut"><button class="btn-secondary" onclick="ModuleDieuHanh.lenhDong(${ui}, ${di}, 'gop_y_dong', this)">Gửi góp ý</button></div>` : ''}`;
  },

  lenhDong: async function(ui, di, loai, nut) {
    const u = this._d.ungDung[ui], d = u && u.dong[di];
    if (!d) return;
    const thamSo = { app: u.ma, l: d.l };
    if (loai === 'gop_y_dong') {
      const chu = (document.getElementById(`dhGY${ui}_${di}`).value || '').trim();
      if (!chu) { ShinApp.toast('Viết góp ý trước khi gửi.', 'warn'); return; }
      thamSo.chu = chu;
    }
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Đã gửi lệnh (mẫu – chưa gửi máy thật).', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui(loai, u.ma + '-' + d.l, thamSo), 'dh-dong-' + loai + u.ma + d.l);
    if (kq) {
      ShinApp.rung('xong');
      ShinApp.toast('Đã gửi – máy áp vào hàng đợi trong 15 phút.');
      const khung = document.getElementById(`dhDong${ui}_${di}`);
      if (khung) khung.hidden = true;
    }
  },

  xinLenApp: async function(ui, nut) {
    const u = this._d.ungDung[ui];
    if (!u) return;
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast(`Đã xin đưa ${u.ten} lên app (mẫu).`, 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => this.gui('xin_len_app', u.ma, { app: u.ma }), 'dh-lenapp-' + u.ma);
    if (kq) { ShinApp.rung('xong'); ShinApp.toast(`Đã xin – lượt ④ tới sẽ xem ${u.ten}.`); }
  },

  lamMoi: async function(nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Chế độ trình diễn: bảng điều hành là mẫu.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang đọc bảng…', () => ShinApp.goiBat('HUB', 'webDieuHanh', { lamMoi: true }), 'dh-lam-moi');
    if (kq) {
      this.render(document.getElementById('appContent'), kq);
      ShinApp.toast('Đã đọc lại bảng mới nhất.', 'info');
    }
  }
};
