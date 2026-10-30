/**
 * SHIN v2 – Tầng 0A: Quản Trị Hệ Sinh Thái
 * M0.1 Bật/tắt mảng (lưu trên máy này – ẩn khỏi menu ☰) · M0.4 Sức khỏe 5 máy chủ v1 (độ trễ, lỗi lần gọi gần nhất).
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

  toggleMang: function(ma, bat, ten) {
    if (!ShinApp.datMangBat(ma, bat)) return;
    ShinApp.rung('nhe');
  }
};
