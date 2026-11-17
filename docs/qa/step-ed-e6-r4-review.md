# QA delta check: step-ed-e6-designer-page r4 (QA r3 pin shipped, cap 355)
QA & Build Guard, 2026-11-17 (GMT). Evidence: `docs/qa/qa-runs/effect-designer/e6/r4/`. The clone is fetch-only and only `refs/cmp/*` were made. No push and no GitHub/Drive writes. Earlier reviews unchanged.

## Verdict: **OK TO SEND**. No must-fixes. Two report-only items.

- **Bundle and chain.** `step-ed-e6-proto-r4.bundle` sha256 `2496725a…311f` verifies and requires `41ac9bcc`, which is origin/main at 03:2x GMT (no drift). It was fetched to `refs/cmp/ede6-proto-r4` = `297730665b13…5db79`, tree `b42b021e`. The chain is r1 `ed744ed8` → r2 `42c65864` → r2 pin `3e7b4d3d` → r3 `c6f464d8` → r3 pin `29773066`. Every commit is noreply.
- **Product unchanged.** `git diff 41ac9bcc 29773066 -- src tests tools` is byte-identical to `dc381e99..ab8f3970`. `range-diff` shows 4 commits `=`. The only `!` is r3's message, now "replayed onto 41ac9bcc for r4", so the base wording is fixed. `effect-e6-qa2.test.ts` is `1a053e58`. Total 12 files, +350/−3 = **353** (cap 355). The pinned files, `src/runtime` and `src/core` are unchanged. The smoke was not re-run (code unchanged since the r3 smoke).
- **Gates** (`pgrep` checked clear in a separate step before each run): `29773066` vs main `41ac9bcc`, floor 900. Tests **900/0** (882 + 18). Typecheck, lint, deps (128/410), state, law and smoke all PASS. `RESULT PASS` on both runs. Stress, an info-only check, hit p95 > 4 ms on both runs (E lap 3 5.88 ms; C 5.61/5.48 ms) with host load average around 14–17 from other workers. Runtime code is unchanged, and stress was clean on r3. I did not run it a third time (the rule allows one re-run).
- **S1 plants** (`plants-s1-r4.log`): **9/9 caught**. Q9 (a valid full envelope refused) is now caught by the shipped `effect-e6-qa2`.
- **Kit** (final push list `push-sha256.txt` sha256 `019cc3f1…8efd`, 14 files, expect-base `41ac9bcc`): `sha256sum -c` gives **14/14 OK** in both `scratch-ea/ede6/r4/kit-src` and `/workspace/share/step-ed-e6/tree`, and the two are identical (`diff -r`). Hashes:
  - doc `1a2431cb`
  - paste `1cbed36f`
  - CN-028 `9111adcd`
  - HAND-BACK `e46cfe0e`
  - BUILD_GUIDE `d9cd7a2b`
  - STEP-TEMPLATE `5d38af09`
  - tests `342b20a5`, `3b828a0e`, `738e46f5`, `1a053e58`, byte-identical to the proto
  - my reviews `6c5df2a7` and `7b89671f`
  - CN-003 and README unchanged
- **Doc and paste bodies.** The paste's L10–L203 are byte-identical to the doc's L24–L217 (194 lines). The 5 differing lines are the paste header lines (L1, 3–5, 9).
- **The D6 cite.** `ed2e705f` hashes main's `handoff/dsk-rulings/2026-11-17-phase1.md` (whole file `58cf837c`) **lines 1–39**, i.e. the file through § D6's last line. It does not hash the § D6 section alone (lines 36–39 hash to `5875315f`; up to the D7 heading, lines 36–40, hash to `58f7cd6b`). So § D6 is unchanged since DSK staged it, but "section sha256 … (from its heading to the D7 heading)" mislabels what the hash covers (**report-only R1**). Prerequisites now says the file is on main, which is correct.
- **S1 (ruleset).** Doc L14 and CN-028 L12 describe `27424037` in full: PR only, 1 approving review, last-push approval required, merge commits only, no force-push or deletion. This matches the r3 GET.
- **S2 (push).** Every push line uses `git -c credential.helper= -c credential.helper='!f() { echo username=GTileEngineHelpers; echo "password=${GH_BUILDER_TOKEN}"; }; f' push https://github.com/…`. That covers the doc, paste, CN-028, HAND-BACK, BUILD_GUIDE and STEP-TEMPLATE.
  - No `${GH_BUILDER_TOKEN}@` or other credentials-in-URL remain.
  - The helper is sound: it resets `credential.helper` first, and the single quotes keep the token out of argv because the helper's shell expands it at runtime. Its `echo`s go to git's pipe, not the terminal, and there is no `set -x`.
  - **Report-only R2:** the helper only sees `GH_BUILDER_TOKEN` if it is *exported*. A plain shell variable fails closed (authentication fails, nothing leaks), so add "export" to the keep-it line.
- **Token wording.** The token is a **classic PAT** (`public_repo`) on a Write-only collaborator account. The text says "never write the builder account's **numeric id**". A classic PAT can call the review API, but last-push approval means the builder's own approval never counts for its own push.
- **Cited docs neither on main `41ac9bcc` nor in the push list:**
  - `/workspace/share/effect-designer/scope.md` (accepted)
  - `docs/qa/qa-runs/effect-designer/e6/` (QA scripts, `smoke.mjs`; accepted)
  - `/workspace/scratch-ea/ede6/r3/ede6-plants-r3.py` (EA scratch)
  - `proto-check.sh`, `merge-pr.sh` and `publish-ghpages.sh` (cos-tools)

  Everything else cited is on main, in the push list, or is a file the builder creates.
