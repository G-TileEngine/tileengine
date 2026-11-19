# QA review: docs/rebuild records (baseline through S1b)

QA & Build Guard, 2026-11-19, Europe/London. Read-only. Fresh `git fetch -q origin` on `/workspace/tileengine-repo` (`origin/main` `772f7aa27e0e27333ef54bf9dd68641a952b959c`), `TMPDIR=/tmp/q`. Records in `/workspace/share/steps-record/docs/rebuild/`. No GitHub writes and no edits to the records or other bots' files.

## Receipt

All five files match the given sha256 and line counts:

| File | sha256 | Lines |
|---|---|---|
| `README.md` | `d450c18701c502e7b6ebe919508e7e98ac33769b98da1a73b0fe9cc88b5c627c` | 48 |
| `baseline.md` | `270d1d1fb6ff81fafc0d4f790877a8716425e73ef906ca817291cffbe6fda946` | 844 |
| `step-00.md` | `fb1f5c7dee5efb1e99d0b2569b5ecb998ac8e48bd038825a30893cf0121f86f3` | 1123 |
| `step-01a.md` | `01a03e72dd8440393c8af9f05ead79f0f94c918bdb38338394e5492d45568e10` | 2308 |
| `step-01b.md` | `34f22d392dfe4b6987fcabd79d9ad24c93fc36d9babc899f2b188b498bbdd9e3` | 2159 |

## Verdicts

| File | Verdict |
|---|---|
| `README.md` | OK |
| `baseline.md` | OK |
| `step-00.md` | **NOT OK**, one must-fix |
| `step-01a.md` | OK |
| `step-01b.md` | OK |

Hold the push until `step-00.md` (e) is corrected. The other four can stay as they are.

## Must-fix

1. **`step-00.md:146` tells a first-time builder to ship the post-1b smoke, which would not match this step's blob table or (f) sha256.** As merged in S0 (`9a9ca90e`, blob `101f87e0…`, sha256 `a4a607b2f4ff4453d1ac53ecc20e39b9750ec95d96a4061ce3e6a42a0df7f68a`) the smoke looks units up by `unitId` (`knight`, `archer`, `wolf`, `villager`). The sprite-id lookup (`starter:hero-sword`, `starter:hero-staff`, `starter:enemy-wolf`, `starter:npc-villager`) is the `9fc49890` refreeze (sha256 `d528795e…`), already recorded correctly in (d) 10 and in `step-01b.md`. Replace the last bullet of (e) with:

   `- As merged in S0, the smoke finds units by \`unitId\` (\`knight\`, \`archer\`, \`wolf\`, \`villager\`). That is the blob in this file and the sha256 in (f). After 1b the official smoke was refrozen to look up by scene sprite id (\`starter:hero-sword\`, \`starter:hero-staff\`, \`starter:enemy-wolf\`, \`starter:npc-villager\`); see \`step-01b.md\` (d) 7. Renaming a starter sprite means updating that later smoke in the same push.`

## 1. Bug histories

Section (d) in each step matches the QA reviews. Nothing material was invented.

- S0: kit r1 had no `page.ts` / 360 gate (test 10 was a grep); N dropped 10→9; test 5's vacuous pan was fixed (120 CSS px left, `cam.s === 18`, `cam.y === 34`, `cam.x` +20); kit r2 smoke missed walk, Talk and a second action; the 70-line smoke cap became 130; the bot-wrap and headless `cam.s` fixes, the 15 ui-shell lint errors from `15f73fb`, the later `8a737c5f` ignore, and the TP-4 / 280 ms flags all match `step-s0-kit-review.md`, `step-s0-kit-r2-review.md` and `step-s0-handback-review.md`.
- S1a: r1 allowlist keyed by `file:line` (could hide a parse at `build.ts:13`); r2 rekeyed by exact text (`619ec5fd`, no rebase); the line-13 repro is the one from `step-s1a-handback-review.md`. The r2 push 403 is labelled as Chief Of Staff delivery notes only. The `check-law.sh` empty-catch flag and the 1b carries (empty allowlist, tighter `kind ===`, `.json.js` at minSdk 26) are present.
- S1b: r1 smoke threw at `touch-smoke.mjs:32` on `unitId === "knight"` once the knight became `unit_01JDAN00000000000000000001`; the HANDBACK omitted the smoke; r1 merged as-is (`57af7135`); CoS refroze the smoke in `9fc49890` (3 lines, four lookups by scene sprite id, sha256 `d528795e…`). The `RECIPES` alias flag, U+2028/U+2029 carry, empty `ALLOW`, and plan overruns match `step-s1b-handback-review.md`.

## 2. Commits, trees, blobs, appendix

Every commit, parent, tree and date cited in the narratives resolves on `origin/main` and matches git (`1b834c31` tree `12f833ed`, `9a9ca90e` tree `ea99548c`, `aa158fda` tree `48020092`, `57af7135` tree `b0064a55`, `9fc49890` tree `b0bc4faf`, plus the named r1/r2/handback trees). `tools/play-stage` at `f137ca26` / `9a9ca90e` is `010d1a21`. `src/` and `tools/play-stage` are identical between `50105702` and `1b834c31`. `9fc49890..772f7aa2` is docs only.

All 53 blob-table rows (7 + 28 + 18) match `git ls-tree` and newline counts at the named commit. Shortstats match: S0 six files 214+42=256, smoke 107; S1a r1 379+8=387, r2 tip `4c41903e` 390+8=398; S1b 229+75=304, code commit 199+75=274. Smoke and unit-test sha256 values in (f) match `git show`.

Appendix check was of **every** shipped file, not a sample: 53 full-file blocks equal `git show <merge>:<path>` byte for byte (the 1b smoke at `9fc49890`). All 21 recorded diffs equal `git diff <base>..<merge> -- <path>`, and the 1b smoke commit block equals `git show 9fc49890`. The S1a History r1 test equals `5cf1a0fe:tests/project/load/one-parser.test.ts`, and its r2 diff equals `git diff 5cf1a0fe..4c41903e`. 74/74 comparisons matched.

Baseline inventory is exact: 148/7281 `src/`, 31/1460 `tools/`, 184/10538 `tests/`, 3/99 `scripts/` (366 files, 19,378 lines); all 366 file-by-file line counts match `git show 1b834c31:<path> | wc -l`. Config line counts and the 127/7,834 frozen kit tests plus 3/1,752 `ui-shell` code files also match. Package pin and `.nvmrc` 24 are as written. `8a737c5f` adds `ui-shell/**` to the eslint ignore list (one line, plus unrelated style docs).

## 3. Secrets

None found. No `ghp_`, `github_pat_`, `gho_`, `xox`, `sk-`, `AKIA`, private keys, passwords, bearer tokens, phones, or IMEI/serials. The only email is the public `G-TileEngine@users.noreply.github.com`. `GH_BUILDER_TOKEN` is named as a variable, never given a value. The shipped smoke (faithfully copied) defaults `PLAYWRIGHT_CORE` to `/workspace/node_modules/playwright-core/`; (f) already requires the env override.

## 4. Could a cold AI follow it to `772f7aa2`?

Yes, once must-fix 1 is applied, if they use this repo and the named start commits: checkout `1b834c31` and verify (d); apply the S0 appendix and check 1023 plus smoke `a4a607b2…`; start 1a from `f137ca26` (this already includes the `8a737c5f` lint ignore); apply the 1a appendix and check 1034; start 1b from `aa158fda`; apply the 1b appendix, then the `9fc49890` smoke, and check 1036 plus smoke `d528795e…`. Engine and test code at that point equals `772f7aa2`. Intervening docs-only commits do not need to be rebuilt. Known caveats (machine-drawn baseline one-liners; lint fails `green` before 1a) are stated and correct.

## Nits (not must-fixes)

- `step-00.md:145` says “today `main`” makes `npm run green` exit 0. That is true after `8a737c5f`, not at the S0 merge; (f) already says lint still fails there.
- Each step's (f) states the test count but not the merge tree id. The blob tables pin the shipped files; adding `git rev-parse HEAD^{tree}` (S0 `ea99548c`, 1a `48020092`, 1b merge `b0064a55`, refreeze `b0bc4faf`) would catch extra files outside those path diffs.
- `8a737c5f` has no appendix. 1a correctly starts on `f137ca26`. That commit is not docs-only: it is the `eslint.config.mjs` ignore for `ui-shell/**`. A builder who continues from the S0 merge without checking out that base will fail `green` on the old 15 lint errors.
- (f) smoke commands leave `PLAYWRIGHT_CORE` and `CHROME` as placeholders. QA used playwright-core@1.59.1 and `/usr/bin/google-chrome`; the builder's 1.64.0 run also passed. Pin one, or say both are accepted.
- The baseline “By folder” table rolls a few nested dirs into the parent (for example `btf-defaults` into `src/btf-adapters/src/`). Area totals and the file-by-file table are exact.
