# Hand-back step-35g5a-phone-no-computer r1
Step file: handoff/steps/step-35g5a-phone-no-computer.md (kit sha256 825fc3eaf338e3d9d14b18571dcceb9342683ba0a801de2bedf1932511389cfa)
Base commit: acc695ade5008b0fe6623b48de1cb566dcf896cf     Head commit: bf070b00f253fe8da63799bc98918811b8239a68     Branch: step/step-35g5a-phone-no-computer-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	docs/qa/device-runs/TEMPLATE.md
A	tests/tools/phone-no-computer.test.ts
A	tests/tools/qa-35g5a.test.ts
A	tools/device-page/build.ts
A	tools/device-page/check.ts
M	tools/serve.ts

## Green
npm test: 692/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0

`npm ci` then `npm run green` exited 0. The logs here are a second run of the same commands on the same bytes (namespace import already in the tree): tests 692, pass 692, fail 0, cancelled 0, skipped 0, todo 0.

## Shipped tests (sha256, unchanged)
ac68b0788541c5b7b2bc2be335c5025f421b3c34c4b6df0b93f3441102796cef  tests/tools/phone-no-computer.test.ts
85ac3ee064bd4a33490ff59893fcbe90c7995909ebc8ffc36a0a02fa3917492f  tests/tools/qa-35g5a.test.ts
98575f2d46e3b74b27b2e85ccc59ce6e60ef096bcd5bb4cd5af87412e09fe575  docs/qa/device-runs/TEMPLATE.md

## Serve
`node tools/serve.ts` printed:
```
http://172.16.0.2:8734/tools/device-page/
```
`node tools/serve.ts 0` printed a non-zero port:
```
http://172.16.0.2:40943/tools/device-page/
```
One IPv4, non-internal address. IPv6 and the internal address were not printed.

## Website copy
From the clean product commit, `node tools/device-page/build.ts /tmp/g5a-site` exited 0 (stdout empty; one ExperimentalWarning on stderr, which TEMPLATE says to ignore). `build.json` names 32 files:
```
{
  "commit": "bf070b00f253fe8da63799bc98918811b8239a68",
  "node": "22.23.3",
  "entry": "index.html",
  "files": { ... 32 entries, sorted, sha256 hex }
}
```
`src/types/core-types.js` is not among them. `node tools/device-page/check.ts /tmp/g5a-site` printed `check ok` and exited 0.

## M1 (four lines)
With `// EVIL` appended to `src/runtime/render/light.ts`, then reverted:
```
build: the checkout has uncommitted changes; build.json must name a real commit
build: the checkout has uncommitted changes; build.json must name a real commit
```
Both commands (`<HEAD sha>` and `0000000000000000000000000000000000000000`) exited 1, wrote nothing to stdout, and created no folder. After revert the tree was clean, and the zero commit still exited 1 with `build: 0000000000000000000000000000000000000000 is not the checked-out commit bf070b00f253fe8da63799bc98918811b8239a68; check it out first` and created nothing.

## M2
A folder with `.git/HEAD`, `keep.txt` and a copied real `build.json`: `build.ts` exited 1. stderr contained `build: <out>/build.json is not one this builder wrote (commit, node, entry, files) or the folder holds other files; give an empty folder`. `keep.txt` and `.git/HEAD` both still had their bytes. A folder holding only that earlier build, plus an empty `.git/`, was replaced. `check.ts` then printed `check ok`. The empty `.git/` was not kept.

## Sub-path page
The built folder served as plain static files under `http://127.0.0.1:<port>/tileengine/device-page/` in mobile Chromium (Chrome for Testing, viewport 412×915, DPR 2.625, fake clock fast-forwarded 61 s). DONE once. No page error. 32 requests. No `.ts` request. No request outside the sub-path.
```
DONE
frame ms p50 16.0 p95 17.0 max 18.0 / dropped (>25 ms) 0 over 50 ms 0 of 29 / draws 30 canvas MB 2.0 pixels — / lite off (auto, 0 switches)
```

## Helpers & self-review (required)
- Helper "Review serve.ts rulings 1-4": the four serve rulings and the phone-no-computer serve tests. PASS. `nodeOk` matches the table; the too-old line exits 1 before listen; Termux's throw returns the 127.0.0.1 link and the Wi-Fi hint and the server stays up; IPv6 and internal addresses are dropped; the printed port is the bound port; a busy port rejects with `EADDRINUSE` and the CLI names the next port. That review saw a named `stripTypeScriptTypes` import. The committed file imports `node:module` as a namespace instead, which is what the step's decisions note asks, and the 7 shipped tests were re-run after the change (7/7).
- Helper "Cross-check files caps and pins" (earlier in this step): the six paths, the three shipped sha256s, caps, pins, rAF, and no `src` → `tools` import. PASS on that tree. It counted +226/−11. The committed `git diff --stat` is +228/−13 = 241, same six files, after the namespace import and the one `nodeOk` comment. Still inside 150–400 and every file cap.
- Helper "Review final serve, build and check": launched against the committed rulings (namespace import, `onlyBuild`, `refuse`, check lines). It had not returned when this hand-back was written. Those checks are the self-review below, plus the shipped tests and the clean-tree M1, M2, build, check and browser runs. An earlier build/check review was cancelled after it sat with no result; it is not cited as a pass.
- Self-review: Acceptance — green 692/0 done; three shipped files byte-identical done; `git diff acc695ad --stat -- src package.json package-lock.json BUILD_GUIDE.md` empty done; caps and 241 changed lines done; serve lines above done; build 32 files and `check ok` done; M2 refuse, both files survive, earlier build replaced done; M1 four lines, both exit 1, nothing created, reverted done; sub-path DONE, no `.ts`, no outside request done; export gate unchanged (`deps` 106 modules, 0 violations), nothing in `src` imports `tools`, `package.json` names no tool done; every ruling's pinning test passed (the 7 shipped titles) done; this hand-back is the last commit done.
- Self-review QA G1–G10: G1 done (692/0, no skip/only/todo, shipped sha256s equal; `/workspace/scratch-ea` is not on this machine, so `s35g5a-plants.py` and the QA plant script were not run). G2 done (typecheck exit 0; no `@ts-ignore`, `@ts-expect-error`, or `as any`). G3 done (`check:state` OK; no `src` edit). G4 done (`nodeOk`, `serve`, `links`, `ROOT`, `ENTRY`, `PAGE`, `SCRIPT`, `toHtml`, `onlyBuild`, `ours`, `sha`, `strip`, `toJs`, `refuse`, `build`, `check` match the quoted signatures). G5 done (do-not-touch paths absent). G6 done (only the step's six files). G7 done (241 lines; `serve.ts` 34/40, `build.ts` 41/60, `check.ts` 33/40). G8 done (lint, deps, law; `requestAnimationFrame` in `src` only in `raf-driver.ts`). G9 done (decisions below). G10 done (acceptance lines above).

## Decisions & deviations (5–10 lines)
- `serve.ts` imports `node:module` as a namespace and calls `stripTypeScriptTypes` only while answering a `.ts` file, after `nodeOk`. A named import would fail to link on an old Node before that plain line. Nodes that cannot run `.ts` at all still stop at `ERR_UNKNOWN_FILE_EXTENSION`; TEMPLATE names both. `nodeOk` is true for 22.18+ on the 22 line, 23.6+ on the 23 line, and any 24+. The hint strings and the busy-port line are the ruling text. The printed port is `server.address().port`. The default port stays 8734.
- One link per IPv4 non-internal address, in `Object.values` order. IPv6 and internal addresses are dropped. No address, or a throw, prints `http://127.0.0.1:<bound>/tools/device-page/` plus the ruling's hint for that case.
- Imports are read from the stripped text: double-quoted relative `from` / `import` only, which is how this repo writes them. `.ts` becomes `.js` (same length). A non-relative specifier throws. Type-only imports are gone after strip, so `src/types/core-types.js` does not ship. `toHtml` is shared by build and check.
- `ours` requires the keys `commit,node,entry,files` in that order, a 40-hex commit, a string `node`, `entry` `"index.html"`, and a non-array `files`. `onlyBuild` ignores empty directories. A copied `build.json` beside other files or `.git/HEAD` throws and deletes nothing. A lone earlier build, even with an empty `.git/`, is replaced only after the walk succeeds. `files` are sorted by UTF-16 `<`. `build.json` is two-space JSON plus a newline. Each sha256 is of the written text.
- `refuse` uses `git status --porcelain --untracked-files=no`, so untracked files are not dirty. The CLI commit is `git rev-parse HEAD`. A wrong commit or a dirty tree exits 1 and writes nothing. `check` prints `check: ` plus that reason on stdout. The rebuild is a fresh `build()` of `build.json`'s commit against the working tree, not `git show`. It says `rebuild is not byte-equal`, and names both Node versions only when they differ.
- Law 13: no `src` change and no cache that outlives a call. `build` holds one map and one seen-set per call; `check` holds one stack, one reached set and one problem list per call. No new dependency. `stripTypeScriptTypes` prints one ExperimentalWarning per process; TEMPLATE already says to ignore it. On this host the only non-internal IPv4 is 172.16.0.2.
- No deviation from the quoted interfaces, the file list, or do-not-touch. Caps and the line total are above. `/workspace/scratch-ea` is not on this machine, so the plant scripts were not run.

## Next step (optional proposal)
- G5b is the page smoke test and the plain-words readout. Publishing the checked folder to gh-pages `/device-page/` stays with the Chief Of Staff, and only after RaiKynn's typed approval.
