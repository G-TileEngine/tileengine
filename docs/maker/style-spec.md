# TileEngine maker style spec (r62 look, r2)

Owner: Editor & UX Designer, 2026-11-18. Copied from the ui-shell prototype's real CSS (`ui-shell/css/app.css`, framed pill from `ui-shell/mock-effects-v3/effects-v3.css`, round 3c). Every maker screen uses **only** these values. Do not use a template theme, a "dark paper" look, a CSS framework, web fonts or icon fonts. Light is the default theme. Dark is the same tokens switched by `html[data-theme="dark"]`, and by `prefers-color-scheme: dark` when `data-appearance="system"`. Compare each screen against `docs/maker/shots/` (390×844 CSS px, saved at 2× as 780×1688).

**r2 (2026-11-27, Editor & UX Designer):** adds the parts the maker overhaul needs (`docs/maker/ux/maker-overhaul-plan.md`, steps F1 to F5) in § 7 and the target shots `f01`–`f10` in § 8. Same tokens, same rules, plus one new token (`--stage-bg`). The ui-shell prototype is a direction only: no prototype code or CSS is copied, and a part or screen is here only if main or a roadmap step ships it. Sections 1–6 are unchanged apart from the token row.

## 1. Colour tokens (`:root`)
| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f4f5f7` | `#0f1218` | screen background |
| `--surface` | `#ffffff` | `#1a1f2a` | top bar, cards, sheets, ghost buttons |
| `--surface-2` | `#f8f9fb` | `#151a23` | quiet rows, zero pills |
| `--ink` | `#12141a` | `#e8ecf5` | text |
| `--muted` | `#5c6578` | `#9aa3b5` | secondary text, eyebrow |
| `--line` | `#d8dde8` | `#2c3444` | borders, dividers |
| `--accent` | `#2f5bff` | `#6b8cff` | primary button, selected |
| `--accent-ink` | `#ffffff` | `#0b1020` | text on accent |
| `--accent-soft` | `#e8edff` | `#1e2a4a` | selected card fill, chips |
| `--danger` / `--danger-soft` | `#b42318` / `#fef3f2` | `#ff8a7a` / `#3a1c1a` | delete, errors |
| `--warn` / `--warn-soft` / `--warn-line` | `#93370d` / `#fffaeb` / `#fedf89` | `#f5c26b` / `#3a2e14` / `#6b5420` | "Can't play yet" banner, warnings |
| `--ok` / `--ok-soft` | `#1d6b3a` / `#ecfdf3` | `#7bd99a` / `#14301f` | fits, saved |
| `--soon` | `#98a2b3` | `#6b7385` | disabled primary fill (text `#fff`) |
| `--focus` | `#1a3fd4` | `#8aa4ff` | `:focus-visible` outline 3 px, offset 2 px |
| `--seg-line` | `#7a8394` | `#8a92a3` | framed control border (AA 3.82:1 / 5.28:1) |
| `--stage-bg` | `#1a2233` | `#1a2233` | effect preview and play-stage backdrop (r2) |
| `--shadow` | `0 8px 24px rgba(18,20,26,.08)` | `0 8px 24px rgba(0,0,0,.45)` | cards, hero |
Also in the token block, the same in both themes: `--hero: linear-gradient(160deg, #1a3fd4, #2f5bff 55%, #6b8cff)` and `--hero-ink: #fff` (Home hero), `--scrim: rgba(15,23,42,.45)`, `--sheet-shadow: 0 -8px 32px rgba(0,0,0,.18)`, `--danger-line: #fecdca`, `--soon-ink: #fff`, `--frame-bg: #0e1118` and `--frame-shadow: 0 20px 60px rgba(0,0,0,.45)`. Everything below names these tokens. `tools/maker/tokens.css` holds this whole block, and no other maker file has a colour literal.

## 2. Type
- Font stack: `"Segoe UI", system-ui, -apple-system, sans-serif`. The base is the browser's 16 px; controls use `font: inherit`.
- Sizes: screen title (`.topbar h1`) 1.05rem/700, letter-spacing -0.01em. Eyebrow 0.75rem/600, uppercase, letter-spacing 0.04em, `--muted`. Wizard question 1.25rem/700, line-height 1.25, letter-spacing -0.02em. Hero h2 1.35rem. Body and buttons 1rem/700. Hint 0.92rem, line-height 1.4, `--muted`. Card name 700. Card sub 0.82rem `--muted`. Chip 0.78rem/600. Pill 0.66–0.78rem/800.

## 3. Spacing and sizes
- Scale (px): **4, 6, 8, 10, 12, 14, 16, 20**. Screen padding is 16. Gap between cards is 10–12. Gap between buttons is 8–10.
- Top bar: min height `--header-h` 56, padding `10px 16px 8px`, `--surface`, bottom border 1 px `--line`.
- Bottom bar: `--bar-h` 72 + `env(safe-area-inset-bottom)`, padding `10px 12px`, grid `1fr 2fr` (three buttons: `1fr 1fr 1.4fr`), gap 10. Background `--surface` at 96% with an 8 px backdrop blur, top border 1 px `--line`.
- Scrolling body padding: `16px 16px calc(72px + 20px + safe-area)`.
- **Every tap target is 48×48 or larger.** When the visible control is smaller, the hit area still reaches 48 px.

## 4. Radii
Cards, hero, choice and list cards: `--radius` **16**. Buttons and toast: **14**. Framed control: **12**. Inner pill, small thumbs: **8**. Chips and status pills: **999**. Sheet: `16px 16px 12px 12px`.

## 5. Components
- **Button `.btn`:** min height 48, radius 14, padding `0 14px`, weight 700, border 2 px.
  - **Primary:** fill `--accent`, text `--accent-ink`, no border. Disabled: fill `--soon`, text `#fff`.
  - **Ghost:** fill `--surface`, border `--line`, text `--ink`.
  - **Danger:** fill `--danger-soft`, text `--danger`, border `#fecdca`.
  - Full-width stacked buttons on Home have a 12 gap. See `01-home.png`.
- **Card (project or list item):** `--surface`, border 1 px `--line`, radius 16, padding 12, `--shadow`, column gap 10. Name 700, sub 0.82rem `--muted`. Action row buttons are 48 px high, 0.82rem, two per row (`flex: 1 1 calc(50% - 8px)`).
- **Choice card (wizard):** min height 72, padding `14px 12px`, radius 16, border 2 px `--line`, `--shadow`. Selected (`aria-pressed=true`): border `--accent`, fill `--accent-soft`.
- **Sheet:** a bottom sheet over the scrim, card `min(390px,100%)`, max height 85vh, padding 16, radius `16 16 12 12`, shadow `0 -8px 32px rgba(0,0,0,.18)`. It never covers the bottom bar's primary action without its own action row.
- **Toast (Undo):** absolute, 16 from left and right, sitting 16 above the bottom bar. Fill `--ink`, text `--bg`, padding `14px 16px`, radius 14, weight 650. Fades in 0.2 s with an 8 px rise. See `18-undo-toast.png`.
- **Warning banner ("Can't play yet"):** fill `--warn-soft`, border 1 px `--warn-line`, text `--warn` 700, radius 16, and a ghost **Fix** button 48 px on the right. See `39b-hard-blocked.png`.
- **Error banner:** the same shape with `--danger-soft`, `--danger` and border `#fecdca`. It always shows words, never a code.
- **Chip:** inline-flex, padding `6px 10px`, radius 999, `--accent-soft`, 0.78rem/600.
- **Status pill:** padding `3px 9px`, radius 999, 0.78rem/800, border 1.5 px `--line`, fill `--bg`. Open: border `--accent` + `--accent-soft`. Ok: `--ok` on `--ok-soft`. Warn: `--warn` on `--warn-soft`.
- **Framed pill toggle (round 3c), for any 2–3 way choice:** the frame is 40 px high with a 1 px `--seg-line` border, radius 12, `--surface` fill and 8 px between frames. Each option is a button with a 48 px hit area (`margin: -5px 0`, transparent). The selected option is an **inset pill** 30 px high, 4 px in from the frame (`margin: 0 4px`), radius 8, filled `--accent` with `--accent-ink` text. The pill never touches the frame edge or its neighbours.
- **Read-only badge ("Newer version"):** a status pill in warn colours on the card.

## 6. 390 px layout rules
- Design at **390×844**. The app is full-bleed at 420 px wide and below: no frame, radius 0, `height: 100dvh`, `--bg` fill. Above 420 px it sits in a centred 390 px column with radius 28 and shadow `0 20px 60px rgba(0,0,0,.45)` on `#0e1118`.
- The screen is a column: top bar, scrolling body, then a fixed bottom bar when the screen has actions. There's one scroll area per screen and no sideways scroll.
- Content width is 390 − 32 = 358 px. Long names truncate with an ellipsis and never wrap the top bar.
- At **360 px** wide nothing overflows, every target stays 48 px, and the two-per-row action buttons may wrap to one per row.
- Respect `env(safe-area-inset-bottom)`. Sheets take at most 85vh.
- Contrast is WCAG AA for all text, and 3:1 for control borders (`--seg-line`).

## 7. Parts added in r2 (overhaul steps F1–F5)
Every part uses only the tokens in § 1. Every tap target stays 48×48 or larger.
- **Button order (F1):** one primary (`.btn`, `--accent`) per screen or sheet. On the stage editor that's ▶ Test in the top bar. Every other button is ghost. Delete and Start new are always danger. No screen has a column of primary buttons.
- **Icons (F1):** inline SVG line icons in one maker file. 24 px, `viewBox 0 0 24 24`, stroke `currentColor` 2 px, round caps and joins, no fill except the ▶ triangle and the ⋯ dots. No icon font, emoji or package. The shots use: menu, play, undo, paint, objects, units, rules, more, stages, effects, levels, budgets, build, save, games, close, down, check, plus, back, image, grid, resize, edit and chevron. F1 ships the ones its screens use (about 16), and later steps add their own.
- **Picker chip with picked ring (F1, fixes item 3(a) app-wide):** every picker option is a chip, never a primary `.btn`. 48 px high, radius 999, padding `0 14px 0 8px`, 2 px `--line` border, `--surface` fill, 0.9rem/700. A 28 px swatch or thumb (radius 8) sits on the left when the option has a colour or picture. **Picked** (`aria-pressed=true`): `--accent` border, `--accent-soft` fill and an outer ring (2 px `--surface` gap, then 2 px `--accent`). The picked one must be clear without colour vision (it also has the ring). See `f04`, `f10`.
- **Eyebrow section header (F1):** the § 2 eyebrow, with a 4 px top margin, above each group in a sheet or page. A count goes after a middot ("Abilities · 1", "Attack · 2").
- **Card thumbnail (F1):** 48×48, radius 8, `--surface-2` fill, 1 px `--line` border. It shows the thing's picture. With no picture it shows the thing's icon in `--muted`. The unit page's big thumb is the same at 72×72. See `f05`, `f07`, `f08`.
- **Undo chip (F1, or F4 if F1 runs over 380 lines):** replaces the full-width "Nothing to undo" bar. It floats over the map's bottom-left, 16 px from the left and 12 px above the tool bar. 40 px visible with a 48 px hit area, radius 999, `--surface`, 1 px `--line`, `--shadow`, undo icon plus "Undo" at 700. It's hidden when there's nothing to undo and while a sheet is open. See `f01`.
- **Stage editor top bar (F2a):** ☰ icon button (48, no border) on the left. The **stage switcher** in the middle: the stage name at 1.05rem/700 with a down chevron, 48 high, and an ellipsis when long. ▶ **Test**, the screen's only primary, on the right. See `f01`.
- **Modal sheet (F2a: ☰ game menu and stage switcher):** the § 5 sheet over the scrim, with a 40×4 grabber (`--line`, radius 999), an h2 title and a 48 px close button. **List rows** are 56 high: a `--muted` icon, the name at 700, an optional meta at 0.82rem `--muted`, then a chevron. 1 px `--line` dividers. The picked stage shows a check instead of an icon. Closing returns to the map. See `f02`, `f03`.
- **Bottom tool bar (F4):** five equal columns: Paint, Objects, Units, Rules, More. Each tool is 56 high, radius 14, an icon over a 0.75rem/700 label in `--muted`. The open tool has `--accent` text, `--accent-soft` fill and a 2 px `--accent` border. The bar is `--surface` with a 1 px `--line` top border, padding `6px 8px` plus the safe area. It replaces the top wrap of text buttons. See `f04`–`f06`.
- **Tool sheet (F4):** opens from a tool and sits just above the tool bar, with no dimming, so the map stays visible and tappable above it. The § 5 sheet look, max height 46vh, title plus close. One tool sheet at a time; tapping the open tool again closes it. See `f04`–`f06`.
- **Hero card (F2b, My games):** `--hero` fill, `--hero-ink` text, radius 16, padding 16, `--shadow`. Eyebrow "Last edited", the game name as h2 at 1.35rem, one line of detail, and **Continue** as the screen's one main action (a `--surface` button with `--ink` text, since an `--accent` button can't sit on the blue hero). See `f07`.
- **Slider row (F4/F5):** the label at 0.92rem/700 with the value on the right in `--muted`, over the existing 48 px `input.knob`. See `f08`, `f10`.
- **Compact ability card (F5):** min height 64, padding `8px 12px`, the § 5 card look. A 5×5 mini diagram on the left (8 px cells, 1 px gap, radius 1): reach in `--accent`, the unit in `--ink`, the rest `--surface-2`. Then the name at 700 and one 0.82rem `--muted` line. An ability the unit already has shows an **Added** status pill in ok colours, and tapping it opens that ability. 4–5 cards fit on one 390×844 screen. See `f09`.
- **Effect preview (F5):** a 150 px box, radius 16, `--stage-bg` fill. It loops a sample cast using the play stage's own effect drawing, with a 0.75rem caption. Colour options are picker chips with a swatch, and their colours come from the effect's data (the ramps), not tokens. Then the sliders, "Used by" as cards, and ▶ Test as the page's primary. See `f10`.
- **The map (until F3b):** keeps today's cells (the `.cell` rules in `app.css`: coloured blocks with words). F1 restyles only the buttons and chips around it. There are no swatches, discs or old art in between (CEO, 27 Nov 03:53). F3b's art cells (32 px pictures, tall things overlapping the row above, and View → Simple blocks) get their own section in r3, after the CEO passes ART2. The art rules go in `docs/maker/art-style.md` (drafted with ART0, added after decision 5).

## 8. Target shots (r2)
These are look targets for the overhaul steps, made from this spec's tokens and parts (a static mock, not app code, not ui-shell). They're 390×844 CSS px, saved at 2× as 780×1688. Names, numbers and stages in them are example data. Each step's Done-when compares its screens to the matching shot at 390 px. The shots were checked at 390 and 360 px with no sideways overflow and every button at 48 px or more.

| Shot | Screen | Ships in |
|---|---|---|
| `f01-stage-editor.png` | Opens on the map: ☰, stage switcher, ▶ Test, Undo chip, tool bar | F2a (top bar), F1 (Undo chip), F4 (tool bar) |
| `f02-game-menu.png` | ☰ game menu sheet: Stages & maps, Units, Effects, Levels & XP, Budgets, Build game, Save, My games | F2a |
| `f03-stage-switcher.png` | Stage switcher sheet with + Add stage | F2a |
| `f04-paint.png` | Paint tool sheet: terrain chips from the game's terrain list, one picked | F1 (chips), F4 |
| `f05-units-tool.png` | Units tool sheet: tap a unit, then tap the map | F4 |
| `f06-more.png` | More: Background art, View, Start new, Resize, Rename | F4 |
| `f07-my-games.png` | My games: hero card with Continue, then all games | F2b |
| `f08-unit-editor.png` | Edit unit: thumb, stat sliders, abilities, + Add ability | F4 (from the map), F5 (cards) |
| `f09-add-ability.png` | Add an ability: compact cards, "Attack · 2", Added | F5 |
| `f10-effect-page.png` | Effect page: live preview, colour chips with ring, sliders, Used by, ▶ Test | F5 |

Not shot on purpose: anything with no shipped or roadmap feature (a separate Walls tool, markers, Game settings), and the map with new art (that waits for ART2).
