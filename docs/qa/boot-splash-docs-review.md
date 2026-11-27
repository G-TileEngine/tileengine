# QA docs-only review: boot splash planning edits (roadmap 35b, STATES v1.2 draft)

Reviewer: QA & Build Guard. Date: 2026-11-27.
Verdict: **OK after one must-fix** (attribution). No code, no step kit.

## What I checked

- `/workspace/share/boot-splash/SHA256SUMS` all OK. `boot-splash.patch` `48cf1701…` applies clean on main `664f8303` (origin/main), and the result is byte-identical to the shipped `roadmap.md` (`dc42c5e3…`, 288 lines) and `STATES.md` (`2826fa6e…`, 244 lines).
- The diff is +23 −6 in those 2 files only.
- Row 35b depends on 9 and 11, and row 36 now depends on 35b. The cited `step-11b-debug-apk.md` really lists a splash as out of scope (L16, L50, L114).
- STATES §1.0 fits the rules already there. `TITLE` now has two from-keys, `boot` and `boot.wait`, so the merged-table keys stay unique (rule 10). xGo gets no guards and no options (rule 5), and the logo times run on the frame clock.
- Nothing about a boot or title mode is in `src/state` yet, so nothing in the code drifts from these docs.

## Must-fix

1. **Attribution.** The §1.0 heading and row 35b credit the whole block to "CEO 2026-11-27 14:38 London, via CoS". As CoS relayed it, the CEO asked for this flow: TileEngine logo, then an optional creator logo, then the title menu, then Play, then `play.loading`, with assets loading behind the logos. The rest is EA design and must be labelled *(EA, PROPOSED)*, not shown as the CEO's ruling:
   - Settings in the title menu, and Settings sitting over `title`.
   - Test and preview skip the splash.
   - `EXIT_PLAY` goes to `title`, never back to the splash.
   - "No second wait" (cache reuse).
   - Logo time comes from project data.
   - The logo art enters the repo only on the CEO's OK.
   - The editor keeps plain `boot`.

## Notes for the 35b step guide (not blocking)

- **Self-loop.** `NEXT_LOGO` goes from `boot.splash` back to `boot.splash`. By rule 3, a rejected edge also returns `from`, so the phase alone can't show that a logo advanced. The driver must keep the logo index, and the tests must pin that index, not the phase.
- **Coverage test.** `tables.coverage.test.ts` (L243) checks reachability from `play.loading` or `overlay.none` only. The boot phases need their own root there.
- **Offline.** Step 36 bans fetch and XHR of local files and ES module loads over `file://`. So in a game opened from disk, the boot preload must read assets that are bundled into the export. The guide should say so and smoke it from `file://`.
- **Overlay hosts.** Line 3 calls the overlay list settled. Adding `title` as a host for Settings changes that list, so it needs a Change Notice when the step lands.
