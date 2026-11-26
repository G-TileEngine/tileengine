# QA review: step 11a r2 guide (export MVP)

2026-11-26, QA & Build Guard. One review of the r2 kit, after the r1 review (`step-11a-guide-review.md`, NOT OK TO SEND).

**Verdict: OK TO SEND** once CoS fills the placeholders.

## Kit checked (sha256, all match the EA's message)
- Guide `step-11a-export-mvp.md` d44951f205c6294133a99f73526d9d184c4274722a8d120060f19b6ac4e7b39e
- Paste `step-11a-paste.md` 0fd7f6222812e685d0665906a995515af70a3e69245c8280671254335c6c21c1 (token placeholder only)
- Trial patch `s11a-trial.patch` 7542ce973678f4b8491df22881258ea1751914b49f1c19e4b03ee938ece0e9f3

## Re-trial (fresh worktree on main 90c9cb9f)
- Count 391/400 (10 files, +387 −4). Green 1165 pass, 0 fail. tsc: the 3 base errors only.
- All 22 smokes pass solo (s11a 8818 r1, 6 ok). Export audit 135 / 149 / 149, AUDIT PASS. git status clean.
- Own mutations, 7 of 7 caught: save-fail stop removed, any-segment `.deleted` doc filter removed, a U+2028 rewrite put back, `notes/` dropped from KEEP_OUT, the empty-board refusal removed, the asset `.deleted` filter removed, a null readBlob skipped.

## r1 findings and rulings, checked in code
- Must-fix: `buildNow` now returns when the save fails (`if (state.dirty) return;`). Fixed.
- DSK E5(a): no document under any `.deleted/` folder, no `notes/`, `sprite-recipes/`, `.tmp` or non-JSON file; assets under `.deleted` kept out too. Met.
- DSK E5(b): each saved document goes into the module byte for byte; `safe()` is gone. Met.
- DSK E7(iii): `load/migrate.js` rides; the audit test finds no `project-write`, no `migrations/` folder and no file-writing call in the unzipped game. The new gate check (a v4 map built straight after opening plays the same docs from the zip as in Test) is test 4. Met.
- r1 carries: the empty-board refusal is asserted, a null readBlob throws, playBase refuses a page not under `/maker/`, build.json is shape-checked. All fixed.
- CEO quote reads "top [sic: too]". Helpers are all listed.

## Carries (not blocking)
- The save-fail stop is tested by matching `home.ts` source text, not by behaviour. A later DOM test should fail a save and check no download starts.
- `filesModule` writes `text[path] ?? ""`; the key always exists, so the default is dead code. Drop the `?? ""` when the file is next touched.
