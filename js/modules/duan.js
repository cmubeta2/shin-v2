/**
 * SHIN v2 – Module 6: Quản Lý Dự Án & Báo Cáo Nhanh Mỗi Ngày (Daily Flash Report)
 * Tích hợp Master Dashboard và 4 Khối Báo Cáo Sếp Chỉ Đạo:
 * 1. Trạng thái tiến độ
 * 2. Vướng mắc & đề xuất giải pháp
 * 3. Tình hình tài chính & phát sinh
 * 4. Chờ phê duyệt...
 */

const ModuleDuAn = {
  ma: 'duan',
  ten: 'Quản Lý Dự Án',
  bieuTuong: '📌',
  paletteMacDinh: 'executive',
  tabHienTai: 'flash', // 'flash' hoặc 'danhsach'
  mayChu: 'HUB',
  _d: null,

  /**
   * Live (v2.5.0 – HOP_DONG_CONG_V2.md mục Dự án, máy chủ Hub): webDuAn({}) ➜
   * {duAn:[{ma, ten, quanLy, tienDo, nganSach, daChi, trangThai, hanChot, mucDo}], flash:{ngay, nguoiBaoCao, tienDo[], vuongMac[], taiChinh{}, choDuyet[]}}
   */
  taiLive: async function() {
    const kq = await SHIN_API.goi('HUB', 'webDuAn', {});
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. Cổng webDuAn ➜ khuôn màn. Mọi chữ từ máy chủ được thoát HTML tại đây (khuôn vẽ chèn thẳng); màu do v2 tự tính. */
  tuV1: function(p) {
    p = p || {};
    const e = ShinApp.esc, tien = v => v === null || v === undefined || v === '' ? '—' : ShinApp.soVN(v) + ' đ';
    const MAU = { xanh: 'var(--c-green)', vang: 'var(--c-yellow)', do: 'var(--c-red)' };
    const f = p.flash || {}, tc = f.taiChinh || {};
    const ds = (p.duAn || []).map(x => ({
      ma: String(x.ma || '').replace(/[^\w-]/g, ''), ten: e(x.ten), quanLy: e(x.quanLy), tienDo: Math.max(0, Math.min(100, Math.round(Number(x.tienDo) || 0))),
      nganSach: e(tien(x.nganSach)), daChi: e(tien(x.daChi)), trangThai: e(x.trangThai), hanChot: e(x.hanChot), den: MAU[x.mucDo] || 'var(--c-blue)'
    }));
    const dungHan = (p.duAn || []).filter(x => x.mucDo === 'xanh').length;
    return {
      live: true,
      hero: {
        chao: 'Quản Lý Dự Án & Báo Cáo Nhanh 📌',
        ngay: e(f.ngay || ShinApp.ngayVN()),
        so: [
          { nhan: 'Dự án đang chạy', giaTri: ShinApp.soVN(ds.length), mau: 'var(--c-blue)' },
          { nhan: 'Đúng tiến độ', giaTri: dungHan + '/' + ds.length, mau: 'var(--c-green)' },
          { nhan: 'Việc chờ duyệt', giaTri: ShinApp.soVN((f.choDuyet || []).length), mau: 'var(--c-yellow)' }
        ]
      },
      danhSachDuAn: ds,
      flashReport: {
        ngay: e(f.ngay), nguoiBaoCao: e(f.nguoiBaoCao),
        khoi1_tienDo: (f.tienDo || []).map(e),
        khoi2_vuongMac: (f.vuongMac || []).map(v => ({ vanDe: e(v.vanDe), mucDo: e(v.mucDo), deXuat: e(v.deXuat) })),
        khoi3_taiChinh: {
          tongNganSach: e(tien(tc.tongNganSach)), daGiaiNgan: e(tien(tc.daGiaiNgan)),
          phatSinhTrongNgay: (tc.phatSinh || []).map(x => ({ khoanMuc: e(x.khoanMuc), soTien: e(tien(x.soTien)), nguoiChi: e(x.nguoiChi), tinhTrang: e(x.tinhTrang) }))
        },
        khoi4_choDuyet: (f.choDuyet || []).map(x => ({ ma: e(String(x.ma || '').replace(/[^\w-]/g, '')), loai: e(x.loai), tieuDe: e(x.tieuDe), han: e(x.han), uuTien: e(x.uuTien) }))
      }
    };
  },

  render: function(container, data) {
    const d = data || this._d || window.SHIN_DEMO_DATA.duan;
    this._d = d;
    const hero = d.hero || {};
    const danhSach = d.danhSachDuAn || [];
    const flash = d.flashReport || {};

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Lý Dự Án</div>
          <div class="page-sub">Master Dashboard & Báo Cáo Nhanh Mỗi Ngày (Daily Flash)</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-secondary" style="min-height:44px; padding:0 12px; font-size:14px;" onclick="ModuleDuAn.chuyenTab('flash')">⚡ Flash Report</button>
          <button class="btn-secondary" style="min-height:44px; padding:0 12px; font-size:14px;" onclick="ModuleDuAn.chuyenTab('danhsach')">📊 Danh Sách</button>
        </div>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Quản Lý Dự Án & Báo Cáo Nhanh 📌'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Chu kỳ điều hành Q4/2026'}</div>
          </div>
        </div>

        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o">
              <div class="tq-so" style="color: ${s.mau}">${s.giaTri}</div>
              <div class="tq-nhan">${s.nhan}</div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; gap:10px; margin-top:14px;">
          <button class="btn-primary" style="flex:1;" onclick="ModuleDuAn.moFormTaoMoi()">
            ＋ Tạo Dự Án Mới
          </button>
          <button class="btn-secondary" style="background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.4);" onclick="ModuleDuAn.xuatBaoCao()">
            📤 Xuất PDF
          </button>
        </div>
      </div>

      <!-- Tab Điều Hướng Phụ -->
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 16px 0; border-bottom:1px solid var(--border); padding-bottom:8px;">
        <button class="module-chip ${this.tabHienTai === 'flash' ? 'active' : ''}" style="white-space:normal;" onclick="ModuleDuAn.chuyenTab('flash')">
          ⚡ Báo Cáo Nhanh Hôm Nay (Daily Flash)
        </button>
        <button class="module-chip ${this.tabHienTai === 'danhsach' ? 'active' : ''}" style="white-space:normal;" onclick="ModuleDuAn.chuyenTab('danhsach')">
          📊 Master Dashboard (${danhSach.length})
        </button>
        <button class="module-chip ${this.tabHienTai === 'matran' ? 'active' : ''}" style="white-space:normal;" onclick="ModuleDuAn.chuyenTab('matran')">
          🧱 Ma Trận Vướng Mắc (${this.maTranVuongMac(d).length})
        </button>
      </div>

      <div id="duAnTabContent">
        ${this.tabHienTai === 'flash' ? this.renderFlash(flash) : this.tabHienTai === 'matran' ? this.renderMaTran(this.maTranVuongMac(d)) : this.renderDanhSach(danhSach)}
      </div>
    `;

    container.innerHTML = html;
  },

  renderFlash: function(flash) {
    const k1 = flash.khoi1_tienDo || [];
    const k2 = flash.khoi2_vuongMac || [];
    const k3 = flash.khoi3_taiChinh || {};
    const k4 = flash.khoi4_choDuyet || [];

    return `
      <!-- Khung Flash Report Độc Quyền Theo Yêu Cầu Của Sếp -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="font-size:14px; font-weight:700; color:var(--text);">
          ⏱️ CHỐT DỮ LIỆU: <span style="color:var(--primary);">${flash.ngay || 'Hôm nay'}</span>
        </div>
        <span class="status-pill live">Tự động tổng hợp 24/7</span>
      </div>

      <!-- KHỐI 1: TRẠNG THÁI TIẾN ĐỘ -->
      <div class="flash-card flash-k1">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#0284c7;">1</span>
            TRẠNG THÁI TIẾN ĐỘ DỰ ÁN
          </div>
          <span style="font-size:14px; color:var(--text-muted);">${k1.length} điểm tin chính</span>
        </div>
        <ul class="flash-list">
          ${k1.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>

      <!-- KHỐI 2: VƯỚNG MẮC & ĐỀ XUẤT GIẢI PHÁP -->
      <div class="flash-card flash-k2">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#dc2626;">2</span>
            VƯỚNG MẮC & ĐỀ XUẤT GIẢI PHÁP
          </div>
          <span class="status-pill danger" style="padding:2px 8px; font-size:14px;">Cần chú ý</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${k2.map((v, i) => `
            <div style="background:var(--bg-card); padding:10px 12px; border-radius:8px; border:1px solid var(--border);">
              <div style="font-weight:700; font-size:14px; color:var(--text); margin-bottom:4px;">
                ⚠️ ${v.vanDe}
              </div>
              <div style="font-size:14px; color:var(--c-green); font-weight:600; line-height:1.4;">
                💡 <strong>Đề xuất giải pháp:</strong> ${v.deXuat}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- KHỐI 3: TÌNH HÌNH TÀI CHÍNH & PHÁT SINH -->
      <div class="flash-card flash-k3">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#16a34a;">3</span>
            TÌNH HÌNH TÀI CHÍNH & PHÁT SINH
          </div>
          <div style="font-size:14px; font-weight:700; color:var(--text);">
            Giải ngân: ${k3.daGiaiNgan || '—'}
          </div>
        </div>
        <div style="font-size:14px; color:var(--text-muted); margin-bottom:8px;">
          Tổng quỹ phê duyệt: <strong>${k3.tongNganSach || '—'}</strong>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${(k3.phatSinhTrongNgay || []).map(p => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); padding:8px 12px; border-radius:6px; font-size:14px; border:1px solid var(--border);">
              <div>
                <div style="font-weight:600; color:var(--text);">${p.khoanMuc}</div>
                <div style="color:var(--text-muted); font-size:14px;">Người đề xuất: ${p.nguoiChi}</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:700; color:var(--c-red);">${p.soTien}</div>
                <span class="status-pill ${p.tinhTrang.includes('Chờ') ? 'warn' : 'live'}" style="font-size:14px; padding:2px 6px;">
                  ${p.tinhTrang}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- KHỐI 4: VIỆC ĐANG CHỜ PHÊ DUYỆT -->
      <div class="flash-card flash-k4">
        <div class="flash-head">
          <div class="flash-title">
            <span class="flash-badge" style="background:#d97706;">4</span>
            VIỆC ĐANG CHỜ SẾP PHÊ DUYỆT
          </div>
          <span class="status-pill warn" style="padding:2px 8px; font-size:14px;">${k4.length} mục chờ</span>
        </div>
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${k4.map(cd => `
            <div style="background:var(--bg-card); padding:10px 12px; border-radius:8px; border:1px solid var(--border);">
              <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div style="font-weight:700; font-size:14px; color:var(--text);">${cd.tieuDe}</div>
                <span style="font-size:14px; color:var(--c-red); font-weight:700; white-space:nowrap; margin-left:8px;">${cd.uuTien}</span>
              </div>
              <div style="font-size:14px; color:var(--text-muted); margin:4px 0 8px 0;">Phân loại: ${cd.loai} · Hạn: ${cd.han}</div>
              <div style="display:flex; gap:8px;">
                <button class="btn-primary" style="flex:1; min-height:44px; padding:0 8px; font-size:14px; background:var(--c-green);" onclick="ModuleDuAn.duyetNhanh('${cd.ma}')">
                  ✓ Duyệt 1-Chạm
                </button>
                <button class="btn-secondary" style="min-height:44px; padding:0 10px; font-size:14px;" onclick="ModuleDuAn.yeuCauSua('${cd.ma}')">
                  Góp ý / Yêu cầu sửa
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  renderDanhSach: function(danhSach) {
    return `
      <div style="display:flex; flex-direction:column; gap:12px;">
        ${danhSach.map(da => `
          <div class="card" style="border-left:4px solid ${da.den};">
            <div class="card-header">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--primary);">${da.ma}</div>
                <div class="card-title" style="font-size:15px; margin-top:2px;">${da.ten}</div>
              </div>
              <span class="status-pill" style="background:${da.den}20; color:${da.den}; font-weight:700;">
                ${da.tienDo}%
              </span>
            </div>

            <!-- Thanh Tiến Độ -->
            <div style="background:var(--border); height:6px; border-radius:3px; margin:10px 0; overflow:hidden;">
              <div style="background:${da.den}; width:${da.tienDo}%; height:100%;"></div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:14px; color:var(--text-muted); margin-bottom:10px;">
              <div>👤 Phụ trách: <strong>${da.quanLy}</strong></div>
              <div>📅 Hạn: <strong>${da.hanChot}</strong></div>
              <div>💰 Ngân sách: <strong>${da.nganSach}</strong></div>
              <div>💳 Đã chi: <strong>${da.daChi}</strong></div>
            </div>

            <div style="font-size:14px; color:var(--text); background:var(--bg-sub); padding:6px 10px; border-radius:6px; margin-bottom:10px;">
              📌 <strong>Trạng thái:</strong> ${da.trangThai}
            </div>

            <div style="display:flex; gap:8px;">
              <button class="btn-secondary" style="flex:1; min-height:44px; font-size:14px;" onclick="ShinApp.toast('Mở chi tiết dự án: ${da.ma}')">
                Chi tiết WBS
              </button>
              <button class="btn-primary" style="min-height:44px; font-size:14px; padding:0 12px;" onclick="ShinApp.toast('Cập nhật tiến độ dự án: ${da.ma}')">
                Cập nhật
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * M6.3 Blocker Matrix (v2.7.8) – THUẦN, chạy hoàn toàn phía trình duyệt trên dữ liệu màn đang có
   * (Live: webDuAn đã thoát HTML trong tuV1; Demo: demo_data). Gom 3 nguồn:
   *  ① Khối 2 Flash (vướng mắc + đề xuất), ② dự án đèn đỏ / vàng, ③ dự án quá hạn mà chưa 100%.
   * Trả [{vanDe, nguon, muc:'cao'|'vua'|'thap', nguoiXuLy, han, deXuat, quaHan}] xếp Cao → Thấp, quá hạn lên trước.
   */
  maTranVuongMac: function(d, homNay) {
    d = d || {};
    const nay = homNay instanceof Date ? homNay : new Date();
    const moc = new Date(nay.getFullYear(), nay.getMonth(), nay.getDate()).getTime();
    const docNgay = s => { const m = String(s || '').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/); return m ? new Date(+m[3], +m[2] - 1, +m[1]).getTime() : null; };
    const mucTu = s => { const t = String(s || '').toLowerCase(); return /cao|đỏ|gấp|khẩn|nghiêm/.test(t) ? 'cao' : /vừa|trung|vàng/.test(t) ? 'vua' : 'thap'; };
    const flash = d.flashReport || {};
    const ds = d.danhSachDuAn || [];
    const kq = [];
    (flash.khoi2_vuongMac || []).forEach(v => kq.push({ vanDe: v.vanDe || '', nguon: 'Flash hôm nay', muc: mucTu(v.mucDo), nguoiXuLy: flash.nguoiBaoCao || '', han: '', deXuat: v.deXuat || '', quaHan: false }));
    ds.forEach(da => {
      const t = docNgay(da.hanChot), quaHan = t !== null && t < moc && Number(da.tienDo) < 100;
      const den = String(da.den || '');
      const muc = quaHan || den.indexOf('red') >= 0 ? 'cao' : den.indexOf('yellow') >= 0 ? 'vua' : null;
      if (!muc) return;
      kq.push({ vanDe: (quaHan ? 'Quá hạn ' : 'Chậm tiến độ ') + (da.ma || '') + ' – ' + (da.ten || ''), nguon: 'Dự án · ' + (Number(da.tienDo) || 0) + '%', muc, nguoiXuLy: da.quanLy || '', han: da.hanChot || '', deXuat: da.trangThai || '', quaHan });
    });
    const thuTu = { cao: 0, vua: 1, thap: 2 };
    return kq.sort((a, b) => thuTu[a.muc] - thuTu[b.muc] || (b.quaHan - a.quaHan));
  },

  /* v2.9.2 (M9.4) – Trích bài học kinh nghiệm PHÍA TRÌNH DUYỆT từ Blocker Matrix (Flash Khối 2 + dự án chậm / quá hạn):
     mỗi vướng mắc có đề xuất ➜ 1 bài học {chuDe, vanDe, cachLam, nguon, muc}; xuất Markdown có [[Chủ đề]] để dán vào kho 📚 Tri thức
     (kho chưa có máy chủ ➜ chỉ sao chép, không gửi gì đi). */
  CHU_DE_BH: [
    ['Nhân sự', /nhân sự|nhân viên|thiếu người|ca trực|tuyển|đào tạo|bác sĩ|điều dưỡng/],
    ['Thiết bị & Hậu cần', /thiết bị|máy|xe|x-quang|vật tư|kho|hậu cần|sửa chữa/],
    ['Tài chính', /tiền|chi phí|ngân sách|thanh toán|công nợ|tạm ứng|chuyển khoản|đơn giá|học phí|doanh thu/],
    ['Khách hàng & Hợp đồng', /khách|hợp đồng|đối tác|doanh nghiệp|báo giá|ký |bệnh nhân|khảo sát/],
    ['Tiến độ & Quy trình', /tiến độ|chậm|quá hạn|quy trình|thủ tục|duyệt|hồ sơ|giấy phép/]
  ],

  /** THUẦN. ds: kết quả maTranVuongMac ➜ [{chuDe, vanDe, cachLam, nguon, muc, nguoiXuLy}]. Chỉ lấy vướng mắc Flash Khối 2 có đề xuất
   *  (dòng dự án chậm / quá hạn chỉ mang trạng thái, không phải cách làm), bỏ trùng vấn đề. giaiMa: hàm bỏ thẻ HTML (tùy chọn). */
  trichBaiHoc: function(ds, giaiMa) {
    const g = giaiMa || (s => String(s || '').replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&'));
    const daCo = {}, ra = [];
    (ds || []).filter(x => /^Flash/.test(String(x.nguon || ''))).forEach(x => {
      const vanDe = g(x.vanDe).trim(), cachLam = g(x.deXuat).trim();
      if (!vanDe || !cachLam) return;
      const khoa = vanDe.toLowerCase();
      if (daCo[khoa]) return; daCo[khoa] = 1;
      const t = (vanDe + ' ' + cachLam).toLowerCase();
      const cd = (this.CHU_DE_BH.find(([, re]) => re.test(t)) || ['Khác'])[0];
      ra.push({ chuDe: cd, vanDe, cachLam, nguon: g(x.nguon), muc: x.muc, nguoiXuLy: g(x.nguoiXuLy) });
    });
    return ra;
  },

  /** THUẦN. Bài học ➜ Markdown gom theo chủ đề, có [[wiki-link]] (M9.3) và dòng nguồn. */
  baiHocMarkdown: function(bh, ngay) {
    if (!bh || !bh.length) return '';
    const nhom = {};
    bh.forEach(b => (nhom[b.chuDe] = nhom[b.chuDe] || []).push(b));
    const MUC = { cao: '🔴', vua: '🟡', thap: '🟢' };
    return `# Bài học kinh nghiệm – Flash ${ngay || ''}`.trim() + '\n\n' + Object.keys(nhom).map(cd =>
      `## [[${cd}]]\n` + nhom[cd].map(b => `- ${MUC[b.muc] || '•'} **Vấn đề:** ${b.vanDe}\n  - **Cách làm / đề xuất:** ${b.cachLam}\n  - Nguồn: ${b.nguon}${b.nguoiXuLy ? ' · ' + b.nguoiXuLy : ''}`).join('\n')
    ).join('\n\n') + '\n';
  },

  /* v2.13.10 – HUB L28 `webLuuBaiHoc` lên app (Hub v1.20.2 @20): gửi bài học vào sổ BaiHoc (trạng thái Chờ – Admin duyệt mới vào kho). */
  /** THUẦN – mã gửi ỔN ĐỊNH theo nội dung (gửi lại cùng bài ➜ Hub trả moi:false, không trùng). Hub đòi ^[A-Za-z0-9_-]{6,40}$. */
  maGuiBaiHoc: function(b) {
    const s = [b.chuDe, b.vanDe, b.cachLam].join('|');
    let h1 = 5381, h2 = 52711;
    for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = (h1 * 33 ^ c) >>> 0; h2 = (h2 * 31 + c) >>> 0; }
    return 'bh' + h1.toString(36) + h2.toString(36);
  },

  /** THUẦN – 1 bài học ➜ {goi: {baiHoc, maGui}} | {loi} theo luật Hub kiemBaiHoc (vấn đề 5–500, cách làm 5–1000, nguồn ≤ 120,
   *  không SĐT / CCCD / BHYT / "BN"). */
  kiemBaiHoc: function(b) {
    const cat = v => String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
    const CD = this.CHU_DE_BH.map(([t]) => t).concat('Khác');
    const bh = { chuDe: CD.indexOf(cat(b.chuDe)) >= 0 ? cat(b.chuDe) : 'Khác', vanDe: cat(b.vanDe), cachLam: cat(b.cachLam), nguon: cat(b.nguon).slice(0, 120) };
    if (bh.vanDe.length < 5 || bh.vanDe.length > 500) return { loi: 'Vấn đề cần 5–500 ký tự.' };
    if (bh.cachLam.length < 5 || bh.cachLam.length > 1000) return { loi: 'Cách làm cần 5–1000 ký tự.' };
    const t = [bh.vanDe, bh.cachLam, bh.nguon].join(' ');
    if (/(^|\D)0\d{9}(?!\d)/.test(t.replace(/[\s.-]/g, '')) || /(^|\D)\d{12}(?!\d)|\b[A-Z]{2}[1-5]\d{12}\b|\bBN\b/.test(t)) return { loi: 'Có SĐT / CCCD / BHYT / thông tin người bệnh.' };
    return { goi: { baiHoc: bh, maGui: this.maGuiBaiHoc(bh) } };
  },

  /** Gửi mọi bài học hợp lệ vào kho (Toast Hoàn tác 6s ➜ mỗi bài 1 lần `webLuuBaiHoc`). Demo: không gửi. */
  guiBaiHoc: function(nut) {
    const bh = this.trichBaiHoc(this._maTran || []);
    if (!bh.length) return ShinApp.toast('Chưa có vướng mắc nào kèm đề xuất để rút bài học.', 'info');
    if (!SHIN_API.laCheDoLive() || !SHIN_API.layToken()) return ShinApp.toast('Đang ở Demo – không gửi lên Hub. Dùng 📋 để sao chép.', 'info');
    if (this._dangGuiBH) return;
    const kq = bh.map(b => this.kiemBaiHoc(b)), hop = kq.filter(k => k.goi), bo = kq.length - hop.length;
    if (!hop.length) return ShinApp.toast('Không bài nào gửi được (' + (kq[0] || {}).loi + ').', 'error');
    this._dangGuiBH = true;
    const khoaNut = on => { if (nut && nut.isConnected) { nut.disabled = on; nut.innerHTML = on ? '⏳ Chờ 6 giây…' : '📤 Gửi bài học vào kho 🧠 (chờ Admin duyệt)'; } };
    ShinApp.hanhDongHoanTac('Sẽ gửi ' + hop.length + ' bài học vào kho tri thức' + (bo ? ' (bỏ ' + bo + ' bài không hợp lệ)' : '') + '.', {
      lamTruoc: () => khoaNut(true),
      traLai: () => { this._dangGuiBH = false; khoaNut(false); },
      thucHien: async () => {
        let moi = 0, cu = 0, loi = '';
        for (const k of hop) {
          const r = await SHIN_API.goi('HUB', 'webLuuBaiHoc', k.goi);
          if (!r.ok || r.isDemo) { loi = r.isDemo ? 'chưa có máy chủ Hub' : SHIN_API.moTaLoi(r); break; }
          if ((r.data || {}).moi === false) cu++; else moi++;
        }
        this._dangGuiBH = false; khoaNut(false);
        if (loi && !moi && !cu) throw new Error('Chưa gửi được: ' + loi + ' – bấm gửi lại (không tạo bài trùng).');
        ShinApp.toast('Đã gửi ' + moi + ' bài mới' + (cu ? ', ' + cu + ' bài đã có sẵn' : '') + (loi ? ' – dừng giữa chừng: ' + loi + ', bấm gửi lại phần còn lại' : '') + ' · chờ Admin duyệt ở 🧠 Tri thức.', loi ? 'warn' : 'success');
      }
    });
  },

  saoChepBaiHoc: function() {
    const bh = this.trichBaiHoc(this._maTran || []);
    if (!bh.length) return ShinApp.toast('Chưa có vướng mắc nào kèm đề xuất để rút bài học.', 'info');
    const txt = this.baiHocMarkdown(bh, ((this._d || {}).flashReport || {}).ngay || new Date().toLocaleDateString('vi-VN'));
    const xong = () => ShinApp.toast(`Đã sao chép ${bh.length} bài học (Markdown) – dán vào kho 📚 Tri thức.`, 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  },

  renderMaTran: function(ds) {
    if (!ds.length) return `<div class="card" style="text-align:center; padding:24px; font-size:14px; color:var(--text-muted);">✅ Không có vướng mắc nào cần gỡ.</div>`;
    const NHOM = [['cao', '🔴 Cao – gỡ trong ngày', 'var(--c-red)'], ['vua', '🟡 Vừa – gỡ trong tuần', 'var(--c-yellow)'], ['thap', '🟢 Thấp – theo dõi', 'var(--c-green)']];
    this._maTran = ds;
    const bh = this.trichBaiHoc(ds);
    const dauBh = bh.length ? `
      <div class="card" style="padding:12px; margin-bottom:14px;">
        <div style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:6px;">💡 Bài học kinh nghiệm · ${bh.length}</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:8px;">${[...new Set(bh.map(b => b.chuDe))].map(cd => `<span class="badge xam" style="font-size:14px;">${ShinApp.esc(cd)} · ${bh.filter(b => b.chuDe === cd).length}</span>`).join('')}</div>
        <button class="btn-secondary" style="min-height:44px; font-size:14px; width:100%;" onclick="ModuleDuAn.saoChepBaiHoc()">📋 Sao chép bài học (Markdown cho 📚 Tri thức)</button>
        <button class="btn-primary" style="min-height:44px; font-size:14px; width:100%; margin-top:8px;" onclick="ModuleDuAn.guiBaiHoc(this)">📤 Gửi bài học vào kho 🧠 (chờ Admin duyệt)</button>
      </div>` : '';
    return dauBh + NHOM.map(([k, nhan, mau]) => {
      const nhom = ds.map((x, i) => ({ x, i })).filter(o => o.x.muc === k);
      if (!nhom.length) return '';
      return `
        <div style="margin-bottom:14px;">
          <div style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:8px;">${nhan} · ${nhom.length}</div>
          <div style="display:flex; flex-direction:column; gap:8px;">
            ${nhom.map(({ x, i }) => `
              <div class="card" style="border-left:4px solid ${mau}; padding:12px;">
                <div style="font-size:14px; font-weight:700; color:var(--text); line-height:1.4; overflow-wrap:anywhere;">${x.quaHan ? '⏰ ' : '⚠️ '}${x.vanDe}</div>
                <div style="display:flex; flex-wrap:wrap; gap:6px 14px; font-size:14px; color:var(--text-muted); margin:6px 0;">
                  <span>📍 ${x.nguon}</span>
                  <span>👤 ${x.nguoiXuLy || '<em>chưa giao</em>'}</span>
                  ${x.han ? `<span>📅 Hạn: <strong>${x.han}</strong></span>` : ''}
                </div>
                ${x.deXuat ? `<div style="font-size:14px; color:var(--text); background:var(--bg-sub); padding:6px 10px; border-radius:6px; line-height:1.4; overflow-wrap:anywhere;">💡 ${x.deXuat}</div>` : ''}
                <button class="btn-secondary" style="margin-top:8px; min-height:44px; font-size:14px; width:100%;" onclick="ModuleDuAn.saoChepVuongMac(${i})">📋 Sao chép để giao việc</button>
              </div>`).join('')}
          </div>
        </div>`;
    }).join('');
  },

  /** Task Bus (M7.1) chưa có máy chủ ➜ sao chép nội dung để dán vào ⚡ Giao việc / Telegram. Không gửi gì đi. */
  saoChepVuongMac: function(i) {
    const x = (this._maTran || [])[i];
    if (!x) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = [x.vanDe, x.nguoiXuLy && ('Người xử lý: ' + x.nguoiXuLy), x.han && ('Hạn: ' + x.han), x.deXuat && ('Đề xuất: ' + x.deXuat)].filter(Boolean).join('\n');
    const txt = tmp.textContent;
    const xong = () => ShinApp.toast('Đã sao chép – dán vào ⚡ Giao việc hoặc Telegram.');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'info'));
    else ShinApp.toast('Trình duyệt chặn sao chép.', 'info');
  },

  chuyenTab: function(tab) {
    this.tabHienTai = tab;
    const container = document.getElementById('appContent');
    if (container) {
      this.render(container, this._d);
    }
  },

  /** Việc chờ duyệt của dự án đi qua Trung tâm Phê duyệt 0B (một sổ duyệt chung). */
  duyetNhanh: function(ma) {
    if (SHIN_API.laCheDoLive() && this._d && this._d.live) { ShinApp.chuyenModule('pheduyet'); return; }
    ShinApp.toast(`Đã duyệt mục ${ma} (mẫu).`);
  },

  yeuCauSua: function(ma) {
    if (SHIN_API.laCheDoLive() && this._d && this._d.live) { ShinApp.chuyenModule('pheduyet'); return; }
    ShinApp.toast(`Đã gửi yêu cầu sửa cho ${ma} (mẫu).`, 'info');
  },

  moFormTaoMoi: function() {
    ShinApp.toast('Mở biểu mẫu khởi tạo dự án mới', 'info');
  },

  xuatBaoCao: function() {
    ShinApp.toast('Đang chuẩn bị file Flash Report PDF...', 'info');
  }
};
