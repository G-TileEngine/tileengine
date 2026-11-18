# Weather & Time cycle — UX backlog (Editor & UX Designer)

Status: LOGGED as IDEA (CEO 2026-11-10, t50u), not designed, not v1 unless the CEO says so.
Reference clip: https://x.com/daniildesigns/status/2117571497665663044

## CEO questions the maker must be able to answer (few buttons, no code)
1. Time of day: Always day / Always night / Cycle. Cycle length as a slider (e.g. one in-game day = N real minutes), or tied to turns.
2. Weather: Off / On a timer (chance + interval sliders) / By trigger (entering a stage, starting or finishing a quest, a set turn). Can combine timer + triggers.
3. Player sleep: toggle "Bed skips time"; pick hours slept (slider) and what it lands on (morning / night).

## Day/night art styles
- ashroad (day) and moonlit (night) are already a day/night pair. Proposal: the style picker shows a "Day + night pair" style that bundles both code-drawn versions; the cycle swaps or blends between them (dusk/dawn tint).
- Single styles still work; they get a night tint overlay instead of a paired version.

## Wizard/menu placement (proposal)
- New project wizard: no new step (keep it short). Default = Always day.
- Stage settings sheet → "Weather & time" row (sheet ≤40% height, both themes, targets ≥48px).
- Per-stage override: "Use game default" or a custom setting for this stage (e.g. a cave is always night, no rain).

## Needs from others
- Architect: time model (real time vs turns), how lighting/blend is applied; ashroad↔moonlit blend feasibility.
- Librarian: weather/time triggers and effects (rain slows? night vision?) as behaviours.
- DSK: project-format fields (project.time, project.weather, per-stage overrides, style pairs).

## From the reference clip (daniildesigns, isometric pixel diorama, 12s)
- One small panel "A changing sky" with two columns: Time of day (‹ Morning / Daytime / Sunset / Night ›, toggle "Follow the day", note "One in-game day lasts 24 minutes") and Weather (‹ Clear skies / Cloudy / Gentle rain ›, toggle "Let it change").
- Adopt for our editor preview: ‹ › steppers so the maker can preview any phase or weather instantly, and plain-word toggles + a one-line note stating the cycle length.
- Look: smooth whole-scene colour tint per phase (soft morning, crisp day, amber sunset, blue-grey night); shadows stay static. At night, lights fade in (windows, lamp posts) plus firefly particles. Cloudy dims slightly. Rain = diagonal streaks + ground/water ripple splashes; lights stay visible through rain.
- Implication: objects/tiles get an optional "Glows at night" toggle (window, lamp). Cheap tint-based approach suits phones.
