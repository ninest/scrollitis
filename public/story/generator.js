// Reel generator preview: an endless phone feed from ../content.js, filterable by kind,
// plus the pools it draws from (kinds, people, ads).
(() => {
  "use strict";

  const C = window.ScrollitisContent;
  const icon = C.icon;

  const feed = document.getElementById("gen-feed");
  const kindsEl = document.getElementById("gen-kinds");
  const rollBtn = document.getElementById("gen-roll");
  const kindList = document.getElementById("gen-kind-list");
  const peopleEl = document.getElementById("gen-people");
  const adList = document.getElementById("gen-ad-list");

  const KIND_INFO = {
    news: ["News", "Satirical headlines about real people, stamped with a recent date. Four looks: dark red, TV lower third, yellow tabloid page, and a lock-screen push notification. All but the notification have a scrolling LIVE ticker."],
    life: ["Life updates", "Oversharing as a TikTok text post: \"day 47 of…\", \"update:…\", \"nobody: / me at 3am:\". White, black, coloured or outlined text, with random alignment, height and a slight tilt."],
    edit: ["Edits", "Fan-edit style: \"[figure] edit (sped up)\", \"aura +9999\". Four looks: neon glow, RGB glitch, stacked outline, VHS sunset."],
    take: ["Hot takes / POV", "Unpopular opinions, POVs, red flags. Solid colours, sometimes with dots or stripes, in four layouts: left, big quote marks, sticker label, all caps."],
    learn: ["Learning", "\"Part 37\" edu-reels with real facts. Five boards: chalkboard, slate, blueprint, notebook page, sticky note on cork."]
  };

  let filter = "all";
  let sinceAd = 0;
  let gap = 5;

  function fmtRail(avatar, bg, counts) {
    return (
      '<div class="rail">' +
      '<div class="avatar" style="background:' + bg + '">' + avatar + "</div>" +
      '<div class="rail-item">' + icon("heart", { fill: true }) + "<span>" + counts.likes + "</span></div>" +
      '<div class="rail-item">' + icon("message-circle", { fill: true }) + "<span>" + counts.comments + "</span></div>" +
      '<div class="rail-item">' + icon("bookmark", { fill: true }) + "<span>" + counts.saves + "</span></div>" +
      '<div class="rail-item">' + icon("forward", { sw: 2.4 }) + "<span>Share</span></div>" +
      '<div class="disc" style="background:radial-gradient(circle, ' + bg + ' 0 30%, #1a1a1a 32%)"></div>' +
      "</div>"
    );
  }

  function reelHtml(r) {
    return (
      '<div class="card">' + r.body +
      '<div class="caption">' +
      '<div class="handle">@' + r.user + "</div>" +
      "<p>" + r.caption + "</p>" +
      '<div class="sound">' + icon("music") + "<span>original sound · " + r.user + "</span></div>" +
      "</div>" +
      fmtRail('<span class="mono">' + r.user[0].toUpperCase() + "</span>", r.avatarBg, r.counts) +
      "</div>"
    );
  }

  function pitchHtml(p) {
    return (
      '<div class="card" style="background:' + p.bg + '">' +
      '<div class="sf-pitch-hero">' + icon(p.icon, { sw: 1.6 }) + p.brand + "</div>" +
      '<div class="scrn-x">' + icon("x", { sw: 2.6 }) + "</div>" +
      '<div class="caption">' +
      '<div class="handle">' + p.brand + "</div>" +
      "<p>" + p.title + ' <span class="sf-tagline">Sponsored</span></p>' +
      '<div class="sound">' + icon("music") + "<span>Promoted music</span></div>" +
      '<div class="sf-pitch-cta">' + p.cta + "</div>" +
      "</div>" +
      fmtRail(icon(p.icon), "#1c1c1f", p.counts) +
      "</div>"
    );
  }

  function add(html) {
    const el = document.createElement("div");
    el.className = "sf-reel";
    el.innerHTML = html;
    feed.appendChild(el);
  }

  // The ads filter shows every ad once, in list order
  function adsInOrder() {
    C.pitches.forEach((p) => {
      const copy = Object.assign({}, C.pitch(), p);
      copy.bg = "linear-gradient(160deg, " + p.bg + " 0%, #0d0b10 100%)";
      add(pitchHtml(copy));
    });
  }

  function more(n) {
    if (filter === "ads") return;
    for (let i = 0; i < n; i++) {
      if (filter === "all" && sinceAd >= gap) {
        sinceAd = 0;
        gap = 4 + Math.floor(Math.random() * 3);
        add(pitchHtml(C.pitch()));
      } else {
        sinceAd++;
        add(reelHtml(C.reel(filter === "all" ? undefined : filter)));
      }
    }
  }

  function rebuild(scrollTo) {
    feed.innerHTML = "";
    sinceAd = 0;
    if (filter === "ads") adsInOrder();
    else more(8);
    feed.scrollTop = (scrollTo || 0) * feed.clientHeight;
    render();
  }

  // Endless: top up when two reels from the end
  feed.addEventListener("scroll", () => {
    const i = Math.round(feed.scrollTop / feed.clientHeight);
    if (feed.children.length - i < 3) more(6);
  }, { passive: true });

  function setFilter(f, scrollTo) {
    filter = f;
    rebuild(scrollTo);
  }

  // ---------- controls ----------

  const FILTERS = [["all", "All"]].concat(C.kinds.map((k) => [k, KIND_INFO[k][0]]), [["ads", "Ads"]]);

  FILTERS.forEach(([f, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "gen-chip";
    b.dataset.f = f;
    b.textContent = label;
    b.addEventListener("click", () => setFilter(f));
    kindsEl.appendChild(b);
  });

  function render() {
    kindsEl.querySelectorAll(".gen-chip").forEach((b) => b.classList.toggle("is-on", b.dataset.f === filter));
    kindList.querySelectorAll("li").forEach((li) => li.classList.toggle("is-on", li.dataset.f === filter));
    rollBtn.disabled = filter === "ads";
  }

  rollBtn.addEventListener("click", () => rebuild());

  // ---------- pools ----------

  C.kinds.forEach((k, i) => {
    const li = document.createElement("li");
    li.className = "snd-row gen-row";
    li.dataset.f = k;
    li.innerHTML =
      '<span class="snd-num">R' + (i + 1) + "</span>" +
      "<div>" +
      '<div class="snd-title"><span class="snd-name">' + KIND_INFO[k][0] + "</span></div>" +
      "<p>" + KIND_INFO[k][1] + "</p>" +
      "</div>";
    li.addEventListener("click", () => setFilter(k));
    kindList.appendChild(li);
  });

  C.figures
    .slice()
    .sort((a, b) => b.w - a.w)
    .forEach((f) => {
      const s = document.createElement("span");
      s.className = "gen-person" + (f.w >= 3 ? " is-main" : "");
      s.textContent = f.name + " · " + f.lines.length;
      peopleEl.appendChild(s);
    });

  C.pitches.forEach((p, i) => {
    const li = document.createElement("li");
    li.className = "snd-row gen-row";
    li.innerHTML =
      '<span class="snd-num">A' + (i + 1) + "</span>" +
      "<div>" +
      '<div class="snd-title"><span class="gen-ad-ic" style="background:' + p.bg + '">' + icon(p.icon, { sw: 1.8 }) + '</span><span class="snd-name">' + p.brand + '</span><span class="snd-genre">' + p.cta + "</span></div>" +
      "<p>" + p.title + "</p>" +
      "</div>";
    li.addEventListener("click", () => setFilter("ads", i));
    adList.appendChild(li);
  });

  // ---------- the "During a run: reel" mock in Current screens ----------

  const mock = document.getElementById("scrn-reel");
  if (mock) {
    const r = C.reel("news");
    mock.innerHTML =
      r.body +
      '<div class="caption"><div class="handle">@' + r.user + "</div><p>" + r.caption + "</p>" +
      '<div class="sound">' + icon("music") + "<span>original sound · " + r.user + "</span></div></div>" +
      fmtRail('<span class="mono">' + r.user[0].toUpperCase() + "</span>", r.avatarBg, r.counts) +
      '<div class="scrub"><i style="width:64%"></i></div>';
  }

  rebuild();
})();
