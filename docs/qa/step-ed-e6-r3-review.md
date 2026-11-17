# QA delta review: step-ed-e6-designer-page r3 (S1 fix + QA pin)
QA & Build Guard, 2026-11-17 (GMT). Evidence: `docs/qa/qa-runs/effect-designer/e6/r3/`. The clone is fetch-only and only `refs/cmp/*` were made. No push, no GitHub/Drive writes; the rulesets and collaborators were read with GET only. The r2 review (`step-ed-e6-review.md`) is unchanged.

## Verdict: **OK TO SEND after one test-only fold-in (M1)**. The code is correct.

## Build
- Bundle `step-ed-e6-proto-r3.bundle` sha256 `6d1600f4…74c6`; it verifies and requires `dc381e99`. Fetched to `refs/cmp/ede6-proto-r3` = `a48078f0a3ad…3679`, tree `ef015bc7`.
- Chain: r1 `84def4d2`, r2 `a0d500d5`, pin `252ab9b6`, r3 `a48078f0`, with parent `dc381e99`. Every commit has a noreply author and committer. `dc381e99` adds docs only over `5cb385ba` (D7 ruling and the P1-2 review).
- The r3 message says "rebased onto 5cb385ba", but the parent is `dc381e99`. This is **wording only**.
- The rebase changed no code: `1323d34e`↔`a0d500d5` and `3ef0e6ef`↔`252ab9b6` show no diff on the E6 paths. The pin's patch-id matches, and its file sha256 is `738e46f5…a139`.
- r3 over the pin changes only S1: `save.ts` +6, `page.ts` 3/3, and tests +9/−1 and 2/2. In total, 11 files, +337/−3 = **340** (cap 344). There is no diff in the pinned files, `src/runtime` or `src/core`.

## S1 (`ownerOf`, ruling 14, test 14)
- A missing file gives `{doc: null}`. Envelope checks: `kind` must be `behaviour-setup`; `formatVersion` must be a number and `id` and `behaviourId` strings; `rev` must be an integer of 0 or more; `answers` and `history` must be records.
- Junk, `null`, `[]`, a number, `true` or `{}` are refused as `staleRev`. The refusal names the file and gives the reason "unreadable" or "no setup envelope". The page toasts it and returns before any write. `rev` values of 1.5, −1 and "4" are refused. NaN can't be stored in JSON.
- **My S1 plants (`qa-ede6-plants-s1.py`): 8/9.** Caught: accepting `[]` or `{}`; accepting any record, i.e. writing over `{}`; a refusal without the file name; accepting a 1.5 or non-integer rev; refusing a valid rev-0 envelope; refusing a valid envelope with formatVersion 3.
- **Missed: Q9**, a valid *full* envelope refused (a stricter `ownerOf` that rejects docs with more than the 8 fixture keys). Test 14's valid owner has only those 8 keys. Every real owner after its first save also carries `updatedAt` and more, so this would block the 2nd Save & use; only the smoke would notice.

## Gates (one at a time; `pgrep` checked clear in a separate step before each)
| Ref | Main | Floor | Tests | Result |
|---|---|---|---|---|
| r3 `a48078f0` | `dc381e99` | 891 | 891/0 (main 874) | PASS on the rerun (1st run: stress C p95 5.49 ms over 4 ms, the known flake) |
| trial r3 + pin-b `6ffd7eff` | `6cd8fa25` | 900 | 900/0 (main 882) | **PASS**; origin/main moved on to `6cd8fa25` (P1-1 merged); the merge is clean |

## Plants (`plants-r3.log`; a plant is caught when the E5 + E6 tests fail, including the pin)
- **EA `ede6-plants-r3.py`: 81/81.**
- **QA D6: 9/12**, as in r2. D3 is equivalent. D6 and D8 are page plants; `saveAndUse` refuses them, and the smoke caught D6 on r2.
- **QA risk: 14/20**, as in r2 with the pin. R10, R14, R16 and R17 were smoke-caught on r2, and the page lines are unchanged in r3. R11 is by design. R15 is carried as S3.
- **QA S1: 8/9 → 9/9 with pin-b** (`plants-pin-b-recheck.log`).

## Smoke (`smoke.mjs` + the `{}` case; Chrome 156, 390×844) — `smoke-r3.log`
- The tile is Slash arc and the strip paints. rAF stays at **max 1 callback per frame** after the re-boots. 18 buttons, all at least **48×48**. **No page errors**; the only console line is the favicon 404.
- Save, Undo and a 2nd Save run as in r2: Undo moves the effect to `effects/.deleted/`, and the 2nd Save purges it. The 2nd Save also loads an owner file that has more than 8 keys.
- Junk, `null` and `[]` give "Not saved: can't read setups/basic-attack.json (unreadable). Nothing was changed.". `{}` gives "(no setup envelope)". **Files are unchanged in all 4 cases.** This matches EA.

## Kit
- `push-sha256.txt` sha256 `0870cd62…`; `sha256sum -c` from `tree/` gives **11/11 OK**. These files match the stated hashes: doc `184ad26d`, paste `e1c55688`, save.test `342b20a5`, ed-e6.test `3b828a0e`, CN-028 `f17db93f`, HAND-BACK `09ef1f21`, BUILD_GUIDE `62c4ba08`, STEP-TEMPLATE `2d2ac7bf`; CN-003 and README are unchanged. Base `dc381e99`.
- The shipped tests are byte-identical to the kit (`342b20a5`, `3b828a0e`), and **my pin ships** as `effect-e6-qa.test.ts` `738e46f5`.
- The token procedure has no "gated" or "outstanding" wording left; the step doc says "Settings: met". Under § Token: the CEO gives the token once, in chat; it is kept as `GH_BUILDER_TOKEN`; it is pushed once, inline, to `step/<id>-r<N>-chatA` only; if it is ever exposed, it is revoked.
- The CEO's SEND is still required.
- **Rulesets (GET):** `27424037`: `require_last_push_approval: true`, `allowed_merge_methods: ["merge"]`, 1 approval, stale approvals dismissed, updated 02:44 GMT; `27424039` and `27424042`: unchanged; the only bypass is the admin role.
- **Collaborators:** `GTileEngineHelpers` has the `write` role (push, not admin). `G-TileEngine` is admin.

## Findings
- **Must-fix M1** (G1, test gap only): fold Q9 in. Pin `refs/cmp/ede6-qa-fix-b` = `ab8f3970b9c283d2de045a97a10980406ffb243c` on `a48078f0` adds `tests/editor/effect-e6-qa2.test.ts`. It is 13 lines, noreply, sha256 `1a053e58…ce99`, and typecheck and lint are clean. It checks that `ownerOf` loads (1) the owner file a Save & use wrote and (2) a `blankEffect` envelope with `behaviourId`/`copiedFrom`. Bundle `/workspace/share/ede6-qa-fix-b.bundle` sha256 `a8108700…ee52`. Shipping it adds 13 lines, taking the step to 353 against cap 344. Either raise the cap, or fold the 2 assertions into test 14 (+2 lines → 342) and floor 891 → 892 if it ships as a new test.
- **Should-fix S1** (wording): CN-028's setup list and the step doc's send gate still describe `27424037` as "PR with 1 approval". Add "last-push approval, merge only".
- **Should-fix S2:** the inline push puts the token in the command line (process list) and possibly in git error output. A one-line credential helper that reads `GH_BUILDER_TOKEN` keeps it out of the command line.
- **Report-only:** the r3 commit message says it was rebased onto 5cb385ba (wording); "never name the builder account's id" sits beside the push URL that names `GTileEngineHelpers`; this is fine if "id" means the numeric id; r2's S2 and S3 are carried per the step doc.
