/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat, app KS v1.4.3 – L1–L4 ✅)
 * v2.7.2: KS KHÔNG có webTongQuan ➜ gọi đúng cổng thật (du là đối tượng – SHIN_API.goi):
 *   webDsKhaoSat({}) ➜ {ok, ds:[{maKS, tieuDe, trangThai, han, soCau…}], dem:{dangMo, nhap, daDong}}
 *   webKetQuaKS({maKS}) ➜ {ok, maKS, tieuDe, soPhieu, choXacMinh, theoNgay, cau:[{maCH, loai, noiDung, n, tb?, nps?}]}
 *   webXuatKS({maKS, kieu:'csv'}) ➜ {ok, csv, tenTep}
 *   v2.8.7: webTongHopKS({thang?:'mm/yyyy'}) (KS L6, app v1.4.4 @5) ➜ {ok, thang:{soPhieu, haiLong, canXuLy},
 *           tru:[5 trụ ACHSI {ma, ten, diem, tyLe}], canXuLy:[≤ 50 {maPhieu, khaoSat, cau, diem, ngay, noiDung}]}
 *           ➜ Hero + 5 trụ + danh sách ≤ 2★ theo THÁNG; lỗi cổng này thì giữ cách cũ (điểm TB theo khảo sát).
 * Màn không hiện thông tin liên hệ người trả lời, cũng KHÔNG hiện ý kiến tự do (noiDung) – QK4.
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',
  TOI_DA_KQ: 6,
  thang: '',   // 'mm/yyyy' – rỗng = tháng hiện tại

  taiLive: async function() {
    const [ds, th] = await Promise.all([
      SHIN_API.goi('KS', 'webDsKhaoSat', {}),
      SHIN_API.goi('KS', 'webTongHopKS', this.thang ? { thang: this.thang } : {})
    ]);
    if (!ds.ok) return ds;
    const tatCa = (ds.data && ds.data.ds) || [];
    const mo = tatCa.filter(k => k.trangThai === 'Đang mở').concat(tatCa.filter(k => k.trangThai !== 'Đang mở')).slice(0, this.TOI_DA_KQ);
    const kq = await Promise.all(mo.map(k => SHIN_API.goi('KS', 'webKetQuaKS', { maKS: k.maKS })));
    const loi = kq.filter(x => !x.ok).length;
    const data = this.tuV1(ds.data, mo.map((k, i) => kq[i].ok ? kq[i].data : null));
    const ghi = [];
    if (loi) ghi.push(`${loi} khảo sát không đọc được kết quả (${SHIN_API.moTaLoi(kq.find(x => !x.ok))}) – các số khác là số thật.`);
    if (th.ok) this.ghepTongHop(data, th.data, this.thang);
    else ghi.push(`Tổng hợp 5 trụ ACHSI theo tháng chưa đọc được (${SHIN_API.moTaLoi(th)}) – đang hiện điểm TB theo từng khảo sát (số thật).`);
    return { ok: true, data, ghiChu: ghi.join(' ') };
  },

  /** THUẦN. Ghép webTongHopKS vào khuôn màn: Hero tháng + 5 trụ + ≤ 2★ (bỏ noiDung – QK4). Giữ điểm theo khảo sát ở chiSoKS. */
  ghepTongHop: function(data, t, thang) {
    t = t || {};
    const th = t.thang || {}, nhanTh = thang || this.thangHienTai();
    data.chiSoKS = data.chiSoNhom;
    data.tieuDeChiSo = '5 TRỤ ACHSI · THÁNG ' + nhanTh;
    data.chiSoNhom = (t.tru || []).map(x => ({
      nhan: x.ten || x.ma,
      diem: x.diem === null || x.diem === undefined ? '–' : ShinApp.soVN(x.diem, 1),
      tyLe: x.tyLe === null || x.tyLe === undefined ? '–' : ShinApp.ptVN(x.tyLe),
      mau: this.mau(x.tyLe)
    }));
    data.hero.so = [
      { nhan: 'Hài lòng tháng ' + nhanTh, giaTri: th.haiLong === null || th.haiLong === undefined ? '–' : ShinApp.ptVN(th.haiLong), mau: this.mau(th.haiLong) },
      { nhan: 'Phiếu hợp lệ trong tháng', giaTri: ShinApp.soVN(th.soPhieu || 0), mau: 'var(--c-blue)' },
      { nhan: 'Phiếu cần xử lý', giaTri: ShinApp.soVN(th.canXuLy || 0), mau: th.canXuLy ? 'var(--c-yellow)' : 'var(--c-gray)' }
    ];
    data.canXuLy = (t.canXuLy || []).map(x => ({ cau: x.cau, khaoSat: x.khaoSat, diem: ShinApp.soVN(x.diem), ngay: x.ngay || '', noiDung: '' }));
    data.coThang = true;
    return data;
  },

  thangHienTai: function() {
    const d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear();
  },

  /** input type=month 'yyyy-mm' ➜ 'mm/yyyy', tải lại màn. */
  doiThang: function(v) {
    const k = /^(\d{4})-(\d{2})$/.exec(String(v || ''));
    this.thang = k ? k[2] + '/' + k[1] : '';
    ShinApp.chuyenModule('khaosat');
  },

  /** THUẦN. webDsKhaoSat + webKetQuaKS[] ➜ khuôn màn. */
  tuV1: function(dsKS, ketQua) {
    dsKS = dsKS || {}; ketQua = ketQua || [];
    const ds = dsKS.ds || [], dem = dsKS.dem || {};
    const theoMa = {};
    ketQua.forEach(k => { if (k && k.maKS) theoMa[k.maKS] = k; });
    let tongPhieu = 0, choXM = 0;
    const chiSo = [], canXuLy = [];
    ketQua.forEach(k => {
      if (!k) return;
      tongPhieu += k.soPhieu || 0; choXM += k.choXacMinh || 0;
      const nam = (k.cau || []).filter(c => c.loai === '5muc' && c.tb !== null && c.tb !== undefined);
      if (nam.length) {
        const tb = nam.reduce((a, c) => a + Number(c.tb), 0) / nam.length;
        chiSo.push({ nhan: k.tieuDe || k.maKS, diem: ShinApp.soVN(tb, 2), tyLe: ShinApp.ptVN(tb / 5), mau: this.mau(tb / 5) });
      }
      nam.filter(c => Number(c.tb) <= 2).forEach(c => canXuLy.push({ cau: c.noiDung, khaoSat: k.tieuDe, diem: ShinApp.soVN(c.tb, 1), ngay: '', noiDung: `${c.n || 0} lượt trả lời – điểm TB thấp` }));
    });
    return {
      live: true,
      tieuDeChiSo: 'ĐIỂM TB CÂU 5 MỨC · THEO KHẢO SÁT',
      hero: {
        so: [
          { nhan: 'Khảo sát đang mở', giaTri: ShinApp.soVN(dem.dangMo || 0), mau: 'var(--c-blue)' },
          { nhan: 'Phiếu hợp lệ', giaTri: ShinApp.soVN(tongPhieu), mau: 'var(--c-green)' },
          { nhan: 'Chờ xác minh', giaTri: ShinApp.soVN(choXM), mau: choXM ? 'var(--c-yellow)' : 'var(--c-gray)' }
        ]
      },
      chiSoNhom: chiSo,
      khaoSat: ds.map(k => ({ ma: k.maKS, ten: k.tieuDe, trangThai: k.trangThai, soPhieu: theoMa[k.maKS] ? theoMa[k.maKS].soPhieu : null, moTu: '', dongLuc: k.han || '',
        moTa: k.moTa || '', doiTuong: k.doiTuong || '', nhieuLan: !!k.nhieuLan, soCau: k.soCau || 0, cauHinh: k.loiCauHinh ? null : (k.cauHinh || null) })),
      canXuLy
    };
  },

  /** Xuất CSV 1 khảo sát (webXuatKS) ➜ tải tệp về máy. */
  xuatCSV: async function(maKS, nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Demo: xuất CSV chạy khi có token.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang xuất…', async () => {
      const r = await SHIN_API.goi('KS', 'webXuatKS', { maKS, kieu: 'csv' });
      if (!r.ok) throw new Error(SHIN_API.moTaLoi(r));
      return r.data;
    }, 'ks-xuat-' + maKS);
    if (!kq || !kq.csv) return;
    const url = URL.createObjectURL(new Blob([kq.csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = kq.tenTep || ('khao-sat-' + maKS + '.csv');
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  },

  mau: function(tyLe) {
    return tyLe === null || tyLe === undefined ? 'var(--c-gray)' : tyLe >= 0.9 ? 'var(--c-green)' : tyLe >= 0.8 ? 'var(--c-yellow)' : 'var(--c-red)';
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.khaosat;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const tru = d.chiSoNhom || [];
    const cx = d.canXuLy || [];
    const ks = d.khaoSat || [];
    this._d = d;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🩺 Khảo Sát Hài Lòng</div>
          <div class="page-sub">5 trụ ACHSI · Ý kiến ≤ 2★ cần xử lý</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Trải nghiệm người bệnh 🩺</div>
            <div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `<div class="tq-o"><div class="tq-so" style="color:${s.mau}">${e(s.giaTri)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>`).join('')}
        </div>
        <button class="btn-primary" onclick="ModuleKhaoSat.moQuanLy()">🛠️ Quản lý khảo sát</button>
      </div>
      ${d.coThang ? `<label class="ks-thang"><span>📅 Tháng</span><input type="month" value="${e(this.giaTriThang())}" max="${e(this.giaTriThang(this.thangHienTai()))}" onchange="ModuleKhaoSat.doiThang(this.value)" aria-label="Chọn tháng tổng hợp"></label>` : ''}

      ${cx.length ? `
        <div class="hn-tieu"><span>⚠️ Ý KIẾN ≤ 2★ CẦN XỬ LÝ · ${cx.length}</span></div>
        ${cx.map(x => `
          <div class="the">
            <div class="the-tin-dau"><b>${e(x.cau || x.khaoSat)}</b><span class="badge do">${e(x.diem)}★</span></div>
            <div class="chu-phu">${e([x.khaoSat, x.ngay].filter(Boolean).join(' · '))}</div>
            ${x.noiDung ? `<p class="chu-phu">💬 ${e(x.noiDung)}</p>` : ''}
          </div>`).join('')}` : ''}

      <div class="hn-tieu"><span>${e(d.tieuDeChiSo || '5 TRỤ CHẤT LƯỢNG · ACHSI')}</span></div>
      <div class="hn-list">
        ${tru.map(cs => `
          <div class="hn-dong">
            <div class="dong-content">
              <div class="dong-title">${e(cs.nhan)}</div>
              <div class="dong-sub">Điểm trung bình ${e(cs.diem)}/5</div>
            </div>
            <div class="dong-meta"><div class="dong-so" style="color:${cs.mau}">${e(cs.tyLe)}</div></div>
          </div>`).join('')}
      </div>
      ${tru.length ? '' : '<div class="trong">Chưa có phiếu nào trong tháng.</div>'}
      ${(d.chiSoKS || []).length ? `
        <details class="tq-gon">
          <summary><span>📊 Điểm TB câu 5 mức theo khảo sát</span><span class="tom-tat">${d.chiSoKS.length}</span></summary>
          ${d.chiSoKS.map(cs => `<div class="hang-tru"><span>${e(cs.nhan)}<br><span class="chu-phu">Điểm TB ${e(cs.diem)}/5 · toàn kỳ</span></span><b style="color:${cs.mau}">${e(cs.tyLe)}</b></div>`).join('')}
        </details>` : ''}

      ${ks.length ? `
        <details class="tq-gon">
          <summary><span>📋 Các khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
          ${ks.map(x => `<div class="hang-tru"><span>${e(x.ten)}<br><span class="chu-phu">${e([x.trangThai, x.moTu ? 'từ ' + x.moTu : '', x.dongLuc ? 'đến ' + x.dongLuc : ''].filter(Boolean).join(' · '))}</span></span><span style="display:flex;align-items:center;gap:6px;"><b>${x.soPhieu === null || x.soPhieu === undefined ? '–' : ShinApp.soVN(x.soPhieu)} phiếu</b>${x.ma && d.live ? `<button class="btn-secondary" style="min-height:44px;" onclick="ModuleKhaoSat.xuatCSV('${e(x.ma)}', this)" aria-label="Xuất CSV">⬇ CSV</button>` : ''}</span></div>`).join('')}
        </details>` : ''}

      ${this.veQuanLy(d)}

      <details class="tq-gon">
        <summary><span>ⓘ Quy ước</span></summary>
        <p class="chu-phu">Phiếu có câu ≤ 2 sao nổi lên đầu để tổ CSKH liên hệ xử lý. Màn này không hiện thông tin liên hệ người trả lời và ý kiến tự do (xem trên app KS). Hài lòng = tỷ lệ phiếu có điểm TB câu 5 mức ≥ 4; trụ ACHSI theo cột Nhóm của câu hỏi.</p>
      </details>
    `;
  },

  /** 'mm/yyyy' ➜ 'yyyy-mm' cho input type=month. */
  giaTriThang: function(t) {
    const k = /^(\d{2})\/(\d{4})$/.exec(t || this.thang || this.thangHienTai());
    return k ? k[2] + '-' + k[1] : '';
  },

  /* ---------- v2.13.15 – 🛠️ Quản lý khảo sát ngay trên v2 (cổng KS L1 có sẵn, app KS v1.0.2+):
   * webLuuKhaoSat({maKS?, TieuDe, MoTa, DoiTuong, Han, NhieuLan, cauHinh?}) · webDoiTrangThaiKS({maKS, trangThai}) · webNhanBanKS({maKS})
   * webXoaKS({maKS, hoanTac?}) · webDsCauHoi({}) · webLuuCauHoi({maCH?, Loai, NoiDung, LuaChon[], BatBuoc, Nhom}) · webNhanBanCau({maCH})
   * webLuuQuyen({maNguoi, hoTen, vaiTro: 'Admin'|'QuanLyKS'|''}) – chỉ Admin. Việc đổi dữ liệu có ngay hậu quả ➜ Toast Hoàn tác 6s (không gửi gì khi Hoàn tác). */
  LOAI_CAU: [['5muc', '5 mức sao'], ['cokhong', 'Có / Không'], ['chon1', 'Chọn 1'], ['chonnhieu', 'Chọn nhiều'], ['chip', 'Chip chọn nhanh'],
    ['so', 'Số'], ['chungan', 'Chữ ngắn'], ['chudai', 'Chữ dài'], ['nps', 'NPS 0–10'], ['lienhe', 'Thông tin liên hệ']],
  LOAI_CO_LUA_CHON: ['chon1', 'chonnhieu', 'chip'],
  TRANG_THAI: ['Nháp', 'Đang mở', 'Đã đóng'],
  _d: null,
  _cau: null,     // ngân hàng câu đã tải [{maCH, phienBan, loai, noiDung, luaChon, batBuoc, nhom, suaDuoc}]
  _moQL: false,

  /** THUẦN. Kiểm form khảo sát ➜ {goi} | {loi}. Hạn rỗng hoặc dd/mm/yyyy có thật. */
  kiemKS: function(du) {
    du = du || {};
    const td = String(du.TieuDe || '').trim(), han = String(du.Han || '').trim();
    if (!td) return { loi: 'Nhập tiêu đề khảo sát.' };
    if (td.length > 200) return { loi: 'Tiêu đề tối đa 200 ký tự.' };
    if (String(du.MoTa || '').length > 1000) return { loi: 'Mô tả tối đa 1.000 ký tự.' };
    if (String(du.DoiTuong || '').length > 200) return { loi: 'Đối tượng tối đa 200 ký tự.' };
    if (han) {
      const k = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(han);
      const dt = k ? new Date(+k[3], +k[2] - 1, +k[1]) : null;
      if (!dt || dt.getDate() !== +k[1] || dt.getMonth() !== +k[2] - 1) return { loi: 'Hạn phải dạng dd/mm/yyyy (VD 30/11/2026).' };
    }
    return { goi: { TieuDe: td, MoTa: String(du.MoTa || '').trim(), DoiTuong: String(du.DoiTuong || '').trim(), Han: han, NhieuLan: !!du.NhieuLan } };
  },

  /** THUẦN. Mã câu đã chọn (theo thứ tự) + ngân hàng ➜ cauHinh {cau:[{maCH, phienBan, batBuoc}], moiTrang} | {loi}. */
  cauHinhTu: function(chon, nganHang, moiTrang) {
    const theoMa = {};
    (nganHang || []).forEach(c => { theoMa[c.maCH] = c; });
    const da = {}, cau = [];
    for (const ma of (chon || [])) {
      if (da[ma]) continue;
      da[ma] = true;
      const c = theoMa[ma];
      if (!c) return { loi: 'Câu ' + ma + ' không còn trong ngân hàng – tải lại ngân hàng câu.' };
      cau.push({ maCH: c.maCH, phienBan: Number(c.phienBan) || 1, batBuoc: !!c.batBuoc });
    }
    return { cauHinh: { cau, moiTrang: moiTrang === 'catrang' ? 'catrang' : '1cau' } };
  },

  /** THUẦN. Kiểm form câu hỏi (khớp noiDungCau_ của KS) ➜ {goi} | {loi}. LuaChon: chuỗi nhiều dòng hoặc mảng. */
  kiemCau: function(du) {
    du = du || {};
    const loai = String(du.Loai || ''), nd = String(du.NoiDung || '').trim();
    if (!this.LOAI_CAU.some(x => x[0] === loai)) return { loi: 'Chọn loại câu hỏi.' };
    if (!nd) return { loi: 'Nhập nội dung câu hỏi.' };
    if (nd.length > 500) return { loi: 'Nội dung câu tối đa 500 ký tự.' };
    const lc = (Array.isArray(du.LuaChon) ? du.LuaChon : String(du.LuaChon || '').split(/\r?\n/)).map(x => String(x).trim()).filter(Boolean);
    const coLC = this.LOAI_CO_LUA_CHON.indexOf(loai) >= 0;
    if (coLC && lc.length < 2) return { loi: 'Câu chọn cần ít nhất 2 lựa chọn (mỗi dòng 1 lựa chọn).' };
    if (lc.length > 20) return { loi: 'Tối đa 20 lựa chọn.' };
    if (String(du.Nhom || '').length > 60) return { loi: 'Nhóm tối đa 60 ký tự.' };
    const goi = { Loai: loai, NoiDung: nd, LuaChon: coLC ? lc : [], BatBuoc: !!du.BatBuoc, Nhom: String(du.Nhom || '').trim() };
    if (du.maCH) goi.maCH = String(du.maCH);
    return { goi };
  },

  /** THUẦN. Kiểm form cấp quyền ➜ {goi} | {loi}. vaiTro '' = ngừng quyền. */
  kiemQuyen: function(du) {
    du = du || {};
    const ma = String(du.maNguoi || '').trim(), vai = String(du.vaiTro || '');
    if (!/^[A-Za-z0-9_-]{1,40}$/.test(ma)) return { loi: 'Mã người chỉ gồm chữ, số, - _ (tối đa 40).' };
    if (['Admin', 'QuanLyKS', ''].indexOf(vai) < 0) return { loi: 'Vai không hợp lệ.' };
    if (String(du.hoTen || '').length > 80) return { loi: 'Họ tên tối đa 80 ký tự.' };
    return { goi: { maNguoi: ma, hoTen: String(du.hoTen || '').trim(), vaiTro: vai } };
  },

  /** THUẦN. Nút đổi trạng thái hợp lệ cho 1 trạng thái ➜ [[trangThaiMoi, nhãn]]. */
  nutTrangThai: function(tt) {
    if (tt === 'Đang mở') return [['Đã đóng', '⏸ Đóng']];
    if (tt === 'Đã đóng') return [['Đang mở', '▶ Mở lại'], ['Nháp', '↩ Về nháp']];
    return [['Đang mở', '▶ Mở']];
  },

  coGhi: function() {
    if (SHIN_API.laCheDoLive() && this._d && this._d.live && SHIN_API.layToken()) return true;
    ShinApp.toast('Đang ở Demo – không ghi lên app Khảo sát.', 'info');
    return false;
  },
  /** Gọi KS, ném lỗi tiếng Việt nếu không được. */
  goiKS: async function(hanh, du) {
    const r = await SHIN_API.goi('KS', hanh, du || {});
    if (!r.ok) throw new Error(SHIN_API.moTaLoi(r));
    if (r.isDemo) throw new Error('Chưa có máy chủ Khảo sát – không ghi.');
    return r.data || {};
  },
  taiLai: function() { this._moQL = true; this._cau = null; ShinApp.chuyenModule('khaosat'); },
  dsQL: function() { return (this._d && this._d.khaoSat) || []; },

  moQuanLy: function() {
    const k = document.getElementById('ksQL');
    if (!k) return;
    k.open = true;
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  veQuanLy: function(d) {
    const e = ShinApp.esc, ks = d.khaoSat || [];
    const mauTT = { 'Đang mở': 'xanh', 'Nháp': 'vang', 'Đã đóng': 'xam' };
    return `
      <details class="tq-gon" id="ksQL" ${this._moQL ? 'open' : ''}>
        <summary><span>🛠️ Quản lý khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
        <div class="tc-form-hop">
          ${d.live ? '' : '<p class="chu-phu">Demo: thao tác thử được, không ghi lên app Khảo sát.</p>'}
          <div class="ks-ql-nut">
            <button class="btn-primary" onclick="ModuleKhaoSat.moFormKS(-1, this)">➕ Tạo khảo sát</button>
            <button class="btn-secondary" onclick="ModuleKhaoSat.moNganHang(this)">📚 Ngân hàng câu hỏi</button>
          </div>
          <div id="ksForm" class="ks-ql-khung" hidden></div>
          <div id="ksNH" class="ks-ql-khung" hidden></div>
          ${ks.map((x, i) => `
            <div class="the ks-ql-the">
              <div class="the-tin-dau"><b>${e(x.ten)}</b><span class="badge ${mauTT[x.trangThai] || 'xam'}">${e(x.trangThai || 'Nháp')}</span></div>
              <div class="chu-phu">${e([x.ma, (x.soCau || 0) + ' câu', x.dongLuc ? 'hạn ' + x.dongLuc : '', x.nhieuLan ? 'trả lời nhiều lần' : ''].filter(Boolean).join(' · '))}</div>
              <div class="ks-ql-the-nut">
                ${this.nutTrangThai(x.trangThai).map(n => `<button class="btn-primary" onclick="ModuleKhaoSat.doiTrangThai(${i}, '${n[0]}', this)">${n[1]}</button>`).join('')}
                <button class="btn-secondary" onclick="ModuleKhaoSat.moFormKS(${i}, this)">✏️ Sửa</button>
                <button class="btn-secondary" onclick="ModuleKhaoSat.nhanBan(${i}, this)">⧉ Nhân bản</button>
                <button class="btn-secondary nut-do" onclick="ModuleKhaoSat.xoaKS(${i}, this)" aria-label="Xóa khảo sát ${e(x.ten)}">🗑 Xóa</button>
              </div>
            </div>`).join('')}
          ${ks.length ? '' : '<div class="trong">Chưa có khảo sát – bấm ➕ Tạo khảo sát.</div>'}
          <details class="tq-gon">
            <summary><span>🔑 Cấp quyền quản lý khảo sát (Admin)</span></summary>
            <div class="tc-form-hop">
              <div class="tc-form-hang-doi">
                <div class="tc-form-nhom"><label class="nhan-o" for="ksqMa">Mã người (Hub) *</label><input id="ksqMa" class="form-input" maxlength="40" autocomplete="off"></div>
                <div class="tc-form-nhom"><label class="nhan-o" for="ksqTen">Họ tên</label><input id="ksqTen" class="form-input" maxlength="80" autocomplete="off"></div>
              </div>
              <div class="tc-form-nhom"><label class="nhan-o" for="ksqVai">Vai</label>
                <select id="ksqVai" class="form-input"><option value="QuanLyKS">Quản lý khảo sát (chỉ khảo sát có tên mình)</option><option value="Admin">Admin (mọi khảo sát)</option><option value="">Ngừng quyền</option></select></div>
              <button class="btn-primary" onclick="ModuleKhaoSat.luuQuyen(this)">💾 Lưu quyền</button>
            </div>
          </details>
          ${typeof ModuleKsNhapHo !== 'undefined' ? ModuleKsNhapHo.veKhoi(d) : ''}
          ${typeof ModuleKsQR !== 'undefined' ? ModuleKsQR.veKhoi(d) : ''}
          <p class="chu-phu">Câu đã có người trả lời khi sửa sẽ thành phiên bản mới, khảo sát cũ giữ bản trước.</p>
        </div>
      </details>`;
  },

  /** Đổi trạng thái khảo sát i: Toast Hoàn tác 6s ➜ webDoiTrangThaiKS đúng 1 lần. */
  doiTrangThai: function(i, tt, nut) {
    const x = this.dsQL()[i];
    if (!x || this.TRANG_THAI.indexOf(tt) < 0 || !this.coGhi()) return;
    if (this._dangDoi) return;
    this._dangDoi = true;
    const khoa = on => { if (nut && nut.isConnected) nut.disabled = on; };
    ShinApp.hanhDongHoanTac('Sẽ chuyển «' + x.ten + '»: ' + (x.trangThai || 'Nháp') + ' → ' + tt + '.', {
      lamTruoc: () => khoa(true),
      traLai: () => { this._dangDoi = false; khoa(false); },
      thucHien: async () => {
        const r = await this.goiKS('webDoiTrangThaiKS', { maKS: x.ma, trangThai: tt });
        this._dangDoi = false;
        ShinApp.toast(r.msg || 'Đã đổi trạng thái.', 'success');
        this.taiLai();
      }
    });
  },

  /** Xóa mềm khảo sát i: Toast Hoàn tác 6s ➜ webXoaKS. */
  xoaKS: function(i, nut) {
    const x = this.dsQL()[i];
    if (!x || !this.coGhi() || this._dangXoa) return;
    this._dangXoa = true;
    const khoa = on => { if (nut && nut.isConnected) nut.disabled = on; };
    ShinApp.hanhDongHoanTac('Sẽ xóa «' + x.ten + '».', {
      lamTruoc: () => khoa(true),
      traLai: () => { this._dangXoa = false; khoa(false); },
      thucHien: async () => {
        const r = await this.goiKS('webXoaKS', { maKS: x.ma });
        this._dangXoa = false;
        ShinApp.toast(r.msg || 'Đã xóa.', 'success');
        this.taiLai();
      }
    });
  },

  nhanBan: async function(i, nut) {
    const x = this.dsQL()[i];
    if (!x || !this.coGhi()) return;
    const r = await ShinApp.goiNut(nut, 'Đang nhân bản…', () => this.goiKS('webNhanBanKS', { maKS: x.ma }), 'ks-nb-' + x.ma);
    if (!r) return;
    ShinApp.toast(r.msg || 'Đã nhân bản.', 'success');
    this.taiLai();
  },

  /** Tải ngân hàng câu (Live: webDsCauHoi · Demo: mẫu). Lỗi ➜ ném, KHÔNG thay bằng mẫu. */
  taiNganHang: async function() {
    if (this._cau) return this._cau;
    if (!(this._d && this._d.live)) { this._cau = ((window.SHIN_DEMO_DATA.khaosat || {}).cauHoi || []).slice(); return this._cau; }
    const r = await this.goiKS('webDsCauHoi', {});
    this._cau = r.ds || [];
    return this._cau;
  },

  /** Mở form tạo (i = -1) / sửa khảo sát i, kèm chọn câu từ ngân hàng. */
  moFormKS: async function(i, nut) {
    const k = document.getElementById('ksForm');
    if (!k) return;
    const x = i >= 0 ? this.dsQL()[i] : null;
    let nh;
    try { nh = await ShinApp.goiNut(nut, 'Đang tải câu…', () => this.taiNganHang(), 'ks-nh'); } catch (er) { nh = null; }
    const e = ShinApp.esc, ch = (x && x.cauHinh) || { cau: [], moiTrang: '1cau' };
    const daChon = (ch.cau || []).map(c => c.maCH);
    const thuTu = nh ? daChon.map(m => nh.find(c => c.maCH === m)).filter(Boolean).concat(nh.filter(c => daChon.indexOf(c.maCH) < 0)) : [];
    const tenLoai = l => (this.LOAI_CAU.find(t => t[0] === l) || [l, l])[1];

    let demSTT = 0;
    const renderDongCau = c => {
      const isChecked = daChon.indexOf(c.maCH) >= 0;
      const stt = isChecked ? ++demSTT : '–';
      const chkId = 'ks_cau_' + e(c.maCH);
      return `
        <div class="ks-ql-dong-cau ${isChecked ? 'da-chon' : ''}" data-mach="${e(c.maCH)}">
          <div class="ks-ql-cot-chon">
            <span class="ks-ql-stt">${stt}</span>
            <input type="checkbox" id="${chkId}" class="ksChonCau" value="${e(c.maCH)}" ${isChecked ? 'checked' : ''} onchange="ModuleKhaoSat.doiChonCau(this)">
          </div>
          <label class="ks-ql-noi-dung" for="${chkId}">
            <span class="ks-ql-cau-nd">${e(c.noiDung)}</span>
            <span class="chu-phu ks-ql-cau-phu">${e([c.maCH + ' v' + (c.phienBan || 1), tenLoai(c.loai), c.nhom, c.batBuoc ? 'bắt buộc' : ''].filter(Boolean).join(' · '))}</span>
          </label>
          <div class="ks-ql-cot-nut">
            <button type="button" class="btn-secondary ks-ql-nut-len" onclick="ModuleKhaoSat.diChuyenCau(this, -1)" title="Chuyển câu lên" aria-label="Chuyển câu lên">▲</button>
            <button type="button" class="btn-secondary ks-ql-nut-xuong" onclick="ModuleKhaoSat.diChuyenCau(this, 1)" title="Chuyển câu xuống" aria-label="Chuyển câu xuống">▼</button>
          </div>
        </div>`;
    };

    k.innerHTML = `
      <div class="hn-tieu"><span>${x ? '✏️ SỬA ' + e(x.ma) : '➕ KHẢO SÁT MỚI'}</span></div>
      <div class="tc-form-nhom"><label class="nhan-o" for="ksTD">Tiêu đề *</label><input id="ksTD" class="form-input" maxlength="200" value="${e(x ? x.ten : '')}"></div>
      <div class="tc-form-nhom"><label class="nhan-o" for="ksMT">Mô tả (hiện đầu phiếu)</label><textarea id="ksMT" class="form-input" rows="2" maxlength="1000">${e(x ? x.moTa : '')}</textarea></div>
      <div class="tc-form-hang-doi">
        <div class="tc-form-nhom"><label class="nhan-o" for="ksDT">Đối tượng</label><input id="ksDT" class="form-input" maxlength="200" value="${e(x ? x.doiTuong : '')}" placeholder="VD: Người bệnh ngoại trú"></div>
        <div class="tc-form-nhom"><label class="nhan-o" for="ksHan">Hạn (dd/mm/yyyy)</label><input id="ksHan" class="form-input" inputmode="numeric" maxlength="10" value="${e(x ? x.dongLuc : '')}" placeholder="VD: 30/11/2026"></div>
      </div>
      <div class="tc-form-hang-doi">
        <label class="ks-ql-chon"><input type="checkbox" id="ksNL" ${x && x.nhieuLan ? 'checked' : ''}><span>Cho trả lời nhiều lần</span></label>
        <div class="tc-form-nhom"><label class="nhan-o" for="ksMTr">Cách hiện câu</label><select id="ksMTr" class="form-input"><option value="1cau">1 câu / trang</option><option value="catrang" ${ch.moiTrang === 'catrang' ? 'selected' : ''}>Cả trang</option></select></div>
      </div>
      <div class="hn-tieu"><span>CÂU HỎI · tick để đưa vào khảo sát</span></div>
      ${nh ? `<div class="ks-ql-cau">${thuTu.map(renderDongCau).join('') || '<div class="trong">Ngân hàng chưa có câu – mở 📚 Ngân hàng câu hỏi để thêm.</div>'}</div>`
        : '<div class="ks-ql-loi">Chưa tải được ngân hàng câu hỏi – vẫn lưu được phần thông tin, giữ nguyên câu đang có.</div>'}
      <div class="ks-ql-nut">
        <button class="btn-primary" onclick="ModuleKhaoSat.luuKS(${i}, this)">💾 Lưu khảo sát</button>
        <button class="btn-secondary" onclick="document.getElementById('ksForm').hidden = true">Đóng</button>
      </div>`;
    k.hidden = false;
    this.capNhatThuTuCauKS();
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  doiChonCau: function(chk) {
    const dong = chk.closest('.ks-ql-dong-cau');
    if (dong) {
      if (chk.checked) dong.classList.add('da-chon');
      else dong.classList.remove('da-chon');
    }
    this.capNhatThuTuCauKS();
  },

  diChuyenCau: function(nut, huong) {
    const dong = nut.closest('.ks-ql-dong-cau');
    if (!dong) return;
    const cha = dong.parentElement;
    if (huong === -1) {
      const truoc = dong.previousElementSibling;
      if (truoc && truoc.classList.contains('ks-ql-dong-cau')) {
        cha.insertBefore(dong, truoc);
      }
    } else if (huong === 1) {
      const sau = dong.nextElementSibling;
      if (sau && sau.classList.contains('ks-ql-dong-cau')) {
        cha.insertBefore(sau, dong);
      }
    }
    this.capNhatThuTuCauKS();
  },

  capNhatThuTuCauKS: function() {
    const container = document.querySelector('#ksForm .ks-ql-cau');
    if (!container) return;
    const dongs = Array.from(container.querySelectorAll('.ks-ql-dong-cau'));
    let stt = 0;
    const dongsChon = [];
    dongs.forEach(d => {
      const chk = d.querySelector('.ksChonCau');
      const sttEl = d.querySelector('.ks-ql-stt');
      if (chk && chk.checked) {
        stt++;
        if (sttEl) sttEl.textContent = stt;
        d.classList.add('da-chon');
        dongsChon.push(d);
      } else {
        if (sttEl) sttEl.textContent = '–';
        d.classList.remove('da-chon');
      }
    });
    dongs.forEach(d => {
      const len = d.querySelector('.ks-ql-nut-len');
      const xuong = d.querySelector('.ks-ql-nut-xuong');
      const idxChon = dongsChon.indexOf(d);
      if (idxChon < 0) {
        if (len) len.disabled = true;
        if (xuong) xuong.disabled = true;
      } else {
        if (len) len.disabled = (idxChon === 0);
        if (xuong) xuong.disabled = (idxChon === dongsChon.length - 1);
      }
    });
  },

  luuKS: async function(i, nut) {
    const x = i >= 0 ? this.dsQL()[i] : null;
    const v = id => (document.getElementById(id) || {}).value || '';
    const kq = this.kiemKS({ TieuDe: v('ksTD'), MoTa: v('ksMT'), DoiTuong: v('ksDT'), Han: v('ksHan'), NhieuLan: (document.getElementById('ksNL') || {}).checked });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    let cauHinh;
    if (this._cau && document.querySelector('.ksChonCau, #ksForm .ks-ql-cau')) {
      const chon = Array.from(document.querySelectorAll('.ksChonCau')).filter(o => o.checked).map(o => o.value);
      const ch = this.cauHinhTu(chon, this._cau, v('ksMTr'));
      if (ch.loi) return ShinApp.toast(ch.loi, 'error');
      cauHinh = ch.cauHinh;
    }
    if (!this.coGhi()) return;
    const r = await ShinApp.goiNut(nut, 'Đang lưu…', async () => {
      let ks = x ? null : (await this.goiKS('webLuuKhaoSat', kq.goi)).ks;
      const ma = x ? x.ma : ks && ks.maKS;
      if (!ma) throw new Error('KS chưa trả mã khảo sát.');
      if (x || (cauHinh && cauHinh.cau.length)) {
        const du = Object.assign({ maKS: ma }, x ? kq.goi : {}, cauHinh ? { cauHinh } : {});
        try { ks = (await this.goiKS('webLuuKhaoSat', du)).ks; }
        catch (er) { if (!x) throw new Error('Đã tạo ' + ma + ' nhưng chưa lưu câu hỏi: ' + er.message + ' – bấm ✏️ Sửa để chọn lại câu.'); throw er; }
      }
      return ks || { maKS: ma };
    }, 'ks-luu');
    if (!r) return;
    ShinApp.toast((x ? 'Đã lưu ' : 'Đã tạo ') + (r.maKS || '') + ' · ' + (r.soCau || 0) + ' câu.', 'success');
    this.taiLai();
  },

  /** Ngân hàng câu: danh sách + form thêm / sửa câu. */
  moNganHang: async function(nut) {
    const k = document.getElementById('ksNH');
    if (!k) return;
    const nh = await ShinApp.goiNut(nut, 'Đang tải câu…', () => this.taiNganHang(), 'ks-nh');
    if (!nh) { k.innerHTML = '<div class="ks-ql-loi">Chưa tải được ngân hàng câu hỏi – bấm lại 📚.</div>'; k.hidden = false; return; }
    const e = ShinApp.esc;
    this._nhLoc = { tim: '', nhom: '', loai: '' };

    const dsNhom = [...new Set((this._cau || []).map(x => x.nhom).filter(Boolean))];
    const dsLoai = this.LOAI_CAU || [];

    k.innerHTML = `
      <div class="hn-tieu"><span>📚 NGÂN HÀNG CÂU HỎI · ${nh.length}</span></div>
      <div id="ksCauForm" class="ks-ql-khung"></div>
      <div class="ks-ql-nut">
        <button class="btn-primary" onclick="ModuleKhaoSat.moFormCau(-1)">➕ Thêm câu hỏi</button>
        <button class="btn-secondary" onclick="document.getElementById('ksNH').hidden = true">Đóng</button>
      </div>
      <div class="ks-ql-nh-tim">
        <input id="ksNhTim" class="form-input ks-ql-nh-o" placeholder="🔍 Tìm theo nội dung, mã, nhóm…" oninput="ModuleKhaoSat.locNganHang()">
      </div>
      <div class="ks-ql-chip-nhom">
        <span class="ks-ql-chip-label">Nhóm (Trụ ACHSI):</span>
        <div class="ks-ql-chip-hang" id="ksNhChipNhom">
          <button type="button" class="ks-ql-chip active" onclick="ModuleKhaoSat.chonChipNH('nhom', '', this)">Tất cả</button>
          ${dsNhom.map(n => `<button type="button" class="ks-ql-chip" onclick="ModuleKhaoSat.chonChipNH('nhom', '${e(n)}', this)">${e(n)}</button>`).join('')}
        </div>
      </div>
      <div class="ks-ql-chip-nhom">
        <span class="ks-ql-chip-label">Loại câu:</span>
        <div class="ks-ql-chip-hang" id="ksNhChipLoai">
          <button type="button" class="ks-ql-chip active" onclick="ModuleKhaoSat.chonChipNH('loai', '', this)">Tất cả</button>
          ${dsLoai.map(t => `<button type="button" class="ks-ql-chip" onclick="ModuleKhaoSat.chonChipNH('loai', '${e(t[0])}', this)">${e(t[1])}</button>`).join('')}
        </div>
      </div>
      <div class="ks-ql-nh-thongke" id="ksNhThongKe">Hiển thị ${nh.length} / ${nh.length} câu hỏi</div>
      <div class="ks-ql-nh-cau" id="ksNhDs"></div>`;
    k.hidden = false;
    this.locNganHang();
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  chonChipNH: function(kieu, giaTri, nut) {
    if (!this._nhLoc) this._nhLoc = { tim: '', nhom: '', loai: '' };
    this._nhLoc[kieu] = giaTri;
    const hang = nut ? nut.parentElement : null;
    if (hang) {
      Array.from(hang.querySelectorAll('.ks-ql-chip')).forEach(c => c.classList.remove('active'));
      nut.classList.add('active');
    }
    this.locNganHang();
  },

  locNganHang: function() {
    const dsContainer = document.getElementById('ksNhDs');
    const thongKe = document.getElementById('ksNhThongKe');
    if (!dsContainer) return;
    const timInput = document.getElementById('ksNhTim');
    const tuKhoa = (timInput ? timInput.value : '').trim();
    if (!this._nhLoc) this._nhLoc = { tim: '', nhom: '', loai: '' };
    this._nhLoc.tim = tuKhoa;

    const nh = this._cau || [];
    const boDau = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const tkNorm = boDau(tuKhoa);

    const kq = nh.filter(c => {
      if (this._nhLoc.nhom && c.nhom !== this._nhLoc.nhom) return false;
      if (this._nhLoc.loai && c.loai !== this._nhLoc.loai) return false;
      if (tkNorm) {
        const full = boDau((c.noiDung || '') + ' ' + (c.maCH || '') + ' ' + (c.nhom || ''));
        if (!full.includes(tkNorm)) return false;
      }
      return true;
    });

    if (thongKe) {
      thongKe.textContent = `Hiển thị ${kq.length} / ${nh.length} câu hỏi`;
    }

    const e = ShinApp.esc, tenLoai = l => (this.LOAI_CAU.find(t => t[0] === l) || [l, l])[1];
    if (!kq.length) {
      dsContainer.innerHTML = '<div class="trong">Không tìm thấy câu hỏi phù hợp với bộ lọc.</div>';
      return;
    }

    dsContainer.innerHTML = kq.map(c => {
      const j = nh.indexOf(c);
      return `
        <div class="hang-tru ks-ql-nh-dong">
          <div class="ks-ql-nh-nd">
            <span class="ks-ql-cau-nd">${e(c.noiDung)}</span><br>
            <span class="chu-phu ks-ql-cau-phu">${e([c.maCH + ' v' + (c.phienBan || 1), tenLoai(c.loai), c.nhom, c.batBuoc ? 'bắt buộc' : 'không bắt buộc'].filter(Boolean).join(' · '))}</span>
          </div>
          ${c.suaDuoc || !(this._d && this._d.live)
            ? `<button class="btn-secondary ks-ql-nho" onclick="ModuleKhaoSat.moFormCau(${j})">✏️ Sửa</button>`
            : `<button class="btn-secondary ks-ql-nho" onclick="ModuleKhaoSat.nhanBanCau(${j}, this)" title="Câu người khác tạo – nhân bản để sửa">⧉ Nhân bản</button>`}
        </div>`;
    }).join('');
  },

  moFormCau: function(j) {
    const k = document.getElementById('ksCauForm');
    if (!k) return;
    const c = j >= 0 ? (this._cau || [])[j] : null, e = ShinApp.esc;
    const nhom = [...new Set((this._cau || []).map(x => x.nhom).filter(Boolean))];
    const loai = c ? c.loai : '5muc';
    k.innerHTML = `
      <div class="tc-form-hang-doi">
        <div class="tc-form-nhom"><label class="nhan-o" for="kcLoai">Loại câu *</label><select id="kcLoai" class="form-input" onchange="ModuleKhaoSat.doiLoaiCau()">${this.LOAI_CAU.map(t => `<option value="${t[0]}" ${t[0] === loai ? 'selected' : ''}>${t[1]}</option>`).join('')}</select></div>
        <div class="tc-form-nhom"><label class="nhan-o" for="kcNhom">Nhóm (trụ ACHSI)</label><input id="kcNhom" class="form-input" maxlength="60" list="kcDsNhom" value="${e(c ? c.nhom : '')}"><datalist id="kcDsNhom">${nhom.map(n => `<option value="${e(n)}">`).join('')}</datalist></div>
      </div>
      <div class="tc-form-nhom"><label class="nhan-o" for="kcND">Nội dung câu *</label><textarea id="kcND" class="form-input" rows="2" maxlength="500">${e(c ? c.noiDung : '')}</textarea></div>
      <div id="kcOLC" class="tc-form-nhom" ${this.LOAI_CO_LUA_CHON.indexOf(loai) >= 0 ? '' : 'hidden'}><label class="nhan-o" for="kcLC">Lựa chọn (mỗi dòng 1, ≥ 2)</label><textarea id="kcLC" class="form-input" rows="3">${e(c ? (c.luaChon || []).join('\n') : '')}</textarea></div>
      <label class="ks-ql-chon"><input type="checkbox" id="kcBB" ${c ? (c.batBuoc ? 'checked' : '') : 'checked'}><span>Bắt buộc trả lời</span></label>
      <div class="ks-ql-nut"><button class="btn-primary" onclick="ModuleKhaoSat.luuCau(${j}, this)">💾 ${c ? 'Lưu câu ' + e(c.maCH) : 'Thêm vào ngân hàng'}</button>
        <button class="btn-secondary" onclick="document.getElementById('ksCauForm').innerHTML = ''">Hủy</button></div>`;
    k.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  doiLoaiCau: function() {
    const o = document.getElementById('kcOLC'), l = (document.getElementById('kcLoai') || {}).value;
    if (o) o.hidden = this.LOAI_CO_LUA_CHON.indexOf(l) < 0;
  },

  luuCau: async function(j, nut) {
    const c = j >= 0 ? (this._cau || [])[j] : null;
    const v = id => (document.getElementById(id) || {}).value || '';
    const kq = this.kiemCau({ maCH: c ? c.maCH : '', Loai: v('kcLoai'), NoiDung: v('kcND'), LuaChon: v('kcLC'), Nhom: v('kcNhom'), BatBuoc: (document.getElementById('kcBB') || {}).checked });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    if (!this.coGhi()) return;
    const r = await ShinApp.goiNut(nut, 'Đang lưu…', () => this.goiKS('webLuuCauHoi', kq.goi), 'ks-cau');
    if (!r) return;
    ShinApp.toast(r.msg || 'Đã lưu câu hỏi.', 'success');
    this._cau = null;
    this.moNganHang();
  },

  nhanBanCau: async function(j, nut) {
    const c = (this._cau || [])[j];
    if (!c || !this.coGhi()) return;
    const r = await ShinApp.goiNut(nut, 'Đang nhân bản…', () => this.goiKS('webNhanBanCau', { maCH: c.maCH }), 'ks-nbc-' + c.maCH);
    if (!r) return;
    ShinApp.toast(r.msg || 'Đã nhân bản câu.', 'success');
    this._cau = null;
    this.moNganHang();
  },

  /** Cấp / bỏ vai (chỉ Admin – máy chủ KS kiểm): Toast Hoàn tác 6s ➜ webLuuQuyen. */
  luuQuyen: function(nut) {
    const v = id => (document.getElementById(id) || {}).value || '';
    const kq = this.kiemQuyen({ maNguoi: v('ksqMa'), hoTen: v('ksqTen'), vaiTro: v('ksqVai') });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    if (!this.coGhi() || this._dangQuyen) return;
    this._dangQuyen = true;
    const g = kq.goi, khoa = on => { if (nut && nut.isConnected) nut.disabled = on; };
    ShinApp.hanhDongHoanTac(g.vaiTro ? 'Sẽ cấp vai ' + g.vaiTro + ' cho ' + (g.hoTen || g.maNguoi) + '.' : 'Sẽ ngừng quyền của ' + (g.hoTen || g.maNguoi) + '.', {
      lamTruoc: () => khoa(true),
      traLai: () => { this._dangQuyen = false; khoa(false); },
      thucHien: async () => {
        try {
          const r = await this.goiKS('webLuuQuyen', g);
          ShinApp.toast(r.msg || 'Đã lưu quyền.', 'success');
        } finally { this._dangQuyen = false; khoa(false); }
      }
    });
  },

  guiKhaoSat: function() { ShinApp.moV1('KS', 'Khảo sát'); },
  xuatBaoCao: function() { ShinApp.moV1('KS', 'Khảo sát'); }
};
