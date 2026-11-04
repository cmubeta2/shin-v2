/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat v1.4.3)
 * v2.6.6 (04/11): KS v1 KHÔNG có `webTongQuan` – gọi đúng cổng thật (congWeb_ của 70_KhaoSat, gọi ham(token, du) – du là object):
 *   webDsKhaoSat({}) ➜ {ok, ds:[{maKS, tieuDe, trangThai, han, soCau, ngayTao…}], dem:{dangMo, nhap, daDong}}
 *   webKetQuaKS({maKS}) ➜ {soPhieu, choXacMinh, theoNgay, cau:[{maCH, loai, noiDung, n, tb?, tyLe?, nps?}]}
 * Màn lấy kết quả của tối đa 3 KS đang mở (mới nhất trước). KHÔNG hiện ý kiến chữ / liên hệ người trả lời (QK4).
 * "Ý kiến ≤ 2★ cần xử lý" chưa có cổng ở KS ➜ còn chờ v1.
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',
  SO_KS_KQ: 3,

  taiLive: async function() {
    const kq = await SHIN_API.goi('KS', 'webDsKhaoSat', {});
    if (!kq.ok) return kq;
    const ds = ((kq.data || {}).ds || []);
    const mo = ds.filter(k => k.trangThai === 'Đang mở').slice(-this.SO_KS_KQ).reverse();
    const kqKS = await Promise.all(mo.map(k => SHIN_API.goi('KS', 'webKetQuaKS', { maKS: k.maKS })));
    const loi = kqKS.filter(x => !x.ok).length;
    return { ok: true, data: this.tuV1(kq.data, mo.map((k, i) => kqKS[i].ok ? Object.assign({ maKS: k.maKS }, kqKS[i].data) : null)),
      ghiChu: loi ? `${loi} khảo sát không lấy được kết quả (${SHIN_API.moTaLoi(kqKS.find(x => !x.ok))}) – số phiếu của các khảo sát đó chưa tính.` : '' };
  },

  mau: function(tyLe) {
    return tyLe === null || tyLe === undefined ? 'var(--c-gray)' : tyLe >= 0.9 ? 'var(--c-green)' : tyLe >= 0.8 ? 'var(--c-yellow)' : 'var(--c-red)';
  },

  /** THUẦN. Câu '5muc': tyLe = {'1'..'5': % phiếu} ➜ tỷ lệ hài lòng (4–5★) 0–1; câu khác ➜ null. */
  hlCau: function(c) {
    if (!c || c.loai !== '5muc' || !c.tyLe || typeof c.tyLe !== 'object') return null;
    return ((Number(c.tyLe['4']) || 0) + (Number(c.tyLe['5']) || 0)) / 100;
  },

  /** THUẦN. webDsKhaoSat + [webKetQuaKS | null] ➜ khuôn màn. */
  tuV1: function(dsKq, kqs) {
    dsKq = dsKq || {}; kqs = (kqs || []).filter(Boolean);
    const dem = dsKq.dem || {};
    const theoMa = {};
    kqs.forEach(k => { theoMa[k.maKS] = k; });
    const cauSao = [];
    kqs.forEach(k => (k.cau || []).forEach(c => { if (this.hlCau(c) !== null && c.n) cauSao.push(c); }));
    const tongN = cauSao.reduce((s, c) => s + c.n, 0);
    const haiLong = tongN ? cauSao.reduce((s, c) => s + this.hlCau(c) * c.n, 0) / tongN : null;
    const soPhieu = kqs.reduce((s, k) => s + (k.soPhieu || 0), 0);
    const choXM = kqs.reduce((s, k) => s + (k.choXacMinh || 0), 0);
    const dau = kqs[0] || {};
    return {
      live: true,
      hero: {
        so: [
          { nhan: 'Hài lòng (KS đang mở)', giaTri: haiLong === null ? '–' : ShinApp.ptVN(haiLong), mau: this.mau(haiLong) },
          { nhan: 'Phiếu hợp lệ', giaTri: ShinApp.soVN(soPhieu), mau: 'var(--c-blue)' },
          { nhan: `Đang mở · ${ShinApp.soVN(dem.nhap || 0)} nháp`, giaTri: ShinApp.soVN(dem.dangMo || 0), mau: dem.dangMo ? 'var(--c-green)' : 'var(--c-gray)' }
        ]
      },
      tieuDeTru: dau.tieuDe ? 'CÂU ĐÁNH GIÁ · ' + dau.tieuDe : '',
      chiSoNhom: (dau.cau || []).filter(c => c.tb !== undefined && c.tb !== null).map(c => ({
        nhan: c.noiDung || c.maCH || '',
        diem: ShinApp.soVN(c.tb, 2),
        tyLe: ShinApp.ptVN(this.hlCau(c)),
        mau: this.mau(this.hlCau(c))
      })),
      khaoSat: (dsKq.ds || []).map(k => ({ ma: k.maKS, ten: k.tieuDe, trangThai: k.trangThai, soPhieu: theoMa[k.maKS] ? theoMa[k.maKS].soPhieu : null, moTu: k.ngayTao, dongLuc: k.han })),
      choXacMinh: choXM,
      canXuLy: []
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

      ${d.choXacMinh ? `<div class="the-tin"><b>🔎 ${ShinApp.soVN(d.choXacMinh)} phiếu chờ xác minh</b> – xử lý trên app KS.</div>` : ''}
      ${cx.length ? `
        <div class="hn-tieu"><span>⚠️ Ý KIẾN ≤ 2★ CẦN XỬ LÝ · ${cx.length}</span></div>
        ${cx.map(x => `
          <div class="the">
            <div class="the-tin-dau"><b>${e(x.cau || x.khaoSat)}</b><span class="badge do">${e(x.diem)}★</span></div>
            <div class="chu-phu">${e([x.khaoSat, x.ngay].filter(Boolean).join(' · '))}</div>
            ${x.noiDung ? `<p class="chu-phu">💬 ${e(x.noiDung)}</p>` : ''}
          </div>`).join('')}` : ''}

      <div class="hn-tieu"><span>${e(d.tieuDeTru || '5 TRỤ CHẤT LƯỢNG · ACHSI')}</span></div>
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
      ${tru.length ? '' : `<div class="trong">${d.live ? 'Chưa có khảo sát đang mở có câu chấm điểm.' : 'Chưa có phiếu nào trong tháng.'}</div>`}

      ${ks.length ? `
        <details class="tq-gon">
          <summary><span>📋 Các khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
          ${ks.map(x => `<div class="hang-tru"><span>${e(x.ten)}<br><span class="chu-phu">${e([x.trangThai, x.moTu ? 'từ ' + x.moTu : '', x.dongLuc ? 'đến ' + x.dongLuc : ''].filter(Boolean).join(' · '))}</span></span><b>${x.soPhieu === null || x.soPhieu === undefined ? '' : ShinApp.soVN(x.soPhieu) + ' phiếu'}</b></div>`).join('')}
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
