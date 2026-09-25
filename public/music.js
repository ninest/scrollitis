// Feed music: every reel loops its own synthesized track (Web Audio, no files).
// Shared by the game (script.js) and the story page (story/sounds.js).
(() => {
  "use strict";

  // ---------- engine ----------

  let ctx = null;
  let master = null;
  let duckNode = null;
  let reverbIn = null;
  let noiseBuf = null;
  let volume = 0.7;
  let cur = null;
  let timer = null;
  const curves = {};

  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();

      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -16;
      comp.knee.value = 10;
      comp.ratio.value = 4;
      comp.attack.value = 0.004;
      comp.release.value = 0.2;

      master = ctx.createGain();
      master.gain.value = volume;
      master.connect(comp);
      comp.connect(ctx.destination);

      // Every track (and the reverb) goes through here, so a swipe can pull the music down.
      duckNode = ctx.createGain();
      duckNode.connect(master);

      const conv = ctx.createConvolver();
      conv.buffer = impulse(2.6);
      reverbIn = ctx.createGain();
      reverbIn.connect(conv);
      conv.connect(duckNode);

      noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === "suspended") ctx.resume();
  }

  function impulse(sec) {
    const len = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3) * 0.5;
    }
    return buf;
  }

  function curve(amt) {
    if (!curves[amt]) {
      const n = 1024;
      const c = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const x = (i / (n - 1)) * 2 - 1;
        c[i] = Math.tanh(x * amt) / Math.tanh(amt);
      }
      curves[amt] = c;
    }
    return curves[amt];
  }

  // One oscillator voice. Plucked (decays over d) unless hold, which sustains for d then releases over r.
  function tone(out, t, o) {
    const a = o.a ?? 0.004;
    const d = o.d ?? 0.2;
    const r = o.r ?? 0.08;
    const peak = o.gain ?? 0.2;
    const end = o.hold ? t + a + d + r : t + a + d;

    const osc = ctx.createOscillator();
    osc.type = o.type || "sine";
    if (o.from) {
      osc.frequency.setValueAtTime(o.from, t);
      osc.frequency.exponentialRampToValueAtTime(o.f, t + (o.glide || 0.05));
    } else {
      osc.frequency.setValueAtTime(o.f, t);
    }
    if (o.detune) osc.detune.setValueAtTime(o.detune, t);

    if (o.vib) {
      const lfo = ctx.createOscillator();
      const depth = ctx.createGain();
      lfo.frequency.value = o.vib[0];
      depth.gain.value = o.f * o.vib[1];
      lfo.connect(depth);
      depth.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(end + 0.02);
    }

    let node = osc;
    if (o.drive) {
      const ws = ctx.createWaveShaper();
      ws.curve = curve(o.drive);
      node.connect(ws);
      node = ws;
    }
    if (o.lp) {
      const bq = ctx.createBiquadFilter();
      bq.type = o.ft || "lowpass";
      bq.frequency.value = o.lp;
      bq.Q.value = o.q || 0.7;
      node.connect(bq);
      node = bq;
    }

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    if (o.hold) {
      g.gain.setValueAtTime(peak, t + a + d);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
    } else {
      g.gain.exponentialRampToValueAtTime(0.0001, end);
    }
    node.connect(g);
    g.connect(out);
    osc.start(t);
    osc.stop(end + 0.02);
  }

  function noise(out, t, o) {
    const a = o.a ?? 0.001;
    const d = o.d ?? 0.1;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const bq = ctx.createBiquadFilter();
    bq.type = o.ft || "highpass";
    bq.frequency.value = o.f || 1000;
    bq.Q.value = o.q || 0.7;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(o.gain ?? 0.1, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
    src.connect(bq);
    bq.connect(g);
    g.connect(out);
    src.start(t, Math.random() * 0.5);
    src.stop(t + a + d + 0.02);
  }

  // ---------- instruments ----------

  function kick(out, t, o) {
    const p = o || {};
    const gain = p.gain ?? 0.9;
    tone(out, t, { f: p.to || 45, from: p.from || 160, glide: 0.09, d: p.d || 0.38, gain, drive: p.drive });
    noise(out, t, { f: 3000, d: 0.012, gain: gain * 0.25 });
  }

  function snare(out, t, gain) {
    const g = gain ?? 0.3;
    noise(out, t, { ft: "bandpass", f: 1900, q: 0.6, d: 0.16, gain: g });
    tone(out, t, { type: "triangle", f: 170, from: 240, glide: 0.04, d: 0.1, gain: g * 0.8 });
  }

  function clap(out, t, gain) {
    const g = gain ?? 0.3;
    for (let i = 0; i < 3; i++) {
      noise(out, t + i * 0.011, { ft: "bandpass", f: 1200, q: 1.1, d: i < 2 ? 0.015 : 0.16, gain: g });
    }
  }

  function hat(out, t, gain, open) {
    noise(out, t, { f: 7500, d: open ? 0.22 : 0.035, gain: gain ?? 0.06 });
  }

  function bass808(out, t, m, len, o) {
    const p = o || {};
    tone(out, t, {
      f: mtof(m), from: p.from ? mtof(p.from) : undefined, glide: p.glide || 0.08,
      hold: true, d: len, r: 0.12, gain: p.gain ?? 0.5, drive: p.drive ?? 2.5, lp: 900
    });
  }

  function cowbell(out, t, m, gain) {
    const f = mtof(m);
    [1, 1.48].forEach((k) => {
      tone(out, t, { type: "square", f: f * k, d: 0.26, gain: gain ?? 0.1, lp: f * 2.2, ft: "bandpass", q: 2.5 });
    });
  }

  function piano(out, t, m, d, gain) {
    const f = mtof(m);
    const g = gain ?? 0.16;
    tone(out, t, { type: "triangle", f, d: d ?? 1.2, gain: g, lp: 2600 });
    tone(out, t, { f: f * 2, d: (d ?? 1.2) * 0.4, gain: g * 0.35 });
    tone(out, t, { f: f * 3, d: 0.08, gain: g * 0.12 });
  }

  function keys(out, t, m, d, gain) {
    const f = mtof(m);
    const g = gain ?? 0.08;
    tone(out, t, { f, a: 0.01, d, gain: g, vib: [4.5, 0.003] });
    tone(out, t, { f: f * 4, d: 0.22, gain: g * 0.22 });
  }

  function pad(out, t, m, len, gain) {
    [-9, 9].forEach((dt) => {
      tone(out, t, { type: "sawtooth", f: mtof(m), detune: dt, a: 0.35, hold: true, d: len, r: 0.9, gain: gain ?? 0.04, lp: 1400 });
    });
  }

  function bell(out, t, m, gain) {
    const f = mtof(m);
    const g = gain ?? 0.07;
    tone(out, t, { f, d: 1.3, gain: g });
    tone(out, t, { f: f * 2.76, d: 0.4, gain: g * 0.25 });
  }

  function marimba(out, t, m, gain) {
    const f = mtof(m);
    const g = gain ?? 0.18;
    tone(out, t, { f, d: 0.35, gain: g });
    tone(out, t, { f: f * 4, d: 0.05, gain: g * 0.3 });
  }

  function logdrum(out, t, m, gain, len) {
    const f = mtof(m);
    const g = gain ?? 0.5;
    tone(out, t, { f, from: f * 2.2, glide: 0.035, d: len ?? 0.4, gain: g, drive: 1.8, lp: 1400 });
    tone(out, t, { type: "triangle", f: f * 2, d: 0.06, gain: g * 0.3 });
  }

  // Struck metal: inharmonic sine partials (like a pipe or anvil) plus a click.
  function metal(out, t, m, gain) {
    const f = mtof(m);
    const g = gain ?? 0.1;
    [[1, 1, 0.9], [2.76, 0.5, 0.45], [5.4, 0.28, 0.22], [8.93, 0.14, 0.12]].forEach((p) => {
      tone(out, t, { f: f * p[0], d: p[2], gain: g * p[1] });
    });
    noise(out, t, { ft: "bandpass", f: f * 3, q: 3, d: 0.02, gain: g * 0.6 });
  }

  function squeak(out, t, gain) {
    tone(out, t, { f: 2600, from: 1500, glide: 0.07, d: 0.09, gain: gain ?? 0.05 });
  }

  function crackle(out, t, sx, p) {
    if (Math.random() < p) {
      noise(out, t + Math.random() * sx, { f: 2500, d: 0.004 + Math.random() * 0.006, gain: 0.02 + Math.random() * 0.05 });
    }
  }

  // Events for bar b of a pattern like [[step, midi, len], ...] that start at step i.
  const at = (pattern, b, i) => (pattern[b] || []).filter((n) => n[0] === i);

  // ---------- tracks ----------

  const PIXEL_MEL = [
    [[0, 76, 3], [3, 76, 3], [6, 79, 2], [8, 81, 4], [12, 79, 2], [14, 76, 2]],
    [[0, 77, 3], [3, 77, 3], [6, 76, 2], [8, 72, 6], [14, 74, 2]],
    [[0, 76, 3], [3, 76, 3], [6, 79, 2], [8, 84, 4], [12, 83, 2], [14, 79, 2]],
    [[0, 79, 3], [3, 79, 3], [6, 81, 2], [8, 83, 6], [14, 79, 2]]
  ];

  // Bach, Prelude in C major BWV 846, bars 1–8 (public domain)
  const BACH = [
    [60, 64, 67, 72, 76], [60, 62, 69, 74, 77], [59, 62, 67, 74, 77], [60, 64, 67, 72, 76],
    [60, 64, 69, 76, 81], [60, 62, 66, 69, 74], [59, 62, 67, 74, 79], [59, 60, 64, 67, 72]
  ];

  const PHONK_BELL = [
    [73, 0, 73, 0, 76, 0, 73, 0, 80, 0, 78, 0, 76, 0, 73, 71],
    [73, 0, 73, 0, 76, 0, 73, 0, 71, 0, 73, 0, 68, 0, 71, 0]
  ];

  const LOFI_CHORDS = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];
  const LOFI_MEL = [
    [[6, 72], [8, 69], [11, 67], [14, 64]],
    [[6, 71], [8, 67], [12, 62]],
    [[6, 69], [8, 65], [11, 64], [14, 62]],
    [[4, 64], [8, 67], [12, 71]]
  ];

  const FUNK_WHISTLE = [
    [[0, 76, 3], [4, 79, 2], [6, 76, 2], [8, 74, 4], [12, 71, 3]],
    [[0, 76, 3], [4, 79, 2], [6, 81, 2], [8, 79, 6]]
  ];

  const AMA_LOG = [
    [[3, 38], [6, 38], [8, 45], [11, 38], [14, 43]],
    [[3, 38], [6, 41], [10, 45], [12, 43], [14, 41]]
  ];

  const SLOW_CHORDS = [[56, 60, 63, 67], [53, 56, 60, 63], [49, 53, 56, 60], [51, 55, 58, 62]];
  const SLOW_MEL = [
    [[0, 75], [6, 72], [8, 75], [12, 79]],
    [[0, 77], [6, 75], [8, 72]],
    [[0, 72], [4, 68], [8, 72], [12, 75]],
    [[0, 70], [6, 67], [8, 70], [12, 74]]
  ];

  const JINGLE_CHORDS = [[60, [0, 4, 7, 12]], [55, [0, 4, 7, 12]], [57, [0, 3, 7, 12]], [53, [0, 4, 7, 12]]];
  const JINGLE_HOOK = [[[0, 84], [2, 84], [4, 88], [6, 86], [10, 84]], [], [[0, 84], [2, 84], [4, 88], [6, 91], [10, 88]], []];

  // missouri: three metal hits, three metal hits (steps 0-2-4, 8-10-12), per 4-bar phrase
  const MISSOURI_METAL = [
    [[81, 81, 81], [79, 79, 79]],
    [[81, 81, 81], [84, 83, 79]],
    [[77, 77, 77], [76, 76, 76]],
    [[76, 79, 81], [83, 84, 86]]
  ];
  const MISSOURI_LEAD = [
    [[5, 76, 1], [6, 74, 2], [13, 72, 1], [14, 71, 2]],
    [[5, 76, 1], [6, 77, 2], [13, 79, 3]],
    [[5, 72, 1], [6, 69, 2], [13, 72, 1], [14, 74, 2]],
    []
  ];

  const TRACKS = [
    {
      name: "pixel rush", artist: "8bit.ben", genre: "8-bit EDM", bpm: 128, level: 1.3, verb: 0.12,
      note: "Chiptune square-wave hook and arpeggio over a four-on-the-floor kick. The pixel-EDM sound from gaming edits and \"POV: main character\" clips.",
      user: "8bit.ben", avatar: "#5f27cd", bg: "linear-gradient(160deg, #2b1055 0%, #7597de 100%)",
      text: ["POV: you beat the final boss", "at 4am on a school night"], caption: "the pixel era is back <b>#gaming #8bit</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 4;
        const root = [45, 41, 48, 43][bar];
        const chord = [0, bar === 0 ? 3 : 4, 7, 12];
        if (i % 4 === 0) kick(o, t, { gain: 0.85 });
        if (i === 4 || i === 12) noise(o, t, { ft: "bandpass", f: 2500, q: 0.5, d: 0.12, gain: 0.22 });
        if (i % 4 === 2) hat(o, t, 0.05);
        if (i % 2 === 0) tone(o, t, { type: "triangle", f: mtof(root + (i % 4 ? 12 : 0)), d: sx * 1.7, gain: 0.32 });
        tone(o, t, { type: "square", f: mtof(root + 24 + chord[[0, 1, 2, 3, 2, 1, 0, 1][i % 8]]), d: sx * 0.8, gain: 0.035, lp: 3500 });
        at(PIXEL_MEL, bar, i).forEach((n) => {
          tone(o, t, { type: "square", f: mtof(n[1]), hold: true, d: n[2] * sx * 0.85, r: 0.04, gain: 0.07, lp: 5000, vib: [6, 0.004] });
        });
      }
    },
    {
      name: "Prelude in C Major, BWV 846", artist: "J.S. Bach", genre: "Classical piano", bpm: 66, level: 1.7, verb: 0.35,
      note: "The real Bach prelude (public domain), first 8 bars on a soft piano with room reverb. For the #studytok and \"dark academia\" posts.",
      user: "bookish.bea", avatar: "#10ac84", bg: "linear-gradient(160deg, #b8a58a 0%, #5b4b3d 100%)",
      text: ["study with me", "3 hours · no breaks"], caption: "classical music makes you smarter (source: trust me) <b>#studytok</b>",
      step(s, t, o) {
        const i = s % 16;
        const chord = BACH[Math.floor(s / 16) % 8];
        const k = [0, 1, 2, 3, 4, 2, 3, 4][i % 8];
        piano(o, t + Math.random() * 0.008, chord[k], k === 0 ? 2.6 : k === 1 ? 2 : 1.1, k < 2 ? 0.16 : 0.12);
      }
    },
    {
      name: "NOCHE DRIFT", artist: "VXLTAGE", genre: "Drift phonk", bpm: 130, level: 0.6, verb: 0.1,
      note: "Cowbell riff, distorted 808s that slide, clap on 2 and 4, hi-hat rolls. The sound of every car edit and gym-transformation video.",
      user: "skate.theo", avatar: "#ee5253", bg: "linear-gradient(160deg, #161616 0%, #5a0f1c 100%)",
      text: ["car edit but it's my", "2009 honda civic"], caption: "she's not fast but she's loud <b>#phonk #caredit</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 2;
        const kicks = bar ? [0, 3, 6, 10, 13] : [0, 3, 6, 10];
        if (kicks.includes(i)) {
          kick(o, t, { gain: 0.9, drive: 1.5 });
          const slide = bar === 1 && i === 10;
          bass808(o, t, slide ? 44 : 37, sx * 2.4, { from: slide ? 37 : undefined, glide: 0.12, drive: 3 });
        }
        if (i === 4 || i === 12) clap(o, t, 0.32);
        if (bar === 1 && i >= 12) hat(o, t, 0.05);
        else if (i % 2 === 0) hat(o, t, 0.05);
        const m = PHONK_BELL[bar][i];
        if (m) cowbell(o, t, m, 0.09);
      }
    },
    {
      name: "rainy window", artist: "sad.lofi.cat", genre: "Lo-fi hip hop", bpm: 78, level: 0.85, swing: 0.22, verb: 0.25, lp: 3200,
      note: "Warm maj7 electric piano chords, a lazy swung beat and vinyl crackle, muffled on purpose. The late-night, rain-on-the-window vibe.",
      user: "sad.lofi.cat", avatar: "#2e86de", bg: "linear-gradient(160deg, #355c7d 0%, #6c5b7b 100%)",
      text: ["3am and the rain", "won't stop"], caption: "lofi beats to doomscroll to <b>#lofi #cozy</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 4;
        const chord = LOFI_CHORDS[bar];
        if (i === 0) chord.forEach((m) => keys(o, t + Math.random() * 0.02, m, sx * 14, 0.07));
        if (i === 7) chord.slice(1).forEach((m) => keys(o, t, m, sx * 6, 0.035));
        if (i === 0 || i === 10) tone(o, t, { f: mtof(chord[0] - 12), hold: true, d: sx * 5, r: 0.1, gain: 0.3 });
        if (i === 0 || i === 10 || (i === 7 && bar % 2)) kick(o, t, { gain: 0.7, d: 0.3 });
        if (i === 4 || i === 12) snare(o, t, 0.2);
        if (i % 2 === 0) hat(o, t, 0.03);
        at(LOFI_MEL, bar, i).forEach((n) => keys(o, t, n[1], 0.9, 0.05));
        crackle(o, t, sx, 0.35);
      }
    },
    {
      pitch: true,
      name: "Promoted music", artist: "", genre: "Ad jingle", bpm: 118, level: 1.4, verb: 0.12,
      note: "Bright marimba, claps and a glockenspiel hook over C–G–Am–F. Plays on the ad slots, so ads sound like ads.",
      brand: "Sipstream", icon: "coffee", bg: "linear-gradient(160deg, #3a2c1e 0%, #17100a 100%)",
      title: "Wake up without the doom.", cta: "Order now",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 4;
        const [root, chord] = JINGLE_CHORDS[bar];
        if (i === 0 || i === 8) kick(o, t, { gain: 0.7 });
        if (i === 4 || i === 12) clap(o, t, 0.2);
        if (i % 4 === 2) hat(o, t, 0.04);
        if (i === 0 || i === 6 || i === 8) tone(o, t, { type: "triangle", f: mtof(root - 12), d: sx * 2, gain: 0.3 });
        if (i % 2 === 0) marimba(o, t, root + 12 + chord[[0, 2, 1, 3, 2, 1, 3, 2][i / 2]]);
        at(JINGLE_HOOK, bar, i).forEach((n) => bell(o, t, n[1], 0.06));
      }
    },
    {
      name: "two left feet (jersey club)", artist: "DJ Quikstep", genre: "Jersey club", bpm: 140, level: 0.85, verb: 0.1,
      note: "The bouncy jersey kick pattern, bed-squeak FX, saw chord stabs and a chopped \"vocal\". The go-to for dance-trend tutorials.",
      user: "lil.drummer", avatar: "#f368e0", bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      text: ["the dance trend but", "I have two left feet"], caption: "tutorial in comments <b>#jerseyclub #dancetrend</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 2;
        if ([0, 4, 8, 11, 14].includes(i)) {
          kick(o, t, { gain: 0.9 });
          bass808(o, t, 41, sx * 1.5, { drive: 1.5, gain: 0.4 });
        }
        if (i === 4 || i === 12 || (bar && i >= 13)) clap(o, t, 0.28);
        if (i === 2 || i === 6) squeak(o, t);
        if ([2, 7, 10].includes(i)) {
          (bar ? [61, 65, 68] : [65, 68, 72]).forEach((m) => {
            tone(o, t, { type: "sawtooth", f: mtof(m), d: 0.12, gain: 0.045, lp: 2400 });
          });
        }
        if (bar && [0, 3, 6].includes(i)) {
          tone(o, t, { type: "sawtooth", f: mtof([77, 75, 72][[0, 3, 6].indexOf(i)]), d: 0.09, gain: 0.08, lp: 900, ft: "bandpass", q: 4 });
        }
      }
    },
    {
      name: "MONTAGEM LUZ DO SOL", artist: "DJ Maré", genre: "Brazilian funk", bpm: 130, level: 0.85, verb: 0.15,
      note: "The tamborzão drum groove, overdriven 808 stabs and a sliding whistle lead. The \"montagem\" sound behind a lot of gym and edit videos.",
      user: "gymrat.jon", avatar: "#ff9f43", bg: "linear-gradient(160deg, #11998e 0%, #0b3d2e 100%)",
      text: ["brazilian funk makes", "everything 10x harder"], caption: "leg day, no excuses <b>#funk #gymtok</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 2;
        if ([0, 3, 7, 10].includes(i)) {
          kick(o, t, { gain: 0.9, drive: 2 });
          bass808(o, t, 40, sx * 1.4, { drive: 4, gain: 0.45 });
        }
        if ([2, 5, 8, 11, 13].includes(i)) tone(o, t, { type: "triangle", f: 220, from: 330, glide: 0.03, d: 0.12, gain: 0.22 });
        if (i === 4 || i === 12) clap(o, t, 0.34);
        if (i % 2 === 1) hat(o, t, 0.035);
        at(FUNK_WHISTLE, bar, i).forEach((n) => {
          tone(o, t, { f: mtof(n[1]), from: mtof(n[1] - 2), glide: 0.06, hold: true, d: n[2] * sx * 0.9, r: 0.05, gain: 0.08, vib: [6, 0.01] });
        });
      }
    },
    {
      name: "log drum szn", artist: "Kasi Keys", genre: "Amapiano", bpm: 112, level: 1.1, verb: 0.25,
      note: "Amapiano log-drum bassline, shakers on every 16th, soft kick and jazzy minor-9 piano stabs. Lots of GRWM and travel posts use it.",
      user: "zoe.travels", avatar: "#01a3a4", bg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      text: ["get ready with me:", "sunday braai edition"], caption: "outfit details in bio <b>#amapiano #grwm</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 2;
        if (i % 4 === 0) kick(o, t, { gain: 0.55 });
        noise(o, t, { f: 6000, d: 0.03, gain: i % 2 ? 0.02 : 0.04 });
        if (i === 4 || i === 12) clap(o, t, 0.18);
        at(AMA_LOG, bar, i).forEach((n) => logdrum(o, t, n[1], 0.55));
        if (bar ? [2, 7, 10].includes(i) : [2, 10].includes(i)) {
          (bar ? [58, 62, 65, 69] : [62, 65, 69, 72, 76]).forEach((m) => piano(o, t, m, 0.5, 0.06));
        }
      }
    },
    {
      name: "golden hour (slowed + reverb)", artist: "cozy.corner", genre: "Slowed + reverb", bpm: 70, level: 1.05, verb: 0.6, lp: 4000,
      note: "Slow, washed-out pads, a bell melody and a half-time beat drowned in reverb. The \"nostalgia\" and \"things I'd tell my younger self\" sound.",
      user: "cozy.corner", avatar: "#222f3e", bg: "linear-gradient(160deg, #a18cd1 0%, #fbc2eb 100%)",
      text: ["things I'd tell my", "younger self"], caption: "you turned out okay <b>#nostalgia #fyp</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 4;
        const chord = SLOW_CHORDS[bar];
        if (i === 0) {
          chord.forEach((m) => pad(o, t, m, sx * 15, 0.035));
          tone(o, t, { f: mtof(chord[0] - 12), hold: true, d: sx * 15, r: 0.4, gain: 0.22 });
        }
        if (i === 0 || i === 10) kick(o, t, { gain: 0.6, d: 0.45 });
        if (i === 8) snare(o, t, 0.15);
        at(SLOW_MEL, bar, i).forEach((n) => bell(o, t, n[1]));
      }
    },
    {
      name: "missouri", artist: "pixel.ghost", genre: "Metallic 8-bit", bpm: 128, level: 1.2, verb: 0.2,
      note: "Opens on bare metallic hits in threes (ding-ding-ding, ding-ding-ding) with a low hum. A snare riser leads into the pixel drop: chip bass, arpeggio and a square lead answering the metal. 4-bar intro, 8-bar drop, then it loops.",
      user: "nightowl.nina", avatar: "#8395a7", bg: "linear-gradient(160deg, #0f2027 0%, #2c5364 100%)",
      text: ["me pretending I'm fine", "(I am not fine)"], caption: "it's giving 3am <b>#missouri #pixel</b>",
      step(s, t, o, sx) {
        const i = s % 16;
        const bar = Math.floor(s / 16) % 12;
        const phrase = bar % 4;
        const drop = bar >= 4;
        const root = [45, 41, 48, 43][phrase];
        const chord = [0, phrase === 0 ? 3 : 4, 7, 12];

        const group = [0, 2, 4].indexOf(i) >= 0 ? 0 : [8, 10, 12].indexOf(i) >= 0 ? 1 : -1;
        if (group >= 0) metal(o, t, MISSOURI_METAL[phrase][group][(i % 8) / 2], drop ? 0.09 : 0.12);

        if (!drop) {
          if (i === 0) tone(o, t, { f: mtof(33), hold: true, d: sx * 15, r: 0.3, a: 0.2, gain: 0.18 });
          if (bar === 3 && i >= 8) noise(o, t, { ft: "bandpass", f: 1500 + (i - 8) * 400, q: 0.6, d: 0.08, gain: 0.06 + (i - 8) * 0.025 });
          return;
        }

        if (i % 4 === 0) kick(o, t, { gain: 0.85 });
        if (i === 4 || i === 12) noise(o, t, { ft: "bandpass", f: 2500, q: 0.5, d: 0.12, gain: 0.22 });
        if (i % 4 === 2) hat(o, t, 0.05);
        if (i % 2 === 0) tone(o, t, { type: "triangle", f: mtof(root + (i % 4 ? 12 : 0)), d: sx * 1.7, gain: 0.32 });
        tone(o, t, { type: "square", f: mtof(root + 24 + chord[[0, 1, 2, 3, 2, 1, 0, 1][i % 8]]), d: sx * 0.8, gain: 0.03, lp: 3000 });
        at(MISSOURI_LEAD, phrase, i).forEach((n) => {
          tone(o, t, { type: "square", f: mtof(n[1]), hold: true, d: n[2] * sx * 0.85, r: 0.04, gain: 0.07, lp: 5000, vib: [6, 0.004] });
        });
      }
    }
  ];

  function play(track) {
    ensure();
    stop();
    const t0 = ctx.currentTime;
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0, t0);
    bus.gain.linearRampToValueAtTime(track.level ?? 1, t0 + 0.04);
    bus.connect(duckNode);

    const input = ctx.createGain();
    if (track.lp) {
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = track.lp;
      input.connect(f);
      f.connect(bus);
    } else {
      input.connect(bus);
    }
    if (track.verb) {
      const send = ctx.createGain();
      send.gain.value = track.verb;
      bus.connect(send);
      send.connect(reverbIn);
    }

    cur = { track, bus, input, step: 0, next: t0 + 0.06 };
    if (!timer) timer = setInterval(tick, 25);
    tick();
  }

  // Fade the old track out fast. Notes already scheduled on its bus play into silence.
  function stop() {
    if (!cur) return;
    const bus = cur.bus;
    const t = ctx.currentTime;
    bus.gain.cancelScheduledValues(t);
    bus.gain.setValueAtTime(bus.gain.value, t);
    bus.gain.linearRampToValueAtTime(0, t + 0.08);
    setTimeout(() => bus.disconnect(), 400);
    cur = null;
  }

  function tick() {
    if (!cur) return;
    const tr = cur.track;
    const sx = 60 / tr.bpm / 4;
    while (cur.next < ctx.currentTime + 0.12) {
      const t = cur.step % 2 && tr.swing ? cur.next + sx * tr.swing : cur.next;
      tr.step(cur.step, t, cur.input, sx);
      cur.next += sx;
      cur.step++;
    }
  }

  // 0 = reel is centred, 1 = halfway to the next one
  function duck(amount) {
    if (duckNode) duckNode.gain.setTargetAtTime(1 - 0.65 * amount, ctx.currentTime, 0.025);
  }

  function setVolume(v) {
    volume = v;
    if (master) master.gain.setTargetAtTime(v, ctx.currentTime, 0.02);
  }

  // Browsers only allow audio after a tap, click or key press, so call this from those handlers.
  function unlock() {
    ensure();
  }

  const running = () => !!ctx && ctx.state === "running";
  const label = (tr) => (tr.artist ? tr.name + " - " + tr.artist : tr.name);

  window.ScrollitisMusic = { tracks: TRACKS, play, stop, duck, setVolume, unlock, running, label };
})();
