/**
 * SHIN v2 – 🩺 Khảo sát › 📝 Nhập hộ phiếu giấy (v2.13.16, M1.5)
 * Cổng KS (app 70_KhaoSat v1.3.2 L2, đã lên app):
 *   webCongKhaiDocKS({ma}) ➜ {maKS, tieuDe, moTa, cau:[{maCH, phienBan, loai, noiDung, luaChon[], batBuoc}]}  (đọc câu đúng phiên bản; KS phải Đang mở)
 *   webNhapHo({ma, traLoi:{MaCH: giá trị}, giay}) ➜ {ok, maPhieu, msg}  (Admin / Quản lý của KS; Kenh 'Nhập hộ' + NguoiNhapHo, không giới hạn thiết bị)
 * Cổng KS không có mã chống trùng ➜ khóa nút khi đang gửi + Toast Hoàn tác 6s (Hoàn tác = không gửi gì), gửi xong xóa form.
 * Tường lửa M9.5: ô chữ có CCCD / BHYT / khóa ➜ chặn trước khi gửi (webNhapHo không khớp CONG_GHI nên tự soát ở đây).
 */
const ModuleKsNhapHo = {
  _ks: null, _tl: {}, _batDau: 0, _dangGui: false,

  /** Câu mẫu Demo (khuôn webCongKhaiDocKS). */
  MAU: {
    maKS: 'KS001', tieuDe: 'Hài lòng người bệnh ngoại trú (mẫu)', moTa: '',
    cau: [
      { maCH: 'CH001', phienBan: 1, loai: '5muc', noiDung: 'Anh/chị hài lòng với thái độ nhân viên?', luaChon: [], batBuoc: true },
      { maCH: 'CH002', phienBan: 1, loai: 'cokhong', noiDung: 'Thời gian chờ có hợp lý không?', luaChon: [], batBuoc: true },
      { maCH: 'CH003', phienBan: 1, loai: 'chonnhieu', noiDung: 'Anh/chị biết phòng khám qua đâu?', luaChon: ['Người quen', 'Facebook', 'Zalo', 'Đi ngang qua'], batBuoc: false },
      { maCH: 'CH004', phienBan: 1, loai: 'nps', noiDung: 'Khả năng giới thiệu cho người thân (0–10)?', luaChon: [], batBuoc: false },
      { maCH: 'CH005', phienBan: 1, loai: 'chudai', noiDung: 'Góp ý thêm', luaChon: [], batBuoc: false }
    ]
  },

  /** THUẦN. Rỗng? (giống rongTL_ v1). */
  rong: function(v) { return v === undefined || v === null || (Array.isArray(v) ? !v.length : !String(v).trim()); },

  /** THUẦN. Lựa chọn hiện cho câu dạng nút (5muc / nps / cokhong / chon1 / chonnhieu / chip); câu nhập chữ ➜ null. */
  luaChonCua: function(c) {
    if (c.loai === '5muc') return ['1', '2', '3', '4', '5'];
    if (c.loai === 'nps') return Array.from({ length: 11 }, (_, i) => String(i));
    if (c.loai === 'cokhong') return ['Có', 'Không'];
    if (['chon1', 'chonnhieu', 'chip'].includes(c.loai)) return (c.luaChon || []).map(String);
    return null;
  },
  nhieu: function(c) { return c.loai === 'chonnhieu' || c.loai === 'chip'; },

  /** THUẦN. Bấm 1 lựa chọn ➜ giá trị mới (chọn 1: bấm lại bỏ chọn; chọn nhiều: bật / tắt, giữ thứ tự lựa chọn). */
  bamLuaChon: function(c, cu, gt) {
    if (!this.nhieu(c)) return String(cu) === gt ? '' : gt;
    const ds = Array.isArray(cu) ? cu.slice() : [];
    const i = ds.indexOf(gt);
    if (i >= 0) ds.splice(i, 1); else ds.push(gt);
    const lc = this.luaChonCua(c);
    return ds.sort((a, b) => lc.indexOf(a) - lc.indexOf(b));
  },

  /** THUẦN. Gói gửi: bỏ câu rỗng, chữ gộp khoảng trắng đầu/cuối, 5muc/nps/so ➜ số. */
  goiTraLoi: function(cau, tl) {
    const kq = {};
    (cau || []).forEach(c => {
      let v = tl[c.maCH];
      if (this.rong(v)) return;
      if (['5muc', 'nps', 'so'].includes(c.loai)) v = Number(String(v).trim().replace(',', '.'));
      else if (!Array.isArray(v)) v = String(v).trim();
      kq[c.maCH] = v;
    });
    return kq;
  },

  /** THUẦN. Kiểm như loiPhieuKS (v1) + tường lửa ➜ '' hợp lệ | câu báo lỗi nêu tên câu. */
  loiPhieu: function(cau, traLoi) {
    for (const c of cau || []) {
      const v = traLoi[c.maCH], ten = '«' + c.noiDung + '»';
      if (this.rong(v)) { if (c.batBuoc) return 'Chưa trả lời câu ' + ten + '.'; continue; }
      const n = Number(v), lc = c.luaChon || [];
      const sai = c.loai === '5muc' ? !(n >= 1 && n <= 5 && n % 1 === 0)
        : c.loai === 'nps' ? !(n >= 0 && n <= 10 && n % 1 === 0)
        : c.loai === 'so' ? !isFinite(n)
        : c.loai === 'cokhong' ? !['Có', 'Không'].includes(String(v))
        : c.loai === 'chon1' ? !lc.includes(String(v))
        : this.nhieu(c) ? !Array.isArray(v) || v.some(x => !lc.includes(String(x)))
        : String(v).length > (c.loai === 'chudai' ? 2000 : 200);
      if (sai) return 'Câu trả lời ' + ten + ' không hợp lệ.';
    }
    const vp = (typeof SHIN_API !== 'undefined' && SHIN_API.soatKhongDuaVao) ? SHIN_API.soatKhongDuaVao(traLoi) : null;
    if (vp) return 'Có ' + vp.loai + ' trong phiếu – xóa đi rồi gửi lại (không đưa số giấy tờ người bệnh lên hệ thống).';
    return '';
  },

  khung: function() {
    let k = document.getElementById('ksNhapHo');
    if (!k) {
      const truoc = document.getElementById('ksForm');
      if (!truoc) return null;
      k = document.createElement('div');
      k.id = 'ksNhapHo';
      k.className = 'ks-ql-khung';
      truoc.parentNode.insertBefore(k, truoc);
    }
    return k;
  },

  /** Mở form nhập hộ cho 1 khảo sát (Đang mở). */
  mo: async function(maKS, tenKS, nut) {
    const k = this.khung();
    if (!k) return;
    k.hidden = false;
    k.innerHTML = '<div class="trong">⏳ Đang tải câu hỏi…</div>';
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
    const r = await ShinApp.goiNut(nut, 'Đang tải…', () => SHIN_API.goi('KS', 'webCongKhaiDocKS', { ma: maKS }), 'ksNH_' + maKS);
    if (!r) { k.hidden = true; return; }
    if (!r.ok) {
      k.innerHTML = `<div class="canh-bao-nguon">⚠️ Không tải được câu hỏi của ${ShinApp.esc(tenKS || maKS)}: ${ShinApp.esc(SHIN_API.moTaLoi(r))} (chỉ nhập hộ được khảo sát đang mở).</div>
        <button class="btn-secondary" onclick="ModuleKsNhapHo.dong()">Đóng</button>`;
      return;
    }
    const d = r.isDemo ? Object.assign({}, this.MAU, { maKS: maKS || this.MAU.maKS }) : (r.data || {});
    this._ks = { ma: maKS, tieuDe: d.tieuDe || tenKS || maKS, cau: Array.isArray(d.cau) ? d.cau : [], demo: !!r.isDemo };
    this._tl = {};
    this._batDau = Date.now();
    this.ve();
  },

  dong: function() {
    const k = document.getElementById('ksNhapHo');
    if (k) { k.hidden = true; k.innerHTML = ''; }
    this._ks = null; this._tl = {};
  },

  ve: function() {
    const k = document.getElementById('ksNhapHo'), ks = this._ks;
    if (!k || !ks) return;
    const e = ShinApp.esc;
    k.innerHTML = `
      <h3>📝 Nhập hộ phiếu giấy – ${e(ks.tieuDe)}</h3>
      <p class="chu-phu">${ks.demo ? 'Demo: điền thử được, không ghi lên app Khảo sát. ' : ''}Chép đúng phiếu người bệnh đã điền; câu có * là bắt buộc. Không ghi họ tên / CCCD / BHYT người bệnh.</p>
      ${ks.cau.length ? ks.cau.map((c, i) => this.veCau(c, i)).join('') : '<div class="trong">Khảo sát chưa có câu hỏi.</div>'}
      <div class="ks-ql-nut">
        <button class="btn-primary" id="ksnhGui" onclick="ModuleKsNhapHo.gui(this)" ${ks.cau.length ? '' : 'disabled'}>📤 Lưu phiếu</button>
        <button class="btn-secondary" onclick="ModuleKsNhapHo.lamMoi()">↺ Xóa form</button>
        <button class="btn-secondary" onclick="ModuleKsNhapHo.dong()">Đóng</button>
      </div>`;
  },

  veCau: function(c, i) {
    const e = ShinApp.esc, lc = this.luaChonCua(c), v = this._tl[c.maCH];
    const nhan = `${i + 1}. ${e(c.noiDung)}${c.batBuoc ? ' *' : ''}`;
    if (lc) {
      const chon = gt => this.nhieu(c) ? (Array.isArray(v) && v.includes(gt)) : String(v) === gt;
      return `<div class="tc-form-nhom" role="group" aria-label="${e(c.noiDung)}">
        <span class="nhan-o">${nhan}${this.nhieu(c) ? ' <span class="chu-phu">(chọn nhiều)</span>' : ''}</span>
        <div class="hang-chip">${lc.map((gt, j) => `<button type="button" style="min-width:44px" class="chip-chon ${chon(gt) ? 'dang-chon' : ''}" aria-pressed="${chon(gt)}" onclick="ModuleKsNhapHo.chon(${i}, ${j})">${e(c.loai === '5muc' ? gt + '★' : gt)}</button>`).join('')}</div>
      </div>`;
    }
    const id = 'ksnh_' + i, gt = e(v == null ? '' : String(v));
    const o = c.loai === 'chudai'
      ? `<textarea id="${id}" class="form-input" rows="3" maxlength="2000" oninput="ModuleKsNhapHo.nhap(${i}, this.value)">${gt}</textarea>`
      : `<input id="${id}" class="form-input" ${c.loai === 'so' ? 'type="text" inputmode="decimal"' : 'type="text" maxlength="200"'} autocomplete="off" value="${gt}" oninput="ModuleKsNhapHo.nhap(${i}, this.value)">`;
    return `<div class="tc-form-nhom"><label class="nhan-o" for="${id}">${nhan}</label>${o}</div>`;
  },

  chon: function(i, j) {
    const c = this._ks && this._ks.cau[i];
    if (!c) return;
    this._tl[c.maCH] = this.bamLuaChon(c, this._tl[c.maCH], this.luaChonCua(c)[j]);
    const y = window.scrollY;
    this.ve();
    window.scrollTo(0, y);
  },
  nhap: function(i, gt) {
    const c = this._ks && this._ks.cau[i];
    if (c) this._tl[c.maCH] = gt;
  },
  lamMoi: function() {
    this._tl = {}; this._batDau = Date.now();
    this.ve();
  },

  /** Lưu: kiểm ➜ Toast Hoàn tác 6s ➜ hết giờ mới gọi webNhapHo đúng 1 lần. */
  gui: function(nut) {
    const ks = this._ks;
    if (!ks || this._dangGui) return;
    const traLoi = this.goiTraLoi(ks.cau, this._tl);
    const loi = this.loiPhieu(ks.cau, traLoi);
    if (loi) { ShinApp.toast(loi, 'warn'); return; }
    if (ks.demo) { ShinApp.toast('Đang ở Demo – phiếu không được ghi lên app Khảo sát.', 'info'); return; }
    const du = { ma: ks.ma, traLoi, giay: Math.round((Date.now() - this._batDau) / 1000) };
    this._dangGui = true;
    if (nut) nut.disabled = true;
    ShinApp.hanhDongHoanTac('Sẽ lưu phiếu nhập hộ sau 6 giây.', {
      traLai: () => { this._dangGui = false; if (nut && nut.isConnected) nut.disabled = false; },
      thucHien: async () => {
        try {
          const r = await SHIN_API.goi('KS', 'webNhapHo', du);
          if (!r.ok) throw new Error(SHIN_API.moTaLoi(r));
          const kq = r.data || {};
          if (kq.ok === false) throw new Error(kq.msg || 'App Khảo sát không nhận phiếu.');
          ShinApp.toast('Đã lưu phiếu ' + (kq.maPhieu || '') + ' – form đã xóa để nhập phiếu tiếp.', 'success');
          if (this._ks === ks) this.lamMoi();
        } finally {
          this._dangGui = false;
          const n = document.getElementById('ksnhGui');
          if (n) n.disabled = false;
        }
      }
    });
  }
};

/**
 * Gắn khối 📝 Nhập hộ vào 🛠️ Quản lý khảo sát (thay dòng "chưa có trên v2").
 * Tạm bọc veQuanLy vì khaosat.js đang có phiếu agy giao-dien (11100334) – gộp thẳng vào khaosat.js khi phiếu trả.
 */
(function() {
  if (typeof ModuleKhaoSat === 'undefined' || ModuleKhaoSat._bocNhapHo) return;
  const goc = ModuleKhaoSat.veQuanLy;
  ModuleKhaoSat._bocNhapHo = true;
  ModuleKhaoSat.veQuanLy = function(d) {
    const html = goc.call(this, d), e = ShinApp.esc;
    const mo = ((d && d.khaoSat) || []).filter(x => x.trangThai === 'Đang mở');
    const khoi = `<div class="tc-form-nhom"><span class="nhan-o">📝 Nhập hộ phiếu giấy</span>
      ${mo.length ? `<div class="hang-chip">${mo.map(x => `<button type="button" class="chip-chon" data-ma="${e(x.ma)}" data-ten="${e(x.ten)}" onclick="ModuleKsNhapHo.mo(this.dataset.ma, this.dataset.ten, this)">📝 ${e(x.ten)}</button>`).join('')}</div>`
        : '<p class="chu-phu">Chưa có khảo sát Đang mở – mở 1 khảo sát rồi mới nhập hộ được.</p>'}
      <p class="chu-phu">Câu đã có người trả lời khi sửa sẽ thành phiên bản mới, khảo sát cũ giữ bản trước.</p></div>`;
    const re = /<p class="chu-phu">Nhập hộ phiếu giấy chưa có trên v2[\s\S]*?<\/p>/;
    return re.test(html) ? html.replace(re, khoi) : html.replace(/<\/details>\s*$/, khoi + '</details>');
  };
})();
