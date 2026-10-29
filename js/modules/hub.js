/**
 * SHIN v2 – Mảng 1: Executive Hub (Trung tâm Điều hành)
 * Live: máy chủ 10_Hub – webHomNay (việc gom toàn hệ) · webThongBao + webDanhDauDoc (🔔) ·
 * webViecRieng + webLuuViecRieng (📝 việc riêng) · webLamMoi (kéo ngay các app). Điều hành 🧭 mở trên Hub v1.
 */

const ModuleHub = {
  ma: 'hub',
  ten: 'Executive Hub',
  bieuTuong: '🏢',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',

  // Dữ liệu đang hiển thị (để sửa việc riêng / thông báo mà không tải lại cả màn)
  _d: null,

  MAU_DEN: { do: 'var(--c-red)', vang: 'var(--c-yellow)', xanh: 'var(--c-green)' },

  /** Gọi 3 cổng Hub song song rồi đổi sang khuôn dữ liệu của màn này. */
  taiLive: async function() {
    const [homNay, thongBao, viecRieng] = await Promise.all([
      SHIN_API.goi('HUB', 'webHomNay', {}),
      SHIN_API.goi('HUB', 'webThongBao', {}),
      SHIN_API.goi('HUB', 'webViecRieng', {})
    ]);
    if (!homNay.ok) return homNay;
    return { ok: true, data: this.tuV1(homNay.data, thongBao.ok ? thongBao.data : null, viecRieng.ok ? viecRieng.data : null) };
  },

  /** THUẦN. Khuôn v1 (dungHomNay / webThongBao / webViecRieng) ➜ khuôn màn Hub v2. */
  tuV1: function(h, tb, vr) {
    h = h || {};
    const hero = h.hero || {};
    const nguoi = ShinApp.live.nguoi || {};
    return {
      live: true,
      hero: {
        chao: ShinApp.loiChao(nguoi.hoTen),
        ngay: ShinApp.ngayVN() + (h.capNhatLuc ? ` · số kéo lúc ${h.capNhatLuc}` : ''),
        so: [
          { nhan: 'Việc cần làm', giaTri: ShinApp.soVN(hero.tong), mau: 'var(--c-blue)' },
          { nhan: 'Khẩn cấp', giaTri: ShinApp.soVN(hero.khan), mau: hero.khan ? 'var(--c-red)' : 'var(--c-green)' },
          { nhan: 'Quá hạn', giaTri: ShinApp.soVN(hero.quaHan), mau: hero.quaHan ? 'var(--c-red)' : 'var(--c-green)' }
        ]
      },
      viec: (h.viec || []).map(v => ({
        tieuDe: v.tieuDe, app: v.tenApp, han: v.han, uuTien: v.uuTien || '', link: v.link, quaHan: !!v.quaHan,
        mau: v.quaHan || v.uuTien === 'Khẩn cấp' ? 'var(--c-red)' : v.uuTien === 'Quan trọng' ? 'var(--c-yellow)' : 'var(--c-blue)'
      })),
      canChuY: h.canChuY || [],
      the: h.the || [],
      loiApp: h.loiApp || [],
      thongBao: tb || { ds: [], soChuaDoc: 0 },
      viecRieng: (vr && vr.viec) || []
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.hub;
    this._d = d;
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const viec = d.viec || [];
    const tb = d.thongBao || { ds: [], soChuaDoc: 0 };

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🏠 Hôm nay</div>
          <div class="page-sub">Việc gom từ mọi app của hệ Shin</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${e(hero.chao || ShinApp.loiChao('Tâm'))}</div>
            <div class="hero-date">📅 ${e(hero.ngay || ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o" onclick="document.getElementById('hubViec').scrollIntoView({behavior:'smooth'})">
              <div class="tq-so" style="color: ${s.mau}">${e(s.giaTri)}</div>
              <div class="tq-nhan">${e(s.nhan)}</div>
            </div>
          `).join('')}
        </div>
        <button class="btn-primary" onclick="ModuleHub.moDieuHanh()">🧭 Mở Bàn Điều Hành</button>
      </div>

      ${(d.loiApp || []).length ? `<div class="canh-bao-nguon loi"><span>Chưa kéo được số của: ${e(d.loiApp.join(', '))}. Bấm "Làm mới" để thử lại.</span></div>` : ''}

      <div class="hn-tieu" id="hubViec">
        <span>CẦN XỬ LÝ · ${viec.length}</span>
        <button class="btn-secondary nut-nho" onclick="ModuleHub.lamMoi(this)">↻ Làm mới</button>
      </div>
      ${viec.length ? `
        <div class="hn-list">
          ${viec.map((v, i) => `
            <div class="hn-dong" onclick="ModuleHub.moViec(${i})">
              <div class="dong-icon" style="background: color-mix(in srgb, ${v.mau} 14%, transparent); color: ${v.mau}">
                ${this.bieuTuongApp(v.app)}
              </div>
              <div class="dong-content">
                <div class="dong-title">${e(v.tieuDe)}</div>
                <div class="dong-sub">${e(v.app)}${v.han ? ' · Hạn ' + e(v.han) : ''}${v.uuTien ? ' · ' + e(v.uuTien) : ''}</div>
              </div>
              <div class="dong-meta">
                ${v.quaHan ? '<span class="badge do">Quá hạn</span>' : ''}
                <span class="dong-arrow">›</span>
              </div>
            </div>
          `).join('')}
        </div>` : `
        <div class="hn-xong"><div class="hn-xong-icon">🎉</div><div class="hn-xong-chu">Hết việc rồi!</div><div class="hn-xong-phu">Không còn việc nào cần anh/chị xử lý hôm nay.</div></div>`}

      ${(d.canChuY || []).length ? `
        <div class="hn-tieu"><span>CẦN CHÚ Ý · ${d.canChuY.length}</span></div>
        <div class="hn-list">
          ${d.canChuY.map((c, i) => `
            <div class="hn-dong" onclick="ModuleHub.moLink(ModuleHub._d.canChuY[${i}].link)">
              <div class="dong-icon" style="background: var(--c-yellow-soft); color: var(--c-yellow)">⚠️</div>
              <div class="dong-content"><div class="dong-title">${e(c.chu)}</div></div>
              <div class="dong-meta"><span class="dong-arrow">›</span></div>
            </div>
          `).join('')}
        </div>` : ''}

      <div id="hubViecRieng">${this.veViecRieng(d.viecRieng || [])}</div>
      <div id="hubThongBao">${this.veThongBao(tb)}</div>

      ${(d.the || []).length ? `
        <details class="tq-gon" data-nho="hub_the" ${ShinApp_moGap('hub_the')}>
          <summary><span>📊 Thẻ số từng app</span><span class="tom-tat">${d.the.length} app</span></summary>
          <div class="hn-list">
            ${d.the.map((t, i) => `
              <div class="hn-dong" onclick="ModuleHub.moLink(ModuleHub._d.the[${i}].link)">
                <div class="dong-icon" style="background: color-mix(in srgb, ${this.MAU_DEN[t.den] || 'var(--c-gray)'} 14%, transparent); color: ${this.MAU_DEN[t.den] || 'var(--c-gray)'}">${this.bieuTuongApp(t.tenApp)}</div>
                <div class="dong-content">
                  <div class="dong-title">${e(t.tieuDe || t.tenApp)}</div>
                  <div class="dong-sub">${t.loi ? e(t.loi) : (t.so || []).map(s => e(s.nhan) + ': <b>' + e(s.chu) + '</b>').join(' · ')}</div>
                </div>
                <div class="dong-meta"><span class="dong-arrow">›</span></div>
              </div>
            `).join('')}
          </div>
        </details>` : ''}

      ${d.dieuHanh ? `
        <details class="tq-gon" data-nho="hub_tacvu" ${ShinApp_moGap('hub_tacvu')}>
          <summary><span>🧭 Tác vụ tự động 24/7</span><span class="tom-tat">Tiến độ ${e(d.dieuHanh.tienDoHe)}</span></summary>
          <p class="chu-phu">${e(d.dieuHanh.tacVuDangChay)}</p>
          <div class="hn-list">
            ${(d.dieuHanh.danhSachCho || []).map(item => `
              <div class="hn-dong">
                <div class="dong-content"><div class="dong-title">${e(item.ten)}</div></div>
                <div class="dong-meta"><span class="badge xanh">${e(item.trangThai)}</span></div>
              </div>
            `).join('')}
          </div>
        </details>` : ''}
    `;
  },

  bieuTuongApp: function(ten) {
    const t = String(ten || '').toLowerCase();
    if (/kpi/.test(t)) return '📊';
    if (/tuyển|ts\b/.test(t)) return '🎓';
    if (/khảo|ks\b/.test(t)) return '🩺';
    if (/phòng|pk\b|ptkh/.test(t)) return '🏥';
    if (/dự án|da\b/.test(t)) return '📌';
    return '📌';
  },

  /* ---------- 📝 Việc riêng ---------- */

  veViecRieng: function(ds) {
    const e = ShinApp.esc;
    return `
      <div class="hn-tieu"><span>📝 VIỆC RIÊNG · ${ds.length}</span></div>
      <div class="the">
        <div class="hang-nhap">
          <input id="vrTieuDe" class="form-input" maxlength="150" placeholder="Việc cần nhớ…" onkeydown="if(event.key==='Enter') ModuleHub.themViecRieng(document.getElementById('vrNut'))">
          <input id="vrHan" class="form-input o-ngay" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" oninput="ModuleHub.goNgay(this)">
        </div>
        <div class="hang-nut">
          <label class="chon-khan"><input type="checkbox" id="vrKhan"> Khẩn cấp</label>
          <button id="vrNut" class="btn-primary" onclick="ModuleHub.themViecRieng(this)">＋ Thêm việc</button>
        </div>
        ${ds.length ? `<div class="hn-list" style="margin-top:10px;">
          ${ds.map(v => `
            <div class="hn-dong" id="vr-${e(v.id)}">
              <button class="o-tick" title="Đánh dấu xong" onclick="ModuleHub.xongViecRieng('${e(v.id)}')">○</button>
              <div class="dong-content">
                <div class="dong-title">${e(v.tieuDe)}</div>
                <div class="dong-sub">${v.han ? 'Hạn ' + e(v.han) : 'Không hạn'}${v.uuTien === 'cao' ? ' · Khẩn cấp' : ''}</div>
              </div>
              <div class="dong-meta">
                ${v.quaHan ? '<span class="badge do">Quá hạn</span>' : v.homNay ? '<span class="badge vang">Hôm nay</span>' : ''}
                <button class="nut-xoa" title="Xóa (bấm 2 lần)" onclick="ModuleHub.xoaViecRieng('${e(v.id)}')">🗑</button>
              </div>
            </div>
          `).join('')}
        </div>` : '<div class="trong">Chưa có việc riêng nào. Gõ việc cần nhớ ở ô trên rồi bấm "＋ Thêm việc".</div>'}
      </div>`;
  },

  /** Ô ngày dd/mm/yyyy: tự thêm "/" khi gõ số. */
  goNgay: function(o) {
    const so = o.value.replace(/\D/g, '').slice(0, 8);
    o.value = so.length > 4 ? `${so.slice(0, 2)}/${so.slice(2, 4)}/${so.slice(4)}` : so.length > 2 ? `${so.slice(0, 2)}/${so.slice(2)}` : so;
  },

  capNhatViecRieng: function(ds) {
    this._d.viecRieng = ds;
    const khung = document.getElementById('hubViecRieng');
    if (khung) khung.innerHTML = this.veViecRieng(ds);
  },

  themViecRieng: async function(nut) {
    const oTieuDe = document.getElementById('vrTieuDe');
    const oHan = document.getElementById('vrHan');
    const tieuDe = (oTieuDe.value || '').trim();
    if (!tieuDe) { oTieuDe.focus(); ShinApp.toast('Nhập nội dung việc trước khi thêm.', 'warn'); return; }
    const han = (oHan.value || '').trim();
    if (han && !/^\d{2}\/\d{2}\/\d{4}$/.test(han)) { oHan.focus(); ShinApp.toast('Hạn cần dạng dd/mm/yyyy, ví dụ 05/11/2026.', 'warn'); return; }
    const uuTien = document.getElementById('vrKhan').checked ? 'cao' : 'thuong';

    if (!SHIN_API.laCheDoLive()) {
      this.capNhatViecRieng([{ id: 'demo' + Date.now(), tieuDe, han, uuTien }].concat(this._d.viecRieng || []));
      ShinApp.toast(`Đã thêm việc riêng "${tieuDe}" (mẫu – chưa lưu máy chủ).`);
      return;
    }
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => ShinApp.goiBat('HUB', 'webLuuViecRieng', { lam: 'them', tieuDe, han, uuTien }), 'vr-them|' + tieuDe);
    if (kq) {
      this.capNhatViecRieng(kq.viec || []);
      ShinApp.rung('xong');
      ShinApp.toast(`Đã thêm việc riêng "${tieuDe}".`);
    }
  },

  xongViecRieng: function(id) {
    const dong = document.getElementById('vr-' + id);
    const v = (this._d.viecRieng || []).find(x => String(x.id) === String(id));
    if (!dong || !v) return;
    ShinApp.hanhDongHoanTac(`Đã xong "${v.tieuDe}"`, {
      lamTruoc: () => { dong.classList.add('mo-di'); },
      traLai: () => { dong.classList.remove('mo-di'); },
      thucHien: async () => {
        if (!SHIN_API.laCheDoLive()) { this.capNhatViecRieng(this._d.viecRieng.filter(x => x !== v)); return; }
        const kq = await ShinApp.goiBat('HUB', 'webLuuViecRieng', { lam: 'xong', id });
        this.capNhatViecRieng(kq.viec || []);
      }
    });
  },

  xoaViecRieng: function(id) {
    const v = (this._d.viecRieng || []).find(x => String(x.id) === String(id));
    if (!v) return;
    ShinApp.xacNhan2Lan('vr-xoa-' + id, `Xóa việc "${v.tieuDe}"`, async () => {
      if (!SHIN_API.laCheDoLive()) { this.capNhatViecRieng(this._d.viecRieng.filter(x => x !== v)); ShinApp.toast('Đã xóa việc (mẫu).'); return; }
      const kq = await ShinApp.goiNut(null, 'Đang xóa…', () => ShinApp.goiBat('HUB', 'webLuuViecRieng', { lam: 'xoa', id }), 'vr-xoa-' + id);
      if (kq) { this.capNhatViecRieng(kq.viec || []); ShinApp.toast(`Đã xóa việc "${v.tieuDe}".`); }
    });
  },

  /* ---------- 🔔 Thông báo ---------- */

  veThongBao: function(tb) {
    const e = ShinApp.esc;
    const ds = (tb && tb.ds) || [];
    const chua = ds.filter(t => !t.daDoc);
    return `
      <details class="tq-gon" data-nho="hub_tb" ${chua.length ? 'open' : ShinApp_moGap('hub_tb')}>
        <summary><span>🔔 Thông báo</span><span class="tom-tat">${chua.length ? chua.length + ' chưa xem' : ds.length ? 'đã xem hết' : 'chưa có'}</span></summary>
        ${ds.length ? `
          <div class="hn-list">
            ${ds.map(t => `
              <div class="the-tin ${t.daDoc ? 'da-xem' : 'chua-xem'}" onclick="ModuleHub.danhDauDoc([${Number(t.stt) || 0}], this)">
                <div class="the-tin-dau"><b>${e(t.tieuDe)}</b><span class="chu-phu">${e(t.luc)}</span></div>
                ${t.noiDung ? `<div class="chu-phu">${e(t.noiDung)}</div>` : ''}
              </div>
            `).join('')}
          </div>
          ${chua.length ? `<button class="nut-rong" onclick="ModuleHub.danhDauDoc('het', this)">✓ Đánh dấu đã xem hết</button>` : ''}
        ` : '<div class="trong">Chưa có thông báo nào.</div>'}
      </details>`;
  },

  danhDauDoc: async function(dsStt, nut) {
    const tb = this._d.thongBao || { ds: [] };
    const conChua = tb.ds.some(t => !t.daDoc && (dsStt === 'het' || dsStt.indexOf(Number(t.stt)) >= 0));
    if (!conChua) return;
    const apDung = () => {
      tb.ds.forEach(t => { if (dsStt === 'het' || dsStt.indexOf(Number(t.stt)) >= 0) t.daDoc = true; });
      tb.soChuaDoc = tb.ds.filter(t => !t.daDoc).length;
      const khung = document.getElementById('hubThongBao');
      if (khung) khung.innerHTML = this.veThongBao(tb);
      ShinApp.live.soChuaDoc = tb.soChuaDoc;
    };
    if (!SHIN_API.laCheDoLive()) { apDung(); return; }
    const kq = await ShinApp.goiNut(dsStt === 'het' ? nut : null, 'Đang đánh dấu…', () => ShinApp.goiBat('HUB', 'webDanhDauDoc', { dsStt }), 'tb-doc|' + JSON.stringify(dsStt));
    if (kq) apDung();
  },

  /* ---------- Hành động ---------- */

  lamMoi: async function(nut) {
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast('Chế độ trình diễn: danh sách việc là mẫu.', 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang kéo số các app…', () => ShinApp.goiBat('HUB', 'webLamMoi', {}), 'hub-lam-moi');
    if (!kq) return;
    const moi = this.tuV1(kq, this._d.thongBao, { viec: this._d.viecRieng });
    this.render(document.getElementById('appContent'), moi);
    ShinApp.toast(kq.vuaCapNhat ? 'Vừa cập nhật dưới 1 phút trước – đang hiện bản mới nhất.' : 'Đã kéo số mới từ các app.', 'info');
  },

  moViec: function(i) {
    const v = (this._d.viec || [])[i];
    if (!v) return;
    if (v.link) { window.open(v.link, '_blank', 'noopener'); return; }
    ShinApp.toast(SHIN_API.laCheDoLive() ? 'Việc này chưa có link mở app.' : `Mẫu: "${v.tieuDe}" sẽ mở đúng app khi có token.`, 'info');
  },

  moLink: function(link) {
    if (link) window.open(link, '_blank', 'noopener');
  },

  moDieuHanh: function() {
    ShinApp.moV1('HUB', 'Bàn Điều Hành 🧭');
  }
};

/** Khối gập nhớ mở/gập theo máy (trả 'open' hoặc ''). */
function ShinApp_moGap(khoa) {
  try { return localStorage.getItem('shin_gap_' + khoa) === '1' ? 'open' : ''; } catch (e) { return ''; }
}
document.addEventListener('toggle', (ev) => {
  const el = ev.target;
  if (el && el.dataset && el.dataset.nho) {
    try { localStorage.setItem('shin_gap_' + el.dataset.nho, el.open ? '1' : '0'); } catch (e) {}
  }
}, true);
