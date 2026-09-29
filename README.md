# FitFlow — Personal Adaptive Training Tracker (PWA)

Aplikasi pribadi, 100% offline, satu file → sekarang satu folder statis yang bisa dipasang di HP Android sebagai app (PWA) lewat GitHub Pages.

## Struktur

| File | Isi |
| --- | --- |
| `index.html` | Markup template (x-dc) + registrasi service worker + install prompt |
| `app.js` | Logika aplikasi (`Component` untuk dc-runtime) — UI, state, persistence |
| `engine.js` | `window.FF`: data (45 gerakan, 352 makanan), engine 7-gate, model beban, nutrisi, BF estimator, CSV/backup |
| `styles.css` | Lucent Design System tokens + semua CSS app + `@font-face` |
| `sw.js` | Service worker: precache semua aset, offline-first, banner "Versi baru" |
| `manifest.webmanifest` | Manifest PWA (nama, ikon, standalone, warna) |
| `vendor/` | React 18.3.1 UMD, `dc-runtime.js` (Claude Design runtime, dipatch untuk `app.js` eksternal), `lucent-ds.js` |
| `fonts/` | DM Serif Display, Manrope, IBM Plex Mono (subset latin, OFL) |
| `icons/` | Ikon PWA 192 / 512 / 512 maskable / apple-touch 180 |
| `assets/` | Logo wordmark + logo mark |
| `tools/release.py` | Regenerasi `sw.js` setiap rilis |
| `tests/engine.test.js` | Unit test engine (Node, tanpa dependensi) |
| `tools/build.py` | Arsip: unbundler satu kali dari file v1.0 |

## Deploy ke GitHub Pages (gratis)

1. Buat repo (mis. `fitflow`), upload **seluruh isi folder ini** ke root repo (bukan foldernya).
2. Settings › Pages › Build and deployment › Source: **Deploy from a branch** → `main` / `/ (root)` → Save.
3. Tunggu ±1 menit. URL: `https://<username>.github.io/fitflow/`.
4. Buka di Chrome Android → menu ⋮ → **Install app** (atau kartu "Pasang FitFlow" di tab More).

Semua path relatif (`./`), jadi nama repo bebas.

## Migrasi data dari versi file HTML lama

1. Buka `FitFlow-v1.0.html` lama di HP → More → **Backup sekarang — download JSON**.
2. Buka app PWA → More → **Restore dari file JSON…** → pilih file tadi.
3. Cek jumlah sesi di History dan berat terakhir di Home.

## Rilis versi baru

1. Edit file di repo (`app.js`, `engine.js`, `index.html`, `styles.css`).
2. Bila mengubah angka versi, ganti `APP_VERSION` di `engine.js`.
3. Jalankan `node tests/engine.test.js` (harus OK) lalu `python tools/release.py` (memperbarui `sw.js`).
4. Commit + push ke `main`. Saat app dibuka online, banner "Versi baru FitFlow tersedia" muncul → Muat ulang.

## Uji lokal

`python -m http.server 8765` di folder ini → buka `http://localhost:8765/`. Service worker tidak aktif dari `file://`; app-nya sendiri tetap jalan.

## Changelog

Lihat `CHANGELOG.md`.
