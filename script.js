(() => {
  "use strict";

  // Icons: Lucide (ISC) v1.47.0 — https://lucide.dev
  const ICONS = {
    "heart": '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
    "message-circle": '<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />',
    "bookmark": '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
    "share-2": '<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />',
    "x": '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
    "chevron-down": '<path d="m6 9 6 6 6-6" />',
    "music": '<path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />',
    "coffee": '<path d="M10 2v2" /><path d="M14 2v2" /><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" /><path d="M6 2v2" />',
    "shirt": '<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />',
    "camera": '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z" /><circle cx="12" cy="13" r="3" />',
    "watch": '<path d="M12 10v2.2l1.6 1" /><path d="m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" /><path d="m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" /><circle cx="12" cy="12" r="6" />',
    "sparkles": '<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />',
    "dumbbell": '<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z" /><path d="m2.5 21.5 1.4-1.4" /><path d="m20.1 3.9 1.4-1.4" /><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z" /><path d="m9.6 14.4 4.8-4.8" />',
    "shopping-bag": '<path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />'
  };

  function icon(name) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  const START_TIME = 5;

  const reelsEl = document.getElementById("reels");
  const startScreen = document.getElementById("start-screen");
  const playScreen = document.getElementById("play-screen");
  const gameOver = document.getElementById("game-over");
  const startBtn = document.getElementById("start-btn");
  const againBtn = document.getElementById("again-btn");

  const scoreEl = document.getElementById("score");
  const timerEl = document.getElementById("timer");
  const adsEl = document.getElementById("ads");
  const timeFill = document.getElementById("timebar-fill");

  const finalScore = document.getElementById("final-score");
  const finalAds = document.getElementById("final-ads");
  const finalTime = document.getElementById("final-time");

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

  let reels = [];
  let score = 0;
  let adsClosed = 0;
  let timeLeft = 0;
  let playing = false;
  let locked = false;
  let frozen = false;
  let activeAd = null;
  let sinceAd = 0;
  let nextAdAfter = randomGap();
  let normalRank = 0;
  let lastTs = 0;

  function randomGap() {
    return 3 + Math.floor(Math.random() * 3);
  }

  function rand(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
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

  function createReel(type, rank) {
    const el = document.createElement("section");
    el.className = "reel " + (type === "ad" ? "is-ad" : "is-content");

    if (type === "reel") {
      el.style.background = pick(GRADIENTS);
      const cap = pick(CAPTIONS);
      const pad = rank < 10 ? "0" : "";
      el.innerHTML =
        '<span class="chip">Reel ' + (rank + 1) + "</span>" +
        '<div class="caption-area">' +
        '<span class="handle">@doom.reel.' + pad + rank + "</span>" +
        '<p class="caption">' + cap + "</p>" +
        "</div>" +
        '<div class="rail">' +
        '<button class="rail-btn" aria-hidden="true">' + icon("heart") + "<span>" + rand(1, 999) + "K</span></button>" +
        '<button class="rail-btn" aria-hidden="true">' + icon("message-circle") + "<span>" + rand(12, 999) + "</span></button>" +
        '<button class="rail-btn" aria-hidden="true">' + icon("bookmark") + "<span>" + rand(1, 999) + "K</span></button>" +
        '<button class="rail-btn" aria-hidden="true">' + icon("share-2") + "<span>Share</span></button>" +
        "</div>" +
        '<div class="sound-disc">' + icon("music") + "</div>" +
        (rank === 0 ? '<div class="swipe-hint">' + icon("chevron-down") + "<span>Scroll</span></div>" : "");
    } else {
      const ad = pick(ADS);
      const side = Math.random() < 0.5 ? "tl" : "tr";
      const other = side === "tl" ? "tr" : "tl";
      el.innerHTML =
        '<div class="ad-media" style="background:' + pick(AD_GRADIENTS) + '">' +
        '<div class="ad-hero">' +
        '<span class="ad-hero-icon">' + icon(ad.icon) + "</span>" +
        '<span class="ad-hero-brand">' + ad.brand + "</span>" +
        "</div>" +
        "</div>" +
        '<button class="ad-x ' + side + '" aria-label="Close ad">' + icon("x") + "</button>" +
        '<span class="ad-tag ' + other + '">Sponsored</span>' +
        '<div class="ad-footer">' +
        '<div class="ad-brand-row">' +
        '<span class="ad-avatar">' + icon(ad.icon) + "</span>" +
        '<span class="ad-name">' + ad.brand + "</span>" +
        "</div>" +
        '<p class="ad-title">' + ad.title + "</p>" +
        '<button class="ad-cta" tabindex="-1">' + ad.cta + "</button>" +
        "</div>" +
        '<span class="ad-plus ' + side + '">+1s</span>' +
        '<div class="ad-hint">Tap X to keep scrolling</div>';

      el.querySelector(".ad-x").addEventListener("click", (e) => {
        e.stopPropagation();
        closeAd(reel);
      });
    }

    reelsEl.appendChild(el);
    const reel = { type, rank, closed: false, el };
    reels.push(reel);
    return reel;
  }

  function makeReel() {
    const t = nextType();
    return createReel(t, t === "reel" ? normalRank++ : -1);
  }

  function seedReels(count) {
    for (let i = 0; i < count; i++) makeReel();
  }

  function updateHud() {
    scoreEl.textContent = score;
    adsEl.textContent = adsClosed;
    const t = Math.max(0, timeLeft);
    timerEl.textContent = t.toFixed(1);
    timeFill.style.width = (Math.max(0, Math.min(1, t / START_TIME)) * 100) + "%";

    let col = "#ffffff";
    if (t > START_TIME) col = "#27e07f";
    else if (t <= 1) col = "#ff4d4d";
    else if (t <= 2) col = "#ffb020";
    timerEl.style.color = col;

    if (t <= 1) timeFill.style.background = "#ff4d4d";
    else if (t <= 2) timeFill.style.background = "#ffb020";
    else if (t > START_TIME) timeFill.style.background = "#27e07f";
    else timeFill.style.background = "#fe2c55";

    playScreen.classList.toggle("critical", playing && t <= 1);
  }

  function lockToAd(reel) {
    locked = true;
    activeAd = reel;
    reelsEl.classList.add("locked");
    reel.el.classList.add("active");
    reelsEl.scrollTop = reel.el.offsetTop;
  }

  function unlockIfNeeded() {
    if (!locked) return;
    locked = false;
    activeAd = null;
    reelsEl.classList.remove("locked");
    reels.forEach((r) => r.el.classList.remove("active"));
  }

  function closeAd(reel) {
    if (!reel || reel.closed) return;
    reel.closed = true;
    reel.el.classList.add("closed");
    reel.el.classList.remove("active");
    adsClosed++;
    timeLeft += 1;
    spawnPlusOne();
    unlockIfNeeded();
    updateHud();
  }

  function spawnPlusOne() {
    const r = timerEl.getBoundingClientRect();
    const fly = document.createElement("span");
    fly.className = "fly-plus";
    fly.textContent = "+1s";
    fly.style.left = r.left + r.width / 2 + "px";
    fly.style.top = r.top - 6 + "px";
    playScreen.appendChild(fly);
    fly.addEventListener("animationend", () => fly.remove());
  }

  function onScroll() {
    if (!playing || reels.length === 0) return;

    const st = reelsEl.scrollTop;
    let idx = 0;
    let best = Infinity;
    for (let i = 0; i < reels.length; i++) {
      const d = Math.abs(st - reels[i].el.offsetTop);
      if (d < best) {
        best = d;
        idx = i;
      }
    }

    let adIdx = -1;
    for (let i = 0; i <= idx && i < reels.length; i++) {
      if (reels[i].type === "ad" && !reels[i].closed) {
        adIdx = i;
        break;
      }
    }

    if (adIdx !== -1) {
      if (!locked || activeAd !== reels[adIdx]) lockToAd(reels[adIdx]);
    } else {
      unlockIfNeeded();
      const reel = reels[idx];
      if (reel.type === "reel" && reel.rank > score) score = reel.rank;
    }

    if (reelsEl.scrollTop + reelsEl.clientHeight > reelsEl.scrollHeight - reelsEl.clientHeight * 1.5) {
      for (let i = 0; i < 6; i++) makeReel();
    }

    updateHud();
  }

  function loop(ts) {
    if (lastTs === 0) lastTs = ts;
    const dt = Math.min(0.1, (ts - lastTs) / 1000);
    lastTs = ts;

    if (playing) {
      timeLeft -= dt;
      if (timeLeft <= 0) {
        timeLeft = 0;
        updateHud();
        endGame();
      } else {
        updateHud();
      }
    }

    requestAnimationFrame(loop);
  }

  function endGame() {
    playing = false;
    frozen = true;
    reelsEl.classList.add("locked");
    finalScore.textContent = score;
    finalAds.textContent = adsClosed;
    finalTime.textContent = (START_TIME + adsClosed) + "s";
    gameOver.classList.remove("hidden");
  }

  function startGame() {
    reels = [];
    normalRank = 0;
    sinceAd = 0;
    nextAdAfter = randomGap();
    score = 0;
    adsClosed = 0;
    timeLeft = START_TIME;
    playing = true;
    frozen = false;
    locked = false;
    activeAd = null;
    lastTs = 0;

    reelsEl.innerHTML = "";
    reelsEl.classList.remove("locked", "frozen");
    seedReels(8);
    reelsEl.scrollTop = 0;

    startScreen.classList.add("hidden");
    playScreen.classList.remove("hidden");
    gameOver.classList.add("hidden");
    updateHud();
  }

  reelsEl.addEventListener(
    "wheel",
    (e) => {
      if (locked || frozen) e.preventDefault();
    },
    { passive: false }
  );

  reelsEl.addEventListener(
    "touchmove",
    (e) => {
      if (locked || frozen) e.preventDefault();
    },
    { passive: false }
  );

  window.addEventListener("keydown", (e) => {
    if (!playing) return;
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Spacebar", "PageUp", "PageDown", "Home", "End"].includes(e.key)) {
      e.preventDefault();
    }
  });

  window.addEventListener("resize", () => {
    if (!playing) return;
    const st = reelsEl.scrollTop;
    let idx = 0;
    let best = Infinity;
    for (let i = 0; i < reels.length; i++) {
      const d = Math.abs(st - reels[i].el.offsetTop);
      if (d < best) {
        best = d;
        idx = i;
      }
    }
    reelsEl.scrollTop = reels[idx].el.offsetTop;
  });

  reelsEl.addEventListener("scroll", onScroll, { passive: true });

  startBtn.addEventListener("click", startGame);
  againBtn.addEventListener("click", startGame);

  requestAnimationFrame(loop);
})();