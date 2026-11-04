/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat v1.4.3).
 * v2.6.6: v1 KHÔNG có `webTongQuan` ➜ dùng cổng thật trong congWeb_ (tên cổng v1 là trọng tài), du là ĐỐI TƯỢNG:
 *   webDsKhaoSat({})             ➜ {ok, ds:[{maKS, tieuDe, moTa, doiTuong, trangThai:'Nháp'|'Đang mở'|'Đã đóng', han, soCau, ngayTao}], dem:{dangMo, nhap, daDong}}
 *   webKetQuaKS({maKS, nguon, tu, den}) ➜ {ok, maKS, tieuDe, soPhieu, choXacMinh, theoNgay:[{ngay, n}],
 *                                         cau:[{maCH, phienBan, loai, noiDung, n, tb?, tyLe?:{lựaChọn:%}, nps?, yKien?:[chữ], anLienHe?}]}
 *   webXuatKS({maKS, kieu:'csv'}) ➜ {ok, csv, tenTep, msg}  (CSV UTF-8 có BOM, tải về máy)
 *   Câu 'lienhe' v1 tự ẩn khi người xem không phải Quản lý KS đó (QK4) – v2 không hiện thêm gì.
 * Soạn / mở / đóng khảo sát vẫn làm trên app KS v1 (nút mở app).
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',

  _live: false,
  _ds: null,
  _kq: {},          // maKS ➜ kết quả đã tải
  _loc: 'Đang mở',

  taiLive: async function() {
    const kq = await SHIN_API.goi('KS', 'webDsKhaoSat', {});
    if (!kq.ok) return kq;
    this._kq = {};
    return { ok: true, data: Object.assign({ live: true }, kq.data || {}) };
  },

  mauDiem: function(tb) { return tb === null || tb === undefined ? 'var(--c-gray)' : tb >= 4.5 ? 'var(--c-green)' : tb >= 4 ? 'var(--c-yellow)' : 'var(--c-red)'; },

  render: function(container, data) {
    this._live = !!(data && data.live);
    const d = this._live ? data : ((window.SHIN_DEMO_DATA || {}).khaosat || {});
    if (!this._live) this._kq = {};
    this._ds = d.ds || [];
    const e = ShinApp.esc, so = ShinApp.soVN, dem = d.dem || {};
    const LOC = [['Đang mở', dem.dangMo], ['Nháp', dem.nhap], ['Đã đóng', dem.daDong], ['', this._ds.length]];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🩺 Khảo Sát Hài Lòng</div>
          <div class="page-sub">Kết quả theo câu · Xuất CSV</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Trải nghiệm khách hàng 🩺</div>
          <div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${so(dem.dangMo || 0)}</div><div class="tq-nhan">Đang mở</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-yellow)">${so(dem.nhap || 0)}</div><div class="tq-nhan">Nháp</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-gray)">${so(dem.daDong || 0)}</div><div class="tq-nhan">Đã đóng</div></div>
        </div>
        <button class="btn-primary" onclick="ShinApp.moV1('KS', 'Quản lý khảo sát')">📝 Soạn / mở khảo sát trên app KS</button>
      </div>

      <div class="hang-tab" role="tablist">
        ${LOC.map(l => `<button class="tab-nut ${this._loc === l[0] ? 'dang-chon' : ''}" role="tab" data-loc="${e(l[0])}" onclick="ModuleKhaoSat.chonLoc(this.dataset.loc)">${l[0] ? e(l[0]) : 'Tất cả'} · ${so(l[1] || 0)}</button>`).join('')}
      </div>
      <div id="ksDs"></div>

      <details class="tq-gon">
        <summary><span>ⓘ Quy ước</span></summary>
        <p class="chu-phu">Bấm 1 khảo sát để xem kết quả theo câu. Câu liên hệ chỉ hiện với Quản lý của khảo sát đó (app KS tự ẩn). Soạn, mở, đóng khảo sát làm trên app KS.</p>
      </details>
    `;
    this.veDs();
  },

  chonLoc: function(loc) {
    this._loc = loc;
    document.querySelectorAll('.hang-tab .tab-nut').forEach(b => b.classList.toggle('dang-chon', b.dataset.loc === loc));
    this.veDs();
  },

  veDs: function() {
    const o = document.getElementById('ksDs');
    if (!o) return;
    const e = ShinApp.esc;
    const ds = (this._ds || []).map((x, i) => [x, i]).filter(p => !this._loc || p[0].trangThai === this._loc);
    const mauTT = { 'Đang mở': 'xanh', 'Nháp': 'vang', 'Đã đóng': 'xam' };
    o.innerHTML = ds.length ? ds.map(([x, i]) => `
      <details class="the chi-tiet-gon" ontoggle="if(this.open) ModuleKhaoSat.moKetQua(${i}, this)">
        <summary><span>${e(x.tieuDe)}</span></summary>
        <div class="chu-phu">${e([x.maKS, x.doiTuong, x.soCau ? x.soCau + ' câu' : '', x.han ? 'hạn ' + x.han : ''].filter(Boolean).join(' · '))} <span class="badge ${mauTT[x.trangThai] || 'xam'}">${e(x.trangThai)}</span></div>
        <div class="ks-kq"></div>
      </details>`).join('') : '<div class="trong">Không có khảo sát ở mục này.</div>';
  },

  moKetQua: async function(i, el) {
    const x = (this._ds || [])[i], o = el.querySelector('.ks-kq');
    if (!x || !o || o.dataset.da) return;
    o.dataset.da = '1';
    let k = this._kq[x.maKS];
    if (!k) {
      if (!this._live) k = ((window.SHIN_DEMO_DATA || {}).khaosat || {}).ketQua || {};
      else {
        o.innerHTML = '<div class="chu-phu">Đang tải kết quả…</div>';
        const kq = await SHIN_API.goi('KS', 'webKetQuaKS', { maKS: x.maKS });
        if (!kq.ok) { o.innerHTML = `<div class="canh-bao-nguon loi">⚠️ ${ShinApp.esc(SHIN_API.moTaLoi(kq))}</div>`; delete o.dataset.da; return; }
        k = kq.data || {};
      }
      this._kq[x.maKS] = k;
    }
    o.innerHTML = this.veKetQua(k, i);
  },

  veKetQua: function(k, i) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const cau = k.cau || [];
    const max = Math.max(1, ...(k.theoNgay || []).map(n => n.n || 0));
    const dong = c => {
      let than = '';
      if (c.tb !== undefined && c.tb !== null) than += `<div class="hang-tru"><span>Điểm trung bình</span><b style="color:${this.mauDiem(c.tb)}">${e(String(c.tb).replace('.', ','))}</b></div>`;
      if (c.nps !== undefined && c.nps !== null) than += `<div class="hang-tru"><span>NPS</span><b style="color:${c.nps >= 50 ? 'var(--c-green)' : c.nps >= 0 ? 'var(--c-yellow)' : 'var(--c-red)'}">${so(c.nps)}</b></div>`;
      if (c.tyLe && typeof c.tyLe === 'object') than += Object.keys(c.tyLe).map(l => `
        <div class="chu-phu">${e(l)} · ${e(String(c.tyLe[l]).replace('.', ','))}%</div>
        <div class="thanh-tien"><div style="width:${Math.max(0, Math.min(100, Number(c.tyLe[l]) || 0))}%"></div></div>`).join('');
      if (c.anLienHe) than += '<div class="chu-phu">🔒 Thông tin liên hệ chỉ Quản lý khảo sát xem.</div>';
      else if (Array.isArray(c.yKien) && c.yKien.length) than += `<div class="nhat-ky">${c.yKien.slice(-10).reverse().map(y => `<div>${e(y)}</div>`).join('')}</div>`;
      return `<div class="the"><div class="dong-title">${e(c.noiDung)}${c.phienBan > 1 ? ` <span class="chu-phu">(bản ${so(c.phienBan)})</span>` : ''}</div><div class="chu-phu">${so(c.n || 0)} trả lời</div>${than}</div>`;
    };
    return `
      <div class="luoi-o-so">
        <div class="o-so-loc"><b style="color:var(--c-blue)">${so(k.soPhieu || 0)}</b>Phiếu hợp lệ</div>
        <div class="o-so-loc"><b style="color:var(--c-yellow)">${so(k.choXacMinh || 0)}</b>Chờ xác minh</div>
      </div>
      ${(k.theoNgay || []).length ? `<div class="chu-phu">Phiếu theo ngày (gần nhất)</div>
        ${(k.theoNgay || []).slice(-7).map(n => `<div class="hang-tru"><span>${e(n.ngay)}</span><span class="chu-phu">${so(n.n)}</span></div>
        <div class="thanh-tien"><div style="width:${Math.round((n.n || 0) / max * 100)}%"></div></div>`).join('')}` : ''}
      ${cau.map(dong).join('')}
      ${cau.length ? '' : '<div class="trong">Chưa có câu hỏi / phiếu.</div>'}
      <div class="hang-nut"><button class="btn-secondary" onclick="ModuleKhaoSat.xuatCSV(${i}, this)">⬇️ Xuất CSV</button></div>`;
  },

  xuatCSV: async function(i, nut) {
    const x = (this._ds || [])[i];
    if (!x) return;
    if (!this._live) { ShinApp.toast('Xuất CSV (mẫu) – bản Live tải tệp thật về máy.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang xuất', async () => {
      const r = await SHIN_API.goi('KS', 'webXuatKS', { maKS: x.maKS, kieu: 'csv' });
      if (!r.ok) throw new Error(SHIN_API.moTaLoi(r));
      return r.data || {};
    }, 'ksXuat' + i);
    if (!kq || !kq.csv) return;
    const url = URL.createObjectURL(new Blob([kq.csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = kq.tenTep || ('khao-sat-' + x.maKS + '.csv');
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
};
