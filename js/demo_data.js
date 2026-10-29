/**
 * SHIN v2 – Dữ liệu mô phỏng chuẩn hóa cho Chế độ Trình diễn (Public Showcase)
 * Khi không có Token kết nối thật, ứng dụng chạy 100% dữ liệu mẫu sinh động,
 * giúp người dùng hoặc đối tác trải nghiệm đầy đủ toàn bộ tính năng mà không bị lộ dữ liệu nội bộ.
 */

window.SHIN_DEMO_DATA = {
  user: {
    ma: "13151",
    ten: "Huỳnh Trường Thanh Tâm",
    vaiTro: "Quản trị Y tế & Điều hành",
    toChuc: "Thanh Vũ Medic / SHIN AIOS",
    anh: "https://api.dicebear.com/7.x/bottts/svg?seed=ShinBoss"
  },
  
  hub: {
    hero: {
      chao: "Chào buổi sáng, Sếp Tâm 👋",
      ngay: "Thứ Năm, 29/10/2026",
      so: [
        { nhan: "Việc hôm nay", giaTri: "6", dvt: "mục", mau: "var(--c-blue)" },
        { nhan: "Chờ Sếp duyệt", giaTri: "3", dvt: "phiếu", mau: "var(--c-yellow)" },
        { nhan: "Cảnh báo hệ", giaTri: "0", dvt: "sự cố", mau: "var(--c-green)" }
      ],
      nutChinh: { nhan: "⚡ Mở Bàn Điều Hành 🧭", hanhDong: "dieuHanh" }
    },
    viec: [
      { id: "V1", app: "KPI", tieuDe: "Duyệt Bản tin tạm tính tháng 10 – BKS Toàn viện", han: "Hôm nay", uuTien: "Khẩn cấp", mau: "var(--c-red)" },
      { id: "V2", app: "PK", tieuDe: "Phê duyệt lịch trực tuần 44 Phòng Khám Đa Khoa", han: "17:00", uuTien: "Quan trọng", mau: "var(--c-yellow)" },
      { id: "V3", app: "TS", tieuDe: "Xác nhận hồ sơ đợt 3 Chiến dịch Tuyển sinh GDU", han: "30/11", uuTien: "Bình thường", mau: "var(--c-blue)" },
      { id: "V4", app: "KS", tieuDe: "Rà soát phản hồi chưa hài lòng khu vực Ngoại trú", han: "Hôm nay", uuTien: "Quan trọng", mau: "var(--c-yellow)" },
      { id: "V5", app: "HUB", tieuDe: "Kiểm tra nhịp tác vụ tự động 4 ca _TacVu", han: "21:22", uuTien: "Bình thường", mau: "var(--c-green)" }
    ],
    dieuHanh: {
      tienDoHe: "88%",
      tacVuDangChay: "viet-code (Lượt 11:27 chuẩn bị kích hoạt)",
      danhSachCho: [
        { ma: "HUB L20b", ten: "Hoàn tất chuyển đổi giao diện 8 phong cách", trangThai: "«CÓ KH»" },
        { ma: "KS L1", ten: "Dựng App Khảo sát chuẩn Clinical Precision AAA", trangThai: "«CHỜ: LOI L4»" },
        { ma: "PK L1", ten: "Dựng App Phòng khám mới thay thế PTKH đợt 1", trangThai: "«CHỜ: LOI L4»" }
      ]
    }
  },

  kpi: {
    hero: {
      chao: "BKS – Giám sát KPI Toàn Viện 🎯",
      ngay: "Dữ liệu TV3 tháng 10/2026",
      so: [
        { nhan: "AOP Viện", giaTri: "68,8", dvt: "tỷ VNĐ", mau: "var(--c-blue)" },
        { nhan: "Tạm tính Q3", giaTri: "94,2", dvt: "%", mau: "var(--c-green)" },
        { nhan: "Lỗi soát xét", giaTri: "2", dvt: "điểm", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "📊 Xem Bản Tin Tạm Tính Tháng", hanhDong: "banTin" }
    },
    khoaPhong: [
      { ten: "Khối Ngoại Trú CS3", aop: "24,5 tỷ", dat: "96%", trangThai: "Đạt nhịp", den: "var(--c-green)" },
      { ten: "Khoa Chẩn Đoán Hình Ảnh", aop: "12,8 tỷ", dat: "98%", trangThai: "Vượt chỉ tiêu", den: "var(--c-green)" },
      { ten: "Khoa Xét Nghiệm & Dược", aop: "18,2 tỷ", dat: "91%", trangThai: "Cần chú ý", den: "var(--c-yellow)" },
      { ten: "Khoa Nhi & Tiêm Chủng", aop: "8,5 tỷ", dat: "89%", trangThai: "Chậm hơn nhịp", den: "var(--c-red)" },
      { ten: "Khoa Phụ Sản", aop: "4,8 tỷ", dat: "93%", trangThai: "Đạt nhịp", den: "var(--c-green)" }
    ]
  },

  tuyensinh: {
    hero: {
      chao: "Tuyển Sinh & Cung Ứng Nhân Lực 🎓",
      ngay: "Chiến dịch tuyển sinh 2026",
      so: [
        { nhan: "Tổng Lead", giaTri: "148", dvt: "hồ sơ", mau: "var(--c-blue)" },
        { nhan: "Nhập học", giaTri: "32", dvt: "học viên", mau: "var(--c-green)" },
        { nhan: "Hoa hồng", giaTri: "48,5", dvt: "triệu", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "＋ Tiếp Nhận Lead Mới", hanhDong: "nhapLead" }
    },
    chienDich: [
      { ma: "CD03", ten: "Đại học Trực tuyến GDU – Đợt 3/2026", han: "15/11/2026", lead: 84, nhapHoc: 21, hoaHong: "Bậc 3 (2.5tr/hv)" },
      { ma: "CD02", ten: "Đại học Sư phạm Huế – Đợt 2/2026", han: "05/12/2026", lead: 42, nhapHoc: 8, hoaHong: "Bậc 2 (2.0tr/hv)" },
      { ma: "CD01", ten: "Chứng chỉ Y tế Ngắn hạn CS3", han: "Thường xuyên", lead: 22, nhapHoc: 3, hoaHong: "Bậc 1 (1.5tr/hv)" }
    ]
  },

  khaosat: {
    hero: {
      chao: "Khảo Sát Trải Nghiệm Người Bệnh 🩺",
      ngay: "Chuẩn chất lượng ACHSI & FMFT",
      so: [
        { nhan: "Hài lòng chung", giaTri: "96,4", dvt: "%", mau: "var(--c-green)" },
        { nhan: "Phiếu tháng 10", giaTri: "1.428", dvt: "lượt", mau: "var(--c-blue)" },
        { nhan: "Ý kiến cần xử lý", giaTri: "4", dvt: "góp ý", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "📝 Gửi Phiếu Khảo Sát Mới", hanhDong: "guiKhaoSat" }
    },
    chiSoNhom: [
      { nhan: "A. Khả năng tiếp cận & Thủ tục", diem: 4.85, tyLe: "97.0%", mau: "var(--c-green)" },
      { nhan: "B. Cơ sở vật chất & Tiện nghi", diem: 4.78, tyLe: "95.6%", mau: "var(--c-green)" },
      { nhan: "C. Kỹ năng & Thái độ Bác sĩ", diem: 4.92, tyLe: "98.4%", mau: "var(--c-green)" },
      { nhan: "D. Thái độ Điều dưỡng & Nhân viên", diem: 4.80, tyLe: "96.0%", mau: "var(--c-green)" },
      { nhan: "E. Kết quả & Hướng dẫn sau khám", diem: 4.75, tyLe: "95.0%", mau: "var(--c-green)" }
    ]
  },

  phongkham: {
    hero: {
      chao: "Vận Hành Phòng Khám & PTKH 🏥",
      ngay: "Ca trực: Sáng 07:00 – 16:30",
      so: [
        { nhan: "Báo cáo nộp", giaTri: "18/20", dvt: "nhân sự", mau: "var(--c-blue)" },
        { nhan: "Minh chứng ảnh", giaTri: "45", dvt: "ảnh", mau: "var(--c-green)" },
        { nhan: "Đổi ca trực", giaTri: "1", dvt: "yêu cầu", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "📷 Gửi Báo Cáo & Minh Chứng", hanhDong: "baoCao" }
    },
    nhanSuTruc: [
      { ten: "Nguyễn Thị Kim Thư", viTri: "Điều dưỡng Trưởng", ca: "Sáng", tt: "Đã nộp báo cáo", mau: "var(--c-green)" },
      { ten: "Trần Văn Nghĩa", viTri: "CSKH Ngoại trú", ca: "Sáng", tt: "Đang trực", mau: "var(--c-blue)" },
      { ten: "Lê Hoàng Phúc", viTri: "Tiếp đón & Hướng dẫn", ca: "Sáng", tt: "Đã nộp báo cáo", mau: "var(--c-green)" },
      { ten: "Phạm Ngọc Bích", viTri: "Tổng đài viên", ca: "Chiều", tt: "Chưa tới ca", mau: "var(--c-gray)" }
    ]
  }
};
