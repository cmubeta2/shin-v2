/**
 * SHIN v2.12.1 – M4.5 LMS mini: dữ liệu MẪU (lớp, học viên, bài M01–M20).
 * Không chứa dữ liệu thật. Còn chờ v1: danh sách lớp / học viên thật từ app Tuyển sinh (chưa có cổng).
 * Tên bài là khung chung cho lớp chứng chỉ ngắn hạn – có thể thay nội dung, giữ nguyên trường { ma, ten, tuan }.
 */
window.MAU_LMS = {
  bai: [
    { ma: 'M01', tuan: 1, ten: 'Nhập môn: mục tiêu khóa học, nội quy lớp' },
    { ma: 'M02', tuan: 1, ten: 'Giao tiếp cơ bản với người bệnh và người nhà' },
    { ma: 'M03', tuan: 1, ten: 'An toàn người bệnh và phòng ngừa sai sót' },
    { ma: 'M04', tuan: 1, ten: 'Kiểm soát nhiễm khuẩn: rửa tay, phương tiện phòng hộ' },
    { ma: 'M05', tuan: 2, ten: 'Đo dấu hiệu sinh tồn' },
    { ma: 'M06', tuan: 2, ten: 'Tiếp đón, hướng dẫn quy trình khám' },
    { ma: 'M07', tuan: 2, ten: 'Hồ sơ, giấy tờ và bảo mật thông tin người bệnh' },
    { ma: 'M08', tuan: 2, ten: 'Sơ cứu ban đầu thường gặp' },
    { ma: 'M09', tuan: 3, ten: 'Chăm sóc vệ sinh cá nhân người bệnh' },
    { ma: 'M10', tuan: 3, ten: 'Dinh dưỡng cơ bản theo nhóm bệnh' },
    { ma: 'M11', tuan: 3, ten: 'Di chuyển, đỡ người bệnh an toàn' },
    { ma: 'M12', tuan: 3, ten: 'Kiểm tra giữa khóa' },
    { ma: 'M13', tuan: 4, ten: 'Xử lý tình huống phàn nàn, khiếu nại' },
    { ma: 'M14', tuan: 4, ten: 'Kỹ năng làm việc nhóm trong khoa / phòng' },
    { ma: 'M15', tuan: 4, ten: 'Quản lý thời gian và bàn giao ca' },
    { ma: 'M16', tuan: 4, ten: 'Đạo đức nghề nghiệp, quy tắc ứng xử' },
    { ma: 'M17', tuan: 5, ten: 'Thực hành tại cơ sở – phần 1' },
    { ma: 'M18', tuan: 5, ten: 'Thực hành tại cơ sở – phần 2' },
    { ma: 'M19', tuan: 5, ten: 'Ôn tập tổng hợp' },
    { ma: 'M20', tuan: 5, ten: 'Kiểm tra cuối khóa, trao chứng chỉ' }
  ],
  lop: [
    { ma: 'LOP-A', ten: 'Lớp mẫu A – Chứng chỉ y tế ngắn hạn', lich: 'Thứ 3, Thứ 5 · 18h00', hocVien: ['Học viên 01', 'Học viên 02', 'Học viên 03', 'Học viên 04', 'Học viên 05', 'Học viên 06', 'Học viên 07', 'Học viên 08'] },
    { ma: 'LOP-B', ten: 'Lớp mẫu B – Chứng chỉ y tế ngắn hạn (cuối tuần)', lich: 'Thứ 7, Chủ nhật · 8h00', hocVien: ['Học viên 11', 'Học viên 12', 'Học viên 13', 'Học viên 14', 'Học viên 15', 'Học viên 16'] }
  ],
  // Điểm danh MẪU các buổi trước (để có số chuyên cần ngay khi mở) – khóa 'maLop|yyyy-mm-dd' ➜ danh sách có mặt
  diemDanhMau: {
    'LOP-A|2026-11-03': ['Học viên 01', 'Học viên 02', 'Học viên 03', 'Học viên 04', 'Học viên 05', 'Học viên 07', 'Học viên 08'],
    'LOP-A|2026-11-05': ['Học viên 01', 'Học viên 02', 'Học viên 04', 'Học viên 05', 'Học viên 06', 'Học viên 08'],
    'LOP-B|2026-11-01': ['Học viên 11', 'Học viên 12', 'Học viên 13', 'Học viên 15', 'Học viên 16'],
    'LOP-B|2026-11-02': ['Học viên 11', 'Học viên 13', 'Học viên 14', 'Học viên 15', 'Học viên 16']
  },
  baiXongMau: { 'LOP-A': ['M01', 'M02', 'M03', 'M04'], 'LOP-B': ['M01', 'M02'] }
};
