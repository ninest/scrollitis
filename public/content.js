// Feed content generator, shared by the game (script.js) and the story page.
// Reels are text posts in five styles (news, life, edit, take, learn), built from
// fill-in-the-blank templates. Ads are hand-written parodies.
//
// Class names here reach the DOM, so keep them clear of EasyList (see CLAUDE.md):
// the reel bodies use the `rk` prefix.
(() => {
  "use strict";

  // ---------- icons ----------
  // Lucide (ISC) v1.48.0 — https://lucide.dev
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
    "shopping-bag": '<path d="M16 10a4 4 0 0 1-8 0" /><path d="M3.103 6.034h17.794" /><path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z" />',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />',
    "smartphone": '<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />',
    "moon": '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
    "brain": '<path d="M12 18V5" /><path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" /><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" /><path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" /><path d="M18 18a4 4 0 0 0 2-7.464" /><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" /><path d="M6 18a4 4 0 0 1-2-7.464" /><path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />',
    "leaf": '<path d="M11 20a10 10 0 0010-10 25.9 25.9 0 00-1.04-7.281 1 1 0 00-1.755-.325C15.833 5.5 13 5.5 9.8 6.1A7 7 0 0011 20" /><path d="M2 21a5 5 0 012.911-4.544C7.613 15.212 8.351 15.24 11 13" />',
    "glasses": '<circle cx="6" cy="15" r="4" /><circle cx="18" cy="15" r="4" /><path d="M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" /><path d="M2.5 13 5 7c.7-1.3 1.4-2 3-2" /><path d="M21.5 13 19 7c-.7-1.3-1.5-2-3-2" />',
    "bot": '<path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />',
    "hourglass": '<path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />'
  };

  function icon(name, opts) {
    const o = opts || {};
    const paint = o.fill ? 'fill="currentColor" stroke="none"' : 'fill="none" stroke="currentColor"';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" ' + paint + ' stroke-width="' + (o.sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  // ---------- helpers ----------

  function rand(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Shuffle bag: every item comes up once before any repeats
  function bag(items) {
    let left = [];
    return () => {
      if (!left.length) left = items.slice().sort(() => Math.random() - 0.5);
      return left.pop();
    };
  }

  function weighted(entries) {
    const total = entries.reduce((s, e) => s + e[1], 0);
    let r = Math.random() * total;
    for (const e of entries) {
      if ((r -= e[1]) < 0) return e[0];
    }
    return entries[0][0];
  }

  // Log-uniform, so 40 likes is as likely as 400K or 4M
  function logRand(lo, hi) {
    return Math.round(Math.exp(Math.log(lo) + Math.random() * (Math.log(hi) - Math.log(lo))));
  }

  // TikTok style: 847, 4213, 12.4K, 3.1M
  function fmt(n) {
    if (n < 10000) return String(n);
    if (n < 1e6) return (n / 1e3).toFixed(n < 1e5 ? 1 : 0).replace(/\.0$/, "") + "K";
    return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }

  function counts(lo, hi) {
    const likes = logRand(lo, hi);
    return {
      likes: fmt(likes),
      comments: fmt(Math.round(likes * (0.004 + Math.random() * 0.06))),
      saves: fmt(Math.round(likes * (0.01 + Math.random() * 0.14)))
    };
  }

  // ---------- people ----------
  // Satire of public personas and this month's (lighter) news. No crimes, health,
  // or anything that reads like a believable accusation.

  const FIGURES = [
    {
      name: "Donald Trump", short: "Trump", w: 3,
      lines: [
        "Trump visits Gracie Mansion, asks if it comes in gold",
        "Trump's UN speech runs so long the next General Assembly starts during it",
        "Trump posts \"NOBODY DOES ASSEMBLIES LIKE ME\" at 3:12am",
        "Trump proposes a golf course on the UN Security Council floor",
        "Trump rates his own UN speech \"the best speech, maybe ever, many people are saying\""
      ]
    },
    {
      name: "Gavin Newsom", short: "Newsom", w: 3,
      lines: [
        "Newsom's press office posts in ALL CAPS again, blames the intern, the intern is also Newsom",
        "Gavin Newsom's hair survives Super El Niño storm, scientists baffled",
        "Newsom announces he is \"not thinking about 2028\" in a 45-minute video shot in Iowa",
        "Newsom podcast episode 214: \"Why I'm not thinking about 2028 (part 9)\"",
        "Newsom's last months in office include a farewell tour of every In-N-Out"
      ]
    },
    {
      name: "Abdul El‑Sayed", short: "El‑Sayed", w: 3,
      lines: [
        "Abdul El‑Sayed, an actual doctor, diagnoses Michigan with \"a mild case of November\"",
        "El‑Sayed wins primary, prescribes Michigan \"one coney dog, twice daily\"",
        "El‑Sayed asks the Senate if it has tried turning the filibuster off and on again",
        "El‑Sayed writes campaign platform on a prescription pad, no pharmacist can read it",
        "El‑Sayed vs Rogers debate paused so El‑Sayed can check a moderator's blood pressure"
      ]
    },
    {
      name: "Zohran Mamdani", short: "Mamdani", w: 3,
      lines: [
        "Mamdani hosts Trump at Gracie Mansion; both leave claiming they won the chat",
        "Mamdani takes the world's mayors on a bus tour; bus is free and on time, delegates weep",
        "Mamdani's \"pothole politics\" goes too far: fills the same pothole 11 times for content",
        "Mamdani posts subway selfie, 400 New Yorkers claim they're in the background",
        "Mamdani releases management report, New Yorkers read it on the train for fun"
      ]
    },
    {
      name: "Michelle Wu", short: "Wu", w: 3,
      lines: [
        "Michelle Wu declares snow emergency in September \"just to be safe\"",
        "Mayor Wu adds a bike lane through her own office, council divided",
        "Michelle Wu says \"wicked\" 14 times in one press conference, Boston approves",
        "Dunkin' names new drink after Michelle Wu's zoning reform, it's mostly ice",
        "Mayor Wu parallel parks in Back Bay on the first try, city declares holiday"
      ]
    },
    {
      name: "Justin Trudeau", short: "Trudeau", w: 3,
      lines: [
        "Justin Trudeau spotted at Fashion Week in socks with tiny maple leaves on them",
        "Trudeau reveals post-politics plan: \"socks, full time\"",
        "Trudeau apologizes to a door for holding it open too long",
        "Trudeau attends pop concert, knows every word, denies everything",
        "Trudeau's sock drawer gets its own Netflix documentary"
      ]
    },
    {
      name: "Elon Musk", short: "Musk", w: 2,
      lines: [
        "Elon Musk replies \"interesting\" to 40,000 posts before breakfast",
        "Musk promises full self-driving by next year, for the 11th year in a row",
        "Musk renames Tuesday \"X-day\", nobody notices it's Wednesday",
        "Musk announces Mars colony will have a Cybertruck-only parking lot"
      ]
    },
    {
      name: "Taylor Swift", short: "Taylor", w: 2,
      lines: [
        "Swifties decode 13 hidden messages in Taylor Swift's grocery receipt",
        "Taylor Swift announces Taylor's Version of Taylor's Version",
        "Fashion Week guests report Taylor Swift \"might have walked past, we think\""
      ]
    },
    {
      name: "Emmanuel Macron", short: "Macron", w: 1,
      lines: [
        "Macron shrugs so hard at the UN it shows up on seismographs",
        "Macron bows out of a UN photo because the lighting \"is not giving\""
      ]
    },
    {
      name: "António Guterres", short: "Guterres", w: 1,
      lines: [
        "Guterres leaves final General Assembly with 41,000 unread emails",
        "Guterres' goodbye note on the UN podium just says \"please be nice\""
      ]
    },
    {
      name: "Mark Zuckerberg", short: "Zuck", w: 1,
      lines: [
        "Zuckerberg wakeboards into a Senate hearing holding a flag",
        "Zuckerberg confirms the metaverse was \"a Tuesday thing\""
      ]
    },
    {
      name: "Barack Obama", short: "Obama", w: 1,
      lines: [
        "Obama drops summer playlist in late September: \"it's summer somewhere\"",
        "Obama's summer playlist leaks, contains 4 songs from this app"
      ]
    },
    {
      name: "MrBeast", short: "MrBeast", w: 1,
      lines: [
        "MrBeast offers $1M to whoever stops scrolling first, nobody claims it",
        "MrBeast buys every Roomba in Ohio, sets them loose, calls it content"
      ]
    }
  ];

  const EVENTS = [
    "the UN General Assembly", "Fashion Week", "a midterm rally", "a Senate hearing",
    "a 6am press conference", "a town hall", "a Gracie Mansion dinner", "a debate prep session",
    "a Boston snow day briefing", "the World Cup afterparty"
  ];

  // Works for anyone. Written to avoid pronouns.
  const DOES = [
    "caught doomscrolling during {event}",
    "admits to never once reading the terms and conditions",
    "starts a podcast about starting a podcast",
    "blames Super El Niño for being late to {event}",
    "announces a break from social media in a 14-slide post",
    "launches a memecoin, worth $0.0003 by lunch",
    "spotted asking a Roomba for directions after {event}",
    "goes live for 6 hours; 4 of them are \"can you guys hear me?\"",
    "reacts to own clip from {event}, gives it a 6/10",
    "gets the BeReal notification in the middle of {event}",
    "loses 45 minutes to a video about how bridges are made",
    "has, in fact, seen your story",
    "tries to close an ad, taps it by accident, now owns 3 hoodies"
  ];

  const pickFigure = () => weighted(FIGURES.map((f) => [f, f.w]));
  const fill = (s) => s.replace("{event}", pick(EVENTS));

  function headline() {
    const f = pickFigure();
    // Mostly the figure's own lines, sometimes a mad-lib
    return Math.random() < 0.65 ? pick(f.lines) : f.name + " " + fill(pick(DOES));
  }

  // ---------- reel kinds ----------

  const HANDLES = {
    news: ["news.but.faster", "daily.brainrot.times", "breaking.not.really", "the.scroll.report", "headlines.4.u"],
    life: ["maya.eats", "nightowl.nina", "plantdad.leo", "sad.lofi.cat", "zoe.travels", "cozy.corner", "deskchef", "bookish.bea"],
    edit: ["edits.by.kay", "4k.aura.edits", "velocity.vibes", "slowmo.stan", "mo.edits"],
    take: ["chaos.kitchen", "hot.take.hank", "the.fit.check", "dev.after.dark", "8bit.ben", "unfiltered.ivy"],
    learn: ["learn.with.lin", "mr.facts", "the.more.you.know", "brain.snacks", "prof.scroll"]
  };

  const CAPTIONS = {
    news: ["this can't be real 😭", "sources: trust me", "the timeline is cooked", "commenting before this gets taken down", "no way this is real", "wait for the end"],
    life: ["why is this my life", "anyway", "not me posting this", "be honest", "am i the only one", "it's fine. everything's fine"],
    edit: ["edit by me dont repost", "this took 9 hours", "the transition at 0:07", "sound on 🔊", "who else is obsessed"],
    take: ["fight me in the comments", "i said what i said", "no because why is this so true", "wrong answers only", "ratio me i dare you"],
    learn: ["follow for part {next}", "save this for later", "your teacher lied to you", "the more you know", "part {next} tomorrow"]
  };

  const TAGS = {
    news: ["#breaking", "#news", "#politics", "#fyp"],
    life: ["#relatable", "#storytime", "#2am", "#fyp"],
    edit: ["#edit", "#aura", "#fyp", "#viral"],
    take: ["#hottake", "#unpopularopinion", "#pov", "#fyp"],
    learn: ["#learnontiktok", "#facts", "#didyouknow", "#fyp"]
  };

  const AVATAR_COLORS = ["#ff9f43", "#5f27cd", "#10ac84", "#ee5253", "#2e86de", "#f368e0", "#01a3a4", "#222f3e"];

  // Backgrounds per kind
  const BG = {
    life: [
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
      "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    ],
    // Dark enough for white text, so the caption stays readable
    take: ["#fe2c55", "#7b2ff7", "#0a58ff", "#e8590c", "#141414", "#0b8a5a", "#c2185b"],
    glow: ["#ff3df2", "#25f4ee", "#ffd60a", "#ff4d4d", "#7cff6b", "#8b7bff"],
    box: ["#fe2c55", "#111", "#7b2ff7", "#0a58ff", "#ff6b1a"],
    pattern: [
      "",
      "",
      "radial-gradient(rgba(255, 255, 255, 0.16) 1.5px, transparent 1.6px) 0 0 / 14px 14px",
      "repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0 14px, transparent 14px 28px)"
    ]
  };

  const nextHeadline = (() => {
    const seen = [];
    return () => {
      let h;
      for (let i = 0; i < 6; i++) {
        h = headline();
        if (!seen.includes(h)) break;
      }
      seen.push(h);
      if (seen.length > 30) seen.shift();
      return h;
    };
  })();

  // Life updates
  const HABITS = [
    "asking my landlord to fix the sink", "trying to delete this app", "pretending i understand the stock market",
    "waking up at 5am (it's 11:40am)", "learning french from duolingo notifications only", "not checking my screen time",
    "telling myself this is the last reel", "saying \"i'll start monday\""
  ];
  const UPDATES = [
    "my sourdough starter has a boyfriend now", "i said \"you too\" when the waiter said enjoy your meal",
    "my plant i talk to every day has died. i've been talking to a fake plant",
    "i waved back at someone who was waving at the person behind me. i live here now",
    "my group chat made a second group chat without me", "my screen time went up 212% and i feel great",
    "i opened the fridge 6 times. nothing new appeared", "my mom commented \"who is this\" on my post"
  ];
  const ADVICE = ["stop doomscrolling", "go outside more", "set boundaries", "put the phone down before bed"];
  const AFTER = ["here's my 40th reel of the night", "my screen time is 9h 42m", "i'm watching this in the bath", "it's 3:47am"];
  const NOBODY = [
    ["nobody:", "me at 3am:", "watching a 40 minute video about how bridges are made"],
    ["nobody:", "me in the shower:", "winning an argument from 2019"],
    ["nobody:", "my brain at 2am:", "remember that thing you said in 6th grade?"],
    ["nobody:", "me, every night:", "\"ok last one\""]
  ];

  const LIFE = bag([
    () => ["day " + rand(3, 212) + " of", pick(HABITS)],
    () => ["update:", pick(UPDATES)],
    () => ["my therapist said to " + pick(ADVICE) + ".", "anyway " + pick(AFTER)],
    () => pick(NOBODY),
    () => ["me: i'll sleep early tonight", "also me at " + rand(1, 4) + ":" + rand(10, 59) + "am:", "reading about the " + pick(["roman empire", "titanic", "deep sea", "midterms"])]
  ]);

  // Edits
  const EDIT_OTHERS = ["the Duolingo owl", "Shrek", "a Boston goose", "the Roomba from my building", "Mr. Krabs"];
  const EDIT_SUBS = ["(sped up)", "4K 60fps", "slow-mo walk-in", "ft. villain music", "no thoughts just aura", "(reverb)"];

  function editSubject() {
    return Math.random() < 0.8 ? pickFigure().name : pick(EDIT_OTHERS);
  }

  const EDIT = bag([
    () => ["", editSubject() + " edit", pick(EDIT_SUBS)],
    () => ["nobody:", editSubject(), "at " + pick(EVENTS) + ":"],
    () => ["", editSubject(), "aura +" + pick(["1000", "9999", "∞", "4000"])],
    () => ["POV:", editSubject(), "walking into " + pick(EVENTS)],
    () => ["", editSubject() + " edit", "but it's " + pick(["sped up", "in slow-mo", "to Bach", "with rain sounds"])]
  ]);

  // Hot takes and POV
  const TAKES = [
    "cereal is a soup", "pineapple on pizza is fine and you know it", "airports are the best part of the trip",
    "voice notes over 30 seconds should be illegal", "the middle seat gets both armrests", "brunch is just lunch with a markup",
    "a hot dog is a taco", "the ad is the best part of the feed", "reply-all should require a license",
    "the midterms need a halftime show", "Canadian politeness is just passive aggression with better PR"
  ];
  const POVS = [
    "you said \"one more reel\" 47 reels ago", "you're the ad everyone skips", "your screen time report just came in",
    "you're a Canadian and someone bumped into you", "you're the intern who writes Newsom's posts",
    "you're the UN interpreter for Trump's speech", "your mom learned how to use this app"
  ];
  const TMY = ["chronically online", "from Boston", "from Michigan", "a New Yorker", "Canadian", "in your flop era"];

  const TAKE = bag([
    () => ["unpopular opinion:", pick(TAKES)],
    () => ["POV:", pick(POVS)],
    () => {
      const x = pick(TMY);
      return ["tell me you're " + x, "without telling me you're " + x];
    },
    () => ["hot take:", pick(TAKES)],
    () => ["red flag:", pick(["they clap when the plane lands", "they don't close ads", "they watch reels with the sound on in public", "they say \"let me google that\" and open this app"])]
  ]);

  // Learning content. The facts are real; the format is the joke.
  const FACTS = [
    "Octopuses have three hearts", "Honey never goes off, even after 3,000 years", "Bananas are berries. Strawberries aren't",
    "A day on Venus is longer than its year", "Wombat poop is cube-shaped", "Sharks are older than trees",
    "The Eiffel Tower grows about 15cm in summer", "Oxford University is older than the Aztec Empire",
    "Cleopatra lived closer to the Moon landing than to the Great Pyramid", "Scotland's national animal is the unicorn",
    "A group of flamingos is called a flamboyance", "The # symbol is called an octothorpe",
    "Nintendo started in 1889 selling playing cards", "The arrow by your fuel gauge shows which side the tank is on",
    "Boston had a molasses flood in 1919", "Canada has more lakes than the rest of the world combined"
  ];
  const nextFact = bag(FACTS);

  const LEARN = bag([
    () => ({ title: "things school never taught you", list: [nextFact(), nextFact(), nextFact()] }),
    () => ({ title: "did you know?", fact: nextFact() }),
    () => ({ title: "i was today years old when i learned", fact: nextFact().replace(/^\w/, (c) => c.toLowerCase()) }),
    () => ({ title: "facts that sound fake but aren't", list: [nextFact(), nextFact()] })
  ]);

  function lines(arr, cls) {
    return arr.filter(Boolean).map((l) => '<div><span class="' + cls + '">' + l + "</span></div>").join("");
  }

  // ---------- looks ----------
  // Each kind has a few variants (rkv-*), plus random tilt, position and alignment,
  // so two reels of the same kind rarely look alike.

  function tilt(max) {
    return (Math.random() < 0.35 ? 0 : (Math.random() * 2 - 1) * max).toFixed(1) + "deg";
  }

  const POS = ["flex-start", "center", "center", "flex-end"];
  const ALIGN = [["left", "flex-start"], ["center", "center"], ["right", "flex-end"]];

  function rk(kind, variant, style, inner, outer) {
    return (
      '<div class="rk rk-' + kind + " rkv-" + variant + '"' +
      (style ? ' style="' + style + '"' : "") + ">" +
      (outer || "") +
      '<div class="rk-in">' + inner + "</div></div>"
    );
  }

  const NEWS_TAGS = ["BREAKING", "JUST IN", "DEVELOPING", "BREAKING NEWS"];
  const NEWS_SOURCES = ["unconfirmed", "sources say", "exclusive", "via a group chat"];

  // A reel is a recording, so it's stamped with a fixed recent date, not "5 min ago".
  // Dates fall in the two weeks before this day; move it forward when the headlines change.
  const NEWS_DAY = new Date(2026, 8, 24);
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function stamp() {
    const d = new Date(NEWS_DAY);
    d.setDate(d.getDate() - rand(0, 13));
    const time = rand(1, 12) + ":" + String(rand(0, 59)).padStart(2, "0") + " " + pick(["AM", "PM"]);
    return { date: MONTHS[d.getMonth()] + " " + d.getDate(), time };
  }

  const KINDS = {
    news() {
      const v = pick(["red", "chyron", "tabloid", "alert"]);
      const main = nextHeadline();
      const tag = pick(NEWS_TAGS);
      const when = stamp();

      if (v === "alert") {
        // A push notification on a lock screen
        const clock = '<div class="rkn-clock"><small>' + when.date + "</small>" + when.time.split(" ")[0] + "</div>";
        return {
          body: rk("news", v, "", '<div class="rkn-note"><div class="rkn-app"><i>N</i>NEWS<span>' + when.time + "</span></div><b>" + tag + '</b><div class="rkn-head">' + main + "</div></div>", clock)
        };
      }

      // The LIVE bar scrolls like a real ticker; the text is doubled so the loop is seamless
      const belt = [nextHeadline(), nextHeadline(), nextHeadline()].join(" \u2022 ") + " \u2022 ";
      const ticker = '<div class="rkn-ticker"><b>LIVE</b><div class="rkn-belt"><span>' + belt + '</span><span aria-hidden="true">' + belt + "</span></div></div>";
      return {
        body: rk(
          "news", v, "--rot:" + tilt(6),
          '<div class="rkn-box">' +
          '<div class="rkn-tag">' + tag + "</div>" +
          '<div class="rkn-head">' + main + "</div>" +
          '<div class="rkn-meta">' + when.date + ", " + when.time + " \u00b7 " + pick(NEWS_SOURCES) + "</div>" +
          "</div>",
          ticker
        )
      };
    },
    life() {
      const [ta, ai] = pick(ALIGN);
      const style =
        "background:" + pick(BG.life) + ";--rot:" + tilt(5) + ";--pos:" + pick(POS) +
        ";--ta:" + ta + ";--ai:" + ai + ";--box:" + pick(BG.box);
      return { body: rk("life", pick(["white", "white", "black", "color", "plain"]), style, lines(LIFE()(), "rk-box")) };
    },
    edit() {
      const v = pick(["glow", "glitch", "outline", "vhs"]);
      const [top, big, sub] = EDIT()();
      const bigHtml = v === "outline"
        ? '<div class="rke-big rke-ghost">' + big + '</div><div class="rke-big">' + big + '</div><div class="rke-big rke-ghost">' + big + "</div>"
        : '<div class="rke-big">' + big + "</div>";
      const vhs = v === "vhs"
        ? '<div class="rke-rec">\u25cf REC</div><div class="rke-tc">00:0' + rand(0, 9) + ":" + String(rand(0, 59)).padStart(2, "0") + "</div>"
        : "";
      return {
        body: rk(
          "edit", v, "--glow:" + pick(BG.glow) + ";--rot:" + tilt(5),
          (top ? '<div class="rke-top">' + top + "</div>" : "") + bigHtml + '<div class="rke-sub">' + sub + "</div>",
          vhs
        )
      };
    },
    take() {
      const v = pick(["left", "quote", "sticker", "stack"]);
      const [label, text] = TAKE()();
      const pat = pick(BG.pattern);
      const style = "background:" + (pat ? pat + ", " : "") + pick(BG.take) + ";--rot:" + tilt(7) + ";--pos:" + pick(POS);
      return {
        body: rk(
          "take", v, style,
          '<div class="rkt-label">' + label + "</div>" + '<div class="rkt-text">' + text + "</div>",
          v === "quote" ? '<div class="rkt-q">\u201c</div>' : ""
        )
      };
    },
    learn() {
      const v = pick(["chalk", "slate", "blueprint", "notebook", "sticky"]);
      const l = LEARN()();
      const part = rand(2, 94);
      return {
        part,
        body: rk(
          "learn", v, "--rot:" + tilt(4),
          '<div class="rkl-card">' +
          '<div class="rkl-part">part ' + part + "</div>" +
          '<div class="rkl-title">' + l.title + "</div>" +
          (l.list
            ? "<ol>" + l.list.map((f) => "<li>" + f + "</li>").join("") + "</ol>"
            : '<div class="rkl-fact">' + l.fact + "</div>") +
          "</div>"
        )
      };
    }
  };

  const KIND_WEIGHTS = [["news", 30], ["life", 20], ["edit", 15], ["take", 20], ["learn", 15]];
  let lastKind = "";

  // A reel: { kind, user, avatarBg, body (HTML for inside the card), caption, counts }
  function reel(kind) {
    let k = kind;
    if (!k) {
      do k = weighted(KIND_WEIGHTS); while (k === lastKind && Math.random() < 0.7);
    }
    lastKind = k;
    const r = KINDS[k]();
    const next = (r.part || 1) + 1;
    return {
      kind: k,
      user: pick(HANDLES[k]),
      avatarBg: pick(AVATAR_COLORS),
      body: r.body,
      caption: pick(CAPTIONS[k]).replace("{next}", next) + " <b>" + pick(TAGS[k]) + "</b>",
      counts: counts(8, 4e6)
    };
  }

  // ---------- ads ----------
  // Parodies of the attention economy. Hardcoded on purpose.

  const PITCHES = [
    { icon: "shield", brand: "ScrollGuard", title: "Blocks every app. Unblock for $4.99/week.", cta: "Protect me", bg: "#1f2a3a" },
    { icon: "coffee", brand: "Sipstream", title: "Wake up without the doom", cta: "Order now", bg: "#3a2c1e" },
    { icon: "shopping-bag", brand: "Dopamine Direct", title: "Serotonin, delivered in 20 minutes", cta: "Order now", bg: "#33223a" },
    { icon: "smartphone", brand: "Duophone", title: "Two screens. So you can scroll while you scroll.", cta: "Pre-order", bg: "#2a2e33" },
    { icon: "dumbbell", brand: "ThumbGym", title: "Your scroll thumb deserves leg day", cta: "Start free", bg: "#22301f" },
    { icon: "glasses", brand: "Nightshade", title: "Blue-light glasses, for 4am specifically", cta: "Shop now", bg: "#2e2a3a" },
    { icon: "watch", brand: "Kronos", title: "Tells you how long you've been scrolling. Judges you.", cta: "Shop now", bg: "#2a2430" },
    { icon: "bot", brand: "Replybot", title: "An AI that texts your friends back for you", cta: "Get the app", bg: "#1f2a3a" },
    { icon: "shirt", brand: "Threadlab", title: "The hoodie with a phone pocket in the hood", cta: "Shop now", bg: "#3a2c1e" },
    { icon: "leaf", brand: "Touchgrass", title: "Real grass, delivered. $39 per square foot.", cta: "Order now", bg: "#22301f" },
    { icon: "brain", brand: "Brainrot Academy", title: "Learn a language in 7-second clips", cta: "Start free", bg: "#33223a" },
    { icon: "moon", brand: "Snoozr", title: "The sleep app you'll check at 3am", cta: "Get the app", bg: "#2e2a3a" },
    { icon: "hourglass", brand: "Screen Time+", title: "See your screen time. In more detail. For longer.", cta: "Try it free", bg: "#2a2e33" },
    { icon: "camera", brand: "Lumina", title: "Make your feed jealous", cta: "Get the app", bg: "#2a2430" }
  ];

  const nextPitch = bag(PITCHES);

  function darken(hex) {
    return "linear-gradient(160deg, " + hex + " 0%, #0d0b10 100%)";
  }

  // An ad: { icon, brand, title, cta, bg, counts }. Ads get fewer likes.
  function pitch() {
    const p = nextPitch();
    return Object.assign({}, p, { bg: darken(p.bg), counts: counts(3, 60000) });
  }

  window.ScrollitisContent = { icon, reel, pitch, fmt, kinds: KIND_WEIGHTS.map((k) => k[0]), pitches: PITCHES, figures: FIGURES };
})();
