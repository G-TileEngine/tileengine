# Post-publish check: gh-pages baseline-06c/

QA & Build Guard, 2026-11-23 GMT. CEO typed OK in QA's chat on 2026-11-22 21:42 GMT for baseline-06c/ from aa2ef7e3. Published by CoS.

**Verdict: PASS.**

- gh-pages 8d6ea725 (parent a269cf2d). The commit touches only `baseline-06c/` (140 files).
- `build.json` names aa2ef7e3ca463a9e1c72899910dd76990dafcd38 and Node 22.23.3, sha256 1ff795b2. It lists 139 files, which exactly match the 139 files on disk besides build.json.
- A clean rebuild from aa2ef7e3 (`node tools/baseline/build.ts <out>`, Node 24.22.1) is byte-identical to the published tree, except for build.json's `node` field.
- There are no paths matching `editor|tools/maker|catalogue.json`, and no `__play` or `dev-only` in the shipped files.
- On live https://g-tileengine.github.io/tileengine/baseline-06c/ (cache-busted), the page returns 200 and the live build.json names aa2ef7e3. At 390 and 360 (h844, dsf 3, mobile, touch), the readout reached `of N` with N >= 120 (128 and 121). There were no console or page errors, no 4xx/5xx responses and no horizontal overflow (scrollWidth 390 and 360).
- These numbers are from desktop Chrome headless and are not the phone baseline. The S21 Ultra and Red Magic 9 Pro runs are still the CEO's.
