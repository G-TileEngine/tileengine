# QA: step-art1a-bake-core kit r1 review

Reviewer: QA & Build Guard. Date: 2026-11-27 (London).

| Item | sha256 | Lines or size |
|---|---|---|
| Guide | 3cd2006e6fd80db3c2a8c524eadc3bb04271ded38a60070e1708c2bebf3df857 | 179 |
| Paste | 8f84daa155984cedf5a2106359c659a4a4e6c8daf154af959da05654ab6818f8 | |
| Kit SHA256SUMS | 7dff7b3d05070bf94ba4ddf1aefb39d1efbf362411ecbcfb9b7487a539a7e7a3 | 121 files, 5,969,926 B |
| Trial patch | 76c590449efcfd223ad7085f4cc80734c9f0fe125c25c17cb810a186dc6b8d09 | |
| Plan delta | 0a6c83cda66f73b49c2a5e65536ba2d674c0bf9034ff33744bd3025ab1d778a4 | |

Base: main fea3098b.

**Verdict: NOT OK TO SEND.** There is 1 must-fix and 2 wording fixes. The rework is one kit round.

## QA's own run
The run was on a fresh worktree of fea3098b with the trial patch applied.
- **Tree:** 41edb077, as stated. Numstat is +380/−0 in 9 files, each within its cap.
- **Kit:** `sha256sum -c` passes inside the folder (0 failures). The outer SHA256SUMS passes too.
- **Green:** 1194 pass, 0 fail. check:law is OK.
- **tsc:** only the 3 base errors: page.ts L101 (TS18047) and home.ts L93 twice (TS7053). tools/tsconfig includes `**/*.ts`, so the rig is type-checked.
- **Bake:** `node tools/art-bake/bake.ts /tmp/b 32 48` prints:
  - crate-32: 19×27, foot 10,26, 99ef690d…cc88
  - crate-48: 27×40, foot 14,39, 97047142…5984

  With no tile named, it bakes 32 only.
- **Python references:**
  - ref-art1a.py prints exactly ref/expected/ref-art1a.json (the crate and barrel at 32 and 48).
  - ref-palette.py prints "palette.json matches the r6b chain: 38 ramps".
- **Plants:** 23/23 caught, and the tree is clean afterwards.
- **Port chain, checked independently:**
  - The frozen Python crate at 48, with the b-r4 `sprite_post` haze applied, equals the checkpoint `b-r6b-sprites/sprites/crate.png` exactly: 0 px differ, at v = 2.392.
  - The JavaScript crate equals the frozen Python crate exactly (the pins).
  - So pinning against the re-run Python recipe rather than the hazed PNG is correct. art-style § 5 is met with tolerance zero.
- **Build law:**
  - No rAF or clock.
  - No import from src.
  - The fence is pinned.
  - No Math.random, Date or performance.
  - Bounded: nothing is kept between bakes.
  - No scope creep beyond plan L73 (core plus one sample).

## Must-fix
**M1. Law 12: the CLI silently defaults the tile size.**
- bake.ts L40 has `arg === "48" ? 48 : 32`, and guide Ruling 8 (L44) says "an argument that isn't 48 means 32".
- `node tools/art-bake/bake.ts /tmp/x 64` exits 0 and writes crate-32.png. A typo or an unsupported size bakes the wrong art with no warning.
- **Fix:** any argument other than `32` or `48` throws, for example `art-bake: tile must be 32 or 48 ("64")`. Update Ruling 8 and the trial, and pin it with a plant (and a test line if EA wants one). Re-state the caps if bake.ts grows.

## Wording fixes
**W1. Rule 8 coverage.**
- Ruling 11 (and paste L8) names only braceless `if (…) continue;` and `if (…) return x;` as one statement.
- The trial has four braceless one-statement `for` lines: bake.ts L42 (`for (…) console.log(…)`), png.ts L19 (`for (…) rows.set(…)`), and crate.ts L39 and L42 (`for (…) put(…)`).
- Either add "`for (…) oneStatement;` with no braces is one statement" to Ruling 11 and the paste, or brace those lines. Otherwise the builder and QA will disagree at review.

**W2. The reference script's png-dir.**
- ref/ref-art1a.py (usage on L4: `python3 ref-art1a.py [png-dir]`) fails with FileNotFoundError when png-dir doesn't exist (QA hit it).
- Either the script makes the folder (`os.makedirs(…, exist_ok=True)`, which changes the kit sums), or the guide says to `mkdir -p` it first.

## Notes (non-blocking)
- **Carry to ART1b (law 12):**
  - sprite.ts L57: `ramp(m)[0] ?? [0, 0, 0]` gives a black outline base for an empty ramp.
  - `rgb()` accepts any string, so a bad hex parses to 0, which is black.
  - Today palette.json is verbatim and test-checked. When ART1b touches palette.ts, `ramp()` should reject ramps outside 2–8 steps, and `rgb()` should reject anything that isn't `#rrggbb`.
- **The two b-r6b `*-vs-concept.png` sheets: QA's view is to leave them out.**
  - They're comparison sheets that embed the AI concept image, not checkpoint renders.
  - Nothing in the port check reads them: the refs, plants and green all passed without them.
  - The kit's Python still names `../../styles/b-hd-pixel.jpg`, but only in sheet-making functions that the refs never run.
  - Whether to add them to the public repo is CoS's call with the CEO.
- **Plan delta (UX owns the lines):**
  - It applies cleanly on 8b6e9386 and gives a260d727 (459 lines). L109 and L113 are untouched.
  - The ART0 attribution matches art-style r3.
  - The order note after L82 leaves placement to CoS with the CEO.
  - Optional clarity for new L152: say "matches the frozen Python recipe pixel for pixel (the checkpoint sprite PNGs add the scene's haze pass)".
- **Paste:**
  - Line 1 is the token placeholder.
  - It has the helper-agents lines (L2, L6).
  - It has the token-handling line (L10).
  - It uses repo paths only.
