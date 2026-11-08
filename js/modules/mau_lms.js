/**
 * SHIN v2.12.1 – M4.5 LMS mini: dữ liệu MẪU (lớp, học viên, bài M01–M20).
 * Không chứa dữ liệu thật. Còn chờ v1: danh sách lớp / học viên thật từ app Tuyển sinh (chưa có cổng).
 * Tên bài là khung chung cho lớp chứng chỉ ngắn hạn – có thể thay nội dung, giữ nguyên trường { ma, ten, tuan, mucTieu }.
 */
window.MAU_LMS = {
  bai: [
    { ma: 'M01', tuan: 1, ten: 'Nhập môn: mục tiêu khóa học, nội quy lớp', mucTieu: 'Nắm vững lộ trình học tập, chuẩn đầu ra và nội quy kỷ luật chuyên môn.' },
    { ma: 'M02', tuan: 1, ten: 'Giao tiếp cơ bản với người bệnh và người nhà', mucTieu: 'Thực hành giao tiếp hòa nhã, lắng nghe và giải thích quy trình tận tình.' },
    { ma: 'M03', tuan: 1, ten: 'An toàn người bệnh và phòng ngừa sai sót', mucTieu: 'Nhận diện các nguy cơ sự cố y khoa và tuân thủ nguyên tắc an toàn người bệnh.' },
    { ma: 'M04', tuan: 1, ten: 'Kiểm soát nhiễm khuẩn: rửa tay, phương tiện phòng hộ', mucTieu: 'Thực hiện đúng quy trình rửa tay 6 bước và mang đồ phòng hộ chuẩn.' },
    { ma: 'M05', tuan: 2, ten: 'Đo dấu hiệu sinh tồn cơ bản', mucTieu: 'Đo và ghi nhận chính xác chỉ số mạch, nhiệt độ, huyết áp, nhịp thở.' },
    { ma: 'M06', tuan: 2, ten: 'Tiếp đón, hướng dẫn quy trình khám', mucTieu: 'Hướng dẫn phân luồng, hỗ trợ người bệnh làm thủ tục khám nhanh chóng.' },
    { ma: 'M07', tuan: 2, ten: 'Hồ sơ, giấy tờ và bảo mật thông tin người bệnh', mucTieu: 'Sắp xếp bệnh án ngăn nắp, bảo mật thông tin cá nhân theo đúng quy định.' },
    { ma: 'M08', tuan: 2, ten: 'Sơ cứu ban đầu thường gặp tại phòng khám', mucTieu: 'Xử trí đúng kỹ thuật khi gặp ngất xỉu, dị vật đường thở, vết thương nhỏ.' },
    { ma: 'M09', tuan: 3, ten: 'Chăm sóc vệ sinh cá nhân người bệnh', mucTieu: 'Hỗ trợ người bệnh vệ sinh răng miệng, thân thể và thay đồ an toàn.' },
    { ma: 'M10', tuan: 3, ten: 'Dinh dưỡng cơ bản theo nhóm bệnh', mucTieu: 'Hiểu chế độ ăn cơ bản và hỗ trợ người bệnh dùng bữa đúng cách.' },
    { ma: 'M11', tuan: 3, ten: 'Di chuyển, nâng đỡ người bệnh an toàn', mucTieu: 'Sử dụng kỹ thuật nâng đỡ, chuyển người bệnh lên xe lăn hoặc giường bệnh.' },
    { ma: 'M12', tuan: 3, ten: 'Kiểm tra lý thuyết và thực hành giữa khóa', mucTieu: 'Đánh giá kiến thức lý thuyết và kỹ năng thao tác cơ bản sau 3 tuần.' },
    { ma: 'M13', tuan: 4, ten: 'Xử lý tình huống phàn nàn, khiếu nại', mucTieu: 'Bình tĩnh lắng nghe, giải thích đúng thẩm quyền và báo cáo kịp thời.' },
    { ma: 'M14', tuan: 4, ten: 'Kỹ năng làm việc nhóm trong khoa, phòng', mucTieu: 'Phối hợp nhịp nhàng với điều dưỡng, bác sĩ và nhân viên hỗ trợ khác.' },
    { ma: 'M15', tuan: 4, ten: 'Quản lý thời gian và quy trình bàn giao ca', mucTieu: 'Lập kế hoạch công việc trong ca và bàn giao đầy đủ tình trạng người bệnh.' },
    { ma: 'M16', tuan: 4, ten: 'Đạo đức nghề nghiệp và quy tắc ứng xử y tế', mucTieu: 'Thực hiện đúng chuẩn mực văn hóa ứng xử và y đức của nhân viên y tế.' },
    { ma: 'M17', tuan: 5, ten: 'Thực hành lâm sàng tại cơ sở y tế – phần 1', mucTieu: 'Quan sát và tham gia hỗ trợ thực tế quy trình chăm sóc tại phòng khám.' },
    { ma: 'M18', tuan: 5, ten: 'Thực hành lâm sàng tại cơ sở y tế – phần 2', mucTieu: 'Rèn luyện kỹ năng xử lý tình huống thực tế dưới sự hướng dẫn chuyên môn.' },
    { ma: 'M19', tuan: 5, ten: 'Ôn tập và chuẩn hóa kỹ năng tổng hợp', mucTieu: 'Hệ thống hóa kiến thức trọng tâm và giải đáp thắc mắc trước kỳ thi.' },
    { ma: 'M20', tuan: 5, ten: 'Kiểm tra cuối khóa và cấp chứng chỉ', mucTieu: 'Thực hiện bài kiểm tra tay nghề kết thúc khóa và hoàn tất cấp chứng chỉ.' }
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
