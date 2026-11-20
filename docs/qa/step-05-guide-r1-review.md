# QA review: step 5 guide r1 (`/workspace/share/maker-spec/step-05-units.md`)

QA & Build Guard, 2026-11-19. Read-only. Guide sha256 `d6603ab8…bec72ac9` and 267 lines, both verified. Cites checked against main `a6538ee1`. Origin/main is now `8816be0` (docs only: the 04c record and DSK D22–D24); the floor of 1065 is unchanged.

## Verdict: NOT OK

Seven must-fixes are listed below. They are cite errors, the missing s4c re-pin rule, the seed attribution, and one test that can't pass as specified. Structure, caps, floor/port chain, excludes, laws and the rulings list are all OK. None of the fixes blocks 5a's design.

## Must-fix (guide line, then the replacement)

1. **L34:** step-04 Delivery is L29–40 on `a6538ee1` (heading L29, last bullet L40). Change "`L27–37`" to "`L29–40`".
2. **L44 and L249:** shell-lessons #2 runs L30–53. The prototype-shots line is L53. At L44, change "`L30–52`" to "`L30–53`". At L249, change "`shell-lessons L52`" to "`shell-lessons L53`".
3. **L52 and L87:** in `tests/editor/stage-place.test.ts`, L49 is the answers assert. The kind scan is L50–52 and the pin is L53. At L52, change "`L49–53`" to "`L50–53`". At L87, change "`(L49–52)`" to "`(L50–52)`".
4. **L74 and L255:** `throw new Error("play: seed")` is at `tools/play-stage/load.ts` **L24**, not L23. Change "`L23`" to "`L24`" in both places.
5. **L74, seed attribution and overclaim.** Replace "Keep it; no code change." with:
   "This was the 4c builder's choice (`handback/step-04c-stages-maps/r1/HANDBACK.md` L56). QA flagged it for CoS/UX to confirm (`docs/qa/step-04c-review.md` L32), and UX confirms it here. It is not a CEO ruling. Keep it; no code change."
   Also replace "One `.json` line (excluded from the count) fixes the root," with:
   "One `.json` line (excluded from the count) removes the `play: seed` throw for Empty projects (Test there still stops at `play: army` until Ruling 7),"
6. **L85, s4c re-pin.** Add after "…and runs the s4c smoke.":
   "This is a deliberate edit of a merged smoke. The hand-back names it as deliberate in § Decisions. It pastes `git diff <base> -- handoff/steps/tests/s4c-stages-maps/smoke.mjs`, which must show exactly two changed lines (L27, L48). It quotes the file's sha256 before (`ea0d674f…` on `a6538ee1`) and after. The after value is the s4c reference for 5b, 5c and the post-merge check. No other s4c line changes."
   Note: `qa-postmerge.sh` "pins 5/5" covers only package.json, the lockfile, .dependency-cruiser.cjs, check-law.sh and core-types.ts (`/workspace/cos-tools/lib.sh` L164). The s4c pin is therefore enforced only by this hand-back rule.
7. **L166, wired test can't pass as written.** `custom_ns`/`custom_ew` only matter when `reach_mode` is `"custom-cross"` (`project.ts` L42). With the default mode, a non-default `custom_ns` leaves `playDocsOf` unchanged. Replace "for each listed knob, a non-default value changes `playDocsOf` output" with:
   "for each listed knob, a non-default value (with its `depends_on` parent set so the knob is live, e.g. `reach_mode: \"custom-cross\"` for `custom_ns`/`custom_ew`) changes `playDocsOf` output"

## Should-fix

- **L43:** BUILD_GUIDE laws 14–20 are L44–50. L51 is blank. Change "`(L44–51)`" to "`(L44–50)`".
- **L5:** the DSK file is now on main `8816be0` at sha256 `bd423f8f…`, 72 lines. The new version adds D22 and the D6.1 amendment. D23 is still L71 and D24 still L72, unchanged. The box copy is now also `bd423f8f`, so `cb087871` no longer exists anywhere. Change "at sha256 `cb087871…` (72 lines; main `a6538ee1` still has `aacb7e01…`, 68 lines, without D22–D24)" to "at sha256 `bd423f8f…` (72 lines, on main from `8816be0`; `a6538ee1` has `aacb7e01…`, 68 lines, without D22–D24)".
- **L96, G7 cite and behaviour-library.** After "(insertions plus deletions, G7)" add "`docs/qa/handback-checklist.md` L26, `BUILD_GUIDE.md` L123". Change "Only `.json` goes under `data/templates/**`." to "Only `.json` goes under `data/templates/**` or `behaviour-library/**`; no builder run edits `behaviour-library/**` (CoS pushes the Librarian's file)." This keeps product logic out of the exclude.
- **L144:** make the Wired bullet name its file: "- **Wired (`units.test.ts`):** …".

## Verified OK

- **EA headroom doc:** `/workspace/share/step5-headroom/ea-ruling.md`, sha256 `fa64927d`, 38 lines. H1 L8–12, H2 L14–21, H3 L23–25, H4 L27–30, H5 L32–36.
- **Caps:**
  - 5a: 60+80+90+10+8+2+55+40+10+3 = **358**.
  - 5b: **379**.
  - 5c: **321**.
  - Every cap is ≤400. Smokes are 130 each and sit outside the count.
- **Floor, port and base chain:**
  - Floor: 1065 → 5a+N → 5b+N.
  - Ports: 8802, 8803 and 8804 are free (in use: 8734, 8797–8801, 8811–8813).
- **Code cites on `a6538ee1`:**
  - `project.ts` `playDocsOf` L29–57, `play: army` L33, stats L38, L42 tests `"one-tile-straight"` while the slice says `"orth-only-1"` (so the 5b fix is real).
  - `range.ts` L4–8, `targets.ts`, `line-shot.ts`.
  - `readUnit`, `resolvePlacements`.
  - `stage.ts:31`/L147, `rooms.ts` L41–45 (strings exact), `takenSeed` L19–27, `addStage` L30, `docsIn` L7.
  - `sliceOf`/DROP, `catalogue.ts` rev 26, `read-project.ts` L50/L53, `load.ts` L8–19, `serve.ts` L31.
  - s4c smoke L17–18, L24, L25–26, L27 (`"will go"`), L48 (`"placementDropped"`), L68.
  - The new wording still matches both waits.
- **Data:**
  - Empty stage has no seed. Empty is at catalogueRev 1 with an empty slice.
  - Demo is at rev 29 with 8 behaviours and seed 24301.
  - The demo has 7 units. Knight is in the loadout (required); Wolf is in the enemy pool; Archer has 2 setups.
  - Warrior (BTF) is hp 9 / atk 1.
  - Shots `68-unit-tap-edit-basic-light`, `68-test-battle-menu`, `24-project-settings` and `18-undo-toast` are on main.
- **Erratum (L91–94) is correct:** step-04 L122 is `### 4a Build` and L166 holds the count command, with `':!data/templates/**'` and no `':!handback/**'`. The Old string matches byte for byte.
- **5c blocker today-state is correct:** `behaviour-library/` is not on main. The box `/workspace/tileengine/behaviour-library/behaviours.json` is rev 29 with 65 behaviours, 0 with `goal` (40 primary).
- **Rules:**
  - 48px, AA, and 390/360 smokes are required.
  - Check 8 runs with sheets open.
  - `waitForFunction` is used for every wait.
  - Ok lines are pasted, and every over-cap file is named.
  - Law 12 is at L137 and Law 15 (no caches) at Rule 8.
  - Nothing in the guide contradicts one rAF, the UNIT/TILE pipes or Law 13.
  - "Not in step" blocks scope creep.
  - No rebuild-record steps are baked in.
- **Attribution:** every "CEO" mention (L3, L58, L148, L249) traces to shell-lessons CEO feedback #2 (L30–53; "bans greyed" is in rule 1, L45) or the CoS/CEO phone pass. EA and DSK items are credited to EA and DSK.
- **Rulings needed (L251–259): none blocks 5a.** Items 1, 2 and 7 are 5b/Test, 3 is sidestepped by carry (a), and 4–6 are 5c or out of scope.
- **Done when:** every 5a, 5b and 5c bullet has a named test, a model-test file or a smoke check. The one exception is the L144 "Wired" bullet (see should-fix).
