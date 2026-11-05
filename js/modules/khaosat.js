/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat)
 * Live (v2.6.7 – HOP_DONG_CONG_V2.md mục KS): webTongHopKS({thang}) ➜
 *   {thang: {soPhieu, haiLong, canXuLy}, tru: [{ma, ten, diem, tyLe}], canXuLy: [{maPhieu, khaoSat, cau, diem, ngay, noiDung}]}
 *   + webDsKhaoSat() ➜ {ds: [{maKS, tieuDe, trangThai, han, soCau…}], dem}   – không có thông tin liên hệ người trả lời (QK4).
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',

  /**
   * v2.6.7: cổng THẬT của app KS (70_KhaoSat congWeb_ – không có webTongQuan): webTongHopKS({thang}) (L6, v1.4.4) + webDsKhaoSat() (đã lên app).
   * Máy chủ KS nhận ham(token, du) với du ĐỐI TƯỢNG ➜ SHIN_API.goi (không dùng goiCong / du.a).
   * webTongHopKS chưa lên app ➜ hero / 5 trụ để '–' kèm dải vàng, danh sách khảo sát vẫn là số thật.
   */
  taiLive: async function() {
    const [th, ds] = await Promise.all([SHIN_API.goi('KS', 'webTongHopKS', {}), SHIN_API.goi('KS', 'webDsKhaoSat', {})]);
    if (!th.ok && !ds.ok) return th.loi === 'hanh' ? ds : th;
    const data = this.tuV1(th.ok ? th.data : {});
    if (ds.ok) data.khaoSat = ((ds.data || {}).ds || []).map(k => ({ ma: k.maKS, ten: k.tieuDe, trangThai: k.trangThai, dongLuc: k.han, soCau: k.soCau }));
    const kq = { ok: true, data };
    if (!th.ok) kq.ghiChu = th.loi === 'hanh' ? 'App Khảo sát chưa lên bản có cổng tổng hợp (webTongHopKS – KS L6) – ô số và 5 trụ để trống; danh sách khảo sát bên dưới là số thật.' : 'Tổng hợp tháng: ' + SHIN_API.moTaLoi(th);
    else if (!ds.ok) kq.ghiChu = 'Danh sách khảo sát: ' + SHIN_API.moTaLoi(ds);
    return kq;
  },

  mau: function(tyLe) {
    return tyLe === null || tyLe === undefined ? 'var(--c-gray)' : tyLe >= 0.9 ? 'var(--c-green)' : tyLe >= 0.8 ? 'var(--c-yellow)' : 'var(--c-red)';
  },

  /** THUẦN. Cổng webTongQuan ➜ khuôn màn. */
  tuV1: function(k) {
    k = k || {};
    const t = k.thang || {};
    return {
      live: true,
      hero: {
        so: [
          { nhan: 'Hài lòng chung', giaTri: ShinApp.ptVN(t.haiLong), mau: this.mau(t.haiLong) },
          { nhan: 'Phiếu tháng này', giaTri: t.soPhieu === undefined ? '–' : ShinApp.soVN(t.soPhieu), mau: 'var(--c-blue)' },
          { nhan: 'Ý kiến cần xử lý', giaTri: t.canXuLy === undefined ? '–' : ShinApp.soVN(t.canXuLy), mau: t.canXuLy ? 'var(--c-yellow)' : 'var(--c-green)' }
        ]
      },
      chiSoNhom: (k.tru || []).map(x => ({
        nhan: (x.ma ? x.ma + '. ' : '') + (x.ten || ''),
        diem: x.diem === null || x.diem === undefined ? '–' : ShinApp.soVN(x.diem, 2),
        tyLe: ShinApp.ptVN(x.tyLe),
        mau: this.mau(x.tyLe)
      })),
      khaoSat: k.khaoSat || [],
      canXuLy: (k.canXuLy || []).map(x => Object.assign({ ma: x.maPhieu }, x))
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.khaosat;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const tru = d.chiSoNhom || [];
    const cx = d.canXuLy || [];
    const ks = d.khaoSat || [];

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
        <button class="btn-primary" onclick="ShinApp.moV1('KS', 'Quản lý khảo sát')">📝 Quản lý khảo sát trên app KS</button>
      </div>

      ${cx.length ? `
        <div class="hn-tieu"><span>⚠️ Ý KIẾN ≤ 2★ CẦN XỬ LÝ · ${cx.length}</span></div>
        ${cx.map(x => `
          <div class="the">
            <div class="the-tin-dau"><b>${e(x.cau || x.khaoSat)}</b><span class="badge do">${e(x.diem)}★</span></div>
            <div class="chu-phu">${e([x.khaoSat, x.ngay].filter(Boolean).join(' · '))}</div>
            ${x.noiDung ? `<p class="chu-phu">💬 ${e(x.noiDung)}</p>` : ''}
          </div>`).join('')}` : ''}

      <div class="hn-tieu"><span>5 TRỤ CHẤT LƯỢNG · ACHSI</span></div>
      <div class="hn-list">
        ${tru.map(cs => `
          <div class="hn-dong">
            <div class="dong-content">
              <div class="dong-title">${e(cs.nhan)}</div>
              <div class="dong-sub">Điểm trung bình ${e(String(cs.diem).replace('.', ','))}/5</div>
            </div>
            <div class="dong-meta"><div class="dong-so" style="color:${cs.mau}">${e(String(cs.tyLe).replace('.', ','))}</div></div>
          </div>`).join('')}
      </div>
      ${tru.length ? '' : '<div class="trong">Chưa có phiếu nào trong tháng.</div>'}

      ${ks.length ? `
        <details class="tq-gon">
          <summary><span>📋 Các khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
          ${ks.map(x => `<div class="hang-tru"><span>${e(x.ten)}<br><span class="chu-phu">${e([x.trangThai, x.moTu ? 'từ ' + x.moTu : '', x.dongLuc ? 'đến ' + x.dongLuc : ''].filter(Boolean).join(' · '))}</span></span><b>${x.soPhieu === undefined || x.soPhieu === null ? ShinApp.soVN(x.soCau || 0) + ' câu' : ShinApp.soVN(x.soPhieu) + ' phiếu'}</b></div>`).join('')}
        </details>` : ''}

      <details class="tq-gon">
        <summary><span>ⓘ Quy ước</span></summary>
        <p class="chu-phu">Phiếu có câu ≤ 2 sao nổi lên đầu để tổ CSKH liên hệ xử lý. Màn này không hiện thông tin liên hệ người trả lời.</p>
      </details>
    `;
  },

  guiKhaoSat: function() { ShinApp.moV1('KS', 'Khảo sát'); },
  xuatBaoCao: function() { ShinApp.moV1('KS', 'Khảo sát'); }
};
