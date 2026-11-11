/* TileEngine Sound panel — WebAudio mock.
   Architect owns @te/audio; fields DRAFT. Event ids = Architect list (CoS 2026-11-09). */
(function (global) {
  "use strict";

  const GENERATOR = "sfxr@1";

  const EVENTS = [
    { id: "unit.move", label: "Move", kind: "sfx", overridable: false },
    { id: "ability.cast", label: "Cast", kind: "sfx", overridable: true },
    { id: "ability.hit", label: "Hit (ability)", kind: "sfx", overridable: true },
    { id: "unit.hurt", label: "Hurt", kind: "sfx", overridable: true },
    { id: "unit.death", label: "Death", kind: "sfx", overridable: true },
    { id: "landedOn", label: "Landed on", kind: "sfx", overridable: false },
    { id: "pushBlocked", label: "Push blocked", kind: "sfx", overridable: false },
    { id: "turn.start", label: "Turn start", kind: "sfx", overridable: false },
    { id: "ui.tap", label: "UI tap", kind: "sfx", overridable: false },
    { id: "ui.confirm", label: "UI confirm", kind: "sfx", overridable: false },
    { id: "ui.cancel", label: "UI cancel", kind: "sfx", overridable: false },
    { id: "stage.music", label: "Stage music", kind: "music", overridable: false },
    { id: "stinger.victory", label: "Victory", kind: "music", overridable: false },
    { id: "stinger.defeat", label: "Defeat", kind: "music", overridable: false },
    { id: "stinger.draw", label: "Draw", kind: "music", overridable: false },
  ];

  const PRESETS = ["hit", "swing", "coin", "jump", "explosion", "magic", "click"];

  const FRIENDLY = ["pitch", "length", "punch", "wobble", "noise", "volume"];

  const ADVANCED_KEYS = [
    "wave_type", "p_base_freq", "p_freq_limit", "p_freq_ramp", "p_freq_dramp",
    "p_duty", "p_duty_ramp", "p_vib_strength", "p_vib_speed",
    "p_env_attack", "p_env_sustain", "p_env_decay", "p_env_punch",
    "p_lpf_freq", "p_lpf_ramp", "p_lpf_resonance", "p_hpf_freq", "p_hpf_ramp",
    "p_pha_offset", "p_pha_ramp", "p_repeat_speed", "p_arp_speed", "p_arp_mod", "sound_vol",
  ];

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function defaultFriendly(recipe) {
    const base = { pitch: 1, length: 0.18, punch: 0.45, wobble: 0.1, noise: 0.08, volume: 0.75 };
    const by = {
      hit: { pitch: 0.9, length: 0.16, punch: 0.85, noise: 0.25 },
      swing: { pitch: 1.1, length: 0.22, punch: 0.2, noise: 0.35, wobble: 0.05 },
      coin: { pitch: 1.35, length: 0.2, punch: 0.3, wobble: 0.25, noise: 0.02 },
      jump: { pitch: 1.15, length: 0.18, punch: 0.55, wobble: 0.35 },
      explosion: { pitch: 0.55, length: 0.55, punch: 1, noise: 0.7, wobble: 0.05 },
      magic: { pitch: 1.25, length: 0.4, punch: 0.15, wobble: 0.55, noise: 0.15 },
      click: { pitch: 1.6, length: 0.06, punch: 0.9, noise: 0.05, wobble: 0 },
      bed: { pitch: 0.5, length: 2.2, punch: 0.05, wobble: 0.12, noise: 0.02, volume: 0.3 },
    };
    return Object.assign({}, base, by[recipe] || {});
  }

  function friendlyToParams(f) {
    return {
      wave_type: f.noise > 0.55 ? 3 : f.noise > 0.25 ? 0 : 1,
      p_base_freq: Math.max(0.05, Math.min(0.9, (Number(f.pitch) || 1) * 0.35)),
      p_freq_limit: 0,
      p_freq_ramp: (Number(f.pitch) || 1) > 1.1 ? 0.1 : (Number(f.pitch) || 1) < 0.8 ? -0.15 : 0,
      p_freq_dramp: 0,
      p_duty: 0.5,
      p_duty_ramp: 0,
      p_vib_strength: Number(f.wobble) || 0,
      p_vib_speed: 0.3 + (Number(f.wobble) || 0) * 0.5,
      p_env_attack: Math.max(0, 0.2 - (Number(f.punch) || 0) * 0.18),
      p_env_sustain: Math.max(0.02, Math.min(0.8, (Number(f.length) || 0.18) * 0.55)),
      p_env_decay: Math.max(0.02, Math.min(0.6, (Number(f.length) || 0.18) * 0.4)),
      p_env_punch: Number(f.punch) || 0,
      p_lpf_freq: 1 - (Number(f.noise) || 0) * 0.4,
      p_lpf_ramp: 0,
      p_lpf_resonance: 0.2,
      p_hpf_freq: (Number(f.noise) || 0) * 0.15,
      p_hpf_ramp: 0,
      p_pha_offset: (Number(f.punch) || 0) * 0.2,
      p_pha_ramp: 0,
      p_repeat_speed: 0,
      p_arp_speed: 0,
      p_arp_mod: 0,
      sound_vol: Number(f.volume) || 0.7,
    };
  }

  function paramsToFriendly(params) {
    const p = params || {};
    return {
      pitch: Math.max(0.5, Math.min(2, ((p.p_base_freq || 0.35) / 0.35))),
      length: Math.max(0.05, Math.min(1.2, ((p.p_env_sustain || 0.1) + (p.p_env_decay || 0.1)))),
      punch: Math.max(0, Math.min(1, p.p_env_punch || 0)),
      wobble: Math.max(0, Math.min(1, p.p_vib_strength || 0)),
      noise: Math.max(0, Math.min(1, p.wave_type === 3 ? 0.8 : p.p_hpf_freq || 0)),
      volume: Math.max(0, Math.min(1, p.sound_vol != null ? p.sound_vol : 0.75)),
    };
  }

  const LIB = [
    { id: "lib_impact_light", name: "Impact light", kind: "sfx", recipe: "hit", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_impact_heavy", name: "Impact heavy", kind: "sfx", recipe: "hit", friendly: { pitch: 0.7, punch: 0.9, length: 0.28 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_swing", name: "Swing", kind: "sfx", recipe: "swing", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_coin", name: "Coin", kind: "sfx", recipe: "coin", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_jump", name: "Jump", kind: "sfx", recipe: "jump", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_explode", name: "Explosion", kind: "sfx", recipe: "explosion", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_magic", name: "Magic", kind: "sfx", recipe: "magic", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_click", name: "UI click", kind: "sfx", recipe: "click", tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_bed_soft", name: "Soft bed", kind: "music", recipe: "bed", friendly: { pitch: 0.5, length: 2.4, volume: 0.35, wobble: 0.15, noise: 0.02, punch: 0.05 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style", streamed: false, durationMs: 2400 },
    { id: "lib_bed_long", name: "Long bed (demo)", kind: "music", recipe: "bed", friendly: { pitch: 0.45, length: 2.8, volume: 0.3 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style", streamed: true, durationMs: 200000, bytes: 480000 },
    { id: "lib_stinger_win", name: "Victory sting", kind: "music", recipe: "coin", friendly: { pitch: 1.4, length: 0.55, wobble: 0.2, volume: 0.7 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_stinger_lose", name: "Defeat sting", kind: "music", recipe: "hit", friendly: { pitch: 0.45, length: 0.7, noise: 0.4, volume: 0.65 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
    { id: "lib_stinger_draw", name: "Draw sting", kind: "music", recipe: "magic", friendly: { pitch: 0.9, length: 0.5, wobble: 0.3, volume: 0.6 }, tag: "Placeholder · procedural (CC0 recipe)", credit: "CC0 · Kenney-style" },
  ];

  let ctx = null;
  let unlocked = false;
  let unlockListeners = [];
  let activeNodes = [];
  let musicGain = null;
  let musicNodes = [];
  let musicMuted = false;
  let musicPlayingId = null;
  let silentHint = false;
  let stateRef = null;

  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function isUnlocked() { return unlocked && ctx && ctx.state === "running"; }

  function unlockFromGesture() {
    const audio = ac();
    if (!audio) return Promise.resolve(false);
    return audio.resume().then(() => {
      try {
        const buf = audio.createBuffer(1, 1, 22050);
        const src = audio.createBufferSource();
        src.buffer = buf;
        src.connect(audio.destination);
        src.start(0);
      } catch (_) {}
      unlocked = true;
      unlockListeners.slice().forEach((fn) => { try { fn(); } catch (_) {} });
      unlockListeners = [];
      // best-effort silent-switch hint: if state stays interrupted-ish we cannot know; leave false
      silentHint = false;
      try {
        if (navigator.audioSession && navigator.audioSession.type !== undefined) {
          navigator.audioSession.type = "playback";
        }
      } catch (_) {}
      return true;
    }).catch(() => false);
  }

  function onUnlock(fn) { if (isUnlocked()) fn(); else unlockListeners.push(fn); }

  function stopAllSfx() {
    activeNodes.forEach((n) => { try { n.stop(); } catch (_) {} try { n.disconnect(); } catch (_) {} });
    activeNodes = [];
  }

  function stopMusic() {
    musicNodes.forEach((n) => { try { n.stop(); } catch (_) {} try { n.disconnect(); } catch (_) {} });
    musicNodes = [];
    musicPlayingId = null;
    if (musicGain) { try { musicGain.disconnect(); } catch (_) {} musicGain = null; }
  }

  function noiseBuffer(audio, seconds, seed) {
    const rnd = mulberry32((seed || 1) >>> 0 || 1);
    const len = Math.max(1, Math.floor(audio.sampleRate * seconds));
    const buf = audio.createBuffer(1, len, audio.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = rnd() * 2 - 1;
    return buf;
  }

  function playFromFriendly(recipe, friendly, opts) {
    opts = opts || {};
    const audio = ac();
    if (!audio || !isUnlocked()) return null;
    const f = Object.assign({}, defaultFriendly(recipe), friendly || {});
    const seed = (opts.seed != null ? opts.seed : 1) >>> 0 || 1;
    const rnd = mulberry32(seed);
    if (!opts.keepOthers) stopAllSfx();

    const now = audio.currentTime;
    const dur = Math.max(0.04, Number(f.length) || 0.18);
    const vol = Math.max(0, Math.min(1, Number(f.volume) || 0.7));
    const pitch = Math.max(0.25, Math.min(3, Number(f.pitch) || 1));
    const punch = Math.max(0, Math.min(1, Number(f.punch) || 0));
    const wobble = Math.max(0, Math.min(1, Number(f.wobble) || 0));
    const noiseAmt = Math.max(0, Math.min(1, Number(f.noise) || 0));
    // tiny seed-stable jitter so seed matters audibly without breaking recipe feel
    const jPitch = pitch * (1 + (rnd() - 0.5) * 0.04);

    const master = audio.createGain();
    master.gain.setValueAtTime(0.0001, now);
    const attack = 0.004 + punch * 0.02;
    master.gain.exponentialRampToValueAtTime(vol, now + attack);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    master.connect(opts.dest || audio.destination);

    const freqs = { hit: 180, swing: 420, coin: 880, jump: 320, explosion: 90, magic: 540, click: 1200, bed: 110 };
    const f0 = (freqs[recipe] || 220) * jPitch;
    const osc = audio.createOscillator();
    osc.type = recipe === "coin" || recipe === "magic" ? "triangle" : recipe === "swing" ? "sawtooth" : "square";
    osc.frequency.setValueAtTime(f0, now);
    if (recipe === "jump" || recipe === "coin") osc.frequency.exponentialRampToValueAtTime(f0 * (recipe === "jump" ? 1.8 : 1.5), now + dur * 0.7);
    else if (recipe === "explosion" || recipe === "hit") osc.frequency.exponentialRampToValueAtTime(Math.max(40, f0 * 0.4), now + dur);
    if (wobble > 0.01) {
      const lfo = audio.createOscillator();
      const lfoGain = audio.createGain();
      lfo.frequency.value = 4 + wobble * 10;
      lfoGain.gain.value = f0 * 0.16 * wobble;
      lfo.connect(lfoGain); lfoGain.connect(osc.frequency);
      lfo.start(now); lfo.stop(now + dur + 0.05); activeNodes.push(lfo);
    }
    const oscGain = audio.createGain();
    oscGain.gain.value = 1 - noiseAmt * 0.7;
    osc.connect(oscGain); oscGain.connect(master);
    osc.start(now); osc.stop(now + dur + 0.05); activeNodes.push(osc);

    if (noiseAmt > 0.01 || recipe === "explosion" || recipe === "swing") {
      const src = audio.createBufferSource();
      src.buffer = noiseBuffer(audio, dur + 0.05, seed ^ 0x9e3779b9);
      const ng = audio.createGain();
      ng.gain.value = noiseAmt * (recipe === "explosion" ? 1 : 0.7);
      const filter = audio.createBiquadFilter();
      filter.type = "bandpass"; filter.frequency.value = f0 * 1.2; filter.Q.value = 0.8;
      src.connect(filter); filter.connect(ng); ng.connect(master);
      src.start(now); src.stop(now + dur + 0.05); activeNodes.push(src);
    }
    return { dur, seed };
  }

  function defFriendly(def) {
    if (!def) return defaultFriendly("click");
    if (def.friendly) return Object.assign({}, defaultFriendly(def.recipe || "hit"), def.friendly);
    if (def.origin && def.origin.params) return paramsToFriendly(def.origin.params);
    if (def.params) return paramsToFriendly(def.params);
    return defaultFriendly(def.recipe || "hit");
  }

  function playSoundDef(def, opts) {
    if (!def) return null;
    opts = opts || {};
    if (def.kind === "music" && opts.asMusic) return startMusic(def);
    const recipe = def.recipe || (def.origin && def.origin.recipe) || "click";
    const seed = (def.origin && def.origin.seed != null) ? def.origin.seed : (def.seed != null ? def.seed : 1);
    return playFromFriendly(recipe, defFriendly(def), Object.assign({}, opts, { seed }));
  }

  function startMusic(def) {
    const audio = ac();
    if (!audio || !isUnlocked()) return null;
    stopMusic();
    musicPlayingId = def.id;
    if (musicMuted) return null;
    const recipe = def.recipe || "bed";
    const f = Object.assign({}, defFriendly(def), { volume: (defFriendly(def).volume || 0.28) });
    musicGain = audio.createGain();
    musicGain.gain.value = f.volume;
    musicGain.connect(audio.destination);
    function schedule() {
      if (musicPlayingId !== def.id || musicMuted) return;
      playFromFriendly(recipe, f, { keepOthers: true, dest: musicGain, seed: (def.origin && def.origin.seed) || 7 });
      const moved = activeNodes.splice(0, activeNodes.length);
      musicNodes.push.apply(musicNodes, moved);
      const t = window.setTimeout(schedule, Math.max(200, (f.length || 1) * 850));
      musicNodes.push({ stop() { clearTimeout(t); }, disconnect() {} });
    }
    schedule();
    return { id: def.id };
  }

  function setMusicMuted(on) {
    musicMuted = !!on;
    if (musicGain) musicGain.gain.value = musicMuted ? 0 : 0.28;
    if (!musicMuted && musicPlayingId) {
      const def = getDef(musicPlayingId);
      if (def) startMusic(def);
    }
  }

  function libraryById(id) { return LIB.find((x) => x.id === id) || null; }

  function sizeWarn(def) {
    if (!def) return null;
    const ms = def.durationMs || 0;
    const bytes = def.bytes || 0;
    if (def.kind === "sfx" && (ms > 3000 || bytes > 300000)) return "SFX over 3 s or 300 KB — consider mono. Warn only.";
    if (def.kind === "music" && ms > 180000) return "Music over ~3 min — decoded ≈ 10 MB per stereo minute. Warn only.";
    return null;
  }

  function randomise(gen, little) {
    const locks = gen.locks || {};
    const cur = Object.assign({}, gen.friendly);
    const seed = (Math.floor(Math.random() * 0xffffffff) >>> 0) || 1;
    const rnd = mulberry32(seed ^ (little ? 0xabc : 0x123));
    const jitter = little ? 0.12 : 0.55;
    function j(key, min, max) {
      if (locks[key]) return cur[key];
      const n = cur[key] + (rnd() * 2 - 1) * jitter * (little ? 1 : 1.35);
      return Math.max(min, Math.min(max, n));
    }
    const next = {
      pitch: j("pitch", 0.5, 2),
      length: j("length", 0.05, 1.2),
      punch: j("punch", 0, 1),
      wobble: j("wobble", 0, 1),
      noise: j("noise", 0, 1),
      volume: j("volume", 0.2, 1),
    };
    gen.friendly = next;
    gen.params = friendlyToParams(next);
    gen.seed = seed;
    return gen;
  }

  /* audio-format r1 §3.7 — bindings are the only Own-sound store */
  const EVENT_ALIAS = {
    "ability.cast": "tactics.attack",
    "ability.hit": "tactics.hit",
    "unit.hurt": "tactics.hit",
    "unit.death": "tactics.unitDown",
  };
  const EVENT_ALIAS_REV = {
    "tactics.attack": "ability.cast",
    "tactics.hit": "ability.hit",
    "tactics.unitDown": "unit.death",
  };
  const DEFAULT_EVENT_SOUNDS = {
    "unit.move": "lib_click",
    "ability.cast": "lib_swing",
    "ability.hit": "lib_impact_light",
    "unit.hurt": "lib_impact_light",
    "unit.death": "lib_impact_heavy",
    "landedOn": "lib_jump",
    "pushBlocked": "lib_click",
    "turn.start": "lib_click",
    "ui.tap": "lib_click",
    "ui.confirm": "lib_coin",
    "ui.cancel": "lib_click",
    "stage.music": "lib_bed_soft",
    "stinger.victory": "lib_stinger_win",
    "stinger.defeat": "lib_stinger_lose",
    "stinger.draw": "lib_stinger_draw",
  };
  const DEMO_ABILITY_SETUPS = [
    { id: "setup_heaven_sword", name: "Heaven Sword" },
    { id: "setup_guard", name: "Guard" },
    { id: "setup_heal", name: "Heal" },
  ];

  function ulidBind() {
    return "bind_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
  function mapEventKey(key) {
    return EVENT_ALIAS[key] || key;
  }
  function uiEventKey(key) {
    return EVENT_ALIAS_REV[key] || key;
  }
  function bindingTier(b) {
    const m = b.match || {};
    if (m.ability) return 3;
    if (m.action) return 2;
    if (m.unit || m.side) return 1;
    return 0;
  }
  function ensureSilentAsset(state) {
    if (!state.sounds) state.sounds = {};
    if (!state.sounds.snd_silent) {
      state.sounds.snd_silent = {
        id: "snd_silent",
        name: "Silent",
        kind: "sfx",
        origin: { kind: "procedural-audio", generator: GENERATOR, params: { sound_vol: 0 }, seed: 0 },
        credit: { license: "own", author: "engine" },
        tag: "Silent",
        silent: true,
      };
    }
    return "snd_silent";
  }
  function annotateBinding(state, b) {
    // Temporarily set stateRef so getDef sees project sounds during attach
    const prev = stateRef; stateRef = state;
    const def = getDef(b.soundId);
    stateRef = prev;
    const m = b.match || {};
    let unknown = false;
    if (!def) unknown = true;
    if (m.ability && state._unknownAbilityIds && state._unknownAbilityIds[m.ability]) unknown = true;
    if (m.action === "") unknown = true;
    if (m.unit && state._unknownUnitIds && state._unknownUnitIds[m.unit]) unknown = true;
    b._state = unknown ? "unknownRef" : "ok";
    return b;
  }
  function migrateLegacyOverrides(state) {
    ensureProjectAudio(state);
    const silent = ensureSilentAsset(state);
    const push = (eventKey, soundVal, match) => {
      if (soundVal === "inherit") return;
      const soundId = soundVal === null ? silent : soundVal;
      state.audio.bindings.push(annotateBinding(state, {
        id: ulidBind(),
        event: mapEventKey(eventKey),
        soundId,
        match: Object.assign({}, match),
      }));
    };
    (state.units || []).forEach((u) => {
      if (!u || !u.soundOverrides) return;
      Object.keys(u.soundOverrides).forEach((ev) => push(ev, u.soundOverrides[ev], { unit: u.id }));
      delete u.soundOverrides;
    });
    if (state.abilities) {
      Object.keys(state.abilities).forEach((aid) => {
        const ab = state.abilities[aid];
        if (!ab || !ab.soundOverrides) return;
        const setupId = ab.id || aid;
        Object.keys(ab.soundOverrides).forEach((ev) => push(ev, ab.soundOverrides[ev], { ability: setupId }));
        delete ab.soundOverrides;
        delete ab.ownSound;
      });
      // drop parallel map after conversion
      delete state.abilities;
    }
  }
  function seedDefaultBindings(state) {
    const audio = state.audio;
    if (audio._seededDefaults) return;
    // Prefer legacy soundEvents once
    const src = state.soundEvents || DEFAULT_EVENT_SOUNDS;
    Object.keys(DEFAULT_EVENT_SOUNDS).forEach((ev) => {
      const sid = (src && src[ev]) || DEFAULT_EVENT_SOUNDS[ev];
      audio.bindings.push(annotateBinding(state, {
        id: ulidBind(),
        event: ev, // UI keys kept for panel; registry alias applied on Own-sound writes
        soundId: sid,
      }));
    });
    audio._seededDefaults = true;
    // stop writing parallel soundEvents
    delete state.soundEvents;
  }
  function ensureProjectAudio(state) {
    if (!state.audio || state.audio.kind !== "audio") {
      const prev = state.audio || {};
      state.audio = {
        kind: "audio",
        formatVersion: 1,
        bindings: Array.isArray(prev.bindings) ? prev.bindings.slice() : [],
        music: prev.music || { title: null, menu: null, battle: null },
        procedural: prev.procedural || "live",
        options: prev.options || {},
        _seededDefaults: !!prev._seededDefaults,
      };
    }
    if (!Array.isArray(state.audio.bindings)) state.audio.bindings = [];
    return state.audio;
  }

  function attach(state) {
    stateRef = state;
    if (!state.sounds) state.sounds = {};
    ensureProjectAudio(state);
    migrateLegacyOverrides(state);
    seedDefaultBindings(state);
    state.audio.bindings.forEach((b) => annotateBinding(state, b));
    if (!state.soundGen) {
      const friendly = defaultFriendly("hit");
      state.soundGen = {
        recipe: "hit",
        friendly,
        params: friendlyToParams(friendly),
        seed: 1,
        locks: { pitch: false, length: false, punch: false, wobble: false, noise: false, volume: false },
        name: "New sound",
      };
    }
    if (!state.soundUi) {
      state.soundUi = {
        tab: "library",
        filter: "sfx",
        assignEvent: "ability.cast",
        musicMute: false,
        playingId: null,
        pickerFor: null,
        unitOverrideEvent: "ability.cast",
        abilityId: null,
        abilityEvent: "ability.cast",
        ownPickerOpen: false,
        awaitingOwnAssign: false,
      };
    }
    return state;
  }

  function getDef(id) {
    if (!id) return null;
    return libraryById(id) || (stateRef && stateRef.sounds && stateRef.sounds[id]) || null;
  }

  function matchOk(match, ctx) {
    if (!match) return true;
    if (match.ability && ctx.ability && match.ability !== ctx.ability) return false;
    if (match.ability && !ctx.ability) return false;
    if (match.action && ctx.action && match.action !== ctx.action) return false;
    if (match.action && !ctx.action) return false;
    if (match.unit && ctx.unit && match.unit !== ctx.unit) return false;
    if (match.unit && !ctx.unit) return false;
    if (match.side && ctx.side && match.side !== ctx.side) return false;
    if (match.side && !ctx.side) return false;
    return true;
  }

  /** Resolve soundId for an event. ctx: { unit, ability, action, side } */
  function resolveSoundId(eventId, unitOrCtx) {
    if (!stateRef) return null;
    ensureProjectAudio(stateRef);
    const ctx = unitOrCtx && unitOrCtx.id && !unitOrCtx.ability && unitOrCtx.name !== undefined
      ? { unit: unitOrCtx.id }
      : (unitOrCtx && typeof unitOrCtx === "object" ? unitOrCtx : {});
    if (unitOrCtx && unitOrCtx.id && !ctx.unit) ctx.unit = unitOrCtx.id;
    const keys = [eventId, mapEventKey(eventId), uiEventKey(eventId)];
    const uniq = [...new Set(keys)];
    const candidates = stateRef.audio.bindings.filter((b) => {
      if (b._state === "unknownRef") return false;
      if (uniq.indexOf(b.event) < 0) return false;
      return matchOk(b.match, ctx);
    });
    if (!candidates.length) {
      // fallback: legacy-style default without match
      return null;
    }
    let maxTier = -1;
    candidates.forEach((b) => { maxTier = Math.max(maxTier, bindingTier(b)); });
    const top = candidates.filter((b) => bindingTier(b) === maxTier);
    if (maxTier >= 1) {
      const last = top[top.length - 1];
      return last ? last.soundId : null;
    }
    // tier 0: first default (layered at runtime; UI shows primary)
    return top[0] ? top[0].soundId : null;
  }

  function findDefaultBinding(eventId) {
    if (!stateRef) return null;
    ensureProjectAudio(stateRef);
    const keys = [eventId, mapEventKey(eventId), uiEventKey(eventId)];
    return stateRef.audio.bindings.find((b) => keys.indexOf(b.event) >= 0 && bindingTier(b) === 0) || null;
  }

  function findOwnBinding(eventId, match) {
    if (!stateRef) return null;
    ensureProjectAudio(stateRef);
    const keys = [eventId, mapEventKey(eventId), uiEventKey(eventId)];
    const list = stateRef.audio.bindings.filter((b) => keys.indexOf(b.event) >= 0);
    // last matching same-tier wins — walk reverse
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i];
      const m = b.match || {};
      if (match.ability && m.ability === match.ability) return b;
      if (match.unit && m.unit === match.unit && !m.ability && !m.action) return b;
      if (match.action && m.action === match.action && !m.ability) return b;
    }
    return null;
  }

  function upsertOwnBinding(eventId, soundId, match) {
    if (!stateRef) return null;
    ensureProjectAudio(stateRef);
    const event = match && match.ability ? mapEventKey(eventId) : eventId;
    // remove prior same-match override (last-wins via append)
    stateRef.audio.bindings = stateRef.audio.bindings.filter((b) => {
      if ([eventId, mapEventKey(eventId), event].indexOf(b.event) < 0) return true;
      const m = b.match || {};
      if (match.ability) return m.ability !== match.ability;
      if (match.unit) return !(m.unit === match.unit && !m.ability && !m.action);
      if (match.action) return !(m.action === match.action && !m.ability);
      return true;
    });
    const b = annotateBinding(stateRef, {
      id: ulidBind(),
      event,
      soundId,
      match: Object.assign({}, match),
    });
    stateRef.audio.bindings.push(b);
    return b;
  }

  function clearOwnBinding(eventId, match) {
    if (!stateRef) return;
    ensureProjectAudio(stateRef);
    const keys = new Set([eventId, mapEventKey(eventId), uiEventKey(eventId)]);
    stateRef.audio.bindings = stateRef.audio.bindings.filter((b) => {
      const m = b.match || {};
      const eventHit = keys.has(b.event) || keys.has(uiEventKey(b.event));
      if (!eventHit && !(match.ability && m.ability === match.ability)) {
        // clearing by ability alone removes all events for that ability
        if (match.ability && m.ability === match.ability) return false;
        return true;
      }
      if (match.ability && m.ability === match.ability) return false;
      if (match.unit && m.unit === match.unit && !m.ability && !m.action && eventHit) return false;
      if (match.action && m.action === match.action && !m.ability && eventHit) return false;
      return true;
    });
  }

  function clearAllAbilityOwn(setupId) {
    if (!stateRef) return;
    ensureProjectAudio(stateRef);
    stateRef.audio.bindings = stateRef.audio.bindings.filter((b) => !(b.match && b.match.ability === setupId));
  }

  function setEventDefault(eventId, soundId) {
    if (!stateRef) return;
    ensureProjectAudio(stateRef);
    const existing = findDefaultBinding(eventId);
    if (existing) {
      existing.soundId = soundId;
      annotateBinding(stateRef, existing);
    } else {
      stateRef.audio.bindings.push(annotateBinding(stateRef, {
        id: ulidBind(), event: eventId, soundId,
      }));
    }
  }

  function abilityHasOwnSound(setupId) {
    if (!stateRef) return false;
    ensureProjectAudio(stateRef);
    return stateRef.audio.bindings.some((b) => b.match && b.match.ability === setupId);
  }

  function saveGenerated() {
    if (!stateRef) return null;
    const g = stateRef.soundGen;
    const id = "snd_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    const def = {
      id,
      name: (g.name || "Made sound").slice(0, 40),
      kind: "sfx",
      recipe: g.recipe,
      friendly: Object.assign({}, g.friendly),
      seed: g.seed,
      origin: { kind: "procedural-audio", generator: GENERATOR, params: Object.assign({}, g.params), seed: g.seed },
      credit: { license: "own", author: "maker" },
      tag: "Made here",
    };
    stateRef.sounds[id] = def;
    return def;
  }

  function playTrySequence(unit, onPulse) {
    const steps = ["ability.cast", "unit.hurt", "unit.death"];
    let i = 0;
    function next() {
      if (i >= steps.length) return;
      const ev = steps[i++];
      const sid = resolveSoundId(ev, unit);
      const def = getDef(sid);
      if (onPulse) onPulse(ev);
      if (def) playSoundDef(def, {});
      window.setTimeout(next, 320);
    }
    unlockFromGesture().then(next);
  }

  function ensurePlay(def, opts) {
    return unlockFromGesture().then(() => playSoundDef(def, opts || {}));
  }

  global.SoundPanel = {
    GENERATOR, EVENTS, PRESETS, FRIENDLY, ADVANCED_KEYS, LIB,
    EVENT_ALIAS, mapEventKey, uiEventKey,
    defaultFriendly, friendlyToParams, paramsToFriendly,
    attach, ensureProjectAudio, migrateLegacyOverrides,
    playFromFriendly, playSoundDef, ensurePlay,
    stopAllSfx, startMusic, stopMusic, setMusicMuted,
    isMusicMuted: () => musicMuted,
    musicPlayingId: () => musicPlayingId,
    libraryById, getDef, resolveSoundId, saveGenerated, playTrySequence,
    findDefaultBinding, findOwnBinding, upsertOwnBinding, clearOwnBinding, clearAllAbilityOwn,
    setEventDefault, abilityHasOwnSound, annotateBinding, bindingTier, DEMO_ABILITY_SETUPS,
    randomise, sizeWarn,
    unlockFromGesture, isUnlocked, onUnlock,
    getSilentHint: () => silentHint,
    setSilentHint: (v) => { silentHint = !!v; },
    ac,
  };
})(typeof window !== "undefined" ? window : globalThis);
