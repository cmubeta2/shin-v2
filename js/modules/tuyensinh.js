/**
 * SHIN v2 – Mảng 4: Giáo dục & Tuyển sinh
 * Live: máy chủ 60_TuyenSinh –
 *   đọc : webKhoiDong (chiến dịch, danh mục, số lead) · webLeadCD(maCD) (phễu, hoa hồng, lead, người tư vấn)
 *   ghi : webLuuLead(lead) · webThemNhatKy(maLead, noi) · webChuyenCD(maLead, maCDMoi) · webXoaLead(maLead, xoa)
 *         webLuuChienDich(cd, bac) · webChepChienDich(maNguon)  – 2 cổng chiến dịch chỉ Admin.
 * Luật kiểm (SĐT, bước phễu, Loss cần lý do, trùng SĐT cùng chiến dịch, quyền xem lead) vẫn do máy chủ v1 giữ; v2 kiểm trước cho nhanh.
 */

const ModuleTuyenSinh = {
  ma: 'tuyensinh',
  ten: 'Tuyển Sinh',
  bieuTuong: '🎓',
  paletteMacDinh: 'growth',
  mayChu: 'TS',

  _d: null,
  _lead: {},      // maCD ➜ dữ liệu webLeadCD đang mở
  _dsNguoi: [],   // người tư vấn (Admin chọn người phụ trách)

  O_CD: [
    ['Nganh', 'Ngành'], ['BatDau', 'Bắt đầu', 'ngay'], ['GD1Den', 'Hết hâm nóng', 'ngay'], ['GD2Den', 'Hết bùng nổ', 'ngay'],
    ['MocXetTuyen', 'Mốc xét tuyển'], ['HocPhiSo', 'Học phí (đ)', 'so'], ['ChiTieuSo', 'Chỉ tiêu hồ sơ', 'so'], ['NguoiPhuTrach', 'Người phụ trách'],
    ['ChanDung', 'Chân dung học viên'], ['USP', 'Điểm khác biệt (USP)'], ['ThongDiep', 'Thông điệp'], ['LinkWeb', 'Link trang đích'], ['NhomZalo', 'Nhóm Zalo'], ['GhiChu', 'Ghi chú']
  ],

  taiLive: async function() {
    const kq = await SHIN_API.goiCong('TS', 'webKhoiDong');
    if (!kq.ok) return kq;
    return { ok: true, data: this.tuV1(kq.data) };
  },

  /** THUẦN. webKhoiDong TS v1 ➜ khuôn màn Tuyển sinh v2 (giữ bản gốc từng chiến dịch trong .goc để sửa). */
  tuV1: function(k) {
    k = k || {};
    const soLead = k.soLead || {};
    const ds = (k.chienDich || []).map(c => ({
      ma: c.MaCD,
      ten: c.TenCD || c.MaCD,
      phu: [c.Truong, c.Bac, c.Dot ? 'Đợt ' + c.Dot : ''].filter(Boolean).join(' · '),
      han: (c.gd || '') + (c.conNgay !== null && c.conNgay !== undefined ? ` · còn ${c.conNgay} ngày${c.moc ? ' (' + c.moc + ')' : ''}` : ''),
      lead: soLead[c.MaCD] || 0,
      dong: !!c.dong,
      gan: !c.dong && c.conNgay !== null && c.conNgay !== undefined && c.conNgay <= 7,
      goc: c
    }));
    const mo = ds.filter(c => !c.dong);
    const tongLead = Object.keys(soLead).reduce((s, m) => s + (Number(soLead[m]) || 0), 0);
    return {
      live: true,
      goc: k,
      xemLead: !!k.xemLead,
      laAdmin: !!k.laAdmin,
      danhMuc: k.danhMuc || {},
      hero: {
        chao: 'Tuyển Sinh & Cung Ứng Nhân Lực 🎓',
        ngay: ShinApp.ngayVN(),
        so: [
          { nhan: 'Chiến dịch đang mở', giaTri: ShinApp.soVN(mo.length), mau: 'var(--c-blue)' },
          { nhan: 'Lead đang theo', giaTri: k.xemLead ? ShinApp.soVN(tongLead) : '–', mau: 'var(--c-green)' },
          { nhan: 'Sắp hết hạn (≤ 7 ngày)', giaTri: ShinApp.soVN(mo.filter(c => c.gan).length), mau: mo.some(c => c.gan) ? 'var(--c-yellow)' : 'var(--c-green)' }
        ]
      },
      chienDich: ds
    };
  },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.tuyensinh;
    this._d = d;
    this._lead = {};
    const e = ShinApp.esc;
    const hero = d.hero || {};
    const chienDich = d.chienDich || [];
    const coLead = !d.live || d.xemLead;

    container.innerHTML = `
      <div class="page-header">
        <div>
          <div class="page-title">🎓 Tuyển Sinh</div>
          <div class="page-sub">Chiến dịch · Phễu lead · Hoa hồng bậc thang</div>
        </div>
        <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
      </div>

      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${e(hero.chao || 'Tuyển Sinh & Cung Ứng Nhân Lực 🎓')}</div>
            <div class="hero-date">📅 ${e(hero.ngay || ShinApp.ngayVN())}</div>
          </div>
        </div>
        <div class="tq-3so">
          ${(hero.so || []).map(s => `
            <div class="tq-o" onclick="document.getElementById('tsCD').scrollIntoView({behavior:'smooth'})">
              <div class="tq-so" style="color: ${s.mau}">${e(s.giaTri)}</div>
              <div class="tq-nhan">${e(s.nhan)}</div>
            </div>
          `).join('')}
        </div>
        ${coLead ? '<button class="btn-primary" onclick="ModuleTuyenSinh.moFormLead(null)">＋ Tiếp nhận lead mới</button>' : ''}
      </div>

      <div id="tsForm"></div>

      <div class="hn-tieu" id="tsCD">
        <span>CHIẾN DỊCH · ${chienDich.length}</span>
        ${d.laAdmin ? '<button class="btn-secondary nut-nho" onclick="ModuleTuyenSinh.moFormCD(-1)">＋ Chiến dịch mới</button>' : ''}
      </div>
      <div class="hn-list">
        ${chienDich.map((cd, i) => `
          <div class="hn-dong ${cd.dong ? 'mo-di' : ''}" onclick="ModuleTuyenSinh.chiTietCD(${i})">
            <div class="dong-icon" style="background: var(--primary-soft); color: var(--primary)">🎓</div>
            <div class="dong-content">
              <div class="dong-title">${e(cd.ten)}</div>
              <div class="dong-sub">${e(cd.phu || cd.hoaHong || '')}${cd.han ? ' · ' + e(cd.han) : ''}${cd.dong ? ' · Đã đóng' : ''}</div>
            </div>
            <div class="dong-meta">
              ${cd.gan ? '<span class="badge vang">Sắp hết hạn</span>' : ''}
              <div class="dong-so" style="color: var(--primary);">${e(cd.nhapHoc !== undefined ? cd.nhapHoc + '/' + cd.lead : cd.lead)}</div>
              <span class="dong-arrow">›</span>
            </div>
          </div>
          <div class="chi-tiet-dong" id="tsCT${i}" hidden></div>
        `).join('')}
      </div>
      ${chienDich.length ? '' : `<div class="trong">Chưa có chiến dịch nào.${d.laAdmin ? ' Bấm "＋ Chiến dịch mới" để tạo.' : ''}</div>`}

      <details class="tq-gon" id="tsLms">
        <summary><span>🏫 Lớp học & điểm danh (LMS mini · M4.5)</span></summary>
        <div id="tsLmsNoi"></div>
      </details>

      <details class="tq-gon">
        <summary><span>ⓘ Cổng lead web & hoa hồng</span></summary>
        <p class="chu-phu">Trang đích gửi lead về app Tuyển sinh: chống trùng 1 SĐT / 10 phút, bẫy honeypot chặn bot. Hoa hồng tính theo bậc số học viên nhập học của từng chiến dịch.</p>
      </details>
    `;
    this.veLms();
  },

  /* ---------------- v2.12.1 M4.5 LMS mini (dữ liệu mẫu + lưu trên máy) ---------------- */
  KHOA_LMS: 'shin_lms',
  _lop: null,
  /** THUẦN: điểm danh {'lop|ngày': [tên]} ➜ [{ten, co, tong, phanTram, canhBao}] cho 1 lớp; canhBao khi < nguong % (mặc định 80). */
  chuyenCan: function(diemDanh, maLop, hocVien, nguong) {
    nguong = nguong == null ? 80 : nguong;
    const buoi = Object.keys(diemDanh || {}).filter(k => k.split('|')[0] === maLop);
    return (hocVien || []).map(ten => {
      const co = buoi.filter(k => (diemDanh[k] || []).indexOf(ten) >= 0).length;
      const phanTram = buoi.length ? Math.round(co / buoi.length * 100) : null;
      return { ten, co, tong: buoi.length, phanTram, canhBao: phanTram != null && phanTram < nguong };
    });
  },
  /** THUẦN: tiến độ bài ➜ {xong, tong, phanTram, ke} (ke = mã bài kế tiếp chưa học, theo thứ tự). */
  tienDoBai: function(baiXong, dsBai) {
    const xong = (dsBai || []).filter(b => (baiXong || []).indexOf(b.ma) >= 0).length, tong = (dsBai || []).length;
    const ke = (dsBai || []).find(b => (baiXong || []).indexOf(b.ma) < 0);
    return { xong, tong, phanTram: tong ? Math.round(xong / tong * 100) : 0, ke: ke ? ke.ma : null };
  },
  docLms: function() {
    const L = window.MAU_LMS || {};
    let k = null;
    try { k = JSON.parse(localStorage.getItem(this.KHOA_LMS) || 'null'); } catch (e) { k = null; }
    return k && k.diemDanh ? k : { diemDanh: Object.assign({}, L.diemDanhMau), baiXong: JSON.parse(JSON.stringify(L.baiXongMau || {})) };
  },
  ghiLms: function(k) { try { localStorage.setItem(this.KHOA_LMS, JSON.stringify(k)); return true; } catch (e) { ShinApp.toast('Trình duyệt không cho lưu trên máy.', 'error'); return false; } },
  ngayNay: function() { const d = new Date(), p = n => String(n).padStart(2, '0'); return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()); },

  veLms: function() {
    const o = document.getElementById('tsLmsNoi'), L = window.MAU_LMS;
    if (!o) return;
    if (!L) { o.innerHTML = '<div class="trong">Chưa tải được dữ liệu lớp mẫu (mau_lms.js).</div>'; return; }
    const e = ShinApp.esc, k = this.docLms();
    const lop = L.lop.find(x => x.ma === this._lop) || L.lop[0];
    this._lop = lop.ma;
    const ngay = (document.getElementById('tsLmsNgay') || {}).value || this.ngayNay();
    const coMat = k.diemDanh[lop.ma + '|' + ngay];
    const cc = this.chuyenCan(k.diemDanh, lop.ma, lop.hocVien);
    const td = this.tienDoBai(k.baiXong[lop.ma], L.bai);
    const ccTB = cc.filter(x => x.phanTram != null);
    const tb = ccTB.length ? Math.round(ccTB.reduce((s, x) => s + x.phanTram, 0) / ccTB.length) : null;
    const baiKe = L.bai.find(b => b.ma === td.ke);
    const tuanMoMacDinh = baiKe ? baiKe.tuan : 1;
    const dsTuan = [...new Set(L.bai.map(b => b.tuan))];

    o.innerHTML = `
      <div class="chu-phu" style="color:var(--c-yellow);margin-bottom:8px">⚠️ Dữ liệu MẪU – điểm danh, tiến độ lưu trên máy này. Còn chờ v1: lớp + học viên thật từ app Tuyển sinh.</div>
      
      <div class="hang-nut" role="group" aria-label="Chọn lớp" style="margin-bottom:8px">
        ${L.lop.map(x => `<button class="${x.ma === lop.ma ? 'btn-primary' : 'btn-secondary'}" style="min-height:44px;padding:8px 16px" onclick="ModuleTuyenSinh.chonLop('${e(x.ma)}')">${e(x.ma)}</button>`).join('')}
      </div>

      <div class="chu-phu" style="margin-bottom:12px;line-height:1.5">
        <b style="color:var(--text-main);font-size:15px">${e(lop.ten)}</b><br>
        <span>📅 ${e(lop.lich)}</span> · <span>👥 ${lop.hocVien.length} học viên</span>
      </div>

      <div class="tq-3so" style="margin-bottom:16px">
        <div class="tq-o">
          <div class="tq-so" style="color:var(--c-blue)">${td.xong}/${td.tong}</div>
          <div class="tq-nhan">Bài đã học</div>
        </div>
        <div class="tq-o">
          <div class="tq-so" style="color:var(--c-green)">${tb == null ? '–' : tb + '%'}</div>
          <div class="tq-nhan">Chuyên cần TB</div>
        </div>
        <div class="tq-o">
          <div class="tq-so" style="color:${cc.filter(x => x.canhBao).length > 0 ? 'var(--c-red)' : 'var(--text-muted)'}">${cc.filter(x => x.canhBao).length}</div>
          <div class="tq-nhan">Dưới 80%</div>
        </div>
      </div>

      <!-- Khối Điểm danh -->
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md,8px);padding:14px;margin-bottom:16px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:10px">
          <div class="nhan-o" style="margin:0;font-size:15px;font-weight:600">📋 Điểm danh buổi học</div>
          <span class="chu-phu">${coMat ? '<span class="badge xanh">Đã điểm danh ' + coMat.length + '/' + lop.hocVien.length + '</span>' : '<span class="badge xam">Chưa điểm danh</span>'}</span>
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
          <label class="nhan-o" for="tsLmsNgay" style="margin:0;font-size:14px">Ngày học:</label>
          <input id="tsLmsNgay" type="date" class="form-input" value="${e(ngay)}" onchange="ModuleTuyenSinh.veLms()" style="font-size:16px;min-height:44px;width:100%;box-sizing:border-box">
        </div>

        <div class="chu-phu" style="margin-bottom:10px">
          ${coMat ? 'Chạm vào học viên để đổi trạng thái có mặt, sau đó bấm Lưu:' : 'Tích chọn học viên có mặt trong buổi này:'}
        </div>

        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px">
          ${lop.hocVien.map((t, i) => {
            const c = cc[i];
            const isChecked = !coMat || coMat.indexOf(t) >= 0;
            return `
              <label class="hang-tru" style="min-height:44px;padding:8px 12px;border-radius:var(--radius-sm,6px);background:var(--bg-card-hover, var(--bg-card));border:1px solid ${c.canhBao ? 'var(--c-red)' : 'var(--border)'};cursor:pointer;display:flex;align-items:center;gap:12px;transition:background 0.15s ease">
                <input type="checkbox" class="tsLmsHV" value="${e(t)}" ${isChecked ? 'checked' : ''} style="width:22px;height:22px;flex:0 0 auto;accent-color:var(--primary);cursor:pointer">
                <span style="flex:1;min-width:0;font-size:14px;color:var(--text-main);font-weight:500">${e(t)}</span>
                ${c.canhBao 
                  ? `<span class="badge do" title="Dưới ngưỡng 80% chuyên cần" style="flex:0 0 auto;font-size:12px">⚠️ ${c.co}/${c.tong} · ${c.phanTram}%</span>` 
                  : `<span class="badge ${c.phanTram == null ? 'xam' : 'xanh'}" style="flex:0 0 auto;font-size:12px">${c.phanTram == null ? '–' : c.co + '/' + c.tong + ' · ' + c.phanTram + '%'}</span>`}
              </label>
            `;
          }).join('')}
        </div>

        <div class="hang-nut" style="margin:0">
          <button class="btn-primary" style="min-height:44px;width:100%;padding:10px 16px;font-size:15px;display:flex;align-items:center;justify-content:center;gap:8px" onclick="ModuleTuyenSinh.luuDiemDanh()">
            💾 Lưu điểm danh
          </button>
        </div>
      </div>

      <!-- Khối Bài học M01–M20 -->
      <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-md,8px);padding:14px">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:8px">
          <div class="nhan-o" style="margin:0;font-size:15px;font-weight:600">📚 Giáo trình bài M01–M20</div>
          <span class="badge ${td.phanTram === 100 ? 'xanh' : 'vang'}">${td.phanTram}%</span>
        </div>
        
        <div class="chu-phu" style="margin-bottom:12px">
          ${td.ke ? `Bài học tiếp theo: <b style="color:var(--primary)">${e(td.ke)}</b>` : '<span style="color:var(--c-green)">🎉 Đã hoàn thành toàn bộ khóa học!</span>'}
        </div>

        <div style="display:flex;flex-direction:column;gap:8px">
          ${dsTuan.map(t => {
            const baiTuan = L.bai.filter(b => b.tuan === t);
            const baiXongTuan = baiTuan.filter(b => (k.baiXong[lop.ma] || []).indexOf(b.ma) >= 0).length;
            const laTuanMo = t === tuanMoMacDinh;
            return `
              <details class="tq-gon" style="border:1px solid var(--border);border-radius:var(--radius-sm,6px);overflow:hidden;background:var(--bg-card)" ${laTuanMo ? 'open' : ''}>
                <summary style="padding:10px 12px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;min-height:44px;background:var(--bg-card-hover, var(--bg-card))">
                  <span style="font-weight:600;font-size:14px;color:var(--text-main)">Tuần ${t}</span>
                  <span class="badge ${baiXongTuan === baiTuan.length ? 'xanh' : baiXongTuan > 0 ? 'vang' : 'xam'}" style="font-size:12px">
                    ${baiXongTuan}/${baiTuan.length} bài
                  </span>
                </summary>
                <div style="display:flex;flex-direction:column;border-top:1px solid var(--border)">
                  ${baiTuan.map(b => {
                    const x = (k.baiXong[lop.ma] || []).indexOf(b.ma) >= 0;
                    return `
                      <label class="hang-tru" style="min-height:44px;padding:10px 12px;border-bottom:1px solid var(--border);cursor:pointer;display:flex;align-items:flex-start;gap:12px;transition:background 0.15s ease">
                        <input type="checkbox" ${x ? 'checked' : ''} onchange="ModuleTuyenSinh.danhDauBai('${e(b.ma)}', this.checked)" style="width:22px;height:22px;margin-top:2px;flex:0 0 auto;accent-color:var(--primary);cursor:pointer">
                        <div style="flex:1;min-width:0">
                          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
                            <b style="color:var(--primary);font-size:14px">${e(b.ma)}</b>
                            <span style="font-size:14px;color:var(--text-main);${x ? 'text-decoration:line-through;color:var(--text-muted)' : ''}">${e(b.ten)}</span>
                          </div>
                          ${b.mucTieu ? `<div class="chu-phu" style="font-size:12px;margin-top:3px;color:var(--text-muted);line-height:1.4">${e(b.mucTieu)}</div>` : ''}
                        </div>
                      </label>
                    `;
                  }).join('')}
                </div>
              </details>
            `;
          }).join('')}
        </div>
      </div>
    `;
  },
  chonLop: function(ma) { this._lop = ma; const n = document.getElementById('tsLmsNgay'); const giu = n ? n.value : ''; this.veLms(); const m = document.getElementById('tsLmsNgay'); if (m && giu) m.value = giu; },
  luuDiemDanh: function() {
    const ngay = (document.getElementById('tsLmsNgay') || {}).value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(ngay || '')) return ShinApp.toast('Chọn ngày học trước khi lưu.', 'error');
    const co = [...document.querySelectorAll('.tsLmsHV')].filter(x => x.checked).map(x => x.value);
    const k = this.docLms();
    k.diemDanh[this._lop + '|' + ngay] = co;
    if (this.ghiLms(k)) this.veLms();
  },
  danhDauBai: function(ma, xong) {
    const k = this.docLms(), a = k.baiXong[this._lop] = k.baiXong[this._lop] || [];
    const i = a.indexOf(ma);
    if (xong && i < 0) a.push(ma);
    if (!xong && i >= 0) a.splice(i, 1);
    if (this.ghiLms(k)) this.veLms();
  },

  /* ---------------- Chi tiết chiến dịch + lead ---------------- */

  chiTietCD: async function(i, buocMo) {
    const cd = (this._d.chienDich || [])[i];
    const khung = document.getElementById('tsCT' + i);
    if (!cd || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden && !buocMo) { khung.hidden = true; return; }
    khung.hidden = false;
    const nutAdmin = this._d.laAdmin ? `
      <div class="hang-nut">
        <button class="btn-secondary" onclick="ModuleTuyenSinh.moFormCD(${i})">✏️ Sửa chiến dịch</button>
        <button class="btn-secondary" onclick="ModuleTuyenSinh.chepCD(${i}, this)">📄 Chép thành chiến dịch mới</button>
      </div>` : '';

    if (!SHIN_API.laCheDoLive()) {
      khung.innerHTML = `<div class="chu-phu">Mẫu: ${ShinApp.esc(cd.lead)} lead · ${ShinApp.esc(cd.nhapHoc)} nhập học · ${ShinApp.esc(cd.hoaHong)}. Có token sẽ hiện phễu và danh sách lead thật.</div>
        <button class="nut-rong" onclick="ModuleTuyenSinh.moFormLead('${ShinApp.esc(cd.ma)}')">＋ Thêm lead vào chiến dịch này</button>
        ${cd.hhSo && cd.hhSo.tien > 0 ? `<button class="nut-rong" onclick="ModuleTuyenSinh.chiHoaHong(${i})">💸 Lập đề nghị chi hoa hồng (M3.3)</button>` : ''}`;
      return;
    }
    if (!this._d.xemLead) {
      khung.innerHTML = '<div class="chu-phu">Vai trò của anh/chị chỉ xem chiến dịch, không xem lead (chỉ Admin và Tư vấn xem lead).</div>' + nutAdmin;
      return;
    }
    if (buocMo && this._lead[cd.ma]) { khung.innerHTML = this.veChiTiet(i, this._lead[cd.ma]) + nutAdmin; return; }
    khung.innerHTML = '<div class="chu-phu">⏳ Đang tải lead…</div>';
    const kq = await SHIN_API.goiCong('TS', 'webLeadCD', cd.ma);
    if (!kq.ok) { khung.innerHTML = `<div class="chu-phu">${ShinApp.esc(SHIN_API.moTaLoi(kq))}</div>` + nutAdmin; return; }
    this.nhanLead(cd.ma, kq.data || {});
    khung.innerHTML = this.veChiTiet(i, this._lead[cd.ma]) + nutAdmin;
  },

  /** Nhận khối lead từ máy chủ (webLeadCD / sau khi ghi) ➜ nhớ + cập nhật số lead các chiến dịch. */
  nhanLead: function(maCD, du) {
    this._lead[maCD] = du;
    if (du.dsNguoi) this._dsNguoi = du.dsNguoi;
    if (du.soLead) {
      (this._d.chienDich || []).forEach(c => { c.lead = du.soLead[c.ma] || 0; });
    }
  },

  /** Vẽ lại khung chi tiết của 1 chiến dịch sau khi ghi (giữ khung đang mở). */
  veLaiCD: function(maCD) {
    const i = (this._d.chienDich || []).findIndex(c => c.ma === maCD);
    if (i < 0) return;
    const khung = document.getElementById('tsCT' + i);
    if (khung && !khung.hidden) this.chiTietCD(i, true);
    const so = document.querySelectorAll('#appContent .hn-list > .hn-dong .dong-so')[i];
    if (so) so.textContent = this._d.chienDich[i].lead;
  },

  /** Chi tiết 1 chiến dịch từ webLeadCD: phễu · hoa hồng · lead (đang theo trước, quá hạn nổi bật). */
  veChiTiet: function(i, c) {
    const e = ShinApp.esc, so = ShinApp.soVN;
    const p = c.pheu || {}, hh = c.hoaHong || {}, s = c.so || {};
    const ds = (c.lead || []).slice(0, 50);
    return `
      <div class="hang-tru"><span>Lead · Liên hệ được · Hồ sơ · Nhập học</span><b>${so(p.lead)} · ${so(p.lienHe)} · ${so(p.hoSo)} · ${so(p.nhapHoc)}</b></div>
      <div class="hang-tru"><span>Tỷ lệ nhập học / lead · Loss</span><b>${e(ShinApp.ptVN(p.tyLe))} · ${so(p.loss)}</b></div>
      <div class="hang-tru"><span>Hoa hồng hiện tại${hh.bac ? ' (bậc ' + so(hh.bac) + ')' : ''}</span><b>${so(hh.tien)} đ</b></div>
      ${hh.conLenBac ? `<div class="chu-phu">Còn ${so(hh.conLenBac)} học viên nữa lên bậc kế.</div>` : ''}
      ${Number(hh.tien) > 0 ? `<button class="nut-rong" onclick="ModuleTuyenSinh.chiHoaHong(${i})">💸 Lập đề nghị chi hoa hồng (M3.3)</button>` : ''}
      <button class="nut-rong" onclick="ModuleTuyenSinh.moFormLead('${e(c.maCD)}')">＋ Thêm lead vào chiến dịch này</button>
      <div class="hn-tieu"><span>LEAD · ${so(s.dangTV)} đang theo${s.quaHan ? ' · ' + so(s.quaHan) + ' quá hạn' : ''}</span></div>
      ${ds.length ? ds.map((l, j) => `
        <div class="dong-lead ${l.daDong ? 'mo-di' : ''}" id="tsL${i}_${j}" onclick="ModuleTuyenSinh.moLead(${i}, ${j})">
          <div>
            <b>${e(l.HoTen)}</b>
            <div class="chu-phu">${e(l.TrangThaiPheu || 'Chưa có bước')}${l.HanhDongTiep ? ' · ' + e(l.HanhDongTiep) : ''}${l.HanHanhDong ? ' · hạn ' + e(l.HanHanhDong) : ''}</div>
          </div>
          <div class="dong-lead-phai">
            ${l.quaHan ? '<span class="badge do">Quá hạn</span>' : ''}
            ${l.SDT ? `<a class="nut-goi" href="tel:${e(l.SDT)}" onclick="event.stopPropagation()" title="Gọi ${e(l.HoTen)}">📞</a>` : ''}
          </div>
        </div>
        <div class="chi-tiet-dong" id="tsLCT${i}_${j}" hidden></div>
      `).join('') : '<div class="trong">Chiến dịch chưa có lead.</div>'}
      ${(c.lead || []).length > 50 ? `<div class="chu-phu">Đang hiện 50 / ${so(c.lead.length)} lead – lead quá hạn và đang theo luôn nằm trên cùng.</div>` : ''}
    `;
  },

  /** v2.10.3 M3.3: hoa hồng bậc thang của chiến dịch (webLeadCD.hoaHong – Demo: cd.hhSo) ➜ form Thanh toán ở 💰 Tài chính. */
  chiHoaHong: function(i) {
    const cd = (this._d.chienDich || [])[i];
    if (!cd) return;
    const du = this._lead[cd.ma];
    const hh = du ? du.hoaHong : cd.hhSo, n = du ? (du.pheu || {}).nhapHoc : cd.nhapHoc;
    const p = ModuleTaiChinh.deXuatHoaHong(cd, hh, n);
    if (p.loi) return ShinApp.toast(p.loi, 'error');
    ModuleTaiChinh.moDeXuat(p);
  },

  layLead: function(i, j) {
    const cd = (this._d.chienDich || [])[i];
    const du = cd && this._lead[cd.ma];
    return du ? { cd, l: (du.lead || [])[j] } : {};
  },

  /** Mở thao tác 1 lead: nhật ký · sửa · chuyển chiến dịch · xóa. */
  moLead: function(i, j) {
    const { cd, l } = this.layLead(i, j);
    const khung = document.getElementById(`tsLCT${i}_${j}`);
    if (!l || !khung) return;
    ShinApp.rung('nhe');
    if (!khung.hidden) { khung.hidden = true; return; }
    khung.hidden = false;
    const e = ShinApp.esc;
    const khac = (this._d.chienDich || []).filter(c => c.ma !== cd.ma && !c.dong);
    khung.innerHTML = `
      ${l.Nguon || l.NgayNhan ? `<div class="chu-phu">${e([l.Nguon ? 'Nguồn ' + l.Nguon : '', l.NgayNhan ? 'nhận ' + l.NgayNhan : '', l.LyDoLoss ? 'Loss: ' + l.LyDoLoss : ''].filter(Boolean).join(' · '))}</div>` : ''}
      <div class="hang-nhap">
        <input id="tsNK${i}_${j}" class="form-input" maxlength="500" placeholder="Ghi nhật ký: đã gọi, hẹn…" onkeydown="if(event.key==='Enter') ModuleTuyenSinh.themNhatKy(${i}, ${j}, this.nextElementSibling)">
        <button class="btn-primary" onclick="ModuleTuyenSinh.themNhatKy(${i}, ${j}, this)">Ghi</button>
      </div>
      ${(l.nhatKy || []).length ? `<div class="nhat-ky">${l.nhatKy.slice(0, 5).map(n => `<div><span class="chu-phu">${e(n.luc)} · ${e(n.ten || n.ma)}</span><br>${e(n.noi)}</div>`).join('')}</div>` : '<div class="chu-phu">Chưa có nhật ký.</div>'}
      <div class="hang-nut">
        <button class="btn-secondary" onclick="ModuleTuyenSinh.moFormLead('${e(cd.ma)}', ${i}, ${j})">✏️ Sửa / đổi bước</button>
        <button class="btn-secondary" onclick="ModuleTuyenSinh.xoaLead(${i}, ${j})">🗑 Xóa</button>
      </div>
      ${khac.length ? `
        <div class="hang-nhap">
          <select id="tsCh${i}_${j}" class="form-input">${khac.map(c => `<option value="${e(c.ma)}">${e(c.ten)}</option>`).join('')}</select>
          <button class="btn-secondary" onclick="ModuleTuyenSinh.chuyenCD(${i}, ${j}, this)">↔ Chuyển</button>
        </div>` : ''}`;
  },

  themNhatKy: async function(i, j, nut) {
    const { cd, l } = this.layLead(i, j);
    const o = document.getElementById(`tsNK${i}_${j}`);
    const noi = (o && o.value || '').trim();
    if (!l) return;
    if (!noi) { ShinApp.toast('Viết nội dung nhật ký trước.', 'warn'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang ghi…', () => ShinApp.goiBat('TS', 'webThemNhatKy', l.MaLead, noi), 'ts-nk-' + l.MaLead + noi);
    if (kq) { this.nhanLead(cd.ma, kq); this.veLaiCD(cd.ma); ShinApp.rung('xong'); }
  },

  chuyenCD: async function(i, j, nut) {
    const { cd, l } = this.layLead(i, j);
    const sel = document.getElementById(`tsCh${i}_${j}`);
    if (!l || !sel) return;
    const moi = (this._d.chienDich || []).find(c => c.ma === sel.value);
    const kq = await ShinApp.goiNut(nut, 'Đang chuyển…', () => ShinApp.goiBat('TS', 'webChuyenCD', l.MaLead, sel.value), 'ts-chuyen-' + l.MaLead);
    if (kq) {
      this.nhanLead(cd.ma, kq);
      if (moi) delete this._lead[moi.ma];
      this.veLaiCD(cd.ma);
      if (moi) this.veLaiCD(moi.ma);
      ShinApp.rung('xong');
      ShinApp.toast(`Đã chuyển ${l.HoTen} sang ${moi ? moi.ten : sel.value}.`);
    }
  },

  /** Xóa mềm: ẩn ngay, 6 giây Hoàn tác mới gửi (máy chủ còn cho khôi phục sau đó trên app v1). */
  xoaLead: function(i, j) {
    const { cd, l } = this.layLead(i, j);
    const dong = document.getElementById(`tsL${i}_${j}`), ct = document.getElementById(`tsLCT${i}_${j}`);
    if (!l || !dong) return;
    ShinApp.hanhDongHoanTac(`Đã xóa lead ${l.HoTen}`, {
      lamTruoc: () => { dong.hidden = true; if (ct) ct.hidden = true; },
      traLai: () => { dong.hidden = false; },
      thucHien: async () => {
        const kq = await ShinApp.goiBat('TS', 'webXoaLead', l.MaLead, true);
        this.nhanLead(cd.ma, kq);
        this.veLaiCD(cd.ma);
      }
    });
  },

  /* ---------------- Form lead (chỉ ô bắt buộc + "＋ Thêm chi tiết") ---------------- */

  /** maCD: chiến dịch sẵn (null ➜ chọn); i, j: sửa lead đang có. */
  moFormLead: function(maCD, i, j) {
    const e = ShinApp.esc;
    const d = this._d;
    const l = i !== undefined ? this.layLead(i, j).l : null;
    const dm = d.danhMuc || {};
    const buoc = dm.TrangThaiPheu && dm.TrangThaiPheu.length ? dm.TrangThaiPheu : ['L1 Mới nhận', 'L2 Đã liên hệ', 'L5 Đã nộp HS', 'L8 Nhập học thành công', 'Loss'];
    const nguon = dm.Nguon || [];
    const cdMo = (d.chienDich || []).filter(c => !c.dong);
    const giaTri = l || {};
    const khung = document.getElementById('tsForm');
    if (!khung) return;
    khung.innerHTML = `
      <div class="the form-the">
        <div class="the-tin-dau"><b>${l ? 'Sửa lead ' + e(l.HoTen) : 'Tiếp nhận lead mới'}</b><button class="nut-chu" onclick="ModuleTuyenSinh.dongForm()">✕ Đóng</button></div>
        ${maCD ? `<input type="hidden" id="tfCD" value="${e(maCD)}">
          <div class="chu-phu">Chiến dịch: ${e((cdMo.concat(d.chienDich || []).find(c => c.ma === maCD) || {}).ten || maCD)}</div>`
        : `<label class="nhan-o">Chiến dịch *</label>
          <select id="tfCD" class="form-input">${cdMo.map(c => `<option value="${e(c.ma)}">${e(c.ten)}</option>`).join('')}</select>`}
        <label class="nhan-o">Họ tên *</label>
        <input id="tfTen" class="form-input" maxlength="80" value="${e(giaTri.HoTen || '')}" autocomplete="off">
        <label class="nhan-o">Số điện thoại *</label>
        <input id="tfSDT" class="form-input" inputmode="tel" maxlength="15" value="${e(giaTri.SDT || '')}" placeholder="09xx xxx xxx">
        <label class="nhan-o">Bước phễu *</label>
        <select id="tfBuoc" class="form-input" onchange="document.getElementById('tfLoss').closest('details').open = this.value === 'Loss'">
          ${buoc.map(b => `<option ${b === giaTri.TrangThaiPheu ? 'selected' : ''}>${e(b)}</option>`).join('')}
        </select>
        <details class="tq-gon" ${giaTri.TrangThaiPheu === 'Loss' || giaTri.HanhDongTiep ? 'open' : ''}>
          <summary><span>＋ Thêm chi tiết</span></summary>
          <label class="nhan-o">Nguồn</label>
          <select id="tfNguon" class="form-input"><option value="">(chưa rõ)</option>${nguon.map(n => `<option ${n === giaTri.Nguon ? 'selected' : ''}>${e(n)}</option>`).join('')}</select>
          <label class="nhan-o">Việc tiếp theo</label>
          <input id="tfViec" class="form-input" maxlength="200" value="${e(giaTri.HanhDongTiep || '')}" placeholder="Gọi lại, gửi hồ sơ…">
          <label class="nhan-o">Hạn việc tiếp</label>
          <input id="tfHan" class="form-input o-ngay" inputmode="numeric" maxlength="10" value="${e(giaTri.HanHanhDong || '')}" placeholder="dd/mm/yyyy" oninput="ShinApp.goNgay(this)">
          <label class="nhan-o">Lý do Loss (bắt buộc khi chọn Loss)</label>
          <input id="tfLoss" class="form-input" maxlength="200" value="${e(giaTri.LyDoLoss || '')}">
          ${d.laAdmin && this._dsNguoi.length ? `
            <label class="nhan-o">Người phụ trách</label>
            <select id="tfNguoi" class="form-input"><option value="">(giữ nguyên / người tạo)</option>
              ${this._dsNguoi.map(n => `<option value="${e(n.ma)}" ${n.ma === giaTri.NguoiPhuTrach ? 'selected' : ''}>${e(n.hoTen)}</option>`).join('')}</select>` : ''}
        </details>
        <div class="hang-nut">
          <button class="btn-primary" onclick="ModuleTuyenSinh.luuLead(this, '${e(l ? l.MaLead : '')}')">💾 Lưu lead</button>
        </div>
      </div>`;
    khung.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.getElementById('tfTen').focus({ preventScroll: true });
  },

  dongForm: function() {
    const khung = document.getElementById('tsForm');
    if (khung) khung.innerHTML = '';
  },

  /** THUẦN. SĐT VN như v1 chuanSDT: bỏ khoảng trắng/./-/(); +84/84 ➜ 0; hợp lệ 10 số đầu 03/05/07/08/09, sai ➜ ''. */
  chuanSDT: function(s) {
    let x = String(s || '').replace(/[\s.\-()]/g, '');
    if (/^\+84/.test(x)) x = '0' + x.substring(3);
    else if (/^84\d{9}$/.test(x)) x = '0' + x.substring(2);
    return /^0[35789]\d{8}$/.test(x) ? x : '';
  },

  luuLead: async function(nut, maLead) {
    const v = id => { const o = document.getElementById(id); return o ? String(o.value || '').trim() : ''; };
    const lead = {
      MaLead: maLead || '', MaCD: v('tfCD'), HoTen: v('tfTen'), SDT: v('tfSDT'), TrangThaiPheu: v('tfBuoc'),
      Nguon: v('tfNguon'), HanhDongTiep: v('tfViec'), HanHanhDong: v('tfHan'), LyDoLoss: v('tfLoss'), NguoiPhuTrach: v('tfNguoi')
    };
    if (!lead.MaCD) { ShinApp.toast('Chọn chiến dịch.', 'warn'); return; }
    if (!lead.HoTen) { ShinApp.toast('Còn thiếu họ tên.', 'warn'); document.getElementById('tfTen').focus(); return; }
    if (!this.chuanSDT(lead.SDT)) { ShinApp.toast('SĐT chưa đúng – cần 10 số, bắt đầu 03 / 05 / 07 / 08 / 09.', 'warn'); document.getElementById('tfSDT').focus(); return; }
    if (lead.TrangThaiPheu === 'Loss' && !lead.LyDoLoss) { ShinApp.toast('Chọn Loss thì cần ghi lý do.', 'warn'); return; }
    if (lead.HanHanhDong && !ShinApp.laNgayVN(lead.HanHanhDong)) { ShinApp.toast('Hạn việc tiếp cần dạng dd/mm/yyyy.', 'warn'); return; }
    if (!SHIN_API.laCheDoLive()) { this.dongForm(); ShinApp.toast(`Đã lưu lead ${lead.HoTen} (mẫu – chưa ghi máy chủ).`, 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => ShinApp.goiBat('TS', 'webLuuLead', lead), 'ts-luu-' + lead.MaCD + lead.SDT);
    if (!kq) return;
    this.nhanLead(lead.MaCD, kq);
    this.dongForm();
    this.veLaiCD(lead.MaCD);
    ShinApp.rung('xong');
    ShinApp.toast(maLead ? `Đã lưu lead ${lead.HoTen}.` : `Đã tiếp nhận lead ${lead.HoTen}.`);
    if (kq.canhBao) ShinApp.toast(kq.canhBao, 'warn');
  },

  /* ---------------- Chiến dịch (Admin): sửa · tạo mới · chép ---------------- */

  /** i = -1 ➜ chiến dịch mới. Ô cần ngay + "＋ Thêm chi tiết" + bảng bậc hoa hồng. */
  moFormCD: function(i) {
    const e = ShinApp.esc;
    const d = this._d, dm = d.danhMuc || {};
    const cd = i >= 0 ? (d.chienDich || [])[i] : null;
    const g = (cd && cd.goc) || {};
    if (i >= 0 && !cd) return;
    const chon = (id, ds, gt) => `<select id="${id}" class="form-input">${(ds || []).concat(gt && (ds || []).indexOf(gt) < 0 ? [gt] : []).map(x => `<option ${x === gt ? 'selected' : ''}>${e(x)}</option>`).join('')}</select>`;
    const khung = document.getElementById('tsForm');
    khung.innerHTML = `
      <div class="the form-the">
        <div class="the-tin-dau"><b>${cd ? 'Sửa ' + e(cd.ten) : 'Chiến dịch mới'}</b><button class="nut-chu" onclick="ModuleTuyenSinh.dongForm()">✕ Đóng</button></div>
        <label class="nhan-o">Tên chiến dịch *</label><input id="cfTenCD" class="form-input" maxlength="120" value="${e(g.TenCD || '')}">
        <label class="nhan-o">Trường *</label><input id="cfTruong" class="form-input" maxlength="120" value="${e(g.Truong || '')}">
        <label class="nhan-o">Bậc *</label>${chon('cfBac', dm.Bac, g.Bac)}
        <label class="nhan-o">Đợt *</label><input id="cfDot" class="form-input" maxlength="20" value="${e(g.Dot || '')}">
        <label class="nhan-o">Hạn nộp *</label><input id="cfHanNop" class="form-input o-ngay" inputmode="numeric" maxlength="10" placeholder="dd/mm/yyyy" value="${e(g.HanNop || '')}" oninput="ShinApp.goNgay(this)">
        <label class="nhan-o">Trạng thái *</label>${chon('cfTrangThai', dm.TrangThaiCD, g.TrangThai || (dm.TrangThaiCD || [])[0])}
        <details class="tq-gon">
          <summary><span>＋ Thêm chi tiết</span></summary>
          ${this.O_CD.map(o => `<label class="nhan-o">${e(o[1])}</label>
            <input id="cf${o[0]}" class="form-input ${o[2] === 'ngay' ? 'o-ngay' : ''}" ${o[2] ? 'inputmode="numeric"' : ''} ${o[2] === 'ngay' ? 'maxlength="10" placeholder="dd/mm/yyyy" oninput="ShinApp.goNgay(this)"' : ''}
              value="${e(o[2] === 'so' && g[o[0]] !== '' && g[o[0]] !== undefined ? ShinApp.soVN(g[o[0]]) : (g[o[0]] || ''))}">`).join('')}
        </details>
        <div class="hn-tieu"><span>BẬC HOA HỒNG (theo số nhập học)</span></div>
        <div id="cfBacHH">${(g.bac || []).map(b => this.dongBac(b)).join('')}</div>
        <button class="nut-chu" onclick="document.getElementById('cfBacHH').insertAdjacentHTML('beforeend', ModuleTuyenSinh.dongBac({}))">＋ Thêm bậc</button>
        <div class="hang-nut"><button class="btn-primary" onclick="ModuleTuyenSinh.luuCD(this, '${e(g.MaCD || '')}')">💾 Lưu chiến dịch</button></div>
      </div>`;
    khung.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  dongBac: function(b) {
    const gt = v => v === '' || v === undefined || v === null ? '' : ShinApp.soVN(v);
    return `<div class="hang-bac">
      <input class="form-input" inputmode="numeric" placeholder="Từ" value="${gt(b.tu)}" aria-label="Từ số hồ sơ">
      <input class="form-input" inputmode="numeric" placeholder="Đến (trống = trở lên)" value="${gt(b.den)}" aria-label="Đến số hồ sơ">
      <input class="form-input" inputmode="numeric" placeholder="Tiền / hồ sơ (đ)" value="${gt(b.tien)}" aria-label="Tiền mỗi hồ sơ">
      <button class="nut-xoa" title="Bỏ bậc này" onclick="this.parentElement.remove()">✕</button>
    </div>`;
  },

  luuCD: async function(nut, maCD) {
    const v = id => { const o = document.getElementById(id); return o ? String(o.value || '').trim() : ''; };
    const cd = { MaCD: maCD };
    ['TenCD', 'Truong', 'Bac', 'Dot', 'HanNop', 'TrangThai'].forEach(k => { cd[k] = v('cf' + k); });
    this.O_CD.forEach(o => {
      const gt = v('cf' + o[0]);
      if (o[2] === 'so') { const n = ShinApp.docSoVN(gt); cd[o[0] === 'HocPhiSo' ? 'HocPhi' : 'ChiTieuHoSo'] = n === null ? '' : n; }
      else cd[o[0]] = gt;
    });
    const thieu = [['TenCD', 'Tên chiến dịch'], ['Truong', 'Trường'], ['Bac', 'Bậc'], ['Dot', 'Đợt'], ['HanNop', 'Hạn nộp'], ['TrangThai', 'Trạng thái']].filter(o => !cd[o[0]]).map(o => o[1]);
    if (thieu.length) { ShinApp.toast('Còn thiếu: ' + thieu.join(', ') + '.', 'warn'); return; }
    const saiNgay = ['BatDau', 'GD1Den', 'GD2Den', 'HanNop'].filter(k => cd[k] && !ShinApp.laNgayVN(cd[k]));
    if (saiNgay.length) { ShinApp.toast('Ngày cần dạng dd/mm/yyyy.', 'warn'); return; }
    const bac = [];
    let loiBac = '';
    document.querySelectorAll('#cfBacHH .hang-bac').forEach((h, k) => {
      const o = h.querySelectorAll('input');
      const tu = ShinApp.docSoVN(o[0].value), den = String(o[1].value).trim() === '' ? '' : ShinApp.docSoVN(o[1].value), tien = ShinApp.docSoVN(o[2].value);
      if (tu === null && den === '' && tien === null) return;
      if (!(tu >= 1) || !(tien > 0) || den === null) loiBac = loiBac || `Bậc ${k + 1}: cần số hồ sơ "từ" và tiền mỗi hồ sơ.`;
      bac.push({ tu, den, tien });
    });
    if (loiBac) { ShinApp.toast(loiBac, 'warn'); return; }
    if (!SHIN_API.laCheDoLive()) { this.dongForm(); ShinApp.toast(`Đã lưu chiến dịch ${cd.TenCD} (mẫu).`, 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang lưu…', () => ShinApp.goiBat('TS', 'webLuuChienDich', cd, bac), 'ts-cd-' + (maCD || cd.TenCD));
    if (kq) { this.nhanChienDich(kq); ShinApp.rung('xong'); }
  },

  chepCD: async function(i, nut) {
    const cd = (this._d.chienDich || [])[i];
    if (!cd) return;
    if (!SHIN_API.laCheDoLive()) { ShinApp.toast(`Đã chép ${cd.ten} (mẫu).`, 'info'); return; }
    const kq = await ShinApp.goiNut(nut, 'Đang chép…', () => ShinApp.goiBat('TS', 'webChepChienDich', cd.ma), 'ts-chep-' + cd.ma);
    if (kq) { this.nhanChienDich(kq); ShinApp.rung('xong'); ShinApp.toast(`Đã chép thành chiến dịch mới ${kq.ma} – đợt và ngày để trống, sửa rồi mở.`); }
  },

  /** Máy chủ trả {chienDich, danhMuc, ma} sau khi lưu / chép ➜ vẽ lại màn (giữ số lead, quyền). */
  nhanChienDich: function(kq) {
    const goc = Object.assign({}, this._d.goc || {}, { chienDich: kq.chienDich, danhMuc: kq.danhMuc });
    const moi = this.tuV1(goc);
    this.render(document.getElementById('appContent'), moi);
  },

  nhapLead: function() { this.moFormLead(null); },

  xuatHoaHong: function() {
    ShinApp.moV1('TS', 'Bảng hoa hồng');
  }
};
