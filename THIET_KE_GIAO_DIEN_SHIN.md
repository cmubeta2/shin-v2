# QUY CHUẨN THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG SHIN (SHIN AIOS MASTER UX/UI SPECIFICATION)

> **Mã tài liệu:** `SHIN-SPEC-UIUX-v2.6.4`  
> **Phiên bản chuẩn hóa:** **v2.6.4** (Cập nhật toàn diện ngày: **01/11/2026**)  
> **Đơn vị ban hành:** Shin (Digital Familiar) & Huỳnh Trường Thanh Tâm (Sếp)  
> **Phạm vi áp dụng:** Toàn bộ hệ sinh thái Web App, Dashboard, Micro-modules AIOS v2, Xưởng Web và các Landing Page vệ tinh.  
> **Mục đích tối thượng:** Cung cấp bộ quy chuẩn bất biến, thông số kỹ thuật chính xác và bộ mã nguồn chuẩn để Kỹ sư Lập trình hoặc AI Agent dựng ứng dụng mới **đạt chuẩn công thái học 100%, đồng bộ tuyệt đối với SHIN AIOS v2 và triệt tiêu vĩnh viễn mọi lỗi vặt**.

---

## 📑 MỤC LỤC CHI TIẾT

1. [Chương 1: 10 Nguyên Tắc Bất Biến (Immutable Laws)](#chương-1-10-nguyên-tắc-bất-biến-immutable-laws)
2. [Chương 2: Hệ Thống Màu Sắc & Design Tokens (8 Palettes)](#chương-2-hệ-thống-màu-sắc--design-tokens-8-palettes)
3. [Chương 3: Typography, Khoảng Cách & Động Lực Học (Motion System)](#chương-3-typography-khoảng-cách--động-lực-học-motion-system)
4. [Chương 4: Bố Cục Khung Trang & Đáp Ứng Thiết Bị (Shell Architecture)](#chương-4-bố-cục-khung-trang--đáp-ứng-thiết-bị-shell-architecture)
5. [Chương 5: Danh Mục Thành Phần Chuẩn (Component Catalog & Classes)](#chương-5-danh-mục-thành-phần-chuẩn-component-catalog--classes)
6. [Chương 6: Hệ Thống Phòng Ngự Triệt Tiêu 12 Lỗi Vặt (Zero-Bug Defense Guide)](#chương-6-hệ-thống-phòng-ngự-triệt-tiêu-12-lỗi-vặt-zero-bug-defense-guide)
7. [Chương 7: Thư Viện Hàm Tiện Ích JavaScript (Helper Toolkit)](#chương-7-thư-viện-hàm-tiện-ích-javascript-helper-toolkit)
8. [Chương 8: Bộ Khung Mã Nguồn Chép Dùng Ngay (Starter Boilerplate)](#chương-8-bộ-khung-mã-nguồn-chép-dùng-ngay-starter-boilerplate)
9. [Chương 9: Quy Trình Kiểm Thử & Tiêu Chí Nghiệm Thu (DoD Gate)](#chương-9-quy-trình-kiểm-thử--tiêu-chí-nghiệm-thu-dod-gate)

---

## CHƯƠNG 1: 10 NGUYÊN TẮC BẤT BIẾN (IMMUTABLE LAWS)

1. **Ưu tiên Điện thoại trước (Mobile First 320px – 414px):**
   * Mọi màn hình phải hiển thị hoàn hảo ở chiều rộng nhỏ nhất là **320px**.
   * **Cấm tuyệt đối cuộn ngang** ở mọi độ phân giải (`body { overflow-x: hidden; width: 100%; }`). Văn bản dài phải tự động xuống dòng hoặc cắt bằng dấu ba chấm `…` (`text-overflow: ellipsis; white-space: nowrap; overflow: hidden;`).
2. **Kiến trúc 3 Khung Cố Định & Tấm Cài Đặt Bắt Buộc (Fixed Shell & Universal Settings):**
   * **Header (Topbar) ghim đỉnh:** Cao chính xác `56px`, có logo, tiêu đề, badge phiên bản nhỏ (20px) và nút hành động đơn.
   * **Thanh đáy (Bottom Navigation) ghim đáy:** Cao chính xác `64px`, chứa đúng 5 nút điều hướng chính, luôn cố định ở chân màn hình trên di động (có thể bật/tắt trong Cài đặt).
   * **Thanh trái (Decagon Rail / Drawer):** Mặc định mở rộng 248px trên Desktop (≥ 1024px); chuyển thành dạng **Mấu mép trái di động** ở 66% chiều cao trên màn hình nhỏ (< 768px).
   * **Vùng nội dung cuộn ở giữa:** Độc lập, căn giữa, giới hạn chiều rộng tối đa (di động 100%, tablet max 760px, desktop max 960px).
   * **LUÔN CÓ TẤM / TRANG CÀI ĐẶT (Bắt buộc):** Mọi ứng dụng bắt buộc phải tích hợp Tấm Cài Đặt (Settings Sheet), trong đó **bắt buộc có phần chọn định dạng thanh mép trái (Tự động / Hàng icon / Mép trái 66%)** và **công tắc BẬT / TẮT thanh điều hướng đáy (Nav Bar)** để người dùng tùy biến không gian xem.
3. **Vùng Bấm Công Thái Học Chuẩn Quốc Tế (Touch Target Size ≥ 44 × 44px):**
   * Mọi thành phần người dùng có thể chạm/bấm (nút, icon, ô chọn checkbox, dòng danh sách, switch gạt, tab, nút đóng modal `✕`) **bắt buộc phải có diện tích chạm tối thiểu 44 × 44px**.
   * Nếu icon chỉ có kích thước 18–24px, phải sử dụng vùng đệm `padding` hoặc đặt `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center;`.
4. **Ô Nhập Liệu Chống Phóng To iOS (iOS Auto-Zoom Defense):**
   * Trên điện thoại, mọi ô nhập (`<input>`, `<select>`, `<textarea>`) bắt buộc phải có `font-size: 16px` (hoặc `font-size: max(16px, calc(14px * var(--font-scale)))`).
   * *Lý do:* iOS Safari tự động phóng to toàn bộ trang web nếu người dùng chạm vào ô nhập có cỡ chữ < 16px, làm vỡ khung hiển thị.
5. **Cấu Trúc Mở Màn Hero Card Chuẩn Mực:**
   * Mỗi màn hình/phân hệ bắt buộc mở đầu bằng **1 Hero Card duy nhất**:
     * Lời chào thông minh theo thời gian + tên người dùng (VD: *Chào buổi sáng, Tâm ☀️*).
     * Ngày tháng tiếng Việt định dạng `Thứ, dd/mm/yyyy`.
     * **Tối đa 3 ô số liệu tổng quan (`.tq-3so`)**: Chữ số lớn (22px/800), có màu ngữ nghĩa, bấm được để kích hoạt lọc danh sách bên dưới.
     * **1 nút hành động chính (Primary CTA)**: To, cao 48px, rộng hết thẻ (100%), nền `--primary`, chữ đậm.
6. **Xóa Bỏ Triệt Để Hộp Thoại Xác Nhận Cũ Kỹ ("Bạn có chắc?"):**
   * Nghiêm cấm dùng `window.confirm()` hoặc `window.alert()` vì gây gián đoạn tâm lý và trải nghiệm người dùng.
   * **Việc có thể hoàn tác (Undoable):** Thực hiện ngay trên giao diện và hiển thị Toast **Hoàn tác 6 giây** có thanh tiến trình đếm ngược; chỉ gửi tín hiệu về máy chủ sau khi hết 6 giây.
   * **Việc nguy hiểm không thể hoàn tác (Destructive):** Áp dụng cơ chế **Bấm 2 lần trong 5 giây (Double-tap Confirmation)**: Lần 1 hiện toast vàng nhắc nhở kèm rung cảnh báo, bấm lại lần 2 trong vòng 5 giây mới thực thi.
7. **Thông Báo Toast Chỉ Khi Kết Quả Không Thấy Trực Tiếp:**
   * Không bật toast khi kết quả thao tác đã hiển thị rõ ràng trên màn hình (đổi theme, chuyển tab, chọn filter). Khi đó chỉ phản hồi bằng rung nhẹ (Haptic feedback) hoặc chuyển đổi trạng thái nút.
   * Chỉ bật Toast khi: Báo lỗi mạng/máy chủ, tác vụ chạy ngầm hoàn tất, hoặc kích hoạt thanh Hoàn tác 6 giây.
8. **Bản Địa Hóa Tiếng Việt Tuyệt Đối (Localization & Numbering):**
   * 100% giao diện sử dụng Tiếng Việt trong sáng, ngắn gọn, hướng dẫn hành động cụ thể.
   * **Quy chuẩn số kiểu Việt Nam:** Dùng dấu chấm `.` để phân tách hàng nghìn, dấu phẩy `,` cho phần thập phân (VD: `1.250.000 đ`, `86,5%`, `12,5 tr`, `1,2 tỷ`).
   * **Quy chuẩn ngày giờ:** Luôn là `dd/mm/yyyy` (VD: `01/11/2026`) và giờ `HH:mm` (VD: `18:30`).
9. **Màu Sắc Mang Ngữ Nghĩa Cố Định (Semantic Color Integrity):**
   * **Đỏ (`--c-red`):** Quá hạn, lỗi, điểm liệt, cảnh báo khẩn cấp, xóa dữ liệu.
   * **Vàng (`--c-yellow`):** Chờ duyệt, sắp tới hạn, cần lưu ý, dữ liệu MẪU (Demo).
   * **Xanh lá (`--c-green`):** Đạt chuẩn, hoàn thành, doanh thu dương, hệ thống trực tuyến (`Live`).
   * **Xanh dương (`--c-blue`):** Thông tin điều hướng, liên kết, dữ liệu tiến độ.
   * **Xám (`--c-gray`):** Trạng thái tắt, vô hiệu hóa, thứ yếu.
   * Cả chế độ Sáng (Light) và Tối (Dark) đều phải đạt độ tương phản chuẩn WCAG 2.1 AA (≥ 4.5:1). Ở chế độ Tối, triệt tiêu toàn bộ bóng đổ (`--shadow: none;`).
10. **Bảo Mật Hiển Thị & Toàn Vẹn Dữ Liệu (Security & Anti-XSS):**
    * Mọi dữ liệu biến từ máy chủ hoặc người dùng nhập phải đi qua hàm `esc()` trước khi ghép chuỗi HTML.
    * Tuyệt đối không bao giờ hiển thị token, mật khẩu, API key, hoặc link chứa mã định danh bí mật ra màn hình.
    * Các ô nhập bí mật bắt buộc dùng `type="password"`, sau khi lưu thành công phải xóa rỗng giá trị khỏi DOM.

---

## CHƯƠNG 2: HỆ THỐNG MÀU SẮC & DESIGN TOKENS (8 PALETTES)

Mọi thành phần giao diện **chỉ được phép sử dụng biến CSS Tokens**, tuyệt đối không viết mã màu Hex/RGB trực tiếp trong component.

### 2.1 Bảng Biến Cốt Lõi Của 1 Palette

```css
:root {
  /* Màu chính & Trạng thái tương tác */
  --primary: #0284c7;           /* Màu thương hiệu chính (Nút chính, mục đang chọn, border active) */
  --primary-hover: #0369a1;     /* Màu khi rê chuột / active */
  --primary-soft: rgba(2, 132, 199, 0.15); /* Nền nhạt 12-18% cho badge, item active */
  --on-primary: #ffffff;        /* Màu chữ hiển thị trên nền --primary */

  /* Màu nhấn (Accent) */
  --accent: #38bdf8;            /* Vạch tiêu đề trang, viền focus ô nhập */
  --accent-soft: rgba(56, 189, 248, 0.15);

  /* Nền, Thẻ & Đường viền */
  --bg: #f8fafc;                /* Nền toàn trang */
  --bg-sub: #f1f5f9;            /* Nền rất nhạt cho thanh tiến độ, nhật ký, ô phụ */
  --card: #ffffff;              /* Nền thẻ nội dung, modal, bảng */
  --border: #cbd5e1;            /* Đường viền thẻ, khung phân cách chính */
  --border-soft: #e2e8f0;       /* Đường viền kẻ dòng nhạt danh sách */

  /* Văn bản (Typography) */
  --text: #0f172a;              /* Màu chữ chính (độ tương phản cao) */
  --text-muted: #64748b;        /* Màu chữ phụ, nhãn, mô tả ngắn */

  /* Header & Thanh bên */
  --sidebar-bg: linear-gradient(135deg, #0f172a, #1e293b); /* Gradient nền header */
  --sidebar-text: #f8fafc;      /* Chữ trên header */
  --sidebar-text-muted: #94a3b8;
  --sidebar-border: rgba(255, 255, 255, 0.12);

  /* Bo góc (Radii) */
  --card-radius: 14px;          /* Bo góc thẻ nội dung */
  --hero-radius: 18px;          /* Bo góc Hero Card mở màn */
  --btn-radius: 10px;           /* Bo góc nút bấm, ô nhập liệu */

  /* Bóng đổ & Tỷ lệ font */
  --shadow: 0 4px 16px rgba(0, 0, 0, 0.08); /* Chế độ tối tự động gán none */
  --font-scale: 1.0;            /* Tỷ lệ cỡ chữ: 1.0 (vừa) - 1.1 (lớn) - 1.2 (rất lớn) */
}
```

### 2.2 Ma Trận 8 Bảng Màu Chuẩn Hóa Theo Ngành

| ID Palette (`data-palette`) | Ứng Dụng Nghiệp Vụ | `--primary` (Sáng · Tối) | `--accent` (Sáng · Tối) | `--bg` (Sáng · Tối) | `--card` (Sáng · Tối) | Bo góc (Thẻ / Hero / Nút) | Đặc tính nhận diện Header |
|---|---|---|---|---|---|---|---|
| `gold` *(Mặc định)* | Hành chính, Quản trị tổng thể, PTKH | `#dc2626` · `#ef4444` | `#d4a017` · `#f59e0b` | `#f4f5f7` · `#0c0d12` | `#ffffff` · `#161822` | 14px / 18px / 10px | Vàng Hoàng Kim `linear-gradient(165deg, #f0cf5e, #d4a017, #a97e10)` chữ `#3a2a06` |
| `executive` | Bàn làm việc Lãnh đạo, Điều hành Hub | `#0284c7` · `#38bdf8` | `#38bdf8` · `#7dd3fc` | `#f8fafc` · `#050811` | `#ffffff` · `#0e1526` | 12px / 14px / 8px | Xanh Navy Đậm `linear-gradient(135deg, #0f172a, #1e293b)` |
| `clinical` | Y tế, Khám chữa bệnh ngoại trú, ACHSI | `#0f766e` · `#2dd4bf` | `#0d9488` · `#5eead4` | `#f8fafc` · `#031313` | `#ffffff` · `#092020` | 16px / 20px / 12px | Xanh Ngọc Y Tế Teal 700 đạt chuẩn siêu tương phản WCAG AAA |
| `growth` | Tuyển sinh, CRM Khách hàng, Bán hàng | `#7c3aed` · `#a855f7` | `#f97316` · `#fb923c` | `#faf5ff` · `#0e0517` | `#ffffff` · `#1c0d2e` | 18px / 22px / 12px | Tím Tăng Trưởng kết hợp Cam Năng Động |
| `nordic` | Thư viện Tri thức, Second Brain, Quy trình SOP | `#475569` · `#94a3b8` | `#0ea5e9` · `#38bdf8` | `#f8fafc` · `#090d16` | `#ffffff` · `#111827` | 10px / 14px / 8px | Phong cách Tối giản Bắc Âu thanh lịch, tập trung đọc |
| `cyber` *(Chuyên Tối)* | Giám sát kỹ thuật, Automation, Terminal AI | `#10b981` · `#10b981` | `#06b6d4` · `#06b6d4` | `#04090b` · `#04090b` | `#081418` · `#081418` | 8px / 10px / 6px | Đen Huyền Ảo phối Neon Green / Neon Cyan |
| `crimson` | Ban Kiểm soát, Kỷ luật, Quản trị rủi ro | `#991b1b` · `#f87171` | `#ea580c` · `#fb923c` | `#fff1f2` · `#110507` | `#ffffff` · `#1f0a0e` | 12px / 16px / 8px | Đỏ Thẩm Quyền nghiêm ngặt, chỉ số kiểm soát |
| `mocha` | Nhân sự, Xếp lịch trực tuần, Đời sống nội bộ | `#854d0e` · `#facc15` | `#ca8a04` · `#fde047` | `#fefce8` · `#120e03` | `#ffffff` · `#211907` | 14px / 18px / 10px | Nâu Cafe ấm áp, kết nối con người |

### 2.3 Hệ Thống Màu Ngữ Nghĩa (Semantic Fixed Colors)

```css
:root {
  --c-red: #dc2626;         --c-red-soft: rgba(220, 38, 38, 0.15);     /* Lỗi, khẩn cấp */
  --c-yellow: #b45309;      --c-yellow-soft: rgba(180, 83, 9, 0.15);   /* Chờ duyệt, chú ý */
  --c-green: #15803d;       --c-green-soft: rgba(21, 128, 61, 0.15);   /* Hoàn tất, đạt */
  --c-blue: #2563eb;        --c-blue-soft: rgba(37, 99, 235, 0.14);    /* Thông tin, link */
  --c-gray: #6b7280;        --c-gray-soft: rgba(107, 114, 128, 0.14);  /* Đóng, chưa có */
}
[data-theme="dark"] {
  --c-red: #f87171;         --c-red-soft: rgba(248, 113, 113, 0.20);
  --c-yellow: #f59e0b;      --c-yellow-soft: rgba(245, 158, 11, 0.20);
  --c-green: #4ade80;       --c-green-soft: rgba(74, 222, 128, 0.20);
  --c-blue: #60a5fa;        --c-blue-soft: rgba(96, 165, 250, 0.20);
  --c-gray: #9ca3af;        --c-gray-soft: rgba(156, 163, 175, 0.18);
  --shadow: none !important;
}
```

### 2.4 Cơ Chế Điều Khiển 4 Chế Độ Hiển Thị & 3 Cỡ Chữ

* **4 Chế độ hiển thị (`data-theme`):**
  * `light`: Cố định Sáng.
  * `dark`: Cố định Tối.
  * `auto`: Tự động đồng bộ theo cấu hình hệ điều hành thiết bị (`prefers-color-scheme`).
  * `time`: Tự động theo chu kỳ ngày đêm Việt Nam (06:00 – 18:00 bật Sáng, từ 18:01 – 05:59 bật Tối).
* **3 Mức cỡ chữ (`data-cochu`):**
  * `vua` (Mặc định): `--font-scale: 1.0` (Phù hợp mắt thanh niên, giao diện sắc nét).
  * `lon`: `--font-scale: 1.1` (Tăng 10% kích thước chữ toàn diện).
  * `rat_lon`: `--font-scale: 1.2` (Tăng 20% kích thước chữ, tối ưu cho lãnh đạo lớn tuổi).

---

## CHƯƠNG 3: TYPOGRAPHY, KHOẢNG CÁCH & ĐỘNG LỰC HỌC (MOTION SYSTEM)

### 3.1 Bảng Phân Tầng Typography Chuẩn Mực

Phông chữ tiêu chuẩn: `'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`. Chữ số liệu dùng kèm font số đơn cách `'JetBrains Mono', monospace`.

| Cấp Bậc / Thành Phần | Cỡ Chữ CSS (`calc(...)`) | Độ Đậm (Font Weight) | Quy Cách Trình Bày & Ứng Dụng |
|---|---|---|---|
| Tiêu đề trang (`.page-title`) | `calc(20px * var(--font-scale))` | 800 (Bold Đậm) | Có vạch đứng 4px `--accent` bên trái |
| Số lớn Hero (`.tq-so`) | `calc(22px * var(--font-scale))` | 800 (Rất đậm) | Chữ số to nổi bật, tô màu ngữ nghĩa |
| Tiêu đề thẻ (`.card-title`, `.dong-title`)| `calc(15px * var(--font-scale))` | 700 (Đậm) | Tên công việc, tên hồ sơ, tiêu đề ca |
| Chữ nội dung chính (`body`) | `calc(14px * var(--font-scale))` | 400 – 500 | Văn bản đọc, chi tiết nội dung, mô tả |
| Chữ phụ, nhãn nhỏ (`.text-muted`) | `calc(12.5px * var(--font-scale))`| 400 – 500 | Thời gian, người gửi, ghi chú phụ |
| Nhãn nhóm IN HOA (`.hn-tieu`) | `calc(13.5px * var(--font-scale))`| 700 | Chữ IN HOA, `letter-spacing: 0.05em;` |
| Nhãn thanh đáy (`.bottom-nav-label`) | `calc(11px * var(--font-scale))` | 600 (đang chọn 800)| Ngay dưới icon thanh đáy |
| Ô nhập liệu di động (`.form-input`) | `max(16px, calc(14px * var(--font-scale)))` | 500 | Bắt buộc ≥ 16px để chống phóng to iOS |

### 3.2 Hệ Thống Khoảng Cách Nhịp Chẵn (Even Spacing Scale)

Khoảng cách tuân thủ nghiêm ngặt bậc bước: **2 – 4 – 6 – 8 – 10 – 12 – 14 – 16 – 18 – 24 – 32px**.
* Lề nội dung di động: `12px` (màn hình hẹp ≤ 360px dùng `10px`).
* Khoảng cách giữa các thẻ danh sách: `12px – 14px`.
* Đệm bên trong thẻ thường (`.card`): `14px – 16px`.
* Đệm bên trong Hero Card (`.hn-hero`): `18px`.

### 3.3 Động Lực Học Chuyển Động (Animate UI Spring Physics)

Mọi hiệu ứng chuyển động trong hệ thống đều tuân thủ các nguyên tắc sau:

```css
:root {
  /* Tokens Spring Physics & Asymmetric Timing */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* Chuẩn Apple-like, mượt, nảy nhẹ */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);      /* Nhanh dứt khoát */
  --dur-tap: 0.1s;
  --dur-fast: 0.16s;
  --dur-normal: 0.25s;
}

/* 1. Hiệu ứng chạm / bấm vật lý (Haptic Tap Feel) */
.btn-primary:active, .btn-secondary:active, .btn-icon:active, .hn-dong:active {
  transform: scale(0.96);
  transition: transform var(--dur-tap) var(--ease-spring);
}

/* 2. Hiệu ứng xuất hiện êm ái & Đóng dứt khoát (Asymmetric Timing) */
.modal-overlay.open .modal-sheet {
  transform: translateY(0) scale(1);
  transition: transform var(--dur-normal) var(--ease-spring);
}
.modal-overlay:not(.open) .modal-sheet {
  transform: translateY(20px) scale(0.96);
  transition: transform var(--dur-fast) var(--ease-exit); /* Ra nhanh 0.16s */
}

/* 3. Tự động ngắt khi người dùng bật giảm chuyển động (Accessibility) */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001s !important;
    transition-duration: 0.001s !important;
    scroll-behavior: auto !important;
  }
}
```

---

## CHƯƠNG 4: BỐ CỤC KHUNG TRANG & ĐÁP ỨNG THIẾT BỊ (SHELL ARCHITECTURE)

### 4.1 Sơ Đồ Khung Màn Hình Tổng Thể

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TOPBAR HEADER (Cố định 56px + safe-area-inset-top)                           │
│ [Logo 24px] SHIN AIOS [Pill Live/Demo 20px]           (⚡ Duyệt 1-chạm + [4])│
├─────────┬───────────────────────────────────────────────────────────────────┤
│         │ VÙNG NỘI DUNG CUỘN Ở GIỮA (Max 760px di động / 960px Desktop)     │
│  RAIL   │ ▌Tiêu đề trang (Vạch trái 4px --accent)                  [↻ Làm mới]│
│  TRÁI   │ ┌ HERO CARD: Chào buổi sáng · Ngày · [3 Số liệu] · [ NÚT CHÍNH ] ┐│
│  56px   │ └────────────────────────────────────────────────────────────────┘│
│  (Desktop│ NHÃN NHÓM IN HOA · Số lượng mục                                   │
│  248px) │ ┌────────────────────────────────────────────────────────────────┐│
│         │ │ [Icon 40px] Dòng danh sách công việc chính               [Badge]││
│  Mobile:│ └────────────────────────────────────────────────────────────────┘│
│  Mấu mép│ ▸ Khối gập chi tiết ít dùng (Accordion Details)                   │
│  trái » │ (Padding đáy bù 80px để không bị thanh đáy che mất nội dung)      │
├─────────┴───────────────────────────────────────────────────────────────────┤
│ FIXED BOTTOM NAV (Cố định 64px + safe-area-inset-bottom · Đúng 5 nút bấm)   │
│   [🏠 Hôm nay]   [⚡ Phê duyệt]   [🌟 Hay dùng]   [🤝 Đối tác]   [⚙️ Cài đặt]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Chi Tiết Các Bộ Phận Khung

1. **Thanh Topbar 56px (Sticky Header):**
   * Bên trái: Logo SVG Shin + Chữ `SHIN AIOS` + Badge trạng thái phiên bản siêu nhỏ (`height: 20px; font-size: 10px; font-weight: 800; border-radius: 999px;`). Bấm vào mở modal kết nối Token.
   * Bên phải: **DUY NHẤT 1 nút tia sét `⚡`** mở Trung tâm Phê duyệt 1-chạm (`#countPendingApproval` hiện số lượng đỏ nổi góc trên).
2. **Thanh Decagon Rail (Thập Diện 10 Mảng Nghiệp Vụ):**
   * **Trên Desktop (≥ 1024px):** Mặc định bung rộng 248px hiển thị đầy đủ tên nhóm và tên mảng. Nhớ trạng thái thu/bung vào `localStorage`.
   * **Trên Tablet (768px – 1023px):** Thu gọn 56px chỉ hiện icon, bấm vào thì trượt đè lên nội dung có kèm lớp mờ `backdrop`.
   * **Trên Điện thoại (< 768px):** Mặc định kích hoạt kiểu **Mấu mép trái di động (`body.kieu-mep`)**:
     * Thanh rail thu lại thành 1 vạch màu `--primary` mảnh 4px ở mép trái màn hình.
     * Mấu kéo `»` có kích thước `24 × 44px` (nằm gọn trong vùng bấm 44 × 52px), mặc định đặt ở vị trí **66% chiều cao màn hình** (vừa tầm ngón tay cái bên trái).
     * Mấu có thể giữ để kéo rê lên/xuống; vị trí lưu tự động vào `localStorage`. Khi có thông báo mới, mấu hiển thị chấm đỏ nhấp nháy thu hút sự chú ý.
     * Chân rail có 2 nút tiện ích cố định: `📲 Cài PWA` và `⚙️ Cài đặt`.
3. **Thanh Fixed Bottom Navigation 64px (Thanh Đáy):**
   * Ghim cố định ở chân màn hình, có đúng **5 nút bấm** đều nhau.
   * Mỗi nút gồm: Icon 20px ở trên + Nhãn chữ 11px ở dưới. Vùng bấm chiếm trọn chiều cao 64px.
   * **Quy tắc bắt buộc 1 (Tự động ẩn khi gõ form):** Khi người dùng đang focus gõ form nhập liệu trên điện thoại, thanh đáy phải **tự động ẩn đi** để tránh bàn phím ảo đẩy bung giao diện.
   * **Quy tắc bắt buộc 2 (Cho phép Tắt hoàn toàn trong Cài đặt):** Cung cấp công tắc Bật/Tắt trong Cài đặt để người dùng chuyển sang chế độ xem toàn màn hình (Full-screen view).

### 4.3 Quy Chuẩn Tấm Cài Đặt Bắt Buộc (Universal Settings Sheet)

Mọi app và module thuộc hệ thống SHIN bắt buộc phải có nút mở **Tấm Cài Đặt (`#settingsModal`)**. Trong tấm cài đặt phải có đầy đủ 5 khối tùy biến chuẩn mực:

1. **Chế độ Hiển Thị (Theme Mode):** 4 nút chọn (`Sáng` · `Tối` · `Theo máy` · `Theo giờ`).
2. **Phong cách Giao diện (8 Palettes):** Lưới chọn bảng màu (`gold`, `executive`, `clinical`, `growth`, `nordic`, `cyber`, `crimson`, `mocha`).
3. **Cỡ chữ Toàn Ứng Dụng:** 3 mức chọn (`Vừa 1.0` · `Lớn 1.1` · `Rất lớn 1.2`).
4. **Định Dạng Thanh Danh Mục Mép Trái (Decagon Rail Format):**
   * `✨ Tự động`: Thiết bị ≤ 360px dùng Mép trái, màn hình lớn hơn dùng Hàng icon.
   * `▥ Hàng icon`: Giữ thanh rail 56px hiển thị icon cố định bên trái.
   * `⟫ Mép trái`: Thu thanh rail thành vạch 4px ở mép trái; hiển thị mấu kéo `»` (24 × 44px) đặt ở vị trí **66% chiều cao màn hình** (vừa tầm ngón tay cái bên trái). Cho phép giữ và kéo rê mấu dọc mép màn hình để đặt vị trí vừa tay nhất, vị trí lưu tự động vào `localStorage` (`shin_tay_top`).
5. **Công Tắc Bật / Tắt Thanh Điều Hướng Đáy (Bottom Nav Bar Toggle):**
   * Tích hợp công tắc chuyển mạch `.cong-tac`:
     * Khi **BẬT (Mặc định)**: Thanh đáy hiển thị bình thường, vùng nội dung có đệm đáy bù `80px`.
     * Khi **TẮT (Ẩn Nav Bar)**: Thêm class `.an-navbar` lên `<html>` và `<body>`, thanh đáy ẩn hoàn toàn (`display: none !important;`), vùng nội dung co khoảng đệm đáy về `16px + env(safe-area-inset-bottom)` mang lại trải nghiệm xem toàn màn hình tối đa.
     * Trạng thái lưu bền vững vào `localStorage` (`shin_navbar: '1' | '0'`).
     * Khi thanh đáy tắt, người dùng vẫn điều hướng dễ dàng qua: Mấu mép trái `rail-tay`, nút trên Header hoặc mở lại Cài đặt từ Header/Rail.

---

## CHƯƠNG 5: DANH MỤC THÀNH PHẦN CHUẨN (COMPONENT CATALOG & CLASSES)

Mọi app và module thuộc hệ thống SHIN bắt buộc phải sử dụng chính xác các tên class và cấu trúc HTML chuẩn dưới đây:

### 5.1 Hero Card Chuẩn Mở Màn (`.hn-hero`)

```html
<section class="hn-hero">
  <div class="hn-hero-top">
    <div>
      <div class="hn-chao" id="lblLoiChao">Chào buổi sáng, Sếp ☀️</div>
      <div class="hn-ngay" id="lblNgayThang">T2, 01/11/2026</div>
    </div>
    <div class="status-badge live">🟢 Trực tiếp</div>
  </div>

  <!-- Lưới tối đa 3 ô số liệu tổng quan -->
  <div class="tq-3so">
    <div class="tq-o" onclick="ShinApp.locDanhSach('tat-ca')">
      <div class="tq-so" style="color:var(--primary);">18</div>
      <div class="tq-nhan">Tổng việc</div>
    </div>
    <div class="tq-o" onclick="ShinApp.locDanhSach('khan')">
      <div class="tq-so" style="color:var(--c-red);">4</div>
      <div class="tq-nhan">Việc khẩn</div>
    </div>
    <div class="tq-o" onclick="ShinApp.locDanhSach('cho-duyet')">
      <div class="tq-so" style="color:var(--c-yellow);">2</div>
      <div class="tq-nhan">Chờ duyệt</div>
    </div>
  </div>

  <!-- Nút hành động chính Primary to 100% -->
  <button class="btn-primary" onclick="ShinApp.moModalThem()">
    <span>＋ Thêm Đề Xuất / Công Việc Mới</span>
  </button>
</section>
```

### 5.2 Danh Sách Dòng Thẻ Tương Tác (`.hn-list` > `.hn-dong`)

```html
<div class="hn-list">
  <div class="hn-dong" onclick="ShinApp.xemChiTiet('ID_123', this)">
    <div class="dong-icon" style="background:var(--primary-soft); color:var(--primary);">📋</div>
    <div class="dong-content">
      <div class="dong-title">Báo cáo nghiệm thu phòng khám quý 3</div>
      <div class="dong-sub">Phòng PTKH · Cập nhật 15 phút trước</div>
    </div>
    <div class="dong-meta">
      <span class="badge vang">Chờ duyệt</span>
      <span class="dong-arrow">›</span>
    </div>
  </div>
  <!-- Chi tiết bung ngay bên dưới dòng khi bấm -->
  <div class="chi-tiet-dong" id="detail_ID_123" hidden>
    <p>Nội dung chi tiết báo cáo và các nút duyệt nhanh 1-chạm...</p>
  </div>
</div>
```

### 5.3 Nút Bấm & Phân Cấp Hành Động (Buttons)

* `.btn-primary`: Nút chính nổi bật (Nền `--primary`, chữ trắng/on-primary, cao 48px, chữ 15px đậm 800, bóng nhẹ).
* `.btn-secondary`: Nút phụ (Nền `--card`, viền 1px `--border`, cao 44px; rê chuột đổi viền `--primary`).
* `.btn-icon`: Nút bấm dạng biểu tượng tròn/bo nhẹ (Cao và rộng tối thiểu `44 × 44px`).
* `.nut-do`: Nút hành động xóa/nguy hiểm (Chữ và viền `--c-red`, luôn bắt buộc đi kèm xác nhận bấm 2 lần).
* `.nut-chu`: Nút liên kết dạng chữ gạch chân (Cao 44px, chữ màu `--primary`).

### 5.4 Form Nhập Liệu Chuẩn Chống Lỗi Phóng To iOS

```html
<div class="the form-the">
  <div class="form-group">
    <label class="nhan-o" for="txtTieuDe">Tiêu đề công việc <span class="dau-sao">*</span></label>
    <input type="text" class="form-input" id="txtTieuDe" required placeholder="Nhập tên việc ngắn gọn...">
  </div>

  <!-- Chi tiết phụ đưa vào khối gập để màn hình ban đầu luôn tinh gọn -->
  <details class="tq-gon" style="margin-top:12px;">
    <summary>＋ Thêm thông tin chi tiết (Tùy chọn)</summary>
    <div style="padding-top:10px;">
      <label class="nhan-o" for="txtGhiChu">Ghi chú bổ sung</label>
      <textarea class="form-input" id="txtGhiChu" rows="3" placeholder="Chi tiết..."></textarea>
    </div>
  </details>

  <div class="hang-nut" style="margin-top:16px;">
    <button type="button" class="btn-secondary" onclick="ShinApp.dongModal()">Hủy</button>
    <button type="submit" class="btn-primary" id="btnLuuForm">Lưu Dữ Liệu</button>
  </div>
</div>
```

### 5.5 Bảng Checklist Đánh Giá Hành Vi 5T & Biểu Đồ Radar SVG (v2.6.4 Mới)

* **Khung bảng cuộn an toàn (`.checklist-table-wrapper`):** Bọc ngoài bảng dài, có `overflow-x: auto; -webkit-overflow-scrolling: touch;`.
* **Huy hiệu mức đạt (`.muc-pill`):**
  * `.m1`: Đỏ (`#dc2626`) – Cảnh báo điểm liệt Mức 1.
  * `.m2`: Cam (`#d97706`) – Nền tảng.
  * `.m3`: Xanh dương (`#0284c7`) – Thành thục.
  * `.m4`: Xanh ngọc (`#0f766e`) – Gương mẫu.
  * `.m5`: Tím (`#7c3aed`) – Xuất sắc / Lan tỏa.
* **Radar Spider Chart SVG:** 5 trục đối xứng tạo bằng thẻ `<polygon>` với tọa độ tính toán động trên viewBox `0 0 300 300`.

---

## CHƯƠNG 6: HỆ THỐNG PHÒNG NGỰ TRIỆT TIÊU 12 LỖI VẶT (ZERO-BUG DEFENSE GUIDE)

Đây là bảng cẩm nang chẩn đoán và điều trị dứt điểm 12 lỗi vặt mà mọi lập trình viên và AI thường xuyên mắc phải:

| STT | Tên Lỗi Vặt | Nguyên Nhân Kỹ Thuật | Phương Thuốc Trị Dứt Điểm (Code Mẫu Bắt Buộc) |
|---|---|---|---|
| **1** | **Vùng bấm < 44px** (Touch Target Bug) | Nút đóng `✕`, icon nhỏ, tab chỉ gán padding theo text khiến kích thước thực tế chỉ 30–38px, trượt kiểm định Apple/Google. | Gán cứng: `min-width: 44px; min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0;` cho mọi nút bấm icon và nút đóng. |
| **2** | **iOS Safari Auto-Zoom** (Màn hình bị phóng to) | Người dùng chạm vào `<input>`, `<select>`, `<textarea>` có cỡ chữ `< 16px`, iOS tự động zoom to màn hình làm méo giao diện. | Quy định: `.form-input { font-size: max(16px, calc(14px * var(--font-scale))); }`. Tuyệt đối không để cỡ chữ input nhỏ hơn 16px trên mobile. |
| **3** | **Cuộn ngang ngoài ý muốn** (Horizontal Overflow) | Sử dụng `width: 100vw` (tính luôn thanh cuộn), padding không có `box-sizing: border-box`, hoặc bảng/chữ dài không ngắt dòng. | Bắt buộc khai báo: `* { box-sizing: border-box; }`, `body { overflow-x: hidden; width: 100%; }`. Mọi bảng phải bọc trong thẻ có `overflow-x: auto;`. |
| **4** | **Xung đột Z-Index** (Header/Modal/Toast che nhau) | Gán giá trị z-index tùy tiện (99, 999, 9999) dẫn đến modal đè toast hoặc header che mất drawer. | Tuân thủ thang Z-index bất biến: Thường: `1–10` · Bottom Nav: `40` · Topbar: `50` · Mấu mép trái: `98` · Drawer: `99` · Modal Sheet: `100` · Toast: `200` · Thanh chờ: `300`. |
| **5** | **Bottom Nav che khuất nội dung đáy** | Thanh đáy fixed 64px che mất nút submit hoặc dòng dữ liệu cuối cùng của trang. | Vùng cuộn chính bắt buộc có đệm đáy: `.main-container { padding-bottom: calc(80px + env(safe-area-inset-bottom)); }`. |
| **6** | **Tai thỏ & Thanh vuốt iPhone** (SafeArea Bleed) | Thiếu khai báo `viewport-fit=cover` khiến giao diện bị dính thanh trạng thái hoặc thanh home iPhone. | Bắt buộc thẻ meta: `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`. Header dùng `padding-top: env(safe-area-inset-top)`. |
| **7** | **Chớp trắng giao diện** (FOUC Theme Flash) | Trang tải xong CSS mới đọc theme từ `localStorage`, làm nháy sáng màn hình 0.2s khi người dùng đang bật Dark Mode. | Đặt đoạn Script Anti-Flicker đồng bộ ngay dòng đầu tiên của thẻ `<head>` trước mọi link CSS (xem Chương 8). |
| **8** | **Bàn phím ảo che mất ô nhập** | Trên điện thoại, bàn phím ảo trượt lên che khuất form nhập liệu ở nửa dưới màn hình. | Bắt sự kiện focus: `input.addEventListener('focus', () => { document.body.classList.add('dang-nhap-lieu'); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); });`. Ẩn Bottom Nav khi có class `dang-nhap-lieu`. |
| **9** | **Format sai số & ngày Việt Nam** | Dùng nhầm chuẩn Mỹ `1,250.00` và `mm/dd/yyyy` thay vì chuẩn kế toán Việt Nam. | 100% số liệu phải đi qua hàm `soVN(n, soLe)` (`1.250.000 đ`) và ngày qua hàm `ngayVN(d)` (`01/11/2026`). |
| **10**| **Hộp thoại Confirm gây ức chế** | Dùng `confirm('Bạn có chắc chắn muốn xóa?')` làm đứng luồng trình duyệt và trải nghiệm cũ kỹ. | Áp dụng Toast Hoàn tác 6s cho việc sửa/xóa thường. Áp dụng hàm `xacNhan2Lan(khoa, msg, viec)` cho việc nguy hiểm. |
| **11**| **Giật lag layout chuyển động** | Thay đổi thuộc tính `top`, `left`, `height` gây tính toán lại toàn bộ cây DOM (Reflow/Repaint). | 100% animation chỉ tác động trên `transform` và `opacity` để chạy trực tiếp trên GPU compositor thread. |
| **12**| **Lỗ hổng XSS & Rò rỉ Token** | Chèn chuỗi trực tiếp vào `innerHTML` khiến kẻ xấu có thể chèn mã độc đánh cắp token Apps Script. | Mọi chuỗi render bắt buộc qua hàm `esc(v)`. Thiết lập thẻ `<meta http-equiv="Content-Security-Policy">` chặn kết nối ra ngoài máy chủ quy định. |

---

## CHƯƠNG 7: THƯ VIỆN HÀM TIỆN ÍCH JAVASCRIPT (HELPER TOOLKIT)

Bộ hàm hạt nhân dùng chung của SHIN AIOS (được đóng gói sẵn trong `ShinApp`):

```javascript
/* ==========================================================================
   SHIN HELPER TOOLKIT - CHUẨN HÓA TOÀN HỆ THỐNG
   ========================================================================== */

/** 1. Chống mã độc XSS - Bắt buộc dùng cho mọi dữ liệu hiển thị */
function esc(v) {
  return String(v === undefined || v === null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** 2. Định dạng số kiểu Việt Nam: 1250000 -> "1.250.000" */
function soVN(n, soLe) {
  if (n === null || n === undefined || n === '' || !isFinite(Number(n))) return '-';
  const x = Number(n), p = Math.pow(10, soLe || 0), lam = Math.round(Math.abs(x) * p) / p;
  const nguyen = Math.floor(lam), le = Math.round((lam - nguyen) * p);
  let s = String(nguyen).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  if (le) s += ',' + String(le).padStart(String(p).length - 1, '0').replace(/0+$/, '');
  return (x < 0 ? '-' : '') + s;
}

/** 3. Định dạng phần trăm: 0.865 -> "86,5%" */
function ptVN(v, soLe) {
  return v === null || v === undefined || !isFinite(Number(v)) ? '-' : soVN(Number(v) * 100, soLe === undefined ? 1 : soLe) + '%';
}

/** 4. Định dạng ngày tháng tiếng Việt: "T2, 01/11/2026" */
function ngayVN(d) {
  d = d ? new Date(d) : new Date();
  const thu = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()];
  const p = x => (x < 10 ? '0' : '') + x;
  return `${thu}, ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** 5. Lời chào thông minh theo giờ Việt Nam */
function loiChao(hoTen) {
  const g = new Date().getHours();
  const buoi = g < 11 ? 'buổi sáng' : g < 14 ? 'buổi trưa' : g < 18 ? 'buổi chiều' : 'buổi tối';
  const tenGoi = String(hoTen || '').trim().split(/\s+/).pop();
  return `Chào ${buoi}${tenGoi ? ', ' + tenGoi : ''} ☀️`;
}

/** 5b. Bật / Tắt Thanh Điều Hướng Đáy và Lưu Trạng Thái */
function apDungNavBar() {
  const an = (localStorage.getItem('shin_navbar') === '0');
  document.body.classList.toggle('an-navbar', an);
  document.documentElement.classList.toggle('an-navbar', an);
  const chk = document.getElementById('chkNavBar');
  if (chk) chk.checked = !an;
  return !an;
}
function batTatNavBar(bat) {
  localStorage.setItem('shin_navbar', bat ? '1' : '0');
  apDungNavBar();
  rung('nhe');
}

/** 6. Rung phản hồi haptic xúc giác (nếu thiết bị hỗ trợ) */
function rung(kieu) {
  if (!('vibrate' in navigator)) return;
  try {
    if (kieu === 'nhe') navigator.vibrate(5);
    else if (kieu === 'xong') navigator.vibrate([10, 30, 10]);
    else if (kieu === 'canh') navigator.vibrate(40);
  } catch (e) {}
}

/** 7. Toast thông báo có hỗ trợ HOÀN TÁC 6 GIÂY chuẩn mực */
function toast(msg, loai = 'success', opts = {}) {
  const container = document.getElementById('toastContainer');
  if (!container) return () => {};

  const el = document.createElement('div');
  const coNut = !!(opts.nhan && opts.bam);
  el.className = `toast toast-${loai}`;
  el.innerHTML = `
    <span class="toast-text">${esc(msg)}</span>
    ${coNut ? `<button class="toast-btn">${esc(opts.nhan)}</button><div class="toast-bar"></div>` : ''}
  `;
  container.appendChild(el);

  let xong = false;
  const dong = () => {
    if (!xong) {
      xong = true;
      el.style.opacity = '0';
      el.style.transform = 'translateY(-12px)';
      setTimeout(() => el.remove(), 160);
    }
  };

  if (coNut) {
    el.querySelector('.toast-btn').onclick = () => {
      xong = true;
      el.remove();
      opts.bam();
    };
  }

  const thoiGian = coNut ? 6000 : (loai === 'error' ? 6000 : 3500);
  setTimeout(() => {
    if (!xong) {
      dong();
      if (opts.khiHet) opts.khiHet();
    }
  }, thoiGian);

  return dong;
}

/** 8. Xác nhận bấm 2 lần trong 5 giây cho các việc nguy hiểm */
const choXacNhan = {};
function xacNhan2Lan(khoa, msg, viec) {
  const bayGio = Date.now();
  if (choXacNhan[khoa] && bayGio - choXacNhan[khoa] < 5000) {
    delete choXacNhan[khoa];
    rung('canh');
    viec();
    return;
  }
  choXacNhan[khoa] = bayGio;
  rung('nhe');
  toast(msg + ' – Bấm lại lần nữa trong 5 giây để xác nhận!', 'warn');
}
```

---

## CHƯƠNG 8: BỘ KHUNG MÃ NGUỒN CHÉP DÙNG NGAY (STARTER BOILERPLATE)

Mọi tệp ứng dụng web mới trong hệ sinh thái đều có thể bắt đầu từ bộ khung chuẩn sau:

```html
<!DOCTYPE html>
<html lang="vi" data-theme="light" data-palette="gold" data-cochu="vua">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#d4a017">
  
  <!-- Content Security Policy an toàn chống rò rỉ token -->
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://script.google.com https://script.googleusercontent.com;">
  
  <!-- Khai báo PWA chuẩn -->
  <link rel="manifest" href="manifest.webmanifest">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  
  <title>Tên Ứng Dụng – SHIN AIOS</title>
  <link rel="stylesheet" href="css/styles.css">

  <!-- SCRIPT CHỐNG CHỚP MÀN HÌNH (ANTI-FLICKER) BẮT BUỘC ĐẶT ĐẦU HEAD -->
  <script>
    (function() {
      try {
        var t = localStorage.getItem('shin_theme');
        var p = localStorage.getItem('shin_palette');
        var c = localStorage.getItem('shin_cochu');
        if (t) document.documentElement.setAttribute('data-theme', t);
        if (p) document.documentElement.setAttribute('data-palette', p);
        if (c) document.documentElement.setAttribute('data-cochu', c);
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <!-- Thanh chỉ báo gửi dữ liệu máy chủ chạy trên đỉnh -->
  <div id="thanhCho" aria-hidden="true"></div>

  <!-- 1. HEADER GHIM ĐỈNH (TOPBAR 56PX) -->
  <header class="topbar">
    <div style="display:flex; align-items:center; gap:8px;">
      <a href="#" class="topbar-brand">
        <div class="topbar-logo">🌐</div>
        <div class="topbar-titles">
          <div style="display:flex; align-items:center; gap:6px;">
            <span class="topbar-title">SHIN APP</span>
            <button class="header-status-pill live">Live v2.6.4</button>
          </div>
          <div class="topbar-sub">Phân hệ Nghiệp vụ</div>
        </div>
      </a>
    </div>
    <div class="topbar-actions">
      <button class="btn-icon" title="Duyệt nhanh" style="position:relative;">
        ⚡<span class="badge-count">2</span>
      </button>
    </div>
  </header>

  <!-- 2. VÙNG NỘI DUNG CHÍNH CUỘN Ở GIỮA -->
  <main class="main-container" id="appContent" role="main">
    <!-- HERO CARD MỞ MÀN BẮT BUỘC -->
    <section class="hn-hero">
      <div class="hn-hero-top">
        <div>
          <div class="hn-chao">Chào buổi sáng, Sếp ☀️</div>
          <div class="hn-ngay">T2, 01/11/2026</div>
        </div>
      </div>
      <div class="tq-3so">
        <div class="tq-o">
          <div class="tq-so" style="color:var(--primary);">12</div>
          <div class="tq-nhan">Đang chạy</div>
        </div>
        <div class="tq-o">
          <div class="tq-so" style="color:var(--c-yellow);">3</div>
          <div class="tq-nhan">Chờ duyệt</div>
        </div>
        <div class="tq-o">
          <div class="tq-so" style="color:var(--c-green);">100%</div>
          <div class="tq-nhan">Tiến độ</div>
        </div>
      </div>
      <button class="btn-primary">＋ Thao Tác Chính 1-Chạm</button>
    </section>

    <!-- NỘI DUNG CHI TIẾT CÁC THẺ TIẾP THEO -->
    <div class="hn-tieu">DANH SÁCH CÔNG VIỆC CHÍNH</div>
    <div class="hn-list" id="danhSachChinh">
      <!-- Dòng danh sách mẫu -->
      <div class="hn-dong">
        <div class="dong-icon">📁</div>
        <div class="dong-content">
          <div class="dong-title">Kế hoạch triển khai quý 4</div>
          <div class="dong-sub">Đã xác thực dữ liệu cổng v1</div>
        </div>
        <div class="dong-meta">
          <span class="badge xanh">Đạt</span>
          <span class="dong-arrow">›</span>
        </div>
      </div>
    </div>
  </main>

  <!-- 3. THANH ĐÁY ĐIỀU HƯỚNG CỐ ĐỊNH 5 NÚT (64PX) -->
  <nav class="bottom-nav">
    <button class="nav-item active"><span class="nav-icon">🏠</span><span class="nav-label">Hôm nay</span></button>
    <button class="nav-item"><span class="nav-icon">⚡</span><span class="nav-label">Phê duyệt</span></button>
    <button class="nav-item"><span class="nav-icon">📊</span><span class="nav-label">Báo cáo</span></button>
    <button class="nav-item"><span class="nav-icon">🤝</span><span class="nav-label">Đối tác</span></button>
    <button class="nav-item"><span class="nav-icon">⚙️</span><span class="nav-label">Cài đặt</span></button>
  </nav>

  <!-- Khung chứa Toast thông báo có hoàn tác 6s -->
  <div class="toast-container" id="toastContainer"></div>
</body>
</html>
```

---

## CHƯƠNG 9: QUY TRÌNH KIỂM THỬ & TIÊU CHÍ NGHIỆM THU (DOD GATE)

Mọi website hoặc phân hệ trước khi giao cho Sếp hoặc triển khai lên Production bắt buộc phải vượt qua danh sách kiểm định 15 điểm (Definition of Done Gate):

- [ ] **1. Màn hình hẹp 320px & 360px:** Mở Chrome DevTools co về 320px và 360px. **Không có thanh cuộn ngang**, mọi khối co giãn tự nhiên.
- [ ] **2. Kiểm định Vùng Bấm Touch Target:** 100% các nút, tab, icon, ô checkbox, nút đóng `✕` đạt diện tích chạm **≥ 44 × 44px**.
- [ ] **3. Chống Phóng To iOS Safari:** Kiểm tra toàn bộ thẻ `<input>`, `<select>`, `<textarea>` đều có `font-size ≥ 16px`.
- [ ] **4. Khung 3 Tầng Chuẩn:** Header 56px ghim đỉnh, Bottom Nav 64px ghim đáy (đúng 5 nút), nội dung cuộn độc lập ở giữa.
- [ ] **5. Padding Đáy An Toàn:** Main container có `padding-bottom: calc(80px + env(safe-area-inset-bottom))` để không bị thanh đáy che mất phần tử cuối.
- [ ] **6. Cấu Trúc Hero Mở Màn:** Có đầy đủ lời chào theo giờ, ngày tháng tiếng Việt, ≤ 3 ô số liệu và 1 nút chính to 100%.
- [ ] **7. Đủ 4 Trạng Thái Màn Hình:** Mỗi phân hệ đều xử lý đủ 4 trạng thái: Đang tải (Spinner) · Trống (Empty có câu hướng dẫn) · Lỗi (Báo dải đỏ kèm nút thử lại) · Khóa quyền (Màn hình 🔒).
- [ ] **8. Độ Tương Phản Màu (WCAG 2.1 AA):** Kiểm tra cả 8 palettes ở cả 2 chế độ Sáng và Tối, chữ đọc rõ ràng (tương phản ≥ 4.5:1). Ở chế độ tối không còn bóng đổ (`--shadow: none;`).
- [ ] **9. Chuyển Động Vật Lý & Thoát Nhanh:** Áp dụng chuẩn Spring `cubic-bezier(0.16, 1, 0.3, 1)`, thời gian đóng modal ≤ 0.18s, tự tắt khi bật `prefers-reduced-motion`.
- [ ] **10. Định Dạng Số & Ngày Tiếng Việt:** 100% hiển thị số theo định dạng `1.250.000 đ`, ngày `dd/mm/yyyy`.
- [ ] **11. Không Hộp Thoại Confirm Cũ:** Áp dụng Toast Hoàn tác 6 giây hoặc Bấm 2 lần trong 5 giây cho các thao tác xóa/sửa.
- [ ] **12. Không Toast Rác:** Không bật toast khi đổi theme, đổi palette, bấm tab hay các thao tác đã thấy rõ kết quả trên màn.
- [ ] **13. Phòng Ngự XSS & Bảo Mật:** 100% biến chèn vào HTML đi qua hàm `esc()`. Không để lộ token hay mật khẩu ra giao diện.
- [ ] **14. Chống Chớp Trắng (Anti-Flicker):** Có đoạn script đồng bộ đọc theme ở đầu `<head>`, F5 không bị nháy trắng khi dùng Dark Mode.
- [ ] **15. Chuẩn PWA & Safe Area:** Có `manifest.webmanifest`, `sw.js`, `viewport-fit=cover`, cài đặt được như app độc lập trên iOS và Android.

---

> **LỜI KẾT TỪ SHIN:**  
> *"Quy chuẩn này là xương sống kiến trúc số của hệ thống SHIN. Khi mọi ứng dụng và phân hệ tuân thủ chính xác 100% tài liệu này, toàn bộ trải nghiệm người dùng sẽ đạt độ tinh tế, mượt mà và đẳng cấp chuẩn Apple-like, giải phóng hoàn toàn thời gian của Sếp khỏi những lỗi vặt không đáng có."*
