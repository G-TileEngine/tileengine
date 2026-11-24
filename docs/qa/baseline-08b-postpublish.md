# Post-publish check: gh-pages baseline-08b/

QA & Build Guard, 2026-11-24 GMT. On 2026-11-24 at 17:18 GMT, the CEO typed in QA's chat: "OK for gh-pages: the Step 8b baseline from main 42cc84b4, for the stair phone check". CoS published it.

**Verdict: PASS.**

- gh-pages commit 89eb1b8f (parent 8d6ea725), noreply author and committer. It touches only `baseline-08b/` (145 files); nothing is deleted or modified elsewhere.
- `build.json` names 42cc84b41f17c477495284dac061084ddd6920a9. It lists 144 files, which exactly match the 144 files on disk besides build.json, with every sha256 matching.
- A clean rebuild from 42cc84b4 (`node tools/baseline/build.ts <out>`) is byte-identical to the published tree, including build.json.
- No paths match `editor|tools/maker|catalogue.json`, and no shipped file contains `__play` or `dev-only`. The `handback/step-06c-checkpoint` fixture files are the same checkpoint data as baseline-06c.
- Live https://g-tileengine.github.io/tileengine/baseline-08b/ (cache-busted) returns 200, and the live build.json names 42cc84b4. Runs at h844, dsf 3, mobile and touch:
  - `?scene=shop` at 390 and 360: the title is "Shop stairs (?scene=shop)" and the readout reached `of 101` and `of 102`.
  - The default scene at 390 is unchanged ("Skirmish").
  - There were no console or page errors, no 4xx/5xx responses, and no horizontal overflow.
- These numbers come from desktop headless Chrome with no stair walks, so they are not the phone gate. The stair phone check on the S21 Ultra and the Red Magic 9 Pro is the CEO's: at least 10 walks, judged by the baseline-06c-phones.md L31 rules.
- Cosmetic, non-blocking: both scene titles still start with "baseline 06c", as the guide specified.
