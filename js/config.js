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

const CONFIG = {
  /* Saklar layar kunci: true = password aktif, false = nonaktif (fitur tetap ada).
   * Saat false, halaman langsung masuk tanpa minta sandi. */
  lockEnabled: false,
  /* Password layar kunci (contoh: tanggal+bulan lahir "1405").
   * Prompt di layar: "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)" */
  password: "2811",
  hintWrong: "Ups, salah kode 😅 tanggal lahir kamu bukan itu ~",

  /* Sapaan & cover utama */
  birthdayName: "Siti Choirotul Halimah", // ganti dengan nama panggilan
  heroPhoto: "assets/photos/NEW/11_h.jpg",

  /* Judul yang tampil di halaman Playlist (bisa diubah lewat editor). */
  headline: "Selamat Bertambah Umur Limah 🎉",
  galleryNewTitle: "Galeri Bidadari Baru Baru Ini 🙂",
  galleryOldTitle: "Galeri Bidadari Waktu Masih Muda Banget 🥳",

  /* Teks statis seluruh halaman (diubah lewat editor lokal edit.py).
   * Meliputi: lock, gate, intro, panggung, playlist, surat, hadiah, footer. */
  gateTitle: "HBD LIMAH",
  gateHint: "ketuk ini",
  audioHint: "🔊 nyalakan suaranya ya~",
  lockEyebrow: "Special Birthday Edition",
  lockTitle: "Playlist ini dikunci 🔒",
  lockPrompt: "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)",
  lockButton: "Buka",
  topbarTitle: "Limah Birthday Playlist",
  playlistEyebrow: "Playlist • Limah Birthday Playlist",
  bdayPrefix: "Happy Birthday ",
  stageLoader: "tunggu ya...",
  stageOldTitle: "Foto Lama",
  stageNewTitle: "Foto Baru",
  stageOldBtn: "Lihat semua foto lama",
  stageNewBtn: "Lihat semua foto",
  songsTitle: "Songs You Might Like",
  songsHint: "Preview 30 detik",
  letterTitle: "SURAT CILIK",
  letterEyebrow: "A little letter...",
  letterMore: "Baca Selengkapnya...",
  letterLess: "Tutup",
  giftTitle: "Hadiah Misteri",
  giftCardTitle: "Hadiah Misteri Ulang Tahun 🎁",
  giftDesc: "Ada satu kejutan kecil spesial buat kamu hari ini.",
  giftBtn: "Buka Hadiah Misteri",
  giftDm: "Balas via DM aja deh 💬",
  footText: "Made with Heart • Limah 26 in 2026",
  introSkip: "lewati ›",

  /* Panggung karakter setelah kunci: idle (dagu), think (berpikir), point (menunjuk).
   * Kiri/kanan otomatis di-flip. bg = latar panggung. */
  stage: {
    bg: "assets/photos/HOME/BG.jpg",
    idle: "assets/photos/HOME/pose_dagu_clean2.png",
    think: "assets/photos/HOME/pose_berpikir_clean.png",
    point: "assets/photos/HOME/pose_menunjuk_transparan.png"
  },

  /* Galeri 1 — foto NEW (terbaru), tanpa caption.
   * Satu path per baris; tambah/hapus baris sesuai jumlah foto. */
  bestShots: [
    "assets/photos/NEW/1.jpg",
    "assets/photos/NEW/2.jpg",
    "assets/photos/NEW/3.jpg",
    "assets/photos/NEW/4.jpg",
    "assets/photos/NEW/5.jpg",
    "assets/photos/NEW/6.jpg",
    "assets/photos/NEW/7.jpg",
    "assets/photos/NEW/8.jpg",
    "assets/photos/NEW/9.jpg",
    "assets/photos/NEW/10.jpg",
    "assets/photos/NEW/11.jpg",
    "assets/photos/NEW/12.jpg",
    "assets/photos/NEW/13.jpg",
    "assets/photos/NEW/14.jpg",
    "assets/photos/NEW/15.jpg",
    "assets/photos/NEW/16.jpg",
    "assets/photos/NEW/17.jpg",
    "assets/photos/NEW/18.jpg",
    "assets/photos/NEW/19.jpg",
    "assets/photos/NEW/20.jpg",
    "assets/photos/NEW/21.jpg",
    "assets/photos/NEW/22.jpg",
    "assets/photos/NEW/23.jpg",
    "assets/photos/NEW/24.jpg",
    "assets/photos/NEW/25.jpg"
  ],

  /* Backsound tiap sisi panggung (preview 30 detik, loop, resmi iTunes).
   * NEW = Terima Kasih Sudah Bertahan, OLD = Masa Mudaku Habis (Ghea Indrawari). */
  stageMusic: {
    new: { title: "Terima Kasih Sudah Bertahan", artist: "Ghea Indrawari",
      src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/50/63/f0/5063f0fc-f598-388b-ac45-cfe24922bf97/mzaf_2150990291807829178.plus.aac.p.m4a",
      spotify: "https://open.spotify.com/search/Ghea%20Indrawari%20Terima%20Kasih%20Sudah%20Bertahan" },
    old: { title: "Masa Mudaku Habis", artist: "Ghea Indrawari",
      src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/8a/f3/a8/8af3a8d9-e73a-f0ba-ab02-dd111b779581/mzaf_7637327458435513542.plus.aac.p.m4a",
      spotify: "https://open.spotify.com/search/Ghea%20Indrawari%20Masa%20Mudaku%20Habis" }
  },

  /* Galeri 2 — foto OLD (lama) / throwback. */
  throwback: [
    "assets/photos/OLD/1.jpg",
    "assets/photos/OLD/2.jpg",
    "assets/photos/OLD/3.jpg",
    "assets/photos/OLD/4.jpg",
    "assets/photos/OLD/5.jpg",
    "assets/photos/OLD/6.jpg",
    "assets/photos/OLD/7.jpg",
    "assets/photos/OLD/8.jpg",
    "assets/photos/OLD/9.jpg",
    "assets/photos/OLD/10.jpg",
    "assets/photos/OLD/11.jpg",
    "assets/photos/OLD/12.jpg",
    "assets/photos/OLD/13.jpg",
    "assets/photos/OLD/14.jpg",
    "assets/photos/OLD/15.jpg",
    "assets/photos/OLD/16.jpg",
    "assets/photos/OLD/17.jpg",
    "assets/photos/OLD/18.jpg",
    "assets/photos/OLD/20.jpg"
  ],

  /* Intro sambutan (spesifikasi: awal.html). Satu baris = satu grup tampil.
   * Koma (,) diketik huruf per huruf; titik/ellipsis fade-in elegan.
   * s: opener (pembuka, mencolok) | a (italic) | b (normal) | c (lembut). */
  introMusic: "assets/music/hbdmusicbox.mp3",
  /* Musik halaman char (loop). */
  charMusic: { title: "Bermimpi", artist: "Mahalini",
    src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/3e/62/783e62cd-d48d-127d-57fd-c308f7743566/mzaf_5569112252096941211.plus.aac.p.m4a",
    spotify: "https://open.spotify.com/search/Mahalini%20Bermimpi" },
  introLines: [
    { t: "Happy birthday Limah, Happy birthday Limah, Happy birthday Siti Choirotul Halimah..", s: "opener" },
    { t: "Selamat ultah Limah... Yeee 🥳", s: "a" },
    { t: "Gak terasa ya udah 26 tahun perjalanan waktu di dunia ini terlewati.. Detik demi detik, hari demi hari berlalu.. Tibalah di hari ini, di titik tanggal yang sama, dahulu kala, awal kita menerima amanah kehidupan.. Haha maksudnya apaan toh..", s: "b" },
    { t: "Tetap smile 🙂.. Tetap semangat 👊.. Tetap bercahaya dan menyala setiap harinya... Your smile anugrah bagi semesta 😄...", s: "c" },
    { t: "Semoga... Untuk kedepannya... lebih berbahagia, lebih sehat dan fit, mampu mencapai hal hal baik yang diimpikan... Ya Allah kabulkanlah doa doa kami... Aamiin... Aamiin ya Robbal'alamin 🤲", s: "a" }
  ],
  /* Surat kecil — gaya kartu lirik. Tulis sesukamu, boleh panjang. */
  letterText:
`Assalamualaikum,

Hai, kamu yang lagi ulang tahun! 🎉

Sehat sehat nya yang banyak ya, bahagianya yang buanyak, beruntungnya juga banyak , aamiin.

Kamu jaga kesehatannya, kurangin gula kalau bisa haha, agar organ kita gak terlalu capek hehe, tapi itu pulak yang sedap yakan wkwk.

Sehat sehat juga untuk keluarga Limah ya, sabar menghadapi cobaan apapun yang ada, keberuntungan dan hal yang diimpikan segera terwujud, aamiin.

---

Makasih udah sampai sini dan mau meluangkan waktu melihat hal absurd ini hahaha.

Makasih ya.. 
Aku cuma mau makasih, dan aku berharap semangat yang kamu datangkan tetap ada di diriku, meski mungkin nanti aku tiada wkwk.

Makasih ya udah mau luangkan waktu, hidup ini jadi ada warnanya, dan jadi bisa bermimpi hehe.


Yang baru gajian, traktir es teh dong, apa udah abis gajinya wkwk

Makasih ya Limah, hope you very very happy in your birthday, and this year gonna be your luckiest year ever.

Sori alay dan maaf kan semua salahku, aku berharap masih terus buat salah kedepannya dan tetap sering meledikin dirimu walau itu cringe :D 

---
...
...
...
...
...
...
---

Aku punya niat yang baik, coba ku ungkapkan padamu. Kalau kamu berkenan bolehkah kita bertaaruf? ke arah yang serius, jika kamu tidak berkenan aku pun tak apa, Makasih udah membaca sampai sini. Makasih udah mau membalas dan menemui orang aneh ini. Semua doa terbaik untukmu 🙂`,

  /* Daftar lagu.
   * - src: URL audio preview 30 detik, path mp3 lokal ("assets/music/lagu1.mp3"),
   *   atau "" untuk mode demo (timer tanpa suara).
   * - duration: "m:ss" — label durasi ala Spotify.
   * - spotify: link Spotify (search/detail). Muncul ikon Spotify hijau → buka full di aplikasi.
   * - youtube: opsional "https://www.youtube.com/watch?v=xxxxx" → ikon ▶ buka video. */
  /* Daftar lagu — vibe positif semua (cinta, syukur, semangat).
   * Preview 30 detik resmi iTunes; ketuk ikon Spotify untuk dengar full. */
  songs: [
    { title: "Happy Birthday Limah", artist: "Siti Choirotul Halimah", cover: "assets/photos/NEW/11_h.jpg", src: "assets/music/hbdmusicbox.mp3", duration: "0:36", spotify: "", youtube: "" },
    { title: "Kisah Sempurna", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/4d/ee/a6/4deea663-8868-a069-3583-4061e19ec993/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/1d/d0/d2/1dd0d2ca-51e6-3e77-c04c-575ecf6c9b48/mzaf_741311121871427890.plus.aac.p.m4a", duration: "4:36", spotify: "https://open.spotify.com/search/Mahalini%20Kisah%20Sempurna", youtube: "" },
    { title: "Melawan Restu", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/a7/9e/bd/a79ebd67-f79d-b5ea-c305-8463b06d206a/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/69/92/b7/6992b714-6257-6d4e-d458-04f18cd6e66d/mzaf_17987547225549782361.plus.aac.p.m4a", duration: "3:39", spotify: "https://open.spotify.com/search/Mahalini%20Melawan%20Restu", youtube: "" },
    { title: "Bermimpi", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e6/4c/65/e64c65bd-914a-dff9-de6a-c721540dc7ec/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/78/3e/62/783e62cd-d48d-127d-57fd-c308f7743566/mzaf_5569112252096941211.plus.aac.p.m4a", duration: "3:40", spotify: "https://open.spotify.com/search/Mahalini%20Bermimpi", youtube: "" },
    { title: "Kemarilah Tenang", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e6/4c/65/e64c65bd-914a-dff9-de6a-c721540dc7ec/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9d/f2/56/9df256bf-afe5-3134-7a70-90b066eee07e/mzaf_9381900515145113784.plus.aac.p.m4a", duration: "3:58", spotify: "https://open.spotify.com/search/Mahalini%20Kemarilah%20Tenang", youtube: "" },
    { title: "Mencintaimu", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/d8/f1/b8/d8f1b8fd-9d72-a56b-f86d-9305637dde5a/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c2/f1/6c/c2f16ca7-a2d4-505d-6814-3ceae758443b/mzaf_13135194633921981804.plus.aac.p.m4a", duration: "4:54", spotify: "https://open.spotify.com/search/Mahalini%20Mencintaimu", youtube: "" },
    { title: "Bawa Dia Kembali", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/ee/3c/96/ee3c9611-4be3-c95d-831a-1b85048c545f/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/04/46/c2/0446c21f-ef66-4433-71b8-d8786dc97683/mzaf_685501210995257733.plus.aac.p.m4a", duration: "3:46", spotify: "https://open.spotify.com/search/Mahalini%20Bawa%20Dia%20Kembali", youtube: "" },
    { title: "Sampai Menutup Mata", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/4c/b5/5a/4cb55ac8-8aec-67e3-be4d-236635802504/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9b/92/f4/9b92f4fc-da3f-662a-6c96-a0698f29e722/mzaf_16202423633313500589.plus.aac.p.m4a", duration: "4:08", spotify: "https://open.spotify.com/search/Mahalini%20Sampai%20Menutup%20Mata", youtube: "" },
    { title: "Satu Tuju", artist: "Mahalini & Rizky Febian", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/ce/4e/60/ce4e6057-d627-09eb-6252-3471e15ec709/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/f3/33/d0/f333d0ee-9b6b-7489-4bde-1b198335751c/mzaf_7161798109945183140.plus.aac.p.m4a", duration: "4:09", spotify: "https://open.spotify.com/search/Mahalini%20Rizky%20Febian%20Satu%20Tuju", youtube: "" },
    { title: "Janji Kita", artist: "Mahalini & Nuca", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/1a/c8/5f/1ac85f66-017a-b3bd-bb5d-47746b4ed800/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/83/bf/c8/83bfc887-18dc-fe60-f454-3573329998a4/mzaf_16152113912677611349.plus.aac.p.m4a", duration: "4:39", spotify: "https://open.spotify.com/search/Mahalini%20Nuca%20Janji%20Kita", youtube: "" },
    { title: "Ini Laguku", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b8/fa/ef/b8faef78-86ca-5652-4c95-aa680a7a3427/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/98/8d/42/988d4272-0c82-d7fe-e162-b76e2d527681/mzaf_18349949826599360788.plus.aac.p.m4a", duration: "3:37", spotify: "https://open.spotify.com/search/Mahalini%20Ini%20Laguku", youtube: "" },
    { title: "Buru-Buru", artist: "Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b8/fa/ef/b8faef78-86ca-5652-4c95-aa680a7a3427/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9d/12/84/9d1284cd-ab86-4a1d-c11e-736a53e5e225/mzaf_14934613651989932906.plus.aac.p.m4a", duration: "3:42", spotify: "https://open.spotify.com/search/Mahalini%20Buru-Buru", youtube: "" },
    { title: "Bermuara (feat. Mahalini)", artist: "Rizky Febian", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/ef/03/ad/ef03ad3d-c200-496e-d020-08a8379bea7b/24UMGIM46064.rgb.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/de/bb/29/debb29fc-f0c1-f782-3821-c18534af1cff/mzaf_17201841239686581148.plus.aac.p.m4a", duration: "4:47", spotify: "https://open.spotify.com/search/Rizky%20Febian%20Mahalini%20Bermuara", youtube: "" },
    { title: "You're Mine", artist: "Rizky Febian & Mahalini", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/25/8c/28/258c280d-6ec1-755f-f9d8-8f8bd5346e52/23UMGIM04172.rgb.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview123/v4/7e/2e/7c/7e2e7c9c-2ec7-f28f-cf0d-099250eced17/mzaf_13366587520120975408.plus.aac.p.m4a", duration: "4:08", spotify: "https://open.spotify.com/search/Rizky%20Febian%20Mahalini%20Youre%20Mine", youtube: "" },
    { title: "Rindu Ku Rindu", artist: "Mahalini & Nosstress", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/e6/4c/65/e64c65bd-914a-dff9-de6a-c721540dc7ec/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c1/a0/34/c1a034b8-6d1e-ef6b-efe5-7a61b4323904/mzaf_3234602250746647530.plus.aac.p.m4a", duration: "4:36", spotify: "https://open.spotify.com/search/Mahalini%20Nosstress%20Rindu%20Ku%20Rindu", youtube: "" },
    { title: "CLEAR YOUR HEAD", artist: "Mahalini & Laleilmanino", cover: "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/63/d9/52/63d952d6-f183-bb1b-4b1f-1ca0bd245da3/cover.jpg/600x600bb.jpg", src: "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/7e/77/6c/7e776c0b-dc8f-9a43-c667-3d9dc0a1e2be/mzaf_14424069875670040866.plus.aac.p.m4a", duration: "3:15", spotify: "https://open.spotify.com/search/Mahalini%20Laleilmanino%20Clear%20Your%20Head", youtube: "" }
  ],

  /* Hadiah misteri (prank). Tombol DM hanya muncul jika socialDmLink diisi. */
  giftPrankText: "Sayangnya gak ada karena gak punya no HP dan alamat bidadari wkwk ",
  socialDmLink: "" // contoh: "https://ig.me/m/username" — kosongkan untuk sembunyikan tombol
};
