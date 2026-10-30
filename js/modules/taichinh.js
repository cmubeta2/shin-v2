/**
 * SHIN v2 – Mảng 3: Tài chính & Thu chi
 * Live (v2.5.0 – HOP_DONG_CONG_V2.md mục Tài chính, máy chủ Hub): webTaiChinh({}) ➜
 *   {thang, thu, chi, ton, khoanChoDuyet: [{ma, khoanMuc, soTien, nguoiDeXuat, duAn, luc}], giaoDich: [{ngay, noiDung, soTien, nguon}]}
 *   Tiền là số đồng; giaoDich.soTien dương = thu, âm = chi. Khoản chờ duyệt đi qua Trung tâm Phê duyệt 0B.
 * Hub chưa mở cổng ➜ 'hanh' ➜ màn hiện MẪU (dải vàng).
 */

const ModuleTaiChinh = {
  ma: 'taichinh',
  ten: 'Tài Chính',
  bieuTuong: '💰',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webTaiChinh', {});
    if (!kq.ok) return kq;
    return { ok: true, data: Object.assign({ live: true }, kq.data || {}) };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.taichinh;
    const e = ShinApp.esc;
    const tien = v => v === null || v === undefined || v === '' ? '–' : ShinApp.soVN(v) + ' đ';
    const trieu = v => v === null || v === undefined ? '–' : ShinApp.soVN(v / 1e6, 1) + ' tr';
    const cho = d.khoanChoDuyet || [];
    const gd = d.giaoDich || [];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">💰 Tài Chính & Thu Chi</div>
          <div class="page-sub">Tháng ${e(d.thang || '')} · Khoản chờ duyệt · Giao dịch gần đây</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.chuyenModule('taichinh')" title="Làm mới">↻</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Dòng tiền tháng ${e(d.thang || '')} 💰</div>
            <div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${e(trieu(d.thu))}</div><div class="tq-nhan">Đã thu</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-red)">${e(trieu(d.chi))}</div><div class="tq-nhan">Đã chi</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${e(trieu(d.ton))}</div><div class="tq-nhan">Tồn quỹ</div></div>
        </div>
        <button class="btn-primary" onclick="ShinApp.chuyenModule('pheduyet')">⚡ ${cho.length ? cho.length + ' khoản chờ duyệt' : 'Mở Phê duyệt'}</button>
      </div>

      ${cho.length ? `
        <div class="hn-tieu"><span>KHOẢN CHỜ DUYỆT · ${cho.length}</span></div>
        ${cho.map(x => `
          <div class="hang-tru"><span><b>${e(x.khoanMuc)}</b><br><span class="chu-phu">${e([x.nguoiDeXuat, x.duAn, x.luc].filter(Boolean).join(' · '))}</span></span>
            <b>${e(tien(x.soTien))}</b></div>`).join('')}` : ''}

      <div class="hn-tieu"><span>GIAO DỊCH GẦN ĐÂY · ${gd.length}</span></div>
      ${gd.length ? gd.map(x => `
        <div class="hang-tru"><span>${e(x.noiDung)}<br><span class="chu-phu">${e([x.ngay, x.nguon].filter(Boolean).join(' · '))}</span></span>
          <b style="color:${Number(x.soTien) < 0 ? 'var(--c-red)' : 'var(--c-green)'}">${Number(x.soTien) < 0 ? '−' : '+'}${e(tien(Math.abs(Number(x.soTien) || 0)))}</b></div>`).join('')
        : '<div class="trong">Chưa có giao dịch.</div>'}

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn số</span></summary>
        <p class="chu-phu">Thu qua chuyển khoản tự ghi từ SePay (VietQR); thu chi tay do kế toán nhập trên Hub. Mọi khoản chi mới phải qua Phê duyệt 1-chạm.</p>
      </details>
    `;
  }
};
