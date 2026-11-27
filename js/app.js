/* Limah Birthday Playlist app — vanilla JS, no build step. */
"use strict";

const $ = (s) => document.querySelector(s);
const fmt = (sec) => {
  sec = Math.max(0, Math.floor(sec || 0));
  return Math.floor(sec / 60) + ":" + String(sec % 60).padStart(2, "0");
};
const toSec = (str) => {
  const m = /^(\d+):(\d{1,2})$/.exec(String(str || "").trim());
  return m ? (+m[1]) * 60 + (+m[2]) : 180;
};
const ytEmbed = (url) => {
  const m = String(url || "").match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/);
  return m ? "https://www.youtube-nocookie.com/embed/" + m[1] : url;
};

/* ---------- Render konten dari CONFIG ---------- */
const T = (key, fb) => (CONFIG[key] !== undefined && CONFIG[key] !== "" ? CONFIG[key] : fb);
const setText = (sel, val) => { const el = $(sel); if (el && val !== undefined) el.textContent = val; };
setText("#lockEyebrow", T("lockEyebrow", "Special Birthday Edition"));
setText("#lockTitle", T("lockTitle", "Playlist ini dikunci 🔒"));
setText("#lockPrompt", T("lockPrompt", "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)"));
setText("#lockButton", T("lockButton", "Buka"));
setText("#gateTitle", T("gateTitle", "HBD LIMAH"));
setText("#gateHintText", T("gateHint", "ketuk ini"));
setText("#audioHint", T("audioHint", "🔊 nyalakan suaranya ya~"));
setText("#topbarTitle", T("topbarTitle", "Limah Birthday Playlist"));
setText("#playlistEyebrow", T("playlistEyebrow", "Playlist • Limah Birthday Playlist"));
$("#bdaySub").textContent = T("bdayPrefix", "Happy Birthday ") + CONFIG.birthdayName;
if (CONFIG.headline) $("#playlistTitle").textContent = CONFIG.headline;
if (CONFIG.galleryNewTitle) $("#galeriNewTitle").textContent = CONFIG.galleryNewTitle;
if (CONFIG.galleryOldTitle) $("#galeriOldTitle").textContent = CONFIG.galleryOldTitle;
setText("#stageLoaderText", T("stageLoader", "tunggu ya..."));
setText("#stageOldTitle", T("stageOldTitle", "Foto Lama"));
setText("#stageNewTitle", T("stageNewTitle", "Foto Baru"));
setText("#stageOldBtn", T("stageOldBtn", "Lihat semua foto lama"));
setText("#stageNewBtn", T("stageNewBtn", "Lihat semua foto"));
setText("#songsTitle", T("songsTitle", "Songs You Might Like"));
setText("#songsHint", T("songsHint", "Preview 30 detik • ketuk ikon Spotify untuk dengar full"));
setText("#letterTitle", T("letterTitle", "CATATAN AJA"));
setText("#letterEyebrow", T("letterEyebrow", "A little note, sung softly"));
setText("#giftTitle", T("giftTitle", "Hadiah Misteri"));
setText("#giftCardTitle", T("giftCardTitle", "Hadiah Misteri Ulang Tahun 🎁"));
setText("#giftDesc", T("giftDesc", "Ada satu kejutan kecil spesial buat kamu hari ini."));
setText("#giftBtn", T("giftBtn", "Buka Hadiah Misteri"));
setText("#dmBtn", T("giftDm", "Balas via DM aja deh 💬"));
setText("#footText", T("footText", "Made with ♥ • Limah Birthday Playlist"));
setText("#introSkip", T("introSkip", "lewati ›"));
$("#heroCover").src = CONFIG.heroPhoto;
$("#letterText").textContent = CONFIG.letterText;
$("#prankText").textContent = CONFIG.giftPrankText;
if (CONFIG.socialDmLink) {
  const dm = $("#dmBtn");
  dm.href = CONFIG.socialDmLink;
  dm.hidden = false;
}

/* ---------- Galeri + lightbox ---------- */
let lbList = [], lbIdx = 0, lbShowH = false, lbFxAt = 0, lbOpenedAt = 0;
function renderRail(el, photos) {
  el.innerHTML = "";
  photos.forEach((p, i) => {
    const src = typeof p === "string" ? p : p.src;
    const img = document.createElement("img");
    img.src = src; img.alt = "Foto"; img.loading = "lazy"; img.draggable = false;
    img.addEventListener("error", () => img.remove()); // file hilang: jangan tampilkan rusak
    // Tap via pointer (lebih andal dari click sintetis di HP); geser = scroll rail.
    let down = null;
    img.addEventListener("pointerdown", (e) => {
      down = { x: e.clientX, y: e.clientY, id: e.pointerId };
    });
    img.addEventListener("pointerup", (e) => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      down = null;
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) openLB(photos, i);
    });
    img.addEventListener("pointercancel", () => { down = null; });
    el.appendChild(img);
  });
}
/* Daftar foto OTOMATIS dari folder saat develop (serve.py); fallback ke config.
 * Bentuk: [{src, h}] — h = varian "_h" atau null. _h tak pernah jadi entri sendiri. */
function toPairs(list) {
  return list.map((src) => ({ src, h: src.replace(/(\.[a-z0-9]+)$/i, "_h$1") }));
}
async function liveList(dir, fallback) {
  const fb = () => toPairs(fallback);
  try {
    if (typeof fetch !== "function") return fb();
    let ctl = null, to = null;
    try {
      if (typeof AbortController !== "undefined") {
        ctl = new AbortController();
        to = setTimeout(() => { try { ctl.abort(); } catch (_) {} }, 2000);
      }
      const r = await fetch("api/folder-photos?dir=" + dir, ctl ? { signal: ctl.signal } : {});
      if (to) clearTimeout(to);
      if (!r.ok) return fb();
      const j = await r.json();
      if (j && Array.isArray(j.photos) && j.photos.length)
        return j.photos.map((p) => ({ src: p.src, h: p.h || null }));
      return fb();
    } finally { if (to) clearTimeout(to); }
  } catch (_) { return fb(); }
}
const GALLERY = { best: toPairs(CONFIG.bestShots).slice().reverse(), old: toPairs(CONFIG.throwback) };
if (typeof window !== "undefined") window.__gallery = GALLERY;
renderRail($("#bestRow"), GALLERY.best);
renderRail($("#throwRow"), GALLERY.old);
async function refreshGalleries() {
  const b = await liveList("NEW", CONFIG.bestShots);
  const o = await liveList("OLD", CONFIG.throwback);
  GALLERY.best = b.slice().reverse(); // NEW: tampil dari nomor tertinggi
  GALLERY.old = o;
  renderRail($("#bestRow"), GALLERY.best);
  renderRail($("#throwRow"), GALLERY.old);
}
refreshGalleries();

/* --- Lightbox galeri playlist ---
 * Panah kiri/kanan + geser untuk pindah foto, ketuk foto = crossfade ke _h
 * dan ketuk lagi = kembali. Animasi meriah hanya sesaat (buka & ketuk). */
const LB_EMOJI = ["🎉", "🎂", "🎈", "✨", "🎊", "🎁"];
function preloadPhoto(src) {
  if (!src) return;
  try {
    const im = new Image();
    im.src = src;
    if (im.decode) im.decode().catch(() => {});
  } catch (_) {}
}
function setLBImage(dir) {
  const p = lbList[lbIdx] || { src: "", h: "" };
  const img = $("#lbImg"), hImg = $("#lbImgH");
  lbShowH = false;
  if (hImg) {
    hImg.classList.remove("on");
    hImg._ok = false;
    hImg._err = false;
    if (p.h) {
      hImg.onload = () => { hImg._ok = true; };
      hImg.onerror = () => { hImg._ok = false; hImg._err = true; };
      hImg.src = p.h;
      const check = () => {
        try { if (hImg.getAttribute("src") === p.h) hImg._ok = true; } catch (_) {}
      };
      if (hImg.complete && hImg.naturalWidth) check();
      try { if (hImg.decode) hImg.decode().then(check, () => {}); } catch (_) {}
    } else {
      hImg.onload = null; hImg.onerror = null;
    }
  }
  if (img) {
    img.classList.remove("base-off", "lb-in", "lb-in-next", "lb-in-prev");
    img.src = p.src;
    void img.offsetWidth;
    img.classList.add(dir === 1 ? "lb-in-next" : dir === -1 ? "lb-in-prev" : "lb-in");
  }
  const count = $("#lbCount");
  if (count) count.textContent = (lbIdx + 1) + " / " + lbList.length;
  const hint = $("#lbHint");
  if (hint) hint.textContent = p.h ? "ketuk foto untuk lihat versi lain" : "";
  preloadPhoto((lbList[lbIdx - 1] || {}).src);
  preloadPhoto((lbList[lbIdx + 1] || {}).src);
  if (p.h) preloadPhoto(p.h);
}
function toggleLB() {
  const p = lbList[lbIdx] || {};
  const hImg = $("#lbImgH"), base = $("#lbImg"), hint = $("#lbHint");
  if (!p.h || !hImg) return;
  if (!lbShowH) {
    if (!hImg._ok) {
      if (hImg._err) {
        if (hint) hint.textContent = "foto ini belum ada versi lainnya";
        return;
      }
      if (hint) hint.textContent = "versi lain masih dimuat...";
      const idx = lbIdx;
      try {
        hImg.decode().then(() => { if (idx === lbIdx && !lbShowH) toggleLB(); }).catch(() => {
          if (idx === lbIdx && hint) hint.textContent = "foto ini belum ada versi lainnya";
        });
      } catch (_) {}
      return;
    }
    lbShowH = true;
    hImg.classList.add("on");
    if (base) base.classList.add("base-off");
    if (hint) hint.textContent = "ketuk lagi untuk kembali";
    celebrateLB("tap");
  } else {
    lbShowH = false;
    hImg.classList.remove("on");
    if (base) base.classList.remove("base-off");
    if (hint) hint.textContent = "ketuk foto untuk lihat versi lain";
  }
}
/* Animasi meriah bertingkat:
 * open = sedang, tap = paling ramai (lebih lambat), nav = 5 kilau kecil.
 * Semua punya delay masuk + fade-out panjang, dibersihkan setelah animasi. */
function celebrateLB(mode, dir) {
  const box = $("#lbFx");
  if (!box) return;
  const isNav = mode === "nav";
  const now = performance.now();
  if (!isNav && now - lbFxAt < 600) return; // jangan tumpuk efek penuh
  if (!isNav) lbFxAt = now;
  const nav = isNav ? (dir < 0 ? -1 : 1) : 0;
  const n = isNav ? 5 : mode === "open" ? 16 : 10;
  for (let k = 0; k < n; k++) {
    const s = document.createElement("span");
    let x, y, dx, dy, dur, delay, dotSize, emojiSize;
    if (isNav) {
      // Hanya dari sisi panah yang ditekan, sedikit dan pelan.
      x = nav > 0 ? 90 + Math.random() * 7 : 3 + Math.random() * 7;
      y = 22 + Math.random() * 58;
      dx = (nav > 0 ? -1 : 1) * (50 + Math.random() * 55);
      dy = -30 + Math.random() * 60;
      dur = 1.8 + Math.random() * 0.5;
      delay = 0.02 + Math.random() * 0.15;
      dotSize = 4 + Math.random() * 3;
      emojiSize = 12 + Math.random() * 4;
    } else {
      const edge = k % 4; // kiri/kanan/atas/bawah
      if (edge === 0) { x = 8 + Math.random() * 84; y = -3 + Math.random() * 10; }
      else if (edge === 1) { x = 88 + Math.random() * 10; y = 12 + Math.random() * 76; }
      else if (edge === 2) { x = 8 + Math.random() * 84; y = 88 + Math.random() * 9; }
      else { x = 2 + Math.random() * 10; y = 12 + Math.random() * 76; }
      dx = Math.random() * 170 - 85;
      dy = Math.random() * 190 - 95;
      dur = (mode === "tap" ? 2.8 : 2.6) + Math.random() * 0.9;
      delay = (mode === "tap" ? 0.12 : 0.18) + Math.random() * 0.42;
      dotSize = 5 + Math.random() * 5;
      emojiSize = 14 + Math.random() * 12;
    }
    const dot = Math.random() < (isNav ? 0.55 : 0.4);
    s.className = (dot ? "dot" : "") + (isNav ? " nav" : "");
    s.textContent = dot ? "" : isNav ? "✨" : LB_EMOJI[(Math.random() * LB_EMOJI.length) | 0];
    s.style.setProperty("--x", x + "%");
    s.style.setProperty("--y", y + "%");
    s.style.setProperty("--dx", dx + "px");
    s.style.setProperty("--dy", dy + "px");
    s.style.setProperty("--r", (Math.random() * 240 - 120) + "deg");
    s.style.setProperty("--s", (dot ? dotSize : emojiSize).toFixed(1) + "px");
    s.style.setProperty("--c", ["#1ed760", "#ffe082", "#ff6b6b", "#64b5f6", "#ffffff"][(Math.random() * 5) | 0]);
    s.style.setProperty("--d", dur.toFixed(2) + "s");
    s.style.setProperty("--delay", delay.toFixed(2) + "s");
    s.addEventListener("animationend", () => {
      try { s.remove(); } catch (_) { if (s.parentNode) s.parentNode.removeChild(s); }
    });
    box.appendChild(s);
  }
}
function openLB(list, i) {
  lbList = (list || []).map((p) => (typeof p === "string" ? { src: p, h: null } : p));
  lbIdx = i || 0;
  lbOpenedAt = performance.now();
  if ($("#lightbox").hidden) $("#lightbox").hidden = false;
  setLBImage(0);
  void $("#lightbox").offsetWidth;
  celebrateLB("open");
}
function closeLB() {
  $("#lightbox").hidden = true;
  const box = $("#lbFx");
  if (box) box.innerHTML = "";
  const hImg = $("#lbImgH"), base = $("#lbImg");
  if (hImg) hImg.classList.remove("on");
  if (base) base.classList.remove("base-off");
  lbShowH = false;
}
function stepLB(d) {
  if (!lbList.length) return;
  lbIdx = (lbIdx + d + lbList.length) % lbList.length;
  setLBImage(d);
  celebrateLB("nav", d);
}
$("#lbClose").onclick = (e) => { e.stopPropagation(); closeLB(); };
$("#lbPrev").onclick = (e) => { e.stopPropagation(); stepLB(-1); };
$("#lbNext").onclick = (e) => { e.stopPropagation(); stepLB(1); };
$("#lightbox").addEventListener("click", (e) => {
  if (e.target.id !== "lightbox") return;
  // Abaikan click "bayangan" dari tap yang baru saja membuka lightbox
  // (pointerup membuka overlay; click susulan bisa mendarat di backdrop).
  if (performance.now() - lbOpenedAt < 450) return;
  closeLB();
});
/* Geser kiri/kanan = ganti foto; ketuk = versi _h. */
let lbGest = null;
$("#lbStage").addEventListener("pointerdown", (e) => {
  lbGest = { x0: e.clientX, y0: e.clientY, t: Date.now() };
});
$("#lbStage").addEventListener("pointerup", (e) => {
  if (!lbGest) return;
  const dx = e.clientX - lbGest.x0, dy = e.clientY - lbGest.y0;
  const quick = Date.now() - lbGest.t < 600;
  lbGest = null;
  if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.3) { stepLB(dx < 0 ? 1 : -1); return; }
  if (Math.abs(dx) < 14 && Math.abs(dy) < 14 && quick) toggleLB();
});
$("#lbStage").addEventListener("pointercancel", () => { lbGest = null; });
document.addEventListener("keydown", (e) => {
  const lb = $("#lightbox");
  if (!lb || lb.hidden) return;
  if (e.key === "ArrowLeft") { e.preventDefault(); stepLB(-1); }
  else if (e.key === "ArrowRight") { e.preventDefault(); stepLB(1); }
  else if (e.key === "Escape") closeLB();
});
if (typeof window !== "undefined") window.__lightbox = () => ({ i: lbIdx, n: lbList.length, h: lbShowH });

/* ---------- Surat expand ---------- */
const letterText = $("#letterText"), letterToggle = $("#letterToggle");
letterToggle.onclick = () => {
  const open = letterText.classList.toggle("collapsed");
  letterToggle.textContent = open ? T("letterMore", "Baca Selengkapnya") : T("letterLess", "Tutup");
};
letterText.classList.add("collapsed");

/* ---------- Gate FX: judul 1-baris, font + varian acak tiap buka ----------
 * Adaptasi ringan sample.html: WAAPI bawaan + 1 canvas kecil (DPR ≤1.5,
 * partikel ≤38, rAF berhenti sendiri). Semua animasi loop dimatikan
 * saat kado diklik agar tidak makan baterai. */
const gateFx = { raf: null, timers: [], parts: [], variant: 1 };
const GATE_FONTS = ["font-vibes", "font-playfair", "font-paris"];
function gateCard() { return document.querySelector(".gate-card"); }
function gateFxReset() {
  try {
    if (gateFx.raf) { cancelAnimationFrame(gateFx.raf); gateFx.raf = null; }
  } catch (_) { gateFx.raf = null; }
  gateFx.timers.forEach((t) => { try { clearTimeout(t); } catch (_) {} });
  gateFx.timers = [];
  gateFx.parts = [];
  const card = gateCard();
  if (card) {
    try {
      card.querySelectorAll(".gate-title, .gate-title *, #gateOrn, #gateSheen").forEach((el) => {
        try { el.getAnimations().forEach((a) => a.cancel()); } catch (_) {}
      });
    } catch (_) {}
    const sh = document.getElementById("gateSheen");
    if (sh) sh.style.transform = "translateX(-180%) skewX(-25deg)";
    const cv = document.getElementById("gateFx");
    if (cv) {
      try {
        const cx = cv.getContext("2d");
        cx.clearRect(0, 0, cv.width, cv.height);
      } catch (_) {}
    }
    const orn = document.getElementById("gateOrn");
    if (orn) { orn.style.transform = "scaleX(0)"; orn.style.opacity = "0"; }
  }
}
function gateFxSize() {
  const card = gateCard(), cv = document.getElementById("gateFx");
  if (!card || !cv) return null;
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = card.clientWidth, h = card.clientHeight;
  if (!w || !h) return null;
  cv.width = w * dpr; cv.height = h * dpr;
  const cx = cv.getContext("2d");
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { cv, cx, w, h };
}
function gateBuild(splitChars) {
  const wrap = document.getElementById("gateTitleWrap");
  const src = (document.getElementById("gateTitle") || {}).textContent || "HAPPY BIRTHDAY LIMAH";
  if (!wrap) return { words: [], chars: [] };
  wrap.innerHTML = "";
  const words = [], chars = [], lens = [];
  String(src).split(/\s+/).filter(Boolean).forEach((wd) => {
    const ws = document.createElement("span");
    ws.className = "gword";
    let n = 0;
    if (splitChars) {
      for (const ch of wd) {
        const cs = document.createElement("span");
        cs.className = "gchar";
        cs.textContent = ch;
        ws.appendChild(cs);
        chars.push(cs);
        n++;
      }
    } else {
      ws.textContent = wd;
    }
    wrap.appendChild(ws);
    wrap.appendChild(document.createTextNode(" "));
    words.push(ws);
    lens.push(n);
  });
  return { words, chars, lens };
}
function gateLoop() {
  const s = gateFxSize();
  if (!s) { gateFx.raf = null; return; }
  const { cx, w, h } = s;
  cx.clearRect(0, 0, w, h);
  for (let i = gateFx.parts.length - 1; i >= 0; i--) {
    const p = gateFx.parts[i];
    p.x += p.vx; p.y += p.vy;
    if (p.mode === "burst") {
      p.vy += 0.05; p.vx *= 0.98; p.alpha -= p.decay;
      if (p.alpha <= 0) { gateFx.parts.splice(i, 1); continue; }
    } else if (p.y < -5) {
      p.y = h + 5; p.x = Math.random() * w;
    }
    cx.globalAlpha = Math.max(0, p.alpha);
    cx.fillStyle = p.color;
    cx.beginPath();
    cx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    cx.fill();
  }
  cx.globalAlpha = 1;
  gateFx.raf = gateFx.parts.length ? requestAnimationFrame(gateLoop) : null;
}
function gateKick() { if (!gateFx.raf) gateFx.raf = requestAnimationFrame(gateLoop); }
function gateBurst(count) {
  const s = gateFxSize();
  if (!s) return;
  const cols = ["#fff0f3", "#ffb3c6", "#ff8fab", "#f3c65f"];
  for (let i = 0; i < (count || 36); i++) {
    const a = (Math.PI * 2 * i) / (count || 36) + Math.random() * 0.35;
    const sp = 1.4 + Math.random() * 4.0;
    gateFx.parts.push({ x: s.w / 2, y: s.h / 2 - 15, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, size: 1.5 + Math.random() * 2.4, alpha: 1, decay: 0.014 + Math.random() * 0.012, color: cols[i % cols.length], mode: "burst" });
  }
  gateKick();
}
function gatePetals(count) {
  const s = gateFxSize();
  if (!s) return;
  const cols = ["#ffc2d4", "#ffb3c6", "#fff0f3", "#f3c65f"];
  for (let i = 0; i < (count || 22); i++) {
    gateFx.parts.push({ x: Math.random() * s.w, y: Math.random() * s.h, vx: (Math.random() - 0.5) * 0.45, vy: -0.25 - Math.random() * 0.45, size: 1.4 + Math.random() * 2.4, alpha: 0.25 + Math.random() * 0.55, color: cols[i % cols.length], mode: "ambient" });
  }
  gateKick();
}
function gateSpark(x, y) {
  const cols = ["#fff5f8", "#ffc2d4", "#f3c65f"];
  for (let i = 0; i < 2; i++) {
    gateFx.parts.push({ x: x + (Math.random() - 0.5) * 8, y: y + (Math.random() - 0.5) * 14, vx: (Math.random() - 0.5) * 0.8, vy: 0.3 + Math.random() * 0.8, size: 1.2 + Math.random() * 2, alpha: 0.95, decay: 0.025, color: cols[(Math.random() * cols.length) | 0], mode: "burst" });
  }
  gateKick();
}
function gateSheen(delay) {
  const sh = document.getElementById("gateSheen");
  if (!sh) return;
  sh.animate([{ transform: "translateX(-180%) skewX(-25deg)" }, { transform: "translateX(350%) skewX(-25deg)" }],
    { duration: 1400, delay: delay == null ? 600 : delay, easing: "cubic-bezier(0.25, 1, 0.5, 1)" });
}
function gateOrn(delay) {  const orn = document.getElementById("gateOrn");
  if (!orn) return;
  orn.animate([{ transform: "scaleX(0)", opacity: 0 }, { transform: "scaleX(1)", opacity: 1 }],
    { duration: 900, delay: delay || 500, fill: "forwards", easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
}
function gatePlay(n) {
  gateFx.variant = n;
  gateFxReset();
  const wrap = document.getElementById("gateTitleWrap");
  if (!wrap) return;
  const { words, chars, lens } = gateBuild(n === 2);
  const later = (fn, ms) => { gateFx.timers.push(setTimeout(fn, ms)); };
  if (n === 1) { // Velvet Reveal
    words.forEach((w, i) => {
      w.classList.add("gate-rosegold");
      w.style.opacity = "0";
      w.animate([{ opacity: 0, clipPath: "inset(0 100% 0 0)", transform: "translateY(10px) scale(0.95)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)", transform: "translateY(0px) scale(1)" }],
        { duration: 1000, delay: i * 300, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    });
    gateOrn(500);
    gateSheen(900);
  } else if (n === 2) { // 3D Silk Ribbon — kata pertama putih, sisanya pink (seperti sample)
    const firstLen = (lens && lens[0]) || 0;
    chars.forEach((c, i) => {
      c.style.color = i < firstLen ? "#fff0f5" : "#ffb3c6";
      c.style.opacity = "0";
      const enter = c.animate([{ opacity: 0, transform: "translate3d(0, 20px, 60px) rotateY(55deg) scale(0.85)" }, { opacity: 1, transform: "translate3d(0, 0, 0) rotateY(0deg) scale(1)" }],
        { duration: 800, delay: i * 55, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      enter.onfinish = () => {
        c.animate([{ transform: "translateY(0px)" }, { transform: "translateY(-4px)" }, { transform: "translateY(0px)" }],
          { duration: 2600, delay: i * 80, iterations: Infinity, easing: "ease-in-out" });
      };
    });
  } else if (n === 3) { // Rose Gold Gala
    if (words[0]) {
      words[0].classList.add("gate-pearl");
      words[0].style.opacity = "0";
      words[0].animate([{ opacity: 0, transform: "scale(1.4) translateY(-8px)" }, { opacity: 1, transform: "scale(1) translateY(0px)" }],
        { duration: 600, fill: "forwards", easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
    }
    later(() => { gateBurst(34); gateSheen(150); }, 320);
    if (words[1]) {
      words[1].classList.add("gate-rosegold");
      words[1].style.opacity = "0";
      words[1].animate([{ opacity: 0, transform: "scale(0.7) translateY(14px)" }, { opacity: 1, transform: "scale(1) translateY(0px)" }],
        { duration: 800, delay: 380, fill: "forwards", easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
    }
    words.slice(2).forEach((w, i) => {
      w.classList.add("gate-rosegold");
      w.style.opacity = "0";
      w.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "translateY(0px)" }],
        { duration: 700, delay: 550 + i * 150, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
    });
  } else if (n === 4) { // Magic Calligraphy
    const card = gateCard();
    words.forEach((w, wi) => {
      w.classList.add("gate-rosegold");
      w.style.clipPath = "inset(0 100% 0 0)";
      const dur = 1000, delay = wi * 850;
      w.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }],
        { duration: dur, delay, fill: "forwards", easing: "linear" });
      later(() => {
        if (!card) return;
        const cr = card.getBoundingClientRect(), wr = w.getBoundingClientRect();
        const x0 = wr.left - cr.left + 8, x1 = wr.right - cr.left - 8;
        const cy = wr.top - cr.top + wr.height / 2;
        const t0 = performance.now();
        const track = (now) => {
          if (gateFx.variant !== 4) return;
          const pr = Math.min((now - t0) / dur, 1);
          gateSpark(x0 + (x1 - x0) * pr, cy + Math.sin(pr * Math.PI * 4) * 8);
          if (pr < 1) requestAnimationFrame(track);
        };
        requestAnimationFrame(track);
      }, delay);
    });
    gateOrn(1700);
  } else { // Floating Petals
    gatePetals(22);
    words.forEach((w, i) => {
      w.classList.add("gate-rosegold");
      w.style.opacity = "0";
      const a = w.animate([{ opacity: 0, transform: "translateY(20px) scale(0.92)" }, { opacity: 1, transform: "translateY(0px) scale(1)" }],
        { duration: 1100, delay: i * 220, fill: "forwards", easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
      a.onfinish = () => {
        w.animate([{ transform: "translateY(0px) rotate(-0.8deg)" }, { transform: "translateY(-7px) rotate(0.8deg)" }, { transform: "translateY(0px) rotate(-0.8deg)" }],
          { duration: 3400, delay: i * 350, iterations: Infinity, easing: "ease-in-out" });
      };
    });
    gateSheen(1000);
  }
}
function gateStart() {
  const wrap = document.getElementById("gateTitleWrap");
  if (!wrap) return;
  wrap.classList.remove("font-vibes", "font-playfair", "font-paris");
  wrap.classList.add(GATE_FONTS[(Math.random() * GATE_FONTS.length) | 0]);
  const play = () => gatePlay(1 + ((Math.random() * 5) | 0));
  try {
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(play);
    else play();
  } catch (_) { play(); }
}
function gateStop() { gateFxReset(); }

/* ---------- Lock screen / Gate (anti-kedip: keduanya hidden di HTML) ---------- */
const lock = $("#lock"), app = $("#app");
try { $("#buildTag").textContent = (document.lastModified || "").slice(0, 16); } catch (_) {}
if (CONFIG.lockEnabled === false) {
  // Kunci dinonaktifkan via config: tampilkan overlay kado sebagai gestur pembuka.
  // Klik kado = gestur user -> audio boleh play, lalu sambutan jalan. Fitur lock tetap ada.
  // Lock tetap hidden (tidak kedip sama sekali).
  setTimeout(() => {
    const gate = $("#gate");
    if (gate) {
      gate.hidden = false;
      try { gateStart(); } catch (_) {}
      const btn = $("#gateBtn");
      const openGate = () => {
        try { gateStop(); } catch (_) {}
        gate.style.display = "none";
        playIntro();
        try { confetti(); } catch (_) {}
      };
      if (btn) btn.addEventListener("click", openGate, { once: true });
      else openGate();
    } else {
      playIntro();
    }
  }, 0);
} else {
// Kunci aktif (bisa diaktifkan lagi dari editor): tampilkan lock, sembunyikan gate.
lock.hidden = false;
$("#lockForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const val = $("#lockInput").value.trim();
  if (val === CONFIG.password) {
    lock.classList.add("done");
    setTimeout(() => { lock.style.display = "none"; playIntro(); }, 450);
    confetti();
  } else {
    const card = lock.querySelector(".lock-card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    $("#lockHint").textContent = CONFIG.hintWrong;
  }
});
}

/* ---------- Intro sambutan (awal.html): ketik -> stage char ---------- */
const intro = $("#intro"), introText = $("#introText"), introDots = $("#introDots");
const INTRO_T = { char: 70, seg: 2000, line: 2000, ellipsis: 550, spread: 1000, fade: 1000 };
if (typeof window !== "undefined" && window.__introFast) {
  INTRO_T.char = 0; INTRO_T.seg = 0; INTRO_T.line = 40; INTRO_T.ellipsis = 0; INTRO_T.spread = 0; INTRO_T.fade = 0;
}
if (typeof window !== "undefined") window.__setIntroTempo = (o) => Object.assign(INTRO_T, o || {});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let introMusic = null, introFinished = false, introRun = null;
function ensureMusic() {
  if (!introMusic && CONFIG.introMusic) {
    try {
      introMusic = new Audio();
      introMusic.src = CONFIG.introMusic;
      introMusic.loop = true;
      introMusic.volume = 0.85;
      try { introMusic.preload = "auto"; introMusic.load(); } catch (_) {}
      if (introMusic.addEventListener) introMusic.addEventListener("error", () => { introMusic = null; });
    } catch (_) { introMusic = null; }
  }
  return introMusic;
}
/* Coba putar backsound sambutan. Browser memblokir autoplay tanpa gestur
 * (apalagi setelah lock dinonaktifkan), jadi kalau ditolak: jangan diam,
 * pasang umpan sekali-sentuh — audio menyusul di interaksi pertama user. */
function primeIntroMusic(m) {
  if (!m || !m.play) return;
  let armed = false;
  const disarm = () => {
    armed = false;
    ["pointerdown", "touchstart", "keydown", "click"].forEach((t) => {
      try { window.removeEventListener(t, onGesture); } catch (_) {}
    });
  };
  const onGesture = () => {
    disarm();
    if (introFinished) return;
    try { const pr = m.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (_) {}
  };
  const arm = () => {
    if (armed || introFinished) return;
    armed = true;
    ["pointerdown", "touchstart", "keydown", "click"].forEach((t) => {
      try { window.addEventListener(t, onGesture, { once: true, passive: true }); } catch (_) {}
    });
  };
  try { m.addEventListener("playing", disarm); } catch (_) {}
  try {
    const pr = m.play();
    if (pr && pr.catch) pr.catch(() => arm());
  } catch (_) { arm(); }
}
/* Pecah baris jadi segmen pada tiap koma/titik. Rangkaian "..", "...", ",,"
 * dihitung SATU penanda split tapi tetap ditampilkan (diketik perlahan). */
function splitSegs(text) {
  const out = [];
  let cur = "";
  const t = String(text);
  const isMark = (c) => c === "," || c === "." || c === "…" || c === "!" || c === "?";
  let i = 0;
  while (i < t.length) {
    const ch = t[i];
    if (isMark(ch)) {
      let j = i + 1;
      while (j < t.length && isMark(t[j])) j++;
      cur += t.slice(i, j);
      out.push(cur); cur = "";
      i = j;
    } else {
      cur += ch; i++;
    }
  }
  if (cur) out.push(cur);
  return out.length ? out : [String(text)];
}
if (typeof window !== "undefined") window.__splitSegs = splitSegs;
function dotsOn(i) {
  const ds = (introDots && introDots.children) || [];
  for (let k = 0; k < ds.length; k++) if (ds[k].classList) ds[k].classList.toggle("on", k === i);
}
async function waitBreak(ms, run) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (!run || run.dead || run.skip) return true;
    await sleep(50);
  }
  return false;
}
function playIntro() {
  const lines = CONFIG.introLines || [];
  introFinished = false;
  if (!lines.length) { finishIntro(); return; }
  intro.hidden = false;
  const claps = $("#claps");
  claps.innerHTML = "";
  [[8, 12], [80, 8], [15, 38], [86, 34], [6, 62], [90, 60], [20, 82], [76, 80]].forEach(([l, t], i) => {
    const s = document.createElement("span");
    s.textContent = "👏";
    s.style.left = l + "%"; s.style.top = t + "%";
    s.style.animationDelay = (i * 0.3) + "s";
    claps.appendChild(s);
  });
  introDots.innerHTML = lines.map(() => "<i></i>").join("");
  primeIntroMusic(ensureMusic());
  introRun = { dead: false, skip: false, idx: 0 };
  if (typeof window !== "undefined") window.__introRun = introRun;
  playLine(lines, 0, introRun);
}
async function playOpener(line, run) {
  // Koreografi baris pembuka: ketik kiri -> fade kanan (di bawah tengah)
  // -> spread (kiri naik, kanan turun) -> ketik tengah.
  // Kembali true bila ada tap (skip) agar pemanggil bisa menunggu sisa durasi penuh.
  const t0 = Date.now();
  introText.innerHTML = "";
  const segs = splitSegs(String(line.t || ""));
  const p = [(segs[0] || "").trim(), (segs[1] || "").trim(), segs.slice(2).join(" ").trim()];
  const est = (p[0].length + p[2].length) * INTRO_T.char + INTRO_T.seg * 2 + INTRO_T.spread;
  const wrap = document.createElement("div");
  wrap.className = "iline opener3";
  const mk = (cls) => { const d = document.createElement("div"); d.className = cls; wrap.appendChild(d); return d; };
  const o1 = mk("op3a"), o3 = mk("op3c"), o2 = mk("op3b");
  introText.appendChild(wrap);
  const finishAll = () => {
    o1.textContent = p[0]; o2.textContent = p[1]; o2.classList.add("show"); o3.textContent = p[2];
    wrap.classList.add("spread");
  };
  const typeInto = async (el, text) => {
    for (const ch of text) {
      if (!run || run.dead || run.skip) break;
      el.textContent += ch;
      await sleep(INTRO_T.char);
    }
  };
  let usedSkip = false;
  const markSkip = () => { if (run.skip) { usedSkip = true; return true; } return false; };
  if (!markSkip()) await typeInto(o1, p[0]);            // efek 1: ketik rata kiri
  if (run.skip) usedSkip = true;
  if (!run || run.dead) return false;
  if (!usedSkip && await waitBreak(INTRO_T.seg, run)) usedSkip = true;
  if (!usedSkip) {                                       // efek 2: fade rata kanan
    o2.textContent = p[1];
    o2.classList.add("show");
    if (await waitBreak(INTRO_T.seg, run)) usedSkip = true;
  }
  if (!usedSkip) {                                       // efek 3: spread 1 dtk
    wrap.classList.add("spread");
    if (await waitBreak(INTRO_T.spread, run)) usedSkip = true;
  }
  if (!usedSkip) await typeInto(o3, p[2]);               // efek 4: ketik di tengah
  if (run.skip) usedSkip = true;
  if (!run || run.dead) return false;
  if (!run || run.dead) return false;
  finishAll();
  if (usedSkip) {
    // Tap = hasil akhir instan, TAPI tetap tunggu sisa durasi penuh agar sempat dibaca.
    run.skip = false;
    const remain = est - (Date.now() - t0);
    if (remain > 0) await waitBreak(remain, run);
    run.skip = false;
  }
  return usedSkip;
}
async function playLine(lines, idx, run) {
  if (!run || run.dead || idx >= lines.length) { if (run && !run.dead) finishIntro(); return; }
  const t0line = Date.now();
  run.idx = idx;
  dotsOn(idx);
  introText.innerHTML = "";
  const line = lines[idx];
  const full = String(line.t || "");
  const div = document.createElement("div");
  div.className = "iline " + (line.s || "a") + " enter-" + (["rise", "fade", "slide"][idx % 3]);
  introText.appendChild(div);
  const instant = run.skip;
  run.skip = false;
  if (idx === 0 && (line.s || "a") === "opener" && !instant) {
    const opSkip = await playOpener(line, run);
    run.skip = false;
    if (run.dead) return;
    if (!opSkip) {
      // Normal: jeda 2 detik lalu baris berikut (transisi 1 detik via CSS).
      const tapped = await waitBreak(INTRO_T.line, run);
      run.skip = false;
      if (tapped) await sleep(300);
    }
    playLine(lines, idx + 1, run);
    return;
  } else if (instant) {
    div.textContent = full;
  } else {
    // Semua segmen diketik perlahan; jeda lebih lama setelah titik.
    const segs = splitSegs(full);
    for (let i = 0; i < segs.length; i++) {
      const sg = segs[i];
      if (run.dead) return;
      if (run.skip) break;
      div.classList.remove("swap");
      const sp = document.createElement("span");
      sp.className = "seg-caret";
      div.appendChild(sp);
      for (const ch of sg) {
        if (run.dead || run.skip) break;
        sp.textContent += ch;
        await sleep(INTRO_T.char);
      }
      if (sp.classList) sp.classList.remove("seg-caret");
      if (run.dead) return;
      const dotEnd = /[.…!?]+$/.test(sg);
      if (await waitBreak(INTRO_T.seg + (dotEnd ? INTRO_T.ellipsis : 0), run)) break;
      div.classList.add("swap");
      await sleep(run.skip ? 0 : INTRO_T.fade);
      div.innerHTML = "";
      div.classList.remove("swap");
    }
    if (run.skip && !run.dead) div.textContent = full;
  }
  // Tap = hasil penuh + tunggu SISA durasi penuh grup ini agar sempat dibaca.
  const lineSkip = run.skip;
  run.skip = false;
  if (lineSkip) {
    const nSeg = splitSegs(full).length;
    const est = full.length * INTRO_T.char + nSeg * (INTRO_T.seg + INTRO_T.fade);
    const remain = est - (Date.now() - t0line);
    if (remain > 0) await waitBreak(remain, run);
    run.skip = false;
  } else {
    const tapped = await waitBreak(INTRO_T.line, run);
    run.skip = false;
    if (tapped) await sleep(300);
  }
  if (run.dead) return;
  playLine(lines, idx + 1, run);
}
function replayIntro() {
  hideArrows();
  hideStageLoaderNow();
  clearTimeout(holdStage2);
  markTried("down");
  stopToasts(true);
  stopChar(); stopSide();
  const st = stage.style;
  st.transition = ""; st.transform = ""; st.opacity = "";
  stage.hidden = true;
  introFinished = false;
  playIntro();
}
function finishIntro() {
  if (introFinished) return;
  introFinished = true;
  if (introRun) introRun.dead = true;
  if (introMusic) {
    try {
      const m = introMusic; introMusic = null;
      const v = setInterval(() => {
        m.volume = Math.max(0, (m.volume || 0) - 0.25);
        if (m.volume <= 0) { clearInterval(v); try { m.pause(); } catch (_) {} }
      }, 110);
    } catch (_) { introMusic = null; }
  }
  intro.hidden = true;
  enterStage();
}
function enterStage() {
  // Bersihkan sisa gestur/animasi (kasus Panggung -> Sambutan -> Panggung):
  // tanpa ini translateY sisa drag + pose "berpikir" ikut terbawa.
  const st = stage.style;
  st.transition = ""; st.transform = ""; st.opacity = "";
  sIdx = 0;
  renderPager(0, false);
  setPose("idle", false);
  hideArrows();
  clearTimeout(holdStage2);
  stage.hidden = false;
  if (!stageAssets.done) {
    showStageLoader();
    waitStageAssets().then(() => {
      if (stage.hidden) return;
      settlePaint().then(() => {
        if (stage.hidden) return;
        hideStageLoader();
        schedulePageToast();
      });
    });
  } else {
    schedulePageToast();
  }
  playChar();
  placeBubble();
  lastAct = performance.now();
  sayBubble("ini apa ya?");
}
let introGest = null;
intro.addEventListener("pointerdown", (e) => {
  introGest = { x0: e.clientX, y0: e.clientY, id: e.pointerId };
});
intro.addEventListener("pointermove", (e) => {
  if (!introGest || e.pointerId !== introGest.id) return;
  const dy = e.clientY - introGest.y0, dx = e.clientX - introGest.x0;
  if ((dy > 70 || (dy > 30 && Math.abs(dy) > Math.abs(dx) * 1.5)) && !introFinished) {
    introGest = null;
    finishIntro(); // usap bawah = langsung ke char
  }
});
intro.addEventListener("pointerup", (e) => {
  if (!introGest || e.pointerId !== introGest.id) return;
  const dx = e.clientX - introGest.x0, dy = e.clientY - introGest.y0;
  introGest = null;
  if (Math.abs(dx) < 12 && Math.abs(dy) < 12 && introRun && !introRun.dead) introRun.skip = true; // tap = lanjut
});
intro.addEventListener("pointercancel", () => { introGest = null; });
$("#introSkip").addEventListener("click", (e) => { e.stopPropagation(); finishIntro(); });
const stage = $("#stage"), pager = $("#pager");
const ST = CONFIG.stage || {};
/* Tiga lapis pose yang selalu ter-render: ganti pose = tukar opacity, instan.
 * Flip di wrapper char saja (BG panel statis), TANPA transition. */
const layers = { idle: $("#charIdle"), think: $("#charThink"), point: $("#charPoint") };
const flipWrap = $("#flipWrap");
function setPose(name, flip) {
  for (const k of Object.keys(layers)) {
    const el = layers[k];
    if (ST[k] && el.getAttribute("src") !== ST[k]) el.src = ST[k];
    el.classList.toggle("on", k === name);
  }
  flipWrap.classList.toggle("flip", !!flip);
}
if (ST.bg) {
  const bgU = /^(https?:|data:|\/)/.test(ST.bg) ? ST.bg : "/" + ST.bg;
  stage.style.setProperty("--stbg", "url('" + bgU + "')");
  // Pra-muat sejak awal (stage display:none tidak memicu unduh CSS) agar
  // BG sudah siap saat user skip Sambutan.
  try { const pre = new Image(); pre.src = bgU; pre.decode && pre.decode().catch(() => {}); } catch (_) {}
}
setPose("idle", false);
Object.values(layers).forEach((el) => {
  try { const d = el.decode && el.decode(); if (d && d.catch) d.catch(() => {}); } catch (_) {}
});
/* ---------- Preload aset panggung + loader ala Spotify ----------
 * Stage display:none tidak memicu unduh, jadi BG/pose dimuat sejak boot.
 * Jika user skip Sambutan sebelum selesai, loader menutup panggung sampai
 * BG + ketiga pose benar-benar siap (tanpa halaman setengah kosong). */
const stageLoaderEl = $("#stageLoader");
const stageAssets = { started: false, done: false, promise: null };
let stageLoaderToken = 0;
function stageAssetUrl(u) { return /^(https?:|data:|\/)/.test(u) ? u : "/" + u; }
function startStagePreload() {
  if (stageAssets.started) return stageAssets.promise;
  stageAssets.started = true;
  const urls = [ST.bg, ST.idle, ST.think, ST.point].filter(Boolean).map(stageAssetUrl);
  const isBrowser = typeof window !== "undefined" && !!window.document;
  if (!isBrowser || typeof Image === "undefined") { // test node / tanpa DOM
    stageAssets.done = true;
    stageAssets.promise = Promise.resolve();
    return stageAssets.promise;
  }
  stageAssets.promise = Promise.all(urls.map((u) => new Promise((res) => {
    const im = new Image();
    let fin = false;
    const done = () => { if (!fin) { fin = true; res(); } };
    im.onload = () => {
      try {
        const d = im.decode && im.decode();
        if (d && d.then) d.then(done, done); else done();
      } catch (_) { done(); }
    };
    im.onerror = done;
    im.src = u;
    if (im.complete && im.naturalWidth) done();
  })));
  stageAssets.promise.then(() => { stageAssets.done = true; });
  return stageAssets.promise;
}
function waitStageAssets() {
  // Jaring aman: jangan biarkan loader menggantung bila jaringan bermasalah.
  const timeout = new Promise((res) => setTimeout(res, 9000));
  return Promise.race([startStagePreload(), timeout]);
}
function showStageLoader() {
  if (!stageLoaderEl) return;
  stageLoaderToken++;
  stageLoaderEl.hidden = false;
  stageLoaderEl.classList.remove("out");
  stageLoaderEl._t0 = performance.now();
}
function hideStageLoader() {
  if (!stageLoaderEl || stageLoaderEl.hidden) return;
  const token = ++stageLoaderToken;
  const wait = Math.max(0, 520 - (performance.now() - (stageLoaderEl._t0 || 0)));
  setTimeout(() => {
    if (token !== stageLoaderToken || stageLoaderEl.hidden) return;
    stageLoaderEl.classList.add("out");
    setTimeout(() => {
      if (token !== stageLoaderToken) return;
      stageLoaderEl.hidden = true;
      stageLoaderEl.classList.remove("out");
    }, 380);
  }, wait);
}
function hideStageLoaderNow() {
  if (!stageLoaderEl) return;
  stageLoaderToken++;
  stageLoaderEl.hidden = true;
  stageLoaderEl.classList.remove("out");
}
/* Tunggu 2 frame render agar BG/pose benar-benar sudah ter-paint di GPU
 * sebelum loader mulai fade — mencegah background terlihat setengah jadi. */
function settlePaint() {
  return new Promise((res) => {
    try {
      requestAnimationFrame(() => requestAnimationFrame(res));
    } catch (_) { setTimeout(res, 50); }
  });
}
startStagePreload();

let sIdx = 0; // -1 panel kiri, 0 karakter, 1 panel kanan
let gest = null;
const stageW = () => stage.clientWidth || 1;
function renderPager(dx, animate) {
  pager.classList.toggle("anim", !!animate);
  const w = stageW();
  // Basis dalam % dari lebar pager (300%) supaya benar walau stage sedang hidden (lebar 0).
  const base = -(sIdx + 1) * 100 / 3;
  const extra = dx && w > 1 ? dx / w * 100 / 3 : 0;
  pager.style.transform = "translateX(" + (base + extra) + "%)";
}
renderPager(0, false);

function enterMenu(fromY, target, fromPop) {
  target = target || "top";
  markTried("up");
  stopToasts(true);
  hideArrows();
  stopSide(); stopChar();
  const st = stage.style;
  st.transition = "none";
  st.transform = "translateY(" + (fromY || 0) + "px)";
  st.opacity = "1";
  void stage.offsetWidth;
  st.transition = "transform .38s cubic-bezier(.2,.8,.2,1), opacity .38s";
  st.transform = "translateY(100%)";
  st.opacity = "0";
  setTimeout(() => {
    stage.hidden = true;
    st.transition = ""; st.transform = ""; st.opacity = "";
    app.hidden = false; $("#topbar").hidden = false;
    if (target === "merch") {
      const m = document.getElementById("merchCard");
      if (m && m.scrollIntoView) m.scrollIntoView();
    } else if (target === "songs") {
      const s = document.getElementById("songsCard");
      if (s && s.scrollIntoView) s.scrollIntoView();
    } else if (typeof window !== "undefined" && window.scrollTo) {
      window.scrollTo(0, 0);
    }
  }, 390);
  gest = null;
  // Tombol back HP/browser = kembali ke halaman sebelumnya, bukan keluar situs.
  if (!fromPop) {
    try { history.pushState({ page: "menu" }, ""); menuInHistory = true; } catch (_) {}
  } else {
    menuInHistory = true;
  }
}
let menuInHistory = false;
function goBack() {
  if (menuInHistory) {
    menuInHistory = false;
    try { history.back(); return; } catch (_) {}
  }
  backToStage();
}
if (typeof window !== "undefined" && window.addEventListener)
  window.addEventListener("popstate", (e) => {
    menuInHistory = false;
    if (e && e.state && e.state.page === "menu") { enterMenu(0, "top", true); return; }
    backToStage();
  });
if (typeof window !== "undefined") window.__goBack = goBack;
function backToStage() {
  closeLB();
  app.hidden = true; $("#topbar").hidden = true;
  pause(); stopSide(); playChar();
  sIdx = 0; renderPager(0, false); setPose("idle", false);
  hideArrows();
  placeBubble();
  lastAct = performance.now();
  sayBubble(visitedSide ? "kalau ke atas atau bawah ada apa ya??" : "ini apa ya?");
  const st = stage.style;
  stage.hidden = false;
  let loaderPending = false;
  if (stageAssets.done) {
    hideStageLoaderNow();
  } else {
    loaderPending = true;
    showStageLoader();
    waitStageAssets().then(() => {
      if (stage.hidden) return;
      settlePaint().then(() => {
        if (stage.hidden) return;
        hideStageLoader();
        schedulePageToast();
      });
    });
  }
  st.transition = "none"; st.transform = "translateY(40px)"; st.opacity = "0";
  void stage.offsetWidth;
  st.transition = "transform .35s cubic-bezier(.2,.8,.2,1), opacity .35s";
  st.transform = "translateY(0)"; st.opacity = "1";
  setTimeout(() => { st.transition = ""; st.transform = ""; st.opacity = ""; }, 360);
  if (!loaderPending) schedulePageToast(360);
}
$("#stageBack").addEventListener("click", goBack);

/* ---------- Cache gambar (production) ----------
 * Service worker aktif di public GitHub Pages, atau opt-in lokal dengan ?sw=1.
 * Di localhost biasa SW lama dibersihkan agar foto yang diganti langsung
 * terlihat saat develop. */
(function initPhotoCache() {
  try {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    const host = location.hostname || "";
    // Public site aktif; dev site (limah28-dev.github.io) tidak, agar foto
    // yang baru di-deploy tidak tertahan cache lama.
    const prod = /\.github\.io$/i.test(host) && !/^limah28-dev\./i.test(host);
    const optIn = /[?&]sw=1(?:&|$)/.test(location.search || "");
    if (prod || optIn) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
      return;
    }
    if (location.protocol !== "http:" && location.protocol !== "https:") return;
    if (navigator.serviceWorker.getRegistrations) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => { try { r.unregister(); } catch (_) {} });
      }).catch(() => {});
    }
    if (typeof caches !== "undefined" && caches.keys) {
      caches.keys().then((keys) => {
        keys.filter((k) => k.indexOf("limah-photos-") === 0)
          .forEach((k) => { try { caches.delete(k); } catch (_) {} });
      }).catch(() => {});
    }
  } catch (_) {}
})();

/* Aliran foto vertikal santai ala referensi, gaya Spotify:
 * bingkai + sudut + node timeline, counter, kecepatan, highlight tengah. */
const STEP_H = 320;
const SPEEDS = [
  { label: "0.6x", px: 14 },
  { label: "1x", px: 24 },
  { label: "1.8x", px: 46 },
];
const pad2 = (n) => String(n).padStart(2, "0");
/* Nomor tampil dari nama file (20.jpg -> 20), agar urutan balik tetap benar. */
const photoNum = (src) => {
  const m = /(\d+)\.[a-z0-9]+$/i.exec(String(src || ""));
  return m ? parseInt(m[1], 10) : 0;
};
const streams = [];
let lastMove = { dx: 0, dy: 0 };
/* Backsound tiap sisi panggung: NEW vs OLD, crossfade halus. */
const sideAudio = { old: null, new: null, current: null };
function sideEl(which) {
  if (!sideAudio[which]) {
    const m = CONFIG.stageMusic && CONFIG.stageMusic[which];
    if (!m || !m.src) return null;
    try {
      const a = new Audio();
      a.src = m.src; a.loop = true; a.volume = 0;
      if ("preload" in a) a.preload = "none";
      sideAudio[which] = a;
    } catch (_) { return null; }
  }
  return sideAudio[which];
}
function fadeAudio(a, to, ms) {
  if (!a) return;
  const steps = 10, dt = Math.max((ms || 800) / steps, 30);
  const from = a.volume || 0;
  let i = 0;
  if (a._fade) clearInterval(a._fade);
  a._fade = setInterval(() => {
    i++;
    a.volume = Math.max(0, Math.min(0.85, from + (to - from) * (i / steps)));
    if (i >= steps) {
      if (a._fade) clearInterval(a._fade);
      a._fade = null;
      if (to === 0) { try { a.pause(); } catch (_) {} }
    }
  }, dt);
}
/* Musik halaman char: tiap putaran berakhir -> jeda 10 detik -> main lagi.
 * Berhenti saat masuk galeri/menu/intro. */
let charAudio = null;
function ensureChar() {
  if (!charAudio) {
    const m = CONFIG.charMusic;
    if (!m || !m.src) return null;
    try {
      charAudio = new Audio();
      charAudio.src = m.src; charAudio.loop = false; charAudio.volume = 0;
      charAudio._want = false;
      if (charAudio.addEventListener) {
        charAudio.addEventListener("error", () => { charAudio = null; });
        charAudio.addEventListener("ended", () => {
          if (charAudio) clearTimeout(charAudio._gap);
          if (charAudio) charAudio._gap = setTimeout(() => {
            const a = charAudio;
            if (a && a._want && !stage.hidden && !sideAudio.current && !introRun) playChar();
          }, 10000);
        });
      }
    } catch (_) { charAudio = null; }
  }
  return charAudio;
}
function playChar() {
  const a = ensureChar();
  if (!a) return;
  a._want = true;
  try { const pr = a.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (_) {}
  fadeAudio(a, 0.7, 1200);
}
function stopChar() {
  if (charAudio) {
    charAudio._want = false;
    clearTimeout(charAudio._gap);
    fadeAudio(charAudio, 0, 600);
  }
}
if (typeof window !== "undefined") window.__charEl = () => charAudio;

function playSide(which) {
  stopChar();
  if (sideAudio.current && sideAudio.current !== which)
    fadeAudio(sideEl(sideAudio.current), 0, 900);
  sideAudio.current = which;
  const a = sideEl(which);
  if (!a) return;
  try { const pr = a.play(); if (pr && pr.catch) pr.catch(() => {}); } catch (_) {}
  fadeAudio(a, 0.7, 1000);
}
function stopSide() {
  if (sideAudio.current) {
    fadeAudio(sideEl(sideAudio.current), 0, 600);
    sideAudio.current = null;
  }
}
if (typeof window !== "undefined") { window.__sideAudio = sideAudio; window.__playSide = playSide; }

function buildStream(key, trackId, pairs) {
  const track = document.getElementById(trackId);
  track.innerHTML = "";
  const refs = [];
  pairs.concat(pairs).forEach((pair, i) => {
    const n = i % pairs.length;
    const step = document.createElement("div");
    step.className = "tstep";
    step.innerHTML =
      `<span class="tnode"></span><span class="tnum">${pad2(photoNum(pair.src))}</span>` +
      `<div class="tframe loading"><span class="spin" aria-hidden="true"></span>` +
      `<span class="corner corner-tl"></span>` +
      `<span class="corner corner-tr"></span><span class="corner corner-bl"></span>` +
      `<span class="corner corner-br"></span><img class="base" alt="" loading="lazy" decoding="async">` +
      `<img class="alt-h" alt="" loading="lazy" decoding="async"></div>`;
    const frame = step.querySelector(".tframe");
    frame.dataset.n = n;
    const base = step.querySelector("img.base");
    const alt = step.querySelector("img.alt-h");
    base.addEventListener("error", () => step.remove()); // file hilang: jangan tampilkan rusak
    base.addEventListener("load", () => frame.classList.remove("loading"), { once: true });
    if (pair.h) {
      alt.dataset.src = pair.h;
      alt.addEventListener("error", () => { alt._failed = true; alt.remove(); });
      alt.addEventListener("load", () => { alt._ok = true; });
    } else {
      if (alt.remove) alt.remove();
    }
    base.dataset.src = pair.src; base.draggable = false;
    alt.draggable = false;
    track.appendChild(step);
    const kids = track.children || [];
    refs.push({ step, frame, base, alt: pair.h ? alt : null, n });
  });
  /* Gestur milik stream: vertikal = scrub 1:1 (apapun kecepatannya),
   * horizontal ke arah char = kembali, tap = toggle base/_h. */
  const box = track.parentElement;
  const st = {
    key, track, y: 0, speedIdx: 2, paused: false, hold: false, resumeAt: 0,
    unit: pairs.length * STEP_H, active: -1, total: pairs.length, pairs, refs,
    manualH: -1, hTimer: null,
    countEl: document.getElementById(key === "old" ? "countOld" : "countNew"),
    activeIdx: key === "old" ? -1 : 1,
  };
  if (st.countEl) st.countEl.textContent = pad2(photoNum(pairs[0].src)) + "/" + pad2(pairs.length);
  const spdBtn = box.parentElement && box.parentElement.querySelector
    ? box.parentElement.querySelector('[data-speed="' + key + '"]') : null;
  if (spdBtn) spdBtn.textContent = SPEEDS[st.speedIdx].label;
  /* Gestur milik stream: vertikal = scrub 1:1 (apapun kecepatannya),
   * geser kiri/kanan = kembali ke char, tap = toggle base/_h. */
  let sg = null;
  box.addEventListener("pointerdown", (e) => {
    sg = { x0: e.clientX, y0: e.clientY, lastY: e.clientY, t0: performance.now(),
           id: e.pointerId, moved: 0, mode: null };
    st.hold = true;
    lastAct = performance.now();
    if (box.setPointerCapture) { try { box.setPointerCapture(e.pointerId); } catch (_) {} }
  });
  box.addEventListener("pointermove", (e) => {
    if (!sg || e.pointerId !== sg.id) return;
    const dx = e.clientX - sg.x0, dy = e.clientY - sg.y0;
    sg.moved = Math.max(sg.moved, Math.abs(dx), Math.abs(dy));
    if (!sg.mode && Math.max(Math.abs(dx), Math.abs(dy)) > 12)
      sg.mode = Math.abs(dy) >= Math.abs(dx) ? "scrub" : "back";
    if (sg.mode === "scrub") {
      st.y += e.clientY - sg.lastY;
      if (st.unit > 0) { while (st.y > 0) st.y -= st.unit; while (st.y <= -st.unit) st.y += st.unit; }
      st.track.style.transform = "translateY(" + st.y + "px)";
      loadWindow(st);
    }
    sg.lastY = e.clientY;
    lastMove = { dx, dy };
  });
  const boxEnd = (e, cancelled) => {
    if (!sg || (e && e.pointerId !== sg.id)) return;
    if (!cancelled && sg.moved < 12) {
      toggleH(st); // tap foto tengah: base <-> _h
    } else if (!cancelled && sg.mode === "back" && e) {
      // Geser kiri ATAU kanan dari panel galeri = kembali ke char.
      const w = stageW();
      const dx = Math.abs((e.clientX || 0) - sg.x0);
      const dt = Math.max(performance.now() - sg.t0, 1);
      if (dx > w * 0.35 || (dx > w * 0.1 && Math.abs(dx / dt) > 0.5)) {
        sIdx = 0; renderPager(0, true); setPose("idle", false);
        stopSide(); playChar();
        sayBubble(visitedSide ? "kalau ke atas atau bawah ada apa ya??" : "ini apa ya?");
        schedulePageToast(360);
      }
    }
    st.hold = false; st.resumeAt = performance.now() + 500;
    sg = null;
  };
  box.addEventListener("pointerup", (e) => boxEnd(e, false));
  box.addEventListener("pointercancel", (e) => boxEnd(e, true));
  /* Pengaman: lepas di luar stream (jari di tepi) tetap akhiri gestur. */
  document.addEventListener("pointerup", (e) => { if (sg && e.pointerId === sg.id) boxEnd(e, false); });
  document.addEventListener("pointercancel", (e) => { if (sg && e.pointerId === sg.id) boxEnd(e, true); });
  streams.push(st);
  loadWindow(st);
  return st;
}
/* Tap: tampilkan/sembunyikan varian _h pada foto tengah (transisi 0.5 dtk via CSS). */
function toggleH(st) {
  if (!st || st.active < 0 || !st.pairs[st.active] || !st.pairs[st.active].h) return;
  if (st.hTimer) clearTimeout(st.hTimer);
  st.manualH = st.active;
  let on = false;
  for (const r of st.refs) if (r.n === st.active && r.step.classList) {
    if (!on && !r.step.classList.contains("show-h")) on = true;
  }
  for (const r of st.refs) if (r.n === st.active && r.step.classList)
    r.step.classList.toggle("show-h", on);
}
/* Timeline otomatis: 1 dtk foto asli -> crossfade 0.5 dtk ke _h. Manual menang. */
function armH(st, idx) {
  if (st.hTimer) clearTimeout(st.hTimer);
  st.manualH = -1;
  for (const r of st.refs) if (r.n === idx && r.step.classList) r.step.classList.remove("show-h");
  const p = st.pairs[idx];
  if (!p || !p.h) return;
  if (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  st.hTimer = setTimeout(() => {
    if (st.manualH !== -1) return;
    for (const r of st.refs) if (r.n === idx && r.step.classList) r.step.classList.add("show-h");
  }, 1000);
}
/* Lazy ringan: hanya bingkai dekat viewport yang diunduh; _h saat mendekat ke tengah. */
function loadWindow(st) {
  const box = st.track.parentElement;
  const h = (box && box.clientHeight) || 900;
  const mid = (h / 2 - st.y) / STEP_H;
  for (let i = 0; i < st.refs.length; i++) {
    const r = st.refs[i];
    const d = Math.min(Math.abs(i - mid), Math.abs(i - (mid + st.total)), Math.abs(i - (mid - st.total)));
    if (d > 4) continue;
    if (r.base.dataset && r.base.dataset.src && !r.base.src) {
      r.base.src = r.base.dataset.src;
      delete r.base.dataset.src;
    }
    if (d <= 2.5 && r.alt && r.alt.dataset && r.alt.dataset.src && !r.alt.src && !r.alt._failed) {
      r.alt.src = r.alt.dataset.src;
      delete r.alt.dataset.src;
    }
  }
}
refreshGalleries().then(() => {
  buildStream("old", "trackOld", GALLERY.old, GALLERY.old);
  buildStream("new", "trackNew", GALLERY.best, GALLERY.best);
});
document.querySelectorAll(".stream-toggle").forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => e.stopPropagation());
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const st = streams.find((s) => s.key === btn.dataset.stream);
    if (!st) return;
    st.paused = !st.paused;
    btn.textContent = st.paused ? "▶" : "⏸";
  });
});
document.querySelectorAll("[data-speed]").forEach((btn) => {
  btn.addEventListener("pointerdown", (e) => e.stopPropagation());
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const st = streams.find((s) => s.key === btn.dataset.speed);
    if (!st) return;
    st.speedIdx = (st.speedIdx + 1) % SPEEDS.length;
    btn.textContent = SPEEDS[st.speedIdx].label;
  });
});
if (typeof window !== "undefined") window.__streams = streams;
let lastFrame = 0;
function streamTick(t) {
  const dt = Math.min(((t || 0) - lastFrame) / 1000 || 0, 0.1);
  lastFrame = t || 0;
  const calm = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const st of streams) {
    const visible = !stage.hidden && sIdx === st.activeIdx;
    const held = st.hold || performance.now() < st.resumeAt;
    if (!st.paused && !held && !calm && visible && st.unit > 0) {
      st.y -= SPEEDS[st.speedIdx].px * dt;
      if (st.y <= -st.unit) st.y += st.unit;
      st.track.style.transform = "translateY(" + st.y + "px)";
    }
    if (visible && st.total > 0) {
      const h = (st.track.parentElement && st.track.parentElement.clientHeight) || 1;
      const idx = ((Math.floor((h / 2 - st.y) / STEP_H) % st.total) + st.total) % st.total;
      if (idx !== st.active) {
        st.active = idx;
        const steps = st.track.children || [];
        for (let i = 0; i < steps.length; i++)
          if (steps[i].classList) steps[i].classList.toggle("is-active", i % st.total === idx);
        if (st.countEl) st.countEl.textContent = pad2(photoNum(st.pairs[idx].src)) + "/" + pad2(st.total);
        loadWindow(st);
        armH(st, idx);
      }
    }
  }
  requestAnimationFrame(streamTick);
}
requestAnimationFrame(streamTick);
document.querySelectorAll("[data-goto='menu']").forEach((b) =>
  b.addEventListener("click", () => enterMenu(0)));

/* Tutorial: bubble komik + toast panduan */
const bubble = $("#charBubble"), bubbleText = $("#bubbleText"), toastEl = $("#stageToast");
/* Jarak ekor bubble ke kepala = 5% tinggi panggung (diukur dari file PNG asli:
 * kepala mulai ~23% dari atas gambar: idle .234 / think .223 / point .235).
 * Tinggi karakter mengikuti LEBAR layar, jadi posisi px dihitung saat tampil
 * (CSS bottom:67% hanya fallback bila belum terukur). */
const HEAD_TOP = { charIdle: 0.234, charThink: 0.223, charPoint: 0.235 };
function placeBubble() {
  try {
    const on = document.querySelector(".char.on");
    const H = (stage && stage.clientHeight) || 0;
    const ch = (on && on.offsetHeight) || 0;
    if (!H || !ch) return;
    const f = HEAD_TOP[(on && on.id) || ""] || 0.23;
    bubble.style.top = "auto";
    bubble.style.bottom = Math.round((1 - f) * ch + 0.05 * H + 31) + "px";
  } catch (_) {}
}
if (typeof window !== "undefined" && window.addEventListener)
  window.addEventListener("resize", () => { if (!bubble.hidden) placeBubble(); });
let toastTimer = null, toastChain = null, holdStage2 = null, lastAct = 0, visitedSide = false;
/* Durasi toast: 1 dtk setelah pindah halaman, tampil 2 dtk, jeda 4 dtk. */
const TOAST_PAGE_DELAY = 1000, TOAST_SHOW_MS = 2000, TOAST_GAP_MS = 4000;
/* Memori sementara (hilang saat reload): arah yang sudah dicoba. */
const toastMem = { held: false, left: false, right: false, up: false, down: false };
function toastAllTried() {
  return toastMem.left && toastMem.right && toastMem.up && toastMem.down;
}
function markTried(kind) {
  if (!kind) return;
  toastMem[kind] = true;
  if (kind === "left" || kind === "right") visitedSide = true;
  if (toastAllTried()) stopToasts(true);
}
function stopToasts(hide) {
  clearTimeout(toastTimer); clearTimeout(toastChain);
  if (hide && toastEl && toastEl.classList) toastEl.classList.remove("show");
}
function toastHint() {
  if (toastAllTried()) return "";
  const m = toastMem;
  if (!m.left && !m.right) return m.held ? "coba geser kiri atau kanan" : "coba hold / tekan layar...";
  if (m.left && !m.right) return "coba geser ke kanan";
  if (m.right && !m.left) return "coba geser ke kiri";
  if (!m.up && !m.down) return "coba ke atas ↑ atau ke bawah ↓";
  if (m.up && !m.down) return "coba ke bawah ↓";
  if (m.down && !m.up) return "coba ke atas ↑";
  return "";
}
function sideToastHint() {
  return toastAllTried() ? "" : "coba geser kiri atau kanan untuk kembali";
}
function currentToastHint() {
  return sIdx !== 0 ? sideToastHint() : toastHint();
}
function sayBubble(t) {
  bubbleText.textContent = t;
  bubble.hidden = false;
}
function sayToast(t) {
  if (!t || toastAllTried()) return;
  toastEl.textContent = t;
  toastEl.hidden = false;
  if (toastEl.classList) {
    toastEl.classList.remove("show");
    void toastEl.offsetWidth;
  }
  requestAnimationFrame(() => { if (toastEl.classList) toastEl.classList.add("show"); });
  clearTimeout(toastTimer); clearTimeout(toastChain);
  toastTimer = setTimeout(() => {
    if (toastEl.classList) toastEl.classList.remove("show");
    scheduleToast(TOAST_GAP_MS);
  }, TOAST_SHOW_MS);
}
function scheduleToast(delay) {
  clearTimeout(toastChain);
  toastChain = setTimeout(() => {
    if (stage.hidden || toastAllTried()) return;
    if (performance.now() - lastAct < 700) { scheduleToast(700); return; }
    const t = currentToastHint();
    if (t) sayToast(t);
  }, delay);
}
function schedulePageToast(extraDelay) {
  stopToasts(true);
  if (toastAllTried()) return;
  scheduleToast((extraDelay || 0) + TOAST_PAGE_DELAY);
}
if (typeof window !== "undefined") {
  window.__toastMem = toastMem;
  window.__toastHint = () => toastHint();
  window.__toastSideHint = () => sideToastHint();
  window.__toastState = () => ({
    ...toastMem,
    text: toastEl.textContent,
    shown: !toastEl.hidden && !!(toastEl.classList && toastEl.classList.contains("show")),
  });
}
const dirArrows = $("#dirArrows");
function showArrows(dir) {
  dirArrows.hidden = false;
  dirArrows.dataset.dir = dir || "";
}
function hideArrows() {
  dirArrows.hidden = true;
  dirArrows.dataset.dir = "";
}
/* Pengingat toast: 1 dtk setelah pindah halaman, tampil 2 dtk,
 * hilang, lalu 4 dtk kemudian muncul lagi selama user idle. */

/* gestur: tahan = berpikir, geser = menunjuk, tarik penuh = pindah panel, usap = menu */
stage.addEventListener("pointerdown", (e) => {
  if (e.target && e.target.closest && e.target.closest(".stream")) return; // stream punya gestur sendiri
  if (gest) return;
  gest = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, axis: null, t0: performance.now(), id: e.pointerId };
  lastMove = { dx: 0, dy: 0 };
  lastAct = performance.now();
  if (sIdx === 0 && e.target.closest("#panelCenter")) {
    setPose("think", false);
    sayBubble("hmm..");
    clearTimeout(holdStage2);
    holdStage2 = setTimeout(() => {
      toastMem.held = true;
      sayBubble("ada apa di sana...");
      const hint = toastHint();
      if (hint) sayToast(hint);
      showArrows("");
    }, 1200);
  }
});
stage.addEventListener("pointermove", (e) => {
  if (!gest || e.pointerId !== gest.id) return;
  gest.dx = e.clientX - gest.x0;
  gest.dy = e.clientY - gest.y0;
  gest.x = e.clientX;
  if (!gest.axis && Math.max(Math.abs(gest.dx), Math.abs(gest.dy)) > 12)
    gest.axis = Math.abs(gest.dx) > Math.abs(gest.dy) ? "x" : "y";
  if (gest.axis === "x") {
    // Pager TIDAK ikut bergeser sebelum full swipe: hanya pose yang berubah.
    if (sIdx === 0) {
      const p = gest.dx / stageW();
      if (Math.abs(p) < 0.25) setPose("think", p > 0.02);
      else setPose("point", p > 0);
      showArrows(p > 0.02 ? "right" : p < -0.02 ? "left" : "");
    }
  } else if (gest.axis === "y") {
    // Ikuti jari dua arah (natural scroll): konten menempel di jari.
    stage.style.transition = "none";
    stage.style.transform = "translateY(" + gest.dy + "px)";
  }
});
function endGest(e, cancelled) {
  if (!gest || (e && e.pointerId !== gest.id)) return;
  lastMove = { dx: gest.dx, dy: gest.dy };
  lastAct = performance.now();
  clearTimeout(holdStage2);
  hideArrows();
  const w = stageW(), dt = Math.max(performance.now() - gest.t0, 1);
  if (gest.axis === "x" && !cancelled) {
    const p = gest.dx / w, vel = gest.dx / dt;
    const atLeftEdge = gest.x !== undefined && gest.x <= w * 0.08;
    const atRightEdge = gest.x !== undefined && gest.x >= w * 0.92;
    let target = sIdx;
    if (sIdx === 0) {
      // Full swipe = jari sampai tepi layar (atau setengah layar + flick kencang).
      if (p < -0.5 || atLeftEdge || (p < -0.3 && vel < -1.2)) target = -1;
      else if (p > 0.5 || atRightEdge || (p > 0.3 && vel > 1.2)) target = 1;
    } else {
      const back = sIdx === -1 ? gest.dx : -gest.dx;
      if (back > w * 0.35 || (back > w * 0.1 && Math.abs(vel) > 0.5)) target = 0;
    }
    const prevIdx = sIdx;
    sIdx = target;
    renderPager(0, true);
    if (sIdx === 0) {
      setPose("idle", false);
      stopSide(); playChar();
      if (visitedSide) sayBubble("kalau ke atas atau bawah ada apa ya??");
    } else {
      visitedSide = true;
      pause(); // playlist berhenti, backsound sisi mengambil alih
      playSide(sIdx === -1 ? "old" : "new");
    }
    if (target !== prevIdx) {
      if (target === -1) markTried("left");
      else if (target === 1) markTried("right");
      schedulePageToast(360);
    }
  } else if (gest.axis === "y" && !cancelled) {
    const vy = gest.dy / dt;
    if (sIdx !== 0) {
      // Dari galeri (kiri/kanan): vertikal SELALU kembali ke char, tidak ke menu.
      sIdx = 0; renderPager(0, true); setPose("idle", false);
      stage.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)";
      stage.style.transform = "translateY(0)";
      schedulePageToast(350);
    }
    else if (gest.dy > 70 || (gest.dy > 30 && vy > 0.5)) replayIntro(); // jari ke bawah = Sambutan (atas tumpukan)
    else if (gest.dy < -70 || (gest.dy < -30 && vy < -0.5)) enterMenu(gest.dy, "top"); // jari ke atas = Playlist (bawah tumpukan)
    else { stage.style.transition = "transform .3s cubic-bezier(.2,.8,.2,1)"; stage.style.transform = "translateY(0)"; }
  } else if (gest.axis === null && !cancelled && sIdx === 0) {
    setPose("idle", false); // lepas tap/hold: langsung kembali default, tanpa jeda
    sayBubble(visitedSide ? "kalau ke atas atau bawah ada apa ya??" : "ini apa ya?");
  } else {
    renderPager(0, true);
    if (sIdx === 0) setPose("idle", false);
  }
  gest = null;
}
stage.addEventListener("pointerup", (e) => endGest(e, false));
stage.addEventListener("pointercancel", (e) => endGest(e, true));
/* Pengaman: pointerup di luar stage (jari lepas di tepi) tetap akhiri gestur. */
document.addEventListener("pointerup", (e) => { if (gest && e.pointerId === gest.id) endGest(e, false); });

/* ---------- Confetti ringan ---------- */
function confetti() {
  const c = $("#confetti"), ctx = c.getContext("2d");
  const phone = $("#phone"), r = phone.getBoundingClientRect();
  c.width = r.width; c.height = Math.min(r.height, window.innerHeight);
  const colors = ["#1DB954", "#1ED760", "#fff", "#2D46B9", "#e67e22"];
  const ps = Array.from({ length: 90 }, () => ({
    x: Math.random() * c.width, y: -10 - Math.random() * 60,
    w: 5 + Math.random() * 5, h: 8 + Math.random() * 6,
    vy: 2 + Math.random() * 3, vx: -1 + Math.random() * 2,
    rot: Math.random() * 6.28, vr: -.1 + Math.random() * .2,
    col: colors[(Math.random() * colors.length) | 0]
  }));
  let frames = 0;
  (function tick() {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.col; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (++frames < 160) requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, c.width, c.height);
  })();
}

/* ---------- Player ---------- */
const audio = $("#audio");
let cur = -1, playing = false, demoTimer = null, demoPos = 0, demoDur = 0, useDemo = true;

function renderTracks() {
  const ol = $("#trackList"); ol.innerHTML = "";
  CONFIG.songs.forEach((t, i) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.className = "track"; btn.dataset.i = i;
    btn.innerHTML =
      `<span class="num">${i + 1}</span>` +
      `<img alt="" loading="lazy" src="${t.cover}">` +
      `<span class="t-meta"><p></p><span></span></span>`;
    btn.querySelector("p").textContent = t.title;
    btn.querySelector(".t-meta span").textContent = t.artist + " • " + t.duration;
    btn.addEventListener("click", () => (i === cur ? toggle() : loadTrack(i, true)));
    if (t.spotify) {
      const a = document.createElement("a");
      a.className = "sp-btn"; a.title = "Buka di Spotify"; a.setAttribute("aria-label", "Buka di Spotify");
      a.href = t.spotify; a.target = "_blank"; a.rel = "noopener";
      a.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.36.719 1.02.42 1.56-.299.421-1.02.599-1.56.3z"/></svg>`;
      a.addEventListener("click", (e) => e.stopPropagation());
      btn.appendChild(a);
    }
    if (t.youtube) {
      const y = document.createElement("span");
      y.className = "yt"; y.title = "Buka video"; y.textContent = "▶";
      y.setAttribute("role", "button"); y.setAttribute("tabindex", "0");
      const open = (e) => { e.stopPropagation(); openYT(t.youtube); };
      y.addEventListener("click", open);
      y.addEventListener("keydown", (e) => { if (e.key === "Enter") open(e); });
      btn.appendChild(y);
    }
    li.appendChild(btn); ol.appendChild(li);
  });
}
renderTracks();

function setIcons() {
  const p = playing ? "none" : "", q = playing ? "" : "none";
  $("#miniIconPlay").style.display = p; $("#miniIconPause").style.display = q;
  $("#pIconPlay").style.display = p; $("#pIconPause").style.display = q;
}
function markPlaying() {
  document.querySelectorAll(".track").forEach((el) =>
    el.classList.toggle("playing", +el.dataset.i === cur));
}
function stopDemo() { clearInterval(demoTimer); demoTimer = null; }

function loadTrack(i, autoplay) {
  const t = CONFIG.songs[i]; if (!t) return;
  cur = i; stopDemo();
  ["#miniCover", "#playerCover"].forEach((s) => ($(s).src = t.cover));
  $("#miniTitle").textContent = t.title; $("#miniArtist").textContent = t.artist;
  $("#playerTitle").textContent = t.title; $("#playerArtist").textContent = t.artist;
  $("#mini").hidden = false;
  useDemo = !t.src;
  demoDur = toSec(t.duration); demoPos = 0;
  $("#tDur").textContent = t.duration;
  if (!useDemo) {
    audio.src = t.src;
    audio.currentTime = 0;
  }
  markPlaying(); paint(0, demoDur);
  if (autoplay) play(); else { playing = false; setIcons(); }
}
function play() {
  playing = true; setIcons();
  if (useDemo) {
    stopDemo();
    demoTimer = setInterval(() => {
      demoPos += 0.5;
      if (demoPos >= demoDur) { next(); return; }
      paint(demoPos, demoDur);
    }, 500);
  } else {
    audio.play().catch(() => { useDemo = true; play(); });
  }
}
function pause() { playing = false; setIcons(); stopDemo(); audio.pause(); }
function toggle() {
  if (cur < 0) { loadTrack(0, true); return; }
  playing ? pause() : play();
}
function next() { loadTrack((cur + 1) % CONFIG.songs.length, true); }
function prev() {
  const atStart = useDemo ? demoPos < 3 : audio.currentTime < 3;
  if (atStart) loadTrack((cur - 1 + CONFIG.songs.length) % CONFIG.songs.length, true);
  else { useDemo ? (demoPos = 0) : (audio.currentTime = 0); if (!playing) paint(0, demoDur || toSec(CONFIG.songs[cur].duration)); }
}
function paint(pos, dur) {
  $("#tCur").textContent = fmt(pos);
  const pct = dur > 0 ? (pos / dur) * 100 : 0;
  $("#seek").value = Math.round(pct * 10);
  $("#miniBar").style.width = pct + "%";
}

audio.addEventListener("timeupdate", () => {
  if (!useDemo && playing) paint(audio.currentTime, audio.duration || demoDur);
});
audio.addEventListener("ended", next);
audio.addEventListener("error", () => { if (!useDemo && playing) { useDemo = true; demoPos = 0; play(); } });
$("#seek").addEventListener("input", (e) => {
  const pct = e.target.value / 1000;
  if (useDemo) { demoPos = pct * demoDur; paint(demoPos, demoDur); }
  else if (isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
});

$("#playAll").onclick = () => loadTrack(0, true);
$("#miniToggle").onclick = (e) => { e.stopPropagation(); toggle(); };
$("#playerToggle").onclick = toggle;
$("#nextBtn").onclick = next; $("#prevBtn").onclick = prev;
$("#miniOpen").onclick = () => { if (cur < 0) loadTrack(0, false); $("#player").hidden = false; };
$("#playerClose").onclick = () => ($("#player").hidden = true);

/* ---------- YouTube modal ---------- */
function openYT(url) { $("#ytFrame").src = ytEmbed(url); $("#ytModal").hidden = false; }
const closeYT = () => { $("#ytFrame").src = ""; $("#ytModal").hidden = true; };
$("#ytClose").onclick = closeYT;
$("#ytModal").addEventListener("click", (e) => { if (e.target.id === "ytModal") closeYT(); });

/* ---------- Like / share / gift ---------- */
$("#likeBtn").onclick = (e) => {
  const b = e.currentTarget, on = b.classList.toggle("on");
  b.setAttribute("aria-pressed", on);
};
$("#shareBtn").onclick = async (e) => {
  const btn = e.currentTarget;
  const data = { title: document.title, text: "Limah Birthday Playlist buat kamu 🎂", url: location.href };
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); toast(btn); }
  } catch (_) { /* dibatalkan */ }
};
function toast(btn) {
  btn.style.color = "#1ED760";
  setTimeout(() => (btn.style.color = ""), 1200);
}
$("#giftBtn").onclick = () => {
  const card = $("#merchCard");
  card.classList.remove("wiggle"); void card.offsetWidth; card.classList.add("wiggle");
  setTimeout(() => { $("#prankBox").hidden = false; confetti(); }, 450);
};

/* ---------- Keyboard: Esc menutup modal ---------- */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  ["#lightbox", "#ytModal", "#player"].forEach((s) => {
    const el = $(s);
    if (!el.hidden && s !== "#player") el.hidden = true;
  });
  if (!$("#player").hidden) $("#player").hidden = true;
  if (!$("#ytModal").hidden) closeYT();
  if (!$("#lightbox").hidden) $("#lightbox").hidden = true;
});
