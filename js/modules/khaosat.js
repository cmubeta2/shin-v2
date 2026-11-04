/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat, app KS v1.4.3 – L1–L4 ✅)
 * v2.7.2: KS KHÔNG có webTongQuan ➜ gọi đúng cổng thật (du là đối tượng – SHIN_API.goi):
 *   webDsKhaoSat({}) ➜ {ok, ds:[{maKS, tieuDe, trangThai, han, soCau…}], dem:{dangMo, nhap, daDong}}
 *   webKetQuaKS({maKS}) ➜ {ok, maKS, tieuDe, soPhieu, choXacMinh, theoNgay, cau:[{maCH, loai, noiDung, n, tb?, nps?}]}
 *   webXuatKS({maKS, kieu:'csv'}) ➜ {ok, csv, tenTep}
 * Màn không hiện thông tin liên hệ người trả lời (QK4) – chỉ đọc số tổng hợp theo câu.
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',
  TOI_DA_KQ: 6,

  taiLive: async function() {
    const ds = await SHIN_API.goi('KS', 'webDsKhaoSat', {});
    if (!ds.ok) return ds;
    const tatCa = (ds.data && ds.data.ds) || [];
    const mo = tatCa.filter(k => k.trangThai === 'Đang mở').concat(tatCa.filter(k => k.trangThai !== 'Đang mở')).slice(0, this.TOI_DA_KQ);
    const kq = await Promise.all(mo.map(k => SHIN_API.goi('KS', 'webKetQuaKS', { maKS: k.maKS })));
    const loi = kq.filter(x => !x.ok).length;
    const data = this.tuV1(ds.data, mo.map((k, i) => kq[i].ok ? kq[i].data : null));
    return { ok: true, data, ghiChu: loi ? `${loi} khảo sát không đọc được kết quả (${SHIN_API.moTaLoi(kq.find(x => !x.ok))}) – các số khác là số thật.` : '' };
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
      khaoSat: ds.map(k => ({ ma: k.maKS, ten: k.tieuDe, trangThai: k.trangThai, soPhieu: theoMa[k.maKS] ? theoMa[k.maKS].soPhieu : null, moTu: '', dongLuc: k.han || '' })),
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

      ${ks.length ? `
        <details class="tq-gon">
          <summary><span>📋 Các khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
          ${ks.map(x => `<div class="hang-tru"><span>${e(x.ten)}<br><span class="chu-phu">${e([x.trangThai, x.moTu ? 'từ ' + x.moTu : '', x.dongLuc ? 'đến ' + x.dongLuc : ''].filter(Boolean).join(' · '))}</span></span><span style="display:flex;align-items:center;gap:6px;"><b>${x.soPhieu === null || x.soPhieu === undefined ? '–' : ShinApp.soVN(x.soPhieu)} phiếu</b>${x.ma && d.live ? `<button class="btn-secondary" style="min-height:44px;" onclick="ModuleKhaoSat.xuatCSV('${e(x.ma)}', this)" aria-label="Xuất CSV">⬇ CSV</button>` : ''}</span></div>`).join('')}
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
