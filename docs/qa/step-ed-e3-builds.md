# Step ED-E3 builds A/B (G2 match → picture link): QA pick

QA & Build Guard · 2026-11-16 18:20 Europe/London (GMT). Kit r3: step doc `handoff/steps/step-ed-e3-match-link.md` `d10d2bcd…`, proto `fee4f953` (tree `c49225d0`), kit list `/workspace/share/step-ed-e3/push-sha256.txt` `037a9d01` (7/7), base `3aa3551f`. Main is now `5868810b` (tree `f8997972`): one commit on `525faa91`, "kit: step ED-E3 match link (step doc + tests + paste)", 7 files +720, all under handoff/ and docs/pastes, every sha256 matching the kit list. The five kit tests are byte-identical in both builds (`e3d06bed`, `0709a640`, `0fe9d665`, `c2d1403f`, `2f88a042`). Bundles and handbacks were copied into `qa-runs/effect-designer/e3/builds/in/` before use; the Drive-fresh copies are byte-identical to the staged ones. That folder holds the evidence too. No messaging, no GitHub/Drive writes, no EA file edited, no existing ref moved. The handbacks' "PR opened by CoS" line was ignored.

## Pick: **ChatB** (`3970bfd9`). **OK TO OPEN PR on `refs/cmp/ede3b-qa-B-fix-b` (`7482c26c`)** once EA adopts the QA pin (G6). If EA declines the pin, B's tip as shipped is OK TO OPEN PR (no must-fix on B)

Why ChatB: both builds pass every hard gate, before and after merge onto `5868810b`, and both catch all 82 plants. The difference is behaviour the kit doesn't cover. A has one real bug (nearestFoe can return the caster's own id) and one deviation from the proto (it drops a finite patch axis). B matches the proto on both. B's two deviations (note order, NaN map size) only show on diagnostics or host-bug input. B is also smaller: 274 lines vs 299, and match-link.ts is 68/97 vs 93/97.

### The splits (probes: `probes/split-probe.ts`, `probes/foe-dup.ts`, `probes/diff-fuzz.ts`; proto = `fee4f953`)
| # | Split | Proto | A `09f7c19f` | B `3970bfd9` | Verdict |
|---|---|---|---|---|---|
| 1 | overCap note order (1032 rows) | first | first (= proto) | last | Unruled: ruling 5 doesn't order it and ruling 3's "row order" covers row notes only. Diagnostic only. **EA to rule** (report-only) |
| 2 | non-finite matchPatch axis | per axis | **both axes → 3×2** | per axis (= proto) | **B is right.** The proto's `size()` is per axis. A turns `{7, ∞}` into 3×2 (proto/B: 7×2) and `{NaN, 5}` into 3×2 (proto/B: 3×5), so a finite axis the designer asked for is lost. A declares this in its handback. Pinned (qa2 test 1) |
| 3 | `art.cols`/`rows` NaN | keeps units | keeps units (= proto) | every unit `outOfRange`, 0 units | Ruling 3 lists `c ≥ art.cols`, which A and the proto follow. B's `!(c < cols)` is the same for every number except NaN. A NaN map is a host bug (matchPatch already returns null for it), and B flags it loudly. Not declared in B's handback. **EA to rule** (report-only) |
| 4 | rev memo | `lastRev` + `unitMemo` | bump on `unitMemo?.rev !== rev` | separate `seenRev` | **Equivalent.** Seeded fuzz of 40 links × 100 frames (rev ∈ {none, 1, 2, 3, NaN, ∞, 1.5}, in-place unit edits, new arrays, in-place effect pushes, a changed mapSeed): the 4000 frames give the same unit-key calls, standing and overlays in the proto, A and B (sha `af094544`, 198 memo hits) |

**New finding (CoS's list missed it): A's nearestFoe can return the caster itself.** A never skips `id === caster`; it relies only on the side check. Repro: `{units: [me/player@0, me/wolves@1, w9/wolves@4]}` with `foes ["wolves"]`. The proto and B return `w9`; **A returns `"me"`**, so the preview effect targets its own caster. sceneFromMatch keeps the first `me` (ruling 3). Fuzz: 4/2000 snapshots differ, all from this cause. **A must-fix if A were picked.** Pinned (qa2 test 2).

Differential fuzz (2000 seeded snapshots, `out/fuzz-*.txt`), with sorted notes compared as well:
- **sceneFromMatch units:** 0 diffs between the proto, A and B.
- **Notes:** order only.
  - B vs the proto: 67 diffs = 55 overCap (split 1) + 12 facing/offset.
  - A vs the proto: the same 12 facing/offset diffs.
  - After sorting: 0 diffs.
- **matchPatch:** 229 diffs between A and the proto/B, all from split 2. B = proto.
- **nearestFoe:** the 4 A diffs above. B = proto.

### QA pin (G6 candidate, both splits that matter)
```
refs/cmp/ede3b-qa-B-fix-b       7482c26ccc80321d4c72347929c04f9fcb0b69b5  (parent ChatB tip 3970bfd9; G-TileEngine noreply author+committer)
tree                            a6ae6e674e70375e806bdc56dc6e2e76e4d659a7
file                            tests/runtime/scene/match-link-qa2.test.ts  18 lines (cap 37)  sha256 cc7f6e1918fde0e8004282ab2dc5af302e01ee5c5b42af921087a7cdd273d2b6
merge-tree onto 5868810b        14463c06f6479007644397fa5e66e949b61c11d6 (clean); probe commit refs/cmp/ede3b-qa-merge-B-fix-b a47bb723
bundle for EA                   /workspace/share/ede3b-qa-B-fix-b.bundle (3aa3551f..fix-b)  sha256 d50acb49…  verifies
```
The two tests:
1. A non-finite axis falls back on that axis only. On a 20×20 map with the caster at (10, 10): `{NaN, 5}` gives 3×5 @9,8; `{7, ∞}` gives 7×2; `{−∞, 0.5}` gives 3×1; `{NaN, 30}` gives 3×16. `{NaN, NaN}` on a 12×1 map gives 3×1.
2. nearestFoe never returns the caster's own id: a later row with the same id on a foe side is skipped, and a foe list that holds only that row gives null.

| Tree | qa2 | Full suite |
|---|---|---|
| Proto `fee4f953` | **2/2** | – |
| A `09f7c19f` | 0/2 (both fail, by design) | – |
| B `3970bfd9` = fix ref | **2/2** | **805/0** (floor 803 + 2) |

Split plants on B (`probes/plants-splits-B.py`, A's behaviour planted into B):
- Kit tests only: 4/4 PASS (missed).
- With qa2: S2 (axis) and S4 (caster id) are ASSERT. S1 (note order) and S3 (NaN map) still PASS: they're unruled, so QA didn't pin them.

An earlier 13-line axis-only draft, `refs/cmp/ede3b-qa-B-fix-a` `8ad9a09e` (gates PASS 804/0; merge probe `404e1655`, tree `b69ec15b`, PASS), is **superseded** by fix-b. Ignore it.

Size: 274 + 18 = **292** changed lines (150–400 band).

## Both builds: checks
| Check | ChatA `09f7c19f` | ChatB `3970bfd9` |
|---|---|---|
| Bundle sha256 | `23087d82…` (matches CoS; Drive-fresh copy identical) | `c67aa315…` (matches CoS; Drive-fresh copy identical) |
| Tip / code / commits | `09f7c19f`, tree `da15053b`, code `aee4b5a1`, 2 commits, all noreply | `3970bfd9`, tree `6e8df49b`, code `f80aac33`, 3 commits (`94a8c51` draft, `f80aac3` spelling fix, handback), all noreply |
| Headcheck | PASS; branch starts at `3aa3551f`; 5 pins empty diff; kit shas 5/5 | same |
| Lines (excl. handback) | 299 (matches CoS) | 274 (matches CoS) |
| Per-file caps (match-link / world-scene / match-picture / host-guide; cap 97/10/33/6) | 93/8/25/2 | 68/8/25/2 |
| Files | the step's 9 files + handback/; no scope creep | same |
| Merge-tree onto `5868810b` | clean, `1723c406` (matches CoS) | clean, `2d2ee32b` (matches CoS) |
| Gates on tip (floor 803) | 803/0; typecheck, lint, deps 112/357, state, law exit 0; smoke 0 failed; sim `afc89d56`/`b8007292` SAME; stress SAME | same |
| Gates on merge probe | `2c09e8dc` (tree `1723c406`): identical to the tip row | `821941a2` (tree `2d2ee32b`): identical to the tip row |
| Quoted interfaces (13 lines) | all verbatim | all verbatim |
| SceneAsset / SceneLayer spelling | correct | correct. The first commit's `SceneWorld["assets"/"layers"]` is gone from the final tree (`git grep` clean), fixed by `f80aac3` |
| Law grep (src diff) | no Math.random/Date/timers/rAF/performance/ts-ignore/any/Card/Deck/hp/mana/cost/dynamic import; one clock (the scene link's), UNIT/TILE untouched | same |
| Law 13 | one match-link entry, one scene unit memo; per-call Sets ≤ 1024; reads ≤ 1024 rows | same |
| EA plants 56 (re-needled per build) | 56/56 ASSERT | 56/56 ASSERT |
| QA plants Q1–Q19 (Q8 retired) + R1–R8 | 26/26 ASSERT | 26/26 ASSERT |
| nearestFoe self-target | **bug** (returns the caster's id) | correct |
| HANDBACK §0.6 | present, full: 4 helpers + self-review. Declares splits 1 and 2 | present, full: 3 helpers + self-review. Declares split 1 and the typo fix; not split 3 |

Plant runs: `qa-plants.sh --plants-file` is 82/82 CAUGHT on each tip and on fix-b. `plant-classify` is 82/82 ASSERT on each tip and 82/82 on B + qa2. Every catch is an assertion failure, not a load failure. EA's proto needles don't match the builds' text, so each plant was re-needled with the same mutation: `probes/plants-A.py`, `probes/plants-B.py` (82 each). Plant 6 (prototype key as a sprite) drops both of each build's guards, because the builds also check `typeof sprite === "string"`.

## Drift (docs vs code) for EA
- **Ruling 9 / test 10:** "a non-finite size is `MATCH.board` 3 × 2" can be read as both axes, which is A's reading. The proto's `size()` is per axis. Suggest: "a non-finite axis takes that axis of `MATCH.board` (3 cols, 2 rows)", and adopt qa2.
- **Ruling 10:** "the nearest living unit … other than the caster" should say the caster's id is never returned (repeated-id rows). The proto and B skip `id === caster`; qa2 test 2 pins it.
- **Ruling 3 vs a NaN `art.cols`** (split 3) and **overCap order** (split 1): unruled. Report-only. Either answer is a 1-line change in B.
- **Ruling 4 note order:** both builds push `facing` before `offset` for one row, which follows the doc's wording. The proto pushes `offset` first. Unruled, report-only.
- Both builds treat an own sprite key with a non-string value as `unknownRef`; the proto would emit it. Unreachable through `MatchArt`'s type. Report-only.

## Repro
```
cd /workspace/tileengine-repo; E=/workspace/tileengine/docs/qa/qa-runs/effect-designer/e3/builds
/workspace/cos-tools/qa-headcheck.sh $E/in/chatB/step-ed-e3-match-link-r1.bundle 3aa3551f $E/in/kit-list.txt --name ede3b-qa-B   # same for chatA
TMPDIR=/tmp/q /workspace/cos-tools/qa-gates.sh refs/cmp/ede3b-qa-merge-B --floor 803        # same for -A, -merge-A, -B
TMPDIR=/tmp/q /workspace/cos-tools/qa-gates.sh refs/cmp/ede3b-qa-merge-B-fix-b --floor 805
(cd $E && for t in P A B; do node probes/split-probe.ts $PWD/wt$t; node probes/foe-dup.ts $PWD/wt$t; done)   # wtP = proto fee4f953
(cd $E/wtB && python3 ../../probes/plant-classify.py . ../probes/plants-B.py tests/runtime/scene/{match-link,match-patch,match-link-qa,scene-fence-qa,scene-fence}.test.ts)   # 82 ASSERT
```
Logs: `out/headcheck-*.log`, `out/gates-*.log`, `out/plants-*.log`, `out/classify-*.log`, `out/split-probe-*.log`, `out/revfuzz-*.txt`, `out/fuzz-*.txt`, `out/foe-dup-*.log`, `out/pin-*.log`.

### Outcome (added 2026-11-16 18:32 London)
- **EA rulings (18:20), report-only, no change to B:**
  - Split 1: overCap goes last, after every row note (ruling 5 gains this line). B is right.
  - Split 3: a non-number `art.cols`/`rows` has no inside cells, so every placed row is `outOfRange` (ruling 3 is reworded to 0 ≤ c < cols, 0 ≤ r < rows). B is right. B's handback not declaring it goes in EA's merge doc.
  - Rulings 9 and 10 adopted in QA's wording.
- **G6:** EA adopted `match-link-qa2.test.ts` (cc7f6e19) as `7482c26c` (805/0, 82/82 plants).
- **PR [#57](https://github.com/G-TileEngine/tileengine/pull/57):** head `7482c26c` (tree `a6ae6e67`) is the same commit as QA's gated `refs/cmp/ede3b-qa-B-fix-b`. The verify PASSED, with merge-tree `14463c06` equal to the gated probe `a47bb723`.
- **Merged:** main `b28192c7` (tree `14463c06`, parents `5868810b` and `7482c26c`, --no-ff, noreply). `qa-postmerge.sh` PASS: pins 5/5, npm 805/0 (floor 805), smoke 0 failed. **ED-E3 CLOSED.**
