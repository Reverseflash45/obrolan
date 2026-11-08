# Obrolan

Kartu pertanyaan *deep talk* di browser, terinspirasi dari kartu fisik untuk pasangan. Pilih mode, pilih topik, lalu tarik kartu satu per satu dan jawab bergantian. Tidak perlu akun dan tidak ada iklan. Bisa dipasang ke layar utama HP dan dipakai tanpa internet.

- **41 topik, 10.309 pertanyaan.** Tiap topik punya minimal 250 pertanyaan, terbagi ke tiga level: santai, sedang, dan dalam.
- **4 mode:** Berpasangan, Teman, Keluarga, Sendiri.
- **6 tema:** Merah Klasik, Pastel Lembut, Malam, Senja, Hutan, Retro.
- **3 topik 18+** (khusus mode Berpasangan). Tersembunyi sampai diaktifkan di Pengaturan dan umur 18+ dikonfirmasi.

## Fitur

| Fitur | Keterangan |
|---|---|
| Tarik kartu | Dek dikocok sekali. Kartu tidak berulang sampai semua kartu di topik terpilih habis, lalu bisa dikocok ulang. |
| Kartu | Kartu landscape dengan bingkai putih tebal, warna per topik, pola gelombang, dan teks kapital tulisan tangan. Ada nomor kartu, garis emas, label "~ OBROLAN ~" dan nama kategori. |
| Animasi | Kartu dibalik saat dibuka dan bergeser saat pindah. Semua animasi dimatikan kalau "reduce motion" aktif. |
| Geser | Geser ke kanan untuk lanjut, ke kiri untuk lewati. Di keyboard pakai panah kanan/kiri. |
| Giliran | 2 nama untuk mode Berpasangan, sampai 6 nama untuk Teman/Keluarga. Tampil sebagai "Giliran Rafi bertanya, Nadia menjawab duluan". |
| Level | Saring kartu: Santai, Sedang, Dalam (boleh lebih dari satu). |
| Timer | Tanpa, 30 detik, 1 menit, atau 2 menit per kartu. Bisa dijeda dan diulang, HP bergetar saat waktu habis. |
| Favorit | Simpan kartu dengan ♥, lalu buka lagi di halaman Favorit. |
| Riwayat | Kartu yang sudah keluar di permainan ini, beserta statusnya (dijawab atau dilewati). |
| Kartu Hari Ini | Satu pertanyaan yang sama untuk semua orang di hari yang sama, dipilih dari tanggal. |
| Bagikan | Ekspor kartu jadi PNG 1080×1920 (ukuran story Instagram). Di HP lewat menu bagikan, di desktop diunduh. |
| Acak Semua Topik | Langsung main dengan semua topik yang tersedia untuk mode itu. |
| Penyimpanan | Semua di `localStorage`: pengaturan, nama pemain, favorit, permainan terakhir. |
| PWA | Aplikasi dan semua kartu ikut tersimpan oleh service worker, jadi bisa dibuka tanpa internet. |

## Teknologi

React 19, Vite, TypeScript, Tailwind CSS 4, Framer Motion, html-to-image, vite-plugin-pwa. Huruf dari Fontsource dibundel lokal, jadi tetap muncul saat offline: Patrick Hand dan Gochi Hand untuk kartu, Lexend untuk antarmuka, Shrikhand untuk tema Retro.

## Struktur folder

```
obrolan/
├─ data/sumber/{topik}.txt        ← sumber pertanyaan (yang diedit manusia)
├─ public/
│  ├─ data/questions/{topik}.json ← hasil susun, dimuat per topik saat dibutuhkan
│  ├─ favicon.svg, ikon-*.png, apple-touch-icon.png, og.png
├─ scripts/
│  ├─ susun.mjs     ← sumber .txt → JSON + src/data/jumlah.json
│  └─ validasi.mjs  ← cek kualitas data
├─ src/
│  ├─ data/topik.json   ← daftar grup & topik (nama, ikon, mode, 18+)
│  ├─ data/jumlah.json  ← jumlah kartu per topik/level (dibuat otomatis)
│  ├─ lib/       ← tipe, penyimpanan (toko), rute hash, tema, pemuat data, sesi
│  ├─ komponen/  ← Kartu, Tombol, Ikon, Timer, Bagikan, DaftarKartu
│  └─ halaman/   ← Beranda, PilihMode, PilihTopik, Main, Favorit, Riwayat, HariIni, Pengaturan
└─ vite.config.ts ← konfigurasi PWA
```

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # susun + validasi data, cek tipe, build ke dist/
npm run preview    # coba hasil build (termasuk service worker)
```

## Data pertanyaan

Tiap pertanyaan di JSON berformat:

```json
{ "id": "masa-lalu-0001", "topic": "masa-lalu", "mode": ["pasangan"], "level": "santai", "adult": false, "text": "Apa jajanan masa kecil yang paling kamu kangenin sampai sekarang?" }
```

JSON tidak diedit langsung. Pertanyaan ditulis di `data/sumber/{topik}.txt`, satu per baris, diawali kode level:

```
s|Apa jajanan masa kecil yang paling kamu kangenin sampai sekarang?
m|Apa nasihat orang tua yang dulu kamu abaikan tapi sekarang kamu pahami?
d|Luka masa kecil apa yang masih kamu bawa sampai hari ini?
```

`s` = santai, `m` = sedang, `d` = dalam. Baris kosong dan baris yang diawali `#` diabaikan. Setelah mengedit:

```bash
npm run data       # susun ulang JSON & jumlah kartu
npm run validasi   # harus berakhir dengan "semua lolos ✓"
```

`npm run validasi` mengecek:

- skema setiap entri, id unik, `topic` cocok dengan nama file, dan flag 18+ cocok dengan topiknya;
- bentuk kalimat: satu kalimat, maksimal 20 kata, diakhiri tanda tanya, tidak ada spasi berlebih;
- duplikat persis, setelah normalisasi huruf, tanda baca, dan sinonim gaul (*gak/nggak → tidak*, *gue → aku*, *lo → kamu*, dan seterusnya);
- duplikat makna: kemiripan kata isi ≥ 0,8 di semua topik, dan kemiripan trigram huruf ≥ 0,9 di dalam satu topik;
- jumlah: minimal 250 per topik, minimal 30 per level, minimal 10.000 total.

Pasangan dengan kemiripan 0,67–0,8 hanya dilaporkan sebagai peringatan. Lihat dengan `node scripts/validasi.mjs --rinci`. Sebagian besar peringatan ini adalah pasangan berlawanan yang sengaja dibuat (misalnya "yang membuatmu ragu" dan "yang membuatmu yakin").

Gaya bahasa yang dipakai:

- **Berpasangan:** "aku/kamu".
- **Teman:** "lo/gue".
- **Keluarga, Diri Sendiri, dan Seru-seruan:** "kamu" yang netral.

Topik 18+ membahas keintiman pasangan dewasa tanpa bahasa vulgar atau grafis. Fokusnya pada keinginan, kenyamanan, persetujuan, dan batasan.

Menambah topik baru:

1. Tambah entri di `src/data/topik.json` (id, nama, grup, ikon, mode, adult).
2. Buat `data/sumber/{id}.txt` berisi minimal 250 pertanyaan.
3. Jalankan `npm run data && npm run validasi`.

## Aksesibilitas

- Diuji dengan axe-core (WCAG 2.1 AA) di 9 layar × 6 tema: 0 pelanggaran.
- Teks antarmuka minimal 18px, teks kartu minimal 24px, tombol minimal 48px.
- Setiap ikon disertai label teks, dan fokus keyboard terlihat.
- Topik 18+ dikonfirmasi lewat panel di halaman Pengaturan, bukan pop-up.

## Deploy ke Vercel

Proyek ini Vite statis, jadi tidak perlu konfigurasi khusus.

1. Push repo ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo ini. Framework terdeteksi sebagai Vite, build command `npm run build`, output `dist`.
3. Deploy. Setiap push ke `main` akan men-deploy ulang otomatis.

Lewat CLI: `npx vercel` untuk deploy pratinjau, `npx vercel --prod` untuk produksi.

Rute aplikasi memakai hash (`/#/main`, `/#/favorit`, …), jadi tidak perlu aturan *rewrite*.
