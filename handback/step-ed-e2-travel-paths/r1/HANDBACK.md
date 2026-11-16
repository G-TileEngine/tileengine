# Hand-back step-ed-e2-travel-paths r1
Step file: handoff/steps/step-ed-e2-travel-paths.md (sha256 71fd3d1585b30ef34e215a118f182be1dc2b91cfb656dde68806c5f5584245aa)
Base commit: 77552a387745e7058df994a08875d4c1c4b505b2     Head commit: 9f24c360c787944b08dd9a1b64a29c6af3f1712e     Branch: step/step-ed-e2-travel-paths-r1     PR: opened by Chief Of Staff from the bundle
Node: v22.23.3     npm: 10.9.9     rg: ripgrep 14.1.1 (rev 4649aa9700)

## Changed files
M	src/editor/effect/fit.ts
M	src/runtime/render/fx-doc.ts
M	src/runtime/render/fx-live.ts
A	src/runtime/render/fx-path.ts
M	src/runtime/render/fx-player.ts
A	tests/runtime/render/fx-path.test.ts
A	tests/runtime/render/fx-travel-qa.test.ts
A	tests/runtime/render/fx-travel-qa2.test.ts
A	tests/runtime/render/fx-travel.test.ts

## Green
npm test: 784/0/0/0    typecheck: exit 0    lint: exit 0    deps: exit 0    check:state: exit 0    check:law: exit 0
npm ci && npm run green: exit 0. 784 passing, 0 failing, 0 cancelled, 0 skipped, 0 todo. deps 111 modules / 355 deps. check:state OK (src). check:law OK (src).
smoke: 0 failed
stage-fixed seeds 1-50: win 48 lose 2 draw 0 timeout 0 history afc89d56f89737ea6b86d1a8c66bed31a2f3005aaa4d0ce37484830b880bee75
stage-weighted seeds 1-50: win 22 lose 28 draw 0 timeout 0 history b8007292ad5af0b6555009c05c1945a5a9a89ef510f8044a87d5da2b3c02ef6c
stress counts: 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0

## Shipped tests (sha256, unchanged)
429cb2ce9024eecf9ae9394e10e59fe9dcfead1d5fc776698c6d4e6907164298  tests/runtime/render/fx-path.test.ts
fa049e53849894feb12f00f97562e4e16dde9b6986fe0df40309e579a6d7b312  tests/runtime/render/fx-travel.test.ts
c55dd3ecbe0424eaa70956d1d4997ddf44ab682d1e5a8d554ead093e01d99a51  tests/runtime/render/fx-travel-qa.test.ts
dff0ae27ce351075d1f7d6bb854a75a1ef531ac476eb5e19bd844fe906cb6083  tests/runtime/render/fx-travel-qa2.test.ts

## Helpers & self-review (required)
- Helper ride/flatten (first): rulings 10, 11, 15 and 16 on fx-doc.ts and fit.ts → PASS. No code change.
- Helper ride/flatten (second): rulings 7, 10, 11, 15 and 16, probed on the real functions (first id, empty id not looked up, one hop, screen flash and non-riders silent, non-string is invalidValue, mint order parts then steps, dangling ride deleted and never null) → PASS. No code change.
- Helper path math (first): rulings 5, 6, 8 and 12 against a separate numeric reference → PASS. Whole-pixel ends land on a and b. It named a zero-length final bounce leg. No code change.
- Helper path math (second): the same rulings plus the shipped numbers, Infinity, L = 0, swerve at a half, and zero-length legs → PASS. Infinity plays the default with outOfRange. A trailing zero-length leg still lands on b. No code change.
- Helper play offset: rulings 2, 4, 8 and 9 on the static piece loop (sample is drawT − start, standing ox/oy, overlays x/y, heading only for the four travel kinds, light after the offset) → PASS. It did not move a unit. No code change.
- Helper play/lights: the same rulings, then a caster that steps while one scene link is held → FAIL. H was the live cell, so a named anchor whose sampled cell differs (spawn, or follow detached at the hit) missed the path by that delta. A plain air piece was already right. Fixed on the existing fx-live line (still 9 insertions, 2 deletions): when the anchor point is named and the anchor is not screen, H is the actor atUnit already sampled; otherwise H stays the live cell. Re-probe: a front-unit centre piece keeps c/r and oy −8 and gains ox 32 when the caster steps from (2, 2) to (4, 2) at t = 0; a foot-anchored air piece moves from (32, 32) to (64, 32); a plain air piece still tracks (64, 32). After detach-at-hit, pose 570 with the caster then at column 4 is (34, 78), on the path. Shipped play stays (32, 32) / (32, 56) / (32, 80).
- Self-review: Acceptance done — npm ci && npm run green exit 0, 784/0/0/0/0; smoke 0 failed (CHROME_PATH, the sandbox Chromium); sim afc89d56… and b8007292…; stress 27/0/0, 113/0/0, 181/0/0, 181/0/0, 27/373/0 (L p95 1.40 / 1.42 / 1.43 ms); pin diff empty (1e5dd82c, d7f64a09, 45a3dbaa, 4d7bbf48, d6d08696); shipped sha256s match; caps 54/12/11/3/5 and tests 41/49/26/18; total 219 ≤ 400; no Math.random, Date, timers, Card/Deck, or hp/mana/cost in the new src; no UI files; src/runtime does not import src/editor. QA checklist G1 done (four shipped files verbatim), G2 done (tsc exit 0, no ts-ignore, no any, strictness untouched), G3 done (no phase writes; src/state untouched), G4 done (PATH, readPath, pathAt, pathDots and FxPiece.path match the quoted interfaces), G5 done (do-not-touch paths absent), G6 done (only the nine listed product files; this hand-back folder is the required delivery, not a product file), G7 done (219, each file inside its cap), G8 done (deps 111/355, check:state and check:law exit 0), G9 done (decisions below), G10 done (acceptance lines above). Own probe, fresh link per time, throw plus stamp and particles riders with steady lights: light y 42, 64 and 86 at 30/300/570 ms (two lights; the per-effect cap is 2).

## Decisions & deviations (5–10 lines)
- path.at is the step start on the effect clock. Play samples pathAt at drawT minus the effect start. drawT is the warped pose, so hit-stop and a looped lap stay aligned with placeStep. No new due time.
- The offset is a new object after placeStep, because Standing and Overlay are readonly. A zero delta does not touch ox/oy, so a resting oy of −8 stays. Unit bands keep c and r; overlays move x and y. placeStep's signature is unchanged.
- H, the anchored cell, is the cell placeStep used. A named anchor other than screen takes the actor atUnit already sampled (spawn and detach-at-hit stay on that cell). Anything else uses the live cell, so a plain air piece still tracks a walking unit. A and B are cell feet with no dx/dy. No caster: LiveFx.at is the start. No target: LiveFx.at is the landing. If either end is missing, the piece stays on its anchor and does not turn.
- A non-finite bend, orbit_radius or orbit_turns (NaN and Infinity) plays the default and notes outOfRange. A finite value outside the range clamps. An absent field is silent. Orbit fields are read only on orbit, and bounce_points only on bounce.
- An empty ride is never a name. flatten does not map id "" and deletes an empty or non-string ride (the key is absent, never null). A string ride of a same-side step uses that first id's fresh id. Ids are still minted parts first, then steps.
- Heading uses the unrounded chord over 1/32, from 0 when u is below 1/32, so the first pose already has a departure heading. deg is null only when that chord is exactly (0, 0); the step's own angle is then left alone. Only the four travel kinds turn. Holding keeps the last chord.
- pathAt keeps no cache. pathDots returns at most 32 points and is not called by play. At most 8 hops. A zero-length final bounce leg is skipped; a few-ulp leftover at u = 1 can fall through to the straight bow, which is 0 at e = 1, so the pixel is still b. sin(2π) at the swerve's end is about −2e-16 and still rounds onto b. Not worth a line.
- No extra product file, no signature change, no new dependency. beatOf still says cast for a travel step (the Travel beat is E4, ruling 14). ride ships because CN-026 is accepted. The five pins are unchanged. Deps are 111 modules / 355 deps.

## Next step (optional proposal)
- E4 can add the Travel beat in beatOf, and can pin the Fit case where dropping the ridden step leaves the rider unknownRef at its anchor (CN-026 rule 5). The writer that omits a cleared ride is still E7.
