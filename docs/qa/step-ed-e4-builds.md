# Step ED-E4 builds A/B (blend core): QA pick

QA & Build Guard · 2026-11-16 21:25 Europe/London (GMT). Kit r4: step doc `handoff/steps/step-ed-e4-blend-core.md` `ab04fa80…`, proto `ea207da1` (tree `813d788d`), kit list `/workspace/share/step-ed-e4/push-sha256.txt` `aeacc267` (9/9), base `5d4c00fb`. Main is now `a608f680`: two commits on `5d4c00fb`, `79f28c7f` "kit: step ED-E4 blend core" (10 files, all under handoff/ and docs/pastes, every sha256 matching the kit list) and `a608f680` "docs: CN-027 tool swing format" (one CN file). Docs only, no src or tests: a benign advance. The seven kit tests are byte-identical in both builds (`a4b80528`, `9d350f3c`, `03323745`, `367d2519`, `e2385ec7`, `077aafe5`, `9d8a3058`). The bundles and handbacks were copied into `qa-runs/effect-designer/e4/builds/chat{A,B}/in/` before use. ChatB's copy is the local staging (its Drive copy was trashed); its sha256 still matches `4b38c1d6…`. That folder holds the evidence too. No messaging, no GitHub/Drive writes, no EA file edited, no existing ref moved.

## Pick: **ChatB** (`80809a5d`). **OK TO OPEN PR on `refs/cmp/ede4-chatB-qa-fix-a` (`6bbda79a`)** once EA adopts the QA4 pin (G6). B's tip as shipped is NOT OK: plant 77 is missed (M1)

Why ChatB: both builds pass every hard gate, before and after the merge onto `a608f680`. The difference is in behaviour the kit tests don't cover:
- **A breaks ruling 15 / Law 13.** Parts that name `Object.prototype` keys as beats give NaN spans and more than 5 beat keys, and a `__proto__` beat swaps the object's prototype.
- **A breaks rule 2.** A moved part whose only step Fit trims stays in `parts`, so a chip is left with no step.
- **A has an empty-base pick bug.**
- **B fixes all three**, and its handback declares each fix. Its handback is full: 3 helpers, each found a real bug. A's helpers section is thin.
- **B's one must-fix is a missed plant (77),** a test gap rather than a code bug. B's code is correct there. The QA4 pin closes it (26 lines) and pins B's three fixes too.
- **Size is a wash:** B 344 lines vs A 345; fit.ts is 37/37 in both; merge.ts is 69/81 for B and 70/81 for A.

### Must-fix
- **ChatB M1 (G1): plant 77 "S6: count lines name steps 13+" is missed (PASS).**
  - Cause: B's Fit builds its count lines with its own `steps.slice(0, FIT.steps)` filter (fit.ts line 53) instead of calling `badCounts`. The kit pins the 13+ filter only through the meter, and no kit test feeds Fit a bad count past step 12.
  - Repro: `fit({connect_step:"h", steps:[11 stamps, stamp h, {kind:"particles", particle_count:NaN}]}, [])`. B gives `["Still 13 steps…"]`. With the mutation it gives `["Bad count NaN on step 13 → 0", "Still 13 steps…"]`.
  - Fixed by QA4 test 1 (now ASSERT).
- **ChatA M1 (ruling 15, Law 13): prototype-key beats.** A's `impactMarks` uses a plain `{cast, travel, hit, linger}` object.
  - Repro: 5 parts naming the beats `__proto__`, `constructor`, `toString`, `valueOf` and `zap`, one step each. A returns 9 beat keys (ruling 15 caps it at 5: the four named beats plus one unknown).
    - `constructor`, `toString`, `hasOwnProperty` and `valueOf` come back as `[NaN, NaN]`.
    - The `__proto__` span becomes the object's prototype.
  - A's handback says "the marks are fixed-size records", which is false here. EA's proto `ea207da1` has the same defect, so it's a kit gap. B: 5 keys, null prototype, no NaN.
  - Pinned by QA4 test 2.
- **ChatA M2 (rule 2): a moved part whose only step Fit trims is kept.** A filters parts before `fit()`, so a Fit trim leaves a chip with no step.
  - Repro: a base with hit plus 11 at-hit linger steps; the other side's trail part `tp` has one linger step. B gives `parts []`, A gives `["p-1"]`. The proto does the same as A.
  - Pinned by QA4 test 3.

### Should-fix / report-only
- **ChatA S1: an empty base protects B's first step from a pick.**
  - `stepTimes` gives hitIndex 0 for no steps, and A's drop guard is `i !== hitIndex` with no `< baseN` check.
  - Repro: base `{steps: []}`, picks `shape:cast`/`shape:hit` = `a`. A keeps `["s-1"]`; B and the proto keep `[]`.
  - Pinned by QA4 test 3 (second assert).
- **Both (pre-existing E1, report-only):**
  - When the hit step has no id and there is no `connect_step`, Fit's `steps[i].id !== hitId` guard is `undefined !== undefined`, so no id-less step is ever trimmed ("Still 14 steps"). The proto does the same.
  - With no `connect_step`, the hit is "the last of the first 12". A trim before it moves the hit unless that step has a string id to pin. B writes `connect_step` for any string id, `""` included, and clears the hit's trim tag. A pins only a non-empty id.
- **B report-only:**
  - `shiftOther` normalises a non-finite or out-of-range other-side `start_at_ms` even on a 0 shift. A and the proto return early. Only reachable through a direct `fit()` call: join already clamps.
  - `hitStep` is `null` for a `""` id; the proto gives `""`. A matches B.
  - A disabled step with an unknown beat adds a `null` key (still ≤ 5).
- **Both hard-code `→ 48`** in the Capped count line instead of `PARTICLES.perEffect`. Report-only: the value is 48 by ruling.
- **For E7:** B's `beats` can carry an own `__proto__` key. Spread and JSON are safe; `Object.assign({}, beats)` would set the prototype. E7 should spread, not assign.

### The builder-specific splits (probes `chatB/probes/chatB-probe.ts`, `chatA/probes/chatA-probe.ts`, the same file run on each tree; proto = `ea207da1`)
| # | Split | Proto | A `0db98f9a` | B `80809a5d` | Verdict |
|---|---|---|---|---|---|
| 1 | hit id `""` / none in a blend | minted | minted, `connect_step` = minted, hitMs kept | same | Equal |
| 2 | Fit: `connect_step ""` | left `""` | set to the hit's id when non-empty | set to the hit's id for any string (incl. `""`), hit trim tag cleared | B is more defensive; same output on every probe (14-step docs, flatten) |
| 3 | Fit-trimmed moved part | chip kept | **chip kept** | dropped | **B is right** (rule 2: "a moved part left with no step is dropped") |
| 4 | `__proto__`/`constructor`/`toString` beats | NaN, 9 keys | **NaN, 9 keys** | 5 keys, null prototype, no NaN | **B is right** (ruling 15 / Law 13) |
| 5 | empty base + pick a | `[]` | **`["s-1"]`** | `[]` | B is right |
| 6 | Fit's count-line filter | `badCounts` | `badCounts` | own copy | A is better-pinned. B's copy is correct but was unpinned (M1) |

Other probes gave identical results in A and B: `""`, repeated and numeric hit ids; non-finite and out-of-range mix (NaN, ±∞, −5, 140, `"60"`, 49, 62.5); punch NaN/∞, one-sided, a absent, 3.0001, a string knob; meter counts (NaN, ∞, −1, −0, 0, 48, 48.4, 49, 1e308, `"9"`, null); 2×MAX_VALUE (no NaN); lines named once; empty and junk docs; marks with an empty doc, NaN/0/−30 `stepMs`; frozen inputs (no mutation, deterministic); mix one-sided and unpaired. Logs: `out/chatB-probe.log`, `chatA/out/chatA-probe.log`, `out/proto-probe.log`.

### QA pin (G6 candidate)
```
refs/cmp/ede4-chatB-qa-fix-a    6bbda79a0bb82ed4b24909c81cffafc2b7d61b00  (parent ChatB tip 80809a5d; G-TileEngine noreply author+committer)
tree                            1dcf5aa94d43bedec44e0a3a0b9bbaa2d63ae768
file                            tests/editor/effect-e4-qa4.test.ts  26 lines (cap 37)  3 tests  sha256 b84302cd19824c3f09bd256bafa45b5e6d8e143c2974e3d2ffce4a9a7639d1f2
gates on fix-a (floor 835)      835/0; typecheck, lint, deps 113/363, state, law exit 0; smoke 0 failed; sim/stress SAME
merge-tree onto a608f680        b91a9e07 (clean); probe refs/cmp/ede4-chatB-fix-merge-probe 9813ef98, gates PASS 835/0
bundle for EA                   /workspace/share/ede4-chatB-qa-fix-a.bundle (80809a5d..fix-a)  sha256 64f5ac311ce0a81c284b18ba8d552c9a49319129abee44e47c86d83b9f58df72  verifies
```
The three tests:
1. Fit's own Bad count and Capped count lines skip steps 13+ (NaN and 99 at step 13). Closes plant 77.
2. Ruling 15: with parts naming `__proto__`, `constructor`, `toString`, `valueOf` and `zap`, there are ≤ 5 beat keys, the 4 named beats come first, and no span is NaN.
3. Rule 2: a moved part whose only step Fit trims is dropped, and with an empty base a pick of `a` drops every B step.

| Tree | qa4 | Full suite |
|---|---|---|
| Proto `ea207da1` | 1/3 (tests 2 and 3 fail: the proto has A's defects) | – |
| A `0db98f9a` | 1/3 (tests 2 and 3 fail, by design) | – |
| B `80809a5d` = fix ref | **3/3** | **835/0** (floor 832 + 3) |
| B with plant 77 | 2/3 (test 1 fails) | – |

**EA:** adopting qa4 means the proto takes B's three fixes too. Tests 2 and 3 are separate, so EA can drop either one if it rules the other way. Test 1 alone is the G1 must-fix.

Plants on fix-a (`--plants-tests` = the 7 kit tests + qa4): the 116 kit plants are 116/116 CAUGHT. B's four extra plants (B1 plain-object beats, B2 no 5-beat bound, B3 parts filtered before Fit, B4 empty base protects B's first step) are 4/4 CAUGHT; with the kit tests alone they are unpinned. `plant-classify`: 77 and B1–B4 are ASSERT.

Size: 344 + 26 = **370** changed lines (150–400 band).

## Both builds: checks
| Check | ChatA `0db98f9a` | ChatB `80809a5d` |
|---|---|---|
| Bundle sha256 | `12267931…` (matches CoS; local staging) | `4b38c1d6…` (matches CoS; local staging re-checked after ChatA trashed B's Drive copies) |
| `git bundle verify` / prereq | ok / `5d4c00fb` | ok / `5d4c00fb` |
| Tip / code / commits | `0db98f9a` (tree `a021ebec`), code `e9c9a2a3` (tree `69e9d567`), 2 commits, all noreply | `80809a5d` (tree `c95711a0`), code `5f632999` (tree `276a57a2`), 2 commits, all noreply |
| Lines (excl. handback) | 345 (+333/−12, matches CoS) | 344 (+332/−12, matches CoS) |
| Per-file caps (fit / merge; cap 37/81) | 37/70 | 37/69 |
| Files | the step's 9 files + handback/; no scope creep | same |
| Kit tests 7/7 byte-identical | yes | yes |
| Merge-tree onto `a608f680` | clean, `06ce4eb0` (matches CoS) | clean, `7c044479` (matches CoS) |
| Gates on tip (floor 832) | 832/0; typecheck, lint, deps 113/363, state, law exit 0; smoke 0 failed; sim `afc89d56`/`b8007292` SAME; stress SAME | same |
| Gates on merge probe | `refs/cmp/ede4-chatA-merge-probe` `b24d7f7a` (tree `06ce4eb0`): same as the tip row | `refs/cmp/ede4-chatB-merge-probe` `2b487c49` (tree `7c044479`): same as the tip row |
| Law grep (src diff) | no Math.random/Date/timers/rAF/performance/ts-ignore/any/Card/Deck/hp/mana/cost/dynamic import; one clock untouched; UNIT/TILE untouched | same |
| Law 13 | **fails ruling 15 on prototype-key beats (9 keys)** | ≤ base + 12 steps, one badge per key, ≤ 5 spans (null prototype) |
| Punch caps 150/200/3, Capped line after Fit's | yes | yes |
| Counts: ceiling 48 + Capped count, bad = 0 + Bad count, lines first, post-trim numbering | yes | yes |
| Mix: non-finite 50, finite clamped 0..100, snapped | yes | yes |
| Hit by hitIndex; id-less/`""`/repeated id minted | yes | yes |
| Marks: runtime `stopMs`/`hitWhiteMs` | yes | yes |
| EA plants 77 (re-needled) | 77/77 ASSERT | **76/77** (77 PASS); 77/77 with qa4 |
| QA plants Q1–Q19, Q21–Q33, Q34–Q41 (39) | 39/39 ASSERT | 39/39 ASSERT |
| Total plants | **116/116** | **115/116**; 116/116 with qa4 |
| HANDBACK §0.6 | present but **thin**: 3 first-pass helpers cancelled with no verdict, 2 second-pass helpers re-read only, no adversarial probe ran. One claim is false ("fixed-size records") | present, full: 3 helpers, each found and fixed a real bug, plus a self-review against G1–G10 |
| Readability | dense one-liners. `badCounts` is shared by Fit and the meter (good). `(fa ?? 0)` is redundant after the finite guard | dense one-liners. Fit duplicates the count-line filter (the cause of M1). The punch delete chain is long |

Plant runs: `qa-plants.sh --plants-file` gives 116/116 CAUGHT on A, 115/116 on B, and 116/116 + 4/4 on B fix-a. `plant-classify` gives 116/116 ASSERT on A and 115 ASSERT + 1 PASS (77) on B. Each plant was re-needled with the same mutation: `chatA/probes/ede4-plants-chatA.py`, `chatB/probes/ede4-plants-chatB.py` (116 each). Where the proto shared one function (badCounts) and a build has two copies, the plant hits the copy named by the plant: B's 77 is Fit's copy and Q31 is the meter's. In A, 77 and Q31 are the same needle, as in the proto. A's plant 32 (tie → B) changes all four of A's winner sites.

## Drift (docs vs code) for EA
- **Ruling 15 / Law 13:** "≤ 5 beat spans: the 4 named beats plus an unknown one". The proto (and A) break it on `Object.prototype` beat names and return NaN spans. Suggest adding "beats are kept on a null-prototype map; a later unknown beat is skipped", and adopting qa4 test 2.
- **Rule 2 (rule 5 in the step doc):** "a moved part left with no step is dropped". The proto filters before Fit, so Fit's trims can leave a chip. Suggest "…after Fit", and adopting qa4 test 3.
- **Kit gap:** no shipped test feeds Fit a bad count past step 12 (plant 77 relied on the shared `badCounts`). qa4 test 1.
- B's `hitStep: null` for a `""` id (proto `""`). Unruled, report-only; A agrees with B.

## Repro
```
cd /workspace/tileengine-repo; E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e4/builds
git bundle verify $E/chatB/in/step-ed-e4-blend-core-r1.bundle     # same for chatA
TMPDIR=/tmp/q /workspace/cos-tools/qa-gates.sh 80809a5d --floor 832                           # 0db98f9a, refs/cmp/ede4-chat{A,B}-merge-probe
TMPDIR=/tmp/q /workspace/cos-tools/qa-gates.sh refs/cmp/ede4-chatB-qa-fix-a --floor 835        # and refs/cmp/ede4-chatB-fix-merge-probe
TMPDIR=/tmp/q /workspace/cos-tools/qa-plants.sh 80809a5d --plants-file $E/chatB/probes/ede4-plants-chatB.py --plants-tests "tests/editor/effect-e4{,-carries,-qa,-r2,-qa2,-r3,-qa3}.test.ts"
(cd $E/chatB/probes && node chatB-probe.ts; node proto-probe.ts); (cd $E/chatA/probes && node chatA-probe.ts; node p77.ts $E/chatA/wtA2; node pempty.ts $E/chatA/wtA2)
```
Logs: `chat{A,B}/out/gates-*.log`, `plants-*.log`, `classify-*.log`, `*-probe.log`.
