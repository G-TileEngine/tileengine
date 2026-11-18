# Studio profile & achievements — DRAFT

Status: **DRAFT** for Editor UX. Aligned with **`data/profile-format.md` r1** (§1, §2, §5, §7.5). Nothing public.
CEO ask 2026-11-09 via CoS.

This screen is the **studio profile** (TileEngine maker / editor). It is **not** a built game's `player-profile`. Copy on the screen says **Studio profile**.

## Naming (DSK wins — §7.5)

| Was (early EUX) | Now |
|---|---|
| `appearance` | `prefs.theme` (`light` \| `dark` \| `system`, default `system`). UI label **Appearance**; `system` shown as **Follow device**. |
| achievement `name` | `title` |
| `target` | `trigger.count` (or `progressTarget` with `trigger.field`) |
| snake_case events | camelCase (`stageCreated`, `spriteUploaded`, …) |
| `progress` map | `achievements[]` ledger `{id, unlockedAt, progress}` |
| `seenToasts` | **`editor-prefs`** (device-local, never synced) |
| `kind: tile-user-profile` | `kind: "profile"` |

## Avatars (EUX ruling)

12 built-in CC0 Kenney-style portrait/creature picks (`avatar_knight` … `avatar_fox`) plus **initials fallback** when `prefs.avatarId` is null. Own-image upload is greyed ("Coming later").

## Achievements UI

- Hidden + locked → **???** card with category + "Hidden, keep playing". Title/description reveal on unlock.
- Unknown ledger ids (newer engine) → greyed **"From a newer version"**, kept forever, counted at the bottom.
- Toast: once per device per unlock; seen state in `editor-prefs`.

## Starter set (22 = original 20 + first save + first export)

See `ProfileStore.ACHIEVEMENTS` / profile-format §2.7. Wired mock triggers: `wizardCompleted`/`stageCreated`, `spriteUploaded`, `previewStarted`, `buildStarted` (+ `themeChanged`, `projectSaved`, `projectExported` where the shell already acts).

## Open questions (remaining)

1. Cloud sync reset: local-only new profile vs replace synced (DSK §6.2)?
2. Cross-project vs per-project medals for `ach_five_stages` — DSK uses creations with `groupBy projectId`.
