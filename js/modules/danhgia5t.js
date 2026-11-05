/**
 * SHIN AIOS v2 – Module: Đánh Giá Văn Hóa Hành Vi 5T
 * Chuẩn hóa 5 Tiêu chí cốt lõi – Tham chiếu phương pháp luận Bộ 83 Tiêu chí Chất lượng Bộ Y tế
 * Thiết kế chuẩn công thái học SHIN AIOS: Hero card, 2 phân hệ (Thư viện & Thực hiện đánh giá),
 * Thuật toán bậc thang lũy tiến, Biểu đồ Radar 5 trục và In phiếu tổng hợp A4.
 */

const ModuleDanhGia5T = (function() {
  const ma = 'danhgia5t';
  const ten = 'Đánh Giá 5T';
  const bieuTuong = '⭐';
  const paletteMacDinh = 'crimson';

  // 1. DỮ LIỆU CHUẨN 76 TIỂU MỤC 5 TIÊU CHÍ CỐT LÕI
  const TIEU_CHI = [
    {
      id: 1,
      ma: 'TC1',
      ten: 'TRUNG THỰC',
      tenEn: 'Integrity',
      icon: '🛡️',
      mau: 'var(--c-red)',
      moTa: 'Đảm bảo dữ liệu trung thực, báo cáo chuẩn xác, dũng cảm đối diện sai sót và liêm chính trong quyền lợi.',
      tongTM: 15,
      nguong: { m2: 6, m3: 11, m4: 14, m5: 15 },
      tieuMuc: [
        { ma: '1.1', muc: 'M1', noiDung: 'Không làm giả hồ sơ, sửa số liệu, lập chứng từ khống hoặc báo cáo sai sự thật.', hdNV: 'Không có biên bản kỷ luật hoặc nghi vấn gian lận dữ liệu.', cachQL: 'Rà soát sổ kỷ luật, biên bản kiểm tra chéo nội bộ.' },
        { ma: '1.2', muc: 'M1', noiDung: 'Không giấu giếm sự cố chuyên môn/nghiệp vụ; không đổ lỗi, vu khống cho người khác khi xảy ra sai sót cá nhân.', hdNV: 'Lịch sử xử lý sự cố minh bạch; không có biên bản phản ánh thái độ thoái thác.', cachQL: 'Kiểm tra biên bản xử lý sự cố, ý kiến phản hồi tại khoa/phòng.' },
        { ma: '1.3', muc: 'M1', noiDung: 'Không nhận "phong bì", hoa hồng ngầm, quà biếu trái quy định hoặc lợi dụng vị trí để tư lợi cá nhân.', hdNV: 'Cam kết liêm chính; không bị khiếu nại qua đường dây nóng/hòm thư góp ý.', cachQL: 'Kiểm tra kênh tiếp nhận phản ánh, khảo sát người bệnh/đối tác.' },
        { ma: '1.4', muc: 'M2', noiDung: 'Báo cáo định kỳ đúng hạn, số liệu có nguồn gốc trích xuất thực tế, không sao chép máy móc của kỳ trước.', hdNV: 'File dữ liệu gốc (phần mềm HIS/ERP/sổ ghi chép công việc ban đầu).', cachQL: 'Chọn ngẫu nhiên 1-2 báo cáo đối chiếu với phần mềm nghiệp vụ.' },
        { ma: '1.5', muc: 'M2', noiDung: 'Khi được chỉ ra sai sót kèm căn cứ, biết lắng nghe, tiếp thu và ký nhận lỗi, không cãi cùn, bao biện.', hdNV: 'Biên bản ghi nhận sai sót hoặc phản hồi tiếp thu trên hệ thống/email.', cachQL: 'Đánh giá thái độ thực tế của nhân sự khi Quản lý phản hồi trực tiếp.' },
        { ma: '1.6', muc: 'M2', noiDung: 'Không tung tin đồn vô căn cứ, không bàn tán sai lệch gây hoang mang hoặc chia rẽ nội bộ.', hdNV: 'Không có phản ánh về việc phát ngôn thiếu trung thực nơi làm việc.', cachQL: 'Lắng nghe ghi nhận từ tập thể khoa/phòng.' },
        { ma: '1.7', muc: 'M3', noiDung: '100% hồ sơ, bệnh án, sổ sách, bảng kê công việc ghi nhận đúng thực tế, truy xuất được nguồn gốc rõ ràng.', hdNV: 'Mã hồ sơ/bệnh án lưu trữ; chứng từ có đầy đủ chữ ký hợp lệ.', cachQL: 'Kiểm tra ngẫu nhiên 3-5 hồ sơ thực tế của nhân viên trong kỳ.' },
        { ma: '1.8', muc: 'M3', noiDung: 'Báo cáo chủ động nêu rõ các chỉ số chưa đạt, công việc trễ hạn/tồn đọng mà không cần cấp trên truy vấn.', hdNV: 'Báo cáo tuần/tháng có mục "Tồn đọng / Rủi ro / Chỉ số chưa đạt" minh bạch.', cachQL: 'Rà soát nội dung các bản báo cáo định kỳ của nhân viên.' },
        { ma: '1.9', muc: 'M3', noiDung: 'Minh bạch tuyệt đối về giờ công, chấm công, thanh toán chi phí công tác và định mức vật tư tiêu hao.', hdNV: 'Bảng chấm công, phiếu đề xuất vật tư khớp 100% với lịch làm việc thực tế.', cachQL: 'Đối chiếu dữ liệu vân tay/chấm công và phiếu xuất vật tư.' },
        { ma: '1.10', muc: 'M3', noiDung: 'Tự giác lập phiếu báo cáo sự cố (Incident Report) ngay khi phát hiện sai sót cá nhân trước khi người khác tìm ra.', hdNV: 'Phiếu báo cáo sự cố tự nguyện hoặc tin nhắn/email báo cáo Quản lý kịp thời.', cachQL: 'Kiểm tra sổ báo cáo sự cố tự nguyện. (Nếu kỳ này không có lỗi thì tính Đạt).' },
        { ma: '1.11', muc: 'M3', noiDung: 'Chủ động khai báo xung đột lợi ích hoặc nộp lại quà tặng/lợi ích ngoài quy chuẩn theo đúng quy định tổ chức.', hdNV: 'Phiếu khai báo xung đột lợi ích hoặc biên bản bàn giao quà tặng công.', cachQL: 'Kiểm tra sổ theo dõi của đơn vị. (Nếu không phát sinh thì tính Đạt).' },
        { ma: '1.12', muc: 'M4', noiDung: 'Chủ động thiết lập cơ chế tự kiểm tra chéo (Self-check / Peer-check) để triệt tiêu sai lệch số liệu trước khi trình duyệt.', hdNV: 'File bảng kiểm tự soát lỗi cá nhân hoặc lịch sử đối soát số liệu với đồng nghiệp.', cachQL: 'Báo cáo trình duyệt của nhân sự gần như đạt chuẩn tuyệt đối, không có lỗi số liệu.' },
        { ma: '1.13', muc: 'M4', noiDung: 'Sau mỗi sự cố/sai sót phát sinh, chủ động viết phân tích nguyên nhân gốc rễ (RCA) và giải pháp phòng ngừa gửi Quản lý.', hdNV: 'Bản phân tích nguyên nhân (5-Why/Fishbone) và giải pháp khắc phục bằng văn bản.', cachQL: 'Đánh giá chất lượng và tính khả thi của bản phân tích nguyên nhân.' },
        { ma: '1.14', muc: 'M4', noiDung: 'Dũng cảm lên tiếng bảo vệ sự thật và quy trình chuẩn khi phát hiện hành vi làm tắt, làm sai gây rủi ro cho tập thể.', hdNV: 'Biên bản họp có ý kiến đóng góp hoặc văn bản/tin nhắn cảnh báo gửi Quản lý.', cachQL: 'Quản lý ghi nhận tính thẳng thắn, chính trực qua thực tế điều hành.' },
        { ma: '1.15', muc: 'M5', noiDung: 'Xây dựng thành công công cụ/quy trình giúp đơn vị minh bạch hóa số liệu hoặc truyền cảm hứng về văn hóa "Học hỏi từ sai lầm".', hdNV: 'Mẫu biểu/Quy trình đối soát do nhân sự khởi xướng đang áp dụng chung cho bộ phận.', cachQL: 'Đánh giá hiệu quả giảm thiểu sai lệch dữ liệu của toàn bộ phận.' }
      ]
    },
    {
      id: 2,
      ma: 'TC2',
      ten: 'TRÁCH NHIỆM',
      tenEn: 'Responsibility',
      icon: '🎯',
      mau: '#0284c7',
      moTa: 'Đảm bảo tiến độ, chất lượng công việc, giải quyết vấn đề đến cùng, có trách nhiệm giải trình và tư duy làm chủ.',
      tongTM: 15,
      nguong: { m2: 6, m3: 11, m4: 14, m5: 15 },
      tieuMuc: [
        { ma: '2.1', muc: 'M1', noiDung: 'Không tự ý rời bỏ vị trí trực/làm việc; không bỏ dở công việc được giao khi chưa bàn giao hợp lệ.', hdNV: 'Bảng chấm công, sổ giao ban không có ghi nhận vi phạm bỏ vị trí.', cachQL: 'Kiểm tra camera, sổ trực, kiểm tra hiện trường đột xuất.' },
        { ma: '2.2', muc: 'M1', noiDung: 'Không làm việc cẩu thả gây thiệt hại tài sản hoặc gây hậu quả nguy hiểm cho người bệnh/khách hàng.', hdNV: 'Không có biên bản sự cố nghiêm trọng do tắc trách, thiếu cẩn trọng cá nhân.', cachQL: 'Rà soát hồ sơ theo dõi chất lượng và an toàn của khoa/phòng.' },
        { ma: '2.3', muc: 'M1', noiDung: 'Không hành xử theo kiểu "Đùn đẩy – Đây không phải việc của tôi", đẩy người bệnh/khách hàng/đồng nghiệp đi lòng vòng.', hdNV: 'Không có phàn nàn từ khách hàng hoặc đơn vị phối hợp về thái độ đùn việc.', cachQL: 'Kiểm tra qua kênh góp ý và phản hồi nội bộ liên khoa/phòng.' },
        { ma: '2.4', muc: 'M2', noiDung: 'Đi làm đúng giờ, tuân thủ đúng trang phục, bảo hộ lao động và quy định trật tự nội vụ 5S cơ bản nơi làm việc.', hdNV: 'Dữ liệu vân tay chấm công; góc làm việc/buồng bệnh gọn gàng, sạch sẽ.', cachQL: 'Báo cáo chuyên cần từ Nhân sự và kiểm tra 5S định kỳ.' },
        { ma: '2.5', muc: 'M2', noiDung: 'Hoàn thành từ 85% trở lên khối lượng công việc theo đúng bản mô tả công việc (JD) được phân công.', hdNV: 'Bảng tổng hợp kết quả công việc cá nhân trong kỳ đánh giá.', cachQL: 'Đối chiếu với phân công nhiệm vụ và khối lượng thực tế của khoa.' },
        { ma: '2.6', muc: 'M2', noiDung: 'Sử dụng, bảo quản trang thiết bị, máy móc đúng quy trình, tắt điện/nước khi rời phòng để chống lãng phí.', hdNV: 'Khu vực phụ trách không để máy móc chạy vô ích, không làm thất thoát vật tư.', cachQL: 'Kiểm tra thực tế tại buồng làm việc/kho phòng phụ trách.' },
        { ma: '2.7', muc: 'M3', noiDung: 'Đạt tỷ lệ ≥ 95% đầu việc đúng hạn (On-time) và đạt chuẩn chất lượng đầu ra theo quy trình SOP mà không cần nhắc nhở.', hdNV: 'Báo cáo KPI cá nhân hoặc bảng theo dõi tiến độ công việc đạt ≥ 95%.', cachQL: 'Kiểm tra tiến độ thực tế trên phần mềm quản lý công việc/sổ giao ban.' },
        { ma: '2.8', muc: 'M3', noiDung: 'Trách nhiệm đến cùng ("Closed-loop"): Khi nhận yêu cầu/sự vụ, theo sát xử lý và phản hồi kết quả cuối cùng cho người yêu cầu.', hdNV: 'Tin nhắn/Email xác nhận hoàn tất vụ việc gửi người yêu cầu (đóng hồ sơ kín).', cachQL: 'Kiểm tra ngẫu nhiên 2-3 ca bệnh/vụ việc nhân sự thụ lý xem đã dứt điểm chưa.' },
        { ma: '2.9', muc: 'M3', noiDung: 'Bàn giao ca trực/công việc chi tiết, ghi nhận rõ ràng các tồn đọng và dặn dò phương án xử lý cho người nhận ca sau.', hdNV: 'Sổ giao ban ca / Email bàn giao việc chi tiết có chữ ký/xác nhận người nhận.', cachQL: 'Kiểm tra tính đầy đủ, rõ ràng của sổ bàn giao ca trực.' },
        { ma: '2.10', muc: 'M3', noiDung: 'Khi công việc chung gặp trục trặc, chủ động nhận phần trách nhiệm của mình và đề xuất giải pháp thay vì viện lý do khách quan.', hdNV: 'Biên bản họp giải trình tập trung vào "Hành động khắc phục" của bản thân.', cachQL: 'Đánh giá thái độ nhận trách nhiệm trong các cuộc họp điều hành.' },
        { ma: '2.11', muc: 'M3', noiDung: 'Chủ động đứng ra xử lý các công việc ở "vùng xám giao thoa" (chưa phân định rõ trách nhiệm của ai) để việc chung không tắc nghẽn.', hdNV: 'Liệt kê ít nhất 1-2 sự vụ liên khoa/phòng mà bản thân đã chủ động hỗ trợ giải quyết.', cachQL: 'Quản lý xác nhận trường hợp phối hợp thực tế với các bên liên quan.' },
        { ma: '2.12', muc: 'M4', noiDung: 'Nhận diện và cảnh báo sớm nguy cơ chậm tiến độ/quá tải trước ít nhất 24h-48h kèm theo Phương án dự phòng (Plan B).', hdNV: 'Tin nhắn/Báo cáo gửi Quản lý nêu rõ nguy cơ và đề xuất giải pháp xử lý sớm.', cachQL: 'Xác nhận nhân viên luôn báo trước giải pháp chứ không chờ trễ việc mới báo.' },
        { ma: '2.13', muc: 'M4', noiDung: 'Đưa ra giải pháp cải tiến quy trình phối hợp hoặc sáng kiến tiết kiệm chi phí/thời gian đã được đưa vào áp dụng thực tế.', hdNV: 'Đề xuất cải tiến/tiết kiệm kèm số liệu chứng minh hiệu quả thực tế tại bộ phận.', cachQL: 'Đánh giá giá trị thực tế của giải pháp đối với vận hành của khoa/phòng.' },
        { ma: '2.14', muc: 'M4', noiDung: 'Hoàn thành vượt tiến độ các nhiệm vụ khẩn cấp, khó khăn và đạt chất lượng cao hơn mức kỳ vọng ban đầu.', hdNV: 'Minh chứng kết quả các nhiệm vụ đột xuất/khó được khen thưởng hoặc ghi nhận.', cachQL: 'Rà soát lịch sử giao việc đột xuất/khẩn cấp trong kỳ.' },
        { ma: '2.15', muc: 'M5', noiDung: 'Tư duy làm chủ toàn diện: Được cấp trên tin tưởng ủy quyền tự quyết định xử lý các sự vụ phức tạp khi vắng mặt lãnh đạo.', hdNV: 'Quyết định phân quyền hoặc kết quả xử lý thành công ca khó khi trực chỉ huy/đầu mối.', cachQL: 'Lãnh đạo đơn vị xác nhận năng lực làm chủ và tính tự chịu trách nhiệm.' }
      ]
    },
    {
      id: 3,
      ma: 'TC3',
      ten: 'THẤU CẢM',
      tenEn: 'Empathy',
      icon: '❤️',
      mau: '#0f766e',
      moTa: 'Lắng nghe chân thành, thấu hiểu nỗi đau/khó khăn của người bệnh/khách hàng, kiểm soát cảm xúc và ứng xử nhân văn.',
      tongTM: 15,
      nguong: { m2: 7, m3: 11, m4: 14, m5: 15 },
      tieuMuc: [
        { ma: '3.1', muc: 'M1', noiDung: 'Không có thái độ thờ ơ, lạnh lùng, vô cảm trước sự lo lắng, đau đớn của người bệnh/khách hàng và đồng đội.', hdNV: 'Không có phản ánh bức xúc qua đường dây nóng/hòm thư về thái độ vô cảm.', cachQL: 'Kiểm tra sổ khiếu nại, đường dây nóng, phiếu khảo sát không hài lòng.' },
        { ma: '3.2', muc: 'M1', noiDung: 'Tuyệt đối không quát tháo, xưng hô trịch thượng, dùng ngôn từ miệt thị hoặc xúc phạm nhân phẩm người đối diện.', hdNV: 'Không vi phạm quy tắc ứng xử; không có biên bản sự vụ về xúc phạm người khác.', cachQL: 'Giám sát qua camera, phản ánh hiện trường và giám sát trực tiếp.' },
        { ma: '3.3', muc: 'M1', noiDung: 'Không phân biệt đối xử giữa người bệnh bảo hiểm/dịch vụ, người giàu/nghèo, người quen/người không quen.', hdNV: 'Phục vụ bình đẳng, công bằng đúng theo thứ tự ưu tiên chuyên môn.', cachQL: 'Kiểm tra ngẫu nhiên quy trình tiếp đón và phục vụ tại hiện trường.' },
        { ma: '3.4', muc: 'M1', noiDung: 'Không vừa giao tiếp/tư vấn cho khách hàng vừa bấm điện thoại nhắn tin làm việc riêng cá nhân.', hdNV: 'Tuân thủ quy định sử dụng thiết bị cá nhân trong giờ làm việc.', cachQL: 'Quan sát tác phong trực tiếp tại các vị trí tiếp xúc người bệnh/khách hàng.' },
        { ma: '3.5', muc: 'M2', noiDung: 'Thực hiện đúng quy chuẩn chào hỏi ban đầu: Ánh mắt thân thiện, nụ cười nhẹ, xưng hô chuẩn mực và lịch sự.', hdNV: 'Duy trì đều đặn tại vị trí làm việc theo quy chuẩn văn hóa đơn vị.', cachQL: 'Quan sát ngẫu nhiên tối thiểu 3 lần tiếp xúc của nhân viên.' },
        { ma: '3.6', muc: 'M2', noiDung: 'Biết lắng nghe trọn vẹn câu hỏi/trình bày của người khác, không ngắt lời thô bạo khi họ đang nói.', hdNV: 'Kiên nhẫn lắng nghe hết ý kiến trước khi đưa ra hướng dẫn phản hồi.', cachQL: 'Quan sát cách giao tiếp của nhân viên trong các ca làm việc đông khách.' },
        { ma: '3.7', muc: 'M2', noiDung: 'Biết kiểm soát cảm xúc cơ bản; không mang bực tức chuyện cá nhân trút lên người bệnh hoặc đồng nghiệp.', hdNV: 'Giữ được bình tĩnh trong môi trường áp lực công việc hàng ngày.', cachQL: 'Ghi nhận phản hồi từ các đồng nghiệp cùng kíp làm việc.' },
        { ma: '3.8', muc: 'M3', noiDung: 'Tư vấn, hướng dẫn bằng ngôn ngữ bình dân, dễ hiểu, phù hợp tâm lý từng đối tượng (người già, người ít học, người lo âu).', hdNV: 'Người bệnh/khách hàng hiểu rõ ngay lần đầu, không bị bối rối hay phải hỏi lại nhiều lần.', cachQL: 'Phỏng vấn nhanh ngẫu nhiên 2-3 người vừa được nhân viên tư vấn.' },
        { ma: '3.9', muc: 'M3', noiDung: 'Luôn chủ động hỏi thăm mức độ đau đớn, lo lắng hoặc sự bất tiện của người bệnh để hỗ trợ can thiệp kịp thời.', hdNV: 'Hồ sơ chăm sóc có ghi nhận đánh giá mức độ đau và hành động hỗ trợ cụ thể.', cachQL: 'Kiểm tra phiếu chăm sóc hoặc hỏi trực tiếp người bệnh tại buồng.' },
        { ma: '3.10', muc: 'M3', noiDung: 'Bảo vệ tuyệt đối sự riêng tư, kín đáo và lòng tự trọng của người bệnh khi thăm khám, làm thủ thuật hoặc giao dịch nhạy cảm.', hdNV: 'Kéo rèm/đóng cửa khi khám; không bàn tán thông tin cá nhân khách nơi công cộng.', cachQL: 'Kiểm tra trực tiếp thao tác chuẩn bị và ý thức bảo mật tại hiện trường.' },
        { ma: '3.11', muc: 'M3', noiDung: 'Giữ được giọng nói điềm tĩnh, nhã nhặn, thấu hiểu ngay cả khi người bệnh/thân nhân đang bức xúc, to tiếng do hiểu lầm.', hdNV: 'Xử lý êm thấm các tình huống khách phàn nàn tại chỗ mà không để leo thang xung đột.', cachQL: 'Quản lý quan sát hoặc xác nhận từ kíp trực về các ca căng thẳng đã xử lý tốt.' },
        { ma: '3.12', muc: 'M4', noiDung: 'Nhận diện sớm các dấu hiệu khủng hoảng tâm lý của khách hàng/đồng nghiệp để chủ động động viên, chia sẻ kịp thời.', hdNV: 'Minh chứng 1-2 trường hợp thực tế đã hỗ trợ tâm lý thành công cho người bệnh/bạn đồng nghiệp.', cachQL: 'Xác thực tình huống qua người liên quan hoặc hồ sơ ghi nhận.' },
        { ma: '3.13', muc: 'M4', noiDung: 'Có kỹ năng "hạ nhiệt" (De-escalation) xuất sắc, giải tỏa êm đẹp các vụ khiếu nại gay gắt thành sự thông cảm và hợp tác.', hdNV: 'Biên bản hòa giải thành công hoặc phản hồi cảm kích từ khách hàng khó tính sau vụ việc.', cachQL: 'Quản lý trực tiếp thẩm định hiệu quả xử lý tình huống khiếu nại của nhân sự.' },
        { ma: '3.14', muc: 'M4', noiDung: 'Đóng vai trò cầu nối hòa giải, gắn kết khi xuất hiện mâu thuẫn, bất đồng quan điểm giữa các thành viên trong tập thể.', hdNV: 'Được đồng nghiệp tín nhiệm, không tham gia bè phái, chủ động kéo tập thể lại gần nhau.', cachQL: 'Tham khảo đánh giá chéo từ các thành viên trong khoa/phòng.' },
        { ma: '3.15', muc: 'M5', noiDung: 'Nhận được nhiều thư khen/lời tri ân sâu sắc từ khách hàng về tấm lòng nhân ái; được chọn làm Mentor đào tạo văn hóa thấu cảm.', hdNV: 'Bản sao thư cảm ơn đích danh hoặc quyết định phân công kèm cặp văn hóa ứng xử cho nhân sự mới.', cachQL: 'Đối chiếu thư khen chính thức và dữ liệu khảo sát hài lòng người bệnh đạt 100%.' }
      ]
    },
    {
      id: 4,
      ma: 'TC4',
      ten: 'TẬN TÂM',
      tenEn: 'Dedication',
      icon: '🔥',
      mau: '#d97706',
      moTa: 'Làm việc chu đáo, tỉ mỉ, phục vụ vượt kỳ vọng, dấn thân vì tập thể và không ngại khó khăn.',
      tongTM: 16,
      nguong: { m2: 7, m3: 12, m4: 15, m5: 16 },
      tieuMuc: [
        { ma: '4.1', muc: 'M1', noiDung: 'Không làm tắt, bỏ qua quy trình chuyên môn/bảng kiểm an toàn gây rủi ro tính mạng hoặc chất lượng dịch vụ.', hdNV: 'Không có vi phạm quy trình kỹ thuật hoặc quy chế chuyên môn trong kỳ.', cachQL: 'Rà soát biên bản giám sát chuyên môn của Hội đồng kiểm tra chất lượng.' },
        { ma: '4.2', muc: 'M1', noiDung: 'Không từ chối hỗ trợ người bệnh/khách hàng đang trong tình trạng cấp thiết chỉ vì lý do "đã hết giờ làm việc".', hdNV: 'Không bị phản ánh về hành vi bỏ mặc người bệnh khi chưa có người tiếp nhận.', cachQL: 'Kiểm tra sổ trực cấp cứu, phản ánh người bệnh và camera ca trực.' },
        { ma: '4.3', muc: 'M1', noiDung: 'Không từ chối lệnh điều động khẩn cấp (cấp cứu ngoại viện, chống dịch, thảm họa) khi không có lý do bất khả kháng.', hdNV: 'Chấp hành 100% lệnh huy động/điều động nhân lực của tổ chức.', cachQL: 'Kiểm tra hồ sơ điều động nhân sự của khoa/phòng/đơn vị.' },
        { ma: '4.4', muc: 'M1', noiDung: 'Không làm việc riêng, kinh doanh riêng hoặc chèo kéo khách hàng của đơn vị ra ngoài phòng khám/dịch vụ riêng để trục lợi.', hdNV: 'Nghiêm túc tuân thủ cam kết không xung đột lợi ích và nội quy lao động.', cachQL: 'Giám sát nội bộ và khảo sát người bệnh/khách hàng.' },
        { ma: '4.5', muc: 'M2', noiDung: 'Thực hiện đầy đủ 100% các bước trong quy trình chuẩn (SOP) và bảng kiểm an toàn được ban hành.', hdNV: 'Hồ sơ/bệnh án/phiếu thao tác được tích kiểm đầy đủ các bước theo quy định.', cachQL: 'Giám sát thao tác thực tế tại chỗ hoặc kiểm tra xác suất hồ sơ lưu trữ.' },
        { ma: '4.6', muc: 'M2', noiDung: 'Tham gia đầy đủ các buổi họp chuyên môn, đào tạo liên tục (CME) và sinh hoạt định kỳ bắt buộc.', hdNV: 'Danh sách điểm danh các lớp đào tạo nội bộ và họp giao ban đạt yêu cầu.', cachQL: 'Kiểm tra dữ liệu chấm công đào tạo của phòng Đào tạo/Nhân sự.' },
        { ma: '4.7', muc: 'M2', noiDung: 'Sẵn sàng tương trợ, làm thêm việc khi được Quản lý phân công hoặc khi đồng nghiệp trực tiếp yêu cầu giúp đỡ.', hdNV: 'Không đùn đẩy khi được điều phối hỗ trợ các vị trí quá tải.', cachQL: 'Ghi nhận của Quản lý ca trực về tính hợp tác điều phối nhân lực.' },
        { ma: '4.8', muc: 'M3', noiDung: 'Cẩn trọng, tỉ mỉ tuyệt đối: Luôn đối soát 2 lần (Double-check) thông tin, thuốc, số liệu; tỷ lệ sai sót bất cẩn là 0%.', hdNV: 'Không để xảy ra bất kỳ sai sót nhầm lẫn nào về danh tính, y lệnh, chứng từ trong kỳ.', cachQL: 'Thống kê số liệu sai sót hành chính/chuyên môn trong kỳ đánh giá (= 0).' },
        { ma: '4.9', muc: 'M3', noiDung: 'Dặn dò cặn kẽ, chu đáo mọi lưu ý sau dịch vụ (chế độ ăn, đơn thuốc, dấu hiệu bất thường, số điện thoại khẩn cấp khi về nhà).', hdNV: 'Bảng hướng dẫn ra viện/tin nhắn dặn dò chi tiết gửi người bệnh/khách hàng.', cachQL: 'Phỏng vấn trực tiếp người bệnh/người nhà trước khi xuất viện.' },
        { ma: '4.10', muc: 'M3', noiDung: 'Sẵn sàng nán lại ngoài giờ làm việc để xử lý trọn vẹn ca bệnh khó/công việc cấp bách chưa xong trước khi rời đi.', hdNV: 'Lịch sử ở lại hỗ trợ giải quyết công việc hoàn tất trong các ca trực đông.', cachQL: 'Xác nhận từ đồng nghiệp cùng kíp trực và camera/dữ liệu ra về.' },
        { ma: '4.11', muc: 'M3', noiDung: 'Thấy đồng đội đang quá tải là chủ động bước tới hỗ trợ ngay lập tức mà không cần đợi phân công hay nhờ vả.', hdNV: 'Ghi nhận của đồng nghiệp về tính chủ động xốc vác, chia sẻ áp lực trong ca trực.', cachQL: 'Phỏng vấn nhanh 2-3 nhân viên cùng tổ/kíp trực.' },
        { ma: '4.12', muc: 'M3', noiDung: 'Sẵn sàng trực thay, nhận ca đổi giờ đột xuất giúp đồng nghiệp khi bạn bị ốm đau hoặc gia đình có việc hiếu/hỷ.', hdNV: 'Sổ theo dõi điều chỉnh lịch trực thể hiện số lần hỗ trợ trực thay đồng đội.', cachQL: 'Kiểm tra sổ đổi lịch trực của khoa/phòng.' },
        { ma: '4.13', muc: 'M4', noiDung: 'Chủ động tạo ra các "điểm chạm tinh tế" vượt ngoài nhiệm vụ (VD: dìu người bệnh nặng, tự tay lau sạch chỗ ướt, đắp lại chăn...).', hdNV: 'Cung cấp ít nhất 2 hành động chăm sóc tận tụy vượt chuẩn đã thực hiện trong kỳ.', cachQL: 'Xác nhận qua lời khen của khách hàng hoặc camera hiện trường.' },
        { ma: '4.14', muc: 'M4', noiDung: 'Nhiệt tình kèm cặp, "cầm tay chỉ việc", chia sẻ tài liệu quý cho nhân viên mới/thực tập sinh, tuyệt đối không giấu nghề.', hdNV: 'Bản đánh giá tiến bộ của nhân viên mới được phân công kèm cặp hoặc bộ tài liệu đã chia sẻ.', cachQL: 'Phỏng vấn nhân viên mới về sự hỗ trợ tận tâm của nhân sự này.' },
        { ma: '4.15', muc: 'M4', noiDung: 'Xung phong đảm nhận các ca bệnh phức tạp, địa bàn xa xôi, nhiệm vụ khó khăn mà người khác thường e ngại.', hdNV: 'Danh sách phân công nhiệm vụ/dự án ghi nhận tinh thần xung phong nhận việc khó.', cachQL: 'Quản lý trực tiếp ghi nhận tinh thần dấn thân qua các đợt phân công việc.' },
        { ma: '4.16', muc: 'M5', noiDung: 'Có đề tài/sáng kiến cải tiến nâng cao chất lượng dịch vụ hoặc an toàn được nghiệm thu; là hạt nhân truyền lửa của đơn vị.', hdNV: 'Văn bản công nhận đề án Kaizen/Sáng kiến cải tiến cấp cơ sở hoặc danh hiệu thi đua xuất sắc nhất.', cachQL: 'Đối chiếu quyết định khen thưởng sáng kiến của Hội đồng khoa học/Chất lượng.' }
      ]
    },
    {
      id: 5,
      ma: 'TC5',
      ten: 'TRI ÂN',
      tenEn: 'Gratitude',
      icon: '🙏',
      mau: '#7c3aed',
      moTa: 'Nuôi dưỡng lòng biết ơn người bệnh/khách hàng và đồng nghiệp, gìn giữ uy tín đơn vị và đóng góp cho cộng đồng.',
      tongTM: 15,
      nguong: { m2: 8, m3: 12, m4: 14, m5: 15 },
      tieuMuc: [
        { ma: '5.1', muc: 'M1', noiDung: 'Không hách dịch, trịch thượng hoặc thiếu tôn trọng đối với nhân viên cấp dưới và đội ngũ hỗ trợ (bảo vệ, tạp vụ, hộ lý).', hdNV: 'Không có phản ánh bức xúc nào từ lực lượng hỗ trợ về thái độ kẻ cả, coi thường.', cachQL: 'Lấy ý kiến phản hồi kín từ đại diện tổ bảo vệ, lao công, hộ lý tại khoa.' },
        { ma: '5.2', muc: 'M1', noiDung: 'Không tranh công, vơ vét thành tích của tập thể hoặc cấp dưới thành thành tích của riêng cá nhân mình.', hdNV: 'Báo cáo thành tích công việc luôn ghi rõ đóng góp cụ thể của các cộng sự.', cachQL: 'Kiểm tra cách phân bổ quyền lợi và báo cáo công việc của nhân sự.' },
        { ma: '5.3', muc: 'M1', noiDung: 'Không phát ngôn tiêu cực, sai lệch hoặc chia sẻ thông tin gây tổn hại danh dự, uy tín tổ chức lên mạng xã hội.', hdNV: 'Tài khoản mạng xã hội tuân thủ quy tắc truyền thông và phát ngôn của đơn vị.', cachQL: 'Kiểm tra việc tuân thủ quy chế mạng xã hội nội bộ.' },
        { ma: '5.4', muc: 'M1', noiDung: 'Không làm lộ lọt thông tin đời tư người bệnh, hồ sơ mật hoặc bí mật chuyên môn/kinh doanh của tổ chức ra bên ngoài.', hdNV: 'Tuân thủ 100% quy định bảo mật thông tin khách hàng và dữ liệu nội bộ.', cachQL: 'Kiểm tra an toàn thông tin và bảo mật dữ liệu định kỳ.' },
        { ma: '5.5', muc: 'M2', noiDung: 'Có thói quen nói lời "Cảm ơn" một cách tự nhiên, lịch thiệp khi nhận được sự phối hợp từ đồng đội hoặc khách hàng.', hdNV: 'Văn hóa giao tiếp hàng ngày thân thiện, luôn có lời cảm ơn trong tin nhắn/trao đổi.', cachQL: 'Quan sát thực tế giao tiếp trực tiếp và trên các nhóm làm việc chung.' },
        { ma: '5.6', muc: 'M2', noiDung: 'Tôn trọng công sức của bộ phận hậu cần: Giữ gìn vệ sinh chung, phân loại rác đúng thùng quy định, không vứt bừa bãi.', hdNV: 'Tuân thủ đúng quy trình phân loại rác thải tại vị trí làm việc.', cachQL: 'Kiểm tra vệ sinh và thùng rác tại khu vực làm việc của nhân viên.' },
        { ma: '5.7', muc: 'M2', noiDung: 'Luôn mang mặc đồng phục, đeo thẻ tên chỉn chu, giữ gìn hình ảnh thương hiệu tổ chức mọi lúc mọi nơi.', hdNV: 'Chấp hành quy chuẩn diện mạo (Grooming) trong suốt thời gian làm việc.', cachQL: 'Kiểm tra tác phong diện mạo hàng ngày tại vị trí làm việc.' },
        { ma: '5.8', muc: 'M2', noiDung: 'Tham gia đầy đủ các phong trào thiện nguyện, hoạt động đoàn thể hoặc hiến máu nhân đạo do tổ chức phát động.', hdNV: 'Có tên trong danh sách đăng ký tham gia hoặc đóng góp quỹ phong trào chung.', cachQL: 'Đối chiếu danh sách tham gia hoạt động đoàn thể/công đoàn.' },
        { ma: '5.9', muc: 'M3', noiDung: 'Luôn nói lời cảm ơn chân thành tới người bệnh/khách hàng vì đã tin tưởng lựa chọn dịch vụ của đơn vị khi chia tay/ra viện.', hdNV: 'Duy trì câu nói tri ân ở bước kết thúc quy trình chăm sóc/giao dịch.', cachQL: 'Khảo sát ngẫu nhiên ý kiến người bệnh lúc thanh toán hoặc ra viện.' },
        { ma: '5.10', muc: 'M3', noiDung: 'Khi đạt được thành quả tốt, luôn chủ động nêu tên và cảm ơn sự hỗ trợ thầm lặng của cộng sự và các phòng ban liên quan.', hdNV: 'Lời cảm ơn được ghi trong email tổng kết, tin nhắn nhóm hoặc phát biểu tại cuộc họp.', cachQL: 'Kiểm tra lịch sử trao đổi trên nhóm chat công việc hoặc biên bản họp.' },
        { ma: '5.11', muc: 'M3', noiDung: 'Thể hiện thái độ tôn kính, lễ độ đối với các bậc thầy cô, tiền bối đi trước và người hướng dẫn chuyên môn cho mình.', hdNV: 'Ứng xử chuẩn mực, khiêm nhường trong các mối quan hệ đồng nghiệp lớn tuổi/thầy trò.', cachQL: 'Đánh giá nét văn hóa tôn sư trọng đạo qua thực tế tiếp xúc.' },
        { ma: '5.12', muc: 'M3', noiDung: 'Chủ động lên tiếng đính chính thông tin hiểu lầm về đơn vị hoặc báo ngay cho bộ phận truyền thông để bảo vệ thương hiệu.', hdNV: 'Thông tin cảnh báo sớm các luồng dư luận xấu/hiểu lầm gửi về Ban lãnh đạo/Truyền thông.', cachQL: 'Quản lý ghi nhận ý thức bảo vệ hình ảnh tổ chức của nhân sự.' },
        { ma: '5.13', muc: 'M4', noiDung: 'Chủ động gửi thiệp/thư cảm ơn tri ân đồng nghiệp hoặc có hành động quan tâm ấm áp tới đội ngũ tạp vụ, bảo vệ dịp lễ, Tết.', hdNV: 'Minh chứng tin nhắn/thiệp tri ân đồng nghiệp hoặc quà tặng động viên lực lượng hỗ trợ.', cachQL: 'Xác nhận từ đồng nghiệp hoặc lực lượng bảo vệ/tạp vụ tại cơ sở.' },
        { ma: '5.14', muc: 'M4', noiDung: 'Đóng góp chuyên môn phục vụ xã hội (VD: Viết bài phổ biến kiến thức sức khỏe, tham gia khám từ thiện vùng sâu, hiến máu hiếm...).', hdNV: 'Bài viết giáo dục sức khỏe được duyệt đăng hoặc giấy chứng nhận tham gia đoàn thiện nguyện.', cachQL: 'Kiểm tra bài đăng trên kênh truyền thông chính thống hoặc xác nhận của Công tác xã hội.' },
        { ma: '5.15', muc: 'M5', noiDung: 'Đại sứ thương hiệu: Khởi xướng các hoạt động lan tỏa "Văn hóa Biết ơn" trong tổ chức hoặc kết nối tài trợ cứu trợ bệnh nhân nghèo.', hdNV: 'Chương trình/Góc tri ân duy trì hiệu quả hoặc số hồ sơ bệnh nhân nghèo được kết nối hỗ trợ kinh phí.', cachQL: 'Xác nhận từ Ban Giám đốc hoặc Phòng Công tác xã hội của đơn vị.' }
      ]
    }
  ];

  // Trạng thái cục bộ của Module
  let state = {
    activeTab: 'danhgia', // 'thuvien' | 'danhgia'
    filterTC: 'all',     // 'all' | 1 | 2 | 3 | 4 | 5
    filterMuc: 'all',    // 'all' | 'M1' | 'M2' | 'M3' | 'M4' | 'M5'
    searchQuery: '',
    selectedTCForAudit: 'all', // 'all' | 1 | 2 | 3 | 4 | 5
    hoSo: {
      hoTen: 'Nguyễn Văn Minh',
      maNV: 'NV-2026-089',
      viTri: 'Điều Dưỡng Trưởng Ngoại Trú',
      donVi: 'Khoa Khám Bệnh & PTKH',
      kyDanhGia: 'Quý I / 2026',
      quanLy: 'BS. Huỳnh Trường Thanh Tâm',
      keHoach1: 'Tiểu mục 2.12: Nhận diện và cảnh báo sớm nguy cơ quá tải ca trực trước 24h kèm Plan B.',
      keHoach2: 'Tiểu mục 3.13: Nâng cao kỹ năng hạ nhiệt (De-escalation) khi tiếp nhận khiếu nại bệnh nhân đông.',
      nhanXetQL: 'Nhân sự có tinh thần phụng sự rất tốt, trung thực và trách nhiệm cao. Cần rèn luyện thêm kỹ năng xử lý khủng hoảng tâm lý người bệnh vào khung giờ cao điểm.'
    },
    // Lưu trạng thái chấm: key là mã tiểu mục '1.1', value: { nv: bool, ql: bool, note: str }
    chamDiem: {}
  };

  // Khởi tạo điểm mặc định từ LocalStorage hoặc dữ liệu mẫu
  function initData() {
    try {
      const saved = localStorage.getItem('shin_danhgia5t_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.chamDiem && Object.keys(parsed.chamDiem).length > 0) {
          state.chamDiem = parsed.chamDiem;
          if (parsed.hoSo) state.hoSo = Object.assign(state.hoSo, parsed.hoSo);
          return;
        }
      }
    } catch (e) {}

    // Nạp sẵn kịch bản mẫu: Điều dưỡng đạt Mức 4 - 5T Vững Mạnh
    loadMauKhaTot();
  }

  function loadMauKhaTot() {
    const cd = {};
    TIEU_CHI.forEach(tc => {
      tc.tieuMuc.forEach(tm => {
        // M1, M2, M3: đạt 100%
        if (tm.muc === 'M1' || tm.muc === 'M2' || tm.muc === 'M3') {
          cd[tm.ma] = { nv: true, ql: true, note: 'Hồ sơ lưu trữ đầy đủ, đã qua đối soát' };
        } else if (tm.muc === 'M4') {
          // M4: đạt đa số tiểu mục
          cd[tm.ma] = { nv: true, ql: true, note: 'Báo cáo cải tiến định kỳ' };
        } else {
          // M5: đang phấn đấu
          cd[tm.ma] = { nv: false, ql: false, note: '' };
        }
      });
    });
    // Ghi chú một số minh chứng cụ thể
    if (cd['1.7']) cd['1.7'].note = 'Mã hồ sơ BA-2026-X12 khớp 100% HIS';
    if (cd['2.7']) cd['2.7'].note = 'KPI On-time quý đạt 98.4%';
    if (cd['3.8']) cd['3.8'].note = 'Đạt 100% phản hồi dễ hiểu theo phiếu CSAT';
    if (cd['4.8']) cd['4.8'].note = 'Tỷ lệ đối soát kép đạt 0 lỗi nhầm lẫn';
    if (cd['5.9']) cd['5.9'].note = 'Thực hiện 100% lời cảm ơn khi xuất viện';

    state.chamDiem = cd;
    saveToStorage();
  }

  function saveToStorage() {
    try {
      localStorage.setItem('shin_danhgia5t_data', JSON.stringify({
        hoSo: state.hoSo,
        chamDiem: state.chamDiem
      }));
    } catch (e) {}
  }

  // 2. THUẬT TOÁN TÍNH ĐIỂM BẬC THANG LŨY TIẾN (CHẨN 83 TIÊU CHÍ BYT)
  function tinhKetQua() {
    const ketQuaTC = [];
    let tongDiem = 0;
    let coDiemLietM1 = false;
    let soTCMuc1 = 0;
    let soTCMuc2 = 0;

    TIEU_CHI.forEach(tc => {
      let soTMDuyet = 0;
      let viPhamM1 = false;

      // 1. Kiểm tra Mức 1: Có tiểu mục nào không đạt (tức là vi phạm) không?
      // Chú ý: Các tiểu mục M1 là điều kiện tiên quyết. Phải đạt (qlDuyet === true) cả NV và QL
      tc.tieuMuc.filter(tm => tm.muc === 'M1').forEach(tm => {
        const c = state.chamDiem[tm.ma];
        if (!c || !c.nv || !c.ql) {
          viPhamM1 = true;
        }
      });

      // Đếm số tiểu mục đạt (cả NV và QL cùng tick)
      tc.tieuMuc.forEach(tm => {
        const c = state.chamDiem[tm.ma];
        if (c && c.nv && c.ql) {
          soTMDuyet++;
        }
      });

      // 2. Xác định Mức điểm đạt theo bảng quy đổi Phần IV.2
      let mucDiem = 1;
      if (viPhamM1) {
        mucDiem = 1;
        coDiemLietM1 = true;
      } else {
        const ng = tc.nguong;
        if (soTMDuyet >= ng.m5) {
          mucDiem = 5;
        } else if (soTMDuyet >= ng.m4) {
          mucDiem = 4;
        } else if (soTMDuyet >= ng.m3) {
          mucDiem = 3;
        } else if (soTMDuyet >= ng.m2) {
          mucDiem = 2;
        } else {
          mucDiem = 1;
        }
      }

      if (mucDiem === 1) soTCMuc1++;
      if (mucDiem === 2) soTCMuc2++;
      tongDiem += mucDiem;

      ketQuaTC.push({
        id: tc.id,
        ma: tc.ma,
        ten: tc.ten,
        icon: tc.icon,
        mau: tc.mau,
        tongTM: tc.tongTM,
        soTMDuyet: soTMDuyet,
        mucDiem: mucDiem,
        viPhamM1: viPhamM1
      });
    });

    const dtb = +(tongDiem / 5).toFixed(2);

    // 3. Xếp loại văn hóa 5T theo Phần IV.3
    let xepLoai = '';
    let xepLoaiClass = '';
    let xepLoaiMoTa = '';

    const minMuc = Math.min(...ketQuaTC.map(k => k.mucDiem));

    if (coDiemLietM1 || dtb < 2.0 || soTCMuc1 > 0) {
      xepLoai = 'Cảnh Báo Kỷ Luật (Vi phạm)';
      xepLoaiClass = 'badge-danger';
      xepLoaiMoTa = 'Có tiêu chí rơi vào Mức 1 hoặc ĐTB < 2.0. Cần hội đồng kỷ luật/xử lý chấn chỉnh ngay.';
    } else if (dtb >= 4.5 && minMuc >= 4) {
      xepLoai = '5T Tinh Hoa (Xuất sắc)';
      xepLoaiClass = 'badge-elite';
      xepLoaiMoTa = 'Văn hóa mẫu mực, dẫn dắt và lan tỏa giá trị xuất sắc trong toàn tổ chức.';
    } else if (dtb >= 3.8 && minMuc >= 3) {
      xepLoai = '5T Vững Mạnh (Khá - Tốt)';
      xepLoaiClass = 'badge-success';
      xepLoaiMoTa = 'Tuân thủ vững vàng các chuẩn mực văn hóa và có tinh thần cải tiến vượt trội.';
    } else if (dtb >= 3.0 && soTCMuc2 <= 1) {
      xepLoai = '5T Chuẩn Mực (Đạt yêu cầu)';
      xepLoaiClass = 'badge-info';
      xepLoaiMoTa = 'Đạt chuẩn văn hóa cơ sở của tổ chức, không vi phạm nền tảng.';
    } else {
      xepLoai = '5T Cần Rèn Luyện (Chưa đạt)';
      xepLoaiClass = 'badge-warning';
      xepLoaiMoTa = '2.0 ≤ ĐTB < 3.0. Cần lập kế hoạch kèm cặp cá nhân trong 3 tháng tới.';
    }

    return {
      ketQuaTC,
      tongDiem,
      dtb,
      xepLoai,
      xepLoaiClass,
      xepLoaiMoTa,
      coDiemLietM1
    };
  }

  // 3. RENDER GIAO DIỆN CHÍNH
  function render(container) {
    initData();
    const kq = tinhKetQua();

    let html = `
      <!-- Topbar Title & Actions -->
      <div class="page-header">
        <div>
          <div class="page-title">Đánh Giá Văn Hóa Hành Vi 5T</div>
          <div class="page-sub">Chuẩn hóa 5 Tiêu chí cốt lõi · Tham chiếu Bộ 83 Tiêu chí BYT</div>
        </div>
        <div style="display:flex; gap:6px;">
          <button class="btn-icon" onclick="ModuleDanhGia5T.inPhieu()" title="In phiếu tổng hợp A4">🖨️</button>
          <button class="btn-icon" onclick="ShinApp.moCaiDat()" title="Cài đặt">⚙️</button>
        </div>
      </div>

      <!-- Hero Card Chuẩn SHIN AIOS (<= 3 Số + 1 Nút Chính) -->
      <div class="hn-hero">
        <div class="hero-head">
          <div>
            <div class="hero-greet">Bảng Kiểm 5T Bậc Thang Lũy Tiến ⭐</div>
            <div class="hero-date">📅 Kỳ: ${state.hoSo.kyDanhGia} · Nhân sự: ${state.hoSo.hoTen}</div>
          </div>
          <span class="status-pill live" style="font-size:14px; font-weight:700;">83 TC BYT</span>
        </div>

        <div class="tq-3so">
          <div class="tq-o" style="cursor:pointer;" onclick="ModuleDanhGia5T.chuyenTab('danhgia')">
            <div class="tq-so" style="color:var(--primary); font-size:24px;">${kq.dtb} <span style="font-size:14px; color:var(--text-muted);">/5.0</span></div>
            <div class="tq-nhan">Điểm Trung Bình (ĐTB)</div>
          </div>
          <div class="tq-o" style="cursor:pointer;" onclick="ModuleDanhGia5T.chuyenTab('danhgia')">
            <div class="tq-so" style="color:var(--c-green); font-size:24px;">${kq.tongDiem} <span style="font-size:14px; color:var(--text-muted);">/25</span></div>
            <div class="tq-nhan">Tổng Điểm 5 Trụ Cột</div>
          </div>
          <div class="tq-o" style="cursor:pointer;" onclick="ModuleDanhGia5T.chuyenTab('danhgia')">
            <div class="tq-so" style="color:${kq.coDiemLietM1 ? 'var(--c-red)' : '#8b5cf6'}; font-size:14px; font-weight:800; line-height:1.2; padding-top:4px;">
              ${kq.xepLoai.split('(')[0].trim()}
            </div>
            <div class="tq-nhan">Xếp Loại Hiện Tại</div>
          </div>
        </div>

        <button class="btn-primary" onclick="ModuleDanhGia5T.inPhieu()">
          🖨️ In Phiếu Tổng Hợp Đánh Giá (Chuẩn A4)
        </button>
      </div>

      <!-- Navigation Tabs Lớn: THƯ VIỆN TIÊU CHÍ vs THỰC HIỆN ĐÁNH GIÁ -->
      <div class="tab-control-5t">
        <button class="tab-btn-5t ${state.activeTab === 'danhgia' ? 'active' : ''}" onclick="ModuleDanhGia5T.chuyenTab('danhgia')">
          ✍️ Thực Hiện Đánh Giá & Tính Điểm
        </button>
        <button class="tab-btn-5t ${state.activeTab === 'thuvien' ? 'active' : ''}" onclick="ModuleDanhGia5T.chuyenTab('thuvien')">
          📚 Thư Viện Tiêu Chí & Minh Chứng (76 TM)
        </button>
      </div>

      <!-- Vùng Nội Dung Theo Tab Đang Chọn -->
      <div id="vungNoiDung5T">
        ${state.activeTab === 'danhgia' ? renderTabDanhGia(kq) : renderTabThuVien()}
      </div>
    `;

    container.innerHTML = html;
  }

  // 4. RENDER PHÂN HỆ: THƯ VIỆN TIÊU CHÍ (HANDBOOK)
  function renderTabThuVien() {
    let danhSachLoc = [];
    TIEU_CHI.forEach(tc => {
      if (state.filterTC === 'all' || state.filterTC === tc.id) {
        tc.tieuMuc.forEach(tm => {
          const matchMuc = (state.filterMuc === 'all' || state.filterMuc === tm.muc);
          const q = state.searchQuery.toLowerCase().trim();
          const matchSearch = !q || tm.noiDung.toLowerCase().includes(q) || tm.hdNV.toLowerCase().includes(q) || tm.cachQL.toLowerCase().includes(q) || tm.ma.includes(q);
          if (matchMuc && matchSearch) {
            danhSachLoc.push({
              tcId: tc.id,
              tcTen: tc.ten,
              tcMau: tc.mau,
              tcIcon: tc.icon,
              ...tm
            });
          }
        });
      }
    });

    return `
      <!-- Khối Giới Thiệu & Bộ Lọc Thư Viện -->
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header">
          <div>
            <div class="card-title">📖 Sổ Tay Thẩm Định Minh Chứng 5T</div>
            <div style="font-size:14px; color:var(--text-muted); margin-top:2px;">
              Quy chuẩn 76 tiểu mục theo phương pháp "Nói có sách, mách có chứng"
            </div>
          </div>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.taiTaiLieuMD()">
            📥 Tải File MD
          </button>
        </div>

        <!-- Thanh Tìm Kiếm -->
        <div style="margin-top:10px;">
          <input type="text" class="form-input" placeholder="🔍 Tìm nhanh từ khóa, mã tiểu mục (ví dụ: 1.7, camera, chấm công...)" 
            value="${state.searchQuery}" oninput="ModuleDanhGia5T.capNhatTimKiem(this.value)">
        </div>

        <!-- Bộ Lọc Trụ Cột (T1 -> T5) -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding:10px 0 4px 0; -webkit-overflow-scrolling:touch;">
          <button class="filter-chip ${state.filterTC === 'all' ? 'active' : ''}" onclick="ModuleDanhGia5T.locTC('all')">Tất cả 5T</button>
          ${TIEU_CHI.map(t => `
            <button class="filter-chip ${state.filterTC === t.id ? 'active' : ''}" onclick="ModuleDanhGia5T.locTC(${t.id})">
              ${t.icon} ${t.ten} (${t.tongTM})
            </button>
          `).join('')}
        </div>

        <!-- Bộ Lọc Mức Độ (M1 -> M5) -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding:6px 0 0 0;">
          <button class="filter-chip-sm ${state.filterMuc === 'all' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('all')">Tất cả mức</button>
          <button class="filter-chip-sm ${state.filterMuc === 'M1' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('M1')">🚨 M1 Điểm liệt</button>
          <button class="filter-chip-sm ${state.filterMuc === 'M2' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('M2')">M2 Sơ khai</button>
          <button class="filter-chip-sm ${state.filterMuc === 'M3' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('M3')">M3 Chuẩn mực</button>
          <button class="filter-chip-sm ${state.filterMuc === 'M4' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('M4')">M4 Cải tiến</button>
          <button class="filter-chip-sm ${state.filterMuc === 'M5' ? 'active' : ''}" onclick="ModuleDanhGia5T.locMuc('M5')">M5 Tinh hoa</button>
        </div>
      </div>

      <!-- Danh Sách Tiểu Mục Thư Viện -->
      <div style="font-size:14px; color:var(--text-muted); margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
        <span>Hiển thị <strong>${danhSachLoc.length}</strong> / 76 tiểu mục</span>
        <span style="font-size:14px;">Chuẩn hóa bởi Sếp Huỳnh Trường Thanh Tâm</span>
      </div>

      <div class="hn-list" style="gap:12px;">
        ${danhSachLoc.length === 0 ? `
          <div class="card" style="text-align:center; padding:30px 16px; color:var(--text-muted);">
            Không tìm thấy tiểu mục nào khớp với điều kiện lọc.
          </div>
        ` : danhSachLoc.map(tm => {
          let badgeColor = '#64748b';
          let badgeText = tm.muc;
          if (tm.muc === 'M1') { badgeColor = 'var(--c-red)'; badgeText = 'M1 · ĐIỂM LIỆT'; }
          if (tm.muc === 'M2') { badgeColor = '#d97706'; badgeText = 'M2 · NỀN TẢNG'; }
          if (tm.muc === 'M3') { badgeColor = '#0284c7'; badgeText = 'M3 · CHUẨN MỰC'; }
          if (tm.muc === 'M4') { badgeColor = '#0f766e'; badgeText = 'M4 · CẢI TIẾN'; }
          if (tm.muc === 'M5') { badgeColor = '#7c3aed'; badgeText = 'M5 · TINH HOA'; }

          return `
            <div class="card" style="border-left: 4px solid ${tm.tcMau};">
              <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span style="font-size:14px; font-weight:800; color:${tm.tcMau};">${tm.tcIcon} ${tm.tcTen}</span>
                  <span style="font-size:14px; background:color-mix(in srgb, ${badgeColor} 10%, transparent); color:${badgeColor}; font-weight:700; padding:2px 6px; border-radius:4px; border:1px solid color-mix(in srgb, ${badgeColor} 19%, transparent);">
                    ${badgeText}
                  </span>
                </div>
                <span style="font-size:14px; font-weight:800; color:var(--text-muted);">Mã: ${tm.ma}</span>
              </div>

              <!-- Nội dung tiểu mục -->
              <div style="font-size:14px; font-weight:600; color:var(--text); margin-top:8px; line-height:1.45;">
                ${tm.noiDung}
              </div>

              <!-- Hai khối hướng dẫn: NV chuẩn bị gì & QL kiểm tra gì -->
              <div style="margin-top:10px; display:grid; grid-template-columns:1fr; gap:8px; font-size:14px;">
                <div style="background:var(--bg-sub); padding:8px 10px; border-radius:6px; border:1px solid var(--border);">
                  <strong style="color:var(--primary);">📋 Nhân viên tự chứng minh (Chuẩn bị gì?):</strong>
                  <div style="color:var(--text); margin-top:2px;">${tm.hdNV}</div>
                </div>
                <div style="background:var(--bg-sub); padding:8px 10px; border-radius:6px; border:1px solid var(--border);">
                  <strong style="color:#0f766e;">🔍 Cách Quản lý kiểm tra (OK = Đạt):</strong>
                  <div style="color:var(--text); margin-top:2px;">${tm.cachQL}</div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // 5. RENDER PHÂN HỆ: THỰC HIỆN ĐÁNH GIÁ (AUDIT ENGINE)
  function renderTabDanhGia(kq) {
    return `
      <!-- Khối Bảng Thẩm Định Tổng Hợp & Radar Chart -->
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header">
          <div class="card-title">📊 Bảng Tổng Hợp Điểm 5 Trụ Cột (Real-time)</div>
          <span class="status-pill live">Tự động tính lũy tiến</span>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:16px; margin-top:10px; align-items:center;">
          <!-- Biểu đồ Radar SVG 5 Trục Sắc Nét -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px; background:var(--bg-sub); border-radius:10px; border:1px solid var(--border);">
            <div style="font-size:14px; font-weight:700; color:var(--text-muted); margin-bottom:4px;">RADAR VĂN HÓA 5 TRỤ CỘT</div>
            ${renderRadarSVG(kq.ketQuaTC)}
            <div style="font-size:14px; color:var(--text-muted); text-align:center; margin-top:6px;">
              Diện tích đồ thị thể hiện độ cân bằng và mức độ trưởng thành văn hóa
            </div>
          </div>

          <!-- Bảng Điểm 5 Tiêu Chí -->
          <div style="overflow-x:auto;">
            <table class="bang-diem-5t">
              <thead>
                <tr>
                  <th>Trụ Cột</th>
                  <th>Số TM Đạt</th>
                  <th>Mức Điểm</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                ${kq.ketQuaTC.map(k => `
                  <tr>
                    <td>
                      <div style="font-weight:700; color:${k.mau}; display:flex; align-items:center; gap:4px;">
                        <span>${k.icon}</span> <span>${k.ma}</span>
                      </div>
                      <div style="font-size:14px; color:var(--text-muted);">${k.ten}</div>
                    </td>
                    <td><strong>${k.soTMDuyet}</strong>/${k.tongTM}</td>
                    <td>
                      <span class="diem-pill" style="background:${k.mau}20; color:${k.mau};">
                        Mức ${k.mucDiem}
                      </span>
                    </td>
                    <td>
                      ${k.viPhamM1 ? `
                        <span style="font-size:14px; color:var(--c-red); font-weight:700;">🚨 Điểm liệt M1</span>
                      ` : `
                        <span style="font-size:14px; color:var(--c-green); font-weight:600;">✓ Hợp lệ</span>
                      `}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Khung Xếp Loại Toàn Diện -->
        <div style="margin-top:16px; padding:12px; border-radius:8px; border:1px solid var(--border); background:${kq.coDiemLietM1 ? 'rgba(220,38,38,0.08)' : 'rgba(2,132,199,0.06)'};">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <div style="font-size:14px; font-weight:800; color:var(--text-muted);">KẾT QUẢ XẾP LOẠI CHUNG CUỘC</div>
              <div style="font-size:17px; font-weight:800; color:${kq.coDiemLietM1 ? 'var(--c-red)' : 'var(--primary)'}; margin-top:2px;">
                ${kq.xepLoai}
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:20px; font-weight:900; color:var(--text);">${kq.dtb}</span>
              <span style="font-size:14px; color:var(--text-muted);">/5.0 ĐTB</span>
            </div>
          </div>
          <div style="font-size:14px; color:var(--text-muted); margin-top:6px;">
            ${kq.xepLoaiMoTa}
          </div>
        </div>
      </div>

      <!-- Thông Tin Đối Tượng Đánh Giá -->
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header">
          <div class="card-title">👤 Thông Tin Đối Tượng & Kỳ Thẩm Định</div>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.luuThongTinHoSo()">
            💾 Lưu Hồ Sơ
          </button>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:10px; margin-top:10px;">
          <div>
            <label class="form-label">HỌ VÀ TÊN NHÂN SỰ</label>
            <input type="text" class="form-input" id="hsHoTen" value="${state.hoSo.hoTen}" onchange="state.hoSo.hoTen=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">MÃ NHÂN VIÊN</label>
            <input type="text" class="form-input" id="hsMaNV" value="${state.hoSo.maNV}" onchange="state.hoSo.maNV=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">VỊ TRÍ CÔNG TÁC</label>
            <input type="text" class="form-input" id="hsViTri" value="${state.hoSo.viTri}" onchange="state.hoSo.viTri=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">KHOA / PHÒNG / ĐƠN VỊ</label>
            <input type="text" class="form-input" id="hsDonVi" value="${state.hoSo.donVi}" onchange="state.hoSo.donVi=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">KỲ ĐÁNH GIÁ</label>
            <input type="text" class="form-input" id="hsKy" value="${state.hoSo.kyDanhGia}" onchange="state.hoSo.kyDanhGia=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">QUẢN LÝ THẨM ĐỊNH</label>
            <input type="text" class="form-input" id="hsQuanLy" value="${state.hoSo.quanLy}" onchange="state.hoSo.quanLy=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
        </div>

        <!-- Bộ nút chọn nhanh mẫu / đặt lại -->
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:14px; padding-top:10px; border-top:1px dashed var(--border);">
          <span style="font-size:14px; color:var(--text-muted); align-self:center;">Chọn nhanh mức độ thử nghiệm:</span>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.chonNhanhMuc(2)">Nền Tảng (Mức 2)</button>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.chonNhanhMuc(3)">Chuẩn Mực (Mức 3)</button>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.chonNhanhMuc(4)">Vững Mạnh (Mức 4)</button>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px;" onclick="ModuleDanhGia5T.chonNhanhMuc(5)">Tinh Hoa (Mức 5)</button>
          <button class="btn-secondary" style="font-size:14px; padding:6px 10px; min-height:44px; color:var(--c-red);" onclick="ModuleDanhGia5T.xoaTrang()">Đặt lại trắng</button>
        </div>
      </div>

      <!-- Bàn Làm Việc Chấm Điểm Chi Tiết 76 Tiểu Mục -->
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header">
          <div>
            <div class="card-title">📝 Bảng Kiểm Thẩm Định Chi Tiết</div>
            <div style="font-size:14px; color:var(--text-muted); margin-top:2px;">
              Tiểu mục chỉ ĐẠT khi cả Nhân viên và Quản lý cùng tích xác nhận [x]
            </div>
          </div>
        </div>

        <!-- Thanh Chọn Tiêu Chí Để Chấm -->
        <div style="display:flex; gap:6px; overflow-x:auto; padding:8px 0; -webkit-overflow-scrolling:touch;">
          <button class="filter-chip ${state.selectedTCForAudit === 'all' ? 'active' : ''}" onclick="ModuleDanhGia5T.chonTCChấm('all')">
            Tất cả 5 Tiêu chí (76 TM)
          </button>
          ${TIEU_CHI.map(t => `
            <button class="filter-chip ${state.selectedTCForAudit === t.id ? 'active' : ''}" onclick="ModuleDanhGia5T.chonTCChấm(${t.id})">
              ${t.icon} ${t.ten}
            </button>
          `).join('')}
        </div>

        <!-- Render Danh Sách Tiểu Mục Cần Chấm -->
        <div style="margin-top:10px;">
          ${TIEU_CHI.filter(tc => state.selectedTCForAudit === 'all' || state.selectedTCForAudit === tc.id).map(tc => {
            const k = kq.ketQuaTC.find(x => x.id === tc.id);
            return `
              <div class="khung-tc-audit" style="border-top:2px solid ${tc.mau}; margin-bottom:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; flex-wrap:wrap; gap:8px;">
                  <div>
                    <span style="font-size:15px; font-weight:800; color:${tc.mau};">${tc.icon} TIÊU CHÍ ${tc.id}: ${tc.ten}</span>
                    <div style="font-size:14px; color:var(--text-muted);">${tc.moTa}</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:14px; font-weight:700;">Đạt ${k.soTMDuyet}/${tc.tongTM} TM</span>
                    <span class="diem-pill" style="background:${tc.mau}20; color:${tc.mau};">Mức ${k.mucDiem}</span>
                  </div>
                </div>

                <!-- Bảng Danh Sách Tiểu Mục -->
                <div class="checklist-table-wrapper">
                  <table class="bang-checklist-5t">
                    <thead>
                      <tr>
                        <th style="width:50px;">Mã</th>
                        <th style="width:65px;">Mức</th>
                        <th>Nội dung kiểm tra & Cách kiểm tra</th>
                        <th style="width:70px; text-align:center;">NV chấm</th>
                        <th style="width:70px; text-align:center;">QL duyệt</th>
                        <th style="width:160px;">Minh chứng / Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${tc.tieuMuc.map(tm => {
                        const cur = state.chamDiem[tm.ma] || { nv: false, ql: false, note: '' };
                        const isDat = cur.nv && cur.ql;
                        const isM1 = tm.muc === 'M1';

                        return `
                          <tr class="${isDat ? 'row-dat' : ''} ${isM1 && !isDat ? 'row-m1-canhbao' : ''}">
                            <td style="font-weight:700;">${tm.ma}</td>
                            <td>
                              <span class="muc-pill ${tm.muc.toLowerCase()}">${tm.muc}</span>
                            </td>
                            <td>
                              <div style="font-weight:600; color:var(--text); line-height:1.4;">
                                ${tm.noiDung}
                              </div>
                              <div style="font-size:14px; color:var(--text-muted); margin-top:4px;">
                                <strong>Cách kiểm tra:</strong> ${tm.cachQL}
                              </div>
                            </td>
                            <td style="text-align:center;">
                              <label class="chk-vung-5t" aria-label="Nhân viên tự đánh giá ${tm.ma}"><input type="checkbox" class="chk-5t" ${cur.nv ? 'checked' : ''} 
                                onchange="ModuleDanhGia5T.capNhatTick('${tm.ma}', 'nv', this.checked)"></label>
                            </td>
                            <td style="text-align:center;">
                              <label class="chk-vung-5t" aria-label="Quản lý xác nhận ${tm.ma}"><input type="checkbox" class="chk-5t ql" ${cur.ql ? 'checked' : ''} 
                                onchange="ModuleDanhGia5T.capNhatTick('${tm.ma}', 'ql', this.checked)"></label>
                            </td>
                            <td>
                              <input type="text" class="note-input-5t" placeholder="Link/Mã minh chứng..." 
                                value="${cur.note || ''}" onchange="ModuleDanhGia5T.capNhatGhiChu('${tm.ma}', this.value)">
                            </td>
                          </tr>
                        `;
                      }).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Khối Kế Hoạch Bồi Dưỡng & Phấn Đấu Kỳ Tới (Phần IV.3) -->
      <div class="card" style="margin-bottom:20px;">
        <div class="card-header">
          <div class="card-title">🎯 Kế Hoạch Bồi Dưỡng & Phấn Đấu Kỳ Tới</div>
          <span class="status-pill demo">Mục tiêu phát triển cá nhân</span>
        </div>

        <div style="margin-top:10px; display:flex; flex-direction:column; gap:10px;">
          <div>
            <label class="form-label">TIỂU MỤC TRỌNG TÂM PHẤN ĐẤU 1</label>
            <input type="text" class="form-input" value="${state.hoSo.keHoach1}" onchange="state.hoSo.keHoach1=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">TIỂU MỤC TRỌNG TÂM PHẤN ĐẤU 2</label>
            <input type="text" class="form-input" value="${state.hoSo.keHoach2}" onchange="state.hoSo.keHoach2=this.value; ModuleDanhGia5T.luuThongTinHoSo();">
          </div>
          <div>
            <label class="form-label">NHẬN XÉT CỦA QUẢN LÝ TRỰC TIẾP</label>
            <textarea class="form-input" rows="2" onchange="state.hoSo.nhanXetQL=this.value; ModuleDanhGia5T.luuThongTinHoSo();">${state.hoSo.nhanXetQL}</textarea>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:14px;">
          <button class="btn-primary" onclick="ModuleDanhGia5T.inPhieu()">
            🖨️ Xuất / In Phiếu Tổng Hợp A4
          </button>
        </div>
      </div>
    `;
  }

  // 6. VẼ BIỂU ĐỒ RADAR SVG (SPIDER CHART) 5 TRỤC
  function renderRadarSVG(kqTC) {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const totalAxes = 5;

    // Tọa độ 5 trục
    const axesAngles = [];
    for (let i = 0; i < totalAxes; i++) {
      axesAngles.push((Math.PI * 2 / totalAxes) * i - Math.PI / 2);
    }

    // 5 vòng tròn đồng tâm (Mức 1 đến 5)
    let gridCircles = '';
    for (let level = 1; level <= 5; level++) {
      const r = (radius / 5) * level;
      let points = [];
      for (let i = 0; i < totalAxes; i++) {
        const x = center + r * Math.cos(axesAngles[i]);
        const y = center + r * Math.sin(axesAngles[i]);
        points.push(`${x},${y}`);
      }
      gridCircles += `<polygon points="${points.join(' ')}" fill="none" stroke="var(--border)" stroke-width="1" stroke-dasharray="${level === 5 ? 'none' : '2,2'}" />`;
    }

    // Các trục nan hoa
    let axisLines = '';
    let labels = '';
    const labelNames = ['Trung Thực', 'Trách Nhiệm', 'Thấu Cảm', 'Tận Tâm', 'Tri Ân'];

    for (let i = 0; i < totalAxes; i++) {
      const x = center + radius * Math.cos(axesAngles[i]);
      const y = center + radius * Math.sin(axesAngles[i]);
      axisLines += `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="var(--border)" stroke-width="1" />`;

      // Nhãn trục
      const lx = center + (radius + 22) * Math.cos(axesAngles[i]);
      const ly = center + (radius + 18) * Math.sin(axesAngles[i]);
      const tc = kqTC[i] || { mucDiem: 1 };
      labels += `
        <text x="${lx}" y="${ly}" font-size="11" font-weight="700" fill="var(--text)" text-anchor="middle" dominant-baseline="middle">
          ${labelNames[i]}
        </text>
        <text x="${lx}" y="${ly + 12}" font-size="10" font-weight="800" fill="${tc.mau}" text-anchor="middle" dominant-baseline="middle">
          Mức ${tc.mucDiem}
        </text>
      `;
    }

    // Đa giác điểm số đạt
    let dataPoints = [];
    for (let i = 0; i < totalAxes; i++) {
      const tc = kqTC[i] || { mucDiem: 1 };
      const score = Math.max(1, Math.min(5, tc.mucDiem));
      const r = (radius / 5) * score;
      const x = center + r * Math.cos(axesAngles[i]);
      const y = center + r * Math.sin(axesAngles[i]);
      dataPoints.push(`${x},${y}`);
    }

    return `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="max-width:100%; height:auto;">
        <!-- Vòng lưới -->
        ${gridCircles}
        <!-- Nan hoa -->
        ${axisLines}
        <!-- Vùng điểm đạt -->
        <polygon points="${dataPoints.join(' ')}" fill="rgba(2, 132, 199, 0.35)" stroke="#0284c7" stroke-width="2.5" />
        <!-- Các điểm chốt -->
        ${dataPoints.map((pt, idx) => {
          const coords = pt.split(',');
          const tc = kqTC[idx] || { mau: '#0284c7' };
          return `<circle cx="${coords[0]}" cy="${coords[1]}" r="4.5" fill="${tc.mau}" stroke="#ffffff" stroke-width="1.5" />`;
        }).join('')}
        <!-- Nhãn -->
        ${labels}
      </svg>
    `;
  }

  // 7. CÁC HÀM XỬ LÝ SỰ KIỆN TƯƠNG TÁC
  function chuyenTab(tabName) {
    state.activeTab = tabName;
    const vung = document.getElementById('vungNoiDung5T');
    if (vung) {
      const kq = tinhKetQua();
      vung.innerHTML = state.activeTab === 'danhgia' ? renderTabDanhGia(kq) : renderTabThuVien();
    }
    // Cập nhật nút tab
    document.querySelectorAll('.tab-btn-5t').forEach(b => {
      if (b.innerText.toLowerCase().includes(tabName === 'danhgia' ? 'thực hiện' : 'thư viện')) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  function locTC(tcId) {
    state.filterTC = tcId;
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'thuvien') {
      vung.innerHTML = renderTabThuVien();
    }
  }

  function locMuc(mucStr) {
    state.filterMuc = mucStr;
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'thuvien') {
      vung.innerHTML = renderTabThuVien();
    }
  }

  function capNhatTimKiem(val) {
    state.searchQuery = val;
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'thuvien') {
      vung.innerHTML = renderTabThuVien();
    }
  }

  function chonTCChấm(tcId) {
    state.selectedTCForAudit = tcId;
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'danhgia') {
      const kq = tinhKetQua();
      vung.innerHTML = renderTabDanhGia(kq);
    }
  }

  function capNhatTick(maTM, role, checked) {
    if (!state.chamDiem[maTM]) {
      state.chamDiem[maTM] = { nv: false, ql: false, note: '' };
    }
    state.chamDiem[maTM][role] = checked;
    saveToStorage();

    // Cập nhật lại giao diện đánh giá
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'danhgia') {
      const kq = tinhKetQua();
      vung.innerHTML = renderTabDanhGia(kq);
    }
  }

  function capNhatGhiChu(maTM, noteVal) {
    if (!state.chamDiem[maTM]) {
      state.chamDiem[maTM] = { nv: false, ql: false, note: '' };
    }
    state.chamDiem[maTM].note = noteVal;
    saveToStorage();
  }

  function luuThongTinHoSo() {
    saveToStorage();
    ShinApp.toast('Đã lưu thông tin hồ sơ và kết quả thẩm định', 'info');
  }

  function chonNhanhMuc(muc) {
    TIEU_CHI.forEach(tc => {
      tc.tieuMuc.forEach(tm => {
        const levelNum = parseInt(tm.muc.replace('M', ''));
        if (levelNum <= muc) {
          state.chamDiem[tm.ma] = { nv: true, ql: true, note: state.chamDiem[tm.ma]?.note || 'Đạt theo chuẩn Mức ' + levelNum };
        } else {
          state.chamDiem[tm.ma] = { nv: false, ql: false, note: '' };
        }
      });
    });
    saveToStorage();
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'danhgia') {
      const kq = tinhKetQua();
      vung.innerHTML = renderTabDanhGia(kq);
    }
    ShinApp.toast(`Đã áp dụng mẫu đạt Mức ${muc} cho 5 Tiêu chí!`, 'info');
  }

  function xoaTrang() {
    state.chamDiem = {};
    saveToStorage();
    const vung = document.getElementById('vungNoiDung5T');
    if (vung && state.activeTab === 'danhgia') {
      const kq = tinhKetQua();
      vung.innerHTML = renderTabDanhGia(kq);
    }
    ShinApp.toast('Đã làm mới toàn bộ bảng chấm điểm', 'info');
  }

  function taiTaiLieuMD() {
    window.open('assets/docs/BO_TIEU_CHI_DANH_GIA_5T.md', '_blank');
  }

  // 8. CHỨC NĂNG IN PHIẾU TỔNG HỢP A4 (CHUẨN PHẦN IV)
  function inPhieu() {
    const kq = tinhKetQua();
    const hs = state.hoSo;

    const printWin = window.open('', '_blank');
    const htmlPrint = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="utf-8">
        <title>PHIẾU TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ 5T - ${hs.hoTen}</title>
        <style>
          @page { size: A4 portrait; margin: 15mm 15mm 15mm 15mm; }
          body { font-family: "Times New Roman", Times, serif; font-size: 13pt; line-height: 1.4; color: #000; margin: 0; padding: 0; }
          .head-title { text-align: center; font-weight: bold; font-size: 16pt; text-transform: uppercase; margin-bottom: 4px; }
          .head-sub { text-align: center; font-style: italic; font-size: 11pt; margin-bottom: 18px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; font-size: 12pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 16px; font-size: 11pt; }
          th, td { border: 1px solid #000; padding: 6px 8px; text-align: left; vertical-align: middle; }
          th { background-color: #f2f2f2; text-align: center; font-weight: bold; }
          .text-center { text-align: center; }
          .text-right { text-align: right; }
          .sign-table { width: 100%; border: none; margin-top: 30px; }
          .sign-table td { border: none; text-align: center; vertical-align: top; padding: 4px; }
          .sign-title { font-weight: bold; margin-bottom: 60px; }
          .badge { display: inline-block; padding: 2px 6px; font-weight: bold; border: 1px solid #000; }
        </style>
      </head>
      <body>
        <div class="head-title">PHIẾU TỔNG HỢP KẾT QUẢ ĐÁNH GIÁ VĂN HÓA HÀNH VI 5T</div>
        <div class="head-sub">(Phiên bản chuẩn hóa 5 Tiêu chí cốt lõi – Tham chiếu Bộ 83 Tiêu chí Chất lượng Bộ Y tế)</div>

        <div class="info-grid">
          <div><strong>Họ và tên:</strong> ${hs.hoTen}</div>
          <div><strong>Mã nhân viên:</strong> ${hs.maNV}</div>
          <div><strong>Vị trí công tác:</strong> ${hs.viTri}</div>
          <div><strong>Khoa/Phòng/Đơn vị:</strong> ${hs.donVi}</div>
          <div><strong>Kỳ đánh giá:</strong> ${hs.kyDanhGia}</div>
          <div><strong>Quản lý thẩm định:</strong> ${hs.quanLy}</div>
        </div>

        <div style="font-weight: bold; margin-bottom: 6px;">1. BẢNG THẨM ĐỊNH TỔNG HỢP 5 TIÊU CHÍ</div>
        <table>
          <thead>
            <tr>
              <th style="width: 12%;">Mã TC</th>
              <th>Tên tiêu chí đánh giá</th>
              <th style="width: 18%;">Số TM đạt / Tổng</th>
              <th style="width: 18%;">Mức điểm đạt</th>
              <th style="width: 20%;">Chữ ký Quản lý</th>
            </tr>
          </thead>
          <tbody>
            ${kq.ketQuaTC.map(k => `
              <tr>
                <td class="text-center"><strong>${k.ma}</strong></td>
                <td><strong>${k.ten}</strong></td>
                <td class="text-center">${k.soTMDuyet} / ${k.tongTM}</td>
                <td class="text-center"><strong>Mức ${k.mucDiem}</strong> (M${k.mucDiem})</td>
                <td></td>
              </tr>
            `).join('')}
            <tr style="font-weight: bold; background-color: #fafafa;">
              <td colspan="2" class="text-center">TỔNG ĐIỂM (Tối đa 25 điểm)</td>
              <td class="text-center">${kq.ketQuaTC.reduce((a, b) => a + b.soTMDuyet, 0)} / 76 TM</td>
              <td class="text-center">${kq.tongDiem} / 25 điểm</td>
              <td></td>
            </tr>
            <tr style="font-weight: bold; background-color: #f2f2f2;">
              <td colspan="2" class="text-center">ĐIỂM TRUNG BÌNH (ĐTB = Tổng / 5)</td>
              <td colspan="3" style="font-size: 13pt;">
                <strong>ĐTB = ${kq.dtb} / 5.0</strong> &nbsp;—&nbsp; 
                Xếp loại: <u>${kq.xepLoai}</u>
              </td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 12px; font-size: 11pt; line-height: 1.5;">
          <strong>2. Kế hoạch bồi dưỡng & Phấn đấu kỳ tới:</strong><br>
          • <em>Tiểu mục trọng tâm 1:</em> ${hs.keHoach1 || '...................................................................................................................................................'}<br>
          • <em>Tiểu mục trọng tâm 2:</em> ${hs.keHoach2 || '...................................................................................................................................................'}<br>
          • <em>Nhận xét của Quản lý:</em> ${hs.nhanXetQL || '...................................................................................................................................................'}
        </div>

        <table class="sign-table">
          <tr>
            <td style="width: 33%;">
              <div>Ngày ..... tháng ..... năm 202...</div>
              <div class="sign-title">NHÂN VIÊN TỰ ĐÁNH GIÁ</div>
              <div><em>(Ký & ghi rõ họ tên)</em></div>
            </td>
            <td style="width: 33%;">
              <div>Ngày ..... tháng ..... năm 202...</div>
              <div class="sign-title">QUẢN LÝ THẨM ĐỊNH</div>
              <div><em>(Ký & ghi rõ họ tên)</em></div>
            </td>
            <td style="width: 34%;">
              <div>Ngày ..... tháng ..... năm 202...</div>
              <div class="sign-title">BAN LÃNH ĐẠO / NHÂN SỰ</div>
              <div><em>(Ký & ghi rõ họ tên)</em></div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(htmlPrint);
    printWin.document.close();
    setTimeout(() => {
      printWin.print();
    }, 500);
  }

  return {
    ma,
    ten,
    bieuTuong,
    paletteMacDinh,
    render,
    chuyenTab,
    locTC,
    locMuc,
    capNhatTimKiem,
    chonTCChấm,
    capNhatTick,
    capNhatGhiChu,
    luuThongTinHoSo,
    chonNhanhMuc,
    xoaTrang,
    taiTaiLieuMD,
    inPhieu
  };
})();
