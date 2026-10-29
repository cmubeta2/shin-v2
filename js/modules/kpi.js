/**
 * SHIN v2 – Mảng 1: KPI Toàn Viện (Ban Kiểm Soát)
 * Live: máy chủ 30_KPI_ToanVien – webBanTin(lamMoi) đọc TV3 (chỉ đọc, đệm 6 giờ).
 * Soát lỗi chốt quý · AOP · Báo cáo quý: mở trên app KPI v1 (v2 chưa dựng màn riêng).
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
    const kq = await SHIN_API.goiCong('KPI', 'webBanTin', !!lamMoi);
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
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

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.kpi;
    this._d = d;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const khoaPhong = d.khoaPhong || [];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">📊 KPI Toàn Viện</div>
          <div class="page-sub">Ban Kiểm Soát · Số đọc từ TV3 (chỉ đọc)</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

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

      <div class="hn-tieu" id="kpiKhoa">
        <span>KHOA / PHÒNG · ${khoaPhong.length}</span>
        <button class="btn-secondary nut-nho" onclick="ModuleKPI.soatLoi()">🔎 Soát lỗi chốt quý</button>
      </div>
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
          <button class="nut-chu" onclick="ModuleKPI.moAOP()">Xem phân bổ AOP trên app KPI ›</button>
        </details>` : ''}

      ${(d.lech || []).length ? `
        <details class="tq-gon" data-nho="kpi_lech">
          <summary><span>⚠️ Lệch số với tab khoa</span><span class="tom-tat">${d.lech.length} khoa</span></summary>
          <ul>${d.lech.map(l => `<li>${e(l.ten)}: tính ${e(ShinApp.ptVN(l.tinh))} – tab ghi ${e(ShinApp.ptVN(l.theoTab))}</li>`).join('')}</ul>
        </details>` : ''}

      <div class="hang-nut">
        <button class="btn-secondary" onclick="ModuleKPI.moAOP()">🎯 AOP</button>
        <button class="btn-secondary" onclick="ModuleKPI.baoCaoQuy()">📄 Báo cáo quý</button>
      </div>

      <details class="tq-gon">
        <summary><span>ⓘ Quy ước giám sát BKS</span></summary>
        <p class="chu-phu">• Số TVM là tổng toàn viện. Doanh thu mỗi khoa gồm trực tiếp và gián tiếp nên không cộng dồn các khoa để so với viện.<br>
        • Điểm cuối khoa = 70% KPI khoa + 30% KPI phòng khám. Màu: ≥ 90% xanh · ≥ 80% vàng · dưới 80% đỏ.</p>
      </details>
    `;
  },

  docLai: async function(nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Chế độ trình diễn: số KPI là mẫu.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang đọc TV3…', () => ShinApp.goiBat('KPI', 'webBanTin', true), 'kpi-doc-lai');
    if (kq) {
      this.render(document.getElementById('appContent'), this.tuV1(kq));
      ShinApp.toast('Đã đọc lại số mới nhất từ TV3.', 'info');
    }
  },

  chiTietKhoa: function(i) {
    const ct = document.getElementById('kpiCT' + i);
    if (ct) { ct.hidden = !ct.hidden; ShinApp.rung('nhe'); }
  },

  soatLoi: function() { ShinApp.moV1('KPI', 'Soát lỗi chốt quý'); },
  moAOP: function() { ShinApp.moV1('KPI', 'Phân bổ AOP'); },
  baoCaoQuy: function() { ShinApp.moV1('KPI', 'Báo cáo quý'); },
  xemBanTin: function() { document.getElementById('kpiKhoa').scrollIntoView({ behavior: 'smooth' }); }
};
