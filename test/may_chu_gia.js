/**
 * SHIN v2 – MÁY CHỦ GIẢ cho bộ kiểm thử (v2.16.3, nhóm A tuần 23–29/11).
 * Mô phỏng đúng giao thức doPost của v1 (00_Loi/Loi_Web.gs – cuaWebPost_ / chonCongWeb_ / xuLyCongWeb_):
 *   Nhận : POST text/plain {hanh: 'web…', token, du}
 *   Trả  : {ok:true, du: <kết quả hàm>} | {ok:false, loi:'dang'|'hanh'|'token'|'quyen'|'loi', chiTiet? ≤ 200 ký tự}
 * Các cổng GHI của Hub theo HOP_DONG_CONG_V2.md (L26 đề xuất chi, L27 Task Bus, L28 bài học, L29 CRM, L31 DuLieuV2):
 * kiểm trường như máy chủ, tường lửa phía máy chủ (LOI L8 chanDuLieuNhayCam_ – bản rút gọn), chống ghi trùng theo maGui / id.
 * Không gọi mạng thật. Token đặc biệt: '' ➜ loi token; 'khong-quyen' ➜ loi quyen (như xacThucHub_ ném loiQuyen_).
 *
 * v2.16.9 (lượt vét 21/11 20h27 – nhóm A phần 3):
 *  - Token 'sai' / 'het-han' ➜ đúng như Hub v1 (Loi_Token.gs xacThucHub_ ném Error(loiTokenHub) THƯỜNG, không phải loiQuyen_)
 *    ➜ {ok:false, loi:'loi', chiTiet:'Link không đúng hoặc đã bị thu hồi…' | 'Link đã hết hạn…'}.
 *  - Mạng: tuyChon.matMang (luôn mất) · matMangLan: n (n lần đầu mất TRƯỚC khi tới máy chủ) ·
 *    matTraLoiLan: n (n lần đầu máy chủ ĐÃ GHI nhưng trả lời mất – ca nguy hiểm nhất cho ghi trùng) · chamMs: trả chậm.
 *  - `nhatKyGhi`: MỌI lệnh ghi đã tới máy chủ (kể cả lần trả lời bị mất) ➜ ca kiểm đếm "ghi đúng 1 lần".
 *  - Thêm app KS `webNhapHo` (70_KhaoSat/40_DienKS.gs ➜ {ok, maPhieu, msg}) và PTKH gốc `webGoi` (20_PTKH L148:
 *    {hanh:'webGoi', token, du:{ham, thamSo}} ➜ {ok, du} | {ok:false, loi:'câu tiếng Việt'}) với `webGuiNghiPhep`.
 */
'use strict';

function loiQuyen(cau) { const e = new Error(cau); e.quyen = true; return e; }
function cat(v) { return String(v == null ? '' : v).trim(); }

/** Bản rút gọn LOI L8 `chanDuLieuNhayCam_` (hợp đồng HOP_DONG_CONG_V2.md mục Tường lửa phía máy chủ). */
function chanDuLieuNhayCam(chu) {
  if (chu === null || chu === undefined) return { hopLe: true };
  const s = String(chu), gom = s.replace(/[\s.-]/g, '');
  if (/(^|\D)(0|\+?84)\d{9}(?!\d)/.test(gom)) return { hopLe: false, lyDo: 'có số điện thoại' };
  if (/(^|\D)\d{12}(?!\d)/.test(s)) return { hopLe: false, lyDo: 'có số CCCD' };
  if (/\b[A-Z]{2}\d{13}\b/.test(s)) return { hopLe: false, lyDo: 'có mã BHYT' };
  if (/AKfy[\w-]{26,}|ya29\.|\bsk-[\w-]{20,}|\d{5,}:[A-Za-z0-9_-]{30,}/.test(s)) return { hopLe: false, lyDo: 'có khóa / token' };
  const bo = s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase();
  if (/benh nhan|nguoi benh|benh an/.test(bo) || /\bBN\b/.test(s)) return { hopLe: false, lyDo: 'có thông tin người bệnh' };
  return { hopLe: true };
}
function chan(...chu) {
  for (const c of chu) {
    const k = chanDuLieuNhayCam(c);
    if (!k.hopLe) throw new Error('Nội dung không được chứa ' + k.lyDo.replace(/^có /, '') + '.');
  }
}
const MA_GUI = /^[A-Za-z0-9_-]{6,40}$/;

/** Tạo 1 máy chủ Hub giả. Trả { fetch, nhatKy, so } – `so` là các "sheet" trong bộ nhớ để ca kiểm soi lại. */
function taoMayChuGia(tuyChon) {
  tuyChon = tuyChon || {};
  const so = { phieuDuyet: [], viec: [], baiHoc: [], tuongTac: [], lead: { LD001: { ma: 'LD001', trangThai: 'Mới' } }, doiTac: [], duLieuV2: [] };
  const nhatKy = [];
  const tim = (ds, k, v) => ds.find(x => x[k] === v);

  const CONG = {
    /* HUB L26 – 83_TaiChinh.gs */
    webGuiDeXuatChi(token, du) {
      if (!MA_GUI.test(cat(du.maGui))) throw new Error('Mã gửi không hợp lệ.');
      const cu = tim(so.phieuDuyet, 'maGui', du.maGui);
      if (cu) return { ok: true, ma: cu.ma, moi: false };
      const loai = cat(du.loai) || 'Chi';
      if (['Chi', 'Tạm ứng', 'Thanh toán'].indexOf(loai) < 0) throw new Error('Loại phiếu không hợp lệ.');
      const khoan = cat(du.khoanMuc), lyDo = cat(du.lyDo), tien = Math.round(Number(du.soTien));
      if (!khoan || khoan.length > 120) throw new Error('Khoản mục bắt buộc, tối đa 120 ký tự.');
      if (!(tien > 0)) throw new Error('Số tiền phải lớn hơn 0.');
      if (lyDo.length < 5 || lyDo.length > 500) throw new Error('Lý do cần 5–500 ký tự.');
      if (loai === 'Tạm ứng' && !/^\d{2}\/\d{2}\/\d{4}$/.test(cat(du.hanHoanUng))) throw new Error('Tạm ứng cần hạn hoàn ứng dd/mm/yyyy.');
      if (cat(du.soChungTu).length > 60) throw new Error('Số chứng từ tối đa 60 ký tự.');
      chan(khoan, lyDo, du.duAn, du.soChungTu);
      const p = { ma: 'TC-' + du.maGui, maGui: du.maGui, nguon: 'TC', loai, khoanMuc: khoan, soTien: tien, lyDo };
      so.phieuDuyet.push(p);
      return { ok: true, ma: p.ma, moi: true };
    },
    /* HUB L27 – 85_TaskBus.gs */
    webDayViec(token, du) {
      const id = cat(du.id);
      if (!MA_GUI.test(id)) throw new Error('Mã việc (id) cần 6–40 ký tự chữ / số / _ / -.');
      const cu = tim(so.viec, 'id', id);
      if (cu) return { ok: true, ma: cu.ma, moi: false };
      const NGUON = ['duan', 'crm', 'khaosat', 'phongkham', 'taichinh', 'marketing', 'tuyensinh', 'hub', 'zalo'];
      if (NGUON.indexOf(cat(du.nguon)) < 0) throw new Error('Nguồn việc không hợp lệ.');
      if (['gap', 'thuong'].indexOf(cat(du.muc) || 'thuong') < 0) throw new Error('Mức việc không hợp lệ.');
      const td = cat(du.tieuDe);
      if (!td || td.length > 200) throw new Error('Tiêu đề việc bắt buộc, tối đa 200 ký tự.');
      if (cat(du.han) && !/^\d{4}-\d{2}-\d{2}$/.test(cat(du.han))) throw new Error('Hạn không hợp lệ.');
      chan(td);
      const v = { ma: 'VL-' + id, id, nguon: du.nguon, muc: du.muc || 'thuong', tieuDe: td, han: cat(du.han), nguoiNhan: cat(du.nguoiNhan) || '(phụ trách mảng)', trangThai: 'Mới' };
      so.viec.push(v);
      return { ok: true, ma: v.ma, moi: true };
    },
    webDoiTrangThaiViec(token, du) {
      const v = tim(so.viec, 'ma', cat(du.ma));
      if (!v) throw new Error('Không tìm thấy việc.');
      if (['Mới', 'Đang làm', 'Xong', 'Bỏ'].indexOf(cat(du.trangThai)) < 0) throw new Error('Trạng thái không hợp lệ.');
      v.trangThai = cat(du.trangThai);
      return { ok: true, ma: v.ma, trangThai: v.trangThai };
    },
    /* HUB L28 – 84_TriThuc.gs */
    webLuuBaiHoc(token, du) {
      if (!MA_GUI.test(cat(du.maGui))) throw new Error('Mã gửi không hợp lệ.');
      const cu = tim(so.baiHoc, 'maGui', du.maGui);
      if (cu) return { ok: true, ma: cu.ma, moi: false };
      const b = du.baiHoc || {}, CHU_DE = ['Nhân sự', 'Thiết bị & Hậu cần', 'Tài chính', 'Khách hàng & Hợp đồng', 'Tiến độ & Quy trình', 'Khác'];
      if (CHU_DE.indexOf(cat(b.chuDe)) < 0) throw new Error('Chủ đề không hợp lệ.');
      if (cat(b.vanDe).length < 5 || cat(b.vanDe).length > 500) throw new Error('Vấn đề cần 5–500 ký tự.');
      if (cat(b.cachLam).length < 5 || cat(b.cachLam).length > 1000) throw new Error('Cách làm cần 5–1000 ký tự.');
      if (cat(b.nguon).length > 120) throw new Error('Nguồn tối đa 120 ký tự.');
      chan(b.vanDe, b.cachLam, b.nguon);
      const r = { ma: 'BH-' + du.maGui, maGui: du.maGui, trangThai: 'Chờ' };
      so.baiHoc.push(r);
      return { ok: true, ma: r.ma, moi: true };
    },
    /* HUB L29 – 81_CRM.gs */
    webGhiTuongTac(token, du) {
      if (!MA_GUI.test(cat(du.maGui))) throw new Error('Mã gửi không hợp lệ.');
      const cu = tim(so.tuongTac, 'maGui', du.maGui);
      if (cu) return { ok: true, ma: cu.ma, moi: false };
      const dt = cat(du.maDoiTac), ld = cat(du.maLead);
      if ((dt ? 1 : 0) + (ld ? 1 : 0) !== 1) throw new Error('Chọn đúng 1 đối tác hoặc 1 lead.');
      if (dt && !/^DT\d{3,}$/.test(dt)) throw new Error('Mã đối tác không hợp lệ.');
      if (ld && !/^LD\d{3,}$/.test(ld)) throw new Error('Mã lead không hợp lệ.');
      if (['Gọi', 'Zalo', 'Email', 'Gặp', 'Khác'].indexOf(cat(du.kenh)) < 0) throw new Error('Kênh không hợp lệ.');
      const nd = cat(du.noiDung);
      if (!nd || nd.length > 500) throw new Error('Nội dung bắt buộc, tối đa 500 ký tự.');
      chan(nd);
      const r = { ma: 'TT-' + du.maGui, maGui: du.maGui, maDoiTac: dt, maLead: ld, kenh: du.kenh, noiDung: nd };
      so.tuongTac.push(r);
      return { ok: true, ma: r.ma, moi: true };
    },
    webDanhDauLead(token, du) {
      const l = so.lead[cat(du.maLead)];
      if (!l) throw new Error('Không tìm thấy lead.');
      if (['Đã chăm sóc', 'Đã chuyển'].indexOf(cat(du.trangThai)) < 0) throw new Error('Trạng thái lead không hợp lệ.');
      l.trangThai = cat(du.trangThai);
      return { ok: true, maLead: l.ma, trangThai: l.trangThai };
    },
    webLuuDoiTac(token, du) {
      const d = du.doiTac || {};
      const GD = ['Tiềm năng', 'Đang tư vấn', 'Báo giá', 'Ký hợp đồng', 'Thất bại'];
      if (d.giaiDoan && GD.indexOf(cat(d.giaiDoan)) < 0) throw new Error('Giai đoạn không hợp lệ.');
      if (!cat(d.ten)) throw new Error('Thiếu tên đối tác.');
      chan(d.ten, d.ghiChu);
      let r = d.ma ? tim(so.doiTac, 'ma', d.ma) : null;
      if (!r) { r = { ma: 'DT' + String(so.doiTac.length + 1).padStart(3, '0') }; so.doiTac.push(r); }
      Object.assign(r, { ten: cat(d.ten), giaiDoan: cat(d.giaiDoan) });
      return { doiTac: so.doiTac.slice() };
    },
    /* HUB L31 – DuLieuV2 (chưa lên app – máy chủ giả theo hợp đồng để v2 thử trước) */
    webDocDuLieuV2(token, du) {
      const loai = cat(du.loai);
      if (!LOAI_V2[loai]) throw new Error('Loại dữ liệu không hợp lệ.');
      return { ok: true, loai, ds: so.duLieuV2.filter(x => x.loai === loai).map(x => ({ ma: x.ma, chuSo: x.chuSo, noiDung: x.noiDung, capNhat: x.capNhat, phienBan: x.phienBan })) };
    },
    webGhiDuLieuV2(token, du) {
      const loai = cat(du.loai);
      if (!LOAI_V2[loai]) throw new Error('Loại dữ liệu không hợp lệ.');
      if (loai === 'taiKhoanQR' && token !== 'admin') throw loiQuyen('Chỉ Admin được lưu tài khoản nhận tiền.');
      if (!MA_GUI.test(cat(du.maGui))) throw new Error('Mã gửi không hợp lệ.');
      // Hợp đồng L31a/b: maGui đã gặp (ở bất kỳ lần ghi nào của dòng) ➜ trả bản hiện tại, không ghi thêm.
      const daGui = so.duLieuV2.find(x => x.dsMaGui.indexOf(du.maGui) >= 0);
      if (daGui) return { ok: true, ma: daGui.ma, phienBan: daGui.phienBan, moi: false };
      if (!du.noiDung || typeof du.noiDung !== 'object') throw new Error('Nội dung phải là đối tượng hoặc danh sách.');
      const chuoi = JSON.stringify(du.noiDung);
      if (chuoi.length > 40000) throw new Error('Nội dung quá dài (tối đa 40.000 ký tự).');
      chan(chuoi);
      if (!cat(du.ma)) {
        const r = { ma: loai + '-' + du.maGui, loai, dsMaGui: [du.maGui], chuSo: token, nguoiGhi: token, noiDung: du.noiDung, capNhat: '21/11/2026 16:00', phienBan: 1 };
        so.duLieuV2.push(r);
        return { ok: true, ma: r.ma, phienBan: 1, moi: true };
      }
      const r = tim(so.duLieuV2, 'ma', cat(du.ma));
      if (!r) throw new Error('Không tìm thấy bản ghi.');
      if (Number(du.phienBan) < r.phienBan)
        return { ok: false, loi: 'xungDot', ban: { ma: r.ma, noiDung: r.noiDung, phienBan: r.phienBan, capNhat: r.capNhat, nguoiGhi: r.nguoiGhi } };
      r.noiDung = du.noiDung; r.phienBan++; r.dsMaGui.push(du.maGui); r.nguoiGhi = token; r.capNhat = '21/11/2026 16:05';
      return { ok: true, ma: r.ma, phienBan: r.phienBan, moi: true };
    }
  };
  const LOAI_V2 = { lichNoiDung: 1, baiViet: 1, chiSoKenh: 1, lopHoc: 1, diemDanh: 1, tienDoLMS: 1, taiKhoanQR: 1 };

  /* App KS – 70_KhaoSat/40_DienKS.gs webNhapHo(token, du) ➜ luuPhieuKS_(ks, du, 'Nhập hộ', nd.ma) ➜ {ok, maPhieu, msg}.
     v1 KHÔNG có maGui ➜ máy chủ không tự chống trùng (mỗi lần tới = 1 phiếu) – v2 phải tự giữ "đúng 1 lần". */
  so.phieuKS = [];
  CONG.webNhapHo = function(token, du) {
    if (!/^KS\d{3,}$/.test(cat(du.ma))) throw new Error('Không tìm thấy khảo sát.');
    if (!du.traLoi || typeof du.traLoi !== 'object' || Array.isArray(du.traLoi) || !Object.keys(du.traLoi).length) throw new Error('Phiếu trống.');
    chan(JSON.stringify(du.traLoi));
    const p = { maPhieu: 'PH' + String(so.phieuKS.length + 1).padStart(4, '0'), ma: du.ma, traLoi: du.traLoi, kenh: 'Nhập hộ', nguoiNhapHo: token, giay: Number(du.giay) || 0 };
    so.phieuKS.push(p);
    return { ok: true, maPhieu: p.maPhieu, msg: 'Đã lưu phiếu ' + p.maPhieu };
  };

  /* PTKH gốc – 17_NghiLe.gs webGuiNghiPhep(token, p) qua webGoi; v1 không có maGui (mỗi lần tới = 1 đơn). */
  so.donNghi = [];
  const PTKH = {
    webGuiNghiPhep(token, p) {
      p = p || {};
      if (['Nghỉ ốm', 'Lịch nghỉ tuần'].indexOf(cat(p.loai)) < 0) throw new Error('Chọn loại đơn.');
      if (p.loai === 'Nghỉ ốm' && !/^\d{4}-\d{2}-\d{2}$/.test(cat(p.tuNgay))) throw new Error('Chọn ngày bắt đầu nghỉ.');
      if (cat(p.lyDo).length > 300) throw new Error('Lý do tối đa 300 ký tự.');
      chan(p.lyDo);
      const d = { ma: 'NP' + String(so.donNghi.length + 1).padStart(4, '0'), loai: p.loai, tuNgay: p.tuNgay, denNgay: p.denNgay, buoi: p.buoi, lyDo: p.lyDo, trangThai: 'Chờ duyệt' };
      so.donNghi.push(d);
      return { tin: 'Đã gửi đơn ' + d.ma + ' – chờ lãnh đạo phòng duyệt.', canhBao: false, phep: { cuaToi: so.donNghi.slice() } };
    }
  };
  Object.assign(CONG, tuyChon.cong || {});
  (tuyChon.boCong || []).forEach(t => { delete CONG[t]; });   // v2.17.0: mô phỏng cổng chưa lên app ➜ 'hanh'

  /** Các lệnh GHI (đếm vào nhatKyGhi khi đã tới máy chủ). */
  const GHI = /^web(Gui|Day|Doi|Luu|Ghi|Danh|Nhap)/;
  const loiToken = token => token === 'sai' ? 'Link không đúng hoặc đã bị thu hồi. Mở lại app từ Hub.'
    : token === 'het-han' ? 'Link đã hết hạn. Mở lại app từ Hub để nhận link mới.' : '';

  /** PTKH webGoi: lỗi trả thẳng câu tiếng Việt trong `loi` (api.js goiPTKH đưa vào chiTiet). */
  function xuLyPTKH(token, du) {
    const ham = cat(du.ham);
    if (!Object.prototype.hasOwnProperty.call(PTKH, ham)) return { ok: false, loi: 'hanh' };
    try {
      if (loiToken(token)) throw new Error(loiToken(token));
      if (token === 'khong-quyen') return { ok: false, loi: 'quyen' };
      return { ok: true, du: PTKH[ham].apply(null, [token].concat(Array.isArray(du.thamSo) ? du.thamSo : [])) };
    } catch (err) { return { ok: false, loi: String(err && err.message || err).substring(0, 200) }; }
  }

  /** Đúng thứ tự của chonCongWeb_ + xuLyCongWeb_. */
  function xuLy(than) {
    if (!than || typeof than !== 'object' || Array.isArray(than)) return { ok: false, loi: 'dang' };
    const hanh = String(than.hanh || '');
    const laPTKH = hanh === 'webGoi';
    if (!hanh || (!laPTKH && !Object.prototype.hasOwnProperty.call(CONG, hanh))) return { ok: false, loi: 'hanh' };
    const token = cat(than.token);
    if (!token) return { ok: false, loi: 'token' };
    const du = than.du && typeof than.du === 'object' && !Array.isArray(than.du) ? than.du : {};
    if (laPTKH) return xuLyPTKH(token, du);
    try {
      if (loiToken(token)) throw new Error(loiToken(token));
      if (token === 'khong-quyen') throw loiQuyen('Anh/chị chưa được cấp quyền.');
      return { ok: true, du: CONG[hanh](token, du) };
    } catch (err) {
      return { ok: false, loi: err && err.quyen ? 'quyen' : 'loi', chiTiet: String(err && err.message || err).substring(0, 200) };
    }
  }

  const nhatKyGhi = [];
  let soLan = 0;
  async function fetchGia(url, opts) {
    opts = opts || {};
    const lan = ++soLan;
    let than = null;
    try { const o = JSON.parse(opts.body || '{}'); than = o && typeof o === 'object' && !Array.isArray(o) ? o : null; } catch (e) { than = null; }
    if (tuyChon.chamMs) await new Promise(r => setTimeout(r, tuyChon.chamMs));
    if (tuyChon.matMang || lan <= (tuyChon.matMangLan || 0)) throw new TypeError('Failed to fetch');
    const kq = xuLy(than);
    const hanh = than && than.hanh, ten = hanh === 'webGoi' ? cat(than.du && than.du.ham) : hanh;
    nhatKy.push({ url: String(url), hanh, du: than && than.du, kq });
    if (GHI.test(String(ten || ''))) nhatKyGhi.push({ hanh: ten, du: than.du, kq, matTraLoi: lan <= (tuyChon.matTraLoiLan || 0) });
    if (lan <= (tuyChon.matTraLoiLan || 0)) throw new TypeError('Failed to fetch');   // máy chủ đã ghi, trả lời mất giữa đường
    const chu = JSON.stringify(kq);
    return { ok: true, status: 200, json: async () => JSON.parse(chu), text: async () => chu };
  }

  return { fetch: fetchGia, nhatKy, nhatKyGhi, so, xuLy, chanDuLieuNhayCam };
}

module.exports = { taoMayChuGia, chanDuLieuNhayCam };
