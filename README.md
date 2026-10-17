# Media Ajar Sistem Digital

Modul ajar interaktif mata kuliah **Sistem Digital** (3 SKS) berbentuk situs statis
multi-halaman. Setiap minggu memuat peta konsep, uraian bertahap, contoh bergambar,
simulator interaktif, dan latihan berpembahasan.

## Struktur

```
index.html          Beranda + Silabus + peta 14 minggu
minggu1.html …      Halaman per minggu (1–7 versi bergambar, 8–14 apa adanya)
css/style.css       Seluruh gaya (termasuk tema gelap & aturan cetak)
js/shell.js         Header, navigasi, footer, pager antar-halaman
js/svg-kit.js       Pustaka diagram SVG inline (registry SISDIG_SVG)
js/learn.js         Mesin sub-tab + kuis (pilihan ganda & isian + pembahasan)
js/home.js          Peta minggu di Beranda
js/script.js        Konverter M1 + toggle tema (legacy tab diberi penjaga)
js/*.js             Simulator per minggu (signed, boolean, kmap, comb, seq)
materi/             Sumber materi (PPTX + hasil ekstrak)
build/              Skrip pemecah index & backup index asli
```

Situs **tanpa build tool** dan **tanpa dependensi eksternal** — cukup buka
`index.html`, atau unggah seluruh folder ke hosting statis.

## Menjalankan secara lokal

Karena hanya berkas statis, buka `index.html` langsung di browser. Untuk hasil
terbaik (agar path relatif konsisten), jalankan server statis sederhana:

```bash
python3 -m http.server 8000
# lalu buka http://localhost:8000
```

## Deploy ke GitHub Pages

1. Buat repositori baru di GitHub, lalu dorong folder ini:

   ```bash
   git init
   git add .
   git commit -m "Media ajar Sistem Digital"
   git branch -M main
   git remote add origin https://github.com/<username>/<repo>.git
   git push -u origin main
   ```

2. Di GitHub buka **Settings → Pages**.
3. Pada **Build and deployment**, pilih **Source: Deploy from a branch**.
4. Pilih **Branch: `main`** dan folder **`/ (root)`**, lalu **Save**.
5. Tunggu 1–2 menit; situs tersedia di
   `https://<username>.github.io/<repo>/`.

Catatan penting:

- GitHub Pages menyajikan `index.html` di root sebagai halaman muka — sudah tersedia.
- Seluruh tautan memakai **path relatif** (tanpa garis miring di depan) sehingga
  aman di sub-folder repositori.
- Nama berkas **case-sensitive**; pastikan huruf besar/kecil konsisten
  (`minggu1.html`, bukan `Minggu1.html`).
- Berkas `.nojekyll` sudah disertakan agar GitHub Pages tidak memproses situs
  dengan Jekyll.

## Cetak / PDF

Gunakan tombol cetak pada tiap halaman. Aturan cetak otomatis menyembunyikan
header, navigasi, dan pager, serta hanya mencetak panel yang sedang aktif
(Pembelajaran atau Cheatsheet).
