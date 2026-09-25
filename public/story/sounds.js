// Feed sounds preview: a scrollable phone where every reel plays its track (engine in ../music.js).
(() => {
  "use strict";

  const M = window.ScrollitisMusic;
  const TRACKS = M.tracks;

  // ---------- feed UI ----------

  // Icons: Lucide (ISC) — https://lucide.dev
  const P = {
    "heart": '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
    "message-circle": '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />',
    "bookmark": '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
    "forward": '<polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" />',
    "music": '<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />',
    "coffee": '<path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" />',
    "play": '<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />',
    "pause": '<rect x="14" y="3" width="5" height="18" rx="1" /><rect x="5" y="3" width="5" height="18" rx="1" />',
    "volume-2": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" />',
    "volume-x": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" />'
  };

  function svg(name, opts) {
    const o = opts || {};
    const paint = o.fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' + paint + ' stroke-width="' + (o.sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + P[name] + "</svg>";
  }

  const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

  const section = document.getElementById("sounds");
  const feed = document.getElementById("sf-feed");
  const gate = document.getElementById("sf-gate");
  const toggle = document.getElementById("snd-toggle");
  const list = document.getElementById("snd-list");
  const vol = document.getElementById("snd-vol");

  let soundOn = false;
  let live = 0;

  function soundLine(tr) {
    const text = M.label(tr) + "  ·  ";
    return '<div class="sound">' + svg("music") + '<span class="sf-marq"><span>' + text + text + "</span></span></div>";
  }

  function rail(avatar, avatarBg, discColor) {
    return (
      '<div class="rail">' +
      '<div class="avatar" style="background:' + avatarBg + '"><span class="mono">' + avatar + "</span></div>" +
      '<div class="rail-item">' + svg("heart", { fill: true }) + "<span>" + rand(12, 999) + "K</span></div>" +
      '<div class="rail-item">' + svg("message-circle", { fill: true }) + "<span>" + rand(120, 9999).toLocaleString() + "</span></div>" +
      '<div class="rail-item">' + svg("bookmark", { fill: true }) + "<span>" + rand(1, 99) + "K</span></div>" +
      '<div class="rail-item">' + svg("forward", { sw: 2.4 }) + "<span>Share</span></div>" +
      '<div class="disc" style="background:radial-gradient(circle, ' + discColor + ' 0 30%, #1a1a1a 32%)"></div>' +
      "</div>"
    );
  }

  function reelHtml(tr, n) {
    const chip = '<div class="sf-chip">S' + n + " · " + tr.genre + " · " + tr.bpm + " BPM</div>";
    if (tr.pitch) {
      return (
        '<div class="card" style="background:' + tr.bg + '">' + chip +
        '<div class="sf-pitch-hero">' + svg(tr.icon, { sw: 1.6 }) + tr.brand + "</div>" +
        '<div class="caption">' +
        '<div class="handle">' + tr.brand + "</div>" +
        "<p>" + tr.title + ' <span class="sf-tagline">Sponsored</span></p>' +
        soundLine(tr) +
        '<div class="sf-pitch-cta">' + tr.cta + "</div>" +
        "</div>" +
        rail(svg(tr.icon), "#1c1c1f", "#c8a27a") +
        "</div>"
      );
    }
    return (
      '<div class="card" style="background:' + tr.bg + '">' + chip +
      '<div class="b-center">' + tr.text.map((l) => '<div><span class="tt-text">' + l + "</span></div>").join("") + "</div>" +
      '<div class="caption">' +
      '<div class="handle">@' + tr.user + "</div>" +
      "<p>" + tr.caption + "</p>" +
      soundLine(tr) +
      "</div>" +
      rail(tr.user[0].toUpperCase(), tr.avatar, tr.avatar) +
      "</div>"
    );
  }

  TRACKS.forEach((tr, i) => {
    const reel = document.createElement("div");
    reel.className = "sf-reel";
    reel.innerHTML = reelHtml(tr, i + 1);
    feed.appendChild(reel);

    const row = document.createElement("li");
    row.className = "snd-row";
    row.innerHTML =
      '<button class="snd-play" type="button" aria-label="Play ' + tr.name + '"></button>' +
      "<div>" +
      '<div class="snd-title"><span class="snd-num">S' + (i + 1) + '</span><span class="snd-name">' + M.label(tr) + '</span><span class="snd-genre">' + tr.genre + " · " + tr.bpm + " BPM</span></div>" +
      "<p>" + tr.note + "</p>" +
      "</div>" +
      '<span class="snd-eq" aria-hidden="true"><i></i><i></i><i></i></span>';
    row.addEventListener("click", () => {
      if (soundOn && live === i) {
        setSound(false);
      } else {
        live = i;
        setSound(true);
        jump(i);
      }
    });
    list.appendChild(row);
  });

  const reels = Array.from(feed.children);
  const rows = Array.from(list.children);

  function render() {
    section.classList.toggle("is-on", soundOn);
    reels.forEach((el, i) => el.classList.toggle("is-live", i === live));
    rows.forEach((el, i) => {
      const on = soundOn && i === live;
      el.classList.toggle("is-live", i === live);
      el.querySelector(".snd-play").innerHTML = svg(on ? "pause" : "play", { fill: true });
    });
    toggle.innerHTML = svg(soundOn ? "volume-2" : "volume-x") + (soundOn ? "Sound on" : "Sound off");
    gate.innerHTML = svg("volume-x") + "Tap for sound";
  }

  function setSound(on) {
    soundOn = on;
    if (on) M.play(TRACKS[live]);
    else M.stop();
    render();
  }

  function setLive(i) {
    if (i === live) return;
    live = i;
    if (soundOn) M.play(TRACKS[live]);
    render();
  }

  // Like TikTok: the next reel's sound takes over as soon as that reel is more than
  // halfway on screen, and the music dips while the feed is between reels.
  let jumpTo = -1;
  let jumpTimer = 0;

  feed.addEventListener("scroll", () => {
    const pos = feed.scrollTop / feed.clientHeight;
    const near = Math.max(0, Math.min(reels.length - 1, Math.round(pos)));

    // Clicking a track scrolls past the reels in between; don't play each of them.
    if (jumpTo >= 0) {
      if (near !== jumpTo) return;
      jumpTo = -1;
    }

    if (soundOn) M.duck(Math.min(1, Math.abs(pos - near) * 2));
    setLive(near);
  }, { passive: true });

  // Snapping should land exactly on a reel, but make sure the music comes back up.
  feed.addEventListener("scrollend", () => M.duck(0));

  function jump(i) {
    jumpTo = i;
    clearTimeout(jumpTimer);
    // Give up if the user grabs the feed before the smooth scroll arrives.
    jumpTimer = setTimeout(() => (jumpTo = -1), 1200);
    feed.scrollTo({ top: i * feed.clientHeight, behavior: "smooth" });
  }

  gate.addEventListener("click", () => setSound(true));
  toggle.addEventListener("click", () => setSound(!soundOn));
  vol.addEventListener("input", () => M.setVolume(Number(vol.value)));

  // Background tabs throttle timers, which garbles the loop, so pause while hidden.
  document.addEventListener("visibilitychange", () => {
    if (!soundOn) return;
    if (document.hidden) M.stop();
    else M.play(TRACKS[live]);
  });

  render();
})();
