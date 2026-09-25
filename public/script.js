(() => {
  "use strict";

  // Icons: Lucide (ISC) v1.47.0 — https://lucide.dev
  const ICONS = {
    "heart": '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
    "message-circle": '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />',
    "bookmark": '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
    "forward": '<polyline points="15 17 20 12 15 7" /><path d="M4 18v-2a4 4 0 0 1 4-4h12" />',
    "chevrons-down": '<path d="m7 6 5 5 5-5" /><path d="m7 13 5 5 5-5" />',
    "x": '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    "volume-x": '<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" x2="16" y1="9" y2="15" /><line x1="16" x2="22" y1="9" y2="15" />',
    "music": '<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />',
    "coffee": '<path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" />',
    "shirt": '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />',
    "camera": '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" />',
    "watch": '<path d="M12 10v2.2l1.6 1" /><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" /><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" /><circle cx="12" cy="12" r="6" />',
    "sparkles": '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />',
    "dumbbell": '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" /><path d="m2.5 21.5 1.4-1.4" /><path d="m20.1 3.9 1.4-1.4" /><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" /><path d="m9.6 14.4 4.8-4.8" />',
    "shopping-bag": '<path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />'
  };

  function icon(name, opts) {
    const o = opts || {};
    const paint = o.fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' + paint + ' stroke-width="' + (o.sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  const START_TIME = 10;
  const STORE_KEY = "scrollitis:stats";
  const SOUND_KEY = "scrollitis:sound";

  // Every reel has its own looping track (music.js), like TikTok. Ads get the jingle.
  const music = window.ScrollitisMusic;
  const SONGS = music.tracks.filter((t) => !t.pitch);
  const JINGLE = music.tracks.find((t) => t.pitch);
  const INTRO_SONG = SONGS[0];

  const app = document.getElementById("app");
  const feed = document.getElementById("feed");
  const track = document.getElementById("track");
  const gameOver = document.getElementById("game-over");
  const playBtn = document.getElementById("play-btn");
  const againBtn = document.getElementById("again-btn");

  const bestEl = document.getElementById("best");
  const lastEl = document.getElementById("last");
  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const adsEl = document.getElementById("ads");

  const finalScore = document.getElementById("final-score");
  const finalAds = document.getElementById("final-ads");
  const finalTime = document.getElementById("final-time");
  const newBest = document.getElementById("new-best");

  const USERS = [
    "maya.eats", "dev.after.dark", "tiny.kitchen", "gymrat.jon", "sad.lofi.cat",
    "plantdad.leo", "nightowl.nina", "runclub.sam", "deskchef", "skate.theo",
    "mora.makes", "8bit.ben", "cozy.corner", "priya.paints", "the.fit.check",
    "zoe.travels", "chaos.kitchen", "bookish.bea", "lil.drummer", "moodboard.mo"
  ];

  const AVATAR_COLORS = ["#ff9f43", "#5f27cd", "#10ac84", "#ee5253", "#2e86de", "#f368e0", "#01a3a4", "#222f3e"];

  const CAPTIONS = [
    "POV: you should be sleeping",
    "This is a sign to hydrate",
    "Big weekend energy",
    "No thoughts, just vibes",
    "Certified banger",
    "Never skip this one",
    "The algorithm knows you",
    "Watch till the end",
    "Sound on",
    "You won't believe #3",
    "Tag a friend who needs this",
    "Me, at 2am, purely by accident"
  ];

  const TAGS = ["#fyp", "#foryou", "#viral", "#relatable", "#trending", "#2am"];

  const GRADIENTS = [
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
    "linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)"
  ];

  const AD_GRADIENTS = [
    "linear-gradient(160deg, #3a2c1e 0%, #17100a 100%)",
    "linear-gradient(160deg, #2e2a3a 0%, #131020 100%)",
    "linear-gradient(160deg, #1f2a3a 0%, #0f141c 100%)",
    "linear-gradient(160deg, #2a2e33 0%, #141619 100%)",
    "linear-gradient(160deg, #33223a 0%, #171020 100%)",
    "linear-gradient(160deg, #22301f 0%, #0f150e 100%)",
    "linear-gradient(160deg, #2a2430 0%, #141119 100%)"
  ];

  const ADS = [
    { icon: "coffee", brand: "Sipstream", title: "Wake up without the doom", cta: "Order now" },
    { icon: "shirt", brand: "Threadlab", title: "These pieces go with everything", cta: "Shop now" },
    { icon: "camera", brand: "Lumina", title: "Make your feed jealous", cta: "Get the app" },
    { icon: "watch", brand: "Kronos", title: "Time's ticking. Wear it well.", cta: "Shop now" },
    { icon: "sparkles", brand: "GlowForge", title: "Your skin, but glowier", cta: "Shop now" },
    { icon: "dumbbell", brand: "Liftly", title: "Stronger every scroll", cta: "Start free" },
    { icon: "shopping-bag", brand: "Cartful", title: "Everything, in 20 minutes", cta: "Order now" }
  ];

  // phase: "ready" (intro card showing) → "playing" → "over"
  let phase = "ready";
  let reels = [];
  let idx = -1;
  let score = 0;
  let adsClosed = 0;
  let timeLeft = START_TIME;
  let sinceAd = 0;
  let nextAdAfter = randomGap();
  let rank = 0;
  let lastTs = 0;
  let stats = loadStats();
  let lastSong = INTRO_SONG;
  let soundOn = loadSound();
  let playingReel = null;

  function loadStats() {
    try {
      const s = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
      if (s && typeof s.best === "number") return s;
    } catch (e) {}
    return { best: 0, last: null };
  }

  function loadSound() {
    try {
      return localStorage.getItem(SOUND_KEY) !== "off";
    } catch (e) {
      return true;
    }
  }

  function saveStats() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(stats));
    } catch (e) {}
  }

  // 4–6 reels between ads, about one every 5
  function randomGap() {
    return 4 + Math.floor(Math.random() * 3);
  }

  function rand(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Never the same track twice in a row
  function pickSong() {
    lastSong = pick(SONGS.filter((t) => t !== lastSong));
    return lastSong;
  }

  function nextType() {
    if (sinceAd < nextAdAfter) {
      sinceAd++;
      return "reel";
    }
    sinceAd = 0;
    nextAdAfter = randomGap();
    return "ad";
  }

  // The spinning record at the bottom of the rail is the mute toggle, as on TikTok.
  function railHtml(avatar, avatarBg, discColor) {
    return (
      '<div class="rail">' +
      '<div class="avatar" aria-hidden="true" style="background:' + avatarBg + '">' + avatar + "</div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("heart", { fill: true }) + "</span><span>" + rand(1, 999) + "K</span></div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("message-circle", { fill: true }) + "</span><span>" + rand(12, 9999).toLocaleString() + "</span></div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("bookmark", { fill: true }) + "</span><span>" + rand(1, 999) + "K</span></div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("forward", { sw: 2.4 }) + "</span><span>Share</span></div>" +
      '<button class="disc" type="button" aria-label="Sound" style="--disc:' + discColor + '">' + icon("volume-x", { sw: 2.4 }) + "</button>" +
      "</div>"
    );
  }

  function captionHtml(handle, text, song) {
    return (
      '<div class="caption">' +
      '<div class="handle">@' + handle + "</div>" +
      "<p>" + text + "</p>" +
      '<div class="sound">' + icon("music") + "<span>" + music.label(song) + "</span></div>" +
      "</div>"
    );
  }

  const SCRUB = '<div class="scrub"><i></i></div>';

  function addSlot(type, inner) {
    const el = document.createElement("section");
    el.className = "slot is-" + type;
    el.innerHTML = inner;
    track.appendChild(el);
    return el;
  }

  function createIntro() {
    const el = addSlot(
      "intro",
      '<div class="card">' +
      '<div class="tt-lines">' +
      '<div><span class="tt-text">you get 10 seconds.</span></div>' +
      '<div><span class="tt-text">scroll as far as you can.</span></div>' +
      "</div>" +
      captionHtml("scrollitis", "how far can you get? <b>#fyp #scrollitis</b>", INTRO_SONG) +
      SCRUB +
      "</div>" +
      railHtml(icon("chevrons-down", { sw: 2.6 }), "#000", INTRO_SONG.avatar)
    );
    reels.push({ type: "intro", rank: 0, closed: false, el, song: INTRO_SONG });
  }

  function createReel(type) {
    let el;
    let reel;

    if (type === "reel") {
      rank++;
      const user = pick(USERS);
      const song = pickSong();
      const color = pick(AVATAR_COLORS);
      el = addSlot(
        "content",
        '<div class="card" style="background:' + pick(GRADIENTS) + '">' +
        captionHtml(user, pick(CAPTIONS) + " <b>" + pick(TAGS) + "</b>", song) +
        SCRUB +
        "</div>" +
        railHtml(user[0].toUpperCase(), color, color)
      );
      reel = { type, rank, closed: false, el, song };
    } else {
      const ad = pick(ADS);
      const side = Math.random() < 0.5 ? "tl" : "tr";
      el = addSlot(
        // Not "ad": content blockers (EasyList) hide .is-ad, .ad-cta etc.
        "pitch",
        // Laid out like a TikTok promoted post: a normal caption with a red CTA bar under it
        '<div class="card" style="background:' + pick(AD_GRADIENTS) + '">' +
        '<div class="pitch-hero">' + icon(ad.icon, { sw: 1.6 }) + "<span>" + ad.brand + "</span></div>" +
        '<button class="pitch-x ' + side + '" type="button" aria-label="Close ad">' + icon("x", { sw: 2.6 }) + "</button>" +
        '<span class="pitch-plus ' + side + '">+1s</span>' +
        '<div class="pitch-hint">Ad · tap ✕ to keep scrolling</div>' +
        '<div class="caption">' +
        '<div class="handle">' + ad.brand + "</div>" +
        "<p>" + ad.title + ' <span class="pitch-label">Sponsored</span></p>' +
        '<div class="sound">' + icon("music") + "<span>" + music.label(JINGLE) + "</span></div>" +
        '<button class="pitch-cta" type="button" tabindex="-1">' + ad.cta + "</button>" +
        "</div>" +
        SCRUB +
        "</div>" +
        railHtml(icon(ad.icon), "#1c1c1f", "#c8a27a")
      );
      reel = { type, rank: -1, closed: false, el, song: JINGLE };
      el.querySelector(".pitch-x").addEventListener("click", (e) => {
        e.stopPropagation();
        closeAd(reel);
      });
    }

    reels.push(reel);
    return reel;
  }

  function buildFeed() {
    track.innerHTML = "";
    reels = [];
    rank = 0;
    lastSong = INTRO_SONG;
    sinceAd = 0;
    nextAdAfter = randomGap();
    idx = -1;
    createIntro();
    fill();
    feed.classList.remove("locked");
    feed.scrollTop = 0;
    onScroll();
  }

  // ---------- scrolling ----------
  // Plain native scrolling with snap. The feed never extends past an ad that
  // hasn't been closed, so the ad is simply the end of the feed until the
  // player taps ✕. (No overflow toggling: iOS freezes if it changes mid-fling.)

  let slotH = 0;

  function fill() {
    while (reels.length - Math.max(idx, 0) < 8) {
      const last = reels[reels.length - 1];
      if (last.type === "ad" && !last.closed) return;
      createReel(nextType());
    }
  }

  function onScroll() {
    if (!reels.length || !slotH) return;
    const top = feed.scrollTop;
    if (phase === "ready" && top > slotH * 0.12) startRun();

    const cur = Math.max(0, Math.min(reels.length - 1, Math.round(top / slotH)));
    // Music dips while the feed is between reels; the next track starts once its reel is over halfway in
    if (playingReel) music.duck(Math.min(1, Math.abs(top / slotH - cur) * 2));
    if (cur !== idx) {
      if (reels[idx]) reels[idx].el.classList.remove("active");
      idx = cur;
      reels[idx].el.classList.add("active");
      fill();
      // Count every reel passed, even ones skipped over in a fast flick
      for (let i = idx; i >= 0; i--) {
        if (reels[i].type === "reel") {
          score = Math.max(score, reels[i].rank);
          break;
        }
      }
      updateHud();
      syncMusic();
    }
  }

  feed.addEventListener("scroll", onScroll, { passive: true });
  feed.addEventListener("scrollend", () => music.duck(0));

  function onAd() {
    const r = reels[idx];
    return phase === "playing" && r && r.type === "ad" && !r.closed;
  }

  // Trying to scroll while stuck on an ad flashes its ✕ and hint.
  function nudgeAd() {
    const r = reels[idx];
    if (!onAd() || r.el.classList.contains("blocked")) return;
    r.el.classList.add("blocked");
    setTimeout(() => r.el.classList.remove("blocked"), 450);
  }

  feed.addEventListener("wheel", (e) => e.deltaY > 0 && nudgeAd(), { passive: true });
  feed.addEventListener("touchmove", nudgeAd, { passive: true });

  function goTo(i) {
    feed.scrollTo({ top: i * slotH, behavior: "smooth" });
  }

  window.addEventListener("keydown", (e) => {
    if (phase === "over") return;
    const next = ["ArrowDown", "PageDown", " ", "Spacebar", "j"];
    const prev = ["ArrowUp", "PageUp", "k"];
    if (next.includes(e.key)) {
      if (e.target.tagName === "BUTTON" && e.key === " ") return;
      e.preventDefault();
      if (onAd()) nudgeAd();
      else if (!e.repeat) goTo(idx + 1);
    } else if (prev.includes(e.key)) {
      e.preventDefault();
      if (!e.repeat) goTo(idx - 1);
    }
  });

  function measure() {
    slotH = feed.clientHeight;
    document.documentElement.style.setProperty("--h", slotH + "px");
    feed.scrollTop = Math.max(idx, 0) * slotH;
  }

  window.addEventListener("resize", measure);

  // ---------- music ----------

  function syncMusic() {
    const reel = reels[idx];
    const want = soundOn && music.running() && phase !== "over" && !document.hidden && reel;
    if (want && playingReel !== reel) {
      music.play(reel.song);
      music.duck(0);
      playingReel = reel;
    } else if (!want && playingReel) {
      music.stop();
      playingReel = null;
    }
    app.classList.toggle("muted", !soundOn);
  }

  // Audio can only start from a tap, click or key press. Scrolling alone doesn't count.
  function unlockAudio() {
    if (!soundOn || music.running()) return;
    music.unlock();
    // resume() is async
    setTimeout(syncMusic, 60);
  }

  ["pointerdown", "touchend", "click", "keydown"].forEach((type) => {
    window.addEventListener(type, unlockAudio, { capture: true, passive: true });
  });

  track.addEventListener("click", (e) => {
    if (!e.target.closest(".disc")) return;
    soundOn = !soundOn;
    try {
      localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
    } catch (err) {}
    if (soundOn) music.unlock();
    setTimeout(syncMusic, 60);
    syncMusic();
  });

  // Background tabs throttle timers, which garbles the loop
  document.addEventListener("visibilitychange", syncMusic);

  // ---------- game ----------

  function updateHud() {
    scoreEl.textContent = score;
    adsEl.textContent = adsClosed;
    const t = Math.max(0, timeLeft);
    timerEl.textContent = t.toFixed(1);

    let col = "#ffffff";
    if (t > START_TIME) col = "#27e07f";
    else if (t <= 1) col = "#ff4d4d";
    else if (t <= 2) col = "#ffb020";
    timerEl.style.color = col;

    const fill = reels[idx] && reels[idx].el.querySelector(".scrub i");
    if (fill) {
      fill.style.width = Math.max(0, Math.min(1, t / START_TIME)) * 100 + "%";
      fill.style.background = col;
    }

    app.classList.toggle("critical", phase === "playing" && t <= 1);
  }

  function updateReadyDock() {
    bestEl.textContent = stats.best;
    lastEl.textContent = stats.last === null ? "–" : stats.last;
  }

  function closeAd(reel) {
    if (phase !== "playing" || reel.closed) return;
    reel.closed = true;
    reel.el.classList.add("closed");
    adsClosed++;
    timeLeft += 1;
    spawnPlusOne();
    updateHud();
    fill();
    setTimeout(() => {
      if (phase === "playing" && reels[idx] === reel) goTo(idx + 1);
    }, 160);
  }

  function spawnPlusOne() {
    const r = timerEl.getBoundingClientRect();
    const fly = document.createElement("span");
    fly.className = "fly-plus";
    fly.textContent = "+1s";
    fly.style.left = r.left + r.width / 2 + "px";
    fly.style.top = r.top - 6 + "px";
    app.appendChild(fly);
    fly.addEventListener("animationend", () => fly.remove());
  }

  function startRun() {
    phase = "playing";
    score = 0;
    adsClosed = 0;
    timeLeft = START_TIME;
    lastTs = 0;
    app.classList.add("playing");
    updateHud();
  }

  function endRun() {
    phase = "over";
    feed.classList.add("locked");
    app.classList.remove("critical");
    const isBest = score > stats.best;
    stats.last = score;
    if (isBest) stats.best = score;
    saveStats();
    syncMusic();

    const totalTime = START_TIME + adsClosed;
    finalScore.textContent = score;
    finalAds.textContent = adsClosed;
    finalTime.textContent = totalTime + "s";
    newBest.classList.toggle("hidden", !isBest || score === 0);
    gameOver.classList.remove("hidden");

    trackEvent("score/" + score);
    trackEvent("time/" + totalTime + "s");
  }

  // GoatCounter is only loaded in production (see index.html), and may be blocked.
  function trackEvent(path) {
    if (!window.goatcounter || !window.goatcounter.count) return;
    window.goatcounter.count({ path, title: path, event: true });
  }

  function reset() {
    phase = "ready";
    timeLeft = START_TIME;
    gameOver.classList.add("hidden");
    app.classList.remove("playing", "critical");
    buildFeed();
    updateReadyDock();
  }

  function loop(ts) {
    if (lastTs === 0) lastTs = ts;
    const dt = Math.min(0.1, (ts - lastTs) / 1000);
    lastTs = ts;

    if (phase === "playing") {
      timeLeft -= dt;
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateHud();
        endRun();
      } else {
        updateHud();
      }
    }

    requestAnimationFrame(loop);
  }

  playBtn.addEventListener("click", () => goTo(1));
  againBtn.addEventListener("click", reset);

  measure();
  reset();
  requestAnimationFrame(loop);
})();
