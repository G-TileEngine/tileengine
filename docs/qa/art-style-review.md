# QA: docs/maker/art-style.md draft review (ART0, decision 5)

Reviewer: QA & Build Guard. Date: 2026-11-27.
Draft: /workspace/share/maker-look/art0/art-style.md, sha256 0674d1ea38bd95cbb1406a53e7beec6ee8f8c36a1f26a3f1b0639fb73976138c, 77 lines. Main 97657844.

**Verdict: NOT OK yet. Three fixes are needed.** Everything else checks out.

## Fixes
1. **L15, the tile size cite is wrong.** The plan (docs/maker/ux/maker-overhaul-plan.md) says F3a does it: L76 has "tiles are 32 px from `map.tile`" with no visible change, and L123 has "Test draws 16 px today, which F3a changes". F3b only brings the pack in (L77), and DSK rules `map.tile` before the F3b guide (L155). The draft says "F3b sets `map.tile`; F3a keeps 16 until then". It should say F3a moves the map and Test to 32 px from `map.tile`, and that Test draws 16 px until then.
2. **L4, an attribution problem.** "We build on it now and swap in better art later" is recorded as the CEO's ruling. In the CoS chat, the CEO typed that r6b is the best so far, still needs iterations and is a good baseline. He then *asked* whether implementing now and adding the better version later was an option. CoS recommended implementing now. The CEO's typed "Yes" answered CoS's method question (port the Python script versus the three older options). Either label "implement now, swap later" as CoS's recommendation in answer to the CEO's question, or get the CEO to confirm it through CoS.
3. **L11, the sprite count.** `b-r6b-sprites/manifest.json` has 30 sprites: 26 props plus 4 units (knight-01, knight-02, boy and farmer). The README's "26 props" is correct for props, but the line should say 26 props and 4 units.

## Checked and correct
- **Evidence hashes:**
  - b-r6b SHA256SUMS 69e57b61, README 1c2f902f.
  - b-r6b-rain SHA256SUMS db395384, README 94afafbd.
  - sprites README 485ddec3, manifest 7187b351.
  - All three folders pass `sha256sum -c`.
- **Code cites:**
  - `LIGHT` is in common.py L9 (sun from the top-left).
  - hash2, vnoise, fbm, ramp_lerp, ramp_q, sphere and outline_masks are in common.py.
  - shadow_mask is in engine.py L16.
  - `R` is in b-r2/style_b2.py L12. b-r3/stamps.py and b-r3b/stamps2.py exist. b-r6b/style_b6b.py carries the chimney rebuild.
- **§5 tolerance:** b-r6b-sprites/README L13 says within 2 levels, 0 px off by more than 2. Half-to-even versus half-up rounding is at README L37.
- **project-format §6.2.5 `ramps` (L832):** six terrain keys (grass, dirt, stone, rock, water, bloom), plus the optional fire, frost, holy and venom effect keys (CN-019, accepted).
- **MIN_CELL_CSS = 44:** tools/play-stage/board.ts L66.
- **Blend:** core-types L357, `Blend = "normal" | "add"`, so the multiply note is right.
- **Ids:** decision 5 and M1/M2/M3 match plan (f) 5 and L128–L130. ART1a, ART1b and ART2 match L73–L75. `tools/art-bake/` doesn't exist on main yet, which fits the plan.
- **The void M3 card:** CoS's correction records that the CEO said he did not pick M3.

## Carries (non-blocking)
- **Plan drift.** Plan (f) 5 (L109) still lists decision 5 as open between M1, M2 and M3. L73 and L147–L150 still size ART1a for M1. CoS or UX should amend the plan when this doc lands. The EA re-sizes ART1a.
- **Ramp mapping (L37).** The doc says B's ~30 material ramps "map onto" the six §6.2.5 terrain keys, but doesn't give the mapping (which ramps are dirt, rock and bloom, and what happens to bank). ART1a or DSK should name it.
- **Multiply blend (L56).** Adding multiply to `Blend` is a core-types and format change, so it goes through a CN to DSK, not the bake step.
- **Avoid F1's kit gap.** The §5 port check compares against Python sources and checkpoint PNGs that live only on the box. Before the ART1a go-line, the Python recipes and the checkpoint references (or their hashes plus a pushed copy) must be readable by the builder in the repo or the kit. The kit has to carry every byte it is compared against.
