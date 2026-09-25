(() => {
  "use strict";

  // Reels, ads and icons come from content.js
  const content = window.ScrollitisContent;
  const icon = content.icon;

  const START_TIME = 15;
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

  // 9–12 reels between ads
  function randomGap() {
    return 9 + Math.floor(Math.random() * 4);
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
  function railHtml(avatar, avatarBg, discColor, counts) {
    return (
      '<div class="rail">' +
      '<div class="avatar" aria-hidden="true" style="background:' + avatarBg + '">' + avatar + "</div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("heart", { fill: true }) + "</span><span>" + counts.likes + "</span></div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("message-circle", { fill: true }) + "</span><span>" + counts.comments + "</span></div>" +
      '<div class="rail-btn" aria-hidden="true"><span class="ic">' + icon("bookmark", { fill: true }) + "</span><span>" + counts.saves + "</span></div>" +
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
      '<div><span class="tt-text">you get 15 seconds.</span></div>' +
      '<div><span class="tt-text">scroll as far as you can.</span></div>' +
      "</div>" +
      captionHtml("scrollitis", "how far can you get? <b>#fyp #scrollitis</b>", INTRO_SONG) +
      SCRUB +
      "</div>" +
      railHtml(icon("chevrons-down", { sw: 2.6 }), "#000", INTRO_SONG.avatar, { likes: "2.4M", comments: "18.2K", saves: "310K" })
    );
    reels.push({ type: "intro", rank: 0, closed: false, el, song: INTRO_SONG });
  }

  function createReel(type) {
    let el;
    let reel;

    if (type === "reel") {
      rank++;
      const r = content.reel();
      const song = pickSong();
      el = addSlot(
        "content",
        '<div class="card">' +
        r.body +
        captionHtml(r.user, r.caption, song) +
        SCRUB +
        "</div>" +
        railHtml(r.user[0].toUpperCase(), r.avatarBg, r.avatarBg, r.counts)
      );
      reel = { type, rank, closed: false, el, song };
    } else {
      const ad = content.pitch();
      const side = Math.random() < 0.5 ? "tl" : "tr";
      el = addSlot(
        // Not "ad": content blockers (EasyList) hide .is-ad, .ad-cta etc.
        "pitch",
        // Laid out like a TikTok promoted post: a normal caption with a red CTA bar under it
        '<div class="card" style="background:' + ad.bg + '">' +
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
        railHtml(icon(ad.icon), "#1c1c1f", "#c8a27a", ad.counts)
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
