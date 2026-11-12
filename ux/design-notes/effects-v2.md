# Effects v2 (plan only; build after H2)

Source: the @mozza_dev Astrologer clip, researched on the web. Full spec `ux/effects-v2-plan.md`; data format setup-format r20 §2.10.2 (ACCEPTED).

## CEO decisions
- Current preview layout stays. GIF is the default preview.
- No flash cap for makers; Astrologer preset uses one soft flash; players get Reduce flashes; a flash_risk detector (te-flash@2) shows a seizure warning before hub games load.
- 12 overlapping steps; Ground size up to 8 tiles; own-art Astrologer preset.
- Feel tricks (16:43): blast-star is the 6th stock picture; Impact flash disc stays 3 tiles; hit-stop allowed in timed and RTS modes.

## Rules worth remembering
- Hit-stop is view-time only (never game clock, log or rules); freezes effect, attacker and victim equally; overlaps end at the latest end, capped 150ms past first start; reduced motion 0, Reduce flashes caps 50.
- New start mode at-hit (hit + start_at_ms), falls back to after-last with a warning.
- fade_out runs after the hold. Shockwave grows over max(150, len) ms. A blank hides only this effect's other steps.
