/**
 * SHIN v2 – Mảng 3: Tài chính & Thu chi
 * Live (v2.5.0 – HOP_DONG_CONG_V2.md mục Tài chính, máy chủ Hub): webTaiChinh({}) ➜
 *   {thang, thu, chi, ton, khoanChoDuyet: [{ma, khoanMuc, soTien, nguoiDeXuat, duAn, luc}], giaoDich: [{ngay, noiDung, soTien, nguon}]}
 *   Tiền là số đồng; giaoDich.soTien dương = thu, âm = chi. Khoản chờ duyệt đi qua Trung tâm Phê duyệt 0B.
 * Hub chưa mở cổng ➜ 'hanh' ➜ màn hiện MẪU (dải vàng).
 * v2.10.0 – M6.4 ✍️ Soạn đề xuất chi phía trình duyệt: kiểm đủ trường + tường lửa M9.5 ➜ sao chép phiếu để gửi
 *   kế toán / 0B (Hub chưa có cổng tạo phiếu chi – xin HUB L26 `webGuiDeXuatChi`). Không gửi gì lên máy chủ.
 * v2.10.1 – M3.4 gộp 1 form: loại Chi / Tạm ứng (hạn hoàn ứng) / Thanh toán (số chứng từ), kiểm theo luật L26 Hub v1.15.7,
 *   kiemDeXuat trả thêm `goi` = tham số webGuiDeXuatChi (nối thật khi L26 lên app – thêm maGui chống trùng).
 * v2.10.2 – M3.2 ngân sách & giải ngân theo dự án: Live đọc thêm webDuAn (duAn.nganSach / daChi, flash.taiChinh.phatSinh),
 *   cảnh báo vượt / sắp chạm dự toán cấp dự án. Dự toán theo khoản mục: v1 chưa có dữ liệu ➜ không làm.
 */

const ModuleTaiChinh = {
  ma: 'taichinh',
  ten: 'Tài Chính',
  bieuTuong: '💰',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',

  taiLive: async function() {
    const [kq, da] = await Promise.all([SHIN_API.goi('HUB', 'webTaiChinh', {}), SHIN_API.goi('HUB', 'webDuAn', {})]);
    if (!kq.ok) return kq;
    // v2.10.2 M3.2: webDuAn lỗi ➜ chỉ khối ngân sách báo lỗi, KHÔNG thay bằng số mẫu
    const d = da.ok && da.data ? da.data : null;
    const them = d ? { duAnNS: d.duAn || [], phatSinh: ((d.flash || {}).taiChinh || {}).phatSinh || [] }
      : { duAnNS: null, loiDuAn: da.chiTiet || da.loi || 'không đọc được' };
    return { ok: true, data: Object.assign({ live: true }, kq.data || {}, them) };
  },

  /** THUẦN – v2.10.2 M3.2: ngân sách vs đã chi theo dự án (cấp DỰ ÁN – v1 chưa có dự toán theo khoản mục).
   *  Bỏ dự án Đóng / Hoàn thành / Hủy. tyLe = null khi chưa có ngân sách. Ngưỡng như Hub mucDoDuAn: > 100% đỏ, > 90% vàng.
   *  daChi âm (điều chỉnh) tính 0. Sắp xếp tỷ lệ giảm dần, chưa có dự toán cuối. */
  lechDuToan: function(ds, docSo) {
    const so = v => { const n = typeof v === 'number' ? v : (docSo ? docSo(v) : Number(v)); return isFinite(n) ? n : 0; };
    const kq = (ds || []).filter(x => x && !/đóng|hoàn thành|hủy|huỷ/i.test(String(x.trangThai || ''))).map(x => {
      const ns = Math.max(0, so(x.nganSach)), chi = Math.max(0, so(x.daChi));
      const tyLe = ns > 0 ? chi / ns * 100 : null;
      const muc = tyLe === null ? 'chua' : tyLe > 100 ? 'do' : tyLe > 90 ? 'vang' : 'xanh';
      return { ma: String(x.ma || ''), ten: String(x.ten || x.ma || ''), nganSach: ns, daChi: chi, conLai: ns - chi, tyLe, muc };
    });
    kq.sort((a, b) => (b.tyLe === null ? -1 : b.tyLe) - (a.tyLe === null ? -1 : a.tyLe));
    return { ds: kq, vuot: kq.filter(x => x.muc === 'do').length, sapVuot: kq.filter(x => x.muc === 'vang').length };
  },

  /** Khối M3.2 – HTML. */
  veNganSach: function(d) {
    const e = ShinApp.esc, trieu = v => ShinApp.soVN(v / 1e6, 1) + ' tr';
    if (!d.duAnNS) return `<div class="hn-tieu"><span>NGÂN SÁCH & GIẢI NGÂN THEO DỰ ÁN</span></div>
      <div class="trong" style="color:var(--c-red)">⚠️ Không đọc được cổng webDuAn: ${e(d.loiDuAn || '')} – khối này để trống, không dùng số mẫu.</div>`;
    const r = this.lechDuToan(d.duAnNS, ShinApp.docSoVN);
    const MAU = { do: 'var(--c-red)', vang: 'var(--c-yellow)', xanh: 'var(--c-green)', chua: 'var(--text-muted)' };
    const NHAN = { do: 'Vượt dự toán', vang: 'Sắp chạm trần', xanh: 'Trong dự toán', chua: 'Chưa có dự toán' };
    const ps = d.phatSinh || [];
    return `
      <div class="hn-tieu"><span>NGÂN SÁCH & GIẢI NGÂN THEO DỰ ÁN · ${r.ds.length}${r.vuot ? ' · ' + r.vuot + ' vượt' : ''}${r.sapVuot ? ' · ' + r.sapVuot + ' sắp chạm' : ''}</span></div>
      ${r.ds.length ? r.ds.map(x => `
        <div class="hang-tru" style="flex-wrap:wrap"><span style="flex:1 1 60%;min-width:0"><b>${e(x.ma)}</b> ${e(x.ten === x.ma ? '' : x.ten)}<br>
          <span class="chu-phu">Đã chi ${e(trieu(x.daChi))} / ${x.nganSach ? e(trieu(x.nganSach)) : '–'}${x.tyLe === null ? '' : ' · ' + ShinApp.soVN(x.tyLe, 0) + '%'}</span></span>
          <b style="color:${MAU[x.muc]}">${e(NHAN[x.muc])}${x.muc === 'do' ? '<br>+' + e(trieu(-x.conLai)) : ''}</b>
          ${x.tyLe === null ? '' : `<div class="thanh-tien" style="flex-basis:100%"><div style="width:${Math.min(100, x.tyLe).toFixed(1)}%;background:${MAU[x.muc]}"></div></div>`}
        </div>`).join('') : '<div class="trong">Không có dự án đang chạy.</div>'}
      ${ps.length ? `<div class="hn-tieu"><span>CHI PHÁT SINH (FLASH DỰ ÁN) · ${ps.length}</span></div>
        ${ps.map(x => `<div class="hang-tru"><span>${e(x.khoanMuc)}<br><span class="chu-phu">${e([x.nguoiChi, x.tinhTrang].filter(Boolean).join(' · '))}</span></span>
          <b>${e(ShinApp.soVN(Math.abs(ShinApp.docSoVN(x.soTien) || 0)))} đ</b></div>`).join('')}` : ''}`;
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

      ${this.veNganSach(d)}

      <details class="tq-gon" id="tcDeXuat">
        <summary><span>✍️ Đề xuất chi / Tạm ứng / Thanh toán (M6.4 · M3.4)</span></summary>
        <label class="nhan-o" for="dxLoai">Loại phiếu *</label>
        <select id="dxLoai" class="form-input" onchange="ModuleTaiChinh.doiLoai()">
          <option value="Chi">Đề xuất chi</option><option value="Tạm ứng">Đề nghị tạm ứng</option><option value="Thanh toán">Thanh toán / hoàn ứng</option>
        </select>
        <div id="dxOHan" hidden><label class="nhan-o" for="dxHan">Hạn hoàn ứng (dd/mm/yyyy) *</label><input id="dxHan" class="form-input" inputmode="numeric" maxlength="10" placeholder="VD: 30/11/2026"></div>
        <div id="dxOCT" hidden><label class="nhan-o" for="dxCT">Số hóa đơn / chứng từ</label><input id="dxCT" class="form-input" maxlength="60" placeholder="VD: HĐ 0001234 hoặc mã tạm ứng"></div>
        <label class="nhan-o" for="dxKhoan">Khoản mục *</label><input id="dxKhoan" class="form-input" maxlength="120" placeholder="VD: Thuê cẩu lắp máy">
        <label class="nhan-o" for="dxTien">Số tiền (đ) *</label><input id="dxTien" class="form-input" inputmode="numeric" maxlength="18" placeholder="VD: 3.000.000">
        <label class="nhan-o" for="dxDuAn">Dự án / hạng mục</label><input id="dxDuAn" class="form-input" maxlength="60" list="dxDsDuAn" placeholder="VD: DA-KSK01">
        <datalist id="dxDsDuAn">${[...new Set(cho.map(x => x.duAn).filter(Boolean))].map(m => `<option value="${e(m)}">`).join('')}</datalist>
        <label class="nhan-o" for="dxLyDo">Lý do *</label><textarea id="dxLyDo" class="form-input" rows="3" maxlength="500" placeholder="Vì sao cần chi, hạn cần tiền"></textarea>
        <button class="btn-primary" onclick="ModuleTaiChinh.saoChepDeXuat()">📋 Kiểm & sao chép phiếu</button>
      </details>

      <details class="tq-gon">
        <summary><span>ⓘ Nguồn số</span></summary>
        <p class="chu-phu">✍️ Đề xuất chi / tạm ứng / thanh toán chỉ chạy trên máy anh/chị: kiểm đủ trường theo luật Hub, chặn CCCD / BHYT / khóa rồi sao chép phiếu – chưa gửi lên Hub (Còn chờ v1: cổng HUB L26 <code>webGuiDeXuatChi</code> đã code ở Hub v1.15.7, chưa lên app).</p>
        <p class="chu-phu">Thu qua chuyển khoản tự ghi từ SePay (VietQR); thu chi tay do kế toán nhập trên Hub. Mọi khoản chi mới phải qua Phê duyệt 1-chạm.</p>
      </details>
    `;
  },

  /** Hiện ô theo loại phiếu: Tạm ứng ➜ hạn hoàn ứng; Thanh toán ➜ số chứng từ (progressive disclosure). */
  doiLoai: function() {
    const loai = (document.getElementById('dxLoai') || {}).value || 'Chi';
    const han = document.getElementById('dxOHan'), ct = document.getElementById('dxOCT');
    if (han) han.hidden = loai !== 'Tạm ứng';
    if (ct) ct.hidden = loai !== 'Thanh toán';
  },

  /** THUẦN – v2.10.1 M3.4 (+ M6.4): kiểm phiếu theo đúng luật HUB L26 `kiemDeXuatChi` (Hub v1.15.7) ➜ {loi} hoặc {tin, goi}.
   *  soTien đã đọc số (đồng). loai: Chi | Tạm ứng | Thanh toán. hanHoanUng dd/mm/yyyy chỉ khi Tạm ứng (bắt buộc, không ở quá khứ
   *  so với homNay 'dd/mm/yyyy' nếu truyền); soChungTu ≤ 60. goi = gói tham số cho `webGuiDeXuatChi` khi cổng lên app. */
  kiemDeXuat: function(p, soat, homNay) {
    p = p || {};
    const LOAI = { 'Chi': 'ĐỀ XUẤT CHI', 'Tạm ứng': 'ĐỀ NGHỊ TẠM ỨNG', 'Thanh toán': 'ĐỀ NGHỊ THANH TOÁN' };
    const loai = LOAI[p.loai] ? p.loai : (p.loai ? '' : 'Chi');
    const khoan = String(p.khoanMuc || '').trim(), lyDo = String(p.lyDo || '').trim(), duAn = String(p.duAn || '').trim();
    const han = String(p.hanHoanUng || '').trim(), ct = String(p.soChungTu || '').trim();
    const tien = Number(p.soTien);
    if (!loai) return { loi: 'Loại phiếu không hợp lệ.' };
    if (!khoan) return { loi: 'Chưa nhập khoản mục.' };
    if (khoan.length > 120) return { loi: 'Khoản mục tối đa 120 ký tự.' };
    if (!isFinite(tien) || tien <= 0) return { loi: 'Số tiền phải lớn hơn 0.' };
    if (tien > 1e12) return { loi: 'Số tiền quá lớn – kiểm lại.' };
    if (lyDo.length < 5) return { loi: 'Lý do cần ít nhất 5 ký tự.' };
    if (lyDo.length > 500) return { loi: 'Lý do tối đa 500 ký tự.' };
    if (ct.length > 60) return { loi: 'Số chứng từ tối đa 60 ký tự.' };
    let hanOk = '';
    if (loai === 'Tạm ứng') {
      const m = han.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (!m) return { loi: 'Tạm ứng cần hạn hoàn ứng dạng dd/mm/yyyy.' };
      const d = +m[1], th = +m[2], n = +m[3], dt = new Date(n, th - 1, d);
      if (dt.getFullYear() !== n || dt.getMonth() !== th - 1 || dt.getDate() !== d) return { loi: 'Hạn hoàn ứng không phải ngày có thật.' };
      const h = String(homNay || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
      if (h && dt < new Date(+h[3], +h[2] - 1, +h[1])) return { loi: 'Hạn hoàn ứng đã qua – chọn ngày từ hôm nay.' };
      hanOk = String(d).padStart(2, '0') + '/' + String(th).padStart(2, '0') + '/' + n;
    }
    const vp = soat ? soat({ khoanMuc: khoan, duAn, lyDo, soChungTu: ct }) : null;
    if (vp) return { loi: 'Phiếu có ' + vp.loai + ' – xóa đi (không đưa dữ liệu nhạy cảm vào phiếu).' };
    const so = Math.round(tien);
    const goi = { loai, khoanMuc: khoan, soTien: so, duAn, lyDo };
    if (hanOk) goi.hanHoanUng = hanOk;
    if (ct && loai !== 'Tạm ứng') goi.soChungTu = ct;
    return { goi, tin: ['💰 ' + LOAI[loai], '• Khoản mục: ' + khoan, '• Số tiền: ' + ShinApp.soVN(so) + ' đ',
      duAn ? '• Dự án / hạng mục: ' + duAn : '', hanOk ? '• Hạn hoàn ứng: ' + hanOk : '', goi.soChungTu ? '• Chứng từ: ' + goi.soChungTu : '',
      '• Lý do: ' + lyDo, '• Ngày: ' + ShinApp.ngayVN(), '→ Kế toán nhập Phê duyệt 0B'].filter(Boolean).join('\n') };
  },

  saoChepDeXuat: function() {
    const v = id => (document.getElementById(id) || {}).value || '';
    const kq = this.kiemDeXuat({ loai: v('dxLoai') || 'Chi', khoanMuc: v('dxKhoan'), soTien: ShinApp.docSoVN(v('dxTien')), duAn: v('dxDuAn'),
      lyDo: v('dxLyDo'), hanHoanUng: v('dxHan'), soChungTu: v('dxCT') }, SHIN_API.soatKhongDuaVao, ShinApp.ngayVN());
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    const xong = () => ShinApp.toast('Đã sao chép phiếu – dán gửi kế toán / Telegram để nhập Phê duyệt 0B.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(kq.tin).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  }
};
