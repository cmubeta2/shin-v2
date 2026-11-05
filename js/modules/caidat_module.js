/**
 * SHIN v2 – Tầng 0A: Quản Trị Hệ Sinh Thái
 * M0.1 Bật/tắt mảng (lưu trên máy này – ẩn khỏi menu ☰) + v2.9.4 mã cấu hình SHINCFG1 chuyển sang máy khác (KHÔNG chứa token) · M0.4 Sức khỏe 5 máy chủ v1 (độ trễ, lỗi lần gọi gần nhất).
 * Phân quyền thật vẫn do từng app v1 giữ (sheet NguoiDung); v2 chỉ ẩn mảng mà máy chủ trả 'quyen'.
 */

const ModuleCaiDat = {
  ma: 'caidat',
  ten: 'Quản Trị Module',
  bieuTuong: '⚙️',
  paletteMacDinh: 'cyber',

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.caidat;
    const e = ShinApp.esc;
    const coModule = ma => ShinApp.MODULES.some(m => m.ma === ma);
    const danhSach = (d.danhSachMang || []).map(item => Object.assign({}, item, {
      coModule: coModule(item.ma),
      khoa: ShinApp.MANG_LUON_BAT.indexOf(item.ma) >= 0,
      bat: coModule(item.ma) && ShinApp.mangDangBat(item.ma)
    }));
    const dangBat = danhSach.filter(x => x.bat).length;
    const laLive = SHIN_API.laCheDoLive();
    const nguoi = ShinApp.live.nguoi;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">⚙️ Quản Trị Hệ Sinh Thái</div>
          <div class="page-sub">Bật/tắt mảng · Kết nối máy chủ v1 · Giao diện</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Bảng màu">🎨</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Quản trị hệ sinh thái ⚙️</div>
            <div class="hero-date">${laLive ? '👤 ' + e(nguoi ? nguoi.hoTen + ' · ' + nguoi.vaiTro : 'Đang nhận diện người dùng…') : '🟡 Chế độ trình diễn'}</div>
          </div>
        </div>
        <div class="tq-3so">
          <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">${danhSach.length}</div><div class="tq-nhan">Mảng quy hoạch</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">${dangBat}</div><div class="tq-nhan">Đang hiện trong menu</div></div>
          <div class="tq-o"><div class="tq-so" style="color:var(--c-yellow)">${danhSach.filter(x => !x.coModule).length}</div><div class="tq-nhan">Chưa có màn</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleCaiDat.kiemTraKetNoi(this)">📡 Kiểm tra kết nối 5 máy chủ</button>
      </div>

      <div id="cdSucKhoe">${this.veSucKhoe()}</div>

      <div class="hn-tieu"><span>BẬT / TẮT MẢNG (TRÊN MÁY NÀY)</span></div>
      <div class="hn-list">
        ${danhSach.map(item => `
          <div class="hn-dong">
            <div class="dong-content">
              <div class="dong-title">${e(item.ten)}</div>
              <div class="dong-sub">Mảng ${e(item.stt)} · ${e(item.nhom)}${!item.coModule ? ' · chưa có màn (theo lộ trình)' : item.khoa ? ' · luôn bật' : ''}</div>
            </div>
            <label class="cong-tac ${item.khoa || !item.coModule ? 'khoa' : ''}">
              <input type="checkbox" ${item.bat ? 'checked' : ''} ${item.khoa || !item.coModule ? 'disabled' : ''}
                     onchange="ModuleCaiDat.toggleMang('${e(item.ma)}', this.checked, ${JSON.stringify(item.ten).replace(/"/g, '&quot;')})">
              <span class="cong-tac-nen"></span>
            </label>
          </div>
        `).join('')}
      </div>

      <div class="hn-tieu"><span>ĐỒNG BỘ CẤU HÌNH SANG MÁY KHÁC</span></div>
      <div class="the">
        <p class="chu-phu">Mã gồm giao diện, cỡ chữ, kiểu thanh mép và các mảng đang tắt – <b>không chứa token</b>. Sao chép ở máy này, dán ở máy kia.</p>
        <button class="btn-secondary" style="min-height:44px; width:100%;" onclick="ModuleCaiDat.saoChepCauHinh()">📋 Sao chép mã cấu hình</button>
        <label for="cdMaCH" class="chu-phu" style="display:block; margin-top:12px;">Dán mã từ máy khác</label>
        <textarea id="cdMaCH" class="form-input" rows="2" maxlength="2000" placeholder="SHINCFG1.…" style="font-size:16px; width:100%; box-sizing:border-box;"></textarea>
        <button class="btn-primary" style="min-height:44px; width:100%; margin-top:8px;" onclick="ModuleCaiDat.apMaCauHinh()">⬇️ Áp dụng mã</button>
      </div>

      <div class="hn-tieu"><span>KẾT NỐI DỮ LIỆU THẬT</span></div>
      <div class="the">
        <p class="chu-phu">v2 gọi thẳng 5 máy chủ Apps Script mà v1 đang dùng (POST text/plain, không preflight). Mọi cổng đòi token Hub ký HMAC; quyền của từng người do từng app v1 giữ.</p>
        <button class="btn-secondary" onclick="ShinApp.moCaiDat()">🔑 Nhập / đổi Token · 🎨 Giao diện</button>
      </div>
    `;
  },

  veSucKhoe: function() {
    const e = ShinApp.esc;
    const ds = SHIN_API.laySucKhoe();
    const quyen = ShinApp.live.quyen;
    return `
      <div class="hn-tieu"><span>SỨC KHỎE MÁY CHỦ V1</span></div>
      <div class="the">
        ${ds.map(m => {
          const q = quyen[m.khoa];
          const nhan = !SHIN_API.laCheDoLive() ? ['xam', 'Demo'] : m.ms === undefined ? ['xam', 'Chưa gọi'] :
            m.loi === 'quyen' || q === 'khong' ? ['vang', 'Chưa có quyền'] : m.ok ? ['xanh', ShinApp.soVN(m.ms) + ' ms'] : ['do', 'Lỗi kết nối'];
          return `<div class="hang-tru"><span>${e(m.ten)}</span><span class="badge ${nhan[0]}">${e(nhan[1])}</span></div>`;
        }).join('')}
      </div>`;
  },

  kiemTraKetNoi: async function(nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Nhập token trước để kiểm tra máy chủ thật.', 'info'); return; }
    await ShinApp.goiNut(nut, 'Đang gọi 5 máy chủ…', async () => {
      await Promise.all([SHIN_API.goi('HUB', 'webKhoiDong', {})].concat(['KPI', 'TS', 'KS', 'PK'].map(k => SHIN_API.goiCong(k, 'webKhoiDong'))));
    }, 'cd-kiem-tra');
    const khung = document.getElementById('cdSucKhoe');
    if (khung) khung.innerHTML = this.veSucKhoe();
  },

  // v2.9.4 – M0.1 đồng bộ: chỉ các khóa giao diện dưới đây; token (shin_token) KHÔNG BAO GIỜ vào mã.
  KHOA_CAU_HINH: {
    shin_palette: /^[a-z0-9_-]{1,30}$/, shin_theme_mode: /^(system|light|dark)$/, shin_theme: /^(light|dark)$/,
    shin_cochu: /^[a-z0-9_-]{1,20}$/, shin_kieu_rail: /^[a-z0-9_-]{1,20}$/, shin_navbar: /^[01]$/, shin_rail_thu: /^[01]$/,
    shin_mang_tat: 'dsMa'
  },

  /** Hàm thuần: object {khoa: giá trị} ➜ 'SHINCFG1.<base64 JSON>' (bỏ khóa lạ / giá trị sai dạng). */
  taoMaCauHinh: function(nguon) {
    const ch = {};
    Object.keys(this.KHOA_CAU_HINH).forEach(k => { const v = nguon[k]; if (v != null && this.giaTriHopLe(k, v)) ch[k] = String(v); });
    return 'SHINCFG1.' + btoa(unescape(encodeURIComponent(JSON.stringify(ch))));
  },

  giaTriHopLe: function(k, v) {
    const luat = this.KHOA_CAU_HINH[k];
    if (!luat || typeof v !== 'string' || v.length > 600) return false;
    if (luat !== 'dsMa') return luat.test(v);
    try { const ds = JSON.parse(v); return Array.isArray(ds) && ds.length <= 40 && ds.every(x => typeof x === 'string' && /^[a-z0-9_]{1,30}$/.test(x)); }
    catch (e) { return false; }
  },

  /** Hàm thuần: mã ➜ {ok, cauHinh} | {ok:false, loi}. Khóa lạ (kể cả shin_token) bị bỏ, không ghi. */
  docMaCauHinh: function(chuoi) {
    const s = String(chuoi || '').trim();
    if (!/^SHINCFG1\.[A-Za-z0-9+/=]+$/.test(s)) return { ok: false, loi: 'Mã không đúng dạng SHINCFG1.… – chép lại nguyên mã giúp em.' };
    let obj;
    try { obj = JSON.parse(decodeURIComponent(escape(atob(s.slice(9))))); } catch (e) { return { ok: false, loi: 'Mã bị cắt hoặc hỏng – chép lại nguyên mã.' }; }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return { ok: false, loi: 'Mã không chứa cấu hình.' };
    const ch = {};
    Object.keys(obj).forEach(k => { if (this.giaTriHopLe(k, obj[k])) ch[k] = obj[k]; });
    if (!Object.keys(ch).length) return { ok: false, loi: 'Mã không có mục cấu hình hợp lệ nào.' };
    return { ok: true, cauHinh: ch };
  },

  docLS: function(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },

  saoChepCauHinh: function() {
    const nguon = {};
    Object.keys(this.KHOA_CAU_HINH).forEach(k => { nguon[k] = this.docLS(k); });
    const ma = this.taoMaCauHinh(nguon);
    const xong = () => { ShinApp.toast('Đã sao chép mã cấu hình (không kèm token).', 'success'); ShinApp.rung('nhe'); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(ma).then(xong, () => this.hienMa(ma));
    else this.hienMa(ma);
  },

  hienMa: function(ma) {
    const o = document.getElementById('cdMaCH');
    if (o) { o.value = ma; o.select(); }
    ShinApp.toast('Trình duyệt chặn sao chép – mã đã hiện trong ô, anh tự chép giúp em.', 'warn');
  },

  apMaCauHinh: function() {
    const o = document.getElementById('cdMaCH');
    const kq = this.docMaCauHinh(o ? o.value : '');
    if (!kq.ok) { ShinApp.toast(kq.loi, 'error'); return; }
    const so = Object.keys(kq.cauHinh).length;
    // Hoàn tác 6s: chưa ghi gì; hết 6s mới ghi localStorage rồi tải lại để áp giao diện.
    ShinApp.toast('Sẽ áp ' + so + ' mục cấu hình và tải lại trang.', 'success', {
      nhan: 'Hoàn tác',
      bam: () => ShinApp.toast('Đã hủy – cấu hình giữ nguyên.', 'info'),
      khiHet: () => {
        try { Object.keys(kq.cauHinh).forEach(k => localStorage.setItem(k, kq.cauHinh[k])); }
        catch (e) { ShinApp.toast('Trình duyệt không cho lưu cấu hình (chế độ ẩn danh?).', 'error'); return; }
        location.reload();
      }
    });
  },

  toggleMang: function(ma, bat, ten) {
    if (!ShinApp.datMangBat(ma, bat)) return;
    ShinApp.rung('nhe');
  }
};
