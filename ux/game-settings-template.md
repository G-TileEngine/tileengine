# Default in-game settings template (Before The Fall) — DRAFT

Status: **DRAFT**. Aligned with **profile-format r2** (2026-11-09) + DSK `music.master` note (PROPOSED). Nothing public.

Template pin (docs only): `btf-hud-settings@1`. Control field: `key`. Project field: `gameSettings`.

## Core (Required — lock in UI, always shown)

| key | Label | Type | Default | Notes |
|---|---|---|---|---|
| `master` | Master volume | slider 0–100 | 100 | **7th core (PROPOSED, DSK / EA-A8).** Path form `music.master`. `showIn: both`. Older profiles without the key read **100** (no migration). Place next to Music / Sound. |
| `bgm` | Music | slider 0–100 | 100 | |
| `sfx` | Sound | slider 0–100 | 100 | |
| `graphics` | Graphics | low/mid/high | high | |
| `fps` | FPS | 30/60 | 60 | |
| `theme` | Theme | light/dark/system | system | |
| `language` | Language | picker | system (Follow device) | |

CEO locked six cores earlier; **Master volume** is the proposed seventh until CEO confirms.

## Before The Fall extras (in template, **Include off by default** for new games)

`edge_glow`, `fight_speed` (`showIn: pause`), `play_screen`, `piece_size`, `fight_auto` (`showIn: pause`).

## Keybinds (optional section, off by default, PC)

`key_confirm` (Enter), `key_cancel` (Escape) — Include off for new games.

## Editor UX

- Core rows show **🔒 Required** only (no Include, no Hide — always shown).
- Non-core: Include + Hide.
- Instant apply + live preview; writes **debounced 300 ms**. **Reset** writes stamped `null` per key.
- Advanced: Show in Title / Pause / Both (`showIn`).
- Editor Preview volume: `editor-prefs.previewVolume` 0–100, **default 100**, never exported.

Sources: Before The Fall `HudSettingsTab.tsx` + modules under `chess/game/`. Host actions are not settings keys. `master` maps to the audio master bus via `@te/audio` (never stored in the project — per-player only).
