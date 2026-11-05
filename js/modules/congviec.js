/**
 * SHIN v2 – Module 7: Quản Lý Công Việc (Universal Task Bus)
 * Trục liên thông việc toàn hệ sinh thái dạng Kanban đa nguồn:
 * Tự động gom việc từ Hub, Báo cáo Phòng khám, Dự án, CRM Lead, Tài chính
 * v2.8.4 (M7.4): đèn SLA Xanh → Vàng → Đỏ PHÍA TRÌNH DUYỆT theo hạn (Hôm nay · HH:MM · dd/mm[/yyyy]),
 * dải đếm + lọc theo đèn, nút sao chép tin cảnh báo (gửi Telegram cần máy chủ – chờ Task Bus M7.1). Chữ thẻ ≥ 14px.
 */

const ModuleCongViec = {
  ma: 'congviec',
  ten: 'Quản Lý Công Việc',
  bieuTuong: '📋',
  paletteMacDinh: 'executive',
  GIO_VANG: 4,
  _ds: [],
  _loc: '',

  /** THUẦN. Hạn (chuỗi) ➜ Date hết hạn, hoặc null nếu không đọc được. bayGio: Date. */
  docHan: function(han, bayGio) {
    const s = String(han || '').trim().toLowerCase(), n = bayGio || new Date();
    const cuoiNgay = (y, m, d) => new Date(y, m, d, 23, 59, 59);
    if (!s || /xong|đã xong/.test(s)) return null;
    if (/hôm nay|hom nay/.test(s)) return cuoiNgay(n.getFullYear(), n.getMonth(), n.getDate());
    let m = s.match(/^(\d{1,2})[:h](\d{2})$/);
    if (m) return new Date(n.getFullYear(), n.getMonth(), n.getDate(), +m[1], +m[2]);
    m = s.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{4}))?$/);
    if (m) { const d = +m[1], t = +m[2] - 1; if (t < 0 || t > 11 || d < 1 || d > 31) return null; return cuoiNgay(m[3] ? +m[3] : n.getFullYear(), t, d); }
    return null;
  },

  /** THUẦN. Mức SLA: 'xong' (cột hoàn tất) · 'do' (quá hạn) · 'vang' (≤ GIO_VANG giờ hoặc đang diễn ra) · 'xanh' · 'xam' (chưa rõ hạn). */
  mucSla: function(item, cot, bayGio) {
    if (cot === 'hoanTat') return 'xong';
    const s = String((item && item.han) || '').toLowerCase();
    if (/đang diễn ra|dang dien ra/.test(s)) return 'vang';
    const h = this.docHan(s, bayGio);
    if (!h) return 'xam';
    const conGio = (h - (bayGio || new Date())) / 36e5;
    return conGio < 0 ? 'do' : conGio <= this.GIO_VANG ? 'vang' : 'xanh';
  },

  NHAN_SLA: { do: '🔴 Quá hạn', vang: '🟡 Sắp tới hạn', xanh: '🟢 Trong hạn', xam: '⚪ Chưa rõ hạn', xong: '✅ Xong' },

  render: function(container, data) {
    const d = data || window.SHIN_DEMO_DATA.congviec;
    const hero = d.hero || {};
    const kanban = d.kanban || { canLam: [], dangLam: [], hoanTat: [] };
    const bay = new Date();
    this._ds = [];
    ['canLam', 'dangLam', 'hoanTat'].forEach(c => (kanban[c] || []).forEach(it => this._ds.push({ it, cot: c, sla: this.mucSla(it, c, bay) })));
    const dem = k => this._ds.filter(x => x.sla === k).length;

    let html = `
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <div class="page-title">Quản Lý Công Việc</div>
          <div class="page-sub">Trục Task Bus liên thông toàn bộ 10 mảng nghiệp vụ</div>
        </div>
        <button class="btn-icon" onclick="ModuleCongViec.taoViec()" title="Tạo việc mới">＋</button>
      </div>

      <!-- Hero Card -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">${hero.chao || 'Trục Quản Lý Công Việc Liên Thông 📋'}</div>
            <div class="hero-date">📅 ${hero.ngay || 'Task Bus toàn hệ thống'}</div>
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

        <button class="btn-primary" onclick="ModuleCongViec.taoViec()">
          ${hero.nutChinh ? hero.nutChinh.nhan : '＋ Tạo Công Việc Mới'}
        </button>
      </div>

      <!-- M7.4 – dải SLA -->
      <div class="hang-tab cv-sla" role="tablist" aria-label="Lọc theo SLA">
        <button class="chip-chon ${this._loc ? '' : 'dang-chon'}" data-sla="" onclick="ModuleCongViec.locSla(this.dataset.sla)">Tất cả · ${this._ds.length}</button>
        ${['do', 'vang', 'xanh', 'xam'].filter(k => dem(k)).map(k => `<button class="chip-chon ${this._loc === k ? 'dang-chon' : ''}" data-sla="${k}" onclick="ModuleCongViec.locSla(this.dataset.sla)">${this.NHAN_SLA[k]} · ${dem(k)}</button>`).join('')}
        ${dem('do') + dem('vang') ? `<button class="chip-chon" onclick="ModuleCongViec.saoChepCanhBao()">📋 Sao chép cảnh báo</button>` : ''}
      </div>

      <!-- Bảng Kanban 3 Cột Liên Thông -->
      <div class="kanban-board">
        <!-- Cột Cần Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⏳ CẦN LÀM</span>
            <span class="status-pill warn" style="padding:2px 6px; font-size:10px;">${kanban.canLam.length}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('canLam')}
          </div>
        </div>

        <!-- Cột Đang Làm -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>⚡ ĐANG LÀM</span>
            <span class="status-pill live" style="padding:2px 6px; font-size:10px;">${kanban.dangLam.length}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('dangLam')}
          </div>
        </div>

        <!-- Cột Hoàn Tất -->
        <div class="kanban-col">
          <div class="kanban-header">
            <span>✅ HOÀN TẤT</span>
            <span class="status-pill" style="background:var(--c-green)20; color:var(--c-green); padding:2px 6px; font-size:10px;">${kanban.hoanTat.length}</span>
          </div>
          <div class="kanban-list">
            ${this.theCot('hoanTat')}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = html;
    this._container = container; this._data = d;
  },

  theCot: function(cot) {
    const ds = this._ds.filter(x => x.cot === cot && (!this._loc || x.sla === this._loc));
    return ds.map(x => this.renderTaskCard(x.it, cot, x.sla)).join('') || '<div class="chu-phu" style="padding:8px;">—</div>';
  },

  locSla: function(k) { this._loc = k || ''; ShinApp.rung('nhe'); if (this._container) this.render(this._container, this._data); },

  /** THUẦN. Tin cảnh báo SLA (đỏ trước, vàng sau) – dạng chữ để dán Telegram. */
  tinCanhBao: function(ds) {
    const dong = (ds || []).filter(x => x.sla === 'do' || x.sla === 'vang').sort((a, b) => (a.sla === 'do' ? 0 : 1) - (b.sla === 'do' ? 0 : 1))
      .map(x => `${x.sla === 'do' ? '🔴' : '🟡'} ${x.it.tieuDe} – ${x.it.nguoi} · hạn ${x.it.han}`);
    return dong.length ? `⚠️ SLA công việc (${dong.length})\n` + dong.join('\n') : '';
  },

  saoChepCanhBao: function() {
    const t = this.tinCanhBao(this._ds);
    if (!t) return ShinApp.toast('Không có việc quá hạn / sắp tới hạn.', 'info');
    const xong = () => ShinApp.toast('Đã sao chép tin cảnh báo – dán vào Telegram (tự gửi cần Task Bus M7.1 phía v1).', 'success');
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(xong, () => ShinApp.toast('Trình duyệt chặn sao chép.', 'error'));
    else ShinApp.toast('Trình duyệt không hỗ trợ sao chép.', 'error');
  },

  renderTaskCard: function(item, cot, sla) {
    const e = ShinApp.esc, m = sla || this.mucSla(item, cot);
    return `
      <div class="kanban-card cv-the cv-${m}">
        <div class="cv-dau">
          <span class="cv-nguon">${e(item.nguon)}</span>
          <span class="cv-sla-nhan">${this.NHAN_SLA[m]}</span>
        </div>
        <div class="cv-tieu">${e(item.tieuDe)}</div>
        <div class="cv-chan">
          <span>👤 ${e(item.nguoi)}</span>
          <span>📅 ${e(item.han)}${item.tag ? ' · ' + e(item.tag) : ''}</span>
        </div>
      </div>
    `;
  },

  taoViec: function() {
    ShinApp.toast('Mở biểu mẫu phân công công việc mới', 'info');
  }
};
