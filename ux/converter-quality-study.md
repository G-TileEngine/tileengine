# Imagine → pixel converter: quality study (r66b)

Status: **study only.** The live converter (`ui-shell/js/imagine-convert.js`) is unchanged. Everything here runs locally in a separate harness. Nothing is pushed or published. Date: 2026-11-12.
CEO direction (2026-11-12) replaces "house style vs faithful" with **input presets (target looks)** plus an **Analyse** step. The rendering work stays in.

## 1. What was built

| File | What it is |
|---|---|
| `ui-shell/study/convert-study.js` | All candidate code in plain JS: OKLab, median cut / k-means / Wu, 4 downscalers, feature + accent + eye protection, clean-up, selective and pixel-perfect outline, the 6 look renderers, Analyse, prompt tips. It has no DOM, so the same file runs in Node and in the browser. It loads the **live r66** key, crop and placement functions straight from `imagine-convert.js`, so every candidate starts from the same cut-out. |
| `ui-shell/study/run-study.js` | Node runner: `node study/run-study.js`. It writes 1× PNGs to `study/out/<sample>/` and the numbers to `study/out/study.json`. |
| `ui-shell/study/baseline_r66.py` | Playwright script that runs the **live r66** (defaults: Auto, reshade on) at 32 and 64 px. Writes `study/out/<sample>/r66-*.png` and `r66.json`. |
| `ui-shell/study/make_sheets.py` | Builds the comparison sheets: nearest-neighbour upscale, labelled with look or method and colour count. |
| `ui-shell/study/peek.py` | Zoom helper used during review. |

Evidence (all in `ui-shell/screenshots/`):
- `66b-overview.png`: per sample, r66 next to the look Analyse picks (★) and its runner-up, at 32 and 64 px.
- `66b-looks-{knight,knight-back,mage,ranger,fairy}.png`: source, r66 baseline, then all five looks (Game Boy and PICO-8 get separate columns), at 32 and 64 px.
- `66b-render-{…}.png`: the look-neutral rendering study. It compares downscalers, palette builders and ablations (feature protection off, black outline, clean-up off).
- (`66b-knight-picture-loaded.png` is an older r66 capture that happens to share the prefix. It is not part of this study.)

## 2. Headline findings

1. **r66 breaks the 16-colour rule.** After Sprite Studio adds shades and outline, r66 gives 32/31 colours (knight), 28/30 (knight back), 24/24 (mage) and 14/25 (fairy) at 32/64 px. Only the ranger stays under (13/13). Every study output is 16 or fewer, outline included. A final `capColours` safety net merges the two closest OKLab colours until the count is 16 or fewer. Only HD-2D needed it (2–3 merges).
2. **The quality problem is mostly rendering, not art style.** On the same input, the rendering fixes alone (OKLab 2-pass downscale, OKLab palette, protection, selective outline, clean-up) remove r66's main faults: orange and olive noise on the knight and ranger, the lost gem, muddy faces and stray specks. The look then decides the character of the result (flat, banded, chunky or limited).
3. **The art itself matters second.** Imagine's painterly shading and dense inner linework are what make 32 px hard. The prompt tips (§6) ask for flatter art, and the Analyse step picks the look that copes best with what came in.

## 3. Rendering study (look-neutral) — what won and why

Every variant in `66b-render-*.png` uses 15 palette colours. The outline is taken from those 15, or adds 1 colour when it is black.

| Stage | Tried | Result | Pick |
|---|---|---|---|
| Downscale | majority (r66 rule, OKLab bins) · area average · **k-centroid** (Astropulse; k-means per cell, dominant cluster) · **2-pass** (24-colour OKLab k-means over the whole subject, then each cell takes its most common palette colour) | Average is muddy and semi-transparent. K-centroid is sharp but noisy, and at 32 px dark hair "wins" the face cells. Majority is clean but splits colour families. **2-pass** gives the cleanest flat shapes and keeps the faces. | **2-pass** |
| Palette (≤16) | median cut · Wu (Graphics Gems II, run on an OKLab histogram, then 2 k-means passes) · k-means seeded by median cut. All use OKLab with a "dark boost" so hue counts more in shadows (navy ≠ black). | Median cut merges small distinct colours: the mage's blue gem disappears. Wu and k-means both keep it. K-means is slightly smoother; Wu is deterministic and faster on big inputs. | **k-means** (Wu as an Advanced option) |
| Feature protection | Signed local-contrast map (9×9) for dark details · accent map (hue/chroma outlier in a ~50 px window, not within 2 px of the background) · eye finder (dark blobs inside the largest skin blob in the top 35%) | With it, the gold trim, crest, belt and gem survive. Without it (`feat-off`) shapes are cleaner but the detail is lost. Dark features are ignored on the silhouette edge so they don't double the outline. Eyes are only placed when the face is 4 px or wider: at 32 px they would swallow the face. Result: eyes at 64 px on knight, mage and ranger (2 each) and fairy (1). None on the back view, which is correct. | **on**: threshold 30% of a cell at 32 px, 22% at 64 px; accents 10–15% |
| Outline | selective (darker, cooler palette colour of the touching part) · one black colour | Black is heavy and costs a colour. Selective reads like hand-made sprites. | **selective** |
| Clean-up | spurs (≤1 solid of 8 neighbours) · notches · orphans (pixel matches none of 8 neighbours, not a feature) · pixel-perfect outline corners (Aseprite-style L-corner removal) | `out-raw` shows the jaggies and doubled corners. Note: r66's 4-neighbour spur rule deleted diagonal swords and staffs. The 8-neighbour rule keeps them. | **on** |

Speed (Node, 512 px input): prepare 51–80 ms, each look about 60–75 ms. The browser should be similar, so it is fine for phones.

## 4. The target looks (input presets): settings

Shared front end: live r66 key/crop/placement → 2-pass OKLab downscale → protection (dark, accent, eyes) → look → clean-up → selective pixel-perfect outline → cap at 16 colours.

| Look | Groups × tones + lines | Settings | Character |
|---|---|---|---|
| **Cel / anime flat** | 6 hue groups × 2 tones + 4 line colours | Skin gets its own group. Tones split at the 40th lightness percentile of each group. Shadow is −ΔL and leans blue by 10°. One 3×3 mode-filter pass on groups. No top-left relight. | Flat fills with one shadow band. Clean on chibi and anime art. |
| **16-bit SNES/GBA** | 4 groups × 3 tones + 4 lines | Tones at the 30th/78th percentile of the art's own values, plus a **top-left light**: top/left part edges +1 tone, bottom/right −1. Ramps are hue-shifted (shadow 10° toward blue, light 8° toward yellow, chroma ×0.92). | Classic banded RPG sprite. Absorbs painterly gradients best. |
| **HD-2D lite (chunky)** | 5 × 3 + 1 line | Rendered at N/2, then each pixel becomes 2×2. A 1 px light rim on the top-left edges and a 1 px outline are drawn at full N, which gives the "hi-res light on low-res shapes" HD-2D cue. | Good at 64 px. At 32 px the effective grid is 16 px, which is too coarse (see sheets), so Analyse never picks it at 32. |
| **Game Boy 4-shade** | 4 fixed colours | Real DMG palette as used by the BGB emulator: `#081820 #346856 #88c070 #e0f8d0` ([Lospec: Nintendo Gameboy (BGB)](https://lospec.com/palette-list/nintendo-gameboy-bgb)). Darkest = outline, eyes and the darkest 8%. The other three split at the 30th/75th lightness percentile. | Readable silhouettes. Most detail goes. |
| **PICO-8 16** | ≤16 fixed colours | The real PICO-8 palette: `#000000 #1d2b53 #7e2553 #008751 #ab5236 #5f574f #c2c3c7 #fff1e8 #ff004d #ffa300 #ffec27 #00e436 #29adff #83769c #ff77a8 #ffccaa` (Lexaloffle; hex list from [Lospec: PICO-8](https://lospec.com/palette-list/pico-8)). Each cell gets a "punch" (L×0.85+0.12, chroma ×1.35; skin is not punched) and snaps to the nearest colour. Coloured cells may not snap to the greys. Dark features and the outline use the usual PICO-8 "one step darker" fade table. | Loud and toy-like. Ends at 8–12 colours. Hue jumps are possible (the olive ranger cloak becomes teal). |
| **Vector / flat** | 8 groups × 1 tone + 8 lines | No shading. Two 3×3 mode-filter passes. One line colour per group. | Poster-like flat shapes, closest to the silhouette. |

Colour counts (32 / 64 px, outline included):

| Sample | r66 | Cel | 16-bit | HD-2D | GB | PICO-8 | Vector |
|---|---|---|---|---|---|---|---|
| Knight | 32 / 31 | 16 / 16 | 15 / 16 | 16 / 16 | 4 / 4 | 11 / 11 | 16 / 16 |
| Knight back | 28 / 30 | 13 / 16 | 15 / 16 | 15 / 16 | 4 / 4 | 9 / 10 | 16 / 16 |
| Mage | 24 / 24 | 15 / 15 | 15 / 16 | 16 / 16 | 4 / 4 | 10 / 11 | 16 / 16 |
| Ranger | 13 / 13 | 14 / 15 | 14 / 15 | 15 / 15 | 4 / 4 | 8 / 9 | 16 / 16 |
| Fairy | 14 / 25 | 15 / 15 | 16 / 16 | 16 / 16 | 4 / 4 | 10 / 12 | 16 / 16 |

### CEO mage preset (66d, 2026-11-12)
This preset combines five render-study columns the CEO liked on `66b-render-mage`: k-means, black outline, median cut, 2-pass and no clean-up. It uses no look ramps (neutral, as in the render study) and a hard cap of 16 colours including the outline.

| Setting | Combo A ✓ (recommended) | Combo B |
|---|---|---|
| Downscale | 2-pass (24-colour OKLab k-means, then most common colour per cell) | same |
| Palette | **k-means** in OKLab, 15 colours (seeded by median cut) | **median cut**, 15 colours |
| Feature protection | on (as in the k-means / median / black columns) | on |
| Outline | **one near-black** (OKLab 0.16, 0.01, −0.03), +1 colour = 16 | same |
| Pixel-perfect corners | off | off |
| Clean-up (spurs, notches, orphans) | **off** | off |
| Harness id | `comboA` in `study/run-study.js` | `comboB` |

Colour counts (32 / 64): knight 16/16 · knight back 16/16 · mage 16/16 · ranger 14/16 · fairy 16/16 for A. B is the same except fairy 15/16.

On the mage, **A beats B**:
- **Face:** A keeps a pale face at both sizes. B's median cut merges the skin with the gold trim, so the face goes tan.
- **Hair:** A keeps the hair auburn-red, which is closer to the art than r66's brown.
- **Gem:** A keeps the gem blue. B's gem turns greyish lavender.

Against r66, A matches it on the face and beats it on the hair. On the staff, the wood and open head are as good as r66, but r66's gem still has the two blues and the white glint.

On the other samples, A gives bold, sticker-like sprites with clear silhouettes:
- **Ranger:** the cream bow is clearer than snes-new.
- **Knights:** the faces are readable.
- **Fairy:** clean and bright.

It costs the 16-bit banded shading and top-left light, the outline is heavier, and with clean-up off a few stray pixels are left (fairy wings, knight-back hair at 32). Evidence: `screenshots/66d-mage-combo.png` (full, head and staff at 32 and 64) and `screenshots/66d-combo-overview.png`.

## 5. Analyse step (plain JS): heuristics and picks

`analyse(P, N)` samples the keyed subject on a grid of about 256 px and measures:

| Metric | How | Reads as |
|---|---|---|
| flat | share of pixels with OKLab-L gradient < 0.002 | flat colour fills |
| gradient | share with gradient 0.002–0.02 | soft painted shading |
| edges | share with gradient > 0.06 | lines and hard edges |
| busy | share with \|L − local mean\| > 0.06 | texture and fine detail |
| glow | bright (L>0.86), coloured, brighter than surroundings | glow, sparkles, magic |
| chroma / saturated | mean OKLab chroma / share with chroma > 0.14 | colourfulness |
| effColours | smallest k in {4…24} where the k-means palette's mean error < 0.035 | real colour count |
| outline | share of the inner silhouette ring that is dark (L<0.32) | art already has an outline |
| aspect | subject height / width | chibi (< 1.6) vs tall proportions |
| painterly | gradient·1.1 + busy·0.8 − flat·0.6 | overall "painted-ness" |

Scores (highest wins; runner-up shown in the UI as the "also try" chip):
- Cel = 0.3 + 1.5·flat + 0.8·saturated + 0.3·outline − 0.4·painterly + 0.15 if chibi
- Vector = 0.2 + 1.8·flat − 1.2·edges − 0.6·painterly + 0.15 if ≤8 colours
- 16-bit = 0.5 + 0.6·painterly + 0.4·gradient − 0.3·flat + 0.1 if ≥12 colours
- HD-2D = 0.15 + 1.3·busy + 0.7·edges + 3·glow + 0.1 if ≥16 colours − 0.5 at 32 px
- PICO-8 = 0.2 + 1.2·saturated ± 0.15 (≤12 colours) − 0.4·painterly
- Game Boy = 0.1 + 0.45 if chroma < 0.06 + 0.1 if ≤10 colours − 0.8·saturated + 0.3·outline

**Picks on the 5 samples** (66b, the same at 32 and 64 px; the 64 px rules were updated in §10 from CEO rankings):

| Sample | Pick | Runner-up (32 / 64) | Plain-words reason shown |
|---|---|---|---|
| Knight | 16-bit | Cel / HD-2D | "Soft painted shading (32% smooth gradients, about 16 colours): three-step ramps turn the gradients into clean bands." |
| Knight back | 16-bit | Cel / Cel | "Soft painted shading (39% smooth gradients, about 10 colours)…" |
| Mage | 16-bit | HD-2D / HD-2D | "Soft painted shading (33% smooth gradients, about 16 colours)…" |
| Ranger | 16-bit | Game Boy / Game Boy | "Soft painted shading (46% smooth gradients, about 10 colours)…" |
| Fairy | Cel / anime flat | 16-bit / HD-2D | "Big flat colour areas (26% flat) and chibi proportions: anime-style flat colour with one shadow step keeps it clean." |

I agree with all five picks after looking at the sheets. Caveat: the weights were tuned on these same 5 samples, so this is a starting rule set, not a validated classifier. It needs 15–20 more Imagine pictures before it ships (see §8).

## 6. Imagine prompt tips per look (short UI help text)

| Look | Tip (copy as-is) |
|---|---|
| Cel / anime flat | "flat cel shading, bold dark outlines, two tones per colour, full body, plain magenta background" |
| 16-bit SNES/GBA | "16-bit RPG sprite style, simple shapes, clear light from top left, few colours, full body, plain magenta background" |
| HD-2D lite | "chunky low-res sprite, big readable shapes, simple face, soft light from top left, plain magenta background" |
| Game Boy | "high contrast, simple shapes, strong light and dark areas, no gradients, plain magenta background" |
| PICO-8 | "bright saturated colours, very simple shapes, big head, few colours, plain magenta background" |
| Vector / flat | "flat vector illustration, solid colour fills, no gradients, no texture, clean shapes, plain magenta background" |

Every tip ends with the CEO-locked magenta background. In the UI, put each tip under its look chip with a one-tap Copy.

## 7. Recommendation

**Pipeline (replaces r66's downscale, palette and render):** 2-pass OKLab downscale → feature, accent and eye protection → look renderer → clean-up (8-neighbour spurs, notches, orphans) → selective pixel-perfect outline → hard cap of 16 colours including outline.

**Basic (phone sheet, still ≤40%):**
- New **Look** row of chips: 16-bit · Cel · Vector · Game Boy · PICO-8 (HD-2D shows only at 64 px). Analyse pre-picks one, marks it "Best for this picture", and shows the one-line reason. The runner-up is a second highlighted chip.
- The size chip (32 default / 64) and the Auto ↔ My style chip stay. My style = snap the look's ramps to the locked style ramp, which is the same idea as r66's `toStyleRamp`.
- **Default look when Analyse is unsure** (top two scores within 0.05): **16-bit SNES/GBA**. It handles painterly Imagine art best, and it matches the existing hue-shifted 3-step ramps and parts model, so the hand-off to Sprite Studio is unchanged.
- Reshade toggle: remove it. The look decides the tones.

**Advanced:** palette builder (k-means / Wu / median cut) · downscale (2-pass / majority / k-centroid) · feature protection strength (off / normal / strong) · accent colours (0–3) · outline (selective / one dark / none) · pixel-perfect corners on/off · clean-up strength · per-look tone split slider.

**Effort:** wiring the look renderers and Analyse into `imagine-convert.js` takes about 1–1.5 rounds. Most of the code can be lifted from the harness: the functions are DOM-free and take `{w,h,d}`. The parts hand-off needs one change. Looks give "group × tone" directly, so `groupParts`/`buildRamps` become a straight mapping: group → part, tones → ramp (Cel uses 2 tones and fills the third; Vector uses 1). The fixed-palette looks hand over parts with locked colours. Another round goes on UI (look chips, prompt tips, Analyse line) plus phone captures.

**Risks:**
- Analyse is tuned on 5 samples.
- Accent detection can over-fire on gold-heavy art. The mage at 64 px gets a lot of gold, which could be tamed by lowering the accent cap to 2 colours.
- PICO-8 and Game Boy can shift hues: that is the nature of fixed palettes.
- HD-2D at 32 px is not usable.
- `capColours` merging can drop a rare colour on very colourful art. On the test set it only fired for HD-2D, where it merged 2–3 colours because the rim light and line colours overrun the budget. The fix is to budget HD-2D as 4 groups × 3 tones. No other look needed it.

## 8. Remaining limits (what this still can't do)

- At 32 px a face is 2–3 pixels wide: no eyes, by design. Eyes appear from 64 px. A "big head" prompt or 64 px is the fix.
- Thin diagonal weapons survive, but only as 1 px lines with gaps where the blade is narrower than half a cell.
- The 4 directions are still converted independently. Match-to-master (palette reuse) still applies, but looks don't yet guarantee identical group splits across directions.
- No anti-aliasing or dithering in any look. Smooth gradients become bands on purpose.
- Analyse can't see intent. A painterly picture the CEO wants flat still needs one tap on Cel or Vector.
- Next step before wiring: run the harness on 15–20 more Imagine pictures (including side views and monsters), re-tune the score weights, and lock the default look.

---

## 9. Update r66c (2026-11-12): 16-bit default, head/weapon borrow from r66

**CEO verdict on 66b:** 16-bit/SNES won on quality and conversion at both 32 and 64 px, so it is the default look. If he has to pick, snes-64 is better across the board. That makes snes-64 (and snes-32) **the baseline to protect**: fixes may only borrow r66's strengths (weapons, hair, faces) where that is a clear win. One exception: on the knight, the snes head is already better than r66 at 32, so it stays as it is.

**Evidence:** `ui-shell/screenshots/66c-crops-{mage,ranger,knight-back,fairy,knight}.png` show the head and weapon zoomed at 32 and 64 px. The columns are picture · r66 · snes-old (66b) · snes-new (66c) · v2 test (not adopted). `66c-overview.png` shows all 5 samples, r66 next to snes-new at 32 and 64, with colour counts.

### 9.1 Diagnosis: what r66 keeps that snes-old loses
I compared the raw 2-pass downscale with no look applied (`study/out/*/raw-*.png`) against each stage of the 16-bit look (`study/dbg-snes.js`). **The downscale is not the problem.** The raw 2-pass cells keep the open staff head, the two blues of the gem, the cream bow and a pale face. The losses happen in the look stage:

| What you see | Cause |
|---|---|
| **Staff and bow turn into dark blobs** (mage, ranger) | The 1–2 px shafts get the dark outline on **both** sides, plus dark-detail pixels, so the wood disappears between two near-black lines. The 1 px gaps inside the staff's loops get filled with outline. |
| **Bow wood goes brown, not cream** (ranger) | With only 4 colour groups of 3 tones, the cream wood is folded into the leather group and recoloured with that group's ramp. Its own colour never gets a palette slot. |
| **Gem loses its highlight** (mage) | The gem keeps a single accent colour with no light step, and the white glint pixel goes to the purple group. |
| **Face looks tan or gold, hair turns into dark maroon blobs** (mage) | The 66b skin rule also catches gold trim, so the "skin" ramp is a skin+gold mix and comes out tan. Auburn hair shares a group with the dark wood and boots and gets their shadow tone. r66 avoids this mainly by **spending more colours**: 24 on the mage, against our 16 cap. |
| Clean-up removing 1 px weapon pixels | Mostly already fixed in 66b: the spur rule uses 8 neighbours, so diagonal blades survive. The remaining loss was notch-filling closing open loops. |

### 9.2 What changed: snes-new = snes-old + a borrow step (`borrow: true`)
Everything outside the weapon zones is **the 66b algorithm, unchanged**. `look-snesOld` reproduces the 66b PNGs pixel-for-pixel; I checked all 10 sprites.
1. **Weapon zones:** a thin mask (a 1–2 px run in a sparse 5×5 area), grown by 2 cells so the staff head and bow grip come along.
2. In those zones, a cell whose banded colour is clearly wrong (OKLab ΔE² > 0.006) takes the nearest palette colour. It only does so if that colour is much closer (under 60% of the error) and close in absolute terms (ΔE² < 0.008).
3. **Spare slots become detail colours** (for example the ranger's cream wood): up to 16 total, picked farthest-first, and each one must serve at least 2 zone cells. If a sprite has fewer than 2 spare slots, up to 2 near-twin colours (ΔE < 0.04) may be merged to make room. Face colours are never merged, and a merge is undone if no detail colour ends up using the slot.
4. **Shaft outline:** a ring pixel that touches only shaft cells is drawn on the outer (right/bottom) side only, in the line colour. 1 px gaps inside the sprite (staff loops, between legs) stay open.
5. Clean-up protects zone and thin cells, and notch-fill respects source coverage (cells under 20% are not filled).
6. **Heads are restored pixel-for-pixel from 66b** (weapon cells excluded). This keeps the knight head the CEO prefers, and it means no head can get worse.

**How much changed vs snes-old (pixels changed / solid pixels):** knight 27/339 (32), 46/1181 (64) · knight back 25/329, 34/1167 · mage 38/406, 63/1498 · ranger 28/369, 30/1397 · fairy 12/480, 35/1837. Every change is in a weapon zone or its outline.

**Colour counts, outline included (32 / 64):**

| Sample | r66 | snes-old (66b) | snes-new (66c) | v2 test |
|---|---|---|---|---|
| Knight | 32 / 31 | 15 / 16 | 15 / 16 | 14 / 16 |
| Knight back | 28 / 30 | 15 / 16 | 15 / 16 | 14 / 15 |
| Mage | 24 / 24 | 15 / 16 | 16 / 16 | 14 / 16 |
| Ranger | 13 / 13 | 14 / 15 | 15 / 15 | 9 / 13 |
| Fairy | 14 / 25 | 16 / 16 | 16 / 16 | 15 / 16 |

### 9.3 Result vs r66, honestly
- **Weapons: clear wins.**
  - Ranger bow at 32 is now a cream wood line with a dark edge, as readable as r66 and without r66's orange. At 64 there is a small gain.
  - Mage staff at 64: the open head and the white gem glint are back, and the shaft is lighter. At 32 the staff head is lighter.
  - Knight and knight-back swords are cleaner 1 px diagonals with a light blade.
  - The fairy wand is about unchanged.
- **Heads: unchanged from 66b, by design.** The knight keeps its 66b head, as asked. On the **mage**, r66 still has the better face (pale) and hair (auburn) at both sizes, and on the **ranger and fairy** the heads are about even. Inside 16 colours this can't be fixed without restructuring the palette, which changes the whole sprite:
  - **v2 test** (`snesV2`, last column of the crop sheets) rebuilds the budget per material: skin separated from gold (hue 30–72°), up to 8 materials, tones by area, the dark material reused as outline, plus detail slots.
  - v2 does give a paler mage face and redder hair, a cream bow and an open staff, but it recolours the robes, trim and armour. That breaks "snes-64 must not get worse anywhere", so it is **not adopted**. It is kept as a candidate if the CEO wants heads above everything else.
- **Rejected along the way:** cutting outline colours from 4 to 2 to free slots. It recoloured outlines everywhere (ranger: 253 px changed).

## 10. Analyse: CEO-ranked rules and test table (2026-11-12)

New rules, applied at **64 px only**. The 32 px scores are exactly as in §5.
- **16-bit default:** +0.3 to 16-bit at 64 px ("16-bit at 64 is superior across the board").
- **Bright chibi → PICO-8:** saturated share ≥ 30% and height/width < 1.6 → PICO-8 scores just above 16-bit, with 16-bit as runner-up.
- **Warrior → Vector second:** plate metal (light, near-grey pixels, L 0.55–0.92, chroma < 0.035) ≥ 10% of the subject, and edges ≥ 12% → Vector just under 16-bit, so it becomes the runner-up. It never overrides 16-bit as the default. The reason line adds: "Armoured and hard-edged, so the flat Vector look is a strong second choice."

Measured: knight metal 21% / edges 24%, knight back 19% / 13% → warrior. Mage 1%, ranger 0.5%, fairy 4% → not warrior. Fairy saturated 37%, aspect 1.43 → bright chibi.

**CEO-ranked test table (64 px) — Analyse is checked against this:**

| # | CEO ranking | Analyse at 64 (pick → runner-up) | Match |
|---|---|---|---|
| 1 | Fairy: PICO-8 is the favourite | PICO-8 → 16-bit | ✅ |
| 2 | Fairy: 16-bit a close second | runner-up 16-bit | ✅ |
| 3 | Knight: Vector (or 16-bit) | 16-bit → Vector | ✅ |
| 4 | Knight back: warrior, so 16-bit or Vector | 16-bit → Vector | ✅ |
| 5 | Mage: 16-bit (superior overall) | 16-bit → HD-2D | ✅ |
| 6 | Ranger: 16-bit (superior overall) | 16-bit → Game Boy | ✅ |
| 7 | Warrior rule must not change 32 px | knight 32: 16-bit → Cel (as in 66b) | ✅ |

**7 of 7 match.** Rows 4–6 come from "16-bit at 64 is superior across the board" rather than a separate ranking per sample.

Still open at 32 px: Analyse picks Cel for the fairy at 32 (16-bit is the runner-up). The CEO's overall "16-bit won at 32 too" suggests 16-bit there as well, but he has not ranked the fairy at 32. I left 32 px unchanged as instructed; it is a one-line change if he confirms.

## 11. Update 66e (2026-11-12): raised colour budget, head/weapon-budget hybrid
The CEO's verdict on the mage crops was "r66-now (24 colours) is the best one there", for the face, hair and staff. He also said that r66 struggles with the **robes**, and that Combo A is "a close second on the mage and the best overall in general". So **Combo A is the leading general pipeline**, and the target is a hybrid: **Combo A body and robes, with r66-level head and weapon**.

**What was tested.** Everything stays in the study harness. `imagine-convert.js` is untouched. Every cap includes the outline.
- **Plain raised cap:** snes-new and Combo A at 20 and 24.
  - For snes-new, every 4 extra colours buy one more hue group. Line and detail budgets grow, and the 66b head restore runs at the same cap.
  - For Combo A, the k-means palette gets cap − 1 colours plus the black outline. The 2-pass first-pass palette grows to cap + 8.
- **A+head** (`hybridLook`, base Combo A): the 16-colour Combo A body is kept. The head box is re-read with r66's majority downscale, and cap − 16 head-only colours are added.
- **A+r66 H&W** (`hybridLook` with `ref` = r66 pixels): the 16-colour Combo A body and robes are kept. The **head region** and the **weapon region** take r66's own pixels (same grid and silhouette, IoU 1.0 on all 10 renders). These pixels are re-palettised into cap − 16 extra slots. The weapon gets up to half of the slots first, then the head, and any slots the head doesn't use go back to the weapon.
  - The weapon region is the thin-line cells (shafts, bowstrings, blades) grown by 2, which covers the staff head, gem and grip.
  - The head region is the face box grown, as in the 66c `headRect`.
  - **Noise gate:** an r66 pixel much more saturated than the art under it, and off-hue by more than 25°, is not taken. This drops the orange speck on the ranger's bow. A brighter blue on the blue gem is kept.
  - **Armoured sprites keep their head** (same rule as Analyse's warrior test: plate metal ≥ 10% and edges ≥ 12%). The knight's face is never replaced by r66's orange-speckled one. Its sword still gets the weapon budget.
- **snes+head:** the same head re-read on snes-new @16, kept for reference.

Colour counts (32 / 64 px, outline included, hard cap respected):

| Sample | r66 | Combo A @16 | **A+r66 H&W @20** | **A+r66 H&W @24** | A+head @24 | Combo A @20 | Combo A @24 | snes-new @16 | snes-new @20 | snes-new @24 | snes+head @24 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Knight | 32 / 31 | 16 / 16 | 19 / 20 | 19 / 20 | 19 / 18 | 20 / 20 | 23 / 24 | 15 / 16 | 19 / 20 | 23 / 24 | 17 / 19 |
| Knight back | 28 / 30 | 16 / 16 | 17 / 18 | 17 / 18 | 17 / 17 | 20 / 20 | 20 / 24 | 15 / 16 | 19 / 20 | 21 / 24 | 16 / 18 |
| Mage | 24 / 24 | 16 / 16 | 20 / 20 | 23 / 24 | 19 / 24 | 20 / 20 | 23 / 24 | 16 / 16 | 20 / 20 | 24 / 23 | 23 / 22 |
| Ranger | 13 / 13 | 14 / 16 | 17 / 20 | 17 / 20 | 14 / 16 | 17 / 20 | 20 / 24 | 15 / 15 | 18 / 19 | 18 / 21 | 15 / 19 |
| Fairy | 14 / 25 | 16 / 16 | 19 / 20 | 19 / 20 | 16 / 17 | 20 / 20 | 23 / 24 | 16 / 16 | 20 / 20 | 24 / 24 | 18 / 21 |

**Findings on the mage** (`screenshots/66e-mage-24c.png`, with full, head, staff and robe crops at 32 and 64):
- **Just raising the cap doesn't get there.**
  - snes-new @20 and @24 still has the tan/gold face. Its head is restored from the banded 66b render, and the extra slots go to more hue groups and dark-red specks in the robes.
  - Combo A @24 keeps its pale face and red hair, as at 16. But the staff stays at one blue at 64, with dark wood and no glint.
  - The 16-colour cap isn't what loses the face. The cause is how each pipeline spends its colours.
- **A+head** changes very little, because Combo A's head is already close to the art.
- **A+r66 H&W @24 matches r66 on the face, hair and gem**: pale face, framed hair, two blues and the white glint, lighter wood. It **beats r66 on the robes**, keeping Combo A's gold trim and folds instead of r66's flat purple with white chunks. @20 is nearly as good: the gem keeps two blues and the glint at both sizes, with slightly fewer wood tones at 64.

**Other samples** (`screenshots/66e-overview-24c.png`):
- **Knight and knight back:** the head is unchanged, with no orange noise, and the sword gets r66's tones. They look clean.
- **Ranger:** the bow is clearer with r66's cream tones, and the orange speck is gated out. At 64 the hood takes r66's olive tint next to Combo A's green cloak, which leaves a faint seam.
- **Fairy:** the head takes r66's flatter, paler pinks. It's fine at 32, slightly flatter than Combo A at 64.
- **Raising the cap alone** hurts nothing badly. snes-new @24 adds specks, and Combo A @24 adds speckle on the fairy.

**Trade-offs of the hybrid**
- It needs r66's render as a second pass. Both are local plain JS, and r66 is already in `imagine-convert.js`, but the work per conversion roughly doubles.
- The harness reads r66's captured pixels. A real build would call r66's functions directly.
- There's a possible seam where r66's head colours meet Combo A's body: the ranger's hood, and the mage's hair below the head box (r66 brown above, Combo A red below).

**Recommendation:** keep **16 colours as the style default** (Combo A @16). Add a **"Detailed (24)" option** that runs A+r66 H&W with a 24-colour cap. It only uses the extra slots it needs: 17–24 on the samples, and 23/24 on the mage. If a lower ceiling is preferred, 20 keeps nearly all of the mage gain.

## CEO picks log (2026-11-12, via CoS), the ground truth for r67 defaults and Analyse
- Warrior/knight: Vector at 64.
- Fairy: PICO-8 at 64, then 16-bit at 64.
- Overall: 16-bit at 64 is superior across the board.
- Mage (from the 66b-render-mage columns): k-means palette, black outline, median cut, 2-pass downscale, no clean-up. k-means and median cut are both palette methods, so I asked the CEO which one wins. The 66d combo renders both.
- Mage, 66d/66e: "r66-now (24 colours) is the best one there" on face, hair and staff; r66 struggles with the robes. "Combo A (k-means) is a close second on the mage and the best overall in general", so Combo A leads the general pipeline. Target: Combo A body and robes + r66-level head and weapon (66e A+r66 H&W).
- **r67 decision (pt85u):** "These three were the best. And okay we will do your method": Combo A@16, A+r66 H&W@20, A+r66 H&W@24. Built into the real converter: Crisp (Combo A) at 16 is the default look; Basic **Detail** chips Standard 16 / Detailed 20 / Extra detailed 24 run the A+r66 head-and-weapon hybrid live (armoured sprites keep their head, noise gate on). The other looks stay as chips. Analyse suggests Crisp as the general choice.

## 12. r67: Analyse with Crisp as the general choice (2026-11-12)
Engine now lives in `ui-shell/js/convert-engine.js` (this study's `convert-study.js` re-exports it). `analyse()` returns `pick`/`second` (the suggestion, Crisp included) and `lookPick`/`lookSecond` (the §5/§10 look scores, unchanged). Rule: the suggestion is Crisp, with the best-scoring look as runner-up, except a bright chibi at 64 → PICO-8 then 16-bit; a warrior at 64 → Crisp then Vector. Check: `node study/analyse-table.js` → `study/out/analyse-r67.json`.

| # | CEO ranking | r67 suggestion at 64 (pick → runner-up) | Match |
|---|---|---|---|
| 1 | Fairy: PICO-8 is the favourite | PICO-8 → 16-bit | ✅ |
| 2 | Fairy: 16-bit a close second | runner-up 16-bit | ✅ |
| 3 | Knight: Vector strong | Crisp → Vector | ✅ |
| 4 | Knight back: warrior, Vector strong | Crisp → Vector | ✅ |
| 5 | Mage: general choice Combo A | Crisp → 16-bit | ✅ |
| 6 | Ranger: general choice Combo A | Crisp → 16-bit | ✅ |
| 7 | Warrior rule must not change 32 px | knight 32: look scores 16-bit → Cel; suggestion Crisp → 16-bit (no Vector) | ✅ |

**7 of 7** against this table. Against the old §10 literal table, rows 3–6 change: they suggested 16-bit, now Crisp (16-bit or Vector as runner-up), following the CEO's "Combo A … best overall in general". The look scores themselves are unchanged (`lookPick` is still 16-bit for rows 3–6). At 32 the fairy now gets Crisp → Cel.
