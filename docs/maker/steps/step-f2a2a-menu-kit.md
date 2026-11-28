# step-f2a2a-menu-kit: the ☰ game menu and stage switcher sheets, six icons and the one eyebrow, ready for F2a2b to wire (maker overhaul plan F2a, second half, slice 1 of 2; EA split, 28 Nov)

Step id: step-f2a2a-menu-kit          Revision: r1 (EA kit, 2026-11-28, for QA's kit review)
Repo: https://github.com/G-TileEngine/tileengine (you push your own step branch only; see Delivery)
Base commit: main **`ce848f57bc3becb9c60a3a6282bbac93d643d436`** (tree `25c25d1b`), docs-only on the **F2a1 merge `1ae71d48`** (PR #116, tree `24a5304d`). EA checked from a fresh `/tmp` clone: green on `ce848f57` is **1198 pass, 0 fail**, all checks OK; `1ae71d48..ce848f57` adds only `docs/qa/step-f2a1-review.md`, `docs/rebuild/README.md` and `docs/rebuild/step-f2a1.md`. If main has moved by the go, CoS re-checks that the move is docs-only and that the trial patch applies.
Branch: step/step-f2a2a-menu-kit-r1-chatA, from the base. Never commit to main. Chief Of Staff opens the PR to main from your pushed branch.
**F2a2b (step-f2a2b-land-on-map) follows on F2a2a's merge**: it branches from the merge commit of this step, so nothing in F2a2b starts before this one is merged.
Delivery (CN-028): one builder chat (ChatA), one QA review, and a rework round on must-fixes. Commit HANDBACK.md as the branch's last commit, then push once with `GH_BUILDER_TOKEN` through the one-shot credential helper in handoff/HAND-BACK.md (that branch only: never main, another branch or a tag; no force-push, no branch delete, no PR actions). The hand-back message quotes the branch, the full tip sha, the code head sha, the Base sha and the test counts. HANDBACK.md PR line: "PR: opened by Chief Of Staff from the branch".
Hand-back location: in the repo, on that branch: handback/step-f2a2a-menu-kit/r1/HANDBACK.md   (shape: handoff/HAND-BACK.md)
Depends on:
- `docs/maker/ux/maker-overhaul-plan.md` (sha256 `ef212329…`, on the base): **L71** (the F2a2 row: "Opening a game lands on the stage editor. ☰ sheet, stage switcher, project page deleted, Budgets (with F2a1's icon) and Build game move into ☰. Eyebrow section headers in its sheets (UX 15:4x) and the icons for ☰, the switcher, close, chevrons and the picked check. 14 smokes and 2 tests rebased | 340–390, plus about 10"); **L86** (the order line: … ART1a → F2a → ART1b …); **L87** (EA's F2a split note: F2a1 then F2a2, both in F2a's slot). Plan EA-3 (about L254–L262): the smokes and tests that pass through the project page.
- `docs/rebuild/step-f1.md` (sha256 `af2213b9…`) "QA non-blockers carried forward" **L207–L212**, fifth bullet: "Eyebrow headers (UX 15:4x); icons for ☰, the stage switcher, the tool bar, close and chevrons as they ship (F2a, F4)". F2a2a ships the six icons, the sheets and the one eyebrow; F2a2b wires them; the tool bar's icons stay with F4.
- `docs/rebuild/step-f2a1.md` (sha256 `5055ebe4…`) and `docs/qa/step-f2a1-review.md` (`dd6ec1d9…`): F2a1 put the budgets icon on the Budgets row; F2a2b mounts that row, unchanged, in ☰.
- `docs/maker/style-spec.md` r2 (sha256 `8765d849…`): **L71** § 7 Icons; **L73** eyebrow (4 px top margin; a count after a middot); **L76** stage editor top bar; **L77** modal sheet (40×4 grabber, h2, 48 px close; list rows 56 high with a `--muted` icon, name at 700, meta at 0.82rem, chevron; the picked stage shows a check instead of an icon); **L91–L93** shots. Shots `docs/maker/shots/f02-game-menu.png` (`2111ba98…`) and `f03-stage-switcher.png` (`a123337a…`).
- **UX ruling, 2026-11-28 00:22 London (binding; quoted in the Rulings).** **EA ruling, 2026-11-28 01:37 London: F2a2 runs as F2a2a then F2a2b** (485 counted as one step breaks the 400 cap; `SPLIT.md`).
- Format: none read or written (tile-project 6, stage 2, no bump). No play, export, build or `map.tile` change.
Read first: BUILD_GUIDE.md §2.2, §6, §7; style-spec L71–L77; shots f02 and f03; this guide's Rulings in full.
Kit: `handoff/steps/tests/step-f2a2a-menu-kit/` (SHA256SUMS, `tests/tools/f2a2-menu-kit.test.ts`, `plants-f2a2a.py`). Copy the test verbatim to `tests/tools/`; the kit folder is not counted and is not edited.
F1 plants: the F1 kit's plants **P20 and P24 no longer apply** (F2a1 changed the On label they plant against; recorded in the F2a1 guide, Ruling 7). They stay dead here; that is expected and is not a regression. No other earlier kit's plants are touched.
Carries: none filed. Differences from the mocks are listed under "Open points".

> Working style (REQUIRED): use all your helper agents for review, tests and cross-checks, take your time, never rush, and self-review against Acceptance and the QA checklist. HANDBACK.md must have § Helpers & self-review (each helper and what it reviewed, plus your self-review); without it the hand-back is REJECT (incomplete). See BUILD_GUIDE §0 and HAND-BACK item 8.

## Goal
Plan L71's F2a2 is 485 counted lines as one step, so EA split it. **F2a2a (this step)** lands everything the new sheets are made of, with no caller yet: six icons (menu, down, close, chevron, check, games), the CSS (the one eyebrow, the CSS grabber, sheet head, list rows, the flat look for the Budgets and Build rows inside ☰, the ☰ and switch buttons in the stage bar), and one new module `tools/maker/game-menu.ts` that renders the ☰ game menu, the stage switcher and the section sheets and holds the menu view. Its test pins the output. **No screen changes in this step**: nothing imports the module, so the maker looks and behaves exactly as on main; F2a2b wires it in, lands on the map and deletes the project page.

## Where step-f2a2a sits (placement card)
1. No new screen. Lives at: `tools/maker/game-menu.ts` (renders sheets F2a2b will show) and `icons.ts`/`app.css`.
2. Changes or replaces: nothing visible; adds six icons, fourteen CSS lines and one module.
3. Seen at once: nothing (no caller). The shipped test is the proof until F2a2b.
4. Data path: none · read by Test/play: nothing · demo data: unchanged · pictures: none.
5. Usable on landing: unchanged from main.
6. Proof: the shipped test (5 tests), 16 plants, the 25 smokes unchanged and green.

## Rulings
1. **UX ruling 00:22 (binding), eyebrows.** "(a) The stage switcher's 'STAGES' is an eyebrow: 0.75rem, weight 600, uppercase via CSS, letter-spacing 0.04em, colour `--muted`, 4px top margin. The markup text is 'Stages'. (b) The ☰ game menu has NO eyebrow. Its h2 is the game's name, then 8 flat rows in this order: Stages & maps, Units, Effects, Levels & XP, Budgets, Build game, Save, My games. The switcher's h2 is 'Stages', then one eyebrow 'Stages' over the stage rows, then + Add stage (as in f03). Add no other eyebrow text. (c) No other header converts now. Units' 'Start from a role', Levels' 'XP to reach each level' and the unit page's 'Abilities' stay h2." So `class="eyebrow"` appears exactly once in `tools/maker/**` (the shipped test pins it).
2. **UX ruling 00:22, six icons** (stroke only, in `icons.ts` style, appended after `budgets` at `icons.ts` L18, byte for byte):
   - menu `<path d="M4 7h16M4 12h16M4 17h16"/>`: a 48 px borderless icon button, top left of the stage bar.
   - down `<path d="M7 10l5 5 5-5"/>`: after the stage name in the top bar.
   - close `<path d="M6 6l12 12M18 6L6 18"/>`: a 48 px framed ghost button (`btn icon`), top right of every sheet header.
   - chevron `<path d="M9 6l6 6-6 6"/>`: at the end of every f02 row the menu draws itself.
   - check `<path d="M5 12l5 5 9-10"/>`: before the picked stage, in its icon slot.
   - games: four `<rect … width="7" height="7" rx="1.5"/>` at (3,3), (14,3), (3,14), (14,14), on the My games row.
   The grabber is CSS (40×4, `--line`, radius 999), not an icon.
3. **Rows and sheets** (style-spec L77; f02, f03): every sheet is `scrim[data-sheet] > .sheet[role=dialog] > .grabber` then a `.sheet-head` (h2 + close). The ☰ rows are `.list-row` buttons: muted icon, name in `.grow` (700), optional `.meta` (0.82rem, muted), chevron. Metas: "N stage(s)", the unit count, the effect count, Save's "Saved"/"Unsaved"; Levels & XP and My games have none. Read-only: Save is a disabled row with the newer-version title. The switcher's rows are `.list-row` with `aria-current`, the check (picked) or a blank 24 px `.slot` (others, as in the mock), then the ⋯ stage menu unless read-only, then the existing room tail (+ Add stage, Maps).
5. **The menu view** lives in a new module `tools/maker/game-menu.ts`: `MenuView = "none" | "menu" | "switch" | "units" | "effects" | "levels"`, `menuView()`, `menuSet(next)`, which **throws** `maker: no menu view ${next}` on anything else (Law 12: no silent fallback). Section sheets (`menu-units`, `menu-effects`, `menu-levels`) carry only a close in their head and the existing section bodies (`unitTail`, `effectsSection`, `levelsSection`) unchanged. Names avoid the existing `data-sheet` values ("effects", "levels", "menu").

`MenuHost`'s `budgets` and `build` fields are HTML strings F2a2b fills with `budgetsRow(state.files)` and `buildButton(building)`; here they are only mounted as given between Levels & XP and Save (F2a2b Ruling 4).

## Files and edits
`tools/maker/icons.ts`, after L18 (`budgets: …,`), six lines exactly:
```ts
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  down: `<path d="M7 10l5 5 5-5"/>`,
  close: `<path d="M6 6l12 12M18 6L6 18"/>`,
  chevron: `<path d="M9 6l6 6-6 6"/>`,
  check: `<path d="M5 12l5 5 9-10"/>`,
  games: `<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>`,
```

`tools/maker/app.css`, appended after the last rule (base L74), fourteen lines exactly (the `.eyebrow` and `.grabber` rules are pinned byte for byte):
```css
.eyebrow { margin: 4px 0 0; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; color: var(--muted); }
.grabber { flex: none; width: 40px; height: 4px; border-radius: 999px; background: var(--line); align-self: center; }
.sheet-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.sheet-head.bare { justify-content: flex-end; }
.list-row { display: flex; align-items: center; gap: 12px; width: 100%; min-height: 56px; padding: 0 4px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); font-weight: 700; text-align: left; }
.list-row > .ico, .list-row > .slot { width: 24px; color: var(--muted); }
.list-row .grow { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.list-row .meta { color: var(--muted); font-size: 0.82rem; font-weight: 600; }
.pair { display: flex; align-items: center; gap: 8px; }
[data-sheet="game-menu"] .stage-row { display: flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 4px; border: 0; border-bottom: 1px solid var(--line); border-radius: 0; background: transparent; color: var(--ink); text-align: left; }
[data-sheet="game-menu"] .stage-row > .ico { margin: 0; color: var(--muted); }
.topbar .btn.icon.bare { border-color: transparent; }
.topbar h1 .switch { display: inline-flex; align-items: center; gap: 4px; max-width: 100%; min-height: 48px; padding: 0; border: 0; background: transparent; color: var(--ink); font: inherit; }
.switch > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
```

`tools/maker/game-menu.ts` (new file, reference; the shipped test pins its output, not its source; Rule 8 holds):
```ts
import { icon, type IconName } from "./icons.ts";
const amp = String.fromCharCode(38);
const esc = (text: string): string => text.replace(/[&<>"']/g, (ch) => ch === amp ? amp + "amp;" : ch === "<" ? amp + "lt;" : ch === ">" ? amp + "gt;" : ch === '"' ? amp + "quot;" : amp + "#39;");
export type MenuView = "none" | "menu" | "switch" | "units" | "effects" | "levels";
const VIEWS: readonly MenuView[] = ["none", "menu", "switch", "units", "effects", "levels"];
let view: MenuView = "none";
export function menuView(): MenuView {
  return view;
}
export function menuSet(next: string): void {
  const found = VIEWS.find((item) => item === next);
  if (found === undefined) {
    throw new Error(`maker: no menu view ${next}`);
  }
  view = found;
}
export type MenuHost = { readonly name: string; readonly stages: number; readonly units: number; readonly effects: number; readonly budgets: string; readonly build: string; readonly dirty: boolean; readonly readOnly: boolean; readonly resume: boolean };
const close = `<button type="button" class="btn icon" data-act="m:close" aria-label="Close">${icon("close")}</button>`;
const modal = (name: string, inner: string): string => `<div class="scrim" data-sheet="${name}"><div class="sheet" role="dialog"><div class="grabber"></div>${inner}</div></div>`;
const head = (title: string): string => `<div class="sheet-head"><h2>${esc(title)}</h2>${close}</div>`;
const count = (n: number, one: string, many: string): string => `${n} ${n === 1 ? one : many}`;
function row(act: string, glyph: IconName, name: string, meta: string): string {
  const tail = meta === "" ? "" : `<span class="meta">${esc(meta)}</span>`;
  return `<button type="button" class="list-row" data-act="${act}">${icon(glyph)}<span class="grow">${esc(name)}</span>${tail}${icon("chevron")}</button>`;
}
export function gameMenu(host: MenuHost): string {
  const reason = "Made with a newer TileEngine. Open only.";
  const save = host.readOnly ? `<button type="button" class="list-row" disabled title="${esc(reason)}">${icon("save")}<span class="grow">Save</span>${icon("chevron")}</button>` : row("save", "save", "Save", host.dirty ? "Unsaved" : "Saved");
  const cont = host.resume ? `<button type="button" class="btn ghost" data-act="continue">Continue</button>` : "";
  const rows = [row("m:switch", "stages", "Stages & maps", count(host.stages, "stage", "stages")), row("m:units", "units", "Units", String(host.units)), row("m:effects", "effects", "Effects", String(host.effects)), row("m:levels", "levels", "Levels & XP", ""), host.budgets, host.build, save, row("m:games", "games", "My games", "")];
  return modal("game-menu", `${head(host.name)}${rows.join("")}${cont}`);
}
export function stageSwitcher(rows: readonly { readonly id: string; readonly name: string }[], current: string, readOnly: boolean, tail: string): string {
  const items = rows.map((item) => {
    const lead = item.id === current ? icon("check") : `<span class="slot"></span>`;
    const pick = `<button type="button" class="list-row" data-act="stage:${esc(item.id)}" aria-current="${item.id === current ? "true" : "false"}">${lead}<span class="grow">${esc(item.name)}</span></button>`;
    const more = readOnly ? "" : `<button type="button" class="btn icon" data-act="r:menu:stage:${esc(item.id)}" aria-label="Menu ${esc(item.name)}">${icon("more")}</button>`;
    return `<div class="pair">${pick}${more}</div>`;
  });
  return modal("stage-switcher", `${head("Stages")}<p class="eyebrow">Stages</p>${items.join("")}${tail}`);
}
export function sectionSheet(name: MenuView, body: string): string {
  return modal(`menu-${name}`, `<div class="sheet-head bare">${close}</div>${body}`);
}
```

`tests/tools/f2a2-menu-kit.test.ts`: copied verbatim from the kit.

## Caps (counted: `git add -N . && git diff --numstat ce848f57 -- . ':!handback/**' ':!package-lock.json'`)

| File | + | − | counted (cap) |
|---|---|---|---|
| `tests/tools/f2a2-menu-kit.test.ts` | 65 | 0 | 65 |
| `tools/maker/app.css` | 14 | 0 | 14 |
| `tools/maker/game-menu.ts` | 44 | 0 | 44 |
| `tools/maker/icons.ts` | 6 | 0 | 6 |
| **total** | 129 | 0 | **129** |

## Kit and plants
- `handoff/steps/tests/step-f2a2a-menu-kit/SHA256SUMS`: run `sha256sum -c SHA256SUMS` inside the folder first.
- `tests/tools/f2a2-menu-kit.test.ts` (5 tests: the six drawings byte for byte; the game menu's h2, 8 rows in order, chevrons, grabber, close, no eyebrow, no primary, Continue; the switcher's h2, one eyebrow, the check and the blank slot, read-only; the exact eyebrow and grabber rules and one eyebrow in tools/maker; `menuSet` throws on an unknown view, Law 12).
- `plants-f2a2a.py`: 16 one-edit plants (P1–P16), each restored after its run. From the repo root on the finished tree, `python3 handoff/steps/tests/step-f2a2a-menu-kit/plants-f2a2a.py` must print `16/16 caught`. P17–P22 need F2a2b's wiring and live in F2a2b's kit.

## Acceptance
- `npm ci && npm run green` exits 0 with **1203 pass, 0 fail** (floor 1198 + 5); the shipped test copied verbatim.
- `tsc -p tools/tsconfig.json`: only the 3 base errors, `tools/effect-designer/page.ts` L101 (TS18047) and `tools/maker/home.ts` L93 twice (TS7053).
- Plants: 16/16 caught.
- Smokes: no smoke file changes. All 25 solo, each at 390 and 360, still PASS with main's counts: s0 14, s3 18, s4a 16, s4b 16, s4c 16, s5a 16, s5b 16, s5c 16, s6a 18, s6b 16, s6c 18, s6d 14, s7 20, s8 16, s8c 8, s9 12, s9b 14, s9c 6, s10b 8, s10c 8, s10d 8, s11a 6, s11a2 6, s11b 6, s11c1 6.
- Look: the maker looks as on main (nothing is wired). The sheets' look is checked in F2a2b against f02/f03.
- Rule 8 scan of the diff: clean (one statement per line in new code; no chained control headers; braced bodies; only an innermost `for (…) oneStatement;` or a braceless `if (…) continue;` / `if (…) return x;` on one line).
- Size: within the caps above.

## Must NOT
No edits outside the Files table; nothing in src/**, tools/play-stage, tools/export, tools/apk, tools/art-bake, tools/maker/home.ts, tools/maker/stage.ts, tools/maker/project.ts, data/, fixtures/, the root package.json or package-lock.json, docs/maker/**, any other test or smoke, the F1, ART1a, F2a1 or F2a2 kit folders, painter-proto or ui-shell; no map.tile change; no new dependency; no new eyebrow text and no other header converted (Ruling 1 (c)); nothing imports `game-menu.ts` yet.

## Open points (EA flags for QA/UX: where the build differs from the f02/f03 mocks)
1. Budgets and Build rows are mounted as they are (F2a2b Ruling 4): no chevron, and the Budgets row reads "Budgets: all good" (its summary) rather than f02's "Budgets". The Budgets row is absent when a project has no budgets, as on main. Adding a chevron would re-pin F2a1's shipped test (f2a1-carries L69), budgets-11c1 and export-11a.
2. Continue (resume) stays as a ghost button under the ☰ rows; the plan doesn't place it.
3. Stage rows have no "Map · cols×rows" meta (f03 shows one); the ⋯ stage menu stays beside each row, and the Maps section follows + Add stage.
4. Landing goes to the first stage in `project.stages` (F2b adds the last stage edited). Deleting the current stage from the switcher moves to the first stage.
5. Non-picked switcher rows have a blank 24 px slot, as in the mock.
6. Tests rebased: 4 (project-home, play-stage-source, f1-look-kit, export-11a), not the plan's 2; smokes edited: 21 of 25, not the plan's 14 (EA-3 counted only those passing through the project page; ☰ and the switcher also move Back, Units, Effects, Levels and the stage list).
7. The stage bar keeps its existing second row (View, Background, Rules, Start new, Test) until F4's tool bar; f01's one-row bar is not this step.
8. On the project page "Can't play yet" was a sheet; on the stage the Test and Build gates show the stage banner with Dismiss.

## Places that change if UX re-rules the eyebrow
- `tools/maker/game-menu.ts`, `stageSwitcher`: `${head("Stages")}<p class="eyebrow">Stages</p>`.
- `tools/maker/app.css`: the `.eyebrow { … }` rule.
- `tests/tools/f2a2-menu-kit.test.ts`: the switcher test (one eyebrow "Stages"), the game menu test ("no eyebrow") and the eyebrow test (the exact rule; one use in tools/maker).
- `plants-f2a2a.py` and `plants-f2a2b.py`: P5, P6, P7, P8, P9.
- The F2a2a guide: Ruling 1, the CSS block and the Look note.

## EA trial record
Trial `f2a2a-trial.patch` on `ce848f57`: commit `3b40888365c8a1117fc98cfc36b817f04cc9cc6e` (tree `5687d21b463736a4d873c31f4919dc9140a0726c`), G-TileEngine identity. Checked on a fresh GitHub clone: `git apply --check` passes on `ce848f57` and `git am` gives that tree. Green **1203 pass, 0 fail**, all checks OK; tools tsc 3 base errors (page.ts L101; home.ts L93 ×2); plants 16/16; all 25 smokes PASS at 390 and 360 (`smokes-f2a2a/` on the box); Rule 8 scan clean.

## Hand-back sections
Green (code head sha and tree, counts), Plants (`plants-f2a2a.py` output), Smoke (all 25 solo at 390 and 360 with their ok counts), Rule 8 scan, Size (numstat against the caps), Helpers & self-review (EVERY helper agent, script and one-off command file you used, one line each; "None" if none).
