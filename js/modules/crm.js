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
  /** THUẦN – v2.13.3: giai đoạn của 1 đối tác: cột GiaiDoan (HUB L29) nếu đúng 1 trong 5 giá trị, không thì suy từ TrangThai. */
  gdCua: function(x) {
    const g = String((x || {}).giaiDoan || '').trim();
    return this.GIAI_DOAN.some(([ten]) => ten === g) ? g : this.giaiDoan((x || {}).trangThai);
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
    const coKhoa = (x, k) => !!x && Object.prototype.hasOwnProperty.call(x, k);
    const ds = (c.doiTac || []).map(x => ({ ma: x.ma || '', ten: x.ten || '', loai: x.loai || '', quyMo: x.quyMo || '', nguoiLienHe: x.nguoiLienHe || '', dienThoai: x.dienThoai || '', trangThai: x.trangThai || '', giaiDoan: x.giaiDoan || '' }));
    return {
      live: true,
      // v2.13.3: HUB L29 (chưa lên app) – chỉ bật ô giai đoạn / lịch sử tương tác khi cổng thật trả các trường này
      coGiaiDoan: (c.doiTac || []).some(x => coKhoa(x, 'giaiDoan')),
      tuongTac: Array.isArray(c.tuongTac) ? c.tuongTac.map(t => ({ maDoiTac: t.maDoiTac || '', maLead: t.maLead || '', ngay: t.ngay || '', kenh: t.kenh || '', noiDung: t.noiDung || '', nguoiGhi: t.nguoiGhi || '' })) : null,
      danhBa: ds,
      leadMoi: (c.leadMoi || []).map(l => ({ ma: l.ma || '', ten: l.ten || '', nguon: l.nguon || '', soDt: l.soDt || '', ghiChu: l.ghiChu || '', thoiGian: l.luc || '', trangThai: l.trangThai || '' }))
    };
  },

  /* v2.13.9 – HUB L29 lên app (Hub v1.20.2 @20): ghi lần liên hệ (`webGhiTuongTac`) + đánh dấu lead (`webDanhDauLead`). */
  KENH_TT: ['Gọi', 'Zalo', 'Email', 'Gặp', 'Khác'],
  TT_LEAD: ['Đã chăm sóc', 'Đã chuyển'],

  /** THUẦN – kiểm 1 lần liên hệ theo luật Hub (kiemTuongTac): đúng 1 trong maDoiTac (DT001) / maLead (LD001), kênh hợp lệ,
   *  nội dung 1–500 ký tự, không SĐT / CCCD / BHYT / chữ "BN" (người bệnh). ➜ {loi} | {goi: {maDoiTac|maLead, kenh, noiDung}}. */
  kiemTuongTac: function(du) {
    du = du || {};
    const cat = v => String(v == null ? '' : v).trim();
    const dt = cat(du.maDoiTac), ld = cat(du.maLead), kenh = cat(du.kenh) || 'Khác', noi = cat(du.noiDung).replace(/\s+/g, ' ');
    if ((dt ? 1 : 0) + (ld ? 1 : 0) !== 1) return { loi: 'Chọn đúng 1 đối tác hoặc 1 lead để ghi tương tác.' };
    if (dt && !/^DT\d{3,}$/.test(dt)) return { loi: 'Mã đối tác không hợp lệ (dạng DT001) – mở lại CRM ở chế độ Live.' };
    if (ld && !/^LD\d{3,}$/.test(ld)) return { loi: 'Mã lead không hợp lệ (dạng LD001).' };
    if (this.KENH_TT.indexOf(kenh) < 0) return { loi: 'Kênh chỉ nhận: ' + this.KENH_TT.join(' / ') + '.' };
    if (!noi) return { loi: 'Vui lòng ghi nội dung lần liên hệ.' };
    if (noi.length > 500) return { loi: 'Nội dung tối đa 500 ký tự.' };
    if (/(^|\D)0\d{9}(?!\d)/.test(noi.replace(/[\s.-]/g, '')) || /(^|\D)\d{12}(?!\d)|\b[A-Z]{2}[1-5]\d{12}\b|\bBN\b/.test(noi)) return { loi: 'Nội dung không được chứa SĐT / CCCD / BHYT / thông tin người bệnh.' };
    const goi = { kenh, noiDung: noi };
    if (dt) goi.maDoiTac = dt; else goi.maLead = ld;
    return { goi };
  },

  /** THUẦN – 'dd/mm/yyyy' của 1 Date. */
  ngayVN: function(d) { const p = n => String(n).padStart(2, '0'); return p(d.getDate()) + '/' + p(d.getMonth() + 1) + '/' + d.getFullYear(); },

  /** Ghi 1 lần liên hệ của đối tác i: kiểm ➜ Toast Hoàn tác 6s ➜ webGhiTuongTac đúng 1 lần (maGui giữ tới khi Hub nhận). Demo: không gửi. */
  ghiTuongTac: function(i, nut) {
    const x = (this._d.danhBa || [])[i];
    if (!x) return;
    const v = id => String((document.getElementById(id) || {}).value || '');
    const kq = this.kiemTuongTac({ maDoiTac: x.ma, kenh: v('ttKenh' + i), noiDung: v('ttNoi' + i) });
    if (kq.loi) return ShinApp.toast(kq.loi, 'error');
    if (!SHIN_API.laCheDoLive() || !this._d.live || !SHIN_API.layToken()) return ShinApp.toast('Đang ở Demo – không ghi lên Hub.', 'info');
    if (this._dangGhi) return;
    const khoa = JSON.stringify(kq.goi);
    if (this._maGhiCho !== khoa) { this._maGhiCho = khoa; this._maGhi = ModuleTaiChinh.taoMaGui(Date.now(), Math.random().toString(36).slice(2)); }
    const du = Object.assign({}, kq.goi, { maGui: this._maGhi });
    this._dangGhi = true;
    const khoaNut = on => { if (nut && nut.isConnected) { nut.disabled = on; nut.innerHTML = on ? '⏳ Chờ 6 giây…' : '💬 Ghi lần liên hệ'; } };
    ShinApp.hanhDongHoanTac('Sẽ ghi lần liên hệ (' + kq.goi.kenh + ') với ' + x.ten + '.', {
      lamTruoc: () => khoaNut(true),
      traLai: () => { this._dangGhi = false; khoaNut(false); },
      thucHien: async () => {
        const r = await SHIN_API.goi('HUB', 'webGhiTuongTac', du);
        if (!r.ok) throw new Error('Chưa ghi được: ' + SHIN_API.moTaLoi(r) + ' – bấm ghi lại (không tạo dòng trùng).');
        if (r.isDemo) throw new Error('Chưa có máy chủ Hub – không ghi.');
        const d = r.data || {};
        this._dangGhi = false; this._maGhi = ''; this._maGhiCho = '';
        if (d.moi !== false && Array.isArray(this._d.tuongTac)) this._d.tuongTac.unshift({ maDoiTac: x.ma, maLead: '', ngay: this.ngayVN(new Date()), kenh: kq.goi.kenh, noiDung: kq.goi.noiDung, nguoiGhi: '' });
        ShinApp.toast((d.moi === false ? 'Lần liên hệ đã có sẵn ' : 'Đã ghi ') + (d.ma || '') + '.', 'success');
        const khung = document.getElementById('crmCT' + i);
        if (khung) { khung.hidden = true; this.moChiTiet(i); }
      }
    });
  },

  /** Đánh dấu lead i "Đã chăm sóc" | "Đã chuyển": Toast Hoàn tác 6s ➜ webDanhDauLead (chỉ ghi ô TrangThai, không xóa lead). Demo: không gửi. */
  danhDauLead: function(i, tt, nut) {
    const l = (this._d.leadMoi || [])[i];
    if (!l || this.TT_LEAD.indexOf(tt) < 0) return;
    if (!SHIN_API.laCheDoLive() || !this._d.live || !SHIN_API.layToken()) return ShinApp.toast('Đang ở Demo – không ghi lên Hub.', 'info');
    if (!/^LD\d{3,}$/.test(l.ma || '')) return ShinApp.toast('Lead chưa có mã trên Hub – tải lại CRM rồi thử lại.', 'error');
    if (this._dangDanhDau) return;
    this._dangDanhDau = true;
    if (nut) nut.disabled = true;
    ShinApp.hanhDongHoanTac('Sẽ đánh dấu ' + l.ten + ': ' + tt + '.', {
      traLai: () => { this._dangDanhDau = false; if (nut && nut.isConnected) nut.disabled = false; },
      thucHien: async () => {
        const r = await SHIN_API.goi('HUB', 'webDanhDauLead', { maLead: l.ma, trangThai: tt });
        if (!r.ok) throw new Error('Chưa ghi được: ' + SHIN_API.moTaLoi(r));
        if (r.isDemo) throw new Error('Chưa có máy chủ Hub – không ghi.');
        this._dangDanhDau = false;
        l.trangThai = (r.data || {}).trangThai || tt;
        ShinApp.toast('Đã đánh dấu ' + l.ten + ': ' + l.trangThai + '.', 'success');
        this.render(document.getElementById('appContent'), this._d);
      }
    });
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
    const dong = (ds || []).filter(l => !l.trangThai).map(l => ({ l, m: this.mucLead(this.tuoiLead(l.thoiGian, bayGio)) })).filter(x => x.m === 'do' || x.m === 'vang')
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
    const demGD = ten => b2b.filter(x => this.gdCua(x) === ten).length;
    const luongLead = typeof ModuleMarketing !== 'undefined' ? (d.leadMoi || []).map(l => ModuleMarketing.phanLuongLead(l)) : null;
    const demLuong = {}; (luongLead || []).forEach(x => { demLuong[x.luong] = (demLuong[x.luong] || 0) + 1; });
    const coDanhDau = Array.isArray(d.tuongTac);   // v2.13.9: cổng L29 có mặt (webCRM trả tuongTac)
    const quaHanLead = (d.leadMoi || []).filter(l => { if (l.trangThai) return false; const m = this.mucLead(this.tuoiLead(l.thoiGian)); return m === 'vang' || m === 'do'; }).length;
    const hien = ds.filter(x => (!loc || x.loai === loc) && (!gd || (x.loai === 'B2B Khám Sức Khỏe' && this.gdCua(x) === gd)));

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
          ${d.leadMoi.map((l, i) => { const m = this.mucLead(this.tuoiLead(l.thoiGian)); const lu = luongLead ? luongLead[i] : null; const daCS = !!l.trangThai; return `
            <div class="hang-tru crm-lead crm-lead-${m || 'xam'} crm-tt-lead-hang ${daCS ? 'crm-tt-lead-da-cham' : ''}">
              <div class="crm-tt-lead-thong-tin">
                <b>${e(l.ten)}</b>
                <div class="chu-phu crm-tt-lead-nguon">${e([l.nguon, l.soDt, l.slKham || l.khoa || l.ghiChu].filter(Boolean).join(' · '))}</div>
              </div>
              <div class="crm-tt-lead-thoigian">
                <span class="chu-phu">${e(l.thoiGian)}</span>
                ${m === 'vang' || m === 'do' ? `<span class="crm-tt-lead-canh-bao">${this.NHAN_LEAD[m]}</span>` : ''}
              </div>
              ${lu ? `<button class="btn-secondary crm-tt-btn-luong" title="${e(lu.lyDo)}" onclick="ShinApp.chuyenModule('${lu.module}')">${e(lu.nhan)}</button>` : ''}
              ${daCS ? `<span class="badge xanh crm-tt-lead-badge">✓ ${e(l.trangThai)}</span>` : coDanhDau && l.ma ? `<button class="btn-secondary crm-tt-btn-cham-soc" onclick="ModuleCRM.danhDauLead(${i}, 'Đã chăm sóc', this)">✅ Đánh dấu đã chăm sóc</button>` : ''}
            </div>`; }).join('')}
          ${quaHanLead ? `<button class="btn-secondary crm-tt-btn-sao-chep" onclick="ModuleCRM.saoChepNhacLead()">📋 Sao chép nhắc chăm sóc (${quaHanLead} lead > 24 giờ)</button>` : ''}
        </details>` : ''}

      ${b2b.length ? `
        <details class="tq-gon" ${gd ? 'open' : ''}>
          <summary><span>📈 Pipeline B2B (M2.3)</span><span class="tom-tat">${b2b.length} doanh nghiệp</span></summary>
          <div class="crm-pipe">${this.GIAI_DOAN.map(([ten, bt]) => `
            <button class="crm-pipe-o ${gd === ten ? 'dang-chon' : ''}" onclick="ModuleCRM.datGD('${ten}')" aria-pressed="${gd === ten}">
              <span class="crm-pipe-so">${ShinApp.soVN(demGD(ten))}</span><span class="crm-pipe-nhan">${bt} ${ten}</span></button>`).join('')}</div>
          ${demGD('Chưa rõ') ? `<p class="chu-phu">${demGD('Chưa rõ')} doanh nghiệp chưa rõ giai đoạn – ${d.coGiaiDoan ? 'bấm ✏️ Sửa để chọn giai đoạn' : 'ghi vào ô Trạng thái (vd "Đang báo giá", "Đã ký HĐ", "Đang triển khai", "Tái ký")'}.</p>` : ''}
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
    const tt = this.tuongTacCua(this._d.tuongTac, x.ma);
    const iconKenh = { 'Gọi': '📞', 'Zalo': '💬', 'Email': '✉️', 'Gặp': '🤝', 'Khác': '📝' };

    const timelineHTML = tt ? (tt.length ? `
      <div class="crm-tt-timeline-khung">
        <div class="crm-tt-timeline-tieu">⏳ Lịch sử tương tác (${tt.length})</div>
        <div class="crm-tt-timeline-ds">
          ${tt.map(t => `
            <div class="crm-tt-item">
              <div class="crm-tt-item-head">
                <span class="crm-tt-kenh-tag">${iconKenh[t.kenh] || '💬'} ${e(t.kenh || 'Khác')}</span>
                <span class="crm-tt-ngay">📅 ${e(t.ngay || '')}</span>
              </div>
              <div class="crm-tt-noidung">${e(t.noiDung || '')}</div>
              ${t.nguoiGhi ? `<div class="crm-tt-nguoighi">✍️ ${e(t.nguoiGhi)}</div>` : ''}
            </div>
          `).join('')}
        </div>
      </div>`
      : '<p class="chu-phu">🗂️ Chưa có lần liên hệ nào được ghi.</p>')
      : '<p class="chu-phu">🗂️ Lịch sử tương tác: tải CRM ở chế độ Live (Hub v1.20.2) để xem và ghi.</p>';

    const ghiMoiHTML = tt ? `
      <div class="crm-tt-ghi-khung">
        <label class="crm-tt-nhan" for="ttNoi${i}">💬 Ghi lần liên hệ mới</label>
        <input type="hidden" id="ttKenh${i}" value="Gọi">
        <div class="crm-tt-chips" role="radiogroup" aria-label="Chọn kênh liên hệ">
          ${this.KENH_TT.map((k, idx) => `
            <button type="button" class="crm-tt-chip ${idx === 0 ? 'dang-chon' : ''}" data-kenh="${e(k)}" onclick="ModuleCRM.chonKenh(${i}, '${e(k)}', this)">
              ${iconKenh[k] || '💬'} ${e(k)}
            </button>
          `).join('')}
        </div>
        <textarea id="ttNoi${i}" class="form-input crm-tt-textarea" rows="2" maxlength="500" placeholder="Đã gọi báo giá gói KSK… (không ghi SĐT, thông tin người bệnh)" oninput="ModuleCRM.capNhatDem(${i}, this)"></textarea>
        <div class="crm-tt-dem-thanh">
          <span class="crm-tt-luu-y">🔒 Không ghi SĐT, thông tin người bệnh</span>
          <span id="ttDem${i}" class="crm-tt-dem">0/500</span>
        </div>
      </div>` : '';

    khung.innerHTML = `
      <div class="hang-tru"><span>Người liên hệ</span><b>${e(x.nguoiLienHe || '–')}</b></div>
      <div class="hang-tru"><span>Quy mô</span><b>${e(x.quyMo || '–')}</b></div>
      ${x.loai === 'B2B Khám Sức Khỏe' ? `<div class="hang-tru"><span>Giai đoạn</span><b>${e(this.gdCua(x))}</b></div>` : ''}
      ${timelineHTML}
      ${ghiMoiHTML}
      <div class="hang-nut">
        ${tt ? `<button class="btn-primary" onclick="ModuleCRM.ghiTuongTac(${i}, this)">💬 Ghi lần liên hệ</button>` : ''}
        ${sdt.length >= 9 ? `<a class="btn-secondary" href="tel:${e(sdt)}">📞 Gọi</a>` : ''}
        <button class="btn-secondary" onclick="ModuleCRM.moForm(${i})">✏️ Sửa</button>
      </div>`;
  },

  /** THUẦN – v2.13.3: 5 lần liên hệ mới nhất của 1 đối tác (ngày dd/mm/yyyy mới trước) | null khi cổng chưa trả tuongTac. */
  tuongTacCua: function(ds, ma) {
    if (!Array.isArray(ds)) return null;
    const so = s => { const m = String(s || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m ? +m[3] * 1e4 + +m[2] * 100 + +m[1] : 0; };
    return ds.filter(t => ma && t.maDoiTac === ma).sort((a, b) => so(b.ngay) - so(a.ngay)).slice(0, 5);
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
          ${this._d.coGiaiDoan ? `<label class="nhan-o">Giai đoạn pipeline</label>
          <select id="cfGD" class="form-input"><option value="">– Tự suy từ trạng thái –</option>${this.GIAI_DOAN.map(([ten, bt]) => `<option value="${ten}" ${ten === x.giaiDoan ? 'selected' : ''}>${bt} ${ten}</option>`).join('')}</select>` : ''}
        </details>
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleCRM.luu(this, '${e(x.ma || '')}')">💾 Lưu</button></div>
      </div>`;
    khung.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  luu: async function(nut, ma) {
    const v = id => String((document.getElementById(id) || {}).value || '').trim();
    const doiTac = { ma, ten: v('cfTen'), loai: v('cfLoai'), nguoiLienHe: v('cfNguoi'), dienThoai: v('cfSdt'), quyMo: v('cfQuyMo'), trangThai: v('cfTT') };
    if (this._d.coGiaiDoan) doiTac.giaiDoan = v('cfGD');
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

  themDoiTac: function() { this.moForm(-1); },
chonKenh: function(i, kenh, nut) {
    const hidden = document.getElementById('ttKenh' + i);
    if (hidden) hidden.value = kenh;
    if (nut && nut.parentElement) {
      nut.parentElement.querySelectorAll('.crm-tt-chip').forEach(c => c.classList.remove('dang-chon'));
      nut.classList.add('dang-chon');
    }
    ShinApp.rung('nhe');
  },

  capNhatDem: function(i, el) {
    const dem = document.getElementById('ttDem' + i);
    if (!dem || !el) return;
    const len = (el.value || '').length;
    dem.textContent = len + '/500';
    if (len >= 500) dem.style.color = 'var(--c-red)';
    else if (len >= 450) dem.style.color = 'var(--c-yellow)';
    else dem.style.color = '';
  },
};
