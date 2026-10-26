# Website Denny Indra (Astro)

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # hasil build ada di folder dist/
```

- Tema default **terang**; tombol bulan/matahari di header untuk beralih ke tema gelap (disimpan di browser).
- Logo: `public/logo-light.png` dan `public/logo-dark.png` (dipotong dari gambar logo).
- Nomor WhatsApp, email, dan nama diatur di `src/config.ts` (+62 878-6000-0788).
- Warna tema ada di `src/styles/global.css`.

## Dua bahasa
- Indonesia (default) di `/`, Inggris di `/en/`. Tombol **EN / ID** ada di header.
- Teks header, footer, dan halaman tambah kontak ada di `src/i18n.ts`. Isi halaman Inggris diterjemahkan lewat generator; untuk mengubah teks di kedua bahasa, ubah di file halaman `src/pages/*.astro` (Indonesia) dan `src/pages/en/*.astro` (Inggris).
