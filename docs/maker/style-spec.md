# TileEngine maker style spec (r62 look)

Owner: Editor & UX Designer, 2026-11-18. Copied from the ui-shell prototype's real CSS (`ui-shell/css/app.css`, framed pill from `ui-shell/mock-effects-v3/effects-v3.css`, round 3c). Every maker screen uses **only** these values. Do not use a template theme, a "dark paper" look, a CSS framework, web fonts or icon fonts. Light is the default theme. Dark is the same tokens switched by `html[data-theme="dark"]`, and by `prefers-color-scheme: dark` when `data-appearance="system"`. Compare each screen against `docs/maker/shots/` (390×844 CSS px, saved at 2× as 780×1688).

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
