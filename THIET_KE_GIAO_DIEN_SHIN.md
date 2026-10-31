# THIẾT KẾ GIAO DIỆN SHIN – BẢN CÔ ĐỌNG ĐỂ DỰNG TRANG KHÁC GIỐNG Y HỆT

*Rút từ SHIN v2.6.0 (`css/styles.css`, `index.html`, `js/app.js`) · 31/10/2026.*

Đưa nguyên file này cho người thiết kế / lập trình (hoặc AI) dựng web khác.
- **Mục 1–6** là luật và thông số.
- **Mục 7** là bộ khung HTML + CSS chép dùng ngay.
- **Mục 8** là danh sách kiểm trước khi giao.

---

## 1. Nguyên tắc bất biến

1. **Điện thoại trước**, màn hẹp nhất 320px. **Cấm cuộn ngang** ở mọi màn (`overflow-x: hidden` trên body; chữ dài thì xuống dòng hoặc cắt "…").
2. **3 khung cố định**:
   - Header ghim đỉnh 56px.
   - Thanh đáy ghim 64px, có đúng 5 nút.
   - Thanh trái (rail) chỉ có icon.
   - Nội dung cuộn ở giữa.
3. **Vùng bấm ≥ 44 × 44px** (nút, ô chọn, dòng danh sách, công tắc). Ô nhập trên điện thoại dùng chữ 16px để iPhone không tự phóng to.
4. **Mỗi màn mở đầu bằng 1 Hero**, gồm:
   - lời chào / tên màn;
   - ngày;
   - **≤ 3 ô số** (bấm được để lọc);
   - **1 nút chính** to, rộng hết thẻ.
5. **Không hộp xác nhận "Bạn có chắc?"**:
   - Việc hoàn tác được thì làm ngay trên màn và hiện toast **Hoàn tác 6 giây**; hết 6 giây mới gửi máy chủ.
   - Việc không hoàn tác được thì **bấm 2 lần trong 5 giây**: lần 1 hiện toast vàng nhắc, lần 2 mới làm.
6. **Thông báo (toast) chỉ khi kết quả KHÔNG thấy trên màn**: lỗi, việc chạy ngầm, Hoàn tác.
   - Đổi cài đặt, đổi giao diện, bấm tab: **không** toast.
   - Đã thấy kết quả trên màn thì chỉ rung nhẹ.
7. **Tiếng Việt toàn bộ.**
   - Số kiểu Việt Nam: "." tách nghìn, "," thập phân (1.250.000 · 86,5 %).
   - Ngày dạng `dd/mm/yyyy`. Tiền: `1.250.000 đ`, số lớn `12,5 tr` / `1,2 tỷ`.
8. **Màu có nghĩa cố định**: đỏ = quá hạn / lỗi / khẩn · vàng = sắp tới / cần chú ý · xanh lá = đạt / xong · xanh dương = thông tin · xám = tắt / chưa có.
9. **Sáng / Tối** đều phải đẹp. Tối thì bỏ bóng (`--shadow: none`).
10. **Bảo mật hiển thị**:
    - Mọi dữ liệu từ máy chủ phải escape trước khi đưa vào HTML.
    - Không bao giờ hiện token / mật khẩu / link có mã đăng nhập ra màn. Ô nhập bí mật dùng `type="password"`, lưu xong xóa ô.

---

## 2. Màu (design tokens)

Mọi thành phần **chỉ dùng biến**, không viết mã màu trực tiếp.
- Đổi bộ màu: đặt `data-palette` trên `<html>`.
- Đổi sáng / tối: đặt `data-theme="dark"` trên `<html>`.

### 2.1 Bộ biến của 1 palette

| Biến | Ý nghĩa |
|---|---|
| `--primary` / `--primary-hover` / `--primary-soft` | Màu chính (nút, mục đang chọn) / khi rê chuột / nền nhạt 12–18 % |
| `--accent` / `--accent-soft` | Màu nhấn (vạch tiêu đề trang, viền ô nhập khi gõ) |
| `--on-primary` | Chữ trên nền `--primary` |
| `--bg` · `--card` · `--border` · `--border-soft` | Nền trang · nền thẻ · viền · viền nhạt (kẻ dòng) |
| `--text` · `--text-muted` | Chữ chính · chữ phụ |
| `--sidebar-bg` · `--sidebar-text` · `--sidebar-text-muted` · `--sidebar-border` | Nền header (gradient) và chữ trên header |
| `--card-radius` · `--hero-radius` · `--btn-radius` | Bo góc thẻ · Hero · nút |
| `--shadow` | Bóng thẻ (tối = `none`) |
| `--bg-sub` | Nền rất nhạt (thanh tiến độ, nhật ký) = `var(--border-soft)` |

### 2.2 Tám palette (giá trị SÁNG · TỐI)

| Palette (`data-palette`) | Dùng cho | primary | accent | bg | card | text | text-muted | border | Bo thẻ / Hero / Nút | Header (sidebar-bg) |
|---|---|---|---|---|---|---|---|---|---|---|
| `gold` – Hoàng Kim (**mặc định**) | Hành chính, PTKH | `#dc2626` · `#ef4444` | `#d4a017` · `#f59e0b` | `#f4f5f7` · `#0c0d12` | `#ffffff` · `#161822` | `#1f2937` · `#f8fafc` | `#6b7280` · `#94a3b8` | `#e5e7eb` · `#25293a` | 14 / 18 / 10 | `linear-gradient(165deg,#f0cf5e 0%,#d4a017 55%,#a97e10 100%)` chữ `#3a2a06` · tối `linear-gradient(180deg,#181b27,#0d0f17)` |
| `executive` | Bàn làm việc lãnh đạo | `#0284c7` · `#38bdf8` | `#38bdf8` · `#7dd3fc` | `#f8fafc` · `#050811` | `#ffffff` · `#0e1526` | `#0f172a` · `#f8fafc` | `#64748b` · `#94a3b8` | `#cbd5e1` · `#1e293b` | 12 / 14 / 8 | `linear-gradient(135deg,#0f172a,#1e293b)` · tối `#080d1a` |
| `clinical` | Y tế, khảo sát (AAA) | `#0f766e` · `#2dd4bf` | `#0d9488` · `#5eead4` | `#f8fafc` · `#031313` | `#ffffff` · `#092020` | `#042f2e` · `#f0fdfa` | `#335c57` · `#99f6e4` | `#b2eae2` · `#134e4a` | 16 / 20 / 12 | `linear-gradient(135deg,#115e59,#042f2e)` · tối `#031414` |
| `growth` | Tuyển sinh, bán hàng | `#7c3aed` · `#a855f7` | `#f97316` · `#fb923c` | `#faf5ff` · `#0e0517` | `#ffffff` · `#1c0d2e` | `#3b0764` · `#faf5ff` | `#7e22ce` · `#d8b4fe` | `#f3e8ff` · `#3b1763` | 18 / 22 / 12 | `linear-gradient(135deg,#6b21a8,#3b0764)` · tối `#120422` |
| `nordic` | Tri thức, SOP | `#475569` · `#94a3b8` | `#0ea5e9` · `#38bdf8` | `#f8fafc` · `#090d16` | `#ffffff` · `#111827` | `#0f172a` · `#f1f5f9` | `#64748b` · `#94a3b8` | `#e2e8f0` · `#1e293b` | 10 / 14 / 8 | `linear-gradient(135deg,#334155,#1e293b)` · tối `#0a0e17` |
| `cyber` (luôn tối) | Giám sát, quản trị | `#10b981` | `#06b6d4` | `#04090b` | `#081418` | `#ecfdf5` | `#6ee7b7` | `#10383b` | 8 / 10 / 6 | `#020608` |
| `crimson` | Kiểm soát, kỷ luật | `#991b1b` · `#f87171` | `#ea580c` · `#fb923c` | `#fff1f2` · `#110507` | `#ffffff` · `#1f0a0e` | `#4c0519` · `#ffe4e6` | `#9f1239` · `#fda4af` | `#fecdd3` · `#4c0d18` | 12 / 16 / 8 | `linear-gradient(135deg,#881337,#4c0519)` · tối `#140407` |
| `mocha` | Nhân sự, lịch trực | `#854d0e` · `#facc15` | `#ca8a04` · `#fde047` | `#fefce8` · `#120e03` | `#ffffff` · `#211907` | `#422006` · `#fefce8` | `#854d0e` · `#fef08a` | `#fef08a` · `#3d300b` | 14 / 18 / 10 | `linear-gradient(135deg,#713f12,#422006)` · tối `#140f03` |

Quy ước cho các biến còn lại:
- `--primary-soft` / `--accent-soft`: lấy màu đó với độ trong 0,12–0,20.
- `--on-primary`: `#fff` ở bản sáng; ở bản tối lấy màu nền đậm của palette.
- `--sidebar-text`: `#f8fafc` (trừ `gold` sáng là `#3a2a06`).
- `--sidebar-border`: `rgba(255,255,255,.12)`.

### 2.3 Màu ngữ nghĩa (chung mọi palette)

| Biến | Sáng | Tối | Nền nhạt `-soft` (sáng / tối) |
|---|---|---|---|
| `--c-red` | `#dc2626` | `#f87171` | 0,15 / 0,20 |
| `--c-yellow` | `#b45309` | `#f59e0b` | 0,15 / 0,20 |
| `--c-green` | `#15803d` | `#4ade80` | 0,15 / 0,20 |
| `--c-blue` | `#2563eb` | `#60a5fa` | 0,14 / 0,20 |
| `--c-gray` | `#6b7280` | `#9ca3af` | 0,14 / 0,18 |

### 2.4 Chế độ hiển thị (4 nút trong Cài đặt)

- ☀️ **Sáng** và 🌙 **Tối**: cố định.
- 💻 **Theo máy**: theo `prefers-color-scheme`.
- 🕕 **Theo giờ**: 06:00–18:00 sáng, còn lại tối.
- Lưu trên máy (`localStorage`).

---

## 3. Chữ, khoảng cách, chuyển động

**Font hệ thống:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`. Chữ gốc 15px, `line-height: 1.5`.

**Cỡ chữ người dùng:** mọi cỡ nhân `var(--font-scale)`, cho 3 mức `[data-cochu]`: thường 1 · lớn 1,1 · rất lớn 1,2.

| Vai trò | Cỡ | Đậm |
|---|---|---|
| Lời chào Hero | 20 | 800 |
| Số lớn trong ô số | 22 (≤ 360px: 19) | 800 |
| Tiêu đề trang | 18 | 800 |
| Tên dòng / tên thẻ | 15 | 700 |
| Nút chính | 15 | 800 |
| Chữ thường / chữ phụ / badge / nút phụ | 14 | 400–700 |
| Phụ đề, nhãn ô số | 12–13 | 400–600 |
| Nhãn thanh đáy | 11 | 600 (đang chọn 800) |
| Nhãn nhóm | 14, IN HOA, `letter-spacing .04em`, màu `--text-muted` | 700 |

**Khoảng cách** theo bước 2–4–6–8–10–12–14–16–18:
- lề nội dung 14px (điện thoại 10–12px);
- khoảng giữa các thẻ 12–16px;
- đệm thẻ 14–16px, đệm Hero 18px.

**Chuyển động:**
- Bấm: thu nhỏ (`scale(.94–.99)`) trong 0,1s.
- Mở / đóng thanh trái và tấm Cài đặt: 0,22–0,3s với `cubic-bezier(0.16, 1, 0.3, 1)`.
- Toast trượt xuống 0,2s, có thanh đếm ngược 6s ở đáy.

---

## 4. Khung trang & bố cục đáp ứng

```
┌──────────────────────── Header 56px (gradient --sidebar-bg) ────────────────────────┐
│ [logo 36px] TÊN APP  [pill Live/Demo vX]          (1 nút icon 44px, vd ⚡ + số đỏ)   │
├──────┬──────────────────────────────────────────────────────────────────────────────┤
│ Rail │   Nội dung (max 760px; desktop 960px) căn giữa phần còn lại                  │
│ 56px │   ▌Tiêu đề trang (vạch trái 4px --accent)                    [↻ / ＋]         │
│ icon │   ┌ HERO: chào · ngày · [số][số][số] · [  NÚT CHÍNH  ] ┐                     │
│  »   │   NHÃN NHÓM IN HOA · số lượng                                               │
│ 🏢   │   [dòng: icon · tên / phụ · badge ›] …                                      │
│ 🧭   │   ▸ khối gập (chi tiết ít dùng)                                             │
│ …    │                                                                              │
│ ⚙️   │                                                                              │
├──────┴──────────────── Thanh đáy 64px · 5 nút: icon 20px + nhãn 11px ───────────────┤
```

**Thanh trái (rail):**
- Luôn có, chỉ icon, rộng 56px.
- Nút `»` ở đầu bung ra 248px có tên nhóm và tên mảng; ⚙️ Cài đặt và 📲 Cài app nằm ở chân.
- Mảng được chia **nhóm**; nhóm thu gọn thì chỉ còn một vạch kẻ 1px ngăn giữa.
- Mục đang chọn có nền `--primary-soft`. Số chờ là chấm đỏ góc trên.

| Bề rộng | Rail | Nội dung | Ghi chú |
|---|---|---|---|
| ≥ 1024px (desktop) | **Mặc định bung 248px**, không che nội dung, header, thanh đáy | Lùi sang phải, max 960px | Nhớ lựa chọn thu / bung trên máy |
| 768–1023px | 56px, bung ra thì nổi trên nội dung + lớp mờ | max 760px | Chọn mảng xong tự thu |
| < 768px (điện thoại) | **Mặc định kiểu "Mép trái"** (chọn được trong Cài đặt: Mép trái · Hàng icon · Tự động) | Rộng gần hết màn | Chi tiết ngay dưới bảng |
| 361–399px | (kiểu Hàng icon) 48px | | |
| ≤ 360px | Tự động ➜ Mép trái; Hero số 19px | | |
| ≤ 340px | | | Thanh đáy chỉ icon |
| cao ≤ 640px | | | Thanh đáy 52px |

Kiểu **Mép trái** trên điện thoại:
- Chỉ còn dải màu `--primary` 4px ở mép trái và một mấu `»` 24 × 44px.
- Mấu mặc định ở **66 % chiều cao**, vừa ngón cái trái. Giữ để kéo lên / xuống; vị trí nhớ trên máy.
- Vuốt từ mép trái để mở, vuốt sang trái để đóng. Lần đầu mấu nhấp nháy để gợi ý.

Quy tắc khác:
- **Đang gõ form trên điện thoại** thì ẩn thanh đáy.
- iPhone có tai thỏ: header cộng thêm `env(safe-area-inset-top)`, thanh đáy cộng `env(safe-area-inset-bottom)`.
- Thanh đáy chạy hết bề ngang (không hở góc dưới trái); các nút căn giữa theo vùng nội dung.

**Thanh đáy 5 nút:** Hôm nay · Phê duyệt · việc hay dùng · Đối tác · (nút thứ 5 dành cho tác vụ hay dùng nhất của người dùng). Mục đang chọn tô `--primary` và chữ đậm 800. Số chờ hiện bằng huy hiệu đỏ.

---

## 5. Thành phần (class chuẩn)

| Thành phần | Class | Thông số chính |
|---|---|---|
| Tiêu đề trang | `.page-header > .page-title + .page-sub` | Vạch trái 4px `--accent`, nút icon bên phải |
| Hero | `.hn-hero` | Nền `linear-gradient(135deg, --primary-soft 0%, --card 75%)`, viền 1px, bo `--hero-radius`, đệm 18, gap 14 |
| Ô số (≤ 3) | `.tq-3so > .tq-o > .tq-so + .tq-nhan` | Lưới 3 cột, ô cao ≥ 64, số 22/800 tô màu ngữ nghĩa; bấm để lọc |
| Nút chính | `.btn-primary` | Rộng 100 %, cao 48, nền `--primary`, chữ 15/800, bóng nhẹ |
| Nút phụ | `.btn-secondary` | Cao 44, nền `--card`, viền; rê chuột ➜ viền + chữ `--primary` |
| Nút chữ / viền đứt / icon | `.nut-chu` · `.nut-rong` · `.btn-icon` | Gạch chân màu chính · viền đứt màu chính rộng 100 % · 44 × 44 bo 10 |
| Nút nguy hiểm | thêm `.nut-do` | Chữ + viền `--c-red` (luôn kèm bấm 2 lần) |
| Nhãn nhóm | `.hn-tieu` | IN HOA 14/700 `--text-muted`, bên phải có nút chữ "Bỏ lọc" |
| Danh sách | `.hn-list > .hn-dong` | Dòng cao ≥ 60, bo `--card-radius`; gồm `.dong-icon` 40px · `.dong-content` (`.dong-title` 15/700 + `.dong-sub` 13, cắt "…") · `.dong-meta` (badge + `›`) |
| Chi tiết bung dưới dòng | `.chi-tiet-dong` | Viền **đứt**, bo 12; bấm dòng lần nữa để thu |
| Thẻ | `.the` (thẻ thường) · `.card` | Nền `--card`, viền 1px, bo 12 / `--card-radius`, đệm 14–16 |
| Hàng 2 đầu | `.hang-tru` | Trái nhãn, phải số đậm, kẻ dưới `--border-soft` |
| Khối gập | `details.tq-gon > summary` | Cao 48, mũi tên `▸` xoay 90° khi mở; `.tom-tat` bên phải ẩn khi mở |
| Badge | `.badge.do / .vang / .xanh / .xam` | Viên thuốc, nền `-soft`, chữ màu đậm, 14/700 |
| Tab | `.hang-tab > .tab-nut(.dang-chon)` | Viên thuốc cao 44 bo 22; đang chọn nền `--primary` chữ trắng; cuộn ngang ẩn thanh cuộn |
| Chip lọc | `.hang-chip > .chip-chon(.dang-chon)` | Viên thuốc 44; đang chọn nền `--primary-soft` viền `--primary` |
| Lưới ô lọc | `.luoi-o-so > .o-so-loc` | `repeat(auto-fit, minmax(96px,1fr))`, ô cao 64, icon + chữ 12 |
| Thanh tiến độ | `.thanh-tien > div` | Cao 6, bo 3, nền `--bg-sub`, phần chạy `--primary` |
| Ô nhập | `.form-input` · nhãn `.nhan-o` | Cao 44, nền `--bg`, bo `--btn-radius`; khi gõ viền `--accent` + vòng 3px `--accent-soft`; điện thoại chữ 16px |
| Form trong thẻ | `.the.form-the` | Viền `--primary`; chi tiết phụ nằm trong `details` "＋ Thêm chi tiết" |
| Hàng nút | `.hang-nut` | Các nút chia đều, `flex: 1 1 140px`, xuống dòng khi hẹp |
| Công tắc | `.cong-tac > input + .cong-tac-nen` | Vùng bấm 52 × 44, rãnh 48 × 26, bật = `--primary`; `.khoa` mờ 50 % |
| Thẻ tin | `.the-tin(.da-xem)` | Vạch trái 4px `--primary`; đã xem ➜ vạch xám, mờ 75 % |
| Dải nguồn dữ liệu | `.canh-bao-nguon.mau / .loi` | Vàng = đang hiện số MẪU · Đỏ = lỗi máy chủ; luôn ở đầu nội dung |
| Trống / xong hết | `.trong` · `.hn-xong` | Chữ giữa màu phụ · khối xanh lá icon 44px "Xong hết việc 🎉" |
| Toast | `.toast.toast-success/info/warn/error` | Trên đỉnh, max 500, vạch trái 5px màu loại, nút "Hoàn tác" gạch chân, thanh đếm 3px |
| Thanh chờ | `#thanhCho.chay` | Vạch 3px `--primary` chạy trên cùng khi đang gửi máy chủ |
| Tấm Cài đặt | `.modal-overlay > .modal-sheet` | Trượt từ đáy, max 600, bo trên 20, nền mờ `rgba(0,0,0,.6)` + blur 4 |
| Pill trạng thái | `.header-status-pill.live / .demo` | Cạnh tên app, 10px/800: xanh "Live vX" · vàng "Demo vX" |
| Đã làm / đã tắt | `.mo-di` | `opacity: .4` |

**Trạng thái bắt buộc mỗi màn:**
- **đang tải**: vòng quay + chữ;
- **trống**: câu hướng dẫn việc cần làm;
- **lỗi**: dải đỏ + vẫn hiện số mẫu;
- **chưa có quyền**: màn khóa 🔒.

---

## 6. Hành vi & giọng chữ

- **Nút đang gửi:** khóa nút, đổi chữ thành "⏳ Đang lưu…", chặn bấm 2 lần. Chờ quá 20 giây thì toast vàng "Mạng đang yếu…".
- **Rung** (máy có hỗ trợ): `nhe` khi chọn, `xong` khi lưu được, `canh` khi xác nhận việc nguy hiểm.
- **Bộ lọc:** bấm ô số trong Hero để lọc danh sách. Bấm lại ô đó, hoặc bấm "Bỏ lọc", để bỏ lọc.
- **Chi tiết ít dùng:** để trong khối gập; màn đầu chỉ giữ thứ dùng mỗi ngày.
- **Câu chữ:** ngắn, nói việc cần làm ("Chưa có việc nào – bấm ＋ để thêm"). Không nói thuật ngữ kỹ thuật. Lỗi thì nói cách sửa.
- **Nhớ trên máy:** chế độ sáng / tối, palette, cỡ chữ, kiểu thanh trái, vị trí mấu, khối gập đang mở.
- **PWA:** mọi trang đều cài được như ứng dụng.
  - Cần `manifest.webmanifest`: `display: standalone`, icon 192 / 512 / maskable, `theme_color` = màu header.
  - Cần service worker network-first, không đệm dữ liệu khác nguồn và không đệm link có mã đăng nhập.
  - Nút 📲 ở chân rail; iPhone thì hướng dẫn "Chia sẻ ➜ Thêm vào MH chính".

---

## 7. Bộ khung chép dùng ngay

### 7.1 HTML

```html
<!doctype html>
<html lang="vi" data-palette="gold" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#d4a017">
  <link rel="manifest" href="manifest.webmanifest">
  <link rel="stylesheet" href="shin.css">
  <title>Tên App</title>
</head>
<body>
  <div id="thanhCho"></div>
  <header class="topbar">
    <a class="topbar-brand" href="#">
      <div class="topbar-logo">S</div>
      <div><div class="topbar-title">TÊN APP <span class="header-status-pill live">Live v1.0</span></div>
           <div class="topbar-sub">Phụ đề / tên người dùng · vai trò</div></div>
    </a>
    <button class="btn-icon" aria-label="Phê duyệt">⚡</button>
  </header>

  <nav class="rail" id="rail" aria-label="Danh mục">
    <button class="rail-nut" onclick="document.body.classList.toggle('rail-mo')" aria-label="Mở rộng">»</button>
    <div class="rail-nhom">Nhóm 1</div>
    <a class="rail-muc dang-chon" href="#"><span class="rail-icon">🏢</span><span class="rail-ten">Trang chủ</span></a>
    <a class="rail-muc" href="#"><span class="rail-icon">📊</span><span class="rail-ten">Báo cáo</span></a>
    <div class="rail-chan"><button class="rail-nut" aria-label="Cài đặt">⚙️</button></div>
  </nav>

  <main class="noi-dung">
    <div class="page-header">
      <div><div class="page-title">🏠 Hôm nay</div><div class="page-sub">Mô tả ngắn của màn</div></div>
      <button class="btn-icon nhat" aria-label="Làm mới">↻</button>
    </div>

    <section class="hn-hero">
      <div><div class="hero-greet">Chào buổi sáng, anh Tâm 👋</div><div class="hero-date">📅 T7, 31/10/2026</div></div>
      <div class="tq-3so">
        <div class="tq-o"><div class="tq-so" style="color:var(--c-blue)">12</div><div class="tq-nhan">Việc cần làm</div></div>
        <div class="tq-o"><div class="tq-so" style="color:var(--c-red)">2</div><div class="tq-nhan">Quá hạn</div></div>
        <div class="tq-o"><div class="tq-so" style="color:var(--c-green)">86 %</div><div class="tq-nhan">Hoàn thành</div></div>
      </div>
      <button class="btn-primary">⚡ Việc chính của màn</button>
    </section>

    <div class="hn-tieu"><span>VIỆC HÔM NAY · 3</span><button class="nut-chu">Bỏ lọc</button></div>
    <div class="hn-list">
      <div class="hn-dong">
        <div class="dong-icon">📝</div>
        <div class="dong-content"><div class="dong-title">Duyệt 4 báo cáo ngày</div><div class="dong-sub">Hạn 31/10/2026 · PTKH</div></div>
        <div class="dong-meta"><span class="badge vang">Hôm nay</span><span class="dong-arrow">›</span></div>
      </div>
    </div>

    <details class="tq-gon"><summary><span>ⓘ Quy ước</span><span class="tom-tat">2 mục</span></summary><p class="chu-phu">Nội dung ít dùng.</p></details>
  </main>

  <nav class="bottom-nav">
    <button class="nav-item active"><span class="nav-icon">🏠</span><span class="nav-nhan">Hôm nay</span></button>
    <button class="nav-item"><span class="nav-icon">⚡</span><span class="nav-nhan">Phê duyệt</span></button>
    <button class="nav-item"><span class="nav-icon">📌</span><span class="nav-nhan">Dự án</span></button>
    <button class="nav-item"><span class="nav-icon">👥</span><span class="nav-nhan">Đối tác</span></button>
    <button class="nav-item"><span class="nav-icon">🧭</span><span class="nav-nhan">Điều hành</span></button>
  </nav>
  <div class="toast-container" id="toast" aria-live="polite"></div>
  <script>if (matchMedia('(min-width:1024px)').matches) document.body.classList.add('rail-mo');</script>
</body>
</html>
```

### 7.2 CSS lõi (`shin.css`)

Chỉ kèm palette `gold`. Palette khác: copy khối `:root` / `[data-theme="dark"]` rồi thay giá trị theo bảng 2.2.

```css
/* ---------- Biến ---------- */
:root{--font-scale:1;--header-height:56px;--nav-height:64px;--safe-top:env(safe-area-inset-top,0px);--safe-bottom:env(safe-area-inset-bottom,0px);
  --rail-thu:56px;--rail-mo:248px;--rail-w:var(--rail-thu);--noi-max:760px;
  --primary:#dc2626;--primary-hover:#b91c1c;--primary-soft:rgba(212,160,23,.15);--accent:#d4a017;--accent-soft:rgba(212,160,23,.15);--on-primary:#fff;
  --bg:#f4f5f7;--card:#fff;--border:#e5e7eb;--border-soft:#f1f2f4;--bg-sub:var(--border-soft);--text:#1f2937;--text-muted:#6b7280;
  --sidebar-bg:linear-gradient(165deg,#f0cf5e 0%,#d4a017 55%,#a97e10 100%);--sidebar-text:#3a2a06;--sidebar-border:rgba(0,0,0,.1);
  --card-radius:14px;--hero-radius:18px;--btn-radius:10px;--shadow:0 2px 10px rgba(0,0,0,.04);
  --c-gray:#6b7280;--c-gray-soft:rgba(107,114,128,.14);--c-blue:#2563eb;--c-blue-soft:rgba(37,99,235,.14);--c-yellow:#b45309;--c-yellow-soft:rgba(180,83,9,.15);
  --c-green:#15803d;--c-green-soft:rgba(21,128,61,.15);--c-red:#dc2626;--c-red-soft:rgba(220,38,38,.15)}
[data-theme="dark"]{--primary:#ef4444;--primary-hover:#dc2626;--primary-soft:rgba(245,158,11,.18);--accent:#f59e0b;--accent-soft:rgba(245,158,11,.18);--on-primary:#161822;
  --bg:#0c0d12;--card:#161822;--border:#25293a;--border-soft:#1d212f;--text:#f8fafc;--text-muted:#94a3b8;
  --sidebar-bg:linear-gradient(180deg,#181b27 0%,#0d0f17 100%);--sidebar-text:#f8fafc;--sidebar-border:rgba(245,158,11,.25);--shadow:none;
  --c-gray:#9ca3af;--c-gray-soft:rgba(156,163,175,.18);--c-blue:#60a5fa;--c-blue-soft:rgba(96,165,250,.2);--c-yellow:#f59e0b;--c-yellow-soft:rgba(245,158,11,.2);
  --c-green:#4ade80;--c-green-soft:rgba(74,222,128,.2);--c-red:#f87171;--c-red-soft:rgba(248,113,113,.2)}
[data-cochu="lon"]{--font-scale:1.1}[data-cochu="ratlon"]{--font-scale:1.2}
@media(min-width:1024px){:root{--noi-max:960px}body.rail-mo{--rail-w:var(--rail-mo)}}
@media(max-height:640px){:root{--nav-height:52px}}

/* ---------- Nền ---------- */
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:calc(15px*var(--font-scale));line-height:1.5;
  background:var(--bg);color:var(--text);overflow-x:hidden;min-height:100vh;padding-bottom:calc(var(--nav-height) + var(--safe-bottom) + 24px)}
[hidden]{display:none!important}

/* ---------- Header ---------- */
.topbar{position:sticky;top:0;z-index:100;height:calc(var(--header-height) + var(--safe-top));padding:var(--safe-top) 14px 0;display:flex;align-items:center;
  justify-content:space-between;background:var(--sidebar-bg);color:var(--sidebar-text);box-shadow:0 2px 10px rgba(0,0,0,.15)}
.topbar-brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none}
.topbar-logo{width:36px;height:36px;border-radius:9px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-weight:800}
.topbar-title{font-size:calc(15px*var(--font-scale));font-weight:800;letter-spacing:-.2px;line-height:1.2}
.topbar-sub{font-size:calc(12px*var(--font-scale));opacity:.8;white-space:nowrap}
.header-status-pill{display:inline-flex;align-items:center;height:20px;padding:2px 7px;border-radius:12px;font-size:10px;font-weight:800;vertical-align:middle}
.header-status-pill.live{background:rgba(22,163,74,.12);color:#16a34a;border:1px solid rgba(22,163,74,.4)}
.header-status-pill.demo{background:rgba(217,119,6,.12);color:#d97706;border:1px solid rgba(217,119,6,.4)}
.btn-icon{position:relative;width:44px;height:44px;border-radius:10px;background:rgba(255,255,255,.15);border:1px solid var(--sidebar-border);color:inherit;
  font-size:18px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .1s}
.btn-icon:active{transform:scale(.94)}
.btn-icon.nhat{background:transparent;border-color:var(--border);color:var(--text)}

/* ---------- Thanh trái (rail) ---------- */
.rail{position:fixed;left:0;top:calc(var(--header-height) + var(--safe-top));bottom:calc(var(--nav-height) + var(--safe-bottom));width:var(--rail-w);
  z-index:97;background:var(--card);box-shadow:1px 0 0 var(--border);display:flex;flex-direction:column;gap:4px;padding:6px;overflow:hidden auto;
  transition:width .22s cubic-bezier(.16,1,.3,1)}
.rail-nut{width:44px;height:44px;border:none;border-radius:10px;background:transparent;color:var(--text);font-size:20px;cursor:pointer;align-self:center}
.rail-nut:hover{background:var(--primary-soft);color:var(--primary)}
.rail-nhom{height:1px;margin:4px 6px;background:var(--border);font-size:0}
.rail-muc{display:flex;align-items:center;gap:12px;min-height:44px;padding:0 6px;border-radius:8px;color:var(--text);text-decoration:none;
  justify-content:center;font-size:calc(13.5px*var(--font-scale));font-weight:700}
.rail-icon{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.rail-ten{display:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.rail-muc:hover,.rail-muc.dang-chon{background:var(--primary-soft);color:var(--primary)}
.rail-chan{margin-top:auto;border-top:1px solid var(--border);padding-top:6px;display:flex;justify-content:center}
body.rail-mo .rail{width:var(--rail-mo)}
body.rail-mo .rail-muc{justify-content:flex-start;padding:0 10px}
body.rail-mo .rail-ten{display:inline}
body.rail-mo .rail-nhom{height:auto;background:none;font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--text-muted);margin:10px 8px 4px}
@media(max-width:1023px){body.rail-mo .rail{width:var(--rail-mo);box-shadow:6px 0 30px rgba(0,0,0,.25)}
  .noi-dung{padding-left:10px!important;padding-right:10px!important}}

/* ---------- Nội dung + thanh đáy (căn giữa phần còn lại sau rail) ---------- */
.noi-dung{max-width:var(--noi-max);margin-left:calc(var(--rail-w) + max(0px,(100% - var(--rail-w) - var(--noi-max))/2));margin-right:auto;padding:14px 14px 30px;
  transition:margin-left .22s cubic-bezier(.16,1,.3,1)}
@media(max-width:1023px){.noi-dung{margin-left:var(--rail-thu)}}
.bottom-nav{position:fixed;left:0;right:0;bottom:0;z-index:95;height:calc(var(--nav-height) + var(--safe-bottom));padding-bottom:var(--safe-bottom);
  padding-left:calc(var(--rail-w) + max(0px,(100vw - var(--rail-w) - var(--noi-max))/2));padding-right:max(0px,calc((100vw - var(--rail-w) - var(--noi-max))/2));
  display:flex;background:var(--card);border-top:1px solid var(--border);box-shadow:0 -4px 16px rgba(0,0,0,.05)}
.nav-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;border:none;background:none;font:inherit;
  font-size:calc(11px*var(--font-scale));font-weight:600;color:var(--text-muted);cursor:pointer;position:relative}
.nav-item.active{color:var(--primary);font-weight:800}
.nav-icon{font-size:20px;line-height:1}
@media(max-width:340px){.nav-nhan{display:none}.nav-icon{font-size:22px}}

/* ---------- Tiêu đề, Hero, ô số, nút ---------- */
.page-header{display:flex;align-items:center;justify-content:space-between;margin:4px 0 14px;padding-left:10px;border-left:4px solid var(--accent)}
.page-title{font-size:calc(18px*var(--font-scale));font-weight:800;line-height:1.2}
.page-sub{font-size:calc(13px*var(--font-scale));color:var(--text-muted);margin-top:2px}
.hn-hero{display:flex;flex-direction:column;gap:14px;padding:18px;margin-bottom:16px;border:1px solid var(--border);border-radius:var(--hero-radius);
  background:linear-gradient(135deg,var(--primary-soft) 0%,var(--card) 75%);box-shadow:var(--shadow)}
.hero-greet{font-size:calc(20px*var(--font-scale));font-weight:800}
.hero-date{font-size:calc(13px*var(--font-scale));color:var(--text-muted)}
.tq-3so{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.tq-o{min-height:64px;padding:10px 12px;display:flex;flex-direction:column;justify-content:center;background:var(--card);border:1px solid var(--border);
  border-radius:var(--card-radius);cursor:pointer;transition:transform .1s,border-color .15s}
.tq-o:hover{border-color:var(--primary)}.tq-o:active{transform:scale(.97)}
.tq-so{font-size:calc(22px*var(--font-scale));font-weight:800;line-height:1.1}
.tq-nhan{font-size:calc(12px*var(--font-scale));color:var(--text-muted);margin-top:4px;overflow-wrap:anywhere}
@media(max-width:360px){.tq-3so{gap:6px}.tq-o{padding:8px}.tq-so{font-size:calc(19px*var(--font-scale))}}
.btn-primary{width:100%;min-height:48px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border:none;border-radius:var(--btn-radius);
  background:var(--primary);color:var(--on-primary);font:inherit;font-size:calc(15px*var(--font-scale));font-weight:800;cursor:pointer;
  box-shadow:0 4px 14px rgba(0,0,0,.12);transition:transform .1s}
.btn-primary:hover{background:var(--primary-hover)}.btn-primary:active{transform:scale(.98)}
.btn-secondary{min-height:44px;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--border);
  border-radius:var(--btn-radius);background:var(--card);color:var(--text);font:inherit;font-size:calc(14px*var(--font-scale));font-weight:700;cursor:pointer}
.btn-secondary:hover{border-color:var(--primary);color:var(--primary)}
.nut-chu{min-height:44px;padding:0 4px;border:none;background:none;color:var(--primary);font:inherit;font-weight:700;text-decoration:underline;cursor:pointer}
.nut-rong{width:100%;min-height:44px;margin-top:10px;border:1px dashed var(--primary);border-radius:8px;background:none;color:var(--primary);font:inherit;font-weight:700}
.nut-do{color:var(--c-red)!important;border-color:var(--c-red)!important}
.hang-nut{display:flex;flex-wrap:wrap;gap:10px;margin-top:10px}.hang-nut>*{flex:1 1 140px}

/* ---------- Danh sách, thẻ, khối gập ---------- */
.hn-tieu{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin:18px 4px 8px;font-size:calc(14px*var(--font-scale));
  font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.04em}
.hn-list{display:flex;flex-direction:column;gap:8px}
.hn-dong{min-height:60px;padding:10px 14px;display:flex;align-items:center;gap:12px;background:var(--card);border:1px solid var(--border);
  border-radius:var(--card-radius);box-shadow:var(--shadow);cursor:pointer;color:inherit;text-decoration:none;transition:transform .1s,border-color .15s}
.hn-dong:hover{border-color:var(--primary)}.hn-dong:active{transform:scale(.99)}
.dong-icon{width:40px;height:40px;min-width:40px;border-radius:11px;background:var(--primary-soft);color:var(--primary);display:flex;align-items:center;justify-content:center;font-size:19px}
.dong-content{flex:1;min-width:0}
.dong-title{font-size:calc(15px*var(--font-scale));font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dong-sub{font-size:calc(13px*var(--font-scale));color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dong-meta{display:flex;align-items:center;gap:8px}.dong-arrow{color:var(--text-muted);font-size:18px;font-weight:700}
.chi-tiet-dong{margin:-2px 0 8px;padding:10px 14px;background:var(--card);border:1px dashed var(--border);border-radius:12px;font-size:calc(14px*var(--font-scale))}
.the{padding:14px;margin-bottom:12px;background:var(--card);border:1px solid var(--border);border-radius:12px}
.the.form-the{border-color:var(--primary)}
.hang-tru{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-soft);font-size:calc(14px*var(--font-scale))}
.hang-tru:last-child{border-bottom:none}
.chu-phu{font-size:calc(14px*var(--font-scale));color:var(--text-muted)}
.trong{text-align:center;color:var(--text-muted);padding:24px 8px}
.mo-di{opacity:.4}
details.tq-gon{margin-bottom:12px;background:var(--card);border:1px solid var(--border);border-radius:12px}
details.tq-gon>summary{min-height:48px;padding:8px 14px;display:flex;align-items:center;justify-content:space-between;gap:8px;list-style:none;cursor:pointer;font-weight:700}
details.tq-gon>summary::-webkit-details-marker{display:none}
details.tq-gon>summary::after{content:'▸';color:var(--text-muted);transition:transform .15s}
details.tq-gon[open]>summary{border-bottom:1px solid var(--border-soft)}
details.tq-gon[open]>summary::after{transform:rotate(90deg)}
details.tq-gon .tom-tat{margin-left:auto;color:var(--text-muted);font-weight:600}
details.tq-gon[open] .tom-tat{display:none}
details.tq-gon>:not(summary){margin:10px 12px 12px}

/* ---------- Badge, tab, chip, ô lọc, tiến độ, form, công tắc ---------- */
.badge{display:inline-flex;align-items:center;padding:2px 10px;border-radius:999px;font-size:calc(14px*var(--font-scale));font-weight:700;white-space:nowrap}
.badge.do{background:var(--c-red-soft);color:var(--c-red)}.badge.vang{background:var(--c-yellow-soft);color:var(--c-yellow)}
.badge.xanh{background:var(--c-green-soft);color:var(--c-green)}.badge.xam{background:var(--c-gray-soft);color:var(--c-gray)}
.hang-tab{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;margin:10px 0 12px}.hang-tab::-webkit-scrollbar{display:none}
.tab-nut{flex:0 0 auto;min-height:44px;padding:0 14px;border-radius:22px;border:1px solid var(--border);background:var(--card);color:var(--text);font:inherit;font-weight:700;cursor:pointer}
.tab-nut.dang-chon{background:var(--primary);border-color:var(--primary);color:#fff}
.hang-chip{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}
.chip-chon{min-height:44px;padding:0 14px;border-radius:22px;border:1px solid var(--border);background:var(--bg);color:var(--text);font:inherit;font-weight:600;cursor:pointer}
.chip-chon.dang-chon{background:var(--primary-soft);border-color:var(--primary);color:var(--primary)}
.luoi-o-so{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px;margin-bottom:10px}
.o-so-loc{min-height:64px;padding:6px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;border:1px solid var(--border);
  border-radius:10px;background:var(--card);color:var(--text);font:inherit;font-size:calc(12px*var(--font-scale));text-align:center;cursor:pointer}
.o-so-loc.dang-chon{border-color:var(--primary);background:var(--primary-soft)}
.thanh-tien{height:6px;border-radius:3px;background:var(--bg-sub);overflow:hidden;margin:6px 0}.thanh-tien>div{height:100%;background:var(--primary)}
.nhan-o{display:block;margin:10px 0 4px;font-size:calc(14px*var(--font-scale));font-weight:600}
.form-input{width:100%;min-height:44px;padding:10px 14px;border:1px solid var(--border);border-radius:var(--btn-radius);background:var(--bg);color:var(--text);
  font:inherit;font-size:calc(14px*var(--font-scale))}
.form-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
@media(max-width:767px){.form-input{font-size:16px}}
.cong-tac{position:relative;flex:0 0 52px;height:44px;display:inline-flex;align-items:center;cursor:pointer}
.cong-tac input{position:absolute;inset:0;opacity:0;cursor:pointer}
.cong-tac-nen{position:relative;width:48px;height:26px;border-radius:13px;background:var(--border);transition:background .15s}
.cong-tac-nen::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:left .15s}
.cong-tac input:checked+.cong-tac-nen{background:var(--primary)}.cong-tac input:checked+.cong-tac-nen::after{left:25px}

/* ---------- Dải nguồn, toast, thanh chờ, tấm cài đặt ---------- */
.canh-bao-nguon{padding:10px 14px;margin-bottom:12px;border-radius:12px;font-size:calc(14px*var(--font-scale));font-weight:600}
.canh-bao-nguon.mau{background:var(--c-yellow-soft);color:var(--c-yellow)}.canh-bao-nguon.loi{background:var(--c-red-soft);color:var(--c-red)}
.toast-container{position:fixed;top:14px;left:var(--rail-w);right:14px;max-width:500px;margin:0 auto;z-index:300;display:flex;flex-direction:column;gap:8px;pointer-events:none}
.toast{pointer-events:auto;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;
  background:var(--card);color:var(--text);border:1px solid var(--border);border-left:5px solid var(--primary);border-radius:10px;
  box-shadow:0 8px 24px rgba(0,0,0,.18);font-size:calc(14px*var(--font-scale));animation:tTruot .2s ease-out}
.toast-success{border-left-color:var(--c-green)}.toast-info{border-left-color:var(--c-blue)}.toast-warn{border-left-color:var(--c-yellow)}.toast-error{border-left-color:var(--c-red)}
.toast-btn{min-height:44px;border:none;background:none;color:var(--primary);font:inherit;font-weight:800;text-decoration:underline;cursor:pointer}
.toast-bar{position:absolute;left:0;bottom:0;height:3px;width:100%;background:var(--primary);animation:tDem 6s linear forwards}
@keyframes tTruot{from{transform:translateY(-20px);opacity:0}to{transform:none;opacity:1}}
@keyframes tDem{from{width:100%}to{width:0}}
#thanhCho{position:fixed;top:0;left:0;height:3px;width:0;background:var(--primary);z-index:400}
#thanhCho.chay{width:100%;animation:tCho 1.2s ease-in-out infinite}
@keyframes tCho{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.modal-overlay{position:fixed;inset:0;z-index:200;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
  opacity:0;pointer-events:none;transition:opacity .2s}
.modal-overlay.open{opacity:1;pointer-events:auto}
.modal-sheet{width:100%;max-width:600px;max-height:85vh;overflow-y:auto;padding:20px;background:var(--card);border-radius:20px 20px 0 0;
  transform:translateY(100%);transition:transform .25s cubic-bezier(.16,1,.3,1)}
.modal-overlay.open .modal-sheet{transform:none}
```

### 7.3 Ba hàm hành vi tối thiểu (JS)

```js
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const soVN = (n, le = 0) => Number(n || 0).toLocaleString('vi-VN', { minimumFractionDigits: le, maximumFractionDigits: le });

/** Toast; opts {nhan:'Hoàn tác', bam, khiHet} ➜ có nút + thanh đếm 6s, hết giờ mới chạy khiHet (gửi máy chủ). */
function toast(msg, loai = 'success', opts = {}) {
  const el = document.createElement('div'), coNut = opts.nhan && opts.bam;
  el.className = 'toast toast-' + loai;
  el.innerHTML = `<span>${esc(msg)}</span>${coNut ? `<button class="toast-btn">${esc(opts.nhan)}</button><div class="toast-bar"></div>` : ''}`;
  document.getElementById('toast').appendChild(el);
  let xong = false;
  const dong = () => { if (!xong) { xong = true; el.remove(); } };
  if (coNut) el.querySelector('button').onclick = () => { xong = true; el.remove(); opts.bam(); };
  setTimeout(() => { if (!xong) { dong(); opts.khiHet && opts.khiHet(); } }, coNut ? 6000 : (loai === 'error' ? 6000 : 3500));
}

/** Việc không hoàn tác được: bấm lần 2 trong 5 giây mới làm. */
const cho = {};
function xacNhan2Lan(khoa, msg, viec) {
  if (cho[khoa] && Date.now() - cho[khoa] < 5000) { delete cho[khoa]; viec(); return; }
  cho[khoa] = Date.now(); toast(msg + ' – bấm lại lần nữa trong 5 giây để làm.', 'warn');
}
```

---

## 8. Kiểm trước khi giao

- [ ] Thử 320 · 360 · 375 · 414 · 768 · 1280px: **không cuộn ngang**, chữ không tràn khung.
- [ ] Mọi nút / dòng / ô ≥ 44px. Ô nhập trên điện thoại 16px.
- [ ] Mỗi màn có Hero ≤ 3 số + 1 nút chính; có đủ 4 trạng thái: tải, trống, lỗi, chưa có quyền.
- [ ] Sáng và tối đều dễ đọc (độ tương phản chữ ≥ 4,5 : 1); thử ít nhất 2 palette.
- [ ] Desktop: rail bung sẵn, không che header / nội dung / thanh đáy; nội dung và thanh đáy giới hạn bề rộng, căn giữa.
- [ ] Điện thoại: kiểu Mép trái, mấu kéo được, vuốt mép mở được; đang gõ form thì ẩn thanh đáy.
- [ ] Số kiểu Việt Nam, ngày `dd/mm/yyyy`, toàn tiếng Việt.
- [ ] Không có hộp "Bạn có chắc?": dùng Hoàn tác 6 giây hoặc bấm 2 lần.
- [ ] Không toast khi đổi cài đặt / giao diện.
- [ ] Dữ liệu ngoài đều qua `esc()`; không hiện token / mật khẩu ra màn.
- [ ] Cài được như ứng dụng: manifest + service worker + icon.
