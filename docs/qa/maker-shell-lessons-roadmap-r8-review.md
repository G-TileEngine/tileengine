# QA review: shell-lessons r6 and roadmap r8

QA & Build Guard, 2026-11-18, Europe/London. Read-only. `git fetch -q origin` in `/workspace/tileengine-repo`: `origin/main` is `0d13bdc88e6618a058b5fae0bc256e1d96839ac0` (roadmap r2, QA OK). No GitHub writes and no edits to either source doc. Share copies in `/workspace/share/maker-spec/` are byte-identical. This doc is local for CoS to push.

Checked:

- `/workspace/tileengine/docs/maker/shell-lessons.md` r6, 118 lines, sha256 `64b17426f68169a4b015c8bc72bed5e24e30f6a817999f68d21f9ab06aad1d6c`
- `/workspace/tileengine/docs/maker/roadmap.md` r8, 207 lines, sha256 `df5022f382cfb1da3cf0cb61f7ef5cfc5f521415faa07105f78444b67da0f321` (diff against `origin/main:docs/maker/roadmap.md`, r2 `97f5b036`)

CEO quotes were verified against the transcripts: Chief Of Staff (`b986f456-7a77-4ca5-a9d5-1f0d6c631304`) for the 2026-11-18 22:46–23:23 London feedback (#1–#7), and Editor & UX Designer (`d79e1dcd-d497-4462-ab30-e786fda09e7d`) for the earlier HUD note and the 13 Nov scope / export answers.

## Verdict: shell-lessons r6 **NOT OK** (`64b17426`)

The block quotes match, and the paraphrases of #1–#7 are accurate. One labeling pass is needed, so CEO-specified points stay distinct from the UX answer.

1. **L103–L109, #6 Start new / Invert / Tidy add decisions he did not make.** His words: a button beside View, with a warning, to clear and start anew (also in the stage preview, and not only in Sprite Studio); an invert button so walk left/right swap; Tidy “needs a lot more polish” because the result is sometimes uglier than the original. He did not specify undo, trash recovery, a before/after, Keep original, or “never replace the original without the user’s pick.” **Change:** keep the warning (his). Mark “one undo step” / “recoverable from trash the way project delete is” (L104), “as one undo step” on Invert (L105), and the three Tidy bullets (L107–L109) as the proposed UX answer, not as his rules.

The quoted lines themselves are fine. The #4 HUD quote matches the 13 Nov message in the UX chat word for word, aside from typography (double quotes became single quotes around “that is A.I hallmark” and “website”; a period was added at the end; the paragraph break was flattened). The #5 and #6 excerpts use fair ellipses. The two #7 quotes are exact. The 13 Nov scope in #4 point 5 (games only, editor stays on the r62 / style-spec look, play and preview show the game HUD), the offline / bring-your-own-picture rule, and the post-launch “UI export with purpose” direction all match what he locked in that day.

## Verdict: roadmap r8 **NOT OK** (`df5022f3`)

The new rows and rules are in the right stages, 31a slots in cleanly, and the r2 QA fixes are still present except for one path prefix. Three line edits, plus one tag typo.

1. **L39, rule 8.** Same attribution as shell-lessons fix 1: do not present “one undo step” as a CEO decision. Also spell out the standing “no button before it works” gate: the Start new / Clear all control ships with each tool when that tool exists, and with the stage preview from step 4, and it must actually clear. It is not added to earlier screens as a dead control.

2. **L100, MS-06 row.** Keep “working import into the stage/game preview,” Start new, Invert, and “more polish” as his. Label “Tidy with before/after plus Keep original” as the proposed UX answer, matching shell-lessons #6.

3. **L198, refs path still uses the wrong prefix.** The r2 split is present, but `` `design-notes/refs/` `` under L152’s default (`docs/maker/ux/`) does not exist on `origin/main`. The six files are at repo-root `ux/design-notes/refs/ai-sprites-ui/`. **Change:** write `` `ux/design-notes/refs/` `` (6 files under `ai-sprites-ui/`, on main). This is the path asked for in the r1 review.

4. **L157, verdict tag.** The thumbs-up keep is CEO #4, not #3 (the hub). The reason text already cites both. **Change:** `Keep: still good (CEO #3, #4)`.

## Checks

| # | Check | Result |
|---|---|---|
| A | Shas and line counts | **Pass.** Both match the expected sha256 and line counts. Share copies are identical. |
| B | CEO quotes vs transcripts | **Verified.** #1–#7 paraphrases match his 18 Nov messages in the CoS chat. Block quotes match (see typography note above). Added meaning is limited to the UX recovery / Tidy rules in fix 1. The HUD-kit layout names (Orbs, Portrait plates, Tactics corner, Minimal) and the part list originated in UX’s 13 Nov reply; he did not contradict them, and later locked the games-only middle ground. |
| C | Standing rules | **Pass, once fix 1 on the roadmap is in.** Rule 2 (no screen or button before it works), rule 3 (ui-shell is reference only, never merged, never for code), rule 1 (maker authors data, engine runs the rules), the 400-line cap, rule 6 (Grok Build / GrokHeavy write the code; nothing public without the CEO’s typed OK), and “no game-specific logic in engine code” still hold. The HUD picker is MS-22 step 31a in stage 5, after MS-06 and MS-07, and depends on the play-stage HUD; it is not pulled earlier. The ‘UI export with purpose’ row is post-launch, depends on MS-22, and is marked plan needed later. Hub, chart, and other post-launch rows stay post-launch. |
| D | Numbering, deps, mappings, r2 fixes, paths | **Pass, once fixes 1–3 are in.** 31a sits between 31 and 32 with no renumbering, no duplicate ids, and no cycles. Every Depends-on points at an earlier step or at a labelled TBD. shell-lessons #1–#7 map to the matching roadmap rows and back. r2 fixes still present: “From Step 2 on” Done-when (L33–36), box-only / local labels (L12–13, L196–197, L199–206), the refs split (L198–199), audio-module TBD (L103), and rule 6 (L37). Cited on-main paths resolve, or are labelled local/box only, except L198 (fix 3). `docs/maker/shell-lessons.md` is not on main yet; it is this same hold and should land in the same push. Historical `ui-shell/mock-art` / `mock-effects` mentions stay clearly historical. |

## Notes (not must-fixes)

- Key sources still say “main is `aa158fd`, PR #77”. That is the S1a merge. `origin/main` is now `0d13bdc8` (roadmap r2). Same stale pointer was in r2; update when convenient.
- L157’s “passed the CEO’s test” is a shade stronger than his “pretty much okay” on the thumbs-up chart; the lessons doc carries the softer wording.
- Sprite Studio (step 28) and Effect Designer (step 29) still depend only on Step 2, as in r2.

After the labeling pass, recheck just the numbered fixes.
