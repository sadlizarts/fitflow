# Changelog

## 1.2.1 — 2026-09-30 (mulai dari nol + input riwayat manual)

- **Tanggal ukur** di form berat/BF (Home) dan lingkar perut (Progress): default hari ini, bisa diisi tanggal lampau, tanggal masa depan ditolak. Tanggal lampau disimpan jam 07.00; berat lampau tanpa BF tidak diestimasi.
- **Progress › Body › "Tambah (tanggal bebas)"**: form cepat untuk mengisi ulang riwayat berat & BF satu per satu; daftar riwayat kini 60 terbaru, urut terbaru di atas, edit divalidasi saat blur.
- **"Hapus semua data" benar-benar dari nol**: menghapus salinan utama, autosave 10 menit, safety backup, mirror IndexedDB, dan status onboarding, lalu onboarding diulang. Sebelumnya data lama bisa "dipulihkan otomatis" dari mirror bila app dibuka ulang < 1 detik setelah hapus (terverifikasi & diperbaiki).
- Tanggal default memakai zona waktu HP (sebelumnya UTC: sebelum 07.00 WIB tanggal default mundur sehari — termasuk form cardio).
- Pesan empty state grafik berat/BF menjelaskan jendela 30 hari.

## 1.2.0 — 2026-09-30 (Fase 3 · onboarding & engine nyata)

### Onboarding yang benar-benar mengatur engine
- 6 langkah: goal → level → tempat → hari/minggu → **profil tubuh** (jenis kelamin, tahun lahir, tinggi, berat, BF% dan HR istirahat opsional, divalidasi) → **ringkasan target** (kkal, protein, sesi/minggu, BMR/TDEE).
- Goal → target energi & protein: recomp −350 kkal · 2,1 g/kg (sama dengan v1.0), turun berat −500 · 2,2 g/kg, bangun otot +250 · 1,8 g/kg, bugar 0 · 1,6 g/kg.
- Jenis kelamin → Mifflin-St Jeor (+5 pria, −161 wanita). Batas aman kalori: tidak pernah di bawah 1.200 (wanita) / 1.500 (pria) kkal.
- Level → volume awal: pemula 3 set compound + 2 set isolasi; menengah seperti v1.0; lanjut compound hingga 4 set. Alasan tampil di Gate 5.
- Hari/minggu → target streak mingguan. Tempat → lokasi default di Home.
- Link "Sudah punya backup? Pulihkan dari file JSON" langsung di layar pertama (untuk migrasi dari v1.0).
- Tab More: pilih goal, level, jenis kelamin kapan saja; target kkal/protein ikut berubah dan ditampilkan.

### Tanpa data pribadi di kode
- Install baru = database kosong (tidak lagi di-seed data demo otomatis).
- 18 titik riwayat berat/BF pribadi, tanggal lahir, tinggi 161, target 62 kg dihapus dari `engine.js`. Data milik pengguna tetap ada di backup-nya sendiri dan ikut saat restore.
- Estimasi BF baru: ≥3 pengukuran asli → regresi tren sendiri (seperti v1.0); 1–2 pengukuran → model komposisi Forbes; tanpa pengukuran asli → tidak diestimasi.
- "Isi data contoh" memakai orang fiktif; "Hapus data contoh" mengembalikan profil, target, dan pengaturanmu.
- Target default mengikuti jenis kelamin (lingkar perut 90/80 cm, batas Asia WHO/IDF); kartu perut tidak lagi hardcode "target 80 cm".

### Empty state & copy
- History kosong: pesan + tombol ke rekomendasi hari ini. Body fat < 2 catatan: penjelasan, bukan grafik satu titik.
- Konsistensi protein dihitung dari hari yang tercatat saja (bukan "0 dari 6" di hari pertama).
- Kartu energi: label "defisit / surplus / maintenance" sesuai goal.

### Perbaikan regresi dari 1.1.0
- **Font & layout**: CSS milik popup laporan cetak ikut terbawa ke `styles.css` saat unbundle → body jadi Georgia serif, lebar maks 720 px, padding 24 px. Dihapus; tampilan kembali identik dengan v1.0 (diverifikasi berdampingan).
- **Banner "Versi baru"** selalu tampil karena `display:flex` inline mengalahkan atribut `hidden`. Kini hanya muncul saat benar-benar ada versi baru, dan halaman hanya dimuat ulang setelah tombol ditekan (tidak lagi saat instalasi pertama).
- Target berat/BF/perut, HR istirahat, HRmax di More divalidasi saat blur (sebelumnya di-clamp tiap ketikan, bug sama dengan B3).

### Tooling
- `tools/release.py` — regenerasi `sw.js` (daftar precache + nama cache berversi). `tests/engine.test.js` — 42 unit test engine (`node tests/engine.test.js`).

## 1.1.0 — 2026-09-30 (Fase 0–2)

### Fase 0 · Unbundle
- Bundle Claude Design (1 file HTML 1,28 MB) dipecah menjadi project statis: `index.html`, `app.js`, `engine.js`, `styles.css`, `vendor/`, `fonts/`, `icons/`, `assets/`.
- React/ReactDOM dilayani lokal dari `vendor/` (tidak lagi bergantung unpkg).
- `dc-runtime.js` dipatch: logika app dimuat dari `app.js` (`window.__dcDefineLogic`), template x-dc disimpan di `<template>` inert supaya browser tidak mem-parse binding `{{ }}` sebagai atribut SVG (0 error console).
- Font dipangkas ke subset latin: 4 file woff2 (±90 KB) dari 25 file (±400 KB).

### Fase 1 · Bug
- B1/B2: `clamp()` mengembalikan `fallback` untuk input kosong/null — "Simpan" berat/perut kosong kini ditolak dengan pesan, bukan tersimpan 20 kg / 40 cm.
- B3: Tinggi dan usia di Profil divalidasi saat blur (bukan tiap ketikan); nilai di luar rentang dikembalikan + pesan.
- B8: 7 `alert()` diganti toast in-app; 3 `confirm()` (buang sesi, hapus data, isi data contoh) diganti bottom sheet konfirmasi.
- B9: `<html lang="id">`, `<title>FitFlow</title>`, `theme-color`, `color-scheme: dark`, `viewport-fit=cover`.
- Label versi di Home dan More dibaca dari `FF.APP_VERSION`.

### Fase 2 · PWA
- `manifest.webmanifest` (standalone, portrait, ikon 192/512/maskable), `sw.js` precache + offline-first, network-first untuk `index.html`.
- Banner "Versi baru FitFlow tersedia → Muat ulang" saat service worker baru terpasang.
- Kartu "Pasang FitFlow di HP" di tab More (dari `beforeinstallprompt`), disembunyikan bila sudah standalone.

### Belum (Fase 3–5)
- Onboarding belum mengubah engine (goal/level/hari), BMR masih rumus pria, install baru masih di-seed data contoh + anchor pribadi.
- Restrukturisasi UX (Home ≤3 layar, header sesi sticky, More jadi menu), foto ke IndexedDB terpisah, migrations bernomor, auto-backup.

## 1.0.0 — 2026-09-29
- Rilis awal (single-file HTML, Claude Design bundle). Lihat `FitFlow-PRD-v1.0.md`.
