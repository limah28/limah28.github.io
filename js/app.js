/* Birthday Mix app — vanilla JS, no build step. */
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
$("#lockPrompt").textContent = "Masukkan tanggal dan bulan lahir kamu (contoh: 1405)";
$("#bdayTitle").textContent = "Happy Birthday, " + CONFIG.birthdayName + "!";
$("#heroCover").src = CONFIG.heroPhoto;
$("#letterText").textContent = CONFIG.letterText;
$("#prankText").textContent = CONFIG.giftPrankText;
if (CONFIG.socialDmLink) {
  const dm = $("#dmBtn");
  dm.href = CONFIG.socialDmLink;
  dm.hidden = false;
}

/* ---------- Galeri + lightbox ---------- */
let lbList = [], lbIdx = 0;
function renderRail(el, photos) {
  el.innerHTML = "";
  photos.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src; img.alt = "Foto"; img.loading = "lazy";
    img.addEventListener("click", () => openLB(photos, i));
    el.appendChild(img);
  });
}
renderRail($("#bestRow"), CONFIG.bestShots);
renderRail($("#throwRow"), CONFIG.throwback);

function openLB(list, i) {
  lbList = list; lbIdx = i;
  $("#lbImg").src = list[i];
  $("#lightbox").hidden = false;
}
function stepLB(d) {
  lbIdx = (lbIdx + d + lbList.length) % lbList.length;
  $("#lbImg").src = lbList[lbIdx];
}
$("#lbClose").onclick = () => ($("#lightbox").hidden = true);
$("#lbPrev").onclick = (e) => { e.stopPropagation(); stepLB(-1); };
$("#lbNext").onclick = (e) => { e.stopPropagation(); stepLB(1); };
$("#lightbox").addEventListener("click", (e) => {
  if (e.target.id === "lightbox") $("#lightbox").hidden = true;
});

/* ---------- Surat expand ---------- */
const letterText = $("#letterText"), letterToggle = $("#letterToggle");
letterToggle.onclick = () => {
  const open = letterText.classList.toggle("collapsed");
  letterToggle.textContent = open ? "Baca Selengkapnya" : "Tutup";
};
letterText.classList.add("collapsed");

/* ---------- Lock screen ---------- */
const lock = $("#lock"), app = $("#app");
$("#lockForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const val = $("#lockInput").value.trim();
  if (val === CONFIG.password) {
    lock.classList.add("done");
    setTimeout(() => { lock.style.display = "none"; app.hidden = false; }, 450);
    confetti();
  } else {
    const card = lock.querySelector(".lock-card");
    card.classList.remove("shake"); void card.offsetWidth; card.classList.add("shake");
    $("#lockHint").textContent = CONFIG.hintWrong;
  }
});

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
  if (!useDemo && isFinite(audio.duration) && audio.duration > 0) $("#tDur").textContent = fmt(audio.duration);
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
  const data = { title: document.title, text: "Birthday Mix buat kamu 🎂", url: location.href };
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
