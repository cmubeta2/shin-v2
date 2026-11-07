/**
 * SHIN v2 – Mảng 3: Tài chính & Thu chi
 * Live (v2.5.0 – HOP_DONG_CONG_V2.md mục Tài chính, máy chủ Hub): webTaiChinh({}) ➜
 *   {thang, thu, chi, ton, khoanChoDuyet: [{ma, khoanMuc, soTien, nguoiDeXuat, duAn, luc}], giaoDich: [{ngay, noiDung, soTien, nguon}]}
 *   Tiền là số đồng; giaoDich.soTien dương = thu, âm = chi. Khoản chờ duyệt đi qua Trung tâm Phê duyệt 0B.
 * Hub chưa mở cổng ➜ 'hanh' ➜ màn hiện MẪU (dải vàng).
 * v2.10.0 – M6.4 ✍️ Soạn đề xuất chi phía trình duyệt: kiểm đủ trường + tường lửa M9.5 ➜ sao chép phiếu để gửi
 *   kế toán / 0B (Hub chưa có cổng tạo phiếu chi – xin HUB L26 `webGuiDeXuatChi`). Không gửi gì lên máy chủ.
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

      <details class="tq-gon" id="tcDeXuat">
        <summary><span>✍️ Soạn đề xuất chi (M6.4)</span></summary>
        <label class="nhan-o" for="dxKhoan">Khoản mục *</label><input id="dxKhoan" class="form-input" maxlength="150" placeholder="VD: Thuê cẩu lắp máy">
        <label class="nhan-o" for="dxTien">Số tiền (đ) *</label><input id="dxTien" class="form-input" inputmode="numeric" maxlength="18" placeholder="VD: 3.000.000">
        <label class="nhan-o" for="dxDuAn">Dự án / hạng mục</label><input id="dxDuAn" class="form-input" maxlength="60" list="dxDsDuAn" placeholder="VD: DA-KSK01">
        <datalist id="dxDsDuAn">${[...new Set(cho.map(x => x.duAn).filter(Boolean))].map(m => `<option value="${e(m)}">`).join('')}</datalist>
        <label class="nhan-o" for="dxLyDo">Lý do *</label><textarea id="dxLyDo" class="form-input" rows="3" maxlength="500" placeholder="Vì sao cần chi, hạn cần tiền"></textarea>
        <button class="btn-primary" onclick="ModuleTaiChinh.saoChepDeXuat()">📋 Kiểm & sao chép phiếu</button>
      </details>

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn số</span></summary>
        <p class="chu-phu">✍️ Soạn đề xuất chi chỉ chạy trên máy anh/chị: kiểm đủ trường, chặn CCCD / BHYT / khóa rồi sao chép phiếu – chưa gửi lên Hub (chờ cổng HUB L26).</p>
        <p class="chu-phu">Thu qua chuyển khoản tự ghi từ SePay (VietQR); thu chi tay do kế toán nhập trên Hub. Mọi khoản chi mới phải qua Phê duyệt 1-chạm.</p>
      </details>
    `;
  },

  /** THUẦN – v2.10.0 M6.4: kiểm phiếu đề xuất chi ➜ {loi} hoặc {tin}. soTien đã đọc số (đồng). */
  kiemDeXuat: function(p, soat) {
    p = p || {};
    const khoan = String(p.khoanMuc || '').trim(), lyDo = String(p.lyDo || '').trim(), duAn = String(p.duAn || '').trim();
    const tien = Number(p.soTien);
    if (!khoan) return { loi: 'Chưa nhập khoản mục.' };
    if (!isFinite(tien) || tien <= 0) return { loi: 'Số tiền phải lớn hơn 0.' };
    if (tien > 1e12) return { loi: 'Số tiền quá lớn – kiểm lại.' };
    if (lyDo.length < 5) return { loi: 'Lý do cần ít nhất 5 ký tự.' };
    const vp = soat ? soat({ khoanMuc: khoan, duAn, lyDo }) : null;
    if (vp) return { loi: 'Phiếu có ' + vp.loai + ' – xóa đi (không đưa dữ liệu nhạy cảm vào phiếu).' };
    return { tin: ['💰 ĐỀ XUẤT CHI', '• Khoản mục: ' + khoan, '• Số tiền: ' + ShinApp.soVN(Math.round(tien)) + ' đ',
      duAn ? '• Dự án / hạng mục: ' + duAn : '', '• Lý do: ' + lyDo, '• Ngày: ' + ShinApp.ngayVN(),
      '→ Kế toán nhập Phê duyệt 0B'].filter(Boolean).join('\n') };
  },

  saoChepDeXuat: function() {
    const v = id => (document.getElementById(id) || {}).value || '';
    const kq = this.kiemDeXuat({ khoanMuc: v('dxKhoan'), soTien: ShinApp.docSoVN(v('dxTien')), duAn: v('dxDuAn'), lyDo: v('dxLyDo') },
      SHIN_API.soatKhongDuaVao);
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    const xong = () => ShinApp.toast('Đã sao chép phiếu – dán gửi kế toán / Telegram để nhập Phê duyệt 0B.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(kq.tin).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  }
};
