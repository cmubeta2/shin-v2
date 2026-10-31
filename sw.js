/**
 * SHIN v2 – Service worker (PWA): cài như ứng dụng + mở được khi rớt mạng.
 * Chiến lược: MẠNG TRƯỚC cho mọi tệp của web (bản mới lên GitHub Pages là có ngay), hết mạng mới lấy bản đã lưu.
 * KHÔNG đụng tới máy chủ Apps Script (script.google.com) – số liệu luôn lấy thật, không lưu đệm.
 * Đổi PHIEN_BAN_SW mỗi khi đổi danh sách tệp vỏ app.
 */
const PHIEN_BAN_SW = 'shin-v2.6.1';
const VO_APP = [
  './', 'index.html', 'manifest.webmanifest', 'css/styles.css',
  'js/demo_data.js', 'js/api.js', 'js/app.js',
  'js/modules/hub.js', 'js/modules/dieuhanh.js', 'js/modules/kpi.js', 'js/modules/khaosat.js', 'js/modules/crm.js',
  'js/modules/tuyensinh.js', 'js/modules/phongkham.js', 'js/modules/ptkh.js', 'js/modules/quantri.js', 'js/modules/duan.js', 'js/modules/congviec.js',
  'js/modules/pheduyet.js', 'js/modules/trithuc.js', 'js/modules/taichinh.js', 'js/modules/caidat_module.js',
  'assets/icon.svg', 'assets/icon-192.png', 'assets/icon-512.png', 'assets/icon-maskable-512.png', 'assets/apple-touch-icon.png', 'assets/favicon-32.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(PHIEN_BAN_SW).then(c => c.addAll(VO_APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    // Bản cũ (≤ 2.5.4) có thể đã lưu khóa chứa ?t= ➜ xóa hết bộ đệm cũ
    caches.keys().then(ds => Promise.all(ds.filter(k => k !== PHIEN_BAN_SW).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // máy chủ v1, phông chữ… đi thẳng mạng
  // Bảo mật: KHÔNG lưu đệm theo địa chỉ có tham số (?t=<token>…) – trang lưu dưới khóa không tham số
  const khoa = url.search ? url.origin + url.pathname : req;
  e.respondWith(
    fetch(req).then(res => {
      if (res && res.ok) {
        const ban = res.clone();
        caches.open(PHIEN_BAN_SW).then(c => c.put(khoa, ban));
      }
      return res;
    }).catch(() => caches.match(khoa, { ignoreSearch: req.mode === 'navigate' })
      .then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : undefined)))
  );
});
