/* ============================================================
 * config.js — SATU-SATUNYA file yang perlu kamu edit.
 * Semua teks, foto, lagu, password, dan hadiah diatur di sini.
 * ============================================================ */
"use strict";

/* --- Gambar placeholder (gradient SVG, offline-friendly).
 * Ganti dengan path foto asli, contoh: "assets/photos/best1.jpg" --- */
const ART = {
  hero: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1DB954"/><stop offset="1" stop-color="#2D46B9"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/><text x="200" y="215" font-size="120" text-anchor="middle" fill="white" font-family="sans-serif">♫</text></svg>`),
  a: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8e44ad"/><stop offset="1" stop-color="#2D46B9"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><text x="150" y="170" font-size="90" text-anchor="middle" fill="white" font-family="sans-serif">✦</text></svg>`),
  b: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0f9b6c"/><stop offset="1" stop-color="#134e4a"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><text x="150" y="170" font-size="90" text-anchor="middle" fill="white" font-family="sans-serif">◍</text></svg>`),
  c: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e67e22"/><stop offset="1" stop-color="#c0392b"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><text x="150" y="170" font-size="90" text-anchor="middle" fill="white" font-family="sans-serif">❤</text></svg>`),
  d: "data:image/svg+xml," + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2c3e50"/><stop offset="1" stop-color="#4ca1af"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><text x="150" y="170" font-size="90" text-anchor="middle" fill="white" font-family="sans-serif">☾</text></svg>`)
};

const CONFIG = {
  /* Password layar kunci (contoh: tanggal+bulan lahir "1405").
   * Prompt di layar: "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)" */
  password: "1405",
  hintWrong: "Ups, salah kode 😅 coba ingat-ingat tanggal lahirnya~",

  /* Sapaan & cover utama */
  birthdayName: "Kamu", // ganti dengan nama panggilan
  heroPhoto: ART.hero,

  /* Galeri 1 — foto terbaik (tanpa caption).
   * Ganti dengan: "assets/photos/namafile.jpg" */
  bestShots: [ART.a, ART.b, ART.c, ART.d],

  /* Galeri 2 — foto lama / throwback */
  throwback: [ART.d, ART.c, ART.b, ART.a],

  /* Surat kecil — gaya kartu lirik. Tulis sesukamu, boleh panjang. */
  letterText:
`Hai kamu yang lagi ulang tahun! 🎉

Gak kerasa ya kita baru kenal sekitar semingguan, tapi vibes-nya udah seru banget. Semoga di umur yang baru ini hal-hal baik makin gampang nempel ke kamu: rezeki lancar, overthinking berkurang, dan playlist hidupmu isinya lagu-lagu enak semua.

Jangan lupa traktir permen atau es teh minimal satu gelas wkwk. Have a blast today! 🎂`,

  /* Daftar lagu.
   * - src: path mp3 lokal, contoh "assets/music/lagu1.mp3". Kosongkan ("") untuk mode demo.
   * - duration: "m:ss" — dipakai sebagai durasi mode demo & label waktu.
   * - youtube: opsional, contoh "https://www.youtube.com/watch?v=xxxxx".
   *   Kalau diisi, muncul ikon ▶ yang membuka video. */
  songs: [
    { title: "Best Day of My Life", artist: "American Authors", cover: ART.a, src: "", duration: "3:14", youtube: "" },
    { title: "Count on Me", artist: "Bruno Mars", cover: ART.b, src: "", duration: "3:17", youtube: "" },
    { title: "Spring Day", artist: "BTS", cover: ART.c, src: "", duration: "4:34", youtube: "" },
    { title: "Happy", artist: "Pharrell Williams", cover: ART.d, src: "", duration: "3:53", youtube: "" }
  ],

  /* Hadiah misteri (prank). Tombol DM hanya muncul jika socialDmLink diisi. */
  giftPrankText: "Aku gak bisa kirim hadiahnya, karena gak punya no HP dan alamatmu wkwk 😂🎁",
  socialDmLink: "" // contoh: "https://ig.me/m/username" — kosongkan untuk sembunyikan tombol
};
