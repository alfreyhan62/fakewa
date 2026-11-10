# WA Chat Studio — Context Handoff

## Tujuan
Web editor simulasi percakapan WhatsApp Android, mobile-first. Satu halaman editor; tidak ada landing page, login, backend, database server, atau dashboard.

## Batasan penting
- Preview harus realistis: status bar simulasi, header kontak, wallpaper, bubble, timestamp, centang, input, navigation bar Android.
- Jam mengikuti waktu lokal perangkat.
- Sinyal, Wi-Fi, baterai hanya indikator simulasi.
- Hasil preview/export diberi penanda `SIMULASI`.
- Jangan menambah fitur di luar ruang lingkup.

## Fitur yang sudah ada
- Editor profil: nama, nomor, status, foto upload.
- Editor pesan: tambah, edit, hapus, sender, jam, receipt, urut naik/turun.
- Tampilan: tema terang/gelap, wallpaper doodle/polos/mint.
- LocalStorage otomatis dengan key `wa-chat-studio`.
- Import/export JSON.
- Export PNG HD lewat `html-to-image`.
- Responsif: panel samping desktop, sheet bawah mobile.

## Referensi
- `landing.html`: referensi warna, ukuran, komposisi preview.
- `WA_Chat_Studio_Blueprint.md`: spesifikasi dan model data.
- `WA_Chat_Studio_ERD.mmd`: ERD.
- Wallpaper dari URL pengguna tersimpan lokal di `public/wallpapers/wa-doodle-dark.jpg`.

## File utama
- `src/App.jsx`: seluruh UI, Zustand store, LocalStorage, JSON/PNG export.
- `src/App.css`: styling editor dan preview.
- `src/index.css`: baseline global.
- `package.json`: React, Vite, Zustand, Lucide React, html-to-image.

## Catatan visual terakhir
- Bug bubble tinggi sudah diperbaiki: selector profil header harus tetap `.chat-header .contact`, jangan gunakan `.contact` global.
- Centang dua dibuat dari dua ikon `Check` yang ditumpuk via `.double-check` di `src/App.css`.
- Bubble memiliki ekor CSS dan penyesuaian dark mode.
- Wallpaper default `doodle` kini menggunakan gambar lokal gelap. Pastikan bubble/teks tetap terbaca pada kombinasi wallpaper-tema apa pun.

## Verifikasi terakhir
Semua lulus:
```powershell
npm run lint
npm run build
```

## Menjalankan proyek
```powershell
cd D:\fakewa\wa-chat-studio
npm run dev
```
Buka URL yang dicetak Vite, biasanya `http://localhost:5173`.

## Pekerjaan berikutnya yang disarankan
1. Uji visual preview secara manual pada browser mobile dan desktop.
2. Perhalus kemiripan WhatsApp bila ada screenshot acuan spesifik dari pengguna.
3. Jangan menghapus fitur yang sudah berfungsi.
