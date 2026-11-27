# QA review: step F1 look kit, ChatA r1 (handback)
QA & Build Guard, 2026-11-27 (London). Guide docs/maker/steps/step-f1-look-kit.md r3b (sha256 9d7ecff2…). One review; this is the one rework round.

Branch `step/step-f1-look-kit-r1-chatA`. Base `04dadacfc40d81d17b21df8f96ef1e11f9d2dbaa` (main, unmoved).
Code head `d0689c2c92d32cca0b7ef339633d7b08f814d874` (tree `567d755a`). Tip `d56647be73c034ef426fddf2cfe852212655e8a8` (tree `1c79d23d`).

## Verdict: NOT OK. r2 must-fix (one)
**M1. icons.ts PATHS are not UX's drawings.** Ruling 5 says "UX's drawings verbatim" and L119 says the values are "UX's paths as in the trial patch, byte for byte". All 16 values differ from the trial patch (c0ea4042, trial 8ac4e693 / tree 4ccddd3f, reproduced here). It shows in the shots: Rules is a document in a-stage-390.png and a flag in UX's f01; units is two people (UX: one); build is a wrench (UX: a down arrow into a tray); levels is bars (UX: a star); grid is four squares (UX: a 3×3 grid).
Cause: a kit gap, not a builder miss. UX's paths existed only in the box-only trial patch; the repo at 04dadacf has none of them (only undo's prefix and edit's path, pinned in the shipped test). ChatA flagged it in HANDBACK L83. The shipped test and plants pass either set, so nothing caught it.
Fix: replace icons.ts L2–L17 with the 16 lines below, byte for byte (guide order; backtick quoting kept as in r1; only the values change). Nothing else changes in the code.

```
  play: `<path d="M8 5l11 7-11 7z" fill="currentColor"/>`,
  undo: `<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>`,
  more: `<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>`,
  back: `<path d="M15 6l-6 6 6 6"/>`,
  save: `<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>`,
  build: `<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>`,
  rules: `<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>`,
  image: `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>`,
  grid: `<path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16"/>`,
  units: `<circle cx="12" cy="7" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  stages: `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>`,
  effects: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>`,
  levels: `<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>`,
  edit: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
```
Expected r2 code tree on base 04dadacf: `b9676b64899b3cbe727d9e69032472ed73309415` (QA trial: d0689c2c + this swap). Counted lines stay 289+85 = 374; icons.ts 22 lines (cap 24). In that trial: f1-look-kit.test.ts 8/8, plants 29/29.

## Checked and passing on r1 (QA's own run, worktree at the tip)
- Trial patch reproduces tree 4ccddd3f on e0455199; 04dadacf changes no tools/ or src/ file against e0455199.
- npm run green exit 0, 1188 pass / 0 fail (floor 1188).
- tools tsc: only the 3 base errors (effect-designer page.ts L101; maker home.ts L93 ×2).
- Smokes: 24/25 PASS in sequence; s8c failed in sequence (shop hero, "no hero") and then PASSED solo twice (8 ok). Same smoke family ChatA saw fail on its first pass. Guide asks solo PASS: met. Flag, not a fail.
- plants-f1.py 29/29. Shipped test 83ef2acf byte-identical. Export audit 136/150/150 PASS.
- Changed files are exactly HANDBACK's 27; 289+85 = 374 ≤ 380; every per-file cap held (stage 14+10, home 9+8, rooms 9+8, units 9+8, stage-sheets 8+7, levels 5+4, project 4+3).
- No diff to tokens.css, src/**, play-stage, export, apk, style-spec. app.css only L51 and appended L59–L74. `class="btn"` and `[⋯▶]` in tools/maker: none. 0 token patterns in the branch diff.

## Flags (no rework)
- F-a. stage.ts `group` moves the null check: `mine.length === 0 || cell === null ? ""` and drops `cell !== null &&` from aria-pressed. group is only called inside the sheet built when `cell !== null` (L160), so no runtime change; it's a type-narrowing form of the named terrain-chip edit. Accepted.
- F-b. Three placements Ruling 5/6 name are missing: stage error-state Back icon (stage.ts L142), `u:rename` edit icon, the read-only/newer levels card thumb. The trial also lacks all three, so the file caps (the trial's counts) can't fit them. The guide text over-promises; carry to F2a. CoS's note lists a fourth (read-only Save): that one is present in r1 (`${icon("save")}Save` on the disabled Save), so it's three, as HANDBACK L82 says.
- F-c. r1 adds the save icon on every sheet Save (rooms rename, talk, unit name, Save name, read-only Save), which the trial didn't; Ruling 5 says "save on Save", so r1 is the closer reading. Accepted.
- F-d. units.ts imports icons on L2, not where the trial put it; home.ts moves the budgets import below icons. Import order only. Accepted.
- F-e. Handback: § Green has counts but not the code head sha in the section (it's in the header L3); tip sha only in ChatA's message. Same as F0c. Carry to r2: put both shas in § Green.

## Carries to F2a (unchanged)
On aria-label `{label}: On`; dead `.card.new` (app.css L8); Budgets icon; plus F-b's three placements. F2b: `+ Add ability` plus icon.

## r2 must show
Code head tree b9676b64; green 1188/0; tools tsc 3 base errors; plants 29/29; 25 smokes PASS solo; audit 136/150/150; tap-path shots (a)–(g) re-taken at 390 and 360 (the icons change); HANDBACK r2 with both shas in § Green and § Helpers.
