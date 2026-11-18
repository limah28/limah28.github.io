/* ============================================================
 * config.js — SATU-SATUNYA file yang perlu kamu edit.
 * Semua teks, foto, lagu, password, dan hadiah diatur di sini.
 * ============================================================ */
"use strict";

/* --- Gambar placeholder (gradient SVG, offline-friendly).
 * Ganti dengan path foto asli, contoh: "assets/photos/best1.jpg" --- */const ART = {
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

/* --- Helper: bangun daftar foto bernomor urut.
 * Contoh: seq("assets/photos/NEW/", 0, 12) → NEW/0.jpg … NEW/12.jpg --- */
const seq = (dir, from, to) => {
  const out = [];
  for (let i = from; i <= to; i++) out.push(dir + i + ".jpg");
  return out;
};

const CONFIG = {
  /* Password layar kunci (contoh: tanggal+bulan lahir "1405").
   * Prompt di layar: "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)" */
  password: "1405",
  hintWrong: "Ups, salah kode 😅 coba ingat-ingat tanggal lahirnya~",

  /* Sapaan & cover utama */
  birthdayName: "Kamu", // ganti dengan nama panggilan
  heroPhoto: ART.hero,

  /* Galeri 1 — foto NEW (terbaru), tanpa caption. */
  bestShots: seq("assets/photos/NEW/", 0, 12),

  /* Galeri 2 — foto OLD (lama) / throwback. */
  throwback: seq("assets/photos/OLD/", 1, 14),

  /* Surat kecil — gaya kartu lirik. Tulis sesukamu, boleh panjang. */
  letterText:
`Hai kamu yang lagi ulang tahun! 🎉

Gak kerasa ya kita baru kenal sekitar semingguan, tapi vibes-nya udah seru banget. Semoga di umur yang baru ini hal-hal baik makin gampang nempel ke kamu: rezeki lancar, overthinking berkurang, dan playlist hidupmu isinya lagu-lagu enak semua.

Jangan lupa traktir permen atau es teh minimal satu gelas wkwk. Have a blast today! 🎂`,

  /* Daftar lagu.
   * - src: URL audio preview 30 detik, path mp3 lokal ("assets/music/lagu1.mp3"),
   *   atau "" untuk mode demo (timer tanpa suara).
   * - duration: "m:ss" — label durasi ala Spotify.
   * - spotify: link Spotify (search/detail). Muncul ikon Spotify hijau → buka full di aplikasi.
   * - youtube: opsional "https://www.youtube.com/watch?v=xxxxx" → ikon ▶ buka video. */
  songs: [
    { title: "Sial", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/ee/3c/96/ee3c9611-4be3-c95d-831a-1b85048c545f/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/91/80/9d/91809d97-35d2-8531-cf14-fad1b9350d83/mzaf_13487711256406210167.plus.aac.p.m4a", duration: "4:03", spotify: "https://open.spotify.com/search/Mahalini%20Sial", youtube: "" },
    { title: "Melawan Restu", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/9e/bd/a79ebd67-f79d-b5ea-c305-8463b06d206a/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/69/92/b7/6992b714-6257-6d4e-d458-04f18cd6e66d/mzaf_17987547225549782361.plus.aac.p.m4a", duration: "3:39", spotify: "https://open.spotify.com/search/Mahalini%20Melawan%20Restu", youtube: "" },
    { title: "Kisah Sempurna", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4d/ee/a6/4deea663-8868-a069-3583-4061e19ec993/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/d0/d2/1dd0d2ca-51e6-3e77-c04c-575ecf6c9b48/mzaf_741311121871427890.plus.aac.p.m4a", duration: "4:36", spotify: "https://open.spotify.com/search/Mahalini%20Kisah%20Sempurna", youtube: "" },
    { title: "Sisa Rasa", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/cb/a6/84/cba684fc-720b-485a-ebb0-96e9b79f6b5e/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/19/4a/dc/194adc61-e44c-c609-5e47-480e6e9fde44/mzaf_7249735545085540214.plus.aac.p.m4a", duration: "4:14", spotify: "https://open.spotify.com/search/Mahalini%20Sisa%20Rasa", youtube: "" },
    { title: "Mati-Matian", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e6/91/eb/e691eb58-7ae3-cb1b-0a5f-839ad3a010e0/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/29/e8/10/29e8108c-a605-34e9-340e-eb15843978a4/mzaf_6232590663506982387.plus.aac.p.m4a", duration: "4:04", spotify: "https://open.spotify.com/search/Mahalini%20Mati-Matian", youtube: "" }
  ],

  /* Kartu "About the artist" di bawah daftar lagu. */
  artist: {
    name: "Mahalini",
    blurb: "Penyanyi pop Indonesia dengan vokal khas dan lagu-lagu galau yang nagih. Pas banget buat nemenin hari spesialmu hari ini.",
    photo: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/cb/a6/84/cba684fc-720b-485a-ebb0-96e9b79f6b5e/cover.jpg/600x600bb.jpg",
    url: "https://open.spotify.com/search/Mahalini"
  },

  /* Hadiah misteri (prank). Tombol DM hanya muncul jika socialDmLink diisi. */
  giftPrankText: "Aku gak bisa kirim hadiahnya, karena gak punya no HP dan alamatmu wkwk 😂🎁",
  socialDmLink: "" // contoh: "https://ig.me/m/username" — kosongkan untuk sembunyikan tombol
};
