/**
 * SHIN v2 – Mảng 1: Khảo sát hài lòng (máy chủ 70_KhaoSat – app KS v1.4.3)
 * v2.6.6 (04/11, sửa theo mã v1 – trọng tài): KS KHÔNG có `webTongQuan`; cổng nhận (token, du) như Hub.
 *   webDsKhaoSat({}) ➜ {ok, ds:[{maKS, tieuDe, trangThai:'Nháp'|'Đang mở'|'Đã đóng', han, soCau, …}], dem:{dangMo, nhap, daDong}}
 *   webKetQuaKS({maKS, nguon?, tu?, den?}) ➜ {maKS, tieuDe, soPhieu, choXacMinh, theoNgay:[{ngay, n}], cau:[{maCH, loai, noiDung, n, tb?, tyLe?, nps?, yKien?}]}
 * (`ksSoLieu` chỉ đi qua liên thông Hub ký HMAC – trình duyệt không gọi được.) Màn KHÔNG hiện câu liên hệ / ý kiến chữ (QK4).
 */

const ModuleKhaoSat = {
  ma: 'khaosat',
  ten: 'Khảo Sát',
  bieuTuong: '🩺',
  paletteMacDinh: 'clinical',
  mayChu: 'KS',
  _chon: '',

  taiLive: async function() {
    const ds = await SHIN_API.goi('KS', 'webDsKhaoSat', {});
    if (!ds.ok) return ds;
    const dsKS = (ds.data && ds.data.ds) || [];
    const chon = dsKS.find(x => x.maKS === this._chon) || dsKS.find(x => x.trangThai === 'Đang mở') || dsKS[0];
    let kq = null, ghiChu = '';
    if (chon) {
      const r = await SHIN_API.goi('KS', 'webKetQuaKS', { maKS: chon.maKS });
      if (r.ok) kq = r.data; else ghiChu = 'Không tải được kết quả khảo sát: ' + SHIN_API.moTaLoi(r);
    }
    this._chon = chon ? chon.maKS : '';
    const out = { ok: true, data: this.tuV1(ds.data, kq) };
    if (ghiChu) out.ghiChu = ghiChu;
    return out;
  },

  chonKS: async function(ma) {
    this._chon = ma;
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Chế độ trình diễn – chọn khảo sát chạy khi có token Hub.', 'info'); return; }
    ShinApp.chuyenModule('khaosat');
  },

  mau: function(tyLe) {
    return tyLe === null || tyLe === undefined ? 'var(--c-gray)' : tyLe >= 0.9 ? 'var(--c-green)' : tyLe >= 0.8 ? 'var(--c-yellow)' : 'var(--c-red)';
  },

  /** THUẦN. webDsKhaoSat + webKetQuaKS ➜ khuôn màn. Câu sao (tb) ➜ dòng chỉ số; bỏ câu liên hệ / chữ. */
  tuV1: function(d, k) {
    d = d || {}; k = k || {};
    const dem = d.dem || {};
    const sao = (k.cau || []).filter(c => typeof c.tb === 'number');
    const tbChung = sao.length ? sao.reduce((t, c) => t + c.tb, 0) / sao.length : null;
    const nps = (k.cau || []).find(c => typeof c.nps === 'number');
    return {
      live: true,
      chon: this._chon,
      tieuDe: k.tieuDe || '',
      hero: {
        so: [
          { nhan: 'Điểm TB (/5)', giaTri: tbChung === null ? '–' : ShinApp.soVN(tbChung, 2), mau: this.mau(tbChung === null ? null : tbChung / 5) },
          { nhan: 'Phiếu hợp lệ', giaTri: ShinApp.soVN(k.soPhieu || 0), mau: 'var(--c-blue)' },
          nps ? { nhan: 'NPS', giaTri: ShinApp.soVN(nps.nps), mau: nps.nps >= 50 ? 'var(--c-green)' : nps.nps >= 0 ? 'var(--c-yellow)' : 'var(--c-red)' }
              : { nhan: 'Chờ xác minh', giaTri: ShinApp.soVN(k.choXacMinh || 0), mau: k.choXacMinh ? 'var(--c-yellow)' : 'var(--c-gray)' }
        ]
      },
      chiSoNhom: sao.map(c => ({ nhan: c.noiDung || c.maCH, diem: ShinApp.soVN(c.tb, 2), tyLe: ShinApp.soVN(c.n || 0) + ' lượt', mau: this.mau(c.tb / 5) })),
      khaoSat: (d.ds || []).map(x => ({ ma: x.maKS, ten: x.tieuDe, trangThai: x.trangThai, dongLuc: x.han, soCau: x.soCau })),
      dem,
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

      ${cx.length ? `
        <div class="hn-tieu"><span>⚠️ Ý KIẾN ≤ 2★ CẦN XỬ LÝ · ${cx.length}</span></div>
        ${cx.map(x => `
          <div class="the">
            <div class="the-tin-dau"><b>${e(x.cau || x.khaoSat)}</b><span class="badge do">${e(x.diem)}★</span></div>
            <div class="chu-phu">${e([x.khaoSat, x.ngay].filter(Boolean).join(' · '))}</div>
            ${x.noiDung ? `<p class="chu-phu">💬 ${e(x.noiDung)}</p>` : ''}
          </div>`).join('')}` : ''}

      <div class="hn-tieu"><span>${d.live ? 'ĐIỂM TỪNG CÂU · ' + e(d.tieuDe || 'chưa có khảo sát') : '5 TRỤ CHẤT LƯỢNG · ACHSI'}</span></div>
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
      ${tru.length ? '' : `<div class="trong">${d.live ? 'Khảo sát này chưa có câu chấm sao / chưa có phiếu.' : 'Chưa có phiếu nào trong tháng.'}</div>`}

      ${ks.length ? `
        <details class="tq-gon" ${d.live ? "open" : ""}>
          <summary><span>📋 Các khảo sát</span><span class="tom-tat">${ks.length}</span></summary>
          ${ks.map(x => `<div class="hang-tru" ${x.ma ? `role="button" tabindex="0" style="cursor:pointer;min-height:44px" onclick="ModuleKhaoSat.chonKS('${e(x.ma)}')"` : ''}><span>${x.ma && x.ma === d.chon ? '▶ ' : ''}${e(x.ten)}<br><span class="chu-phu">${e([x.trangThai, x.moTu ? 'từ ' + x.moTu : '', x.dongLuc ? 'đến ' + x.dongLuc : ''].filter(Boolean).join(' · '))}</span></span><b>${x.soPhieu !== undefined ? ShinApp.soVN(x.soPhieu) + ' phiếu' : ShinApp.soVN(x.soCau || 0) + ' câu'}</b></div>`).join('')}
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
