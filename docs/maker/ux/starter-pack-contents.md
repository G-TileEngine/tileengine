# TileEngine free Starter Pack: contents (draft v1, 2026-11-11)
Hub listing: **0 gold · Free · Made by TileEngine**, licence line "Made by TileEngine · free to use" (commercial use OK). Everything is editable recipes (Sprite Studio parts and rules), so it can be recoloured, re-posed and upgraded. Style: CEO default (1px dark-hue outline, 3-step hue-shifted shading, light from top left, ≤16 colours per sprite, hard edges, glows from the FX layer). Night is a scene tint, and night skins are optional.

Sources: **code-drawn** = generated in-engine from parts/rules (like r63 heroes and `Experience` thumbs); **Kenney CC0 ref** = Kenney CC0 sets used as layout and proportion reference only (redrawn in our style, credited in credits file); **team-made** = drawn or composed by the team (or BTF assets the CEO clears for reuse).

| Group | What | Rough count | Source | Owner |
|---|---|---|---|---|
| Heroes | 32×32, 4 dirs × 4 walk frames each; classic/sturdy/small bodies × hair/outfit/weapon presets (knight, mage, archer, rogue, cleric, brawler, ranger, bard) | 8 | code-drawn (r63 parts) | TBD |
| Enemies | slimes, bats, skeletons, wolves, goblins, acolyte guards; each with 2-3 recolour variants (P2 status recolours) | 10 (+~20 variants) | code-drawn shapes + team-made detail | TBD |
| Bosses | 1 tall (32×64) boss, 1 big (64×64) boss, e.g. orb-fused horror (BTF-style) | 2 | team-made | TBD |
| NPCs | villager, merchant, quest-giver, guard, child, elder (idle + walk) | 6 | code-drawn (hero parts) | TBD |
| Items / loot | potion, draught, key, coin, gem, chest, sword, bow, staff, shield, scroll, herb, orb, bomb, heart pickup | 15 | code-drawn (item template) | TBD |
| Tiles / terrain: Ashroad | day set: floor, path, grass, ash, wall, wall edges, water, bridge, cliff edge, autotile corners | ~24 | code-drawn (P3) from btf-ashroad palette | TBD |
| Tiles / terrain: Moonlit | night set, same layout as Ashroad, Moonlit palette + night tint preview | ~24 | code-drawn (P3) from btf-moonlit palette | TBD |
| Props / buildings | trees, rocks, fences, signs, barrels, crates, torches, well, house, shop, tower, gate | ~16 | Kenney CC0 ref, redrawn; code-drawn where simple | TBD |
| Effects / projectiles | hit burst, slash, heal sparkle, poison cloud, fire, ice, gust frames, tide frames, plain arrow, poison-pierce arrow, magic orb, level-up | 12 | code-drawn (Effect Designer) | TBD |
| UI: icons | heart, coin, sword, shield, boot, star, lock, gear, map, bag, skull, clock | ~24 | Kenney CC0 ref, redrawn | TBD |
| UI: frames + buttons | dialog box, panel, button (normal/pressed), tab, tooltip-free label, card frame (BTF plates: hp, dmg, venom) | ~10 | team-made | TBD |
| UI: health bars | hp, mana, xp, boss bar; plate tints for status | 4 (+tints) | code-drawn | TBD |
| Portraits | 64×64 busts for the 8 heroes + 6 NPCs, generated from the same parts | 14 | code-drawn (parts → bust) | TBD |
| Sounds: SFX | step, hit, crit, miss, coin, pickup, door, menu move/confirm/back, heal, poison, arrow, spell, level-up, win, lose, unlock, error, splash | 20 | Kenney CC0 audio ref or CC0 direct; team-made where needed | TBD |
| Music | town theme, battle loop, victory sting | 3 | team-made | TBD |
| Starter behaviours | pick-a-role presets: Melee, Archer, Healer, Guard, Wanderer (+ "When it dies": drop loot) | 5 | Behaviour Librarian catalogue | TBD (Librarian) |
| Sample stage | one playable stage, Tiny Tactics-style 6×9 on Ashroad: 2 heroes vs 3 enemies, 1 chest, 1 win rule (defeat all), music + SFX wired | 1 | team-made in-engine | TBD (Architect) |

**Notes**
- The prototype (r64) only shows previews; the counts above are targets to agree with the Engine Architect (sample stage, tiles), the Behaviour Librarian (roles) and the Data & Save Keeper (pack id `tileengine-starter-pack@1`, library format).
- "Make some for me" draws from the same parts, so a generated set and the pack never clash in style.
- Every item carries credits. Kenney references are CC0, and we credit them anyway.
