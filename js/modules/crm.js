/**
 * SHIN v2 – Mảng 2: Khách hàng & Đối tác (CRM hợp nhất)
 * Live (v2.5.0 – HOP_DONG_CONG_V2.md mục CRM, máy chủ Hub):
 *   webCRM({}) ➜ {doiTac:[{ma, ten, loai, quyMo, nguoiLienHe, dienThoai, trangThai}], leadMoi:[{ten, nguon, soDt, ghiChu, luc}]}
 *   webLuuDoiTac({doiTac}) ➜ như webCRM (ma trống = thêm mới).
 * NGUYÊN TẮC: chỉ lưu đầu mối doanh nghiệp, trường, CTV, nhà cung ứng – KHÔNG lưu người bệnh / bệnh án.
 */

const ModuleCRM = {
  ma: 'crm',
  ten: 'Khách Hàng & Đối Tác',
  bieuTuong: '👥',
  paletteMacDinh: 'executive',
  mayChu: 'HUB',

  _d: null,
  _loc: '',
  LOAI: ['B2B Khám Sức Khỏe', 'Đối tác Đào tạo', 'CTV Tuyển sinh', 'Nhà Cung Ứng'],
  MAU_LOAI: { 'B2B Khám Sức Khỏe': 'xanh', 'Đối tác Đào tạo': 'vang', 'CTV Tuyển sinh': 'vang', 'Nhà Cung Ứng': 'xam' },

  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webCRM', {});
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. Cổng webCRM ➜ khuôn màn (cùng khuôn với dữ liệu mẫu). */
  tuV1: function(c) {
    c = c || {};
    const ds = (c.doiTac || []).map(x => ({ ma: x.ma || '', ten: x.ten || '', loai: x.loai || '', quyMo: x.quyMo || '', nguoiLienHe: x.nguoiLienHe || '', dienThoai: x.dienThoai || '', trangThai: x.trangThai || '' }));
    return {
      live: true,
      danhBa: ds,
      leadMoi: (c.leadMoi || []).map(l => ({ ten: l.ten || '', nguon: l.nguon || '', soDt: l.soDt || '', ghiChu: l.ghiChu || '', thoiGian: l.luc || '' }))
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.crm;
    this._d = d;
    const e = ShinApp.esc;
    const ds = d.danhBa || [];
    const dem = loai => ds.filter(x => x.loai === loai).length;
    const loc = this._loc;
    const hien = loc ? ds.filter(x => x.loai === loc) : ds;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">👥 Khách Hàng & Đối Tác</div>
          <div class="page-sub">Doanh nghiệp KSK · Trường đối tác · CTV · Nhà cung ứng</div>
        </div>
        <button class="btn-icon" onclick="ModuleCRM.moForm(-1)" title="Thêm mới">＋</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Danh bạ đối tác 👥</div>
            <div class="hero-date">📅 ${e(ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          <div class="tq-o" onclick="ModuleCRM.datLoc('B2B Khám Sức Khỏe')"><div class="tq-so" style="color:var(--c-blue)">${ShinApp.soVN(dem('B2B Khám Sức Khỏe'))}</div><div class="tq-nhan">Doanh nghiệp KSK</div></div>
          <div class="tq-o" onclick="ModuleCRM.datLoc('Đối tác Đào tạo')"><div class="tq-so" style="color:var(--c-green)">${ShinApp.soVN(dem('Đối tác Đào tạo'))}</div><div class="tq-nhan">Trường đối tác</div></div>
          <div class="tq-o" onclick="ModuleCRM.datLoc('CTV Tuyển sinh')"><div class="tq-so" style="color:var(--c-yellow)">${ShinApp.soVN(dem('CTV Tuyển sinh'))}</div><div class="tq-nhan">CTV tuyển sinh</div></div>
        </div>
        <button class="btn-primary" onclick="ModuleCRM.moForm(-1)">＋ Thêm đối tác / khách</button>
      </div>

      <div id="crmForm"></div>

      ${(d.leadMoi || []).length ? `
        <details class="tq-gon" open>
          <summary><span>🔔 Lead mới từ web phễu</span><span class="tom-tat">${d.leadMoi.length}</span></summary>
          ${d.leadMoi.map(l => `
            <div class="hang-tru"><span><b>${e(l.ten)}</b><br><span class="chu-phu">${e([l.nguon, l.soDt, l.slKham || l.khoa || l.ghiChu].filter(Boolean).join(' · '))}</span></span>
              <span class="chu-phu">${e(l.thoiGian)}</span></div>`).join('')}
        </details>` : ''}

      <div class="hn-tieu">
        <span>${loc ? e(loc).toUpperCase() : 'DANH BẠ'} · ${hien.length}</span>
        ${loc ? '<button class="nut-chu" onclick="ModuleCRM.datLoc(\'\')">Bỏ lọc</button>' : ''}
      </div>
      <input class="form-input" placeholder="🔍 Tìm theo tên, người liên hệ…" oninput="ModuleCRM.tim(this.value)">
      <div class="hn-list" id="crmDs">
        ${hien.map(x => {
          const i = ds.indexOf(x);
          return `
          <div class="hn-dong" data-tim="${e((x.ten + ' ' + x.nguoiLienHe + ' ' + x.loai).toLowerCase())}" onclick="ModuleCRM.moChiTiet(${i})">
            <div class="dong-content">
              <div class="dong-title">${e(x.ten)}</div>
              <div class="dong-sub">${e([x.loai, x.trangThai].filter(Boolean).join(' · '))}</div>
            </div>
            <div class="dong-meta"><span class="badge ${this.MAU_LOAI[x.loai] || 'xam'}">${e(x.quyMo || x.loai)}</span><span class="dong-arrow">›</span></div>
          </div>
          <div class="chi-tiet-dong" id="crmCT${i}" hidden></div>`;
        }).join('')}
      </div>
      ${hien.length ? '' : '<div class="trong">Chưa có đối tác nào.</div>'}

      <p class="chu-phu">🔒 CRM chỉ lưu đầu mối doanh nghiệp, trường, CTV, nhà cung ứng. Không lưu thông tin người bệnh / bệnh án.</p>
    `;
  },

  datLoc: function(loai) {
    this._loc = this._loc === loai ? '' : loai;
    ShinApp.rung('nhe');
    this.render(document.getElementById('appContent'), this._d);
  },

  tim: function(chu) {
    const t = String(chu || '').trim().toLowerCase();
    document.querySelectorAll('#crmDs > .hn-dong').forEach(r => {
      r.hidden = !!t && r.dataset.tim.indexOf(t) < 0;
      const ct = r.nextElementSibling;
      if (ct && r.hidden) ct.hidden = true;
    });
  },

  moChiTiet: function(i) {
    const x = (this._d.danhBa || [])[i];
    const khung = document.getElementById('crmCT' + i);
    if (!x || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;
    const e = ShinApp.esc;
    const sdt = String(x.dienThoai || '').replace(/[^\d+]/g, '');
    khung.innerHTML = `
      <div class="hang-tru"><span>Người liên hệ</span><b>${e(x.nguoiLienHe || '–')}</b></div>
      <div class="hang-tru"><span>Quy mô</span><b>${e(x.quyMo || '–')}</b></div>
      <div class="hang-nut">
        ${sdt.length >= 9 ? `<a class="btn-secondary" href="tel:${e(sdt)}">📞 Gọi</a>` : ''}
        <button class="btn-secondary" onclick="ModuleCRM.moForm(${i})">✏️ Sửa</button>
      </div>`;
  },

  moForm: function(i) {
    const e = ShinApp.esc;
    const x = i >= 0 ? (this._d.danhBa || [])[i] : {};
    const khung = document.getElementById('crmForm');
    if (!khung || !x) return;
    khung.innerHTML = `
      <div class="the form-the">
        <div class="the-tin-dau"><b>${i >= 0 ? 'Sửa ' + e(x.ten) : 'Đối tác / khách mới'}</b><button class="nut-chu" onclick="document.getElementById('crmForm').innerHTML=''">✕ Đóng</button></div>
        <label class="nhan-o">Tên *</label><input id="cfTen" class="form-input" maxlength="150" value="${e(x.ten || '')}">
        <label class="nhan-o">Loại *</label>
        <select id="cfLoai" class="form-input">${this.LOAI.map(l => `<option ${l === x.loai ? 'selected' : ''}>${e(l)}</option>`).join('')}</select>
        <label class="nhan-o">Người liên hệ *</label><input id="cfNguoi" class="form-input" maxlength="120" value="${e(x.nguoiLienHe || '')}">
        <label class="nhan-o">Điện thoại</label><input id="cfSdt" class="form-input" inputmode="tel" maxlength="20" value="${e(x.dienThoai || '')}">
        <details class="tq-gon">
          <summary><span>＋ Thêm chi tiết</span></summary>
          <label class="nhan-o">Quy mô</label><input id="cfQuyMo" class="form-input" maxlength="80" value="${e(x.quyMo || '')}" placeholder="vd 420 nhân sự">
          <label class="nhan-o">Trạng thái</label><input id="cfTT" class="form-input" maxlength="120" value="${e(x.trangThai || '')}" placeholder="Đang đàm phán, đã ký HĐ…">
        </details>
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleCRM.luu(this, '${e(x.ma || '')}')">💾 Lưu</button></div>
      </div>`;
    khung.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  luu: async function(nut, ma) {
    const v = id => String((document.getElementById(id) || {}).value || '').trim();
    const doiTac = { ma, ten: v('cfTen'), loai: v('cfLoai'), nguoiLienHe: v('cfNguoi'), dienThoai: v('cfSdt'), quyMo: v('cfQuyMo'), trangThai: v('cfTT') };
    if (!doiTac.ten || !doiTac.nguoiLienHe) { ShinApp.toast('Cần tên và người liên hệ.', 'warn'); return; }
    if (!SHIN_API.laCheDoLive() || !this._d.live) {
      document.getElementById('crmForm').innerHTML = '';
      ShinApp.toast(`Đã lưu ${doiTac.ten} (mẫu – Hub chưa mở cổng CRM).`, 'info');
      return;
    }
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => ShinApp.goiBat('HUB', 'webLuuDoiTac', { doiTac }), 'crm-luu-' + doiTac.ten);
    if (kq) {
      this.render(document.getElementById('appContent'), this.tuV1(kq));
      ShinApp.rung('xong');
      ShinApp.toast(`Đã lưu ${doiTac.ten}.`);
    }
  },

  themDoiTac: function() { this.moForm(-1); }
};
