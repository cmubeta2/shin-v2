/**
 * SHIN v2 – Mảng 5: Vận hành Phòng PTKH (máy chủ 21_PhongPTKH – thay PTKH cũ, dùng chung file dữ liệu PTKH)
 * Live (v2.4.0 – HOP_DONG_CONG_V2.md mục PK): webHomNay() ➜
 *   {ngay, baoCao: {daNop, tong}, minhChung, doiCa, nhanSu: [{ten, viTri, ca, trangThai}], viecCa: [{tieuDe, han, xong}]}
 *   trangThai: 'da_nop' | 'dang_truc' | 'chua_toi_ca' | 'chua_nop'.
 * App PK v1 chưa mở cổng ➜ máy chủ trả 'hanh' ➜ màn hiện MẪU (dải vàng). Nộp báo cáo + minh chứng vẫn làm trên app PK / PTKH.
 */

const ModulePhongKham = {
  ma: 'phongkham',
  ten: 'Phòng Khám',
  bieuTuong: '🏥',
  paletteMacDinh: 'gold',
  mayChu: 'PK',

  TT: { da_nop: ['Đã nộp báo cáo', 'xanh'], dang_truc: ['Đang trực', 'vang'], chua_toi_ca: ['Chưa tới ca', 'xam'], chua_nop: ['Chưa nộp', 'do'] },

  taiLive: async function() {
    const kq = await SHIN_API.goiCong('PK', 'webHomNay');
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. Cổng webHomNay ➜ khuôn màn. */
  tuV1: function(p) {
    p = p || {};
    const bc = p.baoCao || {};
    return {
      live: true,
      ngay: p.ngay || '',
      hero: {
        so: [
          { nhan: 'Báo cáo đã nộp', giaTri: `${ShinApp.soVN(bc.daNop || 0)}/${ShinApp.soVN(bc.tong || 0)}`, mau: bc.tong && bc.daNop >= bc.tong ? 'var(--c-green)' : 'var(--c-blue)' },
          { nhan: 'Ảnh minh chứng', giaTri: ShinApp.soVN(p.minhChung || 0), mau: 'var(--c-green)' },
          { nhan: 'Xin đổi ca', giaTri: ShinApp.soVN(p.doiCa || 0), mau: p.doiCa ? 'var(--c-yellow)' : 'var(--c-gray)' }
        ]
      },
      nhanSuTruc: (p.nhanSu || []).map(n => ({ ten: n.ten || '', viTri: n.viTri || '', ca: n.ca || '', ma: n.trangThai })),
      viecCa: p.viecCa || []
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.phongkham;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const ns = d.nhanSuTruc || [];
    const viec = d.viecCa || [];

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏥 Phòng PTKH</div>
          <div class="page-sub">Báo cáo ngày · Minh chứng · Ca trực</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Vận hành hôm nay 🏥</div>
            <div class="hero-date">📅 ${e(d.ngay || (hero.ngay) || ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `<div class="tq-o"><div class="tq-so" style="color:${s.mau}">${e(s.giaTri)}</div><div class="tq-nhan">${e(s.nhan)}</div></div>`).join('')}
        </div>
        <button class="btn-primary" onclick="ModulePhongKham.guiBaoCao()">📷 Nộp báo cáo & minh chứng</button>
      </div>

      <div class="hn-tieu"><span>NHÂN SỰ TRỰC HÔM NAY · ${ns.length}</span></div>
      <div class="hn-list">
        ${ns.map(n => {
          const tt = this.TT[n.ma] || [n.tt || '', n.tt && /nộp/.test(n.tt) ? 'xanh' : 'xam'];
          return `
          <div class="hn-dong">
            <div class="dong-content">
              <div class="dong-title">${e(n.ten)}</div>
              <div class="dong-sub">${e(n.viTri)}${n.ca ? ' · Ca ' + e(n.ca) : ''}</div>
            </div>
            <div class="dong-meta"><span class="badge ${tt[1]}">${e(tt[0])}</span></div>
          </div>`;
        }).join('')}
      </div>
      ${ns.length ? '' : '<div class="trong">Chưa có lịch trực hôm nay.</div>'}

      ${viec.length ? `
        <div class="hn-tieu"><span>VIỆC CA · ${viec.filter(v => !v.xong).length} còn mở</span></div>
        ${viec.map(v => `<div class="hang-tru ${v.xong ? 'mo-di' : ''}"><span>${v.xong ? '✓ ' : ''}${e(v.tieuDe)}</span><span class="chu-phu">${e(v.han || '')}</span></div>`).join('')}` : ''}

      <div class="hang-nut">
        <button class="btn-secondary" onclick="ModulePhongKham.xemLich()">📅 Lịch trực tuần</button>
      </div>
    `;
  },

  guiBaoCao: function() { ShinApp.moV1('PK', 'Nộp báo cáo ngày'); },
  xemLich: function() { ShinApp.moV1('PK', 'Lịch trực'); }
};
