/**
 * SHIN v2 – 🔳 Trang điền khảo sát CÔNG KHAI (v2.13.26, M1.5 – gỡ dòng 🟡 "nguồn QR KS" của bảng đối chiếu v1 ↔ v2).
 * Mở bằng link / QR: dienks.html?k=<MaKS | MaNguon>. Không cần đăng nhập, không token.
 * Cổng KS (app 70_KhaoSat L2 v1.4.1, đã lên app @5 v1.4.4) – cổng công khai riêng (congKhaiPost_, KHÔNG qua congWeb_):
 *   POST text/plain {hanh:'webCongKhaiDocKS', du:{ma}}   ➜ {ok, du:{maKS, maNguon, tieuDe, moTa, moiTrang, nhieuLan, cau[]}}
 *   POST text/plain {hanh:'webCongKhaiGuiPhieu', du:{ma, traLoi, thietBi, giay, bay}} ➜ {ok, du:{ok, maPhieu, msg}}
 * Chống phiếu rác do máy chủ quyết (1 phiếu / thiết bị nếu KS không cho nhiều lần, ô bẫy, điền < 20 giây ➜ chờ xác minh).
 * Turnstile: chưa gắn (v1 chỉ kiểm khi gói có ts VÀ có secret) – Còn chờ anh: khóa site Turnstile nếu cần.
 * Không có k ➜ chế độ xem thử bằng câu mẫu, không gửi gì.
 * Dùng lại hàm thuần của ModuleKsNhapHo (luaChonCua, bamLuaChon, goiTraLoi, loiPhieu) – 1 luật kiểm cho nhập hộ + công khai.
 */
const DienKS = (function() {
  'use strict';
  const NH = ModuleKsNhapHo;
  const st = { ma: '', ks: null, tl: {}, batDau: 0, dangGui: false, xong: false, thu: false };
  const $ = id => document.getElementById(id);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** THUẦN. Mã trong link: chỉ MaKS / MaNguon dạng chữ-số (chặn chuỗi lạ). */
  function maHopLe(m) { m = String(m || '').trim(); return /^[A-Za-z0-9_-]{2,30}$/.test(m) ? m : ''; }

  /** Mã thiết bị ngẫu nhiên lưu ở máy (máy chủ băm, không lưu mã thô). */
  function maThietBi() {
    let m = '';
    try { m = localStorage.getItem('shin_ks_thietbi') || ''; } catch (e) { /* chế độ riêng tư */ }
    if (!m) {
      const a = new Uint8Array(12);
      (window.crypto || {}).getRandomValues ? crypto.getRandomValues(a) : a.forEach((_, i) => { a[i] = Math.random() * 256; });
      m = Array.from(a, b => b.toString(16).padStart(2, '0')).join('');
      try { localStorage.setItem('shin_ks_thietbi', m); } catch (e) { /* bỏ qua */ }
    }
    return m;
  }

  async function goiKS(hanh, du) {
    const url = SHIN_API.urlMayChu('KS');
    if (!url) return { ok: false, chiTiet: 'Chưa có địa chỉ máy chủ Khảo sát.' };
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ hanh, du }) });
      const j = await r.json();
      return j && j.ok ? { ok: true, du: j.du } : { ok: false, chiTiet: (j && (j.chiTiet || j.loi)) || 'Máy chủ không trả lời đúng.' };
    } catch (e) {
      return { ok: false, chiTiet: navigator.onLine === false ? 'Máy đang mất mạng – bật mạng rồi tải lại trang.' : 'Không kết nối được máy chủ Khảo sát – thử lại sau ít phút.' };
    }
  }

  function bao(chu, loai) {
    const b = $('dkBao');
    if (!b) return;
    b.className = 'canh-bao-nguon ' + (loai || 'mau');
    b.textContent = chu;
    b.hidden = !chu;
    if (chu) b.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function veCau(c, i) {
    const lc = NH.luaChonCua(c), v = st.tl[c.maCH];
    const nhan = `${i + 1}. ${esc(c.noiDung)}${c.batBuoc ? ' <span class="dk-sao" aria-label="bắt buộc">*</span>' : ''}`;
    if (lc) {
      const chon = gt => NH.nhieu(c) ? (Array.isArray(v) && v.includes(gt)) : String(v) === gt;
      return `<fieldset class="tc-form-nhom dk-cau"><legend class="nhan-o">${nhan}${NH.nhieu(c) ? ' <span class="chu-phu">(chọn nhiều)</span>' : ''}</legend>
        <div class="hang-chip">${lc.map((gt, j) => `<button type="button" class="chip-chon ks-nh-chip ${chon(gt) ? 'dang-chon' : ''}" aria-pressed="${chon(gt)}" onclick="DienKS.chon(${i}, ${j})">${esc(c.loai === '5muc' ? gt + '★' : gt)}</button>`).join('')}</div>
      </fieldset>`;
    }
    const id = 'dk_' + i, gt = esc(v == null ? '' : String(v));
    const o = c.loai === 'chudai'
      ? `<textarea id="${id}" class="form-input" rows="3" maxlength="2000" oninput="DienKS.nhap(${i}, this.value)">${gt}</textarea>`
      : `<input id="${id}" class="form-input" ${c.loai === 'so' ? 'type="text" inputmode="decimal"' : 'type="text" maxlength="200"'} autocomplete="off" value="${gt}" oninput="DienKS.nhap(${i}, this.value)">`;
    return `<div class="tc-form-nhom dk-cau"><label class="nhan-o" for="${id}">${nhan}</label>${o}</div>`;
  }

  function ve() {
    const k = $('dkNoiDung'), ks = st.ks;
    if (!k || !ks) return;
    if (st.xong) {
      k.innerHTML = `<div class="the dk-xong"><div class="dk-xong-icon" aria-hidden="true">💚</div><h2>${esc(st.xong)}</h2>
        <p class="chu-phu">Ý kiến của anh/chị giúp phòng khám phục vụ tốt hơn. Có thể đóng trang này.</p>
        ${ks.nhieuLan ? '<button type="button" class="btn-secondary dk-nut" onclick="DienKS.lamLai()">✍️ Gửi thêm 1 phiếu</button>' : ''}</div>`;
      return;
    }
    const daTL = ks.cau.filter(c => !NH.rong(st.tl[c.maCH])).length;
    k.innerHTML = `
      <div class="the dk-dau">
        <h1 class="dk-tieu-de">${esc(ks.tieuDe)}</h1>
        ${ks.moTa ? `<p class="chu-phu">${esc(ks.moTa)}</p>` : ''}
        <p class="chu-phu">${st.thu ? '👀 Xem thử bằng câu mẫu – phiếu không được gửi. ' : ''}Câu có <span class="dk-sao">*</span> là bắt buộc. Xin đừng ghi họ tên, số CCCD / BHYT hay số điện thoại.</p>
        <div class="dk-tien-do" role="progressbar" aria-valuemin="0" aria-valuemax="${ks.cau.length}" aria-valuenow="${daTL}" aria-label="Đã trả lời ${daTL}/${ks.cau.length} câu"><span style="width:${ks.cau.length ? Math.round(daTL * 100 / ks.cau.length) : 0}%"></span></div>
      </div>
      <form class="the" onsubmit="event.preventDefault(); DienKS.gui();" novalidate>
        ${ks.cau.length ? ks.cau.map(veCau).join('') : '<div class="trong">Khảo sát chưa có câu hỏi.</div>'}
        <div class="dk-bay" aria-hidden="true"><label>Để trống ô này <input id="dkBay" type="text" tabindex="-1" autocomplete="off"></label></div>
        <button type="submit" id="dkGui" class="btn-primary dk-nut" ${ks.cau.length ? '' : 'disabled'}>📤 Gửi phiếu</button>
      </form>`;
  }

  function capNhatTienDo() {
    const ks = st.ks, t = document.querySelector('.dk-tien-do');
    if (!ks || !t) return;
    const n = ks.cau.filter(c => !NH.rong(st.tl[c.maCH])).length;
    t.setAttribute('aria-valuenow', n);
    t.setAttribute('aria-label', `Đã trả lời ${n}/${ks.cau.length} câu`);
    t.firstElementChild.style.width = (ks.cau.length ? Math.round(n * 100 / ks.cau.length) : 0) + '%';
  }

  async function mo() {
    const k = $('dkNoiDung');
    st.ma = maHopLe(new URLSearchParams(location.search).get('k'));
    if (!st.ma) {
      st.thu = true;
      st.ks = Object.assign({ nhieuLan: true }, NH.MAU);
      st.batDau = Date.now();
      bao('Link thiếu mã khảo sát – đang xem thử bằng câu mẫu. Hãy quét đúng mã QR phòng khám đưa.', 'mau');
      ve();
      return;
    }
    k.innerHTML = '<div class="trong">⏳ Đang tải khảo sát…</div>';
    const r = await goiKS('webCongKhaiDocKS', { ma: st.ma });
    if (!r.ok) {
      k.innerHTML = `<div class="the dk-xong"><div class="dk-xong-icon" aria-hidden="true">📭</div><h2>Chưa mở được khảo sát</h2>
        <p class="chu-phu">${esc(r.chiTiet)}</p><button type="button" class="btn-secondary dk-nut" onclick="location.reload()">↻ Tải lại</button></div>`;
      return;
    }
    const d = r.du || {};
    st.ks = { tieuDe: d.tieuDe || 'Khảo sát', moTa: d.moTa || '', nhieuLan: !!d.nhieuLan, cau: Array.isArray(d.cau) ? d.cau : [] };
    document.title = st.ks.tieuDe + ' – SHIN';
    st.batDau = Date.now();
    ve();
  }

  function chon(i, j) {
    const c = st.ks && st.ks.cau[i];
    if (!c) return;
    st.tl[c.maCH] = NH.bamLuaChon(c, st.tl[c.maCH], NH.luaChonCua(c)[j]);
    const y = window.scrollY;
    ve();
    window.scrollTo(0, y);
  }
  function nhap(i, gt) {
    const c = st.ks && st.ks.cau[i];
    if (c) { st.tl[c.maCH] = gt; capNhatTienDo(); }
  }

  /** Gửi ngay (người bệnh không có Hoàn tác – nút khóa khi đang gửi để không gửi 2 lần). */
  async function gui() {
    const ks = st.ks;
    if (!ks || st.dangGui) return;
    const traLoi = NH.goiTraLoi(ks.cau, st.tl);
    const loi = NH.loiPhieu(ks.cau, traLoi);
    if (loi) { bao(loi, 'loi'); return; }
    if (st.thu) { bao('Đang xem thử – phiếu không được gửi.', 'mau'); return; }
    st.dangGui = true;
    const n = $('dkGui');
    if (n) { n.disabled = true; n.textContent = '⏳ Đang gửi…'; }
    const bay = ($('dkBay') || {}).value || '';
    const r = await goiKS('webCongKhaiGuiPhieu', { ma: st.ma, traLoi, thietBi: maThietBi(), giay: Math.round((Date.now() - st.batDau) / 1000), bay });
    st.dangGui = false;
    const kq = (r.ok && r.du) || {};
    if (r.ok && kq.ok !== false) { st.xong = kq.msg || 'Cảm ơn anh/chị đã góp ý!'; bao(''); ve(); window.scrollTo(0, 0); return; }
    if (n && n.isConnected) { n.disabled = false; n.textContent = '📤 Gửi phiếu'; }
    bao(kq.msg || r.chiTiet || 'Chưa gửi được – thử lại.', 'loi');
  }

  function lamLai() { st.tl = {}; st.xong = false; st.batDau = Date.now(); ve(); window.scrollTo(0, 0); }

  return { mo, chon, nhap, gui, lamLai, _nb: { maHopLe } };
})();
if (typeof document !== 'undefined' && document.getElementById('dkNoiDung')) DienKS.mo();
