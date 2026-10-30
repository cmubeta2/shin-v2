/**
 * SHIN v2 – Tầng 0B: Trung tâm Phê duyệt 1-chạm (dịch vụ chung)
 * Live (v2.5.0 – theo HOP_DONG_CONG_V2.md mục 0B, máy chủ Hub):
 *   webPheDuyet({}) ➜ {choDuyet:[{ma, loai, nguon, tieuDe, nguoiGui, luc, chiTiet, soTien, link}], daDuyetHomNay, canSua}
 *   webDuyet({ma, quyet: 'duyet'|'can_sua'|'tu_choi', yKien}) ➜ ghi Log_Duyet 1 lần + trả kết quả về app gốc, trả lại như webPheDuyet.
 * Hub chưa mở cổng ➜ máy chủ trả 'hanh' ➜ màn hiện MẪU (dải vàng). Duyệt: 6 giây Hoàn tác không gửi gì; từ chối: bấm 2 lần.
 */

const ModulePheDuyet = {
  ma: 'pheduyet',
  ten: 'Phê Duyệt 1-Chạm',
  bieuTuong: '⚡',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',

  _d: null,
  BIEU_TUONG: { TS: '🎓', KPI: '📊', PK: '🏥', PTKH: '🏥', KS: '🩺', DA: '📌', TC: '💰', CRM: '👥', NS: '👤', MKT: '📢' },

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webPheDuyet', {});
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. Cổng webPheDuyet ➜ khuôn màn. Số tiền là số đồng (null = không có). */
  tuV1: function(p) {
    p = p || {};
    const ds = (p.choDuyet || []).map(x => ({
      id: String(x.ma || ''),
      loai: x.loai || '',
      bieuTuong: this.BIEU_TUONG[String(x.nguon || '').toUpperCase()] || '📄',
      tieuDe: x.tieuDe || '',
      duAn: x.nguon || '',
      nguoiGui: x.nguoiGui || '',
      thoiGian: x.luc || '',
      chiTiet: x.chiTiet || '',
      soTien: x.soTien === null || x.soTien === undefined || x.soTien === '' ? '' : ShinApp.soVN(x.soTien) + ' đ',
      link: x.link || ''
    }));
    ShinApp.live.soChoDuyet = ds.length;
    ShinApp.veMenuDay();
    return {
      live: true,
      hero: {
        so: [
          { nhan: 'Chờ phê duyệt', giaTri: ShinApp.soVN(ds.length), mau: ds.length ? 'var(--c-yellow)' : 'var(--c-green)' },
          { nhan: 'Đã duyệt hôm nay', giaTri: ShinApp.soVN(p.daDuyetHomNay || 0), mau: 'var(--c-green)' },
          { nhan: 'Đang chờ sửa', giaTri: ShinApp.soVN(p.canSua || 0), mau: p.canSua ? 'var(--c-red)' : 'var(--c-gray)' }
        ]
      },
      danhSach: ds
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.pheduyet;
    this._d = d;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const ds = d.danhSach || [];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">⚡ Phê Duyệt 1-Chạm</div>
          <div class="page-sub">Mọi yêu cầu cần anh quyết định – gom từ các app</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('pheduyet')" title="Làm mới">↻</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Hộp thư phê duyệt ⚡</div>
            <div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o"><div class="tq-so" style="color:${s.mau}">${e(s.giaTri)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>
          `).join('')}
        </div>
        ${ds.length ? `<button class="btn-primary" onclick="document.getElementById('pdDs').scrollIntoView({behavior:'smooth'})">Xem ${ds.length} yêu cầu chờ</button>`
          : '<button class="btn-primary" onclick="ShinApp.chuyenModule(\'hub\')">🏠 Về Hôm nay</button>'}
      </div>

      <div class="hn-tieu" id="pdDs"><span>CHỜ ANH QUYẾT · ${ds.length}</span></div>
      ${ds.length ? ds.map((x, i) => `
        <div class="the" id="pd${i}">
          <div class="the-tin-dau">
            <span><span class="badge vang">${e(x.loai)}</span></span>
            <span class="chu-phu">${e(x.thoiGian)}</span>
          </div>
          <b>${e(x.bieuTuong)} ${e(x.tieuDe)}</b>
          <div class="chu-phu">${e([x.duAn, x.nguoiGui].filter(Boolean).join(' · '))}</div>
          ${x.chiTiet ? `<p class="chu-phu">💬 ${e(x.chiTiet)}</p>` : ''}
          ${x.soTien && x.soTien !== '—' ? `<div class="hang-tru"><span>Số tiền</span><b>${e(x.soTien)}</b></div>` : ''}
          <div class="hang-nut">
            <button class="btn-primary" onclick="ModulePheDuyet.duyet(${i})">✓ Duyệt</button>
            <button class="btn-secondary" onclick="ModulePheDuyet.moYKien(${i}, 'can_sua')">✎ Cần sửa</button>
            <button class="btn-secondary" onclick="ModulePheDuyet.moYKien(${i}, 'tu_choi')">✕ Từ chối</button>
            ${x.link ? `<button class="nut-chu" onclick="ModuleHub.moLink(ModulePheDuyet._d.danhSach[${i}].link)">Mở hồ sơ ›</button>` : ''}
          </div>
          <div id="pdYK${i}"></div>
        </div>
      `).join('') : '<div class="trong">🎉 Không còn yêu cầu nào chờ anh.</div>'}

      <details class="tq-gon">
        <summary><span>ⓘ Cách hoạt động</span></summary>
        <p class="chu-phu">App gốc (Phòng khám, Dự án, Tài chính, Tuyển sinh…) gửi yêu cầu về Hub. Anh bấm Duyệt ➜ 6 giây để Hoàn tác, sau đó Hub ghi sổ duyệt (Log_Duyet) đúng 1 lần và báo kết quả về app gốc. Cần sửa / Từ chối phải ghi ý kiến.</p>
      </details>
    `;
  },

  thamSoGui: function(x, quyet, yKien) {
    return { ma: x.id, quyet, yKien: yKien || '' };
  },

  /** Duyệt 1 chạm: thẻ mờ ngay, 6 giây Hoàn tác mới gửi. */
  duyet: function(i) {
    const x = (this._d.danhSach || [])[i];
    const the = document.getElementById('pd' + i);
    if (!x || !the) return;
    ShinApp.hanhDongHoanTac(`Đã duyệt "${x.tieuDe}"`, {
      lamTruoc: () => the.classList.add('mo-di'),
      traLai: () => the.classList.remove('mo-di'),
      thucHien: async () => {
        if (!SHIN_API.laCheDoLive() || !this._d.live) { the.remove(); return; }
        const kq = await ShinApp.goiBat('HUB', 'webDuyet', this.thamSoGui(x, 'duyet'));
        this.render(document.getElementById('appContent'), this.tuV1(kq));
      }
    });
  },

  moYKien: function(i, quyet) {
    const khung = document.getElementById('pdYK' + i);
    if (!khung) return;
    if (khung.dataset.quyet === quyet) { khung.innerHTML = ''; khung.dataset.quyet = ''; return; }
    khung.dataset.quyet = quyet;
    khung.innerHTML = `
      <textarea id="pdChu${i}" class="form-input" rows="2" maxlength="500" placeholder="${quyet === 'tu_choi' ? 'Lý do từ chối…' : 'Cần sửa gì…'}"></textarea>
      <div class="hang-nut"><button class="${quyet === 'tu_choi' ? 'btn-secondary nut-do' : 'btn-primary'}" onclick="ModulePheDuyet.guiYKien(${i}, '${quyet}', this)">${quyet === 'tu_choi' ? 'Gửi từ chối' : 'Gửi yêu cầu sửa'}</button></div>`;
    document.getElementById('pdChu' + i).focus();
  },

  guiYKien: function(i, quyet, nut) {
    const x = (this._d.danhSach || [])[i];
    const yKien = (document.getElementById('pdChu' + i).value || '').trim();
    if (!x) return;
    if (!yKien) { ShinApp.toast('Ghi ý kiến trước khi gửi.', 'warn'); return; }
    const lam = async () => {
      if (!SHIN_API.laCheDoLive() || !this._d.live) {
        const the = document.getElementById('pd' + i);
        if (the) the.remove();
        ShinApp.toast(quyet === 'tu_choi' ? 'Đã từ chối (mẫu).' : 'Đã gửi yêu cầu sửa (mẫu).', 'info');
        return;
      }
      const kq = await ShinApp.goiNut(nut, 'Đang gửi…', () => ShinApp.goiBat('HUB', 'webDuyet', this.thamSoGui(x, quyet, yKien)), 'pd-' + x.id);
      if (kq) {
        this.render(document.getElementById('appContent'), this.tuV1(kq));
        ShinApp.toast(quyet === 'tu_choi' ? 'Đã từ chối – app gốc nhận ý kiến của anh.' : 'Đã gửi yêu cầu sửa về app gốc.');
      }
    };
    if (quyet === 'tu_choi') ShinApp.xacNhan2Lan('pd-tc-' + x.id, `Từ chối "${x.tieuDe}"`, lam);
    else lam();
  }
};
