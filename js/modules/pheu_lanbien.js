/**
 * SHIN v2 – M8.5 Xưởng phễu Lặn Biển (0m ➜ -105m) + xuất bản đa nền tảng (M-WEB-01/02)
 * Gắn trong 📣 Marketing. Điền nội dung 5 tầng sâu ➜ xem trước ➜ tải 1 tệp index.html tĩnh tự chứa
 * (kéo thả lên Netlify Drop / Cloudflare Pages / Vercel). Lưu nháp trên máy này, không gọi máy chủ, không gọi AI.
 */
const PheuLanBien = {
  KHOA: 'shin_mkt_lanbien',
  _d: null,
  _hen: null,

  MANG: [
    { ma: 'tuyensinh', ten: '🎓 Tuyển sinh' },
    { ma: 'phongkham', ten: '🩺 Phòng khám' },
    { ma: 'ksk', ten: '🏢 Khám sức khỏe' },
    { ma: 'khac', ten: '• Khác' }
  ],

  TANG: [
    { ma: 't0', sau: '0m', ten: 'Mặt nước – Thu hút', goiY: 'Người đọc lướt 3 giây: 1 tiêu đề lớn + 1 câu hứa hẹn rõ lợi ích.',
      truong: [{ k: 'tieuDe', nhan: 'Tiêu đề lớn', bb: 1 }, { k: 'phuDe', nhan: 'Câu hứa hẹn (lợi ích chính)', bb: 1 }] },
    { ma: 't15', sau: '-15m', ten: 'Khơi đúng băn khoăn', goiY: 'Gọi tên 3 điều người đọc đang lo – mỗi dòng 1 ý.',
      truong: [{ k: 'vanDe', nhan: 'Băn khoăn của người đọc (mỗi dòng 1 ý)', dong: 1, bb: 1 }] },
    { ma: 't30', sau: '-30m', ten: 'Giải pháp & bằng chứng', goiY: 'Cách mình giải quyết + cảm nhận / số liệu thật (đã được đồng ý).',
      truong: [{ k: 'giaiPhap', nhan: 'Giải pháp (mỗi dòng 1 ý)', dong: 1, bb: 1 }, { k: 'bangChung', nhan: 'Bằng chứng xã hội – cảm nhận, số liệu (mỗi dòng 1 ý)', dong: 1 }] },
    { ma: 't60', sau: '-60m', ten: 'Lời đề nghị & giải tỏa', goiY: 'Ưu đãi cụ thể + trả lời trước các câu hay hỏi.',
      truong: [{ k: 'uuDai', nhan: 'Lời đề nghị / ưu đãi', bb: 1 }, { k: 'hoiDap', nhan: 'Hỏi – đáp (mỗi dòng: câu hỏi | trả lời)', dong: 1 }] },
    { ma: 't105', sau: '-105m', ten: 'Đáy biển – Chốt', goiY: '1 nút hành động duy nhất, nói rõ bấm xong được gì.',
      truong: [{ k: 'cta', nhan: 'Chữ trên nút', bb: 1 }, { k: 'ctaLink', nhan: 'Đường dẫn nút (https://…, tel:…, mailto:…)', bb: 1 }, { k: 'hanChot', nhan: 'Hạn / số suất (tùy chọn)' }] }
  ],

  /** Bộ MẪU (không chứa dữ liệu thật – đường dẫn để trống cho người dùng điền). */
  MAU: {
    tuyensinh: { tenTrang: 'Tuyển sinh Điều dưỡng 2027', mang: 'tuyensinh', tieuDe: 'Học Điều dưỡng – có việc ngay khi ra trường',
      phuDe: 'Thực hành tại bệnh viện từ năm nhất, giới thiệu việc làm sau tốt nghiệp.',
      vanDe: 'Sợ học xong khó xin việc\nLo học phí và chi phí sinh hoạt\nChưa biết ngành có hợp với mình không',
      giaiPhap: 'Thực hành lâm sàng ngay tại bệnh viện\nHọc bổng và trả góp học phí theo kỳ\nBuổi trải nghiệm nghề miễn phí trước khi đăng ký',
      bangChung: '“Em được nhận làm ngay tại khoa thực tập.” – Cựu sinh viên (MẪU)\nNhiều khóa đã tốt nghiệp (số liệu MẪU – thay bằng số thật)',
      uuDai: 'Đăng ký trước hạn: miễn lệ phí xét tuyển (MẪU – thay bằng ưu đãi thật)',
      hoiDap: 'Có cần điểm cao không? | Xét học bạ, xem điều kiện cụ thể ở trang tuyển sinh.\nHọc ở đâu? | Thay bằng địa chỉ thật.',
      cta: 'Đăng ký tư vấn miễn phí', ctaLink: '', hanChot: 'Hạn đăng ký: thay bằng ngày thật' },
    ksk: { tenTrang: 'Gói khám sức khỏe doanh nghiệp', mang: 'ksk', tieuDe: 'Khám sức khỏe cho cả công ty trong 1 buổi sáng',
      phuDe: 'Đội khám đến tận nơi, có kết quả và tư vấn sau khám.',
      vanDe: 'Nhân viên khó sắp xếp thời gian đi khám\nThủ tục hồ sơ rườm rà\nKhông biết chọn gói nào cho phù hợp',
      giaiPhap: 'Khám lưu động tại doanh nghiệp\nHồ sơ, kết quả tổng hợp gửi bộ phận nhân sự\nTư vấn chọn gói theo độ tuổi và ngành nghề',
      bangChung: '“Cả công ty khám xong trước giờ nghỉ trưa.” – Doanh nghiệp (MẪU)',
      uuDai: 'Báo giá theo số người – ưu đãi nhóm (MẪU – thay bằng ưu đãi thật)',
      hoiDap: 'Bao lâu có kết quả? | Thay bằng thời gian thật.\nCó khám ngoài giờ không? | Thay bằng lịch thật.',
      cta: 'Nhận báo giá', ctaLink: '', hanChot: '' }
  },

  // ===== THUẦN =====
  tachDong: function(s) { return String(s || '').split(/\r?\n/).map(x => x.trim()).filter(Boolean); },
  /** "câu hỏi | trả lời" ➜ [{h, d}] (dòng thiếu dấu | bỏ qua). */
  tachHoiDap: function(s) {
    return this.tachDong(s).map(x => { const i = x.indexOf('|'); return i > 0 ? { h: x.slice(0, i).trim(), d: x.slice(i + 1).trim() } : null; }).filter(x => x && x.h && x.d);
  },
  /** Chỉ nhận https://, http://, tel:, mailto: ➜ trả lại chuỗi đã gọn; sai ➜ ''. */
  linkHopLe: function(u) {
    const s = String(u || '').trim();
    if (/^https?:\/\/[^\s"'<>]+\.[^\s"'<>]+$/i.test(s)) return s;
    if (/^tel:\+?[0-9 .-]{6,20}$/i.test(s)) return s.replace(/[ .-]/g, '');
    if (/^mailto:[^\s"'<>@]+@[^\s"'<>@]+\.[^\s"'<>@]+$/i.test(s)) return s;
    return '';
  },
  /** % trường bắt buộc đã điền của từng tầng ➜ [{ma, pt}] */
  doSau: function(d) {
    d = d || {};
    return this.TANG.map(t => { const bb = t.truong.filter(f => f.bb); const du = bb.filter(f => String(d[f.k] || '').trim()).length; return { ma: t.ma, sau: t.sau, pt: bb.length ? Math.round(du * 100 / bb.length) : 100 }; });
  },
  /** Kiểm trước khi xuất ➜ {thieu: [nhãn], loi: [chuỗi]} */
  kiem: function(d) {
    d = d || {};
    const thieu = [], loi = [];
    if (!String(d.tenTrang || '').trim()) thieu.push('Tên trang');
    this.TANG.forEach(t => t.truong.forEach(f => { if (f.bb && !String(d[f.k] || '').trim()) thieu.push(t.sau + ' · ' + f.nhan); }));
    if (String(d.ctaLink || '').trim() && !this.linkHopLe(d.ctaLink)) loi.push('Đường dẫn nút chưa đúng (chỉ nhận https://, tel:, mailto:).');
    if (String(d.hoiDap || '').trim() && this.tachHoiDap(d.hoiDap).length < this.tachDong(d.hoiDap).length) loi.push('Có dòng hỏi – đáp thiếu dấu "|" – dòng đó sẽ bị bỏ.');
    const tatCa = this.TANG.map(t => t.truong.map(f => d[f.k] || '').join('\n')).join('\n');
    const cam = (typeof ModuleMarketing !== 'undefined' && ModuleMarketing.kiemTuCam) ? ModuleMarketing.kiemTuCam(tatCa, d.mang) : [];
    if (cam.length) loi.push('Quảng cáo y tế không dùng: ' + cam.join(', ') + '.');
    if (/MẪU/.test(tatCa)) loi.push('Còn chữ "MẪU" – thay bằng nội dung thật trước khi đăng.');
    return { thieu, loi };
  },
  _esc: function(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); },
  /** Sinh 1 tệp HTML tĩnh tự chứa (CSS nội tuyến, không JS, không tải gì bên ngoài). */
  taoHTML: function(d) {
    d = d || {};
    const e = s => this._esc(s);
    const li = arr => arr.map(x => `<li>${e(x)}</li>`).join('');
    const link = this.linkHopLe(d.ctaLink) || '#';
    const hd = this.tachHoiDap(d.hoiDap), bc = this.tachDong(d.bangChung);
    const nut = `<a class="nut" href="${e(link)}"${/^https?:/i.test(link) ? ' target="_blank" rel="noopener"' : ''}>${e(d.cta || 'Liên hệ')}</a>`;
    return `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(d.tenTrang || d.tieuDe || 'Trang giới thiệu')}</title><meta name="description" content="${e(d.phuDe || '')}">
<style>
:root{--chu:#0f172a;--phu:#475569;--nen:#ffffff;--nhan:#0e7490;--nut:#0e7490;--nut-chu:#ffffff}
*{box-sizing:border-box}body{margin:0;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--chu);background:var(--nen)}
section{padding:48px 16px}.khung{max-width:720px;margin:0 auto}h1{font-size:clamp(28px,6vw,44px);line-height:1.2;margin:0 0 12px}
h2{font-size:clamp(22px,4.5vw,30px);margin:0 0 12px}p,li{font-size:17px}ul{padding-left:20px}.sau{font-size:14px;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.t0{background:#e0f7fa}.t15{background:#b2ebf2}.t30{background:#4dd0e1}.t60{background:#00838f;color:#fff}.t105{background:#003c4f;color:#fff}
.t60 .sau,.t105 .sau{color:#b2ebf2}.nut{display:inline-block;min-height:48px;padding:12px 28px;border-radius:999px;background:var(--nut);color:var(--nut-chu);font-weight:700;text-decoration:none;font-size:18px}
.t105 .nut{background:#ffffff;color:#003c4f}blockquote{margin:0 0 12px;padding:12px 16px;border-left:4px solid currentColor;background:rgba(255,255,255,.35)}
details{background:rgba(255,255,255,.12);border-radius:12px;padding:12px 16px;margin:0 0 8px}summary{cursor:pointer;font-weight:700;min-height:44px;display:flex;align-items:center}
.han{margin-top:12px;font-weight:700}footer{padding:16px;text-align:center;font-size:14px;color:var(--phu)}
@media (prefers-color-scheme:dark){:root{--chu:#e2e8f0;--phu:#94a3b8;--nen:#0b1220}.t0{background:#083344}.t15{background:#0c4a6e}.t30{background:#155e75}}
</style></head><body>
<section class="t0"><div class="khung"><div class="sau">0m</div><h1>${e(d.tieuDe)}</h1><p>${e(d.phuDe)}</p>${nut}</div></section>
<section class="t15"><div class="khung"><div class="sau">-15m</div><h2>Bạn có đang băn khoăn?</h2><ul>${li(this.tachDong(d.vanDe))}</ul></div></section>
<section class="t30"><div class="khung"><div class="sau">-30m</div><h2>Giải pháp</h2><ul>${li(this.tachDong(d.giaiPhap))}</ul>${bc.map(x => `<blockquote>${e(x)}</blockquote>`).join('')}</div></section>
<section class="t60"><div class="khung"><div class="sau">-60m</div><h2>${e(d.uuDai)}</h2>${hd.map(x => `<details><summary>${e(x.h)}</summary><p>${e(x.d)}</p></details>`).join('')}</div></section>
<section class="t105"><div class="khung"><div class="sau">-105m</div><h2>${e(d.tieuDe)}</h2>${nut}${String(d.hanChot || '').trim() ? `<div class="han">${e(d.hanChot)}</div>` : ''}</div></section>
<footer>${e(d.tenTrang || '')}</footer>
</body></html>`;
  },

  // ===== LƯU MÁY =====
  doc: function() { try { const o = JSON.parse(localStorage.getItem(this.KHOA) || 'null'); return o && typeof o === 'object' ? o : null; } catch (e) { return null; } },
  ghi: function() { try { localStorage.setItem(this.KHOA, JSON.stringify(this._d || {})); return true; } catch (e) { return false; } },

  // ===== GIAO DIỆN =====
  render: function(el) {
    if (!el) return;
    if (!this._d) this._d = this.doc() || Object.assign({}, this.MAU.tuyensinh);
    const d = this._d, e = ShinApp.esc;
    const o = (f) => f.dong
      ? `<textarea class="form-input lb-input lb-textarea" rows="3" data-k="${f.k}" aria-label="${e(f.nhan)}" oninput="PheuLanBien.nhap(this)">${e(d[f.k] || '')}</textarea>`
      : `<input class="form-input lb-input" data-k="${f.k}" aria-label="${e(f.nhan)}" value="${e(d[f.k] || '')}" oninput="PheuLanBien.nhap(this)">`;
    el.innerHTML = `
      <div class="lb-khung">
        <p class="chu-phu lb-mo-dau">Điền nội dung từ mặt nước (thu hút) xuống đáy (chốt) ➜ xem trước ➜ tải <b>index.html</b> và kéo thả lên nơi đăng web. Nháp lưu trên máy này.</p>
        <div class="lb-hang-mau" role="group" aria-label="Nạp bộ mẫu">
          <button type="button" class="btn-secondary lb-btn-mau" onclick="PheuLanBien.napMau('tuyensinh')">🎓 Mẫu tuyển sinh</button>
          <button type="button" class="btn-secondary lb-btn-mau" onclick="PheuLanBien.napMau('ksk')">🏢 Mẫu khám sức khỏe</button>
          <button type="button" class="btn-secondary lb-btn-mau" onclick="PheuLanBien.xoaNhap()">🧹 Trang trắng</button>
        </div>
        <div class="lb-nhom-cauhinh">
          <label class="lb-nhan-cauhinh">
            <span class="lb-tieude-cauhinh">Tên trang</span>
            <input class="form-input lb-input" data-k="tenTrang" value="${e(d.tenTrang || '')}" oninput="PheuLanBien.nhap(this)">
          </label>
          <label class="lb-nhan-cauhinh">
            <span class="lb-tieude-cauhinh">Lĩnh vực (để kiểm từ cấm quảng cáo y tế)</span>
            <select class="form-input lb-input lb-select" data-k="mang" onchange="PheuLanBien.nhap(this)">${this.MANG.map(m => `<option value="${m.ma}"${d.mang === m.ma ? ' selected' : ''}>${e(m.ten)}</option>`).join('')}</select>
          </label>
        </div>
        <div id="lbDoSau" class="lb-dosau-khung"></div>
        <div class="lb-danhsach-tang">
          ${this.TANG.map(t => `<div class="lb-tang lb-tang-${t.ma}">
            <div class="lb-tang-dau">
              <span class="lb-tang-sau-nhan">${e(t.sau)}</span>
              <div class="lb-tang-tieu-de-nhom">
                <div class="lb-tang-ten">${e(t.ten)}</div>
                <div class="lb-tang-goiy">${e(t.goiY)}</div>
              </div>
            </div>
            <div class="lb-tang-than">
              ${t.truong.map(f => `<label class="lb-nhan-truong">
                <span class="lb-ten-truong">${e(f.nhan)}${f.bb ? ' <span class="lb-dau-bb">*</span>' : ''}</span>
                ${o(f)}
              </label>`).join('')}
            </div>
          </div>`).join('')}
        </div>
        <div id="lbKiem" class="lb-kiem-khung"></div>
        <div class="lb-hang-xuat">
          <button type="button" class="btn-primary lb-btn-chinh" onclick="PheuLanBien.taiVe()">⬇️ Tải index.html</button>
          <div class="lb-hang-xuat-phu">
            <button type="button" class="btn-secondary lb-btn-phu" onclick="PheuLanBien.xemTruoc()">👁 Xem trước</button>
            <button type="button" class="btn-secondary lb-btn-phu" onclick="PheuLanBien.saoChep()">📋 Sao chép HTML</button>
          </div>
        </div>
        <div id="lbXem" class="lb-xem-khung"></div>
        <details class="tq-gon lb-huongdan-dang">
          <summary><span>🚀 Đăng lên web (đa nền tảng)</span></summary>
          <p class="chu-phu"><b>Netlify Drop:</b> mở app.netlify.com/drop ➜ kéo thả thư mục chứa index.html ➜ có link ngay.</p>
          <p class="chu-phu"><b>Cloudflare Pages:</b> Bảng điều khiển ➜ Workers &amp; Pages ➜ Tạo ➜ Pages ➜ Tải lên tài sản ➜ chọn thư mục.</p>
          <p class="chu-phu"><b>Vercel:</b> đưa thư mục lên 1 kho GitHub ➜ vercel.com/new ➜ nhập kho (không cần cấu hình build).</p>
          <p class="chu-phu">Còn chờ v1: đăng tự động 1 chạm + form thu lead đổ về Tuyển sinh / CRM (cổng <code>lead_web</code>) – trang xuất hiện chỉ dùng nút liên hệ.</p>
        </details>
      </div>`;
    this.veKiem();
  },
  nhap: function(o) {
    this._d[o.getAttribute('data-k')] = o.value;
    clearTimeout(this._hen);
    this._hen = setTimeout(() => { this.ghi(); this.veKiem(); }, 400);
  },
  veKiem: function() {
    const e = ShinApp.esc, d = this._d;
    const ds = document.getElementById('lbDoSau'), kq = document.getElementById('lbKiem');
    if (ds) {
      const danhSach = this.doSau(d);
      const hoanTat = danhSach.filter(x => x.pt >= 100).length;
      ds.innerHTML = `
        <div class="lb-dosau-tieu-de">
          <span class="lb-dosau-chu">Độ sâu đã điền</span>
          <span class="lb-dosau-tien-do ${hoanTat === danhSach.length ? 'lb-ds-da-du' : ''}">${hoanTat}/${danhSach.length} tầng (${Math.round(hoanTat * 100 / (danhSach.length || 1))}%)</span>
        </div>
        <div class="lb-dosau-thanh" role="progressbar" aria-valuenow="${hoanTat}" aria-valuemin="0" aria-valuemax="${danhSach.length}">
          ${danhSach.map(x => {
            const cls = x.pt >= 100 ? 'lb-ds-xanh' : (x.pt > 0 ? 'lb-ds-vang' : 'lb-ds-xam');
            return `<div class="lb-dosau-o ${cls}">
              <div class="lb-dosau-vach"></div>
              <div class="lb-dosau-nhan">${e(x.sau)}</div>
            </div>`;
          }).join('')}
        </div>`;
    }
    if (!kq) return;
    const k = this.kiem(d);
    if (!k.thieu.length && !k.loi.length) {
      kq.innerHTML = '<div class="lb-thongbao lb-tb-thanhcong">✅ Đủ nội dung – sẵn sàng xuất.</div>';
    } else {
      let html = '';
      if (k.thieu.length) {
        html += `<div class="lb-thongbao lb-tb-loi">Còn thiếu: <b>${e(k.thieu.join(' · '))}</b></div>`;
      }
      k.loi.forEach(x => {
        html += `<div class="lb-thongbao lb-tb-canhbao">⚠️ ${e(x)}</div>`;
      });
      kq.innerHTML = html;
    }
  },
  _du: function() {
    const k = this.kiem(this._d);
    if (k.thieu.length) { ShinApp.toast('Còn thiếu: ' + k.thieu[0] + (k.thieu.length > 1 ? ` (+${k.thieu.length - 1})` : ''), 'error'); return false; }
    if (this._d.ctaLink && !this.linkHopLe(this._d.ctaLink)) { ShinApp.toast('Đường dẫn nút chưa đúng.', 'error'); return false; }
    return true;
  },
  xemTruoc: function() {
    const el = document.getElementById('lbXem'); if (!el) return;
    el.innerHTML = '<iframe class="lb-iframe-xem" title="Xem trước trang" sandbox=""></iframe>';
    el.firstChild.srcdoc = this.taoHTML(this._d);
    try { el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
  },
  saoChep: function() {
    if (!this._du()) return;
    const html = this.taoHTML(this._d);
    (navigator.clipboard && navigator.clipboard.writeText ? navigator.clipboard.writeText(html) : Promise.reject())
      .then(() => ShinApp.toast('Đã sao chép mã HTML.', 'success'), () => ShinApp.toast('Trình duyệt chặn sao chép – dùng nút Tải index.html.', 'error'));
  },
  taiVe: function() {
    if (!this._du()) return;
    try {
      const url = URL.createObjectURL(new Blob([this.taoHTML(this._d)], { type: 'text/html;charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = 'index.html'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      ShinApp.toast('Đã tải index.html – kéo thả lên Netlify Drop / Cloudflare Pages.', 'success');
    } catch (e) { ShinApp.toast('Không tải được tệp trên trình duyệt này.', 'error'); }
  },
  _thay: function(moi, msg) {
    const cu = this._d;
    this._d = moi; this.ghi(); this.render(document.getElementById('mkLanBienNoi'));
    ShinApp.toast(msg, 'success', { nhan: 'Hoàn tác', bam: () => { this._d = cu; this.ghi(); this.render(document.getElementById('mkLanBienNoi')); } });
  },
  napMau: function(ma) { this._thay(Object.assign({}, this.MAU[ma] || {}), 'Đã nạp bộ mẫu – thay chữ "MẪU" bằng nội dung thật.'); },
  xoaNhap: function() { this._thay({ mang: (this._d || {}).mang || 'khac' }, 'Đã xóa nháp phễu.'); }
};
if (typeof module !== 'undefined') module.exports = PheuLanBien;
