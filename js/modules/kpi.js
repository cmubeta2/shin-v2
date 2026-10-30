/**
 * SHIN v2 – Mảng 1: KPI Toàn Viện (Ban Kiểm Soát)
 * Live: máy chủ 30_KPI_ToanVien – webBanTin(lamMoi) đọc TV3 (chỉ đọc, đệm 6 giờ).
 * v2.3.0: 🔎 Soát lỗi chốt quý (webSoatLoi) · 🎯 Phân bổ AOP (webAOP) · 📄 Nháp báo cáo quý (webBaoCaoQuy – Admin) – BKS / Admin (webKhoiDong.xemAOP).
 */

const ModuleKPI = {
  ma: 'kpi',
  ten: 'KPI Toàn Viện',
  bieuTuong: '📊',
  paletteMacDinh: 'crimson',
  mayChu: 'KPI',

  _d: null,

  MAU: { xanh: 'var(--c-green)', vang: 'var(--c-yellow)', do: 'var(--c-red)', xam: 'var(--c-gray)' },

  taiLive: async function(lamMoi) {
    const [kq, kd] = await Promise.all([SHIN_API.goiCong('KPI', 'webBanTin', !!lamMoi), SHIN_API.goiCong('KPI', 'webKhoiDong')]);
    if (!kq.ok) return kq;
    const d = this.tuV1(kq.data);
    d.xemAOP = !!(kd.ok && kd.data && kd.data.xemAOP);
    return { ok: true, data: d };
  },

  mauTheoDiem: function(v) {
    return v === null || v === undefined ? 'xam' : v >= 0.9 ? 'xanh' : v >= 0.8 ? 'vang' : 'do';
  },

  /** THUẦN. Bản tin v1 (banTinTuDuLieu) ➜ khuôn màn KPI v2. Tiền trong AOP tính bằng tỷ đồng. */
  tuV1: function(b) {
    b = b || {};
    const vien = b.vien || {};
    const khoa = b.khoa || [];
    const aop = b.aop || null;
    const canChuY = khoa.filter(k => k.mau === 'do' || k.mau === 'vang').length;
    return {
      live: true,
      hero: {
        chao: 'BKS – Giám sát KPI Toàn Viện 🎯',
        ngay: `${b.nhanQuy || ''}${b.capNhatLuc ? ' · số TV3 lúc ' + b.capNhatLuc : ''}`,
        so: [
          { nhan: 'KPI viện tạm tính', giaTri: ShinApp.ptVN(vien.tamTinh), mau: this.MAU[this.mauTheoDiem(vien.tamTinh)] },
          { nhan: 'Khoa cần chú ý', giaTri: ShinApp.soVN(canChuY), mau: canChuY ? 'var(--c-yellow)' : 'var(--c-green)' },
          { nhan: 'Doanh thu / KH lũy kế', giaTri: aop ? ShinApp.ptVN(aop.tyLe) : '–', mau: aop ? this.MAU[this.mauTheoDiem(aop.tyLe)] : 'var(--c-gray)' }
        ]
      },
      khoaPhong: khoa.map(k => ({
        ten: k.ten,
        dat: ShinApp.ptVN(k.diemCuoi),
        den: this.MAU[k.mau] || this.MAU.xam,
        trangThai: (k.sapTruot || []).length ? `${k.sapTruot.length} chỉ tiêu cần chú ý` : k.du ? 'Đủ số, không chỉ tiêu nào hụt' : 'Còn chỉ tiêu chưa có số',
        phu: `Tạm tính khoa ${ShinApp.ptVN(k.tamTinh)} → điểm cuối ${ShinApp.ptVN(k.diemCuoi)}`,
        chiTiet: (k.sapTruot || []).map(s => s.cau)
      })),
      tru: b.tru || null,
      aop: aop,
      lech: b.lech || [],
      vienDu: vien.du
    };
  },

  _xem: 'bantin',
  _quy: String(Math.floor(new Date().getMonth() / 3) + 1),
  _phu: {},

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.kpi;
    this._d = d;
    this._phu = {};
    const xemAOP = !SHIN_API.laCheDoLive() || d.xemAOP;
    if (!xemAOP) this._xem = 'bantin';
    const the = [['bantin', '📰 Bản tin'], ['soatloi', '🔎 Soát lỗi'], ['aop', '🎯 AOP'], ['baocao', '📄 Báo cáo quý']];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">📊 KPI Toàn Viện</div>
          <div class="page-sub">Ban Kiểm Soát · Số đọc từ TV3 (chỉ đọc)</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>
      ${xemAOP ? `<div class="hang-tab" role="tablist">
        ${the.map(t => `<button class="tab-nut ${this._xem === t[0] ? 'dang-chon' : ''}" role="tab" onclick="ModuleKPI.chuyenXem('${t[0]}')">${t[1]}</button>`).join('')}
      </div>` : ''}
      <div id="kpiXem"></div>
    `;
    this.veXem();
  },

  chuyenXem: function(xem) {
    this._xem = xem;
    ShinApp.rung('nhe');
    document.querySelectorAll('.hang-tab .tab-nut').forEach((b, i) => b.classList.toggle('dang-chon', ['bantin', 'soatloi', 'aop', 'baocao'][i] === xem));
    this.veXem();
  },

  veXem: function() {
    const khung = document.getElementById('kpiXem');
    if (!khung) return;
    if (this._xem === 'bantin') { khung.innerHTML = this.veBanTin(this._d); return; }
    if (this._xem === 'soatloi') { this.taiPhu('soatloi'); return; }
    if (this._xem === 'aop') { this.taiPhu('aop'); return; }
    khung.innerHTML = this.veBaoCao();
  },

  /** Nạp dữ liệu 1 thẻ phụ (đệm theo thẻ + quý trong phiên). lamMoi ➜ đọc lại TV3 / AOP. */
  taiPhu: async function(xem, lamMoi, nut) {
    const khung = document.getElementById('kpiXem');
    const khoa = xem + (xem === 'soatloi' ? this._quy : '');
    if (this._phu[khoa] && !lamMoi) { khung.innerHTML = this.vePhu(xem, this._phu[khoa]); return; }
    let du;
    if (!SHIN_API.laCheDoLive()) {
      du = (window.SHIN_DEMO_DATA.kpiPhu || {})[xem];
    } else {
      if (!nut) khung.innerHTML = '<div class="man-tai"><div class="vong-tai"></div><div>Đang đọc TV3…</div></div>';
      const ham = () => xem === 'soatloi' ? ShinApp.goiBat('KPI', 'webSoatLoi', this._quy, !!lamMoi) : ShinApp.goiBat('KPI', 'webAOP', !!lamMoi);
      du = nut ? await ShinApp.goiNut(nut, 'Đang đọc lại…', ham, 'kpi-' + khoa) : await ham().catch(err => ({ _loi: err.message }));
      if (!du) return;
    }
    if (this._xem !== xem) return;
    if (du && du._loi) { khung.innerHTML = `<div class="canh-bao-nguon loi"><span>${ShinApp.esc(du._loi)}</span></div>`; return; }
    this._phu[khoa] = du;
    khung.innerHTML = this.vePhu(xem, du);
  },

  vePhu: function(xem, du) {
    return xem === 'soatloi' ? this.veSoatLoi(du) : this.veAOP(du);
  },

  chipQuy: function(ham) {
    return `<div class="hang-chip">${[1, 2, 3, 4].map(q => `<button class="chip-chon ${String(q) === this._quy ? 'dang-chon' : ''}" onclick="${ham}('${q}')">Quý ${q}</button>`).join('')}</div>`;
  },

  /* ---------- 📰 Bản tin ---------- */

  veBanTin: function(d) {
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const khoaPhong = d.khoaPhong || [];
    return `
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${e(hero.chao || 'BKS – Giám sát KPI Toàn Viện 🎯')}</div>
            <div class="hero-date">📅 ${e(hero.ngay || '')}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o" onclick="document.getElementById('kpiKhoa').scrollIntoView({behavior:'smooth'})">
              <div class="tq-so" style="color: ${s.mau}">${e(s.giaTri)}</div>
              <div class="tq-nhan">${e(s.nhan)}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="ModuleKPI.docLai(this)">↻ Đọc lại số TV3</button>
      </div>

      ${d.vienDu === false ? '<div class="canh-bao-nguon mau"><span>Còn chỉ tiêu chưa nhập kết quả – điểm viện đang tạm tính trên phần đã có số.</span></div>' : ''}

      <div class="hn-tieu" id="kpiKhoa"><span>KHOA / PHÒNG · ${khoaPhong.length}</span></div>
      <div class="hn-list">
        ${khoaPhong.map((kp, i) => `
          <div class="hn-dong" onclick="ModuleKPI.chiTietKhoa(${i})">
            <div class="dong-icon" style="background: color-mix(in srgb, ${kp.den} 14%, transparent); color: ${kp.den}">🏥</div>
            <div class="dong-content">
              <div class="dong-title">${e(kp.ten)}</div>
              <div class="dong-sub">${kp.aop ? 'AOP: ' + e(kp.aop) + ' · ' : ''}${e(kp.trangThai)}</div>
            </div>
            <div class="dong-meta">
              <div class="dong-so" style="color: ${kp.den}">${e(kp.dat)}</div>
              <span class="dong-arrow">›</span>
            </div>
          </div>
          <div class="chi-tiet-dong" id="kpiCT${i}" hidden>
            ${kp.phu ? `<div class="chu-phu">${e(kp.phu)}</div>` : ''}
            ${(kp.chiTiet || []).length ? `<ul>${kp.chiTiet.map(c => `<li>${e(c)}</li>`).join('')}</ul>` : '<div class="chu-phu">Không có chỉ tiêu nào sắp trượt.</div>'}
          </div>
        `).join('')}
      </div>

      ${d.tru && (d.tru.tru || []).length ? `
        <div class="hn-tieu"><span>SỨC KHỎE 5 TRỤ (TOÀN VIỆN)</span></div>
        <div class="the">
          ${d.tru.tru.map(t => `
            <div class="hang-tru">
              <span>${e(t.ten)}</span>
              <span class="badge ${t.mau === 'xam' ? 'xam' : t.mau}">${t.diem === null ? 'chưa có số' : e(ShinApp.ptVN(t.diem))}</span>
            </div>
          `).join('')}
        </div>` : ''}

      ${d.aop && d.aop.thang ? `
        <details class="tq-gon" data-nho="kpi_aop" ${ShinApp_moGap('kpi_aop')}>
          <summary><span>🎯 Doanh thu so kế hoạch năm</span><span class="tom-tat">${e(ShinApp.ptVN(d.aop.tyLe))} lũy kế</span></summary>
          <div class="hang-tru"><span>Lũy kế ${e(d.aop.thang)} tháng</span><b>${e(ShinApp.soVN(d.aop.luyKe, 2))} tỷ đ</b></div>
          <div class="hang-tru"><span>Kế hoạch lũy kế</span><b>${e(ShinApp.soVN(d.aop.khLuyKe, 2))} tỷ đ</b></div>
          <div class="hang-tru"><span>Dự báo cả năm / Kế hoạch năm</span><b>${e(ShinApp.soVN(d.aop.duBao, 2))} / ${e(ShinApp.soVN(d.aop.khNam, 2))} tỷ đ</b></div>
          ${d.aop.canThem ? `<div class="hang-tru"><span>Cần thêm mỗi tháng còn lại</span><b>${e(ShinApp.soVN(d.aop.canThem, 2))} tỷ đ</b></div>` : ''}
        </details>` : ''}

      ${(d.lech || []).length ? `
        <details class="tq-gon" data-nho="kpi_lech">
          <summary><span>⚠️ Lệch số với tab khoa</span><span class="tom-tat">${d.lech.length} khoa</span></summary>
          <ul>${d.lech.map(l => `<li>${e(l.ten)}: tính ${e(ShinApp.ptVN(l.tinh))} – tab ghi ${e(ShinApp.ptVN(l.theoTab))}</li>`).join('')}</ul>
        </details>` : ''}

      <details class="tq-gon">
        <summary><span>ⓘ Quy ước giám sát BKS</span></summary>
        <p class="chu-phu">• Số TVM là tổng toàn viện. Doanh thu mỗi khoa gồm trực tiếp và gián tiếp nên không cộng dồn các khoa để so với viện.<br>
        • Điểm cuối khoa = 70% KPI khoa + 30% KPI phòng khám. Màu: ≥ 90% xanh · ≥ 80% vàng · dưới 80% đỏ.</p>
      </details>
    `;
  },

  /* ---------- 🔎 Soát lỗi chốt quý (webSoatLoi – chỉ đọc) ---------- */

  TEN_LOI: { trong: 'Chưa nhập KQ', ts_nhom: 'Trọng số nhóm', ts_tong: 'Trọng số tổng', pp: 'Phương pháp đo', go_de: 'Gõ đè công thức' },

  veSoatLoi: function(du) {
    const e = ShinApp.esc;
    const ds = du.khoa || [];
    const coLoi = ds.filter(k => k.soLoi > 0);
    const tongLoi = coLoi.reduce((s, k) => s + k.soLoi, 0);
    const chuaCo = ds.filter(k => k.chuaCoQuy).length;
    return `
      ${this.chipQuy('ModuleKPI.chonQuySoat')}
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Soát lỗi trước chốt Quý ${e(du.quy)} 🔎</div>
          <div class="hero-date">${du.capNhatLuc ? 'Số TV3 lúc ' + e(du.capNhatLuc) : ''} · chỉ đọc, không sửa TV3</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:${coLoi.length ? 'var(--c-red)' : 'var(--c-green)'}">${ShinApp.soVN(coLoi.length)}</div><div class="tq-nhan">Khoa còn lỗi</div></div>
          <div class="tq-o"><div class="tq-so" style="color:${tongLoi ? 'var(--c-yellow)' : 'var(--c-green)'}">${ShinApp.soVN(tongLoi)}</div><div class="tq-nhan">Ô cần sửa</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-gray)">${ShinApp.soVN(chuaCo)}</div><div class="tq-nhan">Chưa có khối quý</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleKPI.taiPhu('soatloi', true, this)">↻ Đọc lại TV3 rồi soát</button>
      </div>
      <div class="hn-list">
        ${ds.map((k, i) => `
          <div class="hn-dong ${k.chuaCoQuy ? 'mo-di' : ''}" onclick="ModuleKPI.moLoi(${i})">
            <div class="dong-content">
              <div class="dong-title">${e(k.ten)}</div>
              <div class="dong-sub">${k.chuaCoQuy ? 'Chưa có khối Quý ' + e(du.quy) : k.soLoi ? [...new Set(k.loi.map(l => this.TEN_LOI[l.loai] || l.loai))].map(e).join(' · ') : 'Không có lỗi'}</div>
            </div>
            <div class="dong-meta">${k.soLoi ? `<span class="badge do">${ShinApp.soVN(k.soLoi)} lỗi</span>` : k.chuaCoQuy ? '' : '<span class="badge xanh">Đạt</span>'}</div>
          </div>
          <div class="chi-tiet-dong" id="kpiLoi${i}" hidden>
            ${k.loi.length ? `<ul>${k.loi.map(l => `<li>${e(l.chu)}</li>`).join('')}</ul>` : '<div class="chu-phu">Không có lỗi.</div>'}
          </div>`).join('')}
      </div>
      ${ds.length ? '' : '<div class="trong">TV3 chưa có khoa nào.</div>'}
      <p class="chu-phu">Sửa trực tiếp trên file TV3 rồi bấm "Đọc lại TV3 rồi soát".</p>`;
  },

  chonQuySoat: function(q) {
    this._quy = q;
    ShinApp.rung('nhe');
    this.taiPhu('soatloi');
  },

  moLoi: function(i) {
    const ct = document.getElementById('kpiLoi' + i);
    if (ct) { ct.hidden = !ct.hidden; ShinApp.rung('nhe'); }
  },

  /* ---------- 🎯 Phân bổ AOP (webAOP – chỉ đọc) ---------- */

  veAOP: function(du) {
    const e = ShinApp.esc;
    if (du.loi) return `<div class="canh-bao-nguon loi"><span>Chưa đọc được file AOP ${e(du.nam || '')}: ${e(du.loi)}</span></div>`;
    const ty = v => v === null || v === undefined ? '–' : ShinApp.soVN(v / 1e9, 2) + ' tỷ đ';
    const ds = du.khoa || [];
    return `
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Phân bổ AOP ${e(du.nam || '')} 🎯</div>
          <div class="hero-date">${du.luc ? 'Đọc file lúc ' + e(du.luc) : ''}</div>
        </div></div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${ty(du.vienDT)}</div><div class="tq-nhan">Doanh thu toàn viện</div></div>
          <div class="tq-o"><div class="tq-so" style="color:${du.soVanDe ? 'var(--c-yellow)' : 'var(--c-green)'}">${ShinApp.soVN(du.soVanDe)}</div><div class="tq-nhan">Đơn vị cần sửa</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-gray)">${ShinApp.soVN((du.chung || []).length)}</div><div class="tq-nhan">Khoa dùng số chung viện</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleKPI.taiPhu('aop', true, this)">↻ Đọc lại file AOP</button>
      </div>
      <div class="hn-list">
        ${ds.map((k, i) => `
          <div class="hn-dong" onclick="ModuleKPI.moAOPKhoa(${i})">
            <div class="dong-content">
              <div class="dong-title">${e(k.ten)}</div>
              <div class="dong-sub">${k.phuTrach ? 'Phụ trách: ' + e(k.phuTrach) + ' · ' : ''}${ty(k.doanhThu)}</div>
            </div>
            <div class="dong-meta">${(k.vanDe || []).length ? `<span class="badge vang">${k.vanDe.length} vấn đề</span>` : '<span class="badge xanh">Đủ</span>'}</div>
          </div>
          <div class="chi-tiet-dong" id="kpiAOP${i}" hidden>
            ${(k.vanDe || []).length ? `<ul>${k.vanDe.map(v => `<li>${e(v)}</li>`).join('')}</ul>` : '<div class="chu-phu">Trọng số và doanh thu đã đủ.</div>'}
          </div>`).join('')}
      </div>
      ${(du.chung || []).length ? `<p class="chu-phu">Dùng số doanh thu chung toàn viện (không cộng vào tổng): ${du.chung.map(e).join(', ')}.</p>` : ''}
      <details class="tq-gon">
        <summary><span>🗓 Nháp AOP ${e(Number(du.nam || 0) + 1 || '')}</span></summary>
        <p class="chu-phu">Chỉnh % tăng trưởng nháp năm sau cần cổng đọc nháp (webNhap2027) – v1 chưa mở cho cửa web. Tạm thời chỉnh trên app KPI v1.</p>
        <button class="nut-chu" onclick="ShinApp.moV1('KPI', 'Nháp AOP năm sau')">Mở app KPI v1 ›</button>
      </details>`;
  },

  moAOPKhoa: function(i) {
    const ct = document.getElementById('kpiAOP' + i);
    if (ct) { ct.hidden = !ct.hidden; ShinApp.rung('nhe'); }
  },

  /* ---------- 📄 Nháp báo cáo quý (webBaoCaoQuy – chỉ Admin, tạo Google Docs) ---------- */

  veBaoCao: function() {
    const e = ShinApp.esc;
    const bc = this._phu['baocao' + this._quy];
    return `
      ${this.chipQuy('ModuleKPI.chonQuyBC')}
      <div class="hn-hero">
        <div class="hero-head"><div>
          <div class="hero-greet">Nháp báo cáo KPI Quý ${e(this._quy)} 📄</div>
          <div class="hero-date">Khung theo BC Q2 · phần Nhận định, Kiến nghị để trống cho BKS viết</div>
        </div></div>
        <button class="btn-primary" onclick="ModuleKPI.taoBaoCao(false, this)">📄 Tạo / mở nháp Quý ${e(this._quy)}</button>
      </div>
      ${bc ? `
        <div class="the">
          <p>${e(bc.tomTat || '')}</p>
          <div class="chu-phu">${bc.cu ? 'Bản đã tạo lúc ' : 'Vừa tạo lúc '}${e(bc.luc || '')}</div>
          <div class="hang-nut">
            ${bc.url ? `<a class="btn-secondary" href="${e(bc.url)}" target="_blank" rel="noopener">Mở Google Docs ›</a>` : ''}
            ${bc.cu ? `<button class="btn-secondary" onclick="ModuleKPI.taoLaiBaoCao(this)">Tạo lại bản mới</button>` : ''}
          </div>
        </div>` : '<p class="chu-phu">Chỉ Admin tạo được nháp. Đã có bản của quý này thì mở lại bản cũ, không tạo trùng.</p>'}`;
  },

  chonQuyBC: function(q) {
    this._quy = q;
    ShinApp.rung('nhe');
    this.veXem();
  },

  taoBaoCao: async function(taoLai, nut) {
    const q = this._quy;
    let kq;
    if (!SHIN_API.laCheDoLive()) {
      kq = Object.assign({}, (window.SHIN_DEMO_DATA.kpiPhu || {}).baocao, { quy: q, cu: !taoLai && !!this._phu['baocao' + q] });
    } else {
      kq = await ShinApp.goiNut(nut, taoLai ? 'Đang tạo lại…' : 'Đang tạo nháp…', () => ShinApp.goiBat('KPI', 'webBaoCaoQuy', q, !!taoLai), 'kpi-bc-' + q);
      if (!kq) return;
    }
    this._phu['baocao' + q] = kq;
    if (this._xem === 'baocao') this.veXem();
    ShinApp.rung('xong');
  },

  taoLaiBaoCao: function(nut) {
    ShinApp.xacNhan2Lan('kpi-bc-lai-' + this._quy, 'Tạo bản nháp mới (bản cũ vẫn giữ trên Drive)', () => this.taoBaoCao(true, nut));
  },

  docLai: async function(nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Chế độ trình diễn: số KPI là mẫu.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang đọc TV3…', () => ShinApp.goiBat('KPI', 'webBanTin', true), 'kpi-doc-lai');
    if (kq) {
      const moi = this.tuV1(kq);
      moi.xemAOP = this._d.xemAOP;
      this.render(document.getElementById('appContent'), moi);
    }
  },

  chiTietKhoa: function(i) {
    const ct = document.getElementById('kpiCT' + i);
    if (ct) { ct.hidden = !ct.hidden; ShinApp.rung('nhe'); }
  },

  soatLoi: function() { this.chuyenXem('soatloi'); },
  moAOP: function() { this.chuyenXem('aop'); },
  baoCaoQuy: function() { this.chuyenXem('baocao'); },
  xemBanTin: function() { document.getElementById('kpiKhoa').scrollIntoView({ behavior: 'smooth' }); }
};
