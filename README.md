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

## Kontras warna
Token warna yang dipakai ganda (sebagai teks dan latar) dipetakan khusus untuk tema gelap di bagian bawah `src/styles/global.css`. Bila menambah komponen baru, periksa kontras di kedua tema (minimal 4.5:1 untuk teks, 3:1 untuk ikon).
