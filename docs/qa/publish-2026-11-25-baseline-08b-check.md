# baseline-08b republish: served-build check and live walk (2026-11-25)

The CEO typed this OK in the QA chat at 12:58 GMT: "OK to republish baseline-08b from main ea3b08f4".
- gh-pages commit: 6d8b21b4 (parent c4d11b44). It changes 6 files, all under baseline-08b/. device-page/ is untouched.
- The live build.json reports commit ea3b08f423942458ce3377269a957223bb473901.

**Verdict: PASS**

## Served-build audit
- There is no dev.js in baseline-08b/.
- No `window.__*` or `__play` appears anywhere in the served tree.
- The live hook check reports `__play` absent at both widths.

## Live walk
Headless Chrome at device scale 1, 390x844 and 360x844, against /tmp/q/live8c.mjs.

At each width:
- The shop hero renders.
- Selecting the hero gives 20/20.
- The walk gives 1 stage change. The worst frame after the swap is 16.6 ms.
- The skirmish runs at 20/20.
- The console shows no errors.

At 390, the stairs marker shows beside the hero before the move. After the walk, the hero stands on the stairs and the stage changes.

The readout says "baseline 06c · Shop stairs", as expected for this build, which is from before 10a.
