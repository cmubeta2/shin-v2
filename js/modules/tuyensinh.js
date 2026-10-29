/**
 * SHIN v2 – Mảng 4: Giáo dục & Tuyển sinh
 * Live: máy chủ 60_TuyenSinh – webKhoiDong (chiến dịch + số lead) · webLeadCD(maCD) (phễu, hoa hồng, danh sách lead).
 * Thêm / sửa lead, sửa chiến dịch: mở trên app Tuyển sinh v1 (v2 chưa dựng form).
 */

const ModuleTuyenSinh = {
  ma: 'tuyensinh',
  ten: 'Tuyển Sinh',
  bieuTuong: '🎓',
  paletteMacDinh: 'growth',
  mayChu: 'TS',

  _d: null,

  taiLive: async function() {
    const kq = await SHIN_API.goiCong('TS', 'webKhoiDong');
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. webKhoiDong TS v1 ➜ khuôn màn Tuyển sinh v2. */
  tuV1: function(k) {
    k = k || {};
    const soLead = k.soLead || {};
    const ds = (k.chienDich || []).map(c => ({
      ma: c.MaCD,
      ten: c.TenCD || c.MaCD,
      phu: [c.Truong, c.Bac, c.Dot ? 'Đợt ' + c.Dot : ''].filter(Boolean).join(' · '),
      han: (c.gd || '') + (c.conNgay !== null && c.conNgay !== undefined ? ` · còn ${c.conNgay} ngày${c.moc ? ' (' + c.moc + ')' : ''}` : ''),
      lead: soLead[c.MaCD] || 0,
      dong: !!c.dong,
      gan: !c.dong && c.conNgay !== null && c.conNgay !== undefined && c.conNgay <= 7
    }));
    const mo = ds.filter(c => !c.dong);
    const tongLead = Object.keys(soLead).reduce((s, m) => s + (Number(soLead[m]) || 0), 0);
    return {
      live: true,
      xemLead: !!k.xemLead,
      hero: {
        chao: 'Tuyển Sinh & Cung Ứng Nhân Lực 🎓',
        ngay: ShinApp.ngayVN(),
        so: [
          { nhan: 'Chiến dịch đang mở', giaTri: ShinApp.soVN(mo.length), mau: 'var(--c-blue)' },
          { nhan: 'Lead đang theo', giaTri: k.xemLead ? ShinApp.soVN(tongLead) : '–', mau: 'var(--c-green)' },
          { nhan: 'Sắp hết hạn (≤ 7 ngày)', giaTri: ShinApp.soVN(mo.filter(c => c.gan).length), mau: mo.some(c => c.gan) ? 'var(--c-yellow)' : 'var(--c-green)' }
        ]
      },
      chienDich: ds
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.tuyensinh;
    this._d = d;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const chienDich = d.chienDich || [];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🎓 Tuyển Sinh</div>
          <div class="page-sub">Chiến dịch · Phễu lead · Hoa hồng bậc thang</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${e(hero.chao || 'Tuyển Sinh & Cung Ứng Nhân Lực 🎓')}</div>
            <div class="hero-date">📅 ${e(hero.ngay || ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o" onclick="document.getElementById('tsCD').scrollIntoView({behavior:'smooth'})">
              <div class="tq-so" style="color: ${s.mau}">${e(s.giaTri)}</div>
              <div class="tq-nhan">${e(s.nhan)}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="ModuleTuyenSinh.nhapLead()">＋ Tiếp nhận lead mới</button>
      </div>

      <div class="hn-tieu" id="tsCD"><span>CHIẾN DỊCH · ${chienDich.length}</span></div>
      <div class="hn-list">
        ${chienDich.map((cd, i) => `
          <div class="hn-dong ${cd.dong ? 'mo-di' : ''}" onclick="ModuleTuyenSinh.chiTietCD(${i}, this)">
            <div class="dong-icon" style="background: var(--primary-soft); color: var(--primary)">🎓</div>
            <div class="dong-content">
              <div class="dong-title">${e(cd.ten)}</div>
              <div class="dong-sub">${e(cd.phu || cd.hoaHong || '')}${cd.han ? ' · ' + e(cd.han) : ''}${cd.dong ? ' · Đã đóng' : ''}</div>
            </div>
            <div class="dong-meta">
              ${cd.gan ? '<span class="badge vang">Sắp hết hạn</span>' : ''}
              <div class="dong-so" style="color: var(--primary);">${e(cd.nhapHoc !== undefined ? cd.nhapHoc + '/' + cd.lead : cd.lead)}</div>
              <span class="dong-arrow">›</span>
            </div>
          </div>
          <div class="chi-tiet-dong" id="tsCT${i}" hidden></div>
        `).join('')}
      </div>
      ${chienDich.length ? '' : '<div class="trong">Chưa có chiến dịch nào. Admin tạo chiến dịch trên app Tuyển sinh v1.</div>'}

      <details class="tq-gon">
        <summary><span>ⓘ Cổng lead web & hoa hồng</span></summary>
        <p class="chu-phu">Trang đích gửi lead về app Tuyển sinh: chống trùng 1 SĐT / 10 phút, bẫy honeypot chặn bot. Hoa hồng tính theo bậc số học viên nhập học của từng chiến dịch.</p>
      </details>
    `;
  },

  chiTietCD: async function(i, dong) {
    const cd = (this._d.chienDich || [])[i];
    const khung = document.getElementById('tsCT' + i);
    if (!cd || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;

    if (!SHIN_API.laCheDoLive()) {
      khung.innerHTML = `<div class="chu-phu">Mẫu: ${ShinApp.esc(cd.lead)} lead · ${ShinApp.esc(cd.nhapHoc)} nhập học · ${ShinApp.esc(cd.hoaHong)}. Có token sẽ hiện phễu và danh sách lead thật.</div>`;
      return;
    }
    if (!this._d.xemLead) {
      khung.innerHTML = '<div class="chu-phu">Vai trò của anh/chị chỉ xem chiến dịch, không xem lead (chỉ Admin và Tư vấn xem lead).</div>';
      return;
    }
    khung.innerHTML = '<div class="chu-phu">⏳ Đang tải lead…</div>';
    const kq = await SHIN_API.goiCong('TS', 'webLeadCD', cd.ma);
    if (!kq.ok) { khung.innerHTML = `<div class="chu-phu">${ShinApp.esc(SHIN_API.moTaLoi(kq))}</div>`; return; }
    khung.innerHTML = this.veChiTiet(kq.data || {});
  },

  /** Chi tiết 1 chiến dịch từ webLeadCD: phễu · hoa hồng · lead (đang theo trước, quá hạn nổi bật). */
  veChiTiet: function(c) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const p = c.pheu || {}, hh = c.hoaHong || {}, s = c.so || {};
    const ds = (c.lead || []).slice(0, 50);
    return `
      <div class="hang-tru"><span>Lead · Liên hệ được · Hồ sơ · Nhập học</span><b>${so(p.lead)} · ${so(p.lienHe)} · ${so(p.hoSo)} · ${so(p.nhapHoc)}</b></div>
      <div class="hang-tru"><span>Tỷ lệ nhập học / lead · Loss</span><b>${e(ShinApp.ptVN(p.tyLe))} · ${so(p.loss)}</b></div>
      <div class="hang-tru"><span>Hoa hồng hiện tại${hh.bac ? ' (bậc ' + so(hh.bac) + ')' : ''}</span><b>${so(hh.tien)} đ</b></div>
      ${hh.conLenBac ? `<div class="chu-phu">Còn ${so(hh.conLenBac)} học viên nữa lên bậc kế.</div>` : ''}
      <div class="hn-tieu"><span>LEAD · ${so(s.dangTV)} đang theo${s.quaHan ? ' · ' + so(s.quaHan) + ' quá hạn' : ''}</span></div>
      ${ds.length ? ds.map(l => `
        <div class="dong-lead ${l.daDong ? 'mo-di' : ''}">
          <div>
            <b>${e(l.HoTen)}</b>
            <div class="chu-phu">${e(l.TrangThaiPheu || 'Chưa có bước')}${l.HanhDongTiep ? ' · ' + e(l.HanhDongTiep) : ''}${l.HanHanhDong ? ' · hạn ' + e(l.HanHanhDong) : ''}</div>
          </div>
          <div class="dong-lead-phai">
            ${l.quaHan ? '<span class="badge do">Quá hạn</span>' : ''}
            ${l.SDT ? `<a class="nut-goi" href="tel:${e(l.SDT)}" onclick="event.stopPropagation()">📞</a>` : ''}
          </div>
        </div>
      `).join('') : '<div class="trong">Chiến dịch chưa có lead.</div>'}
      ${(c.lead || []).length > 50 ? `<div class="chu-phu">Đang hiện 50 / ${so(c.lead.length)} lead – xem đủ trên app Tuyển sinh v1.</div>` : ''}
      <button class="nut-chu" onclick="ShinApp.moV1('TS', 'Quản lý lead')">Cập nhật lead trên app Tuyển sinh ›</button>
    `;
  },

  nhapLead: function() {
    ShinApp.moV1('TS', 'Tiếp nhận lead');
  },

  xuatHoaHong: function() {
    ShinApp.moV1('TS', 'Bảng hoa hồng');
  }
};
