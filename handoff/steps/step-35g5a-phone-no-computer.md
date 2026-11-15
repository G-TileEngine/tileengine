# step-35g5a-phone-no-computer: the phone test with no computer (post-34 polish plan, slice G5a; CEO yes on the website copy 2026-11-15 06:04; no CN; tools/ and one QA doc only)

Step id: step-35g5a-phone-no-computer          Revision: r<N> (r1 first; r2, r3… only after a REJECT)
Repo: https://github.com/G-TileEngine/tileengine (read only; you push nothing; see Delivery)
Base commit: **`acc695ad`** (`acc695ade5008b0fe6623b48de1cb566dcf896cf`, main after the CN-only data push "Data D1: CN-019 effect ramps format (new), CN-017 D1 note" on `3fba1dff`; two files under `handoff/change-notices/`, no overlap with this step; verified 685/0, pins unchanged). Branch: `step/step-35g5a-phone-no-computer-r<N>`, created from the Base. The PR targets `main`. Never commit to `main`. The diff is always `<Base>..<head>`.
Delivery (CN-003): `git bundle create step-35g5a-phone-no-computer-r<N>.bundle acc695ad..step/step-35g5a-phone-no-computer-r<N>`, then `git bundle verify`. Upload the bundle plus a copy of HANDBACK.md to the CEO's Drive. HANDBACK.md's PR line reads `PR: opened by Chief Of Staff from the bundle`. On Drive, never move, rename, overwrite or delete a file you did not upload in this chat; if a file with your bundle's name is already there, upload with a `-2` suffix.
Hand-back location: `handback/step-35g5a-phone-no-computer/r<N>/HANDBACK.md` (shape: `handoff/HAND-BACK.md`), committed as the branch's last commit. Quote this step file's sha256 in full in it.
Depends on: step 34b, merged (`tools/serve.ts`, `tools/device-page/page.ts` and `index.html`, `docs/qa/device-runs/TEMPLATE.md`, the export gate in `tests/runtime/perf-34b.test.ts`). No format change, no CN, no `src` change, no import line moves.
Read first: BUILD_GUIDE.md §0 (§0.6 helpers: the helper rule; HANDBACK needs § Helpers & self-review), §3 (the `tools/` row), §6 (green), §7; QA's kit review `docs/qa/step-35g5a-review.md` (`c27b493d…` for r1: M1 and the qfix, N1; QA's r2 review: M2 and the r2 qfix); `/workspace/scratch-ea/post34-diagnosis-plan.md` (`f2795ca0…`) items 41, 48, 49 and slice G5a; QA's answers `docs/qa/post34-answers.md` (`6cf3c97d…`) §1 and the Termux run; `/workspace/scratch-ea/integration-seams.md` (`9bda3899…`) P-34b-6.
Kit: kit-1 r3 (guide-3), 2026-11-15. Engine Architect. r3 is exactly r2 (`6dea7192`) plus QA's r2 qfix `f3233af9` (QA's M2: `build()` wiped any folder whose build.json merely had the right shape, a `.git` and other files with it; QA added `onlyBuild`, two QA test cases and a one-line check-test reset; patch sha256 `f8a2a59a…`, re-applied byte-exact: same sha and tree). r2 adopted QA's r1 qfix `cd045765` (M1) and N1, re-based on `acc695ad`, and added the build.json shape check and the inline icon. Proto `/tmp/r35g5a` branch `g5a-r3`, head `f3233af9` (`f3233af9591dfa90e97dfc57681b686ccd74ca1e`, tree `014cd2ac`, parent `6dea7192`; history `acc695ad` → `cd005359` r1 → `d85b11b2` QA qfix → `6dea7192` r2 → `f3233af9` QA r2 qfix; G-TileEngine noreply): 6 files, +246/−13 = 259 changed lines; green 692/0 (685 + 7); EA plants 30/30, QA plants 13/13, 7/7 new tests fail on the Base; the built page served under `/tileengine/device-page/` reaches DONE in mobile Chromium with no request outside the sub-path. Bundle backup `/workspace/scratch-ea/kit-backup-g5a/` (r1 in `r1-3fba1dff/`, r2 in `r2/`).
Carries: none filed. `package.json` (`1e5dd82c…`), the lock (`d7f64a09…`), `.dependency-cruiser.cjs` (`45a3dbaa…`), `scripts/check-law.sh` (`4d7bbf48…`) and `src/types/core-types.ts` (`d6d08696…`) unchanged.

> Working style (REQUIRED): use your helper agents for review, tests and cross-checks, take your time, and self-review against Acceptance + the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
The CEO has Android phones (Samsung Galaxy S21 Ultra, Red Magic 9 Pro) and a tablet, no computer. After this step he can run the phone test page two ways without one. (1) A website copy: `node tools/device-page/build.ts <folder>` writes a ready-to-run, types-stripped copy of the page and exactly the files it loads, with a `build.json` naming the commit, the Node version and each file's sha256, and refuses to run on a checkout with a tracked edit or for any commit but HEAD; `node tools/device-page/check.ts <folder>` proves the copy is byte-for-byte what that commit makes. The Chief Of Staff publishes it to gh-pages under `/device-page/`. (2) Termux on the phone: `node tools/serve.ts` no longer crashes when Android hides the network addresses, prints the real port, explains a busy port and a too-old Node in one plain line, and the device log tells him how, website first.

## Rulings
All rulings are EA (this kit) on EA's G5a brief (2026-11-15 06:20 London), EA's r2 and r3 rulings (14:03, 14:36) on QA's r2/r3 reviews (14:02, 14:35) and the post-34 plan v2 (every teammate agreed), with the CEO's Q6 answer (06:04: yes to a gh-pages copy; his phones are Android), QA's answers (`6cf3c97d`) and QA's kit review (`c27b493d`) unless a source is named. Every one is pinned.
1. **Node version check** (QA §1: v23.5.0 crashes with `ERR_UNKNOWN_FILE_EXTENSION ".ts"`): `nodeOk(version)` is true for v22.18+ on the 22 line, v23.6+ on the 23 line and any v24+; false below. Run directly, `serve.ts` checks first and on false prints exactly `This needs Node v22.18 or newer (on the 23 line, v23.6 or newer). This computer has v<version>. Install a newer Node, then try again.` to stderr and exits 1, before listening. Pinned by: "serve: Node below v22.18, or v23.0 to v23.5, gets one plain line and exit 1 before serving (step 35g5a)".
2. **Termux fallback** (QA: `networkInterfaces()` throws `ERR_SYSTEM_ERROR` error 13 on Android): `links(port, list)` catches the throw and returns `http://127.0.0.1:<port>/tools/device-page/` then `(on this phone; to open it from another phone, find this phone's IP in Wi-Fi settings and use it instead of 127.0.0.1)`. The server keeps serving. Pinned by: "serve: a phone that hides its network addresses (Termux) keeps serving and prints its own 127.0.0.1 link with the real port and the Wi-Fi hint (step 35g5a)".
3. **Links and the real port** (plan item 41): one link per IPv4, non-internal address, in Node's order; none → the 127.0.0.1 link then `(on this computer or phone only; join the Wi-Fi to open it from another phone)`. The port printed is the bound one, never the asked one. The test closes its server in `finally`, so a failing assert can never leave `npm test` hanging (QA N1). Pinned by: "serve: port 0 prints the bound port, one link per IPv4 Wi-Fi address, the phone's own link when there is none (step 35g5a)".
4. **Busy port** (plan item 41; QA: "any program"): `serve()` rejects with the listen error (`EADDRINUSE`). Run directly, it prints exactly `port <p> is already used by another program; close it or run node tools/serve.ts <p+1>` to stderr, nothing to stdout, exit 1; any other listen error prints `the server could not start: <message>`, exit 1. Pinned by: "serve: a busy port prints the friendly line naming the next port and exits non-zero; serve() rejects with EADDRINUSE (step 35g5a)".
5. **Website copy** (CEO Q6; plan G5a): `build(out, commit, root?)` starts at `tools/device-page/page.ts`, strips types with `node:module` `stripTypeScriptTypes(…, { mode: "strip" })`, reads the import set from the **stripped** text (type-only imports never ship), renames each relative `.ts` import to `.js` in place (GitHub Pages serves `.ts` as `video/mp2t`), refuses a non-relative import, writes each file at its repo path with `.js`, and writes `index.html` as `toHtml(<tools/device-page/index.html>)`: `src="./page.ts"` → `src="./tools/device-page/page.js"`, and `<link rel="icon" href="data:,">` right after `</title>` so the browser asks for no `/favicon.ico` outside the sub-path (QA optional item; r2). Every path is relative. `commit` must be a full 40-character sha. `out` must be empty, or hold a `build.json` that `ours()` accepts (exactly the keys `commit, node, entry, files` in that order, a 40-hex commit, a string `node`, `entry` `"index.html"`, an object `files`; r2) **and** for which `onlyBuild(out, text)` holds: every file in the folder, at any depth, is `build.json` or a file that build.json lists, so a copied build.json never takes other files or a `.git` with it (QA M2, r2 qfix `f3233af9`; empty folders such as an empty `.git/` do not count). Otherwise it throws `build: <out>/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder` and deletes nothing. A lone earlier build is still replaced. Pinned by: "gh-pages build: exactly the page's runtime import set, types stripped, .js names, relative paths, build.json with commit and sha256; the check passes (step 35g5a)" and, for `onlyBuild` and the shape check, Ruling 6's QA test.
6. **build.json names only the commit the files come from** (QA M1, qfix `cd045765`): `{ commit, node, entry: "index.html", files }`, two-space JSON plus a newline, `files` sorted by path, each value the file's sha256 hex; `build()` returns that text. Run directly, the commit is always `git rev-parse HEAD`; `refuse(head, asked, dirty)` makes the command exit 1 and write nothing when a commit argument is given and is not HEAD (`build: <asked> is not the checked-out commit <head>; check it out first`) or when `git status --porcelain --untracked-files=no` is not empty (`build: the checkout has uncommitted changes; build.json must name a real commit`), with or without a commit argument. The usage line reads `usage: node tools/device-page/build.ts <out folder> [commit, which must be HEAD]`. Pinned by: "QA 35g5a: build.json names only the commit the files come from: a tracked edit or another commit is refused, with or without a commit argument".
7. **The check** (plan G5a; QA M1): `check(out, root?)` returns one line per problem, `[]` when clean: a file that ships but is not listed; a listed file that is missing; a sha256 that differs; a file that is not its stripped source (only `.ts` → `.js` in imports may differ; `index.html` must equal `toHtml` of the source); an import that does not ship; a file nothing the page loads imports; a rebuild from `build.json`'s commit that is not byte-equal (naming both Node versions if they differ). Run directly it applies `refuse(HEAD, build.json's commit, status)` first (lines start `check: `), so it never vouches for a dirty checkout or another commit, prints `check ok` or the lines, and exits 0 or 1. Pinned by: "gh-pages check: an extra, missing, changed or unstripped file, an import that does not ship, or a stale build each fail (step 35g5a)" and Ruling 6's test.
8. **Nothing ships, nothing moves** (BUILD_GUIDE §3, law 13): no `src` change; `src` never imports `tools/`; `package.json` exposes no tool; the 34b export gate is unchanged and passes. Pinned by: "export gate: nothing under src reaches tools/ (phone page, pixel suite, dev server), the dev overlay or tests, and package.json exposes no tools (step 34b)" (unchanged).
9. **Device log** (CEO Q6; QA's Termux run; user r2): `docs/qa/device-runs/TEMPLATE.md` is replaced by the shipped copy: Node v22.18+, v23.6+ on the 23 line (v23.5 crashes); "No computer? (Android phone)" puts the website link first, then the Termux steps (F-Droid, `pkg install nodejs git`, `git clone --depth 1`, battery Unrestricted, `termux-wake-lock`, `node tools/serve.ts`, the step-3 notes apply, "served from this phone", another phone by IP with **the port from the printed link**, or by hotspot with the address read **on the other phone: Settings, Wi-Fi, the hotspot network, Router (or Gateway)**, Ctrl+C); the busy-port and too-old-Node lines; the fields "Android version and browser", "Power saving on?", how the page was opened, and Termux: did the link open; row 5 "Power saving on (Android: Settings, Battery, Power saving)". No iPhone wording. Pinned by: the shipped file's sha256.

## Files to create or change
- change `tools/serve.ts` (≤ 40; Rulings 1–4)
- create `tools/device-page/build.ts` (≤ 60; Rulings 5–6)
- create `tools/device-page/check.ts` (≤ 40; Ruling 7)
- create `tests/tools/phone-no-computer.test.ts` (shipped, verbatim)
- create `tests/tools/qa-35g5a.test.ts` (shipped, verbatim; QA's qfix tests, r1 and r2)
- change `docs/qa/device-runs/TEMPLATE.md` (shipped, verbatim; Ruling 9)

Size: 150–400 changed lines. The proto changes 259 lines (+246/−13) in 6 files:

| File | Base → proto / cap |
|---|---|
| `tools/serve.ts` | 24 → 35 / 40 (the plan's cap) |
| `tools/device-page/build.ts` | 0 → 57 / 60 (plan cap; r1 48, qfix 50, r2 55, QA r2 qfix 57) |
| `tools/device-page/check.ts` | 0 → 34 / 40 (plan cap) |
| `tests/tools/phone-no-computer.test.ts` | 0 → 80 (shipped) |
| `tests/tools/qa-35g5a.test.ts` | 0 → 34 (shipped; QA's r1 and r2 qfixes) |
| `docs/qa/device-runs/TEMPLATE.md` | 47 → 64 (shipped) |

`BUILD_GUIDE.md` is never edited by a builder (§7). Its `tools/` line is a Chief Of Staff merge-time push (see Kit files to push); do not touch it.

## Interfaces to match (quoted exactly; bodies elided as `…`)
```ts
// tools/serve.ts
export const nodeOk = (version: string): boolean => { … };
export function serve(port: number): Promise<{ url: string; server: Server }> { … } // rejects with the listen error
export function links(port: number, list: () => ReturnType<typeof networkInterfaces> = networkInterfaces): string[] { … }
// run directly: node tools/serve.ts [port = 8734]: nodeOk check, then serve, then print links(<bound port>) one per line

// tools/device-page/build.ts
export const ROOT = resolve(fileURLToPath(new URL("../..", import.meta.url))); // the repo root
export const ENTRY = "tools/device-page/page.ts", PAGE = "tools/device-page/index.html", SCRIPT = ['src="./page.ts"', 'src="./tools/device-page/page.js"'] as const;
export const toHtml = (html: string): string => …; // SCRIPT swap + the inline icon after </title>
export const onlyBuild = (out: string, text: string): boolean => …; // QA r2 qfix: every file in out is build.json or listed in it
export const ours = (text: string): boolean => …; // a build.json this builder wrote
export const sha = (text: string): string => …; // sha256 hex
export const strip = (src: string): string => …; // stripTypeScriptTypes, strip mode
export function toJs(rel: string, src: string, dep: (rel: string) => void): string { … }
export const refuse = (head: string, asked: string | undefined, dirty: string): string | null => …; // QA qfix
export function build(out: string, commit: string, root: string = ROOT): string { … } // returns build.json's text
// run directly: node tools/device-page/build.ts <out folder> [commit, which must be HEAD]

// tools/device-page/check.ts
export function check(out: string, root: string = ROOT): string[] { … }
// run directly: node tools/device-page/check.ts <out folder>
```
The shipped tests import `serve`, `links`, `nodeOk`, `build`, `check`, `refuse` and `ROOT`; `check.ts` imports `build`, `PAGE`, `refuse`, `ROOT`, `sha`, `strip` and `toHtml` from `./build.ts`. No other export. No `src` type is used or added.

## Smoke lines
None move. Sims (stage-fixed 48/2, stage-weighted 22/28) identical; the 21 smoke lines match the Base (the heap line is report-only).

## Existing tests changed by ruling (and only these)
None.

## Tests that prove it is done
Shipped files (copy verbatim from `origin/main`; never weaken, rename, skip or delete; a failing one is a must-fix):
| Shipped file (under `handoff/steps/tests/step-35g5a-phone-no-computer/`) | Copy to | sha256 |
|---|---|---|
| `tests/tools/phone-no-computer.test.ts` | `tests/tools/phone-no-computer.test.ts` | `ac68b0788541c5b7b2bc2be335c5025f421b3c34c4b6df0b93f3441102796cef` |
| `tests/tools/qa-35g5a.test.ts` | `tests/tools/qa-35g5a.test.ts` | `85ac3ee064bd4a33490ff59893fcbe90c7995909ebc8ffc36a0a02fa3917492f` |
| `docs/qa/device-runs/TEMPLATE.md` (full file) | `docs/qa/device-runs/TEMPLATE.md` | `98575f2d46e3b74b27b2e85ccc59ce6e60ef096bcd5bb4cd5af87412e09fe575` |

Titles (exact):
- `phone-no-computer` — "serve: a phone that hides its network addresses (Termux) keeps serving and prints its own 127.0.0.1 link with the real port and the Wi-Fi hint (step 35g5a)": the real `node tools/serve.ts 0` with `networkInterfaces` made to throw error 13 prints the 127.0.0.1 link with a non-zero port and the hint, the link serves 200, stderr is empty.
- "serve: port 0 prints the bound port, one link per IPv4 Wi-Fi address, the phone's own link when there is none (step 35g5a)": no `:0/`; IPv6 and internal addresses dropped; the no-address lines; `serve(0)` resolves a real port and is closed in `finally`.
- "serve: a busy port prints the friendly line naming the next port and exits non-zero; serve() rejects with EADDRINUSE (step 35g5a)".
- "serve: Node below v22.18, or v23.0 to v23.5, gets one plain line and exit 1 before serving (step 35g5a)": the `nodeOk` table and the real script under v23.5.0 and v22.17.1.
- "gh-pages build: exactly the page's runtime import set, types stripped, .js names, relative paths, build.json with commit and sha256; the check passes (step 35g5a)": also the inline icon, and a folder with a foreign `build.json` refused with nothing deleted.
- "gh-pages check: an extra, missing, changed or unstripped file, an import that does not ship, or a stale build each fail (step 35g5a)": each case starts from an empty folder (QA r2 qfix).
- `qa-35g5a` — "QA 35g5a: build.json names only the commit the files come from: a tracked edit or another commit is refused, with or without a commit argument": the real build and check commands with git faked; nothing written on refusal; no box path in any output file; a real build.json beside `keep.txt` or `.git/HEAD` is refused and both survive; an earlier build alone (with an empty `.git/`) is replaced; a lone build.json without `node` and `entry` is refused (QA r2 qfix).
Children are the real scripts (`process.execPath`, `--import` preloads stand in for the phone's Node or for git); each serve child is stopped after 15 s at most. The `COMMIT`/`HEAD` constants are labels (the build reads the working tree; git is faked). (You may add tests. The hand-back lists the three shipped files' sha256, unchanged.)

## How a planted bug is caught (for QA)
`/workspace/scratch-ea/s35g5a-plants.py <clone> <base clone>` (result `kit-backup-g5a/s35g5a-plants-result.txt`) matches **full test titles** and runs the export gate:
- S1–S9 serve: `networkInterfaces()` unguarded; the hint dropped; the asked port printed; internal and IPv6 printed; no listen error handler; a busy port exiting 0 raw; v23.5 let through; v22.17 let through; the check never run.
- B1–B12 build: imports keep `.ts`; the import set from the typed source; an absolute entry path; no `node` in build.json; any non-empty folder overwritten; a non-sha commit; a foreign build.json's folder deleted (both checks off); `ours()` checking only the commit (caught by the QA test); no inline icon; a tracked edit let through; another commit let through; B12 (QA's r2 plant) a real build.json beside other files lets the folder be wiped (`onlyBuild` off; caught by the QA test).
- C1–C7 check: unlisted files, the stripped-source compare, reachability, the rebuild compare, the sha256 compare, missing files, each skipped; the CLI vouching for a dirty or other checkout.
- E1–E2 export gate: a type-only import of `build.ts` into `src`; `package.json` exposing the builder.
Expected: **30/30 caught; 7/7 new tests fail on the Base** (neither test file can load there). QA's set `qa-runs/step-35g5a-review/r2/probes-qa-qf.py <clone>` (its Q6 anchor is `put("index.html", toHtml(html));`; result `kit-backup-g5a/qa-plants-r3-result.txt`): **13/13** (Q10x, reachability ignoring `import()`, is an equivalent mutant and not counted, as in QA's run). With Q3 planted (`serve()` resolves the asked port) `npm test` now ends in 9 s with 1 failure; the r1 test file hangs past a 180 s cap (`kit-backup-g5a/port-plant-run.txt`).

## Example
The CEO opens `https://<owner>.github.io/tileengine/device-page/` in Chrome on the Red Magic 9 Pro, holds it upright, turns it at "TURN THE PHONE SIDEWAYS NOW" and copies the DONE box into a copy of TEMPLATE.md with "website link" ticked. Proto run (`kit-backup-g5a/subpath-run.txt`, headless mobile Chromium, fake clock, the built folder served as plain static files under `/tileengine/device-page/`): 32 files fetched, no `.ts`, no request outside the sub-path (no `/favicon.ico`); DONE at t = 61 s; pixel PASS; no page errors. QA's M1 repro (`kit-backup-g5a/m1-repro.txt`): with `// EVIL` appended to `src/runtime/render/light.ts`, `build.ts <out> <HEAD sha>` and `build.ts <out> 000…0` both exit 1 and write nothing; reverted, `000…0` still exits 1, HEAD builds and checks `check ok`; check on the dirty tree exits 1. QA's M2 repro (`kit-backup-g5a/m2-repro.txt`): a folder `s1` with `.git/HEAD`, `keep.txt` and a real build.json copied in: `build.ts s1` exits 1 and both survive; a lone earlier build is rebuilt in place and checks `check ok`.

## Decisions note: what to name
- Why `serve.ts` imports `node:module` as a namespace: a named import would fail to link on an old Node before the friendly version check runs.
- That Node 22.6–22.17 and 23.0–23.5 without a flag stop at `ERR_UNKNOWN_FILE_EXTENSION` before `serve.ts` runs; TEMPLATE names both messages.
- The same-length `.ts` → `.js` rename (positions from TypeScript's `preProcessFile` on the stripped text), and why only relative imports are allowed.
- `refuse` (QA qfix): the CLI never takes a commit it did not check out, and untracked files are allowed (a symlinked `node_modules` cannot change the page).
- `ours`, `onlyBuild` (QA r2 qfix) and the inline icon (r2), and that `toHtml` is shared by build and check so the byte-equal rebuild holds.
- Law 13: no cache or memo; `build` and `check` hold one queue and one seen-set per call.

## Do not touch
`src/**`; `package.json`; the lock; `.dependency-cruiser.cjs`; `scripts/check-law.sh`; `tsconfig.json`; `tools/tsconfig.json`; `eslint.config.*`; `BUILD_GUIDE.md`; `tools/device-page/page.ts` and `index.html`; `tools/pixel-suite/**`; every existing test file; `locked/`; `data/*.md`; plus BUILD_GUIDE §7's never-edit list.

## Acceptance
- [ ] `npm ci && npm run green` exits 0 with at least 692 tests passing (685 + the 7 shipped) and none failing, cancelled, skipped or todo; typecheck, lint, deps, check:law and check:state each exit 0.
- [ ] The three shipped files are byte-identical to the sha256s above.
- [ ] Sims, the 21 smoke lines and every pin unchanged; `git diff acc695ad --stat -- src package.json package-lock.json BUILD_GUIDE.md` is empty.
- [ ] Each file within its cap; 150–400 changed lines in total (the proto is 259).
- [ ] `node tools/serve.ts` prints one link per IPv4, non-internal address with the real port (paste it); `node tools/serve.ts 0` prints a non-zero port.
- [ ] From a clean checkout: `node tools/device-page/build.ts <folder>` then `node tools/device-page/check.ts <folder>` prints `check ok` (paste both, and `build.json`'s file count).
- [ ] QA's M2 repro: a folder holding `.git/HEAD`, `keep.txt` and a copied real build.json is refused by `build.ts` (exit 1) and both files survive; a folder holding only an earlier build is replaced. Paste the lines.
- [ ] QA's M1 repro: append `// EVIL` to `src/runtime/render/light.ts`; `build.ts <new folder> <HEAD sha>` and `build.ts <new folder> 0000000000000000000000000000000000000000` each exit 1 and create nothing; revert. Paste the four lines.
- [ ] The built folder, served as plain static files under a sub-path (for example `/tileengine/device-page/`), runs to DONE in mobile Chromium (a fixture or fake-clock run is fine) with no `.ts` request and no request outside the sub-path; paste the summary.
- [ ] The export gate passes unchanged; nothing in `src` imports `tools/`; `package.json` names no tool.
- [ ] Every Ruling's pinning test passes.
- [ ] Hand-back complete per `handoff/HAND-BACK.md` at the hand-back location, with § Helpers & self-review.

## Not in this step (carries, with their target step)
- **G5b** (QA writes, EA reviews): the page smoke test and the plain-words readout.
- **Publishing**: the Chief Of Staff publishes a checked build to gh-pages `/device-page/` only on RaiKynn's own typed approval in QA's chat plus QA's `build.json`/rebuild check; no bot pushes gh-pages. Existing gh-pages content is kept.
- `engines` in `package.json` (`>=22.18.0` lets v23.0–23.5 through): left as is (plan item 49; a pin).
- A plain-line message instead of a stack when `build()` itself throws from the command line (non-empty or foreign folder): it already exits 1 and deletes nothing; wording later if QA wants it.

## Out of scope
Game rules. Format changes. Any `src` change. Serving over HTTPS. iPhone or iPad instructions (the CEO's devices are Android). A gh-pages workflow or any automatic publish.

## Kit files to push
All under `/workspace/tileengine`, full sha256 in `/workspace/share/step35g5a/push-sha256.txt` (4 files):
- `handoff/steps/step-35g5a-phone-no-computer.md` (this file)
- the three shipped files under `handoff/steps/tests/step-35g5a-phone-no-computer/` (table above)
Merge-time push (after the merge, not before): the `BUILD_GUIDE.md` `tools/` line in `/workspace/share/step35g5a/merge-time-docs.md` (names both test files, as QA asked).

## Open questions
None. QA's M1, N1 and M2 are adopted as QA wrote them (qfixes `cd045765` and `f3233af9`); its optional shape check and icon are in (Ruling 5).

## Delivery footer (must hold at hand-back)
- `npm ci && npm run green` exits 0 with **at least 692 passing and 0 failing**. Paste the summary line into HANDBACK.md.
- The three shipped files are **byte-identical** to the sha256s above; list each in HANDBACK.md, and paste the serve, build, check and M1 output and the sub-path DONE summary.
- The bundle is `<Base acc695ad>..step/step-35g5a-phone-no-computer-r<N>` and passes `git bundle verify`. Each file stays within its cap, and the total (insertions + deletions) is 150–400 changed lines (the proto is 259). Every pin unchanged.

## Delivery
On branch `step/step-35g5a-phone-no-computer-r<N>` (base `acc695ad`), commit as `G-TileEngine <G-TileEngine@users.noreply.github.com>` (author and committer), run `git bundle create step-35g5a-phone-no-computer-r<N>.bundle acc695ad..step/step-35g5a-phone-no-computer-r<N>` and then `git bundle verify`. Upload the bundle and a HAND-BACK-step-35g5a-phone-no-computer-r<N>.md to Google Drive (chatB adds `-chatB` to both names, chatB2 adds `-chatB2`, and either chat adds `-2` if a name already exists). On Drive, never move, rename, overwrite or delete a file you did not upload in this chat. The committed HANDBACK (`handback/step-35g5a-phone-no-computer/r<N>/HANDBACK.md`, shape `handoff/HAND-BACK.md`, the branch's last commit) must quote this step file's sha256 in full, its § Helpers & self-review must list each helper and what it reviewed plus your self-review, and its PR line must read `PR: opened by Chief Of Staff from the bundle`. Don't push and don't commit to main.
