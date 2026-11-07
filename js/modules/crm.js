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
  _gd: '',   // v2.8.2: lọc theo giai đoạn pipeline B2B (M2.3)
  GIAI_DOAN: [['Tiếp cận', '🎯'], ['Báo giá', '💬'], ['Hợp đồng', '✍️'], ['Triển khai', '🚀'], ['Tái ký', '🔁']],

  /** THUẦN. Suy giai đoạn pipeline từ chữ TrangThai (v1 không có cột giai đoạn riêng) ➜ tên giai đoạn | 'Chưa rõ'. */
  giaiDoan: function(tt) {
    const t = String(tt || '').normalize('NFC').toLowerCase();
    if (/tái ký|tai ky|gia hạn|gia han/.test(t)) return 'Tái ký';
    if (/triển khai|trien khai|đang hợp tác|dang hop tac|đang khám|đang chạy/.test(t)) return 'Triển khai';
    if (/hợp đồng|hop dong|đã ký|da ky|ký kết/.test(t)) return 'Hợp đồng';
    if (/báo giá|bao gia|chào giá|đàm phán|dam phan/.test(t)) return 'Báo giá';
    if (/tiếp cận|tiep can|liên hệ|lien he|tìm hiểu|mới/.test(t)) return 'Tiếp cận';
    return 'Chưa rõ';
  },
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

  /* v2.9.3 (M2.4) – Nhắc chăm sóc lead PHÍA TRÌNH DUYỆT theo tuổi lead (cột Luc của LeadMoi, webCRM trả "dd/mm/yyyy HH:mm"):
     🟢 < 24 giờ · 🟡 24–48 giờ · 🔴 > 48 giờ chưa chăm sóc. Lịch sử tương tác đầy đủ cần cột / cổng v1 – chưa có. */
  /** THUẦN. Chuỗi thời điểm lead ➜ số giờ đã qua (null nếu không đọc được). bayGio: Date. */
  tuoiLead: function(s, bayGio) {
    const n = bayGio || new Date(), t = String(s || '').trim().toLowerCase();
    let m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
    if (m) return (n - new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0))) / 36e5;
    m = t.match(/^(\d+)\s*(phút|giờ|ngày)\s*trước$/);
    if (m) return +m[1] * ({ 'phút': 1 / 60, 'giờ': 1, 'ngày': 24 })[m[2]];
    m = t.match(/^(\d{1,2}):(\d{2})\s*hôm nay$/);
    if (m) return (n - new Date(n.getFullYear(), n.getMonth(), n.getDate(), +m[1], +m[2])) / 36e5;
    return null;
  },
  /** THUẦN. Số giờ ➜ 'xanh' | 'vang' | 'do' | '' (không rõ). */
  mucLead: function(gio) { return gio == null || isNaN(gio) ? '' : gio > 48 ? 'do' : gio >= 24 ? 'vang' : 'xanh'; },
  NHAN_LEAD: { xanh: '🟢', vang: '🟡 > 24 giờ', do: '🔴 > 48 giờ' },

  /** THUẦN. Tin nhắc chăm sóc (lead 🔴 trước) để dán Telegram / ⚡ Giao việc. */
  tinNhacLead: function(ds, bayGio) {
    const dong = (ds || []).map(l => ({ l, m: this.mucLead(this.tuoiLead(l.thoiGian, bayGio)) })).filter(x => x.m === 'do' || x.m === 'vang')
      .sort((a, b) => (a.m === 'do' ? 0 : 1) - (b.m === 'do' ? 0 : 1))
      .map(x => `${x.m === 'do' ? '🔴' : '🟡'} ${x.l.ten} – ${x.l.nguon}${x.l.thoiGian ? ' · từ ' + x.l.thoiGian : ''}`);
    return dong.length ? `⏰ Lead chưa chăm sóc (${dong.length})\n` + dong.join('\n') : '';
  },

  saoChepNhacLead: function() {
    const t = this.tinNhacLead((this._d || {}).leadMoi);
    if (!t) return ShinApp.toast('Không có lead nào quá 24 giờ.', 'info');
    const xong = () => ShinApp.toast('Đã sao chép nhắc chăm sóc – dán vào Telegram hoặc ⚡ Giao việc.', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.crm;
    this._d = d;
    const e = ShinApp.esc;
    const ds = d.danhBa || [];
    const dem = loai => ds.filter(x => x.loai === loai).length;
    const loc = this._loc;
    const gd = this._gd;
    const b2b = ds.filter(x => x.loai === 'B2B Khám Sức Khỏe');
    const demGD = ten => b2b.filter(x => this.giaiDoan(x.trangThai) === ten).length;
    const luongLead = typeof ModuleMarketing !== 'undefined' ? (d.leadMoi || []).map(l => ModuleMarketing.phanLuongLead(l)) : null;
    const demLuong = {}; (luongLead || []).forEach(x => { demLuong[x.luong] = (demLuong[x.luong] || 0) + 1; });
    const quaHanLead = (d.leadMoi || []).filter(l => { const m = this.mucLead(this.tuoiLead(l.thoiGian)); return m === 'vang' || m === 'do'; }).length;
    const hien = ds.filter(x => (!loc || x.loai === loc) && (!gd || (x.loai === 'B2B Khám Sức Khỏe' && this.giaiDoan(x.trangThai) === gd)));

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
          <summary><span>🔔 Lead mới từ web phễu</span><span class="tom-tat">${d.leadMoi.length}${quaHanLead ? ' · ⏰ ' + quaHanLead : ''}</span></summary>
          ${luongLead ? `<p class="chu-phu">🧭 Phân luồng (M8.3): ${Object.keys(demLuong).map(k => e(ModuleMarketing.LUONG_LEAD[k].nhan.split(' ')[0]) + ' ' + demLuong[k]).join(' · ')}</p>` : ''}
          ${d.leadMoi.map((l, i) => { const m = this.mucLead(this.tuoiLead(l.thoiGian)); const lu = luongLead ? luongLead[i] : null; return `
            <div class="hang-tru crm-lead crm-lead-${m || 'xam'}" style="flex-wrap:wrap"><span style="flex:1 1 60%;min-width:0"><b>${e(l.ten)}</b><br><span class="chu-phu">${e([l.nguon, l.soDt, l.slKham || l.khoa || l.ghiChu].filter(Boolean).join(' · '))}</span></span>
              <span class="chu-phu">${e(l.thoiGian)}${m === 'vang' || m === 'do' ? '<br>' + this.NHAN_LEAD[m] : ''}</span>
              ${lu ? `<button class="btn-secondary" style="flex-basis:100%;min-height:44px;font-size:14px;margin-top:6px" title="${e(lu.lyDo)}" onclick="ShinApp.chuyenModule('${lu.module}')">${e(lu.nhan)}</button>` : ''}</div>`; }).join('')}
          ${quaHanLead ? `<button class="btn-secondary" style="min-height:44px; font-size:14px; width:100%; margin-top:8px;" onclick="ModuleCRM.saoChepNhacLead()">📋 Sao chép nhắc chăm sóc (${quaHanLead} lead > 24 giờ)</button>` : ''}
        </details>` : ''}

      ${b2b.length ? `
        <details class="tq-gon" ${gd ? 'open' : ''}>
          <summary><span>📈 Pipeline B2B (M2.3)</span><span class="tom-tat">${b2b.length} doanh nghiệp</span></summary>
          <div class="crm-pipe">${this.GIAI_DOAN.map(([ten, bt]) => `
            <button class="crm-pipe-o ${gd === ten ? 'dang-chon' : ''}" onclick="ModuleCRM.datGD('${ten}')" aria-pressed="${gd === ten}">
              <span class="crm-pipe-so">${ShinApp.soVN(demGD(ten))}</span><span class="crm-pipe-nhan">${bt} ${ten}</span></button>`).join('')}</div>
          ${demGD('Chưa rõ') ? `<p class="chu-phu">${demGD('Chưa rõ')} doanh nghiệp chưa ghi giai đoạn trong ô Trạng thái (vd "Đang báo giá", "Đã ký HĐ", "Đang triển khai", "Tái ký").</p>` : ''}
        </details>` : ''}

      <div class="hn-tieu">
        <span>${gd ? 'B2B · ' + e(gd).toUpperCase() : loc ? e(loc).toUpperCase() : 'DANH BẠ'} · ${hien.length}</span>
        ${loc || gd ? '<button class="nut-chu" onclick="ModuleCRM.boLoc()">Bỏ lọc</button>' : ''}
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
    this._gd = '';
    ShinApp.rung('nhe');
    this.render(document.getElementById('appContent'), this._d);
  },

  datGD: function(ten) {
    this._gd = this._gd === ten ? '' : ten;
    if (this._gd) this._loc = '';
    ShinApp.rung('nhe');
    this.render(document.getElementById('appContent'), this._d);
  },

  boLoc: function() { this._loc = ''; this._gd = ''; this.render(document.getElementById('appContent'), this._d); },

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
    }
  },

  themDoiTac: function() { this.moForm(-1); }
};
