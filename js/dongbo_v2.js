/**
 * SHIN v2.17.0 – ĐỒNG BỘ "lưu máy ⇄ Hub" cho kho dữ liệu dùng chung `DuLieuV2` (HUB L31a/b – Sếp duyệt 21/11,
 * hợp đồng HOP_DONG_CONG_V2.md mục DuLieuV2):
 *   webDocDuLieuV2({loai}) ➜ {ok, loai, ds:[{ma, chuSo, noiDung, capNhat, phienBan}]}
 *   webGhiDuLieuV2({loai, ma?, noiDung, phienBan, maGui}) ➜ {ok, ma, phienBan, moi} | {ok:false, loi:'xungDot', ban:{ma, noiDung, phienBan, capNhat, nguoiGhi}}
 *
 * Nguyên tắc:
 *  - Bản trên máy (localStorage của module) LUÔN là bản làm việc – ngoại tuyến / Demo / cổng chưa lên app vẫn chạy như cũ.
 *  - SAU CỜ: chỉ gọi khi Hub có cổng. Lần hỏi đầu trả 'hanh' (cổng chưa có trong congWeb_ của Hub) ➜ nhớ "chuaCo"
 *    30 phút trong phiên, KHÔNG báo lỗi người dùng, giữ hành vi cũ (lưu trên máy).
 *  - Sửa trên máy ➜ đánh dấu "chưa gửi" ➜ có cổng + có mạng thì gửi sau 1,5 giây (gộp nhiều lần sửa).
 *  - maGui = băm(loai | ma | phienBan | nội dung) – gửi lại sau khi mất trả lời không thành 2 dòng.
 *  - Hub có bản mới hơn mà máy cũng đã sửa (hoặc máy chủ trả xungDot) ➜ HỎI giữ bản nào (Hub / máy này).
 * Mỗi `loai` = 1 dòng (1 kho) của module: baiViet ⇐ shin_mkt_bai · chiSoKenh ⇐ shin_mkt_hs · diemDanh ⇐ shin_lms.
 */
const ShinDongBo = (() => {
  const KHOA_META = 'shin_dbv2_meta';
  const KHOA_CONG = 'shin_dbv2_cong';
  const NHO_CHUA_CO_MS = 30 * 60 * 1000;
  const TEN = { lichNoiDung: 'Lịch nội dung', baiViet: 'Kho bài Marketing', chiSoKenh: 'Hiệu suất kênh', lopHoc: 'Lớp học', diemDanh: 'Điểm danh & tiến độ LMS', tienDoLMS: 'Tiến độ học', taiKhoanQR: 'Tài khoản nhận tiền' };
  const hen = {}, daMo = {};
  let hoi = null;

  const docJSON = (k, mac) => { try { const v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? mac : v; } catch (e) { return mac; } };
  const ghiJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } };
  const docMeta = () => { const m = docJSON(KHOA_META, {}); return m && typeof m === 'object' ? m : {}; };
  function datMeta(loai, m) { const t = docMeta(); t[loai] = m; ghiJSON(KHOA_META, t); }

  /** Trạng thái cổng: '' chưa biết · 'ok' · 'chuaCo' (nhớ 30 phút). */
  function trangThaiCong() {
    let c = null; try { c = JSON.parse(sessionStorage.getItem(KHOA_CONG) || 'null'); } catch (e) { c = null; }
    if (!c) return '';
    if (c.t === 'chuaCo' && Date.now() - (c.luc || 0) > NHO_CHUA_CO_MS) return '';
    return c.t || '';
  }
  function datCong(t) { try { sessionStorage.setItem(KHOA_CONG, JSON.stringify({ t, luc: Date.now() })); } catch (e) { /* bỏ qua */ } }

  /** THUẦN. Kho rỗng? (null / {} / [] / chuỗi rỗng) */
  function rong(x) { return x == null || x === '' || (Array.isArray(x) ? !x.length : (typeof x === 'object' && !Object.keys(x).length)); }

  /** THUẦN. Băm FNV-1a 2 lần ➜ maGui hợp lệ hợp đồng [A-Za-z0-9_-]{6,40}. */
  function taoMaGui(loai, ma, phienBan, noiDung) {
    const s = [loai, ma || '', phienBan || 0, JSON.stringify(noiDung == null ? null : noiDung)].join('|');
    const fnv = goc => { let h = goc >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h.toString(36); };
    return ('v2-' + fnv(2166136261) + fnv(374761393) + s.length.toString(36)).slice(0, 40);
  }

  /** THUẦN. Quyết định đồng bộ từ meta máy {ma, phienBan, chuaGui}, dòng Hub r và bản máy.
   *  ➜ {viec: 'giu'|'nhan'|'layMayChu'|'guiMoi'|'guiSua'|'xungDot', phienBan?} */
  function chonViec(m, r, may) {
    m = m || {};
    if (!r) return { viec: rong(may) ? 'giu' : 'guiMoi' };
    if (!m.ma || m.ma !== r.ma) {
      if (rong(may)) return { viec: 'layMayChu' };
      if (JSON.stringify(may) === JSON.stringify(r.noiDung)) return { viec: 'nhan' };
      return { viec: 'xungDot' };
    }
    const pm = Number(m.phienBan) || 0, pr = Number(r.phienBan) || 0;
    if (pr > pm) return { viec: m.chuaGui ? 'xungDot' : 'layMayChu' };
    if (!m.chuaGui) return { viec: 'giu' };
    return { viec: 'guiSua', phienBan: pr };
  }

  const coTheGoi = () => typeof SHIN_API !== 'undefined' && SHIN_API.laCheDoLive() && trangThaiCong() !== 'chuaCo';

  function hoiXungDot(loai, ban) {
    if (hoi) return Promise.resolve(hoi(loai, ban));
    const cau = `"${TEN[loai] || loai}" trên Hub đã được sửa ở nơi khác` + (ban && (ban.nguoiGhi || ban.capNhat) ? ` (${[ban.nguoiGhi, ban.capNhat].filter(Boolean).join(' · ')})` : '') +
      ', máy này cũng có thay đổi chưa gửi.\n\nOK = dùng bản trên Hub (bỏ thay đổi của máy này)\nHủy = giữ bản của máy này và ghi lên Hub';
    try { return Promise.resolve(window.confirm(cau) ? 'mayChu' : 'may'); } catch (e) { return Promise.resolve('may'); }
  }

  function loiGoi(kq) {
    if (kq.loi === 'hanh') { datCong('chuaCo'); return { trangThai: 'may' }; }
    return { trangThai: kq.loi === 'mang' ? 'ngoaiTuyen' : 'loi', loi: kq.loi, chiTiet: kq.chiTiet || '' };
  }

  async function gui(loai, khoa, noiDung, ma, phienBan, lan) {
    const du = { loai, noiDung, phienBan: Number(phienBan) || 0, maGui: taoMaGui(loai, ma, phienBan, noiDung) };
    if (ma) du.ma = ma;
    const kq = await SHIN_API.goi('HUB', 'webGhiDuLieuV2', du);
    if (!kq.ok) return loiGoi(kq);
    if (kq.isDemo) return { trangThai: 'may' };
    datCong('ok');
    const d = kq.data || {};
    if (d.ok === false && d.loi === 'xungDot' && d.ban) return giaiXungDot(loai, khoa, d.ban, noiDung, (lan || 0) + 1);
    if (!d.ma) return { trangThai: 'loi', loi: 'loi', chiTiet: 'Hub trả thiếu mã bản ghi.' };
    datMeta(loai, { ma: d.ma, phienBan: Number(d.phienBan) || 1, chuaGui: false });
    return { trangThai: 'daGui', moi: d.moi !== false, ma: d.ma, phienBan: Number(d.phienBan) || 1 };
  }

  async function giaiXungDot(loai, khoa, ban, may, lan) {
    if ((lan || 0) > 2) return { trangThai: 'loi', loi: 'xungDot', chiTiet: 'Hub đổi liên tục – thử lại sau.' };
    const chon = await hoiXungDot(loai, ban);
    if (chon === 'mayChu') {
      ghiJSON(khoa, ban.noiDung);
      datMeta(loai, { ma: ban.ma, phienBan: Number(ban.phienBan) || 1, chuaGui: false });
      return { trangThai: 'daTai', doi: true, xungDot: true };
    }
    const kq = await gui(loai, khoa, may, ban.ma, ban.phienBan, lan);
    return Object.assign({ xungDot: true }, kq);
  }

  /** Đồng bộ 1 kho: đọc Hub ➜ chonViec ➜ tải về / gửi lên / hỏi xung đột. ➜ {trangThai, doi?} */
  async function dongBo(loai, khoa) {
    if (!coTheGoi()) return { trangThai: 'may' };
    const kq = await SHIN_API.goi('HUB', 'webDocDuLieuV2', { loai });
    if (!kq.ok) return loiGoi(kq);
    if (kq.isDemo) return { trangThai: 'may' };
    datCong('ok');
    const ds = (kq.data && Array.isArray(kq.data.ds)) ? kq.data.ds : [];
    const m = docMeta()[loai] || {};
    const r = (m.ma && ds.find(x => x && x.ma === m.ma)) || ds[0] || null;
    const may = docJSON(khoa, null);
    const q = chonViec(m, r, may);
    if (q.viec === 'giu') return { trangThai: 'dongBo' };
    if (q.viec === 'nhan') { datMeta(loai, { ma: r.ma, phienBan: Number(r.phienBan) || 1, chuaGui: false }); return { trangThai: 'dongBo' }; }
    if (q.viec === 'layMayChu') {
      if (r.noiDung == null) return { trangThai: 'loi', loi: 'loi', chiTiet: 'Bản trên Hub bị hỏng.' };
      ghiJSON(khoa, r.noiDung);
      datMeta(loai, { ma: r.ma, phienBan: Number(r.phienBan) || 1, chuaGui: false });
      return { trangThai: 'daTai', doi: true };
    }
    if (q.viec === 'guiMoi') return gui(loai, khoa, may, '', 0, 0);
    if (q.viec === 'guiSua') return gui(loai, khoa, may, r.ma, q.phienBan, 0);
    return giaiXungDot(loai, khoa, { ma: r.ma, noiDung: r.noiDung, phienBan: r.phienBan, capNhat: r.capNhat || '', nguoiGhi: r.nguoiGhi || r.chuSo || '' }, may, 0);
  }

  /** Gọi ngay sau khi module ghi localStorage: đánh dấu chưa gửi + hẹn gửi 1,5 giây (gộp). */
  function danhDau(loai, khoa, khiDoi) {
    const m = docMeta()[loai] || {};
    datMeta(loai, Object.assign({}, m, { chuaGui: true }));
    if (!coTheGoi()) return;
    clearTimeout(hen[loai]);
    hen[loai] = setTimeout(() => { dongBo(loai, khoa).then(kq => baoKq(kq, khiDoi)).catch(() => {}); }, 1500);
  }

  /** Gọi khi mở màn: đồng bộ 1 lần / phiên cho mỗi loai; Hub có bản khác ➜ khiDoi() để vẽ lại. */
  function khiMo(loai, khoa, khiDoi) {
    if (daMo[loai] || !coTheGoi()) return;
    daMo[loai] = true;
    dongBo(loai, khoa).then(kq => baoKq(kq, khiDoi)).catch(() => {});
  }

  function baoKq(kq, khiDoi) {
    if (!kq) return;
    if (kq.doi && typeof khiDoi === 'function') { try { khiDoi(); } catch (e) { /* màn đã đóng */ } }
    if (typeof ShinApp === 'undefined' || !ShinApp.toast) return;
    if (kq.xungDot && kq.trangThai !== 'loi') ShinApp.toast(kq.doi ? 'Đã dùng bản trên Hub.' : 'Đã ghi bản của máy này lên Hub.', 'success');
    else if (kq.trangThai === 'loi' && kq.loi !== 'quyen') ShinApp.toast('Chưa đồng bộ được với Hub: ' + (kq.chiTiet || kq.loi) + ' – vẫn lưu trên máy này.', 'error');
  }

  /** Dòng chữ nhỏ cho màn: '' khi cổng chưa có (giữ chữ cũ). */
  function nhan(loai) {
    if (trangThaiCong() !== 'ok') return '';
    const m = docMeta()[loai] || {};
    return m.chuaGui ? '☁️ Có thay đổi chưa gửi lên Hub (gửi khi có mạng).' : (m.ma ? '☁️ Đã đồng bộ với Hub (dùng chung cả nhóm).' : '');
  }

  return { TEN, rong, taoMaGui, chonViec, dongBo, danhDau, khiMo, nhan, trangThaiCong,
    /** cho bộ kiểm thử */ datHoi: f => { hoi = f; }, datLaiPhien: () => { Object.keys(daMo).forEach(k => delete daMo[k]); try { sessionStorage.removeItem(KHOA_CONG); } catch (e) { /* bỏ qua */ } } };
})();
if (typeof window !== 'undefined') window.ShinDongBo = ShinDongBo;
