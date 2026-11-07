/**
 * SHIN v2 – Mảng 8: Bộ khuôn nội dung & Lịch biên tập Marketing (M8.1 + M8.2)
 * Kho công khai GitHub Pages: TUYỆT ĐỐI KHÔNG chứa dữ liệu thật (chỉ dùng ô {{...}}).
 * Tuân thủ nghiêm ngặt Luật Quảng cáo & Nghị định 181/2013/NĐ-CP về quảng cáo dịch vụ y tế:
 * - Không dùng từ ngữ mang tính khẳng định tuyệt đối: 'nhất', 'duy nhất', 'tốt nhất', 'số một'.
 * - Không cam kết chữa khỏi bệnh 100%, không cam kết kết quả điều trị tuyệt đối.
 * - Nội dung y tế luôn có khuyến cáo tham vấn chuyên môn từ bác sĩ.
 */

const MAU_MARKETING = {
  /** Danh sách 4 kênh truyền thông chủ lực */
  kenh: [
    {
      ma: 'facebook',
      ten: 'Facebook Fanpage',
      bieuTuong: '📘',
      gioiHanDoDai: '1.000 – 1.500 ký tự (bài viết) · Dưới 125 ký tự trước nút Xem thêm',
      gioDangGoiY: '08:00 – 09:00 · 11:30 – 13:00 · 19:30 – 21:00',
      dinhDangManh: 'Bài viết kèm album ảnh (1+3 hoặc 1+4), Infographic kiến thức, Chia sẻ ca tình huống thực tế'
    },
    {
      ma: 'tiktok',
      ten: 'TikTok VN',
      bieuTuong: '🎵',
      gioiHanDoDai: 'Caption dưới 150 ký tự kèm 3–5 hashtag · Video 30s – 60s',
      gioDangGoiY: '11:30 – 12:30 · 18:00 – 20:00 · 21:30 – 23:00',
      dinhDangManh: 'Video ngắn khung hình dọc 9:16, Tình huống hậu trường, Thử thách phản xạ, Giải đáp thắc mắc nhanh'
    },
    {
      ma: 'zalo_oa',
      ten: 'Zalo Official Account',
      bieuTuong: '💬',
      gioiHanDoDai: 'Dưới 500 ký tự (tin Broadcast) · Dưới 2.000 ký tự (bài viết Article)',
      gioDangGoiY: '07:30 – 08:30 · 11:45 – 12:45 · 17:00 – 18:00',
      dinhDangManh: 'Tin nhắn gửi trực tiếp 1-1, Nhắc lịch định kỳ, Bảng giá gói khám / khóa học, Bản tin chăm sóc sức khỏe'
    },
    {
      ma: 'youtube',
      ten: 'YouTube',
      bieuTuong: '▶️',
      gioiHanDoDai: 'Tiêu đề dưới 60 ký tự · Mô tả 200 – 400 từ · Shorts dưới 60s',
      gioDangGoiY: '12:00 – 13:00 · 19:00 – 21:30',
      dinhDangManh: 'YouTube Shorts (dọc), Video podcast chuyên môn, Phỏng vấn trải nghiệm học viên / Bác sĩ tư vấn'
    }
  ],

  /** 12 bài mẫu cho lịch biên tập 4 tuần (M8.1) – 3 mảng: KSK Doanh nghiệp · Tuyển sinh · Phòng khám */
  phieu_lich: [
    {
      id: 'PL01',
      tuan: 1,
      thu: 'Thứ Hai',
      kenh: 'facebook',
      tangPheu: 'TOFU',
      mang: 'phongkham',
      chude: 'Nhận biết 4 tín hiệu sớm cảnh báo cơ thể suy nhược sau chuỗi ngày làm việc căng thẳng',
      khuonMa: 'K01_PK_PAS_TOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL02',
      tuan: 1,
      thu: 'Thứ Tư',
      kenh: 'tiktok',
      tangPheu: 'MOFU',
      mang: 'tuyensinh',
      chude: 'Xử lý tình huống giao tiếp: 3 cách trả lời lịch sự khi chưa nghe rõ đối tác nước ngoài nói',
      khuonMa: 'K12_TS_VIDEO45S_TOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL03',
      tuan: 1,
      thu: 'Thứ Sáu',
      kenh: 'zalo_oa',
      tangPheu: 'BOFU',
      mang: 'ksk',
      chude: 'Gói khám sức khỏe định kỳ cho doanh nghiệp: Dự toán linh hoạt theo quy mô nhân sự',
      khuonMa: 'K06_KSK_AIDA_BOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL04',
      tuan: 2,
      thu: 'Thứ Ba',
      kenh: 'tiktok',
      tangPheu: 'TOFU',
      mang: 'phongkham',
      chude: 'Tại sao tự đo huyết áp tại nhà thường bị lệch số? 3 lưu ý cần nhớ từ chuyên môn y tế',
      khuonMa: 'K04_PK_VIDEO30S_TOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL05',
      tuan: 2,
      thu: 'Thứ Năm',
      kenh: 'facebook',
      tangPheu: 'MOFU',
      mang: 'ksk',
      chude: 'Checklist 5 nội dung bắt buộc trong hồ sơ quản lý sức khỏe người lao động theo Thông tư',
      khuonMa: 'K07_KSK_4P_MOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL06',
      tuan: 2,
      thu: 'Thứ Bảy',
      kenh: 'youtube',
      tangPheu: 'BOFU',
      mang: 'tuyensinh',
      chude: 'Lộ trình lấy lại phản xạ tiếng Anh giao tiếp công sở trong 12 tuần cho người bận rộn',
      khuonMa: 'K10_TS_AIDA_BOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL07',
      tuan: 3,
      thu: 'Thứ Hai',
      kenh: 'zalo_oa',
      tangPheu: 'TOFU',
      mang: 'tuyensinh',
      chude: 'Tự đánh giá nhanh: Bài kiểm tra phản xạ từ vựng tiếng Anh văn phòng trong 3 phút',
      khuonMa: 'K09_TS_PAS_TOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL08',
      tuan: 3,
      thu: 'Thứ Tư',
      kenh: 'facebook',
      tangPheu: 'MOFU',
      mang: 'phongkham',
      chude: 'Quy trình tiếp đón và tầm soát sức khỏe ngoại trú: Tối ưu các bước để giảm thời gian chờ',
      khuonMa: 'K02_PK_AIDA_MOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL09',
      tuan: 3,
      thu: 'Thứ Sáu',
      kenh: 'tiktok',
      tangPheu: 'BOFU',
      mang: 'ksk',
      chude: 'Giải pháp tổ chức khám sức khỏe lưu động ngay tại văn phòng: Tiết kiệm ngày công',
      khuonMa: 'K08_KSK_VIDEO60S_BOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL10',
      tuan: 4,
      thu: 'Thứ Hai',
      kenh: 'facebook',
      tangPheu: 'TOFU',
      mang: 'ksk',
      chude: 'Chi phí cơ hội khi doanh nghiệp chưa chủ động tầm soát sức khỏe định kỳ cho đội ngũ',
      khuonMa: 'K05_KSK_PAS_MOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL11',
      tuan: 4,
      thu: 'Thứ Tư',
      kenh: 'facebook',
      tangPheu: 'MOFU',
      mang: 'tuyensinh',
      chude: 'Phương pháp học phản xạ tình huống thực chiến: Vì sao người đi làm tiết kiệm 50% thời gian',
      khuonMa: 'K11_TS_4P_MOFU',
      trangThai: 'nhap'
    },
    {
      id: 'PL12',
      tuan: 4,
      thu: 'Thứ Sáu',
      kenh: 'zalo_oa',
      tangPheu: 'BOFU',
      mang: 'phongkham',
      chude: 'Đăng ký khung giờ khám tầm soát tổng quát định kỳ tháng mới – Chủ động thời gian',
      khuonMa: 'K03_PK_4P_BOFU',
      trangThai: 'nhap'
    }
  ],

  /** 12 khuôn mẫu nội dung copywriting chuẩn hóa (M8.2) */
  khuon: [
    {
      ma: 'K01_PK_PAS_TOFU',
      ten: 'Phòng khám – PAS – Dấu hiệu cơ thể báo động',
      congThuc: 'PAS (Problem – Agitate – Solution)',
      mang: 'phongkham',
      tangPheu: 'TOFU',
      kenhUuTien: ['facebook', 'zalo_oa'],
      bien: ['{{trieu_chung}}', '{{he_qua}}', '{{giai_phap_tam_soat}}', '{{loi_khuyen_bac_si}}', '{{lien_he}}'],
      luuYYTe: 'Không chẩn đoán bệnh qua mạng; nhấn mạnh thăm khám trực tiếp để xác định nguyên nhân.',
      thanBai:
        'Bạn có đang thường xuyên gặp tình trạng {{trieu_chung}} mỗi khi tan ca?\n\n' +
        'Nhiều người thường chủ quan xem đây chỉ là mệt mỏi thoáng qua. Tuy nhiên, nếu kéo dài liên tục, điều này có thể dẫn đến {{he_qua}}, ảnh hưởng trực tiếp đến năng suất làm việc và chất lượng cuộc sống hàng ngày.\n\n' +
        'Đừng đợi đến khi cơ thể phát tín hiệu kiệt sức mới tìm giải pháp. Việc chủ động theo dõi và thực hiện {{giai_phap_tam_soat}} định kỳ giúp bạn nắm rõ các chỉ số sức khỏe của mình, từ đó điều chỉnh chế độ sinh hoạt kịp thời.\n\n' +
        '💡 Lời khuyên chuyên môn: {{loi_khuyen_bac_si}}\n\n' +
        'Để được tư vấn khung giờ thăm khám phù hợp, bạn có thể nhắn tin trực tiếp hoặc liên hệ {{lien_he}}.\n\n' +
        '---\n*Lưu ý: Nội dung mang tính chất tham khảo sức khỏe chung, không thay thế cho chẩn đoán y khoa chuyên sâu từ bác sĩ.*'
    },
    {
      ma: 'K02_PK_AIDA_MOFU',
      ten: 'Phòng khám – AIDA – Quy trình khám ngoại trú tinh gọn',
      congThuc: 'AIDA (Attention – Interest – Desire – Action)',
      mang: 'phongkham',
      tangPheu: 'MOFU',
      kenhUuTien: ['facebook'],
      bien: ['{{van_de_thoi_gian}}', '{{quy_trinh_kham}}', '{{uu_diem_trai_nghiem}}', '{{uu_dai}}', '{{han}}', '{{lien_he}}'],
      luuYYTe: 'Minh bạch các bước tiếp đón, không so sánh tiêu cực với cơ sở y tế khác.',
      thanBai:
        'Mỗi lần đi kiểm tra sức khỏe, điều khiến bạn băn khoăn nhất có phải là {{van_de_thoi_gian}}?\n\n' +
        'Thấu hiểu sự quý giá của thời gian đối với người đi làm bận rộn, quy trình thăm khám ngoại trú hiện nay đã được chuẩn hóa theo mô hình phân luồng khoa học: {{quy_trinh_kham}}.\n\n' +
        'Nhờ đó, bạn sẽ trải nghiệm không gian tiếp đón chu đáo, hồ sơ theo dõi rõ ràng và {{uu_diem_trai_nghiem}} mà không phải chờ đợi kéo dài qua nhiều khâu.\n\n' +
        'Đặc biệt trong tháng này: Hỗ trợ {{uu_dai}} cho khách hàng đặt hẹn trước đến hết ngày {{han}}.\n\n' +
        '👉 Đặt lịch hẹn trước ngay hôm nay qua {{lien_he}} để được hỗ trợ sắp xếp khung giờ thuận tiện.'
    },
    {
      ma: 'K03_PK_4P_BOFU',
      ten: 'Phòng khám – 4P – Gói tầm soát sức khỏe định kỳ',
      congThuc: '4P (Picture – Promise – Prove – Push)',
      mang: 'phongkham',
      tangPheu: 'BOFU',
      kenhUuTien: ['zalo_oa', 'facebook'],
      bien: ['{{hinh_dung_suc_khoe}}', '{{ten_goi_kham}}', '{{hang_muc_kiem_tra}}', '{{chuan_chat_luong}}', '{{uu_dai}}', '{{han}}', '{{lien_he}}'],
      luuYYTe: 'Ghi rõ danh mục kỹ thuật thuộc gói khám; không cam kết phát hiện 100% mọi mầm mống bệnh.',
      thanBai:
        'Hãy hình dung cảm giác an tâm khi bạn và gia đình luôn chủ động hiểu rõ tình trạng thể chất của mình, tràn đầy năng lượng cho công việc và tận hưởng cuộc sống: {{hinh_dung_suc_khoe}}.\n\n' +
        '{{ten_goi_kham}} được thiết kế nhằm mang lại bức tranh sức khỏe tổng quan và khách quan cho bạn, bao gồm các bước kiểm tra trọng điểm: {{hang_muc_kiem_tra}}.\n\n' +
        'Đội ngũ y bác sĩ giàu kinh nghiệm, hệ thống trang thiết bị đạt chuẩn y tế: {{chuan_chat_luong}} sẽ đồng hành tư vấn chi tiết từng chỉ số cùng bạn.\n\n' +
        'Ưu đãi dành cho khách hàng đăng ký sớm: {{uu_dai}} áp dụng đến hết ngày {{han}}.\n\n' +
        'Nhắn tin hoặc liên hệ {{lien_he}} để nhận tư vấn chi tiết danh mục gói khám ngay hôm nay.'
    },
    {
      ma: 'K04_PK_VIDEO30S_TOFU',
      ten: 'Phòng khám – Video 30s – Sai lầm khi tự kiểm tra chỉ số',
      congThuc: 'Kịch bản Video ngắn 30s (Hook – Agitate – Tip – CTA)',
      mang: 'phongkham',
      tangPheu: 'TOFU',
      kenhUuTien: ['tiktok', 'youtube'],
      bien: ['{{cau_hoi_hook}}', '{{sai_lam_thuong_gap}}', '{{cach_lam_dung}}', '{{loi_nhac_bac_si}}', '{{lien_he}}'],
      luuYYTe: 'Nội dung hướng dẫn thao tác đúng kỹ thuật cơ bản; không khuyến khích tự ý chỉnh liều thuốc.',
      thanBai:
        '[00:00 - 00:05] Hook (Cảnh quay cận bác sĩ/điều dưỡng): "{{cau_hoi_hook}} Bạn có đang tự đo huyết áp theo cách này không?"\n' +
        '[00:05 - 00:15] Agitate: "Rất nhiều người thường mắc lỗi {{sai_lam_thuong_gap}}, khiến chỉ số hiển thị lệch từ 10 đến 15 đơn vị so với thực tế!"\n' +
        '[00:15 - 00:25] Tip: "Hãy nhớ 3 bước chuẩn: Ngồi tựa lưng thoải mái 5 phút trước khi đo, đặt bao quấn ngang tầm tim và {{cach_lam_dung}}."\n' +
        '[00:25 - 00:30] CTA: "{{loi_nhac_bac_si}}. Lưu lại video này và follow kênh để cập nhật thêm các kiến thức chăm sóc sức khỏe chủ động nhé!"'
    },
    {
      ma: 'K05_KSK_PAS_MOFU',
      ten: 'KSK Doanh nghiệp – PAS – Áp lực tổ chức khám định kỳ',
      congThuc: 'PAS (Problem – Agitate – Solution)',
      mang: 'ksk',
      tangPheu: 'MOFU',
      kenhUuTien: ['facebook', 'zalo_oa'],
      bien: ['{{noi_lo_nhan_su}}', '{{rui_ro_gian_doan}}', '{{giai_phap_ksk}}', '{{quy_trinh_ho_tro}}', '{{lien_he}}'],
      luuYYTe: 'Đảm bảo đầy đủ danh mục khám bắt buộc theo quy định quản lý sức khỏe người lao động.',
      thanBai:
        'Là người phụ trách nhân sự hay ban giám đốc, bạn có đang đau đầu với bài toán: {{noi_lo_nhan_su}} mỗi mùa khám sức khỏe định kỳ?\n\n' +
        'Nếu không có kế hoạch phân ca chặt chẽ, việc đưa đón hàng trăm nhân sự đi khám tập trung có thể gây {{rui_ro_gian_doan}}, phát sinh chi phí di chuyển và ảnh hưởng trực tiếp đến tiến độ kinh doanh của công ty.\n\n' +
        'Giải pháp {{giai_phap_ksk}} được thiết kế chuyên biệt cho doanh nghiệp: linh hoạt tổ chức theo từng nhóm ca hoặc khám lưu động ngay tại văn phòng/nhà máy.\n\n' +
        'Quy trình tổ chức bao gồm: {{quy_trinh_ho_tro}}, báo cáo tổng hợp sức khỏe phân tầng rõ ràng giúp doanh nghiệp dễ dàng theo dõi.\n\n' +
        'Liên hệ ngay bộ phận tư vấn doanh nghiệp qua {{lien_he}} để nhận bảng đề xuất chi tiết theo quy mô công ty bạn.'
    },
    {
      ma: 'K06_KSK_AIDA_BOFU',
      ten: 'KSK Doanh nghiệp – AIDA – Đề xuất gói khám linh hoạt',
      congThuc: 'AIDA (Attention – Interest – Desire – Action)',
      mang: 'ksk',
      tangPheu: 'BOFU',
      kenhUuTien: ['zalo_oa', 'facebook'],
      bien: ['{{thong_diep_dau}}', '{{danh_muc_tiet_kiem}}', '{{gia_tri_cho_doanh_nghiep}}', '{{chinh_sach_uu_dai}}', '{{han}}', '{{lien_he}}'],
      luuYYTe: 'Gói khám tuân thủ quy chuẩn của Bộ Y tế về khám sức khỏe định kỳ cho người lao động.',
      thanBai:
        'Tối ưu ngân sách phúc lợi nhưng vẫn đảm bảo chất lượng tầm soát sức khỏe toàn diện cho người lao động: {{thong_diep_dau}}!\n\n' +
        'Gói khám sức khỏe doanh nghiệp được thiết kế theo dạng module hóa: {{danh_muc_tiet_kiem}}, giúp công ty dễ dàng phân bổ ngân sách phù hợp cho từng khối phòng ban.\n\n' +
        'Doanh nghiệp nhận được: Báo cáo y tế tổng quan phân loại sức khỏe nhân viên, tư vấn hậu kiểm chuyên sâu và {{gia_tri_cho_doanh_nghiep}}.\n\n' +
        'Chính sách hỗ trợ đặc quyền mùa này: {{chinh_sach_uu_dai}} khi xác nhận lịch khám trước ngày {{han}}.\n\n' +
        'Quý doanh nghiệp vui lòng liên hệ hotline/Zalo phụ trách KSK: {{lien_he}} để nhận báo giá dự toán trong vòng 2 giờ làm việc.'
    },
    {
      ma: 'K07_KSK_4P_MOFU',
      ten: 'KSK Doanh nghiệp – 4P – Tiết kiệm thời gian và ngày công',
      congThuc: '4P (Picture – Promise – Prove – Push)',
      mang: 'ksk',
      tangPheu: 'MOFU',
      kenhUuTien: ['facebook'],
      bien: ['{{hinh_anh_to_chuc}}', '{{cam_ket_thoi_gian}}', '{{nang_luc_thuc_te}}', '{{chinh_sach_dong_hanh}}', '{{lien_he}}'],
      luuYYTe: 'Cam kết về năng lực tổ chức, quy chuẩn tiếp đón và trả kết quả bảo mật theo quy định.',
      thanBai:
        'Một ngày khám sức khỏe diễn ra trật tự, nhanh chóng, nhân viên hoàn thành kiểm tra đầy đủ danh mục mà không làm gián đoạn dây chuyền làm việc: {{hinh_anh_to_chuc}}.\n\n' +
        'Chúng tôi mang đến giải pháp tổ chức khám chuyên nghiệp với cam kết: {{cam_ket_thoi_gian}}, tối ưu từng điểm chạm từ khâu lấy mẫu đến tư vấn bác sĩ.\n\n' +
        'Năng lực triển khai đã được khẳng định qua: {{nang_luc_thuc_te}} với hệ thống hồ sơ số hóa tiện lợi cho cả phòng nhân sự và người lao động.\n\n' +
        'Đồng hành cùng sức khỏe doanh nghiệp của bạn: {{chinh_sach_dong_hanh}}.\n\n' +
        'Gửi thông tin quy mô nhân sự qua {{lien_he}} để nhận ngay phương án tổ chức phù hợp.'
    },
    {
      ma: 'K08_KSK_VIDEO60S_BOFU',
      ten: 'KSK Doanh nghiệp – Video 60s – Một ngày khám lưu động',
      congThuc: 'Kịch bản Video 60s (Toàn cảnh hiện trường – Phân tích – Đánh giá – CTA)',
      mang: 'ksk',
      tangPheu: 'BOFU',
      kenhUuTien: ['tiktok', 'youtube'],
      bien: ['{{dia_diem_to_chuc}}', '{{so_luong_nhan_su}}', '{{khau_kiem_tra_chinh}}', '{{chia_se_hr}}', '{{lien_he}}'],
      luuYYTe: 'Bảo mật danh tính và hồ sơ bệnh án của nhân viên trong video; chỉ quay không gian chung.',
      thanBai:
        '[00:00 - 00:10] Mở đầu hiện trường: "Hôm nay chúng tôi có mặt tại {{dia_diem_to_chuc}} để triển khai buổi khám sức khỏe định kỳ cho hơn {{so_luong_nhan_su}} nhân sự."\n' +
        '[00:10 - 00:25] Quy trình phân luồng: "Xe khám chuyên dụng và trang thiết bị được bố trí ngay tại sảnh công ty từ 6h30 sáng. Nhân viên lần lượt qua các khu vực: {{khau_kiem_tra_chinh}} mà không cần di chuyển xa."\n' +
        '[00:25 - 00:45] Phỏng vấn nhanh đại diện nhân sự: "{{chia_se_hr}} - Quy trình khoa học giúp công ty tiết kiệm trọn vẹn 1 ngày làm việc so với việc đi khám tự túc."\n' +
        '[00:45 - 00:60] Kêu gọi hành động: "Doanh nghiệp của bạn đã có kế hoạch khám sức khỏe định kỳ năm nay chưa? Nhắn ngay cho chúng tôi qua {{lien_he}} để khảo sát địa điểm miễn phí!"'
    },
    {
      ma: 'K09_TS_PAS_TOFU',
      ten: 'Tuyển sinh – PAS – Rào cản tiếng Anh trong công việc',
      congThuc: 'PAS (Problem – Agitate – Solution)',
      mang: 'tuyensinh',
      tangPheu: 'TOFU',
      kenhUuTien: ['facebook', 'zalo_oa'],
      bien: ['{{tinh_huong_ngap_ngung}}', '{{co_hoi_bo_lo}}', '{{phuong_phap_hoc}}', '{{thoi_gian_linh_hoat}}', '{{lien_he}}'],
      luuYYTe: 'Không áp dụng quy chế y tế.',
      thanBai:
        'Bạn có từng rơi vào tình huống: Trong đầu đã nghĩ ra ý tưởng bằng tiếng Việt nhưng khi cần phát biểu trong cuộc họp với sếp hay đối tác nước ngoài thì lại {{tinh_huong_ngap_ngung}}?\n\n' +
        'Cảm giác lúng túng đó không chỉ khiến bạn thiếu tự tin mà còn vô tình làm {{co_hoi_bo_lo}}, từ các dự án quan trọng đến lộ trình thăng tiến xứng đáng với năng lực chuyên môn.\n\n' +
        'Vấn đề không phải do bạn thiếu từ vựng hay ngữ pháp, mà là thiếu môi trường rèn luyện phản xạ thực chiến hàng ngày. Phương pháp {{phuong_phap_hoc}} tập trung bẻ khóa phản xạ nghe nói theo tình huống công sở thực tế.\n\n' +
        'Lịch học được thiết kế riêng cho người đi làm: {{thoi_gian_linh_hoat}}, thực hành trực tiếp 1-1 không áp lực bài vở lý thuyết.\n\n' +
        'Nhận bài kiểm tra phản xạ đầu vào miễn phí và lộ trình học cá nhân hóa tại {{lien_he}}.'
    },
    {
      ma: 'K10_TS_AIDA_BOFU',
      ten: 'Tuyển sinh – AIDA – Khóa phản xạ tiếng Anh công sở',
      congThuc: 'AIDA (Attention – Interest – Desire – Action)',
      mang: 'tuyensinh',
      tangPheu: 'BOFU',
      kenhUuTien: ['facebook', 'youtube'],
      bien: ['{{thong_diep_chuong_trinh}}', '{{noi_dung_thuc_chien}}', '{{ket_qua_dau_ra}}', '{{hoc_bong_uu_dai}}', '{{han}}', '{{lien_he}}'],
      luuYYTe: 'Không áp dụng quy chế y tế.',
      thanBai:
        'Chỉ sau 12 tuần: Tự tin thuyết trình, đàm phán và trao đổi email công việc trôi chảy bằng tiếng Anh – {{thong_diep_chuong_trinh}}!\n\n' +
        'Khóa học được xây dựng hoàn toàn từ các tình huống công sở thực tế: {{noi_dung_thuc_chien}}, giúp bạn nói tiếng Anh tự nhiên như phản xạ bản năng mà không cần dịch từng từ trong đầu.\n\n' +
        'Hơn 85% học viên sau khóa học đã đạt được: {{ket_qua_dau_ra}}, tự tin làm việc trong môi trường quốc tế hoặc chuyển tiếp công việc mong muốn.\n\n' +
        'Ưu đãi đặc biệt cho nhóm đăng ký sớm trong tuần: {{hoc_bong_uu_dai}} áp dụng đến ngày {{han}}.\n\n' +
        '👉 Đăng ký nhận lịch học thử trải nghiệm 01 buổi miễn phí ngay tại {{lien_he}}.'
    },
    {
      ma: 'K11_TS_4P_MOFU',
      ten: 'Tuyển sinh – 4P – Phương pháp học cho người bận rộn',
      congThuc: '4P (Picture – Promise – Prove – Push)',
      mang: 'tuyensinh',
      tangPheu: 'MOFU',
      kenhUuTien: ['facebook'],
      bien: ['{{hinh_anh_thanh_cong}}', '{{loi_hua_lo_trinh}}', '{{minh_chung_phuong_phap}}', '{{chinh_sach_dong_hanh}}', '{{lien_he}}'],
      luuYYTe: 'Không áp dụng quy chế y tế.',
      thanBai:
        'Hãy tưởng tượng bạn bước vào phòng họp quốc tế với phong thái tự tin, phản hồi các câu hỏi phỏng vấn hay thảo luận dự án một cách lưu loát và gãy gọn: {{hinh_anh_thanh_cong}}.\n\n' +
        'Chúng tôi cam kết đồng hành cùng bạn với lộ trình tối ưu: {{loi_hua_lo_trinh}}, học đúng trọng tâm những gì công việc bạn cần, không dàn trải lý thuyết hàn lâm.\n\n' +
        'Phương pháp đã được chứng minh hiệu quả qua: {{minh_chung_phuong_phap}}, phù hợp với lịch trình bận rộn của người vừa đi làm vừa học.\n\n' +
        'Chính sách đồng hành học tập: {{chinh_sach_dong_hanh}}.\n\n' +
        'Liên hệ ngay {{lien_he}} để được cố vấn học tập kiểm tra trình độ và tư vấn khung giờ phù hợp.'
    },
    {
      ma: 'K12_TS_VIDEO45S_TOFU',
      ten: 'Tuyển sinh – Video 45s – 1 phút sửa lỗi phát âm công sở',
      congThuc: 'Kịch bản Video ngắn 45s (Hook – Sửa sai – Luyện tập – CTA)',
      mang: 'tuyensinh',
      tangPheu: 'TOFU',
      kenhUuTien: ['tiktok', 'youtube'],
      bien: ['{{tu_vung_hay_sai}}', '{{cach_phat_am_sai}}', '{{cach_phat_am_dung}}', '{{cau_vi_du}}', '{{lien_he}}'],
      luuYYTe: 'Không áp dụng quy chế y tế.',
      thanBai:
        '[00:00 - 00:08] Hook: "Dừng lại 1 phút nếu bạn vẫn đang phát âm từ {{tu_vung_hay_sai}} theo kiểu {{cach_phat_am_sai}}!"\n' +
        '[00:08 - 00:20] Phân tích lỗi: "Đây là một trong những từ khóa cực kỳ phổ biến trong giao tiếp công sở, nhưng rất nhiều bạn nuốt mất âm đuôi hoặc nhấn sai trọng âm."\n' +
        '[00:20 - 00:35] Hướng dẫn phát âm chuẩn: "Đặt khẩu hình miệng thế này nhé: {{cach_phat_am_dung}}. Hãy thử đọc câu hoàn chỉnh: {{cau_vi_du}}."\n' +
        '[00:35 - 00:45] CTA: "Thấy hữu ích thì thả tim và lưu lại để luyện tập nhé! Nhắn tin cho New You tại {{lien_he}} để nhận cẩm nang 50 từ vựng công sở hay phát âm sai nhất!"'
    }
  ]
};

if (typeof window !== 'undefined') window.MAU_MARKETING = MAU_MARKETING;
if (typeof module !== 'undefined') {
  module.exports = MAU_MARKETING;
}
