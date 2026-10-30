/**
 * SHIN v2 – Dữ liệu mô phỏng chuẩn hóa cho Chế độ Trình diễn (Public Showcase)
 * Khi không có Token kết nối thật, ứng dụng chạy 100% dữ liệu mẫu sinh động,
 * giúp người dùng hoặc đối tác trải nghiệm đầy đủ toàn bộ tính năng mà không bị lộ dữ liệu nội bộ.
 * Cập nhật: Phiên bản v2.1.0 – Bổ sung đầy đủ 10 Mảng Thập diện kiến trúc Decagon.
 */

window.SHIN_DEMO_DATA = {
  user: {
    ma: "13151",
    ten: "Huỳnh Trường Thanh Tâm",
    vaiTro: "Quản trị Y tế & Điều hành",
    toChuc: "Thanh Vũ Medic / SHIN AIOS",
    anh: "https://api.dicebear.com/7.x/bottts/svg?seed=ShinBoss"
  },
  
  // ==========================================
  // [1] ĐIỀU HÀNH & CHẤT LƯỢNG (HUB, KPI, KHẢO SÁT)
  // ==========================================
  hub: {
    hero: {
      chao: "Chào buổi sáng, Sếp Tâm 👋",
      ngay: "Thứ Năm, 29/10/2026",
      so: [
        { nhan: "Việc hôm nay", giaTri: "6", dvt: "mục", mau: "var(--c-blue)" },
        { nhan: "Chờ Sếp duyệt", giaTri: "4", dvt: "phiếu", mau: "var(--c-yellow)" },
        { nhan: "Cảnh báo hệ", giaTri: "0", dvt: "sự cố", mau: "var(--c-green)" }
      ],
      nutChinh: { nhan: "⚡ Bàn Điều Hành 🧭 & Phê Duyệt", hanhDong: "dieuHanh" }
    },
    viec: [
      { id: "V1", app: "KPI", tieuDe: "Duyệt Bản tin tạm tính tháng 10 – BKS Toàn viện", han: "Hôm nay", uuTien: "Khẩn cấp", mau: "var(--c-red)" },
      { id: "V2", app: "PK", tieuDe: "Phê duyệt lịch trực tuần 44 Phòng Khám Đa Khoa", han: "17:00", uuTien: "Quan trọng", mau: "var(--c-yellow)" },
      { id: "V3", app: "DA", tieuDe: "Duyệt tạm ứng xe X-quang KSK Điện lực Cà Mau", han: "12:00", uuTien: "Khẩn cấp", mau: "var(--c-red)" },
      { id: "V4", app: "TS", tieuDe: "Xác nhận hồ sơ đợt 3 Chiến dịch Tuyển sinh GDU", han: "30/11", uuTien: "Bình thường", mau: "var(--c-blue)" },
      { id: "V5", app: "KS", tieuDe: "Rà soát phản hồi chưa hài lòng khu vực Ngoại trú", han: "Hôm nay", uuTien: "Quan trọng", mau: "var(--c-yellow)" },
      { id: "V6", app: "HUB", tieuDe: "Kiểm tra nhịp tác vụ tự động 4 ca _TacVu", han: "21:22", uuTien: "Bình thường", mau: "var(--c-green)" }
    ],
    dieuHanh: {
      tienDoHe: "92%",
      tacVuDangChay: "shin-v2-sync (Đang lắng nghe 5 endpoint Google Apps Script)",
      danhSachCho: [
        { ma: "DA L1", ten: "Khung Daily Flash Report 4 khối dự án", trangThai: "«HOÀN TẤT»" },
        { ma: "CRM L1", ten: "CRM Khách hàng & Đối tác đa đối tượng", trangThai: "«HOÀN TẤT»" },
        { ma: "PD L1", ten: "Hộp thư Phê duyệt 1-chạm tập trung", trangThai: "«HOÀN TẤT»" }
      ]
    },
    viecRieng: [
      { id: "vr1", tieuDe: "Gọi lại đối tác KSK Điện lực chốt lịch khám", han: "29/10/2026", uuTien: "cao", homNay: true },
      { id: "vr2", tieuDe: "Đọc dự thảo AOP 2027 khối ngoại trú", han: "02/11/2026", uuTien: "thuong" }
    ],
    thongBao: {
      soChuaDoc: 1,
      ds: [
        { stt: 2, luc: "29/10/2026", tieuDe: "KPI: Bản tin tạm tính tháng 10 đã có", noiDung: "2 khoa dưới 80% – xem chi tiết ở mảng KPI.", daDoc: false },
        { stt: 1, luc: "28/10/2026", tieuDe: "Tuyển sinh: 3 lead mới từ web phễu", noiDung: "", daDoc: true }
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

  // ==========================================
  // [2] KHÁCH HÀNG & ĐỐI TÁC (CRM HỢP NHẤT)
  // Lưu ý tối thượng: Tuyệt đối không lưu bệnh nhân
  // ==========================================
  crm: {
    hero: {
      chao: "CRM Khách Hàng & Đối Tác Chiến Lược 👥",
      ngay: "Quản lý B2B, Học viên, CTV & Cung ứng",
      so: [
        { nhan: "Doanh nghiệp B2B", giaTri: "48", dvt: "công ty", mau: "var(--c-blue)" },
        { nhan: "Học viên Đào tạo", giaTri: "142", dvt: "người", mau: "var(--c-green)" },
        { nhan: "CTV Tuyển sinh", giaTri: "35", dvt: "cộng tác", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "＋ Thêm Đối Tác / Khách Mới", hanhDong: "themDoiTac" }
    },
    danhBa: [
      { ma: "DT01", ten: "Công ty Cổ phần Thủy sản Minh Phú Cà Mau", loai: "B2B Khám Sức Khỏe", quyMo: "1.200 nhân sự", nguoiLienHe: "Anh Tuấn (Trưởng ban Nhân sự)", dienThoai: "0918.xxx.112", trangThai: "Đang đàm phán HĐ 2026", mau: "var(--c-blue)" },
      { ma: "DT02", ten: "Công ty Điện Lực Cà Mau (PC Cà Mau)", loai: "B2B Khám Sức Khỏe", quyMo: "420 nhân sự", nguoiLienHe: "Chị Thảo (Phòng Tổ chức)", dienThoai: "0903.xxx.898", trangThai: "Đang triển khai khám", mau: "var(--c-green)" },
      { ma: "DT03", ten: "Trường Đại học Gia Định (GDU)", loai: "Đối tác Đào tạo", quyMo: "Đào tạo từ xa", nguoiLienHe: "Thầy Hưng (Trung tâm Tuyển sinh)", dienThoai: "0938.xxx.445", trangThai: "Hợp tác thường niên", mau: "var(--c-purple)" },
      { ma: "DT04", ten: "Công ty Thiết bị Y tế Phương Đông", loai: "Nhà Cung Ứng", quyMo: "Vật tư xét nghiệm", nguoiLienHe: "Anh Khoa (Giám đốc kinh doanh)", dienThoai: "0912.xxx.678", trangThai: "Cung ứng ổn định", mau: "var(--c-gray)" },
      { ma: "DT05", ten: "Anh Hoàng Minh Trí", loai: "CTV Tuyển sinh", quyMo: "Top 1 CTV Tháng 10", nguoiLienHe: "Cá nhân", dienThoai: "0944.xxx.221", trangThai: "Đã giới thiệu 18 lead", mau: "var(--c-yellow)" }
    ],
    leadMoi: [
      { nguon: "Landing Page KSK Doanh nghiệp (Mảng 8)", ten: "Công ty May Xuất Khẩu An Xuyên", soDt: "0913.xxx.554", slKham: "350 người", thoiGian: "10 phút trước" },
      { nguon: "Form Tuyển sinh Đại học Từ xa GDU", ten: "Lê Hoàng Yến", soDt: "0982.xxx.901", khoa: "Quản trị Kinh doanh", thoiGian: "45 phút trước" }
    ]
  },

  // ==========================================
  // [4] GIÁO DỤC & TUYỂN SINH
  // ==========================================
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

  // ==========================================
  // [5] NHÂN SỰ & VẬN HÀNH PHÒNG KHÁM
  // ==========================================
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
  },

  // ==========================================
  // [6] QUẢN LÝ DỰ ÁN & BÁO CÁO NHANH 4 KHỐI (DAILY FLASH)
  // ==========================================
  duan: {
    hero: {
      chao: "Quản Lý Dự Án & Báo Cáo Nhanh 📌",
      ngay: "Chu kỳ điều hành dự án Q4/2026",
      so: [
        { nhan: "Dự án đang chạy", giaTri: "4", dvt: "dự án", mau: "var(--c-blue)" },
        { nhan: "Đúng tiến độ", giaTri: "3/4", dvt: "dự án", mau: "var(--c-green)" },
        { nhan: "Việc chờ duyệt", giaTri: "2", dvt: "mục", mau: "var(--c-yellow)" }
      ],
      nutChinh: { nhan: "⚡ Lập Báo Cáo Nhanh (Flash Report)", hanhDong: "lapBaoCaoFlash" }
    },
    danhSachDuAn: [
      {
        ma: "DA-KSK01",
        ten: "Khám Sức Khỏe Định Kỳ Công Ty Điện Lực Cà Mau",
        quanLy: "Trần Văn Nghĩa",
        tienDo: 78,
        nganSach: "350.000.000 đ",
        daChi: "145.000.000 đ",
        trangThai: "Đang triển khai tại hiện trường",
        hanChot: "05/11/2026",
        den: "var(--c-green)"
      },
      {
        ma: "DA-SHIN02",
        ten: "Chuyển Đổi Số SHIN AIOS v2 & Đồng Bộ Dữ Liệu 1 Web",
        quanLy: "Shin / Sếp Tâm",
        tienDo: 88,
        nganSach: "Nội bộ",
        daChi: "0 đ",
        trangThai: "Hoàn tất v2.1.0 Thập diện Decagon",
        hanChot: "30/10/2026",
        den: "var(--c-green)"
      },
      {
        ma: "DA-TS03",
        ten: "Chiến Dịch Tuyển Sinh Khóa K2026 – Đợt 3 GDU",
        quanLy: "Ban Tuyển Sinh",
        tienDo: 62,
        nganSach: "120.000.000 đ",
        daChi: "48.500.000 đ",
        trangThai: "Cần tăng nhịp chốt học phí đợt cuối",
        hanChot: "15/11/2026",
        den: "var(--c-yellow)"
      },
      {
        ma: "DA-ACHSI04",
        ten: "Đánh Giá Trải Nghiệm Ngoại Trú Chuẩn ACHSI Quốc Tế",
        quanLy: "Khối Quản Lý Chất Lượng",
        tienDo: 95,
        nganSach: "45.000.000 đ",
        daChi: "38.200.000 đ",
        trangThai: "Đang tổng hợp báo cáo kết quả thẩm định",
        hanChot: "02/11/2026",
        den: "var(--c-green)"
      }
    ],
    // Báo cáo nhanh mỗi ngày gồm đúng 4 khối Sếp chỉ đạo
    flashReport: {
      ngay: "29/10/2026 (Báo cáo chốt 16:00)",
      nguoiBaoCao: "Hệ Thống Tự Động & Quản Lý Dự Án",
      khoi1_tienDo: [
        "DA-KSK01 (Điện Lực Cà Mau): Đã khám xong 328/420 CBNV (đạt 78%). Các xét nghiệm máu và X-quang đạt chuẩn an toàn 100%.",
        "DA-SHIN02: Triển khai thành công khung điều hướng Decagon 10 mảng và trung tâm phê duyệt 1-chạm lên GitHub Pages.",
        "DA-TS03: Tiếp nhận mới 6 lead hôm nay, 2 học viên đã hoàn tất thủ tục nhập học."
      ],
      khoi2_vuongMac: [
        { vanDe: "Xe lưu động X-quang kỹ thuật số đang bảo dưỡng định kỳ đột xuất.", mucDo: "Cao", deXuat: "Thuê xe dự phòng của BV Medic Cần Thơ trong 3 ngày (01/11 - 03/11) để không gián đoạn lịch khám Điện Lực." },
        { vanDe: "Tỉ lệ phản hồi khảo sát giấy tại bàn tiếp đón Ngoại trú đạt thấp hơn khảo sát quét QR (chỉ đạt 35%).", mucDo: "Vừa", deXuat: "Cử điều dưỡng hướng dẫn bệnh nhân quét mã QR trực tiếp trên hóa đơn khám." }
      ],
      khoi3_taiChinh: {
        tongNganSach: "515.000.000 đ",
        daGiaiNgan: "231.700.000 đ (45%)",
        phatSinhTrongNgay: [
          { khoanMuc: "Tạm ứng thuê xe X-quang lưu động dự phòng (DA-KSK01)", soTien: "15.000.000 đ", nguoiChi: "Trần Văn Nghĩa", tinhTrang: "Chờ Sếp duyệt" },
          { khoanMuc: "Chi tiền vé xe và phụ cấp di chuyển đoàn KSK lưu động", soTien: "3.200.000 đ", nguoiChi: "Kim Thư", tinhTrang: "Đã chi" }
        ]
      },
      khoi4_choDuyet: [
        { ma: "PD-TC01", loai: "Tài chính phát sinh", tieuDe: "Duyệt tạm ứng 15.000.000 đ thuê xe X-quang KSK Điện Lực Cà Mau", han: "17:00 hôm nay", uuTien: "Khẩn cấp" },
        { ma: "PD-DA02", loai: "Nghiệm thu tiến độ", tieuDe: "Duyệt biên bản nghiệm thu giai đoạn 1 Tuyển sinh Đại học GDU", han: "30/10", uuTien: "Quan trọng" }
      ]
    }
  },

  // ==========================================
  // [7] QUẢN LÝ CÔNG VIỆC (UNIVERSAL TASK BUS)
  // ==========================================
  congviec: {
    hero: {
      chao: "Trục Quản Lý Công Việc Liên Thông 📋",
      ngay: "Task Bus toàn bộ hệ sinh thái",
      so: [
        { nhan: "Cần làm", giaTri: "5", dvt: "việc", mau: "var(--c-blue)" },
        { nhan: "Đang làm", giaTri: "3", dvt: "việc", mau: "var(--c-yellow)" },
        { nhan: "Hoàn tất", giaTri: "14", dvt: "việc", mau: "var(--c-green)" }
      ],
      nutChinh: { nhan: "＋ Tạo Công Việc Mới", hanhDong: "taoViec" }
    },
    kanban: {
      canLam: [
        { id: "T1", nguon: "Mảng 1 (Hub)", tieuDe: "Duyệt Bản tin tạm tính tháng 10 BKS Viện", nguoi: "Sếp Tâm", han: "Hôm nay", tag: "Khẩn cấp" },
        { id: "T2", nguon: "Mảng 6 (Dự án)", tieuDe: "Ký hợp đồng thuê xe X-quang Medic Cần Thơ", nguoi: "Trần Văn Nghĩa", han: "30/10", tag: "Dự án" },
        { id: "T3", nguon: "Mảng 2 (CRM)", tieuDe: "Gọi tư vấn hợp đồng KSK Công ty May An Xuyên", nguoi: "Lê Hoàng Phúc", han: "Hôm nay", tag: "B2B Sales" }
      ],
      dangLam: [
        { id: "T4", nguon: "Mảng 5 (PK)", tieuDe: "Tiếp đón đoàn khám đợt 2 Điện lực Cà Mau", nguoi: "Kim Thư & CSKH", han: "Đang diễn ra", tag: "Hiện trường" },
        { id: "T5", nguon: "Mảng 4 (TS)", tieuDe: "Tư vấn hồ sơ 6 lead mới chiến dịch GDU", nguoi: "Ban Tuyển Sinh", han: "17:00", tag: "Tuyển sinh" },
        { id: "T6", nguon: "Tầng 0 (Core)", tieuDe: "Triển khai bản build v2.1.0 lên GitHub Pages", nguoi: "Shin AI", han: "16:00", tag: "Kỹ thuật" }
      ],
      hoanTat: [
        { id: "T7", nguon: "Mảng 3 (TC)", tieuDe: "Đối soát chuyển khoản tự động SePay ca sáng", nguoi: "Kế toán", han: "Đã xong lúc 11:30", tag: "Tài chính" },
        { id: "T8", nguon: "Mảng 9 (Tri thức)", tieuDe: "Đồng bộ file SOP KSK Doanh Nghiệp v3 vào Obsidian", nguoi: "Shin AI", han: "Đã xong", tag: "SOP" }
      ]
    }
  },

  // ==========================================
  // [0B] DỊCH VỤ DÙNG CHUNG: PHÊ DUYỆT 1-CHẠM (APPROVAL CENTER)
  // ==========================================
  pheduyet: {
    hero: {
      chao: "Hộp Thư Phê Duyệt 1-Chạm Tập Trung ⚡",
      ngay: "Gom tất cả yêu cầu cần Sếp quyết định",
      so: [
        { nhan: "Chờ phê duyệt", giaTri: "4", dvt: "yêu cầu", mau: "var(--c-yellow)" },
        { nhan: "Đã duyệt hôm nay", giaTri: "7", dvt: "hồ sơ", mau: "var(--c-green)" },
        { nhan: "Cần chỉnh sửa", giaTri: "1", dvt: "phiếu", mau: "var(--c-red)" }
      ],
      nutChinh: { nhan: "✅ Duyệt Tất Cả Các Mục An Toàn", hanhDong: "duyetTatCa" }
    },
    danhSach: [
      {
        id: "PD01",
        loai: "Tài chính Dự án",
        bieuTuong: "💰",
        tieuDe: "Tạm ứng 15.000.000 đ thuê xe X-quang lưu động",
        duAn: "DA-KSK01 Điện Lực Cà Mau",
        nguoiGui: "Trần Văn Nghĩa (CSKH Ngoại trú)",
        thoiGian: "11:15 hôm nay",
        chiTiet: "Xe viện bảo dưỡng đột xuất. Đề xuất thuê xe Medic Cần Thơ để khám ngày 01-03/11. Đã có báo giá đính kèm.",
        soTien: "15.000.000 đ",
        trangThai: "cho_duyet"
      },
      {
        id: "PD02",
        loai: "Báo cáo ca Phòng khám",
        bieuTuong: "🏥",
        tieuDe: "Báo cáo ca sáng & 12 ảnh minh chứng trực ngoại trú",
        duAn: "Phòng Khám Đa Khoa CS3",
        nguoiGui: "Nguyễn Thị Kim Thư (Điều dưỡng Trưởng)",
        thoiGian: "11:45 hôm nay",
        chiTiet: "Số lượt tiếp đón sáng nay: 184 lượt. Không có sự cố y khoa. Đã hoàn tất vệ sinh vô trùng khu chờ.",
        soTien: "—",
        trangThai: "cho_duyet"
      },
      {
        id: "PD03",
        loai: "Nhân sự & Đổi ca",
        bieuTuong: "👤",
        tieuDe: "Đơn xin đổi ca trực CN 01/11/2026",
        duAn: "Tổ CSKH & Tổng Đài",
        nguoiGui: "Phạm Ngọc Bích ➜ Hoàng Phúc",
        thoiGian: "09:30 hôm nay",
        chiTiet: "Bích xin đổi ca chiều sang ca sáng do bận việc gia đình. Anh Hoàng Phúc đã xác nhận đồng ý đổi ca.",
        soTien: "—",
        trangThai: "cho_duyet"
      },
      {
        id: "PD04",
        loai: "Truyền thông Marketing",
        bieuTuong: "📢",
        tieuDe: "Duyệt bài Fanpage: Quy trình KSK Doanh nghiệp chuẩn 5 bước",
        duAn: "Mảng 8 – Tăng trưởng",
        nguoiGui: "Shin Content AI",
        thoiGian: "08:00 hôm nay",
        chiTiet: "Bài viết theo công thức PAS + hình ảnh infographics đạt chuẩn thương hiệu Thanh Vũ Medic.",
        soTien: "—",
        trangThai: "cho_duyet"
      }
    ]
  },

  // ==========================================
  // [9] THƯ VIỆN TRI THỨC (SECOND BRAIN OBSIDIAN & SOP)
  // ==========================================
  trithuc: {
    hero: {
      chao: "Thư Viện Tri Thức & Second Brain 🧠",
      ngay: "Kho tri thức số liên kết đa ứng dụng",
      so: [
        { nhan: "Ghi chú Wiki", giaTri: "128", dvt: "bài", mau: "var(--c-blue)" },
        { nhan: "Quy trình SOP", giaTri: "42", dvt: "quy trình", mau: "var(--c-green)" },
        { nhan: "Bản đồ tư duy", giaTri: "8", dvt: "mindmap", mau: "var(--c-purple)" }
      ],
      nutChinh: { nhan: "🔍 Tra Cứu Tri Thức Nhanh", hanhDong: "traCuuTriThuc" }
    },
    taiLieu: [
      { ma: "SOP-01", ten: "Quy trình tổ chức Khám sức khỏe lưu động Doanh nghiệp v3.2", linhVuc: "Quản trị Y tế", capNhat: "26/10/2026", dinhDang: "Markdown (.md)" },
      { ma: "ACHSI-02", ten: "Bộ tiêu chuẩn đánh giá sự hài lòng người bệnh ngoại trú ACHSI", linhVuc: "Chất lượng Y tế", capNhat: "20/10/2026", dinhDang: "Markdown (.md)" },
      { ma: "PAY-03", ten: "Sổ tay tích hợp cổng thanh toán tự động VietQR SePay & Webhook", linhVuc: "Công nghệ số", capNhat: "28/10/2026", dinhDang: "Markdown (.md)" },
      { ma: "AIOS-04", ten: "Kiến trúc Thập diện Decagon SHIN v2 & Bộ danh mục 38 Micro-Modules", linhVuc: "Hệ thống AIOS", capNhat: "29/10/2026", dinhDang: "Markdown (.md)" }
    ]
  },

  // ==========================================
  // [0A] CÀI ĐẶT & QUẢN TRỊ HỆ SINH THÁI
  // ==========================================
  caidat: {
    hero: {
      chao: "Quản Trị Hệ Sinh Thái & Bật/Tắt Module ⚙️",
      ngay: "Cấu hình phân quyền & trạng thái ứng dụng",
      so: [
        { nhan: "Tổng mảng", giaTri: "10", dvt: "mảng", mau: "var(--c-blue)" },
        { nhan: "Đang bật", giaTri: "10/10", dvt: "hoạt động", mau: "var(--c-green)" },
        { nhan: "Quyền truy cập", giaTri: "Admin (Sếp)", dvt: "toàn quyền", mau: "var(--c-purple)" }
      ],
      nutChinh: { nhan: "💾 Lưu Cấu Hình Phân Quyền", hanhDong: "luuCauHinh" }
    },
    danhSachMang: [
      { stt: "0A", ma: "caidat", ten: "Quản trị Nền tảng & Phân quyền", nhom: "Nền tảng", bat: true },
      { stt: "0B", ma: "pheduyet", ten: "Trung tâm Phê duyệt 1-chạm", nhom: "Dịch vụ chung", bat: true },
      { stt: "1", ma: "hub", ten: "Điều hành Hub, KPI & Khảo sát", nhom: "Điều hành", bat: true },
      { stt: "2", ma: "crm", ten: "Khách hàng & Đối tác (CRM hợp nhất)", nhom: "Tăng trưởng", bat: true },
      { stt: "3", ma: "taichinh", ten: "Quản lý Tài chính & VietQR SePay", nhom: "Tăng trưởng", bat: true },
      { stt: "4", ma: "tuyensinh", ten: "Giáo dục & Tuyển sinh chiến dịch", nhom: "Tăng trưởng", bat: true },
      { stt: "5", ma: "phongkham", ten: "Nhân sự & Vận hành Phòng khám", nhom: "Vận hành", bat: true },
      { stt: "6", ma: "duan", ten: "Quản lý Dự án & Báo cáo Flash 4 khối", nhom: "Vận hành", bat: true },
      { stt: "7", ma: "congviec", ten: "Quản lý Công việc (Task Bus)", nhom: "Vận hành", bat: true },
      { stt: "8", ma: "tangtruong", ten: "Tăng trưởng (Marketing AI & Web Phễu)", nhom: "Tăng trưởng", bat: true },
      { stt: "9", ma: "trithuc", ten: "Thư viện Tri thức (Second Brain Obsidian)", nhom: "Điều hành", bat: true }
    ]
  }
};

// ==========================================
// v2.3.0 – 🧭 Điều hành (khuôn webDieuHanh của Hub v1 – dữ liệu GIẢ)
// ==========================================
window.SHIN_DEMO_DATA.dieuhanh = {
  cau: '72% dòng việc đã xong · 2 việc chờ anh · 1 trả lại',
  luc: '09:40 30/10/2026',
  luotAi: 'Hôm nay: Claude 6 lượt · agy 4 lượt · 7 ngày: Claude 41 · agy 30',
  canhBaoCu: '',
  oSo: [
    { ma: 'len_app', ten: 'Đã lên app', so: 18 }, { ma: 'kiem_dat', ten: 'Kiểm đạt', so: 3 }, { ma: 'dang_lam', ten: 'Đang làm', so: 4 },
    { ma: 'dang_cho', ten: 'Đang chờ', so: 6 }, { ma: 'viec_anh', ten: 'Việc anh cần làm', so: 2 }
  ],
  choAnh: [
    { ma: 'V101', tieuDe: 'Dán khóa Hub vào app Khảo sát', chiTiet: 'Mở Script Properties của app KS, thêm HUB_KHOA rồi bấm lưu.', app: 'KS', ngay: '29/10', luaChon: [], trangThai: 'mo', nhanTT: '', traLoi: '', hoanTac: false },
    { ma: 'TS-L9', tieuDe: 'Duyệt dòng TS-L9: báo cáo hoa hồng theo tháng', chiTiet: 'Phiếu đã lập, chờ anh duyệt trước khi viết code.', app: 'TS', ngay: '30/10', luaChon: ['Duyệt', 'Để sau'], trangThai: 'mo', nhanTT: '', traLoi: '', hoanTac: false }
  ],
  ungDung: [
    { ma: 'HUB', ten: 'Hub điều hành', pbMa: 'v1.8.6', pbApp: '', tyLe: 82, demChu: '1 chờ kiểm',
      dong: [
        { l: 'L18', nhan: 'ĐÃ CODE v1.8.7', trangThai: 'da_code', noiDung: 'Thẻ việc riêng có nhắc giờ', cho: '', phieu: true, tomTat: { mucTieu: 'Việc riêng có giờ nhắc, đến giờ báo chuông.', xong: 3, tong: 4, kiemTra: ['Thiếu kiểm khi để trống giờ'] } },
        { l: 'L19', nhan: 'Chờ kế hoạch', trangThai: 'cho_kh', noiDung: 'Lọc thông báo theo app', cho: '', phieu: false, tomTat: null }
      ], nhatKy: [{ luc: '2026-10-30T08:22', noiDung: 'Kiểm L17 đạt 12/12' }] },
    { ma: 'TS', ten: 'Tuyển sinh', pbMa: 'v1.6.1', pbApp: '', tyLe: 90, demChu: '1 chờ anh',
      dong: [{ l: 'L9', nhan: 'CÓ KH', trangThai: 'cho_anh', noiDung: 'Báo cáo hoa hồng theo tháng', cho: 'anh duyệt', phieu: true, tomTat: { mucTieu: 'Bảng hoa hồng mỗi tháng theo người tư vấn.', xong: 0, tong: 5, kiemTra: [] } }], nhatKy: [] },
    { ma: 'KS', ten: 'Khảo sát', pbMa: 'v1.0.1', pbApp: '', tyLe: 10, demChu: '',
      dong: [{ l: 'L1', nhan: '⏸ Chờ anh giao', trangThai: 'cho_viec', noiDung: 'Khung app + quản lý khảo sát', cho: 'LOI L4', phieu: false, tomTat: null }], nhatKy: [] }
  ],
  giaoViec: [{ ma: 'GV261029221500', app: 'KPI', noiDung: 'Thêm thẻ so cùng kỳ năm trước vào bản tin', l: 'L12', trangThai: 'co_kh', nhan: 'Có KH' }],
  keHoach: [{ ma: 'KH0031', tep: 'phieu/L9.md', tieuDe: 'TS L9 – Báo cáo hoa hồng tháng', tomTat: 'Thêm tab Hoa hồng: chọn tháng, bảng theo người tư vấn, xuất Sheets.',
    cau: [{ ma: 'Q1', hoi: 'Tính hoa hồng theo ngày nhập học hay ngày nộp hồ sơ?', macDinh: 'Ngày nhập học' }, { ma: 'Q2', hoi: 'Có cho CTV xem bảng của mình không?', macDinh: '' }] }],
  khoa: { chu: 'Không tác vụ nào đang chạy', treo: false },
  tacVu: [
    { ten: '① Lập kế hoạch', lanCuoi: '22:57 29/10', ketQua: 'Lập 2 phiếu (TS L9, HUB L19)', lanToi: '10:57' },
    { ten: '② Viết code', lanCuoi: '09:27', ketQua: 'HUB L18 → ĐÃ CODE', lanToi: '11:27' },
    { ten: '③ Kiểm tra', lanCuoi: '08:22', ketQua: 'Đạt 1 · trả lại 0', lanToi: '21:22' },
    { ten: '④ Đưa app', lanCuoi: '09:52', ketQua: 'Đưa HUB v1.8.6', lanToi: '09:52 mai' }
  ],
  hoatDong: [{ luc: '2026-10-30 09:52', noi_dung: 'Đưa HUB v1.8.6 lên app', kho: 'Hub' }]
};

// v2.3.0 – KPI: Soát lỗi · AOP · Báo cáo quý (khuôn webSoatLoi / webAOP / webBaoCaoQuy – dữ liệu GIẢ)
window.SHIN_DEMO_DATA.kpiPhu = {
  soatloi: { quy: '3', capNhatLuc: '06:00 30/10/2026', laAdmin: true, khoa: [
    { tab: 'NOI', ten: 'Khoa Nội', chuaCoQuy: false, soLoi: 2, loi: [{ loai: 'trong', chu: 'C2: chưa nhập KQ' }, { loai: 'ts_nhom', chu: 'Nhóm F: trọng số các chỉ tiêu cộng 95% (cần 100%)' }] },
    { tab: 'NGOAI', ten: 'Khoa Ngoại', chuaCoQuy: false, soLoi: 0, loi: [] },
    { tab: 'CDHA', ten: 'Khoa Chẩn đoán hình ảnh', chuaCoQuy: true, soLoi: 0, loi: [] }
  ] },
  aop: { nam: 2026, luc: '06:00 30/10/2026', vienDT: 182000000000, soVanDe: 1, chung: ['Phòng Kế hoạch'], khoa: [
    { ten: 'Toàn phòng khám', phuTrach: 'Ban Giám đốc', doanhThu: 182000000000, vanDe: [] },
    { ten: 'Khoa Nội', phuTrach: 'BS. Mẫu A', doanhThu: 41000000000, vanDe: ['Tài chính: F3 chưa có trọng số'] },
    { ten: 'Khoa Ngoại', phuTrach: 'BS. Mẫu B', doanhThu: 36500000000, vanDe: [] }
  ] },
  baocao: { url: '', luc: '10:05 30/10/2026', tomTat: 'Quý 3/2026: toàn viện tạm tính 91,4% · 9/12 khoa đạt từ 90% · 3 khoa dưới 90% · 4 chỉ tiêu 0% · cùng kỳ năm trước –.' }
};

// v2.5.0 – 💰 Tài chính (khuôn webTaiChinh – dữ liệu GIẢ)
window.SHIN_DEMO_DATA.taichinh = {
  thang: '10/2026', thu: 486500000, chi: 231700000, ton: 254800000,
  khoanChoDuyet: [{ ma: 'TC01', khoanMuc: 'Tạm ứng thuê xe X-quang lưu động', soTien: 15000000, nguoiDeXuat: 'Nhân viên mẫu A', duAn: 'DA-KSK01', luc: '11:15 hôm nay' }],
  giaoDich: [
    { ngay: '30/10/2026', noiDung: 'Công ty mẫu chuyển khoản đợt 2 KSK', soTien: 120000000, nguon: 'SePay' },
    { ngay: '29/10/2026', noiDung: 'Chi vé xe đoàn KSK lưu động', soTien: -3200000, nguon: 'Tay' }
  ]
};

window.SHIN_DEMO_DATA.khaosat.canXuLy = [{ ma: 'P0412', khaoSat: 'Hài lòng ngoại trú T10', cau: 'Thời gian chờ khám', diem: 2, ngay: '29/10/2026', noiDung: 'Chờ hơn 1 tiếng ở quầy thu ngân.' }];
